# Prototype: Vault — Business Banking

## Config
- **Owner**: Lana Holston
- **Status**: draft
- **Theme**: Lumen Dark (default) — respects global theme switcher
- **Device**: desktop (1440px, responsive down)
- **Fidelity**: high-fi
- **Created**: 2026-04-05
- **Last updated**: 2026-04-05

## Sources
- Brief: Fintech Prototype Brief — "Vault" (provided in chat)
- Context: second LUMEN stress test after the marketing site, deliberately picked a domain opposite marketing (dense numeric UI, real-time data, trust signals, destructive confirmations, tabular alignment).

## Screens

| Screen | Route | Status | Notes |
|---|---|---|---|
| Dashboard | `/prototypes/vault` | Complete | Balance hero + cashflow Recharts line, pending approvals, recent activity, inflow/outflow sparklines |
| Accounts | `/prototypes/vault/accounts` | Complete | 4 account cards with per-account balance, APY, transfer/statement actions |
| Transactions | `/prototypes/vault/transactions` | Complete | DataTable with 51 rows, search + category/status filters, summary strip |
| Send money | `/prototypes/vault/send` | Complete | 4-step flow (From → Recipient → Amount → Review) + AmountConfirmDialog typed-amount verification + success screen |
| Cards | `/prototypes/vault/cards` | Complete | 6 cards (virtual + physical), gradient card visuals, spend-limit progress, frozen state |
| Team | `/prototypes/vault/team` | Complete | Member table with avatars, role badges, last-active timestamps |

## Components Used
Amount (NEW), Button, Badge, Input, Select, Avatar, DataTable, ProgressBar, Stepper, Icons (IconSearch), plus the prototype-local AmountConfirmDialog, LineChart, and SparkLine.

## Components Created

### Shipped to real design system (`components/`)
- **Amount** — Currency display with variants (credit/debit/pending/muted), sizes, sign modes (auto/always/never/accounting), locale-aware formatting, tabular nums default, auto-generated accessible labels. ⚠️ Needs Design Review before documentation.

### Shipped as tokens (`styles/design-tokens.ts`)
- **`numericStyles.tabular`** / **`numericStyles.lining`** / **`numericStyles.financial`** — Typography utilities for tabular figures. Spread onto any style block. Addresses the "decimals drifting" problem in financial UIs.

### Prototype-local (`app/prototypes/vault/_components/`)
- **AmountConfirmDialog** — High-stakes confirmation with 3 verification modes (type-amount / type-word / checkbox). Full a11y: focus trap, Escape to close, focus lands on input not button, aria-modal. Promotion candidate after second use.
- **LineChart** + **SparkLine** — Thin Recharts wrappers pinned to LUMEN tokens (stroke, fill, tooltip, axes). Theme-aware via design-tokens. Both ship with `aria-label` required.

## Infrastructure Changes
- Added `recharts` to `package.json` dependencies (~30kb tree-shakable)
- Added `numericStyles` export to `styles/design-tokens.ts`
- Added `Amount` to barrel export in `components/index.ts`

## Decisions
- **2026-04-05**: Amount went to the real DS (Option A), AmountConfirmDialog stayed prototype-local (Option B). Rationale: Amount is universally useful and low-risk; AmountConfirmDialog handles money movement and deserves one round of real use before committing to the core API.
- **2026-04-05**: Recharts wrapped in LUMEN-themed `LineChart`/`SparkLine` components rather than imported directly into pages. Rationale: lets us swap Recharts later without touching prototype surfaces; also keeps chart APIs tiny and opinionated.
- **2026-04-05**: Default theme set to `Lumen Dark` via localStorage on first visit. Finance operators live in dark mode and it reinforces "serious, focused" brand. Users can still switch.
- **2026-04-05**: No KYC/onboarding — this is an in-product surface, not a marketing page. Authenticated-state only.
- **2026-04-05**: 51 mock transactions (realistic mix: revenue inflows, SaaS outflows, payroll, wires, tax, legal) to stress-test DataTable density.

## Open Questions
- Should `Amount` ship with a built-in delta/trend prop (like `trend={{ direction: 'up', value: '+12.4%' }}`) or stay pure and let callers compose?
- `AmountConfirmDialog` — promote to real DS after how many prototypes? Suggest: after 2 uses or 1 design review, whichever is sooner.
- Do the chart wrappers deserve a dedicated `@lumen/charts` pack? They're Recharts-dependent which means adding a runtime dep to core. Pack model is cleaner.
- `Stepper` component renders "Step NaN of 4" in its aria-label — probably needs an `activeStep` or `currentStep` prop I'm missing. Worth a pass.

## Context
- **Summary**: Second LUMEN stress test. The first (lumen-marketing) was editorial and generous. This one is the opposite — dense, numeric, trustworthy, with real-time signals and destructive confirmations. If LUMEN flexes from editorial marketing to fintech dashboard on the same component set, the "one system, every product" thesis is proven.
- **Documents**: none
- **Notes**: Vault is deliberately built as an authenticated in-product experience, not a marketing site. The 6 pages cover the core jobs-to-be-done of a finance operator: "where's my money, what happened, who can spend, let me move some, did I already approve that."

## Prompts
1. [2026-04-05] "Build Vault — business banking fintech prototype. Dense + precise + trustworthy. Dashboard / Accounts / Transactions / Send Money (with typed-amount confirm) / Cards / Team. Introduce Amount component, AmountConfirmDialog, and Recharts-based LineChart/SparkLine wrappers. Add tabular-nums utility to design tokens. Lumen Dark default."
