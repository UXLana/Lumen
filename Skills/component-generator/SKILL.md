---
name: component-generator
description: Create production-ready React components for the MTR Design System using atomic design principles. Use this skill when building new UI components like buttons, inputs, cards, modals, etc. Generates TypeScript components that build on existing primitives. After creating a component, integrates with design-system-builder patterns.
---

# Component Generator

Create production-ready React components for the MTR Design System using atomic design principles, strict token compliance, and accessibility.

## Atomic Design Principles

Components MUST be built atomically, composing from existing primitives:

```
Atoms → Molecules → Organisms → Templates → Pages
```

### Component Hierarchy

| Level | Description | Examples |
|-------|-------------|----------|
| **Atoms** | Smallest primitives, single-purpose | Button, Icon, Input, Label, Badge |
| **Molecules** | Groups of atoms working together | SearchField (Input + Icon + Button), FormField (Label + Input + ErrorText) |
| **Organisms** | Complex UI sections | Header, Sidebar, Card, Modal, DataTable |
| **Templates** | Page-level layouts | StyleguideLayout, DashboardLayout |

### Rules

1. **Never duplicate** - Check if primitive exists before building
2. **Compose up** - Build molecules from atoms, organisms from molecules
3. **Add missing primitives** - If a required atom doesn't exist, create it first
4. **Reuse relentlessly** - Import and use existing components

## Workflow

### Before Building - Audit Existing Components

```tsx
// Check /components/index.ts for existing exports
// Check /components/ directory for available primitives
```

**Questions to ask:**
- Does this component already exist?
- Can I compose this from existing components?
- What primitives am I missing that should be added first?

### Step 1: Identify Required Primitives

For a new component like `SearchField`:
- Need: `Input` (exists? ✓), `IconSearch` (exists? ✓), `Button` (exists? ✓)
- Compose from existing atoms

For a new component like `Tooltip`:
- Need: `Portal` (exists? ✗) → Create `Portal` atom first
- Then create `Tooltip` using the new `Portal`

### Step 2: Create Missing Primitives First

If a primitive is missing, add it to the design system:
1. Create the atom component
2. Export from `/components/index.ts`
3. Add documentation page
4. THEN proceed to build the molecule/organism

### Step 3: Build the Component

1. **Create the component** (this skill)
   - Import existing primitives
   - Compose into new component
   - Use design tokens exclusively
   - Implement proper accessibility
   - Handle all states (hover, focus, disabled, loading)

2. **Integrate with design system** (follow `design-system-builder` patterns)
   - Export from `/components/index.ts`
   - Add to navigation in `shared.tsx`
   - Create documentation page

## Existing Components Inventory

Before creating any component, check existing primitives:

### Atoms (Available)
- **Accordion** - Expandable content sections with AccordionItem children
- **AssistiveMessage** - Helper/error text for form fields
- **Avatar** - User/entity representation with sizes and fallback
- **Badge** - Status labels with filled/outlined/subtle variants and semantic colors
- **Banner** - Info, success, warning, error notifications
- **Button** - Primary, secondary, ghost variants with emphasis levels
- **Checkbox** - With CheckboxGroup for multi-select
- **Divider** - Visual separator (horizontal/vertical)
- **Icons** - 30+ icons (see `/components/Icons/Icons.tsx`)
- **Input** - Text input with size variants, error states, icons
- **Link** - Navigation links with variant styles
- **Radio** - With RadioGroup for single-select
- **SegmentedControl** - Tab-style selection control
- **Switch** - Toggle on/off control
- **Tab** - Individual tab with active/inactive states (also TabBar, TabIcon)
- **Textarea** - Multi-line text input

### Molecules (Available)
- **Chip** - With ChipGroup for tag/filter sets
- **ComplianceBanner** - Regulatory compliance notification
- **DetailField** - Label + value display pair
- **EmptyState** - Placeholder for empty content areas
- **ImageCarousel** - Touch-friendly image slideshow with thumbnails/dots
- **ListItem** - With List container for structured lists
- **Pagination** - Page navigation controls
- **ProgressBar** - Visual progress indicator
- **Skeleton** - Loading placeholder

