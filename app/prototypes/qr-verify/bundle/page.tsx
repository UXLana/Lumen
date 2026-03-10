'use client'

import React, { useState } from 'react'
import { PrototypeToolbar, ViewState } from '@/app/prototypes/PrototypeToolbar'
import {
  colors,
  spacing,
  fontFamilies,
  fontWeights,
  typography,
  borderRadius,
  borderRadiusSemantics,
} from '@/styles/design-tokens'
import { Badge, DetailField, Divider, Skeleton, EmptyState, Button } from '@/components'
import type { BadgeProps } from '@/components'
import { sampleBundle } from '../data'
import type { BundleData, ProductData } from '../data'

// =============================================================================
// Color maps
// =============================================================================

const categoryColorMap: Record<string, BadgeProps['color']> = {
  Flower: 'success',
  Concentrate: 'info',
  Edible: 'warning',
  'Pre-Roll': 'neutral',
  Tincture: 'brand',
  Topical: 'error',
}

const strainTypeColorMap: Record<string, BadgeProps['color']> = {
  Indica: 'info',
  Sativa: 'success',
  Hybrid: 'warning',
}

// =============================================================================
// Sub-components
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

function BundleProductCard({
  product,
  expanded,
  onToggle,
}: {
  product: ProductData
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div
      style={{
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadiusSemantics.card,
        overflow: 'hidden',
        transition: 'border-color 200ms ease-out',
      }}
    >
      {/* Card header — always visible */}
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
          width: '100%',
          padding: spacing.sm,
          backgroundColor: expanded ? colors.surface.lightDarker : colors.surface.light,
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: fontFamilies.body,
          transition: 'background-color 200ms ease-out',
        }}
      >
        {/* Product thumbnail placeholder */}
        <div
          aria-hidden="true"
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: colors.surface.lightDarker,
            borderRadius: borderRadius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke={colors.text.disabled.onLight} strokeWidth="1.5" />
            <circle cx="8.5" cy="8.5" r="2" stroke={colors.text.disabled.onLight} strokeWidth="1.5" />
            <path d="M21 15l-5-5L5 21" stroke={colors.text.disabled.onLight} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Product info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: typography.body.md.fontSize,
              fontWeight: fontWeights.medium,
              color: colors.text.highEmphasis.onLight,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.name}
          </span>
          <div style={{ display: 'flex', gap: spacing['2xs'], alignItems: 'center' }}>
            <Badge variant="outlined" color={categoryColorMap[product.category] || 'neutral'} size="sm">
              {product.category}
            </Badge>
            <span
              style={{
                fontSize: typography.body.xs.fontSize,
                color: colors.text.lowEmphasis.onLight,
              }}
            >
              {product.weight}
            </span>
          </div>
        </div>

        {/* Expand chevron */}
        <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease-out',
          }}
        >
          <path d="M4 6l4 4 4-4" stroke={colors.text.lowEmphasis.onLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div
          style={{
            padding: spacing.sm,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
            borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }}
        >
          <p
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
              margin: 0,
              lineHeight: '20px',
            }}
          >
            {product.description}
          </p>

          {/* Potency row */}
          <div
            style={{
              display: 'flex',
              gap: spacing.md,
              padding: spacing.xs,
              backgroundColor: colors.surface.lightDarker,
              borderRadius: borderRadius.sm,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.xs.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                }}
              >
                THC
              </span>
              <span
                style={{
                  fontFamily: fontFamilies.display,
                  fontSize: typography.heading.h6.fontSize,
                  fontWeight: fontWeights.bold,
                  color: colors.text.highEmphasis.onLight,
                }}
              >
                {product.thc}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.xs.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                }}
              >
                CBD
              </span>
              <span
                style={{
                  fontFamily: fontFamilies.display,
                  fontSize: typography.heading.h6.fontSize,
                  fontWeight: fontWeights.bold,
                  color: colors.text.highEmphasis.onLight,
                }}
              >
                {product.cbd}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.xs.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                }}
              >
                Terpenes
              </span>
              <span
                style={{
                  fontFamily: fontFamilies.display,
                  fontSize: typography.heading.h6.fontSize,
                  fontWeight: fontWeights.bold,
                  color: colors.text.highEmphasis.onLight,
                }}
              >
                {product.terpenes}
              </span>
            </div>
          </div>

          {/* Badges row */}
          <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
            <Badge variant="outlined" color={strainTypeColorMap[product.strainType] || 'neutral'} size="sm">
              {product.strainType}
            </Badge>
            <Badge variant="outlined" color="neutral" size="sm">
              {product.strain}
            </Badge>
            <Badge
              variant="filled"
              color={product.testStatus === 'passed' ? 'success' : 'warning'}
              size="sm"
            >
              {product.testStatus === 'passed' ? 'Lab Tested' : 'Pending'}
            </Badge>
          </div>

          {/* Package info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
            <DetailField label="Package Tag" value={product.packageTag} mono />
            <DetailField label="Batch" value={product.batchId} mono />
          </div>

          {/* Link to full detail */}
          <a
            href={`/prototypes/qr-verify/product?id=${product.id}`}
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.sm.fontSize,
              fontWeight: fontWeights.medium,
              color: colors.brand.default,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: spacing['2xs'],
            }}
          >
            View full product details
            <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4l4 4-4 4" stroke={colors.brand.default} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Loading State
