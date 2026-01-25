---
name: design-accessibility
description: Audit and fix accessibility issues in components and tokens against WCAG 2.2 AA and Section 508 standards
---

# Design Accessibility

## When to Use

- Auditing components for WCAG 2.2 AA compliance
- Checking color contrast ratios in tokens
- Reviewing keyboard navigation and focus management
- Validating ARIA patterns
- Generating compliance reports for audits
- Section 508 compliance verification (for government contracts)

## Modes

| Mode | Command | What It Does |
|------|---------|--------------|
| Standard | `/design-accessibility [target]` | WCAG 2.2 AA audit with fixes |
| Compliance | `/design-accessibility [target] --compliance` | Adds Section 508 + regulatory checks |
| Report | `/design-accessibility --report` | Generates formal compliance documentation |

## Targets

| Target | Example | Scope |
|--------|---------|-------|
| Component | `/design-accessibility Button` | Single component |
| All components | `/design-accessibility components` | All in /components |
| Tokens | `/design-accessibility tokens` | design-tokens.ts |
| Full system | `/design-accessibility all` | Everything |

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

## Output Format

Provides:
1. Summary of issues by severity
2. Each issue with:
   - Location (file:line)
   - WCAG criterion
   - Current vs required state
   - Code fix
3. Passed checks list
4. (Compliance mode) Formal report for audits

## Detailed Specification

See `/Skills/design-accessibility.skill.md` for full audit criteria, fix patterns, and checklists.

## User Input

$ARGUMENTS

---

Specify what to audit:
- Component name, "components", "tokens", or "all"
- Add `--compliance` for Section 508 + regulatory checks
- Add `--report` for formal documentation output
