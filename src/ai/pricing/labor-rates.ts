/**
 * ForgeLocal — Labor Rate Cards & Multipliers
 * Regional index and hourly base rates for certified marketplace trades.
 */

export interface TradeLaborRate {
  trade: string;
  baseHourlyRatePaise: number;
  minimumCalloutPaise: number;
  standardDiagnosticFeePaise: number;
}

export const TRADE_LABOR_RATES: Record<string, TradeLaborRate> = {
  plumbing: {
    trade: "Plumbing & Drainage",
    baseHourlyRatePaise: 50000,          // ₹500/hr
    minimumCalloutPaise: 35000,          // ₹350 min
    standardDiagnosticFeePaise: 25000,   // ₹250 (waived if booked)
  },
  electrical: {
    trade: "Electrical Systems",
    baseHourlyRatePaise: 55000,          // ₹550/hr
    minimumCalloutPaise: 40000,          // ₹400 min
    standardDiagnosticFeePaise: 25000,   // ₹250
  },
  hvac: {
    trade: "HVAC & Air Conditioning",
    baseHourlyRatePaise: 70000,          // ₹700/hr
    minimumCalloutPaise: 49900,          // ₹499 min
    standardDiagnosticFeePaise: 35000,   // ₹350
  },
  appliances: {
    trade: "Home Appliances",
    baseHourlyRatePaise: 60000,          // ₹600/hr
    minimumCalloutPaise: 45000,          // ₹450 min
    standardDiagnosticFeePaise: 29900,   // ₹299
  },
  carpentry: {
    trade: "Carpentry & Locks",
    baseHourlyRatePaise: 45000,          // ₹450/hr
    minimumCalloutPaise: 35000,          // ₹350 min
    standardDiagnosticFeePaise: 20000,   // ₹200
  },
  waterproofing: {
    trade: "Waterproofing & Seepage",
    baseHourlyRatePaise: 65000,          // ₹650/hr
    minimumCalloutPaise: 80000,          // ₹800 min
    standardDiagnosticFeePaise: 50000,   // ₹500
  },
};

export const SKILL_MULTIPLIERS = {
  apprentice: 0.85,
  journeyman: 1.0,
  master: 1.35,
};

export const URGENCY_MULTIPLIERS = {
  routine: 1.0,
  urgent: 1.25,     // Dispatched within 2-4 hours
  emergency: 1.5,   // Immediate hazard / gas / burst pipe
};

export const REGIONAL_INDEX: Record<string, number> = {
  mumbai_tier1: 1.15,      // South Mumbai / Bandra / BKC
  mumbai_tier2: 1.0,       // Suburbs / Navi Mumbai / Thane
  delhi_ncr: 1.05,
  bangalore: 1.10,
  hyderabad: 0.95,
  pune: 0.95,
};

export function getLaborRateForCategory(categorySlug: string): TradeLaborRate {
  const cat = categorySlug.toLowerCase();
  for (const [key, rate] of Object.entries(TRADE_LABOR_RATES)) {
    if (cat.includes(key)) return rate;
  }
  return TRADE_LABOR_RATES.plumbing!;
}
