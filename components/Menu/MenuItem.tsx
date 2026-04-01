'use client'

import React, { forwardRef } from 'react'
import {
  colors,
  spacing,
  typography,
  borderRadius,
  transitionPresets,
} from '../../styles/design-tokens'
import { IconCheck } from '../Icons'
import { useMenuSearch } from './Menu'

// =============================================================================
// TYPES
// =============================================================================

export type MenuItemType = 'basic' | 'multiple' | 'selectable' | 'avatar' | 'icon'

export interface MenuItemProps {
  /** Display label */
  label: string
  /** Optional metadata text (secondary line) */
  metadata?: string
  /** Item type — determines leading/trailing affordance */
  type?: MenuItemType
  /** Whether the item is checked (multiple/selectable types) */
  checked?: boolean
  /** Whether the item is disabled */
  disabled?: boolean
  /** Whether to show a divider below this item */
  hasDivider?: boolean
  /** Leading icon (for 'icon' type) */
  icon?: React.ReactNode
  /** Leading avatar (for 'avatar' type) */
  avatar?: React.ReactNode
  /** Whether this item is destructive (red text) */
  destructive?: boolean
  /** Click handler */
  onClick?: () => void
  /** Additional class name */
  className?: string
  /** Additional styles */
  style?: React.CSSProperties
}

// =============================================================================
// CHECKBOX INDICATOR (internal)
// =============================================================================

function CheckboxIndicator({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  const borderColor = disabled
    ? colors.text.disabled.onLight
    : checked
    ? colors.brand.default
    : colors.border.midEmphasis.onLight

  const bgColor = checked
    ? disabled
      ? colors.text.disabled.onLight
      : colors.brand.default
    : 'transparent'

  return (
    <span
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '18px',
        height: '18px',
        borderRadius: borderRadius.xs,
        border: `2px solid ${borderColor}`,
        backgroundColor: bgColor,
        flexShrink: 0,
        transition: `background-color ${transitionPresets.fast}, border-color ${transitionPresets.fast}`,
      }}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6L5 8.5L9.5 4"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  (
    {
      label,
      metadata,
      type = 'basic',
      checked = false,
      disabled = false,
      hasDivider = false,
      icon,
      avatar,
      destructive = false,
      onClick,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isPressed, setIsPressed] = React.useState(false)

    // Search filtering — hide if query doesn't match label or metadata
    const searchQuery = useMenuSearch()
    const matchesSearch = !searchQuery ||
      label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (metadata?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

    if (!matchesSearch) return null

    // Determine ARIA role based on type
    const role = type === 'multiple'
      ? 'menuitemcheckbox'
      : type === 'selectable'
      ? 'menuitemradio'
      : 'menuitem'

    // Text color
    const textColor = disabled
      ? colors.text.disabled.onLight
      : destructive
      ? colors.status.important
      : colors.text.highEmphasis.onLight

    const metadataColor = disabled
      ? colors.text.disabled.onLight
      : colors.text.lowEmphasis.onLight

    // Background
    const getBgColor = () => {
      if (disabled) return 'transparent'
      if (isPressed) return colors.surface.lightDarker
      if (isHovered) return colors.surface.lightDarker
      return 'transparent'
    }

    const handleClick = () => {
      if (!disabled) onClick?.()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
    }

    // Leading content
    // When metadata is shown, nudge leading content down 1px to align with first text line
    const leadingTopOffset = metadata ? '1px' : undefined

    const renderLeading = () => {
      if (type === 'multiple') {
        return (
          <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginTop: leadingTopOffset }}>
            <CheckboxIndicator checked={checked} disabled={disabled} />
          </span>
        )
      }
      if (type === 'avatar' && avatar) {
        return (
          <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginTop: leadingTopOffset }}>
            {avatar}
          </span>
        )
      }
      if (type === 'icon' && icon) {
        return (
          <span
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              marginTop: leadingTopOffset,
              color: disabled ? colors.text.disabled.onLight : colors.text.lowEmphasis.onLight,
            }}
          >
            {icon}
          </span>
        )
      }
      return null
    }

    // Trailing content (checkmark for selectable/avatar checked)
    const renderTrailing = () => {
      if ((type === 'selectable' || type === 'avatar') && checked) {
        return (
          <span
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              marginTop: leadingTopOffset,
              color: disabled ? colors.text.disabled.onLight : colors.brand.default,
            }}
          >
            <IconCheck size="sm" />
          </span>
        )
      }
      return null
    }

    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          ...style,
        }}
      >
        <div
          role={role}
          tabIndex={disabled ? -1 : 0}
          aria-checked={
            (type === 'multiple' || type === 'selectable' || type === 'avatar')
              ? checked
              : undefined
          }
          aria-disabled={disabled || undefined}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => !disabled && setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            setIsPressed(false)
          }}
          onMouseDown={() => !disabled && setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          style={{
            display: 'flex',
            alignItems: metadata ? 'flex-start' : 'center',
            gap: spacing.xs,
            // Figma: 13px 16px padding on the horizontal group
            padding: `${spacing.sm} ${spacing.md}`,
            cursor: disabled ? 'default' : 'pointer',
            backgroundColor: getBgColor(),
            transition: `background-color ${transitionPresets.fast}`,
            outline: 'none',
            border: 'none',
            width: '100%',
            userSelect: 'none',
          }}
          {...rest}
        >
          {renderLeading()}

          {/* Label + metadata */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                ...typography.body.sm,
                color: textColor,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </div>
            {metadata && (
              <div
                style={{
                  ...typography.body.xs,
                  color: metadataColor,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {metadata}
              </div>
            )}
          </div>

          {renderTrailing()}
        </div>

        {/* Divider */}
        {hasDivider && (
          <div
            role="separator"
            style={{
              height: '1px',
              backgroundColor: colors.border.lowEmphasis.onLight,
              margin: `${spacing['2xs']} ${spacing.md}`,
            }}
          />
        )}
      </div>
    )
  }
)

MenuItem.displayName = 'MenuItem'
