/**
 * ForgeLocal — Change Order Model
 *
 * When unexpected work is discovered during job execution, professionals
 * submit a change order with evidence. Customer must approve before
 * scope/price increases.
 *
 * Design: No material scope increase is silently charged to the customer.
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { schemaOptions } from "./_base";

export type ChangeOrderStatus =
  | "submitted"
  | "customer_notified"
  | "approved"
  | "declined"
  | "expired";

export interface IChangeOrder extends Document {
  jobId: mongoose.Types.ObjectId;
  scopeOfWorkId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;

  // What changed
  title: string;
  reason: string;
  discoveryDescription: string;

  // Evidence supporting the change
  evidenceIds: mongoose.Types.ObjectId[];

  // Updated scope
  additionalWorkDescription: string;
  additionalPartsPaise: number;
  additionalLaborPaise: number;
  additionalTotalPaise: number;

  // New total
  originalTotalPaise: number;
  newTotalPaise: number;
  customerMaxAuthorizationPaise: number;

  // Status
  status: ChangeOrderStatus;
  submittedAt: Date;
  expiresAt: Date;           // Customer has limited time to respond
  customerRespondedAt?: Date;
  customerDeclineReason?: string;

  // New SOW (created upon approval)
  revisedSowId?: mongoose.Types.ObjectId;

  // AI re-analysis
  aiReanalysisSessionId?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const ChangeOrderSchema = new Schema<IChangeOrder>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    scopeOfWorkId: { type: Schema.Types.ObjectId, ref: "ScopeOfWork", required: true },
    professionalId: { type: Schema.Types.ObjectId, ref: "Professional", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true, trim: true, maxlength: 300 },
    reason: { type: String, required: true, maxlength: 2000 },
    discoveryDescription: { type: String, required: true, maxlength: 5000 },

    evidenceIds: [{ type: Schema.Types.ObjectId, ref: "JobEvidence" }],

    additionalWorkDescription: { type: String, required: true, maxlength: 3000 },
    additionalPartsPaise: { type: Number, default: 0, min: 0 },
    additionalLaborPaise: { type: Number, default: 0, min: 0 },
    additionalTotalPaise: { type: Number, required: true, min: 0 },

    originalTotalPaise: { type: Number, required: true, min: 0 },
    newTotalPaise: { type: Number, required: true, min: 0 },
    customerMaxAuthorizationPaise: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["submitted", "customer_notified", "approved", "declined", "expired"],
      default: "submitted",
    },
    submittedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    customerRespondedAt: Date,
    customerDeclineReason: { type: String, maxlength: 2000 },

    revisedSowId: { type: Schema.Types.ObjectId, ref: "ScopeOfWork" },
    aiReanalysisSessionId: { type: Schema.Types.ObjectId, ref: "DiagnosticSession" },
  },
  schemaOptions
);

ChangeOrderSchema.index({ jobId: 1, status: 1 });
ChangeOrderSchema.index({ expiresAt: 1, status: 1 });

export const ChangeOrder: mongoose.Model<IChangeOrder> =
  (models.ChangeOrder as mongoose.Model<IChangeOrder>) ??
  model<IChangeOrder>("ChangeOrder", ChangeOrderSchema);
export default ChangeOrder;

