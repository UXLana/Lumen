import type { VPATIssue, VPATReport, Severity } from './types'
import { analyzeIssue } from './analyze'
import { getCriterionInfo } from './wcag-knowledge'

// =============================================================================
// Jira Story Generator
// Converts VPAT issues → formatted markdown stories (A11Y-006 template pattern)
// =============================================================================

const severityToPriority: Record<Severity, string> = {
  critical: 'P0 - CRITICAL',
  serious: 'P1 - SERIOUS',
  moderate: 'P2 - MODERATE',
  minor: 'P3 - MINOR',
}

const severityToEstimate: Record<Severity, string> = {
  critical: '1-2 hours',
  serious: '30-60 minutes',
  moderate: '15-30 minutes',
  minor: '10-15 minutes',
}

/** Generate a single Jira story markdown for one issue */
export function generateJiraStory(issue: VPATIssue, report?: VPATReport): string {
  // Ensure issue has analysis
  const analyzed = issue.analysis ? issue : analyzeIssue(issue)
  const analysis = analyzed.analysis!

  const criteriaDisplay = issue.wcagCriteria
    .map(code => {
      const info = getCriterionInfo(code)
      return info ? `${code} ${info.name}` : code
    })
    .join(', ')

  const lines: string[] = []

  // Title
  lines.push(`# A11Y-${issue.id}: ${issue.title}`)
  lines.push('')

  // Ticket Summary
  lines.push('## Ticket Summary')
  lines.push('')
  lines.push('| Field | Value |')
  lines.push('|-------|-------|')
  lines.push(`| **Priority** | ${severityToPriority[issue.severity]} |`)
  lines.push(`| **WCAG Criterion** | ${criteriaDisplay} |`)
  lines.push(`| **Category** | ${analysis.category} (Level ${analysis.wcagLevel}) |`)
  lines.push(`| **Estimated Effort** | ${analysis.estimatedEffort} (~${severityToEstimate[issue.severity]}) |`)
  lines.push(`| **Affected Pages** | ${issue.location || 'See scope below'} |`)
  if (report) {
    lines.push(`| **Audit Date** | ${report.auditDate} |`)
    lines.push(`| **State** | ${report.stateCode} |`)
  }
  lines.push('')
  lines.push('---')
  lines.push('')

  // Problem Statement
  lines.push('## Problem Statement')
  lines.push('')
  lines.push('### From VPAT Report')
  lines.push(`> ${issue.currentState}`)
  lines.push('')

  lines.push('### WCAG Requirement')
  lines.push(`**${criteriaDisplay}**: ${analysis.wcagRequirement}`)
  lines.push('')

  lines.push('### Issues Identified')
  lines.push('')
  lines.push(`1. **${issue.title}** (WCAG ${issue.wcagCriteria.join(', ')})`)
  lines.push(`   - Current: ${issue.currentState}`)
  if (issue.requiredState) {
    lines.push(`   - Required: ${issue.requiredState}`)
  }
  if (issue.impact) {
    lines.push(`   - Impact: ${issue.impact}`)
  }
  lines.push('')
  lines.push('---')
  lines.push('')

  // UX Solution
  lines.push('## UX Solution')
  lines.push('')
  lines.push(analysis.remediationPattern)
  lines.push('')

  lines.push('### Code Example')
  lines.push('```html')
  lines.push(analysis.codeExample)
  lines.push('```')
  lines.push('')
  lines.push('---')
  lines.push('')

  // Implementation Steps
  lines.push('## Implementation Steps')
  lines.push('')
  lines.push(`### Step 1: Fix ${issue.title}`)
  lines.push(`Apply the code example above to the affected area: **${issue.location}**`)
  lines.push('')
  if (issue.codeRecommendation && issue.codeRecommendation !== analysis.codeExample) {
    lines.push('### Step 2: Apply Original Report Recommendation')
    lines.push('```')
    lines.push(issue.codeRecommendation)
    lines.push('```')
    lines.push('')
  }
  lines.push('---')
  lines.push('')

  // Verification Checklist
  lines.push('## Verification Checklist')
  lines.push('')
  lines.push('### Pre-Deploy')
  lines.push(`- [ ] Fix implemented per recommendation above`)
  lines.push(`- [ ] axe scan passes for ${issue.wcagCriteria.join(', ')} criteria`)
  for (const step of analysis.testingSteps) {
    lines.push(`- [ ] ${step}`)
  }
  lines.push('')
  lines.push('### Post-Deploy')
  lines.push('- [ ] Manual verification of fix in production')
  lines.push('- [ ] Screen reader test (NVDA/JAWS/VoiceOver)')
  lines.push('- [ ] Keyboard-only navigation verification')
  lines.push('')
  lines.push('### VPAT Update')
  for (const code of issue.wcagCriteria) {
    const info = getCriterionInfo(code)
    lines.push(`- [ ] ${code}${info ? ` ${info.name}` : ''} can be updated to "Supports"`)
  }
  lines.push('')

  // Related Criteria
  if (analysis.relatedCriteria.length > 0) {
    lines.push('---')
    lines.push('')
    lines.push('## Related Criteria')
    lines.push('')
    lines.push('These WCAG criteria commonly co-fail with this issue — verify they are also addressed:')
    lines.push('')
    for (const code of analysis.relatedCriteria) {
      const info = getCriterionInfo(code)
      lines.push(`- **${code}** ${info?.name || ''}: ${info?.requirement || 'See WCAG specification'}`)
    }
    lines.push('')
  }

  // Documentation Links
  if (analysis.documentationUrls && analysis.documentationUrls.length > 0) {
    lines.push('---')
    lines.push('')
    lines.push('## Documentation')
    lines.push('')
    for (const doc of analysis.documentationUrls) {
      lines.push(`- [${doc.label}](${doc.url})`)
    }
    lines.push('')
  }

  lines.push('---')
  lines.push('')
  lines.push('*Generated by LUMEN Design System — Compliance Dashboard*')

  return lines.join('\n')
}

/** Generate Jira stories for all issues in a report */
export function generateAllStories(
  report: VPATReport,
  filters?: {
    severity?: Severity[]
    phase?: number[]
    criteria?: string[]
  }
): Array<{ issue: VPATIssue; markdown: string }> {
  let issues = report.issues

  if (filters?.severity?.length) {
    issues = issues.filter(i => filters.severity!.includes(i.severity))
  }
  if (filters?.phase?.length) {
    issues = issues.filter(i => filters.phase!.includes(i.remediationPhase))
  }
  if (filters?.criteria?.length) {
    issues = issues.filter(i =>
      i.wcagCriteria.some(c => filters.criteria!.includes(c))
    )
  }

  return issues.map(issue => ({
    issue,
    markdown: generateJiraStory(issue, report),
  }))
}

/** Export all stories as a single markdown document */
export function exportAllStoriesMarkdown(
  report: VPATReport,
  stateName: string,
  filters?: Parameters<typeof generateAllStories>[1]
): string {
  const stories = generateAllStories(report, filters)
  const lines: string[] = []

  lines.push(`# VPAT Remediation Tickets — ${stateName}`)
  lines.push(``)
  lines.push(`**Report:** ${report.sourceFileName}`)
  lines.push(`**Audit Date:** ${report.auditDate}`)
  lines.push(`**Standard:** ${report.standard}`)
  lines.push(`**Total Issues:** ${stories.length}`)
  lines.push('')
  lines.push('---')
  lines.push('')

  for (const { markdown } of stories) {
    lines.push(markdown)
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  return lines.join('\n')
}
