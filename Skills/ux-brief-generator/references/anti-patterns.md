# UX Brief Anti-Patterns

## Overview

When generating or scoring a UX brief, scan for these anti-patterns in both the source material and the generated output. Flag them in the Gap Analysis section with specific recommendations for how to fix each one.

## Anti-Patterns to Detect

### 1. The Vague Brief
**Symptoms**:
- Language like "make it modern", "improve the experience", "make it intuitive"
- Target audience described as "everyone" or "all users"
- Goals without measurable outcomes ("increase engagement")

**Detection**: Scan for vague adjectives without quantifiers. Check if personas have behavioral specifics.

**Fix recommendation**: "Clarify [vague term] with specific, measurable criteria. For example, replace 'improve the experience' with 'reduce task completion time for [flow] from [X] to [Y] minutes'."

### 2. The Solution-Prescriptive Brief
**Symptoms**:
- Problem statement describes a UI element: "we need a dashboard" / "add a dropdown"
- Requirements are written as wireframe instructions, not user outcomes
- Design direction section dictates specific layouts or components

**Detection**: Scan for UI component names (modal, dropdown, sidebar, dashboard, tab, carousel) in problem statements and requirements.

**Fix recommendation**: "Reframe '[solution language]' as the underlying user need. Example: 'Add a dropdown' → 'Users need to select from a constrained set of options efficiently'."

### 3. The Kitchen-Sink Brief
**Symptoms**:
- Brief exceeds 3000 words without additional depth per section
- Entire Confluence pages are pasted inline instead of linked
- Every edge case is documented in detail before core flows are clear

**Detection**: Check total word count and ratio of linked vs. inlined content.

**Fix recommendation**: "This brief contains [X] words. Consider: (1) link to source documents instead of inlining, (2) move edge cases to a separate doc, (3) focus the brief on the core problem and user needs."

### 4. The Assumption Brief
**Symptoms**:
- Personas described without any citation to research
- "We believe users want..." / "Users probably need..."
- No data sources referenced in the User Context section

**Detection**: Check if User Context section has any [Source: ...] tags. Scan for hedging language ("probably", "we think", "likely", "we believe").

**Fix recommendation**: "User context contains [N] assumptions without research backing. Flag these with [Assumption — needs validation] and add to Open Questions. Consider: user interviews, analytics review, or survey to validate before design."

### 5. The Metric-Free Brief
**Symptoms**:
- Success Metrics section is empty or contains only qualitative goals
- No baseline data for current state
- "We'll know it when we see it" approach to evaluation

**Detection**: Check if Success Metrics table has target values and measurement methods.

**Fix recommendation**: "No measurable success criteria defined. The team cannot determine when the design is 'done' or 'good enough'. Add at least 1 primary metric with: target value, current baseline, and measurement method."

### 6. The Orphan Brief
**Symptoms**:
- No links to Jira tickets, Confluence pages, or design files
- Written as a standalone document with no connection to project workflow
- No dates, no version, no update history

**Detection**: Check Sources & References table. Check for generation date.

**Fix recommendation**: "Brief is not connected to project tools. Link to: (1) Jira epic for ticket tracking, (2) Confluence space for evolving documentation, (3) Figma file for design work."

### 7. The Wall-of-Text Brief
**Symptoms**:
- Long paragraphs without headings or bullet points
- No tables for structured data
- Critical information buried mid-paragraph
- No visual hierarchy (no bold, no headers within sections)

**Detection**: Check average paragraph length. Count headings-to-words ratio.

**Fix recommendation**: "Section [X] contains [N]-word paragraph. Break into bullet points, use bold for key terms, and add sub-headings for scannability."

### 8. The Business-Only Brief
**Symptoms**:
- All goals and metrics are business KPIs (revenue, conversion, retention)
- No user-outcome metrics (task completion, error rate, satisfaction)
- Problem framed entirely from company perspective, not user perspective

**Detection**: Check if any metrics in Success Metrics are user-centered. Check if problem statement mentions users.

**Fix recommendation**: "All [N] metrics are business-focused. Add at least 1 user-outcome metric (e.g., task completion rate, time-on-task, error frequency, satisfaction score)."

### 9. The Scope Creep Brief
**Symptoms**:
- In Scope list has 15+ items
- Out of Scope section is empty or says "TBD"
- Multiple distinct problem statements (brief is really 3 briefs)

**Detection**: Count In Scope items. Check if Out of Scope has content. Check if problem statement contains multiple distinct problems (look for "and also" / "additionally" / multiple sentences with different subjects).

**Fix recommendation**: "Brief covers [N] distinct problem areas. Consider splitting into [N] focused briefs, or explicitly prioritize which problem to solve first. An empty Out of Scope section is a scope risk."

### 10. The Stale Brief
**Symptoms**:
- Source documents are older than 6 months
- Referenced Jira tickets are all closed/resolved
- Analytics data is from a previous quarter or year
- No indication of when the brief was last updated

**Detection**: Check dates on source material. Check Jira ticket statuses.

**Fix recommendation**: "Source material includes [N] documents older than 6 months. Verify that referenced data is still current. Re-fetch Confluence pages and check for updates since [oldest date]."

## Severity Levels

| Severity | Anti-Patterns | Impact |
|----------|--------------|--------|
| **Blocker** | Solution-Prescriptive, Metric-Free | Design work will likely need major rework |
| **Warning** | Vague, Assumption, Business-Only, Scope Creep | Design direction may miss the mark |
| **Info** | Kitchen-Sink, Wall-of-Text, Orphan, Stale | Brief is harder to consume but content may be adequate |

## Display Format

In the Gap Analysis section, list detected anti-patterns as:

```markdown
### Anti-Pattern Warnings

**[BLOCKER]** Solution-Prescriptive Language Detected
The problem statement describes a specific UI solution ("add a filter sidebar") instead of the user need. Reframe as: "Users need to narrow results efficiently when browsing large datasets."

**[WARNING]** Assumption-Based Personas
2 of 3 personas have no research backing. Mark as [Assumption] and validate via user interviews before committing design resources.

**[INFO]** Stale Sources
3 Confluence pages were last updated > 6 months ago. Verify content is current.
```
