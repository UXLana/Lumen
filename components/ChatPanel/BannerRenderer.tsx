'use client'

import React from 'react'
import { colors, typography, spacing, borderRadiusSemantics } from '../../styles/design-tokens'
import type { BannerProps } from './types'

const VARIANT_CONFIG: Record<string, { accent: string; bg: string; icon: string }> = {
  warning: { accent: colors.text.warning, bg: colors.surface.warning, icon: '\u26A0' },
  error: { accent: colors.text.important, bg: colors.surface.important, icon: '\u2716' },
  success: { accent: colors.text.success, bg: colors.surface.success, icon: '\u2714' },
  info: { accent: colors.brand.default, bg: colors.surface.info, icon: '\u2139' },
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
