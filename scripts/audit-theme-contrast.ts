/**
 * audit-theme-contrast.ts
 *
 * Theme-level WCAG 2.2 AA contrast audit for LUMEN.
 *
 * For each registered theme, checks every token pair that appears in the Vault
 * prototype and other common rendering contexts against WCAG minimums:
 *   - 4.5:1 for normal body text
 *   - 3.0:1 for large text (≥18pt / 14pt bold) AND for UI components/borders
 *
 * Usage:
 *   npx tsx scripts/audit-theme-contrast.ts
 *   npx tsx scripts/audit-theme-contrast.ts --json      // machine-readable
 *   npx tsx scripts/audit-theme-contrast.ts --fail-only // only print failures
 *
 * Exit code is non-zero if any text pair fails 4.5:1.
 */

import { lumenTheme } from '../styles/themes/lumen'
import { lumenDarkTheme } from '../styles/themes/lumen-dark'
import { fallTheme } from '../styles/themes/fall'
import { foliageTheme } from '../styles/themes/foliage'
import { foliageDarkTheme } from '../styles/themes/foliage-dark'
import { springTheme } from '../styles/themes/spring'
import { pampasTheme } from '../styles/themes/pampas'
import { rainyNightTheme } from '../styles/themes/rainy-night'
import type { ProductTheme } from '../styles/themes/theme-interface'

// ---------------------------------------------------------------------------
// Themes under audit
// ---------------------------------------------------------------------------

const THEMES: ProductTheme[] = [
  lumenTheme,
  lumenDarkTheme,
  fallTheme,
  foliageTheme,
  foliageDarkTheme,
  springTheme,
  pampasTheme,
  rainyNightTheme,
]

// ---------------------------------------------------------------------------
// Contrast calculation (WCAG 2.x algorithm)
// ---------------------------------------------------------------------------

type RGB = { r: number; g: number; b: number; a: number }

/** Parse hex, rgb(), or rgba() into normalized 0–255 + alpha. */
function parseColor(input: string): RGB | null {
  const s = input.trim().toLowerCase()

  // #rgb, #rrggbb, #rrggbbaa
  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i)
  if (hex) {
    const h = hex[1]
    if (h.length === 3) {
      return {
        r: parseInt(h[0] + h[0], 16),
        g: parseInt(h[1] + h[1], 16),
        b: parseInt(h[2] + h[2], 16),
        a: 1,
      }
    }
    if (h.length === 6) {
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
        a: 1,
      }
    }
    if (h.length === 8) {
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
        a: parseInt(h.slice(6, 8), 16) / 255,
      }
    }
  }

  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgb = s.match(/^rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/)
  if (rgb) {
    return {
      r: parseFloat(rgb[1]),
      g: parseFloat(rgb[2]),
      b: parseFloat(rgb[3]),
      a: rgb[4] !== undefined ? parseFloat(rgb[4]) : 1,
    }
  }

  return null
}

