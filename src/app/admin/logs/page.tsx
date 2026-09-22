"use client";

import React, { useState, useEffect } from "react";
import { FileText, Shield, Search, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AuditLogItem {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  actor: string;
  actorRole: string;
  details: Record<string, any>;
  timestamp: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter((l) => {
    if (search && !l.action.toLowerCase().includes(search.toLowerCase()) && !l.actor.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Immutable Platform Audit Trail"
        description="Tamper-proof compliance log tracking all financial, dispatch, and scope state transitions."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Audit Logs" },
        ]}
        actions={
          <Button size="sm" variant="outline" onClick={fetchLogs} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh Logs
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by action or actor..."
          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#f05a28]"
        />
      </div>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">Log ID &amp; Time</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Structured Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filtered.map((log) => (
                <tr key={log._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-mono text-neutral-800 dark:text-neutral-200 font-bold">{log._id}</div>
                    <div className="text-[10px] text-neutral-400">
                      {new Date(log.timestamp).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" size="sm" className="font-mono">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
                    <div>{log.entityType}</div>
                    <div className="text-[10px] text-neutral-400">{log.entityId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-neutral-800 dark:text-neutral-200">{log.actor}</div>
                    <div className="text-[10px] text-neutral-400 uppercase">{log.actorRole}</div>
                  </td>
                  <td className="py-3 px-4">
                    <pre className="font-mono text-[10px] bg-neutral-50 border border-neutral-200/80 p-2 rounded-lg max-w-sm overflow-x-auto text-neutral-800">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
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
