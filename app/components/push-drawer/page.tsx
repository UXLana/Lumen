'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import { Drawer, ColumnManager, Button, SegmentedControl } from '@/components'
import type { ColumnConfig } from '@/components'
import { colors, spacing, typography, borderRadius } from '@/styles/design-tokens'

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
  displayName: 'Drawer',
  importPath: '@/components',
  importStatement: `import { Drawer } from '@/components'\nimport type { DrawerProps, DrawerVariant, DrawerSide } from '@/components'`,
  description:
    'A side drawer with push or overlay modes. Push mode shifts sibling content; overlay mode floats above with a scrim. Supports rounded (inset with border-radius) and square (flush edge) variants. Ideal for filters, column management, settings panels, and detail views.',
  props: [
    { name: 'isOpen', type: 'boolean', description: 'Controls whether the drawer is open' },
    { name: 'onClose', type: '() => void', description: 'Called when close button clicked, Escape pressed, or scrim clicked (overlay)' },
    { name: 'mode', type: "'push' | 'overlay'", default: "'push'", description: 'Push shifts content; overlay floats above with scrim' },
    { name: 'variant', type: "'rounded' | 'square'", default: "'square'", description: 'Visual style — rounded inset panel or flush edge' },
    { name: 'side', type: "'left' | 'right'", default: "'right'", description: 'Which edge the drawer slides from' },
    { name: 'width', type: 'number', default: '320', description: 'Inner panel content width in pixels' },
    { name: 'title', type: 'string', description: 'Header title text' },
    { name: 'headerActions', type: 'ReactNode', description: 'Buttons rendered in the header right slot' },
    { name: 'showCloseButton', type: 'boolean', default: 'true', description: 'Show the X close button in the header' },
    { name: 'children', type: 'ReactNode', description: 'Scrollable content inside the drawer' },
  ],
  accessibility: [
    { feature: 'Keyboard', description: 'Escape key closes the drawer. Close button is focusable.' },
    { feature: 'ARIA (push)', description: 'Push mode uses role="complementary" with aria-label.' },
    { feature: 'ARIA (overlay)', description: 'Overlay mode uses role="dialog" with aria-modal="true". Scrim click closes.' },
    { feature: 'Focus', description: 'Close button has visible hover and focus states.' },
  ],
  tokens: [
    { token: 'spacing.xl', value: '24px', usage: 'Rounded variant inset (top, side, bottom)' },
    { token: 'borderRadius.lg', value: '12px', usage: 'Rounded variant panel corners' },
    { token: 'colors.surface.light', value: 'White', usage: 'Panel background' },
    { token: 'colors.border.lowEmphasis.onLight', value: 'Light gray', usage: 'Panel border and header divider' },
  ],
  relatedComponents: [
    { name: 'ColumnManager', href: '/components/column-manager' },
    { name: 'Toolbar', href: '/components/collection-toolbar' },
    { name: 'FullScreenModal', href: '/components/full-screen-modal' },
  ],
  notes: [
    'Drawer is a layout primitive — it does not manage its own open state. The parent controls `isOpen`.',
    'The rounded variant uses spacing.xl (24px) inset from top, side, and bottom edges.',
    'Content is scrollable by default. The header stays fixed at the top.',
    'Use with ColumnManager for column visibility/order management, or with any panel content.',
    'The drawer pushes sibling content — it does not overlay. Place it inside a flex container alongside your main content.',
  ],
  whenToUse: [
    'Column management panels triggered from a toolbar button.',
    'Filter panels that push table content.',
    'Settings or configuration panels that coexist with the main view.',
    'Detail views that slide in beside a list.',
  ],
  whenNotToUse: [
    { scenario: 'Full-page takeover', instead: 'Use FullScreenModal' },
    { scenario: 'Small confirmation or action', instead: 'Use ConfirmDialog' },
    { scenario: 'Temporary notification', instead: 'Use Toast' },
  ],
  usageExamples: [
    {
      title: 'Column management drawer',
      description: 'Pair with ColumnManager and Toolbar for table column settings.',
      isDefault: true,
      code: `const [drawerOpen, setDrawerOpen] = useState(false)

<div style={{ display: 'flex', height: '100vh' }}>
  <main style={{ flex: 1 }}>
    <Toolbar onColumnManagerClick={() => setDrawerOpen(true)} />
    <DataTable columns={columns} data={data} />
  </main>
  <Drawer
    isOpen={drawerOpen}
    onClose={() => setDrawerOpen(false)}
    variant="rounded"
    title="View settings"
  >
    <ColumnManager columns={columns} onApply={handleApply} />
  </Drawer>
</div>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function DrawerPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerVariant, setDrawerVariant] = useState<'rounded' | 'square'>('rounded')
  const [drawerMode, setDrawerMode] = useState<'push' | 'overlay'>('push')
  const [appliedColumns, setAppliedColumns] = useState(sampleColumns)
  const [resetKey, setResetKey] = useState(0)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Drawer"
      description="A side drawer with push or overlay modes and rounded or square variants. Push mode shifts sibling content; overlay mode floats above with a scrim. Use as a container for filters, column management, or settings."
      tagline="Slides in when needed. Tucks away when not."
      activeId="push-drawer"
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
              <CodeBlock>{`import { Drawer } from '@/components'

<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  variant="rounded"
  title="View settings"
>
  {/* Your content here */}
</Drawer>`}</CodeBlock>
            </div>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Toggle mode (push vs overlay), variant (rounded vs square), then open the drawer to see the ColumnManager inside.
            </p>

            <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.md, alignItems: 'center', flexWrap: 'wrap' }}>
              <SegmentedControl
                segments={[
                  { id: 'push', label: 'Push' },
                  { id: 'overlay', label: 'Overlay' },
                ]}
                value={drawerMode}
                onChange={(id) => setDrawerMode(id as 'push' | 'overlay')}
              />
              <SegmentedControl
                segments={[
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'square', label: 'Square' },
                ]}
                value={drawerVariant}
                onChange={(id) => setDrawerVariant(id as 'rounded' | 'square')}
              />
              <Button
                emphasis="high"
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                {drawerOpen ? 'Close Drawer' : 'Open Drawer'}
              </Button>
            </div>

            <div
              style={{
                ...sharedStyles.card,
                display: 'flex',
                height: 700,
                overflow: 'hidden',
                padding: 0,
              }}
            >
              {/* Main content area */}
              <div
                style={{
                  flex: 1,
                  padding: spacing.xl,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.md,
                  transition: 'all 300ms ease-in-out',
                  overflow: 'hidden',
                }}
              >
                <h3 style={{ ...typography.heading.h5, color: colors.text.highEmphasis.onLight, margin: 0 }}>
                  Main Content Area
                </h3>
                <p style={{ ...typography.body.md, color: colors.text.lowEmphasis.onLight, margin: 0 }}>
                  This content pushes left when the drawer opens. The drawer does not overlay — it coexists in a flex layout.
                </p>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: colors.surface.lightDarker,
                    borderRadius: borderRadius.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px dashed ${colors.border.lowEmphasis.onLight}`,
                  }}
                >
                  <span style={{ ...typography.body.sm, color: colors.text.disabled.onLight }}>
                    Table / content area
                  </span>
                </div>
              </div>

              {/* Push Drawer */}
              <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                mode={drawerMode}
                variant={drawerVariant}
                width={320}
                showCloseButton={false}
              >
                <ColumnManager
                  key={resetKey}
                  columns={appliedColumns}
                  title="Table columns"
                  showHeader={true}
                  showClose={true}
                  onClose={() => setDrawerOpen(false)}
                  switchSize="sm"
                  onApply={(updated) => {
                    setAppliedColumns(updated)
                    setResetKey((k) => k + 1)
                  }}
                  onReset={() => {
                    setAppliedColumns(sampleColumns)
                    setResetKey((k) => k + 1)
                  }}
                  width="100%"
                  height="100%"
                  style={{
                    boxShadow: 'none',
                    border: 'none',
                    borderRadius: 0,
                  }}
                />
              </Drawer>
            </div>
          </section>

          {/* Variants */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Variants</h2>
            <div style={{ ...sharedStyles.card, maxWidth: '600px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...typography.label.sm, textAlign: 'left', padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>Variant</th>
                    <th style={{ ...typography.label.sm, textAlign: 'left', padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['rounded', 'Inset panel with border-radius. 24px (spacing.xl) gap from top, right, and bottom edges. Transparent outer background.'],
                    ['square', 'Flush to edge. Full height. Border on the joining side. Solid surface background.'],
                  ].map(([variant, desc]) => (
                    <tr key={variant}>
                      <td style={{ ...typography.code.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.highEmphasis.onLight }}>{variant}</td>
                      <td style={{ ...typography.body.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.lowEmphasis.onLight }}>{desc}</td>
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
            <h2 style={sharedStyles.sectionTitle}>With ColumnManager</h2>
            <p style={sharedStyles.sectionDescription}>
              Pair Drawer with ColumnManager for table column management. Strip the ColumnManager's own container styles so it fills the drawer.
            </p>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`const [drawerOpen, setDrawerOpen] = useState(false)
const [columns, setColumns] = useState(initialColumns)

<div style={{ display: 'flex', height: '100vh' }}>
  <main style={{ flex: 1 }}>
    <Toolbar onColumnManagerClick={() => setDrawerOpen(true)} />
    <DataTable columns={visibleColumns} data={data} />
  </main>

  <Drawer
    isOpen={drawerOpen}
    onClose={() => setDrawerOpen(false)}
    variant="rounded"
    title="View settings"
    headerActions={<Button emphasis="low" onClick={handleReset}>Reset</Button>}
  >
    <ColumnManager
      columns={columns}
      onApply={(updated) => { setColumns(updated); setDrawerOpen(false) }}
      width="100%"
      height="100%"
      style={{ boxShadow: 'none', border: 'none', borderRadius: 0 }}
    />
  </Drawer>
</div>`}</CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Layout Pattern</h2>
            <p style={sharedStyles.sectionDescription}>
              Drawer must be placed inside a flex container. It animates its width, pushing siblings.
            </p>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`// Required flex parent layout
<div style={{ display: 'flex', height: '100%' }}>
  <main style={{ flex: 1, overflow: 'auto' }}>
    {/* Main content shrinks when drawer opens */}
  </main>
  <Drawer isOpen={open} onClose={close} side="right">
    {/* Drawer content */}
  </Drawer>
</div>`}</CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Rounded Variant Spacing</h2>
            <p style={sharedStyles.sectionDescription}>
              The rounded variant uses <code>spacing.xl</code> (24px) tokenized inset on three sides (top, right, bottom). The inner panel gets <code>borderRadius.lg</code> and a subtle border.
            </p>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`// Rounded variant outer padding (right-side drawer):
// padding: 24px 24px 24px 0
// This means the panel "floats" with breathing room
// from the viewport edges.

<Drawer variant="rounded" side="right" />
// Inner panel: borderRadius.lg, 1px border
// Outer: transparent background, 24px inset`}</CodeBlock>
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
