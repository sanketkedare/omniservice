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
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [propertyType, setPropertyType] = useState<"apartment" | "house" | "villa">("apartment");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [state, setState] = useState("Telangana");
  const [postalCode, setPostalCode] = useState("500081");

  const loadProperties = () => {
    setLoading(true);
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setProperties(data.data);
        } else {
          setProperties([]);
        }
      })
      .catch(() => {
        setProperties([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProperties();
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
      if (res.ok && data.success && data.data) {
        setProperties([data.data, ...properties]);
      }
      setIsDialogOpen(false);
      setName("");
      setStreet("");
    } catch {
      setIsDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <PageHeader
        title="Managed Properties"
        description="Every property linked to your account receives a HomePass digital passport tracking historical repairs and appliance warranties in Greater Hyderabad."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Properties" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={loadProperties}
              leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />}
            >
              Sync
            </Button>
            <Button
              variant="brand"
              size="default"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsDialogOpen(true)}
            >
              Add Property
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="rounded-2xl border-2 border-orange-100 bg-white p-10 text-center text-xs text-neutral-500">
          Loading properties from database...
        </div>
      ) : properties.length > 0 ? (
        /* Property Cards (Responsive 1 -> 2 cols) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((prop) => (
            <Card key={prop._id} className="flex flex-col justify-between border-2 border-orange-100 shadow-xs">
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
                    {prop.address?.street}, {prop.address?.city || "Hyderabad"}, {prop.address?.state || "Telangana"} — {prop.address?.postalCode || "500081"}
                  </span>
                </div>

                {/* HomePass Score Widget */}
                <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-3.5 border border-neutral-100 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-200">
                      <ShieldCheck className="h-4 w-4 text-[#f05a28]" />
                      HomePass Health Score
                    </span>
                    <span className="font-bold text-emerald-600 font-mono">
                      {prop.healthScore ?? 85} / 100
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, prop.healthScore ?? 85)}%` }}
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
      ) : (
        <Card className="border-2 border-dashed border-orange-200/80 bg-orange-50/20 p-10 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#f05a28] mb-3">
            <Home className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-[#2d130a]">No Properties Registered</h4>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Link your apartment, flat, or villa in Greater Hyderabad to enable HomePass digital passport tracking and instant diagnostic bookings.
          </p>
          <div className="pt-4">
            <Button
              variant="brand"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsDialogOpen(true)}
            >
              Register First Property
            </Button>
          </div>
        </Card>
      )}

      {/* Add Property Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Register New Property in Hyderabad"
        description="Initialize an immutable HomePass passport for your residence."
      >
        <form onSubmit={handleCreateProperty} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Property Name / Nickname
            </label>
            <Input
              placeholder="e.g. My Apartment, Villa 14"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(["apartment", "house", "villa"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPropertyType(type)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                  propertyType === type
                    ? "border-[#f05a28] bg-orange-50 text-[#f05a28]"
                    : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Street / Building Address
            </label>
            <Input
              placeholder="e.g. Flat 301, Lakeview Residency, Gachibowli"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">City</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">State</label>
              <Input value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">PIN Code</label>
              <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              Register Property
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
