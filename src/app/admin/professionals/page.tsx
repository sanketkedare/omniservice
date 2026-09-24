"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Truck, Wrench, ShieldCheck, Award, Star } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProRecord {
  id: string;
  name: string;
  trade: string;
  certification: string;
  vehicle: string;
  rating: number;
  jobsCompleted: number;
  status: "active" | "under_review" | "suspended";
  vanStockCount: number;
}

const PROS: ProRecord[] = [
  { id: "pro_plumb_001", name: "Suresh Kumar (Apex Flow)", trade: "Plumbing", certification: "Master Plumber #MP-MH-4412", vehicle: "MH-02-BP-8819 (Eeco Cargo)", rating: 4.9, jobsCompleted: 142, status: "active", vanStockCount: 48 },
  { id: "pro_hvac_001", name: "Vikram Patil (CoolAir Tech)", trade: "HVAC & Cooling", certification: "BEE Certified AC Tech #HV-881", vehicle: "MH-02-CE-1120 (Bolero Maxi)", rating: 4.8, jobsCompleted: 98, status: "active", vanStockCount: 62 },
  { id: "pro_elec_001", name: "Rahul Deshmukh (WireMaster)", trade: "Electrical", certification: "PWD Grade-A License #EL-MH-991", vehicle: "MH-04-AF-2201 (Tata Ace)", rating: 4.7, jobsCompleted: 64, status: "active", vanStockCount: 35 },
  { id: "pro_app_001", name: "Dinesh Solanki (FixPoint)", trade: "Appliances", certification: "IFB & LG Factory Certified", vehicle: "MH-02-EZ-4491 (Two Wheeler + Kit)", rating: 4.6, jobsCompleted: 41, status: "under_review", vanStockCount: 22 },
];

export default function AdminProfessionalsPage() {
  const [prosList, setProsList] = useState(PROS);

  const toggleStatus = (id: string) => {
    setProsList((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = p.status === "active" ? "suspended" : "active";
        return { ...p, status: next };
      })
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accredited Professional Network"
        description="Inspect trade certifications, vehicle inventory telemetry, and platform standing."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Professionals" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prosList.map((pro) => (
          <Card key={pro.id} className="hover:border-neutral-700 transition">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      {pro.name}
                    </h3>
                    <Badge variant={pro.status === "active" ? "success" : "warning"} size="sm">
                      {pro.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#f05a28] font-medium mt-0.5">{pro.trade}</p>
                </div>
                <div className="flex items-center gap-1 font-bold text-amber-500 text-xs">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  <span>{pro.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-xs">
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">License</div>
                  <div className="font-mono text-neutral-800 dark:text-neutral-200 text-[11px] truncate">
                    {pro.certification}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">Vehicle</div>
                  <div className="text-neutral-800 dark:text-neutral-200 text-[11px] truncate">
                    {pro.vehicle}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">Van Inventory</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    {pro.vanStockCount} SKUs Tracked
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">Jobs Completed</div>
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">
                    {pro.jobsCompleted}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 gap-2">
                <Button variant="outline" size="sm">
                  View Van Telemetry
                </Button>
                {pro.status === "under_review" ? (
                  <Button
                    variant="brand"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                      setProsList((prev) =>
                        prev.map((p) => (p.id === pro.id ? { ...p, status: "active" } : p))
                      );
                      alert(`Background Verification Approved: ${pro.name} has been certified and activated on the platform with full KYC clearance.`);
                    }}
                  >
                    Approve KYC & Verify
                  </Button>
                ) : (
                  <Button
                    variant={pro.status === "active" ? "destructive" : "brand"}
                    size="sm"
                    onClick={() => toggleStatus(pro.id)}
                  >
                    {pro.status === "active" ? "Suspend Accreditation" : "Restore Active"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
