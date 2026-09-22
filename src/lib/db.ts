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

// Direct known cluster nodes for volcanic-1.soentmg.mongodb.net
const KNOWN_DIRECT_FALLBACK_HOSTS =
  "ac-bttrdcu-shard-00-00.soentmg.mongodb.net:27017,ac-bttrdcu-shard-00-01.soentmg.mongodb.net:27017,ac-bttrdcu-shard-00-02.soentmg.mongodb.net:27017";

/**
 * Resolves or converts a mongodb+srv:// URI into a direct replica set connection URI.
 * This permanently resolves Windows/ISP DNS SRV (querySrv ECONNREFUSED) failures.
 */
async function resolveMongoUri(uri: string): Promise<string> {
  if (!uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]*)(?:\?(.*))?/);
  if (!match) {
    return uri;
  }

  const [, user, pass, host, db, query] = match;
  if (!host) {
    return uri;
  }

  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
    const srvRecords = await dns.promises.resolveSrv(`_mongodb._tcp.${host}`);
    if (srvRecords && srvRecords.length > 0) {
      const hostList = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");
      let txtParams = "";
      try {
        const txtRecords = await dns.promises.resolveTxt(host);
        txtParams = txtRecords.flat().join("&");
      } catch {}

      const params = [query, txtParams, "ssl=true"].filter(Boolean).join("&");
      return `mongodb://${user}:${pass}@${hostList}/${db}?${params}`;
    }
  } catch (srvErr) {
    logger.warn({ host, err: (srvErr as Error).message }, "SRV resolution failed, falling back to direct replica set hosts");
  }

  // Guaranteed fallback for volcanic-1 cluster
  if (host.includes("volcanic-1.soentmg.mongodb.net")) {
    const params = [query, "authSource=admin", "replicaSet=atlas-byxx7s-shard-0", "ssl=true"].filter(Boolean).join("&");
    return `mongodb://${user}:${pass}@${KNOWN_DIRECT_FALLBACK_HOSTS}/${db}?${params}`;
  }

  return uri;
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
  serverSelectionTimeoutMS: process.env.NODE_ENV === "test" ? 500 : 8_000,
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
    try {
      dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
    } catch {}

    const resolvedUri = await resolveMongoUri(env.MONGODB_URI);

    logger.info({ uri: resolvedUri.replace(/:\/\/[^@]+@/, "://<credentials>@") }, "Connecting to MongoDB");
    
    await mongoose.connect(resolvedUri, MONGOOSE_OPTIONS);

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
