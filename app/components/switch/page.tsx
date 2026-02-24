'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox as StyledCheckboxControl, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { Switch } from '@/components'
import { colors, spacing, typography, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

const switchDocData: ComponentDocData = {
  displayName: 'Switch',
  importPath: '@/components',
  importStatement: `import { Switch } from '@/components'\nimport type { SwitchProps } from '@/components'`,
  description: 'Switches toggle a single setting on or off with immediate effect.',
  props: [
    { name: 'label', type: 'string', description: 'Label text displayed next to the switch' },
    { name: 'metadata', type: 'string', description: 'Description text below the label' },
    { name: 'checked', type: 'boolean', description: 'Controlled on/off state' },
    { name: 'onChange', type: '(checked: boolean, event) => void', description: 'Change handler' },
    { name: 'labelPlacement', type: "'start' | 'end'", default: "'end'", description: 'Label placement relative to the switch' },
    { name: 'fullWidth', type: 'boolean', description: 'Label and switch spread across container' },
    { name: 'error', type: 'boolean', description: 'Error state' },
    { name: 'disabled', type: 'boolean', description: 'Disabled state' },
  ],
  accessibility: [
    { feature: 'Native Element', description: 'Uses <input type="checkbox"> with role="switch" for proper semantics.' },
    { feature: 'Keyboard', description: 'Space to toggle, Tab to navigate.' },
    { feature: 'State', description: 'aria-checked communicates the on/off state to screen readers.' },
    { feature: 'Focus Ring', description: 'Visible focus ring on keyboard navigation.' },
  ],
  tokens: [
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Active/on track color' },
    { token: 'colors.surface.disabled', value: 'Gray', usage: 'Inactive/off track color' },
    { token: 'typography.body.sm', value: '14px/20px', usage: 'Label text' },
  ],
  relatedComponents: [
    { name: 'Checkbox', href: '/components/checkbox' },
    { name: 'Radio', href: '/components/radio' },
  ],
  notes: [
    'Use Switch for settings that take effect immediately (no form submission needed).',
    'Prefer Checkbox for options that require a form submission to take effect.',
    'Use fullWidth with labelPlacement="start" for settings-style layouts.',
  ],
}

export default function SwitchPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoChecked, setDemoChecked] = useState(false)
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoError, setDemoError] = useState(false)
  const [demoShowMetadata, setDemoShowMetadata] = useState(false)
  const [demoFullWidth, setDemoFullWidth] = useState(false)
  const [demoLabelPlacement, setDemoLabelPlacement] = useState<'start' | 'end'>('end')

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Switch"
      description="Switches toggle a single setting on or off. They provide an immediate, visible response to a binary choice."
      activeId="switch"
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
              <CodeBlock>{`import { Switch } from '@/components'

<Switch
  label="Enable notifications"
  checked={isEnabled}
  onChange={(checked) => setIsEnabled(checked)}
/>`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Experiment with switch properties to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, width: demoFullWidth ? '100%' : 'auto', padding: spacing.md }}>
                        <Switch
                          label="Toggle option"
                          metadata={demoShowMetadata ? 'Additional description text' : undefined}
                          checked={demoChecked}
                          disabled={demoDisabled}
                          error={demoError}
                          fullWidth={demoFullWidth}
                          labelPlacement={demoLabelPlacement}
                          onChange={(checked) => setDemoChecked(checked)}
                        />
                      </div>
                    }
                    code={`<Switch
  label="Toggle option"${demoShowMetadata ? '\n  metadata="Additional description text"' : ''}
  checked={${demoChecked}}${demoDisabled ? '\n  disabled' : ''}${demoError ? '\n  error' : ''}${demoFullWidth ? '\n  fullWidth' : ''}${demoLabelPlacement === 'start' ? '\n  labelPlacement="start"' : ''}
  onChange={(checked) => setChecked(checked)}
/>`}
                    previewPadding={spacing.xs}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Label Placement */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Label Placement
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['end', 'start'] as const).map(p => (
                          <PillButton
                            key={p}
                            onClick={() => setDemoLabelPlacement(p)}
                            isActive={demoLabelPlacement === p}
                          >
                            {p}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Options */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Options
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <StyledCheckboxControl checked={demoDisabled} onChange={() => setDemoDisabled(!demoDisabled)} label="Disabled" />
                        <StyledCheckboxControl checked={demoError} onChange={() => setDemoError(!demoError)} label="Error" />
                        <StyledCheckboxControl checked={demoShowMetadata} onChange={() => setDemoShowMetadata(!demoShowMetadata)} label="Show Metadata" />
                        <StyledCheckboxControl checked={demoFullWidth} onChange={() => setDemoFullWidth(!demoFullWidth)} label="Full Width" />
                      </div>
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
                Spacing, color, and dimension values used in the Switch component. Click any token to copy it.
              </p>

              {/* Spacing & Dimensions */}
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Spacing & Dimensions</h3>
                <SpecTable
                  headers={['Property', 'Value', 'Description']}
                  rows={[
                    ['Track width', <PixelValue key="tw" value="40px" />, 'Width of the switch track'],
                    ['Track height', <PixelValue key="th" value="24px" />, 'Height of the switch track'],
                    ['Thumb size', <PixelValue key="ts" value="18px" />, 'Diameter of the thumb circle'],
                    ['Thumb offset', <PixelValue key="to" value="3px" />, 'Inset of thumb from track edge'],
                    ['Container padding', <TokenValue key="cp" token="spacing.xs spacing.sm" value={`${spacing.xs} ${spacing.sm}`} />, 'Padding around switch item'],
                    ['Label gap', <TokenValue key="lg" token="spacing.xs" value={spacing.xs} />, 'Gap between switch and label'],
                    ['Metadata top margin', <PixelValue key="mm" value="2px" />, 'Space between label and metadata'],
                  ]}
                />
              </div>

              {/* Typography */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Typography</h3>
                <SpecTable
                  headers={['Element', 'Font Size', 'Weight', 'Line Height']}
                  rows={[
                    [
                      'Label',
                      <TokenValue key="lfs" token="typography.body.sm.fontSize" value={typography.body.sm.fontSize} />,
                      <PixelValue key="lw" value="Regular (400)" />,
                      <TokenValue key="llh" token="typography.body.sm.lineHeight" value={typography.body.sm.lineHeight} />,
                    ],
                    [
                      'Metadata',
                      <TokenValue key="mfs" token="typography.body.xs.fontSize" value={typography.body.xs.fontSize} />,
                      <PixelValue key="mw" value="Regular (400)" />,
                      <TokenValue key="mlh" token="typography.body.xs.lineHeight" value={typography.body.xs.lineHeight} />,
                    ],
                  ]}
                />
              </div>

              {/* Colors by State */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Colors by State</h3>
                <SpecTable
                  headers={['State', 'Track Color', 'Thumb Color']}
                  rows={[
                    [
                      'Off',
                      <TokenValue key="offt" token="colors.border.midEmphasis.onLight" value={colors.border.midEmphasis.onLight} />,
                      <PixelValue key="offth" value="#FFFFFF" />,
                    ],
                    [
                      'Off (hover)',
                      <TokenValue key="offht" token="colors.border.highEmphasis.onLight" value={colors.border.highEmphasis.onLight} />,
                      <PixelValue key="offhth" value="#FFFFFF" />,
                    ],
                    [
                      'On',
                      <TokenValue key="ont" token="colors.brand.default" value={colors.brand.default} />,
                      <PixelValue key="onth" value="#FFFFFF" />,
                    ],
                    [
                      'Disabled',
                      <TokenValue key="dist" token="colors.surface.disabled.onLight" value={colors.surface.disabled.onLight} />,
                      <TokenValue key="disth" token="colors.text.disabled.onLight" value={colors.text.disabled.onLight} />,
                    ],
                  ]}
                />
              </div>

              {/* Animation */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Animation</h3>
                <SpecTable
                  headers={['Property', 'Value']}
                  rows={[
                    ['Track transition', <PixelValue key="tt" value="0.2s ease" />],
                    ['Thumb slide transition', <PixelValue key="tst" value="0.2s ease" />],
                    ['Thumb shadow', <PixelValue key="tsh" value="0 1px 3px rgba(0,0,0,0.2)" />],
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
              <CodeBlock>{`import { Switch } from '@/components'
import type { SwitchProps } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>{`// Simple toggle
<Switch
  label="Dark mode"
  checked={isDark}
  onChange={(checked) => setIsDark(checked)}
/>

// With metadata
<Switch
  label="Email notifications"
  metadata="Receive updates about your account"
  checked={emailEnabled}
  onChange={(checked) => setEmailEnabled(checked)}
/>

// Label on left side (start placement)
<Switch
  label="Auto-save"
  labelPlacement="start"
  fullWidth
  checked={autoSave}
  onChange={(checked) => setAutoSave(checked)}
/>

// Error state
<Switch
  label="Accept terms"
  error
  checked={accepted}
  onChange={(checked) => setAccepted(checked)}
/>`}</CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Switch Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="l">label</code>, <code key="lt">string</code>, '—', 'Label text displayed next to the switch'],
                  [<code key="m">metadata</code>, <code key="mt">string</code>, '—', 'Description text below the label'],
                  [<code key="c">checked</code>, <code key="ct">boolean</code>, <code key="cd">false</code>, 'Controlled on/off state'],
                  [<code key="o">onChange</code>, <code key="ot">{'(checked: boolean, event) => void'}</code>, '—', 'Change handler'],
                  [<code key="d">disabled</code>, <code key="dt">boolean</code>, <code key="dd">false</code>, 'Disables the switch'],
                  [<code key="e">error</code>, <code key="et">boolean</code>, <code key="ed">false</code>, 'Shows error state'],
                  [<code key="lp">labelPlacement</code>, <code key="lpt">{"'start' | 'end'"}</code>, <code key="lpd">{"'end'"}</code>, 'Label position relative to switch'],
                  [<code key="fw">fullWidth</code>, <code key="fwt">boolean</code>, <code key="fwd">false</code>, 'Spreads label and switch across container'],
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
                <li>Toggle a single setting on or off with immediate effect</li>
                <li>Binary choices that take effect without needing to submit a form</li>
                <li>Settings pages where each toggle applies independently</li>
              </ul>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When Not to Use</h3>
              <SpecTable
                headers={['Scenario', 'Use Instead']}
                rows={[
                  ['Selecting from multiple options', 'Radio or Checkbox'],
                  ['Action requires form submission', 'Checkbox'],
                  ['Play/pause or expand/collapse actions', 'Icon button'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use clear, descriptive labels', 'Use negative phrasing ("Disable X")'],
                  ['Apply changes immediately on toggle', 'Require a separate submit action'],
                  ['Use fullWidth + start placement for settings lists', 'Mix label placements in the same list'],
                  ['Provide metadata for complex settings', 'Use lengthy labels to explain behavior'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Uses <code>role=&quot;switch&quot;</code> for proper screen reader semantics</li>
                <li>Native <code>&lt;input type=&quot;checkbox&quot;&gt;</code> with switch role for keyboard support</li>
                <li><code>aria-checked</code> reflects the current on/off state</li>
                <li>Focus-visible ring for keyboard navigation</li>
                <li><code>aria-invalid</code> set on error state</li>
                <li>Label associated via <code>htmlFor</code>/<code>id</code> pairing</li>
              </ul>
            </div>
          </section>
        </>
      )}

      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={switchDocData} />
      )}
    </StyleguideLayout>
  )
}
