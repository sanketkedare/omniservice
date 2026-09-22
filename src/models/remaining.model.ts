/**
 * ForgeLocal — Dispute, Review, MaintenanceRecord, Warranty,
 *              Notification, AIInference, AuditLog Models
 *
 * Remaining 7 domain models from the PRD/Build Prompt.
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { schemaOptions } from "./_base";

// ── Dispute ───────────────────────────────────────────────────────────────────
export type DisputeStatus =
  | "open"
  | "evidence_collection"
  | "under_review"
  | "resolved_for_customer"
  | "resolved_for_professional"
  | "resolved_partial"
  | "closed_no_action"
  | "escalated";

export interface IDispute extends Document {
  jobId: mongoose.Types.ObjectId;
  paymentId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;
  initiatedBy: "customer" | "professional" | "system";
  reason: string;
  description: string;
  status: DisputeStatus;
  timeline: Array<{ event: string; timestamp: Date; note?: string; actorId?: mongoose.Types.ObjectId }>;
  evidenceIds: mongoose.Types.ObjectId[];
  aiSummary?: string;
  assignedReviewerId?: mongoose.Types.ObjectId;
  resolutionNote?: string;
  resolvedAt?: Date;
  refundAmountPaise?: number;
  createdAt: Date;
  updatedAt: Date;
}

const DisputeSchema = new Schema<IDispute>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    professionalId: { type: Schema.Types.ObjectId, ref: "Professional", required: true },
    initiatedBy: { type: String, enum: ["customer", "professional", "system"], required: true },
    reason: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, required: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ["open", "evidence_collection", "under_review", "resolved_for_customer",
        "resolved_for_professional", "resolved_partial", "closed_no_action", "escalated"],
      default: "open",
    },
    timeline: [
      {
        event: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: String,
        actorId: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    evidenceIds: [{ type: Schema.Types.ObjectId, ref: "JobEvidence" }],
    aiSummary: { type: String, maxlength: 3000 },
    assignedReviewerId: { type: Schema.Types.ObjectId, ref: "User" },
    resolutionNote: { type: String, maxlength: 3000 },
    resolvedAt: Date,
    refundAmountPaise: { type: Number, min: 0 },
  },
  schemaOptions
);
DisputeSchema.index({ status: 1, createdAt: -1 });
DisputeSchema.index({ customerId: 1, status: 1 });

// ── Review ────────────────────────────────────────────────────────────────────
export interface IReview extends Document {
  jobId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  revieweeId: mongoose.Types.ObjectId;
  reviewerRole: "customer" | "professional";
  rating: number; // 1-5
  title?: string;
  comment?: string;
  tags: string[];
  isVisible: boolean;
  flaggedForReview: boolean;
  professionalReplyText?: string;
  professionalRepliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    revieweeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewerRole: { type: String, enum: ["customer", "professional"], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 200 },
    comment: { type: String, maxlength: 3000 },
    tags: { type: [String], default: [] },
    isVisible: { type: Boolean, default: true },
    flaggedForReview: { type: Boolean, default: false },
    professionalReplyText: { type: String, maxlength: 2000 },
    professionalRepliedAt: Date,
  },
  schemaOptions
);
ReviewSchema.index({ revieweeId: 1, isVisible: 1 });
ReviewSchema.index({ jobId: 1, reviewerRole: 1 });

// ── MaintenanceRecord ─────────────────────────────────────────────────────────
export interface IMaintenanceRecord extends Document {
  propertyId: mongoose.Types.ObjectId;
  jobId?: mongoose.Types.ObjectId;
  serviceCategoryId?: mongoose.Types.ObjectId;
  professionalId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  serviceDate: Date;
  costPaise?: number;
  partReplaced?: string;
  warrantyId?: mongoose.Types.ObjectId;
  evidenceUrls: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MaintenanceRecordSchema = new Schema<IMaintenanceRecord>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    serviceCategoryId: { type: Schema.Types.ObjectId, ref: "ServiceCategory" },
    professionalId: { type: Schema.Types.ObjectId, ref: "Professional" },
    title: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, maxlength: 3000 },
    serviceDate: { type: Date, required: true },
    costPaise: { type: Number, min: 0 },
    partReplaced: { type: String, maxlength: 300 },
    warrantyId: { type: Schema.Types.ObjectId, ref: "Warranty" },
    evidenceUrls: { type: [String], default: [] },
    tags: { type: [String], default: [] },
  },
  schemaOptions
);
MaintenanceRecordSchema.index({ propertyId: 1, serviceDate: -1 });

// ── Warranty ──────────────────────────────────────────────────────────────────
export interface IWarranty extends Document {
  propertyId: mongoose.Types.ObjectId;
  maintenanceRecordId?: mongoose.Types.ObjectId;
  jobId?: mongoose.Types.ObjectId;
  itemName: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  warrantyStartDate: Date;
  warrantyEndDate: Date;
  warrantyType: "parts" | "labor" | "comprehensive" | "extended";
  providerName?: string;
  providerContact?: string;
  documentUrl?: string;
  notes?: string;
  isExpired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WarrantySchema = new Schema<IWarranty>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true, index: true },
    maintenanceRecordId: { type: Schema.Types.ObjectId, ref: "MaintenanceRecord" },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    itemName: { type: String, required: true, trim: true, maxlength: 300 },
    manufacturer: { type: String, trim: true },
    modelNumber: { type: String, trim: true },
    serialNumber: { type: String, trim: true },
    purchaseDate: Date,
    warrantyStartDate: { type: Date, required: true },
    warrantyEndDate: { type: Date, required: true },
    warrantyType: { type: String, enum: ["parts", "labor", "comprehensive", "extended"], default: "comprehensive" },
    providerName: { type: String, trim: true },
    providerContact: { type: String, trim: true },
    documentUrl: String,
    notes: { type: String, maxlength: 2000 },
    isExpired: { type: Boolean, default: false },
  },
  schemaOptions
);
WarrantySchema.index({ propertyId: 1, warrantyEndDate: 1 });
WarrantySchema.index({ warrantyEndDate: 1, isExpired: 1 });

// ── Notification ──────────────────────────────────────────────────────────────
export type NotificationChannel = "push" | "email" | "sms" | "whatsapp" | "in_app";
export type NotificationStatus = "pending" | "sent" | "delivered" | "read" | "failed";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  channel: NotificationChannel;
  title: string;
  body: string;
  data?: Record<string, string>;
  status: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failureReason?: string;
  entityType?: string;  // "job" | "booking" | "dispute" | etc.
  entityId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    channel: {
      type: String,
      enum: ["push", "email", "sms", "whatsapp", "in_app"],
      required: true,
    },
    title: { type: String, required: true, maxlength: 200 },
    body: { type: String, required: true, maxlength: 2000 },
    data: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "read", "failed"],
      default: "pending",
    },
    sentAt: Date,
    deliveredAt: Date,
    readAt: Date,
    failureReason: { type: String, maxlength: 500 },
    entityType: { type: String, maxlength: 50 },
    entityId: { type: Schema.Types.ObjectId },
  },
  schemaOptions
);
NotificationSchema.index({ userId: 1, status: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, readAt: 1 });

// ── AIInference ───────────────────────────────────────────────────────────────
export interface IAIInference extends Document {
  jobType: "diagnostic" | "sow_generation" | "pricing" | "matching" | "verification" | "conversation";
  entityId: mongoose.Types.ObjectId;
  provider: string;
  modelVersion?: string;
  promptVersion?: string;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs?: number;
  confidenceScore?: number;
  inputSummary?: string;
  outputSummary?: string;
  errorCode?: string;
  errorMessage?: string;
  success: boolean;
  createdAt: Date;
}

const AIInferenceSchema = new Schema<IAIInference>(
  {
    jobType: {
      type: String,
      enum: ["diagnostic", "sow_generation", "pricing", "matching", "verification", "conversation"],
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId, required: true },
    provider: { type: String, required: true },
    modelVersion: String,
    promptVersion: String,
    inputTokens: Number,
    outputTokens: Number,
    latencyMs: Number,
    confidenceScore: { type: Number, min: 0, max: 1 },
    inputSummary: { type: String, maxlength: 500 },
    outputSummary: { type: String, maxlength: 500 },
    errorCode: String,
    errorMessage: String,
    success: { type: Boolean, required: true, default: true },
  },
  { ...schemaOptions, timestamps: { createdAt: true, updatedAt: false } }
);
AIInferenceSchema.index({ jobType: 1, success: 1, createdAt: -1 });
AIInferenceSchema.index({ provider: 1, createdAt: -1 });

// ── AuditLog ──────────────────────────────────────────────────────────────────
export interface IAuditLog extends Document {
  actorId?: mongoose.Types.ObjectId;
  actorRole?: string;
  action: string;
  entityType: string;
  entityId?: mongoose.Types.ObjectId;
  previousValue?: string; // JSON string
  newValue?: string;      // JSON string
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
    actorRole: { type: String, maxlength: 50 },
    action: { type: String, required: true, maxlength: 200 },
    entityType: { type: String, required: true, maxlength: 100 },
    entityId: { type: Schema.Types.ObjectId },
    previousValue: { type: String },
    newValue: { type: String },
    ipAddress: { type: String, maxlength: 50 },
    userAgent: { type: String, maxlength: 500 },
    requestId: { type: String, maxlength: 100 },
    metadata: { type: Schema.Types.Mixed },
  },
  { ...schemaOptions, timestamps: { createdAt: true, updatedAt: false } }
);
AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });

// ── Model Exports ─────────────────────────────────────────────────────────────
export const Dispute: mongoose.Model<IDispute> =
  (models.Dispute as mongoose.Model<IDispute>) ?? model<IDispute>("Dispute", DisputeSchema);
export const Review: mongoose.Model<IReview> =
  (models.Review as mongoose.Model<IReview>) ?? model<IReview>("Review", ReviewSchema);
export const MaintenanceRecord: mongoose.Model<IMaintenanceRecord> =
  (models.MaintenanceRecord as mongoose.Model<IMaintenanceRecord>) ??
  model<IMaintenanceRecord>("MaintenanceRecord", MaintenanceRecordSchema);
export const Warranty: mongoose.Model<IWarranty> =
  (models.Warranty as mongoose.Model<IWarranty>) ?? model<IWarranty>("Warranty", WarrantySchema);
export const Notification: mongoose.Model<INotification> =
  (models.Notification as mongoose.Model<INotification>) ??
  model<INotification>("Notification", NotificationSchema);
export const AIInference: mongoose.Model<IAIInference> =
  (models.AIInference as mongoose.Model<IAIInference>) ??
  model<IAIInference>("AIInference", AIInferenceSchema);
export const AuditLog: mongoose.Model<IAuditLog> =
  (models.AuditLog as mongoose.Model<IAuditLog>) ?? model<IAuditLog>("AuditLog", AuditLogSchema);

