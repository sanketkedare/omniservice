"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { validatePasswordRequirements } from "@/lib/password-validator";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const passValidation = validatePasswordRequirements(newPassword);

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      const msg = "Please enter a valid email address.";
      setError(msg);
      toast.error("Valid Email Required", msg);
      return;
    }

    setIsLoading(true);
    setError("");
    const loadId = toast.loading("Sending Verification Code...", "Dispatched via secure email");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_otp", email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      toast.dismiss(loadId);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send reset code.");
      }

      toast.success("Code Dispatched", `A 6-digit verification code was sent to ${email.trim()}`);
      setStep("reset");
    } catch (err: any) {
      toast.dismiss(loadId);
      const msg = err.message || "Could not dispatch verification email. Please try again.";
      setError(msg);
      toast.error("Dispatch Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Verify & Reset Password ─────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      const msg = "Please enter the 6-digit verification code sent to your email.";
      setError(msg);
      toast.error("Verification Code Required", msg);
      return;
    }

    if (!passValidation.isValid) {
      const msg = passValidation.error || "Please satisfy all password security requirements.";
      setError(msg);
      toast.error("Incomplete Password", msg);
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = "Passwords do not match. Please re-enter your password confirmation.";
      setError(msg);
      toast.error("Passwords Mismatch", msg);
      return;
    }

    setIsLoading(true);
    const loadId = toast.loading("Updating Password...", "Verifying OTP and hashing security credentials");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_password",
          email: email.trim().toLowerCase(),
          otpCode: otpCode.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      toast.dismiss(loadId);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password.");
      }

      setSuccessMessage("Your password has been securely updated! Redirecting to login...");
      toast.success("Password Updated", "You can now log in with your new password.");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      toast.dismiss(loadId);
      const msg = err.message || "Failed to update password. Please check your OTP code.";
      setError(msg);
      toast.error("Reset Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#f05a28] shadow-xs">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2d130a]">
          {step === "email" ? "Reset Your Password" : "Set New Password"}
        </h1>
        <p className="text-xs text-neutral-600 max-w-sm mx-auto">
          {step === "email"
            ? "Enter your verified account email to receive a 6-digit one-time password code."
            : `Enter the verification code sent to ${email} and choose a strong password.`}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ── STEP 1: Enter Email ── */}
      {step === "email" && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <Input
            label="Registered Email Address"
            type="email"
            placeholder="volcanic.digitalsolutions@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4 text-neutral-400" />}
            required
            autoFocus
          />

          <Button
            type="submit"
            variant="brand"
            fullWidth
            disabled={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            {isLoading ? "Sending Code..." : "Send Verification Code"}
          </Button>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#f05a28] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}

      {/* ── STEP 2: Enter OTP & New Password ── */}
      {step === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-700">6-Digit Verification Code</label>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading}
                className="text-[11px] text-[#f05a28] hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="h-3 w-3" /> Resend Code
              </button>
            </div>
            <Input
              type="text"
              maxLength={6}
              placeholder="e.g. 583921"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              className="text-center font-mono text-base tracking-widest"
              required
              autoFocus
            />
          </div>

          <div>
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4 text-neutral-400" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Strict Live Requirements Checklist */}
            <div className="mt-2 p-3 rounded-xl bg-orange-50/60 border border-orange-200/70 space-y-1.5 text-[11px]">
              <span className="font-bold text-[#c2410c] block">Required Password Format:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-neutral-600">
                <span className={`flex items-center gap-1.5 ${passValidation.hasMin3Letters ? "text-emerald-700 font-bold" : ""}`}>
                  <CheckCircle2 className={`h-3.5 w-3.5 ${passValidation.hasMin3Letters ? "text-emerald-600" : "text-neutral-300"}`} />
                  Min 3 Alphabets ({passValidation.lettersCount}/3)
                </span>
                <span className={`flex items-center gap-1.5 ${passValidation.hasMin2Numbers ? "text-emerald-700 font-bold" : ""}`}>
                  <CheckCircle2 className={`h-3.5 w-3.5 ${passValidation.hasMin2Numbers ? "text-emerald-600" : "text-neutral-300"}`} />
                  Min 2 Numbers ({passValidation.numbersCount}/2)
                </span>
                <span className={`flex items-center gap-1.5 ${passValidation.hasMin1Symbol ? "text-emerald-700 font-bold" : ""}`}>
                  <CheckCircle2 className={`h-3.5 w-3.5 ${passValidation.hasMin1Symbol ? "text-emerald-600" : "text-neutral-300"}`} />
                  Min 1 Symbol e.g. !@#$ ({passValidation.symbolsCount}/1)
                </span>
                <span className={`flex items-center gap-1.5 ${passValidation.hasMinLength ? "text-emerald-700 font-bold" : ""}`}>
                  <CheckCircle2 className={`h-3.5 w-3.5 ${passValidation.hasMinLength ? "text-emerald-600" : "text-neutral-300"}`} />
                  Min 6 characters ({newPassword.length}/6)
                </span>
              </div>
            </div>
          </div>

          <Input
            label="Confirm New Password"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter password to confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4 text-neutral-400" />}
            required
          />

          <Button
            type="submit"
            variant="brand"
            fullWidth
            disabled={isLoading || !passValidation.isValid || newPassword !== confirmPassword}
            rightIcon={<ShieldCheck className="h-4 w-4" />}
          >
            {isLoading ? "Verifying & Updating..." : "Update Password"}
          </Button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#f05a28]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Change Email Address</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
