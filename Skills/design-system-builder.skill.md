# Design System Builder Skill

## Overview

**Name:** design-system-builder
**Trigger:** `/design-system-builder` or when working on design system documentation, navigation, or token visualization pages

**Description:** Build and maintain the MTR Design System shell, documentation UI, and token visualization pages. Use this skill when adding new components/foundations to the design system, updating navigation, or creating documentation pages. This skill orchestrates integration of icons and components created by other skills.

---

## Context Triggers (for Skill Router)

```yaml
triggers:
  keywords:
    - design system
    - documentation
    - styleguide
    - tokens
    - navigation
    - sidebar
    - layout shell
  intents:
    - add to navigation
    - create token page
    - update documentation
    - modify layout
    - add section
  filePatterns:
    - "**/design-system/**"
    - "**/shared.tsx"
    - "**/design-tokens.ts"
    - "**/StyleguideLayout*"

confidenceBoosters:
  - condition: "shell|layout|sidebar|header"
    boost: 0.1
  - condition: "CodeBlock|SpecTable|Playground|PillButton"
    boost: 0.15
  - condition: "navSections|navigation.items"
    boost: 0.2
  - condition: "colors?.page|typography.page|spacing.page"
    boost: 0.15

confidencePenalties:
  - condition: "create.*component|build.*component|new.*component"
    penalty: 0.15

commonSuccessors:
  - icon-generator
commonPredecessors:
  - design-system-ui
  - prototype-builder
```

---

## File Ownership

This skill owns and maintains the following files:

| File Path | Purpose |
|-----------|---------|
| `/app/design-system/shared.tsx` | StyleguideLayout, sidebar nav, CodeBlock, SpecTable, Playground, iconMap |
| `/app/design-system/page.tsx` | Landing page with foundationItems and componentItems arrays |
| `/app/design-system/[token]/page.tsx` | Foundation pages: colors, typography, spacing, radius, shadows, breakpoints, icons |
| `/app/components/[component]/page.tsx` | Component documentation pages |

**Do not modify files outside this ownership without explicit user request.**

---

## Core Architecture

### StyleguideLayout Component

The main layout wrapper providing collapsible sidebar navigation:

```tsx
// /app/design-system/shared.tsx

interface NavItem {
  label: string;
  href: string;
  icon?: keyof typeof iconMap;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Foundations',
    items: [
      { label: 'Colors', href: '/design-system/colors', icon: 'colors' },
      { label: 'Typography', href: '/design-system/typography', icon: 'typography' },
      { label: 'Spacing', href: '/design-system/spacing', icon: 'spacing' },
      { label: 'Radius', href: '/design-system/radius', icon: 'radius' },
      { label: 'Shadows', href: '/design-system/shadows', icon: 'shadows' },
      { label: 'Breakpoints', href: '/design-system/breakpoints', icon: 'breakpoints' },
      { label: 'Icons', href: '/design-system/icons', icon: 'icons' },
    ],
  },
  {
    title: 'Components',
    items: [
      { label: 'Button', href: '/components/button', icon: 'button' },
      // Additional components added here
    ],
  },
];

export function StyleguideLayout({ children }: { children: React.ReactNode }) {
  // Collapsible sidebar with navSections
  // Active state highlighting based on current route
  // Responsive behavior for mobile
}
```

### iconMap Pattern

Maps navigation item keys to icon components:

```tsx
// /app/design-system/shared.tsx

import { IconColors, IconTypography, IconSpacing, ... } from '@/components/icons';

export const iconMap = {
  colors: () => <IconColors size="md" />,
  typography: () => <IconTypography size="md" />,
  spacing: () => <IconSpacing size="md" />,
  radius: () => <IconRadius size="md" />,
  shadows: () => <IconShadows size="md" />,
  breakpoints: () => <IconBreakpoints size="md" />,
  icons: () => <IconLibrary size="md" />,
  button: () => <IconButton size="md" />,
  // New icons added here after generation
} as const;
```

### Landing Page Arrays

