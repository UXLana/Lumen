# GCR MSO Homepage Prototype

**Status**: Draft v1
**Fidelity**: High-fidelity
**Route**: `/prototypes/gcr-mso-homepage`
**Last updated**: 2026-02-15

## Screens

| Screen | Status | Notes |
|--------|--------|-------|
| MSO Dashboard Homepage | Draft | All 6 MVP sections implemented |

## Sections Implemented (MVP)

1. **Catalog Overview** — Hero metrics + tabbed breakdown (brand/market/category)
2. **Data Quality & Compliance** — Donut charts, alert cards, brand completeness table
3. **Migration Status** — Progress bars for Compliance + Retail ID, lineage summary
4. **Work Queue** — Urgent tasks with brand/market grouping, quick actions, backlog
5. **Compliance Readiness** — Per-market compliance table with urgent alert banner
6. **Recent Activity** — 7-day summary counts, activity feed, change hotspots

## Design Reference

- Figma: [MSO Registry Browse Products CRUD](https://www.figma.com/design/syC0WMOQL3IYv8g6imQJt6/Metrc-Registry?node-id=203-27879)
- Header pattern: Matches `Nav Header-canopy` component from Figma
- Stat cards: Matches `Stat card` component pattern from Figma
- Design tokens: All colors, typography, spacing from `@/styles/design-tokens`

## Open Questions

See `spec.md` for 10 open questions flagged during compilation.
