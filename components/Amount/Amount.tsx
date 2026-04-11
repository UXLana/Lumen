'use client'

import React from 'react'
import {
  colors,
  typography,
  fontFamilies,
  fontWeights,
  numericStyles,
} from '@/styles/design-tokens'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AmountSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type AmountVariant = 'default' | 'credit' | 'debit' | 'pending' | 'muted'

export type AmountSign = 'auto' | 'always' | 'never' | 'accounting'

export type AmountShowCents = 'auto' | 'always' | 'never'

export interface AmountProps extends Omit<React.OutputHTMLAttributes<HTMLOutputElement>, 'children'> {
  /** The numeric value to display. Can be a number or a numeric string. */
  value: number | string
  /** ISO 4217 currency code. Defaults to USD. */
  currency?: string
  /**
   * How to render the sign.
   * - `auto` (default): show `−` for negatives, no sign for positives
   * - `always`: always show `+` or `−`
   * - `never`: show only the absolute value. ⚠️ Only use when direction
   *   is communicated elsewhere (column header, icon, context). The
   *   component's accessible label still announces "credit"/"debit"
   *   when variant="credit" or "debit" to satisfy WCAG 1.4.1.
   * - `accounting`: wrap negatives in parentheses instead of a minus
   */
  sign?: AmountSign
  /**
   * Visual variant.
   * - `default`: inherit text color
   * - `credit`: success green (for incoming money)
   * - `debit`: error red (for outgoing money)
   * - `pending`: muted/disabled color (for pending or provisional amounts)
   * - `muted`: low-emphasis text color (for secondary amounts)
   */
  variant?: AmountVariant
  /** Size — maps to typography tokens. `xl`/`2xl` use display font for balance heroes. */
  size?: AmountSize
  /**
   * Whether to display cents.
   * - `auto` (default): show cents unless the value is a whole number
   * - `always`: always show two decimal places
   * - `never`: truncate to whole numbers
   */
  showCents?: AmountShowCents
  /** Apply tabular numbers. Defaults to true. Disable for inline prose. */
  tabular?: boolean
  /** Locale for number formatting. Defaults to en-US. */
  locale?: string
  /** Optional weight override. Defaults to medium for md+, regular for smaller. */
  weight?: keyof typeof fontWeights
  /** Accessible label override. If omitted, a descriptive label is generated. */
  'aria-label'?: string
}

// ---------------------------------------------------------------------------
// Size → typography token mapping
// ---------------------------------------------------------------------------

const SIZE_STYLES: Record<
  AmountSize,
  { fontSize: string; lineHeight: string; fontFamily: string; defaultWeight: keyof typeof fontWeights }
> = {
  xs: {
    fontSize: typography.body.xs.fontSize,
    lineHeight: typography.body.xs.lineHeight,
    fontFamily: fontFamilies.body,
    defaultWeight: 'regular',
  },
  sm: {
    fontSize: typography.body.sm.fontSize,
    lineHeight: typography.body.sm.lineHeight,
    fontFamily: fontFamilies.body,
    defaultWeight: 'regular',
  },
  md: {
    fontSize: typography.body.md.fontSize,
    lineHeight: typography.body.md.lineHeight,
    fontFamily: fontFamilies.body,
    defaultWeight: 'medium',
  },
  lg: {
    fontSize: typography.heading.h5.fontSize,
    lineHeight: typography.heading.h5.lineHeight,
    fontFamily: fontFamilies.body,
    defaultWeight: 'semibold',
  },
  xl: {
    fontSize: typography.heading.h2.fontSize,
    lineHeight: typography.heading.h2.lineHeight,
    fontFamily: fontFamilies.display,
    defaultWeight: 'bold',
  },
  '2xl': {
    fontSize: typography.display.lg.fontSize,
    lineHeight: typography.display.lg.lineHeight,
    fontFamily: fontFamilies.display,
    defaultWeight: 'bold',
  },
}

// ---------------------------------------------------------------------------
// Variant → color mapping
// ---------------------------------------------------------------------------

