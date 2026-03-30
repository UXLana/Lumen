'use client'

import React, { useState, useMemo } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  SpecTable,
  Playground,
  PillButton,
  StyledCheckbox,
  CollapsibleSection,
  CopyableToken,
  PixelValue,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import {
  DataTable,
  DataTableDisplay,
  DataTableDensity,
  DataTableColumn,
  SortState,
  ProductCard,
} from '@/components'
import { colors, typography, spacing, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// SAMPLE DATA
// =============================================================================

interface SampleProduct {
  id: string
  name: string
  sku: string
  status: 'active' | 'pending' | 'inactive'
  brand: string
  category: string
  market: string
  markets: { code: string; highlighted: boolean }[]
  totalMarkets: number
  compliance: number
  lastUpdated: string
}

const sampleData: SampleProduct[] = [
  { id: '1', name: 'Green Dream Gummy', sku: 'GDG-001', status: 'active', brand: 'Wyld', category: 'Edibles', market: 'California', markets: [{ code: 'CA', highlighted: true }, { code: 'NV', highlighted: true }, { code: 'CO', highlighted: false }], totalMarkets: 3, compliance: 98, lastUpdated: '2026-02-20' },
  { id: '2', name: 'Mountain Haze Pre-Roll', sku: 'MHP-042', status: 'active', brand: 'Lowell', category: 'Pre-Rolls', market: 'Colorado', markets: [{ code: 'CO', highlighted: true }, { code: 'MI', highlighted: false }], totalMarkets: 2, compliance: 95, lastUpdated: '2026-02-19' },
  { id: '3', name: 'Calm Drops Tincture', sku: 'CDT-018', status: 'pending', brand: 'Papa & Barkley', category: 'Tinctures', market: 'Oregon', markets: [{ code: 'OR', highlighted: true }], totalMarkets: 1, compliance: 72, lastUpdated: '2026-02-18' },
  { id: '4', name: 'Solar Bloom Flower', sku: 'SBF-105', status: 'active', brand: 'Cookies', category: 'Flower', market: 'Michigan', markets: [{ code: 'MI', highlighted: true }, { code: 'CA', highlighted: true }, { code: 'NV', highlighted: true }], totalMarkets: 3, compliance: 100, lastUpdated: '2026-02-17' },
  { id: '5', name: 'Pacific Mist Vape', sku: 'PMV-063', status: 'inactive', brand: 'Stiiizy', category: 'Vapes', market: 'California', markets: [{ code: 'CA', highlighted: true }], totalMarkets: 1, compliance: 45, lastUpdated: '2026-01-30' },
  { id: '6', name: 'Twilight Edible Bar', sku: 'TEB-077', status: 'pending', brand: 'Kiva', category: 'Edibles', market: 'Nevada', markets: [{ code: 'NV', highlighted: true }, { code: 'CA', highlighted: false }], totalMarkets: 2, compliance: 81, lastUpdated: '2026-02-15' },
]

const statusColorMap: Record<string, { bg: string; text: string }> = {
  active: { bg: colors.badge.successLight, text: colors.badge.success },
  pending: { bg: colors.badge.yellowLight, text: colors.badge.warning },
  inactive: { bg: colors.badge.importantLight, text: colors.badge.important },
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

const dataTableDocData: ComponentDocData = {
  displayName: 'DataTable',
  importPath: '@/components',
  importStatement: `import { DataTable } from '@/components'\nimport type { DataTableProps, DataTableColumn, SortState, DataTableDisplay, DataTableDensity } from '@/components'`,
  description: 'DataTable displays structured data in rows and columns with sorting, selection, responsive card view, and loading states.',
  props: [
    { name: 'columns', type: 'DataTableColumn<T>[]', required: true, description: 'Column definitions' },
    { name: 'data', type: 'T[]', required: true, description: 'Data array' },
    { name: 'rowKey', type: '(row: T, index: number) => string', required: true, description: 'Unique key extractor' },
    { name: 'display', type: "'table' | 'cards' | 'auto'", default: "'table'", description: 'Display mode' },
    { name: 'density', type: "'compact' | 'default' | 'comfortable'", default: "'default'", description: 'Row density' },
    { name: 'breakpoint', type: 'number', description: 'Auto mode breakpoint in pixels' },
    { name: 'striped', type: 'boolean', description: 'Alternating row backgrounds' },
    { name: 'hoverable', type: 'boolean', description: 'Row hover effect' },
    { name: 'onRowClick', type: '(row: T, index: number) => void', description: 'Row click handler' },
    { name: 'sort', type: 'SortState', description: 'Controlled sort state' },
    { name: 'onSortChange', type: '(sort: SortState) => void', description: 'Sort change callback' },
    { name: 'caption', type: 'string', description: 'Table caption for accessibility' },
    { name: 'emptyState', type: 'ReactNode', description: 'Empty state content' },
    { name: 'loading', type: 'boolean', description: 'Loading state with skeleton rows' },
    { name: 'loadingRows', type: 'number', description: 'Number of skeleton rows' },
    { name: 'stickyHeader', type: 'boolean', description: 'Sticky header on scroll' },
    { name: 'selectable', type: 'boolean', description: 'Enable row selection with checkboxes' },
    { name: 'selectedKeys', type: 'Set<string>', description: 'Controlled selected row keys' },
    { name: 'onSelectionChange', type: '(keys: Set<string>) => void', description: 'Selection change callback' },
    { name: 'renderCard', type: '(row, index, options) => ReactNode', description: 'Custom card renderer' },
    { name: 'cardGridColumns', type: 'string', description: 'CSS grid-template-columns for card grid' },
  ],
  typeDefinitions: [
    { name: 'DataTableColumn<T>', definition: "interface DataTableColumn<T> {\n  key: string\n  header: string\n  align?: 'left' | 'center' | 'right'\n  width?: string | number\n  sortable?: boolean\n  render?: (row: T, index: number) => ReactNode\n  cardLabel?: string\n  cardPrimary?: boolean\n  hideOnCard?: boolean\n  visible?: boolean\n}" },
    { name: 'SortState', definition: "interface SortState {\n  key: string\n  direction: 'asc' | 'desc' | 'none'\n}" },
    { name: 'DataTableDisplay', definition: "type DataTableDisplay = 'table' | 'cards' | 'auto'" },
    { name: 'DataTableDensity', definition: "type DataTableDensity = 'compact' | 'default' | 'comfortable'" },
  ],
  accessibility: [
    { feature: 'Table Semantics', description: 'Uses native <table> with proper <thead>, <tbody>, <th> structure.' },
    { feature: 'Caption', description: 'Caption prop provides accessible table description for screen readers.' },
    { feature: 'Sort Controls', description: 'Sort buttons include aria-sort attribute on column headers.' },
    { feature: 'Selection', description: 'Checkboxes use aria-label for row selection; header checkbox for select-all.' },
    { feature: 'Card View', description: 'Card view maintains semantic structure with proper headings.' },
  ],
  tokens: [
    { token: 'colors.surface.light', value: 'White', usage: 'Table background' },
    { token: 'colors.surface.lightDarker', value: 'Gray', usage: 'Header and striped row background' },
    { token: 'colors.border.lowEmphasis', value: 'Light gray', usage: 'Row borders' },
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Selection checkbox color' },
    { token: 'typography.body.sm', value: '14px/20px', usage: 'Cell text' },
    { token: 'typography.label.sm', value: '12px/16px', usage: 'Header text' },
  ],
  relatedComponents: [
    { name: 'List Item', href: '/components/list-item' },
    { name: 'Checkbox', href: '/components/checkbox' },
    { name: 'Badge', href: '/components/badge' },
  ],
  notes: [
    'Use display="auto" with a breakpoint for responsive table-to-card switching.',
    'Provide a caption for accessibility, even if visually hidden.',
    'Use the render function in column definitions for custom cell content.',
    'Selection requires rowKey, selectable, selectedKeys, and onSelectionChange props.',
    'Use renderCard for fully custom card layouts in card display mode.',
  ],
}

export default function DataTablePage() {
  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive playground state
  const [demoDisplay, setDemoDisplay] = useState<DataTableDisplay>('table')
  const [demoDensity, setDemoDensity] = useState<DataTableDensity>('default')
  const [demoStriped, setDemoStriped] = useState(false)
  const [demoHoverable, setDemoHoverable] = useState(true)
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoStickyHeader, setDemoStickyHeader] = useState(false)
  const [demoSort, setDemoSort] = useState<SortState>({ key: '', direction: 'none' })
  const [demoSelectable, setDemoSelectable] = useState(false)
  const [demoSelected, setDemoSelected] = useState<Set<string>>(new Set())
  const [demoToolbar, setDemoToolbar] = useState(false)
  const [demoFilterActive, setDemoFilterActive] = useState(false)

  const columns: DataTableColumn<SampleProduct>[] = useMemo(() => [
    {
      key: 'name',
      header: 'Product Name',
      cardPrimary: true,
      sortable: true,
    },
    {
      key: 'sku',
      header: 'SKU',
      width: '120px',
    },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      sortable: true,
      render: (row) => {
        const c = statusColorMap[row.status]
        return (
          <span style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: c.bg,
            color: c.text,
            textTransform: 'capitalize',
          }}>
            {row.status}
          </span>
        )
      },
    },
    {
      key: 'market',
      header: 'Market',
      sortable: true,
    },
    {
      key: 'compliance',
      header: 'Compliance',
      align: 'center' as const,
      width: '160px',
      sortable: true,
      render: (row) => <DataTable.ProgressBar value={row.compliance} />,
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
      width: '130px',
      sortable: true,
    },
  ], [])

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const playgroundCode = `<DataTable
  columns={[
    { key: 'name', header: 'Product Name', cardPrimary: true, sortable: true },
    { key: 'sku', header: 'SKU', width: '120px' },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'market', header: 'Market', sortable: true },
    { key: 'compliance', header: 'Compliance', align: 'center', sortable: true },
    { key: 'lastUpdated', header: 'Last Updated', width: '130px' },
  ]}
  data={products}
  rowKey={(row) => row.id}
  display="${demoDisplay}"
  density="${demoDensity}"
  striped={${demoStriped}}
  hoverable={${demoHoverable}}
  loading={${demoLoading}}
  stickyHeader={${demoStickyHeader}}
  sort={sort}
  onSortChange={setSort}
  caption="Product compliance overview"
/>`

  return (
    <StyleguideLayout
      title="Data Table"
      description="A responsive data display component that supports both table and card layouts. Sorts, loads skeletons, and adapts to viewport width."
      activeId="data-table"
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
              <CodeBlock>{`// Package import
import { DataTable } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { DataTable } from '@/components'
import type { DataTableColumn, SortState } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Configure table properties to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '32px' }}>
                {/* Preview/Code — stretched wide */}
                <div style={{ minWidth: 0 }}>
                  <Playground
                    code={playgroundCode}
                    previewBackground={colors.surface.lightDarker}
                    previewPadding="16px"
                    previewStretch
                    preview={
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, width: '100%' }}>
                        {demoToolbar && (
                          <DataTable.Toolbar>
                            <DataTable.Toolbar.Left>
                              <DataTable.SelectionInfo count={demoSelected.size}>
                                <DataTable.IconButton title="Edit" label="Edit">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </DataTable.IconButton>
                                <DataTable.IconButton title="Delete" label="Delete">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </DataTable.IconButton>
                              </DataTable.SelectionInfo>
                            </DataTable.Toolbar.Left>
                            <DataTable.Toolbar.Right>
                              <DataTable.FilterButton
                                active={demoFilterActive}
                                count={demoFilterActive ? 2 : 0}
                                onClick={() => setDemoFilterActive(!demoFilterActive)}
                              />
                              <DataTable.SortButton />
                              <DataTable.ViewToggle
                                value={demoDisplay === 'cards' ? 'cards' : 'table'}
                                onChange={(v) => setDemoDisplay(v)}
                              />
                            </DataTable.Toolbar.Right>
                          </DataTable.Toolbar>
                        )}
                        <DataTable<SampleProduct>
                          columns={columns}
                          data={sampleData}
                          rowKey={(row) => row.id}
                          display={demoDisplay}
                          density={demoDensity}
                          striped={demoStriped}
                          hoverable={demoHoverable}
                          loading={demoLoading}
                          stickyHeader={demoStickyHeader}
                          maxHeight={demoStickyHeader ? '400px' : undefined}
                          sort={demoSort}
                          onSortChange={setDemoSort}
                          selectable={demoSelectable}
                          selectedKeys={demoSelected}
                          onSelectionChange={setDemoSelected}
                          caption="Product compliance overview"
                          onRowClick={(row) => alert(`Clicked: ${row.name}`)}
                          cardGridColumns="repeat(auto-fill, minmax(280px, 1fr))"
                          renderCard={(row, _i, { selected, onSelect }) => (
                            <ProductCard
                              layout="vertical"
                              name={row.name}
                              sku={row.sku}
                              brands={[row.brand]}
                              categories={[row.category]}
                              typeLabel="Product"
                              markets={row.markets}
                              totalMarkets={row.totalMarkets}
                              selected={selected}
                              onSelect={() => onSelect()}
                              onClick={() => alert(`View details: ${row.name}`)}
                            />
                          )}
                        />
                      </div>
                    }
                  />
                </div>

                {/* Controls — fixed narrow column */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Display Mode */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Display
                      </label>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(['table', 'cards', 'auto'] as DataTableDisplay[]).map(d => (
                          <PillButton
                            key={d}
                            isActive={demoDisplay === d}
                            onClick={() => setDemoDisplay(d)}
                          >{d}</PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Density */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Density
                      </label>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(['compact', 'default', 'comfortable'] as DataTableDensity[]).map(d => (
                          <PillButton
                            key={d}
                            isActive={demoDensity === d}
                            onClick={() => setDemoDensity(d)}
                          >{d}</PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Options — contextual to current display mode */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                      {demoDisplay !== 'cards' && (
                        <StyledCheckbox
                          label="Striped Rows"
                          checked={demoStriped}
                          onChange={setDemoStriped}
                        />
                      )}
                      <StyledCheckbox
                        label="Hoverable"
                        checked={demoHoverable}
                        onChange={setDemoHoverable}
                      />
                      <StyledCheckbox
                        label="Loading"
                        checked={demoLoading}
                        onChange={setDemoLoading}
                      />
                      {demoDisplay !== 'cards' && (
                        <StyledCheckbox
                          label="Sticky Header"
                          checked={demoStickyHeader}
                          onChange={setDemoStickyHeader}
                        />
                      )}
                      <StyledCheckbox
                        label="Selectable"
                        checked={demoSelectable}
                        onChange={(v) => { setDemoSelectable(v); setDemoSelected(new Set()) }}
                      />
                      <StyledCheckbox
                        label="Toolbar"
                        checked={demoToolbar}
                        onChange={setDemoToolbar}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* Design Tokens */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Configuration options, spacing values, and color tokens used in the DataTable component. Click any token to copy it.
              </p>

              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Display Modes</h3>
                <SpecTable
                  headers={['Mode', 'Behavior', 'Best For']}
                  rows={[
                    [<code key="t">table</code>, 'Always renders as a traditional HTML table', 'Desktop-first views, wide datasets'],
                    [<code key="c">cards</code>, 'Always renders as stacked cards with description lists', 'Mobile views, detail-heavy items'],
                    [<code key="a">auto</code>, 'Switches between table and cards at a configurable breakpoint', 'Responsive layouts (recommended)'],
                  ]}
                />
              </div>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Density</h3>
                <SpecTable
                  headers={['Density', 'Cell Padding Y', 'Cell Padding X', 'Use Case']}
                  rows={[
                    [<code key="co">compact</code>, <CopyableToken key="co-py" token="spacing.1" />, <CopyableToken key="co-px" token="spacing.3" />, 'Dense data, monitoring dashboards'],
                    [<code key="d">default</code>, <CopyableToken key="d-py" token="spacing.2" />, <CopyableToken key="d-px" token="spacing.4" />, 'Standard tables (recommended)'],
                    [<code key="cm">comfortable</code>, <CopyableToken key="cm-py" token="spacing.3" />, <CopyableToken key="cm-px" token="spacing.4" />, 'Spacious, content-rich rows'],
                  ]}
                />
              </div>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Typography</h3>
                <SpecTable
                  headers={['Element', 'Token', 'Value']}
                  rows={[
                    ['Header', <CopyableToken key="h-t" token="typography.label.sm" />, <PixelValue key="h-v" value="12px / 500" />],
                    ['Body Cell', <CopyableToken key="b-t" token="typography.body.sm" />, <PixelValue key="b-v" value="14px / 400" />],
                    ['Card Title', <CopyableToken key="ct-t" token="typography.label.md" />, <PixelValue key="ct-v" value="14px / 500" />],
                    ['Card Label', <CopyableToken key="cl-t" token="typography.body.xs" />, <PixelValue key="cl-v" value="12px / 400" />],
                  ]}
                />
              </div>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Colors</h3>
                <SpecTable
                  headers={['Element', 'Token']}
                  rows={[
                    ['Header Background', <CopyableToken key="hbg" token="colors.surface.lightDarker" />],
                    ['Body Background', <CopyableToken key="bbg" token="colors.surface.light" />],
                    ['Header Text', <CopyableToken key="htxt" token="colors.text.lowEmphasis.onLight" />],
                    ['Body Text', <CopyableToken key="btxt" token="colors.text.highEmphasis.onLight" />],
                    ['Border', <CopyableToken key="brd" token="colors.border.lowEmphasis.onLight" />],
                    ['Focus Ring', <CopyableToken key="fcs" token="colors.brand.default" />],
                  ]}
                />
              </div>
            </CollapsibleSection>
          </section>

          {/* Accessibility */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Feature', 'Implementation']}
                rows={[
                  ['Sort controls', 'Native <button> inside <th> with aria-sort and aria-label'],
                  ['Sort announcements', 'aria-live="polite" region announces sort changes'],
                  ['Loading state', 'aria-busy on <table>, live region announces "Loading data"'],
                  ['Focus indicators', '2px solid brand outline on focus-visible for all interactive elements'],
                  ['Card view semantics', '<dl>/<dt>/<dd> for label-value pairs, aria-label on cards'],
                  ['Reduced motion', 'Skeleton pulse animation disabled via prefers-reduced-motion'],
                  ['Keyboard navigation', 'Enter/Space on sortable headers, clickable rows, and card items'],
                  ['Row count', 'aria-rowcount on <table> announces total data rows'],
                  ['Selection', 'aria-selected on selected rows, checkbox with aria-label, select-all with indeterminate state'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          {/* Usage */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Import</h3>
              <CodeBlock>{`import { DataTable } from '@/components'
import type { DataTableColumn, DataTableProps, SortState } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Minimal Example</h3>
              <CodeBlock>{`const columns: DataTableColumn<Product>[] = [
  { key: 'name', header: 'Name', cardPrimary: true },
  { key: 'status', header: 'Status' },
  { key: 'price', header: 'Price', align: 'right' },
]

<DataTable
  columns={columns}
  data={products}
  rowKey={(row) => row.id}
  caption="Product listing"
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With Selection</h3>
              <CodeBlock>{`const [selected, setSelected] = useState<Set<string>>(new Set())

<DataTable
  columns={columns}
  data={products}
  rowKey={(row) => row.id}
  selectable
  selectedKeys={selected}
  onSelectionChange={setSelected}
  caption="Selectable products"
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With Toolbar</h3>
              <CodeBlock>{`const [display, setDisplay] = useState<'table' | 'cards'>('table')
const [selected, setSelected] = useState<Set<string>>(new Set())

<>
  <DataTable.Toolbar>
    <DataTable.Toolbar.Left>
      <DataTable.SelectionInfo count={selected.size}>
        <DataTable.IconButton title="Delete"><Trash size={16} /></DataTable.IconButton>
      </DataTable.SelectionInfo>
    </DataTable.Toolbar.Left>
    <DataTable.Toolbar.Right>
      <DataTable.FilterButton active={hasFilters} count={3} onClick={openFilter} />
      <DataTable.SortButton onClick={openSort} />
      <DataTable.ViewToggle value={display} onChange={setDisplay} />
    </DataTable.Toolbar.Right>
  </DataTable.Toolbar>
  <DataTable
    columns={columns}
    data={products}
    rowKey={(row) => row.id}
    display={display}
    selectable
    selectedKeys={selected}
    onSelectionChange={setSelected}
  />
</>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With Sorting & Custom Renderers</h3>
              <CodeBlock>{`const [sort, setSort] = useState<SortState>({ key: '', direction: 'none' })

const columns: DataTableColumn<Product>[] = [
  { key: 'name', header: 'Name', cardPrimary: true, sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (row) => <Badge color={statusColor(row.status)}>{row.status}</Badge>,
  },
  {
    key: 'compliance',
    header: 'Compliance',
    align: 'center',
    sortable: true,
    render: (row) => <ProgressBar value={row.compliance} />,
  },
]

<DataTable
  columns={columns}
  data={products}
  rowKey={(row) => row.id}
  sort={sort}
  onSortChange={setSort}
  onRowClick={(row) => router.push(\`/products/\${row.id}\`)}
  striped
  stickyHeader
  maxHeight="400px"
  caption="Compliance overview"
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Loading & Empty States</h3>
              <CodeBlock>{`// Loading skeleton (shows animated placeholder rows)
<DataTable
  columns={columns}
  data={[]}
  rowKey={(_, i) => String(i)}
  loading={true}
  loadingRows={5}
  caption="Loading products..."
/>

// Custom empty state
<DataTable
  columns={columns}
  data={[]}
  rowKey={(_, i) => String(i)}
  emptyState={
    <div style={{ textAlign: 'center', padding: '24px' }}>
      <p>No products found</p>
      <p>Try adjusting your filters.</p>
    </div>
  }
  caption="Product listing"
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Custom Card Renderer</h3>
              <CodeBlock>{`<DataTable
  display="cards"
  columns={columns}
  data={products}
  rowKey={(row) => row.id}
  cardGridColumns="repeat(auto-fill, minmax(240px, 1fr))"
  renderCard={(product, index, { selected, onSelect }) => (
    <ProductCard
      product={product}
      selected={selected}
      onSelect={onSelect}
    />
  )}
  selectable
  selectedKeys={selected}
  onSelectionChange={setSelected}
/>`}</CodeBlock>
            </div>
          </section>

          {/* Props */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>DataTable Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="col">columns</code>, <code key="colt">DataTableColumn{'<T>'}[]</code>, <code key="cold">required</code>, 'Column definitions'],
                  [<code key="data">data</code>, <code key="datat">T[]</code>, <code key="datad">required</code>, 'Data rows'],
                  [<code key="rk">rowKey</code>, <code key="rkt">(row: T, index: number) =&gt; string</code>, <code key="rkd">required</code>, 'Unique key extractor per row'],
                  [<code key="dis">display</code>, <code key="dist">{`'table' | 'cards' | 'auto'`}</code>, <code key="disd">{`'auto'`}</code>, 'Display mode'],
                  [<code key="den">density</code>, <code key="dent">{`'compact' | 'default' | 'comfortable'`}</code>, <code key="dend">{`'default'`}</code>, 'Row density'],
                  [<code key="bp">breakpoint</code>, <code key="bpt">number</code>, <code key="bpd">768</code>, 'Auto-switch width in px'],
                  [<code key="str">striped</code>, <code key="strt">boolean</code>, <code key="strd">false</code>, 'Alternating row backgrounds'],
                  [<code key="hov">hoverable</code>, <code key="hovt">boolean</code>, <code key="hovd">true</code>, 'Row hover highlight'],
                  [<code key="orc">onRowClick</code>, <code key="orct">(row: T, index: number) =&gt; void</code>, <code key="orcd">-</code>, 'Row click handler'],
                  [<code key="sort">sort</code>, <code key="sortt">SortState</code>, <code key="sortd">-</code>, 'Controlled sort state'],
                  [<code key="osc">onSortChange</code>, <code key="osct">(sort: SortState) =&gt; void</code>, <code key="oscd">-</code>, 'Sort change callback'],
                  [<code key="cap">caption</code>, <code key="capt">string</code>, <code key="capd">-</code>, 'Visually hidden table caption'],
                  [<code key="es">emptyState</code>, <code key="est">ReactNode</code>, <code key="esd">{`'No data to display'`}</code>, 'Custom empty content'],
                  [<code key="ld">loading</code>, <code key="ldt">boolean</code>, <code key="ldd">false</code>, 'Show skeleton loading state'],
                  [<code key="lr">loadingRows</code>, <code key="lrt">number</code>, <code key="lrd">5</code>, 'Number of skeleton rows'],
                  [<code key="sh">stickyHeader</code>, <code key="sht">boolean</code>, <code key="shd">false</code>, 'Sticky table header'],
                  [<code key="mh">maxHeight</code>, <code key="mht">string | number</code>, <code key="mhd">-</code>, 'Scroll container max height'],
                  [<code key="sel">selectable</code>, <code key="selt">boolean</code>, <code key="seld">false</code>, 'Enable row selection with checkboxes'],
                  [<code key="sk">selectedKeys</code>, <code key="skt">{`Set<string>`}</code>, <code key="skd">-</code>, 'Controlled set of selected row keys'],
                  [<code key="osc2">onSelectionChange</code>, <code key="osc2t">{`(keys: Set<string>) => void`}</code>, <code key="osc2d">-</code>, 'Selection change callback'],
                  [<code key="rc">renderCard</code>, <code key="rct">{`(row, i, { selected, onSelect }) => ReactNode`}</code>, <code key="rcd">-</code>, 'Custom card renderer (replaces default data-cards)'],
                  [<code key="cgc">cardGridColumns</code>, <code key="cgct">string</code>, <code key="cgcd">{`'repeat(auto-fill, minmax(280px, 1fr))'`}</code>, 'CSS grid-template-columns for card grid'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>DataTableColumn Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="k">key</code>, <code key="kt">string</code>, <code key="kd">required</code>, 'Unique column key (matches data field)'],
                  [<code key="h">header</code>, <code key="ht">string</code>, <code key="hd">required</code>, 'Display header text'],
                  [<code key="al">align</code>, <code key="alt">{`'left' | 'center' | 'right'`}</code>, <code key="ald">{`'left'`}</code>, 'Column text alignment'],
                  [<code key="w">width</code>, <code key="wt">string | number</code>, <code key="wd">auto</code>, 'Fixed column width'],
                  [<code key="so">sortable</code>, <code key="sot">boolean</code>, <code key="sod">false</code>, 'Enable sorting for this column'],
                  [<code key="r">render</code>, <code key="rt">(row: T, index: number) =&gt; ReactNode</code>, <code key="rd">-</code>, 'Custom cell renderer'],
                  [<code key="cl">cardLabel</code>, <code key="clt">string</code>, <code key="cld">header</code>, 'Custom label in card view'],
                  [<code key="cp">cardPrimary</code>, <code key="cpt">boolean</code>, <code key="cpd">false</code>, 'Primary title column on cards'],
                  [<code key="hc">hideOnCard</code>, <code key="hct">boolean</code>, <code key="hcd">false</code>, 'Hide this column in card view'],
                  [<code key="sr">srOnly</code>, <code key="srt">boolean</code>, <code key="srd">false</code>, 'Visually hidden column (e.g. actions)'],
                  [<code key="vis">visible</code>, <code key="vist">boolean</code>, <code key="visd">true</code>, 'Toggle column visibility (hidden columns excluded from both views)'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Toolbar Sub-Components</h3>
              <SpecTable
                headers={['Component', 'Key Props', 'Description']}
                rows={[
                  [<code key="tb">DataTable.Toolbar</code>, <code key="tbp">children</code>, 'Container bar with left/right slots'],
                  [<code key="tbl">DataTable.Toolbar.Left</code>, <code key="tblp">children</code>, 'Left-aligned slot inside the toolbar'],
                  [<code key="tbr">DataTable.Toolbar.Right</code>, <code key="tbrp">children</code>, 'Right-aligned slot inside the toolbar'],
                  [<code key="vt">DataTable.ViewToggle</code>, <code key="vtp">value, onChange</code>, 'Grid/list view toggle buttons'],
                  [<code key="fb">DataTable.FilterButton</code>, <code key="fbp">active?, count?, onClick</code>, 'Filter button with active indicator dot'],
                  [<code key="sb">DataTable.SortButton</code>, <code key="sbp">active?, onClick</code>, 'Sort action button'],
                  [<code key="ib">DataTable.IconButton</code>, <code key="ibp">children, active?, title?, label?</code>, 'Generic toolbar icon button (the atomic unit)'],
                  [<code key="si">DataTable.SelectionInfo</code>, <code key="sip">count, children</code>, '"Selected: N" display with bulk action slots'],
                ]}
              />
            </div>
          </section>

          {/* Design Guidance */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use</h3>
              <SpecTable
                headers={['Scenario', 'Recommendation']}
                rows={[
                  ['Structured data with sortable columns', 'Use DataTable with display="table"'],
                  ['Mobile-first detail cards', 'Use DataTable with display="cards"'],
                  ['Responsive data views', 'Use display="auto" (default) to auto-switch'],
                  ['Dense monitoring dashboards', 'Use density="compact"'],
                  ['Long scrollable lists', 'Enable stickyHeader with maxHeight'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Always provide a caption prop for screen reader context', 'Omit caption — tables without it lack accessible labels'],
                  ['Mark one column as cardPrimary for meaningful card titles', 'Leave all columns unmarked in card view'],
                  ['Use custom render functions for rich content (badges, progress)', 'Display raw data values when visual cues would be clearer'],
                  ['Prefer controlled sort/onSortChange when data comes from an API', 'Mix client-side and server-side sorting logic'],
                  ['Set hideOnCard on columns redundant in card layout', 'Show every column in card view, causing clutter'],
                  ['Test with keyboard navigation and screen readers', 'Skip accessibility testing for table interactions'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={dataTableDocData} />
      )}
    </StyleguideLayout>
  )
}
