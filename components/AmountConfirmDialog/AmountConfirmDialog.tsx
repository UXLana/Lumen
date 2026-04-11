'use client'

/**
 * AmountConfirmDialog — High-stakes confirmation for money movement or
 * other irreversible actions.
 *
 * Requires the user to prove intent by typing the amount (or a word) back,
 * or by checking a box, before the confirm button unlocks.
 *
 * Follows the same visual pattern as ConfirmDialog:
 * - Title (with optional description below)
 * - No close (X) button — Cancel serves as the dismiss action
 * - No divider above action buttons
 * - Dialog grows to fit content, scrolls internally when it would exceed
 *   viewport minus `spacing.md` margin on each edge
 *
 * @see components/ConfirmDialog — generic yes/no confirmation
 */

import React from 'react'
import { Button, Input, Amount, Banner } from '@/components'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadius,
  shadows,
  zIndex,
} from '@/styles/design-tokens'
import { useColors } from '@/styles/themes'

export type VerificationMode = 'type-amount' | 'type-word' | 'checkbox'

export interface AmountConfirmDialogProps {
  /** Whether the dialog is open. */
  open: boolean
  /** Called when the dialog is dismissed (via Cancel, Escape, or scrim click). */
  onClose: () => void
  /** Called when the user successfully confirms the action. */
  onConfirm: () => void

  /** The amount being confirmed. */
  amount: number
  /** ISO 4217 currency code. Defaults to USD. */
  currency?: string
  /** The recipient (or action target) shown in the summary. */
  recipient: string
  /** The source account / context shown in the summary. */
  fromAccount: string
  /** Optional memo / reference shown in the summary. */
  memo?: string

  /** Verification mode. Defaults to "type-amount". */
  verificationMode?: VerificationMode
  /** For "type-word" mode: the exact word the user must type (case-insensitive). */
  verificationWord?: string
  /** Override the verification label. */
  verificationLabel?: string

  /** Make the confirm button destructive (red). Defaults to false. */
  destructive?: boolean
  /** Dialog title. Defaults to "Confirm transfer". */
  title?: string
  /** Short explanatory text shown below the title. */
  description?: string

