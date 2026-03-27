'use client'

import React from 'react'
import { colors, typography, spacing, borderRadiusSemantics } from '../../styles/design-tokens'
import type { EntityCardProps } from './types'

export function EntityCardRenderer({ props }: { props: EntityCardProps }) {
  return (
    <div
      style={{
        borderRadius: borderRadiusSemantics.card,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        backgroundColor: colors.surface.lightDarker,
        padding: spacing.md,
      }}
    >
      <div style={{ ...typography.label.md, fontWeight: 600, color: colors.text.highEmphasis.onLight }}>
        {props.title}
      </div>
      {props.subtitle && (
        <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight, marginTop: 2, marginBottom: spacing.sm }}>
          {props.subtitle}
        </div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: spacing.xs,
          marginTop: spacing.xs,
        }}
      >
        {props.fields.map((f) => (
          <div key={f.label}>
            <div style={{ ...typography.body.xs, fontWeight: 500, color: colors.text.lowEmphasis.onLight, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {f.label}
            </div>
            <div style={{ ...typography.label.sm, color: colors.text.highEmphasis.onLight, marginTop: 2 }}>
              {f.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

EntityCardRenderer.displayName = 'EntityCardRenderer'
