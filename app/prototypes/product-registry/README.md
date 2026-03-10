# Prototype: Product Registry

## Config
- **Owner**: Lana Holston
- **Status**: in-review
- **Theme**: Trace
- **Device**: Desktop (1440px)
- **Fidelity**: High-fi
- **Created**: 2026-03-10
- **Last updated**: 2026-03-10

## Sources
- Verbal description: Product catalog with search, filters, and CRUD flows for the GCR platform

## Screens

| Screen | Route | Status | Notes |
|--------|-------|--------|-------|
| Catalog | /prototypes/product-registry/catalog | Complete | Main product listing with DataTable, filters, view toggle |
| Detail | /prototypes/product-registry/detail | Complete | Product detail with tabs, markets, bundles |
| Create | /prototypes/product-registry/create | Complete | Multi-step form (5 steps) with validation |

## Components Used (from design system)
- `DataTable` — product listing with toolbar, view toggle, card view
- `Badge` — category colors, status indicators
- `ProductCard` — card view rendering
- `Header` — app shell header
- `Input` / `Select` — form fields and filters
- `Button` — actions throughout

## Components Created
- None

## Decisions
- 2026-03-10: Used DataTable with card view toggle for flexible product browsing
- 2026-03-10: 5-step create form with stepper navigation
- 2026-03-10: Category-to-color mapping for badge differentiation

## Open Questions
- Should bulk actions be available in the catalog view?
- How should draft vs published products be visually differentiated?
