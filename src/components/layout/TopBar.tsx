"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Sparkles, Shield, User, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

export function TopBar({ className }: { className?: string }) {
  const pathname = usePathname();

  const isCustomer = pathname.startsWith("/customer");
  const isPro = pathname.startsWith("/pro");
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b border-orange-200/80 bg-white/95 backdrop-blur-md shadow-xs",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex h-16 w-full items-center justify-between px-6 sm:px-10 lg:px-12">
        {/* Brand logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center group" aria-label="OmniService Home">
            <Image
              src="/images/OmniService_Logo.png"
              alt="OmniService"
              width={180}
              height={44}
              className="h-9 sm:h-10 w-auto rounded-xl object-contain transition-transform group-hover:scale-102"
              priority
            />
          </Link>

          {/* Portal switch pills for quick preview during demo */}
          <div className="hidden md:flex items-center gap-1 rounded-xl bg-[#fff0e6] p-1 border border-orange-200/80 shadow-2xs">
            <Link
              href="/customer/dashboard"
              onClick={() => {
                document.cookie = "omniservice-role=customer; path=/; max-age=86400; SameSite=Lax";
                document.cookie = "authjs.session-token=demo_customer_active; path=/; max-age=86400; SameSite=Lax";
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                isCustomer
                  ? "bg-white text-[#c2410c] shadow-xs border border-orange-300/80 font-bold"
                  : "text-neutral-600 hover:text-[#c2410c]"
              )}
            >
              <User className="h-3.5 w-3.5 text-[#f05a28]" />
              Customer
            </Link>

            <Link
              href="/pro/dashboard"
              onClick={() => {
                document.cookie = "omniservice-role=professional; path=/; max-age=86400; SameSite=Lax";
                document.cookie = "authjs.session-token=demo_pro_active; path=/; max-age=86400; SameSite=Lax";
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                isPro
                  ? "bg-white text-[#c2410c] shadow-xs border border-orange-300/80 font-bold"
                  : "text-neutral-600 hover:text-[#c2410c]"
              )}
            >
              <Briefcase className="h-3.5 w-3.5 text-amber-600" />
              Pro
            </Link>

            <Link
              href="/admin/dashboard"
              onClick={() => {
                document.cookie = "omniservice-role=admin; path=/; max-age=86400; SameSite=Lax";
                document.cookie = "authjs.session-token=demo_admin_active; path=/; max-age=86400; SameSite=Lax";
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                isAdmin
                  ? "bg-white text-[#c2410c] shadow-xs border border-orange-300/80 font-bold"
                  : "text-neutral-600 hover:text-[#c2410c]"
              )}
            >
              <Shield className="h-3.5 w-3.5 text-blue-600" />
              Admin
            </Link>
          </div>

          <Link
            href="/demo"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-[#fff7ed] px-3 py-0.5 text-xs font-bold text-[#c2410c] hover:bg-orange-100 transition-colors shadow-2xs"
          >
            <span>See Demo (Sandbox)</span>
          </Link>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Notifications button */}
          <button
            aria-label="View notifications"
            className="relative rounded-xl p-2 text-neutral-600 hover:bg-orange-50 hover:text-[#c2410c] transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#f05a28]" />
          </button>

          {/* User avatar */}
          <Link href="/customer/profile">
            <Avatar
              name="Sanket K"
              size="sm"
              status="online"
              className="cursor-pointer transition-transform hover:scale-105"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
