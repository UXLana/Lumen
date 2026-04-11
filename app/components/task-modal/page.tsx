'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  Playground,
  PillButton,
  StyledCheckbox,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import {
  TaskModal,
  TaskModalPanel,
  TaskStep,
  Button,
  Input,
  Select,
  Banner,
} from '@/components'
import { colors, typography, spacing, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'
type OrientationOption = 'horizontal' | 'vertical'
type ColumnsOption = 1 | 2
type MobileProgressOption = 'inline' | 'stacked'

// =============================================================================
// CONSTANTS
// =============================================================================

const US_STATES = [
  { value: 'AL', label: 'AL' }, { value: 'AK', label: 'AK' }, { value: 'AZ', label: 'AZ' },
  { value: 'AR', label: 'AR' }, { value: 'CA', label: 'CA' }, { value: 'CO', label: 'CO' },
  { value: 'CT', label: 'CT' }, { value: 'DE', label: 'DE' }, { value: 'FL', label: 'FL' },
  { value: 'GA', label: 'GA' }, { value: 'HI', label: 'HI' }, { value: 'ID', label: 'ID' },
  { value: 'IL', label: 'IL' }, { value: 'IN', label: 'IN' }, { value: 'IA', label: 'IA' },
  { value: 'KS', label: 'KS' }, { value: 'KY', label: 'KY' }, { value: 'LA', label: 'LA' },
  { value: 'ME', label: 'ME' }, { value: 'MD', label: 'MD' }, { value: 'MA', label: 'MA' },
  { value: 'MI', label: 'MI' }, { value: 'MN', label: 'MN' }, { value: 'MS', label: 'MS' },
  { value: 'MO', label: 'MO' }, { value: 'MT', label: 'MT' }, { value: 'NE', label: 'NE' },
  { value: 'NV', label: 'NV' }, { value: 'NH', label: 'NH' }, { value: 'NJ', label: 'NJ' },
  { value: 'NM', label: 'NM' }, { value: 'NY', label: 'NY' }, { value: 'NC', label: 'NC' },
  { value: 'ND', label: 'ND' }, { value: 'OH', label: 'OH' }, { value: 'OK', label: 'OK' },
  { value: 'OR', label: 'OR' }, { value: 'PA', label: 'PA' }, { value: 'RI', label: 'RI' },
  { value: 'SC', label: 'SC' }, { value: 'SD', label: 'SD' }, { value: 'TN', label: 'TN' },
  { value: 'TX', label: 'TX' }, { value: 'UT', label: 'UT' }, { value: 'VT', label: 'VT' },
  { value: 'VA', label: 'VA' }, { value: 'WA', label: 'WA' }, { value: 'WV', label: 'WV' },
  { value: 'WI', label: 'WI' }, { value: 'WY', label: 'WY' },
]

// =============================================================================
// SAMPLE STEPS
// =============================================================================

const sampleSteps: TaskStep[] = [
  { id: 'info', label: 'Basic Information', subtitle: 'Business name and license type' },
  { id: 'details', label: 'License Details', subtitle: 'Dates, state, and license number' },
  { id: 'location', label: 'Location', subtitle: 'Physical address of the facility' },
  { id: 'review', label: 'Review & Submit', subtitle: 'Confirm all details before submitting' },
]

// =============================================================================
// STEP CONTENT COMPONENTS
// =============================================================================

function StepContentBasicInfo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <h2 style={{ ...typography.heading.h3, color: colors.text.highEmphasis.onLight, margin: 0 }}>
        Basic Information
      </h2>
      <p style={{ ...typography.body.md, color: colors.text.lowEmphasis.onLight, margin: 0 }}>
        Enter the basic details for the new license application.
      </p>
      <Input label="Business Name" placeholder="Enter business name" />
      <Input label="DBA (if applicable)" placeholder="Doing business as..." />
      <Select
        label="License Type"
        options={[
          { value: 'retail', label: 'Retail Dispensary' },
          { value: 'cultivator', label: 'Cultivator' },
          { value: 'processor', label: 'Processor' },
          { value: 'transporter', label: 'Transporter' },
        ]}
      />
    </div>
  )
}

