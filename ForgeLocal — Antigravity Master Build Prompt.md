# FORGELOCAL — ENTERPRISE PRODUCT BUILD MASTER PROMPT

You are the **Lead Product Architect, Principal Full-Stack Engineer, UI/UX Engineer, AI Systems Architect, DevOps Engineer, Security Engineer, and Technical Product Manager** responsible for designing and implementing an enterprise-grade application called **ForgeLocal** for **Volcanic.World**.

The goal is NOT to create a simple demo, landing page, mockup, or CRUD application.

The goal is to architect and progressively build a **production-ready, enterprise-grade, AI-native local services marketplace** with a mobile-first premium experience and a scalable backend architecture.

---

# 1. SOURCE OF TRUTH — READ EVERYTHING FIRST

Before writing or modifying any code:

1. Read the supplied ForgeLocal/OmniService Markdown specification completely.
2. Read the entire README if one exists.
3. Inspect every image supplied in the project assets folder.
4. Inspect both:
   - `ForgeLocal_icon`
   - `ForgeLocal_logo`
5. Understand the product architecture, workflows, terminology, business model, AI modules, TrustLock, InspectAI, SmartRoute, HomePass, professional workflows, customer workflows, payments, verification, disputes, and roadmap.
6. Do NOT replace the product concept with a generic marketplace.
7. Do NOT simplify the architecture into a basic marketplace.
8. Preserve the terminology and concepts defined in the source documentation.
9. If there is ambiguity, document the assumption before implementing it.
10. Never silently remove an existing documented feature.

The supplied Markdown specification is the primary product source of truth.

---

# 2. PRODUCT IDENTITY

## Company

Volcanic.World

## Product

ForgeLocal

## Domain

`forgelocal.volcanic.world`

## Product Category

AI-native local services marketplace / physical-world service operating platform.

## Core Product Philosophy

ForgeLocal should not feel like:

- a generic service directory
- a basic booking application
- a Fiverr clone
- a simple Urban Company clone
- a basic contractor listing website

ForgeLocal should feel like an **AI-powered operating system for local services**.

The platform connects:

```text
Customer
    ↓
Multimodal Problem Intake
    ↓
AI Diagnostic Intelligence
    ↓
Scope of Work
    ↓
Transparent Pricing
    ↓
Intelligent Professional Matching
    ↓
Booking
    ↓
Professional Execution
    ↓
Visual Verification
    ↓
Settlement
    ↓
Property Service Memory
```

---

# 3. BRAND & VISUAL DIRECTION

The supplied ForgeLocal icon and logo are the visual source of truth.

Use them consistently throughout the application.

The visual language should align with the Volcanic.World ecosystem.

## Theme

**Light theme only for the initial product experience.**

Do NOT create a generic white SaaS dashboard.

The interface should feel:

- premium
- engineered
- trustworthy
- modern
- intelligent
- sophisticated
- clean
- tactile
- high-end
- enterprise-grade

Use strong visual hierarchy and excellent typography.

## Brand characteristics

Use:

- graphite / charcoal
- white
- warm volcanic orange
- subtle amber
- neutral gray
- controlled gradients
- subtle borders
- sophisticated shadows
- occasional glass/layered surfaces
- high-quality iconography

Do not overuse orange.

Orange should function as an intentional brand/action accent.

---

# 4. MOBILE-FIRST REQUIREMENT

The application MUST be designed mobile-first.

Do not design desktop first and shrink it down.

Primary experience:

```text
Mobile
↓
Tablet
↓
Desktop
↓
Large Desktop
```

The consumer workflow should feel natural on a phone.

Important mobile UX:

- bottom navigation
- thumb-friendly actions
- large touch targets
- camera-first service request
- swipeable cards
- bottom sheets
- mobile-friendly forms
- sticky CTAs
- contextual action bars
- fast transitions
- skeleton loading
- excellent empty states
- responsive media handling

Desktop should progressively enhance the mobile architecture.

---

# 5. TECHNOLOGY REQUIREMENTS

Use the latest stable version of:

## Frontend

- Next.js
- App Router
- TypeScript
- React
- Tailwind CSS

Use:

```text
src/
```

as the primary application source directory.

Do NOT create an unnecessary legacy `/pages` architecture.

---

# 6. DATABASE

Use:

## MongoDB + Mongoose

Mongoose must be used for:

