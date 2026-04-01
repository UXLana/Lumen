'use client'

import React, { forwardRef, useState, useCallback } from 'react'
import {
  colors,
  spacing,
  typography,
  fontWeights,
  borderRadius,
  shadows,
  transitionPresets,
} from '../../styles/design-tokens'
import { TabBar } from '../Tab'
import { Input } from '../Input'
import { Button } from '../Button'
import { IconSearch } from '../Icons'
import { ColumnItem } from './ColumnItem'
import { useColumnManager } from './useColumnManager'
import type { ColumnConfig, ColumnManagerTab, UseColumnManagerOptions } from './useColumnManager'

// =============================================================================
// TYPES
// =============================================================================

export interface ColumnManagerProps {
  /** Column configurations */
  columns: ColumnConfig[]
  /** Called when user clicks Apply */
  onApply?: (columns: ColumnConfig[]) => void
  /** Called when user clicks Reset */
  onReset?: () => void
  /** Title text */
  title?: string
  /** Description text */
  description?: string
  /** Width of the panel */
  width?: number | string
  /** Height of the panel */
  height?: number | string
  /** Additional class name */
  className?: string
  /** Additional styles */
  style?: React.CSSProperties
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ColumnManager = forwardRef<HTMLDivElement, ColumnManagerProps>(
  (
    {
      columns: initialColumns,
      onApply,
      onReset,
      title = 'View settings',
      description = 'Manage visible columns',
      width = 384,
      height = 600,
      className,
      style,
    },
    ref
  ) => {
    const {
      columns,
      activeTab,
      searchQuery,
      filteredColumns,
      visibleCount,
      totalCount,
      setActiveTab,
      setSearchQuery,
      toggleColumn,
      moveColumn,
      showAll,
      hideAll,
      apply,
      reset,
      hasChanges,
    } = useColumnManager({ columns: initialColumns, onApply, onReset })

    // Map a filtered-list index to the full columns array index
    const toFullIndex = useCallback(
      (filteredIdx: number) => {
        const col = filteredColumns[filteredIdx]
        return col ? columns.findIndex((c) => c.id === col.id) : -1
      },
      [columns, filteredColumns]
    )

    // Drag state (stored as filtered indices, resolved on drop)
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

    const handleDragStart = useCallback((index: number) => {
      setDragIndex(index)
    }, [])

    const handleDragOver = useCallback((index: number) => {
      setDragOverIndex(index)
    }, [])

    const handleDragEnd = useCallback(() => {
      if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
        moveColumn(toFullIndex(dragIndex), toFullIndex(dragOverIndex))
      }
      setDragIndex(null)
      setDragOverIndex(null)
    }, [dragIndex, dragOverIndex, moveColumn, toFullIndex])

    // Move using filtered indices (for arrow buttons)
    const handleMove = useCallback(
      (fromFiltered: number, toFiltered: number) => {
        moveColumn(toFullIndex(fromFiltered), toFullIndex(toFiltered))
      },
      [moveColumn, toFullIndex]
    )

    const tabs = [
      { id: 'visibility', label: 'Visibility' },
      { id: 'order', label: 'Order' },
    ]

    return (
      <div
        ref={ref}
        className={className}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          backgroundColor: colors.surface.light,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.xl,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          ...style,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: `${spacing.lg} ${spacing.lg} ${spacing.xs}`,
            flexShrink: 0,
          }}
        >
          <div>
            <h3
              style={{
                ...typography.label.md,
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
                margin: 0,
              }}
            >
              {title}
            </h3>
            <p
              style={{
                ...typography.body.xs,
                color: colors.text.lowEmphasis.onLight,
                margin: `${spacing['2xs']} 0 0`,
              }}
            >
              {description}
            </p>
          </div>
          <Button
            emphasis="low"
            size="md"
            onClick={reset}
            style={{ flexShrink: 0 }}
          >
            Reset
          </Button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            padding: `0 ${spacing.lg}`,
            flexShrink: 0,
          }}
        >
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as ColumnManagerTab)}
            stretched
            hasDivider={false}
          />
        </div>

        {/* Search */}
        <div
          style={{
            padding: `${spacing.xs} ${spacing.sm}`,
            borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
            flexShrink: 0,
          }}
        >
          <Input
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Find a column..."
            size="sm"
            fullWidth
            startAdornment={<IconSearch size="sm" color={colors.text.lowEmphasis.onLight} />}
            aria-label="Search columns"
          />
        </div>

        {/* Column List */}
        <div
          role="list"
          aria-label="Columns"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: `${spacing.xs} ${spacing.xs}`,
          }}
        >
          {/* Show/Hide all toggle for visibility tab */}
          {activeTab === 'visibility' && !searchQuery && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: `0 ${spacing.xs} ${spacing['2xs']}`,
                gap: spacing['2xs'],
                alignItems: 'center',
              }}
            >
              <Button emphasis="low" size="md" onClick={showAll} style={{ padding: 0, minHeight: 'auto' }}>
                Show all
              </Button>
              <span style={{ ...typography.body.xs, color: colors.text.disabled.onLight }}>|</span>
              <Button emphasis="low" size="md" onClick={hideAll} style={{ padding: 0, minHeight: 'auto' }}>
                Hide all
              </Button>
            </div>
          )}

          {filteredColumns.map((col, idx) => (
            <ColumnItem
              key={col.id}
              column={col}
              index={idx}
              totalCount={filteredColumns.length}
              activeTab={activeTab}
              onToggle={toggleColumn}
              onMove={handleMove}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              isDragging={dragIndex === idx}
              isDragOver={dragOverIndex === idx}
            />
          ))}

          {filteredColumns.length === 0 && (
            <div
              style={{
                ...typography.body.sm,
                color: colors.text.lowEmphasis.onLight,
                textAlign: 'center',
                padding: spacing.xl,
              }}
            >
              No columns match your search
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: spacing.sm,
            borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              ...typography.body.xs,
              fontWeight: fontWeights.medium,
              color: colors.text.lowEmphasis.onLight,
              paddingLeft: spacing.xs,
            }}
          >
            {visibleCount} of {totalCount} visible
          </span>
          <Button
            emphasis="high"
            size="md"
            onClick={apply}
          >
            Apply
          </Button>
        </div>
      </div>
    )
  }
)

ColumnManager.displayName = 'ColumnManager'
