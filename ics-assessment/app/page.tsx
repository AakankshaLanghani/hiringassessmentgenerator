import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureCards />

      {/* How It Works */}
      <section className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-red font-semibold text-sm uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2
            className="text-4xl font-extrabold text-gray-950 tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three steps to a complete assessment
          </h2>
          <p className="text-gray-500 text-lg mb-16 max-w-xl mx-auto">
            No setup, no learning curve. Just paste, generate, and download.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                num: "01",
                title: "Paste the Job Description",
                desc: "Copy any JD — from LinkedIn, your ATS, or a Word doc — and paste it into the dashboard.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  </svg>
                ),
              },
              {
                num: "02",
                title: "Choose Your Settings",
                desc: "Pick the number of questions (10, 15, or 20) and the difficulty level (Easy to Mixed).",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                  </svg>
                ),
              },
              {
                num: "03",
                title: "Export & Share",
                desc: "Download as PDF or DOCX and share directly with your interview team or candidates.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                ),
              },
            ].map((step, i) => (
              <div key={step.num} className="relative group">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-gray-200 to-transparent z-0" />
                )}
                <div className="relative z-10 bg-white border border-gray-100 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-brand-red-light rounded-xl flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors flex-shrink-0">
                      {step.icon}
                    </div>
                    <span
                      className="text-4xl font-extrabold text-gray-100 leading-none mt-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <h3
                    className="font-bold text-gray-900 text-[15px] mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20 px-6 bg-gray-950 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-4xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to screen smarter?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Join HR teams using ICS to cut screening time in half with AI-generated assessments.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-brand-red text-white px-8 py-4 rounded-2xl font-semibold text-[15px] hover:bg-brand-red-dark transition-all shadow-button hover:shadow-lg hover:-translate-y-0.5"
          >
            Start Generating Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
