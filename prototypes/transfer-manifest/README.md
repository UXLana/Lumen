# Prototype: Transfer Manifest

## Config
- **Theme**: Trace
- **Device**: Desktop (1440px)
- **Fidelity**: High-fi
- **Created**: 2026-03-10
- **Last updated**: 2026-03-10

## Sources
- Verbal description: Transfer manifest detail view — the screen a distributor sees when opening a specific transfer manifest to review contents before sending

## Screens

| Screen | Route | Status | Notes |
|--------|-------|--------|-------|
| Detail View | /prototypes/transfer-manifest/detail-view | Complete | Default, loading, empty, error states |
| Manifest List | /prototypes/transfer-manifest/ | Not Started | P1 — list/search all manifests |

## Components Created
- `DetailField` — Key-value pair display for labels and values, vertical/horizontal layout, mono option for IDs
- `Skeleton` — Loading placeholder with text/rectangular/circular variants and pulse animation
- `EmptyState` — Centered empty state with icon, title, description, and action slot

## Decisions
- 2026-03-10: Used DataTable for package list (sortable columns, badge integration for test status)
- 2026-03-10: Origin/Destination displayed as side-by-side cards with arrow between them
- 2026-03-10: State switcher bar (dev-only) at top with sticky positioning + URL param support (?state=)
- 2026-03-10: Void action uses destructive ConfirmDialog; Send uses success toast notification
- 2026-03-10: Skeleton background uses `colors.border.lowEmphasis.onLight` for contrast against `lightDarker` page bg

## Accessibility
- EmptyState: `role="region"` with `aria-label`, decorative icon `aria-hidden="true"`
- Skeleton: `role="presentation"` + `aria-hidden="true"`, reduced motion support
- DetailField: Semantic label/value structure

## Open Questions
- Should the manifest list view include bulk actions (send multiple, void multiple)?
- What additional fields should appear in the transport details section?
- Should there be a history/audit log tab for manifest state changes?
