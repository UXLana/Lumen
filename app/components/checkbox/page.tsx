'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox as StyledCheckboxControl, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { Checkbox, CheckboxGroup } from '@/components'
import { colors, spacing, typography, borderRadius, fontFamilies, fontWeights, transitionPresets } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// PAGE COMPONENT
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

export default function CheckboxPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoChecked, setDemoChecked] = useState(false)
  const [demoIndeterminate, setDemoIndeterminate] = useState(false)
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoError, setDemoError] = useState(false)
  const [demoShowMetadata, setDemoShowMetadata] = useState(false)
  const [demoIsChild, setDemoIsChild] = useState(false)
  const [demoFullWidth, setDemoFullWidth] = useState(false)

  // Group demo state
  const [groupValues, setGroupValues] = useState({
    option1: true,
    option2: false,
    option3: false,
  })

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Checkbox"
      description="Checkboxes allow selection of one or more items from a set. They can be used standalone or in groups."
      tagline="Binary decisions, beautifully rendered."
      activeId="checkbox"
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
import { Checkbox, CheckboxGroup } from '@lumen/design-system'

// Or with path alias (requires tsconfig setup)
import { Checkbox, CheckboxGroup } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Manipulate checkbox properties in real-time to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code */}
                <div>
                  <Playground
                    preview={
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
                    }
                    code={`<Checkbox
  label="Option label"${demoShowMetadata ? '\n  metadata="Helpful metadata text"' : ''}
  checked={${demoChecked}}${demoIndeterminate ? '\n  indeterminate' : ''}${demoDisabled ? '\n  disabled' : ''}${demoError ? '\n  error' : ''}${demoIsChild ? '\n  isChild' : ''}${demoFullWidth ? '\n  fullWidth' : ''}
  onChange={(checked) => setChecked(checked)}
/>`}
                    previewPadding={spacing.xl}
                    previewBackground={colors.surface.lightDarker}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* State */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        State
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <PillButton isActive={demoChecked && !demoIndeterminate} onClick={() => { setDemoChecked(true); setDemoIndeterminate(false) }}>Checked</PillButton>
                        <PillButton isActive={!demoChecked && !demoIndeterminate} onClick={() => { setDemoChecked(false); setDemoIndeterminate(false) }}>Unchecked</PillButton>
                        <PillButton isActive={demoIndeterminate} onClick={() => { setDemoIndeterminate(true); setDemoChecked(false) }}>Indeterminate</PillButton>
                      </div>
                    </div>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                      <StyledCheckboxControl checked={demoDisabled} onChange={() => setDemoDisabled(!demoDisabled)} label="Disabled" />
                      <StyledCheckboxControl checked={demoError} onChange={() => setDemoError(!demoError)} label="Error" />
                      <StyledCheckboxControl checked={demoShowMetadata} onChange={() => setDemoShowMetadata(!demoShowMetadata)} label="Metadata" />
                      <StyledCheckboxControl checked={demoIsChild} onChange={() => setDemoIsChild(!demoIsChild)} label="Child" />
                      <StyledCheckboxControl checked={demoFullWidth} onChange={() => setDemoFullWidth(!demoFullWidth)} label="Full Width" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== CHECKBOX GROUP EXAMPLE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Checkbox Group</h2>
            <p style={sharedStyles.sectionDescription}>
              Use CheckboxGroup to group related checkboxes with a shared label and error handling.
            </p>
            <Playground
              preview={
                <CheckboxGroup label="Label" error={demoError} errorMessage="Please select at least one option">
                  <Checkbox label="Option 1" checked={groupValues.option1} onChange={(checked) => setGroupValues(prev => ({ ...prev, option1: checked }))} />
                  <Checkbox label="Option 2" checked={groupValues.option2} onChange={(checked) => setGroupValues(prev => ({ ...prev, option2: checked }))} />
                  <Checkbox label="Option 3" checked={groupValues.option3} onChange={(checked) => setGroupValues(prev => ({ ...prev, option3: checked }))} />
                </CheckboxGroup>
              }
              code={`<CheckboxGroup label="Label" error={hasError} errorMessage="Please select at least one option">
  <Checkbox label="Option 1" checked={values.opt1} onChange={...} />
  <Checkbox label="Option 2" checked={values.opt2} onChange={...} />
  <Checkbox label="Option 3" checked={values.opt3} onChange={...} />
</CheckboxGroup>`}
              previewPadding={spacing.xl}
            />
          </section>

          {/* ========== INDETERMINATE EXAMPLE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Indeterminate (Parent/Child)</h2>
            <p style={sharedStyles.sectionDescription}>
              Use the indeterminate state for parent checkboxes that represent a partially selected group of children.
            </p>
            <Playground
              preview={
                <div>
                  <Checkbox
                    label="Parent Option"
                    checked={groupValues.option1 && groupValues.option2}
                    indeterminate={(groupValues.option1 || groupValues.option2) && !(groupValues.option1 && groupValues.option2)}
                    onChange={(checked) => setGroupValues({ option1: checked, option2: checked, option3: groupValues.option3 })}
                  />
                  <Checkbox
                    label="Child 1"
                    isChild
                    checked={groupValues.option1}
                    onChange={(checked) => setGroupValues(prev => ({ ...prev, option1: checked }))}
                  />
                  <Checkbox
                    label="Child 2"
                    isChild
                    checked={groupValues.option2}
                    onChange={(checked) => setGroupValues(prev => ({ ...prev, option2: checked }))}
                  />
                </div>
              }
              code={`<Checkbox
  label="Parent Option"
  checked={allChecked}
  indeterminate={someChecked && !allChecked}
  onChange={(checked) => setAll(checked)}
/>
<Checkbox label="Child 1" isChild checked={child1} onChange={...} />
<Checkbox label="Child 2" isChild checked={child2} onChange={...} />`}
              previewPadding={spacing.xl}
            />
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Spacing, color, and typography values used in the Checkbox component. Click any token to copy it.
              </p>

              {/* Spacing & Dimensions */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Spacing & Dimensions</h3>
                <SpecTable
                  headers={['Property', 'Token', 'Value']}
                  rows={[
                    ['Checkbox size', <CopyableToken key="cs" token="18px (fixed)" />, <PixelValue key="csv" value="18px" />],
                    ['Border radius', <CopyableToken key="br" token="borderRadius.xs" />, <PixelValue key="brv" value={borderRadius.xs} />],
                    ['Border width', <CopyableToken key="bw" token="1.5px (fixed)" />, <PixelValue key="bwv" value="1.5px" />],
                    ['Container padding', <CopyableToken key="cp" token={`spacing.xs spacing.sm`} />, <PixelValue key="cpv" value={`${spacing.xs} ${spacing.sm}`} />],
                    ['Child indent', <CopyableToken key="ci" token="spacing['2xl']" />, <PixelValue key="civ" value={spacing['2xl']} />],
                    ['Label gap', <CopyableToken key="lg" token="spacing.xs" />, <PixelValue key="lgv" value={spacing.xs} />],
                    ['Metadata margin', <CopyableToken key="mm" token="2px (fixed)" />, <PixelValue key="mmv" value="2px" />],
                    ['Group bottom margin', <CopyableToken key="gm" token="spacing.md" />, <PixelValue key="gmv" value={spacing.md} />],
                    ['Error icon size', <CopyableToken key="ei" token="14px (fixed)" />, <PixelValue key="eiv" value="14px" />],
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
                      <TokenValue key="lfw" token="fontWeights.regular" value="400" />,
                      <TokenValue key="llh" token="typography.body.sm.lineHeight" value={typography.body.sm.lineHeight} />,
                    ],
                    [
                      'Metadata',
                      <TokenValue key="mfs" token="typography.body.xs.fontSize" value={typography.body.xs.fontSize} />,
                      <TokenValue key="mfw" token="fontWeights.regular" value="400" />,
                      <TokenValue key="mlh" token="typography.body.xs.lineHeight" value={typography.body.xs.lineHeight} />,
                    ],
                    [
                      'Group label',
                      <TokenValue key="gfs" token="typography.body.sm.fontSize" value={typography.body.sm.fontSize} />,
                      <TokenValue key="gfw" token="fontWeights.medium" value="500" />,
                      <TokenValue key="glh" token="typography.body.sm.lineHeight" value={typography.body.sm.lineHeight} />,
                    ],
                    [
                      'Error message',
                      <TokenValue key="efs" token="typography.body.xs.fontSize" value={typography.body.xs.fontSize} />,
                      <TokenValue key="efw" token="fontWeights.regular" value="400" />,
                      <TokenValue key="elh" token="typography.body.xs.lineHeight" value={typography.body.xs.lineHeight} />,
                    ],
                  ]}
                />
              </div>

              {/* Colors */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Colors</h3>
                <SpecTable
                  headers={['State', 'Border', 'Background', 'Icon']}
                  rows={[
                    [
                      'Unchecked',
                      <TokenValue key="ub" token="colors.border.midEmphasis.onLight" value={colors.border.midEmphasis.onLight} />,
                      <PixelValue key="ubg" value="transparent" />,
                      '—',
                    ],
                    [
                      'Unchecked (hover)',
                      <TokenValue key="uhb" token="colors.border.highEmphasis.onLight" value={colors.border.highEmphasis.onLight} />,
                      <PixelValue key="uhbg" value="transparent" />,
                      '—',
                    ],
                    [
                      'Checked',
                      <TokenValue key="cb" token="colors.brand.default" value={colors.brand.default} />,
                      <TokenValue key="cbg" token="colors.brand.default" value={colors.brand.default} />,
                      <PixelValue key="ci2" value="#FFFFFF" />,
                    ],
                    [
                      'Indeterminate',
                      <TokenValue key="ib" token="colors.brand.default" value={colors.brand.default} />,
                      <TokenValue key="ibg" token="colors.brand.default" value={colors.brand.default} />,
                      <PixelValue key="ii" value="#FFFFFF" />,
                    ],
                    [
                      'Error',
                      <TokenValue key="eb" token="colors.status.important" value={colors.status.important} />,
                      <PixelValue key="ebg" value="transparent" />,
                      '—',
                    ],
                    [
                      'Disabled (unchecked)',
                      <TokenValue key="dub" token="colors.border.lowEmphasis.onLight" value={colors.border.lowEmphasis.onLight} />,
                      <PixelValue key="dubg" value="transparent" />,
                      '—',
                    ],
                    [
                      'Disabled (checked)',
                      <TokenValue key="dcb" token="colors.border.lowEmphasis.onLight" value={colors.border.lowEmphasis.onLight} />,
                      <TokenValue key="dcbg" token="colors.surface.disabled.onLight" value={colors.surface.disabled.onLight} />,
                      <TokenValue key="dci" token="colors.text.disabled.onLight" value={colors.text.disabled.onLight} />,
                    ],
                  ]}
                />
              </div>

              {/* Focus Ring */}
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

              {/* Animation */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Animation</h3>
                <SpecTable
                  headers={['Property', 'Token', 'Value']}
                  rows={[
                    ['Transition', <CopyableToken key="tr" token="transitionPresets.default" />, <PixelValue key="trv" value={transitionPresets.default} />],
                  ]}
                />
              </div>
            </CollapsibleSection>
          </section>

          {/* ========== ACCESSIBILITY ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Feature', 'Implementation']}
                rows={[
                  ['Native Element', <span key="ne">Uses <code>&lt;input type=&quot;checkbox&quot;&gt;</code> for full keyboard and screen reader support</span>],
                  ['Custom Indicator', 'Visually hidden input with styled SVG indicator — maintains native semantics'],
                  ['Focus Ring', <span key="fr">Focus-visible ring using <code>colors.focusBorder.onLight</code> for keyboard navigation</span>],
                  ['Error State', <span key="es"><code>aria-invalid</code> set on error state for assistive technology</span>],
                  ['Error Messages', <span key="em"><code>aria-describedby</code> links error messages to checkbox groups; errors use <code>role=&quot;alert&quot;</code></span>],
                  ['Group Semantics', <span key="gs"><code>role=&quot;group&quot;</code> with <code>aria-labelledby</code> for checkbox groups</span>],
                  ['Indeterminate', <span key="in">Communicated via native <code>input.indeterminate</code> property</span>],
                  ['Accessible Name', <span key="an">When <code>label</code> is omitted, provide <code>aria-label</code> for an accessible name</span>],
                ]}
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
              <CodeBlock>{`import { Checkbox, CheckboxGroup } from '@/components'
import type { CheckboxProps, CheckboxGroupProps } from '@/components'`}</CodeBlock>
            </div>

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

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Checkbox Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code>label</code>, <code>string</code>, '—', 'Label text displayed next to the checkbox'],
                  [<code>metadata</code>, <code>string</code>, '—', 'Description text below the label'],
                  [<code>checked</code>, <code>boolean</code>, <code>false</code>, 'Controlled checked state'],
                  [<code>indeterminate</code>, <code>boolean</code>, <code>false</code>, 'Indeterminate state (overrides checked visually)'],
                  [<code>onChange</code>, <code>{'(checked: boolean, event) => void'}</code>, '—', 'Change handler'],
                  [<code>disabled</code>, <code>boolean</code>, <code>false</code>, 'Disables the checkbox'],
                  [<code>error</code>, <code>boolean</code>, <code>false</code>, 'Shows error border color'],
                  [<code>isChild</code>, <code>boolean</code>, <code>false</code>, 'Indents the checkbox (for parent/child patterns)'],
                  [<code>fullWidth</code>, <code>boolean</code>, <code>false</code>, 'Makes checkbox take full container width'],
                  [<code>noRoundedCorners</code>, <code>boolean</code>, <code>false</code>, 'Removes border radius for custom patterns'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>CheckboxGroup Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code>label</code>, <code>string</code>, '—', 'Group label text'],
                  [<code>error</code>, <code>boolean</code>, <code>false</code>, 'Shows error state'],
                  [<code>errorMessage</code>, <code>string</code>, '—', 'Error message text (shown when error is true)'],
                  [<code>fullWidth</code>, <code>boolean</code>, <code>false</code>, 'Makes the group take full container width'],
                  [<code>children</code>, <code>ReactNode</code>, '—', 'Checkbox components'],
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
                <li>Allow users to select one or more options from a set</li>
                <li>Toggle a single setting on/off (standalone checkbox)</li>
                <li>Present a list of options where multiple can be selected</li>
                <li>Parent/child selection patterns (with indeterminate state)</li>
              </ul>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When Not to Use</h3>
              <SpecTable
                headers={['Scenario', 'Use Instead']}
                rows={[
                  ['Only one option can be selected', 'Radio'],
                  ['Instant on/off toggles', 'Switch'],
                  ['Filtering with many options', 'Multi-select dropdown'],
                ]}
              />
            </div>

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
