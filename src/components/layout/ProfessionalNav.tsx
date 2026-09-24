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
  Store,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
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
  { label: "Jobs & Bookings", href: "/pro/jobs", icon: Briefcase },
  { label: "Live Leads", href: "/pro/leads", icon: Zap, badge: "Live" },
  { label: "Smart Route", href: "/pro/route", icon: Navigation },
  { label: "Van Stock", href: "/pro/inventory", icon: Truck },
  { label: "Profile & Shop Details", href: "/pro/profile", icon: Store },
];

export function ProfessionalNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-orange-200/60 bg-white font-serif transition-all duration-300 shadow-sm relative z-30 select-none",
        collapsed ? "w-16" : "w-64",
        className
      )}
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* Sidebar Header Brand Logo & Toggle Button */}
      <div className="flex h-16 items-center justify-between border-b border-orange-200/60 px-3.5 bg-gradient-to-r from-orange-50/70 to-white">
        {!collapsed ? (
          <>
            <Link href="/pro/dashboard" className="flex items-center gap-2">
              <Image
                src="/images/OmniService_Logo.png"
                alt="OmniService AI"
                width={130}
                height={32}
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-orange-100/80 hover:text-[#f05a28] transition-all cursor-pointer border border-transparent hover:border-orange-200"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <PanelLeftClose className="h-4 w-4 text-neutral-500" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center gap-1.5 p-1.5 rounded-lg text-neutral-600 hover:bg-orange-100/80 hover:text-[#f05a28] transition-all cursor-pointer group"
            title="Expand Sidebar"
            aria-label="Expand Sidebar"
          >
            <Image
              src="/images/OmniService_Icon.png"
              alt="OmniService"
              width={24}
              height={24}
              className="h-6 w-6 object-contain group-hover:scale-110 transition-transform"
              priority
            />
            <PanelLeftOpen className="h-4 w-4 text-[#f05a28]" />
          </button>
        )}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {proNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/pro/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-150",
                isActive
                  ? "bg-[#f05a28] text-white shadow-md shadow-orange-500/20"
                  : "text-neutral-700 hover:bg-orange-50 hover:text-[#f05a28]",
                collapsed && "justify-center px-2"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-neutral-500 group-hover:text-[#f05a28]"
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </div>
              {!collapsed && (
                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <Badge size="sm" variant="brand">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/90" />}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Volcanic Branding Footer */}
      <div className="border-t border-orange-200/60 p-3.5 bg-orange-50/50 space-y-2 text-neutral-800">
        {!collapsed && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Verified Pro Network</span>
          </div>
        )}
        <a
          href="https://volcanic.world"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between pt-1 border-t border-orange-200/60 text-[10px] font-bold tracking-wider text-neutral-600 hover:text-[#f05a28] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Image
              src="/images/volcanic_logo.png"
              alt="Volcanic Logo"
              width={16}
              height={16}
              className="h-4 w-4 object-contain"
            />
            {!collapsed && <span>VOLCANIC</span>}
          </div>
          {!collapsed && <span className="text-[9px] font-normal text-neutral-400">volcanic.world ↗</span>}
        </a>
      </div>
    </aside>
  );
}
