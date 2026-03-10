---
name: prototype-builder
description: Generate and iterate on UI prototypes from requirements, creating draft screens/flows and iterating until approved
---

# Prototype Builder

## When to Use

- Creating clickable prototypes for new features before implementation
- Exploring user flows and navigation patterns
- Presenting design concepts to stakeholders
- Iterating on UI designs based on feedback
- Building directly from a Confluence page or spec URL

## Audience & Defaults

This skill is optimized for Product Managers building concept prototypes. Default to low-fi fidelity unless the user explicitly asks for high-fi. Infer reasonable defaults from the requirements rather than asking excessive questions. If the user provides specific hex colors, pixel values, or font names, do not use them literally — map to the closest design token instead. The design system is the source of truth for all visual decisions.

## Input Sources

This skill accepts requirements from multiple sources:

| Source | How to Provide | What Happens |
|--------|---------------|--------------|
| **Confluence URL** | Paste one or more `metrc-tech.atlassian.net/wiki/...` URLs | Automatically fetches page content, extracts requirements, screens, flows, and data models. Uses Confluence Cloud ID `086ab4b0-285b-4f1c-be76-7af58a9c4f72`. |
| **Confluence search** | Describe the feature by name (e.g., "transfer manifest redesign") | Searches Confluence using CQL, presents matching pages, and asks user to confirm before fetching. |
| **UX brief** | Path to a brief from `/ux-brief-generator` | Reads the brief file and extracts requirements. |
| **Verbal description** | Describe what you want in plain language | Proceeds directly to discovery questions to fill in gaps. |
| **Mixed** | Any combination of the above | Merges all sources, deduplicates, and flags conflicts. |

## File Locations

| Path | Purpose |
|------|---------|
| `prototypes/[project]/` | Prototype root directory |
| `prototypes/[project]/page.tsx` | Main prototype page (Next.js route) |
| `prototypes/[project]/[screen]/page.tsx` | Individual screen pages |
| `prototypes/[project]/README.md` | Prototype manifest (see below) |
| `prototypes/[project]/screenshots/` | Captured PNGs of each screen + state |
| `prototypes/[project]/screenshots/index.html` | Static gallery for async PM review |

### README.md Structure (Prototype Manifest)

Every prototype MUST have a README.md that tracks its state. Create on first build, update on every change:

```markdown
# Prototype: [Project Name]

## Config
- **Theme**: [theme name]
- **Device**: [mobile/tablet/desktop]
- **Fidelity**: [wireframe/low-fi/high-fi]
- **Created**: [date]
- **Last updated**: [date]

## Sources
- [Confluence URL or description of input]

## Screens

| Screen | Route | Status | Notes |
|--------|-------|--------|-------|
| Dashboard | /prototypes/[project]/ | Complete | Main entry |
| Detail View | /prototypes/[project]/detail-view/ | In Progress | Needs empty state |
| Settings | /prototypes/[project]/settings/ | Not Started | P1 |

## Components Created
- `ComponentName` — [purpose], added to /components/

## Decisions
- [date]: [decision and rationale]

## Open Questions
- [question]
```

This file is the primary input for **Extend mode** — it tells the skill what already exists, what's in progress, and what's been decided.

## Fidelity Levels

| Level | What It Looks Like | When to Use |
|-------|-------------------|-------------|
| **Wireframe** | Gray boxes, structure only, no real content | Early exploration, flow validation |
| **Low-fi** | Basic token styling, placeholder content, key interactions | Stakeholder alignment, UX review |
| **High-fi** | Full design tokens, real content, animations, states | Developer handoff, final review |

## Modes

This skill operates in two modes, detected automatically:

### New Prototype
When `prototypes/[project]/` does **not** exist. Starts from scratch with full discovery.

### Extend Existing Prototype
When `prototypes/[project]/` **already exists**. Reads the current state and adds to it.

You can also target a **specific page** within a prototype:
- `/prototype-builder transfer-manifest` → extend the transfer-manifest prototype
- `/prototype-builder transfer-manifest/detail-view` → work only on the detail-view page

## Workflow

### Step 0: Detect Existing Prototype (automatic)

Before anything else, check if a prototype already exists for the project:

1. **Check `prototypes/` directory** — list existing prototype directories
2. **If the user named a project that matches an existing directory**, enter **Extend mode**:
   a. Read `prototypes/[project]/README.md` to understand current state
   b. List all existing screen files in the prototype directory
   c. Read existing prototype components to understand what's already been built
   d. Present a summary to the user:
      ```
      Existing prototype: [project-name]
      Theme: [theme from README]
      Device: [device from README]
      Fidelity: [fidelity from README]

      Built screens:
      | Screen | Status | Last Updated |
      |--------|--------|-------------|
      | Dashboard | Complete | 2026-03-08 |
      | Detail View | In Progress | 2026-03-09 |

      Components created for this prototype:
      - TransferCard (/components/TransferCard/)
      - StatusTimeline (/components/StatusTimeline/)
      ```
   e. Ask: **"What would you like to add or change?"**
   f. If the user specifies a page (e.g., `transfer-manifest/detail-view`), scope all work to that page only — read it, understand it, modify it
3. **If no match**, enter **New Prototype mode** and proceed to Step 1

**In Extend mode, skip Steps 1-3** (theme/device/fidelity are already set) unless the user explicitly wants to change them. Jump directly to Step 4 (Component Inventory Check) with the user's new requirements.

### Step 1: Gather Input & Discovery Questions (REQUIRED for new prototypes)

**If the user provides a Confluence URL or search term:**
1. Extract the page ID from the URL (format: `metrc-tech.atlassian.net/wiki/spaces/SPACE/pages/PAGEID/Title`)
2. Fetch the page content using `getConfluencePage` with `contentFormat: "markdown"`
3. Check for child pages with `getConfluencePageDescendants` — ask user if they want to include children
4. If a search term was given instead of a URL, use `searchConfluenceUsingCql` to find matching pages and confirm with the user before fetching
5. Extract from the fetched content: requirements, user stories, screen descriptions, user flows, data models, acceptance criteria, and any embedded Jira issue keys

**If the user provides a UX brief path:**
1. Read the brief file
2. Extract requirements, screens, flows, and constraints

**Then, regardless of source, gather the following. Ask for anything not yet known:**

**Always ask:**
1. **Theme** — Which theme should this prototype use? Read `styles/themes/index.ts` to list available themes (Trace, Earth, University, RID, Claude Light, etc.) and ask the user to pick one. The prototype page should wrap content in the appropriate theme provider.
2. **Target device** — Mobile (375px), tablet (768px), or desktop (1440px)?
3. **Fidelity** — Wireframe, low-fi, or high-fi?

**Ask if not already answered by the source material:**
4. **User role** — Who is this screen for? (state regulator, licensed operator, admin, etc.)
5. **Entry point** — How does the user get to this screen? (nav link, button click, URL)
6. **Key data** — What data should appear? Any sample values or real data to use?
7. **States needed** — Which states matter? (loading, empty, error, success, permissions-based)
8. **Known constraints** — Multi-state variations? Accessibility-critical workflows? Offline support?

**Present a summary** of what was gathered (from all sources) before proceeding:
- List of screens identified
- Key flows
- Data requirements
- Open questions or ambiguities found in the source material
- Any gaps that need user input

Do NOT proceed to building until you have at minimum: theme, device, fidelity, and a clear description of what to build.

### Step 2: Parse & Synthesize Requirements
From all gathered inputs (Confluence, brief, verbal), extract and organize:
- **Screens** — list every distinct view/page
- **Flows** — map user journeys across screens
- **States** — default, loading, empty, error, success for each screen
- **Data** — what data appears on each screen, sample values
- **Business rules** — validation, permissions, state-specific logic
- **Open questions** — ambiguities to flag before building

### Step 3: Screen Inventory
Present a table of screens with priority:

| Screen | Priority | Complexity | Notes |
|--------|----------|------------|-------|
| Dashboard | P0 | High | Main entry point |
| Detail View | P0 | Medium | From dashboard click |
| Settings | P1 | Low | Configuration |

Get user confirmation before building.

### Step 4: Component Inventory Check (REQUIRED)
Before writing any screen code:
1. **Read `/components/index.ts`** to get the full list of available design system components
2. **Read `/styles/design-tokens.ts`** to understand available tokens (colors, spacing, typography, radius, shadows)
3. **Map each screen's UI needs** to existing components (Badge, DataTable, ProductCard, Sidebar, LeftNav, etc.)
4. **Identify gaps** — UI elements needed that don't exist in the design system yet

