# MTR Design System — Claude Code Context

You are working inside the MTR Design System, the official component library for Metrc products.
Your job is to build UIs using these components and tokens correctly. Do not invent your own
components or hardcode design values — use what the system provides.

## Golden Rules

1. **Always use design tokens.** Never hardcode colors, spacing, font sizes, or radii. Import from `styles/design-tokens.ts`.
2. **Always use existing components.** Check `components/index.ts` before building anything from scratch.
3. **Accessibility is non-negotiable.** This is a government compliance platform — WCAG 2.2 AA minimum. Every interactive element needs keyboard support, focus indicators, and ARIA attributes.
4. **Use the theme system.** Colors come from CSS variables set by the theme provider. Use `useColors()` hook for dynamic theming — never import raw hex values.

## Active Skills
- `/design-system-builder` - Main orchestrator
- `/component-generator` - Create components
- `/icon-generator` - Create SVG icons
- `/figma-token-extractor` - Extract tokens from Figma files
- `/design-accessibility` - Accessibility audits
- `/confluence-to-prototype-spec` - Compile Confluence pages into structured prototype specs
- `/prototype-builder` - Build prototypes from specs, Confluence, or verbal descriptions
- `/ux-brief-generator` - Research-first UX brief compiler with gap analysis and completeness scoring
- `/component-documenter` - Generate dual-format (human + LLM) component documentation with YAML frontmatter, prop tables, token maps, and accessibility specs
- `/theme-generator` - Generate a complete product theme from a single brand color with intelligent color recommendations
- `/package-validator` - Pre-publish validation: barrel exports, token resolution, theme completeness, CLAUDE.md accuracy, package.json sanity

## How to Import

```tsx
// Components — always import from the barrel file
import { Button, Input, DataTable, Select, Avatar } from '@/components'

// Design tokens
import { colors, spacing, typography, borderRadius, shadows, breakpoints } from '@/styles/design-tokens'

// Theme hooks (for dynamic theming)
import { useColors, useTheme, useTypography, useSpacing } from '@/styles/themes'
```

## Available Components

### Form Controls
- **Input** — Text input with label, assistive text, error states, prefix/suffix
- **Select** — Dropdown select with search, multi-select, option groups
- **Combobox** — Searchable combo box with typeahead, async loading, create-new
- **Textarea** — Multi-line text input with character count, auto-resize
- **Checkbox** / **CheckboxGroup** — Single or grouped checkboxes with indeterminate state
- **Radio** / **RadioGroup** — Single or grouped radio buttons
- **Switch** — Toggle switch with label

### Actions
- **Button** / **ButtonGroup** — emphasis: `"high"` (filled) | `"mid"` (teal) | `"low"` (text). Add `destructive` prop for danger actions. Sizes: `"md"` | `"lg"`
- **Link** — Styled anchor with icon support
- **SegmentedControl** — Toggle between 2-5 options. Use `segments` prop (not `items`): `segments={[{ id, label }]}`. `onChange` receives the segment ID string as first arg.

### Data Display
- **DataTable** — Full-featured table with sorting, filtering, pagination, row selection, card view toggle
- **StatsCard** / **StatsCardGroup** — KPI display with trend indicators
- **DetailField** — Label-value pairs for detail views
- **Badge** — Status indicators (success, warning, error, info, neutral)
- **Chip** / **ChipGroup** — Filterable tags with selection states
- **Avatar** / **AvatarGroup** — User avatars with initials fallback
- **ProgressBar** — Determinate/indeterminate progress indicator
- **Skeleton** — Loading placeholder

### Navigation
- **Header** — App header with logo, navigation, user menu
- **LeftNav** — Sidebar navigation with sections, icons, collapse
- **Tab** / **TabBar** — Horizontal tab navigation
- **Pagination** — Page navigation for lists/tables
- **Stepper** — Linear and non-linear step indicators

### Feedback
- **Banner** — variant: `"info"` | `"success"` | `"warning"` | `"error"`. Content goes as `children` (not `description`). Optional `title`, `dismissible`, `onDismiss`
- **Toast** — Temporary notifications (use `useToast()` hook)
- **ConfirmDialog** — Confirmation modal with cancel/confirm actions
- **AssistiveMessage** — Inline helper/error text for form fields
- **EmptyState** — Placeholder for empty views with icon, title, action

### Layout
- **Divider** — Horizontal/vertical separator
- **FullScreenModal** — Full-screen overlay with panel layout
- **Accordion** / **AccordionItem** — Collapsible content sections
- **ListItem** / **List** — Structured list with leading/trailing content

