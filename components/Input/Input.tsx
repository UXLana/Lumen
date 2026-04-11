'use client'

import React, { forwardRef, useCallback, useId } from 'react'
import {
  colors,
  spacing,
  typography,
  borderRadius,
  borderRadiusSemantics,
  fontFamilies,
  fontWeights,
} from '../../styles/design-tokens'
import { AssistiveMessage } from '../AssistiveMessage'
import type { AssistiveMessageType } from '../AssistiveMessage'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/** Content-based width presets */
export type InputWidth = 'xs' | 'sm' | 'md' | 'lg' | 'full'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  /** Label text above the input */
  label?: string
  /** Helper/description text below the input */
  helperText?: string
  /** Error message (shows error state when provided) */
  errorMessage?: string
  /** Whether the input has an error */
  error?: boolean
  /** Assistive message type — defaults to 'assistive' for helper text, 'error' for errors */
  assistiveType?: AssistiveMessageType
  /** Character counter string (e.g. "12/30") — passed to AssistiveMessage */
  counter?: string
  /** Visual size (height) */
  size?: 'sm' | 'md' | 'lg'
  /** Content-based width preset. Overrides fullWidth when set. */
  width?: InputWidth
  /** Full-width mode (shorthand for width="full") */
  fullWidth?: boolean
  /** Left icon/element */
  startAdornment?: React.ReactNode
  /** Right icon/element */
  endAdornment?: React.ReactNode
  /** Change handler */
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void
  /** Whether the field is required */
  required?: boolean
}

// =============================================================================
// SIZE CONFIG
// =============================================================================

const sizeConfig = {
  sm: {
    height: '36px',
    padding: `0 ${spacing.sm}`,
    fontSize: typography.body.sm.fontSize,   // 14px — Figma: Small (36px)
    lineHeight: typography.body.sm.lineHeight,
  },
  md: {
    height: '40px',
    padding: `0 ${spacing.sm}`,
    fontSize: typography.body.md.fontSize,   // 16px — Figma: Default (40px)
    lineHeight: typography.body.md.lineHeight,
  },
  lg: {
    height: '48px',
    padding: `0 ${spacing.md}`,
    fontSize: typography.body.md.fontSize,   // 16px — Figma: Large (48px)
    lineHeight: typography.body.md.lineHeight,
  },
} as const

// Width presets — content-based sizing
const widthConfig: Record<InputWidth, string> = {
  xs: '72px',    // State codes, 2-char fields
  sm: '120px',   // ZIP codes, short numbers
  md: '280px',   // Default — names, emails
  lg: '400px',   // Longer text, addresses
  full: '100%',  // Fill container
}

