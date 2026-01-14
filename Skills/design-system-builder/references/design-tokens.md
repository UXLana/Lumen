# MTR Design System - Token Reference

Complete inventory of design tokens available in `@/styles/design-tokens`.

## Import Pattern

```tsx
import {
  colors,
  typography,
  fontFamilies,
  fontWeights,
  spacing,
  spacingSemantics,
  borderRadius,
  borderRadiusSemantics,
  shadows,
  shadowSemantics,
  breakpoints,
  mediaQueries,
  zIndex,
  transitions,
  transitionPresets,
  // Component-specific tokens
  avatar,
  button,
  tab,
  banner,
} from '@/styles/design-tokens'
```

## Colors

### Brand Colors
```tsx
colors.brand.primary      // '#13352C' - Main brand color
colors.brand.primaryLight // '#1A4A3D'
colors.brand.primaryDark  // '#0D2920'
```

### Primary Palette
```tsx
colors.primary[50]   // '#E6F0ED' - Lightest
colors.primary[100]  // '#C2DAD3'
colors.primary[200]  // '#9AC3B7'
colors.primary[300]  // '#72AC9B'
colors.primary[400]  // '#539A85'
colors.primary[500]  // '#13352C' - Base (same as brand.primary)
colors.primary[600]  // '#2F7A65'
colors.primary[700]  // '#276956'
colors.primary[800]  // '#1F5847'
colors.primary[900]  // '#0D2920' - Darkest
```

### Secondary Palette (Amber/Gold)
```tsx
colors.secondary[50]  // '#FFF8E1'
colors.secondary[100] // '#FFECB3'
colors.secondary[200] // '#FFE082'
colors.secondary[300] // '#FFD54F'
colors.secondary[400] // '#FFCA28'
colors.secondary[500] // '#FFC107'
colors.secondary[600] // '#FFB300'
colors.secondary[700] // '#FFA000'
colors.secondary[800] // '#FF8F00'
colors.secondary[900] // '#FF6F00'
```

### Neutral Colors
```tsx
colors.neutral[0]    // '#FFFFFF' - White
colors.neutral[50]   // '#FAFAFA'
colors.neutral[100]  // '#F5F5F5'
colors.neutral[200]  // '#EEEEEE'
colors.neutral[300]  // '#E0E0E0'
colors.neutral[400]  // '#BDBDBD'
colors.neutral[500]  // '#9E9E9E'
colors.neutral[600]  // '#757575'
colors.neutral[700]  // '#616161'
colors.neutral[800]  // '#424242'
colors.neutral[900]  // '#212121'
colors.neutral[1000] // '#000000' - Black
```

### Semantic Colors
```tsx
// Success
colors.semantic.success.light    // '#E8F5E9'
colors.semantic.success.main     // '#4CAF50'
colors.semantic.success.dark     // '#2E7D32'
colors.semantic.success.contrast // '#FFFFFF'

// Warning
colors.semantic.warning.light    // '#FFF3E0'
colors.semantic.warning.main     // '#FF9800'
colors.semantic.warning.dark     // '#E65100'
colors.semantic.warning.contrast // '#000000'

// Error
colors.semantic.error.light    // '#FFEBEE'
colors.semantic.error.main     // '#F44336'
colors.semantic.error.dark     // '#C62828'
colors.semantic.error.contrast // '#FFFFFF'

// Info
colors.semantic.info.light    // '#E3F2FD'
colors.semantic.info.main     // '#2196F3'
colors.semantic.info.dark     // '#1565C0'
colors.semantic.info.contrast // '#FFFFFF'
```

### Text Colors
```tsx
// On Light backgrounds
colors.text.highEmphasis   // 'rgba(0, 0, 0, 0.95)'
colors.text.mediumEmphasis // 'rgba(0, 0, 0, 0.70)'
colors.text.lowEmphasis    // 'rgba(0, 0, 0, 0.50)'
colors.text.disabled       // 'rgba(0, 0, 0, 0.38)'

// On Dark backgrounds
colors.text.highEmphasisOnDark   // '#FFFFFF'
colors.text.mediumEmphasisOnDark // 'rgba(255, 255, 255, 0.74)'
colors.text.lowEmphasisOnDark    // 'rgba(255, 255, 255, 0.60)'
colors.text.disabledOnDark       // 'rgba(255, 255, 255, 0.38)'
```

### Background Colors
```tsx
colors.background.default  // '#FFFFFF'
colors.background.paper    // '#FAFAFA'
colors.background.elevated // '#FFFFFF'
colors.background.dark     // '#13352C'
colors.background.overlay  // 'rgba(0, 0, 0, 0.5)'
```

### Border Colors
```tsx
colors.border.light // 'rgba(0, 0, 0, 0.12)'
colors.border.main  // 'rgba(0, 0, 0, 0.23)'
colors.border.dark  // 'rgba(0, 0, 0, 0.42)'
colors.border.focus // '#13352C'
```

## Typography

