'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox } from '../../design-system/shared'
import { Stepper, StepperStep, LinearStepper, NonLinearStepper, DefaultStepIndicator, StepItem, StepStatus, StepIndicatorProps } from '@/components'
import { colors, typography, stepper as stepperTokens, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'variants' | 'implementation'

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

export default function StepperPage() {
  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive state for playground
  const [demoActiveStep, setDemoActiveStep] = useState(0)
  const [demoClickable, setDemoClickable] = useState(false)
  const [demoVariant, setDemoVariant] = useState<'linear' | 'nonLinear'>('linear')

  // Non-linear demo state
  const [nonLinearActiveStep, setNonLinearActiveStep] = useState(1)

  // Demo steps
  const demoSteps: StepItem[] = [
    { id: '1', label: 'Account Setup' },
    { id: '2', label: 'Personal Information' },
    { id: '3', label: 'Review & Submit' },
  ]

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'variants', label: 'Variants' },
    { id: 'implementation', label: 'Implementation' },
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
              <CodeBlock>{`import { Stepper, LinearStepper, NonLinearStepper } from '@/components'`}</CodeBlock>
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
                      <div style={{ width: '100%', maxWidth: '350px' }}>
                        <Stepper
                          variant={demoVariant}
                          steps={demoSteps}
                          activeStep={demoActiveStep}
                          onStepChange={demoClickable ? setDemoActiveStep : undefined}
                          primaryButtonText={demoActiveStep === demoSteps.length - 1 ? 'Complete' : 'Next'}
                          secondaryButtonText="Previous"
                          onPrimaryClick={handleNext}
                          onSecondaryClick={handlePrevious}
                          clickable={demoClickable}
                          stepContent={[
                            <div key="1" style={{ padding: '16px', background: colors.neutral[100], borderRadius: '8px' }}>
                              <p style={{ margin: 0, ...typography.body.sm, color: colors.text.mediumEmphasis }}>
                                Step 1 content goes here
                              </p>
                            </div>,
                            <div key="2" style={{ padding: '16px', background: colors.neutral[100], borderRadius: '8px' }}>
                              <p style={{ margin: 0, ...typography.body.sm, color: colors.text.mediumEmphasis }}>
                                Step 2 content goes here
                              </p>
                            </div>,
                            <div key="3" style={{ padding: '16px', background: colors.neutral[100], borderRadius: '8px' }}>
                              <p style={{ margin: 0, ...typography.body.sm, color: colors.text.mediumEmphasis }}>
                                Step 3 content goes here
                              </p>
                            </div>,
                          ]}
                        />
                      </div>
                    }
                    code={`<Stepper
  variant="${demoVariant}"
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

          {/* ========== STEP STATES ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Step States</h2>
            <p style={sharedStyles.sectionDescription}>
              Each step can be in one of four states: completed, active, pending, or disabled.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                {(['completed', 'active', 'pending', 'disabled'] as StepStatus[]).map((status) => (
                  <div key={status}>
                    <h4 style={{ ...typography.label.md, marginBottom: '16px', textTransform: 'capitalize' }}>
                      {status}
                    </h4>
                    <StepperStep
                      stepNumber={1}
                      label="Step Label"
                      status={status}
                      showTopConnector={false}
                      showBottomConnector={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>
            <p style={sharedStyles.sectionDescription}>
              Colors and spacing values used in the stepper component.
            </p>

            {/* Step Indicator Colors */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Step Indicator Colors</h3>
              <SpecTable
                headers={['State', 'Background', 'Text', 'Border']}
                rows={[
                  [<code key="completed">completed</code>, stepperTokens.step.colors.completed.background, stepperTokens.step.colors.completed.text, stepperTokens.step.colors.completed.border],
                  [<code key="active">active</code>, stepperTokens.step.colors.active.background, stepperTokens.step.colors.active.text, stepperTokens.step.colors.active.border],
                  [<code key="pending">pending</code>, stepperTokens.step.colors.pending.background, stepperTokens.step.colors.pending.text, stepperTokens.step.colors.pending.border],
                  [<code key="disabled">disabled</code>, stepperTokens.step.colors.disabled.background, stepperTokens.step.colors.disabled.text, stepperTokens.step.colors.disabled.border],
                ]}
              />
            </div>

            {/* Non-Linear Indicator Icons */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Non-Linear Status Icons</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                Icons are inset in a circle with 2px grey border. Step button is 32px, inner icon container is 24px, icon paths are 20px.
              </p>
              <SpecTable
                headers={['Status', 'Icon', 'Icon Size', 'Container', 'Step Button', 'Icon Color', 'Border Color']}
                rows={[
                  [<code key="completed">completed</code>, 'Checkmark', '20px', '24px', '32px', 'rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.3)'],
                  [<code key="active">active</code>, 'Circular arrow', '20px', '24px', '32px', 'rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.3)'],
                  [<code key="pending">pending</code>, 'Dashed circle', '20px', '24px', '32px', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.15)'],
                  [<code key="disabled">disabled</code>, 'Dashed circle', '20px', '24px', '32px', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.15)'],
                ]}
              />
            </div>

            {/* Connector Colors */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Connector Colors</h3>
              <SpecTable
                headers={['State', 'Color']}
                rows={[
                  [<code key="completed">completed</code>, stepperTokens.connector.colors.completed],
                  [<code key="pending">pending</code>, stepperTokens.connector.colors.pending],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== VARIANTS TAB ========== */}
      {activePageTab === 'variants' && (
        <>
          {/* ========== LINEAR STEPPER ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Linear Stepper</h2>
            <p style={sharedStyles.sectionDescription}>
              The LinearStepper displays numbered steps that users must complete in sequence.
              This is the default stepper behavior - users progress through steps one at a time.
            </p>

            <div style={sharedStyles.card}>
              <Playground
                preview={
                  <div style={{ width: '100%', maxWidth: '350px' }}>
                    <LinearStepper
                      steps={[
                        { id: '1', label: 'Account Setup', metadata: 'Required' },
                        { id: '2', label: 'Personal Information' },
                        { id: '3', label: 'Review & Submit' },
                      ]}
                      activeStep={1}
                    />
                  </div>
                }
                code={`import { LinearStepper } from '@/components'

<LinearStepper
  steps={[
    { id: '1', label: 'Account Setup', metadata: 'Required' },
    { id: '2', label: 'Personal Information' },
    { id: '3', label: 'Review & Submit' },
  ]}
  activeStep={1}
  onStepChange={setActiveStep}
/>`}
                previewPadding="32px 24px"
                previewMinHeight="300px"
              />
            </div>
          </section>

          {/* ========== NON-LINEAR STEPPER ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Non-Linear Stepper</h2>
            <p style={sharedStyles.sectionDescription}>
              The NonLinearStepper uses circle indicators instead of numbers and allows users to
              navigate to any step in any order. By default, steps are clickable.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Default Non-Linear</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                Uses 12x12px circle indicators: black with 10% opacity for pending states,
                white with 90% opacity for completed/active states.
              </p>
              <Playground
                preview={
                  <div style={{ width: '100%', maxWidth: '350px' }}>
                    <NonLinearStepper
                      steps={[
                        { id: '1', label: 'Select Category' },
                        { id: '2', label: 'Add Details' },
                        { id: '3', label: 'Upload Files' },
                        { id: '4', label: 'Confirm' },
                      ]}
                      activeStep={nonLinearActiveStep}
                      onStepChange={setNonLinearActiveStep}
                    />
                  </div>
                }
                code={`import { NonLinearStepper } from '@/components'

<NonLinearStepper
  steps={[
    { id: '1', label: 'Select Category' },
    { id: '2', label: 'Add Details' },
    { id: '3', label: 'Upload Files' },
    { id: '4', label: 'Confirm' },
  ]}
  activeStep={activeStep}
  onStepChange={setActiveStep}
  clickable // true by default for NonLinearStepper
/>`}
                previewPadding="32px 24px"
                previewMinHeight="350px"
              />
            </div>

            {/* Custom Indicator */}
            <div style={{ ...sharedStyles.card, marginTop: '32px' }}>
              <h3 style={sharedStyles.cardTitle}>Custom Indicator Component</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                Replace the default circle with a custom indicator component. The component receives
                status, isHovered, isFocused, and size props.
              </p>
              <Playground
                preview={
                  <div style={{ width: '100%', maxWidth: '350px' }}>
                    <NonLinearStepper
                      steps={[
                        { id: '1', label: 'Upload Document' },
                        { id: '2', label: 'Review Content' },
                        { id: '3', label: 'Approve' },
                      ]}
                      activeStep={1}
                      indicatorComponent={IconStepIndicator}
                    />
                  </div>
                }
                code={`import { NonLinearStepper, StepIndicatorProps } from '@/components'

// Custom indicator with checkmark for completed
function IconStepIndicator({ status, size = 12 }: StepIndicatorProps) {
  if (status === 'completed') {
    return (
      <svg width={size} height={size} viewBox="0 0 12 12">
        <path d="M2 6L5 9L10 3" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      </svg>
    )
  }

  const isActive = status === 'active'
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.1)',
    }} />
  )
}

