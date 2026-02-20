# Prototype Spec: Global Registry — MSO Homepage

> Compiled from inline spec on 2026-02-15
> Sources:
> - Homepage Purpose (MSO in Global Registry) — provided directly
> - Related: [Global Product Registry spec](../global-product-registry/spec.md)

---

## Overview

The MSO Homepage is the landing experience for Multi-State Operators in the Global Product Registry. It serves as a command center that answers three questions at a glance:

1. **What's happening across my brands and markets right now?**
2. **Where are there risks or gaps in my catalog?**
3. **What do I need to do next?**

This prototype should demonstrate a data-rich dashboard homepage that gives MSO admins unified visibility across all their brands, markets, and product data — positioning Registry as the single source of truth.

---

## Target Users

### Primary: MSO Admin / Operator
- Manages multiple cannabis brands across multiple state markets
- Needs cross-brand, cross-market visibility into product catalog health
- Cares about compliance readiness, data quality, and migration status
- Makes strategic decisions about catalog expansion and data hygiene
- Has admin-level permissions across their organization's brands

### Secondary: Brand Manager (MSO context)
- Manages a single brand but within an MSO organization
- May land on the MSO homepage and need to drill into their brand's data
- Needs quick navigation to brand-specific views

---

## Screens & Views

### Screen 1: MSO Homepage Dashboard

**Purpose**: Primary landing page for MSO admins — a single-pane-of-glass view across all brands and markets.

**Entry points**: Default landing after login for MSO-level users; accessible via "Home" in global nav.

**Layout**:
The page is organized into a scrollable dashboard with clearly defined sections. Priority order for MVP:

1. **Header bar** — Global nav with brand/org context, user menu
2. **Cross-Market Catalog Overview** (hero section)
3. **Data Quality & Compliance Readiness** (cards/gauges)
4. **Migration Status** (progress section)
5. **Work Queue / Action Items** (task list)
6. **Recent Activity Snapshot** (feed/table)

Post-MVP sections (lower on page or behind tabs):
- Brand & Organization Insights
- Compliance & Risk Signals (detailed)
- Integration Health
- AI Commerce Readiness

---

### Section 1: Cross-Market Catalog Overview

**Purpose**: High-level roll-up so MSOs see the whole business, not just one state.

**Layout**:
- **Hero metrics row**: Large stat cards showing:
  - Total products in catalog
  - Active vs. Archived counts (with visual ratio)
  - Total markets active
  - Total brands managed
- **Breakdown panels** (expandable or tabbed):
  - Products by Brand (bar chart or table)
  - Products by Market/State (bar chart or map visualization)
  - Products by Category (flower, vape, edibles, etc.)
- **Bundle vs. Single breakdown**:
  - Count of single products
  - Count of bundles
  - Visual ratio indicator
- **Market coverage table**:
  - Columns: Market, Product Count, Status
  - Example rows: "CO: 320 products", "CA: 210 products", "MI: 95 products"
  - Highlight: Products that exist in some markets but not others (expansion opportunities)

**Key interactions**:
- Click on a brand name → navigates to brand-specific product list
- Click on a market → filters to that market's products
- Click on a category → filters catalog by category
- Hover on chart elements → tooltip with details

**States**:
- **Default**: Populated with aggregate data across all user's brands/markets
- **Loading**: Skeleton cards with shimmer animation for each metric
- **Empty**: "No products yet — Create your first product or import from migration" with CTA buttons
- **Error**: "Unable to load catalog data. Retry" with retry button

**Data requirements**:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| totalProducts | number | yes | Aggregate across all brands/markets |
| activeProducts | number | yes | |
| archivedProducts | number | yes | |
| productsByBrand | array[{brand, count}] | yes | |
| productsByMarket | array[{market, count}] | yes | State abbreviation + count |
| productsByCategory | array[{category, count}] | no | If categories are modeled |
| singleProducts | number | yes | |
| bundleProducts | number | yes | |
| marketsActive | number | yes | |
| expansionOpportunities | array[{product, presentIn[], missingFrom[]}] | no | Post-MVP |

---

### Section 2: Data Quality & Compliance Readiness

**Purpose**: Give MSOs confidence in their data quality at a glance. Surface completeness scores and risk indicators.

**Layout**:
- **Completeness score gauge** (overall): Large circular/donut chart or progress ring
  - Overall % of products with all required global fields populated
  - Overall % with all market-specific compliance fields populated
- **Per-brand completeness** (horizontal bar chart or table):
  - Brand name | Completeness % | Status indicator (green/yellow/red)
- **Per-market completeness** (horizontal bar chart or table):
  - Market name | Completeness % | Status indicator
