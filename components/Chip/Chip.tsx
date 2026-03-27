'use client'

import React, { forwardRef, useState, useCallback } from 'react'
import {
  colors,
  spacing,
  borderRadiusSemantics,
  typography,
  fontFamilies,
  fontWeights,
} from '../../styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

export type ChipState = 'enabled' | 'hover' | 'disabled' | 'dragged' | 'error'

export type ChipLeftContent = 'none' | 'icon' | 'avatar'

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Whether the chip is selected */
  selected?: boolean
  /** Content to show on the left side */
  leftContent?: ChipLeftContent
  /** Left icon element (when leftContent='icon') */
  icon?: React.ReactNode
  /** Avatar image src (when leftContent='avatar') */
  avatarSrc?: string
  /** Avatar alt text */
  avatarAlt?: string
  /** Whether to show the delete/close icon on the right */
  removable?: boolean
  /** Chip label text */
  children: React.ReactNode
  /** Whether the chip is disabled */
  disabled?: boolean
  /** Whether the chip is in an error state */
  error?: boolean
  /** Callback when the chip is clicked/selected */
  onSelect?: (selected: boolean) => void
  /** Callback when the delete icon is clicked */
  onRemove?: () => void
  /** Whether the chip is inside a ChipGroup (listbox). When true, uses role="option". When false, uses button-like semantics. */
  _inGroup?: boolean
}

// =============================================================================
// STYLE HELPERS
// =============================================================================

const CHIP_HEIGHT = 32
const CHIP_ICON_SIZE = 18
const CHIP_AVATAR_SIZE = 24
const CHIP_GAP = 8
const CHIP_PADDING_Y = 7
const CHIP_PADDING_X = 12
const CHIP_PADDING_X_WITH_AVATAR = 4 // smaller left padding when avatar present

const DRAG_SHADOW = '0px 0px 4px 0px rgba(0, 0, 0, 0.13), 0px 3px 8px 0px rgba(0, 0, 0, 0.1)'
const ERROR_BORDER_COLOR = '#DC0C22'

const FOCUS_RING_COLOR = colors.focusBorder.onLight
const FOCUS_RING_OFFSET = '2px'

