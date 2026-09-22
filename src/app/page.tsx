"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  ChevronLeft,
  AlertCircle,
  Phone,
  Mail,
  Lock,
  User,
  LogOut,
  Activity,
  Bot,
  Compass,
} from "lucide-react";
import { HomeDiagnosticChat } from "@/components/ai/HomeDiagnosticChat";

// ── Interactive Simulation Data (Full-Width Flow Section) ──────────────────────
const SIMULATION_STEPS = [
  {
    id: "intake",
    stepNumber: "01",
    label: "1. Visual Intake",
    tag: "Camera & Audio Scan",
    title: "12-Second Multimodal Video Diagnostic",
    description: "Customer records the appliance or fixture. InspectAI analyzes video frames and high-frequency audio signatures across Gemini models.",
    data: {
      scanStatus: "Analyzing audio frequency & motor shudder...",
      detection: "Split AC Compressor Shudder @ 48Hz",
      confidence: "98.7% Neural Match (Gemini 3.5 Flash)",
      secondaryCheck: "Capacitance loss detected in dual-run hermetic terminal",
    },
  },
  {
    id: "scope",
    stepNumber: "02",
    label: "2. Locked SOW",
    tag: "Fair-Market Pricing",
    title: "Immutable Scope & Price Ceiling Guarantee",
    description: "Required parts identified and fair labor locked before technician dispatch. No surprise on-site price renegotiation.",
    data: {
      part: "45μF Dual Run Motor Capacitor (OEM)",
      partCost: "₹750",
      labor: "Master HVAC Service & Terminal Cleaning (₹2,050)",
      totalCeiling: "₹2,800 Locked",
    },
  },
  {
    id: "dispatch",
    stepNumber: "03",
    label: "3. SmartRoute",
    tag: "Van Inventory Match",
    title: "Verified Pro & Mobile Van Stock Dispatch",
    description: "Matches nearby licensed technician who has the exact 45μF capacitor currently stocked on their mobile van inventory.",
    data: {
      pro: "CoolAir Solutions (4.9★ • 420 jobs)",
      vanInventory: "45μF Capacitor: 2 units in stock",
      distance: "1.2 km away • Ameerpet, Hyderabad",
      eta: "12 mins to doorstep",
    },
  },
  {
    id: "escrow",
    stepNumber: "04",
    label: "4. TrustLock Escrow",
    tag: "Photographic Proof",
    title: "Payment Released Post-Verification Only",
    description: "Pre-work and post-work photos pass AI verification before escrow funds release. Stamp permanently added to digital HomePass passport.",
    data: {
      escrowState: "₹2,800 Held Securely in Trustee Escrow",
      proofStatus: "Pre vs Post Photo Similarity: 94%",
      releaseStatus: "Released to Pro with 12% platform fee split",
      homepass: "Added to Digital Property Record",
    },
  },
];

