import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 - 100
  max?: number;
  showLabel?: boolean;
  variant?: "brand" | "success" | "warning" | "destructive";
}

export function Progress({
  value,
  max = 100,
  showLabel = false,
  variant = "brand",
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const fillColors = {
    brand: "bg-[#f05a28]",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    destructive: "bg-red-500",
  };

  return (
    <div className="w-full space-y-1.5" {...props}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800",
          className
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out rounded-full",
            fillColors[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
