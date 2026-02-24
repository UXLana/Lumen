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
// COLOR CONFIGURATIONS (hardcoded values since statusColors removed)
// =============================================================================

const colorConfig: Record<BadgeColor, {
  filled: { background: string; text: string; border: string }
  outlined: { background: string; text: string; border: string }
  subtle: { background: string; text: string; border: string }
}> = {
  neutral: {
    filled: {
      background: '#666666',
      text: '#FFFFFF',
      border: '#666666',
    },
    outlined: {
      background: 'transparent',
      text: '#666666',
      border: '#BDBDBD',
    },
    subtle: {
      background: '#F0F0F0',
      text: '#666666',
      border: 'transparent',
    },
  },
  success: {
    filled: {
      background: '#1B7F66',
      text: '#FFFFFF',
      border: '#1B7F66',
    },
    outlined: {
      background: 'transparent',
      text: '#1B7F66',
      border: '#1B7F66',
    },
    subtle: {
      background: '#DEEDE9',
      text: '#155E4C',
      border: 'transparent',
    },
  },
  warning: {
    filled: {
      background: '#D17600',
      text: '#FFFFFF',
      border: '#D17600',
    },
    outlined: {
      background: 'transparent',
      text: '#9A5700',
      border: '#D17600',
    },
    subtle: {
      background: '#F9ECDC',
      text: '#9A5700',
      border: 'transparent',
    },
  },
  error: {
    filled: {
      background: '#DC0C22',
      text: '#FFFFFF',
      border: '#DC0C22',
    },
    outlined: {
      background: 'transparent',
      text: '#DC0C22',
      border: '#DC0C22',
    },
    subtle: {
      background: '#FBE4E7',
      text: '#9A0818',
      border: 'transparent',
    },
  },
  info: {
    filled: {
      background: '#6E61FF',
      text: '#FFFFFF',
      border: '#6E61FF',
    },
    outlined: {
      background: 'transparent',
      text: '#6E61FF',
      border: '#6E61FF',
    },
    subtle: {
      background: '#EBEFFF',
      text: '#4338CA',
      border: 'transparent',
    },
  },
  brand: {
    filled: {
      background: colors.brand.default,
      text: '#FFFFFF',
      border: colors.brand.default,
    },
    outlined: {
      background: 'transparent',
      text: colors.brand.default,
      border: colors.brand.default,
    },
    subtle: {
      background: '#E7F2EE',
      text: colors.brand.default,
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
    padding: `2px 8px`,
    fontSize: typography.body.xs.fontSize,
    lineHeight: typography.body.xs.lineHeight,
    iconSize: '12px',
    gap: spacing['2xs'],
  },
  md: {
    padding: `4px 10px`,
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
      borderRadius: '8px',
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
