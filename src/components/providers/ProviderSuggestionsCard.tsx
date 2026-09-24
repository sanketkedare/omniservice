"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  MapPin,
  Phone,
  Star,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useGeolocation } from "@/lib/geolocation";
import type { ProviderSuggestion } from "@/app/api/providers/suggestions/route";

export function ProviderSuggestionsCard() {
  const { locality } = useGeolocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("hvac");
  const [providers, setProviders] = useState<ProviderSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const areaQuery = encodeURIComponent(locality || "Hyderabad, Telangana");
    fetch(`/api/providers/suggestions?category=${selectedCategory}&area=${areaQuery}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.providers) {
          setProviders(data.providers);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [selectedCategory, locality]);

  const categories = [
    { id: "hvac", label: "HVAC & AC" },
    { id: "electrical", label: "Electrical" },
    { id: "plumbing", label: "Plumbing" },
    { id: "appliances", label: "Appliances" },
  ];

  return (
    <div className="space-y-4">
      {/* Header with AI & Priority Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/70 px-2.5 py-0.5 text-xs font-bold text-[#c2410c] border border-orange-200">
            <Sparkles className="h-3.5 w-3.5 text-[#f05a28]" />
            <span>AI Local Provider Discovery ({locality || "Hyderabad, Telangana"})</span>
          </div>
          <h3 className="text-lg font-bold text-[#2d130a] mt-1">
            Top Service Specialists in Your Area
          </h3>
          <p className="text-xs text-neutral-500">
            Registered OmniService providers are strictly prioritized with guaranteed TrustLock escrow protection.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 bg-neutral-100 p-1 rounded-xl">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === c.id
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Provider List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((pro, idx) => {
          const isPriority = pro.isRegistered;

          return (
            <Card
              key={pro.id}
              className={`relative overflow-hidden transition-all duration-200 ${
                isPriority
                  ? "border-2 border-orange-400/80 bg-gradient-to-br from-[#fffaf5] to-white shadow-md shadow-orange-900/5 hover:border-orange-500"
                  : "border border-neutral-200/80 bg-white hover:border-neutral-300"
              }`}
            >
              {/* Priority Ribbon */}
              {isPriority && (
                <div className="bg-gradient-to-r from-[#f05a28] to-[#ea580c] px-4 py-1 text-[11px] font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Priority #1 • Registered Platform Provider
                  </span>
                  <span className="font-mono text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                    TrustLock Escrow
                  </span>
                </div>
              )}

              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-base text-neutral-900 leading-snug">
                      {pro.name}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#f05a28]" />
                      <span>{pro.address}</span>
                      <span className="font-bold text-neutral-700">({pro.distanceKm} km away)</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-900">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                      <span>{pro.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-0.5">
                      ({pro.reviewCount} verified reviews)
                    </span>
                  </div>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {pro.specializations.map((spec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Action Bar — Provider Phone Strictly Hidden for Escrow Protection */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <div className="text-xs text-neutral-600 flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-2 py-0.5 rounded-lg">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="font-semibold text-[11px]">Secure In-App Routing</span>
                  </div>

                  <Link href={`/customer/new-request?category=${selectedCategory}`}>
                    <Button size="sm" variant="brand" rightIcon={<ChevronRight className="h-3.5 w-3.5" />}>
                      Request Inspection
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