- **Missing data indicators** (alert cards):
  - Count: Products missing required global fields
  - Count: Products missing required market fields (warnings, THC/CBD ranges, jurisdiction statements)
  - Count: Products missing images or labels
- **Duplicates & conflicts** (warning cards):
  - Count: Suspected duplicate products (same name/SKU within brand)
  - Count: SKU/identifier conflicts (same ID reused across products)

**Key interactions**:
- Click on a completeness score → drill into list of incomplete products
- Click on missing data count → filtered product list showing those items
- Click on duplicate count → duplicate resolution view
- Click on conflict count → conflict resolution view

**States**:
- **Default**: Gauges and counts populated; color-coded thresholds (green >90%, yellow 70-90%, red <70%)
- **Loading**: Skeleton gauges and placeholder counts
- **All Complete**: Green celebration state — "All products fully complete" with checkmark
- **Error**: "Unable to calculate completeness scores. Retry"

**Data requirements**:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| overallGlobalCompleteness | number (%) | yes | 0-100 |
| overallMarketCompleteness | number (%) | yes | 0-100 |
| brandCompleteness | array[{brand, pct}] | yes | |
| marketCompleteness | array[{market, pct}] | yes | |
| missingGlobalFields | number | yes | Count of products |
| missingMarketFields | number | yes | Count of products |
| missingImages | number | no | Count of products |
| duplicateCount | number | yes | |
| conflictCount | number | yes | |

---

### Section 3: Compliance & Risk Signals

**Purpose**: Connect Registry to compliance risk — show readiness per market and surface time-sensitive issues.

**Layout**:
- **Market compliance table**:
  - Columns: Market | % Products Compliant | At-Risk Count | Status
  - Color-coded status badges per row
- **Upcoming compliance tasks** (alert/banner section):
  - Time-bound warnings: e.g., "15 products in CA need label updates by 03/15"
  - Count of products needing label updates for new regulations
  - Count needing additional market-specific disclosures
- **Compliance risk summary card**:
  - Total at-risk products across all markets
  - Markets with highest risk (sorted)

**Key interactions**:
- Click on a market row → drill into that market's compliance detail
- Click on a time-bound alert → filtered product list for that issue
- Click "View all compliance tasks" → full compliance task list

**States**:
- **Default**: Table and alerts populated
- **Loading**: Skeleton table rows
- **All Compliant**: Green state — "All products meet compliance requirements"
- **Critical alerts**: Red banner at top for time-sensitive issues

**Data requirements**:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| marketCompliance | array[{market, pctCompliant, atRiskCount}] | yes | |
| upcomingTasks | array[{description, market, productCount, dueDate}] | yes | |
| totalAtRiskProducts | number | yes | |

---

### Section 4: Migration & Data Lineage Status

**Purpose**: Surface migration progress prominently since it's the riskiest assumption for MSOs.

**Layout**:
- **Migration progress bars**:
  - % migrated from Metrc Compliance (progress bar + count)
  - % migrated from Retail ID (progress bar + count)
- **Migration quality indicators**:
  - Products successfully migrated with full data
  - Products migrated with warnings/issues
  - Products failed migration
- **Lineage summary**:
  - Products that currently feed Retail ID successfully (count + %)
  - Products that are "Registry-only" — not yet wired to downstream (count + %)

**Key interactions**:
- Click on migration progress → drill into migration detail/issue list
- Click on "Registry-only" count → list of products not yet connected
- Click on migration issues → conflict resolution workflow

**States**:
- **Default**: Progress bars and counts populated
- **Loading**: Skeleton progress bars
- **Migration complete**: Green state — "All products successfully migrated"
- **No migration data**: "No migration in progress" neutral state

**Data requirements**:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| complianceMigrationPct | number (%) | yes | |
| complianceMigrationCount | number | yes | migrated / total |
| retailIdMigrationPct | number (%) | yes | |
| retailIdMigrationCount | number | yes | migrated / total |
| migrationWithIssues | number | no | |
| migrationFailed | number | no | |
| feedingRetailId | number | yes | Products wired to downstream |
| registryOnly | number | yes | Not yet connected |

---

### Section 5: Work Queue & Key Actions

**Purpose**: Turn the homepage into a control center with prioritized to-dos.

**Layout**:
- **Urgent tasks panel** (top priority, card list):
  - Products missing required fields blocking launch
  - Compliance updates due soon
  - Migration conflicts waiting for resolution
  - Each task card shows: product/count, brand, market, severity
  - Grouped by Brand or Market (toggle)
- **Backlog / hygiene work** (secondary, collapsible):
  - Products missing images/marketing descriptions (count)
  - Products never associated with any market (count)
  - Products with no associated labels (count)
- **Quick action buttons** (persistent or floating):
  - "Create new product"
  - "Create new bundle"
  - "Bulk import/update products"
  - "Review migration issues"
  - "Review suspected duplicates"

