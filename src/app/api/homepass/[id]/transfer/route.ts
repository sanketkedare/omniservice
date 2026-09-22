import { NextRequest, NextResponse } from "next/server";
import { homepassService } from "@/lib/homepass/homepass.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params;
    let recipientName: string | undefined = undefined;

    try {
      const body = await req.json();
      recipientName = body.recipientName;
    } catch {
      // Body is optional
    }

    const certificate = await homepassService.generateTransferCertificate(
      propertyId,
      recipientName
    );

    return NextResponse.json({
      success: true,
      message: "Transferable HomePass Passport Certificate issued successfully",
      certificate,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate transfer certificate" },
      { status: 500 }
    );
  }
}
