'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import { Amount } from '@/components'
import { colors, typography, spacing, fontFamilies, fontWeights, borderRadius } from '@/styles/design-tokens'

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// DOC DATA (Documentation tab)
// =============================================================================

const amountDocData: ComponentDocData = {
  displayName: 'Amount',
  importPath: '@/components',
  importStatement: `import { Amount } from '@/components'
import type { AmountProps, AmountSize, AmountVariant, AmountSign } from '@/components'`,
  description:
    'Currency and numeric value display with tabular alignment, locale-aware formatting, and intelligent screen-reader labels. The go-to component for monetary values in dense financial UIs.',
  props: [
    { name: 'value', type: 'number | string', required: true, description: 'The numeric value. Accepts numbers or numeric strings.' },
    { name: 'currency', type: 'string', default: "'USD'", description: 'ISO 4217 currency code (USD, EUR, GBP, etc.).' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", default: "'md'", description: 'Typography scale. `xl`/`2xl` render at display size for balance heroes.' },
    { name: 'variant', type: "'default' | 'credit' | 'debit' | 'pending' | 'muted'", default: "'default'", description: 'Semantic styling. Credit is success green, debit is error red, pending/muted are low-emphasis.' },
    { name: 'sign', type: "'auto' | 'always' | 'never' | 'accounting'", default: "'auto'", description: 'Sign rendering. `accounting` wraps negatives in parentheses.' },
    { name: 'showCents', type: "'auto' | 'always' | 'never'", default: "'auto'", description: 'Control cent display. Auto hides cents on whole numbers.' },
    { name: 'tabular', type: 'boolean', default: 'true', description: 'Enable tabular-nums for column alignment. Disable only for inline prose.' },
    { name: 'locale', type: 'string', default: "'en-US'", description: 'Locale for number formatting.' },
    { name: 'weight', type: "keyof typeof fontWeights", description: 'Override the font weight. Defaults to medium for md+, regular for smaller.' },
    { name: 'aria-label', type: 'string', description: 'Override the auto-generated accessible label.' },
  ],
  accessibility: [
    { feature: 'Smart auto-label', description: 'Generates a human-readable label like "fifty dollars and twenty-five cents" — not the raw number. Respects currency, variant, and showCents.' },
    { feature: 'Variant announced', description: 'When variant="credit" or "debit", the accessible label includes the direction ("credit of", "debit of") so users on screen readers don\'t miss it when sign="never".' },
    { feature: 'Tabular alignment', description: 'Tabular numerics align values vertically in tables without fake-padding, improving scannability for sighted users too.' },
    { feature: 'Semantic element', description: 'Renders as `<output>` — the HTML element designed for calculated/derived values.' },
    { feature: 'aria-live off by default', description: 'Prevents screen-reader spam in data tables. Opt in per-instance if the value changes in response to user action.' },
  ],
  tokens: [
    { token: 'typography.body.xs → heading.h3', value: 'Scaled by size prop', usage: 'Font size for each AmountSize' },
    { token: 'numericStyles.tabular', value: "fontVariantNumeric: 'tabular-nums'", usage: 'Column alignment when tabular={true}' },
    { token: 'colors.status.success', value: 'Success green', usage: 'Color for variant="credit"' },
    { token: 'colors.status.important', value: 'Error red', usage: 'Color for variant="debit"' },
    { token: 'colors.text.lowEmphasis.onLight', value: 'Muted text', usage: 'Color for variant="pending" and "muted"' },
    { token: 'colors.text.highEmphasis.onLight', value: 'Primary text', usage: 'Color for variant="default"' },
  ],
  relatedComponents: [
    { name: 'AmountConfirmDialog', href: '/components/amount-confirm-dialog' },
    { name: 'SparkLine', href: '/components/spark-line' },
    { name: 'LineChart', href: '/components/line-chart' },
    { name: 'StatsCard', href: '/components/stats-card' },
  ],
  notes: [
    'Amount is designed for financial and data-dense contexts. For simple numbers without currency semantics, use plain text with typography tokens.',
    'When using inside a DataTable column, set tabular={true} (the default) to align values by decimal point across rows.',
    '⚠️ Needs design review before formal documentation release.',
  ],
  whenToUse: [
    'Displaying monetary values in tables, cards, or detail views.',
    'Balance heroes, transaction rows, invoice lines, and KPI cards.',
    'Any place where locale-aware currency formatting matters.',
  ],
  whenNotToUse: [
    { scenario: 'Plain integers or counts without currency', instead: 'Use `Intl.NumberFormat` inline or a plain text node with typography tokens' },
    { scenario: 'Large display heroes not tied to money', instead: 'Use a heading with typography.display tokens' },
  ],
  usageExamples: [
    {
      title: 'Balance hero',
      description: 'Display a primary balance in large, confident typography.',
      isDefault: true,
      code: `<Amount value={12485.37} size="2xl" />`,
    },
    {
      title: 'Credit / debit transaction row',
      description: 'Use variants to color-code incoming vs outgoing amounts. The accessible label automatically announces "credit of" or "debit of".',
      code: `<Amount value={250.00} variant="credit" size="md" />
<Amount value={-89.42} variant="debit" size="md" />`,
    },
    {
      title: 'Accounting-style negatives',
      description: 'Parentheses around negative values — standard in bookkeeping and financial statements.',
      code: `<Amount value={-1240.50} sign="accounting" />`,
    },
    {
      title: 'International currency',
      description: 'Full locale-aware formatting for any ISO 4217 currency.',
      code: `<Amount value={5000} currency="EUR" locale="de-DE" />
<Amount value={12000} currency="JPY" locale="ja-JP" showCents="never" />`,
    },
    {
      title: 'Pending / provisional amount',
      description: 'Muted variant for amounts that are not yet final.',
      code: `<Amount value={342.18} variant="pending" /> <em>Pending clearance</em>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function AmountPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Amount"
      description="Currency and numeric value display with tabular alignment and intelligent accessible labels."
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
    >
      {activePageTab === 'overview' && (
        <>
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.h2}>Preview</h2>
            <div
              style={{
                padding: spacing['2xl'],
                backgroundColor: colors.surface.lightDarker,
                borderRadius: borderRadius.lg,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.xl,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: typography.label.sm.fontSize,
                    color: colors.text.lowEmphasis.onLight,
                    fontFamily: fontFamilies.body,
                    marginBottom: spacing.xs,
                  }}
                >
                  Balance
                </div>
                <Amount value={12485.37} size="2xl" />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.sm,
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.md.fontSize,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing.md }}>
                  <span style={{ color: colors.text.highEmphasis.onLight }}>Payroll deposit</span>
                  <Amount value={3200} variant="credit" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing.md }}>
                  <span style={{ color: colors.text.highEmphasis.onLight }}>Office supplies</span>
                  <Amount value={-89.42} variant="debit" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing.md }}>
                  <span style={{ color: colors.text.highEmphasis.onLight }}>Pending refund</span>
                  <Amount value={45.99} variant="pending" />
                </div>
              </div>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.h2}>Sizes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, alignItems: 'flex-start' }}>
              <Amount value={1234.56} size="xs" />
              <Amount value={1234.56} size="sm" />
              <Amount value={1234.56} size="md" />
              <Amount value={1234.56} size="lg" />
              <Amount value={1234.56} size="xl" />
              <Amount value={1234.56} size="2xl" />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.h2}>Variants</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, alignItems: 'flex-start' }}>
              <Amount value={500} variant="default" size="lg" />
              <Amount value={500} variant="credit" size="lg" />
              <Amount value={-500} variant="debit" size="lg" />
              <Amount value={500} variant="pending" size="lg" />
              <Amount value={500} variant="muted" size="lg" />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.h2}>International</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, alignItems: 'flex-start' }}>
              <Amount value={5000} currency="EUR" locale="de-DE" size="lg" />
              <Amount value={5000} currency="GBP" locale="en-GB" size="lg" />
              <Amount value={12000} currency="JPY" locale="ja-JP" showCents="never" size="lg" />
            </div>
          </section>
        </>
      )}

      {activePageTab === 'implementation' && (
        <>
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.h2}>Import</h2>
            <CodeBlock
              code={`import { Amount } from '@/components'
import type { AmountProps, AmountSize, AmountVariant } from '@/components'`}
              language="tsx"
            />
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.h2}>Basic usage</h2>
            <CodeBlock
              code={`// Default: USD, medium size, auto sign
<Amount value={1234.56} />

// Large balance hero
<Amount value={12485.37} size="2xl" />

// Credit (incoming) — success green
<Amount value={250.00} variant="credit" />

// Debit (outgoing) — error red
<Amount value={-89.42} variant="debit" />`}
              language="tsx"
            />
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.h2}>In a data table</h2>
            <CodeBlock
              code={`<table>
  <tbody>
    {transactions.map((tx) => (
      <tr key={tx.id}>
        <td>{tx.description}</td>
        <td style={{ textAlign: 'right' }}>
          <Amount value={tx.amount} variant={tx.amount > 0 ? 'credit' : 'debit'} />
        </td>
      </tr>
    ))}
  </tbody>
</table>`}
              language="tsx"
            />
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.h2}>Accounting format</h2>
            <CodeBlock
              code={`// Parentheses around negatives — standard bookkeeping style
<Amount value={-1240.50} sign="accounting" />
// Renders: (1,240.50)`}
              language="tsx"
            />
          </section>
        </>
      )}

      {activePageTab === 'documentation' && <ComponentDocumentation data={amountDocData} />}
    </StyleguideLayout>
  )
}
