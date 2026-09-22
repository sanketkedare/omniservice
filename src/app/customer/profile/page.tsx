"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  Bell,
  Copy,
  Check,
  LogOut,
  Edit2,
  Save,
  X,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";

export default function CustomerProfilePage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [userData, setUserData] = useState({
    id: "",
    name: "Customer Account",
    email: "",
    phone: "",
    role: "customer",
    status: "active",
    hasPassword: true,
    createdAt: "",
  });

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
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

  const [notifications, setNotifications] = useState({
    whatsapp: true,
    sms: true,
    push: true,
    email: false,
  });

  // Load real user data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("omniservice_user");
      if (stored) {
        const u = JSON.parse(stored);
        setUserData((prev) => ({
          ...prev,
          id: u.id || "",
          name: u.name || "Customer Account",
          email: u.email || "",
          phone: u.phone || "",
          role: u.role || "customer",
          hasPassword: u.hasPassword ?? true,
        }));
        setFormValues({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
        });
      }
    } catch {}

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user) {
          const u = data.user;
          setUserData({
            id: u.id || "",
            name: u.name || "Customer Account",
            email: u.email || "",
            phone: u.phone || "",
            role: u.role || "customer",
            status: u.status || "active",
            hasPassword: Boolean(u.hasPassword),
            createdAt: u.createdAt || "",
          });
          setFormValues({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
          });
          try {
            localStorage.setItem("omniservice_user", JSON.stringify(u));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText("FORGE-HYD-2026");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    } catch (err: any) {
      setPasswordFeedback({ type: "error", message: err.message || "Failed to send code." });
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

      setUserData((prev) => ({ ...prev, hasPassword: true }));
      setPasswordFeedback({ type: "success", message: "Password updated successfully!" });
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      setPasswordOtp("");
      setOtpSent(false);
      setShowPasswordSection(false);
    } catch (err: any) {
      setPasswordFeedback({ type: "error", message: err.message || "Could not update password." });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile");
      }

      setUserData((prev) => ({
        ...prev,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
      }));

      try {
        localStorage.setItem("omniservice_user", JSON.stringify(data.user));
      } catch {}

      setFeedback({ type: "success", message: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Could not save profile" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      {/* Header */}
      <PageHeader
        title="Account Profile & Settings"
        description="Manage your verified contact details, HomePass membership, security password, and notifications across Hyderabad."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Profile" },
        ]}
      />

      {/* Security Alert: Prompt user to set a password if they don't have one */}
      {!userData.hasPassword && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 text-neutral-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#f05a28] animate-ping" />
              <h3 className="text-sm font-bold text-[#2d130a]">Security Setup: Create a Direct Password</h3>
            </div>
            <p className="text-xs text-neutral-600 max-w-2xl">
              You registered using Google OAuth or Email OTP and do not have a password configured yet. Set up a secure password below so you can also log in directly with your email and password.
            </p>
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

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <Avatar name={userData.name || "Customer"} size="xl" status="online" />
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  {userData.name}
                </h2>
                <Badge variant="brand" size="sm">
                  {userData.role === "admin"
                    ? "Admin Operator"
                    : userData.role === "professional"
                    ? "Verified Provider"
                    : "HomePass Customer"}
                </Badge>
                <Badge variant="success" size="sm">
                  Verified Account
                </Badge>
              </div>

              <p className="text-xs text-neutral-500">
                OmniService Hyderabad Member • Strict RBAC Protected
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-neutral-600 dark:text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#f05a28]" />
                  {userData.phone || "No phone linked"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-blue-500" />
                  {userData.email || "No email linked"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={isEditing ? "secondary" : "outline"}
                leftIcon={isEditing ? <X className="h-3.5 w-3.5" /> : <Edit2 className="h-3.5 w-3.5" />}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<LogOut className="h-3.5 w-3.5" />}
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Update Profile Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Full Name</label>
                  <Input
                    value={formValues.name}
                    onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email Address</label>
                  <Input
                    type="email"
                    value={formValues.email}
                    onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Phone Number</label>
                  <Input
                    type="tel"
                    value={formValues.phone}
                    onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                    placeholder="+91 98XXX XXXXX"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" variant="brand" disabled={isSaving} leftIcon={<Save className="h-3.5 w-3.5" />}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Security & Password Credentials Card */}
      <Card className="border-2 border-orange-200/90 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#f05a28]" />
              <CardTitle className="text-base font-bold text-[#2d130a]">
                Security &amp; Direct Password
              </CardTitle>
            </div>
            <Badge variant={userData.hasPassword ? "success" : "warning"} size="sm">
              {userData.hasPassword ? "Password Active" : "No Password Set"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#fffaf5] border border-orange-100">
            <div>
              <p className="text-xs font-bold text-[#2d130a]">
                {userData.hasPassword
                  ? "Direct Password Enabled"
                  : "No Password Configured (Signed in via Google/Email OTP)"}
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {userData.hasPassword
                  ? "You can log in directly using your email and password, or change it anytime."
                  : "Create a password to enable direct email & password authentication."}
              </p>
            </div>
            <Button
              size="sm"
              variant={showPasswordSection ? "secondary" : "brand"}
              onClick={() => {
                setShowPasswordSection(!showPasswordSection);
                setPasswordFeedback(null);
              }}
            >
              {showPasswordSection
                ? "Close"
                : userData.hasPassword
                ? "Change Password"
                : "Create Password"}
            </Button>
          </div>

          {passwordFeedback && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                passwordFeedback.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {passwordFeedback.type === "success" ? (
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              )}
              <span>{passwordFeedback.message}</span>
            </div>
          )}

          {showPasswordSection && (
            <form onSubmit={handleSavePassword} className="space-y-4 pt-2 border-t border-orange-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userData.hasPassword ? (
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Current Password (or request Email OTP)
                    </label>
                    <Input
                      type="password"
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-neutral-700">
                        Email OTP Code
                      </label>
                      <button
                        type="button"
                        onClick={handleSendPasswordOtp}
                        disabled={isSendingOtp}
                        className="text-[11px] font-bold text-[#f05a28] hover:underline cursor-pointer"
                      >
                        {isSendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send Email OTP"}
                      </button>
                    </div>
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="6-digit OTP code"
                      value={passwordOtp}
                      onChange={(e) => setPasswordOtp(e.target.value.replace(/\D/g, ""))}
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Format Checklist */}
              <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/80 space-y-1.5 text-[11px]">
                <span className="font-bold text-[#c2410c] block">Required Password Security Format:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-neutral-600">
                  <span className={`flex items-center gap-1 ${((newPassword.match(/[a-zA-Z]/g) || []).length >= 3) ? "text-emerald-700 font-bold" : ""}`}>
                    ✓ Min 3 Alphabets
                  </span>
                  <span className={`flex items-center gap-1 ${((newPassword.match(/[0-9]/g) || []).length >= 2) ? "text-emerald-700 font-bold" : ""}`}>
                    ✓ Min 2 Numbers
                  </span>
                  <span className={`flex items-center gap-1 ${((newPassword.match(/[^a-zA-Z0-9\s]/g) || []).length >= 1) ? "text-emerald-700 font-bold" : ""}`}>
                    ✓ Min 1 Symbol
                  </span>
                  <span className={`flex items-center gap-1 ${newPassword.length >= 6 ? "text-emerald-700 font-bold" : ""}`}>
                    ✓ Min 6 Chars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Confirm New Password
                </label>
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPasswordSection(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant="brand"
                  disabled={isSavingPassword || !newPassword || newPassword !== confirmPassword}
                >
                  {isSavingPassword ? "Saving..." : "Save Password"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Referral Card */}
        <Card className="border-[#f05a28]/30 bg-gradient-to-br from-[#f05a28]/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Refer a Neighbor, Earn ₹500</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <p className="text-xs text-neutral-500 leading-relaxed">
              Share your referral code. When a neighbor completes their first InspectAI diagnostic job, you both receive ₹500 in service credits.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-3 py-2 font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                FORGE-HYD-2026
              </div>
              <Button
                size="sm"
                variant="brand"
                onClick={handleCopyReferral}
                leftIcon={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              >
                {copied ? "Copied!" : "Copy Code"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & WhatsApp Updates */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#f05a28]" />
              <CardTitle className="text-sm">Dispatch Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 text-xs">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">WhatsApp ETA Alerts</p>
                <p className="text-[11px] text-neutral-400">Live technician location &amp; SOW approvals</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.whatsapp}
                onChange={(e) => setNotifications({ ...notifications, whatsapp: e.target.checked })}
                className="h-4 w-4 accent-[#f05a28] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-neutral-100 dark:border-neutral-800">
              <div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">SMS Verification Codes</p>
                <p className="text-[11px] text-neutral-400">Job completion OTP and milestone receipts</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                className="h-4 w-4 accent-[#f05a28] rounded cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
