'use client'

import React, { forwardRef, useEffect, useCallback, useState } from 'react'
import {
  typography,
  shadows,
  spacing,
  borderRadius,
  breakpoints,
  transitionPresets,
  zIndex,
} from '../../styles/design-tokens'
import { useColors } from '../../styles/themes'
import { Button } from '../Button'
import { Input } from '../Input'
import { IconX, IconHome, IconArrowLeft } from '../Icons'

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
// MOBILE DETECTION HOOK
// =============================================================================

/** Breakpoint below which the modal always renders fullscreen */
const MOBILE_BREAKPOINT = parseInt(breakpoints.md) // 768

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
      : false
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}

// =============================================================================
// TYPES
// =============================================================================

/** Modal display variant */
export type ModalVariant = 'fullscreen' | 'floating'

/** Modal size for floating variant */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

/** Number of content columns for the modal body */
export type FullScreenModalColumns = 1 | 2 | 3

/** Configuration for a header action button */
export interface FullScreenModalHeaderButton {
  label: string
  emphasis: 'high' | 'mid' | 'low'
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

/** Panel background variant */
export type FullScreenModalPanelBackground = 'light' | 'muted'

/** Panel border position */
export type FullScreenModalPanelBorder = 'left' | 'right' | 'none'

export interface FullScreenModalProps {
  /** Controls modal visibility */
  open: boolean
  /** Callback when close is triggered */
  onClose: () => void
  /** Title in the header bar */
  title: string
  /** Optional subtitle below the title */
  subtitle?: string
  /**
   * Make the title inline-editable. Renders the title as an input that
   * looks like a label until focused. Fires `onTitleChange` on blur or
   * Enter. Pair with `onTitleChange` to receive the new value.
   */
  editableTitle?: boolean
  /** Called with the new title when an editable title commits (blur/Enter). */
  onTitleChange?: (value: string) => void
  /**
   * Custom content rendered on the left side of the header, between the
   * (optional) left-positioned close button and the title. Use for back
   * arrows, breadcrumbs, status badges, or any leading affordance.
   */
  leftHeaderSlot?: React.ReactNode
  /**
   * Custom content rendered on the right side of the header, before any
   * `headerButtons` and the close (X) button. Use for tools, secondary
   * controls, or anything beyond the standard 0–2 action buttons.
   */
  rightHeaderSlot?: React.ReactNode
  /** Display variant: 'fullscreen' takes the entire viewport, 'floating' is a centered dialog with scrim. Default: 'fullscreen'. Mobile always renders fullscreen. */
  variant?: ModalVariant
  /** Size of the floating modal. Ignored in fullscreen variant. Default: 'lg' */
  size?: ModalSize
  /** Number of body columns: 1, 2, or 3. Responsive. */
  columns?: FullScreenModalColumns
  /**
   * Custom CSS `grid-template-columns` value. When provided, overrides
   * `columns` and lets callers define asymmetric or resizable column
   * layouts (e.g. `"280px 1fr 360px"`).
   */
  columnTemplate?: string
  /** Body content — use FullScreenModalPanel for structured layout */
  children: React.ReactNode
  /** 0–2 header action buttons */
  headerButtons?: FullScreenModalHeaderButton[]
  /** Close on Escape key press */
  closeOnEscape?: boolean
  /** Close on scrim/backdrop click. Default: true for floating, false for fullscreen. */
  closeOnBackdrop?: boolean
  /**
   * Position of the close (X) button in the header.
   * - `'right'` (default): close button sits on the right side of the header,
   *   after any header action buttons. Matches common dialog conventions.
   * - `'left'`: close button sits to the left of the title. Useful for mobile
   *   back-affordance patterns or iOS-style presentation.
   */
  closeButtonPosition?: 'left' | 'right'
  /**
   * Icon used in the close button.
   * - `'close'` (default): X icon, label "Close".
   * - `'home'`: Home icon, label "Home". Use when dismissing the modal returns
   *   the user to a home/dashboard surface rather than the previous context.
   * - `'back'`: Left-arrow icon, label "Back". Use when dismissing the modal
   *   returns the user to the previous surface (list view, parent page).
   */
  closeButtonVariant?: 'close' | 'home' | 'back'
  /**
   * Inline content rendered to the right of the title (e.g. "Saved just now"
   * status, version chip, dirty-state indicator). Sits in the header bar's
   * title group, not in the action buttons. Keep short — single phrase or
   * small chip.
   */
  titleAccessory?: React.ReactNode
  /** Additional CSS class */
  className?: string
}

/** Panel padding preset */
export type FullScreenModalPanelPadding = 'default' | 'sm' | 'none'

export interface FullScreenModalPanelProps {
  children: React.ReactNode
  /** Panel background: 'light' or 'muted' */
  background?: FullScreenModalPanelBackground
  /** Border side: 'left', 'right', or 'none' */
  border?: FullScreenModalPanelBorder
  /**
   * Inner padding preset.
   * - `'default'` (default): `40px 48px 48px` — standard reading/form panel.
   * - `'sm'`: `16px 20px` — compact tools/sidebar panel.
   * - `'none'`: `0` — caller fully controls inner spacing.
   */
  padding?: FullScreenModalPanelPadding
  /** Additional CSS class */
  className?: string
  /** Sticky panel with independent scrolling */
  sticky?: boolean
}

// =============================================================================
// SIZE CONFIG (floating variant)
// =============================================================================

const floatingSizeConfig: Record<ModalSize, { width: string; maxHeight: string }> = {
  sm: { width: '480px', maxHeight: '60vh' },
  md: { width: '640px', maxHeight: '70vh' },
  lg: { width: '860px', maxHeight: '80vh' },
  xl: { width: '1080px', maxHeight: '90vh' },
}

// =============================================================================
// CLOSE ICON (inline SVG to avoid external dependencies)
// =============================================================================

const CloseIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// =============================================================================
// INTERNAL: Close button — shared between left/right header positions
// =============================================================================

interface CloseButtonProps {
  onClose: () => void
  colors: ReturnType<typeof useColors>
  variant?: 'close' | 'home' | 'back'
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClose, colors, variant = 'close' }) => (
  <button
    type="button"
    onClick={onClose}
    aria-label={variant === 'home' ? 'Home' : variant === 'back' ? 'Back' : 'Close'}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      borderRadius: '50%',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: colors.text.highEmphasis.onLight,
      flexShrink: 0,
      transition: 'background-color 150ms',
    }}
    onMouseEnter={(e) => {
      ;(e.currentTarget as HTMLButtonElement).style.backgroundColor =
        colors.hover?.onLight ?? 'rgba(0,0,0,0.04)'
    }}
    onMouseLeave={(e) => {
      ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
    }}
  >
    {variant === 'home' ? (
      <IconHome size="md" />
    ) : variant === 'back' ? (
      <IconArrowLeft size="md" />
    ) : (
      <IconX size="md" />
    )}
  </button>
)

