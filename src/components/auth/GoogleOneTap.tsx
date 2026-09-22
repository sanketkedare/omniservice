"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface GoogleOneTapProps {
  role?: "customer" | "professional";
  onSuccess?: (user: any) => void;
}

export function GoogleOneTap({ role = "customer", onSuccess }: GoogleOneTapProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Generate simulated Google ID Token with user profile claims
      const timestamp = Date.now();
      const mockGoogleHeader = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
      const userEmail = role === "professional" ? "pro.specialist@omniservice.world" : "user.google@omniservice.world";
      const userName = role === "professional" ? "Professional Specialist" : "Google Account User";
      const mockGooglePayload = btoa(
        JSON.stringify({
          iss: "https://accounts.google.com",
          sub: `google_user_${timestamp}`,
          email: userEmail,
          email_verified: true,
          name: userName,
          picture: "/images/OmniService_Icon.png",
          iat: Math.floor(timestamp / 1000),
          exp: Math.floor(timestamp / 1000) + 3600,
        })
      );
      const mockGoogleCredential = `${mockGoogleHeader}.${mockGooglePayload}.signature`;

      const res = await fetch("/api/auth/google-one-tap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: mockGoogleCredential, role }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Google authentication failed");
      }

      // Set client role and user persistence
      try {
        localStorage.setItem("omniservice_user", JSON.stringify(data.user));
      } catch {
        // Ignore localStorage error
      }
      const maxAge = 604800; // 7 days
      document.cookie = `omniservice-role=${data.user.role}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `omniservice-user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `authjs.session-token=google_sess_${data.user.role}_${timestamp}; path=/; max-age=${maxAge}; SameSite=Lax`;

      if (onSuccess) {
        onSuccess(data.user);
      } else {
        if (data.user.role === "professional") {
          router.push("/pro/dashboard");
        } else {
          router.push("/customer/dashboard");
        }
      }
    } catch (err: any) {
      setError(err?.message || "Google sign-in encountered an error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200/90 bg-white py-2.5 px-4 text-xs font-semibold text-neutral-800 shadow-xs transition-all hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-[#f05a28]" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{isLoading ? "Authenticating with Google..." : "Continue with Google"}</span>
      </button>

      {error && <p className="text-[11px] text-red-500 text-center">{error}</p>}
    </div>
  );
}
