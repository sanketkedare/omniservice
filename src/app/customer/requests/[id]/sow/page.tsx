"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  Package,
  FileText,
  UserCheck,
  ChevronLeft,
  ArrowRight,
  Info,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Lock,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/lib/utils";

interface SOWData {
  _id: string;
  serviceRequestId: string;
  version: number;
  problemTitle: string;
  problemDescription: string;
  likelyRootCause: string;
  confidence: number;
  lineItems: {
    description: string;
    type: "labor" | "material" | "platform_fee";
    quantity: number;
    unitPricePaise: number;
    totalPricePaise: number;
  }[];
  requiredParts: {
    name: string;
    sku?: string;
    quantity: number;
    estimatedUnitCostPaise: number;
    isRequired: boolean;
  }[];
  estimatedDurationMinutes: {
    min: number;
    max: number;
  };
  riskFlags: string[];
  conditions: string[];
  status: string;
  subtotalPaise: number;
  taxPaise: number;
  totalPaise: number;
  customerApprovedAt?: string;
}

interface EstimateData {
  _id: string;
  baseLaborPaise: number;
  partsTotalPaise: number;
  platformFeePaise: number;
  taxPaise: number;
  totalPaise: number;
  guaranteedCeilingPaise: number;
  priceBreakdown?: {
    laborMinutes: number;
    effectiveHourlyRatePaise: number;
  };
}

interface ChangeOrderItem {
  _id: string;
  title: string;
  reason: string;
  discoveryDescription: string;
  additionalWorkDescription: string;
  additionalPartsPaise: number;
  additionalLaborPaise: number;
  additionalTotalPaise: number;
  originalTotalPaise: number;
  newTotalPaise: number;
  status: "submitted" | "approved" | "declined";
  expiresAt: string;
}

