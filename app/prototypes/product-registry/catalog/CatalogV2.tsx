'use client'

import React, { useState, useMemo } from 'react'
import type { ViewState } from '@/app/prototypes/PrototypeToolbar'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadius,
  borderRadiusSemantics,
  transitionPresets,
  breakpoints,
} from '@/styles/design-tokens'
import { Badge, Button, Input, DataTable, Skeleton, EmptyState } from '@/components'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import type { BadgeProps } from '@/components/Badge/Badge'
import type { DataTableColumn, DataTableDisplay } from '@/components'
import { products, categories, statusOptions } from '../data'

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

// ---------------------------------------------------------------------------
// Category chip tabs — horizontal scrollable filter
// ---------------------------------------------------------------------------
function CategoryChips({
  active,
  onChange,
  counts,
}: {
  active: string
  onChange: (val: string) => void
  counts: Record<string, number>
}) {
  const allCount = products.length
  const items = [{ value: 'all', label: 'All', count: allCount }, ...categories.map((c) => ({ ...c, count: counts[c.value] || 0 }))]

  return (
    <div
      role="tablist"
      aria-label="Filter by category"
      style={{
        display: 'flex',
        gap: spacing.xs,
        overflowX: 'auto',
        paddingBottom: spacing['2xs'],
        scrollbarWidth: 'none',
      }}
    >
      {items.map((item) => {
        const isActive = active === item.value
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing['2xs'],
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.full,
              border: `1px solid ${isActive ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
              backgroundColor: isActive ? colors.brand.default : colors.surface.light,
              color: isActive ? colors.text.highEmphasis.onDark : colors.text.highEmphasis.onLight,
              fontFamily: fontFamilies.body,
              fontSize: typography.label.sm.fontSize,
              fontWeight: isActive ? fontWeights.semibold : fontWeights.medium,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: `all ${transitionPresets.fast}`,
              flexShrink: 0,
            }}
          >
            {item.label}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
                height: '20px',
                borderRadius: borderRadius.full,
                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : colors.surface.lightDarker,
                fontSize: typography.body.xs.fontSize,
                fontWeight: fontWeights.semibold,
                padding: `0 ${spacing['2xs']}`,
              }}
            >
              {item.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mini stat pill — inline stat indicators
// ---------------------------------------------------------------------------
function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xs,
        padding: `${spacing.xs} ${spacing.md}`,
        backgroundColor: colors.surface.light,
        borderRadius: borderRadiusSemantics.card,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
      }}
    >
      <span style={{ display: 'flex', color: colors.brand.default }}>{icon}</span>
      <span
        style={{
          fontFamily: fontFamilies.body,
          fontSize: typography.body.xs.fontSize,
          color: colors.text.lowEmphasis.onLight,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: fontFamilies.display,
          fontSize: typography.body.md.fontSize,
          fontWeight: fontWeights.bold,
          color: colors.text.highEmphasis.onLight,
        }}
      >
        {value}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Product row with inline quick-actions
// ---------------------------------------------------------------------------
function ProductRow({ product, isMobile }: { product: (typeof products)[0]; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false)

  const categoryColorMap: Record<string, BadgeProps['color']> = {
    flower: 'success',
    concentrate: 'info',
    edible: 'warning',
    'pre-roll': 'neutral',
    tincture: 'brand',
    topical: 'error',
    capsule: 'neutral',
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => (window.location.href = `/prototypes/product-registry/detail?id=${product.id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        padding: `${spacing.sm} ${spacing.md}`,
        backgroundColor: hovered ? colors.hover.onLight : 'transparent',
        borderRadius: borderRadiusSemantics.card,
        cursor: 'pointer',
        transition: `background-color ${transitionPresets.fast}`,
      }}
    >
      {/* Category dot */}
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: borderRadius.full,
          backgroundColor: colors.brand.default,
          flexShrink: 0,
        }}
        aria-hidden="true"
      />

      {/* Product info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            marginTop: '2px',
          }}
        >
          <span
            style={{
              fontFamily: fontFamilies.mono,
              fontSize: typography.body.xs.fontSize,
              color: colors.text.lowEmphasis.onLight,
              letterSpacing: '0.3px',
            }}
          >
            {product.sku}
          </span>
          {product.thcContent && (
            <>
              <span style={{ color: colors.border.midEmphasis.onLight, fontSize: '10px' }}>|</span>
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.xs.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                }}
              >
                {product.thcContent} THC
              </span>
            </>
          )}
        </div>
      </div>

      {/* Badges */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: spacing['2xs'], alignItems: 'center', flexShrink: 0 }}>
          <Badge color={categoryColorMap[product.category] || 'neutral'} variant="outlined" size="sm">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Badge>
          {product.isBundle && (
            <Badge color="info" variant="filled" size="sm">Bundle</Badge>
          )}
          <Badge
            color={product.status === 'active' ? 'success' : 'neutral'}
            variant="filled"
            size="sm"
          >
            {product.status === 'active' ? 'Active' : 'Archived'}
          </Badge>
        </div>
      )}

      {/* Markets count */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing['2xs'],
          flexShrink: 0,
          minWidth: '60px',
        }}
      >
        <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: colors.icon.enabled.onLight }}>
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2 8H14M8 1.5C6 4 6 12 8 14.5M8 1.5C10 4 10 12 8 14.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.xs.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          {product.markets.length}
        </span>
      </div>

      {/* Quick action arrow */}
      <svg
        width={16}
        height={16}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        style={{
          color: hovered ? colors.text.highEmphasis.onLight : colors.border.midEmphasis.onLight,
          transition: `color ${transitionPresets.fast}`,
          flexShrink: 0,
        }}
      >
        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CATALOG V2
