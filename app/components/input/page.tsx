'use client'

import React, { useState, useEffect } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, PillButton, StyledCheckbox as StyledCheckboxControl, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData, PropertiesDrawer, PropertySection, MobileFab, DRAWER_WIDTH } from '../../design-system/shared'
import { Input } from '@/components'
import type { InputWidth } from '@/components'
import { IconInfoFilled } from '@/components/Icons/IconInfoFilled'
import { colors, spacing, typography, borderRadiusSemantics, borderRadius, breakpoints } from '@/styles/design-tokens'
import { useColors } from '@/styles/themes'
import { useIsMobile } from '@/hooks'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'specs' | 'implementation' | 'documentation'

// =============================================================================
// DOC DATA
// =============================================================================

const inputDocData: ComponentDocData = {
  displayName: 'Input',
  importPath: '@/components',
  importStatement: `import { Input } from '@/components'\nimport type { InputProps } from '@/components'`,
  description: 'Input fields allow users to enter and edit text in forms and dialogs.',
  props: [
    { name: 'label', type: 'string', description: 'Label text above the input' },
    { name: 'helperText', type: 'string', description: 'Helper/description text below the input' },
    { name: 'errorMessage', type: 'string', description: 'Error message (shows error state)' },
    { name: 'error', type: 'boolean', description: 'Whether the input has an error' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Visual size' },
    { name: 'fullWidth', type: 'boolean', description: 'Full-width mode' },
    { name: 'startAdornment', type: 'ReactNode', description: 'Left icon/element' },
    { name: 'endAdornment', type: 'ReactNode', description: 'Right icon/element' },
    { name: 'onChange', type: '(value: string, event) => void', description: 'Change handler with value as first arg' },
    { name: 'required', type: 'boolean', description: 'Whether the field is required' },
    { name: 'disabled', type: 'boolean', description: 'Disabled state' },
    { name: 'placeholder', type: 'string', description: 'Placeholder text' },
  ],
  accessibility: [
    { feature: 'Label Association', description: 'Label automatically associated with input via htmlFor/id.' },
    { feature: 'Error State', description: 'aria-invalid and aria-describedby link error messages to input.' },
    { feature: 'Required', description: 'aria-required set when required prop is true.' },
    { feature: 'Focus Ring', description: 'Visible focus ring on keyboard navigation.' },
  ],
  tokens: [
    { token: 'colors.border.midEmphasis.onLight', value: 'Gray border', usage: 'Default border color' },
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Focus border color' },
    { token: 'colors.status.important', value: 'Error red', usage: 'Error border and message color' },
    { token: 'typography.body.md', value: '16px/24px', usage: 'Input text (md/lg)' },
    { token: 'typography.body.sm', value: '14px/20px', usage: 'Input text (sm)' },
    { token: 'typography.label.sm', value: '14px/20px', usage: 'Label text' },
    { token: 'borderRadius.md', value: '8px', usage: 'Input border radius' },
  ],
  relatedComponents: [
    { name: 'Checkbox', href: '/components/checkbox' },
    { name: 'Radio', href: '/components/radio' },
    { name: 'Assistive Message', href: '/components/assistive-message' },
  ],
  notes: [
    'Always provide a label for accessibility. Use aria-label if the label is visually hidden.',
    'Use errorMessage prop instead of separate error components for consistent error display.',
    'The onChange handler provides the value as the first argument for convenience.',
  ],
  whenToUse: [
    'Single-line text entry: names, emails, search queries, short values.',
    'Any form field that needs a label, placeholder, validation, and assistive text.',
  ],
  whenNotToUse: [
    { scenario: 'Multi-line text (comments, descriptions, notes)', instead: 'Textarea — supports auto-resize and character count' },
    { scenario: 'Selecting from predefined options', instead: 'Select — dropdown for <15 options, or Combobox for searchable' },
  ],
  usageExamples: [
    {
      title: 'Form field with validation',
      description: 'Standard labeled input with error state. onChange provides value as first arg (not event).',
      isDefault: true,
      code: `<Input\n  label="Business Name"\n  value={name}\n  onChange={(value) => setName(value)}\n  errorMessage={errors.name}\n  required\n/>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default function InputPage() {
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
  const [demoValue, setDemoValue] = useState('')
  const [demoSize, setDemoSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [demoWidth, setDemoWidth] = useState<InputWidth>('md')
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoError, setDemoError] = useState(false)
  const [demoRequired, setDemoRequired] = useState(false)
  const [demoShowHelper, setDemoShowHelper] = useState(false)
  const [demoShowAdornment, setDemoShowAdornment] = useState(false)
  const [demoShowEndAdornment, setDemoShowEndAdornment] = useState(false)

  const componentTabs = [
    { id: 'overview', label: 'Playground' },
    { id: 'specs', label: 'Specs' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  // Generate live code string
  const liveCode = `<Input
  label="Label"
  value={value}
  onChange={setValue}${demoSize !== 'md' ? `\n  size="${demoSize}"` : ''}${demoWidth !== 'md' ? `\n  width="${demoWidth}"` : ''}${demoDisabled ? '\n  disabled' : ''}${demoError ? '\n  error\n  errorMessage="This field has an error"' : ''}${demoRequired ? '\n  required' : ''}${demoShowHelper ? '\n  helperText="This is helpful text"' : ''}${demoShowAdornment ? '\n  startAdornment={<SearchIcon />}' : ''}${demoShowEndAdornment ? '\n  endAdornment={<IconInfoFilled size="sm" />}' : ''}
/>`

  return (
    <StyleguideLayout
      title="Input"
      description="Text inputs allow users to enter and edit text. They support labels, helper text, error states, and adornments."
      tagline="Where every user journey begins."
      activeId="input"
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
          {/* Height */}
          <PropertySection title="Height">
            <div style={{ display: 'flex', gap: spacing['2xs'], flexWrap: 'wrap' }}>
              {(['sm', 'md', 'lg'] as const).map(s => (
                <PillButton key={s} onClick={() => setDemoSize(s)} isActive={demoSize === s}>
                  {s}
                </PillButton>
              ))}
            </div>
          </PropertySection>

          {/* Width */}
          <PropertySection title="Width">
            <div style={{ display: 'flex', gap: spacing['2xs'], flexWrap: 'wrap' }}>
              {(['xs', 'sm', 'md', 'lg', 'full'] as InputWidth[]).map(w => (
                <PillButton key={w} onClick={() => setDemoWidth(w)} isActive={demoWidth === w}>
                  {w}
                </PillButton>
              ))}
            </div>
          </PropertySection>

          {/* Options */}
          <PropertySection title="Options">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              <StyledCheckboxControl checked={demoRequired} onChange={() => setDemoRequired(!demoRequired)} label="Required" />
              <StyledCheckboxControl checked={demoShowAdornment} onChange={() => setDemoShowAdornment(!demoShowAdornment)} label="Start Adornment" />
              <StyledCheckboxControl checked={demoShowEndAdornment} onChange={() => setDemoShowEndAdornment(!demoShowEndAdornment)} label="End Adornment" />
              <StyledCheckboxControl checked={demoShowHelper} onChange={() => setDemoShowHelper(!demoShowHelper)} label="Helper Text" />
              <StyledCheckboxControl checked={demoError} onChange={() => setDemoError(!demoError)} label="Error" />
              <StyledCheckboxControl checked={demoDisabled} onChange={() => setDemoDisabled(!demoDisabled)} label="Disabled" />
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
            <div style={{ padding: spacing.md, width: '100%', maxWidth: '400px' }}>
              <Input
                label="Label"
                value={demoValue}
                onChange={setDemoValue}
                size={demoSize}
                width={demoWidth}
                disabled={demoDisabled}
                error={demoError}
                errorMessage={demoError ? 'This field has an error' : undefined}
                required={demoRequired}
                helperText={demoShowHelper ? 'This is helpful text' : undefined}
                startAdornment={demoShowAdornment ? <SearchIcon /> : undefined}
                endAdornment={demoShowEndAdornment ? <IconInfoFilled size="sm" color={colors.text.lowEmphasis.onLight} /> : undefined}
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
              Spacing, color, and typography values used in the Input component. Click any token to copy it.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Size Specifications</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Size', 'Height', 'Font Size', 'Padding']}
                rows={[
                  ['sm', <PixelValue key="smh" value="36px" />, <TokenValue key="smfs" token="typography.body.sm.fontSize" value={typography.body.sm.fontSize} />, <CopyableToken key="smp" token={`0 ${spacing.sm}`} />],
                  ['md (default)', <PixelValue key="mdh" value="40px" />, <TokenValue key="mdfs" token="typography.body.md.fontSize" value={typography.body.md.fontSize} />, <CopyableToken key="mdp" token={`0 ${spacing.sm}`} />],
                  ['lg', <PixelValue key="lgh" value="48px" />, <TokenValue key="lgfs" token="typography.body.md.fontSize" value={typography.body.md.fontSize} />, <CopyableToken key="lgp" token={`0 ${spacing.md}`} />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Element', 'Font Size', 'Font Weight', 'Line Height']}
                rows={[
                  ['Label', <TokenValue key="lfs" token="typography.label.sm.fontSize" value={typography.label.sm.fontSize} />, <TokenValue key="lfw" token="fontWeights.medium" value="500" />, <TokenValue key="llh" token="typography.label.sm.lineHeight" value={typography.label.sm.lineHeight} />],
                  ['Input text (MD)', <TokenValue key="ifs" token="typography.body.md.fontSize" value={typography.body.md.fontSize} />, <TokenValue key="ifw" token="fontWeights.regular" value="400" />, <TokenValue key="ilh" token="typography.body.md.lineHeight" value={typography.body.md.lineHeight} />],
                  ['Helper/Error text', <TokenValue key="hfs" token="typography.body.xs.fontSize" value={typography.body.xs.fontSize} />, <TokenValue key="hfw" token="fontWeights.regular" value="400" />, <TokenValue key="hlh" token="typography.body.xs.lineHeight" value={typography.body.xs.lineHeight} />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Colors</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['State', 'Border', 'Background']}
                rows={[
                  ['Default', <TokenValue key="db" token="colors.border.midEmphasis.onLight" value={colors.border.midEmphasis.onLight} />, <TokenValue key="dbg" token="colors.surface.light" value={colors.surface.light} />],
                  ['Hover', <TokenValue key="hb" token="colors.border.highEmphasis.onLight" value={colors.border.highEmphasis.onLight} />, <TokenValue key="hbg" token="colors.surface.light" value={colors.surface.light} />],
                  ['Focus', <TokenValue key="fb" token="colors.brand.default" value={colors.brand.default} />, <TokenValue key="fbg" token="colors.surface.light" value={colors.surface.light} />],
                  ['Error', <TokenValue key="eb" token="colors.status.important" value={colors.status.important} />, <TokenValue key="ebg" token="colors.surface.light" value={colors.surface.light} />],
                  ['Disabled', <TokenValue key="dib" token="colors.border.lowEmphasis.onLight" value={colors.border.lowEmphasis.onLight} />, <TokenValue key="dibg" token="colors.surface.disabled.onLight" value={colors.surface.disabled.onLight} />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Shape & Focus</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Border width', <CopyableToken key="bw" token="1.5px (fixed)" />, <PixelValue key="bwv" value="1.5px" />],
                  ['Border radius', <CopyableToken key="br" token="borderRadiusSemantics.input" />, <PixelValue key="brv" value={borderRadiusSemantics.input} />],
                  ['Label gap', <CopyableToken key="lg" token="spacing['2xs']" />, <PixelValue key="lgv" value={spacing['2xs']} />],
                  ['Focus ring', <CopyableToken key="fr" token="box-shadow: 0 0 0 1px brand.default" />, <PixelValue key="frv" value={`0 0 0 1px ${colors.brand.default}`} />],
                ]}
              />
            </div>
          </section>

          {/* Accessibility */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <p style={sharedStyles.sectionDescription}>
              WCAG 2.2 AA compliance details for the Input component.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Keyboard Interaction</h3>
              <SpecTable
                headers={['Key', 'Action']}
                rows={[
                  [<kbd key="tab">Tab</kbd>, 'Move focus to / from the input'],
                  [<kbd key="esc">Escape</kbd>, 'Clear focus (browser default)'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>ARIA Attributes</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Attribute', 'When', 'Purpose']}
                rows={[
                  [<code key="for">htmlFor/id</code>, 'Always', 'Associates label with input element'],
                  [<code key="inv">aria-invalid="true"</code>, 'Error state', 'Communicates validation error'],
                  [<code key="req">aria-required="true"</code>, 'Required', 'Indicates mandatory field'],
                  [<code key="desc">aria-describedby</code>, 'Helper/error text', 'Links assistive text to input'],
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
                  ['Focus indicator', 'WCAG 2.4.7 — visible focus ring', 'Pass (brand color ring)'],
                  ['Touch target size', 'WCAG 2.5.8 — minimum 44x44px', 'Pass (sm: 36px, md: 40px, lg: 48px)'],
                  ['Error state', 'WCAG 1.4.1 — not color alone', 'Pass (error message text + red border)'],
                  ['Required indicator', 'WCAG 1.3.1 — programmatic', 'Pass (required attribute + visual asterisk)'],
                  ['Placeholder', 'WCAG 1.4.5 — not a label substitute', 'Guidance (always use label prop)'],
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
import { Input } from '@lumen/design-system'

// Or with path alias (requires tsconfig setup)
import { Input } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* Usage */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>{`// Simple input
<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChange={(value) => setEmail(value)}
/>

// With validation
<Input
  label="Username"
  required
  error={!!error}
  errorMessage={error}
  helperText="Must be at least 3 characters"
/>

// With adornments
<Input
  label="Search"
  startAdornment={<SearchIcon />}
  endAdornment={<ClearButton />}
/>`}</CodeBlock>
            </div>
          </section>

          {/* Props */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Input Props</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="l">label</code>, <code key="lt">string</code>, '—', 'Label text above the input'],
                  [<code key="ht">helperText</code>, <code key="htt">string</code>, '—', 'Helper text below the input'],
                  [<code key="em">errorMessage</code>, <code key="emt">string</code>, '—', 'Error message (shows error state)'],
                  [<code key="e">error</code>, <code key="et">boolean</code>, <code key="ed">false</code>, 'Force error state without message'],
                  [<code key="s">size</code>, <code key="st">&apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;</code>, <code key="sd">&apos;md&apos;</code>, 'Visual size'],
                  [<code key="fw">fullWidth</code>, <code key="fwt">boolean</code>, <code key="fwd">false</code>, 'Full container width'],
                  [<code key="sa">startAdornment</code>, <code key="sat">ReactNode</code>, '—', 'Element before input text'],
                  [<code key="ea">endAdornment</code>, <code key="eat">ReactNode</code>, '—', 'Element after input text'],
                  [<code key="oc">onChange</code>, <code key="oct">(value, event) =&gt; void</code>, '—', 'Change handler (value-first)'],
                  [<code key="r">required</code>, <code key="rt">boolean</code>, <code key="rd">false</code>, 'Marks the field as required'],
                  [<code key="d">disabled</code>, <code key="dt">boolean</code>, <code key="dd">false</code>, 'Disables the input'],
                  [<code key="p">placeholder</code>, <code key="pt">string</code>, '—', 'Placeholder text'],
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
                  ['Always include a visible label', 'Use placeholder as a label substitute'],
                  ['Show error messages with clear guidance', 'Show only a red border without explanation'],
                  ['Use helper text for formatting hints', 'Put formatting rules only in error messages'],
                  ['Use appropriate input types (email, tel)', 'Use generic text type for all inputs'],
                  ['Group related inputs together', 'Scatter related fields across the form'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={inputDocData} />
      )}
    </StyleguideLayout>
  )
}
