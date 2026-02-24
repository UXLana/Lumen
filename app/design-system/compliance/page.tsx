'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { StyleguideLayout } from '../shared'
import { colors, typography, fontFamilies, spacing, borderRadius, shadows } from '@/styles/design-tokens'
import { useColors } from '@/styles/themes'
import { useComplianceStore, US_STATES, calculateScore } from './lib/storage'
import { parseVPATFile } from './lib/parse-vpat'
import { analyzeReport } from './lib/analyze'
import type { VPATReport, Severity, IssueStatus } from './lib/types'

// Components
import ComplianceScoreHero from './components/ComplianceScoreHero'
import { ProductCard } from '@/components/ProductCard'
import StateDetailView from './components/StateDetailView'
import UploadZone from './components/UploadZone'

// ─── Shared Styles ──────────────────────────────────────────────────────────

const btnPrimary: React.CSSProperties = {
  padding: `${spacing.xs} ${spacing.lg}`,
  backgroundColor: colors.brand.default,
  color: colors.text.highEmphasis.onDark,
  border: 'none',
  borderRadius: borderRadius.md,
  fontFamily: fontFamilies.body,
  fontSize: typography.label.md.fontSize,
  fontWeight: 600,
  cursor: 'pointer',
}

const btnGhost: React.CSSProperties = {
  padding: `${spacing.xs} ${spacing.lg}`,
  backgroundColor: 'transparent',
  color: colors.text.lowEmphasis.onLight,
  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
  borderRadius: borderRadius.md,
  fontFamily: fontFamilies.body,
  fontSize: typography.label.md.fontSize,
  fontWeight: 600,
  cursor: 'pointer',
}

const selectBase: React.CSSProperties = {
  padding: `${spacing.xs} ${spacing.sm}`,
  borderRadius: borderRadius.md,
  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
  fontFamily: fontFamilies.body,
  fontSize: typography.body.sm.fontSize,
  backgroundColor: colors.surface.light,
  color: colors.text.highEmphasis.onLight,
  outline: 'none',
}

