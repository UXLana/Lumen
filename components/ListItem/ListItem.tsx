'use client'

import React, { forwardRef, useState } from 'react'
import {
  colors,
  fontFamilies,
  spacing,
  borderRadius,
  transitionPresets,
  avatar,
} from '@/styles/design-tokens'
import { Avatar, type AvatarProps } from '@/components/Avatar/Avatar'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Left content type for the list item
 * - none: No left content
 * - avatar: Avatar component
 * - icon: Custom icon element
 * - checkbox: Checkbox input
 * - radio: Radio input
 */
export type ListItemLeftType = 'none' | 'avatar' | 'icon' | 'checkbox' | 'radio'

/**
 * Right content type for the list item
 * - none: No right content
 * - iconButton: Icon button (e.g., overflow menu)
 * - toggle: Toggle switch
 * - icon: Static icon
 * - text: Text label
 */
export type ListItemRightType = 'none' | 'iconButton' | 'toggle' | 'icon' | 'text'

/**
 * Number of text lines to display
 * - 1: Primary only
 * - 2: Primary + secondary
 * - 3: Primary + secondary + tertiary
 */
export type ListItemLines = 1 | 2 | 3

/**
 * List item status
 * - enabled: Default interactive state
 * - hover: Hovered state
 * - pressed: Pressed/active state
 * - nonActionable: Non-interactive display only
 */
export type ListItemStatus = 'enabled' | 'hover' | 'pressed' | 'nonActionable'

/**
 * List Item component props
 */
