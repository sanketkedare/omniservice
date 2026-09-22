"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { GoogleOneTap } from "@/components/auth/GoogleOneTap";
import { useGeolocation } from "@/lib/geolocation";
import { toast } from "@/components/ui/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isGoogleRedirect = searchParams.get("google") === "1";
  const urlEmail = searchParams.get("email") || "";
  const urlName = searchParams.get("name") || "";
  const urlAvatar = searchParams.get("avatar") || "";
  const urlGoogleId = searchParams.get("googleId") || "";

  const { coordinates, locality, isLoading: isLocating, detectLocation, permissionDenied } = useGeolocation();

  const [role, setRole] = useState<"customer" | "professional">("customer");
  const [name, setName] = useState(urlName);
  const [email, setEmail] = useState(urlEmail);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [trade, setTrade] = useState("Air Conditioning & HVAC");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [gpsCaptured, setGpsCaptured] = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(isGoogleRedirect);
  const [googleId, setGoogleId] = useState(urlGoogleId);
  const [googleAvatar, setGoogleAvatar] = useState(urlAvatar);

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
    toast.info("Acquiring GPS Coordinates...", "Requesting location permission from browser");
    const coords = await detectLocation();
    if (coords) {
      setGpsCaptured(true);
      toast.success(
        "Location Acquired",
        `${locality || "Hyderabad, Telangana"} (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
      );
    } else {
      toast.warning("Fallback Location Set", "Using default Hyderabad, Telangana coordinates");
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
    toast.success("Google Account Linked", `Verified as ${data.email}. Select your role to complete setup.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name");
      toast.error("Name Required", "Please enter your legal or business name");
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setError("Please provide at least a mobile number or email address");
      toast.error("Contact Required", "Please provide a mobile number or email");
      return;
    }

    // Password validation only mandatory for credential auth
    if (!isGoogleAccount) {
      if (!password || password.length < 6) {
        setError("Password must be at least 6 characters long");
        toast.error("Password Weak", "Password must be at least 6 characters long");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match. Please re-enter.");
        toast.error("Password Mismatch", "Passwords do not match. Please verify.");
        return;
      }
    }

    try {
      setError("");
      setIsLoading(true);
      const loadId = toast.loading("Creating account...", "Securing account and provisioning profile");

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
          trade: role === "professional" ? trade : undefined,
          coordinates: coordinates || undefined,
        }),
      });

      const data = await res.json();
      toast.dismiss(loadId);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create account");
      }

      // Remember user across browser sessions
      try {
        localStorage.setItem("omniservice_user", JSON.stringify(data.user));
      } catch {
        // Ignore localStorage error
      }

      const maxAge = 604800; // 7 days
      if (data.token) {
        document.cookie = `authjs.session-token=${data.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      }
      document.cookie = `omniservice-role=${data.user.role}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `omniservice-user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=${maxAge}; SameSite=Lax`;

      toast.success("Registration Complete!", `Welcome to OmniService, ${data.user.name}`);

      if (data.user.role === "professional") {
        router.push("/pro/dashboard");
      } else {
        router.push("/customer/dashboard");
      }
    } catch (err: any) {
      const errMsg = err?.message || "Registration failed. Please try again.";
      setError(errMsg);
      toast.error("Registration Failed", errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="rounded-3xl border-2 border-orange-200/80 bg-white p-6 sm:p-10 shadow-xl shadow-orange-950/5 space-y-6 font-serif"
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2d130a]">
          Create OmniService Account
        </h1>
        <p className="mt-1 text-xs text-neutral-600">
          Join the AI-governed local services ecosystem in Hyderabad, Telangana.
        </p>
      </div>

      {isGoogleAccount && (
        <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-emerald-950">Google Account Connected</p>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              Verified email: <strong>{email}</strong>. Select whether you are a Homeowner or Service Provider below to finish registration.
            </p>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <p className="text-xs">{error}</p>
        </Alert>
      )}

      {/* Role Picker */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setRole("customer");
            toast.info("Selected Account Type", "Customer / Homeowner Experience");
          }}
          className={`flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-all ${
            role === "customer"
              ? "border-[#f05a28] bg-orange-50/40 shadow-xs ring-2 ring-[#f05a28]/20"
              : "border-neutral-200 bg-white hover:border-neutral-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <User className={`h-4 w-4 ${role === "customer" ? "text-[#f05a28]" : "text-neutral-500"}`} />
            <span className="text-xs font-bold text-[#2d130a]">Homeowner</span>
          </div>
          <p className="text-[11px] text-neutral-500">
            Diagnose repairs, lock prices, and track HomePass in Hyderabad.
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setRole("professional");
            toast.info("Selected Account Type", "Verified Professional Partner");
          }}
          className={`flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-all ${
            role === "professional"
              ? "border-[#f05a28] bg-orange-50/40 shadow-xs ring-2 ring-[#f05a28]/20"
              : "border-neutral-200 bg-white hover:border-neutral-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <Briefcase className={`h-4 w-4 ${role === "professional" ? "text-[#f05a28]" : "text-neutral-500"}`} />
            <span className="text-xs font-bold text-[#2d130a]">Service Pro</span>
          </div>
          <p className="text-[11px] text-neutral-500">
            Receive matched dispatch leads with van inventory lock.
          </p>
        </button>
      </div>

      {/* Google 1-Tap Alternative */}
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

          <div className="relative my-3 flex items-center justify-center">
            <div className="w-full border-t border-neutral-200" />
            <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Or register credentials
            </span>
          </div>
        </>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Legal / Business Name"
          placeholder="e.g. Rajesh Kumar"
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
            helperText="Enter 10-digit mobile number"
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            disabled={isGoogleAccount}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4 text-[#f05a28]" />}
            helperText={isGoogleAccount ? "Verified with Google" : "For encrypted invoices & account recovery"}
            required={!isGoogleAccount}
          />
        </div>

        {role === "professional" && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700">
              Primary Trade Specialization
            </label>
            <select
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 focus:border-[#f05a28] focus:outline-none"
            >
              <option value="Air Conditioning & HVAC">Air Conditioning &amp; HVAC</option>
              <option value="Electrical Systems & MCBs">Electrical Systems &amp; MCBs</option>
              <option value="Advanced Plumbing & Drainage">Advanced Plumbing &amp; Drainage</option>
              <option value="Kitchen & Home Appliances">Kitchen &amp; Home Appliances</option>
              <option value="Water Purifiers & RO Systems">Water Purifiers &amp; RO Systems</option>
              <option value="Carpentry & Renovation">Carpentry &amp; Renovation</option>
            </select>
          </div>
        )}

        {/* GPS Geolocation Capture */}
        <div className="rounded-2xl border border-orange-200/70 bg-[#fffaf5] p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2d130a] flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#f05a28]" />
              Hyderabad Service Zone
            </span>
            <button
              type="button"
              onClick={handleCaptureLocation}
              disabled={isLocating}
              className="text-xs font-bold text-[#f05a28] hover:underline flex items-center gap-1"
            >
              {isLocating ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Locating...</span>
                </>
              ) : gpsCaptured ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Update GPS</span>
                </>
              ) : (
                <span>Auto-Detect GPS</span>
              )}
            </button>
          </div>
          <p className="text-[11px] text-neutral-500">
            {permissionDenied ? (
              <span className="text-amber-800 font-semibold">
                ⚠️ Browser GPS permission denied. Defaulting to Hyderabad, Telangana. You can update this or enable location permissions anytime.
              </span>
            ) : locality ? (
              `Detected: ${locality} (${coordinates?.lat.toFixed(4) || "17.3850"}, ${coordinates?.lng.toFixed(4) || "78.4867"})`
            ) : (
              "Detect your location for automatic 15-minute SmartRoute technician dispatches in Hyderabad."
            )}
          </p>
        </div>

        {/* Password Inputs (only if not Google-authenticated) */}
        {!isGoogleAccount && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Input
                label="Password (min 6 chars)"
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
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
          {isGoogleAccount ? "Finalize Google Registration" : "Complete Registration"}
        </Button>
      </form>

      <div className="text-center text-xs text-neutral-500 pt-1">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#f05a28] hover:underline">
          Sign in here
        </Link>
      </div>
    </div>
  );
}
