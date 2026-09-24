"use client";

import React, { useState, useEffect } from "react";
import { Download, Smartphone, Check, Sparkles, X } from "lucide-react";
import { toast } from "@/components/ui/Toast";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallButton({
  variant = "navbar",
  className = "",
  onClick,
}: {
  variant?: "navbar" | "hero" | "banner" | "floating";
  className?: string;
  onClick?: () => void;
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone installed mode
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast.success("OmniService Installed", "App successfully added to your device homescreen!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    onClick?.();
    if (isInstalled) {
      toast.info("Already Installed", "OmniService AI is already installed on your device.");
      return;
    }

    // If native prompt is captured (Chrome / Android / Desktop)
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setIsInstalled(true);
          toast.success("Installing OmniService AI", "Adding to homescreen...");
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error("Install prompt error:", err);
      }
      return;
    }

    // If iOS Safari or unsupported direct prompt
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      setShowIOSModal(true);
    } else {
      toast.info(
        "Install OmniService App",
        "Click your browser's menu (⋮ or ⊕) and select 'Add to Home Screen' or 'Install App'."
      );
    }
  };

  if (isInstalled && (variant === "navbar" || variant === "floating")) {
    return null;
  }

  return (
    <>
      {variant === "floating" && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`group flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 dark:bg-neutral-900/95 text-neutral-800 dark:text-neutral-200 text-xs font-bold border border-orange-200/80 dark:border-neutral-700 shadow-md shadow-orange-950/10 hover:border-[#f05a28] hover:text-[#f05a28] transition-all cursor-pointer ${className}`}
          title="Install OmniService App"
        >
          <div className="h-6 w-6 rounded-full bg-[#f05a28]/10 flex items-center justify-center text-[#f05a28] group-hover:scale-110 transition-transform">
            <Download className="h-3.5 w-3.5" />
          </div>
          <span>Install App</span>
        </button>
      )}

      {variant === "navbar" && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-300 bg-orange-50 text-[#c2410c] hover:bg-orange-100 hover:border-orange-400 transition-all shadow-xs cursor-pointer ${className}`}
          title="Install OmniService App"
        >
          <Download className="h-3.5 w-3.5 text-[#f05a28]" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">App</span>
        </button>
      )}

      {variant === "hero" && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-orange-300 bg-white/95 px-6 py-3.5 text-sm font-bold text-[#c2410c] shadow-md shadow-orange-900/5 hover:bg-orange-50 hover:border-orange-400 transition-all cursor-pointer ${className}`}
        >
          <Download className="h-4 w-4 text-[#f05a28]" />
          <span>{isInstalled ? "App Installed" : "Install App"}</span>
        </button>
      )}

      {variant === "banner" && (
        <div className={`rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 p-4 flex items-center justify-between gap-4 shadow-sm ${className}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f05a28]/10 text-[#f05a28]">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900">
                Install OmniService Mobile App
              </h4>
              <p className="text-[11px] text-neutral-500">
                15-second offline video diagnostics, live technician GPS tracking & zero install size.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-[#f05a28] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#ea580c] transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Install App</span>
          </button>
        </div>
      )}

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-serif">
          <div className="relative w-full max-w-sm rounded-3xl border border-orange-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-orange-100">
              <div className="flex items-center gap-2 text-[#2d130a]">
                <Smartphone className="h-5 w-5 text-[#f05a28]" />
                <h3 className="text-sm font-bold">Install on iPhone / iPad</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="rounded-full p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ol className="text-xs text-neutral-700 space-y-2.5 list-decimal list-inside font-sans">
              <li>Open this website in <strong>Safari</strong> browser.</li>
              <li>Tap the <strong>Share</strong> button (box with an arrow up at bottom of screen).</li>
              <li>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.</li>
              <li>Tap <strong>&quot;Add&quot;</strong> in the top right corner.</li>
            </ol>
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full rounded-xl bg-[#f05a28] py-2 text-xs font-bold text-white hover:bg-[#ea580c]"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
