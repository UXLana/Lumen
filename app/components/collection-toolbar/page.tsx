'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  Playground,
  StyledCheckbox,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import {
  CollectionToolbar,
  DataTable,
} from '@/components'
import { colors, typography, spacing } from '@/styles/design-tokens'

// Inline SVG icons (no lucide-react dependency in the DS)
const PencilIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
)
const Trash2Icon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
  </svg>
)
const PackageIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
  </svg>
)
const PlusIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
)

// =============================================================================
// DOC DATA
// =============================================================================

const docData: ComponentDocData = {
  displayName: 'CollectionToolbar',
  importPath: '@/components',
  importStatement: `import { CollectionToolbar } from '@/components'\nimport type { CollectionToolbarProps, CollectionToolbarTab, CollectionToolbarAction } from '@/components'`,
  description:
    'Configurable toolbar assembly for collection pages. Composes TabBar, Button, and DataTable.Toolbar into a unified layout with toggleable tabs, action buttons, bulk selection, filter/sort controls, and view toggle.',
  props: [
    { name: 'tabs', type: 'CollectionToolbarTab[]', description: 'Tab definitions (id, label, icon). Omit to hide tabs.' },
    { name: 'activeTab', type: 'string', description: 'Currently active tab id' },
    { name: 'onTabChange', type: '(tabId: string) => void', description: 'Tab change callback' },
    { name: 'showTabs', type: 'boolean', default: 'true', description: 'Explicitly hide tabs' },
    { name: 'actions', type: 'CollectionToolbarAction[]', description: 'Action buttons next to tabs (label, icon, onClick, emphasis)' },
    { name: 'showActions', type: 'boolean', default: 'true', description: 'Explicitly hide actions' },
    { name: 'showToolbar', type: 'boolean', default: 'true', description: 'Show the DataTable.Toolbar row' },
    { name: 'selectedCount', type: 'number', default: '0', description: 'Number of selected items' },
    { name: 'onClearSelection', type: '() => void', description: 'Clear selection callback' },
    { name: 'bulkActions', type: 'React.ReactNode', description: 'Bulk action buttons inside SelectionInfo' },
    { name: 'showSelection', type: 'boolean', default: 'true', description: 'Show selection info bar' },
    { name: 'showFilter', type: 'boolean', default: 'true', description: 'Show filter button' },
    { name: 'isFilterActive', type: 'boolean', default: 'false', description: 'Whether filter panel is active' },
    { name: 'filterCount', type: 'number', default: '0', description: 'Active filter count badge' },
    { name: 'onFilterClick', type: '() => void', description: 'Filter button click callback' },
    { name: 'showSort', type: 'boolean', default: 'true', description: 'Show sort button' },
    { name: 'onSortClick', type: '() => void', description: 'Sort button click callback' },
    { name: 'showViewToggle', type: 'boolean', default: 'true', description: 'Show cards/table toggle' },
    { name: 'viewMode', type: "'cards' | 'table'", default: "'cards'", description: 'Current view mode' },
    { name: 'onViewModeChange', type: "(mode: 'cards' | 'table') => void", description: 'View mode change callback' },
    { name: 'filterChips', type: 'React.ReactNode', description: 'Active filter chips slot (Row 3)' },
  ],
  accessibility: [
    { feature: 'Toolbar role', description: 'Root element has role="toolbar" with aria-label for screen readers' },
    { feature: 'Composed a11y', description: 'Delegates to TabBar (role="tablist"), Button, and DataTable.Toolbar sub-components which handle their own ARIA semantics' },
    { feature: 'Keyboard support', description: 'Inherits keyboard navigation from composed TabBar and Button components' },
  ],
  relatedComponents: [
    { name: 'DataTable', href: '/components/data-table' },
    { name: 'TabBar', href: '/components/tab' },
    { name: 'Button', href: '/components/button' },
  ],
  notes: [
    'Extracted from the Canopy Registry prototype pattern — tabs + action button above DataTable.Toolbar with bulk selection and view toggle.',
    'All features are independently toggleable via show* props.',
    'The filterChips slot accepts any React node — typically an ActiveFilters-style chip bar.',
  ],
}

// =============================================================================
// PAGE
// =============================================================================

