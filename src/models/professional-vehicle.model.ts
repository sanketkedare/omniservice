/**
 * ForgeLocal — Professional Vehicle Model
 * Represents the professional's vehicle used for job execution.
 * Linked to inventory management for SmartRoute matching.
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { schemaOptions } from "./_base";

export interface IProfessionalVehicle extends Document {
  professionalId: mongoose.Types.ObjectId;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  color?: string;
  vehicleType: "motorcycle" | "car" | "van" | "truck" | "bicycle" | "other";
  maxCargoCapacityKg?: number;
  isActive: boolean;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProfessionalVehicleSchema = new Schema<IProfessionalVehicle>(
  {
    professionalId: {
      type: Schema.Types.ObjectId,
      ref: "Professional",
      required: true,
      index: true,
    },
    make: { type: String, required: true, trim: true, maxlength: 100 },
    model: { type: String, required: true, trim: true, maxlength: 100 },
    year: { type: Number, required: true, min: 1970, max: new Date().getFullYear() + 2 },
    licensePlate: { type: String, trim: true, uppercase: true },
    color: { type: String, trim: true },
    vehicleType: {
      type: String,
      enum: ["motorcycle", "car", "van", "truck", "bicycle", "other"],
      default: "car",
    },
    maxCargoCapacityKg: { type: Number, min: 0 },
    isActive: { type: Boolean, default: true },
    isPrimary: { type: Boolean, default: false },
  },
  schemaOptions
);

ProfessionalVehicleSchema.index({ professionalId: 1, isPrimary: 1 });

export const ProfessionalVehicle =
  models.ProfessionalVehicle ??
  model<IProfessionalVehicle>("ProfessionalVehicle", ProfessionalVehicleSchema);
export default ProfessionalVehicle;
