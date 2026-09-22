import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Image Optimization ──────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.filebase.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.filebase.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // ── Security Headers ────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=self, microphone=self, geolocation=self",
          },
        ],
      },
    ];
  },

  // ── Performance ─────────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // ── Logging ─────────────────────────────────────────────────────────────────
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
};

export default nextConfig;