// =============================================================================
// FULL SCREEN MODAL
// =============================================================================

/**
 * FullScreenModal — A versatile modal overlay supporting fullscreen and floating variants.
 *
 * - `variant="fullscreen"` (default): Takes the full viewport, no scrim.
 * - `variant="floating"`: Centered dialog with scrim backdrop. Size controlled by `size` prop.
 * - Mobile viewports always render fullscreen regardless of variant.
 *
 * Features:
 * - Theme-aware via `useColors()`
 * - Fade-in entrance animation
 * - Accessible: `role="dialog"`, `aria-modal`, Escape to close
 * - Body scroll lock while open
 * - Respects `prefers-reduced-motion`
 * - Configurable 1/2/3 column grid body
 * - Optional header action buttons via `headerButtons`
 * - Sub-component `FullScreenModalPanel` for structured content
 *
 * @example
 * ```tsx
 * // Fullscreen (default)
 * <FullScreenModal open={isOpen} onClose={close} title="Edit Product" columns={2}>
 *   <FullScreenModalPanel><ProductForm /></FullScreenModalPanel>
 *   <FullScreenModalPanel background="muted" border="left" sticky>
 *     <ProductPreview />
 *   </FullScreenModalPanel>
 * </FullScreenModal>
 *
 * // Floating dialog
 * <FullScreenModal open={isOpen} onClose={close} title="Settings" variant="floating" size="md">
 *   <FullScreenModalPanel><SettingsForm /></FullScreenModalPanel>
 * </FullScreenModal>
 * ```
 */
