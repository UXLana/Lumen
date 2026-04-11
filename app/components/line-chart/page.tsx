'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  SpecTable,
  Playground,
  PillButton,
  StyledCheckbox as StyledCheckboxControl,
  TokenValue,
  CopyableToken,
  CollapsibleSection,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import { LineChart } from '@/components'
import { colors, typography, spacing } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// Mock 30-day cashflow series used for the playground + examples
const CASHFLOW_30D = [
  { label: 'Mar 7', value: 1924000 },
  { label: 'Mar 8', value: 1918000 },
  { label: 'Mar 9', value: 1912000 },
  { label: 'Mar 10', value: 1978000 },
  { label: 'Mar 11', value: 1972000 },
  { label: 'Mar 12', value: 1965000 },
  { label: 'Mar 13', value: 1958000 },
  { label: 'Mar 14', value: 1952000 },
  { label: 'Mar 15', value: 2018000 },
  { label: 'Mar 16', value: 2011000 },
  { label: 'Mar 17', value: 2004000 },
  { label: 'Mar 18', value: 1998000 },
  { label: 'Mar 19', value: 1991000 },
  { label: 'Mar 20', value: 1984000 },
  { label: 'Mar 21', value: 1856000 },
  { label: 'Mar 22', value: 1812000 },
  { label: 'Mar 23', value: 1804000 },
  { label: 'Mar 24', value: 1798000 },
  { label: 'Mar 25', value: 1832000 },
  { label: 'Mar 26', value: 2009000 },
  { label: 'Mar 27', value: 2001000 },
  { label: 'Mar 28', value: 2043000 },
  { label: 'Mar 29', value: 2036000 },
  { label: 'Mar 30', value: 2068000 },
  { label: 'Mar 31', value: 1943000 },
  { label: 'Apr 1', value: 1986000 },
  { label: 'Apr 2', value: 2048000 },
  { label: 'Apr 3', value: 2033000 },
  { label: 'Apr 4', value: 2129000 },
  { label: 'Apr 5', value: 2481000 },
]

// =============================================================================
// DOC DATA (Documentation tab)
// =============================================================================

