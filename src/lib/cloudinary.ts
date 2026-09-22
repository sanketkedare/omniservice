import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
} else if (cloudName) {
  cloudinary.config({
    cloud_name: cloudName,
    secure: true,
  });
}

export { cloudinary };

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: "image" | "video" | "raw";
  format?: string;
  bytes: number;
  duration?: number;
  width?: number;
  height?: number;
}

/**
 * Upload a Buffer or Base64 string directly to Cloudinary
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    resource_type?: "auto" | "image" | "video" | "raw";
    public_id?: string;
    upload_preset?: string;
  } = {}
): Promise<CloudinaryUploadResult> {
  const {
    folder = "omniservice",
    resource_type = "auto",
    public_id,
    upload_preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "omniservice_uploads",
  } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type,
        public_id,
        upload_preset: upload_preset || undefined,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type as "image" | "video" | "raw",
          format: result.format,
          bytes: result.bytes,
          duration: result.duration,
          width: result.width,
          height: result.height,
        });
      }
    );

    uploadStream.end(buffer);
  });
}
