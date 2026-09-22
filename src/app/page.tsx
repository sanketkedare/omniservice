"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Camera,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  Shield,
  Layers,
  MapPin,
  Play,
  Wrench,
  Zap,
  Droplets,
  Flame,
  Home,
  Check,
  ChevronRight,
  AlertCircle,
  Phone,
  Mail,
  Lock,
} from "lucide-react";
import { toast } from "@/components/ui/Toast";

// ── Interactive Simulation Data ──────────────────────────────────────────────
const SIMULATION_STEPS = [
  {
    id: "intake",
    label: "1. Visual Intake",
    tag: "Camera & Audio Scan",
    title: "12-Second Video Diagnostic",
    description: "Customer records the appliance or fixture. InspectAI analyzes video frames and sound signatures.",
    data: {
      scanStatus: "Analyzing audio frequency & motor shudder...",
      detection: "Split AC Compressor Shudder @ 48Hz",
      confidence: "98.7% Neural Match",
    },
  },
  {
    id: "scope",
    label: "2. Locked SOW",
    tag: "Fair-Market Pricing",
    title: "Immutable Scope & Price Ceiling",
    description: "Parts identified and fair labor locked before dispatch. No on-site price renegotiation.",
    data: {
      part: "45μF Dual Run Motor Capacitor (OEM)",
      partCost: "₹750",
      labor: "Master HVAC Service & Terminal Cleaning (₹2,050)",
      totalCeiling: "₹2,800 Locked",
    },
  },
  {
    id: "dispatch",
    label: "3. SmartRoute",
    tag: "Van Inventory Match",
    title: "Verified Pro & Mobile Van Stock",
    description: "Matches nearby licensed technician who has the exact 45μF capacitor currently on van inventory.",
    data: {
      pro: "CoolAir Solutions (4.9★ • 420 jobs)",
      vanInventory: "45μF Capacitor: 2 units in stock",
      distance: "1.2 km away • Ameerpet, Hyderabad",
      eta: "12 mins to doorstep",
    },
  },
  {
    id: "escrow",
    label: "4. TrustLock Escrow",
    tag: "Photographic Proof",
    title: "Payment Released Post-Verification",
    description: "Pre-work and post-work photos pass AI verification before funds release. Added to HomePass passport.",
    data: {
      escrowState: "₹2,800 Held in Trustee Account",
      proofStatus: "Pre vs Post Photo Similarity: 94%",
      releaseStatus: "Released to Pro with 12% fee split",
      homepass: "Added to Digital Property Record",
    },
  },
];

// ── Service Categories ────────────────────────────────────────────────────────
const SERVICE_CATEGORIES = [
  {
    id: "hvac",
    name: "Air Conditioning & HVAC",
    icon: Flame,
    color: "#f05a28",
    description: "Inverter AC diagnostics, compressor failures, gas leakage, coil replacement & seasonal deep cleaning.",
    avgTime: "45 mins",
    priceRange: "₹499 – ₹3,200",
    jobsCount: "1,420+ completed",
  },
  {
    id: "electrical",
    name: "Electrical Systems & MCBs",
    icon: Zap,
    color: "#eab308",
    description: "Short circuit detection, distribution boards, MCB tripping, wiring faults & heavy load automation.",
    avgTime: "30 mins",
    priceRange: "₹349 – ₹2,400",
    jobsCount: "980+ completed",
  },
  {
    id: "plumbing",
    name: "Advanced Plumbing & Drainage",
    icon: Droplets,
    color: "#0284c7",
    description: "Concealed pipe leaks, motorized valves, pressure booster pumps, fixture replacements & drainage.",
    avgTime: "40 mins",
    priceRange: "₹399 – ₹2,800",
    jobsCount: "1,150+ completed",
  },
  {
    id: "appliances",
    name: "Heavy Kitchen Appliances",
    icon: Wrench,
    color: "#16a34a",
    description: "Front-load washing machines, microwave inverters, dishwashers, refrigerators & chimney motors.",
    avgTime: "60 mins",
    priceRange: "₹599 – ₹4,500",
    jobsCount: "820+ completed",
  },
  {
    id: "purifiers",
    name: "Water Purifiers & RO Systems",
    icon: Droplets,
    color: "#0d9488",
    description: "RO membrane replacement, booster pump pressure check, TDS adjustment & UV chamber servicing.",
    avgTime: "35 mins",
    priceRange: "₹450 – ₹2,600",
    jobsCount: "670+ completed",
  },
  {
    id: "homepass",
    name: "HomePass Asset Inspections",
    icon: Home,
    color: "#9333ea",
    description: "Full property digital health passporting, asset tag audits, electrical safety audits & warranty logs.",
    avgTime: "90 mins",
    priceRange: "₹1,499 Flat",
    jobsCount: "410+ properties",
  },
];

