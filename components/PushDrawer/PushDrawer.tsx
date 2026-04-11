'use client'

import React, { forwardRef, useCallback, useEffect, useRef } from 'react'
import {
  colors,
  spacing,
  typography,
  fontWeights,
  borderRadius,
  transitionPresets,
} from '../../styles/design-tokens'
import { IconX } from '../Icons'

// =============================================================================
// TYPES
// =============================================================================

export type DrawerVariant = 'rounded' | 'square'
export type DrawerSide = 'left' | 'right'
export type DrawerMode = 'push' | 'overlay'

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the drawer is open */
  isOpen: boolean
  /** Called when the drawer should close (close button, Escape, or scrim click) */
  onClose: () => void
  /** Mode — push shifts sibling content, overlay floats above with scrim */
  mode?: DrawerMode
  /** Visual variant — rounded inset panel or flush edge */
  variant?: DrawerVariant
  /** Which edge the drawer slides from */
  side?: DrawerSide
  /** Width of the inner panel content area (px) */
  width?: number
  /** Drawer title */
  title?: string
  /** Header actions (e.g. Reset / Apply buttons) — rendered right of title */
  headerActions?: React.ReactNode
  /** Show the default close button in the header */
  showCloseButton?: boolean
  /** Content inside the drawer */
  children?: React.ReactNode
}

// Backward-compatible aliases
/** @deprecated Use DrawerVariant */
export type PushDrawerVariant = DrawerVariant
/** @deprecated Use DrawerSide */
export type PushDrawerSide = DrawerSide
/** @deprecated Use DrawerProps */
export type PushDrawerProps = DrawerProps

// =============================================================================
// CONSTANTS
// =============================================================================

// Rounded variant inset from viewport edge — tokenized at spacing.xl (24px)
const ROUNDED_INSET = spacing.xl

// =============================================================================
// COMPONENT
// =============================================================================

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onClose,
      mode = 'push',
      variant = 'square',
      side = 'right',
      width = 320,
      title,
      headerActions,
      showCloseButton = true,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const drawerRef = useRef<HTMLDivElement>(null)
    const mergedRef = (ref as React.RefObject<HTMLDivElement>) || drawerRef

    // Escape key closes the drawer
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) onClose()
      },
      [isOpen, onClose],
    )

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    const isRounded = variant === 'rounded'
    const isRight = side === 'right'
    const isOverlay = mode === 'overlay'

    // ── Push mode ──────────────────────────────────────────────────────────
    if (!isOverlay) {
      const insetPx = parseInt(ROUNDED_INSET)
      const outerWidth = isRounded ? width + insetPx : width

      const outerStyles: React.CSSProperties = {
        width: isOpen ? outerWidth : 0,
        minWidth: isOpen ? outerWidth : 0,
        opacity: isOpen ? 1 : 0,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        transition: 'width 300ms ease-in-out, min-width 300ms ease-in-out, opacity 300ms ease-in-out, padding 300ms ease-in-out',
        ...(isRounded
          ? {
              padding: isOpen
                ? isRight
                  ? `${ROUNDED_INSET} ${ROUNDED_INSET} ${ROUNDED_INSET} 0`
                  : `${ROUNDED_INSET} 0 ${ROUNDED_INSET} ${ROUNDED_INSET}`
                : '0',
              backgroundColor: 'transparent',
            }
          : {
              backgroundColor: colors.surface.light,
              ...(isRight
                ? { borderLeft: isOpen ? `1px solid ${colors.border.lowEmphasis.onLight}` : 'none' }
                : { borderRight: isOpen ? `1px solid ${colors.border.lowEmphasis.onLight}` : 'none' }),
            }),
        ...style,
      }

      const innerStyles: React.CSSProperties = {
        width,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: colors.surface.light,
        ...(isRounded
          ? {
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            }
          : {}),
      }

      return (
        <div
          ref={mergedRef}
          role="complementary"
          aria-label={title || 'Drawer'}
          style={outerStyles}
          {...props}
        >
          <div style={innerStyles}>
            <DrawerHeader
              title={title}
              headerActions={headerActions}
              showCloseButton={showCloseButton}
              onClose={onClose}
            />
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {children}
            </div>
          </div>
        </div>
      )
    }

    // ── Overlay mode ───────────────────────────────────────────────────────
    const insetPx = parseInt(ROUNDED_INSET)

    const panelStyles: React.CSSProperties = {
      position: 'fixed',
      top: isRounded ? insetPx : 0,
      bottom: isRounded ? insetPx : 0,
      [side]: isRounded ? insetPx : 0,
      width,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: colors.surface.light,
      transform: isOpen ? 'translateX(0)' : `translateX(${isRight ? '100%' : '-100%'})`,
      transition: 'transform 300ms ease-in-out',
      zIndex: 1001,
      ...(isRounded
        ? {
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }
        : {
            ...(isRight
              ? { borderLeft: `1px solid ${colors.border.lowEmphasis.onLight}` }
              : { borderRight: `1px solid ${colors.border.lowEmphasis.onLight}` }),
          }),
      ...style,
    }

    return (
      <>
        {/* Scrim */}
        <div
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: colors.scrim,
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: 'opacity 300ms ease-in-out',
            zIndex: 1000,
          }}
        />
        {/* Panel */}
        <div
          ref={mergedRef}
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Drawer'}
          style={panelStyles}
          {...props}
        >
          <DrawerHeader
            title={title}
            headerActions={headerActions}
            showCloseButton={showCloseButton}
            onClose={onClose}
          />
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {children}
          </div>
        </div>
      </>
    )
  },
)

Drawer.displayName = 'Drawer'

/** @deprecated Use Drawer */
export const PushDrawer = Drawer

// =============================================================================
// INTERNAL: Shared header
// =============================================================================

function DrawerHeader({
  title,
  headerActions,
  showCloseButton,
  onClose,
}: {
  title?: string
  headerActions?: React.ReactNode
  showCloseButton?: boolean
  onClose: () => void
}) {
  const hasHeader = title || headerActions || showCloseButton
  if (!hasHeader) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${spacing.sm} ${spacing.md}`,
        borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: spacing.xl,
              height: spacing.xl,
              padding: 0,
              border: 'none',
              borderRadius: borderRadius.sm,
              backgroundColor: 'transparent',
              color: colors.text.lowEmphasis.onLight,
              cursor: 'pointer',
              transition: `background-color ${transitionPresets.fast}, color ${transitionPresets.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hover.onLight
              e.currentTarget.style.color = colors.text.highEmphasis.onLight
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = colors.text.lowEmphasis.onLight
            }}
          >
            <IconX size="sm" />
          </button>
        )}
        {title && (
          <span
            style={{
              ...typography.heading.h6,
              fontWeight: fontWeights.semibold,
              color: colors.text.highEmphasis.onLight,
              margin: 0,
            }}
          >
            {title}
          </span>
        )}
      </div>
      {headerActions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          {headerActions}
        </div>
      )}
    </div>
  )
}