// =============================================================================

function LoadingState() {
  return (
    <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <Skeleton width="70%" height={28} />
        <Skeleton width="50%" height={16} />
      </div>
      <Skeleton variant="rectangular" height={80} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <Skeleton width="40%" height={18} />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={60} />
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// Bundle Detail Content
// =============================================================================

function BundleDetail({ bundle }: { bundle: BundleData }) {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Bundle header */}
      <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <Badge variant="filled" color="brand" size="md">
            Bundle
          </Badge>
          <Badge variant="outlined" color="neutral" size="md">
            {bundle.totalItems} items
          </Badge>
        </div>
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
          {bundle.name}
        </h1>
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.md.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          by {bundle.brand}
        </span>
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
            margin: `${spacing['2xs']} 0 0`,
            lineHeight: '20px',
          }}
        >
          {bundle.description}
        </p>
      </div>

      <Divider spacing="none" />

      {/* Verification summary */}
      <div
        style={{
          padding: spacing.md,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
          backgroundColor: colors.surface.lightDarker,
        }}
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={colors.status.success} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" stroke={colors.status.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.md.fontSize,
              fontWeight: fontWeights.medium,
              color: colors.text.highEmphasis.onLight,
            }}
          >
            All products verified
          </span>
          <span
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.xs.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            {bundle.totalItems} of {bundle.totalItems} items passed lab testing
          </span>
        </div>
      </div>

      <Divider spacing="none" />

      {/* Products list */}
      <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <SectionHeader>What&apos;s Inside</SectionHeader>
        {bundle.products.map((product) => (
          <BundleProductCard
            key={product.id}
            product={product}
            expanded={expandedProduct === product.id}
            onToggle={() =>
              setExpandedProduct(expandedProduct === product.id ? null : product.id)
            }
          />
        ))}
      </div>

      <Divider spacing="none" />

      {/* Bundle package info */}
      <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <SectionHeader>Bundle Details</SectionHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, marginTop: spacing['2xs'] }}>
          <DetailField label="Bundle Tag" value={bundle.packageTag} mono />
          <DetailField label="Packaged On" value={bundle.packageDate} />
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Page Component
// =============================================================================

export default function BundlePage() {
  const [viewState, setViewState] = useState<ViewState>('default')

  return (
    <>
      {viewState === 'loading' && <LoadingState />}

      {viewState === 'empty' && (
        <EmptyState
          title="Bundle Not Found"
          description="This QR code does not match any bundle in our system. It may have been recalled or the code may be invalid."
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
          description="We're unable to verify this bundle right now. Please check your connection and try again."
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

      {viewState === 'default' && <BundleDetail bundle={sampleBundle} />}
      <PrototypeToolbar viewState={viewState} onViewStateChange={setViewState} />
    </>
  )
}
