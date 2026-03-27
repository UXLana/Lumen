'use client'

import React, { forwardRef, useState } from 'react'
import {
  colors,
  spacing,
  borderRadius,
  typography,
  fontFamilies,
  fontWeights,
  shadows,
  transitionPresets,
} from '../../styles/design-tokens'
import { Badge } from '../Badge'
import { Avatar } from '../Avatar'
import { IconStar, IconCheck } from '../Icons'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Installation status of the marketplace app
 */
export type MarketplaceAppStatus = 'installed' | 'uninstalled' | 'update-available'

/**
 * Card layout variant
 */
export type MarketplaceCardVariant = 'default' | 'compact' | 'horizontal'

/**
 * MarketplaceCard props
 */
export interface MarketplaceCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** App name */
  name: string
  /** App description */
  description: string
  /** Publisher/developer name */
  publisher: string
  /** Category (e.g., "Compliance", "Analytics") */
  category: string
  /** App icon URL */
  iconUrl?: string
  /** Hero/preview image URL */
  heroImageUrl?: string
  /** Rating value (0-5) */
  rating?: number
  /** Number of reviews */
  reviewCount?: number
  /** Installation status */
  status?: MarketplaceAppStatus
  /** Whether the app is verified */
  isVerified?: boolean
  /** Card layout variant */
  variant?: MarketplaceCardVariant
  /** Click handler */
  onClick?: () => void
  /** Whether the card is selected */
  selected?: boolean
}

// =============================================================================
// STATUS CONFIGURATIONS
// =============================================================================

const statusConfig: Record<MarketplaceAppStatus, {
  label: string
  color: 'neutral' | 'success' | 'info'
  variant: 'outlined' | 'subtle' | 'filled'
}> = {
  installed: {
    label: 'Installed',
    color: 'success',
    variant: 'subtle',
  },
  uninstalled: {
    label: 'Uninstalled',
    color: 'neutral',
    variant: 'outlined',
  },
  'update-available': {
    label: 'Update Available',
    color: 'info',
    variant: 'subtle',
  },
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Rating display component
 */
const Rating: React.FC<{ value: number; count?: number }> = ({ value, count }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: spacing['2xs'],
      fontSize: typography.body.sm.fontSize,
      color: colors.text.lowEmphasis.onLight,
    }}
  >
    <span style={{ fontWeight: fontWeights.medium, color: colors.text.highEmphasis.onLight }}>
      {value.toFixed(1)}
    </span>
    <IconStar
      size={14}
      style={{ color: '#F5A623', fill: '#F5A623' }}
    />
    {count !== undefined && (
      <span style={{ color: colors.text.lowEmphasis.onLight }}>({count})</span>
    )}
  </span>
)

/**
 * Verified badge component
 */
const VerifiedBadge: React.FC = () => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: spacing['2xs'],
      fontSize: typography.body.xs.fontSize,
      color: colors.status.success,
    }}
  >
    <IconCheck size={12} style={{ color: colors.status.success }} />
    Verified Application
  </span>
)

// =============================================================================
// DEFAULT CARD VARIANT
// =============================================================================

const DefaultCard = forwardRef<HTMLDivElement, MarketplaceCardProps>(
  (
    {
      name,
      description,
      publisher,
      category,
      iconUrl,
      heroImageUrl,
      rating = 0,
      reviewCount,
      status = 'uninstalled',
      isVerified = false,
      variant: _variant,
      onClick,
      selected = false,
      style,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false)
    const statusInfo = statusConfig[status]

    const cardStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '380px',
      backgroundColor: colors.surface.light,
      borderRadius: borderRadius.lg,
      border: `1px solid ${selected ? colors.brand.default : isHovered ? colors.border.midEmphasis.onLight : colors.border.lowEmphasis.onLight}`,
      boxShadow: isHovered ? shadows.md : shadows.sm,
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      transition: transitionPresets.default,
      ...style,
    }

    const heroStyles: React.CSSProperties = {
      width: '100%',
      height: '160px',
      backgroundColor: '#F5F5F5',
      backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: `${borderRadius.md} ${borderRadius.md} 0 0`,
    }

    const contentStyles: React.CSSProperties = {
      padding: spacing.md,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.sm,
    }

    const headerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing.sm,
    }

    const appInfoStyles: React.CSSProperties = {
      flex: 1,
      minWidth: 0,
    }

    const nameRowStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.xs,
      marginBottom: spacing['2xs'],
    }

    const metaStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs,
      flexWrap: 'wrap',
      fontSize: typography.body.sm.fontSize,
      color: colors.text.lowEmphasis.onLight,
    }

    const descriptionStyles: React.CSSProperties = {
      fontSize: typography.body.sm.fontSize,
      lineHeight: typography.body.sm.lineHeight,
      color: colors.text.lowEmphasis.onLight,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }

    return (
      <div
        ref={ref}
        style={cardStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        } : undefined}
        {...props}
      >
        {/* Hero Image */}
        <div style={heroStyles} />

        {/* Content */}
        <div style={contentStyles}>
          {/* Header with icon and info */}
          <div style={headerStyles}>
            <Avatar
              name={name}
              src={iconUrl}
              size="md"
              color={1}
            />
            <div style={appInfoStyles}>
              <div style={nameRowStyles}>
                <span
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.body.md.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: colors.text.highEmphasis.onLight,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {name}
                </span>
                <Badge
                  variant={statusInfo.variant}
                  color={statusInfo.color}
                  size="sm"
                >
                  {statusInfo.label}
                </Badge>
              </div>

              {/* Meta info row */}
              <div style={metaStyles}>
                <Rating value={rating} />
                <span style={{ color: colors.text.highEmphasis.onLight, fontWeight: fontWeights.medium }}>
                  {publisher}
                </span>
                <span>{category}</span>
              </div>

              {/* Verified badge */}
              {isVerified && (
                <div style={{ marginTop: spacing['2xs'] }}>
                  <VerifiedBadge />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p style={descriptionStyles}>{description}</p>
        </div>
      </div>
    )
  }
)

