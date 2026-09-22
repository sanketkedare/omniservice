import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Property, IProperty } from "@/models/property.model";
import { DEMO_PROPERTIES } from "@/lib/mock-data";

export { DEMO_PROPERTIES };

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
    const properties = await Property.find({ isActive: true })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: properties || [],
      count: properties ? properties.length : 0,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: [],
      count: 0,
      error: "Failed to fetch properties",
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
