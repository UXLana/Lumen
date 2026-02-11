---
name: figma-token-extractor
description: Extract design tokens from Figma files and add them to the design system via design-system-builder
---

# Figma Token Extractor

## When to Use

- Importing design tokens directly from Figma files
- Syncing design system tokens with Figma source of truth
- Extracting colors, typography, spacing, and effects from Figma
- Updating tokens after a design system refresh in Figma
- Onboarding a new Figma design system

## File Ownership

| File Path | Purpose |
|-----------|---------|
| `/styles/design-tokens.ts` | Central design token definitions |
| `/styles/variables.css` | CSS custom properties (if used) |

## Workflow

### Phase 1: Extract from Figma

1. **Get Figma File Context**
   - User provides Figma file URL or file key
   - Extract `fileKey` and optionally `nodeId` from the URL
   - URL format: `https://figma.com/design/:fileKey/:fileName?node-id=X-X`

2. **Fetch Variable Definitions**
   ```
   → Use get_variable_defs tool with fileKey and nodeId
   ```
   This returns variable mappings like:
   ```json
   {
     "icon/default/secondary": "#949494",
     "color/brand/primary": "#127A56"
   }
   ```

3. **Get Design Context** (optional, for component-level tokens)
   ```
   → Use get_design_context tool for specific node tokens
   ```

4. **Get Screenshot** (optional, for visual reference)
   ```
   → Use get_screenshot tool to capture visual context
   ```

### Phase 2: Transform Tokens

Transform extracted Figma variables into the design system token structure:

#### Color Tokens
```ts
// Figma: color/brand/primary → design-tokens: colors.brand.primary
// Figma: color/text/high-emphasis → design-tokens: colors.text.highEmphasis
```

#### Typography Tokens
```ts
// Figma: typography/display/xl → design-tokens: typography.display.xl
// Figma: font-weight/semibold → design-tokens: fontWeights.semibold
```

#### Spacing Tokens
```ts
// Figma: spacing/4 → design-tokens: spacing[4]
// Figma: spacing/lg → design-tokens: spacingSemantics.lg
```

#### Effect Tokens
```ts
// Figma: shadow/md → design-tokens: shadows.md
// Figma: blur/sm → design-tokens: (new category if needed)
```

### Phase 3: Integrate into Design System

After extracting and transforming tokens, invoke the design-system-builder:

```
→ Invoke /design-system-builder with:
   - New token values to add/update in design-tokens.ts
   - Any new token categories that need documentation pages
   - Update Figma source reference in design-tokens.ts header
```

## Token Naming Convention

### Figma → Design System Mapping

| Figma Variable Path | Design Token Path |
|---------------------|-------------------|
| `color/brand/primary` | `colors.brand.primary` |
| `color/surface/default` | `colors.surface.default` |
| `color/text/high-emphasis` | `colors.text.highEmphasis` |
| `typography/body/md` | `typography.body.md` |
| `font-family/display` | `fontFamilies.display` |
| `font-weight/semibold` | `fontWeights.semibold` |
| `spacing/4` | `spacing[4]` |
| `radius/md` | `borderRadius.md` |
| `shadow/lg` | `shadows.lg` |

### Naming Rules

1. **Kebab-case to camelCase**: `high-emphasis` → `highEmphasis`
2. **Slash to dot notation**: `color/brand/primary` → `colors.brand.primary`
3. **Numeric keys**: Keep as numbers for spacing scale (`spacing[4]`)
4. **Preserve semantic meaning**: Keep descriptive names from Figma

## Token Categories to Extract

### Required Categories
- **Colors**: Brand, surface, text, semantic (success, warning, error, info)
- **Typography**: Font families, weights, sizes, line heights
- **Spacing**: Numeric scale (0-96) and semantic aliases
- **Border Radius**: Scale and semantic aliases
- **Shadows**: Elevation levels

### Optional Categories
- **Z-Index**: Layer ordering
- **Breakpoints**: Responsive design
- **Transitions**: Animation timing
- **Component-specific**: Button, input, card tokens

## Conflict Resolution

When extracted tokens conflict with existing tokens:

1. **Prefer Figma values** for visual properties (colors, spacing)
2. **Preserve existing** semantic aliases unless explicitly changed
3. **Document changes** in design-tokens.ts header comment
4. **Flag breaking changes** for user review

## Error Handling

| Error | Action |
|-------|--------|
| Invalid file URL | Prompt user for correct Figma URL format |
| No access to file | Verify user has Figma access, check whoami tool |
| No variables found | Try get_design_context for inline styles instead |
| Duplicate token names | Prompt user to choose merge strategy |

## Post-Extraction Checklist

- [ ] All color tokens extracted with correct hex values
- [ ] Typography scale complete (display, heading, body, label)
- [ ] Spacing scale matches Figma (4px base)
- [ ] Border radius values captured
- [ ] Shadow tokens include all elevation levels
- [ ] Source Figma file URL updated in design-tokens.ts
- [ ] design-system-builder invoked to update documentation

## User Input Required

$ARGUMENTS

---

Please provide the Figma file to extract tokens from:
- **Figma URL**: The full URL to the Figma file or specific frame
  - Example: `https://www.figma.com/design/gc68toINDS8Ovsan5aVPS2/Trace-Design-System-v2.0`
- **Token categories** (optional): Which tokens to extract (colors, typography, spacing, all)
- **Merge strategy** (optional): How to handle conflicts (replace, merge, prompt)

The skill will:
1. Connect to Figma and extract variable definitions
2. Transform them to match the design system structure
3. Update `/styles/design-tokens.ts` with new values
4. Invoke `/design-system-builder` to update documentation pages
