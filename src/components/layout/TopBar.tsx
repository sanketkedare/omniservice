"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Shield,
  User,
  Briefcase,
  LogOut,
  LogIn,
  UserPlus,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Award,
  Layers,
  Wrench,
  Camera,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useGeolocation } from "@/lib/geolocation";
import { LocationSelectorModal } from "./LocationSelectorModal";
import { GoogleNavButton } from "@/components/auth/GoogleNavButton";

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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
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

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

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
    setMobileMenuOpen(false);
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
          "sticky top-0 z-30 w-full border-b border-orange-200/80 bg-[#fffdfa]/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(240,90,40,0.05)]",
          className
        )}
      >
        <div className="max-w-7xl mx-auto flex h-20 w-full items-center justify-between px-6 sm:px-10 lg:px-12 gap-4">
          {/* Left: Brand logo & Navigation */}
          <div className="flex items-center gap-5">
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
                  "hidden md:flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-2xs",
                  portal.badgeColor
                )}
              >
                {portal.icon}
                <span>{portal.label}</span>
              </Link>
            )}

            {/* Case Study Direct Link */}
            <Link
              href="/case-study"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-[#f05a28] px-2 py-1 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <Award className="h-3.5 w-3.5 text-[#f05a28]" />
              <span>Case Study</span>
            </Link>

            {/* Interactive Dynamic Location Pill */}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-2xs transition-all cursor-pointer group",
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
                    className="rounded-lg p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-1 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2.5">
                <GoogleNavButton variant="desktop" />
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-[#431407] hover:text-[#f05a28] hover:bg-orange-50/80 transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 rounded-xl bg-[#f05a28] px-4 py-2 text-xs font-bold text-white hover:bg-[#ea580c] shadow-xs shadow-orange-500/20 transition-all"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-neutral-800 hover:bg-orange-50 hover:text-[#f05a28] transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Slide-Out Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#fffaf5] border-l border-orange-200/80 shadow-2xl z-10 flex flex-col justify-between">
            <div className="p-5 border-b border-orange-200/70 flex items-center justify-between">
              <Image
                src="/images/OmniService_Logo.png"
                alt="OmniService"
                width={150}
                height={38}
                className="h-8 w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-orange-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Dynamic Location Button in Drawer */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLocationModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-[#9a2c06] font-bold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#f05a28]" />
                  <span className="truncate">{locality || "Hyderabad, IN"}</span>
                </div>
                <span className="text-[11px] underline">Change</span>
              </button>

              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-orange-100/60"
                >
                  <Home className="h-4 w-4 text-[#f05a28]" />
                  <span>Home Page</span>
                </Link>

                <Link
                  href="/case-study"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[#c2410c] hover:bg-orange-100/60"
                >
                  <Award className="h-4 w-4 text-[#f05a28]" />
                  <span>Case Study &amp; Architecture</span>
                </Link>

                <Link
                  href="/customer/new-request"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-orange-100/60"
                >
                  <Camera className="h-4 w-4 text-[#f05a28]" />
                  <span>Book AI Diagnostic</span>
                </Link>

                <Link
                  href="/customer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-orange-100/60"
                >
                  <User className="h-4 w-4 text-[#f05a28]" />
                  <span>Customer Portal</span>
                </Link>

                <Link
                  href="/pro/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-orange-100/60"
                >
                  <Briefcase className="h-4 w-4 text-[#f05a28]" />
                  <span>Provider Portal</span>
                </Link>
              </div>

              {/* Unauthenticated Quick Actions */}
              {!currentUser ? (
                <div className="pt-3 border-t border-orange-100 space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-3 block">
                    Instant Authentication
                  </span>
                  <GoogleNavButton variant="mobile" />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 px-3 rounded-xl border border-neutral-300 bg-white text-xs font-bold text-neutral-800 hover:bg-neutral-50"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 px-3 rounded-xl bg-[#f05a28] text-xs font-bold text-white shadow-xs hover:bg-[#ea580c]"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-orange-100 space-y-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-orange-200/70 bg-white space-y-1 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#f05a28]" />
                <span className="truncate">{locality || "Hyderabad, Telangana"}</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      <LocationSelectorModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </>
  );
}
