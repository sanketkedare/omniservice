"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Loader2,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  User,
  Bot,
  Zap,
  CheckCircle,
} from "lucide-react";

interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  category?: string;
  urgency?: string;
  costRange?: { minPaise: number; maxPaise: number };
  followUps?: string[];
  draft?: {
    title: string;
    category: string;
    estimatedCostPaise: number;
  };
}

const MAX_FREE_MESSAGES = 5;

const QUICK_PROMPTS = [
  "Split AC is blowing warm air and humming",
  "MCB trips when water geyser is switched on",
  "Kitchen sink pipe is leaking from coupling",
  "Water purifier TDS is high and beeping",
];

export function HomeDiagnosticChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [isAuth, setIsAuth] = useState(false);
  const [hasPromptedOpen, setHasPromptedOpen] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize usage counter & auth status from client storage
  useEffect(() => {
    try {
      const storedCount = localStorage.getItem("omniservice_device_chat_count");
      if (storedCount) {
        setDeviceCount(parseInt(storedCount, 10) || 0);
      }
      const storedUser = localStorage.getItem("omniservice_user");
      if (storedUser) {
        setIsAuth(true);
      }
    } catch {
      // Storage access error
    }

    // Default welcome message
    setMessages([
      {
        id: "welcome_0",
        role: "assistant",
        content:
          "Hello! I am OmniService InspectAI. Describe any home appliance, plumbing, or electrical issue, and I will diagnose likely causes, safety risks, and fair-market price ceilings.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        followUps: QUICK_PROMPTS,
      },
    ]);
  }, []);

  // Scroll to bottom on message update
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const remaining = isAuth ? 999 : Math.max(0, MAX_FREE_MESSAGES - deviceCount);
  const isLimitReached = !isAuth && deviceCount >= MAX_FREE_MESSAGES;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    if (isLimitReached) {
      setIsOpen(true);
      return;
    }

    const userMsg: ChatMsg = {
      id: `user_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome_0")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/ambient/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.limitReached) {
          setDeviceCount(MAX_FREE_MESSAGES);
          localStorage.setItem("omniservice_device_chat_count", String(MAX_FREE_MESSAGES));
        }
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: "assistant",
            content:
              json.message ||
              "I encountered an error connecting to our diagnostic model. Please try again or book a certified diagnostic inspection.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        return;
      }

      const data = json.data;
      const newCount = json.freeCount ?? (deviceCount + 1);
      if (!isAuth) {
        setDeviceCount(newCount);
        localStorage.setItem("omniservice_device_chat_count", String(newCount));
      }

      const assistantMsg: ChatMsg = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        content: data.reply || "I have analyzed your symptom description.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        category: data.detectedCategory,
        urgency: data.detectedUrgency,
        costRange: data.estimatedCostRange,
        followUps: data.suggestedFollowUp,
        draft: data.serviceRequestDraft,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content:
            "Connectivity hiccup while contacting our diagnostic engine. Please verify your network or book a visit directly.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Floating Launcher Button ──────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Diagnostic Chat"
            className="group flex items-center gap-3 rounded-full border-2 border-orange-300/90 bg-gradient-to-r from-white via-orange-50 to-white pl-4 pr-5 py-2.5 shadow-2xl shadow-orange-950/20 hover:scale-103 hover:border-[#f05a28] transition-all backdrop-blur-md"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f05a28] to-[#ea580c] text-white shadow-md shadow-orange-500/30 group-hover:rotate-6 transition-transform">
              <Bot className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-left">
              <span className="block text-xs font-black text-[#2d130a] leading-tight">
                Ask InspectAI™
              </span>
              <span className="block text-[10px] font-semibold text-[#c2410c]">
                {isAuth
                  ? "Unlimited Pro Access"
                  : `${remaining} free diagnostic ${remaining === 1 ? "msg" : "msgs"}`}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* ── Chat Modal / Floating Drawer ─────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] max-h-[640px] h-[82vh] rounded-3xl border-2 border-orange-200/90 bg-white/98 backdrop-blur-2xl shadow-2xl shadow-orange-950/25 flex flex-col overflow-hidden font-serif animate-in fade-in slide-in-from-bottom-6 duration-200"
          style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-[#fff7ed] via-white to-[#fff3e8] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f05a28] to-[#ea580c] text-white shadow-sm shadow-orange-500/30">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#2d130a]">InspectAI™ Assistant</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Ameerpet &amp; Greater Hyderabad Diagnostics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-neutral-400 hover:bg-orange-100/60 hover:text-neutral-700 transition-colors"
                aria-label="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quota Banner */}
          <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 px-4 py-2 border-b border-orange-200/50 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#7c2d12] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#f05a28]" />
              {isAuth ? (
                "Verified Account: Unlimited Diagnostics"
              ) : (
                <>Device Free Preview: <strong className="text-[#c2410c]">{remaining} / {MAX_FREE_MESSAGES} left</strong></>
              )}
            </span>
            {!isAuth && (
              <Link
                href="/login"
                className="text-[10px] font-bold text-[#f05a28] hover:underline"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#faf8f5] to-white">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/20 text-[#f05a28] mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-[#f05a28] to-[#ea580c] text-white rounded-br-xs"
                      : "bg-white border border-orange-100/90 text-neutral-800 rounded-bl-xs shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {/* Diagnostic Findings Card */}
                  {m.draft && (
                    <div className="mt-3 rounded-xl border border-orange-200/80 bg-[#fffbf7] p-2.5 space-y-1.5 text-neutral-800">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#c2410c]">
                        <span>Diagnostic Triage</span>
                        <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-orange-800">
                          {m.category || "General"}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-[#2d130a]">{m.draft.title}</div>
                      {m.costRange && (
                        <div className="text-[11px] text-emerald-700 font-bold">
                          Est. Price: ₹{(m.costRange.minPaise / 100).toLocaleString("en-IN")} – ₹{(m.costRange.maxPaise / 100).toLocaleString("en-IN")}
                        </div>
                      )}
                      <Link
                        href="/register"
                        className="mt-2 inline-flex items-center justify-center gap-1 w-full rounded-lg bg-[#f05a28] px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#d04618] transition-colors"
                      >
                        <span>Lock Price &amp; Dispatch Pro</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}

                  {/* Follow-up Prompt Chips */}
                  {m.followUps && m.followUps.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.followUps.map((chip, i) => (
                        <button
                          key={i}
                          type="button"
                          disabled={loading || isLimitReached}
                          onClick={() => handleSendMessage(chip)}
                          className="rounded-lg border border-orange-200/90 bg-orange-50/70 px-2.5 py-1 text-[10px] font-semibold text-[#7c2d12] hover:bg-orange-100 hover:border-[#f05a28] transition-colors text-left disabled:opacity-50"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block mt-1.5 text-[9px] ${
                      m.role === "user" ? "text-orange-100 text-right" : "text-neutral-400"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {m.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-neutral-200 text-neutral-700 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-neutral-500 text-xs italic pl-9">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#f05a28]" />
                <span>InspectAI is analyzing symptoms across models...</span>
              </div>
            )}

            {/* Limit Reached Card */}
            {isLimitReached && (
              <div className="rounded-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 p-4 space-y-2.5 text-center shadow-xs">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#f05a28]/10 text-[#f05a28]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-black text-[#2d130a]">
                  5 Free Diagnostic Messages Reached
                </h4>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Sign in or create your free account to continue unlimited AI diagnostics, lock guaranteed price ceilings, and dispatch certified local specialists.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <Link
                    href="/login"
                    className="rounded-xl border border-orange-300 bg-white px-3.5 py-1.5 text-xs font-bold text-[#c2410c] hover:bg-orange-50 transition-colors shadow-2xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-xl bg-gradient-to-r from-[#f05a28] to-[#ea580c] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:from-[#ea580c] hover:to-[#c2410c] transition-all"
                  >
                    Create Free Account
                  </Link>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-orange-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              disabled={loading || isLimitReached}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isLimitReached
                  ? "Sign in to continue unlimited chat..."
                  : "Describe symptom (e.g. AC compressor humming, water leaking)..."
              }
              className="flex-1 rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#f05a28] focus:ring-1 focus:ring-[#f05a28] disabled:bg-neutral-100 disabled:cursor-not-allowed"
            />

            <button
              type="submit"
              disabled={loading || !inputText.trim() || isLimitReached}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#f05a28] to-[#ea580c] text-white shadow-xs hover:from-[#ea580c] hover:to-[#c2410c] disabled:opacity-40 transition-all"
              aria-label="Send Message"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
