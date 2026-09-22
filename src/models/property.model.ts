/**
 * ForgeLocal — Property Model
 *
 * Represents a customer's property (home, office, etc.).
 * Each customer can have multiple properties.
 * Properties accumulate service history and form the basis of HomePass.
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { ADDRESS_SCHEMA, schemaOptions } from "./_base";

// ── Types ─────────────────────────────────────────────────────────────────────
export type PropertyType =
  | "apartment"
  | "house"
  | "villa"
  | "office"
  | "shop"
  | "other";

export interface IProperty extends Document {
  customerId: mongoose.Types.ObjectId;
  name: string; // e.g. "Home", "Office", "Mom's Place"
  type: PropertyType;

  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    coordinates?: {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
    };
  };

  // Property Details
  yearBuilt?: number;
  squareFootage?: number;
  floors?: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;

  // Media
  coverImageUrl?: string;
  imageUrls: string[];

  // HomePass
  healthScore?: number; // 0-100, calculated from service history
  lastInspectionDate?: Date;

  // Status
  isDefault: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// ── Schema ────────────────────────────────────────────────────────────────────
const PropertySchema = new Schema<IProperty>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      default: "Home",
    },
    type: {
      type: String,
      enum: ["apartment", "house", "villa", "office", "shop", "other"],
      required: true,
      default: "house",
    },

    address: {
      ...ADDRESS_SCHEMA,
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
        },
        coordinates: [Number],
      },
    },

    yearBuilt: { type: Number, min: 1800, max: new Date().getFullYear() + 1 },
    squareFootage: { type: Number, min: 0 },
    floors: { type: Number, min: 1, max: 100 },
    bedrooms: { type: Number, min: 0, max: 50 },
    bathrooms: { type: Number, min: 0, max: 50 },
    description: { type: String, maxlength: 1000 },

    coverImageUrl: { type: String },
    imageUrls: { type: [String], default: [] },

    healthScore: { type: Number, min: 0, max: 100 },
    lastInspectionDate: { type: Date },

    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  schemaOptions
);

// ── Indexes ───────────────────────────────────────────────────────────────────
PropertySchema.index({ customerId: 1, isActive: 1 });
PropertySchema.index({ "address.coordinates": "2dsphere" });
PropertySchema.index({ customerId: 1, isDefault: 1 });

// ── Model ─────────────────────────────────────────────────────────────────────
export const Property: mongoose.Model<IProperty> =
  (models.Property as mongoose.Model<IProperty>) ?? model<IProperty>("Property", PropertySchema);
export default Property;