### Organisms (Available)
- **Combobox** - Searchable dropdown with useCombobox hook
- **ConfirmDialog** - Confirmation modal with actions
- **DataTable** - Sortable, filterable data grid
- **FullScreenModal** - With FullScreenModalPanel for complex flows
- **Header** - App header with SearchInput, IconButton, OrgDropdown
- **LeftNav** - Side navigation panel
- **MarketplaceCard** - App store card (default/compact/horizontal variants)
- **ProductCard** - Product display card
- **Select** - Dropdown selection
- **StatsCard** - Metric display with StatsCardGroup
- **Stepper** - Multi-step flow (LinearStepper, NonLinearStepper)
- **Toast** - Notification toast with useToast hook
- **Upload** - File upload with DropZone, progress, useUpload hook

### Still Needed
If you need these, create them as atoms first:
- Label, Toggle
- FormField (compose from Label + Input/Select + AssistiveMessage)
- Card (generic — ProductCard, StatsCard, MarketplaceCard exist as specialized)
- Tooltip, Popover, Dropdown (generic)

## Token Naming Convention

Colors follow the pattern: `colors.<group>.<level>.<surface>`

Where `<surface>` is `.onLight` or `.onDark`:

```tsx
// Text
colors.text.highEmphasis.onLight   // Primary text on light backgrounds
colors.text.highEmphasis.onDark    // Primary text on dark backgrounds
colors.text.lowEmphasis.onLight    // Secondary text
colors.text.disabled.onLight       // Disabled text
colors.text.action.enabled         // Interactive text (links, buttons)

// Borders
colors.border.lowEmphasis.onLight  // Subtle borders
colors.border.midEmphasis.onLight  // Default borders
colors.border.highEmphasis.onLight // Strong borders

// Surfaces
colors.surface.light               // Default background
colors.surface.lightDarker         // Slightly darker background
colors.surface.disabled.onLight    // Disabled background

// Brand
colors.brand.default               // Primary brand color
colors.brand.lighter               // Lighter brand variant
colors.brand.darker                // Darker brand variant

// Interactive states
colors.hover.onLight               // Hover background on light
colors.hover.onDark                // Hover background on dark
colors.focusBorder.onLight         // Focus ring color
colors.selectedHighlight           // Selected state highlight

// Scrim
colors.scrim                       // Overlay/backdrop
```

### Spacing uses named keys (NOT numeric indices)

```tsx
spacing.xs    // 8px
spacing.sm    // 12px
spacing.md    // 16px
spacing.lg    // 20px
spacing.xl    // 24px
spacing['2xl'] // 32px
spacing['3xl'] // 40px
```

## Composition Example

Building a `SearchField` molecule from existing atoms:

```tsx
'use client'

import React, { forwardRef, useState } from 'react'
import { Input } from '@/components/Input'  // Atom
import { Button } from '@/components/Button'  // Atom
import { IconSearch, IconX } from '@/components/Icons'  // Atoms
import { spacing } from '@/styles/design-tokens'

export interface SearchFieldProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onClear?: () => void
  placeholder?: string
}

export const SearchField = forwardRef<HTMLDivElement, SearchFieldProps>(
  ({ value, onChange, onSearch, onClear, placeholder = 'Search...' }, ref) => {
    return (
      <div ref={ref} style={{ display: 'flex', gap: spacing.xs }}>
        {/* Compose from existing atoms */}
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          leftIcon={<IconSearch size="sm" />}
          rightIcon={value && <IconX size="sm" onClick={onClear} />}
        />
        <Button emphasis="high" onClick={() => onSearch?.(value || '')}>
          Search
        </Button>
      </div>
    )
  }
)

SearchField.displayName = 'SearchField'
```

## File Structure

```
/components/
  ComponentName/
    ComponentName.tsx    # Main component with 'use client'
    index.ts             # Re-exports
```

### index.ts Pattern

