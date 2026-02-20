import type { VPATIssue, VPATReport, Severity } from './types'

// =============================================================================
// VPAT Report Parser
// Supports: .md, .docx, .xlsx/.xls, .html files
//
// Handles three real-world formats:
// 1. axe-core scan exports (.xlsx) — multi-sheet with Rule ID, Impact, Tags, etc.
// 2. VPAT Remediation docs (.docx) — Executive Summary table (Ticket, Component, Severity, WCAG)
// 3. VPAT 2.5 Conformance reports (.docx) — Criteria / Conformance Level / Remarks tables
// 4. Markdown audit reports (.md) — ISSUE-XXX headings with attribute tables
// =============================================================================

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// Normalize severity/impact strings from various report formats
function parseSeverity(raw: string): Severity {
  const lower = raw.toLowerCase().trim()
  if (lower.includes('critical') || lower.includes('p0')) return 'critical'
  if (lower.includes('serious') || lower.includes('p1')) return 'serious'
  if (lower.includes('moderate') || lower.includes('p2') || lower.includes('minor')) return 'moderate'
  return 'minor'
}

// Extract WCAG criteria codes from text (e.g., "1.3.1 Info and Relationships")
function extractCriteria(text: string): string[] {
  const matches = text.match(/\d+\.\d+\.\d+/g)
  return matches ? Array.from(new Set(matches)) : []
}

// Extract WCAG criteria from axe-core Tags column
// e.g., "cat.aria,wcag2a,wcag131,EN-301-549,EN-9.1.3.1" → ["1.3.1"]
function extractCriteriaFromAxeTags(tags: string): string[] {
  const criteria: Set<string> = new Set()
  const tagList = tags.split(',').map(t => t.trim())

  for (const tag of tagList) {
    // Match wcagXYZ pattern (e.g., wcag131 → 1.3.1, wcag412 → 4.1.2)
    const wcagMatch = tag.match(/^wcag(\d)(\d)(\d+)$/)
    if (wcagMatch) {
      criteria.add(`${wcagMatch[1]}.${wcagMatch[2]}.${wcagMatch[3]}`)
    }
    // Match EN-9.X.Y.Z pattern (e.g., EN-9.1.3.1 → 1.3.1)
    const enMatch = tag.match(/^EN-9\.(\d+\.\d+\.\d+)$/)
    if (enMatch) {
      criteria.add(enMatch[1])
    }
  }

  return Array.from(criteria)
}

// Determine remediation phase from severity
function phaseFromSeverity(severity: Severity): 1 | 2 | 3 {
  if (severity === 'critical' || severity === 'serious') return 1
  if (severity === 'moderate') return 2
  return 3
}

// Helper to strip HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

// Compute overall status from issues
function computeOverallStatus(issues: VPATIssue[]): 'compliant' | 'needs-remediation' | 'critical' {
  const hasCritical = issues.some(i => i.severity === 'critical')
  const hasSerious = issues.some(i => i.severity === 'serious')
  return hasCritical ? 'critical'
    : hasSerious || issues.length > 0 ? 'needs-remediation'
    : 'compliant'
}


// ---------------------------------------------------------------------------
// Markdown Parser
// Handles: a11y-audit-retail-id-label-editor.md format
// Pattern: #### ISSUE-XXX: Title + attribute table + recommendation code block
// ---------------------------------------------------------------------------

