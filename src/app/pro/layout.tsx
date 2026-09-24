import React from "react";
import { TopBar } from "@/components/layout/TopBar";
import { ProfessionalNav } from "@/components/layout/ProfessionalNav";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#fffaf5] text-neutral-900 font-serif" style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}>
      {/* Dedicated Left Sidebar for Desktop */}
      <div className="hidden md:flex w-64 flex-shrink-0 h-full">
        <ProfessionalNav />
      </div>

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col overflow-y-auto w-full min-w-0">
        <TopBar className="bg-white/90 border-neutral-200/80 text-neutral-900 shadow-xs relative z-20" />
        <main className="flex-1 p-4 sm:p-8 pb-24 md:pb-8">{children}</main>
      </div>
    </div>
  );
}
