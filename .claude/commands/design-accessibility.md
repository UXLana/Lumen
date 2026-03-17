---
name: design-accessibility
description: Audit and fix accessibility issues in components and tokens against WCAG 2.2 AA and Section 508 standards
---

# Design Accessibility

## When to Use

- Auditing components for WCAG 2.2 AA compliance
- Importing and processing axe DevTools results
- Auditing external pages behind login walls
- Running manual testing checklists
- Checking color contrast ratios in tokens
- Reviewing keyboard navigation and focus management
- Validating ARIA patterns
- Generating compliance reports for audits
- Section 508 compliance verification (for government contracts)

## Modes

| Mode | Command | What It Does |
|------|---------|--------------|
| Standard | `/design-accessibility [target]` | WCAG 2.2 AA audit of local code |
| Axe Import | `/design-accessibility --from-axe` | Parse axe DevTools JSON results |
| External | `/design-accessibility --external` | Audit page behind login wall |
| Manual | `/design-accessibility --manual` | Interactive testing checklist |
| Screen Reader | `/design-accessibility --screen-reader` | Generate SR test scripts |
| Compliance | `/design-accessibility [target] --compliance` | Adds Section 508 + regulatory checks |
| Report | `/design-accessibility --report` | Generates formal compliance documentation |
| **VPAT Report** | `/design-accessibility --vpat` | **Full VPAT remediation report with Jira stories (.docx)** |

## Targets (Standard Mode)

| Target | Example | Scope |
|--------|---------|-------|
| Component | `/design-accessibility Button` | Single component |
| All components | `/design-accessibility components` | All in /components |
| Tokens | `/design-accessibility tokens` | design-tokens.ts |
| Full system | `/design-accessibility all` | Everything |

## Quick Reference

| Situation | Command |
|-----------|---------|
| Audit a component in this repo | `/design-accessibility Button` |
| Have axe results to process | `/design-accessibility --from-axe` |
| Page behind login wall | `/design-accessibility --external` |
| Need manual testing guidance | `/design-accessibility --manual` |
| Generate screen reader test script | `/design-accessibility --screen-reader` |
| Government/VPAT compliance | `/design-accessibility --compliance` |
| Generate formal report | `/design-accessibility --report` |

## What Gets Checked

### Color & Contrast
- Text contrast ratios (4.5:1 normal, 3:1 large)
- UI component contrast (3:1)
- Color-blind safety
- Color not sole means of conveying information

### Keyboard & Focus
- All functionality keyboard accessible
- Visible focus indicators (WCAG 2.2 compliant)
- Logical tab order
- No keyboard traps
- Escape closes overlays

### ARIA & Semantics
- Correct roles for component patterns
- Accessible names (labels)
- State exposure (expanded, selected, pressed)
- Screen reader compatibility

### Forms (Compliance Mode)
- Labels associated with inputs
- Error identification and suggestions
- Required field indication
- Confirmation for critical actions
- Review before submit

### Motion
- Respects prefers-reduced-motion
- No content flashes > 3x/second
- Animation has purpose

## Issue Severity

| Level | Meaning | Action |
|-------|---------|--------|
| Critical | Blocks users, legal risk | Fix immediately |
| Serious | Significant barrier | Fix before release |
| Moderate | Causes difficulty | Fix next iteration |
| Minor | Enhancement | Consider fixing |

## Axe vs Manual Testing

**Axe catches (~30% of issues):**
- Missing labels and ARIA
- Color contrast failures
- Semantic markup issues
- Keyboard traps

**Manual testing catches (~70%):**
- Logical tab order
- Focus visibility quality
- Screen reader experience
- Complex interactions

## Output Format

Provides:
1. Summary of issues by severity
2. Each issue with:
   - Location (file:line or page area)
   - WCAG criterion
   - Current vs required state
   - Code fix or recommendation
3. Passed checks list
4. (Report mode) Word document matching VPAT template

---

## Mode: VPAT Report (Full Remediation Document)

