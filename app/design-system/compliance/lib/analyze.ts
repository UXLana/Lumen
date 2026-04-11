import type {
  VPATIssue, VPATReport, StateCompliance, IssueAnalysis,
  Severity, WCAGCategory, CommonFailure, ComplianceSummary, Effort,
  DocumentationLink,
} from './types'
import { wcagKnowledge, getCriterionInfo, getRelatedCriteria } from './wcag-knowledge'

// =============================================================================
// Analysis Engine
// Scores reports, matches remediation patterns, and generates fix guidance
// =============================================================================

// Severity weights for scoring
const severityWeight: Record<Severity, number> = {
  critical: 4,
  serious: 3,
  moderate: 2,
  minor: 1,
}

const effortValues: Record<Effort, number> = {
  low: 1,
  medium: 2,
  high: 3,
}

// ---------------------------------------------------------------------------
// axe-core Rule → WCAG Criteria + Remediation Mapping
// Maps common axe rule IDs (from issue titles/ids) to specific WCAG criteria
// and provides axe-specific remediation guidance when the knowledge base
// doesn't have a close keyword match.
// ---------------------------------------------------------------------------

interface AxeRuleMapping {
  wcagCriteria: string[]
  patternIndex?: number  // which pattern in the criterion to prefer
  title: string
  fix: string
  codeExample: string
  effort: Effort
  testingSteps: string[]
  documentationUrls?: DocumentationLink[]
}

