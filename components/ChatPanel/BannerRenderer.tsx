'use client'

import React from 'react'
import { colors, typography, spacing, borderRadiusSemantics } from '@/styles/design-tokens'
import type { BannerProps } from './types'

// TODO: map to design token — banner variant backgrounds are 8% opacity tints of accent colors
const VARIANT_CONFIG: Record<string, { accent: string; bg: string; icon: string }> = {
  warning: { accent: colors.text.warning, bg: 'rgba(245, 158, 11, 0.08)', icon: '\u26A0' },
  error: { accent: colors.text.important, bg: 'rgba(239, 68, 68, 0.08)', icon: '\u2716' },
  success: { accent: colors.text.success, bg: 'rgba(16, 185, 129, 0.08)', icon: '\u2714' },
  info: { accent: colors.brand.default, bg: 'rgba(59, 130, 246, 0.08)', icon: '\u2139' },
}

export function BannerRenderer({ props }: { props: BannerProps }) {
  const v = VARIANT_CONFIG[props.variant] ?? VARIANT_CONFIG.info

  return (
    <div
      role="status"
      style={{
        borderRadius: borderRadiusSemantics.card,
        padding: spacing.sm,
        backgroundColor: v.bg,
        display: 'flex',
        gap: spacing.xs,
      }}
    >
      <div style={{ color: v.accent, flexShrink: 0, marginTop: 2, fontSize: 14 }}>{v.icon}</div>
      <div>
        <div style={{ ...typography.label.sm, fontWeight: 600, color: v.accent }}>
          {props.title}
        </div>
        {props.description && (
          <div style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight, marginTop: 2 }}>
            {props.description}
          </div>
        )}
      </div>
    </div>
  )
}

BannerRenderer.displayName = 'BannerRenderer'
