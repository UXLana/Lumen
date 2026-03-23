'use client'

import React, { forwardRef } from 'react'
import { TabBar, DataTable, Button } from '@/components'
import type { TabItem } from '@/components'
import { spacing } from '@/styles/design-tokens'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CollectionToolbarTab {
  id: string
  label: string
  icon?: React.ReactNode
}

export interface CollectionToolbarAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  emphasis?: 'high' | 'mid' | 'low'
}

export interface CollectionToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  // ── Tabs (Row 1 left) ──────────────────────────────────────────────────
  /** Tab definitions. Omit or pass empty array to hide tabs. */
  tabs?: CollectionToolbarTab[]
  /** Currently active tab id */
  activeTab?: string
  /** Called when a tab is clicked */
  onTabChange?: (tabId: string) => void
  /** Explicitly hide tabs even if `tabs` are provided */
  showTabs?: boolean

  // ── Action button (Row 1 right) ────────────────────────────────────────
  /** Primary action(s) next to tabs. Omit to hide. */
  actions?: CollectionToolbarAction[]
  /** Explicitly hide actions */
  showActions?: boolean

  // ── DataTable Toolbar (Row 2) ──────────────────────────────────────────
  /** Show the DataTable.Toolbar row. Default: true */
  showToolbar?: boolean

  // ── Selection / Bulk actions ───────────────────────────────────────────
  /** Number of currently selected items. 0 = no selection bar shown. */
  selectedCount?: number
  /** Called when user clicks the clear (×) on the selection info */
  onClearSelection?: () => void
  /** Bulk action buttons rendered inside SelectionInfo */
  bulkActions?: React.ReactNode
  /** Explicitly hide selection info even when selectedCount > 0 */
  showSelection?: boolean

  // ── Filter ─────────────────────────────────────────────────────────────
  /** Show the filter button. Default: true */
  showFilter?: boolean
  /** Whether a filter drawer/panel is currently active */
  isFilterActive?: boolean
  /** Number of active filter categories (shows badge) */
  filterCount?: number
  /** Called when user clicks the filter button */
  onFilterClick?: () => void

  // ── Sort ───────────────────────────────────────────────────────────────
  /** Show the sort button. Default: true */
  showSort?: boolean
  /** Called when user clicks the sort button */
  onSortClick?: () => void

  // ── View Toggle ────────────────────────────────────────────────────────
  /** Show the cards/table toggle. Default: true */
  showViewToggle?: boolean
  /** Current view mode */
  viewMode?: 'cards' | 'table'
  /** Called when the view toggle is changed */
  onViewModeChange?: (mode: 'cards' | 'table') => void

  // ── Active filter chips (Row 3) ────────────────────────────────────────
  /** Render active filter chips below the toolbar. Pass a ReactNode (e.g. your ActiveFilters component). */
  filterChips?: React.ReactNode
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const CollectionToolbar = forwardRef<HTMLDivElement, CollectionToolbarProps>(
  (
    {
      // Tabs
      tabs,
      activeTab,
      onTabChange,
      showTabs = true,

      // Actions
      actions,
      showActions = true,

      // Toolbar
      showToolbar = true,

      // Selection
      selectedCount = 0,
      onClearSelection,
      bulkActions,
      showSelection = true,

      // Filter
      showFilter = true,
      isFilterActive = false,
      filterCount = 0,
      onFilterClick,

      // Sort
      showSort = true,
      onSortClick,

      // View toggle
      showViewToggle = true,
      viewMode = 'cards',
      onViewModeChange,

      // Filter chips
      filterChips,

      // HTML
      style,
      ...props
    },
    ref,
  ) => {
    const hasTabs = showTabs && tabs && tabs.length > 0
    const hasActions = showActions && actions && actions.length > 0
    const hasHeaderRow = hasTabs || hasActions

    const hasToolbarRight = showFilter || showSort || showViewToggle
    const hasToolbarLeft = showSelection && selectedCount > 0

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.md,
          ...style,
        }}
        role="toolbar"
        aria-label="Collection controls"
        {...props}
      >
        {/* ── Row 1: Tabs + Action Button ─────────────────────────────── */}
        {hasHeaderRow && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.md,
            }}
          >
            {hasTabs && (
              <TabBar
                tabs={tabs as TabItem[]}
                activeTab={activeTab ?? tabs[0]?.id ?? ''}
                onTabChange={onTabChange ?? (() => {})}
                align="left"
                hasDivider={false}
              />
            )}

            {hasActions && (
              <div
                style={{
                  display: 'flex',
                  gap: spacing.sm,
                  paddingBottom: spacing.xs,
                }}
              >
                {actions.map((action, i) => (
                  <Button
                    key={action.label}
                    emphasis={action.emphasis ?? 'high'}
                    leftIcon={action.icon}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Row 2: DataTable Toolbar ─────────────────────────────────── */}
        {showToolbar && (hasToolbarLeft || hasToolbarRight) && (
          <DataTable.Toolbar>
            <DataTable.Toolbar.Left>
              {showSelection && (
                <DataTable.SelectionInfo
                  count={selectedCount}
                  onClear={onClearSelection}
                >
                  {bulkActions}
                </DataTable.SelectionInfo>
              )}
            </DataTable.Toolbar.Left>
            <DataTable.Toolbar.Right>
              {showFilter && (
                <DataTable.FilterButton
                  active={isFilterActive || filterCount > 0}
                  count={filterCount}
                  onClick={onFilterClick}
                />
              )}
              {showSort && (
                <DataTable.SortButton
                  onClick={onSortClick}
                />
              )}
              {showViewToggle && (
                <DataTable.ViewToggle
                  value={viewMode}
                  onChange={onViewModeChange ?? (() => {})}
                />
              )}
            </DataTable.Toolbar.Right>
          </DataTable.Toolbar>
        )}

        {/* ── Row 3: Active filter chips ──────────────────────────────── */}
        {filterChips}
      </div>
    )
  },
)

CollectionToolbar.displayName = 'CollectionToolbar'