const axeRuleMappings: Record<string, AxeRuleMapping> = {
  'aria-required-parent': {
    wcagCriteria: ['4.1.2'],
    title: 'ARIA role requires parent context',
    fix: 'Ensure elements with ARIA roles that require a specific parent (e.g., role="listitem" inside role="list", role="tab" inside role="tablist") are nested within the correct parent role container.',
    codeExample: '<!-- Bad: orphaned listitem -->\n<div role="listitem">Item</div>\n\n<!-- Good: listitem inside list -->\n<div role="list">\n  <div role="listitem">Item 1</div>\n  <div role="listitem">Item 2</div>\n</div>\n\n<!-- Bad: orphaned tab -->\n<button role="tab">Tab 1</button>\n\n<!-- Good: tab inside tablist -->\n<div role="tablist">\n  <button role="tab" aria-selected="true">Tab 1</button>\n  <button role="tab" aria-selected="false">Tab 2</button>\n</div>',
    effort: 'medium',
    testingSteps: ['Run axe-core — check aria-required-parent rule', 'Inspect each flagged element and verify its parent has the required ARIA role', 'Screen reader: verify the widget is announced with correct role hierarchy'],
  },
  'aria-required-children': {
    wcagCriteria: ['4.1.2'],
    title: 'ARIA role requires child roles',
    fix: 'Ensure elements with ARIA roles that require specific child roles (e.g., role="list" must contain role="listitem", role="tablist" must contain role="tab") have the correct children.',
    codeExample: '<!-- Bad: list with no listitems -->\n<div role="list">\n  <div>Item 1</div>\n</div>\n\n<!-- Good: list with listitems -->\n<div role="list">\n  <div role="listitem">Item 1</div>\n  <div role="listitem">Item 2</div>\n</div>',
    effort: 'medium',
    testingSteps: ['Run axe-core — check aria-required-children rule', 'Inspect each flagged parent and add the required child roles', 'Screen reader: verify parent-child role announcements are correct'],
  },
  'aria-roles': {
    wcagCriteria: ['4.1.2'],
    title: 'ARIA role is not valid',
    fix: 'Replace invalid or misspelled ARIA roles with valid WAI-ARIA role values. Refer to the WAI-ARIA specification for the complete list of valid roles.',
    codeExample: '<!-- Bad: invalid role -->\n<div role="nagivation">...</div>\n\n<!-- Good: valid role -->\n<nav role="navigation">...</nav>\n<!-- Or simply: -->\n<nav>...</nav>',
    effort: 'low',
    testingSteps: ['Run axe-core — check aria-roles rule', 'Fix any misspelled or non-standard role values', 'Screen reader: verify corrected roles are announced properly'],
  },
  'aria-valid-attr-value': {
    wcagCriteria: ['4.1.2'],
    title: 'ARIA attribute value is invalid',
    fix: 'Ensure all ARIA attributes have valid values. For example, aria-expanded must be "true" or "false", aria-hidden must be "true" or "false", and aria-level must be a positive integer.',
    codeExample: '<!-- Bad: invalid value -->\n<button aria-expanded="yes">Toggle</button>\n<div aria-hidden="maybe">Hidden</div>\n\n<!-- Good: valid values -->\n<button aria-expanded="true">Toggle</button>\n<div aria-hidden="true">Hidden</div>',
    effort: 'low',
    testingSteps: ['Run axe-core — check aria-valid-attr-value rule', 'Review each flagged attribute and correct the value', 'Refer to WAI-ARIA spec for allowed values per attribute'],
  },
  'aria-valid-attr': {
    wcagCriteria: ['4.1.2'],
    title: 'ARIA attribute is not valid',
    fix: 'Remove or replace invalid ARIA attributes. Only use attributes defined in the WAI-ARIA specification (e.g., aria-label, aria-expanded, aria-hidden).',
    codeExample: '<!-- Bad: made-up attribute -->\n<div aria-tooltip="help text">...</div>\n\n<!-- Good: valid ARIA attribute -->\n<div aria-label="help text">...</div>',
    effort: 'low',
    testingSteps: ['Run axe-core — check aria-valid-attr rule', 'Remove or replace any non-standard aria-* attributes', 'Screen reader: verify the element is announced correctly'],
  },
  'color-contrast': {
    wcagCriteria: ['1.4.3'],
    title: 'Text contrast insufficient',
    fix: 'Increase color contrast to meet the minimum 4.5:1 ratio for normal text (3:1 for large text). Darken text colors or lighten backgrounds.',
    codeExample: '/* Before: #B0B0B0 on white = 2.65:1 — FAIL */\n/* After: */\n.text-secondary {\n  color: #595959; /* 5.92:1 on white — PASS */\n}\n\n/* For large text (18px+ bold, 24px+ normal): */\n.heading {\n  color: #767676; /* 4.54:1 on white — PASS for large text */\n}',
    effort: 'low',
    testingSteps: ['Run axe-core — check color-contrast rule', 'Use a contrast checker tool to verify updated ratios', 'Check all interactive states (hover, focus, disabled, active)'],
  },
  'label': {
    wcagCriteria: ['1.3.1', '3.3.2'],
    title: 'Form input missing label',
    fix: 'Associate a visible <label> with every form input using the for/id attribute pair, or use aria-label / aria-labelledby for inputs where a visible label is not feasible.',
    codeExample: '<!-- Option 1: visible label -->\n<label for="email">Email address</label>\n<input type="email" id="email" />\n\n<!-- Option 2: wrapping label -->\n<label>\n  Email address\n  <input type="email" />\n</label>\n\n<!-- Option 3: aria-label (no visible label) -->\n<input type="search" aria-label="Search packages" />',
    effort: 'low',
    testingSteps: ['Run axe-core — check label rule', 'Verify every input has an associated label', 'Screen reader: tab to each input and verify its label is announced'],
  },
  'image-alt': {
    wcagCriteria: ['1.1.1'],
    title: 'Image missing alt text',
    fix: 'Add descriptive alt text to informative images, or alt="" for decorative images. The alt text should convey the same information the image provides visually.',
    codeExample: '<!-- Informative image: describe content -->\n<img src="chart.png" alt="Bar chart: Q4 revenue up 15% to $2.3M" />\n\n<!-- Decorative image: empty alt -->\n<img src="divider.png" alt="" />\n\n<!-- Icon with adjacent text: hide from AT -->\n<button>\n  <img src="search.svg" alt="" />\n  Search\n</button>',
    effort: 'low',
    testingSteps: ['Run axe-core — check image-alt rule', 'Review each image: is it informative or decorative?', 'Screen reader: verify images are described or skipped appropriately'],
  },
  'button-name': {
    wcagCriteria: ['4.1.2'],
    title: 'Button has no accessible name',
    fix: 'Give every button an accessible name using visible text content, aria-label, or aria-labelledby. Icon-only buttons must have aria-label.',
    codeExample: '<!-- Bad: icon button with no name -->\n<button><svg>...</svg></button>\n\n<!-- Good: aria-label on icon button -->\n<button aria-label="Close dialog">\n  <svg aria-hidden="true">...</svg>\n</button>\n\n<!-- Good: visible text -->\n<button>Submit form</button>',
    effort: 'low',
    testingSteps: ['Run axe-core — check button-name rule', 'Add aria-label to all icon-only buttons', 'Screen reader: verify each button announces its purpose'],
  },
  'link-name': {
    wcagCriteria: ['2.4.4', '4.1.2'],
    title: 'Link has no accessible name',
    fix: 'Ensure every link has descriptive text content or an aria-label. Avoid generic text like "click here" or "read more" without context.',
    codeExample: '<!-- Bad: empty link -->\n<a href="/report"><img src="icon.png" /></a>\n\n<!-- Good: descriptive text -->\n<a href="/report">View Q4 compliance report</a>\n\n<!-- Good: aria-label for icon links -->\n<a href="/report" aria-label="View Q4 compliance report">\n  <svg aria-hidden="true">...</svg>\n</a>',
    effort: 'low',
    testingSteps: ['Run axe-core — check link-name rule', 'Verify all links have descriptive accessible names', 'Screen reader: verify each link announces its destination/purpose'],
  },
  'heading-order': {
    wcagCriteria: ['1.3.1'],
    title: 'Heading levels should increase by one',
    fix: 'Maintain a logical heading hierarchy without skipping levels (e.g., don\'t jump from h1 to h3). Each page should have one h1, with h2 for sections, h3 for subsections, etc.',
    codeExample: '<!-- Bad: skipped heading level -->\n<h1>Dashboard</h1>\n<h3>Settings</h3> <!-- Skipped h2! -->\n\n<!-- Good: sequential levels -->\n<h1>Dashboard</h1>\n  <h2>Settings</h2>\n    <h3>Notification Preferences</h3>',
    effort: 'low',
    testingSteps: ['Run axe-core — check heading-order rule', 'Use the HeadingsMap browser extension to visualize heading hierarchy', 'Screen reader: use heading navigation to verify logical structure'],
  },
  'region': {
    wcagCriteria: ['1.3.1'],
    title: 'Page content not contained in landmarks',
    fix: 'Wrap all visible page content in landmark regions (<header>, <nav>, <main>, <aside>, <footer>) or ARIA landmark roles so screen reader users can navigate by region.',
    codeExample: '<body>\n  <header>...</header>\n  <nav aria-label="Main">...</nav>\n  <main id="main-content">\n    <!-- Page content here -->\n  </main>\n  <footer>...</footer>\n</body>',
    effort: 'medium',
    testingSteps: ['Run axe-core — check region rule', 'Verify all visible content is inside a landmark element', 'Screen reader: verify landmark navigation covers all page content'],
  },
  'document-title': {
    wcagCriteria: ['2.4.2'],
    title: 'Document has no title',
    fix: 'Add a descriptive <title> element to every page. The title should describe the page content and follow a consistent pattern like "Page Name — Section — App Name".',
    codeExample: '<head>\n  <title>Packages — Retail ID — Lumen</title>\n</head>\n\n<!-- For SPAs, update title on route change: -->\nuseEffect(() => {\n  document.title = `${pageTitle} — Lumen`;\n}, [pageTitle]);',
    effort: 'low',
    testingSteps: ['Check document.title for every page/route', 'Verify title changes on navigation', 'Screen reader: verify page title is announced on page load'],
  },
  'list': {
    wcagCriteria: ['1.3.1'],
    title: 'List markup incorrect',
    fix: 'Use proper HTML list elements (<ul>, <ol>, <li>) instead of styled divs. Only <li> elements (or role="listitem") should be direct children of <ul>/<ol>.',
    codeExample: '<!-- Bad: divs pretending to be a list -->\n<div class="list">\n  <div>Item 1</div>\n  <div>Item 2</div>\n</div>\n\n<!-- Good: semantic list -->\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>',
    effort: 'low',
    testingSteps: ['Run axe-core — check list rule', 'Replace styled divs with semantic list elements', 'Screen reader: verify lists announced as "list, X items"'],
  },
  'tabindex': {
    wcagCriteria: ['2.4.3'],
    title: 'Positive tabindex disrupts focus order',
    fix: 'Remove all positive tabindex values (tabindex="1", "2", etc.). Use tabindex="0" to add an element to natural tab order, or tabindex="-1" for programmatic focus only.',
    codeExample: '<!-- Bad: positive tabindex disrupts order -->\n<button tabindex="3">Third</button>\n<button tabindex="1">First</button>\n<button tabindex="2">Second</button>\n\n<!-- Good: natural DOM order -->\n<button>First</button>\n<button>Second</button>\n<button>Third</button>',
    effort: 'low',
    testingSteps: ['Search codebase for tabindex values > 0', 'Remove all positive tabindex values', 'Tab through the page to verify natural focus order is logical'],
  },
  'duplicate-id': {
    wcagCriteria: ['4.1.2'],
    title: 'Duplicate id attribute on page',
    fix: 'Ensure all id attribute values are unique within the page. Duplicate IDs break label associations, ARIA references, and fragment navigation.',
    codeExample: '<!-- Bad: duplicate ID -->\n<label for="name">Name</label>\n<input id="name" />       <!-- Which one does the label point to? -->\n<input id="name" />\n\n<!-- Good: unique IDs -->\n<label for="first-name">First Name</label>\n<input id="first-name" />\n<label for="last-name">Last Name</label>\n<input id="last-name" />',
    effort: 'low',
    testingSteps: ['Run axe-core — check duplicate-id rule', 'Search the DOM for duplicate id values', 'Verify all label/aria-* references point to the correct unique element'],
  },
  'landmark-unique': {
    wcagCriteria: ['1.3.1'],
    title: 'Landmark regions must have unique labels',
    fix: 'When multiple landmarks of the same type exist (e.g., two <nav> elements), give each a unique aria-label to distinguish them.',
    codeExample: '<!-- Bad: two navs with no distinction -->\n<nav>Main menu</nav>\n<nav>Sidebar links</nav>\n\n<!-- Good: uniquely labeled -->\n<nav aria-label="Main navigation">Main menu</nav>\n<nav aria-label="Sidebar navigation">Sidebar links</nav>',
    effort: 'low',
    testingSteps: ['Run axe-core — check landmark-unique rule', 'Add aria-label to each duplicate landmark type', 'Screen reader: verify each landmark announces a unique name'],
  },
}

