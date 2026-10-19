---
name: Manzoma ERP
description: High-Performance Retail POS & Multi-Branch Enterprise ERP Design System
colors:
  primary: "#3B5BFF"
  primary-deep: "#0D1B4A"
  brand-blue: "#2563EB"
  cta-emerald: "#10B981"
  cta-emerald-hover: "#059669"
  accent-cyan: "#00E5FF"
  accent-amber: "#F59E0B"
  neutral-bg: "#FAFBFD"
  neutral-card: "#FFFFFF"
  neutral-card-hover: "#F8FAFC"
  neutral-elevated: "#F1F5F9"
  neutral-border: "#E2E8F0"
  neutral-border-strong: "#CBD5E1"
  text-primary: "#0F172A"
  text-secondary: "#334155"
  text-muted: "#64748B"
  dark-bg: "#0A192F"
  dark-card: "#112240"
  dark-card-hover: "#172A45"
  dark-border: "rgba(255, 255, 255, 0.08)"
  dark-text-primary: "#FAF9FC"
  dark-text-secondary: "#A2A0B3"
typography:
  display:
    fontFamily: "Inter, Cairo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter, Cairo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, Cairo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, Cairo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, Cairo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.02em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.cta-emerald}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.cta-emerald-hover}"
  button-secondary:
    backgroundColor: "{colors.neutral-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "14px 28px"
  badge-status:
    backgroundColor: "{colors.neutral-card}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  card-feature:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.xl}"
    padding: "24px 28px"
---

# Design System: Manzoma ERP

## Overview

**Creative North Star: "The Modern Merchant's High-Tech Command"**

The Manzoma visual system is built for the decisive, fast-paced merchant who demands uncompromising speed, airtight financial control, and modern elegance. It moves away from sterile, drab enterprise accounting tables and outdated blue-gray legacy software toward an energetic, radiant, and reassuring experience. The system blends deep, commanding navy depths (`#0D1B4A`) with electric brand blues (`#3B5BFF`), crisp white functional cards, and high-conversion emerald CTA accents (`#10B981`) that signify profitability and swift action.

Every element is tuned for clarity under high cognitive load: high contrast ratios, generous touch targets, subtle background grid patterns that evoke precision engineering, and luminous focal glow effects. The aesthetic feels like a premier financial terminal crossed with a world-class consumer fintech experience—instantly trustworthy to business owners and effortless for floor staff.

**Key Characteristics:**
- **Decisive Contrast:** Deep navy headers anchor attention; high-contrast typography ensures readability in bright retail sunlight.
- **Luminous Precision:** Ambient radial cyan and violet glows paired with subtle technical grid patterns reflect advanced AI and real-time sync.
- **Tactile Confidence:** High-elevation hover lifts, crisp borders, and purposeful emerald micro-interactions make every action feel responsive and confirmed.
- **RTL-Native Craft:** Layouts, icons, indicators, and animations flow seamlessly from right to left with typographic harmony in both Arabic (Cairo) and Latin (Inter) scripts.

## Colors

The palette balances authoritative deep navy structure with dynamic, high-energy technological accents and a reassuring emerald conversion signal.

### Primary
- **Command Deep Navy** (`#0D1B4A` / `#0F172A`): Represents stability, bank-grade ledger security, and institutional strength. Used for high-impact hero typography, dark mode foundations, and primary header bars.
- **Electric Brand Blue** (`#3B5BFF` / `#2563EB`): The core tech identity. Powers selection rings, active navigation items, interactive indicators, and primary gradient transitions.

### Secondary
- **Profit Emerald** (`#10B981` / `#059669`): The dedicated CTA and conversion color. Reserved exclusively for actionable decisions (starting trials, purchase triggers, live checkout, and positive financial statuses).
- **High-Tech Cyan Glow** (`#00E5FF`): Micro-glows, badge pulses, and text shimmer gradients reflecting live telemetry, offline sync status, and AI insights.

### Tertiary
- **Alert Amber** (`#F59E0B`): Warm, urgent notices for low stock warnings, impending license expirations, and shift discrepancy alerts.
- **Intelligence Violet** (`#8B5CF6`): Dedicated to AI assistant badges, Telegram MCP automations, and advanced data visualization charts.

