import React from "react";
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
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <PageHeader
        title="OmniService AI Operations & Governance"
        description="Real-time oversight of marketplace transactions, AI inference health, escrow balances, and dispute resolution."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline">
              Export Audit Trail
            </Button>
            <Button size="sm" variant="brand">
              Platform Controls
            </Button>
          </div>
        }
      />

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">
                Total Escrow Locked
              </span>
              <Banknote className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
                ₹18,42,500
              </p>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="h-3 w-3" /> +14.2%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">
              Across 312 active jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">
                InspectAI Inferences (24h)
              </span>
              <Cpu className="h-4 w-4 text-[#f05a28]" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
                1,428
              </p>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                99.2% success
              </span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">
              Median latency 1.4s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">
                Active Professionals
              </span>
              <Briefcase className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
                842
              </p>
              <span className="text-xs font-semibold text-blue-600">
                68 dispatched
              </span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">
              96% KYC verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">
                Open Disputes
              </span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-black text-amber-600">
                1
              </p>
              <Badge variant="warning" size="sm">
                Under Review
              </Badge>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">
              0.03% dispute rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Event Stream & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Platform Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
            Recent Escrow & Verification Events
          </h3>

          <Card>
            <CardContent className="p-0 divide-y divide-neutral-100 dark:divide-neutral-800">
              {[
                {
                  id: "TX-9921",
                  title: "TrustLock Auto-Release: Kitchen Plumbing #JB-442",
                  amount: "₹2,200",
                  status: "Released",
                  variant: "success" as const,
                  time: "4 mins ago",
                },
                {
                  id: "TX-9920",
                  title: "Customer Escrow Authorized: AC Gas Leak #JB-443",
                  amount: "₹1,850",
                  status: "In Escrow",
                  variant: "brand" as const,
                  time: "14 mins ago",
                },
                {
                  id: "TX-9919",
                  title: "AI Video Diagnostic Session Completed #DS-881",
                  amount: "Free",
                  status: "Verified",
                  variant: "info" as const,
                  time: "28 mins ago",
                },
                {
                  id: "TX-9918",
                  title: "SmartRoute Pro Dispatch: Electrical Board Rewire",
                  amount: "₹3,400",
                  status: "Accepted",
                  variant: "default" as const,
                  time: "42 mins ago",
                },
              ].map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                        {tx.title}
                      </span>
                      <Badge variant={tx.variant} size="sm">
                        {tx.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-neutral-400">{tx.id} • {tx.time}</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {tx.amount}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Engine Status */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
            System Diagnostics
          </h3>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Subsystem Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  MongoDB Connection Pool
                </span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Cloud Object Storage
                </span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  InspectAI Pipeline
                </span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Nominal
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  TrustLock Evidence Verifier
                </span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Active
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
