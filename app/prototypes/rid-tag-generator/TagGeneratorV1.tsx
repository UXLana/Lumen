'use client'

import React, { useState, useEffect } from 'react'
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
  { id: 'template', label: 'Select Template', metadata: 'Choose or create a tag template' },
  { id: 'configure', label: 'Configure Order', metadata: 'Set quantity and reel options' },
  { id: 'review', label: 'Review & Generate', metadata: 'Confirm and generate QR codes' },
  { id: 'download', label: 'Download', metadata: 'Download your files' },
]

export const USE_CASES: UseCase[] = [
  { label: 'UC1 — Operator: New order', description: 'Licensed operator creating a fresh tag order from a template' },
  { label: 'UC2 — Operator: Migrated template', description: 'Operator using a template migrated from previous RID version' },
  { label: 'UC3 — Regulator: Review', description: 'State regulator reviewing pending tag orders (read-only)' },
]

const OUTPUT_FORMAT_OPTIONS = [
  { value: 'csv+pdf', label: 'CSV + PDF' },
  { value: 'csv', label: 'CSV Only' },
]

// =============================================================================
// ICONS (inline SVGs for this prototype)
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
}

function TemplateCard({ template, selected, onSelect }: TemplateCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
        padding: spacing.md,
        backgroundColor: selected ? colors.selectedHighlight : hovered ? colors.hover.onLight : colors.surface.light,
        border: `2px solid ${selected ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadiusSemantics.card,
        cursor: 'pointer',
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
        <Badge
          color={tagTypeColors[template.tagType]}
          variant="outlined"
          size="sm"
        >
          {tagTypeLabels[template.tagType]}
        </Badge>
        {template.migrated && (
          <Badge color="warning" variant="outlined" size="sm">Migrated</Badge>
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
// STEP CONTENT COMPONENTS
// =============================================================================

// Step 1: Select Template
function StepSelectTemplate({
  selectedTemplate,
  onSelect,
  useCaseIndex,
}: {
  selectedTemplate: TagTemplate | null
  onSelect: (t: TagTemplate) => void
  useCaseIndex: number
}) {
  const displayTemplates = useCaseIndex === 1
    ? templates.filter(t => t.migrated)
    : templates

  return (
    <div>
      <h3 style={sectionTitleStyle}>Choose a Tag Template</h3>
      <p style={{
        fontSize: typography.body.md.fontSize,
        color: colors.text.lowEmphasis.onLight,
        margin: `0 0 ${spacing.md} 0`,
      }}>
        Select a template to configure your tag order, or create a new one.
      </p>

      {useCaseIndex === 1 && (
        <div style={{ marginBottom: spacing.md }}>
          <Banner
            variant="warning"
            title="These templates were migrated from a previous version of Retail ID and may contain custom logic."
            primaryAction={{
              label: 'Learn more',
              onClick: () => {},
            }}
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
          />
        ))}

        {/* Create New Template card */}
        <button
          type="button"
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
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'border-color 200ms ease-out, background-color 200ms ease-out',
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
    </div>
  )
}

// Step 2: Configure Order
function StepConfigureOrder({
  selectedTemplate,
  totalQuantity,
  onTotalQuantityChange,
  tagsPerReel,
  onTagsPerReelChange,
  outputFormat,
  onOutputFormatChange,
  calculation,
}: {
  selectedTemplate: TagTemplate | null
  totalQuantity: number
  onTotalQuantityChange: (v: number) => void
  tagsPerReel: number
  onTagsPerReelChange: (v: number) => void
  outputFormat: string
  onOutputFormatChange: (v: string) => void
  calculation: ReelCalculation
}) {
  return (
    <div>
      <h3 style={sectionTitleStyle}>Configure Tag Order</h3>

      {selectedTemplate && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          marginBottom: spacing.lg,
          padding: spacing.sm,
          backgroundColor: colors.surface.lightDarker,
          borderRadius: borderRadiusSemantics.card,
        }}>
          <IconTag size={16} />
          <span style={{
            fontSize: typography.body.md.fontSize,
            fontWeight: fontWeights.medium,
          }}>
            Template: {selectedTemplate.name}
          </span>
          <Badge
            color={tagTypeColors[selectedTemplate.tagType]}
            variant="outlined"
            size="sm"
          >
            {tagTypeLabels[selectedTemplate.tagType]}
          </Badge>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
          <Input
            label="Total Quantity"
            type="number"
            value={totalQuantity > 0 ? String(totalQuantity) : ''}
            onChange={(value) => {
              const val = parseInt(value, 10)
              onTotalQuantityChange(isNaN(val) ? 0 : val)
            }}
            placeholder="e.g. 500"
            helperText="Total number of tags to generate"
          />
          <Input
            label="Tags per Reel"
            type="number"
            value={tagsPerReel > 0 ? String(tagsPerReel) : ''}
            onChange={(value) => {
              const val = parseInt(value, 10)
              onTagsPerReelChange(isNaN(val) ? 0 : val)
            }}
            placeholder="e.g. 20"
            helperText="Number of tags wound on each reel"
          />
        </div>

        <div style={{ maxWidth: '320px' }}>
          <Select
            label="Output Format"
            options={OUTPUT_FORMAT_OPTIONS}
            value={outputFormat}
            onChange={(value) => onOutputFormatChange(value)}
          />
          <p style={{
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
            margin: `${spacing.xs} 0 0 0`,
          }}>
            CSV is always generated. PDF includes printable tag sheets with QR codes.
          </p>
        </div>

        <ReelCalculatorDisplay calculation={calculation} />
      </div>
    </div>
  )
}

// Step 3: Review & Generate
function StepReviewGenerate({
  selectedTemplate,
  calculation,
  outputFormat,
  generating,
  generateProgress,
  onGenerate,
}: {
  selectedTemplate: TagTemplate | null
  calculation: ReelCalculation
  outputFormat: string
  generating: boolean
  generateProgress: number
  onGenerate: () => void
}) {
  return (
    <div>
      <h3 style={sectionTitleStyle}>Review & Generate</h3>
      <p style={{
        fontSize: typography.body.md.fontSize,
        color: colors.text.lowEmphasis.onLight,
        margin: `0 0 ${spacing.lg} 0`,
      }}>
        Review your order details and generate QR codes with unique identifiers.
      </p>

      <div style={{
        ...contentCardStyle,
        marginBottom: spacing.lg,
      }}>
        <div>
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
            <span style={summaryLabelStyle}>Total Tags</span>
            <span style={summaryValueStyle}>
              {calculation.totalQuantity.toLocaleString()}
            </span>
          </div>
          <Divider />
          <div style={summaryRowStyle}>
            <span style={summaryLabelStyle}>Tags per Reel</span>
            <span style={summaryValueStyle}>{calculation.tagsPerReel}</span>
          </div>
          <Divider />
          <div style={summaryRowStyle}>
            <span style={summaryLabelStyle}>Total Reels</span>
            <span style={{
              ...summaryValueStyle,
              color: colors.brand.default,
            }}>
              {calculation.reelCount}
            </span>
          </div>
          <Divider />
          <div style={summaryRowStyle}>
            <span style={summaryLabelStyle}>Last Reel Count</span>
            <span style={summaryValueStyle}>
              {calculation.remainder} tags
            </span>
          </div>
          <Divider />
          <div style={summaryRowStyle}>
            <span style={summaryLabelStyle}>Output Format</span>
            <span style={summaryValueStyle}>
              {outputFormat === 'csv+pdf' ? 'CSV + PDF' : 'CSV Only'}
            </span>
          </div>
        </div>
      </div>

      {generating ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <IconQR size={16} />
            <span style={{
              fontSize: typography.body.md.fontSize,
              fontWeight: fontWeights.medium,
            }}>
              Generating QR codes and unique identifiers...
            </span>
          </div>
          <ProgressBar
            value={generateProgress}
            aria-label="Tag generation progress"
            size="md"
          />
          <span style={{
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}>
            {Math.round(generateProgress)}% complete — {Math.round(calculation.totalQuantity * generateProgress / 100).toLocaleString()} of {calculation.totalQuantity.toLocaleString()} tags
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <Button
            emphasis="high"
            onClick={onGenerate}
            aria-label="Generate tags"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              <IconQR size={16} />
              Generate {calculation.totalQuantity.toLocaleString()} Tags
            </span>
          </Button>
          <span style={{
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}>
            This will create unique QR codes for each tag
          </span>
        </div>
      )}
    </div>
  )
}

// Step 4: Download
function StepDownload({
  selectedTemplate,
  calculation,
  outputFormat,
}: {
  selectedTemplate: TagTemplate | null
  calculation: ReelCalculation
  outputFormat: string
}) {
  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.lg,
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: colors.status.success,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
        }}>
          <IconCheck size={20} />
        </div>
        <div>
          <h3 style={{ ...sectionTitleStyle, marginBottom: 0 }}>
            Generation Complete
          </h3>
          <p style={{
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
            margin: 0,
          }}>
            {calculation.totalQuantity.toLocaleString()} tags generated across {calculation.reelCount} {calculation.reelCount === 1 ? 'reel' : 'reels'}
          </p>
        </div>
      </div>

      <div style={{
        ...contentCardStyle,
        marginBottom: spacing.lg,
      }}>
        <h4 style={{
          fontFamily: fontFamilies.display,
          fontSize: typography.label.md.fontSize,
          fontWeight: fontWeights.semibold,
          color: colors.text.highEmphasis.onLight,
          margin: `0 0 ${spacing.md} 0`,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Order Summary
        </h4>
        <div style={summaryRowStyle}>
          <span style={summaryLabelStyle}>Order ID</span>
          <span style={{
            ...summaryValueStyle,
            fontFamily: fontFamilies.mono,
            fontSize: typography.body.sm.fontSize,
          }}>
            ORD-2026-0344
          </span>
        </div>
        <Divider />
        <div style={summaryRowStyle}>
          <span style={summaryLabelStyle}>Template</span>
          <span style={summaryValueStyle}>{selectedTemplate?.name || '—'}</span>
        </div>
        <Divider />
        <div style={summaryRowStyle}>
          <span style={summaryLabelStyle}>Total Tags</span>
          <span style={summaryValueStyle}>{calculation.totalQuantity.toLocaleString()}</span>
        </div>
        <Divider />
        <div style={summaryRowStyle}>
          <span style={summaryLabelStyle}>Reels</span>
          <span style={summaryValueStyle}>{calculation.reelCount}</span>
        </div>
        <Divider />
        <div style={summaryRowStyle}>
          <span style={summaryLabelStyle}>Generated</span>
          <span style={summaryValueStyle}>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Reel breakdown */}
      <div style={{
        ...contentCardStyle,
        marginBottom: spacing.lg,
      }}>
        <h4 style={{
          fontFamily: fontFamilies.display,
          fontSize: typography.label.md.fontSize,
          fontWeight: fontWeights.semibold,
          margin: `0 0 ${spacing.md} 0`,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Reel Breakdown
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: spacing.xs,
        }}>
          {Array.from({ length: Math.min(calculation.reelCount, 12) }).map((_, i) => {
            const isLastReel = i === calculation.reelCount - 1
            const tagsOnReel = isLastReel ? calculation.remainder : calculation.tagsPerReel
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing['2xs'],
                  padding: `${spacing['2xs']} ${spacing.xs}`,
                  backgroundColor: colors.surface.lightDarker,
                  borderRadius: borderRadiusSemantics.badge,
                  fontSize: typography.body.sm.fontSize,
                }}
              >
                <IconReel size={16} />
                <span style={{ fontWeight: fontWeights.medium }}>Reel {i + 1}</span>
                <span style={{ color: colors.text.lowEmphasis.onLight, marginLeft: 'auto' }}>
                  {tagsOnReel}
                </span>
              </div>
            )
          })}
          {calculation.reelCount > 12 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: `${spacing['2xs']} ${spacing.xs}`,
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}>
              +{calculation.reelCount - 12} more
            </div>
          )}
        </div>
      </div>

      {/* Download buttons */}
      <div style={{
        display: 'flex',
        gap: spacing.sm,
        alignItems: 'center',
      }}>
        <Button emphasis="high" aria-label="Download CSV file">
          <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <IconDownload size={16} />
            Download CSV
          </span>
        </Button>
        {outputFormat === 'csv+pdf' && (
          <Button emphasis="mid" aria-label="Download PDF file">
            <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              <IconDownload size={16} />
              Download PDF
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// REGULATOR REVIEW VIEW
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
                  size="sm"
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
                <span>{order.outputFormat === 'csv+pdf' ? 'CSV + PDF' : 'CSV Only'}</span>
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
// LOADING STATE
// =============================================================================

function LoadingState() {
  return (
    <div style={{ display: 'flex', gap: spacing['2xl'] }}>
      <div style={{ width: '280px', flexShrink: 0 }}>
        <Skeleton width="100%" height={400} />
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

// =============================================================================
// EMPTY STATE
// =============================================================================

function EmptyStateView() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: spacing['4xl'] }}>
      <EmptyState
        icon={<IconTag size={48} />}
        title="No tag templates found"
        description="Create a new tag template to start generating QR-coded tags for your products."
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

// =============================================================================
// ERROR STATE
// =============================================================================

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
// MAIN PAGE
// =============================================================================

export interface TagGeneratorV1Props {
  viewState: ViewState
  activeUseCase: number
}

export default function TagGeneratorV1({ viewState, activeUseCase }: TagGeneratorV1Props) {
  // Wizard state
  const [activeStep, setActiveStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<TagTemplate | null>(null)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [tagsPerReel, setTagsPerReel] = useState(20)
  const [outputFormat, setOutputFormat] = useState('csv+pdf')
  const [generating, setGenerating] = useState(false)
  const [generateProgress, setGenerateProgress] = useState(0)
  const [generationComplete, setGenerationComplete] = useState(false)

  // Calculate reels
  const calculation = calculateReels(totalQuantity, tagsPerReel)

  // When template is selected, default tagsPerReel from template
  const handleTemplateSelect = (template: TagTemplate) => {
    setSelectedTemplate(template)
    setTagsPerReel(template.tagsPerReel)
  }

  // Simulate generation progress
  const handleGenerate = () => {
    setGenerating(true)
    setGenerateProgress(0)
  }

  useEffect(() => {
    if (!generating) return

    const interval = setInterval(() => {
      setGenerateProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setGenerating(false)
          setGenerationComplete(true)
          setActiveStep(3)
          return 100
        }
        return prev + Math.random() * 8 + 2
      })
    }, 200)

    return () => clearInterval(interval)
  }, [generating])

  // Reset when use case changes
  useEffect(() => {
    setActiveStep(0)
    setSelectedTemplate(null)
    setTotalQuantity(0)
    setTagsPerReel(20)
    setOutputFormat('csv+pdf')
    setGenerating(false)
    setGenerateProgress(0)
    setGenerationComplete(false)
  }, [activeUseCase])

  // Navigation handlers
  const handleNext = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const canProceed = (): boolean => {
    switch (activeStep) {
      case 0: return selectedTemplate !== null
      case 1: return totalQuantity > 0 && tagsPerReel > 0
      case 2: return generationComplete
      default: return false
    }
  }

  // Render view states
  if (viewState === 'loading') return (
    <div style={pageContainerStyle}>
      <div style={headerStyle}>
        <div style={breadcrumbStyle}>
          <span style={breadcrumbLinkStyle}>Templates</span>
          <span>/</span>
          <span>Generate Tags</span>
        </div>
        <h1 style={pageTitleStyle}>Generate Tags</h1>
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
          <span>Generate Tags</span>
        </div>
        <h1 style={pageTitleStyle}>Generate Tags</h1>
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
          <span>Generate Tags</span>
        </div>
        <h1 style={pageTitleStyle}>Generate Tags</h1>
      </div>
      <ErrorState />
    </div>
  )

  // UC3: Regulator view (no wizard)
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

  // Default: Operator wizard (UC1 & UC2)
  const stepContent = [
    <StepSelectTemplate
      key="template"
      selectedTemplate={selectedTemplate}
      onSelect={handleTemplateSelect}
      useCaseIndex={activeUseCase}
    />,
    <StepConfigureOrder
      key="configure"
      selectedTemplate={selectedTemplate}
      totalQuantity={totalQuantity}
      onTotalQuantityChange={setTotalQuantity}
      tagsPerReel={tagsPerReel}
      onTagsPerReelChange={setTagsPerReel}
      outputFormat={outputFormat}
      onOutputFormatChange={setOutputFormat}
      calculation={calculation}
    />,
    <StepReviewGenerate
      key="review"
      selectedTemplate={selectedTemplate}
      calculation={calculation}
      outputFormat={outputFormat}
      generating={generating}
      generateProgress={generateProgress}
      onGenerate={handleGenerate}
    />,
    <StepDownload
      key="download"
      selectedTemplate={selectedTemplate}
      calculation={calculation}
      outputFormat={outputFormat}
    />,
  ]

  return (
    <div style={pageContainerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={breadcrumbStyle}>
          <span style={breadcrumbLinkStyle}>Templates</span>
          <span>/</span>
          <span>Generate Tags</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={pageTitleStyle}>Generate Tags</h1>
          {activeUseCase === 1 && selectedTemplate?.migrated && (
            <Badge color="warning" variant="outlined">Migrated Template</Badge>
          )}
        </div>
      </div>

      {/* Wizard layout: Stepper + Content */}
      <div style={wizardLayoutStyle}>
        {/* Left: Stepper navigation */}
        <div style={stepperColumnStyle}>
          <LinearStepper
            steps={WIZARD_STEPS}
            activeStep={activeStep}
            onStepChange={setActiveStep}
            clickable
          />
        </div>

        {/* Right: Step content */}
        <div style={contentColumnStyle}>
          <div style={contentCardStyle}>
            {stepContent[activeStep]}
          </div>

          {/* Footer navigation */}
          {activeStep < 3 && (
            <div style={footerStyle}>
              {activeStep > 0 && (
                <Button emphasis="low" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button
                emphasis="high"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {activeStep === 2 ? 'Generate' : 'Continue'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Prototype Toolbar */}
    </div>
  )
}
