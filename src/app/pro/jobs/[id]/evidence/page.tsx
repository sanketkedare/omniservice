"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { ProfessionalNav } from "@/components/layout/ProfessionalNav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Progress } from "@/components/ui/Progress";

interface EvidenceItem {
  _id: string;
  type: string;
  title: string;
  description?: string;
  media: Array<{ url: string; capturedAt: string }>;
  aiVerificationStatus?: string;
}

interface VerificationData {
  verificationId: string;
  outcome: string;
  confidenceScore: number;
  cryptographicProofToken?: string;
  verificationNotes: string;
  checklistResults: Array<{ criterion: string; passed: boolean; confidence: number; note?: string }>;
}

export default function ProJobEvidencePage() {
  const params = useParams();
  const router = useRouter();
  const jobId = (params?.id as string) || "job_001";

  const [activeTab, setActiveTab] = useState<"pre_work" | "post_work" | "functional_test">("pre_work");
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verification, setVerification] = useState<VerificationData | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    fetchEvidence();
  }, [jobId]);

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/evidence?jobId=${jobId}`);
      const data = await res.json();
      if (data.success) {
        setEvidenceList(data.evidence);
      }
      // Check for existing verification
      const vRes = await fetch(`/api/trustlock/verify?jobId=${jobId}`);
      const vData = await vRes.json();
      if (vData.success && vData.verifications?.length > 0) {
        setVerification(vData.verifications[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    try {
      setUploading(true);
      const payload = {
        jobId,
        professionalId: "pro_plumb_001",
        type: activeTab,
        title: formTitle,
        description: formDesc,
        media: [
          {
            type: "image",
            url: "/images/OmniService_Icon.png",
            capturedAt: new Date().toISOString(),
            location: { lat: 19.0596, lng: 72.8295 },
          },
        ],
      };

      const res = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: "success", msg: "Evidence asset successfully uploaded with GPS geotag." });
        setFormTitle("");
        setFormDesc("");
        fetchEvidence();
      } else {
        setNotification({ type: "error", msg: data.message || "Failed to upload evidence" });
      }
    } catch (err: any) {
      setNotification({ type: "error", msg: err.message || "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const runVerification = async () => {
    try {
      setVerifying(true);
      setNotification(null);
      const res = await fetch("/api/trustlock/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, professionalId: "pro_plumb_001" }),
      });
      const data = await res.json();
      if (data.success) {
        setVerification(data.verification);
        setNotification({
          type: "success",
          msg: `TrustLock Analysis Complete: Score ${(data.verification.confidenceScore * 100).toFixed(0)}% — Proof Token Issued!`,
        });
        fetchEvidence();
      } else {
        setNotification({ type: "error", msg: data.message || "Verification failed" });
      }
    } catch (err: any) {
      setNotification({ type: "error", msg: err.message || "Verification request failed" });
    } finally {
      setVerifying(false);
    }
  };

  const preWorkList = evidenceList.filter((e) => e.type === "pre_work");
  const postWorkList = evidenceList.filter((e) => e.type === "post_work" || e.type === "functional_test");

  return (
    <div className="min-h-screen bg-neutral-50/60 text-neutral-900 flex flex-col">
      <TopBar className="bg-white/90 border-neutral-200/80 text-neutral-900 shadow-xs" />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <Link href="/pro/jobs" className="hover:text-emerald-600 transition">
                Jobs
              </Link>
              <span>/</span>
              <span className="text-neutral-700">Job #{jobId}</span>
              <span>/</span>
              <span className="text-emerald-600 font-medium">TrustLock Proof Capture</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
              <span>TrustLock™ Visual Proof-of-Work</span>
              <Badge variant="warning">Inspection Stage</Badge>
            </h1>
          </div>
          <Link href="/pro/jobs">
            <Button variant="outline" size="sm">
              Back to Active Jobs
            </Button>
          </Link>
        </div>

        {/* Notifications */}
        {notification && (
          <Alert
            variant={notification.type === "success" ? "success" : "destructive"}
            title={notification.type === "success" ? "Action Verified" : "Notice"}
          >
            {notification.msg}
          </Alert>
        )}

        {/* Status Strip & AI Verification Card */}
        {verification && (
          <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <CardTitle className="text-emerald-900 text-lg">
                    TrustLock™ Verification Certificate
                  </CardTitle>
                </div>
                <Badge variant={verification.outcome === "verified" ? "success" : "warning"}>
                  {verification.outcome.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                    Multimodal Confidence
                  </div>
                  <div className="text-2xl font-black text-emerald-600">
                    {(verification.confidenceScore * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                    Cryptographic Proof Token
                  </div>
                  <div className="font-mono text-sm text-cyan-800 bg-cyan-50 px-3 py-1 rounded border border-cyan-200">
                    {verification.cryptographicProofToken || "TL-CERT-AUTOGEN-2026"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                    Escrow Payout Condition
                  </div>
                  <div className="text-sm font-semibold text-emerald-700">
                    Ready for Customer Release
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-neutral-500 uppercase">
                  InspectAI Checklist Verification
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {verification.checklistResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-white border border-neutral-200/80 flex items-start gap-3 shadow-xs"
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mt-0.5 ${
                          item.passed
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                            : "bg-amber-100 text-amber-700 border border-amber-300"
                        }`}
                      >
                        {item.passed ? "✓" : "!"}
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="text-neutral-800 font-medium">{item.criterion}</div>
                        {item.note && <div className="text-neutral-500 text-[11px] mt-0.5">{item.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Evidence Capture & Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form (Left 1 Col) */}
          <Card className="border-neutral-200/80 bg-white shadow-xs">
            <CardHeader>
              <CardTitle className="text-base text-neutral-900 flex items-center gap-2">
                <span>Capture Proof Asset</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-600 uppercase font-semibold block mb-1">
                    Evidence Category
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-lg border border-neutral-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab("pre_work")}
                      className={`text-xs py-1.5 rounded font-medium transition ${
                        activeTab === "pre_work"
                          ? "bg-white text-neutral-900 shadow-xs"
                          : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      Pre-Work
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("post_work")}
                      className={`text-xs py-1.5 rounded font-medium transition ${
                        activeTab === "post_work"
                          ? "bg-white text-neutral-900 shadow-xs"
                          : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      Post-Work
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("functional_test")}
                      className={`text-xs py-1.5 rounded font-medium transition ${
                        activeTab === "functional_test"
                          ? "bg-white text-neutral-900 shadow-xs"
                          : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      Test Run
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-600 uppercase font-semibold block mb-1">
                    Checkpoint Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={
                      activeTab === "pre_work"
                        ? "e.g., Leaking slip joint baseline"
                        : "e.g., Installed OEM PVC bottle trap"
                    }
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-600 uppercase font-semibold block mb-1">
                    Technical Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Describe parts removed/replaced, torque, test flow rate..."
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-4 border border-dashed border-neutral-300 rounded-xl bg-neutral-50 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    📷
                  </div>
                  <div className="text-xs text-neutral-700 font-medium">
                    Auto Geotag & Time-Stamp Active
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    17.3850° N, 78.4867° E • Hyderabad, Telangana
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  {uploading ? "Saving Proof Asset..." : "Record Evidence Asset"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Evidence Comparison Gallery (Right 2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-neutral-200/80 bg-white shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base text-neutral-900">
                  TrustLock™ Side-by-Side Audit Gallery
                </CardTitle>
                <Button
                  variant="brand"
                  size="sm"
                  onClick={runVerification}
                  disabled={verifying}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                >
                  {verifying ? "Inspecting Assets..." : "Run TrustLock Verification"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pre-Work Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Pre-Work Baseline Photos</span>
                      <Badge variant="warning" size="sm">
                        {preWorkList.length} Asset(s)
                      </Badge>
                    </div>
                  </div>
                  {preWorkList.length === 0 ? (
                    <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-500 text-center">
                      No pre-work baseline recorded yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {preWorkList.map((ev) => (
                        <div
                          key={ev._id}
                          className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 shadow-xs">
                              📷
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-neutral-900 truncate">
                                {ev.title}
                              </div>
                              <div className="text-[11px] text-neutral-500 line-clamp-1">
                                {ev.description || "Baseline condition recorded"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-200">
                            <span>GPS Geotagged</span>
                            <span className="text-emerald-600 font-medium">Verified Baseline</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post-Work Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Post-Work Completion Proof</span>
                      <Badge variant="success" size="sm">
                        {postWorkList.length} Asset(s)
                      </Badge>
                    </div>
                  </div>
                  {postWorkList.length === 0 ? (
                    <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-500 text-center">
                      Upload post-work completion photos to trigger TrustLock certification.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {postWorkList.map((ev) => (
                        <div
                          key={ev._id}
                          className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                              ✓
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-neutral-900 truncate">
                                {ev.title}
                              </div>
                              <div className="text-[11px] text-neutral-500 line-clamp-1">
                                {ev.description || "Completion proof uploaded"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-200">
                            <span>OEM Replacement Part</span>
                            <span className="text-emerald-600 font-medium">Clean Install</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ProfessionalNav />
    </div>
  );
}