// =============================================================================
// COMPONENT: Input
// =============================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      error = false,
      assistiveType,
      counter,
      size = 'md',
      width: widthProp,
      fullWidth = false,
      startAdornment,
      endAdornment,
      onChange,
      required = false,
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
    const [isFocused, setIsFocused] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)

    const hasError = error || !!errorMessage

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value, e)
      },
      [onChange]
    )

    const config = sizeConfig[size]

    // Border color
    const borderColor = disabled
      ? colors.border.lowEmphasis.onLight
      : hasError
        ? colors.status.important
        : isFocused
          ? colors.brand.default
          : isHovered
            ? colors.border.highEmphasis.onLight
            : colors.border.midEmphasis.onLight

    // Width resolution: explicit width prop > fullWidth > default (md)
    const resolvedWidth = widthProp
      ? widthConfig[widthProp]
      : fullWidth
        ? '100%'
        : widthConfig.md

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing['2xs'],
      width: resolvedWidth,
      ...style,
    }

    const labelStyles: React.CSSProperties = {
      fontFamily: fontFamilies.body,
      fontSize: typography.label.sm.fontSize,
      fontWeight: fontWeights.medium,
      lineHeight: typography.label.sm.lineHeight,
      color: disabled ? colors.text.disabled.onLight : colors.text.highEmphasis.onLight,
    }

    const inputWrapperStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      height: config.height,
      border: `1.5px solid ${borderColor}`,
      borderRadius: borderRadiusSemantics.input,
      backgroundColor: disabled ? colors.surface.disabled.onLight : colors.surface.light,
      transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      boxShadow: isFocused && !disabled ? `0 0 0 1px ${colors.brand.default}` : undefined,
      overflow: 'hidden',
      cursor: disabled ? 'not-allowed' : 'text',
    }

    // Extract horizontal padding from config (format: "0 Xpx")
    const horizontalPadding = config.padding.split(' ')[1] || config.padding

    const inputStyles: React.CSSProperties = {
      flex: 1,
      height: '100%',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: startAdornment ? spacing['2xs'] : horizontalPadding,
      paddingRight: endAdornment ? spacing['2xs'] : horizontalPadding,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: fontFamilies.body,
      fontSize: config.fontSize,
      fontWeight: fontWeights.regular,
      lineHeight: config.lineHeight,
      color: disabled ? colors.text.disabled.onLight : colors.text.highEmphasis.onLight,
      cursor: disabled ? 'not-allowed' : 'text',
      width: '100%',
    }

    const adornmentStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: disabled ? colors.text.disabled.onLight : colors.text.lowEmphasis.onLight,
      flexShrink: 0,
    }

    // Resolve assistive message type: explicit prop > auto from error state
    const resolvedAssistiveType: AssistiveMessageType = assistiveType
      ? assistiveType
      : hasError
        ? 'error'
        : disabled
          ? 'disabled'
          : 'assistive'

    return (
      <div className={className} style={containerStyles}>
        {label && (
          <label htmlFor={inputId} style={labelStyles}>
            {label}
            {required && <span style={{ color: colors.status.important, marginLeft: '2px' }}>*</span>}
          </label>
        )}
        <div
          style={inputWrapperStyles}
          onMouseEnter={() => !disabled && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {startAdornment && (
            <span style={{ ...adornmentStyles, paddingLeft: spacing.xs }}>
              {startAdornment}
            </span>
          )}
          {/*
            Compose aria-describedby from internal (errorMessage / helperText)
            AND external (props['aria-describedby']) so callers like dialogs can
            link their own status/live regions without silently muting the Input's
            own error text. Space-separated, filter falsy, dedupe.
            Also compose aria-invalid so either source can mark the field invalid.
          */}
          {(() => {
            const {
              'aria-describedby': externalDescribedBy,
              'aria-invalid': externalInvalid,
              ...restProps
            } = props as React.InputHTMLAttributes<HTMLInputElement>

            const internalIds = [
              hasError && errorMessage ? `${inputId}-error` : null,
              helperText ? `${inputId}-helper` : null,
            ].filter(Boolean) as string[]

            const describedByIds = [
              ...internalIds,
              ...(externalDescribedBy ? String(externalDescribedBy).split(/\s+/) : []),
            ].filter((id, i, arr) => !!id && arr.indexOf(id) === i)

            const composedDescribedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined
            const composedInvalid =
              externalInvalid !== undefined ? externalInvalid : (hasError || undefined)

            return (
              <input
                ref={ref}
                id={inputId}
                disabled={disabled}
                required={required}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                aria-invalid={composedInvalid}
                aria-describedby={composedDescribedBy}
                style={inputStyles}
                {...restProps}
              />
            )
          })()}
          {endAdornment && (
            <span style={{ ...adornmentStyles, paddingRight: spacing.xs }}>
              {endAdornment}
            </span>
          )}
        </div>
        {hasError && errorMessage && (
          <AssistiveMessage
            id={`${inputId}-error`}
            type={resolvedAssistiveType}
            counter={counter}
          >
            {errorMessage}
          </AssistiveMessage>
        )}
        {!hasError && helperText && (
          <AssistiveMessage
            id={`${inputId}-helper`}
            type={resolvedAssistiveType}
            counter={counter}
          >
            {helperText}
          </AssistiveMessage>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
