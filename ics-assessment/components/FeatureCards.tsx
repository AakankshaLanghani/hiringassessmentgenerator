const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 0 20A10 10 0 0 1 12 2"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "Instant AI Generation",
    description:
      "Paste any job description and receive a full MCQ assessment in under 30 seconds. No templates, no manual work.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h6M9 12h6M9 15h4"/>
      </svg>
    ),
    title: "Printable Exports",
    description:
      "Download your assessment as a polished PDF or DOCX file, ready to share with candidates or interviewers.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Bias-Aware Questions",
    description:
      "Our AI generates fair, role-relevant questions that focus on skills and reasoning, not demographics or background.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Multi-Section Structure",
    description:
      "Every assessment includes Logical Reasoning, Analytical Thinking, Role-Based, and Situational Judgment sections.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Difficulty Control",
    description:
      "Choose Easy, Medium, Hard, or Mixed difficulty to match the seniority and complexity of your open role.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Regenerate Instantly",
    description:
      "Not happy with the output? Hit regenerate and get a fresh set of questions without re-entering the job description.",
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="py-24 px-6 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-brand-red font-semibold text-sm uppercase tracking-widest mb-3">
            Features
          </p>
          <h2
            className="text-4xl font-extrabold text-gray-950 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything you need to hire smarter
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
            No templates, no spreadsheets. Just paste the JD and let AI do the heavy lifting.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-11 h-11 bg-brand-red-light text-brand-red rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-red group-hover:text-white transition-colors">
                {f.icon}
              </div>
              <h3
                className="text-[16px] font-bold text-gray-900 mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
