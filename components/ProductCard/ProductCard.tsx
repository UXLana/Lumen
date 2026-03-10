'use client'

import React, { useState, useCallback, useId } from 'react'
import {
  colors,
  spacing,
  borderRadius,
  typography,
  fontFamilies,
  fontWeights,
  shadows,
  transitionPresets,
} from '@/styles/design-tokens'
import { Badge } from '@/components/Badge/Badge'
import { CloseIcon as DSCloseIcon } from '@/components/Banner/Banner'

// =============================================================================
// TYPES
// =============================================================================

export type ProductCardLayout = 'vertical' | 'horizontal' | 'compact'

/** @deprecated Use brands[] + categories[] + potency instead */
export interface ProductTag {
  label: string
  variant?: 'default' | 'outlined'
}

export interface MarketBadge {
  code: string
  highlighted?: boolean
}

export interface ProductCardProps {
  /** Layout variant */
  layout?: ProductCardLayout
  /** Product image URL */
  imageUrl?: string
  /** Product type label shown as overlay badge (e.g. "Product", "Package") */
  typeLabel?: string
  /** Product name */
  name: string
  /** SKU identifier */
  sku?: string
  /** Brand names */
  brands?: string[]
  /** Category tags (e.g. "Edibles") */
  categories?: string[]
  /** Potency label (e.g. "100 mg of THC") */
  potency?: string
  /** Gap count badge */
  gapCount?: number
  /** Market badges */
  markets?: MarketBadge[]
  /** Total markets count */
  totalMarkets?: number
  /** Whether the card is selected (checkbox state) */
  selected?: boolean
  /** Icon shown when selected: 'check' (default) or 'close' (for remove/dismiss contexts) */
  selectionIcon?: 'check' | 'close'
  /** Selection toggle handler (checkbox) */
  onSelect?: (selected: boolean) => void
  /** Show a low-emphasis border on the card at rest */
  bordered?: boolean
  /** Click handler for viewing details (card body click) */
  onClick?: () => void
  /** Custom styles */
  style?: React.CSSProperties

  // Legacy compat
  /** @deprecated Use `brands` array instead */
  brand?: string
  /** @deprecated Use `categories` + `potency` instead */
  tags?: { label: string; variant?: 'default' | 'outlined' }[]
}

// =============================================================================
// FOCUS STYLE
// =============================================================================

const focusClassName = 'product-card-interactive'
const focusStyleId = 'product-card-focus-style'

function ensureFocusStyle() {
  if (typeof document === 'undefined') return
  if (document.getElementById(focusStyleId)) return
  const style = document.createElement('style')
  style.id = focusStyleId
  style.textContent = `
    .${focusClassName}:focus-visible {
      outline: 2px solid ${colors.focusBorder.onLight};
      outline-offset: 2px;
    }
    .${focusClassName}:focus:not(:focus-visible) {
      outline: none;
    }
  `
  document.head.appendChild(style)
}

// =============================================================================
// ICONS
// =============================================================================

const PlaceholderIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M42 32V16C41.9993 15.2986 41.8142 14.6097 41.463 14.0003C41.1119 13.391 40.6075 12.8836 40 12.52L26 4.52C25.392 4.17574 24.7022 3.9931 24 3.9931C23.2978 3.9931 22.608 4.17574 22 4.52L8 12.52C7.39253 12.8836 6.88795 13.391 6.53692 14.0003C6.18588 14.6097 6.00072 15.2986 6 16V32C6.00072 32.7014 6.18588 33.3903 6.53692 33.9997C6.88795 34.609 7.39253 35.1164 8 35.48L22 43.48C22.608 43.8243 23.2978 44.0069 24 44.0069C24.7022 44.0069 25.392 43.8243 26 43.48L40 35.48C40.6075 35.1164 41.1119 34.609 41.463 33.9997C41.8142 33.3903 41.9993 32.7014 42 32Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.54004 13.92L24 24.02L41.46 13.92" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 44.16V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ProductTypeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M14 10.67V5.33c0-.37-.1-.73-.29-1.04-.18-.32-.45-.58-.77-.75L9.07 1.2A2.01 2.01 0 008 .92c-.37 0-.73.1-1.06.28L3.07 3.54c-.32.17-.59.43-.77.75-.19.31-.29.67-.29 1.04v5.34c0 .37.1.73.29 1.04.18.32.45.58.77.75l3.87 2.34c.33.19.69.28 1.06.28.37 0 .73-.1 1.06-.28l3.87-2.34c.32-.17.59-.43.77-.75.19-.31.29-.67.29-1.04z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.03 4.64L8 7.68l4.97-3.04" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14.72V7.68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)


