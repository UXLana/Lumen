'use client'

import React from 'react'
import Link from 'next/link'
import {
  Amount,
  Button,
  Badge,
  Avatar,
} from '@/components'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadius,
  borderRadiusSemantics,
  transitionPresets,
  numericStyles,
  breakpoints,
} from '@/styles/design-tokens'
import { LineChart, SparkLine } from '@/components'
import {
  ACCOUNTS,
  TOTAL_BALANCE,
  TRANSACTIONS,
  PENDING_APPROVALS,
  CASHFLOW_30D,
  SPARK_INFLOWS,
  SPARK_OUTFLOWS,
} from './data'

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

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export default function VaultDashboard() {
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)
  const recentTransactions = TRANSACTIONS.slice(0, 6)

  // Delta vs 7 days ago
  const delta = CASHFLOW_30D[CASHFLOW_30D.length - 1].value - CASHFLOW_30D[CASHFLOW_30D.length - 8].value

  // Totals for stats
  const inflows30d = TRANSACTIONS.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const outflows30d = Math.abs(TRANSACTIONS.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0))

  return (
    <div style={{ padding: isMobile ? spacing.lg : `${spacing['2xl']} ${spacing['3xl']}` }}>
      {/* Header */}
      <PageHeader
        eyebrow="Dashboard"
        title="Good afternoon, Maya"
        subtitle="Here's what's happening across Acme Co.'s accounts today."
      />

      {/* Balance hero */}
      <section
        aria-labelledby="balance-label"
        style={{
          padding: spacing['2xl'],
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadiusSemantics.card,
          marginBottom: spacing.lg,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: spacing.lg,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              id="balance-label"
              style={{
                fontSize: typography.label.sm.fontSize,
                fontWeight: fontWeights.semibold,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colors.text.lowEmphasis.onLight,
                marginBottom: spacing.xs,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              Total balance
              <LiveDot />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing.md, flexWrap: 'wrap' }}>
              <Amount value={TOTAL_BALANCE} size="2xl" weight="bold" />
              <Badge
                color="success"
                variant="outlined"
                aria-label={`Increased by ${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(Math.abs(delta))} over 7 days`}
              >
                <span aria-hidden="true">↑ </span>
                <DeltaInline value={delta} /> · 7 days
              </Badge>
            </div>
            <div
              style={{
                fontSize: typography.body.sm.fontSize,
                color: colors.text.lowEmphasis.onLight,
                marginTop: spacing.xs,
              }}
            >
              Updated 8 seconds ago · Across 4 accounts
            </div>
          </div>

          <div style={{ display: 'flex', gap: spacing.xs, flexShrink: 0 }}>
            <Link href="/prototypes/vault/send" style={{ textDecoration: 'none' }}>
              <Button emphasis="high">Send money</Button>
            </Link>
            <Link href="/prototypes/vault/transactions" style={{ textDecoration: 'none' }}>
              <Button emphasis="low">View transactions</Button>
            </Link>
          </div>
        </div>

        {/* Account chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: spacing.md,
            marginTop: spacing.xl,
            paddingTop: spacing.xl,
            borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }}
        >
          {ACCOUNTS.map((account) => (
            <div key={account.id}>
              <div
                style={{
                  fontSize: typography.label.sm.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                  fontWeight: fontWeights.medium,
                  marginBottom: 2,
                }}
              >
                {account.name}
                <span
                  style={{
                    marginLeft: spacing['2xs'],
                    color: colors.text.disabled.onLight,
                    fontFamily: fontFamilies.mono,
                    ...numericStyles.tabular,
                  }}
                >
                  •{account.number}
                </span>
              </div>
              <Amount value={account.balance} size="md" weight="semibold" />
              {account.interestRate && (
                <div
                  style={{
                    fontSize: typography.body.xs.fontSize,
                    color: colors.status.success,
                    fontWeight: fontWeights.medium,
                    ...numericStyles.tabular,
                  }}
                >
                  {account.interestRate}% APY
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Two-column: chart + stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
          gap: spacing.lg,
          marginBottom: spacing.lg,
        }}
      >
        {/* Cashflow chart */}
        <section
          aria-labelledby="cashflow-heading"
          style={{
            padding: spacing['2xl'],
            backgroundColor: colors.surface.light,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadiusSemantics.card,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: spacing.lg,
              flexWrap: 'wrap',
              gap: spacing.sm,
            }}
          >
            <div>
              <h3
                id="cashflow-heading"
                style={{
                  margin: 0,
                  fontFamily: fontFamilies.display,
                  fontSize: typography.heading.h5.fontSize,
                  fontWeight: fontWeights.semibold,
                  color: colors.text.highEmphasis.onLight,
                  letterSpacing: '-0.01em',
                }}
              >
                Cashflow
              </h3>
              <div
                style={{
                  fontSize: typography.body.sm.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                  marginTop: 2,
                }}
              >
                Last 30 days · All accounts
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                padding: `${spacing['2xs']} ${spacing.xs}`,
                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                borderRadius: borderRadius.sm,
                fontSize: typography.label.sm.fontSize,
                color: colors.text.lowEmphasis.onLight,
                fontWeight: fontWeights.medium,
              }}
            >
              30 days
            </div>
          </div>
          <LineChart
            data={CASHFLOW_30D}
            height={260}
            aria-label="30-day cashflow chart"
            summary={`Balance rose from ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
              maximumFractionDigits: 2,
            }).format(CASHFLOW_30D[0].value)} on ${CASHFLOW_30D[0].label} to ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
              maximumFractionDigits: 2,
            }).format(CASHFLOW_30D[CASHFLOW_30D.length - 1].value)} on ${CASHFLOW_30D[CASHFLOW_30D.length - 1].label}, up ${Math.round(((CASHFLOW_30D[CASHFLOW_30D.length - 1].value - CASHFLOW_30D[0].value) / CASHFLOW_30D[0].value) * 100)}% over 30 days.`}
          />
        </section>

        {/* Stats stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          <StatBlock
            label="Inflows · 30d"
            value={inflows30d}
            variant="credit"
            sparkData={SPARK_INFLOWS}
            sparkDirection="up"
          />
          <StatBlock
            label="Outflows · 30d"
            value={outflows30d}
            variant="debit"
            sparkData={SPARK_OUTFLOWS}
            sparkDirection="down"
          />
        </div>
      </div>

      {/* Two-column: pending approvals + recent activity */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr',
          gap: spacing.lg,
        }}
      >
        <PendingApprovalsCard />
        <RecentActivityCard transactions={recentTransactions} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page header
