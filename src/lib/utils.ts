import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format currency from paise to INR display string
 * e.g., 250000 -> ₹2,500
 */
export function formatCurrency(paise: number, options?: { showDecimals?: boolean }): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: options?.showDecimals ? 2 : 0,
    minimumFractionDigits: options?.showDecimals ? 2 : 0,
  }).format(rupees);
}

export const formatPaise = formatCurrency;

/**
 * Format date to human-readable string
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(d);
}

/**
 * Truncate a string with ellipsis
 */
export function truncateText(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}
