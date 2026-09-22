/**
 * ForgeLocal — SmartRoute Types & Data Contracts
 * Defines inputs, candidate scoring breakdowns, and telemetry structures
 * for the SmartRoute dispatch and matching engine.
 */

export interface ILocationCoords {
  lat: number;
  lng: number;
}

export interface IRequiredPart {
  name: string;
  category?: string;
  quantity?: number;
  partNumber?: string;
}

export interface IMatchingCriteria {
  serviceRequestId: string;
  category: string;
  customerLocation: ILocationCoords;
  urgency: "routine" | "urgent" | "emergency";
  requiredSkillTier?: "apprentice" | "journeyman" | "master";
  requiredParts?: IRequiredPart[];
  maxRadiusKm?: number;
}

export interface IVanInventoryMatch {
  partName: string;
  requiredQuantity: number;
  availableQuantity: number;
  inStock: boolean;
}

export interface ICandidateScoreBreakdown {
  proximityScore: number;     // 0 - 35 (Haversine distance decay)
  inventoryScore: number;     // 0 - 30 (Percentage of required parts in van)
  skillTierScore: number;     // 0 - 20 (Trade license & skill tier match)
  trustPerformanceScore: number; // 0 - 15 (Rating, completion rate, response time)
  totalScore: number;         // 0 - 100
}

export interface IMatchedCandidate {
  professionalId: string;
  businessName: string;
  technicianName: string;
  phone: string;
  avatarUrl?: string;
  rating: number;
  totalJobs: number;
  completionRate: number;
  responseTimeMinutes: number;
  skillLevel: "apprentice" | "journeyman" | "master";
  tradeLicenseVerified: boolean;
  distanceKm: number;
  estimatedArrivalMinutes: number;
  vehicle: {
    make: string;
    model: string;
    licensePlate?: string;
    vehicleType: string;
  };
  scoreBreakdown: ICandidateScoreBreakdown;
  vanInventory: {
    allPartsInStock: boolean;
    stockedCount: number;
    totalRequiredCount: number;
    items: IVanInventoryMatch[];
  };
  matchReason: string;
}

export interface IDispatchTelemetry {
  jobId: string;
  professionalId: string;
  currentLocation: ILocationCoords;
  destinationLocation: ILocationCoords;
  distanceRemainingKm: number;
  durationRemainingMinutes: number;
  status: "dispatched" | "en_route" | "arrived" | "in_progress" | "completed";
  waypoints: Array<{
    lat: number;
    lng: number;
    instruction: string;
  }>;
}
