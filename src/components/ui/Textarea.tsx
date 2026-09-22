"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      maxLength,
      showCount,
      value,
      defaultValue,
      onChange,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId();
    const [charCount, setCharCount] = React.useState<number>(() => {
      if (typeof value === "string") return value.length;
      if (typeof defaultValue === "string") return defaultValue.length;
      return 0;
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400"
            >
              {label}
            </label>
          )}
          {showCount && maxLength && (
            <span className="text-[11px] text-neutral-400">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cn(
            "flex min-h-[100px] w-full rounded-xl border border-neutral-200 bg-white p-3.5 text-sm text-neutral-900 transition-all placeholder:text-neutral-400 focus-visible:outline-none focus-visible:border-[#f05a28] focus-visible:ring-2 focus-visible:ring-[#f05a28]/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500",
            error &&
              "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-neutral-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
