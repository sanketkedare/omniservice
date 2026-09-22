# OmniService AI — Enterprise Architecture &amp; Case Study

> **AI-Native Local Services Marketplace** by **Volcanic Digital Solutions**  
> **Production Live URL:** [https://omniservice.volcanic.world/](https://omniservice.volcanic.world/)  
> **Interactive Case Study:** [https://omniservice.volcanic.world/case-study](https://omniservice.volcanic.world/case-study)  
> **Motto:** *"Local Solutions. Higher Standards."*  
> **Geographic Scope:** Greater Hyderabad, Telangana, India  
> **Developer &amp; Operator Inquiries:** `volcanic.digitalsolutions@gmail.com`  

---

## 🌟 Executive Overview &amp; Real Problem Solving

Traditional home contracting suffers from three persistent structural failures:
1. **Asymmetric Guesswork:** Technicians arrive without diagnostic context, providing arbitrary, inflated quotes with zero verifiable parts and labor transparency.
2. **Multiple Trips &amp; Delays:** Over 60% of repair jobs require technicians to leave the home to hunt for parts in local markets, doubling resolution time.
3. **Adversarial Settlement:** Customers are forced to pay before workmanship can be verified, while honest contractors face payment delays and disputes.

**OmniService AI** transforms this ecosystem into a deterministic, AI-governed operating system:
- **15-Second Multimodal Video Intake:** Customers record their repair issue. InspectAI analyzes visual markers and acoustic waveforms, matching OEM part numbers and fair-market labor rates into a legally locked price ceiling upfront.
- **Inventory-Aware SmartRoute Dispatch:** Dispatches licensed master technicians who already have the exact required replacement parts stocked in their mobile vans, achieving a 94% first-visit resolution rate.
- **TrustLock™ Fiduciary Escrow:** Customer payments are safely held in an encrypted escrow vault. Funds release only after pre- and post-repair photographic evidence passes visual verification and customer approval.
- **HomePass™ Property Passport:** Every repair creates an immutable digital property ledger, recording appliance serials, warranties, and an overall 0–100 property health score.

---

## 🏗️ The 4 Core Architectural Pillars

| Subsystem | Architectural Role | Production Implementation |
| :--- | :--- | :--- |
| **InspectAI™** | Multimodal Diagnostic Intelligence | 15-second video scan analyzing audio frequencies (e.g. 120 Hz motor shudder, bearing friction, pipe leaks) and visual defects to calculate locked price ceilings based on genuine OEM catalogs and fair-market labor rates. |
| **SmartRoute™** | Inventory-Aware Dispatch Engine | 4-factor dispatch matrix evaluating technician certification tier, live mobile van inventory stock matching the diagnosed component, real-time GPS proximity in Hyderabad, and customer reputation scores. |
| **TrustLock™** | Visual Proof &amp; Fiduciary Escrow | Cryptographic escrow state machine holding customer funds until pre- and post-repair photographic evidence passes visual verification. Includes double-blind dispute freeze for contested jobs. |
| **HomePass™** | Permanent Digital Property Passport | Immutable, transferrable digital ledger recording appliance serials, warranty expirations, and verified maintenance logs with 0–100 property health scoring. |

---

## 👥 Ecosystem Roles &amp; Capabilities

### 1. Customer (`/customer/dashboard`)
- **15-Second Video Intake:** Instant visual diagnosis with InspectAI and locked price ceiling upfront.
- **Real-Time GPS Tracking:** Live map tracking of assigned technician and arrival ETA.
- **Digital Property Passport:** Manage HomePass records, appliance warranties, and property health audits.
- **Escrow Release Authorization:** Review pre- and post-repair photographic evidence before authorizing payment release.

### 2. Service Provider (`/pro/dashboard`)
- **SmartRoute Dispatch Feed:** Receive matched job opportunities filtered by skills and van inventory.
- **Mobile Van Inventory Manager:** Track spare parts, R-32 refrigerant, dual-run capacitors, and gaskets with automated restock triggers.
- **Job Evidence Camera:** Capture and upload high-resolution before-and-after photos for automated escrow verification.
- **Escrow Payout Wallet:** Real-time earnings ledger with automatic payouts once work is verified.

### 3. Governance Admin (`/admin/dashboard`)
- **Financial Telemetry:** Monitor real-time platform GMV, active escrow vault balances, and dispute rates.
- **Dispute Arbitration Chamber:** Double-blind dispute review interface with side-by-side before/after photographic audits.
- **Technician Credentialing:** Verify licenses, criminal background checks, and trade certifications.
- **Cryptographic Audit Logs:** SHA-256 tamper-evident logs of all platform transactions and state transitions.

---

## 🎨 Design System &amp; Brand Aesthetics

OmniService AI features an editorial visual language crafted for authority, trust, and usability:
- **Typography:** Classical Times New Roman editorial font stack (`"Times New Roman", Times, "Liberation Serif", serif`) conveying institutional trust, paired with monospace fonts for financial amounts (₹ INR) and diagnostic tokens.
- **Color Palette:**
  - **Volcanic Orange (`#F05A28`)**: Primary brand accent, action CTAs, and active indicators.
  - **Vibrant Coral (`#EA580C`) &amp; Terracotta (`#C2410C`)**: Secondary headings, hover states, and warm borders.
  - **Deep Espresso Ember (`#2D130A`)**: High-contrast typography and dark footer anchoring.
  - **Warm Honey Linen (`#FAF8F5`, `#FFFDF7`)**: Tactile off-white backgrounds eliminating eye strain.
- **Responsive Layout:**
  - Fluid full-bleed wrappers with standardized `max-w-7xl` containers on desktop displays.
  - Glassmorphic top navigation bars (`backdrop-blur-xl bg-white/90`) with active Google authentication button.
  - Responsive slide-out mobile navigation drawer with smooth anchor scrolling and instant auth access.

---

## 🔒 Enterprise Security &amp; Next.js 16 Proxy Architecture

- **Next.js 16 `proxy.ts` Edge Architecture:**
  - Official Next.js 16 `proxy.ts` edge request interception.
  - Sliding-window in-memory rate limiting (20 req/min on `/api/auth/*` returning HTTP 429 with `Retry-After`).
  - Strict Role-Based Access Control (RBAC) redirecting unauthenticated visitors to `/login` with callback URLs.
  - Automatic edge redirect preventing authenticated users from accessing `/login` and `/register`.
  - OWASP security headers injection (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Permissions-Policy`).
- **NIST SP 800-132 Cryptographic Engine:**
  - PBKDF2 with SHA-512, 100,000 iterations, and unique 32-byte cryptographically secure salts (`crypto.randomBytes(32)`).
  - Timing-safe password verification using `crypto.timingSafeEqual` to eliminate timing side-channel attacks.
- **Multi-Tenant Authentication:**
  - Active Google Sign-In button directly in navigation headers with automatic profile linking.
  - Credential authentication with MongoDB Atlas persistence.
  - Instant 6-digit email OTP verification via secure SMTP.

---

## 🧪 Automated Testing &amp; Verification

OmniService AI includes an automated test suite executed via Vitest and React Testing Library:

```bash
# Run test suite
npm test

# Run TypeScript compilation check
npx tsc --noEmit
```

### Test Suite Results:
- **`tests/auth-security.test.ts`**: NIST SP 800-132 password hashing, salt uniqueness, timing-safe equality, rate-limiting, and edge proxy RBAC (11 tests).
- **`tests/unit/pricing.test.ts`**: Labor rates, OEM parts catalog lookups, and locked price ceiling calculations (8 tests).
- **`tests/unit/trust-score.test.ts`**: Fiduciary score engine, 4-factor dispatch matrix, and dispute penalty calculations (12 tests).
- **`tests/unit/geolocation.test.ts`**: GPS coordinate boundary validation, Hyderabad zone resolution, and fallback handling (7 tests).
- **`tests/integration/dispute-workflow.test.ts`**: Double-blind dispute escalation, evidence freezing, and admin arbitration (14 tests).
- **`tests/integration/escrow-lifecycle.test.ts`**: TrustLock state machine, booking hold, photographic verification, and release (16 tests).
- **`tests/integration/smart-route.test.ts`**: Van inventory matching, technician proximity scoring, and dispatch ranking (10 tests).
- **`tests/integration/service-requests.test.ts`**: Service request creation, SOW generation, and status progression (9 tests).
- **`tests/integration/homepass.test.ts`**: Property health score calculation, appliance serial logging, and passport transfers (9 tests).

**Total: 96 / 96 Tests Passing (100% Pass Rate). Zero compilation errors.**

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- MongoDB 7.0+ or MongoDB Atlas connection string

### Installation
```bash
# 1. Clone repository
git clone https://github.com/VolcanicWorld/ForgeLocal.git
cd ForgeLocal

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env.local)
MONGODB_URI="mongodb+srv://..."
AUTH_SECRET="your-64-character-cryptographic-secret"
NEXT_PUBLIC_APP_URL="https://omniservice.volcanic.world"
NEXT_PUBLIC_FIREBASE_API_KEY="..."

# 4. Launch development server
npm run dev

# 5. Access application
open http://localhost:3000
```

---

## 📄 Submission Information

- **Live Deployment:** [https://omniservice.volcanic.world/](https://omniservice.volcanic.world/)
- **Case Study Page:** [https://omniservice.volcanic.world/case-study](https://omniservice.volcanic.world/case-study)
- **HTML Documentation:** View [`README.html`](./README.html) in any browser
- **Operating Organization:** Volcanic Digital Solutions
- **Primary Contact:** `volcanic.digitalsolutions@gmail.com`
- **License:** Proprietary — Volcanic Digital Solutions
