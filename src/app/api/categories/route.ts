import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ServiceCategory } from "@/models/service-category.model";
import { INITIAL_CATEGORIES } from "@/lib/mock-data";

export { INITIAL_CATEGORIES };

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
