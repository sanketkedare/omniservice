import React from "react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* Pulsing glow */}
        <div className="absolute inset-0 animate-ping rounded-full bg-[#f05a28]/20" />
        {/* Spinning ring */}
        <div className="h-12 w-12 animate-spin rounded-full border-3 border-neutral-200 border-t-[#f05a28] dark:border-neutral-800 dark:border-t-[#f05a28]" />
      </div>
      <p className="mt-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
        Loading OmniService AI...
      </p>
    </div>
  );
}
