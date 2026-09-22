"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: BottomSheetProps) {
  // Lock scroll
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-6 pb-8 shadow-2xl transition-all dark:bg-neutral-900 border-t border-neutral-200 sm:border dark:border-neutral-800 animate-in slide-in-from-bottom duration-250",
          className
        )}
      >
        {/* Mobile handle pull bar */}
        <div className="mx-auto -mt-2 mb-4 h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700 sm:hidden" />

        <div className="flex items-center justify-between pb-4">
          <div>
            {title && (
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close sheet"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto pt-1">{children}</div>
      </div>
    </div>
  );
}
