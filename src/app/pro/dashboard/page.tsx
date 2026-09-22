import React from "react";
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
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ProfessionalDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-6 sm:py-8 space-y-8 text-neutral-900">
      {/* Header */}
      <PageHeader
        title="Pro Operations Center"
        description="Welcome back, CoolAir Solutions. Live routing and jobs scheduled for Ameerpet & Greater Hyderabad."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Pro Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold text-emerald-600">
              Online • Ready for Dispatch
            </span>
          </div>
        }
      />

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-white border-2 border-orange-100 shadow-xs p-4">
          <span className="text-xs text-neutral-500">Today&apos;s Revenue</span>
          <p className="mt-1 text-2xl font-black text-[#2d130a]">₹4,850</p>
          <span className="text-[11px] text-emerald-600 font-medium">
            +18% vs last week
          </span>
        </Card>

        <Card className="bg-white border-2 border-orange-100 shadow-xs p-4">
          <span className="text-xs text-neutral-500">Active Jobs</span>
          <p className="mt-1 text-2xl font-black text-[#f05a28]">2</p>
          <span className="text-[11px] text-neutral-500 font-medium">
            1 in progress, 1 scheduled
          </span>
        </Card>

        <Card className="bg-white border-2 border-orange-100 shadow-xs p-4">
          <span className="text-xs text-neutral-500">TrustLock Score</span>
          <p className="mt-1 text-2xl font-black text-emerald-600">98.4%</p>
          <span className="text-[11px] text-neutral-500 font-medium">
            Zero disputed releases
          </span>
        </Card>

        <Card className="bg-white border-2 border-orange-100 shadow-xs p-4">
          <span className="text-xs text-neutral-500">Escrow Pending</span>
          <p className="mt-1 text-2xl font-black text-[#f05a28]">₹7,200</p>
          <span className="text-[11px] text-amber-700 font-medium">
            Releasing upon verification
          </span>
        </Card>
      </div>

      {/* SmartRoute Incoming Leads */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#f05a28]" />
            <h3 className="text-base font-bold text-[#2d130a]">
              SmartRoute Instant Dispatch Leads (Ameerpet Hub)
            </h3>
          </div>
          <Badge variant="brand" size="sm">
            AI Matched
          </Badge>
        </div>

        <Card className="bg-white border-2 border-orange-100 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2d130a]">
                  Split AC Compressor Tripping MCB
                </span>
                <Badge variant="warning" size="sm">
                  Urgent (Within 2 hrs)
                </Badge>
              </div>
              <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-[#f05a28]" />
                SR Nagar, Ameerpet, Hyderabad (1.8 km away • 6 min drive)
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-neutral-500">Locked Scope Price</span>
              <p className="text-xl font-mono font-bold text-emerald-600">
                ₹2,800
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-200/80 text-xs space-y-2">
            <div className="flex items-center gap-2 text-neutral-800 font-semibold">
              <ShieldCheck className="h-4 w-4 text-[#f05a28]" />
              <span>InspectAI Verified Scope:</span>
            </div>
            <p className="text-neutral-600 pl-6 leading-relaxed">
              Customer uploaded 12s video showing compressor shudder and instant 16A MCB trip. Required parts: 45µF Dual Run Capacitor + terminal connector cleaning. Van inventory check: 2 units in stock.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/pro/leads"
              className="text-xs font-semibold text-[#f05a28] hover:underline inline-flex items-center gap-1"
            >
              <span>View All 3 SmartRoute Leads</span>
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
      </div>
    </div>
  );
}
