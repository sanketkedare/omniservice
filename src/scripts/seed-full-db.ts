/**
 * ForgeLocal — Direct MongoDB Database Seeder
 * Populates evaluation accounts, service categories, properties,
 * service requests, SOWs, bookings, escrow payments, inventory & logs directly into MongoDB Atlas.
 */

import { connectToDatabase } from "../lib/db";
import {
  User,
  Professional,
  Property,
  ServiceCategory,
  ServiceRequest,
  DiagnosticSession,
  ScopeOfWork,
  PricingEstimate,
  Booking,
  Payment,
  EscrowTransaction,
  InventoryItem,
  JobEvidence,
  ChangeOrder,
  Dispute,
  AIInference,
  AuditLog,
  Notification,
} from "../models";
import { hashPassword } from "../lib/crypto";

const EVAL_PASSWORD = "admin@123";

export async function seedFullDatabase() {
  console.log("⚡ Connecting to MongoDB Atlas...");
  await connectToDatabase();

  const { hash, salt } = hashPassword(EVAL_PASSWORD);

  // 1. Seed Accounts
  console.log("👤 Seeding Accounts...");
  const accountsData = [
    {
      email: "kedaresp18@gmail.com",
      name: "Sanket Kedare (Master Provider)",
      role: "professional" as const,
      phone: "9876543200",
    },
    {
      email: "admin@gmail.com",
      name: "System Admin",
      role: "admin" as const,
      phone: "9876543210",
    },
    {
      email: "admin@omniservice.volcanic.world",
      name: "Platform Administrator",
      role: "admin" as const,
      phone: "9876543211",
    },
    {
      email: "provider@gmail.com",
      name: "Arjun Sharma",
      role: "professional" as const,
      phone: "9876543220",
    },
    {
      email: "pro@gmail.com",
      name: "Suresh Reddy",
      role: "professional" as const,
      phone: "9876543221",
    },
    {
      email: "customer@gmail.com",
      name: "Pooja Verma",
      role: "customer" as const,
      phone: "9876543230",
    },
    {
      email: "customer@omniservice.volcanic.world",
      name: "Hyderabad Resident",
      role: "customer" as const,
      phone: "9876543231",
    },
  ];

  const userMap: Record<string, any> = {};

  for (const acc of accountsData) {
    let user = await User.findOne({ email: acc.email });
    if (!user) {
      user = await User.create({
        name: acc.name,
        email: acc.email,
        phone: acc.phone,
        role: acc.role,
        status: "active",
        passwordHash: hash,
        passwordSalt: salt,
        authProvider: "credentials",
        emailVerified: new Date(),
        phoneVerified: true,
        address: {
          street: "Road No. 36, Jubilee Hills",
          city: "Hyderabad",
          state: "Telangana",
          postalCode: "500033",
          country: "India",
        },
      });
    } else {
      user.name = acc.name;
      user.passwordHash = hash;
      user.passwordSalt = salt;
      user.status = "active";
      await user.save();
    }
    userMap[acc.email] = user;

    // Professional profile
    if (acc.role === "professional") {
      const existingPro = await (Professional as any).findOne({ userId: user._id });
      if (!existingPro) {
        await (Professional as any).create({
          userId: user._id,
          businessName: acc.name + " Electrical & HVAC Services",
          serviceRadius: 35,
          currentLocation: {
            type: "Point",
            coordinates: [78.3915, 17.4483],
          },
          baseAddress: {
            street: "Madhapur Main Road",
            city: "Hyderabad",
            state: "Telangana",
            postalCode: "500081",
            country: "IN",
            coordinates: {
              type: "Point",
              coordinates: [78.3915, 17.4483],
            },
          },
          verificationStatus: "approved",
          completedJobsCount: 54,
          averageRating: 4.95,
          totalRatingsCount: 48,
          completionRate: 0.99,
          isOnline: true,
          isAvailable: true,
        });
      }
    }
  }

  // 2. Service Categories
  console.log("🏷️ Seeding Service Categories...");
  const categories = [
    {
      name: "Electrical Systems",
      slug: "electrical-systems",
      description: "Short circuits, wiring diagnostics, MCB replacement, and electrical panel upgrades.",
      iconName: "Zap",
      color: "#F05A28",
      displayOrder: 1,
    },
    {
      name: "Plumbing & Leakages",
      slug: "plumbing-leakages",
      description: "High-pressure pipeline leaks, faucet repairs, water heater valve replacements.",
      iconName: "Droplet",
      color: "#0284C7",
      displayOrder: 2,
    },
    {
      name: "HVAC & AC Service",
      slug: "hvac-ac-service",
      description: "Inverter AC compressor diagnostics, gas pressure check, and duct cleansing.",
      iconName: "Wind",
      color: "#059669",
      displayOrder: 3,
    },
    {
      name: "Appliance Repairs",
      slug: "appliance-repairs",
      description: "Washing machine motor, refrigerator thermostat, and microwave PCB repairs.",
      iconName: "Wrench",
      color: "#D97706",
      displayOrder: 4,
    },
    {
      name: "Solar & Inverters",
      slug: "solar-inverters",
      description: "Rooftop solar panel inverter calibration, battery bank health, and wiring.",
      iconName: "Sun",
      color: "#7C3AED",
      displayOrder: 5,
    },
  ];

  const categoryMap: Record<string, any> = {};
  for (const cat of categories) {
    let category = await ServiceCategory.findOne({ slug: cat.slug });
    if (!category) {
      category = await ServiceCategory.create({
        ...cat,
        status: "active",
        availableRegions: ["all"],
        minimumConfidenceThreshold: 0.75,
        estimatedDurationMinutes: { min: 45, max: 120 },
        typicalPriceRangePaise: { min: 49900, max: 350000 },
      });
    }
    categoryMap[cat.slug] = category;
  }

  // 3. Properties
  console.log("🏡 Seeding Properties...");
  const customerUser = userMap["customer@gmail.com"];
  let property = await Property.findOne({ customerId: customerUser._id });
  if (!property) {
    property = await Property.create({
      customerId: customerUser._id,
      name: "Lakeview Executive Residency (Flat 402)",
      propertyType: "apartment",
      address: {
        street: "Flat 402, High-Tech Residency, Financial District, Gachibowli",
        city: "Hyderabad",
        state: "Telangana",
        postalCode: "500032",
        country: "India",
      },
      healthScore: 94,
      isDefault: true,
      isActive: true,
    });
  }

  // 4. Van Stock Inventory
  console.log("📦 Seeding Van Stock Inventory...");
  const proUser = userMap["provider@gmail.com"];
  const proDoc = await (Professional as any).findOne({ userId: proUser._id });
  if (proDoc) {
    const existingInv = await (InventoryItem as any).findOne({ professionalId: proDoc._id });
    if (!existingInv) {
      await (InventoryItem as any).create([
        {
          professionalId: proDoc._id,
          sku: "MCB-SINGLE-63A",
          name: "Havells 63A Single Pole MCB Breaker",
          category: "electrical",
          quantity: 14,
          reorderThreshold: 3,
          unitPricePaise: 65000,
        },
        {
          professionalId: proDoc._id,
          sku: "COPPER-PIPE-0.5IN",
          name: "Pure Copper Pipe R410A (1/2 inch, 3m)",
          category: "hvac",
          quantity: 8,
          reorderThreshold: 2,
          unitPricePaise: 125000,
        },
        {
          professionalId: proDoc._id,
          sku: "SEAL-SILICONE-HIGH",
          name: "High-Temp Waterproof Silicone Sealant 300ml",
          category: "plumbing",
          quantity: 20,
          reorderThreshold: 5,
          unitPricePaise: 38000,
        },
      ]);
    }
  }

  // 5. Service Requests & SOWs & Bookings
  console.log("📋 Seeding Service Requests & Active Jobs...");
  const existingReq = await (ServiceRequest as any).findOne({ customerId: customerUser._id });
  if (!existingReq) {
    const sreq = await (ServiceRequest as any).create({
      customerId: customerUser._id,
      propertyId: property._id,
      serviceCategoryId: categoryMap["electrical-systems"]._id,
      title: "Tripping MCB Main Breaker in Kitchen Corridor",
      description: "The main breaker in the corridor panel trips immediately whenever the heavy induction cooktop is turned on.",
      media: [
        {
          type: "image",
          url: "/images/hero_technician_new.jpg",
          storageKey: "media/mcb_tripping.jpg",
          mimeType: "image/jpeg",
        },
      ],
      intakeChannel: "app",
      status: "booked",
      urgency: "urgent",
      aiCategoryDetected: "Electrical Systems",
      aiCategoryConfidence: 0.94,
    });

    const diagSession = await (DiagnosticSession as any).create({
      serviceRequestId: sreq._id,
      customerId: customerUser._id,
      aiProvider: "gemini",
      status: "completed",
      overallConfidence: 0.94,
      problemSummary: "Line short circuit causing kitchen circuit main MCB breaker trip",
      likelyRootCause: "Worn insulation on 63A MCB wire terminal",
      recommendedServiceCategory: "Electrical Systems",
    });

    sreq.diagnosticSessionId = diagSession._id;
    await sreq.save();

    const sow = await (ScopeOfWork as any).create({
      serviceRequestId: sreq._id,
      diagnosticSessionId: diagSession._id,
      customerId: customerUser._id,
      serviceCategoryId: categoryMap["electrical-systems"]._id,
      problemTitle: "63A MCB Panel Diagnostics & Wire Insulation Repair",
      problemDescription: "Inspect AI verified a line short circuit caused by worn insulation on the kitchen circuit wire.",
      likelyRootCause: "Worn insulation on 63A MCB wire terminal",
      confidence: 0.94,
      version: 1,
      status: "approved",
      estimatedDurationMinutes: { min: 45, max: 90 },
      lineItems: [
        {
          description: "Havells 63A Single Pole MCB Breaker Replacement",
          type: "material",
          quantity: 1,
          unitPricePaise: 65000,
          totalPricePaise: 65000,
        },
        {
          description: "High-voltage Insulation Testing & Rewiring",
          type: "labor",
          quantity: 1,
          unitPricePaise: 120000,
          totalPricePaise: 120000,
        },
      ],
      subtotalPaise: 185000,
      taxPaise: 33300,
      totalPaise: 218300,
    });

    sreq.scopeOfWorkId = sow._id;
    await sreq.save();

    const booking = await (Booking as any).create({
      serviceRequestId: sreq._id,
      customerId: customerUser._id,
      professionalId: proDoc?._id,
      scopeOfWorkId: sow._id,
      status: "in_progress",
      scheduledStartTime: new Date(Date.now() - 3600000),
      scheduledEndTime: new Date(Date.now() + 7200000),
      escrowAmountPaise: 218300,
      isEscrowLocked: true,
      otpCode: "4829",
      otpVerified: true,
    });

    sreq.jobId = booking._id;
    await sreq.save();

    // 6. Escrow & Payment Record
    console.log("💳 Seeding Escrow & Payment Records...");
    await (Payment as any).create({
      bookingId: booking._id,
      customerId: customerUser._id,
      professionalId: proDoc?._id,
      amountPaise: 218300,
      currency: "INR",
      gateway: "razorpay",
      gatewayPaymentId: "pay_RzpTest" + Math.floor(Math.random() * 1000000),
      gatewayOrderId: "order_RzpTest" + Math.floor(Math.random() * 1000000),
      status: "captured",
      escrowStatus: "held",
    });

    await (EscrowTransaction as any).create({
      bookingId: booking._id,
      type: "deposit",
      amountPaise: 218300,
      currency: "INR",
      status: "held",
      heldUntil: new Date(Date.now() + 86400000 * 2),
      referenceNumber: "ESC-HYD-" + Math.floor(100000 + Math.random() * 900000),
    });
  }

  // 7. Audit Log & Notifications
  console.log("🔔 Seeding Audit Logs & System Notifications...");
  await (AuditLog as any).create({
    actorId: customerUser._id,
    actorRole: "customer",
    action: "DATABASE_SEEDED_SUCCESS",
    entityType: "System",
    metadata: { note: "Dummy seed data initialized cleanly for evaluation accounts." },
    ipAddress: "127.0.0.1",
  });

  await (Notification as any).create({
    userId: customerUser._id,
    channel: "in_app",
    title: "System Seeding Completed",
    body: "Evaluation data for Hyderabad region loaded with active job & escrow records.",
    status: "delivered",
  });

  await (AIInference as any).create({
    jobType: "diagnostic",
    entityId: customerUser._id,
    provider: "gemini",
    modelVersion: "gemini-2.5-flash",
    promptVersion: "v1.4",
    inputTokens: 1240,
    outputTokens: 480,
    latencyMs: 1120,
    confidenceScore: 0.94,
    inputSummary: "Kitchen MCB breaker tripping diagnostic image",
    outputSummary: "63A MCB wire insulation worn. Diagnostic complete.",
    success: true,
  });

  console.log("✅ Seed completed successfully!");
}

// CLI Execution
if (require.main === module) {
  seedFullDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    });
}
