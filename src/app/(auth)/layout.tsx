import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Camera,
  CheckCircle2,
  Phone,
  Mail,
  Award,
} from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen w-full bg-[#fffaf5] text-neutral-900 font-serif flex flex-col selection:bg-[#f05a28]/20"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* Top Header Bar */}
      <header className="w-full border-b border-orange-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-3.5 flex items-center justify-between w-full">
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/OmniService_Logo.png"
              alt="OmniService AI"
              width={180}
              height={44}
              className="h-9 sm:h-10 w-auto rounded-xl object-contain transition-transform group-hover:scale-102"
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-[#fff7ed] px-3.5 py-1 text-xs font-bold text-[#c2410c] hover:bg-orange-100 transition-colors shadow-2xs"
            >
              <span>See Demo (Sandbox)</span>
            </Link>
            <Link
              href="/"
              className="text-xs font-semibold text-[#2d130a] hover:text-[#f05a28] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container with max-w-7xl on Big Screens & Radiant Emergent Mesh */}
      <div className="flex-1 w-full bg-gradient-to-b from-[#fffaf5] via-[#fff5eb] to-[#ffeedb] relative overflow-hidden flex items-stretch">
        {/* Emergent Glowing Orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-orange-400/15 via-amber-300/10 to-transparent blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-[#f05a28]/15 via-orange-300/10 to-transparent blur-3xl pointer-events-none animate-float-delayed" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 relative z-10 border-x border-orange-200/40 bg-white/40 backdrop-blur-xs">
          {/* Left Side: Brand Story & Trust Showcase (Warm Linen & Orange Palette) */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 flex-col justify-between border-r border-orange-200/70 bg-gradient-to-br from-[#fff7ed]/80 via-[#fff2e8]/80 to-[#fff8f0]/90 p-10 xl:p-14">
            <div className="space-y-8">
              <div className="space-y-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500/10 via-amber-500/15 to-orange-500/10 px-3.5 py-1 text-xs font-bold text-[#c2410c] border border-orange-200/80 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-[#f05a28]" />
                  Ameerpet, Hyderabad Service Network
                </span>
                <h2 className="text-3xl xl:text-4xl font-extrabold text-[#2d130a] tracking-tight leading-snug">
                  Local Solutions. <br />
                  <span className="bg-gradient-to-r from-[#f05a28] via-[#ea580c] to-[#c2410c] bg-clip-text text-transparent">
                    Higher Standards.
                  </span>
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Connect directly to verified technicians, transparent algorithmic scopes, and protected escrow releases in Ameerpet &amp; Greater Hyderabad.
                </p>
              </div>

              {/* Feature Bullets (Non-developer consumer trust) */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3.5 rounded-2xl border-2 border-orange-100 bg-white/95 p-4 shadow-2xs hover:border-orange-300 transition-colors">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-[#f05a28]">
                    <Camera className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#2d130a]">15-Second Video Diagnostics</h3>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      InspectAI identifies faulty components, parts, and sound signatures before booking.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl border-2 border-orange-100 bg-white/95 p-4 shadow-2xs hover:border-orange-300 transition-colors">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#2d130a]">TrustLock Escrow Vault</h3>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      Funds are locked safely. Money releases only when pre- and post-work photos pass verification.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl border-2 border-orange-100 bg-white/95 p-4 shadow-2xs hover:border-orange-300 transition-colors">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-[#c2410c] border border-amber-200/80">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#2d130a]">30-Day Workmanship Warranty</h3>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      Every repair is guaranteed with verified parts and certified master technicians.
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial Quote */}
              <div className="rounded-2xl border-2 border-orange-200/70 bg-white/95 p-5 space-y-2 shadow-xs">
                <p className="text-xs text-neutral-700 italic leading-relaxed">
                  &ldquo;Other technicians claimed our entire AC compressor was burnt and quoted ₹8,000. InspectAI detected a simple capacitor degradation. The technician arrived with the part on van stock and fixed it for ₹2,800 locked price.&rdquo;
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px]">
                  <span className="font-bold text-[#2d130a]">Dr. Rohit Sharma</span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-600">Ameerpet, Hyderabad Homeowner</span>
                </div>
              </div>
            </div>

            {/* Left Footer Contact */}
            <div className="pt-8 border-t border-orange-200/70 text-xs text-neutral-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#f05a28]" />
                <a href="tel:8624851910" className="hover:text-[#f05a28] font-medium transition-colors">
                  +91 86248 51910
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#f05a28]" />
                <a href="mailto:volcanic.digitalsolutions@gmail.com" className="hover:text-[#f05a28] font-medium transition-colors">
                  volcanic.digitalsolutions@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Authentication Forms (Warm Peach Glass Canvas) */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 xl:p-16 bg-white/60">
            <div className="w-full max-w-xl space-y-6">
              {children}

              {/* Security Guarantee Footer (Clean Consumer Trust) */}
              <div className="flex flex-col items-center gap-2 text-center text-xs text-neutral-500 pt-3">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Verified Local Professionals • Fiduciary Escrow Guarantee</span>
                </div>
                <a
                  href="https://volcanic.world"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#2d130a] hover:text-[#f05a28] transition-colors"
                >
                  <span>VOLCANIC WORLD</span>
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
