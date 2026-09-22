import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  code?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred while processing your request.",
  code,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/30 p-8 text-center dark:border-red-950/40 dark:bg-red-950/10",
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
        <AlertTriangle className="h-7 w-7" />
      </div>

      <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
        {message}
      </p>

      {code && (
        <span className="mt-2 rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[11px] text-neutral-500 dark:bg-neutral-800">
          Ref: {code}
        </span>
      )}

      {onRetry && (
        <div className="mt-6">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
