'use client'

import React, { useState } from 'react'
import { PrototypeToolbar, ViewState, UseCase, Version } from '@/app/prototypes/PrototypeToolbar'
import {
  colors,
  spacing,
  fontFamilies,
  fontWeights,
  typography,
  borderRadiusSemantics,
} from '@/styles/design-tokens'
import { Accordion, AccordionItem, TabBar, Badge, Banner, DetailField, Divider, Skeleton, EmptyState, Button, Link, IconCheckCircle, IconStar, IconHeart, IconBadge } from '@/components'
import type { TabItem } from '@/components'
import type { IconProps } from '@/components'
import { sampleProduct, sampleBrand, massachusettsConfig } from './data'
import type { ProductData, BrandData, StateConfig, LabResult } from './data'

// =============================================================================
// USE CASES
// =============================================================================

const VERSIONS: Version[] = [
  { label: 'v1 — Tabbed', description: 'Tabbed view with Product Details and About Brand.' },
  { label: 'v2 — Accordion', description: 'Sections collapsed into accordions. Starts on UC1.' },
]

const USE_CASES: UseCase[] = [
  {
    label: 'UC1 — Compliance + Brand',
    description: 'Mandated market that allows brand content. State seal + brand hero balanced.',
  },
  {
    label: 'UC2 — Compliance-First',
    description: 'Mandated market (MA). State header prominent, brand suppressed.',
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
// COMPLIANCE BANNER — CCC + Compliance Passed + Metrc RID (single image)
// =============================================================================

function ComplianceBanner({ variant = 'default' }: { variant?: 'default' | 'large' }) {
  const src = variant === 'large'
    ? '/prototypes/rid-landing-page/ccc-large.png'
    : '/prototypes/rid-landing-page/compliance-banner.png'
  return (
    <img
      src={src}
      alt="Cannabis Control Commission — Compliance Passed — Metrc Retail ID"
      role="banner"
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
      }}
    />
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
    { label: 'CBD / Serving', value: product.cbdPercent },
    { label: 'Terpenes', value: product.terpenes },
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
// LAB RESULTS — matches qr-verify expandable pattern
// =============================================================================

function LabResults({ product, hideCOAButton, hideHeader }: { product: ProductData; hideCOAButton?: boolean; hideHeader?: boolean }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
      {!hideHeader && (
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
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        <DetailField label="Tested by" value={product.labName} />
        <DetailField label="Test date" value={product.testDate} />
        <DetailField label="License" value={product.labLicense} mono />
      </div>

      {/* View Full COA — high emphasis, full width */}
      {!hideCOAButton && (
        <Button emphasis="high" size="md" fullWidth onClick={() => window.open(product.coaUrl, '_blank')}>
          View Full COA
        </Button>
      )}

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
    </div>
  )
}

// =============================================================================
// STATE LINKS
// =============================================================================

function StateLinks({ config, hideHeader }: { config: StateConfig; hideHeader?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      {!hideHeader && <SectionHeader>Resources</SectionHeader>}
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

function PackageDetails({ product, hideHeader }: { product: ProductData; hideHeader?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
      {!hideHeader && <SectionHeader>Package Details</SectionHeader>}
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

function RetailerInfo({ product, hideHeader }: { product: ProductData; hideHeader?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      {!hideHeader && <SectionHeader>Retailer</SectionHeader>}
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
// v1 — TABBED PRODUCT + BRAND VIEW
// =============================================================================

function BrandHero() {
  return (
    <div
      style={{
        margin: spacing.md,
        height: '200px',
        borderRadius: borderRadiusSemantics.card,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src="/prototypes/rid-landing-page/brand-image.jpg"
        alt="Commonwealth Edibles Co. product showcase"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {/* Dot indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: spacing.sm,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: spacing['2xs'],
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: i === 0 ? colors.text.highEmphasis.onDark : 'rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function BrandAboutSection({ brand }: { brand: BrandData }) {
  const allFaqs = [
    { id: 'about', question: "What's in a Commonwealth gummy?", answer: brand.extendedDescription || brand.description },
    ...brand.faqs.map((faq, i) => ({ ...faq, id: `faq-${i}` })),
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Brand identity — below image */}
      <div
        style={{
          padding: spacing.md,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        <span
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h6.fontSize,
            fontWeight: fontWeights.bold,
            color: colors.text.highEmphasis.onLight,
          }}
        >
          About {brand.name.replace(' Co.', '')}
        </span>
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          {brand.tagline}
        </span>
      </div>

      {/* Description */}
      <div style={{ padding: `0 ${spacing.md} ${spacing.md}` }}>
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
            margin: 0,
            lineHeight: '22px',
          }}
        >
          {brand.description}
        </p>
      </div>

      {/* FAQ accordion — DS component, edge-to-edge */}
      <style>{`.brand-accordion h3 { font-size: ${typography.body.md.fontSize} !important; }`}</style>
      <Accordion allowMultiple={false} defaultExpandedIds={['about']} className="brand-accordion">
        {allFaqs.map((faq) => (
          <AccordionItem key={faq.id} id={faq.id} title={faq.question}>
            <p
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.sm.fontSize,
                color: colors.text.lowEmphasis.onLight,
                margin: 0,
                lineHeight: '22px',
              }}
            >
              {faq.answer}
            </p>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Brand website link */}
      <div style={{ padding: spacing.md }}>
        <Link href={brand.website} external size="md">
          Brand Website
        </Link>
      </div>
    </div>
  )
}

const BRAND_TABS: TabItem[] = [
  { id: 'product', label: 'Product Details' },
  { id: 'brand', label: 'About Brand' },
]

/** v2: Wraps any use case with Product + Brand tabs */
function TabbedWrapper({
  productContent,
  brand,
}: {
  productContent: React.ReactNode
  brand: BrandData
}) {
  const [activeTab, setActiveTab] = useState('product')

  return (
    <>
      <div style={{ padding: `0 ${spacing.md}` }}>
        <TabBar
          tabs={BRAND_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stretched
          hasDivider={false}
        />
      </div>

      <div style={{ height: spacing.xs }} />

      {activeTab === 'product' ? (
        <>{productContent}</>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <BrandHero />
          <BrandAboutSection brand={brand} />
        </div>
      )}
    </>
  )
}

/** UC1 v2: Compliance-First with Product + Brand tabs */
function ComplianceFirstViewV2({ product, config, brand }: { product: ProductData; config: StateConfig; brand: BrandData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <ComplianceBanner />
      <TabbedWrapper
        brand={brand}
        productContent={
          <>
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
                {product.brand}
              </span>
              <div style={{ marginTop: spacing.xs }}>
                <LicenseeBadges badges={config.badges} />
              </div>
            </div>
            <div style={{ padding: spacing.md }}><ConsumerEssentials product={product} /></div>
            <div style={{ padding: spacing.md }}><LabResults product={product} /></div>
            <div style={{ padding: spacing.md }}><RetailerInfo product={product} /></div>
            <div style={{ padding: spacing.md }}><PackageDetails product={product} /></div>
            <div style={{ padding: spacing.md }}><StateLinks config={config} /></div>
          </>
        }
      />
    </div>
  )
}

/** UC2 v2: Compliance + Brand with Product + Brand tabs */
function CompliancePlusBrandViewV2({ product, config, brand }: { product: ProductData; config: StateConfig; brand: BrandData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <ComplianceBanner />
      <TabbedWrapper
        brand={brand}
        productContent={
          <>
            <ProductIdentity product={product} showImage />
            <div style={{ padding: spacing.md }}><ConsumerEssentials product={product} /></div>
            <div style={{ padding: spacing.md }}><LabResults product={product} /></div>
            <div style={{ padding: spacing.md }}><RetailerInfo product={product} /></div>
            <div style={{ padding: spacing.md }}><PackageDetails product={product} /></div>
            <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              <SectionHeader>State Information</SectionHeader>
              <p style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight, margin: 0, lineHeight: '20px' }}>
                {config.legalMessage}
              </p>
              <LicenseeBadges badges={config.badges} />
            </div>
            <div style={{ padding: spacing.md }}><StateLinks config={config} /></div>
          </>
        }
      />
    </div>
  )
}

/** UC3 v2: Brand-Forward with Product + Brand tabs */
function BrandForwardViewV2({ product, brand }: { product: ProductData; brand: BrandData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <MinimalHeader label="Metrc Verified" />
      <TabbedWrapper
        brand={brand}
        productContent={
          <>
            <ProductIdentity product={product} showImage />
            <div style={{ padding: spacing.md }}><ConsumerEssentials product={product} /></div>
            <div style={{ padding: spacing.md }}><LabResults product={product} /></div>
            <div style={{ padding: spacing.md }}><PackageDetails product={product} /></div>
          </>
        }
      />
    </div>
  )
}

// =============================================================================
// v3 — ACCORDION PRODUCT DETAILS (new V2 in toolbar)
// =============================================================================

/** Product details with sections collapsed into accordions */
function AccordionProductContent({
  product,
  config,
  showRetailer = true,
  showStateInfo = false,
  showResources = false,
}: {
  product: ProductData
  config?: StateConfig
  showRetailer?: boolean
  showStateInfo?: boolean
  showResources?: boolean
}) {
  const defaultOpen = ['lab-results']

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Consumer essentials stay above the fold — not in accordion */}
      <div style={{ padding: spacing.md }}>
        <ConsumerEssentials product={product} />
      </div>

      {/* View Full COA — above the accordion, edge to edge */}
      <div style={{ padding: `0 ${spacing.md} ${spacing.sm}` }}>
        <Button emphasis="high" size="md" fullWidth onClick={() => window.open(product.coaUrl, '_blank')}>
          View Full COA
        </Button>
      </div>

      {/* Accordion sections */}
      <style>{`.product-accordion h3 { font-size: ${typography.body.md.fontSize} !important; }`}</style>
      <Accordion allowMultiple={false} defaultExpandedIds={defaultOpen} className="product-accordion">
        <AccordionItem id="lab-results" title="Lab Results">
          <div style={{ marginBottom: spacing.sm }}>
            <Badge
              variant="subtle"
              color={product.testStatus === 'passed' ? 'success' : product.testStatus === 'failed' ? 'error' : 'warning'}
              size="sm"
            >
              {product.testStatus === 'passed' ? 'All Tests Passed' : product.testStatus === 'failed' ? 'Failed' : 'Pending'}
            </Badge>
          </div>
          <LabResults product={product} hideCOAButton hideHeader />
        </AccordionItem>

        {showStateInfo && config && (
          <AccordionItem id="state-info" title="State Information">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              <p style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight, margin: 0, lineHeight: '20px' }}>
                {config.legalMessage}
              </p>
              <LicenseeBadges badges={config.badges} />
              <Link href={config.agencyUrl} external size="md">
                {config.agencyName}
              </Link>
            </div>
          </AccordionItem>
        )}

        <AccordionItem id="package-details" title="Package Details">
          <PackageDetails product={product} hideHeader />
        </AccordionItem>

        {showRetailer && (
          <AccordionItem id="retailer" title="Retailer">
            <RetailerInfo product={product} hideHeader />
          </AccordionItem>
        )}

        {showResources && config && (
          <AccordionItem id="resources" title="Resources">
            <StateLinks config={config} hideHeader />
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}

/** UC1 v3: Compliance-First with accordion product sections */
function ComplianceFirstViewV3({ product, config, brand }: { product: ProductData; config: StateConfig; brand: BrandData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <ComplianceBanner />
      <TabbedWrapper
        brand={brand}
        productContent={
          <>
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
                {product.brand}
              </span>
              <div style={{ marginTop: spacing.xs }}>
                <LicenseeBadges badges={config.badges} />
              </div>
            </div>
            <AccordionProductContent product={product} config={config} showRetailer showResources />
          </>
        }
      />
    </div>
  )
}

/** UC2 v3: Compliance + Brand with accordion product sections */
function CompliancePlusBrandViewV3({ product, config, brand }: { product: ProductData; config: StateConfig; brand: BrandData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <ComplianceBanner />
      <TabbedWrapper
        brand={brand}
        productContent={
          <>
            <ProductIdentity product={product} showImage />
            <AccordionProductContent product={product} config={config} showRetailer showStateInfo showResources />
          </>
        }
      />
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
  const [activeVersion, setActiveVersion] = useState(1)
  const [viewState, setViewState] = useState<ViewState>('default')
  const [activeUseCase, setActiveUseCase] = useState(0)

  const handleVersionChange = (index: number) => {
    setActiveVersion(index)
    setViewState('default')
    // V2 (Accordion) defaults to UC1 — Compliance + Brand
    setActiveUseCase(0)
  }

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

      {/* v1 — Tabbed (Product + Brand tabs, scrolling sections) */}
      {viewState === 'default' && activeVersion === 0 && activeUseCase === 0 && (
        <ComplianceFirstViewV2 product={sampleProduct} config={massachusettsConfig} brand={sampleBrand} />
      )}
      {viewState === 'default' && activeVersion === 0 && activeUseCase === 1 && (
        <CompliancePlusBrandViewV2 product={sampleProduct} config={massachusettsConfig} brand={sampleBrand} />
      )}
      {viewState === 'default' && activeVersion === 0 && activeUseCase === 2 && (
        <BrandForwardViewV2 product={sampleProduct} brand={sampleBrand} />
      )}

      {/* v2 — Accordion (Product sections in accordions, defaults to UC1) */}
      {viewState === 'default' && activeVersion === 1 && activeUseCase === 0 && (
        <CompliancePlusBrandViewV3 product={sampleProduct} config={massachusettsConfig} brand={sampleBrand} />
      )}
      {viewState === 'default' && activeVersion === 1 && activeUseCase === 1 && (
        <ComplianceFirstViewV3 product={sampleProduct} config={massachusettsConfig} brand={sampleBrand} />
      )}

      <PrototypeToolbar
        viewState={viewState}
        onViewStateChange={setViewState}
        versions={VERSIONS}
        activeVersion={activeVersion}
        onVersionChange={handleVersionChange}
        useCases={USE_CASES}
        activeUseCase={activeUseCase}
        onUseCaseChange={setActiveUseCase}
      />
    </>
  )
}
