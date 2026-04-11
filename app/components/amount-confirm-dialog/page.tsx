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
import { AmountConfirmDialog, Button } from '@/components'
import type { VerificationMode } from '@/components'
import { colors, typography, spacing } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// DOC DATA (Documentation tab)
// =============================================================================

const amountConfirmDialogDocData: ComponentDocData = {
  displayName: 'AmountConfirmDialog',
  importPath: '@/components',
  importStatement: `import { AmountConfirmDialog } from '@/components'
import type { AmountConfirmDialogProps, VerificationMode } from '@/components'`,
  description:
    'High-stakes confirmation dialog for money movement and other irreversible actions. Requires the user to prove intent by typing the amount, typing a safety word, or checking a box before the confirm button unlocks.',
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Whether the dialog is open.' },
    { name: 'onClose', type: '() => void', required: true, description: 'Called when the dialog is dismissed.' },
    { name: 'onConfirm', type: '() => void', required: true, description: 'Called when the user successfully confirms.' },
    { name: 'amount', type: 'number', required: true, description: 'The amount being confirmed — shown in the summary block.' },
    { name: 'recipient', type: 'string', required: true, description: 'Recipient or action target shown in the summary.' },
    { name: 'fromAccount', type: 'string', required: true, description: 'Source account / context shown in the summary.' },
    { name: 'currency', type: 'string', default: "'USD'", description: 'ISO currency code for formatting.' },
    { name: 'memo', type: 'string', description: 'Optional memo / reference shown in the summary.' },
    { name: 'verificationMode', type: "'type-amount' | 'type-word' | 'checkbox'", default: "'type-amount'", description: 'How the user must prove intent.' },
    { name: 'verificationWord', type: 'string', default: "'CONFIRM'", description: 'For `type-word` mode: the exact word the user must type.' },
    { name: 'verificationLabel', type: 'string', description: 'Override the verification field label.' },
    { name: 'title', type: 'string', default: "'Confirm transfer'", description: 'Dialog title.' },
    { name: 'description', type: 'string', description: 'Short explanatory text shown above the summary.' },
    { name: 'destructive', type: 'boolean', default: 'false', description: 'Make the confirm button destructive (red).' },
    { name: 'processing', type: 'boolean', default: 'false', description: 'Disable confirm and show a "Processing…" label.' },
    { name: 'error', type: 'string', description: 'Error message shown above the buttons.' },
    { name: 'confirmLabel', type: 'string', default: "'Confirm transfer'", description: 'Override the confirm button label.' },
    { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: 'Override the cancel button label.' },
    { name: 'dismissOnScrimClick', type: 'boolean', description: 'Whether clicking the scrim dismisses the dialog. Defaults to `false` for type-amount/type-word modes, `true` for checkbox mode.' },
  ],
  typeDefinitions: [
    {
      name: 'VerificationMode',
      definition: "type VerificationMode = 'type-amount' | 'type-word' | 'checkbox'",
    },
  ],
  accessibility: [
    { feature: 'Dialog semantics', description: '`role="dialog"` + `aria-modal="true"` + `aria-labelledby` pointing at the title + `aria-describedby` when a description is provided.' },
    { feature: 'Focus trap', description: 'Tab cycles between first and last focusable elements. Shift+Tab wraps backwards. Users cannot tab out to content behind the scrim.' },
    { feature: 'Focus restore', description: 'Captures `document.activeElement` on open and restores focus to it when the dialog closes.' },
    { feature: 'Escape to close', description: 'Listens for Escape key globally while open.' },
    { feature: 'Live-region status', description: 'Verification state ("Verified. You can now confirm." / "Value does not match yet.") is announced via `aria-live="polite"`.' },
    { feature: 'aria-busy during processing', description: 'The dialog wrapper sets `aria-busy={processing}` so AT announces async state changes.' },
    { feature: 'Safe scrim default', description: 'For `type-amount` and `type-word` modes, scrim click does NOT dismiss — prevents accidental dismissal of money-movement confirmations. Opt-in via `dismissOnScrimClick`.' },
    { feature: '44×44 touch targets', description: 'Checkbox label has generous padding so the effective click target exceeds WCAG 2.2 minimums.' },
  ],
  tokens: [
    { token: 'colors.surface.light', value: 'Surface', usage: 'Dialog background' },
    { token: 'colors.surface.lightDarker', value: 'Surface darker', usage: 'Summary block + error state background' },
    { token: 'colors.scrim', value: 'Scrim', usage: 'Backdrop behind dialog' },
    { token: 'colors.status.important', value: 'Error red', usage: 'Error state border + text' },
    { token: 'borderRadiusSemantics.modal', value: 'Modal radius', usage: 'Dialog corner radius' },
  ],
  relatedComponents: [
    { name: 'Amount', href: '/components/amount' },
    { name: 'Modal', href: '/components/full-screen-modal' },
    { name: 'Button', href: '/components/button' },
    { name: 'Input', href: '/components/input' },
  ],
  notes: [
    'Always use `verificationMode="type-amount"` for actual money movement. `type-word` is for destructive-but-not-financial actions (deletion flows). `checkbox` is for lower-stakes acknowledgments.',
    'Combine with the `destructive` prop for irreversible actions — paints the confirm button red and the amount in the debit color.',
    'Pass `error` when the backend rejects a confirmed action — the user can correct and retry without closing the dialog.',
    '⚠️ Needs design review before formal documentation release. API is stable but has one real-world use case (Vault send-money flow).',
  ],
  whenToUse: [
    'Money movement — transfers, wires, ACH, payroll runs.',
    'Irreversible data operations — bulk delete, archive, permanent removal.',
    'Legal/compliance acknowledgments where the user must actively confirm they understand.',
  ],
  whenNotToUse: [
    { scenario: 'Generic yes/no confirmation', instead: 'ConfirmDialog — lighter-weight, no verification friction' },
    { scenario: 'Async notifications or status messages', instead: 'Toast or Banner' },
    { scenario: 'Multi-step workflows', instead: 'TaskModal — multi-step flow with stepper navigation' },
  ],
  usageExamples: [
    {
      title: 'Type-amount verification (default — money movement)',
      description: 'The safest mode. User must type the exact amount (commas optional) before the confirm button unlocks.',
      isDefault: true,
      code: `<AmountConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={handleTransfer}
  amount={12487.30}
  recipient="Acme Supplier, Inc."
  fromAccount="Operating • 1234"
  memo="Q2 retainer"
  title="Confirm this transfer"
  description="Once you confirm, the transfer will be sent immediately and cannot be reversed."
/>`,
    },
    {
      title: 'Type-word verification (destructive actions)',
      description: 'For destructive-but-not-financial actions like bulk deletes. User must type a safety word.',
      code: `<AmountConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={handleDelete}
  amount={0}
  recipient="47 archived records"
  fromAccount="Workspace trash"
  verificationMode="type-word"
  verificationWord="DELETE"
  title="Permanently delete records"
  description="This cannot be undone. Type DELETE to confirm."
  destructive
  confirmLabel="Delete permanently"
/>`,
    },
    {
      title: 'Checkbox verification (lower-stakes)',
      description: 'For acknowledgments where typing friction would feel excessive. Scrim click also dismisses in this mode.',
      code: `<AmountConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={handleAgree}
  amount={0}
  recipient="Terms of Service v2.0"
  fromAccount="Your account"
  verificationMode="checkbox"
  title="Agree to updated terms"
  description="You must agree to the updated terms before continuing."
/>`,
    },
    {
      title: 'Error recovery',
      description: 'When the backend rejects a confirmed action, pass an `error` prop and leave the dialog open. User can read the error and retry.',
      code: `<AmountConfirmDialog
  open={open}
  onConfirm={handleRetry}
  amount={12487.30}
  recipient="Acme Supplier, Inc."
  fromAccount="Operating • 1234"
  error="Insufficient funds. Available balance: $10,240.00"
  processing={isSubmitting}
/>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function AmountConfirmDialogPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoMode, setDemoMode] = useState<VerificationMode>('type-amount')
  const [demoDestructive, setDemoDestructive] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)

  // Individual example triggers
  const [exampleOpen, setExampleOpen] = useState<null | 'type-amount' | 'type-word' | 'checkbox' | 'destructive' | 'error' | 'processing'>(null)

  const closeAll = () => setExampleOpen(null)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Amount Confirm Dialog"
      description="High-stakes confirmation for money movement and irreversible actions. Three verification modes: type the amount, type a word, or check a box."
      tagline="Don't ship what you don't mean to."
      activeId="amount-confirm-dialog"
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
              <CodeBlock>{`import { AmountConfirmDialog } from '@/components'
import { useState } from 'react'

const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Send transfer</Button>

<AmountConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={() => {
    // submit the transfer
    setOpen(false)
  }}
  amount={12487.30}
  recipient="Acme Supplier, Inc."
  fromAccount="Operating • 1234"
/>`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Pick a verification mode and click the trigger to open the dialog. Try typing the wrong value to see the confirm button stay disabled — a screen reader would also hear a live status update.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                <div>
                  <Playground
                    preview={
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.md, padding: spacing['2xl'] }}>
                        <Button emphasis="high" destructive={demoDestructive} onClick={() => setDemoOpen(true)}>
                          {demoDestructive ? 'Delete permanently' : 'Send transfer'}
                        </Button>
                        <div style={{ fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
                          Click to open the dialog
                        </div>
                      </div>
                    }
                    code={`<AmountConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={handleConfirm}
  amount={12487.30}
  recipient="Acme Supplier, Inc."
  fromAccount="Operating • 1234"${demoMode !== 'type-amount' ? `\n  verificationMode="${demoMode}"` : ''}${demoMode === 'type-word' ? `\n  verificationWord="DELETE"` : ''}${demoDestructive ? '\n  destructive' : ''}
/>`}
                    previewPadding={spacing.xs}
                  />
                </div>

                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>Verification mode</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['type-amount', 'type-word', 'checkbox'] as const).map((m) => (
                          <PillButton key={m} onClick={() => setDemoMode(m)} isActive={demoMode === m}>
                            {m}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>Destructive</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <PillButton onClick={() => setDemoDestructive(false)} isActive={!demoDestructive}>Off</PillButton>
                        <PillButton onClick={() => setDemoDestructive(true)} isActive={demoDestructive}>On</PillButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <AmountConfirmDialog
              open={demoOpen}
              onClose={() => setDemoOpen(false)}
              onConfirm={() => {
                setDemoOpen(false)
              }}
              amount={12487.30}
              recipient={demoDestructive ? '47 archived records' : 'Acme Supplier, Inc.'}
              fromAccount={demoDestructive ? 'Workspace trash' : 'Operating • 1234'}
              memo={demoDestructive ? undefined : 'Q2 retainer'}
              verificationMode={demoMode}
              verificationWord="DELETE"
              destructive={demoDestructive}
              title={demoDestructive ? 'Permanently delete records' : 'Confirm this transfer'}
              description={
                demoDestructive
                  ? 'This action cannot be undone. Type DELETE to confirm.'
                  : 'Once you confirm, the transfer will be sent immediately and cannot be reversed.'
              }
              confirmLabel={demoDestructive ? 'Delete permanently' : 'Confirm transfer'}
            />
          </section>

          {/* ========== EXAMPLES ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Examples</h2>
            <p style={sharedStyles.sectionDescription}>
              Each button below opens a preconfigured example of the dialog.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: spacing.md }}>
              <ExampleCard
                title="Type-amount (default)"
                description="The safest mode for money movement. User types the exact amount."
                buttonLabel="Send $12,487.30"
                onOpen={() => setExampleOpen('type-amount')}
              />
              <ExampleCard
                title="Type-word"
                description="For destructive-but-not-financial actions. User types a safety word."
                buttonLabel="Delete records"
                onOpen={() => setExampleOpen('type-word')}
              />
              <ExampleCard
                title="Checkbox"
                description="Lower-friction acknowledgment. Scrim click also dismisses."
                buttonLabel="Agree to terms"
                onOpen={() => setExampleOpen('checkbox')}
              />
              <ExampleCard
                title="Destructive variant"
                description="Red confirm button + debit-colored amount."
                buttonLabel="Cancel subscription"
                onOpen={() => setExampleOpen('destructive')}
              />
              <ExampleCard
                title="Error state"
                description="Backend rejected the action — error stays visible for recovery."
                buttonLabel="Retry transfer"
                onOpen={() => setExampleOpen('error')}
              />
              <ExampleCard
                title="Processing state"
                description="Confirm is disabled and labeled 'Processing…'"
                buttonLabel="Sending..."
                onOpen={() => setExampleOpen('processing')}
              />
            </div>
          </section>

          {/* Example dialogs */}
          <AmountConfirmDialog
            open={exampleOpen === 'type-amount'}
            onClose={closeAll}
            onConfirm={closeAll}
            amount={12487.3}
            recipient="Acme Supplier, Inc."
            fromAccount="Operating • 1234"
            memo="Q2 retainer"
            title="Confirm this transfer"
            description="Once you confirm, the transfer will be sent immediately and cannot be reversed."
          />

          <AmountConfirmDialog
            open={exampleOpen === 'type-word'}
            onClose={closeAll}
            onConfirm={closeAll}
            amount={0}
            recipient="47 archived records"
            fromAccount="Workspace trash"
            verificationMode="type-word"
            verificationWord="DELETE"
            title="Permanently delete records"
            description="This action cannot be undone. Type DELETE to confirm."
            destructive
            confirmLabel="Delete permanently"
          />

          <AmountConfirmDialog
            open={exampleOpen === 'checkbox'}
            onClose={closeAll}
            onConfirm={closeAll}
            amount={0}
            recipient="Terms of Service v2.0"
            fromAccount="Your account"
            verificationMode="checkbox"
            title="Agree to updated terms"
            description="You must agree to the updated terms before continuing."
            confirmLabel="I agree"
          />

          <AmountConfirmDialog
            open={exampleOpen === 'destructive'}
            onClose={closeAll}
            onConfirm={closeAll}
            amount={240.0}
            recipient="Annual subscription"
            fromAccount="Visa ending 4321"
            verificationMode="type-word"
            verificationWord="CANCEL"
            title="Cancel your subscription"
            description="You'll lose access at the end of the current billing period. Type CANCEL to confirm."
            destructive
            confirmLabel="Cancel subscription"
          />

          <AmountConfirmDialog
            open={exampleOpen === 'error'}
            onClose={closeAll}
            onConfirm={closeAll}
            amount={12487.3}
            recipient="Acme Supplier, Inc."
            fromAccount="Operating • 1234"
            memo="Q2 retainer"
            title="Confirm this transfer"
            description="Once you confirm, the transfer will be sent immediately and cannot be reversed."
            error="Insufficient funds. Available balance: $10,240.00"
          />

          <AmountConfirmDialog
            open={exampleOpen === 'processing'}
            onClose={closeAll}
            onConfirm={closeAll}
            amount={12487.3}
            recipient="Acme Supplier, Inc."
            fromAccount="Operating • 1234"
            title="Confirm this transfer"
            processing
          />

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens">
              <div style={sharedStyles.card}>
                <SpecTable
                  headers={['Element', 'Token', 'Usage']}
                  rows={[
                    ['Dialog background', <code key="s1">colors.surface.light</code>, 'Main dialog panel'],
                    ['Summary block', <code key="s2">colors.surface.lightDarker</code>, 'Inner summary container'],
                    ['Scrim', <code key="s3">colors.scrim</code>, 'Semi-transparent backdrop'],
                    ['Error state', <code key="s4">colors.status.important</code>, 'Border + text color when error is shown'],
                    ['Corner radius', <code key="s5">borderRadiusSemantics.modal</code>, 'Dialog corners'],
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
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>{`import { AmountConfirmDialog } from '@/components'
import type { AmountConfirmDialogProps, VerificationMode } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic transfer confirmation</h3>
              <CodeBlock>{`const [open, setOpen] = useState(false)
const [processing, setProcessing] = useState(false)

const handleConfirm = async () => {
  setProcessing(true)
  try {
    await submitTransfer()
    setOpen(false)
  } finally {
    setProcessing(false)
  }
}

<AmountConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={handleConfirm}
  amount={12487.30}
  recipient="Acme Supplier, Inc."
  fromAccount="Operating • 1234"
  memo="Q2 retainer"
  processing={processing}
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With error recovery</h3>
              <CodeBlock>{`const [error, setError] = useState<string>()

const handleConfirm = async () => {
  setError(undefined)
  try {
    await submitTransfer()
  } catch (e) {
    setError(e.message)
  }
}

<AmountConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={handleConfirm}
  amount={12487.30}
  recipient="Acme Supplier, Inc."
  fromAccount="Operating • 1234"
  error={error}
/>`}</CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Verification modes</h2>
            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Mode', 'Friction', 'Use for', 'Scrim dismissable']}
                rows={[
                  ['type-amount', 'Highest', 'Money movement — transfers, wires, payroll', 'No (safe default)'],
                  ['type-word', 'High', 'Destructive deletes, account cancellation', 'No (safe default)'],
                  ['checkbox', 'Low', 'ToS acknowledgment, lower-stakes confirmations', 'Yes'],
                ]}
              />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <div style={sharedStyles.card}>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Full focus trap — Tab wraps between first and last focusable elements</li>
                <li>Focus is restored to the opener when the dialog closes</li>
                <li>Escape key closes the dialog</li>
                <li>On open, focus lands on the verification input (not the confirm button — prevents accidental Enter-to-confirm)</li>
                <li>Verification state is announced via a visually-hidden <code>aria-live=&quot;polite&quot;</code> region</li>
                <li><code>aria-busy</code> is set on the dialog during processing</li>
                <li>Scrim click is disabled for <code>type-amount</code>/<code>type-word</code> modes — prevents accidental dismissal</li>
                <li>Checkbox target exceeds WCAG 2.2 minimum target size (44×44)</li>
                <li>Summary uses <code>role=&quot;dialog&quot;</code> + <code>aria-modal=&quot;true&quot;</code> + <code>aria-labelledby</code> + <code>aria-describedby</code></li>
              </ul>
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && <ComponentDocumentation data={amountConfirmDialogDocData} />}
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
