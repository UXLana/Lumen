'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  Banner,
  Button,
  Input,
  Skeleton,
  EmptyState,
  Divider,
} from '@/components'
import { Select } from '@/components/Select'
import { ProgressBar } from '@/components/ProgressBar'
import { LinearStepper } from '@/components/Stepper'
import type { StepItem } from '@/components/Stepper'
import { type ViewState, type UseCase } from '@/app/prototypes/PrototypeToolbar'
import {
  templates,
  sampleOrders,
  tagTypeLabels,
  tagTypeColors,
  calculateReels,
  type TagTemplate,
  type ReelCalculation,
} from './data'

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_WIDTH = 1440

const WIZARD_STEPS: StepItem[] = [
  { id: 'configure', label: 'Tag Configuration', metadata: 'Select template and quantity' },
  { id: 'generate', label: 'Generate Barcodes', metadata: 'Create barcode identifiers' },
  { id: 'print', label: 'Print Settings', metadata: 'Configure reels and download' },
]

export const V2_USE_CASES: UseCase[] = [
  { label: 'UC1 — Standard batch', description: 'Operator generating ~500 barcodes for a standard order' },
  { label: 'UC2 — Large batch', description: 'Operator generating ~50,000 barcodes with detailed phased progress' },
  { label: 'UC3 — Regulator: Review', description: 'State regulator reviewing pending tag orders (read-only)' },
]

const PRINT_TEMPLATE_OPTIONS = [
  { value: 'pt-standard', label: 'Standard Label (2" × 1")' },
  { value: 'pt-continuous', label: 'Continuous Roll' },
  { value: 'pt-sheet', label: 'Sheet Labels (30/page)' },
  { value: 'pt-mini', label: 'Mini Tag (0.75" × 0.5")' },
]

const PHASE_LABELS = [
  'Validating tag sequences',
  'Generating barcodes',
  'Assembling reel packages',
]

// =============================================================================
// ICONS (inline SVGs — same Feather style as V1)
// =============================================================================

const IconDownload = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3v10m0 0l-3.5-3.5M10 13l3.5-3.5M3 15v1a1 1 0 001 1h12a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconTag = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 10.5V4a1 1 0 011-1h6.5a1 1 0 01.7.3l6.2 6.2a1 1 0 010 1.4l-6.5 6.5a1 1 0 01-1.4 0L3.3 11.2a1 1 0 01-.3-.7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="7" r="1" fill="currentColor" />
  </svg>
)

const IconPlus = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const IconQR = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="13" y="13" width="2" height="2" fill="currentColor" />
    <rect x="11" y="11" width="2" height="2" fill="currentColor" />
    <rect x="15" y="15" width="2" height="2" fill="currentColor" />
    <rect x="11" y="15" width="2" height="2" fill="currentColor" />
    <rect x="15" y="11" width="2" height="2" fill="currentColor" />
  </svg>
)

const IconCheck = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10.5l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconAlert = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 7v3M10 12.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const IconReel = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
  </svg>
)

const IconLock = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const IconBarcode = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="1.5" height="12" fill="currentColor" />
    <rect x="5" y="4" width="1" height="12" fill="currentColor" />
    <rect x="7.5" y="4" width="2" height="12" fill="currentColor" />
    <rect x="11" y="4" width="1" height="12" fill="currentColor" />
    <rect x="13.5" y="4" width="1.5" height="12" fill="currentColor" />
    <rect x="16.5" y="4" width="1.5" height="12" fill="currentColor" />
  </svg>
)

// =============================================================================
// SHARED STYLES
// =============================================================================

const pageContainerStyle: React.CSSProperties = {
  maxWidth: `${MAX_WIDTH}px`,
  margin: '0 auto',
  padding: spacing['2xl'],
  fontFamily: fontFamilies.body,
  color: colors.text.highEmphasis.onLight,
  backgroundColor: colors.surface.light,
  minHeight: '100vh',
}

const headerStyle: React.CSSProperties = {
  marginBottom: spacing.xl,
}

const breadcrumbStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.xs,
  fontSize: typography.body.sm.fontSize,
  color: colors.text.lowEmphasis.onLight,
  marginBottom: spacing.sm,
}

const breadcrumbLinkStyle: React.CSSProperties = {
  color: colors.text.action?.enabled || colors.brand.default,
  textDecoration: 'none',
  cursor: 'pointer',
}

const pageTitleStyle: React.CSSProperties = {
  fontFamily: fontFamilies.display,
  fontSize: typography.heading.h3.fontSize,
  fontWeight: fontWeights.semibold,
  color: colors.text.highEmphasis.onLight,
  margin: 0,
}

const wizardLayoutStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing['2xl'],
  alignItems: 'flex-start',
}

const stepperColumnStyle: React.CSSProperties = {
  width: '280px',
  flexShrink: 0,
}

const contentColumnStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
}

