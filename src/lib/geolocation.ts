/**
 * OmniService AI — Live Real-Time Geolocation & Reverse Geocoding Engine
 *
 * Real-time GPS location detection with high accuracy, reverse-geocoding via
 * BigDataCloud / OpenStreetMap APIs, IP-based fallback, and user location persistence.
 */

"use client";

import { useState, useEffect, useCallback } from "react";

export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface LocationInfo {
  coordinates: Coordinates;
  locality: string;
  city: string;
  state: string;
  source: "gps" | "ip" | "manual" | "default";
}

// Default Hyderabad central coordinates
export const DEFAULT_HYDERABAD_COORDINATES: Coordinates = {
  lat: 17.3850,
  lng: 78.4867,
  accuracy: 25,
};

export const HYDERABAD_MAX_RADIUS_KM = 45;

export const DEFAULT_LOCATION_INFO: LocationInfo = {
  coordinates: DEFAULT_HYDERABAD_COORDINATES,
  locality: "Hyderabad, Telangana",
  city: "Hyderabad",
  state: "Telangana",
  source: "default",
};

// Backwards compatibility alias
export const DEFAULT_MUMBAI_COORDINATES = DEFAULT_HYDERABAD_COORDINATES;

/**
 * Calculates geodesic distance between two coordinate points in KM.
 */
