import type { GenerateResponse, QuestionSection } from "./api";

// ── PDF Export ────────────────────────────────────────────────────────────────
export async function exportToPDF(data: GenerateResponse, jobTitle = "Hiring Assessment") {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  const checkNewPage = (needed = 10) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header
  doc.setFillColor(232, 32, 42);
  doc.rect(0, 0, pageW, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("ICS AI Hiring Assessment Generator", margin, 12);
  y = 28;

  // Title
  doc.setTextColor(10, 10, 10);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(jobTitle, margin, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Generated: ${new Date(data.generated_at).toLocaleString()} · ${data.total_questions} Questions`,
    margin,
    y
  );
  y += 10;

  // Divider
  doc.setDrawColor(232, 32, 42);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  let qGlobal = 1;
  data.sections.forEach((section: QuestionSection) => {
    checkNewPage(16);

    // Section heading
    doc.setFillColor(254, 226, 228);
    doc.roundedRect(margin - 2, y - 5, contentW + 4, 10, 2, 2, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 20, 30);
    doc.text(`${section.section} (${section.questions.length} questions)`, margin + 2, y + 1);
    y += 12;

    section.questions.forEach((q) => {
      checkNewPage(40);

      // Question text
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(10, 10, 10);
      const qLines = doc.splitTextToSize(`Q${qGlobal}. ${q.text}`, contentW);
      doc.text(qLines, margin, y);
      y += qLines.length * 5 + 3;

      // Options
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(55, 65, 81);

      q.options.forEach((opt) => {
        checkNewPage(8);
        const optLine = doc.splitTextToSize(`  ${opt.label}.  ${opt.text}`, contentW - 5);
        if (opt.label === q.correct_answer) {
          doc.setTextColor(22, 163, 74);
          doc.setFont("helvetica", "bold");
        } else {
          doc.setTextColor(55, 65, 81);
          doc.setFont("helvetica", "normal");
        }
        doc.text(optLine, margin + 3, y);
        y += optLine.length * 4.5 + 1.5;
      });

      if (q.explanation) {
        checkNewPage(10);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(156, 163, 175);
        const expLines = doc.splitTextToSize(`Explanation: ${q.explanation}`, contentW - 5);
        doc.text(expLines, margin + 3, y);
        y += expLines.length * 4 + 2;
      }

      y += 4;
      qGlobal++;
    });

    y += 4;
  });

  doc.save(`ICS_Assessment_${Date.now()}.pdf`);
}

// ── DOCX Export ───────────────────────────────────────────────────────────────
export async function exportToDOCX(data: GenerateResponse) {
  const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Packer } =
    await import("docx");
  const { saveAs } = await import("file-saver");

  const children: any[] = [];

  // Title
  children.push(
    new Paragraph({
      text: "ICS AI Hiring Assessment",
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated: ${new Date(data.generated_at).toLocaleString()} · ${data.total_questions} Questions`,
          color: "6B7280",
          size: 18,
        }),
      ],
      spacing: { after: 300 },
    })
  );

  let qGlobal = 1;
  data.sections.forEach((section) => {
    // Section heading
    children.push(
      new Paragraph({
        text: `${section.section} (${section.questions.length} questions)`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 320, after: 160 },
      })
    );

    section.questions.forEach((q) => {
      // Question
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Q${qGlobal}. `, bold: true, size: 22 }),
            new TextRun({ text: q.text, size: 22 }),
          ],
          spacing: { before: 200, after: 100 },
        })
      );

      // Options
      q.options.forEach((opt) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `    ${opt.label}.  ${opt.text}`,
                bold: opt.label === q.correct_answer,
                color: opt.label === q.correct_answer ? "16A34A" : "374151",
                size: 20,
              }),
            ],
            spacing: { after: 60 },
          })
        );
      });

      if (q.explanation) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Explanation: ${q.explanation}`,
                italics: true,
                color: "9CA3AF",
                size: 18,
              }),
            ],
            spacing: { before: 80, after: 160 },
          })
        );
      }

      qGlobal++;
    });
  });

  const doc = new Document({
    sections: [{ children }],
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22 },
        },
      },
    },
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `ICS_Assessment_${Date.now()}.docx`);
}
