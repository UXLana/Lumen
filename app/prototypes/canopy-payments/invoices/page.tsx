'use client'

import React, { useState } from 'react'
import { PrototypeToolbar, ViewState, UseCase } from '@/components'
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
import { Badge, Button, DataTable, Input, Skeleton, EmptyState, TabBar } from '@/components'
import type { BadgeProps } from '@/components/Badge/Badge'
import type { DataTableColumn } from '@/components'
import { invoices, organizations } from '../data'
import type { Invoice } from '../data'

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

const USE_CASES: UseCase[] = [
  { label: 'UC1 — Single-facility retailer', description: 'Sarah: processes transactions at one dispensary in Colorado' },
  { label: 'UC2 — Financial controller', description: 'Rachel: read-only across all brands, write access in Payments only' },
  { label: 'UC3 — Multi-org consultant', description: 'Tom: supply chain across 2 orgs, write access in Payments' },
]

const getOrgName = (id: string) => organizations.find(o => o.id === id)?.name ?? id

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

// Stats card component
function StatCard({ label, value, subtitle, icon, iconColor, iconBg }: { label: string; value: string | number; subtitle?: string; icon?: React.ReactNode; iconColor?: string; iconBg?: string }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: '160px',
        padding: spacing.md,
        backgroundColor: colors.surface.light,
        borderRadius: borderRadiusSemantics.card,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing.md,
      }}
    >
      {icon && (
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: borderRadiusSemantics.card,
            backgroundColor: iconBg || colors.brand.default,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor || colors.text.highEmphasis.onDark,
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'], minWidth: 0 }}>
        <div
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h3.fontSize,
            fontWeight: fontWeights.bold,
            lineHeight: '1',
            color: colors.text.highEmphasis.onLight,
          }}
        >
          {value}
        </div>
        {subtitle && (
          <div
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.xs.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

// Inline SVG icons for stat cards
const InvoiceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
)
const DollarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)
const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function InvoicesPage() {
  const [viewState, setViewState] = useState<ViewState>('default')
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState('all')
  const [activeUseCase, setActiveUseCase] = useState(0)
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  // Compute stats
  const totalInvoices = invoices.length
  const outstandingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'partial')
  const outstandingBalance = outstandingInvoices.reduce((sum, inv) => sum + inv.amountDue, 0)
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue')
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amountDue, 0)
  const paidInvoices = invoices.filter(inv => inv.status === 'paid')
  const paidAmount = paidInvoices.reduce((sum, inv) => sum + inv.total, 0)

  // Filter invoices by tab
  const filteredInvoices = activeTab === 'all'
    ? invoices
    : activeTab === 'outstanding'
      ? invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'partial' || inv.status === 'viewed')
      : invoices.filter(inv => inv.status === 'voided') // archived

  const invoiceColumns: DataTableColumn<Invoice>[] = [
    { key: 'invoiceNumber', header: 'Invoice #', sortable: true, render: (row) => (
      <a href={`/prototypes/canopy-payments/invoice-detail?id=${row.id}`} style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold, color: colors.text.action.enabled, textDecoration: 'none' }}>{row.invoiceNumber}</a>
    )},
    { key: 'senderOrgId', header: 'From', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>{getOrgName(row.senderOrgId)}</span>
    )},
    { key: 'receiverOrgId', header: 'To', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>{getOrgName(row.receiverOrgId)}</span>
    )},
    { key: 'total', header: 'Amount', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold }}>{formatCurrency(row.total)}</span>
    )},
    { key: 'amountDue', header: 'Balance Due', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold, color: row.amountDue > 0 ? colors.text.highEmphasis.onLight : colors.text.lowEmphasis.onLight }}>{formatCurrency(row.amountDue)}</span>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (row) => {
      const statusMap: Record<string, { color: BadgeProps['color']; variant: BadgeProps['variant'] }> = { paid: { color: 'success', variant: 'subtle' }, sent: { color: 'info', variant: 'subtle' }, overdue: { color: 'error', variant: 'subtle' }, draft: { color: 'neutral', variant: 'subtle' }, partial: { color: 'warning', variant: 'subtle' }, viewed: { color: 'info', variant: 'subtle' }, voided: { color: 'neutral', variant: 'subtle' } }
      const b = statusMap[row.status] || { color: 'neutral' as const, variant: 'subtle' as const }
      return <Badge color={b.color} variant={b.variant} size="sm">{row.status}</Badge>
    }},
    { key: 'createdAt', header: 'Created', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>{new Date(row.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
    )},
    { key: 'dueDate', header: 'Due Date', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: row.status === 'overdue' ? colors.status.important : colors.text.lowEmphasis.onLight }}>{new Date(row.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
    )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>

      {/* Page heading */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
          <h1
            style={{
              margin: 0,
              fontFamily: fontFamilies.display,
              fontSize: typography.heading.h3.fontSize,
              fontWeight: fontWeights.bold,
              color: colors.text.highEmphasis.onLight,
            }}
          >
            Invoices
          </h1>
          <p
            style={{
              margin: 0,
              fontFamily: fontFamilies.body,
              fontSize: typography.body.md.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            Manage and track all invoices across your organization.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
          <StatCard label="Total Invoices" value={totalInvoices} subtitle={`${paidInvoices.length} paid`} icon={<InvoiceIcon />} iconBg={colors.badge.infoLight} iconColor={colors.badge.info} />
          <StatCard label="Outstanding" value={outstandingInvoices.length} subtitle={`${formatCurrency(outstandingBalance)} balance`} icon={<DollarIcon />} iconBg={colors.badge.yellowLight} iconColor={colors.badge.warning} />
          <StatCard label="Overdue" value={overdueInvoices.length} subtitle={`${formatCurrency(overdueAmount)} past due`} icon={<AlertIcon />} iconBg={colors.badge.importantLight} iconColor={colors.badge.important} />
          <StatCard label="Paid" value={paidInvoices.length} subtitle={`${formatCurrency(paidAmount)} collected`} icon={<CheckIcon />} iconBg={colors.badge.successLight} iconColor={colors.badge.success} />
        </div>
      )}

      {/* Tabs + Toolbar + Table */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: spacing.xs }}>
          {/* Tabs + button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <TabBar
              tabs={[
                { id: 'all', label: 'All' },
                { id: 'outstanding', label: 'Outstanding' },
                { id: 'archived', label: 'Archived' },
              ]}
              activeTab={activeTab}
              onTabChange={(tabId) => {
                setActiveTab(tabId)
                setSelectedKeys(new Set())
              }}
              align="left"
              hasDivider={false}
            />
            <div style={{ flexShrink: 0 }}>
              <Button
                emphasis="high"
                size="md"
                leftIcon={
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                }
                onClick={() => (window.location.href = '/prototypes/canopy-payments/create-invoice')}
              >
                Create Invoice
              </Button>
            </div>
          </div>

          {/* Toolbar */}
          <div style={{ marginTop: spacing.sm }}>
            <DataTable.Toolbar>
              <DataTable.Toolbar.Left>
                <DataTable.SelectionInfo
                  count={selectedKeys.size}
                  onClear={() => setSelectedKeys(new Set())}
                >
                  <DataTable.IconButton title="Archive selected">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <rect x="1" y="2" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M2 6v7a1 1 0 001 1h10a1 1 0 001-1V6" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M6 9h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </DataTable.IconButton>
                </DataTable.SelectionInfo>
              </DataTable.Toolbar.Left>
              <DataTable.Toolbar.Right>
                <Input
                  size="sm"
                  placeholder="Search..."
                  style={{ width: 200, marginBottom: 0, marginRight: spacing.sm }}
                  startAdornment={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  }
                />
                <DataTable.FilterButton />
                <DataTable.SortButton />
                <DataTable.IconButton title="Manage columns">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="1.5" y="1.5" width="4" height="13" rx="1" stroke="currentColor" strokeWidth="1.3" />
                    <rect x="6.5" y="1.5" width="4" height="13" rx="1" stroke="currentColor" strokeWidth="1.3" />
                    <rect x="11.5" y="1.5" width="3" height="13" rx="1" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </DataTable.IconButton>
              </DataTable.Toolbar.Right>
            </DataTable.Toolbar>
          </div>

          {/* Table */}
          <div style={{ marginTop: spacing.sm }}>
            <DataTable
              columns={invoiceColumns}
              data={filteredInvoices}
              rowKey={(row) => row.id}
              density="comfortable"
              display="table"
              hoverable
              selectable
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            />
          </div>
        </div>
      )}

      {/* Loading state */}
      {viewState === 'loading' && (
        <>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ flex: 1, minWidth: '140px', padding: spacing.lg, backgroundColor: colors.surface.light, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.border.lowEmphasis.onLight}`, display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
                <Skeleton width="60%" height={28} />
                <Skeleton width="80%" height={14} />
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: colors.surface.light, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.border.lowEmphasis.onLight}`, padding: spacing.lg, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            <Skeleton width="35%" height={20} />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: `${spacing.sm} 0`, borderBottom: i < 5 ? `1px solid ${colors.border.lowEmphasis.onLight}` : 'none' }}>
                <Skeleton width={110} height={16} />
                <Skeleton width={110} height={16} />
                <Skeleton width={90} height={16} />
                <Skeleton width={75} height={24} />
                <Skeleton width={85} height={16} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {viewState === 'empty' && (
        <div style={{ backgroundColor: colors.surface.light, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.border.lowEmphasis.onLight}`, padding: `${spacing['5xl']} ${spacing['2xl']}` }}>
          <EmptyState
            aria-label="No invoices"
            icon={
              <svg width={64} height={64} viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <path d="M38 6H18a4 4 0 00-4 4v44a4 4 0 004 4h28a4 4 0 004-4V18z" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" />
                <polyline points="38,6 38,18 50,18" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" fill="none" />
                <line x1="22" y1="30" x2="42" y2="30" stroke={colors.border.midEmphasis.onLight} strokeWidth="1.5" />
                <line x1="22" y1="38" x2="42" y2="38" stroke={colors.border.midEmphasis.onLight} strokeWidth="1.5" />
                <line x1="22" y1="46" x2="34" y2="46" stroke={colors.border.midEmphasis.onLight} strokeWidth="1.5" />
              </svg>
            }
            title="No invoices yet"
            description="Create your first invoice to start tracking payments."
          >
            <Button
              emphasis="high"
              size="lg"
              leftIcon={
                <svg width={18} height={18} viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              onClick={() => (window.location.href = '/prototypes/canopy-payments/create-invoice')}
            >
              Create your first invoice
            </Button>
          </EmptyState>
        </div>
      )}

      {/* Error state */}
      {viewState === 'error' && (
        <div style={{ backgroundColor: colors.surface.important, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.surfaceBorder.important}`, padding: `${spacing['3xl']} ${spacing['2xl']}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.lg, textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(193, 11, 30, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={32} height={32} viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="14" stroke={colors.status.important} strokeWidth="2" />
              <path d="M16 9V18M16 21V23" stroke={colors.status.important} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontFamily: fontFamilies.display, fontSize: typography.heading.h4.fontSize, fontWeight: fontWeights.semibold, color: colors.text.important, margin: 0 }}>
              Failed to load invoices
            </h3>
            <p style={{ fontFamily: fontFamilies.body, fontSize: typography.body.md.fontSize, color: colors.text.lowEmphasis.onLight, margin: `${spacing.xs} 0 0`, maxWidth: '400px' }}>
              There was an error connecting to the invoices service. Please try again.
            </p>
          </div>
          <Button emphasis="high" size="lg" onClick={() => setViewState('default')}>
            Retry
          </Button>
        </div>
      )}

      {/* Floating dev toolbar */}
      <PrototypeToolbar
        viewState={viewState}
        onViewStateChange={setViewState}
        useCases={USE_CASES}
        activeUseCase={activeUseCase}
        onUseCaseChange={setActiveUseCase}
      />
    </div>
  )
}