### Step 5: Build Missing Components
For each component gap identified:
1. **Build it as a real component** at `/components/[Name]/[Name].tsx` — not a throwaway prototype-only element
2. **Use design tokens exclusively** — all tokens are CSS-variable-backed and theme-responsive
3. **Match the MTR Design System visual language** (see reference below)
4. **Export from `/components/index.ts`**
5. **Add to README** under "Components Created" with a `⚠️ Needs Design Review` flag

**Design Review Gate:** Do NOT run `/design-system-builder` to create documentation pages until the UX lead has reviewed and approved the component. Prototype-created components are real but provisional until reviewed.

## MTR Visual Language Reference (REQUIRED for all new components)

All tokens below are **theme-aware via CSS custom properties**. Components MUST import from `@/styles/design-tokens` — these exports resolve to `var(--mtr-*)` references that auto-update when the theme changes. **Never hardcode hex colors, pixel spacing, or font values.**

### Theme-Aware Imports
```tsx
import {
  colors,           // All theme-aware via CSS vars
  spacing,          // Semantic spacing (theme-aware)
  typography,       // Font sizes (theme-aware)
  fontFamilies,     // Font families (theme-aware)
  fontWeights,      // Font weights (theme-aware)
  borderRadiusSemantics,  // Component radius (theme-aware)
  shadowSemantics,  // Elevation shadows (theme-aware)
} from '@/styles/design-tokens'
```

### Color Usage (theme-responsive)
| Purpose | Token | Never Use |
|---------|-------|-----------|
| Page background | `colors.surface.light` | `#FFFFFF` or `white` |
| Card/elevated background | `colors.surface.lightDarker` | `#F5F5F5` |
| Primary text | `colors.text.highEmphasis.onLight` | `#000000` or `black` |
| Secondary text | `colors.text.lowEmphasis.onLight` | `#666666` or `gray` |
| Disabled text | `colors.text.disabled.onLight` | `rgba(0,0,0,0.3)` |
| Primary action | `colors.brand.default` | `#179786` |
| Action hover | `colors.brand.lighter` | Lightened hex |
| Action pressed | `colors.brand.darker` | Darkened hex |
| Subtle border | `colors.border.lowEmphasis.onLight` | `#E0E0E0` |
| Standard border | `colors.border.midEmphasis.onLight` | `#CCCCCC` |
| Strong border | `colors.border.highEmphasis.onLight` | `#999999` |
| Error | `colors.status.important` | `#FF0000` or `red` |
| Success | `colors.status.success` | `#00FF00` or `green` |
| Warning | `colors.status.warning` | `#FFA500` or `orange` |
| Info | `colors.status.info` | `#0000FF` or `blue` |
| Hover background | `colors.hover.onLight` | `rgba(0,0,0,0.04)` |
| Selected background | `colors.selectedHighlight` | Custom tint |
| Focus ring | `colors.focusBorder.onLight` | `blue` or `outline: auto` |
| Overlay/scrim | `colors.scrim` | `rgba(0,0,0,0.5)` |

### Spacing (4px base grid, quoted numeric keys)
| Token | Use For |
|-------|---------|
| `spacing.none` (0px) | Reset spacing |
| `spacing['2xs']` (4px) | Badge padding, inline element gaps |
| `spacing.xs` (8px) | Compact padding, small gaps |
| `spacing.sm` (12px) | Standard element gaps, card grid gaps |
| `spacing.md` (16px) | Card padding, section gaps |
| `spacing.lg` (20px) | Section spacing |
| `spacing.xl` (24px) | Large section spacing |
| `spacing['2xl']` (32px) | Page-level padding |
| `spacing['3xl']` (40px) | Large page padding |
| `spacing['4xl']` (48px) | Major section dividers |
| `spacing['5xl']` (64px) | Hero spacing |
| `spacing['6xl']` (96px) | Extra large spacing |

**Note:** Larger sizes use quoted bracket notation (e.g., `spacing['2xl']`), not dot notation.

### Border Radius (semantic, theme-aware)
| Token | Use For |
|-------|---------|
| `borderRadiusSemantics.badge` | Badges, chips, small pills |
| `borderRadiusSemantics.button` | Buttons |
| `borderRadiusSemantics.input` | Input fields, selects |
| `borderRadiusSemantics.card` | Cards, containers |
| `borderRadiusSemantics.modal` | Modals, dialogs |
| `borderRadiusSemantics.avatar` | Avatar images |
| `borderRadiusSemantics.interactive` | General interactive elements |
| `borderRadiusSemantics.chip` | Chip components |
| `'50%'` | Circular elements (no token — use literal string) |