export const FullScreenModal = forwardRef<HTMLDivElement, FullScreenModalProps>(
  (
    {
      open,
      onClose,
      title,
      subtitle,
      editableTitle = false,
      onTitleChange,
      leftHeaderSlot,
      rightHeaderSlot,
      variant = 'fullscreen',
      size = 'lg',
      columns = 1,
      columnTemplate,
      children,
      headerButtons,
      closeOnEscape = true,
      closeOnBackdrop,
      closeButtonPosition = 'right',
      closeButtonVariant = 'close',
      titleAccessory,
      className,
    },
    ref,
  ) => {
    const colors = useColors()
    const prefersReducedMotion = usePrefersReducedMotion()
    const isMobile = useIsMobile()

    // Mobile always renders fullscreen
    const resolvedVariant: ModalVariant = isMobile ? 'fullscreen' : variant
    const isFloating = resolvedVariant === 'floating'

    // Default: floating closes on backdrop, fullscreen does not
    const shouldCloseOnBackdrop = closeOnBackdrop ?? isFloating

    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape) onClose()
      },
      [onClose, closeOnEscape],
    )

    useEffect(() => {
      if (!open) return
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }, [open, handleEscape])

    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
      }
      return () => {
        document.body.style.overflow = ''
      }
    }, [open])

    if (!open) return null

    const gridTemplateColumns =
      columnTemplate ??
      (columns === 3
        ? 'repeat(3, 1fr)'
        : columns === 2
          ? 'repeat(2, 1fr)'
          : '1fr')

    const sizeConfig = floatingSizeConfig[size]

    // Scrim styles — visible for floating, transparent for fullscreen
    const scrimStyles: React.CSSProperties = {
      position: 'fixed',
      inset: 0,
      zIndex: zIndex?.overlay ?? 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isFloating ? colors.scrim : 'transparent',
      backdropFilter: isFloating ? 'blur(4px)' : undefined,
      animation: prefersReducedMotion ? 'none' : 'modalFadeIn 200ms ease-out',
    }

    // Dialog container styles
    const dialogStyles: React.CSSProperties = isFloating
      ? {
          width: `min(${sizeConfig.width}, calc(100vw - ${spacing['2xl']}))`,
          maxHeight: sizeConfig.maxHeight,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: colors.surface.light,
          boxShadow: shadows?.xl ?? '0 25px 50px -12px rgba(0,0,0,.25)',
          borderRadius: borderRadius.lg,
          transition: transitionPresets?.slow ?? 'all 300ms ease-in-out',
          position: 'relative',
          animation: prefersReducedMotion ? 'none' : 'modalSlideUp 200ms ease-out',
        }
      : {
          width: '100%',
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: colors.surface.light,
          boxShadow: shadows?.xl ?? '0 25px 50px -12px rgba(0,0,0,.25)',
          transition: transitionPresets?.slow ?? 'all 300ms ease-in-out',
          position: 'relative',
        }

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={scrimStyles}
        onClick={shouldCloseOnBackdrop ? onClose : undefined}
      >
        <div
          className={className}
          style={dialogStyles}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: spacing.xl,
              paddingRight: spacing.xl,
              height: spacing['5xl'], // 64px
              flexShrink: 0,
              backgroundColor: colors.surface.light,
              borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: isFloating ? `${borderRadius.lg} ${borderRadius.lg} 0 0` : undefined,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, minWidth: 0, flex: 1 }}>
              {closeButtonPosition === 'left' && (
                <CloseButton onClose={onClose} colors={colors} variant={closeButtonVariant} />
              )}
              {leftHeaderSlot && (
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexShrink: 0 }}>
                  {leftHeaderSlot}
                </div>
              )}
              <div
                style={{
                  minWidth: 0,
                  flex: 1,
                  paddingRight: editableTitle ? spacing.lg : spacing.md,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    minWidth: 0,
                  }}
                >
                  {editableTitle ? (
                    <Input
                      size="sm"
                      fullWidth
                      appearance="ghost"
                      value={title}
                      aria-label="Edit title"
                      onChange={(value) => onTitleChange?.(value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          ;(e.currentTarget as HTMLInputElement).blur()
                        }
                      }}
                    />
                  ) : (
                    <div
                      title={title}
                      style={{
                        ...typography.label.md,
                        color: colors.text.highEmphasis.onLight,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                      }}
                    >
                      {title}
                    </div>
                  )}
                  {titleAccessory && (
                    <div
                      style={{
                        ...typography.body.xs,
                        color: colors.text.lowEmphasis.onLight,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {titleAccessory}
                    </div>
                  )}
                </div>
                {subtitle && (
                  <div
                    style={{
                      ...typography.body.xs,
                      color: colors.text.lowEmphasis.onLight,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {subtitle}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: rightHeaderSlot + header action buttons + close X (when position=right) */}
            {(closeButtonPosition === 'right' || rightHeaderSlot || (headerButtons && headerButtons.length > 0)) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexShrink: 0 }}>
                {rightHeaderSlot}
                {headerButtons?.map((btn, i) => (
                  <Button
                    key={i}
                    emphasis={btn.emphasis}
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                    loading={btn.loading}
                    leftIcon={btn.icon}
                  >
                    {btn.label}
                  </Button>
                ))}
                {closeButtonPosition === 'right' && (
                  <CloseButton onClose={onClose} colors={colors} variant={closeButtonVariant} />
                )}
              </div>
            )}
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflow: 'hidden', width: '100%' }}>
            <div style={{ height: '100%', overflowY: 'auto', width: '100%' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns,
                  minHeight: '100%',
                  width: '100%',
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  },
)

