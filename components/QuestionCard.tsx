import { cn } from "@/lib/utils";
import type { Question } from "@/lib/api";

interface QuestionCardProps {
  question: Question;
  index: number;
  showAnswer?: boolean;
}

const OPTION_COLORS: Record<string, string> = {
  A: "bg-blue-50 text-blue-700 border-blue-100",
  B: "bg-purple-50 text-purple-700 border-purple-100",
  C: "bg-amber-50 text-amber-700 border-amber-100",
  D: "bg-teal-50 text-teal-700 border-teal-100",
};

export default function QuestionCard({ question, index, showAnswer = false }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-card transition-shadow">
      {/* Question header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
          {index}
        </span>
        <p className="text-[14.5px] font-medium text-gray-800 leading-relaxed">
          {question.text}
        </p>
      </div>

      {/* Options */}
      <div className="ml-10 space-y-2">
        {question.options.map((opt) => {
          const isCorrect = opt.label === question.correct_answer;
          return (
            <div
              key={opt.label}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border transition-colors",
                showAnswer && isCorrect
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50/50 border-gray-100 hover:bg-gray-100/60"
              )}
            >
              <span
                className={cn(
                  "w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center flex-shrink-0 border",
                  showAnswer && isCorrect
                    ? "bg-green-500 text-white border-green-500"
                    : OPTION_COLORS[opt.label] || "bg-gray-100 text-gray-600 border-gray-200"
                )}
              >
                {opt.label}
              </span>
              <span className={cn(
                "text-sm leading-relaxed",
                showAnswer && isCorrect ? "text-green-800 font-medium" : "text-gray-700"
              )}>
                {opt.text}
              </span>
              {showAnswer && isCorrect && (
                <svg className="ml-auto flex-shrink-0 text-green-500 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {showAnswer && question.explanation && (
        <div className="ml-10 mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">Explanation</p>
          <p className="text-sm text-blue-700 leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