/** Composite a foreground over a background (alpha blending). */
function composite(fg: RGB, bg: RGB): RGB {
  if (fg.a >= 1) return fg
  const a = fg.a + bg.a * (1 - fg.a)
  return {
    r: Math.round((fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a),
    g: Math.round((fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a),
    b: Math.round((fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a),
    a,
  }
}

/** WCAG relative luminance for an sRGB color. */
function relativeLuminance({ r, g, b }: RGB): number {
  const channel = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** WCAG contrast ratio. Returns a value in [1, 21]. */
function contrastRatio(fg: RGB, bg: RGB): number {
  // Composite fg over bg if it has alpha (common for surface.lightDarker = rgba(0,0,0,0.06))
  const composited = fg.a >= 1 ? fg : composite(fg, bg)
  const l1 = relativeLuminance(composited)
  const l2 = relativeLuminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// ---------------------------------------------------------------------------
// Token pair definitions
// ---------------------------------------------------------------------------

interface TokenPair {
  id: string
  label: string
  /** Path into theme.colors for the foreground */
  fg: (t: ProductTheme) => string | undefined
  /** Path into theme.colors for the background */
  bg: (t: ProductTheme) => string | undefined
  /** 4.5 for normal text, 3.0 for large text / UI components */
  minRatio: 3 | 4.5
  /** Category for grouping in the report */
  category: 'text' | 'status' | 'border' | 'interactive' | 'chart' | 'decorative'
  /**
   * When true, failures are reported as WARN not FAIL. Used for decorative
   * elements that are WCAG 1.4.11-exempt (e.g. card borders where the card
   * surface itself already communicates elevation via background color).
   */
  decorativeExempt?: boolean
}

// Type-safe-ish token accessors (themes use loose typing internally, we do too)
type Theme = ProductTheme & { colors: Record<string, any> }
const path = (t: ProductTheme, p: string): string | undefined => {
  const segments = p.split('.')
  let cur: any = (t as Theme).colors
  for (const s of segments) {
    cur = cur?.[s]
    if (cur == null) return undefined
  }
  return typeof cur === 'string' ? cur : undefined
}

const PAIRS: TokenPair[] = [
  // ---------- Text on surfaces (4.5:1 required) ----------
  {
    id: 'text-high-on-light',
    label: 'text.highEmphasis.onLight on surface.light',
    fg: (t) => path(t, 'text.highEmphasis.onLight'),
    bg: (t) => path(t, 'surface.light'),
    minRatio: 4.5,
    category: 'text',
  },
  {
    id: 'text-low-on-light',
    label: 'text.lowEmphasis.onLight on surface.light',
    fg: (t) => path(t, 'text.lowEmphasis.onLight'),
    bg: (t) => path(t, 'surface.light'),
    minRatio: 4.5,
    category: 'text',
  },
  {
    id: 'text-low-on-lightDarker',
    label: 'text.lowEmphasis.onLight on surface.lightDarker',
    fg: (t) => path(t, 'text.lowEmphasis.onLight'),
    bg: (t) => path(t, 'surface.lightDarker'),
    minRatio: 4.5,
    category: 'text',
  },
  {
    id: 'text-disabled-on-light',
    label: 'text.disabled.onLight on surface.light (informational context)',
    fg: (t) => path(t, 'text.disabled.onLight'),
    bg: (t) => path(t, 'surface.light'),
    // Disabled text is exempt from 4.5:1 per WCAG 1.4.3, but we warn if it's
    // below 3:1 because it's often misused for pending/muted content.
    minRatio: 3,
    category: 'text',
  },

  // ---------- Status colors on surfaces (4.5:1 for text usage) ----------
  {
    id: 'status-success-on-light',
    label: 'status.success on surface.light (credit text)',
    fg: (t) => path(t, 'status.success'),
    bg: (t) => path(t, 'surface.light'),
    minRatio: 4.5,
    category: 'status',
  },
  {
    id: 'status-success-on-lightDarker',
    label: 'status.success on surface.lightDarker (credit text on cards)',
    fg: (t) => path(t, 'status.success'),
    bg: (t) => path(t, 'surface.lightDarker'),
    minRatio: 4.5,
    category: 'status',
  },
  {
    id: 'status-important-on-light',
    label: 'status.important on surface.light (debit text)',
    fg: (t) => path(t, 'status.important'),
    bg: (t) => path(t, 'surface.light'),
    minRatio: 4.5,
    category: 'status',
  },
  {
    id: 'status-important-on-lightDarker',
    label: 'status.important on surface.lightDarker (debit text on cards)',
    fg: (t) => path(t, 'status.important'),
    bg: (t) => path(t, 'surface.lightDarker'),
    minRatio: 4.5,
    category: 'status',
  },
  {
    id: 'status-warning-on-light',
    label: 'status.warning on surface.light',
    fg: (t) => path(t, 'status.warning'),
    bg: (t) => path(t, 'surface.light'),
    minRatio: 4.5,
    category: 'status',
  },
  {
    id: 'status-info-on-light',
    label: 'status.info on surface.light',
    fg: (t) => path(t, 'status.info'),
    bg: (t) => path(t, 'surface.light'),
    minRatio: 4.5,
    category: 'status',
  },

  // ---------- Borders + chart strokes (3:1 is WCAG minimum for UI components) ----------
  {
    id: 'border-mid-on-light',
    label: 'border.midEmphasis.onLight on surface.light (input borders)',
    fg: (t) => path(t, 'border.midEmphasis.onLight'),
    bg: (t) => path(t, 'surface.light'),
    minRatio: 3,
    category: 'border',
  },
  {
    id: 'border-high-on-light',
    label: 'border.highEmphasis.onLight on surface.light (focus borders)',
    fg: (t) => path(t, 'border.highEmphasis.onLight'),
    bg: (t) => path(t, 'surface.light'),
    minRatio: 3,
    category: 'border',
  },
  {
    // DECORATIVE-EXEMPT: WCAG 1.4.11 ("Non-text Contrast") explicitly exempts
    // decorative elements and inactive UI components. Card borders are
    // decorative when the card surface itself (surface.lightDarker) already
    // communicates elevation via background contrast. Failures here are WARN
    // not FAIL — the token is allowed to be subtle.
    id: 'border-low-on-lightDarker',
    label: 'border.lowEmphasis.onLight on surface.lightDarker (card borders — decorative)',
    fg: (t) => path(t, 'border.lowEmphasis.onLight'),
    bg: (t) => path(t, 'surface.lightDarker'),
    minRatio: 3,
    category: 'decorative',
    decorativeExempt: true,
  },

  // ---------- Interactive / focus ----------
  {
    id: 'focus-on-light',
    label: 'focusBorder.onLight on surface.light (keyboard focus ring)',
    fg: (t) => path(t, 'focusBorder.onLight'),
    bg: (t) => path(t, 'surface.light'),
    minRatio: 3,
    category: 'interactive',
  },
  {
    id: 'brand-on-light',
    label: 'brand.default on surface.light (primary action bg vs surface)',
    fg: (t) => path(t, 'brand.default'),
    bg: (t) => path(t, 'surface.light'),
    minRatio: 3,
    category: 'interactive',
  },

  // ---------- Charts ----------
  {
    id: 'chart-brand-on-light',
    label: 'brand.default stroke on surface.light (chart line)',
    fg: (t) => path(t, 'brand.default'),
    bg: (t) => path(t, 'surface.light'),
    minRatio: 3,
    category: 'chart',
  },
]

// ---------------------------------------------------------------------------
// Audit runner
// ---------------------------------------------------------------------------

interface AuditResult {
  themeName: string
  pairId: string
  pairLabel: string
  category: TokenPair['category']
  fgValue: string | undefined
  bgValue: string | undefined
  minRatio: number
  actualRatio: number | null
  status: 'pass' | 'fail' | 'warn' | 'missing' | 'unparseable'
}

function auditPair(theme: ProductTheme, pair: TokenPair): AuditResult {
  const fgValue = pair.fg(theme)
  const bgValue = pair.bg(theme)

  if (!fgValue || !bgValue) {
    return {
      themeName: theme.name,
      pairId: pair.id,
      pairLabel: pair.label,
      category: pair.category,
      fgValue,
      bgValue,
      minRatio: pair.minRatio,
      actualRatio: null,
      status: 'missing',
    }
  }

  const fgRgb = parseColor(fgValue)
  const bgRgb = parseColor(bgValue)

  if (!fgRgb || !bgRgb) {
    return {
      themeName: theme.name,
      pairId: pair.id,
      pairLabel: pair.label,
      category: pair.category,
      fgValue,
      bgValue,
      minRatio: pair.minRatio,
      actualRatio: null,
      status: 'unparseable',
    }
  }

  // If bg has alpha, composite it over pure white (worst-case for light themes).
  // This handles the common pattern of surface.lightDarker = rgba(0,0,0,0.06).
  const solidBg = bgRgb.a < 1 ? composite(bgRgb, { r: 255, g: 255, b: 255, a: 1 }) : bgRgb

  const ratio = contrastRatio(fgRgb, solidBg)
  const passes = ratio >= pair.minRatio

  // Decorative-exempt pairs (WCAG 1.4.11 decorative elements exemption)
  // report as WARN rather than FAIL, and don't affect the exit code.
  const status: AuditResult['status'] = passes
    ? 'pass'
    : pair.decorativeExempt
      ? 'warn'
      : 'fail'

  return {
    themeName: theme.name,
    pairId: pair.id,
    pairLabel: pair.label,
    category: pair.category,
    fgValue,
    bgValue,
    minRatio: pair.minRatio,
    actualRatio: ratio,
    status,
  }
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function runAudit(): AuditResult[] {
  const results: AuditResult[] = []
  for (const theme of THEMES) {
    for (const pair of PAIRS) {
      results.push(auditPair(theme, pair))
    }
  }
  return results
}

function formatText(results: AuditResult[], failOnly: boolean): string {
  const lines: string[] = []
  const themes = Array.from(new Set(results.map((r) => r.themeName)))

  lines.push('')
  lines.push('═══════════════════════════════════════════════════════════════════════')
  lines.push('  LUMEN Theme Contrast Audit — WCAG 2.2 AA')
  lines.push('═══════════════════════════════════════════════════════════════════════')
  lines.push('')

  for (const themeName of themes) {
    const themeResults = results.filter((r) => r.themeName === themeName)
    const fails = themeResults.filter((r) => r.status === 'fail')
    const warns = themeResults.filter((r) => r.status === 'warn')
    const missing = themeResults.filter((r) => r.status === 'missing')
    const passes = themeResults.filter((r) => r.status === 'pass')

    const icon =
      fails.length === 0 && missing.length === 0
        ? warns.length === 0
          ? '✅'
          : '🟡' // all passing except decorative warns
        : fails.length > 0
          ? '❌'
          : '⚠️'
    lines.push(`${icon}  ${themeName}`)
    lines.push(
      `   ${passes.length} pass · ${fails.length} fail · ${warns.length} warn · ${missing.length} missing`,
    )
    lines.push('')

    const rowsToShow = failOnly ? [...fails, ...warns, ...missing] : themeResults
    if (rowsToShow.length === 0 && failOnly) {
      lines.push('   (no issues)')
      lines.push('')
      continue
    }

    for (const r of rowsToShow) {
      const icon =
        r.status === 'pass'
          ? '  ✓'
          : r.status === 'fail'
            ? '  ✗'
            : r.status === 'warn'
              ? '  ~'
              : r.status === 'missing'
                ? '  ?'
                : '  !'
      const ratio = r.actualRatio != null ? r.actualRatio.toFixed(2).padStart(5) : ' n/a '
      const target = r.minRatio.toFixed(1)
      const values =
        r.fgValue && r.bgValue ? ` (${r.fgValue} on ${r.bgValue})` : r.status === 'missing' ? ' (token undefined)' : ''
      lines.push(`${icon} ${ratio} / ${target}   ${r.pairLabel}${values}`)
    }
    lines.push('')
  }

  // Summary
  const totalFails = results.filter((r) => r.status === 'fail').length
  const totalWarns = results.filter((r) => r.status === 'warn').length
  const totalMissing = results.filter((r) => r.status === 'missing').length
  const totalPasses = results.filter((r) => r.status === 'pass').length

  lines.push('─────────────────────────────────────────────────────────────────────')
  lines.push(
    `  TOTAL: ${totalPasses} pass · ${totalFails} fail · ${totalWarns} warn (decorative) · ${totalMissing} missing`,
  )
  lines.push('─────────────────────────────────────────────────────────────────────')
  lines.push('')

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2)
  const asJson = args.includes('--json')
  const failOnly = args.includes('--fail-only')

  const results = runAudit()

  if (asJson) {
    console.log(JSON.stringify(results, null, 2))
  } else {
    console.log(formatText(results, failOnly))
  }

  // Exit non-zero if any text-category pair fails
  const textFails = results.filter((r) => r.status === 'fail' && r.category === 'text').length
  const statusFails = results.filter((r) => r.status === 'fail' && r.category === 'status').length
  if (textFails + statusFails > 0) {
    process.exit(1)
  }
}

main()
