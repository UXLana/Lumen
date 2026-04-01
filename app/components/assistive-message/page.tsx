'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { AssistiveMessage, AssistiveMessageType } from '@/components'
import { colors, typography, assistiveMessage as tokens } from '@/styles/design-tokens'

const COMPONENT_PATH = 'components/AssistiveMessage/AssistiveMessage.tsx'

type PageTab = 'overview' | 'implementation' | 'documentation'

const ALL_TYPES: AssistiveMessageType[] = [
  'assistive',
  'disabled',
  'error',
  'error-overflow',
  'warning',
  'success',
  'info',
]

const TYPE_LABELS: Record<AssistiveMessageType, string> = {
  assistive: 'Assistive',
  disabled: 'Disabled',
  error: 'Error',
  'error-overflow': 'Error Overflow',
  warning: 'Warning',
  success: 'Success',
  info: 'Info',
}

const DEMO_TEXT: Record<AssistiveMessageType, string> = {
  assistive: 'Enter your full legal name',
  disabled: 'This field is locked',
  error: 'This field is required',
  'error-overflow': 'Too many characters',
  warning: 'This name already exists',
  success: 'Username is available',
  info: 'We will use this for verification',
}

const assistiveMessageDocData: ComponentDocData = {
  displayName: 'AssistiveMessage',
  importPath: '@/components',
  importStatement: `import { AssistiveMessage } from '@/components'\nimport type { AssistiveMessageProps, AssistiveMessageType } from '@/components'`,
  description: 'Assistive messages provide contextual feedback below form fields including helper text, errors, warnings, and success states.',
  props: [
    { name: 'type', type: "'assistive' | 'disabled' | 'error' | 'error-overflow' | 'warning' | 'success' | 'info'", default: "'assistive'", description: 'Visual type/state of the message' },
    { name: 'children', type: 'ReactNode', required: true, description: 'The assistive/helper text content' },
    { name: 'counter', type: 'string', description: 'Character counter (e.g. "12/30")' },
    { name: 'icon', type: 'ReactNode | null', description: 'Override the default icon (pass null to hide)' },
  ],
  typeDefinitions: [
    { name: 'AssistiveMessageType', definition: "type AssistiveMessageType = 'assistive' | 'disabled' | 'error' | 'error-overflow' | 'warning' | 'success' | 'info'" },
  ],
  accessibility: [
    { feature: 'Live Region', description: 'Error and warning messages use aria-live="polite" for screen reader announcements.' },
    { feature: 'Association', description: 'Use aria-describedby on the input to link to this message.' },
    { feature: 'Icon + Color', description: 'Status conveyed through icon, color, and text - not color alone.' },
  ],
  tokens: [
    { token: 'colors.status.important', value: 'Red', usage: 'Error message color' },
    { token: 'colors.status.success', value: 'Green', usage: 'Success message color' },
    { token: 'colors.status.caution', value: 'Yellow', usage: 'Warning message color' },
    { token: 'typography.body.xs', value: '12px/16px', usage: 'Message text' },
  ],
  relatedComponents: [
    { name: 'Input', href: '/components/input' },
    { name: 'Banner', href: '/components/banner' },
    { name: 'Badge', href: '/components/badge' },
  ],
  notes: [
    'Always pair with a form field using aria-describedby for accessibility.',
    'Use counter for character-limited fields to show remaining characters.',
    'Use error-overflow type when error text is too long for inline display.',
  ],
  whenToUse: [
    'Inline help text, hints, or validation messages directly below a form field.',
    'Character count display for text inputs with length limits.',
  ],
  whenNotToUse: [
    { scenario: 'Page-level messages or alerts', instead: 'Banner — persistent, full-width message with actions' },
    { scenario: 'Temporary feedback after an action', instead: 'Toast — auto-dismissing notification' },
  ],
  usageExamples: [
    {
      title: 'Field hint with error state',
      description: 'Pair with Input via aria-describedby. Shows helper text normally, error text on validation failure.',
      isDefault: true,
      code: `<Input label="Email" aria-describedby="email-help" />\n<AssistiveMessage\n  id="email-help"\n  variant={hasError ? 'error' : 'helper'}\n>\n  {hasError ? 'Please enter a valid email' : 'We will never share your email'}\n</AssistiveMessage>`,
    },
  ],
}

