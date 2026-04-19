---
name: lumen-builder
description: Build experiences with the Lumen Design System — wireframe, prototype, or production-ready screens from requirements
---

# Lumen Builder

## When to Use

- Creating clickable prototypes for new features before implementation
- Exploring user flows and navigation patterns
- Presenting design concepts to stakeholders
- Iterating on UI designs based on feedback

## Audience & Defaults

This skill is optimized for Product Managers and Design Leads building concept prototypes. Default to wireframe fidelity unless the user explicitly asks for high-fi. Infer reasonable defaults from the requirements rather than asking excessive questions. If the user provides specific hex colors, pixel values, or font names, do not use them literally — map to the closest design token instead. The design system is the source of truth for all visual decisions.

## Input Sources

This skill accepts requirements from multiple sources:

| Source | How to Provide | What Happens |
|--------|---------------|--------------|
| **UX brief** | Path to a brief from `/ux-brief-generator` | Reads the brief file and extracts requirements. |
| **Verbal description** | Describe what you want in plain language | Proceeds directly to discovery questions to fill in gaps. |
| **Meeting transcript** | Paste transcript text or provide path to a `.vtt` file | Extracts action items, feedback themes, and decisions. Then enters Extend mode to address the action items. |
| **External URL** | Confluence, Notion, or other spec URLs | Fetches content and extracts requirements. |
| **Mixed** | Any combination of the above | Merges all sources, deduplicates, and flags conflicts. |

## Repo Mode Detection (REQUIRED — run before File Locations)

Before deciding where to write files, detect which repo the user invoked the skill from. There are two valid contexts:

| Mode | Trigger | Where to write |
|------|---------|----------------|
| **Embedded** | cwd is the Lumen DS repo (`package.json` `name === '@lumen/design-system'`) | Nest under `app/prototypes/[project]/` |
| **Standalone** | cwd is a Lumen-consuming prototype (`node_modules/@lumen/design-system` exists AND `name !== '@lumen/design-system'`) — created by `/spinup-lumen-prototype` | Write at the top of `app/`. The whole repo IS the prototype. |

How to detect:
1. Read the cwd's `package.json` `name` field.
2. If `'@lumen/design-system'` → **Embedded**.
3. Else if `node_modules/@lumen/design-system` exists (link or install) → **Standalone**.
4. Else → not a Lumen project. Stop and ask the user where to build.

State the detected mode in your first response, e.g. *"Detected standalone mode — building at `app/`."*

## File Locations

### Embedded mode (Lumen DS repo)
| Path | Purpose |
|------|---------|
| `app/prototypes/[project]/` | Prototype root directory |
| `app/prototypes/[project]/page.tsx` | Main prototype page (Next.js route) |
| `app/prototypes/[project]/[screen]/page.tsx` | Individual screen pages |
| `app/prototypes/[project]/README.md` | Prototype manifest (see below) |
| `app/prototypes/[project]/screenshots/` | Captured PNGs of each screen + state |

### Standalone mode (`~/Desktop/CodeWork/[project]/`)
| Path | Purpose |
|------|---------|
| `app/` | Prototype root (the whole repo is the prototype) |
| `app/page.tsx` | Main entry screen |
| `app/[screen]/page.tsx` | Individual screen pages |
| `README.md` (repo root) | Prototype manifest (see below) |
| `screenshots/` (repo root) | Captured PNGs of each screen + state |
| `components/[Name]/[Name].tsx` | Prototype-local components (do NOT write into the linked Lumen DS) |

In standalone mode, `[project]` does not appear in the path — the repo folder name already serves that role. Use `/` (not `/prototypes/[project]/`) for all routes in the README screens table and any inter-screen `<Link>`s.

### README.md Structure (Prototype Manifest)

Every prototype MUST have a README.md that tracks its state. Create on first build, update on every change:

