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
} from '@/styles/design-tokens'
import {
  Badge,
  Button,
  DataTable,
  DetailField,

  EmptyState,
  Skeleton,
  ConfirmDialog,
  Toast,
  useToast,
} from '@/components'
import type { DataTableColumn } from '@/components'

// =============================================================================
// TYPES
// =============================================================================

interface PackageItem {
  id: string
  tag: string
  itemCategory: string
  strain: string
  quantity: number
  unit: string
  testStatus: 'Passed' | 'Failed' | 'Pending' | 'In Progress'
}

// =============================================================================
// SAMPLE DATA — domain-realistic cannabis regulatory content
// =============================================================================

const MANIFEST_DATA = {
  manifestNumber: '0000004721',
  status: 'Pending' as const,
  createdDate: '2026-02-28',
  estimatedDeparture: '2026-03-01 08:00 AM',
  estimatedArrival: '2026-03-01 11:30 AM',
  origin: {
    facility: 'Green Leaf Cultivation LLC',
    license: 'C12-0000001-LIC',
    address: '1420 Industrial Pkwy, Sacramento, CA 95822',
    contact: 'James Wilson, Grow Manager',
    phone: '(916) 555-0142',
  },
  destination: {
    facility: 'Mountain View Dispensary',
    license: 'D-11223',
    address: '875 Market St, San Francisco, CA 94103',
    contact: 'David Kim, Inventory Manager',
    phone: '(415) 555-0198',
  },
  driver: {
    name: 'Carlos Mendez',
    license: 'D4829103',
    employee: 'EMP-0847',
  },
  vehicle: {
    make: '2024 Ford Transit',
    plate: '8ABC123',
    vin: '1FTBW2CM5RKA12345',
  },
  notes: 'Temperature-sensitive items — maintain 60-70°F during transport. Delivery window confirmed with receiving facility.',
}

const PACKAGES: PackageItem[] = [
  { id: '1', tag: '1A4060300000022000012345', itemCategory: 'Flower', strain: 'Blue Dream', quantity: 454, unit: 'Grams', testStatus: 'Passed' },
  { id: '2', tag: '1A4060300000022000012346', itemCategory: 'Flower', strain: 'OG Kush', quantity: 227, unit: 'Grams', testStatus: 'Passed' },
  { id: '3', tag: '1A4060300000022000012347', itemCategory: 'Concentrate', strain: 'Sour Diesel', quantity: 100, unit: 'Grams', testStatus: 'Passed' },
  { id: '4', tag: '1A4060300000022000012348', itemCategory: 'Pre-Roll', strain: 'Girl Scout Cookies', quantity: 200, unit: 'Each', testStatus: 'In Progress' },
  { id: '5', tag: '1A4060300000022000012349', itemCategory: 'Edible', strain: 'Granddaddy Purple', quantity: 150, unit: 'Each', testStatus: 'Passed' },
  { id: '6', tag: '1A4060300000022000012350', itemCategory: 'Tincture', strain: 'Jack Herer', quantity: 48, unit: 'Each', testStatus: 'Pending' },
  { id: '7', tag: '1A4060300000022000012351', itemCategory: 'Flower', strain: 'Sour Diesel', quantity: 340, unit: 'Grams', testStatus: 'Passed' },
  { id: '8', tag: '1A4060300000022000012352', itemCategory: 'Topical', strain: 'Blue Dream', quantity: 24, unit: 'Each', testStatus: 'Passed' },
]

// =============================================================================
// COLUMN DEFINITIONS
// =============================================================================

const packageColumns: DataTableColumn<PackageItem>[] = [
  {
    key: 'tag',
    header: 'Package Tag',
    sortable: true,
    render: (row) => (
      <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize }}>
        {row.tag}
      </span>
    ),
  },
  { key: 'itemCategory', header: 'Category', sortable: true },
  { key: 'strain', header: 'Strain', sortable: true },
  {
    key: 'quantity',
    header: 'Quantity',
    align: 'right' as const,
    sortable: true,
    render: (row) => `${row.quantity.toLocaleString()} ${row.unit}`,
  },
  {
    key: 'testStatus',
    header: 'Test Status',
    sortable: true,
    render: (row) => {
      const colorMap: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
        Passed: 'success',
        Failed: 'error',
        Pending: 'warning',
        'In Progress': 'info',
      }
      return <Badge color={colorMap[row.testStatus]} variant="subtle" size="sm">{row.testStatus}</Badge>
    },
  },
]

