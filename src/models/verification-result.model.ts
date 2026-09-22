/**
 * ForgeLocal — Verification Result Model
 *
 * TrustLock AI comparison of pre-work vs post-work evidence.
 * Determines whether payment escrow should be released.
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { schemaOptions } from "./_base";

export type VerificationOutcome =
  | "verified"           // AI confident work is complete
  | "partially_verified" // Some completion signals present
  | "verification_failed" // Observable completion conditions not met
  | "needs_human_review" // AI uncertain — escalate
  | "bypassed_by_admin"; // Admin manually overrode

export interface IVerificationResult extends Document {
  jobId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;

  // Evidence analyzed
  preWorkEvidenceIds: mongoose.Types.ObjectId[];
  postWorkEvidenceIds: mongoose.Types.ObjectId[];

  // AI Outcome
  outcome: VerificationOutcome;
  confidenceScore: number; // 0-1
  verificationNotes: string;
  checklistResults: Array<{
    criterion: string;
    passed: boolean;
    confidence: number;
    note?: string;
  }>;

  // Before/After comparison
  improvementScore: number; // 0-1 (how much better is the after vs before)

  // AI metadata
  aiProvider: string;
  modelVersion?: string;
  processingDurationMs?: number;

  // Human review
  reviewedByAdminId?: mongoose.Types.ObjectId;
  adminVerificationOutcome?: VerificationOutcome;
  adminNotes?: string;
  reviewedAt?: Date;

  // Payment trigger
  triggeredPaymentRelease: boolean;
  paymentReleasedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const VerificationResultSchema = new Schema<IVerificationResult>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    professionalId: { type: Schema.Types.ObjectId, ref: "Professional", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    preWorkEvidenceIds: [{ type: Schema.Types.ObjectId, ref: "JobEvidence" }],
    postWorkEvidenceIds: [{ type: Schema.Types.ObjectId, ref: "JobEvidence" }],

    outcome: {
      type: String,
      enum: ["verified", "partially_verified", "verification_failed",
        "needs_human_review", "bypassed_by_admin"],
      required: true,
    },
    confidenceScore: { type: Number, required: true, min: 0, max: 1 },
    verificationNotes: { type: String, maxlength: 5000 },
    checklistResults: [
      {
        criterion: { type: String, required: true },
        passed: { type: Boolean, required: true },
        confidence: { type: Number, min: 0, max: 1 },
        note: String,
      },
    ],
    improvementScore: { type: Number, default: 0, min: 0, max: 1 },

    aiProvider: { type: String, default: "mock" },
    modelVersion: String,
    processingDurationMs: Number,

    reviewedByAdminId: { type: Schema.Types.ObjectId, ref: "User" },
    adminVerificationOutcome: {
      type: String,
      enum: ["verified", "partially_verified", "verification_failed",
        "needs_human_review", "bypassed_by_admin"],
    },
    adminNotes: { type: String, maxlength: 3000 },
    reviewedAt: Date,

    triggeredPaymentRelease: { type: Boolean, default: false },
    paymentReleasedAt: Date,
  },
  schemaOptions
);

VerificationResultSchema.index({ jobId: 1 });
VerificationResultSchema.index({ outcome: 1, createdAt: -1 });

export const VerificationResult =
  models.VerificationResult ??
  model<IVerificationResult>("VerificationResult", VerificationResultSchema);
export default VerificationResult;