- schemas
- models
- validation
- indexes
- relationships/reference patterns
- database access layer

Create a proper database architecture.

Do NOT build the application around in-memory mock data.

Development seed data may exist, but production architecture must be database-backed.

---

# 7. FILE STORAGE

Use **Filebase** for object/media storage.

Do NOT use Firebase Admin.

Use Filebase/S3-compatible object storage for:

- customer videos
- customer images
- professional verification documents
- job evidence
- before/after media
- property documents
- AI diagnostic media
- service completion media

Design a proper storage abstraction so the storage provider can be replaced later without rewriting business logic.

---

# 8. ENVIRONMENT VARIABLES

Create:

```text
.env.local
```

for local development.

Also create:

```text
.env.example
```

containing safe placeholders only.

Never hardcode:

- database credentials
- API keys
- JWT secrets
- storage credentials
- AI keys
- payment credentials
- private URLs
- service secrets

Create a centralized environment configuration module.

Example architecture:

```text
src/
  config/
    env.ts
```

Validate environment variables at application startup.

Fail fast when required production variables are missing.

---

# 9. PROJECT STRUCTURE

Use a clean enterprise architecture.

Recommended direction:

```text
/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── modules/
│   ├── services/
│   ├── models/
│   ├── repositories/
│   ├── lib/
│   ├── config/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── validations/
│   ├── constants/
│   └── ...
│
├── public/
│   ├── images/
│   └── icons/
│
├── docs/
├── skills/
├── scripts/
├── tests/
├── .env.local
├── .env.example
├── README.md
├── package.json
└── ...
```

IMPORTANT:

All project documentation and product reference images requested by the user must remain in the **root-level project area**.

Do not scatter documentation throughout the source tree.

Keep application source code inside `src/`.

---

# 10. DOCUMENTATION RULE

Documentation is a first-class deliverable.

Do NOT treat documentation as something to write at the end.

Maintain documentation continuously throughout all phases.

At minimum maintain:

```text
README.md

docs/
├── PRODUCT_REQUIREMENTS.md
├── ARCHITECTURE.md
├── SYSTEM_DESIGN.md
├── DATABASE.md
├── API.md
├── AUTHENTICATION.md
├── SECURITY.md
├── STORAGE.md
├── AI_ARCHITECTURE.md
├── MARKETPLACE.md
├── PAYMENT_ARCHITECTURE.md
├── TRUSTLOCK.md
├── INSPECT_AI.md
├── SMARTROUTE.md
├── HOMEPASS.md
├── UX_ARCHITECTURE.md
├── DESIGN_SYSTEM.md
├── SEO.md
├── TESTING.md
├── DEPLOYMENT.md
├── OBSERVABILITY.md
├── ADR.md
├── CASE_STUDIES.md
├── ROADMAP.md
└── PHASE_STATUS.md
```

Do not create duplicate documentation with conflicting information.

If architecture changes, update the corresponding documentation.

---

# 11. README REQUIREMENT

The README must remain production-quality.

It should contain:

- Product overview
- Volcanic.World context
- Product philosophy
- Core features
- Architecture
- Tech stack
- Repository structure
- Environment setup
- Local development
- Database setup
- Filebase setup
- Authentication
- Testing
- Deployment
- Environment variables
- AI architecture
- Marketplace architecture
- Case studies
- Roadmap
- Current implementation status

The README must accurately represent the current implementation.

Never claim a feature is implemented if it is only planned.

Use clear statuses:

```text
Implemented
Partially Implemented
Planned
Experimental
```

---

# 12. CASE STUDY REQUIREMENT

Maintain a dedicated case-study document.

The primary case study should be:

## Leaking Bathroom Drain Line

Maintain the complete end-to-end scenario:

```text
Customer submits video
        ↓
InspectAI analyzes problem
        ↓
Diagnostic confidence
        ↓
SOW generated
        ↓
Parts identified
        ↓
Labor estimate
        ↓
Pricing range
        ↓
Professional matching
        ↓
Inventory verification
        ↓
Booking
        ↓
Professional arrival
        ↓
Baseline evidence
        ↓
Repair
        ↓
Post-work video
        ↓
TrustLock verification
        ↓
Payment settlement
        ↓
HomePass update
```

The UI should eventually be capable of representing this case study as an actual product workflow.

Do not remove the case study from the documentation.

---

