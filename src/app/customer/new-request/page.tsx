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
  FileCheck,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Progress } from "@/components/ui/Progress";

interface UploadedMediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  filename: string;
  fileSize: number;
}

export default function NewServiceRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCategory = searchParams.get("category") || "plumbing";
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [category, setCategory] = useState(preselectedCategory);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<"routine" | "urgent" | "emergency">("routine");
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { slug: "plumbing", label: "Plumbing & Drainage" },
    { slug: "electrical", label: "Electrical Systems" },
    { slug: "hvac", label: "HVAC & Air Conditioning" },
    { slug: "appliances", label: "Home Appliances" },
    { slug: "carpentry", label: "Carpentry & Locks" },
    { slug: "waterproofing", label: "Waterproofing" },
  ];

  // Auto-fill template on category select if empty
  const handleCategoryChange = (slug: string) => {
    setCategory(slug);
    if (!title) {
      if (slug === "plumbing") setTitle("Kitchen Sink Drain / Pipe Leak");
      else if (slug === "electrical") setTitle("Circuit Breaker Tripping Frequently");
      else if (slug === "hvac") setTitle("Split AC Not Cooling / Airflow Weak");
      else if (slug === "appliances") setTitle("Washing Machine Drum Vibration");
      else if (slug === "carpentry") setTitle("Door Alignment & Latch Repair");
      else if (slug === "waterproofing") setTitle("Ceiling Dampness & Seepage");
    }
  };

  // Handle file select (photos or video)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError("");
    setIsUploading(true);
    setUploadProgress(15);

    try {
      const fileList = Array.from(files);
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (!file) continue;
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (!isImage && !isVideo) {
          setError("Please select images (JPG, PNG) or videos (MP4, MOV)");
          continue;
        }

        setUploadProgress(40);

        // Request presigned URL from API
        const presignRes = await fetch("/api/uploads/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
            category: "diagnostic",
            fileSize: file.size,
          }),
        });

        const presignData = await presignRes.json();
        setUploadProgress(75);

        // Upload to URL (or mock receiver)
        const uploadUrl = presignData?.data?.uploadUrl || "/api/uploads/mock-receiver";
        try {
          await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });
        } catch {
          // If direct PUT fails in dev, continue
        }

        // Local object URL for instant preview
        const localPreviewUrl = URL.createObjectURL(file);

        setMediaList((prev) => [
          ...prev,
          {
            id: `media_${Date.now()}_${i}`,
            url: presignData?.data?.publicUrl || localPreviewUrl,
            type: isVideo ? "video" : "image",
            filename: file.name,
            fileSize: file.size,
          },
        ]);
      }
      setUploadProgress(100);
    } catch {
      setError("Failed to upload file. Using local preview.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeMedia = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  // Submit diagnostic request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a title for the issue");
      return;
    }
    if (!description.trim()) {
      setError("Please describe what happens when the problem occurs");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorySlug: category,
          title,
          description,
          urgency,
          media: mediaList.map((m) => ({
            url: m.url,
            type: m.type,
            filename: m.filename,
            fileSize: m.fileSize,
          })),
        }),
      });

      const data = await res.json();
      if (data?.data?._id) {
        router.push(`/customer/requests/${data.data._id}`);
      } else {
        router.push("/customer/requests");
      }
    } catch {
      // In case of error redirect to requests overview
      router.push("/customer/requests");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      {/* Header */}
      <PageHeader
        title="InspectAI Diagnostic Intake"
        description="Show the problem with a video or photo. Our AI diagnoses failure modes, generates exact parts requirements, and computes fixed fair pricing for Ameerpet, Hyderabad."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Requests", href: "/customer/requests" },
          { label: "New Diagnostic" },
        ]}
      />

      {error && (
        <Alert variant="destructive">
          <p className="text-xs">{error}</p>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Media Capture (Camera First) */}
        <Card className="border-neutral-200/90 dark:border-neutral-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f05a28]/10 text-[#f05a28]">
                  <Camera className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">1. Video & Photo Evidence</CardTitle>
              </div>
              <Badge variant="brand" size="sm">
                InspectAI Ready
              </Badge>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Record a 10–20 second video showing the problem in action (sound helps detect motor/bearing wear).
            </p>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {/* Hidden file input */}
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
              className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-900/40 p-8 text-center cursor-pointer transition-all hover:border-[#f05a28] hover:bg-[#f05a28]/5"
            >
              <div className="flex gap-2 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-neutral-800 text-[#f05a28] shadow-sm group-hover:scale-110 transition-transform">
                  <Video className="h-6 w-6" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-neutral-800 text-blue-500 shadow-sm group-hover:scale-110 transition-transform">
                  <Camera className="h-6 w-6" />
                </div>
              </div>

              <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Click to record video or choose photos
              </span>
              <span className="text-xs text-neutral-400 mt-1 max-w-xs">
                Supports MP4, WebM, MOV, JPG, PNG up to 100MB
              </span>
            </div>

            {/* Upload progress */}
            {isUploading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Uploading media...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {/* Media previews */}
            {mediaList.length > 0 && (
              <div className="pt-2">
                <span className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                  Attached Diagnostic Files ({mediaList.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {mediaList.map((m) => (
                    <div
                      key={m.id}
                      className="group relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 aspect-video bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
                    >
                      {m.type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.url}
                          alt={m.filename}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-neutral-600 dark:text-neutral-300">
                          <Play className="h-8 w-8 text-[#f05a28]" />
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
                        className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white opacity-90 hover:opacity-100 transition-opacity"
                        aria-label="Remove file"
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

        {/* Step 2: Trade Category & Location */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">2. Service Trade & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {/* Category chips */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Select Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => handleCategoryChange(c.slug)}
                    className={`rounded-xl border p-2.5 text-left text-xs font-semibold transition-all ${
                      category === c.slug
                        ? "border-[#f05a28] bg-[#f05a28]/5 text-[#f05a28]"
                        : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="rounded-xl bg-[#fffaf5] p-3.5 border border-orange-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#f05a28]" />
                <div className="text-xs">
                  <span className="font-bold text-neutral-900 block">
                    Apartment 402, Sea Green Heights
                  </span>
                  <span className="text-neutral-500">Ameerpet, Hyderabad 500016</span>
                </div>
              </div>
              <Badge variant="brand" size="sm">HomePass Linked</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Issue Description & Urgency */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">3. Symptom Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <Input
              label="Issue Summary"
              placeholder="e.g. Water leaking under kitchen sink"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Textarea
              label="What happens when the problem occurs?"
              placeholder="Describe sounds, leaks, smells, error codes on digital displays, or when it started..."
              rows={4}
              maxLength={1000}
              showCount
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            {/* Urgency */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Service Urgency
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
                    className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                      urgency === u.value
                        ? "border-[#f05a28] bg-[#f05a28]/5 text-[#f05a28]"
                        : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="brand"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            leftIcon={<Sparkles className="h-5 w-5" />}
          >
            Launch InspectAI Diagnostics
          </Button>
          <p className="text-center text-[11px] text-neutral-400 mt-2">
            No technician dispatched until you review and approve the exact Scope of Work & fixed price.
          </p>
        </div>
      </form>
    </div>
  );
}
