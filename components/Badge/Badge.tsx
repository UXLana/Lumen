'use client'

import React, { forwardRef } from 'react'
import {
  colors,
  spacing,
  borderRadius,
  typography,
  fontFamilies,
  fontWeights,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Badge variant determines the visual style
 */
export type BadgeVariant = 'filled' | 'outlined' | 'subtle'

/**
 * Badge color/intent
 */
export type BadgeColor = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'brand'

/**
 * Badge size
 */
export type BadgeSize = 'sm' | 'md'

/**
 * Badge props
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual variant */
  variant?: BadgeVariant
  /** Color/intent of the badge */
  color?: BadgeColor
  /** Size of the badge */
  size?: BadgeSize
  /** Optional icon to display before text */
  icon?: React.ReactNode
  /** Children content (text) */
  children: React.ReactNode
}

// =============================================================================
// COLOR CONFIGURATIONS
// =============================================================================

const colorConfig: Record<BadgeColor, {
  filled: { background: string; text: string; border: string }
  outlined: { background: string; text: string; border: string }
  subtle: { background: string; text: string; border: string }
}> = {
  neutral: {
    filled: {
      background: colors.neutral[700],
      text: '#FFFFFF',
      border: colors.neutral[700],
    },
    outlined: {
      background: 'transparent',
      text: colors.neutral[700],
      border: colors.neutral[400],
    },
    subtle: {
      background: colors.neutral[100],
      text: colors.neutral[700],
      border: 'transparent',
    },
  },
  success: {
    filled: {
      background: colors.semantic.success.main,
      text: '#FFFFFF',
      border: colors.semantic.success.main,
    },
    outlined: {
      background: 'transparent',
      text: colors.semantic.success.main,
      border: colors.semantic.success.main,
    },
    subtle: {
      background: colors.semantic.success.light,
      text: colors.semantic.success.dark,
      border: 'transparent',
    },
  },
  warning: {
    filled: {
      background: colors.semantic.warning.main,
      text: '#FFFFFF',
      border: colors.semantic.warning.main,
    },
    outlined: {
      background: 'transparent',
      text: colors.semantic.warning.dark,
      border: colors.semantic.warning.main,
    },
    subtle: {
      background: colors.semantic.warning.light,
      text: colors.semantic.warning.dark,
      border: 'transparent',
    },
  },
  error: {
    filled: {
      background: colors.semantic.error.main,
      text: '#FFFFFF',
      border: colors.semantic.error.main,
    },
    outlined: {
      background: 'transparent',
      text: colors.semantic.error.main,
      border: colors.semantic.error.main,
    },
    subtle: {
      background: colors.semantic.error.light,
      text: colors.semantic.error.dark,
      border: 'transparent',
    },
  },
  info: {
    filled: {
      background: colors.semantic.info.main,
      text: '#FFFFFF',
      border: colors.semantic.info.main,
    },
    outlined: {
      background: 'transparent',
      text: colors.semantic.info.main,
      border: colors.semantic.info.main,
    },
    subtle: {
      background: colors.semantic.info.light,
      text: colors.semantic.info.dark,
      border: 'transparent',
    },
  },
  brand: {
    filled: {
      background: colors.brand.primary,
      text: '#FFFFFF',
      border: colors.brand.primary,
    },
    outlined: {
      background: 'transparent',
      text: colors.brand.primary,
      border: colors.brand.primary,
    },
    subtle: {
      background: colors.brand.primaryLight,
      text: '#FFFFFF',
      border: 'transparent',
    },
  },
}

// =============================================================================
// SIZE CONFIGURATIONS
// =============================================================================

const sizeConfig: Record<BadgeSize, {
  padding: string
  fontSize: string
  lineHeight: string
  iconSize: string
  gap: string
}> = {
  sm: {
    padding: `2px ${spacing[2]}`,
    fontSize: typography.body.xs.fontSize,
    lineHeight: typography.body.xs.lineHeight,
    iconSize: '12px',
    gap: spacing[1],
  },
  md: {
    padding: `${spacing[1]} 10px`,
    fontSize: typography.body.sm.fontSize,
    lineHeight: typography.body.sm.lineHeight,
    iconSize: '14px',
    gap: '6px',
  },
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Badge
 *
 * A small label component for status indicators, categories, and tags.
 *
 * @example
 * <Badge variant="outlined" color="neutral">Uninstalled</Badge>
 * <Badge variant="subtle" color="success" icon={<IconCheck size="xs" />}>Verified</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'filled',
      color = 'neutral',
      size = 'sm',
      icon,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const colorScheme = colorConfig[color][variant]
    const sizeScheme = sizeConfig[size]

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: sizeScheme.gap,
      padding: sizeScheme.padding,
      fontFamily: fontFamilies.body,
      fontSize: sizeScheme.fontSize,
      fontWeight: fontWeights.medium,
      lineHeight: sizeScheme.lineHeight,
      backgroundColor: colorScheme.background,
      color: colorScheme.text,
      border: `1px solid ${colorScheme.border}`,
      borderRadius: borderRadius.full,
      whiteSpace: 'nowrap',
      ...style,
    }

    const iconStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: sizeScheme.iconSize,
      height: sizeScheme.iconSize,
      flexShrink: 0,
    }

    return (
      <span ref={ref} className={className} style={baseStyles} {...props}>
        {icon && <span style={iconStyles}>{icon}</span>}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
