"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  Briefcase,
  MapPin,
  LogOut,
  Save,
  Check,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { toast } from "@/components/ui/Toast";

export default function ProfessionalProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    id: "",
    name: "Verified Provider",
    email: "",
    phone: "",
    trade: "Air Conditioning & HVAC",
    role: "professional",
    hasPassword: true,
  });

  // Password Management State
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordOtp, setPasswordOtp] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("omniservice_user");
      if (stored) {
        const u = JSON.parse(stored);
        setUserData((prev) => ({
          ...prev,
          id: u.id || "",
          name: u.name || "Verified Provider",
          email: u.email || "",
          phone: u.phone || "",
          trade: u.trade || prev.trade,
          hasPassword: u.hasPassword ?? true,
        }));
      }
    } catch {}

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user) {
          const u = data.user;
          setUserData({
            id: u.id || "",
            name: u.name || "Verified Provider",
            email: u.email || "",
            phone: u.phone || "",
            trade: u.trade || "Air Conditioning & HVAC",
            role: "professional",
            hasPassword: Boolean(u.hasPassword),
          });
          try {
            localStorage.setItem("omniservice_user", JSON.stringify(u));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    try {
      localStorage.removeItem("omniservice_user");
    } catch {}
    router.push("/login");
  };

  const handleSendPasswordOtp = async () => {
    if (!userData.email) return;
    setIsSendingOtp(true);
    setPasswordFeedback(null);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_otp", email: userData.email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch verification code.");
      }
      setOtpSent(true);
      setPasswordFeedback({
        type: "success",
        message: `Verification code sent to ${userData.email}. Enter it below with your new password.`,
      });
      toast.success("OTP Sent", `Verification code sent to ${userData.email}`);
    } catch (err: any) {
      setPasswordFeedback({ type: "error", message: err.message || "Failed to send code." });
      toast.error("Dispatch Failed", err.message || "Failed to send code.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    const letters = (newPassword.match(/[a-zA-Z]/g) || []).length;
    const numbers = (newPassword.match(/[0-9]/g) || []).length;
    const symbols = (newPassword.match(/[^a-zA-Z0-9\s]/g) || []).length;

    if (letters < 3) {
      setPasswordFeedback({ type: "error", message: "Password must have at least 3 alphabets (letters)." });
      return;
    }
    if (numbers < 2) {
      setPasswordFeedback({ type: "error", message: "Password must have at least 2 numbers (digits)." });
      return;
    }
    if (symbols < 1) {
      setPasswordFeedback({ type: "error", message: "Password must have at least 1 symbol e.g. !@#$." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: "error", message: "Passwords do not match." });
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: userData.hasPassword ? "change" : "create_initial",
          email: userData.email,
          currentPassword: currentPassword || undefined,
          otpCode: passwordOtp || undefined,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password.");
      }

      setPasswordFeedback({ type: "success", message: data.message || "Password updated successfully!" });
      toast.success("Security Updated", "Your account password has been updated.");
      setUserData((prev) => ({ ...prev, hasPassword: true }));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordOtp("");
      setOtpSent(false);
      setTimeout(() => setShowPasswordSection(false), 2500);
    } catch (err: any) {
      setPasswordFeedback({ type: "error", message: err.message || "Update failed." });
      toast.error("Password Error", err.message || "Update failed.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-6 sm:py-8 space-y-8 text-neutral-900 font-serif">
      <PageHeader
        title="Provider Profile & Security"
        description="Manage your verified professional credentials, service trade, and password security."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Provider Dashboard", href: "/pro/dashboard" },
          { label: "Profile" },
        ]}
      />

      {/* Warning banner if provider registered without password */}
      {!userData.hasPassword && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3">
            <KeyRound className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-950">Password Setup Recommended</p>
              <p className="text-xs text-amber-800 mt-0.5">
                You currently sign in via Google or Email OTP. Create a direct password below for instant access across all technician devices.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="brand"
            onClick={() => setShowPasswordSection(true)}
            className="shrink-0"
          >
            Create Password Now
          </Button>
        </div>
      )}

      {/* Provider Details Card */}
      <Card className="border-2 border-orange-100 shadow-xs">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar name={userData.name} size="lg" status="online" />
            <div>
              <h2 className="text-lg font-bold text-[#2d130a]">{userData.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="brand" size="sm">
                  {userData.trade}
                </Badge>
                <span className="text-xs text-neutral-500">• Greater Hyderabad Service Hub</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-orange-100 text-xs">
            <div>
              <span className="text-neutral-500 block">Contact Email</span>
              <span className="font-semibold text-neutral-900">{userData.email || "volcanic.digitalsolutions@gmail.com"}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Mobile Dispatch Line</span>
              <span className="font-semibold text-neutral-900">{userData.phone || "+91 98200 54321"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Password Card */}
      <Card className="border-2 border-orange-100 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#f05a28]" />
            <CardTitle className="text-base text-[#2d130a]">Security &amp; Account Password</CardTitle>
          </div>
          <Button
            size="sm"
            variant={showPasswordSection ? "outline" : "brand"}
            onClick={() => setShowPasswordSection(!showPasswordSection)}
          >
            {showPasswordSection ? "Close" : userData.hasPassword ? "Change Password" : "Create Password"}
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <p className="text-xs text-neutral-600">
            Password requirement: <strong>Min 3 letters</strong>, <strong>Min 2 numbers</strong>, and <strong>Min 1 symbol</strong>. Verified via Email OTP sent to {userData.email || "volcanic.digitalsolutions@gmail.com"}.
          </p>

          {showPasswordSection && (
            <form onSubmit={handleSavePassword} className="space-y-4 pt-2">
              {passwordFeedback && (
                <div
                  className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
                    passwordFeedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{passwordFeedback.message}</span>
                </div>
              )}

              {/* Step 1: Send OTP */}
              {!otpSent ? (
                <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4 space-y-3">
                  <p className="text-xs text-neutral-700">
                    Click below to dispatch an Email OTP verification code to <strong>{userData.email}</strong>.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="brand"
                    onClick={handleSendPasswordOtp}
                    disabled={isSendingOtp}
                  >
                    {isSendingOtp ? "Dispatching OTP..." : "Send Verification Code"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    label="Email OTP Code"
                    placeholder="Enter 6-digit verification code"
                    value={passwordOtp}
                    onChange={(e) => setPasswordOtp(e.target.value)}
                    required
                  />

                  {userData.hasPassword && (
                    <Input
                      label="Current Password (Optional if OTP is entered)"
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  )}

                  <div className="relative">
                    <Input
                      label="New Password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Must have 3 letters, 2 numbers, 1 symbol"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-[34px] text-neutral-400 hover:text-neutral-600"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" variant="brand" disabled={isSavingPassword}>
                      {isSavingPassword ? "Saving..." : "Update Password"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setShowPasswordSection(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      {/* Sign Out Button */}
      <div className="pt-4 flex justify-end">
        <Button variant="outline" onClick={handleSignOut} leftIcon={<LogOut className="h-4 w-4" />}>
          Sign Out of Provider Portal
        </Button>
      </div>
    </div>
  );
}