// ── Interactive Quick Fault Scanner Data (Hero Right Column) ───────────────────
const HERO_SCANNER_PREVIEWS = [
  {
    id: "hvac",
    label: "HVAC & AC Shudder",
    icon: Flame,
    color: "#f05a28",
    fault: "Compressor Vibration & Capacitance Drift",
    frequency: "48Hz Motor Shudder",
    confidence: "98.7%",
    lockedCeiling: "₹2,800",
    eta: "12 mins",
    proMatch: "Apex AC Specialist (4.9★)",
  },
  {
    id: "electrical",
    label: "MCB Circuit Trip",
    icon: Zap,
    color: "#eab308",
    fault: "Neutral Ground Short in Geyser Loop",
    frequency: "50Hz Residual Leakage",
    confidence: "96.4%",
    lockedCeiling: "₹1,450",
    eta: "15 mins",
    proMatch: "VoltMaster Electric (5.0★)",
  },
  {
    id: "plumbing",
    label: "Concealed Pipe Leak",
    icon: Droplets,
    color: "#0284c7",
    fault: "P-Trap Washer Fatigue & Joint Calcification",
    frequency: "Acoustic Drip @ 2.4s interval",
    confidence: "95.8%",
    lockedCeiling: "₹1,850",
    eta: "18 mins",
    proMatch: "FlowCare Plumbers (4.8★)",
  },
  {
    id: "purifier",
    label: "RO Purifier TDS Alert",
    icon: Droplets,
    color: "#0d9488",
    fault: "RO Membrane Exhaustion & Low Pump Bar",
    frequency: "High TDS & Pump Churn",
    confidence: "97.2%",
    lockedCeiling: "₹1,499",
    eta: "20 mins",
    proMatch: "AquaPure Technicians (4.9★)",
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

interface LoggedUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: "customer" | "professional" | "admin";
}

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<LoggedUser | null>(null);
  const [activeSimIndex, setActiveSimIndex] = useState(0);
  const [simPlaying, setSimPlaying] = useState(true);
  const [selectedScannerId, setSelectedScannerId] = useState("hvac");

  // Authenticated user recall via localStorage & /api/auth/me
  useEffect(() => {
    try {
      const stored = localStorage.getItem("omniservice_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name && parsed?.role) {
          setCurrentUser(parsed);
        }
      }
    } catch {}

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.authenticated && data.user) {
          setCurrentUser(data.user);
          localStorage.setItem("omniservice_user", JSON.stringify(data.user));
        } else if (!data.authenticated) {
          setCurrentUser(null);
          localStorage.removeItem("omniservice_user");
        }
      })
      .catch(() => {});
  }, []);

  // Auto-cycle simulation steps silently (NO toasts)
  useEffect(() => {
    if (!simPlaying) return;
    const interval = setInterval(() => {
      setActiveSimIndex((prev) => (prev + 1) % SIMULATION_STEPS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [simPlaying]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("omniservice_user");
    document.cookie = "authjs.session-token=; path=/; max-age=0";
    document.cookie = "omniservice-role=; path=/; max-age=0";
    document.cookie = "omniservice-user=; path=/; max-age=0";
    setCurrentUser(null);
    router.refresh();
  };

  const currentStep = (SIMULATION_STEPS[activeSimIndex] ?? SIMULATION_STEPS[0])!;
  const currentScanner = (HERO_SCANNER_PREVIEWS.find((s) => s.id === selectedScannerId) || HERO_SCANNER_PREVIEWS[0])!;

  const getPortalLink = (role: string) => {
    switch (role) {
      case "admin":
        return { href: "/admin/dashboard", label: "Admin Console", badge: "Admin" };
      case "professional":
        return { href: "/pro/dashboard", label: "Pro Operations", badge: "Verified Pro" };
      default:
        return { href: "/customer/dashboard", label: "My Dashboard", badge: "Customer" };
    }
  };

  const portal = currentUser ? getPortalLink(currentUser.role) : null;

  return (
    <div
      className="min-h-screen bg-[#fafafa] text-neutral-900 font-serif selection:bg-[#f05a28]/10"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 1. TOP NAVBAR (BALANCED SPACING & JWT PERSISTENCE)                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full border-b border-orange-200/70 bg-[#fffbf7]/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-10 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Ameerpet Hub Badge */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center group" aria-label="OmniService AI Home">
              <Image
                src="/images/OmniService_Logo.png"
                alt="OmniService"
                width={200}
                height={50}
                className="h-9 sm:h-11 w-auto rounded-xl object-contain transition-transform group-hover:scale-102"
                priority
              />
            </Link>

            <span className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-[#c2410c] border border-orange-200/80 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#f05a28]" />
              Ameerpet Hub
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#431407]">
            <Link href="#lifecycle-flow" className="transition-colors hover:text-[#f05a28]">
              Lifecycle Flow
            </Link>
            <Link href="#how-it-works" className="transition-colors hover:text-[#f05a28]">
              How It Works
            </Link>
            <Link href="#categories" className="transition-colors hover:text-[#f05a28]">
              Trade Categories
            </Link>
            <Link href="#technology" className="transition-colors hover:text-[#f05a28]">
              AI Technology
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#f05a28]/70 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-0.5 text-xs font-bold text-[#c2410c] transition-all hover:bg-orange-100 hover:border-[#f05a28]"
            >
              <Eye className="h-3.5 w-3.5 text-[#f05a28]" />
              <span>Sandbox Demo</span>
            </Link>
          </nav>

          {/* Action CTAs: Authenticated vs Unauthenticated */}
          <div className="flex items-center gap-3">
            {currentUser && portal ? (
              <div className="flex items-center gap-3">
                {/* User Profile Pill */}
                <div className="hidden sm:flex items-center gap-2 rounded-xl border border-orange-200/90 bg-white/90 px-3 py-1.5 shadow-2xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#f05a28] to-[#ea580c] text-white text-xs font-black">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-[#2d130a] max-w-[110px] truncate leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="block text-[10px] font-semibold text-[#c2410c] capitalize">
                      {portal.badge}
                    </span>
                  </div>
                </div>

                {/* Direct Dashboard Link */}
                <Link
                  href={portal.href}
                  className="rounded-xl bg-gradient-to-r from-[#f05a28] to-[#ea580c] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm shadow-orange-500/25 hover:from-[#ea580c] hover:to-[#c2410c] transition-all flex items-center gap-1.5"
                >
                  <span>{portal.label}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="rounded-xl border border-orange-200 bg-white p-2 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
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
            )}
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 2. HERO SECTION (REDESIGNED: VALUE PROP + QUICK SCANNER CARD)       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden border-b border-orange-200/70 bg-gradient-to-b from-[#fffbf7] via-[#fff5eb] to-[#feede0] py-14 lg:py-22 emergent-mesh">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-[#f05a28]/25 via-amber-400/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-gradient-to-bl from-[#ea580c]/20 via-orange-300/25 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center relative z-10">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
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
                href="#lifecycle-flow"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-orange-300/80 bg-white/90 px-5 py-3.5 text-sm font-bold text-[#c2410c] hover:border-[#f05a28] hover:text-[#f05a28] hover:bg-orange-50/70 transition-all shadow-xs"
              >
                <Layers className="h-4 w-4 text-[#f05a28]" />
                <span>View Lifecycle Flow</span>
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

          {/* Right Column: AI Diagnostic Quick Scanner Preview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border-2 border-orange-200/90 bg-white/95 backdrop-blur-xl p-6 shadow-xl shadow-orange-950/10 relative overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-orange-100 pb-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f05a28]/10 text-[#f05a28]">
                    <Activity className="h-4 w-4 animate-pulse text-[#f05a28]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#2d130a] leading-tight">
                      InspectAI™ Live Diagnostic Scan
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Multi-Model Multimodal Vision &amp; Acoustic Inference
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Triage
                </span>
              </div>

              {/* Category Quick Chips */}
              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {HERO_SCANNER_PREVIEWS.map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedScannerId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedScannerId(p.id)}
                      className={`flex items-center gap-1.5 rounded-xl p-2 text-left transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-300 shadow-2xs font-bold text-[#c2410c]"
                          : "border border-neutral-200/80 bg-neutral-50/60 text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: p.color }} />
                      <span className="text-[11px] truncate">{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Simulated Spectrogram / Audio Waveform Preview */}
              <div className="rounded-2xl border border-orange-200/70 bg-gradient-to-br from-[#fff8f0] to-[#fff3e6] p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#2d130a] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#f05a28]" />
                    {currentScanner.fault}
                  </span>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                    {currentScanner.confidence} Neural Match
                  </span>
                </div>

                {/* Animated Frequency Bars */}
                <div className="flex items-center justify-between gap-1 h-9 bg-white/80 rounded-xl px-3 border border-orange-100">
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {currentScanner.frequency}
                  </span>
                  <div className="flex items-end gap-1 h-5">
                    <span className="w-1 bg-[#f05a28] rounded-full h-3 animate-pulse" />
                    <span className="w-1 bg-[#ea580c] rounded-full h-5 animate-pulse delay-75" />
                    <span className="w-1 bg-amber-500 rounded-full h-4 animate-pulse delay-150" />
                    <span className="w-1 bg-emerald-500 rounded-full h-2 animate-pulse delay-100" />
                    <span className="w-1 bg-[#f05a28] rounded-full h-4 animate-pulse" />
                  </div>
                </div>

                {/* Live Diagnostic Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="rounded-xl bg-white p-2.5 border border-orange-100">
                    <span className="text-[10px] text-neutral-500 block">Locked Price Ceiling</span>
                    <span className="text-base font-black text-[#f05a28] block">
                      {currentScanner.lockedCeiling}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-medium">Parts &amp; Labor Fixed</span>
                  </div>

                  <div className="rounded-xl bg-white p-2.5 border border-orange-100">
                    <span className="text-[10px] text-neutral-500 block">SmartRoute Dispatch</span>
                    <span className="text-base font-black text-emerald-700 block">
                      {currentScanner.eta}
                    </span>
                    <span className="text-[9px] text-neutral-600 truncate block">
                      Ameerpet Doorstep
                    </span>
                  </div>
                </div>

                {/* Bottom Trigger Action */}
                <Link
                  href="/register"
                  className="mt-1 flex items-center justify-center gap-1.5 w-full rounded-xl bg-gradient-to-r from-[#f05a28] to-[#ea580c] py-2.5 text-xs font-bold text-white shadow-sm hover:from-[#ea580c] hover:to-[#c2410c] transition-all"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Start 15-Sec Video Diagnostic</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 3. DEDICATED FULL-WIDTH SECTION: INTERACTIVE LIFECYCLE FLOW         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="lifecycle-flow"
        className="w-full px-6 sm:px-10 lg:px-16 py-16 lg:py-24 border-b border-orange-200/70 bg-[#fffdfa]"
      >
        <div className="max-w-7xl mx-auto w-full space-y-10">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/15 px-3.5 py-1 text-xs font-bold text-[#c2410c] uppercase tracking-wider border border-orange-200/80 shadow-2xs">
              Interactive Trust Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2d130a]">
              The OmniService Verified Trust Lifecycle
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Experience the end-to-step verification flow from instant 15-second video diagnosis to mobile van stock dispatch and TrustLock biometric escrow release.
            </p>
          </div>

          {/* 4-Step Horizontal Timeline Stepper */}
          <div className="relative">
            {/* Step Indicators Track */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SIMULATION_STEPS.map((s, idx) => {
                const isActive = activeSimIndex === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setActiveSimIndex(idx);
                      setSimPlaying(false);
                    }}
                    className={`relative rounded-2xl p-4 text-left border-2 transition-all ${
                      isActive
                        ? "border-[#f05a28] bg-white shadow-md shadow-orange-950/10 scale-102"
                        : "border-orange-100 bg-white/70 hover:bg-white hover:border-orange-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-black ${
                          isActive ? "text-[#f05a28]" : "text-neutral-400"
                        }`}
                      >
                        STEP {s.stepNumber}
                      </span>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? "bg-[#f05a28]/10 text-[#c2410c]"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {s.tag}
                      </span>
                    </div>
                    <h3
                      className={`text-sm font-bold truncate ${
                        isActive ? "text-[#2d130a]" : "text-neutral-700"
                      }`}
                    >
                      {s.label}
                    </h3>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stepper Detail Showcase Card */}
          <div className="rounded-3xl border-2 border-orange-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-orange-950/5 relative overflow-hidden">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-orange-100 gap-4">
              <div>
                <span className="inline-block rounded-full bg-[#f05a28]/10 px-3 py-1 text-xs font-bold text-[#c2410c] uppercase tracking-wider mb-1.5">
                  Stage {activeSimIndex + 1} of 4: {currentStep.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#2d130a]">
                  {currentStep.title}
                </h3>
                <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
                  {currentStep.description}
                </p>
              </div>

              {/* Auto-Play Toggle */}
              <button
                type="button"
                onClick={() => setSimPlaying(!simPlaying)}
                className="self-start sm:self-center rounded-xl border border-orange-200 bg-[#fff7ed] px-3.5 py-1.5 text-xs font-bold text-[#c2410c] hover:bg-orange-100 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Play className={`h-3.5 w-3.5 ${simPlaying ? "text-emerald-600" : "text-neutral-400"}`} />
                <span>{simPlaying ? "Auto-Cycling Active" : "Cycle Paused"}</span>
              </button>
            </div>

            {/* Interactive Step Data Breakdown */}
            <div className="py-6">
              {currentStep.id === "intake" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-orange-100 bg-[#fffbf7] p-5 space-y-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Multimodal Video Stream
                    </span>
                    <div className="text-base font-bold text-[#2d130a]">
                      12.4s Audio + Video Analyzed
                    </div>
                    <p className="text-xs text-neutral-600">
                      Synchronous video frame decomposition matching 48Hz compressor shudder.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-[#fffbf7] p-5 space-y-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Neural Confidence
                    </span>
                    <div className="text-base font-bold text-emerald-700">
                      {currentStep.data.confidence}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Evaluated through Gemini multi-model failover engine with 0ms downtime.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-[#fffbf7] p-5 space-y-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Secondary Verification
                    </span>
                    <div className="text-base font-bold text-[#f05a28]">
                      OEM Capacitor Drift
                    </div>
                    <p className="text-xs text-neutral-600">
                      {currentStep.data.secondaryCheck}
                    </p>
                  </div>
                </div>
              )}

              {currentStep.id === "scope" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-orange-100 bg-[#fffbf7] p-5 space-y-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Required Component
                    </span>
                    <div className="text-base font-bold text-[#2d130a]">
                      {currentStep.data.part}
                    </div>
                    <p className="text-xs text-emerald-700 font-bold">
                      OEM Part Cost: {currentStep.data.partCost}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-[#fffbf7] p-5 space-y-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Master Labor Schedule
                    </span>
                    <div className="text-base font-bold text-neutral-800">
                      {currentStep.data.labor}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Standardized rates across Ameerpet and Greater Hyderabad.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-5 space-y-2">
                    <span className="text-xs font-bold text-[#c2410c] uppercase tracking-wider">
                      Guaranteed Ceiling
                    </span>
                    <div className="text-2xl font-black text-[#f05a28]">
                      {currentStep.data.totalCeiling}
                    </div>
                    <p className="text-xs text-[#7c2d12]">
                      100% price lock guarantee before technician dispatch.
                    </p>
                  </div>
                </div>
              )}

              {currentStep.id === "dispatch" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-orange-100 bg-[#fffbf7] p-5 space-y-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Matched Professional
                    </span>
                    <div className="text-base font-bold text-[#2d130a]">
                      {currentStep.data.pro}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Police-verified, background checked, and certified master technician.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-[#fffbf7] p-5 space-y-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Mobile Van Stock Match
                    </span>
                    <div className="text-base font-bold text-emerald-700">
                      {currentStep.data.vanInventory}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Real-time inventory lookup avoids return trips for parts.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-[#fffbf7] p-5 space-y-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Geotargeted ETA
                    </span>
                    <div className="text-2xl font-black text-emerald-700">
                      {currentStep.data.eta}
                    </div>
                    <p className="text-xs text-neutral-600">
                      {currentStep.data.distance}
                    </p>
                  </div>
                </div>
              )}

              {currentStep.id === "escrow" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-orange-100 bg-[#fffbf7] p-5 space-y-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      TrustLock™ Escrow
                    </span>
                    <div className="text-base font-bold text-[#2d130a]">
                      {currentStep.data.escrowState}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Customer funds are locked in trustee account until job verification.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-[#fffbf7] p-5 space-y-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Visual AI Proof Verification
                    </span>
                    <div className="text-base font-bold text-emerald-700">
                      {currentStep.data.proofStatus}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Cryptographic matching between pre-work and post-work photos.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-[#fffbf7] p-5 space-y-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      HomePass™ Passport
                    </span>
                    <div className="text-base font-bold text-amber-700">
                      {currentStep.data.homepass}
                    </div>
                    <p className="text-xs text-neutral-600">
                      12-month digital warranty permanently logged into your asset passport.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="pt-4 border-t border-orange-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const prev = (activeSimIndex - 1 + SIMULATION_STEPS.length) % SIMULATION_STEPS.length;
                  setActiveSimIndex(prev);
                  setSimPlaying(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-orange-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Step</span>
              </button>

              <div className="text-xs text-neutral-400 font-medium">
                Step {activeSimIndex + 1} of {SIMULATION_STEPS.length}
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = (activeSimIndex + 1) % SIMULATION_STEPS.length;
                  setActiveSimIndex(next);
                  setSimPlaying(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#f05a28] to-[#ea580c] px-4 py-2 text-xs font-bold text-white hover:from-[#ea580c] hover:to-[#c2410c] transition-all shadow-sm"
              >
                <span>Next Lifecycle Step</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 4. HOW IT WORKS (THE 4 PILLARS • MAX-W-7XL • WARM CANVAS)           */}
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
              <h3 className="text-base font-bold text-[#2d130a]">15-Sec Video Intake</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Record a brief video of your malfunctioning fixture or appliance. InspectAI analyzes video frames and audio signatures to diagnose the root issue before anyone is dispatched.
              </p>
              <div className="pt-2 border-t border-orange-100 flex items-center gap-1.5 text-[11px] font-bold text-[#c2410c]">
                <Camera className="h-3.5 w-3.5 text-[#f05a28]" />
                <span>Multimodal Vision Triage</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border-2 border-orange-100 bg-white p-6 space-y-4 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-950/5 transition-all shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/20 text-[#c2410c] font-black text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-[#2d130a]">Locked Scope &amp; Price</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Fair-market price ceiling locked cryptographically before arrival. No surprise bills, no bait-and-switch, and zero on-site renegotiation.
              </p>
              <div className="pt-2 border-t border-orange-100 flex items-center gap-1.5 text-[11px] font-bold text-[#c2410c]">
                <Shield className="h-3.5 w-3.5 text-[#f05a28]" />
                <span>Zero Renegotiation</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border-2 border-orange-100 bg-white p-6 space-y-4 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-950/5 transition-all shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/20 text-[#c2410c] font-black text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-[#2d130a]">SmartRoute Dispatch</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We match only verified pros who already carry the diagnosed OEM replacement part on their mobile van inventory. First-time fix guaranteed.
              </p>
              <div className="pt-2 border-t border-orange-100 flex items-center gap-1.5 text-[11px] font-bold text-[#c2410c]">
                <Truck className="h-3.5 w-3.5 text-[#f05a28]" />
                <span>Single-Trip Resolution</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-2xl border-2 border-orange-100 bg-white p-6 space-y-4 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-950/5 transition-all shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/20 text-[#c2410c] font-black text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-[#2d130a]">TrustLock™ Escrow</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Your payment sits protected in escrow. Funds release to the technician only after pre-work and post-work photos pass verified AI inspection.
              </p>
              <div className="pt-2 border-t border-orange-100 flex items-center gap-1.5 text-[11px] font-bold text-[#c2410c]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Post-Inspection Release</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 5. SERVICE CATEGORIES (GRID VIEW)                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="categories" className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-24 border-b border-orange-200/70 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto w-full space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/15 px-3.5 py-1 text-xs font-bold text-[#c2410c] uppercase tracking-wider border border-orange-200/80 shadow-2xs">
              Specialized Trades
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2d130a]">
              Certified Trades in Ameerpet &amp; Hyderabad
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Every trade is handled by verified specialists equipped with calibrated instruments and genuine OEM spare parts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl border-2 border-orange-100 bg-white p-6 space-y-4 hover:border-orange-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-500">
                      {cat.jobsCount}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#2d130a]">{cat.name}</h3>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-orange-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Avg Response</span>
                      <span className="font-bold text-neutral-800">{cat.avgTime}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block">Price Range</span>
                      <span className="font-bold text-[#f05a28]">{cat.priceRange}</span>
                    </div>
                  </div>

                  <Link
                    href={`/register?category=${cat.id}`}
                    className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-orange-200 bg-[#fffbf7] py-2 text-xs font-bold text-[#c2410c] hover:bg-orange-100 hover:border-orange-300 transition-colors"
                  >
                    <span>Book AI Diagnostic</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 6. AI TECHNOLOGY SPOTLIGHT                                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="technology" className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-24 border-b border-orange-200/70 bg-gradient-to-b from-white to-[#fff8f0]">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block rounded-full bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-[#c2410c] uppercase tracking-wider border border-orange-200/80">
              Multi-Model AI Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2d130a]">
              Intelligent Forensic AI Without Single-Model Bottlenecks
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              OmniService InspectAI dynamically orchestrates between Google Gemini 3.5 Flash, Gemini 3.1 Flash Lite, and multimodal vision engines. If any model experiences quota limits or demand spikes, our failover pipeline instantaneously switches models in real time without downtime.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-orange-200/70 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block font-bold">Dynamic Model Failover</strong>
                  <span className="text-neutral-600">Zero single-point-of-failure with automatic rotation across modern Gemini models.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-orange-200/70 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block font-bold">Acoustic &amp; Visual Anomaly Matching</strong>
                  <span className="text-neutral-600">Spectrogram audio frequency and video frame analysis pinpoint failure modes accurately.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-orange-200/70 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block font-bold">Immutable Price Ceiling Cryptography</strong>
                  <span className="text-neutral-600">Scopes of Work are cryptographically locked, preventing post-arrival price gouging.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border-2 border-orange-200 bg-white p-8 shadow-xl shadow-orange-950/5 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-orange-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f05a28]/10 text-[#f05a28]">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2d130a]">InspectAI Active Engine Status</h3>
                    <p className="text-[11px] text-neutral-500">Live Health Across Generative AI Endpoints</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <Check className="h-3 w-3" /> Operational
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#fffbf7] border border-orange-100">
                  <span className="font-semibold text-neutral-800">Primary Inference: Gemini 3.5 Flash</span>
                  <span className="text-emerald-700 font-bold">Active (0ms latency)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#fffbf7] border border-orange-100">
                  <span className="font-semibold text-neutral-800">Low-Latency Fallback: Gemini 3.1 Flash Lite</span>
                  <span className="text-emerald-700 font-bold">Standby Ready</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#fffbf7] border border-orange-100">
                  <span className="font-semibold text-neutral-800">Triage Engine: InspectAI Diagnostic Stream</span>
                  <span className="text-emerald-700 font-bold">Connected</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-200 text-xs text-[#7c2d12]">
                💬 <strong>Try the free AI Diagnostic Assistant</strong> using the floating button in the bottom right corner. Get 5 free diagnostic triage messages on your device without signing in.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 7. FOOTER                                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <footer className="w-full bg-[#1c0d08] text-neutral-300 py-16 px-6 sm:px-10 lg:px-16 border-t border-orange-950">
        <div className="max-w-7xl mx-auto w-full space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/OmniService_Logo.png"
                  alt="OmniService AI"
                  width={180}
                  height={45}
                  className="h-9 w-auto brightness-200 contrast-125 rounded-lg"
                />
              </Link>
              <p className="text-xs text-neutral-400 leading-relaxed">
                The trusted home services platform across Ameerpet and Greater Hyderabad. AI diagnostics, locked price ceilings, and verified escrow protection.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#f05a28]" />
                  <a href="tel:+918624851910" className="hover:text-white transition-colors">
                    +91 86248 51910
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#f05a28]" />
                  <a href="mailto:volcanic.digitalsolutions@gmail.com" className="hover:text-white transition-colors">
                    volcanic.digitalsolutions@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#f05a28]" />
                  <span>Ameerpet, Hyderabad, Telangana 500016</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="#lifecycle-flow" className="hover:text-[#f05a28] transition-colors">Lifecycle Flow</Link></li>
                <li><Link href="#how-it-works" className="hover:text-[#f05a28] transition-colors">How It Works</Link></li>
                <li><Link href="#categories" className="hover:text-[#f05a28] transition-colors">Trade Categories</Link></li>
                <li><Link href="/demo" className="hover:text-[#f05a28] transition-colors">Sandbox Demo</Link></li>
                <li><Link href="/register" className="hover:text-[#f05a28] transition-colors">Book AI Diagnostic</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Portals</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/customer/dashboard" className="hover:text-[#f05a28] transition-colors">Customer Portal</Link></li>
                <li><Link href="/pro/dashboard" className="hover:text-[#f05a28] transition-colors">Pro Operations</Link></li>
                <li><Link href="/admin/dashboard" className="hover:text-[#f05a28] transition-colors">Governance Admin</Link></li>
                <li><Link href="/professional/register" className="hover:text-[#f05a28] transition-colors">Join as Pro Partner</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Trust &amp; Governance</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/privacy" className="hover:text-[#f05a28] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#f05a28] transition-colors">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-[#f05a28] transition-colors">Support &amp; Safety</Link></li>
                <li><span className="text-neutral-400">Escrow Protected (TrustLock™)</span></li>
              </ul>
            </div>
          </div>

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

      {/* Floating 5-Message AI Diagnostic Chat Option */}
      <HomeDiagnosticChat />
    </div>
  );
}
