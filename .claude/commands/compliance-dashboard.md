# Compliance Dashboard

Manage VPAT accessibility compliance data, analyze reports, and generate Jira remediation stories.

## Modes

### Parse a VPAT Report
```
/compliance-dashboard parse <file-path>
```
Parse a VPAT report file (.md, .docx, .html) and output structured JSON data. Use this to preview what the parser extracts before importing.

### Import a Report for a State
```
/compliance-dashboard import <file-path> --state <state-code>
```
Parse a VPAT report and add it to the compliance dashboard data for the specified state (e.g., CA, CO, OR).

### Analyze a State's Compliance
```
/compliance-dashboard analyze <state-code>
```
Generate a compliance summary for a state, including:
- Overall compliance score
- Issue breakdown by severity and WCAG category
- Top remediation actions (sorted by impact/effort)
- Common failure patterns

### Generate Jira Stories
```
/compliance-dashboard jira <state-code> [--severity critical|serious|moderate|minor] [--report <report-id>]
```
Generate formatted Jira story markdown for issues in a state's reports. Stories follow the A11Y-006 template with:
- Ticket Summary (Priority, WCAG Criterion, Estimated Effort)
- Problem Statement with WCAG requirement context
- UX Solution with code examples
- Implementation Steps
- Verification Checklist
- Related Criteria

### Score a State
```
/compliance-dashboard score <state-code>
```
Calculate and display the compliance score for a state.

## Implementation

### File Locations
- Dashboard page: `app/design-system/compliance/page.tsx`
- Types: `app/design-system/compliance/lib/types.ts`
- Parser: `app/design-system/compliance/lib/parse-vpat.ts`
- Analysis engine: `app/design-system/compliance/lib/analyze.ts`
- WCAG knowledge base: `app/design-system/compliance/lib/wcag-knowledge.ts`
- Jira generator: `app/design-system/compliance/lib/generate-jira-stories.ts`
- Storage hook: `app/design-system/compliance/lib/storage.ts`
- Components: `app/design-system/compliance/components/`

### Data Storage
MVP uses localStorage via `useComplianceStore()` hook. Data persists across sessions but is browser-local.

### VPAT Report Format
The parser supports reports following these formats:
1. **Markdown**: Issue headings (#### ISSUE-XXX: Title) + attribute tables + code recommendations
2. **Docx**: Two-column tables with [Severity, WCAG Criteria, Location, Current State, Impact, Recommendation] rows (converted via mammoth)
3. **HTML**: Confluence-style audit reports with issue tables

### Analysis Engine
Each parsed issue is automatically enriched with:
- WCAG requirement description and level
- WCAG category (Perceivable/Operable/Understandable/Robust)
- Estimated remediation effort (low/medium/high)
- Best-match remediation pattern with code example
- Testing steps to verify the fix
- Related criteria that commonly co-fail

### Workflow
1. Upload VPAT report via dashboard UI or `/compliance-dashboard import`
2. Parser extracts structured data from the file
3. Analysis engine enriches each issue with remediation guidance
4. View results in dashboard Overview tab
5. Generate Jira stories via Jira Stories tab or `/compliance-dashboard jira`

## User Input Required

$ARGUMENTS
