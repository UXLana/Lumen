'use client'

import React, { forwardRef, useEffect, useCallback, useRef } from 'react'
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  transitionPresets,
} from '@/styles/design-tokens'
import { useColors } from '@/styles/themes'
import { usePrefersReducedMotion } from '@/hooks'

// =============================================================================
// TYPES
// =============================================================================

export type BottomSheetHeight = 'auto' | 'half' | 'full'

export interface BottomSheetProps {
  /** Controlled open state */
  open: boolean
  /** Called when the sheet should close (scrim tap, Escape, close button) */
  onClose: () => void
  /** Optional title rendered in the sheet header */
  title?: string
  /** Sheet height preset. Default: 'half' */
  height?: BottomSheetHeight
  /** Show the drag-handle bar at the top. Default: true */
  showDragHandle?: boolean
  /** Show the close (X) button in the header. Default: true */
  showCloseButton?: boolean
  /** Accessible label — required when no `title` is provided */
  'aria-label'?: string
  /** Sheet content */
  children: React.ReactNode
  /** Additional inline styles for the sheet container */
  style?: React.CSSProperties
  /** Additional class name */
  className?: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

const HEIGHT_MAP: Record<BottomSheetHeight, string> = {
  auto: 'auto',
  half: '60vh',
  full: 'calc(100vh - 24px)',
}

const MAX_HEIGHT = 'calc(100vh - 24px)'

// =============================================================================
// COMPONENT
// =============================================================================

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  function BottomSheet(
    {
      open,
      onClose,
      title,
      height = 'half',
      showDragHandle = true,
      showCloseButton = true,
      'aria-label': ariaLabel,
      children,
      style,
      className,
    },
    ref,
  ) {
    const themeColors = useColors()
    const prefersReducedMotion = usePrefersReducedMotion()
    const sheetRef = useRef<HTMLDivElement>(null)

    // Merge forwarded ref with internal ref
    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        (sheetRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      },
      [ref],
    )

    // ── Body scroll lock ──
    useEffect(() => {
      if (!open) return
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }, [open])

    // ── Escape key ──
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      },
      [onClose],
    )

    useEffect(() => {
      if (!open) return
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }, [open, handleKeyDown])

    // ── Focus trap: move focus into sheet on open, restore on close ──
    const previousFocus = useRef<HTMLElement | null>(null)

    useEffect(() => {
      if (open) {
        previousFocus.current = document.activeElement as HTMLElement
        // Focus the sheet container so keyboard users are inside it
        requestAnimationFrame(() => {
          sheetRef.current?.focus()
        })
      } else if (previousFocus.current) {
        previousFocus.current.focus()
        previousFocus.current = null
      }
    }, [open])

    // ── Don't render when closed ──
    if (!open) return null

    const showHeader = title || showCloseButton
    const transition = prefersReducedMotion ? 'none' : transitionPresets.default

    return (
      <>
        {/* Scrim */}
        <div
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: zIndex.overlay - 1,
            background: themeColors.scrim,
            transition: `opacity ${transition}`,
          }}
        />

        {/* Sheet */}
        <div
          ref={mergedRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel ?? title ?? 'Bottom sheet'}
          tabIndex={-1}
          className={className}
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: zIndex.overlay,
            display: 'flex',
            flexDirection: 'column',
            height: HEIGHT_MAP[height],
            maxHeight: MAX_HEIGHT,
            background: themeColors.surface.light,
            borderRadius: `${borderRadius.lg} ${borderRadius.lg} 0 0`,
            boxShadow: `0 -4px 24px rgba(0, 0, 0, 0.25)`,
            outline: 'none',
            ...style,
          }}
        >
          {/* Drag handle */}
          {showDragHandle && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: `${spacing.xs} 0`,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '4px',
                  borderRadius: borderRadius.full,
                  background: themeColors.border.midEmphasis.onLight,
                }}
              />
            </div>
          )}

          {/* Header */}
          {showHeader && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `0 ${spacing.md} ${spacing.sm}`,
                flexShrink: 0,
                borderBottom: `1px solid ${themeColors.border.lowEmphasis.onLight}`,
              }}
            >
              <span
                style={{
                  ...typography.label.md,
                  fontWeight: 600,
                  color: themeColors.text.highEmphasis.onLight,
                }}
              >
                {title}
              </span>

              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: spacing['2xs'],
                    color: themeColors.text.lowEmphasis.onLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: borderRadius.sm,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <line
                      x1="18" y1="6" x2="6" y2="18"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    />
                    <line
                      x1="6" y1="6" x2="18" y2="18"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content — scrollable */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: spacing.md,
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {children}
          </div>
        </div>
      </>
    )
  },
)

BottomSheet.displayName = 'BottomSheet'