# 13. DESIGN SYSTEM

Create a reusable design system before building large numbers of screens.

Define:

- typography
- colors
- spacing
- radii
- shadows
- borders
- elevation
- icon sizing
- buttons
- inputs
- cards
- badges
- alerts
- bottom sheets
- dialogs
- navigation
- tables
- charts
- loading states
- empty states
- error states

Use Tailwind CSS tokens/configuration appropriately.

Avoid random one-off styling.

Create reusable components.

---

# 14. ICONOGRAPHY

Use icons throughout the application.

Prefer a consistent professional icon system.

Use icons for:

- navigation
- service categories
- status
- actions
- diagnostics
- payments
- professional tools
- property information
- verification
- alerts
- settings

Do not use emojis as UI icons.

Use meaningful icon + text combinations where appropriate.

---

# 15. ANIMATION

Animations are encouraged but must remain premium and purposeful.

You may use:

- Framer Motion / Motion
- ReactBits
- CSS transitions
- micro-interactions
- subtle parallax
- animated status indicators
- shared-layout transitions
- skeleton animations
- modal transitions
- page transitions

Use animation to communicate:

- state
- hierarchy
- progress
- feedback
- intelligence
- trust

Do NOT create:

- excessive bouncing
- distracting effects
- slow page transitions
- animation everywhere

The product must remain fast.

---

# 16. REACTBITS

ReactBits may be used where it improves the experience.

Before adding a ReactBits component:

1. Check whether it fits the product.
2. Adapt it to the ForgeLocal design system.
3. Do not allow the component to visually overpower the product.
4. Keep accessibility and performance in mind.

Do not use ReactBits merely because it looks impressive.

---

# 17. CORE PRODUCT MODULES

Architect the application around these modules.

## Customer

- Authentication
- Dashboard
- Properties
- Service requests
- AI diagnosis
- SOW
- Pricing
- Professional matching
- Booking
- Payments
- Job tracking
- Evidence
- Reviews
- Disputes
- HomePass
- Maintenance

## Professional

- Onboarding
- Verification
- Profile
- Skills
- Availability
- Job feed
- AI agent preferences
- Inventory
- Route
- Job execution
- Evidence
- Earnings
- Payouts
- Customer communication

## Admin / Operations

- Dashboard
- Customers
- Professionals
- Jobs
- Marketplace
- Verification
- Disputes
- Payments
- AI monitoring
- Analytics
- System configuration
- Audit logs

---

# 18. AI MODULES

Create architecture boundaries for:

### InspectAI

Multimodal diagnostic intelligence.

### SmartRoute

Professional matching and route intelligence.

### TrustLock

Visual proof-of-work verification.

### HomePass

Property intelligence and maintenance history.

### Conversational AI

Voice/WhatsApp/SMS service intake.

AI modules must be independently testable and replaceable.

Do not tightly couple AI provider-specific code to business logic.

Create provider abstractions.

---

# 19. API ARCHITECTURE

Use a structured API architecture.

Example:

```text
/api/auth
/api/users
/api/properties
/api/professionals
/api/service-categories
/api/service-requests
/api/diagnostics
/api/sow
/api/pricing
/api/matching
/api/bookings
/api/jobs
/api/evidence
/api/change-orders
/api/payments
/api/payouts
/api/verification
/api/disputes
/api/reviews
/api/maintenance
/api/notifications
/api/admin
```

Implement:

- validation
- authentication
- authorization
- rate limiting strategy
- error handling
- structured responses
- logging
- request IDs
- pagination
- filtering
- sorting
- idempotency where necessary

---

# 20. SECURITY

Treat this as an enterprise application.

Implement architecture for:

- RBAC
- authentication
- authorization
- secure sessions/tokens
- request validation
- rate limiting
- CSRF strategy where applicable
- XSS prevention
- injection protection
- secure headers
- secure media access
- signed URLs
- audit logging
- secret management
- input sanitization
- API abuse protection
- secure file uploads

Never trust client-side validation.

All important business rules must be validated server-side.

---

# 21. DATABASE REQUIREMENTS

Create proper Mongoose models.

Core entities:

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

Create indexes based on actual query patterns.

Do not create indexes blindly.

Document important indexing decisions.

---

# 22. OBSERVABILITY

Enterprise architecture must include observability planning.

Design for:

