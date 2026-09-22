"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { GoogleOneTap } from "@/components/auth/GoogleOneTap";
import { toast } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const authError = searchParams.get("error");

  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(
    authError === "AdminAuthRequired"
      ? "Administrator credentials required to enter Governance Center."
      : authError === "ProAuthRequired"
      ? "Professional account required to enter Service Portal."
      : ""
  );

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      const msg = `Please enter your ${authMethod === "phone" ? "mobile number" : "email address"}`;
      setError(msg);
      toast.error("Required Field", msg);
      return;
    }
    if (!password) {
      const msg = "Please enter your password";
      setError(msg);
      toast.error("Password Required", msg);
      return;
    }

    setIsLoading(true);
    setError("");
    const loadId = toast.loading("Authenticating credentials...", "Securely verifying credentials");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      toast.dismiss(loadId);

      if (!res.ok || !data.success) {
        const errorMsg = data.error || "Invalid credentials. Please verify your details.";
        setError(errorMsg);
        toast.error("Authentication Failed", errorMsg);
        setIsLoading(false);
        return;
      }

      toast.success("Welcome back!", `Signed in as ${data.user.name}`);
      document.cookie = `omniservice-role=${data.user.role}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `authjs.session-token=${data.token || "session_" + Date.now()}; path=/; max-age=86400; SameSite=Lax`;

      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (data.user.role === "professional") {
        router.push("/pro/dashboard");
      } else {
        router.push("/customer/dashboard");
      }
    } catch {
      toast.dismiss(loadId);
      const netMsg = "Unable to connect to authentication server. Please check your network.";
      setError(netMsg);
      toast.error("Connection Error", netMsg);
      setIsLoading(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      const msg = `Please enter your ${authMethod === "phone" ? "mobile number" : "email address"}`;
      setError(msg);
      toast.error("Required Field", msg);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setError("");
      toast.info("Verification Code Sent", `A demo OTP (123456) has been dispatched to ${identifier}`);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "123456" && otp.length !== 6) {
      const msg = "Invalid OTP code. Enter 123456 for immediate verification.";
      setError(msg);
      toast.error("Invalid Code", msg);
      return;
    }

    setIsLoading(true);
    const determinedRole = identifier.includes("admin")
      ? "admin"
      : identifier.includes("pro")
      ? "professional"
      : "customer";

    document.cookie = `omniservice-role=${determinedRole}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `authjs.session-token=sess_${Date.now()}; path=/; max-age=86400; SameSite=Lax`;

    toast.success("Phone Verified", "Logging into your dashboard...");

    setTimeout(() => {
      setIsLoading(false);
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (determinedRole === "admin") {
        router.push("/admin/dashboard");
      } else if (determinedRole === "professional") {
        router.push("/pro/dashboard");
      } else {
        router.push("/customer/dashboard");
      }
    }, 400);
  };

  return (
    <div
      className="rounded-3xl border-2 border-orange-200/80 bg-white p-6 sm:p-10 shadow-xl shadow-orange-950/5 space-y-6 font-serif"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2d130a]">
          {otpSent ? "Enter Verification Code" : "Sign In to OmniService AI"}
        </h1>
        <p className="mt-1 text-xs text-neutral-600">
          {otpSent
            ? `Enter the 6-digit code sent to ${identifier}`
            : "Access your HomePass passport, active diagnostics, and bookings in Ameerpet, Hyderabad."}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <p className="text-xs">{error}</p>
        </Alert>
      )}

      {/* Google One-Tap Integration */}
      <GoogleOneTap />

      <div className="relative my-3 flex items-center justify-center">
        <div className="w-full border-t border-neutral-200" />
        <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Or with credentials
        </span>
      </div>

      {/* Mode Switcher: Password vs OTP */}
      <div className="flex items-center justify-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => {
            setLoginMode("password");
            setOtpSent(false);
            setError("");
          }}
          className={`pb-1 font-semibold transition-all border-b-2 ${
            loginMode === "password"
              ? "border-[#f05a28] text-[#2d130a]"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          Password Login
        </button>
        <span className="text-neutral-300">•</span>
        <button
          type="button"
          onClick={() => {
            setLoginMode("otp");
            setError("");
          }}
          className={`pb-1 font-semibold transition-all border-b-2 ${
            loginMode === "otp"
              ? "border-[#f05a28] text-[#2d130a]"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          Instant OTP Login
        </button>
      </div>

      {loginMode === "password" ? (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          {/* Method tabs */}
          <div className="grid grid-cols-2 rounded-xl bg-orange-50/60 p-1 border border-orange-100">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("phone");
                setIdentifier("");
                setError("");
              }}
              className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                authMethod === "phone"
                  ? "bg-white text-[#c2410c] shadow-xs border border-orange-200/60"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Mobile Number
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("email");
                setIdentifier("");
                setError("");
              }}
              className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                authMethod === "email"
                  ? "bg-white text-[#c2410c] shadow-xs border border-orange-200/60"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Email Address
            </button>
          </div>

          {authMethod === "phone" ? (
            <Input
              label="Mobile Number"
              placeholder="+91 98XXX XXXXX"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              leftIcon={<Phone className="h-4 w-4 text-[#f05a28]" />}
              helperText="Enter 10-digit mobile number"
            />
          ) : (
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              leftIcon={<Mail className="h-4 w-4 text-[#f05a28]" />}
              helperText="We will never share your email address"
            />
          )}

          <div className="space-y-1">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4 text-[#f05a28]" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="brand"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Sign In Securely
          </Button>
        </form>
      ) : !otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <Input
            label={authMethod === "phone" ? "Mobile Number" : "Email Address"}
            placeholder={authMethod === "phone" ? "+91 98XXX XXXXX" : "name@example.com"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            leftIcon={authMethod === "phone" ? <Phone className="h-4 w-4 text-[#f05a28]" /> : <Mail className="h-4 w-4 text-[#f05a28]" />}
          />

          <Button
            type="submit"
            variant="brand"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Get OTP Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <Input
            label="Verification Code (OTP)"
            placeholder="123456"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            helperText="Enter 123456 for immediate demo verification"
          />

          <Button
            type="submit"
            variant="brand"
            fullWidth
            isLoading={isLoading}
            rightIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            Confirm &amp; Enter
          </Button>

          <button
            type="button"
            onClick={() => setOtpSent(false)}
            className="w-full text-center text-xs font-semibold text-neutral-500 hover:text-neutral-900"
          >
            Change {authMethod === "phone" ? "number" : "email"}
          </button>
        </form>
      )}

      {/* ── See Demo Navigation (Isolated Dummy Sandbox) ── */}
      <div className="pt-2 border-t border-neutral-100">
        <Link
          href="/demo"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#f05a28]/40 bg-orange-50/40 px-4 py-3 text-xs font-bold text-[#f05a28] transition-all hover:bg-[#f05a28]/10 hover:border-[#f05a28]"
        >
          <Eye className="h-4 w-4" />
          <span>See Demo (Explore All Dashboards with Dummy Data)</span>
        </Link>
        <p className="mt-1.5 text-center text-[11px] text-neutral-400">
          Preview customer, pro &amp; admin governance without real authentication
        </p>
      </div>

      <div className="text-center text-xs text-neutral-500 pt-1">
        New to OmniService AI?{" "}
        <Link href="/register" className="font-bold text-[#f05a28] hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}
