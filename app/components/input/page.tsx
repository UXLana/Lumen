'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox as StyledCheckboxControl, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { Input } from '@/components'
import { colors, spacing, typography, borderRadiusSemantics } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// PAGE COMPONENT
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
    { token: 'typography.body.md', value: '16px/24px', usage: 'Input text' },
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
}

export default function InputPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoValue, setDemoValue] = useState('')
  const [demoSize, setDemoSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoError, setDemoError] = useState(false)
  const [demoRequired, setDemoRequired] = useState(false)
  const [demoFullWidth, setDemoFullWidth] = useState(false)
  const [demoShowHelper, setDemoShowHelper] = useState(false)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )

  return (
    <StyleguideLayout
      title="Input"
      description="Text inputs allow users to enter and edit text. They support labels, helper text, error states, and adornments."
      activeId="input"
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
              <CodeBlock>{`import { Input } from '@/components'

<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChange={(value) => setEmail(value)}
/>

<Input
  label="Search"
  placeholder="Search..."
  startAdornment={<SearchIcon />}
  errorMessage={error ? "Invalid input" : undefined}
/>`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Experiment with input properties to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <div style={{ padding: spacing.md, width: demoFullWidth ? '100%' : 'auto' }}>
                        <Input
                          label="Label"
                          placeholder="Enter text..."
                          value={demoValue}
                          onChange={setDemoValue}
                          size={demoSize}
                          disabled={demoDisabled}
                          error={demoError}
                          errorMessage={demoError ? 'This field has an error' : undefined}
                          required={demoRequired}
                          fullWidth={demoFullWidth}
                          helperText={demoShowHelper ? 'This is helpful text' : undefined}
                        />
                      </div>
                    }
                    code={`<Input
  label="Label"
  placeholder="Enter text..."
  value={value}
  onChange={setValue}${demoSize !== 'md' ? `\n  size="${demoSize}"` : ''}${demoDisabled ? '\n  disabled' : ''}${demoError ? '\n  error\n  errorMessage="This field has an error"' : ''}${demoRequired ? '\n  required' : ''}${demoFullWidth ? '\n  fullWidth' : ''}${demoShowHelper ? '\n  helperText="This is helpful text"' : ''}
/>`}
                    previewPadding={spacing.xs}
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
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['sm', 'md', 'lg'] as const).map(s => (
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

                    {/* Options */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Options
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <StyledCheckboxControl checked={demoDisabled} onChange={() => setDemoDisabled(!demoDisabled)} label="Disabled" />
                        <StyledCheckboxControl checked={demoError} onChange={() => setDemoError(!demoError)} label="Error" />
                        <StyledCheckboxControl checked={demoRequired} onChange={() => setDemoRequired(!demoRequired)} label="Required" />
                        <StyledCheckboxControl checked={demoFullWidth} onChange={() => setDemoFullWidth(!demoFullWidth)} label="Full Width" />
                        <StyledCheckboxControl checked={demoShowHelper} onChange={() => setDemoShowHelper(!demoShowHelper)} label="Helper Text" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== WITH ADORNMENTS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>With Adornments</h2>
            <p style={sharedStyles.sectionDescription}>
              Inputs can include leading and trailing adornments for icons, currency symbols, or units.
            </p>
            <Playground
              preview={
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, padding: spacing.md }}>
                  <Input
                    label="Search"
                    placeholder="Search..."
                    startAdornment={<SearchIcon />}
                  />
                  <Input
                    label="Amount"
                    placeholder="0.00"
                    startAdornment={<span style={{ fontSize: '14px' }}>$</span>}
                    endAdornment={<span style={{ fontSize: '12px', color: colors.text.lowEmphasis.onLight }}>USD</span>}
                  />
                </div>
              }
              code={`<Input
  label="Search"
  placeholder="Search..."
  startAdornment={<SearchIcon />}
/>

<Input
  label="Amount"
  placeholder="0.00"
  startAdornment={<span>$</span>}
  endAdornment={<span>USD</span>}
/>`}
              previewPadding={spacing.xs}
            />
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Spacing, color, and typography values used in the Input component. Click any token to copy it.
              </p>

              {/* Sizes */}
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Size Specifications</h3>
                <SpecTable
                  headers={['Size', 'Height', 'Font Size', 'Padding']}
                  rows={[
                    [
                      'sm',
                      <PixelValue key="smh" value="32px" />,
                      <TokenValue key="smfs" token="typography.body.xs.fontSize" value={typography.body.xs.fontSize} />,
                      <CopyableToken key="smp" token={`0 ${spacing.xs}`} />,
                    ],
                    [
                      'md',
                      <PixelValue key="mdh" value="40px" />,
                      <TokenValue key="mdfs" token="typography.body.sm.fontSize" value={typography.body.sm.fontSize} />,
                      <CopyableToken key="mdp" token={`0 ${spacing.sm}`} />,
                    ],
                    [
                      'lg',
                      <PixelValue key="lgh" value="48px" />,
                      <TokenValue key="lgfs" token="typography.body.md.fontSize" value={typography.body.md.fontSize} />,
                      <CopyableToken key="lgp" token={`0 ${spacing.sm}`} />,
                    ],
                  ]}
                />
              </div>

              {/* Typography */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Typography</h3>
                <SpecTable
                  headers={['Element', 'Font Size', 'Font Weight', 'Line Height']}
                  rows={[
                    [
                      'Label',
                      <TokenValue key="lfs" token="typography.body.sm.fontSize" value={typography.body.sm.fontSize} />,
                      <TokenValue key="lfw" token="fontWeights.medium" value="500" />,
                      <TokenValue key="llh" token="typography.body.sm.lineHeight" value={typography.body.sm.lineHeight} />,
                    ],
                    [
                      'Input text (MD)',
                      <TokenValue key="ifs" token="typography.body.sm.fontSize" value={typography.body.sm.fontSize} />,
                      <TokenValue key="ifw" token="fontWeights.regular" value="400" />,
                      <TokenValue key="ilh" token="typography.body.sm.lineHeight" value={typography.body.sm.lineHeight} />,
                    ],
                    [
                      'Helper/Error text',
                      <TokenValue key="hfs" token="typography.body.xs.fontSize" value={typography.body.xs.fontSize} />,
                      <TokenValue key="hfw" token="fontWeights.regular" value="400" />,
                      <TokenValue key="hlh" token="typography.body.xs.lineHeight" value={typography.body.xs.lineHeight} />,
                    ],
                  ]}
                />
              </div>

              {/* Colors */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Colors</h3>
                <SpecTable
                  headers={['State', 'Border', 'Background']}
                  rows={[
                    [
                      'Default',
                      <TokenValue key="db" token="colors.border.midEmphasis.onLight" value={colors.border.midEmphasis.onLight} />,
                      <TokenValue key="dbg" token="colors.surface.light" value={colors.surface.light} />,
                    ],
                    [
                      'Hover',
                      <TokenValue key="hb" token="colors.border.highEmphasis.onLight" value={colors.border.highEmphasis.onLight} />,
                      <TokenValue key="hbg" token="colors.surface.light" value={colors.surface.light} />,
                    ],
                    [
                      'Focus',
                      <TokenValue key="fb" token="colors.brand.default" value={colors.brand.default} />,
                      <TokenValue key="fbg" token="colors.surface.light" value={colors.surface.light} />,
                    ],
                    [
                      'Error',
                      <TokenValue key="eb" token="colors.status.important" value={colors.status.important} />,
                      <TokenValue key="ebg" token="colors.surface.light" value={colors.surface.light} />,
                    ],
                    [
                      'Disabled',
                      <TokenValue key="dib" token="colors.border.lowEmphasis.onLight" value={colors.border.lowEmphasis.onLight} />,
                      <TokenValue key="dibg" token="colors.surface.disabled.onLight" value={colors.surface.disabled.onLight} />,
                    ],
                  ]}
                />
              </div>

              {/* Other */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Other</h3>
                <SpecTable
                  headers={['Property', 'Token', 'Value']}
                  rows={[
                    ['Border width', <CopyableToken key="bw" token="1.5px (fixed)" />, <PixelValue key="bwv" value="1.5px" />],
                    ['Border radius', <CopyableToken key="br" token="borderRadiusSemantics.input" />, <PixelValue key="brv" value={borderRadiusSemantics.input} />],
                    ['Bottom margin', <CopyableToken key="bm" token="spacing.md" />, <PixelValue key="bmv" value={spacing.md} />],
                    ['Focus ring', <CopyableToken key="fr" token="box-shadow: 0 0 0 1px brand.default" />, <PixelValue key="frv" value={`0 0 0 1px ${colors.brand.default}`} />],
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
              <CodeBlock>{`import { Input } from '@/components'
import type { InputProps } from '@/components'`}</CodeBlock>
            </div>

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

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Input Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="l">label</code>, <code key="lt">string</code>, '—', 'Label text above the input'],
                  [<code key="ht">helperText</code>, <code key="htt">string</code>, '—', 'Helper text below the input'],
                  [<code key="em">errorMessage</code>, <code key="emt">string</code>, '—', 'Error message (shows error state)'],
                  [<code key="e">error</code>, <code key="et">boolean</code>, <code key="ed">false</code>, 'Force error state without message'],
                  [<code key="s">size</code>, <code key="st">{"'sm' | 'md' | 'lg'"}</code>, <code key="sd">{"'md'"}</code>, 'Visual size'],
                  [<code key="fw">fullWidth</code>, <code key="fwt">boolean</code>, <code key="fwd">false</code>, 'Makes input take full container width'],
                  [<code key="sa">startAdornment</code>, <code key="sat">ReactNode</code>, '—', 'Element before the input text'],
                  [<code key="ea">endAdornment</code>, <code key="eat">ReactNode</code>, '—', 'Element after the input text'],
                  [<code key="oc">onChange</code>, <code key="oct">{'(value: string, event) => void'}</code>, '—', 'Change handler'],
                  [<code key="r">required</code>, <code key="rt">boolean</code>, <code key="rd">false</code>, 'Marks the field as required'],
                  [<code key="d">disabled</code>, <code key="dt">boolean</code>, <code key="dd">false</code>, 'Disables the input'],
                  [<code key="p">placeholder</code>, <code key="pt">string</code>, '—', 'Placeholder text'],
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
                <li>Collecting short text input (names, emails, search queries)</li>
                <li>Form fields that need labels, validation, and error messaging</li>
                <li>Fields with prefix/suffix adornments (currency, search icons)</li>
              </ul>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When Not to Use</h3>
              <SpecTable
                headers={['Scenario', 'Use Instead']}
                rows={[
                  ['Multi-line text', 'Textarea component'],
                  ['Selecting from predefined options', 'Select, Radio, or Checkbox'],
                  ['Date/time input', 'DatePicker component'],
                ]}
              />
            </div>

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

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Label associated via <code>htmlFor</code>/<code>id</code> pairing</li>
                <li><code>aria-invalid</code> set on error state</li>
                <li><code>aria-describedby</code> links helper text and error messages</li>
                <li>Error messages use <code>role=&quot;alert&quot;</code> for live announcements</li>
                <li>Required indicator uses visual asterisk plus <code>required</code> attribute</li>
                <li>Focus ring visible for keyboard navigation</li>
                <li>Placeholder text is supplemental — not a replacement for labels</li>
              </ul>
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