function parseMarkdownReport(markdown: string): Partial<VPATReport> {
  const issues: VPATIssue[] = []
  const passedChecks: string[] = []

  let auditDate = ''
  let standard = ''
  let auditor = ''
  const scope: string[] = []

  // Parse metadata table
  const metadataMatch = markdown.match(/\|\s*\*\*Audit Date\*\*\s*\|\s*(.+?)\s*\|/)
  if (metadataMatch) auditDate = metadataMatch[1].trim()

  const standardMatch = markdown.match(/\|\s*\*\*Standard\*\*\s*\|\s*(.+?)\s*\|/)
  if (standardMatch) standard = standardMatch[1].trim()

  const auditorMatch = markdown.match(/\|\s*\*\*Auditor\*\*\s*\|\s*(.+?)\s*\|/)
  if (auditorMatch) auditor = auditorMatch[1].trim()

  const scopeMatch = markdown.match(/\|\s*\*\*Page\/Feature\*\*\s*\|\s*(.+?)\s*\|/)
  if (scopeMatch) scope.push(scopeMatch[1].trim())

  // Parse issues - look for ISSUE-XXX or TG-XX or A11Y-XXX patterns
  const issueRegex = /####\s+((?:ISSUE|TG|A11Y)-?\d+):\s*(.+)/g
  let match: RegExpExecArray | null

  while ((match = issueRegex.exec(markdown)) !== null) {
    const issueId = match[1]
    const issueTitle = match[2].trim()
    const startIdx = match.index
    const nextMatch = issueRegex.exec(markdown)
    const endIdx = nextMatch ? nextMatch.index : markdown.length
    if (nextMatch) issueRegex.lastIndex = nextMatch.index

    const issueBlock = markdown.slice(startIdx, endIdx)

    const severityMatch = issueBlock.match(/\|\s*\*\*Severity\*\*\s*\|\s*(.+?)\s*\|/)
    const criteriaMatch = issueBlock.match(/\|\s*\*\*WCAG Criteria?\*\*\s*\|\s*(.+?)\s*\|/)
    const locationMatch = issueBlock.match(/\|\s*\*\*Location\*\*\s*\|\s*(.+?)\s*\|/)
    const currentMatch = issueBlock.match(/\|\s*\*\*Current State\*\*\s*\|\s*(.+?)\s*\|/)
    const impactMatch = issueBlock.match(/\|\s*\*\*Impact\*\*\s*\|\s*(.+?)\s*\|/)
    const codeMatch = issueBlock.match(/```[\w]*\n([\s\S]*?)```/)

    const severity = severityMatch ? parseSeverity(severityMatch[1]) : 'moderate'
    const wcagCriteria = criteriaMatch ? extractCriteria(criteriaMatch[1]) : []

    issues.push({
      id: issueId,
      title: issueTitle,
      severity,
      wcagCriteria,
      location: locationMatch ? locationMatch[1].trim() : '',
      currentState: currentMatch ? currentMatch[1].trim() : '',
      requiredState: '',
      impact: impactMatch ? impactMatch[1].trim() : '',
      codeRecommendation: codeMatch ? codeMatch[1].trim() : undefined,
      remediationPhase: phaseFromSeverity(severity),
      status: 'open',
    })
  }

  // Parse passed checks
  const passedSection = markdown.match(/## Passed Checks[\s\S]*?\|[\s\S]*?\n([\s\S]*?)(?=\n---|\n## |$)/)
  if (passedSection) {
    const passRows = passedSection[1].match(/\|\s*(.+?)\s*\|\s*Pass\s*\|/gi)
    if (passRows) {
      for (const row of passRows) {
        const cellMatch = row.match(/\|\s*(.+?)\s*\|\s*Pass\s*\|/i)
        if (cellMatch) passedChecks.push(cellMatch[1].trim())
      }
    }
  }

  return {
    auditDate,
    standard: standard || 'WCAG 2.2 Level AA',
    auditor,
    scope,
    issues,
    passedChecks,
    overallStatus: computeOverallStatus(issues),
  }
}


// ---------------------------------------------------------------------------
// Docx Parser — Auto-detects format:
// Format A: VPAT Remediation (Executive Summary table with Ticket/Component/Severity/WCAG)
// Format B: VPAT 2.5 Conformance (Criteria / Conformance Level / Remarks tables)
// Format C: Legacy issue-per-heading format (ISSUE-XXX: Title + field/value table)
// ---------------------------------------------------------------------------

function parseDocxHtml(html: string): Partial<VPATReport> {
  // Detect format by looking for distinctive markers
  const hasExecutiveSummary = /Executive Summary/i.test(html)
  const hasConformanceSummary = /Conformance Summary/i.test(html) || /VPAT.*Conformance/i.test(html)
  const hasVPAT25Tables = /Conformance Level/i.test(html) && /Remarks and Explanations/i.test(html)
  const hasIssueHeadings = /(?:ISSUE|TG|A11Y)-?\d+:/i.test(html)

  // VPAT Remediation doc (has Executive Summary table with tickets)
  if (hasExecutiveSummary || (hasConformanceSummary && !hasVPAT25Tables)) {
    return parseRemediationDocx(html)
  }

  // VPAT 2.5 Conformance report (Criteria / Conformance Level / Remarks)
  if (hasVPAT25Tables) {
    return parseVPAT25Docx(html)
  }

  // Legacy: individual issue headings with field/value tables
  if (hasIssueHeadings) {
    return parseLegacyDocxHtml(html)
  }

  // Fallback: try all parsers, use whichever finds the most issues
  const results = [
    parseRemediationDocx(html),
    parseVPAT25Docx(html),
    parseLegacyDocxHtml(html),
  ]
  results.sort((a, b) => (b.issues?.length || 0) - (a.issues?.length || 0))
  return results[0]
}


// --- Format A: VPAT Remediation Doc ---
// Table: Ticket | Component | Issues | Severity | Time | WCAG
// Plus Conformance Summary: WCAG Criterion | VPAT Status | Remediation

function parseRemediationDocx(html: string): Partial<VPATReport> {
  const issues: VPATIssue[] = []
  const passedChecks: string[] = []
  let auditDate = ''
  let standard = ''
  const scope: string[] = []

  // Extract date from header paragraph
  const dateMatch = html.match(/Date:\s*([A-Za-z]+\s+\d{1,2},?\s*\d{4})/i)
    || html.match(/Date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i)
    || html.match(/Date:\s*(.+?)(?:\s*\||\s*<)/i)
  if (dateMatch) auditDate = stripHtml(dateMatch[1])

  // Extract product info
  const productMatch = html.match(/Product:\s*(.+?)(?:\s*<|$)/i)
  if (productMatch) scope.push(stripHtml(productMatch[1]))

  // Parse the Executive Summary table
  // Headers: Ticket | Component | Issues | Severity | Time | WCAG
  const tables = html.split(/<table[^>]*>/i).slice(1) // split by table tags

  for (const tableHtml of tables) {
    const rows: string[][] = []
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
    let rowMatch: RegExpExecArray | null

    while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
      const cells: string[] = []
      const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi
      let cellMatch: RegExpExecArray | null
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        cells.push(stripHtml(cellMatch[1]))
      }
      if (cells.length > 0) rows.push(cells)
    }

    if (rows.length < 2) continue

    const headers = rows[0].map(h => h.toLowerCase())

    // Detect Executive Summary table (has Ticket + Severity + WCAG columns)
    const ticketIdx = headers.findIndex(h => h.includes('ticket'))
    const componentIdx = headers.findIndex(h => h.includes('component'))
    const issueCountIdx = headers.findIndex(h => h.includes('issues') || h.includes('count'))
    const severityIdx = headers.findIndex(h => h.includes('severity'))
    const timeIdx = headers.findIndex(h => h.includes('time') || h.includes('estimate'))
    const wcagIdx = headers.findIndex(h => h.includes('wcag'))

    if (ticketIdx >= 0 && severityIdx >= 0) {
      for (let r = 1; r < rows.length; r++) {
        const row = rows[r]
        const ticketId = row[ticketIdx] || ''
        const component = componentIdx >= 0 ? row[componentIdx] || '' : ''
        const issueCount = issueCountIdx >= 0 ? row[issueCountIdx] || '' : ''
        const severityStr = row[severityIdx] || 'moderate'
        const timeEst = timeIdx >= 0 ? row[timeIdx] || '' : ''
        const wcagStr = wcagIdx >= 0 ? row[wcagIdx] || '' : ''

        if (!ticketId || ticketId.toLowerCase().includes('ticket')) continue

        const severity = parseSeverity(severityStr)
        const wcagCriteria = extractCriteria(wcagStr)

        issues.push({
          id: ticketId,
          title: component || ticketId,
          severity,
          wcagCriteria,
          location: component,
          currentState: issueCount ? `${issueCount} occurrences found` : '',
          requiredState: '',
          impact: `${severity} — est. ${timeEst || 'TBD'}`,
          codeRecommendation: undefined,
          remediationPhase: phaseFromSeverity(severity),
          status: 'open',
        })
      }
      continue
    }

    // Detect VPAT Conformance Summary table (WCAG Criterion | VPAT Status | Remediation)
    const criterionIdx = headers.findIndex(h => h.includes('criterion') || h.includes('criteria'))
    const statusIdx = headers.findIndex(h => h.includes('status') || h.includes('conformance'))
    const remediationIdx = headers.findIndex(h => h.includes('remediation') || h.includes('ticket'))

    if (criterionIdx >= 0 && statusIdx >= 0) {
      for (let r = 1; r < rows.length; r++) {
        const row = rows[r]
        const criterionText = row[criterionIdx] || ''
        const statusText = (row[statusIdx] || '').toLowerCase()

        // "Supports" = passed, "Partially Supports" / "Does Not Support" = issue
        if (statusText.includes('supports') && !statusText.includes('partially') && !statusText.includes('not')) {
          passedChecks.push(criterionText)
        }
      }
    }
  }

  return {
    auditDate,
    standard: standard || 'WCAG 2.2 Level AA',
    auditor: '',
    scope,
    issues,
    passedChecks,
    overallStatus: computeOverallStatus(issues),
  }
}