// =============================================================================
// STATUS BADGE MAPPING
// =============================================================================

const statusBadgeColor: Record<string, 'warning' | 'info' | 'success' | 'error'> = {
  Pending: 'warning',
  'In Transit': 'info',
  Received: 'success',
  Rejected: 'error',
  Voided: 'error',
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 style={{
      fontFamily: fontFamilies.display,
      fontSize: typography.heading.h5.fontSize,
      fontWeight: fontWeights.semibold,
      color: colors.text.highEmphasis.onLight,
      margin: 0,
      paddingBottom: spacing.sm,
    }}>
      {title}
    </h3>
  )
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: spacing.lg,
    }}>
      {children}
    </div>
  )
}

function FacilityCard({ label, data }: { label: string; data: typeof MANIFEST_DATA.origin }) {
  return (
    <div style={{
      padding: spacing.md,
      backgroundColor: colors.surface.light,
      border: `1px solid ${colors.border.lowEmphasis.onLight}`,
      borderRadius: borderRadiusSemantics.card,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.sm,
    }}>
      <span style={{
        fontFamily: fontFamilies.body,
        fontSize: typography.label.sm.fontSize,
        fontWeight: fontWeights.medium,
        color: colors.text.lowEmphasis.onLight,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: fontFamilies.display,
        fontSize: typography.body.lg.fontSize,
        fontWeight: fontWeights.semibold,
        color: colors.text.highEmphasis.onLight,
      }}>
        {data.facility}
      </span>
      <DetailField label="License" value={data.license} mono />
      <DetailField label="Address" value={data.address} />
      <DetailField label="Contact" value={data.contact} />
      <DetailField label="Phone" value={data.phone} />
    </div>
  )
}

// =============================================================================
// STATE VIEWS
// =============================================================================

function LoadingView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
      {/* Header skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          <Skeleton variant="text" width={300} height={28} />
          <Skeleton variant="text" width={180} height={16} />
        </div>
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <Skeleton variant="rectangular" width={100} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
        </div>
      </div>
      {/* Info section skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="rectangular" width="100%" height={200} />
      </div>
      {/* Table skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <Skeleton variant="text" width={160} height={24} />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rectangular" width="100%" height={48} />
        ))}
      </div>
    </div>
  )
}

function EmptyView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
      {/* Still show header with manifest number */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h3.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            margin: 0,
          }}>
            Manifest #{MANIFEST_DATA.manifestNumber}
          </h2>
        </div>
      </div>
      <EmptyState
        icon={
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <line x1="12" y1="12" x2="12" y2="16" />
            <line x1="10" y1="14" x2="14" y2="14" />
          </svg>
        }
        title="No packages added yet"
        description="This transfer manifest doesn't have any packages. Add packages from your inventory to get started."
        action={
          <Button emphasis="high">Add Packages</Button>
        }
      />
    </div>
  )
}

