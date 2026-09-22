import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  // Mock upload receiver accepts the file stream
  const url = new URL(req.url);
  const key = url.searchParams.get("key") || "mock_file";

  return NextResponse.json({
    success: true,
    message: "File received successfully (mock local storage)",
    key,
  });
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