// ---------------------------------------------------------------------------

function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
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
        {eyebrow}
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
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            margin: `${spacing.xs} 0 0 0`,
            fontSize: typography.body.md.fontSize,
            color: colors.text.lowEmphasis.onLight,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  )
}

// ---------------------------------------------------------------------------
// Live indicator dot
// ---------------------------------------------------------------------------

function LiveDot() {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: '8px',
        height: '8px',
      }}
    >
      <span
        data-vault-livedot-pulse
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundColor: colors.status.success,
          opacity: 0.35,
          animation: 'vaultPulse 2s ease-out infinite',
        }}
      />
      <span
        style={{
          position: 'relative',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: colors.status.success,
        }}
      />
      <style>{`
        @keyframes vaultPulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        /* Disable the pulse animation entirely when the user prefers reduced motion.
           Re-declaring @keyframes inside a media query is unreliable — toggling the
           animation property itself is the supported pattern. */
        @media (prefers-reduced-motion: reduce) {
          [data-vault-livedot-pulse] {
            animation: none !important;
          }
        }
      `}</style>
    </span>
  )
}

// ---------------------------------------------------------------------------
// Delta inline (no sign prefix since badge shows arrow)
// ---------------------------------------------------------------------------

function DeltaInline({ value }: { value: number }) {
  return (
    <span style={{ ...numericStyles.tabular }}>
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.abs(value))}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Stat block with sparkline
// ---------------------------------------------------------------------------

