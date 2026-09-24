"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  PackageCheck,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPaise } from "@/lib/utils";
import { subscribeToNotifications } from "@/lib/notifications";

interface LeadItem {
  id: string;
  serviceRequestId: string;
  sowId: string;
  title: string;
  description: string;
  category: string;
  urgency: "routine" | "urgent" | "emergency";
  customerAddress: string;
  distanceKm: number;
  estimatedArrivalMinutes: number;
  lockedPricePaise: number;
  matchScore: number;
  allPartsInStock: boolean;
  vanInventoryMatches: Array<{
    partName: string;
    requiredQuantity: number;
    availableQuantity: number;
    inStock: boolean;
  }>;
}

export default function ProfessionalLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState<string | null>(null);
  const [acceptedMessage, setAcceptedMessage] = useState<string | null>(null);
  const [passedLeads, setPassedLeads] = useState<Set<string>>(new Set());

  const defaultLeadsFallback: LeadItem[] = [
    {
      id: "lead_req_01",
      serviceRequestId: "65f01234567890abcdef2001",
      sowId: "65f01234567890abcdef3001",
      title: "Split AC Compressor Tripping MCB",
      description: "Customer uploaded 12s video showing compressor shudder and instant 16A MCB trip. Required parts: 45µF Dual Run Capacitor + connector cleaning.",
      category: "hvac",
      urgency: "urgent",
      customerAddress: "Main Road, Hyderabad",
      distanceKm: 1.8,
      estimatedArrivalMinutes: 6,
      lockedPricePaise: 280000,
      matchScore: 96,
      allPartsInStock: true,
      vanInventoryMatches: [
        { partName: "45µF Dual Run Motor Capacitor", requiredQuantity: 1, availableQuantity: 6, inStock: true },
      ],
    },
    {
      id: "lead_req_02",
      serviceRequestId: "65f01234567890abcdef2002",
      sowId: "65f01234567890abcdef3002",
      title: "Kitchen Sink P-Trap Joint Dislodged & Leaking",
      description: "Constant dripping under basin into wooden vanity. Requires anti-odor P-trap replacement and angle valve reseat.",
      category: "plumbing",
      urgency: "routine",
      customerAddress: "SR Nagar, Hyderabad",
      distanceKm: 2.4,
      estimatedArrivalMinutes: 9,
      lockedPricePaise: 111014,
      matchScore: 91,
      allPartsInStock: true,
      vanInventoryMatches: [
        { partName: "Rigid Anti-Odor Bottle P-Trap", requiredQuantity: 1, availableQuantity: 5, inStock: true },
        { partName: "Solid Brass Angle Valve", requiredQuantity: 1, availableQuantity: 8, inStock: true },
      ],
    },
    {
      id: "lead_req_03",
      serviceRequestId: "65f01234567890abcdef2003",
      sowId: "65f01234567890abcdef3003",
      title: "Main DB Sparking on Geyser Activation",
      description: "Burning smell from electrical distribution board when water heater activates. 32A isolator terminal loose.",
      category: "electrical",
      urgency: "emergency",
      customerAddress: "Begumpet Road, Hyderabad",
      distanceKm: 4.8,
      estimatedArrivalMinutes: 14,
      lockedPricePaise: 350000,
      matchScore: 89,
      allPartsInStock: true,
      vanInventoryMatches: [
        { partName: "32A Double Pole Isolator", requiredQuantity: 1, availableQuantity: 6, inStock: true },
        { partName: "16A Single Pole Type-C MCB", requiredQuantity: 1, availableQuantity: 14, inStock: true },
      ],
    },
  ];

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/jobs/feed");
      const data = await res.json();
      if (data?.data?.length) {
        setLeads(data.data);
      } else {
        setLeads(defaultLeadsFallback);
      }
    } catch {
      setLeads(defaultLeadsFallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const unsubscribe = subscribeToNotifications(() => {
      fetchLeads();
    });
    return () => unsubscribe();
  }, []);

  const handleAcceptJob = async (lead: LeadItem) => {
    setIsAccepting(lead.id);
    try {
      const res = await fetch(`/api/jobs/${lead.serviceRequestId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proId: "pro_hvac_001",
          title: lead.title,
          category: lead.category,
          priceCeilingPaise: lead.lockedPricePaise,
          customerAddress: lead.customerAddress,
          distanceKm: lead.distanceKm,
          estimatedArrivalMinutes: lead.estimatedArrivalMinutes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAcceptedMessage(`Lead Accepted! Redirecting to Live Route Navigation...`);
        setTimeout(() => {
          router.push("/pro/route");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAccepting(null);
    }
  };

  const handlePassLead = (leadId: string) => {
    setPassedLeads((prev) => new Set(prev).add(leadId));
  };

  const visibleLeads = leads.filter((l) => !passedLeads.has(l.id));

  return (
    <div className="w-full max-w-none px-4 sm:px-6 py-6 sm:py-8 space-y-8 text-neutral-900">
      {/* Header */}
      <PageHeader
        title="SmartRoute Dispatch Board"
        description="Instant job matching prioritized by your van's inventory, location, and verified skill tier."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Provider Dashboard", href: "/pro/dashboard" },
          { label: "Dispatch Leads" },
        ]}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={fetchLeads}
            disabled={isLoading}
            className="border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Leads
          </Button>
        }
      />

      {/* Accepted Banner */}
      {acceptedMessage && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="text-sm font-semibold">{acceptedMessage}</div>
        </div>
      )}

      {/* Algorithm Explainer Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white border border-neutral-200/80 shadow-xs p-3.5 flex items-center gap-3">
          <div className="rounded-xl bg-[#f05a28]/10 p-2 text-[#f05a28]">
            <PackageCheck className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-neutral-900 block">Van Inventory Matching</span>
            <span className="text-[10px] text-neutral-500">First-trip fix guarantee</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-neutral-200/80 shadow-xs p-3.5 flex items-center gap-3">
          <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-neutral-900 block">Sub-20 Min Radius</span>
            <span className="text-[10px] text-neutral-500">Decay weighted routing</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-neutral-200/80 shadow-xs p-3.5 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-neutral-900 block">Locked Escrow Payouts</span>
            <span className="text-[10px] text-neutral-500">Pre-authorized ceiling</span>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Live Dispatch Queue ({visibleLeads.length})
          </h2>
          <span className="text-xs text-neutral-500">Auto-refreshing live</span>
        </div>

        {visibleLeads.length === 0 ? (
          <Card className="bg-white border-neutral-200/80 shadow-xs p-12 text-center space-y-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900">All Leads Cleared</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                You have reviewed all available SmartRoute leads in your current radius. New requests will chime automatically when customers upload video scopes.
              </p>
            </div>
            <Button
              size="sm"
              variant="brand"
              onClick={fetchLeads}
              className="mt-2"
            >
              Check Again
            </Button>
          </Card>
        ) : (
          visibleLeads.map((lead) => (
            <Card
              key={lead.id}
              className="bg-white border-neutral-200/80 shadow-xs p-5 space-y-4 hover:border-neutral-300 transition-all duration-200"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-neutral-900 text-base">
                      {lead.title}
                    </span>
                    <Badge
                      variant={
                        lead.urgency === "emergency"
                          ? "destructive"
                          : lead.urgency === "urgent"
                          ? "warning"
                          : "outline"
                      }
                      size="sm"
                    >
                      {lead.urgency.toUpperCase()}
                    </Badge>
                    <Badge variant="brand" size="sm">
                      {lead.matchScore}% MATCH
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#f05a28]" />
                    {lead.customerAddress} ({lead.distanceKm} km • {lead.estimatedArrivalMinutes} min drive)
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-neutral-500 block">Locked Scope Price</span>
                  <span className="text-xl font-mono font-bold text-emerald-600">
                    {formatPaise(lead.lockedPricePaise)}
                  </span>
                </div>
              </div>

              {/* Diagnostic preview */}
              <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-200/80 text-xs space-y-2">
                <div className="flex items-center gap-2 text-neutral-800 font-semibold">
                  <Sparkles className="h-3.5 w-3.5 text-[#f05a28]" />
                  <span>InspectAI Scope Summary:</span>
                </div>
                <p className="text-neutral-600 pl-5 leading-relaxed">
                  {lead.description}
                </p>

                {/* Van Inventory Match Box */}
                <div className="mt-3 pt-3 border-t border-neutral-200 pl-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {lead.allPartsInStock ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    )}
                    <span className="text-[11px] font-semibold text-neutral-800">
                      {lead.allPartsInStock
                        ? "100% Required Parts in Your Van Inventory"
                        : "Partial Van Stock — Secondary Hardware Required"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {lead.vanInventoryMatches.map((m, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                          m.inStock
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {m.partName}: {m.inStock ? `${m.availableQuantity} in van` : "Restock"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handlePassLead(lead.id)}
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  Pass Lead
                </Button>
                <Button
                  size="sm"
                  variant="brand"
                  leftIcon={<Zap className="h-4 w-4" />}
                  onClick={() => handleAcceptJob(lead)}
                  disabled={isAccepting === lead.id}
                  className="shadow-md shadow-orange-500/20 font-bold"
                >
                  {isAccepting === lead.id ? "Locking Escrow..." : "Accept Job & Start Route"}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
