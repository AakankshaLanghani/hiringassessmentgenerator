from pydantic import BaseModel, Field
from typing import Literal, List, Dict


# ─────────────────────────────────────────────
# Request Models
# ─────────────────────────────────────────────

class GenerateRequest(BaseModel):
    jd: str = Field(..., min_length=20, max_length=8000, description="Job description text")
    num_questions: int = Field(default=10, ge=5, le=20, description="Number of questions (5–20)")
    difficulty: Literal["easy", "medium", "hard", "mixed"] = Field(
        default="mixed", description="Question difficulty level"
    )


class ExportRequest(BaseModel):
    jd: str = Field(..., min_length=1, description="Job description (used as document title context)")
    sections: List["Section"]


# ─────────────────────────────────────────────
# Response Models
# ─────────────────────────────────────────────

class MCQOption(BaseModel):
    A: str
    B: str
    C: str
    D: str


class Question(BaseModel):
    question: str
    options: MCQOption
    correct_answer: Literal["A", "B", "C", "D"]
    explanation: str


class Section(BaseModel):
    domain: str
    questions: List[Question]


class GenerateResponse(BaseModel):
    sections: List[Section]


class ErrorResponse(BaseModel):
    error: str


# Rebuild forward refs
ExportRequest.model_rebuild()