export interface ListItemProps {
  /** Primary text content */
  primary: string
  /** Secondary text content (optional) */
  secondary?: string
  /** Tertiary text content (optional) */
  tertiary?: string
  /** Number of text lines to show (1, 2, or 3) */
  lines?: ListItemLines
  /** Type of left content */
  leftType?: ListItemLeftType
  /** Avatar props when leftType is 'avatar' */
  avatarProps?: AvatarProps
  /** Icon element when leftType is 'icon' */
  icon?: React.ReactNode
  /** Whether the item is selected (for checkbox/radio) */
  selected?: boolean
  /** Current status/state of the item */
  status?: ListItemStatus
  /** Display as label-value pair instead of stacked text */
  labelValuePair?: boolean
  /** Low emphasis styling (lighter text) */
  lowEmphasis?: boolean
  /** Show divider at bottom */
  divider?: boolean
  /** Use rounded corners on hover/selected states (default: true) */
  roundedCorners?: boolean
  /** Type of right content */
  rightType?: ListItemRightType
  /** Custom right icon element */
  rightIcon?: React.ReactNode
  /** Right text content */
  rightText?: string
  /** Toggle state (when rightType is 'toggle') */
  toggleChecked?: boolean
  /** Toggle change handler */
  onToggleChange?: (checked: boolean) => void
  /** Custom right slot content (overrides rightType) */
  rightContent?: React.ReactNode
  /** Whether the item is focused (keyboard navigation) */
  focused?: boolean
  /** Click handler */
  onClick?: () => void
  /** Change handler for checkbox/radio */
  onChange?: (selected: boolean) => void
  /** Name attribute for checkbox/radio input */
  name?: string
  /** Value attribute for checkbox/radio input */
  value?: string
  /** Whether the checkbox/radio is disabled */
  disabled?: boolean
  /** Additional CSS class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

// =============================================================================
// DESIGN TOKENS
// =============================================================================

const listItem = {
  // Sizing
  minHeight: '48px',
  paddingX: '16px',
  paddingY: '16px',
  gap: '16px', // Gap between left content and text

  // Typography - Primary string (Data/md mid)
  typography: {
    primary: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '22px',
      letterSpacing: '-0.35px',
    },
    // Secondary string (Data/sm mid)
    secondary: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '18px',
      letterSpacing: '-0.3px',
    },
    // Tertiary string (Data/sm low)
    tertiary: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '18px',
      letterSpacing: '-0.3px',
    },
    // Label in label-value pair
    label: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '18px',
      letterSpacing: '-0.3px',
    },
    // Value in label-value pair
    value: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '22px',
      letterSpacing: '-0.35px',
    },
  },

  // Colors
  colors: {
    text: {
      primary: 'rgba(0, 0, 0, 0.95)',
      secondary: 'rgba(0, 0, 0, 0.95)',
      tertiary: 'rgba(0, 0, 0, 0.6)',
      lowEmphasis: 'rgba(0, 0, 0, 0.6)',
      nonActionable: 'rgba(0, 0, 0, 0.5)',
      label: 'rgba(0, 0, 0, 0.6)',
    },
    background: {
      enabled: 'transparent',
      hover: 'rgba(0, 0, 0, 0.04)',
      pressed: 'rgba(0, 0, 0, 0.08)',
      selected: 'rgba(19, 53, 44, 0.08)',
    },
    icon: {
      enabled: 'rgba(0, 0, 0, 0.7)',
      nonActionable: 'rgba(0, 0, 0, 0.38)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    focus: avatar.focus.color,
    toggle: {
      track: 'rgba(0, 0, 0, 0.38)',
      trackActive: colors.brand.primary,
      thumb: colors.surface.default,
    },
  },

  // Left content sizes
  leftContent: {
    avatar: '40px',
    icon: '24px',
    checkbox: '20px',
    radio: '20px',
  },

  // Right slot
  rightSlot: {
    gap: '12px',
    iconSize: '24px',
    buttonPadding: '8px',
  },

  // Hover/active border radius
  borderRadius: '8px',

  // Focus ring
  focus: {
    width: '3px',
    borderRadius: '4px',
    style: 'solid',
  },

  // Divider
  dividerHeight: '1px',
} as const

// =============================================================================
// ICON COMPONENTS
// =============================================================================

const MenuOverflowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="6" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="18" r="2" fill="currentColor" />
  </svg>
)

const CheckboxIcon = ({ checked, disabled }: { checked: boolean; disabled?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="2"
      y="2"
      width="16"
      height="16"
      rx="4"
      stroke={disabled ? 'rgba(0, 0, 0, 0.38)' : checked ? colors.brand.primary : 'rgba(0, 0, 0, 0.6)'}
      strokeWidth="2"
      fill={checked ? colors.brand.primary : 'transparent'}
    />
    {checked && (
      <path
        d="M6 10L9 13L14 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
)

const RadioIcon = ({ checked, disabled }: { checked: boolean; disabled?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="10"
      cy="10"
      r="8"
      stroke={disabled ? 'rgba(0, 0, 0, 0.38)' : checked ? colors.brand.primary : 'rgba(0, 0, 0, 0.6)'}
      strokeWidth="2"
      fill="transparent"
    />
    {checked && (
      <circle cx="10" cy="10" r="5" fill={colors.brand.primary} />
    )}
  </svg>
)

// Toggle Switch Component
const ToggleSwitch = ({
  checked,
  onChange,
  disabled
}: {
  checked: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
}) => {
  const trackStyle: React.CSSProperties = {
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    backgroundColor: checked ? listItem.colors.toggle.trackActive : listItem.colors.toggle.track,
    position: 'relative',
    cursor: disabled ? 'default' : 'pointer',
    transition: transitionPresets.default,
    opacity: disabled ? 0.5 : 1,
  }

  const thumbStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    borderRadius: '10px',
    backgroundColor: listItem.colors.toggle.thumb,
    position: 'absolute',
    top: '2px',
    left: checked ? '22px' : '2px',
    transition: transitionPresets.default,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  }

  return (
    <div
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      style={trackStyle}
      onClick={(e) => {
        e.stopPropagation()
        if (!disabled && onChange) {
          onChange(!checked)
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && onChange) {
          e.preventDefault()
          e.stopPropagation()
          onChange(!checked)
        }
      }}
    >
      <div style={thumbStyle} />
    </div>
  )
}

// =============================================================================
// LIST ITEM COMPONENT
// =============================================================================

/**
 * ListItem Component
 *
 * A versatile list item component for displaying content in lists, menus,
 * and selection interfaces. Supports various left content types (avatar, icon,
 * checkbox, radio), multiple text lines, and interactive states.
 *
 * Based on the Trace Design System v2.0 List Item component.
 *
 * @example
 * // Basic list item
 * <ListItem primary="Primary string" secondary="Secondary string" />
 *
 * @example
 * // With avatar
 * <ListItem
 *   leftType="avatar"
 *   avatarProps={{ name: "John Doe", src: "/avatar.jpg" }}
 *   primary="John Doe"
 *   secondary="john@example.com"
 * />
 *
 * @example
 * // With checkbox
 * <ListItem
 *   leftType="checkbox"
 *   selected={isSelected}
 *   onChange={setIsSelected}
 *   primary="Select option"
 * />
 *
 * @example
 * // With toggle on right
 * <ListItem
 *   primary="Notifications"
 *   secondary="Enable push notifications"
 *   rightType="toggle"
 *   toggleChecked={isEnabled}
 *   onToggleChange={setIsEnabled}
 * />
 */
export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      primary,
      secondary,
      tertiary,
      lines,
      leftType = 'none',
      avatarProps,
      icon,
      selected = false,
      status = 'enabled',
      labelValuePair = false,
      lowEmphasis = false,
      divider = false,
      roundedCorners = true,
      rightType = 'none',
      rightIcon,
      rightText,
      toggleChecked = false,
      onToggleChange,
      rightContent,
      focused = false,
      onClick,
      onChange,
      name,
      value,
      disabled = false,
      className,
      style,
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const isInteractive = status !== 'nonActionable' && !disabled
    const isSelectable = leftType === 'checkbox' || leftType === 'radio'

