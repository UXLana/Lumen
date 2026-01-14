# MTR Design System - Documentation Patterns

Guidelines for creating documentation pages for the MTR Design System.

## File Locations

```
/app/
  design-system/
    colors/page.tsx        # Foundation: Colors
    typography/page.tsx    # Foundation: Typography
    spacing/page.tsx       # Foundation: Spacing
    radius/page.tsx        # Foundation: Border Radius
    shadows/page.tsx       # Foundation: Shadows
    breakpoints/page.tsx   # Foundation: Breakpoints
    icons/page.tsx         # Foundation: Icons
    shared.tsx             # Shared layout, styles, components
  components/
    avatar/page.tsx        # Component: Avatar
    banner/page.tsx        # Component: Banner
    button/page.tsx        # Component: Button
    tab/page.tsx           # Component: Tab
    segmented-control/page.tsx  # Component: Segmented Control
```

## Required Imports

```tsx
'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  SpecTable,
  Playground,
  PillButton,
} from '../shared'  // or '../../design-system/shared' from /components/
import { colors, borderRadius, typography } from '@/styles/design-tokens'
import { ComponentName } from '@/components'
```

## Page Structure

### Basic Template

```tsx
'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground } from '../shared'
import { colors, borderRadius } from '@/styles/design-tokens'
import { ComponentName } from '@/components'

export default function ComponentNamePage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <StyleguideLayout
      title="Component Name"
      description="Brief description of the component and its primary use case."
      activeId="component-name"  // Must match navSections item id
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'specs', label: 'Specifications' },
        { id: 'code', label: 'Code' },
      ]}
    >
      {activeTab === 'overview' && (
        <>{/* Overview content */}</>
      )}

      {activeTab === 'specs' && (
        <>{/* Specifications content */}</>
      )}

      {activeTab === 'code' && (
        <>{/* Code examples */}</>
      )}
    </StyleguideLayout>
  )
}
```

## StyleguideLayout Props

```tsx
interface StyleguideLayoutProps {
  title: string           // Page title in header
  description: string     // Description below title
  activeId: string        // ID for sidebar highlighting
  tabs?: { id: string; label: string }[]  // Custom tabs
  activeTab?: string      // Current tab
  onTabChange?: (tabId: string) => void  // Tab change handler
  children: React.ReactNode
}
```

## Navigation IDs

Valid `activeId` values (from shared.tsx):

### Foundations
- `colors`
- `typography`
- `spacing`
- `radius`
- `shadows`
- `breakpoints`
- `icons`

### Components
- `avatar`
- `banner`
- `button`
- `segmented-control`
- `tab`

## Shared Styles

### Section Structure

```tsx
<section style={sharedStyles.section}>
  <h2 style={sharedStyles.sectionTitle}>Section Title</h2>
  <p style={sharedStyles.sectionDescription}>
    Description of this section.
  </p>

  {/* Content */}
</section>
```

### Available Styles

```tsx
sharedStyles.section           // marginBottom: 64px
sharedStyles.sectionTitle      // h3 typography
sharedStyles.sectionDescription // Body md, medium emphasis
sharedStyles.card              // Card container
sharedStyles.cardTitle         // h4 typography
sharedStyles.table             // Table base styles
sharedStyles.th                // Table header cell
sharedStyles.td                // Table data cell
sharedStyles.codeBlock         // Pre/code styling
sharedStyles.grid              // CSS Grid container
sharedStyles.row               // Flex row
```

## Shared Components

### CodeBlock

```tsx
<CodeBlock>{`import { Button } from '@/components'

<Button size="md" emphasis="high">
  Click me
</Button>`}</CodeBlock>
```

Features:
- Copy button in top-right
- Monospace font (JetBrains Mono)
- Syntax highlighting via string formatting

### SpecTable

```tsx
<SpecTable
  headers={['Property', 'Value', 'Notes']}
  rows={[
    ['Height', '48px', 'Large size'],
    ['Padding', '16px', 'Horizontal'],
    ['Font Size', '16px', 'DM Sans SemiBold'],
  ]}
/>
```

### Playground

Interactive preview with code toggle:

```tsx
<Playground
  preview={
    <Button size="md" emphasis="high">
      Preview Button
    </Button>
  }
  code={`<Button size="md" emphasis="high">
  Preview Button
</Button>`}
  previewBackground={colors.neutral[50]}  // Optional
  previewPadding="48px"                   // Optional
  previewMinHeight="120px"                // Optional
/>
```

### PillButton

For property selectors:

```tsx
<div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
  <PillButton
    isActive={selectedSize === 'sm'}
    onClick={() => setSelectedSize('sm')}
  >
    Small
  </PillButton>
  <PillButton
    isActive={selectedSize === 'md'}
    onClick={() => setSelectedSize('md')}
  >
    Medium
  </PillButton>
</div>
```

## Tab Content Patterns

### Overview Tab

Typically includes:
1. Interactive playground
2. Use cases
3. Variants showcase
4. States demonstration

