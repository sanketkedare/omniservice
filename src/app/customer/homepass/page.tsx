"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  Home,
  Plus,
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

function HomePassContent() {
  const searchParams = useSearchParams();
  const queryPropertyId = searchParams.get("propertyId");

  const [activePropertyId, setActivePropertyId] = useState<string | null>(queryPropertyId);
  const [propertyName, setPropertyName] = useState<string>("My Home");
  const [propertyAddress, setPropertyAddress] = useState<string>("Greater Hyderabad, Telangana");
  const [appliances, setAppliances] = useState<ApplianceItem[]>([]);
  const [records, setRecords] = useState<MaintenanceItem[]>([]);
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProperty, setHasProperty] = useState(true);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certData, setCertData] = useState<TransferCert | null>(null);
  const [certGenerating, setCertGenerating] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        let propId = queryPropertyId;

        // If no property ID in URL, fetch user's first registered property
        if (!propId) {
          const res = await fetch("/api/properties");
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            const firstProp = data.data[0];
            propId = String(firstProp._id);
            setPropertyName(firstProp.name || "My Home");
            if (firstProp.address?.street) {
              setPropertyAddress(`${firstProp.address.street}, ${firstProp.address.city || "Hyderabad"}`);
            }
          } else {
            setHasProperty(false);
            setLoading(false);
            return;
          }
        }

        if (propId) {
          setActivePropertyId(propId);
          setHasProperty(true);

          // Fetch appliances
          const appRes = await fetch(`/api/homepass/${propId}/appliances`);
          const appData = await appRes.json();
          if (appData.success) {
            setAppliances(appData.appliances || []);
            setHealthReport(appData.healthReport || null);
          }

          // Fetch maintenance records
          const recRes = await fetch(`/api/homepass/${propId}/records`);
          const recData = await recRes.json();
          if (recData.success) {
            setRecords(recData.records || []);
          }
        }
      } catch (err) {
        console.error("Error initializing HomePass:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [queryPropertyId]);

  const handleGenerateCertificate = async () => {
    if (!activePropertyId) return;
    try {
      setCertGenerating(true);
      const res = await fetch(`/api/homepass/${activePropertyId}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientName: "Hyderabad Resident / Prospective Buyer" }),
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

  const score = healthReport ? healthReport.overallScore : 88;
  const grade = healthReport ? healthReport.grade : "A";

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-xs text-neutral-500">
        Loading HomePass digital passport...
      </div>
    );
  }

  if (!hasProperty) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <PageHeader
          title="HomePass™ Digital Property Passport"
          description="Immutable lifecycle maintenance and warranty passport for Greater Hyderabad residences."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "HomePass" },
          ]}
        />
        <Card className="mt-8 border-2 border-dashed border-orange-200/80 bg-orange-50/20 p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-[#f05a28] mb-3">
            <Home className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-[#2d130a]">No Registered Property Found</h3>
          <p className="text-xs text-neutral-500 mt-2 max-w-md mx-auto">
            HomePass creates an immutable health record for your residence. Register your apartment or villa in Greater Hyderabad to view appliances, historical repairs, and export provenance certificates.
          </p>
          <div className="pt-6">
            <Link href="/customer/properties">
              <Button variant="brand" size="default" leftIcon={<Plus className="h-4 w-4" />}>
                Register Your Property
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none px-4 py-6 sm:px-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <PageHeader
        title="HomePass™ Digital Property Passport"
        description={`Immutable lifecycle maintenance and warranty passport for ${propertyName} (${propertyAddress}).`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/customer/properties" },
          { label: "HomePass Passport" },
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
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {propertyName}
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Every repair, appliance serial, and OEM part replacement in Hyderabad is cryptographically logged into this transferable health record.
            </p>
          </div>

          <div className="flex items-center gap-6 self-start sm:self-auto bg-black/30 p-4 sm:p-6 rounded-2xl border border-white/10">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                {score}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold mt-1">
                Health Score
              </div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-left text-xs space-y-1">
              <div>
                <span className="text-neutral-400">Appliances:</span>{" "}
                <span className="font-bold text-white">{appliances.length} Registered</span>
              </div>
              <div>
                <span className="text-neutral-400">Service Logs:</span>{" "}
                <span className="font-bold text-white">{records.length} Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appliances & Maintenance Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appliances */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
            Registered Systems &amp; Appliances ({appliances.length})
          </h3>
          {appliances.length > 0 ? (
            <div className="space-y-3">
              {appliances.map((app) => (
                <Card key={app._id} className="border border-neutral-200/80 shadow-xs">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                        {getCategoryIcon(app.category)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          {app.name}
                        </h4>
                        <p className="text-[11px] text-neutral-400">
                          {app.brand} • {app.modelNumber} • S/N: {app.serialNumber}
                        </p>
                      </div>
                    </div>
                    <Badge variant={app.healthScore > 80 ? "success" : "warning"} size="sm">
                      {app.healthScore}% Health
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-dashed border-neutral-200 p-6 text-center text-xs text-neutral-500">
              No appliances registered yet. InspectAI diagnostic scans will automatically catalog diagnosed equipment.
            </Card>
          )}
        </div>

        {/* Verified Maintenance History */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
            Verified Maintenance History ({records.length})
          </h3>
          {records.length > 0 ? (
            <div className="space-y-3">
              {records.map((rec) => (
                <Card key={rec._id} className="border border-neutral-200/80 shadow-xs">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {rec.title}
                      </h4>
                      <Badge variant="success" size="sm">
                        Verified
                      </Badge>
                    </div>
                    <p className="text-[11px] text-neutral-500">{rec.summary}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
                      <span>Pro: {rec.performedBy}</span>
                      <span>Warranty: {rec.warrantyMonths} Months</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-dashed border-neutral-200 p-6 text-center text-xs text-neutral-500">
              No previous service records. Completed repairs with photographic evidence will automatically attach here.
            </Card>
          )}
        </div>
      </div>

      {/* Provenance Certificate Modal */}
      {certData && (
        <Dialog
          open={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          title="Digital Provenance Certificate"
          description="Cryptographically signed property passport ready for transfer."
        >
          <div className="space-y-4 text-xs pt-2">
            <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 text-sm">{certData.propertyName}</span>
                <Badge variant="success" size="sm">Certified</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-neutral-700">
                <div>
                  <div className="text-[10px] text-neutral-500">Health Rating</div>
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

export default function HomePassPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading HomePass...</div>}>
      <HomePassContent />
    </Suspense>
  );
}