export default function HomePage() {
  const [activeSimIndex, setActiveSimIndex] = useState(0);
  const [simPlaying, setSimPlaying] = useState(true);

  // Auto-cycle simulation steps if playing
  useEffect(() => {
    if (!simPlaying) return;
    const interval = setInterval(() => {
      setActiveSimIndex((prev) => (prev + 1) % SIMULATION_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [simPlaying]);

  const currentStep = (SIMULATION_STEPS[activeSimIndex] ?? SIMULATION_STEPS[0])!;

  return (
    <div
      className="min-h-screen bg-[#fafafa] text-neutral-900 font-serif selection:bg-[#f05a28]/10"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 1. TOP NAVBAR (MAX-W-7XL • WARM RADIANT LIGHT MODE)                 */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full border-b border-orange-200/70 bg-[#fffbf7]/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group" aria-label="OmniService AI Home">
              <Image
                src="/images/OmniService_Logo.png"
                alt="OmniService"
                width={220}
                height={55}
                className="h-10 sm:h-12 w-auto rounded-xl object-contain transition-transform group-hover:scale-102"
                priority
              />
            </Link>

            <span className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/15 px-3 py-1 text-xs font-bold text-[#c2410c] border border-orange-200/80 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#f05a28]" />
              Ameerpet, Hyderabad Hub
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#431407]">
            <Link href="#how-it-works" className="transition-colors hover:text-[#f05a28]">
              How It Works
            </Link>
            <Link href="#categories" className="transition-colors hover:text-[#f05a28]">
              Trade Categories
            </Link>
            <Link href="#technology" className="transition-colors hover:text-[#f05a28]">
              AI Technology
            </Link>
            <Link href="#comparison" className="transition-colors hover:text-[#f05a28]">
              Why OmniService
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#f05a28]/70 bg-gradient-to-r from-orange-50 to-amber-50 px-3.5 py-1 text-xs font-bold text-[#c2410c] transition-all hover:bg-orange-100 hover:border-[#f05a28]"
            >
              <Eye className="h-3.5 w-3.5 text-[#f05a28]" />
              <span>See Demo</span>
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-orange-200/90 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#c2410c] hover:bg-orange-50/70 hover:border-orange-300 transition-colors shadow-2xs"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-[#f05a28] to-[#ea580c] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-orange-500/25 hover:from-[#ea580c] hover:to-[#c2410c] transition-all hover:scale-102 flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 2. HERO SECTION (EMERGENT ANIMATED GRADIENT CANVAS • MAX-W-7XL)     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden border-b border-orange-200/70 bg-gradient-to-b from-[#fffbf7] via-[#fff5eb] to-[#feede0] py-14 lg:py-24 emergent-mesh">
        {/* Emergent Animated Glowing Ambient Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-[#f05a28]/25 via-amber-400/20 to-transparent blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-gradient-to-bl from-[#ea580c]/20 via-orange-300/25 to-transparent blur-3xl pointer-events-none animate-float-delayed" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-400/20 to-orange-200/10 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500/10 via-amber-500/15 to-orange-500/10 px-3.5 py-1 text-xs font-bold text-[#c2410c] border border-orange-300/70 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-[#f05a28]" />
                Ameerpet, Hyderabad Local Services
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                TrustLock Protected Escrow
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-[#2d130a] leading-[1.12]">
              Show the problem.{" "}
              <span className="bg-gradient-to-r from-[#f05a28] via-[#ea580c] to-[#c2410c] bg-clip-text text-transparent">
                Let AI diagnose it.
              </span>{" "}
              Pay only when verified.
            </h1>

            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed max-w-2xl">
              OmniService AI replaces blind technician guesswork with 15-second video diagnostics, locked fair-market price ceilings, and verified mobile van dispatch across Ameerpet and Greater Hyderabad. Your money stays in escrow until pre- and post-work photos pass verified AI inspection.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f05a28] via-[#ea580c] to-[#d04618] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all hover:scale-102"
              >
                <Camera className="h-4 w-4" />
                <span>Book AI Diagnostic</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-orange-300/80 bg-white/90 px-5 py-3.5 text-sm font-bold text-[#c2410c] hover:border-[#f05a28] hover:text-[#f05a28] hover:bg-orange-50/70 transition-all shadow-xs"
              >
                <Eye className="h-4 w-4 text-[#f05a28]" />
                <span>See Demo (Sandbox)</span>
              </Link>

              <Link
                href="/professional/register"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-orange-200/80 bg-white/80 px-4 py-3.5 text-sm font-semibold text-[#7c2d12] hover:bg-white hover:border-orange-300 transition-colors"
              >
                <span>Join as Pro</span>
              </Link>
            </div>

            {/* Live Trust Metrics Row */}
            <div className="pt-6 border-t border-orange-200/70 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-2xl font-black text-[#2d130a] block">₹14.8L+</span>
                <span className="text-xs text-neutral-600 font-medium">Escrow Protected</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-700 block">0.12%</span>
                <span className="text-xs text-neutral-600 font-medium">Dispute Rate</span>
              </div>
              <div>
                <span className="text-2xl font-black text-[#2d130a] block">15 Sec</span>
                <span className="text-xs text-neutral-600 font-medium">Video Intake</span>
              </div>
              <div>
                <span className="text-2xl font-black text-[#f05a28] block">100%</span>
                <span className="text-xs text-neutral-600 font-medium">Locked Price Ceiling</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive InspectAI Simulator */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border-2 border-orange-200/90 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-orange-950/10 relative overflow-hidden orange-halo">
              {/* Subtle top glow */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-[#f05a28]/20 to-transparent blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-orange-100 pb-4 mb-5 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/20 text-[#f05a28]">
                    <Sparkles className="h-4 w-4 text-[#f05a28]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2d130a] leading-tight">
                      InspectAI™ Live Lifecycle Simulator
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Interactive step-by-step diagnostic to escrow release
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSimPlaying(!simPlaying)}
                  className="rounded-lg border border-orange-200 bg-[#fff7ed] px-2.5 py-1 text-[11px] font-semibold text-[#c2410c] hover:bg-orange-100/70 transition-colors flex items-center gap-1"
                >
                  <Play className={`h-3 w-3 ${simPlaying ? "text-emerald-600" : "text-neutral-400"}`} />
                  <span>{simPlaying ? "Auto-Playing" : "Paused"}</span>
                </button>
              </div>

              {/* Step Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-2xl bg-[#fff0e6] p-1.5 mb-5 border border-orange-200/60 relative z-10">
                {SIMULATION_STEPS.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setActiveSimIndex(idx);
                      setSimPlaying(false);
                      toast.info(`Switched simulator to Step ${idx + 1}: ${s.tag}`);
                    }}
                    className={`rounded-xl py-2 px-2 text-center text-xs font-semibold transition-all ${
                      activeSimIndex === idx
                        ? "bg-white text-[#c2410c] shadow-xs border border-orange-300/80 font-bold"
                        : "text-neutral-600 hover:text-[#c2410c]"
                    }`}
                  >
                    <span className="block truncate">{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Step Display Card */}
              <div className="rounded-2xl border border-orange-200/80 bg-gradient-to-br from-[#fff7ed] via-white to-[#fff2e8] p-5 space-y-4 relative z-10 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block rounded-full bg-[#f05a28]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#c2410c] uppercase tracking-wider">
                      {currentStep.tag}
                    </span>
                    <h4 className="text-base font-bold text-[#2d130a] mt-1">
                      {currentStep.title}
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {currentStep.description}
                    </p>
                  </div>
                </div>

                {/* Simulated Step Specific Data */}
                <div className="rounded-xl border border-orange-100 bg-white/95 p-4 space-y-2 text-xs shadow-2xs">
                  {currentStep.id === "intake" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">Video Analysis Stream:</span>
                        <span className="font-semibold text-emerald-700">12.4s Audio + Video Analyzed</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">Identified Fault:</span>
                        <span className="font-bold text-[#2d130a]">{currentStep.data.detection}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">Neural Confidence:</span>
                        <span className="font-bold text-emerald-600">{currentStep.data.confidence}</span>
                      </div>
                    </div>
                  )}

                  {currentStep.id === "scope" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">Required Component:</span>
                        <span className="font-bold text-[#2d130a]">{currentStep.data.part}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">Component Price:</span>
                        <span className="font-semibold text-neutral-800">{currentStep.data.partCost}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">Labor &amp; Diagnostic:</span>
                        <span className="font-semibold text-neutral-800">{currentStep.data.labor}</span>
                      </div>
                      <div className="pt-2 border-t border-orange-100 flex items-center justify-between">
                        <span className="font-bold text-[#2d130a]">Total Price Ceiling:</span>
                        <span className="text-sm font-black text-[#f05a28]">{currentStep.data.totalCeiling}</span>
                      </div>
                    </div>
                  )}

                  {currentStep.id === "dispatch" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">Matched Pro:</span>
                        <span className="font-bold text-[#2d130a]">{currentStep.data.pro}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">Mobile Van Stock:</span>
                        <span className="font-bold text-emerald-700">{currentStep.data.vanInventory}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">Geotargeted Location:</span>
                        <span className="font-semibold text-neutral-800">{currentStep.data.distance}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">Real-Time ETA:</span>
                        <span className="font-bold text-emerald-600">{currentStep.data.eta}</span>
                      </div>
                    </div>
                  )}

                  {currentStep.id === "escrow" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">Escrow Security:</span>
                        <span className="font-semibold text-neutral-800">{currentStep.data.escrowState}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">Photo Proof Match:</span>
                        <span className="font-bold text-emerald-700">{currentStep.data.proofStatus}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">Payout Action:</span>
                        <span className="font-semibold text-neutral-900">{currentStep.data.releaseStatus}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span className="text-neutral-500">HomePass Passport:</span>
                        <span className="font-bold text-amber-700">{currentStep.data.homepass}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulated Action */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-neutral-400">
                    Step {activeSimIndex + 1} of {SIMULATION_STEPS.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (activeSimIndex + 1) % SIMULATION_STEPS.length;
                      setActiveSimIndex(next);
                      const stepTag = (SIMULATION_STEPS[next] ?? SIMULATION_STEPS[0])!.tag;
                      toast.success(`Advanced to Step ${next + 1}: ${stepTag}`);
                    }}
                    className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#f05a28] to-[#ea580c] px-3.5 py-1.5 text-xs font-semibold text-white hover:from-[#ea580c] hover:to-[#c2410c] transition-all shadow-sm"
                  >
                    <span>Next Lifecycle Step</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 3. HOW IT WORKS (THE 4 PILLARS • MAX-W-7XL • WARM CANVAS)           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-24 border-b border-orange-200/70 bg-[#fffdfa]">
        <div className="max-w-7xl mx-auto w-full space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/15 px-3.5 py-1 text-xs font-bold text-[#c2410c] uppercase tracking-wider border border-orange-200/80 shadow-2xs">
              End-To-End Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2d130a]">
              How OmniService AI Works
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Every job follows a verified 4-step trust lifecycle — eliminating price disputes, multiple trips for parts, and unverified workmanship across Ameerpet and Greater Hyderabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="rounded-2xl border-2 border-orange-100 bg-white p-6 space-y-4 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-950/5 transition-all shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/20 text-[#c2410c] font-black text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-[#2d130a]">
                15-Second Video Intake
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Show, don&apos;t guess. Point your camera at the problem. InspectAI isolates sound signatures, extracts appliance model tags, and identifies failed components.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#f05a28] flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Zero phone-call back-and-forth</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border-2 border-orange-100 bg-white p-6 space-y-4 hover:border-amber-300 hover:shadow-lg hover:shadow-orange-950/5 transition-all shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 font-black text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-[#2d130a]">
                Locked Scope &amp; Price Ceiling
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Our pricing engine calculates fair-market parts and labor in ₹ INR based on real city benchmarks. The price ceiling is locked into escrow before any tech is dispatched.
              </p>
              <div className="pt-2 text-xs font-semibold text-amber-800 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>No on-site price surprises</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border-2 border-orange-100 bg-white p-6 space-y-4 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-950/5 transition-all shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/15 to-orange-500/25 text-[#c2410c] font-black text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-[#2d130a]">
                SmartRoute Van Dispatch
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Matches vetted local technicians based on verified van inventory. The pro arrives on the first trip with the exact replacement capacitor, valve, or PCB required.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#c2410c] flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>94% first-visit resolution</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-2xl border-2 border-orange-100 bg-white p-6 space-y-4 hover:border-emerald-300 hover:shadow-lg hover:shadow-orange-950/5 transition-all shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 font-black text-sm">
                04
              </div>
              <h3 className="text-lg font-bold text-[#2d130a]">
                TrustLock Verification &amp; Passport
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                The pro uploads pre- and post-work photos. InspectAI validates completion, releases escrow payout, and registers maintenance records into your HomePass passport.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Tamper-proof digital records</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 4. TRADE CATEGORIES CATALOG (MAX-W-7XL • WARM PEACH GRADIENT)       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="categories" className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-24 border-b border-orange-200/70 bg-gradient-to-b from-[#fff5eb] to-[#fffaf5]">
        <div className="max-w-7xl mx-auto w-full space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/15 px-3.5 py-1 text-xs font-bold text-[#c2410c] uppercase tracking-wider border border-orange-200/80 mb-2 shadow-2xs">
                Certified Trade Categories
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2d130a]">
                Transparent Local Services In Ameerpet, Hyderabad
              </h2>
            </div>
            <Link
              href="/register"
              className="text-xs sm:text-sm font-bold text-[#f05a28] hover:underline flex items-center gap-1"
            >
              <span>Explore All Trade Categories</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl border-2 border-orange-100 bg-white/95 p-6 space-y-4 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-950/10 transition-all group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-600 bg-[#fff7ed] border border-orange-200/60 px-2.5 py-1 rounded-full">
                      Avg {cat.avgTime}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#2d130a] group-hover:text-[#f05a28] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-orange-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Fair Price Range</span>
                      <span className="font-bold text-[#2d130a]">{cat.priceRange}</span>
                    </div>
                    <Link
                      href="/register"
                      className="rounded-xl bg-[#fff7ed] border border-orange-200 px-3.5 py-1.5 font-bold text-[#c2410c] hover:bg-gradient-to-r hover:from-[#f05a28] hover:to-[#ea580c] hover:text-white hover:border-[#f05a28] transition-all shadow-2xs"
                    >
                      Book Intake
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 5. WHY OMNISERVICE VS TRADITIONAL (COMPARISON MATRIX • MAX-W-7XL)   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="comparison" className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-24 border-b border-orange-200/70 bg-gradient-to-b from-[#fffaf5] to-[#fff5eb]">
        <div className="max-w-7xl mx-auto w-full space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block rounded-full bg-gradient-to-r from-orange-500/10 via-amber-500/15 to-orange-500/10 px-3.5 py-1 text-xs font-bold text-[#c2410c] uppercase tracking-wider border border-orange-200/80 shadow-2xs">
              The OmniService Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2d130a]">
              Why Homeowners Switch to OmniService AI
            </h2>
            <p className="text-sm text-neutral-600">
              A direct comparison between traditional local contractor chaos and our AI-governed standard in Ameerpet, Hyderabad.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-orange-200/80 bg-white overflow-hidden shadow-xl shadow-orange-950/5">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#24120c] via-[#2d130a] to-[#3b190f] text-white">
                  <th className="py-4 px-5 font-bold text-amber-200/90 uppercase tracking-wider text-xs">Dimension</th>
                  <th className="py-4 px-5 font-bold text-neutral-300 uppercase tracking-wider text-xs">Traditional Services</th>
                  <th className="py-4 px-5 font-bold text-white uppercase tracking-wider text-xs bg-[#f05a28]/90 border-l border-orange-400/30">OmniService AI Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                <tr className="hover:bg-[#fff9f4] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#2d130a]">1. Problem Diagnosis</td>
                  <td className="py-4 px-5 text-neutral-500">Unverified verbal guess after disassembling appliance</td>
                  <td className="py-4 px-5 font-bold text-[#2d130a] bg-[#fff7ed]/70 border-l border-orange-200/60 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#f05a28] shrink-0" />
                    <span>15-sec video + sound analysis via InspectAI</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#fff9f4] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#2d130a]">2. Pricing Transparency</td>
                  <td className="py-4 px-5 text-neutral-500">Arbitrary quote based on neighborhood or urgency</td>
                  <td className="py-4 px-5 font-bold text-[#2d130a] bg-[#fff7ed]/70 border-l border-orange-200/60 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#f05a28] shrink-0" />
                    <span>Locked fair-market ceiling based on Hyderabad benchmarks</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#fff9f4] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#2d130a]">3. Part Availability</td>
                  <td className="py-4 px-5 text-neutral-500">Technician visits, leaves to buy part, returns hours later</td>
                  <td className="py-4 px-5 font-bold text-[#2d130a] bg-[#fff7ed]/70 border-l border-orange-200/60 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#f05a28] shrink-0" />
                    <span>SmartRoute dispatches tech with verified van stock</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#fff9f4] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#2d130a]">4. Payment Protection</td>
                  <td className="py-4 px-5 text-neutral-500">Cash upfront with zero recourse if repair fails</td>
                  <td className="py-4 px-5 font-bold text-[#2d130a] bg-[#fff7ed]/70 border-l border-orange-200/60 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#f05a28] shrink-0" />
                    <span>TrustLock Escrow releases funds only post-verification</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#fff9f4] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#2d130a]">5. Maintenance Records</td>
                  <td className="py-4 px-5 text-neutral-500">Lost paper bills or forgotten maintenance history</td>
                  <td className="py-4 px-5 font-bold text-[#2d130a] bg-[#fff7ed]/70 border-l border-orange-200/60 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#f05a28] shrink-0" />
                    <span>HomePass™ permanent digital property passport</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 6. CALL TO ACTION (MAX-W-7XL • RADIANT ORANGE GRADIENT BANNER)      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-24 bg-gradient-to-b from-[#fff5eb] via-[#ffeedb] to-[#ffe5cf] border-b border-orange-200/70 relative overflow-hidden">
        {/* Ambient floating glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-orange-400/20 to-amber-300/10 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-tr from-[#f05a28]/15 to-orange-300/10 blur-3xl pointer-events-none animate-float-delayed" />

        <div className="max-w-7xl mx-auto w-full rounded-3xl border-2 border-orange-200/90 bg-white/95 backdrop-blur-xl p-8 sm:p-12 shadow-xl shadow-orange-950/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10 orange-halo">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500/10 via-amber-500/15 to-orange-500/10 px-3.5 py-1 text-xs font-bold text-[#c2410c] border border-orange-200/80 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#f05a28]" />
              Ameerpet &amp; Hyderabad Instant Dispatch
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2d130a] tracking-tight">
              Ready to fix your home without the headaches?
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Snap a 15-second video right now. Our AI engine will identify the root cause, quote a locked fair price, and match a verified technician near Ameerpet, Hyderabad.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-[#f05a28] via-[#ea580c] to-[#d04618] px-6 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all hover:scale-102 flex items-center justify-center gap-2"
            >
              <Camera className="h-4 w-4" />
              <span>Book Diagnostic Now</span>
            </Link>

            <Link
              href="/demo"
              className="rounded-xl border-2 border-orange-300/80 bg-white px-5 py-3.5 text-center text-sm font-bold text-[#c2410c] hover:border-[#f05a28] hover:text-[#f05a28] hover:bg-orange-50/70 transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Eye className="h-4 w-4 text-[#f05a28]" />
              <span>See Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 7. REDESIGNED FOOTER (MAX-W-7XL • DEEP EMBER ANCHOR)                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <footer className="w-full border-t border-[#331b12] bg-gradient-to-b from-[#1f100a] via-[#170c08] to-[#120805] text-neutral-300">
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Column 1: Brand & Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center group">
                <Image
                  src="/images/OmniService_Logo.png"
                  alt="OmniService"
                  width={210}
                  height={50}
                  className="h-11 w-auto rounded-xl object-contain transition-transform group-hover:scale-102 brightness-110"
                />
              </Link>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-sm leading-relaxed">
                OmniService AI by Volcanic.World. Local Solutions. Higher Standards. AI-verified diagnostics, locked price ceilings, and guaranteed escrow protection in Ameerpet, Hyderabad.
              </p>

              {/* Verified Contact Details */}
              <div className="space-y-2 pt-2 text-xs text-neutral-200">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#f05a28]" />
                  <a href="tel:9820012345" className="hover:text-white font-medium transition-colors">
                    +91 98200 12345
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#f05a28]" />
                  <a href="mailto:support@omniservice.world" className="hover:text-white font-medium transition-colors">
                    support@omniservice.world
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#f05a28]" />
                  <span>Ameerpet, Hyderabad, Telangana 500016</span>
                </div>
              </div>
            </div>

            {/* Column 2: Platform Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="#how-it-works" className="hover:text-[#f05a28] transition-colors">How It Works</Link></li>
                <li><Link href="#categories" className="hover:text-[#f05a28] transition-colors">Trade Categories</Link></li>
                <li><Link href="/demo" className="font-bold text-[#f05a28] hover:underline">See Demo (Sandbox)</Link></li>
                <li><Link href="/register" className="hover:text-[#f05a28] transition-colors">Book AI Diagnostic</Link></li>
              </ul>
            </div>

            {/* Column 3: Portals */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Portals
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/customer/dashboard" className="hover:text-[#f05a28] transition-colors">Customer App</Link></li>
                <li><Link href="/pro/dashboard" className="hover:text-[#f05a28] transition-colors">Pro Operations</Link></li>
                <li><Link href="/admin/dashboard" className="hover:text-[#f05a28] transition-colors">Admin Governance</Link></li>
                <li><Link href="/professional/register" className="hover:text-[#f05a28] transition-colors">Join as Pro Partner</Link></li>
              </ul>
            </div>

            {/* Column 4: Trust & Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Trust &amp; Governance
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/privacy" className="hover:text-[#f05a28] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#f05a28] transition-colors">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-[#f05a28] transition-colors">Support &amp; Safety</Link></li>
                <li><span className="text-neutral-400">Escrow Regulated (Trustee)</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Volcanic World Branding & Copyright */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span>Crafted by</span>
              <a
                href="https://volcanic.world"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white hover:text-[#f05a28] tracking-widest uppercase transition-colors"
              >
                VOLCANIC
              </a>
              <span>• Local Solutions. Higher Standards.</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-neutral-400">
              <span>© {new Date().getFullYear()} OmniService AI. All rights reserved.</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" /> Fiduciary Escrow Guarantee
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
