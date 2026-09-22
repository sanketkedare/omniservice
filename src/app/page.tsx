"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Camera,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  MapPin,
  Wrench,
  Zap,
  Droplets,
  Flame,
  Home,
  Check,
  ChevronRight,
  Phone,
  Mail,
  Lock,
  User,
  LogOut,
  Menu,
  X,
  Briefcase,
  ChevronDown,
  Navigation,
  ThumbsUp,
  Award,
  FileText,
} from "lucide-react";
import { HomeDiagnosticChat } from "@/components/ai/HomeDiagnosticChat";
import { useGeolocation } from "@/lib/geolocation";
import { LocationSelectorModal } from "@/components/layout/LocationSelectorModal";
import { GoogleNavButton } from "@/components/auth/GoogleNavButton";

// ── Interactive Flow Categories (Consumer-Friendly, No Dev Jargon) ────────────
const HERO_FLOW_SHOWCASES = [
  {
    id: "hvac",
    label: "Air Conditioning",
    icon: Flame,
    color: "#f05a28",
    issue: "Inverter AC Fan Shudder & Cooling Loss",
    diagnosedPart: "Dual-Run Motor Capacitor (OEM)",
    partPrice: "₹750",
    laborPrice: "₹2,050 (Coil Service & Terminal Clean)",
    totalPrice: "₹2,800",
    provider: "CoolAir Solutions (4.9★ • 420 jobs)",
    arrivalEta: "12 mins",
    vanStock: "Parts stocked on mobile van",
    badge: "15-Sec Scan Verified",
  },
  {
    id: "electrical",
    label: "Electrical & Wiring",
    icon: Zap,
    color: "#eab308",
    issue: "MCB Circuit Breaker Tripping on Load",
    diagnosedPart: "32A Double-Pole Residual MCB",
    partPrice: "₹480",
    laborPrice: "₹970 (Terminal Rewire & Load Balance)",
    totalPrice: "₹1,450",
    provider: "VoltMaster Electric (5.0★ • 310 jobs)",
    arrivalEta: "15 mins",
    vanStock: "4 units in van inventory",
    badge: "Load Safety Tested",
  },
  {
    id: "plumbing",
    label: "Plumbing & Leaks",
    icon: Droplets,
    color: "#0284c7",
    issue: "Concealed Sink & P-Trap Joint Leak",
    diagnosedPart: "EPDM Compression Gasket Kit",
    partPrice: "₹350",
    laborPrice: "₹1,500 (Pressure Hydro-Test & Seal)",
    totalPrice: "₹1,850",
    provider: "FlowCare Plumbers (4.8★ • 290 jobs)",
    arrivalEta: "18 mins",
    vanStock: "Couplers & sealants in van stock",
    badge: "Pressure Calibrated",
  },
  {
    id: "purifier",
    label: "Water Purifier (RO)",
    icon: Droplets,
    color: "#0d9488",
    issue: "High TDS Water & RO Pump Churn",
    diagnosedPart: "Dow Filmtec 80 GPD RO Membrane",
    partPrice: "₹850",
    laborPrice: "₹649 (Chamber Sanitize & Calibration)",
    totalPrice: "₹1,499",
    provider: "AquaPure Technicians (4.9★ • 510 jobs)",
    arrivalEta: "20 mins",
    vanStock: "OEM filters stocked on van",
    badge: "Water Lab Tested",
  },
];

