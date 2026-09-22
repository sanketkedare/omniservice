/**
 * ForgeLocal — Professional & Van Inventory Seed Data
 * Deterministic technician profiles, vehicles, and stocked mobile inventories
 * positioned across Mumbai metro zones for SmartRoute matching and live demos.
 */

export interface IProSeedProfile {
  id: string;
  userId: string;
  businessName: string;
  technicianName: string;
  phone: string;
  tagline: string;
  category: "plumbing" | "electrical" | "hvac" | "appliances";
  skillLevel: "apprentice" | "journeyman" | "master";
  tradeLicenseVerified: boolean;
  yearsOfExperience: number;
  rating: number;
  totalRatingsCount: number;
  completedJobsCount: number;
  completionRate: number;
  responseTimeMinutes: number;
  isOnline: boolean;
  isAvailable: boolean;
  serviceRadiusKm: number;
  coordinates: [number, number]; // [lng, lat]
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  vehicle: {
    id: string;
    make: string;
    vehicleModel: string;
    year: number;
    licensePlate: string;
    color: string;
    vehicleType: "van" | "motorcycle" | "car" | "truck";
  };
  inventory: Array<{
    id: string;
    name: string;
    category: string;
    quantity: number;
    unitPricePaise: number;
    sku: string;
  }>;
}