function StatBlock({
  label,
  value,
  variant,
  sparkData,
  sparkDirection,
}: {
  label: string
  value: number
  variant: 'credit' | 'debit'
  sparkData: number[]
  sparkDirection: 'up' | 'down'
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: spacing.lg,
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadiusSemantics.card,
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
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: spacing.sm,
        }}
      >
        <Amount value={value} size="lg" variant={variant} />
        <SparkLine
          data={sparkData}
          direction={sparkDirection}
          aria-label={`${label} trend sparkline`}
          width={100}
          height={32}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pending approvals card
// ---------------------------------------------------------------------------

function PendingApprovalsCard() {
  return (
    <section
      aria-labelledby="approvals-heading"
      style={{
        padding: spacing['2xl'],
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadiusSemantics.card,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.lg,
        }}
      >
        <h3
          id="approvals-heading"
          style={{
            margin: 0,
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h5.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            letterSpacing: '-0.01em',
          }}
        >
          Pending approvals
        </h3>
        <Badge color="warning" variant="filled">
          {PENDING_APPROVALS.length}
        </Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {PENDING_APPROVALS.map((a) => (
          <div
            key={a.id}
            style={{
              padding: spacing.md,
              backgroundColor: colors.surface.lightDarker,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadius.md,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: spacing.xs,
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: typography.body.sm.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: colors.text.highEmphasis.onLight,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {a.recipient}
                </div>
                <div
                  style={{
                    fontSize: typography.body.xs.fontSize,
                    color: colors.text.lowEmphasis.onLight,
                    marginTop: 2,
                  }}
                >
                  {a.type.toUpperCase()} · requested by {a.requestedBy} · {a.requestedAt}
                </div>
              </div>
              <Amount value={a.amount} size="sm" weight="semibold" />
            </div>
            <div style={{ display: 'flex', gap: spacing.xs }}>
              <Button emphasis="high">Approve</Button>
              <Button emphasis="low">Decline</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Recent activity card
// ---------------------------------------------------------------------------

function RecentActivityCard({
  transactions,
}: {
  transactions: typeof TRANSACTIONS
}) {
  return (
    <section
      aria-labelledby="activity-heading"
      style={{
        padding: spacing['2xl'],
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadiusSemantics.card,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.lg,
        }}
      >
        <h3
          id="activity-heading"
          style={{
            margin: 0,
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h5.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            letterSpacing: '-0.01em',
          }}
        >
          Recent activity
        </h3>
        <Link
          href="/prototypes/vault/transactions"
          style={{
            fontSize: typography.label.sm.fontSize,
            color: colors.brand.default,
            fontWeight: fontWeights.semibold,
            textDecoration: 'none',
          }}
        >
          View all →
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {transactions.map((tx, i) => (
          <div
            key={tx.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              padding: `${spacing.sm} 0`,
              borderTop: i === 0 ? undefined : `1px solid ${colors.border.lowEmphasis.onLight}`,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: colors.surface.lightDarker,
                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: tx.amount > 0 ? colors.status.success : colors.text.lowEmphasis.onLight,
                fontFamily: fontFamilies.body,
                fontSize: '14px',
                fontWeight: fontWeights.bold,
              }}
            >
              <span aria-hidden="true">{tx.amount > 0 ? '↓' : '↑'}</span>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
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
                }}
              >
                {tx.date} · {tx.account}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Amount
                value={tx.amount}
                size="sm"
                variant={tx.amount > 0 ? 'credit' : 'debit'}
                sign="auto"
                weight="semibold"
              />
              {tx.status !== 'posted' && (
                <Badge
                  color={tx.status === 'pending' ? 'warning' : 'error'}
                  variant="outlined"
                  size="sm"
                  style={{ marginTop: 2 }}
                >
                  {tx.status}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
