# UX Brief Completeness Scoring

## Overview

The completeness score evaluates how ready a UX brief is for design work to begin. It does NOT measure quality of the design solution — it measures whether the team has enough information to make informed design decisions.

A score of 100% is rare and not always necessary. The score's primary value is surfacing gaps so the team can make conscious decisions about what to research vs. what to accept as unknown.

## Scoring Dimensions

### 1. Problem Clarity (20 points)

| Points | Criteria |
|--------|----------|
| 0-5 | No problem statement, or vague language ("improve the experience") |
| 6-10 | Problem statement exists but lacks specificity or evidence |
| 11-15 | Clear problem statement backed by at least one data source |
| 16-20 | Specific, evidence-backed problem statement with multiple supporting data points; no solution-prescriptive language |

**Deductions**:
- -5 if problem statement prescribes a specific UI solution
- -3 if problem is framed only from business perspective (no user framing)
- -2 if "everyone" is listed as the affected user group

### 2. User Context (20 points)

| Points | Criteria |
|--------|----------|
| 0-5 | No user information, or only demographic labels ("millennials") |
| 6-10 | Basic persona descriptions without behavioral insights |
| 11-15 | Personas with behavioral data; at least 1 user need statement |
| 16-20 | Research-backed personas, 2+ user need statements in NN/g format, behavioral insights with evidence |

**Deductions**:
- -5 if personas are assumption-based with no research backing (flag as [Assumption])
- -3 if user needs are stated as features rather than outcomes
- -2 if only one user type is considered for a multi-user system

**NN/g User Need Statement format**:
> **[Persona]** needs **[need/goal]** because **[insight/motivation]**

### 3. Success Metrics (15 points)

| Points | Criteria |
|--------|----------|
| 0-3 | No success criteria defined |
| 4-7 | Vague goals ("improve usability") without measurable targets |
| 8-11 | At least 1 measurable metric with target value |
| 12-15 | Primary + secondary metrics, baseline values, measurement method defined |

**Deductions**:
- -4 if all metrics are business-only (revenue, conversion) with no user-outcome metrics
- -3 if no baseline is established (can't measure improvement without knowing current state)
- -2 if measurement method is undefined ("we'll know it when we see it")

### 4. Scope & Constraints (15 points)

| Points | Criteria |
|--------|----------|
| 0-3 | No scope definition |
| 4-7 | High-level scope but no explicit out-of-scope items or constraints |
| 8-11 | In/out of scope defined; at least 2 constraint types documented |
| 12-15 | Clear boundaries with technical, brand, legal, accessibility, and timeline constraints all addressed |

**Constraint types to check**:
- Technical (platform, browser support, performance, API limitations)
- Brand/Visual (design system adherence, brand guidelines)
- Legal/Compliance (privacy regulations, accessibility standards, industry rules)
- Accessibility (WCAG level, assistive technology support)
- Timeline (deadlines, sprint boundaries, dependencies)
- Resource (team size, skill availability)

### 5. Background & Evidence (15 points)

| Points | Criteria |
|--------|----------|
| 0-3 | No current state description or supporting evidence |
| 4-7 | Basic description of what exists today |
| 8-11 | Current state + analytics data OR competitive context |
| 12-15 | Current state, analytics baseline, competitive landscape, and existing research all present |

**Evidence sources that contribute**:
- Analytics / telemetry data
- User research findings (interviews, usability tests, surveys)
- Customer support ticket analysis
- Competitive analysis
- Existing design artifacts or prototypes
- Technical architecture documentation

### 6. Actionable Next Steps (15 points)

| Points | Criteria |
|--------|----------|
| 0-3 | No next steps or only "start designing" |
| 4-7 | List of deliverables without owners, timing, or phases |
| 8-11 | Phased deliverables with general ownership (roles, not just names) |
| 12-15 | Phased steps with owners, output formats, decision gates, open questions with resolution methods |

**What makes next steps actionable**:
- Each step has a clear owner (by role)
- Each step has a defined output format (wireframe, prototype, spec)
- Dependencies between steps are explicit
- Open questions are separated from defined requirements
- Decision gates identify who decides and when

## Score Interpretation

| Score Range | Status | Recommendation |
|-------------|--------|---------------|
| 85-100% | Ready for design | Proceed to design exploration |
| 70-84% | Mostly ready | Address top 1-2 gaps, then proceed |
| 50-69% | Needs work | Conduct targeted research to fill major gaps |
| 30-49% | Significant gaps | Discovery phase needed before design |
| 0-29% | Insufficient | Major research and stakeholder alignment needed |

## Visual Display Format

```
Completeness: 72% ████████████████░░░░░░

Problem Clarity    [16/20] ████████████████░░░░ Strong
User Context       [12/20] ████████████░░░░░░░░ Moderate — personas need research backing
Success Metrics    [ 8/15] ███████████░░░░░░░░░ Moderate — needs baseline data
Scope & Constraints[13/15] █████████████████░░░ Strong
Background         [10/15] █████████████░░░░░░░ Moderate — missing competitive analysis
Next Steps         [13/15] █████████████████░░░ Strong
```
