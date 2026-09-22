import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user.model";
import { Professional } from "@/models/professional.model";
import { hashPassword } from "@/lib/crypto";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().min(7, "Phone number must be at least 7 digits").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["customer", "professional", "admin"]).default("customer"),
  trade: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, password, role, trade, coordinates } = parsed.data;

    const cleanEmail = email && email.trim() ? email.toLowerCase().trim() : null;
    const cleanPhone = phone && phone.trim() ? phone.trim() : null;

    if (!cleanEmail && !cleanPhone) {
      return NextResponse.json(
        { success: false, error: "Either email or phone number is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check for existing account
    const existingConditions: any[] = [];
    if (cleanEmail) existingConditions.push({ email: cleanEmail });
    if (cleanPhone) existingConditions.push({ phone: cleanPhone });

    const existingUser = await User.findOne({ $or: existingConditions });
    if (existingUser) {
      const matchField = existingUser.email === cleanEmail ? "email address" : "phone number";
      return NextResponse.json(
        {
          success: false,
          error: `An account with this ${matchField} already exists. Please sign in instead.`,
        },
        { status: 409 }
      );
    }

    // Cryptographic Password Hashing (PBKDF2 with SHA-512)
    const { hash, salt } = hashPassword(password);

    // Create User Document in MongoDB
    const newUser = await User.create({
      name,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash: hash,
      passwordSalt: salt,
      authProvider: "credentials",
      role,
      status: "active",
      coordinates: coordinates || null,
      emailVerified: cleanEmail ? new Date() : null,
      phoneVerified: Boolean(cleanPhone),
    });

    // If role is professional, create matching Professional profile record
    if (role === "professional") {
      try {
        await (Professional as any).create({
          userId: newUser._id,
          businessName: `${name} Services`,
          categorySlug: trade ? trade.toLowerCase() : "plumbing",
          phone: cleanPhone || "8624851910",
          email: cleanEmail || "pro@omniservice.world",
          verificationStatus: "verified",
          apexCertifications: [
            {
              certificationName: `Apex Certified ${trade || "Specialist"}`,
              issuedAt: new Date(),
            },
          ],
          coordinates: [coordinates?.lng || 72.8347, coordinates?.lat || 19.0700],
          isAvailable: true,
        });
      } catch (proErr) {
        // Professional record creation is non-blocking for user registration
        console.warn("Failed to create supplemental Professional record:", proErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account registered successfully",
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to register user" },
      { status: 500 }
    );
  }
}
