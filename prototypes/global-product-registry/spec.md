# Prototype Spec: Global Product Registry

> Compiled from Confluence on 2026-02-12
> Sources:
> - [Registry Business Plan](https://metrc-tech.atlassian.net/wiki/spaces/Canopy/pages/670498832/Registry+Business+Plan) (Canopy space)
> - [Global Product Registry MVP](https://metrc-tech.atlassian.net/wiki/spaces/RE/pages/530808844/Global+Product+Registry+MVP) (Retail Id space)

---

## Overview

The Global Product Registry is a centralized cannabis product data platform — the single source of truth for product information across the entire industry. It is a standalone app within the Canopy ecosystem that powers Metrc's Retail ID, enables third-party integrations (POS, ERP), and provides cross-market visibility for Multi-State Operators.

This prototype should demonstrate the **MVP user-facing experience** for brand managers to manage their product catalog, including: browsing products, viewing product details, creating/editing products, creating/editing bundled products, archiving products, and switching between brand contexts.

---

## Target Users

### Primary: Brand Manager
- Works at a cannabis brand (single-state or MSO)
- Manages the product catalog for one or more brands
- Needs to register products, update details, manage bundled SKUs
- Cares about compliance, accuracy, and cross-market consistency
- Reference: [Figma persona board](https://www.figma.com/board/WZeWERKG7ddeSNGBmlyCE3/Retail-ID---Registry-Users-and-Workflows?node-id=176-1532)

### Secondary: Integration Developer
- Third-party developer building on Registry APIs
- Needs API documentation and best practices
- Not a primary UI user (API-first)

### User Roles & Permissions

| Role | Capabilities | UX Notes |
|------|-------------|----------|
| **Viewer** | View product info, view brand info | Consistent behavior needed: disabled buttons vs. hidden buttons? |
| **Contributor** | View, edit, and create product info | |
| **Admin** | Full CRUD on products, brands, org, users, and permissions | |

---

## Screens & Views

### Screen 1: Brand Context Switcher / Global Navigation

**Purpose**: Allow users to switch between brand contexts. When in Brand X, they only see products for Brand X. MVP is single-brand view only (no multi-brand simultaneous view).

**Entry points**: Persistent in global navigation / header

**Layout**:
- Global nav bar with Canopy ecosystem branding
- Brand selector (dropdown or switcher) showing current active brand
- Navigation links: Products, Brand Management
- User avatar / account menu

**Key interactions**:
- Click brand selector → dropdown of available brands → select to switch context
- All downstream content filters to selected brand
- Navigation between Registry sections (Products, Brand Management)

**States**:
- Default: Brand selected, nav visible
- Loading: Spinner while switching brand context
- Single brand: No switcher needed, just brand name displayed

---

### Screen 2: Product Catalog View (List)

**Purpose**: Browse, search, and filter the full product catalog for the selected brand. Primary landing screen after brand selection.

**Entry points**: Navigation → Products; after brand context switch

**Layout**:
- Page header: "Products" with action button(s)
- Search bar (keyword search — at minimum by product name)
- Filter controls for: name, category, type, status, last updated
- Product table/grid showing:
  - Thumbnail image
  - Product name
  - Category
  - Type (single product vs. bundle)
  - Status (active, archived)
  - Last updated date
- Pagination or infinite scroll
- "Create Product" and "Create Bundle" action buttons

**Key interactions**:
- Search: Type keywords → results filter in real-time or on submit
- Filter: Select filter values → catalog updates
- Click product row → navigate to Product Detail screen
- Click "Create Product" → navigate to Product Create screen
- Click "Create Bundle" → navigate to Bundle Create screen
- Sortable columns

**States**:
- Default: Full catalog loaded with all active products
- Filtered: Subset shown based on active filters; clear filter option
- Empty: No products in catalog — show CTA to create first product
- Loading: Skeleton rows while catalog loads
- Search with no results: "No products match your search" message

---

### Screen 3: Product Detail View

**Purpose**: View all details of a specific product. Read-only view with edit/archive actions.

**Entry points**: Click a product row in Catalog View

**Layout**:
- Back navigation to catalog
- Product header: name, thumbnail, status badge, brand
- Action buttons: "Edit", "Archive" (permission-gated)
- Tabbed or sectioned content areas:
  - **Basic Info**: Name, description, category, type, SKU, status
  - **Product Identifiers**: Retail ID / Registry ID, UPC/EAN if applicable
  - **Commerce Fields**: Price info, commerce enablement data
  - **Specifications**: Ingredients, allergens, THC/CBD content, weight, dimensions
  - **Market-Specific Data**: Per-market compliance fields, market availability
  - **Media**: Product images
  - **Bundle Components** (if bundle): List of component products with quantities
- Activity/audit section (future — placeholder in MVP)

**Key interactions**:
- Click "Edit" → navigate to Product Edit screen
- Click "Archive" → confirmation dialog → archive product
- Tab/section navigation
- For bundles: click a component product → navigate to that product's detail

**States**:
- Default: All product data loaded
- Loading: Skeleton content
- Archived product: Visual indicator (dimmed, banner), edit disabled
- Bundle vs. single: Conditional "Bundle Components" section

---

### Screen 4: Product Create

**Purpose**: Create a new single (non-bundle) product associated with a brand and market(s).

**Entry points**: "Create Product" button from Catalog View

**Layout**:
- Page header: "Create Product"
- Multi-step form or long-form with sections:
  - **Step/Section 1 — Basic Info**: Name, description, category, type
  - **Step/Section 2 — Identifiers & Commerce**: SKU, commerce fields
  - **Step/Section 3 — Specifications**: Ingredients, allergens, THC/CBD, weight, etc.
  - **Step/Section 4 — Market Availability**: Select markets, enter market-specific compliance data
  - **Step/Section 5 — Media**: Upload product images
- Form validation per field definitions (required fields, restrictions)
- "Save as Draft" and "Submit" buttons
- **Confirmation dialog before final submission** (critical — source of truth changes impact downstream systems)

**Key interactions**:
- Fill out form fields with validation
- Select category → type options update (dependent dropdowns)
- Select markets → market-specific fields appear
- Upload images
- Click "Submit" → confirmation modal: "Creating this product will make it available as a source of truth across connected systems. Are you sure?" → Confirm → product created
- Click "Cancel" → confirmation if unsaved changes → return to catalog

**States**:
- Default: Empty form with required field indicators
- Validation errors: Inline field errors, summary at top
- Submitting: Loading spinner on submit button
- Success: Redirect to new product's detail view with success toast
- Error: Error banner with retry option

**Data fields**: Reference external spreadsheet for complete field definitions, restrictions, and requirements.

---

### Screen 5: Product Edit

**Purpose**: Edit details of an existing product.

**Entry points**: "Edit" button from Product Detail View

**Layout**:
- Same form layout as Product Create, pre-filled with existing data
- Changed fields should be visually distinguishable
- "Save Changes" and "Cancel" buttons
- **Confirmation dialog before saving** — changes propagate to downstream systems

**Key interactions**:
- Modify fields
- Click "Save Changes" → confirmation modal: "Updating this product will affect all connected systems using this data. Confirm changes?" → Confirm → saved
- Click "Cancel" → warn if unsaved changes → return to detail view

**States**:
- Default: Pre-filled form
- Dirty: Unsaved changes indicator
- Validation errors: Same as create
- Saving: Loading state
- Success: Return to detail view with success toast

---

### Screen 6: Bundle Product Create

**Purpose**: Create a new bundled product (multi-component SKU) associated with a brand and market(s).

**Entry points**: "Create Bundle" button from Catalog View

**Layout**:
- Same base form as Product Create PLUS:
- **Bundle Configuration Section**:
  - Bundle type indicator (distinguishable from single products)
  - Component product selector: search/select existing products from catalog
  - For each component: product reference + quantity
  - Visual list of added components with remove option
  - Support for all bundle use cases:
    - 1x single item (technically non-bundle, handled in regular create)
    - N× same item (e.g., 3 tins of Grape Gummies)
    - 1× each of multiple items (variety pack)
    - Mixed quantities of multiple items (e.g., 2× Grape + 3× Banana + 1× Cherry)

**Key interactions**:
- Search for component products → add to bundle with quantity
- Adjust quantities per component
- Remove components
- Reorder components (drag or arrows)
- Confirmation dialog on submit (same emphasis as product create)

**States**:
- Default: Empty bundle configuration
- Components added: Visual list with quantities
- Validation: Minimum 1 component required for bundle, all components must be valid products
- Component not found: Search yields no results — option to create the product first

---

### Screen 7: Bundle Product Edit

**Purpose**: Edit an existing bundle's details and/or component configuration.

**Entry points**: "Edit" button from a bundle Product Detail View

**Layout**:
- Same as Bundle Create, pre-filled
- Can modify both product-level fields AND bundle components

**Key interactions**:
- Same as Bundle Create + same as Product Edit
- Changing bundle components triggers strong confirmation (downstream impact)

---

### Screen 8: Product/Bundle Archive

**Purpose**: Archive a product or bundle so it is no longer active. Not a delete — product remains in system.

**Entry points**: "Archive" button on Product Detail View

**Layout**:
- This is a confirmation dialog/modal, not a full screen
- Dialog content:
  - "Are you sure you want to archive [Product Name]?"
  - Warning: "Archiving this product will mark it as inactive across all connected systems."
  - For bundles: "This bundle contains N component products. The component products will NOT be archived."
  - Confirm / Cancel buttons

**Key interactions**:
- Click "Archive" on detail view → modal appears
- Click "Confirm" → product archived → return to catalog with success toast
- Click "Cancel" → modal closes, no change

**States**:
- Default: Modal open with warning content
- Archiving: Loading spinner on confirm button
- Error: Error message in modal with retry

---

### Screen 9: Brand Management

**Purpose**: View and manage brand information. In MVP, this lives within Registry (may move to Canopy-level configuration later).

**Entry points**: Navigation → Brand Management

**Layout**:
- Brand list (for Admin users with access to multiple brands under an org)
- Brand detail view: name, logo, description, org association
- Edit brand info (Admin only)
- Create new brand (Admin only)

**Key interactions**:
- View brand details
- Edit brand info → confirmation dialog → save
- Create new brand → form → confirmation → created
- All actions permission-gated by role

**States**:
- Default: Brand list or single brand view
- Admin view: Edit/create actions visible
- Viewer/Contributor: Read-only

---

## User Flows

### Flow 1: Browse and View Product
1. User logs into Canopy ecosystem
2. User selects brand context (Brand Switcher)
3. User lands on **Product Catalog View** filtered to that brand
4. User searches or filters for a product
5. User clicks a product row → **Product Detail View**
6. User reviews product information across tabs/sections

### Flow 2: Create a New Product
1. User is on **Product Catalog View**
2. User clicks "Create Product"
3. User fills out **Product Create** form (basic info, identifiers, specs, markets, media)
4. User clicks "Submit"
5. **Confirmation dialog** appears: "This will create a new product in the global registry..."
6. User confirms → product created
7. User redirected to new **Product Detail View** with success toast

### Flow 3: Edit an Existing Product
1. User is on **Product Detail View**
2. User clicks "Edit"
3. **Product Edit** form loads with existing data
4. User modifies fields
5. User clicks "Save Changes"
6. **Confirmation dialog**: "Changes will propagate to connected systems..."
7. User confirms → saved
8. User returns to **Product Detail View** with success toast

### Flow 4: Create a Bundle Product
1. User is on **Product Catalog View**
2. User clicks "Create Bundle"
3. User fills out base product info on **Bundle Create** form
4. User adds component products:
   - Searches for existing product → selects → sets quantity
   - Repeats for all components
5. User clicks "Submit"
6. **Confirmation dialog** → User confirms → bundle created
7. User redirected to bundle **Product Detail View**

### Flow 5: Archive a Product
1. User is on **Product Detail View**
2. User clicks "Archive"
3. **Archive Confirmation Dialog** appears with warning about downstream impact
4. User confirms → product archived
5. User returned to **Product Catalog View** with success toast
6. Product now appears with "Archived" status badge (visible if filtering includes archived)

### Flow 6: Switch Brand Context
1. User clicks brand selector in global nav
2. Dropdown shows available brands
3. User selects different brand
4. All views refresh to show only that brand's data
5. Catalog reloads for new brand context

---

## Data Requirements

### Product (Core Entity)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | auto | Registry-generated unique ID |
| name | string | yes | Product name |
| description | text | no | Product description |
| category | enum | yes | Product category (standardized across markets) |
| type | enum | yes | Product type within category |
| sku | string | no | Brand's internal SKU |
| status | enum | yes | active, archived |
| brand_id | UUID | yes | FK to brand |
| is_bundle | boolean | yes | Distinguishes single vs. bundle products |
| thumbnail_url | string | no | Primary product image |
| created_at | datetime | auto | |
| updated_at | datetime | auto | |

### Product Identifiers

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| retail_id | string | auto | Metrc Retail ID (links to QR/WR code) |
| upc | string | no | Universal Product Code if available |
| compliance_item_ids | array | no | Mapped Metrc Compliance item IDs (can be multiple per facility) |

### Product Specifications

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| ingredients | text | no | Ingredient list |
| allergens | array | no | Allergen flags |
| thc_content | object | no | THC content with unit (mg, %, etc.) |
| cbd_content | object | no | CBD content with unit |
| weight | object | no | Weight with unit |
| dimensions | object | no | Physical dimensions |

### Market-Specific Data

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| market_id | string | yes | State/market identifier |
| compliance_data | object | varies | Market-specific regulatory fields |
| availability_status | enum | yes | Available, pending, restricted |

### Bundle Components

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| bundle_product_id | UUID | yes | FK to the bundle product |
| component_product_id | UUID | yes | FK to the component product |
| quantity | integer | yes | Number of this component in the bundle (≥1) |

### Brand

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | auto | |
| name | string | yes | Brand name |
| description | text | no | |
| logo_url | string | no | |
| organization_id | UUID | yes | FK to parent organization |

### Data Hierarchy
```
Organization
  └── Brand (1:many)
       └── Product (1:many)
            ├── Market-Specific Data (1:many per market)
            ├── Product Specifications (1:1)
            ├── Product Identifiers (1:1)
            └── Bundle Components (1:many, only if is_bundle=true)
                 └── Component Product references
```

> **Note**: Full field definitions, restrictions, and validation rules are maintained in an external spreadsheet (SharePoint). The prototype should support the field structure above but exact validation rules should reference that document.

---

## Business Rules

- **Source of truth**: Changes in Registry propagate to all connected systems. Every create/edit/archive action MUST use a confirmation dialog emphasizing downstream impact.
- **Brand isolation**: Users in Brand X context can ONLY see Brand X products. No cross-brand visibility in MVP.
- **Single brand view**: MVP supports one brand at a time. No multi-brand dashboard.
- **Bundle integrity**: Bundle components must reference existing products in the catalog. Cannot add a non-existent product as a component.
- **Bundle archiving**: Archiving a bundle does NOT archive its component products. Archiving a component product that is part of a bundle should warn the user.
- **Compliance item ID mapping**: A single Registry product can map to multiple Metrc Compliance item IDs (different per facility, even for the same product).
- **Activity logging**: All CRUD actions are logged with: user, timestamp, object, and changes. MVP does not expose this log in the UI (backend only).
- **No notifications in MVP**: No email/push notifications. Future consideration.
- **No webhooks in MVP**: REST APIs only for integrations. Event-based webhooks are a future phase.
- **Permission gating**: UI elements should respect role permissions. Open question: Should restricted actions show as disabled buttons or be hidden entirely?

---

## Acceptance Criteria

- [ ] User can switch between brand contexts and only see that brand's products
- [ ] User can view the full product catalog with search and filter capabilities
- [ ] User can view detailed product information for a single product
- [ ] User can create a new single product with all required fields and confirmation
- [ ] User can edit an existing product with confirmation of downstream impact
- [ ] User can create a bundle product with N component products at configurable quantities
- [ ] User can edit a bundle product's details and component configuration
- [ ] User can archive a product/bundle with confirmation dialog
- [ ] Bundle types are visually distinguishable from single products in the catalog
- [ ] All destructive or impactful actions (create, edit, archive) use confirmation dialogs
- [ ] Forms validate required fields and show inline errors
- [ ] All screens handle loading, empty, and error states
- [ ] Brand management screen allows viewing/editing brand information (Admin role)
- [ ] Navigation between all screens is intuitive and consistent
- [ ] Role-based UI: Viewers see read-only, Contributors can edit/create, Admins get full access

---

## Out of Scope

- User-facing activity log UI (backend logging only in MVP)
- Webhooks / event-based notifications to third-party systems
- Product families / groups / product lines (users can use tags as workaround)
- Manufacturers and source materials catalog
- Multi-brand simultaneous view (one brand at a time in MVP)
- API documentation screens (separate deliverable)
- Data migration tool UI (internal tool, not user-facing)
- Notification system
- Consumer-facing product pages (handled by Retail ID)
- Non-functional limitations related to regulatory compliance
- Label design / printing workflows (stays in Retail ID)

---

## Open Questions

1. **Permission UX pattern**: Should restricted actions appear as disabled buttons or be hidden entirely? The spec calls for "consistent behavior across Metrc" but no decision is documented yet.
2. **Registry vs. Retail ID separation**: Final decision on whether Registry is a standalone app or lives within Retail ID. The comparison table leans toward standalone, but needs cross-functional discussion (Product/UX/Design/Marketing).
3. **Brand management location**: Should brand management live in Registry or at the Canopy ecosystem level? MVP assumes Registry, but this is flagged for future architecture decisions.
4. **Search performance**: What are the engineering constraints on product search? At minimum, search by product name is required — are there other searchable fields?
5. **Full field definitions**: The complete field specifications, restrictions, and validation rules live in an external SharePoint spreadsheet. These need to be referenced for high-fidelity form implementation.
6. **Figma persona details**: There is a Figma board with detailed user personas and workflows that should inform the UX. [Link](https://www.figma.com/board/WZeWERKG7ddeSNGBmlyCE3/Retail-ID---Registry-Users-and-Workflows?node-id=176-1532)
7. **Market-specific compliance fields**: What exactly are the per-market fields? These vary by state and are not fully enumerated in the spec.
8. **Compliance item ID syncing**: How does the mapping between Registry products and multiple Compliance item IDs work in practice? The spec mentions that updates may still happen in other systems during transition.
9. **Integration with Retail ID QR codes**: How does the Registry product link to Retail ID's WR codes and consumer-facing pages? Need clarity on the data flow for the prototype.

---

## Existing Design References

- **Figma User Personas & Workflows**: [Retail ID — Registry Users and Workflows](https://www.figma.com/board/WZeWERKG7ddeSNGBmlyCE3/Retail-ID---Registry-Users-and-Workflows?node-id=176-1532)
- **Field Definitions Spreadsheet**: External SharePoint document (referenced in Confluence but requires separate access)
- **Competitive Reference — LucidGreen/LucidSource**: [lucidgreen.io/brands](https://www.lucidgreen.io/brands)
- **POS Product Reference — Dutchie**: [Dutchie POS catalog docs](https://support.dutchie.com/hc/en-us/articles/12882361852563-Add-products-to-Catalog-in-Dutchie-POS)

---

## Product Roadmap Context

| Phase | Focus |
|-------|-------|
| **Phase 1 (MVP — this prototype)** | Product data storage, migration system, bundled products, user workflows, API integrations |
| **Phase 2** | User-facing activity log, webhooks for product updates |
| **Phase 3** | Product families/groups management |
| **Phase 4** | Advanced analytics, third-party marketplace, manufacturers & source materials catalog |
