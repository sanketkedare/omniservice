# OmniService AI — Design System & Visual Specification

> **Company:** Volcanic.World  
> **Brand Identity:** OmniService AI  
> **Aesthetic Philosophy:** Editorial Warmth, Industrial Precision & Emergent Immersion

---

## 1. Color System: Volcanic Orange & Warm Ember Palette

The interface is built around a curated warm palette centered on **Volcanic Orange and its variants**, completely eliminating cold dark navy blues and sterile stark white backgrounds.

### 1.1 Primary Brand (Volcanic Orange & Variants)
- **Volcanic Orange (Primary Accent)**: `#F05A28`
  - Used for primary action buttons, active navigation pills, brand badges, and key interactive highlights.
  - Box shadow token: `shadow-orange-500/25` / `shadow-orange-500/35`.
- **Vibrant Coral (Interactive Hover / Gradient Stop)**: `#EA580C`
  - Used for button gradient pairs (`from-[#f05a28] to-[#ea580c]`) and active icons.
- **Burnished Terracotta (Subtle Headings & Borders)**: `#C2410C`
  - Used for editorial subheadings, secondary CTA borders, and high-legibility accent text.
- **Deep Espresso Ember (High-Contrast Grounding)**: `#2D130A`
  - Primary text color for monumental headings, card titles, and high-contrast editorial statements.
- **Volcanic Dark Anchor (Footer & Table Headers)**: `#1F100A` / `#170C08` / `#120805`
  - Deep volcanic ember base used for the footer and comparison matrix header, providing a stable visual anchor.

### 1.2 Canvas & Neutral Surfaces (Warm Peach & Honey)
Stark bleached white (`#FFFFFF`) is replaced by warm, tactile surfaces that prevent eye fatigue and create editorial richness:
- **Primary Canvas**: `#FFFAF5` (Soft warm peach off-white canvas)
- **Secondary Surface / Card Fill**: `#FFF7ED` (Warm honey tint for interactive cards and tab pills)
- **Tertiary Accent Wash**: `#FFF0E6` (Soft amber-tinted background for active selections)
- **Crisp Surface**: `#FFFFFF` with `backdrop-blur-xl` for elevated glassmorphic cards
- **Border Gradients**: `border-orange-200/80` and `border-orange-300/70`

### 1.3 Semantic Indicators
- **TrustLock Verified (Escrow Released)**: `#16A34A` / Emerald 600
- **SmartRoute Pending (Escrow Locked)**: `#D97706` / Amber 600
- **Dispute / High Alert**: `#DC2626` / Red 600
- **InspectAI Neural Diagnostic**: `#F05A28` / Volcanic Orange 500

---

## 2. Typography & Font Hierarchy

- **Editorial Body & Headings**: **Times New Roman** (`font-serif`, `Times`, `Liberation Serif`, `serif`)
  - Conveys institutional permanence, legal trustworthiness (escrow and contracts), and editorial gravitas.
  - Headings: `font-extrabold` or `font-bold` with tracking tight (`tracking-tight`).
- **Financial & Diagnostic Telemetry**: **Monospace** (`ui-monospace`, `JetBrains Mono`, `font-mono`)
  - Used for INR rupee amounts (`₹2,800`), vehicle license plates (`TS-09-UB-4120`), cryptographic proof tokens (`TL-PROOF-7F89B2`), and serial numbers.

---

## 3. Emergent Atmosphere & Micro-Animations

The interface incorporates an emergent, living environment that feels responsive and deep without introducing layout thrash or CPU overhead:

### 3.1 Keyframe Animations (`src/app/globals.css`)
```css
@keyframes floatSlow {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-15px) scale(1.03);
  }
}

.animate-float-slow {
  animation: floatSlow 12s ease-in-out infinite;
}

.animate-float-delayed {
  animation: floatSlow 15s ease-in-out 3s infinite;
}
```

### 3.2 Visual Utility Classes
- **`.emergent-mesh`**: Soft multi-stop radial gradient canvas incorporating diffused amber (`amber-400/15`) and volcanic orange (`#f05a28/10`) blurs.
- **`.orange-halo`**: Soft radial illumination overlay that highlights glassmorphic cards on hover.
- **Floating Ambient Orbs**: Embedded behind Hero, Auth split layout, and Portal dashboards to create visual depth and motion.

---

## 4. Responsive Container Architecture (`max-w-7xl mx-auto`)

To prevent visual degradation and horizontal drift on ultra-wide and 4K displays:
1. **Outer Shells (`w-full`)**: Extend full width across the browser window with edge-to-edge backgrounds, border dividers, and gradient washes.
2. **Inner Content Wrappers (`max-w-7xl mx-auto px-6 sm:px-10 lg:px-12`)**:
   - Standardized maximum content width of 1280px (`max-w-7xl`).
   - Symmetrically centered (`mx-auto`) with responsive padding.
   - Preserves optimal readability line-lengths and grid alignments.
3. **Focused Forms (`max-w-4xl mx-auto`)**:
   - Single-purpose forms (intake diagnostic, registration, profile settings) use a narrower container for focused task completion.

---

## 5. Universal Component Catalog

| Component | File Path | Variants / Capabilities |
| :--- | :--- | :--- |
| **`Toast`** | `@/components/ui/Toast` | Universal enterprise toaster supporting `.loading()`, `.success()`, `.error()`, `.info()`, `.warning()`, and interactive `.confirm()` modals with custom action callbacks. |
| **`Button`** | `@/components/ui/Button` | `brand` (orange gradient), `outline`, `ghost`, `secondary`, `destructive`, with loading spinners and left/right icon slots. |
| **`Card`** | `@/components/ui/Card` | Default, glassmorphism, subtle, and bordered variants with `CardHeader`, `CardTitle`, `CardDescription`, and `CardContent`. |
| **`Badge`** | `@/components/ui/Badge` | `brand`, `success`, `warning`, `destructive`, `info`, `outline`, with optional pulsing status dots (`dot`). |
| **`Input`** | `@/components/ui/Input` | Floating labels, masked placeholders (`+91 98XXX XXXXX`), icon slots, focus rings in warm orange. |
| **`Dialog`** | `@/components/ui/Dialog` | Accessible modal dialog with backdrop blur, scroll locking, and escape key listener. |
| **`Avatar`** | `@/components/ui/Avatar` | Client component with image fallback to initials and online/busy indicator dots. |
| **`PageHeader`**| `@/components/shared/PageHeader`| Breadcrumb navigation, monumental title, descriptive subtitle, and action slot. |
| **`TopBar`** | `@/components/layout/TopBar` | Responsive header with brand logo, demo portal switcher, notifications, and profile menu. |
| **`CustomerNav`**| `@/components/layout/CustomerNav`| Fixed mobile bottom navigation with active volcanic orange states and badge counters. |
| **`ProfessionalNav`**| `@/components/layout/ProfessionalNav`| Mobile bottom navigation for technicians with real-time lead indicators. |

---

## 6. Design Constraints & Standards

1. **No Developer Jargon in Consumer Views**: Avoid terms like "256-bit Encrypted" or "InspectAI v1.0 Live" in user-facing views; use trust-focused copy like *"Fiduciary Escrow Guarantee"* and *"Verified Local Network"*.
2. **Masked Form Placeholders**: All telephone and email form placeholders must use realistic masked strings (`+91 98XXX XXXXX`, `name@example.com`).
3. **Color Discipline**: Avoid introducing arbitrary blues or purples; all brand emphasis must stay strictly aligned with the Volcanic Orange and espresso ember family.
4. **Editorial Typography**: Maintain Times New Roman font family across all primary views.
