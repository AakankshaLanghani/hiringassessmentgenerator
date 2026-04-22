export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D1D5DB"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M8 8h8M8 12h8M8 16h5" />
          </svg>
        </div>
        <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-brand-red-light rounded-xl flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E8202A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      <h3
        className="text-lg font-bold text-gray-800 mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        No assessment yet
      </h3>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
        Paste a job description on the left and click{" "}
        <span className="font-semibold text-gray-600">Generate Assessment</span> to create
        AI-powered MCQs for your role.
      </p>

      {/* Steps hint */}
      <div className="mt-8 grid grid-cols-3 gap-3 text-left max-w-xs">
        {[
          { step: "1", label: "Paste JD" },
          { step: "2", label: "Set options" },
          { step: "3", label: "Generate" },
        ].map((s) => (
          <div key={s.step} className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">
              {s.step}
            </div>
            <span className="text-xs text-gray-400 text-center">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