function ErrorView() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing['4xl'],
      gap: spacing.md,
      textAlign: 'center',
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: colors.badge.importantLight,
        color: colors.status.important,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h3 style={{
        fontFamily: fontFamilies.display,
        fontSize: typography.heading.h5.fontSize,
        fontWeight: fontWeights.semibold,
        color: colors.text.highEmphasis.onLight,
        margin: 0,
      }}>
        Unable to load manifest
      </h3>
      <p style={{
        fontFamily: fontFamilies.body,
        fontSize: typography.body.md.fontSize,
        color: colors.text.lowEmphasis.onLight,
        margin: 0,
        maxWidth: '420px',
      }}>
        We couldn&apos;t retrieve manifest #{MANIFEST_DATA.manifestNumber}. This may be a temporary issue with the server.
      </p>
      <Button emphasis="high" onClick={() => window.location.reload()}>
        Retry
      </Button>
      <p style={{
        fontFamily: fontFamilies.body,
        fontSize: typography.body.sm.fontSize,
        color: colors.text.lowEmphasis.onLight,
        margin: 0,
      }}>
        If this continues, contact support at support@metrc.com
      </p>
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function TransferManifestDetailPage() {
  // Support ?state= query param for screenshot capture
  const initialState = (typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('state') as ViewState
    : null) || 'default'
  const [viewState, setViewState] = useState<ViewState>(initialState)
  const [showVoidDialog, setShowVoidDialog] = useState(false)
  const { toasts, success, warning, dismiss } = useToast()

  const handleSend = () => {
    success(`Manifest #${MANIFEST_DATA.manifestNumber} has been sent to ${MANIFEST_DATA.destination.facility}.`)
  }

  const handleVoid = () => {
    setShowVoidDialog(false)
    warning(`Manifest #${MANIFEST_DATA.manifestNumber} has been voided.`)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.surface.lightDarker,
      fontFamily: fontFamilies.body,
    }}>
      {/* Main content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: spacing['2xl'],
      }}>
        {viewState === 'loading' && <LoadingView />}
        {viewState === 'empty' && <EmptyView />}
        {viewState === 'error' && <ErrorView />}

        {viewState === 'default' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
            {/* Page header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <h2 style={{
                    fontFamily: fontFamilies.display,
                    fontSize: typography.heading.h3.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: colors.text.highEmphasis.onLight,
                    margin: 0,
                  }}>
                    Manifest #{MANIFEST_DATA.manifestNumber}
                  </h2>
                  <Badge
                    color={statusBadgeColor[MANIFEST_DATA.status]}
                    variant="filled"
                    size="md"
                  >
                    {MANIFEST_DATA.status}
                  </Badge>
                </div>
                <span style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.sm.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                }}>
                  Created {MANIFEST_DATA.createdDate} &middot; {PACKAGES.length} packages
                </span>
              </div>

              <div style={{ display: 'flex', gap: spacing.sm }}>
                <Button emphasis="low" onClick={handlePrint}>
                  Print
                </Button>
                <Button emphasis="low" onClick={() => setShowVoidDialog(true)}>
                  Void
                </Button>
                <Button emphasis="high" onClick={handleSend}>
                  Send Transfer
                </Button>
              </div>
            </div>

            {/* Origin / Destination */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: spacing.lg,
              alignItems: 'stretch',
            }}>
              <FacilityCard label="Origin" data={MANIFEST_DATA.origin} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                color: colors.text.lowEmphasis.onLight,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
              <FacilityCard label="Destination" data={MANIFEST_DATA.destination} />
            </div>

            {/* Transport details */}
            <div style={{
              padding: spacing.md,
              backgroundColor: colors.surface.light,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadiusSemantics.card,
            }}>
              <SectionHeader title="Transport Details" />
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: spacing.lg,
                marginTop: spacing.sm,
              }}>
                <DetailField label="Driver" value={MANIFEST_DATA.driver.name} />
                <DetailField label="Driver License" value={MANIFEST_DATA.driver.license} mono />
                <DetailField label="Employee ID" value={MANIFEST_DATA.driver.employee} mono />
                <DetailField label="Vehicle" value={MANIFEST_DATA.vehicle.make} />
                <DetailField label="License Plate" value={MANIFEST_DATA.vehicle.plate} mono />
                <DetailField label="Est. Departure" value={MANIFEST_DATA.estimatedDeparture} />
                <DetailField label="Est. Arrival" value={MANIFEST_DATA.estimatedArrival} />
              </div>
            </div>

            {/* Package table */}
            <div>
              <SectionHeader title="Packages" />
              <DataTable
                columns={packageColumns}
                data={PACKAGES}
                rowKey={(row) => row.id}
                density="default"
              />
            </div>

            {/* Notes */}
            {MANIFEST_DATA.notes && (
              <div style={{
                padding: spacing.md,
                backgroundColor: colors.surface.light,
                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                borderRadius: borderRadiusSemantics.card,
              }}>
                <SectionHeader title="Notes" />
                <p style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.md.fontSize,
                  color: colors.text.highEmphasis.onLight,
                  lineHeight: '24px',
                  margin: 0,
                }}>
                  {MANIFEST_DATA.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Void confirmation dialog */}
      <ConfirmDialog
        open={showVoidDialog}
        onCancel={() => setShowVoidDialog(false)}
        onConfirm={handleVoid}
        title="Void Transfer Manifest"
        description={`Are you sure you want to void manifest #${MANIFEST_DATA.manifestNumber}? This action cannot be undone and will notify ${MANIFEST_DATA.destination.facility}.`}
        confirmLabel="Void Manifest"
        variant="destructive"
      />

      {/* Toast container */}
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          variant={t.variant}
          isVisible={true}
          onClose={() => dismiss(t.id)}
        />
      ))}
      <PrototypeToolbar viewState={viewState} onViewStateChange={setViewState} />
    </div>
  )
}