// ── 4 Consumer Trust Flow Steps ──────────────────────────────────────────────
const TRUST_FLOW_STEPS = [
  {
    id: "intake",
    stepNumber: "01",
    label: "1. Show the Problem",
    tag: "15-Second Video",
    title: "Snap a quick video or describe the repair issue",
    description:
      "No more trying to explain strange sounds or leaks over the phone. Simply record a short clip — our smart AI identifies the exact fault and parts needed in seconds.",
    bullets: [
      "Instant visual failure diagnosis",
      "No physical teardown required",
      "Exact OEM part identified upfront",
    ],
  },
  {
    id: "pricing",
    stepNumber: "02",
    label: "2. Locked Upfront Price",
    tag: "Zero Hidden Fees",
    title: "Transparent breakdown of parts & labor before you book",
    description:
      "Say goodbye to surprise estimates after arrival. You see the locked price ceiling upfront based on verified fair market rates in Hyderabad.",
    bullets: [
      "Genuine replacement parts catalog rates",
      "Fair-market labor breakdown",
      "Guaranteed price ceiling — no price gouging",
    ],
  },
  {
    id: "provider",
    stepNumber: "03",
    label: "3. Verified Provider Arrival",
    tag: "Parts in Stock",
    title: "Matched with top local experts who arrive ready to fix",
    description:
      "We dispatch verified, background-checked master technicians who already have the exact required replacement parts stocked in their mobile van.",
    bullets: [
      "Average arrival within 15–20 minutes",
      "Technicians carry genuine spare parts on board",
      "Verified licenses and criminal background checks",
    ],
  },
  {
    id: "escrow",
    stepNumber: "04",
    label: "4. Release When Satisfied",
    tag: "100% Protected",
    title: "Your payment is safely held until you approve the work",
    description:
      "Payment is deposited in an encrypted TrustLock escrow vault. Funds release only after you and our photo verification confirm the repair is flawless.",
    bullets: [
      "Fiduciary escrow protection on every booking",
      "Pre- and post-repair photographic proof",
      "30-day workmanship guarantee & warranty",
    ],
  },
];

// ── Service Categories ────────────────────────────────────────────────────────
const SERVICE_CATEGORIES = [
  {
    id: "hvac",
    name: "Air Conditioning & HVAC",
    icon: Flame,
    color: "#f05a28",
    description:
      "Inverter AC diagnostics, compressor failures, gas leakage, coil replacement & seasonal deep cleaning.",
    avgTime: "45 mins",
    priceRange: "₹499 – ₹3,200",
    jobsCount: "1,420+ completed",
  },
  {
    id: "electrical",
    name: "Electrical Systems & MCBs",
    icon: Zap,
    color: "#eab308",
    description:
      "Short circuit detection, distribution boards, MCB tripping, wiring faults & heavy load automation.",
    avgTime: "30 mins",
    priceRange: "₹349 – ₹2,400",
    jobsCount: "980+ completed",
  },
  {
    id: "plumbing",
    name: "Plumbing & Drainage",
    icon: Droplets,
    color: "#0284c7",
    description:
      "Concealed pipe leaks, motorized valves, pressure booster pumps, fixture replacements & drainage.",
    avgTime: "40 mins",
    priceRange: "₹399 – ₹2,800",
    jobsCount: "1,150+ completed",
  },
  {
    id: "appliances",
    name: "Kitchen & Home Appliances",
    icon: Wrench,
    color: "#16a34a",
    description:
      "Front-load washing machines, microwave inverters, dishwashers, refrigerators & chimney motors.",
    avgTime: "60 mins",
    priceRange: "₹599 – ₹4,500",
    jobsCount: "820+ completed",
  },
  {
    id: "purifiers",
    name: "Water Purifiers & RO Systems",
    icon: Droplets,
    color: "#0d9488",
    description:
      "RO membrane replacement, booster pump pressure check, TDS adjustment & UV chamber servicing.",
    avgTime: "35 mins",
    priceRange: "₹450 – ₹2,600",
    jobsCount: "670+ completed",
  },
  {
    id: "homepass",
    name: "HomePass Property Inspections",
    icon: Home,
    color: "#9333ea",
    description:
      "Digital health passport for your home, appliance inventory audits, electrical safety checks & warranty logs.",
    avgTime: "90 mins",
    priceRange: "₹1,499 Flat",
    jobsCount: "410+ properties",
  },
];

