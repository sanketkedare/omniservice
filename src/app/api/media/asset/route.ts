import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ASSET_FILE_MAP: Record<string, string> = {
  hero_technician: "hero_technician.jpg",
  hero_technician_v2: "hero_technician.jpg",
  electrical_service: "plumbing_electric.jpg",
  plumbing_service: "plumbing_electric.jpg",
  appliance_repair: "appliance_repair.jpg",
  ro_purifier: "ro_purifier.jpg",
  solar_inverter: "solar_inverter.jpg",
  smart_home_cctv: "smart_home.jpg",
  auth_background: "auth_background.jpg",
  omniservice_logo: "OmniService_Logo.png",
  omniservice_icon: "OmniService_Icon.png",
  volcanic_logo: "volcanic_logo.png",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "hero_technician";

  const fileName = ASSET_FILE_MAP[name] || `${name}.jpg`;
  const imagesDir = path.join(process.cwd(), "public", "images");
  const filePath = path.join(imagesDir, fileName);

  if (!fs.existsSync(filePath)) {
    // Fallback to default hero technician if specific file isn't found
    const fallbackPath = path.join(imagesDir, "hero_technician.jpg");
    if (fs.existsSync(fallbackPath)) {
      const fallbackBuffer = fs.readFileSync(fallbackPath);
      return new NextResponse(fallbackBuffer, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
    return new NextResponse("Asset not found", { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const contentType = ext === ".png" ? "image/png" : ext === ".svg" ? "image/svg+xml" : "image/jpeg";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
