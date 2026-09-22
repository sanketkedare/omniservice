"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Phone,
  ShieldCheck,
  Video,
  AlertCircle,
  Banknote,
  Wrench,
  ChevronRight,
  User,
  Truck,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { getMockRequestById, DEMO_REQUESTS } from "@/lib/mock-data";

export default function RequestTrackingPage() {
  const params = useParams();
  const requestId = params?.id as string;
  const [request, setRequest] = useState(() => getMockRequestById(requestId) || DEMO_REQUESTS[0]!);

  const [isReleased, setIsReleased] = useState(false);
  const [releasing, setReleasing] = useState(false);

  useEffect(() => {
    if (!requestId) return;
    const local = getMockRequestById(requestId);
    if (local) {
      setRequest(local);
      if (local.status === "completed") {
        setIsReleased(true);
      }
    }

    fetch(`/api/service-requests/${requestId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setRequest(data.data);
          if (data.data.status === "completed") {
            setIsReleased(true);
          }
        }
      })
      .catch(() => {});
  }, [requestId]);

  const handleReleaseEscrow = async () => {
    try {
      setReleasing(true);
      const res = await fetch("/api/escrow/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: "job_001",
          paymentId: "pay_001",
          customerId: "user_cust_001",
          rating: 5,
          reviewNote: "Work verified by InspectAI. Technician did a clean job.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsReleased(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReleasing(false);
    }
  };

  const handleRaiseDispute = async () => {
    const reason = window.prompt("Please state the reason for disputing this repair:");
    if (!reason) return;
    try {
      const res = await fetch("/api/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: "job_001",
          paymentId: "pay_001",
          customerId: "user_cust_001",
          reason,
          description: `Customer dispute lodged via Request Tracker: ${reason}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Dispute lodged successfully. Escrow funds have been frozen.");
      }
    } catch (err) {
      alert("Failed to submit dispute.");
    }
  };

  const stages = [
    { id: "submitted", label: "Intake Submitted", desc: "Video & description received", done: true },
    { id: "analyzing", label: "InspectAI Diagnostics", desc: "Vision & audio inference", done: true },
    { id: "sow_ready", label: "Scope & Pricing Locked", desc: "Parts & labor calculated", done: true },
    { id: "matching", label: "SmartRoute Match", desc: "Van inventory verified", done: request.status === "booked" || request.status === "completed" },
    { id: "booked", label: "Technician Dispatched", desc: "En route with OEM parts", done: request.status === "booked" || request.status === "completed" },
    { id: "verification", label: "TrustLock Verification", desc: "Before & after evidence checked", done: request.status === "completed" },
    { id: "completed", label: "Escrow Released", desc: "Warranty activated in HomePass", done: request.status === "completed" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      {/* Header */}
      <PageHeader
        title={`Live Tracker: ${request.requestNumber || "SR-2026-0819"}`}
        description={request.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Requests", href: "/customer/requests" },
          { label: request.requestNumber || "Detail" },
        ]}
        actions={
          <Badge variant="brand" size="lg" dot>
            {request.status.replace("_", " ").toUpperCase()}
          </Badge>
        }
      />

      {/* Progress Timeline Ribbon */}
      <Card className="overflow-hidden border-neutral-200/80 dark:border-neutral-800">
        <CardContent className="p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6">
            Service Progression Lifecycle
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 relative">
            {stages.map((stage, idx) => (
              <div key={stage.id} className="flex md:flex-col items-center md:items-start gap-3 md:gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs transition-all ${
                    stage.done
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"
                  }`}
                >
                  {stage.done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                </div>
                <div>
                  <span
                    className={`block text-xs font-bold ${
                      stage.done
                        ? "text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-400"
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="text-[10px] text-neutral-400 hidden sm:block">
                    {stage.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: InspectAI Findings + Evidence + Technician */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: SOW & AI Diagnostics (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* InspectAI Findings Card */}
          <Card className="border-[#f05a28]/30 shadow-md">
            <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#f05a28]" />
                  <CardTitle className="text-base">InspectAI Diagnostic Analysis</CardTitle>
                </div>
                <Badge variant="brand" size="sm">
                  {Math.round((request.aiFindings?.[0]?.confidence || 0.94) * 100)}% Confidence
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-4 border border-neutral-100 dark:border-neutral-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Detected Root Cause
                </span>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {request.aiFindings?.[0]?.component || request.title || "Identified Assembly Defect"}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {request.aiFindings?.[0]?.issue || request.description || "Computer vision and acoustic spectrum diagnostic inference completed."}
                </p>
              </div>

              {/* Required Spares & Labor */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Required Parts &amp; Consumables
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 p-2.5">
                    <span>{request.aiFindings?.[0]?.requiredPart || "32mm Beveled Washer & Seal"}</span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">₹80</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 p-2.5">
                    <span>PTFE High-Density Thread Seal</span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">₹60</span>
                  </div>
                </div>
              </div>

              {/* SOW & Price Ceiling CTA */}
              <div className="pt-2">
                <Link href={`/customer/requests/${requestId}/sow`} className="block">
                  <Button variant="brand" size="sm" className="w-full font-bold shadow-xs">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Review Itemized Scope &amp; Lock Price Ceiling
                    <ChevronRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Customer Media Attachments */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-[#f05a28]" />
                <CardTitle className="text-sm">Uploaded Diagnostic Media</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center">
                {request.media && request.media.length > 0 && request.media[0].type === "video" ? (
                  <video
                    src={request.media[0].url}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={
                      request.media && request.media.length > 0 && request.media[0].url
                        ? request.media[0].url
                        : "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200"
                    }
                    alt={request.title || "Diagnostic evidence"}
                    className="h-full w-full object-cover opacity-90"
                  />
                )}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg text-white">
                  <span className="text-xs font-semibold block">
                    {request.media?.[0]?.filename || "evidence_photo.jpg"}
                  </span>
                  <span className="text-[10px] text-neutral-300">
                    Hyderabad, Telangana • GPS Geotagged
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Escrow & Assigned Pro (1 col) */}
        <div className="space-y-6">
          {/* Escrow Status Card */}
          <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-emerald-600" />
                  <CardTitle className="text-sm">TrustLock™ Escrow</CardTitle>
                </div>
                <Badge variant={isReleased ? "success" : "warning"} size="sm">
                  {isReleased ? "Released to Provider" : "In Escrow"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-200/50 dark:border-neutral-800">
                <span className="text-neutral-500">Labor (35 mins)</span>
                <span className="font-mono font-medium">₹1,400</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/50 dark:border-neutral-800">
                <span className="text-neutral-500">OEM Parts &amp; Seals</span>
                <span className="font-mono font-medium">₹140</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/50 dark:border-neutral-800">
                <span className="text-neutral-500">Platform Guarantee Fee</span>
                <span className="font-mono font-medium">₹310</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-sm text-neutral-900 dark:text-neutral-100">
                <span>Total Escrow Balance</span>
                <span className="font-mono text-emerald-600">₹1,850</span>
              </div>

              {/* TrustLock Visual Verification Badge */}
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    InspectAI Verified (94%)
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                    TL-PROOF-7F89B2
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-300">
                  Pre-work baseline &amp; post-work dry joint flow tests verified.
                </p>
              </div>

              {/* Release Escrow CTA */}
              {!isReleased ? (
                <div className="space-y-2 pt-1">
                  <Button
                    size="sm"
                    variant="brand"
                    fullWidth
                    disabled={releasing}
                    onClick={handleReleaseEscrow}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    {releasing ? "Authorizing Release..." : "✓ Confirm Completion & Release Escrow"}
                  </Button>
                  <button
                    type="button"
                    onClick={handleRaiseDispute}
                    className="w-full text-center text-[11px] text-neutral-400 hover:text-red-400 transition underline"
                  >
                    Report an Issue / Raise Dispute
                  </button>
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center font-bold text-xs">
                  ✓ Funds released to technician. Thank you!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Technician Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Assigned Professional</CardTitle>
                <Badge variant="brand" size="sm">
                  SmartRoute Match
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="flex items-center gap-3">
                <Avatar name="Rajesh Kumar" size="md" status="online" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Rajesh Kumar
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    CoolAir &amp; Plumbing Solutions • 4.9 ★ (142 reviews)
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-3 text-xs space-y-1.5 border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <Truck className="h-3.5 w-3.5 text-[#f05a28]" />
                  <span>Service Van: TS-09-UB-4120</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Required 32mm washers confirmed in van inventory</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" fullWidth leftIcon={<Phone className="h-3.5 w-3.5" />}>
                  Call Masked
                </Button>
                <Button size="sm" variant="brand" fullWidth>
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
