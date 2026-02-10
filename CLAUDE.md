# MTR Design System - Claude Context

## Project Overview
This is the MTR Design System - a React/Next.js component library with design tokens, documentation, and tooling.

## Important Documentation
- **Agentic Architecture**: `.claude/docs/agentic-architecture.md` - The orchestration model for design system work. Update this when adding/modifying agents or skills.

## Key Directories
- `components/` - React components
- `app/` - Next.js pages and component documentation
- `styles/` - Design tokens
- `Skills/` - Skill definitions
- `.claude/commands/` - Slash command skills

## Active Skills
- `/design-system-builder` - Main orchestrator
- `/component-generator` - Create components
- `/icon-generator` - Create SVG icons
- `/figma-token-extractor` - Extract tokens from Figma files
- `/design-accessibility` - Accessibility audits
- `/frontend-design` - UX consultation

## Conventions
- Use design tokens from `styles/design-tokens.ts`
- Components follow pattern: `components/{Name}/{Name}.tsx`
- Documentation pages: `app/components/{name}/page.tsx`
