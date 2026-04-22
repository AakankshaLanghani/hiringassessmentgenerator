"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import QuestionCard from "./QuestionCard";
import type { QuestionSection } from "@/lib/api";

interface SectionAccordionProps {
  section: QuestionSection;
  defaultOpen?: boolean;
  showAnswers?: boolean;
  globalOffset?: number;
}

const SECTION_ICONS: Record<string, JSX.Element> = {
  "Logical Reasoning": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  "Analytical Thinking": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  "Role-Based Knowledge": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  ),
  "Situational Judgment": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

const SECTION_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  "Logical Reasoning":    { bg: "bg-blue-50",   text: "text-blue-700",   badge: "bg-blue-100 text-blue-700" },
  "Analytical Thinking":  { bg: "bg-purple-50", text: "text-purple-700", badge: "bg-purple-100 text-purple-700" },
  "Role-Based Knowledge": { bg: "bg-amber-50",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-700" },
  "Situational Judgment": { bg: "bg-teal-50",   text: "text-teal-700",   badge: "bg-teal-100 text-teal-700" },
};

export default function SectionAccordion({
  section,
  defaultOpen = false,
  showAnswers = false,
  globalOffset = 0,
}: SectionAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const colors = SECTION_COLORS[section.section] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    badge: "bg-gray-100 text-gray-700",
  };
  const icon = SECTION_ICONS[section.section];

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-card">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-5 py-4 transition-colors text-left",
          open ? colors.bg : "bg-white hover:bg-gray-50/50"
        )}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className={cn("flex-shrink-0", open ? colors.text : "text-gray-400")}>
              {icon}
            </span>
          )}
          <span
            className={cn(
              "font-semibold text-[15px] transition-colors",
              open ? colors.text : "text-gray-800"
            )}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {section.section}
          </span>
          <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full", colors.badge)}>
            {section.questions.length} {section.questions.length === 1 ? "question" : "questions"}
          </span>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("flex-shrink-0 text-gray-400 transition-transform duration-200", open && "rotate-180")}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Content */}
      {open && (
        <div className="p-4 space-y-3 border-t border-gray-100 accordion-content animate-fade-in">
          {section.questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={globalOffset + idx + 1}
              showAnswer={showAnswers}
            />
          ))}
        </div>
      )}
    </div>
  );
}
