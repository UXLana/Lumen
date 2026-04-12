// @ts-nocheck
'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Amount,
  Button,
  Badge,
  Input,
  Stepper,
  type StepItem,
} from '@/components'
import { Select } from '@/components/Select'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadius,
  borderRadiusSemantics,
  breakpoints,
  numericStyles,
} from '@/styles/design-tokens'
import { AmountConfirmDialog } from '@/components'
import { ACCOUNTS } from '../data'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

// ---------------------------------------------------------------------------
// Mock recipients
// ---------------------------------------------------------------------------

const RECIPIENTS = [
  { id: 'r1', name: 'Arrowhead Manufacturing', detail: 'Chase Bank • 8421', type: 'Domestic wire' },
  { id: 'r2', name: 'Wilson Sonsini Goodrich & Rosati', detail: 'SVB • 2187', type: 'Domestic wire' },
  { id: 'r3', name: 'Pacific Coast Freight', detail: 'Wells Fargo • 4720', type: 'ACH' },
  { id: 'r4', name: 'Brightstone Consulting', detail: 'Citi • 9103', type: 'ACH' },
  { id: 'r5', name: 'Harbor Print & Design', detail: 'BofA • 6592', type: 'ACH' },
]

// ---------------------------------------------------------------------------
// Send Money flow
// ---------------------------------------------------------------------------

type Step = 0 | 1 | 2 | 3

