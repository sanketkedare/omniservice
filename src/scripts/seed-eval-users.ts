/**
 * Seed Evaluation Accounts Directly into MongoDB Atlas
 * Password for all: admin@123
 */

import { connectToDatabase } from "../lib/db";
import { User, Professional, Property } from "../models";
import { hashPassword } from "../lib/crypto";

const EVAL_PASSWORD = "admin@123";

const ACCOUNTS = [
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
    name: "Arjun Sharma (Pro)",
    role: "professional" as const,
    phone: "9876543220",
    trade: "HVAC & Electrical Specialist",
  },
  {
    email: "pro@gmail.com",
    name: "Suresh Reddy (Pro)",
    role: "professional" as const,
    phone: "9876543221",
    trade: "Plumbing & Leakage Specialist",
  },
  {
    email: "provider@omniservice.volcanic.world",
    name: "Hyderabad Pro Specialist",
    role: "professional" as const,
    phone: "9876543222",
    trade: "General Home Systems",
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

export async function seedEvaluationUsers() {
  console.log("Connecting to MongoDB Atlas...");
  await connectToDatabase();

  const { hash, salt } = hashPassword(EVAL_PASSWORD);
  console.log("Password hashed with NIST SP 800-132 PBKDF2 (SHA-512): admin@123");

  for (const acc of ACCOUNTS) {
    let user = await User.findOne({ email: acc.email });

    if (user) {
      user.name = acc.name;
      user.role = acc.role;
      user.passwordHash = hash;
      user.passwordSalt = salt;
      user.status = "active";
      user.authProvider = "credentials";
      user.emailVerified = new Date();
      await user.save();
      console.log(`Updated evaluation account: ${acc.email} (${acc.role})`);
    } else {
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
      console.log(`Created new evaluation account: ${acc.email} (${acc.role})`);
    }

    // If professional, ensure Professional profile exists
    if (acc.role === "professional") {
      const existingPro = await (Professional as any).findOne({ userId: user._id });
      if (!existingPro) {
        await (Professional as any).create({
          userId: user._id,
          businessName: acc.name,
          serviceRadius: 30,
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
          completedJobsCount: 42,
          averageRating: 4.95,
          totalRatingsCount: 38,
          completionRate: 0.98,
          isOnline: true,
          isAvailable: true,
        });
        console.log(`Initialized Professional record for: ${acc.email}`);
      }
    }

    // If customer, ensure at least one active Property exists in Hyderabad
    if (acc.role === "customer") {
      const existingProp = await Property.findOne({ customerId: user._id });
      if (!existingProp) {
        await Property.create({
          customerId: user._id,
          name: "Lakeview Residence (Flat 402)",
          propertyType: "apartment",
          address: {
            street: "Flat 402, High-Tech Residency, Financial District, Gachibowli",
            city: "Hyderabad",
            state: "Telangana",
            postalCode: "500032",
            country: "India",
          },
          healthScore: 92,
          isDefault: true,
          isActive: true,
        });
        console.log(`Initialized sample property for customer: ${acc.email}`);
      }
    }
  }

  console.log("All evaluation accounts successfully synced to MongoDB!");
}

// Direct execution
if (require.main === module) {
  seedEvaluationUsers()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Failed to seed users:", err);
      process.exit(1);
    });
}