    // Determine which text lines to show based on lines prop
    const showSecondary = lines ? lines >= 2 : !!secondary
    const showTertiary = lines ? lines >= 3 : (!!tertiary && !labelValuePair)

    // Determine if hover state should be shown (either from actual hover or status prop)
    const showHoverState = (isHovered && isInteractive && status === 'enabled') || status === 'hover'

    // Determine if we need special styling (hover OR selected OR pressed)
    const hasActiveState = showHoverState || (selected && isSelectable) || status === 'pressed'

    // Apply rounded corners only if roundedCorners prop is true
    const showRoundedCorners = hasActiveState && roundedCorners

    // Handle click
    const handleClick = () => {
      if (!isInteractive) return

      if (isSelectable && onChange) {
        onChange(!selected)
      }

      onClick?.()
    }

    // Handle keyboard interaction
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
    }

    // Get background color based on state
    const getBackgroundColor = () => {
      const currentStatus = status as ListItemStatus
      if (showHoverState) return listItem.colors.background.hover
      if (selected && isSelectable) return listItem.colors.background.selected
      if (currentStatus === 'pressed') return listItem.colors.background.pressed
      if (currentStatus === 'hover') return listItem.colors.background.hover
      return listItem.colors.background.enabled
    }

    // Get text color based on state
    const getTextColor = (type: 'primary' | 'secondary' | 'tertiary' | 'label') => {
      if (status === 'nonActionable' || disabled) return listItem.colors.text.nonActionable
      if (lowEmphasis) return listItem.colors.text.lowEmphasis
      return listItem.colors.text[type]
    }

    // Should show divider (only when roundedCorners is false)
    const shouldShowDivider = divider && !roundedCorners

    // Container styles
    const containerStyles: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-start', // Align to top
      gap: listItem.gap,
      minHeight: listItem.minHeight,
      paddingLeft: listItem.paddingX,
      paddingRight: listItem.paddingX,
      paddingTop: listItem.paddingY,
      paddingBottom: listItem.paddingY,
      backgroundColor: getBackgroundColor(),
      borderRadius: showRoundedCorners ? listItem.borderRadius : 0,
      cursor: isInteractive ? 'pointer' : 'default',
      transition: transitionPresets.default,
      outline: 'none', // Remove default browser focus outline, using custom focus ring
      ...style,
    }

    // Left content styles - aligned to top
    const leftContentStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      flexShrink: 0,
      paddingTop: '2px', // Small offset to align with first line of text
      color: status === 'nonActionable' || disabled
        ? listItem.colors.icon.nonActionable
        : listItem.colors.icon.enabled,
    }

    // Text container styles
    const textContainerStyles: React.CSSProperties = {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: labelValuePair ? 'row' : 'column',
      gap: labelValuePair ? spacing[2] : 0,
      alignItems: labelValuePair ? 'baseline' : 'stretch',
      fontFamily: fontFamilies.body,
    }

    // Primary text styles
    const primaryStyles: React.CSSProperties = {
      ...listItem.typography[labelValuePair ? 'value' : 'primary'],
      color: getTextColor('primary'),
      margin: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: labelValuePair ? 'nowrap' : 'normal',
    }

    // Secondary text styles (or label in label-value pair)
    const secondaryStyles: React.CSSProperties = {
      ...listItem.typography[labelValuePair ? 'label' : 'secondary'],
      color: labelValuePair ? getTextColor('label') : getTextColor('secondary'),
      margin: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      order: labelValuePair ? -1 : 0, // Put label before value
    }

    // Tertiary text styles
    const tertiaryStyles: React.CSSProperties = {
      ...listItem.typography.tertiary,
      color: getTextColor('tertiary'),
      margin: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }

    // Right slot styles - aligned to top
    const rightSlotStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: listItem.rightSlot.gap,
      paddingTop: '2px',
      flexShrink: 0,
    }

    // Right text styles
    const rightTextStyles: React.CSSProperties = {
      ...listItem.typography.secondary,
      color: listItem.colors.text.tertiary,
    }

    // Divider styles
    const dividerStyles: React.CSSProperties = {
      position: 'absolute',
      bottom: 0,
      left: leftType !== 'none' ? `calc(${listItem.paddingX} + ${listItem.leftContent[leftType === 'avatar' ? 'avatar' : 'icon']}px + ${listItem.gap})` : listItem.paddingX,
      right: 0,
      height: listItem.dividerHeight,
      backgroundColor: listItem.colors.divider,
      transition: transitionPresets.default,
    }

    // Determine if focus ring should be shown (from prop OR native focus)
    const showFocusRing = focused || isFocused

    // Focus ring styles
    const focusRingStyles: React.CSSProperties = {
      position: 'absolute',
      inset: '-2px',
      border: `${listItem.focus.width} ${listItem.focus.style} ${listItem.colors.focus}`,
      borderRadius: showRoundedCorners ? '10px' : listItem.focus.borderRadius,
      pointerEvents: 'none',
    }

    // Icon button styles
    const iconButtonStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: listItem.rightSlot.buttonPadding,
      borderRadius: '50px',
      cursor: 'pointer',
      color: listItem.colors.icon.enabled,
      background: 'transparent',
      border: 'none',
      transition: transitionPresets.default,
    }

    // Render left content
    const renderLeftContent = () => {
      switch (leftType) {
        case 'avatar':
          return (
            <Avatar
              size="md"
              {...avatarProps}
            />
          )
        case 'icon':
          return (
            <div style={{ width: listItem.leftContent.icon, height: listItem.leftContent.icon }}>
              {icon}
            </div>
          )
        case 'checkbox':
          return (
            <>
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onChange?.(!selected)}
                name={name}
                value={value}
                disabled={disabled}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: 0,
                  height: 0,
                }}
                aria-hidden="true"
              />
              <CheckboxIcon checked={selected} disabled={disabled} />
            </>
          )
        case 'radio':
          return (
            <>
              <input
                type="radio"
                checked={selected}
                onChange={() => onChange?.(!selected)}
                name={name}
                value={value}
                disabled={disabled}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: 0,
                  height: 0,
                }}
                aria-hidden="true"
              />
              <RadioIcon checked={selected} disabled={disabled} />
            </>
          )
        default:
          return null
      }
    }

    // Render right content
    const renderRightContent = () => {
      if (rightContent) return rightContent

      switch (rightType) {
        case 'iconButton':
          return (
            <button
              type="button"
              style={iconButtonStyles}
              onClick={(e) => {
                e.stopPropagation()
                // Handle icon button click
              }}
              aria-label="More options"
            >
              {rightIcon || <MenuOverflowIcon />}
            </button>
          )
        case 'toggle':
          return (
            <ToggleSwitch
              checked={toggleChecked}
              onChange={onToggleChange}
              disabled={disabled}
            />
          )
        case 'icon':
          return (
            <div style={{
              color: listItem.colors.icon.enabled,
              width: listItem.rightSlot.iconSize,
              height: listItem.rightSlot.iconSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {rightIcon}
            </div>
          )
        case 'text':
          return (
            <span style={rightTextStyles}>
              {rightText}
            </span>
          )
        default:
          return null
      }
    }

    return (
      <div
        ref={ref}
        className={className}
        style={containerStyles}
        onClick={handleClick}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        role={isSelectable ? (leftType === 'radio' ? 'radio' : 'checkbox') : isInteractive ? 'button' : undefined}
        aria-checked={isSelectable ? selected : undefined}
        aria-disabled={disabled || status === 'nonActionable'}
        tabIndex={isInteractive ? 0 : -1}
      >
        {leftType !== 'none' && (
          <div style={leftContentStyles}>
            {renderLeftContent()}
          </div>
        )}

        <div style={textContainerStyles}>
          <p style={primaryStyles}>{primary}</p>
          {showSecondary && secondary && <p style={secondaryStyles}>{secondary}</p>}
          {showTertiary && tertiary && <p style={tertiaryStyles}>{tertiary}</p>}
        </div>

        {(rightType !== 'none' || rightContent) && (
          <div style={rightSlotStyles}>
            {renderRightContent()}
          </div>
        )}

        {shouldShowDivider && <div style={dividerStyles} />}
        {showFocusRing && <div style={focusRingStyles} />}
      </div>
    )
  }
)

