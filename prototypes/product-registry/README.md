# Prototype: Global Product Registry

## Config
- **Theme**: University
- **Device**: Desktop (1440px) with responsive mobile (375px)
- **Fidelity**: High-fi
- **Created**: 2026-03-10
- **Last updated**: 2026-03-10

## Sources
- Confluence: [Registry PRD Prompt](https://metrc-tech.atlassian.net/wiki/spaces/UE1/pages/673939490/Registry+PRD+Prompt) (User Experience space)
- Compiled from: Registry Business Plan (Canopy) + Global Product Registry MVP (Retail ID)

## Screens

| Screen | Route | Status | Notes |
|--------|-------|--------|-------|
| Product Catalog | /prototypes/product-registry/catalog | In Progress | Main landing, search/filter, table view |
| Product Detail | /prototypes/product-registry/detail | In Progress | Tabbed detail view with all sections |
| Product Create | /prototypes/product-registry/create | In Progress | Multi-step form with confirmation |
| Brand Context Nav | (integrated in layout) | In Progress | Header with brand switcher |
| Bundle Create | /prototypes/product-registry/bundle-create | Not Started | P1 |
| Product Edit | /prototypes/product-registry/edit | Not Started | P1 — same form as create, pre-filled |
| Bundle Edit | /prototypes/product-registry/bundle-edit | Not Started | P1 |
| Archive Dialog | (modal in detail view) | Not Started | P1 |
| Brand Management | /prototypes/product-registry/brand-mgmt | Not Started | P2 |

## Components Created
- `Select` — Dropdown select with keyboard nav, search, error states, full a11y
- `Textarea` — Multiline text input with label, error, helper text

## Decisions
- 2026-03-10: University theme selected for Canopy ecosystem identity (forest green + gold accent)
- 2026-03-10: Desktop-first with responsive mobile breakpoint
- 2026-03-10: P0 subset: Catalog + Detail + Create + integrated brand nav
- 2026-03-10: Using DataTable for catalog (sortable, filterable), TabBar for detail sections
- 2026-03-10: Header component reused with brand switcher via OrgDropdown
- 2026-03-10: LinearStepper for multi-step product create form
- 2026-03-10: Permission UX → hidden buttons (not disabled) for restricted actions
- 2026-03-10: Registry is a standalone app in the Canopy ecosystem (not embedded in Retail ID)
- 2026-03-10: Market-specific compliance fields — deferred, needs PM/engineering input

## Accessibility
- Select: `role="combobox"` with `aria-expanded`, keyboard nav (Arrow, Enter, Escape), focus-visible
- Textarea: `aria-invalid` on error, associated error messages
- All screens: state switcher for reviewer testing

## Open Questions
- Market-specific compliance fields: what exactly are the per-market fields? (PM/engineering TBD)
- Search scope: product name only, or also SKU/description/category? (prototype currently supports name + SKU + category)
