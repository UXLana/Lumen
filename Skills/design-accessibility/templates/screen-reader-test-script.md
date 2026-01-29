# Screen Reader Test Script Template

## Page: [PAGE NAME]
**Date:** [DATE]
**Tester:** [NAME]
**Screen Reader:** [ ] VoiceOver (Mac) [ ] NVDA (Windows) [ ] JAWS (Windows)
**Browser:** [ ] Safari [ ] Chrome [ ] Firefox [ ] Edge

---

## Pre-Test Setup

1. [ ] Screen reader enabled and configured
2. [ ] Browser zoom at 100%
3. [ ] Test page loaded
4. [ ] Focus at top of page (refresh if needed)

---

## Test Results

### 1. Page Load & Structure

| Test | Expected | Actual | Pass |
|------|----------|--------|------|
| Page title announced | "[Page title], web content" | | [ ] |
| Heading structure (H shortcut) | Logical H1 → H2 → H3 order | | [ ] |
| Landmark regions (D shortcut VO) | main, navigation, etc. | | [ ] |

### 2. Navigation

| Test | Expected | Actual | Pass |
|------|----------|--------|------|
| Tab to first interactive element | Focus moves, element announced | | [ ] |
| Tab order is logical | Follows visual/reading order | | [ ] |
| Can Tab away from all elements | No keyboard traps | | [ ] |
| Skip link works (if present) | Skips to main content | | [ ] |

### 3. Interactive Elements

#### Buttons
| Element | Expected Announcement | Actual | Pass |
|---------|----------------------|--------|------|
| [Button 1 name] | "[label], button" | | [ ] |
| [Button 2 name] | "[label], button" | | [ ] |
| [Disabled button] | "[label], button, dimmed" | | [ ] |

#### Links
| Element | Expected Announcement | Actual | Pass |
|---------|----------------------|--------|------|
| [Link 1] | "[text], link" | | [ ] |
| [Link 2] | "[text], link" | | [ ] |

#### Form Fields
| Element | Expected Announcement | Actual | Pass |
|---------|----------------------|--------|------|
| [Field 1 label] | "[label], edit text" | | [ ] |
| [Field 2 label] | "[label], edit text" | | [ ] |
| [Required field] | "[label], required, edit text" | | [ ] |
| [Field with error] | "[label], invalid, [error text]" | | [ ] |

### 4. Dynamic Content

| Test | Expected | Actual | Pass |
|------|----------|--------|------|
| Error messages announced | Automatic announcement or on focus | | [ ] |
| Success messages announced | Polite announcement | | [ ] |
| Loading states announced | "Loading" or similar | | [ ] |
| Content updates announced | Live region triggers | | [ ] |

### 5. Modal/Dialog (if applicable)

| Test | Expected | Actual | Pass |
|------|----------|--------|------|
| Opens and announces | "[title], dialog" | | [ ] |
| Focus moves inside | First element focused | | [ ] |
| Focus trapped | Tab cycles within modal | | [ ] |
| Escape closes | Modal closes | | [ ] |
| Focus returns | To trigger element | | [ ] |

### 6. Tables (if applicable)

| Test | Expected | Actual | Pass |
|------|----------|--------|------|
| Table announced | "[caption], table, X rows, Y columns" | | [ ] |
| Headers associated | Column header read with cell | | [ ] |
| Can navigate cells | Arrow keys work | | [ ] |

---

## Issues Found

| # | Element | Issue | Severity | WCAG |
|---|---------|-------|----------|------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## Summary

- **Total Tests:** [X]
- **Passed:** [X]
- **Failed:** [X]
- **Overall:** [ ] Pass [ ] Fail

**Notes:**

---

**Tester Signature:** ___________________ **Date:** ___________
