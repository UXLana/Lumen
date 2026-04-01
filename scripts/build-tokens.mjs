#!/usr/bin/env node
/**
 * Pre-compile design tokens into a static JS module.
 *
 * Problem:  tokensToVarRefs() runs at module-init time, producing
 *           `var(--mtr-*)` strings dynamically.  Some consumer bundlers
 *           (especially external-package webpack configs) fail to include
 *           the runtime code, leaving var refs undefined.
 *
 * Solution: This script walks the same theme objects, applies the same
 *           prefix logic as tokensToVarRefs(), and writes the result as
 *           static string literals to `styles/design-tokens.precompiled.js`.
 *           Consumers import this file instead — no runtime transforms needed.
 *
 * Usage:    node scripts/build-tokens.mjs
 *           (also wired as `npm run build:tokens`)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// 1.  Re-implement tokensToVarRefs (pure JS — no TS imports needed)
// ---------------------------------------------------------------------------

function tokensToVarRefs(obj, prefix = '--mtr') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const varName = `${prefix}-${key}`;
    if (typeof value === 'string' || typeof value === 'number') {
      result[key] = `var(${varName})`;
    } else if (value && typeof value === 'object') {
      result[key] = tokensToVarRefs(value, varName);
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// 2.  Parse the trace theme structure from source (avoids TS compilation)
//     We only need the *keys* — tokensToVarRefs ignores the values.
// ---------------------------------------------------------------------------

/**
 * Extract the object structure from a TypeScript theme file.
 * We run a lightweight eval after stripping TS-specific syntax.
 */
function extractThemeStructure() {
  const src = readFileSync(resolve(ROOT, 'styles/themes/trace.ts'), 'utf8');

  // Extract just the colors block key-structure by parsing all leaf keys
  // We need: colors, typography, borderRadius, elevation, spacing, iconStyle, componentRadius
  // Since these are nested objects with string values, we can extract shapes.

  // Approach: use regex to find the theme sections and build key-only objects
  // This is simpler than full TS parsing and only needs the key paths.

  return {
    colors: extractColorsShape(src),
    typography: extractTypographyShape(),
    borderRadius: extractBorderRadiusShape(),
    elevation: extractElevationShape(),
    spacing: extractSpacingShape(),
  };
}

// Hard-code the shapes based on theme-interface.ts — these are stable.
// Each leaf is a placeholder string; tokensToVarRefs only cares about keys.

