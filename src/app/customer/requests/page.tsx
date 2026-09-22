"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Plus,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Play,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getAllMockRequests } from "@/lib/mock-data";

export default function CustomerRequestsPage() {
  const [requests, setRequests] = useState(getAllMockRequests);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    fetch("/api/service-requests")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.length) {
          setRequests(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (activeTab === "active") {
      return r.status !== "completed" && r.status !== "cancelled";
    }
    if (activeTab === "completed") {
      return r.status === "completed";
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge variant="info">Submitted</Badge>;
      case "analyzing":
        return <Badge variant="brand" dot>InspectAI Analyzing</Badge>;
      case "sow_ready":
        return <Badge variant="brand" dot>Scope & Price Ready</Badge>;
      case "matching":
        return <Badge variant="warning" dot>SmartRoute Matching</Badge>;
      case "booked":
        return <Badge variant="success">Pro Scheduled</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      {/* Header */}
      <PageHeader
        title="Service Requests & Tracking"
        description="Track live InspectAI diagnostics, review transparent scopes of work, and follow technician dispatch."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Requests" },
        ]}
        actions={
          <Link href="/customer/new-request">
            <Button
              variant="brand"
              size="default"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Diagnostic
            </Button>
          </Link>
        }
      />

      {/* Filter Tabs */}
      <div className="inline-flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
        {[
          { id: "all", label: `All Requests (${requests.length})` },
          { id: "active", label: "Active Diagnostics & Jobs" },
          { id: "completed", label: "Completed" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-neutral-100"
                : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((req) => (
          <Card key={req._id} className="hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-neutral-400 font-semibold">
                      {req.requestNumber || "SR-2026"}
                    </span>
                    {getStatusBadge(req.status)}
                    <span className="text-xs text-neutral-400">• {req.categoryName || req.categorySlug}</span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                    {req.title}
                  </h3>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <span className="text-[11px] text-neutral-400 block">Est. Scope Price</span>
                  <span className="font-mono text-base font-bold text-neutral-900 dark:text-neutral-100">
                    ₹{req.estimatedPricePaise ? (req.estimatedPricePaise / 100).toLocaleString() : "1,850"}
                  </span>
                </div>
              </div>

              {/* Preliminary AI finding banner if available */}
              {req.aiFindings && req.aiFindings.length > 0 && (
                <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/60 p-3 text-xs border border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#f05a28] flex-shrink-0" />
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      InspectAI: {req.aiFindings[0]?.component} ({Math.round((req.aiFindings[0]?.confidence ?? 0.9) * 100)}% confidence)
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 hidden sm:inline">
                    Required: {req.aiFindings[0]?.requiredPart}
                  </span>
                </div>
              )}

              {/* Bottom footer */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[200px] sm:max-w-none">
                    {req.propertyAddress || "Apartment 402, Ameerpet, Hyderabad"}
                  </span>
                </div>

                <Link href={`/customer/requests/${req._id}`}>
                  <Button size="sm" variant="ghost" rightIcon={<ChevronRight className="h-3.5 w-3.5" />}>
                    View Live Tracker
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRequests.length === 0 && (
          <div className="py-12 text-center text-neutral-500 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800">
            <ClipboardList className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
            <p className="text-sm font-semibold">No requests found</p>
            <p className="text-xs text-neutral-400 mt-1">Start by diagnosing a problem with InspectAI.</p>
          </div>
        )}
      </div>
    </div>
  );
}