/**
 * Try to match an issue title/id to a known axe-core rule.
 * axe-core titles are very specific, e.g., "Ensure elements with an ARIA role
 * that require parent roles are contained by them" maps to aria-required-parent.
 */
function matchAxeRule(issue: VPATIssue): AxeRuleMapping | null {
  const titleLower = issue.title.toLowerCase()
  const idLower = issue.id.toLowerCase()

  for (const [ruleId, mapping] of Object.entries(axeRuleMappings)) {
    // Direct ID match (e.g., issue.id contains the axe rule name)
    if (idLower.includes(ruleId)) return mapping

    // Title-based heuristic matching
    const ruleWords = ruleId.split('-')
    if (ruleWords.every(w => titleLower.includes(w))) return mapping
  }

  // Keyword-based matching for common axe patterns
  if (titleLower.includes('aria role') && titleLower.includes('parent')) return axeRuleMappings['aria-required-parent']
  if (titleLower.includes('aria role') && titleLower.includes('children')) return axeRuleMappings['aria-required-children']
  if (titleLower.includes('aria role') && (titleLower.includes('valid') || titleLower.includes('invalid'))) return axeRuleMappings['aria-roles']
  if (titleLower.includes('aria') && titleLower.includes('attr') && titleLower.includes('value')) return axeRuleMappings['aria-valid-attr-value']
  if (titleLower.includes('aria') && titleLower.includes('attr') && !titleLower.includes('value')) return axeRuleMappings['aria-valid-attr']
  if (titleLower.includes('contrast')) return axeRuleMappings['color-contrast']
  if (titleLower.includes('form') && titleLower.includes('label')) return axeRuleMappings['label']
  if (titleLower.includes('image') && titleLower.includes('alt')) return axeRuleMappings['image-alt']
  if (titleLower.includes('button') && (titleLower.includes('name') || titleLower.includes('accessible'))) return axeRuleMappings['button-name']
  if (titleLower.includes('link') && (titleLower.includes('name') || titleLower.includes('accessible') || titleLower.includes('discernible'))) return axeRuleMappings['link-name']
  if (titleLower.includes('heading') && (titleLower.includes('order') || titleLower.includes('level'))) return axeRuleMappings['heading-order']
  if (titleLower.includes('landmark') || titleLower.includes('region')) return axeRuleMappings['region']
  if (titleLower.includes('document') && titleLower.includes('title')) return axeRuleMappings['document-title']
  if (titleLower.includes('tabindex')) return axeRuleMappings['tabindex']
  if (titleLower.includes('duplicate') && titleLower.includes('id')) return axeRuleMappings['duplicate-id']

  return null
}

