# Lana's Claude Skills Inventory

> **Last Updated:** January 26, 2026  
> **Total Skills:** 22 (11 User Skills + 5 Example Skills + 6 Public Skills)

---

## Table of Contents

1. [User Skills](#user-skills) — Custom skills for design and workflow
2. [Example Skills](#example-skills) — General-purpose creative skills
3. [Public Skills](#public-skills) — Document and file manipulation
4. [Skill Relationships & Dependencies](#skill-relationships--dependencies)

---

## User Skills

These are custom skills tailored for design leadership, Metrc workflows, and design system development.

### 1. design-accessibility

**Purpose:** Audit and remediate accessibility issues in React design system components against WCAG 2.2 AA and Section 508 standards.

**Commands:**
| Command | Mode | Description |
|---------|------|-------------|
| `/design-accessibility [target]` | Standard | WCAG 2.2 AA audit with code fixes |
| `/design-accessibility [target] --compliance` | Compliance | Adds Section 508 + regulatory form/data-entry checks |
| `/design-accessibility --report` | Report | Generates formal compliance documentation |

**Targets:** Single components, all components, tokens only, full system audit, or specific file paths.

**Audit Categories:**
- Color & Contrast (4.5:1 text, 3:1 UI components)
- Typography & Readability (16px base, 1.5 line height)
- Keyboard Navigation (focus visible, tab order, escape closes)
- ARIA & Semantic HTML (roles, labels, state communication)
- Forms & Data Entry (critical for compliance software)
- Timing & Motion (prefers-reduced-motion, no flashing)
- Cognitive Accessibility (WCAG 2.2 additions)

**Output:** Structured issue reports with severity levels, WCAG criteria references, code fixes, and testing checklists.

**Invokes:** Reads from `references/` files for audit criteria.

---

### 2. design-brief-generator

**Purpose:** Generate structured design briefs and PRDs for UX projects at Metrc using guided discovery or synthesis of async inputs.

**Modes:**
- **Guided Discovery:** Interactive Q&A walkthrough
- **Synthesis Mode:** Process existing inputs (form responses, Slack threads, meeting notes)

**Question Set Coverage:**
- Project Basics (name, trigger)
- Problem Statement (5 Ws → user need statement)
- Users & Tasks (primary users, goals, pain points)
- Business Value (goals, why now, impact)
- Stakeholders & Ownership
- Hypotheses & Assumptions (Lean UX format)
- Scope (must-haves, nice-to-haves, out of scope)
- Constraints (compliance, states, tech, platform, timeline)
- Risks & Dependencies
- Success Metrics

**Output:** PRD optimized for vibe-coding with explicit gap identification using `[TBD]` placeholders.

**Invokes:** Uses `references/prd-template.md` for output structure.

---

### 3. frontend-design

**Purpose:** Create distinctive, production-grade frontend interfaces that avoid generic AI aesthetics.

**Design Thinking Process:**
1. Understand purpose and audience
2. Choose bold aesthetic direction (brutalist, maximalist, retro-futuristic, etc.)
3. Identify differentiation — what makes it unforgettable

**Guidelines:**
- **Typography:** Distinctive, characterful fonts (avoid Inter, Roboto, Arial)
- **Color & Theme:** Dominant colors with sharp accents, CSS variables
- **Motion:** High-impact moments, scroll-triggering, hover states
- **Spatial Composition:** Asymmetry, overlap, diagonal flow, grid-breaking
- **Backgrounds:** Gradient meshes, noise textures, geometric patterns

**Anti-Patterns to Avoid:** Purple gradients on white, predictable layouts, cookie-cutter design.

**Output:** Working HTML/CSS/JS, React, or Vue code with exceptional visual polish.

---

### 4. notion-meeting-intelligence

**Purpose:** Prepare comprehensive meeting materials by gathering Notion context, enriching with Claude research, and creating both internal pre-reads and external agendas.

**Workflow:**
1. Gather Notion context (`Notion:notion-search`)
2. Fetch details (`Notion:notion-fetch`)
3. Enrich with Claude research (industry insights, best practices)
4. Create internal pre-read (`Notion:notion-create-pages`)
5. Create external agenda (`Notion:notion-create-pages`)
6. Link resources and documents

**Document Types:**
- **Internal Pre-Read:** Comprehensive background for team only
- **External Agenda:** Clean, professional, focused for all participants

**Agenda Types:** Decision Meeting, Status Update, Customer/External, Brainstorming

**Invokes:** Notion MCP tools extensively; uses `reference/template-selection-guide.md`.

---

### 5. notion-research-documentation

**Purpose:** Search across Notion workspace, synthesize findings from multiple pages, and create comprehensive research documentation.

**Workflow:**
1. Search for relevant content (`Notion:notion-search`)
2. Fetch page content (`Notion:notion-fetch`)
3. Synthesize findings (themes, patterns, gaps)
4. Create structured documentation (`Notion:notion-create-pages`)

**Output Formats:**
- Research Summary
- Comprehensive Report
- Quick Brief

**Invokes:** Notion MCP tools; references format selection guides.

---

### 6. notion-knowledge-capture

**Purpose:** Transform conversations and discussions into structured Notion documentation with proper organization and linking.

**Workflow:**
1. Extract content from conversation context
2. Structure into appropriate format
3. Determine destination (`Notion:notion-search`)
4. Create page (`Notion:notion-create-pages`)
5. Make discoverable (link from hub pages, add to databases)

**Content Types:**
- Concept/Definition
- How-to Guide
- Decision Record
- FAQ Entry
- Meeting Summary
- Learning/Post-mortem
- Reference Documentation

**Invokes:** Notion MCP tools; `Notion:notion-update-page` for linking.

---

### 7. notion-spec-to-implementation

**Purpose:** Transform specifications into actionable Notion implementation plans with task tracking.

**Workflow:**
1. Find spec (`Notion:notion-search`)
2. Fetch spec (`Notion:notion-fetch`)
3. Extract requirements
4. Create implementation plan (`Notion:notion-create-pages`)
5. Find task database (`Notion:notion-search`)
6. Create tasks (`Notion:notion-create-pages`)
7. Track progress (`Notion:notion-update-page`)

**Breakdown Patterns:**
- By Component (database, API, frontend, testing)
- By Feature Slice (vertical slices)
- By Priority (P0/P1/P2)

**Invokes:** Notion MCP tools extensively; uses implementation plan templates.

---

### 8. brand-tokens-translator

**Purpose:** Analyze brand guidelines (PDF or text) and translate into foundational design tokens for Figma Variables and code.

**Core Principles:**
- Atomic + Composite architecture (primitives hold raw values, composites alias primitives)
- Token-only output (no components)
- Brand-agnostic naming
- Explicit gaps flagged as `❓ Needs design decision`

**Token Categories:**
1. Color (primitives + semantic composites with states)
2. Typography (font family, weight, size, line-height)
3. Spacing (component scale 4px, pattern scale 8px)
4. Radius
5. Elevation (shadows)
6. Opacity
7. Z-Index
8. Motion (duration, easing)
9. Icon (size, stroke)
10. Focus (ring width, offset, color)

**State Tokens:** default, hover, active, focus, focus-visible, disabled, selected, error, loading, readonly, visited

**Output:** Structured markdown with `{token.reference}` aliasing syntax for Figma Variables and CSS custom properties.

**Invokes:** Uses `references/output-template.md`, `references/color-architecture.md`, `references/typography-architecture.md`.

---

### 9. design-lead-thought-partner

**Purpose:** Daily thought partner for Design Leads working in high-stakes, regulated environments like Metrc.

**Decision-Making Frameworks:**
- **Cynefin Framework:** Complexity assessment (Clear/Complicated/Complex/Chaotic)
- **OODA Loop:** Rapid assessment (Observe → Orient → Decide → Act)
- **IDEO Human-Centered Design:** Understand → Explore → Materialize
- **Multi-Criteria Decision Matrix:** Weighted tradeoff analysis
- **RICE Framework:** Feature prioritization (Reach × Impact × Confidence / Effort)
- **Nielsen Norman Group Principles:** Design tradeoffs
- **MoSCoW Method:** Prioritization (Must/Should/Could/Won't)
- **RAPID Framework:** Stakeholder alignment (Recommend/Agree/Perform/Input/Decide)

**Metrc Context Awareness:**
- Multi-jurisdictional compliance
- Regulatory stakeholders (state agencies)
- High reliability needs
- RFID infrastructure
- Dual user base (government + cannabis businesses)

**Invokes:** References `references/frameworks-deep-dive.md`, `references/metrc-decision-patterns.md`.

---

### 10. design-system-librarian

**Purpose:** Analyze Figma components and produce token-compliant React component specifications.

**Accepted Inputs:**
- Screenshots (estimated values)
- Descriptions (conceptual)
- **Figma code exports** (precise — most valuable)
- Combined inputs (best results)

**Core Principles:**
- Token-only values (no raw hex, px, rem)
- Explicit gaps flagged as `❗ Token gap`
- No invented tokens

**Output Template Sections:**
1. Component Name + Hierarchy (atomic breakdown)
2. Variants & States (variant model, state matrix)
3. Token Mapping (color, spacing, typography, radius/shadow/motion)
4. Accessibility (contrast, focus states, keyboard/ARIA)
5. Proposed React API (TypeScript interface)
6. Anti-patterns to Remove

**Invokes:** Reads `references/tokens.md` for validation; `references/figma-code-parsing.md` for extraction patterns.

---

### 11. *(Mentioned in Memory)* design-system-builder

**Purpose:** Add components/foundations to MTR Design System.

**Orchestrates:**
- icon-generator
- component-generator
- frontend-design

---

## Example Skills

General-purpose creative and productivity skills available for use.

### 12. doc-coauthoring

**Purpose:** Guide users through structured collaborative document creation.

**Three Stages:**
1. **Context Gathering:** Dump all relevant context, clarifying questions
2. **Refinement & Structure:** Section-by-section brainstorming, curation, drafting, iteration
3. **Reader Testing:** Test with fresh Claude instance to catch blind spots

**Workflow per Section:**
1. Clarifying questions (5-10)
2. Brainstorm options (5-20)
3. Curation (keep/remove/combine)
4. Gap check
5. Drafting
6. Iterative refinement

**Output:** High-quality documentation that works for readers (PRDs, design docs, specs, RFCs).

**Invokes:** Uses `create_file` for artifacts, `str_replace` for edits.

---

### 13. web-artifacts-builder

**Purpose:** Create elaborate, multi-component HTML artifacts using React, Tailwind CSS, and shadcn/ui.

**Stack:** React 18 + TypeScript + Vite + Parcel + Tailwind CSS + shadcn/ui

**Workflow:**
1. Initialize project (`scripts/init-artifact.sh <project-name>`)
2. Develop artifact (edit generated code)
3. Bundle to single HTML (`scripts/bundle-artifact.sh`)
4. Display artifact to user

**Features:**
- 40+ shadcn/ui components pre-installed
- All Radix UI dependencies included
- Path aliases configured

**Invokes:** Uses bundled scripts for initialization and bundling.

---

### 14. skill-creator

**Purpose:** Guide for creating effective Claude skills.

**Skill Anatomy:**
```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/     (executable code)
    ├── references/  (documentation)
    └── assets/      (templates, icons, fonts)
```

**Creation Workflow:**
1. Understand skill with concrete examples
2. Plan reusable contents
3. Initialize skill (`scripts/init_skill.py`)
4. Edit SKILL.md and resources
5. Package skill (`scripts/package_skill.py`)
6. Iterate based on testing

**Invokes:** Uses `scripts/init_skill.py`, `scripts/package_skill.py`; references `references/workflows.md`, `references/output-patterns.md`.

---

### 15. theme-factory

**Purpose:** Style artifacts with pre-set or custom themes.

**Available Themes (10):**
1. Ocean Depths — Professional maritime
2. Sunset Boulevard — Warm sunset colors
3. Forest Canopy — Natural earth tones
4. Modern Minimalist — Clean grayscale
5. Golden Hour — Rich autumnal palette
6. Arctic Frost — Cool winter theme
7. Desert Rose — Soft dusty tones
8. Tech Innovation — Bold tech aesthetic
9. Botanical Garden — Fresh garden colors
10. Midnight Galaxy — Dramatic cosmic tones

**Workflow:**
1. Show `theme-showcase.pdf` to user
2. Ask for theme choice
3. Read theme file from `themes/` directory
4. Apply colors and fonts to artifact

**Invokes:** Reads theme files from `themes/` directory.

---

### 16. internal-comms

**Purpose:** Write internal communications using company-preferred formats.

**Supported Types:**
- 3P Updates (Progress/Plans/Problems)
- Company newsletters
- FAQ responses
- Status reports
- Leadership updates
- Project updates
- Incident reports

**Workflow:**
1. Identify communication type
2. Load appropriate guideline file from `examples/`
3. Follow specific formatting and tone instructions

**Invokes:** Reads `examples/3p-updates.md`, `examples/company-newsletter.md`, `examples/faq-answers.md`, `examples/general-comms.md`.

---

### 17. canvas-design

**Purpose:** Create beautiful visual art in .png and .pdf using design philosophy.

**Two-Step Process:**
1. **Design Philosophy Creation:** Create a visual philosophy/aesthetic movement (4-6 paragraphs)
2. **Canvas Creation:** Express the philosophy visually with expert craftsmanship

**Philosophy Elements:**
- Name the movement (1-2 words)
- Articulate through space/form, color/material, scale/rhythm, composition/balance

**Canvas Principles:**
- Museum/magazine quality
- Repeating patterns, perfect shapes
- Sparse, clinical typography
- Limited cohesive color palette
- Expert-level craftsmanship appearance

**Output:** .md file (philosophy) + .pdf or .png file (visual art)

**Invokes:** Uses fonts from `./canvas-fonts` directory.

---

## Public Skills

Core document and file manipulation skills available to all users.

### 18. docx

**Purpose:** Comprehensive Word document creation, editing, and analysis.

**Capabilities:**
| Task | Approach |
|------|----------|
| Read/analyze | `pandoc` or unpack for raw XML |
| Create new | Use `docx-js` library |
| Edit existing | Unpack → edit XML → repack |

**Creating New Documents:**
- Uses JavaScript `docx` package
- Supports styles, lists, tables, images, page breaks, TOC, headers/footers
- Critical: Always set page size explicitly (US Letter: 12240 x 15840 DXA)

**Editing Existing Documents:**
1. `python scripts/unpack.py document.docx unpacked/`
2. Edit XML files (tracked changes, comments)
3. `python scripts/pack.py unpacked/ output.docx`

**Invokes:** Uses bundled Python scripts (`unpack.py`, `pack.py`, `accept_changes.py`, `comment.py`).

---

### 19. pdf

**Purpose:** Comprehensive PDF manipulation toolkit.

**Capabilities:**
- Extract text and tables (pdfplumber)
- Create new PDFs
- Merge/split documents (pypdf)
- Handle forms (see FORMS.md)
- Rotate pages
- Extract metadata

**Key Libraries:**
- `pypdf` — Basic operations
- `pdfplumber` — Text and table extraction

**Invokes:** References `REFERENCE.md` for advanced features, `FORMS.md` for form filling.

---

### 20. pptx

**Purpose:** PowerPoint presentation creation, editing, and analysis.

**Capabilities:**
| Task | Guide |
|------|-------|
| Read/analyze | `python -m markitdown presentation.pptx` |
| Edit from template | Read `editing.md` |
| Create from scratch | Read `pptxgenjs.md` |

**Design Guidelines:**
- Pick bold, content-informed color palette
- Dominance over equality (60-70% primary color)
- Dark/light contrast ("sandwich" structure)
- Commit to a visual motif

**Invokes:** Uses `scripts/thumbnail.py`, `scripts/unpack.py`; references `editing.md`, `pptxgenjs.md`.

---

### 21. xlsx

**Purpose:** Comprehensive spreadsheet creation, editing, and analysis.

**Requirements:**
- Professional font (Arial, Times New Roman)
- Zero formula errors
- Preserve existing templates

**Financial Model Standards:**
- **Color coding:** Blue (inputs), Black (formulas), Green (worksheet links), Red (external links), Yellow bg (attention)
- **Number formatting:** Years as text, currency with units, zeros as "-", percentages with one decimal
- **Formula rules:** Assumptions in separate cells, cell references over hardcodes

**Invokes:** Various Python and JavaScript libraries for spreadsheet manipulation.

---

### 22. product-self-knowledge

**Purpose:** Authoritative reference for Anthropic products to prevent hallucinations.

**Question Routing:**
- **Claude API/Code:** Check docs maps first → https://docs.claude.com/en/docs_site_map.md
- **Claude Code:** https://docs.anthropic.com/en/docs/claude-code/claude_code_docs_map.md
- **Claude.ai:** Browse support page → https://support.claude.com

**Response Workflow:**
1. Identify the product
2. Use the right resource
3. Verify details
4. Provide answer with source link

---

## Skill Relationships & Dependencies

### Skills That Call Other Skills

| Parent Skill | Calls/Invokes |
|--------------|---------------|
| **design-system-builder** | icon-generator, component-generator, **frontend-design** |
| **design-system-ui** | **frontend-design** |
| **notion-meeting-intelligence** | Notion MCP tools (search, fetch, create-pages) |
| **notion-research-documentation** | Notion MCP tools (search, fetch, create-pages) |
| **notion-knowledge-capture** | Notion MCP tools (search, fetch, create-pages, update-page) |
| **notion-spec-to-implementation** | Notion MCP tools (search, fetch, create-pages, update-page) |
| **doc-coauthoring** | create_file, str_replace (file tools) |
| **web-artifacts-builder** | Shell scripts (init-artifact.sh, bundle-artifact.sh) |

### Skill Clusters by Domain

**Design System Development:**
- design-system-librarian → brand-tokens-translator → design-accessibility
- design-system-builder → frontend-design

**Notion Workflows:**
- notion-meeting-intelligence
- notion-research-documentation
- notion-knowledge-capture
- notion-spec-to-implementation

**Document Creation:**
- docx, pdf, pptx, xlsx
- doc-coauthoring

**Creative/Visual:**
- frontend-design
- canvas-design
- theme-factory
- web-artifacts-builder

**Strategic/Planning:**
- design-lead-thought-partner
- design-brief-generator
- skill-creator

### Token Flow Relationships

```
brand-tokens-translator
    ↓ (produces tokens)
design-system-librarian
    ↓ (validates against tokens)
design-accessibility
    ↓ (audits token compliance)
frontend-design
    ↓ (implements with tokens)
```

---

## Quick Reference: When to Use Each Skill

| If you need to... | Use this skill |
|-------------------|----------------|
| Audit accessibility compliance | design-accessibility |
| Create a design brief or PRD | design-brief-generator |
| Build distinctive UI components | frontend-design |
| Prepare for a meeting | notion-meeting-intelligence |
| Research and document findings | notion-research-documentation |
| Capture conversation knowledge | notion-knowledge-capture |
| Turn specs into tasks | notion-spec-to-implementation |
| Extract tokens from brand guidelines | brand-tokens-translator |
| Think through design decisions | design-lead-thought-partner |
| Audit Figma components for tokens | design-system-librarian |
| Co-author documentation | doc-coauthoring |
| Build complex React artifacts | web-artifacts-builder |
| Create new skills | skill-creator |
| Style artifacts with themes | theme-factory |
| Write internal communications | internal-comms |
| Create visual art | canvas-design |
| Create/edit Word documents | docx |
| Process PDFs | pdf |
| Create/edit presentations | pptx |
| Create/edit spreadsheets | xlsx |
| Answer Anthropic product questions | product-self-knowledge |