// --- Format B: VPAT 2.5 Conformance Report ---
// Tables per WCAG level: Criteria | Conformance Level | Remarks and Explanations

function parseVPAT25Docx(html: string): Partial<VPATReport> {
  const issues: VPATIssue[] = []
  const passedChecks: string[] = []
  let auditDate = ''
  let standard = ''
  let auditor = ''
  const scope: string[] = []

  // Extract metadata
  const dateMatch = html.match(/Report Date:\s*(.+?)(?:<|$)/i)
    || html.match(/dated\s+(\d{1,2}\/\d{1,2}\/\d{4})/i)
  if (dateMatch) auditDate = stripHtml(dateMatch[1])

  const productMatch = html.match(/Name of Product[^:]*:\s*(.+?)(?:<|$)/i)
  if (productMatch) scope.push(stripHtml(productMatch[1]))

  const versionMatch = html.match(/Product Description:\s*(.+?)(?:<|$)/i)
  if (versionMatch) scope.push(stripHtml(versionMatch[1]))

  // Parse all tables looking for Criteria / Conformance Level / Remarks
  const tables = html.split(/<table[^>]*>/i).slice(1)
  let issueCounter = 0

  for (const tableHtml of tables) {
    const rows: string[][] = []
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
    let rowMatch: RegExpExecArray | null

    while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
      const cells: string[] = []
      const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi
      let cellMatch: RegExpExecArray | null
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        cells.push(stripHtml(cellMatch[1]))
      }
      if (cells.length > 0) rows.push(cells)
    }

    if (rows.length < 2) continue

    const headers = rows[0].map(h => h.toLowerCase())

    // Check if this is a WCAG criteria table
    const criteriaIdx = headers.findIndex(h => h.includes('criteria'))
    const conformanceIdx = headers.findIndex(h => h.includes('conformance'))
    const remarksIdx = headers.findIndex(h => h.includes('remarks') || h.includes('explanation'))

    if (criteriaIdx < 0 || conformanceIdx < 0) continue

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r]
      const criteriaText = row[criteriaIdx] || ''
      const conformanceText = (row[conformanceIdx] || '').trim().toLowerCase()
      const remarks = remarksIdx >= 0 ? row[remarksIdx] || '' : ''

      // Extract the WCAG criterion code and name
      const criterionCodes = extractCriteria(criteriaText)
      const criterionName = criteriaText.replace(/\d+\.\d+\.\d+\s*/, '').replace(/\(Level [^)]+\)/g, '').trim()

      if (conformanceText === 'supports' || conformanceText === 'not applicable') {
        if (criterionName) passedChecks.push(criterionName)
        continue
      }

      // "Partially Supports" or "Does Not Support" = issue
      if (conformanceText.includes('partially') || conformanceText.includes('does not')) {
        issueCounter++
        const severity: Severity = conformanceText.includes('does not') ? 'critical' : 'serious'

        issues.push({
          id: `VPAT-${String(issueCounter).padStart(3, '0')}`,
          title: criterionName || `WCAG ${criterionCodes.join(', ')}`,
          severity,
          wcagCriteria: criterionCodes,
          location: '',
          currentState: conformanceText.includes('partially') ? 'Partially Supports' : 'Does Not Support',
          requiredState: 'Supports',
          impact: remarks || '',
          codeRecommendation: undefined,
          remediationPhase: phaseFromSeverity(severity),
          status: 'open',
        })
      }
    }
  }

  return {
    auditDate,
    standard: standard || 'WCAG 2.2 Level AA',
    auditor,
    scope,
    issues,
    passedChecks,
    overallStatus: computeOverallStatus(issues),
  }
}


