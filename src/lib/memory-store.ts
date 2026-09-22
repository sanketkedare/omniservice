/**
 * ForgeLocal — Standalone In-Memory Store
 *
 * Provides high-speed in-memory fallbacks for SOWs, pricing estimates,
 * and change orders when running tests or running in disconnected environments.
 */

export interface MemorySow {
  _id: string;
  serviceRequestId: string;
  diagnosticSessionId: string;
  customerId: string;
  version: number;
  problemTitle: string;
  problemDescription: string;
  likelyRootCause: string;
  confidence: number;
  lineItems: {
    description: string;
    type: "labor" | "material" | "platform_fee";
    quantity: number;
    unitPricePaise: number;
    totalPricePaise: number;
  }[];
  requiredParts: {
    name: string;
    sku?: string;
    quantity: number;
    estimatedUnitCostPaise: number;
    isRequired: boolean;
  }[];
  estimatedDurationMinutes: {
    min: number;
    max: number;
  };
  riskFlags: string[];
  conditions: string[];
  status: "draft" | "pending_customer_review" | "approved" | "rejected" | "superseded";
  subtotalPaise: number;
  taxPaise: number;
  totalPaise: number;
  generatedByAiProvider: string;
  customerApprovedAt?: Date;
  customerRejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryEstimate {
  _id: string;
  serviceRequestId: string;
  scopeOfWorkId: string;
  baseLaborPaise: number;
  partsTotalPaise: number;
  travelFeePaise: number;
  platformFeePaise: number;
  taxPaise: number;
  totalPaise: number;
  guaranteedCeilingPaise: number;
  currency: "INR";
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryChangeOrder {
  _id: string;
  jobId: string;
  scopeOfWorkId: string;
  professionalId: string;
  customerId: string;
  title: string;
  reason: string;
  discoveryDescription: string;
  evidenceIds: string[];
  additionalWorkDescription: string;
  additionalPartsPaise: number;
  additionalLaborPaise: number;
  additionalTotalPaise: number;
  originalTotalPaise: number;
  newTotalPaise: number;
  customerMaxAuthorizationPaise: number;
  status: "submitted" | "customer_notified" | "approved" | "declined" | "expired";
  submittedAt: Date;
  expiresAt: Date;
  customerRespondedAt?: Date;
  customerDeclineReason?: string;
  revisedSowId?: string;
  createdAt: Date;
  updatedAt: Date;
}

class ForgeMemoryStore {
  public sows = new Map<string, MemorySow>();
  public estimates = new Map<string, MemoryEstimate>();
  public changeOrders = new Map<string, MemoryChangeOrder>();
  public sessions = new Map<string, any>();
  public findings = new Map<string, any>();

  constructor() {
    // Seed default demo SOW
    const demoSowId = "65f01234567890abcdef3001";
    this.sows.set(demoSowId, {
      _id: demoSowId,
      serviceRequestId: "65f01234567890abcdef2001",
      diagnosticSessionId: "65f01234567890abcdef4001",
      customerId: "65f01234567890abcdef0001",
      version: 1,
      problemTitle: "Kitchen Sink P-Trap Slip Joint Leak & Extrusion",
      problemDescription:
        "InspectAI diagnostic identified extrusion of rubber slip gasket and hairline thread crack at the sink tailpiece connection causing leak rate of ~1.2 Hz.",
      likelyRootCause:
        "Gasket degradation from caustic cleaning agent exposure combined with overtightened slip nut.",
      confidence: 0.94,
      lineItems: [
        {
          description: "1. Inspect & Disassemble: Remove tailpiece and isolate slip-joint threads",
          type: "labor",
          quantity: 1,
          unitPricePaise: 35000,
          totalPricePaise: 35000,
        },
        {
          description: "2. Gasket Replacement & Re-alignment: Install OEM beveled washer & thread seal",
          type: "labor",
          quantity: 1,
          unitPricePaise: 35000,
          totalPricePaise: 35000,
        },
        {
          description: "32mm Beveled Heavy-Duty Washer",
          type: "material",
          quantity: 1,
          unitPricePaise: 8000,
          totalPricePaise: 8000,
        },
        {
          description: "High-Density PTFE Thread Seal Tape",
          type: "material",
          quantity: 1,
          unitPricePaise: 6000,
          totalPricePaise: 6000,
        },
        {
          description: "TrustLock Escrow Protection & 90-Day Guarantee Fee",
          type: "platform_fee",
          quantity: 1,
          unitPricePaise: 10080,
          totalPricePaise: 10080,
        },
      ],
      requiredParts: [
        { name: "32mm Beveled Washer", sku: "FL-PLB-WASH-32", quantity: 1, estimatedUnitCostPaise: 8000, isRequired: true },
        { name: "PTFE Thread Seal Tape", sku: "FL-PLB-TAPE-12", quantity: 1, estimatedUnitCostPaise: 6000, isRequired: true },
      ],
      estimatedDurationMinutes: { min: 35, max: 60 },
      riskFlags: ["Corrosion on neighboring galvanized pipe may require careful handling."],
      conditions: [
        "Price ceiling guaranteed. If technician takes longer, OmniService absorbs the cost.",
        "Work includes 90-day comprehensive TrustLock re-work guarantee.",
      ],
      status: "pending_customer_review",
      subtotalPaise: 94080,
      taxPaise: 16934,
      totalPaise: 111014,
      generatedByAiProvider: "mock",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.estimates.set(demoSowId, {
      _id: "65f01234567890abcdef5001",
      serviceRequestId: "65f01234567890abcdef2001",
      scopeOfWorkId: demoSowId,
      baseLaborPaise: 70000,
      partsTotalPaise: 14000,
      travelFeePaise: 0,
      platformFeePaise: 10080,
      taxPaise: 16934,
      totalPaise: 111014,
      guaranteedCeilingPaise: 111014,
      currency: "INR",
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed default demo Job for Pro
    const demoJobId = "65f01234567890abcdef6001";
    this.jobs.set(demoJobId, {
      _id: demoJobId,
      bookingId: "65f01234567890abcdef7001",
      serviceRequestId: "65f01234567890abcdef2001",
      scopeOfWorkId: demoSowId,
      professionalId: "pro_hvac_001",
      customerId: "65f01234567890abcdef0001",
      customerName: "K. Reddy",
      customerPhone: "+91 98200 12345",
      customerAddress: "Flat 402, Sea Green Apts, Ameerpet, Hyderabad",
      problemTitle: "Split AC Compressor Tripping MCB",
      category: "hvac",
      status: "assigned",
      priceCeilingPaise: 280000,
      requiredParts: [
        { name: "45µF Dual Run Motor Capacitor", quantity: 1, inStock: true },
      ],
      distanceKm: 1.8,
      estimatedArrivalMinutes: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed Pro van inventory
    const seedInventory: MemoryInventoryItem[] = [
      { _id: "inv_hvac_01", professionalId: "pro_hvac_001", name: "45µF Dual Run Motor Capacitor", category: "hvac", quantity: 6, unitPricePaise: 45000, sku: "CAP-45UF-OEM", reorderThreshold: 2 },
      { _id: "inv_hvac_02", professionalId: "pro_hvac_001", name: "30A Compressor Heavy Duty Contactor", category: "hvac", quantity: 4, unitPricePaise: 85000, sku: "CNT-30A-HD", reorderThreshold: 2 },
      { _id: "inv_hvac_03", professionalId: "pro_hvac_001", name: "R-32 Eco Refrigerant Canister (1kg)", category: "hvac", quantity: 3, unitPricePaise: 120000, sku: "GAS-R32-1KG", reorderThreshold: 1 },
      { _id: "inv_plm_01", professionalId: "pro_plumb_001", name: "Solid Brass Quarter-Turn Angle Valve", category: "plumbing", quantity: 8, unitPricePaise: 38000, sku: "VLV-ANG-BRS", reorderThreshold: 3 },
      { _id: "inv_plm_02", professionalId: "pro_plumb_001", name: "Rigid Anti-Odor Bottle P-Trap Assembly", category: "plumbing", quantity: 5, unitPricePaise: 55000, sku: "TRP-BOT-PVC", reorderThreshold: 2 },
    ];
    for (const item of seedInventory) {
      this.inventory.set(item._id, item);
    }

    // Seed Demo Evidence & Verification
    const demoTrustJobId = "job_001";
    this.evidence.set("ev_pre_01", {
      _id: "ev_pre_01",
      jobId: demoTrustJobId,
      professionalId: "pro_plumb_001",
      type: "pre_work",
      title: "Pre-Work Baseline: Disconnected P-Trap Joint",
      description: "Severe calcium scale and active seep dripping at 1.2 Hz onto vanity baseboard.",
      media: [
        {
          type: "image",
          url: "/images/OmniService_Icon.png",
          capturedAt: new Date(Date.now() - 3600000),
          location: { lat: 19.0596, lng: 72.8295 },
        },
      ],
      aiVerificationStatus: "verified",
      createdAt: new Date(Date.now() - 3600000),
    });

    this.evidence.set("ev_post_01", {
      _id: "ev_post_01",
      jobId: demoTrustJobId,
      professionalId: "pro_plumb_001",
      type: "post_work",
      title: "Post-Work Proof: Installed PVC Bottle Trap Assembly",
      description: "Replaced with OEM PVC bottle trap, silicone thread sealed, pressure tested at 12 L/min.",
      media: [
        {
          type: "image",
          url: "/images/OmniService_Icon.png",
          capturedAt: new Date(Date.now() - 600000),
          location: { lat: 19.0596, lng: 72.8295 },
        },
      ],
      aiVerificationStatus: "verified",
      createdAt: new Date(Date.now() - 600000),
    });

    this.verifications.set("ver_001", {
      _id: "ver_001",
      jobId: demoTrustJobId,
      outcome: "verified",
      confidenceScore: 0.94,
      verificationNotes: "TrustLock multimodal comparison confirms: 1) Old ruptured slip joint removed. 2) OEM trap installed. 3) Dry joint verification under test load.",
      checklistResults: [
        { criterion: "Old component removed & isolated", passed: true, confidence: 0.96 },
        { criterion: "New OEM component matches SOW", passed: true, confidence: 0.95 },
        { criterion: "No leaks under continuous flow test", passed: true, confidence: 0.92 },
      ],
      improvementScore: 0.95,
      triggeredPaymentRelease: true,
      paymentReleasedAt: new Date(),
      cryptographicProofToken: "TL-PROOF-7F89B2-2026",
      createdAt: new Date(),
    });

    // Seed Demo Payment & Escrow
    this.payments.set("pay_001", {
      _id: "pay_001",
      bookingId: "book_001",
      jobId: demoTrustJobId,
      customerId: "user_cust_001",
      professionalId: "pro_plumb_001",
      authorizedAmountPaise: 328000,
      capturedAmountPaise: 328000,
      releasedAmountPaise: 288640,
      platformFeePaise: 39360,
      professionalPayoutPaise: 288640,
      status: "in_escrow",
      escrowHeldAt: new Date(Date.now() - 7200000),
      idempotencyKey: "idem_pay_001_seed",
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(),
    });

    this.escrowLedger.set("esc_tx_001", {
      _id: "esc_tx_001",
      paymentId: "pay_001",
      jobId: demoTrustJobId,
      type: "hold_created",
      amountPaise: 328000,
      balanceAfterPaise: 328000,
      reason: "Customer pre-authorized SOW price ceiling locked in escrow",
      actorId: "user_cust_001",
      actorRole: "customer",
      timestamp: new Date(Date.now() - 7200000),
    });

    // Seed Demo Dispute
    this.disputes.set("disp_001", {
      _id: "disp_001",
      jobId: "job_002",
      paymentId: "pay_002",
      customerId: "user_cust_002",
      professionalId: "pro_hvac_001",
      customerName: "Rahul Sharma",
      professionalName: "CoolAir Solutions (Vikram Patil)",
      initiatedBy: "customer",
      reason: "Cooling efficiency not restored after capacitor replacement",
      description: "Technician installed new capacitor but AC compressor still cuts off after 15 minutes of operation.",
      status: "under_review",
      createdAt: new Date(Date.now() - 86400000),
    });

    // Seed Demo HomePass Appliances & Maintenance
    const demoPropertyId = "prop_bandra_01";
    this.appliances.set("app_01", {
      _id: "app_01",
      propertyId: demoPropertyId,
      name: "Master Bedroom Inverter AC",
      brand: "Daikin",
      modelNumber: "FTKF50TV16U",
      serialNumber: "DKN-2023-89104",
      category: "hvac",
      installedDate: new Date("2023-04-10"),
      warrantyExpiryDate: new Date("2028-04-10"),
      healthScore: 92,
      lastServicedDate: new Date(Date.now() - 30 * 86400000),
      status: "good",
    });

    this.appliances.set("app_02", {
      _id: "app_02",
      propertyId: demoPropertyId,
      name: "Kitchen RO Water Purifier",
      brand: "Kent Grand Plus",
      modelNumber: "KENT-GP-8L",
      serialNumber: "KNT-2022-44120",
      category: "plumbing",
      installedDate: new Date("2022-11-15"),
      warrantyExpiryDate: new Date("2025-11-15"),
      healthScore: 68,
      lastServicedDate: new Date(Date.now() - 170 * 86400000),
      status: "service_due",
    });

    this.appliances.set("app_03", {
      _id: "app_03",
      propertyId: demoPropertyId,
      name: "Main Electrical Distribution Panel",
      brand: "Schneider Electric",
      modelNumber: "Acti9 Isobar 8-Way",
      serialNumber: "SCH-2021-9921",
      category: "electrical",
      installedDate: new Date("2021-08-20"),
      warrantyExpiryDate: new Date("2026-08-20"),
      healthScore: 96,
      lastServicedDate: new Date(Date.now() - 60 * 86400000),
      status: "good",
    });

    this.maintenanceRecords.set("rec_01", {
      _id: "rec_01",
      propertyId: demoPropertyId,
      jobId: demoJobId,
      title: "P-Trap Slip Joint Replacement",
      category: "plumbing",
      performedBy: "Apex Flow Plumbing (Suresh Kumar)",
      date: new Date(Date.now() - 2 * 86400000),
      costPaise: 285000,
      summary: "Inspected and replaced cracked P-trap with OEM bottle trap assembly. Hydrostatic pressure verified.",
      warrantyMonths: 12,
      warrantyExpiresAt: new Date(Date.now() + 365 * 86400000),
      verifiedBadge: true,
    });

    // Seed Demo Notification
    this.notifications.set("notif_01", {
      _id: "notif_01",
      recipientId: "user_cust_001",
      recipientPhone: "+91 86248 51910",
      channel: "whatsapp",
      template: "job_assigned",
      title: "Technician Dispatched",
      body: "Suresh Kumar from Apex Flow Plumbing is en route with required OEM parts. ETA 6 mins.",
      status: "delivered",
      sentAt: new Date(Date.now() - 1800000),
    });

    // Seed Demo Audit Log
    this.auditLogs.set("audit_01", {
      _id: "audit_01",
      action: "escrow_hold_locked",
      entityType: "payment",
      entityId: "pay_001",
      actor: "system_escrow_engine",
      actorRole: "system",
      details: { amountPaise: 328000, ceilingPaise: 328000, status: "in_escrow" },
      timestamp: new Date(Date.now() - 7200000),
    });
  }

  public jobs = new Map<string, MemoryJob>();
  public bookings = new Map<string, MemoryBooking>();
  public inventory = new Map<string, MemoryInventoryItem>();
  public evidence = new Map<string, MemoryEvidence>();
  public verifications = new Map<string, MemoryVerification>();
  public payments = new Map<string, MemoryPayment>();
  public escrowLedger = new Map<string, MemoryEscrowTx>();
  public disputes = new Map<string, MemoryDispute>();
  public appliances = new Map<string, MemoryAppliance>();
  public maintenanceRecords = new Map<string, MemoryMaintenanceRecord>();
  public notifications = new Map<string, MemoryNotification>();
  public auditLogs = new Map<string, MemoryAuditLog>();
  public adminSettings = {
    platformFeePercent: 12,
    gstPercent: 18,
    escrowAutoReleaseHours: 24,
    disputeGraceDays: 7,
    inspectAiAutoEscalateThreshold: 0.70,
  };

  public clear() {
    this.sows.clear();
    this.estimates.clear();
    this.changeOrders.clear();
    this.jobs.clear();
    this.bookings.clear();
    this.inventory.clear();
    this.evidence.clear();
    this.verifications.clear();
    this.payments.clear();
    this.escrowLedger.clear();
    this.disputes.clear();
    this.appliances.clear();
    this.maintenanceRecords.clear();
    this.notifications.clear();
    this.auditLogs.clear();
  }
}

export interface MemoryJob {
  _id: string;
  bookingId: string;
  serviceRequestId: string;
  scopeOfWorkId: string;
  professionalId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  problemTitle: string;
  category: string;
  status: "assigned" | "en_route" | "arrived" | "in_progress" | "completed" | "cancelled";
  priceCeilingPaise: number;
  requiredParts: Array<{ name: string; quantity: number; inStock: boolean }>;
  distanceKm: number;
  estimatedArrivalMinutes: number;
  enRouteAt?: Date;
  arrivedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryBooking {
  _id: string;
  serviceRequestId: string;
  customerId: string;
  professionalId: string;
  jobId: string;
  status: string;
  authorizedAmountPaise: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryInventoryItem {
  _id: string;
  professionalId: string;
  name: string;
  category: string;
  quantity: number;
  unitPricePaise: number;
  sku: string;
  reorderThreshold: number;
}

export interface MemoryEvidence {
  _id: string;
  jobId: string;
  professionalId: string;
  type: "pre_work" | "milestone" | "concealed_work" | "post_work" | "functional_test";
  title: string;
  description?: string;
  media: {
    type: "image" | "video";
    url: string;
    capturedAt: Date;
    location?: { lat: number; lng: number };
  }[];
  aiVerificationStatus?: "pending" | "verified" | "failed";
  aiVerificationScore?: number;
  aiVerificationNotes?: string;
  createdAt: Date;
}

export interface MemoryVerification {
  _id: string;
  jobId: string;
  outcome: "verified" | "partially_verified" | "verification_failed" | "needs_human_review" | "bypassed_by_admin";
  confidenceScore: number;
  verificationNotes: string;
  checklistResults: Array<{
    criterion: string;
    passed: boolean;
    confidence: number;
    note?: string;
  }>;
  improvementScore: number;
  triggeredPaymentRelease: boolean;
  paymentReleasedAt?: Date;
  cryptographicProofToken?: string;
  createdAt: Date;
}

export interface MemoryPayment {
  _id: string;
  bookingId: string;
  jobId: string;
  customerId: string;
  professionalId: string;
  authorizedAmountPaise: number;
  capturedAmountPaise: number;
  releasedAmountPaise?: number;
  refundedAmountPaise?: number;
  platformFeePaise: number;
  professionalPayoutPaise: number;
  status: "authorized" | "in_escrow" | "released" | "refunded" | "disputed";
  escrowHeldAt?: Date;
  releasedAt?: Date;
  refundedAt?: Date;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryEscrowTx {
  _id: string;
  paymentId: string;
  jobId: string;
  type: "hold_created" | "milestone_locked" | "funds_released" | "refund_issued" | "dispute_frozen";
  amountPaise: number;
  balanceAfterPaise: number;
  reason: string;
  actorId: string;
  actorRole: "system" | "customer" | "admin" | "professional";
  timestamp: Date;
}

export interface MemoryDispute {
  _id: string;
  jobId: string;
  paymentId: string;
  customerId: string;
  professionalId: string;
  customerName: string;
  professionalName: string;
  initiatedBy: "customer" | "professional";
  reason: string;
  description: string;
  status: "open" | "evidence_collection" | "under_review" | "resolved_for_customer" | "resolved_for_professional" | "resolved_partial";
  refundAmountPaise?: number;
  resolutionNote?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface MemoryMaintenanceRecord {
  _id: string;
  propertyId: string;
  jobId?: string;
  title: string;
  category: string;
  performedBy: string;
  date: Date;
  costPaise: number;
  summary: string;
  warrantyMonths: number;
  warrantyExpiresAt: Date;
  verifiedBadge: boolean;
}

export interface MemoryAppliance {
  _id: string;
  propertyId: string;
  name: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  category: "hvac" | "plumbing" | "electrical" | "appliance";
  installedDate: Date;
  warrantyExpiryDate: Date;
  healthScore: number;
  lastServicedDate?: Date;
  status: "good" | "service_due" | "critical";
}

export interface MemoryNotification {
  _id: string;
  recipientId: string;
  recipientPhone: string;
  channel: "whatsapp" | "sms" | "push" | "in_app";
  template: string;
  title: string;
  body: string;
  status: "sent" | "delivered" | "read";
  sentAt: Date;
}

export interface MemoryAuditLog {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  actor: string;
  actorRole: string;
  details: Record<string, any>;
  timestamp: Date;
}

export const memoryStore = new ForgeMemoryStore();

