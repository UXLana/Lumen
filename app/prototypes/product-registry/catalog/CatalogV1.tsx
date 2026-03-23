'use client'

import React, { useState, useMemo } from 'react'
import type { ViewState } from '@/app/prototypes/PrototypeToolbar'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
  breakpoints,
} from '@/styles/design-tokens'
import { Badge, Button, Input, DataTable, Skeleton, EmptyState } from '@/components'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import type { BadgeProps } from '@/components/Badge/Badge'
import type { DataTableColumn, DataTableDisplay } from '@/components'
import { Select } from '@/components/Select'
import { products, categories, statusOptions, typeFilterOptions } from '../data'

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

function CategoryIcon({ category }: { category: string }) {
  const iconMap: Record<string, { emoji: string; bg: string }> = {
    flower: { emoji: '\u{1F33F}', bg: colors.surface.success },
    concentrate: { emoji: '\u{1F4A7}', bg: colors.surface.info },
    edible: { emoji: '\u{1F36C}', bg: colors.surface.warning },
    'pre-roll': { emoji: '\u{1F6AC}', bg: colors.surface.lightDarker },
    tincture: { emoji: '\u{1F48A}', bg: colors.surface.info },
    topical: { emoji: '\u{1F9F4}', bg: colors.surface.success },
    capsule: { emoji: '\u{1F48A}', bg: colors.surface.warning },
  }
  const icon = iconMap[category] || { emoji: '\u{1F4E6}', bg: colors.surface.lightDarker }
  return (
    <div
      style={{
        width: '44px',
        height: '44px',
        borderRadius: borderRadiusSemantics.card,
        backgroundColor: icon.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: '20px',
      }}
      aria-hidden="true"
    >
      {icon.emoji}
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: '140px',
        padding: spacing.lg,
        backgroundColor: accent ? colors.brand.default : colors.surface.light,
        borderRadius: borderRadiusSemantics.card,
        border: accent ? 'none' : `1px solid ${colors.border.lowEmphasis.onLight}`,
      }}
    >
      <div
        style={{
          fontFamily: fontFamilies.display,
          fontSize: typography.display.sm.fontSize,
          fontWeight: fontWeights.bold,
          lineHeight: '1',
          color: accent ? colors.text.highEmphasis.onDark : colors.text.highEmphasis.onLight,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: fontFamilies.body,
          fontSize: typography.label.sm.fontSize,
          fontWeight: fontWeights.medium,
          color: accent ? 'rgba(255,255,255,0.75)' : colors.text.lowEmphasis.onLight,
          marginTop: spacing['2xs'],
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </div>
    </div>
  )
}