export default function SendMoneyPage() {
  const router = useRouter()
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  const [activeStep, setActiveStep] = React.useState<Step>(0)
  const [fromAccountId, setFromAccountId] = React.useState(ACCOUNTS[0].id)
  const [recipientId, setRecipientId] = React.useState<string | null>(null)
  const [amount, setAmount] = React.useState('')
  const [memo, setMemo] = React.useState('')
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [processing, setProcessing] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const fromAccount = ACCOUNTS.find((a) => a.id === fromAccountId) ?? ACCOUNTS[0]
  const recipient = RECIPIENTS.find((r) => r.id === recipientId)
  const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0

  const canContinue = (() => {
    if (activeStep === 0) return !!fromAccountId
    if (activeStep === 1) return !!recipientId
    if (activeStep === 2) return numericAmount > 0 && numericAmount <= fromAccount.balance
    return false
  })()

  const steps: StepItem[] = [
    { id: '1', label: 'From', status: activeStep > 0 ? 'completed' : activeStep === 0 ? 'active' : 'pending' },
    { id: '2', label: 'Recipient', status: activeStep > 1 ? 'completed' : activeStep === 1 ? 'active' : 'pending' },
    { id: '3', label: 'Amount', status: activeStep > 2 ? 'completed' : activeStep === 2 ? 'active' : 'pending' },
    { id: '4', label: 'Review', status: activeStep === 3 ? 'active' : 'pending' },
  ]

  const handleConfirm = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setConfirmOpen(false)
      setSuccess(true)
    }, 1200)
  }

  if (success) {
    return (
      <div style={{ padding: isMobile ? spacing.lg : `${spacing['2xl']} ${spacing['3xl']}` }}>
        <div
          style={{
            maxWidth: '560px',
            margin: `${spacing['4xl']} auto`,
            padding: spacing['3xl'],
            backgroundColor: colors.surface.light,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadiusSemantics.card,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: colors.status.success,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: spacing.lg,
            }}
          >
            ✓
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: fontFamilies.display,
              fontSize: typography.heading.h3.fontSize,
              fontWeight: fontWeights.bold,
              color: colors.text.highEmphasis.onLight,
              letterSpacing: '-0.01em',
            }}
          >
            Transfer initiated
          </h2>
          <p
            style={{
              margin: `${spacing.sm} 0 ${spacing.xl} 0`,
              color: colors.text.lowEmphasis.onLight,
              fontSize: typography.body.md.fontSize,
            }}
          >
            <Amount value={numericAmount} /> to <strong>{recipient?.name}</strong> will arrive within 1 business day.
          </p>
          <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center' }}>
            <Button emphasis="high" onClick={() => router.push('/prototypes/vault')}>
              Back to dashboard
            </Button>
            <Button
              emphasis="low"
              onClick={() => {
                setSuccess(false)
                setActiveStep(0)
                setAmount('')
                setMemo('')
                setRecipientId(null)
              }}
            >
              Send another
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: isMobile ? spacing.lg : `${spacing['2xl']} ${spacing['3xl']}` }}>
      {/* Header */}
      <header style={{ marginBottom: spacing['2xl'], maxWidth: '720px' }}>
        <div
          style={{
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.semibold,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: colors.brand.default,
            marginBottom: spacing['2xs'],
          }}
        >
          Send money
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h2.fontSize,
            fontWeight: fontWeights.bold,
            letterSpacing: '-0.02em',
            color: colors.text.highEmphasis.onLight,
            lineHeight: 1.15,
          }}
        >
          New transfer
        </h1>
      </header>

      {/* Stepper */}
      <div
        style={{
          padding: spacing.lg,
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadiusSemantics.card,
          marginBottom: spacing.lg,
          maxWidth: '720px',
        }}
      >
        <Stepper steps={steps} />
      </div>

      {/* Step content */}
      <div
        style={{
          padding: spacing['2xl'],
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadiusSemantics.card,
          maxWidth: '720px',
        }}
      >
        {activeStep === 0 && (
          <StepFrom
            fromAccountId={fromAccountId}
            setFromAccountId={setFromAccountId}
          />
        )}
        {activeStep === 1 && (
          <StepRecipient
            recipientId={recipientId}
            setRecipientId={setRecipientId}
          />
        )}
        {activeStep === 2 && (
          <StepAmount
            amount={amount}
            setAmount={setAmount}
            memo={memo}
            setMemo={setMemo}
            fromAccount={fromAccount}
          />
        )}
        {activeStep === 3 && recipient && (
          <StepReview
            amount={numericAmount}
            fromAccount={fromAccount}
            recipient={recipient}
            memo={memo}
          />
        )}

        {/* Nav */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: spacing['2xl'],
            paddingTop: spacing.lg,
            borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }}
        >
          <Button
            emphasis="low"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((s) => Math.max(0, s - 1) as Step)}
          >
            Back
          </Button>
          {activeStep < 3 ? (
            <Button
              emphasis="high"
              disabled={!canContinue}
              onClick={() => setActiveStep((s) => (s + 1) as Step)}
            >
              Continue
            </Button>
          ) : (
            <Button emphasis="high" onClick={() => setConfirmOpen(true)}>
              Send transfer
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation dialog */}
      {recipient && (
        <AmountConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
          amount={numericAmount}
          recipient={recipient.name}
          fromAccount={`${fromAccount.name} • ${fromAccount.number}`}
          memo={memo || undefined}
          title="Confirm this transfer"
          description="Once you confirm, the transfer will be sent immediately and cannot be reversed."
          verificationMode="type-amount"
          processing={processing}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 1 — From account
// ---------------------------------------------------------------------------

function StepFrom({
  fromAccountId,
  setFromAccountId,
}: {
  fromAccountId: string
  setFromAccountId: (id: string) => void
}) {
  return (
    <>
      <StepHeading title="From which account?" hint="This is where the money will be deducted." />
      <div
        role="radiogroup"
        aria-label="Source account"
        style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}
      >
        {ACCOUNTS.map((account) => {
          const isActive = account.id === fromAccountId
          return (
            <button
              key={account.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setFromAccountId(account.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: spacing.lg,
                backgroundColor: isActive ? colors.selectedHighlight : colors.surface.light,
                border: `2px solid ${isActive ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
                borderRadius: borderRadius.md,
                cursor: 'pointer',
                textAlign: 'left' as const,
                width: '100%',
                fontFamily: fontFamilies.body,
                transition: 'border-color 150ms ease-out',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: typography.body.md.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: colors.text.highEmphasis.onLight,
                  }}
                >
                  {account.name}
                </div>
                <div
                  style={{
                    fontSize: typography.body.sm.fontSize,
                    color: colors.text.lowEmphasis.onLight,
                    marginTop: 2,
                    ...numericStyles.tabular,
                  }}
                >
                  •{account.number} · Available balance
                </div>
              </div>
              <Amount value={account.balance} size="md" weight="semibold" />
            </button>
          )
        })}
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Step 2 — Recipient
// ---------------------------------------------------------------------------

function StepRecipient({
  recipientId,
  setRecipientId,
}: {
  recipientId: string | null
  setRecipientId: (id: string) => void
}) {
  return (
    <>
      <StepHeading title="Who are you paying?" hint="Select from your saved recipients." />
      <div
        role="radiogroup"
        aria-label="Recipient"
        style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}
      >
        {RECIPIENTS.map((r, idx) => {
          const isActive = r.id === recipientId
          // First recipient is tab-focusable when none is selected yet, otherwise the active one
          const focusable = recipientId == null ? idx === 0 : isActive
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              tabIndex={focusable ? 0 : -1}
              onClick={() => setRecipientId(r.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: spacing.lg,
                backgroundColor: isActive ? colors.selectedHighlight : colors.surface.light,
                border: `2px solid ${isActive ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
                borderRadius: borderRadius.md,
                cursor: 'pointer',
                textAlign: 'left' as const,
                width: '100%',
                fontFamily: fontFamilies.body,
                transition: 'border-color 150ms ease-out',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: typography.body.md.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: colors.text.highEmphasis.onLight,
                  }}
                >
                  {r.name}
                </div>
                <div
                  style={{
                    fontSize: typography.body.sm.fontSize,
                    color: colors.text.lowEmphasis.onLight,
                    marginTop: 2,
                  }}
                >
                  {r.detail}
                </div>
              </div>
              <Badge color="neutral" variant="outlined" size="sm">
                {r.type}
              </Badge>
            </button>
          )
        })}
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Step 3 — Amount & memo
// ---------------------------------------------------------------------------

function StepAmount({
  amount,
  setAmount,
  memo,
  setMemo,
  fromAccount,
}: {
  amount: string
  setAmount: (v: string) => void
  memo: string
  setMemo: (v: string) => void
  fromAccount: typeof ACCOUNTS[number]
}) {
  const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0
  const exceeds = numericAmount > fromAccount.balance

  return (
    <>
      <StepHeading title="How much are you sending?" hint={`Available balance: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(fromAccount.balance)}`} />

      <div style={{ marginBottom: spacing.xl }}>
        <label
          htmlFor="send-amount"
          style={{
            display: 'block',
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.text.highEmphasis.onLight,
            marginBottom: spacing['2xs'],
          }}
        >
          Amount (USD)
        </label>
        <div style={{ position: 'relative' }}>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: spacing.md,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: typography.heading.h4.fontSize,
              fontWeight: fontWeights.semibold,
              color: colors.text.lowEmphasis.onLight,
              fontFamily: fontFamilies.display,
            }}
          >
            $
          </span>
          <input
            id="send-amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
            placeholder="0.00"
            aria-invalid={exceeds}
            aria-describedby={exceeds ? 'send-amount-error' : undefined}
            style={{
              width: '100%',
              padding: `${spacing.md} ${spacing.md} ${spacing.md} 36px`,
              fontSize: typography.heading.h4.fontSize,
              fontWeight: fontWeights.semibold,
              fontFamily: fontFamilies.display,
              color: colors.text.highEmphasis.onLight,
              backgroundColor: colors.surface.light,
              border: `2px solid ${exceeds ? colors.status.important : colors.border.midEmphasis.onLight}`,
              borderRadius: borderRadius.md,
              outline: 'none',
              ...numericStyles.tabular,
              boxSizing: 'border-box',
            }}
          />
        </div>
        {exceeds && (
          <div
            id="send-amount-error"
            role="alert"
            style={{
              marginTop: spacing.xs,
              fontSize: typography.body.sm.fontSize,
              color: colors.status.important,
            }}
          >
            Amount exceeds available balance.
          </div>
        )}
      </div>

      <Input
        label="Memo (optional)"
        placeholder="What is this for?"
        value={memo}
        onChange={(v) => setMemo(v)}
        fullWidth
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Step 4 — Review
// ---------------------------------------------------------------------------

function StepReview({
  amount,
  fromAccount,
  recipient,
  memo,
}: {
  amount: number
  fromAccount: typeof ACCOUNTS[number]
  recipient: typeof RECIPIENTS[number]
  memo: string
}) {
  return (
    <>
      <StepHeading title="Review your transfer" hint="One last check before sending." />
      <div style={{ textAlign: 'center', padding: `${spacing.lg} 0`, marginBottom: spacing.lg }}>
        <div
          style={{
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.semibold,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: colors.text.lowEmphasis.onLight,
            marginBottom: spacing.xs,
          }}
        >
          Transferring
        </div>
        <Amount value={amount} size="2xl" weight="bold" />
      </div>
      <div
        style={{
          backgroundColor: colors.surface.lightDarker,
          padding: spacing.lg,
          borderRadius: borderRadius.md,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        }}
      >
        <ReviewRow label="From" value={`${fromAccount.name} • ${fromAccount.number}`} />
        <ReviewRow label="To" value={recipient.name} />
        <ReviewRow label="Method" value={recipient.type} />
        {memo && <ReviewRow label="Memo" value={memo} />}
        <ReviewRow label="Arrives" value="Within 1 business day" />
      </div>
    </>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: `${spacing.sm} 0`,
        borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
        fontFamily: fontFamilies.body,
      }}
    >
      <span
        style={{
          fontSize: typography.label.sm.fontSize,
          fontWeight: fontWeights.medium,
          color: colors.text.lowEmphasis.onLight,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: typography.body.sm.fontSize,
          fontWeight: fontWeights.medium,
          color: colors.text.highEmphasis.onLight,
          textAlign: 'right',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function StepHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <div style={{ marginBottom: spacing.lg }}>
      <h2
        style={{
          margin: 0,
          fontFamily: fontFamilies.display,
          fontSize: typography.heading.h4.fontSize,
          fontWeight: fontWeights.semibold,
          color: colors.text.highEmphasis.onLight,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h2>
      <p
        style={{
          margin: `${spacing['2xs']} 0 0 0`,
          fontSize: typography.body.sm.fontSize,
          color: colors.text.lowEmphasis.onLight,
        }}
      >
        {hint}
      </p>
    </div>
  )
}
