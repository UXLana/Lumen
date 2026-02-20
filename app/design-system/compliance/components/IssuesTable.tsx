'use client'

import { useState, useCallback } from 'react'
import { colors, typography, fontFamilies, spacing, borderRadius, transitionPresets } from '@/styles/design-tokens'
import type { VPATIssue, IssueStatus, Severity } from '../lib/types'
import SeverityDot from './SeverityDot'
import IssueDetailPanel from './IssueDetailPanel'

export interface EnrichedIssue extends VPATIssue {
  _reportId: string
  _stateCode: string
  _reportName: string
}

interface IssuesTableProps {
  issues: EnrichedIssue[]
  onStatusChange?: (issueId: string, reportId: string, stateCode: string, status: IssueStatus) => void
}

type SortKey = 'severity' | 'id'
type SortDir = 'asc' | 'desc'

const severityOrder: Record<Severity, number> = { critical: 0, serious: 1, moderate: 2, minor: 3 }

const thStyle: React.CSSProperties = {
  ...typography.label.sm,
  color: colors.text.lowEmphasis.onLight,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  padding: `${spacing[3]} ${spacing[4]}`,
  textAlign: 'left',
  backgroundColor: colors.surface.lightDarker,
  borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
  whiteSpace: 'nowrap',
  fontWeight: 500,
}

const tdStyle: React.CSSProperties = {
  padding: `${spacing[3]} ${spacing[4]}`,
  borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
  verticalAlign: 'middle',
}

const selectStyles: React.CSSProperties = {
  padding: `${spacing[1]} ${spacing[2]}`,
  borderRadius: borderRadius.sm,
  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
  fontFamily: fontFamilies.body,
  fontSize: typography.label.sm.fontSize,
  backgroundColor: 'transparent',
  color: colors.text.highEmphasis.onLight,
  outline: 'none',
  cursor: 'pointer',
}

const effortColors: Record<string, { bg: string; text: string }> = {
  low: { bg: colors.surface.success, text: colors.text.success },
  medium: { bg: colors.surface.warning, text: colors.text.warning },
  high: { bg: colors.surface.important, text: colors.text.important },
}

export default function IssuesTable({ issues, onStatusChange }: IssuesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('severity')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }, [sortKey])

  const sorted = [...issues].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'severity') {
      cmp = severityOrder[a.severity] - severityOrder[b.severity]
    } else {
      cmp = a.id.localeCompare(b.id)
    }
    return sortDir === 'desc' ? -cmp : cmp
  })

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return ''
    return sortDir === 'asc' ? ' \u25B4' : ' \u25BE'
  }

  const ariaSortValue = (key: SortKey): 'ascending' | 'descending' | 'none' => {
    if (sortKey !== key) return 'none'
    return sortDir === 'asc' ? 'ascending' : 'descending'
  }

  if (issues.length === 0) {
    return (
      <div
        style={{
          padding: spacing[8],
          textAlign: 'center',
          color: colors.text.lowEmphasis.onLight,
          ...typography.body.md,
        }}
      >
        No issues match the current filters.
      </div>
    )
  }

  return (
    <div
      style={{
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        backgroundColor: colors.surface.light,
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: fontFamilies.body,
          }}
        >
          <thead>
            <tr>
              <th style={thStyle} aria-sort={ariaSortValue('severity')}>
                <button
                  onClick={() => handleSort('severity')}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    font: 'inherit',
                    color: 'inherit',
                    textTransform: 'inherit' as any,
                    letterSpacing: 'inherit',
                  }}
                >
                  Severity{sortIndicator('severity')}
                </button>
              </th>
              <th style={thStyle} aria-sort={ariaSortValue('id')}>
                <button
                  onClick={() => handleSort('id')}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    font: 'inherit',
                    color: 'inherit',
                    textTransform: 'inherit' as any,
                    letterSpacing: 'inherit',
                  }}
                >
                  ID{sortIndicator('id')}
                </button>
              </th>
              <th style={thStyle}>Issue</th>
              <th style={thStyle}>WCAG</th>
              <th style={thStyle}>Source</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Effort</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(issue => {
              const isExpanded = expandedId === issue.id
              const effort = issue.analysis?.estimatedEffort || 'medium'
              const effortStyle = effortColors[effort] || effortColors.medium

              return (
                <TableRow
                  key={issue.id}
                  issue={issue}
                  effort={effort}
                  effortStyle={effortStyle}
                  isExpanded={isExpanded}
                  onToggle={() => setExpandedId(isExpanded ? null : issue.id)}
                  onStatusChange={onStatusChange}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Table Row (isolated for hover state) ── */

function TableRow({
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
  onStatusChange?: IssuesTableProps['onStatusChange']
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <tr
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
        tabIndex={0}
        role="row"
        aria-expanded={isExpanded}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          cursor: 'pointer',
          backgroundColor: hovered ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
          transition: `background-color ${transitionPresets.fast}`,
        }}
      >
        <td style={tdStyle}>
          <SeverityDot severity={issue.severity} showLabel={false} />
        </td>
        <td style={{ ...tdStyle, fontFamily: fontFamilies.mono, fontSize: typography.code.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
          {issue.id}
        </td>
        <td style={{ ...tdStyle, ...typography.body.sm, color: colors.text.highEmphasis.onLight, maxWidth: 400 }}>
          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {issue.title}
          </span>
        </td>
        <td style={{ ...tdStyle, ...typography.body.xs, color: colors.text.action.enabled }}>
          {issue.wcagCriteria.join(', ')}
        </td>
        <td style={{ ...tdStyle, ...typography.body.xs, color: colors.text.lowEmphasis.onLight, maxWidth: 160 }}>
          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {issue._reportName}
          </span>
        </td>
        <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
          <select
            value={issue.status}
            onChange={(e) => {
              onStatusChange?.(issue.id, issue._reportId, issue._stateCode, e.target.value as IssueStatus)
            }}
            aria-label={`Status for issue ${issue.id}`}
            style={selectStyles}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </td>
        <td style={tdStyle}>
          <span
            style={{
              ...typography.label.sm,
              padding: `2px ${spacing[2]}`,
              borderRadius: borderRadius.sm,
              backgroundColor: effortStyle.bg,
              color: effortStyle.text,
              textTransform: 'capitalize' as const,
            }}
          >
            {effort}
          </span>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={7} style={{ padding: 0 }}>
            <IssueDetailPanel issue={issue} />
          </td>
        </tr>
      )}
    </>
  )
}
