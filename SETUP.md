# Lumen Design System — Setup Guide

> Get up and running in ~15 minutes.

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Git | any | `git --version` |
| Claude Code | latest | `claude --version` |
| GitHub CLI | any | `gh --version` |

---

## 1. Clone & Install

```bash
git clone git@github.com:UXLana/Lumen.git
cd Lumen
npm install
```

---

## 2. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the design system documentation site.

---

## 3. Project Structure

```
Lumen/
├── app/                    # Next.js pages & component docs
│   ├── components/         # Component documentation pages
│   └── prototypes/         # Prototype screens
├── components/             # React components (source of truth)
│   ├── Button/
│   ├── Input/
│   ├── Avatar/
│   └── ...                 # 34 components
├── styles/
│   ├── design-tokens.ts    # Shared tokens (spacing, typography, elevation)
│   └── themes/
│       ├── theme-interface.ts   # TypeScript interface all themes implement
│       ├── theme-provider.tsx   # React Context: useTheme(), useColors()
│       ├── lumen.ts             # Primary light theme
│       ├── lumen-dark.ts        # Lumen dark variant
│       ├── eden.ts              # Coastal teal + terracotta
│       └── ...
├── .claude/
│   ├── commands/           # Claude Code skills (slash commands)
│   └── docs/               # Architecture documentation
├── .github/
│   └── CODEOWNERS          # Protected file ownership
├── Skills/                 # Skill definitions
├── CLAUDE.md               # Claude Code project instructions
└── SETUP.md                # This file
```

---

## 4. Using Design Tokens

### Shared tokens (spacing, typography, etc.)

```tsx
import { spacing, typography, elevation } from '@/styles/design-tokens';
```

### Colors (theme-aware)

```tsx
import { useColors } from '@/styles/themes/theme-provider';

function MyComponent() {
  const colors = useColors();
  return <div style={{ color: colors.text.highEmphasis.onLight }} />;
}
```

> **Do not** import colors directly from `design-tokens.ts` — use `useColors()` so themes work correctly.

---

## 5. Component Conventions

Components live in `components/{Name}/` and follow this pattern:

```
components/Button/
├── Button.tsx       # Component implementation
└── index.ts         # Re-export
```

Documentation pages live in `app/components/{name}/page.tsx`.

---

## 6. Claude Code Setup (AI-Assisted Workflow)

The design system includes Claude Code skills for AI-assisted development.

### Available slash commands

| Command | Purpose |
|---------|---------|
| `/design-system-builder` | Main orchestrator — start here for any design system work |
| `/component-generator` | Generate a new React component with tokens & types |
| `/icon-generator` | Create SVG icons (outline + filled variants) |
| `/figma-token-extractor` | Pull tokens from Figma into code |
| `/design-accessibility` | Run WCAG 2.2 AA / Section 508 audit |
| `/theme-generator` | Generate a complete theme from one brand color |
| `/prototype-builder` | Build UI prototypes from specs or descriptions |
| `/ux-brief-generator` | Compile UX briefs with gap analysis |
| `/frontend-design` | UX design consultation & polished UI code |
| `/brand-tokens-translator` | Translate brand guidelines into design tokens |
| `/confluence-to-prototype-spec` | Compile Confluence pages into prototype specs |
| `/design-brief-generator` | Generate structured design briefs / PRDs |
| `/design-lead-thought-partner` | Strategic design thinking partner |

### Optional: Figma MCP integration

To connect Claude Code to Figma:

```bash
claude mcp add figma-context-mcp -- npx figma-context-mcp --stdio
```

Then set your Figma API key:

```bash
# In ~/.claude.json, add under the MCP server config:
# env: { "FIGMA_API_KEY": "your-figma-api-key" }
```

> Use `FIGMA_API_KEY` (not `FIGMA_API_TOKEN`). Get one at https://www.figma.com/developers/api#access-tokens

---

## 7. Theme System

The design system supports multiple product themes. Each theme implements the `ThemeColors` interface in `styles/themes/theme-interface.ts`.

### Current themes

| Theme | File | Description |
|-------|------|-------------|
| Lumen | `lumen.ts` | Primary light theme |
| Lumen Dark | `lumen-dark.ts` | Lumen dark variant |
| Eden | `eden.ts` | Coastal teal + terracotta, full-pill controls |
| Foliage | `foliage.ts` | Forest green + copper, editorial serif |
| Foliage Dark | `foliage-dark.ts` | Moss + amber on charcoal |
| Pampas | `pampas.ts` | Terracotta + sage on sandy paper |
| Fall | `fall.ts` | Brown + slate-teal, classic serif |
| Spring | `spring.ts` | Meadow green + ochre, airy |
| Rainy Night | `rainy-night.ts` | Cool blue surfaces, warm orange pop |

### Token sync workflow (Figma → Code)

1. Designer updates colors in Figma
2. Run `/figma-token-extractor` to pull values
3. Update the relevant theme file in `styles/themes/`
4. Update `styles/tokens-studio-colors.json` for Tokens Studio plugin

---

## 8. File Ownership & Permissions

Certain files are owned by the Design Lead and require PR review to change.

### Protected paths (see `.github/CODEOWNERS`)

- `.claude/commands/` — Skills and slash commands
- `Skills/` — Skill definitions
- `.claude/docs/` — Architecture documentation
- `CLAUDE.md` — Project instructions
- `styles/design-tokens.ts` — Shared design tokens
- `styles/themes/` — Theme definitions

### For team members

- **Do not** modify files in the protected paths without approval
- **Do** create personal Claude skills in your own `~/.claude/commands/` directory
- All PRs touching protected paths require Code Owner review

---

## 9. Key Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # Run linter
```

---

## 10. Architecture Reference

For the full agentic architecture (orchestrator, skills, council agents), see:

`.claude/docs/agentic-architecture.md`

---

## Questions?

Reach out to Lana Holston (@UXLana) — Design Lead, Lumen Design System.
