import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { filebaseStorage, StorageKeys } from "@/lib/storage/filebase.adapter";

const presignRequestSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  contentType: z.string().min(1, "Content type is required"),
  category: z.enum(["diagnostic", "evidence", "profile", "property"]).default("diagnostic"),
  fileSize: z.number().max(100 * 1024 * 1024, "Maximum file size is 100MB"), // 100MB max
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = presignRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { filename, contentType, category } = validation.data;

    // Validate mime types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "video/mp4",
      "video/quicktime",
      "video/webm",
      "audio/webm",
      "audio/mp4",
    ];

    if (!allowedTypes.includes(contentType.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported content type '${contentType}'. Allowed types: images (JPEG, PNG, WebP) and videos (MP4, WebM, MOV).`,
        },
        { status: 400 }
      );
    }

    // Generate safe storage key
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const userId = "user_guest"; // Default or extracted from session

    let key: string;
    if (category === "diagnostic") {
      key = StorageKeys.diagnostic(userId, sessionId, sanitizedFilename);
    } else if (category === "evidence") {
      key = StorageKeys.evidence("job_pending", "intake", sanitizedFilename);
    } else {
      key = `uploads/${category}/${Date.now()}-${sanitizedFilename}`;
    }

    // Generate presigned upload URL using Filebase adapter
    try {
      const uploadUrl = await filebaseStorage.getPresignedUploadUrl({
        key,
        contentType,
        expiresIn: 15 * 60,
      });

      const publicUrl = `https://${process.env.FILEBASE_BUCKET_NAME ?? "forgelocal-dev"}.s3.filebase.com/${key}`;

      return NextResponse.json({
        success: true,
        data: {
          uploadUrl,
          publicUrl,
          key,
          expiresIn: 900,
        },
      });
    } catch {
      // In local dev/mock mode if Filebase credentials aren't active
      const mockPublicUrl = `/uploads/${key}`;
      return NextResponse.json({
        success: true,
        data: {
          uploadUrl: `/api/uploads/mock-receiver?key=${encodeURIComponent(key)}`,
          publicUrl: mockPublicUrl,
          key,
          expiresIn: 900,
          isMock: true,
        },
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error processing upload request" },
      { status: 500 }
    );
  }
}
