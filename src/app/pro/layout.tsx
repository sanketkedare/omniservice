import React from "react";
import { TopBar } from "@/components/layout/TopBar";
import { ProfessionalNav } from "@/components/layout/ProfessionalNav";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf5] text-neutral-900 relative overflow-x-hidden font-serif">
      {/* Emergent Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#f05a28]/10 via-[#ea580c]/5 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-tr from-[#fb923c]/10 via-[#ea580c]/5 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-[#c2410c]/8 via-[#f05a28]/5 to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      <TopBar className="bg-white/90 border-neutral-200/80 text-neutral-900 shadow-xs relative z-20" />
      <main className="relative z-10 flex-1 pb-20 sm:pb-8">{children}</main>
      <ProfessionalNav />
    </div>
  );
}
