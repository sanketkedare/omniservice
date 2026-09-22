"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Navigation,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPaise } from "@/lib/utils";

interface JobItem {
  _id: string;
  bookingId: string;
  serviceRequestId: string;
  scopeOfWorkId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  problemTitle: string;
  category: string;
  status: "assigned" | "en_route" | "arrived" | "in_progress" | "completed" | "cancelled";
  priceCeilingPaise: number;
  requiredParts: Array<{ name: string; quantity: number; inStock: boolean }>;
  distanceKm: number;
  estimatedArrivalMinutes: number;
}

export default function ProfessionalJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [updatingJobId, setUpdatingJobId] = useState<string | null>(null);

  const fetchJobs = async () => {
    // Initial demo fallback job
    setJobs([
      {
        _id: "65f01234567890abcdef6001",
        bookingId: "65f01234567890abcdef7001",
        serviceRequestId: "65f01234567890abcdef2001",
        scopeOfWorkId: "65f01234567890abcdef3001",
        customerName: "Sanket Kedare",
        customerPhone: "+91 86248 51910",
        customerAddress: "Flat 402, Sea Green Apts, Ameerpet, Hyderabad",
        problemTitle: "Split AC Compressor Tripping MCB",
        category: "hvac",
        status: "assigned",
        priceCeilingPaise: 280000,
        requiredParts: [
          { name: "45µF Dual Run Motor Capacitor", quantity: 1, inStock: true },
        ],
        distanceKm: 1.8,
        estimatedArrivalMinutes: 6,
      },
    ]);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleUpdateStatus = async (jobId: string, newStatus: "en_route" | "arrived" | "in_progress" | "completed") => {
    setUpdatingJobId(jobId);
    try {
      const res = await fetch(`/api/jobs/${jobId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
        );
      }
    } catch {
      // Local optimistic update
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
      );
    } finally {
      setUpdatingJobId(null);
    }
  };

  const activeJobs = jobs.filter((j) => j.status !== "completed");
  const completedJobs = jobs.filter((j) => j.status === "completed");
  const displayedJobs = activeTab === "active" ? activeJobs : completedJobs;

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-6 sm:py-8 space-y-8 text-neutral-900">
      {/* Header */}
      <PageHeader
        title="Active Jobs & Dispatches"
        description="Track assigned customer orders, live arrival status, and Scope of Work line items in Ameerpet, Hyderabad."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Pro Dashboard", href: "/pro/dashboard" },
          { label: "Jobs" },
        ]}
        actions={
          <Link href="/pro/route">
            <Button
              size="sm"
              variant="brand"
              leftIcon={<Navigation className="h-4 w-4" />}
              className="font-bold"
            >
              Open GPS Route
            </Button>
          </Link>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "active"
              ? "border-[#f05a28] text-[#f05a28]"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Active Jobs ({activeJobs.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "completed"
              ? "border-[#f05a28] text-[#f05a28]"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Completed History ({completedJobs.length})
        </button>
      </div>

      {/* Jobs Feed */}
      <div className="space-y-4">
        {displayedJobs.length === 0 ? (
          <Card className="bg-white border-neutral-200/80 shadow-xs p-12 text-center space-y-3">
            <Briefcase className="h-10 w-10 text-neutral-400 mx-auto" />
            <h3 className="text-sm font-bold text-neutral-900">No {activeTab} jobs right now</h3>
            <p className="text-xs text-neutral-500">
              Check the SmartRoute lead feed to accept incoming repair requests.
            </p>
            <Link href="/pro/leads">
              <Button size="sm" variant="brand" className="mt-2">
                Browse Dispatch Leads
              </Button>
            </Link>
          </Card>
        ) : (
          displayedJobs.map((job) => (
            <Card
              key={job._id}
              className="bg-white border-neutral-200/80 shadow-xs p-6 space-y-5"
            >
              {/* Job Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-neutral-900">
                      {job.problemTitle}
                    </h3>
                    <Badge
                      variant={
                        job.status === "completed"
                          ? "success"
                          : job.status === "in_progress"
                          ? "warning"
                          : "brand"
                      }
                      size="sm"
                      dot
                    >
                      {job.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#f05a28]" />
                    {job.customerAddress}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-neutral-500 block">
                    Escrow Locked Price
                  </span>
                  <span className="text-2xl font-mono font-bold text-emerald-600">
                    {formatPaise(job.priceCeilingPaise)}
                  </span>
                </div>
              </div>

              {/* Customer & Location Strip */}
              <div className="rounded-xl bg-neutral-50 border border-neutral-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-neutral-500">Customer</span>
                  <p className="text-sm font-bold text-neutral-900">{job.customerName}</p>
                  <p className="text-xs text-neutral-500 font-mono">{job.customerPhone}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a href={`tel:${job.customerPhone}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<Phone className="h-3.5 w-3.5" />}
                      className="border-neutral-200 bg-white text-neutral-800 text-xs hover:bg-neutral-100 shadow-xs"
                    >
                      Call Customer
                    </Button>
                  </a>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<MessageSquare className="h-3.5 w-3.5" />}
                    className="border-neutral-200 bg-white text-neutral-800 text-xs hover:bg-neutral-100 shadow-xs"
                  >
                    Masked SMS
                  </Button>
                </div>
              </div>

              {/* Required Van Inventory */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-neutral-700">
                  Required Parts (Stocked in Van):
                </span>
                <div className="flex flex-wrap gap-2">
                  {job.requiredParts.map((p, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs text-emerald-800 font-mono"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>
                        {p.name} ({p.quantity} unit) — In Stock
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200">
                <Link
                  href={`/customer/requests/${job.serviceRequestId}/sow`}
                  className="text-xs font-semibold text-[#f05a28] hover:underline inline-flex items-center gap-1"
                >
                  <span>View Full SOW Line Items</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>

                <div className="flex items-center gap-2 flex-wrap">
                  {job.status === "assigned" && (
                    <Link href="/pro/route">
                      <Button
                        size="sm"
                        variant="brand"
                        leftIcon={<Navigation className="h-4 w-4" />}
                        className="font-bold"
                      >
                        Start Route Navigation
                      </Button>
                    </Link>
                  )}

                  {job.status === "assigned" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(job._id, "arrived")}
                      disabled={updatingJobId === job._id}
                      className="border-neutral-200 bg-white text-neutral-800 text-xs hover:bg-neutral-100"
                    >
                      Mark Arrived
                    </Button>
                  )}

                  {job.status === "en_route" && (
                    <Button
                      size="sm"
                      variant="brand"
                      onClick={() => handleUpdateStatus(job._id, "arrived")}
                      disabled={updatingJobId === job._id}
                      className="font-bold"
                    >
                      Mark Arrived at Property
                    </Button>
                  )}

                  {job.status === "arrived" && (
                    <Button
                      size="sm"
                      variant="brand"
                      onClick={() => handleUpdateStatus(job._id, "in_progress")}
                      disabled={updatingJobId === job._id}
                      className="font-bold"
                    >
                      Begin Work (Start Timer)
                    </Button>
                  )}

                  {job.status === "in_progress" && (
                    <Button
                      size="sm"
                      variant="brand"
                      onClick={() => handleUpdateStatus(job._id, "completed")}
                      disabled={updatingJobId === job._id}
                      className="bg-emerald-600 hover:bg-emerald-500 font-bold"
                    >
                      Complete &amp; Submit Proof
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
