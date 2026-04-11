'use client'

/**
 * SparkLine — Tiny inline trend chart for stat cards, row-level indicators,
 * and inline KPIs. A LUMEN-themed wrapper around Recharts' LineChart.
 *
 * Accessibility:
 * - `aria-label` is required.
 * - An optional `summary` prop (auto-generated from data if omitted) provides
 *   a textual alternative for screen readers describing trend direction,
 *   percentage change, and range.
 * - `prefers-reduced-motion` disables animation.
 *
 * @example
 * <SparkLine
 *   data={[10, 12, 8, 15, 18, 22]}
 *   direction="up"
 *   aria-label="Monthly revenue trend"
 * />
 */

import React from 'react'
import { LineChart as RechartsLineChart, Line, ResponsiveContainer } from 'recharts'
import { colors } from '@/styles/design-tokens'

// ---------------------------------------------------------------------------
// Shared utilities (duplicated from LineChart to keep components independent)
// ---------------------------------------------------------------------------

const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])
  return reduced
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SparkLineProps {
  /** Series of values. Labels are not shown visually. */
  data: number[]
  /** Width in pixels. Defaults to 120. */
  width?: number
  /** Height in pixels. Defaults to 32. */
  height?: number
  /** Trend direction — controls stroke color. Defaults to "up". */
  direction?: 'up' | 'down' | 'neutral'
  /** Accessible title (required). */
  'aria-label': string
  /**
   * Narrative summary announced to AT users, e.g.
   * "Trend over 15 periods, from $24k to $125k, up 420%".
   * If omitted, a basic summary is auto-generated from the data (first/last/range).
   */
  summary?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SparkLine({
  data,
  width = 120,
  height = 32,
  direction = 'up',
  'aria-label': ariaLabel,
  summary,
}: SparkLineProps) {
  const descId = React.useId()
  const reducedMotion = usePrefersReducedMotion()

  const stroke =
    direction === 'up'
      ? colors.status.success
      : direction === 'down'
        ? colors.status.important
        : colors.text.lowEmphasis.onLight

  const series = data.map((v, i) => ({ i, value: v }))

  // Auto-generate a basic summary from first/last/min/max if none provided.
  const autoSummary = React.useMemo(() => {
    if (summary || data.length === 0) return summary
    const first = data[0]
    const last = data[data.length - 1]
    const min = Math.min(...data)
    const max = Math.max(...data)
    const delta = last - first
    const pctChange = first !== 0 ? Math.round((delta / first) * 100) : 0
    const dir = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'
    return `Trend over ${data.length} periods, ${dir} ${Math.abs(pctChange)}%, from ${first} to ${last}, range ${min}–${max}.`
  }, [data, summary])

  return (
    <figure
      role="group"
      aria-label={ariaLabel}
      aria-describedby={autoSummary ? descId : undefined}
      style={{ margin: 0, width, height }}
    >
      {autoSummary && (
        <p id={descId} style={srOnlyStyle}>
          {autoSummary}
        </p>
      )}
      <div aria-hidden="true" style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={series}
            margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
          >
            <Line
              type="monotone"
              dataKey="value"
              stroke={stroke}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={!reducedMotion}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}
