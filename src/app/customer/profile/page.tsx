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
    createdAt: "",
  });

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
  });

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
        description="Manage your verified contact details, HomePass membership, notification preferences, and saved addresses in Ameerpet."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Profile" },
        ]}
      />

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
                    ? "Verified Pro"
                    : "HomePass Customer"}
                </Badge>
                <Badge variant="success" size="sm">
                  Verified Account
                </Badge>
              </div>

              <p className="text-xs text-neutral-500">
                Member of OmniService Ameerpet Pilot • Strict RBAC Protected
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
