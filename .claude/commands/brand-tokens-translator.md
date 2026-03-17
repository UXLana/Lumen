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
2. **If extracting from a website**: use `curl` to fetch full HTML (WebFetch often fails on SPAs). Look for the local project first (`~/Desktop/` etc.) — local CSS/tailwind.config is far more reliable than scraping.
3. **Identify brand identity visually, not by CSS var names** — `--primary` in a codebase often maps to link/button accent, not the dominant brand color. Look at the screenshot/OG image and identify the 2-3 dominant colors (background, text, accent). Ask the user to confirm the brand palette before generating 200+ tokens.
4. **Map to ThemeColors interface** — every property must be populated
5. **Create or update theme file** in `styles/themes/[name].ts`
6. **Register theme** in `styles/themes/theme-provider.tsx` and `styles/themes/index.ts`
7. **Register fonts in `app/layout.tsx`** — if the theme uses fonts not already imported, add them via `next/font/google` with a `--font-*` CSS variable. Use `var(--font-*)` in the theme's typography.fontFamilies so Next.js font optimization works.
8. **Check `globals.css`** — verify `body` background/text use themed `--mtr-*` vars, not legacy hardcoded vars.
9. **Clear `.next` cache** — run `rm -rf .next` before restarting the dev server after theme changes to avoid stale cache errors.
10. **Verify** with `npx tsc --noEmit` for type safety

### For Typography/Spacing Updates
1. **Receive specs** (font names, size scale, spacing values)
2. **Update shared tokens** in `styles/design-tokens.ts`
3. **Register any new fonts** in `app/layout.tsx` via `next/font/google`
4. **Verify** no components break with new values

### For Figma Variable Sync
1. **Use `/figma-token-extractor`** to pull variables from Figma
2. **Review extracted values** against current tokens
3. **Update theme files** with new values
4. **Run type check** to ensure interface compliance

## Common Pitfalls

- **SPA websites**: WebFetch returns empty shells for React/Vite/Next.js sites. Always try `curl` first, or check for a local copy of the project.
- **CSS `--primary` ≠ brand color**: The dominant visual color (what users associate with the brand) may differ from what's labeled "primary" in CSS. Use screenshots to confirm.
- **Font registration**: Creating a theme with new fonts is not enough — fonts must also be loaded in `app/layout.tsx` via `next/font/google` and exposed as `--font-*` CSS variables.
- **Legacy CSS vars in globals.css**: Body background/text may use old non-themed vars (`--color-neutral-*`). These must be updated to `--mtr-*` vars for theme switching to work.
- **`.next` cache**: Always clear `.next/` after changing `layout.tsx` or adding new theme imports. Stale caches cause `Cannot find module` errors.

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