### Neutral
- **Crisp Page Canvas** (`#FAFBFD`): Pristine, airy background that reduces eye fatigue during extended terminal shifts.
- **Card White** (`#FFFFFF`): Elevated content islands that isolate data and workflows with razor-sharp borders (`#E2E8F0`).
- **Dark Chamber Navy** (`#0A192F` & `#112240`): The signature dark mode palette, maintaining deep contrast without stark, harsh pure-black eye strain.

### Named Rules
**The Single CTA Voice Rule.** Emerald (`#10B981`) is reserved exclusively for the single highest-value action on any viewport. If everything is green, nothing gets clicked. Secondary actions must step down to neutral slate or outlined glass.

**The Ambient Glow Rule.** Luminous radial glows (`blur(150px)`) and cyan text shimmers are used as atmospheric backdrops only; they never sit behind low-contrast body text.

## Typography

**Display Font:** Inter / Cairo (with fallback to ui-sans-serif, system-ui, sans-serif)  
**Body Font:** Inter / Cairo (with fallback to system-ui)  
**Label/Mono Font:** Inter, tabular numbers, monospace

**Character:** Technical, ultra-crisp, and authoritative. Cairo provides wide counters and balanced baseline geometry for Arabic headlines, while Inter provides tight numeric tracking and optical clarity for SKU codes, barcodes, and currency figures.

### Hierarchy
- **Display** (Weight 900, `clamp(2.5rem, 6vw, 4.5rem)`, Line Height 1.1, Letter Spacing `-0.03em`): Hero title lines and primary conversion declarations.
- **Headline** (Weight 800, `clamp(1.75rem, 4vw, 2.5rem)`, Line Height 1.2, Letter Spacing `-0.02em`): Section headings, pricing plan names, and feature category headers.
- **Title** (Weight 700, `1.25rem` / 20px, Line Height 1.4): Card titles, metric labels, dialog headers, and drawer categories.
- **Body** (Weight 400/500, `1rem` / 16px, Line Height 1.6): Feature explanations, marketing descriptions, table cells, and help text.
- **Label** (Weight 700, `0.75rem` / 12px, Letter Spacing `0.02em`): Status badges, table column headers, keyboard shortcuts, and metadata tags.

### Named Rules
**The Tabular Metric Rule.** All financial amounts, quantity counts, and barcode sequences must render with tabular figures (`font-variant-numeric: tabular-nums`) so decimal points align vertically across invoices and data tables.

## Layout

- **Spatial Model:** 8pt spatial grid system (`4px`, `8px`, `16px`, `24px`, `32px`, `48px`, `64px`). All padding, margins, and gaps are strict multiples of 4 or 8.
- **Container Widths:** Standard marketing container is capped at `max-w-7xl` (1280px) with `px-6` horizontal gutter padding. Hero focal containers are centered at `max-w-4xl` (896px).
- **Rhythm & Density:**
  - High density in data-driven portals, dashboards, and pricing tiers (`gap-3` / `p-4`).
  - Generous spatial breathing room on public landing and showcase sections (`py-20 md:py-32`).
- **Responsive Breakpoints:**
  - `sm`: 640px (single column to 2-column mobile layout).
  - `md`: 768px (navigation expands, sidebar mounts).
  - `lg`: 1024px (3-column feature and pricing grid).
  - `xl`: 1280px (full enterprise dashboard split view).

## Elevation & Depth

Manzoma employs **tonal layering and subtle diffuse lift** rather than heavy, opaque dropshadows. In light mode, surfaces rest flat against `#FAFBFD` and elevate upon hover using soft multi-layer ambient dispersion. In dark mode, depth is articulated through progressive luminance (`#0A192F` page → `#112240` cards → `#1F3A60` elevated dropdowns) backed by fine semi-transparent borders.

### Shadow Vocabulary
- **Card Ambient** (`0 1px 3px rgba(15, 23, 42, 0.05), 0 10px 15px -3px rgba(15, 23, 42, 0.04)`): Rest state for feature cards, pricing tables, and interactive panels.
- **Elevated Hover** (`0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`): Applied on card hover with `-translate-y-1` tactile lift.
- **Glow Accent** (`0 0 30px rgba(0, 229, 255, 0.15)`): Applied to focal badges, live indicators, and active subscription cards.
- **Modal Scrim** (`backdrop-blur-md bg-slate-900/40` / dark `bg-black/60`): Focus lock for lead capture and download dialogs.

