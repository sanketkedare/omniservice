/**
 * OmniService AI — Client-Safe Mock Data & Fallback Store
 *
 * This module exports initial seed categories, demo properties, and requests.
 * It contains NO server-only or database imports, making it 100% safe to import
 * in both Server and Client ("use client") Components.
 */

// ── Service Categories ──────────────────────────────────────────────────────────
export const INITIAL_CATEGORIES = [
  {
    name: "Plumbing & Drainage",
    slug: "plumbing",
    description: "Pipe bursts, hidden seepage, P-trap leaks, fixtures, and pump repairs.",
    iconName: "Wrench",
    color: "#2563EB",
    phase: 1,
    subcategories: [
      { name: "Pipe Leak & Burst Repair", slug: "pipe-leak", description: "Water line or waste line joint repairs" },
      { name: "Drain Unclogging", slug: "drain-unclog", description: "Hydro-jet and snake unclogging for kitchens and baths" },
      { name: "Tap & Fixture Replacement", slug: "tap-replacement", description: "Faucets, angle valves, showers, and mixers" },
      { name: "Toilet Cistern & Flush", slug: "flush-repair", description: "Dual flush valve, siphon, and inlet valve fixes" },
      { name: "Water Tank & Motor", slug: "tank-motor", description: "Overhead tank float switch and booster pump repairs" },
    ],
    typicalPriceRangePaise: { min: 45000, max: 350000 },
  },
  {
    name: "Electrical Systems",
    slug: "electrical",
    description: "Circuit breaker trips, wiring faults, switchboards, and surge protection.",
    iconName: "Zap",
    color: "#D97706",
    phase: 1,
    subcategories: [
      { name: "MCB & Circuit Breaker Trips", slug: "mcb-tripping", description: "Diagnosing short circuits and load imbalances" },
      { name: "Switchboard & Socket Repair", slug: "switchboard-repair", description: "Burned modular switches, dimmer, and point rewiring" },
      { name: "Ceiling Fan & Exhaust", slug: "fan-repair", description: "Capacitor replacement, winding check, and balancing" },
      { name: "Inverter & UPS Troubleshooting", slug: "inverter-ups", description: "Battery acid check, relay replacement, and wiring" },
      { name: "Main Distribution Board", slug: "distribution-board", description: "Busbar overhaul, neutral earthing, and RCCB installation" },
    ],
    typicalPriceRangePaise: { min: 35000, max: 400000 },
  },
  {
    name: "HVAC & Air Conditioning",
    slug: "hvac",
    description: "Compressor issues, refrigerant leaks, PCB faults, and deep cleaning.",
    iconName: "Wind",
    color: "#0284C7",
    phase: 1,
    subcategories: [
      { name: "Split AC Gas Leak & Recharge", slug: "ac-gas-charge", description: "Nitrogen pressure testing, brazing, and R32/R410A refill" },
      { name: "AC Not Cooling / Weak Airflow", slug: "ac-not-cooling", description: "Capacitor, indoor blower, or thermostat diagnostics" },
      { name: "Water Leakage from Indoor Unit", slug: "ac-water-leak", description: "Drain pipe descaling, drain tray realignment, and cleaning" },
      { name: "Inverter PCB Board Repair", slug: "ac-pcb-repair", description: "Outdoor unit logic board capacitor and IC repair" },
      { name: "Foam Jet Deep Servicing", slug: "ac-deep-service", description: "High-pressure wash of condenser and cooling coils" },
    ],
    typicalPriceRangePaise: { min: 69900, max: 650000 },
  },
  {
    name: "Home Appliances",
    slug: "appliances",
    description: "Washing machines, refrigerators, microwaves, and water purifiers.",
    iconName: "Tv",
    color: "#7C3AED",
    phase: 1,
    subcategories: [
      { name: "Washing Machine Drum & Motor", slug: "washing-machine", description: "Spin cycle failure, water inlet valve, and belt issues" },
      { name: "Refrigerator Cooling Failure", slug: "refrigerator", description: "Defrost timer, relay, compressor, and gas charging" },
      { name: "RO Water Purifier Servicing", slug: "ro-purifier", description: "Membrane replacement, sediment filter, and pump repair" },
      { name: "Microwave Oven Repair", slug: "microwave", description: "Magnetron replacement, door switch, and heating issues" },
    ],
    typicalPriceRangePaise: { min: 49900, max: 450000 },
  },
  {
    name: "Carpentry & Locks",
    slug: "carpentry",
    description: "Door alignments, hydraulic hinges, digital smart locks, and woodwork.",
    iconName: "Hammer",
    color: "#B45309",
    phase: 2,
    subcategories: [
      { name: "Door Lock & Handle Repair", slug: "door-lock", description: "Mortise lock, latch replacement, and cylinder fixes" },
      { name: "Cabinet & Hydraulic Hinges", slug: "cabinet-hinges", description: "Soft-close hinge adjustments and replacement" },
      { name: "Custom Wood Repair & Planing", slug: "wood-repair", description: "Swollen door shaving, frame reinforcement, and trim" },
    ],
    typicalPriceRangePaise: { min: 40000, max: 300000 },
  },
  {
    name: "Waterproofing & Seepage",
    slug: "waterproofing",
    description: "Ceiling dampness, tile joint epoxy grouting, and terrace leakage.",
    iconName: "Droplets",
    color: "#0D9488",
    phase: 2,
    subcategories: [
      { name: "Bathroom Seepage & Grouting", slug: "bathroom-grouting", description: "Epoxy re-grouting and non-invasive elastomeric seal" },
      { name: "Wall Dampness & Efflorescence", slug: "wall-dampness", description: "Polymer-modified base coating and crystalline barrier" },
      { name: "Terrace Waterproofing", slug: "terrace-waterproofing", description: "Multi-layer polyurethane UV membrane coating" },
    ],
    typicalPriceRangePaise: { min: 120000, max: 1200000 },
  },
];