export default function SOWReviewPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [sow, setSow] = useState<SOWData | null>(null);
  const [estimate, setEstimate] = useState<EstimateData | null>(null);
  const [changeOrders, setChangeOrders] = useState<ChangeOrderItem[]>([]);
  const [isApproving, setIsApproving] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState("");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;

    // 1. Fetch SOW
    fetch(`/api/sow/${requestId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSow(data.sow);
          setEstimate(data.estimate);
        } else {
          // If no SOW found yet, try to run InspectAI on-demand
          fetch(`/api/diagnostics/run`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId }),
          })
            .then((r) => r.json())
            .then((diag) => {
              if (diag.success && diag.sowId) {
                return fetch(`/api/sow/${diag.sowId}`).then((r) => r.json());
              }
            })
            .then((refetched) => {
              if (refetched?.success) {
                setSow(refetched.sow);
                setEstimate(refetched.estimate);
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        setActionErrorMessage("Failed to load Scope of Work. Please try again.");
      })
      .finally(() => setLoading(false));

    // 2. Fetch any pending Change Orders
    fetch(`/api/change-orders?scopeOfWorkId=${requestId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.changeOrders) {
          setChangeOrders(data.changeOrders);
        }
      })
      .catch(() => {});
  }, [requestId]);

  const handleApproveSow = async () => {
    if (!sow) return;
    setIsApproving(true);
    setActionErrorMessage(null);

    try {
      const res = await fetch(`/api/sow/${sow._id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.success) {
        setSow((prev) => (prev ? { ...prev, status: "approved", customerApprovedAt: new Date().toISOString() } : null));
        setActionSuccessMessage("Scope of Work approved! Escrow ceiling locked. Routing nearest qualified technician...");
        setTimeout(() => {
          router.push(`/customer/requests/${requestId}`);
        }, 2000);
      } else {
        setActionErrorMessage(data.error || "Approval failed. Please try again.");
      }
    } catch {
      setActionErrorMessage("Network error during approval.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleEscalate = async () => {
    if (!sow) return;
    setIsEscalating(true);
    setActionErrorMessage(null);

    try {
      const res = await fetch(`/api/sow/${sow._id}/escalate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: escalateReason }),
      });
      const data = await res.json();

      if (data.success) {
        setEscalateModalOpen(false);
        setActionSuccessMessage("Review escalated! A Master Technician will audit the diagnosis within 30 minutes.");
      } else {
        setActionErrorMessage(data.error || "Escalation failed.");
      }
    } catch {
      setActionErrorMessage("Network error during escalation.");
    } finally {
      setIsEscalating(false);
    }
  };

  const handleApproveChangeOrder = async (coId: string) => {
    try {
      const res = await fetch(`/api/change-orders/${coId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMessage("Change order approved! Revised scope updated.");
        // Refetch SOW
        const sowRes = await fetch(`/api/sow/${requestId}`);
        const sowData = await sowRes.json();
        if (sowData.success) {
          setSow(sowData.sow);
          setEstimate(sowData.estimate);
        }
        setChangeOrders((prev) =>
          prev.map((co) => (co._id === coId ? { ...co, status: "approved" } : co))
        );
      }
    } catch {
      setActionErrorMessage("Failed to approve change order.");
    }
  };

  const handleDeclineChangeOrder = async (coId: string) => {
    try {
      const res = await fetch(`/api/change-orders/${coId}/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Customer elected to keep original scope." }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMessage("Change order declined. Work continues under original scope.");
        setChangeOrders((prev) =>
          prev.map((co) => (co._id === coId ? { ...co, status: "declined" } : co))
        );
      }
    } catch {
      setActionErrorMessage("Failed to decline change order.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <Spinner size="xl" />
        <p className="text-sm font-medium text-neutral-500">
          Loading InspectAI Scope of Work &amp; Pricing Guarantee...
        </p>
      </div>
    );
  }

  // Fallback demo SOW for direct preview if none exists in DB
  const displaySow: SOWData = sow || {
    _id: "sow_demo_01",
    serviceRequestId: requestId || "sr_demo",
    version: 1,
    problemTitle: "Kitchen Sink P-Trap Slip Joint Leak & Extrusion",
    problemDescription:
      "InspectAI diagnostic identified extrusion of rubber slip gasket and hairline thread crack at the sink tailpiece connection causing leak rate of ~1.2 Hz.",
    likelyRootCause:
      "Gasket degradation from caustic cleaning agent exposure combined with overtightened slip nut.",
    confidence: 0.94,
    lineItems: [
      {
        description: "1. Inspect & Disassemble: Remove tailpiece and isolate slip-joint threads",
        type: "labor",
        quantity: 1,
        unitPricePaise: 35000,
        totalPricePaise: 35000,
      },
      {
        description: "2. Gasket Replacement & Re-alignment: Install OEM beveled washer & thread seal",
        type: "labor",
        quantity: 1,
        unitPricePaise: 35000,
        totalPricePaise: 35000,
      },
      {
        description: "3. Hydrostatic Pressure Test: Verify seal under 5-minute continuous maximum flow",
        type: "labor",
        quantity: 1,
        unitPricePaise: 30000,
        totalPricePaise: 30000,
      },
      {
        description: "32mm Beveled Heavy-Duty Washer (Pack of 2)",
        type: "material",
        quantity: 1,
        unitPricePaise: 8000,
        totalPricePaise: 8000,
      },
      {
        description: "High-Density PTFE Thread Seal Tape (12mm x 10m)",
        type: "material",
        quantity: 1,
        unitPricePaise: 6000,
        totalPricePaise: 6000,
      },
      {
        description: "TrustLock Escrow Protection & 90-Day Guarantee Fee",
        type: "platform_fee",
        quantity: 1,
        unitPricePaise: 13680,
        totalPricePaise: 13680,
      },
    ],
    requiredParts: [
      { name: "32mm Beveled Washer", sku: "FL-PLB-WASH-32", quantity: 1, estimatedUnitCostPaise: 8000, isRequired: true },
      { name: "PTFE Thread Seal Tape", sku: "FL-PLB-TAPE-12", quantity: 1, estimatedUnitCostPaise: 6000, isRequired: true },
    ],
    estimatedDurationMinutes: { min: 35, max: 60 },
    riskFlags: [
      "Corrosion on neighboring galvanized pipe may require careful handling.",
      "Any hidden wall leakage discovered on-site requires a digital Change Order approval.",
    ],
    conditions: [
      "Price ceiling guaranteed. If technician takes longer, ForgeLocal absorbs the cost.",
      "Work includes 90-day comprehensive TrustLock re-work guarantee.",
    ],
    status: "pending_customer_review",
    subtotalPaise: 127680,
    taxPaise: 22982,
    totalPaise: 150662,
  };

  const isApproved = displaySow.status === "approved";
  const confidencePercent = Math.round((displaySow.confidence || 0.9) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/customer/requests/${requestId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Live Tracker
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant={isApproved ? "success" : "brand"} dot size="sm">
            {isApproved ? "SCOPE APPROVED" : "PENDING YOUR APPROVAL"}
          </Badge>
          <span className="text-xs text-neutral-400">Rev v{displaySow.version}</span>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccessMessage && (
        <Alert variant="success" title="Success">
          {actionSuccessMessage}
        </Alert>
      )}
      {actionErrorMessage && (
        <Alert variant="destructive" title="Notice">
          {actionErrorMessage}
        </Alert>
      )}

      {/* Pending Change Order Banner */}
      {changeOrders.some((co) => co.status === "submitted") && (
        <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/10 p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  On-Site Change Order Requested by Technician
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
                  The professional discovered additional required repair work while on-site.
                </p>
              </div>
            </div>
            <Badge variant="warning">Action Required</Badge>
          </div>

          {changeOrders
            .filter((co) => co.status === "submitted")
            .map((co) => (
              <div
                key={co._id}
                className="rounded-xl bg-white dark:bg-neutral-900 p-4 border border-amber-200 dark:border-amber-800 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{co.title}</h5>
                    <p className="text-xs text-neutral-500 mt-1">{co.discoveryDescription}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-400">Additional Delta</span>
                    <p className="text-sm font-mono font-bold text-amber-600">
                      +{formatCurrency(co.additionalTotalPaise)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400">
                    Revised Total: <strong className="text-neutral-700 dark:text-neutral-200">{formatCurrency(co.newTotalPaise)}</strong>
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleDeclineChangeOrder(co._id)}>
                      Decline
                    </Button>
                    <Button size="sm" variant="brand" onClick={() => handleApproveChangeOrder(co._id)}>
                      Approve &amp; Authorize Escrow
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Diagnostic Scope of Work & Guaranteed Pricing"
        description="InspectAI multimodal analysis has determined the root cause, required parts, and deterministic price ceiling for your service request."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEscalateModalOpen(true)}
              disabled={isApproved}
            >
              <HelpCircle className="h-4 w-4 mr-1.5" />
              Request Master Review
            </Button>
            {!isApproved && (
              <Button
                variant="brand"
                size="sm"
                onClick={handleApproveSow}
                disabled={isApproving}
              >
                {isApproving ? <Spinner size="sm" className="mr-2" /> : <Lock className="h-4 w-4 mr-1.5" />}
                Approve &amp; Lock Price
              </Button>
            )}
          </div>
        }
      />

      {/* Hero Pricing Guarantee Card */}
      <Card className="border-2 border-[#f05a28]/40 shadow-lg relative overflow-hidden bg-gradient-to-br from-white via-white to-orange-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-[#f05a28]/10">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-[#f05a28]/10 rounded-full blur-2xl pointer-events-none" />
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#f05a28]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#f05a28]">
                  TrustLock Guaranteed Price Ceiling
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
                {formatCurrency(displaySow.totalPaise)}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Inclusive of OEM Parts, Certified Labor, TrustLock Escrow, and 18% GST.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                  AI Diagnostic Confidence
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {confidencePercent}% High Confidence
                </span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Pricing Breakdown Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Deterministic Cost Itemization
            </h3>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white/70 dark:bg-neutral-950/40">
              {displaySow.lineItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    {item.type === "labor" ? (
                      <Wrench className="h-4 w-4 text-blue-500 shrink-0" />
                    ) : item.type === "material" ? (
                      <Package className="h-4 w-4 text-amber-500 shrink-0" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 text-[#f05a28] shrink-0" />
                    )}
                    <div>
                      <span className="font-medium text-neutral-900 dark:text-neutral-100 block">
                        {item.description}
                      </span>
                      <span className="text-[11px] text-neutral-400 capitalize">
                        {item.type === "material" ? "OEM Part" : item.type === "labor" ? "Certified Labor" : "Platform Protection"}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(item.totalPricePaise)}
                  </span>
                </div>
              ))}

              {/* Subtotal, Tax, Total */}
              <div className="bg-neutral-50 dark:bg-neutral-900/60 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatCurrency(displaySow.subtotalPaise)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>GST (18% Statutory)</span>
                  <span className="font-mono">{formatCurrency(displaySow.taxPaise)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-neutral-100 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span>Guaranteed Price Ceiling</span>
                  <span className="font-mono text-[#f05a28]">{formatCurrency(displaySow.totalPaise)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee Guarantee Banner */}
          <div className="flex items-start gap-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200/60 dark:border-blue-900/40">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              <strong>OmniService Escrow Guarantee:</strong> Once approved, the technician cannot charge a single rupee more for this scope. If unexpected obstacles arise inside walls or foundations, no work proceeds without an explicit photographic Change Order approved by you.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnostic & Task Execution Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Diagnostic Findings & Task Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Diagnostic Root Cause */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#f05a28]" />
                <CardTitle className="text-sm">AI Diagnostic Assessment</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Identified Problem
                </span>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {displaySow.problemTitle}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
                  {displaySow.problemDescription}
                </p>
              </div>

              <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/40 p-4 border border-neutral-100 dark:border-neutral-800 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Likely Root Cause
                </span>
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-200 leading-relaxed">
                  {displaySow.likelyRootCause}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Task Checklist */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-[#f05a28]" />
                  <CardTitle className="text-sm">Mandatory Execution Checklist</CardTitle>
                </div>
                <span className="text-xs text-neutral-400">
                  Est. {displaySow.estimatedDurationMinutes.min}–{displaySow.estimatedDurationMinutes.max} min
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {displaySow.lineItems
                .filter((item) => item.type === "labor")
                .map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3.5 bg-white dark:bg-neutral-900"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f05a28]/10 text-[#f05a28] font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span>Requires Journeyman Certification</span>
                        <span>•</span>
                        <span>Pre &amp; Post Photo Verification</span>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Risk Flags & Precautionary Conditions */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-sm">Risk Flags &amp; Scope Conditions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-2">
              {displaySow.riskFlags.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{risk}</span>
                </div>
              ))}
              {displaySow.conditions.map((cond, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#f05a28] mt-1.5 shrink-0" />
                  <span>{cond}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Required Parts & Actions */}
        <div className="space-y-6">
          {/* Required OEM Parts */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#f05a28]" />
                <CardTitle className="text-sm">Required OEM Parts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {displaySow.requiredParts.map((part, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-1"
                >
                  <div className="flex justify-between text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    <span>{part.name}</span>
                    <span className="font-mono text-[#f05a28]">{formatCurrency(part.estimatedUnitCostPaise)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>SKU: {part.sku || "OEM-STD"}</span>
                    <span>Qty: {part.quantity}</span>
                  </div>
                </div>
              ))}

              <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">
                Technicians matched via SmartRoute are required to carry these exact OEM components on their vehicle before dispatch.
              </p>
            </CardContent>
          </Card>

          {/* Action Decision Card */}
          <Card className="border-[#f05a28]/30 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Authorize &amp; Proceed</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <p className="text-xs text-neutral-500 leading-relaxed">
                By approving, you authorize the price ceiling of <strong>{formatCurrency(displaySow.totalPaise)}</strong> to be held in TrustLock Escrow. No funds are transferred to the technician until you review and verify the post-repair evidence.
              </p>

              <div className="space-y-2">
                {isApproved ? (
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 text-center space-y-2">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                      Scope Approved
                    </p>
                    <Link href={`/customer/requests/${requestId}`}>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        View Live Job Telemetry
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="brand"
                      size="lg"
                      className="w-full font-bold shadow-md shadow-orange-500/20"
                      onClick={handleApproveSow}
                      disabled={isApproving}
                    >
                      {isApproving ? <Spinner size="sm" className="mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                      Approve Scope &amp; Lock Price
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setEscalateModalOpen(true)}
                    >
                      Question Diagnosis / Speak to Master Tech
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Human Escalation Dialog Modal */}
      <Dialog
        open={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        title="Request Master Technician Review"
        description="If you believe InspectAI misidentified the component or missed related symptoms, our certified trade supervisors will review your photos and video."
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Reason for Review
            </label>
            <textarea
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 text-xs focus:ring-2 focus:ring-[#f05a28] outline-none"
              rows={4}
              placeholder="e.g. The leak also seems to come from the wall shutoff valve, not just the slip joint..."
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setEscalateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={handleEscalate}
              disabled={isEscalating || !escalateReason.trim()}
            >
              {isEscalating ? <Spinner size="sm" className="mr-1.5" /> : null}
              Submit for Human Review
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
