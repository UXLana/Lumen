# UX Brief: Canopy — Unified Ecosystem Platform

> **Generated**: 2026-02-13 (v2 — scope corrected, competitive research added)
> **Completeness**: 42% █████████░░░░░░░░░░░
> **Sources**: 0 Confluence (no access), 0 Jira (no access), 1 Notion page (stub), 3 local prototype files, competitive research
> **Status**: Draft — Discovery phase needed before design

---

## 1. Summary

Canopy is Metrc's unified ecosystem platform for the cannabis industry — analogous to how Atlassian bundles Jira, Confluence, and Bitbucket, or how Shopify unifies storefront, payments, and fulfillment. Canopy bundles Metrc's product suite (**Registry**, **Retail ID**, **Payments**) under a single experience with shared navigation, identity, context, and notifications. Notifications is one feature within this platform, not the project itself. The UX design challenge is defining the platform shell, cross-app navigation model, information architecture, and shared patterns that make multiple products feel like one cohesive ecosystem.

---

## 2. Problem Statement

Cannabis industry operators (cultivators, manufacturers, dispensaries, transporters) currently interact with Metrc's products as **separate, disconnected applications**. Each product has its own UI, navigation, and mental model. There is no shared shell, no cross-product navigation, no unified notification system, and no way to see aggregated status across operations. For multi-state operators (MSOs), this fragmentation multiplies — they must manage each state's compliance separately across disconnected interfaces.

**Evidence**:
- The Canopy Notifications prototype was built specifically to unify alerts across Registry, Retail ID, and Payments — confirming these apps currently have no shared notification model — *[Source: prototypes/canopy-notifications/README.md]*
- The CanopyHome prototype includes an Org/Brand/Market context switcher, suggesting users need to navigate a hierarchy of organizational entities across products — *[Source: CanopyHome.tsx]*
- The Notion UX Brief Intake for "Canopy" is blank — the project vision has not been formally documented in the intake workflow — *[Source: Notion]*
- Metrc already has captive distribution (mandatory in 20+ states), so the UX challenge is not adoption but **expansion** — converting Registry-only users into multi-product Canopy users — *[Source: competitive research]*

---

## 3. User Context

### Personas / Segments

| Persona | Role / Context | Key Needs | Pain Points | Evidence Source |
|---------|---------------|-----------|-------------|----------------|
| Cannabis Operator (Management) | Manages operations across cultivation, manufacturing, distribution, retail across 1+ states | Single view of compliance status, product data, labels, and payments across all Metrc products | [Assumption] Must switch between separate apps; each state is a separate context | Prototype mock data |
| Compliance Manager | Ensures regulatory compliance across markets (CA, NV, CO, MI, OR) | Track deadlines per market; get timely alerts for action-required items; audit readiness | [Assumption] Deadline tracking fragmented; no multi-state compliance dashboard | Prototype mock data, competitive research |
| Brand Manager | Manages product catalog and labeling across markets | Coordinate launches across Registry (product data), Retail ID (labels), Payments (distributor transactions) | [Assumption] No single view of brand status across products | Prototype mock data |
| Small Single-State Licensee | Single dispensary or cultivator in one market | Simple compliance — just Registry, maybe Retail ID | [Assumption] Canopy must not overwhelm users who only need one product | Industry pattern: progressive disclosure |

**[WARNING]** All personas are inferred from prototype mock data and industry knowledge, not from user research. They need validation through interviews.

### User Need Statements

1. **Cannabis Operator** needs **a unified platform to manage all Metrc products from one interface** because **switching between disconnected apps increases compliance risk and wastes time** — *[Assumption]*
2. **Compliance Manager** needs **a multi-state compliance dashboard with deadline tracking across products** because **each state has different regulations, and missing a deadline can result in fines or license suspension** — *[Assumption — inferred from multi-market mock data]*
3. **Brand Manager** needs **cross-product visibility into product, label, and payment status** because **launching a product requires coordination across Registry, Retail ID, and Payments simultaneously** — *[Assumption]*
4. **Small Licensee** needs **a platform that shows only the products relevant to them** because **seeing Payments and Retail ID UI when they only use Registry creates confusion and cognitive load** — *[Assumption — based on progressive disclosure pattern from Atlassian/Shopify]*

