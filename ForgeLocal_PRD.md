# Volcanic Product — AI-Powered Local Services Marketplace

**Working Product Name:** ForgeLocal  
**Company:** Volcanic.World  
**Document:** Product Requirements Document (PRD)  
**Version:** 1.0  
**Status:** Product & Technical Requirements  
**Target Platforms:** Consumer Mobile/Web, Pro Mobile, Admin/Operations Web, WhatsApp/SMS/Voice

---

## 1. Product Overview

**ForgeLocal** is an AI-native local services marketplace designed to transform how customers discover, diagnose, book, pay for, and verify physical services.

Instead of functioning primarily as a directory, fixed service catalog, or pay-per-lead marketplace, ForgeLocal should operate as an **AI-assisted execution layer** between customers, service professionals, payments, diagnostics, routing, inventory, and quality verification.

The product specification is based on the supplied OmniService AI concept. The source describes the core proposition as an autonomous, multimodal execution marketplace using computer vision for diagnostic intake, autonomous agents for professional dispatch, inventory-aware routing, and visual verification for escrow settlement. 

### Core product promise

> **Show the problem. Let AI understand it. Get a transparent scope and price. Get matched with the right professional. Verify the work. Release payment with confidence.**

---

# 2. Product Goals

## 2.1 Consumer Goals

- Reduce the effort required to explain a physical problem.
- Allow customers to submit video, images, text, or voice.
- Generate an understandable preliminary diagnosis.
- Produce a structured Scope of Work (SOW).
- Provide transparent pricing bounds before booking.
- Match customers with suitable professionals.
- Reduce quote and messaging fatigue.
- Provide pre-work and post-work evidence.
- Make disputes evidence-driven.
- Maintain a long-term property/service history.

## 2.2 Professional Goals

- Eliminate upfront pay-per-lead waste.
- Receive qualified, structured jobs rather than vague inquiries.
- Match jobs against location, skills, schedule, inventory, and target economics.
- Reduce unpaid supply-house trips.
- Automate scheduling and customer communication.
- Receive faster settlement after verified completion.
- Maintain digital job records, invoices, mileage, and operational data.

## 2.3 Platform Goals

- Build a trusted transaction layer for local services.
- Create defensible AI and operational data infrastructure.
- Improve marketplace liquidity through intelligent matching.
- Increase completed-job conversion.
- Reduce support and dispute costs through evidence.
- Create recurring consumer value through property maintenance history.

---

# 3. Problem Statement

The local-services experience contains friction on both sides.

### Customers

- Difficult-to-describe problems.
- Unclear pricing.
- Multiple conversations before receiving a useful quote.
- Uncertainty about professional reliability.
- Difficulty proving whether work was completed correctly.
- Slow or subjective dispute processes.

### Professionals

- High customer-acquisition costs.
- Unproductive leads.
- Manual scheduling.
- Time lost traveling for parts.
- Repetitive customer communication.
- Delayed payment.
- Fragmented bookkeeping and job records.

ForgeLocal addresses these problems by combining multimodal AI, marketplace matching, workflow automation, visual verification, and transaction infrastructure.

---

# 4. Competitive Positioning

The supplied specification identifies three major marketplace patterns:

| Model | Typical Approach | ForgeLocal Direction |
|---|---|---|
| Managed marketplace | Fixed service menus and platform assignment | AI-generated job scope + intelligent matching |
| Lead-generation marketplace | Customers generate inquiries and professionals compete for leads | No upfront lead payment; monetize completed verified jobs |
| Gig marketplace | Static service packages | Dynamic physical-job scoping with location, inventory and diagnostics |

ForgeLocal should differentiate through the **entire transaction lifecycle**, not a single AI feature.

### Key differentiators

1. Multimodal diagnostic intake.
2. AI-generated Scope of Work.
3. Dynamic pricing guardrails.
4. Autonomous professional matching.
5. Inventory-aware routing.
6. Visual proof-of-work.
7. Evidence-based dispute resolution.
8. Ambient voice and messaging intake.
9. Property/service digital history.
10. Performance-based professional monetization.

---

# 5. Product Modules

## 5.1 Consumer Application

### Authentication

- Phone OTP.
- Email authentication.
- Social authentication where appropriate.
- Address/property profiles.
- Multiple saved properties.

### Home Dashboard

Display:

