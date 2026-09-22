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
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function CustomerRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");

  const loadRequests = () => {
    setLoading(true);
    fetch("/api/service-requests")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setRequests(data.data);
        } else {
          setRequests([]);
        }
      })
      .catch(() => {
        setRequests([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
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
      case "scoped":
      case "sow_ready":
        return <Badge variant="brand" dot>Scope &amp; Price Ready</Badge>;
      case "matching":
        return <Badge variant="warning" dot>SmartRoute Matching</Badge>;
      case "booked":
      case "assigned":
        return <Badge variant="success">Provider Scheduled</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="default">{status?.replace(/_/g, " ") || "Active"}</Badge>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <PageHeader
        title="Service Requests &amp; Tracking"
        description="Track live InspectAI diagnostics, review transparent scopes of work, and follow technician dispatch across Greater Hyderabad."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Requests" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={loadRequests}
              leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />}
            >
              Sync
            </Button>
            <Link href="/customer/new-request">
              <Button
                variant="brand"
                size="default"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                New Diagnostic
              </Button>
            </Link>
          </div>
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
            className={`rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-neutral-100"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-2xl border-2 border-orange-100 bg-white p-10 text-center text-xs text-neutral-500">
            Fetching service requests from database...
          </div>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <Card key={req._id || req.id} className="border-2 border-orange-100 shadow-xs">
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-neutral-400">
                        {req.requestNumber || (req._id ? `SR-${String(req._id).slice(-4).toUpperCase()}` : "SR-LIVE")}
                      </span>
                      {getStatusBadge(req.status)}
                      <span className="text-xs text-neutral-400">• {req.categoryName || req.category || "General"}</span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                      {req.title}
                    </h3>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {req.description}
                    </p>
                  </div>

                  <div className="text-left sm:text-right flex-shrink-0">
                    <span className="text-[11px] text-neutral-400 block">Scope Price</span>
                    <span className="font-mono text-base font-bold text-emerald-600">
                      ₹{req.budgetPaise ? ((req.budgetPaise) / 100).toLocaleString("en-IN") : req.estimatedPricePaise ? ((req.estimatedPricePaise) / 100).toLocaleString("en-IN") : "2,500"}
                    </span>
                  </div>
                </div>

                {/* Preliminary AI finding banner if available */}
                {req.aiFindings && req.aiFindings.length > 0 && (
                  <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/60 p-3 text-xs border border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#f05a28] flex-shrink-0" />
                      <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                        InspectAI: {req.aiFindings[0]?.component} ({Math.round((req.aiFindings[0]?.confidence ?? 0.9) * 100)}% confidence)
                      </span>
                    </div>
                    {req.aiFindings[0]?.requiredPart && (
                      <span className="text-[11px] text-neutral-400">
                        Required: {req.aiFindings[0]?.requiredPart}
                      </span>
                    )}
                  </div>
                )}

                {/* Bottom footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs gap-2">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <MapPin className="h-3.5 w-3.5 text-[#f05a28]" />
                    <span className="truncate max-w-[260px] sm:max-w-none">
                      {req.address || req.propertyAddress || "Greater Hyderabad, Telangana"}
                    </span>
                  </div>

                  <Link href={`/customer/requests/${req._id || req.id}`}>
                    <Button size="sm" variant="ghost" rightIcon={<ChevronRight className="h-3.5 w-3.5" />}>
                      View Live Tracker
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-12 text-center text-neutral-500 rounded-3xl border border-dashed border-orange-200/80 bg-orange-50/20 p-8 shadow-xs">
            <ClipboardList className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
            <p className="text-sm font-semibold text-[#2d130a]">No service requests found</p>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Ready to fix a household issue in Greater Hyderabad? Start by capturing a 15-second diagnostic video with InspectAI.
            </p>
            <div className="pt-4">
              <Link href="/customer/new-request">
                <Button variant="brand" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                  Start AI Diagnostic
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
