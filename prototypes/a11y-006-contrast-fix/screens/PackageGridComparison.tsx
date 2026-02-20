'use client'

import React from 'react'
import { colors, typography, spacing, borderRadius, shadows } from '@/styles/design-tokens'
import {
  IconTradeSample,
  IconProductPackage,
  IconLabSample,
  IconSourcePackage,
  packageIconColors,
} from '@/components/Icons/IconPackageTypes'
import { IconEye, IconX } from '@/components/Icons'

// =============================================================================
// A11Y-006 CONTRAST FIX PROTOTYPE
// WCAG 1.4.3: Contrast (Minimum) - Level AA
// =============================================================================

// Mock data for the grid
const mockPackages = [
  {
    id: 'ABCDEF01234567000012496',
    srcHs: '2024-11-10-Harvest Location-H',
    srcPkgs: 'ABCDEF01234567000012495',
    location: 'Flower Location A',
    sublocation: 'Flower Location A - Table 1',
    item: 'Destructible Product',
    category: 'Destructible Cannabis Product',
    strain: 'Blue Dream',
    quantity: '10 g',
    type: 'product',
    finished: false,
  },
  {
    id: 'ABCDEF01234567000012492',
    srcHs: '2024-11-10-Harvest Location-H',
    srcPkgs: 'ABCDEF01234567000012491',
    location: 'Flower Location A',
    sublocation: 'Flower Location A - Table 2',
    item: 'Bluer Dream Flower (Final Packaging)',
    category: 'Buds',
    strain: 'Blue Dream',
    quantity: '154 g',
    type: 'tradeSample',
    finished: false,
  },
  {
    id: 'ABCDEF01234567000012477',
    srcHs: '2024-11-10-Harvest Location-H',
    srcPkgs: 'ABCDEF01234567000012463',
    location: 'Flower Location A',
    sublocation: 'Flower Location A - Table 1',
    item: 'Bluer Dream Flower (Final Packaging)',
    category: 'Buds',
    strain: 'Blue Dream',
    quantity: '1 g',
    type: 'labSample',
    finished: true, // This row demonstrates the text contrast fix
  },
  {
    id: 'ABCDEF01234567000012480',
    srcHs: '2024-11-10-Harvest Location-H',
    srcPkgs: 'ABCDEF01234567000012463',
    location: 'Flower Location A',
    sublocation: 'Flower Location A - Table 1',
    item: 'Bluer Dream Flower (Final Packaging)',
    category: 'Buds',
    strain: 'Blue Dream',
    quantity: '1 g',
    type: 'source',
    finished: true,
  },
]

