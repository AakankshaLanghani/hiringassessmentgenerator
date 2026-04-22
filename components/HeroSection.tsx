"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-24 px-6">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-red opacity-[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-brand-red-light text-brand-red px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-fade-up">
          <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse-soft" />
          HR-Grade AI Assessments
        </div>

        {/* Heading */}
        <h1
          className="text-5xl sm:text-6xl font-extrabold text-gray-950 leading-[1.1] tracking-tight mb-6 animate-fade-up delay-100"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Generate Hiring{" "}
          <span className="gradient-text">Assessments</span>
          <br />
          Instantly with AI
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200">
          Paste a job description and get a complete, role-specific MCQ assessment in seconds.
          Logical, analytical, and situational questions — all AI-generated, bias-aware, and export-ready.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up delay-300">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-brand-red text-white px-7 py-3.5 rounded-2xl font-semibold text-[15px] hover:bg-brand-red-dark transition-all shadow-button hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            Generate Assessment Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 text-gray-600 px-7 py-3.5 rounded-2xl font-medium text-[15px] hover:bg-gray-50 transition-colors border border-gray-200"
          >
            See How It Works
          </a>
        </div>

        {/* Social proof */}
        <p className="text-sm text-gray-400 mt-8 animate-fade-up delay-400">
          Designed for efficient hiring · Standardized evaluations · Easy export
        </p>
      </div>

      {/* Hero preview card */}
      <div className="relative max-w-3xl mx-auto mt-16 animate-fade-up delay-500">
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
          {/* Mock toolbar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="w-3 h-3 rounded-full bg-red-300" />
            <div className="w-3 h-3 rounded-full bg-yellow-300" />
            <div className="w-3 h-3 rounded-full bg-green-300" />
            <div className="ml-3 flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200 font-mono max-w-xs">
              ics-assessment.app/dashboard
            </div>
          </div>

          {/* Mock content */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {["Logical Reasoning", "Analytical Thinking", "Situational Judgment"].map((s, i) => (
                <div key={s} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500">{s}</span>
                    <span className="text-xs text-brand-red font-bold">3 Qs</span>
                  </div>
                  <div className="space-y-1.5">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-2 bg-gray-200 rounded-full" style={{ width: `${70 + (j * 10) % 30}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-9 rounded-xl flex-1" />
              <div className="skeleton h-9 rounded-xl w-32" />
              <div className="skeleton h-9 rounded-xl w-36" />
            </div>
          </div>
        </div>

        {/* Floating badge */}
        <div className="absolute -top-3 -right-3 bg-brand-red text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-button">
          ✓ 15 Questions Generated
        </div>
      </div>
    </section>
  );
}
