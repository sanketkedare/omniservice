"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  Bell,
  Copy,
  Check,
  LogOut,
  Building,
  CreditCard,
  Globe,
  Lock,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";

export default function CustomerProfilePage() {
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    sms: true,
    push: true,
    email: false,
  });

  const handleCopyReferral = () => {
    navigator.clipboard.writeText("FORGE-HYD-2026");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      {/* Header */}
      <PageHeader
        title="Account Profile & Settings"
        description="Manage your contact details, HomePass membership, notification preferences, and saved addresses."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Profile" },
        ]}
      />

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <Avatar name="Sanket Kedare" size="xl" status="online" />
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  Sanket Kedare
                </h2>
                <Badge variant="brand" size="sm">
                  HomePass Prime
                </Badge>
                <Badge variant="success" size="sm">
                  Phone Verified
                </Badge>
              </div>
              <p className="text-xs text-neutral-500">
                Customer member since January 2024 • 6 TrustLock verified services
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-neutral-600 dark:text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#f05a28]" />
                  +91 98XXX XXXXX
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-blue-500" />
                  volcanic.digitalsolutions@gmail.com
                </span>
              </div>
            </div>
            <Link href="/login">
              <Button size="sm" variant="outline" leftIcon={<LogOut className="h-3.5 w-3.5" />}>
                Sign Out
              </Button>
            </Link>
          </div>
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
