# Prototype Builder Skill

## Overview

**Name:** prototype-builder
**Trigger:** `/prototype-builder` or when working on screen layouts, user flows, wireframes, or high-fidelity prototypes

**Description:** Generate and iterate on UI prototypes from requirements. This skill handles the **Prototype Ideation Loop** - creating draft screens/flows, gathering UX feedback, and iterating until approved. Once approved, prototypes are analyzed for component gaps before handoff to the component building phase.

---

## Context Triggers (for Skill Router)

```yaml
triggers:
  keywords:
    - prototype
    - wireframe
    - mockup
    - screen
    - flow
    - layout exploration
    - sketch
  intents:
    - prototype this
    - sketch out
    - explore layout
    - ideate on
    - try different
    - what if we
  filePatterns:
    - "**/prototypes/**"
    - "**/iterations/**"

confidenceBoosters:
  - condition: "wireframe|low.?fi|high.?fi|fidelity"
    boost: 0.1
  - condition: "user.?flow|journey|step.?by.?step|onboarding"
    boost: 0.1
  - condition: "explore|try|experiment|iterate|option"
    boost: 0.1

confidencePenalties:
  - condition: "final|production|ship|deploy"
    penalty: 0.3
  - condition: "props|typescript|export|import"
    penalty: 0.2

commonSuccessors:
  - design-system-builder-temp
commonPredecessors: []
```

---

## Role in Workflow

```
PRD/Requirements
    ↓
┌─────────────────────────────────────────┐
│  PROTOTYPE IDEATION LOOP (this skill)   │
│                                         │
│  Prototype Generator → Draft Prototype  │
│         ↓                               │
│  👤 UX Designer reviews                 │
│         ↓                               │
│  Needs changes? → Prototype Iterator    │
│         ↓ No        ↓                   │
│         ↓      back to review           │
│         ↓ Approved                      │
└─────────────────────────────────────────┘
    ↓
Component Gap Check → Temp Component Builder (if needed)
```

---

## File Ownership

This skill owns and maintains the following files:

| File Path | Purpose |
|-----------|---------|
| `/prototypes/[project]/` | Project-specific prototype files |
| `/prototypes/[project]/screens/` | Individual screen components |
| `/prototypes/[project]/flows/` | User flow definitions |
| `/prototypes/[project]/README.md` | Prototype documentation and status |

**Do not modify design system or component files - delegate to appropriate skills.**

---

## Core Capabilities

### 1. Prototype Generator

Creates initial prototype from requirements:

**Inputs:**
- PRD/requirements document (JSON or markdown)
- Brand tokens/design system reference
- Target device/breakpoints
- Fidelity level (wireframe, low-fi, high-fi)

**Outputs:**
- Screen layouts as React components
- Navigation/flow structure
- Placeholder content with realistic data
- Responsive behavior definitions

```tsx
// Example output: /prototypes/onboarding/screens/Welcome.tsx

import { tokens } from '@/styles/design-tokens';

export function WelcomeScreen() {
  return (
    <div className="flex flex-col min-h-screen p-6">
      {/* Hero Section */}
      <header className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="w-24 h-24 bg-primary-100 rounded-full mb-6">
          {/* Placeholder: App logo */}
        </div>
        <h1 className="text-3xl font-semibold text-neutral-900 mb-2">
          Welcome to AppName
        </h1>
        <p className="text-neutral-600 max-w-sm">
          Brief value proposition that explains what the user can accomplish.
        </p>
      </header>

      {/* Actions */}
      <footer className="space-y-3">
        <button className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium">
          Get Started
        </button>
        <button className="w-full py-3 text-primary-500 font-medium">
          I already have an account
        </button>
      </footer>
    </div>
  );
}
```

### 2. Prototype Iterator

Refines prototypes based on feedback:

**Inputs:**
- Existing prototype screens
- UX Designer feedback (specific or general)
- Reference examples (optional)
- Constraints or requirements changes

**Iteration Types:**

