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
import { sampleProduct } from '../data'
import type { ProductData, LabResult, SupplyChainStep } from '../data'

// =============================================================================
// Category & strain type color maps
// =============================================================================

const categoryColorMap: Record<string, BadgeProps['color']> = {
  Flower: 'success',
  Concentrate: 'info',
  Edible: 'warning',
  'Pre-Roll': 'neutral',
  Tincture: 'brand',
  Topical: 'error',
  Capsule: 'neutral',
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

function PotencyBar({
  label,
  value,
  maxValue,
  color,
}: {
  label: string
  value: string
  maxValue: number
  color: string
}) {
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

function LabResultRow({ test }: { test: LabResult }) {
  return (
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
  )
}

function SupplyChainTimeline({ steps }: { steps: SupplyChainStep[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const isCurrent = step.status === 'current'

        return (
          <div
            key={`${step.role}-${index}`}
            style={{
              display: 'flex',
              gap: spacing.sm,
              paddingBottom: isLast ? 0 : spacing.md,
              position: 'relative',
            }}
          >
            {/* Timeline line + dot */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '20px',
                flexShrink: 0,
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: isCurrent ? '12px' : '10px',
                  height: isCurrent ? '12px' : '10px',
                  borderRadius: '50%',
                  backgroundColor: isCurrent ? colors.brand.default : colors.status.success,
                  border: isCurrent ? `3px solid ${colors.brand.lighter}` : 'none',
                  flexShrink: 0,
                  marginTop: '4px',
                }}
              />
              {!isLast && (
                <div
                  aria-hidden="true"
                  style={{
                    width: '2px',
                    flex: 1,
                    backgroundColor: colors.border.lowEmphasis.onLight,
                    marginTop: spacing['2xs'],
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.label.sm.fontSize,
                  fontWeight: fontWeights.medium,
                  color: colors.text.lowEmphasis.onLight,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.5px',
                }}
              >
                {step.role}
              </span>
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.md.fontSize,
                  fontWeight: fontWeights.medium,
                  color: colors.text.highEmphasis.onLight,
                }}
              >
                {step.facilityName}
              </span>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: spacing.xs,
                }}
              >
                <span
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.body.xs.fontSize,
                    color: colors.text.lowEmphasis.onLight,
                  }}
                >
                  {step.location}
                </span>
                <span
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.body.xs.fontSize,
                    color: colors.text.lowEmphasis.onLight,
                    flexShrink: 0,
                  }}
                >
                  {step.date}
                </span>
              </div>
              <span
                style={{
                  fontFamily: fontFamilies.mono,
                  fontSize: typography.body.xs.fontSize,
                  color: colors.text.disabled.onLight,
                }}
              >
                {step.licenseNumber}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// =============================================================================
// Loading State
// =============================================================================

function LoadingState() {
  return (
    <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
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
// Product Detail Content
// =============================================================================

function ProductDetail({ product }: { product: ProductData }) {
  const [labExpanded, setLabExpanded] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Product image */}
      <div
        style={{
          width: '100%',
          height: '220px',
          overflow: 'hidden',
          backgroundColor: colors.surface.lightDarker,
        }}
      >
        <img
          src="/prototypes/qr-verify/product-photo.png"
          alt={`Photo of ${product.name}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Product identity */}
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
        <div style={{ display: 'flex', gap: spacing['2xs'], flexWrap: 'wrap', marginTop: spacing['2xs'] }}>
          <Badge variant="subtle" color="neutral" size="sm">
            {product.category}
          </Badge>
          <Badge variant="subtle" color="neutral" size="sm">
            {product.strainType}
          </Badge>
          <Badge variant="subtle" color="neutral" size="sm">
            {product.strain}
          </Badge>
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

      <Divider spacing="none" />

      {/* Potency section */}
      <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <SectionHeader>Potency</SectionHeader>
        <PotencyBar label="THC" value={product.thc} maxValue={35} color={colors.brand.default} />
        <PotencyBar label="CBD" value={product.cbd} maxValue={25} color={colors.brand.default} />
        <PotencyBar label="Terpenes" value={product.terpenes} maxValue={10} color={colors.brand.default} />
      </div>

      <Divider spacing="none" />

      {/* Lab results section */}
      <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SectionHeader>Lab Results</SectionHeader>
          <Badge
            variant="subtle"
            color={product.testStatus === 'passed' ? 'success' : product.testStatus === 'failed' ? 'error' : 'warning'}
            size="md"
          >
            {product.testStatus === 'passed' ? 'All Tests Passed' : product.testStatus === 'failed' ? 'Failed' : 'Pending'}
          </Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <DetailField label="Tested by" value={product.labName} />
          <DetailField label="Test date" value={product.testDate} />
          <DetailField label="License" value={product.labLicense} mono />
        </div>

        {/* Expandable test list */}
        <button
          onClick={() => setLabExpanded(!labExpanded)}
          aria-expanded={labExpanded}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: `${spacing.xs} ${spacing.sm}`,
            backgroundColor: colors.surface.lightDarker,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadiusSemantics.button,
            cursor: 'pointer',
            fontFamily: fontFamilies.body,
            fontSize: typography.label.md.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.brand.default,
            transition: 'background-color 200ms ease-out',
          }}
        >
          {labExpanded ? 'Hide detailed results' : `View all ${product.labResults.length} test results`}
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            style={{
              transform: labExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease-out',
            }}
          >
            <path d="M4 6l4 4 4-4" stroke={colors.brand.default} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {labExpanded && (
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
                <LabResultRow test={test} />
                {index < product.labResults.length - 1 && <Divider spacing="none" />}
              </React.Fragment>
            ))}
          </div>
        )}

        <a
          href={product.coaUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: `calc(${spacing.md} - ${spacing.sm})`,
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
          <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 12l8-8M4 4h8v8" stroke={colors.brand.default} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          View Certificate of Analysis (CoA)
        </a>
      </div>

      <Divider spacing="none" />

      {/* Supply chain */}
      <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <SectionHeader>Supply Chain Journey</SectionHeader>
        <SupplyChainTimeline steps={product.supplyChain} />
      </div>

      <Divider spacing="none" />

      {/* Package details */}
      <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <SectionHeader>Package Details</SectionHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, marginTop: spacing['2xs'] }}>
          <DetailField label="Package Tag" value={product.packageTag} mono />
          <DetailField label="Batch ID" value={product.batchId} mono />
          <DetailField label="Net Weight" value={product.weight} />
          <DetailField label="Harvest Date" value={product.harvestDate} />
          <DetailField label="Package Date" value={product.packageDate} />
          <DetailField label="Best By" value={product.expirationDate} />
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Page Component
// =============================================================================

export default function ProductPage() {
  const [viewState, setViewState] = useState<ViewState>('default')

  return (
    <>
      {/* Content */}
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

      {viewState === 'default' && <ProductDetail product={sampleProduct} />}
      <PrototypeToolbar viewState={viewState} onViewStateChange={setViewState} />
    </>
  )
}