export default function AssistiveMessagePage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')
  const [demoType, setDemoType] = useState<AssistiveMessageType>('assistive')
  const [demoShowCounter, setDemoShowCounter] = useState(false)

  const counterValue = demoType === 'error-overflow' ? '35/30' : '12/30'

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Assistive Message"
      description="Small helper / validation messages shown beneath form fields. Supports 7 visual types from the Prism Design System v2.0 with optional character counters and contextual icons."
      activeId="assistive-message"
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
              <CodeBlock>{`// Package import
import { AssistiveMessage } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { AssistiveMessage } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Experiment with assistive message properties to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview */}
                <div>
                  <Playground
                    preview={
                      <div style={{ width: '100%', maxWidth: '320px' }}>
                        <div style={{
                          height: '40px',
                          border: `1px solid ${demoType === 'error' || demoType === 'error-overflow' ? colors.status.important : colors.border.midEmphasis.onLight}`,
                          borderRadius: '8px',
                          marginBottom: '6px',
                          background: demoType === 'disabled' ? colors.surface.lightDarker : colors.surface.light,
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 12px',
                          fontSize: '14px',
                          color: demoType === 'disabled' ? colors.text.disabled.onLight : colors.text.highEmphasis.onLight,
                        }}>
                          {demoType === 'error-overflow' ? 'Lorem ipsum dolor sit amet conse...' : 'John Doe'}
                        </div>
                        <AssistiveMessage
                          type={demoType}
                          counter={demoShowCounter ? counterValue : undefined}
                        >
                          {DEMO_TEXT[demoType]}
                        </AssistiveMessage>
                      </div>
                    }
                    code={`<AssistiveMessage
  type="${demoType}"${demoShowCounter ? `
  counter="${counterValue}"` : ''}
>
  ${DEMO_TEXT[demoType]}
</AssistiveMessage>`}
                    previewPadding="40px 24px"
                    previewBackground={colors.surface.lightDarker}
                    componentPath={COMPONENT_PATH}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Type */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Type
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {ALL_TYPES.map(t => (
                          <PillButton
                            key={t}
                            onClick={() => setDemoType(t)}
                            isActive={demoType === t}
                          >
                            {TYPE_LABELS[t]}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Counter Toggle */}
                    <StyledCheckbox
                      checked={demoShowCounter}
                      onChange={setDemoShowCounter}
                      label="Show Counter"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Design Tokens */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens">
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Typography</h3>
                <SpecTable
                  headers={['Property', 'Token', 'Value']}
                  rows={[
                    ['Font Family', <CopyableToken key="ff" token="assistiveMessage.typography.fontFamily" />, <PixelValue key="ffv" value="DM Sans" />],
                    ['Font Size', <CopyableToken key="fs" token="assistiveMessage.typography.fontSize" />, <PixelValue key="fsv" value="14px" />],
                    ['Font Weight', <CopyableToken key="fw" token="assistiveMessage.typography.fontWeight" />, <PixelValue key="fwv" value="400" />],
                    ['Line Height', <CopyableToken key="lh" token="assistiveMessage.typography.lineHeight" />, <PixelValue key="lhv" value="18px" />],
                    ['Letter Spacing', <CopyableToken key="ls" token="assistiveMessage.typography.letterSpacing" />, <PixelValue key="lsv" value="-0.3px" />],
                  ]}
                />
              </div>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Type Colors</h3>
                <SpecTable
                  headers={['Type', 'Text Color', 'Icon Color', 'Counter Color', 'Gap']}
                  rows={[
                    ['Assistive', <PixelValue key="a-tc" value="rgba(0,0,0,0.60)" />, '—', <PixelValue key="a-cc" value="rgba(0,0,0,0.60)" />, <PixelValue key="a-g" value="4px" />],
                    ['Disabled', <PixelValue key="d-tc" value="rgba(0,0,0,0.30)" />, '—', <PixelValue key="d-cc" value="rgba(0,0,0,0.30)" />, <PixelValue key="d-g" value="4px" />],
                    ['Error', <PixelValue key="e-tc" value="#C10B1E" />, <PixelValue key="e-ic" value="#DC0C22" />, <PixelValue key="e-cc" value="rgba(0,0,0,0.60)" />, <PixelValue key="e-g" value="2px" />],
                    ['Error Overflow', <PixelValue key="eo-tc" value="#C10B1E" />, <PixelValue key="eo-ic" value="#DC0C22" />, <PixelValue key="eo-cc" value="#C10B1E" />, <PixelValue key="eo-g" value="4px" />],
                    ['Warning', <PixelValue key="w-tc" value="#A35C00" />, <PixelValue key="w-ic" value="#D17600" />, <PixelValue key="w-cc" value="rgba(0,0,0,0.60)" />, <PixelValue key="w-g" value="4px" />],
                    ['Success', <PixelValue key="s-tc" value="#006B50" />, <PixelValue key="s-ic" value="#1B7F66" />, <PixelValue key="s-cc" value="rgba(0,0,0,0.60)" />, <PixelValue key="s-g" value="4px" />],
                    ['Info', <PixelValue key="i-tc" value="rgba(0,0,0,0.95)" />, <PixelValue key="i-ic" value="#6E61FF" />, <PixelValue key="i-cc" value="rgba(0,0,0,0.60)" />, <PixelValue key="i-g" value="4px" />],
                  ]}
                />
              </div>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Icon Specifications</h3>
                <SpecTable
                  headers={['Property', 'Value']}
                  rows={[
                    ['Icon Size', <PixelValue key="is" value="16×16" />],
                    ['Icon Alignment', 'Top-aligned with first line of text'],
                    ['Wrapper Height', <PixelValue key="wh" value="18px (matches line-height)" />],
                  ]}
                />
              </div>
            </CollapsibleSection>
          </section>

          {/* Accessibility */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Feature', 'Implementation']}
                rows={[
                  ['ARIA Role', <span key="ar"><code>role="alert"</code> for error, error-overflow, and warning types</span>],
                  ['ARIA Live', <span key="al"><code>aria-live="assertive"</code> for alert-type messages</span>],
                  ['Icon Hiding', <span key="ih">All icons use <code>aria-hidden="true"</code> — message text is the accessible label</span>],
                  ['Color + Icon', 'Error, warning, success, and info types use both color AND an icon to avoid relying on color alone (WCAG 1.4.1)'],
                  ['Contrast', 'All text colors meet WCAG AA (4.5:1) against white backgrounds'],
                ]}
              />
            </div>
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
              <CodeBlock>
{`import { AssistiveMessage } from '@/components'
import type { AssistiveMessageProps, AssistiveMessageType } from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Examples</h3>
              <CodeBlock>
{`// Default assistive hint
<AssistiveMessage>Enter your full legal name</AssistiveMessage>

// Error with icon
<AssistiveMessage type="error">This field is required</AssistiveMessage>

// Character counter overflow
<AssistiveMessage type="error-overflow" counter="35/30">
  Too many characters
</AssistiveMessage>

// Success with counter
<AssistiveMessage type="success" counter="12/30">
  Username is available
</AssistiveMessage>

// Disabled state
<AssistiveMessage type="disabled">This field is locked</AssistiveMessage>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With Form Fields</h3>
              <CodeBlock>
{`// Pair with Input component
<div>
  <Input label="Username" error={hasError} />
  <AssistiveMessage
    type={hasError ? 'error' : 'assistive'}
    counter={\`\${value.length}/30\`}
  >
    {hasError ? 'Username is already taken' : 'Choose a unique username'}
  </AssistiveMessage>
</div>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Custom Icons</h3>
              <CodeBlock>
{`// Override default icon
<AssistiveMessage
  type="info"
  icon={<CustomIcon />}
>
  Custom icon message
</AssistiveMessage>

// Hide icon (even for types that show one by default)
<AssistiveMessage type="error" icon={null}>
  Error without icon
</AssistiveMessage>`}
              </CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>
            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [
                    <code key="t">type</code>,
                    <code key="tt">{`'assistive' | 'disabled' | 'error' | 'error-overflow' | 'warning' | 'success' | 'info'`}</code>,
                    <code key="td">'assistive'</code>,
                    'Visual type / validation state',
                  ],
                  [
                    <code key="ch">children</code>,
                    <code key="cht">ReactNode</code>,
                    'required',
                    'The assistive / helper text content',
                  ],
                  [
                    <code key="co">counter</code>,
                    <code key="cot">string</code>,
                    '—',
                    'Character counter text (e.g. "12/30")',
                  ],
                  [
                    <code key="ic">icon</code>,
                    <code key="ict">ReactNode | null</code>,
                    '—',
                    'Override the default icon; pass null to hide',
                  ],
                ]}
              />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Figma Reference</h2>
            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Property', 'Value']}
                rows={[
                  ['Component', 'Assistive message'],
                  ['File', 'Prism Design System v2.0 (wip)'],
                  ['Node ID', '2068-39659'],
                  ['Figma Properties', <span key="fp"><code>type</code> (variant), <code>Assistive text</code> (text), <code>Counter</code> (boolean)</span>],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={assistiveMessageDocData} />
      )}
    </StyleguideLayout>
  )
}
