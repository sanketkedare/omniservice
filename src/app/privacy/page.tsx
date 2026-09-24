"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Shield, Database, UserCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>DPDP Act 2023 Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#2d130a]">
            Privacy Policy
          </h1>
          <p className="text-sm text-neutral-600">
            Effective Date: September 2026 • Volcanic Digital Solutions • Greater Hyderabad, Telangana
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-neutral-800">
          <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-xs">
            <h2 className="text-xl font-bold text-[#2d130a] flex items-center gap-2">
              <EyeOff className="h-5 w-5 text-[#f05a28]" />
              1. Phone Number Shielding &amp; Zero PII Leaks
            </h2>
            <p>
              Your personal privacy is our core operational principle. When you schedule a service or communicate with a technician:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 text-sm">
              <li>
                <strong>Masked In-App Relays:</strong> The customer&apos;s phone number is never disclosed to the service provider. Similarly, the provider&apos;s direct phone number is never shared with the customer.
              </li>
              <li>
                <strong>Encrypted Dispatch:</strong> All telephonic interactions occur via encrypted, platform-relayed channels, preventing off-platform solicitations and unwanted follow-up calls.
              </li>
            </ul>
          </section>

          <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-xs">
            <h2 className="text-xl font-bold text-[#2d130a] flex items-center gap-2">
              <Database className="h-5 w-5 text-[#f05a28]" />
              2. InspectAI Diagnostic Media Processing
            </h2>
            <p>
              When you submit a 15-second diagnostic video or photograph of a breakdown (e.g., an AC compressor, leaking pipe, or electrical breaker):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 text-sm">
              <li>
                <strong>Purpose of Processing:</strong> Media files are analyzed exclusively by our Google Gemini multimodal vision engine to identify mechanical defects, detect part specifications, and verify repair completion proofs.
              </li>
              <li>
                <strong>Zero Facial Tracking:</strong> Visual analysis models are configured to mask facial features and discard background residential context, focusing solely on the equipment or repair point.
              </li>
              <li>
                <strong>Ephemeral Storage:</strong> Raw diagnostic videos are kept strictly for the duration of the 30-day warranty window before automated archiving.
              </li>
            </ul>
          </section>

          <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-xs">
            <h2 className="text-xl font-bold text-[#2d130a] flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#f05a28]" />
              3. Geolocation &amp; Hyderabad Radius Validation
            </h2>
            <p>
              To confirm eligibility within our Greater Hyderabad operating boundary (45 km radius):
            </p>
            <p>
              We request device GPS coordinates solely to verify service feasibility and match the closest dispatched mobile service van. Your precise coordinates are never sold or shared with commercial advertising brokers.
            </p>
          </section>

          <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-xs">
            <h2 className="text-xl font-bold text-[#2d130a] flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#f05a28]" />
              4. Payment &amp; Escrow Security
            </h2>
            <p>
              All payment transactions are tokenized in compliance with RBI guidelines. OmniService stores no raw credit/debit card numbers or CVVs on our servers. Pre-authorized funds remain locked in the portal escrow vault until you verify repair completion.
            </p>
          </section>

          <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-xs">
            <h2 className="text-xl font-bold text-[#2d130a] flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[#f05a28]" />
              5. Your Rights &amp; Data Protection Officer Contact
            </h2>
            <p>
              Under the Digital Personal Data Protection (DPDP) Act 2023, you retain the right to review, rectify, or request permanent erasure of your profile and diagnostic records.
            </p>
            <p className="text-sm text-neutral-600">
              For privacy grievances, reach our Data Protection Officer at:{" "}
              <a href="mailto:volcanic.digitalsolutions@gmail.com" className="text-[#f05a28] font-bold underline">
                volcanic.digitalsolutions@gmail.com
              </a>{" "}
              • Volcanic Digital Solutions, HITEC City, Hyderabad, Telangana 500081.
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
            <Link href="/privacy" className="text-white font-bold underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <span>&copy; {new Date().getFullYear()} OmniService AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
