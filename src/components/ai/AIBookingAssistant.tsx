"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, Clock, MapPin, CheckCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RazorpayCheckout } from "@/components/payments/RazorpayCheckout";
import { toast } from "@/components/ui/Toast";

interface ServiceOption {
  id: string;
  name: string;
  category: string;
  estimatedPrice: number;
  duration: string;
  matchingPros: number;
  recommendedTime: string;
}

export function AIBookingAssistant({
  onBookingComplete,
}: {
  onBookingComplete?: (booking: any) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState("Appliance Repair");
  const [issueDescription, setIssueDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<ServiceOption | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleAnalyze = () => {
    if (!issueDescription.trim()) {
      toast.error("Input Required", "Please describe your service requirement.");
      return;
    }
    setAnalyzing(true);
    setRecommendation(null);
    setBookingConfirmed(false);

    setTimeout(() => {
      setAnalyzing(false);
      setRecommendation({
        id: `srv_${Date.now()}`,
        name: `AI Optimized: ${selectedCategory}`,
        category: selectedCategory,
        estimatedPrice: 799,
        duration: "45 - 60 Mins",
        matchingPros: 14,
        recommendedTime: "Today at 05:00 PM (Optimal Slot)",
      });
      toast.success("AI Recommendation Ready", "Matches 14 verified technicians near you.");
    }, 1200);
  };

  const handlePaymentSuccess = (transaction: any) => {
    const bookingRecord = {
      id: `bk_${Date.now()}`,
      service: recommendation?.name,
      amount: recommendation?.estimatedPrice,
      status: "CONFIRMED",
      paymentTransaction: transaction,
      timestamp: new Date().toISOString(),
    };

    setBookingConfirmed(true);
    toast.success("AI Booking Confirmed!", "Service provider notified in real-time.");
    onBookingComplete?.(bookingRecord);
  };

  return (
    <Card className="border-orange-200/80 shadow-xl bg-gradient-to-br from-white via-orange-50/20 to-amber-50/30 overflow-hidden font-serif" style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}>
      <CardHeader className="bg-gradient-to-r from-[#1b0802] to-[#2b1005] text-white p-5 border-b border-orange-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#f05a28] to-amber-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                OmniService Instant AI Booking
              </CardTitle>
              <p className="text-xs text-orange-200/80">AI slot allocation & instant Razorpay escrow locking</p>
            </div>
          </div>
          <Badge className="bg-[#f05a28] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1">
            Zero Wait
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {!bookingConfirmed ? (
          <>
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">Select Service Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Appliance Repair", "Electrical Work", "Plumbing Inspection", "RO / Water Purifier"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all text-center ${
                      selectedCategory === cat
                        ? "border-[#f05a28] bg-[#f05a28]/10 text-[#f05a28] shadow-sm"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">Describe Issue / Need</label>
              <textarea
                rows={3}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="e.g. Washing machine not draining water properly, need urgent repair in Madhapur..."
                className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#f05a28]/50 bg-white text-neutral-900 placeholder:text-neutral-400"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full bg-[#f05a28] hover:bg-[#d04618] text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {analyzing ? "AI Analyzing Slot Availability..." : "Find Best AI Slot & Rate"}
            </Button>

            {recommendation && (
              <div className="p-4 rounded-2xl bg-white border border-orange-200 shadow-md space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{recommendation.name}</h4>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3 text-[#f05a28]" /> {recommendation.recommendedTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-[#f05a28]">₹{recommendation.estimatedPrice}</span>
                    <span className="block text-[10px] text-neutral-400">Fixed Transparent Quote</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" /> TrustLock Escrow Protected
                  </span>
                  <span className="font-semibold text-neutral-700">{recommendation.matchingPros} Pros Nearby</span>
                </div>

                {/* Razorpay Test Mode Payment Button */}
                <RazorpayCheckout
                  amount={recommendation.estimatedPrice}
                  serviceName={recommendation.name}
                  onSuccess={handlePaymentSuccess}
                  className="w-full"
                />
              </div>
            )}
          </>
        ) : (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Booking & Payment Confirmed!</h3>
              <p className="text-xs text-neutral-600 max-w-md mx-auto mt-1">
                Your payment is safely locked in OmniService TrustLock Escrow. The technician is dispatched.
              </p>
            </div>
            <Button
              onClick={() => {
                setBookingConfirmed(false);
                setRecommendation(null);
                setIssueDescription("");
              }}
              variant="outline"
              className="text-xs border-orange-200 text-[#f05a28]"
            >
              Book Another Service
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
