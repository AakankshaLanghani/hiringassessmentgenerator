// ── Types (frontend-native shape) ─────────────────────────────────────────

export interface GenerateRequest {
  jd: string;
  num_questions: number;
  difficulty: string;
}

export interface QuestionOption {
  label: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
  correct_answer: string;
  explanation?: string;
}

export interface QuestionSection {
  section: string;
  questions: Question[];
}

export interface GenerateResponse {
  sections: QuestionSection[];
  total_questions: number;
  generated_at: string;
}

// ── Backend raw types ──────────────────────────────────────────────────────

interface BackendOptions { A: string; B: string; C: string; D: string; }
interface BackendQuestion {
  question: string;
  options: BackendOptions;
  correct_answer: "A" | "B" | "C" | "D";
  explanation: string;
}
interface BackendSection { domain: string; questions: BackendQuestion[]; }
interface BackendResponse { sections: BackendSection[]; }

// ── Response transformer ───────────────────────────────────────────────────

function transformResponse(raw: BackendResponse): GenerateResponse {
  let qId = 1;
  const sections: QuestionSection[] = raw.sections.map((sec) => ({
    section: sec.domain,
    questions: sec.questions.map((q) => ({
      id: qId++,
      text: q.question,
      options: (["A", "B", "C", "D"] as const).map((letter) => ({
        label: letter,
        text: q.options[letter],
      })),
      correct_answer: q.correct_answer,
      explanation: q.explanation,
    })),
  }));
  return {
    sections,
    total_questions: sections.reduce((acc, s) => acc + s.questions.length, 0),
    generated_at: new Date().toISOString(),
  };
}

// ── Error class ────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

// ── API config ─────────────────────────────────────────────────────────────

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:7860").replace(/\/$/, "");

// ── generateAssessment — calls real FastAPI backend ────────────────────────