**Key interactions**:
- Click on a task card → navigates to relevant product or issue
- Click "Group by Brand" / "Group by Market" toggle → re-sorts task list
- Click quick action button → navigates to that workflow
- Click "View all tasks" → full task queue page

**States**:
- **Default**: Tasks populated, sorted by urgency
- **Loading**: Skeleton task cards
- **No tasks**: "You're all caught up!" with illustration and quick action buttons still visible
- **Many tasks**: Truncated list with "View all X tasks" link

**Data requirements**:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| urgentTasks | array[{type, description, productCount, brand, market, severity, dueDate}] | yes | |
| backlogMissingImages | number | no | |
| backlogNoMarket | number | no | |
| backlogNoLabels | number | no | |

---

### Section 6: Recent Activity Snapshot

**Purpose**: Visibility into changes across teams and brands.

**Layout**:
- **Activity summary metrics** (small stat row):
  - Products created (last 7 days)
  - Products updated (last 7 days)
  - Products archived (last 7 days)
- **Recent changes list** (compact table or feed, 5-10 items):
  - Columns: Product Name | Action (created/updated/archived) | Brand | Market | User | Timestamp
  - Filtered to brands/markets the MSO oversees
- **Change hotspots** (small alert or badge):
  - Brands or markets with unusually high change volume

**Key interactions**:
- Click on an activity row → navigate to that product
- Click "View all activity" → full activity log (post-MVP, link placeholder)
- Click on a change hotspot → filtered view of that brand/market's changes

**States**:
- **Default**: Summary counts and recent changes populated
- **Loading**: Skeleton rows
- **No recent activity**: "No changes in the last 7 days" neutral state

**Data requirements**:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| createdCount7d | number | yes | Last 7 days |
| updatedCount7d | number | yes | Last 7 days |
| archivedCount7d | number | yes | Last 7 days |
| recentChanges | array[{productName, action, brand, market, user, timestamp}] | yes | Last 10 items |
| changeHotspots | array[{entity, type, changeCount}] | no | Unusually high volume |

---

### Section 7: Brand & Organization Insights (Post-MVP)

**Purpose**: Let MSO operators compare brands and focus effort.

**Layout**:
- **Brand comparison table**:
  - Columns: Brand | Products | Completeness | At-Risk | Markets Active
  - Sortable columns
- **My brands panel** (for current admin):
  - List of brands they own/manage
  - Per-brand: active products, markets, incomplete/at-risk count

**Key interactions**:
- Click on a brand row → drill into brand detail view
- Sort by any column

---

### Section 8: Integration Health (Post-MVP)

**Purpose**: High-level integration status for MSOs relying on downstream systems.

**Layout**:
- **Retail ID linkage card**:
  - % of products with Retail ID identifiers assigned
  - % with labels successfully exposed to Retail ID
- **API health card** (lightweight):
  - Successful vs. errored API operations in recent period
  - Integrations currently registered (count)

---

### Section 9: AI Commerce Readiness (Post-MVP / Future)

**Purpose**: Tie Registry to AI commerce and cross-market strategy.

**Layout**:
- **Readiness score** per brand or market (simple gauge):
  - Products with rich descriptions (AI-ready fields populated)
  - Products with structured attributes (potency ranges, formats, categories)
- **Market readiness summary**:
  - Markets where catalog has critical mass of well-structured products vs. not

---

## User Flows

### Flow 1: MSO Admin Reviews Homepage
1. Admin logs into Global Registry
2. Lands on MSO Homepage dashboard (Screen 1)
3. Scans hero metrics for catalog overview
4. Notices low completeness score for MI market
5. Clicks MI completeness → drills into incomplete products list
6. Reviews and begins updating products

### Flow 2: MSO Admin Triages Work Queue
1. Admin lands on homepage
2. Scrolls to Work Queue section
3. Sees 5 urgent tasks: 3 compliance updates, 2 migration conflicts
4. Clicks on top compliance task → lands on product edit with missing fields highlighted
5. Fills in required fields, saves
6. Returns to homepage — task count decremented

### Flow 3: MSO Admin Checks Migration Status
1. Admin lands on homepage
2. Scrolls to Migration Status section
3. Sees 82% migrated from Metrc Compliance, 65% from Retail ID
4. Clicks "Review migration issues" → migration conflict resolution view
5. Resolves conflicts, returns to homepage

### Flow 4: MSO Admin Monitors Activity
1. Admin lands on homepage
2. Scrolls to Recent Activity section
3. Notices CA market has unusually high change volume (hotspot badge)
4. Clicks hotspot → sees 45 product updates in CA in last 3 days
5. Reviews changes to ensure quality

