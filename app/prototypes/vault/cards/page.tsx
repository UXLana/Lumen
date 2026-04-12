// @ts-nocheck
'use client'

import React from 'react'
import { Amount, Button, Badge, Avatar, ProgressBar } from '@/components'
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
import { CARDS, type VaultCard } from '../data'

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

export default function CardsPage() {
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  return (
    <div style={{ padding: isMobile ? spacing.lg : `${spacing['2xl']} ${spacing['3xl']}` }}>
      <header
        style={{
          marginBottom: spacing['2xl'],
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: spacing.lg,
          flexWrap: 'wrap',
        }}
      >
        <div>
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
            Cards
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
            Team cards
          </h1>
          <p
            style={{
              margin: `${spacing.xs} 0 0 0`,
              fontSize: typography.body.md.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            {CARDS.filter((c) => c.status === 'active').length} active ·{' '}
            {CARDS.filter((c) => c.type === 'virtual').length} virtual ·{' '}
            {CARDS.filter((c) => c.type === 'physical').length} physical
          </p>
        </div>
        <div style={{ display: 'flex', gap: spacing.xs }}>
          <Button emphasis="low">Freeze all</Button>
          <Button emphasis="high">Issue new card</Button>
        </div>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: spacing.lg,
        }}
      >
        {CARDS.map((card) => (
          <CardTile key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}

function CardTile({ card }: { card: VaultCard }) {
  const percentUsed = (card.spentThisPeriod / card.spendLimit) * 100
  const isFrozen = card.status === 'frozen'

  return (
    <article
      style={{
        padding: spacing['2xl'],
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadiusSemantics.card,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
        opacity: isFrozen ? 0.7 : 1,
      }}
    >
      {/* Card visual */}
      <div
        style={{
          position: 'relative',
          padding: spacing.lg,
          borderRadius: borderRadius.lg,
          background: isFrozen
            ? `linear-gradient(135deg, ${colors.surface.lightDarker}, ${colors.border.lowEmphasis.onLight})`
            : `linear-gradient(135deg, ${colors.brand.default}, ${colors.brand.darker ?? colors.brand.default})`,
          color: '#fff',
          minHeight: '160px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: typography.label.sm.fontSize,
              fontWeight: fontWeights.bold,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              opacity: 0.9,
            }}
          >
            Vault · {card.type}
          </div>
          {isFrozen && (
            <span
              style={{
                fontSize: typography.body.xs.fontSize,
                fontWeight: fontWeights.semibold,
                padding: `${spacing['2xs']} ${spacing.xs}`,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: borderRadius.sm,
              }}
            >
              FROZEN
            </span>
          )}
        </div>
        <div>
          <div
            style={{
              fontSize: typography.heading.h5.fontSize,
              fontWeight: fontWeights.semibold,
              fontFamily: fontFamilies.mono,
              letterSpacing: '0.12em',
              marginBottom: spacing.xs,
              ...numericStyles.tabular,
            }}
          >
            •••• •••• •••• {card.last4}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              fontSize: typography.body.sm.fontSize,
              opacity: 0.9,
            }}
          >
            <span>{card.cardholder}</span>
            <span style={numericStyles.tabular}>12/28</span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing['2xs'],
          }}
        >
          <div
            style={{
              fontSize: typography.body.md.fontSize,
              fontWeight: fontWeights.semibold,
              color: colors.text.highEmphasis.onLight,
            }}
          >
            {card.nickname}
          </div>
          <Badge
            color={card.status === 'active' ? 'success' : 'neutral'}
            variant="outlined"
            size="sm"
          >
            {card.status}
          </Badge>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            fontSize: typography.body.xs.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          <Avatar initials={card.cardholderInitials} size="sm" color="brand" />
          {card.cardholder}
          {card.merchantCategory && (
            <>
              {' · '}
              <span>{card.merchantCategory}</span>
            </>
          )}
        </div>
      </div>

      {/* Spend progress */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: spacing['2xs'],
          }}
        >
          <span
            style={{
              fontSize: typography.label.sm.fontSize,
              fontWeight: fontWeights.medium,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            {card.spendPeriod} limit
          </span>
          <span
            style={{
              fontSize: typography.body.sm.fontSize,
              color: colors.text.highEmphasis.onLight,
              ...numericStyles.tabular,
            }}
          >
            <Amount value={card.spentThisPeriod} size="sm" weight="medium" /> /{' '}
            <Amount value={card.spendLimit} size="sm" variant="muted" />
          </span>
        </div>
        <ProgressBar value={percentUsed} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: spacing.xs, paddingTop: spacing.xs }}>
        <Button emphasis="low">{card.status === 'frozen' ? 'Unfreeze' : 'Freeze'}</Button>
        <Button emphasis="low">Edit limit</Button>
      </div>
    </article>
  )
}