export const SEED_PROFESSIONALS: IProSeedProfile[] = [
  {
    id: "pro_hvac_001",
    userId: "user_pro_001",
    businessName: "CoolAir Solutions",
    technicianName: "Vikram Rathore",
    phone: "+91 98201 11223",
    tagline: "Certified Daikin & Voltas Master Specialist",
    category: "hvac",
    skillLevel: "master",
    tradeLicenseVerified: true,
    yearsOfExperience: 14,
    rating: 4.94,
    totalRatingsCount: 184,
    completedJobsCount: 312,
    completionRate: 0.99,
    responseTimeMinutes: 7,
    isOnline: true,
    isAvailable: true,
    serviceRadiusKm: 20,
    coordinates: [78.4482, 17.4375], // Ameerpet, Hyderabad
    address: {
      street: "Ameerpet Main Road",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500016",
    },
    vehicle: {
      id: "veh_hvac_001",
      make: "Tata",
      vehicleModel: "Ace EV",
      year: 2024,
      licensePlate: "TS-09-UB-4120",
      color: "Arctic White",
      vehicleType: "van",
    },
    inventory: [
      { id: "inv_hvac_01", name: "45µF Dual Run Motor Capacitor", category: "hvac", quantity: 6, unitPricePaise: 45000, sku: "CAP-45UF-OEM" },
      { id: "inv_hvac_02", name: "30A Compressor Heavy Duty Contactor", category: "hvac", quantity: 4, unitPricePaise: 85000, sku: "CNT-30A-HD" },
      { id: "inv_hvac_03", name: "R-32 Eco Refrigerant Canister (1kg)", category: "hvac", quantity: 3, unitPricePaise: 120000, sku: "GAS-R32-1KG" },
      { id: "inv_hvac_04", name: "Indoor Unit Blower Motor Bearing Set", category: "hvac", quantity: 5, unitPricePaise: 35000, sku: "BRG-IDU-SET" },
      { id: "inv_hvac_05", name: "Universal AC Remote & Sensor PCB Kit", category: "hvac", quantity: 2, unitPricePaise: 65000, sku: "PCB-UNI-AC" },
    ],
  },
  {
    id: "pro_plumb_001",
    userId: "user_pro_002",
    businessName: "Apex Flow Plumbing",
    technicianName: "Rajesh Shinde",
    phone: "+91 98192 33445",
    tagline: "Precision Leak & Drain Specialist — Guaranteed Dry",
    category: "plumbing",
    skillLevel: "master",
    tradeLicenseVerified: true,
    yearsOfExperience: 11,
    rating: 4.88,
    totalRatingsCount: 142,
    completedJobsCount: 240,
    completionRate: 0.98,
    responseTimeMinutes: 10,
    isOnline: true,
    isAvailable: true,
    serviceRadiusKm: 18,
    coordinates: [78.4430, 17.4420], // SR Nagar, Hyderabad
    address: {
      street: "SR Nagar Main Road",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500038",
    },
    vehicle: {
      id: "veh_plumb_001",
      make: "Mahindra",
      vehicleModel: "Bolero Maxx Van",
      year: 2023,
      licensePlate: "TS-09-DL-8291",
      color: "Graphite Silver",
      vehicleType: "van",
    },
    inventory: [
      { id: "inv_plm_01", name: "Solid Brass Quarter-Turn Angle Valve", category: "plumbing", quantity: 8, unitPricePaise: 38000, sku: "VLV-ANG-BRS" },
      { id: "inv_plm_02", name: "Rigid Anti-Odor Bottle P-Trap Assembly", category: "plumbing", quantity: 5, unitPricePaise: 55000, sku: "TRP-BOT-PVC" },
      { id: "inv_plm_03", name: "High-Pressure Braided Steel Faucet Hose (600mm)", category: "plumbing", quantity: 10, unitPricePaise: 28000, sku: "HSE-SS-600" },
      { id: "inv_plm_04", name: "Sediment Cartridge & O-Ring Seal Kit", category: "plumbing", quantity: 12, unitPricePaise: 18000, sku: "FLT-SED-KIT" },
      { id: "inv_plm_05", name: "35mm Ceramic Mixer Disc Cartridge", category: "plumbing", quantity: 6, unitPricePaise: 32000, sku: "CRT-35MM-CER" },
    ],
  },
  {
    id: "pro_elec_001",
    userId: "user_pro_003",
    businessName: "VoltShield Electricals",
    technicianName: "Anil Kulkarni",
    phone: "+91 97693 55667",
    tagline: "Licensed Electrical Contractor & Surge Protection",
    category: "electrical",
    skillLevel: "journeyman",
    tradeLicenseVerified: true,
    yearsOfExperience: 8,
    rating: 4.82,
    totalRatingsCount: 96,
    completedJobsCount: 165,
    completionRate: 0.96,
    responseTimeMinutes: 12,
    isOnline: true,
    isAvailable: true,
    serviceRadiusKm: 15,
    coordinates: [78.4550, 17.4450], // Begumpet, Hyderabad
    address: {
      street: "Begumpet Road",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500016",
    },
    vehicle: {
      id: "veh_elec_001",
      make: "Maruti",
      vehicleModel: "Eeco Cargo",
      year: 2022,
      licensePlate: "TS-09-CP-1904",
      color: "Bright White",
      vehicleType: "van",
    },
    inventory: [
      { id: "inv_elc_01", name: "16A Single Pole Type-C MCB Breaker", category: "electrical", quantity: 14, unitPricePaise: 22000, sku: "MCB-16A-SP" },
      { id: "inv_elc_02", name: "32A Double Pole Main Isolator Switch", category: "electrical", quantity: 6, unitPricePaise: 48000, sku: "ISO-32A-DP" },
      { id: "inv_elc_03", name: "40A 30mA RCCB Residual Current Device", category: "electrical", quantity: 4, unitPricePaise: 165000, sku: "RCCB-40A-30MA" },
      { id: "inv_elc_04", name: "Modular 6A Brass Switch & Socket Set", category: "electrical", quantity: 20, unitPricePaise: 15000, sku: "SWT-MOD-6A" },
    ],
  },
  {
    id: "pro_plumb_002",
    userId: "user_pro_004",
    businessName: "QuickFix Plumbing",
    technicianName: "Deepak Yadav",
    phone: "+91 99304 77889",
    tagline: "Affordable Rapid Emergency Response",
    category: "plumbing",
    skillLevel: "apprentice",
    tradeLicenseVerified: true,
    yearsOfExperience: 3,
    rating: 4.65,
    totalRatingsCount: 45,
    completedJobsCount: 78,
    completionRate: 0.92,
    responseTimeMinutes: 15,
    isOnline: true,
    isAvailable: true,
    serviceRadiusKm: 10,
    coordinates: [78.4350, 17.4250], // Panjagutta, Hyderabad
    address: {
      street: "Panjagutta Junction",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500082",
    },
    vehicle: {
      id: "veh_plumb_002",
      make: "Honda",
      vehicleModel: "Activa 6G with Cargo Box",
      year: 2023,
      licensePlate: "TS-09-FE-3312",
      color: "Matte Black",
      vehicleType: "motorcycle",
    },
    inventory: [
      { id: "inv_qck_01", name: "Standard Thread Seal PTFE Tape (10m)", category: "plumbing", quantity: 15, unitPricePaise: 4000, sku: "TPE-PTFE-10M" },
      { id: "inv_qck_02", name: "Rubber Washer & Gasket Assortment Kit", category: "plumbing", quantity: 8, unitPricePaise: 9500, sku: "GSK-WSH-AST" },
    ],
  },
];
