import type { Metadata, Viewport } from "next";
import "./globals.css";

// ── Metadata ───────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://forgelocal.volcanic.world"
  ),
  title: {
    default: "ForgeLocal — AI-Powered Local Services",
    template: "%s | ForgeLocal",
  },
  description:
    "ForgeLocal by Volcanic.World. Show the problem. Let AI understand it. Get a transparent scope and price. Get matched with the right professional. Verify the work. Release payment with confidence.",
  keywords: [
    "local services",
    "home repair",
    "plumbing",
    "AI diagnostics",
    "service marketplace",
    "ForgeLocal",
    "Volcanic World",
  ],
  authors: [{ name: "Volcanic.World", url: "https://volcanic.world" }],
  creator: "Volcanic.World",
  publisher: "Volcanic.World",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://forgelocal.volcanic.world",
    siteName: "ForgeLocal",
    title: "ForgeLocal — AI-Powered Local Services",
    description:
      "AI-native local services marketplace. Diagnose, match, verify, and settle — all in one platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ForgeLocal — AI-Powered Local Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ForgeLocal — AI-Powered Local Services",
    description:
      "AI-native local services marketplace by Volcanic.World",
    creator: "@volcanicworld",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#FFFFFF",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// ── Root Layout ────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