  /** Disable the confirm button and show a spinner label. */
  processing?: boolean
  /** Optional error message shown above the buttons (renders as a LUMEN Banner). */
  error?: string
  /** Override the confirm button label. Defaults to "Confirm transfer". */
  confirmLabel?: string
  /** Override the cancel button label. Defaults to "Cancel". */
  cancelLabel?: string
  /** Whether clicking the scrim dismisses the dialog. Defaults to true. */
  dismissOnScrimClick?: boolean
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalize(input: string): string {
  return input.replace(/[,\s]/g, '').trim()
}

function matchesAmount(input: string, amount: number): boolean {
  const normalized = normalize(input)
  if (!normalized) return false
  const parsed = parseFloat(normalized)
  if (Number.isNaN(parsed)) return false
  return Math.abs(parsed - amount) < 0.005
}

function matchesWord(input: string, word: string): boolean {
  return input.trim().toLowerCase() === word.trim().toLowerCase()
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersReducedMotion
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AmountConfirmDialog({
  open,
  onClose,
  onConfirm,
  amount,
  currency = 'USD',
  recipient,
  fromAccount,
  memo,
  verificationMode = 'type-amount',
  verificationWord = 'CONFIRM',
  verificationLabel,
  destructive = false,
  title = 'Confirm transfer',
  description,
  processing = false,
  error,
  confirmLabel = 'Confirm transfer',
  cancelLabel = 'Cancel',
  dismissOnScrimClick = true,
}: AmountConfirmDialogProps) {
  const [typedValue, setTypedValue] = React.useState('')
  const [checkboxAgreed, setCheckboxAgreed] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const triggerElementRef = React.useRef<HTMLElement | null>(null)
  const statusId = React.useId()
  const themeColors = useColors()
  const reducedMotion = usePrefersReducedMotion()

  // Reset state + manage focus
  React.useEffect(() => {
    if (open) {
      triggerElementRef.current = document.activeElement as HTMLElement | null
      setTypedValue('')
      setCheckboxAgreed(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          inputRef.current?.focus()
        })
      })
    } else {
      triggerElementRef.current?.focus()
      triggerElementRef.current = null
    }
  }, [open])

  // Body scroll lock
  React.useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [open])

  // Escape key
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Focus trap
  React.useEffect(() => {
    if (!open || !dialogRef.current) return
    const dialog = dialogRef.current

    const getFocusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('aria-hidden'))

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = getFocusable()
      if (focusable.length === 0) { e.preventDefault(); return }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    dialog.addEventListener('keydown', onKey)
    return () => dialog.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  // Verification logic
  const verified =
    verificationMode === 'type-amount'
      ? matchesAmount(typedValue, amount)
      : verificationMode === 'type-word'
        ? matchesWord(typedValue, verificationWord)
        : checkboxAgreed

  const expectedFormatted = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  const resolvedLabel =
    verificationLabel ??
    (verificationMode === 'type-amount'
      ? `Type the amount to confirm: ${expectedFormatted}`
      : verificationMode === 'type-word'
        ? `Type ${verificationWord} to confirm`
        : 'I understand this action cannot be undone')

  const statusMessage =
    verificationMode === 'checkbox'
      ? ''
      : verified
        ? 'Verified. You can now confirm.'
        : typedValue.length > 0
          ? 'Value does not match yet.'
          : ''

  const animDuration = reducedMotion ? '0ms' : '200ms'
  const animEasing = 'ease-out'

  return (
    <>
      {/* Scrim */}
      <div
        aria-hidden="true"
        onClick={dismissOnScrimClick ? onClose : undefined}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: zIndex.modal,
          animation: `amountDialogFadeIn ${animDuration} ${animEasing}`,
        }}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="amount-dialog-title"
        aria-busy={processing}
        tabIndex={-1}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: zIndex.modal + 1,
          width: '100%',
          maxWidth: '440px',
          /* Grow to fit content, but keep spacing.md margin from viewport edges.
             When content exceeds this, the body scrolls internally. */
          maxHeight: `calc(100vh - ${spacing.md} - ${spacing.md})`,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: themeColors.surface?.light ?? colors.surface.light,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.lg,
          outline: 'none',
          animation: `amountDialogScaleIn ${animDuration} ${animEasing}`,
        }}
      >
        {/* Header — title + optional description */}
        <div style={{ padding: `${spacing.xl} ${spacing.xl} 0 ${spacing.xl}` }}>
          <h2
            id="amount-dialog-title"
            style={{
              margin: 0,
              fontFamily: fontFamilies.body,
              fontSize: typography.heading.h5.fontSize,
              fontWeight: fontWeights.semibold,
              lineHeight: typography.heading.h5.lineHeight,
              color: themeColors.text?.highEmphasis?.onLight ?? colors.text.highEmphasis.onLight,
            }}
          >
            {title}
          </h2>
          {description && (
            <p
              style={{
                margin: `${spacing.xs} 0 0 0`,
                fontFamily: fontFamilies.body,
                fontSize: typography.body.sm.fontSize,
                lineHeight: '22px',
                color: themeColors.text?.lowEmphasis?.onLight ?? colors.text.lowEmphasis.onLight,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Scrollable body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.lg,
          }}
        >
          {/* Summary — the amount + meta block */}
          <div
            style={{
              padding: spacing.lg,
              backgroundColor: colors.surface.lightDarker,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadius.md,
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: spacing.md }}>
              <div
                style={{
                  fontSize: typography.label.sm.fontSize,
                  fontWeight: fontWeights.semibold,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: colors.text.lowEmphasis.onLight,
                  fontFamily: fontFamilies.body,
                  marginBottom: spacing['2xs'],
                }}
              >
                Amount
              </div>
              <Amount
                value={amount}
                currency={currency}
                size="xl"
                variant={destructive ? 'debit' : 'default'}
              />
            </div>

            <SummaryRow label="To" value={recipient} />
            <SummaryRow label="From" value={fromAccount} />
            {memo && <SummaryRow label="Memo" value={memo} />}
          </div>

          {/* Verification */}
          <div>
            {verificationMode !== 'checkbox' ? (
              <Input
                ref={inputRef}
                label={resolvedLabel}
                placeholder={verificationMode === 'type-amount' ? expectedFormatted : verificationWord}
                value={typedValue}
                onChange={(v) => setTypedValue(v)}
                fullWidth
                autoComplete="off"
                aria-describedby={statusId}
                aria-invalid={typedValue.length > 0 && !verified}
                style={{ marginBottom: 0 }}
              />
            ) : (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  padding: `${spacing.xs} 0`,
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.md.fontSize,
                  color: colors.text.highEmphasis.onLight,
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                <input
                  type="checkbox"
                  checked={checkboxAgreed}
                  onChange={(e) => setCheckboxAgreed(e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    accentColor: themeColors.brand?.default ?? colors.brand.default,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
                {resolvedLabel}
              </label>
            )}

            {/* Live region for screen readers */}
            <div
              id={statusId}
              aria-live="polite"
              aria-atomic="true"
              style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0,0,0,0)',
                whiteSpace: 'nowrap',
                border: 0,
              }}
            >
              {statusMessage}
            </div>
          </div>

          {/* Error — LUMEN Banner */}
          {error && (
            <div role="alert">
              <Banner variant="error" size="sm">
                {error}
              </Banner>
            </div>
          )}
        </div>

        {/* Footer actions — no divider */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: spacing.sm,
            padding: `0 ${spacing.xl} ${spacing.xl} ${spacing.xl}`,
            flexShrink: 0,
          }}
        >
          <Button emphasis="low" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            emphasis="high"
            destructive={destructive}
            disabled={!verified || processing}
            onClick={onConfirm}
          >
            {processing ? 'Processing…' : confirmLabel}
          </Button>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes amountDialogFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes amountDialogScaleIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  )
}

// ---------------------------------------------------------------------------
// Summary row
// ---------------------------------------------------------------------------

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: `${spacing.xs} 0`,
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