```markdown
# Prototype: [Project Name]

## Config
- **Owner**: [name of person who requested/built the prototype]
- **Status**: [draft | in-review | approved | archived]
- **Theme**: [theme name]
- **Device**: [mobile/tablet/desktop] ([375px | 768px | 1440px])
- **Fidelity**: [wireframe/high-fi]
- **Created**: [YYYY-MM-DD]
- **Last updated**: [YYYY-MM-DD]

## Sources
- [Description of input or URL]

## Screens

| Screen | Route | Status | Notes |
|--------|-------|--------|-------|
| Dashboard | /prototypes/[project]/ | Complete | Main entry |
| Detail View | /prototypes/[project]/detail-view/ | In Progress | Needs empty state |

## Components Created
- `ComponentName` — [purpose], added to /components/

## Decisions
- [date]: [decision and rationale]

## Open Questions
- [question]

## Prompts
<!-- Auto-appended by /prototype-builder on each invocation -->
1. [YYYY-MM-DD] "[The user's original prompt or request]"
```

**Prompt logging rule:** Log a new prompt whenever the user gives a **directive that changes scope or adds something** to the prototype. Not when they answer discovery questions or approve a plan.

## Fidelity Levels

| Level | What It Looks Like | When to Use | Default? |
|-------|-------------------|-------------|----------|
| **Wireframe** | Neutral tokens only — surfaces, borders, text emphasis. No brand colors, status colors, or shadows. Layout uses full spacing, radius, and typography so proportions are accurate. All content is realistic (no lorem ipsum). | Structure validation, flow review, early stakeholder alignment | Yes (default) |
| **Prototype** | Full design tokens — brand colors, status colors, shadows, hover/focus states, transitions. Realistic content and interactive state switching. Mock data in separate `data.ts` files. Component composition matches DS patterns. Responsive only for target device. | Design review, stakeholder demos, flow validation, concept testing | No — ask for "prototype" or "high-fi" |
| **Production** | Everything in Prototype plus: real data integration patterns, full error handling with recovery flows, comprehensive a11y audit (WCAG 2.2 AA), responsive breakpoints for all viewports, performance considerations (lazy loading, virtualization for large lists), API integration stubs, form validation, and analytics hooks. Components built to DS production standards via `/component-generator`. | Developer handoff, production deployment, final review | No — ask for "production" or "production-ready" |

### What changes across levels

| Concern | Wireframe | Prototype | Production |
|---------|-----------|-----------|------------|
| **Colors** | Neutral only (surface, text, border) | Full brand + status tokens | Full brand + status tokens |
| **Shadows** | None — flat surfaces | `shadows.*` tokens applied | `shadows.*` tokens applied |
| **Hover/Focus** | Suppressed | Full interaction states | Full + `prefers-reduced-motion` |
| **Content** | Realistic text, no lorem ipsum | Realistic with mock datasets | Realistic + data integration patterns |
| **States** | Default + empty | All 6 states (default, loading, empty, error, partial, permission) | All 6 + edge cases (timeout, offline, rate-limit) |
| **Responsiveness** | Target device only | Target device only | All breakpoints (320, 640, 768, 1024, 1280) |
| **Accessibility** | Semantic HTML, labels | + keyboard nav, focus management | Full WCAG 2.2 AA audit, Section 508, ARIA patterns |
| **Components** | Use existing or build minimal | Build real DS components with `Needs Review` flag | Build via `/component-generator` with full docs |
| **Data** | Inline sample values | Mock datasets in `data.ts` | API integration stubs + loading/error boundaries |
| **Error handling** | Placeholder error state | Error states with retry actions | Granular error boundaries, toast notifications, recovery flows |
| **Performance** | N/A | N/A | Lazy loading, virtualized lists, image optimization |
| **Testing** | N/A | N/A | Suggested test cases in README |

### Wireframe Token Rules

Wireframe mode uses **only** these token categories:

#### Allowed (structure & hierarchy)
| Token Category | Examples | Purpose |
|---------------|----------|---------|
| `colors.surface.*` | `surface.light`, `surface.lightDarker` | Distinguish content areas |
| `colors.text.*` | `text.highEmphasis.onLight`, `text.lowEmphasis.onLight` | Text hierarchy |
| `colors.border.*` | `border.lowEmphasis.onLight`, `border.midEmphasis.onLight` | Structure boundaries |
| `spacing.*` | All spacing tokens | Layout rhythm |
| `borderRadius.*` | All radius tokens | Component shape |
| `typography.*` | All type tokens | Text hierarchy |

#### Suppressed (visual identity)
| Token Category | Wireframe Replacement |
|---------------|----------------------|
| `colors.brand.*` | Use `colors.border.highEmphasis.onLight` for outlines, `colors.surface.lightDarker` for fills |
| `colors.status.*` | Use `colors.border.midEmphasis.onLight` — all statuses render neutral |
| `shadows.*` | No shadows — all surfaces flat |
| Hover color changes | Suppressed |

