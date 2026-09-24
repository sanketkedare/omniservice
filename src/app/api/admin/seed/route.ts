import { NextResponse } from "next/server";
import { seedFullDatabase } from "@/scripts/seed-full-db";

export async function POST() {
  try {
    await seedFullDatabase();
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with dummy evaluation data!",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Failed to seed database via API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to seed database.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
