import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        minHeight: "100dvh",
        background: "#fafafa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "5rem",
          fontWeight: 800,
          color: "#e5e5e5",
          letterSpacing: "-0.05em",
          lineHeight: 1,
          marginBottom: "1rem",
        }}
      >
        404
      </div>
      <div
        style={{
          width: "2.5rem",
          height: "2.5rem",
          background: "#f05a28",
          borderRadius: "0.625rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
        }}
      >
        <span style={{ color: "white", fontWeight: 800, fontSize: "0.875rem" }}>F</span>
      </div>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#0d0d0d",
          marginBottom: "0.5rem",
          letterSpacing: "-0.03em",
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontSize: "0.9375rem",
          color: "#737373",
          marginBottom: "2rem",
          maxWidth: "360px",
          lineHeight: 1.6,
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          background: "#f05a28",
          color: "white",
          textDecoration: "none",
          borderRadius: "0.75rem",
          padding: "0.75rem 1.5rem",
          fontSize: "0.9375rem",
          fontWeight: 600,
          display: "inline-block",
          transition: "background 150ms",
        }}
      >
        Go home
      </Link>
    </div>
  );
}
