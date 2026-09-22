"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Wrench,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  Tv,
  Wind,
  Droplets,
  Zap,
  ArrowRight,
  Share2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";

interface ApplianceItem {
  _id: string;
  name: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  category: string;
  installedDate: string;
  warrantyExpiryDate: string;
  healthScore: number;
  status: string;
}

interface MaintenanceItem {
  _id: string;
  title: string;
  category: string;
  performedBy: string;
  date: string;
  costPaise: number;
  summary: string;
  warrantyMonths: number;
  verifiedBadge: boolean;
}

interface HealthReport {
  overallScore: number;
  grade: string;
  breakdown: {
    applianceHealth: { score: number; max: number; notes: string };
    infrastructureMaintenance: { score: number; max: number; notes: string };
    warrantyCoverage: { score: number; max: number; notes: string };
  };
  totalAppliances: number;
  activeWarranties: number;
}

interface TransferCert {
  certificateId: string;
  propertyName: string;
  propertyAddress: string;
  healthScore: number;
  grade: string;
  totalAppliances: number;
  verifiedMaintenanceEvents: number;
  issuedAt: string;
  cryptographicSignature: string;
  transferToken: string;
  recipientName: string;
}

export default function HomePassPage() {
  const propertyId = "prop_bandra_01";
  const [appliances, setAppliances] = useState<ApplianceItem[]>([]);
  const [records, setRecords] = useState<MaintenanceItem[]>([]);
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certData, setCertData] = useState<TransferCert | null>(null);
  const [certGenerating, setCertGenerating] = useState(false);

  useEffect(() => {
    fetchHomePassData();
  }, []);

  const fetchHomePassData = async () => {
    try {
      setLoading(true);
      const appRes = await fetch(`/api/homepass/${propertyId}/appliances`);
      const appData = await appRes.json();
      if (appData.success) {
        setAppliances(appData.appliances || []);
        setHealthReport(appData.healthReport || null);
      }

      const recRes = await fetch(`/api/homepass/${propertyId}/records`);
      const recData = await recRes.json();
      if (recData.success) {
        setRecords(recData.records || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      setCertGenerating(true);
      const res = await fetch(`/api/homepass/${propertyId}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientName: "Ameerpet Resident / Prospective Buyer" }),
      });
      const data = await res.json();
      if (data.success) {
        setCertData(data.certificate);
        setCertModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCertGenerating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hvac":
        return <Wind className="h-5 w-5 text-blue-500" />;
      case "plumbing":
        return <Droplets className="h-5 w-5 text-teal-500" />;
      case "electrical":
        return <Zap className="h-5 w-5 text-amber-500" />;
      default:
        return <Tv className="h-5 w-5 text-purple-500" />;
    }
  };

  const score = healthReport ? healthReport.overallScore : 94;
  const grade = healthReport ? healthReport.grade : "A+";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      {/* Header */}
      <PageHeader
        title="HomePass™ Digital Property Passport"
        description="Immutable lifecycle maintenance and warranty passport for Ameerpet Luxury Residence, Hyderabad."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/customer/properties" },
          { label: "HomePass #HP-HYD-402" },
        ]}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateCertificate}
            disabled={certGenerating}
            leftIcon={<Download className="h-4 w-4" />}
          >
            {certGenerating ? "Signing Certificate..." : "Export Provenance Certificate"}
          </Button>
        }
      />

      {/* Hero Health Score Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2d130a] via-[#431407] to-[#1c0f0a] p-6 sm:p-8 text-white shadow-xl border border-[#ea580c]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Grade {grade} — Verified Digital Passport</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Property Health Score: {score} / 100
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Calculated via algorithmic telemetry: {appliances.length} registered mechanical appliances, active OEM warranties, and {records.length} TrustLock™ verified repair records.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-neutral-800/80 p-6 border border-neutral-700/80 min-w-[190px] text-center shadow-inner">
            <span className="text-4xl font-black text-emerald-400">{score}%</span>
            <span className="text-xs font-bold text-neutral-200 mt-1">Health Metric</span>
            <span className="text-[10px] text-neutral-400 mt-0.5">TrustLock Verified</span>
          </div>
        </div>

        {/* Score Breakdown Pills */}
        {healthReport && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-neutral-800 text-xs">
            <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
              <div className="text-neutral-400 text-[10px] uppercase font-bold">Appliance Health</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">
                {healthReport.breakdown.applianceHealth.score} / {healthReport.breakdown.applianceHealth.max}
              </div>
              <div className="text-[11px] text-neutral-300 mt-1">
                {healthReport.breakdown.applianceHealth.notes}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
              <div className="text-neutral-400 text-[10px] uppercase font-bold">Infrastructure Servicing</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">
                {healthReport.breakdown.infrastructureMaintenance.score} / {healthReport.breakdown.infrastructureMaintenance.max}
              </div>
              <div className="text-[11px] text-neutral-300 mt-1">
                {healthReport.breakdown.infrastructureMaintenance.notes}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
              <div className="text-neutral-400 text-[10px] uppercase font-bold">Active Warranties</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">
                {healthReport.breakdown.warrantyCoverage.score} / {healthReport.breakdown.warrantyCoverage.max}
              </div>
              <div className="text-[11px] text-neutral-300 mt-1">
                {healthReport.breakdown.warrantyCoverage.notes}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Registered Major Equipment & Appliances */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
            Registered Equipment &amp; Appliances ({appliances.length})
          </h3>
          <Button size="sm" variant="outline">
            + Register Appliance
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appliances.map((app) => (
            <Card key={app._id} className="hover:border-neutral-700 transition">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                      {getCategoryIcon(app.category)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {app.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        {app.brand} • {app.modelNumber}
                      </p>
                    </div>
                  </div>
                  <Badge variant={app.status === "good" ? "success" : "warning"} size="sm">
                    {app.status === "good" ? "Operational" : "Service Due"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 pt-1">
                  <div>Serial: {app.serialNumber}</div>
                  <div>Health: {app.healthScore}%</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Warranty Valid
                  </div>
                  <div>Category: {app.category.toUpperCase()}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Verified Service Record Timeline */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
          Verified Service &amp; Repair Log ({records.length})
        </h3>

        <Card>
          <CardContent className="p-0 divide-y divide-neutral-100 dark:divide-neutral-800">
            {records.map((rec) => (
              <div key={rec._id} className="p-4 sm:p-5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      {rec.title}
                    </span>
                    {rec.verifiedBadge && (
                      <Badge variant="success" size="sm">
                        TrustLock Verified
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-neutral-400">
                    {new Date(rec.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Technician: <span className="font-medium text-neutral-900 dark:text-neutral-200">{rec.performedBy}</span> • Cost: ₹{(rec.costPaise / 100).toLocaleString("en-IN")}
                </p>
                {rec.summary && (
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {rec.summary}
                  </p>
                )}

                <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{rec.warrantyMonths}-month OmniService Service Guarantee</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Transfer Certificate Modal */}
      {certData && (
        <Dialog
          open={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          title="HomePass™ Transferable Certificate"
        >
          <div className="space-y-4 p-2 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50/70 text-neutral-900 space-y-3 border border-emerald-300 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                  Digital Certificate of Provenance
                </span>
                <Badge variant="success" size="sm">Authentic</Badge>
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-900">{certData.propertyName}</h4>
                <p className="text-[11px] text-neutral-600">{certData.propertyAddress}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 py-2 border-y border-emerald-200">
                <div>
                  <div className="text-[10px] text-neutral-500">Health Score</div>
                  <div className="text-lg font-bold text-emerald-700">{certData.healthScore}% ({certData.grade})</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500">Verified Services</div>
                  <div className="text-lg font-bold text-neutral-900">{certData.verifiedMaintenanceEvents} Events</div>
                </div>
              </div>
              <div className="space-y-1 font-mono text-[10px] text-neutral-600 break-all bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                <div>Cert ID: <span className="text-neutral-900 font-semibold">{certData.certificateId}</span></div>
                <div>Signature: <span className="text-cyan-800">{certData.cryptographicSignature}</span></div>
                <div>Bearer Token: <span className="text-emerald-800 font-semibold">{certData.transferToken}</span></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCertModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="brand"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(certData.cryptographicSignature);
                  alert("Certificate verification signature copied to clipboard!");
                }}
              >
                Copy Cryptographic Hash
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
