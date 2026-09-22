/**
 * OmniService AI — Live Geolocation Engine
 *
 * Provides real-time browser GPS location detection, accuracy checking,
 * and seamless fallback to Mumbai Metro West metropolitan coordinates.
 */

"use client";

import { useState, useCallback } from "react";

export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

// Default Ameerpet, Hyderabad area coordinates
export const DEFAULT_HYDERABAD_COORDINATES: Coordinates = {
  lat: 17.4375,
  lng: 78.4482,
  accuracy: 10,
};

// Backwards compatibility alias
export const DEFAULT_MUMBAI_COORDINATES = DEFAULT_HYDERABAD_COORDINATES;

/**
 * Get current browser GPS coordinates as a Promise.
 */
export async function getLiveCoordinates(): Promise<Coordinates> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return DEFAULT_HYDERABAD_COORDINATES;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
          accuracy: Math.round(position.coords.accuracy),
        });
      },
      (error) => {
        console.warn("Geolocation prompt dismissed or unavailable:", error.message);
        resolve(DEFAULT_HYDERABAD_COORDINATES);
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
 * React Hook for capturing and managing user's real-time location.
 */
export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [locality, setLocality] = useState<string>("Ameerpet, Hyderabad");

  const detectLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const coords = await getLiveCoordinates();
      setCoordinates(coords);

      // Estimate locality in Hyderabad from coordinates
      if (coords.lat > 17.42 && coords.lat < 17.46 && coords.lng > 78.43 && coords.lng < 78.47) {
        setLocality("Ameerpet / SR Nagar, Hyderabad");
      } else if (coords.lat >= 17.40 && coords.lat <= 17.48) {
        setLocality("Panjagutta / Somajiguda, Hyderabad");
      } else {
        setLocality("Ameerpet Metro Hub, Hyderabad");
      }

      return coords;
    } catch (err: any) {
      setError(err?.message || "Failed to acquire location");
      setCoordinates(DEFAULT_HYDERABAD_COORDINATES);
      return DEFAULT_HYDERABAD_COORDINATES;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    coordinates,
    locality,
    isLoading,
    error,
    detectLocation,
  };
}
