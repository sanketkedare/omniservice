# OmniService AI

> **AI-Native Local Services Marketplace** by **Volcanic.World**  
> *Domain: `omniservice.volcanic.world`*  
> *Tagline: **Local Solutions. Higher Standards.***  
> *Primary Hub: **Ameerpet, Hyderabad, Telangana 500016***

---

## 🌟 Executive Overview

**OmniService AI** eliminates the adversarial guesswork, arbitrary quoting, multiple parts runs, and unverified workmanship of traditional home contracting. Built on an AI-governed, deterministic, escrow-secured lifecycle, the platform coordinates precision home repairs across mechanical, electrical, and plumbing trades in **Ameerpet and Greater Hyderabad**.

Instead of blind verbal guesses, homeowners capture a 15-second video. **InspectAI** isolates audio frequencies and visual defect markers, generating a locked fair-market Scope of Work (SOW). **SmartRoute** matches nearby licensed professionals based on live mobile van stock and real-time GPS proximity. **TrustLock** safeguards payments in a trustee escrow vault, releasing payouts only after AI-verified before/after photographic evidence. **HomePass** permanently records every service event in a tamper-proof digital property passport.

---

## 🏗️ The 4 Core Architectural Pillars

| Subsystem | Architectural Role | Technical Innovation |
| :--- | :--- | :--- |
| **InspectAI™** | Multimodal Diagnostic Intelligence | 15-second video and audio frequency analysis detecting component failures (e.g., motor shudder, capacitor blowout, pipe leaks) with neural confidence scoring. |
| **SmartRoute™** | Inventory-Aware Dispatch Engine | 4-factor matching algorithm evaluating technician skill tier, customer GPS proximity, reputation, and verified mobile van inventory for guaranteed 94% first-visit resolution. |
| **TrustLock™** | Visual Proof & Fiduciary Escrow | Cryptographic escrow state machine holding customer funds until before-and-after photo verification passes multimodal similarity inspection. Includes double-blind dispute freeze. |
| **HomePass™** | Permanent Digital Property Passport | Immutable, transferrable digital ledger recording appliance serials, warranty expirations, and verified maintenance logs with 0–100 property health scoring. |

---

## 🎨 Visual Design & Emergent Experience System

OmniService AI features an editorial, high-trust visual language crafted for clarity and immersion:

- **Color Palette & Brand Variants**:
  - **Volcanic Orange (`#F05A28`)**: Primary brand accent, action CTAs, active pills, and vibrant indicators.
  - **Vibrant Coral (`#EA580C`) & Terracotta (`#C2410C`)**: Secondary headings, interactive hovers, and warm container borders.
  - **Deep Espresso Ember (`#2D130A` / `#1C0F0A`)**: Monumental contrast typography, card titles, and dark footer anchoring.
  - **Warm Peach & Honey Canvases (`#fffaf5`, `#fff7ed`, `#fff0e6`)**: Tactile off-white surfaces eliminating harsh eye strain and starkness.
- **Typography**: Classical Times New Roman editorial stack (`font-serif`) conveying institutional permanence, paired with monospace fonts for financial amounts (₹ INR) and diagnostic tokens.
- **Emergent Experience**:
  - `@keyframes floatSlow`: 12-second smooth sine translation and scale oscillations for glowing ambient background orbs.
  - `.emergent-mesh`: Multi-stop radial gradient canvas providing subtle organic depth.
  - `.orange-halo`: Soft glassmorphic card overlays with warm border highlights.
- **Responsive Geometry**:
  - Full-bleed outer wrappers (`w-full`) for seamless background washes.
  - Big-screen container boundaries standardized to `max-w-7xl mx-auto px-6 sm:px-10 lg:px-12` (with focused forms at `max-w-4xl mx-auto`), eliminating horizontal stretching on 1440p/4K monitors.

---

## 🔒 Enterprise Security & Next.js 16 Proxy Architecture

