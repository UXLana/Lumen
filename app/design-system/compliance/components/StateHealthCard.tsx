'use client'

import { useState } from 'react'
import { colors, typography, fontFamilies, spacing, borderRadius, shadows, transitionPresets } from '@/styles/design-tokens'
import type { StateCompliance } from '../lib/types'
import SeverityDot from './SeverityDot'

interface StateHealthCardProps {
  state: StateCompliance
  selected?: boolean
  onClick: () => void
}

function getScoreColor(score: number) {
  if (score <= 50) return colors.status.important
  if (score <= 75) return colors.status.warning
  return colors.status.success
}

function getStatusLabel(score: number) {
  if (score <= 50) return 'Critical'
  if (score <= 75) return 'Needs Work'
  if (score < 100) return 'Good'
  return 'Compliant'
}

export default function StateHealthCard({ state, selected, onClick }: StateHealthCardProps) {
  const [hovered, setHovered] = useState(false)
  const score = state.latestScore
  const scoreColor = getScoreColor(score)

  // Mini ring dimensions
  const ringSize = 48
  const strokeW = 4
  const r = (ringSize - strokeW) / 2
  const circ = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(100, score))
  const offset = circ - (clamped / 100) * circ

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${state.stateName}: ${score}% compliant, ${state.openIssues} open issues`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.lg,
        backgroundColor: colors.surface.light,
        border: `1px solid ${selected ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadius.lg,
        cursor: 'pointer',
        boxShadow: selected ? `0 0 0 1px ${colors.brand.default}` : hovered ? shadows.sm : 'none',
        transition: `all ${transitionPresets.default}`,
      }}
    >
      {/* Mini Score Ring */}
      <svg
        width={ringSize}
        height={ringSize}
        viewBox={`0 0 ${ringSize} ${ringSize}`}
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={r}
          fill="none"
          stroke="rgba(0, 0, 0, 0.06)"
          strokeWidth={strokeW}
        />
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={r}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeW}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          style={{
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: fontFamilies.body,
            fill: colors.text.highEmphasis.onLight,
          }}
        >
          {clamped}
        </text>
      </svg>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginBottom: spacing['2xs'] }}>
          <span
            style={{
              ...typography.label.md,
              fontWeight: 600,
              color: colors.text.highEmphasis.onLight,
            }}
          >
            {state.stateName}
          </span>
          <span
            style={{
              ...typography.label.sm,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            {state.stateCode}
          </span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <span style={{ ...typography.body.xs, color: scoreColor, fontWeight: 600 }}>
            {getStatusLabel(score)}
          </span>
          <span style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>
            {state.openIssues} open
          </span>
          {state.criticalCount > 0 && (
            <span style={{ ...typography.body.xs, color: colors.status.important }}>
              {state.criticalCount} critical
            </span>
          )}
          <span style={{ ...typography.body.xs, color: colors.text.disabled.onLight }}>
            {state.reports.length} {state.reports.length === 1 ? 'report' : 'reports'}
          </span>
        </div>
      </div>

      {/* Chevron */}
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke={colors.text.disabled.onLight}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          flexShrink: 0,
          transform: selected ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: `transform ${transitionPresets.default}`,
        }}
        aria-hidden="true"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  )
}
