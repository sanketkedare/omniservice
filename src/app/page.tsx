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
  Star,
  HelpCircle,
  ChevronUp,
  Quote,
} from "lucide-react";
import { HomeDiagnosticChat } from "@/components/ai/HomeDiagnosticChat";
import { useGeolocation } from "@/lib/geolocation";
import { GoogleNavButton } from "@/components/auth/GoogleNavButton";
import { PWAInstallButton } from "@/components/shared/PWAInstallButton";

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

// ── Service Categories (Categorical, Visual, Production) ───────────────────────
const SERVICE_CATEGORIES = [
  {
    id: "hvac",
    name: "Air Conditioning & HVAC",
    category: "Cooling & Climate",
    icon: Flame,
    image: "/api/media/asset?name=hero_technician",
    color: "#f05a28",
    description:
      "Inverter AC diagnostics, compressor failures, gas leakage, coil replacement & seasonal deep cleaning.",
    avgTime: "45 mins",
    priceRange: "₹499 – ₹3,200",
    jobsCount: "1,420+ completed",
  },
  {
    id: "electrical",
    name: "Electrical Systems & Wiring",
    category: "Power & Automation",
    icon: Zap,
    image: "/api/media/asset?name=electrical_service",
    color: "#eab308",
    description:
      "Distribution boards, short circuits, MCB tripping, wiring faults & heavy load automation.",
    avgTime: "30 mins",
    priceRange: "₹349 – ₹2,400",
    jobsCount: "980+ completed",
  },
  {
    id: "plumbing",
    name: "Plumbing & Drainage Care",
    category: "Water & Sanitation",
    icon: Droplets,
    image: "/api/media/asset?name=plumbing_service",
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
    category: "Major Appliances",
    icon: Wrench,
    image: "/api/media/asset?name=appliance_repair",
    color: "#16a34a",
    description:
      "Front-load washing machines, microwave inverters, dishwashers, refrigerators & chimney motors.",
    avgTime: "50 mins",
    priceRange: "₹599 – ₹4,500",
    jobsCount: "820+ completed",
  },
  {
    id: "purifiers",
    name: "Water Purifiers & RO Systems",
    category: "Pure Water Solutions",
    icon: Droplets,
    image: "/api/media/asset?name=ro_purifier",
    color: "#0d9488",
    description:
      "RO membrane replacement, booster pump pressure check, TDS adjustment & UV chamber servicing.",
    avgTime: "35 mins",
    priceRange: "₹450 – ₹2,600",
    jobsCount: "670+ completed",
  },
  {
    id: "solar",
    name: "Solar Inverters & Power Backup",
    category: "Renewable & Storage",
    icon: Zap,
    image: "/api/media/asset?name=solar_inverter",
    color: "#f59e0b",
    description:
      "Hybrid rooftop solar inverters, lithium battery banks, surge protection & high-load UPS checks.",
    avgTime: "60 mins",
    priceRange: "₹799 – ₹5,800",
    jobsCount: "340+ completed",
  },
  {
    id: "smarthome",
    name: "Smart Security & CCTV",
    category: "Home Automation",
    icon: Shield,
    image: "/api/media/asset?name=smart_home_cctv",
    color: "#6366f1",
    description:
      "AI camera installations, smart video doorbells, biometric locks, NVR storage & sensor setups.",
    avgTime: "45 mins",
    priceRange: "₹699 – ₹4,200",
    jobsCount: "510+ completed",
  },
  {
    id: "homepass",
    name: "HomePass Property Audits",
    category: "Comprehensive Audits",
    icon: Home,
    image: "/api/media/asset?name=hero_technician",
    color: "#9333ea",
    description:
      "Digital health passport for your home, appliance inventory audits, electrical safety checks & warranty logs.",
    avgTime: "90 mins",
    priceRange: "₹1,499 Flat",
    jobsCount: "410+ properties",
  },
];

