import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user.model";
import { Professional } from "@/models/professional.model";
import { hashPassword, signJwt } from "@/lib/crypto";

const AUTH_SECRET =
  process.env.AUTH_SECRET || "981d48acf799ab420d79178ad438ae9caf5fd060a3785f72e6b569ad2f758044";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().min(7, "Phone number must be at least 7 digits").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  authProvider: z.enum(["credentials", "google"]).default("credentials"),
  googleId: z.string().optional(),
  avatarUrl: z.string().optional(),
  // Strict RBAC: only customer or professional can self-register
  role: z.enum(["customer", "professional"]).default("customer"),
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

    const {
      name,
      email,
      phone,
      password,
      authProvider,
      googleId,
      avatarUrl,
      role,
      trade,
      coordinates,
    } = parsed.data;

    const cleanEmail = email && email.trim() ? email.toLowerCase().trim() : undefined;
    const cleanPhone = phone && phone.trim() ? phone.trim() : undefined;

    if (!cleanEmail && !cleanPhone) {
      return NextResponse.json(
        { success: false, error: "Please provide either an email or mobile phone number" },
        { status: 400 }
      );
    }

    if (authProvider === "credentials" && (!password || password.length < 6)) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long for credential registration" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check for existing user with same email or phone
    const existingConditions: any[] = [];
    if (cleanEmail) existingConditions.push({ email: cleanEmail });
    if (cleanPhone) existingConditions.push({ phone: cleanPhone });

    const existingUser = await User.findOne({ $or: existingConditions });
    if (existingUser) {
      // If registering with Google and user already exists, upgrade/link and authenticate
      if (authProvider === "google") {
        if (googleId && !existingUser.googleId) existingUser.googleId = googleId;
        if (avatarUrl && !existingUser.avatarUrl) existingUser.avatarUrl = avatarUrl;
        if (!existingUser.emailVerified) existingUser.emailVerified = new Date();
        await existingUser.save();

        const token = signJwt(
          {
            sub: existingUser._id.toString(),
            name: existingUser.name,
            email: existingUser.email,
            phone: existingUser.phone,
            role: existingUser.role,
            exp: Math.floor(Date.now() / 1000) + 7 * 86400,
            iat: Math.floor(Date.now() / 1000),
          },
          AUTH_SECRET
        );

        const authenticatedUser = {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          role: existingUser.role,
          avatarUrl: existingUser.avatarUrl,
        };

        const response = NextResponse.json(
          {
            success: true,
            message: "Account already exists. Signed into existing profile.",
            user: authenticatedUser,
            token,
          },
          { status: 200 }
        );

        const cookieMaxAge = 7 * 86400;
        response.cookies.set("authjs.session-token", token, {
          path: "/",
          maxAge: cookieMaxAge,
          sameSite: "lax",
        });
        response.cookies.set("omniservice-role", existingUser.role, {
          path: "/",
          maxAge: cookieMaxAge,
          sameSite: "lax",
        });
        response.cookies.set("omniservice-user", encodeURIComponent(JSON.stringify(authenticatedUser)), {
          path: "/",
          maxAge: cookieMaxAge,
          sameSite: "lax",
        });

        return response;
      }

      return NextResponse.json(
        {
          success: false,
          error:
            cleanEmail && existingUser.email === cleanEmail
              ? "An account with this email address already exists. Please sign in."
              : "An account with this phone number already exists. Please sign in.",
        },
        { status: 409 }
      );
    }

    // Cryptographic Password Hashing (PBKDF2 SHA-512) for credentials
    let hash: string | undefined = undefined;
    let salt: string | undefined = undefined;
    if (password) {
      const pwData = hashPassword(password);
      hash = pwData.hash;
      salt = pwData.salt;
    }

    // Persist new User in MongoDB Atlas (never store null for sparse indexed fields)
    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash: hash,
      passwordSalt: salt,
      role,
      status: "active",
      authProvider,
      googleId: googleId || undefined,
      avatarUrl: avatarUrl || undefined,
      coordinates: coordinates ? { lat: coordinates.lat, lng: coordinates.lng } : undefined,
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
          phone: cleanPhone || "9820054321",
          email: cleanEmail || "volcanic.digitalsolutions@gmail.com",
          verificationStatus: "verified",
          apexCertifications: [
            {
              certificationName: `Apex Certified ${trade || "Specialist"}`,
              issuedAt: new Date(),
            },
          ],
          coordinates: [coordinates?.lng || 78.4867, coordinates?.lat || 17.3850], // Hyderabad, Telangana
          isAvailable: true,
        });
      } catch (proErr) {
        console.warn("Failed to create supplemental Professional record:", proErr);
      }
    }

    // Generate cryptographic HMAC-SHA256 JWT session token
    const token = signJwt(
      {
        sub: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        exp: Math.floor(Date.now() / 1000) + 7 * 86400,
        iat: Math.floor(Date.now() / 1000),
      },
      AUTH_SECRET
    );

    const authenticatedUser = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      avatarUrl: newUser.avatarUrl,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "Account registered successfully",
        user: authenticatedUser,
        token,
      },
      { status: 201 }
    );

    const cookieMaxAge = 7 * 86400;
    response.cookies.set("authjs.session-token", token, {
      path: "/",
      maxAge: cookieMaxAge,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    response.cookies.set("omniservice-role", newUser.role, {
      path: "/",
      maxAge: cookieMaxAge,
      sameSite: "lax",
    });
    response.cookies.set("omniservice-user", JSON.stringify(authenticatedUser), {
      path: "/",
      maxAge: cookieMaxAge,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to register user" },
      { status: 500 }
    );
  }
}