interface LoggedUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: "customer" | "professional" | "admin";
}

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<LoggedUser | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedShowcaseId, setSelectedShowcaseId] = useState("hvac");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const { locality } = useGeolocation();

  // Authenticated user recall via localStorage & /api/auth/me
  useEffect(() => {
    try {
      const stored = localStorage.getItem("omniservice_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name && parsed?.role) {
          setCurrentUser(parsed);
        }
      }
    } catch {}

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.authenticated && data.user) {
          setCurrentUser(data.user);
          localStorage.setItem("omniservice_user", JSON.stringify(data.user));
        } else if (!data.authenticated) {
          setCurrentUser(null);
          localStorage.removeItem("omniservice_user");
        }
      })
      .catch(() => {});
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
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
    } catch {}
    localStorage.removeItem("omniservice_user");
    document.cookie = "authjs.session-token=; path=/; max-age=0";
    document.cookie = "omniservice-role=; path=/; max-age=0";
    document.cookie = "omniservice-user=; path=/; max-age=0";
    setCurrentUser(null);
    setMobileMenuOpen(false);
    router.refresh();
  };

  const currentShowcase =
    HERO_FLOW_SHOWCASES.find((p) => p.id === selectedShowcaseId) ||
    HERO_FLOW_SHOWCASES[0]!;

  const currentStep = TRUST_FLOW_STEPS[activeStepIndex] ?? TRUST_FLOW_STEPS[0]!;

  const getPortalLink = (role: string) => {
    switch (role) {
      case "admin":
        return { href: "/admin/dashboard", label: "Admin Console", badge: "Admin" };
      case "professional":
        return { href: "/pro/dashboard", label: "Provider Portal", badge: "Verified Provider" };
      default:
        return { href: "/customer/dashboard", label: "My Dashboard", badge: "Customer" };
    }
  };

  const portal = currentUser ? getPortalLink(currentUser.role) : null;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.replace("#", "");
      setMobileMenuOpen(false);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-neutral-900 font-serif selection:bg-[#f05a28]/15 selection:text-[#9a2c06]"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 1. TOP NAVBAR — SLEEK PREMIUM GLASSMORPHIC DESIGN                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 w-full border-b border-orange-200/80 bg-[#fffdfa]/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(240,90,40,0.05)] transition-all">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Dynamic Location Selector */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center group" aria-label="OmniService AI Home">
              <Image
                src="/images/OmniService_Logo.png"
                alt="OmniService"
                width={190}
                height={48}
                className="h-9 sm:h-10 w-auto rounded-xl object-contain transition-transform group-hover:scale-102"
                priority
              />
            </Link>

            {/* Clickable Real-Time Location Pill */}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-orange-200/90 bg-orange-50/80 px-3.5 py-1.5 text-xs font-bold text-[#9a2c06] hover:bg-orange-100 hover:border-orange-300 transition-all shadow-2xs group cursor-pointer"
              title="Click to detect or change your location"
            >
              <MapPin className="h-3.5 w-3.5 text-[#f05a28] group-hover:animate-bounce" />
              <span className="max-w-[180px] truncate">{locality || "Hyderabad, IN"}</span>
              <ChevronDown className="h-3 w-3 text-orange-400 group-hover:text-[#f05a28]" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-[#431407]">
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, "#how-it-works")}
              className="transition-colors hover:text-[#f05a28] cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#categories"
              onClick={(e) => handleNavClick(e, "#categories")}
              className="transition-colors hover:text-[#f05a28] cursor-pointer"
            >
              Services
            </a>
            <a
              href="#why-trust"
              onClick={(e) => handleNavClick(e, "#why-trust")}
              className="transition-colors hover:text-[#f05a28] cursor-pointer"
            >
              Trust &amp; Escrow
            </a>
            <Link
              href="/case-study"
              className="transition-colors hover:text-[#f05a28] flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-orange-50"
            >
              <Award className="h-3.5 w-3.5 text-[#f05a28]" />
              <span>Case Study</span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {currentUser && portal ? (
              <div className="flex items-center gap-3">
                <Link
                  href={portal.href}
                  className="flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-200 px-3.5 py-2 text-xs font-bold text-[#c2410c] hover:bg-orange-100 transition-colors shadow-2xs"
                >
                  <Briefcase className="h-3.5 w-3.5 text-[#f05a28]" />
                  <span>{portal.label}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out"
                  className="rounded-xl p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <GoogleNavButton variant="desktop" />
                <Link
                  href="/login"
                  className="rounded-xl px-3.5 py-2 text-xs font-bold text-[#431407] hover:text-[#f05a28] hover:bg-orange-50/70 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-[#f05a28] px-4.5 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/25 hover:bg-[#ea580c] transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl text-neutral-800 hover:bg-orange-50 hover:text-[#f05a28] transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* ── Slide-Out Mobile Sidebar Drawer ── */}
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
                <a
                  href="#how-it-works"
                  onClick={(e) => handleNavClick(e, "#how-it-works")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-orange-100/60 cursor-pointer"
                >
                  <Layers className="h-4 w-4 text-[#f05a28]" />
                  <span>How It Works</span>
                </a>

                <a
                  href="#categories"
                  onClick={(e) => handleNavClick(e, "#categories")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-orange-100/60 cursor-pointer"
                >
                  <Wrench className="h-4 w-4 text-[#f05a28]" />
                  <span>Service Trades</span>
                </a>

                <a
                  href="#why-trust"
                  onClick={(e) => handleNavClick(e, "#why-trust")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-orange-100/60 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4 text-[#f05a28]" />
                  <span>Trust &amp; Escrow</span>
                </a>

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
              </div>

              <div className="pt-3 border-t border-orange-100 space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-3 block">
                  Portals &amp; Providers
                </span>
                <Link
                  href="/register?role=professional"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[#c2410c] hover:bg-orange-100/60"
                >
                  <Briefcase className="h-4 w-4 text-[#f05a28]" />
                  <span>Join as Provider Partner</span>
                </Link>
                <Link
                  href="/customer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-orange-100/60"
                >
                  <User className="h-4 w-4 text-[#f05a28]" />
                  <span>Customer Dashboard</span>
                </Link>
              </div>

              {/* Instant Google Login for Unauthenticated Mobile Drawer */}
              {!currentUser && (
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
              )}
            </div>

            <div className="p-4 border-t border-orange-200/70 bg-white space-y-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#f05a28]" />
                <a href="tel:+918624851910" className="hover:text-[#f05a28] font-bold">
                  +91 86248 51910
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#f05a28]" />
                <a href="mailto:volcanic.digitalsolutions@gmail.com" className="hover:text-[#f05a28] font-bold truncate">
                  volcanic.digitalsolutions@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#f05a28]" />
                <span className="truncate">{locality || "Hyderabad, Telangana"}</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 2. HERO SECTION — WORLD-CLASS ARTISTIC FLOW & GEOMETRIC DESIGN      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden border-b border-orange-200/80 bg-gradient-to-b from-[#fffaf4] via-[#fff3e6] to-[#fdecdb] py-16 sm:py-24 lg:py-28">
        {/* Artistic SVG Flow Ribbons & Geometric Contour Art */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-35"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 900"
          fill="none"
        >
          <path
            d="M-80,180 C280,80 480,420 880,260 C1280,120 1380,380 1560,320"
            stroke="url(#heroFlow1)"
            strokeWidth="2"
            strokeDasharray="6 8"
          />
          <path
            d="M-100,320 C240,200 580,520 960,390 C1320,280 1420,520 1580,460"
            stroke="url(#heroFlow2)"
            strokeWidth="2.5"
          />
          <path
            d="M-60,480 C320,380 660,660 1060,480 C1360,360 1460,620 1580,560"
            stroke="url(#heroFlow1)"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          <defs>
            <linearGradient id="heroFlow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f05a28" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f05a28" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="heroFlow2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Geometric Light Spheres */}
        <div className="absolute -top-36 left-1/4 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#f05a28]/15 via-amber-300/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-36 right-1/4 w-[560px] h-[560px] rounded-full bg-gradient-to-bl from-amber-400/15 via-orange-300/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-6 w-64 h-64 rounded-full border border-orange-200/50 pointer-events-none opacity-30 -translate-y-1/2" />
        <div className="absolute top-2/3 right-8 w-80 h-80 rounded-full border border-dashed border-orange-300/40 pointer-events-none opacity-25" />

        <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 lg:px-12 flex flex-col items-center text-center relative z-10 space-y-8">
          {/* Active Area Badge Pill with 1-Click Change */}
          <button
            type="button"
            onClick={() => setLocationModalOpen(true)}
            className="inline-flex items-center gap-2.5 rounded-full border border-orange-300/90 bg-white/95 px-4 py-1.5 text-xs font-bold text-[#c2410c] shadow-sm hover:bg-orange-50 hover:border-orange-400 transition-all cursor-pointer backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#f05a28] animate-ping" />
            <span>Serving: <strong>{locality || "Hyderabad, IN"}</strong></span>
            <span className="text-orange-300">•</span>
            <span className="text-[#f05a28] underline underline-offset-2">Change Area</span>
          </button>

          {/* Grand Hero Headline in Times New Roman */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#2d130a] leading-[1.1]">
              Show the problem.{" "}
              <span className="bg-gradient-to-r from-[#f05a28] via-[#ea580c] to-[#c2410c] bg-clip-text text-transparent italic">
                Let AI diagnose it.
              </span>{" "}
              Pay only when verified.
            </h1>

            <p className="text-base sm:text-xl text-neutral-700 leading-relaxed max-w-2xl mx-auto font-normal">
              Record a 15-second video of your repair issue. Get locked upfront pricing, certified local providers with parts on board, and 100% escrow payment protection.
            </p>
          </div>

          {/* Action CTAs: Provider & Customer Focused */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f05a28] via-[#ea580c] to-[#c2410c] px-8 py-4 text-base font-bold text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-102"
            >
              <Camera className="h-5 w-5" />
              <span>Book AI Diagnostic</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-orange-300/80 bg-white/95 px-6 py-4 text-base font-bold text-[#c2410c] hover:border-[#f05a28] hover:bg-orange-50/70 transition-all shadow-xs"
            >
              <Layers className="h-5 w-5 text-[#f05a28]" />
              <span>How It Works</span>
            </Link>

            <Link
              href="/register?role=professional"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200/80 bg-white/80 px-6 py-4 text-base font-semibold text-[#7c2d12] hover:bg-white hover:border-orange-300 transition-colors shadow-2xs"
            >
              <Briefcase className="h-4 w-4 text-[#f05a28]" />
              <span>Join as Provider</span>
            </Link>
          </div>

          {/* ── ARTISTIC GEOMETRIC FLOW SHOWCASE (Sculptural, fluid shape) ── */}
          <div className="w-full max-w-5xl rounded-[32px] sm:rounded-[40px] border-2 border-orange-200/90 bg-white/95 backdrop-blur-2xl shadow-2xl shadow-orange-950/10 p-6 sm:p-10 relative overflow-hidden text-left space-y-6">
            {/* Top Flow Ribbon (Step 1 -> Step 2 -> Step 3) */}
            <div className="hidden sm:flex items-center justify-between px-4 py-2.5 rounded-2xl bg-orange-50/60 border border-orange-200/60 text-xs font-semibold text-neutral-600">
              <div className="flex items-center gap-2 text-[#c2410c] font-bold">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f05a28] text-white text-[10px]">1</span>
                <span>15-Sec Video Intake</span>
              </div>
              <ChevronRight className="h-4 w-4 text-orange-300" />
              <div className="flex items-center gap-2 text-[#c2410c] font-bold">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f05a28] text-white text-[10px]">2</span>
                <span>Locked Price Ceiling</span>
              </div>
              <ChevronRight className="h-4 w-4 text-orange-300" />
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">3</span>
                <span>Verified Provider with Parts</span>
              </div>
            </div>

            {/* Header: Select Category Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-orange-100 gap-3">
              <div>
                <span className="text-xs font-bold text-[#f05a28] uppercase tracking-wider block">
                  Interactive Live Diagnostic Preview
                </span>
                <h2 className="text-lg font-bold text-[#2d130a]">
                  See How OmniService Solves Repairs in {locality.split(",")[0] || "Hyderabad"}
                </h2>
              </div>

              {/* Service Tab Pills */}
              <div className="flex flex-wrap gap-2">
                {HERO_FLOW_SHOWCASES.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedShowcaseId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedShowcaseId(item.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#f05a28] text-white shadow-sm scale-102"
                          : "bg-orange-50/60 border border-orange-100 text-neutral-700 hover:bg-orange-100/70"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3-Stage Geometric Flow Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Stage 1: Problem Diagnosis Card with Animated Waveform */}
              <div className="lg:col-span-6 rounded-2xl border border-orange-200/80 bg-gradient-to-br from-[#fff9f2] to-[#fff3e6] p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#c2410c]">
                      <Camera className="h-3.5 w-3.5 text-[#f05a28]" />
                      Step 1 • Visual Diagnostic
                    </span>

                    {/* Animated Acoustic/Visual Waveform Indicator */}
                    <div className="flex items-center gap-1 h-6 px-2.5 py-0.5 rounded-full bg-orange-100/80 border border-orange-200" title="Analyzing Video & Acoustic Vibrations">
                      <span className="text-[10px] font-bold text-[#c2410c] mr-1">Scan</span>
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-1 bg-[#f05a28] rounded-full animate-wave-1" />
                        <span className="w-1 bg-amber-500 rounded-full animate-wave-2" />
                        <span className="w-1 bg-[#f05a28] rounded-full animate-wave-3" />
                        <span className="w-1 bg-amber-600 rounded-full animate-wave-4" />
                        <span className="w-1 bg-[#f05a28] rounded-full animate-wave-5" />
                        <span className="w-1 bg-amber-500 rounded-full animate-wave-6" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Identified Failure Mode
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#2d130a] mt-0.5">
                      {currentShowcase.issue}
                    </h3>
                  </div>

                  <div className="rounded-xl border border-orange-200/90 bg-white p-3.5 text-xs space-y-2">
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Required OEM Part:</span>
                      <strong className="text-neutral-900">{currentShowcase.diagnosedPart}</strong>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Estimated Arrival:</span>
                      <strong className="text-emerald-700">{currentShowcase.arrivalEta} to your doorstep</strong>
                    </div>
                  </div>
                </div>

                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f05a28] to-[#ea580c] py-3 text-xs font-bold text-white shadow-xs hover:from-[#ea580c] hover:to-[#c2410c] transition-all"
                >
                  <Camera className="h-4 w-4" />
                  <span>Start 15-Sec Video Scan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Stage 2 & 3: Transparent Price & Matched Provider Card */}
              <div className="lg:col-span-6 rounded-2xl border border-orange-200/80 bg-white p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c2410c] uppercase tracking-wider">
                      <Lock className="h-3.5 w-3.5 text-emerald-600" />
                      Step 2 &amp; 3 • Locked Price &amp; Provider
                    </span>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                      Price Ceiling Guarantee
                    </span>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Genuine OEM Component:</span>
                      <span className="font-bold text-neutral-900">{currentShowcase.partPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Fair-Market Labor:</span>
                      <span className="font-bold text-neutral-900">{currentShowcase.laborPrice}</span>
                    </div>
                    <div className="pt-2 border-t border-orange-100 flex items-center justify-between text-sm">
                      <span className="font-bold text-[#2d130a]">Total Locked Ceiling:</span>
                      <span className="text-xl font-black text-[#f05a28]">
                        {currentShowcase.totalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Matched Provider Detail */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-emerald-950 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Truck className="h-4 w-4 text-emerald-700" />
                        Matched Verified Provider
                      </span>
                      <span className="text-[11px] text-emerald-700 font-bold">In Stock</span>
                    </div>
                    <div className="text-neutral-800 font-bold">{currentShowcase.provider}</div>
                    <div className="text-[11px] text-emerald-800 font-medium">
                      ✓ {currentShowcase.vanStock}
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-neutral-500 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Your payment is held in escrow until work is completed and verified.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Trust Metrics Row */}
          <div className="w-full max-w-4xl rounded-2xl border border-orange-200/80 bg-white/95 backdrop-blur-md p-6 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#2d130a] block">₹14.8L+</span>
              <span className="text-xs text-neutral-600 font-medium">Escrow Protected</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-700 block">0.12%</span>
              <span className="text-xs text-neutral-600 font-medium">Dispute Rate</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#2d130a] block">15 Sec</span>
              <span className="text-xs text-neutral-600 font-medium">Video Intake</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#f05a28] block">100%</span>
              <span className="text-xs text-neutral-600 font-medium">Locked Price Ceiling</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 3. THE 4-STEP VERIFIED TRUST LIFECYCLE (CONCISE & CONSUMER-FRIENDLY) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="w-full px-5 sm:px-10 lg:px-16 py-16 lg:py-24 border-b border-orange-200/70 bg-[#fffdfa]"
      >
        <div className="max-w-7xl mx-auto w-full space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/15 px-4 py-1 text-xs font-bold text-[#c2410c] uppercase tracking-wider border border-orange-200/80 shadow-2xs">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2d130a]">
              How OmniService Protects Every Repair
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              From instant video diagnosis to mobile provider dispatch and verified escrow payment releases.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TRUST_FLOW_STEPS.map((s, idx) => {
              const isActive = activeStepIndex === idx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`rounded-2xl p-4 text-left border-2 transition-all cursor-pointer ${
                    isActive
                      ? "border-[#f05a28] bg-white shadow-md scale-102"
                      : "border-orange-100 bg-white/70 hover:bg-white hover:border-orange-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold ${isActive ? "text-[#f05a28]" : "text-neutral-400"}`}>
                      STEP {s.stepNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                        isActive ? "bg-[#f05a28]/10 text-[#c2410c]" : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {s.tag}
                    </span>
                  </div>
                  <h3 className={`text-sm font-bold truncate ${isActive ? "text-[#2d130a]" : "text-neutral-700"}`}>
                    {s.label}
                  </h3>
                </button>
              );
            })}
          </div>

          {/* Step Detail Card */}
          <div className="rounded-3xl border-2 border-orange-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-orange-950/5 relative overflow-hidden">
            <div className="max-w-3xl space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#f05a28]">
                  Step {currentStep.stepNumber} Overview
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#2d130a]">
                  {currentStep.title}
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {currentStep.bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-700">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#f05a28] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#ea580c] transition-colors"
                >
                  <span>Experience This Step Live</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 4. SERVICE CATEGORIES                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="categories" className="w-full px-5 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-24 border-b border-orange-200/70 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto w-full space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/15 px-4 py-1 text-xs font-bold text-[#c2410c] uppercase tracking-wider border border-orange-200/80 shadow-2xs">
              Specialized Trades
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2d130a]">
              Certified Services in {locality.split(",")[0] || "Hyderabad"}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Every job is handled by background-checked master technicians equipped with calibrated tools and genuine OEM spare parts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl border-2 border-orange-100 bg-white p-6 space-y-4 hover:border-orange-300 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs"
                        style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-500">
                        {cat.jobsCount}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#2d130a]">{cat.name}</h3>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-orange-100">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-400 block">Avg Response</span>
                        <span className="font-bold text-neutral-800">{cat.avgTime}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 block">Price Range</span>
                        <span className="font-bold text-[#f05a28]">{cat.priceRange}</span>
                      </div>
                    </div>

                    <Link
                      href={`/register?category=${cat.id}`}
                      className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-orange-200 bg-[#fffbf7] py-2.5 text-xs font-bold text-[#c2410c] hover:bg-orange-100 hover:border-orange-300 transition-colors"
                    >
                      <span>Book in {locality.split(",")[0] || "Hyderabad"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 5. WHY CHOOSE OMNISERVICE — 4 PILLARS OF GUARANTEED TRUST           */}
      {/* (Clean, Human, No Developer Jargon or Latency Logs)                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="why-trust" className="w-full px-5 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-24 border-b border-orange-200/70 bg-white">
        <div className="max-w-7xl mx-auto w-full space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-orange-500/10 px-4 py-1 text-xs font-bold text-[#c2410c] uppercase tracking-wider border border-orange-200/80">
              The OmniService Promise
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2d130a]">
              Why Hyderabad Homeowners Trust OmniService
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Home repairs should never be a stressful guessing game. We have rebuilt the entire experience around certainty, safety, and guaranteed quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="rounded-2xl border-2 border-orange-100 bg-[#fffbf7] p-6 space-y-3 hover:border-orange-300 hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#f05a28]">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#2d130a]">Accurate Diagnosis</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Show the problem with a 15-second video. Our intelligent system pinpoints the root failure before a technician touches a single tool.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border-2 border-orange-100 bg-[#fffbf7] p-6 space-y-3 hover:border-orange-300 hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#2d130a]">Locked Price Ceilings</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                See exact component costs and fair labor upfront. The price is locked before booking — you never face on-site renegotiation or hidden fees.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border-2 border-orange-100 bg-[#fffbf7] p-6 space-y-3 hover:border-orange-300 hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#2d130a]">Parts on the Van</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We match local certified providers who already have the exact genuine replacement parts stocked on their mobile van for first-visit completion.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-2xl border-2 border-orange-100 bg-[#fffbf7] p-6 space-y-3 hover:border-orange-300 hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#2d130a]">Escrow Protected</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Your payment stays safely locked in escrow until the job is completed, inspected, and verified with before-and-after photos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 6. FOOTER — CRISP ILLUMINATED LOGO & HYDERABAD HUB DETAILS          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <footer className="w-full bg-[#1c0d08] text-neutral-300 py-16 px-5 sm:px-10 lg:px-16 border-t border-orange-950">
        <div className="max-w-7xl mx-auto w-full space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              {/* CRISP ILLUMINATED LOGO CONTAINER (Resolves Image 2 contrast issue) */}
              <Link href="/" className="inline-block">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow-lg shadow-black/40 border border-white/20">
                  <Image
                    src="/images/OmniService_Logo.png"
                    alt="OmniService AI"
                    width={160}
                    height={38}
                    className="h-8 w-auto object-contain"
                  />
                </div>
              </Link>
              <p className="text-xs text-neutral-400 leading-relaxed">
                The trusted home services platform across {locality || "Greater Hyderabad, Telangana"}. AI diagnostics, locked price ceilings, and verified escrow release.
              </p>
              <div className="space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#f05a28]" />
                  <a href="tel:+918624851910" className="hover:text-white transition-colors">
                    +91 86248 51910
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#f05a28]" />
                  <a href="mailto:volcanic.digitalsolutions@gmail.com" className="hover:text-white transition-colors">
                    volcanic.digitalsolutions@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#f05a28]" />
                  <span>{locality || "Hyderabad, Telangana 500001"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="#how-it-works" className="hover:text-[#f05a28] transition-colors">How It Works</Link></li>
                <li><Link href="#categories" className="hover:text-[#f05a28] transition-colors">Specialized Services</Link></li>
                <li><Link href="#why-trust" className="hover:text-[#f05a28] transition-colors">Why Choose Us</Link></li>
                <li><Link href="/register" className="hover:text-[#f05a28] transition-colors">Book AI Diagnostic</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Portals &amp; Overview</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/customer/dashboard" className="hover:text-[#f05a28] transition-colors">Customer Portal</Link></li>
                <li><Link href="/pro/dashboard" className="hover:text-[#f05a28] transition-colors">Provider Portal</Link></li>
                <li><Link href="/admin/dashboard" className="hover:text-[#f05a28] transition-colors">Governance Admin</Link></li>
                <li><Link href="/register?role=professional" className="hover:text-[#f05a28] transition-colors">Join as Provider Partner</Link></li>
                <li><Link href="/case-study" className="hover:text-[#f05a28] transition-colors font-bold text-orange-300">Case Study &amp; Architecture</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Trust &amp; Governance</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/privacy" className="hover:text-[#f05a28] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#f05a28] transition-colors">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-[#f05a28] transition-colors">Support &amp; Safety</Link></li>
                <li><span className="text-neutral-400">Escrow Protected (TrustLock™)</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span>Crafted by</span>
              <a
                href="https://volcanic.world"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white hover:text-[#f05a28] tracking-widest uppercase transition-colors"
              >
                VOLCANIC
              </a>
              <span>• Local Solutions. Higher Standards.</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-neutral-400">
              <span>© {new Date().getFullYear()} OmniService AI. All rights reserved.</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" /> Fiduciary Escrow Guarantee
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating 5-Message AI Diagnostic Assistant */}
      <HomeDiagnosticChat />

      {/* Interactive Service Area & Location Modal */}
      <LocationSelectorModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </div>
  );
}