| Type | Description |
|------|-------------|
| **Layout adjustment** | Reposition, resize, reorder elements |
| **Content refinement** | Update copy, labels, placeholder data |
| **Interaction change** | Modify navigation, transitions, micro-interactions |
| **Visual polish** | Spacing, typography, color adjustments |
| **Variant exploration** | Generate 2-3 alternative approaches |

**Feedback Integration Pattern:**

```markdown
## UX Feedback on WelcomeScreen

- [ ] Make CTA button more prominent
- [ ] Add social proof element (testimonial or user count)
- [ ] Consider adding skip option for returning users
- [ ] Hero image feels generic - explore illustration options

## Iteration Response

### Changes Made:
1. Increased CTA button size and added subtle shadow
2. Added "Join 10,000+ users" badge below headline
3. Added "Skip for now" text link below secondary button
4. Replaced placeholder with abstract illustration concept

### Alternatives Generated:
- Variant A: Carousel hero with 3 value props
- Variant B: Video background with overlay
- Variant C: Split screen with illustration left, content right
```

### 3. Prototype Analyzer

Evaluates approved prototypes for component gaps:

**Analysis Output:**

```markdown
## Component Gap Analysis: Onboarding Flow

### Existing DLS Components Used:
- Button (primary, secondary variants) ✓
- Typography (h1, body) ✓
- Spacing tokens ✓

### Components Needing Creation:
| Component | Screens Used | Priority | Notes |
|-----------|--------------|----------|-------|
| ProgressStepper | Steps 1-4 | High | 4-step horizontal stepper |
| IllustrationPlaceholder | Welcome, Complete | Medium | Branded illustration container |
| SocialProofBadge | Welcome | Low | "X users" with icon |

### Recommendations:
1. **ProgressStepper** - Create in Temp Component Builder, likely canonical
2. **IllustrationPlaceholder** - May be prototype-specific, evaluate after testing
3. **SocialProofBadge** - Simple composition, could use existing Badge + Icon
```

---

## Fidelity Levels

### Wireframe (Lo-Fi)

```tsx
// Gray boxes, no styling, structure only
<div className="border-2 border-dashed border-neutral-300 p-4">
  <div className="bg-neutral-200 h-12 w-32 mb-4" /> {/* Logo */}
  <div className="bg-neutral-200 h-8 w-full mb-2" /> {/* Headline */}
  <div className="bg-neutral-200 h-4 w-3/4" /> {/* Subhead */}
</div>
```

### Low-Fidelity

```tsx
// Basic styling, placeholder content, correct spacing
<div className="p-6 space-y-4">
  <div className="w-16 h-16 bg-primary-100 rounded-lg" />
  <h1 className="text-2xl font-semibold">Screen Title</h1>
  <p className="text-neutral-600">Description text goes here...</p>
</div>
```

### High-Fidelity

```tsx
// Production-like styling, real content, animations
<motion.div
  className="p-6 space-y-4"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  <img src="/brand/logo.svg" className="w-16 h-16" alt="Logo" />
  <h1 className="text-2xl font-semibold text-neutral-900">
    Welcome back, Sarah
  </h1>
  <p className="text-neutral-600">
    You have 3 new notifications since your last visit.
  </p>
</motion.div>
```

---

## Standard Workflows

### Workflow: New Prototype from PRD

1. **Parse requirements:**
   ```
   → Read PRD/requirements document
   → Extract: user goals, screens needed, key interactions
   → Identify: target devices, brand constraints
   ```

2. **Generate screen inventory:**
   ```markdown
   ## Screen Inventory: [Project Name]

   | Screen | Purpose | Priority | Dependencies |
   |--------|---------|----------|--------------|
   | Welcome | First impression, value prop | P0 | None |
   | SignUp | Account creation | P0 | Welcome |
   | Dashboard | Main hub | P0 | SignUp |
   ```

