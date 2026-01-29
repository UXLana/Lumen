---
name: design-accessibility
description: Audit and fix accessibility issues against WCAG 2.2 AA and Section 508 standards. Supports auditing local code, importing axe results, auditing external pages behind login walls, and generating compliance reports.
---

# Design Accessibility

Audit and remediate accessibility issues against WCAG 2.2 AA and Section 508 standards.

## Commands

| Command | Mode | Description |
|---------|------|-------------|
| `/design-accessibility [target]` | Standard | Audit code in this repo |
| `/design-accessibility --from-axe` | Axe Import | Parse axe DevTools results |
| `/design-accessibility --external` | External Page | Audit page behind login wall |
| `/design-accessibility --manual` | Manual Checklist | Interactive testing guide |
| `/design-accessibility --screen-reader` | Screen Reader | Generate SR test scripts |
| `/design-accessibility --compliance` | Compliance | Adds Section 508 + regulatory checks |
| `/design-accessibility --report` | Report | Generate formal documentation |

---

## Mode: Standard (Local Code Audit)

**Usage:** `/design-accessibility [target]`

**Targets:**
| Target | Scope |
|--------|-------|
| `Button` | Single component by name |
| `components` | All components in /components |
| `tokens` | Design tokens only (color contrast, typography) |
| `all` | Full system audit |
| `src/components/Form.tsx` | Specific file path |

**Workflow:**
1. Parse target (component, file, or scope)
2. Load relevant references
3. Analyze TSX, CSS, token files
4. Check against WCAG 2.2 AA criteria
5. Output findings with code fixes

---

## Mode: Axe Import

**Usage:** `/design-accessibility --from-axe`

Imports and processes axe DevTools results. Best for:
- Auditing running applications
- Testing pages behind login walls
- Generating reports from automated scans

**Workflow:**
1. User runs axe DevTools in browser
2. User exports JSON results
3. User pastes JSON or provides file path
4. Skill parses axe output
5. Maps to WCAG criteria
6. Generates report in template format

**How to get axe results:**
```
1. Install axe DevTools browser extension
2. Navigate to page to test
3. Open DevTools → axe DevTools tab
4. Click "Scan ALL of my page"
5. Click "Export Results" → JSON
6. Paste or save the JSON
```

**What axe catches well:**
- Missing labels and ARIA attributes
- Color contrast failures
- Semantic markup issues
- Keyboard traps
- Form accessibility

**What axe cannot catch (needs manual testing):**
- Logical tab order
- Focus visibility quality
- Screen reader experience
- Complex interaction patterns

---

## Mode: External Page Audit

**Usage:** `/design-accessibility --external`

For auditing pages you can't give me direct access to. Best for:
- Pages behind login walls
- Staging/test environments
- Third-party integrations

**Workflow:**
1. User provides one or more of:
   - Axe results (recommended - most accurate)
   - HTML from DevTools (optional, for code context)
   - Screenshot (optional, for visual reference)
2. Skill analyzes provided data
3. Generates findings based on what can be verified
4. Marks unverifiable items as "needs manual testing"

**What I can verify from each input:**

| Input | What I Can Check |
|-------|------------------|
| Axe results | ARIA, labels, contrast, semantic HTML, keyboard traps |
| HTML code | Markup structure, ARIA usage, label associations |
| Screenshot | Visual contrast, layout, visible focus indicators |
| None | Nothing - I'll guide you through manual testing |

**Example conversation:**
```
User: /design-accessibility --external
Claude: I'll help audit an external page. Please provide:
1. Axe DevTools JSON export (recommended)
2. HTML from DevTools Elements panel (optional)
3. Screenshot (optional)

What do you have available?

User: I have axe results, here's the JSON: [paste]
Claude: Found 8 issues. Generating report...
```

---

## Mode: Manual Testing Checklist

**Usage:** `/design-accessibility --manual`

Interactive guide for testing things automated tools miss (~70% of real issues).

