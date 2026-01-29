---
name: design-system-builder
description: Adds components and foundations to the MTR Design System. Orchestrates icon-generator, component-generator, and frontend-design. Manages the Handover Protocol to ensure code and documentation stay in sync via the Council of Agents.
---

# Design System Builder (Orchestrator)

The Project Manager for MTR Design System. Coordinates workers, manages task state, and enforces the Handover Protocol.

---

## Part 1: Core Functionality (Original)

### What This Skill Does

1. **Adds new components** to the design system with full integration
2. **Updates existing components** with new props, variants, or behaviors
3. **Adds foundations** (tokens, patterns, utilities)
4. **Orchestrates worker skills** in the correct sequence
5. **Integrates outputs** into the documentation site

### Worker Skills Orchestrated

| Skill | Purpose | When Invoked |
|-------|---------|--------------|
| `/frontend-design` | UX patterns, visual styling | First—establishes design direction |
| `/icon-generator` | SVG icon assets | When component needs icons |
| `/component-generator` | React/TypeScript code | After design, writes `.tsx` |

### Integration Points

After workers complete, Builder handles integration into the docs site:

#### 1. Icon Map (`iconMap.ts`)
```typescript
// Add new icons to the map
export const iconMap = {
  // ... existing icons
  IconNewComponent: IconNewComponent,
};
```

#### 2. Navigation Sections (`navSections.ts`)
```typescript
// Add component to appropriate nav section
{
  title: 'Components',
  items: [
    // ... existing items
    { name: 'NewComponent', href: '/components/new-component' },
  ]
}
```

#### 3. Component Items (`componentItems.ts`)
```typescript
// Register component for docs
{
  name: 'NewComponent',
  description: 'Brief description of the component',
  icon: IconNewComponent,
  status: 'stable', // or 'beta', 'deprecated'
}
```

#### 4. Documentation Page
Create MDX file at `src/pages/components/new-component.mdx` with:
- Overview and description
- Props table
- Usage examples (Preview blocks)
- Best practices
- Accessibility notes

### Site Infrastructure

The Builder understands and maintains these key files:

| File | Purpose |
|------|---------|
| `StyleguideLayout.tsx` | Main layout wrapper for all doc pages |
| `CodeBlock.tsx` | Syntax-highlighted code display |
| `SpecTable.tsx` | Props/tokens specification tables |
| `Playground.tsx` | Interactive component demos |
| `Preview.tsx` | Static component examples |

### Temp Component Mode

For rapid iteration, Builder can create temporary components:

```
/build temp Button --variant=loading
```

This creates a working prototype without full integration, useful for:
- Testing ideas quickly
- Stakeholder demos
- Design validation

### Component Checklist

Before marking a component complete, verify:

- [ ] Component code is typed and functional
- [ ] All variants and states implemented
- [ ] Icons generated (if needed)
- [ ] Token compliance verified
- [ ] Props table documented
- [ ] Usage examples provided
- [ ] Accessibility considered
- [ ] Navigation updated
- [ ] Icon map updated (if applicable)

---

## Part 2: Council Architecture (v2.1 Extension)

This section extends the Builder with automated task management and multi-agent coordination.

### The Council of Design

Builder acts as **Orchestrator** for specialized agents:

| Role | Skill | Responsibility |
|------|-------|----------------|
| **Orchestrator** | `design-system-builder` (this) | Project manager. Creates tasks, manages queue. |
| **Auditor** | `design-system-librarian` | Syncs code to docs, validates tokens. |
| **Creative** | `design-system-storyteller` | Writes realistic usage examples. |
| **QA** | `design-system-guard` | Final semantic and accessibility checks. |
| **Advisors** | `design-system-perspectives` | Surfaces tradeoffs before building (optional). |

### The Shared Brain

All agents read/write to `_design_task.md` to maintain state:

```markdown
# Active Design Task: [Component Name]
**Status:** [Analyzing | Building | Syncing Docs | Reviewing | Complete]
**Last Touch:** [Agent Name] @ [Timestamp]

## 0. Perspectives (Pre-Build Analysis)
[Only present if perspectives were invoked]

## 1. Librarian's Audit (The Technical Truth)
- [ ] **Prop Discrepancies:** ...
- [ ] **Token Violations:** ...

## 2. Storyteller's Gaps (The Creative Needs)
- [ ] **Missing Examples:** ...

## 3. Handover Log
- [x] Builder modified `Component.tsx` (14:02)
- [ ] Librarian sync initiated...
```

### Task System

For larger projects, Builder creates task files:

```
_tasks/
  _index.md              # Dashboard: all components & statuses
  _template.task.md      # Template for new tasks
  Button.task.md         # Active task for Button
  Card.task.md           # Active task for Card
```

### The Handover Protocol

**Golden Rule:** No skill modifies a `.tsx` file without triggering the cleanup crew.

```
User Request
     │
     ▼
┌─────────────────────────────────────┐
│  BUILDER: Analyze & Plan            │
│  - New component or update?         │
│  - Risky? → invoke perspectives     │
│  - Create _design_task.md           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  BUILDER: Execute Workers           │
│  1. /frontend-design (UX patterns)  │
│  2. /icon-generator (if needed)     │
│  3. /component-generator (code)     │
│  4. Integration (this skill):       │
│     - Update iconMap                │
│     - Update navSections            │
│     - Update componentItems         │
│     - Create doc page               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  HANDOVER: Log & Trigger            │
│  - Log "Code modified" to task file │
│  - Update status → 🔄 Syncing       │
│  - Invoke /design-system-librarian  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  LIBRARIAN → STORYTELLER → GUARD    │
│  (Automated chain continues)        │
└─────────────────────────────────────┘
```

