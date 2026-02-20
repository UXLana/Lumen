'use client'

import React, { useState, useCallback } from 'react'
import {
  colors,
  spacing,
  borderRadius,
  fontFamilies,
  productCard,
  transitionPresets,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

export interface MarketBadge {
  code: string
  highlighted?: boolean
}

export interface ProductTag {
  label: string
  variant?: 'default' | 'outlined'
}

export interface ProductCardProps {
  /** Product image URL */
  imageUrl?: string
  /** Brand name */
  brand: string
  /** Product name */
  name: string
  /** SKU number */
  sku?: string
  /** Gap count badge (e.g., "1 Gap") */
  gapCount?: number
  /** Product tags (e.g., "Flower", "THC 22%") */
  tags?: ProductTag[]
  /** Market badges (e.g., CA, NV, CO) */
  markets?: MarketBadge[]
  /** Total markets count */
  totalMarkets?: number
  /** Click handler */
  onClick?: () => void
  /** Custom styles */
  style?: React.CSSProperties
}

// =============================================================================
// FOCUS STYLE (injected once for keyboard focus visibility)
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
      outline: 2px solid ${colors.brand.default};
      outline-offset: 2px;
    }
    .${focusClassName}:focus:not(:focus-visible) {
      outline: none;
    }
  `
  document.head.appendChild(style)
}

// =============================================================================
// PRODUCT CARD
// =============================================================================

export function ProductCard({
  imageUrl,
  brand,
  name,
  sku,
  gapCount,
  tags = [],
  markets = [],
  totalMarkets,
  onClick,
  style,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Inject focus style on first render
  React.useEffect(() => {
    if (onClick) ensureFocusStyle()
  }, [onClick])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])
  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])

  const isElevated = isHovered || isFocused

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: productCard.width,
    minWidth: productCard.minWidth,
    border: `${productCard.border.width} solid ${isElevated ? productCard.hover.borderColor : productCard.border.color}`,
    borderRadius: productCard.border.radius,
    backgroundColor: colors.surface.light,
    cursor: onClick ? 'pointer' : 'default',
    transition: `all ${transitionPresets.default}`,
    boxShadow: isElevated ? productCard.hover.shadow : 'none',
    overflow: 'hidden',
    padding: 0,
    textAlign: 'left',
    ...style,
  }

  const imageContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: productCard.image.height,
    backgroundColor: productCard.image.background,
    borderRadius: `${productCard.image.borderRadius} ${productCard.image.borderRadius} 0 0`,
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }

  const placeholderIconStyle: React.CSSProperties = {
    width: productCard.image.iconSize,
    height: productCard.image.iconSize,
    color: productCard.image.iconColor,
  }

  const contentStyle: React.CSSProperties = {
    padding: productCard.content.padding,
  }

  const brandStyle: React.CSSProperties = {
    fontFamily: fontFamilies.body,
    fontSize: productCard.typography.brand.fontSize,
    fontWeight: productCard.typography.brand.fontWeight,
    lineHeight: productCard.typography.brand.lineHeight,
    color: productCard.typography.brand.color,
    marginBottom: spacing[1],
  }

  const nameContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  }

  const nameStyle: React.CSSProperties = {
    fontFamily: fontFamilies.display,
    fontSize: productCard.typography.name.fontSize,
    fontWeight: productCard.typography.name.fontWeight,
    lineHeight: productCard.typography.name.lineHeight,
    color: productCard.typography.name.color,
  }

  const gapBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    height: productCard.gapBadge.height,
    padding: `0 ${productCard.gapBadge.paddingX}`,
    borderRadius: productCard.gapBadge.borderRadius,
    backgroundColor: productCard.gapBadge.background,
    fontFamily: fontFamilies.body,
    fontSize: productCard.gapBadge.typography.fontSize,
    fontWeight: productCard.gapBadge.typography.fontWeight,
    lineHeight: productCard.gapBadge.typography.lineHeight,
    color: productCard.gapBadge.typography.color,
    flexShrink: 0,
  }

  const skuStyle: React.CSSProperties = {
    fontFamily: fontFamilies.mono,
    fontSize: productCard.typography.sku.fontSize,
    fontWeight: productCard.typography.sku.fontWeight,
    lineHeight: productCard.typography.sku.lineHeight,
    color: productCard.typography.sku.color,
  }

  const tagsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: productCard.tags.gap,
    marginTop: productCard.tags.marginTop,
  }

  const tagStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    height: spacing[7],
    padding: `0 ${spacing[3]}`,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface.lightDarker,
    fontFamily: fontFamilies.body,
    fontSize: productCard.typography.sku.fontSize,
    fontWeight: 500,
    lineHeight: productCard.typography.sku.lineHeight,
    color: colors.text.lowEmphasis.onLight,
  }

  const outlinedTagStyle: React.CSSProperties = {
    ...tagStyle,
    backgroundColor: 'transparent',
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
  }

  const marketsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: productCard.markets.gap,
    marginTop: productCard.markets.marginTop,
  }

  const marketLabelStyle: React.CSSProperties = {
    fontFamily: fontFamilies.body,
    fontSize: productCard.typography.marketLabel.fontSize,
    fontWeight: productCard.typography.marketLabel.fontWeight,
    lineHeight: productCard.typography.marketLabel.lineHeight,
    color: productCard.typography.marketLabel.color,
  }

  const marketBadgesStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing[1],
  }

  const getMarketBadgeStyle = (highlighted: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: productCard.markets.badge.size,
    height: productCard.markets.badge.size,
    borderRadius: productCard.markets.badge.borderRadius,
    backgroundColor: highlighted
      ? productCard.markets.badge.colors.highlighted.background
      : productCard.markets.badge.colors.default.background,
    fontFamily: fontFamilies.body,
    fontSize: productCard.markets.badge.fontSize,
    fontWeight: productCard.markets.badge.fontWeight,
    color: highlighted
      ? productCard.markets.badge.colors.highlighted.text
      : productCard.markets.badge.colors.default.text,
  })

  const marketCountStyle: React.CSSProperties = {
    fontFamily: fontFamilies.body,
    fontSize: productCard.typography.marketCount.fontSize,
    fontWeight: productCard.typography.marketCount.fontWeight,
    lineHeight: productCard.typography.marketCount.lineHeight,
    color: productCard.typography.marketCount.color,
    marginLeft: 'auto',
  }

  // Placeholder icon (box)
  const placeholderIcon = (
    <svg style={placeholderIconStyle} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M42 32V16C41.9993 15.2986 41.8142 14.6097 41.463 14.0003C41.1119 13.391 40.6075 12.8836 40 12.52L26 4.52C25.392 4.17574 24.7022 3.9931 24 3.9931C23.2978 3.9931 22.608 4.17574 22 4.52L8 12.52C7.39253 12.8836 6.88795 13.391 6.53692 14.0003C6.18588 14.6097 6.00072 15.2986 6 16V32C6.00072 32.7014 6.18588 33.3903 6.53692 33.9997C6.88795 34.609 7.39253 35.1164 8 35.48L22 43.48C22.608 43.8243 23.2978 44.0069 24 44.0069C24.7022 44.0069 25.392 43.8243 26 43.48L40 35.48C40.6075 35.1164 41.1119 34.609 41.463 33.9997C41.8142 33.3903 41.9993 32.7014 42 32Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.54004 13.92L24 24.02L41.46 13.92" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24 44.16V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const highlightedCount = markets.filter(m => m.highlighted).length

  const content = (
    <>
      {/* Image Area */}
      <div style={imageContainerStyle} aria-hidden="true">
        {imageUrl ? (
          <img src={imageUrl} alt="" style={imageStyle} />
        ) : (
          placeholderIcon
        )}
      </div>

      {/* Content Area */}
      <div style={contentStyle}>
        {/* Brand */}
        <div style={brandStyle}>{brand}</div>

        {/* Name and Gap Badge */}
        <div style={nameContainerStyle}>
          <span style={nameStyle}>{name}</span>
          {gapCount !== undefined && gapCount > 0 && (
            <span style={gapBadgeStyle} role="status">
              {gapCount} {gapCount === 1 ? 'Gap' : 'Gaps'}
            </span>
          )}
        </div>

        {/* SKU */}
        {sku && <div style={skuStyle}>{sku}</div>}

        {/* Tags */}
        {tags.length > 0 && (
          <div style={tagsContainerStyle} role="list" aria-label="Product tags">
            {tags.map((tag, index) => (
              <span
                key={index}
                role="listitem"
                style={tag.variant === 'outlined' ? outlinedTagStyle : tagStyle}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}

        {/* Markets */}
        {markets.length > 0 && (
          <div style={marketsContainerStyle} role="group" aria-label="Market availability">
            <span style={marketLabelStyle} id="markets-label">Markets</span>
            <div style={marketBadgesStyle} role="list" aria-labelledby="markets-label">
              {markets.map((market, index) => (
                <span
                  key={index}
                  role="listitem"
                  style={getMarketBadgeStyle(market.highlighted || false)}
                  aria-label={`${market.code}${market.highlighted ? ' (active)' : ''}`}
                >
                  {market.code}
                </span>
              ))}
            </div>
            {totalMarkets !== undefined && totalMarkets > 0 && (
              <span style={marketCountStyle}>
                {highlightedCount}/{totalMarkets} Markets
              </span>
            )}
          </div>
        )}
      </div>
    </>
  )

  if (onClick) {
    return (
      <article
        role="button"
        tabIndex={0}
        className={focusClassName}
        style={containerStyle}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={`${brand} ${name}${sku ? `, SKU ${sku}` : ''}`}
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
    >
      {content}
    </article>
  )
}

ProductCard.displayName = 'ProductCard'
