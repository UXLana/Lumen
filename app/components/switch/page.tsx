'use client'

import React, { useState, useEffect } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, PillButton, StyledCheckbox as StyledCheckboxControl, TokenValue, CopyableToken, PixelValue, ComponentDocumentation, ComponentDocData, PropertiesDrawer, PropertySection, MobileFab, DRAWER_WIDTH } from '../../design-system/shared'
import { Switch } from '@/components'
import type { SwitchVariant } from '@/components/Switch'
import { colors, spacing, typography, borderRadius, breakpoints } from '@/styles/design-tokens'
import { useColors } from '@/styles/themes'
import { useIsMobile } from '@/hooks'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'specs' | 'implementation' | 'documentation'

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
  const isMobile = useIsMobile()
  const themeColors = useColors()

  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Properties drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(!isMobile)
  }, [isMobile])

  // Playground state
  const [demoChecked, setDemoChecked] = useState(true)
  const [demoVariant, setDemoVariant] = useState<SwitchVariant>('default')
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoError, setDemoError] = useState(false)
  const [demoShowMetadata, setDemoShowMetadata] = useState(false)
  const [demoFullWidth, setDemoFullWidth] = useState(false)
  const [demoLabelPlacement, setDemoLabelPlacement] = useState<'start' | 'end'>('end')

  const componentTabs = [
    { id: 'overview', label: 'Playground' },
    { id: 'specs', label: 'Specs' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  // Generate live code string
  const liveCode = (() => {
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
  })()

  return (
    <StyleguideLayout
      title="Switch"
      description="Switches toggle a single setting on or off. They provide an immediate, visible response to a binary choice."
      tagline="On. Off. That simple."
      activeId="switch"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
      showPanelToggle={activePageTab === 'overview' && !isMobile}
      panelToggleExpanded={drawerOpen}
      onPanelToggleClick={() => setDrawerOpen(!drawerOpen)}
    >
      {/* ========== FIXED PROPERTIES DRAWER ========== */}
      {activePageTab === 'overview' && (
        <PropertiesDrawer open={drawerOpen} isMobile={isMobile} onClose={() => setDrawerOpen(false)}>
          {/* Variant */}
          <PropertySection title="Variant">
            <div style={{ display: 'flex', gap: spacing['2xs'], flexWrap: 'wrap' }}>
              {(['default', 'icon', 'text', 'iconText'] as const).map((v) => (
                <PillButton key={v} onClick={() => setDemoVariant(v)} isActive={demoVariant === v}>
                  {v === 'iconText' ? 'icon + text' : v}
                </PillButton>
              ))}
            </div>
          </PropertySection>

          {/* Label Placement */}
          <PropertySection title="Label Placement">
            <div style={{ display: 'flex', gap: spacing['2xs'] }}>
              {(['end', 'start'] as const).map((p) => (
                <PillButton key={p} onClick={() => setDemoLabelPlacement(p)} isActive={demoLabelPlacement === p}>
                  {p}
                </PillButton>
              ))}
            </div>
          </PropertySection>

          {/* Options */}
          <PropertySection title="Options">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              <StyledCheckboxControl checked={demoShowMetadata} onChange={setDemoShowMetadata} label="Metadata" />
              <StyledCheckboxControl checked={demoFullWidth} onChange={setDemoFullWidth} label="Full Width" />
              <StyledCheckboxControl checked={demoDisabled} onChange={setDemoDisabled} label="Disabled" />
              <StyledCheckboxControl checked={demoError} onChange={setDemoError} label="Error" />
            </div>
          </PropertySection>
        </PropertiesDrawer>
      )}

      {/* ========== PLAYGROUND TAB ========== */}
      {activePageTab === 'overview' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          marginRight: !isMobile && drawerOpen ? `${DRAWER_WIDTH + 24}px` : 0,
          transition: 'margin-right 0.25s ease',
          minHeight: isMobile ? '300px' : '500px',
          ...(isMobile ? { margin: `0 -${spacing.md}` } : {}),
        }}>
          {/* Preview area */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: colors.surface.lightDarker,
            borderRadius: isMobile ? 0 : borderRadius.lg,
            padding: isMobile ? spacing.xl : spacing['4xl'],
            minHeight: isMobile ? '200px' : '360px',
          }}>
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
          </div>

          {/* Code output */}
          <div style={{ marginTop: spacing.md, ...(isMobile ? { padding: `0 ${spacing.md}` } : {}) }}>
            <CodeBlock>{liveCode}</CodeBlock>
          </div>

          {/* Mobile FAB */}
          {isMobile && !drawerOpen && (
            <MobileFab onClick={() => setDrawerOpen(true)} />
          )}
        </div>
      )}

      {/* ========== SPECS TAB ========== */}
      {activePageTab === 'specs' && (
        <>
          {/* Design Tokens */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>
            <p style={sharedStyles.sectionDescription}>
              Spacing, color, and dimension values used in the Switch component. Click any token to copy it.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Spacing & Dimensions</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
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
                stickyFirstColumn={isMobile}
                headers={['State', 'Track', 'Thumb', 'Icon/Text']}
                rows={[
                  ['Off', <TokenValue key="offt" token="colors.border.midEmphasis.onLight" value={colors.border.midEmphasis.onLight} />, <PixelValue key="offth" value="#FFFFFF" />, <TokenValue key="offic" token="colors.text.lowEmphasis.onLight" value={colors.text.lowEmphasis.onLight} />],
                  ['On', <TokenValue key="ont" token="colors.brand.default" value={colors.brand.default} />, <PixelValue key="onth" value="#FFFFFF" />, <TokenValue key="onic" token="colors.brand.default" value={colors.brand.default} />],
                  ['Disabled', <TokenValue key="dist" token="colors.surface.disabled.onLight" value={colors.surface.disabled.onLight} />, <TokenValue key="disth" token="colors.text.disabled.onLight" value={colors.text.disabled.onLight} />, <TokenValue key="disic" token="colors.text.disabled.onLight" value={colors.text.disabled.onLight} />],
                ]}
              />
            </div>
          </section>

          {/* Accessibility */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <p style={sharedStyles.sectionDescription}>
              WCAG 2.2 AA compliance details for the Switch component.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Keyboard Interaction</h3>
              <SpecTable
                headers={['Key', 'Action']}
                rows={[
                  [<kbd key="tab">Tab</kbd>, 'Move focus to / from the switch'],
                  [<kbd key="space">Space</kbd>, 'Toggle the switch on/off'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>ARIA Attributes</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Attribute', 'When', 'Purpose']}
                rows={[
                  [<code key="role">role="switch"</code>, 'Always', 'Identifies the element as a switch control'],
                  [<code key="ac">aria-checked</code>, 'Always', 'Reflects the current on/off state'],
                  [<code key="lbl">htmlFor/id</code>, 'Always', 'Associates label with the input element'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Visual Requirements</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Requirement', 'Standard', 'Status']}
                rows={[
                  ['Text contrast ratio', 'WCAG 1.4.3 — minimum 4.5:1', 'Pass'],
                  ['Focus indicator', 'WCAG 2.4.7 — visible focus ring', 'Pass'],
                  ['Touch target size', 'WCAG 2.5.8 — minimum 44x44px', 'Pass (44px track width)'],
                  ['Color not sole indicator', 'WCAG 1.4.1 — not only visual cue', 'Pass (icon/text variants provide redundant cues)'],
                  ['Reduced motion', 'WCAG 2.3.3 — prefers-reduced-motion', 'Pass'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          {/* Quick Start */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: breakpoints.sm }}>
              <CodeBlock>{`// Package import
import { Switch } from '@lumen/design-system'

// Or with path alias (requires tsconfig setup)
import { Switch } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* Usage */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Variants</h3>
              <CodeBlock>{`// Default — plain toggle
<Switch label="Dark mode" checked={isDark} onChange={setIsDark} />

// Icon — checkmark when on, X when off
<Switch variant="icon" label="Auto-save" checked={autoSave} onChange={setAutoSave} />

// Text — "On"/"Off" labels beside the track
<Switch variant="text" label="Sync" checked={sync} onChange={setSync} />

// Icon + Text — both indicators for maximum clarity
<Switch variant="iconText" label="Public profile" checked={isPublic} onChange={setIsPublic} />`}</CodeBlock>
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

          {/* Props */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Switch Props</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="v">variant</code>, <code key="vt">&apos;default&apos; | &apos;icon&apos; | &apos;text&apos; | &apos;iconText&apos;</code>, <code key="vd">&apos;default&apos;</code>, 'Visual variant'],
                  [<code key="l">label</code>, <code key="lt">string</code>, '—', 'Label text'],
                  [<code key="m">metadata</code>, <code key="mt">string</code>, '—', 'Description below label'],
                  [<code key="c">checked</code>, <code key="ct">boolean</code>, <code key="cd">false</code>, 'On/off state'],
                  [<code key="o">onChange</code>, <code key="ot">(checked, event) =&gt; void</code>, '—', 'Change handler'],
                  [<code key="ol">onLabel</code>, <code key="olt">string</code>, <code key="old">&apos;On&apos;</code>, 'Custom on text'],
                  [<code key="fl">offLabel</code>, <code key="flt">string</code>, <code key="fld">&apos;Off&apos;</code>, 'Custom off text'],
                  [<code key="lp">labelPlacement</code>, <code key="lpt">&apos;start&apos; | &apos;end&apos;</code>, <code key="lpd">&apos;end&apos;</code>, 'Label position'],
                  [<code key="fw">fullWidth</code>, <code key="fwt">boolean</code>, <code key="fwd">false</code>, 'Full-width layout'],
                  [<code key="d">disabled</code>, <code key="dt">boolean</code>, <code key="dd">false</code>, 'Disabled state'],
                  [<code key="e">error</code>, <code key="et">boolean</code>, <code key="ed">false</code>, 'Error state'],
                ]}
              />
            </div>
          </section>

          {/* Design Guidance */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use Each Variant</h3>
              <SpecTable
                headers={['Variant', 'Usage']}
                rows={[
                  [<code key="d">default</code>, 'Simple on/off toggles where context is clear from the label'],
                  [<code key="i">icon</code>, 'When visual confirmation (checkmark/X) improves clarity'],
                  [<code key="t">text</code>, 'For accessibility — "On"/"Off" labels make state explicit'],
                  [<code key="it">iconText</code>, 'Maximum clarity — both icon and text indicators'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use Switch for immediate-effect toggles', 'Use Switch for form fields that need submit'],
                  ['Use fullWidth + labelPlacement="start" for settings', 'Mix switch and checkbox in the same list'],
                  ['Use icon/text variants for accessibility', 'Rely on color alone to indicate state'],
                  ['Provide a clear label describing the setting', 'Use vague labels like "Enable"'],
                ]}
              />
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