// ── Demo Properties ────────────────────────────────────────────────────────────
export const DEMO_PROPERTIES = [
  {
    _id: "65f01234567890abcdef1001",
    name: "Apartment 402, Sea Green Heights",
    propertyType: "apartment",
    address: {
      street: "Ameerpet Main Road",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500016",
      country: "India",
    },
    bedrooms: 3,
    bathrooms: 3,
    squareFootage: 1450,
    yearBuilt: 2018,
    healthScore: 92,
    isDefault: true,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    _id: "65f01234567890abcdef1002",
    name: "Villa Sol, Sector 4",
    propertyType: "villa",
    address: {
      street: "Plot 88, Banjara Hills Road No. 12",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500034",
      country: "India",
    },
    bedrooms: 4,
    bathrooms: 4,
    squareFootage: 2800,
    yearBuilt: 2021,
    healthScore: 88,
    isDefault: false,
    isActive: true,
    createdAt: new Date("2024-06-20"),
  },
];

// ── Initial Demo Requests ──────────────────────────────────────────────────────
export const DEMO_REQUESTS = [
  {
    _id: "65f01234567890abcdef2001",
    requestNumber: "SR-2026-0819",
    categorySlug: "plumbing",
    categoryName: "Plumbing & Drainage",
    title: "Kitchen Sink Waste Pipe Compression Leak",
    description: "Water continuously drips from the P-trap compression nut under the kitchen sink when water is running. Puddle forms inside the cabinet.",
    urgency: "urgent",
    status: "sow_ready",
    media: [
      {
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
        type: "image",
        filename: "sink_leak_joint.jpg",
      },
    ],
    propertyAddress: "Apartment 402, Sea Green Heights, Ameerpet, Hyderabad",
    estimatedPricePaise: 185000,
    aiFindings: [
      {
        component: "P-trap compression slip nut",
        issue: "Worn rubber washer / thread stripped",
        confidence: 0.94,
        requiredPart: "32mm PVC Waste Coupling Washer",
      },
    ],
    statusHistory: [
      { status: "submitted", timestamp: new Date(Date.now() - 3600000 * 2) },
      { status: "analyzing", timestamp: new Date(Date.now() - 3600000 * 1.8) },
      { status: "sow_ready", timestamp: new Date(Date.now() - 3600000 * 1.5) },
    ],
    createdAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    _id: "65f01234567890abcdef2002",
    requestNumber: "SR-2026-0818",
    categorySlug: "hvac",
    categoryName: "HVAC & Air Conditioning",
    title: "Master Bedroom AC Tripping MCB after 5 minutes",
    description: "Daikin 1.5T split AC powers on normally, fan runs, but as soon as the outdoor compressor kicks in after 3-5 mins, the 16A MCB trips.",
    urgency: "routine",
    status: "booked",
    media: [
      {
        url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
        type: "video",
        filename: "ac_compressor_trip.mp4",
      },
    ],
    propertyAddress: "Apartment 402, Sea Green Heights, Ameerpet, Hyderabad",
    estimatedPricePaise: 240000,
    aiFindings: [
      {
        component: "Outdoor unit run capacitor",
        issue: "Capacitor degradation or compressor locked rotor amp surge",
        confidence: 0.91,
        requiredPart: "45µF Dual Run Motor Capacitor",
      },
    ],
    assignedPro: {
      name: "Rajesh Kumar",
      businessName: "CoolAir Technical Solutions",
      rating: 4.9,
      phone: "+91 86248 51910",
      eta: "Today, 2:30 PM",
    },
    statusHistory: [
      { status: "submitted", timestamp: new Date(Date.now() - 3600000 * 24) },
      { status: "analyzing", timestamp: new Date(Date.now() - 3600000 * 23.5) },
      { status: "sow_ready", timestamp: new Date(Date.now() - 3600000 * 23) },
      { status: "matching", timestamp: new Date(Date.now() - 3600000 * 22) },
      { status: "booked", timestamp: new Date(Date.now() - 3600000 * 18) },
    ],
    createdAt: new Date(Date.now() - 3600000 * 24),
  },
];

