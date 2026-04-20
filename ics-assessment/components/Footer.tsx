import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-14 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 3h4v4H2V3zm0 6h4v4H2V9zm6-6h6v2H8V3zm0 4h6v2H8V7zm0 4h6v2H8v-2z" fill="white"/>
                </svg>
              </div>
              <span className="text-white font-bold text-[15px]" style={{ fontFamily: "var(--font-display)" }}>
                ICS Assessment Generator
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              AI-powered candidate screening for modern HR teams.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-gray-300 font-semibold mb-3">Product</p>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-300 font-semibold mb-3">Legal</p>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-600 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} ICS. All rights reserved.</span>
          <span>Built by ICS · Designed for HR</span>
        </div>
      </div>
    </footer>
  );
}
