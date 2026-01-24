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

## User Input Required

$ARGUMENTS

---

What would you like help with?
- Audit the current library state
- Document a specific component
- Track dependencies
- Identify gaps or redundancies