// ---------------------------------------------------------------------------
// Pattern Matching
// ---------------------------------------------------------------------------

/** Match an issue to the best remediation pattern from the WCAG knowledge base */
function matchRemediationPattern(issue: VPATIssue) {
  // Try each criterion the issue references
  for (const code of issue.wcagCriteria) {
    const criterion = getCriterionInfo(code)
    if (!criterion) continue

    // Try to find the best matching pattern by comparing issue text
    const titleLower = issue.title.toLowerCase()
    const currentLower = issue.currentState.toLowerCase()
    const combined = `${titleLower} ${currentLower}`

    let bestMatch = criterion.commonPatterns[0]
    let bestScore = 0

    for (const pattern of criterion.commonPatterns) {
      const keywords = pattern.issueType.toLowerCase().split(/\s+/)
      const matchCount = keywords.filter(kw => combined.includes(kw)).length
      const score = matchCount / keywords.length
      if (score > bestScore) {
        bestScore = score
        bestMatch = pattern
      }
    }

    if (bestMatch) {
      return { criterion, pattern: bestMatch }
    }
  }

  // Fallback: use first criterion's first pattern
  if (issue.wcagCriteria.length > 0) {
    const criterion = getCriterionInfo(issue.wcagCriteria[0])
    if (criterion && criterion.commonPatterns.length > 0) {
      return { criterion, pattern: criterion.commonPatterns[0] }
    }
  }

  return null
}

