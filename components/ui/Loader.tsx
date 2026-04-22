export function SkeletonSection() {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between p-5 bg-gray-50/50">
        <div className="skeleton h-4 rounded-full w-48" />
        <div className="skeleton h-4 rounded-full w-6" />
      </div>
      <div className="p-5 space-y-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton h-3.5 rounded-full w-full" />
            <div className="skeleton h-3.5 rounded-full w-4/5" />
            <div className="mt-3 space-y-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="skeleton w-6 h-6 rounded-full flex-shrink-0" />
                  <div className="skeleton h-3 rounded-full flex-1" style={{ width: `${60 + j * 8}%` }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 py-4">
        <svg
          className="animate-spin w-5 h-5 text-brand-red"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-sm font-medium text-gray-500 animate-pulse-soft">
          Generating assessment questions...
        </span>
      </div>
      <SkeletonSection />
      <SkeletonSection />
    </div>
  );
}