// ---------------------------------------------------------------------------
export default function CatalogV2({ viewState }: { viewState: ViewState }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [display, setDisplay] = useState<DataTableDisplay>('table')
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  // Category counts for chips
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchQuery, categoryFilter, statusFilter])

  const activeCount = products.filter((p) => p.status === 'active').length
  const bundleCount = products.filter((p) => p.isBundle).length
  const uniqueMarkets = new Set(products.flatMap((p) => p.markets.map((m) => m.marketId)))

  // Table columns for DataTable mode
  const columns: DataTableColumn<(typeof products)[0]>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <a
            href={`/prototypes/product-registry/detail?id=${row.id}`}
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.sm.fontSize,
              fontWeight: fontWeights.semibold,
              color: colors.text.action.enabled,
              textDecoration: 'none',
            }}
          >
            {row.name}
          </a>
          <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.xs.fontSize, color: colors.text.lowEmphasis.onLight }}>
            {row.sku}
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (row) => {
        const map: Record<string, BadgeProps['color']> = { flower: 'success', concentrate: 'info', edible: 'warning', 'pre-roll': 'neutral', tincture: 'brand', topical: 'error', capsule: 'neutral' }
        return <Badge color={map[row.category] || 'neutral'} variant="outlined" size="sm">{row.category.charAt(0).toUpperCase() + row.category.slice(1)}</Badge>
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <Badge color={row.status === 'active' ? 'success' : 'neutral'} variant="filled" size="sm">{row.status === 'active' ? 'Active' : 'Archived'}</Badge>,
    },
    {
      key: 'markets' as any,
      header: 'Markets',
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
          {row.markets.filter((m) => m.status === 'available').length}/{row.markets.length} active
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      sortable: true,
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
          {new Date(row.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* Page header — compact with inline actions */}
      <div
        style={{
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          gap: spacing.md,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: fontFamilies.display,
              fontSize: isMobile ? typography.heading.h3.fontSize : typography.heading.h2.fontSize,
              fontWeight: fontWeights.bold,
              lineHeight: typography.heading.h2.lineHeight,
              letterSpacing: typography.heading.h2.letterSpacing,
              color: colors.text.highEmphasis.onLight,
              margin: 0,
            }}
          >
            Products
          </h1>
          <p
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.md.fontSize,
              color: colors.text.lowEmphasis.onLight,
              margin: `${spacing['2xs']} 0 0`,
            }}
          >
            Manage your product catalog for Pacific Coast Extracts
          </p>
        </div>
        <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
          <Button
            emphasis="mid"
            size="lg"
            leftIcon={
              <svg width={18} height={18} viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="6" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            }
          >
            Create Bundle
          </Button>
          <Button
            emphasis="high"
            size="lg"
            leftIcon={
              <svg width={18} height={18} viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            onClick={() => (window.location.href = '/prototypes/product-registry/create')}
          >
            Create Product
          </Button>
        </div>
      </div>

      {/* Inline stat pills */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
          <StatPill
            icon={<svg width={14} height={14} viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M5 8H11M5 11H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}
            label="Total"
            value={products.length}
          />
          <StatPill
            icon={<svg width={14} height={14} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            label="Active"
            value={activeCount}
          />
          <StatPill
            icon={<svg width={14} height={14} viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" /><rect x="9.5" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" /><rect x="5.5" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" /></svg>}
            label="Bundles"
            value={bundleCount}
          />
          <StatPill
            icon={<svg width={14} height={14} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" /><path d="M2 8H14M8 2C6 4.5 6 11.5 8 14M8 2C10 4.5 10 11.5 8 14" stroke="currentColor" strokeWidth="1.2" /></svg>}
            label="Markets"
            value={uniqueMarkets.size}
          />
        </div>
      )}

      {/* Category chip tabs */}
      {viewState === 'default' && (
        <CategoryChips active={categoryFilter} onChange={setCategoryFilter} counts={categoryCounts} />
      )}

      {/* Search + status filter */}
      {viewState !== 'empty' && (
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            size="sm"
            fullWidth
            style={{ marginBottom: 0, maxWidth: isMobile ? '100%' : '320px', flex: 1 }}
            startAdornment={
              <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: colors.icon.enabled.onLight }}>
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />
          <div style={{ display: 'flex', gap: spacing['2xs'] }}>
            {statusOptions.map((opt) => {
              const isActive = statusFilter === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  style={{
                    padding: `${spacing['2xs']} ${spacing.sm}`,
                    borderRadius: borderRadius.md,
                    border: `1px solid ${isActive ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
                    backgroundColor: isActive ? `${colors.brand.default}10` : 'transparent',
                    color: isActive ? colors.brand.default : colors.text.lowEmphasis.onLight,
                    fontFamily: fontFamilies.body,
                    fontSize: typography.label.sm.fontSize,
                    fontWeight: isActive ? fontWeights.semibold : fontWeights.medium,
                    cursor: 'pointer',
                    transition: `all ${transitionPresets.fast}`,
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <DataTable.ViewToggle
              value={display}
              onChange={(val) => setDisplay(val)}
            />
          </div>
        </div>
      )}

      {/* Content by state */}
      {viewState === 'loading' && (
        <div
          style={{
            backgroundColor: colors.surface.light,
            borderRadius: borderRadiusSemantics.card,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            padding: spacing.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.xs,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                padding: `${spacing.xs} ${spacing.md}`,
              }}
            >
              <Skeleton width={8} height={8} style={{ borderRadius: '50%' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
                <Skeleton width="45%" height={14} />
                <Skeleton width="20%" height={10} />
              </div>
              <Skeleton width={65} height={22} />
              <Skeleton width={55} height={22} />
              <Skeleton width={40} height={14} />
              <Skeleton width={16} height={16} />
            </div>
          ))}
        </div>
      )}

      {viewState === 'empty' && (
        <div
          style={{
            backgroundColor: colors.surface.light,
            borderRadius: borderRadiusSemantics.card,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            padding: `${spacing['5xl']} ${spacing['2xl']}`,
          }}
        >
          <EmptyState
            aria-label="No products"
            icon={
              <svg width={64} height={64} viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <rect x="10" y="16" width="44" height="36" rx="4" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" />
                <path d="M22 28H42M22 36H38M22 44H30" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" strokeLinecap="round" />
                <circle cx="48" cy="16" r="10" fill={colors.brand.default} />
                <path d="M44 16H52M48 12V20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            }
            title="No products yet"
            description="Create your first product to start building your catalog for this brand."
          >
            <Button
              emphasis="high"
              size="lg"
              leftIcon={
                <svg width={18} height={18} viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              onClick={() => (window.location.href = '/prototypes/product-registry/create')}
            >
              Create First Product
            </Button>
          </EmptyState>
        </div>
      )}

      {viewState === 'error' && (
        <div
          style={{
            backgroundColor: colors.surface.important,
            borderRadius: borderRadiusSemantics.card,
            border: `1px solid ${colors.surfaceBorder.important}`,
            padding: `${spacing['3xl']} ${spacing['2xl']}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.lg,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(193, 11, 30, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width={32} height={32} viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="14" stroke={colors.status.important} strokeWidth="2" />
              <path d="M16 9V18M16 21V23" stroke={colors.status.important} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h3
              style={{
                fontFamily: fontFamilies.display,
                fontSize: typography.heading.h4.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.important,
                margin: 0,
              }}
            >
              Failed to load products
            </h3>
            <p
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.md.fontSize,
                color: colors.text.lowEmphasis.onLight,
                margin: `${spacing.xs} 0 0`,
                maxWidth: '400px',
              }}
            >
              There was an error connecting to the product registry. Please try again or contact support if the issue persists.
            </p>
          </div>
          <Button emphasis="high" size="lg" onClick={() => {}}>
            Retry
          </Button>
        </div>
      )}

      {viewState === 'default' && display === 'table' && (
        <div
          style={{
            backgroundColor: colors.surface.light,
            borderRadius: borderRadiusSemantics.card,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            overflow: 'hidden',
          }}
        >
          {/* Result count */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: `${spacing.sm} ${spacing.md}`,
              borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
            }}
          >
            <span
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.xs.fontSize,
                fontWeight: fontWeights.medium,
                color: colors.text.lowEmphasis.onLight,
              }}
            >
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              {(categoryFilter !== 'all' || statusFilter !== 'all' || searchQuery) && ' (filtered)'}
            </span>
          </div>
          {/* Product rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredProducts.map((product) => (
              <ProductRow key={product.id} product={product} isMobile={isMobile} />
            ))}
            {filteredProducts.length === 0 && (
              <div style={{ padding: `${spacing['3xl']} ${spacing.xl}`, textAlign: 'center' }}>
                <p
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.body.md.fontSize,
                    color: colors.text.lowEmphasis.onLight,
                    margin: 0,
                  }}
                >
                  No products match your filters. Try adjusting your search or category.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {viewState === 'default' && display === 'cards' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: spacing.md,
          }}
        >
          {filteredProducts.map((row) => (
            <ProductCard
              key={row.id}
              layout="vertical"
              name={row.name}
              sku={row.sku}
              categories={[row.category.charAt(0).toUpperCase() + row.category.slice(1)]}
              potency={row.thcContent ? `${row.thcContent} THC` : undefined}
              typeLabel={row.isBundle ? 'Bundle' : 'Product'}
              markets={row.markets.map((m) => ({
                code: m.marketId,
                highlighted: m.status === 'available',
              }))}
              totalMarkets={row.markets.length}
              bordered
              onClick={() => (window.location.href = `/prototypes/product-registry/detail?id=${row.id}`)}
            />
          ))}
          {filteredProducts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: `${spacing['3xl']} ${spacing.xl}`, textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.md.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                  margin: 0,
                }}
              >
                No products match your filters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