3. **Create initial screens:**
   ```
   → Generate each screen at requested fidelity
   → Apply design tokens consistently
   → Add navigation connections
   → Document assumptions made
   ```

4. **Present for review:**
   ```markdown
   ## Prototype Ready for Review

   **Screens:** 5 created
   **Fidelity:** Low-fi
   **Assumptions:**
   - Mobile-first, 375px base
   - Single-column layout
   - Bottom navigation pattern

   **Questions for UX Designer:**
   1. Should onboarding be skippable?
   2. Preferred illustration style?
   3. Form validation inline or on submit?
   ```

### Workflow: Iteration Cycle

1. **Receive feedback:**
   ```
   → Parse UX Designer comments
   → Categorize: critical, important, nice-to-have
   → Identify: specific changes vs. exploration requests
   ```

2. **Plan iteration:**
   ```markdown
   ## Iteration Plan

   **Critical (must address):**
   - [ ] Fix navigation flow from Step 2 to Step 3
   - [ ] Add error state for invalid email

   **Important (should address):**
   - [ ] Explore alternative hero layouts
   - [ ] Improve visual hierarchy on Dashboard

   **Nice-to-have (time permitting):**
   - [ ] Add micro-interactions to buttons
   ```

3. **Execute changes:**
   ```
   → Update screens per feedback
   → Generate variants for exploration items
   → Document what changed and why
   ```

4. **Re-present for review:**
   ```markdown
   ## Iteration Complete

   **Changes made:** 4 critical, 2 important
   **Variants generated:** 2 for hero layout
   **Still pending:** Micro-interactions (awaiting direction)

   **Ready for re-review?** Yes
   ```

### Workflow: Handoff to Component Building

1. **Run gap analysis:**
   ```
   → Scan all approved screens
   → Match elements against Existing DLS
   → Identify missing components
   → Classify: temporary vs. potentially canonical
   ```

2. **Generate handoff document:**
   ```markdown
   ## Prototype Handoff: [Project Name]

   ### Approved Screens
   - [x] Welcome - Approved 2024-01-15
   - [x] SignUp - Approved 2024-01-16
   - [x] Dashboard - Approved 2024-01-17

   ### Component Gaps (for Temp Component Builder)
   1. **ProgressStepper**
      - Used in: SignUp (steps 1-4)
      - Props needed: steps, currentStep, onStepClick
      - Likely canonical: Yes

   2. **MetricCard**
      - Used in: Dashboard (3 instances)
      - Props needed: label, value, trend, icon
      - Likely canonical: Yes

   ### Design Tokens Used
   - colors.primary.500, 600, 700
   - spacing.4, 6, 8
   - radius.lg
   - shadows.md

   ### Assets Needed
   - [ ] Hero illustration (request from design)
   - [ ] App icon variants
   - [ ] Empty state illustrations
   ```

3. **Invoke next phase:**
   ```
   → If gaps exist: Pass to /design-system-builder with Temp Component Builder mode
   → If no gaps: Proceed directly to implementation
   ```

---

## Prototype Structure

### Project Organization

```
/prototypes/
├── [project-name]/
│   ├── README.md           # Status, decisions, links
│   ├── requirements.json   # Parsed PRD
│   ├── screens/
│   │   ├── Welcome.tsx
│   │   ├── SignUp.tsx
│   │   ├── Dashboard.tsx
│   │   └── index.ts        # Screen exports
│   ├── flows/
│   │   ├── onboarding.ts   # Navigation flow definition
│   │   └── index.ts
│   ├── components/         # Prototype-specific components
│   │   └── PrototypeNav.tsx
│   └── iterations/
│       ├── v1/             # Initial version
│       ├── v2/             # After first feedback
│       └── approved/       # Final approved version
```

### Screen Template