### Shadows (semantic, theme-aware)
| Token | Use For |
|-------|---------|
| `shadowSemantics.button` | Buttons at rest |
| `shadowSemantics.buttonHover` | Buttons on hover |
| `shadowSemantics.card` | Cards at rest |
| `shadowSemantics.cardHover` | Cards on hover (elevation change) |
| `shadowSemantics.dropdown` | Dropdown menus, popovers |
| `shadowSemantics.modal` | Modals, dialogs |

### Typography

**IMPORTANT:** Typography tokens are **composite objects** containing `{ fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }`. When setting `fontSize` in styles, use `typography.body.md.fontSize` (not `typography.body.md`). You can also spread the full object: `...typography.body.md`.

| Use Case | Font Size | Weight | Family |
|----------|-----------|--------|--------|
| Page title | `typography.heading.h3.fontSize` | `fontWeights.semibold` | `fontFamilies.display` |
| Section heading | `typography.heading.h5.fontSize` | `fontWeights.semibold` | `fontFamilies.display` |
| Body text | `typography.body.md.fontSize` | `fontWeights.regular` | `fontFamilies.body` |
| Small body | `typography.body.sm.fontSize` | `fontWeights.regular` | `fontFamilies.body` |
| Labels | `typography.label.md.fontSize` | `fontWeights.medium` | `fontFamilies.body` |
| Small labels | `typography.label.sm.fontSize` | `fontWeights.medium` | `fontFamilies.body` |
| Button text | `typography.label.md.fontSize` | `fontWeights.semibold` | `fontFamilies.body` |
| Code/IDs | `typography.body.sm.fontSize` | `fontWeights.regular` | `fontFamilies.mono` |

**Available font families:** `fontFamilies.display` (headings), `fontFamilies.body` (body/labels), `fontFamilies.mono` (code/IDs). There is no `fontFamilies.primary`.
**Available font weights:** `fontWeights.regular`, `.medium`, `.semibold`, `.bold`. Note: lowercase `semibold`, not `semiBold`.

### Interaction States
```tsx
// Hover: subtle background change, no layout shift
onMouseEnter: backgroundColor → colors.hover.onLight (or brand.lighter for primary actions)

// Focus: 2px outline with offset, brand color
outline: `2px solid ${colors.focusBorder.onLight}`
outlineOffset: '2px'

// Active/Pressed: slight darkening
backgroundColor → colors.brand.darker (for primary actions)

// Disabled: reduced opacity + not-allowed cursor
opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none'

// Transitions: ease-out timing
transition: 'background-color 200ms ease-out, border-color 200ms ease-out, box-shadow 200ms ease-out'
// Fast (color changes): 150ms
// Default (most interactions): 200ms
// Slow (complex animations): 300ms
```

### Layout Conventions
- **Primary layout**: Flexbox (`display: 'flex'`)
- **Spacing between items**: Use `gap` property with semantic tokens (not margins)
- **Card grids**: CSS Grid with `gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'`
- **Icon + text**: `display: 'flex'`, `alignItems: 'center'`, `gap: spacing.xs`
- **Borders**: Always `1px solid` with emphasis-based color tokens
- **Reduced motion**: Wrap all animations in `prefers-reduced-motion` check

### Component Template
```tsx
'use client'

import React, { forwardRef } from 'react'
import {
  colors, spacing, typography, fontFamilies, fontWeights,
  borderRadiusSemantics, shadowSemantics,
} from '@/styles/design-tokens'

export interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible label for the region */
  'aria-label': string
  // Props here
}

export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="region"
        tabIndex={0}
        style={{
          fontFamily: fontFamilies.body,
          fontSize: typography.body.md.fontSize,
          color: colors.text.highEmphasis.onLight,
          backgroundColor: colors.surface.light,
          padding: spacing.md,
          borderRadius: borderRadiusSemantics.card,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          boxShadow: shadowSemantics.card,
          transition: 'border-color 200ms ease-out, box-shadow 200ms ease-out',
          ...style,
        }}
        {...props}
      />
    )
  }
)
ComponentName.displayName = 'ComponentName'
```

### Step 5b: Navigation & Prototype Shell

For multi-screen prototypes, create a shared prototype shell with basic navigation (sidebar or top nav) that links all screens together. Import the shell as a layout wrapper so PMs can click through the full flow. Single-screen prototypes do not need a shell. The nav should use existing `LeftNav` or `Sidebar` components if available, otherwise build a minimal one with design tokens.

