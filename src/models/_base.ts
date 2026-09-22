/**
 * ForgeLocal — Shared Mongoose Types & Base Schema Utilities
 */

import { Schema, type Types } from "mongoose";

// ── Re-export for convenience ─────────────────────────────────────────────────
export type ObjectId = Types.ObjectId;

// ── Timestamp fields added by Mongoose ───────────────────────────────────────
export interface TimestampFields {
  createdAt: Date;
  updatedAt: Date;
}

// ── Common status enums ───────────────────────────────────────────────────────
export const ADDRESS_SCHEMA = {
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  country: { type: String, trim: true, default: "IN" },
  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: undefined,
    },
  },
};

// ── Money schema (amounts in smallest currency unit — paise for INR) ─────────
export const MONEY_SCHEMA = {
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: "INR", uppercase: true, trim: true },
};

// ── Base audit fields ─────────────────────────────────────────────────────────
export const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      ret["id"] = ret["_id"];
      delete ret["_id"];
      delete ret["__v"];
      return ret;
    },
  },
} as const;
