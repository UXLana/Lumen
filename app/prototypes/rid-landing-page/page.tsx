'use client'

import React, { useState } from 'react'
import { PrototypeToolbar, ViewState, UseCase } from '@/app/prototypes/PrototypeToolbar'
import {
  colors,
  spacing,
  fontFamilies,
  fontWeights,
  typography,
  borderRadius,
  borderRadiusSemantics,
} from '@/styles/design-tokens'
import { Badge, Banner, DetailField, Divider, Skeleton, EmptyState, Button, Link, IconCheckCircle, IconStar, IconHeart, IconBadge } from '@/components'
import type { BadgeProps, IconProps } from '@/components'
import { sampleProduct, massachusettsConfig } from './data'
import type { ProductData, StateConfig, LabResult } from './data'

// =============================================================================
// USE CASES
// =============================================================================

const USE_CASES: UseCase[] = [
  {
    label: 'UC1 — Compliance-First',
    description: 'Mandated market (MA). State header prominent, brand suppressed.',
  },
  {
    label: 'UC2 — Compliance + Brand',
    description: 'Mandated market that allows brand content. State seal + brand hero balanced.',
  },
  {
    label: 'UC3 — Brand-Forward',
    description: 'Non-mandated market. Brand primary, lightweight compliance.',
  },
  {
    label: 'UC4 — Brand-Only',
    description: 'Pre-mandate / voluntary. No state compliance features.',
  },
]

// =============================================================================
// ICONS (inline SVG)
// =============================================================================

