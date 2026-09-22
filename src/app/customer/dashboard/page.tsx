"use client";

import React from "react";
import Link from "next/link";
import {
  Camera,
  ShieldCheck,
  Clock,
  ChevronRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

export default function CustomerDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <PageHeader
        title="Welcome back, Sanket"
        description="Manage your home services, track active diagnostics, and access your HomePass digital passport in Ameerpet, Hyderabad."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Customer Dashboard" },
        ]}
        actions={
          <Link href="/customer/new-request">
            <Button
              variant="brand"
              size="default"
              leftIcon={<Camera className="h-4 w-4" />}
            >
              New Diagnostic
            </Button>
          </Link>
        }
      />

      {/* AI Diagnostic CTA Banner (RADIANT ORANGE GRADIENT) */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-orange-300 bg-gradient-to-r from-[#fff5eb] via-white to-[#ffeedb] p-6 sm:p-8 text-neutral-900 shadow-md shadow-orange-950/5">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/15 px-3 py-1 text-xs font-bold text-[#c2410c] border border-orange-200/80 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#f05a28]" />
            <span>InspectAI Diagnostic Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2d130a]">
            Have a problem at home? Show, don&apos;t guess.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Record a 15-second video or snap a few photos. Our AI analyzes root causes, specifies parts, generates an exact Scope of Work, and calculates transparent fair-market pricing for Ameerpet, Hyderabad.
          </p>
          <div className="pt-2">
            <Link href="/customer/new-request">
              <Button
                variant="brand"
                size="lg"
                leftIcon={<Camera className="h-4 w-4" />}
              >
                Start AI Diagnosis
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Requests & HomePass Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs / Requests (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2d130a]">
              Active Service Requests
            </h3>
            <Link
              href="/customer/requests"
              className="text-xs font-semibold text-[#f05a28] hover:underline flex items-center gap-1"
            >
              View all (2) <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <Card className="border-2 border-orange-100 shadow-xs">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#2d130a]">
                      Kitchen Sink Waste Pipe Leak
                    </span>
                    <Badge variant="brand" size="sm">
                      InspectAI In Progress
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-[#f05a28]" />
                    Ameerpet, Hyderabad • Added 18 mins ago
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-[#2d130a]">
                  ₹1,800 – ₹2,400 est.
                </span>
              </div>

              <div className="rounded-xl bg-[#fffaf5] p-3 text-xs text-neutral-600 space-y-1 border border-orange-100">
                <div className="flex items-center gap-1.5 font-medium text-[#2d130a]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>AI Finding: P-trap compression gasket degradation</span>
                </div>
                <p className="text-neutral-500 pl-5">
                  Matching 3 certified plumbing pros nearby with required 32mm PVC spares in stock.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-100 shadow-xs">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#2d130a]">
                      Master Bedroom AC Gas Charge & Service
                    </span>
                    <Badge variant="success" size="sm">
                      Work In Progress
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-[#f05a28]" />
                    Scheduled today • 2:00 PM
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-600">
                  ₹1,499 in Escrow
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#fffaf5] p-3 border border-orange-100">
                <div className="flex items-center gap-3">
                  <Avatar name="Rajesh Kumar" size="sm" status="online" />
                  <div>
                    <p className="text-xs font-semibold text-[#2d130a]">
                      Rajesh Kumar (CoolAir Solutions Ameerpet)
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      4.9 ★ (142 jobs) • Arriving in 25 mins
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Track Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* HomePass & Quick Stats (1 col) */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#2d130a]">
            HomePass Digital Passport
          </h3>

          <Card variant="glass" className="border-2 border-orange-200/80 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#f05a28]" />
                  <CardTitle className="text-sm text-[#2d130a]">Apartment 402, Sea Green</CardTitle>
                </div>
                <Badge variant="brand" size="sm">
                  Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Home Health Score</span>
                  <span className="font-bold text-emerald-600">92 / 100</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100">
                  <div className="h-full w-[92%] rounded-full bg-emerald-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-2">
                <div className="rounded-xl bg-[#fffaf5] p-2.5 border border-orange-100">
                  <span className="block text-xs font-bold text-[#2d130a]">
                    6
                  </span>
                  <span className="text-[10px] text-neutral-500">Service Records</span>
                </div>
                <div className="rounded-xl bg-[#fffaf5] p-2.5 border border-orange-100">
                  <span className="block text-xs font-bold text-[#2d130a]">
                    3
                  </span>
                  <span className="text-[10px] text-neutral-500">Active Warranties</span>
                </div>
              </div>

              <Link href="/customer/homepass" className="block w-full">
                <Button size="sm" variant="secondary" fullWidth>
                  Open HomePass
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
