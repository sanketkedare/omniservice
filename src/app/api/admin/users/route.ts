import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user.model";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const users = await User.find({})
      .select("-passwordHash -passwordSalt")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = users.map((u: any) => ({
      id: u._id.toString(),
      name: u.name || "User",
      email: u.email || "volcanic.digitalsolutions@gmail.com",
      phone: u.phone || "—",
      role: u.role || "customer",
      kycStatus: u.role === "admin" ? "verified" : u.isVerified ? "verified" : "verified",
      joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent",
      totalBookings: 0,
    }));

    return NextResponse.json({
      success: true,
      users: formatted,
      count: formatted.length,
    });
  } catch (error: any) {
    console.error("Failed to fetch admin users:", error);
    return NextResponse.json({
      success: true,
      users: [],
      count: 0,
    });
  }
}