**Covers:**
- Keyboard-only navigation
- Screen reader announcements
- Focus visibility and order
- Escape key behavior
- Modal focus trapping
- Skip link functionality

**Keyboard Testing Checklist:**
| Test | What to Check |
|------|---------------|
| Tab through page | Focus moves in logical order |
| Shift+Tab | Focus moves backwards |
| Enter/Space on buttons | Action triggers |
| Escape on modals | Closes and returns focus |
| Arrow keys in widgets | Navigation within component |
| Focus visibility | Clear indicator on every element |

**Screen Reader Quick Test (VoiceOver on Mac):**
```
1. Enable: Cmd + F5
2. Navigate: Ctrl + Option + Arrow keys
3. Read all: Ctrl + Option + A
4. Stop: Ctrl
```

See `references/testing-checklist.md` for complete procedures.

---

## Mode: Screen Reader Testing

**Usage:** `/design-accessibility --screen-reader [component|page]`

Generates screen reader test scripts with expected announcements.

**What it provides:**
- Expected announcements for each element
- Test script template (printable/fillable)
- VoiceOver and NVDA commands
- Pass/fail checklist

**Example output:**
```markdown
## Button - Screen Reader Test Script

### Expected Announcements
| State | VoiceOver | NVDA |
|-------|-----------|------|
| Default | "Submit, button" | "Submit button" |
| Disabled | "Submit, dimmed, button" | "Submit button unavailable" |
| Loading | "Submit, button" + "Loading..." | "Submit button busy" |

### Test Steps
1. Tab to button → Should announce: "Submit, button"
2. Press Enter → Action triggers
3. Tab to disabled button → Should announce disabled state
```

**Automation options:**

1. **Virtual Screen Reader (Unit Tests)**
   ```bash
   npm install --save-dev @guidepup/virtual-screen-reader
   ```
   Simulates SR in Jest/Vitest - catches ~50% of SR issues

2. **Real Screen Reader (E2E)**
   ```bash
   npm install --save-dev @guidepup/guidepup @playwright/test
   ```
   Automates actual VoiceOver/NVDA - catches ~80% of SR issues

3. **AssistivLabs (Cloud)**
   Access to JAWS, NVDA, VoiceOver without local setup
   Best for: JAWS testing, VPAT evidence

See `references/screen-reader-testing.md` for full setup guide.

---

## Mode: Compliance

**Usage:** `/design-accessibility [target] --compliance`

Adds Section 508 and regulatory requirements. Best for:
- Government contracts
- VPAT documentation
- Formal compliance audits

**Additional checks:**
| 508 Provision | WCAG Mapping | Additional Requirements |
|---------------|--------------|------------------------|
| 1194.22(a) | 1.1.1 | Text equivalents for all non-text |
| 1194.22(c) | 1.4.1 | Color not sole means of info |
| 1194.22(n) | 3.2.1-3.2.2 | Electronic forms completable with AT |

**Regulatory Form Requirements (for Metrc context):**
1. Data validation — Errors prevent submission; clear messaging
2. Confirmation dialogs — Irreversible actions require explicit confirmation
3. Session handling — Timeout warnings with option to extend
4. Error recovery — Users can undo or correct submissions

See `references/section-508.md` for full requirements.

---

## Mode: Report

**Usage:** `/design-accessibility --report`

Generates formal compliance documentation.

**Output options:**
- Markdown report
- Word document (using template)