### Prototype → Production Promotion

When a prototype is approved and needs to become production-ready:

1. Run `/token-audit` to catch any hardcoded values missed during prototyping
2. Run `/design-accessibility` in compliance mode on all screens
3. Add responsive breakpoints for all viewports
4. Replace mock data patterns with API integration stubs
5. Add error boundaries and loading states at the route level
6. Run `/design-system-guard` on any new components
7. Update README status from `in-review` to `approved`
8. Pass new components to `/design-system-builder` for documentation

## Modes

This skill operates in three modes, detected automatically:

### New Prototype
When `app/prototypes/[project]/` does **not** exist. Starts from scratch with full discovery.

### Extend Existing Prototype
When `app/prototypes/[project]/` **already exists**. Reads the current state and adds to it.

### Feedback Intake → Extend
When the user provides a **meeting transcript** alongside a prototype name. Extracts feedback, then enters Extend mode to address action items.

## Workflow

### Step 0a: Feedback Intake Detection (automatic)

Check if the user provided a meeting transcript (speaker-attributed dialogue or `.vtt` file). If detected:

1. Identify the target prototype
2. Parse transcript — extract participants, action items, feedback themes, decisions
3. Present extracted feedback for confirmation
4. On confirmation, enter Extend mode with action items as requirements

### Step 0: Detect Existing Prototype (automatic)

1. Check `app/prototypes/` for existing directories
2. If match found, enter **Extend mode**:
   a. Snapshot the current version (see Snapshot Versioning below)
   b. Read README.md, existing screens, and components
   c. Present summary and ask: "What would you like to add or change?"
3. If no match, enter **New Prototype mode** → Step 1

### Step 1: Gather Input & Discovery Questions (REQUIRED for new prototypes)

**Always ask:**
1. **Theme** — Which theme? Check `styles/themes/` for available themes. Use `useColors()` and `useTheme()` hooks in the prototype page.
2. **Target device** — Mobile (375px), tablet (768px), or desktop (1440px)?
3. **Fidelity** — Wireframe (default), Prototype (full design tokens + interactions), or Production (production-ready with a11y, responsive, error handling). Present the default and let them change.

**Ask if not already answered:**
4. **User role** — Who is this screen for?
5. **Entry point** — How does the user get to this screen?
6. **Key data** — What data should appear?
7. **States needed** — Which states matter? (loading, empty, error, success)
8. **Known constraints** — Multi-state variations? Accessibility-critical workflows?

**Present a summary** before proceeding. Do NOT build until you have: theme, device, fidelity, and clear requirements.

### Step 2: Parse & Synthesize Requirements

Extract and organize: screens, flows, states, data, business rules, open questions.

### Step 3: Plan & Approval Gate (REQUIRED)

**Every prototype requires a plan and explicit user approval before building.**

#### 3a: Screen Inventory
| Screen | Priority | Complexity | Notes |
|--------|----------|------------|-------|

#### 3b: Layout Plan

**Single-page:** Describe vertical content map (sections top to bottom).

**Multi-page:** Generate a Mermaid flowchart showing screen relationships and user flows.

#### 3c: Present for Approval
Do NOT proceed until the user explicitly approves.

### Step 4: Component Inventory Check (REQUIRED)

Before writing any screen code:
1. **Read `/components/index.ts`** for available components
2. **Read `/styles/design-tokens.ts`** for available tokens
3. **Map each screen's UI needs** to existing components
4. **Identify gaps**

### Step 5: Build Missing Components

For each gap:
1. Build as a real component at `/components/[Name]/[Name].tsx`
2. Use design tokens exclusively
3. Export from `/components/index.ts`
4. Add to README under "Components Created" with `Needs Design Review` flag

### Step 5b: Navigation & Prototype Shell

For multi-screen prototypes, create a shared shell with navigation linking all screens. Use existing `LeftNav` or `Header` components.

### Step 6: Build Screens

For each screen:
- Import design tokens from `@/styles/design-tokens`
- Import components from `@/components`
- Use inline styles (not Tailwind)
- Use **realistic content** — never lorem ipsum
- Build iteratively: structure → styling → interactions