const lineChartDocData: ComponentDocData = {
  displayName: 'LineChart',
  importPath: '@/components',
  importStatement: `import { LineChart } from '@/components'
import type { LineChartProps, LineChartDatum } from '@/components'`,
  description:
    'LUMEN-themed area/line chart wrapper for time-series data, balance history, and trend visualization. Built on Recharts, pinned to LUMEN design tokens, with a full accessibility layer.',
  props: [
    { name: 'data', type: 'LineChartDatum[]', required: true, description: 'Data series — each point is `{ label, value }`' },
    { name: 'aria-label', type: 'string', required: true, description: 'Accessible title (required). Shown in the hidden data table caption.' },
    { name: 'summary', type: 'string', description: 'Short narrative announced before the data table, e.g. "Balance rose 29% over 30 days."' },
    { name: 'height', type: 'number', default: '280', description: 'Chart height in pixels' },
    { name: 'area', type: 'boolean', default: 'true', description: 'Render as filled area chart (false = pure line)' },
    { name: 'showGrid', type: 'boolean', default: 'true', description: 'Show cartesian grid' },
    { name: 'showXAxis', type: 'boolean', default: 'true', description: 'Show x-axis labels' },
    { name: 'showYAxis', type: 'boolean', default: 'true', description: 'Show y-axis labels' },
    { name: 'showTooltip', type: 'boolean', default: 'true', description: 'Show interactive tooltip on hover' },
    { name: 'currency', type: 'string', default: "'USD'", description: 'ISO currency code for tooltip + accessible table formatting' },
  ],
  typeDefinitions: [
    {
      name: 'LineChartDatum',
      definition: `interface LineChartDatum {\n  label: string  // x-axis label\n  value: number  // y-axis value\n}`,
    },
  ],
  accessibility: [
    { feature: 'Required aria-label', description: 'All charts must have a meaningful accessible name.' },
    { feature: 'Visually hidden data table', description: 'A `<table>` with caption, column headers, and every data point is rendered alongside the visual chart — screen readers read the table instead of the chart.' },
    { feature: 'Narrative summary', description: 'Optional `summary` prop is announced before the data table to give AT users the high-level trend story.' },
    { feature: 'Keyboard navigation', description: 'Recharts `accessibilityLayer` enables arrow-key navigation between data points.' },
    { feature: 'Reduced motion', description: 'Respects `prefers-reduced-motion` — animation is disabled when the user opts out.' },
  ],
  tokens: [
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Line stroke + area gradient start' },
    { token: 'colors.border.lowEmphasis.onLight', value: 'Subtle border', usage: 'Grid lines, axis lines' },
    { token: 'colors.text.lowEmphasis.onLight', value: 'Muted text', usage: 'Axis tick labels' },
    { token: 'colors.surface.light', value: 'Surface', usage: 'Tooltip background + active dot stroke' },
  ],
  relatedComponents: [
    { name: 'SparkLine', href: '/components/spark-line' },
    { name: 'StatsCard', href: '/components/stats-card' },
  ],
  notes: [
    'Default area variant is recommended for balance / cashflow views — the gradient fill reinforces the story visually.',
    'Set `area={false}` for pure-line views when multiple series stack in the same container.',
    'Always provide a `summary` prop for charts that convey meaningful trends — don\'t rely on the data table alone.',
    '⚠️ Needs design review before formal documentation release. API is stable but has one real-world use case (Vault dashboard).',
  ],
  whenToUse: [
    'Time-series data with a continuous value (balance over time, usage trends, revenue history).',
    'Single-metric story where the shape of the trend matters more than precise values.',
    'Dashboard heroes where you want a confident, visual "how are we doing" glance.',
  ],
  whenNotToUse: [
    { scenario: 'Tiny inline trends inside a stat card or table row', instead: 'SparkLine — smaller footprint, auto-generated summary' },
    { scenario: 'Categorical comparison (bar chart territory)', instead: 'Build a BarChart primitive — not yet in LUMEN' },
    { scenario: 'Multi-series comparison with multiple lines', instead: 'Currently single-series only. Extend the API when needed.' },
  ],
  usageExamples: [
    {
      title: '30-day balance trend',
      description: 'Classic area chart with narrative summary for screen readers.',
      isDefault: true,
      code: `<LineChart
  data={cashflow30d}
  height={260}
  aria-label="30-day balance trend"
  summary="Balance rose from $1.92M on March 7 to $2.48M on April 5, up 29% over 30 days."
/>`,
    },
    {
      title: 'Pure line (no fill)',
      description: 'Use `area={false}` for cleaner line-only rendering.',
      code: `<LineChart
  data={monthlyRevenue}
  area={false}
  aria-label="Monthly revenue"
  summary="Revenue grew from $12k in January to $48k in December."
/>`,
    },
    {
      title: 'Minimal chart (no axes, no grid)',
      description: 'Embed in a card or hero where surrounding context provides labels.',
      code: `<LineChart
  data={data}
  showGrid={false}
  showXAxis={false}
  showYAxis={false}
  height={120}
  aria-label="Last 7 days"
/>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function LineChartPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoArea, setDemoArea] = useState(true)
  const [demoShowGrid, setDemoShowGrid] = useState(true)
  const [demoShowXAxis, setDemoShowXAxis] = useState(true)
  const [demoShowYAxis, setDemoShowYAxis] = useState(true)
  const [demoShowTooltip, setDemoShowTooltip] = useState(true)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Line Chart"
      description="Area and line chart wrapper for time-series data. LUMEN-themed, accessible by default, with a visually-hidden data table alternative for screen readers."
      tagline="Every trend has a story."
      activeId="line-chart"
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
            <div style={{ maxWidth: '700px' }}>
              <CodeBlock>{`import { LineChart } from '@/components'

<LineChart
  data={[
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 120 },
    { label: 'Mar', value: 115 },
  ]}
  aria-label="Quarterly revenue"
  summary="Revenue rose from $100 to $115 over 3 months, up 15%."
/>`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Toggle chart properties to see how they affect the rendering. All examples use the same 30-day cashflow dataset.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '48px' }}>
                <div>
                  <Playground
                    preview={
                      <div style={{ width: '100%', padding: spacing.md }}>
                        <LineChart
                          data={CASHFLOW_30D}
                          height={260}
                          area={demoArea}
                          showGrid={demoShowGrid}
                          showXAxis={demoShowXAxis}
                          showYAxis={demoShowYAxis}
                          showTooltip={demoShowTooltip}
                          aria-label="30-day cashflow"
                          summary="Balance rose from $1.92M to $2.48M over 30 days, up 29%."
                        />
                      </div>
                    }
                    code={`<LineChart
  data={cashflow30d}
  height={260}${demoArea ? '' : '\n  area={false}'}${demoShowGrid ? '' : '\n  showGrid={false}'}${demoShowXAxis ? '' : '\n  showXAxis={false}'}${demoShowYAxis ? '' : '\n  showYAxis={false}'}${demoShowTooltip ? '' : '\n  showTooltip={false}'}
  aria-label="30-day cashflow"
  summary="Balance rose from $1.92M to $2.48M over 30 days, up 29%."
/>`}
                    previewPadding={spacing.xs}
                  />
                </div>

                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>Variant</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <PillButton onClick={() => setDemoArea(true)} isActive={demoArea}>Area</PillButton>
                        <PillButton onClick={() => setDemoArea(false)} isActive={!demoArea}>Line</PillButton>
                      </div>
                    </div>

                    <StyledCheckboxControl checked={demoShowGrid} onChange={setDemoShowGrid} label="Show grid" />
                    <StyledCheckboxControl checked={demoShowXAxis} onChange={setDemoShowXAxis} label="Show x-axis" />
                    <StyledCheckboxControl checked={demoShowYAxis} onChange={setDemoShowYAxis} label="Show y-axis" />
                    <StyledCheckboxControl checked={demoShowTooltip} onChange={setDemoShowTooltip} label="Show tooltip" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (chart styling)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                All visual styling is pinned to LUMEN design tokens. The chart re-themes automatically when the active theme changes.
              </p>

              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Tokens used</h3>
                <SpecTable
                  headers={['Element', 'Token', 'Value']}
                  rows={[
                    [
                      'Line stroke + area gradient',
                      <CopyableToken key="br" token="colors.brand.default" />,
                      <TokenValue key="brv" token="colors.brand.default" value={colors.brand.default} />,
                    ],
                    [
                      'Grid lines, axis lines',
                      <CopyableToken key="bl" token="colors.border.lowEmphasis.onLight" />,
                      <TokenValue key="blv" token="colors.border.lowEmphasis.onLight" value={colors.border.lowEmphasis.onLight} />,
                    ],
                    [
                      'Axis tick labels',
                      <CopyableToken key="tl" token="colors.text.lowEmphasis.onLight" />,
                      <TokenValue key="tlv" token="colors.text.lowEmphasis.onLight" value={colors.text.lowEmphasis.onLight} />,
                    ],
                    [
                      'Tooltip background',
                      <CopyableToken key="sl" token="colors.surface.light" />,
                      <TokenValue key="slv" token="colors.surface.light" value={colors.surface.light} />,
                    ],
                  ]}
                />
              </div>
            </CollapsibleSection>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>{`import { LineChart } from '@/components'
import type { LineChartProps, LineChartDatum } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic usage</h3>
              <CodeBlock>{`const data = [
  { label: 'Mar 1', value: 1920000 },
  { label: 'Mar 15', value: 2010000 },
  { label: 'Apr 1', value: 2480000 },
]

<LineChart
  data={data}
  aria-label="30-day balance"
  summary="Balance rose from $1.92M to $2.48M, up 29%."
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Pure line (no fill)</h3>
              <CodeBlock>{`<LineChart
  data={data}
  area={false}
  aria-label="Monthly revenue"
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Minimal (embed in card)</h3>
              <CodeBlock>{`<LineChart
  data={data}
  height={120}
  showGrid={false}
  showXAxis={false}
  showYAxis={false}
  aria-label="7-day trend"
/>`}</CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>
            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="d">data</code>, <code key="dt">LineChartDatum[]</code>, <code key="dd">required</code>, 'Data points to plot'],
                  [<code key="al">aria-label</code>, <code key="alt">string</code>, <code key="ald">required</code>, 'Accessible title'],
                  [<code key="s">summary</code>, <code key="st">string</code>, <code key="sd">—</code>, 'Narrative summary for screen readers'],
                  [<code key="h">height</code>, <code key="ht">number</code>, <code key="hd">280</code>, 'Chart height (px)'],
                  [<code key="a">area</code>, <code key="at">boolean</code>, <code key="ad">true</code>, 'Render as filled area chart'],
                  [<code key="g">showGrid</code>, <code key="gt">boolean</code>, <code key="gd">true</code>, 'Show cartesian grid'],
                  [<code key="x">showXAxis</code>, <code key="xt">boolean</code>, <code key="xd">true</code>, 'Show x-axis labels'],
                  [<code key="y">showYAxis</code>, <code key="yt">boolean</code>, <code key="yd">true</code>, 'Show y-axis labels'],
                  [<code key="t">showTooltip</code>, <code key="tt">boolean</code>, <code key="td">true</code>, 'Show tooltip on hover'],
                  [<code key="c">currency</code>, <code key="ct">string</code>, <code key="cd">{"'USD'"}</code>, 'ISO currency code'],
                ]}
              />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <div style={sharedStyles.card}>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li><code>aria-label</code> is required</li>
                <li>A visually-hidden <code>&lt;table&gt;</code> renders alongside the chart with every data point, caption, and column headers — this is the canonical source for screen readers</li>
                <li>Optional <code>summary</code> prop provides a narrative description announced before the data table</li>
                <li>Recharts <code>accessibilityLayer</code> enables arrow-key navigation between data points</li>
                <li>Animation respects <code>prefers-reduced-motion</code></li>
                <li>The visual chart is marked <code>aria-hidden=&quot;true&quot;</code> so assistive tech reads the table, not duplicated data</li>
              </ul>
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && <ComponentDocumentation data={lineChartDocData} />}
    </StyleguideLayout>
  )
}
