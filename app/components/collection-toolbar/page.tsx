'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  SpecTable,
  Playground,
  StyledCheckbox,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import {
  CollectionToolbar,
  DataTable,
  Chip,
  ChipGroup,
  Button,
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
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

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
  whenToUse: [
    'Collection/list pages that need tabs, search, filters, sort controls, and view toggles above a DataTable.',
    'Any data page following the standard pattern: toolbar on top, table below.',
  ],
  whenNotToUse: [
    { scenario: 'Simple page with just a table and no filtering controls', instead: 'DataTable — use its built-in sort/pagination without a toolbar wrapper' },
  ],
  usageExamples: [
    {
      title: 'Data page with toolbar',
      description: 'Standard collection page pattern. Place CollectionToolbar above DataTable.',
      isDefault: true,
      code: `<CollectionToolbar\n  tabs={tabs}\n  actions={[{ label: 'Add New', onClick: handleAdd }]}\n  onSearch={handleSearch}\n/>\n<DataTable columns={columns} data={data} rowKey={(r) => r.id} sortable paginated />`,
    },
  ],
}

// =============================================================================
// INTERACTIVE DEMO
// =============================================================================

const DEFAULT_CHIPS = ['Status: Active', 'Category: Flower']

interface CollectionToolbarPreviewProps {
  showTabs: boolean
  showActions: boolean
  showToolbar: boolean
  showFilter: boolean
  showSort: boolean
  showViewToggle: boolean
  showSelection: boolean
  hasSelected: boolean
  onClearSelected: () => void
  hasActiveFilters: boolean
}

function CollectionToolbarPreview({
  showTabs,
  showActions,
  showToolbar,
  showFilter,
  showSort,
  showViewToggle,
  showSelection,
  hasSelected,
  onClearSelected,
  hasActiveFilters,
}: CollectionToolbarPreviewProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [chips, setChips] = useState(DEFAULT_CHIPS)

  // Reset chips when toggling Active Filters back on
  const prevActiveFilters = React.useRef(hasActiveFilters)
  React.useEffect(() => {
    if (hasActiveFilters && !prevActiveFilters.current) {
      setChips(DEFAULT_CHIPS)
    }
    prevActiveFilters.current = hasActiveFilters
  }, [hasActiveFilters])

  const selectedCount = hasSelected ? 3 : 0
  const filterCount = hasActiveFilters ? chips.length : 0

  const handleRemoveChip = (label: string) => {
    setChips(prev => prev.filter(c => c !== label))
  }

  const handleClearAll = () => {
    setChips([])
  }

  return (
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
      onClearSelection={onClearSelected}
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
      isFilterActive={hasActiveFilters && chips.length > 0}
      filterCount={filterCount}
      onFilterClick={() => {}}
      showSort={showSort}
      showViewToggle={showViewToggle}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      filterChips={
        hasActiveFilters && chips.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <ChipGroup gap="sm">
              {chips.map(label => (
                <Chip key={label} removable onRemove={() => handleRemoveChip(label)}>
                  {label}
                </Chip>
              ))}
            </ChipGroup>
            <Button emphasis="low" size="md" onClick={handleClearAll}>
              Clear
            </Button>
          </div>
        ) : undefined
      }
    />
  )
}

// =============================================================================
// PAGE
// =============================================================================