// =============================================================================
// SELECT CHECKBOX — always visible, top-right
// =============================================================================

function SelectCheckbox({
  checked,
  onChange,
  productName,
  icon = 'check',
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  productName: string
  icon?: 'check' | 'close'
}) {
  const [hovered, setHovered] = useState(false)

  const isClose = icon === 'close'

  if (isClose) {
    return (
      <button
        type="button"
        aria-label={`Remove ${productName}`}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onChange(!checked)
        }}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.stopPropagation()
            e.preventDefault()
            onChange(!checked)
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: hovered ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
          color: 'rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          transition: `all ${transitionPresets.default}`,
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        <DSCloseIcon size={14} color="currentColor" />
      </button>
    )
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={`Select ${productName}`}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onChange(!checked)
      }}
      onKeyDown={(e) => {
        if (e.key === ' ') {
          e.stopPropagation()
          e.preventDefault()
          onChange(!checked)
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        border: checked ? 'none' : `2px solid rgba(0, 0, 0, 0.20)`,
        backgroundColor: checked ? colors.brand.default : 'rgba(255, 255, 255, 0.80)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
        transition: `all ${transitionPresets.default}`,
        zIndex: 2,
        backdropFilter: checked ? undefined : 'blur(4px)',
        flexShrink: 0,
      }}
    >
      {checked && <CheckIcon />}
    </button>
  )
}

// =============================================================================
// CARD-LEVEL STYLE CONSTANTS
// =============================================================================

// #767676 is the lightest grey that passes WCAG AA (4.54:1) on white
const LIGHT_TEXT = '#767676'

const BADGE_MARKET = { bg: 'rgba(23, 151, 142, 0.12)', text: colors.brand.default }

// =============================================================================
// MARKET BADGE (inline)
// =============================================================================

