/**
 * ForgeLocal — Structured Logger
 *
 * Thin wrapper around Pino for structured, production-grade logging.
 * In browser environments (client components), this falls back to console.
 */

import pino from "pino";
import { env } from "@/config/env";

const isServer = typeof window === "undefined";

// ── Server Logger (Pino) ───────────────────────────────────────────────────────
const serverLogger = isServer
  ? pino({
      level: env.LOG_LEVEL,
      formatters: {
        level: (label: string) => ({ level: label }),
      },
      timestamp: pino.stdTimeFunctions.isoTime,
      base: {
        app: "omniservice",
        env: env.NODE_ENV,
      },
    })
  : null;

// ── Client-side Shim ──────────────────────────────────────────────────────────
type LogContext = Record<string, unknown>;
type LogFn = (contextOrMsg: LogContext | string, msg?: string) => void;

interface Logger {
  fatal: LogFn;
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  trace: LogFn;
  child: (bindings: LogContext) => Logger;
}

function createClientLogger(): Logger {
  const log =
    (level: string) =>
    (contextOrMsg: LogContext | string, msg?: string) => {
      if (process.env.NODE_ENV === "development") {
        const message =
          typeof contextOrMsg === "string" ? contextOrMsg : msg ?? "";
        const context =
          typeof contextOrMsg === "object" ? contextOrMsg : undefined;
        // eslint-disable-next-line no-console
        console[level === "error" || level === "fatal" ? "error" : level === "warn" ? "warn" : "log"](
          `[${level.toUpperCase()}] ${message}`,
          context ?? ""
        );
      }
    };

  return {
    fatal: log("fatal"),
    error: log("error"),
    warn: log("warn"),
    info: log("info"),
    debug: log("debug"),
    trace: log("trace"),
    child: () => createClientLogger(),
  };
}

// ── Export ─────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logger: any = serverLogger ?? createClientLogger();

export default logger;
