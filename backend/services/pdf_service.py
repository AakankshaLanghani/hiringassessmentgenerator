"""
pdf_service.py
──────────────
Generates a styled PDF assessment report using reportlab.
"""

import os
import uuid
from typing import List

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

from config import TEMP_DIR
from schemas.models import Section


# ─────────────────────────────────────────────
# Brand colours
# ─────────────────────────────────────────────
BRAND_RED    = colors.HexColor("#C31D27")
LIGHT_RED    = colors.HexColor("#FEF2F2")
DARK_GRAY    = colors.HexColor("#111827")
MID_GRAY     = colors.HexColor("#6B7280")
LIGHT_GRAY   = colors.HexColor("#F3F4F6")
BORDER_GRAY  = colors.HexColor("#E5E7EB")
CORRECT_BG   = colors.HexColor("#F0FDF4")
CORRECT_TEXT = colors.HexColor("#166534")
WHITE        = colors.white


def _styles():
    base = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "Title",
        parent=base["Normal"],
        fontSize=22,
        fontName="Helvetica-Bold",
        textColor=DARK_GRAY,
        spaceAfter=4,
        alignment=TA_LEFT,
    )
    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=base["Normal"],
        fontSize=10,
        fontName="Helvetica",
        textColor=MID_GRAY,
        spaceAfter=0,
        alignment=TA_LEFT,
    )
    domain_style = ParagraphStyle(
        "Domain",
        parent=base["Normal"],
        fontSize=13,
        fontName="Helvetica-Bold",
        textColor=WHITE,
        spaceAfter=0,
        spaceBefore=0,
    )
    q_num_style = ParagraphStyle(
        "QNum",
        parent=base["Normal"],
        fontSize=10,
        fontName="Helvetica-Bold",
        textColor=BRAND_RED,
        spaceAfter=2,
    )
    question_style = ParagraphStyle(
        "Question",
        parent=base["Normal"],
        fontSize=10,
        fontName="Helvetica-Bold",
        textColor=DARK_GRAY,
        spaceAfter=6,
        leading=14,
    )
    option_style = ParagraphStyle(
        "Option",
        parent=base["Normal"],
        fontSize=9,
        fontName="Helvetica",
        textColor=DARK_GRAY,
        spaceAfter=2,
        leftIndent=4,
        leading=13,
    )
    correct_style = ParagraphStyle(
        "Correct",
        parent=base["Normal"],
        fontSize=9,
        fontName="Helvetica-Bold",
        textColor=CORRECT_TEXT,
        spaceAfter=2,
        leftIndent=4,
        leading=13,
    )
    explanation_style = ParagraphStyle(
        "Explanation",
        parent=base["Normal"],
        fontSize=8.5,
        fontName="Helvetica-Oblique",
        textColor=MID_GRAY,
        spaceAfter=0,
        leftIndent=4,
        leading=12,
    )
    footer_style = ParagraphStyle(
        "Footer",
        parent=base["Normal"],
        fontSize=8,
        fontName="Helvetica",
        textColor=MID_GRAY,
        alignment=TA_CENTER,
    )

    return {
        "title": title_style,
        "subtitle": subtitle_style,
        "domain": domain_style,
        "q_num": q_num_style,
        "question": question_style,
        "option": option_style,
        "correct": correct_style,
        "explanation": explanation_style,
        "footer": footer_style,
    }


def generate_pdf(sections: List[Section], jd_snippet: str = "") -> str:
    """
    Build a PDF from assessment sections and return the temp file path.
    """
    file_path = os.path.join(TEMP_DIR, f"assessment_{uuid.uuid4().hex[:8]}.pdf")
    page_w, page_h = A4
    margin = 18 * mm

    doc = SimpleDocTemplate(
        file_path,
        pagesize=A4,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=margin,
        bottomMargin=margin,
    )

    s = _styles()
    story = []

    # ── Header ───────────────────────────────
    header_data = [[
        Paragraph("ICS AI Hiring Assessment", s["title"]),
        Paragraph("Assessment Generator", s["subtitle"]),
    ]]
    header_table = Table(header_data, colWidths=[page_w - 2 * margin])
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=BRAND_RED, spaceAfter=10))

    total_q = sum(len(sec.questions) for sec in sections)
    meta_text = (
        f"Total Questions: <b>{total_q}</b> &nbsp;|&nbsp; "
        f"Sections: <b>{len(sections)}</b>"
    )
    story.append(Paragraph(meta_text, s["subtitle"]))
    story.append(Spacer(1, 10))

    # ── Sections & Questions ──────────────────
    q_global = 1
    for section in sections:
        # Domain header
        domain_table = Table(
            [[Paragraph(section.domain, s["domain"])]],
            colWidths=[page_w - 2 * margin],
        )
        domain_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), BRAND_RED),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ]))
        story.append(domain_table)
        story.append(Spacer(1, 8))

        for q in section.questions:
            # Question number + text
            story.append(Paragraph(f"Q{q_global}.", s["q_num"]))
            story.append(Paragraph(q.question, s["question"]))

            # Options
            options = q.options.model_dump()
            for letter, text in options.items():
                is_correct = letter == q.correct_answer
                label = f"<b>({letter})</b>  {text}"
                if is_correct:
                    opt_table = Table(
                        [[Paragraph(f"✓  {label}", s["correct"])]],
                        colWidths=[page_w - 2 * margin - 8],
                    )
                    opt_table.setStyle(TableStyle([
                        ("BACKGROUND", (0, 0), (-1, -1), CORRECT_BG),
                        ("TOPPADDING", (0, 0), (-1, -1), 3),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                        ("LEFTPADDING", (0, 0), (-1, -1), 6),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                        ("ROUNDEDCORNERS", [3, 3, 3, 3]),
                    ]))
                    story.append(opt_table)
                else:
                    story.append(Paragraph(label, s["option"]))
                story.append(Spacer(1, 1))

            # Explanation
            story.append(Spacer(1, 3))
            exp_table = Table(
                [[Paragraph(f"💡 {q.explanation}", s["explanation"])]],
                colWidths=[page_w - 2 * margin - 8],
            )
            exp_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), LIGHT_GRAY),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("ROUNDEDCORNERS", [3, 3, 3, 3]),
            ]))
            story.append(exp_table)
            story.append(Spacer(1, 10))
            story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_GRAY))
            story.append(Spacer(1, 8))

            q_global += 1

        story.append(Spacer(1, 6))

    # ── Footer ────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_GRAY, spaceBefore=6))
    story.append(Paragraph("Generated by ICS AI Assessment Generator", s["footer"]))

    doc.build(story)
    return file_path
