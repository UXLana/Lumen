'use client'

import React, { forwardRef, useCallback, useId } from 'react'
import {
  colors,
  spacing,
  typography,
  borderRadius,
  fontFamilies,
  fontWeights,
  transitionPresets,
  bannerIcon,
} from '../../styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Switch variant:
 * - default: plain toggle knob
 * - icon: checkmark (on) / X (off) inside the thumb
 * - text: "On"/"Off" labels beside the track
 * - iconText: icons inside thumb + text labels beside the track
 */
export type SwitchVariant = 'default' | 'icon' | 'text' | 'iconText'

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  /** Label text displayed next to the switch */
  label?: string
  /** Metadata/description text below the label */
  metadata?: string
  /** Controlled checked (on/off) state */
  checked?: boolean
  /** Change handler */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void
  /** Label placement relative to the switch */
  labelPlacement?: 'start' | 'end'
  /** Full-width mode (label and switch spread across container) */
  fullWidth?: boolean
  /** Error state */
  error?: boolean
  /** Visual variant — controls icon/text display in the toggle */
  variant?: SwitchVariant
  /** Custom "on" label (default: "On") — used with text/iconText variants */
  onLabel?: string
  /** Custom "off" label (default: "Off") — used with text/iconText variants */
  offLabel?: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

// Default track (no text)
const TRACK_WIDTH = 44
const TRACK_HEIGHT = 24
const THUMB_SIZE = 18
const THUMB_OFFSET = 3
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_OFFSET * 2

// Wider track for text/iconText variants (text sits inside track)
const TEXT_TRACK_WIDTH = 48
const TEXT_TRACK_HEIGHT = 28
const TEXT_THUMB_SIZE = 22
const TEXT_THUMB_OFFSET = 3
const TEXT_THUMB_TRAVEL = TEXT_TRACK_WIDTH - TEXT_THUMB_SIZE - TEXT_THUMB_OFFSET * 2

// =============================================================================
// INTERNAL ICONS
// =============================================================================

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path
        d="M2 5L4 7L8 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path
        d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// =============================================================================