// --- Format C: Legacy Issue-per-heading Doc ---
// Pattern: ISSUE-XXX: Title heading + two-column field/value table

function parseLegacyDocxHtml(html: string): Partial<VPATReport> {
  const issues: VPATIssue[] = []
  const passedChecks: string[] = []
  let auditDate = ''
  const scope: string[] = []

  const dateMatch = html.match(/Date:\s*([A-Za-z]+\s+\d{1,2},?\s*\d{4})/i)
  if (dateMatch) auditDate = dateMatch[1]

  const pageMatch = html.match(/Page:\s*(.+?)(?:<|$)/i)
  if (pageMatch) scope.push(stripHtml(pageMatch[1]))

  // Find all issue headings
  const combinedRegex = /(?:<(?:p|strong)[^>]*>\s*(?:<strong>)?\s*((?:ISSUE|TG|A11Y)-?\d+):\s*(.+?)(?:<\/strong>)?\s*<\/(?:p|strong)>)|(?:<h\d[^>]*>\s*((?:ISSUE|TG|A11Y)-?\d+):\s*(.+?)\s*<\/h\d>)/gi
  const allIssueStarts: Array<{ id: string; title: string; index: number }> = []
  let match: RegExpExecArray | null

  while ((match = combinedRegex.exec(html)) !== null) {
    const id = match[1] || match[3]
    const title = stripHtml(match[2] || match[4])
    allIssueStarts.push({ id, title, index: match.index })
  }

  for (let i = 0; i < allIssueStarts.length; i++) {
    const start = allIssueStarts[i]
    const endIdx = i + 1 < allIssueStarts.length ? allIssueStarts[i + 1].index : html.length
    const block = html.slice(start.index, endIdx)

    const rowRegex = /<tr[^>]*>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi
    const fields: Record<string, string> = {}

    let rowMatch: RegExpExecArray | null
    while ((rowMatch = rowRegex.exec(block)) !== null) {
      const key = stripHtml(rowMatch[1]).toLowerCase()
      const value = stripHtml(rowMatch[2])
      fields[key] = value
    }

    const severity = fields['severity'] ? parseSeverity(fields['severity']) : 'moderate'
    const wcagCriteria = fields['wcag criteria'] ? extractCriteria(fields['wcag criteria']) : []

    issues.push({
      id: start.id,
      title: start.title,
      severity,
      wcagCriteria,
      location: fields['location'] || '',
      currentState: fields['current state'] || '',
      requiredState: fields['required state'] || '',
      impact: fields['impact'] || '',
      codeRecommendation: fields['recommendation'] || undefined,
      remediationPhase: phaseFromSeverity(severity),
      status: 'open',
    })
  }

  return {
    auditDate,
    standard: 'WCAG 2.2 Level AA',
    auditor: '',
    scope,
    issues,
    passedChecks,
    overallStatus: computeOverallStatus(issues),
  }
}


