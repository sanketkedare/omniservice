import type { Metadata, Viewport } from "next";
import { FirebaseAnalytics } from "@/components/shared";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

// ── Metadata ───────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://omniservice.volcanic.world"
  ),
  title: {
    default: "OmniService AI — Local Solutions. Higher Standards.",
    template: "%s | OmniService AI",
  },
  description:
    "OmniService AI by Volcanic.World. Local Solutions. Higher Standards. Show the problem. Let AI understand it. Get a transparent scope and price. Get matched with the right professional. Verify the work. Release payment with confidence.",
  keywords: [
    "local services",
    "home repair",
    "plumbing",
    "AI diagnostics",
    "service marketplace",
    "OmniService",
    "OmniService AI",
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
    url: "https://omniservice.volcanic.world",
    siteName: "OmniService AI",
    title: "OmniService AI — Local Solutions. Higher Standards.",
    description:
      "AI-native local services marketplace by Volcanic.World. Local solutions with higher standards: diagnose, match, verify, and settle.",
    images: [
      {
        url: "/images/OmniService_Logo.png",
        width: 1200,
        height: 630,
        alt: "OmniService AI — Local Solutions. Higher Standards. by Volcanic.World",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniService AI — Local Solutions. Higher Standards.",
    description:
      "AI-native local services marketplace by Volcanic.World",
    creator: "@volcanicworld",
    images: ["/images/OmniService_Logo.png"],
  },
  icons: {
    icon: [
      { url: "/images/OmniService_Icon.png", sizes: "any", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/images/OmniService_Icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/images/OmniService_Icon.png"],
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
    <html lang="en" className="light" style={{ colorScheme: "light" }} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased bg-[#fafafa] text-neutral-900 min-h-screen font-sans selection:bg-[#f05a28]/15 selection:text-[#9a2c06]">
        <FirebaseAnalytics />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