function StepContentDetails() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <h2 style={{ ...typography.heading.h3, color: colors.text.highEmphasis.onLight, margin: 0 }}>
        License Details
      </h2>
      <Input label="License Number" placeholder="Auto-generated" disabled />
      <Select
        label="State"
        options={[
          { value: 'CO', label: 'Colorado' },
          { value: 'CA', label: 'California' },
          { value: 'OR', label: 'Oregon' },
        ]}
      />
      <Input label="Effective Date" placeholder="MM/DD/YYYY" />
      <Input label="Expiration Date" placeholder="MM/DD/YYYY" />
    </div>
  )
}

function StepContentLocation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <h2 style={{ ...typography.heading.h3, color: colors.text.highEmphasis.onLight, margin: 0 }}>
        Location
      </h2>
      <Input label="Street Address" placeholder="123 Main St" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 96px', gap: spacing.sm, alignItems: 'start' }}>
        <Input label="City" placeholder="Denver" fullWidth />
        <Select
          label="State"
          options={US_STATES}
          fullWidth
        />
        <Input label="ZIP" placeholder="80202" fullWidth />
      </div>
    </div>
  )
}

function StepContentReview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <h2 style={{ ...typography.heading.h3, color: colors.text.highEmphasis.onLight, margin: 0 }}>
        Review & Submit
      </h2>
      <Banner variant="info" title="Almost done">
        Please review all information before submitting. You can go back to any step to make changes.
      </Banner>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <DetailRow label="Business Name" value="Green Mountain Dispensary" />
        <DetailRow label="License Type" value="Retail Dispensary" />
        <DetailRow label="State" value="Colorado" />
        <DetailRow label="Address" value="123 Main St, Denver, CO 80202" />
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: `${spacing.xs} 0`,
        borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
      }}
    >
      <span style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight }}>
        {label}
      </span>
      <span style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight }}>
        {value}
      </span>
    </div>
  )
}

function SidebarPreview({ stepIndex }: { stepIndex: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <h3
        style={{
          ...typography.heading.h4,
          color: colors.text.highEmphasis.onLight,
          margin: 0,
        }}
      >
        Summary
      </h3>
      <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, margin: 0 }}>
        Completing step {stepIndex + 1} of 4
      </p>
      <div
        style={{
          padding: spacing.md,
          borderRadius: '8px',
          backgroundColor: colors.surface.lightDarker,
        }}
      >
        <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, margin: 0 }}>
          Application data will appear here as you complete each step.
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// DOC DATA
// =============================================================================