// ---------------------------------------------------------------------------
// Excel Parser — axe-core Scan Export Format
// Multi-sheet workbook: Synopsis + per-page sheets (Plants, Packages, etc.)
// Each page sheet has: Rule ID, Description, Help, Help URL, Impact, Summary,
//   Source Code, Tags, Selector, Test URL, Created At, etc.
// ---------------------------------------------------------------------------

function parseExcelWorkbook(data: ArrayBuffer): Partial<VPATReport> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const XLSX = require('xlsx')
  const workbook = XLSX.read(data, { type: 'array' })

  const issues: VPATIssue[] = []
  const passedChecks: string[] = []
  let auditDate = ''
  const scope: string[] = []

  const sheetNames = workbook.SheetNames as string[]

  // Detect if this is an axe-core export (has sheets with Rule ID/Impact/Tags columns)
  const isAxeExport = sheetNames.some(name => {
    if (name.toLowerCase() === 'synopsis') return false
    const ws = workbook.Sheets[name]
    const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(ws, { defval: '' })
    if (rows.length === 0) return false
    const headers = Object.keys(rows[0]).map(h => h.toLowerCase())
    return headers.includes('rule id') && headers.includes('impact')
  })

  if (isAxeExport) {
    return parseAxeExcelExport(workbook, sheetNames, XLSX)
  }

  // Fallback: generic column-based parsing
  return parseGenericExcel(workbook, sheetNames, XLSX)
}


