"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  Banknote,
  AlertTriangle,
  Cpu,
  FileText,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "User Directory", href: "/admin/users", icon: Users },
  { label: "Professionals", href: "/admin/professionals", icon: Briefcase },
  { label: "Service Categories", href: "/admin/categories", icon: Layers },
  { label: "Escrow & Payouts", href: "/admin/escrow", icon: Banknote, badge: "Live" },
  { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle, badge: 1, badgeVariant: "destructive" as const },
  { label: "AI Inferences", href: "/admin/ai-inferences", icon: Cpu },
  { label: "Audit Logs", href: "/admin/logs", icon: FileText },
  { label: "System Settings", href: "/admin/settings", icon: Settings },
];

export function AdminNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col border-r border-neutral-200/80 bg-white dark:bg-neutral-900 dark:border-neutral-800",
        className
      )}
    >
      {/* Brand Logo */}
      <div className="flex h-16 items-center justify-between border-b border-neutral-200/80 px-4 dark:border-neutral-800">
        <Image
          src="/images/OmniService_Logo.png"
          alt="OmniService AI"
          width={130}
          height={32}
          className="h-7 w-auto rounded-lg object-contain"
          priority
        />
        <span className="rounded bg-[#f05a28]/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-[#f05a28]">
          Admin
        </span>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {adminNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-[#f05a28]/10 text-[#f05a28] dark:bg-[#f05a28]/20 dark:text-[#f47a4f]"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-[#f05a28]"
                      : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
                  )}
                />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <Badge
                    size="sm"
                    variant={item.badgeVariant || "brand"}
                  >
                    {item.badge}
                  </Badge>
                )}
                {isActive && <ChevronRight className="h-3 w-3 text-[#f05a28]" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="border-t border-neutral-200/80 p-4 dark:border-neutral-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium text-neutral-500">
            Engine: MongoDB 8.0 • Online
          </span>
        </div>
        <a
          href="https://volcanic.world"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-[10px] font-bold tracking-widest text-neutral-400 hover:text-[#f05a28] transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <Image
              src="/images/volcanic_logo.png"
              alt="Volcanic Logo"
              width={14}
              height={14}
              className="h-3.5 w-3.5 object-contain"
            />
            <span>V O L C A N I C</span>
          </div>
          <span className="text-[9px] font-normal tracking-normal text-neutral-500">volcanic.world ↗</span>
        </a>
      </div>
    </aside>
  );
}
