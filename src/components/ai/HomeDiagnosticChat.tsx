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
  Trash2,
  Camera,
  Paperclip,
  ShieldAlert,
} from "lucide-react";
import { PWAInstallButton } from "@/components/shared/PWAInstallButton";

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
  mediaAnalysis?: {
    whatAiSaw: string;
    issueDetected: boolean;
    noIssueMessage?: string;
    problemTitle?: string;
    likelyRootCause?: string;
    suggestedActions?: string[];
  };
}

const MAX_FREE_MESSAGES = 5;

const QUICK_PROMPTS = [
  "Split AC is blowing warm air and humming",
  "MCB trips when water geyser is switched on",
  "Kitchen sink pipe is leaking from coupling",
  "Water purifier TDS is high and beeping",
];

export function HomeDiagnosticChat({ disabled = false }: { disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [isAuth, setIsAuth] = useState(false);
  const [hasPromptedOpen, setHasPromptedOpen] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearChat = () => {
    try {
      localStorage.removeItem("omniservice_diagnostic_chat");
    } catch {}
    setMessages([
      {
        id: "welcome_0",
        role: "assistant",
        content:
          "Hello! I am InspectAI, your real-time home diagnostic engineer. Type a problem symptom or upload a photo/video for instant MVP visual verification.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  useEffect(() => {
    try {
      const authStored = localStorage.getItem("omniservice_user");
      if (authStored) setIsAuth(true);

      const savedChat = localStorage.getItem("omniservice_diagnostic_chat");
      if (savedChat) {
        setMessages(JSON.parse(savedChat));
      } else {
        handleClearChat();
      }

      const count = parseInt(localStorage.getItem("omniservice_device_chat_count") || "0", 10);
      setDeviceCount(count);
    } catch {}
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      try {
        localStorage.setItem("omniservice_diagnostic_chat", JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length <= 1) {
      const timer = setTimeout(() => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === "auto_prompt_0")) return prev;
          return [
            ...prev,
            {
              id: "auto_prompt_0",
              role: "assistant",
              content: "Tip: Upload a clear photo/video of your AC unit, pipe leak, or electrical board to run instant visual AI verification.",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ];
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length]);

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
            content: json.message || "Diagnostic connection error. Please try again.",
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
          content: "Connectivity error. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userMsg: ChatMsg = {
      id: `user_upload_${Date.now()}`,
      role: "user",
      content: `📷 Uploaded photo/video: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/diagnostics/analyze-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaUrl: `/images/${file.name}`,
          mediaType: file.type.startsWith("video") ? "video" : "image",
          mimeType: file.type || "image/jpeg",
          userNotes: `Uploaded ${file.name} for AI media verification`,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to analyze photo");
      }

      const analysis = json.analysis;

      let replyText = `🔍 **What AI Saw:**\n${analysis.whatAiSaw}\n\n`;
      if (analysis.issueDetected) {
        replyText += `⚠️ **Detected Issue:** ${analysis.problemTitle}\n`;
        replyText += `**Likely Root Cause:** ${analysis.likelyRootCause}\n`;
        if (analysis.suggestedActions?.length) {
          replyText += `\n**Recommended Actions:**\n` + analysis.suggestedActions.map((a: string) => `• ${a}`).join("\n");
        }
      } else {
        replyText += `✅ **No Issue Detected:**\n${analysis.noIssueMessage}\n`;
        if (analysis.suggestedActions?.length) {
          replyText += `\n**Advice:**\n` + analysis.suggestedActions.map((a: string) => `• ${a}`).join("\n");
        }
      }

      const assistantMsg: ChatMsg = {
        id: `ai_media_${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        category: analysis.categoryLabel || "Visual Diagnostics",
        mediaAnalysis: {
          whatAiSaw: analysis.whatAiSaw,
          issueDetected: analysis.issueDetected,
          noIssueMessage: analysis.noIssueMessage,
          problemTitle: analysis.problemTitle,
          likelyRootCause: analysis.likelyRootCause,
          suggestedActions: analysis.suggestedActions,
        },
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_media_${Date.now()}`,
          role: "assistant",
          content: `Unable to inspect media: ${err.message || "Please try uploading again."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (disabled) return null;

  return (
    <>
      {/* ── Floating Launcher Column ──────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 font-serif" style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}>
        {!isOpen && (
          <>
            <PWAInstallButton variant="floating" />
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Chat with AI"
              className="group flex items-center gap-2.5 rounded-full border-2 border-orange-300/90 bg-gradient-to-r from-white via-orange-50 to-white pl-3.5 pr-4 py-2.5 shadow-2xl shadow-orange-950/20 hover:scale-105 hover:border-[#f05a28] transition-all backdrop-blur-md cursor-pointer"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#f05a28] to-[#ea580c] text-white shadow-md">
                <Bot className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-black text-[#2d130a] leading-tight">
                  Chat with AI
                </span>
                <span className="block text-[10px] font-semibold text-[#c2410c]">
                  {isAuth ? "Instant AI Support" : `${remaining} free diagnostic ${remaining === 1 ? "scan" : "scans"}`}
                </span>
              </div>
            </button>
          </>
        )}
      </div>

      {/* ── Chat Modal / Floating Drawer ─────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[440px] max-h-[640px] h-[82vh] rounded-3xl border-2 border-orange-200/90 bg-white/98 backdrop-blur-2xl shadow-2xl shadow-orange-950/25 flex flex-col overflow-hidden font-serif animate-in fade-in slide-in-from-bottom-6 duration-200"
          style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-[#fff7ed] via-white to-[#fff3e8] px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f05a28] to-[#ea580c] text-white shadow-sm shadow-orange-500/30">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#2d130a]">InspectAI Engineer</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    Vision MVP
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">Multimodal Photo & Video Verification</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleClearChat}
                className="rounded-xl p-1.5 text-neutral-400 hover:bg-orange-100/70 hover:text-red-500 transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-neutral-400 hover:bg-orange-100/70 hover:text-neutral-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages List */}
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
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-[#f05a28] to-[#ea580c] text-white rounded-br-xs"
                      : "bg-white border border-orange-200 text-neutral-800 rounded-bl-xs shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {/* Media Analysis Highlight Box */}
                  {m.mediaAnalysis && (
                    <div className="mt-3 p-3 rounded-xl border border-orange-200 bg-orange-50/60 text-neutral-900 space-y-2 text-[11px]">
                      <div className="flex items-center justify-between font-bold border-b border-orange-200 pb-1.5">
                        <span className="text-[#f05a28] flex items-center gap-1">
                          <Camera className="h-3.5 w-3.5" /> AI Photo/Video Inspection
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.mediaAnalysis.issueDetected
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {m.mediaAnalysis.issueDetected ? "Defect Detected" : "No Defect Detected"}
                        </span>
                      </div>
                      <div>
                        <strong>AI Observation:</strong> {m.mediaAnalysis.whatAiSaw}
                      </div>
                      {!m.mediaAnalysis.issueDetected && m.mediaAnalysis.noIssueMessage && (
                        <div className="text-emerald-800 bg-emerald-50 p-2 rounded-lg font-medium">
                          {m.mediaAnalysis.noIssueMessage}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-neutral-500 italic p-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#f05a28]" />
                InspectAI reading media & running diagnostic checks...
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Hidden File Input for Photo/Video Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            className="hidden"
          />

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-orange-100 bg-white flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              title="Upload Photo / Video for AI MVP Verification"
              className="p-2.5 rounded-xl border border-orange-200 text-[#f05a28] hover:bg-orange-50 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>

            <input
              type="text"
              value={inputText}
              disabled={loading}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe issue or upload photo/video..."
              className="flex-1 rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#f05a28]"
            />

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#f05a28] to-[#ea580c] text-white shadow-xs hover:from-[#ea580c] hover:to-[#c2410c] disabled:opacity-40 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