```tsx
// /app/design-system/page.tsx

interface CardItem {
  title: string;
  description: string;
  href: string;
  icon: keyof typeof iconMap;
  preview?: React.ReactNode; // Optional visual preview
}

const foundationItems: CardItem[] = [
  {
    title: 'Colors',
    description: 'Brand palette, semantic colors, and usage guidelines',
    href: '/design-system/colors',
    icon: 'colors',
  },
  // Additional foundations...
];

const componentItems: CardItem[] = [
  {
    title: 'Button',
    description: 'Primary actions, variants, and states',
    href: '/components/button',
    icon: 'button',
  },
  // Additional components...
];
```

---

## Documentation Components

### CodeBlock

Syntax-highlighted code display with copy functionality:

```tsx
import { CodeBlock } from '@/app/design-system/shared';

<CodeBlock language="tsx" title="Usage">
{`import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md">
  Click me
</Button>`}
</CodeBlock>
```

**Props:**
- `language`: 'tsx' | 'css' | 'json' | 'bash'
- `title?`: string - Optional header label
- `showLineNumbers?`: boolean - Default false

### SpecTable

Design specification tables for tokens and props:

```tsx
import { SpecTable } from '@/app/design-system/shared';

<SpecTable
  headers={['Token', 'Value', 'Usage']}
  rows={[
    ['--color-primary-500', '#10B981', 'Primary actions, links'],
    ['--color-primary-600', '#059669', 'Hover states'],
  ]}
/>
```

**Props:**
- `headers`: string[]
- `rows`: (string | React.ReactNode)[][]
- `caption?`: string

### Playground

Interactive component demonstration area with Preview/Code toggle:

```tsx
import { Playground } from '@/app/design-system/shared';

<Playground
  preview={<Button variant={demoVariant}>Example</Button>}
  code={`<Button variant="${demoVariant}">Example</Button>`}
  previewPadding="24px"
  previewBackground={colors.neutral[50]}
/>
```

**Props:**
- `preview`: React.ReactNode - Component to display in preview mode
- `code`: string - Code to display in code mode
- `previewBackground?`: string - Background color for preview area
- `previewPadding?`: string - Padding for preview area
- `previewMinHeight?`: string - Minimum height for preview area

### PillButton

Pill-shaped buttons for variant/enum selection in playground controls:

```tsx
import { PillButton } from '@/app/design-system/shared';

<div style={{ display: 'flex', gap: '8px' }}>
  {['sm', 'md', 'lg'].map(size => (
    <PillButton
      key={size}
      onClick={() => setDemoSize(size)}
      isActive={demoSize === size}
    >
      {size}
    </PillButton>
  ))}
</div>
```

**Props:**
- `children`: React.ReactNode - Button label
- `isActive?`: boolean - Whether this option is selected (inverts colors)
- `onClick?`: () => void - Click handler
- `style?`: React.CSSProperties - Additional styles

**Styling:**
- Default: White background, light border, dark text
- Active: Brand primary background, no border, white text

### StyledCheckbox

Design system checkbox for boolean props in playground controls:

```tsx
import { StyledCheckbox } from '@/app/design-system/shared';

<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
  <StyledCheckbox
    checked={demoDisabled}
    onChange={setDemoDisabled}
    label="Disabled"
  />
  <StyledCheckbox
    checked={demoLoading}
    onChange={setDemoLoading}
    label="Loading"
  />
</div>
```

**Props:**
- `checked`: boolean - Checkbox state
- `onChange`: (checked: boolean) => void - Change handler
- `label`: string - Label text
- `disabled?`: boolean - Disable the checkbox

**Styling:**
- Unchecked: Border only, transparent fill
- Checked: Brand primary fill with white checkmark

---

## Design Token Integration

Always import tokens from the central source:

```tsx
import {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  breakpoints,
} from '@/styles/design-tokens';
```

### Token Page Template

