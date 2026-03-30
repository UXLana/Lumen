# MTR Design System - Claude Context

## Project Overview
This is the MTR Design System - a React/Next.js component library with design tokens, documentation, and tooling.

## Important Documentation
- **Agentic Architecture**: `.claude/docs/agentic-architecture.md` - The orchestration model for design system work. Update this when adding/modifying agents or skills.

## Key Directories
- `components/` - React components
- `app/` - Next.js pages and component documentation
- `styles/` - Design tokens
- `Skills/` - Skill definitions
- `.claude/commands/` - Slash command skills

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

## Skill Ownership
- Files in `.claude/commands/`, `Skills/`, and `.claude/docs/` are owned by Lana Holston (@UXLana)
- Do not modify, rename, or delete existing skills without Lana's explicit approval
- Do not modify `CLAUDE.md`, `styles/design-tokens.ts`, or `styles/themes/` without Lana's approval
- Team members may create personal skills in their own `~/.claude/commands/` directory
- See `.github/CODEOWNERS` for enforcement via GitHub PR reviews

## Workflow Principles
- **Plan first**: Enter plan mode for any task with 3+ steps or architectural decisions. If something goes sideways, stop and re-plan immediately — don't keep pushing.
- **Verify before done**: Never mark work complete without proving it works (tests pass, visual check, a11y audit). Ask yourself: "Would a staff engineer approve this?"
- **Learn from corrections**: After any user correction, update MEMORY.md with the pattern to prevent repeats.
- **Simplicity first**: Make every change as simple as possible. Find root causes — no temporary fixes. Senior developer standards.
- **Minimal impact**: Changes should only touch what's necessary. Avoid introducing bugs by keeping scope tight.

## Conventions
- Use design tokens from `styles/design-tokens.ts`
- Components follow pattern: `components/{Name}/{Name}.tsx`
- Documentation pages: `app/components/{name}/page.tsx`

## Component API Reference

All components are imported from `mtr-design-system/components`.

### Button
```tsx
<Button size="md" emphasis="high" destructive loading leftIcon={<Icon />}>Label</Button>
```
Props: `size?: 'lg' | 'md'`, `emphasis?: 'high' | 'mid' | 'low'`, `destructive?: boolean`, `loading?: boolean`, `fullWidth?: boolean`, `leftIcon?: ReactNode`, `rightIcon?: ReactNode`, `iconOnly?: boolean`, `onDark?: boolean`

### Input
```tsx
<Input label="Email" size="md" onChange={(value, event) => setValue(value)} />
```
Props: `label?: string`, `size?: 'sm' | 'md' | 'lg'`, `onChange?: (value: string, event: ChangeEvent) => void` (value-first), `error?: boolean`, `errorMessage?: string`, `helperText?: string`, `fullWidth?: boolean`, `startAdornment?: ReactNode`, `endAdornment?: ReactNode`, `required?: boolean`

### Select
```tsx
<Select label="State" options={[{ value: 'co', label: 'Colorado' }]} onChange={(value) => set(value)} />
```
Props: `options: SelectOption[]` (`{ value, label, disabled? }`), `value?: string`, `onChange?: (value: string) => void`, `size?: 'sm' | 'md' | 'lg'`, `error?: boolean`, `errorMessage?: string`, `helperText?: string`, `placeholder?: string`, `fullWidth?: boolean`

### Checkbox
```tsx
<Checkbox label="Agree" checked={v} onChange={(checked, event) => set(checked)} />
```
Props: `label?: string`, `metadata?: string`, `checked?: boolean`, `indeterminate?: boolean`, `onChange?: (checked: boolean, event: ChangeEvent) => void`, `error?: boolean`, `fullWidth?: boolean`

### SegmentedControl
```tsx
<SegmentedControl segments={[{ id: 'a', label: 'Tab A' }]} value="a" onChange={(id) => set(id)} />
```
Props: `segments: SegmentItem[]` (`{ id, label, disabled? }`), `value: string`, `onChange: (segmentId: string) => void`, `size?: 'sm' | 'md' | 'lg'`, `fullWidth?: boolean`, `onDark?: boolean`

### TabBar
```tsx
<TabBar tabs={[{ id: 't1', label: 'Tab 1' }]} activeTab="t1" onTabChange={(id) => set(id)} />
```
Props: `tabs: TabItem[]` (`{ id, label, icon?, badge?, disabled? }`), `activeTab: string`, `onTabChange: (tabId: string) => void`, `align?: 'left' | 'center' | 'right' | 'stretch'`, `onDark?: boolean`, `scrollable?: boolean`

### DataTable
```tsx
<DataTable columns={cols} data={rows} rowKey={(row) => row.id} selectable hoverable />
```
Props: `columns: DataTableColumn<T>[]` (`{ key, header, sortable?, render?, align? }`), `data: T[]`, `rowKey: (row, i) => string`, `display?: 'table' | 'cards' | 'auto'`, `density?: 'compact' | 'default' | 'comfortable'`, `selectable?: boolean`, `selectedKeys?: Set<string>`, `onSelectionChange?: (keys: Set<string>) => void`, `sort?: SortState`, `onSortChange?: (sort) => void`, `loading?: boolean`, `stickyHeader?: boolean`

### Toast (via useToast hook)
```tsx
const { addToast } = useToast()
addToast({ message: 'Saved', variant: 'success', duration: 3000 })
```
Props: `message: string`, `variant?: 'success' | 'error' | 'warning' | 'info'`, `duration?: number`, `position?: 'center' | 'left' | 'right'`, `action?: { label, onClick }`

### Badge
```tsx
<Badge variant="filled" color="success" size="sm">Active</Badge>
```
Props: `variant?: 'filled' | 'outlined' | 'subtle'`, `color?: 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'brand'`, `size?: 'sm' | 'md'`, `icon?: ReactNode`

### Banner
```tsx
<Banner variant="warning" title="Notice" dismissible onDismiss={() => {}}>Message</Banner>
```
Props: `variant?: 'info' | 'success' | 'warning' | 'error'`, `size?: 'md' | 'lg'`, `title?: string`, `dismissible?: boolean`, `onDismiss?: () => void`, `primaryAction?: { label, onClick }`, `secondaryAction?: { label, onClick }`, `onDark?: boolean`

## Token Quick Reference

```ts
import { colors, spacing, borderRadius, borderRadiusSemantics, typography, shadows } from 'mtr-design-system/styles/design-tokens'

// Spacing — static px values, named keys
spacing.xs     // '8px'
spacing.md     // '16px'
spacing.xl     // '24px'

// Colors — CSS var refs, auto-themed
colors.brand.default           // var(--mtr-brand-default)
colors.surface.light           // var(--mtr-surface-light)
colors.text.highEmphasis.onLight
colors.border.lowEmphasis.onLight
colors.action.primary

// Border radius
borderRadius.md                // var(--mtr-radius-md)
borderRadiusSemantics.card     // var(--mtr-comp-radius-card)
borderRadiusSemantics.button   // var(--mtr-comp-radius-button)

// Typography
typography.body.md             // { fontFamily, fontSize, fontWeight, lineHeight }
typography.heading.h2
typography.label.sm
```
