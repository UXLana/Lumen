'use client'

import { useState } from 'react'
import { colors, typography, fontFamilies, spacing, borderRadius } from '@/styles/design-tokens'
import type { VPATIssue } from '../lib/types'

interface IssueDetailPanelProps {
  issue: VPATIssue
}

export default function IssueDetailPanel({ issue }: IssueDetailPanelProps) {
  const analysis = issue.analysis

  // Determine "problem" code from currentState (the actual problematic code/situation)
  const problemCode = issue.currentState || ''
  // Determine "fix" code from the analysis engine
  const fixCode = analysis?.codeExample || issue.codeRecommendation || ''

  return (
    <div
      role="region"
      aria-label={`Analysis details for issue ${issue.id}`}
      style={{
        backgroundColor: colors.surface.lightDarker,
        borderLeft: `3px solid ${colors.brand.lighter}`,
        padding: spacing[6],
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[5],
      }}
    >
      {/* Metadata Tags */}
      {analysis && (
        <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap' }}>
          <MetadataTag label={analysis.category} />
          <MetadataTag label={`Level ${analysis.wcagLevel}`} />
          <MetadataTag label={`${analysis.estimatedEffort} effort`} />
          {issue.wcagCriteria.map(c => (
            <MetadataTag key={c} label={c} subtle />
          ))}
        </div>
      )}

      {/* WCAG Requirement */}
      {analysis?.wcagRequirement && (
        <div>
          <SectionLabel>WCAG Requirement</SectionLabel>
          <p style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight, margin: 0 }}>
            {analysis.wcagRequirement}
          </p>
        </div>
      )}

      {/* Recommended Fix Description */}
      {(analysis?.remediationPattern || issue.impact) && (
        <div>
          <SectionLabel>Recommended Fix</SectionLabel>
          <p style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight, margin: 0 }}>
            {analysis?.remediationPattern || issue.impact}
          </p>
        </div>
      )}

      {/* ═══ Two Code Boxes: Problem + Fix ═══ */}
      {(problemCode || fixCode) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: problemCode && fixCode ? '1fr 1fr' : '1fr',
            gap: spacing[3],
          }}
        >
          {/* Problem Code Box */}
          {problemCode && (
            <CodeBox
              label="Current (Problem)"
              code={problemCode}
              variant="problem"
            />
          )}

          {/* Fix Code Box */}
          {fixCode && (
            <CodeBox
              label="Fix (Solution)"
              code={fixCode}
              variant="fix"
            />
          )}
        </div>
      )}

      {/* Testing Steps */}
      {analysis?.testingSteps && analysis.testingSteps.length > 0 && (
        <div>
          <SectionLabel>Testing Steps</SectionLabel>
          <ol
            style={{
              margin: 0,
              paddingLeft: spacing[5],
              display: 'flex',
              flexDirection: 'column',
              gap: spacing[1],
            }}
          >
            {analysis.testingSteps.map((step, i) => (
              <li
                key={i}
                style={{
                  ...typography.body.sm,
                  color: colors.text.highEmphasis.onLight,
                }}
              >
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Documentation Links */}
      {analysis?.documentationUrls && analysis.documentationUrls.length > 0 && (
        <div>
          <SectionLabel>Official Documentation</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[1] }}>
            {analysis.documentationUrls.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...typography.body.sm,
                  color: colors.text.action.enabled,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[1],
                }}
              >
                <span style={{ fontSize: 12, opacity: 0.6 }}>↗</span>
                {doc.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Related Criteria */}
      {analysis?.relatedCriteria && analysis.relatedCriteria.length > 0 && (
        <div>
          <SectionLabel>Related Criteria</SectionLabel>
          <div style={{ display: 'flex', gap: spacing[1], flexWrap: 'wrap' }}>
            {analysis.relatedCriteria.map(c => (
              <MetadataTag key={c} label={c} subtle />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Code Box Component ── */

function CodeBox({
  label,
  code,
  variant,
}: {
  label: string
  code: string
  variant: 'problem' | 'fix'
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const indicatorColor = variant === 'problem'
    ? colors.status.important
    : colors.status.success

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Code Box Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${spacing[2]} ${spacing[3]}`,
          backgroundColor: variant === 'problem'
            ? 'rgba(178, 56, 45, 0.08)'
            : 'rgba(32, 128, 80, 0.08)',
          borderRadius: `${borderRadius.md} ${borderRadius.md} 0 0`,
          borderBottom: `2px solid ${indicatorColor}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: indicatorColor,
              flexShrink: 0,
            }}
          />
          <span style={{
            ...typography.label.sm,
            color: colors.text.highEmphasis.onLight,
            fontWeight: 600,
          }}>
            {label}
          </span>
        </div>
        <button
          onClick={handleCopy}
          aria-label={`Copy ${label.toLowerCase()} code`}
          style={{
            ...typography.label.sm,
            color: copied ? colors.text.success : colors.text.action.enabled,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: `2px ${spacing[2]}`,
            borderRadius: borderRadius.sm,
            transition: 'color 150ms ease-out',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Code Content */}
      <pre
        style={{
          backgroundColor: colors.surface.darkDarker,
          color: colors.text.highEmphasis.onDark,
          padding: spacing[4],
          borderRadius: `0 0 ${borderRadius.md} ${borderRadius.md}`,
          overflow: 'auto',
          margin: 0,
          fontFamily: fontFamilies.mono,
          fontSize: typography.code.sm.fontSize,
          lineHeight: 1.5,
          maxHeight: 320,
          flex: 1,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

/* ── Helper Components ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        ...typography.label.sm,
        color: colors.text.lowEmphasis.onLight,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
        marginBottom: spacing[2],
      }}
    >
      {children}
    </div>
  )
}

function MetadataTag({ label, subtle }: { label: string; subtle?: boolean }) {
  return (
    <span
      style={{
        ...typography.label.sm,
        padding: `2px ${spacing[2]}`,
        borderRadius: borderRadius.sm,
        backgroundColor: subtle ? 'transparent' : colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        color: subtle ? colors.text.disabled.onLight : colors.text.lowEmphasis.onLight,
      }}
    >
      {label}
    </span>
  )
}