function ShieldCheckIcon({ size = 20, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckCircleIcon({ size = 24, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AlertTriangleIcon({ size = 16, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth="1.5" />
      <path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon({ size = 16, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

function ExternalLinkIcon({ size = 16, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InfoIcon({ size = 16, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ChevronDownIcon({ size = 16, color, rotated }: { size?: number; color: string; rotated?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{
        transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 200ms ease-out',
      }}
    >
      <path d="M4 6l4 4 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const linkIconMap = {
  alert: AlertTriangleIcon,
  phone: PhoneIcon,
  link: ExternalLinkIcon,
  info: InfoIcon,
}

// =============================================================================
// SECTION HEADER — matches qr-verify pattern
// =============================================================================

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: fontFamilies.display,
        fontSize: typography.heading.h6.fontSize,
        fontWeight: fontWeights.semibold,
        color: colors.text.highEmphasis.onLight,
        margin: 0,
      }}
    >
      {children}
    </h2>
  )
}

// =============================================================================
// PRODUCT IMAGE (generated illustration)
// =============================================================================

function ProductImage() {
  return (
    <div
      style={{
        margin: spacing.md,
        padding: `${spacing.lg} ${spacing.md}`,
        backgroundColor: colors.surface.lightDarker,
        borderRadius: borderRadiusSemantics.card,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src="/prototypes/qr-verify/product-photo.png"
        alt="Blueberry Bliss Gummies product package"
        style={{
          maxWidth: '100%',
          maxHeight: '180px',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

// =============================================================================
// IMAGE PLACEHOLDER (matches qr-verify style)
// =============================================================================

function ImagePlaceholder() {
  return (
    <div
      aria-label="Product photo placeholder"
      style={{
        width: '100%',
        height: '220px',
        backgroundColor: colors.surface.lightDarker,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={48} height={48} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke={colors.text.disabled.onLight} strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="2" stroke={colors.text.disabled.onLight} strokeWidth="1.5" />
        <path d="M21 15l-5-5L5 21" stroke={colors.text.disabled.onLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// =============================================================================
// STATE HEADER (Compliance modes)
// =============================================================================

function StateHeader({ config, compact }: { config: StateConfig; compact?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xs,
        padding: `${spacing.xs} ${spacing.md}`,
        backgroundColor: compact ? 'transparent' : colors.surface.lightDarker,
        borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: compact ? '24px' : '32px',
          height: compact ? '24px' : '32px',
          borderRadius: '50%',
          backgroundColor: colors.surface.light,
          border: `1.5px solid ${colors.border.midEmphasis.onLight}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: fontFamilies.display,
            fontSize: compact ? '8px' : '10px',
            fontWeight: fontWeights.bold,
            color: colors.text.highEmphasis.onLight,
          }}
        >
          {config.abbreviation}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span
          style={{
            fontFamily: fontFamilies.display,
            fontSize: compact ? typography.label.sm.fontSize : typography.label.md.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
          }}
        >
          {compact ? `${config.abbreviation} Regulated Product` : 'Legal Regulated Product'}
        </span>
        {!compact && (
          <span
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.xs.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            {config.agencyName}
          </span>
        )}
      </div>

      <ShieldCheckIcon size={compact ? 16 : 20} color={colors.brand.default} />
    </div>
  )
}

// =============================================================================
// MINIMAL HEADER (Brand modes — matches qr-verify "Metrc Verified" header)
// =============================================================================

function MinimalHeader({ label }: { label: string }) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${spacing.sm} ${spacing.md}`,
        borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M16.667 5L7.5 14.167 3.333 10" stroke={colors.status.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.label.md.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          fontFamily: fontFamilies.body,
          fontSize: typography.body.xs.fontSize,
          color: colors.text.lowEmphasis.onLight,
        }}
      >
        Powered by Metrc
      </span>
    </header>
  )
}

// =============================================================================
// CAMPAIGN BANNER
// =============================================================================

function CampaignBanner({ config }: { config: StateConfig }) {
  if (!config.campaign) return null
  return (
    <div
      style={{
        padding: `${spacing.xs} ${spacing.md}`,
        backgroundColor: colors.surface.lightDarker,
        borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
        display: 'flex',
        gap: spacing.xs,
        alignItems: 'flex-start',
      }}
    >
      <InfoIcon size={16} color={colors.brand.default} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
          }}
        >
          {config.campaign.headline}
        </span>
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.xs.fontSize,
            color: colors.text.lowEmphasis.onLight,
            lineHeight: '16px',
          }}
        >
          {config.campaign.body}
        </span>
        <a
          href={config.campaign.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.xs.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.brand.default,
            textDecoration: 'none',
          }}
        >
          {config.campaign.linkLabel}
        </a>
      </div>
    </div>
  )
}

// =============================================================================
// TEST STATUS BADGE (inline compact — matches qr-verify lab results badge)
// =============================================================================

function TestStatusBanner({ product }: { product: ProductData }) {
  return (
    <div style={{ padding: `${spacing.xs} ${spacing.md}` }}>
      <Banner variant="success" size="md" title={`All Tests Passed — ${product.testDate}`} />
    </div>
  )
}

// =============================================================================
// WARNING MESSAGES
// =============================================================================

function WarningMessages({ messages }: { messages: string[] }) {
  return (
    <Banner variant="warning" size="md" buttonAlignment="below">
      {messages.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
    </Banner>
  )
}

// =============================================================================
// CONSUMER ESSENTIALS (serving info — 2x2 grid)
// =============================================================================

function ConsumerEssentials({ product }: { product: ProductData }) {
  const items = [
    { label: 'THC / Serving', value: product.thcPerServing },
    { label: 'THC / Package', value: product.thcPerPackage },
    { label: 'Serving Size', value: product.servingSize.split('(')[0].trim() },
    { label: 'Servings', value: String(product.servingsPerPackage) },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1px',
        backgroundColor: colors.border.lowEmphasis.onLight,
        borderRadius: borderRadiusSemantics.card,
        overflow: 'hidden',
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            padding: `${spacing.xs} ${spacing.sm}`,
            backgroundColor: colors.surface.light,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <span
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.xs.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            {item.label}
          </span>
          <span
            style={{
              fontFamily: fontFamilies.display,
              fontSize: typography.heading.h6.fontSize,
              fontWeight: fontWeights.bold,
              color: colors.text.highEmphasis.onLight,
            }}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// POTENCY BARS — matches qr-verify exactly
// =============================================================================

function PotencyBar({ label, value, maxValue, color }: { label: string; value: string; maxValue: number; color: string }) {
  const numericValue = parseFloat(value)
  const percentage = Math.min((numericValue / maxValue) * 100, 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h5.fontSize,
            fontWeight: fontWeights.bold,
            color: colors.text.highEmphasis.onLight,
          }}
        >
          {value}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={numericValue}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        aria-label={`${label}: ${value}`}
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: colors.surface.lightDarker,
          borderRadius: borderRadius.full,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: borderRadius.full,
            transition: 'width 600ms ease-out',
          }}
        />
      </div>
    </div>
  )
}

// =============================================================================
// LAB RESULTS — matches qr-verify expandable pattern
// =============================================================================

function LabResults({ product }: { product: ProductData }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionHeader>Lab Results</SectionHeader>
        <Badge
          variant="subtle"
          color={product.testStatus === 'passed' ? 'success' : product.testStatus === 'failed' ? 'error' : 'warning'}
          size="sm"
        >
          {product.testStatus === 'passed' ? 'All Tests Passed' : product.testStatus === 'failed' ? 'Failed' : 'Pending'}
        </Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        <DetailField label="Tested by" value={product.labName} />
        <DetailField label="Test date" value={product.testDate} />
        <DetailField label="License" value={product.labLicense} mono />
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing['2xs'],
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontFamily: fontFamilies.body,
          fontSize: typography.body.sm.fontSize,
          fontWeight: fontWeights.medium,
          color: colors.text.action.enabled,
          textDecoration: 'none',
        }}
      >
        {expanded ? 'Hide results' : `All (${product.labResults.length})`}
        <ChevronDownIcon size={14} color={colors.text.action.enabled} rotated={expanded} />
      </button>

      {expanded && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadiusSemantics.card,
            padding: `0 ${spacing.sm}`,
          }}
        >
          {product.labResults.map((test, index) => (
            <React.Fragment key={test.testType}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: `${spacing.xs} 0`,
                }}
              >
                <span
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.body.sm.fontSize,
                    color: colors.text.highEmphasis.onLight,
                  }}
                >
                  {test.testType}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  {test.value && (
                    <span
                      style={{
                        fontFamily: fontFamilies.mono,
                        fontSize: typography.body.sm.fontSize,
                        color: colors.text.lowEmphasis.onLight,
                      }}
                    >
                      {test.value}{test.unit}
                    </span>
                  )}
                  <Badge
                    variant="subtle"
                    color={test.result === 'passed' ? 'success' : test.result === 'failed' ? 'error' : 'warning'}
                    size="sm"
                  >
                    {test.result === 'passed' ? 'Pass' : test.result === 'failed' ? 'Fail' : 'Pending'}
                  </Badge>
                </div>
              </div>
              {index < product.labResults.length - 1 && <Divider spacing="none" />}
            </React.Fragment>
          ))}
        </div>
      )}

      <Link href={product.coaUrl} external size="md" style={{ marginTop: `calc(${spacing.md} - ${spacing.sm})` }}>
        Certificate of Analysis (CoA)
      </Link>
    </div>
  )
}

// =============================================================================
// STATE LINKS
// =============================================================================

function StateLinks({ config }: { config: StateConfig }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <SectionHeader>Resources</SectionHeader>
      {config.links.map((link) => (
        <Link key={link.label} href={link.url} external size="md">
          {link.label}
        </Link>
      ))}
    </div>
  )
}

