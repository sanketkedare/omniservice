import React from "react";
import { TopBar } from "@/components/layout/TopBar";
import { CustomerNav } from "@/components/layout/CustomerNav";
import { AIAssistantWidget } from "@/components/ambient/AIAssistantWidget";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#fffaf5] text-neutral-900 font-serif relative" style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}>
      {/* Collapsible Left Sidebar for Desktop */}
      <div className="hidden md:flex flex-shrink-0 h-full">
        <CustomerNav />
      </div>

      {/* Main Content Viewport - Fluid full width */}
      <div className="flex flex-1 flex-col overflow-y-auto w-full min-w-0">
        <TopBar />
        <main className="flex-1 p-4 sm:p-8 w-full max-w-full pb-24 md:pb-8">{children}</main>
      </div>

      <AIAssistantWidget />
    </div>
  );
}
