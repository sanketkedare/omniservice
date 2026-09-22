/**
 * ForgeLocal — Inventory Item Model
 *
 * Vehicle inventory for professionals. Tracks parts and tools
 * carried in the vehicle. Used by SmartRoute for inventory-aware matching.
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { schemaOptions } from "./_base";

export interface IInventoryItem extends Document {
  professionalId: mongoose.Types.ObjectId;
  vehicleId?: mongoose.Types.ObjectId;
  name: string;
  sku?: string;
  barcode?: string;
  category: string; // e.g., "plumbing", "electrical", "hardware"
  description?: string;
  quantity: number;
  unitPricePaise: number;
  reorderThreshold: number;
  imageUrl?: string;
  isActive: boolean;
  lastVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    professionalId: {
      type: Schema.Types.ObjectId,
      ref: "Professional",
      required: true,
      index: true,
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "ProfessionalVehicle",
    },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    sku: { type: String, trim: true },
    barcode: { type: String, trim: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, maxlength: 1000 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    unitPricePaise: { type: Number, required: true, min: 0 },
    reorderThreshold: { type: Number, default: 2, min: 0 },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
    lastVerifiedAt: { type: Date },
  },
  schemaOptions
);

InventoryItemSchema.index({ professionalId: 1, isActive: 1 });
InventoryItemSchema.index({ professionalId: 1, category: 1 });
InventoryItemSchema.index({ barcode: 1 }, { sparse: true });

export const InventoryItem =
  models.InventoryItem ??
  model<IInventoryItem>("InventoryItem", InventoryItemSchema);
export default InventoryItem;