// =============================================================================
// LICENSEE BADGES
// =============================================================================

const badgeIconMap: Record<string, React.FC<IconProps>> = {
  equity: IconBadge,
  local: IconCheckCircle,
  veteran: IconStar,
  sustainability: IconHeart,
}

function LicenseeBadges({ badges }: { badges: StateConfig['badges'] }) {
  if (!badges.length) return null

  return (
    <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
      {badges.map((badge) => (
          <Badge
            key={badge.label}
            variant="subtle"
            color="neutral"
            size="sm"
          >
            {badge.label}
          </Badge>
      ))}
    </div>
  )
}

// =============================================================================
// PRODUCT IDENTITY — matches qr-verify product detail layout
// =============================================================================

function ProductIdentity({ product, showImage }: { product: ProductData; showImage?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {showImage && <ProductImage />}
      <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <h1
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h4.fontSize,
            fontWeight: fontWeights.bold,
            color: colors.text.highEmphasis.onLight,
            margin: 0,
            lineHeight: '1.2',
          }}
        >
          {product.name}
        </h1>
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.md.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          by {product.brand}
        </span>
        <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap', marginTop: spacing['2xs'] }}>
          <Badge variant="subtle" color="neutral">{product.category}</Badge>
          <Badge variant="subtle" color="neutral">{product.strainType}</Badge>
          <Badge variant="subtle" color="neutral">{product.strain}</Badge>
        </div>
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
            margin: `${spacing.xs} 0 0`,
            lineHeight: '20px',
          }}
        >
          {product.description}
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// PACKAGE DETAILS — matches qr-verify
// =============================================================================