```tsx
{activeTab === 'overview' && (
  <>
    {/* Interactive Playground */}
    <section style={sharedStyles.section}>
      <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
      <p style={sharedStyles.sectionDescription}>
        Try different configurations.
      </p>

      {/* Property selectors */}
      <div style={{ marginBottom: '24px' }}>
        <PillButton isActive={size === 'md'} onClick={() => setSize('md')}>
          Medium
        </PillButton>
      </div>

      <Playground
        preview={<Component size={size} />}
        code={`<Component size="${size}" />`}
      />
    </section>

    {/* Variants */}
    <section style={sharedStyles.section}>
      <h2 style={sharedStyles.sectionTitle}>Variants</h2>
      <div style={sharedStyles.card}>
        {/* Variant examples */}
      </div>
    </section>
  </>
)}
```

### Specifications Tab

Technical details and measurements:

```tsx
{activeTab === 'specs' && (
  <>
    <section style={sharedStyles.section}>
      <h2 style={sharedStyles.sectionTitle}>Size Scale</h2>
      <p style={sharedStyles.sectionDescription}>
        Available size variants and their dimensions.
      </p>

      <SpecTable
        headers={['Size', 'Height', 'Padding X', 'Padding Y', 'Font Size']}
        rows={[
          ['sm', '32px', '12px', '8px', '14px'],
          ['md', '40px', '16px', '12px', '16px'],
          ['lg', '48px', '20px', '16px', '18px'],
        ]}
      />
    </section>

    <section style={sharedStyles.section}>
      <h2 style={sharedStyles.sectionTitle}>Color Tokens</h2>
      <SpecTable
        headers={['State', 'Background', 'Text', 'Border']}
        rows={[
          ['Enabled', 'colors.brand.primary', 'colors.text.highEmphasisOnDark', 'transparent'],
          ['Hover', 'colors.brand.primaryLight', 'colors.text.highEmphasisOnDark', 'transparent'],
        ]}
      />
    </section>
  </>
)}
```

### Code Tab

Implementation examples:

```tsx
{activeTab === 'code' && (
  <>
    <section style={sharedStyles.section}>
      <h2 style={sharedStyles.sectionTitle}>Basic Usage</h2>
      <p style={sharedStyles.sectionDescription}>
        Import and use the component.
      </p>

      <CodeBlock>{`import { ComponentName } from '@/components'

function MyComponent() {
  return (
    <ComponentName size="md">
      Content
    </ComponentName>
  )
}`}</CodeBlock>
    </section>

    <section style={sharedStyles.section}>
      <h2 style={sharedStyles.sectionTitle}>Props</h2>
      <SpecTable
        headers={['Prop', 'Type', 'Default', 'Description']}
        rows={[
          ['size', "'sm' | 'md' | 'lg'", "'md'", 'Component size'],
          ['disabled', 'boolean', 'false', 'Disabled state'],
        ]}
      />
    </section>

    <section style={sharedStyles.section}>
      <h2 style={sharedStyles.sectionTitle}>TypeScript</h2>
      <CodeBlock>{`import type { ComponentNameProps } from '@/components'

interface ComponentNameProps {
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children?: React.ReactNode
}`}</CodeBlock>
    </section>
  </>
)}
```

## Visual Examples

### Grid of Examples

```tsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '16px',
}}>
  {variants.map(variant => (
    <div key={variant} style={sharedStyles.card}>
      <Component variant={variant} />
      <p style={{ marginTop: '8px', ...typography.label.sm }}>
        {variant}
      </p>
    </div>
  ))}
</div>
```

### State Showcase

```tsx
<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
  <Component>Default</Component>
  <Component disabled>Disabled</Component>
  <Component loading>Loading</Component>
</div>
```

### Dark Background Demo

```tsx
<div style={{
  background: colors.background.dark,
  padding: '32px',
  borderRadius: borderRadius.lg,
}}>
  <Component onDark>On Dark</Component>
</div>
```

## State Management for Interactive Demos

```tsx
export default function ComponentPage() {
  const [activeTab, setActiveTab] = useState('overview')

  // Demo state
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [selectedVariant, setSelectedVariant] = useState<'primary' | 'secondary'>('primary')
  const [isDisabled, setIsDisabled] = useState(false)

  // Generate preview code dynamically
  const previewCode = `<Component
  size="${selectedSize}"
  variant="${selectedVariant}"
  ${isDisabled ? 'disabled' : ''}
>
  Example
</Component>`

  return (
    <StyleguideLayout {...}>
      {activeTab === 'overview' && (
        <Playground
          preview={
            <Component
              size={selectedSize}
              variant={selectedVariant}
              disabled={isDisabled}
            >
              Example
            </Component>
          }
          code={previewCode}
        />
      )}
    </StyleguideLayout>
  )
}
```

## Checklist

Before publishing a documentation page:

- [ ] All three tabs have content (Overview, Specs, Code)
- [ ] Interactive playground works correctly
- [ ] All variants and states are documented
- [ ] Code examples are copy-paste ready
- [ ] Props table is complete
- [ ] TypeScript types are documented
- [ ] Accessibility notes included where relevant
- [ ] activeId matches sidebar navigation
- [ ] Page renders without errors