- Active jobs.
- Upcoming appointments.
- Recent services.
- Property health indicators.
- Maintenance recommendations.
- Emergency service shortcut.
- Saved professionals.

### Create Service Request

Supported inputs:

- Camera.
- Video.
- Photos.
- Text.
- Voice.
- WhatsApp.
- SMS.
- Phone/IVR.

The user should not need to know the exact service category before submitting a problem.

Example:

> "There is water collecting under my kitchen sink whenever I run the tap."

AI converts this into a structured service request.

---

# 6. AI Diagnostic Engine — InspectAI

## 6.1 Input

The diagnostic engine accepts:

- 10–15 second videos.
- Multiple images.
- Voice descriptions.
- Text descriptions.
- OCR-readable labels and serial numbers.
- Optional historical property data.

## 6.2 AI Processing

The system should attempt to identify:

- Components.
- Materials.
- Dimensions where measurable.
- Visible damage.
- Corrosion.
- Leaks.
- Surface conditions.
- Appliance information.
- Serial numbers.
- Potential hazards.

## 6.3 Output

The engine produces:

```text
Diagnostic Summary
Confidence Score
Likely Root Cause
Potential Secondary Issues
Required Parts
Estimated Labor
Estimated Duration
Pricing Range
Risk Flags
Recommended Service Category
```

### Important safety behavior

AI diagnosis must be presented as a preliminary assessment, not an unconditional professional diagnosis.

For low-confidence or safety-critical cases, the system must escalate to a qualified professional or human review workflow.

---

# 7. Scope of Work Engine

The SOW engine converts diagnostic information into a structured job.

Example:

```json
{
  "category": "plumbing",
  "problem": "P-trap leak",
  "confidence": 0.91,
  "parts": [
    {
      "name": "1.5 inch P-trap kit",
      "quantity": 1
    }
  ],
  "estimated_labor_minutes": {
    "min": 30,
    "max": 45
  },
  "price_range": {
    "min": 82,
    "max": 105
  },
  "risk_flags": [],
  "requires_on_site_confirmation": false
}
```

The SOW becomes the shared source of truth for:

- Customer.
- Professional.
- Pricing.
- Booking.
- Change orders.
- Quality verification.
- Dispute resolution.

---

# 8. Dynamic Pricing Engine

Pricing should be generated from multiple signals.

### Inputs

- Estimated parts.
- Local material prices.
- Labor rates.
- Job complexity.
- Geographic area.
- Professional availability.
- Travel distance.
- Historical completed jobs.
- Urgency.
- Time of service.

### Output

The platform should provide:

- Estimated fair-market range.
- Maximum customer authorization.
- Professional expected payout.
- Platform fee.
- Parts cost.
- Optional urgency charges.

Pricing should remain explainable.

Example:

```text
Parts              ₹850
Estimated Labor    ₹1,500–₹2,000
Travel             ₹250
Platform Fee       ₹180
--------------------------------
Estimated Total    ₹2,780–₹3,280
```

---

# 9. Professional Platform

## 9.1 Professional Profile

Each professional profile should include:

- Identity verification.
- Business information.
- Trade/category.
- Skills.
- Certifications/licenses where applicable.
- Service radius.
- Availability.
- Pricing preferences.
- Completed jobs.
- Customer feedback.
- Quality metrics.
- Cancellation rate.
- Response rate.

## 9.2 Professional AI Twin

A professional may configure an AI agent representing their operational preferences.

Parameters:

- Working hours.
- Minimum job value.
- Service radius.
- Preferred categories.
- Target hourly economics.
- Emergency availability.
- Current location.
- Vehicle inventory.
- Calendar availability.

The AI agent can evaluate incoming opportunities while leaving final control with the professional.

---

# 10. SmartRoute Pro

The dispatch engine evaluates:

```text
Customer location
+
Professional location
+
Current schedule
+
Skills
+
Vehicle inventory
+
Travel time
+
Job duration
+
Professional economics
+
Customer urgency
```

The system should return a small set of high-quality booking options instead of broadcasting a vague request to many professionals.

### Example

```text
Option A
Professional: Apex Plumbing
Arrival: 10:15 AM
Distance: 2.4 mi
Required parts: In vehicle
Estimated completion: 45 min

Option B
Professional: PrimeFlow Services
Arrival: 10:45 AM
Distance: 3.1 mi
Required parts: Available nearby
Estimated completion: 60 min
```

