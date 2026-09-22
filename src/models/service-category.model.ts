/**
 * ForgeLocal — Service Category Model
 *
 * Defines the taxonomy of services available on the platform.
 * Categories are the foundation for InspectAI prompt selection,
 * professional matching, and SOW generation.
 */

import { Schema, Document, model, models } from "mongoose";
import { schemaOptions } from "./_base";

export type CategoryStatus = "active" | "inactive" | "coming_soon";

export interface IServiceCategory extends Document {
  name: string;
  slug: string;
  description: string;
  iconName: string; // Lucide icon name
  coverImageUrl?: string;
  color: string; // Brand-consistent hex color for this category
  parentCategoryId?: Schema.Types.ObjectId;

  // AI Configuration
  inspectAiPromptTemplate?: string;
  minimumConfidenceThreshold: number;
  requiresOnSiteConfirmation: boolean;

  // Availability
  status: CategoryStatus;
  availableRegions: string[]; // ["all"] or specific region codes
  phase: number; // 1, 2, 3 — matches PRD Appendix A

  // Sorting
  displayOrder: number;

  // Metadata
  estimatedDurationMinutes: { min: number; max: number };
  typicalPriceRangePaise: { min: number; max: number };

  createdAt: Date;
  updatedAt: Date;
}

const ServiceCategorySchema = new Schema<IServiceCategory>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, required: true, maxlength: 1000 },
    iconName: { type: String, required: true },
    coverImageUrl: { type: String },
    color: { type: String, required: true, default: "#F05A28" },
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceCategory",
    },

    inspectAiPromptTemplate: { type: String },
    minimumConfidenceThreshold: { type: Number, default: 0.65, min: 0, max: 1 },
    requiresOnSiteConfirmation: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["active", "inactive", "coming_soon"],
      default: "active",
    },
    availableRegions: { type: [String], default: ["all"] },
    phase: { type: Number, default: 1, min: 1 },

    displayOrder: { type: Number, default: 0 },

    estimatedDurationMinutes: {
      min: { type: Number, default: 30 },
      max: { type: Number, default: 120 },
    },
    typicalPriceRangePaise: {
      min: { type: Number, default: 50000 },  // ₹500
      max: { type: Number, default: 500000 }, // ₹5000
    },
  },
  schemaOptions
);

ServiceCategorySchema.index({ slug: 1 }, { unique: true });
ServiceCategorySchema.index({ status: 1, displayOrder: 1 });
ServiceCategorySchema.index({ phase: 1, status: 1 });

export const ServiceCategory =
  models.ServiceCategory ??
  model<IServiceCategory>("ServiceCategory", ServiceCategorySchema);
export default ServiceCategory;