export function getDistanceKm(c1: Coordinates, c2: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(c2.lat - c1.lat);
  const dLng = toRad(c2.lng - c1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(c1.lat)) * Math.cos(toRad(c2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

/**
 * Validates if coordinates reside within the Greater Hyderabad operating boundary (<= 45 km radius).
 */
export function checkHyderabadRadius(coords?: Coordinates): {
  isWithinRadius: boolean;
  distanceKm: number;
  nearestHub: string;
} {
  if (!coords || typeof coords.lat !== "number" || typeof coords.lng !== "number") {
    return { isWithinRadius: true, distanceKm: 0, nearestHub: "Hyderabad Central" };
  }

  const dist = getDistanceKm(coords, DEFAULT_HYDERABAD_COORDINATES);
  const isWithinRadius = dist <= HYDERABAD_MAX_RADIUS_KM;

  // Determine closest operational hub
  let nearestHub = "Hyderabad Central (Ameerpet)";
  if (coords.lat > 17.43 && coords.lng < 78.40) nearestHub = "Hitec City / Madhapur Hub";
  else if (coords.lat > 17.42 && coords.lng < 78.36) nearestHub = "Gachibowli Financial Hub";
  else if (coords.lat > 17.41 && coords.lng > 78.41 && coords.lng < 78.47) nearestHub = "Banjara & Jubilee Hills Hub";
  else if (coords.lat > 17.44 && coords.lng > 78.48) nearestHub = "Secunderabad Hub";
  else if (coords.lat > 17.48) nearestHub = "Kukatpally North Hub";

  return {
    isWithinRadius,
    distanceKm: Math.round(dist * 10) / 10,
    nearestHub,
  };
}

/**
 * Reverse geocodes coordinates to a human-readable locality, city, and state.
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ locality: string; city: string; state: string }> {
  // 1. Try BigDataCloud Client Reverse Geocode (free, high-speed, no API key required)
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: AbortSignal.timeout(3500) }
    );
    if (res.ok) {
      const data = await res.json();
      const sub =
        data.locality ||
        data.localityInfo?.administrative?.[3]?.name ||
        data.localityInfo?.administrative?.[2]?.name;
      const city = data.city || data.localityInfo?.administrative?.[2]?.name || "Hyderabad";
      const state = data.principalSubdivision || "Telangana";
      const locality = sub && sub !== city ? `${sub}, ${city}` : city || "Hyderabad, Telangana";
      return { locality, city, state };
    }
  } catch {
    // Fall through to Nominatim
  }

  // 2. Try OpenStreetMap Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      { signal: AbortSignal.timeout(3500) }
    );
    if (res.ok) {
      const data = await res.json();
      const sub =
        data.address?.suburb ||
        data.address?.neighbourhood ||
        data.address?.residential ||
        data.address?.quarter;
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.state_district ||
        "Hyderabad";
      const state = data.address?.state || "Telangana";
      const locality = sub ? `${sub}, ${city}` : `${city}, ${state}`;
      return { locality, city, state };
    }
  } catch {
    // Fall through
  }

  // 3. Fallback based on known Hyderabad boundaries
  if (lat >= 17.2 && lat <= 17.6 && lng >= 78.2 && lng <= 78.7) {
    if (lat > 17.43 && lng > 78.35 && lng < 78.41) {
      return { locality: "Hitec City / Madhapur, Hyderabad", city: "Hyderabad", state: "Telangana" };
    }
    if (lat > 17.40 && lat <= 17.44 && lng > 78.41 && lng < 78.46) {
      return { locality: "Banjara Hills / Jubilee Hills, Hyderabad", city: "Hyderabad", state: "Telangana" };
    }
    return { locality: "Hyderabad, Telangana", city: "Hyderabad", state: "Telangana" };
  }

  return { locality: "Hyderabad, Telangana", city: "Hyderabad", state: "Telangana" };
}

/**
 * Fallback to IP-based location if GPS is denied or unavailable.
 */
export async function detectLocationByIP(): Promise<LocationInfo | null> {
  // 1. Try ipwho.is (fast, high availability, no API key, CORS friendly)
  try {
    const res = await fetch("https://ipwho.is/", {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success !== false && data.city && data.latitude && data.longitude) {
        return {
          coordinates: { lat: Number(data.latitude), lng: Number(data.longitude) },
          locality: `${data.city}, ${data.region_code || data.region || "IN"}`,
          city: data.city,
          state: data.region || "",
          source: "ip",
        };
      }
    }
  } catch {
    // Fall through
  }

  // 2. Fallback to ipapi.co
  try {
    const res = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.city && data.latitude && data.longitude) {
        return {
          coordinates: { lat: Number(data.latitude), lng: Number(data.longitude) },
          locality: `${data.city}, ${data.region_code || data.region || "IN"}`,
          city: data.city,
          state: data.region || "",
          source: "ip",
        };
      }
    }
  } catch {
    // Ignore IP fetch errors
  }
  return null;
}

/**
 * Get current browser GPS coordinates.
 */
export async function getLiveCoordinates(
  onDenied?: () => void
): Promise<Coordinates> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return DEFAULT_HYDERABAD_COORDINATES;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy),
        });
      },
      async (err) => {
        if (err.code === 1 && onDenied) {
          onDenied();
        }
        console.warn("Browser GPS prompt unavailable or rejected:", err.message);
        // Try IP detection fallback
        const ipLocation = await detectLocationByIP();
        if (ipLocation) {
          resolve(ipLocation.coordinates);
        } else {
          resolve(DEFAULT_HYDERABAD_COORDINATES);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * React Hook for managing user's verified location across the application.
 */
export function useGeolocation() {
  const [location, setLocation] = useState<LocationInfo>(DEFAULT_LOCATION_INFO);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied" | "unsupported">("prompt");
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  // Safe state setter that avoids re-renders if location coordinates/locality haven't changed
  const updateLocationIfChanged = useCallback((nextInfo: LocationInfo) => {
    setLocation((prev) => {
      if (
        prev.locality === nextInfo.locality &&
        prev.coordinates?.lat === nextInfo.coordinates?.lat &&
        prev.coordinates?.lng === nextInfo.coordinates?.lng &&
        prev.source === nextInfo.source
      ) {
        return prev;
      }
      return nextInfo;
    });
  }, []);

  const detectLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const coords = await getLiveCoordinates(() => {
        setPermissionDenied(true);
        setPermissionState("denied");
      });
      const geo = await reverseGeocode(coords.lat, coords.lng);

      const updatedInfo: LocationInfo = {
        coordinates: coords,
        locality: geo.locality,
        city: geo.city,
        state: geo.state,
        source: "gps",
      };

      updateLocationIfChanged(updatedInfo);

      try {
        localStorage.setItem("omniservice_location", JSON.stringify(updatedInfo));
        window.dispatchEvent(
          new CustomEvent("omniservice:location-change", { detail: updatedInfo })
        );
      } catch {
        // Ignore
      }

      return coords;
    } catch (err: any) {
      setError(err?.message || "Failed to detect location");
      return DEFAULT_HYDERABAD_COORDINATES;
    } finally {
      setIsLoading(false);
    }
  }, [updateLocationIfChanged]);

  // Initialize once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check navigator permissions if available
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((res) => {
          setPermissionState(res.state as any);
          setPermissionDenied(res.state === "denied");
          res.onchange = () => {
            setPermissionState(res.state as any);
            setPermissionDenied(res.state === "denied");
            if (res.state === "granted") {
              detectLocation();
            }
          };
        })
        .catch(() => {});
    }

    let hasExplicitLocation = false;
    try {
      const saved = localStorage.getItem("omniservice_location");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.locality && parsed?.coordinates) {
          updateLocationIfChanged(parsed);
          hasExplicitLocation = true;
        }
      }
    } catch {
      // Ignore
    }

    // Auto-detect real location if not already stored
    if (!hasExplicitLocation) {
      detectLocation();
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<LocationInfo>;
      if (customEvent.detail) {
        updateLocationIfChanged(customEvent.detail);
      }
    };

    window.addEventListener("omniservice:location-change", handleSync);
    return () => window.removeEventListener("omniservice:location-change", handleSync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setManualLocation = useCallback(
    (locality: string, coordinates: Coordinates = DEFAULT_HYDERABAD_COORDINATES) => {
      const updatedInfo: LocationInfo = {
        coordinates,
        locality,
        city: locality.split(",")[1]?.trim() || "Hyderabad",
        state: "Telangana",
        source: "manual",
      };
      updateLocationIfChanged(updatedInfo);
      setPermissionDenied(false);
      try {
        localStorage.setItem("omniservice_location", JSON.stringify(updatedInfo));
        window.dispatchEvent(
          new CustomEvent("omniservice:location-change", { detail: updatedInfo })
        );
      } catch {
        // Ignore
      }
    },
    [updateLocationIfChanged]
  );

  return {
    location,
    coordinates: location.coordinates,
    locality: location.locality,
    city: location.city,
    isLoading,
    error,
    permissionState,
    permissionDenied,
    detectLocation,
    setManualLocation,
  };
}
