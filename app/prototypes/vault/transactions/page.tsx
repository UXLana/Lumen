// @ts-nocheck
'use client'

import React from 'react'
import {
  Amount,
  Button,
  Badge,
  DataTable,
  Input,
  IconSearch,
  type DataTableColumn,
  type BadgeColor,
} from '@/components'
import { Select } from '@/components/Select'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  breakpoints,
  numericStyles,
} from '@/styles/design-tokens'
import { TRANSACTIONS, type Transaction, type TransactionCategory } from '../data'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

// Category → badge color
const CATEGORY_COLORS: Record<TransactionCategory, BadgeColor> = {
  revenue: 'success',
  payroll: 'brand',
  saas: 'info',
  office: 'neutral',
  travel: 'warning',
  legal: 'error',
  marketing: 'info',
  transfer: 'neutral',
  tax: 'error',
  utilities: 'neutral',
  uncategorized: 'neutral',
}

const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  revenue: 'Revenue',
  payroll: 'Payroll',
  saas: 'SaaS',
  office: 'Office',
  travel: 'Travel',
  legal: 'Legal',
  marketing: 'Marketing',
  transfer: 'Transfer',
  tax: 'Tax',
  utilities: 'Utilities',
  uncategorized: 'Uncategorized',
}

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'posted', label: 'Posted' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
]

export default function TransactionsPage() {
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)
  const [query, setQuery] = React.useState('')
  const [category, setCategory] = React.useState('all')
  const [status, setStatus] = React.useState('all')

  const filtered = TRANSACTIONS.filter((tx) => {
    if (category !== 'all' && tx.category !== category) return false
    if (status !== 'all' && tx.status !== status) return false
    if (query) {
      const q = query.toLowerCase()
      if (
        !tx.description.toLowerCase().includes(q) &&
        !tx.counterparty.toLowerCase().includes(q) &&
        !tx.account.toLowerCase().includes(q)
      ) {
        return false
      }
    }
    return true
  })

  const totalIn = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const totalOut = Math.abs(filtered.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0))

  const columns: DataTableColumn<Transaction>[] = [
    {
      key: 'date',
      header: 'Date',
      width: '110px',
      render: (tx) => (
        <span
          style={{
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
            ...numericStyles.tabular,
          }}
        >
          {tx.date}
        </span>
      ),
    },
    {
      key: 'counterparty',
      header: 'Description',
      render: (tx) => (
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: typography.body.sm.fontSize,
              fontWeight: fontWeights.medium,
              color: colors.text.highEmphasis.onLight,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {tx.counterparty}
          </div>
          <div
            style={{
              fontSize: typography.body.xs.fontSize,
              color: colors.text.lowEmphasis.onLight,
              marginTop: 1,
            }}
          >
            {tx.description}
            {tx.reference && (
              <>
                {' · '}
                <span style={{ fontFamily: fontFamilies.mono }}>{tx.reference}</span>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      width: '140px',
      render: (tx) => (
        <Badge color={CATEGORY_COLORS[tx.category]} variant="outlined" size="sm">
          {CATEGORY_LABELS[tx.category]}
        </Badge>
      ),
    },
    {
      key: 'account',
      header: 'Account',
      width: '160px',
      render: (tx) => (
        <span
          style={{
            fontSize: typography.body.xs.fontSize,
            color: colors.text.lowEmphasis.onLight,
            fontFamily: fontFamilies.body,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            maxWidth: '150px',
          }}
        >
          {tx.account}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (tx) =>
        tx.status === 'posted' ? (
          <Badge color="neutral" variant="outlined" size="sm">
            Posted
          </Badge>
        ) : tx.status === 'pending' ? (
          <Badge color="warning" variant="filled" size="sm">
            Pending
          </Badge>
        ) : (
          <Badge color="error" variant="filled" size="sm">
            Failed
          </Badge>
        ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      width: '140px',
      render: (tx) => (
        <Amount
          value={tx.amount}
          size="sm"
          variant={tx.amount > 0 ? 'credit' : 'debit'}
          sign="auto"
          weight="semibold"
        />
      ),
    },
  ]

  return (
    <div style={{ padding: isMobile ? spacing.lg : `${spacing['2xl']} ${spacing['3xl']}` }}>
      {/* Header */}
      <header style={{ marginBottom: spacing['2xl'] }}>
        <div
          style={{
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.semibold,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: colors.brand.default,
            marginBottom: spacing['2xs'],
          }}
        >
          Transactions
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h2.fontSize,
            fontWeight: fontWeights.bold,
            letterSpacing: '-0.02em',
            color: colors.text.highEmphasis.onLight,
            lineHeight: 1.15,
          }}
        >
          All transactions
        </h1>
        <p
          style={{
            margin: `${spacing.xs} 0 0 0`,
            fontSize: typography.body.md.fontSize,
            color: colors.text.lowEmphasis.onLight,
            lineHeight: 1.5,
          }}
        >
          Search, filter, and reconcile every dollar that moves through Vault.
        </p>
      </header>

      {/* Summary strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
          gap: spacing.md,
          marginBottom: spacing.lg,
        }}
      >
        <SummaryStat label="Showing" value={`${filtered.length} of ${TRANSACTIONS.length}`} isCount />
        <SummaryStat label="Total in" amount={totalIn} variant="credit" />
        <SummaryStat label="Total out" amount={totalOut} variant="debit" />
      </div>

      {/* Data table */}
      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        caption="Transaction history"
      >
        <DataTable.Toolbar>
          <DataTable.Toolbar.Left>
            <Input
              placeholder="Search description, counterparty, account…"
              size="sm"
              fullWidth
              value={query}
              onChange={(v) => setQuery(v)}
              startAdornment={<IconSearch size="sm" />}
              style={{ marginBottom: 0, maxWidth: '320px' }}
            />
            <Select
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={(v) => setCategory(v)}
              size="sm"
              style={{ minWidth: '160px' }}
            />
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={(v) => setStatus(v)}
              size="sm"
              style={{ minWidth: '140px' }}
            />
          </DataTable.Toolbar.Left>
          <DataTable.Toolbar.Right>
            <Button emphasis="low">Export CSV</Button>
          </DataTable.Toolbar.Right>
        </DataTable.Toolbar>
      </DataTable>
    </div>
  )
}

function SummaryStat({
  label,
  amount,
  value,
  variant,
  isCount,
}: {
  label: string
  amount?: number
  value?: string
  variant?: 'credit' | 'debit'
  isCount?: boolean
}) {
  return (
    <div
      style={{
        padding: spacing.lg,
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          fontSize: typography.label.sm.fontSize,
          fontWeight: fontWeights.semibold,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: colors.text.lowEmphasis.onLight,
          marginBottom: spacing['2xs'],
        }}
      >
        {label}
      </div>
      {isCount && value ? (
        <div
          style={{
            fontSize: typography.heading.h4.fontSize,
            fontWeight: fontWeights.bold,
            fontFamily: fontFamilies.display,
            color: colors.text.highEmphasis.onLight,
            ...numericStyles.tabular,
          }}
        >
          {value}
        </div>
      ) : amount !== undefined ? (
        <Amount value={amount} size="lg" variant={variant} weight="bold" />
      ) : null}
    </div>
  )
}
