/**
 * ForgeLocal — User Model
 *
 * Unified user model supporting Customer, Professional, and Admin roles.
 * Role-specific data is stored in separate collections (Professional, etc.)
 * and referenced from here.
 */

import mongoose, { Schema, Document, model, models } from "mongoose";
import { ADDRESS_SCHEMA, schemaOptions } from "./_base";

// ── Types ─────────────────────────────────────────────────────────────────────
export type UserRole = "customer" | "professional" | "admin";
export type UserStatus = "active" | "suspended" | "pending_verification" | "deactivated";

export interface IUser extends Document {
  // Identity
  name: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;

  // Role & Status
  role: UserRole;
  status: UserStatus;

  // Authentication & Security
  passwordHash?: string | null;
  passwordSalt?: string | null;
  authProvider: "credentials" | "google";
  googleId?: string | null;
  emailVerified: Date | null;
  phoneVerified: boolean;

  // Real-time Geolocation
  coordinates?: {
    lat: number;
    lng: number;
  };

  // Address
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  // Preferences
  preferredLanguage: string;
  notificationPreferences: {
    push: boolean;
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };

  // Metadata
  lastActiveAt: Date | null;
  referralCode: string | null;
  referredBy: mongoose.Types.ObjectId | null;

  // Timestamps (added by Mongoose)
  createdAt: Date;
  updatedAt: Date;
}

// ── Schema ────────────────────────────────────────────────────────────────────
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-()]{7,20}$/, "Invalid phone number format"],
    },
    avatarUrl: { type: String, default: null },

    role: {
      type: String,
      enum: ["customer", "professional", "admin"],
      required: true,
      default: "customer",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending_verification", "deactivated"],
      required: true,
      default: "active",
    },

    passwordHash: { type: String, select: false, default: null },
    passwordSalt: { type: String, select: false, default: null },
    authProvider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    googleId: { type: String, default: null },

    emailVerified: { type: Date, default: null },
    phoneVerified: { type: Boolean, default: false },

    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },

    address: ADDRESS_SCHEMA,

    preferredLanguage: { type: String, default: "en", maxlength: 10 },
    notificationPreferences: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
    },

    lastActiveAt: { type: Date, default: null },
    referralCode: { type: String, uppercase: true },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  schemaOptions
);

// ── Indexes ───────────────────────────────────────────────────────────────────
UserSchema.index({ email: 1 }, { sparse: true, unique: true });
UserSchema.index({ phone: 1 }, { sparse: true, unique: true });
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ referralCode: 1 }, { sparse: true, unique: true });

// ── Model ─────────────────────────────────────────────────────────────────────
export const User: mongoose.Model<IUser> =
  (models.User as mongoose.Model<IUser>) ?? model<IUser>("User", UserSchema);
export default User;
