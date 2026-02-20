---
name: ux-brief-generator
description: Gather information from Confluence, Jira, Notion, and other sources to generate a comprehensive, research-backed UX brief with gap analysis and actionable next steps for designers.
---

# UX Brief Generator

## Purpose

This skill is a **research-first UX brief compiler**. It gathers information from multiple sources (Confluence, Jira, Notion, Figma, user-provided context), synthesizes it into a structured brief following industry best practices (NN/g, IDEO, Google Design Sprint), and surfaces gaps so UX designers know exactly what they have, what's missing, and what to do next.

The output is a scannable, problem-centered document optimized for designers — not a PRD, not a tech spec.

## Core Principles

### 1. Problem-First, Solution-Never
The brief defines the problem space. It never prescribes UI solutions. Constraints are acceptable; mockup directions are not. If source material contains solution-prescriptive language ("add a dropdown"), reframe it as the underlying need ("users need to select from predefined options").

### 2. Scannable by Default
Designers scan, they don't read paragraphs. Every section uses headings, bullet lists, tables, and bold key terms. The summary is consumable in under 2 minutes.

### 3. Evidence-Linked, Not Inlined
Reference source pages by link rather than copying full content. Each claim traces back to its source (Confluence page, Jira ticket, analytics, etc.).

### 4. Explicit About Gaps
Separate what is known from what is unknown. The completeness score and gap analysis are the most valuable parts of the brief — they tell the team where to focus research effort before design begins.

### 5. User Need Statements as the Spine
Every brief contains at least 1-3 user need statements in NN/g format:
> **[User/Persona]** needs **[need/goal]** because **[insight/motivation]**

These become the alignment check for all downstream design decisions.

## Workflow

### Phase 1: Gather Sources

Collect information from as many of these sources as the user provides:

#### Confluence Pages
Use the Confluence MCP tools to fetch page content:
1. Extract page ID from URL: `https://metrc-tech.atlassian.net/wiki/spaces/SPACE/pages/PAGEID/Title`
2. Fetch with `getConfluencePage` using `contentFormat: "markdown"`
3. Check for child pages with `getConfluencePageDescendants` — ask user if they want children included
4. If user gives a search term, use `searchConfluenceUsingCql` to find relevant pages

**Cloud ID**: `086ab4b0-285b-4f1c-be76-7af58a9c4f72`

#### Jira Tickets
Use Jira MCP tools to pull related tickets:
1. Search by epic, project, or label: `/rest/api/3/search/jql`
2. Extract: summary, description, acceptance criteria, status, priority, comments
3. Look for patterns in bug reports (recurring pain points = user needs)
4. Pull linked epics/stories for scope context

#### Notion Pages
Use Notion MCP tools if the user provides Notion URLs:
1. Fetch page with `notion-fetch`
2. Search for related pages with `notion-search`

#### Figma Files
If the user provides Figma URLs or references existing designs:
1. Use Figma MCP tools to understand current design state
2. Extract component structure, design patterns in use
3. Note any design system tokens or variables relevant to the project

#### User-Provided Context
The user may also provide:
- Verbal descriptions of the problem
- Analytics data or screenshots
- Competitive analysis
- User research findings
- Stakeholder quotes or priorities
- Existing wireframes or prototypes

### Phase 2: Extract & Categorize

Parse all gathered content and sort into these categories:

| Category | What to Extract |
|----------|----------------|
| **Problem Signals** | Pain points, bug reports, support tickets, user complaints, drop-off data |
| **User Context** | Personas, roles, segments, behavioral insights, user journeys |
| **Business Context** | Business goals, KPIs, stakeholder priorities, competitive landscape |
| **Requirements** | Functional requirements, user stories, acceptance criteria, business rules |
| **Constraints** | Technical limitations, brand guidelines, legal/compliance, accessibility, timeline |
| **Existing State** | Current designs, analytics baselines, known workarounds, technical debt |
| **Open Questions** | Ambiguities, conflicting information, missing data, untested assumptions |

### Phase 3: Synthesize the Brief

Generate the brief using the template structure below. For each section:
1. Write content based on extracted evidence
2. Tag each claim with its source: `[Source: Page Title]` or `[Source: PROJ-123]`
3. Flag assumptions that lack evidence: `[Assumption — needs validation]`
4. Note when a section has insufficient data

### Phase 4: Score Completeness

Evaluate the brief across 6 dimensions (see `references/completeness-scoring.md`):

| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| Problem Clarity | 20% | Is the problem specific, user-centered, and evidence-backed? |
| User Context | 20% | Are personas research-backed? Are behavioral insights included? |
| Success Metrics | 15% | Are there measurable, user-outcome-linked criteria? |
| Scope & Constraints | 15% | Are boundaries clear? Are technical/brand/legal constraints documented? |
| Background & Evidence | 15% | Is there current-state data, analytics, competitive context? |
| Actionable Next Steps | 15% | Are deliverables, owners, and decision points defined? |

Display the score as a visual indicator at the top of the brief.

### Phase 5: Generate Gap Analysis & Next Steps

Based on the completeness score, generate:

1. **Missing Inputs** — What data sources were not provided that would strengthen the brief
2. **Open Questions** — Unresolved ambiguities that need answers before design begins
3. **Recommended Research** — Specific research activities to fill gaps (usability tests, interviews, analytics deep-dives)
4. **Phased Next Steps** — Ordered list of what the design team should do, with decision gates
5. **Anti-Pattern Warnings** — Flag any issues found in the source material (see `references/anti-patterns.md`)

### Phase 6: Save & Report

Save the brief to:
```
briefs/[project-name]/ux-brief.md
```

