'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { Stepper, StepperStep, LinearStepper, NonLinearStepper, DefaultStepIndicator, StepItem, StepStatus, StepIndicatorProps } from '@/components'
import { colors, typography, spacing, stepper as stepperTokens, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// CUSTOM INDICATOR EXAMPLES
// =============================================================================

// Example custom indicator with icon
function IconStepIndicator({ status, size = 12 }: StepIndicatorProps) {
  const isCompleted = status === 'completed'
  const isActive = status === 'active'

  // Different icons for different states
  if (isCompleted) {
    return (
      <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M2 6L5 9L10 3"
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (isActive) {
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      }}
      aria-hidden="true"
    />
  )
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

const stepperDocData: ComponentDocData = {
  displayName: 'Stepper',
  importPath: '@/components',
  importStatement: `import { Stepper, LinearStepper, NonLinearStepper, HorizontalStepper } from '@/components'\nimport type { StepperProps, StepItem, StepStatus, StepperVariant, StepperOrientation } from '@/components'`,
  description: 'Steppers guide users through multi-step processes with progress indication. Supports vertical (inline, content under each step) and horizontal (top bar, content below) orientations.',
  props: [
    { name: 'steps', type: 'StepItem[]', required: true, description: 'Array of step items' },
    { name: 'activeStep', type: 'number', required: true, description: 'Currently active step index (0-based)' },
    { name: 'onStepChange', type: '(stepIndex: number) => void', description: 'Step change callback' },
    { name: 'stepContent', type: 'ReactNode[]', description: 'Content for each step' },
    { name: 'primaryButtonText', type: 'string', description: 'Primary button text for active step' },
    { name: 'secondaryButtonText', type: 'string', description: 'Secondary button text' },
    { name: 'onPrimaryClick', type: '() => void', description: 'Primary button callback' },
    { name: 'onSecondaryClick', type: '() => void', description: 'Secondary button callback' },
    { name: 'clickable', type: 'boolean', description: 'Whether steps are clickable' },
    { name: 'variant', type: "'linear' | 'nonLinear'", description: 'Stepper variant (default: linear)' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", description: "Layout direction. 'vertical' (default) expands content inline under each step; 'horizontal' renders a top bar with the active step's content and buttons below." },
    { name: 'className', type: 'string', description: 'Additional CSS class' },
    { name: 'style', type: 'CSSProperties', description: 'Additional inline styles' },
  ],
  typeDefinitions: [
    { name: 'StepItem', definition: "interface StepItem {\n  id: string\n  label: string\n  metadata?: string\n  disabled?: boolean\n  icon?: ReactNode\n}" },
    { name: 'StepStatus', definition: "type StepStatus = 'completed' | 'active' | 'pending' | 'disabled'" },
    { name: 'StepperVariant', definition: "type StepperVariant = 'linear' | 'nonLinear'" },
    { name: 'StepperOrientation', definition: "type StepperOrientation = 'vertical' | 'horizontal'" },
  ],
  accessibility: [
    { feature: 'ARIA', description: 'Steps use aria-current="step" for the active step.' },
    { feature: 'Keyboard', description: 'Tab navigates between clickable steps, Enter/Space activates.' },
    { feature: 'Progress', description: 'Step status (completed/active/pending) communicated via visual indicators and ARIA.' },
  ],
  tokens: [
    { token: 'colors.status.success', value: 'Green', usage: 'Completed step indicator' },
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Active step indicator' },
    { token: 'colors.text.lowEmphasis', value: 'Gray', usage: 'Pending step text' },
  ],
  relatedComponents: [
    { name: 'Accordion', href: '/components/accordion' },
    { name: 'Tab', href: '/components/tab' },
  ],
  notes: [
    'Use LinearStepper for sequential flows where order matters.',
    'Use NonLinearStepper when users can jump between steps freely.',
    'Use HorizontalStepper (or orientation="horizontal") for wide layouts where a top progress bar reads better than a vertical list.',
    'Keep step labels concise - ideally 1-3 words.',
    'Provide step content via the stepContent prop array.',
  ],
  // ── Usage Intelligence ──
  whenToUse: [
    'Short multi-step forms (2-5 steps) that fit inline on a page without needing a full-screen takeover.',
    'Settings or configuration wizards embedded within a page section.',
    'Progress indication for a sequential process where each step expands in place.',
    'Wide page sections where a horizontal top-bar stepper (orientation="horizontal") reads better than a stacked vertical list.',
  ],
  whenNotToUse: [
    { scenario: 'Complex workflow with substantial content per step that needs full-screen focus', instead: 'TaskModal — full-screen modal with step navigation, columns, and mobile ProgressBar' },
    { scenario: 'Collapsible content sections without sequential progression', instead: 'Accordion — expand/collapse without step ordering' },
    { scenario: 'Switching between independent content views', instead: 'Tab — parallel content panels, no step progression' },
  ],
  usageExamples: [
    {
      title: 'Linear sequential stepper',
      description: 'Standard inline stepper for short step-by-step forms. Steps expand in place with content below each step indicator.',
      isDefault: true,
      code: `<Stepper\n  steps={[\n    { id: 'info', label: 'Basic Info' },\n    { id: 'details', label: 'Details' },\n    { id: 'review', label: 'Review' },\n  ]}\n  activeStep={step}\n  onStepChange={setStep}\n  variant="linear"\n  stepContent={[<InfoForm />, <DetailsForm />, <ReviewPanel />]}\n/>`,
    },
    {
      title: 'Non-linear with clickable steps',
      description: 'Use when users need to jump between steps freely (e.g., editing previously completed sections).',
      code: `<Stepper\n  steps={steps}\n  activeStep={step}\n  onStepChange={setStep}\n  variant="nonLinear"\n  clickable\n  stepContent={stepContents}\n/>`,
    },
    {
      title: 'Horizontal top-bar stepper',
      description: 'Lays steps out in a horizontal progress bar with the active step\'s content rendered below. Best for wide page sections, dashboards, or embedded wizards where vertical space is limited.',
      code: `<HorizontalStepper\n  steps={[\n    { id: 'details', label: 'Details' },\n    { id: 'review', label: 'Review' },\n    { id: 'submit', label: 'Submit' },\n  ]}\n  activeStep={step}\n  onStepChange={setStep}\n  stepContent={[<Details />, <Review />, <Submit />]}\n  onPrimaryClick={handleNext}\n  onSecondaryClick={handlePrev}\n  clickable\n/>`,
    },
  ],
}

export default function StepperPage() {
  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive state for playground
  const [demoActiveStep, setDemoActiveStep] = useState(0)
  const [demoClickable, setDemoClickable] = useState(false)
  const [demoVariant, setDemoVariant] = useState<'linear' | 'nonLinear'>('linear')
  const [demoOrientation, setDemoOrientation] = useState<'vertical' | 'horizontal'>('vertical')

  // Demo steps
  const demoSteps: StepItem[] = [
    { id: '1', label: 'Account Setup' },
    { id: '2', label: 'Personal Information' },
    { id: '3', label: 'Review & Submit' },
  ]

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const handleNext = () => {
    if (demoActiveStep < demoSteps.length - 1) {
      setDemoActiveStep(demoActiveStep + 1)
    }
  }

  const handlePrevious = () => {
    if (demoActiveStep > 0) {
      setDemoActiveStep(demoActiveStep - 1)
    }
  }

  return (
    <StyleguideLayout
      title="Stepper"
      description="Steppers display progress through a sequence of logical and numbered steps. They guide users through multi-step processes."
      tagline="Complex journeys, one step at a time."
      activeId="stepper"
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
import { Stepper, LinearStepper, NonLinearStepper } from '@lumen/design-system'

// Or with path alias (requires tsconfig setup)
import { Stepper, LinearStepper, NonLinearStepper } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Interact with the stepper to see how it behaves in different states and variants.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <div style={{ width: '100%', maxWidth: demoOrientation === 'horizontal' ? '560px' : '350px' }}>
                        <Stepper
                          variant={demoVariant}
                          orientation={demoOrientation}
                          steps={demoSteps}
                          activeStep={demoActiveStep}
                          onStepChange={demoClickable ? setDemoActiveStep : undefined}
                          primaryButtonText={demoActiveStep === demoSteps.length - 1 ? 'Complete' : 'Next'}
                          secondaryButtonText="Previous"
                          onPrimaryClick={handleNext}
                          onSecondaryClick={handlePrevious}
                          clickable={demoClickable}
                          stepContent={[
                            <div key="1" style={{ padding: spacing.md, background: colors.surface.light, borderRadius: borderRadius.sm }}>
                              <p style={{ margin: 0, ...typography.body.sm, color: colors.text.lowEmphasis.onDark }}>
                                Step 1 content goes here
                              </p>
                            </div>,
                            <div key="2" style={{ padding: spacing.md, background: colors.surface.light, borderRadius: borderRadius.sm }}>
                              <p style={{ margin: 0, ...typography.body.sm, color: colors.text.lowEmphasis.onDark }}>
                                Step 2 content goes here
                              </p>
                            </div>,
                            <div key="3" style={{ padding: spacing.md, background: colors.surface.light, borderRadius: borderRadius.sm }}>
                              <p style={{ margin: 0, ...typography.body.sm, color: colors.text.lowEmphasis.onDark }}>
                                Step 3 content goes here
                              </p>
                            </div>,
                          ]}
                        />
                      </div>
                    }
                    code={`<Stepper
  variant="${demoVariant}"
  orientation="${demoOrientation}"
  steps={[
    { id: '1', label: 'Account Setup' },
    { id: '2', label: 'Personal Information' },
    { id: '3', label: 'Review & Submit' },
  ]}
  activeStep={${demoActiveStep}}${demoClickable ? '\n  clickable' : ''}
  onStepChange={setActiveStep}
  primaryButtonText="${demoActiveStep === demoSteps.length - 1 ? 'Complete' : 'Next'}"
  secondaryButtonText="Previous"
  onPrimaryClick={handleNext}
  onSecondaryClick={handlePrevious}
  stepContent={[<Step1 />, <Step2 />, <Step3 />]}
/>`}
                    previewPadding="32px 24px"
                    previewMinHeight="400px"
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Variant */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Variant
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <PillButton
                          onClick={() => setDemoVariant('linear')}
                          isActive={demoVariant === 'linear'}
                        >
                          Linear
                        </PillButton>
                        <PillButton
                          onClick={() => setDemoVariant('nonLinear')}
                          isActive={demoVariant === 'nonLinear'}
                        >
                          Non-Linear
                        </PillButton>
                      </div>
                    </div>

                    {/* Orientation */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Orientation
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <PillButton
                          onClick={() => setDemoOrientation('vertical')}
                          isActive={demoOrientation === 'vertical'}
                        >
                          Vertical
                        </PillButton>
                        <PillButton
                          onClick={() => setDemoOrientation('horizontal')}
                          isActive={demoOrientation === 'horizontal'}
                        >
                          Horizontal
                        </PillButton>
                      </div>
                    </div>

                    {/* Active Step */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Active Step
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {demoSteps.map((_, index) => (
                          <PillButton
                            key={index}
                            onClick={() => setDemoActiveStep(index)}
                            isActive={demoActiveStep === index}
                          >
                            Step {index + 1}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Options
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <StyledCheckbox
                          checked={demoClickable}
                          onChange={setDemoClickable}
                          label="Clickable Steps"
                        />
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
                Colors and spacing values used in the stepper component. Click any token to copy it. Pixel values shown in parentheses are for reference only.
              </p>

              {/* Step Indicator Dimensions */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Step Indicator Dimensions</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Size', <CopyableToken key="ss" token="stepper.step.size" />, <PixelValue key="ssv" value={stepperTokens.step.size} />],
                  ['Border Radius', <CopyableToken key="sbr" token="stepper.step.borderRadius" />, <PixelValue key="sbrv" value={stepperTokens.step.borderRadius} />],
                ]}
              />
            </div>

            {/* Step Indicator Colors */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Step Indicator Colors</h3>
              <SpecTable
                headers={['State', 'Background', 'Text', 'Border']}
                rows={[
                  [
                    <code key="completed">completed</code>,
                    <TokenValue key="cb" token="stepper.step.colors.completed.background" value={stepperTokens.step.colors.completed.background} />,
                    <TokenValue key="ct" token="stepper.step.colors.completed.text" value={stepperTokens.step.colors.completed.text} />,
                    <PixelValue key="cbr" value={stepperTokens.step.colors.completed.border} />,
                  ],
                  [
                    <code key="active">active</code>,
                    <TokenValue key="ab" token="stepper.step.colors.active.background" value={stepperTokens.step.colors.active.background} />,
                    <TokenValue key="at" token="stepper.step.colors.active.text" value={stepperTokens.step.colors.active.text} />,
                    <PixelValue key="abr" value={stepperTokens.step.colors.active.border} />,
                  ],
                  [
                    <code key="pending">pending</code>,
                    <TokenValue key="pb" token="stepper.step.colors.pending.background" value={stepperTokens.step.colors.pending.background} />,
                    <TokenValue key="pt" token="stepper.step.colors.pending.text" value={stepperTokens.step.colors.pending.text} />,
                    <TokenValue key="pbr" token="stepper.step.colors.pending.border" value={stepperTokens.step.colors.pending.border} />,
                  ],
                  [
                    <code key="disabled">disabled</code>,
                    <TokenValue key="db" token="stepper.step.colors.disabled.background" value={stepperTokens.step.colors.disabled.background} />,
                    <TokenValue key="dt" token="stepper.step.colors.disabled.text" value={stepperTokens.step.colors.disabled.text} />,
                    <TokenValue key="dbr" token="stepper.step.colors.disabled.border" value={stepperTokens.step.colors.disabled.border} />,
                  ],
                ]}
              />
            </div>

            {/* Step Typography */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Step Number Typography</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Font Weight', <CopyableToken key="fw" token="stepper.step.typography.fontWeight" />, <PixelValue key="fwv" value={stepperTokens.step.typography.fontWeight.toString()} />],
                  ['Font Size', <CopyableToken key="fs" token="stepper.step.typography.fontSize" />, <PixelValue key="fsv" value={stepperTokens.step.typography.fontSize} />],
                  ['Line Height', <CopyableToken key="lh" token="stepper.step.typography.lineHeight" />, <PixelValue key="lhv" value={stepperTokens.step.typography.lineHeight} />],
                  ['Letter Spacing', <CopyableToken key="ls" token="stepper.step.typography.letterSpacing" />, <PixelValue key="lsv" value={stepperTokens.step.typography.letterSpacing} />],
                ]}
              />
            </div>

            {/* Connector */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Connector Line</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Width', <CopyableToken key="cw" token="stepper.connector.width" />, <PixelValue key="cwv" value={stepperTokens.connector.width} />],
                  ['Completed Color', <CopyableToken key="cc" token="stepper.connector.colors.completed" />, <PixelValue key="ccv" value={stepperTokens.connector.colors.completed} />],
                  ['Pending Color', <CopyableToken key="cp" token="stepper.connector.colors.pending" />, <PixelValue key="cpv" value={stepperTokens.connector.colors.pending} />],
                ]}
              />
            </div>

            {/* Content/Label Typography */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Label Typography</h3>
              <SpecTable
                headers={['State', 'Font Size', 'Font Weight', 'Line Height', 'Color']}
                rows={[
                  [
                    'Active',
                    <TokenValue key="afs" token="stepper.content.label.active.fontSize" value={stepperTokens.content.label.active.fontSize} />,
                    <TokenValue key="afw" token="stepper.content.label.active.fontWeight" value={stepperTokens.content.label.active.fontWeight.toString()} />,
                    <TokenValue key="alh" token="stepper.content.label.active.lineHeight" value={stepperTokens.content.label.active.lineHeight} />,
                    <TokenValue key="ac" token="stepper.content.label.active.color" value={stepperTokens.content.label.active.color} />,
                  ],
                  [
                    'Inactive',
                    <TokenValue key="ifs" token="stepper.content.label.inactive.fontSize" value={stepperTokens.content.label.inactive.fontSize} />,
                    <TokenValue key="ifw" token="stepper.content.label.inactive.fontWeight" value={stepperTokens.content.label.inactive.fontWeight.toString()} />,
                    <TokenValue key="ilh" token="stepper.content.label.inactive.lineHeight" value={stepperTokens.content.label.inactive.lineHeight} />,
                    <TokenValue key="ic" token="stepper.content.label.inactive.color" value={stepperTokens.content.label.inactive.color} />,
                  ],
                ]}
              />
            </div>

            {/* Spacing */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Spacing</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Content Padding Left', <CopyableToken key="cpl" token="stepper.content.paddingLeft" />, <PixelValue key="cplv" value={stepperTokens.content.paddingLeft} />],
                  ['Label Padding Y', <CopyableToken key="lpy" token="stepper.spacing.labelPaddingY" />, <PixelValue key="lpyv" value={stepperTokens.spacing.labelPaddingY} />],
                  ['Content Gap', <CopyableToken key="cg" token="stepper.spacing.contentGap" />, <PixelValue key="cgv" value={stepperTokens.spacing.contentGap} />],
                  ['Button Gap', <CopyableToken key="bg" token="stepper.spacing.buttonGap" />, <PixelValue key="bgv" value={stepperTokens.spacing.buttonGap} />],
                ]}
              />
            </div>

            {/* Focus Ring */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Focus Ring</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Color', <CopyableToken key="fc" token="stepper.focus.color" />, <PixelValue key="fcv" value={stepperTokens.focus.color} />],
                  ['Width', <CopyableToken key="fw" token="stepper.focus.width" />, <PixelValue key="fwv" value={stepperTokens.focus.width} />],
                  ['Offset', <CopyableToken key="fo" token="stepper.focus.offset" />, <PixelValue key="fov" value={stepperTokens.focus.offset} />],
                ]}
              />
            </div>

            {/* Animation */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Animation</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Transition', <CopyableToken key="tr" token="stepper.transition" />, <PixelValue key="trv" value={stepperTokens.transition} />],
                  ['Hover Background', <CopyableToken key="hb" token="stepper.hover.background" />, <PixelValue key="hbv" value={stepperTokens.hover.background} />],
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
              <CodeBlock>
{`import {
  Stepper,           // Base component with variant prop
  LinearStepper,     // Convenience wrapper for linear variant
  NonLinearStepper,  // Convenience wrapper for non-linear variant
  StepperStep,       // Individual step for custom layouts
  DefaultStepIndicator, // Default circle indicator
} from '@/components'

import type {
  StepperProps,
  LinearStepperProps,
  NonLinearStepperProps,
  StepperStepProps,
  StepItem,
  StepStatus,
  StepperVariant,
  StepIndicatorProps,
} from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Linear Stepper</h3>
              <CodeBlock>
{`const [activeStep, setActiveStep] = useState(0)

const steps = [
  { id: '1', label: 'Account Setup' },
  { id: '2', label: 'Personal Info' },
  { id: '3', label: 'Review' },
]

// Option 1: Using LinearStepper
<LinearStepper
  steps={steps}
  activeStep={activeStep}
  onStepChange={setActiveStep}
/>

// Option 2: Using Stepper with variant
<Stepper
  variant="linear"
  steps={steps}
  activeStep={activeStep}
  onStepChange={setActiveStep}
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Non-Linear Stepper</h3>
              <CodeBlock>
{`// Non-linear stepper with clickable navigation
<NonLinearStepper
  steps={steps}
  activeStep={activeStep}
  onStepChange={setActiveStep}
  // clickable is true by default for NonLinearStepper
/>

// With custom indicator component
<NonLinearStepper
  steps={steps}
  activeStep={activeStep}
  onStepChange={setActiveStep}
  indicatorComponent={({ status, size }) => (
    <MyCustomIndicator status={status} size={size} />
  )}
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Custom Step Indicator</h3>
              <CodeBlock>
{`import type { StepIndicatorProps } from '@/components'

function CustomIndicator({ status, isHovered, isFocused, size = 12 }: StepIndicatorProps) {
  const isCompleted = status === 'completed'
  const isActive = status === 'active'

  // Custom styling based on status
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: isCompleted || isActive
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(0, 0, 0, 0.1)',
        border: isFocused ? '2px solid blue' : 'none',
        transform: isHovered ? 'scale(1.2)' : 'scale(1)',
        transition: 'all 0.2s ease',
      }}
    />
  )
}

<NonLinearStepper
  steps={steps}
  activeStep={activeStep}
  indicatorComponent={CustomIndicator}
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Per-Step Icons</h3>
              <CodeBlock>
{`// Add custom icons to specific steps
const stepsWithIcons = [
  {
    id: '1',
    label: 'Profile',
    icon: <UserIcon size={12} color="rgba(255,255,255,0.9)" />,
  },
  {
    id: '2',
    label: 'Settings',
    icon: <GearIcon size={12} color="rgba(0,0,0,0.1)" />,
  },
  {
    id: '3',
    label: 'Done',
    // No icon - will use indicatorComponent or DefaultStepIndicator
  },
]

<NonLinearStepper steps={stepsWithIcons} activeStep={0} />`}
              </CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Stepper Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="steps">steps</code>, <code>StepItem[]</code>, 'Required', 'Array of step items'],
                  [<code key="activeStep">activeStep</code>, <code>number</code>, 'Required', 'Currently active step index (0-based)'],
                  [<code key="variant">variant</code>, <code>&apos;linear&apos; | &apos;nonLinear&apos;</code>, <code>&apos;linear&apos;</code>, 'Stepper variant'],
                  [<code key="orientation">orientation</code>, <code>&apos;vertical&apos; | &apos;horizontal&apos;</code>, <code>&apos;vertical&apos;</code>, 'Layout direction (top bar vs. stacked)'],
                  [<code key="onStepChange">onStepChange</code>, <code>(index: number) =&gt; void</code>, '-', 'Callback when step changes'],
                  [<code key="stepContent">stepContent</code>, <code>ReactNode[]</code>, '-', 'Content for each step'],
                  [<code key="clickable">clickable</code>, <code>boolean</code>, <code>false</code>, 'Allow clicking steps to navigate'],
                  [<code key="indicatorComponent">indicatorComponent</code>, <code>React.ComponentType&lt;StepIndicatorProps&gt;</code>, <code>DefaultStepIndicator</code>, 'Custom indicator (non-linear only)'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>StepItem Interface</h3>
              <SpecTable
                headers={['Property', 'Type', 'Required', 'Description']}
                rows={[
                  [<code key="id">id</code>, <code>string</code>, 'Yes', 'Unique identifier'],
                  [<code key="label">label</code>, <code>string</code>, 'Yes', 'Step label text'],
                  [<code key="metadata">metadata</code>, <code>string</code>, 'No', 'Optional subtitle/metadata'],
                  [<code key="disabled">disabled</code>, <code>boolean</code>, 'No', 'Whether step is disabled'],
                  [<code key="icon">icon</code>, <code>ReactNode</code>, 'No', 'Custom icon (overrides indicatorComponent)'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>StepIndicatorProps</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="status">status</code>, <code>StepStatus</code>, 'Required', 'Current step status'],
                  [<code key="isHovered">isHovered</code>, <code>boolean</code>, <code>false</code>, 'Whether step is hovered'],
                  [<code key="isFocused">isFocused</code>, <code>boolean</code>, <code>false</code>, 'Whether step is focused'],
                  [<code key="size">size</code>, <code>number</code>, <code>12</code>, 'Indicator size in pixels'],
                ]}
              />
            </div>
          </section>

          {/* ========== DESIGN GUIDANCE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use Each Variant</h3>
              <SpecTable
                headers={['Variant', 'Use Case']}
                rows={[
                  ['LinearStepper', 'Sequential processes: registration, checkout, onboarding wizards'],
                  ['NonLinearStepper', 'Flexible navigation: settings panels, form sections, dashboards'],
                  ['HorizontalStepper', 'Wide page sections or embedded wizards where a top progress bar reads better than a stacked vertical list'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use clear, concise step labels', 'Use vague labels like "Step 1"'],
                  ['Show 3-7 steps maximum', 'Create steppers with too many steps'],
                  ['Use NonLinear for flexible workflows', 'Force linear navigation when order doesn\'t matter'],
                  ['Validate before allowing next step', 'Let users skip required fields'],
                  ['Provide custom icons that match status', 'Use color as the only status indicator'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <ul style={{ ...typography.body.md, color: colors.text.lowEmphasis.onLight, paddingLeft: '20px' }}>
                <li>Uses semantic navigation role with aria-label</li>
                <li>Steps have aria-current=&quot;step&quot; for active state</li>
                <li>Disabled steps have aria-disabled attribute</li>
                <li>Keyboard navigation with Enter/Space for clickable steps</li>
                <li>Focus indicators visible on keyboard navigation</li>
                <li>Screen reader announces step position (e.g., &quot;Step 2 of 4&quot;)</li>
                <li>Linear variant uses numbers + checkmarks (not color alone)</li>
              </ul>
            </div>
          </section>
        </>
      )}

      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={stepperDocData} />
      )}
    </StyleguideLayout>
  )
}
