"use client";

import React from "react";
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
  Shield,
  Layers,
  MapPin,
  Wrench,
  Zap,
  Droplets,
  Flame,
  Home,
  Check,
  ChevronRight,
  Phone,
  Mail,
  Lock,
  User,
  Briefcase,
  ExternalLink,
  Award,
  Database,
  Cpu,
  BarChart3,
  FileCheck2,
  GitBranch,
  Key,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";

export default function CaseStudyPage() {
  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-neutral-900 font-serif selection:bg-[#f05a28]/20 selection:text-[#9a2c06]"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      <TopBar />

      {/* ── HERO BANNER ── */}
      <section className="relative w-full border-b border-orange-200/80 bg-gradient-to-b from-[#fffaf4] via-[#fff3e6] to-[#fdecdb] py-16 sm:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 border border-orange-300 px-3.5 py-1 text-xs font-bold text-[#c2410c] uppercase tracking-wider">
              <Award className="h-3.5 w-3.5 text-[#f05a28]" />
              Production Case Study
            </span>
            <a
              href="https://omniservice.volcanic.world/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3.5 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Application: omniservice.volcanic.world</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="space-y-3 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2d130a] leading-tight">
              OmniService AI: Precision Home Contracting Architecture
            </h1>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#f05a28] to-[#c2410c] bg-clip-text text-transparent">
              &ldquo;Local Solutions. Higher Standards.&rdquo;
            </p>
            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed max-w-3xl font-normal">
              An exhaustive architectural review of how OmniService AI replaces adversarial guesswork, arbitrary quoting, and unverified workmanship with multimodal AI diagnostics, inventory-aware dispatch, and fiduciary escrow protection across Greater Hyderabad.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-4xl">
            <div className="rounded-2xl border border-orange-200 bg-white/95 p-4 shadow-xs text-center">
              <span className="text-2xl sm:text-3xl font-bold text-[#2d130a] block">15 Sec</span>
              <span className="text-xs text-neutral-600">Video Diagnostic Scan</span>
            </div>
            <div className="rounded-2xl border border-orange-200 bg-white/95 p-4 shadow-xs text-center">
              <span className="text-2xl sm:text-3xl font-bold text-[#f05a28] block">100%</span>
              <span className="text-xs text-neutral-600">Locked Price Ceiling</span>
            </div>
            <div className="rounded-2xl border border-orange-200 bg-white/95 p-4 shadow-xs text-center">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-700 block">94%</span>
              <span className="text-xs text-neutral-600">1st-Visit Resolution</span>
            </div>
            <div className="rounded-2xl border border-orange-200 bg-white/95 p-4 shadow-xs text-center">
              <span className="text-2xl sm:text-3xl font-bold text-[#2d130a] block">0.12%</span>
              <span className="text-xs text-neutral-600">Dispute Rate (TrustLock)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-16 space-y-16">
        {/* 1. Real-World Problem Solving */}
        <section className="space-y-6">
          <div className="border-b border-orange-200 pb-3">
            <span className="text-xs font-bold text-[#f05a28] uppercase tracking-wider block">Chapter 01</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d130a]">
              The Real Problem in Local Home Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border-2 border-red-200 bg-red-50/40 p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
                <span>The Traditional Contracting Breakdown</span>
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Blind Verbal Quoting:</strong> Technicians quote arbitrary, inflated fees upon arrival without any verifiable price breakdown.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Multiple Trips &amp; Delays:</strong> Over 60% of repair jobs require the technician to leave and search local shops for parts, doubling labor time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Unverified Workmanship:</strong> Homeowners pay upfront or in cash with zero proof that genuine parts were installed or that faults were corrected.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Ghost Warranties:</strong> When problems recur days later, contractors become unresponsive, leaving homeowners stranded.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50/40 p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                <span>The OmniService Deterministic Solution</span>
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>InspectAI™ Video Scans:</strong> 15-second customer video accurately isolates component failures and matches OEM part numbers before dispatch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>SmartRoute™ Van Inventory:</strong> Dispatches only nearby technicians whose live mobile van inventory contains the exact required replacement part.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>TrustLock™ Escrow Vault:</strong> Customer payment is locked in escrow. Funds release ONLY after pre- and post-repair photographic proof passes verification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>HomePass™ Property Passport:</strong> Every repair creates an immutable digital health record, warranty log, and property asset ledger.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. The 4 Core AI & Software Pillars */}
        <section className="space-y-8">
          <div className="border-b border-orange-200 pb-3">
            <span className="text-xs font-bold text-[#f05a28] uppercase tracking-wider block">Chapter 02</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d130a]">
              The 4 Architectural Pillars (Production-Implemented)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1 */}
            <div className="rounded-3xl border-2 border-orange-200 bg-white p-7 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#f05a28]">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2d130a]">Pillar 1: InspectAI™</h3>
                  <span className="text-xs font-semibold text-[#c2410c]">Multimodal Failure Diagnostics</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Rather than forcing customers to decode error codes, InspectAI accepts a 15-second mobile video clip. The engine decomposes audio waveforms to detect compressor fan shudder (120 Hz vibration peaks), motor bearing friction, and water pipe compression leaks, pairing acoustic signatures with computer vision defect localization.
              </p>
              <div className="rounded-xl bg-orange-50/80 p-3 text-xs space-y-1 border border-orange-100">
                <div className="font-bold text-neutral-800">Production Feature:</div>
                <div className="text-neutral-600">Calculates deterministic labor rates + genuine OEM catalog rates to establish a legally locked price ceiling before booking.</div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-3xl border-2 border-orange-200 bg-white p-7 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2d130a]">Pillar 2: SmartRoute™</h3>
                  <span className="text-xs font-semibold text-amber-800">Inventory-Aware Dispatch Engine</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Conventional platforms match solely on geographic distance. SmartRoute evaluates a 4-factor scoring matrix: (1) technician skill tier, (2) verified mobile van inventory stock matching the diagnosed part, (3) real-time GPS proximity in Hyderabad, and (4) historical resolution ratings.
              </p>
              <div className="rounded-xl bg-amber-50/80 p-3 text-xs space-y-1 border border-amber-200">
                <div className="font-bold text-neutral-800">Production Feature:</div>
                <div className="text-neutral-600">Guarantees that the arriving technician already has the exact 45µF dual-run capacitor, EPDM gasket, or MCB switch in their van.</div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-3xl border-2 border-orange-200 bg-white p-7 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2d130a]">Pillar 3: TrustLock™</h3>
                  <span className="text-xs font-semibold text-emerald-800">Visual Proof &amp; Fiduciary Escrow</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Payments never flow directly to contractors prior to verified completion. Customer funds are held in a cryptographic escrow vault state machine. Upon job completion, the provider uploads high-resolution photographic evidence. Funds release only after customer approval and visual proof verification.
              </p>
              <div className="rounded-xl bg-emerald-50/80 p-3 text-xs space-y-1 border border-emerald-200">
                <div className="font-bold text-neutral-800">Production Feature:</div>
                <div className="text-neutral-600">Includes double-blind dispute freeze: if either party flags an issue, funds remain locked while governance administrators review visual evidence.</div>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-3xl border-2 border-orange-200 bg-white p-7 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2d130a]">Pillar 4: HomePass™</h3>
                  <span className="text-xs font-semibold text-purple-800">Permanent Digital Property Passport</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Every service event, part installation, electrical load calibration, and filter change is permanently recorded in a property health ledger. HomePass aggregates appliance serials, warranty dates, and maintenance logs into an overall 0–100 property health score.
              </p>
              <div className="rounded-xl bg-purple-50/80 p-3 text-xs space-y-1 border border-purple-200">
                <div className="font-bold text-neutral-800">Production Feature:</div>
                <div className="text-neutral-600">Passport records transfer seamlessly to new owners or tenants upon home sale, boosting resale credibility and eliminating lost warranty receipts.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Role Matrix & Platform Workflows */}
        <section className="space-y-6">
          <div className="border-b border-orange-200 pb-3">
            <span className="text-xs font-bold text-[#f05a28] uppercase tracking-wider block">Chapter 03</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d130a]">
              Three Role Ecosystem &amp; Interactive Workflows
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse border border-orange-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <thead className="bg-[#fff7ed] border-b border-orange-200 text-[#431407]">
                <tr>
                  <th className="p-3.5 sm:p-4 font-bold">Role</th>
                  <th className="p-3.5 sm:p-4 font-bold">Primary Actions</th>
                  <th className="p-3.5 sm:p-4 font-bold">Core Modules Used</th>
                  <th className="p-3.5 sm:p-4 font-bold">Safety &amp; Protection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100 text-neutral-700">
                <tr>
                  <td className="p-3.5 sm:p-4 font-bold text-[#2d130a]">Customer</td>
                  <td className="p-3.5 sm:p-4">15-second video intake, book service, live map tracking, HomePass passport inspection, approve escrow release.</td>
                  <td className="p-3.5 sm:p-4">InspectAI Chat, Request Tracker, HomePass Passport, Location Selector.</td>
                  <td className="p-3.5 sm:p-4">Locked price ceiling, 100% fiduciary escrow guarantee, 30-day workmanship warranty.</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-bold text-[#c2410c]">Service Provider (Pro)</td>
                  <td className="p-3.5 sm:p-4">View matched dispatch feed, confirm van stock parts, navigate to client via GPS, upload before/after photos, receive escrow payouts.</td>
                  <td className="p-3.5 sm:p-4">Pro Operations Feed, Van Stock Manager, Job Evidence Camera, Wallet Ledger.</td>
                  <td className="p-3.5 sm:p-4">Guaranteed payment deposit before travel; no payment haggling; genuine parts reimbursement.</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-bold text-blue-900">Governance Admin</td>
                  <td className="p-3.5 sm:p-4">Monitor platform GMV and escrow balances, arbitrate double-blind dispute cases, verify technician licenses, audit system telemetry.</td>
                  <td className="p-3.5 sm:p-4">Admin Operations Console, Dispute Arbitration Chamber, User Directory, Escrow Ledger.</td>
                  <td className="p-3.5 sm:p-4">SHA-256 tamper-evident audit logs; automated rate-limiting; cryptographic RBAC edge proxy.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Enterprise Security & Architecture Specifications */}
        <section className="space-y-6">
          <div className="border-b border-orange-200 pb-3">
            <span className="text-xs font-bold text-[#f05a28] uppercase tracking-wider block">Chapter 04</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d130a]">
              Technical Stack &amp; Security Engineering
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-orange-200 bg-white p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-[#f05a28] font-bold text-sm">
                <Key className="h-4 w-4" />
                <span>NIST SP 800-132 Auth</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                PBKDF2 with SHA-512, 100,000 iterations, unique 32-byte salts, and constant-time comparison (<code className="bg-neutral-100 px-1 py-0.5 rounded text-[11px]">crypto.timingSafeEqual</code>) to prevent timing attacks.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-white p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-[#c2410c] font-bold text-sm">
                <Shield className="h-4 w-4" />
                <span>Edge Proxy (proxy.ts)</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Sliding-window in-memory rate limiting (20 req/min on auth endpoints returning HTTP 429), strict RBAC route guards, and OWASP security headers injection.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-white p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <Database className="h-4 w-4" />
                <span>MongoDB Singleton</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Cached singleton Mongoose connection pooling resilient to Next.js serverless hot reloads, backed by live Atlas cloud collections.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Production Readiness & Links */}
        <section className="rounded-3xl border-2 border-orange-300 bg-gradient-to-br from-[#fff7ed] via-white to-[#fffaf5] p-8 sm:p-12 text-center space-y-6 shadow-xl shadow-orange-950/5">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="inline-block rounded-full bg-[#f05a28]/10 text-[#c2410c] px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
              Submission Ready
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2d130a]">
              Experience the Live Application
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Explore the fully functional platform with live AI diagnostics, real-time GPS tracking across Hyderabad, and instant Google authentication.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://omniservice.volcanic.world/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#f05a28] to-[#ea580c] px-8 py-4 text-base font-bold text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-102"
            >
              <span>Visit Live: omniservice.volcanic.world</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-orange-300 bg-white px-7 py-4 text-base font-bold text-[#c2410c] hover:bg-orange-50 transition-colors shadow-xs"
            >
              <span>Explore Home Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="pt-6 border-t border-orange-200/80 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500">
            <div>
              <strong>Official Operator:</strong> Volcanic Digital Solutions
            </div>
            <div>•</div>
            <div>
              <strong>Inquiries:</strong>{" "}
              <a href="mailto:volcanic.digitalsolutions@gmail.com" className="text-[#f05a28] hover:underline">
                volcanic.digitalsolutions@gmail.com
              </a>
            </div>
            <div>•</div>
            <div>
              <strong>Geographic Scope:</strong> Greater Hyderabad, Telangana
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
