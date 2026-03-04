---
name: theme-generator
description: Generate a complete product theme from a single brand color with intelligent color recommendations
---

# Theme Generator

## When to Use

- Creating a new product theme from a brand color
- Generating a complete color palette from one hex value
- Adding a new theme to the design system
- Exploring color harmony options for a product identity

## File Ownership

| File Path | Purpose |
|-----------|---------|
| `styles/themes/{name}.ts` | Generated theme implementation |
| `styles/themes/theme-provider.tsx` | Theme registry (import + register) |
| `styles/themes/index.ts` | Theme exports barrel |

## Inputs

The user provides:
- **Brand color** (required): A single hex color (e.g. `#005151`, `#8B2252`)
- **Theme name** (optional): kebab-case identifier (e.g. `healthcare`, `fintech`)
- **Personality** (optional): Guides typography, spacing, radius, icons. One of:
  - `modern` — Clean sans-serif, moderate radius, standard spacing
  - `institutional` — Serif headings, sharp radius, compact spacing, filled icons
  - `organic` — Serif headings, soft radius, airy spacing, thin icon strokes
  - `technical` — Monospace-leaning, minimal radius, tight spacing
  - `playful` — Rounded sans-serif, large radius, generous spacing

If personality is not specified, infer from the brand color's character (warm/cool, saturated/muted, light/dark).

## Color Generation Algorithm

From the single brand color, generate the ENTIRE `ThemeColors` interface using these rules:

### Step 1: Brand Family
```
brand.default  = INPUT_COLOR
brand.darker   = darken INPUT_COLOR by 15-20% (toward black)
brand.lighter  = lighten INPUT_COLOR by 20-25% and slightly desaturate
```

### Step 2: Accent Color
Choose ONE strategy and explain the choice to the user:
- **Complementary**: Hue rotated ~180 degrees — high contrast, bold
- **Analogous**: Hue rotated ~30-40 degrees — harmonious, subtle
- **Split-complementary**: Hue rotated ~150 degrees — balanced contrast
- **Triadic**: Hue rotated ~120 degrees — vibrant, dynamic

Generate accent.default, accent.darker, accent.lighter using same darken/lighten pattern.

### Step 3: Surface Colors
```
surface.light       = Near-white tinted slightly toward brand hue (e.g. #F5F2F0 for warm, #F4F6FF for cool)
surface.lightDarker = 3-5% darker than surface.light
surface.dark        = Brand-tinted dark gray (e.g. mix brand at 15-20% into #4A4A4A)
surface.darkDarker  = 8-10% darker than surface.dark
surface.disabled    = { onLight: brand-tinted at 3% opacity, onDark: white at 20% }
surface.info/success/warning/important = Pastel tints of semantic colors
```

### Step 4: Text Colors
```
text.highEmphasis.onLight = Near-black tinted toward brand (or pure rgba(0,0,0,0.95))
text.highEmphasis.onDark  = #FFFFFF
text.lowEmphasis          = Brand-tinted at 60% opacity or explicit hex
text.disabled             = Brand-tinted at 30% opacity
text.action               = Use brand.default or accent.default for enabled/hover/active
text.success/warning/important = Standard semantic text colors (high contrast)
```

### Step 5: Border, Icon, Action Colors
Use the same opacity-pattern as Trace theme:
- Borders: `rgba(brand_rgb, 0.10/0.15/0.42)` for low/mid/high emphasis
- Icons: `rgba(brand_rgb, 0.55/0.65/0.75/0.85)` for enabled/hover/active/selected
- Actions: Can use brand.default or accent.default depending on desired contrast
- Monochrome actions: Follow Trace's black/white opacity pattern exactly

### Step 6: Status Colors (Mostly Universal)
Status colors (info, success, warning, important) should maintain semantic meaning:
- **Info**: Blue-ish (can tint toward brand if brand is cool)
- **Success**: Green (tint toward brand if brand is green-ish)
- **Warning**: Amber/orange (keep universal)
- **Important**: Red (keep universal)

For themes where brand IS one of these semantic colors, shift info to use the accent instead.

### Step 7: Badge, Avatar, DataViz, CVD
- **Badge**: Generate 9 hue-spaced colors + light variants, harmonized with brand
- **Avatar**: 8 soft pastel backgrounds
- **DataViz**: 15-stop gradient anchored to brand → accent with warm/cool spread
- **CVD**: Keep Trace's colorblind-safe palette unless brand conflicts, then adjust

### Step 8: Utility Tokens
Derive from brand:
- `hover/selected/selectedHighlight` — brand-tinted at low opacity
- `focusBorder` — use accent.default (or brand.lighter for contrast)
- `scrim` — brand-tinted at 32-36% opacity
- `scrollbar/navItemText/buttonToggleBg/chipBg` — brand-tinted opacity variants
- `tableCellHighlight` — brand-tinted highlight
- `grid` — muted brand-tinted gray

## Non-Color Token Recommendations

Based on personality, recommend:

