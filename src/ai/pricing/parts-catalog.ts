/**
 * ForgeLocal — Standard Parts Catalog
 * Deterministic wholesale and retail parts pricing for local service trades.
 */

export interface CatalogPart {
  sku: string;
  category: "plumbing" | "electrical" | "hvac" | "appliances" | "carpentry" | "waterproofing";
  name: string;
  specification: string;
  unitCostPaise: number;     // Professional wholesale cost
  retailPricePaise: number;  // Guaranteed customer price
  typicalReplacementMinutes: number;
  oemBrands: string[];
}

export const PARTS_CATALOG: CatalogPart[] = [
  // Plumbing
  {
    sku: "PLM-WSH-32",
    category: "plumbing",
    name: "32mm Beveled Slip Joint Washer",
    specification: "EPDM High-Elasticity Rubber for P-Trap Joints",
    unitCostPaise: 4000,     // ₹40
    retailPricePaise: 8000,   // ₹80
    typicalReplacementMinutes: 10,
    oemBrands: ["Astral", "Supreme", "Finolex"],
  },
  {
    sku: "PLM-TRP-32",
    category: "plumbing",
    name: "32mm PVC P-Trap Waste Pipe Assembly",
    specification: "Heavy Duty Chemical-Resistant PVC with Cleanout Plug",
    unitCostPaise: 18000,    // ₹180
    retailPricePaise: 32000,  // ₹320
    typicalReplacementMinutes: 20,
    oemBrands: ["Astral", "Supreme"],
  },
  {
    sku: "PLM-TAP-CRT",
    category: "plumbing",
    name: "Ceramic Disc Quarter-Turn Tap Cartridge",
    specification: "35mm High-Pressure Drip-Free Ceramic Disc",
    unitCostPaise: 15000,    // ₹150
    retailPricePaise: 29000,  // ₹290
    typicalReplacementMinutes: 15,
    oemBrands: ["Jaquar", "Kohler", "Cera"],
  },
  {
    sku: "PLM-PTFE-HD",
    category: "plumbing",
    name: "High Density PTFE Thread Seal Tape",
    specification: "12mm x 0.1mm x 10m Heavy Duty",
    unitCostPaise: 3000,     // ₹30
    retailPricePaise: 6000,   // ₹60
    typicalReplacementMinutes: 5,
    oemBrands: ["Champion", "Holdtite"],
  },

  // Electrical
  {
    sku: "ELE-SWT-16A",
    category: "electrical",
    name: "16A Heavy Duty Modular Switch",
    specification: "Silver Alloy Contacts 240V AC ISI Marked",
    unitCostPaise: 11000,    // ₹110
    retailPricePaise: 18000,  // ₹180
    typicalReplacementMinutes: 15,
    oemBrands: ["Legrand", "Schneider", "Anchor Roma", "Havells"],
  },
  {
    sku: "ELE-MCB-16A",
    category: "electrical",
    name: "Single Pole 16A C-Curve MCB",
    specification: "10kA Breaking Capacity 240/415V AC",
    unitCostPaise: 18000,    // ₹180
    retailPricePaise: 32000,  // ₹320
    typicalReplacementMinutes: 20,
    oemBrands: ["Schneider", "Legrand", "Havells"],
  },
  {
    sku: "ELE-CAP-FAN",
    category: "electrical",
    name: "2.5µF Ceiling Fan Motor Capacitor",
    specification: "440VAC 50Hz Metallized Polypropylene Film",
    unitCostPaise: 4000,     // ₹40
    retailPricePaise: 9000,   // ₹90
    typicalReplacementMinutes: 15,
    oemBrands: ["Tibcon", "Havells", "Epcos"],
  },

  // HVAC
  {
    sku: "HVC-CAP-45-5",
    category: "hvac",
    name: "45µF + 5µF Dual Run Motor Capacitor",
    specification: "450VAC 50/60Hz Round Aluminum Can 10k AFC",
    unitCostPaise: 25000,    // ₹250
    retailPricePaise: 48000,  // ₹480
    typicalReplacementMinutes: 25,
    oemBrands: ["Epcos", "Kelvin", "Schneider"],
  },
  {
    sku: "HVC-GAS-R32",
    category: "hvac",
    name: "R32 Refrigerant Gas Charge (per 100g)",
    specification: "Virgin High Purity Eco Refrigerant",
    unitCostPaise: 15000,    // ₹150 / 100g
    retailPricePaise: 35000,  // ₹350 / 100g
    typicalReplacementMinutes: 45,
    oemBrands: ["Daikin", "Floron", "Chemours"],
  },
  {
    sku: "HVC-DRN-PIPE",
    category: "hvac",
    name: "AC Flexible Corrugated Drain Pipe (3m)",
    specification: "16mm UV Resistant Multi-layer Condensate Hose",
    unitCostPaise: 8000,     // ₹80
    retailPricePaise: 16000,  // ₹160
    typicalReplacementMinutes: 20,
    oemBrands: ["Voltas", "Blue Star"],
  },

  // Appliances
  {
    sku: "APP-RO-SED",
    category: "appliances",
    name: "Inline Sediment Filter Cartridge (5 Micron)",
    specification: "Spun Polypropylene Food Grade",
    unitCostPaise: 15000,    // ₹150
    retailPricePaise: 35000,  // ₹350
    typicalReplacementMinutes: 20,
    oemBrands: ["Kent", "Aquaguard", "Pureit"],
  },
  {
    sku: "APP-RO-MEM",
    category: "appliances",
    name: "75 GPD Thin Film Composite RO Membrane",
    specification: "0.0001 Micron 95% Salt Rejection",
    unitCostPaise: 85000,    // ₹850
    retailPricePaise: 165000, // ₹1,650
    typicalReplacementMinutes: 30,
    oemBrands: ["Dow Filmtec", "Vontron", "Kent"],
  },
];

export function findPartByKeyword(keyword: string): CatalogPart | null {
  const k = keyword.toLowerCase().trim();
  const tokens = k.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return null;

  return (
    PARTS_CATALOG.find((p) => {
      const full = `${p.name} ${p.specification} ${p.sku}`.toLowerCase();
      return tokens.every((token) => full.includes(token));
    }) ?? null
  );
}

