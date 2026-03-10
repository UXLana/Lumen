# Prototype: QR Product Verify

## Config
- **Theme**: Trace
- **Device**: Mobile (375px)
- **Fidelity**: High-fi
- **Created**: 2026-03-10
- **Last updated**: 2026-03-10

## Sources
- Verbal description: Consumer-facing product/bundle verification page accessed via QR code scan

## Screens

| Screen | Route | Status | Notes |
|--------|-------|--------|-------|
| Landing | /prototypes/qr-verify/ | Complete | Entry point with links to sample product/bundle |
| Product Detail | /prototypes/qr-verify/product | Complete | Full product info with potency, lab results, supply chain |
| Bundle Detail | /prototypes/qr-verify/bundle | Complete | Bundle with expandable product cards |

## Components Used (from design system)
- `Badge` — category (outlined), strain type (outlined), test status (filled)
- `DetailField` — label/value pairs for package info
- `Divider` — section separators
- `Skeleton` — loading state
- `EmptyState` — not found / error states
- `Button` — actions in empty/error states and landing page

## Components Created
- None — all UI needs were met by existing design system components

## Decisions
- 2026-03-10: No app shell — this is a public consumer page, not an admin tool. Minimal header with "Metrc Verified" branding.
- 2026-03-10: Supply chain timeline built inline (not a reusable component) — it's specific to this verification context and may not generalize.
- 2026-03-10: Bundle products are expandable accordion cards, not a DataTable — better for mobile consumers browsing 3-5 items.
- 2026-03-10: Lab results are collapsed by default — most consumers want the pass/fail summary, not 8 individual test rows.

## Open Questions
- Should the CoA link open a real PDF viewer or redirect to the lab's website?
- Should there be a "Report a problem" link for suspected counterfeit products?
- How does the QR URL schema work? (e.g., `verify.metrc.com/p/{packageTag}`)
