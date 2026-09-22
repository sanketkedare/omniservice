/**
 * ForgeLocal — Filebase Storage Adapter
 *
 * Implements IStorageProvider for Filebase (S3-compatible object storage).
 * Filebase is IPFS-backed, S3-API-compatible, and ideal for media storage.
 *
 * Documentation: https://docs.filebase.com/
 */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";
import type {
  IStorageProvider,
  UploadOptions,
  PresignedUrlOptions,
  StorageObject,
} from "./storage.interface";

export class FilebaseAdapter implements IStorageProvider {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor() {
    this.bucket = env.FILEBASE_BUCKET_NAME;
    this.publicUrl =
      env.FILEBASE_PUBLIC_URL ??
      `https://${env.FILEBASE_BUCKET_NAME}.s3.filebase.com`;

    this.client = new S3Client({
      endpoint: env.FILEBASE_ENDPOINT,
      region: env.FILEBASE_REGION,
      credentials: {
        accessKeyId: env.FILEBASE_ACCESS_KEY,
        secretAccessKey: env.FILEBASE_SECRET_KEY,
      },
      forcePathStyle: true, // Required for Filebase
    });

    logger.info(
      { bucket: this.bucket, endpoint: env.FILEBASE_ENDPOINT },
      "FilebaseAdapter initialized"
    );
  }

  async upload(options: UploadOptions): Promise<StorageObject> {
    const { key, body, contentType, metadata, acl = "private" } = options;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body as PutObjectCommandInput["Body"],
      ContentType: contentType,
      Metadata: metadata,
      ACL: acl,
    });

    try {
      await this.client.send(command);

      const url =
        acl === "public-read"
          ? `${this.publicUrl}/${key}`
          : await this.getPresignedReadUrl({ key, expiresIn: 3600 });

      logger.info({ key, contentType }, "File uploaded to Filebase");

      return {
        key,
        url,
        contentType,
        metadata,
      };
    } catch (error) {
      logger.error({ error, key }, "Failed to upload file to Filebase");
      throw new Error(`Storage upload failed: ${(error as Error).message}`);
    }
  }

  async getPresignedUploadUrl(options: PresignedUrlOptions): Promise<string> {
    const { key, expiresIn = 3600, contentType } = options;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    try {
      const url = await getSignedUrl(this.client, command, { expiresIn });
      logger.debug({ key, expiresIn }, "Generated presigned upload URL");
      return url;
    } catch (error) {
      logger.error({ error, key }, "Failed to generate presigned upload URL");
      throw new Error(
        `Failed to generate upload URL: ${(error as Error).message}`
      );
    }
  }

  async getPresignedReadUrl(options: PresignedUrlOptions): Promise<string> {
    const { key, expiresIn = 3600 } = options;

    // Filebase: use GetObject presigned URL approach
    // Note: For truly public objects, use the public URL directly.
    // For private objects, generate a signed URL.
    const { GetObjectCommand } = await import("@aws-sdk/client-s3");
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const url = await getSignedUrl(this.client, command, { expiresIn });
      return url;
    } catch (error) {
      logger.error({ error, key }, "Failed to generate presigned read URL");
      throw new Error(
        `Failed to generate read URL: ${(error as Error).message}`
      );
    }
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      await this.client.send(command);
      logger.info({ key }, "File deleted from Filebase");
    } catch (error) {
      logger.error({ error, key }, "Failed to delete file from Filebase");
      throw new Error(
        `Storage delete failed: ${(error as Error).message}`
      );
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.getMetadata(key);
      return true;
    } catch {
      return false;
    }
  }

  async getMetadata(key: string): Promise<StorageObject | null> {
    const command = new HeadObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
      return {
        key,
        url: `${this.publicUrl}/${key}`,
        size: response.ContentLength,
        contentType: response.ContentType,
        lastModified: response.LastModified,
        metadata: response.Metadata,
      };
    } catch (error) {
      if ((error as { name?: string }).name === "NotFound") {
        return null;
      }
      throw error;
    }
  }
}

// ── Singleton Instance ────────────────────────────────────────────────────────
let storageInstance: FilebaseAdapter | null = null;

export function getStorageProvider(): FilebaseAdapter {
  if (!storageInstance) {
    storageInstance = new FilebaseAdapter();
  }
  return storageInstance;
}