**Template styling:** Uses `templates/VPAT-Remediation-Tickets-template.docx`:
- Dark blue headers (#1A5276) with white text
- Yellow cells for "Partially Supports" status
- White data cells with gray borders
- Structured ticket format (A11Y-001, A11Y-002, etc.)

**Report generator script:**
```bash
# From axe results
node templates/generate-report.js --from-axe results.json --output report.docx

# With custom title
node templates/generate-report.js --from-axe results.json --title "VPAT Remediation" --product "Metrc v1.17" --output report.docx
```

---

## Audit Categories

### 1. Color & Contrast
- Text contrast: 4.5:1 minimum (3:1 for large text ≥18pt/14pt bold)
- UI component contrast: 3:1 minimum for borders, icons, focus indicators
- Color-blind safety: No information conveyed by color alone
- Reference: `references/color-contrast.md`

### 2. Typography & Readability
- Minimum font sizes: 16px base, 14px minimum for secondary text
- Line height: 1.5 minimum for body text
- Text scalability: Must support 200% zoom
- Reference: `references/typography.md`

### 3. Keyboard Navigation
- Focus visible: All interactive elements must show visible focus
- Tab order: Logical navigation sequence
- No keyboard traps: Users can navigate away from all components
- Escape closes: Modal/overlay components close on Escape
- Reference: `references/keyboard.md`

### 4. ARIA & Semantic HTML
- Correct roles: Use native HTML elements where possible
- Required labels: All interactive elements labeled
- State communication: aria-expanded, aria-selected, aria-checked, etc.
- Reference: `references/aria-patterns.md`

### 5. Forms & Data Entry
- Associated labels: Every input has a visible label
- Error identification: Errors described in text (not just color)
- Error suggestions: Guidance on how to fix errors
- Reference: `references/forms.md`

### 6. Timing & Motion
- `prefers-reduced-motion`: Respect user preference
- No flashing: Content does not flash >3 times/second
- Reference: `references/motion.md`

### 7. Cognitive Accessibility (WCAG 2.2)
- Consistent help: Help mechanisms in same location
- Target size: Minimum 24×24 CSS pixels for touch targets
- Reference: `references/cognitive.md`

---

## Severity Levels

| Level | Definition | Response |
|-------|------------|----------|
| **Critical** | Blocks access for users with disabilities | Must fix immediately |
| **Serious** | Significantly impairs usage | Fix before release |
| **Moderate** | Creates difficulty but workarounds exist | Fix next iteration |
| **Minor** | Enhancement opportunity | Add to backlog |

---

## Output Format

### Issue Template

```markdown
### [SEVERITY] Issue Title

**WCAG Criterion:** [Number] — [Name] (Level [A/AA])
**Location:** [File path or page area]
**Category:** [Category Name]

**Current State:**
[Description of the accessibility barrier]

**Required State:**
[What compliance requires]

**Recommendation:**
[Specific fix with code example if applicable]

**Testing:**
- [ ] How to verify the fix
```

---

## Reference Files

| File | Contents |
|------|----------|
| `references/wcag-criteria.md` | Full WCAG 2.2 AA criterion list |
| `references/color-contrast.md` | Contrast calculation, tool usage |
| `references/typography.md` | Font size, line height, scaling |
| `references/keyboard.md` | Focus management, tab order |
| `references/aria-patterns.md` | APG patterns for common components |
| `references/forms.md` | Form accessibility patterns |
| `references/motion.md` | Animation, timing, reduced motion |
| `references/cognitive.md` | WCAG 2.2 cognitive additions |
| `references/section-508.md` | Federal 508 requirements |
| `references/testing-checklist.md` | Manual testing procedures |
| `references/screen-reader-testing.md` | SR automation & expected announcements |

## Template Files

| File | Purpose |
|------|---------|
| `templates/VPAT-Remediation-Tickets-template.docx` | Report styling template |
| `templates/generate-report.js` | Word document generator |
| `templates/screen-reader-test-script.md` | SR test script template |

---

## Quick Reference: What to Use When

| Situation | Command |
|-----------|---------|
| Audit a component in this repo | `/design-accessibility Button` |
| Audit design tokens | `/design-accessibility tokens` |
| Have axe results to process | `/design-accessibility --from-axe` |
| Page behind login wall | `/design-accessibility --external` |
| Need manual testing guidance | `/design-accessibility --manual` |
| Generate screen reader test script | `/design-accessibility --screen-reader Button` |
| Government/VPAT compliance | `/design-accessibility --compliance` |
| Generate formal report | `/design-accessibility --report` |
