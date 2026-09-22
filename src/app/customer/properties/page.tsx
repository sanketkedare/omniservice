"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Plus,
  MapPin,
  ShieldCheck,
  Building,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { DEMO_PROPERTIES } from "@/lib/mock-data";

export default function PropertiesPage() {
  const [properties, setProperties] = useState(DEMO_PROPERTIES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [propertyType, setPropertyType] = useState<"apartment" | "house" | "villa">("apartment");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [state, setState] = useState("Telangana");
  const [postalCode, setPostalCode] = useState("500016");

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.length) {
          setProperties(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !street.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          propertyType,
          address: {
            street: street.trim(),
            city: city.trim(),
            state: state.trim(),
            postalCode: postalCode.trim(),
            country: "India",
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProperties([data.data, ...properties]);
      } else {
        // Fallback optimistic addition
        const mockNew = {
          _id: "prop_" + Date.now(),
          name: name.trim(),
          propertyType,
          address: {
            street: street.trim(),
            city: city.trim(),
            state: state.trim(),
            postalCode: postalCode.trim(),
          },
          appliances: [],
          healthScore: 88,
          isDefault: false,
          isActive: true,
          createdAt: new Date(),
        };
        setProperties([mockNew as unknown as (typeof DEMO_PROPERTIES)[0], ...properties]);
      }
      setIsDialogOpen(false);
      setName("");
      setStreet("");
    } catch {
      // Mock fallback
      setIsDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <PageHeader
        title="Managed Properties"
        description="Every property linked to your account receives a HomePass digital passport tracking historical repairs and appliance warranties."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Properties" },
        ]}
        actions={
          <Button
            variant="brand"
            size="default"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsDialogOpen(true)}
          >
            Add Property
          </Button>
        }
      />

      {/* Property Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((prop) => (
          <Card key={prop._id} className="flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f05a28]/10 text-[#f05a28]">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{prop.name}</CardTitle>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      {prop.propertyType}
                    </span>
                  </div>
                </div>

                {prop.isDefault && (
                  <Badge variant="brand" size="sm">
                    Default
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <div className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <MapPin className="h-4 w-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                <span>
                  {prop.address.street}, {prop.address.city}, {prop.address.state} — {prop.address.postalCode}
                </span>
              </div>

              {/* HomePass Score Widget */}
              <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-3.5 border border-neutral-100 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-200">
                    <ShieldCheck className="h-4 w-4 text-[#f05a28]" />
                    HomePass Health Score
                  </span>
                  <span className="font-bold text-emerald-600">
                    {prop.healthScore ?? 90} / 100
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${prop.healthScore ?? 90}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <Link href={`/customer/homepass?propertyId=${prop._id}`}>
                  <Button size="sm" variant="outline" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                    View HomePass
                  </Button>
                </Link>

                <Link href={`/customer/new-request?propertyId=${prop._id}`}>
                  <Button size="sm" variant="brand">
                    Request Service
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Property Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Register New Property"
        description="Add a residential or commercial site to track diagnostics and initialize its HomePass."
      >
        <form onSubmit={handleCreateProperty} className="space-y-4 pt-2">
          <Input
            label="Property Label"
            placeholder="e.g. Apartment 402, Sea Green Heights"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as "apartment" | "house" | "villa")}
              className="flex h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 transition-all focus-visible:outline-none focus-visible:border-[#f05a28] focus-visible:ring-2 focus-visible:ring-[#f05a28]/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
            >
              <option value="apartment">Apartment / Flat</option>
              <option value="house">Independent House</option>
              <option value="villa">Villa / Row House</option>
            </select>
          </div>

          <Input
            label="Street Address"
            placeholder="Ameerpet Main Road"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              placeholder="Hyderabad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <Input
              label="Postal Code"
              placeholder="500016"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="brand"
              size="sm"
              isLoading={isSubmitting}
            >
              Save & Initialize HomePass
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