FullScreenModal.displayName = 'FullScreenModal'

// Inject keyframes once (same pattern as Skeleton)
if (typeof document !== 'undefined') {
  const styleId = 'lumen-modal-keyframes'
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style')
    styleEl.id = styleId
    styleEl.textContent = `
      @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes modalSlideUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `
    document.head.appendChild(styleEl)
  }
}

// =============================================================================
// FULL SCREEN MODAL PANEL
// =============================================================================

/**
 * FullScreenModalPanel — Content panel for use inside FullScreenModal.
 *
 * Provides consistent padding, optional muted background, side border, and
 * sticky mode for independent scrolling (useful for previews and sidebars).
 *
 * @example
 * ```tsx
 * <FullScreenModalPanel background="muted" border="left" sticky>
 *   <Preview />
 * </FullScreenModalPanel>
 * ```
 */
export const FullScreenModalPanel = forwardRef<HTMLDivElement, FullScreenModalPanelProps>(
  (
    {
      children,
      background = 'light',
      border = 'none',
      padding = 'default',
      className,
      sticky = false,
    },
    ref,
  ) => {
    const colors = useColors()

    const borderStyle: React.CSSProperties =
      border === 'left'
        ? { borderLeft: `1px solid ${colors.border.lowEmphasis.onLight}` }
        : border === 'right'
          ? { borderRight: `1px solid ${colors.border.lowEmphasis.onLight}` }
          : {}

    const paddingValue =
      padding === 'none' ? 0 : padding === 'sm' ? '16px 20px' : '40px 48px 48px'

    const panelStyle: React.CSSProperties = {
      width: '100%',
      padding: paddingValue,
      display: 'flex',
      flexDirection: 'column',
      transition: 'background-color 200ms',
      backgroundColor:
        background === 'muted' ? colors.surface.lightDarker : colors.surface.light,
      ...borderStyle,
    }

    return (
      <div ref={ref} className={className} style={panelStyle}>
        {sticky ? (
          <div
            style={{
              position: 'sticky',
              top: 0,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              overflowY: 'auto',
            }}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    )
  },
)

FullScreenModalPanel.displayName = 'FullScreenModalPanel'
