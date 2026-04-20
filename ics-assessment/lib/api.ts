export interface GenerateRequest {
  jd: string;
  num_questions: number;
  difficulty: string;
}

export interface QuestionOption {
  label: string; // "A", "B", "C", "D"
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

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function generateAssessment(
  payload: GenerateRequest
): Promise<GenerateResponse> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Failed to generate assessment";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(errorMessage, response.status);
  }

  const data = await response.json();
  return data as GenerateResponse;
}

// ── Frontend-only mock (used when backend is not running) ──────────────────────
export function generateMockAssessment(
  payload: GenerateRequest
): Promise<GenerateResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sections: QuestionSection[] = [
        {
          section: "Logical Reasoning",
          questions: Array.from({ length: Math.ceil(payload.num_questions / 4) }, (_, i) => ({
            id: i + 1,
            text: `All managers are leaders. Some leaders are teachers. Which of the following must be true? (Question ${i + 1})`,
            options: [
              { label: "A", text: "All managers are teachers" },
              { label: "B", text: "Some managers are teachers" },
              { label: "C", text: "Some leaders are not managers" },
              { label: "D", text: "All leaders are managers" },
            ],
            correct_answer: "C",
            explanation: "From the given statements, we can deduce that some leaders are not managers.",
          })),
        },
        {
          section: "Analytical Thinking",
          questions: Array.from({ length: Math.ceil(payload.num_questions / 4) }, (_, i) => ({
            id: i + 1,
            text: `A team's productivity increased by 25% after implementing a new tool. If they completed 80 tasks before, how many can they complete now? (Question ${i + 1})`,
            options: [
              { label: "A", text: "90 tasks" },
              { label: "B", text: "95 tasks" },
              { label: "C", text: "100 tasks" },
              { label: "D", text: "105 tasks" },
            ],
            correct_answer: "C",
            explanation: "80 × 1.25 = 100 tasks",
          })),
        },
        {
          section: "Role-Based Knowledge",
          questions: Array.from({ length: Math.ceil(payload.num_questions / 4) }, (_, i) => ({
            id: i + 1,
            text: `Which metric is most important when evaluating a social media campaign's reach? (Question ${i + 1})`,
            options: [
              { label: "A", text: "Click-through rate (CTR)" },
              { label: "B", text: "Impressions" },
              { label: "C", text: "Cost per acquisition (CPA)" },
              { label: "D", text: "Engagement rate" },
            ],
            correct_answer: "B",
            explanation: "Impressions measure how many times content was displayed, directly reflecting reach.",
          })),
        },
        {
          section: "Situational Judgment",
          questions: Array.from({ length: Math.floor(payload.num_questions / 4) }, (_, i) => ({
            id: i + 1,
            text: `A client requests a last-minute change that could delay the project by 2 weeks. What is the best course of action? (Question ${i + 1})`,
            options: [
              { label: "A", text: "Refuse the change to keep the deadline" },
              { label: "B", text: "Accept without informing stakeholders" },
              { label: "C", text: "Discuss impact and propose alternatives" },
              { label: "D", text: "Escalate to upper management immediately" },
            ],
            correct_answer: "C",
            explanation: "The best approach balances client needs with project constraints through transparent communication.",
          })),
        },
      ].filter((s) => s.questions.length > 0);

      resolve({
        sections,
        total_questions: sections.reduce((acc, s) => acc + s.questions.length, 0),
        generated_at: new Date().toISOString(),
      });
    }, 2200);
  });
}