function PackageDetails({ product }: { product: ProductData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
      <SectionHeader>Package Details</SectionHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginTop: spacing['2xs'] }}>
        <DetailField label="Package Tag" value={product.packageTag} mono />
        <DetailField label="Batch ID" value={product.batchId} mono />
        <DetailField label="Net Weight" value={product.weight} />
        <DetailField label="Harvest Date" value={product.harvestDate} />
        <DetailField label="Packaged On" value={product.packageDate} />
        <DetailField label="Best By" value={product.expirationDate} />
      </div>
    </div>
  )
}

// =============================================================================
// RETAILER INFO
// =============================================================================

function RetailerInfo({ product }: { product: ProductData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <SectionHeader>Retailer</SectionHeader>
      <DetailField label="Purchased at" value={product.retailer.name} />
      <DetailField label="Location" value={product.retailer.location} />
      <DetailField label="Purchase date" value={product.retailer.purchaseDate} />
      <DetailField label="License" value={product.retailer.license} mono />
    </div>
  )
}

// =============================================================================
// GLOSSARY LINK
// =============================================================================

function GlossaryLink() {
  return (
    <a
      href="#"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xs,
        padding: `${spacing.xs} ${spacing.md}`,
        backgroundColor: colors.surface.lightDarker,
        borderRadius: borderRadiusSemantics.button,
        textDecoration: 'none',
      }}
    >
      <InfoIcon size={16} color={colors.brand.default} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.brand.default,
          }}
        >
          Consumer Glossary
        </span>
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.xs.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          Learn what these terms mean
        </span>
      </div>
    </a>
  )
}

// =============================================================================
// USE CASE VIEWS
// =============================================================================

/** UC1: Compliance-First — Mandated market, brand suppressed */
function ComplianceFirstView({ product, config }: { product: ProductData; config: StateConfig }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <StateHeader config={config} />
      <CampaignBanner config={config} />
      <TestStatusBanner product={product} />

      {/* Product identity — compact, no image */}
      <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <h1
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h5.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            margin: 0,
            lineHeight: '1.2',
          }}
        >
          {product.name}
        </h1>
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          {product.brand} &middot; {product.category} &middot; {product.weight}
        </span>
        <LicenseeBadges badges={config.badges} />
      </div>

      {/* Warnings */}
      <div style={{ padding: `0 ${spacing.md}` }}>
        <WarningMessages messages={config.warningMessages} />
      </div>

      {/* Consumer essentials */}
      <div style={{ padding: spacing.md }}>
        <ConsumerEssentials product={product} />
      </div>

      <Divider spacing="none" />

      {/* Lab results */}
      <div style={{ padding: spacing.md }}>
        <LabResults product={product} />
      </div>

      <Divider spacing="none" />

      {/* Retailer */}
      <div style={{ padding: spacing.md }}>
        <RetailerInfo product={product} />
      </div>

      <Divider spacing="none" />

      {/* Package details */}
      <div style={{ padding: spacing.md }}>
        <PackageDetails product={product} />
      </div>

      <Divider spacing="none" />

      {/* Resources */}
      <div style={{ padding: spacing.md }}>
        <StateLinks config={config} />
      </div>

    </div>
  )
}