### Behavioral Insights

- Users operate within a context hierarchy: **Organization > Brand > Market** — *[Source: CanopyHome.tsx context indicator]*
- The prototype models 4 source apps: Registry, Retail ID, Payments, and Canopy (ecosystem-level) — *[Source: NotificationsCenter.tsx]*
- Cannabis operators are compliance-driven: action-required items never expire, awareness items persist 30-60 days — *[Source: README.md]*
- Multi-state operators (MSOs) are a key growth segment — they manage compliance across many jurisdictions simultaneously — *[Source: competitive research]*

---

## 4. Current State

**What exists today**:
- **Metrc Registry** — the core seed-to-sale tracking system, mandated in 20+ US states — *[Source: competitive research]*
- **Metrc Retail ID** — live in 21 markets, 4,500+ early adopters, 1M+ weekly QR code scans — *[Source: Metrc press release]*
- **Metrc Connect** — next-gen API platform for third-party integrators — *[Source: competitive research]*
- **Payments** — emerging product line within the Canopy umbrella — *[Source: user-provided context]*
- **Canopy Notifications prototype** — high-fidelity React prototype with dropdown, full inbox, and settings views (~2,300 lines). Status: "Draft - Ready for Review" — *[Source: prototypes/canopy-notifications/]*
- **CanopyHome shell prototype** — demo page showing Canopy branding, header, left nav, search, and notification bell — *[Source: CanopyHome.tsx]*
- **Notion intake record** — blank except for project name — *[Source: Notion]*

**Known pain points** (inferred):
- Products currently operate as disconnected UIs with no shared shell, navigation, or identity — *[Assumption]*
- No multi-state compliance dashboard exists — operators manage each state separately — *[Assumption]*
- No formal UX brief or product vision document was found — the prototype was built without a formal brief — *[Source: README.md references "per spec" but no spec was found]*

**Key metrics baseline**:
| Metric | Current Value | Date Measured | Source |
|--------|--------------|---------------|--------|
| Retail ID QR code scans | 1M+ weekly | 2025 | Metrc press release |
| Retail ID markets | 21 | 2025 | Metrc press release |
| Retail ID adopters | 4,500+ | 2025 | Metrc press release |
| Registry states | 20+ | Current | Metrc website |

---

## 5. Business Context

**Business objectives** *(inferred — needs stakeholder validation)*:
- **Platform play**: Evolve Metrc from a single compliance tool into a multi-product ecosystem — *[Source: competitive research + user context]*
- **Cross-sell**: Convert captive Registry users into Retail ID and Payments users through a unified, frictionless experience — *[Source: competitive research]*
- **MSO expansion**: Capture multi-state operators who need cross-jurisdiction compliance management — *[Source: competitive research]*
- **Ecosystem lock-in**: Make Canopy the operating system for cannabis compliance, analogous to Atlassian for software teams — *[Source: user-provided context]*

**Stakeholder priorities**:
| Stakeholder | Priority | Notes |
|-------------|----------|-------|
| Unknown | Unknown | No requestor or decision-maker listed in Notion intake — **needs identification** |

**Competitive landscape**:

| Competitor | Model | Overlap with Canopy | Key UX Pattern |
|------------|-------|-------------------|----------------|
| **Dutchie** | Unified retail stack (POS, ecommerce, payments, compliance) | Closest analog — but operates at retail layer, depends on Metrc for compliance | Single data layer; integrated payments |
| **Flowhub** | Mobile-first POS + compliance (36 states via BioTrack) | Multi-state compliance coverage; mobile-first | Handheld inventory; scanner-first UX |
| **Treez** | Cloud POS + payments + analytics | Multi-location management from single dashboard | MSO dashboard pattern |
| **LeafLink** | B2B wholesale marketplace (30+ markets, $9B+ GMV) | Wholesale/payments layer; acquired banking (Dama Financial) | Marketplace + payments bundle |
| **Simplifya** | Multi-state compliance audits (29 states) | Pure compliance dashboard — risk-based audits, license tracking | Audit checklist UX; multi-state views |
| **Alleaves** (BioTrack + MJ Freeway) | Legacy track-and-trace | Weakened — Akerna sold for $5M; WA ended contract | Declining — market consolidating |

