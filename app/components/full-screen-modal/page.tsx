'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  SpecTable,
  Playground,
  PillButton,
  StyledCheckbox,
  CollapsibleSection,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import {
  FullScreenModal,
  FullScreenModalPanel,
  Button,
} from '@/components'
import type {
  FullScreenModalColumns,
  FullScreenModalHeaderButton,
  ModalVariant,
  ModalSize,
} from '@/components'
import { colors, typography, borderRadius, shadows } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// DOC DATA
// =============================================================================

const fullScreenModalDocData: ComponentDocData = {
  displayName: 'FullScreenModal',
  importPath: '@/components',
  importStatement: `import { FullScreenModal, FullScreenModalPanel } from '@/components'
import type {
  FullScreenModalProps,
  FullScreenModalPanelProps,
  FullScreenModalColumns,
  FullScreenModalHeaderButton,
} from '@/components'`,
  description:
    'A versatile modal overlay supporting fullscreen and floating variants with a configurable header (0–2 action buttons) and responsive multi-column body layout (1, 2, or 3 columns). Mobile always renders fullscreen.',
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Controls modal visibility' },
    { name: 'onClose', type: '() => void', required: true, description: 'Close callback (X button, Escape, or backdrop click)' },
    { name: 'title', type: 'string', required: true, description: 'Title in the header bar' },
    { name: 'subtitle', type: 'string', description: 'Optional subtitle below the title' },
    { name: 'variant', type: "'fullscreen' | 'floating'", default: "'fullscreen'", description: 'Display variant. Floating shows centered dialog with scrim. Mobile always renders fullscreen.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'lg'", description: 'Floating dialog size. Ignored in fullscreen variant.' },
    { name: 'columns', type: '1 | 2 | 3', default: '1', description: 'Number of body grid columns (responsive)' },
    { name: 'children', type: 'React.ReactNode', required: true, description: 'Body content — use FullScreenModalPanel for structured layout' },
    { name: 'headerButtons', type: 'FullScreenModalHeaderButton[]', description: '0–2 header action buttons' },
    { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Escape key closes modal' },
    { name: 'closeOnBackdrop', type: 'boolean', default: 'variant-dependent', description: 'Backdrop click closes modal. Default: true for floating, false for fullscreen.' },
    { name: 'className', type: 'string', description: 'Additional CSS class' },
  ],
  subComponents: [
    {
      name: 'FullScreenModalPanel',
      description: 'Content panel for structured layout inside FullScreenModal.',
      props: [
        { name: 'children', type: 'React.ReactNode', required: true, description: 'Panel content' },
        { name: 'background', type: "'light' | 'muted'", default: "'light'", description: 'Panel background variant' },
        { name: 'border', type: "'left' | 'right' | 'none'", default: "'none'", description: 'Side border' },
        { name: 'className', type: 'string', description: 'Additional CSS class' },
        { name: 'sticky', type: 'boolean', default: 'false', description: 'Sticky inner content with independent scroll' },
      ],
    },
  ],
  typeDefinitions: [
    { name: 'FullScreenModalColumns', definition: "type FullScreenModalColumns = 1 | 2 | 3" },
    {
      name: 'FullScreenModalHeaderButton',
      definition: `type FullScreenModalHeaderButton = {
  label: string
  emphasis: 'high' | 'mid' | 'low'
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
}`,
    },
    { name: 'FullScreenModalPanelBackground', definition: "type FullScreenModalPanelBackground = 'light' | 'muted'" },
    { name: 'FullScreenModalPanelBorder', definition: "type FullScreenModalPanelBorder = 'left' | 'right' | 'none'" },
  ],
  accessibility: [
    { feature: 'Keyboard', description: 'Escape to close (configurable via closeOnEscape prop).' },
    { feature: 'ARIA', description: 'role="dialog", aria-modal="true", aria-label set to title.' },
    { feature: 'Focus Management', description: 'Body scroll locked when open. Focus returns on close.' },
    { feature: 'Reduced Motion', description: 'Respects prefers-reduced-motion: animations disabled when set.' },
  ],
  tokens: [
    { token: 'typography.label.md', value: 'theme-aware', usage: 'Header title' },
    { token: 'typography.body.xs', value: 'theme-aware', usage: 'Header subtitle' },
    { token: 'colors.surface.light', value: 'theme-aware', usage: 'Modal & panel background' },
    { token: 'colors.surface.lightDarker', value: 'theme-aware', usage: 'Muted panel background' },
    { token: 'colors.border.lowEmphasis.onLight', value: 'theme-aware', usage: 'Header & panel borders' },
    { token: 'colors.scrim', value: 'theme-aware', usage: 'Backdrop overlay' },
    { token: 'colors.text.highEmphasis.onLight', value: 'theme-aware', usage: 'Title text color' },
    { token: 'colors.text.lowEmphasis.onLight', value: 'theme-aware', usage: 'Subtitle text color' },
    { token: 'shadows.xl', value: 'theme-aware', usage: 'Modal panel shadow' },
  ],
  relatedComponents: [
    { name: 'ConfirmDialog', href: '/components/confirm-dialog' },
    { name: 'Button', href: '/components/button' },
  ],
  notes: [
    'Use FullScreenModalPanel sub-components for multi-column layouts rather than bare divs.',
    'Limit header buttons to 2 maximum — typically Cancel (low emphasis) + Save (high emphasis).',
    'The muted background panel is ideal for preview areas, sidebars, or supplementary content.',
    'Set sticky on panels that need independent scrolling, like a preview pane beside a long form.',
    'Pair with ConfirmDialog for unsaved-changes warnings on close.',
  ],
  whenToUse: [
    'Full-screen overlay for complex single-step tasks like editing a record, composing a message, or reviewing details.',
    'Detail views or forms that need maximum screen real estate without step navigation.',
  ],
  whenNotToUse: [
    { scenario: 'Multi-step guided workflow with step indicators', instead: 'TaskModal — full-screen with step navigation, columns, mobile ProgressBar' },
    { scenario: 'Simple yes/no confirmation', instead: 'ConfirmDialog — lightweight modal with cancel/confirm' },
  ],
  usageExamples: [
    {
      title: 'Edit record modal',
      description: 'Full-screen overlay for editing a single record. Use header buttons for cancel/save.',
      isDefault: true,
      code: `<FullScreenModal open={open} onClose={handleClose}>\n  <FullScreenModal.Header\n    title="Edit License"\n    buttons={[\n      { label: 'Cancel', emphasis: 'low', onClick: handleClose },\n      { label: 'Save', emphasis: 'high', onClick: handleSave },\n    ]}\n  />\n  <FullScreenModal.Body>\n    {/* Form content */}\n  </FullScreenModal.Body>\n</FullScreenModal>`,
    },
  ],
}

// =============================================================================
// SAMPLE CONTENT FOR DEMOS
// =============================================================================

function SampleFormContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ ...typography.heading.h4, color: colors.text.highEmphasis.onLight, marginBottom: 8 }}>
          Product Details
        </div>
        <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, margin: 0 }}>
          Fill in the required information to create a new product listing.
        </p>
      </div>
      {['Product Name', 'SKU', 'Category', 'Description'].map((label) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ ...typography.label.sm, color: colors.text.highEmphasis.onLight }}>{label}</label>
          <div
            style={{
              height: 40,
              borderRadius: 8,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              background: colors.surface.light,
            }}
          />
        </div>
      ))}
    </div>
  )
}

function SamplePreviewContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ ...typography.label.md, color: colors.text.highEmphasis.onLight }}>
        Live Preview
      </div>
      <div
        style={{
          height: 200,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${colors.brand.lighter} 0%, ${colors.brand.default} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ ...typography.heading.h5, color: '#fff' }}>Product Preview</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {['Price: $0.00', 'Stock: 0 units', 'Status: Draft'].map((text) => (
          <div
            key={text}
            style={{
              ...typography.body.sm,
              color: colors.text.lowEmphasis.onLight,
              padding: '8px 12px',
              borderRadius: 6,
              background: colors.surface.lightDarker,
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}

function SampleListContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ ...typography.label.md, color: colors.text.highEmphasis.onLight, marginBottom: 8 }}>
        Selection
      </div>
      {['Product A', 'Product B', 'Product C', 'Product D', 'Product E'].map((name, i) => (
        <div
          key={name}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            border: `1px solid ${i === 0 ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
            background: i === 0 ? colors.brand.lighter : colors.surface.light,
            cursor: 'pointer',
            ...typography.body.sm,
            color: colors.text.highEmphasis.onLight,
          }}
        >
          {name}
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function FullScreenModalPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Demo state
  const [demoVariant, setDemoVariant] = useState<ModalVariant>('fullscreen')
  const [demoSize, setDemoSize] = useState<ModalSize>('lg')
  const [demoColumns, setDemoColumns] = useState<FullScreenModalColumns>(1)
  const [demoSubtitle, setDemoSubtitle] = useState(false)
  const [demoHeaderButtons, setDemoHeaderButtons] = useState(true)
  const [demoCloseOnEscape, setDemoCloseOnEscape] = useState(true)
  const [demoCloseOnBackdrop, setDemoCloseOnBackdrop] = useState(true)

  // Modal open state for live demos
  const [singleColOpen, setSingleColOpen] = useState(false)
  const [twoColOpen, setTwoColOpen] = useState(false)
  const [threeColOpen, setThreeColOpen] = useState(false)
  const [floatingOpen, setFloatingOpen] = useState(false)
  const [playgroundOpen, setPlaygroundOpen] = useState(false)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  // Build header buttons for playground
  const playgroundHeaderButtons: FullScreenModalHeaderButton[] = demoHeaderButtons
    ? [
        { label: 'Cancel', emphasis: 'low' as const, onClick: () => setPlaygroundOpen(false) },
        { label: 'Save', emphasis: 'high' as const, onClick: () => setPlaygroundOpen(false) },
      ]
    : []

  return (
    <StyleguideLayout
      title="Full Screen Modal"
      description="A full-viewport modal overlay with configurable header, responsive multi-column body, and structured panel layout for immersive workflows."
      activeId="full-screen-modal"
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
              <CodeBlock>{`import { FullScreenModal, FullScreenModalPanel } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Configure modal properties and launch a live demo.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview / Launch */}
                <div>
                  <Playground
                    preview={
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                        <div style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, textAlign: 'center' }}>
                          {demoColumns}-column layout{demoSubtitle ? ' with subtitle' : ''}{demoHeaderButtons ? ' with header buttons' : ''}
                        </div>
                        <Button emphasis="high" onClick={() => setPlaygroundOpen(true)}>
                          Open Modal
                        </Button>
                      </div>
                    }
                    code={`<FullScreenModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Product"${demoVariant !== 'fullscreen' ? `\n  variant="${demoVariant}"` : ''}${demoVariant === 'floating' && demoSize !== 'lg' ? `\n  size="${demoSize}"` : ''}${demoSubtitle ? '\n  subtitle="Fill in required fields"' : ''}${demoColumns > 1 ? `\n  columns={${demoColumns}}` : ''}${!demoCloseOnEscape ? '\n  closeOnEscape={false}' : ''}${!demoCloseOnBackdrop ? '\n  closeOnBackdrop={false}' : ''}${demoHeaderButtons ? `\n  headerButtons={[\n    { label: 'Cancel', emphasis: 'low', onClick: close },\n    { label: 'Save', emphasis: 'high', onClick: save },\n  ]}` : ''}
>
  <FullScreenModalPanel>
    <Form />
  </FullScreenModalPanel>${demoColumns >= 2 ? `\n  <FullScreenModalPanel background="muted" border="left"${demoColumns === 2 ? ' sticky' : ''}>
    <Preview />
  </FullScreenModalPanel>` : ''}${demoColumns === 3 ? `\n  <FullScreenModalPanel background="muted" border="left" sticky>
    <Sidebar />
  </FullScreenModalPanel>` : ''}
</FullScreenModal>`}
                    previewPadding="40px 24px"
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
                        {(['fullscreen', 'floating'] as const).map((v) => (
                          <PillButton
                            key={v}
                            onClick={() => setDemoVariant(v)}
                            isActive={demoVariant === v}
                          >
                            {v}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Size (only for floating) */}
                    {demoVariant === 'floating' && (
                      <div>
                        <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                          Size
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
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
                    )}

                    {/* Columns */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Columns
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {([1, 2, 3] as const).map((c) => (
                          <PillButton
                            key={c}
                            onClick={() => setDemoColumns(c)}
                            isActive={demoColumns === c}
                          >
                            {c}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <StyledCheckbox
                        checked={demoSubtitle}
                        onChange={setDemoSubtitle}
                        label="Subtitle"
                      />
                      <StyledCheckbox
                        checked={demoHeaderButtons}
                        onChange={setDemoHeaderButtons}
                        label="Header Buttons"
                      />
                      <StyledCheckbox
                        checked={demoCloseOnEscape}
                        onChange={setDemoCloseOnEscape}
                        label="Close on Escape"
                      />
                      <StyledCheckbox
                        checked={demoCloseOnBackdrop}
                        onChange={setDemoCloseOnBackdrop}
                        label="Close on Backdrop"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Live Demos */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Live Examples</h2>
            <p style={sharedStyles.sectionDescription}>
              Click each button to see the modal in action with different column configurations.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              {/* Floating */}
              <div
                style={{
                  padding: '24px',
                  background: colors.surface.light,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadius.lg,
                }}
              >
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Floating (Dialog)</h3>
                <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, margin: '0 0 16px' }}>
                  Centered dialog with scrim backdrop. Click outside to dismiss.
                </p>
                <Button emphasis="mid" onClick={() => setFloatingOpen(true)}>
                  Open Demo
                </Button>
              </div>

              {/* Single Column */}
              <div
                style={{
                  padding: '24px',
                  background: colors.surface.light,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadius.lg,
                }}
              >
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Fullscreen — 1 Column</h3>
                <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, margin: '0 0 16px' }}>
                  Single column for forms, settings, and detail views.
                </p>
                <Button emphasis="mid" onClick={() => setSingleColOpen(true)}>
                  Open Demo
                </Button>
              </div>

              {/* Two Column */}
              <div
                style={{
                  padding: '24px',
                  background: colors.surface.light,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadius.lg,
                }}
              >
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Fullscreen — 2 Column</h3>
                <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, margin: '0 0 16px' }}>
                  Form on the left, live preview on the right.
                </p>
                <Button emphasis="mid" onClick={() => setTwoColOpen(true)}>
                  Open Demo
                </Button>
              </div>

              {/* Three Column */}
              <div
                style={{
                  padding: '24px',
                  background: colors.surface.light,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadius.lg,
                }}
              >
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Fullscreen — 3 Column</h3>
                <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, margin: '0 0 16px' }}>
                  Selection list + edit form + preview panel.
                </p>
                <Button emphasis="mid" onClick={() => setThreeColOpen(true)}>
                  Open Demo
                </Button>
              </div>
            </div>
          </section>

          {/* Design Tokens */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Token paths used by FullScreenModal. All values are theme-aware.
              </p>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Color & Surface Tokens</h3>
                <SpecTable
                  headers={['Token', 'Usage']}
                  rows={[
                    [<code key="t1">colors.surface.light</code>, 'Modal background, light panel background'],
                    [<code key="t2">colors.surface.lightDarker</code>, 'Muted panel background, close button hover'],
                    [<code key="t3">colors.border.lowEmphasis.onLight</code>, 'Header border, panel side borders'],
                    [<code key="t4">colors.scrim</code>, 'Backdrop overlay'],
                    [<code key="t5">colors.text.highEmphasis.onLight</code>, 'Title text'],
                    [<code key="t6">colors.text.lowEmphasis.onLight</code>, 'Subtitle text'],
                    [<code key="t7">colors.text.disabled.onLight</code>, 'Close button icon color'],
                  ]}
                />
              </div>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Typography Tokens</h3>
                <SpecTable
                  headers={['Token', 'Usage']}
                  rows={[
                    [<code key="t8">typography.label.md</code>, 'Header title'],
                    [<code key="t9">typography.body.xs</code>, 'Header subtitle'],
                  ]}
                />
              </div>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Layout Tokens</h3>
                <SpecTable
                  headers={['Token', 'Value', 'Usage']}
                  rows={[
                    [<code key="t10">shadows.xl</code>, 'theme-aware', 'Panel shadow'],
                    [<code key="t11">zIndex.overlay</code>, '50', 'Backdrop z-index'],
                    [<code key="t12">transitionPresets.standard</code>, '300ms ease-in-out', 'Panel transition'],
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
          {/* Usage */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>
{`import { FullScreenModal, FullScreenModalPanel } from '@/components'
import type {
  FullScreenModalProps,
  FullScreenModalPanelProps,
  FullScreenModalColumns,
  FullScreenModalHeaderButton,
} from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Floating Dialog</h3>
              <CodeBlock>
{`<FullScreenModal
  open={isOpen}
  onClose={close}
  title="Edit Settings"
  variant="floating"
  size="md"
  headerButtons={[
    { label: 'Cancel', emphasis: 'low', onClick: close },
    { label: 'Save', emphasis: 'high', onClick: handleSave },
  ]}
>
  <FullScreenModalPanel>
    <SettingsForm />
  </FullScreenModalPanel>
</FullScreenModal>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Fullscreen — Single Column</h3>
              <CodeBlock>
{`<FullScreenModal open={isOpen} onClose={close} title="Settings">
  <FullScreenModalPanel>
    <SettingsForm />
  </FullScreenModalPanel>
</FullScreenModal>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Two Columns — Edit + Preview</h3>
              <CodeBlock>
{`<FullScreenModal
  open={isOpen}
  onClose={close}
  title="Edit Product"
  columns={2}
  headerButtons={[
    { label: 'Save', emphasis: 'high', onClick: handleSave },
  ]}
>
  <FullScreenModalPanel>
    <ProductForm />
  </FullScreenModalPanel>
  <FullScreenModalPanel background="muted" border="left" sticky>
    <ProductPreview />
  </FullScreenModalPanel>
</FullScreenModal>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Three Columns — Bulk Edit</h3>
              <CodeBlock>
{`<FullScreenModal
  open={isOpen}
  onClose={close}
  title="Bulk Edit"
  subtitle="Editing 5 products"
  columns={3}
  headerButtons={[
    { label: 'Cancel', emphasis: 'low', onClick: close },
    { label: 'Save All', emphasis: 'high', onClick: handleSaveAll },
  ]}
>
  <FullScreenModalPanel>
    <SelectionList />
  </FullScreenModalPanel>
  <FullScreenModalPanel border="left">
    <EditForm />
  </FullScreenModalPanel>
  <FullScreenModalPanel background="muted" border="left" sticky>
    <LivePreview />
  </FullScreenModalPanel>
</FullScreenModal>`}
              </CodeBlock>
            </div>
          </section>

          {/* Props */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>FullScreenModal Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="p1">open</code>, <code key="pt1">boolean</code>, '—', 'Controls modal visibility'],
                  [<code key="p2">onClose</code>, <code key="pt2">{'() => void'}</code>, '—', 'Close callback'],
                  [<code key="p3">title</code>, <code key="pt3">string</code>, '—', 'Header title'],
                  [<code key="p4">subtitle</code>, <code key="pt4">string</code>, '—', 'Optional subtitle'],
                  [<code key="p4b">variant</code>, <code key="pt4b">{"'fullscreen' | 'floating'"}</code>, <code key="pd4b">{"'fullscreen'"}</code>, 'Display variant. Mobile always renders fullscreen.'],
                  [<code key="p4c">size</code>, <code key="pt4c">{"'sm' | 'md' | 'lg' | 'xl'"}</code>, <code key="pd4c">{"'lg'"}</code>, 'Floating dialog size. Ignored in fullscreen.'],
                  [<code key="p5">columns</code>, <code key="pt5">1 | 2 | 3</code>, <code key="pd5">1</code>, 'Body grid columns'],
                  [<code key="p6">children</code>, <code key="pt6">ReactNode</code>, '—', 'Body content'],
                  [<code key="p7">headerButtons</code>, <code key="pt7">FullScreenModalHeaderButton[]</code>, '—', '0–2 header action buttons'],
                  [<code key="p8">closeOnEscape</code>, <code key="pt8">boolean</code>, <code key="pd8">true</code>, 'Escape closes modal'],
                  [<code key="p9">closeOnBackdrop</code>, <code key="pt9">boolean</code>, 'variant-dependent', 'Backdrop click closes modal. Default: true for floating, false for fullscreen.'],
                  [<code key="p10">className</code>, <code key="pt10">string</code>, '—', 'Additional CSS class'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>FullScreenModalPanel Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="pp1">children</code>, <code key="ppt1">ReactNode</code>, '—', 'Panel content'],
                  [<code key="pp2">background</code>, <code key="ppt2">{"'light' | 'muted'"}</code>, <code key="ppd2">{"'light'"}</code>, 'Background variant'],
                  [<code key="pp3">border</code>, <code key="ppt3">{"'left' | 'right' | 'none'"}</code>, <code key="ppd3">{"'none'"}</code>, 'Side border'],
                  [<code key="pp4">className</code>, <code key="ppt4">string</code>, '—', 'Additional CSS class'],
                  [<code key="pp5">sticky</code>, <code key="ppt5">boolean</code>, <code key="ppd5">false</code>, 'Sticky with independent scroll'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>FullScreenModalHeaderButton</h3>
              <SpecTable
                headers={['Property', 'Type', 'Required', 'Description']}
                rows={[
                  [<code key="hb1">label</code>, <code key="hbt1">string</code>, 'Yes', 'Button text'],
                  [<code key="hb2">emphasis</code>, <code key="hbt2">{"'high' | 'mid' | 'low'"}</code>, 'Yes', 'Button emphasis level'],
                  [<code key="hb3">onClick</code>, <code key="hbt3">{'() => void'}</code>, 'Yes', 'Click handler'],
                  [<code key="hb4">disabled</code>, <code key="hbt4">boolean</code>, 'No', 'Disabled state'],
                  [<code key="hb5">loading</code>, <code key="hbt5">boolean</code>, 'No', 'Loading state'],
                  [<code key="hb6">icon</code>, <code key="hbt6">ReactNode</code>, 'No', 'Left icon'],
                ]}
              />
            </div>
          </section>

          {/* Design Guidance */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use Each Column Count</h3>
              <SpecTable
                headers={['Columns', 'Use Case', 'Example']}
                rows={[
                  [<code key="c1">1</code>, 'Simple forms, settings, detail views', 'User preferences, account settings'],
                  [<code key="c2">2</code>, 'Edit + preview, form + context panel', 'Product editor, content authoring'],
                  [<code key="c3">3</code>, 'Selection + edit + preview (bulk workflows)', 'Bulk product editor, multi-item operations'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use FullScreenModalPanel for consistent padding & structure', 'Place raw divs directly as children'],
                  ['Limit header buttons to 2 (Cancel + Primary action)', 'Add more than 2 header buttons'],
                  ['Use muted background for preview/sidebar panels', 'Use muted background on the primary content panel'],
                  ['Set sticky on preview panels in 2- and 3-column layouts', 'Set sticky on the primary editing panel'],
                  ['Pair with ConfirmDialog for unsaved-changes warnings', 'Close without warning when form has changes'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={fullScreenModalDocData} />
      )}

      {/* ========== LIVE MODAL INSTANCES ========== */}

      {/* Playground Modal */}
      <FullScreenModal
        open={playgroundOpen}
        onClose={() => setPlaygroundOpen(false)}
        title="Edit Product"
        variant={demoVariant}
        size={demoSize}
        subtitle={demoSubtitle ? 'Fill in all required fields' : undefined}
        columns={demoColumns}
        headerButtons={playgroundHeaderButtons.length > 0 ? playgroundHeaderButtons : undefined}
        closeOnEscape={demoCloseOnEscape}
        closeOnBackdrop={demoCloseOnBackdrop}
      >
        <FullScreenModalPanel>
          <SampleFormContent />
        </FullScreenModalPanel>
        {demoColumns >= 2 && (
          <FullScreenModalPanel background="muted" border="left" sticky>
            <SamplePreviewContent />
          </FullScreenModalPanel>
        )}
        {demoColumns === 3 && (
          <FullScreenModalPanel background="muted" border="left" sticky>
            <SamplePreviewContent />
          </FullScreenModalPanel>
        )}
      </FullScreenModal>

      {/* Floating Demo */}
      <FullScreenModal
        open={floatingOpen}
        onClose={() => setFloatingOpen(false)}
        title="Edit Settings"
        subtitle="Update your preferences"
        variant="floating"
        size="md"
        headerButtons={[
          { label: 'Cancel', emphasis: 'low', onClick: () => setFloatingOpen(false) },
          { label: 'Save', emphasis: 'high', onClick: () => setFloatingOpen(false) },
        ]}
      >
        <FullScreenModalPanel>
          <SampleFormContent />
        </FullScreenModalPanel>
      </FullScreenModal>

      {/* Single Column Demo */}
      <FullScreenModal
        open={singleColOpen}
        onClose={() => setSingleColOpen(false)}
        title="Settings"
      >
        <FullScreenModalPanel>
          <SampleFormContent />
        </FullScreenModalPanel>
      </FullScreenModal>

      {/* Two Column Demo */}
      <FullScreenModal
        open={twoColOpen}
        onClose={() => setTwoColOpen(false)}
        title="Edit Product"
        columns={2}
        headerButtons={[
          { label: 'Cancel', emphasis: 'low', onClick: () => setTwoColOpen(false) },
          { label: 'Save', emphasis: 'high', onClick: () => setTwoColOpen(false) },
        ]}
      >
        <FullScreenModalPanel>
          <SampleFormContent />
        </FullScreenModalPanel>
        <FullScreenModalPanel background="muted" border="left" sticky>
          <SamplePreviewContent />
        </FullScreenModalPanel>
      </FullScreenModal>

      {/* Three Column Demo */}
      <FullScreenModal
        open={threeColOpen}
        onClose={() => setThreeColOpen(false)}
        title="Bulk Edit"
        subtitle="Editing 5 products"
        columns={3}
        headerButtons={[
          { label: 'Cancel', emphasis: 'low', onClick: () => setThreeColOpen(false) },
          { label: 'Save All', emphasis: 'high', onClick: () => setThreeColOpen(false) },
        ]}
      >
        <FullScreenModalPanel>
          <SampleListContent />
        </FullScreenModalPanel>
        <FullScreenModalPanel border="left">
          <SampleFormContent />
        </FullScreenModalPanel>
        <FullScreenModalPanel background="muted" border="left" sticky>
          <SamplePreviewContent />
        </FullScreenModalPanel>
      </FullScreenModal>
    </StyleguideLayout>
  )
}
