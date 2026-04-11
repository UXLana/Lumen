'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  SpecTable,
  Playground,
  PillButton,
  TokenValue,
  CopyableToken,
  CollapsibleSection,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import { SparkLine } from '@/components'
import { colors, typography, spacing, fontFamilies, fontWeights, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// Mock data for playground
const UP_TREND = [24, 32, 28, 35, 42, 48, 62, 58, 75, 82, 91, 110, 128, 142]
const DOWN_TREND = [142, 128, 124, 118, 95, 82, 78, 64, 52, 45, 38, 32, 28, 24]
const NEUTRAL_TREND = [50, 52, 48, 51, 53, 49, 50, 52, 48, 51, 50, 49, 52, 50]

// =============================================================================
// DOC DATA (Documentation tab)
// =============================================================================

const sparkLineDocData: ComponentDocData = {
  displayName: 'SparkLine',
  importPath: '@/components',
  importStatement: `import { SparkLine } from '@/components'
import type { SparkLineProps } from '@/components'`,
  description:
    'Tiny inline trend chart for stat cards, KPI rows, and table cells. Communicates direction-of-travel without taking up horizontal space.',
  props: [
    { name: 'data', type: 'number[]', required: true, description: 'Array of values to plot. Labels are not displayed.' },
    { name: 'aria-label', type: 'string', required: true, description: 'Accessible title describing what the trend represents.' },
    { name: 'direction', type: "'up' | 'down' | 'neutral'", default: "'up'", description: 'Controls the stroke color — up=success, down=important, neutral=muted.' },
    { name: 'width', type: 'number', default: '120', description: 'Width in pixels.' },
    { name: 'height', type: 'number', default: '32', description: 'Height in pixels.' },
    { name: 'summary', type: 'string', description: 'Narrative summary announced to assistive tech. If omitted, auto-generated from first/last/range.' },
  ],
  accessibility: [
    { feature: 'Required aria-label', description: 'Every SparkLine must have a meaningful accessible name.' },
    { feature: 'Auto-generated summary', description: 'If no `summary` prop is passed, the component generates one from the data — direction, percentage change, first/last values, and range.' },
    { feature: 'Semantic structure', description: 'Wraps in `<figure role="group">` with `aria-describedby` pointing at a visually-hidden `<p>` containing the summary.' },
    { feature: 'Reduced motion', description: 'Respects `prefers-reduced-motion`.' },
    { feature: 'Color not alone', description: 'Direction is conveyed via color but ALSO via the aria-label/summary ("up 420%"), never color alone.' },
  ],
  tokens: [
    { token: 'colors.status.success', value: 'Success green', usage: 'Stroke color for `direction="up"`' },
    { token: 'colors.status.important', value: 'Error red', usage: 'Stroke color for `direction="down"`' },
    { token: 'colors.text.lowEmphasis.onLight', value: 'Muted text', usage: 'Stroke color for `direction="neutral"`' },
  ],
  relatedComponents: [
    { name: 'LineChart', href: '/components/line-chart' },
    { name: 'StatsCard', href: '/components/stats-card' },
    { name: 'Amount', href: '/components/amount' },
  ],
  notes: [
    'Default dimensions (120×32) fit inside a StatsCard footer row without crowding the main value.',
    'For scale-sensitive comparisons, provide a custom `summary` with actual numbers instead of relying on the auto-generated one.',
    '⚠️ Needs design review before formal documentation release.',
  ],
  whenToUse: [
    'Inline trend indicators inside StatsCards, data table rows, or KPI widgets.',
    'Dashboards where users scan multiple metrics at once and want direction-of-travel at a glance.',
    'Cases where a full LineChart would be overkill but a bare number hides the story.',
  ],
  whenNotToUse: [
    { scenario: 'Full-size trend visualization with axes + tooltip', instead: 'LineChart — richer features, keyboard-navigable data points' },
    { scenario: 'Categorical comparison or zero-baseline metric', instead: 'Use a custom bar chart (not yet in LUMEN)' },
  ],
  usageExamples: [
    {
      title: 'Inside a stats card',
      description: 'Classic usage — a sparkline in the footer of a KPI widget showing the metric\'s recent trajectory.',
      isDefault: true,
      code: `<div style={{ padding: spacing.lg }}>
  <div>Inflows · 30d</div>
  <Amount value={1058379} size="lg" variant="credit" />
  <SparkLine
    data={[62, 48, 85, 42, 51, 60, 178]}
    direction="up"
    aria-label="Inflows trend over last 7 days"
  />
</div>`,
    },
    {
      title: 'Explicit summary for screen readers',
      description: 'Override the auto-generated summary with a human-written one when the exact numbers matter.',
      code: `<SparkLine
  data={[24, 32, 28, 75, 82, 91, 128]}
  direction="up"
  aria-label="Weekly revenue"
  summary="Weekly revenue grew from $24k to $128k, up 433% over 7 days."
/>`,
    },
    {
      title: 'Downward trend',
      description: 'Use `direction="down"` to render the stroke in the error color.',
      code: `<SparkLine
  data={[142, 128, 95, 78, 52, 38, 28]}
  direction="down"
  aria-label="Outflows trend"
/>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function SparkLinePage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoDirection, setDemoDirection] = useState<'up' | 'down' | 'neutral'>('up')
  const [demoWidth, setDemoWidth] = useState(120)
  const [demoHeight, setDemoHeight] = useState(32)

  const demoData =
    demoDirection === 'up' ? UP_TREND : demoDirection === 'down' ? DOWN_TREND : NEUTRAL_TREND

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Spark Line"
      description="Tiny inline trend charts for stat cards, KPI rows, and table cells. Fast to scan, accessible by default."
      tagline="Direction at a glance."
      activeId="spark-line"
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
              <CodeBlock>{`import { SparkLine } from '@/components'

<SparkLine
  data={[24, 32, 28, 75, 82, 91, 128]}
  direction="up"
  aria-label="Revenue trend"
/>`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Toggle the direction to see how the stroke color changes. All three directions use semantic status tokens.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                <div>
                  <Playground
                    preview={
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.md, padding: spacing.md }}>
                        <SparkLine
                          data={demoData}
                          direction={demoDirection}
                          width={demoWidth}
                          height={demoHeight}
                          aria-label={`${demoDirection} trend sparkline`}
                        />
                        <div style={{ fontSize: typography.body.xs.fontSize, color: colors.text.lowEmphasis.onLight, fontFamily: fontFamilies.mono }}>
                          {demoWidth} × {demoHeight} px
                        </div>
                      </div>
                    }
                    code={`<SparkLine
  data={[${demoData.join(', ')}]}
  direction="${demoDirection}"${demoWidth !== 120 ? `\n  width={${demoWidth}}` : ''}${demoHeight !== 32 ? `\n  height={${demoHeight}}` : ''}
  aria-label="${demoDirection} trend sparkline"
/>`}
                    previewPadding={spacing.xs}
                  />
                </div>

                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>Direction</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['up', 'down', 'neutral'] as const).map((d) => (
                          <PillButton key={d} onClick={() => setDemoDirection(d)} isActive={demoDirection === d}>
                            {d}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>Width</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {[80, 120, 180, 240].map((w) => (
                          <PillButton key={w} onClick={() => setDemoWidth(w)} isActive={demoWidth === w}>
                            {w}px
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>Height</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {[24, 32, 48, 64].map((h) => (
                          <PillButton key={h} onClick={() => setDemoHeight(h)} isActive={demoHeight === h}>
                            {h}px
                          </PillButton>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== IN-CONTEXT EXAMPLE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>In context</h2>
            <p style={sharedStyles.sectionDescription}>
              SparkLines shine when paired with a value inside a stat card. Here are all three directions in a row.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.lg }}>
                {[
                  { label: 'Inflows · 30d', value: '$1,058k', dir: 'up' as const, data: UP_TREND },
                  { label: 'Outflows · 30d', value: '$702k', dir: 'down' as const, data: DOWN_TREND },
                  { label: 'Active users', value: '12,480', dir: 'neutral' as const, data: NEUTRAL_TREND },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: spacing.lg,
                      backgroundColor: colors.surface.light,
                      border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                      borderRadius: borderRadius.md,
                    }}
                  >
                    <div
                      style={{
                        fontSize: typography.label.sm.fontSize,
                        fontWeight: fontWeights.semibold,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: colors.text.lowEmphasis.onLight,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {stat.label}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        gap: spacing.sm,
                      }}
                    >
                      <span
                        style={{
                          fontSize: typography.heading.h5.fontSize,
                          fontWeight: fontWeights.bold,
                          color:
                            stat.dir === 'up'
                              ? colors.status.success
                              : stat.dir === 'down'
                                ? colors.status.important
                                : colors.text.highEmphasis.onLight,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {stat.value}
                      </span>
                      <SparkLine
                        data={stat.data}
                        direction={stat.dir}
                        aria-label={`${stat.label} trend`}
                        width={100}
                        height={32}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens">
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Stroke colors by direction</h3>
                <SpecTable
                  headers={['Direction', 'Token', 'Value']}
                  rows={[
                    [
                      'up',
                      <CopyableToken key="up" token="colors.status.success" />,
                      <TokenValue key="upv" token="colors.status.success" value={colors.status.success} />,
                    ],
                    [
                      'down',
                      <CopyableToken key="dn" token="colors.status.important" />,
                      <TokenValue key="dnv" token="colors.status.important" value={colors.status.important} />,
                    ],
                    [
                      'neutral',
                      <CopyableToken key="nu" token="colors.text.lowEmphasis.onLight" />,
                      <TokenValue key="nuv" token="colors.text.lowEmphasis.onLight" value={colors.text.lowEmphasis.onLight} />,
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
              <CodeBlock>{`import { SparkLine } from '@/components'
import type { SparkLineProps } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Inside a stat card</h3>
              <CodeBlock>{`<div style={{ padding: spacing.lg }}>
  <div>Inflows · 30d</div>
  <Amount value={1058379} size="lg" variant="credit" />
  <SparkLine
    data={[62, 48, 85, 42, 51, 60, 178]}
    direction="up"
    aria-label="Inflows trend"
  />
</div>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With explicit summary</h3>
              <CodeBlock>{`<SparkLine
  data={[24, 32, 28, 75, 82, 91, 128]}
  direction="up"
  aria-label="Weekly revenue"
  summary="Weekly revenue grew from $24k to $128k, up 433% over 7 days."
/>`}</CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>
            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="d">data</code>, <code key="dt">number[]</code>, <code key="dd">required</code>, 'Array of values'],
                  [<code key="al">aria-label</code>, <code key="alt">string</code>, <code key="ald">required</code>, 'Accessible title'],
                  [<code key="dir">direction</code>, <code key="dirt">{"'up' | 'down' | 'neutral'"}</code>, <code key="dird">{"'up'"}</code>, 'Trend direction (sets stroke color)'],
                  [<code key="w">width</code>, <code key="wt">number</code>, <code key="wd">120</code>, 'Width in pixels'],
                  [<code key="h">height</code>, <code key="ht">number</code>, <code key="hd">32</code>, 'Height in pixels'],
                  [<code key="s">summary</code>, <code key="st">string</code>, <code key="sd">auto</code>, 'Narrative summary for screen readers'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && <ComponentDocumentation data={sparkLineDocData} />}
    </StyleguideLayout>
  )
}