const sectionLabel: React.CSSProperties = {
  ...typography.label.md,
  color: colors.text.lowEmphasis.onLight,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  marginBottom: spacing.md,
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function ComplianceDashboardPage() {
  const themeColors = useColors()
  const store = useComplianceStore()

  // Selected state for detail drill-down
  const [selectedStateCode, setSelectedStateCode] = useState<string | null>(null)

  // Upload state
  const [uploadStateCode, setUploadStateCode] = useState('')
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'parsing' | 'preview' | 'done' | 'error'>('idle')
  const [parsedReport, setParsedReport] = useState<VPATReport | null>(null)
  const [uploadError, setUploadError] = useState('')
  const [showUpload, setShowUpload] = useState(false)

  // ─── Derived Data ──────────────────────────────────────────────────────────

  const { totalOpenIssues, criticalCount, resolvedCount } = useMemo(() => {
    let open = 0
    let critical = 0
    let resolved = 0
    for (const state of store.states) {
      for (const report of state.reports) {
        for (const issue of report.issues) {
          if (issue.status === 'resolved') {
            resolved++
          } else {
            open++
            if (issue.severity === 'critical' || issue.severity === 'serious') {
              critical++
            }
          }
        }
      }
    }
    return { totalOpenIssues: open, criticalCount: critical, resolvedCount: resolved }
  }, [store.states])
  // Overall score: run the same calculateScore used per-state, but across all reports
  const avgScore = useMemo(() => {
    const allReports = store.states.flatMap(s => s.reports)
    if (allReports.length === 0) return 100
    // Combine all issues and passedChecks into a single virtual report
    const combined = {
      issues: allReports.flatMap(r => r.issues),
      passedChecks: allReports.flatMap(r => r.passedChecks),
    }
    return calculateScore(combined as any)
  }, [store.states])

  const selectedState = selectedStateCode
    ? store.states.find(s => s.stateCode === selectedStateCode) ?? null
    : null

  // ─── Upload Handlers ───────────────────────────────────────────────────────

  const handleFileAccepted = useCallback(async (file: File) => {
    if (!uploadStateCode) {
      setUploadError('Please select a state first.')
      return
    }
    setUploadStatus('parsing')
    setUploadError('')
    try {
      const report = await parseVPATFile(file, uploadStateCode)
      const analyzed = analyzeReport(report)
      setParsedReport(analyzed)
      setUploadStatus('preview')
    } catch (e: any) {
      setUploadError(e.message || 'Failed to parse file.')
      setUploadStatus('error')
    }
  }, [uploadStateCode])

  const handleConfirmImport = useCallback(() => {
    if (!parsedReport || !uploadStateCode) return
    const stateExists = store.states.some(s => s.stateCode === uploadStateCode)
    if (!stateExists) {
      const stateName = US_STATES.find(s => s.code === uploadStateCode)?.name || uploadStateCode
      store.addState(uploadStateCode, stateName)
    }
    store.addReport(uploadStateCode, parsedReport)
    setUploadStatus('done')
    setParsedReport(null)
    setSelectedStateCode(uploadStateCode)
  }, [parsedReport, uploadStateCode, store])

  const handleCancelPreview = useCallback(() => {
    setUploadStatus('idle')
    setParsedReport(null)
  }, [])

  // ─── Loading State ─────────────────────────────────────────────────────────

  if (!store.isLoaded) {
    return (
      <StyleguideLayout
        title="Compliance Dashboard"
        description="Analyze VPAT reports, track accessibility issues, and generate remediation stories."
        activeId="compliance"
        tabs={[]}
      >
        <div style={{ padding: spacing['3xl'], textAlign: 'center', color: colors.text.lowEmphasis.onLight }}>
          Loading compliance data...
        </div>
      </StyleguideLayout>
    )
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <StyleguideLayout
      title="Compliance Dashboard"
      description="Analyze VPAT reports, track accessibility issues, and generate remediation stories."
      activeId="compliance"
      tabs={[]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['3xl'] }}>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TOTAL HEALTH HERO                                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <ComplianceScoreHero
          score={avgScore}
          totalIssues={totalOpenIssues}
          criticalCount={criticalCount}
          resolvedCount={resolvedCount}
        />

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* EMPTY STATE                                                    */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {store.states.length === 0 && !showUpload && (
          <div
            style={{
              padding: spacing['3xl'],
              textAlign: 'center',
              border: `1px dashed rgba(0, 0, 0, 0.15)`,
              borderRadius: borderRadius.lg,
            }}
          >
            <p style={{ ...typography.heading.h4, color: colors.text.highEmphasis.onLight, marginBottom: spacing.xs }}>
              No states tracked yet
            </p>
            <p style={{ ...typography.body.md, color: colors.text.lowEmphasis.onLight, marginBottom: spacing.lg }}>
              Upload a VPAT report to start tracking accessibility compliance by state.
            </p>
            <button onClick={() => setShowUpload(true)} style={btnPrimary}>
              Upload First Report
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* STATE HEALTH CARDS                                             */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {store.states.length > 0 && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
              <h2 style={{ ...sectionLabel, margin: 0 }}>Health by State</h2>
              <button
                onClick={() => setShowUpload(!showUpload)}
                style={{
                  ...typography.label.sm,
                  color: colors.text.action.enabled,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {showUpload ? 'Hide Upload' : '+ Upload Report'}
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: spacing.md,
              }}
            >
              {store.states.map(state => {
                const score = state.latestScore
                const statusLabel = score <= 50 ? 'Critical' : score <= 75 ? 'Needs Work' : score < 100 ? 'Good' : 'Compliant'
                const openCount = state.openIssues
                const critCount = state.criticalCount

                // Build tags from compliance data
                const tags = [
                  { label: `${score}% compliant`, variant: 'default' as const },
                  ...(critCount > 0
                    ? [{ label: `${critCount} critical`, variant: 'outlined' as const }]
                    : []),
                ]

                return (
                  <ProductCard
                    key={state.stateCode}
                    brand={statusLabel}
                    name={`${state.stateName} (${state.stateCode})`}
                    gapCount={openCount}
                    tags={tags}
                    onClick={() => setSelectedStateCode(
                      selectedStateCode === state.stateCode ? null : state.stateCode
                    )}
                    style={{ width: '100%' }}
                  />
                )
              })}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* STATE DETAIL VIEW (when a card is clicked)                     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {selectedState && (
          <StateDetailView
            state={selectedState}
            onClose={() => setSelectedStateCode(null)}
            onStatusChange={(reportId, issueId, status) => {
              store.updateIssueStatus(selectedState.stateCode, reportId, issueId, status)
            }}
            onDeleteReport={(reportId) => {
              store.removeReport(selectedState.stateCode, reportId)
            }}
          />
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* UPLOAD SECTION (inline, collapsible)                           */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {(showUpload || store.states.length === 0) && (
          <section>
            {store.states.length > 0 && (
              <h2 style={{ ...sectionLabel }}>Upload Report</h2>
            )}

            <div
              style={{
                backgroundColor: colors.surface.light,
                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                borderRadius: borderRadius.lg,
                padding: spacing.xl,
              }}
            >
              {/* State Selector */}
              <div style={{ marginBottom: spacing.md }}>
                <label
                  style={{
                    ...typography.label.sm,
                    color: colors.text.lowEmphasis.onLight,
                    display: 'block',
                    marginBottom: spacing.xs,
                  }}
                >
                  State
                </label>
                <select
                  value={uploadStateCode}
                  onChange={(e) => {
                    setUploadStateCode(e.target.value)
                    setUploadStatus('idle')
                    setParsedReport(null)
                    setUploadError('')
                  }}
                  style={{ ...selectBase, width: '100%' }}
                >
                  <option value="">Choose a state...</option>
                  {store.states.length > 0 && (
                    <optgroup label="Active States">
                      {store.states.map(s => (
                        <option key={s.stateCode} value={s.stateCode}>
                          {s.stateName} ({s.stateCode}) — {s.reports.length} reports
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Add New State">
                    {US_STATES.filter(us => !store.states.some(s => s.stateCode === us.code)).map(us => (
                      <option key={us.code} value={us.code}>{us.name} ({us.code})</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Upload Zone */}
              <UploadZone
                onFileAccepted={handleFileAccepted}
                disabled={!uploadStateCode}
                isUploading={uploadStatus === 'parsing'}
              />

              {/* Error */}
              {uploadError && (
                <p style={{ ...typography.body.sm, color: colors.text.important, marginTop: spacing.sm }}>
                  {uploadError}
                </p>
              )}

              {/* Parse Preview */}
              {uploadStatus === 'preview' && parsedReport && (
                <div
                  style={{
                    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                    borderRadius: borderRadius.md,
                    padding: spacing.lg,
                    marginTop: spacing.md,
                  }}
                >
                  <h3 style={{ ...typography.heading.h5, color: colors.text.highEmphasis.onLight, marginBottom: spacing.md }}>
                    Parse Preview
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
                    <PreviewStat label="File" value={parsedReport.sourceFileName} />
                    <PreviewStat label="Audit Date" value={parsedReport.auditDate} />
                    <PreviewStat label="Issues Found" value={String(parsedReport.issues.length)} />
                    <PreviewStat label="Score" value={`${calculateScore(parsedReport)}%`} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, marginBottom: spacing.lg }}>
                    {parsedReport.issues.map(issue => (
                      <div
                        key={issue.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                          padding: `${spacing.xs} ${spacing.sm}`,
                          backgroundColor: colors.surface.lightDarker,
                          borderRadius: borderRadius.sm,
                        }}
                      >
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                          backgroundColor:
                            issue.severity === 'critical' ? colors.status.important
                              : issue.severity === 'serious' ? colors.status.warning
                              : issue.severity === 'moderate' ? colors.status.info
                              : colors.text.disabled.onLight,
                        }} />
                        <span style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight, flex: 1 }}>
                          {issue.title}
                        </span>
                        <span style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>
                          {issue.wcagCriteria.join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: spacing.sm }}>
                    <button onClick={handleConfirmImport} style={btnPrimary}>Import Report</button>
                    <button onClick={handleCancelPreview} style={btnGhost}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Success */}
              {uploadStatus === 'done' && (
                <div
                  style={{
                    padding: spacing.md,
                    backgroundColor: colors.surface.success,
                    borderLeft: `3px solid ${colors.surfaceBorder.success}`,
                    borderRadius: borderRadius.md,
                    marginTop: spacing.md,
                  }}
                >
                  <p style={{ ...typography.body.sm, color: colors.text.success, margin: 0 }}>
                    Report imported successfully. Click the state card above to view details.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </StyleguideLayout>
  )
}

// ─── Preview Stat Helper ─────────────────────────────────────────────────────

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{
        ...typography.label.sm,
        color: colors.text.lowEmphasis.onLight,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
        marginBottom: spacing['2xs'],
      }}>
        {label}
      </div>
      <div style={{
        ...typography.body.sm,
        color: colors.text.highEmphasis.onLight,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {value}
      </div>
    </div>
  )
}
