"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, ClipboardList, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

const customerNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Requests", href: "/customer/requests", icon: ClipboardList },
  { label: "HomePass", href: "/customer/homepass", icon: ShieldCheck },
  { label: "Profile", href: "/customer/profile", icon: User },
];

export function CustomerNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Customer Navigation"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 block sm:hidden bg-white/95 backdrop-blur-md border-t border-neutral-200/80 px-2 py-1.5 dark:bg-neutral-900/95 dark:border-neutral-800",
        className
      )}
    >
      <div className="flex items-center justify-around">
        {customerNavItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 text-[10px] font-medium",
                isActive
                  ? "text-[#f05a28] font-semibold"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-150",
                    isActive && "scale-110"
                  )}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f05a28] px-1 text-[9px] font-bold text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
