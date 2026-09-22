import React from "react";
import { AdminNav } from "@/components/layout/AdminNav";
import { TopBar } from "@/components/layout/TopBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50/50">
      {/* Sidebar navigation */}
      <AdminNav className="hidden md:flex flex-shrink-0" />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <TopBar />
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
