'use client'

import React, { forwardRef, Children, isValidElement, cloneElement } from 'react'
import { spacing } from '../../styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

export interface ChipGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gap between chips */
  gap?: 'sm' | 'md'
  /** Wrap chips to next line when they overflow */
  wrap?: boolean
  /** Children (Chip components) */
  children: React.ReactNode
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ChipGroup
 *
 * A container that arranges Chip components in a horizontal row with consistent
 * spacing. Supports wrapping to multiple lines. Automatically applies
 * role="listbox" semantics and sets `_inGroup` on child Chips so they
 * use the correct `role="option"` ARIA pattern.
 *
 * @example
 * <ChipGroup aria-label="Filter by category">
 *   <Chip>Label 1</Chip>
 *   <Chip>Label 2</Chip>
 *   <Chip selected>Label 3</Chip>
 * </ChipGroup>
 */
export const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(
  (
    {
      gap = 'sm',
      wrap = true,
      children,
      className,
      style,
      role = 'listbox',
      'aria-label': ariaLabel = 'Chip group',
      ...props
    },
    ref
  ) => {
    const gapValue = gap === 'sm' ? spacing.xs : spacing.sm

    const groupStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: gapValue,
      flexWrap: wrap ? 'wrap' : 'nowrap',
      ...style,
    }

    // Inject _inGroup prop into child Chip components for correct ARIA semantics
    const enhancedChildren = Children.map(children, (child) => {
      if (isValidElement(child) && (child.type as any)?.displayName === 'Chip') {
        return cloneElement(child as React.ReactElement<any>, { _inGroup: true })
      }
      return child
    })

    return (
      <div
        ref={ref}
        role={role}
        aria-label={ariaLabel}
        className={className}
        style={groupStyles}
        {...props}
      >
        {enhancedChildren}
      </div>
    )
  }
)

ChipGroup.displayName = 'ChipGroup'

export default ChipGroup
