'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox as StyledCheckboxControl, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { Divider } from '@/components'
import { colors, spacing, typography } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

const dividerDocData: ComponentDocData = {
  displayName: 'Divider',
  importPath: '@/components',
  importStatement: `import { Divider } from '@/components'\nimport type { DividerProps } from '@/components'`,
  description: 'Dividers separate content into clear groups with a thin horizontal or vertical line.',
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Orientation of the divider' },
    { name: 'variant', type: "'light' | 'medium' | 'heavy'", default: "'light'", description: 'Visual weight' },
    { name: 'spacing', type: "'none' | 'sm' | 'md' | 'lg'", default: "'none'", description: 'Spacing above and below (or left and right)' },
    { name: 'onDark', type: 'boolean', description: 'For dark backgrounds' },
  ],
  accessibility: [
    { feature: 'Semantic HTML', description: 'Uses <hr> element with role="separator" for proper semantics.' },
    { feature: 'ARIA Orientation', description: 'aria-orientation set for vertical dividers.' },
  ],
  tokens: [
    { token: 'colors.border.lowEmphasis.onLight', value: 'Light gray', usage: 'Light variant color' },
    { token: 'colors.border.midEmphasis.onLight', value: 'Mid gray', usage: 'Medium variant color' },
    { token: 'colors.border.highEmphasis.onLight', value: 'Dark gray', usage: 'Heavy variant color' },
  ],
  relatedComponents: [
    { name: 'List Item', href: '/components/list-item' },
    { name: 'Accordion', href: '/components/accordion' },
  ],
  notes: [
    'Use light variant for subtle separation, heavy for strong visual breaks.',
    'Vertical dividers work well in toolbars and inline layouts.',
  ],
}