### Font Families
```tsx
fontFamilies.display // '"DM Sans", sans-serif'
fontFamilies.body    // '"DM Sans", sans-serif'
fontFamilies.mono    // '"JetBrains Mono", "Fira Code", monospace'
```

### Font Weights
```tsx
fontWeights.regular  // 400
fontWeights.medium   // 500
fontWeights.semibold // 600
fontWeights.bold     // 700
```

### Typography Scales

#### Display (Large Headlines)
```tsx
typography.display['2xl'] // 64px / 76px / -1.5px
typography.display.xl     // 51px / 60px / -0.8px
typography.display.lg     // 41px / 48px / -0.25px
typography.display.md     // 32px / 40px / -0.7px
typography.display.sm     // 26px / 32px / -0.5px
typography.display.xs     // 23px / 28px / -0.3px
```

#### Headings
```tsx
typography.heading.h1 // 32px / 40px / -0.5px / semibold
typography.heading.h2 // 28px / 36px / -0.3px / semibold
typography.heading.h3 // 24px / 32px / -0.2px / semibold
typography.heading.h4 // 20px / 28px / -0.1px / semibold
typography.heading.h5 // 18px / 24px / 0px / semibold
typography.heading.h6 // 16px / 24px / 0px / semibold
```

#### Body Text
```tsx
typography.body.xl // 20px / 30px / regular
typography.body.lg // 18px / 28px / regular
typography.body.md // 16px / 24px / regular
typography.body.sm // 14px / 20px / regular
typography.body.xs // 12px / 16px / regular
```

#### Labels
```tsx
typography.label.lg // 16px / 24px / medium
typography.label.md // 14px / 20px / medium
typography.label.sm // 12px / 16px / medium
```

#### Code
```tsx
typography.code.lg // 16px / 24px / mono
typography.code.md // 14px / 20px / mono
typography.code.sm // 12px / 16px / mono
```

## Spacing

### Numeric Scale
```tsx
spacing[0]  // '0px'
spacing[1]  // '4px'
spacing[2]  // '8px'
spacing[3]  // '12px'
spacing[4]  // '16px'
spacing[5]  // '20px'
spacing[6]  // '24px'
spacing[7]  // '28px'
spacing[8]  // '32px'
spacing[9]  // '36px'
spacing[10] // '40px'
spacing[11] // '44px'
spacing[12] // '48px'
spacing[14] // '56px'
spacing[16] // '64px'
spacing[20] // '80px'
spacing[24] // '96px'
// ... continues to spacing[96] = '384px'
```

### Semantic Aliases
```tsx
spacingSemantics.none // 0px
spacingSemantics.xs   // 4px
spacingSemantics.sm   // 8px
spacingSemantics.md   // 16px
spacingSemantics.lg   // 24px
spacingSemantics.xl   // 32px
spacingSemantics['2xl'] // 48px
spacingSemantics['3xl'] // 64px
spacingSemantics['4xl'] // 96px

// Component-specific
spacingSemantics.inputPadding     // 12px
spacingSemantics.buttonPadding    // 16px
spacingSemantics.cardPadding      // 24px
spacingSemantics.sectionPadding   // 48px
spacingSemantics.pagePadding      // 64px
spacingSemantics.gutter           // 16px
spacingSemantics.containerPadding // 24px
```

## Border Radius

### Scale
```tsx
borderRadius.none  // '0px'
borderRadius.xs    // '2px'
borderRadius.sm    // '4px'
borderRadius.md    // '8px'
borderRadius.lg    // '12px'
borderRadius.xl    // '16px'
borderRadius['2xl'] // '24px'
borderRadius['3xl'] // '32px'
borderRadius.full  // '9999px' (pill)
```

### Semantic Aliases
```tsx
borderRadiusSemantics.button // 8px (md)
borderRadiusSemantics.input  // 8px (md)
borderRadiusSemantics.card   // 12px (lg)
borderRadiusSemantics.modal  // 16px (xl)
borderRadiusSemantics.badge  // 9999px (full)
borderRadiusSemantics.avatar // 9999px (full)
borderRadiusSemantics.chip   // 9999px (full)
```

## Shadows

### Scale
```tsx
shadows.none  // 'none'
shadows.xs    // '0px 1px 2px rgba(0, 0, 0, 0.05)'
shadows.sm    // '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)'
shadows.md    // '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)'
shadows.lg    // '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)'
shadows.xl    // '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)'
shadows['2xl'] // '0px 25px 50px -12px rgba(0, 0, 0, 0.25)'
shadows.inner // 'inset 0px 2px 4px rgba(0, 0, 0, 0.06)'
shadows.brand   // '0px 4px 14px rgba(19, 53, 44, 0.25)'
shadows.brandLg // '0px 10px 25px rgba(19, 53, 44, 0.3)'
```

### Semantic Aliases
```tsx
shadowSemantics.card        // sm
shadowSemantics.cardHover   // md
shadowSemantics.dropdown    // lg
shadowSemantics.modal       // xl
shadowSemantics.button      // xs
shadowSemantics.buttonHover // sm
shadowSemantics.input       // none
shadowSemantics.inputFocus  // '0px 0px 0px 3px ${colors.primary[100]}'
```