// ── In-Memory Dynamic Store for Submitted Requests ─────────────────────────────
// Stores requests created during live interactive testing across sessions
const submittedRequestsStore = new Map<string, any>();

export function saveMockRequest(request: any) {
  if (!request) return request;
  if (request._id) {
    submittedRequestsStore.set(request._id, request);
  }
  if (request.requestNumber) {
    submittedRequestsStore.set(request.requestNumber, request);
  }
  return request;
}

export function getMockRequestById(id: string) {
  if (!id) return null;
  if (submittedRequestsStore.has(id)) {
    return submittedRequestsStore.get(id);
  }
  const match = DEMO_REQUESTS.find((r) => r._id === id || r.requestNumber === id);
  if (match) return match;

  // If mock ID from newly submitted request not found in this process instance,
  // synthesize a rich responsive mock request so the user's issue page renders cleanly
  if (id.startsWith("mock_")) {
    const synthetic = {
      ...DEMO_REQUESTS[0],
      _id: id,
      requestNumber: `SR-2026-${id.slice(-4).toUpperCase()}`,
      title: "Diagnostic Intake Assessment",
      description: "Visual evidence captured. InspectAI automated diagnostics completed.",
      status: "sow_ready",
      statusHistory: [
        { status: "submitted", timestamp: new Date(Date.now() - 60000) },
        { status: "analyzing", timestamp: new Date(Date.now() - 30000) },
        { status: "sow_ready", timestamp: new Date() },
      ],
      createdAt: new Date(),
    };
    submittedRequestsStore.set(id, synthetic);
    return synthetic;
  }

  return null;
}

export function getAllMockRequests() {
  const dynamicList = Array.from(submittedRequestsStore.values()).filter(
    (req, index, self) => self.findIndex((r) => r._id === req._id) === index
  );
  return [...dynamicList, ...DEMO_REQUESTS];
}