### Step 7: Build All Required States (MANDATORY)

Every screen MUST include:

| State | What to Show | Required |
|-------|-------------|----------|
| **Default** | Populated with realistic data | Always |
| **Loading** | Skeleton screens or spinners | Always |
| **Empty** | Helpful empty state with icon, message, action | Always |
| **Error** | Error message with recovery action | Always |
| **Partial** | Some data loaded, some failed | If applicable |
| **Permission denied** | Access restricted message | If role-based |

### Step 8: Accessibility Audit

Run `/design-accessibility` on all new components:
1. Fix Critical or Serious issues before proceeding
2. Verify: focus order, keyboard navigation, screen reader labels, color contrast, reduced motion

### Step 9: Capture Screenshots

Use Playwright to capture each screen in each state:
```bash
npx playwright screenshot http://localhost:3333/prototypes/[project]/[screen]?state=default \
  prototypes/[project]/screenshots/[screen]-default.png --viewport-size=1440,900
```

### Step 10: Present for Review

Present: running URL, screenshots, screen summary, new components, assumptions, open questions.

### Step 11: Iterate

Refine based on feedback. Re-capture screenshots after changes.

### Step 12: Register in Nav

Add nav entry to `app/design-system/shared.tsx` → `navSections` array.

### Step 13: Update README & Handoff

1. Update README — mark screen statuses, log decisions, update date
2. Re-capture screenshots if changed
3. When approved: run component gap analysis, pass to `/design-system-builder` for documentation

## Lumen Design System Reference (REQUIRED)

All tokens are **theme-aware**. Components MUST import from `@/styles/design-tokens`. **Never hardcode hex colors, pixel spacing, or font values.**

### Imports

```tsx
// Components — always import from the barrel file
import { Button, Input, DataTable, Select, Avatar } from '@/components'

// Design tokens
import { colors, spacing, typography, borderRadius, shadows, breakpoints } from '@/styles/design-tokens'

// Theme hooks (for dynamic theming)
import { useColors, useTheme, useTypography, useSpacing } from '@/styles/themes'
```

### Color Usage

| Purpose | Token | Never Use |
|---------|-------|-----------|
| Page background | `colors.surface.light` | `#FFFFFF` |
| Card background | `colors.surface.lightDarker` | `#F5F5F5` |
| Primary text | `colors.text.highEmphasis.onLight` | `#000000` |
| Secondary text | `colors.text.lowEmphasis.onLight` | `#666666` |
| Disabled text | `colors.text.disabled.onLight` | `rgba(0,0,0,0.3)` |
| Primary action | `colors.brand.default` | hardcoded hex |
| Subtle border | `colors.border.lowEmphasis.onLight` | `#E0E0E0` |
| Standard border | `colors.border.midEmphasis.onLight` | `#CCCCCC` |
| Error | `colors.status.important` | `red` |
| Success | `colors.status.success` | `green` |
| Warning | `colors.status.warning` | `orange` |
| Info | `colors.status.info` | `blue` |

### Spacing (4px base grid)

| Token | Value | Use for |
|-------|-------|---------|
| `spacing['2xs']` | 4px | Tight inner padding, icon gaps |
| `spacing.xs` | 8px | Default inner padding, form field gaps |
| `spacing.sm` | 12px | Compact section padding |
| `spacing.md` | 16px | Standard section padding |
| `spacing.xl` | 24px | Card padding, generous padding |
| `spacing['2xl']` | 32px | Page section spacing |
| `spacing['3xl']` | 40px | Large section spacing |
| `spacing['4xl']` | 48px | Page-level spacing |

### Typography

Apply with spread: `style={{ ...typography.heading.h2 }}`

- **Display**: `typography.display['2xl']` through `xs` — Page heroes
- **Heading**: `typography.heading.h1` through `h6` — Section headings
- **Body**: `typography.body.xl` through `xs` — Content text
- **Label**: `typography.label.lg` through `xs` — Form labels, UI labels

### Border Radius

| Token | Use for |
|-------|---------|
| `borderRadius.sm` | Buttons, inputs |
| `borderRadius.md` | Cards, dropdowns |
| `borderRadius.lg` | Modals, panels |
| `borderRadius.full` | Circular (avatars, pills) |

### Shadows