```tsx
// /app/design-system/[token]/page.tsx

import { StyleguideLayout, CodeBlock, SpecTable } from '../shared';
import { colors } from '@/styles/design-tokens';

export default function ColorsPage() {
  return (
    <StyleguideLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold">Colors</h1>
          <p className="text-neutral-600 mt-2">
            Brand palette and semantic color tokens
          </p>
        </header>

        <section>
          <h2 className="text-xl font-medium mb-4">Primary Palette</h2>
          {/* Color swatches visualization */}
          <SpecTable
            headers={['Token', 'Value', 'Preview']}
            rows={Object.entries(colors.primary).map(([key, value]) => [
              `--color-primary-${key}`,
              value,
              <div className="w-8 h-8 rounded" style={{ background: value }} />,
            ])}
          />
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">Usage</h2>
          <CodeBlock language="tsx">
{`// Import tokens
import { colors } from '@/styles/design-tokens';

// Use in components
<div style={{ color: colors.primary[500] }}>
  Primary text
</div>`}
          </CodeBlock>
        </section>
      </div>
    </StyleguideLayout>
  );
}
```

---

## Skill Orchestration

### CRITICAL: Delegating Specialized Work

This skill orchestrates other skills for specialized tasks. **Always invoke the appropriate skill rather than attempting the work directly.**

#### When to Invoke `/icon-generator`

Invoke when:
- A new navigation item needs an icon
- A component documentation page needs a custom icon
- The icons foundation page needs new entries

```
→ Invoke /icon-generator skill to create IconTooltip
→ Wait for skill completion
→ Then proceed with integration steps below
```

#### When to Invoke `/component-generator`

Invoke when:
- A new UI component needs to be created
- An existing component needs variants or modifications
- Component code structure decisions are needed

```
→ Invoke /component-generator skill to create Tooltip component
→ Wait for skill completion
→ Then proceed with documentation page creation
```

#### When to Invoke `/frontend-design`

Invoke when:
- UX patterns need to be established for a new component
- Design decisions about interactions, states, or behavior
- Accessibility considerations need expert guidance
- Visual design improvements are requested

```
→ Invoke /frontend-design skill to establish Tooltip UX patterns
→ Capture recommendations
→ Pass context to /component-generator
```

---

## Standard Workflows

### Workflow: Adding a New Foundation Page

1. **Create the page file:**
   ```
   /app/design-system/[foundation-name]/page.tsx
   ```

2. **Add navigation entry in shared.tsx:**
   ```tsx
   // In navSections, under 'Foundations' items:
   { label: 'Motion', href: '/design-system/motion', icon: 'motion' },
   ```

3. **Add icon to iconMap** (after /icon-generator creates it):
   ```tsx
   motion: () => <IconMotion size="md" />,
   ```

4. **Add landing page card in page.tsx:**
   ```tsx
   // In foundationItems array:
   {
     title: 'Motion',
     description: 'Animation tokens and transition guidelines',
     href: '/design-system/motion',
     icon: 'motion',
   },
   ```

### Workflow: Adding a New Component

**Complete workflow for adding "Tooltip" component:**

#### Step 1: Design Consultation
```
→ Invoke /frontend-design skill:
   "Establish UX patterns for a Tooltip component including:
    - Trigger behaviors (hover, focus, click)
    - Positioning logic and collision detection
    - Animation/transition patterns
    - Accessibility requirements (aria-describedby, escape to close)
    - Content constraints and overflow handling"
```

#### Step 2: Icon Generation
```
→ Invoke /icon-generator skill:
   "Create IconTooltip for the design system navigation.
    Should represent a tooltip/speech bubble concept.
    Follow existing icon conventions in /components/icons/"
```

#### Step 3: Component Generation
```
→ Invoke /component-generator skill:
   "Create Tooltip component with the following UX patterns:
    [paste recommendations from /frontend-design]
    
    Required variants: default, info, warning, error
    Required props: content, placement, trigger, delay"
```

#### Step 4: Integration (THIS SKILL)

