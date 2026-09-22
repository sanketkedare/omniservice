"use client";

import React, { useState } from "react";
import { Layers, Edit3, Check, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface TradeCategory {
  id: string;
  name: string;
  code: string;
  baseHourlyRateINR: number;
  minimumCalloutINR: number;
  activeSpecialists: number;
  urgencyMultiplier: number;
}

const CATEGORIES: TradeCategory[] = [
  { id: "cat_plumb", name: "Plumbing & Sanitary", code: "PLM", baseHourlyRateINR: 650, minimumCalloutINR: 450, activeSpecialists: 14, urgencyMultiplier: 1.5 },
  { id: "cat_hvac", name: "HVAC & Air Conditioning", code: "HVC", baseHourlyRateINR: 850, minimumCalloutINR: 600, activeSpecialists: 22, urgencyMultiplier: 1.4 },
  { id: "cat_elec", name: "Electrical & Power Systems", code: "ELC", baseHourlyRateINR: 700, minimumCalloutINR: 500, activeSpecialists: 18, urgencyMultiplier: 1.75 },
  { id: "cat_app", name: "Major Home Appliances", code: "APP", baseHourlyRateINR: 600, minimumCalloutINR: 400, activeSpecialists: 11, urgencyMultiplier: 1.3 },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trade Categories & Pricing Cards"
        description="Configure deterministic hourly labor rates, callout floors, and urgency multipliers."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Categories" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    {cat.name}
                  </h3>
                  <span className="font-mono text-xs text-[#f05a28] font-semibold">{cat.code}</span>
                </div>
                <Badge variant="outline" size="sm">
                  {cat.activeSpecialists} Active Pros
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-xs">
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">Hourly Rate</div>
                  <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm mt-0.5">
                    ₹{cat.baseHourlyRateINR}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">Callout Floor</div>
                  <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm mt-0.5">
                    ₹{cat.minimumCalloutINR}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">Urgency Multiplier</div>
                  <div className="font-bold text-amber-500 text-sm mt-0.5">
                    {cat.urgencyMultiplier}x
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button variant="outline" size="sm" onClick={() => alert("Rate card editor modal is locked for audit integrity.")}>
                  Adjust Pricing Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
