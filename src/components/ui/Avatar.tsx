"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

const statusClasses = {
  online: "bg-emerald-500",
  offline: "bg-neutral-400",
  busy: "bg-amber-500",
};

export function Avatar({
  src,
  alt = "",
  name = "",
  size = "md",
  status,
  className,
  ...props
}: AvatarProps) {
  const [imageFailed, setImageFailed] = React.useState(false);

  // Generate initials from name (e.g. "John Doe" -> "JD")
  const initials = React.useMemo(() => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const p0 = parts[0];
    const p1 = parts[1];
    if (parts.length >= 2 && p0 && p1) {
      return `${p0[0] ?? ""}${p1[0] ?? ""}`.toUpperCase();
    }
    return (p0?.[0] || "").toUpperCase();
  }, [name]);

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-full font-bold select-none border border-neutral-200 dark:border-neutral-800",
          sizeClasses[size],
          src && !imageFailed
            ? "bg-neutral-100 dark:bg-neutral-800"
            : "bg-[#f05a28]/10 text-[#f05a28] dark:bg-[#f05a28]/20 dark:text-[#f47a4f]"
        )}
      >
        {src && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || name}
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span>{initials || "?"}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-neutral-900",
            statusClasses[status],
            size === "sm" && "h-2 w-2",
            size === "md" && "h-2.5 w-2.5",
            size === "lg" && "h-3 w-3",
            size === "xl" && "h-3.5 w-3.5"
          )}
        />
      )}
    </div>
  );
}