const taskModalDocData: ComponentDocData = {
  displayName: 'TaskModal',
  importPath: '@/components',
  importStatement: `import { TaskModal, TaskModalPanel } from '@/components'\nimport type { TaskModalProps, TaskStep, TaskModalOrientation } from '@/components'`,
  description:
    'A full-screen, multi-step task modal. Like Stepper but screen-level — each step takes the full viewport. Supports horizontal, vertical, and mobile (ProgressBar) navigation.',
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Controls modal visibility' },
    { name: 'onClose', type: '() => void', required: true, description: 'Close callback' },
    { name: 'title', type: 'string', required: true, description: 'Modal header title' },
    { name: 'subtitle', type: 'string', description: 'Optional subtitle below title' },
    { name: 'steps', type: 'TaskStep[]', required: true, description: 'Array of step definitions' },
    { name: 'activeStep', type: 'number', required: true, description: 'Current step index (0-based)' },
    { name: 'onStepChange', type: '(index: number) => void', required: true, description: 'Step change callback' },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Step indicator position: top bar or left sidebar',
    },
    {
      name: 'columns',
      type: '1 | 2 | 3',
      default: '1',
      description: 'Number of content columns per step',
    },
    { name: 'clickable', type: 'boolean', default: 'false', description: 'Allow clicking step indicators to navigate' },
    { name: 'primaryButtonText', type: 'string', default: "'Next'", description: 'Primary button text (last step shows "Complete")' },
    { name: 'secondaryButtonText', type: 'string', default: "'Back'", description: 'Back button text' },
    { name: 'onPrimaryClick', type: '() => void', description: 'Next/complete button callback' },
    { name: 'onSecondaryClick', type: '() => void', description: 'Back button callback' },
    { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close on Escape key' },
    { name: 'headerButtons', type: 'TaskModalHeaderButton[]', description: 'Additional header action buttons' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Step content (use TaskModalPanel for layout)' },
  ],
  subComponents: [
    {
      name: 'TaskModalPanel',
      description: 'Content panel wrapper for column-based layouts within TaskModal.',
      props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Panel content' },
        { name: 'background', type: "'default' | 'muted'", default: "'default'", description: 'Panel background style' },
        { name: 'border', type: "'none' | 'left' | 'right'", default: "'none'", description: 'Border placement' },
        { name: 'sticky', type: 'boolean', default: 'false', description: 'Whether panel sticks on scroll' },
      ],
    },
  ],
  typeDefinitions: [
    { name: 'TaskStep', definition: "interface TaskStep {\n  id: string\n  label: string\n  subtitle?: string\n  disabled?: boolean\n  icon?: ReactNode\n  optional?: boolean\n}" },
    { name: 'TaskModalOrientation', definition: "type TaskModalOrientation = 'horizontal' | 'vertical'" },
    { name: 'TaskStepStatus', definition: "type TaskStepStatus = 'completed' | 'active' | 'pending' | 'disabled'" },
  ],
  accessibility: [
    { feature: 'Dialog role', description: 'role="dialog" with aria-modal="true"' },
    { feature: 'Escape key', description: 'Closes modal when closeOnEscape is true' },
    { feature: 'Scroll lock', description: 'Body scroll is locked while modal is open' },
    { feature: 'Live region', description: 'Screen reader announces current step on change' },
    { feature: 'Step indicators', description: 'Accessible buttons with aria-current="step"' },
    { feature: 'Keyboard navigation', description: 'Tab through controls, Escape to close' },
    { feature: 'Reduced motion', description: 'Respects prefers-reduced-motion for animations' },
  ],
  tokens: [
    { token: 'colors.surface.light', value: 'White', usage: 'Modal background' },
    { token: 'colors.surface.lightDarker', value: 'Gray-50', usage: 'Muted panel background' },
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Active step indicator' },
    { token: 'colors.status.success', value: 'Green', usage: 'Completed step indicator' },
    { token: 'spacing.xl', value: '24px', usage: 'Content area padding' },
    { token: 'shadows.lg', value: 'Elevated', usage: 'Modal elevation' },
    { token: 'zIndex.modal', value: '1000', usage: 'Modal stacking order' },
  ],
  relatedComponents: [
    { name: 'Stepper', href: '/components/stepper' },
    { name: 'Full Screen Modal', href: '/components/full-screen-modal' },
    { name: 'ProgressBar', href: '/components/progress-bar' },
  ],
  notes: [
    'Use TaskModal for complex multi-step workflows that need full-screen focus (e.g., license applications, onboarding wizards).',
    'Use Stepper instead for shorter, inline step flows that live within a page.',
    'Mobile viewports automatically collapse orientation to a ProgressBar header — no extra config needed.',
    'Use columns={2} with a sticky muted TaskModalPanel for forms that benefit from live preview or context.',
    'Steps with optional={true} show an "Optional" badge — useful for non-required workflow steps.',
  ],
  // ── Usage Intelligence ──
  whenToUse: [
    'Complex multi-step workflows that need full-screen focus (e.g., license applications, facility registration, onboarding wizards).',
    'Guided task flows with 3+ steps where each step has substantial form content.',
    'Workflows that benefit from a 2-column layout with live preview or context sidebar.',
    'Processes where mobile users need a clear progress indicator (auto-collapses to ProgressBar).',
  ],
  whenNotToUse: [
    { scenario: 'Short 2-4 step forms that fit inline on a page', instead: 'Stepper — inline accordion, no modal overlay needed' },
    { scenario: 'Simple confirmation or single-action modal', instead: 'ConfirmDialog — lightweight modal with cancel/confirm' },
    { scenario: 'Full-screen overlay without step navigation', instead: 'FullScreenModal — generic full-screen panel without stepper chrome' },
    { scenario: 'Settings or preferences with collapsible sections', instead: 'Accordion — expandable sections without step progression' },
  ],
  usageExamples: [
    {
      title: 'Basic horizontal wizard',
      description: 'Standard multi-step form with horizontal step indicator. Best for 3-5 steps with short labels.',
      isDefault: true,
      code: `<TaskModal\n  open={open}\n  onClose={() => setOpen(false)}\n  title="Create License"\n  steps={steps}\n  activeStep={step}\n  onStepChange={setStep}\n  onPrimaryClick={() => step < steps.length - 1 ? setStep(step + 1) : setOpen(false)}\n  onSecondaryClick={() => setStep(Math.max(0, step - 1))}\n>\n  <TaskModalPanel>\n    {renderStepContent(step)}\n  </TaskModalPanel>\n</TaskModal>`,
    },
    {
      title: '2-column with live preview',
      description: 'Form on the left, sticky context panel on the right. Use for applications where users benefit from seeing a summary as they fill out steps.',
      code: `<TaskModal\n  open={open}\n  onClose={() => setOpen(false)}\n  title="New Application"\n  steps={steps}\n  activeStep={step}\n  onStepChange={setStep}\n  columns={2}\n  clickable\n>\n  <TaskModalPanel>\n    <FormContent step={step} />\n  </TaskModalPanel>\n  <TaskModalPanel background="muted" border="left" sticky>\n    <LivePreview data={formData} />\n  </TaskModalPanel>\n</TaskModal>`,
    },
    {
      title: 'Vertical with many steps',
      description: 'Left sidebar step indicator with connector lines. Use when you have 5+ steps or step labels need more space (e.g., subtitles).',
      code: `<TaskModal\n  open={open}\n  onClose={() => setOpen(false)}\n  title="Facility Registration"\n  steps={steps}\n  activeStep={step}\n  onStepChange={setStep}\n  orientation="vertical"\n  showSubtitles\n>\n  <TaskModalPanel>\n    {renderStepContent(step)}\n  </TaskModalPanel>\n</TaskModal>`,
    },
  ],
}