**4a. Update shared.tsx - Import and iconMap:**
```tsx
// Add import at top of file
import { IconTooltip } from '@/components/icons';

// Add to iconMap
export const iconMap = {
  // ... existing entries
  tooltip: () => <IconTooltip size="md" />,
} as const;
```

**4b. Update shared.tsx - Navigation:**
```tsx
// In navSections, under 'Components' items:
{ label: 'Tooltip', href: '/components/tooltip', icon: 'tooltip' },
```

**4c. Update page.tsx - Landing card:**
```tsx
// In componentItems array:
{
  title: 'Tooltip',
  description: 'Contextual information on hover or focus',
  href: '/components/tooltip',
  icon: 'tooltip',
},
```

**4d. Create documentation page:**
```tsx
// /app/components/tooltip/page.tsx

import { StyleguideLayout, CodeBlock, SpecTable, Playground } from '@/app/design-system/shared';
import { Tooltip } from '@/components/ui/Tooltip';

export default function TooltipPage() {
  return (
    <StyleguideLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold">Tooltip</h1>
          <p className="text-neutral-600 mt-2">
            Contextual information displayed on hover or focus
          </p>
        </header>

        <Playground
          title="Interactive Demo"
          controls={[
            { type: 'select', label: 'Placement', options: ['top', 'bottom', 'left', 'right'] },
            { type: 'select', label: 'Variant', options: ['default', 'info', 'warning', 'error'] },
          ]}
        >
          {(props) => (
            <Tooltip content="Helpful information" {...props}>
              <button className="px-4 py-2 bg-primary-500 text-white rounded">
                Hover me
              </button>
            </Tooltip>
          )}
        </Playground>

        <section>
          <h2 className="text-xl font-medium mb-4">Usage</h2>
          <CodeBlock language="tsx">
{`import { Tooltip } from '@/components/ui/Tooltip';

<Tooltip content="Save your changes">
  <Button>Save</Button>
</Tooltip>`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">Props</h2>
          <SpecTable
            headers={['Prop', 'Type', 'Default', 'Description']}
            rows={[
              ['content', 'ReactNode', '—', 'Tooltip content'],
              ['placement', "'top' | 'bottom' | 'left' | 'right'", "'top'", 'Preferred position'],
              ['trigger', "'hover' | 'focus' | 'click'", "'hover'", 'Activation method'],
              ['delay', 'number', '200', 'Show delay in ms'],
            ]}
          />
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">Accessibility</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-700">
            <li>Uses <code>aria-describedby</code> to associate tooltip with trigger</li>
            <li>Escape key closes tooltip when focused</li>
            <li>Supports keyboard navigation and focus triggers</li>
            <li>Respects reduced motion preferences</li>
          </ul>
        </section>
      </div>
    </StyleguideLayout>
  );
}
```

---

## Component Documentation Page Structure

### CRITICAL: Two-Tab Structure

All component documentation pages MUST follow a consistent two-tab structure:
- **Overview Tab**: Quick Start, Interactive Playground, live examples (Selection Lists, Use Cases), Design Tokens
- **Implementation Tab**: Usage code examples, Props tables, Design Guidance, Accessibility

### Key Rules

1. **Quick Start section** shows ONLY the import statement (no full usage code)
2. **Variants section is REMOVED** - all variant exploration happens in the Interactive Playground
3. **Live interactive examples** (like Selection Lists) stay in Overview tab for demonstration
4. **All code examples** with usage patterns go in the Implementation tab under "Usage"
5. **Props tables** go in Implementation tab, not Overview

### Component Documentation Page Template

