# Prototype: LUMEN Marketing Site

## Config
- **Owner**: Lana Holston
- **Status**: draft
- **Theme**: lumen (default) — live switcher exposes all 8 registered themes (7 featured in the showcase pill: Lumen, Lumen Dark, Fall, Foliage, Spring, Pampas, Rainy Night). Foliage Dark is registered but not shown in the marketing switcher to avoid duplicating the Foliage identity.
- **Device**: desktop (1440px, responsive down to mobile/tablet)
- **Fidelity**: high-fi
- **Created**: 2026-04-05
- **Last updated**: 2026-04-05

## Sources
- Brief: LUMEN Marketing Site — Prototype Brief (provided in chat)
- Context: first general-purpose stress test of LUMEN, pressure-testing the theme architecture in a marketing context

## Screens

| Screen | Route | Status | Notes |
|---|---|---|---|
| Landing | `/prototypes/lumen-marketing` | Complete | Hero + cluster, theme showcase bar, 3 claims, component wall, a11y playground, final CTA |
| Themes | `/prototypes/lumen-marketing/themes` | Complete | Full theme picker card grid + live preview components re-render in active theme |
| Components | `/prototypes/lumen-marketing/components` | Complete | Interactive gallery with search + category filter, 20 component examples |
| Get Started | `/prototypes/lumen-marketing/get-started` | Complete | 3-step quick start with copy-code buttons + resources grid |

## Components Used
Button, Badge, Chip, ChipGroup, Input, Select, Avatar, Switch, Checkbox, Radio, ProgressBar, StatsCard, Banner, Skeleton, Tab, TabBar, Accordion, AccordionItem, Divider, ListItem, Stepper, SegmentedControl, Icons (IconArrowRight, IconCheck, IconCopy, IconSearch).

All components are existing LUMEN components imported from `@/components`. No new components were created for this prototype.

## Components Created
None — the prototype dogfoods the existing design system end-to-end.

## Infrastructure Changes
- `styles/themes/index.ts` — registers all 8 active themes: lumen, lumen-dark, fall, foliage, foliage-dark, spring, pampas, rainy-night
- `styles/themes/theme-provider.tsx` — 8-theme `availableThemes` array plus a two-generation `LEGACY_THEME_NAME_MIGRATIONS` map that auto-migrates any historical `ds-theme` localStorage value (e.g. `Lumen-Dark`, `Fall`, `Claude-Light`, or the short-lived `earth`/`rid`/`university`/`claude-light` names) to the current canonical name
- `scripts/audit-theme-contrast.ts` + `npm run audit:contrast` — WCAG 2.2 AA contrast audit covering 16 token pairs × 8 themes (128 checks). Wired into `prepublishOnly` so any future theme change that regresses contrast blocks the publish pipeline

## Decisions
- **2026-04-05**: Used the global `SwitchableThemeProvider` (via `useThemeSwitcher`) rather than a locally-scoped provider. Rationale: simpler, and when a visitor switches themes on the marketing site it persists to localStorage as a pleasant byproduct.
- **2026-04-05**: Theme switcher shows 7 themes in the pill (brief requirement) even though 8 are registered. `foliage-dark` is still accessible via the broader theme system but isn't marketed on the site (would duplicate the Foliage identity at marketing scale).
- **2026-04-05**: Landing hero uses a 3-card floating cluster instead of a single screenshot. Rationale: "the components themselves are the hero imagery" (from brief).
- **2026-04-05**: Built all components-gallery category filters as custom pill buttons rather than ChipGroup so the selected state reads as a clear filter rather than a selectable tag.
- **2026-04-05**: Theme names were normalized to lowercase-kebab-case matching their filenames. Went through two rename passes: first (mistakenly) renamed seasons-and-subject-names to their product codes (`earth`, `rid`, `university`, `claude-light`), then reverted back to the season/texture names (`fall`, `foliage`, `spring`, `pampas`). Both generations of legacy names are covered by the localStorage migration map.
- **2026-04-05**: Ran a theme-level WCAG 2.2 AA contrast audit across all 8 themes — remediated 53 failures (borders too subtle, status colors too light on warm surfaces, disabled text below 3:1). Final state: 128 pass / 0 fail. Added `npm run audit:contrast` as a reusable CI check.

## Open Questions
- Should the footer GitHub link resolve to a real repo once LUMEN ships publicly?
- Does the Themes page need a "Bring your own theme" CTA (linking to the theme factory)?
- Should we add a changelog page in v2?

## Context
- **Summary**: First general-purpose stress test of LUMEN as a general design system. Built to pressure-test whether LUMEN can flex from admin/enterprise patterns into marketing patterns (big typography, editorial layouts, generous whitespace, hero moments) using only existing components and tokens.
- **Documents**: none
- **Notes**: Success criteria — (1) positioning clear in 30s, (2) theme switcher earns an audible "oh", (3) 100% DS dogfooding with zero hardcoded values, (4) feels like a product not a doc site. The prototype also surfaces gaps for a future `@lumen/agentic` pack but intentionally scopes that as a separate initiative.

## Prompts
1. [2026-04-05] "Build a LUMEN marketing site with Landing, Themes, Components, and Get Started pages. Editorial/bold direction leaning Vercel/Linear/Framer. Live theme switcher across 7 showcase themes. Every pixel must dogfood LUMEN — only existing components and tokens, no one-off marketing CSS." — Showcase now features: Lumen, Lumen Dark, Fall, Foliage, Spring, Pampas, Rainy Night.
2. [2026-04-05] "Run a WCAG 2.2 AA contrast audit across all themes and remediate." — 53 failures found; all 8 themes now pass 16/16 contrast checks. `npm run audit:contrast` available as a reusable CI gate.
3. [2026-04-05] "Remove mention of earth/rid/university/claude from theme names." — Renamed files, exported constants, `.name` fields, marketing showcase labels, Header display map, and extended the legacy localStorage migration to cover both rename generations.
