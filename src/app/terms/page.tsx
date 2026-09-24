"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Scale, Lock, FileText, CheckCircle2 } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-neutral-900 font-serif selection:bg-[#f05a28]/15 selection:text-[#9a2c06] flex flex-col justify-between"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-orange-200/80 bg-white/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center group" aria-label="OmniService Home">
            <Image
              src="/images/OmniService_Logo.png"
              alt="OmniService AI"
              width={160}
              height={40}
              className="h-8.5 w-auto object-contain transition-transform group-hover:scale-102"
              priority
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-[#f05a28] transition-colors bg-orange-50/80 px-3.5 py-1.5 rounded-full border border-orange-200/70"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 py-12 space-y-10">
        <div className="space-y-3 border-b border-orange-200/70 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/70 px-3.5 py-1 text-xs font-bold text-[#c2410c] border border-orange-200">
            <Scale className="h-3.5 w-3.5 text-[#f05a28]" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#2d130a]">
            Terms and Conditions
          </h1>
          <p className="text-sm text-neutral-600">
            Last Updated: September 2026 • Governing Greater Hyderabad Operations &amp; Fiduciary Escrow Services
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-neutral-800">
          <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-xs">
            <h2 className="text-xl font-bold text-[#2d130a] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f05a28] text-white text-xs font-mono">1</span>
              Platform Overview &amp; Greater Hyderabad Service Area
            </h2>
            <p>
              OmniService AI (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operated under Volcanic Digital Solutions, is a specialized hyperlocal service matching and diagnostic platform. By accessing or using the platform within the Greater Hyderabad Metropolitan Area (operational radius up to 45 km from city center coordinates 17.3850° N, 78.4867° E), you agree to be bound by these Terms and Conditions.
            </p>
            <p>
              Users outside the active verified operating radius may register for service alerts but are strictly prohibited from soliciting on-demand dispatches.
            </p>
          </section>

          <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-xs">
            <h2 className="text-xl font-bold text-[#2d130a] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f05a28] text-white text-xs font-mono">2</span>
              InspectAI Diagnostic Engine &amp; Locked Price Ceilings
            </h2>
            <p>
              Our multimodal artificial intelligence engine (&quot;InspectAI&quot;) analyzes uploaded video and photographic evidence to identify potential failure modes, generate fair-market replacement parts estimates, and calculate upfront labor time limits.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 text-sm">
              <li>
                <strong>Price Ceiling Guarantee:</strong> The quoted ceiling represents the absolute maximum price you will pay for the diagnosed defect. If on-site physical disassembly uncovers unrelated secondary defects, the provider must issue a supplemental diagnostic quote through the platform for customer approval before continuing.
              </li>
              <li>
                <strong>No Mandatory Bookings:</strong> Visual diagnostic analysis is non-binding until confirmed with an escrow pre-authorization deposit.
              </li>
            </ul>
          </section>

          <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-xs">
            <h2 className="text-xl font-bold text-[#2d130a] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f05a28] text-white text-xs font-mono">3</span>
              Fiduciary Portal Escrow Vault &amp; Payout Rules
            </h2>
            <p>
              To eliminate financial fraud, price gouging, and incomplete repairs, all customer payments are stored in the platform&apos;s encrypted TrustLock™ Escrow Vault.
            </p>
            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs sm:text-sm text-[#9a2c06] space-y-1.5">
              <p className="font-bold flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-[#f05a28]" />
                Zero Direct Cash Payments to Technicians:
              </p>
              <p>
                Payments made by customers are never deposited directly into the technician&apos;s personal bank account upon booking. Funds are held in escrow until work is physically completed, post-repair evidence photos are uploaded, and the customer authorizes release or the verification window closes without dispute.
              </p>
            </div>
          </section>

          <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-xs">
            <h2 className="text-xl font-bold text-[#2d130a] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f05a28] text-white text-xs font-mono">4</span>
              Provider Accreditation, KYC &amp; Phone Number Shielding
            </h2>
            <p>
              All service professionals are independent contractors accredited through a 3-tier verification pipeline: Government Identity (Aadhaar/PAN), Trade Skill Certification, and Local Police Background Clearance.
            </p>
            <p>
              <strong>Privacy Protection:</strong> Direct telephone numbers of professionals are masked and routed through our encrypted platform relay. Both customers and providers agree not to circumvent the platform or exchange direct personal contact numbers to solicit off-platform transactions. Off-platform engagements void all warranty and escrow protections.
            </p>
          </section>

          <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-xs">
            <h2 className="text-xl font-bold text-[#2d130a] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f05a28] text-white text-xs font-mono">5</span>
              Workmanship Warranty &amp; Dispute Resolution
            </h2>
            <p>
              All completed repairs verified through the platform carry a 30-day Workmanship Warranty. In the unlikely event of defect recurrence, customers may raise an instant dispute within the app. Our operations team will hold the escrow funds, dispatch a senior technical auditor, or process a full refund to the customer&apos;s source account.
            </p>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, with exclusive jurisdiction resting in the competent civil courts of Hyderabad, Telangana.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#180903] text-neutral-300 py-10 px-6 border-t border-orange-900/60 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/volcanic_logo.png"
              alt="Volcanic"
              width={22}
              height={22}
              className="h-5.5 w-auto object-contain"
            />
            <span className="font-bold tracking-widest text-white uppercase">VOLCANIC</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400">Local Solutions. Higher Standards.</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="text-white font-bold underline">Terms of Service</Link>
            <span>•</span>
            <span>&copy; {new Date().getFullYear()} OmniService AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
