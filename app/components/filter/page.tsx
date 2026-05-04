'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import {
  Drawer,
  Filter,
  Button,
  SegmentedControl,
  Chip,
  ChipGroup,
} from '@/components'
import type { FilterValues } from '@/components'
import { colors, spacing, typography } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// SAMPLE DATA
// =============================================================================

const statusItems = [
  { value: 'active', label: 'Active', meta: '128' },
  { value: 'pending', label: 'Pending', meta: '24' },
  { value: 'archived', label: 'Archived', meta: '47' },
  { value: 'draft', label: 'Draft', meta: '12' },
  { value: 'review', label: 'In review', meta: '6' },
]

const ownerItems = [
  { value: 'me', label: 'Assigned to me', meta: '8' },
  { value: 'team', label: 'My team', meta: '34' },
  { value: 'unassigned', label: 'Unassigned', meta: '11' },
  { value: 'archived', label: 'Archived owners', meta: '2' },
]

const categoryItems = [
  { value: 'apparel', label: 'Apparel', meta: '64' },
  { value: 'footwear', label: 'Footwear', meta: '32' },
  { value: 'accessories', label: 'Accessories', meta: '21' },
  { value: 'home', label: 'Home', meta: '8' },
  { value: 'outdoor', label: 'Outdoor', meta: '5' },
]

const supplierItems = [
  { value: 'northwind', label: 'Northwind Goods', meta: '18' },
  { value: 'atlas', label: 'Atlas Supply', meta: '14' },
  { value: 'meridian', label: 'Meridian Trading', meta: '9' },
  { value: 'beacon', label: 'Beacon Imports', meta: '4' },
]

const typeItems = [
  { value: 'standard', label: 'Standard', meta: '92' },
  { value: 'premium', label: 'Premium', meta: '47' },
  { value: 'limited', label: 'Limited edition', meta: '11' },
  { value: 'preorder', label: 'Pre-order', meta: '3' },
]

// Maps each section id back to its display label + option labels —
// used by the chip output to render "Section: Value" pills.
const sectionConfig: Record<
  string,
  { title: string; items: { value: string; label: string }[] }
> = {
  status: { title: 'Status', items: statusItems },
  owner: { title: 'Owner', items: ownerItems },
  category: { title: 'Category', items: categoryItems },
  supplier: { title: 'Supplier', items: supplierItems },
  type: { title: 'Type', items: typeItems },
}

interface ActiveFilterChip {
  sectionId: string
  sectionTitle: string
  value: string
  label: string
}

function flattenActiveFilters(values: FilterValues): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = []
  for (const [sectionId, raw] of Object.entries(values)) {
    const config = sectionConfig[sectionId]
    if (!config || raw === undefined) continue
    const valueArray = Array.isArray(raw) ? raw : typeof raw === 'string' && raw ? [raw] : []
    for (const v of valueArray) {
      const label = config.items.find((i) => i.value === v)?.label ?? v
      chips.push({ sectionId, sectionTitle: config.title, value: v, label })
    }
  }
  return chips
}

// =============================================================================
// DOC DATA
// =============================================================================

