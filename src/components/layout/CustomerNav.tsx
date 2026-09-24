"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Home,
  ClipboardList,
  PlusCircle,
  ShieldCheck,
  Building2,
  Layers,
  User,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export interface CustomerNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

const customerNavItems: CustomerNavItem[] = [
  { label: "Dashboard", href: "/customer/dashboard", icon: Home },
  { label: "My Requests", href: "/customer/requests", icon: ClipboardList },
  { label: "Book New Service", href: "/customer/new-request", icon: PlusCircle },
  { label: "HomePass Vault", href: "/customer/homepass", icon: ShieldCheck },
  { label: "My Properties", href: "/customer/properties", icon: Building2 },
  { label: "Service Categories", href: "/customer/categories", icon: Layers },
  { label: "Profile & Settings", href: "/customer/profile", icon: User },
];

export function CustomerNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-orange-200/60 bg-white font-serif transition-all duration-300 shadow-sm relative z-30 select-none",
        collapsed ? "w-20" : "w-64",
        className
      )}
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* Sidebar Header Brand Logo & Toggle Button */}
      <div className="flex h-16 items-center justify-between border-b border-orange-200/60 px-4 bg-gradient-to-r from-orange-50/70 to-white">
        {!collapsed && (
          <Link href="/customer/dashboard" className="flex items-center gap-2">
            <Image
              src="/images/OmniService_Logo.png"
              alt="OmniService AI"
              width={130}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl text-neutral-500 hover:bg-orange-100/70 hover:text-[#f05a28] transition-colors mx-auto"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {customerNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/customer/dashboard" && pathname.startsWith(item.href));
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
            <span>Hyderabad Protected</span>
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
