'use client'

import React, { useState } from 'react'
import {
  colors,
  typography,
  borderRadius,
  transitionPresets,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Individual segment item
 */
export interface SegmentItem {
  /** Unique identifier for the segment */
  id: string
  /** Segment label text */
  label: string
  /** Whether the segment is disabled */
  disabled?: boolean
}

/**
 * SegmentedControl size variants
 */
export type SegmentedControlSize = 'sm' | 'md' | 'lg'

/**
 * SegmentedControl component props
 */
export interface SegmentedControlProps {
  /** Array of segment items */
  segments: SegmentItem[]
  /** Currently selected segment ID */
  value: string
  /** Callback when segment changes */
  onChange: (segmentId: string) => void
  /** Size variant */
  size?: SegmentedControlSize
  /** Full width mode */
  fullWidth?: boolean
  /** Whether displayed on dark surface */
  onDark?: boolean
  /** Additional class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

// =============================================================================
// SIZE CONFIGURATION
// =============================================================================

const sizeConfig = {
  sm: {
    height: '32px',
    padding: '4px',
    segmentPadding: '8px 12px',
    fontSize: typography.label.sm.fontSize,
    fontWeight: typography.label.sm.fontWeight,
    lineHeight: typography.label.sm.lineHeight,
    borderRadius: borderRadius.md,
    segmentBorderRadius: borderRadius.sm,
  },
  md: {
    height: '40px',
    padding: '4px',
    segmentPadding: '8px 16px',
    fontSize: typography.label.md.fontSize,
    fontWeight: typography.label.md.fontWeight,
    lineHeight: typography.label.md.lineHeight,
    borderRadius: borderRadius.lg,
    segmentBorderRadius: borderRadius.md,
  },
  lg: {
    height: '48px',
    padding: '4px',
    segmentPadding: '12px 20px',
    fontSize: typography.label.md.fontSize,
    fontWeight: typography.label.md.fontWeight,
    lineHeight: typography.label.md.lineHeight,
    borderRadius: borderRadius.xl,
    segmentBorderRadius: borderRadius.lg,
  },
}

// =============================================================================
// SEGMENTED CONTROL COMPONENT
// =============================================================================

/**
 * SegmentedControl Component
 *
 * A toggle button group that allows users to select one option from a set.
 * Similar to iOS segmented controls or toggle button groups.
 *
 * @example
 * // Basic usage
 * <SegmentedControl
 *   segments={[
 *     { id: 'daily', label: 'Daily' },
 *     { id: 'weekly', label: 'Weekly' },
 *     { id: 'monthly', label: 'Monthly' },
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 * />
 *
 * @example
 * // Full width
 * <SegmentedControl
 *   segments={segments}
 *   value={selected}
 *   onChange={setSelected}
 *   fullWidth
 *   size="lg"
 * />
 */
export function SegmentedControl({
  segments,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  onDark = false,
  className,
  style,
}: SegmentedControlProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const config = sizeConfig[size]

  // Container styles
  const containerStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: config.padding,
    background: onDark ? 'rgba(255, 255, 255, 0.1)' : colors.neutral[100],
    borderRadius: config.borderRadius,
    gap: '4px',
    ...(fullWidth && { width: '100%' }),
    ...style,
  }

  // Segment button styles
  const getSegmentStyles = (segment: SegmentItem): React.CSSProperties => {
    const isSelected = value === segment.id
    const isHovered = hoveredId === segment.id && !isSelected
    const isDisabled = segment.disabled

    return {
      // Reset
      border: 'none',
      outline: 'none',
      cursor: isDisabled ? 'not-allowed' : 'pointer',

      // Layout
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: config.segmentPadding,
      ...(fullWidth && { flex: 1 }),

      // Typography
      fontFamily: typography.label.md.fontFamily,
      fontSize: config.fontSize,
      fontWeight: isSelected ? 600 : config.fontWeight,
      lineHeight: config.lineHeight,
      whiteSpace: 'nowrap',

      // Colors
      background: isSelected
        ? onDark ? 'rgba(255, 255, 255, 0.95)' : 'white'
        : isHovered
          ? onDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
          : 'transparent',
      color: isDisabled
        ? colors.text.disabled
        : isSelected
          ? colors.text.highEmphasis
          : onDark
            ? 'rgba(255, 255, 255, 0.7)'
            : colors.text.mediumEmphasis,

      // Shape
      borderRadius: config.segmentBorderRadius,

      // Shadow for selected state
      boxShadow: isSelected
        ? '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)'
        : 'none',

      // Transition
      transition: transitionPresets.default,

      // Opacity for disabled
      opacity: isDisabled ? 0.5 : 1,
    }
  }

  return (
    <div className={className} style={containerStyles} role="group">
      {segments.map((segment) => (
        <button
          key={segment.id}
          style={getSegmentStyles(segment)}
          onClick={() => !segment.disabled && onChange(segment.id)}
          onMouseEnter={() => setHoveredId(segment.id)}
          onMouseLeave={() => setHoveredId(null)}
          disabled={segment.disabled}
          role="radio"
          aria-checked={value === segment.id}
        >
          {segment.label}
        </button>
      ))}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export default SegmentedControl
