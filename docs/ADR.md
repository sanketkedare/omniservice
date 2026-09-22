# OmniService AI — Architectural Decision Records (ADR)

> **Repository:** ForgeLocal / OmniService AI  
> **Company:** Volcanic.World  
> **Status:** Active / Accepted  

---

### ADR-001: Sole Primary Database — MongoDB with Mongoose
- **Status:** Accepted
- **Context:** The PRD mentions PostgreSQL for transactional data, MongoDB for diagnostics, and Redis for sessions. However, the Master Build Prompt mandates MongoDB + Mongoose for the unified data layer.
- **Decision:** Use MongoDB 8.0 via Mongoose as the sole primary datastore for all 27 domain entities. Use strict Mongoose schemas with compound indexes, document embedding for sub-entities, and transactions for multi-document operations.
- **Consequences:** Eliminates dual-database maintenance complexity, schema drift between ORMs, and distributed transactions during MVP.

---

### ADR-002: Web-First Architecture — Next.js 16 PWA with Turbopack
- **Status:** Accepted
- **Context:** The platform requires rapid deployment across desktop, tablet, and mobile devices with fast builds.
- **Decision:** Build a Progressive Web App (PWA) on Next.js 16 App Router using Turbopack, mobile-first responsive layouts, navigation shells (`TopBar`, `CustomerNav`, `ProfessionalNav`), and native touch interactions.
- **Consequences:** Accelerates delivery of unified features across desktop, tablet, and mobile with a single cohesive codebase on port 3012.

---

### ADR-003: Storage Abstraction — Filebase Decentralized S3
- **Status:** Accepted
- **Context:** Diagnostic videos, high-resolution before/after evidence photos, and PDF invoices require high-durability, cost-effective object storage without vendor lock-in.
- **Decision:** Implement a provider-agnostic storage interface (`IStorageService`) backed by Filebase (IPFS/S3-compatible decentralized storage) and standard AWS S3.
- **Consequences:** Provides decentralized permanence for HomePass property records and verifiable tamper-evident storage for TrustLock evidence.

---

### ADR-004: State & Data Fetching — TanStack React Query + React Hook Form + Zod
- **Status:** Accepted
- **Context:** Marketplace workflows involve complex multi-step forms (diagnostic intake, change orders, dispute submissions) and real-time status transitions.
- **Decision:** Standardize on TanStack React Query for async server state, React Hook Form for performant form handling, and Zod for unified client/server validation schemas.
- **Consequences:** Strongly-typed end-to-end data contracts and automatic background cache invalidation.

---

### ADR-005: Immutability for Financial Ledgers
- **Status:** Accepted
- **Context:** Escrow transactions and payments represent financial and legal truth between customers, professionals, and the platform.
- **Decision:** Enforce append-only semantics on `EscrowTransaction` at the schema hook layer. Any modification triggers a hard exception. Corrections require compensatory entries.
- **Consequences:** Guarantees auditable compliance with regulatory and dispute requirements.

---

### ADR-006: Migration from `middleware.ts` to `proxy.ts` Convention in Next.js 16
- **Status:** Accepted
- **Context:** Next.js 16 officially deprecated the `middleware.ts` naming convention in favor of `proxy.ts` for edge request interception.
- **Decision:** Migrate all edge route guarding, sliding-window brute-force rate limiting (20 req/min on `/api/auth/*`), and security header injection into `src/proxy.ts`, completely retiring `src/middleware.ts`.
- **Consequences:** Eliminates Next.js runtime deprecation warnings, aligns with current Next.js 16 edge specifications, and guarantees edge security.

---

### ADR-007: Geographic Localization to Ameerpet, Hyderabad
- **Status:** Accepted
- **Context:** The initial prototype used Mumbai placeholder coordinates and locality strings. The production pilot focuses on the high-density residential and tech corridor of Hyderabad.
- **Decision:** Center all default geolocations, geofences, dispatch waypoints, vehicle registrations, and addresses on Ameerpet, Hyderabad (`17.4375° N, 78.4482° E`, Telangana PIN 500016, plates `TS-09-...`).
- **Consequences:** Real-world alignment with the pilot operating territory across Ameerpet, SR Nagar, Begumpet, and Banjara Hills.

---

### ADR-008: Volcanic Orange & Emergent Experience Design System
- **Status:** Accepted
- **Context:** Early designs swung between sterile stark white and disjointed dark components, lacking cohesive warmth and brand distinction.
- **Decision:** Establish a unified design system centered on Volcanic Orange (`#F05A28`), Vibrant Coral (`#EA580C`), Terracotta (`#C2410C`), Deep Espresso Ember (`#2D130A`), and warm peach/honey canvases (`#fffaf5`, `#fff7ed`). Integrate floating ambient orbs (`@keyframes floatSlow`), radial meshes, and standard `max-w-7xl mx-auto` containers on big screens.
- **Consequences:** Eliminates eye strain, creates an immersive and modern visual experience, and guarantees responsive readability on ultra-wide displays.

---

### ADR-009: Isolated Interactive Sandbox Demo (`/demo`)
- **Status:** Accepted
- **Context:** Direct cookie injection on the login page bypass buttons compromised security hygiene and did not provide an isolated dummy-data playground for evaluators.
- **Decision:** Introduce a dedicated `/demo` sandbox route showcasing simulated Customer, Pro, and Governance dashboards with realistic dummy data, zero authentication prerequisites, and complete isolation from production MongoDB data.
- **Consequences:** Safe, high-converting product demonstrations without risking elevated privilege leaks or database corruption.
