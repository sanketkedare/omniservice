# OmniService AI — Database & Data Layer Architecture

> **Primary Database:** MongoDB 8.0  
> **ODM:** Mongoose 8.x  
> **Schema Pattern:** Document-oriented with strict typing, compound indexes, and immutable financial ledgers  
> **Company:** Volcanic.World

---

## 1. Domain Entities & Collections (All 27 Models)

All 27 models are implemented in `src/models/` and re-exported via `src/models/index.ts`:

| # | Collection / Model | Purpose | Key Indexes & Security Fields |
|---|--------------------|---------|-------------------------------|
| 1 | `User` | Unified customer, pro, and admin accounts | `email (unique)`, `phone (unique)`, `(role, status)`, `coordinates {lat, lng}`, `authProvider`, `googleId`, `passwordHash (select: false)`, `passwordSalt (select: false)` |
| 2 | `Property` | Homes, apartments, and commercial sites | `ownerId`, `address.postalCode`, `address.city` |
| 3 | `Professional` | Verified service technician profile | `userId (unique)`, `serviceRadiusKm`, `(status, kycStatus)` |
| 4 | `ProfessionalSkill` | Certified trade competencies & tiers | `(professionalId, categoryId)` |
| 5 | `ProfessionalVehicle` | Mobile service van inventory container | `professionalId`, `licensePlate` (`TS-09-...`) |
| 6 | `InventoryItem` | Van & warehouse spare parts stock | `professionalId`, `sku`, `barcode` |
| 7 | `ServiceCategory` | Marketplace taxonomy (HVAC, Plumbing, etc.) | `slug (unique)`, `parentCategoryId` |
| 8 | `ServiceRequest` | Intake ticket for customer problem | `customerId`, `(status, createdAt)`, `geofence` |
| 9 | `DiagnosticSession` | InspectAI video/audio session | `serviceRequestId`, `(status, createdAt)` |
| 10 | `DiagnosticFinding` | AI root-cause detections & parts | `sessionId`, `confidenceScore` |
| 11 | `ScopeOfWork` | Machine-generated labor & parts tasks | `serviceRequestId`, `diagnosticSessionId`, `priceCeilingPaise` |
| 12 | `PricingEstimate` | Dynamic algorithmic price breakdown | `scopeOfWorkId`, `status` |
| 13 | `Job` | Execution unit matched to professional | `(status, scheduledStartAt)`, `customerId`, `professionalId` |
| 14 | `Booking` | Customer reservation & time slot | `(jobId, professionalId)` |
| 15 | `JobEvidence` | Before/after photos & serial numbers | `(jobId, type, sequence)` |
| 16 | `ChangeOrder` | SOW adjustment & price differential | `jobId`, `status` |
| 17 | `Payment` | Customer payment intent & authorization | `idempotencyKey (unique)`, `providerPaymentId` |
| 18 | `EscrowTransaction` | Immutable append-only audit ledger | `(paymentId, createdAt)`, `(jobId, createdAt)` |
| 19 | `Payout` | Disbursement to professional bank | `professionalId`, `status` |
| 20 | `VerificationResult` | TrustLock automated/manual check | `jobId`, `evidenceId` |
| 21 | `Dispute` | Contested work arbitration case | `jobId`, `status`, `assignedAdminId` |
| 22 | `Review` | Customer verified review & ratings | `jobId (unique)`, `professionalId` |
| 23 | `MaintenanceRecord` | Property lifecycle servicing log | `propertyId`, `equipmentId` |
| 24 | `Warranty` | Manufacturer or OmniService guarantee | `propertyId`, `(status, expiresAt)` |
| 25 | `Notification` | Multichannel dispatch log (WhatsApp, SMS, Email) | `(userId, status, createdAt)`, `(userId, readAt)` |
| 26 | `AIInference` | Telemetry for model tokens, latency, cost | `entityId`, `(jobType, createdAt)` |
| 27 | `AuditLog` | Security & compliance mutation history | `(entityType, entityId)`, `actorId`, `createdAt` |

---

## 2. Escrow Immutability Pattern

The `EscrowTransaction` schema represents financial and regulatory truth. Once written, records can **never** be updated or deleted:

```typescript
EscrowTransactionSchema.pre(["updateOne", "updateMany", "findOneAndUpdate"], function () {
  throw new Error("EscrowTransaction is immutable. New entries must be created instead of modifying existing ones.");
});
```

---

## 3. Cryptographic Security In Data Layer

- **Password Storage**: Passwords are never stored in plaintext. Uses PBKDF2 SHA-512 with 100,000 iterations and per-user 32-byte salts.
- **Select Exclusions**: `passwordHash` and `passwordSalt` are marked with `{ select: false }` to prevent accidental serialization into API responses or loggers.
- **Timing Safe Equality**: Checked via Node.js `crypto.timingSafeEqual` in [`src/lib/crypto.ts`](file:///d:/Sanket/Developer_2.0/Projects/ForgeLocal/src/lib/crypto.ts).

---

## 4. Connection Management (`src/lib/db.ts`)

- **Singleton Caching**: Uses a global cache (`global.mongooseConnection`) to prevent connection leaks across Next.js Turbopack Hot Module Reloading (HMR) and Route Handlers.
- **Connection Pooling**: Configured with `maxPoolSize: 10`, `minPoolSize: 2`, and `serverSelectionTimeoutMS: 5000`.
- **Health Check API**: Includes `getDatabaseHealth()` for automated monitoring and administrative status checks.