- structured logging
- request tracing
- API metrics
- database metrics
- job processing metrics
- AI inference metrics
- payment event monitoring
- storage failures
- marketplace health
- error tracking

Every major production workflow should be diagnosable.

---

# 23. SEO

The public ForgeLocal website must be optimized for:

```text
https://forgelocal.volcanic.world
```

Implement:

- metadata
- title templates
- Open Graph
- Twitter/X metadata
- canonical URLs
- robots.txt
- sitemap
- structured data
- semantic HTML
- accessible headings
- image optimization
- performance optimization
- internal linking
- service/category SEO architecture

Use Next.js SEO capabilities properly.

Do not keyword-stuff.

The public marketing pages should be indexable.

Authenticated application pages should be appropriately protected from indexing.

---

# 24. PERFORMANCE

Target production-grade performance.

Pay attention to:

- Core Web Vitals
- bundle size
- image optimization
- lazy loading
- code splitting
- server components
- caching
- database query optimization
- API latency
- media upload performance
- optimistic UI where appropriate

Avoid unnecessary client components.

Use Server Components wherever appropriate.

Use Client Components only where interactivity requires them.

---

# 25. ACCESSIBILITY

Build with accessibility from the beginning.

Target WCAG-aligned practices.

Include:

- keyboard navigation
- focus states
- semantic HTML
- aria labels where required
- sufficient contrast
- reduced motion support
- screen-reader compatibility
- accessible dialogs
- accessible forms
- accessible error states

---

# 26. TESTING

Create a serious testing strategy.

Include:

## Unit tests

- services
- utilities
- validation
- business rules

## Integration tests

- API
- database
- authentication
- payments
- storage

## E2E tests

Critical flows:

```text
Customer registration
Service request
Diagnostic workflow
Booking
Professional acceptance
Job completion
Verification
Payment settlement
Dispute
```

Do not write tests merely for coverage numbers.

Prioritize business-critical workflows.

---

# 27. 10-PHASE IMPLEMENTATION PLAN

Before implementing Phase 1, create a detailed plan for all 10 phases.

Each phase must contain:

```text
Phase Objective
Business Goal
User Stories
UX Requirements
Technical Requirements
Architecture
Database Changes
API Changes
Frontend Changes
Backend Changes
AI Changes
Security Requirements
Testing Requirements
Performance Requirements
Documentation Updates
Definition of Done
Dependencies
Risks
Rollback Strategy
```

Do NOT start blindly coding.

First generate:

```text
docs/PHASE_PLAN.md
```

with all 10 phases.

---

# PHASE 1 — FOUNDATION & DESIGN SYSTEM

Build:

- Next.js foundation
- App Router
- TypeScript
- Tailwind
- Design tokens
- Typography
- Icon system
- Core layout
- Responsive system
- Navigation architecture
- Environment system
- Error boundaries
- Loading states
- Initial MongoDB/Mongoose architecture
- Filebase abstraction
- Logging foundation
- Testing foundation
- CI-ready project structure

Deliver:

- working application shell
- design system
- project architecture
- documentation

---

# PHASE 2 — CUSTOMER EXPERIENCE

Build:

- authentication
- customer dashboard
- profile
- property management
- service request creation
- camera/media workflow
- service category discovery
- request tracking

Focus heavily on mobile UX.

---

# PHASE 3 — INSPECTAI

Build architecture for:

- media ingestion
- diagnostic sessions
- AI inference abstraction
- diagnostic findings
- confidence scores
- risk flags
- SOW generation

Implement provider-independent AI interfaces.

---

# PHASE 4 — MARKETPLACE & SMARTROUTE

Build:

- professional profiles
- skill matching
- location matching
- availability
- job matching
- route intelligence architecture
- professional job offers
- customer booking options

---

# PHASE 5 — PROFESSIONAL APPLICATION

Build the professional experience:

- onboarding
- verification
- dashboard
- job management
- availability
- inventory
- route
- job execution
- evidence capture
- earnings

---

# PHASE 6 — PAYMENTS & TRUSTLOCK

Build:

- payment architecture
- escrow state machine
- payout architecture
- job evidence
- pre-work baseline
- completion evidence
- verification
- change orders
- dispute foundation

All financial state transitions must be auditable.

---

# PHASE 7 — HOMEPASS

Build:

- property digital passport
- service history
- appliance records
- warranty records
- maintenance timeline
- predictive-maintenance architecture
- property intelligence UI