### Typography
| Personality | Display Font | Body Font | Line Height | Letter Spacing |
|-------------|-------------|-----------|-------------|----------------|
| modern | DM Sans, Inter, or Outfit | Same as display | tight: 1.2, normal: 1.5 | heading: -0.5px, body: 0px |
| institutional | Playfair Display, Lora, or Libre Baskerville | Source Sans 3, Noto Sans | tight: 1.15, normal: 1.5 | heading: -0.3px, body: 0.1px |
| organic | Merriweather, Bitter, or Vollkorn | Nunito Sans, Lato | tight: 1.25, normal: 1.6 | heading: -0.3px, body: 0.15px |
| technical | JetBrains Mono, Space Mono | Inter, IBM Plex Sans | tight: 1.2, normal: 1.5 | heading: -0.5px, body: 0px |
| playful | Fredoka, Quicksand, or Nunito | Same as display | tight: 1.25, normal: 1.6 | heading: 0px, body: 0px |

### Border Radius
| Personality | xs | sm | md | lg | xl |
|-------------|----|----|----|----|-----|
| modern | 2px | 4px | 8px | 12px | 16px |
| institutional | 1px | 2px | 4px | 6px | 8px |
| organic | 3px | 6px | 12px | 16px | 20px |
| technical | 0px | 2px | 4px | 6px | 8px |
| playful | 4px | 8px | 16px | 24px | 32px |

### Spacing
| Personality | unit | input | button | card | section | component |
|-------------|------|-------|--------|------|---------|-----------|
| modern | 4px | 12px | 16px | 24px | 48px | 16px |
| institutional | 4px | 10px | 14px | 20px | 40px | 12px |
| organic | 4px | 14px | 18px | 28px | 56px | 20px |
| technical | 4px | 8px | 12px | 16px | 32px | 12px |
| playful | 4px | 14px | 20px | 28px | 56px | 20px |

### Icon Style
| Personality | Set | Stroke Width | Corner Style |
|-------------|-----|-------------|-------------|
| modern | outlined | 1.5 | round |
| institutional | filled | 1.5 | round |
| organic | outlined | 1.25 | round |
| technical | outlined | 1.75 | square |
| playful | duotone | 1.5 | round |

### Elevation (Shadows)
Tint all shadows with brand color RGB values. Pattern:
```
xs:  0px 1px 2px rgba(R, G, B, 0.06)
sm:  0px 1px 3px rgba(R, G, B, 0.10), 0px 1px 2px rgba(R, G, B, 0.08)
md:  0px 4px 6px -1px rgba(R, G, B, 0.10), 0px 2px 4px -1px rgba(R, G, B, 0.08)
lg:  0px 10px 15px -3px rgba(R, G, B, 0.10), 0px 4px 6px -2px rgba(R, G, B, 0.06)
xl:  0px 20px 25px -5px rgba(R, G, B, 0.12), 0px 10px 10px -5px rgba(R, G, B, 0.06)
2xl: 0px 25px 50px -12px rgba(R, G, B, 0.28)
inner: inset 0px 2px 4px rgba(R, G, B, 0.08)
brand: 0px 4px 14px rgba(R, G, B, 0.25)
brandLg: 0px 10px 25px rgba(R, G, B, 0.30)
```

## Output Workflow

### Step 1: Present Recommendations
Before generating any files, show the user:
1. The brand color analysis (hue, saturation, lightness, warm/cool)
2. The accent color recommendation with rationale (which strategy and why)
3. The personality recommendation (if not specified)
4. A summary of the key generated colors (brand, accent, surface, action)

Ask for confirmation before proceeding.

### Step 2: Generate Theme File
Create `styles/themes/{name}.ts` implementing `ProductTheme` interface fully.
- Include a header comment with brand color, accent strategy, and personality
- Follow the exact structure of existing themes (trace.ts, earth.ts, university.ts)
- Every single property from `ThemeColors` must be populated — no shortcuts

### Step 3: Register Theme
Update these files:
1. **`styles/themes/theme-provider.tsx`**:
   - Add import for the new theme
   - Add to `availableThemes` array
2. **`styles/themes/index.ts`**:
   - Add export for the new theme

### Step 4: Verify
- Run `npx tsc --noEmit styles/themes/{name}.ts` to confirm type safety
- Check that the theme appears in the theme switcher

## Accessibility Constraints

All generated color combinations MUST meet WCAG 2.1 AA contrast ratios:
- **Normal text**: 4.5:1 minimum against its background
- **Large text (18px+)**: 3:1 minimum
- **UI components**: 3:1 minimum against adjacent colors

Specifically check:
- `text.highEmphasis.onLight` against `surface.light` (must be >= 4.5:1)
- `text.lowEmphasis.onLight` against `surface.light` (must be >= 4.5:1)
- `brand.default` as text on `surface.light` (must be >= 4.5:1)
- `action.enabled` as text on `surface.light` (must be >= 4.5:1)
- White text on `brand.default` background (check if >= 4.5:1, warn if not)

If any check fails, adjust the generated color to meet the minimum ratio.

---

## User Input Required

$ARGUMENTS

---

Please provide:
- **Brand color**: A hex color (e.g. `#005151`, `#8B2252`, `#1A4B8C`)
- **Theme name** (optional): What to call this theme
- **Personality** (optional): modern, institutional, organic, technical, or playful