function resolveColor(variant: AmountVariant): string | undefined {
  switch (variant) {
    case 'credit':
      return colors.status.success
    case 'debit':
      return colors.status.important
    case 'pending':
      // Use lowEmphasis (passes 4.5:1) not disabled text (designed for
      // non-interactive UI and typically fails contrast for informational
      // content). WCAG 1.4.3 Contrast (Minimum).
      return colors.text.lowEmphasis.onLight
    case 'muted':
      return colors.text.lowEmphasis.onLight
    case 'default':
    default:
      return undefined // inherit
  }
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function normalizeValue(value: number | string): number {
  if (typeof value === 'number') return value
  const parsed = parseFloat(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

function formatAmount({
  value,
  currency,
  sign,
  showCents,
  locale,
}: {
  value: number
  currency: string
  sign: AmountSign
  showCents: AmountShowCents
  locale: string
}): { display: string; isNegative: boolean } {
  const isNegative = value < 0
  const absolute = Math.abs(value)

  const isWholeNumber = absolute % 1 === 0
  const minimumFractionDigits =
    showCents === 'never' ? 0 : showCents === 'always' ? 2 : isWholeNumber ? 0 : 2
  const maximumFractionDigits = showCents === 'never' ? 0 : 2

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    currencyDisplay: 'symbol',
  }).format(absolute)

  // Intl.NumberFormat returns the currency-formatted absolute value.
  // We manage the sign ourselves so we can support "accounting" mode.
  let display: string
  if (sign === 'accounting' && isNegative) {
    display = `(${formatted})`
  } else if (sign === 'never') {
    display = formatted
  } else if (sign === 'always') {
    display = `${isNegative ? '\u2212' : '+'}${formatted}`
  } else {
    // auto
    display = isNegative ? `\u2212${formatted}` : formatted
  }

  return { display, isNegative }
}

function generateAriaLabel(
  value: number,
  currency: string,
  locale: string,
  variant: AmountVariant,
  showCents: AmountShowCents,
): string {
  // Spell out the full label for screen readers: "negative one thousand two hundred dollars and thirty cents"
  // We use Intl.NumberFormat's "currency" style with currencyDisplay: "name" for natural speech.
  //
  // For credit/debit variants, prepend the direction ("credit of X", "debit of X") so that
  // users who cannot perceive color still know which way money moved. This satisfies
  // WCAG 1.4.1 Use of Color.
  //
  // For showCents="never", match the visible text precision so that the accessible name
  // reflects the visible text (WCAG 2.5.3 Label in Name).
  try {
    const isWholeNumber = Math.abs(value) % 1 === 0
    const minimumFractionDigits =
      showCents === 'never' ? 0 : showCents === 'always' ? 2 : isWholeNumber ? 0 : 2
    const maximumFractionDigits = showCents === 'never' ? 0 : 2

    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'name',
      minimumFractionDigits,
      maximumFractionDigits,
    })
    const base = formatter.format(Math.abs(value))

    if (variant === 'credit') return `credit of ${base}`
    if (variant === 'debit') return `debit of ${base}`
    if (variant === 'pending') return `pending ${base}`
    return value < 0 ? `negative ${base}` : base
  } catch {
    // Fallback if currency code is invalid
    return `${value} ${currency}`
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Amount — Display a currency value with consistent formatting, variant colors,
 * and accessible labels. The workhorse for any financial UI.
 *
 * @example
 * // Basic usage
 * <Amount value={1247.30} />
 *
 * @example
 * // Credit (incoming) — green, with explicit +
 * <Amount value={500} variant="credit" sign="always" />
 *
 * @example
 * // Debit (outgoing) — red, accounting style
 * <Amount value={-1247.30} variant="debit" sign="accounting" />
 *
 * @example
 * // Balance hero — display size, bold
 * <Amount value={2481327.94} size="2xl" />
 */
export const Amount = React.forwardRef<HTMLOutputElement, AmountProps>(
  (
    {
      value,
      currency = 'USD',
      sign = 'auto',
      variant = 'default',
      size = 'md',
      showCents = 'auto',
      tabular = true,
      locale = 'en-US',
      weight,
      'aria-label': ariaLabelProp,
      'aria-live': ariaLiveProp,
      style,
      ...rest
    },
    ref,
  ) => {
    const numericValue = normalizeValue(value)
    const { display } = formatAmount({
      value: numericValue,
      currency,
      sign,
      showCents,
      locale,
    })

    const sizeConfig = SIZE_STYLES[size]
    const color = resolveColor(variant)
    const resolvedWeight = fontWeights[weight ?? sizeConfig.defaultWeight]

    const ariaLabel =
      ariaLabelProp ?? generateAriaLabel(numericValue, currency, locale, variant, showCents)

    // <output> is semantically the correct element for a computed/displayed value
    // and is a first-class host for aria-label (no role="text" hack needed).
    //
    // HOWEVER: <output> has an implicit role="status", which makes it a polite
    // live region. A data table with 50+ Amount cells would cause SR spam on any
    // re-render (filter change, sort, etc.). So we explicitly default aria-live
    // to "off" to suppress that behavior. Callers who want balance-hero updates
    // to be announced can opt in with aria-live="polite".
    const ariaLive = ariaLiveProp ?? 'off'

    return (
      <output
        ref={ref}
        aria-label={ariaLabel}
        aria-live={ariaLive}
        style={{
          display: 'inline',
          fontFamily: sizeConfig.fontFamily,
          fontSize: sizeConfig.fontSize,
          lineHeight: sizeConfig.lineHeight,
          fontWeight: resolvedWeight,
          color,
          letterSpacing: size === 'xl' || size === '2xl' ? '-0.01em' : undefined,
          ...(tabular ? numericStyles.financial : undefined),
          ...style,
        }}
        {...rest}
      >
        {display}
      </output>
    )
  },
)
Amount.displayName = 'Amount'
