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
          {/* Background Variations */}
          {/* Common Use Cases */}
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

## User Input Required

$ARGUMENTS

---

Please specify what you'd like to add or update in the design system. I'll coordinate with other skills as needed.
