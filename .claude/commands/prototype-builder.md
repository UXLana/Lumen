---
name: prototype-builder
description: Generate and iterate on UI prototypes from requirements, creating draft screens/flows and iterating until approved
---

# Prototype Builder

## When to Use

- Creating wireframes, mockups, or screen layouts
- Exploring user flows and navigation
- Prototyping new features before implementation
- Iterating on UI designs based on feedback

## Workflow

1. **Parse Requirements**: Extract screens, flows, and constraints from PRD/requirements
2. **Generate Screen Inventory**: List all screens needed with priorities
3. **Create Screens**: Generate at requested fidelity (wireframe, low-fi, high-fi)
4. **Present for Review**: Document assumptions and questions
5. **Iterate**: Refine based on UX feedback
6. **Handoff**: Run component gap analysis when approved

## File Locations

- `/prototypes/[project]/screens/` - Individual screen components
- `/prototypes/[project]/flows/` - User flow definitions
- `/prototypes/[project]/README.md` - Status and documentation

## Fidelity Levels

- **Wireframe**: Gray boxes, structure only
- **Low-Fidelity**: Basic styling, placeholder content
- **High-Fidelity**: Production-like, real content, animations

## Integration

- Always use design tokens from `@/styles/design-tokens`
- Check existing DLS components before creating new ones
- Flag component gaps with `// TODO: [COMPONENT_GAP]` comments
- After approval, handoff to `/design-system-builder` for component creation

## User Input Required

$ARGUMENTS

---

Please proceed with prototype creation based on the provided requirements. Ask clarifying questions if needed about:
- Target fidelity level
- Device/breakpoints
- Specific screens to prioritize
