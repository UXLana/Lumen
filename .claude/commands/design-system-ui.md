---
name: design-system-ui
description: Improve the visual design, interactions, and UX of the MTR Design System documentation app
---

# Design System UI

## When to Use

- Improving navigation design (sidebar, active states, mobile drawer)
- Fixing layout issues and responsive breakpoints
- Enhancing visual hierarchy (typography, spacing, color usage)
- Adding/improving interactions (hover, focus, transitions)
- Polishing cards, containers, code blocks, tables
- Improving accessibility (focus states, contrast, reduced motion)

## What This Skill Does NOT Handle

| Task | Use Instead |
|------|-------------|
| Adding new documented components | `/design-system-builder` |
| Creating icons | `/icon-generator` |
| Building UI components | `/component-generator` |
| Updating token values | `/brand-tokens-translator` |

## Critical Rules

1. **Always use design tokens** - Never hardcode colors, spacing, radius, etc.
2. **Invoke `/frontend-design` first** for major UI/UX changes
3. **Test at all breakpoints** - 320px, 640px, 768px, 1024px, 1280px
4. **Ensure accessibility** - Focus states, contrast, reduced motion

## Design Token Usage

```tsx
import {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitionPresets,
} from '@/styles/design-tokens';
```

## Interaction Standards

- **Transitions**: 150ms (fast), 200ms (default), 300ms (slow)
- **Hover**: Subtle background changes, no layout shift
- **Focus**: Always visible, ring-2 with primary color
- **Active**: Slight scale reduction (0.98)

## Accessibility Checklist

- [ ] Body text contrast: 4.5:1 minimum
- [ ] All interactive elements focusable
- [ ] Focus order follows reading order
- [ ] Reduced motion respected

## User Input Required

$ARGUMENTS

---

Please describe the UI improvement you'd like to make. I'll analyze the current implementation and propose changes.
