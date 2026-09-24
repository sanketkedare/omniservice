import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen w-full bg-[#faf8f5] text-neutral-900 font-serif flex flex-col justify-between selection:bg-[#f05a28]/20 relative overflow-hidden"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* ── Dynamic Animated Background Objects ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Floating Volcanic Glowing Orbs */}
        <div className="absolute top-10 left-[15%] w-80 h-80 rounded-full bg-gradient-to-tr from-[#f05a28]/20 via-amber-400/15 to-transparent blur-3xl animate-orb-1" />
        <div className="absolute bottom-16 right-[15%] w-96 h-96 rounded-full bg-gradient-to-bl from-[#ea580c]/15 via-amber-300/20 to-transparent blur-3xl animate-orb-2" />
        <div className="absolute top-1/2 left-[5%] w-48 h-48 rounded-full border border-orange-300/40 border-dashed animate-orb-3 opacity-60" />
        <div className="absolute bottom-1/3 right-[8%] w-60 h-60 rounded-full border border-orange-200/50 animate-orb-1 opacity-50" />
        {/* Ambient Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f05a2808_1px,transparent_1px),linear-gradient(to_bottom,#f05a2808_1px,transparent_1px)] bg-[size:48px_48px] opacity-60" />
      </div>

      {/* Minimal Top Header */}
      <header className="relative z-10 w-full border-b border-orange-200/70 bg-white/85 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center group" aria-label="OmniService Home">
            <Image
              src="/images/OmniService_Logo.png"
              alt="OmniService AI"
              width={170}
              height={42}
              className="h-9 w-auto rounded-xl object-contain transition-transform group-hover:scale-102"
              priority
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-[#f05a28] transition-colors bg-orange-50/80 px-3 py-1.5 rounded-full border border-orange-200/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Pure Centered Authentication Canvas */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Clean Volcanic Branding Footer with Logo */}
      <footer className="relative z-10 w-full py-5 text-center text-xs text-neutral-600 border-t border-orange-200/60 bg-white/70 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/volcanic_logo.png"
              alt="Volcanic"
              width={24}
              height={24}
              className="h-6 w-auto object-contain"
            />
            <span className="font-bold text-neutral-900 tracking-wider text-xs">VOLCANIC</span>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-600 text-[11px]">Local Solutions. Higher Standards.</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-neutral-500">
            <span>&copy; {new Date().getFullYear()} OmniService AI</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" /> Hyderabad Protected
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