**Strategic insight**: No competitor currently provides a **single pane of glass** for managing compliance, labeling, AND payments across multiple state jurisdictions. This is the gap Canopy is positioned to fill. Metrc's mandatory regulatory position gives it captive distribution that competitors must earn.

---

## 6. Scope & Constraints

### In Scope — Canopy Ecosystem Platform
Canopy is the **full unified platform**, not just notifications. This includes:

- **Platform shell / chrome** — shared header, navigation, context switcher, user menu
- **App switcher** — navigate between Registry, Retail ID, Payments (waffle/grid pattern)
- **Unified identity** — single sign-on across all products, shared account/permissions
- **Cross-app navigation model** — how users move between and within apps
- **Shared notification center** — aggregated alerts from all apps (prototype exists)
- **Global search** — surface results from all apps in one search
- **Context persistence** — Org/Brand/Market context carries across app switches
- **Information architecture** — sitemap and navigation hierarchy for the ecosystem
- **Home / dashboard** — ecosystem-level overview (prototype exists)
- **Progressive disclosure** — users see only apps they are licensed for

### Features Within Canopy (each may need their own brief)
- Notifications (prototype exists — one feature, not the whole platform)
- Compliance dashboard (multi-state view)
- Cross-product workflows (e.g., product launch spanning Registry + Retail ID + Payments)

### Out of Scope
- Individual app redesigns (Registry, Retail ID, Payments internal UX)
- Notification creation/publishing API — *[Source: prototype README]*
- Email/SMS delivery infrastructure — *[Source: prototype README]*
- Third-party app marketplace (future)
- Mobile native app (future — responsive web first)

### Constraints

