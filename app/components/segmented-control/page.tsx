'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton } from '../../design-system/shared'
import { SegmentedControl, SegmentItem, SegmentedControlSize } from '@/components'
import { colors, typography, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

type PageTab = 'overview' | 'implementation'

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
                    previewBackground={demoOnDark ? colors.brand.primary : colors.neutral[50]}
                    previewPadding="32px"
                    previewMinHeight="100px"
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                      {[
                        { label: 'Full Width', value: demoFullWidth, setter: setDemoFullWidth },
                        { label: 'On Dark', value: demoOnDark, setter: setDemoOnDark },
                      ].map(({ label, value, setter }) => (
                        <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setter(e.target.checked)}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span style={{ ...typography.label.sm }}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Preview */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Preview</h2>
            <p style={sharedStyles.sectionDescription}>
              Segmented controls work best with 2-5 options. They provide a clear, compact way to
              switch between related views or filter options.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
                <SegmentedControl
                  segments={timeSegments}
                  value={demoValue}
                  onChange={setDemoValue}
                />
                <SegmentedControl
                  segments={viewSegments}
                  value={viewValue}
                  onChange={setViewValue}
                />
                <SegmentedControl
                  segments={statusSegments}
                  value={statusValue}
                  onChange={setStatusValue}
                />
              </div>
            </div>
          </section>

          {/* ========== SIZE VARIANTS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Size Variants</h2>
            <p style={sharedStyles.sectionDescription}>
              Three size options are available to accommodate different UI contexts and density requirements.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {sizes.map((size) => (
                  <div key={size}>
                    <p style={{ ...typography.label.sm, color: colors.text.mediumEmphasis, marginBottom: '12px' }}>
                      Size: {size.toUpperCase()} ({size === 'sm' ? '32px' : size === 'md' ? '40px' : '48px'})
                    </p>
                    <SegmentedControl
                      segments={timeSegments}
                      value={size === 'sm' ? sizeSmValue : size === 'md' ? sizeMdValue : sizeLgValue}
                      onChange={size === 'sm' ? setSizeSmValue : size === 'md' ? setSizeMdValue : setSizeLgValue}
                      size={size}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========== FULL WIDTH ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Full Width</h2>
            <p style={sharedStyles.sectionDescription}>
              Use full width mode when the control should span the entire width of its container.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ maxWidth: '400px' }}>
                <SegmentedControl
                  segments={timeSegments}
                  value={demoValue}
                  onChange={setDemoValue}
                  fullWidth
                />
              </div>
            </div>
          </section>

          {/* ========== ON DARK SURFACE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>On Dark Surface</h2>
            <p style={sharedStyles.sectionDescription}>
              Use the onDark prop when placing the segmented control on dark backgrounds.
            </p>

            <div style={{
              background: colors.brand.primary,
              padding: '32px',
              borderRadius: borderRadius.lg,
            }}>
              <SegmentedControl
                segments={timeSegments}
                value={darkValue}
                onChange={setDarkValue}
                onDark
              />
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>
            <p style={sharedStyles.sectionDescription}>
              Size specifications and visual properties for each variant.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Size Tokens</h3>
              <SpecTable
                headers={['Size', 'Height', 'Padding', 'Font Size', 'Border Radius']}
                rows={[
                  ['sm', '32px', '8px 12px', '13px', '6px / 4px'],
                  ['md', '40px', '8px 16px', '14px', '8px / 6px'],
                  ['lg', '48px', '12px 20px', '14px', '12px / 8px'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Color Tokens</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div>
                  <h4 style={{ ...typography.label.md, marginBottom: '12px' }}>Container</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      background: colors.neutral[100],
                      border: '1px solid rgba(0,0,0,0.1)',
                    }} />
                    <div>
                      <div style={{ ...typography.label.sm }}>Background</div>
                      <div style={{ ...typography.code.sm, color: colors.text.mediumEmphasis }}>
                        {colors.neutral[100]}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ ...typography.label.md, marginBottom: '12px' }}>Selected Segment</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                    }} />
                    <div>
                      <div style={{ ...typography.label.sm }}>Background</div>
                      <div style={{ ...typography.code.sm, color: colors.text.mediumEmphasis }}>
                        white + shadow
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ ...typography.label.md, marginBottom: '12px' }}>Text Colors</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      background: colors.text.highEmphasis,
                    }} />
                    <div>
                      <div style={{ ...typography.label.sm }}>Selected</div>
                      <div style={{ ...typography.code.sm, color: colors.text.mediumEmphasis }}>
                        High Emphasis
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      background: colors.text.mediumEmphasis,
                    }} />
                    <div>
                      <div style={{ ...typography.label.sm }}>Unselected</div>
                      <div style={{ ...typography.code.sm, color: colors.text.mediumEmphasis }}>
                        Medium Emphasis
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              <ul style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, margin: 0, paddingLeft: '20px' }}>
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
    </StyleguideLayout>
  )
}
