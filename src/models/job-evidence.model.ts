/**
 * ForgeLocal — Job Evidence Model
 *
 * TrustLock visual proof-of-work.
 * Professionals capture pre-work, milestone, and post-work evidence.
 * AI compares before/after to verify completion.
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { schemaOptions } from "./_base";

export type EvidenceType =
  | "pre_work"           // Professional arrival + existing conditions
  | "milestone"          // During-work checkpoint
  | "concealed_work"     // Work inside walls, etc. (before closing up)
  | "post_work"          // Completion evidence
  | "functional_test"    // Proof the repair works (e.g., water flowing)
  | "customer_damage"    // Pre-existing damage documentation
  | "change_order";      // Evidence supporting a change order

export type MediaType = "image" | "video";

export interface IEvidenceMedia {
  type: MediaType;
  url: string;
  storageKey: string;
  mimeType: string;
  sizeBytes?: number;
  durationSeconds?: number;
  capturedAt: Date;
  location?: { lat: number; lng: number };
}

export interface IJobEvidence extends Document {
  jobId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;

  type: EvidenceType;
  title: string;
  description?: string;
  media: IEvidenceMedia[];

  // TrustLock AI verification
  aiVerificationStatus?: "pending" | "verified" | "failed" | "skipped";
  aiVerificationScore?: number; // 0-1
  aiVerificationNotes?: string;
  verifiedAt?: Date;

  // Customer acknowledgment
  customerAcknowledgedAt?: Date;

  // Milestone checkpoint (for milestone type)
  milestoneLabel?: string;
  sequenceOrder?: number;

  createdAt: Date;
  updatedAt: Date;
}

const JobEvidenceSchema = new Schema<IJobEvidence>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    professionalId: { type: Schema.Types.ObjectId, ref: "Professional", required: true },

    type: {
      type: String,
      enum: ["pre_work", "milestone", "concealed_work", "post_work",
        "functional_test", "customer_damage", "change_order"],
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, maxlength: 2000 },
    media: [
      {
        type: { type: String, enum: ["image", "video"], required: true },
        url: { type: String, required: true },
        storageKey: { type: String, required: true },
        mimeType: { type: String, required: true },
        sizeBytes: Number,
        durationSeconds: Number,
        capturedAt: { type: Date, required: true, default: Date.now },
        location: { lat: Number, lng: Number },
      },
    ],

    aiVerificationStatus: {
      type: String,
      enum: ["pending", "verified", "failed", "skipped"],
    },
    aiVerificationScore: { type: Number, min: 0, max: 1 },
    aiVerificationNotes: { type: String, maxlength: 2000 },
    verifiedAt: Date,

    customerAcknowledgedAt: Date,

    milestoneLabel: { type: String, maxlength: 200 },
    sequenceOrder: { type: Number, default: 0 },
  },
  schemaOptions
);

JobEvidenceSchema.index({ jobId: 1, type: 1 });
JobEvidenceSchema.index({ jobId: 1, sequenceOrder: 1 });

export const JobEvidence =
  models.JobEvidence ?? model<IJobEvidence>("JobEvidence", JobEvidenceSchema);
export default JobEvidence;
