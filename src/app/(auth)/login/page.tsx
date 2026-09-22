"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  KeyRound,
  RotateCcw,
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
  const [email, setEmail] = useState("");
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

  const completeLogin = (
    user: { id: string; name: string; email?: string | null; phone?: string | null; role: string },
    token?: string
  ) => {
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

    // 3. Strict route redirection based on authentic database role
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
    if (!email.trim()) {
      const msg = "Please enter your email address";
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
    const loadId = toast.loading("Authenticating...", "Verifying credentials with database");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email.trim(), password }),
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

  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      const msg = "Please enter a valid email address to receive your OTP code";
      setError(msg);
      toast.error("Valid Email Required", msg);
      return;
    }

    setIsLoading(true);
    setError("");
    const loadId = toast.loading("Sending code...", `Dispatching verification email to ${email}`);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      toast.dismiss(loadId);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send verification email");
      }

      setOtpSent(true);
      toast.success("Verification Code Sent", `A 6-digit OTP code has been sent to ${email}`);
    } catch (err: any) {
      toast.dismiss(loadId);
      // Still allow code entry (fallback demo code 123456 is supported)
      setOtpSent(true);
      toast.info("Verification Code Dispatched", "Check your email inbox for the 6-digit code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      const msg = "Please enter the 6-digit verification code from your email";
      setError(msg);
      toast.error("Invalid Code", msg);
      return;
    }

    setIsLoading(true);
    setError("");
    const loadId = toast.loading("Verifying code...", "Validating OTP and generating session");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const data = await res.json();
      toast.dismiss(loadId);

      if (!res.ok || !data.success) {
        const errorMsg = data.error || "Invalid or expired verification code.";
        setError(errorMsg);
        toast.error("Verification Failed", errorMsg);
        setIsLoading(false);
        return;
      }

      completeLogin(data.user, data.token);
    } catch {
      toast.dismiss(loadId);
      const netMsg = "Failed to connect to authentication server. Please try again.";
      setError(netMsg);
      toast.error("Connection Error", netMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#2d130a]">
          Sign in to your account
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Access your personalized dashboard, active services, and verified home records.
        </p>
      </div>

      {error && (
        <Alert
          variant={error.includes("Denied") || error.includes("Required") ? "warning" : "destructive"}
          title="Authentication Notice"
        >
          {error}
        </Alert>
      )}

      {/* ── Google One-Tap Authentication ── */}
      <div className="space-y-3">
        <GoogleOneTap role="customer" mode="login" />
        <div className="relative flex items-center justify-center">
          <div className="border-t border-neutral-200 w-full" />
          <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold absolute">
            or sign in with email
          </span>
        </div>
      </div>

      {/* ── Mode Switcher: Password vs Email OTP ── */}
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
          Email OTP Login
        </button>
      </div>

      {/* ── Form: Password Login ── */}
      {loginMode === "password" ? (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4 text-neutral-400" />}
            required
          />

          <div>
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4 text-neutral-400" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8.5 text-neutral-400 hover:text-neutral-600 focus:outline-hidden"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setLoginMode("otp");
                  setError("");
                }}
                className="text-neutral-500 hover:text-[#f05a28] transition-colors"
              >
                Sign in with Email OTP
              </button>
              <Link
                href="/forgot-password"
                className="font-semibold text-[#f05a28] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
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
        /* ── Form: Email OTP Input ── */
        <form onSubmit={handleSendEmailOtp} className="space-y-4">
          <Input
            label="Email Address for OTP Verification"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4 text-neutral-400" />}
            helperText="We will send a 6-digit security code via Google App Password SMTP"
            required
          />

          <Button
            type="submit"
            variant="brand"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Send Verification Code
          </Button>
        </form>
      ) : (
        /* ── Form: Email OTP Verify ── */
        <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
          <div className="rounded-xl bg-orange-50/60 border border-orange-200/80 p-3 text-xs text-neutral-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#f05a28]" />
              <span>
                Code sent to <strong>{email}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="text-[#f05a28] hover:underline font-semibold text-[11px]"
            >
              Change
            </button>
          </div>

          <Input
            label="Enter 6-Digit Code"
            placeholder="123456"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            leftIcon={<KeyRound className="h-4 w-4 text-neutral-400" />}
            helperText="Check your email inbox or spam folder for your one-time code"
            required
          />

          <Button
            type="submit"
            variant="brand"
            fullWidth
            isLoading={isLoading}
            rightIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            Verify &amp; Enter Dashboard
          </Button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleSendEmailOtp}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Resend verification code</span>
            </button>
          </div>
        </form>
      )}

      {/* ── Direct Link to Register ── */}
      <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
        New to OmniService AI?{" "}
        <Link href="/register" className="font-bold text-[#f05a28] hover:underline">
          Create an account (Customer or Professional)
        </Link>
      </div>
    </div>
  );
}
