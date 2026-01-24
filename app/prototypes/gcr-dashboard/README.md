# GCR Dashboard Prototype

## Overview
Wireframe prototype for the Global Cannabis Registry (GCR) Products dashboard.

## Status: Draft - Ready for Review

## Screens

| Screen | Status | Description |
|--------|--------|-------------|
| ProductsPage | Draft | Main products listing with stats, filters, and grid |

## Fidelity Level
**Wireframe** - Gray boxes, dashed borders, structure only

## Screen Inventory

### ProductsPage
- **Header**: Logo, search bar, notifications, help, org switcher
- **Sidebar**: Navigation (Home, Products, Bundles, Integrations), Admin section (Employees, Settings), Logout
- **Stats Row**: 4 stat cards (Total products, Total bundles, Drafts, Active)
- **Tabs**: All products, Markets, Brands
- **Actions**: Register new product button, Select mode dropdown, Grid/List toggle
- **Product Grid**: 3-column grid of product cards
- **Pagination**: Items count, per-page selector, page navigation

## Assumptions Made

1. **Layout**: Desktop-first, ~1440px viewport assumed
2. **Grid**: 3-column product grid at desktop breakpoint
3. **Sidebar**: Fixed width (224px), collapsible not shown
4. **Stats Cards**: Horizontal scroll not implemented for smaller viewports
5. **Product Cards**: All cards show same structure (image, brand, name, SKU, tags, markets)
6. **Pagination**: Standard pattern with first/prev/next/last controls

## Questions for Review

1. Should the sidebar collapse on smaller screens or use a drawer pattern?
2. Are the 4 stat cards fixed, or can users customize which stats appear?
3. Should product cards have hover states or quick actions?
4. Is the "Select mode" dropdown for bulk selection of products?
5. What happens when clicking a product card - modal or new page?

## Design Tokens Needed

- `colors.neutral.200`, `neutral.300`, `neutral.500` (wireframe grays)
- `spacing.4`, `spacing.6` (padding/gaps)
- `border.dashed` (wireframe style)

## Next Steps

1. [ ] Review wireframe structure
2. [ ] Confirm assumptions or provide corrections
3. [ ] Move to low-fi or high-fi fidelity
4. [ ] Add additional screens (Product Detail, etc.)

## View Prototype

Navigate to: `/prototypes/gcr-dashboard`
