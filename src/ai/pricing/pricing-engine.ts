import { SOWPartItem, SOWTaskItem } from "../providers/ai-provider.interface";
import { findPartByKeyword, PARTS_CATALOG } from "./parts-catalog";
import {
  getLaborRateForCategory,
  SKILL_MULTIPLIERS,
  URGENCY_MULTIPLIERS,
} from "./labor-rates";

export interface PricingBreakdown {
  parts: {
    sku?: string;
    name: string;
    specification: string;
    quantity: number;
    unitPricePaise: number;
    totalPaise: number;
  }[];
  partsTotalPaise: number;
  laborMinutes: number;
  effectiveHourlyRatePaise: number;
  laborTotalPaise: number;
  platformProtectionFeePaise: number; // 12%
  subtotalPaise: number;
  taxPaise: number;                   // 18% GST
  totalPricePaise: number;
  guaranteedCeilingPaise: number;
  currency: "INR";
}

export interface PricingInput {
  categorySlug: string;
  urgency: "routine" | "urgent" | "emergency";
  tasks: SOWTaskItem[];
  parts: SOWPartItem[];
  region?: string;
}

export function calculateEstimate(input: PricingInput): PricingBreakdown {
  const { categorySlug, urgency, tasks, parts } = input;
  const rateCard = getLaborRateForCategory(categorySlug);

  // 1. Calculate Parts
  let partsTotalPaise = 0;
  const pricedParts = parts.map((part) => {
    // Check if part is in catalog
    const catalogMatch = findPartByKeyword(part.partName) || findPartByKeyword(part.specification);
    const unitPrice = catalogMatch?.retailPricePaise ?? part.estimatedUnitCostPaise ?? 10000;
    const total = unitPrice * Math.max(part.quantity, 1);
    partsTotalPaise += total;

    return {
      sku: catalogMatch?.sku ?? `PART-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      name: part.partName,
      specification: part.specification,
      quantity: part.quantity || 1,
      unitPricePaise: unitPrice,
      totalPaise: total,
    };
  });

  // 2. Calculate Labor
  const totalLaborMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 15), 0);
  const urgencyMultiplier = URGENCY_MULTIPLIERS[urgency] || 1.0;

  // Determine highest skill level among tasks
  const hasMasterTask = tasks.some((t) => t.skillLevelRequired === "master");
  const hasJourneymanTask = tasks.some((t) => t.skillLevelRequired === "journeyman");
  const skillMultiplier = hasMasterTask
    ? SKILL_MULTIPLIERS.master
    : hasJourneymanTask
    ? SKILL_MULTIPLIERS.journeyman
    : SKILL_MULTIPLIERS.apprentice;

  const effectiveHourlyRatePaise = Math.round(
    rateCard.baseHourlyRatePaise * skillMultiplier * urgencyMultiplier
  );

  const rawLaborPaise = Math.round((totalLaborMinutes / 60) * effectiveHourlyRatePaise);
  const laborTotalPaise = Math.max(rawLaborPaise, rateCard.minimumCalloutPaise);

  // 3. Platform Fee (12% covering TrustLock escrow and 90-day service warranty)
  const platformProtectionFeePaise = Math.round((partsTotalPaise + laborTotalPaise) * 0.12);

  // 4. Subtotal
  const subtotalPaise = partsTotalPaise + laborTotalPaise + platformProtectionFeePaise;

  // 5. Tax (18% GST)
  const taxPaise = Math.round(subtotalPaise * 0.18);

  // 6. Total
  const totalPricePaise = subtotalPaise + taxPaise;

  return {
    parts: pricedParts,
    partsTotalPaise,
    laborMinutes: totalLaborMinutes,
    effectiveHourlyRatePaise,
    laborTotalPaise,
    platformProtectionFeePaise,
    subtotalPaise,
    taxPaise,
    totalPricePaise,
    guaranteedCeilingPaise: totalPricePaise,
    currency: "INR",
  };
}
