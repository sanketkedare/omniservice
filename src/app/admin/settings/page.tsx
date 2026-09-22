"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, ShieldCheck, DollarSign, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function AdminSettingsPage() {
  const [platformFee, setPlatformFee] = useState(12);
  const [gst, setGst] = useState(18);
  const [autoReleaseHours, setAutoReleaseHours] = useState(24);
  const [disputeDays, setDisputeDays] = useState(7);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setPlatformFee(data.settings.platformFeePercent);
          setGst(data.settings.gstPercent);
          setAutoReleaseHours(data.settings.escrowAutoReleaseHours);
          setDisputeDays(data.settings.disputeGraceDays);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaved(false);
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformFeePercent: platformFee,
          gstPercent: gst,
          escrowAutoReleaseHours: autoReleaseHours,
          disputeGraceDays: disputeDays,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
      }
    } catch (err) {
      alert("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Platform Governance &amp; Financial Parameters"
        description="Configure marketplace fees, escrow release windows, and compliance thresholds."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Settings" },
        ]}
      />

      {saved && (
        <Alert variant="success" title="Parameters Updated">
          Platform financial and escrow parameters have been saved.
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#f05a28]" />
              Marketplace Economics &amp; Tax
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-neutral-700 dark:text-neutral-300 font-semibold block mb-1">
                  Platform Commission Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(Number(e.target.value))}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#f05a28]"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Deducted automatically from captured escrow prior to specialist payout. Current: 12%.
                </p>
              </div>

              <div>
                <label className="text-neutral-700 dark:text-neutral-300 font-semibold block mb-1">
                  Goods &amp; Services Tax (GST %)
                </label>
                <input
                  type="number"
                  min="0"
                  max="28"
                  value={gst}
                  onChange={(e) => setGst(Number(e.target.value))}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#f05a28]"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Statutory tax computed across labor and service fee components. Current: 18%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              Escrow Lifecycle &amp; Dispute Windows
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-neutral-700 dark:text-neutral-300 font-semibold block mb-1">
                  Escrow Auto-Release Window (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="72"
                  value={autoReleaseHours}
                  onChange={(e) => setAutoReleaseHours(Number(e.target.value))}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#f05a28]"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Automatic payout release window following TrustLock completion if customer does not manually sign off.
                </p>
              </div>

              <div>
                <label className="text-neutral-700 dark:text-neutral-300 font-semibold block mb-1">
                  Dispute Window (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={disputeDays}
                  onChange={(e) => setDisputeDays(Number(e.target.value))}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#f05a28]"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Customer warranty claim window under HomePass guarantee protection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            variant="brand"
            className="font-bold px-6"
            leftIcon={<Save className="h-4 w-4" />}
          >
            {saving ? "Saving Changes..." : "Save Platform Parameters"}
          </Button>
        </div>
      </form>
    </div>
  );
}