// ---------------------------------------------------------------------------
// Issue Analysis
// ---------------------------------------------------------------------------

/** Enrich a single issue with analysis and remediation guidance */
export function analyzeIssue(issue: VPATIssue): VPATIssue {
  const match = matchRemediationPattern(issue)

  if (!match) {
    // Try axe-core rule matching before falling back to generic
    const axeMatch = matchAxeRule(issue)
    if (axeMatch) {
      // Resolve WCAG criterion info from the axe mapping
      const criterionCode = axeMatch.wcagCriteria[0]
      const criterion = getCriterionInfo(criterionCode)

      // Collect related criteria
      const relatedSet = new Set<string>()
      for (const code of axeMatch.wcagCriteria) {
        for (const related of getRelatedCriteria(code)) {
          if (!axeMatch.wcagCriteria.includes(related)) {
            relatedSet.add(related)
          }
        }
      }

      // Also backfill wcagCriteria on the issue if it was empty
      const enrichedIssue = { ...issue }
      if (enrichedIssue.wcagCriteria.length === 0) {
        enrichedIssue.wcagCriteria = axeMatch.wcagCriteria
      }

      // Collect documentation URLs from axe mapping + WCAG criterion
      const docUrls: DocumentationLink[] = [
        ...(axeMatch.documentationUrls || []),
        ...(criterion?.documentationUrls || []),
      ]
      // Add Deque axe-core rule reference
      const axeRuleId = Object.entries(axeRuleMappings).find(([, m]) => m === axeMatch)?.[0]
      if (axeRuleId) {
        docUrls.unshift({ label: `axe-core: ${axeRuleId} rule`, url: `https://dequeuniversity.com/rules/axe/4.10/${axeRuleId}` })
      }

      return {
        ...enrichedIssue,
        analysis: {
          wcagRequirement: criterion?.requirement || `WCAG ${criterionCode}: ${axeMatch.title}`,
          wcagLevel: criterion?.level || 'A',
          category: criterion?.category || 'Robust',
          estimatedEffort: axeMatch.effort,
          remediationPattern: axeMatch.fix,
          codeExample: issue.codeRecommendation || axeMatch.codeExample,
          testingSteps: axeMatch.testingSteps,
          relatedCriteria: Array.from(relatedSet),
          documentationUrls: docUrls,
        },
      }
    }

    // Final fallback — truly unrecognized issues
    // Build doc links from whatever WCAG criteria the issue references
    const fallbackDocs: DocumentationLink[] = issue.wcagCriteria
      .map(code => getCriterionInfo(code))
      .filter(Boolean)
      .flatMap(c => c!.documentationUrls)
    if (fallbackDocs.length === 0) {
      fallbackDocs.push(
        { label: 'WCAG 2.2 Understanding Docs', url: 'https://www.w3.org/WAI/WCAG22/Understanding/' },
        { label: 'How to Meet WCAG (Quick Reference)', url: 'https://www.w3.org/WAI/WCAG22/quickref/' },
      )
    }

    return {
      ...issue,
      analysis: {
        wcagRequirement: issue.wcagCriteria.length > 0
          ? `WCAG ${issue.wcagCriteria.join(', ')} — review criterion requirements`
          : 'Review against WCAG 2.2 AA success criteria',
        wcagLevel: 'A',
        category: 'Robust',
        estimatedEffort: 'medium',
        remediationPattern: issue.currentState
          ? `Current: ${issue.currentState}. Review the element against WCAG requirements and apply the appropriate ARIA attributes, semantic HTML, or styling fixes.`
          : 'Inspect the flagged element, identify the accessibility barrier, and apply the appropriate fix (ARIA attributes, semantic HTML, contrast adjustment, or keyboard support).',
        codeExample: issue.codeRecommendation || '',
        testingSteps: [
          'Run axe-core automated scan on the affected page',
          'Inspect the flagged element in browser DevTools',
          'Test with keyboard navigation (Tab, Enter, Escape)',
          'Test with a screen reader (VoiceOver/NVDA)',
        ],
        relatedCriteria: [],
        documentationUrls: fallbackDocs,
      },
    }
  }

  const { criterion, pattern } = match

  // Collect related criteria across all referenced criteria
  const relatedSet = new Set<string>()
  for (const code of issue.wcagCriteria) {
    for (const related of getRelatedCriteria(code)) {
      if (!issue.wcagCriteria.includes(related)) {
        relatedSet.add(related)
      }
    }
  }
  const relatedCriteria = Array.from(relatedSet)

  // Collect documentation URLs from the matched criterion
  const docUrls: DocumentationLink[] = [...(criterion.documentationUrls || [])]

  const analysis: IssueAnalysis = {
    wcagRequirement: criterion.requirement,
    wcagLevel: criterion.level,
    category: criterion.category,
    estimatedEffort: pattern.effort,
    remediationPattern: pattern.fix,
    codeExample: issue.codeRecommendation || pattern.codeExample,
    testingSteps: pattern.testingSteps,
    relatedCriteria,
    documentationUrls: docUrls,
  }

  return { ...issue, analysis }
}