| Type | Constraint | Impact on Design | Source |
|------|-----------|-----------------|--------|
| Technical | Must integrate with existing Registry, Retail ID, Payments without replacing them | Canopy is an orchestration layer wrapping existing products | [Assumption] |
| Technical | Metrc Connect API is the integration layer for third-party tools | Canopy must work alongside, not conflict with, third-party integrators | Competitive research |
| Brand | Green primary (#16A34A), leaf/tree logo, "Canopy" brand name | Distinct ecosystem brand, separate from individual product brands | CanopyHome.tsx |
| Regulatory | Each state has different compliance rules and retention requirements | Multi-state views must respect per-state regulations | Industry knowledge |
| Accessibility | WCAG AA compliance expected | Prototype already uses ARIA attributes | README.md |
| Design System | MTR design tokens (colors, fonts, spacing, shadows) | All Canopy UI must stay within MTR design system | NotificationsCenter.tsx imports |
| Progressive disclosure | Not all users have all products | UI must gracefully hide/show product sections based on licensing | Atlassian/Shopify pattern |

---

## 7. Success Metrics

| Metric | Type | Target | Baseline | How Measured | When |
|--------|------|--------|----------|-------------|------|
| No metrics defined | — | — | — | — | — |

**[BLOCKER]** No success criteria have been defined. Suggested metrics to consider:

| Suggested Metric | Type | Why It Matters |
|-----------------|------|---------------|
| Cross-product adoption rate | Business | % of Registry users who activate Retail ID or Payments via Canopy |
| Time to complete cross-product workflows | User outcome | Does the unified platform reduce time vs. switching between apps? |
| Compliance deadline miss rate | User outcome | Does the notification system reduce missed deadlines? |
| User satisfaction (SUS/NPS) | User outcome | Is the unified experience perceived as better? |
| App switching frequency | Behavioral | How often do users navigate between products in Canopy? |

---

## 8. Design Direction

### Platform UX Patterns (from competitive analysis)

These patterns are proven across Atlassian, Salesforce, Shopify, and HubSpot — all relevant to Canopy:

| Pattern | Description | Canopy Application |
|---------|------------|-------------------|
| **App Switcher (Waffle/Grid)** | Persistent icon opening a grid of available apps | Navigate between Registry, Retail ID, Payments |
| **Global Shell / Chrome** | Persistent header + optional sidebar stable across apps | Shared Canopy header with branding, user menu, notifications |
| **Unified Notifications** | Single notification center aggregating all apps | Already prototyped — 3-tier model (Action Required, Awareness, System) |
| **Shared Design System** | Component library enforcing visual consistency | MTR Design System serves this role |
| **Cross-App Data Context** | Switching apps preserves data context | Package ID visible in both Registry and Retail ID |
| **Progressive Disclosure** | Users only see apps they are licensed for | Small licensees see only Registry; MSOs see everything |
| **Global Search** | One search bar surfacing results from all apps | Search packages, licensees, labels, transactions |
| **Context Switcher** | Org > Brand > Market hierarchy | Already prototyped in CanopyHome |

### Design Principles (inferred from prototype + industry)
1. **Unified but not monolithic** — Each app retains its identity within the shared shell
2. **Context-aware** — Users always know their Org/Brand/Market context, and it persists across apps
3. **Tiered urgency** — Not all information is equal; action-required items are visually distinct
4. **Progressive disclosure** — Show only what's relevant to the user's licensing and role
5. **Compliance-first** — Regulatory deadlines and action items always surface above awareness info

### Anti-patterns to avoid
- **App confusion** — Users shouldn't be unsure which app they're in (use clear app indicators)
- **Notification overload** — Don't surface low-priority system alerts alongside compliance deadlines
- **One-size-fits-all** — A single-state cultivator and a 10-state MSO need different views
- **Chrome bloat** — The platform shell shouldn't consume more than ~15% of screen real estate

---

## 9. Requirements

### Must Have (P0) — Platform Shell
- [ ] Global navigation shell (header + sidebar/nav) shared across all apps — *[Inferred from ecosystem model]*
- [ ] App switcher to navigate between Registry, Retail ID, Payments — *[Pattern: Atlassian waffle]*
- [ ] Unified user identity / single sign-on across all products — *[Pattern: Atlassian/Salesforce]*
- [ ] Context switcher (Organization > Brand > Market) persisting across apps — *[Source: CanopyHome.tsx]*
- [ ] Unified notification center aggregating alerts from all apps — *[Source: prototype]*
- [ ] 3-tier notification model (Action Required, Awareness, System) — *[Source: prototype]*
- [ ] Progressive disclosure — hide apps the user isn't licensed for — *[Pattern: HubSpot]*

### Should Have (P1) — Cross-App Features
- [ ] Global search surfacing results from all apps — *[Source: CanopyHome.tsx has search bar]*
- [ ] Home/dashboard with ecosystem-level overview — *[Source: CanopyHome.tsx]*
- [ ] Deep links from notifications to source app context — *[Source: prototype]*
- [ ] Notification filtering by app, tier, entity type, read status — *[Source: prototype]*
- [ ] Notification settings per app (delivery method, digest frequency, mute) — *[Source: prototype]*
- [ ] Cross-app data context (e.g., package ID carries from Registry to Retail ID) — *[Pattern: Salesforce]*

### Nice to Have (P2) — Future Enhancements
- [ ] Multi-state compliance dashboard — *[Gap identified in competitive research]*
- [ ] Real-time notifications via WebSocket/polling — *[Source: prototype README]*
- [ ] Mobile responsive / full-screen on mobile — *[Source: prototype README]*
- [ ] Dark mode support — *[Source: prototype README]*
- [ ] Third-party app embedding / marketplace — *[Pattern: Shopify]*

### Non-Functional Requirements
- [ ] WCAG AA accessibility compliance — *[Source: prototype ARIA attributes]*
- [ ] MTR design system token compliance — *[Source: prototype imports]*
- [ ] Performance: shell chrome loads in <500ms; app switching feels instant — *[Industry expectation]*

---

## 10. Open Questions

> Resolve these before finalizing design direction.

| # | Question | Who Answers | Suggested Method | Priority |
|---|----------|-------------|-----------------|----------|
| 1 | What is the full Canopy product vision and roadmap? Which apps ship first? | Product Lead | Vision workshop | **Critical** |
| 2 | Who are the actual target users? Validate personas with real user data | Product + UX Research | 5-8 user interviews + analytics | **Critical** |
| 3 | What are the top pain points with the current disconnected product experience? | UX Research | User interviews, support ticket analysis | **Critical** |
| 4 | What are the success metrics for the platform launch? | Product Lead | KPI definition workshop | **High** |
| 5 | How will apps be embedded in the Canopy shell? iframe? micro-frontends? shared React shell? | Engineering | Architecture review | **High** |
| 6 | What is the licensing model — do users get all apps or individual products? | Product/Business | Business model review | **High** |
| 7 | Are there state-specific requirements for data display, notification retention, or compliance UI? | Compliance/Legal | Regulatory review | **High** |
| 8 | What is the migration path? Do users gradually move to Canopy or is it a hard switch? | Product + Engineering | Migration planning | **Medium** |
| 9 | How does Canopy relate to Metrc Connect (the API platform)? Does Canopy consume Connect APIs? | Engineering | Architecture review | **Medium** |
| 10 | Who is the requestor, decision-maker, and executive sponsor? | Leadership | Organizational alignment | **High** |
| 11 | Has a unified platform been attempted before at Metrc? What was the outcome? | Product Lead | Historical review | **Medium** |
| 12 | What is the competitive response strategy? How does Canopy differentiate from Dutchie's unified stack? | Product/Strategy | Competitive positioning workshop | **Medium** |

---

## 11. Gap Analysis

### Completeness Score

```
Overall: 42% █████████░░░░░░░░░░░

Problem Clarity     [12/20] ████████████░░░░░░░░ Moderate — clear framing but still assumption-based
User Context        [ 8/20] ████████░░░░░░░░░░░░ Weak — personas are assumptions, no research
Success Metrics     [ 0/15] ░░░░░░░░░░░░░░░░░░░░ Missing — no metrics defined at all
Scope & Constraints [11/15] ██████████████░░░░░░ Good — scope now clear, constraints documented
Background          [10/15] █████████████░░░░░░░ Moderate — competitive research added, but no internal analytics
Next Steps          [ 5/15] ██████░░░░░░░░░░░░░░ Weak — phases outlined but no timeline or owners confirmed
```

**Score improved from 34% to 42%** with scope clarification and competitive research. Major remaining gaps are user research and success metrics.

### Missing Inputs

| # | What's Missing | Why It Matters | Impact on Score |
|---|---------------|----------------|-----------------|
| 1 | **User research** (interviews, surveys, analytics) | All personas and needs are assumptions — high risk of solving wrong problems | +10-12 points |
| 2 | **Success metrics and KPIs** | Cannot evaluate design success without measurable criteria | +8-12 points |
| 3 | **Product vision document / roadmap** | Need to know which apps ship first, phasing, migration strategy | +3-5 points |
| 4 | **Stakeholder map** (requestor, decision-maker, sponsor) | No one listed — risk of misaligned expectations | +2-3 points |
| 5 | **Confluence specs and requirements** | No access (403) — may contain existing specs | Unknown |
| 6 | **Jira tickets** (epics, bugs, feature requests) | No access — missing operational context | Unknown |
| 7 | **Internal analytics** (current product usage data) | No baseline for cross-product usage patterns | +3-5 points |
| 8 | **Technical architecture** (how apps will be embedded in Canopy shell) | Affects whether design is constrained to iframe boundaries or full integration | +2-3 points |

### Anti-Pattern Warnings

**[BLOCKER]** Metric-Free Brief
No success criteria defined. Add at least 1 primary user-outcome metric and 1 business metric. See suggested metrics in Section 7.

**[BLOCKER]** Assumption Brief
100% of user context is inferred, not researched. Validate with at least 5 user interviews before committing design resources to the platform shell.

**[WARNING]** Orphan Brief
The Notion UX Brief Intake for Canopy is blank. Fill it out to connect this brief to the organizational intake workflow.

**[WARNING]** Missing Technical Architecture
How apps embed in the Canopy shell (iframe, micro-frontend, shared React) fundamentally constrains the UX. Cross-app context persistence, shared state, and navigation behavior all depend on this decision.

**[INFO]** Blocked External Sources
Confluence (403 Forbidden) and Jira (no BROWSE_PROJECTS permission) could not be accessed. Resolve API permissions to check for existing specs and tickets.

---

## 12. Recommended Next Steps

### Phase 1: Discovery & Alignment *(before any design work — 2-3 weeks)*
- [ ] **Document product vision & roadmap** — *Product Lead* — Output: Canopy vision doc with phasing (which apps, what order)
- [ ] **Fill out the Notion UX Brief Intake** — *Product Lead* — Output: completed intake form
- [ ] **Identify stakeholders & decision-maker** — *Product Lead* — Output: RACI chart
- [ ] **Conduct 5-8 user interviews** with cannabis operators across user types — *UX Researcher* — Output: validated personas, pain points, user need statements
- [ ] **Define success metrics** — *Product + UX* — Output: KPI document with targets and baselines
- [ ] **Resolve Confluence/Jira API access** — *Admin* — Output: data access for automated brief updates
- [ ] **Technical architecture decision** — *Engineering* — Output: how apps embed in Canopy shell

### Phase 2: Research Synthesis & Design Strategy *(1-2 weeks)*
- [ ] **Competitive UX audit** — *UX Designer* — Output: annotated screenshots of Atlassian, Dutchie, Shopify patterns
- [ ] **Information architecture** — *UX Designer* — Output: sitemap and navigation model for Canopy ecosystem
- [ ] **Platform shell wireframes** — *UX Designer* — Output: header, app switcher, context switcher, nav model
- [ ] **Re-run `/ux-brief-generator`** with research inputs — *UX Lead* — Target: >70% completeness

### Phase 3: Design & Validate *(2-4 weeks)*
- [ ] **High-fidelity prototype** of platform shell with app switching — *UX Designer* — Output: interactive prototype
- [ ] **Integrate existing Notifications prototype** into the platform shell — *UX Designer*
- [ ] **Usability test** with 5 users matching validated personas — *UX Researcher* — Output: test report
- [ ] **Design system audit** — run `/design-accessibility` on platform components — *UX Lead*

### Decision Gates
| Gate | Decision Needed | Who Decides | Depends On |
|------|----------------|-------------|-----------|
| 1 | App embedding architecture (iframe vs. micro-frontend vs. shared shell) | Engineering Lead + UX Lead | Phase 1 tech review |
| 2 | Platform shell design direction approval | Decision-maker (TBD) | Phase 2 wireframes |
| 3 | Go/no-go for high-fidelity build | UX Lead + Product | Phase 2 IA + research |
| 4 | Design readiness for development | Decision-maker (TBD) | Phase 3 usability results |

---

## 13. Sources & References

| # | Source | Type | Link | Last Updated |
|---|--------|------|------|-------------|
| 1 | Canopy (UX Brief Intake) | Notion | [Link](https://www.notion.so/2e157fbfbd0d804da955c0457ce90458) | 2026-01-07 |
| 2 | Metrc UX Brief Intake DB | Notion | [Link](https://www.notion.so/44b042b28ad64945a2534922dde10824) | 2026-01-07 |
| 3 | Canopy Notifications README | Local | `prototypes/canopy-notifications/README.md` | Current |
| 4 | NotificationsCenter.tsx | Local | `prototypes/canopy-notifications/screens/NotificationsCenter.tsx` | Current |
| 5 | CanopyHome.tsx | Local | `prototypes/canopy-notifications/screens/CanopyHome.tsx` | Current |
| 6 | Metrc official site | Web | metrc.com | Current |
| 7 | Metrc Retail ID press release | Web | metrc.com/news/ | 2025 |
| 8 | Atlassian navigation refresh | Web | atlassian.com/blog/design/ | 2025 |
| 9 | Shopify app design guidelines | Web | shopify.dev/docs/apps/design | Current |
| 10 | Confluence | **Blocked** | 403 Forbidden | — |
| 11 | Jira | **Blocked** | No BROWSE_PROJECTS permission | — |

---

*Generated by `/ux-brief-generator` v2 — Re-run with user research data, product vision doc, and Confluence/Jira access to push completeness from 42% to 70%+.*
