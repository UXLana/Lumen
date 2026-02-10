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