### Flow 5: MSO Admin Creates New Product (Quick Action)
1. Admin is on homepage
2. Clicks "Create new product" quick action button
3. Navigates to product creation flow (see Global Product Registry spec)

---

## Business Rules

- MSO homepage only visible to users with MSO-level admin or operator roles
- All data on homepage is filtered to brands/markets the current user has permission to view
- Completeness thresholds: Green (>90%), Yellow (70-90%), Red (<70%)
- "Urgent tasks" are defined as: missing required fields blocking launch, compliance updates within 30 days, unresolved migration conflicts
- Work queue items are sorted by severity (blocking > time-sensitive > hygiene)
- Recent activity shows last 7 days by default
- Change hotspot threshold: >2x the average change volume for that brand/market
- Brand-level data rolls up from all markets where that brand is active
- Market-level data rolls up from all brands active in that market

---

## Acceptance Criteria

- [ ] Homepage displays aggregate catalog metrics across all user's brands and markets
- [ ] Products by brand and products by market breakdowns are visible and interactive
- [ ] Bundle vs. single product counts are displayed
- [ ] Market coverage table shows product count per market
- [ ] Data quality completeness scores (overall, per-brand, per-market) are displayed with color thresholds
- [ ] Missing data indicators show counts for global fields, market fields, and images
- [ ] Duplicate and conflict counts are displayed with drill-down capability
- [ ] Compliance readiness percentage is shown per market
- [ ] Time-bound compliance alerts surface with due dates
- [ ] Migration progress bars show % migrated from Compliance and Retail ID
- [ ] Lineage indicators show products feeding Retail ID vs. Registry-only
- [ ] Work queue displays urgent tasks grouped by brand or market
- [ ] Quick action buttons navigate to: create product, create bundle, bulk import, review migration, review duplicates
- [ ] Recent activity section shows created/updated/archived counts for last 7 days
- [ ] Recent changes list shows last 10 items with product, action, brand, market, user, timestamp
- [ ] All sections have loading, empty, and error states
- [ ] All drill-down links navigate to appropriate filtered views
- [ ] Homepage is responsive (desktop-first, functional at tablet)

---

## MVP Prioritization

The minimum MSO-oriented homepage for MVP includes:

| Priority | Section | Status |
|----------|---------|--------|
| P0 | Cross-Market Catalog Overview | MVP |
| P0 | Data Quality & Compliance Readiness | MVP |
| P0 | Migration Status | MVP |
| P0 | Work Queue & Key Actions | MVP |
| P1 | Recent Activity Snapshot | MVP |
| P2 | Brand & Organization Insights | Post-MVP |
| P2 | Compliance & Risk Signals (detailed) | Post-MVP |
| P3 | Integration Health | Post-MVP |
| P3 | AI Commerce Readiness | Future |

---

## Out of Scope

- Full activity log UI (aggregate numbers and small "recent changes" panel only for MVP)
- Real-time data streaming / live updates (polling or manual refresh is fine)
- Multi-brand simultaneous view (MSO sees aggregates, drills into one brand at a time)
- Custom dashboard layout / widget arrangement
- Export/download of dashboard data
- Notification system / push alerts
- Role-based dashboard variations beyond MSO admin vs. brand manager
- Sales data integration (% of sales SKUs that are bundles vs singles)

---

## Open Questions

- [ ] What visual treatment for market coverage — table, map, or both? (Map would be compelling for MSO but higher effort)
- [ ] How are "expansion opportunities" calculated? Just products present in some markets and absent from others, or is there a more nuanced business rule?
- [ ] What defines a "suspected duplicate"? Same name within brand? Same SKU? Fuzzy matching?
- [ ] Migration quality status was left blank in the source spec — what metrics define migration quality?
- [ ] Should the work queue have a "snooze" or "dismiss" capability for tasks?
- [ ] What is the threshold for "unusually high change volume" in the change hotspots?
- [ ] Are compliance due dates sourced from an external regulatory calendar, or manually entered?
- [ ] How does the homepage adapt for a single-state operator (non-MSO)? Is it the same view with fewer markets, or a different layout?
- [ ] What is the refresh cadence for dashboard data — real-time, every N minutes, on page load only?
- [ ] Is there a Figma design direction for this homepage, or is this a greenfield layout?

---

## Design Direction Notes

This is a **data-dense dashboard** homepage. Key design principles:
- **Scannable**: Hero metrics should be readable in <5 seconds
- **Actionable**: Every data point should link to a drill-down or workflow
- **Hierarchical**: Most important data (catalog overview, quality, migration) at top; secondary sections below fold
- **Consistent with GCR**: Use the same nav, typography, and component patterns as the existing Global Product Registry prototype
- **Color-coded thresholds**: Green/yellow/red for quality scores and compliance status — use design tokens from the MTR design system
