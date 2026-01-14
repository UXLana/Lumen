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
- **Button** - Primary, secondary, ghost variants with emphasis levels
- **Avatar** - User/entity representation with sizes and fallback
- **Tab** - Individual tab with active/inactive states
- **Banner** - Info, success, warning, error notifications
- **Badge** - Status labels with filled/outlined/subtle variants and semantic colors
- **Icons** - 30+ icons (see `/components/Icons/Icons.tsx`)
- **SegmentedControl** - Tab-style selection control

### Molecules (Available)
- **TabGroup** - Container for Tab components

### Organisms (Available)
- **MarketplaceCard** - App store card (default/compact/horizontal variants)

### To Be Created
If you need these, create them as atoms first:
- Input, Label, Checkbox, Radio, Toggle
- Select, Textarea, FormField
- Card, Modal, Dropdown, Tooltip, Popover

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
      <div ref={ref} style={{ display: 'flex', gap: spacing[2] }}>
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
    padding: `${spacing[2]} ${spacing[3]}`,
    fontSize: typography.body.sm.fontSize,
  },
  md: {
    height: '40px',
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.body.md.fontSize,
  },
  lg: {
    height: '48px',
    padding: `${spacing[4]} ${spacing[5]}`,
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
          background: colors.neutral[200],
          text: colors.text.disabled,
          border: colors.border.light,
        }
      }
      if (onDark) {
        return {
          background: isHovered ? 'rgba(255,255,255,0.1)' : 'transparent',
          text: colors.text.highEmphasisOnDark,
          border: colors.border.light,
        }
      }
      return {
        background: isHovered ? colors.neutral[100] : colors.background.default,
        text: colors.text.highEmphasis,
        border: colors.border.light,
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
backgroundColor: colors.brand.primary
padding: spacing[4]
borderRadius: borderRadius.md
fontSize: typography.body.md.fontSize
transition: transitionPresets.default

// ❌ Wrong - never hardcode values
backgroundColor: '#13352C'
padding: '16px'
borderRadius: '8px'
fontSize: '16px'
transition: '200ms ease-out'
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

Use the standard focus color:

```tsx
// Focus ring styles
const focusRingStyles: React.CSSProperties = {
  position: 'absolute',
  inset: '-3px',
  borderRadius: borderRadius.md,
  border: '3px solid #3086BF',  // Standard focus color
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

## Reference Files

- **Component patterns:** See `references/component-patterns.md`
- **Design tokens:** See `references/design-tokens.md`
