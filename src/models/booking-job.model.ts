/**
 * ForgeLocal — Booking & Job Models
 *
 * Booking: The confirmed appointment between customer and professional.
 * Job: The execution record for a confirmed booking.
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { schemaOptions } from "./_base";

// ── Booking ───────────────────────────────────────────────────────────────────
export type BookingStatus =
  | "pending"            // Created — awaiting payment authorization
  | "confirmed"          // Payment authorized
  | "professional_en_route"
  | "professional_arrived"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rescheduled";

export interface IBooking extends Document {
  serviceRequestId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  scopeOfWorkId: mongoose.Types.ObjectId;
  pricingEstimateId: mongoose.Types.ObjectId;

  status: BookingStatus;
  statusHistory: Array<{
    status: BookingStatus;
    timestamp: Date;
    reason?: string;
    changedBy?: mongoose.Types.ObjectId;
    location?: { lat: number; lng: number };
  }>;

  // Scheduling
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  actualStartAt?: Date;
  actualEndAt?: Date;
  actualDurationMinutes?: number;

  // Payment Authorization
  authorizedAmountPaise: number;
  paymentId?: mongoose.Types.ObjectId;

  // Matching context
  matchScore?: number;
  matchReason?: string;
  estimatedArrivalMinutes?: number;
  estimatedDistanceKm?: number;

  // Cancellation
  cancelledAt?: Date;
  cancelledBy?: "customer" | "professional" | "system";
  cancellationReason?: string;
  cancellationPolicyApplied?: string;

  // Job reference
  jobId?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    serviceRequestId: { type: Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    professionalId: { type: Schema.Types.ObjectId, ref: "Professional", required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    scopeOfWorkId: { type: Schema.Types.ObjectId, ref: "ScopeOfWork", required: true },
    pricingEstimateId: { type: Schema.Types.ObjectId, ref: "PricingEstimate", required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "professional_en_route", "professional_arrived",
        "in_progress", "completed", "cancelled", "rescheduled"],
      default: "pending",
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        reason: String,
        changedBy: { type: Schema.Types.ObjectId, ref: "User" },
        location: { lat: Number, lng: Number },
      },
    ],

    scheduledStartAt: { type: Date, required: true },
    scheduledEndAt: { type: Date, required: true },
    actualStartAt: Date,
    actualEndAt: Date,
    actualDurationMinutes: Number,

    authorizedAmountPaise: { type: Number, required: true, min: 0 },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },

    matchScore: Number,
    matchReason: String,
    estimatedArrivalMinutes: Number,
    estimatedDistanceKm: Number,

    cancelledAt: Date,
    cancelledBy: { type: String, enum: ["customer", "professional", "system"] },
    cancellationReason: String,
    cancellationPolicyApplied: String,

    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
  },
  schemaOptions
);

BookingSchema.index({ customerId: 1, status: 1 });
BookingSchema.index({ professionalId: 1, status: 1 });
BookingSchema.index({ scheduledStartAt: 1, professionalId: 1 });
BookingSchema.index({ serviceRequestId: 1 });

// ── Job ───────────────────────────────────────────────────────────────────────
export type JobStatus =
  | "assigned"
  | "professional_en_route"
  | "arrived"
  | "pre_work_evidence_captured"
  | "in_progress"
  | "change_order_pending"
  | "submitted_for_verification"
  | "verification_in_progress"
  | "verified"
  | "verification_failed"
  | "needs_human_review"
  | "completed"
  | "disputed"
  | "cancelled";

export interface IJob extends Document {
  bookingId: mongoose.Types.ObjectId;
  serviceRequestId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  scopeOfWorkId: mongoose.Types.ObjectId;

  status: JobStatus;
  statusHistory: Array<{
    status: JobStatus;
    timestamp: Date;
    note?: string;
    changedBy?: mongoose.Types.ObjectId;
  }>;

  // Evidence references
  evidenceIds: mongoose.Types.ObjectId[];

  // Verification
  verificationResultId?: mongoose.Types.ObjectId;

  // Financials
  finalAmountPaise?: number;     // Agreed final amount after any change orders
  paymentId?: mongoose.Types.ObjectId;
  payoutId?: mongoose.Types.ObjectId;

  // Ratings
  customerReviewId?: mongoose.Types.ObjectId;
  professionalReviewId?: mongoose.Types.ObjectId;

  // HomePass
  maintenanceRecordId?: mongoose.Types.ObjectId;

  // Notes
  professionalNotes?: string;
  internalNotes?: string;

  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    serviceRequestId: { type: Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    professionalId: { type: Schema.Types.ObjectId, ref: "Professional", required: true, index: true },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    scopeOfWorkId: { type: Schema.Types.ObjectId, ref: "ScopeOfWork", required: true },

    status: {
      type: String,
      enum: [
        "assigned", "professional_en_route", "arrived", "pre_work_evidence_captured",
        "in_progress", "change_order_pending", "submitted_for_verification",
        "verification_in_progress", "verified", "verification_failed",
        "needs_human_review", "completed", "disputed", "cancelled",
      ],
      default: "assigned",
      index: true,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: String,
        changedBy: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],

    evidenceIds: [{ type: Schema.Types.ObjectId, ref: "JobEvidence" }],
    verificationResultId: { type: Schema.Types.ObjectId, ref: "VerificationResult" },

    finalAmountPaise: Number,
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    payoutId: { type: Schema.Types.ObjectId, ref: "Payout" },

    customerReviewId: { type: Schema.Types.ObjectId, ref: "Review" },
    professionalReviewId: { type: Schema.Types.ObjectId, ref: "Review" },

    maintenanceRecordId: { type: Schema.Types.ObjectId, ref: "MaintenanceRecord" },

    professionalNotes: { type: String, maxlength: 5000 },
    internalNotes: { type: String, maxlength: 5000 },

    completedAt: Date,
  },
  schemaOptions
);

JobSchema.index({ customerId: 1, status: 1 });
JobSchema.index({ professionalId: 1, status: 1 });
JobSchema.index({ status: 1, createdAt: -1 });

// Models
export const Booking = models.Booking ?? model<IBooking>("Booking", BookingSchema);
export const Job = models.Job ?? model<IJob>("Job", JobSchema);
export default { Booking, Job };
