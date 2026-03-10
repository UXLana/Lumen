---
name: brand-tokens-translator
description: Translate brand guidelines and design specifications into design tokens
---

# Brand Tokens Translator

## When to Use

- Importing brand colors from design files (Figma, Sketch, PDF)
- Translating typography specs to token values
- Converting spacing/sizing guidelines to token scale
- Updating existing tokens based on brand refresh
- Syncing tokens with design tools (Tokens Studio, Figma Variables)

## File Ownership

| File Path | Purpose |
|-----------|---------|
| `styles/design-tokens.ts` | Central design token definitions (CSS-variable-backed) |
| `styles/themes/[theme].ts` | Theme-specific color values (implements ThemeColors) |
| `styles/themes/theme-interface.ts` | TypeScript interface all themes must implement |

## Token Architecture

This project uses a **themed token system**:
- `styles/themes/theme-interface.ts` defines the `ThemeColors` TypeScript interface
- Each theme file (e.g., `trace.ts`, `earth.ts`) implements that interface with concrete values
- `design-tokens.ts` exports CSS-variable-backed references that auto-update when themes switch
- Components import from `@/styles/design-tokens` and get theme-aware values automatically

### Color Token Structure (from ThemeColors interface)

```ts
colors.brand.default      // Primary brand color
colors.brand.darker       // Darker variant
colors.brand.lighter      // Lighter variant

colors.surface.light      // Primary light background
colors.surface.lightDarker // Secondary light background
colors.surface.dark       // Primary dark background

colors.text.highEmphasis.onLight  // Primary text on light backgrounds
colors.text.highEmphasis.onDark   // Primary text on dark backgrounds
colors.text.lowEmphasis.onLight   // Secondary text
colors.text.action.enabled        // Interactive text

colors.border.lowEmphasis   // Subtle borders
colors.border.midEmphasis   // Standard borders
colors.border.highEmphasis  // Strong borders

colors.status.info / .success / .warning / .important  // Semantic colors
```

### Shared Tokens (non-themed)

```ts
// Typography
fontFamilies.primary     // 'DM Sans', sans-serif
fontFamilies.mono        // 'JetBrains Mono', monospace
typography.display.*     // Display sizes (xl, lg, md, sm)
typography.heading.*     // Heading sizes
typography.body.*        // Body sizes (lg, md, sm)
typography.label.*       // Label sizes
fontWeights.regular / .medium / .semiBold / .bold

// Spacing (semantic)
spacing.none / .micro / .xxs / .xs / .sm / .md / .lg / .xl / .xxl / .section

// Border Radius
borderRadiusSemantics.interactive / .container / .card / .pill / .circle

// Elevation
shadows.xs / .sm / .md / .lg / .xl
```

## Workflow

### For Color/Brand Updates
1. **Receive brand specs** (Figma link, PDF, style guide, hex values)
2. **Map to ThemeColors interface** — every property must be populated
3. **Create or update theme file** in `styles/themes/[name].ts`
4. **Register theme** in `styles/themes/theme-provider.tsx` and `styles/themes/index.ts`
5. **Verify** with `npx tsc --noEmit` for type safety

### For Typography/Spacing Updates
1. **Receive specs** (font names, size scale, spacing values)
2. **Update shared tokens** in `styles/design-tokens.ts`
3. **Verify** no components break with new values

### For Figma Variable Sync
1. **Use `/figma-token-extractor`** to pull variables from Figma
2. **Review extracted values** against current tokens
3. **Update theme files** with new values
4. **Run type check** to ensure interface compliance

## Naming Conventions

| Source Format | Token Path |
|---------------|-----------|
| `color/brand/primary` | `colors.brand.default` |
| `color/surface/default` | `colors.surface.light` |
| `color/text/high-emphasis` | `colors.text.highEmphasis.onLight` |
| `mtr_sys_color_*` | Map to closest ThemeColors property |
| Kebab-case | camelCase (`high-emphasis` → `highEmphasis`) |

## User Input Required

$ARGUMENTS

---

Please provide the brand specifications to translate:
- Design file links (Figma, Sketch) or brand PDF
- Color values and names
- Typography specifications (fonts, sizes, weights)
- Spacing/sizing guidelines
- Whether this is a new theme or updating an existing one