**Usage:** `/design-accessibility --vpat`

Generates a complete VPAT Remediation Report as a Word document (.docx) with Jira-ready stories. This is the primary deliverable for state VPAT compliance reviews.

### Required Inputs

When generating a VPAT report, the user MUST provide (or Claude must ask for):

| Input | Description | Example |
|-------|-------------|---------|
| **State** | The U.S. state the VPAT is being prepared for | Michigan, Kentucky, Illinois |
| **Date** | Report date (auto-defaults to today) | February 12, 2026 |
| **VPAT Document** | The formal VPAT conformance report (.docx) | VPAT2.5Rev_WCAG_*.docx |
| **ADA Scan Results** | axe DevTools scan export (.xlsx or .json) | TESTING ADA Scan *.xlsx |

If the user does not provide a state name, **always ask before generating**. The state and date appear on the title page, in headers, and in the output filename.

### Output Filename Convention

`VPAT-Remediation-Report-{State}-{Year}.docx`

Example: `VPAT-Remediation-Report-Michigan-2026.docx`

### Report Structure (Mandatory Sections)

Every VPAT Remediation Report MUST include these sections in this order:

#### 1. Title Page
```
VPAT Accessibility Remediation
Same-Day Fix Plan
Date: {date} | State: {state} | Product: Metrc v{version}
```

#### 2. VPAT Conformance Summary
Table mapping each "Partially Supports" WCAG criterion to remediation ticket IDs.

| WCAG Criterion | VPAT Status | Remediation |
|---|---|---|
| 1.3.1 Info and Relationships (A) | Partially Supports | A11Y-001, A11Y-002 |

#### 3. Executive Summary
Table of all tickets with component, issue count, severity, time estimate, and WCAG mapping.

| Ticket | Component | Issues | Severity | Time | WCAG |
|---|---|---|---|---|---|
| A11Y-001 | Main Navigation Bar | 157 | Critical | 1-2 hrs | 1.3.1 |

Include: **Total Estimated Time: X hours of dev work**

#### 4. Issue Distribution by Page
Table showing critical/serious/total counts per page scanned.

| Page | Critical | Serious | Total |
|---|---|---|---|
| Plants | 39 | 15 | 54 |

#### 5. Root Cause Analysis
Identify shared root causes and calculate what % of total issues they resolve.

#### 6. Remediation Tickets (Jira Stories)

Each ticket MUST follow this format:

```
TICKET HEADER:
  - Ticket ID (A11Y-001, A11Y-002, etc.)
  - Title
  - Priority (P0-CRITICAL, P1-SERIOUS, P2-LOW)
  - Issues Fixed count
  - WCAG criterion and level
  - Component name
  - Estimated Time

TICKET BODY:
  - VPAT Finding (quote from VPAT document, italic)
  - Problem (technical description of the root cause)
  - Affected Elements (list of CSS selectors/components)
  - Fix (code examples with Before/After)
  - Additional Fixes (if applicable)
  - Verification (checkbox checklist)
```

**Example Ticket:**
```
A11Y-001: Fix Main Navigation Bar ARIA Parent-Child Hierarchy
Priority: P0 - CRITICAL | Issues Fixed: 157 | WCAG: 1.3.1 (Level A)
Component: Main Navigation Bar (ul.nav.d-flex[role="menubar"])
Est. Time: 1-2 hours

VPAT Finding:
"The main navigation bar includes ARIA roles that do not have
 the appropriate required parent/children relationships"

Problem:
All <a> elements with role="menuitem" are not contained within a
proper role="menu" or role="menubar" parent. The <li> elements
break the expected ARIA hierarchy.

Affected Elements:
- .dropdown:nth-child(1) - Notifications dropdown
- .navigation-first-link - First nav item
- .split-dropdown.dropdown (x5) - Main nav items

Fix (Recommended):
Add role="none" to all <li> elements in the navigation.

  Before: <li class="dropdown">
  After:  <li class="dropdown" role="none">

Verification:
[ ] axe scan shows 0 aria-required-parent errors
[ ] Keyboard: Tab navigates through all menu items
[ ] Screen reader: Menu items announced with correct role
[ ] VPAT criterion can be updated to "Supports"
```

