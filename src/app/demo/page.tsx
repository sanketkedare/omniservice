"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Briefcase,
  Shield,
  Layers,
  Sparkles,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Truck,
  DollarSign,
  TrendingUp,
  FileCheck,
  ArrowRight,
  Lock,
  Eye,
  Check,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { toast } from "@/components/ui/Toast";

type DemoDashboard = "customer" | "pro" | "admin" | "all";

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<DemoDashboard>("all");
  const [jobAccepted, setJobAccepted] = useState(false);
  const [escrowReleased, setEscrowReleased] = useState(false);

  const handleTabChange = (tab: DemoDashboard) => {
    setActiveTab(tab);
    const label =
      tab === "all"
        ? "All 3 Dashboards (Simultaneous Lifecycle)"
        : tab === "customer"
        ? "Customer Experience Hub"
        : tab === "pro"
        ? "Service Pro Operations Center"
        : "Operations Governance & Admin Center";
    toast.info("Switched Sandbox View", label);
  };

  const handleAcceptJob = () => {
    if (jobAccepted) return;
    setJobAccepted(true);
    toast.success(
      "Dispatch Accepted! Escrow Locked",
      "Assigned to CoolAir Solutions. Van stock reserved: 45μF Dual Run Capacitor. ₹2,800 held in trust."
    );
  };

  const handleReleaseEscrow = () => {
    toast.confirm(
      "Confirm Escrow Release?",
      "InspectAI verified 92% photo similarity. Release ₹2,464 to Pro and ₹336 platform fee?",
      {
        confirmLabel: "Release Escrow Payout",
        cancelLabel: "Cancel",
        onConfirm: () => {
          setEscrowReleased(true);
          toast.success(
            "TrustLock Payout Dispatched",
            "₹2,464 credited to Pro. ₹336 fee collected. Cryptographic token 0x8f2ae14 generated."
          );
        },
        onCancel: () => {
          toast.info("Action Cancelled", "Escrow remains held in trustee vault.");
        },
      }
    );
  };

  const handleReset = () => {
    setJobAccepted(false);
    setEscrowReleased(false);
    toast.info("Sandbox Reset", "All simulated job and escrow states have been restored.");
  };

  return (
    <div
      className="min-h-screen w-full bg-[#fffaf5] text-neutral-900 font-serif pb-24 selection:bg-[#f05a28]/20 relative overflow-hidden"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* Emergent Background Floating Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-orange-400/15 to-amber-300/10 blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-gradient-to-tr from-[#f05a28]/10 to-orange-300/10 blur-3xl pointer-events-none animate-float-delayed" />

      {/* ── Demo Top Navigation Bar (MAX-W-7XL) ── */}
      <header className="sticky top-0 z-40 w-full border-b border-orange-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center group">
              <Image
                src="/images/OmniService_Logo.png"
                alt="OmniService"
                width={190}
                height={46}
                className="h-10 w-auto rounded-xl object-contain transition-transform group-hover:scale-102"
                priority
              />
            </Link>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ameerpet, Hyderabad Sandbox (Mock Data)
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 rounded-2xl bg-[#fff0e6] p-1 border border-orange-200/80 overflow-x-auto max-w-full shadow-2xs">
            <button
              type="button"
              onClick={() => handleTabChange("all")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-white text-[#c2410c] shadow-xs border border-orange-300/80"
                  : "text-neutral-600 hover:text-[#c2410c]"
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-[#f05a28]" />
              <span>All Dashboards</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("customer")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "customer"
                  ? "bg-white text-[#c2410c] shadow-xs border border-orange-300/80"
                  : "text-neutral-600 hover:text-[#c2410c]"
              }`}
            >
              <User className="h-3.5 w-3.5 text-[#f05a28]" />
              <span>Customer Hub</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("pro")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "pro"
                  ? "bg-white text-[#c2410c] shadow-xs border border-orange-300/80"
                  : "text-neutral-600 hover:text-[#c2410c]"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5 text-amber-600" />
              <span>Pro Operations</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("admin")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "admin"
                  ? "bg-white text-[#c2410c] shadow-xs border border-orange-300/80"
                  : "text-neutral-600 hover:text-[#c2410c]"
              }`}
            >
              <Shield className="h-3.5 w-3.5 text-blue-600" />
              <span>Governance &amp; Admin</span>
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-orange-200 bg-[#fff7ed] px-3 py-1.5 text-xs font-semibold text-[#c2410c] hover:bg-orange-100 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Sandbox</span>
            </button>
            <Link
              href="/login"
              className="rounded-xl border border-orange-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 hover:border-orange-300 transition-colors"
            >
              Real Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-[#f05a28] via-[#ea580c] to-[#d04618] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:shadow-md hover:shadow-orange-500/20 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Sandbox Safety & Notice Banner (MAX-W-7XL) ── */}
      <div className="w-full px-6 sm:px-10 lg:px-12 pt-6">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border-2 border-orange-200/80 bg-white/95 p-5 shadow-sm shadow-orange-950/5 relative z-10 orange-halo">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-[#f05a28]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#2d130a]">
                Ameerpet, Hyderabad Sandbox Hub • 100% Mock Data
              </h1>
              <p className="text-xs text-neutral-500">
                Interact with all 3 role portals freely. Real production accounts and MongoDB databases are fully isolated with zero credentials exposed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              App Security Intact (RBAC Active)
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Container (MAX-W-7XL) ── */}
      <main className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12 pt-8 space-y-12 relative z-10">
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 1. CUSTOMER DASHBOARD (DUMMY DATA)                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {(activeTab === "all" || activeTab === "customer") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-orange-200/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/15 text-[#c2410c] font-black text-xs">
                  1
                </span>
                <h2 className="text-xl font-bold text-[#2d130a]">
                  Customer Experience Portal (Simulated)
                </h2>
                <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-bold text-[#c2410c] border border-orange-200/60">
                  Customer View
                </span>
              </div>
              {activeTab === "all" && (
                <button
                  type="button"
                  onClick={() => handleTabChange("customer")}
                  className="text-xs font-bold text-[#f05a28] hover:underline flex items-center gap-1"
                >
                  Expand Dedicated Customer View <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Customer Card */}
            <div className="rounded-3xl border-2 border-orange-200/80 bg-white p-6 sm:p-8 shadow-md shadow-orange-950/5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 pb-5">
                <div>
                  <h3 className="text-lg font-bold text-[#2d130a]">
                    Welcome back, Sanket Kedare
                  </h3>
                  <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-[#f05a28]" />
                    Skyline Greens, Apt 402, Ameerpet, Hyderabad • HomePass Health Score: 94/100
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    HomePass Verified
                  </span>
                  <span className="rounded-xl border border-orange-200 bg-[#fff7ed] px-3.5 py-1 text-xs font-bold text-[#c2410c]">
                    1 Active Diagnostic
                  </span>
                </div>
              </div>

              {/* Active Diagnostic SOW Card */}
              <div className="rounded-2xl border-2 border-orange-200/80 bg-gradient-to-r from-[#fff7ed] via-white to-[#fff2e8] p-6 space-y-4 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/15 px-3 py-0.5 text-xs font-bold text-[#c2410c] border border-orange-200/80">
                      <Sparkles className="h-3.5 w-3.5 text-[#f05a28]" />
                      InspectAI Active Scope #SOW-4912
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-[#2d130a]">
                      Split AC Compressor Tripping MCB after 10 Mins
                    </h4>
                    <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed">
                      Customer uploaded 12s video showing compressor shudder. InspectAI neural diagnostic identified a degraded 45μF Dual Run Motor Capacitor causing high amp draw. Fair-market price ceiling locked for Ameerpet, Hyderabad.
                    </p>
                  </div>

                  <div className="text-left md:text-right shrink-0">
                    <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-bold block">
                      Locked Price Ceiling
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-[#f05a28]">
                      ₹2,800
                    </span>
                    <div className="text-xs text-emerald-700 font-bold flex items-center md:justify-end gap-1 mt-0.5">
                      <ShieldCheck className="h-4 w-4" />
                      Funds Held in Escrow
                    </div>
                  </div>
                </div>

                {/* Scope Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="rounded-xl border border-orange-200/70 bg-white p-4 shadow-2xs">
                    <span className="text-[11px] font-bold text-neutral-500 block uppercase">Required OEM Part</span>
                    <span className="text-sm font-bold text-[#2d130a] mt-0.5 block">45μF Dual Run Capacitor</span>
                    <span className="text-xs text-neutral-500">₹750 (Factory certified)</span>
                  </div>
                  <div className="rounded-xl border border-orange-200/70 bg-white p-4 shadow-2xs">
                    <span className="text-[11px] font-bold text-neutral-500 block uppercase">Labor &amp; Diagnostic</span>
                    <span className="text-sm font-bold text-[#2d130a] mt-0.5 block">Master HVAC Tech (45 min)</span>
                    <span className="text-xs text-neutral-500">₹2,050 (Terminal cleaning included)</span>
                  </div>
                  <div className="rounded-xl border border-orange-200/70 bg-white p-4 shadow-2xs">
                    <span className="text-[11px] font-bold text-neutral-500 block uppercase">Assigned Professional</span>
                    <span className="text-sm font-bold text-[#2d130a] mt-0.5 block">CoolAir Solutions Ameerpet (4.9★)</span>
                    <span className="text-xs text-emerald-700 font-bold">14 mins away (1.8 km)</span>
                  </div>
                </div>
              </div>

              {/* HomePass Passport Preview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                  HomePass Digital Appliance Passport
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-orange-200/60 bg-[#fffaf5] p-4 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-[#2d130a] block">Daikin 1.5T Inverter AC</span>
                      <span className="text-xs text-neutral-500">Serviced 14-Aug-2025</span>
                    </div>
                    <span className="rounded-xl bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      92% Optimal
                    </span>
                  </div>

                  <div className="rounded-2xl border border-orange-200/60 bg-[#fffaf5] p-4 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-[#2d130a] block">Bosch Series 4 Dishwasher</span>
                      <span className="text-xs text-neutral-500">Filter check due in 45 days</span>
                    </div>
                    <span className="rounded-xl bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      96% Optimal
                    </span>
                  </div>

                  <div className="rounded-2xl border border-orange-200/60 bg-[#fffaf5] p-4 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-[#2d130a] block">Havells 25L Digital Geyser</span>
                      <span className="text-xs text-neutral-500">Anode inspected Nov-2025</span>
                    </div>
                    <span className="rounded-xl bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      98% Optimal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 2. PRO OPERATIONS CENTER (DUMMY DATA)                               */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {(activeTab === "all" || activeTab === "pro") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-orange-200/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-[#c2410c] font-black text-xs">
                  2
                </span>
                <h2 className="text-xl font-bold text-[#2d130a]">
                  Service Professional Operations Center (Simulated)
                </h2>
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
                  Pro View
                </span>
              </div>
              {activeTab === "all" && (
                <button
                  type="button"
                  onClick={() => handleTabChange("pro")}
                  className="text-xs font-bold text-[#c2410c] hover:underline flex items-center gap-1"
                >
                  Expand Dedicated Pro View <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Pro Card */}
            <div className="rounded-3xl border-2 border-orange-200/80 bg-white p-6 sm:p-8 shadow-md shadow-orange-950/5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 pb-5">
                <div>
                  <h3 className="text-lg font-bold text-[#2d130a]">
                    CoolAir Solutions — Pro Operations Center
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Live SmartRoute dispatch &amp; van inventory for Ameerpet &amp; Greater Hyderabad.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Online • Ready for Dispatch
                  </span>
                </div>
              </div>

              {/* Financial KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-orange-200/70 bg-[#fffaf5] p-4">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Today&apos;s Revenue
                  </span>
                  <span className="text-2xl font-black text-[#2d130a] block mt-1">₹4,850</span>
                  <span className="text-xs text-emerald-600 font-bold">+18% vs last week</span>
                </div>

                <div className="rounded-2xl border border-orange-200/70 bg-[#fffaf5] p-4">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Active Jobs
                  </span>
                  <span className="text-2xl font-black text-[#2d130a] block mt-1">
                    {jobAccepted ? "3" : "2"}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {jobAccepted ? "2 in progress, 1 accepted" : "1 in progress, 1 scheduled"}
                  </span>
                </div>

                <div className="rounded-2xl border border-orange-200/70 bg-[#fffaf5] p-4">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    TrustLock Score
                  </span>
                  <span className="text-2xl font-black text-emerald-700 block mt-1">98.4%</span>
                  <span className="text-xs text-neutral-500">Zero disputed releases</span>
                </div>

                <div className="rounded-2xl border border-orange-200/70 bg-[#fffaf5] p-4">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Escrow Pending
                  </span>
                  <span className="text-2xl font-black text-[#f05a28] block mt-1">
                    {jobAccepted ? "₹10,000" : "₹7,200"}
                  </span>
                  <span className="text-xs text-neutral-500">Releases upon photo proof</span>
                </div>
              </div>

              {/* SmartRoute Instant Lead */}
              <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-[#fff7ed] via-white to-[#fff2e8] p-5 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#2d130a]">
                        Split AC Compressor Tripping MCB
                      </span>
                      <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-[#c2410c]">
                        Urgent (Within 2 hrs)
                      </span>
                    </div>
                    <span className="text-xs text-neutral-600 flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-[#f05a28]" />
                      SR Nagar, Ameerpet, Hyderabad (1.8 km away • 6 min drive)
                    </span>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[11px] text-neutral-500 font-bold block uppercase">Locked Scope Price</span>
                    <span className="text-xl font-black text-[#f05a28]">₹2,800</span>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-3.5 border border-orange-200/80 text-xs text-neutral-700 leading-relaxed shadow-2xs">
                  <strong className="text-[#2d130a]">InspectAI Verified Scope:</strong> Customer uploaded 12s video showing compressor shudder and instant 16A MCB trip. Required parts: 45μF Dual Run Capacitor + terminal connector cleaning. Van inventory check: <span className="font-bold text-emerald-700">2 units in stock</span>.
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-neutral-500">
                    {jobAccepted ? "🟢 Accepted! Route navigation active in van." : "Dispatch SLA: 18 mins remaining"}
                  </span>

                  <button
                    type="button"
                    disabled={jobAccepted}
                    onClick={handleAcceptJob}
                    className={`rounded-xl px-5 py-2.5 text-xs font-bold shadow-xs transition-all ${
                      jobAccepted
                        ? "bg-emerald-600 text-white cursor-default"
                        : "bg-gradient-to-r from-[#f05a28] via-[#ea580c] to-[#d04618] text-white hover:shadow-md hover:shadow-orange-500/25 hover:scale-102"
                    }`}
                  >
                    {jobAccepted ? "✓ Job Accepted & Escrow Locked" : "Accept Job & Lock Escrow"}
                  </button>
                </div>
              </div>

              {/* Mobile Van Inventory */}
              <div className="rounded-2xl border border-orange-200/70 bg-[#fffaf5] p-4 space-y-2">
                <h5 className="text-xs font-bold text-[#2d130a]">
                  Mobile Van Inventory Check (Hyderabad Vehicle #TS09-UB-4120)
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-orange-200/70 shadow-2xs">
                    <span className="text-neutral-500 text-[11px] block">45μF Run Capacitor</span>
                    <span className="font-bold text-emerald-700">2 in stock (Optimal)</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-orange-200/70 shadow-2xs">
                    <span className="text-neutral-500 text-[11px] block">R32 Refrigerant</span>
                    <span className="font-bold text-emerald-700">8.4 kg (84% full)</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-orange-200/70 shadow-2xs">
                    <span className="text-neutral-500 text-[11px] block">1/4&quot; &amp; 3/8&quot; Flare Nuts</span>
                    <span className="font-bold text-neutral-800">16 units</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-orange-200/70 shadow-2xs">
                    <span className="text-neutral-500 text-[11px] block">Digital Clamp Meter</span>
                    <span className="font-bold text-emerald-700">Calibrated</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 3. OPERATIONS GOVERNANCE & ADMIN (DUMMY DATA)                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {(activeTab === "all" || activeTab === "admin") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-orange-200/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/15 text-[#c2410c] font-black text-xs">
                  3
                </span>
                <h2 className="text-xl font-bold text-[#2d130a]">
                  Operations Governance &amp; Risk Center (Simulated)
                </h2>
                <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-[#c2410c] border border-orange-200">
                  Admin View
                </span>
              </div>
              {activeTab === "all" && (
                <button
                  type="button"
                  onClick={() => handleTabChange("admin")}
                  className="text-xs font-bold text-[#c2410c] hover:underline flex items-center gap-1"
                >
                  Expand Dedicated Admin View <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Admin Card */}
            <div className="rounded-3xl border-2 border-orange-200/80 bg-white p-6 sm:p-8 shadow-md shadow-orange-950/5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 pb-5">
                <div>
                  <h3 className="text-lg font-bold text-[#2d130a]">
                    Platform Financial Escrow &amp; Dispute Governance
                  </h3>
                  <p className="text-xs text-neutral-500">
                    TrustLock cryptographic audit trail, escrow vault reserves, and SLA monitoring across Ameerpet &amp; Greater Hyderabad.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-800 border border-blue-200">
                    <Shield className="h-3.5 w-3.5 text-blue-600" />
                    Audit Logs Immutable
                  </span>
                </div>
              </div>

              {/* Admin Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-orange-200/70 bg-[#fffaf5] p-4">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Total GMV Processed
                  </span>
                  <span className="text-2xl font-black text-[#2d130a] block mt-1">₹14,85,200</span>
                  <span className="text-xs text-emerald-600 font-bold">+24% MoM growth</span>
                </div>

                <div className="rounded-2xl border border-orange-200/70 bg-[#fffaf5] p-4">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Escrow Vault Locked
                  </span>
                  <span className="text-2xl font-black text-[#2d130a] block mt-1">₹8,42,000</span>
                  <span className="text-xs text-neutral-500">Held in fiduciary trust</span>
                </div>

                <div className="rounded-2xl border border-orange-200/70 bg-[#fffaf5] p-4">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Active Field Jobs
                  </span>
                  <span className="text-2xl font-black text-[#2d130a] block mt-1">142</span>
                  <span className="text-xs text-neutral-500">Across 6 Greater Hyderabad zones</span>
                </div>

                <div className="rounded-2xl border border-orange-200/70 bg-[#fffaf5] p-4">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Dispute Rate
                  </span>
                  <span className="text-2xl font-black text-emerald-700 block mt-1">0.12%</span>
                  <span className="text-xs text-neutral-500">Industry benchmark: 3.8%</span>
                </div>
              </div>

              {/* Dispute & Escrow Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Dispute Resolution Card */}
                <div className="rounded-2xl border-2 border-orange-200/70 p-5 space-y-4 bg-white shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2d130a] flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Dispute Center Case #DIS-9021
                    </span>
                    <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                      Under Review
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Customer Pooja Mehta (Ameerpet, Hyderabad) reported drain condensation leak 3 days post AC coil servicing. Escrow payout of ₹1,400 frozen automatically by TrustLock.
                  </p>

                  <div className="rounded-xl bg-[#fffaf5] p-3 text-xs text-neutral-700 space-y-1.5 border border-orange-200/60">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Pre-work photo timestamp:</span>
                      <span className="font-mono font-medium">18-Sep 14:22:10 IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Post-work photo timestamp:</span>
                      <span className="font-mono font-medium">18-Sep 15:45:04 IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">InspectAI Visual Proof Match:</span>
                      <span className="font-bold text-emerald-700">92% Pro adherence</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      disabled={escrowReleased}
                      onClick={handleReleaseEscrow}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors disabled:opacity-60"
                    >
                      {escrowReleased ? "✓ Released With 88/12 Split" : "Release Escrow (88/12 Payout)"}
                    </button>
                  </div>
                </div>

                {/* Cryptographic Audit Trail */}
                <div className="rounded-2xl border-2 border-orange-200/70 p-5 space-y-3 bg-white shadow-2xs">
                  <span className="text-xs font-bold text-[#2d130a] flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-[#f05a28]" />
                    Cryptographic Audit Trail (SHA-256 Hashes)
                  </span>

                  <div className="space-y-2.5 text-xs">
                    <div className="rounded-xl bg-[#fffaf5] p-3 border border-orange-200/60">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#2d130a]">ESCROW_LOCKED • Job #4912</span>
                        <span className="text-neutral-400 text-[11px]">2 mins ago</span>
                      </div>
                      <span className="font-mono text-[10px] text-neutral-500 block truncate mt-1">
                        Hash: 0x8f2ae147c290119b98df4920aa1982b
                      </span>
                    </div>

                    <div className="rounded-xl bg-[#fffaf5] p-3 border border-orange-200/60">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#2d130a]">TRUSTLOCK_VERIFIED • Job #4908</span>
                        <span className="text-neutral-400 text-[11px]">18 mins ago</span>
                      </div>
                      <span className="font-mono text-[10px] text-neutral-500 block truncate mt-1">
                        Hash: 0x3d7eb910244ac5e801127e4920b8f10
                      </span>
                    </div>

                    <div className="rounded-xl bg-[#fffaf5] p-3 border border-orange-200/60">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#2d130a]">PAYOUT_DISPATCHED • Pro #410</span>
                        <span className="text-neutral-400 text-[11px]">42 mins ago</span>
                      </div>
                      <span className="font-mono text-[10px] text-neutral-500 block truncate mt-1">
                        Hash: 0x6a1170d10b77921ca4923e110bb0194
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Production Ready Callout (MAX-W-7XL • WARM RADIANT ORANGE) ── */}
        <section className="w-full rounded-3xl border-2 border-orange-300 bg-gradient-to-r from-[#fff5eb] via-white to-[#ffeedb] p-8 sm:p-12 text-center space-y-4 shadow-xl shadow-orange-950/10 orange-halo">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/15 px-4 py-1.5 text-xs font-bold text-[#c2410c] border border-orange-200/80 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#f05a28]" />
            <span>Ready for the Real Experience?</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2d130a] max-w-xl mx-auto">
            Experience OmniService AI In Ameerpet, Hyderabad
          </h3>

          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Create an account or sign in with Google in seconds. Upload your first 15-second diagnostic video and receive a transparent, locked Scope of Work.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f05a28] via-[#ea580c] to-[#d04618] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all hover:scale-102"
            >
              <span>Create Customer Account</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/professional/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-orange-300/80 bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-[#c2410c] hover:border-[#f05a28] hover:text-[#f05a28] hover:bg-orange-50 transition-all shadow-xs"
            >
              <span>Join as Verified Professional</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-[#fff7ed] px-5 py-3.5 text-xs sm:text-sm font-semibold text-[#c2410c] hover:bg-orange-100 transition-all"
            >
              <span>Existing User Sign In</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
