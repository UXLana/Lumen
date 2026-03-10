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
- `/confluence-to-prototype-spec` - Compile Confluence pages into structured prototype specs
- `/prototype-builder` - Build prototypes from specs, Confluence, or verbal descriptions
- `/ux-brief-generator` - Research-first UX brief compiler with gap analysis and completeness scoring
- `/component-documenter` - Generate dual-format (human + LLM) component documentation with YAML frontmatter, prop tables, token maps, and accessibility specs
- `/theme-generator` - Generate a complete product theme from a single brand color with intelligent color recommendations

## Conventions
- Use design tokens from `styles/design-tokens.ts`
- Components follow pattern: `components/{Name}/{Name}.tsx`
- Documentation pages: `app/components/{name}/page.tsx`
