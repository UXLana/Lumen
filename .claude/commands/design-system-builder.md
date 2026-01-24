---
name: design-system-builder
description: Build and maintain the MTR Design System shell, documentation UI, and token visualization pages
---

# Design System Builder

## When to Use

- Adding new foundation pages (colors, typography, etc.)
- Adding new component documentation
- Updating design system navigation
- Creating token visualization pages
- Integrating components from prototype handoffs

## File Ownership

| File Path | Purpose |
|-----------|---------|
| `/app/design-system/shared.tsx` | Layout, sidebar nav, CodeBlock, SpecTable, Playground, iconMap |
| `/app/design-system/page.tsx` | Landing page with foundationItems and componentItems |
| `/app/design-system/[token]/page.tsx` | Foundation pages |
| `/app/components/[component]/page.tsx` | Component documentation pages |

## Workflow: Adding a New Component

1. **Invoke `/icon-generator`** for navigation icon
2. **Invoke `/component-generator`** for component code
3. **Update shared.tsx**: Import icon, add to iconMap and navSections
4. **Update page.tsx**: Add to componentItems array
5. **Create documentation page** at `/app/components/[name]/page.tsx`

## Documentation Page Template

Include these sections:
- Header (title, description)
- Interactive Playground
- Usage code examples
- Variants showcase
- Props table (SpecTable)
- Accessibility notes
- Design guidelines (Do/Don't)

## Temp Component Builder Mode

When receiving prototype handoffs:
1. Create temp components in `/components/temp/[project]/`
2. Track review status in component headers
3. Iterate based on Content/A11y/UX feedback
4. Promote to canonical `/components/ui/` when approved

## User Input Required

$ARGUMENTS

---

Please specify what you'd like to add or update in the design system. I'll coordinate with other skills as needed.
