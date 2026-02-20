'use client'

import { useState, useMemo, useEffect } from 'react'
import { colors, typography, fontFamilies, spacing, borderRadius, shadows, transitionPresets } from '@/styles/design-tokens'
import type { StateCompliance, VPATIssue, Severity, IssueStatus } from '../lib/types'
import { categorizeIssues, prioritizeRemediation, refreshAnalysis, scoreReport } from '../lib/analyze'
import { generateAllStories, exportAllStoriesMarkdown } from '../lib/generate-jira-stories'
import SeverityDot from './SeverityDot'
import IssueDetailPanel from './IssueDetailPanel'
import JiraStoryCard from './JiraStoryCard'
import type { EnrichedIssue } from './IssuesTable'

interface StateDetailViewProps {
  state: StateCompliance
  onClose: () => void
  onStatusChange: (reportId: string, issueId: string, status: IssueStatus) => void
  onDeleteReport: (reportId: string) => void
}

type DetailTab = 'issues' | 'reports' | 'jira'

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: `${spacing[2]} ${spacing[4]}`,
  backgroundColor: active ? colors.brand.default : 'transparent',
  color: active ? colors.text.highEmphasis.onDark : colors.text.lowEmphasis.onLight,
  border: `1px solid ${active ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
  borderRadius: borderRadius.md,
  fontFamily: fontFamilies.body,
  fontSize: typography.label.sm.fontSize,
  fontWeight: active ? 600 : 400,
  cursor: 'pointer',
  transition: `all 150ms ease-out`,
})

const thStyle: React.CSSProperties = {
  ...typography.label.sm,
  color: colors.text.lowEmphasis.onLight,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  padding: `${spacing[3]} ${spacing[4]}`,
  textAlign: 'left',
  backgroundColor: colors.surface.lightDarker,
  borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
  fontWeight: 500,
}

const tdStyle: React.CSSProperties = {
  padding: `${spacing[3]} ${spacing[4]}`,
  borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
  verticalAlign: 'middle',
}

const effortColors: Record<string, { bg: string; text: string }> = {
  low: { bg: colors.surface.success, text: colors.text.success },
  medium: { bg: colors.surface.warning, text: colors.text.warning },
  high: { bg: colors.surface.important, text: colors.text.important },
}

export default function StateDetailView({ state, onClose, onStatusChange, onDeleteReport }: StateDetailViewProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('issues')
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null)
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null)
  const [severityFilter, setSeverityFilter] = useState<Severity[]>([])

  // Lock body scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Enrich all issues from this state
  const allIssues: EnrichedIssue[] = useMemo(() =>
    state.reports.flatMap(report =>
      report.issues.map(issue => ({
        ...refreshAnalysis(issue),
        _reportId: report.id,
        _stateCode: state.stateCode,
        _reportName: report.sourceFileName,
      }))
    ),
    [state]
  )

  const openIssues = allIssues.filter(i => i.status !== 'resolved')
  const criticalCount = openIssues.filter(i => i.severity === 'critical' || i.severity === 'serious').length

  // WCAG Categories
  const cats = useMemo(() => categorizeIssues(openIssues), [openIssues])
  const catCounts = {
    Perceivable: cats.Perceivable.length,
    Operable: cats.Operable.length,
    Understandable: cats.Understandable.length,
    Robust: cats.Robust.length,
  }
  const maxCat = Math.max(...Object.values(catCounts), 1)

  const priorities = useMemo(() => prioritizeRemediation(openIssues).slice(0, 5), [openIssues])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${state.stateName} compliance details`}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '85vw',
          maxWidth: 1400,
          backgroundColor: colors.surface.light,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: `${spacing[5]} ${spacing[8]}`,
            borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing[2] }}>
              <h2 style={{ ...typography.heading.h3, color: colors.text.highEmphasis.onLight, margin: 0 }}>
                {state.stateName}
              </h2>
              <span style={{ ...typography.body.md, color: colors.text.lowEmphasis.onLight }}>
                {state.stateCode}
              </span>
            </div>
            <div style={{ display: 'flex', gap: spacing[4], marginTop: spacing[2] }}>
              <span style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight }}>
                Score: <strong style={{ color: getScoreColor(state.latestScore) }}>{state.latestScore}%</strong>
              </span>
              <span style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight }}>
                {openIssues.length} open issues
              </span>
              {criticalCount > 0 && (
                <span style={{ ...typography.body.sm, color: colors.status.important }}>
                  {criticalCount} critical/serious
                </span>
              )}
              <span style={{ ...typography.body.sm, color: colors.text.disabled.onLight }}>
                {state.reports.length} reports
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close detail view"
            style={{
              background: 'none',
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadius.md,
              cursor: 'pointer',
              fontSize: 16,
              color: colors.text.lowEmphasis.onLight,
              padding: `${spacing[1]} ${spacing[3]}`,
              fontFamily: fontFamilies.body,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <span style={{ fontSize: 14 }}>Esc</span>
            <span>✕</span>
          </button>
        </div>

        {/* WCAG Category Bars */}
        <div
          style={{
            padding: `${spacing[4]} ${spacing[8]}`,
            borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: spacing[4],
            flexShrink: 0,
          }}
        >
          {(Object.entries(catCounts) as [string, number][]).map(([cat, count], i) => {
            const pct = maxCat > 0 ? (count / maxCat) * 100 : 0
            const opacities = [1.0, 0.75, 0.55, 0.40]
            return (
              <div key={cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ ...typography.label.sm, color: colors.text.highEmphasis.onLight }}>{cat}</span>
                  <span style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight }}>{count}</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, backgroundColor: colors.surface.lightDarker }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    borderRadius: 2,
                    backgroundColor: colors.brand.default,
                    opacity: opacities[i],
                    transition: 'width 0.4s ease-out',
                  }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Tab Navigation */}
        <div style={{ padding: `${spacing[4]} ${spacing[8]}`, display: 'flex', gap: spacing[2], flexShrink: 0 }}>
          <button onClick={() => setActiveTab('issues')} style={tabStyle(activeTab === 'issues')}>
            Issues ({allIssues.length})
          </button>
          <button onClick={() => setActiveTab('reports')} style={tabStyle(activeTab === 'reports')}>
            Reports ({state.reports.length})
          </button>
          <button onClick={() => setActiveTab('jira')} style={tabStyle(activeTab === 'jira')}>
            Jira Stories
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: `0 ${spacing[8]} ${spacing[8]}` }}>

          {/* ─── Issues Tab ─── */}
          {activeTab === 'issues' && (
            <div style={{ border: `1px solid ${colors.border.lowEmphasis.onLight}`, borderRadius: borderRadius.md, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fontFamilies.body }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Severity</th>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>Issue</th>
                      <th style={thStyle}>WCAG</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Effort</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allIssues.map(issue => {
                      const isExpanded = expandedIssueId === issue.id
                      const effort = issue.analysis?.estimatedEffort || 'medium'
                      const es = effortColors[effort] || effortColors.medium
                      return (
                        <IssueRow
                          key={issue.id}
                          issue={issue}
                          effort={effort}
                          effortStyle={es}
                          isExpanded={isExpanded}
                          onToggle={() => setExpandedIssueId(isExpanded ? null : issue.id)}
                          onStatusChange={(status) => onStatusChange(issue._reportId, issue.id, status)}
                        />
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {allIssues.length === 0 && (
                <div style={{ padding: spacing[6], textAlign: 'center', color: colors.text.lowEmphasis.onLight, ...typography.body.sm }}>
                  No issues found for this state.
                </div>
              )}
            </div>
          )}

          {/* ─── Reports Tab ─── */}
          {activeTab === 'reports' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              {state.reports.map(report => {
                const score = scoreReport(report)
                const scoreColor = getScoreColor(score)
                return (
                  <div
                    key={report.id}
                    style={{
                      border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                      borderRadius: borderRadius.md,
                      padding: spacing[4],
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ ...typography.label.md, color: colors.text.highEmphasis.onLight }}>
                          {report.sourceFileName}
                        </div>
                        <div style={{ display: 'flex', gap: spacing[3], marginTop: spacing[1] }}>
                          <span style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>
                            {report.auditDate}
                          </span>
                          <span style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight }}>
                            {report.issues.length} issues
                          </span>
                          <span style={{ ...typography.body.xs, color: scoreColor, fontWeight: 600 }}>
                            {score}%
                          </span>
                          <span style={{ ...typography.body.xs, color: colors.text.disabled.onLight }}>
                            {report.standard}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteReport(report.id)}
                        aria-label={`Delete report ${report.sourceFileName}`}
                        style={{
                          ...typography.label.sm,
                          color: colors.text.lowEmphasis.onLight,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
              {state.reports.length === 0 && (
                <div style={{ padding: spacing[6], textAlign: 'center', color: colors.text.lowEmphasis.onLight, ...typography.body.sm }}>
                  No reports uploaded for this state.
                </div>
              )}
            </div>
          )}

          {/* ─── Jira Stories Tab ─── */}
          {activeTab === 'jira' && (
            <JiraStoriesSection
              state={state}
              severityFilter={severityFilter}
              onSeverityChange={setSeverityFilter}
            />
          )}
        </div>
      </div>
    </>
  )
}

/* ── Issue Row ── */

function IssueRow({
  issue,
  effort,
  effortStyle,
  isExpanded,
  onToggle,
  onStatusChange,
}: {
  issue: EnrichedIssue
  effort: string
  effortStyle: { bg: string; text: string }
  isExpanded: boolean
  onToggle: () => void
  onStatusChange: (status: IssueStatus) => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <>
      <tr
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
        tabIndex={0}
        aria-expanded={isExpanded}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          cursor: 'pointer',
          backgroundColor: hovered ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
          transition: `background-color ${transitionPresets.fast}`,
        }}
      >
        <td style={tdStyle}><SeverityDot severity={issue.severity} showLabel={false} /></td>
        <td style={{ ...tdStyle, fontFamily: fontFamilies.mono, fontSize: typography.code.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>{issue.id}</td>
        <td style={{ ...tdStyle, ...typography.body.sm, color: colors.text.highEmphasis.onLight }}>
          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.title}</span>
        </td>
        <td style={{ ...tdStyle, ...typography.body.xs, color: colors.text.action.enabled }}>{issue.wcagCriteria.join(', ')}</td>
        <td style={tdStyle} onClick={e => e.stopPropagation()}>
          <select
            value={issue.status}
            onChange={(e) => onStatusChange(e.target.value as IssueStatus)}
            aria-label={`Status for issue ${issue.id}`}
            style={{
              padding: `${spacing[1]} ${spacing[2]}`,
              borderRadius: borderRadius.sm,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              fontFamily: fontFamilies.body,
              fontSize: typography.label.sm.fontSize,
              backgroundColor: 'transparent',
              color: colors.text.highEmphasis.onLight,
              cursor: 'pointer',
            }}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </td>
        <td style={tdStyle}>
          <span style={{
            ...typography.label.sm,
            padding: `2px ${spacing[2]}`,
            borderRadius: borderRadius.sm,
            backgroundColor: effortStyle.bg,
            color: effortStyle.text,
            textTransform: 'capitalize' as const,
          }}>{effort}</span>
        </td>
      </tr>
      {isExpanded && (
        <tr><td colSpan={6} style={{ padding: 0 }}><IssueDetailPanel issue={issue} /></td></tr>
      )}
    </>
  )
}

/* ── Jira Stories Section ── */

function JiraStoriesSection({
  state,
  severityFilter,
  onSeverityChange,
}: {
  state: StateCompliance
  severityFilter: Severity[]
  onSeverityChange: (s: Severity[]) => void
}) {
  const [selectedReport, setSelectedReport] = useState(state.reports[0]?.id || '')
  const report = state.reports.find(r => r.id === selectedReport)

  const stories = useMemo(() => {
    if (!report) return []
    return generateAllStories(report, {
      severity: severityFilter.length > 0 ? severityFilter : undefined,
    })
  }, [report, severityFilter])

  const handleExport = () => {
    if (!report) return
    const md = exportAllStoriesMarkdown(report, state.stateName, {
      severity: severityFilter.length > 0 ? severityFilter : undefined,
    })
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vpat-stories-${state.stateCode}-${report.auditDate}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], flexWrap: 'wrap', marginBottom: spacing[4] }}>
        <select
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
          style={{
            padding: `${spacing[2]} ${spacing[3]}`,
            borderRadius: borderRadius.md,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            backgroundColor: colors.surface.light,
            color: colors.text.highEmphasis.onLight,
          }}
        >
          {state.reports.map(r => (
            <option key={r.id} value={r.id}>{r.sourceFileName} ({r.auditDate})</option>
          ))}
        </select>

        {(['critical', 'serious', 'moderate', 'minor'] as Severity[]).map(sev => {
          const active = severityFilter.includes(sev)
          return (
            <button
              key={sev}
              onClick={() => {
                if (active) onSeverityChange(severityFilter.filter(s => s !== sev))
                else onSeverityChange([...severityFilter, sev])
              }}
              aria-pressed={active}
              style={{
                padding: `2px ${spacing[2]}`,
                backgroundColor: active ? colors.brand.default : 'transparent',
                color: active ? colors.text.highEmphasis.onDark : colors.text.lowEmphasis.onLight,
                border: `1px solid ${active ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
                borderRadius: borderRadius.sm,
                fontFamily: fontFamilies.body,
                fontSize: typography.label.sm.fontSize,
                cursor: 'pointer',
                textTransform: 'capitalize' as const,
              }}
            >
              {sev}
            </button>
          )
        })}

        <button
          onClick={handleExport}
          style={{
            marginLeft: 'auto',
            ...typography.label.sm,
            color: colors.text.action.enabled,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Export All
        </button>
      </div>

      {/* Story Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
        {stories.length === 0 ? (
          <div style={{ padding: spacing[6], textAlign: 'center', color: colors.text.lowEmphasis.onLight, ...typography.body.sm }}>
            {state.reports.length === 0 ? 'Upload a report to generate Jira stories.' : 'No stories match the current filter.'}
          </div>
        ) : (
          stories.map(story => (
            <JiraStoryCard
              key={story.issue.id}
              markdown={story.markdown}
              issueId={story.issue.id}
              title={story.issue.title}
              severity={story.issue.severity}
            />
          ))
        )}
      </div>
    </div>
  )
}

/* ── Helper ── */

function getScoreColor(score: number) {
  if (score <= 50) return colors.status.important
  if (score <= 75) return colors.status.warning
  return colors.status.success
}