// COMPONENT: Switch
// =============================================================================

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      metadata,
      checked = false,
      onChange,
      labelPlacement = 'end',
      fullWidth = false,
      error = false,
      disabled = false,
      variant = 'default',
      onLabel = 'On',
      offLabel = 'Off',
      className,
      style,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = providedId || generatedId
    const [isHovered, setIsHovered] = React.useState(false)
    const [isFocusVisible, setIsFocusVisible] = React.useState(false)

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked, e)
      },
      [onChange]
    )

    const hasIcon = variant === 'icon' || variant === 'iconText'
    const hasText = variant === 'text' || variant === 'iconText'

    // Track colors
    const trackBackground = disabled
      ? colors.border.lowEmphasis.onLight
      : error && !checked
        ? bannerIcon.variants.important.background
        : checked
          ? colors.brand.default
          : isHovered
            ? colors.border.highEmphasis.onLight
            : colors.border.midEmphasis.onLight
    const trackBorder = error && !disabled
      ? colors.status.important
      : 'transparent'

    // Thumb colors
    const thumbBackground = disabled
      ? colors.border.midEmphasis.onLight
      : '#FFFFFF'

    // Icon color inside thumb
    const thumbIconColor = disabled
      ? colors.text.disabled.onLight
      : checked
        ? colors.brand.default
        : colors.text.lowEmphasis.onLight

    // Status text color
    const statusTextColor = disabled
      ? colors.text.disabled.onLight
      : checked
        ? colors.brand.default
        : colors.text.lowEmphasis.onLight

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: metadata ? 'flex-start' : 'center',
      gap: spacing.xs,
      flexDirection: labelPlacement === 'start' ? 'row-reverse' : 'row',
      justifyContent: fullWidth ? 'space-between' : undefined,
      padding: `${spacing.xs} ${spacing.sm}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.85 : 1,
      width: fullWidth ? '100%' : 'auto',
      borderRadius: borderRadius.sm,
      position: 'relative' as const,
      ...style,
    }

    // Use wider track + larger thumb for text variants
    const activeTrackWidth = hasText ? TEXT_TRACK_WIDTH : TRACK_WIDTH
    const activeTrackHeight = hasText ? TEXT_TRACK_HEIGHT : TRACK_HEIGHT
    const activeThumbSize = hasText ? TEXT_THUMB_SIZE : THUMB_SIZE
    const activeThumbOffset = hasText ? TEXT_THUMB_OFFSET : THUMB_OFFSET
    const activeThumbTravel = hasText ? TEXT_THUMB_TRAVEL : THUMB_TRAVEL

    const trackStyles: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: `${activeTrackWidth}px`,
      height: `${activeTrackHeight}px`,
      minWidth: `${activeTrackWidth}px`,
      boxSizing: 'border-box' as const,
      borderRadius: borderRadius.full,
      backgroundColor: trackBackground,
      border: error && !disabled ? `2px solid ${trackBorder}` : `1.5px solid ${trackBorder}`,
      transition: `background-color ${transitionPresets.default}, border-color ${transitionPresets.default}`,
    }

    // Center thumb vertically inside border-box track
    const thumbTop = (activeTrackHeight - 3 - activeThumbSize) / 2  // 3 = 1.5px border * 2
    const thumbInset = (activeTrackHeight - 3 - activeThumbSize) / 2
    const thumbTravel = activeTrackWidth - 3 - activeThumbSize - thumbInset * 2

    const thumbStyles: React.CSSProperties = {
      position: 'absolute',
      top: `${thumbTop}px`,
      left: checked ? `${thumbInset + thumbTravel}px` : `${thumbInset}px`,
      width: `${activeThumbSize}px`,
      height: `${activeThumbSize}px`,
      borderRadius: borderRadius.full,
      backgroundColor: thumbBackground,
      transition: `left ${transitionPresets.default}`,
      boxShadow: disabled ? 'none' : '0 1px 3px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: thumbIconColor,
      zIndex: 1,
    }

    const focusRingStyles: React.CSSProperties = isFocusVisible
      ? {
          outline: `2px solid ${colors.brand.default}`,
          outlineOffset: '2px',
        }
      : {}

    const labelStyles: React.CSSProperties = {
      fontFamily: fontFamilies.body,
      fontSize: typography.body.sm.fontSize,
      fontWeight: fontWeights.regular,
      lineHeight: typography.body.sm.lineHeight,
      color: disabled ? colors.text.disabled.onLight : colors.text.highEmphasis.onLight,
    }

    const metadataStyles: React.CSSProperties = {
      fontFamily: fontFamilies.body,
      fontSize: typography.body.xs.fontSize,
      fontWeight: fontWeights.regular,
      lineHeight: typography.body.xs.lineHeight,
      color: disabled ? colors.text.disabled.onLight : colors.text.lowEmphasis.onLight,
      marginTop: '2px',
    }

    // Inner track label styles (positioned inside the track, opposite side of thumb)
    const innerLabelStyles: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      fontFamily: fontFamilies.body,
      fontSize: '9px',
      fontWeight: fontWeights.semibold,
      letterSpacing: '0.5px',
      textTransform: 'uppercase' as const,
      color: '#FFFFFF',
      userSelect: 'none',
      zIndex: 0,
      pointerEvents: 'none',
    }

    // The toggle area: track with optional inner text
    const toggleArea = (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
          lineHeight: 0,
        }}
      >
        {/* Track + thumb + inner labels */}
        <span style={{ ...trackStyles, ...focusRingStyles }} aria-hidden="true">
          {/* "On" label inside track — visible when checked, sits on the left */}
          {hasText && (
            <span
              style={{
                ...innerLabelStyles,
                left: `${thumbInset + 1}px`,
                opacity: checked ? 1 : 0,
                transition: `opacity ${transitionPresets.default}`,
              }}
            >
              {onLabel}
            </span>
          )}

          <span style={thumbStyles}>
            {hasIcon && (checked ? <CheckIcon /> : <XIcon />)}
          </span>

          {/* "Off" label inside track — visible when unchecked, sits on the right */}
          {hasText && (
            <span
              style={{
                ...innerLabelStyles,
                right: `${thumbInset + 1}px`,
                opacity: checked ? 0 : 1,
                transition: `opacity ${transitionPresets.default}`,
                color: disabled
                  ? colors.text.disabled.onLight
                  : colors.text.lowEmphasis.onLight,
              }}
            >
              {offLabel}
            </span>
          )}
        </span>
      </span>
    )

    return (
      <label
        htmlFor={inputId}
        className={className}
        style={containerStyles}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={inputId}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          onFocus={(e) => {
            if (e.target.matches(':focus-visible')) setIsFocusVisible(true)
          }}
          onBlur={() => setIsFocusVisible(false)}
          aria-checked={checked}
          aria-invalid={error || undefined}
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
          {...props}
        />
        {toggleArea}
        {(label || metadata) && (
          <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {label && <span style={labelStyles}>{label}</span>}
            {metadata && <span style={metadataStyles}>{metadata}</span>}
          </span>
        )}
      </label>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch
