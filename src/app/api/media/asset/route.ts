import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ASSET_MAP: Record<string, string> = {
  hero_technician: "C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\3184ff43-30b4-4df9-afd2-3b34d557ba1c\\hero_technician_v2_1790241050910.jpg",
  hero_technician_v2: "C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\3184ff43-30b4-4df9-afd2-3b34d557ba1c\\hero_technician_v2_1790241050910.jpg",
  electrical_service: "C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\3184ff43-30b4-4df9-afd2-3b34d557ba1c\\plumbing_electric_repair_1790227603297.jpg",
  plumbing_service: "C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\3184ff43-30b4-4df9-afd2-3b34d557ba1c\\plumbing_inspection_1790227655299.jpg",
  appliance_repair: "C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\3184ff43-30b4-4df9-afd2-3b34d557ba1c\\appliance_repair_tech_1790230767617.jpg",
  ro_purifier: "C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\3184ff43-30b4-4df9-afd2-3b34d557ba1c\\ro_purifier_tech_1790230794268.jpg",
  solar_inverter: "C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\3184ff43-30b4-4df9-afd2-3b34d557ba1c\\solar_inverter_tech_1790230833612.jpg",
  smart_home_cctv: "C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\3184ff43-30b4-4df9-afd2-3b34d557ba1c\\smart_home_cctv_tech_1790230874953.jpg",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "hero_technician";

  const filePath = ASSET_MAP[name];
  if (!filePath || !fs.existsSync(filePath)) {
    return new NextResponse("Asset not found", { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "no-cache, must-revalidate",
    },
  });
}