### Named Rules
**The Flat-At-Rest Rule.** Interactive cards and buttons must sit calm at rest with subtle 1px border containment. Shadows bloom only upon mouse hover or focus-visible state to signal readiness.

## Shapes

- **Corner Strategy:**
  - Small Controls (Badges, tags, pills): `rounded-full` (9999px) for friendly, human status labels.
  - Interactive Elements (Buttons, text inputs, selects): `rounded-xl` (12px) to feel substantial and finger-friendly.
  - Surface Containers (Cards, pricing tiers, modals): `rounded-2xl` (16px) or `rounded-3xl` (24px) with continuous curvature.
- **Border Treatment:**
  - 1px crisp borders (`border-slate-200` in light, `rgba(255, 255, 255, 0.08)` in dark).
  - Active/Focus borders transition smoothly to brand blue (`border-[#3B5BFF]`) with an accompanying `ring-4 ring-[#3B5BFF]/10`.

## Components

### Buttons
- **Primary Action (CTA):**
  - **Background:** `#10B981` (Profit Emerald) with smooth hover to `#059669`.
  - **Text:** Bold white (`#FFFFFF`), `14px / 16px`, weight 700.
  - **Shape:** `rounded-xl` or `rounded-full`, padding `14px 28px`.
  - **Interaction:** Hover triggers `transform: translateY(-2px)` and shadow expansion over 200ms ease.
- **Secondary / Ghost:**
  - **Background:** Transparent or `bg-white dark:bg-[#112240]`.
  - **Border:** `1px solid #E2E8F0` / dark `rgba(255, 255, 255, 0.1)`.
  - **Text:** `#0F172A` / dark `#FAF9FC`, weight 600.
  - **Hover:** `bg-slate-50 dark:bg-white/5`.

### Status Badges & Pills
- **Shape:** `rounded-full`, padding `6px 16px`.
- **Style:** White background with subtle border, featuring a 6px pulsing color dot (`bg-brand-emerald animate-pulse`) and 12px bold microcopy.

### Feature & Metric Cards
- **Corner Style:** `rounded-2xl` (16px) or `rounded-3xl` (24px).
- **Background:** Pure `#FFFFFF` in light; `#112240` in dark.
- **Border:** 1px `border-slate-100` / dark `border-white/10`.
- **Internal Padding:** `p-6` to `p-8`.
- **Hover:** Border shifts to brand-blue accent, with soft elevation lift.

### Input Fields & Controls
- **Style:** Height 48px, padding `12px 16px`, `rounded-xl`, background `#FFFFFF` / dark `#0A192F`.
- **Focus:** 1px `border-[#3B5BFF]` with 4px soft ring `rgba(59, 91, 255, 0.15)`. No default outline.

### Navigation Header
- **Style:** Sticky/fixed, `h-20`, centered container with floating pill design or full-width blur strip (`backdrop-blur-md bg-white/80 dark:bg-[#0A192F]/80`).
- **Links:** 14px weight 600, transitions to brand blue on hover, with a subtle active dot indicator.

## Do's and Don'ts

### Do:
- **Do** use standard SVG icons (Lucide React) with a consistent 20px / 24px stroke across all cards and buttons.
- **Do** maintain RTL-first alignment for all Arabic content, placing chevron indicators on the left (`ChevronLeft`) to reflect forward progression.
- **Do** enforce tabular numbers (`tabular-nums`) on all invoice prices, quantities, and barcode displays.
- **Do** test light mode and dark mode side-by-side to guarantee WCAG AA contrast ($\ge 4.5:1$).
- **Do** respect `prefers-reduced-motion` by disabling float keyframes and large scale animations for sensitive users.

### Don't:
- **Don't** use emojis as interface icons (e.g. 🚀, 💰, 📦). Always use dedicated Lucide SVG icons.
- **Don't** create pure black backgrounds (`#000000`). Use rich deep navy tones (`#0A192F` and `#112240`) to preserve depth and reduce glare.
- **Don't** place green CTA colors on secondary or cancel actions. Green is exclusively for positive conversion.
- **Don't** allow layout shifts on hover. Never scale card dimensions; only transform `translateY` or animate shadows and borders.
- **Don't** hide critical business proof (offline status, encryption, live sync) behind ambiguous generic marketing slogans.