```tsx
export { ComponentName } from './ComponentName'
export type { ComponentNameProps } from './ComponentName'
```

## Component Template

```tsx
'use client'

import React, { forwardRef, useState } from 'react'
import {
  colors,
  spacing,
  borderRadius,
  typography,
  fontFamilies,
  transitionPresets,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Component size variants
 */
export type ComponentSize = 'sm' | 'md' | 'lg'

/**
 * Component props
 */
export interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size variant */
  size?: ComponentSize
  /** Display on dark background */
  onDark?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Loading state */
  loading?: boolean
  /** Children content */
  children?: React.ReactNode
}

// =============================================================================
// SIZE CONFIGURATIONS
// =============================================================================

const sizeConfig = {
  sm: {
    height: '32px',
    padding: `${spacing.xs} ${spacing.sm}`,
    fontSize: typography.body.sm.fontSize,
  },
  md: {
    height: '40px',
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.body.md.fontSize,
  },
  lg: {
    height: '48px',
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: typography.body.lg.fontSize,
  },
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ComponentName
 *
 * Description of what this component does and when to use it.
 *
 * @example
 * <ComponentName size="md">Content</ComponentName>
 */
export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  (
    {
      size = 'md',
      onDark = false,
      disabled = false,
      loading = false,
      children,
      className,
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false)

    // Get size-specific config
    const config = sizeConfig[size]

    // Determine colors based on state and theme
    const getColors = () => {
      if (disabled) {
        return {
          background: colors.surface.disabled.onLight,
          text: colors.text.disabled.onLight,
          border: colors.border.lowEmphasis.onLight,
        }
      }
      if (onDark) {
        return {
          background: isHovered ? 'rgba(255,255,255,0.1)' : 'transparent',
          text: colors.text.highEmphasis.onDark,
          border: colors.border.lowEmphasis.onDark,
        }
      }
      return {
        background: isHovered ? colors.hover.onLight : colors.surface.light,
        text: colors.text.highEmphasis.onLight,
        border: colors.border.lowEmphasis.onLight,
      }
    }

    const colorScheme = getColors()

    // Base styles using tokens only
    const baseStyles: React.CSSProperties = {
      // Layout
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',

      // Size
      height: config.height,
      padding: config.padding,

      // Typography
      fontFamily: fontFamilies.body,
      fontSize: config.fontSize,
      fontWeight: 500,

      // Colors
      backgroundColor: colorScheme.background,
      color: colorScheme.text,
      border: `1px solid ${colorScheme.border}`,

      // Shape
      borderRadius: borderRadius.md,

      // Interaction
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: transitionPresets.default,
      opacity: disabled ? 0.6 : 1,

      // User overrides
      ...style,
    }

    // Event handlers
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!disabled) setIsHovered(true)
      onMouseEnter?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false)
      onMouseLeave?.(e)
    }

    return (
      <div
        ref={ref}
        className={className}
        style={baseStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-disabled={disabled}
        {...props}
      >
        {loading ? (
          <span>Loading...</span>
        ) : (
          children
        )}
      </div>
    )
  }
)

ComponentName.displayName = 'ComponentName'

// =============================================================================
// EXPORTS
// =============================================================================

export default ComponentName
```

## Token Usage Rules

### ALWAYS use tokens

```tsx
// ✅ Correct
backgroundColor: colors.brand.default
padding: spacing.md
borderRadius: borderRadius.md
fontSize: typography.body.md.fontSize
transition: transitionPresets.default
border: `1px solid ${colors.border.lowEmphasis.onLight}`

// ❌ Wrong - never hardcode values
backgroundColor: '#13352C'
padding: '16px'
borderRadius: '8px'
fontSize: '16px'
transition: '200ms ease-out'
border: '1px solid #E0E0E0'
```

### Common Token Mistakes