// =============================================================================
// CODE GENERATION
// =============================================================================

function generateCode(opts: {
  orientation: OrientationOption
  columns: ColumnsOption
  clickable: boolean
  subtitle: boolean
}) {
  const lines = [
    'const [open, setOpen] = useState(false)',
    'const [step, setStep] = useState(0)',
    '',
    'const steps: TaskStep[] = [',
    "  { id: 'info', label: 'Basic Info' },",
    "  { id: 'details', label: 'Details' },",
    "  { id: 'location', label: 'Location' },",
    "  { id: 'review', label: 'Review' },",
    ']',
    '',
    '<TaskModal',
    '  open={open}',
    '  onClose={() => setOpen(false)}',
    '  title="Create License"',
  ]

  if (opts.subtitle) {
    lines.push('  subtitle="New retail dispensary application"')
  }

  lines.push('  steps={steps}')
  lines.push('  activeStep={step}')
  lines.push('  onStepChange={setStep}')
  lines.push(`  orientation="${opts.orientation}"`)

  if (opts.columns > 1) {
    lines.push(`  columns={${opts.columns}}`)
  }

  if (opts.clickable) {
    lines.push('  clickable')
  }

  lines.push('  onPrimaryClick={() => step < 3 ? setStep(step + 1) : setOpen(false)}')
  lines.push('  onSecondaryClick={() => setStep(Math.max(0, step - 1))}')
  lines.push('>')

  if (opts.columns === 2) {
    lines.push('  <TaskModalPanel>')
    lines.push('    {renderStepContent(step)}')
    lines.push('  </TaskModalPanel>')
    lines.push('  <TaskModalPanel background="muted" border="left" sticky>')
    lines.push('    <LivePreview data={formData} />')
    lines.push('  </TaskModalPanel>')
  } else {
    lines.push('  <TaskModalPanel>')
    lines.push('    {renderStepContent(step)}')
    lines.push('  </TaskModalPanel>')
  }

  lines.push('</TaskModal>')

  return lines.join('\n')
}