DefaultCard.displayName = 'MarketplaceCard.Default'

// =============================================================================
// COMPACT CARD VARIANT
// =============================================================================

const CompactCard = forwardRef<HTMLDivElement, MarketplaceCardProps>(
  (
    {
      name,
      description,
      publisher,
      category,
      iconUrl,
      heroImageUrl: _heroImageUrl,
      rating = 0,
      reviewCount: _reviewCount,
      status = 'uninstalled',
      isVerified = false,
      variant: _variant,
      onClick,
      selected = false,
      style,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false)
    const statusInfo = statusConfig[status]

    const cardStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing.sm,
      padding: spacing.md,
      backgroundColor: colors.surface.light,
      borderRadius: borderRadius.lg,
      border: `1px solid ${selected ? colors.brand.default : isHovered ? colors.border.midEmphasis.onLight : colors.border.lowEmphasis.onLight}`,
      boxShadow: isHovered ? shadows.sm : 'none',
      cursor: onClick ? 'pointer' : 'default',
      transition: transitionPresets.default,
      ...style,
    }

    return (
      <div
        ref={ref}
        style={cardStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        } : undefined}
        {...props}
      >
        <Avatar name={name} src={iconUrl} size="lg" color={1} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.xs,
              marginBottom: spacing['2xs'],
            }}
          >
            <span
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.md.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
              }}
            >
              {name}
            </span>
            <Badge variant={statusInfo.variant} color={statusInfo.color} size="sm">
              {statusInfo.label}
            </Badge>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
              marginBottom: spacing['2xs'],
            }}
          >
            <Rating value={rating} />
            <span>{publisher}</span>
            <span>{category}</span>
          </div>

          {isVerified && <VerifiedBadge />}

          <p
            style={{
              marginTop: spacing.xs,
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>
        </div>
      </div>
    )
  }
)

CompactCard.displayName = 'MarketplaceCard.Compact'

// =============================================================================
// HORIZONTAL CARD VARIANT (List item style)
// =============================================================================

const HorizontalCard = forwardRef<HTMLDivElement, MarketplaceCardProps>(
  (
    {
      name,
      description: _description,
      publisher,
      category,
      iconUrl,
      heroImageUrl: _heroImageUrl,
      rating = 0,
      reviewCount: _reviewCount,
      status = 'uninstalled',
      isVerified = false,
      variant: _variant,
      onClick,
      selected = false,
      style,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false)
    const statusInfo = statusConfig[status]

    const cardStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      padding: `${spacing.sm} ${spacing.md}`,
      backgroundColor: selected ? colors.surface.lightDarker : isHovered ? colors.surface.lightDarker : colors.surface.light,
      borderRadius: borderRadius.md,
      border: `1px solid ${selected ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
      cursor: onClick ? 'pointer' : 'default',
      transition: transitionPresets.default,
      ...style,
    }

    return (
      <div
        ref={ref}
        style={cardStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        } : undefined}
        {...props}
      >
        <Avatar name={name} src={iconUrl} size="md" color={1} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <span
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.md.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
              }}
            >
              {name}
            </span>
            {isVerified && (
              <IconCheck size={14} style={{ color: colors.status.success }} />
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            <span>{publisher}</span>
            <span>•</span>
            <span>{category}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <Rating value={rating} />
          <Badge variant={statusInfo.variant} color={statusInfo.color} size="sm">
            {statusInfo.label}
          </Badge>
        </div>
      </div>
    )
  }
)

HorizontalCard.displayName = 'MarketplaceCard.Horizontal'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * MarketplaceCard
 *
 * A card component for displaying marketplace/app store items.
 * Supports multiple layouts: default (with hero image), compact, and horizontal (list item).
 *
 * @example
 * // Default with hero image
 * <MarketplaceCard
 *   name="Metrc Integration"
 *   description="Industry-leading track-and-trace platform..."
 *   publisher="Metrc"
 *   category="Compliance"
 *   rating={5.0}
 *   status="installed"
 *   isVerified
 *   onClick={() => {}}
 * />
 *
 * // Compact variant
 * <MarketplaceCard variant="compact" {...props} />
 *
 * // Horizontal/list variant
 * <MarketplaceCard variant="horizontal" {...props} />
 */
export const MarketplaceCard = forwardRef<HTMLDivElement, MarketplaceCardProps>(
  ({ variant = 'default', ...props }, ref) => {
    switch (variant) {
      case 'compact':
        return <CompactCard ref={ref} {...props} />
      case 'horizontal':
        return <HorizontalCard ref={ref} {...props} />
      default:
        return <DefaultCard ref={ref} {...props} />
    }
  }
)

MarketplaceCard.displayName = 'MarketplaceCard'

export default MarketplaceCard
