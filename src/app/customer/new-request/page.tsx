"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Camera,
  Video,
  Upload,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ArrowRight,
  Loader2,
  Play,
  ShieldCheck,
  Zap,
  Wrench,
  Check,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Progress } from "@/components/ui/Progress";
import { toast } from "@/components/ui/Toast";
import { useGeolocation, checkHyderabadRadius } from "@/lib/geolocation";

interface UploadedMediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  filename: string;
  fileSize: number;
}

interface DiagnosticOption {
  id: string;
  title: string;
  description: string;
  partsRequired: string[];
  laborMinutes: number;
  priceCeilingPaise: number;
  isRecommended: boolean;
}

interface DiagnosticAnalysisData {
  categorySlug: string;
  categoryLabel: string;
  problemTitle: string;
  likelyRootCause: string;
  confidenceScore: number;
  severity: "low" | "medium" | "high" | "critical";
  options: DiagnosticOption[];
}

export default function NewServiceRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { locality, coordinates } = useGeolocation();
  const radiusCheck = checkHyderabadRadius(coordinates);

  // Form states
  const [category, setCategory] = useState(searchParams.get("category") || "plumbing");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<"routine" | "urgent" | "emergency">("routine");
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiagnosticAnalysisData | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>("opt_recommended");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Handle file select (photos or video)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError("");
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const fileList = Array.from(files);
      let primaryMediaUrl = "";
      let primaryMediaType: "image" | "video" = "image";

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (!file) continue;
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (!isImage && !isVideo) {
          setError("Please select photos (JPG, PNG) or videos (MP4, MOV)");
          continue;
        }

        setUploadProgress(50);

        // Upload to Cloudinary or use preview
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "omniservice");
        formData.append("category", "diagnostic");

        let uploadedUrl = "";
        try {
          const uploadRes = await fetch("/api/uploads/cloudinary", {
            method: "POST",
            body: formData,
          });
          const uploadJson = await uploadRes.json();
          if (uploadJson.success && uploadJson.data?.url) {
            uploadedUrl = uploadJson.data.url;
          }
        } catch {}

        setUploadProgress(85);

        const localPreviewUrl = URL.createObjectURL(file);
        const finalUrl = uploadedUrl || localPreviewUrl;
        if (!primaryMediaUrl) {
          primaryMediaUrl = finalUrl;
          primaryMediaType = isVideo ? "video" : "image";
        }

        setMediaList((prev) => [
          ...prev,
          {
            id: `media_${Date.now()}_${i}`,
            url: finalUrl,
            type: isVideo ? "video" : "image",
            filename: file.name,
            fileSize: file.size,
          },
        ]);
      }

      setUploadProgress(100);

      // Trigger instant InspectAI visual analysis
      if (primaryMediaUrl) {
        await runVisualAnalysis(primaryMediaUrl, primaryMediaType);
      }
    } catch {
      setError("Failed to process file. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const runVisualAnalysis = async (mediaUrl: string, mediaType: "image" | "video") => {
    setIsAnalyzing(true);
    setError("");

    try {
      toast.info("Gemini InspectAI Scanning...", "Analyzing visual pixels and physical defect signatures");

      const res = await fetch("/api/diagnostics/analyze-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaUrl,
          mediaType,
          mimeType: mediaType === "video" ? "video/mp4" : "image/jpeg",
        }),
      });

      const json = await res.json();
      if (json.success && json.analysis) {
        const data: DiagnosticAnalysisData = json.analysis;
        setAnalysisResult(data);
        if (data.categorySlug) setCategory(data.categorySlug);
        if (data.problemTitle) setTitle(data.problemTitle);
        if (data.likelyRootCause) setDescription(data.likelyRootCause);
        if (data.options && data.options.length > 0 && data.options[0]) {
          setSelectedOptionId(data.options[0].id);
        }
        toast.success("Analysis Complete", `Diagnostic confirmed: ${data.problemTitle}`);
      }
    } catch (err: any) {
      console.warn("InspectAI media analysis notice:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeMedia = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
    if (mediaList.length <= 1) {
      setAnalysisResult(null);
    }
  };

  // Submit diagnostic request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaList.length === 0) {
      setError("Please capture or upload at least one photo or video first");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const selectedOption = analysisResult?.options?.find((o) => o.id === selectedOptionId);
    const finalPriceCeiling = selectedOption?.priceCeilingPaise || 280000;

    try {
      const res = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorySlug: category,
          title: title || "Diagnostic Service Request",
          description: description || "Physical defect inspected via InspectAI",
          urgency,
          priceCeilingPaise: finalPriceCeiling,
          media: mediaList.map((m) => ({
            url: m.url,
            type: m.type,
            filename: m.filename,
            fileSize: m.fileSize,
          })),
        }),
      });

      const data = await res.json();
      toast.success("Request Submitted", "Price ceiling locked in Portal Escrow!");
      if (data?.data?._id) {
        router.push(`/customer/requests/${data.data._id}`);
      } else {
        router.push("/customer/requests");
      }
    } catch {
      router.push("/customer/requests");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 space-y-8 font-serif">
      {/* Header */}
      <PageHeader
        title="InspectAI Visual Diagnostic Intake"
        description="Upload or record photo/video of the issue. Gemini InspectAI will physically inspect the defect and present verified repair options."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Requests", href: "/customer/requests" },
          { label: "Visual Diagnostic" },
        ]}
      />

      {/* Geofence notice */}
      <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MapPin className="h-5 w-5 text-[#f05a28]" />
          <div>
            <span className="text-xs font-bold text-[#2d130a] block">
              Active Service Zone: {locality || "Hyderabad, Telangana"}
            </span>
            <span className="text-[11px] text-neutral-600">
              {radiusCheck.isWithinRadius
                ? `Verified inside Greater Hyderabad (Nearest Hub: ${radiusCheck.nearestHub})`
                : `Routed to nearest operational hub: ${radiusCheck.nearestHub}`}
            </span>
          </div>
        </div>
        <Badge variant={radiusCheck.isWithinRadius ? "success" : "warning"} size="sm">
          {radiusCheck.isWithinRadius ? "Verified Zone" : "Hub Routing"}
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <p className="text-xs">{error}</p>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Media Capture First */}
        <Card className="border-2 border-orange-300/80 bg-white shadow-md shadow-orange-900/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f05a28]/10 text-[#f05a28]">
                  <Camera className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">1. Capture or Upload Photo / Video</CardTitle>
              </div>
              <Badge variant="brand" size="sm">
                Gemini 2.0 Vision
              </Badge>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Record a 10–20 second video or clear photo showing the malfunction. Our AI will analyze the physical component before providing repair options.
            </p>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Drop / Capture Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/40 p-8 text-center cursor-pointer transition-all hover:border-[#f05a28] hover:bg-orange-50/80"
            >
              <div className="flex gap-2.5 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#f05a28] shadow-sm group-hover:scale-105 transition-transform">
                  <Video className="h-6 w-6" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm group-hover:scale-105 transition-transform">
                  <Camera className="h-6 w-6" />
                </div>
              </div>

              <span className="text-sm font-bold text-neutral-900">
                Click to record video or select photos from device
              </span>
              <span className="text-xs text-neutral-500 mt-1">
                Supports MP4, MOV, WebM, JPG, PNG (Camera capture supported on mobile)
              </span>
            </div>

            {/* Upload progress */}
            {isUploading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Uploading media files...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {/* Active Scanning Animation */}
            {isAnalyzing && (
              <div className="rounded-2xl border border-orange-300 bg-orange-50/90 p-4 flex items-center gap-3 animate-pulse">
                <Loader2 className="h-6 w-6 text-[#f05a28] animate-spin shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#c2410c]">
                    InspectAI Multimodal Inference in Progress
                  </h4>
                  <p className="text-[11px] text-neutral-600">
                    Inspecting physical wear, burnt terminals, seal degradation, and acoustic frequency patterns...
                  </p>
                </div>
              </div>
            )}

            {/* Media previews */}
            {mediaList.length > 0 && (
              <div className="pt-2">
                <span className="block text-xs font-semibold text-neutral-700 mb-2">
                  Uploaded Diagnostic Files ({mediaList.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {mediaList.map((m) => (
                    <div
                      key={m.id}
                      className="group relative overflow-hidden rounded-xl border border-orange-200 aspect-video bg-neutral-100 flex items-center justify-center"
                    >
                      {m.type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.url} alt={m.filename} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-neutral-700">
                          <Play className="h-7 w-7 text-[#f05a28]" />
                          <span className="text-[10px] mt-1 font-mono truncate max-w-[80px]">
                            {m.filename}
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMedia(m.id);
                        }}
                        className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Diagnostic Analysis & Verified Options (REVEALED ONLY POST-ANALYSIS) */}
        <Card className="border border-orange-200 bg-[#fffdfa]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                  <Wrench className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">2. Diagnostic Diagnosis & Scope Options</CardTitle>
              </div>
              {analysisResult ? (
                <Badge variant="success" size="sm">
                  {(analysisResult.confidenceScore * 100).toFixed(0)}% Confidence
                </Badge>
              ) : (
                <Badge variant="outline" size="sm">
                  Pending Media Analysis
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {!analysisResult ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-neutral-500 space-y-2">
                <Sparkles className="h-6 w-6 text-neutral-400 mx-auto" />
                <p className="text-xs font-semibold text-neutral-700">
                  Options will be unlocked only after photo/video analysis
                </p>
                <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                  Upload an image or video above to let Gemini InspectAI detect the exact malfunction, OEM part requirement, and fair-market price ceiling.
                </p>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-3">
                {/* Findings Banner */}
                <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#c2410c] uppercase tracking-wider">
                      Identified Fault: {analysisResult.problemTitle}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Severity: {analysisResult.severity}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                    <strong>Root Cause:</strong> {analysisResult.likelyRootCause}
                  </p>
                </div>

                {/* Service Options List */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Choose Your Service Scope Option
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {analysisResult.options.map((opt) => {
                      const isSelected = selectedOptionId === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedOptionId(opt.id)}
                          className={`relative rounded-2xl p-4 border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#f05a28] bg-orange-50/50 shadow-md shadow-orange-900/5"
                              : "border-neutral-200 bg-white hover:border-neutral-300"
                          }`}
                        >
                          {opt.isRecommended && (
                            <span className="absolute top-3 right-3 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              Recommended
                            </span>
                          )}

                          <div className="flex items-start gap-2.5">
                            <div
                              className={`h-4 w-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                                isSelected ? "border-[#f05a28] bg-[#f05a28]" : "border-neutral-300"
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <div className="space-y-1.5 flex-1 pr-14">
                              <h4 className="text-xs font-bold text-neutral-900">{opt.title}</h4>
                              <p className="text-[11px] text-neutral-600 font-sans leading-snug">
                                {opt.description}
                              </p>
                              <div className="pt-1 flex items-center justify-between text-xs">
                                <span className="font-mono text-[11px] text-neutral-500">
                                  Est. {opt.laborMinutes} mins
                                </span>
                                <span className="font-bold text-[#c2410c] text-sm font-mono">
                                  ₹{(opt.priceCeilingPaise / 100).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Urgency Selection */}
                <div className="space-y-1.5 pt-2 border-t border-orange-100">
                  <label className="block text-xs font-bold text-neutral-800">
                    Dispatch Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "routine", label: "Routine (24-48 hrs)" },
                      { value: "urgent", label: "Urgent (Within 4 hrs)" },
                      { value: "emergency", label: "Emergency (Immediate)" },
                    ].map((u) => (
                      <button
                        key={u.value}
                        type="button"
                        onClick={() => setUrgency(u.value as typeof urgency)}
                        className={`rounded-xl border p-2 text-center text-xs font-semibold transition-all cursor-pointer ${
                          urgency === u.value
                            ? "border-[#f05a28] bg-[#f05a28]/10 text-[#f05a28]"
                            : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                        }`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Escrow Guarantee Box */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900">
                TrustLock Portal Escrow Protection
              </h4>
              <p className="text-[11px] text-emerald-700">
                Payment is safely held in the OmniService Portal Vault. Funds are disbursed to the provider only after verified photographic evidence and your explicit signoff.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="brand"
            size="lg"
            fullWidth
            disabled={!analysisResult || isSubmitting}
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            Confirm Scope & Lock Escrow Ceiling
          </Button>
          <p className="text-center text-[11px] text-neutral-400 mt-2">
            Technician dispatched with van inventory matching the verified parts.
          </p>
        </div>
      </form>
    </div>
  );
}