---

# PHASE 8 — AMBIENT SERVICES

Build architecture for:

- WhatsApp
- SMS
- voice
- conversational intake
- AI service assistant
- notification orchestration

The system should eventually allow customers to create and track jobs without opening the main application.

---

# PHASE 9 — ADMIN, OPERATIONS & ANALYTICS

Build:

- admin dashboard
- professional verification
- marketplace monitoring
- jobs
- disputes
- payments
- AI monitoring
- analytics
- audit logs
- system configuration

---

# PHASE 10 — PRODUCTION HARDENING

Perform a complete production-readiness pass.

Review:

- architecture
- security
- performance
- accessibility
- SEO
- testing
- database indexes
- API validation
- error handling
- logging
- observability
- media security
- environment variables
- deployment
- documentation
- edge cases
- responsive behavior

Remove:

- placeholder implementations
- dead code
- temporary mock logic
- fake production claims
- unnecessary dependencies
- console debugging
- duplicated components
- inconsistent styling

The application should be ready for serious production deployment.

---

# 28. SKILLS / AGENT WORKFLOWS

Create multiple reusable project skills under:

```text
skills/
```

At minimum create:

```text
skills/
├── architecture/
├── frontend/
├── backend/
├── database/
├── ui-ux/
├── ai/
├── security/
├── testing/
├── seo/
├── performance/
├── documentation/
└── production-readiness/
```

Each skill should contain clear instructions for the agent.

Examples:

```text
skills/frontend/SKILL.md
skills/backend/SKILL.md
skills/database/SKILL.md
skills/security/SKILL.md
skills/testing/SKILL.md
```

Skills should help future development remain consistent with the architecture.

---

# 29. DEVELOPMENT WORKFLOW

For every phase:

```text
1. Read existing documentation.
2. Inspect current implementation.
3. Create/update architecture plan.
4. Identify dependencies.
5. Implement.
6. Test.
7. Review.
8. Fix issues.
9. Update documentation.
10. Update README.
11. Update CASE_STUDIES.md where relevant.
12. Update PHASE_STATUS.md.
13. Perform regression check.
14. Move to the next phase only when Definition of Done is satisfied.
```

Never assume that a feature is complete because the UI exists.

A feature is complete only when:

```text
UI
+
API
+
Business Logic
+
Database
+
Validation
+
Security
+
Error Handling
+
Testing
+
Documentation
```

are appropriately addressed.

---

# 30. DESIGN QUALITY BAR

The UI must feel like a serious funded product.

Avoid:

- generic dashboard templates
- excessive rounded cards
- random gradients
- inconsistent spacing
- excessive glassmorphism
- cheap-looking shadows
- unnecessary neon effects
- emoji UI
- placeholder icons
- generic stock illustrations
- overly dense screens

Prefer:

- strong typography
- precise spacing
- sophisticated cards
- subtle elevation
- premium iconography
- meaningful micro-interactions
- excellent information hierarchy
- elegant empty states
- purposeful animation
- polished mobile navigation
- clear CTAs

---

# 31. PRODUCT EXPERIENCE

Every major interaction should answer:

### What is happening?

### Why is it happening?

### What should the user do next?

### What happens after they do it?

The application should never leave users wondering what state a job is in.

Use clear states such as:

```text
Analyzing
Awaiting Confirmation
Finding Professionals
Professional Confirmed
Professional En Route
Arrived
In Progress
Verification Required
Verified
Payment Processing
Completed
Disputed
Resolved
```

---

# 32. DATA & STATE MANAGEMENT

Choose state-management architecture based on actual requirements.

Do not introduce libraries without a reason.

Separate:

```text
Server State
Client UI State
Form State
Session State
Real-Time State
```

Avoid putting everything into one global store.

---

# 33. ERROR HANDLING

Every important workflow must have:

- loading state
- success state
- empty state
- error state
- retry state
- offline/degraded state where appropriate

Errors must be:

- understandable
- actionable
- logged
- traceable

Never show raw server errors to users.

---

# 34. MEDIA ARCHITECTURE

Design media handling carefully.

Large videos must NOT simply pass through the application server unnecessarily.

Use an architecture based on:

```text
Client
 ↓
Upload Authorization
 ↓
Filebase/S3-Compatible Storage
 ↓
Object Reference
 ↓
Background Processing
 ↓
AI Pipeline
 ↓
Diagnostic Result
```

