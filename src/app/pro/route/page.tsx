"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Navigation,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  Phone,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Play,
  RotateCcw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ProfessionalRoutePage() {
  const router = useRouter();
  const [distanceRemaining, setDistanceRemaining] = useState(1.8);
  const [minutesRemaining, setMinutesRemaining] = useState(6);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasArrived, setHasArrived] = useState(false);
  const [isMarkingArrived, setIsMarkingArrived] = useState(false);

  const waypoints = [
    { instruction: "Head east on Ameerpet Main Road toward Metro Station", distance: "0.5 km", time: "2 min" },
    { instruction: "Turn right toward SR Nagar junction", distance: "0.9 km", time: "3 min" },
    { instruction: "Turn left at Sea Green Apartments gate, Ameerpet (Code: 4819)", distance: "0.4 km", time: "1 min" },
  ];

  // Simulation tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating && !hasArrived) {
      interval = setInterval(() => {
        setDistanceRemaining((prev) => {
          const next = Math.max(0, Math.round((prev - 0.3) * 10) / 10);
          if (next === 0) {
            setHasArrived(true);
            setIsSimulating(false);
            setMinutesRemaining(0);
          } else {
            setMinutesRemaining((m) => Math.max(1, m - 1));
            if (next <= 1.2 && currentStepIndex === 0) setCurrentStepIndex(1);
            if (next <= 0.4 && currentStepIndex === 1) setCurrentStepIndex(2);
          }
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isSimulating, hasArrived, currentStepIndex]);

  const handleMarkArrived = async () => {
    setIsMarkingArrived(true);
    try {
      await fetch("/api/jobs/65f01234567890abcdef6001/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "arrived" }),
      });
      setHasArrived(true);
      setDistanceRemaining(0);
      setMinutesRemaining(0);
    } catch {
      // Offline fallback
      setHasArrived(true);
    } finally {
      setIsMarkingArrived(false);
    }
  };

  const handleResetSimulation = () => {
    setDistanceRemaining(1.8);
    setMinutesRemaining(6);
    setCurrentStepIndex(0);
    setHasArrived(false);
    setIsSimulating(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-6 text-neutral-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/pro/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant={hasArrived ? "success" : "brand"} dot size="sm">
            {hasArrived ? "ARRIVED AT PROPERTY" : "EN ROUTE • LIVE GPS"}
          </Badge>
        </div>
      </div>

      {/* Main HUD Navigation Display */}
      <Card className="bg-white border-2 border-orange-100 overflow-hidden shadow-xl shadow-orange-950/5">
        {/* Simulated Route Visualization Header */}
        <div className="relative h-64 sm:h-80 w-full bg-gradient-to-b from-[#fff5eb] via-white to-[#ffeedb] flex flex-col justify-between p-6 border-b border-orange-100 text-neutral-900 rounded-t-2xl">
          {/* Subtle Grid Map Lines */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f05a28_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top HUD Stats */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#f05a28] p-3 text-white shadow-lg shadow-orange-500/20">
                <Navigation className="h-6 w-6" />
              </div>
              <div>
                <span className="text-2xl font-black font-mono text-[#2d130a] block leading-none">
                  {distanceRemaining} km
                </span>
                <span className="text-xs text-neutral-600 font-medium">
                  {hasArrived ? "You have reached destination" : `${minutesRemaining} min ETA (Ameerpet, Hyderabad Traffic)`}
                </span>
              </div>
            </div>

            <div className="text-right">
              <Badge variant="outline" size="sm" className="bg-white/90 text-neutral-800 border-neutral-200 shadow-xs font-mono">
                SPEED: {hasArrived ? "0 km/h" : isSimulating ? "28 km/h" : "18 km/h"}
              </Badge>
            </div>
          </div>

          {/* Current Waypoint Banner */}
          <div className="relative z-10 rounded-2xl bg-white/95 border border-orange-200/80 p-4 shadow-md backdrop-blur-md">
            <div className="flex items-start gap-3">
              <Compass className="h-5 w-5 text-[#f05a28] shrink-0 mt-0.5 animate-spin-slow" />
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 block">
                  Next Maneuver
                </span>
                <p className="text-sm font-bold text-[#2d130a] leading-tight">
                  {hasArrived
                    ? "Destination reached: Flat 402, Sea Green Apartments, Ameerpet."
                    : waypoints[currentStepIndex]?.instruction || ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Destination Details */}
        <div className="p-6 space-y-6 bg-white">
          {/* Destination Address & Customer Card */}
          <div className="rounded-2xl bg-[#fffaf5] border border-orange-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#f05a28]" />
                <span className="text-xs font-bold text-neutral-500">Destination</span>
              </div>
              <p className="text-base font-bold text-[#2d130a]">
                Flat 402, Sea Green Apartments
              </p>
              <p className="text-xs text-neutral-500">
                Main Road, Ameerpet, Hyderabad • Gate Code: 4819
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a href="tel:+918624851910">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Phone className="h-3.5 w-3.5" />}
                  className="border-neutral-200 bg-white text-neutral-800 text-xs hover:bg-neutral-100 shadow-xs"
                >
                  Call Sanket
                </Button>
              </a>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<MessageSquare className="h-3.5 w-3.5" />}
                className="border-neutral-200 bg-white text-neutral-800 text-xs hover:bg-neutral-100 shadow-xs"
              >
                SMS
              </Button>
            </div>
          </div>

          {/* Turn-by-Turn Waypoint List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-neutral-600 block">Route Waypoints:</span>
            <div className="space-y-2">
              {waypoints.map((step, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-3 text-xs flex items-center justify-between border transition-all ${
                    hasArrived || idx < currentStepIndex
                      ? "bg-emerald-50/60 border-emerald-200 text-neutral-500 line-through opacity-70"
                      : idx === currentStepIndex
                      ? "bg-orange-50/70 border-[#f05a28]/60 text-neutral-900 font-semibold shadow-xs"
                      : "bg-white border-neutral-200 text-neutral-600"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      idx === currentStepIndex
                        ? "bg-[#f05a28] text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}>
                      {idx + 1}
                    </span>
                    <span>{step.instruction}</span>
                  </div>
                  <span className="font-mono text-[11px] text-neutral-500">{step.distance}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-neutral-200">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                leftIcon={isSimulating ? <Clock className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                onClick={() => setIsSimulating(!isSimulating)}
                disabled={hasArrived}
                className="text-neutral-600 hover:text-neutral-900 text-xs"
              >
                {isSimulating ? "Pause Simulation" : "Simulate Drive"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                onClick={handleResetSimulation}
                className="text-neutral-600 hover:text-neutral-900 text-xs"
              >
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {hasArrived ? (
                <Link href="/pro/jobs">
                  <Button
                    size="default"
                    variant="brand"
                    leftIcon={<CheckCircle2 className="h-4 w-4" />}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 font-bold"
                  >
                    Proceed to Job Checklist
                  </Button>
                </Link>
              ) : (
                <Button
                  size="default"
                  variant="brand"
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  onClick={handleMarkArrived}
                  disabled={isMarkingArrived}
                  className="w-full sm:w-auto font-bold shadow-lg shadow-orange-500/20"
                >
                  {isMarkingArrived ? "Notifying Customer..." : "Tap to Mark Arrived"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
