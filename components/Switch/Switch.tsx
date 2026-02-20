'use client'

import React, { forwardRef, useCallback, useId } from 'react'
import {
  colors,
  spacing,
  typography,
  borderRadius,
  fontFamilies,
  fontWeights,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

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
}

// =============================================================================
// CONSTANTS
// =============================================================================

const TRACK_WIDTH = 40
const TRACK_HEIGHT = 24
const THUMB_SIZE = 18
const THUMB_OFFSET = 3
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_OFFSET * 2

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

    // Track colors
    const trackBackground = disabled
      ? colors.surface.disabled.onLight
      : checked
        ? colors.brand.default
        : isHovered
          ? colors.border.highEmphasis.onLight
          : colors.border.midEmphasis.onLight
    const trackBorder = error && !checked && !disabled
      ? colors.status.important
      : 'transparent'

    // Thumb colors
    const thumbBackground = disabled
      ? colors.text.disabled.onLight
      : '#FFFFFF'

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing[2],
      flexDirection: labelPlacement === 'start' ? 'row-reverse' : 'row',
      justifyContent: fullWidth ? 'space-between' : undefined,
      padding: `${spacing[2]} ${spacing[3]}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
      borderRadius: borderRadius.sm,
      position: 'relative' as const,
      ...style,
    }

    const trackStyles: React.CSSProperties = {
      position: 'relative',
      width: `${TRACK_WIDTH}px`,
      height: `${TRACK_HEIGHT}px`,
      minWidth: `${TRACK_WIDTH}px`,
      borderRadius: borderRadius.full,
      backgroundColor: trackBackground,
      border: `1.5px solid ${trackBorder}`,
      transition: 'background-color 0.2s ease, border-color 0.2s ease',
      marginTop: '0px',
    }

    const thumbStyles: React.CSSProperties = {
      position: 'absolute',
      top: `${THUMB_OFFSET}px`,
      left: checked ? `${THUMB_OFFSET + THUMB_TRAVEL}px` : `${THUMB_OFFSET}px`,
      width: `${THUMB_SIZE}px`,
      height: `${THUMB_SIZE}px`,
      borderRadius: borderRadius.full,
      backgroundColor: thumbBackground,
      transition: 'left 0.2s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
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
        <span style={{ ...trackStyles, ...focusRingStyles }} aria-hidden="true">
          <span style={thumbStyles} />
        </span>
        {(label || metadata) && (
          <span style={{ display: 'flex', flexDirection: 'column' }}>
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
