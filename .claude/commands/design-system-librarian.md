---
name: design-system-librarian
description: Manage and organize the MTR Design System library, including cataloging and documentation
---

# Design System Librarian

## When to Use

- Auditing existing components and tokens
- Organizing and categorizing assets
- Managing component documentation
- Tracking usage and dependencies
- Identifying gaps and redundancies
- Maintaining changelog and versioning

## Capabilities

### Inventory Management
- Component catalog maintenance
- Token inventory tracking
- Icon library organization
- Pattern documentation

### Documentation
- Component API documentation
- Usage guidelines
- Migration guides
- Changelog updates

### Analysis
- Usage analytics review
- Dependency mapping
- Redundancy identification
- Gap analysis

### Maintenance
- Deprecation management
- Version tracking
- Breaking change documentation
- Compatibility notes

## Library Structure

```
/components/
├── ui/              # Production components
├── icons/           # Icon components
├── temp/            # Temporary/draft components
└── index.ts         # Exports

/styles/
├── design-tokens.ts # Token definitions
└── globals.css      # Global styles

/app/
├── design-system/   # Documentation app
└── components/      # Component doc pages
```

## Audit Checklist

- [ ] All components have TypeScript types
- [ ] All components have documentation pages
- [ ] All tokens are used (no orphans)
- [ ] All components use tokens (no hardcoded values)
- [ ] Exports are correctly configured
- [ ] Accessibility requirements documented
- [ ] Documentation uses correct import paths (package name, not @/ aliases)
- [ ] Quick Start sections show both package and alias imports
- [ ] No hardcoded hex colors in components (use design tokens)
- [ ] CSS custom properties map to design tokens (globals.css)

## Import Path Standards

Documentation Quick Start sections should show both import methods:

```tsx
// Package import (recommended for consumers)
import { ComponentName } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { ComponentName } from '@/components'
```

**Why this matters:**
- `@/components` assumes the consumer has the same path alias configured
- External consumers need the package name (`@metrc/design-system`)
- Internal documentation can use either, but should show both options

## User Input Required

$ARGUMENTS

---

What would you like help with?
- Audit the current library state
- Document a specific component
- Track dependencies
- Identify gaps or redundancies
