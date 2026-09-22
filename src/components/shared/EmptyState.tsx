import * as React from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/30",
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500 shadow-xs">
        {icon ?? <FolderOpen className="h-7 w-7" />}
      </div>

      <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionLabel &&
            (actionHref ? (
              <a href={actionHref}>
                <Button size="sm" variant="brand">
                  {actionLabel}
                </Button>
              </a>
            ) : (
              <Button size="sm" variant="brand" onClick={onAction}>
                {actionLabel}
              </Button>
            ))}

          {secondaryActionLabel && (
            <Button size="sm" variant="secondary" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
