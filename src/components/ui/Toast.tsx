"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Loader2,
  X,
  HelpCircle,
} from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning" | "loading" | "confirm";

export interface ToastOptions {
  id?: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ToastItem extends ToastOptions {
  id: string;
  createdAt: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  success: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
  error: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
  info: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
  warning: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
  loading: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
  confirm: (
    title: string,
    description: string | undefined,
    callbacks: {
      onConfirm: () => void;
      onCancel?: () => void;
      confirmLabel?: string;
      cancelLabel?: string;
    }
  ) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let globalToastHandler: ToastContextValue | null = null;

/**
 * Universal toast dispatcher that can be called anywhere in the app
 */
export const toast = {
  success: (title: string, description?: string, options?: Partial<ToastOptions>) =>
    globalToastHandler?.success(title, description, options) ?? "",
  error: (title: string, description?: string, options?: Partial<ToastOptions>) =>
    globalToastHandler?.error(title, description, options) ?? "",
  info: (title: string, description?: string, options?: Partial<ToastOptions>) =>
    globalToastHandler?.info(title, description, options) ?? "",
  warning: (title: string, description?: string, options?: Partial<ToastOptions>) =>
    globalToastHandler?.warning(title, description, options) ?? "",
  loading: (title: string, description?: string, options?: Partial<ToastOptions>) =>
    globalToastHandler?.loading(title, description, options) ?? "",
  confirm: (
    title: string,
    description: string | undefined,
    callbacks: {
      onConfirm: () => void;
      onCancel?: () => void;
      confirmLabel?: string;
      cancelLabel?: string;
    }
  ) => globalToastHandler?.confirm(title, description, callbacks) ?? "",
  dismiss: (id: string) => globalToastHandler?.dismiss(id),
  dismissAll: () => globalToastHandler?.dismissAll(),
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback((options: ToastOptions): string => {
    const id = options.id || `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastItem = {
      ...options,
      id,
      createdAt: Date.now(),
      type: options.type || "info",
      duration: options.type === "confirm" || options.type === "loading" ? 0 : (options.duration ?? 4500),
    };

    setToasts((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      return [...filtered, newToast];
    });

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, newToast.duration);
    }

    return id;
  }, [dismiss]);

  const success = useCallback(
    (title: string, description?: string, options?: Partial<ToastOptions>) =>
      addToast({ ...options, title, description, type: "success" }),
    [addToast]
  );

  const error = useCallback(
    (title: string, description?: string, options?: Partial<ToastOptions>) =>
      addToast({ ...options, title, description, type: "error" }),
    [addToast]
  );

  const info = useCallback(
    (title: string, description?: string, options?: Partial<ToastOptions>) =>
      addToast({ ...options, title, description, type: "info" }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, description?: string, options?: Partial<ToastOptions>) =>
      addToast({ ...options, title, description, type: "warning" }),
    [addToast]
  );

  const loading = useCallback(
    (title: string, description?: string, options?: Partial<ToastOptions>) =>
      addToast({ ...options, title, description, type: "loading" }),
    [addToast]
  );

  const confirm = useCallback(
    (
      title: string,
      description: string | undefined,
      callbacks: {
        onConfirm: () => void;
        onCancel?: () => void;
        confirmLabel?: string;
        cancelLabel?: string;
      }
    ) =>
      addToast({
        title,
        description,
        type: "confirm",
        onConfirm: callbacks.onConfirm,
        onCancel: callbacks.onCancel,
        confirmLabel: callbacks.confirmLabel || "Confirm",
        cancelLabel: callbacks.cancelLabel || "Cancel",
      }),
    [addToast]
  );

  const contextValue: ToastContextValue = {
    toast: addToast,
    success,
    error,
    info,
    warning,
    loading,
    confirm,
    dismiss,
    dismissAll,
  };

  useEffect(() => {
    globalToastHandler = contextValue;
    return () => {
      globalToastHandler = null;
    };
  }, [contextValue]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Container Floating Element */}
      <aside
        aria-label="Notifications"
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === "error" || t.type === "confirm" ? "alert" : "status"}
            className="pointer-events-auto flex w-full flex-col rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 font-serif"
            style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                {t.type === "success" && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
                {t.type === "error" && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                )}
                {t.type === "warning" && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                )}
                {t.type === "info" && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                    <Info className="h-4 w-4" />
                  </div>
                )}
                {t.type === "loading" && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-50 text-[#f05a28] border border-orange-200">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {t.type === "confirm" && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#f05a28]/10 text-[#f05a28] border border-[#f05a28]/30">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-sm font-bold text-neutral-900 leading-tight">
                  {t.title}
                </h4>
                {t.description && (
                  <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                    {t.description}
                  </p>
                )}

                {/* Confirmation Actions */}
                {t.type === "confirm" && (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        t.onConfirm?.();
                        dismiss(t.id);
                      }}
                      className="rounded-lg bg-[#f05a28] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#d04618] transition-colors"
                    >
                      {t.confirmLabel || "Confirm"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        t.onCancel?.();
                        dismiss(t.id);
                      }}
                      className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      {t.cancelLabel || "Cancel"}
                    </button>
                  </div>
                )}
              </div>

              {t.type !== "confirm" && (
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