/** UC2: Compliance + Brand — Mandated market, brand allowed */
function CompliancePlusBrandView({ product, config }: { product: ProductData; config: StateConfig }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <StateHeader config={config} compact />
      <TestStatusBanner product={product} />

      <ProductIdentity product={product} showImage />

      {/* Warnings */}
      <div style={{ padding: `0 ${spacing.md}` }}>
        <WarningMessages messages={config.warningMessages} />
      </div>

      {/* Consumer essentials */}
      <div style={{ padding: spacing.md }}>
        <ConsumerEssentials product={product} />
      </div>

      {/* Potency */}
      <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <SectionHeader>Potency</SectionHeader>
        <PotencyBar label="THC" value={product.thcPercent} maxValue={35} color={colors.brand.default} />
        <PotencyBar label="CBD" value={product.cbdPercent} maxValue={25} color={colors.brand.default} />
      </div>

      <Divider spacing="none" />

      {/* Lab results */}
      <div style={{ padding: spacing.md }}>
        <LabResults product={product} />
      </div>

      <Divider spacing="none" />

      {/* Retailer */}
      <div style={{ padding: spacing.md }}>
        <RetailerInfo product={product} />
      </div>

      <Divider spacing="none" />

      {/* Package details */}
      <div style={{ padding: spacing.md }}>
        <PackageDetails product={product} />
      </div>

      <Divider spacing="none" />

      {/* State information */}
      <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <SectionHeader>State Information</SectionHeader>
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
            margin: 0,
            lineHeight: '20px',
          }}
        >
          {config.legalMessage}
        </p>
        <LicenseeBadges badges={config.badges} />
      </div>

      <Divider spacing="none" />

      {/* Resources */}
      <div style={{ padding: spacing.md }}>
        <StateLinks config={config} />
      </div>

    </div>
  )
}

/** UC3: Brand-Forward — Non-mandated market, lightweight compliance */
function BrandForwardView({ product, config }: { product: ProductData; config: StateConfig }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <MinimalHeader label="Metrc Verified" />

      <ProductIdentity product={product} showImage />

      <Divider spacing="none" />

      {/* Potency */}
      <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <SectionHeader>Potency</SectionHeader>
        <PotencyBar label="THC" value={product.thcPercent} maxValue={35} color={colors.brand.default} />
        <PotencyBar label="CBD" value={product.cbdPercent} maxValue={25} color={colors.brand.default} />
        <PotencyBar label="Terpenes" value={product.terpenes} maxValue={10} color={colors.brand.default} />
      </div>

      {/* Consumer essentials */}
      <div style={{ padding: spacing.md }}>
        <ConsumerEssentials product={product} />
      </div>

      <Divider spacing="none" />

      {/* Lab results */}
      <div style={{ padding: spacing.md }}>
        <LabResults product={product} />
      </div>

      <Divider spacing="none" />

      {/* Package details */}
      <div style={{ padding: spacing.md }}>
        <PackageDetails product={product} />
      </div>

      <Divider spacing="none" />

      {/* Lightweight compliance — just regulator link */}
      <div
        style={{
          padding: `${spacing.xs} ${spacing.md}`,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: colors.surface.lightDarker,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }}
        >
          <span
            style={{
              fontFamily: fontFamilies.display,
              fontSize: '8px',
              fontWeight: fontWeights.bold,
              color: colors.text.highEmphasis.onLight,
            }}
          >
            {config.abbreviation}
          </span>
        </div>
        <a
          href={config.agencyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.brand.default,
            textDecoration: 'none',
          }}
        >
          {config.agencyName}
        </a>
      </div>
    </div>
  )
}

