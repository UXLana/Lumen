# A11Y-006: Color Contrast Issues

## Ticket Summary

| Field | Value |
|-------|-------|
| **Priority** | P1 - SERIOUS |
| **Issues Fixed** | 12+ |
| **WCAG Criterion** | 1.4.3 Contrast Minimum (Level AA) |
| **Estimated Time** | 30 minutes |
| **Affected Pages** | Packages, Transfers, Plants (any page with grids) |

---

## Problem Statement

### From VPAT Report
> Pages with grids containing icons indicating their 'type' (Trade Sample icon, Product Package icon, Lab Sample Package, etc.) the icons are not meeting the color contrast ratio threshold.

### From axe Scan
> Text in `.grid-finished-row` cells doesn't meet 4.5:1 contrast ratio.

### Issues Identified

1. **Icon Contrast Failure (WCAG 1.4.11)**
   - Grid type indicator icons use light gray colors
   - Current: ~#CCCCCC (1.60:1 contrast ratio)
   - Required: 3:1 minimum for non-text elements

2. **Text Contrast Failure (WCAG 1.4.3)**
   - Finished/completed row text is too light
   - Current: ~#B0B0B0 (2.65:1 contrast ratio)
   - Required: 4.5:1 minimum for normal text

---

## UX Solution

### Solution A: Finished Row Text Color

**Change `.grid-finished-row` text color:**

| State | Before | After |
|-------|--------|-------|
| Hex | #B0B0B0 | **#595959** |
| Contrast Ratio | 2.65:1 | **5.92:1** |
| Status | FAIL | **PASS** |

**CSS Implementation:**
```css
.grid-finished-row {
  /* OLD: color: #B0B0B0; */
  color: #595959; /* WCAG AA compliant: 5.92:1 */
}
```

---

### Solution B: Package Type Indicator Icons

Update icon color from light gray to accessible dark gray (monochromatic).

#### Icon Color Specification

| Element | Before | After | Contrast Ratio |
|---------|--------|-------|----------------|
| All Package Type Icons | #CCCCCC | **#595959** | 5.92:1 (passes 3:1) |

**No shape changes needed** - same icon, just darker gray color.

---

## Design Tokens

### Token Definitions

Add to design token system:

```typescript
colors: {
  grid: {
    // Text color for finished/completed rows
    // WCAG 1.4.3: 4.5:1 required, this achieves 5.92:1
    finishedRowText: '#595959',

    // Package type indicator icon color (monochromatic gray)
    // WCAG 1.4.11: 3:1 required, this achieves 5.92:1
    packageIconColor: '#595959',
  },
}
```

### Token File Location
`/styles/design-tokens.ts` - `colors.grid` section

---

## Implementation Steps

### Step 1: Update CSS for Finished Rows

```css
.grid-finished-row,
.grid-finished-row td {
  color: #595959;
}
```

### Step 2: Update Icon Colors

Change existing package type icon color from light gray to accessible dark gray:

| Element | Old Color | New Color |
|---------|-----------|-----------|
| All Package Type Icons | #CCCCCC | **#595959** |

**Same color as finished row text** - simple, consistent fix.

---

## Prototype

### View Prototype
Navigate to: `/prototypes/a11y-006-contrast-fix`

### Prototype Features
- Before/After comparison
- Icon legend with contrast ratios
- Sample grid with all package types
- Finished row text demonstration

---

## Verification Checklist

### Pre-Deploy
- [ ] CSS updated for `.grid-finished-row` with `#595959`
- [ ] Icon components imported from `/components/Icons/IconPackageTypes`
- [ ] Icons rendering correctly for each package type
- [ ] Icon colors match specification

### Post-Deploy
- [ ] axe scan shows 0 `color-contrast` errors
- [ ] Manual check: All grid icons meet 3:1 contrast ratio
- [ ] Visual verification: Finished rows still visually distinct from active rows
- [ ] Screen reader test: Icons announced with correct labels
- [ ] Design approval on new color values

### VPAT Update
- [ ] 1.4.3 Contrast (Minimum) can be updated to "Supports"

---

## Files Included in This Solution

| File | Purpose |
|------|---------|
| `/components/Icons/IconPackageTypes.tsx` | New icon components |
| `/components/Icons/index.ts` | Updated exports |
| `/styles/design-tokens.ts` | Added `colors.grid` tokens |
| `/prototypes/a11y-006-contrast-fix/` | Visual prototype |
| `/app/prototypes/a11y-006-contrast-fix/page.tsx` | Prototype route |

---

## Related Tickets

- **A11Y-001**: Main Navigation Bar (ARIA hierarchy)
- **A11Y-002**: Tabstrip Components (ARIA roles)
- **A11Y-005**: Grid ARIA Attributes
- **A11Y-007**: Pointer Cancellation

---

## Contact

For questions about this UX solution, contact the Design System team.
