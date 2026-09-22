# OmniService AI — Architectural Blueprint

> **Organization:** Volcanic.World  
> **System:** OmniService AI Marketplace (`omniservice.volcanic.world`)  
> **Framework:** Next.js 16 (App Router & Turbopack)  
> **Primary Geofence:** Ameerpet, Hyderabad, Telangana 500016 (`17.4375° N, 78.4482° E`)  
> **Version:** 2.0 (Full Production Architecture)

---

## 1. System Topology & High-Level Architecture

OmniService AI is engineered as a high-performance **modular monolith** running on Next.js 16 with Turbopack, structured with strict domain entity separation and edge-level request interception:

```
                           ┌──────────────────────────────────────────────────────────┐
                           │                   Client Applications                    │
                           │   - Homeowner Consumer PWA (/customer/*, /explore)       │
                           │   - Technician Mobile Operations (/pro/*)                │
                           │   - Governance & Admin Portal (/admin/*)                 │
                           │   - Public Marketing & Sandbox Demo (/, /demo)           │
                           └────────────────────────────┬─────────────────────────────┘
                                                        │ HTTPS / TLS
                                                        ▼
                           ┌──────────────────────────────────────────────────────────┐
                           │          Next.js 16 Edge Proxy (src/proxy.ts)             │
                           │   - Sliding-Window Brute-Force Rate Limiter (20 req/min) │
                           │   - Role-Based Access Control (RBAC) Route Guards        │
                           │   - OWASP Security Headers & Timing Protection           │
                           └────────────┬─────────────────────────────┬───────────────┘
                                        │                             │
                 ┌──────────────────────┴───────┐                     │
                 ▼                              ▼                     ▼
     ┌───────────────────────┐      ┌─────────────────────────┐ ┌─────────────────────────┐
     │   InspectAI Engine    │      │  MongoDB Atlas Cluster  │ │   Filebase S3 Storage   │
     │  - Video Ingestion    │      │  - 27 Mongoose Models   │ │  - Diagnostic Videos    │
     │  - Sound Spectral AI  │      │  - Singleton Pool Cache │ │  - Pre/Post Evidence    │
     │  - SOW Price Lock     │      │  - Immutable Ledgers    │ │  - HomePass Passports   │
     └───────────────────────┘      └───────────┬─────────────┘ └─────────────────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 ▼                              ▼                              ▼
     ┌───────────────────────┐      ┌─────────────────────────┐    ┌─────────────────────────┐
     │   SmartRoute Engine   │      │    TrustLock Escrow     │    │   HomePass Passport     │
     │  - Van Inventory Match│      │  - Dual-Key Escrow Lock │    │  - 0-100 Health Engine  │
     │  - Hyderabad GPS Mesh │      │  - Cryptographic Proof  │    │  - Transfer Certificate │
     │  - First-Trip Resolve │      │  - Double-Blind Dispute │    │  - Appliance Lifecycle  │
     └───────────────────────┘      └─────────────────────────┘    └─────────────────────────┘
```

---

## 2. Next.js 16 Edge Proxy Architecture (`src/proxy.ts`)

In compliance with Next.js 16+, edge request interception is executed via the official `proxy.ts` convention, superseding deprecated `middleware.ts`:

1. **Sliding-Window Rate Limiting**:
   - In-memory sliding-window store tracking client IPs (`x-forwarded-for`, `x-real-ip`).
   - Caps `/api/auth/*` brute-force attempts at 20 requests per 60-second window.
   - Responds with HTTP 429 and standard headers: `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`.

2. **Role-Based Access Control (RBAC)**:
   - Evaluates session tokens (`authjs.session-token`, `next-auth.session-token`) and role cookies (`omniservice-role`).
   - Guards `/admin/*` $\rightarrow$ Redirects unauthenticated users to `/login?error=AdminAuthRequired` and non-admin roles to `/customer/dashboard`.
   - Guards `/pro/*` $\rightarrow$ Redirects unauthenticated users to `/login?error=ProAuthRequired`.
   - Guards `/api/admin/*` $\rightarrow$ Returns strict JSON HTTP 401/403 responses.
   - Keeps `/customer/*`, `/demo`, `/explore`, and `/` friction-free for consumer exploration and sandbox testing.

