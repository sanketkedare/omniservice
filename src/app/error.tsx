"use client";

import React from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        fontFamily: "'Times New Roman', Times, 'Liberation Serif', serif",
        minHeight: "80dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        background: "#fafafa",
      }}
    >
      <div
        style={{
          width: "3.5rem",
          height: "3.5rem",
          background: "#fee2e2",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0d0d0d", marginBottom: "0.5rem", letterSpacing: "-0.03em" }}>
        Something went wrong
      </h1>
      <p style={{ fontSize: "0.9375rem", color: "#737373", marginBottom: "2rem", maxWidth: "400px", lineHeight: 1.6 }}>
        An unexpected error occurred. Our team has been notified.
        {error?.digest && (
          <span style={{ display: "block", fontSize: "0.75rem", marginTop: "0.5rem", color: "#a3a3a3" }}>
            Error ID: {error.digest}
          </span>
        )}
      </p>
      <button
        onClick={reset}
        style={{
          background: "#f05a28",
          color: "white",
          border: "none",
          borderRadius: "0.75rem",
          padding: "0.75rem 1.5rem",
          fontSize: "0.9375rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