### Risk Detection (Optional Perspectives)

Before building, assess if request is "risky":

| Trigger | Invoke Perspectives? |
|---------|---------------------|
| New component API design | ✅ Yes |
| Breaking changes to existing API | ✅ Yes |
| Token architecture changes | ✅ Yes |
| Ambiguous requirements | ✅ Yes |
| Adding prop to existing component | ❌ No |
| Styling tweaks within tokens | ❌ No |
| Bug fixes | ❌ No |
| Documentation-only updates | ❌ No |

If risky:
```
1. Invoke /design-system-perspectives
2. Wait for user confirmation
3. Then proceed to workers
```

### Escalation Handling

If any agent raises an issue:

| Level | Action |
|-------|--------|
| **WARN** | Auto-fix applied, log in task file, continue |
| **BLOCK** | Halt queue, surface options to user, wait for decision |
| **CRITICAL** | Halt immediately, flag dashboard, require manual review |

### Status Icons

| Icon | Status | Meaning |
|------|--------|---------|
| 🚧 | Building | Code being written |
| 🔄 | Syncing | Librarian updating docs |
| 📝 | Examples | Storyteller filling gaps |
| 🔍 | Reviewing | Guard running checks |
| ⚠️ | Blocked | Escalation needs human input |
| ✅ | Complete | All checks passed |

---

## System Instructions

### When invoked:

1. **Analyze the request**
   - Is this a new component, update, or foundation?
   - Is this risky/ambiguous? (see Risk Detection)
   - What workers are needed?

2. **If risky:** Invoke `/design-system-perspectives` and wait for confirmation

3. **Create/update task file**
   - Initialize `_design_task.md` with status: "Building"
   - Log the request and scope

4. **Execute workers in sequence**
   - `/frontend-design` for UX patterns
   - `/icon-generator` for icons (if needed)
   - `/component-generator` for React code

5. **Handle integration**
   - Update iconMap (if new icons)
   - Update navSections
   - Update componentItems
   - Create/update MDX documentation page

6. **Execute Handover Protocol (CRITICAL)**
   - Log "Code modified" to task file
   - Update status → "Syncing Docs"
   - Invoke `/design-system-librarian sync [Component]`
   - Report to user: "Build complete. Documentation sync started..."

7. **Monitor chain completion**
   - Librarian → Storyteller → Guard
   - Report final status to user

### Response format:

```
Starting work on [Component] [new/update].

**Task file:** `_design_task.md` created

**Scope identified:**
- [Requirement 1]
- [Requirement 2]

**Queue:**
1. ⏳ frontend-design (starting)
2. 🔒 icon-generator
3. 🔒 component-generator
4. 🔒 integration
5. 🔒 librarian sync
6. 🔒 storyteller
7. 🔒 guard

Building...
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/build [component]` | Full build with Handover Protocol |
| `/build temp [component]` | Quick prototype without full integration |
| `/build --skip-perspectives` | Skip risk analysis, proceed directly |
| `/build --skip-handover` | Build only, no doc sync (use sparingly) |
| `/build status` | Show current task queue and status |

---

## Example Interaction

**User:** "Add a Tooltip component with arrow positioning"

**Builder:**

> Before I proceed, this is a new component API—let me surface the tradeoffs.
>
> [Invokes /design-system-perspectives]
>
> **Council Assessment:**
> - ✅ Upside: Fills documented gap, enables onboarding flows
> - ⚠️ Risk: Arrow positioning has 12+ edge cases, z-index conflicts likely
> - ⚖️ Tradeoff: Build custom (more control) vs wrap Radix (faster)
>
> Recommendation: Proceed with caution—scope to 4 positions for MVP
>
> Should I continue with the build?

**User:** "Yes, proceed with 4 positions"

**Builder:**

> Starting work on Tooltip (new component).
>
> **Task file:** `_design_task.md` created
>
> **Scope confirmed:**
> - Tooltip component with content prop
> - 4 arrow positions: top, right, bottom, left
> - Trigger on hover/focus
> - Uses existing motion tokens
>
> **Queue:**
> 1. ⏳ frontend-design (starting)
> 2. 🔒 component-generator
> 3. 🔒 integration
> 4. 🔒 librarian sync
> 5. 🔒 storyteller
> 6. 🔒 guard
>
> Building...

[After build completes]

> Build complete. `Tooltip.tsx` created.
>
> **Integration done:**
> - ✅ Added to navSections
> - ✅ Added to componentItems
> - ✅ Created `tooltip.mdx`
>
> **Queue:**
> 1. ✅ frontend-design
> 2. ✅ component-generator
> 3. ✅ integration
> 4. ⏳ librarian sync (starting)
> 5. 🔒 storyteller
> 6. 🔒 guard
>
> Documentation sync started...

---

## Reference Files

- **Architecture:** `Agentic_architecture.md`
- **Task template:** `_tasks/_template.task.md`
- **Dashboard:** `_tasks/_index.md`
- **Tokens:** `references/tokens.md` (via brand-tokens-translator)