### Step 6: Build Screens
For each screen, create a Next.js page component:
- Import design tokens from `@/styles/design-tokens`
- Import existing AND newly-created components from `@/components`
- Use inline styles (not Tailwind) — match the MTR Design System component pattern
- Every visual element should use design tokens — no hardcoded colors, spacing, or font sizes
- Use **domain-realistic content** (see Content Reference below) — never use lorem ipsum
- Build iteratively: structure first, then styling, then interactions

#### Mock Data & Interactivity

For prototypes that need to feel dynamic (filtering, searching, tab switching), use React `useState` to drive interactions. Keep mock datasets in a separate `data.ts` file alongside the prototype page — not inline in the component. Reference the Domain Content tables for realistic values. The state switcher (default/loading/empty/error) should remain at the top of each page as a separate concern from in-page interactivity.

### Step 7: Build All Required States (MANDATORY)
Every screen MUST include these states — build each as a switchable view:

| State | What to Show | Required |
|-------|-------------|----------|
| **Default** | Populated with realistic cannabis regulatory data | Always |
| **Loading** | Skeleton screens or spinners matching component shapes | Always |
| **Empty** | Helpful empty state with icon, message, and action | Always |
| **Error** | Error message with recovery action (retry, contact support) | Always |
| **Partial** | Some data loaded, some failed or pending | If applicable |
| **Permission denied** | Access restricted message | If role-based |

Add a state switcher control (dev-only) at the top of each prototype page so reviewers can toggle between states:
```tsx
const [viewState, setViewState] = useState<'default' | 'loading' | 'empty' | 'error'>('default')
```

### Step 8: Accessibility Audit
After building screens and components, run `/design-accessibility` on all new components:
1. Audit each new component created in Step 5
2. Fix any Critical or Serious issues before proceeding
3. Verify: focus order, keyboard navigation, screen reader labels, color contrast, reduced motion support
4. Log accessibility decisions in the README

### Step 9: Capture Screenshots
Capture screenshots of each screen in each state for async sharing:

1. **Check dev server** — verify `localhost:3000` is running. If not, start it with `npm run dev` and wait for ready
2. **Capture each screen** in each state using a headless browser:
   ```bash
   npx playwright screenshot http://localhost:3000/prototypes/[project]/[screen]?state=default \
     prototypes/[project]/screenshots/[screen]-default.png --viewport-size=1440,900
   ```
3. **Save screenshots** to `prototypes/[project]/screenshots/`:
   - `[screen]-default.png`
   - `[screen]-loading.png`
   - `[screen]-empty.png`
   - `[screen]-error.png`
4. **Generate an HTML gallery** at `prototypes/[project]/screenshots/index.html`:
   - Simple static HTML page (no server needed) showing all screenshots organized by screen and state
   - Include prototype name, theme, device, date, and screen descriptions
   - PMs can open this file directly in a browser or share the folder

If Playwright is not installed, fall back to offering manual screenshot instructions.

### Step 10: Present for Review
After building, present:
- Link to the running prototype (localhost URL)
- Screenshot gallery path for async review
- Summary of screens built with state coverage
- New components created
- Assumptions and decisions made
- Open questions for the designer/PM

### Step 11: Iterate
Refine based on feedback. Common iteration patterns:
- Layout changes → adjust CSS in page component
- New states → add state handling
- Flow changes → add/modify navigation between screens
- Content changes → update with more realistic data
- After changes, **re-capture screenshots** for the modified screens

### Step 12: Update README & Handoff
After every build or iteration:
1. **Update `prototypes/[project]/README.md`** — mark screens as Complete/In Progress, add new components to the list, log decisions, update "Last updated" date
2. **Re-capture screenshots** if screens changed
3. When fully approved:
   a. Run component gap analysis — list all remaining `[COMPONENT_GAP]` TODOs
   b. For each gap, suggest whether to create via `/component-generator` or use existing components
   c. Pass new components to `/design-system-builder` for documentation pages
   d. Archive prototype or promote to production route

## Domain-Realistic Content Reference (MANDATORY — no lorem ipsum)

All prototype content MUST use realistic cannabis regulatory terminology. This makes prototypes immediately useful for stakeholder review.

### Entity Types & Sample Data

