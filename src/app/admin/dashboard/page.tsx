"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Banknote,
  Cpu,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  RefreshCw,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface AdminMetrics {
  totalEscrowLockedPaise: number;
  inspectAiCount: number;
  activeProsCount: number;
  verifiedProsCount: number;
  activeJobsCount: number;
  openDisputesCount: number;
  recentEvents: Array<{
    id: string;
    title: string;
    amount: string;
    status: string;
    variant: string;
    time: string;
  }>;
  subsystems: {
    database: string;
    objectStorage: string;
    aiPipeline: string;
    trustLockVerifier: string;
  };
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/metrics");
      const json = await res.json();
      if (json.success && json.data) {
        setMetrics(json.data);
      }
    } catch (err) {
      console.error("Failed to load admin metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const totalEscrowFormatted = metrics
    ? `₹${(metrics.totalEscrowLockedPaise / 100).toLocaleString("en-IN")}`
    : "₹0";

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
      {/* Header */}
      <PageHeader
        title="OmniService AI Operations &amp; Governance"
        description="Real-time oversight of marketplace transactions, AI inference health, escrow balances, and dispute resolution across Greater Hyderabad."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchMetrics}
              leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />}
            >
              Refresh
            </Button>
            <Link href="/admin/escrow">
              <Button size="sm" variant="brand">
                Escrow Ledger
              </Button>
            </Link>
          </div>
        }
      />

      {/* Global Stat Cards (Responsive 1 -> 2 -> 4 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Card className="border border-neutral-200/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">
                Total Escrow Locked
              </span>
              <Banknote className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-black text-neutral-900 dark:text-neutral-50 font-mono">
                {loading ? "..." : totalEscrowFormatted}
              </p>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ShieldCheck className="h-3.5 w-3.5 mr-0.5" /> Fiduciary
              </span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">
              Across {loading ? "..." : metrics?.activeJobsCount ?? 0} active dispatched jobs
            </p>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">
                InspectAI Inferences
              </span>
              <Cpu className="h-4 w-4 text-[#f05a28]" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-black text-neutral-900 dark:text-neutral-50 font-mono">
                {loading ? "..." : (metrics?.inspectAiCount ?? 0).toLocaleString("en-IN")}
              </p>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                Active
              </span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">
              Total customer diagnostic records
            </p>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">
                Registered Professionals
              </span>
              <Briefcase className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-black text-neutral-900 dark:text-neutral-50 font-mono">
                {loading ? "..." : (metrics?.activeProsCount ?? 0).toLocaleString("en-IN")}
              </p>
              <span className="text-xs font-semibold text-blue-600">
                {loading ? "..." : metrics?.verifiedProsCount ?? 0} KYC verified
              </span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">
              SmartRoute dispatch network
            </p>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">
                Open Disputes
              </span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-black text-amber-600 font-mono">
                {loading ? "..." : metrics?.openDisputesCount ?? 0}
              </p>
              <Badge variant={metrics?.openDisputesCount ? "warning" : "success"} size="sm">
                {metrics?.openDisputesCount ? "Under Review" : "Clear"}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">
              Double-blind arbitration desk
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Event Stream & System Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Platform Transactions (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
              Recent Escrow &amp; Verification Events
            </h3>
            <Link
              href="/admin/escrow"
              className="text-xs font-semibold text-[#f05a28] hover:underline"
            >
              View Full Ledger &rarr;
            </Link>
          </div>

          <Card className="border border-neutral-200/80 shadow-xs">
            {loading ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                Syncing platform telemetry with database...
              </div>
            ) : metrics?.recentEvents && metrics.recentEvents.length > 0 ? (
              <CardContent className="p-0 divide-y divide-neutral-100 dark:divide-neutral-800">
                {metrics.recentEvents.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                          {tx.title}
                        </span>
                        <Badge variant={tx.variant as any} size="sm">
                          {tx.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        {tx.id} • {tx.time}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100 shrink-0">
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </CardContent>
            ) : (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                <h4 className="text-xs font-bold text-neutral-800">No Escrow Transactions Recorded Yet</h4>
                <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
                  New customer bookings and TrustLock authorizations will automatically stream into this ledger in real time.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* AI & Subsystem Health (1 col on lg) */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
            System Diagnostics
          </h3>

          <Card className="border border-neutral-200/80 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Subsystem Connectivity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  MongoDB Connection Pool
                </span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {metrics?.subsystems.database || "Healthy"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Cloud Object Storage
                </span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {metrics?.subsystems.objectStorage || "Active"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  InspectAI Pipeline
                </span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {metrics?.subsystems.aiPipeline || "Nominal"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  TrustLock Evidence Verifier
                </span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {metrics?.subsystems.trustLockVerifier || "Operational"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
