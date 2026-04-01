'use client'

import React from 'react'
import {
  colors,
  spacing,
  typography,
  fontWeights,
  borderRadius,
  transitionPresets,
} from '../../styles/design-tokens'
import { Switch } from '../Switch'
import { IconDrag, IconArrowUp, IconArrowDown } from '../Icons'
import type { ColumnConfig, ColumnManagerTab } from './useColumnManager'

// =============================================================================
// TYPES
// =============================================================================

export interface ColumnItemProps {
  column: ColumnConfig
  index: number
  totalCount: number
  activeTab: ColumnManagerTab
  onToggle: (id: string) => void
  onMove: (fromIndex: number, toIndex: number) => void
  onDragStart: (index: number) => void
  onDragOver: (index: number) => void
  onDragEnd: () => void
  isDragging: boolean
  isDragOver: boolean
}

// =============================================================================
// REORDER BUTTON
// =============================================================================

function ReorderButton({
  onClick,
  disabled,
  'aria-label': ariaLabel,
  children,
}: {
  onClick: () => void
  disabled: boolean
  'aria-label': string
  children: React.ReactNode
}) {
  const [isInteracting, setIsInteracting] = React.useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseEnter={() => !disabled && setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => !disabled && setIsInteracting(true)}
      onBlur={() => setIsInteracting(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        padding: 0,
        border: 'none',
        borderRadius: borderRadius.sm,
        backgroundColor: isInteracting ? colors.surface.lightDarker : 'transparent',
        color: disabled
          ? colors.text.disabled.onLight
          : isInteracting
            ? colors.text.highEmphasis.onLight
            : colors.text.lowEmphasis.onLight,
        cursor: disabled ? 'default' : 'pointer',
        transition: `background-color ${transitionPresets.fast}, color ${transitionPresets.fast}`,
        // Focus ring — 2px brand outline, offset for breathing room
        outline: 'none',
        boxShadow: isInteracting && !disabled
          ? `0 0 0 2px ${colors.brand.default}`
          : 'none',
      }}
    >
      {children}
    </button>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ColumnItem({
  column,
  index,
  totalCount,
  activeTab,
  onToggle,
  onMove,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  isDragOver,
}: ColumnItemProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const isOrder = activeTab === 'order'

  return (
    <div
      draggable={isOrder}
      onDragStart={isOrder ? (e) => {
        e.dataTransfer.effectAllowed = 'move'
        onDragStart(index)
      } : undefined}
      onDragOver={isOrder ? (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        onDragOver(index)
      } : undefined}
      onDragEnd={isOrder ? onDragEnd : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="listitem"
      aria-label={`${column.label}${column.visible ? ', visible' : ', hidden'}${column.locked ? ', locked' : ''}${isOrder ? `, position ${index + 1} of ${totalCount}` : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${spacing.xs} ${spacing.sm}`,
        borderRadius: borderRadius.sm,
        backgroundColor: isDragOver
          ? colors.surface.lightDarker
          : isHovered
          ? colors.surface.lightDarker
          : 'transparent',
        opacity: isDragging ? 0.5 : 1,
        cursor: isOrder ? 'grab' : 'default',
        transition: `background-color ${transitionPresets.fast}, opacity ${transitionPresets.fast}`,
        userSelect: 'none',
      }}
    >
      {/* Left: drag handle (order tab only) + label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Drag handle — only on order tab */}
        {isOrder && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              flexShrink: 0,
              color: colors.text.disabled.onLight,
              cursor: 'grab',
              borderRadius: borderRadius.xs,
            }}
            aria-hidden="true"
          >
            <IconDrag size="sm" />
          </span>
        )}

        {/* Column name */}
        <span
          style={{
            ...typography.body.sm,
            fontWeight: fontWeights.medium,
            color: column.visible
              ? colors.text.highEmphasis.onLight
              : colors.text.lowEmphasis.onLight,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {column.label}
        </span>
      </div>

      {/* Right: action based on active tab */}
      {activeTab === 'visibility' && (
        <Switch
          checked={column.visible}
          onChange={() => onToggle(column.id)}
          disabled={column.locked}
          aria-label={`Toggle ${column.label} visibility`}
        />
      )}

      {isOrder && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing['2xs'],
            flexShrink: 0,
          }}
        >
          {/* Position number */}
          <span
            style={{
              ...typography.body.xs,
              color: colors.text.disabled.onLight,
              minWidth: '20px',
              textAlign: 'center',
            }}
          >
            {index + 1}
          </span>

          <ReorderButton
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0}
            aria-label={`Move ${column.label} up`}
          >
            <IconArrowUp size="sm" />
          </ReorderButton>

          <ReorderButton
            onClick={() => onMove(index, index + 1)}
            disabled={index === totalCount - 1}
            aria-label={`Move ${column.label} down`}
          >
            <IconArrowDown size="sm" />
          </ReorderButton>
        </div>
      )}
    </div>
  )
}
