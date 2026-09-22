"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, ShieldCheck, CheckCircle2, User, Wrench, FileText, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface DisputeItem {
  _id: string;
  jobId: string;
  paymentId: string;
  customerId: string;
  professionalId: string;
  customerName: string;
  professionalName: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
  resolutionNote?: string;
}

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<DisputeItem | null>(null);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/disputes");
      const data = await res.json();
      if (data.success) {
        setDisputes(data.disputes || []);
        if (data.disputes?.length > 0) {
          setSelectedDispute(data.disputes[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (outcome: "resolved_for_customer" | "resolved_for_professional" | "resolved_partial") => {
    if (!selectedDispute) return;
    try {
      setResolving(true);
      const note = window.prompt("Enter arbitration notes for the immutable audit trail:", `Arbitrated with outcome: ${outcome}`);
      const res = await fetch("/api/admin/disputes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disputeId: selectedDispute._id,
          resolution: outcome,
          resolutionNote: note || "Arbitrated by Administrator",
          refundAmountPaise: outcome === "resolved_for_customer" ? 328000 : 164000,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Dispute ${selectedDispute._id} successfully settled!`);
        fetchDisputes();
      }
    } catch (err) {
      alert("Failed to resolve dispute");
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispute Arbitration Desk"
        description="3-way mediation workbench comparing customer claim, technician statement, and visual InspectAI proof."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Disputes" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Dispute List (1 col) */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Active Disputes ({disputes.length})
          </div>
          {disputes.map((d) => (
            <Card
              key={d._id}
              onClick={() => setSelectedDispute(d)}
              className={`cursor-pointer transition ${
                selectedDispute?._id === d._id
                  ? "border-[#f05a28] bg-neutral-50 dark:bg-neutral-800/80"
                  : "hover:border-neutral-700"
              }`}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-neutral-400 font-bold">{d._id}</span>
                  <Badge
                    variant={d.status === "open" || d.status === "under_review" ? "destructive" : "success"}
                    size="sm"
                  >
                    {d.status.toUpperCase()}
                  </Badge>
                </div>
                <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 line-clamp-1">
                  {d.reason}
                </h4>
                <div className="text-[11px] text-neutral-500">
                  {d.customerName} vs {d.professionalName}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right 2 Cols: Arbitration Workbench */}
        {selectedDispute ? (
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-sm">
                      Case #{selectedDispute._id} • Job #{selectedDispute.jobId}
                    </CardTitle>
                  </div>
                  <Badge variant="warning" size="sm">
                    Escrow Frozen: ₹3,280
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-5 text-xs">
                {/* Claims Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-red-600 dark:text-red-400">
                      <User className="h-4 w-4" />
                      <span>Customer Claim ({selectedDispute.customerName})</span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {selectedDispute.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
                      <Wrench className="h-4 w-4" />
                      <span>Specialist Defense ({selectedDispute.professionalName})</span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      "Installed OEM 45µF motor capacitor as specified in SOW v1. Pre-work baseline captured; compressor tested nominal on arrival. Root cause may be voltage unbalance in building grid."
                    </p>
                  </div>
                </div>

                {/* InspectAI Automated Proof Audit */}
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      InspectAI Proof Audit &amp; Telemetry
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500">TL-PROOF-7F89B2</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    Vision comparison verifies that OEM component was installed. However, audio telemetry from post-work video indicates compressor cycling off at t=14m. Partial refund or warranty recall recommended.
                  </p>
                </div>

                {/* Arbitration Decision Bar */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Administrative Arbitration Actions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="brand"
                      disabled={resolving}
                      onClick={() => handleResolve("resolved_for_customer")}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Full Refund to Customer (₹3,280)
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={resolving}
                      onClick={() => handleResolve("resolved_partial")}
                    >
                      50/50 Split Settlement (₹1,640 Each)
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={resolving}
                      onClick={() => handleResolve("resolved_for_professional")}
                    >
                      Release Escrow to Pro (Reject Claim)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center p-12 text-xs text-neutral-400 border border-dashed rounded-2xl">
            Select a dispute from the left list to review proof.
          </div>
        )}
      </div>
    </div>
  );
}