export default function CatalogV1({ viewState }: { viewState: ViewState }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [display, setDisplay] = useState<DataTableDisplay>('table')
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  const categoryOptions = [{ value: 'all', label: 'All Categories' }, ...categories]

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter
      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'bundle' && p.isBundle) ||
        (typeFilter === 'single' && !p.isBundle)
      return matchesSearch && matchesCategory && matchesStatus && matchesType
    })
  }, [searchQuery, categoryFilter, statusFilter, typeFilter])

  const activeFilterCount = [searchQuery, categoryFilter !== 'all', statusFilter !== 'all', typeFilter !== 'all'].filter(Boolean).length

  const activeCount = products.filter((p) => p.status === 'active').length
  const bundleCount = products.filter((p) => p.isBundle).length
  const uniqueMarkets = new Set(products.flatMap((p) => p.markets.map((m) => m.marketId)))

  const columns: DataTableColumn<(typeof products)[0]>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <CategoryIcon category={row.category} />
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <a
              href={`/prototypes/product-registry/detail?id=${row.id}`}
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.sm.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.action.enabled,
                textDecoration: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {row.name}
            </a>
            <span
              style={{
                fontFamily: fontFamilies.mono,
                fontSize: typography.body.xs.fontSize,
                color: colors.text.lowEmphasis.onLight,
                letterSpacing: '0.3px',
              }}
            >
              {row.sku}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (row) => {
        const categoryColorMap: Record<string, { color: BadgeProps['color']; variant: BadgeProps['variant'] }> = {
          flower: { color: 'success', variant: 'outlined' },
          concentrate: { color: 'info', variant: 'outlined' },
          edible: { color: 'warning', variant: 'outlined' },
          'pre-roll': { color: 'neutral', variant: 'outlined' },
          tincture: { color: 'brand', variant: 'outlined' },
          topical: { color: 'error', variant: 'outlined' },
          capsule: { color: 'neutral', variant: 'outlined' },
        }
        const badge = categoryColorMap[row.category] || { color: 'neutral' as const, variant: 'outlined' as const }
        return (
          <Badge color={badge.color} variant={badge.variant} size="sm">
            {row.category.charAt(0).toUpperCase() + row.category.slice(1)}
          </Badge>
        )
      },
    },
    {
      key: 'isBundle' as any,
      header: 'Type',
      sortable: true,
      render: (row) => (
        <Badge
          color={row.isBundle ? 'info' : 'neutral'}
          variant={row.isBundle ? 'filled' : 'subtle'}
          size="sm"
        >
          {row.isBundle ? 'Bundle' : 'Single'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <Badge
          color={row.status === 'active' ? 'success' : 'neutral'}
          variant="filled"
          size="sm"
        >
          {row.status === 'active' ? 'Active' : 'Archived'}
        </Badge>
      ),
    },
    {
      key: 'markets' as any,
      header: 'Markets',
      render: (row) => (
        <div style={{ display: 'flex', gap: spacing['2xs'], flexWrap: 'wrap' }}>
          {row.markets.slice(0, 3).map((m) => (
            <Badge
              key={m.marketId}
              color={m.status === 'available' ? 'success' : m.status === 'pending' ? 'warning' : 'error'}
              variant="subtle"
              size="sm"
            >
              {m.marketId}
            </Badge>
          ))}
          {row.markets.length > 3 && (
            <Badge color="neutral" variant="subtle" size="sm">
              +{row.markets.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      sortable: true,
      render: (row) => (
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          {new Date(row.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ]

  const mobileColumns = columns.filter((c) => c.key === 'name' || c.key === 'status')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
      {/* Page header */}
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

      {/* Stats bar */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
          <StatCard label="Total Products" value={products.length} accent />
          <StatCard label="Active" value={activeCount} />
          <StatCard label="Bundles" value={bundleCount} />
          <StatCard label="Markets" value={uniqueMarkets.size} />
        </div>
      )}

      {/* Toolbar with filters + view toggle */}
      {viewState !== 'empty' && (
        <DataTable.Toolbar>
          <DataTable.Toolbar.Left>
            <Input
              placeholder="Search by name, SKU, or category..."
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              size="sm"
              fullWidth
              style={{ marginBottom: 0, maxWidth: isMobile ? '100%' : '280px' }}
              startAdornment={
                <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: colors.icon.enabled.onLight }}>
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            />
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
              size="sm"
              style={{ minWidth: '140px' }}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              size="sm"
              style={{ minWidth: '120px' }}
            />
            <Select
              options={typeFilterOptions}
              value={typeFilter}
              onChange={setTypeFilter}
              size="sm"
              style={{ minWidth: '120px' }}
            />
            {activeFilterCount > 0 && (
              <DataTable.IconButton
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('all')
                  setStatusFilter('all')
                  setTypeFilter('all')
                }}
                title="Clear all filters"
                label="Clear"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </DataTable.IconButton>
            )}
          </DataTable.Toolbar.Left>
          <DataTable.Toolbar.Right>
            <span
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.xs.fontSize,
                fontWeight: fontWeights.medium,
                color: colors.text.lowEmphasis.onLight,
                whiteSpace: 'nowrap',
              }}
            >
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              {activeFilterCount > 0 && ' (filtered)'}
            </span>
            <DataTable.ViewToggle
              value={display}
              onChange={(val) => setDisplay(val)}
            />
          </DataTable.Toolbar.Right>
        </DataTable.Toolbar>
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
            gap: spacing.sm,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                padding: `${spacing.sm} 0`,
                borderBottom: i < 5 ? `1px solid ${colors.border.lowEmphasis.onLight}` : 'none',
              }}
            >
              <Skeleton width={44} height={44} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
                <Skeleton width="55%" height={16} />
                <Skeleton width="25%" height={12} />
              </div>
              <Skeleton width={75} height={24} />
              <Skeleton width={65} height={24} />
              <Skeleton width={100} height={24} />
              <Skeleton width={85} height={16} />
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

      {viewState === 'default' && (
        <DataTable
          columns={isMobile && display === 'table' ? mobileColumns : columns}
          data={filteredProducts}
          rowKey={(row) => row.id}
          density="default"
          display={isMobile ? 'cards' : display}
          hoverable
          renderCard={(row, _index, { selected, onSelect }) => (
            <ProductCard
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
              selected={selected}
              onSelect={onSelect}
              bordered
              onClick={() => (window.location.href = `/prototypes/product-registry/detail?id=${row.id}`)}
            />
          )}
          cardGridColumns="repeat(auto-fill, minmax(220px, 1fr))"
          emptyState={
            <p
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.md.fontSize,
                color: colors.text.lowEmphasis.onLight,
                margin: 0,
              }}
            >
              No products match your filters. Try adjusting your search or filter criteria.
            </p>
          }
          style={{ boxShadow: 'none' }}
        />
      )}
    </div>
  )
}
