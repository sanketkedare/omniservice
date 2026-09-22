import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-2xl border p-4 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-50 text-neutral-900 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800",
        info:
          "bg-blue-50/80 text-blue-900 border-blue-200 [&>svg]:text-blue-600 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/50",
        success:
          "bg-emerald-50/80 text-emerald-900 border-emerald-200 [&>svg]:text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50",
        warning:
          "bg-amber-50/80 text-amber-900 border-amber-200 [&>svg]:text-amber-600 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50",
        destructive:
          "bg-red-50/80 text-red-900 border-red-200 [&>svg]:text-red-600 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/50",
        brand:
          "bg-[#f05a28]/5 text-neutral-900 border-[#f05a28]/30 [&>svg]:text-[#f05a28] dark:bg-[#f05a28]/10 dark:text-neutral-100 dark:border-[#f05a28]/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const defaultIcons = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: AlertCircle,
  brand: Info,
};

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants> & {
      icon?: React.ReactNode;
      hideIcon?: boolean;
    }
>(({ className, variant = "default", icon, hideIcon = false, children, ...props }, ref) => {
  const IconComponent = defaultIcons[variant || "default"];

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {!hideIcon && (icon ?? <IconComponent className="h-4 w-4" />)}
      {children}
    </div>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs leading-relaxed opacity-90", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