Report to the user:
- Where the file was saved
- The completeness score with per-dimension breakdown
- Top 3 gaps that most need attention
- Suggested next steps for the design team
- That they can re-run the skill with additional sources to improve the score

## Brief Template

```markdown
# UX Brief: [Project/Feature Name]

> **Generated**: [date]
> **Completeness**: [score]% — [visual bar ████████░░]
> **Sources**: [count] Confluence pages, [count] Jira tickets, [count] other

---

## 1. Summary
[2-3 sentences: What is this project, who is it for, and why does it matter?]

## 2. Problem Statement
[1-3 sentences describing the user problem. Specific, evidence-backed, no solutions.]

**Evidence**:
- [Data point or quote with source tag]
- [Data point or quote with source tag]

## 3. User Context

### Personas / Segments
| Persona | Description | Key Needs | Evidence |
|---------|-------------|-----------|----------|
| [Name]  | [Role/context] | [Needs] | [Source] |

### User Need Statements
- **[Persona]** needs **[need]** because **[insight]** [Source: ...]
- **[Persona]** needs **[need]** because **[insight]** [Source: ...]

### Behavioral Insights
- [Insight with source]

## 4. Current State
- **What exists today**: [Description]
- **Known pain points**: [List with evidence]
- **Key metrics baseline**: [If available]
- **Current workarounds**: [If any]

## 5. Business Context
- **Business objectives**: [Goals with priority]
- **Stakeholder priorities**: [Key stakeholder inputs]
- **Competitive landscape**: [Brief competitive context]

## 6. Scope & Constraints

### In Scope
- [Item]

### Out of Scope
- [Item]

### Constraints
| Type | Constraint | Source |
|------|-----------|--------|
| Technical | [Constraint] | [Source] |
| Brand/Legal | [Constraint] | [Source] |
| Accessibility | [Constraint] | [Source] |
| Timeline | [Constraint] | [Source] |

## 7. Success Metrics
| Metric | Target | Baseline | How Measured |
|--------|--------|----------|-------------|
| [Primary metric] | [Target] | [Current] | [Method] |
| [Secondary metric] | [Target] | [Current] | [Method] |

## 8. Design Direction *(optional)*
- **Design principles for this project**: [If any emerged from research]
- **Reference patterns**: [Links to inspiration, competitor examples]
- **Anti-patterns to avoid**: [What NOT to do in this context]

## 9. Requirements
### Must Have
- [ ] [Requirement] [Source: ...]
- [ ] [Requirement] [Source: ...]

### Should Have
- [ ] [Requirement] [Source: ...]

### Nice to Have
- [ ] [Requirement] [Source: ...]

## 10. Open Questions
> These must be resolved before finalizing design direction.

- [ ] [Question — who needs to answer, suggested method]
- [ ] [Question — who needs to answer, suggested method]

## 11. Gap Analysis

### Completeness Score Breakdown
| Dimension | Score | Status |
|-----------|-------|--------|
| Problem Clarity | [X/20] | [status emoji + note] |
| User Context | [X/20] | [status emoji + note] |
| Success Metrics | [X/15] | [status emoji + note] |
| Scope & Constraints | [X/15] | [status emoji + note] |
| Background & Evidence | [X/15] | [status emoji + note] |
| Actionable Next Steps | [X/15] | [status emoji + note] |

### Missing Inputs
- [What's missing and why it matters]

### Anti-Pattern Warnings
- [Any issues detected in the source material]

## 12. Recommended Next Steps

### Phase 1: Research & Validation
- [ ] [Action — owner role — output format]

### Phase 2: Design Exploration
- [ ] [Action — owner role — output format]

### Phase 3: Design & Test
- [ ] [Action — owner role — output format]

### Decision Gates
- [ ] [Decision needed — who decides — by when]

## 13. Sources & References
| Source | Type | Link |
|--------|------|------|
| [Title] | Confluence | [URL] |
| [Key] | Jira | [URL] |
| [Title] | Other | [URL] |
```

## Modes

| Mode | Command | What It Does |
|------|---------|--------------|
| Standard | `/ux-brief-generator` | Full brief from provided sources |
| Confluence-first | `/ux-brief-generator --confluence` | Start by searching Confluence for relevant pages |
| Jira-first | `/ux-brief-generator --jira` | Start by pulling Jira epic/project tickets |
| Refresh | `/ux-brief-generator --refresh [path]` | Re-fetch sources and update an existing brief |
| Score-only | `/ux-brief-generator --score [path]` | Score an existing brief without regenerating |

## Integration With Other Skills

- **After generating**: Suggest `/prototype-builder` if the brief is complete enough (score > 70%)
- **For missing accessibility context**: Suggest `/design-accessibility` audit
- **For Figma token context**: Reference `/figma-token-extractor` findings
- **For deeper design direction**: Suggest `/frontend-design` consultation
- **For implementation**: The brief feeds into PRDs and can be used with `/confluence-to-prototype`

## Edge Cases

- **No Confluence/Jira access**: Generate brief from user-provided context only; flag missing external sources in gap analysis
- **Conflicting information across sources**: List both versions, tag sources, add to Open Questions
- **Source material is solution-prescriptive**: Reframe as underlying user needs; note original language in a footnote
- **Very broad scope**: Ask user to narrow focus or generate a brief per sub-feature
- **Mostly visual source material**: Flag to user, ask for verbal context to supplement
- **Stale source material**: Check dates on Confluence pages and Jira tickets; flag anything older than 6 months

## Reference Files
- **Completeness scoring**: See `references/completeness-scoring.md`
- **Anti-patterns**: See `references/anti-patterns.md`
- **Brief template (standalone)**: See `references/brief-template.md`