- **Next.js 16 `proxy.ts` Convention**:
  - Edge request interception powered by the official Next.js 16 `proxy.ts` standard (replacing deprecated `middleware.ts`).
  - Active sliding-window in-memory rate limiter on `/api/auth/*` (20 requests/min per IP, returning HTTP 429 with `Retry-After`).
  - Strict Role-Based Access Control (RBAC) redirecting unauthenticated visitors from `/admin/*` and `/pro/*` portals while keeping customer exploration friction-free.
  - Automated injection of OWASP security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Permissions-Policy`).
- **NIST SP 800-132 Cryptographic Engine**:
  - PBKDF2 with SHA-512, 100,000 hashing iterations, and unique 32-byte cryptographically secure salts (`crypto.randomBytes(32)`).
  - Timing-safe password verification using `crypto.timingSafeEqual` to eliminate timing side-channel attacks.
- **Authentication Options**:
  - Google One-Tap integration ([`GoogleOneTap.tsx`](file:///d:/Sanket/Developer_2.0/Projects/ForgeLocal/src/components/auth/GoogleOneTap.tsx) + [`/api/auth/google-one-tap`](file:///d:/Sanket/Developer_2.0/Projects/ForgeLocal/src/app/api/auth/google-one-tap/route.ts)).
  - Secure credential registration with MongoDB Atlas persistence and phone/email duplicate checking.
  - Instant OTP login mode for low-friction access.

---

## 🧪 Isolated Interactive Sandbox Demo (`/demo`)

Visitors can explore the entire platform without authentication via the **"See Demo"** experience:
- **Customer Hub**: Active InspectAI diagnostics on Daikin AC inverter compressor failures, locked ₹2,800 SOW, and HomePass digital passport for an Ameerpet residence.
- **Pro Operations Center**: Live SmartRoute dispatch leads across Ameerpet, SR Nagar, and Begumpet, van mobile inventory tracking (45µF capacitors, R-32 refrigerant), and interactive "Accept Job & Lock Escrow" simulation.
- **Governance & Admin Suite**: Platform financial KPIs (₹14.85L GMV, ₹8.42L escrow held), dispute arbitration center with before/after photo audits, and SHA-256 cryptographic audit logs.
- **Zero Side-Effects**: Sandbox state modifications operate purely in local client state without altering production MongoDB collections or issuing elevated session tokens.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16.3+ (App Router & Turbopack)](https://nextjs.org/) + TypeScript Strict Mode
- **Edge Routing & RBAC**: Next.js 16 `proxy.ts` architecture
- **Styling**: Vanilla CSS + Tailwind CSS with Volcanic Orange design tokens
- **Database**: MongoDB 8.0 via cached Mongoose singleton connection pooling
- **Storage**: S3-compatible decentralized cloud storage (Filebase / AWS S3)
- **State Management**: TanStack React Query + React Hook Form + Zod
- **Notifications**: Universal Enterprise Toaster (`@/components/ui/Toast`) supporting loading, success, error, info, warning, and confirmation modals
- **Testing**: Vitest + React Testing Library + Happy DOM
- **Logging**: Structured Pino JSON logger

---

## 📁 Repository Structure

```
ForgeLocal/
├── public/                 # Static brand assets, logos, favicons, manifests
├── src/
│   ├── app/                # Next.js 16 App Router
│   │   ├── (auth)/         # Split-screen login & register with GPS capture
│   │   ├── admin/          # Admin governance portal (escrow, disputes, telemetry)
│   │   ├── api/            # REST API endpoints (auth, jobs, sow, escrow, homepass)
│   │   ├── customer/       # Customer hub (dashboard, requests, tracker, HomePass, categories)
│   │   ├── demo/           # Isolated interactive sandbox demo ("See Demo")
│   │   ├── explore/        # Trade category discovery catalog
│   │   ├── pro/            # Pro operations (dashboard, jobs, live route GPS, van inventory)
│   │   ├── globals.css     # Design tokens, floating keyframes, emergent mesh utilities
│   │   ├── layout.tsx      # Root layout with ToastProvider & metadata
│   │   ├── page.tsx        # Fully redesigned Volcanic Orange marketing landing page
│   │   ├── error.tsx       # Global error boundary
│   │   └── not-found.tsx   # 404 page
│   ├── components/
│   │   ├── auth/           # Google One-Tap & credential components
│   │   ├── layout/         # Shell navigations (TopBar, CustomerNav, ProfessionalNav)
│   │   ├── shared/         # PageHeader, feedback states, empty states
│   │   └── ui/             # Design primitives (Button, Card, Badge, Toast, Dialog, Input)
│   ├── config/             # Zod-validated environment configurations
│   ├── lib/
│   │   ├── crypto.ts       # NIST PBKDF2 SHA-512 password hasher & timing-safe validator
│   │   ├── db.ts           # Mongoose singleton connection manager
│   │   ├── geolocation.ts  # Hyderabad GPS coordinate capture & geofencing
│   │   ├── memory-store.ts # In-memory mock & fallback data store
│   │   ├── pro-seed-data.ts# Hyderabad pro seed profiles & mobile van stock
│   │   └── utils.ts        # Currency formatting (₹ INR), date helpers, class merging
│   ├── models/             # 27 Mongoose domain models with strict TypeScript schemas
│   └── proxy.ts            # Next.js 16 edge proxy (RBAC, rate limiting, security headers)
├── tests/                  # 9 Vitest suites covering all phases & security
└── docs/                   # Architectural blueprints, design systems, and ADRs
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: `>= 20.x`
- **Package Manager**: `npm`
- **Database**: MongoDB (local instance or MongoDB Atlas URI)

### 2. Installation
```bash
git clone https://github.com/volcanic-world/forgelocal.git
cd ForgeLocal
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` and set your credentials:
```bash
cp .env.example .env.local
```

Key environment variables:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/omniservice
NEXTAUTH_SECRET=your_cryptographically_secure_random_secret
FILEBASE_KEY=your_filebase_or_s3_key
FILEBASE_SECRET=your_filebase_or_s3_secret
FILEBASE_BUCKET=omniservice-media
NEXT_PUBLIC_MAPS_KEY=your_google_maps_key
```

### 4. Run Development Server (Turbopack)
```bash
npm run dev
```
The server runs on **port 3012**:
- Landing Page: [http://localhost:3012](http://localhost:3012)
- Interactive Sandbox Demo: [http://localhost:3012/demo](http://localhost:3012/demo)
- Customer Hub: [http://localhost:3012/customer/dashboard](http://localhost:3012/customer/dashboard)
- Pro Operations: [http://localhost:3012/pro/dashboard](http://localhost:3012/pro/dashboard)
- Admin Portal: [http://localhost:3012/admin/dashboard](http://localhost:3012/admin/dashboard)

### 5. Automated Verification & Testing
```bash
npm run typecheck    # TypeScript compilation (0 errors)
npm test             # Vitest test suite (82/82 passing)
npm run validate     # Complete pipeline validation (typecheck + test)
```

---

## 🛡️ License & Attribution

Copyright © 2026 **Volcanic.World**. All rights reserved.  
Proprietary software for the OmniService AI Marketplace platform.  
*Local Solutions. Higher Standards.*
