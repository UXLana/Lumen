'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  SpecTable,
  Playground,
  PillButton,
  CollapsibleSection,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import { ConfirmDialog, Button } from '@/components'
import type { ConfirmDialogVariant } from '@/components'
import { colors, typography, spacing } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// DOC DATA (Documentation tab)
// =============================================================================

const confirmDialogDocData: ComponentDocData = {
  displayName: 'ConfirmDialog',
  importPath: '@/components',
  importStatement: `import { ConfirmDialog } from '@/components'
import type { ConfirmDialogProps, ConfirmDialogVariant } from '@/components'`,
  description:
    'Generic yes/no confirmation modal with three semantic variants: warning, destructive, and info. Use for standard confirmations — delete, archive, deactivate, "are you sure" moments. Built on FullScreenModal (floating variant) for consistent chrome.',
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Whether the dialog is open.' },
    { name: 'title', type: 'string', required: true, description: 'Dialog title shown in the header.' },
    { name: 'description', type: 'string', required: true, description: 'Body text explaining what the user is confirming.' },
    { name: 'onConfirm', type: '() => void', required: true, description: 'Called when the user clicks Confirm.' },
    { name: 'onCancel', type: '() => void', required: true, description: 'Called when the user clicks Cancel, Escape, backdrop, or close X.' },
    { name: 'variant', type: "'warning' | 'destructive' | 'info'", default: "'warning'", description: 'Semantic variant — sets icon, color, and confirm-button styling.' },
    { name: 'confirmLabel', type: 'string', default: "'Confirm'", description: 'Label for the confirm button.' },
    { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: 'Label for the cancel button.' },
    { name: 'icon', type: 'ReactNode', description: 'Optional custom icon to override the variant default.' },
  ],
  typeDefinitions: [
    {
      name: 'ConfirmDialogVariant',
      definition: "type ConfirmDialogVariant = 'warning' | 'destructive' | 'info'",
    },
  ],
  accessibility: [
    { feature: 'Dialog semantics', description: '`role="dialog"` + `aria-modal="true"` inherited from FullScreenModal.' },
    { feature: 'Focus trap', description: 'Tab cycles between Cancel and Confirm buttons. Can\'t escape to page content behind.' },
    { feature: 'Focus restore', description: 'Focus returns to the element that opened the dialog on close.' },
    { feature: 'Escape to close', description: 'Escape key fires `onCancel`.' },
    { feature: 'Backdrop dismiss', description: 'Clicking outside the dialog fires `onCancel`.' },
    { feature: 'Close button', description: 'X button in the header provides another visual exit path.' },
    { feature: 'Body scroll lock', description: 'Page behind the dialog cannot scroll while open.' },
  ],
  tokens: [
    { token: 'colors.status.warning', value: 'Warning amber', usage: 'Warning variant icon color' },
    { token: 'colors.status.important', value: 'Error red', usage: 'Destructive variant icon color + button' },
    { token: 'colors.status.info', value: 'Info blue', usage: 'Info variant icon color' },
    { token: 'colors.iconBg.*', value: 'Tinted backgrounds', usage: 'Icon circle fill per variant' },
  ],
  relatedComponents: [
    { name: 'Amount Confirm Dialog', href: '/components/amount-confirm-dialog' },
    { name: 'Modal', href: '/components/full-screen-modal' },
    { name: 'Button', href: '/components/button' },
  ],
  notes: [
    'Use `variant="warning"` (default) for cautionary but reversible actions.',
    'Use `variant="destructive"` for irreversible actions — paints the confirm button red.',
    'Use `variant="info"` for informational confirmations that aren\'t dangerous.',
    'For high-stakes money movement, use AmountConfirmDialog instead — it requires typed verification.',
  ],
  whenToUse: [
    'Delete, archive, deactivate, or remove flows where the user should pause and confirm.',
    'Any action that changes state and can\'t be easily undone.',
    'Navigating away with unsaved changes ("Discard changes?").',
  ],
  whenNotToUse: [
    { scenario: 'Money transfers, wire confirmations, financial transactions', instead: 'AmountConfirmDialog — requires typed-amount verification for safety' },
    { scenario: 'Multi-step workflows or form wizards', instead: 'TaskModal — multi-step flow with stepper navigation' },
    { scenario: 'Non-blocking notifications', instead: 'Toast — temporary, auto-dismissing' },
  ],
  usageExamples: [
    {
      title: 'Destructive delete confirmation',
      description: 'Red confirm button + error icon. The most common pattern.',
      isDefault: true,
      code: `<ConfirmDialog
  open={showConfirm}
  title="Delete product?"
  description="This action cannot be undone. The product and all its variants will be permanently removed."
  variant="destructive"
  confirmLabel="Delete"
  onConfirm={handleDelete}
  onCancel={() => setShowConfirm(false)}
/>`,
    },
    {
      title: 'Warning confirmation',
      description: 'Amber icon, standard confirm. For cautionary but non-destructive actions.',
      code: `<ConfirmDialog
  open={open}
  title="Deactivate user?"
  description="The user will lose access immediately. You can reactivate them later."
  variant="warning"
  confirmLabel="Deactivate"
  onConfirm={handleDeactivate}
  onCancel={() => setOpen(false)}
/>`,
    },
    {
      title: 'Info confirmation',
      description: 'Blue icon. For informational prompts that need explicit agreement.',
      code: `<ConfirmDialog
  open={open}
  title="Switch workspace?"
  description="Your draft changes will be saved automatically."
  variant="info"
  confirmLabel="Switch"
  onConfirm={handleSwitch}
  onCancel={() => setOpen(false)}
/>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function ConfirmDialogPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoVariant, setDemoVariant] = useState<ConfirmDialogVariant>('warning')
  const [demoOpen, setDemoOpen] = useState(false)

  // Individual example triggers
  const [exampleOpen, setExampleOpen] = useState<null | 'warning' | 'destructive' | 'info'>(null)
  const closeAll = () => setExampleOpen(null)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Confirm Dialog"
      description="Generic yes/no confirmation with semantic variants for warning, destructive, and informational actions. Built on FullScreenModal for consistent modal chrome."
      tagline="Pause before the point of no return."
      activeId="confirm-dialog"
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
            <div style={{ maxWidth: '700px' }}>
              <CodeBlock>{`import { ConfirmDialog } from '@/components'
import { useState } from 'react'

const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Delete product</Button>

<ConfirmDialog
  open={open}
  title="Delete product?"
  description="This action cannot be undone."
  variant="destructive"
  confirmLabel="Delete"
  onConfirm={() => {
    handleDelete()
    setOpen(false)
  }}
  onCancel={() => setOpen(false)}
/>`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Pick a variant and click the trigger to open the dialog. Notice how the icon and confirm button change to match the semantic intent.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                <div>
                  <Playground
                    preview={
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.md, padding: spacing['2xl'] }}>
                        <Button
                          emphasis="high"
                          destructive={demoVariant === 'destructive'}
                          onClick={() => setDemoOpen(true)}
                        >
                          {demoVariant === 'destructive'
                            ? 'Delete product'
                            : demoVariant === 'warning'
                              ? 'Deactivate user'
                              : 'Switch workspace'}
                        </Button>
                        <div style={{ fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
                          Click to open the dialog
                        </div>
                      </div>
                    }
                    code={`<ConfirmDialog
  open={open}
  title="${demoVariant === 'destructive' ? 'Delete product?' : demoVariant === 'warning' ? 'Deactivate user?' : 'Switch workspace?'}"
  description="..."
  variant="${demoVariant}"
  onConfirm={handleAction}
  onCancel={() => setOpen(false)}
/>`}
                    previewPadding={spacing.xs}
                  />
                </div>

                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>Variant</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['warning', 'destructive', 'info'] as const).map((v) => (
                          <PillButton key={v} onClick={() => setDemoVariant(v)} isActive={demoVariant === v}>
                            {v}
                          </PillButton>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ConfirmDialog
              open={demoOpen}
              title={
                demoVariant === 'destructive'
                  ? 'Delete product?'
                  : demoVariant === 'warning'
                    ? 'Deactivate user?'
                    : 'Switch workspace?'
              }
              description={
                demoVariant === 'destructive'
                  ? 'This action cannot be undone. The product and all its variants will be permanently removed.'
                  : demoVariant === 'warning'
                    ? 'The user will lose access immediately. You can reactivate them later.'
                    : 'Your draft changes will be saved automatically.'
              }
              variant={demoVariant}
              confirmLabel={
                demoVariant === 'destructive'
                  ? 'Delete'
                  : demoVariant === 'warning'
                    ? 'Deactivate'
                    : 'Switch'
              }
              onConfirm={() => setDemoOpen(false)}
              onCancel={() => setDemoOpen(false)}
            />
          </section>

          {/* ========== EXAMPLES ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Examples</h2>
            <p style={sharedStyles.sectionDescription}>
              Each card below opens a preconfigured example.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: spacing.md }}>
              <ExampleCard
                title="Warning"
                description="Cautionary but reversible. Default variant."
                buttonLabel="Deactivate user"
                onOpen={() => setExampleOpen('warning')}
              />
              <ExampleCard
                title="Destructive"
                description="Irreversible action. Red confirm button."
                buttonLabel="Delete product"
                onOpen={() => setExampleOpen('destructive')}
              />
              <ExampleCard
                title="Info"
                description="Informational. Blue icon, standard confirm."
                buttonLabel="Switch workspace"
                onOpen={() => setExampleOpen('info')}
              />
            </div>
          </section>

          {/* Example dialogs */}
          <ConfirmDialog
            open={exampleOpen === 'warning'}
            title="Deactivate user?"
            description="The user will lose access immediately. You can reactivate them later from the team settings page."
            variant="warning"
            confirmLabel="Deactivate"
            onConfirm={closeAll}
            onCancel={closeAll}
          />

          <ConfirmDialog
            open={exampleOpen === 'destructive'}
            title="Delete product?"
            description="This action cannot be undone. The product, all its variants, and associated data will be permanently removed from the catalog."
            variant="destructive"
            confirmLabel="Delete permanently"
            onConfirm={closeAll}
            onCancel={closeAll}
          />

          <ConfirmDialog
            open={exampleOpen === 'info'}
            title="Switch workspace?"
            description="Your draft changes will be saved automatically. You can return to this workspace at any time."
            variant="info"
            confirmLabel="Switch"
            onConfirm={closeAll}
            onCancel={closeAll}
          />
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>{`import { ConfirmDialog } from '@/components'
import type { ConfirmDialogProps, ConfirmDialogVariant } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic destructive confirmation</h3>
              <CodeBlock>{`const [open, setOpen] = useState(false)

<ConfirmDialog
  open={open}
  title="Delete product?"
  description="This action cannot be undone."
  variant="destructive"
  confirmLabel="Delete"
  onConfirm={() => {
    handleDelete()
    setOpen(false)
  }}
  onCancel={() => setOpen(false)}
/>`}</CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>
            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="o">open</code>, <code key="ot">boolean</code>, <code key="od">required</code>, 'Controls visibility'],
                  [<code key="t">title</code>, <code key="tt">string</code>, <code key="td">required</code>, 'Dialog title (shown in header)'],
                  [<code key="d">description</code>, <code key="dt">string</code>, <code key="dd">required</code>, 'Body text explaining the action'],
                  [<code key="v">variant</code>, <code key="vt">{"'warning' | 'destructive' | 'info'"}</code>, <code key="vd">{"'warning'"}</code>, 'Sets icon, color, and button styling'],
                  [<code key="cl">confirmLabel</code>, <code key="clt">string</code>, <code key="cld">{"'Confirm'"}</code>, 'Confirm button text'],
                  [<code key="ca">cancelLabel</code>, <code key="cat">string</code>, <code key="cad">{"'Cancel'"}</code>, 'Cancel button text'],
                  [<code key="oc">onConfirm</code>, <code key="oct">{'() => void'}</code>, <code key="ocd">required</code>, 'Fires on confirm click'],
                  [<code key="on">onCancel</code>, <code key="ont">{'() => void'}</code>, <code key="ond">required</code>, 'Fires on cancel, escape, backdrop, or close-X'],
                  [<code key="i">icon</code>, <code key="it">ReactNode</code>, <code key="id">—</code>, 'Custom icon override'],
                ]}
              />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Variants</h2>
            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Variant', 'Icon', 'Confirm button', 'Use for']}
                rows={[
                  ['warning', 'Amber triangle', 'Standard (brand color)', 'Cautionary but reversible (deactivate, archive)'],
                  ['destructive', 'Red circle-X', 'Destructive (red)', 'Irreversible (delete, remove permanently)'],
                  ['info', 'Blue circle-i', 'Standard (brand color)', 'Informational (switch context, acknowledge)'],
                ]}
              />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <div style={sharedStyles.card}>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Built on FullScreenModal — inherits <code>role=&quot;dialog&quot;</code>, <code>aria-modal</code>, escape-to-close, backdrop dismiss</li>
                <li>Focus trap keeps Tab cycling between Cancel and Confirm</li>
                <li>Focus returns to the opener when the dialog closes</li>
                <li>Close X in the header provides an always-visible exit</li>
                <li>Body scroll lock prevents page scrolling behind the dialog</li>
                <li>Cancel button is never disabled — user can always exit</li>
              </ul>
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && <ComponentDocumentation data={confirmDialogDocData} />}
    </StyleguideLayout>
  )
}

// =============================================================================
// EXAMPLE CARD
// =============================================================================

function ExampleCard({
  title,
  description,
  buttonLabel,
  onOpen,
}: {
  title: string
  description: string
  buttonLabel: string
  onOpen: () => void
}) {
  return (
    <div style={sharedStyles.card}>
      <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>{title}</h3>
      <p style={{ fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight, marginTop: 0, marginBottom: spacing.lg }}>
        {description}
      </p>
      <Button emphasis="mid" onClick={onOpen}>
        {buttonLabel}
      </Button>
    </div>
  )
}
