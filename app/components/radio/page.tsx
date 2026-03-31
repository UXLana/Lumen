'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox as StyledCheckboxControl, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { Radio, RadioGroup } from '@/components'
import { colors, spacing, typography, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

const radioDocData: ComponentDocData = {
  displayName: 'Radio',
  importPath: '@/components',
  importStatement: `import { Radio, RadioGroup } from '@/components'\nimport type { RadioProps, RadioGroupProps } from '@/components'`,
  description: 'Radio buttons allow users to select exactly one option from a set of mutually exclusive choices.',
  props: [
    { name: 'label', type: 'string', description: 'Label text displayed next to the radio' },
    { name: 'metadata', type: 'string', description: 'Description text below the label' },
    { name: 'checked', type: 'boolean', description: 'Controlled checked state' },
    { name: 'onChange', type: '(value: string, event) => void', description: 'Change handler' },
    { name: 'value', type: 'string', required: true, description: 'The value for this radio option' },
    { name: 'fullWidth', type: 'boolean', description: 'Full-width mode' },
    { name: 'noRoundedCorners', type: 'boolean', description: 'Remove rounded corners' },
    { name: 'error', type: 'boolean', description: 'Error state' },
    { name: 'disabled', type: 'boolean', description: 'Disabled state' },
  ],
  subComponents: [
    {
      name: 'RadioGroup',
      description: 'Groups related radio buttons with shared label, value management, and error handling.',
      props: [
        { name: 'label', type: 'string', description: 'Group label' },
        { name: 'value', type: 'string', description: 'Currently selected value' },
        { name: 'onChange', type: '(value: string) => void', description: 'Change handler' },
        { name: 'errorMessage', type: 'string', description: 'Error message text' },
        { name: 'error', type: 'boolean', default: 'false', description: 'Show error state' },
        { name: 'fullWidth', type: 'boolean', description: 'Full-width mode' },
        { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout direction' },
        { name: 'name', type: 'string', description: 'Group name (auto-generated if not provided)' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Radio components' },
      ],
    },
  ],
  accessibility: [
    { feature: 'Native Element', description: 'Uses <input type="radio"> for full keyboard and screen reader support.' },
    { feature: 'Group Semantics', description: 'RadioGroup uses role="radiogroup" with aria-labelledby.' },
    { feature: 'Arrow Keys', description: 'Arrow keys navigate between radio options within a group.' },
    { feature: 'Error Messages', description: 'aria-describedby links error messages; errors use role="alert".' },
  ],
  tokens: [
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Selected radio indicator' },
    { token: 'colors.border.midEmphasis.onLight', value: 'Gray', usage: 'Unselected border' },
    { token: 'colors.status.important', value: 'Red', usage: 'Error state border' },
    { token: 'typography.body.sm', value: '14px/20px', usage: 'Label text' },
  ],
  relatedComponents: [
    { name: 'Checkbox', href: '/components/checkbox' },
    { name: 'Segmented Control', href: '/components/segmented-control' },
    { name: 'List Item', href: '/components/list-item' },
  ],
  notes: [
    'Use RadioGroup to manage shared value state and provide accessible group semantics.',
    'Prefer Checkbox when multiple selections are needed.',
    'Prefer Segmented Control for 2-4 options that need instant visual feedback.',
  ],
  whenToUse: [
    'Single selection from 3-7 visible options where all choices should be visible at once.',
    'Form fields where the user must pick exactly one option before submitting.',
  ],
  whenNotToUse: [
    { scenario: 'Multiple selections allowed', instead: 'Checkbox / CheckboxGroup — supports multi-select' },
    { scenario: '2-4 options needing instant visual feedback (no form submit)', instead: 'SegmentedControl — inline toggle, all options visible' },
    { scenario: 'More than 7 options', instead: 'Select — dropdown keeps the form compact' },
  ],
  usageExamples: [
    {
      title: 'License type selection',
      description: 'Standard radio group inside a form. Use RadioGroup for shared state and accessible group semantics.',
      isDefault: true,
      code: `<RadioGroup\n  label="License Type"\n  value={licenseType}\n  onChange={setLicenseType}\n>\n  <Radio value="retail" label="Retail Dispensary" />\n  <Radio value="cultivator" label="Cultivator" />\n  <Radio value="processor" label="Processor" />\n</RadioGroup>`,
    },
  ],
}

export default function RadioPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoValue, setDemoValue] = useState('option1')
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoError, setDemoError] = useState(false)
  const [demoShowMetadata, setDemoShowMetadata] = useState(false)
  const [demoFullWidth, setDemoFullWidth] = useState(false)
  const [demoDirection, setDemoDirection] = useState<'vertical' | 'horizontal'>('vertical')

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Radio"
      description="Radio buttons allow selection of a single option from a set. They should be used in groups where only one choice is allowed."
      activeId="radio"
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
              <CodeBlock>{`import { Radio, RadioGroup } from '@/components'

<RadioGroup label="Label" value={selected} onChange={setSelected}>
  <Radio label="Option 1" value="option1" />
  <Radio label="Option 2" value="option2" />
  <Radio label="Option 3" value="option3" />
</RadioGroup>`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Experiment with radio button properties to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, width: demoFullWidth ? '100%' : 'auto' }}>
                        <RadioGroup
                          label="Select an option"
                          value={demoValue}
                          onChange={setDemoValue}
                          error={demoError}
                          errorMessage="Please select an option"
                          fullWidth={demoFullWidth}
                          direction={demoDirection}
                        >
                          <Radio
                            label="Option 1"
                            metadata={demoShowMetadata ? 'Description for option 1' : undefined}
                            value="option1"
                            disabled={demoDisabled}
                          />
                          <Radio
                            label="Option 2"
                            metadata={demoShowMetadata ? 'Description for option 2' : undefined}
                            value="option2"
                            disabled={demoDisabled}
                          />
                          <Radio
                            label="Option 3"
                            metadata={demoShowMetadata ? 'Description for option 3' : undefined}
                            value="option3"
                            disabled={demoDisabled}
                          />
                        </RadioGroup>
                      </div>
                    }
                    code={`<RadioGroup
  label="Select an option"
  value={selected}
  onChange={setSelected}${demoError ? '\n  error\n  errorMessage="Please select an option"' : ''}${demoFullWidth ? '\n  fullWidth' : ''}${demoDirection === 'horizontal' ? '\n  direction="horizontal"' : ''}
>
  <Radio label="Option 1"${demoShowMetadata ? ' metadata="Description for option 1"' : ''} value="option1"${demoDisabled ? ' disabled' : ''} />
  <Radio label="Option 2"${demoShowMetadata ? ' metadata="Description for option 2"' : ''} value="option2"${demoDisabled ? ' disabled' : ''} />
  <Radio label="Option 3"${demoShowMetadata ? ' metadata="Description for option 3"' : ''} value="option3"${demoDisabled ? ' disabled' : ''} />
</RadioGroup>`}
                    previewPadding={spacing.md}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Direction */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Direction
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['vertical', 'horizontal'] as const).map(d => (
                          <PillButton
                            key={d}
                            onClick={() => setDemoDirection(d)}
                            isActive={demoDirection === d}
                          >
                            {d}
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
                Spacing, color, and dimension values used in the Radio component. Click any token to copy it.
              </p>

              {/* Spacing & Dimensions */}
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Spacing & Dimensions</h3>
                <SpecTable
                  headers={['Property', 'Token / Value', 'Description']}
                  rows={[
                    ['Radio size', <PixelValue key="rs" value="18px" />, 'Width and height of the radio circle'],
                    ['Inner dot size', <PixelValue key="ds" value="8px" />, 'Diameter of the selected indicator dot'],
                    ['Border width', <PixelValue key="bw" value="1.5px" />, 'Radio circle border thickness'],
                    ['Container padding', <TokenValue key="cp" token="spacing.xs spacing.sm" value={`${spacing.xs} ${spacing.sm}`} />, 'Padding around each radio item'],
                    ['Label gap', <TokenValue key="lg" token="spacing.xs" value={spacing.xs} />, 'Space between radio circle and label'],
                    ['Metadata top margin', <PixelValue key="mm" value="2px" />, 'Space between label and metadata text'],
                    ['Group bottom margin', <TokenValue key="gm" token="spacing.md" value={spacing.md} />, 'Bottom margin for radio group'],
                    ['Error icon size', <PixelValue key="ei" value="14px" />, 'Size of the error icon in group'],
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
                    [
                      'Group label',
                      <TokenValue key="gfs" token="typography.body.sm.fontSize" value={typography.body.sm.fontSize} />,
                      <PixelValue key="gw" value="Medium (500)" />,
                      <TokenValue key="glh" token="typography.body.sm.lineHeight" value={typography.body.sm.lineHeight} />,
                    ],
                    [
                      'Error message',
                      <TokenValue key="efs" token="typography.body.xs.fontSize" value={typography.body.xs.fontSize} />,
                      <PixelValue key="ew" value="Regular (400)" />,
                      <TokenValue key="elh" token="typography.body.xs.lineHeight" value={typography.body.xs.lineHeight} />,
                    ],
                  ]}
                />
              </div>

              {/* Colors */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Colors by State</h3>
                <SpecTable
                  headers={['State', 'Border Color', 'Dot Color']}
                  rows={[
                    [
                      'Unselected',
                      <TokenValue key="ub" token="colors.border.midEmphasis.onLight" value={colors.border.midEmphasis.onLight} />,
                      '—',
                    ],
                    [
                      'Unselected (hover)',
                      <TokenValue key="uhb" token="colors.border.highEmphasis.onLight" value={colors.border.highEmphasis.onLight} />,
                      '—',
                    ],
                    [
                      'Selected',
                      <TokenValue key="sb" token="colors.brand.default" value={colors.brand.default} />,
                      <TokenValue key="sd" token="colors.brand.default" value={colors.brand.default} />,
                    ],
                    [
                      'Error',
                      <TokenValue key="eb" token="colors.status.important" value={colors.status.important} />,
                      '—',
                    ],
                    [
                      'Disabled (unselected)',
                      <TokenValue key="dub" token="colors.border.lowEmphasis.onLight" value={colors.border.lowEmphasis.onLight} />,
                      '—',
                    ],
                    [
                      'Disabled (selected)',
                      <TokenValue key="dsb" token="colors.border.lowEmphasis.onLight" value={colors.border.lowEmphasis.onLight} />,
                      <TokenValue key="dsd" token="colors.text.disabled.onLight" value={colors.text.disabled.onLight} />,
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
                    ['Border transition', <PixelValue key="bt" value="0.15s ease" />],
                    ['Dot scale transition', <PixelValue key="dt" value="0.15s ease" />],
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
              <CodeBlock>{`import { Radio, RadioGroup } from '@/components'
import type { RadioProps, RadioGroupProps } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>{`// Radio group with managed selection
<RadioGroup
  label="Choose a plan"
  value={selected}
  onChange={setSelected}
>
  <Radio label="Free" value="free" />
  <Radio label="Pro" value="pro" metadata="$9/month" />
  <Radio label="Enterprise" value="enterprise" metadata="Contact us" />
</RadioGroup>

// Horizontal layout
<RadioGroup
  label="Size"
  value={size}
  onChange={setSize}
  direction="horizontal"
>
  <Radio label="Small" value="sm" />
  <Radio label="Medium" value="md" />
  <Radio label="Large" value="lg" />
</RadioGroup>

// With error state
<RadioGroup
  label="Required selection"
  value={value}
  onChange={setValue}
  error
  errorMessage="Please select an option"
>
  <Radio label="Option A" value="a" />
  <Radio label="Option B" value="b" />
</RadioGroup>`}</CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Radio Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="l">label</code>, <code key="lt">string</code>, '—', 'Label text displayed next to the radio'],
                  [<code key="m">metadata</code>, <code key="mt">string</code>, '—', 'Description text below the label'],
                  [<code key="v">value</code>, <code key="vt">string</code>, '(required)', 'The value for this radio option'],
                  [<code key="c">checked</code>, <code key="ct">boolean</code>, <code key="cd">false</code>, 'Controlled checked state'],
                  [<code key="o">onChange</code>, <code key="ot">{'(value: string, event) => void'}</code>, '—', 'Change handler'],
                  [<code key="d">disabled</code>, <code key="dt">boolean</code>, <code key="dd">false</code>, 'Disables the radio'],
                  [<code key="e">error</code>, <code key="et">boolean</code>, <code key="ed">false</code>, 'Shows error border color'],
                  [<code key="fw">fullWidth</code>, <code key="fwt">boolean</code>, <code key="fwd">false</code>, 'Makes radio take full container width'],
                  [<code key="nr">noRoundedCorners</code>, <code key="nrt">boolean</code>, <code key="nrd">false</code>, 'Removes border radius for custom patterns'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>RadioGroup Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="gl">label</code>, <code key="glt">string</code>, '—', 'Group label text'],
                  [<code key="gv">value</code>, <code key="gvt">string</code>, '—', 'Currently selected value'],
                  [<code key="go">onChange</code>, <code key="got">{'(value: string) => void'}</code>, '—', 'Selection change handler'],
                  [<code key="gd">direction</code>, <code key="gdt">{"'vertical' | 'horizontal'"}</code>, <code key="gdd">{"'vertical'"}</code>, 'Layout direction'],
                  [<code key="ge">error</code>, <code key="get">boolean</code>, <code key="ged">false</code>, 'Shows error state'],
                  [<code key="gem">errorMessage</code>, <code key="gemt">string</code>, '—', 'Error message text (shown when error is true)'],
                  [<code key="gfw">fullWidth</code>, <code key="gfwt">boolean</code>, <code key="gfwd">false</code>, 'Makes the group take full container width'],
                  [<code key="gn">name</code>, <code key="gnt">string</code>, '(auto)', 'HTML name attribute for the radio group'],
                  [<code key="gc">children</code>, <code key="gct">ReactNode</code>, '—', 'Radio components'],
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
                <li>Allow users to select exactly one option from a set</li>
                <li>When all options need to be visible at once</li>
                <li>For 2-7 mutually exclusive options</li>
                <li>When a default selection or previously selected option exists</li>
              </ul>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When Not to Use</h3>
              <SpecTable
                headers={['Scenario', 'Use Instead']}
                rows={[
                  ['Multiple options can be selected', 'Checkbox'],
                  ['Binary on/off toggle', 'Switch'],
                  ['More than 7 options', 'Select dropdown'],
                  ['Triggering an action', 'Button or segmented control'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Always use within a RadioGroup', 'Use standalone without group context'],
                  ['Provide a visible group label', 'Leave radio groups unlabeled'],
                  ['Use metadata for additional context', 'Put long descriptions in labels'],
                  ['Pre-select a default option when possible', 'Leave all options unselected without reason'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Native <code>&lt;input type=&quot;radio&quot;&gt;</code> for full keyboard and screen reader support</li>
                <li>Visually hidden input with custom styled indicator</li>
                <li>Focus-visible ring for keyboard navigation</li>
                <li><code>aria-invalid</code> set on error state</li>
                <li><code>aria-describedby</code> links error messages to radio groups</li>
                <li><code>role=&quot;radiogroup&quot;</code> with <code>aria-labelledby</code> for groups</li>
                <li>Error messages use <code>role=&quot;alert&quot;</code> for live announcements</li>
                <li>Arrow key navigation moves focus and selection within radio group</li>
              </ul>
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={radioDocData} />
      )}
    </StyleguideLayout>
  )
}