export default function DividerPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoVariant, setDemoVariant] = useState<'light' | 'medium' | 'heavy'>('light')
  const [demoSpacing, setDemoSpacing] = useState<'none' | 'sm' | 'md' | 'lg'>('md')
  const [demoOrientation, setDemoOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  const [demoOnDark, setDemoOnDark] = useState(false)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Divider"
      description="Dividers separate content into clearly defined groups. They can be horizontal or vertical, and come in different visual weights."
      activeId="divider"
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
              <CodeBlock>{`import { Divider } from '@/components'

<Divider />
<Divider variant="medium" spacing="lg" />
<Divider orientation="vertical" />`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Experiment with divider properties to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      demoOrientation === 'horizontal' ? (
                        <div style={{ width: '100%', padding: spacing.md }}>
                          <div style={{ color: demoOnDark ? '#FFFFFF' : colors.text.highEmphasis.onLight, fontSize: typography.body.sm.fontSize, marginBottom: spacing.xs }}>Content above</div>
                          <Divider variant={demoVariant} spacing={demoSpacing} orientation={demoOrientation} onDark={demoOnDark} />
                          <div style={{ color: demoOnDark ? '#FFFFFF' : colors.text.highEmphasis.onLight, fontSize: typography.body.sm.fontSize, marginTop: spacing.xs }}>Content below</div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', height: '60px', padding: spacing.md }}>
                          <span style={{ color: demoOnDark ? '#FFFFFF' : colors.text.highEmphasis.onLight, fontSize: typography.body.sm.fontSize }}>Left</span>
                          <Divider variant={demoVariant} spacing={demoSpacing} orientation={demoOrientation} onDark={demoOnDark} />
                          <span style={{ color: demoOnDark ? '#FFFFFF' : colors.text.highEmphasis.onLight, fontSize: typography.body.sm.fontSize }}>Right</span>
                        </div>
                      )
                    }
                    code={`<Divider${demoVariant !== 'light' ? ` variant="${demoVariant}"` : ''}${demoSpacing !== 'md' ? ` spacing="${demoSpacing}"` : ''}${demoOrientation !== 'horizontal' ? ` orientation="${demoOrientation}"` : ''}${demoOnDark ? ' onDark' : ''} />`}
                    previewPadding={spacing.xs}
                    previewBackground={demoOnDark ? colors.surface.dark : undefined}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Variant */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Variant
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['light', 'medium', 'heavy'] as const).map(v => (
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

                    {/* Spacing */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Spacing
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['none', 'sm', 'md', 'lg'] as const).map(s => (
                          <PillButton
                            key={s}
                            onClick={() => setDemoSpacing(s)}
                            isActive={demoSpacing === s}
                          >
                            {s}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Orientation */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Orientation
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['horizontal', 'vertical'] as const).map(o => (
                          <PillButton
                            key={o}
                            onClick={() => setDemoOrientation(o)}
                            isActive={demoOrientation === o}
                          >
                            {o}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* On Dark Toggle */}
                    <StyledCheckboxControl
                      checked={demoOnDark}
                      onChange={setDemoOnDark}
                      label="On Dark Surface"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Spacing, color, and dimension values used in the Divider component. Click any token to copy it.
              </p>

              {/* Dimensions */}
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Variant Dimensions</h3>
                <SpecTable
                  headers={['Variant', 'Thickness', 'Color Token', 'Color Value']}
                  rows={[
                    [
                      'light',
                      <PixelValue key="lt" value="1px" />,
                      <CopyableToken key="lc" token="colors.border.lowEmphasis.onLight" />,
                      <TokenValue key="lcv" token="colors.border.lowEmphasis.onLight" value={colors.border.lowEmphasis.onLight} />,
                    ],
                    [
                      'medium',
                      <PixelValue key="mt" value="2px" />,
                      <CopyableToken key="mc" token="colors.border.midEmphasis.onLight" />,
                      <TokenValue key="mcv" token="colors.border.midEmphasis.onLight" value={colors.border.midEmphasis.onLight} />,
                    ],
                    [
                      'heavy',
                      <PixelValue key="ht" value="4px" />,
                      <CopyableToken key="hc" token="colors.border.highEmphasis.onLight" />,
                      <TokenValue key="hcv" token="colors.border.highEmphasis.onLight" value={colors.border.highEmphasis.onLight} />,
                    ],
                  ]}
                />
              </div>

              {/* Spacing */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Spacing</h3>
                <SpecTable
                  headers={['Size', 'Token', 'Value']}
                  rows={[
                    ['none', <CopyableToken key="sn" token="0" />, <PixelValue key="snv" value="0px" />],
                    ['sm', <CopyableToken key="ss" token="spacing.xs" />, <PixelValue key="ssv" value={spacing.xs} />],
                    ['md', <CopyableToken key="sm" token="spacing.md" />, <PixelValue key="smv" value={spacing.md} />],
                    ['lg', <CopyableToken key="sl" token="spacing.xl" />, <PixelValue key="slv" value={spacing.xl} />],
                  ]}
                />
              </div>

              {/* Dark Surface Colors */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Dark Surface Colors</h3>
                <SpecTable
                  headers={['Variant', 'Token', 'Value']}
                  rows={[
                    [
                      'light (onDark)',
                      <CopyableToken key="dlc" token="colors.border.lowEmphasis.onDark" />,
                      <TokenValue key="dlcv" token="colors.border.lowEmphasis.onDark" value={colors.border.lowEmphasis.onDark} />,
                    ],
                    [
                      'medium (onDark)',
                      <CopyableToken key="dmc" token="colors.border.midEmphasis.onDark" />,
                      <TokenValue key="dmcv" token="colors.border.midEmphasis.onDark" value={colors.border.midEmphasis.onDark} />,
                    ],
                    [
                      'heavy (onDark)',
                      <CopyableToken key="dhc" token="colors.border.highEmphasis.onDark" />,
                      <TokenValue key="dhcv" token="colors.border.highEmphasis.onDark" value={colors.border.highEmphasis.onDark} />,
                    ],
                  ]}
                />
              </div>
            </CollapsibleSection>
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
              <CodeBlock>{`import { Divider } from '@/components'
import type { DividerProps } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>{`// Default horizontal divider
<Divider />

// Medium weight with large spacing
<Divider variant="medium" spacing="lg" />

// Vertical divider between inline elements
<div style={{ display: 'flex', alignItems: 'center' }}>
  <span>Item 1</span>
  <Divider orientation="vertical" />
  <span>Item 2</span>
</div>

// On dark surface
<Divider variant="light" onDark />`}</CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Divider Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="o">orientation</code>, <code key="ot">{"'horizontal' | 'vertical'"}</code>, <code key="od">{"'horizontal'"}</code>, 'Direction of the divider'],
                  [<code key="v">variant</code>, <code key="vt">{"'light' | 'medium' | 'heavy'"}</code>, <code key="vd">{"'light'"}</code>, 'Visual weight/thickness'],
                  [<code key="s">spacing</code>, <code key="st">{"'none' | 'sm' | 'md' | 'lg'"}</code>, <code key="sd">{"'md'"}</code>, 'Margin around the divider'],
                  [<code key="d">onDark</code>, <code key="dt">boolean</code>, <code key="dd">false</code>, 'Use dark-surface border colors'],
                ]}
              />
            </div>
          </section>

          {/* ========== DESIGN GUIDANCE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use</h3>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Separate distinct groups of content within a section</li>
                <li>Between list items or card sections</li>
                <li>To create visual breaks in dense layouts</li>
                <li>Vertical dividers between inline elements (toolbars, nav items)</li>
              </ul>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When Not to Use</h3>
              <SpecTable
                headers={['Scenario', 'Use Instead']}
                rows={[
                  ['Adding space between items', 'Use gap or margin instead'],
                  ['Indicating hierarchy or nesting', 'Use indentation or color contrast'],
                  ['As a decorative border', 'Use CSS borders on containers'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use light variant for subtle separation', 'Overuse heavy dividers in content areas'],
                  ['Use consistent spacing within a section', 'Mix spacing sizes within the same list'],
                  ['Use vertical dividers in horizontal layouts', 'Stack vertical dividers without content'],
                  ['Use onDark prop on dark backgrounds', 'Use light-surface colors on dark backgrounds'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Uses semantic <code>&lt;hr&gt;</code> element for horizontal dividers</li>
                <li>Vertical dividers include <code>role=&quot;separator&quot;</code> and <code>aria-orientation=&quot;vertical&quot;</code></li>
                <li>Decorative — does not convey meaningful information to assistive technology</li>
              </ul>
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={dividerDocData} />
      )}
    </StyleguideLayout>
  )
}
