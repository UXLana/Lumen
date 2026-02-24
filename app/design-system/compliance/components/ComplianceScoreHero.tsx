'use client'

import { colors, typography, spacing, fontFamilies } from '@/styles/design-tokens'
import StatCard from './StatCard'

interface ComplianceScoreHeroProps {
  score: number
  totalIssues: number
  criticalCount: number
  resolvedCount: number
}

export default function ComplianceScoreHero({
  score,
  totalIssues,
  criticalCount,
  resolvedCount,
}: ComplianceScoreHeroProps) {
  const size = 160
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, score))
  const offset = circumference - (clamped / 100) * circumference

  const ringColor =
    clamped <= 50
      ? colors.status.important
      : clamped <= 75
        ? colors.status.warning
        : colors.status.success

  return (
    <div style={{ textAlign: 'center', padding: `${spacing['3xl']} 0 ${spacing.xl}` }}>
      {/* Score Ring */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Compliance score: ${clamped} percent`}
        style={{ display: 'block', margin: '0 auto' }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0, 0, 0, 0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 0.6s ease-out',
          }}
        />
        {/* Score Number */}
        <text
          x="50%"
          y="44%"
          dominantBaseline="central"
          textAnchor="middle"
          style={{
            fontSize: '36px',
            fontWeight: 700,
            fontFamily: fontFamilies.body,
            fill: colors.text.highEmphasis.onLight,
          }}
        >
          {clamped}
        </text>
        {/* Percent Label */}
        <text
          x="50%"
          y="62%"
          dominantBaseline="central"
          textAnchor="middle"
          style={{
            ...typography.label.sm,
            fill: colors.text.lowEmphasis.onLight,
          }}
        >
          % compliant
        </text>
      </svg>

      {/* Stat Cards Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: spacing['3xl'],
          marginTop: spacing.xl,
        }}
      >
        <StatCard value={totalIssues} label="Open Issues" />
        <StatCard value={criticalCount} label="Critical / Serious" variant="danger" />
        <StatCard value={resolvedCount} label="Resolved" variant="success" />
      </div>
    </div>
  )
}
