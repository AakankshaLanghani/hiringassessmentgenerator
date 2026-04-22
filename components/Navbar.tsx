"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/ics-logo.svg"
            alt="ICS"
            width={52}
            height={16}
            className="h-8 w-auto transition-opacity group-hover:opacity-80"
            priority
          />
          <div className="flex items-center gap-2">
            <span className="text-gray-200 font-light text-lg select-none">|</span>
            <div>
              <span className="text-[13px] font-semibold text-gray-700 tracking-tight block leading-none hidden sm:block">
                Assessment Generator
              </span>
              <span className="text-[11px] text-gray-400 font-normal hidden sm:block leading-none mt-0.5">
                AI-powered candidate screening
              </span>
            </div>
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
