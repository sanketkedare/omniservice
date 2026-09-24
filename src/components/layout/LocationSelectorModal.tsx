"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Check, X, Loader2 } from "lucide-react";
import { useGeolocation, DEFAULT_HYDERABAD_COORDINATES, checkHyderabadRadius } from "@/lib/geolocation";
import { toast } from "@/components/ui/Toast";

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_ZONES = [
  { name: "Ameerpet, Hyderabad (Central Hub)", lat: 17.4375, lng: 78.4482 },
  { name: "Banjara Hills, Hyderabad", lat: 17.4156, lng: 78.4357 },
  { name: "Hitec City, Hyderabad", lat: 17.4474, lng: 78.3762 },
  { name: "Gachibowli, Hyderabad", lat: 17.4401, lng: 78.3489 },
  { name: "Madhapur, Hyderabad", lat: 17.4483, lng: 78.3915 },
  { name: "Jubilee Hills, Hyderabad", lat: 17.4319, lng: 78.4073 },
  { name: "Kondapur, Hyderabad", lat: 17.4699, lng: 78.3578 },
  { name: "Secunderabad", lat: 17.4399, lng: 78.4983 },
  { name: "Kukatpally, Hyderabad", lat: 17.4938, lng: 78.4018 },
];

export function LocationSelectorModal({ isOpen, onClose }: LocationSelectorModalProps) {
  const { locality, coordinates, detectLocation, setManualLocation, isLoading, permissionDenied, permissionState } = useGeolocation();
  const [customInput, setCustomInput] = useState("");

  const radiusCheck = checkHyderabadRadius(coordinates);

  if (!isOpen) return null;

  const handleAutoDetect = async () => {
    toast.info("Detecting Location...", "Requesting GPS from your device");
    const coords = await detectLocation();
    if (coords) {
      const check = checkHyderabadRadius(coords);
      if (!check.isWithinRadius) {
        toast.warning(
          "Outside Active Service Zone",
          `You appear to be ${check.distanceKm} km from Hyderabad. Routed to nearest operating hub: ${check.nearestHub}`
        );
      } else {
        toast.success("Location Verified", `Within Greater Hyderabad active radius (${check.nearestHub})`);
      }
      onClose();
    } else {
      toast.warning("Location Unavailable", "Using default Hyderabad hub");
    }
  };

  const handleSelectZone = (zone: { name: string; lat: number; lng: number }) => {
    setManualLocation(zone.name, { lat: zone.lat, lng: zone.lng, accuracy: 10 });
    toast.success("Location Updated", `Active zone set to ${zone.name}`);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const clean = customInput.trim();
    setManualLocation(clean, coordinates || DEFAULT_HYDERABAD_COORDINATES);
    toast.success("Location Set", `Active zone set to ${clean}`);
    setCustomInput("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-serif">
      <div className="relative w-full max-w-md rounded-3xl border border-orange-200 bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-orange-100">
          <div className="flex items-center gap-2 text-[#2d130a]">
            <MapPin className="h-5 w-5 text-[#f05a28]" />
            <h3 className="text-base font-bold">Select Your Service Area</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* GPS Permission Alert Banner if Denied */}
        {permissionDenied && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <span>⚠️</span> GPS Location Access Denied
            </span>
            <p className="text-[11px] text-amber-800 leading-normal">
              Your browser has denied GPS permission. OmniService is currently using Hyderabad as default. You can permit location in browser settings or choose a specific neighborhood below.
            </p>
          </div>
        )}

        {/* Current Active Location Display */}
        <div className="rounded-2xl border border-orange-200/80 bg-orange-50/50 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                Active Selected Area
              </span>
              <span className="text-xs font-bold text-[#c2410c]">{locality}</span>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              radiusCheck.isWithinRadius ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}>
              {radiusCheck.isWithinRadius ? "In Service Zone" : "Hub Routed"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 font-sans border-t border-orange-100 pt-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              {radiusCheck.isWithinRadius
                ? `Verified in Greater Hyderabad (${radiusCheck.nearestHub} • within 45km radius)`
                : `User is ${radiusCheck.distanceKm}km away. Serving via closest ${radiusCheck.nearestHub}`}
            </span>
          </div>
        </div>

        {/* One-Click GPS Auto Detect */}
        <button
          type="button"
          onClick={handleAutoDetect}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f05a28] to-[#ea580c] py-3 px-4 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:from-[#ea580c] hover:to-[#c2410c] transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Detecting GPS Coordinates...</span>
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              <span>Auto-Detect My Current GPS Location</span>
            </>
          )}
        </button>

        {/* Popular Areas in Hyderabad */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-neutral-600">Popular Service Zones:</span>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_ZONES.map((zone) => {
              const isCurrent = locality.toLowerCase().includes(zone.name.toLowerCase().split(",")[0] || "");
              return (
                <button
                  key={zone.name}
                  type="button"
                  onClick={() => handleSelectZone(zone)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left border transition-all ${
                    isCurrent
                      ? "border-[#f05a28] bg-orange-50 text-[#c2410c] font-bold"
                      : "border-neutral-200 bg-white hover:border-orange-300 hover:bg-orange-50/30 text-neutral-700"
                  }`}
                >
                  <span className="truncate">{zone.name.split(",")[0]}</span>
                  {isCurrent && <Check className="h-3.5 w-3.5 text-[#f05a28] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Locality Input */}
        <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-neutral-100 flex gap-2">
          <input
            type="text"
            placeholder="Or type area (e.g. Manikonda, Hyderabad)"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-[#f05a28] focus:outline-hidden"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#2d130a] px-3.5 py-2 text-xs font-bold text-white hover:bg-black transition-colors"
          >
            Set
          </button>
        </form>
      </div>
    </div>
  );
}
