---
name: design-system-builder
description: Build and maintain the MTR Design System shell, documentation UI, and token visualization pages
---

# Design System Builder

## When to Use

- Adding new foundation pages (colors, typography, etc.)
- Adding new component documentation
- Updating design system navigation
- Creating token visualization pages
- Integrating components from prototype handoffs
- Removing components from the design system

## File Ownership

| File Path | Purpose |
|-----------|---------|
| `/app/design-system/shared.tsx` | Layout, sidebar nav, CodeBlock, SpecTable, Playground, iconMap |
| `/app/design-system/page.tsx` | Landing page with foundationItems and componentItems |
| `/app/design-system/[token]/page.tsx` | Foundation pages |
| `/app/components/[component]/page.tsx` | Component documentation pages |
| `/components/index.ts` | Component exports |
| `/components/[ComponentName]/` | Component source files |

## Workflow: Adding a New Component

1. **Create component** at `/components/[ComponentName]/[ComponentName].tsx`
2. **Create index** at `/components/[ComponentName]/index.ts`
3. **Update `/components/index.ts`**: Add exports for component and types
4. **Update `/app/design-system/shared.tsx`**: Add to navSections components items (alphabetically)
5. **Update `/app/design-system/page.tsx`**: Import component, add to componentItems array (alphabetically)
6. **Create documentation page** at `/app/components/[name]/page.tsx`

## Workflow: Removing a Component

1. **Remove from `/app/design-system/page.tsx`**: Remove import and componentItems entry
2. **Remove from `/app/design-system/shared.tsx`**: Remove from navSections
3. **Delete documentation page**: Remove `/app/components/[name]/` directory
4. **Remove from `/components/index.ts`**: Remove exports

## Documentation Page Structure (REQUIRED)

Every component documentation page MUST follow this exact structure with TWO tabs:

### Tab 1: Overview

1. **Quick Start** - Import code examples
2. **Interactive Playground** - Single playground that showcases ALL variants:
   - Preview/Code toggle using `<Playground>` component
   - Properties panel with `<PillButton>` and `<StyledCheckbox>` controls
   - Dynamic background that changes based on selected variant (e.g., gray for inverted)
   - **IMPORTANT**: The playground is the primary showcase for variants - do NOT create separate "Variants" or "Background Variations" sections that duplicate what the playground shows
3. **Design Tokens** - Multiple `<SpecTable>` components showing:
   - Spacing & Dimensions (padding, gaps, sizes)
   - Typography (font, size, weight)
   - Colors (for each variant/state)
   - Animation (duration, easing)

### Tab 2: Implementation

1. **Usage** - Import and basic code examples
2. **Props** - `<SpecTable>` for each exported component's props
3. **Design Guidance** - When to use each variant, accessibility features, Do/Don't best practices

## AVOID REDUNDANCY

- **DO NOT** create separate "Variants" sections if the playground already shows all variants
- **DO NOT** create "Background Variations" sections that duplicate playground functionality
- **DO NOT** create "Common Use Cases" sections - they add bulk without value
- The Interactive Playground should be the single source for exploring all variants and configurations

## Documentation Page Template

```tsx
'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox } from '../../design-system/shared'
import { ComponentName } from '@/components'
import { colors, spacing, typography, borderRadius } from '@/styles/design-tokens'

type PageTab = 'overview' | 'implementation'

export default function ComponentNamePage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')
  // Add state for playground controls

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
  ]

  return (
    <StyleguideLayout
      title="Component Name"
      description="Description of the component and its purpose."
      activeId="component-name"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
    >
      {activePageTab === 'overview' && (
        <>
          {/* Quick Start */}
          {/* Interactive Playground */}
          {/* Design Tokens */}
        </>
      )}

      {activePageTab === 'implementation' && (
        <>
          {/* Usage */}
          {/* Props */}
          {/* Design Guidance with Do/Don't */}
        </>
      )}
    </StyleguideLayout>
  )
}
```

## Key Components for Documentation