---

# 11. Inventory Intelligence

Professionals can manage vehicle inventory through:

- Manual inventory.
- Barcode scanning.
- Shelf photos.
- Digital manifests.
- Inventory integrations.

The system should connect required parts from the SOW with professional inventory.

### Goal

Avoid unnecessary supply-house trips and improve first-visit completion.

---

# 12. Booking Workflow

```text
Problem Submitted
        ↓
AI Intake
        ↓
Diagnostic Analysis
        ↓
SOW Generation
        ↓
Pricing Range
        ↓
Professional Matching
        ↓
Customer Chooses Slot
        ↓
Payment Authorization
        ↓
Professional Arrival
        ↓
Baseline Capture
        ↓
Work Execution
        ↓
Post-Work Verification
        ↓
Payment Release
        ↓
Review + Property History
```

---

# 13. TrustLock — Visual Proof-of-Work

TrustLock is the verification layer.

## 13.1 Pre-Work

Professional captures:

- Arrival image.
- Existing damage.
- Work area.
- Relevant components.

## 13.2 During Work

For applicable jobs:

- Milestone photographs.
- Concealed-work checkpoints.
- Required installation evidence.

## 13.3 Post-Work

Professional submits:

- Completion images.
- Completion video.
- Functional test evidence.

AI evaluates whether observable completion conditions are satisfied.

---

# 14. Escrow & Payments

The platform should support:

1. Customer authorization.
2. Payment hold/pre-authorization where legally and technically appropriate.
3. Job execution.
4. Verification.
5. Release.
6. Refund/change-order workflows.
7. Professional payout.
8. Platform fee accounting.

Payment and escrow behavior must comply with the applicable payment-provider and jurisdictional requirements.

---

# 15. Change Order System

Unexpected issues are common in physical services.

Example:

```text
Original Scope
Replace visible P-trap

New Discovery
Damaged pipe inside cabinet wall

Professional submits evidence
        ↓
AI updates diagnostic context
        ↓
New SOW generated
        ↓
Updated price
        ↓
Customer approval
        ↓
Work continues
```

No material scope increase should be silently charged to the customer.

---

# 16. Dispute Resolution

Disputes should be evidence-driven.

Relevant evidence:

- Original diagnostic video.
- Original SOW.
- Customer-approved changes.
- Pre-work images.
- Milestone evidence.
- Post-work evidence.
- Messages.
- Payment history.
- Verification results.

The Resolution Center should create a chronological case timeline.

### Human escalation

AI should recommend an evidence summary, while high-value, ambiguous, safety-sensitive, or contested cases should be eligible for human review.

---

# 17. Ambient Interface

The platform should support service requests without requiring app installation.

### Channels

- WhatsApp.
- SMS.
- Voice/IVR.
- Web.
- Mobile.

### Voice workflow

```text
Customer calls
     ↓
Voice Agent
     ↓
Problem description
     ↓
Targeted questions
     ↓
Optional photo/video request
     ↓
Structured job ticket
     ↓
Customer confirmation
     ↓
Matching + booking
```

---

# 18. HomePass — Property Digital Passport

HomePass stores the service history of a property.

### Data

- Appliances.
- Serial numbers.
- Installation dates.
- Previous repairs.
- Service providers.
- Maintenance events.
- Warranty information.
- Diagnostic media.
- Parts replaced.
- Recurring problems.

### Predictive Maintenance

The system may generate recommendations based on:

- Equipment age.
- Service history.
- Usage patterns.
- Environmental context.
- Manufacturer recommendations.
- Previous failures.

Recommendations should be explainable and should not imply certainty where data is insufficient.

---

# 19. Professional Operations

### Dashboard

Professionals should see:

- Today's jobs.
- Upcoming jobs.
- Earnings.
- Route.
- Required parts.
- Inventory.
- Customer notes.
- Job evidence.
- Payout status.

### Automation

Automate:

- Appointment reminders.
- Arrival notifications.
- Customer messages.
- Invoices.
- Receipts.
- Job summaries.
- Mileage reports.
- Expense records.

---

# 20. Admin & Operations Portal

Admin users should be able to manage:

### Users

- Customers.
- Professionals.
- Verification status.
- Suspensions.
- Account issues.

### Jobs

- Active jobs.
- Completed jobs.
- Escalations.
- Change orders.
- Disputes.

### Marketplace

