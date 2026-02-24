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

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  /** Label text displayed next to the radio */
  label?: string
  /** Metadata/description text below the label */
  metadata?: string
  /** Controlled checked state */
  checked?: boolean
  /** Change handler */
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void
  /** The value for this radio option */
  value: string
  /** Full-width mode */
  fullWidth?: boolean
  /** Remove rounded corners on container (for custom pattern building) */
  noRoundedCorners?: boolean
  /** Error state */
  error?: boolean
}

export interface RadioGroupProps {
  /** Group label */
  label?: string
  /** Currently selected value */
  value?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Error message text */
  errorMessage?: string
  /** Whether to show error state */
  error?: boolean
  /** Full-width mode */
  fullWidth?: boolean
  /** Layout direction */
  direction?: 'vertical' | 'horizontal'
  /** Group name (auto-generated if not provided) */
  name?: string
  /** Children (Radio components) */
  children: React.ReactNode
  /** Additional className */
  className?: string
  /** Additional styles */
  style?: React.CSSProperties
}

// =============================================================================
// COMPONENT: Radio
// =============================================================================

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      metadata,
      checked = false,
      onChange,
      value,
      fullWidth = false,
      noRoundedCorners = false,
      error = false,
      disabled = false,
      name,
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
        onChange?.(value, e)
      },
      [onChange, value]
    )

    // Visual state
    const circleBorderColor = disabled
      ? colors.border.lowEmphasis.onLight
      : error
        ? colors.status.important
        : checked
          ? colors.brand.default
          : isHovered
            ? colors.border.highEmphasis.onLight
            : colors.border.midEmphasis.onLight
    const circleBackground = disabled && checked
      ? colors.surface.disabled.onLight
      : 'transparent'
    const dotColor = disabled
      ? colors.text.disabled.onLight
      : colors.brand.default

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing.xs,
      padding: `${spacing.xs} ${spacing.sm}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
      borderRadius: noRoundedCorners ? 0 : borderRadius.sm,
      position: 'relative' as const,
      ...style,
    }

    const circleStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '18px',
      height: '18px',
      minWidth: '18px',
      borderRadius: borderRadius.full,
      border: `1.5px solid ${circleBorderColor}`,
      backgroundColor: circleBackground,
      transition: 'all 0.15s ease',
      marginTop: '1px',
    }

    const focusRingStyles: React.CSSProperties = isFocusVisible
      ? {
          outline: `2px solid ${colors.brand.default}`,
          outlineOffset: '2px',
          borderRadius: borderRadius.full,
        }
      : {}

    const dotStyles: React.CSSProperties = {
      width: '8px',
      height: '8px',
      borderRadius: borderRadius.full,
      backgroundColor: dotColor,
      transition: 'transform 0.15s ease',
      transform: checked ? 'scale(1)' : 'scale(0)',
    }

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
          type="radio"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          onFocus={(e) => {
            if (e.target.matches(':focus-visible')) setIsFocusVisible(true)
          }}
          onBlur={() => setIsFocusVisible(false)}
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
        <span style={{ ...circleStyles, ...focusRingStyles }} aria-hidden="true">
          <span style={dotStyles} />
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

Radio.displayName = 'Radio'

// =============================================================================
// COMPONENT: RadioGroup
// =============================================================================

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      label,
      value,
      onChange,
      errorMessage,
      error = false,
      fullWidth = false,
      direction = 'vertical',
      name: providedName,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const groupId = useId()
    const groupName = providedName || groupId

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      width: fullWidth ? '100%' : 'auto',
      marginBottom: spacing.md,
      ...style,
    }

    const labelStyles: React.CSSProperties = {
      fontFamily: fontFamilies.body,
      fontSize: typography.body.sm.fontSize,
      fontWeight: fontWeights.medium,
      lineHeight: typography.body.sm.lineHeight,
      color: colors.text.highEmphasis.onLight,
      marginBottom: spacing['2xs'],
    }

    const itemsStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      gap: direction === 'horizontal' ? spacing.md : undefined,
      flexWrap: direction === 'horizontal' ? 'wrap' : undefined,
    }

    const errorStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: spacing['2xs'],
      fontFamily: fontFamilies.body,
      fontSize: typography.body.xs.fontSize,
      fontWeight: fontWeights.regular,
      lineHeight: typography.body.xs.lineHeight,
      color: colors.status.important,
      marginTop: spacing['2xs'],
    }

    // Clone children to inject name, value, onChange, error props
    const enhancedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement<RadioProps>(child)) {
        return React.cloneElement(child, {
          name: groupName,
          checked: value !== undefined ? child.props.value === value : child.props.checked,
          onChange: onChange
            ? (val: string) => onChange(val)
            : child.props.onChange,
          error: error || child.props.error,
          fullWidth: fullWidth || child.props.fullWidth,
        })
      }
      return child
    })

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-invalid={error || undefined}
        aria-describedby={error && errorMessage ? `${groupId}-error` : undefined}
        className={className}
        style={containerStyles}
        {...props}
      >
        {label && (
          <span id={`${groupId}-label`} style={labelStyles}>
            {label}
          </span>
        )}
        <div style={itemsStyles}>
          {enhancedChildren}
        </div>
        {error && errorMessage && (
          <span id={`${groupId}-error`} role="alert" style={errorStyles}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="7" cy="9.5" r="0.75" fill="currentColor" />
            </svg>
            {errorMessage}
          </span>
        )}
      </div>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

export default Radio
