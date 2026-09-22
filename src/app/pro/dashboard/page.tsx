"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Zap,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Radio,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ProfessionalDashboardPage() {
  const [providerName, setProviderName] = useState<string>("Verified Provider");
  const [trade, setTrade] = useState<string>("Service Specialist");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try local storage user profile
    try {
      const stored = localStorage.getItem("omniservice_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setProviderName(u.name);
      }
    } catch {}

    // 2. Fetch authenticated profile
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user?.name) {
          setProviderName(data.user.name);
          if (data.user.trade) setTrade(data.user.trade);
        }
      })
      .catch(() => {});

    // 3. Fetch live algorithmic dispatch leads
    fetch("/api/jobs/feed")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.leads)) {
          setLeads(data.leads);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const topLead = leads.length > 0 ? leads[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-6 sm:py-8 space-y-8 text-neutral-900">
      {/* Header */}
      <PageHeader
        title="Provider Operations Center"
        description={`Welcome back, ${providerName}. Live SmartRoute algorithmic dispatch network for Greater Hyderabad.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Provider Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Standby • Ready for Dispatch</span>
          </div>
        }
      />

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-white border-2 border-orange-100 shadow-xs p-4">
          <span className="text-xs text-neutral-500">Today&apos;s Revenue</span>
          <p className="mt-1 text-2xl font-black text-[#2d130a]">
            {leads.length > 0 ? "₹2,800" : "₹0"}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            100% Guaranteed Escrow
          </span>
        </Card>

        <Card className="bg-white border-2 border-orange-100 shadow-xs p-4">
          <span className="text-xs text-neutral-500">Active Jobs</span>
          <p className="mt-1 text-2xl font-black text-[#f05a28]">
            {leads.length > 0 ? "1" : "0"}
          </p>
          <span className="text-[11px] text-neutral-500 font-medium">
            {leads.length > 0 ? "1 dispatch incoming" : "Standby queue active"}
          </span>
        </Card>

        <Card className="bg-white border-2 border-orange-100 shadow-xs p-4">
          <span className="text-xs text-neutral-500">TrustLock Score</span>
          <p className="mt-1 text-2xl font-black text-emerald-600">100%</p>
          <span className="text-[11px] text-neutral-500 font-medium">
            Fiduciary compliance verified
          </span>
        </Card>

        <Card className="bg-white border-2 border-orange-100 shadow-xs p-4">
          <span className="text-xs text-neutral-500">Escrow Pending</span>
          <p className="mt-1 text-2xl font-black text-[#f05a28]">
            {leads.length > 0 ? "₹2,800" : "₹0"}
          </p>
          <span className="text-[11px] text-amber-700 font-medium">
            Releasing upon photo proof
          </span>
        </Card>
      </div>

      {/* SmartRoute Incoming Leads */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#f05a28]" />
            <h3 className="text-base font-bold text-[#2d130a]">
              SmartRoute Instant Dispatch Leads (Hyderabad Operations)
            </h3>
          </div>
          <Badge variant="brand" size="sm">
            {leads.length} Available
          </Badge>
        </div>

        {loading ? (
          <div className="rounded-2xl border-2 border-orange-100 bg-white p-8 text-center">
            <p className="text-xs text-neutral-500">Scanning Hyderabad dispatch network...</p>
          </div>
        ) : topLead ? (
          <Card className="bg-white border-2 border-orange-100 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2d130a]">
                    {topLead.title}
                  </span>
                  <Badge variant="warning" size="sm">
                    {topLead.urgency?.toUpperCase() || "URGENT"}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-[#f05a28]" />
                  {topLead.customerAddress || "Hyderabad, Telangana"}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-neutral-500">Locked Scope Price</span>
                <p className="text-xl font-mono font-bold text-emerald-600">
                  ₹{((topLead.priceCeilingPaise || 280000) / 100).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-200/80 text-xs space-y-2">
              <div className="flex items-center gap-2 text-neutral-800 font-semibold">
                <ShieldCheck className="h-4 w-4 text-[#f05a28]" />
                <span>InspectAI Verified Scope:</span>
              </div>
              <p className="text-neutral-600 pl-6 leading-relaxed">
                {topLead.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/pro/leads"
                className="text-xs font-semibold text-[#f05a28] hover:underline inline-flex items-center gap-1"
              >
                <span>View All {leads.length} SmartRoute Leads</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>

              <div className="flex items-center gap-3">
                <Link href="/pro/leads">
                  <Button size="sm" variant="ghost" className="text-neutral-600 hover:text-neutral-900">
                    Pass Lead
                  </Button>
                </Link>
                <Link href="/pro/route">
                  <Button size="sm" variant="brand" leftIcon={<Zap className="h-4 w-4" />}>
                    Accept Job &amp; Lock Escrow
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="border-2 border-dashed border-orange-200/80 bg-orange-50/20 p-8 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#f05a28] mb-3">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <h4 className="text-sm font-bold text-[#2d130a]">Live Standby — No Pending Leads</h4>
            <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
              Your technician profile and inventory are online across Greater Hyderabad. When an InspectAI repair matching your trade is verified, it will instantly appear here with locked pricing.
            </p>
            <div className="pt-4 flex justify-center gap-2">
              <Link href="/pro/inventory">
                <Button variant="outline" size="sm">
                  Check Van Inventory
                </Button>
              </Link>
              <Link href="/pro/profile">
                <Button variant="brand" size="sm">
                  Update Service Radius
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