```tsx
// /app/components/[component]/page.tsx
'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox } from '../../design-system/shared'
import { ComponentName } from '@/components'
import { colors, typography } from '@/styles/design-tokens'

type PageTab = 'overview' | 'implementation'

export default function ComponentNamePage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive playground state
  const [demoVariant, setDemoVariant] = useState('default')
  const [demoBooleanProp, setDemoBooleanProp] = useState(false)
  // ... other playground state

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
  ]

  return (
    <StyleguideLayout
      title="Component Name"
      description="Brief description of component purpose and use cases."
      activeId="component-name"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
    >
      {/* ========== OVERVIEW TAB ========== */}
      {activePageTab === 'overview' && (
        <>
          {/* ========== QUICK START ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`import { ComponentName } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Manipulate properties in real-time to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={<ComponentName /* demo props */ />}
                    code={`<ComponentName /* generated code */ />`}
                    previewPadding="24px"
                    previewBackground={colors.neutral[50]}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* PillButton groups for variant/enum selection */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Variant
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['default', 'primary', 'secondary'].map(v => (
                          <PillButton
                            key={v}
                            onClick={() => setDemoVariant(v)}
                            isActive={demoVariant === v}
                          >
                            {v}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* StyledCheckbox for boolean props */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <StyledCheckbox
                        checked={demoBooleanProp}
                        onChange={setDemoBooleanProp}
                        label="Boolean Prop"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== LIVE EXAMPLES (if applicable) ========== */}
          {/* e.g., Selection Lists for ListItem, Use Cases for Badge */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Common Use Cases</h2>
            {/* Interactive examples showing component in context */}
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>
            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Token', 'Value', 'Description']}
                rows={[/* Design token specifications */]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          {/* ========== USAGE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>
{`import { ComponentName } from '@/components'
import type { ComponentNameProps } from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`// Example usage patterns
<ComponentName variant="default">
  Content
</ComponentName>`}
              </CodeBlock>
            </div>

            {/* Additional usage examples */}
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>
            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="p">propName</code>, <code key="t">type</code>, <code key="d">default</code>, 'Description'],
                ]}
              />
            </div>
          </section>

          {/* ========== DESIGN GUIDANCE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use Each Variant</h3>
              <SpecTable
                headers={['Variant', 'Use Case']}
                rows={[/* Variant guidance */]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[/* Best practices */]}
              />
            </div>
          </section>

          {/* ========== ACCESSIBILITY ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <div style={{ maxWidth: '800px' }}>
              <ul style={{
                ...typography.body.md,
                color: colors.text.mediumEmphasis,
                paddingLeft: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <li>Accessibility consideration 1</li>
                <li>Accessibility consideration 2</li>
              </ul>
            </div>
          </section>
        </>
      )}
    </StyleguideLayout>
  )
}
```

### Section Placement Summary

| Section | Tab | Notes |
|---------|-----|-------|
| Quick Start | Overview | Import statement ONLY |
| Interactive Playground | Overview | Full property manipulation |
| Live Examples / Use Cases | Overview | Interactive demonstrations |
| Design Tokens | Overview | Spacing, typography specs |
| Usage (code examples) | Implementation | Import + usage patterns |
| Props | Implementation | Full props tables |
| Design Guidance | Implementation | When to use, best practices |
| Accessibility | Implementation | A11y considerations |

### What NOT to Include

- **NO separate Variants section** - Variants are explored via the Interactive Playground
- **NO code examples in Overview** - Only the import in Quick Start
- **NO static variant grids** - Use the Playground for variant exploration

---

## Temp Component Builder Mode

### Overview

When invoked with prototype handoff, this skill operates in **Temp Component Builder** mode - creating draft/temporary components that fill gaps identified during prototyping. These components are iterated through reviews before being promoted to the canonical DLS.

### Temp vs Canonical Components

| Aspect | Temp Component | Canonical Component |
|--------|---------------|---------------------|
| **Location** | `/components/temp/[project]/` | `/components/ui/` |
| **Documentation** | Minimal (props only) | Full (Playground, usage, a11y) |
| **Review status** | Draft → In Review → Approved | Approved only |
| **Token usage** | Required | Required |
| **Tests** | Basic | Comprehensive |

### Workflow: Receiving Prototype Handoff

1. **Parse handoff document:**
   ```markdown
   ## Incoming from /prototype-builder

   ### Component Gaps
   - ProgressStepper (High priority, likely canonical)
   - MetricCard (High priority, likely canonical)
   - SocialProofBadge (Low priority, may be temporary)
   ```

2. **Create temp component structure:**
   ```
   /components/temp/
   └── [project-name]/
       ├── README.md           # Status tracker
       ├── ProgressStepper.tsx
       ├── MetricCard.tsx
       └── index.ts
   ```

3. **Generate temp components:**
   ```tsx
   // /components/temp/onboarding/ProgressStepper.tsx

   /**
    * TEMP COMPONENT - Onboarding Project
    * Status: Draft
    * Created: 2024-01-15
    * Canonical candidate: Yes
    *
    * TODO: Pending reviews
    * - [ ] Content review
    * - [ ] Accessibility review
    * - [ ] UX final approval
    */

   import { cn } from '@/lib/utils';

   interface ProgressStepperProps {
     steps: string[];
     currentStep: number;
     onStepClick?: (step: number) => void;
   }

   export function ProgressStepper({
     steps,
     currentStep,
     onStepClick,
   }: ProgressStepperProps) {
     return (
       <div className="flex items-center justify-between">
         {steps.map((label, index) => (
           <button
             key={index}
             onClick={() => onStepClick?.(index)}
             className={cn(
               "flex flex-col items-center",
               index <= currentStep ? "text-primary-500" : "text-neutral-400"
             )}
           >
             <div
               className={cn(
                 "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                 index < currentStep && "bg-primary-500 text-white",
                 index === currentStep && "border-2 border-primary-500 text-primary-500",
                 index > currentStep && "bg-neutral-200 text-neutral-500"
               )}
             >
               {index < currentStep ? "✓" : index + 1}
             </div>
             <span className="text-xs mt-1">{label}</span>
           </button>
         ))}
       </div>
     );
   }
   ```

### Review Integration

Temp components go through the review pipeline:

```
Temp Component Builder
    ↓
📝 Content Review
    ↓ Approved?
♿ Accessibility Review
    ↓ Approved?
📋 Component Review
    ↓
👤 UX Designer Final Approval
    ↓ Approved?
🏛️ Canonical DLS (if applicable)
```

**Tracking review status:**

```tsx
// Component header comment tracks status
/**
 * TEMP COMPONENT - Onboarding Project
 * Status: In Review
 * Created: 2024-01-15
 * Canonical candidate: Yes
 *
 * Reviews:
 * - [x] Content review - Approved 2024-01-16
 * - [x] Accessibility review - Approved 2024-01-17 (added aria-label)
 * - [ ] UX final approval - Pending
 */
```

### Workflow: Promoting to Canonical

When a temp component is approved and deemed canonical:

1. **Move to canonical location:**
   ```
   /components/temp/onboarding/ProgressStepper.tsx
   → /components/ui/ProgressStepper.tsx
   ```

2. **Invoke standard component workflow:**
   ```
   → /icon-generator for navigation icon
   → Update shared.tsx: iconMap + navSections
   → Update page.tsx: componentItems
   → Create full documentation page
   ```

3. **Update imports across codebase:**
   ```tsx
   // Before (temp)
   import { ProgressStepper } from '@/components/temp/onboarding';

   // After (canonical)
   import { ProgressStepper } from '@/components/ui/ProgressStepper';
   ```

4. **Clean up temp directory:**
   ```
   → Remove from /components/temp/[project]/
   → Update project README.md
   ```

### Iteration Handling

When reviews request changes:

```markdown
## Iteration Request: ProgressStepper

**From:** A11y Review
**Issue:** Missing keyboard navigation between steps
**Priority:** Required

### Changes Needed:
1. Add arrow key navigation
2. Add aria-current="step" for active step
3. Ensure focus visible on tab

### Implementation:
→ Update temp component
→ Re-submit for a11y review
```

### Temp Component Checklist

- [ ] Created in `/components/temp/[project]/`
- [ ] Header comment with status tracking
- [ ] Uses design tokens (no hardcoded values)
- [ ] Basic TypeScript types defined
- [ ] Exported from project index.ts
- [ ] README.md updated with component list

### Promoting to Canonical Checklist

- [ ] All reviews passed (content, a11y, UX)
- [ ] Moved to `/components/ui/`
- [ ] Full documentation page created
- [ ] Navigation icon generated
- [ ] Added to iconMap and navSections
- [ ] Added to componentItems
- [ ] Imports updated across codebase
- [ ] Temp files cleaned up

---

## Checklist: Adding New Items

### New Foundation Checklist
- [ ] Create page at `/app/design-system/[name]/page.tsx`
- [ ] Invoke `/icon-generator` if icon needed
- [ ] Import icon in `shared.tsx`
- [ ] Add to `iconMap` in `shared.tsx`
- [ ] Add to `navSections.Foundations.items` in `shared.tsx`
- [ ] Add to `foundationItems` array in `page.tsx`
- [ ] Add token exports to `@/styles/design-tokens` if applicable

### New Component Checklist
- [ ] Invoke `/frontend-design` for UX patterns
- [ ] Invoke `/icon-generator` for navigation icon
- [ ] Invoke `/component-generator` for component code
- [ ] Import icon in `shared.tsx`
- [ ] Add to `iconMap` in `shared.tsx`
- [ ] Add to `navSections.Components.items` in `shared.tsx`
- [ ] Add to `componentItems` array in `page.tsx`
- [ ] Create documentation at `/app/components/[name]/page.tsx`
- [ ] Include: Playground, Usage, Variants, Props, Accessibility sections

---

## Error Prevention

### Common Mistakes to Avoid

1. **Don't create icons directly** - Always invoke `/icon-generator`
2. **Don't create components directly** - Always invoke `/component-generator`
3. **Don't skip the iconMap** - Navigation icons won't render without it
4. **Don't forget both arrays** - navSections AND landing page items
5. **Don't hardcode token values** - Always import from `@/styles/design-tokens`
6. **Don't skip accessibility section** - Required for all component docs

### Server Restart (REQUIRED)

**CRITICAL**: When adding new components or foundation pages to the design system, ALWAYS restart the Next.js dev server on a different port to avoid cache issues.

**Workflow:**
1. Stop the current dev server (if running)
2. Start the server on port 3001 (or next available port if 3001 is in use):
   ```bash
   # Kill existing server on port 3000
   lsof -ti:3000 | xargs kill -9 2>/dev/null || true

   # Start on alternate port
   npm run dev -- --port 3001
   ```
3. Inform the user of the new URL (http://localhost:3001)

**Why**: Next.js caching can prevent new components from appearing in navigation. Switching ports bypasses the cache completely.

### Validation Steps

After completing any workflow, verify:
1. Navigation renders the new item with icon
2. Landing page shows the preview card
3. Clicking the card navigates to the correct page
4. All code examples are syntactically correct
5. Interactive playground functions properly

---

## Related Skills

| Skill | When to Use |
|-------|-------------|
| `/icon-generator` | Creating new icons for navigation or components |
| `/component-generator` | Creating new UI components |
| `/frontend-design` | UX patterns, design decisions, visual improvements |
| `/brand-tokens-translator` | Updating design token values |
| `/prototype-builder` | Upstream skill that generates prototype handoffs with component gaps |

---

## Quick Reference

```
# Add a foundation page
1. Create /app/design-system/[name]/page.tsx
2. Update shared.tsx: iconMap + navSections
3. Update page.tsx: foundationItems

# Add a component (canonical)
1. /frontend-design → UX patterns
2. /icon-generator → IconComponentName
3. /component-generator → Component code
4. Update shared.tsx: import + iconMap + navSections
5. Update page.tsx: componentItems
6. Create /app/components/[name]/page.tsx

# Temp Component Builder mode (from prototype handoff)
1. Receive handoff from /prototype-builder
2. Create temp components in /components/temp/[project]/
3. Track review status in component headers
4. Iterate based on Content/A11y/UX feedback
5. On approval: promote to canonical OR keep as project-specific
```
