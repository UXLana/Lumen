'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { SegmentedControl, SegmentItem, SegmentedControlSize } from '@/components'
import { colors, typography, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

const segmentedControlDocData: ComponentDocData = {
  displayName: 'SegmentedControl',
  importPath: '@/components',
  importStatement: `import { SegmentedControl } from '@/components'\nimport type { SegmentedControlProps, SegmentItem, SegmentedControlSize } from '@/components'`,
  description: 'Segmented controls allow users to toggle between a small set of mutually exclusive options.',
  props: [
    { name: 'segments', type: 'SegmentItem[]', required: true, description: 'Array of segment items' },
    { name: 'value', type: 'string', required: true, description: 'Currently selected segment ID' },
    { name: 'onChange', type: '(segmentId: string) => void', required: true, description: 'Change callback' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant' },
    { name: 'fullWidth', type: 'boolean', description: 'Full width mode' },
    { name: 'onDark', type: 'boolean', description: 'Dark surface styling' },
    { name: 'className', type: 'string', description: 'Additional CSS class' },
    { name: 'style', type: 'CSSProperties', description: 'Additional inline styles' },
  ],
  typeDefinitions: [
    { name: 'SegmentItem', definition: "interface SegmentItem {\n  id: string\n  label: string\n  disabled?: boolean\n}" },
    { name: 'SegmentedControlSize', definition: "type SegmentedControlSize = 'sm' | 'md' | 'lg'" },
  ],
  accessibility: [
    { feature: 'ARIA Role', description: 'Uses role="tablist" with individual segments as role="tab".' },
    { feature: 'Keyboard', description: 'Arrow keys navigate between segments, Enter/Space to select.' },
    { feature: 'Selection State', description: 'aria-selected communicates the active segment.' },
    { feature: 'Disabled', description: 'aria-disabled on individual disabled segments.' },
  ],
  tokens: [
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Active segment indicator' },
    { token: 'colors.surface.lightDarker', value: 'Gray', usage: 'Track background' },
    { token: 'borderRadius.md', value: '8px', usage: 'Control and segment radius' },
  ],
  relatedComponents: [
    { name: 'Tab', href: '/components/tab' },
    { name: 'Radio', href: '/components/radio' },
  ],
  notes: [
    'Best for 2-5 options. Use Tab for more options or when content panels change.',
    'Each segment should have a concise label (1-2 words).',
    'Use fullWidth to distribute segments evenly across the container.',
  ],
}

export default function SegmentedControlPage() {
  const sizes: SegmentedControlSize[] = ['sm', 'md', 'lg']

  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive playground state
  const [demoSize, setDemoSize] = useState<SegmentedControlSize>('md')
  const [demoFullWidth, setDemoFullWidth] = useState(false)
  const [demoOnDark, setDemoOnDark] = useState(false)
  const [demoValue, setDemoValue] = useState('daily')

  // Sample segments for demos
  const timeSegments: SegmentItem[] = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ]

  const viewSegments: SegmentItem[] = [
    { id: 'list', label: 'List' },
    { id: 'grid', label: 'Grid' },
  ]

  const statusSegments: SegmentItem[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
  ]

  // Demo states
  const [viewValue, setViewValue] = useState('list')
  const [statusValue, setStatusValue] = useState('all')
  const [sizeSmValue, setSizeSmValue] = useState('daily')
  const [sizeMdValue, setSizeMdValue] = useState('daily')
  const [sizeLgValue, setSizeLgValue] = useState('daily')
  const [darkValue, setDarkValue] = useState('daily')

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Segmented Control"
      description="Segmented controls allow users to select one option from a set of mutually exclusive choices. They're ideal for switching between views, filtering content, or toggling related options."
      activeId="segmented-control"
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
              <CodeBlock>{`// Package import
import { SegmentedControl } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { SegmentedControl } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Manipulate segmented control properties in real-time to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <SegmentedControl
                        segments={timeSegments}
                        value={demoValue}
                        onChange={setDemoValue}
                        size={demoSize}
                        fullWidth={demoFullWidth}
                        onDark={demoOnDark}
                      />
                    }
                    code={`<SegmentedControl
  segments={[
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ]}
  value={selected}
  onChange={setSelected}
  size="${demoSize}"${demoFullWidth ? '\n  fullWidth' : ''}${demoOnDark ? '\n  onDark' : ''}
/>`}
                    previewBackground={demoOnDark ? colors.brand.primary : colors.surface.paper}
                    previewPadding="56px 24px"
                    previewMinHeight="100px"
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Size */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Size
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {sizes.map(s => (
                          <PillButton
                            key={s}
                            onClick={() => setDemoSize(s)}
                            isActive={demoSize === s}
                          >
                            {s}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <StyledCheckbox
                        checked={demoFullWidth}
                        onChange={setDemoFullWidth}
                        label="Full Width"
                      />
                      <StyledCheckbox
                        checked={demoOnDark}
                        onChange={setDemoOnDark}
                        label="On Dark"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Size specifications and visual properties for each variant.
              </p>

              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Size Tokens</h3>
              <SpecTable
                headers={['Size', 'Height Token', 'Height', 'Padding', 'Font Size', 'Border Radius']}
                rows={[
                  ['sm', <CopyableToken key="sm-h" token="spacing.8" />, <PixelValue key="sm-hv" value="32px" />, <PixelValue key="sm-p" value="8px 12px" />, <PixelValue key="sm-fs" value="13px" />, <PixelValue key="sm-br" value="6px / 4px" />],
                  ['md', <CopyableToken key="md-h" token="spacing.10" />, <PixelValue key="md-hv" value="40px" />, <PixelValue key="md-p" value="8px 16px" />, <PixelValue key="md-fs" value="14px" />, <PixelValue key="md-br" value="8px / 6px" />],
                  ['lg', <CopyableToken key="lg-h" token="spacing.12" />, <PixelValue key="lg-hv" value="48px" />, <PixelValue key="lg-p" value="12px 20px" />, <PixelValue key="lg-fs" value="14px" />, <PixelValue key="lg-br" value="12px / 8px" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Color Tokens</h3>
              <SpecTable
                headers={['Element', 'Token', 'Value']}
                rows={[
                  ['Container Background', <CopyableToken key="cb" token="#F5F5F5" />, <PixelValue key="cbv" value="#F5F5F5" />],
                  ['Selected Segment BG', <CopyableToken key="sb" token="colors.surface.default" />, <PixelValue key="sbv" value="#FFFFFF" />],
                  ['Selected Text', <CopyableToken key="st" token="colors.text.highEmphasis.onLight" />, <PixelValue key="stv" value={colors.text.highEmphasis.onLight} />],
                  ['Unselected Text', <CopyableToken key="ut" token="colors.text.lowEmphasis.onLight" />, <PixelValue key="utv" value={colors.text.lowEmphasis.onLight} />],
                  ['Segment Shadow', <CopyableToken key="ss" token="shadows.sm" />, <PixelValue key="ssv" value="0 1px 3px rgba(0,0,0,0.08)" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Font Family', <CopyableToken key="ff" token="typography.label.md.fontFamily" />, <PixelValue key="ffv" value="Inter" />],
                  ['Font Weight', <CopyableToken key="fw" token="typography.label.md.fontWeight" />, <PixelValue key="fwv" value="500" />],
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
              <CodeBlock>
{`import { SegmentedControl } from '@/components'
import type { SegmentedControlProps, SegmentedControlSize, SegmentItem } from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`const [selected, setSelected] = useState('daily')

const segments = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
]

<SegmentedControl
  segments={segments}
  value={selected}
  onChange={setSelected}
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Size Variants</h3>
              <CodeBlock>
{`// Small - 32px height
<SegmentedControl
  segments={segments}
  value={selected}
  onChange={setSelected}
  size="sm"
/>

// Medium (default) - 40px height
<SegmentedControl
  segments={segments}
  value={selected}
  onChange={setSelected}
  size="md"
/>

// Large - 48px height
<SegmentedControl
  segments={segments}
  value={selected}
  onChange={setSelected}
  size="lg"
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Full Width</h3>
              <CodeBlock>
{`<SegmentedControl
  segments={segments}
  value={selected}
  onChange={setSelected}
  fullWidth
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>On Dark Surface</h3>
              <CodeBlock>
{`<div style={{ background: '#13352C', padding: '24px' }}>
  <SegmentedControl
    segments={segments}
    value={selected}
    onChange={setSelected}
    onDark
  />
</div>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With Disabled Segment</h3>
              <CodeBlock>
{`const segments = [
  { id: 'option1', label: 'Option 1' },
  { id: 'option2', label: 'Option 2', disabled: true },
  { id: 'option3', label: 'Option 3' },
]

<SegmentedControl
  segments={segments}
  value={selected}
  onChange={setSelected}
/>`}
              </CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>SegmentedControl Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code>segments</code>, <code>SegmentItem[]</code>, '-', 'Array of segment items (required)'],
                  [<code>value</code>, <code>string</code>, '-', 'ID of selected segment (required)'],
                  [<code>onChange</code>, <code>(id: string) =&gt; void</code>, '-', 'Selection change callback (required)'],
                  [<code>size</code>, <code>'sm' | 'md' | 'lg'</code>, <code>'md'</code>, 'Size variant'],
                  [<code>fullWidth</code>, <code>boolean</code>, <code>false</code>, 'Expand to fill container width'],
                  [<code>onDark</code>, <code>boolean</code>, <code>false</code>, 'Render for dark surfaces'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>SegmentItem Interface</h3>
              <SpecTable
                headers={['Property', 'Type', 'Required', 'Description']}
                rows={[
                  [<code>id</code>, <code>string</code>, 'Yes', 'Unique identifier'],
                  [<code>label</code>, <code>string</code>, 'Yes', 'Display text'],
                  [<code>disabled</code>, <code>boolean</code>, 'No', 'Disabled state'],
                ]}
              />
            </div>
          </section>

          {/* ========== DESIGN GUIDANCE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use</h3>
              <ul style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, margin: 0, paddingLeft: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Switching between related views (List/Grid, Map/Satellite)</li>
                <li style={{ marginBottom: '8px' }}>Filtering content by time period (Daily/Weekly/Monthly)</li>
                <li style={{ marginBottom: '8px' }}>Toggling between display modes or categories</li>
                <li>When all options are equally valid and users frequently switch between them</li>
              </ul>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use 2-5 segments for optimal usability', 'Use more than 5 segments (consider tabs or dropdown)'],
                  ['Keep labels short and concise (1-2 words)', 'Use long labels that cause text wrapping'],
                  ['Use for mutually exclusive options', 'Use for multi-select scenarios (use checkboxes)'],
                  ['Place prominently for primary controls', 'Bury in complex layouts'],
                  ['Use consistent segment widths when possible', 'Mix very short and very long labels'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <SpecTable
                headers={['Feature', 'Implementation']}
                rows={[
                  ['Role', 'role="group" on container, role="radio" on segments'],
                  ['Selection State', 'aria-checked indicates selected segment'],
                  ['Keyboard', 'Tab to focus, Arrow keys to navigate'],
                  ['Disabled State', 'disabled attribute prevents interaction'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={segmentedControlDocData} />
      )}
    </StyleguideLayout>
  )
}
