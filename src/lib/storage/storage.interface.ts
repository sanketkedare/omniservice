/**
 * ForgeLocal — Storage Provider Interface
 *
 * This interface decouples all storage operations from the specific provider.
 * Currently implemented by FilebaseAdapter (S3-compatible).
 * Can be swapped for any S3-compatible provider without touching business logic.
 */

export interface UploadOptions {
  /** Destination key/path in the storage bucket */
  key: string;
  /** File content */
  body: Buffer | Uint8Array | ReadableStream;
  /** MIME type */
  contentType: string;
  /** Metadata to attach to the object */
  metadata?: Record<string, string>;
  /** Access control — defaults to private */
  acl?: "private" | "public-read";
}

export interface PresignedUrlOptions {
  /** Object key */
  key: string;
  /** Expiry in seconds (default: 3600) */
  expiresIn?: number;
  /** For upload presigned URLs: restrict content type */
  contentType?: string;
  /** Max allowed content length in bytes */
  maxContentLength?: number;
}

export interface StorageObject {
  key: string;
  url: string;
  size?: number;
  contentType?: string;
  lastModified?: Date;
  metadata?: Record<string, string>;
}

export interface IStorageProvider {
  /**
   * Upload a file to storage.
   * Returns the public or private URL of the uploaded object.
   */
  upload(options: UploadOptions): Promise<StorageObject>;

  /**
   * Generate a presigned URL for direct client upload.
   * The client can use this URL to upload directly to storage
   * without routing the file through the application server.
   */
  getPresignedUploadUrl(options: PresignedUrlOptions): Promise<string>;

  /**
   * Generate a presigned URL for secure reading of a private object.
   */
  getPresignedReadUrl(options: PresignedUrlOptions): Promise<string>;

  /**
   * Delete an object from storage.
   */
  delete(key: string): Promise<void>;

  /**
   * Check if an object exists in storage.
   */
  exists(key: string): Promise<boolean>;

  /**
   * Get object metadata without downloading the content.
   */
  getMetadata(key: string): Promise<StorageObject | null>;
}

// ── Storage Key Helpers ───────────────────────────────────────────────────────
/**
 * Generates organized storage keys for different media types.
 * All paths are namespaced to prevent collisions.
 */
export const StorageKeys = {
  /** Customer diagnostic videos and images */
  diagnostic: (userId: string, sessionId: string, filename: string) =>
    `diagnostics/${userId}/${sessionId}/${filename}`,

  /** Professional verification documents */
  verification: (professionalId: string, docType: string, filename: string) =>
    `verification/${professionalId}/${docType}/${filename}`,

  /** Job evidence (pre-work, milestone, post-work) */
  evidence: (jobId: string, evidenceType: string, filename: string) =>
    `evidence/${jobId}/${evidenceType}/${filename}`,

  /** Property documents and media */
  property: (propertyId: string, filename: string) =>
    `properties/${propertyId}/${filename}`,

  /** User profile avatars */
  avatar: (userId: string, filename: string) =>
    `avatars/${userId}/${filename}`,
} as const;