ListItem.displayName = 'ListItem'

// =============================================================================
// LIST COMPONENT
// =============================================================================

export interface ListProps {
  /** List items to render */
  children: React.ReactNode
  /** Additional CSS class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
  /** Whether this is a selection list (checkbox/radio group) */
  selectionMode?: 'none' | 'single' | 'multiple'
  /** Use rounded corners on list items (adds 8px horizontal padding to list) */
  roundedCorners?: boolean
  /** ARIA label for the list */
  'aria-label'?: string
}

/**
 * List Component
 *
 * A container for ListItem components that provides proper accessibility
 * semantics and supports selection modes.
 *
 * @example
 * <List aria-label="User list">
 *   <ListItem primary="User 1" />
 *   <ListItem primary="User 2" />
 * </List>
 *
 * @example
 * // Selection list
 * <List selectionMode="multiple" aria-label="Select items">
 *   <ListItem leftType="checkbox" primary="Option 1" />
 *   <ListItem leftType="checkbox" primary="Option 2" />
 * </List>
 */
export function List({
  children,
  className,
  style,
  selectionMode = 'none',
  roundedCorners = true,
  'aria-label': ariaLabel,
}: ListProps) {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: roundedCorners ? '8px' : 0,
    gap: roundedCorners ? '8px' : 0,
    ...style,
  }

  const role = selectionMode === 'single'
    ? 'radiogroup'
    : selectionMode === 'multiple'
      ? 'group'
      : 'list'

  return (
    <div
      className={className}
      style={containerStyles}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ListItem