```tsx
// /prototypes/[project]/screens/[ScreenName].tsx

'use client';

import { useRouter } from 'next/navigation';
import { tokens } from '@/styles/design-tokens';

// Prototype metadata
export const screenMeta = {
  name: 'ScreenName',
  description: 'Brief purpose description',
  status: 'draft' | 'in-review' | 'approved',
  lastUpdated: '2024-01-15',
  feedback: [
    { date: '2024-01-14', note: 'Initial review feedback...' }
  ],
};

// Screen component
export function ScreenName() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Screen content */}
    </div>
  );
}

// Navigation connections
export const screenFlow = {
  previous: 'Welcome',
  next: 'Dashboard',
  alternates: ['Help', 'Settings'],
};
```

---

## Integration with Design System

### Using Existing Components

```tsx
// Always check DLS first
import { Button, Input, Card } from '@/components/ui';
import { IconArrowRight } from '@/components/icons';

// Use design tokens
import { colors, spacing, typography } from '@/styles/design-tokens';
```

### Flagging New Patterns

When creating prototype-specific elements that might become components:

```tsx
// TODO: [COMPONENT_GAP] ProgressStepper
// Used in: SignUp flow (4 steps)
// Props: steps, currentStep, onStepClick
// Consider for DLS: Yes - reusable pattern
const ProgressStepper = ({ steps, current }) => (
  <div className="flex justify-between">
    {steps.map((step, i) => (
      <div
        key={i}
        className={`w-8 h-8 rounded-full flex items-center justify-center
          ${i <= current ? 'bg-primary-500 text-white' : 'bg-neutral-200'}
        `}
      >
        {i + 1}
      </div>
    ))}
  </div>
);
```

---

## Skill Orchestration

### When to Invoke Other Skills

| Scenario | Skill to Invoke |
|----------|-----------------|
| Need UX pattern guidance | `/frontend-design` |
| Creating prototype-specific icon | `/icon-generator` |
| Approved prototype has component gaps | `/design-system-builder` (Temp mode) |
| Need brand token clarification | `/brand-tokens-translator` |

### Receiving From Other Skills

| Incoming From | What to Expect |
|---------------|----------------|
| PRD Generator | Structured requirements JSON |
| Design Lead Agent | Project context, constraints, priorities |
| UX Designer (human) | Feedback, approvals, direction |

---

## Quality Checklist

### Before Presenting for Review

- [ ] All screens use design tokens (no hardcoded colors/spacing)
- [ ] Responsive considerations documented
- [ ] Navigation flows are connected
- [ ] Placeholder content is realistic
- [ ] Assumptions are documented
- [ ] Questions for reviewer are listed

### Before Handoff

- [ ] All screens marked as "approved"
- [ ] Component gap analysis complete
- [ ] Design tokens usage documented
- [ ] Asset requirements listed
- [ ] Iteration history preserved

---

## Error Prevention

### Common Mistakes to Avoid

1. **Don't create final components** - This skill creates prototypes, not production components
2. **Don't skip the review loop** - Always present for UX approval before handoff
3. **Don't hardcode values** - Always use design tokens
4. **Don't delete iterations** - Keep history in `/iterations/` folder
5. **Don't assume component exists** - Check DLS before using, flag if missing

### Validation Steps

After each workflow step, verify:
1. Screens render without errors
2. Navigation flows work correctly
3. Design tokens are applied consistently
4. Documentation is updated
5. Status reflects current state

---

## Related Skills

| Skill | Relationship |
|-------|--------------|
| `/design-system-builder` | Receives handoff for component gaps |
| `/frontend-design` | Consult for UX patterns |
| `/icon-generator` | Create prototype-specific icons |
| `/component-generator` | Delegate actual component creation |

---

## Quick Reference

```
# New prototype from requirements
1. Parse PRD → Extract screens, flows, constraints
2. Generate screen inventory
3. Create screens at requested fidelity
4. Present for UX review

# Iteration cycle
1. Receive feedback → Categorize priority
2. Plan changes → Document approach
3. Execute → Update screens, generate variants
4. Re-present for review

# Handoff
1. Run component gap analysis
2. Generate handoff document
3. Pass to /design-system-builder if gaps exist
```
