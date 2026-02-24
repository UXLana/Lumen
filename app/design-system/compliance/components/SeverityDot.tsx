'use client'

import { colors, typography, spacing } from '@/styles/design-tokens'
import type { Severity } from '../lib/types'

interface SeverityDotProps {
  severity: Severity
  showLabel?: boolean
  size?: 'sm' | 'md'
}

const severityColors: Record<Severity, string> = {
  critical: colors.status.important,
  serious: colors.status.warning,
  moderate: colors.status.info,
  minor: colors.text.disabled.onLight,
}

export default function SeverityDot({ severity, showLabel = true, size = 'sm' }: SeverityDotProps) {
  const dotSize = size === 'sm' ? 6 : 8

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing['2xs'] }}>
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: severityColors[severity],
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
      {showLabel && (
        <span
          style={{
            ...typography.label.sm,
            color: colors.text.lowEmphasis.onLight,
            textTransform: 'capitalize' as const,
          }}
        >
          {severity}
        </span>
      )}
    </span>
  )
}