const contentCardStyle: React.CSSProperties = {
  backgroundColor: colors.surface.light,
  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
  borderRadius: borderRadiusSemantics.card,
  padding: spacing.xl,
}

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: fontFamilies.display,
  fontSize: typography.heading.h5.fontSize,
  fontWeight: fontWeights.semibold,
  color: colors.text.highEmphasis.onLight,
  margin: `0 0 ${spacing.md} 0`,
}

const templateGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: spacing.md,
}

const summaryRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${spacing.sm} 0`,
}

const summaryLabelStyle: React.CSSProperties = {
  fontSize: typography.body.md.fontSize,
  color: colors.text.lowEmphasis.onLight,
}

const summaryValueStyle: React.CSSProperties = {
  fontSize: typography.body.md.fontSize,
  fontWeight: fontWeights.semibold,
  color: colors.text.highEmphasis.onLight,
}

const footerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: spacing.sm,
  marginTop: spacing.xl,
  paddingTop: spacing.lg,
  borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
}

// =============================================================================
// TEMPLATE CARD
// =============================================================================

interface TemplateCardProps {
  template: TagTemplate
  selected: boolean
  onSelect: () => void
  disabled?: boolean
}

function TemplateCard({ template, selected, onSelect, disabled }: TemplateCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
        padding: spacing.md,
        backgroundColor: selected ? colors.selectedHighlight : hovered && !disabled ? colors.hover.onLight : colors.surface.light,
        border: `2px solid ${selected ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadiusSemantics.card,
        cursor: disabled ? 'default' : 'pointer',
        textAlign: 'left',
        transition: 'border-color 200ms ease-out, background-color 200ms ease-out',
        outline: 'none',
        width: '100%',
      }}
      aria-pressed={selected}
      aria-label={`Select template: ${template.name}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
        <IconTag size={16} />
        <span style={{
          fontFamily: fontFamilies.display,
          fontSize: typography.label.md.fontSize,
          fontWeight: fontWeights.semibold,
          color: colors.text.highEmphasis.onLight,
        }}>
          {template.name}
        </span>
      </div>
      <p style={{
        fontSize: typography.body.sm.fontSize,
        color: colors.text.lowEmphasis.onLight,
        margin: 0,
        lineHeight: 1.5,
      }}>
        {template.description}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' }}>
        <Badge color={tagTypeColors[template.tagType]} variant="outlined" size="md">
          {tagTypeLabels[template.tagType]}
        </Badge>
        {template.migrated && (
          <Badge color="warning" variant="outlined" size="md">Migrated</Badge>
        )}
        {template.lastUsed && (
          <span style={{
            fontSize: typography.body.sm.fontSize,
            color: colors.text.disabled.onLight,
            marginLeft: 'auto',
          }}>
            Last used {template.lastUsed}
          </span>
        )}
      </div>
    </button>
  )
}

// =============================================================================
// REEL CALCULATOR DISPLAY
// =============================================================================

function ReelCalculatorDisplay({ calculation }: { calculation: ReelCalculation }) {
  if (calculation.totalQuantity <= 0) return null

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: spacing.md,
      marginTop: spacing.lg,
      padding: spacing.md,
      backgroundColor: colors.surface.lightDarker,
      borderRadius: borderRadiusSemantics.card,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: fontFamilies.display,
          fontSize: typography.heading.h3.fontSize,
          fontWeight: fontWeights.bold,
          color: colors.brand.default,
        }}>
          {calculation.reelCount}
        </div>
        <div style={{
          fontSize: typography.label.sm.fontSize,
          fontWeight: fontWeights.medium,
          color: colors.text.lowEmphasis.onLight,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {calculation.reelCount === 1 ? 'Reel' : 'Reels'}
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: fontFamilies.display,
          fontSize: typography.heading.h3.fontSize,
          fontWeight: fontWeights.bold,
          color: colors.text.highEmphasis.onLight,
        }}>
          {calculation.tagsPerReel}
        </div>
        <div style={{
          fontSize: typography.label.sm.fontSize,
          fontWeight: fontWeights.medium,
          color: colors.text.lowEmphasis.onLight,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Tags / Reel
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: fontFamilies.display,
          fontSize: typography.heading.h3.fontSize,
          fontWeight: fontWeights.bold,
          color: colors.text.highEmphasis.onLight,
        }}>
          {calculation.remainder}
        </div>
        <div style={{
          fontSize: typography.label.sm.fontSize,
          fontWeight: fontWeights.medium,
          color: colors.text.lowEmphasis.onLight,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Last Reel
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// GENERATION BLOCKING OVERLAY
// =============================================================================

function GenerationOverlay({
  progress,
  totalQuantity,
  currentBarcode,
  currentReel,
  totalReels,
  isLargeBatch,
  currentPhase,
  elapsedSeconds,
}: {
  progress: number
  totalQuantity: number
  currentBarcode: number
  currentReel: number
  totalReels: number
  isLargeBatch: boolean
  currentPhase: number
  elapsedSeconds: number
}) {
  const elapsedMin = Math.floor(elapsedSeconds / 60)
  const elapsedSec = elapsedSeconds % 60
  const elapsedStr = elapsedMin > 0 ? `${elapsedMin}m ${elapsedSec}s` : `${elapsedSec}s`

  // Estimate remaining time
  const estimatedTotal = progress > 5 ? elapsedSeconds / (progress / 100) : 0
  const remaining = Math.max(0, Math.ceil(estimatedTotal - elapsedSeconds))
  const remainMin = Math.floor(remaining / 60)
  const remainSec = remaining % 60
  const remainStr = remaining > 0
    ? remainMin > 0 ? `~${remainMin}m ${remainSec}s remaining` : `~${remainSec}s remaining`
    : 'Finishing up...'

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.scrim,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role="alertdialog"
      aria-modal="true"
      aria-label="Generating barcodes — please wait"
    >
      <div style={{
        backgroundColor: colors.surface.light,
        borderRadius: borderRadiusSemantics.modal,
        padding: spacing['2xl'],
        width: '480px',
        maxWidth: '90vw',
        boxShadow: shadowSemantics.modal,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
          marginBottom: spacing.xl,
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: colors.brand.default,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            animation: 'spin 2s linear infinite',
          }}>
            <IconBarcode size={18} />
          </div>
          <div>
            <h3 style={{
              fontFamily: fontFamilies.display,
              fontSize: typography.heading.h5.fontSize,
              fontWeight: fontWeights.semibold,
              margin: 0,
              color: colors.text.highEmphasis.onLight,
            }}>
              Generating Barcodes
            </h3>
            {isLargeBatch && (
              <p style={{
                fontSize: typography.body.sm.fontSize,
                color: colors.text.lowEmphasis.onLight,
                margin: 0,
              }}>
                Phase {currentPhase + 1} of 3: {PHASE_LABELS[currentPhase]}
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: spacing.lg }}>
          <ProgressBar
            value={Math.min(progress, 100)}
            aria-label="Barcode generation progress"
            size="md"
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: spacing.xs,
          }}>
            <span style={{
              fontSize: typography.body.sm.fontSize,
              fontWeight: fontWeights.medium,
              color: colors.text.highEmphasis.onLight,
            }}>
              {Math.round(Math.min(progress, 100))}%
            </span>
            {isLargeBatch && progress > 5 && (
              <span style={{
                fontSize: typography.body.sm.fontSize,
                color: colors.text.lowEmphasis.onLight,
              }}>
                {remainStr}
              </span>
            )}
          </div>
        </div>

        {/* Detail counters */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.sm,
          padding: spacing.md,
          backgroundColor: colors.surface.lightDarker,
          borderRadius: borderRadiusSemantics.card,
          marginBottom: spacing.lg,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}>
              Barcodes
            </span>
            <span style={{
              fontSize: typography.body.md.fontSize,
              fontWeight: fontWeights.semibold,
              fontFamily: fontFamilies.mono,
              color: colors.text.highEmphasis.onLight,
            }}>
              {currentBarcode.toLocaleString()} / {totalQuantity.toLocaleString()}
            </span>
          </div>

          {totalReels > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontSize: typography.body.sm.fontSize,
                color: colors.text.lowEmphasis.onLight,
              }}>
                Reels
              </span>
              <span style={{
                fontSize: typography.body.md.fontSize,
                fontWeight: fontWeights.semibold,
                fontFamily: fontFamilies.mono,
                color: colors.text.highEmphasis.onLight,
              }}>
                {currentReel.toLocaleString()} / {totalReels.toLocaleString()}
              </span>
            </div>
          )}

          {isLargeBatch && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontSize: typography.body.sm.fontSize,
                color: colors.text.lowEmphasis.onLight,
              }}>
                Elapsed
              </span>
              <span style={{
                fontSize: typography.body.md.fontSize,
                fontWeight: fontWeights.medium,
                fontFamily: fontFamilies.mono,
                color: colors.text.lowEmphasis.onLight,
              }}>
                {elapsedStr}
              </span>
            </div>
          )}
        </div>

        {/* Warning */}
        <p style={{
          fontSize: typography.body.sm.fontSize,
          color: colors.text.lowEmphasis.onLight,
          textAlign: 'center',
          margin: 0,
        }}>
          Please wait — do not close or navigate away from this page.
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// STEP 1: TAG CONFIGURATION
// =============================================================================

function StepTagConfiguration({
  selectedTemplate,
  onSelect,
  totalQuantity,
  onTotalQuantityChange,
  generated,
  generatedCount,
  useCaseIndex,
}: {
  selectedTemplate: TagTemplate | null
  onSelect: (t: TagTemplate) => void
  totalQuantity: number
  onTotalQuantityChange: (v: number) => void
  generated: boolean
  generatedCount: number
  useCaseIndex: number
}) {
  const displayTemplates = useCaseIndex === 1
    ? templates
    : templates

  return (
    <div style={generated ? { opacity: 0.45, pointerEvents: 'none' as const } : {}}>
      {/* Disabled indicator */}
      {generated && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          marginBottom: spacing.md,
          padding: `${spacing.xs} ${spacing.sm}`,
          backgroundColor: colors.surface.lightDarker,
          borderRadius: borderRadiusSemantics.badge,
          width: 'fit-content',
        }}>
          <IconLock size={14} />
          <span style={{
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.text.lowEmphasis.onLight,
          }}>
            Configuration locked — {generatedCount.toLocaleString()} barcodes generated
          </span>
        </div>
      )}

      <h3 style={sectionTitleStyle}>Choose a Tag Template</h3>
      <p style={{
        fontSize: typography.body.md.fontSize,
        color: colors.text.lowEmphasis.onLight,
        margin: `0 0 ${spacing.md} 0`,
      }}>
        Select a template and enter the number of barcodes to generate.
      </p>

      {useCaseIndex === 1 && (
        <div style={{ marginBottom: spacing.md }}>
          <Banner
            variant="warning"
            title="These templates were migrated from a previous version of Retail ID and may contain custom logic."
            primaryAction={{ label: 'Learn more', onClick: () => {} }}
          />
        </div>
      )}

      <div style={templateGridStyle}>
        {displayTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={selectedTemplate?.id === template.id}
            onSelect={() => onSelect(template)}
            disabled={generated}
          />
        ))}

        <button
          type="button"
          disabled={generated}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            padding: spacing.xl,
            backgroundColor: colors.surface.light,
            border: `2px dashed ${colors.border.midEmphasis.onLight}`,
            borderRadius: borderRadiusSemantics.card,
            cursor: generated ? 'default' : 'pointer',
            textAlign: 'center',
            transition: 'border-color 200ms ease-out',
            minHeight: '140px',
          }}
          aria-label="Create new template"
        >
          <IconPlus size={24} />
          <span style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.label.md.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.lowEmphasis.onLight,
          }}>
            Create New Template
          </span>
        </button>
      </div>

      {/* Quantity input */}
      <div style={{ marginTop: spacing.xl, maxWidth: '320px' }}>
        <Input
          label="Total Quantity"
          type="number"
          value={totalQuantity > 0 ? String(totalQuantity) : ''}
          onChange={(value) => {
            const val = parseInt(value, 10)
            onTotalQuantityChange(isNaN(val) ? 0 : val)
          }}
          placeholder="e.g. 500"
          helperText="Total number of barcodes to generate"
          disabled={generated}
        />
      </div>
    </div>
  )
}

// =============================================================================
// STEP 2: GENERATE BARCODES
// =============================================================================

function StepGenerateBarcodes({
  selectedTemplate,
  totalQuantity,
  generated,
  generatedCount,
  generatedAt,
  onGenerate,
  canGenerate,
}: {
  selectedTemplate: TagTemplate | null
  totalQuantity: number
  generated: boolean
  generatedCount: number
  generatedAt: string
  onGenerate: () => void
  canGenerate: boolean
}) {
  if (generated) {
    // Post-generation disabled state
    return (
      <div style={{ opacity: 0.45, pointerEvents: 'none' as const }}>
        {/* Disabled indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          marginBottom: spacing.lg,
          padding: `${spacing.xs} ${spacing.sm}`,
          backgroundColor: colors.surface.lightDarker,
          borderRadius: borderRadiusSemantics.badge,
          width: 'fit-content',
        }}>
          <IconLock size={14} />
          <span style={{
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.text.lowEmphasis.onLight,
          }}>
            Generation complete
          </span>
        </div>

        {/* Success display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
          marginBottom: spacing.lg,
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: colors.status.success,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
          }}>
            <IconCheck size={24} />
          </div>
          <div>
            <div style={{
              fontFamily: fontFamilies.display,
              fontSize: typography.heading.h3.fontSize,
              fontWeight: fontWeights.bold,
              color: colors.text.highEmphasis.onLight,
            }}>
              {generatedCount.toLocaleString()} Barcodes Generated
            </div>
            <div style={{
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
              marginTop: spacing['2xs'],
            }}>
              Completed at {generatedAt}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Pre-generation: summary + CTA
  return (
    <div>
      <h3 style={sectionTitleStyle}>Generate Barcodes</h3>
      <p style={{
        fontSize: typography.body.md.fontSize,
        color: colors.text.lowEmphasis.onLight,
        margin: `0 0 ${spacing.lg} 0`,
      }}>
        Review your configuration and generate unique barcode identifiers.
      </p>

      {/* Configuration summary */}
      <div style={{
        ...contentCardStyle,
        marginBottom: spacing.xl,
      }}>
        <div style={summaryRowStyle}>
          <span style={summaryLabelStyle}>Template</span>
          <span style={summaryValueStyle}>{selectedTemplate?.name || '—'}</span>
        </div>
        <Divider />
        <div style={summaryRowStyle}>
          <span style={summaryLabelStyle}>Tag Type</span>
          <span style={summaryValueStyle}>
            {selectedTemplate ? tagTypeLabels[selectedTemplate.tagType] : '—'}
          </span>
        </div>
        <Divider />
        <div style={summaryRowStyle}>
          <span style={summaryLabelStyle}>Total Barcodes</span>
          <span style={{
            ...summaryValueStyle,
            color: colors.brand.default,
            fontSize: typography.label.md.fontSize,
          }}>
            {totalQuantity > 0 ? totalQuantity.toLocaleString() : '—'}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        <Button
          emphasis="high"
          onClick={onGenerate}
          disabled={!canGenerate}
          aria-label="Generate barcodes"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <IconBarcode size={16} />
            Generate Barcodes
          </span>
        </Button>
        {!canGenerate && (
          <span style={{
            fontSize: typography.body.sm.fontSize,
            color: colors.text.disabled.onLight,
          }}>
            Select a template and enter quantity first
          </span>
        )}
        {canGenerate && (
          <span style={{
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}>
            This will create unique barcode identifiers for each tag
          </span>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// STEP 3: PRINT SETTINGS
// =============================================================================

function StepPrintSettings({
  generated,
  useReels,
  onUseReelsChange,
  tagsPerReel,
  onTagsPerReelChange,
  reelOffset,
  onReelOffsetChange,
  printTemplate,
  onPrintTemplateChange,
  totalQuantity,
}: {
  generated: boolean
  useReels: boolean
  onUseReelsChange: (v: boolean) => void
  tagsPerReel: number
  onTagsPerReelChange: (v: number) => void
  reelOffset: number
  onReelOffsetChange: (v: number) => void
  printTemplate: string
  onPrintTemplateChange: (v: string) => void
  totalQuantity: number
}) {
  const calculation = useReels ? calculateReels(totalQuantity, tagsPerReel) : null

  return (
    <div>
      <h3 style={sectionTitleStyle}>Print Settings</h3>
      <p style={{
        fontSize: typography.body.md.fontSize,
        color: colors.text.lowEmphasis.onLight,
        margin: `0 0 ${spacing.lg} 0`,
      }}>
        Configure how barcodes are organized for printing. These settings can be changed after generation.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
        {/* Print template selector */}
        <div style={{ maxWidth: '360px' }}>
          <Select
            label="Print Template"
            options={PRINT_TEMPLATE_OPTIONS}
            value={printTemplate}
            onChange={(value) => onPrintTemplateChange(value)}
          />
          <p style={{
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
            margin: `${spacing.xs} 0 0 0`,
          }}>
            Determines label size and layout for printing.
          </p>
        </div>

        {/* Use reels toggle */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              cursor: 'pointer',
              fontSize: typography.body.md.fontSize,
              fontWeight: fontWeights.medium,
              color: colors.text.highEmphasis.onLight,
            }}
          >
            <input
              type="checkbox"
              checked={useReels}
              onChange={(e) => onUseReelsChange(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: colors.brand.default,
                cursor: 'pointer',
              }}
            />
            Organize into reels
          </label>
          <p style={{
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
            margin: `${spacing.xs} 0 0 30px`,
          }}>
            Group barcodes into physical reels for roll-based printers.
          </p>
        </div>

        {/* Reel configuration (conditional) */}
        {useReels && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: spacing.lg,
          }}>
            <Input
              label="Tags per Reel"
              type="number"
              value={tagsPerReel > 0 ? String(tagsPerReel) : ''}
              onChange={(value) => {
                const val = parseInt(value, 10)
                onTagsPerReelChange(isNaN(val) ? 0 : val)
              }}
              placeholder="e.g. 25"
              helperText="Reels auto-calculate from total quantity"
            />
            <Input
              label="Reel Offset"
              type="number"
              value={String(reelOffset)}
              onChange={(value) => {
                const val = parseInt(value, 10)
                onReelOffsetChange(isNaN(val) ? 0 : val)
              }}
              placeholder="e.g. 0"
              helperText="Starting position offset on first reel"
            />
          </div>
        )}

        {/* Reel calculator */}
        {useReels && calculation && (
          <ReelCalculatorDisplay calculation={calculation} />
        )}

        {/* Download section — only after generation */}
        {generated && (
          <>
            <Divider />
            <div>
              <h4 style={{
                fontFamily: fontFamilies.display,
                fontSize: typography.label.md.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
                margin: `0 0 ${spacing.sm} 0`,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Download
              </h4>
              <p style={{
                fontSize: typography.body.sm.fontSize,
                color: colors.text.lowEmphasis.onLight,
                margin: `0 0 ${spacing.md} 0`,
              }}>
                Download generated barcodes for printing or import.
              </p>
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <Button emphasis="high" aria-label="Download PDF file">
                  <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                    <IconDownload size={16} />
                    Download PDF
                  </span>
                </Button>
                <Button emphasis="mid" aria-label="Download DSV file">
                  <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                    <IconDownload size={16} />
                    Download DSV
                  </span>
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Pre-generation notice */}
        {!generated && (
          <div style={{
            padding: spacing.md,
            backgroundColor: colors.surface.lightDarker,
            borderRadius: borderRadiusSemantics.card,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            <IconAlert size={16} />
            <span style={{
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}>
              Download options will appear after barcodes are generated.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// REGULATOR REVIEW VIEW (same as V1)
// =============================================================================

function RegulatorReviewView() {
  return (
    <div>
      <h3 style={sectionTitleStyle}>Pending Tag Orders</h3>
      <p style={{
        fontSize: typography.body.md.fontSize,
        color: colors.text.lowEmphasis.onLight,
        margin: `0 0 ${spacing.lg} 0`,
      }}>
        Review and approve tag generation orders from licensed operators.
      </p>

      {sampleOrders.map(order => (
        <div
          key={order.orderId}
          style={{
            ...contentCardStyle,
            marginBottom: spacing.md,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginBottom: spacing['2xs'] }}>
                <span style={{
                  fontFamily: fontFamilies.mono,
                  fontSize: typography.body.sm.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                }}>
                  {order.orderId}
                </span>
                <Badge
                  color={order.status === 'complete' ? 'success' : order.status === 'pending' ? 'warning' : 'info'}
                  variant="filled"
                  size="md"
                >
                  {order.status === 'complete' ? 'Complete' : order.status === 'pending' ? 'Pending Review' : 'Generating'}
                </Badge>
              </div>
              <h4 style={{
                fontFamily: fontFamilies.display,
                fontSize: typography.label.md.fontSize,
                fontWeight: fontWeights.semibold,
                margin: `0 0 ${spacing.xs} 0`,
              }}>
                {order.templateName}
              </h4>
              <div style={{
                display: 'flex',
                gap: spacing.lg,
                fontSize: typography.body.sm.fontSize,
                color: colors.text.lowEmphasis.onLight,
              }}>
                <span>{order.totalTags.toLocaleString()} tags</span>
                <span>{order.reels} reels</span>
                <span>{order.outputFormat === 'csv+pdf' ? 'PDF + DSV' : 'DSV Only'}</span>
                <span>Submitted {new Date(order.generatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: spacing.xs }}>
              {order.status === 'pending' && (
                <>
                  <Button emphasis="high" size="md">Approve</Button>
                  <Button emphasis="low" size="md">Reject</Button>
                </>
              )}
              {order.status === 'complete' && (
                <Button emphasis="mid" size="md">
                  <span style={{ display: 'flex', alignItems: 'center', gap: spacing['2xs'] }}>
                    <IconDownload size={14} />
                    Download
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// LOADING / EMPTY / ERROR STATES
// =============================================================================

function LoadingState() {
  return (
    <div style={{ display: 'flex', gap: spacing['2xl'] }}>
      <div style={{ width: '280px', flexShrink: 0 }}>
        <Skeleton width="100%" height={300} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        <Skeleton width="40%" height={32} />
        <Skeleton width="70%" height={20} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: spacing.md,
          marginTop: spacing.md,
        }}>
          <Skeleton width="100%" height={140} />
          <Skeleton width="100%" height={140} />
          <Skeleton width="100%" height={140} />
        </div>
      </div>
    </div>
  )
}

function EmptyStateView() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: spacing['4xl'] }}>
      <EmptyState
        icon={<IconTag size={48} />}
        title="No tag templates found"
        description="Create a new tag template to start generating barcodes for your products."
        action={
          <Button emphasis="high">
            <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              <IconPlus size={16} />
              Create Template
            </span>
          </Button>
        }
      />
    </div>
  )
}

function ErrorState() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: spacing['4xl'] }}>
      <EmptyState
        icon={<IconAlert size={48} />}
        title="Failed to load templates"
        description="We couldn't load your tag templates. Please try again or contact support if the issue persists."
        action={
          <Button emphasis="high" onClick={() => window.location.reload()}>
            Retry
          </Button>
        }
      />
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export interface TagGeneratorV2Props {
  viewState: ViewState
  activeUseCase: number
}

export default function TagGeneratorV2({ viewState, activeUseCase }: TagGeneratorV2Props) {
  // Step navigation
  const [activeStep, setActiveStep] = useState(0)

  // Step 1: Tag Configuration
  const [selectedTemplate, setSelectedTemplate] = useState<TagTemplate | null>(null)
  const [totalQuantity, setTotalQuantity] = useState(0)

  // Step 2: Generation
  const [generating, setGenerating] = useState(false)
  const [generateProgress, setGenerateProgress] = useState(0)
  const [generated, setGenerated] = useState(false)
  const [generatedCount, setGeneratedCount] = useState(0)
  const [generatedAt, setGeneratedAt] = useState('')

  // Generation detail (UC2 large batch)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [currentBarcode, setCurrentBarcode] = useState(0)
  const [currentReel, setCurrentReel] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const generationStartRef = useRef(0)

  // Step 3: Print Settings
  const [useReels, setUseReels] = useState(true)
  const [tagsPerReel, setTagsPerReel] = useState(25)
  const [reelOffset, setReelOffset] = useState(0)
  const [printTemplate, setPrintTemplate] = useState('pt-standard')

  // Derived
  const isLargeBatch = activeUseCase === 1
  const calculation = useReels ? calculateReels(totalQuantity, tagsPerReel) : null
  const canGenerate = selectedTemplate !== null && totalQuantity > 0

  // Template selection handler
  const handleTemplateSelect = (template: TagTemplate) => {
    setSelectedTemplate(template)
    setTagsPerReel(template.tagsPerReel)
  }

  // Start generation
  const handleGenerate = () => {
    setGenerating(true)
    setGenerateProgress(0)
    setCurrentPhase(0)
    setCurrentBarcode(0)
    setCurrentReel(0)
    setElapsedSeconds(0)
    generationStartRef.current = Date.now()
  }

  // Finish generation
  const finishGeneration = () => {
    setGenerating(false)
    setGenerated(true)
    setGeneratedCount(totalQuantity)
    setGeneratedAt(new Date().toLocaleTimeString())
    setActiveStep(2) // Navigate to Print Settings
  }

  // Progress simulation
  useEffect(() => {
    if (!generating) return

    const targetCount = totalQuantity
    const targetReels = calculation?.reelCount || 0

    const interval = setInterval(() => {
      setGenerateProgress(prev => {
        const increment = isLargeBatch
          ? (Math.random() * 2 + 0.5)   // Slow for large batch
          : (Math.random() * 10 + 3)    // Fast for standard

        const next = Math.min(prev + increment, 100)

        // Update phase for large batch
        if (isLargeBatch) {
          if (next < 10) setCurrentPhase(0)
          else if (next < 85) setCurrentPhase(1)
          else setCurrentPhase(2)
        }

        // Update counters
        setCurrentBarcode(Math.floor(next / 100 * targetCount))
        if (targetReels > 0) {
          setCurrentReel(Math.floor(next / 100 * targetReels))
        }

        if (next >= 100) {
          clearInterval(interval)
          // Use setTimeout to let the 100% render before finishing
          setTimeout(() => finishGeneration(), 500)
        }

        return next
      })
    }, 200)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generating])

  // Elapsed time counter
  useEffect(() => {
    if (!generating) return

    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - generationStartRef.current) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [generating])

  // Reset on use case change
  useEffect(() => {
    setActiveStep(0)
    setSelectedTemplate(null)
    setGenerating(false)
    setGenerateProgress(0)
    setGenerated(false)
    setGeneratedCount(0)
    setGeneratedAt('')
    setCurrentPhase(0)
    setCurrentBarcode(0)
    setCurrentReel(0)
    setElapsedSeconds(0)
    setUseReels(true)
    setReelOffset(0)
    setPrintTemplate('pt-standard')

    // Pre-fill for large batch use case
    if (activeUseCase === 1) {
      setTotalQuantity(50000)
      setSelectedTemplate(templates[0])
      setTagsPerReel(100)
    } else {
      setTotalQuantity(0)
      setTagsPerReel(25)
    }
  }, [activeUseCase])

  // Step navigation
  const handleStepChange = (step: number) => {
    // Allow navigating to disabled steps (view-only) or active step 3
    setActiveStep(step)
  }

  const handleNext = () => {
    if (activeStep < 2) setActiveStep(activeStep + 1)
  }

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1)
  }

  // Footer button logic
  const getFooterButtons = () => {
    if (generated && activeStep === 2) return null // No footer — downloads are inline
    if (generated) return null // Steps 0 and 1 are disabled, no footer needed

    const buttons: React.ReactNode[] = []

    if (activeStep > 0) {
      buttons.push(
        <Button key="back" emphasis="low" onClick={handleBack}>
          Back
        </Button>
      )
    }

    if (activeStep === 0) {
      buttons.push(
        <Button
          key="continue"
          emphasis="high"
          onClick={handleNext}
          disabled={!selectedTemplate || totalQuantity <= 0}
        >
          Continue
        </Button>
      )
    }

    if (activeStep === 1) {
      buttons.push(
        <Button
          key="generate"
          emphasis="high"
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <IconBarcode size={16} />
            Generate Barcodes
          </span>
        </Button>
      )
    }

    if (activeStep === 2 && !generated) {
      buttons.push(
        <Button key="back-to-gen" emphasis="low" onClick={handleBack}>
          Back
        </Button>
      )
    }

    return buttons.length > 0 ? buttons : null
  }

  // ─── VIEW STATE RENDERS ────────────────────────────────────────

  if (viewState === 'loading') return (
    <div style={pageContainerStyle}>
      <div style={headerStyle}>
        <div style={breadcrumbStyle}>
          <span style={breadcrumbLinkStyle}>Templates</span>
          <span>/</span>
          <span>Generate Barcodes</span>
        </div>
        <h1 style={pageTitleStyle}>Generate Barcodes</h1>
      </div>
      <LoadingState />
    </div>
  )

  if (viewState === 'empty') return (
    <div style={pageContainerStyle}>
      <div style={headerStyle}>
        <div style={breadcrumbStyle}>
          <span style={breadcrumbLinkStyle}>Templates</span>
          <span>/</span>
          <span>Generate Barcodes</span>
        </div>
        <h1 style={pageTitleStyle}>Generate Barcodes</h1>
      </div>
      <EmptyStateView />
    </div>
  )

  if (viewState === 'error') return (
    <div style={pageContainerStyle}>
      <div style={headerStyle}>
        <div style={breadcrumbStyle}>
          <span style={breadcrumbLinkStyle}>Templates</span>
          <span>/</span>
          <span>Generate Barcodes</span>
        </div>
        <h1 style={pageTitleStyle}>Generate Barcodes</h1>
      </div>
      <ErrorState />
    </div>
  )

  // UC3: Regulator view
  if (activeUseCase === 2) return (
    <div style={pageContainerStyle}>
      <div style={headerStyle}>
        <div style={breadcrumbStyle}>
          <span style={breadcrumbLinkStyle}>Tag Management</span>
          <span>/</span>
          <span>Order Review</span>
        </div>
        <h1 style={pageTitleStyle}>Tag Order Review</h1>
      </div>
      <RegulatorReviewView />
    </div>
  )

  // ─── OPERATOR WIZARD (UC1 & UC2) ──────────────────────────────

  const stepContent = [
    <StepTagConfiguration
      key="config"
      selectedTemplate={selectedTemplate}
      onSelect={handleTemplateSelect}
      totalQuantity={totalQuantity}
      onTotalQuantityChange={setTotalQuantity}
      generated={generated}
      generatedCount={generatedCount}
      useCaseIndex={activeUseCase}
    />,
    <StepGenerateBarcodes
      key="generate"
      selectedTemplate={selectedTemplate}
      totalQuantity={totalQuantity}
      generated={generated}
      generatedCount={generatedCount}
      generatedAt={generatedAt}
      onGenerate={handleGenerate}
      canGenerate={canGenerate}
    />,
    <StepPrintSettings
      key="print"
      generated={generated}
      useReels={useReels}
      onUseReelsChange={setUseReels}
      tagsPerReel={tagsPerReel}
      onTagsPerReelChange={setTagsPerReel}
      reelOffset={reelOffset}
      onReelOffsetChange={setReelOffset}
      printTemplate={printTemplate}
      onPrintTemplateChange={setPrintTemplate}
      totalQuantity={totalQuantity}
    />,
  ]

  const footerButtons = getFooterButtons()

  return (
    <div style={pageContainerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={breadcrumbStyle}>
          <span style={breadcrumbLinkStyle}>Templates</span>
          <span>/</span>
          <span>Generate Barcodes</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={pageTitleStyle}>Generate Barcodes</h1>
          {generated && (
            <Button
              emphasis="low"
              size="md"
              onClick={() => {
                setActiveStep(0)
                setSelectedTemplate(null)
                setTotalQuantity(activeUseCase === 1 ? 50000 : 0)
                setGenerated(false)
                setGeneratedCount(0)
                setGeneratedAt('')
                setGenerateProgress(0)
                if (activeUseCase === 1) {
                  setSelectedTemplate(templates[0])
                  setTagsPerReel(100)
                } else {
                  setTagsPerReel(25)
                }
              }}
              aria-label="Start a new batch"
            >
              + New Batch
            </Button>
          )}
        </div>
      </div>

      {/* Wizard layout */}
      <div style={wizardLayoutStyle}>
        {/* Left: Stepper */}
        <div style={stepperColumnStyle}>
          <LinearStepper
            steps={WIZARD_STEPS}
            activeStep={generated ? 2 : activeStep}
            onStepChange={handleStepChange}
            clickable
          />
        </div>

        {/* Right: Content */}
        <div style={contentColumnStyle}>
          <div style={contentCardStyle}>
            {stepContent[activeStep]}
          </div>

          {/* Footer */}
          {footerButtons && (
            <div style={footerStyle}>
              {footerButtons}
            </div>
          )}
        </div>
      </div>

      {/* Full-screen blocking overlay during generation */}
      {generating && (
        <GenerationOverlay
          progress={generateProgress}
          totalQuantity={totalQuantity}
          currentBarcode={currentBarcode}
          currentReel={currentReel}
          totalReels={calculation?.reelCount || 0}
          isLargeBatch={isLargeBatch}
          currentPhase={currentPhase}
          elapsedSeconds={elapsedSeconds}
        />
      )}
    </div>
  )
}