/** Check if an issue has stale/generic analysis that should be re-analyzed */
function hasStaleAnalysis(issue: VPATIssue): boolean {
  if (!issue.analysis) return true
  return issue.analysis.wcagRequirement === 'See WCAG 2.2 specification'
    || issue.analysis.remediationPattern === 'Review and fix per WCAG guidelines'
}

/** Re-analyze an issue only if its analysis is stale/generic */
export function refreshAnalysis(issue: VPATIssue): VPATIssue {
  if (hasStaleAnalysis(issue)) {
    // Strip old analysis so analyzeIssue runs fresh
    const stripped = { ...issue, analysis: undefined }
    return analyzeIssue(stripped)
  }
  return issue
}

/** Analyze all issues in a report */
export function analyzeReport(report: VPATReport): VPATReport {
  return {
    ...report,
    issues: report.issues.map(analyzeIssue),
  }
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/** Calculate compliance score for a report (0-100) */
export function scoreReport(report: VPATReport): number {
  const totalChecks = report.issues.length + report.passedChecks.length
  if (totalChecks === 0) return 100

  // Weight: resolved issues count as passed, open issues are weighted by severity
  let totalWeight = report.passedChecks.length * 1 // Each pass = weight 1
  let failWeight = 0

  for (const issue of report.issues) {
    const weight = severityWeight[issue.severity]
    totalWeight += weight
    if (issue.status !== 'resolved') {
      failWeight += weight
    }
  }

  if (totalWeight === 0) return 100
  return Math.round(((totalWeight - failWeight) / totalWeight) * 100)
}

// ---------------------------------------------------------------------------
// Cross-State Analysis
// ---------------------------------------------------------------------------

/** Find common failures across states */
export function findCommonFailures(states: StateCompliance[]): CommonFailure[] {
  const criteriaMap = new Map<string, {
    occurrences: number
    states: Set<string>
    severity: Severity
  }>()

  for (const state of states) {
    for (const report of state.reports) {
      for (const issue of report.issues) {
        if (issue.status === 'resolved') continue
        for (const code of issue.wcagCriteria) {
          const existing = criteriaMap.get(code) || {
            occurrences: 0,
            states: new Set<string>(),
            severity: 'minor' as Severity,
          }
          existing.occurrences++
          existing.states.add(state.stateCode)
          // Keep highest severity
          if (severityWeight[issue.severity] > severityWeight[existing.severity]) {
            existing.severity = issue.severity
          }
          criteriaMap.set(code, existing)
        }
      }
    }
  }

  const failures: CommonFailure[] = []
  criteriaMap.forEach((data, code) => {
    const criterion = getCriterionInfo(code)
    const pattern = criterion?.commonPatterns[0]
    failures.push({
      wcagCriterion: code,
      criterionName: criterion?.name || code,
      occurrences: data.occurrences,
      states: Array.from(data.states),
      severity: data.severity,
      topRemediation: pattern?.fix || 'Review WCAG specification',
    })
  })

  return failures.sort((a, b) =>
    severityWeight[b.severity] * b.occurrences - severityWeight[a.severity] * a.occurrences
  )
}

// ---------------------------------------------------------------------------
// Category Breakdown
// ---------------------------------------------------------------------------

/** Group issues by WCAG category */
export function categorizeIssues(issues: VPATIssue[]): Record<WCAGCategory, VPATIssue[]> {
  const result: Record<WCAGCategory, VPATIssue[]> = {
    Perceivable: [],
    Operable: [],
    Understandable: [],
    Robust: [],
  }

  for (const issue of issues) {
    // Use the first criterion's category
    if (issue.wcagCriteria.length > 0) {
      const criterion = getCriterionInfo(issue.wcagCriteria[0])
      if (criterion) {
        result[criterion.category].push(issue)
        continue
      }
    }
    result['Robust'].push(issue) // Default bucket
  }

  return result
}

// ---------------------------------------------------------------------------
// Remediation Prioritization
// ---------------------------------------------------------------------------

/** Sort issues by impact/effort ratio (highest value first) */
export function prioritizeRemediation(issues: VPATIssue[]): VPATIssue[] {
  return [...issues]
    .filter(i => i.status !== 'resolved')
    .map(issue => {
      const analyzed = issue.analysis ? issue : analyzeIssue(issue)
      return analyzed
    })
    .sort((a, b) => {
      const impactA = severityWeight[a.severity]
      const impactB = severityWeight[b.severity]
      const effortA = effortValues[a.analysis?.estimatedEffort || 'medium']
      const effortB = effortValues[b.analysis?.estimatedEffort || 'medium']
      // Higher impact/effort ratio = better bang for buck
      return (impactB / effortB) - (impactA / effortA)
    })
}

// ---------------------------------------------------------------------------
// State Summary
// ---------------------------------------------------------------------------

/** Generate a compliance summary for a state */
export function generateStateSummary(state: StateCompliance): ComplianceSummary {
  const allIssues = state.reports.flatMap(r => r.issues)
  const openIssues = allIssues.filter(i => i.status !== 'resolved')

  const bySeverity: Record<Severity, number> = {
    critical: 0, serious: 0, moderate: 0, minor: 0,
  }
  for (const issue of openIssues) {
    bySeverity[issue.severity]++
  }

  const categorized = categorizeIssues(openIssues)
  const byCategory: Record<WCAGCategory, number> = {
    Perceivable: categorized.Perceivable.length,
    Operable: categorized.Operable.length,
    Understandable: categorized.Understandable.length,
    Robust: categorized.Robust.length,
  }

  const prioritized = prioritizeRemediation(openIssues)
  const topFixes = prioritized.slice(0, 5).map(issue => ({
    issue,
    impact: severityWeight[issue.severity] / effortValues[issue.analysis?.estimatedEffort || 'medium'],
  }))

  const totalPassed = state.reports.reduce((sum, r) => sum + r.passedChecks.length, 0)

  return {
    stateCode: state.stateCode,
    stateName: state.stateName,
    score: state.latestScore,
    totalIssues: openIssues.length,
    bySeverity,
    byCategory,
    topFixes,
    passedChecks: totalPassed,
    lastAuditDate: state.lastAuditDate,
  }
}
