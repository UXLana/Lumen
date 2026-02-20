'use client'

import { colors, typography, fontFamilies, spacing } from '@/styles/design-tokens'

interface StatCardProps {
  value: number | string
  label: string
  variant?: 'default' | 'danger' | 'success'
}

const variantColors: Record<string, string> = {
  default: colors.text.highEmphasis.onLight,
  danger: colors.status.important,
  success: colors.status.success,
}

export default function StatCard({ value, label, variant = 'default' }: StatCardProps) {
  return (
    <div style={{ padding: `${spacing[4]} 0`, textAlign: 'center' }}>
      <div
        style={{
          fontSize: '28px',
          fontWeight: 700,
          lineHeight: 1.1,
          fontFamily: fontFamilies.body,
          color: variantColors[variant],
        }}
      >
        {value}
      </div>
      <div
        style={{
          ...typography.label.sm,
          color: colors.text.lowEmphasis.onLight,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
          marginTop: spacing[1],
        }}
      >
        {label}
      </div>
    </div>
  )
}