### Specialized
- **TaskModal** — Full-screen multi-step workflow modal with horizontal/vertical navigation, 1-3 column layouts, mobile ProgressBar collapse
- **ComplianceBanner** — Regulatory compliance status banner
- **CollectionToolbar** — Toolbar for collection views (search, filter, sort, view toggle)
- **ChatPanel** — AI assistant chat interface
- **MarketplaceCard** — App marketplace listing card
- **ProductCard** — Product display card
- **BrandBanner** — Full-width branded hero banner
- **ImageCarousel** — Image gallery with navigation

## Component Selection Guide

When building a UI, use this guide to pick the right component. If two components seem similar, check the "Use Instead" column for the boundary between them.

### Feedback & Messages

| Scenario | Component | Key Config |
|----------|-----------|------------|
| Persistent page-level message (info, warning, error, success) | **Banner** | `variant`, `title`, `dismissible` |
| Temporary notification after a user action ("Saved", "Deleted") | **Toast** | `useToast()` → `addToast({ message, variant })` |
| Inline validation or help text next to a form field | **AssistiveMessage** | Pair with `Input` or `Select` |
| Confirmation before a destructive action | **ConfirmDialog** | `destructive`, `onConfirm`, `onCancel` |
| Empty view with call-to-action | **EmptyState** | `icon`, `title`, `action` |

### Selection & Dropdowns

| Scenario | Component | Key Config |
|----------|-----------|------------|
| <15 predefined options | **Select** | `options`, `onChange` |
| 15+ options, or user needs to search/filter | **Combobox** | `onQueryChange`, `loading` for async |
| 2-5 mutually exclusive inline options | **SegmentedControl** | `segments={[{ id, label }]}` |
| Boolean on/off toggle | **Switch** | `checked`, `onChange` |
| Single choice from a short list | **Radio** / **RadioGroup** | `value`, `onChange` |
| Multiple selections from a list | **Checkbox** / **CheckboxGroup** | `checked`, `onChange` |

### Multi-Step Flows

| Scenario | Component | Key Config |
|----------|-----------|------------|
| Short inline stepper (2-5 steps, fits on page) | **Stepper** | `steps`, `activeStep`, `variant="linear"` |
| Full-screen guided workflow (3+ steps, substantial content) | **TaskModal** | `steps`, `activeStep`, `open`, `orientation` |
| Full-screen overlay without step navigation | **FullScreenModal** | `open`, `onClose` |
| Collapsible sections (no step progression) | **Accordion** | `defaultExpandedIds={['first']}` — always open one by default |

### Data Display

| Scenario | Component | Key Config |
|----------|-----------|------------|
| Multi-column data with sort/filter/pagination | **DataTable** | `columns`, `data`, `rowKey` (required), `caption` (a11y) |
| Label-value pairs for a single record | **DetailField** | `label`, `value` |
| KPI metrics with trends | **StatsCard** | `value`, `trend` |
| Static status indicator ("Active", "Pending") | **Badge** | `variant` — non-interactive, read-only |
| Interactive filter tags | **Chip** / **ChipGroup** | `selected`, `onSelect`, `removable` |
| Vertical list with actions | **ListItem** / **List** | Leading/trailing content slots |

### Actions

| Scenario | Component | Key Config |
|----------|-----------|------------|
| Primary/secondary page actions | **Button** | `emphasis="high"` (1 per section), `"low"` for cancel |
| Destructive action (delete, revoke) | **Button** | `emphasis="high" destructive` — pair with ConfirmDialog |
| Inline text navigation | **Link** | Semantic anchor, not a button |
| Form action row (cancel + submit) | **ButtonGroup** | `spacing="form" align="end"` |

### Navigation

| Scenario | Component | Key Config |
|----------|-----------|------------|
| Switching between content panels | **Tab** / **TabBar** | `tabs`, `onTabChange` |
| App sidebar navigation | **LeftNav** | `sections` with icons |
| App header bar | **Header** | `title`, `navigation`, user menu |
| Page-level pagination | **Pagination** | `total`, `page`, `onPageChange` |

## Design Token Reference

### Spacing (use `spacing.{key}`)
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

### Typography (use `typography.{category}.{key}`)
- **Display**: `typography.display['2xl']`, `xl`, `lg`, `md`, `sm`, `xs` — Page heroes
- **Heading**: `typography.heading.h1` through `h6` — Section headings (h1=32px → h6=16px)
- **Body**: `typography.body.xl`, `lg`, `md`, `sm`, `xs` — Content text
- **Label**: `typography.label.lg`, `md`, `sm`, `xs` — Form labels, UI labels
- **Code**: `typography.code.md`, `sm` — Code blocks, technical values