export default function CollectionToolbarPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground controls
  const [showTabs, setShowTabs] = useState(true)
  const [showActions, setShowActions] = useState(true)
  const [showToolbar, setShowToolbar] = useState(true)
  const [showFilter, setShowFilter] = useState(true)
  const [showSort, setShowSort] = useState(true)
  const [showViewToggle, setShowViewToggle] = useState(true)
  const [showSelection, setShowSelection] = useState(true)
  const [hasSelected, setHasSelected] = useState(false)
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Collection Toolbar"
      description="Configurable toolbar for collection/list pages. Compose tabs, action buttons, bulk selection, filter/sort, and cards-vs-table view toggle."
      activeId="collection-toolbar"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
    >
      {/* ========== OVERVIEW TAB ========== */}
      {activePageTab === 'overview' && (
        <>
          {/* ========== QUICK START ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`// Package import
import { CollectionToolbar } from '@metrc/design-system'

// Or with path alias
import { CollectionToolbar } from '@/components'
import type { CollectionToolbarProps, CollectionToolbarTab, CollectionToolbarAction } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Manipulate toolbar properties in real-time to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: spacing['2xl'] }}>
                {/* Preview/Code */}
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
                        hasSelected={hasSelected}
                        onClearSelected={() => setHasSelected(false)}
                        hasActiveFilters={hasActiveFilters}
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
  bulkActions={<BulkActions />}
  showFilter
  filterCount={activeFilters.length}
  onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  filterChips={
    <ChipGroup gap="sm">
      {activeFilters.map(f => (
        <Chip key={f} removable onRemove={() => removeFilter(f)}>{f}</Chip>
      ))}
      <Button emphasis="low" onClick={clearAll}>Clear</Button>
    </ChipGroup>
  }
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
                    <div style={{ height: 1, backgroundColor: colors.border.lowEmphasis.onLight, margin: `${spacing['2xs']} 0` }} />
                    <StyledCheckbox checked={hasSelected} onChange={setHasSelected} label="Has Selected" />
                    <StyledCheckbox checked={hasActiveFilters} onChange={setHasActiveFilters} label="Active Filters" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          {/* ========== USAGE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>
{`import { CollectionToolbar, DataTable } from '@/components'
import type { CollectionToolbarProps, CollectionToolbarTab, CollectionToolbarAction } from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Full-Featured Toolbar</h3>
              <CodeBlock>
{`<CollectionToolbar
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
  filterChips={
    <ChipGroup gap="sm">
      {activeFilters.map(f => (
        <Chip key={f} removable onRemove={() => removeFilter(f)}>{f}</Chip>
      ))}
      <Button emphasis="low" onClick={clearAllFilters}>Clear</Button>
    </ChipGroup>
  }
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Toolbar Only (No Tabs/Actions)</h3>
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
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Tabs Only (Minimal)</h3>
              <CodeBlock>
{`<CollectionToolbar
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  showFilter={false}
  showSort={false}
  showSelection={false}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
/>`}
              </CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>CollectionToolbar Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="p">tabs</code>, <code key="t">CollectionToolbarTab[]</code>, '-', 'Tab definitions (id, label, icon). Omit to hide tabs.'],
                  [<code key="p">activeTab</code>, <code key="t">string</code>, '-', 'Currently active tab id'],
                  [<code key="p">onTabChange</code>, <code key="t">{'(tabId: string) => void'}</code>, '-', 'Tab change callback'],
                  [<code key="p">showTabs</code>, <code key="t">boolean</code>, <code key="d">true</code>, 'Explicitly hide tabs'],
                  [<code key="p">actions</code>, <code key="t">CollectionToolbarAction[]</code>, '-', 'Action buttons next to tabs'],
                  [<code key="p">showActions</code>, <code key="t">boolean</code>, <code key="d">true</code>, 'Explicitly hide actions'],
                  [<code key="p">showToolbar</code>, <code key="t">boolean</code>, <code key="d">true</code>, 'Show the DataTable.Toolbar row'],
                  [<code key="p">selectedCount</code>, <code key="t">number</code>, <code key="d">0</code>, 'Number of selected items'],
                  [<code key="p">onClearSelection</code>, <code key="t">{'() => void'}</code>, '-', 'Clear selection callback'],
                  [<code key="p">bulkActions</code>, <code key="t">ReactNode</code>, '-', 'Bulk action buttons inside SelectionInfo'],
                  [<code key="p">showSelection</code>, <code key="t">boolean</code>, <code key="d">true</code>, 'Show selection info bar'],
                  [<code key="p">showFilter</code>, <code key="t">boolean</code>, <code key="d">true</code>, 'Show filter button'],
                  [<code key="p">isFilterActive</code>, <code key="t">boolean</code>, <code key="d">false</code>, 'Whether filter panel is active'],
                  [<code key="p">filterCount</code>, <code key="t">number</code>, <code key="d">0</code>, 'Active filter count badge'],
                  [<code key="p">onFilterClick</code>, <code key="t">{'() => void'}</code>, '-', 'Filter button click callback'],
                  [<code key="p">showSort</code>, <code key="t">boolean</code>, <code key="d">true</code>, 'Show sort button'],
                  [<code key="p">onSortClick</code>, <code key="t">{'() => void'}</code>, '-', 'Sort button click callback'],
                  [<code key="p">showViewToggle</code>, <code key="t">boolean</code>, <code key="d">true</code>, 'Show cards/table toggle'],
                  [<code key="p">viewMode</code>, <code key="t">{"'cards' | 'table'"}</code>, <code key="d">{"'cards'"}</code>, 'Current view mode'],
                  [<code key="p">onViewModeChange</code>, <code key="t">{"(mode: 'cards' | 'table') => void"}</code>, '-', 'View mode change callback'],
                  [<code key="p">filterChips</code>, <code key="t">ReactNode</code>, '-', 'Active filter chips slot (Row 3)'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>CollectionToolbarTab</h3>
              <SpecTable
                headers={['Property', 'Type', 'Description']}
                rows={[
                  [<code key="p">id</code>, <code key="t">string</code>, 'Unique tab identifier'],
                  [<code key="p">label</code>, <code key="t">string</code>, 'Display label'],
                  [<code key="p">icon</code>, <code key="t">ReactNode</code>, 'Optional icon element'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>CollectionToolbarAction</h3>
              <SpecTable
                headers={['Property', 'Type', 'Description']}
                rows={[
                  [<code key="p">label</code>, <code key="t">string</code>, 'Button label text'],
                  [<code key="p">icon</code>, <code key="t">ReactNode</code>, 'Optional leading icon'],
                  [<code key="p">onClick</code>, <code key="t">{'() => void'}</code>, 'Click handler'],
                  [<code key="p">emphasis</code>, <code key="t">{"'high' | 'mid' | 'low'"}</code>, 'Button emphasis (default: high)'],
                ]}
              />
            </div>
          </section>

          {/* ========== DESIGN GUIDANCE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Layout Structure</h3>
              <SpecTable
                headers={['Row', 'Left', 'Right']}
                rows={[
                  ['Row 1', 'TabBar (category navigation)', 'Action buttons (primary CTA)'],
                  ['Row 2', 'SelectionInfo + bulk actions', 'Filter, Sort, View Toggle'],
                  ['Row 3', 'Active filter chips (full width)', 'Clear button'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use show* props to hide unused sections', 'Leave all features enabled if unused'],
                  ['Provide onClearSelection when using selection', 'Show selection without a way to clear'],
                  ['Keep action labels short and specific', 'Use generic labels like "Action"'],
                  ['Use filterChips with dismissible Chips to show active filters', 'Rely only on the filter badge count'],
                  ['Pair with DataTable below for full collection pages', 'Use as a standalone navigation bar'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={docData} />
      )}
    </StyleguideLayout>
  )
}