// --- axe-core Excel export ---
// Each sheet = one page/section of the app
// Columns: Rule ID, Description, Help, Help URL, Impact, Selector, Summary, Source Code, Tags, Test URL, Created At

function parseAxeExcelExport(
  workbook: Record<string, unknown>,
  sheetNames: string[],
  XLSX: { utils: { sheet_to_json: (ws: unknown, opts?: Record<string, unknown>) => Record<string, string>[] }; Sheets?: Record<string, unknown> }
): Partial<VPATReport> {
  const issues: VPATIssue[] = []
  const passedChecks: string[] = []
  let auditDate = ''
  const scope: string[] = []

  // Track unique issues by Rule ID to avoid duplicates across pages
  // but keep page-specific instances for location tracking
  const issuesByRule = new Map<string, {
    ruleId: string
    description: string
    help: string
    helpUrl: string
    impact: string
    tags: string
    pages: Array<{ page: string; selector: string; summary: string; sourceCode: string; testUrl: string }>
    createdAt: string
  }>()

  const sheets = (workbook as Record<string, Record<string, unknown>>).Sheets || {}

  for (const sheetName of sheetNames) {
    if (sheetName.toLowerCase() === 'synopsis') continue // Skip synopsis, it's a summary

    const ws = sheets[sheetName]
    if (!ws) continue

    const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(ws, { defval: '' })
    if (rows.length === 0) continue

    // Verify this sheet has axe columns
    const headers = Object.keys(rows[0])
    const hasRuleId = headers.some(h => h.toLowerCase() === 'rule id')
    const hasImpact = headers.some(h => h.toLowerCase() === 'impact')
    if (!hasRuleId || !hasImpact) continue

    scope.push(sheetName)

    for (const row of rows) {
      const ruleId = String(row['Rule ID'] || '').trim()
      const description = String(row['Description'] || '').trim()
      const help = String(row['Help'] || '').trim()
      const helpUrl = String(row['Help URL'] || '').trim()
      const impact = String(row['Impact'] || '').trim()
      const selector = String(row['Selector'] || '').trim()
      const summary = String(row['Summary'] || '').trim()
      const sourceCode = String(row['Source Code'] || '').trim()
      const tags = String(row['Tags'] || '').trim()
      const testUrl = String(row['Test URL'] || '').trim()
      const createdAt = String(row['Created At'] || '').trim()

      if (!ruleId) continue

      // Extract earliest date for auditDate
      if (createdAt && (!auditDate || createdAt < auditDate)) {
        auditDate = createdAt.split('T')[0]
      }

      // Group by rule + page
      const key = `${ruleId}__${sheetName}`
      const existing = issuesByRule.get(key)

      if (existing) {
        existing.pages.push({ page: sheetName, selector, summary, sourceCode, testUrl })
      } else {
        issuesByRule.set(key, {
          ruleId,
          description,
          help,
          helpUrl,
          impact,
          tags,
          pages: [{ page: sheetName, selector, summary, sourceCode, testUrl }],
          createdAt,
        })
      }
    }
  }

  // Convert grouped issues to VPATIssue format
  // Group across all pages by ruleId for deduplication
  const ruleGroups = new Map<string, typeof issues>()

  let counter = 0
  const issueEntries = Array.from(issuesByRule.entries())
  for (const [, data] of issueEntries) {
    counter++
    const severity = parseSeverity(data.impact)
    const wcagCriteria = extractCriteriaFromAxeTags(data.tags)
    const pageNames = data.pages.map(p => p.page)

    // First page's summary as the main current state
    const firstPage = data.pages[0]
    const occurrenceCount = data.pages.length

    issues.push({
      id: `AXE-${String(counter).padStart(3, '0')}`,
      title: data.help || data.description,
      severity,
      wcagCriteria,
      location: pageNames.join(', '),
      currentState: firstPage.summary.replace(/\r\n/g, ' '),
      requiredState: data.description,
      impact: `${occurrenceCount} occurrence${occurrenceCount > 1 ? 's' : ''} across ${pageNames.length} page${pageNames.length > 1 ? 's' : ''} — ${data.impact}`,
      codeRecommendation: firstPage.sourceCode || undefined,
      remediationPhase: phaseFromSeverity(severity),
      status: 'open',
    })
  }

  // Sort by severity (critical first)
  const severityOrder: Record<string, number> = { critical: 0, serious: 1, moderate: 2, minor: 3 }
  issues.sort((a, b) => (severityOrder[a.severity] || 99) - (severityOrder[b.severity] || 99))

  return {
    auditDate,
    standard: 'WCAG 2.2 Level AA',
    auditor: '',
    scope,
    issues,
    passedChecks,
    overallStatus: computeOverallStatus(issues),
  }
}


