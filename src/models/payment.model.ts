/**
 * ForgeLocal — Payment, Escrow Transaction & Payout Models
 *
 * Payment: Customer payment record (authorization + capture).
 * EscrowTransaction: Append-only audit log of all escrow state transitions.
 * Payout: Professional payout record.
 *
 * Design principle: All financial state transitions must be auditable.
 * EscrowTransaction records are NEVER mutated — only appended.
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { MONEY_SCHEMA, schemaOptions } from "./_base";

// ── Payment ───────────────────────────────────────────────────────────────────
export type PaymentStatus =
  | "pending"
  | "authorized"
  | "captured"
  | "in_escrow"
  | "released"
  | "refunded"
  | "partially_refunded"
  | "failed"
  | "disputed"
  | "cancelled";

export type PaymentProvider = "razorpay" | "stripe" | "mock";

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  jobId?: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;

  provider: PaymentProvider;
  providerPaymentId?: string;  // External payment gateway ID
  providerOrderId?: string;

  // Amounts (all in paise)
  authorizedAmountPaise: number;
  capturedAmountPaise?: number;
  releasedAmountPaise?: number;
  refundedAmountPaise?: number;
  platformFeePaise?: number;
  professionalPayoutPaise?: number;

  currency: string;
  status: PaymentStatus;

  authorizedAt?: Date;
  capturedAt?: Date;
  releasedAt?: Date;
  refundedAt?: Date;
  failedAt?: Date;

  failureReason?: string;
  idempotencyKey: string;

  metadata?: Record<string, string>;

  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    professionalId: { type: Schema.Types.ObjectId, ref: "Professional", required: true },

    provider: {
      type: String,
      enum: ["razorpay", "stripe", "mock"],
      required: true,
    },
    providerPaymentId: { type: String, sparse: true },
    providerOrderId: { type: String, sparse: true },

    authorizedAmountPaise: { type: Number, required: true, min: 0 },
    capturedAmountPaise: { type: Number, min: 0 },
    releasedAmountPaise: { type: Number, min: 0 },
    refundedAmountPaise: { type: Number, min: 0 },
    platformFeePaise: { type: Number, min: 0 },
    professionalPayoutPaise: { type: Number, min: 0 },

    currency: { type: String, default: "INR", uppercase: true },
    status: {
      type: String,
      enum: ["pending", "authorized", "captured", "in_escrow", "released",
        "refunded", "partially_refunded", "failed", "disputed", "cancelled"],
      default: "pending",
      index: true,
    },

    authorizedAt: Date,
    capturedAt: Date,
    releasedAt: Date,
    refundedAt: Date,
    failedAt: Date,
    failureReason: { type: String, maxlength: 1000 },

    idempotencyKey: { type: String, required: true, unique: true },
    metadata: { type: Schema.Types.Mixed },
  },
  schemaOptions
);

PaymentSchema.index({ providerPaymentId: 1 }, { sparse: true });
PaymentSchema.index({ idempotencyKey: 1 }, { unique: true });

// ── EscrowTransaction ─────────────────────────────────────────────────────────
// Append-only audit log. DO NOT UPDATE existing records.
export type EscrowEvent =
  | "authorized"
  | "held"
  | "released_to_professional"
  | "refunded_to_customer"
  | "partially_released"
  | "disputed"
  | "dispute_resolved"
  | "fee_deducted";

export interface IEscrowTransaction extends Document {
  paymentId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  event: EscrowEvent;
  amountPaise: number;
  balancePaise: number;
  description: string;
  performedBy: "system" | "customer" | "professional" | "admin";
  performedById?: mongoose.Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const EscrowTransactionSchema = new Schema<IEscrowTransaction>(
  {
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    event: {
      type: String,
      enum: ["authorized", "held", "released_to_professional", "refunded_to_customer",
        "partially_released", "disputed", "dispute_resolved", "fee_deducted"],
      required: true,
    },
    amountPaise: { type: Number, required: true },
    balancePaise: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, maxlength: 1000 },
    performedBy: {
      type: String,
      enum: ["system", "customer", "professional", "admin"],
      required: true,
    },
    performedById: { type: Schema.Types.ObjectId, ref: "User" },
    metadata: { type: Schema.Types.Mixed },
  },
  { ...schemaOptions, timestamps: { createdAt: true, updatedAt: false } }
);

// Append-only: disable updates
EscrowTransactionSchema.pre("findOneAndUpdate", function () {
  throw new Error("EscrowTransaction records are immutable. Create a new record instead.");
});
EscrowTransactionSchema.pre("updateOne", function () {
  throw new Error("EscrowTransaction records are immutable. Create a new record instead.");
});

// ── Payout ────────────────────────────────────────────────────────────────────
export type PayoutStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "on_hold";

export interface IPayout extends Document {
  professionalId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  paymentId: mongoose.Types.ObjectId;

  provider: PaymentProvider;
  providerPayoutId?: string;

  amountPaise: number;
  currency: string;
  status: PayoutStatus;

  scheduledAt: Date;
  processedAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  isInstantPayout: boolean;
  instantPayoutFeePaise?: number;

  createdAt: Date;
  updatedAt: Date;
}

const PayoutSchema = new Schema<IPayout>(
  {
    professionalId: { type: Schema.Types.ObjectId, ref: "Professional", required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true },

    provider: { type: String, enum: ["razorpay", "stripe", "mock"], required: true },
    providerPayoutId: { type: String, sparse: true },

    amountPaise: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR", uppercase: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "on_hold"],
      default: "pending",
    },

    scheduledAt: { type: Date, required: true },
    processedAt: Date,
    failedAt: Date,
    failureReason: { type: String, maxlength: 1000 },
    isInstantPayout: { type: Boolean, default: false },
    instantPayoutFeePaise: { type: Number, min: 0 },
  },
  schemaOptions
);

PayoutSchema.index({ professionalId: 1, status: 1 });
PayoutSchema.index({ scheduledAt: 1, status: 1 });

// ── Models ────────────────────────────────────────────────────────────────────
export const Payment = models.Payment ?? model<IPayment>("Payment", PaymentSchema);
export const EscrowTransaction =
  models.EscrowTransaction ??
  model<IEscrowTransaction>("EscrowTransaction", EscrowTransactionSchema);
export const Payout = models.Payout ?? model<IPayout>("Payout", PayoutSchema);
export default { Payment, EscrowTransaction, Payout };
