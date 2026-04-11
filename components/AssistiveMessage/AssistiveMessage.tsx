'use client'

import React, { forwardRef } from 'react'
import { assistiveMessage as tokens, spacing } from '../../styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

export type AssistiveMessageType =
  | 'assistive'
  | 'disabled'
  | 'error'
  | 'error-overflow'
  | 'warning'
  | 'success'
  | 'info'

/** Icon display size */
export type AssistiveMessageIconSize = 16 | 24

export interface AssistiveMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual type / state of the message */
  type?: AssistiveMessageType
  /** The assistive / helper text content */
  children: React.ReactNode
  /** Show a character counter (e.g. "12/30") */
  counter?: string
  /** Override the default icon for the current type (pass `null` to hide) */
  icon?: React.ReactNode | null
  /** Icon size — 16 (inline with form fields) or 24 (standalone) */
  iconSize?: AssistiveMessageIconSize
  /** Add left padding to align with input content (e.g. when used below a labeled Input) */
  indent?: boolean
}

// =============================================================================
// ICON SVGs — 24×24 viewBox, rendered at iconSize prop
// Matched to Figma node 32-10882
// =============================================================================

interface IconComponentProps {
  color: string
  size?: number
}

/** Error — diamond/rotated square with exclamation. Figma node 11:5905 */
const ErrorFilledIcon: React.FC<IconComponentProps> = ({ color, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.67 10.382L10.382 0.67C11.275-0.223 12.725-0.223 13.618 0.67L23.33 10.382C24.223 11.275 24.223 12.725 23.33 13.618L13.618 23.33C12.725 24.223 11.275 24.223 10.382 23.33L0.67 13.618C-0.223 12.725-0.223 11.275 0.67 10.382ZM11.997 18.895C11.037 18.895 10.263 18.122 10.263 17.162C10.263 16.202 11.037 15.429 11.997 15.429C12.957 15.429 13.731 16.202 13.731 17.162C13.731 18.122 12.957 18.895 11.997 18.895ZM10.669 12.381C10.669 13.114 11.269 13.714 12.003 13.714C12.736 13.714 13.337 13.114 13.337 12.381V7.047C13.337 6.314 12.736 5.714 12.003 5.714C11.269 5.714 10.669 6.314 10.669 7.047V12.381Z"
      fill={color}
    />
  </svg>
)

/** Warning — triangle with exclamation. Figma node 11:5913 */
const WarningIcon: React.FC<IconComponentProps> = ({ color, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M9.2 1.435C10.252-0.478 13.002-0.478 14.054 1.435L22.904 17.553C23.919 19.399 22.564 21.657 20.462 21.657H2.773C0.67 21.657-0.684 19.399 0.331 17.553L9.2 1.435ZM11.628 14.865C10.779 14.865 10.09 15.554 10.09 16.403C10.09 17.253 10.779 17.945 11.628 17.945C12.477 17.945 13.167 17.253 13.167 16.403C13.167 15.554 12.477 14.865 11.628 14.865ZM11.628 5.636C10.949 5.636 10.399 6.188 10.399 6.868V11.788C10.399 12.468 10.949 13.02 11.628 13.02C12.307 13.02 12.858 12.468 12.858 11.788V6.868C12.858 6.188 12.307 5.636 11.628 5.636Z"
      fill={color}
    />
  </svg>
)

/** Success — circle with checkmark. Figma node 11:5923 */
const SuccessIcon: React.FC<IconComponentProps> = ({ color, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM17.56 9.97a1 1 0 0 0-1.414-1.414L10.5 14.2l-2.646-2.646a1 1 0 0 0-1.414 1.414l3.353 3.353a1 1 0 0 0 1.414 0l6.353-6.353Z"
      fill={color}
    />
  </svg>
)

/** Info — circle with "i" symbol. Figma node 11:5930 */
const InfoFilledIcon: React.FC<IconComponentProps> = ({ color, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM10.8 11.4C10.8 10.737 11.337 10.2 12 10.2C12.663 10.2 13.2 10.737 13.2 11.4V17.4C13.2 18.063 12.663 18.6 12 18.6C11.337 18.6 10.8 18.063 10.8 17.4V11.4ZM12 5.4C11.173 5.4 10.5 6.073 10.5 6.9C10.5 7.727 11.173 8.4 12 8.4C12.827 8.4 13.5 7.727 13.5 6.9C13.5 6.073 12.827 5.4 12 5.4Z"
      fill={color}
    />
  </svg>
)

// =============================================================================
// TOKEN KEY MAPPING — maps component type to design token key
// =============================================================================

const typeToTokenKey: Record<AssistiveMessageType, keyof typeof tokens.types> = {
  assistive: 'assistive',
  disabled: 'disabled',
  error: 'error',
  'error-overflow': 'errorOverflow',
  warning: 'warning',
  success: 'success',
  info: 'info',
}

const iconForType: Record<AssistiveMessageType, React.FC<IconComponentProps> | null> = {
  assistive: null,
  disabled: null,
  error: ErrorFilledIcon,
  'error-overflow': ErrorFilledIcon,
  warning: WarningIcon,
  success: SuccessIcon,
  info: InfoFilledIcon,
}

// =============================================================================
// ARIA role mapping
// =============================================================================

const ariaRoleForType: Partial<Record<AssistiveMessageType, string>> = {
  error: 'alert',
  'error-overflow': 'alert',
  warning: 'alert',
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * AssistiveMessage
 *
 * A small helper / validation message shown beneath form fields.
 * Supports 7 visual types matching the Lumen Design System Figma spec
 * (node 32-10882): Assistive, Disabled, Error, Error-Overflow,
 * Warning, Success, and Info.
 *
 * All colors and typography are sourced from design tokens.
 *
 * @example
 * <AssistiveMessage>Enter your full legal name</AssistiveMessage>
 * <AssistiveMessage type="error">This field is required</AssistiveMessage>
 * <AssistiveMessage type="error-overflow" counter="35/30">Too many characters</AssistiveMessage>
 * <AssistiveMessage type="success">Looks good!</AssistiveMessage>
 * <AssistiveMessage type="warning" iconSize={24}>Please review</AssistiveMessage>
 */
export const AssistiveMessage = forwardRef<HTMLDivElement, AssistiveMessageProps>(
  (
    {
      type = 'assistive',
      children,
      counter,
      icon,
      iconSize = 16,
      indent = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const tokenKey = typeToTokenKey[type]
    const ts = tokens.types[tokenKey]
    const IconComponent = icon === undefined ? iconForType[type] : null
    const customIcon = icon !== undefined ? icon : undefined
    const role = ariaRoleForType[type]

    const rootStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: ts.gap,
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight,
      lineHeight: tokens.typography.lineHeight,
      letterSpacing: tokens.typography.letterSpacing,
      paddingLeft: indent ? spacing.sm : spacing.xs,
      ...style,
    }

    const textStyles: React.CSSProperties = {
      flex: 1,
      minWidth: 0,
      color: ts.textColor,
    }

    const counterStyles: React.CSSProperties = {
      flexShrink: 0,
      color: ts.counterColor,
    }

    // Icon wrapper height matches line-height for vertical alignment
    const iconWrapperStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: `${iconSize}px`,
      height: tokens.typography.lineHeight,
      flexShrink: 0,
    }

    return (
      <div
        ref={ref}
        className={className}
        style={rootStyles}
        role={role}
        aria-live={role === 'alert' ? 'assertive' : undefined}
        {...props}
      >
        {IconComponent && ts.iconColor && (
          <span style={iconWrapperStyles}>
            <IconComponent color={ts.iconColor} size={iconSize} />
          </span>
        )}
        {customIcon !== undefined && customIcon !== null && (
          <span style={iconWrapperStyles}>{customIcon}</span>
        )}

        <span style={textStyles}>{children}</span>

        {counter && <span style={counterStyles}>{counter}</span>}
      </div>
    )
  }
)

AssistiveMessage.displayName = 'AssistiveMessage'

export default AssistiveMessage