const docData: ComponentDocData = {
  displayName: 'Filter',
  importPath: '@/components',
  importStatement: `import { Filter, Drawer } from '@/components'\nimport type { FilterValues } from '@/components'`,
  description:
    'Compound filter component designed to live inside Drawer. Composes existing primitives — Checkbox, Radio, Select, Chip, Input — into a coordinated filter panel with collapsible sections, multi-select chip displays, and a numeric range control. Manages filter values through context so consumers only handle the final FilterValues map.',
  props: [
    { name: 'values', type: 'FilterValues', description: 'Controlled values keyed by section id' },
    { name: 'defaultValues', type: 'FilterValues', description: 'Initial values for uncontrolled mode' },
    { name: 'onChange', type: '(values: FilterValues) => void', description: 'Fires whenever any control changes' },
    { name: 'defaultExpandedIds', type: 'string[]', description: 'Section ids that are expanded on mount' },
    { name: 'children', type: 'ReactNode', description: 'Filter.Section, Filter.Checkbox, Filter.Radio, Filter.ClearAll' },
  ],
  accessibility: [
    { feature: 'Section headers', description: 'Each section header is a button with aria-expanded and aria-controls wired to its panel.' },
    { feature: 'Form controls', description: 'Reuses Checkbox, Radio, Select, and Input — all of which already meet WCAG 2.2 AA.' },
    { feature: 'Region', description: 'Root renders role="region" with aria-label="Filters" so screen readers can navigate to it.' },
    { feature: 'Meta labels', description: 'Right-aligned counts/values are aria-hidden — the primary control name carries the accessible label.' },
  ],
  tokens: [
    { token: 'spacing.md', value: '16px', usage: 'Section vertical padding' },
    { token: 'spacing.sm', value: '12px', usage: 'Gap between section title and content' },
    { token: 'spacing[\'2xs\']', value: '4px', usage: 'Vertical gap between rows in a section' },
    { token: 'colors.brand.default', value: 'Brand color', usage: 'Selected meta-label color and clear-all hover' },
    { token: 'colors.border.lowEmphasis.onLight', value: 'Light gray', usage: 'Section divider lines' },
    { token: 'typography.label.sm', value: '12/16', usage: 'Uppercase eyebrow on section headers' },
  ],
  relatedComponents: [
    { name: 'Drawer', href: '/components/push-drawer' },
    { name: 'ColumnManager', href: '/components/column-manager' },
    { name: 'Toolbar', href: '/components/collection-toolbar' },
    { name: 'Checkbox', href: '/components/checkbox' },
    { name: 'Radio', href: '/components/radio' },
    { name: 'Select', href: '/components/select' },
  ],
  notes: [
    'Filter is a layout/state primitive — it does not render its own drawer chrome. Place it as a child of <Drawer>.',
    'State is managed through React Context. Each section reads/writes its slice of FilterValues by sectionId.',
    'Sections render through Accordion variant="eyebrow" — uppercase low-emphasis header with a right-side chevron.',
    'For multi-select, use Filter.Checkbox rows. A list of checkboxes is more scannable and accessible than a select+chip pattern.',
    'Filter.ClearAll without a sectionId clears every section. With a sectionId it clears only that section.',
  ],
  whenToUse: [
    'A side panel for filtering a list, table, or collection.',
    'Persisted, structured filter sets — status, owner, category, type, range.',
    'Filter UI that needs to live alongside its data view (push mode) instead of overlaying it.',
  ],
  whenNotToUse: [
    { scenario: 'A single inline search box', instead: 'Use Input with a search icon' },
    { scenario: 'A short, flat tag list', instead: 'Use ChipGroup directly' },
    { scenario: 'Column visibility/order', instead: 'Use ColumnManager' },
  ],
  usageExamples: [
    {
      title: 'Filter in a Drawer',
      description: 'Standard pairing — Drawer provides the chrome, Filter manages the controls.',
      isDefault: true,
      code: `const [open, setOpen] = useState(false)
const [values, setValues] = useState<FilterValues>({})

<Drawer
  isOpen={open}
  onClose={() => setOpen(false)}
  variant="rounded"
  title="Filters"
  headerActions={
    <Button emphasis="low" size="md" onClick={() => setValues({})}>
      Reset
    </Button>
  }
>
  <Filter values={values} onChange={setValues}>
    <Filter.Section id="status" title="Status">
      <Filter.Checkbox sectionId="status" value="active" label="Active" metaLabel="128" />
      <Filter.Checkbox sectionId="status" value="pending" label="Pending" metaLabel="24" />
      <Filter.ClearAll sectionId="status" />
    </Filter.Section>

    <Filter.Section id="category" title="Category">
      <Filter.Checkbox sectionId="category" value="apparel" label="Apparel" metaLabel="64" />
      <Filter.Checkbox sectionId="category" value="footwear" label="Footwear" metaLabel="32" />
      <Filter.ClearAll sectionId="category" />
    </Filter.Section>

    <Filter.Section id="type" title="Type">
      <Filter.Radio sectionId="type" value="standard" label="Standard" />
      <Filter.Radio sectionId="type" value="premium" label="Premium" />
    </Filter.Section>
  </Filter>
</Drawer>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function FilterPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')
  const [drawerVariant, setDrawerVariant] = useState<'rounded' | 'square'>('rounded')
  const [filterValues, setFilterValues] = useState<FilterValues>({
    status: ['active'],
  })

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const activeFilterChips = flattenActiveFilters(filterValues)
  const activeCount = activeFilterChips.length

  const removeFilterValue = (sectionId: string, value: string) => {
    setFilterValues((prev) => {
      const current = prev[sectionId]
      if (Array.isArray(current)) {
        const next = current.filter((v) => v !== value)
        if (next.length === 0) {
          const { [sectionId]: _omit, ...rest } = prev
          return rest
        }
        return { ...prev, [sectionId]: next }
      }
      if (typeof current === 'string' && current === value) {
        const { [sectionId]: _omit, ...rest } = prev
        return rest
      }
      return prev
    })
  }

  return (
    <StyleguideLayout
      title="Filter"
      description="A compound filter component built to live inside Drawer. Sections collapse, controls compose existing primitives, and state flows through a single FilterValues map."
      tagline="Compose filters. Drop into a drawer."
      activeId="filter"
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
              <CodeBlock>{`import { Drawer, Filter } from '@/components'

<Drawer isOpen={open} onClose={close} variant="rounded" title="Filters">
  <Filter onChange={setValues}>
    <Filter.Section id="status" title="Status">
      <Filter.Checkbox sectionId="status" value="active" label="Active" metaLabel="128" />
      <Filter.Checkbox sectionId="status" value="pending" label="Pending" metaLabel="24" />
      <Filter.ClearAll sectionId="status" />
    </Filter.Section>
  </Filter>
</Drawer>`}</CodeBlock>
            </div>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing.md }}>
              <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
                <SegmentedControl
                  segments={[
                    { id: 'rounded', label: 'Rounded' },
                    { id: 'square', label: 'Square' },
                  ]}
                  value={drawerVariant}
                  onChange={(id) => setDrawerVariant(id as 'rounded' | 'square')}
                />
                <span style={{ color: colors.text.lowEmphasis.onLight }}>
                  {activeCount} active filter{activeCount === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                height: '640px',
                background: colors.surface.lightDarker,
                borderRadius: 12,
                overflow: 'hidden',
                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              }}
            >
              <main
                style={{
                  flex: 1,
                  padding: spacing.xl,
                  color: colors.text.lowEmphasis.onLight,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.md,
                  overflow: 'auto',
                }}
              >
                <span
                  style={{
                    ...typography.label.md,
                    color: colors.text.highEmphasis.onLight,
                  }}
                >
                  Active filters
                </span>

                {activeFilterChips.length === 0 ? (
                  <span
                    style={{
                      ...typography.body.sm,
                      color: colors.text.lowEmphasis.onLight,
                    }}
                  >
                    No filters applied. Tick a checkbox or radio in the drawer to see it here.
                  </span>
                ) : (
                  <ChipGroup>
                    {activeFilterChips.map((chip) => (
                      <Chip
                        key={`${chip.sectionId}:${chip.value}`}
                        size="lg"
                        removable
                        onRemove={() => removeFilterValue(chip.sectionId, chip.value)}
                      >
                        {chip.sectionTitle}: {chip.label}
                      </Chip>
                    ))}
                    <Button
                      emphasis="low"
                      size="lg"
                      onClick={() => setFilterValues({})}
                    >
                      Clear
                    </Button>
                  </ChipGroup>
                )}
              </main>
              <Drawer
                isOpen
                onClose={() => undefined}
                mode="push"
                variant={drawerVariant}
                side="right"
                width={320}
                title="Filters"
                showCloseButton={false}
                headerActions={
                  <>
                    <Button
                      emphasis="low"
                      size="md"
                      onClick={() => setFilterValues({})}
                    >
                      Clear
                    </Button>
                    <Button
                      emphasis="high"
                      size="md"
                      onClick={() => {
                        // In a real app, commit filterValues to your data query.
                      }}
                    >
                      Apply
                    </Button>
                  </>
                }
              >
                <Filter values={filterValues} onChange={setFilterValues}>
                  <Filter.Section id="status" title="Status" defaultExpanded>
                    {statusItems.map((item) => (
                      <Filter.Checkbox
                        key={item.value}
                        sectionId="status"
                        value={item.value}
                        label={item.label}
                        metaLabel={item.meta}
                      />
                    ))}
                    <Filter.ClearAll sectionId="status" />
                  </Filter.Section>

                  <Filter.Section id="owner" title="Owner" defaultExpanded>
                    {ownerItems.map((item) => (
                      <Filter.Checkbox
                        key={item.value}
                        sectionId="owner"
                        value={item.value}
                        label={item.label}
                        metaLabel={item.meta}
                      />
                    ))}
                    <Filter.ClearAll sectionId="owner" />
                  </Filter.Section>

                  <Filter.Section id="category" title="Category">
                    {categoryItems.map((item) => (
                      <Filter.Checkbox
                        key={item.value}
                        sectionId="category"
                        value={item.value}
                        label={item.label}
                        metaLabel={item.meta}
                      />
                    ))}
                    <Filter.ClearAll sectionId="category" />
                  </Filter.Section>

                  <Filter.Section id="supplier" title="Supplier">
                    {supplierItems.map((item) => (
                      <Filter.Checkbox
                        key={item.value}
                        sectionId="supplier"
                        value={item.value}
                        label={item.label}
                        metaLabel={item.meta}
                      />
                    ))}
                    <Filter.ClearAll sectionId="supplier" />
                  </Filter.Section>

                  <Filter.Section id="type" title="Type" defaultExpanded>
                    {typeItems.map((item) => (
                      <Filter.Radio
                        key={item.value}
                        sectionId="type"
                        value={item.value}
                        label={item.label}
                        metaLabel={item.meta}
                      />
                    ))}
                  </Filter.Section>
                </Filter>
              </Drawer>
            </div>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Compound API</h2>
            <p style={{ color: colors.text.lowEmphasis.onLight, marginBottom: spacing.md }}>
              Filter is a compound component. Each part reads from a shared context, so values stay coordinated without prop-drilling.
            </p>
            <CodeBlock>{`<Filter onChange={setValues}>
  <Filter.Section id="status" title="Status">
    <Filter.Checkbox sectionId="status" value="active" label="Active" metaLabel="128" />
    <Filter.Checkbox sectionId="status" value="pending" label="Pending" metaLabel="24" />
    <Filter.ClearAll sectionId="status" />
  </Filter.Section>

  <Filter.Section id="category" title="Category">
    <Filter.Checkbox sectionId="category" value="apparel" label="Apparel" metaLabel="64" />
    <Filter.Checkbox sectionId="category" value="footwear" label="Footwear" metaLabel="32" />
    <Filter.ClearAll sectionId="category" />
  </Filter.Section>

  <Filter.Section id="type" title="Type">
    <Filter.Radio sectionId="type" value="standard" label="Standard" />
    <Filter.Radio sectionId="type" value="premium" label="Premium" />
  </Filter.Section>
</Filter>`}</CodeBlock>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Controlled vs uncontrolled</h2>
            <p style={{ color: colors.text.lowEmphasis.onLight, marginBottom: spacing.md }}>
              Pass <code>values</code> to control state externally; pass <code>defaultValues</code> for uncontrolled. Both call <code>onChange</code> on every update.
            </p>
            <CodeBlock>{`// Controlled
const [values, setValues] = useState<FilterValues>({})
<Filter values={values} onChange={setValues}>...</Filter>

// Uncontrolled
<Filter defaultValues={{ status: ['active'] }} onChange={(v) => console.log(v)}>...</Filter>`}</CodeBlock>
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
