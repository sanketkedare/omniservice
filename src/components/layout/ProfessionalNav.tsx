"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Briefcase,
  Zap,
  Navigation,
  Truck,
  User,
  ShieldCheck,
  ChevronRight,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export interface ProNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

const proNavItems: ProNavItem[] = [
  { label: "Overview", href: "/pro/dashboard", icon: LayoutDashboard },
  { label: "My Jobs & Bookings", href: "/pro/jobs", icon: Briefcase },
  { label: "Live Leads", href: "/pro/leads", icon: Zap, badge: "Live" },
  { label: "Smart Route", href: "/pro/route", icon: Navigation },
  { label: "Van Stock", href: "/pro/inventory", icon: Truck },
  { label: "Profile & Shop Details", href: "/pro/profile", icon: Store },
];

export function ProfessionalNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col border-r border-orange-200/60 bg-white font-serif dark:bg-neutral-900 dark:border-neutral-800 shadow-sm",
        className
      )}
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* Sidebar Header Brand Logo */}
      <div className="flex h-16 items-center justify-between border-b border-orange-200/60 px-5 dark:border-neutral-800 bg-gradient-to-r from-orange-50/50 to-white">
        <Link href="/pro/dashboard" className="flex items-center gap-2">
          <Image
            src="/images/OmniService_Logo.png"
            alt="OmniService AI"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-emerald-700 border border-emerald-300">
          PRO PORTAL
        </span>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3.5">
        {proNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/pro/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150",
                isActive
                  ? "bg-[#f05a28] text-white shadow-md shadow-orange-500/20"
                  : "text-neutral-700 hover:bg-orange-50 hover:text-[#f05a28] dark:text-neutral-300 dark:hover:bg-neutral-800"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-white" : "text-neutral-500 group-hover:text-[#f05a28]"
                  )}
                />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && (
                  <Badge size="sm" variant="brand">
                    {item.badge}
                  </Badge>
                )}
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/90" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Bottom Volcanic Branding */}
      <div className="border-t border-orange-200/60 p-4 dark:border-neutral-800 bg-neutral-900 text-white space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-white/90 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-400" /> Verified Pro Network
          </span>
        </div>
        <a
          href="https://volcanic.world"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] font-bold tracking-widest text-white/70 hover:text-orange-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Image
              src="/images/volcanic_logo.png"
              alt="Volcanic Logo"
              width={16}
              height={16}
              className="h-4 w-4 object-contain brightness-125"
            />
            <span>VOLCANIC</span>
          </div>
          <span className="text-[9px] font-normal tracking-normal text-white/40">volcanic.world ↗</span>
        </a>
      </div>
    </aside>
  );
}
