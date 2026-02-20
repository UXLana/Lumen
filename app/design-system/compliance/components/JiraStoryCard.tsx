'use client'

import { useState } from 'react'
import { colors, typography, fontFamilies, spacing, borderRadius, transitionPresets } from '@/styles/design-tokens'
import type { Severity } from '../lib/types'
import SeverityDot from './SeverityDot'

interface JiraStoryCardProps {
  markdown: string
  issueId: string
  title: string
  severity: Severity
}

export default function JiraStoryCard({ markdown, issueId, title, severity }: JiraStoryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded) } }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${spacing[3]} ${spacing[4]}`,
          cursor: 'pointer',
          backgroundColor: expanded ? colors.surface.lightDarker : 'transparent',
          transition: `background-color ${transitionPresets.fast}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], overflow: 'hidden' }}>
          <span
            style={{
              fontFamily: fontFamilies.mono,
              fontSize: typography.code.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
              flexShrink: 0,
            }}
          >
            {issueId}
          </span>
          <SeverityDot severity={severity} showLabel={false} size="sm" />
          <span
            style={{
              ...typography.label.md,
              color: colors.text.highEmphasis.onLight,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </span>
        </div>
        <span
          style={{
            ...typography.label.sm,
            color: colors.text.action.enabled,
            flexShrink: 0,
            marginLeft: spacing[3],
          }}
        >
          {expanded ? 'Collapse' : 'View'}
        </span>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
          {/* Actions Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: `${spacing[2]} ${spacing[4]}`,
              borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
            }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy() }}
              style={{
                ...typography.label.sm,
                color: colors.text.action.enabled,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {copied ? 'Copied!' : 'Copy Markdown'}
            </button>
          </div>

          {/* Markdown Content */}
          <div
            style={{
              padding: `${spacing[4]} ${spacing[5]}`,
              fontFamily: fontFamilies.body,
              fontSize: typography.body.sm.fontSize,
              lineHeight: 1.6,
              color: colors.text.highEmphasis.onLight,
              maxHeight: 400,
              overflowY: 'auto',
            }}
            dangerouslySetInnerHTML={{ __html: renderMarkdownSimple(markdown) }}
          />
        </div>
      )}
    </div>
  )
}

/* ── Simple markdown → HTML renderer ── */
function renderMarkdownSimple(md: string): string {
  return md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h4 style="margin:12px 0 4px;font-size:14px;font-weight:600;">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 style="margin:16px 0 8px;font-size:16px;font-weight:600;">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 style="margin:16px 0 8px;font-size:18px;font-weight:600;">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, `<code style="background:${colors.surface.lightDarker};padding:1px 4px;border-radius:3px;font-size:12px;">$1</code>`)
    .replace(/^- (.+)$/gm, '<li style="margin-left:16px;">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li style="margin-left:16px;">$2</li>')
    .replace(/\n{2,}/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
}
