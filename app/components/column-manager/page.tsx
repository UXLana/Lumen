'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import { ColumnManager } from '@/components'
import type { ColumnConfig } from '@/components'
import { colors, spacing, typography } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// SAMPLE DATA
// =============================================================================

const sampleColumns: ColumnConfig[] = [
  { id: 'name', label: 'Product Name', visible: true, locked: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'price', label: 'Price', visible: true },
  { id: 'inventory', label: 'Inventory Count', visible: true },
  { id: 'category', label: 'Category', visible: false },
  { id: 'supplier', label: 'Supplier', visible: true },
  { id: 'created', label: 'Date Created', visible: false },
  { id: 'modified', label: 'Last Modified', visible: true },
  { id: 'sku', label: 'SKU', visible: false },
  { id: 'weight', label: 'Weight', visible: false },
]

// =============================================================================
// DOC DATA
// =============================================================================

const docData: ComponentDocData = {
  displayName: 'ColumnManager',
  importPath: '@/components',
  importStatement: `import { ColumnManager, useColumnManager } from '@/components'\nimport type { ColumnManagerProps, ColumnConfig } from '@/components'`,
  description:
    'A panel for managing table column visibility and order. Users can toggle columns on/off in the Visibility tab, reorder via drag-and-drop or arrow buttons in the Order tab (which only shows visible columns), search, and apply changes.',
  props: [
    { name: 'columns', type: 'ColumnConfig[]', description: 'Array of column configurations with id, label, visible, locked' },
    { name: 'onApply', type: '(columns: ColumnConfig[]) => void', description: 'Called when user clicks Apply' },
    { name: 'onReset', type: '() => void', description: 'Called when user clicks Reset' },
    { name: 'title', type: 'string', default: "'View settings'", description: 'Panel title' },
    { name: 'description', type: 'string', default: "'Manage visible columns'", description: 'Panel description' },
    { name: 'width', type: 'number | string', default: '384', description: 'Panel width' },
    { name: 'height', type: 'number | string', default: '600', description: 'Panel height' },
  ],
  accessibility: [
    { feature: 'List Semantics', description: 'Column list uses role="list" with role="listitem" on each row.' },
    { feature: 'Labels', description: 'Each toggle has aria-label with column name. Search input is labeled.' },
    { feature: 'Keyboard', description: 'Tabs, search, toggles, and up/down reorder buttons are all keyboard accessible. Tab key moves between controls.' },
    { feature: 'Reorder Arrows', description: 'Up/down arrow buttons provide keyboard-accessible reordering as an alternative to drag-and-drop.' },
    { feature: 'Locked Columns', description: 'Locked columns have disabled toggles — cannot be hidden.' },
  ],
  tokens: [
    { token: 'colors.surface.light', value: 'White', usage: 'Panel background' },
    { token: 'colors.surface.lightDarker', value: 'Light gray', usage: 'Hover/drag-over row highlight' },
    { token: 'shadows.xl', value: 'Large shadow', usage: 'Panel elevation' },
    { token: 'borderRadius.lg', value: '12px', usage: 'Panel corners' },
    { token: 'typography.body.sm', value: '14px', usage: 'Column label text' },
  ],
  relatedComponents: [
    { name: 'DataTable', href: '/components/data-table' },
    { name: 'Switch', href: '/components/switch' },
    { name: 'TabBar', href: '/components/tab' },
  ],
  notes: [
    'Changes are only applied when the user clicks Apply — this prevents accidental column changes.',
    'Set locked: true on columns that must always be visible (e.g. primary identifier).',
    'The useColumnManager hook can be used independently for custom column management UIs.',
    'The Order tab only displays visible columns — toggle visibility first, then arrange order.',
    'Drag-and-drop reordering is available on the Order tab, with up/down arrow buttons as a keyboard-accessible alternative.',
  ],
  whenToUse: [
    'Data tables with many columns where users need to customize their view.',
    'Settings panels for configuring table/grid layouts.',
    'Any data-heavy interface where column management improves usability.',
  ],
  whenNotToUse: [
    { scenario: 'Tables with few fixed columns', instead: 'No column management needed — show all columns' },
    { scenario: 'Simple show/hide without reorder', instead: 'A Menu with checkbox items is simpler' },
  ],
  usageExamples: [
    {
      title: 'Basic column management',
      description: 'Pair with DataTable to let users customize visible columns.',
      isDefault: true,
      code: `const [columns, setColumns] = useState(initialColumns)

<ColumnManager
  columns={columns}
  onApply={(updated) => setColumns(updated)}
  onReset={() => setColumns(initialColumns)}
/>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function ColumnManagerPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')
  const [appliedColumns, setAppliedColumns] = useState(sampleColumns)
  // Key to force re-render on reset
  const [resetKey, setResetKey] = useState(0)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Column Manager"
      description="Panel for managing table column visibility and order with tabs, search, drag-and-drop, arrow-key reordering, and apply/reset."
      activeId="column-manager"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
    >
      {/* ========== OVERVIEW TAB ========== */}
      {activePageTab === 'overview' && (
        <>
          {/* Quick Start */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`import { ColumnManager } from '@/components'

<ColumnManager
  columns={columns}
  onApply={(updated) => setColumns(updated)}
  onReset={() => setColumns(defaultColumns)}
/>`}</CodeBlock>
            </div>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Toggle columns on/off in the Visibility tab. Reorder in the Order tab using drag-and-drop or the up/down arrow buttons (only visible columns are shown). Search to filter, then click Apply to save.
            </p>

            <div style={{ ...sharedStyles.card, display: 'flex', justifyContent: 'center' }}>
              <ColumnManager
                key={resetKey}
                columns={appliedColumns}
                onApply={(updated) => {
                  setAppliedColumns(updated)
                  setResetKey((k) => k + 1)
                }}
                onReset={() => {
                  setAppliedColumns(sampleColumns)
                  setResetKey((k) => k + 1)
                }}
              />
            </div>
          </section>

          {/* Composition */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Composition</h2>
            <p style={sharedStyles.sectionDescription}>
              ColumnManager is an organism composed from existing design system primitives:
            </p>
            <div style={{ ...sharedStyles.card, maxWidth: '600px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...typography.label.sm, textAlign: 'left', padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>Part</th>
                    <th style={{ ...typography.label.sm, textAlign: 'left', padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>Component</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Visibility / Order tabs', 'TabBar (stretched)'],
                    ['Column search', 'Input (size="sm", startAdornment)'],
                    ['Visibility toggles', 'Switch'],
                    ['Drag handles (order tab)', 'IconDrag'],
                    ['Reorder arrows (order tab)', 'IconArrowUp / IconArrowDown'],
                    ['Reset button', 'Button (emphasis="low")'],
                    ['Apply button', 'Button (emphasis="high")'],
                  ].map(([part, comp]) => (
                    <tr key={part}>
                      <td style={{ ...typography.body.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.highEmphasis.onLight }}>{part}</td>
                      <td style={{ ...typography.code.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.lowEmphasis.onLight }}>{comp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>ColumnConfig Interface</h2>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`interface ColumnConfig {
  id: string       // Unique identifier
  label: string    // Display name
  visible: boolean // Whether column is shown
  locked?: boolean // Cannot be hidden (e.g. primary key)
}`}</CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>useColumnManager Hook</h2>
            <p style={sharedStyles.sectionDescription}>
              For custom UIs, use the hook directly:
            </p>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`import { useColumnManager } from '@/components'

const {
  columns,         // ColumnConfig[] — working copy
  activeTab,       // 'visibility' | 'order'
  searchQuery,     // string
  filteredColumns, // ColumnConfig[] — filtered by search + visibility (order tab)
  visibleCount,    // number
  totalCount,      // number
  setActiveTab,    // (tab) => void
  setSearchQuery,  // (query) => void
  toggleColumn,    // (id) => void
  moveColumn,      // (fromIndex, toIndex) => void
  showAll,         // () => void
  hideAll,         // () => void
  apply,           // () => void
  reset,           // () => void
  hasChanges,      // boolean
} = useColumnManager({
  columns: initialColumns,
  onApply: (columns) => saveToState(columns),
  onReset: () => restoreDefaults(),
})`}</CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>With DataTable</h2>
            <p style={sharedStyles.sectionDescription}>
              Pair with DataTable to control which columns are rendered:
            </p>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`const [columnConfig, setColumnConfig] = useState(defaultColumns)

// Filter DataTable columns based on visibility
const visibleTableColumns = allTableColumns.filter((col) =>
  columnConfig.find((c) => c.id === col.key && c.visible)
)

// Reorder based on columnConfig order
const orderedColumns = columnConfig
  .filter((c) => c.visible)
  .map((c) => visibleTableColumns.find((col) => col.key === c.id))
  .filter(Boolean)

<ColumnManager
  columns={columnConfig}
  onApply={setColumnConfig}
/>

<DataTable
  columns={orderedColumns}
  data={rows}
/>`}</CodeBlock>
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