function getChipStyles(
  state: ChipState,
  selected: boolean,
  isHovered: boolean,
  isFocusVisible: boolean,
  hasAvatar: boolean,
): React.CSSProperties {
  const effectiveState = state === 'enabled' && isHovered ? 'hover' : state
  const isError = state === 'error'
  const isErrorHover = isError && isHovered

  let background: string
  let textColor: string
  let border = 'none'
  let opacity: number | undefined
  let boxShadow: string | undefined
  let cursor: string = 'pointer'

  if (state === 'disabled') {
    background = 'rgba(0, 0, 0, 0.03)'
    textColor = colors.text.disabled.onLight
    cursor = 'not-allowed'
    opacity = 1
  } else if (selected) {
    background = '#4A4A4A'
    textColor = '#FFFFFF'
    if (isHovered) {
      background = '#3A3A3A'
    }
  } else if (state === 'dragged') {
    background = colors.chipBg.enabled
    textColor = colors.text.highEmphasis.onLight
    boxShadow = DRAG_SHADOW
  } else if (isErrorHover) {
    background = colors.chipBg.hover
    textColor = colors.text.highEmphasis.onLight
    border = `2px solid ${ERROR_BORDER_COLOR}`
  } else if (isError) {
    background = colors.chipBg.enabled
    textColor = colors.text.highEmphasis.onLight
    border = `2px solid ${ERROR_BORDER_COLOR}`
  } else if (effectiveState === 'hover') {
    background = colors.chipBg.hover
    textColor = colors.text.highEmphasis.onLight
  } else {
    background = colors.chipBg.enabled
    textColor = colors.text.highEmphasis.onLight
  }

  // Focus ring via outline (WCAG 2.4.7)
  if (isFocusVisible) {
    boxShadow = `0 0 0 ${FOCUS_RING_OFFSET} ${FOCUS_RING_COLOR}`
  }

  const paddingLeft = hasAvatar ? CHIP_PADDING_X_WITH_AVATAR : CHIP_PADDING_X

  return {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${CHIP_GAP}px`,
    height: `${CHIP_HEIGHT}px`,
    padding: `${CHIP_PADDING_Y}px ${CHIP_PADDING_X}px ${CHIP_PADDING_Y}px ${paddingLeft}px`,
    borderRadius: borderRadiusSemantics.chip,
    background,
    color: textColor,
    border,
    boxShadow,
    opacity,
    cursor,
    fontFamily: fontFamilies.body,
    fontSize: typography.body.sm.fontSize,
    fontWeight: fontWeights.regular,
    lineHeight: typography.body.sm.lineHeight,
    whiteSpace: 'nowrap',
    userSelect: 'none',
    transition: 'background 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
    boxSizing: 'border-box',
    outline: 'none',
  }
}

// =============================================================================
// DELETE BUTTON SUB-COMPONENT
// =============================================================================

interface ChipDeleteButtonProps {
  onClick: (e: React.MouseEvent) => void
  disabled?: boolean
  onDark?: boolean
  chipLabel?: string
}

const ChipDeleteButton: React.FC<ChipDeleteButtonProps> = ({ onClick, disabled, onDark, chipLabel }) => {
  const [isHovered, setIsHovered] = useState(false)

  const iconColor = onDark
    ? 'rgba(255, 255, 255, 0.70)'
    : disabled
      ? colors.text.disabled.onLight
      : isHovered
        ? colors.text.highEmphasis.onLight
        : colors.text.lowEmphasis.onLight

  return (
    <button
      type="button"
      aria-label={chipLabel ? `Remove ${chipLabel}` : 'Remove'}
      tabIndex={-1}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${CHIP_ICON_SIZE}px`,
        height: `${CHIP_ICON_SIZE}px`,
        padding: 0,
        margin: 0,
        border: 'none',
        background: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: '50%',
        flexShrink: 0,
        outline: 'none',
        transition: 'color 150ms ease',
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

// =============================================================================
// AVATAR SUB-COMPONENT
// =============================================================================

interface ChipAvatarProps {
  src: string
  alt: string
}

const ChipAvatar: React.FC<ChipAvatarProps> = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    style={{
      width: `${CHIP_AVATAR_SIZE}px`,
      height: `${CHIP_AVATAR_SIZE}px`,
      borderRadius: '50%',
      objectFit: 'cover',
      flexShrink: 0,
    }}
  />
)

// =============================================================================
// CHIP COMPONENT
// =============================================================================

/**
 * Chip
 *
 * Chips represent complex entities in small blocks, such as a contact or tag.
 * They can contain an avatar, icon, text, and a delete action.
 *
 * @example
 * <Chip>Label</Chip>
 * <Chip selected>Selected</Chip>
 * <Chip removable onRemove={() => {}}>Removable</Chip>
 * <Chip leftContent="icon" icon={<FilterIcon />}>With Icon</Chip>
 * <Chip leftContent="avatar" avatarSrc="/avatar.jpg" avatarAlt="User">With Avatar</Chip>
 */
export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      selected = false,
      leftContent = 'none',
      icon,
      avatarSrc,
      avatarAlt = '',
      removable = false,
      children,
      disabled = false,
      error = false,
      onSelect,
      onRemove,
      _inGroup = false,
      className,
      style,
      onKeyDown,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isFocusVisible, setIsFocusVisible] = useState(false)

    const state: ChipState = disabled
      ? 'disabled'
      : error
        ? 'error'
        : 'enabled'

    const hasAvatar = leftContent === 'avatar'
    const chipStyles = getChipStyles(state, selected, isHovered, isFocusVisible, hasAvatar)

    // Extract plain text from children for aria-label on delete button
    const labelText = typeof children === 'string' ? children : ''

    const handleClick = useCallback(() => {
      if (disabled) return
      onSelect?.(!selected)
    }, [disabled, onSelect, selected])

    const handleRemove = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        if (disabled) return
        onRemove?.()
      },
      [disabled, onRemove]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.(!selected)
        }
        if (e.key === 'Backspace' || e.key === 'Delete') {
          if (removable) {
            e.preventDefault()
            onRemove?.()
          }
        }
        onKeyDown?.(e)
      },
      [disabled, onSelect, selected, removable, onRemove, onKeyDown]
    )

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLDivElement>) => {
        // Approximate :focus-visible — keyboard focus shows ring, mouse doesn't
        if (!(e.target as any).matches?.(':focus-visible')) {
          // Fallback: assume focus-visible if no recent pointer event
          setIsFocusVisible(true)
        } else {
          setIsFocusVisible(true)
        }
        onFocus?.(e)
      },
      [onFocus]
    )

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLDivElement>) => {
        setIsFocusVisible(false)
        onBlur?.(e)
      },
      [onBlur]
    )

    // ARIA: Use role="option" inside a listbox (ChipGroup), otherwise button-like semantics
    const ariaProps = _inGroup
      ? {
          role: 'option' as const,
          'aria-selected': selected,
        }
      : {
          role: 'button' as const,
          'aria-pressed': selected,
        }

    return (
      <div
        ref={ref}
        {...ariaProps}
        aria-disabled={disabled || undefined}
        aria-invalid={error || undefined}
        tabIndex={disabled ? -1 : 0}
        className={className}
        style={{ ...chipStyles, ...style }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {leftContent === 'avatar' && avatarSrc && (
          <ChipAvatar src={avatarSrc} alt={avatarAlt} />
        )}

        {leftContent === 'icon' && icon && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: `${CHIP_ICON_SIZE}px`,
              height: `${CHIP_ICON_SIZE}px`,
              flexShrink: 0,
            }}
          >
            {icon}
          </span>
        )}

        <span>{children}</span>

        {removable && (
          <ChipDeleteButton
            onClick={handleRemove}
            disabled={disabled}
            onDark={selected}
            chipLabel={labelText}
          />
        )}
      </div>
    )
  }
)

Chip.displayName = 'Chip'

export default Chip
