/**
 * ForgeLocal — Professional Skill Model
 * Maps professionals to service categories with skill-level metadata.
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { schemaOptions } from "./_base";

export type SkillLevel = "beginner" | "intermediate" | "expert" | "master";

export interface IProfessionalSkill extends Document {
  professionalId: mongoose.Types.ObjectId;
  serviceCategoryId: mongoose.Types.ObjectId;
  skillLevel: SkillLevel;
  yearsOfExperience: number;
  certifications: string[];
  isVerified: boolean;
  verifiedAt?: Date;
  completedJobsInCategory: number;
  averageRatingInCategory: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProfessionalSkillSchema = new Schema<IProfessionalSkill>(
  {
    professionalId: {
      type: Schema.Types.ObjectId,
      ref: "Professional",
      required: true,
      index: true,
    },
    serviceCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
    },
    skillLevel: {
      type: String,
      enum: ["beginner", "intermediate", "expert", "master"],
      default: "intermediate",
    },
    yearsOfExperience: { type: Number, default: 0, min: 0, max: 60 },
    certifications: { type: [String], default: [] },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    completedJobsInCategory: { type: Number, default: 0, min: 0 },
    averageRatingInCategory: { type: Number, default: 0, min: 0, max: 5 },
  },
  schemaOptions
);

ProfessionalSkillSchema.index(
  { professionalId: 1, serviceCategoryId: 1 },
  { unique: true }
);
ProfessionalSkillSchema.index({ serviceCategoryId: 1, isVerified: 1 });

export const ProfessionalSkill =
  models.ProfessionalSkill ??
  model<IProfessionalSkill>("ProfessionalSkill", ProfessionalSkillSchema);
export default ProfessionalSkill;