// =============================================================================
// PAGE
// =============================================================================

export default function TaskModalPage() {
  const [activeTab, setActiveTab] = useState<PageTab>('overview')

  // Single playground state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState(0)

  // Property controls
  const [orientation, setOrientation] = useState<OrientationOption>('horizontal')
  const [columns, setColumns] = useState<ColumnsOption>(1)
  const [mobileProgress, setMobileProgress] = useState<MobileProgressOption>('inline')
  const [clickable, setClickable] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(true)

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: return <StepContentBasicInfo />
      case 1: return <StepContentDetails />
      case 2: return <StepContentLocation />
      case 3: return <StepContentReview />
      default: return null
    }
  }

  const handleNext = () => {
    if (modalStep < sampleSteps.length - 1) {
      setModalStep(modalStep + 1)
    } else {
      setModalOpen(false)
      setModalStep(0)
    }
  }

  const handleBack = () => {
    if (modalStep > 0) {
      setModalStep(modalStep - 1)
    }
  }

  return (
    <StyleguideLayout
      title="Task Modal"
      description="Full-screen, multi-step task flow with horizontal, vertical, and mobile navigation modes."
      tagline="Guided workflows, zero guesswork."
      activeId="task-modal"
      tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'implementation', label: 'Implementation' },
        { id: 'documentation', label: 'Documentation' },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as PageTab)}
    >
      {/* ========== OVERVIEW TAB ========== */}
      {activeTab === 'overview' && (
        <>
          {/* Quick Start */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`import { TaskModal, TaskModalPanel } from '@/components'
import type { TaskStep } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Configure task modal properties, then open the modal to see your configuration live.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: spacing['4xl'] }}>
                {/* Preview */}
                <div>
                  <Playground
                    preview={
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, alignItems: 'flex-start', width: '100%' }}>
                        <div style={{
                          width: '100%',
                          padding: spacing.md,
                          borderRadius: borderRadius.md,
                          backgroundColor: colors.surface.lightDarker,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: spacing.xs,
                        }}>
                          <span style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight }}>
                            Current Configuration
                          </span>
                          <span style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight }}>
                            {orientation} · {columns === 2 ? '2-column' : 'single column'}{clickable ? ' · clickable' : ''}{showSubtitle ? ' · with subtitles' : ''}
                          </span>
                        </div>
                        <Button emphasis="high" onClick={() => { setModalStep(0); setModalOpen(true) }}>
                          Open Task Modal
                        </Button>
                      </div>
                    }
                    code={generateCode({ orientation, columns, clickable, subtitle: showSubtitle })}
                    previewPadding={`${spacing['2xl']} ${spacing.xl}`}
                    previewMinHeight="168px"
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Orientation */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Orientation
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {(['horizontal', 'vertical'] as OrientationOption[]).map(o => (
                          <PillButton
                            key={o}
                            onClick={() => setOrientation(o)}
                            isActive={orientation === o}
                          >
                            {o}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Columns */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Columns
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {([1, 2] as ColumnsOption[]).map(c => (
                          <PillButton
                            key={c}
                            onClick={() => setColumns(c)}
                            isActive={columns === c}
                          >
                            {c === 1 ? 'Single' : '2-Column'}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Progress */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Mobile Progress
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {(['inline', 'stacked'] as MobileProgressOption[]).map(m => (
                          <PillButton
                            key={m}
                            onClick={() => setMobileProgress(m)}
                            isActive={mobileProgress === m}
                          >
                            {m === 'inline' ? 'Inline' : 'Stacked'}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <StyledCheckbox
                        label="Clickable steps"
                        checked={clickable}
                        onChange={setClickable}
                      />
                      <StyledCheckbox
                        label="Show subtitle"
                        checked={showSubtitle}
                        onChange={setShowSubtitle}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TaskModal vs Stepper */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>TaskModal vs Stepper</h2>
            <p style={sharedStyles.sectionDescription}>
              Choose TaskModal for complex, full-screen workflows. Use Stepper for shorter inline step flows.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...typography.label.md, textAlign: 'left', padding: spacing.xs, borderBottom: `2px solid ${colors.border.highEmphasis.onLight}` }}>Feature</th>
                  <th style={{ ...typography.label.md, textAlign: 'left', padding: spacing.xs, borderBottom: `2px solid ${colors.border.highEmphasis.onLight}` }}>Stepper</th>
                  <th style={{ ...typography.label.md, textAlign: 'left', padding: spacing.xs, borderBottom: `2px solid ${colors.border.highEmphasis.onLight}` }}>TaskModal</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Layout', 'Inline accordion', 'Full-screen modal'],
                  ['Step content', 'Expands in-place', 'Takes entire viewport'],
                  ['Navigation', 'Vertical only', 'Horizontal, vertical, or mobile ProgressBar'],
                  ['Column support', 'Single', '1, 2, or 3 columns'],
                  ['Mobile behavior', 'Same as desktop', 'Collapses to ProgressBar in header'],
                  ['Best for', 'Short forms, settings', 'Complex multi-step tasks, wizards'],
                ].map(([feature, stepperVal, taskVal], i) => (
                  <tr key={i}>
                    <td style={{ ...typography.body.sm, padding: spacing.xs, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>{feature}</td>
                    <td style={{ ...typography.body.sm, padding: spacing.xs, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.lowEmphasis.onLight }}>{stepperVal}</td>
                    <td style={{ ...typography.body.sm, padding: spacing.xs, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.lowEmphasis.onLight }}>{taskVal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activeTab === 'implementation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xl'] }}>
          <div>
            <h3 style={{ ...typography.heading.h4, color: colors.text.highEmphasis.onLight, marginBottom: spacing.sm }}>
              Basic Horizontal
            </h3>
            <CodeBlock>{generateCode({ orientation: 'horizontal', columns: 1, clickable: false, subtitle: false })}</CodeBlock>
          </div>

          <div>
            <h3 style={{ ...typography.heading.h4, color: colors.text.highEmphasis.onLight, marginBottom: spacing.sm }}>
              Vertical with 2-Column Preview
            </h3>
            <CodeBlock>{generateCode({ orientation: 'vertical', columns: 2, clickable: true, subtitle: true })}</CodeBlock>
          </div>

          <div>
            <h3 style={{ ...typography.heading.h4, color: colors.text.highEmphasis.onLight, marginBottom: spacing.sm }}>
              Mobile Behavior
            </h3>
            <CodeBlock>{`// Mobile is automatic — on viewports < 768px:
// - Horizontal/vertical indicators collapse to ProgressBar
// - Columns collapse to single column
// - Footer buttons remain fixed
//
// No extra configuration needed.`}</CodeBlock>
          </div>
        </div>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activeTab === 'documentation' && (
        <ComponentDocumentation data={taskModalDocData} />
      )}

      {/* ============ SINGLE MODAL INSTANCE ============ */}
      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setModalStep(0) }}
        title="Create License"
        subtitle={showSubtitle ? 'New retail dispensary application' : undefined}
        steps={sampleSteps}
        activeStep={modalStep}
        onStepChange={setModalStep}
        orientation={orientation}
        columns={columns}
        clickable={clickable}
        showSubtitles={showSubtitle}
        mobileProgress={mobileProgress}
        onPrimaryClick={handleNext}
        onSecondaryClick={handleBack}
      >
        <TaskModalPanel>
          {renderStepContent(modalStep)}
        </TaskModalPanel>
        {columns === 2 && (
          <TaskModalPanel background="muted" border="left" sticky>
            <SidebarPreview stepIndex={modalStep} />
          </TaskModalPanel>
        )}
      </TaskModal>
    </StyleguideLayout>
  )
}
