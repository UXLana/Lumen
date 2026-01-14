---
name: design-system-builder
description: Build and maintain the MTR Design System shell, documentation UI, and token visualization pages. Use this skill when working on the design system infrastructure itself - navigation, layout, shared components, or token pages. This skill orchestrates integration of icons and components created by other skills.
---

# Design System Builder

Build and maintain the MTR Design System documentation shell, navigation, and token visualization pages.

## Scope

This skill owns:
- **Shell/Layout**: `StyleguideLayout`, sidebar navigation, header
- **Shared Components**: `CodeBlock`, `SpecTable`, `Playground`, `PillButton`
- **Navigation**: `navSections` structure, routing
- **Token Pages**: `/design-system/colors`, `/typography`, `/spacing`, etc.
- **Integration Patterns**: How icons and components get added to the system

This skill does NOT own:
- Actual icon SVG creation → use `icon-generator`
- Actual component implementation → use `component-generator`

## File Ownership

```
/app/design-system/
  shared.tsx              ← THIS SKILL OWNS
  page.tsx                ← THIS SKILL OWNS (landing page)
  colors/page.tsx         ← THIS SKILL OWNS
  typography/page.tsx     ← THIS SKILL OWNS
  spacing/page.tsx        ← THIS SKILL OWNS
  radius/page.tsx         ← THIS SKILL OWNS
  shadows/page.tsx        ← THIS SKILL OWNS
  breakpoints/page.tsx    ← THIS SKILL OWNS
  icons/page.tsx          ← THIS SKILL OWNS (icon gallery, not icons themselves)
```

## Navigation Structure

The sidebar navigation is defined in `shared.tsx`:

```tsx
export const navSections = [
  {
    id: 'foundations',
    title: 'Foundations',
    items: [
      { id: 'colors', label: 'Colors', href: '/design-system/colors' },
      { id: 'typography', label: 'Typography', href: '/design-system/typography' },
      { id: 'spacing', label: 'Spacing', href: '/design-system/spacing' },
      { id: 'radius', label: 'Border Radius', href: '/design-system/radius' },
      { id: 'shadows', label: 'Shadows', href: '/design-system/shadows' },
      { id: 'breakpoints', label: 'Breakpoints', href: '/design-system/breakpoints' },
      { id: 'icons', label: 'Icons', href: '/design-system/icons' },
    ],
  },
  {
    id: 'components',
    title: 'Components',
    items: [
      // Components are added here by component-generator
      { id: 'avatar', label: 'Avatar', href: '/components/avatar' },
      { id: 'banner', label: 'Banner', href: '/components/banner' },
      { id: 'button', label: 'Button', href: '/components/button' },
      // ...
    ],
  },
]
```

## Adding a New Component to Navigation

When `component-generator` creates a new component, update `shared.tsx`:

1. Add to `navSections.components.items`:
```tsx
{ id: 'tooltip', label: 'Tooltip', href: '/components/tooltip' },
```

2. Add icon to `iconMap` (if custom icon needed):
```tsx
const iconMap: Record<string, React.FC> = {
  // ...existing
  tooltip: IconTooltip,
}
```

## StyleguideLayout

The main layout wrapper for all documentation pages:

```tsx
<StyleguideLayout
  title="Page Title"
  description="Brief description of this page."
  activeId="page-id"  // Must match navSections item id
  activeTab={activeTab}
  onTabChange={setActiveTab}
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'specs', label: 'Specifications' },
    { id: 'code', label: 'Code' },
  ]}
>
  {/* Tab content */}
</StyleguideLayout>
```

## Shared Components

### CodeBlock
```tsx
<CodeBlock>{`const code = "here"`}</CodeBlock>
```
- Syntax highlighting
- Copy button
- Monospace font

### SpecTable
```tsx
<SpecTable
  headers={['Property', 'Value', 'Notes']}
  rows={[
    ['Height', '48px', 'Large variant'],
  ]}
/>
```

### Playground
```tsx
<Playground
  preview={<Component />}
  code={`<Component />`}
  previewBackground={colors.neutral[50]}
/>
```
- Toggle between Preview and Code views
- Uses SegmentedControl

### PillButton
```tsx
<PillButton isActive={selected} onClick={() => setSelected(true)}>
  Option
</PillButton>
```
- For property selectors in demos

## Shared Styles

```tsx
import { sharedStyles } from '../shared'

// Section container
<section style={sharedStyles.section}>

// Headings
<h2 style={sharedStyles.sectionTitle}>Title</h2>
<p style={sharedStyles.sectionDescription}>Description</p>

// Cards
<div style={sharedStyles.card}>

// Tables
<table style={sharedStyles.table}>
  <th style={sharedStyles.th}>
  <td style={sharedStyles.td}>

// Layout
<div style={sharedStyles.grid}>
<div style={sharedStyles.row}>
```

## Token Page Template

For foundation pages (colors, typography, etc.):

```tsx
'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable } from '../shared'
import { colors, tokenName } from '@/styles/design-tokens'

export default function TokenNamePage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <StyleguideLayout
      title="Token Name"
      description="Description of this token category."
      activeId="token-id"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'specs', label: 'Specifications' },
        { id: 'code', label: 'Code' },
      ]}
    >
      {activeTab === 'overview' && (
        <>
          {/* Visual examples of tokens */}
        </>
      )}

      {activeTab === 'specs' && (
        <>
          {/* Token values table */}
          <SpecTable
            headers={['Token', 'Value', 'Usage']}
            rows={[
              ['token.name', '#value', 'Description'],
            ]}
          />
        </>
      )}

      {activeTab === 'code' && (
        <>
          <CodeBlock>{`import { tokenName } from '@/styles/design-tokens'`}</CodeBlock>
        </>
      )}
    </StyleguideLayout>
  )
}
```

## Integration Checklist

When a new icon is added (by `icon-generator`):
- [ ] Icon added to `/components/Icons/Icons.tsx`
- [ ] Icon added to `iconCategories` in `/app/design-system/icons/page.tsx`
- [ ] Icon added to code imports list in icons page

When a new component is added (by `component-generator`):
- [ ] Component created in `/components/ComponentName/`
- [ ] Component exported from `/components/index.ts`
- [ ] Navigation updated in `shared.tsx` → `navSections.components.items`
- [ ] Icon added to `iconMap` in `shared.tsx` (optional)
- [ ] Documentation page created at `/app/components/component-name/page.tsx`

## Design Tokens Reference

The design system uses tokens from `@/styles/design-tokens`. See `references/design-tokens.md` for complete inventory.

Quick reference:
- `colors.brand.primary` - #13352C
- `colors.text.highEmphasis` - rgba(0,0,0,0.95)
- `borderRadius.md` - 8px
- `spacing[4]` - 16px
- `typography.heading.h3` - heading style object
- `transitionPresets.default` - 200ms ease-out

## Reference Files

- **Design tokens:** See `references/design-tokens.md`
- **Documentation patterns:** See `references/documentation-patterns.md`
