'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox as StyledCheckboxControl, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { Switch } from '@/components'
import type { SwitchVariant } from '@/components/Switch'
import { colors, spacing, typography } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// DOC DATA
// =============================================================================

const switchDocData: ComponentDocData = {
  displayName: 'Switch',
  importPath: '@/components',
  importStatement: `import { Switch } from '@/components'\nimport type { SwitchProps, SwitchVariant } from '@/components'`,
  description: 'Switches toggle a single setting on or off with immediate effect. Supports four visual variants: default, icon, text, and icon + text.',
  props: [
    { name: 'label', type: 'string', description: 'Label text displayed next to the switch' },
    { name: 'metadata', type: 'string', description: 'Description text below the label' },
    { name: 'checked', type: 'boolean', description: 'Controlled on/off state' },
    { name: 'onChange', type: '(checked: boolean, event) => void', description: 'Change handler' },
    { name: 'variant', type: "'default' | 'icon' | 'text' | 'iconText'", default: "'default'", description: 'Visual variant — controls icon/text display' },
    { name: 'onLabel', type: 'string', default: "'On'", description: 'Custom "on" text (text/iconText variants)' },
    { name: 'offLabel', type: 'string', default: "'Off'", description: 'Custom "off" text (text/iconText variants)' },
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
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Active/on track color, icon color, status text' },
    { token: 'colors.border.midEmphasis.onLight', value: 'Gray', usage: 'Inactive/off track color' },
    { token: 'colors.surface.disabled.onLight', value: 'Light gray', usage: 'Disabled track color' },
    { token: 'typography.body.sm', value: '14px/20px', usage: 'Label text' },
    { token: 'typography.body.xs', value: '12px/16px', usage: 'Metadata and status text (On/Off)' },
  ],
  relatedComponents: [
    { name: 'Checkbox', href: '/components/checkbox' },
    { name: 'Radio', href: '/components/radio' },
    { name: 'ColumnManager', href: '/components/column-manager' },
  ],
  notes: [
    'Use Switch for settings that take effect immediately (no form submission needed).',
    'Prefer Checkbox for options that require a form submission to take effect.',
    'Use the icon variant when users benefit from visual confirmation (checkmark/X).',
    'Use the text variant for accessibility — "On"/"Off" labels make state explicit.',
    'Use fullWidth with labelPlacement="start" for settings-style layouts.',
  ],
  whenToUse: [
    'Binary on/off toggles that take effect immediately (e.g., enable notifications, dark mode).',
    'Settings pages with labeled toggles in a vertical list.',
    'Column visibility toggles, feature flags, permission controls.',
  ],
  whenNotToUse: [
    { scenario: 'Option that requires form submission', instead: 'Checkbox — conventional form control' },
    { scenario: 'Choosing one from multiple options', instead: 'Radio — single selection from a group' },
    { scenario: 'Selecting from a dropdown list', instead: 'Select — dropdown for predefined options' },
  ],
  usageExamples: [
    {
      title: 'Settings toggle with icon',
      description: 'Icon variant shows checkmark when on and X when off for clear visual feedback.',
      isDefault: true,
      code: `<Switch\n  variant="icon"\n  label="Enable email notifications"\n  checked={emailEnabled}\n  onChange={setEmailEnabled}\n  fullWidth\n  labelPlacement="start"\n/>`,
    },
    {
      title: 'Text variant for accessibility',
      description: 'On/Off labels make the state explicit without relying on color alone.',
      code: `<Switch\n  variant="text"\n  label="Two-factor authentication"\n  checked={twoFactor}\n  onChange={setTwoFactor}\n/>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function SwitchPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoChecked, setDemoChecked] = useState(true)
  const [demoVariant, setDemoVariant] = useState<SwitchVariant>('default')
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoError, setDemoError] = useState(false)
  const [demoShowMetadata, setDemoShowMetadata] = useState(false)
  const [demoFullWidth, setDemoFullWidth] = useState(false)
  const [demoLabelPlacement, setDemoLabelPlacement] = useState<'start' | 'end'>('end')

  // Variant showcase state
  const [showcaseStates, setShowcaseStates] = useState({
    default: true,
    icon: true,
    text: true,
    iconText: true,
  })

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const generateCode = () => {
    const lines = ['<Switch']
    if (demoVariant !== 'default') lines.push(`  variant="${demoVariant}"`)
    lines.push('  label="Toggle option"')
    if (demoShowMetadata) lines.push('  metadata="Additional description text"')
    lines.push(`  checked={${demoChecked}}`)
    if (demoDisabled) lines.push('  disabled')
    if (demoError) lines.push('  error')
    if (demoFullWidth) lines.push('  fullWidth')
    if (demoLabelPlacement === 'start') lines.push('  labelPlacement="start"')
    lines.push('  onChange={(checked) => setChecked(checked)}')
    lines.push('/>')
    return lines.join('\n')
  }

  return (
    <StyleguideLayout
      title="Switch"
      description="Switches toggle a single setting on or off. They provide an immediate, visible response to a binary choice."
      tagline="On. Off. That simple."
      activeId="switch"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
    >
      {/* ========== OVERVIEW TAB ========== */}
      {activePageTab === 'overview' && (
        <>
          {/* Quick Start */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`import { Switch } from '@/components'

<Switch
  variant="icon"
  label="Enable notifications"
  checked={isEnabled}
  onChange={(checked) => setIsEnabled(checked)}
/>`}</CodeBlock>
            </div>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Configure switch properties to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing['2xl'] }}>
                {/* Preview/Code */}
                <div>
                  <Playground
                    preview={
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, width: demoFullWidth ? '100%' : 'auto', padding: spacing.md }}>
                        <Switch
                          variant={demoVariant}
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
                    code={generateCode()}
                    previewPadding={spacing.xs}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
                    {/* Variant */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: spacing.xs }}>
                        Variant
                      </label>
                      <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                        {(['default', 'icon', 'text', 'iconText'] as const).map((v) => (
                          <PillButton
                            key={v}
                            onClick={() => setDemoVariant(v)}
                            isActive={demoVariant === v}
                          >
                            {v === 'iconText' ? 'icon + text' : v}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Label Placement */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: spacing.xs }}>
                        Label Placement
                      </label>
                      <div style={{ display: 'flex', gap: spacing.xs }}>
                        {(['end', 'start'] as const).map((p) => (
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

                    {/* Toggles */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: spacing.xs }}>
                        Options
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <StyledCheckboxControl checked={demoShowMetadata} onChange={setDemoShowMetadata} label="Metadata" />
                        <StyledCheckboxControl checked={demoFullWidth} onChange={setDemoFullWidth} label="Full Width" />

                        <StyledCheckboxControl checked={demoDisabled} onChange={setDemoDisabled} label="Disabled" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Variant Showcase */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Variants</h2>
            <p style={sharedStyles.sectionDescription}>
              All four variants side by side — toggle each to see on and off states.
            </p>

            <div style={sharedStyles.card}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: spacing.xl,
                  textAlign: 'center',
                }}
              >
                {/* Headers */}
                {['Default', 'Icon', 'Text', 'Icon and text'].map((title) => (
                  <div
                    key={title}
                    style={{
                      ...typography.label.md,
                      color: colors.text.highEmphasis.onLight,
                      paddingBottom: spacing.sm,
                    }}
                  >
                    {title}
                  </div>
                ))}

                {/* On states */}
                {(['default', 'icon', 'text', 'iconText'] as const).map((v) => (
                  <div key={`${v}-on`} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Switch
                      variant={v}
                      checked={showcaseStates[v]}
                      onChange={(checked) =>
                        setShowcaseStates((prev) => ({ ...prev, [v]: checked }))
                      }
                    />
                  </div>
                ))}

                {/* Disabled states */}
                {(['default', 'icon', 'text', 'iconText'] as const).map((v) => (
                  <div key={`${v}-disabled`} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Switch
                      variant={v}
                      checked={false}
                      disabled
                      onChange={() => {}}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Design Tokens */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Spacing, color, and dimension values used in the Switch component.
              </p>

              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Spacing & Dimensions</h3>
                <SpecTable
                  headers={['Property', 'Value', 'Description']}
                  rows={[
                    ['Track width', <PixelValue key="tw" value="44px" />, 'Width of the switch track'],
                    ['Track height', <PixelValue key="th" value="24px" />, 'Height of the switch track'],
                    ['Thumb size', <PixelValue key="ts" value="18px" />, 'Diameter of the thumb circle'],
                    ['Thumb offset', <PixelValue key="to" value="3px" />, 'Inset of thumb from track edge'],
                    ['Container padding', <TokenValue key="cp" token="spacing.xs spacing.sm" value={`${spacing.xs} ${spacing.sm}`} />, 'Padding around switch item'],
                    ['Label gap', <TokenValue key="lg" token="spacing.xs" value={spacing.xs} />, 'Gap between switch and label'],
                  ]}
                />
              </div>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Colors by State</h3>
                <SpecTable
                  headers={['State', 'Track', 'Thumb', 'Icon/Text']}
                  rows={[
                    [
                      'Off',
                      <TokenValue key="offt" token="colors.border.midEmphasis.onLight" value={colors.border.midEmphasis.onLight} />,
                      <PixelValue key="offth" value="#FFFFFF" />,
                      <TokenValue key="offic" token="colors.text.lowEmphasis.onLight" value={colors.text.lowEmphasis.onLight} />,
                    ],
                    [
                      'On',
                      <TokenValue key="ont" token="colors.brand.default" value={colors.brand.default} />,
                      <PixelValue key="onth" value="#FFFFFF" />,
                      <TokenValue key="onic" token="colors.brand.default" value={colors.brand.default} />,
                    ],
                    [
                      'Disabled',
                      <TokenValue key="dist" token="colors.surface.disabled.onLight" value={colors.surface.disabled.onLight} />,
                      <TokenValue key="disth" token="colors.text.disabled.onLight" value={colors.text.disabled.onLight} />,
                      <TokenValue key="disic" token="colors.text.disabled.onLight" value={colors.text.disabled.onLight} />,
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
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>{`import { Switch } from '@/components'
import type { SwitchProps, SwitchVariant } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Variants</h3>
              <CodeBlock>{`// Default — plain toggle
<Switch label="Dark mode" checked={isDark} onChange={setIsDark} />

// Icon — checkmark when on, X when off
<Switch variant="icon" label="Auto-save" checked={autoSave} onChange={setAutoSave} />

// Text — "On"/"Off" labels beside the track
<Switch variant="text" label="Sync" checked={sync} onChange={setSync} />

// Icon + Text — both indicators for maximum clarity
<Switch variant="iconText" label="Public profile" checked={isPublic} onChange={setIsPublic} />

// Custom on/off labels
<Switch variant="text" onLabel="Yes" offLabel="No" label="Agree?" checked={agreed} onChange={setAgreed} />`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Settings List Pattern</h3>
              <CodeBlock>{`// Full-width with label on left — classic settings layout
<div style={{ display: 'flex', flexDirection: 'column' }}>
  <Switch variant="icon" label="Email notifications" fullWidth labelPlacement="start" checked={email} onChange={setEmail} />
  <Switch variant="icon" label="Push notifications" fullWidth labelPlacement="start" checked={push} onChange={setPush} />
  <Switch variant="icon" label="SMS alerts" fullWidth labelPlacement="start" checked={sms} onChange={setSms} />
</div>`}</CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>
            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="v">variant</code>, <code key="vt">{"'default' | 'icon' | 'text' | 'iconText'"}</code>, <code key="vd">{"'default'"}</code>, 'Visual variant'],
                  [<code key="l">label</code>, <code key="lt">string</code>, '—', 'Label text'],
                  [<code key="m">metadata</code>, <code key="mt">string</code>, '—', 'Description below label'],
                  [<code key="c">checked</code>, <code key="ct">boolean</code>, <code key="cd">false</code>, 'On/off state'],
                  [<code key="o">onChange</code>, <code key="ot">{'(checked, event) => void'}</code>, '—', 'Change handler'],
                  [<code key="ol">onLabel</code>, <code key="olt">string</code>, <code key="old">{"'On'"}</code>, 'Custom on text'],
                  [<code key="fl">offLabel</code>, <code key="flt">string</code>, <code key="fld">{"'Off'"}</code>, 'Custom off text'],
                  [<code key="lp">labelPlacement</code>, <code key="lpt">{"'start' | 'end'"}</code>, <code key="lpd">{"'end'"}</code>, 'Label position'],
                  [<code key="fw">fullWidth</code>, <code key="fwt">boolean</code>, <code key="fwd">false</code>, 'Full-width layout'],
                  [<code key="d">disabled</code>, <code key="dt">boolean</code>, <code key="dd">false</code>, 'Disabled state'],
                  [<code key="e">error</code>, <code key="et">boolean</code>, <code key="ed">false</code>, 'Error state'],
                ]}
              />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <div style={sharedStyles.card}>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Uses <code>role=&quot;switch&quot;</code> on native <code>&lt;input type=&quot;checkbox&quot;&gt;</code></li>
                <li><code>aria-checked</code> reflects the current state</li>
                <li>Text and icon variants provide redundant state indication beyond color</li>
                <li>Focus-visible ring for keyboard navigation</li>
                <li>Label associated via <code>htmlFor</code>/<code>id</code></li>
                <li>Icons and status text are <code>aria-hidden</code> — the input role communicates state</li>
              </ul>
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={switchDocData} />
      )}
    </StyleguideLayout>
  )
}