function extractColorsShape() {
  return {
    brand: { default: '_', darker: '_', lighter: '_' },
    accent: { default: '_', darker: '_', lighter: '_' },
    surface: {
      light: '_', lightDarker: '_', dark: '_', darkDarker: '_',
      disabled: { onLight: '_', onDark: '_' },
      info: '_', success: '_', warning: '_', important: '_',
    },
    surfaceBorder: { info: '_', success: '_', warning: '_', important: '_' },
    text: {
      highEmphasis: { onLight: '_', onDark: '_' },
      lowEmphasis: { onLight: '_', onDark: '_' },
      disabled: { onLight: '_', onDark: '_' },
      action: { enabled: '_', hover: '_', active: '_' },
      success: '_', warning: '_', important: '_',
    },
    border: {
      lowEmphasis: {
        onLight: '_', onDark: '_',
        hover: { onLight: '_', onDark: '_' },
      },
      midEmphasis: { onLight: '_', onDark: '_' },
      highEmphasis: { onLight: '_', onDark: '_' },
    },
    icon: {
      enabled: { onLight: '_', onDark: '_' },
      hover: { onLight: '_' },
      active: { onLight: '_' },
      selected: { onLight: '_' },
      disabled: { onLight: '_', onDark: '_' },
      lowEmphasis: { enabled: { onLight: '_', onDark: '_' } },
    },
    iconBg: {
      info: '_', info_onDark: '_', success: '_', success_onDark: '_',
      warning: '_', warning_onDark: '_', important: '_', important_onDark: '_',
    },
    action: {
      enabled: '_', hover: '_', active: '_',
      important: { enabled: '_', hover: '_', active: '_' },
      monochrome: {
        onLight: {
          enabled: '_', hover: '_', active: '_', selected: '_',
          disabled: '_', bg: '_', lowEmphasis: { enabled: '_' },
        },
        onDark: {
          enabled: '_', hover: '_', active: '_', selected: '_',
          disabled: '_', bg: '_', lowEmphasis: { enabled: '_' },
        },
      },
    },
    status: {
      info: '_', info_onDark: '_', success: '_', success_onDark: '_',
      warning: '_', warningLight: '_', warning_onDark: '_',
      important: '_', important_onDark: '_',
    },
    badge: {
      info: '_', infoLight: '_', success: '_', successLight: '_',
      warning: '_', important: '_', importantLight: '_',
      aqua: '_', aquaLight: '_', green: '_', greenLight: '_',
      yellow: '_', yellowLight: '_', fuschia: '_', fuschiaLight: '_',
      purple: '_', purpleLight: '_', charcoal: '_', charcoalLight: '_',
    },
    avatar: {
      '01': '_', '02': '_', '03': '_', '04': '_',
      '05': '_', '06': '_', '07': '_', '08': '_',
    },
    dataViz: {
      border: '_',
      '01': '_', '02': '_', '03': '_', '04': '_', '05': '_',
      '06': '_', '07': '_', '08': '_', '09': '_', '10': '_',
      '11': '_', '12': '_', '13': '_', '14': '_', '15': '_',
    },
    cvd: {
      blue: '_', lightBlue: '_', yellow: '_', green: '_',
      orange: '_', vermillion: '_', pink: '_', charcoal: '_',
    },
    hover: { onLight: '_', onDark: '_' },
    selected: { onLight: '_' },
    selectedHighlight: '_',
    selectedHighlight_hover: '_',
    focusBorder: { onLight: '_', onDark: '_' },
    scrim: '_',
    scrollbar: {
      enabled: { onLight: '_', onDark: '_' },
      hover: { onLight: '_', onDark: '_' },
      active: { onLight: '_', onDark: '_' },
    },
    navItemText: { enabled: { onLight: '_', onDark: '_' } },
    buttonToggleBg: { onLight: '_', onDark: '_' },
    chipBg: { enabled: '_', hover: '_' },
    progressIndicatorTrack: '_',
    tableCellHighlight: { highEmphasis: '_', midEmphasis: '_' },
    grid: { finishedRowText: '_', packageIconColor: '_' },
  };
}

function extractTypographyShape() {
  return {
    fontFamilies: { display: '_', body: '_', mono: '_' },
    fontWeights: { regular: '_', medium: '_', semibold: '_', bold: '_' },
    scale: {
      lineHeightTight: '_', lineHeightNormal: '_',
      letterSpacingHeading: '_', letterSpacingBody: '_',
    },
  };
}

function extractBorderRadiusShape() {
  return {
    none: '_', xs: '_', sm: '_', md: '_', lg: '_',
    xl: '_', '2xl': '_', '3xl': '_', full: '_',
  };
}

function extractElevationShape() {
  return {
    none: '_', xs: '_', sm: '_', md: '_', lg: '_',
    xl: '_', '2xl': '_', inner: '_', brand: '_', brandLg: '_',
  };
}

function extractSpacingShape() {
  return {
    unit: '_', inputPadding: '_', buttonPadding: '_',
    cardPadding: '_', sectionGap: '_', componentGap: '_',
  };
}

// ---------------------------------------------------------------------------
// 3.  Generate the pre-compiled module
// ---------------------------------------------------------------------------

function toJS(obj, indent = 2) {
  const pad = ' '.repeat(indent);
  const lines = [];
  for (const [key, value] of Object.entries(obj)) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
    if (typeof value === 'string') {
      lines.push(`${pad}${safeKey}: '${value}',`);
    } else {
      lines.push(`${pad}${safeKey}: {`);
      lines.push(toJS(value, indent + 2));
      lines.push(`${pad}},`);
    }
  }
  return lines.join('\n');
}