<NonLinearStepper
  steps={steps}
  activeStep={activeStep}
  indicatorComponent={IconStepIndicator}
/>`}
                previewPadding="32px 24px"
                previewMinHeight="280px"
              />
            </div>

            {/* Per-Step Custom Icons */}
            <div style={{ ...sharedStyles.card, marginTop: '32px' }}>
              <h3 style={sharedStyles.cardTitle}>Per-Step Custom Icons</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                Add custom icons to individual steps using the `icon` property on StepItem.
                This overrides the indicatorComponent for that specific step.
              </p>
              <Playground
                preview={
                  <div style={{ width: '100%', maxWidth: '350px' }}>
                    <NonLinearStepper
                      steps={[
                        {
                          id: '1',
                          label: 'User Profile',
                          icon: (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <circle cx="6" cy="4" r="2.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                              <path d="M2 10.5C2 8.5 3.5 7 6 7C8.5 7 10 8.5 10 10.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          ),
                        },
                        {
                          id: '2',
                          label: 'Settings',
                          icon: (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <circle cx="6" cy="6" r="1.5" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
                              <path d="M6 1V2.5M6 9.5V11M1 6H2.5M9.5 6H11" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          ),
                        },
                        {
                          id: '3',
                          label: 'Complete',
                          icon: (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                        },
                      ]}
                      activeStep={0}
                    />
                  </div>
                }
                code={`<NonLinearStepper
  steps={[
    {
      id: '1',
      label: 'User Profile',
      icon: <UserIcon />,  // Custom icon component
    },
    {
      id: '2',
      label: 'Settings',
      icon: <GearIcon />,
    },
    {
      id: '3',
      label: 'Complete',
      icon: <CheckIcon />,
    },
  ]}
  activeStep={0}
/>`}
                previewPadding="32px 24px"
                previewMinHeight="280px"
              />
            </div>
          </section>

          {/* ========== COMPARISON ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>When to Use Each Variant</h2>

            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Variant', 'Use Case', 'Behavior']}
                rows={[
                  [
                    <strong key="linear">LinearStepper</strong>,
                    'Sequential processes where order matters (registration, checkout)',
                    'Shows step numbers; typically completes steps in order',
                  ],
                  [
                    <strong key="nonLinear">NonLinearStepper</strong>,
                    'Flexible workflows where users can jump between sections (settings, forms)',
                    'Shows circles/icons; allows clicking any step; clickable by default',
                  ],
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
              <ul style={{ ...typography.body.md, color: colors.text.mediumEmphasis, paddingLeft: '20px' }}>
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
    </StyleguideLayout>
  )
}
