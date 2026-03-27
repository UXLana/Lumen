# MTR Design System — Claude Code Context

You are working inside the MTR Design System, the official component library for Metrc products.
Your job is to build UIs using these components and tokens correctly. Do not invent your own
components or hardcode design values — use what the system provides.

## Golden Rules

1. **Always use design tokens.** Never hardcode colors, spacing, font sizes, or radii. Import from `styles/design-tokens.ts`.
2. **Always use existing components.** Check `components/index.ts` before building anything from scratch.
3. **Accessibility is non-negotiable.** This is a government compliance platform — WCAG 2.2 AA minimum. Every interactive element needs keyboard support, focus indicators, and ARIA attributes.
4. **Use the theme system.** Colors come from CSS variables set by the theme provider. Use `useColors()` hook for dynamic theming — never import raw hex values.

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
- **Upload** — File upload with drag-and-drop, progress, file list

### Actions
- **Button** / **ButtonGroup** — Primary, secondary, tertiary, destructive. Sizes: sm, md, lg
- **Link** — Styled anchor with icon support
- **SegmentedControl** — Toggle between 2-5 options

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
- **Banner** — Info, success, warning, error banners with actions
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
- **ComplianceBanner** — Regulatory compliance status banner
- **CollectionToolbar** — Toolbar for collection views (search, filter, sort, view toggle)
- **ChatPanel** — AI assistant chat interface
- **MarketplaceCard** — App marketplace listing card
- **ProductCard** — Product display card
- **BrandBanner** — Full-width branded hero banner
- **ImageCarousel** — Image gallery with navigation

## Design Token Reference

### Spacing (use `spacing[n]`)
| Token | Value | Use for |
|-------|-------|---------|
| `spacing[1]` | 4px | Tight inner padding, icon gaps |
| `spacing[2]` | 8px | Default inner padding, form field gaps |
| `spacing[3]` | 12px | Compact section padding |
| `spacing[4]` | 16px | Standard section padding, card padding |
| `spacing[6]` | 24px | Section gaps, generous padding |
| `spacing[8]` | 32px | Page section spacing |
| `spacing[10]` | 40px | Large section spacing |
| `spacing[12]` | 48px | Page-level spacing |

### Typography (use `typography.{category}.{size}`)
- **Display**: `typography.display.lg`, `md`, `sm` — Page heroes, marketing
- **Heading**: `typography.heading.xl` through `xs` — Section headings
- **Body**: `typography.body.lg`, `md`, `sm` — Content text
- **Label**: `typography.label.lg`, `md`, `sm` — Form labels, UI labels
- **Code**: `typography.code.md`, `sm` — Code blocks, technical values

Apply with spread: `style={{ ...typography.heading.md }}`

### Colors (use `colors.{category}.{variant}`)
- `colors.brand.default` — Primary brand color
- `colors.surface.light` — Page background
- `colors.surface.lightDarker` — Card/elevated background
- `colors.text.highEmphasis.onLight` — Primary text
- `colors.text.medEmphasis.onLight` — Secondary text
- `colors.text.lowEmphasis.onLight` — Disabled/placeholder text
- `colors.border.default` — Standard borders
- `colors.semantic.success` / `warning` / `error` / `info` — Status colors

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
  <div style={{ flex: 1, padding: spacing[8] }}>
    <Header title="Page Title" />
    <main style={{ marginTop: spacing[6] }}>
      {/* Page content */}
    </main>
  </div>
</div>
```

### Form Layout
```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
  <Input label="Name" required />
  <Select label="Category" options={options} />
  <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-end' }}>
    <Button emphasis="tertiary">Cancel</Button>
    <Button emphasis="primary">Save</Button>
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
- **Don't build modals from scratch** — use ConfirmDialog or FullScreenModal

## File Conventions

- Components live in `components/{Name}/{Name}.tsx`
- One component per folder with its own `index.ts`
- New pages go in `app/` following Next.js App Router conventions
- Prototype pages go in `app/prototypes/{name}/`
