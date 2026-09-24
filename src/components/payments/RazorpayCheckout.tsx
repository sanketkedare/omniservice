"use client";

import React, { useState } from "react";
import { CreditCard, ShieldCheck, CheckCircle2, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

interface RazorpayCheckoutProps {
  amount: number; // in Rupees
  serviceName: string;
  jobId?: string;
  onSuccess: (paymentDetails: any) => void;
  onCancel?: () => void;
  className?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayCheckout({
  amount,
  serviceName,
  jobId,
  onSuccess,
  onCancel,
  className = "",
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create Razorpay order on backend
      const res = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "INR",
          notes: { serviceName, jobId: jobId || "" },
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to create payment order");
      }

      const { order } = data;
      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && window.Razorpay) {
        const options = {
          key: order.key || "rzp_test_TIpOwrfH3Ko5Xp",
          amount: order.amount,
          currency: order.currency,
          name: "OmniService AI",
          description: `TrustLock Escrow: ${serviceName}`,
          image: "/images/OmniService_Icon.png",
          order_id: order.id,
          handler: async function (response: any) {
            // Verify payment
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                jobId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success("Payment Secured", "Held safely in OmniService TrustLock Escrow.");
              onSuccess(verifyData.transaction);
            } else {
              toast.error("Payment Verification Failed", verifyData.error);
            }
          },
          prefill: {
            name: "OmniService Customer",
            email: "customer@omniservice.com",
            contact: "+919876543210",
          },
          theme: {
            color: "#f05a28",
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              onCancel?.();
            },
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        // Test mode inline fallback trigger if external script isn't reachable
        toast.info("Razorpay Test Mode Active", "Executing automated test verification...");
        setTimeout(async () => {
          const verifyRes = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: order.id,
              razorpay_payment_id: `pay_test_${Date.now()}`,
              razorpay_signature: `sig_test_${Date.now()}`,
              jobId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success("Payment Secured (Test Mode)", "Held safely in OmniService TrustLock Escrow.");
            onSuccess(verifyData.transaction);
          }
          setLoading(false);
        }, 1200);
      }
    } catch (err: any) {
      toast.error("Payment Error", err.message || "Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className={`bg-gradient-to-r from-[#f05a28] to-amber-600 hover:from-[#d04618] hover:to-amber-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-serif ${className}`}
      style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Processing Payment...
        </>
      ) : (
        <>
          <Lock className="h-4 w-4 text-white/90" /> Pay ₹{amount} with Razorpay (Test Key)
        </>
      )}
    </Button>
  );
}
