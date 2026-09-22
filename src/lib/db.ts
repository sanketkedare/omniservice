/**
 * ForgeLocal — MongoDB Connection Singleton
 *
 * Implements a connection singleton pattern for Next.js that properly
 * handles connection pooling across hot reloads in development and
 * across serverless function invocations in production.
 */

import mongoose from "mongoose";
import dns from "dns";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

// Set reliable public DNS servers for MongoDB Atlas SRV (_mongodb._tcp) resolution
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch {
  // Ignore in environments where setServers is restricted
}

// ── Connection Cache ───────────────────────────────────────────────────────────
// In development, store the promise on the global object to survive HMR.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnectionPromise: Promise<typeof mongoose> | undefined;
}

let connectionPromise: Promise<typeof mongoose> | undefined;

// ── Connection Options ─────────────────────────────────────────────────────────
const MONGOOSE_OPTIONS: mongoose.ConnectOptions = {
  // Connection pool
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30_000,

  // Timeouts (fail fast in test mode when no local Mongo instance is running)
  serverSelectionTimeoutMS: process.env.NODE_ENV === "test" ? 500 : 5_000,
  socketTimeoutMS: process.env.NODE_ENV === "test" ? 2_000 : 45_000,
  connectTimeoutMS: process.env.NODE_ENV === "test" ? 1_000 : 10_000,

  // Reliability
  retryWrites: true,
  retryReads: true,
};

// ── Connect ────────────────────────────────────────────────────────────────────
export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return existing connection if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Use cached promise in development (survives HMR)
  if (process.env.NODE_ENV === "development") {
    if (!global._mongooseConnectionPromise) {
      global._mongooseConnectionPromise = createConnection();
    }
    return global._mongooseConnectionPromise;
  }

  // Production: use module-level cache
  if (!connectionPromise) {
    connectionPromise = createConnection();
  }
  return connectionPromise;
}

async function createConnection(): Promise<typeof mongoose> {
  try {
    logger.info({ uri: env.MONGODB_URI.replace(/:\/\/[^@]+@/, "://<credentials>@") }, "Connecting to MongoDB");
    
    await mongoose.connect(env.MONGODB_URI, MONGOOSE_OPTIONS);

    mongoose.connection.on("connected", () => {
      logger.info("MongoDB connection established");
    });

    mongoose.connection.on("error", (err) => {
      logger.error({ err }, "MongoDB connection error");
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    logger.info("MongoDB connected successfully");
    return mongoose;
  } catch (error) {
    logger.error({ error }, "Failed to connect to MongoDB");
    connectionPromise = undefined;
    global._mongooseConnectionPromise = undefined;
    throw error;
  }
}

// ── Disconnect (for testing) ───────────────────────────────────────────────────
export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    connectionPromise = undefined;
    global._mongooseConnectionPromise = undefined;
    logger.info("MongoDB disconnected");
  }
}

// ── Health Check ───────────────────────────────────────────────────────────────
export function getDatabaseStatus(): {
  state: string;
  readyState: number;
} {
  const states: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return {
    state: states[mongoose.connection.readyState] ?? "unknown",
    readyState: mongoose.connection.readyState,
  };
}

export const connectDB = connectToDatabase;