function CollectionToolbarPreview({
  showTabs, showActions, showToolbar, showFilter, showSort, showViewToggle, showSelection,
}: {
  showTabs: boolean; showActions: boolean; showToolbar: boolean;
  showFilter: boolean; showSort: boolean; showViewToggle: boolean; showSelection: boolean;
}) {
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [selectedCount, setSelectedCount] = useState(3)
  const [filterCount, setFilterCount] = useState(2)

  return (
    <div>
      <CollectionToolbar
        tabs={[
          { id: 'all', label: 'All' },
          { id: 'active', label: 'Active' },
          { id: 'archived', label: 'Archived' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showTabs={showTabs}
        actions={[
          {
            label: 'Register product',
            icon: <PlusIcon />,
            onClick: () => {},
          },
        ]}
        showActions={showActions}
        showToolbar={showToolbar}
        selectedCount={selectedCount}
        onClearSelection={() => setSelectedCount(0)}
        showSelection={showSelection}
        bulkActions={
          <>
            <DataTable.IconButton title="Edit" label="Edit" onClick={() => {}}>
              <PencilIcon />
            </DataTable.IconButton>
            <DataTable.IconButton title="Bundle" label="Bundle" onClick={() => {}}>
              <PackageIcon />
            </DataTable.IconButton>
            <DataTable.IconButton title="Delete" label="Delete" onClick={() => {}}>
              <Trash2Icon />
            </DataTable.IconButton>
          </>
        }
        showFilter={showFilter}
        filterCount={filterCount}
        onFilterClick={() => setFilterCount(c => c > 0 ? 0 : 2)}
        showSort={showSort}
        showViewToggle={showViewToggle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* State readout */}
      <div style={{ marginTop: spacing.md, ...typography.body.sm, color: colors.text.lowEmphasis.onLight }}>
        Tab: <strong>{activeTab}</strong> &middot; View: <strong>{viewMode}</strong> &middot; Selected: <strong>{selectedCount}</strong> &middot; Filters: <strong>{filterCount}</strong>
      </div>
    </div>
  )
}

export default function CollectionToolbarPage() {
  const [showTabs, setShowTabs] = useState(true)
  const [showActions, setShowActions] = useState(true)
  const [showToolbar, setShowToolbar] = useState(true)
  const [showFilter, setShowFilter] = useState(true)
  const [showSort, setShowSort] = useState(true)
  const [showViewToggle, setShowViewToggle] = useState(true)
  const [showSelection, setShowSelection] = useState(true)

  return (
    <StyleguideLayout
      title="Collection Toolbar"
      description="Configurable toolbar for collection/list pages. Compose tabs, action buttons, bulk selection, filter/sort, and cards-vs-table view toggle."
      activeId="collection-toolbar"
    >
      <div style={{ maxWidth: 960 }}>
        {/* ── Interactive Playground ──────────────────────────────── */}
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
          <div style={sharedStyles.card}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: spacing['2xl'] }}>
              {/* Preview */}
              <div>
                <Playground
                  preview={
                    <CollectionToolbarPreview
                      showTabs={showTabs}
                      showActions={showActions}
                      showToolbar={showToolbar}
                      showFilter={showFilter}
                      showSort={showSort}
                      showViewToggle={showViewToggle}
                      showSelection={showSelection}
                    />
                  }
                  previewStretch
                  previewPadding="24px"
                  code={`<CollectionToolbar
  tabs={[
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'archived', label: 'Archived' },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  actions={[{
    label: 'Register product',
    icon: <Plus size={16} />,
    onClick: () => setIsOpen(true),
  }]}
  selectedCount={selectedIds.size}
  onClearSelection={() => setSelectedIds(new Set())}
  bulkActions={
    <>
      <DataTable.IconButton title="Edit"><Pencil size={16} /></DataTable.IconButton>
      <DataTable.IconButton title="Delete"><Trash2 size={16} /></DataTable.IconButton>
    </>
  }
  showFilter
  filterCount={Object.keys(activeFilters).length}
  onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
/>`}
                />
              </div>

              {/* Controls */}
              <div>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                  <StyledCheckbox checked={showTabs} onChange={setShowTabs} label="Tabs" />
                  <StyledCheckbox checked={showActions} onChange={setShowActions} label="Actions" />
                  <StyledCheckbox checked={showToolbar} onChange={setShowToolbar} label="Toolbar" />
                  <StyledCheckbox checked={showFilter} onChange={setShowFilter} label="Filter" />
                  <StyledCheckbox checked={showSort} onChange={setShowSort} label="Sort" />
                  <StyledCheckbox checked={showViewToggle} onChange={setShowViewToggle} label="View Toggle" />
                  <StyledCheckbox checked={showSelection} onChange={setShowSelection} label="Selection" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Usage Examples ──────────────────────────────────────── */}
        <div style={{ marginTop: spacing['2xl'] }}>
          <h2 style={{ ...typography.heading.h3, color: colors.text.highEmphasis.onLight, marginBottom: spacing.md }}>
            Usage Examples
          </h2>

          <CodeBlock>
            {`<CollectionToolbar
  showTabs={false}
  showActions={false}
  selectedCount={selectedIds.size}
  onClearSelection={clearSelection}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
/>`}
          </CodeBlock>

          <CodeBlock>
            {`<CollectionToolbar
  showFilter={false}
  showSort={false}
  showSelection={false}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
/>`}
          </CodeBlock>
        </div>

        {/* ── API Documentation ──────────────────────────────────── */}
        <div style={{ marginTop: spacing['2xl'] }}>
          <ComponentDocumentation data={docData} />
        </div>
      </div>
    </StyleguideLayout>
  )
}
