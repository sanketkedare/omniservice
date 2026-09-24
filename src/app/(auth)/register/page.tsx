"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Briefcase,
  ArrowRight,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  Phone,
  Mail,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { GoogleOneTap } from "@/components/auth/GoogleOneTap";
import { useGeolocation } from "@/lib/geolocation";
import { toast } from "@/components/ui/Toast";

const TRADE_CATEGORIES = [
  "Air Conditioning & HVAC",
  "Electrical Systems & MCBs",
  "Advanced Plumbing & Drainage",
  "Kitchen & Home Appliances",
  "Water Purifiers & RO Systems",
  "Painting & Waterproofing",
  "Solar & Inverter Power Systems",
  "Masonry, Tile & Flooring",
  "Deep Cleaning & Pest Control",
  "CCTV, Security & Smart Home",
  "Carpentry, Furniture & Woodwork",
  "General Handyman & Property Repair",
  "Other (Specify Specialty)",
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isGoogleRedirect = searchParams.get("google") === "1";
  const urlEmail = searchParams.get("email") || "";
  const urlName = searchParams.get("name") || "";
  const urlAvatar = searchParams.get("avatar") || "";
  const urlGoogleId = searchParams.get("googleId") || "";
  const urlRole = searchParams.get("role");

  const { coordinates, locality, isLoading: isLocating, detectLocation, permissionDenied } = useGeolocation();

  const [role, setRole] = useState<"customer" | "professional">(
    urlRole === "professional" ? "professional" : "customer"
  );
  const [name, setName] = useState(urlName);
  const [email, setEmail] = useState(urlEmail);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [trade, setTrade] = useState("Air Conditioning & HVAC");
  const [customTrade, setCustomTrade] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [gpsCaptured, setGpsCaptured] = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(isGoogleRedirect);
  const [googleId, setGoogleId] = useState(urlGoogleId);
  const [googleAvatar, setGoogleAvatar] = useState(urlAvatar);

  // ── Block Logged-In Users from Accessing Register Page ──────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem("omniservice_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.role) {
          const target =
            parsed.role === "admin"
              ? "/admin/dashboard"
              : parsed.role === "professional"
              ? "/pro/dashboard"
              : "/customer/dashboard";
          router.replace(target);
          return;
        }
      }
    } catch {}

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.authenticated && data.user?.role) {
          const target =
            data.user.role === "admin"
              ? "/admin/dashboard"
              : data.user.role === "professional"
              ? "/pro/dashboard"
              : "/customer/dashboard";
          router.replace(target);
        }
      })
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    if (urlEmail) {
      setEmail(urlEmail);
      setIsGoogleAccount(true);
    }
    if (urlName) {
      setName(urlName);
    }
    if (urlGoogleId) {
      setGoogleId(urlGoogleId);
    }
    if (urlAvatar) {
      setGoogleAvatar(urlAvatar);
    }
  }, [urlEmail, urlName, urlGoogleId, urlAvatar]);

  const handleCaptureLocation = async () => {
    const coords = await detectLocation();
    if (coords) {
      setGpsCaptured(true);
      toast.success(
        "Location Detected",
        `${locality || "Hyderabad, Telangana"}`
      );
    } else {
      toast.warning("Hyderabad Default", "Using Hyderabad, Telangana as default location");
    }
  };

  const handleGoogleData = (data: {
    email: string;
    name: string;
    avatarUrl?: string | null;
    googleId?: string | null;
  }) => {
    setEmail(data.email);
    setName(data.name);
    if (data.avatarUrl) setGoogleAvatar(data.avatarUrl);
    if (data.googleId) setGoogleId(data.googleId);
    setIsGoogleAccount(true);
    toast.success("Google Linked", `Verified as ${data.email}. Select role to complete.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      toast.error("Required Field", "Please enter your name");
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setError("Please provide an email address or mobile number");
      toast.error("Contact Required", "Please provide email or phone");
      return;
    }

    if (!isGoogleAccount) {
      if (!password || password.length < 6) {
        setError("Password must be at least 6 characters");
        toast.error("Password Too Short", "Password must be at least 6 characters");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        toast.error("Mismatch", "Passwords do not match");
        return;
      }
    }

    const effectiveTrade =
      role === "professional"
        ? trade === "Other (Specify Specialty)"
          ? customTrade.trim() || "Specialized Handyman & Repair"
          : trade
        : undefined;

    try {
      setError("");
      setIsLoading(true);
      const loadId = toast.loading("Creating account...", "Registering your profile");

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          password: isGoogleAccount ? password || undefined : password,
          authProvider: isGoogleAccount ? "google" : "credentials",
          googleId: isGoogleAccount ? googleId || undefined : undefined,
          avatarUrl: isGoogleAccount ? googleAvatar || undefined : undefined,
          role,
          trade: effectiveTrade,
          coordinates: coordinates || undefined,
        }),
      });

      const data = await res.json();
      toast.dismiss(loadId);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create account");
      }

      try {
        localStorage.setItem("omniservice_user", JSON.stringify(data.user));
      } catch {}

      const maxAge = 604800;
      document.cookie = `omniservice-role=${data.user.role}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `omniservice-user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
      if (data.token) {
        document.cookie = `authjs.session-token=${data.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      }

      toast.success("Account Created", `Welcome, ${data.user.name}!`);

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (data.user.role === "professional") {
        router.push("/pro/dashboard");
      } else {
        router.push("/customer/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      toast.error("Registration Error", err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-orange-200/90 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/40 space-y-5">
      {/* OmniService Brand Logo at Top of Form */}
      <div className="flex flex-col items-center justify-center">
        <Link href="/" className="inline-block hover:opacity-95 transition-opacity" aria-label="OmniService Home">
          <Image
            src="/images/OmniService_Logo.png"
            alt="OmniService AI"
            width={180}
            height={44}
            className="h-9 sm:h-10 w-auto object-contain mx-auto"
            priority
          />
        </Link>
      </div>

      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2d130a]">
          Create Account
        </h1>
        <p className="text-xs text-neutral-500">
          Sign up as a customer or service provider
        </p>
      </div>

      {error && (
        <Alert variant="destructive" title="Notice">
          {error}
        </Alert>
      )}

      {/* ── Role Selector ── */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => setRole("customer")}
          className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
            role === "customer"
              ? "border-[#f05a28] bg-orange-50/60 shadow-xs"
              : "border-neutral-200 bg-white hover:bg-neutral-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <User className={`h-4 w-4 ${role === "customer" ? "text-[#f05a28]" : "text-neutral-500"}`} />
            <span className="text-xs font-bold text-[#2d130a]">Customer</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Book home services</p>
        </button>

        <button
          type="button"
          onClick={() => setRole("professional")}
          className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
            role === "professional"
              ? "border-[#f05a28] bg-orange-50/60 shadow-xs"
              : "border-neutral-200 bg-white hover:bg-neutral-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <Briefcase className={`h-4 w-4 ${role === "professional" ? "text-[#f05a28]" : "text-neutral-500"}`} />
            <span className="text-xs font-bold text-[#2d130a]">Provider</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Offer trade services</p>
        </button>
      </div>

      {/* ── Google One-Tap ── */}
      {!isGoogleAccount && (
        <>
          <GoogleOneTap
            role={role}
            mode="register"
            trade={role === "professional" ? trade : undefined}
            phone={phone}
            coordinates={coordinates || undefined}
            onGoogleDataExtracted={handleGoogleData}
          />

          <div className="relative my-2 flex items-center justify-center">
            <div className="w-full border-t border-neutral-200" />
            <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Or register credentials
            </span>
          </div>
        </>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full Name"
          placeholder="Rajesh Kumar"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User className="h-4 w-4 text-[#f05a28]" />}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Mobile Number"
            placeholder="+91 98XXX XXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="h-4 w-4 text-[#f05a28]" />}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            disabled={isGoogleAccount}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4 text-[#f05a28]" />}
            required={!isGoogleAccount}
          />
        </div>

        {/* Trade Specialization (If Provider) */}
        {role === "professional" && (
          <div className="space-y-2 p-3 rounded-2xl bg-orange-50/70 border border-orange-200/80">
            <label className="text-xs font-bold text-[#2d130a] flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5 text-[#f05a28]" />
              Trade Specialization
            </label>
            <select
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 focus:border-[#f05a28] focus:outline-hidden cursor-pointer"
            >
              {TRADE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Custom Trade Input when "Other" is chosen */}
            {trade === "Other (Specify Specialty)" && (
              <div className="pt-1">
                <Input
                  label="Specify Your Specialty / Trade"
                  placeholder="e.g. Glass & Aluminum, False Ceiling, Solar..."
                  value={customTrade}
                  onChange={(e) => setCustomTrade(e.target.value)}
                  leftIcon={<Wrench className="h-4 w-4 text-[#f05a28]" />}
                  required
                />
              </div>
            )}
          </div>
        )}

        {/* GPS Geolocation Pill */}
        <div className="rounded-xl border border-orange-200/80 bg-orange-50/50 p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#f05a28]" />
            <span className="text-neutral-700 font-semibold truncate max-w-[200px]">
              {locality || "Hyderabad, Telangana"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCaptureLocation}
            disabled={isLocating}
            className="font-bold text-[#f05a28] hover:underline cursor-pointer"
          >
            {isLocating ? "Locating..." : gpsCaptured ? "Updated" : "Detect GPS"}
          </button>
        </div>

        {/* Password Inputs */}
        {!isGoogleAccount && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4 text-[#f05a28]" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8.5 text-neutral-400 hover:text-neutral-600 focus:outline-hidden cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4 text-[#f05a28]" />}
              required
            />
          </div>
        )}

        <Button
          type="submit"
          variant="brand"
          fullWidth
          isLoading={isLoading}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          {role === "professional" ? "Register as Provider" : "Create Customer Account"}
        </Button>
      </form>

      {/* ── Footer Link ── */}
      <div className="text-center text-xs text-neutral-500 pt-3 border-t border-neutral-100">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#f05a28] hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