## Breakpoints

```tsx
breakpoints.xs   // '320px'
breakpoints.sm   // '640px'
breakpoints.md   // '768px'
breakpoints.lg   // '1024px'
breakpoints.xl   // '1280px'
breakpoints['2xl'] // '1536px'
```

### Media Queries
```tsx
mediaQueries.xs     // '@media (min-width: 320px)'
mediaQueries.sm     // '@media (min-width: 640px)'
mediaQueries.md     // '@media (min-width: 768px)'
mediaQueries.lg     // '@media (min-width: 1024px)'
mediaQueries.xl     // '@media (min-width: 1280px)'
mediaQueries['2xl'] // '@media (min-width: 1536px)'

// Max-width
mediaQueries.mobile  // '@media (max-width: 767px)'
mediaQueries.tablet  // '@media (min-width: 768px) and (max-width: 1023px)'
mediaQueries.desktop // '@media (min-width: 1024px)'

// Feature
mediaQueries.hover         // '@media (hover: hover)'
mediaQueries.reducedMotion // '@media (prefers-reduced-motion: reduce)'
mediaQueries.dark          // '@media (prefers-color-scheme: dark)'
```

## Z-Index

```tsx
zIndex.hide     // -1
zIndex.base     // 0
zIndex.dropdown // 100
zIndex.sticky   // 200
zIndex.header   // 300
zIndex.overlay  // 400
zIndex.modal    // 500
zIndex.popover  // 600
zIndex.tooltip  // 700
zIndex.toast    // 800
zIndex.max      // 9999
```

## Transitions

### Durations
```tsx
transitions.duration.instant // '0ms'
transitions.duration.fast    // '100ms'
transitions.duration.normal  // '200ms'
transitions.duration.slow    // '300ms'
transitions.duration.slower  // '500ms'
```

### Timing Functions
```tsx
transitions.timing.linear    // 'linear'
transitions.timing.ease      // 'ease'
transitions.timing.easeIn    // 'ease-in'
transitions.timing.easeOut   // 'ease-out'
transitions.timing.easeInOut // 'ease-in-out'
transitions.timing.spring    // 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
```

### Presets
```tsx
transitionPresets.default // '200ms ease-out'
transitionPresets.fast    // '100ms ease-out'
transitionPresets.slow    // '300ms ease-in-out'
transitionPresets.spring  // '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)'
```

## Component-Specific Tokens

### Button (`button`)
```tsx
button.sizes.lg           // { height: '48px', minWidth: '100px', ... }
button.sizes.md           // { height: '36px', minWidth: '80px', ... }
button.iconOnlySizes.lg   // { size: '40px', iconSize: '24px' }
button.iconOnlySizes.md   // { size: '32px', iconSize: '20px' }
button.typography.lg      // { fontSize: '16px', fontWeight: 600, ... }
button.typography.md      // { fontSize: '14px', fontWeight: 600, ... }
button.emphasis.high      // { enabled, hover, pressed, disabled }
button.emphasis.mid       // { enabled, hover, pressed, disabled }
button.emphasis.low       // { enabled, hover, pressed, disabled }
button.emphasisOnDark     // Same structure for dark backgrounds
button.destructive        // { high, mid } for delete actions
button.focus              // { color: '#3086BF', width: '3px', offset: '5px' }
button.borderRadius       // '9999px' (pill)
button.transition         // '200ms ease-out'
```

### Avatar (`avatar`)
```tsx
avatar.sizes.xl   // '96px'
avatar.sizes.lg   // '72px'
avatar.sizes.md   // '40px'
avatar.sizes.sm   // '32px'
avatar.sizes.xs   // '24px'
avatar.typography // Font sizes per avatar size
avatar.colors     // 8 background colors for initials
avatar.focus      // { color, width, offset }
```

### Tab (`tab`)
```tsx
tab.typography        // { fontFamily, fontSize: '14px', fontWeight: 600, ... }
tab.sizes.none        // No icon
tab.sizes.top         // Icon on top
tab.sizes.leading     // Icon on left
tab.colors.light      // { active, inactive, hover, disabled }
tab.colors.dark       // For dark backgrounds
tab.indicator         // { height: '4px', borderRadius: '3px' }
tab.focus             // { color: '#3086BF', ... }
```

### Banner (`banner`)
```tsx
banner.sizes.md       // { paddingX: '16px', paddingY: '12px', ... }
banner.sizes.lg       // { paddingX: '20px', paddingY: '16px', ... }
banner.typography     // { md, lg } with title/description styles
banner.variants.info    // { background, border, icon, title, text }
banner.variants.success // { background, border, icon, title, text }
banner.variants.warning // { background, border, icon, title, text }
banner.variants.error   // { background, border, icon, title, text }
banner.border         // { width: '2px', radius: '8px' }
```