#### 7. Deployment Checklist
- Pre-Deploy: All tickets completed, code reviewed, local axe scan clean
- Post-Deploy: axe scan all pages, manual keyboard test, SR spot check
- VPAT Update: List each criterion → new status

### Styling (Word Document)

| Element | Style |
|---------|-------|
| Title | 24pt Calibri Bold, Dark Blue (#1B3A5C) |
| Headings | 14pt Calibri Bold, Dark Blue |
| Table Headers | 9pt White text on Dark Blue (#1B3A5C) background |
| Code Blocks | 8.5pt Consolas, Dark Gray (#2D2D2D) |
| Critical Priority | Red (#C0392B), Bold |
| Serious Priority | Orange (#D46B08), Bold |
| Checkboxes | Unicode ballot box (☐) |

### States Analyzed

Track which states have been analyzed. Always check existing reports before generating a new one:

| State | Report File | Date | Type | Notes |
|-------|-------------|------|------|-------|
| Illinois | `!!! Metrc/VPAT-Remediation-Tickets.docx` | Jan 28, 2026 | VPAT Remediation | Formal VPAT report, same source VPAT (1/13/2026) as MI |
| Kentucky | `VPAT-Remediation-Tickets-Kentaki.docx` | Jan 28, 2026 | Meeting Analysis | Aria tree grid analysis from meeting — NOT a VPAT report |
| Michigan | `VPAT-Remediation-Report-Michigan-2026.docx` | Feb 12, 2026 | VPAT Remediation | Canonical formatted report — full Jira ticket format |

**Note:** IL and MI share identical VPAT (dated 1/13/2026) and axe scan data (from testing-il.metrc.com). The Kentucky file is an aria tree grid analysis from a meeting conversation, not a formal VPAT remediation report.

---

---

## Confluence Documentation

All outputs are automatically published to Confluence. Every mode creates or updates a page under the **Metrc Accessibility Compliance** parent page in the UE1 space.

**Confluence parent page:** [Metrc Accessibility Compliance](https://metrc-tech.atlassian.net/wiki/spaces/UE1/pages/785743883) (ID: 785743883)

| Mode | Publishes To |
|------|-------------|
| Standard audit | Component Audits subpage |
| `--from-axe` | axe Scan Results Archive subpage |
| `--vpat` | VPAT Remediation Status subpage (per state) |
| `--report` | Formal report subpage |
| `--compliance` | VPAT Remediation Status subpage |
| `--external` | Component Audits subpage |
| `--manual` | Accessibility Testing Strategy page |
| `--screen-reader` | Component Audits subpage |

**To skip Confluence publishing:** Add `--no-confluence` to any command.

**MCP tools:** Uses `createConfluencePage` / `updateConfluencePage` with `cloudId: "metrc-tech.atlassian.net"`, `spaceId: "520290313"`, `contentFormat: "markdown"`.

See `/Skills/design-accessibility/SKILL.md` for full Confluence configuration, page hierarchy, and MCP tool usage.

---

## Detailed Specification

See `/Skills/design-accessibility/SKILL.md` for full audit criteria, fix patterns, and checklists.

## User Input

$ARGUMENTS

---

Specify what to audit:
- Component name, "components", "tokens", or "all" (for local code)
- `--from-axe` to import axe DevTools results
- `--external` for pages behind login walls
- `--manual` for interactive testing checklist
- `--screen-reader` for screen reader test scripts
- Add `--compliance` for Section 508 + regulatory checks
- Add `--report` for formal documentation output
- **`--vpat` for full VPAT remediation report with Jira stories** (requires state name, VPAT doc, and ADA scan)
- Add `--no-confluence` to skip publishing to Confluence (local-only output)
