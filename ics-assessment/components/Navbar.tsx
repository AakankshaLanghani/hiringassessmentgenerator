"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 3h4v4H2V3zm0 6h4v4H2V9zm6-6h6v2H8V3zm0 4h6v2H8V7zm0 4h6v2H8v-2z" fill="white"/>
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[15px] font-bold text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              ICS
            </span>
            <span className="text-[13px] text-gray-400 font-medium hidden sm:block">Assessment Generator</span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === "/"
                ? "text-gray-900 bg-gray-100"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === "/dashboard"
                ? "text-gray-900 bg-gray-100"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            Dashboard
          </Link>
        </nav>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-red-dark transition-colors shadow-button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
          Get Started
        </Link>
      </div>
    </header>
  );
}