- `<Playground preview={} code={} previewBackground={} previewPadding={}>` - Preview/code toggle
- `<SpecTable headers={[]} rows={[]}>` - Specification tables
- `<CodeBlock>{code}</CodeBlock>` - Syntax highlighted code
- `<PillButton isActive={} onClick={}>` - Toggle buttons for controls
- `<StyledCheckbox checked={} onChange={} label="">` - Checkbox controls

## Design Token Tables to Include

1. **Spacing & Dimensions**: padding, margins, gaps, icon sizes, element heights
2. **Typography**: font family, size, weight, line height
3. **Colors**: text colors, backgrounds, borders, hover states (per variant)
4. **Animation**: transition durations, easing functions

## Playground Best Practices

The Interactive Playground should handle ALL variant/background demonstrations:
- Use dynamic `previewBackground` that changes based on selected variant
- For components with surface-specific variants (filled/inverted), automatically switch the background
- Example: `previewBackground={variant === 'inverted' ? colors.neutral[100] : colors.neutral[0]}`
- Include helper text under variant controls explaining the surface requirements

## Temp Component Builder Mode

When receiving prototype handoffs:
1. Create temp components in `/components/temp/[project]/`
2. Track review status in component headers
3. Iterate based on Content/A11y/UX feedback
4. Promote to canonical `/components/` when approved

## Mode: Library Audit

Run a comprehensive audit of the design system library.

### Audit Checklist

- [ ] All components have TypeScript types
- [ ] All components have documentation pages
- [ ] All tokens are used (no orphans)
- [ ] All components use tokens (no hardcoded values)
- [ ] Exports are correctly configured
- [ ] Accessibility requirements documented
- [ ] Documentation uses correct import paths (package name, not @/ aliases)
- [ ] Quick Start sections show both package and alias imports
- [ ] No hardcoded hex colors in components (use design tokens)
- [ ] CSS custom properties map to design tokens (globals.css)

### Import Path Standards

Documentation Quick Start sections should show both import methods:

```tsx
// Package import (recommended for consumers)
import { ComponentName } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { ComponentName } from '@/components'
```

**Why this matters:**
- `@/components` assumes the consumer has the same path alias configured
- External consumers need the package name (`@metrc/design-system`)
- Internal documentation can use either, but should show both options

### Capabilities

- **Inventory management** — Component catalog maintenance, token inventory tracking, icon library organization, pattern documentation
- **Dependency mapping** — Track which components depend on which tokens and other components
- **Redundancy identification** — Find duplicate or overlapping components and tokens
- **Gap analysis** — Identify missing components, undocumented APIs, and token coverage holes

## Mode: UI Polish

Improve the visual design, interactions, and UX of the design system documentation app.

### When to Use

- Improving navigation design (sidebar, active states, mobile drawer)
- Fixing layout issues and responsive breakpoints
- Enhancing visual hierarchy (typography, spacing, color usage)
- Adding/improving interactions (hover, focus, transitions)
- Polishing cards, containers, code blocks, tables
- Improving accessibility (focus states, contrast, reduced motion)

### Interaction Standards

- **Transitions**: 150ms (fast), 200ms (default), 300ms (slow)
- **Hover**: Subtle background changes, no layout shift
- **Focus**: Always visible, ring-2 with primary color
- **Active**: Slight scale reduction (0.98)

### Accessibility Checklist

- [ ] Body text contrast: 4.5:1 minimum
- [ ] All interactive elements focusable
- [ ] Focus order follows reading order
- [ ] Reduced motion respected

### Critical Rules

1. **Always use design tokens** — Never hardcode colors, spacing, radius, etc.
2. **Test at all breakpoints** — 320px, 640px, 768px, 1024px, 1280px
3. **Ensure accessibility** — Focus states, contrast, reduced motion

### What This Mode Does NOT Handle

| Task | Use Instead |
|------|-------------|
| Adding new documented components | Builder mode (default) |
| Creating icons | `/icon-generator` |
| Building UI components | `/component-generator` |
| Updating token values | `/brand-tokens-translator` |

## User Input Required

$ARGUMENTS

---

Please specify what you'd like to add or update in the design system. I'll coordinate with other skills as needed.
