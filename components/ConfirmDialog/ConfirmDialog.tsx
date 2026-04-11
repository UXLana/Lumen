'use client'

/**
 * ConfirmDialog — Confirmation dialog with icon next to heading, body text
 * below, and action buttons. No close (X) button — cancel serves that purpose.
 *
 * Variants: warning (amber), destructive (red), info (blue).
 *
 * Handles: scrim, backdrop dismiss, escape key, focus trap, body scroll lock,
 * and return-focus on close.
 *
 * @see components/AmountConfirmDialog — typed verification for money movement
 */

import React, { forwardRef, useEffect, useRef, useCallback, useState } from 'react'
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
import { Button } from '../Button'

// =============================================================================
// TYPES
// =============================================================================

/**
 * Visual variant of the dialog.
 * - `warning` — Amber icon, standard confirm button (for cautionary actions)
 * - `destructive` — Red icon, destructive confirm button (for irreversible actions)
 * - `info` — Blue icon, standard confirm button (for informational confirmations)
 */
export type ConfirmDialogVariant = 'warning' | 'destructive' | 'info'

/**
 * Props for the ConfirmDialog component.
 */
export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Dialog title — displayed next to the icon */
  title: string
  /** Dialog description/body text — displayed below the icon + title row */
  description: string
  /** Label for the confirm button. Default: `'Confirm'` */
  confirmLabel?: string
  /** Label for the cancel button. Default: `'Cancel'` */
  cancelLabel?: string
  /** Visual variant. Default: `'warning'` */
  variant?: ConfirmDialogVariant
  /** Callback when the user confirms */
  onConfirm: () => void
  /** Callback when the user cancels (also fires on Escape and backdrop click) */
  onCancel: () => void
  /** Optional custom icon to override the default variant icon */
  icon?: React.ReactNode
  /** Custom styles for the dialog container */
  style?: React.CSSProperties
  /** Custom class name */
  className?: string
}

// =============================================================================
// INLINE SVG ICONS (one per variant)
// =============================================================================

function AlertTriangleIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M8.575 3.217L1.517 15.001A1.667 1.667 0 0 0 2.96 17.501h14.08A1.667 1.667 0 0 0 18.483 15.001L11.425 3.217a1.667 1.667 0 0 0-2.85 0zM10 7.501V10.834M10 14.168h.008"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function InfoCircleIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="8.333" stroke={color} strokeWidth="1.5" />
      <path d="M10 13.333V10M10 6.667h.008" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ErrorCircleIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="8.333" stroke={color} strokeWidth="1.5" />
      <path d="M12.5 7.5L7.5 12.5M7.5 7.5L12.5 12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// =============================================================================
// REDUCED MOTION HOOK
// =============================================================================

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersReducedMotion
}

// =============================================================================
// VARIANT CONFIG
// =============================================================================

interface VariantConfig {
  iconColor: string
  iconBg: string
  iconElement: React.ReactNode
  isDestructive: boolean
}

function getVariantConfig(
  variant: ConfirmDialogVariant,
  themeColors: ReturnType<typeof useColors>,
): VariantConfig {
  switch (variant) {
    case 'warning':
      return {
        iconColor: themeColors.status.warning,
        iconBg: themeColors.iconBg?.warning ?? 'rgba(255, 171, 0, 0.12)',
        iconElement: <AlertTriangleIcon size={20} color={themeColors.status.warning} />,
        isDestructive: false,
      }
    case 'destructive':
      return {
        iconColor: themeColors.status.important,
        iconBg: themeColors.iconBg?.important ?? 'rgba(255, 59, 48, 0.12)',
        iconElement: <ErrorCircleIcon size={20} color={themeColors.status.important} />,
        isDestructive: true,
      }
    case 'info':
      return {
        iconColor: themeColors.status.info,
        iconBg: themeColors.iconBg?.info ?? 'rgba(0, 122, 255, 0.12)',
        iconElement: <InfoCircleIcon size={20} color={themeColors.status.info} />,
        isDestructive: false,
      }
  }
}

// =============================================================================
// CONFIRM DIALOG COMPONENT
// =============================================================================

export const ConfirmDialog = forwardRef<HTMLDivElement, ConfirmDialogProps>(
  function ConfirmDialog(
    {
      open,
      title,
      description,
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      variant = 'warning',
      onConfirm,
      onCancel,
      icon,
      style,
      className,
    },
    ref,
  ) {
    const themeColors = useColors()
    const dialogRef = useRef<HTMLDivElement>(null)
    const triggerElementRef = useRef<HTMLElement | null>(null)
    const config = getVariantConfig(variant, themeColors)
    const reducedMotion = usePrefersReducedMotion()

    // Merge forwarded ref with internal ref
    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        (dialogRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      },
      [ref],
    )

    // Focus management — capture opener, restore on close
    useEffect(() => {
      if (open) {
        triggerElementRef.current = document.activeElement as HTMLElement | null
      } else if (triggerElementRef.current) {
        triggerElementRef.current.focus()
        triggerElementRef.current = null
      }
    }, [open])

    // Auto-focus the dialog when opened
    useEffect(() => {
      if (open && dialogRef.current) {
        // Small delay to allow animation to start
        requestAnimationFrame(() => {
          dialogRef.current?.focus()
        })
      }
    }, [open])

    // Body scroll lock
    useEffect(() => {
      if (!open) return
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = original }
    }, [open])

    // Escape key handler
    useEffect(() => {
      if (!open) return
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onCancel()
        }
      }
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }, [open, onCancel])

    // Focus trap
    useEffect(() => {
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

    const animDuration = reducedMotion ? '0ms' : '200ms'
    const animEasing = 'ease-out'

    return (
      <>
        {/* Scrim */}
        <div
          aria-hidden="true"
          onClick={onCancel}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: zIndex.modal,
            animation: `confirmDialogFadeIn ${animDuration} ${animEasing}`,
          }}
        />

        {/* Dialog */}
        <div
          ref={mergedRef}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-desc"
          tabIndex={-1}
          className={className}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: zIndex.modal + 1,
            width: '100%',
            maxWidth: '400px',
            backgroundColor: themeColors.surface?.light ?? colors.surface.light,
            borderRadius: borderRadius.lg,
            boxShadow: shadows.lg,
            outline: 'none',
            animation: `confirmDialogScaleIn ${animDuration} ${animEasing}`,
            ...style,
          }}
        >
          <div style={{ padding: spacing.xl, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {/* Icon + Title row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <div
                aria-hidden="true"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: config.iconBg,
                  flexShrink: 0,
                }}
              >
                {icon ?? config.iconElement}
              </div>
              <h2
                id="confirm-dialog-title"
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
            </div>

            {/* Body text */}
            <p
              id="confirm-dialog-desc"
              style={{
                margin: 0,
                fontFamily: fontFamilies.body,
                fontSize: typography.body.sm.fontSize,
                lineHeight: '22px',
                color: themeColors.text?.lowEmphasis?.onLight ?? colors.text.lowEmphasis.onLight,
              }}
            >
              {description}
            </p>

            {/* Actions — no divider, right-aligned */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: spacing.sm,
                paddingTop: spacing.xs,
              }}
            >
              <Button emphasis="low" onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button
                emphasis="high"
                destructive={config.isDestructive}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>

        {/* Keyframe animations */}
        <style>{`
          @keyframes confirmDialogFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes confirmDialogScaleIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `}</style>
      </>
    )
  },
)

ConfirmDialog.displayName = 'ConfirmDialog'
