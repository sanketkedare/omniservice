"use client";

import React from "react";
import Link from "next/link";
import {
  Camera,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Award,
  Sparkles,
  Layers,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { PWAInstallButton } from "@/components/shared/PWAInstallButton";

interface HeroMobileProps {
  locality: string | null;
}

export function HeroMobile({ locality }: HeroMobileProps) {
  return (
    <section className="relative w-full overflow-hidden border-b border-orange-200/80 pt-20 sm:pt-24 pb-8 px-4 sm:px-6 bg-[#faf8f5]">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-orange-300/15 via-amber-200/10 to-transparent blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-start text-left space-y-4">
        {/* 1. Verified Service Zone Live Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/90 bg-white/95 px-3.5 py-1 text-xs font-bold text-[#c2410c] shadow-xs backdrop-blur-md select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f05a28] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f05a28]" />
          </span>
          <span className="truncate max-w-[190px]">
            Serving: <strong className="text-[#2d130a]">{locality || "Hyderabad Active Zone"}</strong>
          </span>
          <span className="text-orange-300">•</span>
          <span className="text-emerald-700 font-bold">Auto-Verified</span>
        </div>

        {/* 2. Hero Headline & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2d130a] leading-[1.18]">
            Show the problem.{" "}
            <span className="bg-gradient-to-r from-[#f05a28] via-[#ea580c] to-[#c2410c] bg-clip-text text-transparent italic">
              Let AI diagnose it.
            </span>{" "}
            Pay only when verified.
          </h1>

          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
            Record a 15-second video of your repair issue. Get locked upfront pricing, certified local providers with parts on board, and 100% escrow payment protection.
          </p>
        </div>

        {/* 3. High-Impact Visual Showcase Card with Overlay Badges */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-orange-200/90 shadow-lg shadow-orange-950/8 bg-white aspect-[16/10] sm:aspect-[16/9]">
          <img
            src="/api/media/asset?name=hero_technician&v=2"
            alt="OmniService Field Technician Inspecting AC Unit"
            className="w-full h-full object-cover object-[80%_center] filter brightness-[1.01]"
          />
          {/* Subtle vignette for high overlay contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top-Left Live Badge */}
          <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Diagnostic Engine</span>
          </div>

          {/* Bottom Floating Bar */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 p-2 rounded-xl bg-white/92 backdrop-blur-md border border-white/60 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-[#f05a28] flex items-center justify-center text-white shrink-0 shadow-2xs">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-[#2d130a] leading-tight">Master Technicians with Spares</p>
                <p className="text-[9px] text-neutral-500 font-sans leading-none mt-0.5">Average dispatch in 15 mins</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
              Verified
            </span>
          </div>
        </div>

        {/* 4. Action CTAs for Mobile Thumb Ergonomics */}
        <div className="w-full space-y-2 pt-1">
          {/* Full-Width Primary Action */}
          <Link
            href="/customer/new-request"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f05a28] via-[#ea580c] to-[#c2410c] py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 active:scale-[0.99] transition-transform"
          >
            <Camera className="h-4 w-4" />
            <span>Book AI Diagnostic</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Secondary Action Row */}
          <div className="flex items-center gap-2 w-full">
            <PWAInstallButton
              variant="hero"
              className="flex-1 !py-2.5 !px-3 !text-xs !rounded-xl !border-orange-200/90 !shadow-xs"
            />
            <Link
              href="/case-study"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-orange-200/90 bg-white/95 py-2.5 px-3 text-xs font-bold text-[#c2410c] shadow-xs hover:bg-orange-50 transition-all text-center"
            >
              <Award className="h-3.5 w-3.5 text-[#f05a28]" />
              <span>Case Study</span>
            </Link>
          </div>

          {/* Service Professional Link */}
          <div className="text-center pt-0.5">
            <Link
              href="/register?role=professional"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7c2d12] hover:text-[#f05a28] transition-colors"
            >
              <Briefcase className="h-3.5 w-3.5 text-[#f05a28]" />
              <span>Service professional? Join as Provider Partner →</span>
            </Link>
          </div>
        </div>

        {/* 5. Mobile 3-Step Process Conduit */}
        <div className="w-full p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-orange-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#c2410c] px-0.5">
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-[#f05a28]" />
              <span>How OmniService Works</span>
            </span>
            <span className="text-neutral-400 font-sans text-[10px]">3 Simple Steps</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-orange-50/70 border border-orange-100">
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-[#f05a28] to-[#ea580c] text-white text-[10px] font-black shadow-xs mb-1">
                1
              </span>
              <p className="text-[11px] font-extrabold text-[#2d130a] leading-tight">Video Intake</p>
              <p className="text-[9px] text-neutral-500 font-sans mt-0.5">AI Diagnosis</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-orange-50/70 border border-orange-100">
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-[#f05a28] text-white text-[10px] font-black shadow-xs mb-1">
                2
              </span>
              <p className="text-[11px] font-extrabold text-[#2d130a] leading-tight">Locked Price</p>
              <p className="text-[9px] text-neutral-500 font-sans mt-0.5">Escrow Safe</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-orange-50/70 border border-orange-100">
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-[10px] font-black shadow-xs mb-1">
                3
              </span>
              <p className="text-[11px] font-extrabold text-[#2d130a] leading-tight">Dispatched</p>
              <p className="text-[9px] text-neutral-500 font-sans mt-0.5">OEM Spares</p>
            </div>
          </div>
        </div>

        {/* 6. Mobile Trust Metrics 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2 w-full pt-1">
          <div className="p-2.5 rounded-xl bg-white/90 border border-orange-200/70 shadow-2xs">
            <span className="text-base font-black text-[#2d130a] block leading-none">₹14.8L+</span>
            <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider mt-1 block">Escrow Protected</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/90 border border-orange-200/70 shadow-2xs">
            <span className="text-base font-black text-emerald-700 block leading-none">0.12%</span>
            <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider mt-1 block">Dispute Rate</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/90 border border-orange-200/70 shadow-2xs">
            <span className="text-base font-black text-[#2d130a] block leading-none">15 Sec</span>
            <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider mt-1 block">AI Intake Time</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/90 border border-orange-200/70 shadow-2xs">
            <span className="text-base font-black text-[#f05a28] block leading-none">100%</span>
            <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider mt-1 block">Price Ceiling</span>
          </div>
        </div>
      </div>
    </section>
  );
}
