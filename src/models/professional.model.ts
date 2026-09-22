/**
 * ForgeLocal — Professional Model
 *
 * Extended profile for users with role="professional".
 * Contains business information, service radius, verification status,
 * and operational preferences (Professional AI Twin configuration).
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { ADDRESS_SCHEMA, schemaOptions } from "./_base";

// ── Types ─────────────────────────────────────────────────────────────────────
export type VerificationStatus =
  | "not_started"
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "suspended";

export interface IOperationalPreferences {
  workingHoursStart: string; // "08:00"
  workingHoursEnd: string;   // "18:00"
  workingDays: number[];     // [1,2,3,4,5] (Mon-Fri)
  minimumJobValuePaise: number;
  maximumDailyJobs: number;
  emergencyAvailable: boolean;
  autoAcceptJobs: boolean;
  preferredCategories: string[];
  targetHourlyRatePaise: number;
}

export interface IProfessional extends Document {
  userId: mongoose.Types.ObjectId;

  // Business Information
  businessName?: string;
  tagline?: string;
  bio?: string;
  yearsOfExperience?: number;

  // Location & Service Area
  currentLocation?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  serviceRadius: number; // in kilometers
  baseAddress: typeof ADDRESS_SCHEMA;

  // Verification
  verificationStatus: VerificationStatus;
  verifiedAt?: Date;
  verificationNotes?: string;

  // Documents
  governmentIdUrl?: string;
  tradeLicenseUrl?: string;
  insuranceCertUrl?: string;

  // Metrics (updated asynchronously)
  completedJobsCount: number;
  averageRating: number;
  totalRatingsCount: number;
  acceptanceRate: number;
  completionRate: number;
  responseTimeMinutes: number;
  cancellationRate: number;

  // Operations
  isAvailable: boolean;
  isOnline: boolean;
  operationalPreferences: IOperationalPreferences;

  // Earnings
  totalEarnedPaise: number;
  pendingPayoutPaise: number;

  createdAt: Date;
  updatedAt: Date;
}

// ── Schema ────────────────────────────────────────────────────────────────────
const ProfessionalSchema = new Schema<IProfessional>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessName: { type: String, trim: true, maxlength: 200 },
    tagline: { type: String, trim: true, maxlength: 300 },
    bio: { type: String, maxlength: 2000 },
    yearsOfExperience: { type: Number, min: 0, max: 60 },

    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
      },
    },
    serviceRadius: { type: Number, default: 20, min: 1, max: 200 }, // km
    baseAddress: ADDRESS_SCHEMA,

    verificationStatus: {
      type: String,
      enum: ["not_started", "pending", "under_review", "approved", "rejected", "suspended"],
      default: "not_started",
    },
    verifiedAt: { type: Date },
    verificationNotes: { type: String, maxlength: 2000 },

    governmentIdUrl: { type: String },
    tradeLicenseUrl: { type: String },
    insuranceCertUrl: { type: String },

    completedJobsCount: { type: Number, default: 0, min: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatingsCount: { type: Number, default: 0, min: 0 },
    acceptanceRate: { type: Number, default: 0, min: 0, max: 1 },
    completionRate: { type: Number, default: 0, min: 0, max: 1 },
    responseTimeMinutes: { type: Number, default: 0, min: 0 },
    cancellationRate: { type: Number, default: 0, min: 0, max: 1 },

    isAvailable: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },

    operationalPreferences: {
      workingHoursStart: { type: String, default: "08:00" },
      workingHoursEnd: { type: String, default: "18:00" },
      workingDays: { type: [Number], default: [1, 2, 3, 4, 5] },
      minimumJobValuePaise: { type: Number, default: 50000 }, // ₹500
      maximumDailyJobs: { type: Number, default: 5 },
      emergencyAvailable: { type: Boolean, default: false },
      autoAcceptJobs: { type: Boolean, default: false },
      preferredCategories: { type: [String], default: [] },
      targetHourlyRatePaise: { type: Number, default: 100000 }, // ₹1000/hr
    },

    totalEarnedPaise: { type: Number, default: 0, min: 0 },
    pendingPayoutPaise: { type: Number, default: 0, min: 0 },
  },
  schemaOptions
);

// ── Indexes ───────────────────────────────────────────────────────────────────
ProfessionalSchema.index({ userId: 1 }, { unique: true });
ProfessionalSchema.index({ verificationStatus: 1 });
ProfessionalSchema.index({ isAvailable: 1, isOnline: 1 });
ProfessionalSchema.index({ currentLocation: "2dsphere" });
ProfessionalSchema.index({ verificationStatus: 1, isAvailable: 1, averageRating: -1 });

// ── Model ─────────────────────────────────────────────────────────────────────
export const Professional =
  models.Professional ?? model<IProfessional>("Professional", ProfessionalSchema);
export default Professional;