// Styles
const styles = {
  container: {
    fontFamily: typography.body.md.fontFamily,
    padding: spacing[8],
    backgroundColor: '#F5F5F5',
    minHeight: '100vh',
  } as React.CSSProperties,

  header: {
    marginBottom: spacing[8],
  } as React.CSSProperties,

  title: {
    ...typography.heading.h2,
    color: colors.text.highEmphasis.onLight,
    marginBottom: spacing[2],
  } as React.CSSProperties,

  subtitle: {
    ...typography.body.md,
    color: colors.text.lowEmphasis.onLight,
  } as React.CSSProperties,

  section: {
    backgroundColor: colors.surface.default,
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    marginBottom: spacing[6],
    boxShadow: shadows.sm,
  } as React.CSSProperties,

  sectionTitle: {
    ...typography.heading.h4,
    color: colors.text.highEmphasis.onLight,
    marginBottom: spacing[4],
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  } as React.CSSProperties,

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: `${spacing[1]} ${spacing[3]}`,
    borderRadius: borderRadius.full,
    fontSize: '12px',
    fontWeight: 600,
  } as React.CSSProperties,

  badgeBefore: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  } as React.CSSProperties,

  badgeAfter: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  } as React.CSSProperties,

  legend: {
    display: 'flex',
    gap: spacing[6],
    padding: spacing[4],
    backgroundColor: '#FAFAFA',
    borderRadius: borderRadius.md,
    marginBottom: spacing[4],
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    ...typography.body.sm,
    color: colors.text.highEmphasis.onLight,
  } as React.CSSProperties,

  grid: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
  } as React.CSSProperties,

  th: {
    padding: `${spacing[3]} ${spacing[2]}`,
    textAlign: 'left' as const,
    borderBottom: `1px solid ${colors.stroke.default}`,
    fontWeight: 600,
    color: colors.text.highEmphasis.onLight,
    backgroundColor: '#FAFAFA',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  td: {
    padding: `${spacing[3]} ${spacing[2]}`,
    borderBottom: `1px solid ${colors.stroke.light}`,
    verticalAlign: 'middle' as const,
  } as React.CSSProperties,

  // BEFORE styles (failing contrast)
  tdBeforeFinished: {
    color: '#B0B0B0', // FAILS: 2.65:1 contrast ratio
  } as React.CSSProperties,

  iconBefore: {
    color: '#CCCCCC', // FAILS: 1.60:1 contrast ratio
  } as React.CSSProperties,

  // AFTER styles (passing contrast)
  tdAfterFinished: {
    color: colors.grid.finishedRowText, // #595959 - PASSES: 5.92:1
  } as React.CSSProperties,

  contrastInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
    backgroundColor: '#F5F5F5',
    borderRadius: borderRadius.md,
    marginTop: spacing[4],
    ...typography.body.sm,
  } as React.CSSProperties,

  contrastBad: {
    color: '#C62828',
    fontWeight: 600,
  } as React.CSSProperties,

  contrastGood: {
    color: '#2E7D32',
    fontWeight: 600,
  } as React.CSSProperties,

  colorSwatch: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[1]} ${spacing[2]}`,
    backgroundColor: '#F5F5F5',
    borderRadius: borderRadius.sm,
    fontFamily: typography.code.sm.fontFamily,
    fontSize: '12px',
  } as React.CSSProperties,

  swatchBox: {
    width: '16px',
    height: '16px',
    borderRadius: '3px',
    border: '1px solid rgba(0,0,0,0.1)',
  } as React.CSSProperties,

  row: {
    transition: 'background-color 0.15s ease',
  } as React.CSSProperties,

  rowHover: {
    backgroundColor: '#F5F5F5',
  } as React.CSSProperties,
}

// Package type icon component
const PackageTypeIcon: React.FC<{
  type: string
  useBefore?: boolean
}> = ({ type, useBefore = false }) => {
  if (useBefore) {
    // BEFORE: Low contrast gray icons
    return (
      <span style={styles.iconBefore}>
        <IconEye size="sm" />
      </span>
    )
  }

  // AFTER: Accessible colored icons
  switch (type) {
    case 'tradeSample':
      return <IconTradeSample size="sm" />
    case 'product':
      return <IconProductPackage size="sm" />
    case 'labSample':
      return <IconLabSample size="sm" />
    case 'source':
      return <IconSourcePackage size="sm" />
    default:
      return <IconProductPackage size="sm" />
  }
}

// Main prototype component
export const PackageGridComparison: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>A11Y-006: Color Contrast Fix</h1>
        <p style={styles.subtitle}>
          WCAG 1.4.3 (Level AA) - Contrast Minimum for text and non-text elements
        </p>
      </div>

      {/* Icon Color Fix Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Accessible Icon Color
          <span style={{ ...styles.badge, ...styles.badgeAfter }}>FIX</span>
        </h2>
        <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, marginBottom: spacing[4] }}>
          Monochromatic gray with 3:1+ contrast ratio against white background (WCAG 1.4.11)
        </p>
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <IconProductPackage size="md" />
            <span>All Package Type Icons</span>
            <span style={styles.colorSwatch}>
              <span style={{ ...styles.swatchBox, backgroundColor: packageIconColors.default }} />
              {packageIconColors.default}
            </span>
            <span style={styles.contrastGood}>5.92:1 (passes 3:1)</span>
          </div>
        </div>
      </div>

      {/* BEFORE Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Before Fix
          <span style={{ ...styles.badge, ...styles.badgeBefore }}>FAILS WCAG</span>
        </h2>
        <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, marginBottom: spacing[4] }}>
          Icons and finished row text fail contrast requirements
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.grid}>
            <thead>
              <tr>
                <th style={styles.th}></th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Tag</th>
                <th style={styles.th}>Src_H&apos;s</th>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Strain</th>
                <th style={styles.th}>Qty</th>
              </tr>
            </thead>
            <tbody>
              {mockPackages.map((pkg) => (
                <tr
                  key={pkg.id + '-before'}
                  style={{
                    ...styles.row,
                    ...(pkg.finished ? styles.tdBeforeFinished : {}),
                  }}
                >
                  <td style={styles.td}>
                    <span style={styles.iconBefore}>
                      <IconEye size="sm" />
                    </span>
                  </td>
                  <td style={styles.td}>
                    <PackageTypeIcon type={pkg.type} useBefore />
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(pkg.finished ? styles.tdBeforeFinished : {}),
                    }}
                  >
                    {pkg.id.substring(0, 20)}...
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(pkg.finished ? styles.tdBeforeFinished : {}),
                    }}
                  >
                    {pkg.srcHs}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(pkg.finished ? styles.tdBeforeFinished : {}),
                    }}
                  >
                    {pkg.item}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(pkg.finished ? styles.tdBeforeFinished : {}),
                    }}
                  >
                    {pkg.category}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(pkg.finished ? styles.tdBeforeFinished : {}),
                    }}
                  >
                    {pkg.strain}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(pkg.finished ? styles.tdBeforeFinished : {}),
                    }}
                  >
                    {pkg.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.contrastInfo}>
          <div>
            <strong>Icon Color:</strong>{' '}
            <span style={styles.colorSwatch}>
              <span style={{ ...styles.swatchBox, backgroundColor: '#CCCCCC' }} />
              #CCCCCC
            </span>
            <span style={styles.contrastBad}> 1.60:1 (FAILS 3:1)</span>
          </div>
          <div>
            <strong>Finished Row Text:</strong>{' '}
            <span style={styles.colorSwatch}>
              <span style={{ ...styles.swatchBox, backgroundColor: '#B0B0B0' }} />
              #B0B0B0
            </span>
            <span style={styles.contrastBad}> 2.65:1 (FAILS 4.5:1)</span>
          </div>
        </div>
      </div>

      {/* AFTER Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          After Fix
          <span style={{ ...styles.badge, ...styles.badgeAfter }}>PASSES WCAG</span>
        </h2>
        <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, marginBottom: spacing[4] }}>
          Accessible colors meeting WCAG 1.4.3 (text) and 1.4.11 (non-text) requirements
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.grid}>
            <thead>
              <tr>
                <th style={styles.th}></th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Tag</th>
                <th style={styles.th}>Src_H&apos;s</th>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Strain</th>
                <th style={styles.th}>Qty</th>
              </tr>
            </thead>
            <tbody>
              {mockPackages.map((pkg) => (
                <tr
                  key={pkg.id + '-after'}
                  style={{
                    ...styles.row,
                  }}
                >
                  <td style={styles.td}>
                    <IconEye size="sm" style={{ color: colors.text.lowEmphasis.onLight }} />
                  </td>
                  <td style={styles.td}>
                    <PackageTypeIcon type={pkg.type} />
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(pkg.finished ? styles.tdAfterFinished : {}),
                    }}
                  >
                    {pkg.id.substring(0, 20)}...
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(pkg.finished ? styles.tdAfterFinished : {}),
                    }}
                  >
                    {pkg.srcHs}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(pkg.finished ? styles.tdAfterFinished : {}),
                    }}
                  >
                    {pkg.item}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(pkg.finished ? styles.tdAfterFinished : {}),
                    }}
                  >
                    {pkg.category}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(pkg.finished ? styles.tdAfterFinished : {}),
                    }}
                  >
                    {pkg.strain}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(pkg.finished ? styles.tdAfterFinished : {}),
                    }}
                  >
                    {pkg.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.contrastInfo}>
          <div>
            <strong>Icon Colors:</strong> See legend above{' '}
            <span style={styles.contrastGood}>All PASS 3:1</span>
          </div>
          <div>
            <strong>Finished Row Text:</strong>{' '}
            <span style={styles.colorSwatch}>
              <span style={{ ...styles.swatchBox, backgroundColor: colors.grid.finishedRowText }} />
              {colors.grid.finishedRowText}
            </span>
            <span style={styles.contrastGood}> 5.92:1 (PASSES 4.5:1)</span>
          </div>
        </div>
      </div>

      {/* Implementation Notes */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Implementation Notes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[6] }}>
          <div>
            <h3 style={{ ...typography.heading.h5, marginBottom: spacing[2] }}>CSS Changes</h3>
            <pre
              style={{
                backgroundColor: '#1E1E1E',
                color: '#D4D4D4',
                padding: spacing[4],
                borderRadius: borderRadius.md,
                fontSize: '12px',
                overflow: 'auto',
              }}
            >
{`.grid-finished-row {
  /* Before: color: #B0B0B0; */
  color: #595959; /* 5.92:1 contrast */
}`}
            </pre>
          </div>
          <div>
            <h3 style={{ ...typography.heading.h5, marginBottom: spacing[2] }}>Token Usage</h3>
            <pre
              style={{
                backgroundColor: '#1E1E1E',
                color: '#D4D4D4',
                padding: spacing[4],
                borderRadius: borderRadius.md,
                fontSize: '12px',
                overflow: 'auto',
              }}
            >
{`import { colors } from '@/styles/design-tokens';

// Text color for finished rows
colors.grid.finishedRowText // #595959

// Package type icon colors
colors.grid.packageIcons.tradeSample   // #0369A1
colors.grid.packageIcons.productPackage // #127A56
colors.grid.packageIcons.labSample     // #7C3AED
colors.grid.packageIcons.sourcePackage // #B45309`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackageGridComparison
