"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("OmniService Global Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-serif bg-[#fffaf5]">
      <div className="max-w-md w-full rounded-3xl border border-orange-200 bg-white p-8 text-center shadow-xl space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-[#f05a28]">
          <AlertOctagon className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#c2410c]">
            System Telemetry Catch
          </span>
          <h1 className="text-2xl font-bold text-[#2d130a]">Application Exception</h1>
          <p className="text-xs text-neutral-600 font-sans leading-relaxed">
            An unexpected error occurred during execution. Our telemetry system has logged this incident.
          </p>
          {error?.digest && (
            <p className="text-[10px] font-mono text-neutral-400">
              Digest ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Button
            variant="brand"
            fullWidth
            onClick={reset}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Retry Operation
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="outline" fullWidth leftIcon={<Home className="h-4 w-4" />}>
              Back to Safety
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