/** UC4: Brand-Only — Voluntary adoption, no state features */
function BrandOnlyView({ product }: { product: ProductData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <MinimalHeader label="Retail ID" />

      <ProductIdentity product={product} showImage />

      <Divider spacing="none" />

      {/* Potency */}
      <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <SectionHeader>Potency</SectionHeader>
        <PotencyBar label="THC" value={product.thcPercent} maxValue={35} color={colors.brand.default} />
        <PotencyBar label="CBD" value={product.cbdPercent} maxValue={25} color={colors.brand.default} />
        <PotencyBar label="Terpenes" value={product.terpenes} maxValue={10} color={colors.brand.default} />
      </div>

      {/* Consumer essentials */}
      <div style={{ padding: spacing.md }}>
        <ConsumerEssentials product={product} />
      </div>

      <Divider spacing="none" />

      {/* Lab results */}
      <div style={{ padding: spacing.md }}>
        <LabResults product={product} />
      </div>

      <Divider spacing="none" />

      {/* Package details */}
      <div style={{ padding: spacing.md }}>
        <PackageDetails product={product} />
      </div>
    </div>
  )
}

// =============================================================================
// LOADING STATE
// =============================================================================

function LoadingState() {
  return (
    <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      <Skeleton variant="rectangular" height={44} />
      <Skeleton variant="rectangular" height={200} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <Skeleton width="60%" height={24} />
        <Skeleton width="40%" height={16} />
        <div style={{ display: 'flex', gap: spacing.xs, marginTop: spacing['2xs'] }}>
          <Skeleton width={60} height={22} />
          <Skeleton width={50} height={22} />
        </div>
      </div>
      <Divider spacing="sm" />
      <Skeleton variant="rectangular" height={80} />
      <Divider spacing="sm" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <Skeleton width="30%" height={18} />
        <Skeleton height={32} />
        <Skeleton height={32} />
      </div>
      <Divider spacing="sm" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <Skeleton width="30%" height={18} />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={24} />
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function RIDLandingPage() {
  const [viewState, setViewState] = useState<ViewState>('default')
  const [activeUseCase, setActiveUseCase] = useState(0)

  return (
    <>
      {viewState === 'loading' && <LoadingState />}

      {viewState === 'empty' && (
        <EmptyState
          title="Product Not Found"
          description="This QR code does not match any product in our system. The product may have been recalled or the code may be counterfeit."
          icon={
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={colors.text.lowEmphasis.onLight} strokeWidth="1.5" />
              <path d="M12 8v4M12 16h.01" stroke={colors.text.lowEmphasis.onLight} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          action={
            <Button emphasis="mid" size="md" onClick={() => setViewState('default')}>
              Try Scanning Again
            </Button>
          }
        />
      )}

      {viewState === 'error' && (
        <EmptyState
          title="Verification Unavailable"
          description="We're unable to verify this product right now. Please check your connection and try again."
          icon={
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4M12 17h.01" stroke={colors.status.important} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={colors.status.important} strokeWidth="1.5" />
            </svg>
          }
          action={
            <Button emphasis="high" size="md" onClick={() => setViewState('default')}>
              Retry
            </Button>
          }
        />
      )}

      {viewState === 'default' && activeUseCase === 0 && (
        <ComplianceFirstView product={sampleProduct} config={massachusettsConfig} />
      )}
      {viewState === 'default' && activeUseCase === 1 && (
        <CompliancePlusBrandView product={sampleProduct} config={massachusettsConfig} />
      )}
      {viewState === 'default' && activeUseCase === 2 && (
        <BrandForwardView product={sampleProduct} config={massachusettsConfig} />
      )}
      {viewState === 'default' && activeUseCase === 3 && (
        <BrandOnlyView product={sampleProduct} />
      )}

      <PrototypeToolbar
        viewState={viewState}
        onViewStateChange={setViewState}
        useCases={USE_CASES}
        activeUseCase={activeUseCase}
        onUseCaseChange={setActiveUseCase}
      />
    </>
  )
}
