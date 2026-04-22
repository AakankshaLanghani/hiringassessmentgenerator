"""
ai_service.py
Parallel-batch approach: split N questions into batches of BATCH_SIZE,
fire all batches concurrently via ThreadPoolExecutor, then merge & group.
- Each batch finishes in ~5-10 s → total time stays ~8-12 s regardless of N
- gpt-4o-mini: cheap (~$0.0004 per 5 questions) and fast
"""

import json
import math
import re
import concurrent.futures
from collections import defaultdict
from typing import Any

import openai

from config import OPENAI_API_KEY, OPENAI_MODEL, REQUEST_TIMEOUT
from schemas.models import GenerateResponse

DOMAINS = [
    "Logical Reasoning",
    "Analytical Thinking",
    "Role-Based Knowledge",
    "Situational Judgment",
]

BATCH_SIZE = 5          # questions per parallel OpenAI call
BATCH_TIMEOUT = 60      # seconds per individual batch call


def _get_client() -> openai.OpenAI:
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is not set.")
    return openai.OpenAI(api_key=OPENAI_API_KEY, timeout=BATCH_TIMEOUT)


# ── Batch prompt ──────────────────────────────────────────────────────────────

def _build_batch_prompt(jd: str, batch_size: int, difficulty: str, domain_hint: list[str]) -> str:
    difficulty_guidance = {
        "easy":   "easy (junior-level, concept-checking)",
        "medium": "medium (practical, some experience needed)",
        "hard":   "hard (expert-level, edge cases)",
        "mixed":  "mixed (vary easy/medium/hard)",
    }.get(difficulty, "mixed")

    domain_str = ", ".join(domain_hint)

    return (
        f'Return a JSON object with one key "questions" containing EXACTLY {batch_size} items.\n\n'
        f"Job description:\n{jd[:1500]}\n\n"
        f"Assign questions to these domains (distribute evenly): {domain_str}\n"
        f"Difficulty: {difficulty_guidance}\n\n"
        "Each item must have: domain, question, options (object with A/B/C/D keys), "
        "correct_answer (A/B/C/D), explanation (ONE sentence).\n"
        f"Return exactly {batch_size} items. JSON only, no markdown."
    )


# ── Single batch call ─────────────────────────────────────────────────────────

def _generate_batch(client: openai.OpenAI, jd: str, batch_size: int,
                    difficulty: str, domain_hint: list[str]) -> list:
    prompt = _build_batch_prompt(jd, batch_size, difficulty, domain_hint)
    max_tokens = min(2048, batch_size * 160 + 200)

    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "Respond with valid JSON only — no markdown, no extra text."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=max_tokens,
            response_format={"type": "json_object"},
        )
    except openai.APITimeoutError:
        raise TimeoutError(f"Batch timed out after {BATCH_TIMEOUT}s. Please try again.")
    except openai.AuthenticationError:
        raise ValueError("Invalid OpenAI API key.")
    except openai.RateLimitError:
        raise RuntimeError("OpenAI rate limit reached. Please try again shortly.")
    except openai.OpenAIError as e:
        raise RuntimeError(f"OpenAI error: {str(e)}")

    raw = response.choices[0].message.content or ""
    raw = re.sub(r"```(?:json)?", "", raw).strip()

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"Batch returned invalid JSON: {e}")

    questions = data.get("questions", [])
    if not isinstance(questions, list):
        raise ValueError("Batch response missing 'questions' list.")
    return questions


# ── Domain hints: spread domains across batches ───────────────────────────────

def _domain_hints_for_batches(num_batches: int) -> list[list[str]]:
    """
    Rotate which domains each batch focuses on so the full set gets covered.
    E.g. 2 batches → batch0=[LR, AT], batch1=[RK, SJ]
         3 batches → batch0=[LR, AT], batch1=[RK, SJ], batch2=[LR, RK]
    """
    hints = []
    for i in range(num_batches):
        # Pick 2 domains in round-robin order (ensures variety between batches)
        start = (i * 2) % len(DOMAINS)
        hint = [DOMAINS[start], DOMAINS[(start + 1) % len(DOMAINS)],
                DOMAINS[(start + 2) % len(DOMAINS)], DOMAINS[(start + 3) % len(DOMAINS)]]
        hints.append(hint)
    return hints


# ── Main entry point ──────────────────────────────────────────────────────────

def generate_mcqs(jd: str, num_questions: int, difficulty: str) -> GenerateResponse:
    client = _get_client()

    # Split N into batches of BATCH_SIZE
    num_batches = math.ceil(num_questions / BATCH_SIZE)
    batch_sizes: list[int] = []
    remaining = num_questions
    for _ in range(num_batches):
        size = min(BATCH_SIZE, remaining)
        batch_sizes.append(size)
        remaining -= size

    domain_hints = _domain_hints_for_batches(num_batches)

    # Fire all batches in parallel
    all_questions: list = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=num_batches) as executor:
        futures = {
            executor.submit(
                _generate_batch, client, jd, batch_sizes[i], difficulty, domain_hints[i]
            ): i
            for i in range(num_batches)
        }
        for future in concurrent.futures.as_completed(futures):
            try:
                questions = future.result()
                all_questions.extend(questions)
            except Exception as e:
                raise RuntimeError(f"Batch failed: {e}")

    # Merge all questions and group by domain
    merged_raw = json.dumps({"questions": all_questions})
    return _parse_and_group(merged_raw)


# ── Parse & group by domain ───────────────────────────────────────────────────

def _parse_and_group(raw: str) -> GenerateResponse:
    raw = re.sub(r"```(?:json)?", "", raw).strip()

    try:
        data: Any = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse AI response as JSON: {e}")

    if "questions" in data:
        flat_questions = data["questions"]
    elif "sections" in data:
        flat_questions = []
        for sec in data["sections"]:
            domain = sec.get("domain", "Role-Based Knowledge")
            for q in sec.get("questions", []):
                q["domain"] = domain
                flat_questions.append(q)
    else:
        raise ValueError("AI response missing 'questions' or 'sections' key.")

    if not isinstance(flat_questions, list) or len(flat_questions) == 0:
        raise ValueError("AI returned an empty question list.")

    grouped: dict = defaultdict(list)
    valid_domains = set(DOMAINS)

    for q in flat_questions:
        domain = q.get("domain", "Role-Based Knowledge")
        if domain not in valid_domains:
            domain = "Role-Based Knowledge"
        grouped[domain].append({
            "question":       q.get("question") or q.get("text", ""),
            "options":        q.get("options", {}),
            "correct_answer": q.get("correct_answer", "A"),
            "explanation":    q.get("explanation", ""),
        })

    sections_data = [
        {"domain": domain, "questions": grouped[domain]}
        for domain in DOMAINS
        if grouped.get(domain)
    ]

    try:
        return GenerateResponse(**{"sections": sections_data})
    except Exception as e:
        raise ValueError(f"Failed to build response: {e}")
