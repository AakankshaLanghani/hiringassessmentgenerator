"use client";

import { useState, useCallback } from "react";
import TextareaInput from "@/components/TextareaInput";
import DropdownSelect from "@/components/ui/DropdownSelect";
import Button from "@/components/ui/Button";
import AlertBox from "@/components/ui/AlertBox";
import SectionAccordion from "@/components/SectionAccordion";
import EmptyState from "@/components/EmptyState";
import { LoadingState } from "@/components/ui/Loader";
import {
  generateAssessment,
  generateMockAssessment,
  type GenerateResponse,
} from "@/lib/api";
import { exportToPDF, exportToDOCX } from "@/lib/export";

const NUM_OPTIONS = [
  { value: "10", label: "10 Questions" },
  { value: "15", label: "15 Questions" },
  { value: "20", label: "20 Questions" },
];

const DIFFICULTY_OPTIONS = [
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
  { value: "Mixed", label: "Mixed" },
];

const EXAMPLE_JD = `We are looking for a Social Media & Content Marketing Intern to join our growing team.

🎯 Responsibilities:
• Assist in creating and scheduling content across Instagram, LinkedIn, and Twitter
• Support campaign execution and performance tracking
• Collaborate with the design team on visual content
• Monitor social media trends and suggest new ideas

📋 Requirements:
• Fresh graduates or final year students can apply
• Degree in Media Sciences, Graphic Design, or related field preferred
• Portfolio or sample work will be an advantage

🌟 What We Offer:
• Practical exposure to real-time marketing campaigns
• Learning and growth opportunities
• Supportive and collaborative work environment`;

export default function DashboardPage() {
  const [jd, setJd] = useState("");
  const [numQuestions, setNumQuestions] = useState("15");
  const [difficulty, setDifficulty] = useState("Mixed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingDOCX, setExportingDOCX] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!jd.trim()) {
      setError("Please paste a job description before generating.");
      return;
    }
    if (jd.trim().length < 50) {
      setError("Job description is too short. Please provide more detail.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Try real backend first; fall back to mock if unavailable
      let data: GenerateResponse;
      try {
        data = await generateAssessment({
          jd: jd.trim(),
          num_questions: parseInt(numQuestions),
          difficulty,
        });
      } catch (apiErr: unknown) {
        // If backend is down (network error), use mock
        const isNetworkError =
          apiErr instanceof TypeError ||
          (apiErr instanceof Error && apiErr.message.includes("fetch"));
        if (isNetworkError) {
          data = await generateMockAssessment({
            jd: jd.trim(),
            num_questions: parseInt(numQuestions),
            difficulty,
          });
        } else {
          throw apiErr;
        }
      }
      setResult(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [jd, numQuestions, difficulty]);

  const handleExportPDF = async () => {
    if (!result) return;
    setExportingPDF(true);
    try {
      await exportToPDF(result);
    } catch {
      setError("Failed to export PDF. Please try again.");
    } finally {
      setExportingPDF(false);
    }
  };

  const handleExportDOCX = async () => {
    if (!result) return;
    setExportingDOCX(true);
    try {
      await exportToDOCX(result);
    } catch {
      setError("Failed to export DOCX. Please try again.");
    } finally {
      setExportingDOCX(false);
    }
  };

  // Compute global question offset per section
  let offset = 0;

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              AI Hiring Assessment Generator
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Paste a job description to generate a complete MCQ assessment
            </p>
          </div>
          {result && (
            <div className="hidden sm:flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100 text-sm font-semibold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {result.total_questions} Questions Generated
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-6 items-start">

          {/* ── LEFT PANEL: Input ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
              {/* JD Input */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">Job Description</h2>
                <button
                  type="button"
                  onClick={() => setJd(EXAMPLE_JD)}
                  className="text-xs text-brand-red hover:text-brand-red-dark font-medium transition-colors"
                >
                  Load example
                </button>
              </div>

              <TextareaInput
                value={jd}
                onChange={setJd}
                rows={12}
                maxLength={5000}
                placeholder={`Paste the job description here...\n\nExample:\nWe are hiring a Graphic Designer with 2+ years of experience. Required skills: Adobe Photoshop, Illustrator, video editing. Degree in design preferred.`}
              />

              {/* Controls */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <DropdownSelect
                  label="Number of Questions"
                  options={NUM_OPTIONS}
                  value={numQuestions}
                  onChange={setNumQuestions}
                />
                <DropdownSelect
                  label="Difficulty Level"
                  options={DIFFICULTY_OPTIONS}
                  value={difficulty}
                  onChange={setDifficulty}
                />
              </div>

              {/* Generate button */}
              <Button
                variant="primary"
                size="lg"
                loading={loading}
                onClick={handleGenerate}
                className="w-full mt-4 rounded-2xl"
              >
                {loading ? "Generating..." : "Generate Assessment"}
              </Button>

              {/* Error */}
              {error && (
                <div className="mt-3">
                  <AlertBox
                    type="error"
                    message={error}
                    onDismiss={() => setError(null)}
                  />
                </div>
              )}
            </div>

            {/* Tips card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Tips for better results
              </p>
              <ul className="space-y-2">
                {[
                  "Include specific technical skills or tools",
                  "Mention the role level (Junior, Senior, Lead)",
                  "List key responsibilities clearly",
                  "Add any domain-specific requirements",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-gray-500">
                    <svg className="text-brand-red flex-shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="5"/>
                    </svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── RIGHT PANEL: Results ── */}
          <div className="space-y-4">
            {/* Action bar — only when results exist */}
            {result && !loading && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-2 animate-fade-in">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                  }
                >
                  Regenerate
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  loading={exportingPDF}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  }
                >
                  Download PDF
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportDOCX}
                  loading={exportingDOCX}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  }
                >
                  Download DOCX
                </Button>

                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <div className={`w-8 h-4 rounded-full transition-colors ${showAnswers ? "bg-brand-red" : "bg-gray-200"} relative`}>
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${showAnswers ? "translate-x-4" : "translate-x-0.5"}`} />
                    </div>
                    Show answers
                  </button>
                </div>
              </div>
            )}

            {/* Results content */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 min-h-[400px]">
              {loading ? (
                <LoadingState />
              ) : result ? (
                <div className="space-y-3 animate-fade-in">
                  {/* Summary bar */}
                  <div className="flex items-center justify-between mb-2 pb-4 border-b border-gray-100">
                    <div>
                      <p
                        className="font-bold text-gray-900"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Assessment Ready
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {result.total_questions} questions · {difficulty} difficulty ·{" "}
                        {new Date(result.generated_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      {result.sections.map((s) => (
                        <div
                          key={s.section}
                          className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg font-medium"
                        >
                          {s.questions.length}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sections */}
                  {result.sections.map((section, sIdx) => {
                    const sectionOffset = offset;
                    offset += section.questions.length;
                    return (
                      <SectionAccordion
                        key={section.section}
                        section={section}
                        defaultOpen={sIdx === 0}
                        showAnswers={showAnswers}
                        globalOffset={sectionOffset}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
