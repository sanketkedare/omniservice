"use client";

import React, { useState, useEffect } from "react";
import { Banknote, ShieldAlert, ArrowUpRight, ArrowDownLeft, Lock, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface EscrowSummary {
  activeEscrowHoldPaise: number;
  totalSettledPaise: number;
  totalPlatformFeesPaise: number;
  totalRefundedPaise: number;
  activeTransactionCount: number;
  disputeCount: number;
}

interface EscrowTx {
  _id: string;
  paymentId: string;
  jobId: string;
  type: string;
  amountPaise: number;
  balanceAfterPaise: number;
  reason: string;
  actorId: string;
  actorRole: string;
  timestamp: string;
}

export default function AdminEscrowPage() {
  const [summary, setSummary] = useState<EscrowSummary | null>(null);
  const [ledger, setLedger] = useState<EscrowTx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEscrow();
  }, []);

  const fetchEscrow = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/escrow");
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setLedger(data.ledger || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Escrow Treasury & Ledger"
        description="Immutable double-entry ledger monitoring locked customer balances and technician payouts."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Escrow" },
        ]}
        actions={
          <Button size="sm" variant="outline" onClick={fetchEscrow} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh Treasury
          </Button>
        }
      />

      {/* Metrics Row */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-amber-500 font-bold uppercase">
                <span>Active Escrow Holds</span>
                <Lock className="h-4 w-4" />
              </div>
              <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mt-1">
                ₹{(summary.activeEscrowHoldPaise / 100).toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                Guaranteed price ceilings locked
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-emerald-500 font-bold uppercase">
                <span>Total Settled Payouts</span>
                <ArrowUpRight className="h-4 w-4" />
              </div>
              <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mt-1">
                ₹{(summary.totalSettledPaise / 100).toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                Transferred to technician ledgers (88%)
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-blue-500 font-bold uppercase">
                <span>Platform Commission (12%)</span>
                <Banknote className="h-4 w-4" />
              </div>
              <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mt-1">
                ₹{(summary.totalPlatformFeesPaise / 100).toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                Realized marketplace revenue
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-red-500 font-bold uppercase">
                <span>Active Disputes</span>
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mt-1">
                {summary.disputeCount} Case(s)
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                Escrow frozen for arbitration
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ledger Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Append-Only Escrow Transaction Journal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">Tx ID &amp; Timestamp</th>
                <th className="py-3 px-4">Job &amp; Payment</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Reason / Audit Trail</th>
                <th className="py-3 px-4">Actor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {ledger.map((tx) => (
                <tr key={tx._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-mono text-neutral-800 dark:text-neutral-200 font-bold">{tx._id}</div>
                    <div className="text-[10px] text-neutral-400">
                      {new Date(tx.timestamp).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div className="text-neutral-700 dark:text-neutral-300">Job: {tx.jobId}</div>
                    <div className="text-neutral-400">Pay: {tx.paymentId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        tx.type === "funds_released"
                          ? "success"
                          : tx.type === "hold_created"
                          ? "warning"
                          : "destructive"
                      }
                      size="sm"
                    >
                      {tx.type.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    ₹{(tx.amountPaise / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 max-w-xs text-neutral-600 dark:text-neutral-300 text-[11px]">
                    {tx.reason}
                  </td>
                  <td className="py-3 px-4 capitalize">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">{tx.actorRole}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
