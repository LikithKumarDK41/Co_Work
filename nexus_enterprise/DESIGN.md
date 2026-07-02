---
name: Nexus Enterprise
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#6df5e1'
  on-secondary-container: '#006f64'
  tertiary: '#3e3fcc'
  on-tertiary: '#ffffff'
  tertiary-container: '#585be6'
  on-tertiary-container: '#f1eeff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-max: 1440px
  gutter: 24px
  sidebar-width: 260px
---

## Brand & Style

The design system is engineered for high-utility co-working management, balancing the rigor of enterprise SaaS with the hospitality-driven nature of physical space management. The brand personality is professional, efficient, and architectural. 

The aesthetic follows a **Modern Corporate** style with **Minimalist** influences. It prioritizes clarity and density, utilizing a structured information hierarchy that allows community managers to process complex data—occupancy rates, revenue metrics, and member requests—at a glance. The visual language uses clean lines, ample whitespace to prevent cognitive overload, and subtle depth to define interactive zones. The goal is to evoke a sense of organized calm and operational excellence.

## Colors

The palette is anchored by **Royal Blue (#2563EB)**, signaling trust and technological precision. **Teal (#14B8A6)** serves as the secondary accent, used for growth-oriented metrics, sustainability features, or community-focused actions.

The background uses a cool gray canvas to make white surface cards pop. Functional colors (Success, Warning, Error) follow standard semantic patterns but are slightly desaturated to maintain the professional atmosphere. Neutral grays are utilized for secondary text, borders, and iconography to create a sophisticated, low-fatigue environment for long-duration usage.

## Typography

This design system utilizes **Inter** across all roles to ensure maximum legibility and a systematic, neutral feel. The scale is built on a tight ratio to support high-density dashboard layouts.

- **Headlines:** Use SemiBold (600) or Bold (700) weights with slight negative letter-spacing to maintain a modern, "tight" editorial look.
- **Body Text:** Optimized for readability at 16px (md) and 14px (sm). 14px is the primary size for data tables and dense sidebars.
- **Labels:** Uppercase styles are reserved for small categorizations (e.g., table headers, section overlines) to provide visual distinction without increasing size.

## Layout & Spacing

The system employs a **Fluid Grid** model with a max-width container for desktop viewing. It follows a strict **4px/8px baseline grid** to ensure mathematical harmony between elements.

- **Desktop:** 12-column grid with 24px gutters. A fixed 260px sidebar is used for primary navigation, while the main content area expands.
- **Tablet:** 8-column grid with 16px margins. The sidebar collapses into a narrow icon-only rail or an off-canvas drawer.
- **Mobile:** 4-column grid with 16px margins. Content stacks vertically, and complex data tables transition to card-based list views.
- **Density:** High-density spacing (sm/md units) is applied within data-heavy components like tables and toolbars, while layout-level spacing (lg/xl units) is used to separate distinct functional modules.

## Elevation & Depth

Elevation is used strategically to define the z-axis hierarchy, following Material Design’s physical metaphors but with a modern, softer execution.

- **Level 0 (Canvas):** The base background layer (#F8FAFC). No shadows.
- **Level 1 (Cards/Sidebar):** Raised slightly with a subtle, highly-diffused shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`. Used for the main dashboard cards and sidebar.
- **Level 2 (Dropdowns/Popovers):** Medium depth to indicate interactivity and temporary state.
- **Level 3 (Modals):** High depth with a background overlay (Scrim at 40% opacity). Shadows are deeper and more spread to pull the modal forward.

**Borders:** Use low-contrast `1px` outlines (#E2E8F0) in conjunction with elevation to define container boundaries in high-density views where shadows alone might become muddy.

## Shapes

The design system utilizes **Rounded (0.5rem)** corners as the default for most UI elements. This provides a approachable, modern feel that contrasts with the rigid lines of architectural floor plans.

- **Buttons & Inputs:** 0.5rem (8px) for a consistent, balanced look.
- **Cards & Modals:** 1rem (16px) to clearly define large content containers.
- **Status Badges/Chips:** Full pill-shape (999px) to distinguish them from interactive buttons.

## Components

- **Sidebar Navigation:** A dark or high-contrast light rail. Active states use a primary color vertical "indicator" on the left edge and a subtle background tint. Icons are 20px, stroke-based.
- **Metric Cards:** Large typography for primary values. Include a small **Sparkline** (simplified line chart) at the bottom or side using the secondary teal color to show 7-day trends.
- **Data Tables:** Borderless rows with 1px dividers. Header cells use `label-sm` (uppercase). Rows feature a hover state with a light blue tint.
- **Status Badges:** Use a "soft" style—light background fill (10% opacity of the semantic color) with high-contrast text.
- **Input Fields:** Outlined style with 1px border. On focus, the border thickens to 2px and changes to the primary color with a subtle outer glow.
- **Calendar Widget:** High-density view. Current day is highlighted with a primary circle; booked slots use rounded color blocks with 80% opacity.
- **Buttons:**
    - *Primary:* Solid Royal Blue with white text.
    - *Secondary:* Outlined Royal Blue or solid Teal for "Create" actions.
    - *Tertiary/Ghost:* Plain text with primary color for low-priority actions.