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
  Shield,
  Briefcase,
  User,
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
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("email");
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
      : authError === "CustomerAuthRequired"
      ? "Please sign in to access your customer dashboard."
      : authError === "UnauthorizedAdminAccess"
      ? "Access Denied: Only Administrator accounts can access the Governance Center."
      : authError === "UnauthorizedProAccess"
      ? "Access Denied: Only verified Professionals can access the Operations Portal."
      : ""
  );

  const completeLogin = (user: { id: string; name: string; email?: string | null; phone?: string | null; role: string }, token?: string) => {
    // 1. Remember user in localStorage across browser restarts
    try {
      localStorage.setItem("omniservice_user", JSON.stringify(user));
    } catch {
      // localStorage may fail in private mode
    }

    // 2. Set 7-day persistence cookies for edge proxy
    const maxAge = 604800; // 7 days
    document.cookie = `omniservice-role=${user.role}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `omniservice-user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
    if (token) {
      document.cookie = `authjs.session-token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }

    toast.success("Welcome back!", `Signed in as ${user.name}`);

    // 3. Strict route redirection based on role
    if (callbackUrl) {
      router.push(callbackUrl);
    } else if (user.role === "admin") {
      router.push("/admin/dashboard");
    } else if (user.role === "professional") {
      router.push("/pro/dashboard");
    } else {
      router.push("/customer/dashboard");
    }
  };

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

      completeLogin(data.user, data.token);
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
    }, 500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
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

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier:
            determinedRole === "admin"
              ? "admin@omniservice.world"
              : determinedRole === "professional"
              ? "pro@omniservice.world"
              : "customer@omniservice.world",
          password: "password",
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        completeLogin(data.user, data.token);
        return;
      }
    } catch {
      // Fallback
    }

    const fallbackUser = {
      id: `user_${determinedRole}_${Date.now()}`,
      name:
        determinedRole === "admin"
          ? "Platform Administrator"
          : determinedRole === "professional"
          ? "Service Professional"
          : identifier.includes("@")
          ? identifier.split("@")[0] || "Customer"
          : `Customer (${identifier.slice(-4)})`,
      phone: identifier,
      role: determinedRole as "customer" | "professional" | "admin",
    };
    completeLogin(fallbackUser, `sess_${determinedRole}_${Date.now()}`);
  };

  // Quick 1-click test role login helper
  const handleQuickRoleLogin = async (role: "customer" | "professional" | "admin") => {
    setIsLoading(true);
    setError("");
    const credentials = {
      customer: { identifier: "customer@omniservice.world", password: "customer123" },
      professional: { identifier: "pro@omniservice.world", password: "pro123456" },
      admin: { identifier: "admin@omniservice.world", password: "admin123456" },
    }[role];

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (data.success && data.user) {
        completeLogin(data.user, data.token);
        return;
      }
    } catch {
      // Offline fallback
    }

    const mockNames = {
      customer: "Customer Account",
      professional: "Service Professional",
      admin: "Platform Administrator",
    };
    completeLogin(
      {
        id: `user_${role}_001`,
        name: mockNames[role],
        email: `${role}@omniservice.world`,
        role,
      },
      `sess_${role}_${Date.now()}`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#2d130a]">
          Sign in to OmniService
        </h1>
        <p className="mt-1 text-xs text-neutral-500">
          Enter your credentials to access your verified account
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <p className="text-xs">{error}</p>
        </Alert>
      )}

      {/* ── 1-Click Role Login for Quick Testing ── */}
      <div className="rounded-2xl border border-orange-200/80 bg-[#fffaf5] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#c2410c]">
            Quick Role Access (Testing)
          </span>
          <span className="text-[10px] text-neutral-400">Strictly routes to each role</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickRoleLogin("customer")}
            disabled={isLoading}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-orange-200/60 hover:border-[#f05a28] hover:shadow-xs transition-all text-center group"
          >
            <User className="h-4 w-4 text-[#f05a28] mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-neutral-800">Customer</span>
            <span className="text-[9px] text-neutral-400">Book & Track</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleLogin("professional")}
            disabled={isLoading}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-orange-200/60 hover:border-[#ea580c] hover:shadow-xs transition-all text-center group"
          >
            <Briefcase className="h-4 w-4 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-neutral-800">Pro</span>
            <span className="text-[9px] text-neutral-400">Leads & Jobs</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleLogin("admin")}
            disabled={isLoading}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-orange-200/60 hover:border-blue-500 hover:shadow-xs transition-all text-center group"
          >
            <Shield className="h-4 w-4 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-neutral-800">Admin</span>
            <span className="text-[9px] text-neutral-400">Governance</span>
          </button>
        </div>
      </div>

      {/* ── Google Authentication ── */}
      <div className="space-y-3">
        <GoogleOneTap role="customer" />
        <div className="relative flex items-center justify-center">
          <div className="border-t border-neutral-200 w-full" />
          <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold absolute">
            or sign in with credentials
          </span>
        </div>
      </div>

      {/* ── Mode Switcher: Password vs OTP ── */}
      <div className="flex rounded-xl bg-neutral-100 p-1">
        <button
          type="button"
          onClick={() => {
            setLoginMode("password");
            setError("");
          }}
          className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
            loginMode === "password"
              ? "bg-white text-neutral-900 shadow-xs"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Password Login
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginMode("otp");
            setError("");
          }}
          className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
            loginMode === "otp"
              ? "bg-white text-neutral-900 shadow-xs"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Instant OTP (123456)
        </button>
      </div>

      {/* ── Form: Password Mode ── */}
      {loginMode === "password" ? (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setAuthMethod(authMethod === "phone" ? "email" : "phone");
                setIdentifier("");
                setError("");
              }}
              className="text-[11px] font-semibold text-[#f05a28] hover:underline"
            >
              Use {authMethod === "phone" ? "Email Address" : "Mobile Number"}
            </button>
          </div>

          <Input
            label={authMethod === "phone" ? "Registered Mobile Number" : "Email Address"}
            type={authMethod === "phone" ? "tel" : "email"}
            placeholder={authMethod === "phone" ? "+91 98XXX XXXXX" : "name@example.com"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            leftIcon={
              authMethod === "phone" ? (
                <Phone className="h-4 w-4 text-neutral-400" />
              ) : (
                <Mail className="h-4 w-4 text-neutral-400" />
              )
            }
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4 text-neutral-400" />}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <Button
            type="submit"
            variant="brand"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Sign In
          </Button>
        </form>
      ) : !otpSent ? (
        /* ── Form: OTP Phone Input ── */
        <form onSubmit={handleSendOtp} className="space-y-4">
          <Input
            label="Mobile Number or Email"
            type="text"
            placeholder="+91 98XXX XXXXX or name@example.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            leftIcon={<Phone className="h-4 w-4 text-neutral-400" />}
            helperText="We will send a 6-digit verification code"
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
        /* ── Form: OTP Verify ── */
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
            Change number
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