function generate() {
  const shapes = extractThemeStructure();

  const colorVarRefs = tokensToVarRefs(shapes.colors, '--mtr');
  const typoVarRefs = tokensToVarRefs(shapes.typography, '--mtr-typo');
  const radiusVarRefs = tokensToVarRefs(shapes.borderRadius, '--mtr-radius');
  const elevationVarRefs = tokensToVarRefs(shapes.elevation, '--mtr-elevation');
  const spacingVarRefs = tokensToVarRefs(shapes.spacing, '--mtr-space');

  const output = `/**
 * MTR Design System — Pre-compiled Design Tokens
 *
 * AUTO-GENERATED by scripts/build-tokens.mjs — DO NOT EDIT MANUALLY.
 * Run \`npm run build:tokens\` to regenerate.
 *
 * This file contains the same token API as design-tokens.ts but with all
 * CSS variable references pre-resolved as static string literals.
 * Consumer apps should import from this file to avoid bundler issues
 * with the runtime tokensToVarRefs() transform.
 */

// =============================================================================
// COLOR TOKENS — static var refs (no runtime transform)
// =============================================================================

const _themed = {
${toJS(colorVarRefs)}
};

export const colors = {
  ..._themed,

  brand: {
    ..._themed.brand,
    /** @deprecated Use brand.default */
    primary: _themed.brand.default,
    /** @deprecated Use brand.lighter */
    primaryLight: _themed.brand.lighter,
    /** @deprecated Use brand.darker */
    primaryDark: _themed.brand.darker,
  },

  surface: {
    ..._themed.surface,
    /** @deprecated Use surface.light */
    default: _themed.surface.light,
    /** @deprecated Use surface.lightDarker */
    paper: _themed.surface.lightDarker,
    /** @deprecated Use surface.lightDarker */
    elevated: _themed.surface.lightDarker,
    /** @deprecated Use surface.darkDarker */
    darkest: _themed.surface.darkDarker,
  },

  /** @deprecated Use brand.default */
  kelp: _themed.brand.default,
  /** @deprecated Use scrim */
  overlay: _themed.scrim,
  stroke: {
    /** @deprecated Use border.lowEmphasis.onLight */
    light: _themed.border.lowEmphasis.onLight,
    /** @deprecated Use border.midEmphasis.onLight */
    default: _themed.border.midEmphasis.onLight,
    /** @deprecated Use border.highEmphasis.onLight */
    dark: _themed.border.highEmphasis.onLight,
  },
  disabled: {
    /** @deprecated Use surface.disabled.onLight */
    surface: _themed.surface.disabled.onLight,
    /** @deprecated Use text.disabled.onLight */
    text: _themed.text.disabled.onLight,
    /** @deprecated Use surface.disabled.onDark */
    surfaceOnDark: _themed.surface.disabled.onDark,
    /** @deprecated Use text.disabled.onDark */
    textOnDark: _themed.text.disabled.onDark,
  },
  interactive: {
    /** @deprecated Use selectedHighlight + focusBorder */
    selectedInput: {
      background: _themed.selectedHighlight,
      border: _themed.brand.default,
    },
    selectedOutput: {
      background: _themed.brand.default,
      text: _themed.text.highEmphasis.onDark,
    },
    /** @deprecated Use focusBorder.onLight */
    focus: _themed.focusBorder.onLight,
  },
};

export const dataVizColors = _themed.dataViz;

// =============================================================================
// TYPOGRAPHY TOKENS — static var refs
// =============================================================================

const _themedTypo = {
${toJS(typoVarRefs)}
};

export const fontFamilies = {
  display: _themedTypo.fontFamilies.display,
  body: _themedTypo.fontFamilies.body,
  mono: _themedTypo.fontFamilies.mono,
};

export const fontWeights = {
  regular: _themedTypo.fontWeights.regular,
  medium: _themedTypo.fontWeights.medium,
  semibold: _themedTypo.fontWeights.semibold,
  bold: _themedTypo.fontWeights.bold,
};

// Typography composite — same static values as design-tokens.ts
export const typography = {
  display: {
    '2xl': { fontFamily: fontFamilies.display, fontSize: '64px', fontWeight: fontWeights.semibold, lineHeight: '76px', letterSpacing: '-1.5px' },
    xl:    { fontFamily: fontFamilies.display, fontSize: '51px', fontWeight: fontWeights.semibold, lineHeight: '60px', letterSpacing: '-0.8px' },
    lg:    { fontFamily: fontFamilies.display, fontSize: '41px', fontWeight: fontWeights.semibold, lineHeight: '48px', letterSpacing: '-0.25px' },
    md:    { fontFamily: fontFamilies.display, fontSize: '32px', fontWeight: fontWeights.semibold, lineHeight: '40px', letterSpacing: '-0.7px' },
    sm:    { fontFamily: fontFamilies.display, fontSize: '26px', fontWeight: fontWeights.semibold, lineHeight: '32px', letterSpacing: '-0.5px' },
    xs:    { fontFamily: fontFamilies.display, fontSize: '23px', fontWeight: fontWeights.semibold, lineHeight: '28px', letterSpacing: '-0.3px' },
  },
  heading: {
    h1: { fontFamily: fontFamilies.display, fontSize: '32px', fontWeight: fontWeights.semibold, lineHeight: '40px', letterSpacing: '-0.5px' },
    h2: { fontFamily: fontFamilies.display, fontSize: '28px', fontWeight: fontWeights.semibold, lineHeight: '36px', letterSpacing: '-0.3px' },
    h3: { fontFamily: fontFamilies.display, fontSize: '24px', fontWeight: fontWeights.semibold, lineHeight: '32px', letterSpacing: '-0.2px' },
    h4: { fontFamily: fontFamilies.display, fontSize: '20px', fontWeight: fontWeights.semibold, lineHeight: '28px', letterSpacing: '-0.1px' },
    h5: { fontFamily: fontFamilies.display, fontSize: '18px', fontWeight: fontWeights.semibold, lineHeight: '24px', letterSpacing: '0px' },
    h6: { fontFamily: fontFamilies.display, fontSize: '16px', fontWeight: fontWeights.semibold, lineHeight: '24px', letterSpacing: '0px' },
  },
  body: {
    xl: { fontFamily: fontFamilies.body, fontSize: '20px', fontWeight: fontWeights.regular, lineHeight: '30px', letterSpacing: '0px' },
    lg: { fontFamily: fontFamilies.body, fontSize: '18px', fontWeight: fontWeights.regular, lineHeight: '28px', letterSpacing: '0px' },
    md: { fontFamily: fontFamilies.body, fontSize: '16px', fontWeight: fontWeights.regular, lineHeight: '24px', letterSpacing: '0px' },
    sm: { fontFamily: fontFamilies.body, fontSize: '14px', fontWeight: fontWeights.regular, lineHeight: '20px', letterSpacing: '0px' },
    xs: { fontFamily: fontFamilies.body, fontSize: '12px', fontWeight: fontWeights.regular, lineHeight: '16px', letterSpacing: '0.1px' },
  },
  label: {
    lg: { fontFamily: fontFamilies.body, fontSize: '16px', fontWeight: fontWeights.medium, lineHeight: '24px', letterSpacing: '0.1px' },
    md: { fontFamily: fontFamilies.body, fontSize: '14px', fontWeight: fontWeights.medium, lineHeight: '20px', letterSpacing: '0.1px' },
    sm: { fontFamily: fontFamilies.body, fontSize: '12px', fontWeight: fontWeights.medium, lineHeight: '16px', letterSpacing: '0.2px' },
  },
  code: {
    lg: { fontFamily: fontFamilies.mono, fontSize: '16px', fontWeight: fontWeights.regular, lineHeight: '24px', letterSpacing: '0px' },
    md: { fontFamily: fontFamilies.mono, fontSize: '14px', fontWeight: fontWeights.regular, lineHeight: '20px', letterSpacing: '0px' },
    sm: { fontFamily: fontFamilies.mono, fontSize: '12px', fontWeight: fontWeights.regular, lineHeight: '16px', letterSpacing: '0px' },
  },
};

// =============================================================================
// SPACING TOKENS
// =============================================================================

export const spacing = {
  none: '0px',
  '2xs': '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '40px',
  '4xl': '48px',
  '5xl': '64px',
  '6xl': '96px',
};

const _themedSpacing = {
${toJS(spacingVarRefs)}
};

export const spacingTokens = {
  inputPadding: _themedSpacing.inputPadding,
  buttonPadding: _themedSpacing.buttonPadding,
  cardPadding: _themedSpacing.cardPadding,
  sectionGap: _themedSpacing.sectionGap,
  componentGap: _themedSpacing.componentGap,
  sectionPadding: spacing['4xl'],
  pagePadding: spacing['5xl'],
  gutter: _themedSpacing.componentGap,
  containerPadding: spacing.xl,
};

/** @deprecated Use spacingTokens directly */
export const spacingSemantics = spacingTokens;

// =============================================================================
// BORDER RADIUS TOKENS — static var refs
// =============================================================================

const _themedRadius = {
${toJS(radiusVarRefs)}
};

export const borderRadius = {
  none: _themedRadius.none,
  xs: _themedRadius.xs,
  sm: _themedRadius.sm,
  md: _themedRadius.md,
  lg: _themedRadius.lg,
  xl: _themedRadius.xl,
  '2xl': _themedRadius['2xl'],
  '3xl': _themedRadius['3xl'],
  full: _themedRadius.full,
};

export const borderRadiusSemantics = {
  button: 'var(--mtr-comp-radius-button)',
  input:  'var(--mtr-comp-radius-input)',
  card:   'var(--mtr-comp-radius-card)',
  modal:  'var(--mtr-comp-radius-modal)',
  badge:  'var(--mtr-comp-radius-badge)',
  chip:   'var(--mtr-comp-radius-chip)',
  avatar: 'var(--mtr-comp-radius-avatar)',
};

// =============================================================================
// SHADOW TOKENS — static var refs
// =============================================================================

const _themedElevation = {
${toJS(elevationVarRefs)}
};

export const shadows = {
  none: _themedElevation.none,
  xs: _themedElevation.xs,
  sm: _themedElevation.sm,
  md: _themedElevation.md,
  lg: _themedElevation.lg,
  xl: _themedElevation.xl,
  '2xl': _themedElevation['2xl'],
  inner: _themedElevation.inner,
  brand: _themedElevation.brand,
  brandLg: _themedElevation.brandLg,
};

export const shadowSemantics = {
  card: shadows.sm,
  cardHover: shadows.md,
  dropdown: shadows.lg,
  modal: shadows.xl,
  button: shadows.xs,
  buttonHover: shadows.sm,
  input: shadows.none,
  inputFocus: \`0px 0px 0px 3px \${colors.selectedHighlight}\`,
  brand: shadows.brand,
  brandLg: shadows.brandLg,
};

// =============================================================================
// BREAKPOINT TOKENS (static — no theming)
// =============================================================================

export const breakpoints = {
  xs: '320px', sm: '640px', md: '768px',
  lg: '1024px', xl: '1280px', '2xl': '1536px',
};

export const mediaQueries = {
  xs: \`@media (min-width: \${breakpoints.xs})\`,
  sm: \`@media (min-width: \${breakpoints.sm})\`,
  md: \`@media (min-width: \${breakpoints.md})\`,
  lg: \`@media (min-width: \${breakpoints.lg})\`,
  xl: \`@media (min-width: \${breakpoints.xl})\`,
  '2xl': \`@media (min-width: \${breakpoints['2xl']})\`,
  xsMax: \`@media (max-width: \${parseInt(breakpoints.sm) - 1}px)\`,
  smMax: \`@media (max-width: \${parseInt(breakpoints.md) - 1}px)\`,
  mdMax: \`@media (max-width: \${parseInt(breakpoints.lg) - 1}px)\`,
  lgMax: \`@media (max-width: \${parseInt(breakpoints.xl) - 1}px)\`,
  xlMax: \`@media (max-width: \${parseInt(breakpoints['2xl']) - 1}px)\`,
  mobile: \`@media (max-width: \${parseInt(breakpoints.md) - 1}px)\`,
  tablet: \`@media (min-width: \${breakpoints.md}) and (max-width: \${parseInt(breakpoints.lg) - 1}px)\`,
  desktop: \`@media (min-width: \${breakpoints.lg})\`,
  hover: '@media (hover: hover)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  dark: '@media (prefers-color-scheme: dark)',
};

// =============================================================================
// Z-INDEX TOKENS (static)
// =============================================================================

export const zIndex = {
  hide: -1, base: 0, dropdown: 100, sticky: 200, header: 300,
  overlay: 400, modal: 500, popover: 600, tooltip: 700, toast: 800, max: 9999,
};

// =============================================================================
// TRANSITION TOKENS (static)
// =============================================================================

export const transitions = {
  duration: { instant: '0ms', fast: '100ms', normal: '200ms', slow: '300ms', slower: '500ms' },
  timing: {
    linear: 'linear', ease: 'ease', easeIn: 'ease-in', easeOut: 'ease-out',
    easeInOut: 'ease-in-out', spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

export const transitionPresets = {
  default: \`\${transitions.duration.normal} \${transitions.timing.easeOut}\`,
  fast: \`\${transitions.duration.fast} \${transitions.timing.easeOut}\`,
  slow: \`\${transitions.duration.slow} \${transitions.timing.easeInOut}\`,
  spring: \`\${transitions.duration.slow} \${transitions.timing.spring}\`,
};
`;

  const outPath = resolve(ROOT, 'styles/design-tokens.precompiled.js');
  writeFileSync(outPath, output, 'utf8');
  console.log(`✅ Pre-compiled tokens written to ${outPath}`);
  console.log(`   ${output.split('\n').length} lines`);
}

generate();
