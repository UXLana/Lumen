'use client'

import React from 'react'
import { colors, typography, spacing, borderRadiusSemantics } from '@/styles/design-tokens'
import type { StatCardsProps } from './types'

export function StatCardsRenderer({ props }: { props: StatCardsProps }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.xs }}>
      {props.items.map((item) => (
        <div
          key={item.label}
          style={{
            borderRadius: borderRadiusSemantics.card,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            backgroundColor: colors.surface.lightDarker,
            padding: spacing.sm,
          }}
        >
          <div style={{ ...typography.body.xs, fontWeight: 500, color: colors.text.lowEmphasis.onLight, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {item.label}
          </div>
          <div style={{ ...typography.heading.h5, fontWeight: 700, color: colors.text.highEmphasis.onLight, marginTop: spacing['2xs'] }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}

StatCardsRenderer.displayName = 'StatCardsRenderer'
