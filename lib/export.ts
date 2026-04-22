import type { GenerateResponse, Question, QuestionSection } from "./api";

// ── Helpers ────────────────────────────────────────────────────────────────

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function flatQuestions(data: GenerateResponse) {
  const out: Array<{ q: Question; num: number; section: string }> = [];
  let num = 1;
  data.sections.forEach((sec) =>
    sec.questions.forEach((q) => { out.push({ q, num, section: sec.section }); num++; })
  );
  return out;
}

// ── PDF Export — questions only (no answers), answer key on last page ──────

export async function exportToPDF(data: GenerateResponse, jobTitle = "Hiring Assessment") {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  const addHeader = () => {
    doc.setFillColor(195, 29, 39);
    doc.rect(0, 0, pageW, 14, "F");
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    doc.text("ICS AI Hiring Assessment Generator", margin, 9);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.total_questions} Questions`, pageW - margin, 9, { align: "right" });
  };

  const newPage = (needed = 10) => {
    if (y + needed > pageH - margin) {
      doc.addPage(); addHeader(); y = margin + 18;
    }
  };

  // ── Title page ─────────────────────────────────────────────────────────
  addHeader(); y = 24;
  doc.setTextColor(17, 24, 39); doc.setFontSize(20); doc.setFont("helvetica", "bold");
  doc.text(jobTitle, margin, y); y += 7;
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(107, 114, 128);
  doc.text(`Generated: ${new Date(data.generated_at).toLocaleString()}  ·  ${data.total_questions} Questions  ·  ${data.sections.length} Sections`, margin, y);
  y += 8;
  doc.setDrawColor(195, 29, 39); doc.setLineWidth(0.6);
  doc.line(margin, y, pageW - margin, y); y += 10;

  // ── Questions (no correct answer highlighted, no explanations) ──────────
  let qGlobal = 1;
  data.sections.forEach((section: QuestionSection) => {
    newPage(18);
    // Section banner
    doc.setFillColor(254, 226, 228);
    doc.roundedRect(margin - 2, y - 5, contentW + 4, 11, 2, 2, "F");
    doc.setFillColor(195, 29, 39);
    doc.rect(margin - 2, y - 5, 3, 11, "F");
    doc.setFontSize(10.5); doc.setFont("helvetica", "bold"); doc.setTextColor(195, 29, 39);
    doc.text(section.section, margin + 5, y + 2);
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(107, 114, 128);
    doc.text(`${section.questions.length} question${section.questions.length !== 1 ? "s" : ""}`, pageW - margin, y + 2, { align: "right" });
    y += 14;

    section.questions.forEach((q) => {
      const qLines = doc.splitTextToSize(`${qGlobal}. ${q.text}`, contentW - 8);
      newPage(qLines.length * 5.5 + 30);

      // Number bubble
      doc.setFillColor(195, 29, 39); doc.circle(margin + 3, y, 3, "F");
      doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont("helvetica", "bold");
      doc.text(`${qGlobal}`, margin + 3, y + 0.8, { align: "center" });

      // Question text
      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(17, 24, 39);
      doc.text(qLines, margin + 8, y + 1);
      y += qLines.length * 5.5 + 4;

      // Options — plain, no highlighting
      doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(55, 65, 81);
      q.options.forEach((opt) => {
        newPage(7);
        const optLines = doc.splitTextToSize(`${opt.label}.  ${opt.text}`, contentW - 14);
        doc.text(optLines, margin + 10, y);
        y += optLines.length * 5 + 1;
      });
      y += 6; qGlobal++;
    });
    y += 4;
  });

  // ── Answer Key page ──────────────────────────────────────────────────────
  doc.addPage(); addHeader(); y = 24;

  // Header bar
  doc.setFillColor(17, 24, 39);
  doc.roundedRect(margin - 2, y - 6, contentW + 4, 14, 2, 2, "F");
  doc.setTextColor(255, 255, 255); doc.setFontSize(14); doc.setFont("helvetica", "bold");
  doc.text("Answer Key", margin + 4, y + 3); y += 20;

  // Grid 5 columns
  const allQ = flatQuestions(data);
  const cols = 5;
  const colW = contentW / cols;
  let col = 0; let rowY = y;
  allQ.forEach(({ q, num }) => {
    const cx = margin + col * colW;
    doc.setFillColor(249, 250, 251); doc.setDrawColor(229, 231, 235); doc.setLineWidth(0.3);
    doc.roundedRect(cx, rowY, colW - 3, 11, 2, 2, "FD");
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(107, 114, 128);
    doc.text(`Q${num}`, cx + 3, rowY + 7);
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(195, 29, 39);
    doc.text(q.correct_answer, cx + colW - 10, rowY + 7.5);
    col++; if (col >= cols) { col = 0; rowY += 14; }
  });

  // Section breakdown
  rowY += (col > 0 ? 14 : 0) + 14;
  doc.setDrawColor(229, 231, 235); doc.setLineWidth(0.4);
  doc.line(margin, rowY, pageW - margin, rowY); rowY += 8;
  doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(17, 24, 39);
  doc.text("Section Breakdown", margin, rowY); rowY += 7;
  let runQ = 1;
  data.sections.forEach((sec) => {
    const end = runQ + sec.questions.length - 1;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(107, 114, 128);
    doc.text(sec.section, margin + 2, rowY);
    doc.setFont("helvetica", "bold"); doc.setTextColor(195, 29, 39);
    doc.text(`Q${runQ}–Q${end}`, pageW - margin, rowY, { align: "right" });
    runQ += sec.questions.length; rowY += 6;
  });

  // Footer
  doc.setFontSize(7.5); doc.setFont("helvetica", "italic"); doc.setTextColor(156, 163, 175);
  doc.text("Generated by ICS AI Assessment Generator — Confidential", pageW / 2, pageH - 8, { align: "center" });

  doc.save(`ICS_Assessment_${Date.now()}.pdf`);
}

// ── DOCX Export — questions only, answer key at end ────────────────────────

export async function exportToDOCX(data: GenerateResponse) {
  const {
    Document, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, BorderStyle, HeadingLevel, PageBreak, AlignmentType,
    Packer, ShadingType,
  } = await import("docx");

  const RED  = "C31D27", DARK = "111827", GRAY = "6B7280";
  const LIGHT_BG = "FEF2F2", WHITE = "FFFFFF", LIGHT_GRAY = "F9FAFB";

  const noBorder = {
    top:    { style: BorderStyle.NONE, size: 0, color: WHITE },
    bottom: { style: BorderStyle.NONE, size: 0, color: WHITE },
    left:   { style: BorderStyle.NONE, size: 0, color: WHITE },
    right:  { style: BorderStyle.NONE, size: 0, color: WHITE },
  };
  const thinBorder = {
    top:    { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" },
    left:   { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" },
    right:  { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];

  // ── Title ───────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "ICS ", bold: true, size: 36, color: RED }),
        new TextRun({ text: "AI Hiring Assessment", bold: true, size: 36, color: DARK }),
      ],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated: ${new Date(data.generated_at).toLocaleString()}   ·   ${data.total_questions} Questions   ·   ${data.sections.length} Sections`,
          color: GRAY, size: 18,
        }),
      ],
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RED } },
      spacing: { after: 320 },
    })
  );

  // ── Questions (no answers, no explanations) ─────────────────────────────
  let qGlobal = 1;
  data.sections.forEach((section) => {
    // Section banner
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [new TableRow({
          children: [
            new TableCell({
              width: { size: 3, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.SOLID, color: RED, fill: RED },
              borders: noBorder,
              children: [new Paragraph({ text: "" })],
            }),
            new TableCell({
              width: { size: 97, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.SOLID, color: LIGHT_BG, fill: LIGHT_BG },
              borders: noBorder,
              children: [new Paragraph({
                children: [
                  new TextRun({ text: section.section, bold: true, size: 24, color: RED }),
                  new TextRun({ text: `   (${section.questions.length} questions)`, size: 18, color: GRAY }),
                ],
                spacing: { before: 80, after: 80 },
              })],
            }),
          ],
        })],
      }),
      new Paragraph({ text: "", spacing: { after: 80 } })
    );

    section.questions.forEach((q) => {
      // Question
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${qGlobal}.  `, bold: true, size: 22, color: RED }),
          new TextRun({ text: q.text, bold: true, size: 22, color: DARK }),
        ],
        spacing: { before: 160, after: 100 },
      }));
      // Options — plain text, no answer highlighted
      q.options.forEach((opt) => {
        children.push(new Paragraph({
          children: [new TextRun({ text: `      ${opt.label}.  ${opt.text}`, size: 20, color: "374151" })],
          spacing: { after: 60 },
        }));
      });
      children.push(new Paragraph({ text: "", spacing: { after: 80 } }));
      qGlobal++;
    });
    children.push(new Paragraph({ text: "", spacing: { after: 160 } }));
  });

  // ── Answer Key (new page) ────────────────────────────────────────────────
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // Title bar
  children.push(new Paragraph({
    children: [new TextRun({ text: "Answer Key", bold: true, size: 32, color: WHITE })],
    shading: { type: ShadingType.SOLID, color: DARK, fill: DARK },
    spacing: { after: 240 },
  }));

  // Answer grid — 5 per row
  const allQ = flatQuestions(data);
  const COLS = 5;
  for (let i = 0; i < allQ.length; i += COLS) {
    const rowItems = allQ.slice(i, i + COLS);
    while (rowItems.length < COLS) rowItems.push({ q: { id: 0, text: "", options: [], correct_answer: "", explanation: "" } as Question, num: 0, section: "" });
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [new TableRow({
        children: rowItems.map(({ q, num }) => new TableCell({
          width: { size: Math.floor(100 / COLS), type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.SOLID, color: num ? LIGHT_GRAY : WHITE, fill: num ? LIGHT_GRAY : WHITE },
          borders: thinBorder,
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: num ? [
              new TextRun({ text: `Q${num}  `, size: 16, color: GRAY }),
              new TextRun({ text: q.correct_answer, bold: true, size: 22, color: RED }),
            ] : [new TextRun({ text: "" })],
            spacing: { before: 60, after: 60 },
          })],
        })),
      })],
    }));
  }

  // Section breakdown
  children.push(
    new Paragraph({ text: "", spacing: { after: 200 } }),
    new Paragraph({
      children: [new TextRun({ text: "Section Breakdown", bold: true, size: 22, color: DARK })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" } },
      spacing: { after: 120 },
    })
  );
  let runQ = 1;
  data.sections.forEach((sec) => {
    const end = runQ + sec.questions.length - 1;
    children.push(new Paragraph({
      children: [
        new TextRun({ text: sec.section, size: 18, color: GRAY }),
        new TextRun({ text: `   Q${runQ}–Q${end}`, bold: true, size: 18, color: RED }),
      ],
      spacing: { after: 80 },
    }));
    runQ += sec.questions.length;
  });

  // ── Build & download ─────────────────────────────────────────────────────
  const doc = new Document({
    sections: [{
      children,
      properties: { page: { margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 } } },
    }],
    styles: {
      default: { document: { run: { font: "Calibri", size: 22, color: DARK } } },
    },
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `ICS_Assessment_${Date.now()}.docx`);
}
