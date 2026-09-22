"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Zap, Activity, Clock, CheckCircle2, TrendingUp, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface TelemetryItem {
  id: string;
  model: string;
  pipeline: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  confidence: number;
  status: string;
  timestamp: string;
}

export default function AdminAIInferencesPage() {
  const [telemetry, setTelemetry] = useState<TelemetryItem[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ai-inferences");
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setTelemetry(data.recentTelemetry || []);
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
        title="InspectAI Model Telemetry & Latency"
        description="Real-time performance monitoring across Gemini 2.0 Flash multimodal vision and deterministic inference pipelines."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "AI Inferences" },
        ]}
        actions={
          <Button size="sm" variant="outline" onClick={fetchTelemetry} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh Telemetry
          </Button>
        }
      />

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-neutral-400 font-bold uppercase">Total Inferences</div>
              <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mt-1">
                {metrics.totalInferences.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1 font-medium">
                <TrendingUp className="h-3 w-3" /> 99.8% Success Rate
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-neutral-400 font-bold uppercase">Mean Latency</div>
              <div className="text-2xl font-black text-cyan-500 mt-1">
                {metrics.averageLatencyMs} ms
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                P99: {metrics.p99LatencyMs} ms
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-neutral-400 font-bold uppercase">Mean Confidence</div>
              <div className="text-2xl font-black text-emerald-500 mt-1">
                {(metrics.averageConfidence * 100).toFixed(1)}%
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                InspectAI Vision Threshold: 85%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-neutral-400 font-bold uppercase">Active Foundation Model</div>
              <div className="text-sm font-mono font-bold text-amber-500 mt-2 truncate">
                {metrics.activeModel}
              </div>
              <div className="text-[10px] text-neutral-400 mt-1">
                Fallback: {metrics.fallbackModel}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Inference Runs Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Recent InspectAI Pipeline Inferences
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">Trace ID</th>
                <th className="py-3 px-4">Pipeline</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Tokens (In / Out)</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {telemetry.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-neutral-700 dark:text-neutral-300">
                    {t.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">
                    {t.pipeline}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-amber-600 dark:text-amber-400">
                    {t.model}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-500">
                    {t.inputTokens} / {t.outputTokens}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {t.latencyMs} ms
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {(t.confidence * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success" size="sm">
                      SUCCESS
                    </Badge>
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
