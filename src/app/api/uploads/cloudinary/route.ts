import { NextRequest, NextResponse } from "next/server";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "omniservice";
    const category = (formData.get("category") as string) || "diagnostic";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided in form data" },
        { status: 400 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "omniservice_uploads";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If Cloudinary API credentials exist, use server-side upload stream
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && cloudName) {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").split(".")[0];
      const result = await uploadBufferToCloudinary(buffer, {
        folder: `${folder}/${category}`,
        resource_type: "auto",
        public_id: `${Date.now()}_${sanitizedName}`,
      });

      return NextResponse.json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          type: result.resource_type,
          format: result.format,
          bytes: result.bytes,
          duration: result.duration,
        },
      });
    }

    // Alternatively, if unsigned preset & cloudName are configured, perform direct REST upload to Cloudinary API
    if (cloudName && uploadPreset) {
      const cloudinaryFormData = new FormData();
      const blob = new Blob([buffer], { type: file.type });
      cloudinaryFormData.append("file", blob, file.name);
      cloudinaryFormData.append("upload_preset", uploadPreset);
      cloudinaryFormData.append("folder", `${folder}/${category}`);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryRes.ok) {
        return NextResponse.json(
          {
            success: false,
            error: cloudinaryData.error?.message || "Cloudinary direct upload failed",
            details: cloudinaryData,
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          url: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
          type: cloudinaryData.resource_type,
          format: cloudinaryData.format,
          bytes: cloudinaryData.bytes,
          duration: cloudinaryData.duration,
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Cloudinary credentials missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local",
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Cloudinary upload route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process upload to Cloudinary",
      },
      { status: 500 }
    );
  }
}
