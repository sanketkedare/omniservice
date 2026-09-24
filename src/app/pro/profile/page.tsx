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
  Store,
  Navigation,
  CheckSquare,
  Square,
  Clock,
  Award,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { toast } from "@/components/ui/Toast";

const SPECIALTY_OPTIONS = [
  "Split & Window AC Repair / Servicing",
  "Electrical & Main Panel Wiring",
  "Plumbing & Leak Detection",
  "RO Water Purifier & Filter Replacement",
  "Smart Home CCTV & Security Automation",
  "Solar Inverter & Battery Installation",
  "Washing Machine & Refrigerator Repair",
  "Interior Painting & Waterproofing",
];

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

  // Provider Shop & Business Details State
  const [shopDetails, setShopDetails] = useState({
    shopName: "Volcanic Climate & HVAC Workshop",
    address: "Plot 42, HITECH City Main Rd, near Cyber Towers",
    locality: "Madhapur, Hyderabad",
    pincode: "500081",
    mapLink: "https://maps.google.com/?q=17.445,78.382",
    experienceYears: "8",
    licenseGst: "36AAAPL1234F1Z9",
    emergency247: true,
    specialties: [
      "Split & Window AC Repair / Servicing",
      "Electrical & Main Panel Wiring",
      "RO Water Purifier & Filter Replacement",
    ],
  });

  const [isSavingShop, setIsSavingShop] = useState(false);

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

      const storedShop = localStorage.getItem("omniservice_pro_shop");
      if (storedShop) {
        setShopDetails(JSON.parse(storedShop));
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

  const handleToggleSpecialty = (item: string) => {
    setShopDetails((prev) => {
      const exists = prev.specialties.includes(item);
      const updated = exists
        ? prev.specialties.filter((s) => s !== item)
        : [...prev.specialties, item];
      return { ...prev, specialties: updated };
    });
  };

  const handleSaveShopDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingShop(true);
    try {
      localStorage.setItem("omniservice_pro_shop", JSON.stringify(shopDetails));
      toast.success("Shop Details Updated", "Your business profile & location are live on OmniService.");
    } catch {
      toast.error("Error", "Failed to save shop details.");
    } finally {
      setIsSavingShop(false);
    }
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
    <div className="w-full max-w-none space-y-8 text-neutral-900 font-serif" style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}>
      <PageHeader
        title="Provider Profile & Shop Verification"
        description="Manage your verified professional credentials, shop location, multiple specialties, and security."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Provider Dashboard", href: "/pro/dashboard" },
          { label: "Profile Setup" },
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
                Create a direct password below for instant access across all technician dispatch devices.
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
      <Card className="border-2 border-orange-100 shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <Button variant="outline" size="sm" onClick={handleSignOut} className="text-rose-600 border-rose-200 hover:bg-rose-50 w-fit">
              <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-orange-100 text-xs">
            <div>
              <span className="text-neutral-500 block">Contact Email</span>
              <span className="font-semibold text-neutral-900">{userData.email || "provider@omniservice.com"}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Mobile Dispatch Line</span>
              <span className="font-semibold text-neutral-900">{userData.phone || "+91 98765 43210"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Shop & Location Details Form */}
      <Card className="border-2 border-orange-200/80 shadow-md bg-white">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50/50 p-5 border-b border-orange-200/60">
          <div className="flex items-center gap-2.5">
            <Store className="h-5 w-5 text-[#f05a28]" />
            <CardTitle className="text-base font-bold text-neutral-900">
              Provider Shop Location & Business Verification
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSaveShopDetails} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Shop / Business Name</label>
                <Input
                  value={shopDetails.shopName}
                  onChange={(e) => setShopDetails((p) => ({ ...p, shopName: e.target.value }))}
                  className="bg-white border-neutral-300 text-xs"
                  placeholder="e.g. Volcanic HVAC & Electrical Workshop"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Locality / Zone</label>
                <Input
                  value={shopDetails.locality}
                  onChange={(e) => setShopDetails((p) => ({ ...p, locality: e.target.value }))}
                  className="bg-white border-neutral-300 text-xs"
                  placeholder="e.g. Madhapur / Gachibowli, Hyderabad"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">Physical Shop Address</label>
                <Input
                  value={shopDetails.address}
                  onChange={(e) => setShopDetails((p) => ({ ...p, address: e.target.value }))}
                  className="bg-white border-neutral-300 text-xs"
                  placeholder="e.g. Plot 42, HITECH City Main Road..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Pincode</label>
                <Input
                  value={shopDetails.pincode}
                  onChange={(e) => setShopDetails((p) => ({ ...p, pincode: e.target.value }))}
                  className="bg-white border-neutral-300 text-xs"
                  placeholder="e.g. 500081"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Google Maps Location Link</label>
                <Input
                  value={shopDetails.mapLink}
                  onChange={(e) => setShopDetails((p) => ({ ...p, mapLink: e.target.value }))}
                  className="bg-white border-neutral-300 text-xs"
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Experience (Years)</label>
                <Input
                  value={shopDetails.experienceYears}
                  onChange={(e) => setShopDetails((p) => ({ ...p, experienceYears: e.target.value }))}
                  className="bg-white border-neutral-300 text-xs"
                  placeholder="e.g. 8"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">License / GST Registration ID</label>
                <Input
                  value={shopDetails.licenseGst}
                  onChange={(e) => setShopDetails((p) => ({ ...p, licenseGst: e.target.value }))}
                  className="bg-white border-neutral-300 text-xs"
                  placeholder="e.g. 36AAAPL1234F1Z9"
                />
              </div>
            </div>

            {/* Multiple Specialty Selector */}
            <div className="pt-4 border-t border-neutral-200">
              <label className="block text-xs font-bold text-neutral-900 mb-2">
                Service Specialties (Select Multiple Trades)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SPECIALTY_OPTIONS.map((item) => {
                  const selected = shopDetails.specialties.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleSpecialty(item)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs transition-all ${
                        selected
                          ? "border-[#f05a28] bg-orange-50/70 text-[#f05a28] font-bold shadow-xs"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      {selected ? (
                        <CheckSquare className="h-4 w-4 text-[#f05a28] shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-neutral-400 shrink-0" />
                      )}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={isSavingShop} className="bg-[#f05a28] hover:bg-[#d04618] text-white font-bold text-xs px-6 py-2 rounded-xl shadow-md">
                {isSavingShop ? "Saving..." : "Save Shop Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
