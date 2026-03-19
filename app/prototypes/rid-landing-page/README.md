# Prototype: RID Landing Page

## Config
- **Owner**: Lana Holston
- **Status**: draft
- **Theme**: Trace
- **Device**: Mobile (375px)
- **Fidelity**: High-fi
- **Created**: 2026-03-11
- **Last updated**: 2026-03-19

## Sources
- [Confluence: Mobile Landing Page Discussion with Urban + Consultants](https://metrc-tech.atlassian.net/wiki/spaces/RE/pages/751566850/Mobile+Landing+Page+Discussion+with+Urban+Consultants)
- [Confluence: 2026 Roadmap and Approach](https://metrc-tech.atlassian.net/wiki/spaces/RE/pages/759234565/2026+Roadmap+and+Approach)
- [Confluence: State Regulator Management Portal - Concept Doc](https://metrc-tech.atlassian.net/wiki/spaces/RE/pages/764313602/State+Regulator+Management+Portal+-+Concept+Doc)
- [Confluence: Mobile Landing Pages Ideas and Feedback](https://metrc-tech.atlassian.net/wiki/spaces/RE/pages/762904578/Mobile+Landing+Pages+Ideas+and+Feedback)

## Screens

| Screen | Route | Status | Notes |
|--------|-------|--------|-------|
| Product Landing | /prototypes/rid-landing-page/ | Complete | 4 use cases switchable via toolbar |

## Use Cases

| # | Name | GTM Model | Description |
|---|------|-----------|-------------|
| UC1 | Compliance-First | Mandated market | State header, legal indicator, campaign banner, brand suppressed. MA example. |
| UC2 | Compliance + Brand | Mandated (brand allowed) | State seal + brand hero balanced. State can keep brand tab enabled. |
| UC3 | Brand-Forward | Non-mandated market | Brand primary, lightweight compliance. Industry-driven adoption (CA model). |
| UC4 | Brand-Only | Pre-mandate / voluntary | No state compliance features. Pure brand/product transparency. |

## Components Used (from design system)
- `Badge` — category, strain type, test status
- `DetailField` — label/value pairs
- `Divider` — section separators
- `Skeleton` — loading state
- `EmptyState` — not found / error states
- `Button` — actions in empty/error states

## Components Created
- None — all UI needs met by existing design system components + inline sections

## Decisions
- 2026-03-11: 4 use cases map to the real GTM "two flavors" model from the 2026 Roadmap — mandated vs non-mandated, with sub-variants for brand visibility
- 2026-03-11: Massachusetts chosen as mock state — has active public awareness campaign, social equity badges, and is referenced in Confluence feedback
- 2026-03-11: Product is an edible (gummies) to showcase serving size, THC per serving, and servings per package — key consumer info per consultant feedback
- 2026-03-11: Generated SVG product illustration inline rather than using placeholder — shows realistic product packaging
- 2026-03-11: Warning messages sourced from State Regulator Management Portal concept doc
- 2026-03-11: Retailer of sale info included in compliance modes per anti-fraud feedback from Urban consultants
- 2026-03-11: Campaign banner is a featured MA "Know What You're Buying" campaign per consultant feedback about MA public awareness
- 2026-03-11: Consumer glossary link included per consultant recommendation for terminology education
- 2026-03-11: Licensee badges (Social Equity, Locally Grown) controlled by state, not self-claimed per consultant requirement
- 2026-03-17: Replaced StateHeader ("Legal Regulated Product") with unified ComplianceBanner showing CCC logo, Compliance Passed seal, and Metrc Retail ID branding on olive green background — applies to UC1 and UC2
- 2026-03-18: Removed old V1 (Product Only), promoted V2 (Tabbed) to V1. Added new V2 (Accordion) — product sections (Lab Results, Retailer, Package Details, etc.) collapsed into accordions like the About Brand page. V2 defaults to UC2.
- 2026-03-18: Added full-width "View Full COA" high-emphasis button — in V1 it appears inside Lab Results section, in V2 it appears above the accordion
- 2026-03-18: View Full COA button placed outside accordion in V2 for immediate visibility
- 2026-03-19: Moved View Full COA button above DetailFields in Lab Results section (V1) — CTA is now the first action after the header
- 2026-03-19: Added "Read more" / "Read less" toggle to product description — short description shows by default, extended description expands inline
- 2026-03-19: View Full COA button now shows upward caret and triggers a bottom sheet listing multiple COA documents (Full Panel, Potency Retest, Terpene Profile) with lab name, date, and external link per row

## Open Questions
- How does the state seal/logo get uploaded? (State Regulator Management Portal handles this)
- Should the campaign banner be dismissible by the consumer?
- Which warning messages are required by MA regulation vs. configurable by the state?
- Should retailer of sale link to a map/directions for recall return?

## Context
- **Summary**: Explores the consumer-facing mobile landing page for Retail ID across different state adoption models. Based on Urban consultant feedback emphasizing compliance-first positioning, state configurability, and clear separation of regulatory vs. brand content.
- **Documents**: [Confluence: Mobile Landing Page Discussion with Urban + Consultants](https://metrc-tech.atlassian.net/wiki/spaces/RE/pages/751566850), [Confluence: 2026 Roadmap and Approach](https://metrc-tech.atlassian.net/wiki/spaces/RE/pages/759234565), [Confluence: State Regulator Management Portal](https://metrc-tech.atlassian.net/wiki/spaces/RE/pages/764313602)
- **Notes**: The "two flavors" GTM model (mandated vs. non-mandated) from the 2026 Roadmap directly informed the 4 use cases. Non-mandated markets use brand content as the adoption driver; mandated markets unlock full state regulatory features.

## Prompts
1. [2026-03-11] "Create another version of qr-verify prototype taking Urban Consultants Confluence context into consideration. Keep current version, add new version to utility list. Need brand-primary, brand-secondary, no-compliance/brand-only options. Research if some states don't need compliance. Use MA, generate fictitious product image."
   - Links: [Confluence: Mobile Landing Page Discussion with Urban + Consultants](https://metrc-tech.atlassian.net/wiki/spaces/RE/pages/751566850/Mobile+Landing+Page+Discussion+with+Urban+Consultants)
2. [2026-03-17] "Replace the legal banners on top of the page with a CCC + Compliance Passed + Metrc Retail ID branded banner image."
3. [2026-03-18] "Remove V1 and replace with V2. Add new V2 with accordion sections (like About Brand). Start V2 on UC2. Add full-width View Full COA button above the accordion. All Tests Passed badge inline under accordion title."
4. [2026-03-19] "Move the View Full COA button above the datatable; put a read more under product description to show longer text"
5. [2026-03-19] "The View Full COA button should have a caret and trigger a bottom sheet for multiple COAs"
