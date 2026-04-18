'use client'

import React, { useState, useEffect } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox as StyledCheckboxControl, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData, PropertiesDrawer, PropertySection, MobileFab, DRAWER_WIDTH } from '../../design-system/shared'
import { Checkbox, CheckboxGroup } from '@/components'
import { colors, spacing, typography, borderRadius, fontFamilies, fontWeights, transitionPresets, breakpoints } from '@/styles/design-tokens'
import { useColors } from '@/styles/themes'
import { useIsMobile } from '@/hooks'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'specs' | 'implementation' | 'documentation'

// =============================================================================
// DOC DATA
// =============================================================================

const checkboxDocData: ComponentDocData = {
  displayName: 'Checkbox',
  importPath: '@/components',
  importStatement: `import { Checkbox, CheckboxGroup } from '@/components'
import type { CheckboxProps, CheckboxGroupProps } from '@/components'`,
  description: 'Checkboxes allow selection of one or more items from a set, with support for indeterminate state.',
  props: [
    { name: 'label', type: 'string', description: 'Label text displayed next to the checkbox' },
    { name: 'metadata', type: 'string', description: 'Description text below the label' },
    { name: 'checked', type: 'boolean', default: 'false', description: 'Controlled checked state' },
    { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Indeterminate state (overrides checked visually)' },
    { name: 'onChange', type: '(checked: boolean, event) => void', description: 'Change handler' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the checkbox' },
    { name: 'error', type: 'boolean', default: 'false', description: 'Shows error border color' },
    { name: 'isChild', type: 'boolean', default: 'false', description: 'Indents the checkbox for parent/child patterns' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Makes checkbox take full container width' },
    { name: 'noRoundedCorners', type: 'boolean', default: 'false', description: 'Removes border radius for custom patterns' },
  ],
  subComponents: [
    {
      name: 'CheckboxGroup',
      description: 'Groups related checkboxes with a shared label and error handling.',
      props: [
        { name: 'label', type: 'string', description: 'Group label text' },
        { name: 'error', type: 'boolean', default: 'false', description: 'Shows error state' },
        { name: 'errorMessage', type: 'string', description: 'Error message text' },
        { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Full container width' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Checkbox components' },
      ],
    },
  ],
  typeDefinitions: [],
  accessibility: [
    { feature: 'Native Element', description: 'Uses <input type="checkbox"> for full keyboard and screen reader support.' },
    { feature: 'Focus Ring', description: 'Focus-visible ring using colors.focusBorder.onLight for keyboard navigation.' },
    { feature: 'Error State', description: 'aria-invalid set on error state for assistive technology.' },
    { feature: 'Error Messages', description: 'aria-describedby links error messages to checkbox groups; errors use role="alert".' },
    { feature: 'Group Semantics', description: 'role="group" with aria-labelledby for checkbox groups.' },
    { feature: 'Indeterminate', description: 'Communicated via native input.indeterminate property.' },
  ],
  tokens: [
    { token: 'colors.brand.default', value: 'Theme brand color', usage: 'Checked/indeterminate background and border' },
    { token: 'colors.border.midEmphasis.onLight', value: 'Gray border', usage: 'Unchecked border' },
    { token: 'colors.status.important', value: 'Error red', usage: 'Error border color' },
    { token: 'typography.body.sm', value: '14px/20px', usage: 'Label text' },
    { token: 'typography.body.xs', value: '12px/16px', usage: 'Metadata and error text' },
    { token: 'borderRadius.xs', value: '4px', usage: 'Checkbox indicator corners' },
    { token: 'transitionPresets.default', value: '200ms ease', usage: 'State transitions' },
  ],
  relatedComponents: [
    { name: 'Radio', href: '/components/radio' },
    { name: 'Switch', href: '/components/switch' },
    { name: 'List Item', href: '/components/list-item' },
  ],
  notes: [
    'Use CheckboxGroup for related options to get shared label and error handling.',
    'Use indeterminate state for parent checkboxes in parent/child selection patterns.',
    'Prefer Radio when only one option can be selected from a group.',
    'Prefer Switch for instant on/off toggles without a form submission.',
  ],
  whenToUse: [
    'Multiple selections from a list of options within a form (e.g., select compliance categories, choose notification types).',
    'Single boolean opt-in that requires form submission (e.g., "I agree to terms").',
    'Parent/child selection trees using indeterminate state.',
  ],
  whenNotToUse: [
    { scenario: 'Only one option can be selected from a group', instead: 'Radio — enforces single selection' },
    { scenario: 'Instant on/off toggle without form submission', instead: 'Switch — conveys immediate effect' },
    { scenario: 'Selecting from a dropdown list', instead: 'Select — compact dropdown for predefined options' },
  ],
  usageExamples: [
    {
      title: 'Multi-select checkbox group',
      description: 'Group of checkboxes with shared label and error handling. onChange provides checked boolean as first arg.',
      isDefault: true,
      code: `<CheckboxGroup label="Notification preferences">\n  <Checkbox\n    label="Email"\n    checked={prefs.email}\n    onChange={(checked) => setPrefs({ ...prefs, email: checked })}\n  />\n  <Checkbox\n    label="SMS"\n    checked={prefs.sms}\n    onChange={(checked) => setPrefs({ ...prefs, sms: checked })}\n  />\n</CheckboxGroup>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function CheckboxPage() {
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
  const [demoChecked, setDemoChecked] = useState(false)
  const [demoIndeterminate, setDemoIndeterminate] = useState(false)
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoError, setDemoError] = useState(false)
  const [demoShowMetadata, setDemoShowMetadata] = useState(false)
  const [demoIsChild, setDemoIsChild] = useState(false)
  const [demoFullWidth, setDemoFullWidth] = useState(false)

  const componentTabs = [
    { id: 'overview', label: 'Playground' },
    { id: 'specs', label: 'Specs' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  // Generate live code string
  const liveCode = `<Checkbox
  label="Option label"${demoShowMetadata ? '\n  metadata="Helpful metadata text"' : ''}
  checked={${demoChecked}}${demoIndeterminate ? '\n  indeterminate' : ''}${demoDisabled ? '\n  disabled' : ''}${demoError ? '\n  error' : ''}${demoIsChild ? '\n  isChild' : ''}${demoFullWidth ? '\n  fullWidth' : ''}
  onChange={(checked) => setChecked(checked)}
/>`

  return (
    <StyleguideLayout
      title="Checkbox"
      description="Checkboxes allow selection of one or more items from a set. They can be used standalone or in groups."
      tagline="Binary decisions, beautifully rendered."
      activeId="checkbox"
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
          {/* State */}
          <PropertySection title="State">
            <div style={{ display: 'flex', gap: spacing['2xs'], flexWrap: 'wrap' }}>
              <PillButton isActive={demoChecked && !demoIndeterminate} onClick={() => { setDemoChecked(true); setDemoIndeterminate(false) }}>Checked</PillButton>
              <PillButton isActive={!demoChecked && !demoIndeterminate} onClick={() => { setDemoChecked(false); setDemoIndeterminate(false) }}>Unchecked</PillButton>
              <PillButton isActive={demoIndeterminate} onClick={() => { setDemoIndeterminate(true); setDemoChecked(false) }}>Indeterminate</PillButton>
            </div>
          </PropertySection>

          {/* Options */}
          <PropertySection title="Options">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              <StyledCheckboxControl checked={demoDisabled} onChange={() => setDemoDisabled(!demoDisabled)} label="Disabled" />
              <StyledCheckboxControl checked={demoError} onChange={() => setDemoError(!demoError)} label="Error" />
              <StyledCheckboxControl checked={demoShowMetadata} onChange={() => setDemoShowMetadata(!demoShowMetadata)} label="Metadata" />
              <StyledCheckboxControl checked={demoIsChild} onChange={() => setDemoIsChild(!demoIsChild)} label="Child" />
              <StyledCheckboxControl checked={demoFullWidth} onChange={() => setDemoFullWidth(!demoFullWidth)} label="Full Width" />
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, width: demoFullWidth ? '100%' : 'auto' }}>
              <Checkbox
                label="Option label"
                metadata={demoShowMetadata ? 'Helpful metadata text' : undefined}
                checked={demoChecked}
                indeterminate={demoIndeterminate}
                disabled={demoDisabled}
                error={demoError}
                isChild={demoIsChild}
                fullWidth={demoFullWidth}
                onChange={(checked) => {
                  setDemoChecked(checked)
                  if (demoIndeterminate) setDemoIndeterminate(false)
                }}
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
              Spacing, color, and typography values used in the Checkbox component. Click any token to copy it.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Spacing & Dimensions</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Checkbox size', <CopyableToken key="cs" token="18px (fixed)" />, <PixelValue key="csv" value="18px" />],
                  ['Border radius', <CopyableToken key="br" token="borderRadius.xs" />, <PixelValue key="brv" value={borderRadius.xs} />],
                  ['Border width', <CopyableToken key="bw" token="1.5px (fixed)" />, <PixelValue key="bwv" value="1.5px" />],
                  ['Container padding', <CopyableToken key="cp" token={`spacing.xs spacing.sm`} />, <PixelValue key="cpv" value={`${spacing.xs} ${spacing.sm}`} />],
                  ['Child indent', <CopyableToken key="ci" token="spacing['2xl']" />, <PixelValue key="civ" value={spacing['2xl']} />],
                  ['Label gap', <CopyableToken key="lg" token="spacing.xs" />, <PixelValue key="lgv" value={spacing.xs} />],
                  ['Group bottom margin', <CopyableToken key="gm" token="spacing.md" />, <PixelValue key="gmv" value={spacing.md} />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Element', 'Font Size', 'Font Weight', 'Line Height']}
                rows={[
                  ['Label', <TokenValue key="lfs" token="typography.body.sm.fontSize" value={typography.body.sm.fontSize} />, <TokenValue key="lfw" token="fontWeights.regular" value="400" />, <TokenValue key="llh" token="typography.body.sm.lineHeight" value={typography.body.sm.lineHeight} />],
                  ['Metadata', <TokenValue key="mfs" token="typography.body.xs.fontSize" value={typography.body.xs.fontSize} />, <TokenValue key="mfw" token="fontWeights.regular" value="400" />, <TokenValue key="mlh" token="typography.body.xs.lineHeight" value={typography.body.xs.lineHeight} />],
                  ['Group label', <TokenValue key="gfs" token="typography.body.sm.fontSize" value={typography.body.sm.fontSize} />, <TokenValue key="gfw" token="fontWeights.medium" value="500" />, <TokenValue key="glh" token="typography.body.sm.lineHeight" value={typography.body.sm.lineHeight} />],
                  ['Error message', <TokenValue key="efs" token="typography.body.xs.fontSize" value={typography.body.xs.fontSize} />, <TokenValue key="efw" token="fontWeights.regular" value="400" />, <TokenValue key="elh" token="typography.body.xs.lineHeight" value={typography.body.xs.lineHeight} />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Colors</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['State', 'Border', 'Background', 'Icon']}
                rows={[
                  ['Unchecked', <TokenValue key="ub" token="colors.border.midEmphasis.onLight" value={colors.border.midEmphasis.onLight} />, <PixelValue key="ubg" value="transparent" />, '—'],
                  ['Checked', <TokenValue key="cb" token="colors.brand.default" value={colors.brand.default} />, <TokenValue key="cbg" token="colors.brand.default" value={colors.brand.default} />, <PixelValue key="ci2" value="#FFFFFF" />],
                  ['Indeterminate', <TokenValue key="ib" token="colors.brand.default" value={colors.brand.default} />, <TokenValue key="ibg" token="colors.brand.default" value={colors.brand.default} />, <PixelValue key="ii" value="#FFFFFF" />],
                  ['Error', <TokenValue key="eb" token="colors.status.important" value={colors.status.important} />, <PixelValue key="ebg" value="transparent" />, '—'],
                  ['Disabled (unchecked)', <TokenValue key="dub" token="colors.border.lowEmphasis.onLight" value={colors.border.lowEmphasis.onLight} />, <PixelValue key="dubg" value="transparent" />, '—'],
                  ['Disabled (checked)', <TokenValue key="dcb" token="colors.border.lowEmphasis.onLight" value={colors.border.lowEmphasis.onLight} />, <TokenValue key="dcbg" token="colors.surface.disabled.onLight" value={colors.surface.disabled.onLight} />, <TokenValue key="dci" token="colors.text.disabled.onLight" value={colors.text.disabled.onLight} />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Focus Ring</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Color', <CopyableToken key="fc" token="colors.focusBorder.onLight" />, <PixelValue key="fcv" value={colors.focusBorder.onLight} />],
                  ['Width', <CopyableToken key="fw" token="2px" />, <PixelValue key="fwv" value="2px" />],
                  ['Offset', <CopyableToken key="fo" token="2px" />, <PixelValue key="fov" value="2px" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Animation</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Transition', <CopyableToken key="tr" token="transitionPresets.default" />, <PixelValue key="trv" value={transitionPresets.default} />],
                ]}
              />
            </div>
          </section>

          {/* Accessibility */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <p style={sharedStyles.sectionDescription}>
              WCAG 2.2 AA compliance details for the Checkbox component.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Keyboard Interaction</h3>
              <SpecTable
                headers={['Key', 'Action']}
                rows={[
                  [<kbd key="tab">Tab</kbd>, 'Move focus to / from the checkbox'],
                  [<kbd key="space">Space</kbd>, 'Toggle checkbox checked state'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>ARIA Attributes</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Attribute', 'When', 'Purpose']}
                rows={[
                  [<code key="role">role="group"</code>, 'CheckboxGroup', 'Groups related checkboxes'],
                  [<code key="alb">aria-labelledby</code>, 'CheckboxGroup', 'Associates group with its label'],
                  [<code key="inv">aria-invalid="true"</code>, 'Error state', 'Communicates validation error'],
                  [<code key="desc">aria-describedby</code>, 'Error message present', 'Links error message to checkbox'],
                  [<code key="ind">indeterminate</code>, 'Parent checkbox', 'Native property for partial selection'],
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
                  ['Focus indicator', 'WCAG 2.4.7 — visible focus ring', 'Pass (2px brand ring with offset)'],
                  ['Touch target size', 'WCAG 2.5.8 — minimum 44x44px', 'Pass (padding creates adequate target)'],
                  ['Color not sole indicator', 'WCAG 1.4.1 — not only visual cue', 'Pass (checkmark icon + color)'],
                  ['Reduced motion', 'WCAG 2.3.3 — prefers-reduced-motion', 'Pass (transitions disabled)'],
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
import { Checkbox, CheckboxGroup } from '@lumen/design-system'

// Or with path alias (requires tsconfig setup)
import { Checkbox, CheckboxGroup } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* Usage */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>{`// Standalone checkbox
<Checkbox
  label="Accept terms and conditions"
  checked={accepted}
  onChange={(checked) => setAccepted(checked)}
/>

// With metadata
<Checkbox
  label="Marketing emails"
  metadata="Receive updates about new features and promotions"
  checked={marketing}
  onChange={(checked) => setMarketing(checked)}
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Checkbox Group</h3>
              <CodeBlock>{`<CheckboxGroup label="Notifications" error={hasError} errorMessage="Select at least one">
  <Checkbox label="Email" checked={prefs.email} onChange={...} />
  <Checkbox label="SMS" checked={prefs.sms} onChange={...} />
  <Checkbox label="Push" checked={prefs.push} onChange={...} />
</CheckboxGroup>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Parent/Child Pattern</h3>
              <CodeBlock>{`<Checkbox
  label="Select All"
  checked={allSelected}
  indeterminate={someSelected && !allSelected}
  onChange={(checked) => selectAll(checked)}
/>
<Checkbox label="Item A" isChild checked={items.a} onChange={...} />
<Checkbox label="Item B" isChild checked={items.b} onChange={...} />`}</CodeBlock>
            </div>
          </section>

          {/* Props */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Checkbox Props</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="l">label</code>, <code key="lt">string</code>, '—', 'Label text'],
                  [<code key="m">metadata</code>, <code key="mt">string</code>, '—', 'Description text below the label'],
                  [<code key="c">checked</code>, <code key="ct">boolean</code>, <code key="cd">false</code>, 'Controlled checked state'],
                  [<code key="i">indeterminate</code>, <code key="it">boolean</code>, <code key="id">false</code>, 'Indeterminate state'],
                  [<code key="oc">onChange</code>, <code key="oct">(checked, event) =&gt; void</code>, '—', 'Change handler'],
                  [<code key="d">disabled</code>, <code key="dt">boolean</code>, <code key="dd">false</code>, 'Disables the checkbox'],
                  [<code key="e">error</code>, <code key="et">boolean</code>, <code key="ed">false</code>, 'Error border color'],
                  [<code key="ic">isChild</code>, <code key="ict">boolean</code>, <code key="icd">false</code>, 'Indents for parent/child patterns'],
                  [<code key="fw">fullWidth</code>, <code key="fwt">boolean</code>, <code key="fwd">false</code>, 'Full container width'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>CheckboxGroup Props</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="gl">label</code>, <code key="glt">string</code>, '—', 'Group label text'],
                  [<code key="ge">error</code>, <code key="get">boolean</code>, <code key="ged">false</code>, 'Shows error state'],
                  [<code key="gem">errorMessage</code>, <code key="gemt">string</code>, '—', 'Error message text'],
                  [<code key="gfw">fullWidth</code>, <code key="gfwt">boolean</code>, <code key="gfwd">false</code>, 'Full container width'],
                  [<code key="gch">children</code>, <code key="gcht">ReactNode</code>, '—', 'Checkbox components'],
                ]}
              />
            </div>
          </section>

          {/* Design Guidance */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Provide a visible label for every checkbox', 'Use checkboxes without labels'],
                  ['Use CheckboxGroup for related options', 'Mix unrelated options in one group'],
                  ['Use indeterminate state for parent checkboxes', 'Use indeterminate for single options'],
                  ['Keep labels concise and descriptive', 'Use vague or overly long labels'],
                  ['Use error state with a clear error message', 'Show errors without explanation'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={checkboxDocData} />
      )}
    </StyleguideLayout>
  )
}
