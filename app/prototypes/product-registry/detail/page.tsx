'use client'

import React, { useState } from 'react'
import { PrototypeToolbar, ViewState } from '@/app/prototypes/PrototypeToolbar'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
  shadowSemantics,
  transitionPresets,
  breakpoints,
} from '@/styles/design-tokens'
import {
  Badge,
  Button,
  TabBar,
  Tab,
  DetailField,
  Skeleton,
  EmptyState,
  DataTable,
  ConfirmDialog,
  Toast,
  useToast,
  Divider,
} from '@/components'
import { products } from '../data'
import type { DataTableColumn } from '@/components'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

export default function DetailPage() {
  const [viewState, setViewState] = useState<ViewState>('default')
  const [activeTab, setActiveTab] = useState('basic')
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const toast = useToast()
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  // Use first product as demo or get from URL params
  const product = products[0]
  const bundleProduct = products.find((p) => p.isBundle)

  // Show the bundle for richer demo if on bundle tab
  const displayProduct = activeTab === 'bundle' && bundleProduct ? bundleProduct : product

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'identifiers', label: 'Identifiers' },
    { id: 'specs', label: 'Specifications' },
    { id: 'markets', label: 'Markets' },
    { id: 'bundle', label: 'Bundle Components' },
  ]

  const marketColumns: DataTableColumn<(typeof product.markets)[0]>[] = [
    {
      key: 'marketId',
      header: 'Market',
      sortable: true,
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.medium }}>
          {row.marketId}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Availability',
      sortable: true,
      render: (row) => (
        <Badge
          color={row.status === 'available' ? 'success' : row.status === 'pending' ? 'warning' : 'error'}
          variant="subtle"
          size="sm"
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
  ]

  const bundleColumns: DataTableColumn<NonNullable<typeof product.bundleComponents>[0]>[] = [
    {
      key: 'productName',
      header: 'Component Product',
      render: (row) => (
        <a
          href={`/prototypes/product-registry/detail?id=${row.productId}`}
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.text.action.enabled,
            textDecoration: 'none',
          }}
        >
          {row.productName}
        </a>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>
          {row.quantity}x
        </span>
      ),
    },
  ]

  const sectionStyle: React.CSSProperties = {
    backgroundColor: colors.surface.light,
    borderRadius: borderRadiusSemantics.card,
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
    boxShadow: shadowSemantics.card,
    padding: isMobile ? spacing.md : spacing.xl,
  }

  const fieldGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: spacing.lg,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
      {/* Back nav */}
      <a
        href="/prototypes/product-registry/catalog"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing['2xs'],
          fontFamily: fontFamilies.body,
          fontSize: typography.body.sm.fontSize,
          fontWeight: fontWeights.medium,
          color: colors.text.action.enabled,
          textDecoration: 'none',
          transition: `color ${transitionPresets.fast}`,
        }}
      >
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Products
      </a>

      {/* Loading state */}
      {viewState === 'loading' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg }}>
              <Skeleton width={80} height={80} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                <Skeleton width="50%" height={28} />
                <Skeleton width="30%" height={16} />
                <div style={{ display: 'flex', gap: spacing.xs }}>
                  <Skeleton width={60} height={24} />
                  <Skeleton width={50} height={24} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: spacing.xs }}>
                <Skeleton width={80} height={40} />
                <Skeleton width={80} height={40} />
              </div>
            </div>
          </div>
          <Skeleton width="100%" height={48} />
          <div style={sectionStyle}>
            <div style={fieldGridStyle}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
                  <Skeleton width="40%" height={14} />
                  <Skeleton width="70%" height={18} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {viewState === 'error' && (
        <div
          style={{
            ...sectionStyle,
            backgroundColor: colors.surface.important,
            borderColor: colors.surfaceBorder.important,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.md,
            textAlign: 'center',
            padding: spacing['2xl'],
          }}
        >
          <svg width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="18" stroke={colors.status.important} strokeWidth="2" />
            <path d="M20 12V22M20 26V28" stroke={colors.status.important} strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3
            style={{
              fontFamily: fontFamilies.display,
              fontSize: typography.heading.h5.fontSize,
              fontWeight: fontWeights.semibold,
              color: colors.text.important,
              margin: 0,
            }}
          >
            Product not found
          </h3>
          <p
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
              margin: 0,
            }}
          >
            The product you're looking for may have been removed or you don't have permission to view it.
          </p>
          <Button emphasis="high" size="md" onClick={() => setViewState('default')}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty state — archived product */}
      {viewState === 'empty' && (
        <div style={sectionStyle}>
          <EmptyState
            aria-label="Archived product"
            icon={
              <svg width={48} height={48} viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <rect x="6" y="6" width="36" height="36" rx="4" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" strokeDasharray="4 4" />
                <path d="M18 24H30M24 18V30" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            title="This product has been archived"
            description="Archived products are no longer active in connected systems. You can view its details but editing is disabled."
          >
            <div style={{ display: 'flex', gap: spacing.xs }}>
              <Button emphasis="mid" size="md" onClick={() => setViewState('default')}>
                View Details
              </Button>
              <Button
                emphasis="high"
                size="md"
                onClick={() => (window.location.href = '/prototypes/product-registry/catalog')}
              >
                Back to Catalog
              </Button>
            </div>
          </EmptyState>
        </div>
      )}

      {/* Default state */}
      {viewState === 'default' && (
        <>
          {/* Product header card */}
          <div style={sectionStyle}>
            <div
              style={{
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'center',
                flexDirection: isMobile ? 'column' : 'row',
                gap: spacing.lg,
              }}
            >
              {/* Thumbnail placeholder */}
              <div
                style={{
                  width: isMobile ? '64px' : '80px',
                  height: isMobile ? '64px' : '80px',
                  borderRadius: borderRadiusSemantics.card,
                  backgroundColor: colors.surface.lightDarker,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '28px',
                }}
                aria-hidden="true"
              >
                {displayProduct.category === 'flower' && '🌿'}
                {displayProduct.category === 'concentrate' && '💧'}
                {displayProduct.category === 'edible' && '🍬'}
                {displayProduct.category === 'pre-roll' && '🚬'}
              </div>

              {/* Product info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' }}>
                  <h1
                    style={{
                      fontFamily: fontFamilies.display,
                      fontSize: isMobile ? typography.heading.h4.fontSize : typography.heading.h3.fontSize,
                      fontWeight: fontWeights.semibold,
                      color: colors.text.highEmphasis.onLight,
                      margin: 0,
                    }}
                  >
                    {displayProduct.name}
                  </h1>
                  {displayProduct.isBundle && (
                    <Badge color="info" variant="filled" size="sm">
                      Bundle
                    </Badge>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    marginTop: spacing['2xs'],
                    flexWrap: 'wrap',
                  }}
                >
                  <Badge
                    color={displayProduct.status === 'active' ? 'success' : 'neutral'}
                    variant={displayProduct.status === 'active' ? 'filled' : 'outlined'}
                    size="sm"
                  >
                    {displayProduct.status === 'active' ? 'Active' : 'Archived'}
                  </Badge>
                  <span
                    style={{
                      fontFamily: fontFamilies.body,
                      fontSize: typography.body.sm.fontSize,
                      color: colors.text.lowEmphasis.onLight,
                    }}
                  >
                    {displayProduct.category.charAt(0).toUpperCase() + displayProduct.category.slice(1)} · {displayProduct.type.charAt(0).toUpperCase() + displayProduct.type.slice(1)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: spacing.xs, flexShrink: 0 }}>
                <Button emphasis="high" size="md">
                  Edit
                </Button>
                <Button
                  emphasis="low"
                  size="md"
                  destructive
                  onClick={() => setShowArchiveDialog(true)}
                >
                  Archive
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <TabBar
            tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label }))}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            align="left"
          />

          {/* Tab content */}
          <div style={sectionStyle}>
            {activeTab === 'basic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
                <p
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.body.md.fontSize,
                    lineHeight: typography.body.md.lineHeight,
                    color: colors.text.highEmphasis.onLight,
                    margin: 0,
                  }}
                >
                  {displayProduct.description}
                </p>
                <Divider />
                <div style={fieldGridStyle}>
                  <DetailField label="Product Name" value={displayProduct.name} />
                  <DetailField label="Category" value={displayProduct.category.charAt(0).toUpperCase() + displayProduct.category.slice(1)} />
                  <DetailField label="Type" value={displayProduct.type.charAt(0).toUpperCase() + displayProduct.type.slice(1)} />
                  <DetailField label="SKU" value={displayProduct.sku} mono />
                  <DetailField label="Status" value={displayProduct.status.charAt(0).toUpperCase() + displayProduct.status.slice(1)} />
                  <DetailField label="Brand" value="Pacific Coast Extracts" />
                  <DetailField
                    label="Created"
                    value={new Date(displayProduct.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  />
                  <DetailField
                    label="Last Updated"
                    value={new Date(displayProduct.updatedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'identifiers' && (
              <div style={fieldGridStyle}>
                <DetailField label="Registry ID" value={displayProduct.retailId} mono />
                <DetailField label="UPC/EAN" value={displayProduct.upc || 'Not set'} mono />
                <DetailField label="SKU" value={displayProduct.sku} mono />
                <DetailField label="Compliance Item IDs" value="CII-CA-001234, CII-OR-005678" mono />
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
                <div style={fieldGridStyle}>
                  <DetailField label="THC Content" value={displayProduct.thcContent} />
                  <DetailField label="CBD Content" value={displayProduct.cbdContent} />
                  <DetailField label="Weight" value={displayProduct.weight} />
                </div>
                <Divider />
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                  <DetailField label="Ingredients" value={displayProduct.ingredients} />
                  <DetailField
                    label="Allergens"
                    value={displayProduct.allergens.length > 0 ? displayProduct.allergens.join(', ') : 'None'}
                  />
                </div>
              </div>
            )}

            {activeTab === 'markets' && (
              <DataTable
                columns={marketColumns}
                data={displayProduct.markets}
                rowKey={(row) => row.marketId}
                density="compact"
              />
            )}

            {activeTab === 'bundle' && (
              <>
                {bundleProduct?.bundleComponents ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    <p
                      style={{
                        fontFamily: fontFamilies.body,
                        fontSize: typography.body.sm.fontSize,
                        color: colors.text.lowEmphasis.onLight,
                        margin: 0,
                      }}
                    >
                      This bundle contains {bundleProduct.bundleComponents.length} component products.
                    </p>
                    <DataTable
                      columns={bundleColumns}
                      data={bundleProduct.bundleComponents}
                      rowKey={(row) => row.productId}
                      density="compact"
                    />
                  </div>
                ) : (
                  <EmptyState
                    aria-label="Not a bundle"
                    title="Not a bundle product"
                    description="This is a single product. Bundle components are only shown for bundle products."
                  />
                )}
              </>
            )}
          </div>

          {/* Archive confirmation dialog */}
          <ConfirmDialog
            open={showArchiveDialog}
            title={`Archive "${displayProduct.name}"?`}
            description="Archiving this product will mark it as inactive across all connected systems. This action can be reversed by an admin."
            confirmLabel="Archive"
            cancelLabel="Cancel"
            variant="destructive"
            onConfirm={() => {
              setShowArchiveDialog(false)
              toast.success(`"${displayProduct.name}" has been archived.`)
            }}
            onCancel={() => setShowArchiveDialog(false)}
          />

          {/* Toast container */}
          {toast.toasts.map((t) => (
            <Toast
              key={t.id}
              variant={t.variant}
              message={t.message}
              isVisible
              onClose={() => toast.dismiss(t.id)}
            />
          ))}
        </>
      )}
      <PrototypeToolbar viewState={viewState} onViewStateChange={setViewState} />
    </div>
  )
}
