'use client'

import React from 'react'
import Link from 'next/link'
import { Amount, Button, Badge } from '@/components'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadius,
  borderRadiusSemantics,
  breakpoints,
  numericStyles,
} from '@/styles/design-tokens'
import { ACCOUNTS, TOTAL_BALANCE } from '../data'

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

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  operating: 'Operating',
  savings: 'High-yield savings',
  payroll: 'Payroll',
  expense: 'Expense cards',
}

export default function AccountsPage() {
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  return (
    <div style={{ padding: isMobile ? spacing.lg : `${spacing['2xl']} ${spacing['3xl']}` }}>
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
          Accounts
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
          All accounts
        </h1>
        <p
          style={{
            margin: `${spacing.xs} 0 0 0`,
            fontSize: typography.body.md.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          Total balance across all accounts: <Amount value={TOTAL_BALANCE} size="md" weight="semibold" />
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: spacing.lg,
        }}
      >
        {ACCOUNTS.map((account) => (
          <article
            key={account.id}
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
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: spacing.lg,
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: fontFamilies.display,
                    fontSize: typography.heading.h4.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: colors.text.highEmphasis.onLight,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {account.name}
                </h3>
                <div
                  style={{
                    fontSize: typography.body.sm.fontSize,
                    color: colors.text.lowEmphasis.onLight,
                    marginTop: 2,
                    ...numericStyles.tabular,
                  }}
                >
                  {ACCOUNT_TYPE_LABELS[account.type]} · •{account.number}
                </div>
              </div>
              <Badge color="success" variant="outlined" size="sm">
                Active
              </Badge>
            </div>

            <div
              style={{
                padding: `${spacing.md} 0`,
                borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
                borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
                marginBottom: spacing.lg,
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
                Available balance
              </div>
              <Amount value={account.balance} size="xl" weight="bold" />
              {account.interestRate && (
                <div
                  style={{
                    fontSize: typography.body.sm.fontSize,
                    color: colors.status.success,
                    marginTop: spacing['2xs'],
                    fontWeight: fontWeights.medium,
                    ...numericStyles.tabular,
                  }}
                >
                  Earning {account.interestRate}% APY
                </div>
              )}
              <div
                style={{
                  fontSize: typography.body.xs.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                  marginTop: spacing.xs,
                }}
              >
                Updated {account.lastUpdated}
              </div>
            </div>

            <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
              <Link href="/prototypes/vault/send" style={{ textDecoration: 'none' }}>
                <Button emphasis="mid">Transfer</Button>
              </Link>
              <Button emphasis="low">View statements</Button>
              <Button emphasis="low">Account details</Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