3. **HTTP Security Hardening**:
   - Injects `X-Frame-Options: DENY` (anti-clickjacking).
   - Injects `X-Content-Type-Options: nosniff`.
   - Injects `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
   - Injects `Permissions-Policy: camera=(self), microphone=(self), geolocation=(self)`.

---

## 3. Core Subsystems

### 3.1 InspectAI™ (Diagnostic Intelligence & Scope Lock)
1. **Intake & Streaming**: Homeowner captures a 15-second video of the malfunctioning appliance or fixture.
2. **Multimodal Inference**:
   - Analyzes video frames to read manufacturer serial badges, locate hairline fractures, or identify mechanical corrosion.
   - Processes acoustic signatures (e.g. 48Hz compressor shudder, motor bearing whine, cavitation) to determine root cause.
3. **Deterministic Scope of Work (SOW)**: Compiles required OEM replacement parts, required consumables (washers, thread seal), and estimated labor duration in minutes.
4. **Fair Price Ceiling Lock**: Calculates fair-market pricing based on local Hyderabad benchmarks. Escrow amount is locked before dispatch; technician cannot alter pricing on-site.

### 3.2 SmartRoute™ (4-Factor Inventory & GPS Dispatch)
1. **Van Inventory Check**: Queries local mobile stock (`ProfessionalVehicle` + `InventoryItem`). Technicians lacking the exact required OEM capacitor, valve, or PCB are excluded from emergency dispatches.
2. **Proximity & Route Optimization**: Calculates Haversine distances from customer coordinates in Ameerpet, SR Nagar, Begumpet, or Banjara Hills.
3. **Reputation & Tier Weighting**: Factors TrustLock completion rate, customer star rating (4.8+), and trade licensing tier (Journeyman, Master).
4. **94% First-Trip Resolution**: By verifying parts in the vehicle prior to dispatch, callbacks and delayed repairs are virtually eliminated.

### 3.3 TrustLock™ (Evidence Verification & Escrow State Machine)
1. **Escrow Funding**: Customer authorizes fair-market price ceiling; funds are held in a secure trustee vault.
2. **Pre-Work Checkpoint**: Pro arrives on site, scans geotagged and timestamped pre-work condition.
3. **Post-Work Checkpoint**: Pro records functional test verification (e.g. running compressor amperage, hydrostatic leak flow).
4. **AI-Assisted Verification**: InspectAI validates pre-vs-post photo evidence (similarity scoring $\ge 90\%$) and generates cryptographic proof token (`TL-PROOF-...`).
5. **Milestone Payout & Dispute Governance**:
   - Escrow is released with platform fee split (88% to Pro, 12% to Platform).
   - In the event of a dispute, escrow funds are instantly frozen for administrator arbitration.

### 3.4 HomePass™ (Property Lifecycle Passport)
1. **Digital Asset Passport**: Every physical property in Ameerpet and Greater Hyderabad receives an immutable HomePass ledger (`HP-HYD-...`).
2. **Appliance Registry**: Tracks brand, model number, serial number, install date, and warranty expiration.
3. **Health Scoring (0–100)**: Real-time algorithm calculates property system health based on maintenance intervals and component ages.
4. **Transferable Provenance**: Owners can generate signed provenance certificates (`transferToken`) when leasing or selling the property.

---

## 4. Directory Structure & Module Boundaries

```
src/
├── app/                        # Next.js 16 App Router (RSC & Server Actions)
│   ├── (auth)/                 # Authentication views (Login, Register with GPS)
│   ├── admin/                  # Administrative Governance Portal
│   ├── api/                    # REST API Endpoints & Webhooks
│   ├── customer/               # Customer Hub (Dashboard, Requests, HomePass, Profile)
│   ├── demo/                   # Isolated Interactive Sandbox Demo
│   ├── explore/                # Trade Category Catalog
│   ├── pro/                    # Professional Hub (Dispatch, Live Route, Inventory)
│   ├── globals.css             # Design Tokens & Keyframe Animations
│   └── page.tsx                # Marketing Homepage
├── components/
│   ├── auth/                   # Google One-Tap & Credentials UI
│   ├── layout/                 # TopBar, CustomerNav, ProfessionalNav
│   ├── shared/                 # PageHeader, Feedback States, Empty States
│   └── ui/                     # Design Primitives (Button, Card, Badge, Toast, Dialog)
├── config/                     # Environment configuration & Zod schemas
├── lib/
│   ├── crypto.ts               # NIST PBKDF2 SHA-512 cryptographic engine
│   ├── db.ts                   # Cached Mongoose singleton connection manager
│   ├── geolocation.ts          # Hyderabad GPS capture & zone geofences
│   ├── memory-store.ts         # Fast in-memory state & fallback store
│   ├── pro-seed-data.ts        # Seed technicians and van inventory in Hyderabad
│   └── utils.ts                # Currency (₹ INR), date helpers, class merging
├── models/                     # 27 Mongoose models with strict schemas
└── proxy.ts                    # Edge proxy (Next.js 16 convention)
```

---

## 5. Security & Cryptographic Guarantees

- **PBKDF2 Password Derivation**: 100,000 iterations of HMAC-SHA-512 with 32-byte cryptographically secure random salt per user.
- **Timing-Safe Equality**: `crypto.timingSafeEqual` prevents timing side-channel attacks during password and token verification.
- **Strict Isolation**: The `/demo` sandbox operates in memory and local state with zero write access to production database collections.
- **Session Protection**: HTTP-only, secure, `SameSite=Lax` cookies with HMAC verification.

---

## 6. Verification & Automated Quality Metrics

- **Unit & Integration Tests**: 82 of 82 passing tests across 9 test suites in Vitest.
- **TypeScript Typecheck**: 0 compilation errors with strict null checks enabled.
- **Edge Proxy**: Fully migrated to Next.js 16 `proxy.ts`, 0 deprecation warnings.
- **Runtime Environment**: Next.js 16.3+ (Turbopack) configured on port 3012.
