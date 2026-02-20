# Global Product Registry — Clickable Prototype

**Status**: High-Fidelity Draft
**Last Updated**: 2026-02-12
**Fidelity**: High-fi (production tokens, real interactions)
**Route**: `/prototypes/gcr-dashboard`

## Screens

| # | Screen | Status | Key Interactions |
|---|--------|--------|-----------------|
| 1 | Product Catalog (Table + Grid) | Done | Search, filter by status/type, table/grid toggle, click-to-detail |
| 2 | Product Detail (Tabbed) | Done | Tab navigation (Basic, Identifiers, Specs, Markets, Components), Edit/Archive actions |
| 3 | Product Create Form | Done | Multi-section form, category/type dependent dropdowns, market selection, validation |
| 4 | Bundle Create Form | Done | Same as Create + component product search/add with quantity controls |
| 5 | Product Edit | Done | Pre-filled form, same validation, confirmation dialog |
| 6 | Bundle Edit | Done | Pre-filled with existing components, quantity adjustment |
| 7 | Archive Dialog | Done | Confirmation modal with downstream impact warning, bundle-specific messaging |
| 8 | Brand Switcher | Done | Header dropdown, brand context switching |
| 9 | Brand Management | Done | Brand list, active brand indicator |

## User Flows Implemented

1. **Browse → View Product**: Catalog → click row → Detail (with back nav)
2. **Create Product**: Catalog → "Create Product" → Form → Confirmation → Success toast → Catalog
3. **Edit Product**: Detail → "Edit" → Pre-filled form → Confirmation → Success toast
4. **Create Bundle**: Catalog → "Create Bundle" → Form + Component selector → Confirmation → Success
5. **Archive Product**: Detail → "Archive" → Warning dialog → Confirm → Toast → Catalog
6. **Switch Brand**: Header brand dropdown → select brand → context switches

## Design Tokens Used

All colors, typography, spacing, border radius, shadows, and component tokens from `styles/design-tokens.ts`. Specific component tokens:
- `button` (emphasis levels, destructive, focus)
- `sidebar` (nav items, sections, colors)
- `header` (search, org dropdown)
- `tab` (active/inactive states)

## Component Gap Analysis

Components that exist in DLS and were referenced:
- Button (adapted from `components/Button/Button.tsx` tokens)
- Badge (status badges)
- Tab (section navigation)

Components needed but NOT in DLS:
- `// TODO: [COMPONENT_GAP]` Table — sortable data table with column headers
- `// TODO: [COMPONENT_GAP]` SearchInput — search field with icon
- `// TODO: [COMPONENT_GAP]` Select/Dropdown — form select with styling
- `// TODO: [COMPONENT_GAP]` TextInput — styled form input
- `// TODO: [COMPONENT_GAP]` Modal/Dialog — confirmation dialog
- `// TODO: [COMPONENT_GAP]` Toast — success/error notifications
- `// TODO: [COMPONENT_GAP]` MarketBadge — state abbreviation chips
- `// TODO: [COMPONENT_GAP]` BrandSwitcher — brand context dropdown

## Open Questions for Review

1. Permission UX: Currently all actions are visible. Need decision on disabled vs. hidden for restricted roles.
2. Table pagination: Not yet implemented — prototype shows all products at once.
3. Market-specific form fields: Placeholder section. Need field definitions per market.
4. Image upload: Not implemented (form shows placeholder). Need upload component design.

## Source Spec

See `prototypes/global-product-registry/spec.md` for the full compiled Confluence spec.