// ── Verified Customer Reviews Across Greater Hyderabad ───────────────────────
const CUSTOMER_REVIEWS = [
  {
    id: "rev_1",
    customerName: "Dr. Ananya Reddy",
    location: "Kondapur, Hyderabad",
    trade: "Air Conditioning",
    issue: "Inverter AC Compressor MCB Trip",
    rating: 5,
    date: "September 18, 2026",
    escrowAmount: "₹2,800 Released",
    comment:
      "InspectAI identified the burned dual-run capacitor in seconds from my 15-second phone video. The technician arrived with the exact OEM capacitor in his van. The best part? Money stayed safely in the portal escrow until my AC blew ice-cold air!",
  },
  {
    id: "rev_2",
    customerName: "Venkatesh Rao",
    location: "Banjara Hills, Hyderabad",
    trade: "Electrical & Wiring",
    issue: "3-Phase Distribution Board Short",
    rating: 5,
    date: "September 14, 2026",
    escrowAmount: "₹1,650 Released",
    comment:
      "Most local electricians quote arbitrary prices after entering the gate. OmniService locked the price ceiling at ₹1,650 upfront. PWD-licensed technician, calibrated tools, and zero phone calls from unknown numbers thanks to in-app masking.",
  },
  {
    id: "rev_3",
    customerName: "Sneha Mukherjee",
    location: "HITEC City, Hyderabad",
    trade: "Plumbing & Drainage",
    issue: "Concealed Wall Coupling Leak",
    rating: 5,
    date: "September 11, 2026",
    escrowAmount: "₹2,100 Released",
    comment:
      "The diagnostic accurately pinpointed the concealed elbow joint without ripping open multiple tiles. The repair was completed in 45 minutes, photographic proof was logged, and funds were released with one tap.",
  },
  {
    id: "rev_4",
    customerName: "Karthik Subramanian",
    location: "Gachibowli, Hyderabad",
    trade: "Water Purifier (RO)",
    issue: "TDS 480 & Booster Pump Pressure",
    rating: 5,
    date: "September 06, 2026",
    escrowAmount: "₹1,450 Released",
    comment:
      "Technician tested water TDS before and after installation right in front of me (dropped from 480 to 65 ppm). Van had genuine membrane filters ready. Fiduciary escrow gives immense peace of mind.",
  },
];