Apply with spread: `style={{ ...typography.heading.h2 }}`

### Colors (use `colors.{category}.{variant}`)
- `colors.brand.default` — Primary brand color
- `colors.surface.light` — Page background
- `colors.surface.lightDarker` — Card/elevated background
- `colors.text.highEmphasis.onLight` — Primary text
- `colors.text.lowEmphasis.onLight` — Secondary text
- `colors.text.disabled.onLight` — Disabled/placeholder text
- `colors.border.lowEmphasis.onLight` — Standard borders
- `colors.border.midEmphasis.onLight` — Medium-emphasis borders
- `colors.border.highEmphasis.onLight` — Strong borders
- `colors.status.success` / `warning` / `important` / `info` — Status colors

### Border Radius (use `borderRadius.{size}`)
- `borderRadius.sm` — Subtle rounding (buttons, inputs)
- `borderRadius.md` — Cards, dropdowns
- `borderRadius.lg` — Modals, panels
- `borderRadius.full` — Circular (avatars, pills)

### Shadows (use `shadows.{size}`)
- `shadows.sm` — Subtle lift (cards)
- `shadows.md` — Dropdowns, popovers
- `shadows.lg` — Modals, dialogs

## Layout Patterns

When building pages, follow these patterns:

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
  <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'flex-end' }}>
    <Button emphasis="low">Cancel</Button>
    <Button emphasis="high">Save</Button>
  </div>
</div>
```

### Data Page (table with toolbar)
```tsx
<CollectionToolbar
  tabs={tabs}
  actions={actions}
  onSearch={handleSearch}
/>
<DataTable
  columns={columns}
  data={rows}
  selectable
  sortable
  paginated
/>
```

## Accessibility Checklist

Before considering any UI complete, verify:

- [ ] All interactive elements are keyboard accessible (Tab, Enter, Space, Escape)
- [ ] Focus indicators are visible on all focusable elements
- [ ] Color is never the only way to convey information
- [ ] Text meets 4.5:1 contrast ratio (3:1 for large text)
- [ ] Form inputs have visible labels (not just placeholders)
- [ ] Error messages are descriptive and associated with their inputs
- [ ] Images have alt text
- [ ] Modals trap focus and return focus on close
- [ ] Loading states are announced to screen readers
- [ ] Touch targets are at least 44x44px

## What NOT to Do

- **Don't create custom buttons, inputs, or selects** — use the DS components
- **Don't hardcode `#hex` colors** — use `colors.*` tokens
- **Don't use arbitrary `px` values for spacing** — use `spacing[n]` tokens
- **Don't use inline font styles** — use `typography.*` tokens
- **Don't ignore error states** — every form needs validation feedback
- **Don't skip empty states** — use the EmptyState component for zero-data views
- **Don't build modals from scratch** — use ConfirmDialog, FullScreenModal, or TaskModal
- **Don't build custom step wizards** — use Stepper (inline) or TaskModal (full-screen)

## File Conventions

- Components live in `components/{Name}/{Name}.tsx`
- One component per folder with its own `index.ts`
- New pages go in `app/` following Next.js App Router conventions
- Prototype pages go in `app/prototypes/{name}/`

## Detailed Prop Reference

Key callback signatures and prop types for AI agent code generation:

- **Input** `onChange`: `(value: string, event: ChangeEvent) => void` — value-first, NOT event-first
- **Checkbox** `onChange`: `(checked: boolean, event: ChangeEvent) => void` — checked-first
- **Select** `onChange`: `(value: string) => void`
- **SegmentedControl**: `segments={[{ id, label, disabled? }]}`, `onChange: (segmentId: string) => void`
- **TabBar**: `tabs={[{ id, label, icon?, badge?, disabled? }]}`, `onTabChange: (tabId: string) => void`
- **DataTable**: `rowKey: (row, i) => string`, `onSelectionChange?: (keys: Set<string>) => void`
- **Toast**: use `useToast()` hook → `addToast({ message, variant, duration, action? })`
- **TaskModal**: `open`, `onClose`, `steps: TaskStep[]`, `activeStep: number`, `onStepChange: (index: number) => void`, `orientation: 'horizontal' | 'vertical'`, `columns: 1 | 2 | 3`, `clickable`
- **Accordion**: `defaultExpandedIds: string[]` — always set at least one ID so content is visible on load