function MarketBadgeItem({ code, highlighted }: { code: string; highlighted: boolean }) {
  return (
    <span
      role="img"
      aria-label={`${code} market${highlighted ? ', active' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        borderRadius: borderRadius.sm,
        backgroundColor: BADGE_MARKET.bg,
        fontFamily: fontFamilies.body,
        fontSize: '10px',
        lineHeight: '12px',
        fontWeight: fontWeights.semibold,
        color: BADGE_MARKET.text,
      }}
    >
      {code}
    </span>
  )
}

// =============================================================================
// LAYOUT CONFIGS
// =============================================================================

const imageSize = {
  vertical: { height: '180px' },
  horizontal: { width: '168px', height: '100%' },
  compact: { width: '96px', height: '96px' },
} as const

const layoutMinWidth: Record<ProductCardLayout, string> = {
  vertical: '180px',
  horizontal: '360px',
  compact: '240px',
}

// =============================================================================
// PRODUCT CARD
// =============================================================================

export function ProductCard({
  layout = 'vertical',
  imageUrl,
  typeLabel,
  name,
  sku,
  brands = [],
  categories = [],
  potency,
  gapCount,
  markets = [],
  totalMarkets,
  selected = false,
  selectionIcon = 'check',
  bordered = false,
  onSelect,
  onClick,
  style,
  // Legacy compat
  brand,
  tags,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const uid = useId()

  React.useEffect(() => {
    if (onClick) ensureFocusStyle()
  }, [onClick])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])
  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])

  const isElevated = isHovered || isFocused

  // Normalize legacy props
  const effectiveBrands = brands.length > 0 ? brands : brand ? [brand] : []
  const effectiveCategories = categories.length > 0
    ? categories
    : tags?.filter(t => t.variant !== 'outlined').map(t => t.label) ?? []
  const effectivePotency = potency ?? tags?.find(t => t.variant === 'outlined')?.label

  const activeMarkets = markets.filter(m => m.highlighted)
  const highlightedMarkets = activeMarkets.length

  // ─── Container ───
  const isHorizontal = layout === 'horizontal'
  const isCompact = layout === 'compact'

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: isHorizontal || isCompact ? 'row' : 'column',
    border: `1px solid ${selected ? colors.brand.default : isElevated ? 'rgba(0, 0, 0, 0.12)' : bordered ? colors.border.lowEmphasis.onLight : 'transparent'}`,
    borderRadius: borderRadius.lg,
    backgroundColor: selected ? 'rgba(23, 151, 142, 0.04)' : colors.surface.light,
    cursor: onClick ? 'pointer' : 'default',
    transition: `all ${transitionPresets.default}`,
    boxShadow: selected ? `0 0 0 1px ${colors.brand.default}` : isElevated ? shadows.sm : 'none',
    overflow: 'hidden',
    width: '100%',
    minWidth: layoutMinWidth[layout],
    textAlign: 'left',
    ...style,
  }

  // ─── Image ───
  const renderImage = () => {
    if (isCompact) {
      return (
        <div style={{
          width: imageSize.compact.width,
          minWidth: imageSize.compact.width,
          padding: '16px 8px 16px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          alignSelf: 'flex-start',
        }}>
          <div style={{
            width: '100%',
            height: '0',
            paddingBottom: '100%',
            position: 'relative',
            backgroundColor: '#F5F5F5',
            borderRadius: borderRadius.md,
            overflow: 'hidden',
          }}>
            {imageUrl ? (
              <img src={imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.20)' }}>
                <PlaceholderIcon />
              </div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div style={{
        position: 'relative',
        ...(isHorizontal
          ? { width: imageSize.horizontal.width, minWidth: imageSize.horizontal.width, minHeight: '120px' }
          : { height: imageSize.vertical.height }),
        backgroundColor: '#F5F5F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ color: 'rgba(0, 0, 0, 0.20)' }}>
            <PlaceholderIcon />
          </div>
        )}
        {typeLabel && (
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
          }}>
            <Badge variant="filled" color="brand" size="sm" icon={<ProductTypeIcon />}>{typeLabel}</Badge>
          </div>
        )}
      </div>
    )
  }

  // ─── Content ───
  // All spacing on a strict 4-point grid: 4, 8, 12, 16px
  const hasCheckbox = !!onSelect
  const contentPadding = isCompact
    ? `8px ${hasCheckbox ? '48px' : '12px'} 8px 12px`
    : isHorizontal
      ? `16px ${hasCheckbox ? '48px' : '16px'} 16px 16px`
      : '16px'

  const badgeRadius = borderRadius.sm

  const greyBadgeStyle: React.CSSProperties = {
    backgroundColor: '#E5E5E5',
    color: LIGHT_TEXT,
    border: 'none',
    borderRadius: badgeRadius,
  }

  const renderContent = () => (
    <div style={{
      padding: contentPadding,
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: 0,
    }}>
      {/* Name + Gap badge */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: fontFamilies.display,
            fontSize: isCompact ? '14px' : '15px',
            fontWeight: fontWeights.semibold,
            lineHeight: isCompact ? '20px' : '24px',
            color: 'rgba(0, 0, 0, 0.80)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: isCompact ? 'nowrap' : undefined,
          }}>
            {name}
          </span>
          {gapCount !== undefined && gapCount > 0 && (
            <Badge variant="subtle" color="neutral" size="sm" style={greyBadgeStyle}>
              {gapCount} {gapCount === 1 ? 'Gap' : 'Gaps'}
            </Badge>
          )}
        </div>
        {sku && (
          <div style={{
            fontFamily: fontFamilies.mono,
            fontSize: '12px',
            lineHeight: '16px',
            fontWeight: fontWeights.regular,
            color: LIGHT_TEXT,
            marginTop: '4px',
          }}>
            {sku}
          </div>
        )}
      </div>

      {/* Badge groups — pushed toward bottom with auto margin */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginTop: isCompact ? '8px' : '16px',
      }}>
        {/* Brands */}
        {effectiveBrands.length > 0 && (
          <div
            role="group"
            aria-label={`Brands: ${effectiveBrands.join(', ')}`}
            style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}
          >
            {effectiveBrands.map((b, i) => (
              <Badge key={`b-${i}`} variant="subtle" color="neutral" size="sm" style={greyBadgeStyle}>{b}</Badge>
            ))}
          </div>
        )}

        {/* Category & Potency — hidden in compact layout */}
        {!isCompact && (effectiveCategories.length > 0 || effectivePotency) && (
          <div
            role="group"
            aria-label={`Category and potency: ${[...effectiveCategories, effectivePotency].filter(Boolean).join(', ')}`}
            style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}
          >
            {effectiveCategories.map((c, i) => (
              <Badge key={`c-${i}`} variant="subtle" color="neutral" size="sm" style={greyBadgeStyle}>{c}</Badge>
            ))}
            {effectivePotency && (
              <Badge variant="subtle" color="neutral" size="sm" style={greyBadgeStyle}>{effectivePotency}</Badge>
            )}
          </div>
        )}

        {/* Markets — only active + count */}
        {(highlightedMarkets > 0 || (totalMarkets !== undefined && totalMarkets > 0)) && (
          <div
            role="group"
            aria-label={`Markets: ${activeMarkets.map(m => m.code).join(', ')}${totalMarkets ? `, ${highlightedMarkets} of ${totalMarkets} total` : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {(isCompact ? activeMarkets.slice(0, 3) : activeMarkets).map((m, i) => (
              <MarketBadgeItem key={i} code={m.code} highlighted />
            ))}
            {isCompact && activeMarkets.length > 3 && (
              <span aria-hidden="true" style={{
                fontFamily: fontFamilies.body,
                fontSize: '12px',
                lineHeight: '16px',
                color: LIGHT_TEXT,
              }}>
                +{activeMarkets.length - 3}
              </span>
            )}
            {totalMarkets !== undefined && totalMarkets > 0 && (
              <span aria-hidden="true" style={{
                fontFamily: fontFamilies.body,
                fontSize: '12px',
                lineHeight: '16px',
                fontWeight: fontWeights.regular,
                color: LIGHT_TEXT,
                marginLeft: 'auto',
              }}>
                {highlightedMarkets}/{totalMarkets} Markets
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const ariaLabel = [
    name,
    sku && `SKU ${sku}`,
    effectiveBrands.length && `Brand: ${effectiveBrands.join(', ')}`,
    effectiveCategories.length && `Category: ${effectiveCategories.join(', ')}`,
    effectivePotency && `Potency: ${effectivePotency}`,
    activeMarkets.length && `Markets: ${activeMarkets.map(m => m.code).join(', ')}`,
    totalMarkets && `${highlightedMarkets} of ${totalMarkets} markets`,
    gapCount && `${gapCount} gap${gapCount === 1 ? '' : 's'}`,
  ].filter(Boolean).join('. ')

  const checkbox = onSelect ? (
    <SelectCheckbox
      checked={selected}
      onChange={onSelect}
      productName={name}
      icon={selectionIcon}
    />
  ) : null

  const content = (
    <>
      {checkbox}
      {renderImage()}
      {renderContent()}
    </>
  )

  if (onClick) {
    return (
      <article
        tabIndex={0}
        className={focusClassName}
        style={containerStyle}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onClick()
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={ariaLabel}
      >
        {content}
      </article>
    )
  }

  return (
    <article
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
    >
      {content}
    </article>
  )
}

ProductCard.displayName = 'ProductCard'
