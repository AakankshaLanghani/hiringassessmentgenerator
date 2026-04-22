"""
main.py
───────
ICS AI Hiring Assessment Generator — FastAPI backend.
Deployed on Hugging Face Spaces.

Routes
  POST /generate       — Generate MCQ assessment from JD
  POST /export/pdf     — Export assessment as PDF
  POST /export/docx    — Export assessment as DOCX
  GET  /health         — Health check
"""

import os
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from schemas.models import GenerateRequest, GenerateResponse, ExportRequest, ErrorResponse
from services.ai_service import generate_mcqs
from services.pdf_service import generate_pdf
from services.docx_service import generate_docx
from config import OPENAI_API_KEY


# ─────────────────────────────────────────────
# App factory
# ─────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup checks
    if not OPENAI_API_KEY:
        print("⚠️  WARNING: OPENAI_API_KEY is not set. /generate will fail.")
    else:
        print("✅  OPENAI_API_KEY detected.")
    yield
    # Shutdown — nothing to clean up


app = FastAPI(
    title="ICS AI Assessment Generator",
    description="Generate bias-aware MCQ hiring assessments from any job description.",
    version="1.0.0",
    lifespan=lifespan,
)


# ─────────────────────────────────────────────
# CORS — allow Vercel frontend (and all origins for MVP)
# ─────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten to your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# Global error handler
# ─────────────────────────────────────────────

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc)},
    )


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "ICS AI Assessment Generator"}


@app.post(
    "/generate",
    response_model=GenerateResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Generate MCQ assessment from job description",
)
async def generate(payload: GenerateRequest):
    """
    Generate a structured MCQ assessment from a job description.

    - **jd**: Full job description text (20–8000 chars)
    - **num_questions**: Number of questions to generate (5–20)
    - **difficulty**: easy | medium | hard | mixed
    """
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="Server is not configured with an OpenAI API key.")

    try:
        result = await asyncio.to_thread(
            generate_mcqs,
            payload.jd,
            payload.num_questions,
            payload.difficulty,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except TimeoutError as e:
        raise HTTPException(status_code=504, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@app.post(
    "/export/pdf",
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Export assessment as PDF",
)
async def export_pdf(payload: ExportRequest):
    """
    Generate a styled PDF from assessment data and return it as a download.
    """
    if not payload.sections:
        raise HTTPException(status_code=400, detail="No sections provided.")

    try:
        file_path = await asyncio.to_thread(
            generate_pdf,
            payload.sections,
            payload.jd[:100],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

    def cleanup():
        try:
            os.remove(file_path)
        except OSError:
            pass

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename="ICS_Assessment.pdf",
        background=None,    # file deleted after response via BackgroundTask below
    )


@app.post(
    "/export/docx",
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Export assessment as DOCX",
)
async def export_docx(payload: ExportRequest):
    """
    Generate a styled DOCX from assessment data and return it as a download.
    """
    if not payload.sections:
        raise HTTPException(status_code=400, detail="No sections provided.")

    try:
        file_path = await asyncio.to_thread(
            generate_docx,
            payload.sections,
            payload.jd[:100],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DOCX generation failed: {str(e)}")

    return FileResponse(
        path=file_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="ICS_Assessment.docx",
    )


# ─────────────────────────────────────────────
# Entry point (Hugging Face Spaces)
# ─────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=7860,          # HF Spaces default port
        reload=False,
        workers=1,          # keep lightweight on HF
    )
