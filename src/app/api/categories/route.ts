import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ServiceCategory } from "@/models/service-category.model";

// Seed categories for immediate availability and demonstration
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

export async function GET() {
  try {
    await connectToDatabase();
    let categories = await ServiceCategory.find({ status: "active" }).sort({ displayOrder: 1 }).lean();

    // If categories collection is not yet populated, seed with INITIAL_CATEGORIES
    if (!categories || categories.length === 0) {
      await ServiceCategory.insertMany(
        INITIAL_CATEGORIES.map((c, i) => ({
          ...c,
          status: "active",
          displayOrder: i + 1,
        }))
      );
      categories = await ServiceCategory.find({ status: "active" }).sort({ displayOrder: 1 }).lean();
    }

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    // Return fallback categories if database is not reachable in dev
    return NextResponse.json({
      success: true,
      data: INITIAL_CATEGORIES,
      count: INITIAL_CATEGORIES.length,
      fallback: true,
    });
  }
}
