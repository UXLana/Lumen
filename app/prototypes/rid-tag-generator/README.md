# Prototype: RID Tag Generator

## Config
- **Owner**: Lana Holston
- **Status**: draft
- **Theme**: RID
- **Device**: desktop (1440px)
- **Fidelity**: high-fi
- **Created**: 2026-03-16
- **Last updated**: 2026-03-17

## Sources
- Meeting transcript: Ryan Andrews, Grant Kemp, Tanika Tompkins, Lana Holston discussing RID tag generation workflow, reel calculations, download vs. print, migrated template banners

## Screens

| Screen | Route | Status | Notes |
|--------|-------|--------|-------|
| Tag Generator v1 (Wizard) | /prototypes/rid-tag-generator/ | Complete | 4-step wizard with stepper |
| Tag Generator v2 (Generate First) | /prototypes/rid-tag-generator/ | Complete | 3-step flow: configure → generate (blocking) → editable print settings |

## Components Created
- None — composed entirely from existing design system components (LinearStepper, Input, Select, Badge, Banner, Button, ProgressBar, EmptyState, Divider, Skeleton)

## Decisions
- 2026-03-16: Changed "print" action to "download" since files are downloaded, not printed (per Lana's meeting discussion)
- 2026-03-16: CSV is always generated, PDF is optional — matches current system behavior (per Ryan Andrews)
- 2026-03-16: Migrated template banner shows "Learn more" link for templates migrated from RID v1 (per Ryan/Grant discussion)
- 2026-03-16: Used LinearStepper (not NonLinear) since the wizard is sequential
- 2026-03-16: Regulator view (UC3) shows a separate order review list instead of the wizard
- 2026-03-17: V2 swaps steps 2↔3 from V1: Tag Configuration → Generate Barcodes → Print Settings
- 2026-03-17: CTA changed from "Save" to "Generate Barcodes"
- 2026-03-17: Steps 1 and 2 disable (locked) after generation; step 3 (Print Settings) stays editable
- 2026-03-17: Full blocking overlay during generation — user cannot interact with the page
- 2026-03-17: UC2 shows detailed phased progress for large batches (~50k barcodes) with per-barcode, per-reel counters and time estimates
- 2026-03-17: Downloads (PDF + DSV) surface in Print Settings step only after barcodes are generated
- 2026-03-17: Generated barcode count shows in disabled step 1 area as "Configuration locked — X barcodes generated"

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
2. [2026-03-17] "Create V2: swap steps 2 and 3. Steps 1+2 disable after generation. CTA is 'Generate Barcodes'. Print-related fields (reels, offset, template) stay editable. Download PDF+DSV appears after generation. New UC2 for large batch (~50k) with detailed phased progress. Full blocking overlay during generation."
