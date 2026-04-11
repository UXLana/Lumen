'use client'

/**
 * LineChart — A LUMEN-themed wrapper around Recharts' AreaChart/LineChart.
 *
 * Pins stroke, fill, tooltip, and axis styling to LUMEN design tokens so the
 * chart responds to theme changes automatically. Also provides a visually-
 * hidden data table alternative for WCAG 1.1.1 compliance, Recharts'
 * `accessibilityLayer` for keyboard arrow-key navigation between data points,
 * and `prefers-reduced-motion` support.
 *
 * @example
 * <LineChart
 *   data={[{ label: 'Jan', value: 100 }, { label: 'Feb', value: 120 }]}
 *   aria-label="Monthly revenue"
 *   summary="Revenue rose from $100 to $120 over 2 months, up 20%."
 * />
 */

import React from 'react'
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import {
  colors,
  typography,
  fontFamilies,
  spacing,
  borderRadius,
} from '@/styles/design-tokens'

// ---------------------------------------------------------------------------
// Shared utilities (duplicated in SparkLine to keep components independent)
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

/**
 * Tracks the user's `prefers-reduced-motion` setting. Used to disable
 * Recharts animations when the user has requested reduced motion.
 */
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

export interface LineChartDatum {
  /** X-axis label (e.g. date string) */
  label: string
  /** Y-axis value */
  value: number
}

export interface LineChartProps {
  /** Data series */
  data: LineChartDatum[]
  /** Chart height in pixels. Defaults to 280. */
  height?: number
  /** Show the cartesian grid. Defaults to true. */
  showGrid?: boolean
  /** Show the x-axis labels. Defaults to true. */
  showXAxis?: boolean
  /** Show the y-axis labels. Defaults to true. */
  showYAxis?: boolean
  /** Show interactive tooltip on hover. Defaults to true. */
  showTooltip?: boolean
  /** Render as an area chart (filled) instead of a pure line. Defaults to true. */
  area?: boolean
  /** Currency code for tooltip + accessible table formatting. Defaults to USD. */
  currency?: string
  /** Accessible title (required). */
  'aria-label': string
  /**
   * Short narrative summary announced before the data table, e.g.
   * "Balance rose from $1.92M to $2.48M over 30 days, up 29%".
   * Recommended for all charts — gives SR users the high-level story.
   */
  summary?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LineChart({
  data,
  height = 280,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showTooltip = true,
  area = true,
  currency = 'USD',
  'aria-label': ariaLabel,
  summary,
}: LineChartProps) {
  const descId = React.useId()
  const tableId = React.useId()
  const reducedMotion = usePrefersReducedMotion()

  const formatCurrency = React.useCallback(
    (value: number) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value),
    [currency],
  )

  const formatCurrencyFull = React.useCallback(
    (value: number) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value),
    [currency],
  )

  const axisTickStyle = {
    fill: colors.text.lowEmphasis.onLight,
    fontSize: 11,
    fontFamily: fontFamilies.body,
    fontVariantNumeric: 'tabular-nums' as const,
  }

  return (
    <figure
      role="group"
      aria-label={ariaLabel}
      aria-describedby={summary ? `${descId} ${tableId}` : tableId}
      style={{ margin: 0, width: '100%', height }}
    >
      {/* Visually hidden narrative summary */}
      {summary && (
        <p id={descId} style={srOnlyStyle}>
          {summary}
        </p>
      )}

      {/* Visually hidden data table — the canonical source of truth for assistive tech.
          Sighted users see the chart; SR users read the table. Both are kept in sync. */}
      <table id={tableId} style={srOnlyStyle}>
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th scope="row">{d.label}</th>
              <td>{formatCurrencyFull(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Visual chart — aria-hidden so SR users get the table above, not duplicate data */}
      <div aria-hidden="true" style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {area ? (
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
              accessibilityLayer
            >
              <defs>
                <linearGradient id="lumen-linechart-area-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.brand.default} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={colors.brand.default} stopOpacity={0} />
                </linearGradient>
              </defs>
              {showGrid && (
                <CartesianGrid
                  stroke={colors.border.lowEmphasis.onLight}
                  strokeDasharray="3 3"
                  vertical={false}
                />
              )}
              {showXAxis && (
                <XAxis
                  dataKey="label"
                  tick={axisTickStyle}
                  axisLine={{ stroke: colors.border.lowEmphasis.onLight }}
                  tickLine={false}
                  tickMargin={8}
                />
              )}
              {showYAxis && (
                <YAxis
                  tick={axisTickStyle}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      maximumFractionDigits: 1,
                    }).format(Number(v))
                  }
                  width={48}
                />
              )}
              {showTooltip && (
                <Tooltip content={<LumenChartTooltip currency={currency} format={formatCurrency} />} />
              )}
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors.brand.default}
                strokeWidth={2}
                fill="url(#lumen-linechart-area-gradient)"
                activeDot={{
                  r: 5,
                  fill: colors.brand.default,
                  stroke: colors.surface.light,
                  strokeWidth: 2,
                }}
                dot={false}
                isAnimationActive={!reducedMotion}
              />
            </AreaChart>
          ) : (
            <RechartsLineChart
              data={data}
              margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
              accessibilityLayer
            >
              {showGrid && (
                <CartesianGrid
                  stroke={colors.border.lowEmphasis.onLight}
                  strokeDasharray="3 3"
                  vertical={false}
                />
              )}
              {showXAxis && (
                <XAxis
                  dataKey="label"
                  tick={axisTickStyle}
                  axisLine={{ stroke: colors.border.lowEmphasis.onLight }}
                  tickLine={false}
                  tickMargin={8}
                />
              )}
              {showYAxis && (
                <YAxis
                  tick={axisTickStyle}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      maximumFractionDigits: 1,
                    }).format(Number(v))
                  }
                  width={48}
                />
              )}
              {showTooltip && (
                <Tooltip content={<LumenChartTooltip currency={currency} format={formatCurrency} />} />
              )}
              <Line
                type="monotone"
                dataKey="value"
                stroke={colors.brand.default}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: colors.brand.default,
                  stroke: colors.surface.light,
                  strokeWidth: 2,
                }}
                isAnimationActive={!reducedMotion}
              />
            </RechartsLineChart>
          )}
        </ResponsiveContainer>
      </div>
    </figure>
  )
}

// ---------------------------------------------------------------------------
// Themed tooltip
// ---------------------------------------------------------------------------

interface LumenChartTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; payload: LineChartDatum }>
  currency: string
  format: (v: number) => string
}

function LumenChartTooltip({ active, payload, format }: LumenChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0]
  return (
    <div
      style={{
        padding: `${spacing.xs} ${spacing.sm}`,
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadius.md,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        fontFamily: fontFamilies.body,
      }}
    >
      <div
        style={{
          fontSize: typography.label.sm.fontSize,
          color: colors.text.lowEmphasis.onLight,
          marginBottom: 2,
        }}
      >
        {point.payload.label}
      </div>
      <div
        style={{
          fontSize: typography.body.md.fontSize,
          fontWeight: 600,
          color: colors.text.highEmphasis.onLight,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {format(point.value)}
      </div>
    </div>
  )
}