| Entity | Example Values |
|--------|---------------|
| **Plant Tag** | 1A4060300000022000012345, 1A406030000007800005678 |
| **Package Tag** | 1A4060300000022000098765, 1A406030000007800004321 |
| **Strain Name** | Blue Dream, OG Kush, Sour Diesel, Girl Scout Cookies, Granddaddy Purple, Jack Herer |
| **Facility Name** | Green Leaf Cultivation LLC, Pacific Coast Extracts, Mountain View Dispensary |
| **License Number** | C12-0000001-LIC, M-12345, P-67890, D-11223 |
| **License Type** | Cultivator, Manufacturer, Distributor, Retailer, Microbusiness, Testing Lab |
| **Batch ID** | BATCH-2026-0142, BATCH-2026-0143 |
| **Manifest Number** | 0000001234, 0000005678 |
| **Item Category** | Flower, Concentrate, Edible, Pre-Roll, Tincture, Topical, Capsule |
| **Unit of Measure** | Grams, Ounces, Each, Milligrams |
| **Growth Phase** | Clone, Vegetative, Flowering, Harvest |
| **Package Status** | Active, In Transit, Received, On Hold, Returned, Destroyed |
| **Transfer Status** | Pending, In Transit, Received, Rejected, Voided |
| **Test Status** | Pending, In Progress, Passed, Failed, Retesting |
| **Compliance Status** | Compliant, Non-Compliant, Under Review, Corrective Action Required |

### Sample User Personas

| Role | Name | Context |
|------|------|---------|
| **State Regulator** | Maria Chen, Compliance Officer | Reviews licensee reports, investigates discrepancies |
| **Cultivator** | James Wilson, Grow Manager | Tags plants, reports harvests, creates packages |
| **Distributor** | Sarah Rodriguez, Logistics Lead | Creates transfer manifests, tracks deliveries |
| **Dispensary** | David Kim, Inventory Manager | Receives packages, manages retail inventory, reports sales |
| **Lab Technician** | Dr. Aisha Patel, Lab Director | Logs test results, issues certificates of analysis |

### Sample Quantities & Values

| Context | Realistic Range |
|---------|----------------|
| Plant count (room) | 50-500 plants |
| Harvest weight | 2,500g - 15,000g (wet), 500g - 3,000g (dry) |
| Package weight | 1g - 454g (1 lb) |
| Transfer packages | 5-50 packages per manifest |
| THC content | 15-32% (flower), 60-95% (concentrate) |
| CBD content | 0.1-25% |
| Price per gram | $3-$15 (wholesale), $8-$25 (retail) |
| Facility count per state | 200-5,000 |

### Dates & Timeframes
- Use dates within the last 30 days for active records
- Use the current year (2026)
- Business hours: 6:00 AM - 10:00 PM (cultivation), 8:00 AM - 6:00 PM (office)
- Transfer windows: 24-72 hours
- Test turnaround: 3-7 business days

## Integration Rules

- **Theme-first** — All visual tokens are CSS-variable-backed. Components automatically respond to theme changes. Never import values from a specific theme file (e.g., `trace.ts`) — always import from `@/styles/design-tokens`.
- **Use existing components first** — `import { Badge, DataTable } from '@/components'`
- **Build what's missing** — if a component doesn't exist, create it as a real design system component (not a prototype-only throwaway). It should be reusable beyond this prototype.
- **Use inline styles** — no Tailwind, no CSS modules
- **Zero hardcoded values** — every color, spacing, font size, radius, and shadow must come from design tokens. If you write a hex color, pixel value, or font name directly in a style, it will not respond to themes.
- **Prototype pages are exploratory** — but the components they use are production-quality and theme-aware
- **Responsive behavior** — Build for the target device only. Do not add responsive breakpoints unless explicitly requested. Set a `maxWidth` on the prototype page matching the target device (375px mobile, 768px tablet, 1440px desktop) and center it on the screen. This keeps prototypes focused and avoids ambiguity during review.
- **Iteration versioning** — Do not create iteration folders. Use git commits to track prototype versions. Update the README decisions log on each iteration with the date and what changed. The README is the single source of truth for prototype history.

## User Input Required

$ARGUMENTS

---

Please provide requirements for the prototype. You can give me any of:
- **Confluence URL(s)** — I'll fetch the page content and extract requirements automatically
- **Feature name** — I'll search Confluence for matching specs
- **UX brief path** — path to a brief from `/ux-brief-generator`
- **Verbal description** — describe what you want and I'll ask follow-up questions

I'll ask about theme, device, fidelity, and any other details I need before building.