// --- Generic Excel fallback ---
// For spreadsheets that don't match the axe-core format

function parseGenericExcel(
  workbook: Record<string, unknown>,
  sheetNames: string[],
  XLSX: { utils: { sheet_to_json: (ws: unknown, opts?: Record<string, unknown>) => Record<string, string>[] } }
): Partial<VPATReport> {
  const issues: VPATIssue[] = []
  const passedChecks: string[] = []
  const scope: string[] = []

  // Column name normalization for generic formats
  const COLUMN_ALIASES: Record<string, string[]> = {
    id: ['issue id', 'id', 'issue #', 'issue_id', 'ticket', 'ticket id', 'number', '#', 'issue number'],
    title: ['title', 'issue', 'issue title', 'summary', 'description', 'finding', 'issue name', 'defect', 'help'],
    severity: ['severity', 'priority', 'level', 'impact level', 'risk', 'risk level', 'sev', 'impact'],
    wcag: ['wcag criteria', 'wcag', 'criteria', 'wcag criterion', 'success criteria', 'success criterion', 'sc', 'wcag sc', 'tags'],
    location: ['location', 'page', 'url', 'component', 'element', 'page/component', 'affected area', 'screen', 'test url'],
    currentState: ['current state', 'current behavior', 'actual', 'actual behavior', 'current', 'observation', 'summary'],
    impact: ['impact', 'user impact', 'effect', 'impact description'],
    status: ['status', 'state', 'resolution', 'conformance level', 'conformance', 'result'],
    recommendation: ['recommendation', 'fix', 'remediation', 'suggested fix', 'code recommendation', 'solution'],
  }

  const sheets = (workbook as Record<string, Record<string, unknown>>).Sheets || {}

  // Use first sheet with data
  for (const name of sheetNames) {
    const ws = sheets[name]
    if (!ws) continue
    const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(ws, { defval: '' })
    if (rows.length === 0) continue

    // Build column mapping
    const columnMap: Record<string, string> = {}
    for (const header of Object.keys(rows[0])) {
      const lower = header.toLowerCase().trim()
      for (const [canonical, aliases] of Object.entries(COLUMN_ALIASES)) {
        if (aliases.includes(lower) && !columnMap[canonical]) {
          columnMap[canonical] = header
          break
        }
      }
    }

    let counter = 0
    for (const row of rows) {
      const get = (key: string) => {
        const h = columnMap[key]
        return h ? String(row[h] || '').trim() : ''
      }

      const title = get('title')
      if (!title) continue

      counter++
      const severity = get('severity') ? parseSeverity(get('severity')) : 'moderate'
      const wcagRaw = get('wcag')
      const wcagCriteria = wcagRaw.includes('wcag') ? extractCriteriaFromAxeTags(wcagRaw) : extractCriteria(wcagRaw)
      const statusRaw = get('status').toLowerCase()

      if (statusRaw === 'pass' || statusRaw === 'passed' || statusRaw === 'supports' || statusRaw === 'conforms') {
        passedChecks.push(title)
        continue
      }

      issues.push({
        id: get('id') || `ISSUE-${String(counter).padStart(3, '0')}`,
        title,
        severity,
        wcagCriteria,
        location: get('location'),
        currentState: get('currentState'),
        requiredState: '',
        impact: get('impact'),
        codeRecommendation: get('recommendation') || undefined,
        remediationPhase: phaseFromSeverity(severity),
        status: 'open',
      })
    }

    if (issues.length > 0) break // Use first sheet that yields issues
  }

  return {
    auditDate: '',
    standard: 'WCAG 2.2 Level AA',
    auditor: '',
    scope,
    issues,
    passedChecks,
    overallStatus: computeOverallStatus(issues),
  }
}


// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function parseVPATFile(
  file: File,
  stateCode: string
): Promise<VPATReport> {
  const fileName = file.name
  let parsed: Partial<VPATReport>

  if (fileName.endsWith('.md') || fileName.endsWith('.txt')) {
    const text = await file.text()
    parsed = parseMarkdownReport(text)
  } else if (fileName.endsWith('.docx')) {
    // Dynamic import mammoth to keep bundle size down
    const mammoth = await import('mammoth')
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.convertToHtml({ arrayBuffer })
    parsed = parseDocxHtml(result.value)
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    const arrayBuffer = await file.arrayBuffer()
    parsed = parseExcelWorkbook(arrayBuffer)
  } else if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
    const text = await file.text()
    parsed = parseDocxHtml(text)
  } else {
    throw new Error(`Unsupported file type: ${fileName}. Please upload .md, .docx, .xlsx, .xls, or .html files.`)
  }

  return {
    id: generateId(),
    stateCode,
    auditDate: parsed.auditDate || new Date().toISOString().split('T')[0],
    standard: parsed.standard || 'WCAG 2.2 Level AA',
    auditor: parsed.auditor || 'Unknown',
    scope: parsed.scope || [],
    issues: parsed.issues || [],
    passedChecks: parsed.passedChecks || [],
    overallStatus: parsed.overallStatus || 'needs-remediation',
    sourceFileName: fileName,
    importedAt: new Date().toISOString(),
  }
}

// Parse raw markdown string directly (for skill use)
export function parseMarkdownString(
  markdown: string,
  stateCode: string,
  fileName: string = 'manual-input.md'
): VPATReport {
  const parsed = parseMarkdownReport(markdown)
  return {
    id: generateId(),
    stateCode,
    auditDate: parsed.auditDate || new Date().toISOString().split('T')[0],
    standard: parsed.standard || 'WCAG 2.2 Level AA',
    auditor: parsed.auditor || 'Unknown',
    scope: parsed.scope || [],
    issues: parsed.issues || [],
    passedChecks: parsed.passedChecks || [],
    overallStatus: parsed.overallStatus || 'needs-remediation',
    sourceFileName: fileName,
    importedAt: new Date().toISOString(),
  }
}
