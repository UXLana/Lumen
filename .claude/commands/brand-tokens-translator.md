---
name: brand-tokens-translator
description: Translate brand guidelines and design specifications into design tokens
---

# Brand Tokens Translator

## When to Use

- Importing brand colors from design files (Figma, Sketch)
- Translating typography specs to token values
- Converting spacing/sizing guidelines
- Updating existing tokens based on brand refresh
- Syncing tokens with design tools

## File Ownership

| File Path | Purpose |
|-----------|---------|
| `/styles/design-tokens.ts` | Central design token definitions |
| `/styles/variables.css` | CSS custom properties (if used) |

## Token Categories

### Colors
```ts
export const colors = {
  primary: {
    50: '#E6F7F3',
    100: '#CCF0E7',
    // ... through 900
  },
  neutral: { /* grays */ },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  }
}
```

### Typography
```ts
export const typography = {
  fontFamilies: {
    display: "'DM Sans', sans-serif",
    body: "'DM Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    // ...
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: { /* values */ }
}
```

### Spacing, Radius, Shadows
```ts
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  // ...
}

export const radius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
}

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  // ...
}
```

## Workflow

1. **Receive brand specs** (Figma link, PDF, style guide)
2. **Extract values** for colors, typography, spacing
3. **Map to token structure** following existing conventions
4. **Update design-tokens.ts** with new/modified values
5. **Verify usage** across components

## User Input Required

$ARGUMENTS

---

Please provide the brand specifications you'd like to translate:
- Design file links (Figma, Sketch)
- Color values and names
- Typography specifications
- Spacing/sizing guidelines
