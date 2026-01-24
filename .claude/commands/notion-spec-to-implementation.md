---
name: notion-spec-to-implementation
description: Convert Notion specifications and PRDs into implementable design and code
---

# Notion Spec to Implementation

## When to Use

- Translating Notion PRDs into technical specs
- Converting feature specs to implementation tasks
- Extracting requirements from Notion pages
- Creating implementation plans from product docs

## Workflow

1. **Fetch Notion Content**: Read the Notion page/database
2. **Parse Requirements**: Extract features, constraints, acceptance criteria
3. **Structure Specs**: Organize into implementable chunks
4. **Generate Tasks**: Create development tasks with clear scope
5. **Handoff**: Pass to appropriate skills for implementation

## Input Types

### PRD (Product Requirements Document)
- Feature descriptions
- User stories
- Acceptance criteria
- Success metrics

### Design Specs
- Component specifications
- Interaction descriptions
- Visual requirements
- Responsive behavior

### Technical Specs
- API contracts
- Data models
- Integration requirements
- Performance criteria

## Output Format

```markdown
# Implementation Plan: [Feature Name]

## Overview
[Summary from Notion]

## Requirements
### Functional
- [ ] Requirement 1
- [ ] Requirement 2

### Non-functional
- [ ] Performance
- [ ] Accessibility

## Implementation Tasks
1. **Task 1**: [Description]
   - Files: [affected files]
   - Depends on: [dependencies]

2. **Task 2**: [Description]
   - Files: [affected files]
   - Depends on: [dependencies]

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2

## Notes
[Additional context or considerations]
```

## Integration

After parsing, may invoke:
- `/prototype-builder` for UI prototyping
- `/component-generator` for component creation
- `/design-system-builder` for design system updates

## User Input Required

$ARGUMENTS

---

Please provide:
- Notion page URL or content
- What type of spec this is (PRD, design spec, technical spec)
- Any specific focus areas
