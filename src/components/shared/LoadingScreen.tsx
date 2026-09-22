import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingScreen({
  message = "Loading OmniService AI...",
  subMessage = "Initializing AI diagnostics and service network",
  fullScreen = true,
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        fullScreen ? "fixed inset-0 z-50 bg-white/95 backdrop-blur-md" : "min-h-[400px] w-full",
        className
      )}
    >
      <div className="relative mb-6 flex items-center justify-center">
        {/* Glow rings */}
        <div className="absolute -inset-3 animate-pulse rounded-2xl bg-[#f05a28]/15 blur-lg" />

        {/* Brand Logo with rounded corners directly */}
        <Image
          src="/images/OmniService_Logo.png"
          alt="OmniService AI Logo"
          width={180}
          height={48}
          className="relative h-12 w-auto rounded-2xl object-contain animate-pulse"
          priority
        />
      </div>

      <h3 className="text-base font-bold text-neutral-900">
        {message}
      </h3>
      {subMessage && (
        <p className="mt-1 text-xs text-neutral-500 max-w-xs">
          {subMessage}
        </p>
      )}

      {/* Progress pill indicator */}
      <div className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <div className="h-full w-full animate-progress-indeterminate bg-gradient-to-r from-transparent via-[#f05a28] to-transparent" />
      </div>
    </div>
  );
}
