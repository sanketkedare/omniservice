import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen w-full bg-[#faf8f5] text-neutral-900 font-serif flex flex-col justify-between selection:bg-[#f05a28]/20"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* Minimal Top Header */}
      <header className="w-full border-b border-orange-200/70 bg-white/90 backdrop-blur-md">
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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-[#f05a28] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Pure Centered Authentication Canvas */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="w-full py-4 text-center text-xs text-neutral-400 border-t border-orange-200/50 bg-white/50">
        <p>&copy; {new Date().getFullYear()} OmniService AI • Volcanic Digital Solutions • Hyderabad, Telangana</p>
      </footer>
    </div>
  );
}
