# UX Brief Template (Standalone)

Use this template when generating a brief manually or when customizing the output format.

---

```markdown
# UX Brief: [Project/Feature Name]

> **Generated**: [YYYY-MM-DD]
> **Last Updated**: [YYYY-MM-DD]
> **Completeness**: [XX]% — [████████░░]
> **Sources**: [N] Confluence pages, [N] Jira tickets, [N] other
> **Status**: Draft | Review | Approved

---

## 1. Summary

[2-3 sentences maximum. Answer: What is this project, who is it for, and why does it matter now?]

---

## 2. Problem Statement

[1-3 sentences. Specific. User-centered. Evidence-backed. No solutions.]

**Evidence**:
- [Data point or user quote] — *[Source: Page/Ticket]*
- [Data point or user quote] — *[Source: Page/Ticket]*
- [Data point or user quote] — *[Source: Page/Ticket]*

---

## 3. User Context

### Personas / Segments

| Persona | Role / Context | Key Needs | Pain Points | Evidence Source |
|---------|---------------|-----------|-------------|----------------|
| [Name] | [Description] | [Needs] | [Pains] | [Source] |
| [Name] | [Description] | [Needs] | [Pains] | [Source] |

### User Need Statements

> Format: **[Persona]** needs **[need/goal]** because **[insight/motivation]**

1. **[Persona]** needs **[need]** because **[insight]** — *[Source]*
2. **[Persona]** needs **[need]** because **[insight]** — *[Source]*
3. **[Persona]** needs **[need]** because **[insight]** — *[Source]*

### Behavioral Insights

- [Insight about how users currently behave] — *[Source]*
- [Insight about user mental models or expectations] — *[Source]*

---

## 4. Current State

**What exists today**:
- [Current design/product description]

**Known pain points** (with evidence):
- [Pain point] — *[Source: ticket/analytics/research]*
- [Pain point] — *[Source: ticket/analytics/research]*

**Key metrics baseline**:
| Metric | Current Value | Date Measured | Source |
|--------|--------------|---------------|--------|
| [Metric] | [Value] | [Date] | [Source] |

**Current workarounds**:
- [How users work around the problem today]

---

## 5. Business Context

**Business objectives**:
- [Primary goal — priority level]
- [Secondary goal — priority level]

**Stakeholder priorities**:
| Stakeholder | Priority | Notes |
|-------------|----------|-------|
| [Role/Name] | [Priority] | [Context] |

**Competitive landscape**:
- [Competitor A]: [What they do well/differently]
- [Competitor B]: [What they do well/differently]

---

## 6. Scope & Constraints

### In Scope
- [Feature/capability 1]
- [Feature/capability 2]
- [Feature/capability 3]

### Explicitly Out of Scope
- [Item 1 — reason for exclusion]
- [Item 2 — reason for exclusion]

### Constraints

| Type | Constraint | Impact on Design | Source |
|------|-----------|-----------------|--------|
| Technical | [Constraint] | [How it affects design options] | [Source] |
| Brand | [Constraint] | [How it affects design options] | [Source] |
| Legal/Compliance | [Constraint] | [How it affects design options] | [Source] |
| Accessibility | [WCAG AA / Section 508] | [Specific requirements] | [Source] |
| Timeline | [Deadline/sprint] | [What must ship when] | [Source] |

---

## 7. Success Metrics

| Metric | Type | Target | Baseline | How Measured | When |
|--------|------|--------|----------|-------------|------|
| [Primary] | User outcome | [Target] | [Current] | [Method] | [Frequency] |
| [Secondary] | User outcome | [Target] | [Current] | [Method] | [Frequency] |
| [Guardrail] | Business | [Target] | [Current] | [Method] | [Frequency] |

**How we'll know it worked**: [1 sentence plain-language summary]

---

## 8. Design Direction *(optional — include if any emerged from research)*

**Design principles for this project**:
1. [Principle] — [Why it matters for this context]
2. [Principle] — [Why it matters for this context]

**Reference patterns / inspiration**:
- [Link or description of relevant patterns]

**Anti-patterns to avoid**:
- [What NOT to do and why]

---

## 9. Requirements

### Must Have (P0)
- [ ] [Requirement — user outcome framing] — *[Source]*
- [ ] [Requirement — user outcome framing] — *[Source]*

### Should Have (P1)
- [ ] [Requirement] — *[Source]*

### Nice to Have (P2)
- [ ] [Requirement] — *[Source]*

### Non-Functional Requirements
- [ ] [Performance / accessibility / security requirement] — *[Source]*

---

## 10. Open Questions

> Resolve these before finalizing design direction.

| # | Question | Who Answers | Suggested Method | Priority |
|---|----------|-------------|-----------------|----------|
| 1 | [Question] | [Role] | [Interview / analytics / stakeholder review] | High |
| 2 | [Question] | [Role] | [Method] | Medium |
| 3 | [Question] | [Role] | [Method] | Low |

---

## 11. Gap Analysis

### Completeness Score

```
Overall: [XX]% [████████████████░░░░░░]

Problem Clarity     [XX/20] [██████████████████░░] [Status note]
User Context        [XX/20] [██████████████░░░░░░] [Status note]
Success Metrics     [XX/15] [█████████████░░░░░░░] [Status note]
Scope & Constraints [XX/15] [█████████████████░░░] [Status note]
Background          [XX/15] [████████████░░░░░░░░] [Status note]
Next Steps          [XX/15] [█████████████████░░░] [Status note]
```

### Missing Inputs
- [ ] [What's missing] — *[Why it matters for design decisions]*
- [ ] [What's missing] — *[Why it matters for design decisions]*

### Anti-Pattern Warnings

**[SEVERITY]** [Anti-Pattern Name]
[Description and recommended fix]

---

## 12. Recommended Next Steps

### Phase 1: Research & Validation *(before design)*
- [ ] [Action] — *[Owner role]* — Output: [format]
- [ ] [Action] — *[Owner role]* — Output: [format]

### Phase 2: Design Exploration
- [ ] [Action] — *[Owner role]* — Output: [format]
- [ ] [Action] — *[Owner role]* — Output: [format]

### Phase 3: Design & Test
- [ ] [Action] — *[Owner role]* — Output: [format]

### Decision Gates
| Gate | Decision Needed | Who Decides | By When | Depends On |
|------|----------------|-------------|---------|-----------|
| 1 | [Decision] | [Role] | [Date] | [Prerequisite] |
| 2 | [Decision] | [Role] | [Date] | [Prerequisite] |

---

## 13. Sources & References

| # | Source | Type | Link | Last Updated |
|---|--------|------|------|-------------|
| 1 | [Title] | Confluence | [URL] | [Date] |
| 2 | [Key] | Jira | [URL] | [Date] |
| 3 | [Title] | Notion | [URL] | [Date] |
| 4 | [Title] | Figma | [URL] | [Date] |
| 5 | [Title] | Other | [URL/description] | [Date] |

---

*Generated by `/ux-brief-generator` — Re-run with additional sources to improve completeness score.*
```