export async function generateAssessment(
  payload: GenerateRequest
): Promise<GenerateResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jd: payload.jd,
        num_questions: payload.num_questions,
        difficulty: payload.difficulty.toLowerCase(),
      }),
    });
  } catch {
    throw new ApiError(
      `Cannot reach the backend at ${API_BASE_URL}. ` +
        "Make sure the FastAPI server is running: cd backend && python main.py"
    );
  }

  if (!response.ok) {
    let errorMessage = `Server error (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.error || errorMessage;
    } catch { /* ignore */ }
    throw new ApiError(errorMessage, response.status);
  }

  const raw: BackendResponse = await response.json();
  return transformResponse(raw);
}

// ── generateMockAssessment — explicit demo mode only ──────────────────────

export function generateMockAssessment(
  payload: GenerateRequest
): Promise<GenerateResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const base = Math.floor(payload.num_questions / 4);
      const rem = payload.num_questions % 4;

      const mockData: Record<string, Array<Omit<Question, "id">>> = {
        "Logical Reasoning": [
          { text: "A project has 3 phases. Phase 2 starts only after Phase 1. Phase 3 requires both. Which order is valid?", options: [{ label: "A", text: "Phase 3 → Phase 1 → Phase 2" },{ label: "B", text: "Phase 1 → Phase 3 → Phase 2" },{ label: "C", text: "Phase 1 → Phase 2 → Phase 3" },{ label: "D", text: "Phase 2 → Phase 1 → Phase 3" }], correct_answer: "C", explanation: "Phase 1 first, then Phase 2, then Phase 3." },
          { text: "All certified staff passed the exam. Maria passed. What follows?", options: [{ label: "A", text: "Maria is certified" },{ label: "B", text: "Maria may or may not be certified" },{ label: "C", text: "Maria failed other requirements" },{ label: "D", text: "Passing the exam always certifies" }], correct_answer: "B", explanation: "Passing is necessary but may not be sufficient." },
          { text: "Of 10 staff, 6 work remotely and 5 are senior. Minimum senior remote workers?", options: [{ label: "A", text: "0" },{ label: "B", text: "1" },{ label: "C", text: "5" },{ label: "D", text: "6" }], correct_answer: "B", explanation: "6+5=11>10, so at least 1 overlap." },
          { text: "All A are B. Some B are C. What must be true?", options: [{ label: "A", text: "All A are C" },{ label: "B", text: "Some A are C" },{ label: "C", text: "No A are C" },{ label: "D", text: "Cannot be determined" }], correct_answer: "D", explanation: "Not enough info to determine if any A overlap with C." },
          { text: "Train A departs 9:00 AM, takes 2.5h. Train B departs 10:00 AM, takes 1.5h. Which arrives first?", options: [{ label: "A", text: "Train A" },{ label: "B", text: "Train B" },{ label: "C", text: "Same time" },{ label: "D", text: "Cannot be determined" }], correct_answer: "C", explanation: "Both arrive at 11:30 AM." },
        ],
        "Analytical Thinking": [
          { text: "1,200 impressions, 12 conversions. What is the conversion rate?", options: [{ label: "A", text: "1%" },{ label: "B", text: "10%" },{ label: "C", text: "0.1%" },{ label: "D", text: "12%" }], correct_answer: "A", explanation: "12÷1200×100 = 1%." },
          { text: "Sales grew from $40k to $52k. Percentage increase?", options: [{ label: "A", text: "23%" },{ label: "B", text: "25%" },{ label: "C", text: "30%" },{ label: "D", text: "15%" }], correct_answer: "C", explanation: "(52-40)/40×100 = 30%." },
          { text: "Q1–Q4 revenue: $10k, $15k, $12k, $18k. Highest QoQ growth rate?", options: [{ label: "A", text: "Q1–Q2" },{ label: "B", text: "Q2–Q3" },{ label: "C", text: "Q3–Q4" },{ label: "D", text: "Q1–Q4" }], correct_answer: "C", explanation: "Q3→Q4: +50%, the highest single-quarter growth." },
          { text: "A team does 8 tasks/day. Output rises 37.5%. New daily output?", options: [{ label: "A", text: "10" },{ label: "B", text: "11" },{ label: "C", text: "12" },{ label: "D", text: "13" }], correct_answer: "B", explanation: "8 × 1.375 = 11." },
          { text: "Product A: 40%, B: 35%, C: 25% of $200k revenue. Product B amount?", options: [{ label: "A", text: "$60,000" },{ label: "B", text: "$70,000" },{ label: "C", text: "$80,000" },{ label: "D", text: "$50,000" }], correct_answer: "B", explanation: "35% × $200,000 = $70,000." },
        ],
        "Role-Based Knowledge": [
          { text: "What best describes a KPI?", options: [{ label: "A", text: "A general objective" },{ label: "B", text: "A measurable value showing progress toward a goal" },{ label: "C", text: "A financial report" },{ label: "D", text: "A communication protocol" }], correct_answer: "B", explanation: "KPIs are quantifiable metrics tied to strategic objectives." },
          { text: "Purpose of a sprint retrospective in Agile?", options: [{ label: "A", text: "Plan next sprint" },{ label: "B", text: "Demo to stakeholders" },{ label: "C", text: "Reflect and improve the process" },{ label: "D", text: "Assign story points" }], correct_answer: "C", explanation: "Retrospectives focus on continuous improvement." },
          { text: "What does RACI stand for?", options: [{ label: "A", text: "Review, Approve, Communicate, Implement" },{ label: "B", text: "Responsible, Accountable, Consulted, Informed" },{ label: "C", text: "Risk, Action, Control, Impact" },{ label: "D", text: "Report, Assign, Close, Initiate" }], correct_answer: "B", explanation: "RACI clarifies roles for each task." },
          { text: "Primary purpose of A/B testing?", options: [{ label: "A", text: "Reduce server load" },{ label: "B", text: "Compare two variants to find the better one" },{ label: "C", text: "Test for security issues" },{ label: "D", text: "Automate email campaigns" }], correct_answer: "B", explanation: "A/B testing splits audience to measure impact of a variable." },
          { text: "Git command to create and switch to a new branch in one step?", options: [{ label: "A", text: "git branch new-branch" },{ label: "B", text: "git switch new-branch" },{ label: "C", text: "git checkout -b new-branch" },{ label: "D", text: "git merge new-branch" }], correct_answer: "C", explanation: "git checkout -b creates and checks out a new branch." },
        ],
        "Situational Judgment": [
          { text: "A colleague misses deadlines repeatedly. First step?", options: [{ label: "A", text: "Report to HR immediately" },{ label: "B", text: "Privately raise it with them" },{ label: "C", text: "Post in the team channel" },{ label: "D", text: "Cover for them silently" }], correct_answer: "B", explanation: "Direct, private conversation is the professional first step." },
          { text: "Client requests out-of-scope feature with tight deadline. First action?", options: [{ label: "A", text: "Start building it immediately" },{ label: "B", text: "Refuse — it's out of scope" },{ label: "C", text: "Clarify impact, then discuss options" },{ label: "D", text: "Delegate to a junior quietly" }], correct_answer: "C", explanation: "Transparent communication about trade-offs keeps expectations aligned." },
          { text: "Manager and senior stakeholder give conflicting instructions. Best action?", options: [{ label: "A", text: "Follow manager only" },{ label: "B", text: "Facilitate a quick sync between both" },{ label: "C", text: "Do both simultaneously" },{ label: "D", text: "Escalate to CEO" }], correct_answer: "B", explanation: "Facilitating alignment resolves the conflict at its source." },
          { text: "Unfamiliar task assigned with a two-day deadline. Best approach?", options: [{ label: "A", text: "Tell your manager it's impossible" },{ label: "B", text: "Start without asking questions" },{ label: "C", text: "Research, identify gaps, flag blockers early" },{ label: "D", text: "Delegate it entirely" }], correct_answer: "C", explanation: "Proactive research and early escalation gives the best chance of success." },
          { text: "You find a production bug in code you didn't write. Developer unavailable. What do you do?", options: [{ label: "A", text: "Wait for the developer" },{ label: "B", text: "Assess, fix or workaround, and document it" },{ label: "C", text: "Ignore it" },{ label: "D", text: "Roll back everything immediately" }], correct_answer: "B", explanation: "Taking ownership and documenting ensures continuity." },
        ],
      };

      const domainNames = Object.keys(mockData);
      const sections: QuestionSection[] = domainNames.map((domain, idx) => {
        const count = base + (idx < rem ? 1 : 0);
        return {
          section: domain,
          questions: mockData[domain].slice(0, count).map((q, i) => ({ ...q, id: i + 1 })),
        };
      }).filter((s) => s.questions.length > 0);

      let id = 1;
      sections.forEach((s) => s.questions.forEach((q) => { q.id = id++; }));

      resolve({
        sections,
        total_questions: sections.reduce((acc, s) => acc + s.questions.length, 0),
        generated_at: new Date().toISOString(),
      });
    }, 1800);
  });
}
