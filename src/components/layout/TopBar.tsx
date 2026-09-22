"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Shield, User, Briefcase, LogOut, LogIn, UserPlus, MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useGeolocation } from "@/lib/geolocation";
import { LocationSelectorModal } from "./LocationSelectorModal";

interface AuthUser {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: "customer" | "professional" | "admin";
}

export function TopBar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [locationModalOpen, setLocationModalOpen] = React.useState(false);
  const { locality, permissionDenied } = useGeolocation();

  React.useEffect(() => {
    // 1. Try reading from localStorage for instant offline/client recall
    try {
      const stored = localStorage.getItem("omniservice_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name && parsed?.role) {
          setCurrentUser(parsed);
        }
      }
    } catch {
      // Ignore localStorage parse error
    }

    // 2. Fetch authenticated profile from /api/auth/me
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.authenticated && data.user) {
          setCurrentUser(data.user);
          localStorage.setItem("omniservice_user", JSON.stringify(data.user));
        } else if (!data.authenticated && !localStorage.getItem("omniservice_user")) {
          setCurrentUser(null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue client cleanup
    }
    localStorage.removeItem("omniservice_user");
    document.cookie = "authjs.session-token=; path=/; max-age=0";
    document.cookie = "omniservice-role=; path=/; max-age=0";
    document.cookie = "omniservice-user=; path=/; max-age=0";
    setCurrentUser(null);
    router.push("/login");
  };

  const getPortalInfo = (role: string) => {
    switch (role) {
      case "admin":
        return {
          label: "Governance Center",
          href: "/admin/dashboard",
          badge: "Admin Operator",
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Shield className="h-3.5 w-3.5 text-blue-600" />,
        };
      case "professional":
        return {
          label: "Provider Portal",
          href: "/pro/dashboard",
          badge: "Verified Provider",
          badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Briefcase className="h-3.5 w-3.5 text-amber-600" />,
        };
      default:
        return {
          label: "Customer Portal",
          href: "/customer/dashboard",
          badge: "Customer",
          badgeColor: "bg-orange-50 text-[#c2410c] border-orange-200",
          icon: <User className="h-3.5 w-3.5 text-[#f05a28]" />,
        };
    }
  };

  const portal = currentUser ? getPortalInfo(currentUser.role) : null;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 w-full border-b border-orange-200/80 bg-white/95 backdrop-blur-md shadow-xs",
          className
        )}
      >
        <div className="max-w-7xl mx-auto flex h-16 w-full items-center justify-between px-6 sm:px-10 lg:px-12">
          {/* Left: Brand logo & Navigation */}
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

            {/* Active Role Dashboard Link */}
            {portal && (
              <Link
                href={portal.href}
                className={cn(
                  "hidden sm:flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-bold transition-all shadow-2xs",
                  portal.badgeColor
                )}
              >
                {portal.icon}
                <span>{portal.label}</span>
              </Link>
            )}

            {/* Interactive Dynamic Location Pill */}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-2xs transition-all cursor-pointer group",
                permissionDenied
                  ? "border-amber-300 bg-amber-50/90 text-amber-900 hover:bg-amber-100"
                  : "border-orange-200/90 bg-orange-50/70 text-[#9a2c06] hover:bg-orange-100/80 hover:border-orange-300"
              )}
              title={
                permissionDenied
                  ? "GPS Access Denied. Showing Hyderabad fallback. Click to change."
                  : "Click to change or auto-detect your location"
              }
            >
              <MapPin
                className={cn(
                  "h-3.5 w-3.5",
                  permissionDenied ? "text-amber-600" : "text-[#f05a28] group-hover:animate-bounce"
                )}
              />
              <span className="max-w-[170px] truncate">{locality || "Hyderabad, IN"}</span>
              {permissionDenied && (
                <span className="rounded-sm bg-amber-200/90 px-1 py-0.2 text-[9px] font-bold text-amber-900 uppercase tracking-wider">
                  GPS Denied
                </span>
              )}
              <ChevronDown className="h-3 w-3 text-orange-400 group-hover:text-orange-700" />
            </button>
          </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              {/* Notifications */}
              <button
                aria-label="View notifications"
                className="relative rounded-xl p-2 text-neutral-600 hover:bg-orange-50 hover:text-[#c2410c] transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#f05a28]" />
              </button>

              {/* User Identity Chip */}
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
                <Link
                  href={currentUser.role === "customer" ? "/customer/profile" : portal?.href || "/"}
                  className="flex items-center gap-2 group"
                >
                  <Avatar
                    name={currentUser.name || "User"}
                    size="sm"
                    status="online"
                    className="cursor-pointer transition-transform group-hover:scale-105"
                  />
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-neutral-900 group-hover:text-[#f05a28] transition-colors line-clamp-1">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400">
                      {currentUser.role}
                    </span>
                  </div>
                </Link>

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="rounded-lg p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-1"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-neutral-700 hover:text-[#f05a28] hover:bg-orange-50/80 transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-lg bg-[#f05a28] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#ea580c] shadow-xs transition-colors"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
      <LocationSelectorModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </>
  );
}
