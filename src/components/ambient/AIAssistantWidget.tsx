"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Wrench,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  category?: string;
  cost?: string;
  draft?: {
    title: string;
    category: string;
    symptomSummary?: string;
    urgency: string;
    estimatedCostPaise: number;
  };
}

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your InspectAI Diagnostic Assistant. Describe any leak, noise, or electrical trip, and I'll estimate parts and find nearby certified specialists.",
    },
  ]);

  const quickPrompts = [
    "AC blowing warm air",
    "Sink pipe leaking under counter",
    "MCB trips when geyser is switched on",
  ];

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMsg: ChatMsg = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ambient/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const info = data.data;
        const assistantMsg: ChatMsg = {
          role: "assistant",
          content: info.reply,
          category: info.detectedCategory,
          cost: info.estimatedCostRange
            ? `₹${(info.estimatedCostRange.minPaise / 100).toLocaleString("en-IN")} - ₹${(info.estimatedCostRange.maxPaise / 100).toLocaleString("en-IN")}`
            : undefined,
          draft: info.serviceRequestDraft,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm currently having trouble connecting to InspectAI. You can still initiate intake on the new-request page.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Chat Drawer */}
      {isOpen ? (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white border border-neutral-200/90 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-900 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Top Bar */}
          <div className="px-4 py-3 bg-neutral-50/90 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>InspectAI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-[10px] text-neutral-500">Live Multimodal Triage</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md transition"
              aria-label="Close Assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs bg-[#fafafa]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed shadow-xs ${
                    m.role === "user"
                      ? "bg-[#f05a28] text-white rounded-br-none"
                      : "bg-white text-neutral-800 border border-neutral-200/80 rounded-bl-none"
                  }`}
                >
                  {m.content}
                </div>

                {/* Detected Category and CTA Pill */}
                {m.draft && (
                  <div className="mt-2 p-2.5 rounded-xl bg-orange-50/70 border border-[#f05a28]/30 max-w-[90%] space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <Badge variant="brand" size="sm">
                        {m.category?.toUpperCase() || "TRADE"}
                      </Badge>
                      {m.cost && (
                        <span className="font-mono text-emerald-700 font-bold">{m.cost}</span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-neutral-900 truncate">
                      {m.draft.title}
                    </div>
                    <Link
                      href={`/customer/new-request?category=${m.draft.category}&desc=${encodeURIComponent(m.draft.symptomSummary || "")}`}
                      className="block"
                    >
                      <Button size="sm" variant="brand" className="w-full text-[11px] py-1">
                        Book Diagnostic with this Scope
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-500 text-[11px] flex items-center gap-2 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 animate-spin text-[#f05a28]" />
                Analyzing diagnostic telemetry...
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-neutral-50 border-t border-neutral-200 flex gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-xs transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-neutral-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe symptoms (e.g. leaking valve)..."
              className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#f05a28]"
            />
            <Button
              type="submit"
              size="sm"
              disabled={loading || !input.trim()}
              className="bg-[#f05a28] hover:bg-orange-600 text-white px-3 py-2 rounded-xl"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      ) : (
        /* Floating Trigger Pill */
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white font-bold text-xs shadow-xl shadow-orange-950/50 hover:scale-105 transition-all active:scale-95 border border-amber-400/40"
          aria-label="Open AI Assistant"
        >
          <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-amber-200 group-hover:rotate-12 transition-transform" />
          </div>
          <span>InspectAI Assistant</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
        </button>
      )}
    </div>
  );
}