// ── Comprehensive Hyperlocal FAQs ─────────────────────────────────────────────
const FAQS_LIST = [
  {
    q: "How does the InspectAI video diagnostic work?",
    a: "Simply record a 15-second video or take a photo of the breakdown (e.g. leaking pipe, noisy AC compressor, or tripped breaker). Our Google Gemini vision model analyzes the visual and mechanical indicators, determines the likely root cause, identifies the required OEM spare parts, and calculates a guaranteed price ceiling before any technician is dispatched.",
  },
  {
    q: "Why is my payment held in escrow instead of paid to the technician directly?",
    a: "Direct cash payments expose customers to incomplete repairs, surprise price increases, and abandoned jobs. When you book on OmniService, your payment is safely deposited in our encrypted TrustLock™ Escrow Vault. The technician is only disbursed funds after they submit photographic proof of the completed repair and you confirm satisfaction.",
  },
  {
    q: "How is my phone number protected from service providers?",
    a: "Neither your phone number nor the provider's phone number is ever exposed. All calls and dispatch updates are relayed through an encrypted platform bridge. This guarantees total privacy, zero spam, and prevents off-platform circumvention.",
  },
  {
    q: "What if the technician discovers a different issue after arriving?",
    a: "The technician is strictly bound by the locked price ceiling for the diagnosed failure mode. If internal physical disassembly reveals additional damaged parts, the technician cannot demand arbitrary extra cash. They must submit a supplemental diagnostic verification photo through the portal, which you can approve or decline with complete escrow control.",
  },
  {
    q: "Which areas in Hyderabad are currently supported?",
    a: "OmniService operates across the entire Greater Hyderabad region within a 45-km radius, including HITEC City, Gachibowli, Kondapur, Madhapur, Jubilee Hills, Banjara Hills, Begumpet, Secunderabad, Miyapur, Kukatpally, and Shamshabad.",
  },
  {
    q: "Is there a warranty on completed repairs?",
    a: "Yes. Every verified repair performed through OmniService includes a 30-day comprehensive Workmanship Guarantee. If the same defect recurs within 30 days, we dispatch a senior auditor at zero additional cost or issue a 100% refund from our escrow reserves.",
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
      {/* 1. TOP NAVBAR — FLOATING ISLAND PILL WITH MINIMAL WORDS             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-3 sm:top-4 z-40 w-full px-3 sm:px-6 pointer-events-none transition-all">
        <header className="max-w-5xl mx-auto w-full rounded-full border border-orange-200/90 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-xl shadow-orange-950/5 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 pointer-events-auto transition-all">
          {/* Brand Logo & Auto-Detected Hyderabad Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center group" aria-label="OmniService AI Home">
              <Image
                src="/images/OmniService_Logo.png"
                alt="OmniService"
                width={170}
                height={40}
                className="h-8 sm:h-9 w-auto rounded-lg object-contain transition-transform group-hover:scale-102"
                priority
              />
            </Link>

            {/* Static Non-Clickable Location Status Badge (No Manual Popup) */}
            <div
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-orange-200/80 bg-orange-50/70 px-3 py-1 text-[11px] font-bold text-[#9a2c06] select-none"
              title="Verified Service Zone: Greater Hyderabad"
            >
              <MapPin className="h-3 w-3 text-[#f05a28]" />
              <span className="max-w-[130px] truncate">{locality || "Hyderabad, IN"}</span>
            </div>
          </div>

          {/* Desktop Navigation Links — Minimal Words */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-[#431407]">
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, "#how-it-works")}
              className="transition-colors hover:text-[#f05a28] cursor-pointer"
            >
              Flow
            </a>
            <a
              href="#categories"
              onClick={(e) => handleNavClick(e, "#categories")}
              className="transition-colors hover:text-[#f05a28] cursor-pointer"
            >
              Trades
            </a>
            <a
              href="#why-trust"
              onClick={(e) => handleNavClick(e, "#why-trust")}
              className="transition-colors hover:text-[#f05a28] cursor-pointer"
            >
              Escrow
            </a>
          </nav>

          {/* Desktop Auth Actions: Google & Get Started Only */}
          <div className="hidden sm:flex items-center gap-2">
            {currentUser && portal ? (
              <div className="flex items-center gap-2">
                <Link
                  href={portal.href}
                  className="flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3.5 py-1.5 text-xs font-bold text-[#c2410c] hover:bg-orange-100 transition-colors shadow-2xs"
                >
                  <Briefcase className="h-3.5 w-3.5 text-[#f05a28]" />
                  <span>{portal.label}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out"
                  className="rounded-full p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <GoogleNavButton variant="desktop" />
                <Link
                  href="/register"
                  className="rounded-full bg-[#f05a28] px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/25 hover:bg-[#ea580c] transition-all cursor-pointer"
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
            className="lg:hidden p-1.5 rounded-full text-neutral-800 hover:bg-orange-50 hover:text-[#f05a28] transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>
      </div>

      {/* ── Slide-Out Mobile Sidebar Drawer ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#fffaf5] border-l border-orange-200/80 shadow-2xl z-10 flex flex-col justify-between">
            <div className="p-4 border-b border-orange-200/70 flex items-center justify-between">
              <Image
                src="/images/OmniService_Logo.png"
                alt="OmniService"
                width={140}
                height={35}
                className="h-7 w-auto object-contain"
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
              {/* App Install Button in Drawer */}
              <PWAInstallButton variant="banner" onClick={() => setMobileMenuOpen(false)} />

              {/* Static Verified Location Badge (No Manual Selector) */}
              <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs text-[#9a2c06] font-bold select-none">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#f05a28]" />
                  <span className="truncate">{locality || "Hyderabad, Telangana"}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              <div className="space-y-1">
                <a
                  href="#how-it-works"
                  onClick={(e) => handleNavClick(e, "#how-it-works")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-orange-100/60 cursor-pointer"
                >
                  <Layers className="h-4 w-4 text-[#f05a28]" />
                  <span>How It Works (Flow)</span>
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

              {/* Instant Google Login & Get Started */}
              {!currentUser && (
                <div className="pt-3 border-t border-orange-100 space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1 block">
                    Instant Access
                  </span>
                  <GoogleNavButton variant="mobile" />
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2.5 px-3 rounded-xl bg-[#f05a28] text-xs font-bold text-white shadow-xs hover:bg-[#ea580c]"
                  >
                    Get Started
                  </Link>
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
      <section className="relative w-full overflow-hidden border-b border-orange-200/80 py-16 sm:py-24 lg:py-28">
        {/* Real Photographic Background with Warm Ambient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/api/media/asset?name=hero_technician"
            alt="OmniService Field Technician"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fffaf4]/92 via-[#fff5eb]/88 to-[#fdecdb]/95 backdrop-blur-[1px]" />
        </div>

        {/* Artistic SVG Flow Ribbons */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-1"
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
        <div className="absolute -top-36 left-1/4 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#f05a28]/15 via-amber-300/15 to-transparent blur-3xl pointer-events-none z-1" />
        <div className="absolute -bottom-36 right-1/4 w-[560px] h-[560px] rounded-full bg-gradient-to-bl from-amber-400/15 via-orange-300/10 to-transparent blur-3xl pointer-events-none z-1" />

        <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 lg:px-12 flex flex-col items-center text-center relative z-10 space-y-8">
          {/* Static Verified Service Zone Badge (No Manual Popup) */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-orange-300/90 bg-white/95 px-4 py-1.5 text-xs font-bold text-[#c2410c] shadow-xs backdrop-blur-md select-none">
            <span className="flex h-2 w-2 rounded-full bg-[#f05a28] animate-ping" />
            <span>Serving: <strong>{locality || "Greater Hyderabad Active Radius"}</strong></span>
            <span className="text-orange-300">•</span>
            <span className="text-emerald-700 font-bold">Auto-Verified Hub</span>
          </div>

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

          {/* Action CTAs: Book Diagnostic, Install App, Case Study, Join as Provider */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/customer/new-request"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f05a28] via-[#ea580c] to-[#c2410c] px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-102"
            >
              <Camera className="h-5 w-5" />
              <span>Book AI Diagnostic</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Install App Button in Hero */}
            <PWAInstallButton variant="hero" />

            {/* Case Study Button in Hero */}
            <Link
              href="/case-study"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-orange-300/90 bg-white/95 px-6 py-3.5 text-sm font-bold text-[#c2410c] shadow-md shadow-orange-900/5 hover:bg-orange-50 hover:border-orange-400 transition-all cursor-pointer"
            >
              <Award className="h-4 w-4 text-[#f05a28]" />
              <span>Case Study</span>
            </Link>

            <Link
              href="/register?role=professional"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200/80 bg-white/80 px-6 py-3.5 text-sm font-semibold text-[#7c2d12] hover:bg-white hover:border-orange-300 transition-colors shadow-2xs"
            >
              <Briefcase className="h-4 w-4 text-[#f05a28]" />
              <span>Join as Provider</span>
            </Link>
          </div>

          {/* ── 3-STEP GEOMETRIC FLOW DIAGRAM (SHAPES, MINIMAL READING, NO CLUTTER) ── */}
          <div className="w-full max-w-4xl pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {/* Step 1 Geometric Card */}
              <div className="group rounded-3xl border-2 border-orange-200/90 bg-white/90 backdrop-blur-md p-6 shadow-lg shadow-orange-950/5 hover:border-[#f05a28] hover:-translate-y-1 transition-all text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f05a28] to-[#ea580c] text-white shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
                  <Camera className="h-7 w-7" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-100 text-[#c2410c] text-[11px] font-bold">
                  <span>Step 1</span>
                </div>
                <h3 className="text-base font-bold text-[#2d130a]">15-Sec Video Intake</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Point camera at the defect. InspectAI pinpoints root cause and OEM replacement part.
                </p>
              </div>

              {/* Step 2 Geometric Card */}
              <div className="group rounded-3xl border-2 border-orange-200/90 bg-white/90 backdrop-blur-md p-6 shadow-lg shadow-orange-950/5 hover:border-[#f05a28] hover:-translate-y-1 transition-all text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-[#f05a28] text-white shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
                  <Lock className="h-7 w-7" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                  <span>Step 2</span>
                </div>
                <h3 className="text-base font-bold text-[#2d130a]">Locked Price Ceiling</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Guaranteed upfront cost ceiling before dispatch. Funds held secure in portal escrow.
                </p>
              </div>

              {/* Step 3 Geometric Card */}
              <div className="group rounded-3xl border-2 border-orange-200/90 bg-white/90 backdrop-blur-md p-6 shadow-lg shadow-orange-950/5 hover:border-emerald-500 hover:-translate-y-1 transition-all text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                  <Truck className="h-7 w-7" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <span>Step 3</span>
                </div>
                <h3 className="text-base font-bold text-[#2d130a]">Van Dispatched with Parts</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Accredited specialist arrives with OEM inventory ready for single-trip resolution.
                </p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="group rounded-3xl border-2 border-orange-100 bg-white overflow-hidden hover:border-[#f05a28]/60 hover:shadow-xl hover:shadow-orange-950/10 transition-all flex flex-col justify-between"
                >
                  {/* Category Real Photography Showcase Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                    {/* Floating Category Tag */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-black text-[#2d130a] shadow-xs">
                      <Icon className="h-3.5 w-3.5" style={{ color: cat.color }} />
                      <span>{cat.category}</span>
                    </div>

                    {/* Verified count badge */}
                    <div className="absolute bottom-2.5 left-3 text-white text-[11px] font-bold">
                      <span className="bg-emerald-600/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white shadow-xs">
                        ✓ {cat.jobsCount}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#2d130a] group-hover:text-[#f05a28] transition-colors leading-snug">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-orange-100">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Avg Arrival</span>
                          <span className="font-bold text-neutral-800">{cat.avgTime}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Price Range</span>
                          <span className="font-bold text-[#f05a28]">{cat.priceRange}</span>
                        </div>
                      </div>

                      <Link
                        href={`/customer/new-request?category=${cat.id}`}
                        className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-orange-200/90 bg-[#fffbf7] py-2 text-xs font-bold text-[#c2410c] hover:bg-[#f05a28] hover:text-white hover:border-[#f05a28] transition-all cursor-pointer shadow-2xs"
                      >
                        <span>Explore Category</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
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
      {/* 4. VERIFIED CUSTOMER REVIEWS (GREATER HYDERABAD)                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="reviews" className="relative py-20 px-5 sm:px-10 lg:px-16 border-t border-orange-200/60 bg-gradient-to-b from-[#fffaf5] via-white to-[#fff8f0]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3.5 py-1 text-xs font-bold text-[#c2410c] border border-orange-200">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>Hyderabad Verified Reviews</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2d130a] tracking-tight">
              Real Homeowners. Locked Prices. Zero Surprises.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every review is backed by a verified 15-second InspectAI diagnostic and funds released only after homeowner sign-off.
            </p>
          </div>

          {/* Aggregate Trust Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:p-6 rounded-3xl bg-white border border-orange-200/80 shadow-xs text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-lg sm:text-2xl font-black text-[#2d130a]">4.96 / 5.0</div>
              <p className="text-[11px] text-neutral-500 font-medium">Average Service Rating</p>
            </div>
            <div className="space-y-1">
              <div className="text-lg sm:text-2xl font-black text-[#f05a28]">1,840+</div>
              <div className="text-[11px] text-neutral-500 font-medium">Completed Jobs</div>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">Greater Hyderabad</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg sm:text-2xl font-black text-emerald-600">100%</div>
              <div className="text-[11px] text-neutral-500 font-medium">Escrow Protected</div>
              <span className="text-[10px] text-neutral-400">Zero Direct Cash</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg sm:text-2xl font-black text-[#2d130a]">₹0</div>
              <div className="text-[11px] text-neutral-500 font-medium">Hidden Upcharges</div>
              <span className="text-[10px] text-orange-600 font-semibold">Strict Price Ceiling</span>
            </div>
          </div>

          {/* Customer Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="rounded-3xl border border-orange-200/80 bg-white p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  {/* Top Bar: Stars + Escrow Tag */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 border border-emerald-200">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      {rev.escrowAmount}
                    </span>
                  </div>

                  {/* Trade & Issue Pill */}
                  <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#9a2c06] bg-orange-50/80 px-2.5 py-1 rounded-lg border border-orange-200/60">
                    <Wrench className="h-3 w-3 text-[#f05a28]" />
                    <span>{rev.trade}</span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-neutral-600 font-medium truncate max-w-[200px]">{rev.issue}</span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic relative">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Customer Identity Footer */}
                <div className="pt-4 border-t border-orange-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-[#f05a28] text-white text-xs font-bold shadow-xs">
                      {rev.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#2d130a] flex items-center gap-1.5">
                        <span>{rev.customerName}</span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-orange-400" />
                        <span>{rev.location}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-neutral-400 font-medium whitespace-nowrap">
                    {rev.date}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Cryptographic Trust Footer Strip */}
          <div className="p-4 rounded-2xl bg-orange-100/60 border border-orange-200/80 text-center text-xs text-neutral-600 flex flex-col sm:flex-row items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#f05a28]" />
            <span>
              <strong>Cryptographic Escrow Assurance:</strong> 100% of reviews are tied to an immutable job voucher. Paid endorsements or anonymous submissions are impossible.
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 5. FREQUENTLY ASKED QUESTIONS (FAQS ACCORDION)                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="faqs" className="relative py-20 px-5 sm:px-10 lg:px-16 border-t border-orange-200/60 bg-white">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3.5 py-1 text-xs font-bold text-[#c2410c] border border-orange-200">
              <HelpCircle className="h-3.5 w-3.5 text-[#f05a28]" />
              <span>Transparent &amp; Clear</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2d130a] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Everything you need to know about InspectAI video diagnostics, locked price ceilings, fiduciary escrow, and technician matching.
            </p>
          </div>

          {/* Accordion Questions List */}
          <div className="space-y-3">
            {FAQS_LIST.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? "border-orange-300 bg-[#fffcf9] shadow-sm"
                      : "border-orange-100 bg-white hover:border-orange-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-[#2d130a] flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-mono font-bold transition-colors ${
                          isOpen
                            ? "bg-[#f05a28] text-white"
                            : "bg-orange-100 text-[#9a2c06]"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span>{faq.q}</span>
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                        isOpen ? "bg-orange-100 text-[#f05a28] rotate-180" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-orange-100/70 pt-4 animate-in fade-in-50 duration-200">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Emergency / Additional Support Banner */}
          <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#1c0c05] via-[#2d1207] to-[#1a0802] border-2 border-orange-500/40 shadow-[0_20px_50px_rgba(240,90,40,0.25)] flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#f05a28]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-200 text-xs font-bold tracking-wider uppercase">
                <span className="h-2 w-2 rounded-full bg-[#f05a28] animate-pulse" />
                <span>24/7 Rapid Response Desk</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center justify-center lg:justify-start gap-3 tracking-tight" style={{ color: '#ffffff' }}>
                <Sparkles className="h-6 w-6 text-orange-400 shrink-0 animate-pulse" />
                <span style={{ color: '#ffffff', fontWeight: 900 }}>Still have questions or facing an urgent breakdown?</span>
              </h3>
              <p className="text-xs sm:text-sm max-w-xl leading-relaxed font-medium" style={{ color: '#fed7aa' }}>
                Chat directly with InspectAI right now or contact our 24/7 Hyderabad dispatch support desk for instant coordinator help.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3.5 shrink-0 flex-wrap justify-center">
              <Link
                href="/customer/new-request"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#f05a28] hover:bg-[#ea580c] px-6 py-3.5 text-xs sm:text-sm font-black text-white shadow-xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                style={{ color: '#ffffff' }}
              >
                <span style={{ color: '#ffffff' }}>Start AI Diagnostic</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+918624851910"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/30 px-6 py-3.5 text-xs sm:text-sm font-black text-white transition-all shadow-md backdrop-blur-sm"
                style={{ color: '#ffffff' }}
              >
                <Phone className="h-4 w-4 text-orange-400" />
                <span style={{ color: '#ffffff' }}>+91 86248 51910</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 6. REDESIGNED FOOTER — VOLCANIC WATERMARK & BRANDING                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <footer className="relative w-full bg-[#150702] text-neutral-300 py-16 px-5 sm:px-10 lg:px-16 border-t border-orange-900/60 overflow-hidden">
        {/* Prominent V O L C A N I C Ambient Background Watermark (Scaled to fit without being cut off) */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
          <span
            className="text-[clamp(2.5rem,7.5vw,7.5rem)] font-black tracking-[0.18em] sm:tracking-[0.25em] uppercase whitespace-nowrap text-center px-4"
            style={{
              color: "rgba(240, 90, 40, 0.16)",
              WebkitTextStroke: "1px rgba(240, 90, 40, 0.35)",
              textShadow: "0 0 50px rgba(240, 90, 40, 0.2)",
            }}
          >
            V O L C A N I C
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              {/* Crisp Illuminated OmniService Logo Container */}
              <Link href="/" className="inline-block">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow-xl shadow-black/50 border border-white/20">
                  <Image
                    src="/images/OmniService_Logo.png"
                    alt="OmniService AI"
                    width={160}
                    height={38}
                    className="h-8 w-auto object-contain"
                  />
                </div>
              </Link>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#d4d4d8' }}>
                The trusted hyperlocal home services engine across {locality || "Greater Hyderabad, Telangana"}. 15-second video intake, locked price ceilings, and 100% fiduciary escrow protection.
              </p>
              <div className="space-y-2 text-xs sm:text-sm" style={{ color: '#e4e4e7' }}>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#f05a28]" />
                  <a href="tel:+918624851910" className="hover:text-orange-400 transition-colors font-medium" style={{ color: '#ffffff' }}>
                    +91 86248 51910
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#f05a28]" />
                  <a href="mailto:volcanic.digitalsolutions@gmail.com" className="hover:text-orange-400 transition-colors font-medium" style={{ color: '#ffffff' }}>
                    volcanic.digitalsolutions@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#f05a28]" />
                  <span style={{ color: '#d4d4d8' }}>{locality || "Hyderabad, Telangana 500001"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-2 pb-1.5 border-b border-orange-500/30" style={{ color: '#ffffff' }}>
                <span className="h-2 w-2 rounded-full bg-[#f05a28] shadow-[0_0_8px_#f05a28]" />
                <span style={{ color: '#ffffff', fontWeight: 900 }}>Platform Flow</span>
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li><Link href="#how-it-works" className="text-zinc-300 hover:text-orange-400 transition-colors">How It Works (Flow)</Link></li>
                <li><Link href="#categories" className="text-zinc-300 hover:text-orange-400 transition-colors">Specialized Trades</Link></li>
                <li><Link href="#why-trust" className="text-zinc-300 hover:text-orange-400 transition-colors">Why Choose Us</Link></li>
                <li><Link href="#reviews" className="text-zinc-300 hover:text-orange-400 transition-colors">Customer Reviews</Link></li>
                <li><Link href="#faqs" className="text-zinc-300 hover:text-orange-400 transition-colors">FAQs</Link></li>
                <li><Link href="/customer/new-request" className="text-[#f05a28] hover:text-orange-300 transition-colors font-bold">Book AI Diagnostic →</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-2 pb-1.5 border-b border-orange-500/30" style={{ color: '#ffffff' }}>
                <span className="h-2 w-2 rounded-full bg-[#f05a28] shadow-[0_0_8px_#f05a28]" />
                <span style={{ color: '#ffffff', fontWeight: 900 }}>Portals &amp; Overview</span>
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li><Link href="/customer/dashboard" className="text-zinc-300 hover:text-orange-400 transition-colors">Customer Portal</Link></li>
                <li><Link href="/pro/dashboard" className="text-zinc-300 hover:text-orange-400 transition-colors">Provider Portal</Link></li>
                <li><Link href="/admin/dashboard" className="text-zinc-300 hover:text-orange-400 transition-colors">Governance Admin</Link></li>
                <li><Link href="/register?role=professional" className="text-zinc-300 hover:text-orange-400 transition-colors">Join as Provider Partner</Link></li>
                <li><Link href="/case-study" className="text-orange-300 hover:text-orange-200 transition-colors font-bold">Case Study &amp; Architecture</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-2 pb-1.5 border-b border-orange-500/30" style={{ color: '#ffffff' }}>
                <span className="h-2 w-2 rounded-full bg-[#f05a28] shadow-[0_0_8px_#f05a28]" />
                <span style={{ color: '#ffffff', fontWeight: 900 }}>Trust &amp; Governance</span>
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li><Link href="/privacy" className="text-zinc-300 hover:text-orange-400 transition-colors font-medium">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-zinc-300 hover:text-orange-400 transition-colors font-medium">Terms of Service</Link></li>
                <li><Link href="/contact" className="text-zinc-300 hover:text-orange-400 transition-colors">Support &amp; Safety</Link></li>
                <li><span className="text-emerald-400 font-bold flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Escrow Protected (TrustLock™)</span></li>
              </ul>
            </div>
          </div>

          {/* Dedicated Unobstructed VOLCANIC Brand Watermark Banner across Footer */}
          <div className="w-full text-center py-6 border-y border-orange-900/40 overflow-hidden select-none pointer-events-none">
            <p
              className="text-[clamp(2.2rem,8.5vw,6.5rem)] font-black uppercase tracking-[0.22em] leading-none whitespace-nowrap"
              style={{
                color: "rgba(240, 90, 40, 0.28)",
                WebkitTextStroke: "1px rgba(240, 90, 40, 0.45)",
                textShadow: "0 0 45px rgba(240, 90, 40, 0.25)",
                margin: 0,
              }}
            >
              V O L C A N I C
            </p>
          </div>

          {/* Volcanic Branding Bar with Logo */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <Image
                src="/images/volcanic_logo.png"
                alt="Volcanic"
                width={26}
                height={26}
                className="h-6 w-auto object-contain"
              />
              <div className="flex items-center gap-2">
                <span className="font-black text-white tracking-[0.2em] uppercase text-xs" style={{ color: '#ffffff' }}>
                  VOLCANIC
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-300 text-[11px]" style={{ color: '#d4d4d8' }}>Local Solutions. Higher Standards.</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-neutral-400">
              <span style={{ color: '#a1a1aa' }}>© {new Date().getFullYear()} OmniService AI. All rights reserved.</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" /> Fiduciary Escrow Guarantee
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating AI Diagnostic Assistant — Automatically disabled when side drawer is open */}
      <HomeDiagnosticChat disabled={mobileMenuOpen} />
    </div>
  );
}
