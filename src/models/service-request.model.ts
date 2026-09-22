/**
 * ForgeLocal — Service Request Model
 *
 * The entry point of the ForgeLocal workflow.
 * Created when a customer submits a problem — via camera, text, or voice.
 * Transitions through the full AI diagnostic pipeline.
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { schemaOptions } from "./_base";

export type ServiceRequestStatus =
  | "draft"                // Customer is still composing
  | "submitted"            // Customer submitted — awaiting AI intake
  | "analyzing"            // InspectAI is processing
  | "awaiting_sow"         // Analysis done — generating SOW
  | "sow_ready"            // SOW + pricing generated — awaiting customer review
  | "sow_approved"         // Customer approved SOW — finding professionals
  | "matching"             // SmartRoute is matching professionals
  | "match_found"          // Professionals identified — awaiting customer booking
  | "booked"               // Booking confirmed — job created
  | "cancelled"            // Cancelled by customer or system
  | "escalated";           // Escalated to human review

export type MediaType = "video" | "image" | "voice" | "text";

export interface IMediaFile {
  type: MediaType;
  url: string;
  storageKey: string;
  mimeType: string;
  sizeBytes?: number;
  durationSeconds?: number; // For video/voice
  transcription?: string;   // For voice
}

export interface IServiceRequest extends Document {
  customerId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  serviceCategoryId?: mongoose.Types.ObjectId;

  // Problem Description
  title: string;
  description?: string;
  media: IMediaFile[];

  // Source
  intakeChannel: "app" | "whatsapp" | "sms" | "voice" | "web";

  // Status
  status: ServiceRequestStatus;
  statusHistory: Array<{
    status: ServiceRequestStatus;
    timestamp: Date;
    reason?: string;
    changedBy?: mongoose.Types.ObjectId;
  }>;

  // Priority
  urgency: "routine" | "urgent" | "emergency";

  // References (populated as the workflow progresses)
  diagnosticSessionId?: mongoose.Types.ObjectId;
  scopeOfWorkId?: mongoose.Types.ObjectId;
  pricingEstimateId?: mongoose.Types.ObjectId;
  jobId?: mongoose.Types.ObjectId;

  // Escalation
  escalationReason?: string;
  escalatedAt?: Date;
  assignedReviewerId?: mongoose.Types.ObjectId;

  // Metadata
  aiCategoryDetected?: string;
  aiCategoryConfidence?: number;

  createdAt: Date;
  updatedAt: Date;
}

const ServiceRequestSchema = new Schema<IServiceRequest>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    serviceCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceCategory",
    },

    title: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, maxlength: 5000 },
    media: [
      {
        type: { type: String, enum: ["video", "image", "voice", "text"], required: true },
        url: { type: String, required: true },
        storageKey: { type: String, required: true },
        mimeType: { type: String, required: true },
        sizeBytes: Number,
        durationSeconds: Number,
        transcription: String,
      },
    ],

    intakeChannel: {
      type: String,
      enum: ["app", "whatsapp", "sms", "voice", "web"],
      default: "app",
    },

    status: {
      type: String,
      enum: [
        "draft", "submitted", "analyzing", "awaiting_sow", "sow_ready",
        "sow_approved", "matching", "match_found", "booked", "cancelled", "escalated",
      ],
      default: "draft",
      index: true,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, required: true, default: Date.now },
        reason: String,
        changedBy: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],

    urgency: {
      type: String,
      enum: ["routine", "urgent", "emergency"],
      default: "routine",
    },

    diagnosticSessionId: { type: Schema.Types.ObjectId, ref: "DiagnosticSession" },
    scopeOfWorkId: { type: Schema.Types.ObjectId, ref: "ScopeOfWork" },
    pricingEstimateId: { type: Schema.Types.ObjectId, ref: "PricingEstimate" },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },

    escalationReason: { type: String, maxlength: 2000 },
    escalatedAt: { type: Date },
    assignedReviewerId: { type: Schema.Types.ObjectId, ref: "User" },

    aiCategoryDetected: { type: String },
    aiCategoryConfidence: { type: Number, min: 0, max: 1 },
  },
  schemaOptions
);

// Indexes
ServiceRequestSchema.index({ customerId: 1, status: 1 });
ServiceRequestSchema.index({ customerId: 1, createdAt: -1 });
ServiceRequestSchema.index({ status: 1, createdAt: -1 });
ServiceRequestSchema.index({ propertyId: 1, createdAt: -1 });

export const ServiceRequest: mongoose.Model<IServiceRequest> =
  (models.ServiceRequest as mongoose.Model<IServiceRequest>) ??
  model<IServiceRequest>("ServiceRequest", ServiceRequestSchema);
export default ServiceRequest;
