import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Property, IProperty } from "@/models/property.model";

// Demo mock properties for initial testing when DB is empty
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

const createPropertySchema = z.object({
  name: z.string().min(2, "Property name is required").max(100),
  propertyType: z.enum(["apartment", "house", "villa", "office", "shop", "other"]).default("apartment"),
  address: z.object({
    street: z.string().min(3, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    postalCode: z.string().min(5, "Valid postal code is required"),
    country: z.string().default("India"),
  }),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  squareFootage: z.number().min(0).optional(),
  yearBuilt: z.number().min(1900).optional(),
  isDefault: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    // Default user ID for session demo
    const userId = "65f01234567890abcdef0001";
    let properties = await Property.find({ isActive: true }).sort({ isDefault: -1, createdAt: -1 }).lean();

    if (!properties || properties.length === 0) {
      // Return demo properties if none created yet
      return NextResponse.json({
        success: true,
        data: DEMO_PROPERTIES,
        count: DEMO_PROPERTIES.length,
      });
    }

    return NextResponse.json({
      success: true,
      data: properties,
      count: properties.length,
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: DEMO_PROPERTIES,
      count: DEMO_PROPERTIES.length,
      fallback: true,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createPropertySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const customerId = new mongoose.Types.ObjectId("65f01234567890abcdef0001");

    // If marked default, unset previous default
    if (validation.data.isDefault) {
      await Property.updateMany({ customerId }, { isDefault: false });
    }

    const newProperty = await Property.create({
      customerId,
      ...validation.data,
      healthScore: 85, // Initial baseline score
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        data: newProperty,
        message: "Property registered successfully with HomePass initialized",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create property" },
      { status: 500 }
    );
  }
}