| Token | Use for |
|-------|---------|
| `shadows.sm` | Subtle lift (cards) |
| `shadows.md` | Dropdowns, popovers |
| `shadows.lg` | Modals, dialogs |

### Interaction States
```tsx
// Hover: subtle background change, no layout shift
// Focus: 2px outline with brand color and offset
// Disabled: opacity 0.5, cursor not-allowed
// Transitions: use transitionPresets.fast (150ms), .default (200ms), .slow (300ms)
```

## Available Components (Quick Reference)

Consult CLAUDE.md for full props — this is the selection guide:

### Actions
- **Button** — `emphasis: "high" | "mid" | "low"`, `destructive`, `loading`, `iconOnly`
- **ButtonGroup** — `spacing: "form"`, `align: "end"`

### Form Controls
- **Input**, **Select**, **Combobox**, **Textarea**, **Checkbox**, **Radio**, **Switch**

### Data Display
- **DataTable** — sorting, filtering, pagination, card view toggle
- **StatsCard**, **DetailField**, **Badge**, **Chip**, **Avatar**, **ProgressBar**, **Skeleton**

### Feedback
- **Banner** — `variant: "info" | "success" | "warning" | "error"`
- **Toast** — via `useToast()` hook
- **ConfirmDialog**, **EmptyState**

### Navigation
- **Header**, **LeftNav**, **TabBar**, **Pagination**, **Stepper**

### Layout
- **FullScreenModal** — `variant: "fullscreen" | "floating"`
- **BottomSheet** — mobile container, `height: "auto" | "half" | "full"`
- **Accordion**, **Divider**, **ListItem**

### Specialized
- **TaskModal**, **CollectionToolbar**, **ChatPanel**

## Layout Patterns

### Standard Page Layout
```tsx
<div style={{ display: 'flex', minHeight: '100vh' }}>
  <LeftNav items={navItems} />
  <div style={{ flex: 1, padding: spacing['2xl'] }}>
    <Header title="Page Title" />
    <main style={{ marginTop: spacing.xl }}>
      {/* Page content */}
    </main>
  </div>
</div>
```

### Form Layout
```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
  <Input label="Name" required />
  <Select label="Category" options={options} />
  <ButtonGroup spacing="form" align="end">
    <Button emphasis="low">Cancel</Button>
    <Button emphasis="high">Save</Button>
  </ButtonGroup>
</div>
```

## Component Composition Rules (CRITICAL)

### Button Order
High-emphasis buttons always go rightmost. Secondary actions go left.

### Badge Colors
Never use a single Badge color for all categories. Map each category to a distinct `BadgeColor`. Use `variant="outlined"` for categories, `variant="filled"` for statuses.

### DataTable
Never wrap DataTable in a custom card container — it renders its own.

### BottomSheet
Use for mobile overlays (properties panels, action sheets, filters). The component handles scrim, body scroll lock, focus trap, and Escape key.

## Responsive Behavior

Build for the target device only. Set `maxWidth` matching the target (375px, 768px, 1440px) and center on screen. Do not add responsive breakpoints unless explicitly requested.

For mobile prototypes, use `BottomSheet` instead of side panels, and the floating FAB pattern for secondary actions.

## Integration Rules

- **Use existing components first** — `import { Badge, DataTable } from '@/components'`
- **Build what's missing** — as real design system components, not throwaway
- **Use inline styles** — no Tailwind, no CSS modules
- **Zero hardcoded values** — every visual value from design tokens
- **No gratuitous shadows** — keep surfaces flat unless intentionally creating hierarchy
- **Prototype pages are exploratory** — but components they use are production-quality

## Snapshot Versioning

Before modifying an existing prototype in Extend mode, create a snapshot:

1. Check for existing `[project]-v*` directories
2. Copy: `cp -r app/prototypes/[project]/ app/prototypes/[project]-v[N]/`
3. Update snapshot README status to `archived`
4. Confirm to user: `Snapshot saved: v[N] → /prototypes/[project]-v[N]`

## User Input Required

$ARGUMENTS

---

Please provide requirements for the prototype. You can give me:
- **Verbal description** — describe what you want and I'll ask follow-up questions
- **UX brief path** — path to a brief from `/ux-brief-generator`
- **External URL** — spec or requirements document
- **Meeting transcript** — I'll extract feedback and action items

I'll ask about theme, device, fidelity, and details before building.
