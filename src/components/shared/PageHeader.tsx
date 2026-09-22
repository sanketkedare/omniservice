import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 pb-6 border-b border-neutral-200/80 dark:border-neutral-800",
        className
      )}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumbs"
          className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400"
        >
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={item.label}>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={cn(isLast && "font-semibold text-neutral-900 dark:text-neutral-100")}>
                    {item.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="h-3 w-3 text-neutral-400" />}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
