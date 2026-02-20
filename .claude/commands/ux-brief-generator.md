---
name: ux-brief-generator
description: Gather information from Confluence, Jira, Notion, and other sources to generate a comprehensive UX brief with gap analysis and actionable next steps for designers
---

# UX Brief Generator

## When to Use

- Starting a new design project and need to compile all known context
- Product or engineering wrote specs but UX needs a designer-friendly brief
- Multiple information sources (Confluence, Jira, Notion) need to be synthesized
- Want to identify what's missing before design work begins
- Updating an existing brief with new information

## Skill Reference

Read and apply the full skill definition: `Skills/ux-brief-generator/SKILL.md`

## File Ownership

| Path | Purpose |
|------|---------|
| `briefs/[project-name]/ux-brief.md` | Generated UX brief output |
| `Skills/ux-brief-generator/SKILL.md` | Skill definition and workflow |
| `Skills/ux-brief-generator/references/` | Scoring rubrics, anti-patterns, templates |

## Workflow Summary

1. **Gather** — Fetch content from Confluence, Jira, Notion, Figma, and user-provided context
2. **Extract** — Categorize into: problem signals, user context, business context, requirements, constraints, existing state, open questions
3. **Synthesize** — Generate the brief following the template in the skill definition
4. **Score** — Evaluate completeness across 6 dimensions (problem clarity, user context, success metrics, scope, evidence, next steps)
5. **Gap Analysis** — Surface missing inputs, unresolved questions, recommended research, anti-pattern warnings
6. **Save** — Output to `briefs/[project-name]/ux-brief.md`

## Modes

- **Standard**: `/ux-brief-generator [sources]` — Full brief from provided sources
- **Confluence-first**: `/ux-brief-generator --confluence [search term or URLs]` — Start by searching Confluence
- **Jira-first**: `/ux-brief-generator --jira [epic key or project]` — Start by pulling Jira tickets
- **Refresh**: `/ux-brief-generator --refresh [path]` — Update an existing brief with re-fetched sources
- **Score-only**: `/ux-brief-generator --score [path]` — Score an existing brief without regenerating

## Key Outputs

The generated brief includes:
- **Problem statement** — User-centered, evidence-backed, no solutions prescribed
- **User need statements** — NN/g format: [Persona] needs [need] because [insight]
- **Completeness score** — Visual indicator with per-dimension breakdown
- **Gap analysis** — What's missing and what to do about it
- **Phased next steps** — Ordered actions with owners and decision gates
- **Source traceability** — Every claim tagged with its origin

## Post-Generation

After generating, suggest follow-up skills based on completeness:
- Score > 70%: Suggest `/prototype-builder`
- Missing accessibility context: Suggest `/design-accessibility`
- Missing design direction: Suggest `/frontend-design`

## User Input Required

$ARGUMENTS

---

Please provide the sources and context for the UX brief. This can include any combination of:

- **Confluence page URL(s)** — Product specs, requirements, research docs
- **Jira epic/project key** — Related tickets, bug reports, user stories
- **Notion page URL(s)** — Any additional documentation
- **Figma file URL** — Existing designs to reference
- **Project name** — (optional, will derive from source titles)
- **Verbal context** — Anything else relevant: user research, analytics, stakeholder inputs, competitive context

The more sources you provide, the more complete the brief will be. The skill will tell you exactly what's missing.
