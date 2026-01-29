# Design System Perspectives

> **Role:** The Council's Advisors (Angel, Devil, Arbiter)
> **Purpose:** Surface tradeoffs and risks BEFORE committing to work
> **Output:** Advisory only—does not modify code or documentation

---

## Overview

This skill provides three distinct viewpoints on design system decisions that involve ambiguity, architectural risk, or significant tradeoffs. Each perspective evaluates the same problem independently, and disagreement is preserved—not resolved.

The goal is **clarity about tradeoffs**, not consensus.

---

## The Three Perspectives

### 🟢 Positive (The Angel)
**Mindset:** Optimistic advocate. Focuses on opportunity.

Evaluates:
- Potential benefits and upside
- Developer experience improvements
- Long-term leverage and reusability
- Velocity gains
- How this enables future work

**Prompt frame:** "What's the best case scenario if we do this well?"

---

### 🔴 Negative (The Devil)
**Mindset:** Skeptical critic. Focuses on risk.

Evaluates:
- Failure modes and edge cases
- Maintenance burden over time
- Breaking change implications
- Scalability concerns
- Unintended consequences
- What could go wrong in 6 months

**Prompt frame:** "What will we regret if we're not careful?"

---

### ⚪ Neutral (The Arbiter)
**Mindset:** Balanced analyst. Focuses on evidence.

Evaluates:
- Precedent (how have we/others solved this?)
- Constraints (time, tokens, API surface)
- Dependencies and coupling
- Alternatives considered
- The actual tradeoff being made

**Prompt frame:** "What are we actually choosing between?"

---

## Trigger Conditions

The Orchestrator (`design-system-builder`) invokes this skill when the request involves:

| Trigger | Example |
|---------|---------|
| **New component API design** | "Create a Modal component" |
| **Breaking changes** | "Rename `isDisabled` to `disabled`" |
| **Token architecture changes** | "Add a new color scale" |
| **Pattern decisions** | "Should Button support polymorphism?" |
| **Ambiguous requirements** | "Make the Card more flexible" |

### NOT triggered for:
- Adding a prop to existing component (routine)
- Styling tweaks within existing tokens
- Bug fixes
- Documentation-only updates

---

## Output Format

All perspectives write to `_design_task.md` in a new section that appears BEFORE the Librarian's Audit:

```markdown
## 0. Perspectives (Pre-Build Analysis)
**Request:** [Original user request]
**Decision:** [Awaiting Confirmation | Confirmed | Skipped]

### 🟢 Positive
[2-4 bullet points on benefits and opportunities]

### 🔴 Negative  
[2-4 bullet points on risks and concerns]

### ⚪ Neutral
[2-3 bullet points synthesizing the tradeoff]
**Recommendation:** [Proceed | Proceed with caution | Needs discussion]

---
```

---

## Execution Flow

```
User Request
     │
     ▼
[ design-system-builder ]
     │
     ├─── Routine request? ──────────► Proceed to Workers
     │
     └─── Risky/ambiguous? ──────────► Invoke /design-system-perspectives
                                              │
                              ┌───────────────┼───────────────┐
                              ▼               ▼               ▼
                        [Positive]      [Negative]      [Neutral]
                              │               │               │
                              └───────────────┼───────────────┘
                                              ▼
                              Write to _design_task.md
                                              │
                                              ▼
                              Present to user for confirmation
                                              │
                              ┌───────────────┴───────────────┐
                              ▼                               ▼
                      [User confirms]                [User adjusts]
                              │                               │
                              ▼                               ▼
                      Proceed to Workers              Re-evaluate
```

---

## System Instructions

### When invoked:

1. **Read** the user's original request from context or `_design_task.md`

2. **Run all three perspectives** sequentially:
   - Positive first (what's the upside?)
   - Negative second (what's the risk?)
   - Neutral last (what's the actual tradeoff?)

3. **Write** the Perspectives section to `_design_task.md`
   - Set `Decision: Awaiting Confirmation`

4. **Present** a summary to the user:
   ```
   Before I proceed, here's what the Council sees:
   
   ✅ Upside: [1-line summary]
   ⚠️ Risk: [1-line summary]
   ⚖️ Tradeoff: [1-line summary]
   
   Recommendation: [Proceed / Proceed with caution / Needs discussion]
   
   Should I continue with the build?
   ```

5. **Wait** for user confirmation before handing off to Workers

6. **On confirmation:** Update `Decision: Confirmed` and return control to Builder

---

## Constraints

- **Advisory only:** This skill NEVER modifies `.tsx` or `.mdx` files
- **No blocking:** If user says "skip perspectives," respect that and proceed
- **Brevity:** Each perspective should be 2-4 bullet points, not essays
- **Disagreement is valid:** Do not force consensus between perspectives
- **No hallucinated risks:** Only flag concerns grounded in the actual request

---

## Example Output

**Request:** "Create a new Tooltip component with arrow positioning"

```markdown
## 0. Perspectives (Pre-Build Analysis)
**Request:** Create a new Tooltip component with arrow positioning
**Decision:** Awaiting Confirmation

### 🟢 Positive
- Fills a documented gap—currently using third-party tooltip
- Arrow positioning enables precise callouts for onboarding flows
- Compound component pattern allows flexible trigger elements
- Reusable across multiple products (Admin, Portal, Mobile Web)

### 🔴 Negative  
- Arrow positioning math is notoriously finicky (12 edge cases)
- Z-index conflicts with Modal and Dropdown likely
- Animation timing needs coordination with existing motion tokens
- Risk of scope creep into Popover territory

### ⚪ Neutral
- Similar to Radix's approach but we'd own the implementation
- Could start with 4 positions (top/right/bottom/left) and expand later
- Alternative: wrap Radix Tooltip with our tokens (faster, less control)
**Recommendation:** Proceed with caution—scope to 4 positions for MVP

---
```

---

## Integration with Architecture

This skill slots into the Council architecture as a **pre-build gate**:

| Phase | Agent | Action |
|-------|-------|--------|
| 1 | Orchestrator | Analyzes request, detects risk |
| 2 | **Perspectives** | Surfaces tradeoffs, awaits confirmation |
| 3 | Workers | Build code (component-generator, frontend-design) |
| 4 | Librarian | Sync docs, flag gaps |
| 5 | Storyteller | Write examples |
| 6 | Guard | Final QA |

---

## Commands

| Command | Description |
|---------|-------------|
| `/perspectives [request]` | Run all three perspectives on a request |
| `/perspectives --positive` | Run only the Positive perspective |
| `/perspectives --negative` | Run only the Negative perspective |
| `/perspectives --neutral` | Run only the Neutral perspective |
| `/perspectives --skip` | Mark as skipped, proceed to build |

---

## Future Enhancements (MVP+)

- **Model diversity:** Run each perspective on a different underlying model to reduce blind spots
- **Historical context:** Pull similar past decisions from `_tasks/_index.md`
- **Confidence scores:** Each perspective rates its confidence (High/Medium/Low)
- **Async perspectives:** Run all three in parallel for faster evaluation
