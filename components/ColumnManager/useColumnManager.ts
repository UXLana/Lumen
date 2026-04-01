'use client'

import { useState, useCallback, useMemo } from 'react'

// =============================================================================
// TYPES
// =============================================================================

export interface ColumnConfig {
  /** Unique column identifier */
  id: string
  /** Display label */
  label: string
  /** Whether the column is visible */
  visible: boolean
  /** Whether this column can be hidden (e.g. primary key column) */
  locked?: boolean
}

export type ColumnManagerTab = 'visibility' | 'order'

export interface UseColumnManagerOptions {
  /** Initial column configuration */
  columns: ColumnConfig[]
  /** Called when user applies changes */
  onApply?: (columns: ColumnConfig[]) => void
  /** Called when user resets to default */
  onReset?: () => void
}

export interface UseColumnManagerReturn {
  /** Current working copy of columns */
  columns: ColumnConfig[]
  /** Active tab */
  activeTab: ColumnManagerTab
  /** Search query */
  searchQuery: string
  /** Filtered columns based on search and visibility (order tab shows only visible) */
  filteredColumns: ColumnConfig[]
  /** Number of visible columns */
  visibleCount: number
  /** Total columns */
  totalCount: number
  /** Set the active tab */
  setActiveTab: (tab: ColumnManagerTab) => void
  /** Set the search query */
  setSearchQuery: (query: string) => void
  /** Toggle a column's visibility */
  toggleColumn: (id: string) => void
  /** Move a column to a new position */
  moveColumn: (fromIndex: number, toIndex: number) => void
  /** Show all columns */
  showAll: () => void
  /** Hide all unlocked columns */
  hideAll: () => void
  /** Apply changes */
  apply: () => void
  /** Reset to initial state */
  reset: () => void
  /** Whether changes have been made */
  hasChanges: boolean
}

// =============================================================================
// HOOK
// =============================================================================

export function useColumnManager(options: UseColumnManagerOptions): UseColumnManagerReturn {
  const { columns: initialColumns, onApply, onReset } = options

  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns)
  const [activeTab, setActiveTab] = useState<ColumnManagerTab>('visibility')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredColumns = useMemo(() => {
    let result = columns
    // Order tab only shows visible columns
    if (activeTab === 'order') {
      result = result.filter((col) => col.visible)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((col) => col.label.toLowerCase().includes(q))
    }
    return result
  }, [columns, activeTab, searchQuery])

  const visibleCount = useMemo(
    () => columns.filter((c) => c.visible).length,
    [columns]
  )

  const hasChanges = useMemo(() => {
    return JSON.stringify(columns) !== JSON.stringify(initialColumns)
  }, [columns, initialColumns])

  const toggleColumn = useCallback((id: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === id && !col.locked ? { ...col, visible: !col.visible } : col
      )
    )
  }, [])

  const moveColumn = useCallback((fromIndex: number, toIndex: number) => {
    setColumns((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }, [])

  const showAll = useCallback(() => {
    setColumns((prev) => prev.map((col) => ({ ...col, visible: true })))
  }, [])

  const hideAll = useCallback(() => {
    setColumns((prev) =>
      prev.map((col) => (col.locked ? col : { ...col, visible: false }))
    )
  }, [])

  const apply = useCallback(() => {
    onApply?.(columns)
  }, [columns, onApply])

  const reset = useCallback(() => {
    setColumns(initialColumns)
    setSearchQuery('')
    onReset?.()
  }, [initialColumns, onReset])

  return {
    columns,
    activeTab,
    searchQuery,
    filteredColumns,
    visibleCount,
    totalCount: columns.length,
    setActiveTab,
    setSearchQuery,
    toggleColumn,
    moveColumn,
    showAll,
    hideAll,
    apply,
    reset,
    hasChanges,
  }
}