Use secure access patterns for private media.

---

# 35. BUSINESS LOGIC PRINCIPLES

The system should optimize for:

```text
Completed Jobs
+
Verified Quality
+
Customer Trust
+
Professional Economics
```

Not simply:

```text
Number of Leads
```

Professionals should not be charged merely because a customer submitted an inquiry.

The marketplace should align platform revenue with successful transactions.

---

# 36. NO FAKE IMPLEMENTATION

Do not create fake production behavior such as:

```typescript
const fakeProfessionals = [...]
```

and present it as a production feature.

If a real external integration is not available:

1. Create a proper provider interface.
2. Create a development adapter.
3. Clearly label it as development/mock.
4. Document the production integration requirement.
5. Do not contaminate the architecture with temporary shortcuts.

---

# 37. CODE QUALITY

Follow modern TypeScript best practices.

Require:

- strict TypeScript
- meaningful naming
- small focused modules
- reusable components
- separation of concerns
- clean dependency boundaries
- typed API contracts
- schema validation
- proper error types
- consistent imports
- no unnecessary abstractions
- no premature optimization

Avoid giant components.

Avoid giant service files.

Avoid business logic inside UI components.

---

# 38. ARCHITECTURE DECISIONS

Whenever you make an important architectural decision, document it.

Use:

```text
docs/ADR.md
```

Each ADR should contain:

```text
Decision
Context
Options Considered
Chosen Approach
Reason
Trade-offs
Consequences
```

---

# 39. ROOT DIRECTORY CLEANLINESS

The root should remain organized.

Required root-level product assets/documentation should remain accessible.

Do NOT create random files such as:

```text
test-final-final.ts
new-ui.tsx
backup2/
old/
temp/
demo/
```

Clean temporary files immediately.

---

# 40. FINAL ACCEPTANCE CRITERIA

The project is successful only when:

### Product

- ForgeLocal clearly communicates its unique product proposition.
- End-to-end customer workflow exists.
- End-to-end professional workflow exists.
- Admin/operations architecture exists.

### UI

- Mobile-first.
- Premium light theme.
- Consistent ForgeLocal branding.
- Responsive.
- Accessible.
- Animated where useful.

### Architecture

- Latest stable Next.js.
- App Router.
- TypeScript.
- `src/` architecture.
- MongoDB.
- Mongoose.
- Filebase storage.
- Proper service/module boundaries.
- Environment configuration.

### Engineering

- Production-grade validation.
- Authentication.
- Authorization.
- Error handling.
- Testing.
- Logging.
- Observability.
- Security architecture.

### AI

- InspectAI architecture.
- SmartRoute architecture.
- TrustLock architecture.
- HomePass intelligence architecture.
- Provider abstraction.
- Confidence/uncertainty handling.

### Documentation

- README maintained.
- PRD maintained.
- Architecture maintained.
- Case study maintained.
- Phase plan maintained.
- Phase status maintained.
- ADR maintained.
- Skills maintained.

### SEO

- `forgelocal.volcanic.world`
- metadata
- sitemap
- robots
- structured data
- canonical URLs
- Open Graph
- performance optimization

---

# 41. MOST IMPORTANT EXECUTION RULE

**Do not rush into implementation.**

First:

```text
READ
↓
UNDERSTAND
↓
AUDIT
↓
ARCHITECT
↓
PLAN 10 PHASES
↓
DEFINE DESIGN SYSTEM
↓
DEFINE DOMAIN MODEL
↓
DEFINE MODULE BOUNDARIES
↓
IMPLEMENT PHASE 1
↓
TEST
↓
DOCUMENT
↓
IMPLEMENT PHASE 2
↓
...
↓
PHASE 10
↓
PRODUCTION READINESS AUDIT
```

At the beginning, produce a detailed implementation plan before making major code changes.

At the end of every phase, provide:

```text
Phase Completed
Features Implemented
Files Added
Files Modified
Architecture Changes
Database Changes
API Changes
Tests Added
Documentation Updated
Known Limitations
Next Phase
```

Do not skip documentation.

Do not skip testing.

Do not skip architecture.

Do not downgrade the project into a simple prototype.

Build **ForgeLocal as an enterprise-grade Volcanic.World product from the foundation upward.**