# Prototype: RID Tag Generator

## Config
- **Owner**: Lana Holston
- **Status**: draft
- **Theme**: RID
- **Device**: desktop (1440px)
- **Fidelity**: high-fi
- **Created**: 2026-03-16
- **Last updated**: 2026-03-16

## Sources
- Meeting transcript: Ryan Andrews, Grant Kemp, Tanika Tompkins, Lana Holston discussing RID tag generation workflow, reel calculations, download vs. print, migrated template banners

## Screens

| Screen | Route | Status | Notes |
|--------|-------|--------|-------|
| Tag Generator Wizard | /prototypes/rid-tag-generator/ | Complete | 4-step wizard with stepper |

## Components Created
- None — composed entirely from existing design system components (LinearStepper, Input, Select, Badge, Banner, Button, ProgressBar, EmptyState, Divider, Skeleton)

## Decisions
- 2026-03-16: Changed "print" action to "download" since files are downloaded, not printed (per Lana's meeting discussion)
- 2026-03-16: CSV is always generated, PDF is optional — matches current system behavior (per Ryan Andrews)
- 2026-03-16: Migrated template banner shows "Learn more" link for templates migrated from RID v1 (per Ryan/Grant discussion)
- 2026-03-16: Used LinearStepper (not NonLinear) since the wizard is sequential
- 2026-03-16: Regulator view (UC3) shows a separate order review list instead of the wizard

## Open Questions
- Should the "Learn more" link on migrated templates go to a Pendo guide or a Confluence doc?
- Can the migrated template banner be removed after a couple months? (Ryan suggested yes)
- What are the maximum tags per reel? Is there a system limit?
- Should regulators have an "approve all" batch action?
- How long does QR code generation actually take? (affects progress bar UX)

## Context
- **Summary**: Guided step-by-step wizard for operators to select a tag template, configure quantities and reels, generate QR codes with unique identifiers, and download CSV/PDF files. Regulators get a separate review view.
- **Documents**: None linked yet
- **Notes**: Ryan Andrews excited about guided step-by-step approach. Grant Kemp noted "Learn more" link on migrated templates should go to correct environment (Pendo vs. UAT). Plan to eventually remove the migrated template banner.

## Prompts
1. [2026-03-16] "Build a RID tag generation wizard — step-by-step flow where operators configure a template, enter quantities, calculate reels, generate QR codes, and download CSV/PDF. Based on meeting transcript with Ryan Andrews, Grant Kemp, and Tanika Tompkins."
