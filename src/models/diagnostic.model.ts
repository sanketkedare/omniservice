/**
 * ForgeLocal — Diagnostic Session & Diagnostic Finding Models
 *
 * DiagnosticSession: InspectAI processing session tied to a service request.
 * DiagnosticFinding: Individual finding within a session (components, issues, risks).
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { schemaOptions } from "./_base";

// ── Diagnostic Session ────────────────────────────────────────────────────────
export type DiagnosticSessionStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "needs_human_review";

export interface IDiagnosticSession extends Document {
  serviceRequestId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;

  // AI Inference
  aiProvider: string;           // "gemini" | "mock"
  modelVersion?: string;
  promptVersion?: string;

  status: DiagnosticSessionStatus;
  overallConfidence: number;    // 0-1
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  processingDurationMs?: number;

  // Summary from AI
  problemSummary?: string;
  likelyRootCause?: string;
  potentialSecondaryIssues: string[];
  recommendedServiceCategory?: string;

  // Flags
  hasSafetyConcerns: boolean;
  requiresOnSiteConfirmation: boolean;
  isEscalatedToHuman: boolean;
  escalationReason?: string;

  // Raw AI response (for debugging/audit)
  rawAiResponse?: string;

  // Findings reference
  findingIds: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const DiagnosticSessionSchema = new Schema<IDiagnosticSession>(
  {
    serviceRequestId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    aiProvider: { type: String, required: true, default: "mock" },
    modelVersion: { type: String },
    promptVersion: { type: String },

    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed", "needs_human_review"],
      default: "queued",
    },
    overallConfidence: { type: Number, default: 0, min: 0, max: 1 },
    processingStartedAt: { type: Date },
    processingCompletedAt: { type: Date },
    processingDurationMs: { type: Number },

    problemSummary: { type: String, maxlength: 2000 },
    likelyRootCause: { type: String, maxlength: 1000 },
    potentialSecondaryIssues: { type: [String], default: [] },
    recommendedServiceCategory: { type: String },

    hasSafetyConcerns: { type: Boolean, default: false },
    requiresOnSiteConfirmation: { type: Boolean, default: false },
    isEscalatedToHuman: { type: Boolean, default: false },
    escalationReason: { type: String },

    rawAiResponse: { type: String },
    findingIds: [{ type: Schema.Types.ObjectId, ref: "DiagnosticFinding" }],
  },
  schemaOptions
);

DiagnosticSessionSchema.index({ serviceRequestId: 1 });
DiagnosticSessionSchema.index({ status: 1, createdAt: -1 });

// ── Diagnostic Finding ────────────────────────────────────────────────────────
export type FindingType =
  | "component_identified"
  | "damage_detected"
  | "risk_flag"
  | "measurement"
  | "appliance_identified"
  | "required_part"
  | "safety_concern";

export interface IDiagnosticFinding extends Document {
  sessionId: mongoose.Types.ObjectId;
  type: FindingType;
  title: string;
  description: string;
  confidence: number; // 0-1
  severity: "info" | "low" | "medium" | "high" | "critical";
  mediaTimestamp?: number; // Second mark in the video
  boundingBoxData?: string; // JSON string of vision bounding box
  suggestedAction?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DiagnosticFindingSchema = new Schema<IDiagnosticFinding>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "DiagnosticSession",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "component_identified", "damage_detected", "risk_flag",
        "measurement", "appliance_identified", "required_part", "safety_concern",
      ],
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 2000 },
    confidence: { type: Number, required: true, min: 0, max: 1 },
    severity: {
      type: String,
      enum: ["info", "low", "medium", "high", "critical"],
      default: "info",
    },
    mediaTimestamp: { type: Number },
    boundingBoxData: { type: String },
    suggestedAction: { type: String, maxlength: 1000 },
  },
  schemaOptions
);

DiagnosticFindingSchema.index({ sessionId: 1, type: 1 });

export const DiagnosticSession: mongoose.Model<IDiagnosticSession> =
  (models.DiagnosticSession as mongoose.Model<IDiagnosticSession>) ??
  model<IDiagnosticSession>("DiagnosticSession", DiagnosticSessionSchema);

export const DiagnosticFinding: mongoose.Model<IDiagnosticFinding> =
  (models.DiagnosticFinding as mongoose.Model<IDiagnosticFinding>) ??
  model<IDiagnosticFinding>("DiagnosticFinding", DiagnosticFindingSchema);

export default { DiagnosticSession, DiagnosticFinding };
