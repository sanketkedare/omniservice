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
      className="min-h-screen w-full bg-[#1b0802] text-neutral-900 font-serif flex flex-col justify-between selection:bg-[#f05a28]/20 relative overflow-hidden"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* ── Photographic Background Image with Rich Dark Gradient Scrim ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/auth_background.jpg"
          alt="OmniService Background"
          className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.05]"
        />
        {/* Deep Warm Atmospheric Overlays for Optimal Form Pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b0802]/95 via-[#230d04]/80 to-[#1b0802]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/25 via-transparent to-transparent" />

        {/* Ambient Floating Luminous Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#f05a28]/20 via-amber-500/15 to-transparent blur-3xl" />
      </div>

      {/* Floating Back to Home Button (No Navbar) */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-30 inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white bg-black/45 hover:bg-black/65 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer"
        aria-label="Return to Homepage"
      >
        <ArrowLeft className="h-3.5 w-3.5 text-[#f05a28]" />
        <span>Back to Home</span>
      </Link>


      







        

















      {/* Pure Centered Authentication Canvas */}
      <main className="relative z-20 flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center justify-center mb-6">
          </div>
          {children}
        </div>
      </main>

      {/* Clean Volcanic Branding Footer (Frosted Dark Glass) */}
      <footer className="relative z-20 w-full py-4 text-center text-xs text-white/60 border-t border-white/10 bg-black/45 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/volcanic_logo.png"
              alt="Volcanic"
              width={24}
              height={24}
              className="h-5 w-auto object-contain brightness-125"
            />
            <span className="font-bold text-white/90 tracking-wider text-xs">VOLCANIC</span>
            <span className="text-white/30">•</span>
            <span className="text-white/60 text-[11px]">Local Solutions. Higher Standards.</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-white/50">
            <span>&copy; {new Date().getFullYear()} OmniService AI</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" /> Hyderabad Protected
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