```tsx
// ❌ OLD / BROKEN                    → ✅ CORRECT
colors.brand.primary                 → colors.brand.default
colors.neutral[100]                  → colors.hover.onLight
colors.neutral[200]                  → colors.surface.disabled.onLight
colors.text.disabled                 → colors.text.disabled.onLight
colors.text.highEmphasis             → colors.text.highEmphasis.onLight
colors.text.highEmphasisOnDark       → colors.text.highEmphasis.onDark
colors.border.light                  → colors.border.lowEmphasis.onLight
colors.background.default            → colors.surface.light
colors.stroke.*                      → colors.border.*
colors.overlay                       → colors.scrim
spacing[2]                           → spacing.xs
spacing[4]                           → spacing.md
```

### Import from design-tokens

```tsx
import {
  colors,
  spacing,
  borderRadius,
  typography,
  fontFamilies,
  fontWeights,
  shadows,
  transitionPresets,
  zIndex,
} from '@/styles/design-tokens'
```

## Standard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `variant` | string union | varies | Visual variant |
| `emphasis` | `'high' \| 'mid' \| 'low'` | `'high'` | For buttons |
| `onDark` | `boolean` | `false` | Dark background mode |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state |
| `fullWidth` | `boolean` | `false` | Fill container |

## State Management

### Hover/Press Pattern

```tsx
const [isHovered, setIsHovered] = useState(false)
const [isPressed, setIsPressed] = useState(false)

const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
  if (!disabled) setIsHovered(true)
  onMouseEnter?.(e)
}

const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
  setIsHovered(false)
  setIsPressed(false)
  onMouseLeave?.(e)
}

const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
  if (!disabled) setIsPressed(true)
  onMouseDown?.(e)
}

const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
  setIsPressed(false)
  onMouseUp?.(e)
}
```

### State-Based Colors

```tsx
const getStateColors = () => {
  if (disabled) return colorScheme.disabled
  if (isPressed) return colorScheme.pressed
  if (isHovered) return colorScheme.hover
  return colorScheme.enabled
}
```

## Accessibility Requirements

### Keyboard Navigation

```tsx
// For interactive components
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
```

### ARIA Attributes

```tsx
// Disabled state
aria-disabled={disabled}

// Loading state
aria-busy={loading}

// Labels
aria-label="Descriptive label"
aria-labelledby="label-element-id"
aria-describedby="description-element-id"

// Roles (when semantic HTML isn't sufficient)
role="button"
role="tab"
role="tabpanel"
```

### Focus Ring

Use the focus token — never hardcode the color:

```tsx
// Focus ring styles
const focusRingStyles: React.CSSProperties = {
  position: 'absolute',
  inset: '-3px',
  borderRadius: borderRadius.md,
  border: `3px solid ${colors.focusBorder.onLight}`,
  pointerEvents: 'none',
}

// In render
{isFocused && <span style={focusRingStyles} />}
```

## Ref Forwarding

All components MUST support refs:

```tsx
export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  (props, ref) => {
    return <div ref={ref} {...props} />
  }
)
```

## DisplayName

Always set for React DevTools:

```tsx
ComponentName.displayName = 'ComponentName'
```

## Integration Steps

After creating the component:

1. **Export from index**
   ```tsx
   // /components/index.ts
   export { ComponentName } from './ComponentName'
   export type { ComponentNameProps } from './ComponentName'
   ```

2. **Add to navigation** (in `/app/design-system/shared.tsx`)
   ```tsx
   // In navSections.components.items
   { id: 'component-name', label: 'Component Name', href: '/components/component-name' },
   ```

3. **Create documentation page** at `/app/components/component-name/page.tsx`
   - Use `StyleguideLayout` from `design-system-builder`
   - Include Overview, Specs, and Code tabs

## Reference Components

When in doubt, look at these well-implemented components for patterns:

- **Button** (`/components/Button/Button.tsx`) - Complete state handling, emphasis variants, onDark support
- **Input** (`/components/Input/Input.tsx`) - Focus management, error states, icon slots, size variants
- **Switch** (`/components/Switch/Switch.tsx`) - Theme-aware colors, hover/disabled states, accessibility

## Reference Files

- **Component patterns:** See `references/component-patterns.md`
- **Design tokens:** See `references/design-tokens.md`