- Supply/demand.
- Service categories.
- Geographic density.
- Conversion.
- Completion rates.

### AI Operations

- Model confidence.
- Failed diagnostics.
- Human escalations.
- Verification failures.
- Model feedback.

### Financial Operations

- Transactions.
- Escrow states.
- Refunds.
- Payouts.
- Platform revenue.

---

# 21. Notifications

Channels:

- Push.
- SMS.
- Email.
- WhatsApp.
- Voice.

Events:

- Request received.
- Diagnostic complete.
- Quote available.
- Booking confirmed.
- Professional en route.
- Professional arrived.
- Change order required.
- Work verified.
- Payment released.
- Review requested.
- Maintenance reminder.

---

# 22. Recommended Technical Architecture

## Client Layer

- Next.js — Web/Admin.
- React Native — Consumer and Professional apps.
- Camera/media capture.
- Maps/location.
- Voice interface.

## API Layer

- Fastify / Node.js.
- API Gateway.
- REST for external APIs.
- gRPC for internal services where appropriate.
- WebSockets for real-time states.

## Services

```text
Auth Service
User Service
Professional Service
Job Service
Diagnostic Service
SOW Service
Pricing Service
Matching Service
Dispatch Service
Inventory Service
Messaging Service
Voice Service
Payment Service
Escrow Service
Verification Service
Dispute Service
Property Service
Notification Service
Analytics Service
```

## Data Layer

### PostgreSQL

Use for:

- Users.
- Professionals.
- Jobs.
- Financial records.
- Escrow state.
- Contracts.
- Compliance records.

### MongoDB

Use for:

- Diagnostic documents.
- Flexible job metadata.
- AI outputs.
- Dynamic checklists.
- Sensor/telemetry payloads.

### Redis

Use for:

- Sessions.
- Geospatial indexes.
- Real-time job state.
- Caching.
- Rate limiting.

### Object Storage

Use for:

- Videos.
- Images.
- Documents.
- Verification evidence.

### Vector Database

Use for:

- Trade knowledge.
- Building-code references.
- Historical diagnostic embeddings.
- Semantic retrieval.

### Event Bus

Use Kafka or an equivalent event system for asynchronous marketplace and AI events.

---

# 23. AI Architecture

## AI Components

### 1. Multimodal Diagnostic Model

Responsibilities:

- Image/video understanding.
- Component detection.
- OCR.
- Damage classification.
- Risk identification.

### 2. SOW Generation Model

Responsibilities:

- Convert diagnostic signals into structured jobs.
- Generate parts lists.
- Generate labor estimates.
- Explain uncertainty.

### 3. Matching Model

Responsibilities:

- Rank compatible professionals.
- Consider geography.
- Skills.
- Availability.
- Inventory.
- Job economics.

### 4. Pricing Model

Responsibilities:

- Estimate price ranges.
- Detect anomalies.
- Prevent unreasonable pricing.

### 5. Verification Model

Responsibilities:

- Compare before/after evidence.
- Detect observable completion conditions.
- Flag inconsistencies.

### 6. Conversational Agent

Responsibilities:

- Voice intake.
- Messaging.
- Clarification questions.
- Job updates.
- Customer support triage.

---

# 24. AI Guardrails

The system must:

- Expose confidence levels.
- Avoid claiming certainty from insufficient visual evidence.
- Escalate safety-critical cases.
- Preserve human override.
- Log model decisions.
- Version prompts/models.
- Store relevant evidence for audit.
- Protect private customer media.
- Prevent unauthorized access to professional/customer data.

AI should assist decisions rather than silently making irreversible high-impact decisions.

---

# 25. Security Requirements

## Authentication

- Secure OTP/email authentication.
- JWT/session security.
- Device/session management.
- MFA for administrative users.

## Authorization

Use role-based access control.

Roles:

```text
Customer
Professional
Professional Manager
Operations Agent
Support Agent
Finance Admin
AI Operations Admin
Super Admin
```

## Data Security

- Encryption in transit.
- Encryption at rest.
- Secure object-storage policies.
- Signed media URLs.
- Audit logging.
- Secret management.
- Least-privilege service access.

---

# 26. Privacy Requirements

The platform handles potentially sensitive:

- Home interiors.
- Addresses.
- Voice recordings.
- Images/videos.
- Payment information.
- Property histories.
- Professional identity information.

Requirements:

- Explicit consent for media processing.
- Configurable retention policies.
- Data deletion workflows where legally required.
- Strict access controls.
- Audit logs.
- Privacy-preserving analytics.
- Clear explanation of AI usage.

---

# 27. Marketplace Economics

The supplied concept proposes:

### Transaction Take Rate

A performance-based platform fee on completed, verified transactions rather than upfront lead fees.

### Instant Payout

Optional accelerated payout fee.

### Parts/Marketplace Revenue

Potential affiliate or transaction revenue from parts suppliers.

### Consumer Membership

A recurring HomePass-style subscription can provide:

- Preventative diagnostics.
- Service-fee benefits.
- Maintenance tracking.
- Warranty tracking.
- Priority support/response options.

Exact pricing should be validated through market experiments rather than treated as a fixed requirement.

---

# 28. MVP Scope

The first production MVP should remain focused.

## Consumer

- Authentication.
- Create service request.
- Photo/video upload.
- AI-assisted diagnostic intake.
- SOW.
- Pricing range.
- Professional options.
- Booking.
- Payment.
- Job tracking.
- Reviews.

## Professional

- Onboarding.
- Verification.
- Profile.
- Availability.
- Job offers.
- Accept/reject.
- Navigation.
- Job evidence.
- Completion.
- Earnings.

## Admin

- User management.
- Professional verification.
- Job management.
- Disputes.
- Payments.
- AI monitoring.

## AI MVP

Start with:

1. Plumbing.
2. Handyman.

Expand only after sufficient real-world data and validation.

---

# 29. Post-MVP Roadmap

## Phase 1 — Core Marketplace

- Consumer app.
- Professional app.
- Core backend.
- Booking.
- Payments.
- Initial AI intake.

## Phase 2 — Intelligent Dispatch

- Geospatial matching.
- Professional availability.
- Inventory awareness.
- Route optimization.

## Phase 3 — TrustLock

- Pre-work evidence.
- Post-work verification.
- Automated QA.
- Evidence-based disputes.

## Phase 4 — Ambient Interface

- WhatsApp.
- SMS.
- Voice agent.
- Voice-based booking.

## Phase 5 — HomePass

- Property digital passport.
- Maintenance history.
- Warranty tracking.
- Predictive recommendations.

## Phase 6 — Supply Chain

- Parts integrations.
- Inventory APIs.
- Local supplier routing.
- Automated reservations.

---

# 30. Success Metrics

## Customer

- Request-to-book conversion.
- Time to first qualified option.
- Booking completion rate.
- Customer satisfaction.
- Repeat usage.
- Dispute rate.

## Professional

- Job acceptance rate.
- Job completion rate.
- Earnings per active hour.
- First-visit completion rate.
- Lead-to-job conversion.
- Professional retention.

## Marketplace

- Supply/demand balance.
- Time to match.
- Gross transaction value.
- Completed jobs.
- Take rate.
- Contribution margin.
- Geographic liquidity.

## AI

- Diagnostic confidence.
- Human escalation rate.
- SOW correction rate.
- Verification precision/recall.
- False-positive rate.
- Time to inference.

---

# 31. Example End-to-End Job

### Customer

> "Water is leaking under my bathroom sink."

### Step 1 — Capture

Customer records a short video.

### Step 2 — InspectAI

AI identifies a likely P-trap issue and extracts relevant visual information.

### Step 3 — SOW

System creates:

```text
Service: Plumbing
Likely issue: P-trap component
Parts: P-trap replacement kit
Labor: 30–45 minutes
Estimated price: Dynamic range
Confidence: High
```

### Step 4 — Matching

The platform finds compatible professionals based on:

- Distance.
- Availability.
- Skill.
- Inventory.
- Job economics.

### Step 5 — Booking

Customer selects an available appointment and authorizes payment.

### Step 6 — Execution

Professional arrives and captures baseline evidence.

### Step 7 — Completion

Professional performs repair and submits functional verification evidence.

### Step 8 — TrustLock

The system checks the completion evidence.

### Step 9 — Settlement

Funds are released according to the payment/escrow workflow.

### Step 10 — HomePass

The completed repair is added to the property's service history.

---

# 32. Non-Functional Requirements

## Performance

- Fast request creation.
- Low-latency AI inference where feasible.
- Real-time job state updates.
- Graceful degradation for slow networks.

## Reliability

