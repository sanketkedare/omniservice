"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowLeft, LogIn, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "Role Authorization Required";
  const requiredRole = searchParams.get("role") || "authorized";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-serif">
      <div className="max-w-md w-full rounded-3xl border-2 border-red-200 bg-white p-8 text-center shadow-xl space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
            HTTP 403 • Strict RBAC Enforcement
          </span>
          <h1 className="text-2xl font-bold text-[#2d130a]">Access Restricted</h1>
          <p className="text-xs text-neutral-600 font-sans leading-relaxed">
            Your current session does not have the required <strong>{requiredRole}</strong> role permissions to access this portal.
          </p>
        </div>

        <div className="rounded-xl bg-orange-50 border border-orange-200 p-3 text-xs text-neutral-700 font-sans">
          <strong>Security Notice:</strong> All administrative and provider operations are cryptographically verified and guarded by Next.js 16 Edge Proxy.
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Link href="/login" className="flex-1">
            <Button variant="brand" fullWidth leftIcon={<LogIn className="h-4 w-4" />}>
              Switch Account
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" fullWidth leftIcon={<Home className="h-4 w-4" />}>
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
