import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET as getCategories } from "@/app/api/categories/route";
import { POST as presignUpload } from "@/app/api/uploads/presign/route";
import { GET as getProperties, POST as createProperty } from "@/app/api/properties/route";
import { GET as getServiceRequests, POST as createServiceRequest } from "@/app/api/service-requests/route";
import { GET as getSingleServiceRequest } from "@/app/api/service-requests/[id]/route";

describe("OmniService AI — Phase 2 Customer Experience & Intake Tests", () => {
  it("GET /api/categories returns active trade categories with subcategories and pricing", async () => {
    const res = await getCategories();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(6);

    const plumbing = body.data.find((c: { slug: string }) => c.slug === "plumbing");
    expect(plumbing).toBeDefined();
    expect(plumbing.name).toContain("Plumbing");
    expect(plumbing.typicalPriceRangePaise.min).toBeGreaterThan(0);
    expect(plumbing.subcategories.length).toBeGreaterThan(0);
  });

  it("POST /api/uploads/presign validates allowed mime types and generates storage key", async () => {
    // Valid video upload
    const req = new NextRequest("http://localhost:3000/api/uploads/presign", {
      method: "POST",
      body: JSON.stringify({
        filename: "sink_leak.mp4",
        contentType: "video/mp4",
        category: "diagnostic",
        fileSize: 1024 * 1024 * 5, // 5MB
      }),
    });

    const res = await presignUpload(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.uploadUrl).toBeDefined();
    expect(body.data.key).toContain("diagnostics/");

    // Invalid mime type rejection
    const invalidReq = new NextRequest("http://localhost:3000/api/uploads/presign", {
      method: "POST",
      body: JSON.stringify({
        filename: "malicious.exe",
        contentType: "application/x-msdownload",
        category: "diagnostic",
        fileSize: 1024,
      }),
    });

    const invalidRes = await presignUpload(invalidReq);
    expect(invalidRes.status).toBe(400);
  });

  it("GET /api/properties returns customer properties with HomePass health scores", async () => {
    const req = new NextRequest("http://localhost:3000/api/properties");
    const res = await getProperties(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].healthScore).toBeGreaterThanOrEqual(80);
    expect(body.data[0].address.city).toBe("Hyderabad");
  });

  it("POST /api/service-requests creates request with media and returns tracking ID", async () => {
    const req = new NextRequest("http://localhost:3000/api/service-requests", {
      method: "POST",
      body: JSON.stringify({
        categorySlug: "plumbing",
        title: "Kitchen Sink Waste Pipe Compression Leak",
        description: "Water continuously drips from the P-trap compression nut under the sink.",
        urgency: "urgent",
        media: [
          {
            url: "https://example.com/sink_leak.mp4",
            type: "video",
            filename: "sink_leak.mp4",
            fileSize: 5000000,
          },
        ],
      }),
    });

    const res = await createServiceRequest(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data._id).toBeDefined();
    expect(body.data.status).toBe("submitted");
  });

  it("GET /api/service-requests/[id] retrieves single request with timeline and AI findings", async () => {
    const req = new NextRequest("http://localhost:3000/api/service-requests/65f01234567890abcdef2001");
    const res = await getSingleServiceRequest(req, {
      params: Promise.resolve({ id: "65f01234567890abcdef2001" }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.title).toContain("Kitchen Sink");
    expect(body.data.aiFindings.length).toBeGreaterThan(0);
  });
});