- Retryable asynchronous jobs.
- Idempotent payment operations.
- Durable event processing.
- Disaster recovery.

## Scalability

Architecture must support:

- Multiple cities.
- Multiple service categories.
- Increasing media volume.
- Increasing professional supply.
- Regional pricing differences.

## Observability

Implement:

- Centralized logs.
- Metrics.
- Distributed tracing.
- AI evaluation dashboards.
- Payment event monitoring.
- Marketplace health monitoring.

---

# 33. Edge Cases

### Low AI Confidence

Escalate to:

- Additional video questions.
- Human review.
- Professional diagnostic visit.

### Hidden Damage

Generate:

- Evidence request.
- Updated SOW.
- Change order.
- Customer approval flow.

### Professional Cancellation

Automatically:

- Re-match.
- Notify customer.
- Preserve existing evidence.

### Customer Cancellation

Apply transparent cancellation policy based on job state.

### Poor Connectivity

Professional app should support local-first evidence capture and later synchronization.

### Payment Failure

Job state must remain recoverable without duplicate charges.

### Verification Failure

Do not automatically treat failure as professional fault. Route to an evidence/review workflow.

---

# 34. Product Principles

1. **AI should reduce friction, not hide complexity.**
2. **Evidence should beat assumptions.**
3. **Professionals should not pay for useless leads.**
4. **Customers should understand what they are paying for.**
5. **The platform should optimize for completed jobs, not generated leads.**
6. **Human escalation must remain available.**
7. **Physical-world services require stronger verification than digital gigs.**
8. **Every completed job should improve the property's future service history.**
9. **The product should work through the user's preferred interface.**
10. **Trust must be designed into the transaction itself.**

---

# 35. Suggested Product Identity

## Product Name

**ForgeLocal**

### Why it fits Volcanic.World

"Forge" communicates:

- Building.
- Repair.
- Transformation.
- Engineering.
- Physical-world execution.
- Strength.

"Local" immediately communicates the marketplace's operating domain.

It also fits the broader **Volcanic** brand language: industrial, engineered, high-energy, and execution-oriented.

### Brand architecture

```text
VOLCANIC.WORLD
│
├── ForgeLocal
│   └── AI-powered local services marketplace
│
├── InspectAI
│   └── Multimodal diagnostic engine
│
├── SmartRoute
│   └── Intelligent professional dispatch
│
├── TrustLock
│   └── Visual verification + settlement
│
└── HomePass
    └── Property service intelligence
```

---

# 36. Final Product Definition

**ForgeLocal is an AI-native operating system for local services.**

It connects:

```text
Customer
   ↓
AI Diagnosis
   ↓
Scope of Work
   ↓
Transparent Pricing
   ↓
Intelligent Matching
   ↓
Professional
   ↓
Verified Execution
   ↓
Settlement
   ↓
Property Memory
```

The long-term objective is not simply to create another service marketplace. The objective is to build the **intelligence and transaction infrastructure for physical-world services**.

---

## Appendix A — Initial Service Categories

### Phase 1

- Plumbing.
- Handyman.

### Phase 2

- Electrical.
- HVAC.
- Appliance repair.
- Painting.
- Carpentry.

### Phase 3

- Roofing.
- Cleaning.
- Landscaping.
- Pest control.
- Moving.
- Home renovation.

Service-category expansion should depend on diagnostic reliability, professional availability, regulatory requirements, and marketplace demand.

---

## Appendix B — Core Domain Entities

```text
User
Property
Professional
ProfessionalSkill
ProfessionalVehicle
InventoryItem
ServiceCategory
ServiceRequest
DiagnosticSession
DiagnosticFinding
ScopeOfWork
PricingEstimate
Job
Booking
JobEvidence
ChangeOrder
Payment
EscrowTransaction
Payout
VerificationResult
Dispute
Review
MaintenanceRecord
Warranty
Notification
AIInference
AuditLog
```

---

## Appendix C — MVP API Domains

```text
/auth
/users
/properties
/professionals
/service-categories
/service-requests
/diagnostics
/sow
/pricing
/matching
/bookings
/jobs
/evidence
/change-orders
/payments
/payouts
/verification
/disputes
/reviews
/maintenance
/notifications
/admin
```

---

**Product:** ForgeLocal  
**Company:** Volcanic.World  
**Document Version:** 1.0  
**Status:** Initial Product Requirements Specification
