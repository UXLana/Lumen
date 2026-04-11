/**
 * buildTheme() — Mathematical Theme Generator
 *
 * Generates a complete ProductTheme from a single brand hex color + mode.
 * ~80% of tokens are derived mathematically; ~20% are personality overrides.
 *
 * FORMULA OVERVIEW:
 * 1. Opacity Ramp — ~20 alpha values, flipped by mode (light=black, dark=white)
 * 2. Brand Family — HSL lightness shifts: [-12, 0, +12]
 * 3. Accent       — Hue rotation strategy + same lightness shifts
 * 4. Surfaces     — Brand hue at extreme lightness (98% light, 12% dark)
 * 5. Dark Mode    — Brighten brand/accent by +8-15 L for AA contrast
 * 6. Semantics    — Fixed palette, brightened per mode
 *
 * Usage:
 *   const lumen     = buildTheme('#FF5722', 'light')
 *   const lumenDark = buildTheme('#FF5722', 'dark')
 *   const claude    = buildTheme('#BD5D3A', 'light', {
 *     accentStrategy: 'split-complementary',
 *     personality: 'organic',
 *     radiusBase: 3,
 *   })
 */

import type {
  ProductTheme,
  ThemeColors,
  ThemeTypography,
  ThemeSpacing,
  ThemeIconStyle,
  ThemeComponentRadius,
  ThemeElevation,
} from './theme-interface';
import { buildBorderRadius, buildComponentRadius, buildElevation } from './theme-interface';

// =============================================================================
// TYPES
// =============================================================================

/** Deep partial — allows overriding any nested property */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type AccentStrategy =
  | 'complementary'       // H + 180° — high contrast (Trace, Lumen)
  | 'split-complementary' // H + 150° — balanced (RID, Claude-Light)
  | 'analogous'           // H + 30°  — harmonious (Earth)
  | 'triadic';            // H + 120° — vibrant (University)

export type Personality = 'modern' | 'institutional' | 'organic';

export interface ThemeBuildOptions {
  /** Theme display name */
  name?: string;
  /** Explicit accent hex — skips auto-derivation */
  accentHex?: string;
  /** How to derive accent from brand hue (default: 'complementary') */
  accentStrategy?: AccentStrategy;
  /** Personality preset for typography/spacing/icons (default: 'modern') */
  personality?: Personality;
  /** Border radius base in px (default: 4) */
  radiusBase?: number;
  /** Typography overrides (deep-merged over personality defaults) */
  typography?: DeepPartial<ThemeTypography>;
  /** Spacing overrides */
  spacing?: Partial<ThemeSpacing>;
  /** Icon style overrides */
  iconStyle?: Partial<ThemeIconStyle>;
  /** Component radius overrides */
  componentRadius?: Partial<ThemeComponentRadius>;
  /** Elevation overrides (deep-merged over buildElevation output) */
  elevation?: Partial<ThemeElevation>;
  /** Color overrides (deep-merged LAST — ultimate escape hatch) */
  colorOverrides?: DeepPartial<ThemeColors>;
  /**
   * Whether to use brand-derived action colors instead of accent.
   * Default: false (actions use accent). Set true for Claude-Light style.
   */
  actionFromBrand?: boolean;
  /**
   * Custom neutral RGB for opacity ramps.
   * Light mode default: [0, 0, 0] (pure black)
   * Dark mode default:  [255, 255, 255] (pure white)
   * Claude-Light uses [61, 57, 41] light / [244, 243, 238] dark for warm parchment feel.
   */
  neutralBase?: {
    light?: [number, number, number];
    dark?: [number, number, number];
  };
  /**
   * Custom text base for onDark surfaces in light mode / onLight in dark mode.
   * Defaults to [255, 255, 255] for light themes, [255, 255, 255] for dark themes.
   */
  contrastBase?: {
    light?: [number, number, number]; // text on dark surfaces in light mode
    dark?: [number, number, number];  // text on light surfaces in dark mode (usually white)
  };
}

// =============================================================================
// OKLCH COLOR UTILITIES — Perceptually Uniform Color Space
// =============================================================================
//
// Pipeline: hex → sRGB [0-1] → linear sRGB → Oklab → OKLCH (polar)
//
// OKLCH advantages over HSL:
// - L (lightness) is perceptually uniform: +0.05 L looks like the same
//   brightness change on ANY hue (HSL yellow at L=50% looks white, blue looks black)
// - Two colors at the same L have similar WCAG contrast ratios
// - Hue rotation doesn't change perceived brightness (it does in HSL)
// - Chroma adjustments don't shift hue (old LCH had blue→purple drift; OKLCH fixed it)
//
// Reference: Bjorn Ottosson, "A perceptual color space for image processing"
// https://bottosson.github.io/posts/oklab/

interface OKLCH {
  L: number; // 0–1 (perceptual lightness)
  C: number; // 0–~0.37 (chroma — colorfulness)
  H: number; // 0–360 (hue angle in degrees)
}

interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

// ── Hex ↔ sRGB ──

export function hexToRgb(hex: string): RGB {
  let cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

// ── sRGB ↔ Linear sRGB (gamma decode/encode) ──

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

// ── Linear sRGB ↔ Oklab ──

function linearRgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const l_ = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m_ = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s_ = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l = Math.cbrt(l_);
  const m = Math.cbrt(m_);
  const s = Math.cbrt(s_);

  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ];
}

function oklabToLinearRgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

// ── Oklab ↔ OKLCH (polar conversion) ──

function oklabToOklch(L: number, a: number, b: number): OKLCH {
  const C = Math.sqrt(a * a + b * b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

function oklchToOklab(L: number, C: number, H: number): [number, number, number] {
  const hRad = (H * Math.PI) / 180;
  return [L, C * Math.cos(hRad), C * Math.sin(hRad)];
}

// ── Public API: Hex ↔ OKLCH ──

export function hexToOklch(hex: string): OKLCH {
  const { r, g, b } = hexToRgb(hex);
  const lr = srgbToLinear(r / 255);
  const lg = srgbToLinear(g / 255);
  const lb = srgbToLinear(b / 255);
  const [L, a, ob] = linearRgbToOklab(lr, lg, lb);
  return oklabToOklch(L, a, ob);
}

export function oklchToHex({ L, C, H }: OKLCH): string {
  const [labL, labA, labB] = oklchToOklab(
    clamp(L, 0, 1),
    Math.max(0, C),
    ((H % 360) + 360) % 360,
  );
  const [lr, lg, lb] = oklabToLinearRgb(labL, labA, labB);
  return rgbToHex({
    r: Math.round(clamp(linearToSrgb(lr), 0, 1) * 255),
    g: Math.round(clamp(linearToSrgb(lg), 0, 1) * 255),
    b: Math.round(clamp(linearToSrgb(lb), 0, 1) * 255),
  });
}

// ── HSL kept for backward compat (barrel export) ──

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const oklch = hexToOklch(hex);
  // Approximate mapping: OKLCH L → HSL L, OKLCH C → HSL S (rough)
  return { h: Math.round(oklch.H), s: Math.round(oklch.C * 300), l: Math.round(oklch.L * 100) };
}

export function hslToHex({ h, s, l }: { h: number; s: number; l: number }): string {
  return oklchToHex({ L: l / 100, C: s / 300, H: h });
}

// ── Color manipulation in OKLCH ──

/**
 * Perceptually uniform lightness shift.
 * amount is in OKLCH L units (0–1). Typical shifts: 0.05–0.15
 */
function lighten(hex: string, amount: number): string {
  const oklch = hexToOklch(hex);
  return oklchToHex({ ...oklch, L: clamp(oklch.L + amount, 0, 1) });
}

function darken(hex: string, amount: number): string {
  return lighten(hex, -amount);
}

/**
 * Reduce chroma (colorfulness). amount in OKLCH C units (0–0.37).
 * Typical shifts: 0.02–0.10
 */
function desaturate(hex: string, amount: number): string {
  const oklch = hexToOklch(hex);
  return oklchToHex({ ...oklch, C: Math.max(0, oklch.C - amount) });
}

/** Rotate hue in OKLCH (perceptually stable — no blue→purple drift) */
function rotateHue(hex: string, degrees: number): string {
  const oklch = hexToOklch(hex);
  return oklchToHex({ ...oklch, H: (oklch.H + degrees + 360) % 360 });
}

/**
 * Set a specific OKLCH lightness tone (like M3's tonal palette).
 * Preserves hue and chroma, only changes L.
 */
function setTone(hex: string, tone: number): string {
  const oklch = hexToOklch(hex);
  return oklchToHex({ ...oklch, L: clamp(tone, 0, 1) });
}

/**
 * Create a color at a specific hue with given chroma and lightness.
 * Used for surfaces, tinted neutrals, accent derivation.
 */
function oklchColor(L: number, C: number, H: number): string {
  return oklchToHex({ L: clamp(L, 0, 1), C: Math.max(0, C), H: ((H % 360) + 360) % 360 });
}

/** Build rgba string from RGB tuple + alpha */
function rgba(rgb: [number, number, number], alpha: number): string {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

/**
 * Create a brand-tinted surface in OKLCH.
 * Uses brand hue at very low chroma for subtle warmth/coolness.
 */
function tintedSurface(brandHue: number, chroma: number, lightness: number): string {
  return oklchColor(lightness, chroma, brandHue);
}

// =============================================================================
// OPACITY RAMP — The Universal Alpha Table
// =============================================================================
// These alpha values are consistent across all themes. The only variable is the
// RGB base: light mode uses black (or neutral), dark mode uses white (or neutral).

const ALPHA = {
  // Text
  textHigh:         { light: 0.95, dark: 0.95 },
  textLow:          { light: 0.60, dark: 0.55 },
  textDisabled:     { light: 0.30, dark: 0.25 },

  // Border
  borderLow:        { light: 0.10, dark: 0.12 },
  borderLowHover:   { light: 0.27, dark: 0.22 },
  borderMid:        { light: 0.15, dark: 0.25 },
  borderHigh:       { light: 0.42, dark: 0.40 },

  // Icon
  iconEnabled:      { light: 0.55, dark: 0.55 },
  iconHover:        { light: 0.65, dark: 0.75 },
  iconActive:       { light: 0.75, dark: 0.90 },
  iconSelected:     { light: 0.85, dark: 0.95 },
  iconDisabled:     { light: 0.20, dark: 0.20 },
  iconLowEmphasis:  { light: 0.43, dark: 0.35 },

  // Interactive
  hover:            { light: 0.05, dark: 0.06 },
  selected:         { light: 0.09, dark: 0.10 },
  scrim:            { light: 0.34, dark: 0.60 },

  // Monochrome action
  monoEnabled:      { light: 0.55, dark: 0.70 },
  monoHover:        { light: 0.65, dark: 0.85 },
  monoActive:       { light: 0.75, dark: 1.00 },
  monoSelected:     { light: 0.85, dark: 1.00 },
  monoDisabled:     { light: 0.20, dark: 0.20 },
  monoBg:           { light: 0.08, dark: 0.06 },
  monoLowEmphasis:  { light: 0.43, dark: 0.50 },

  // Scrollbar
  scrollEnabled:    { light: 0.42, dark: 0.15 },
  scrollHover:      { light: 0.57, dark: 0.25 },
  scrollActive:     { light: 0.72, dark: 0.35 },

  // Navigation
  navItemText:      { light: 0.72, dark: 0.65 },

  // Chip/button toggle
  chipEnabled:      { light: 0.08, dark: 0.06 },
  chipHover:        { light: 0.13, dark: 0.10 },

  // Surface
  surfaceDisabled:  { light: 0.03, dark: 0.04 },
  surfaceHighlight: { light: 0.03, dark: 0.10 },
  progressTrack:    { light: 0.15, dark: 0.12 },

  // Grid
  gridFinished:     { light: 0.35, dark: 0.30 },
} as const;

// Contrast base alphas (onDark for light mode, onLight for dark mode — the "opposite" column)
const ALPHA_CONTRAST = {
  textHigh:        { light: 1.00, dark: 0.95 },
  textLow:         { light: 0.70, dark: 0.70 },
  textDisabled:    { light: 0.30, dark: 0.30 },
  borderLow:       { light: 0.10, dark: 0.22 },
  borderLowHover:  { light: 0.27, dark: 0.40 },
  borderMid:       { light: 0.15, dark: 0.35 },
  borderHigh:      { light: 0.43, dark: 0.55 },
  iconEnabled:     { light: 0.94, dark: 0.94 },
  iconDisabled:    { light: 0.20, dark: 0.20 },
  iconLowEmphasis: { light: 0.65, dark: 0.60 },
  monoEnabled:     { light: 0.94, dark: 0.94 },
  monoHover:       { light: 1.00, dark: 1.00 },
  monoActive:      { light: 1.00, dark: 1.00 },
  monoSelected:    { light: 1.00, dark: 1.00 },
  monoDisabled:    { light: 0.20, dark: 0.20 },
  monoBg:          { light: 0.09, dark: 0.09 },
  monoLowEmphasis: { light: 0.65, dark: 0.65 },
  surfaceDisabled: { light: 0.20, dark: 0.12 },
  scrollEnabled:   { light: 0.43, dark: 0.40 },
  scrollHover:     { light: 0.58, dark: 0.55 },
  scrollActive:    { light: 0.73, dark: 0.70 },
  navItemText:     { light: 0.88, dark: 0.85 },
  hover:           { light: 0.15, dark: 0.12 },
} as const;

// =============================================================================
// SEMANTIC PALETTES — Universal constants
// =============================================================================

const LIGHT_STATUS = {
  info: '#617BFF',
  info_onDark: 'rgba(122, 145, 255, 0.25)',
  success: '#1B7F66',
  success_onDark: 'rgba(0, 173, 130, 0.25)',
  warning: '#CC7300',
  warningLight: '#F3DCBD',
  warning_onDark: 'rgba(230, 130, 0, 0.25)',
  important: '#DC0C22',
  important_onDark: 'rgba(248, 104, 118, 0.25)',
};

const DARK_STATUS = {
  info: '#64B5F6',
  info_onDark: 'rgba(77, 145, 255, 0.25)',
  success: '#66BB9A',
  success_onDark: 'rgba(0, 173, 130, 0.25)',
  warning: '#F0A840',
  warningLight: 'rgba(240, 168, 64, 0.18)',
  warning_onDark: 'rgba(230, 130, 0, 0.25)',
  important: '#FF8A6E',
  important_onDark: 'rgba(255, 112, 67, 0.25)',
};

const LIGHT_BADGE = {
  info: '#4766FF',
  infoLight: '#DBE2FF',
  success: '#19856B',
  successLight: '#D9EDE6',
  warning: '#AD6200',
  warningLight: '#FCF6ED',
  important: '#E80D24',
  importantLight: '#FFE3E7',
  aqua: '#167F92',
  aquaLight: '#B4EAF3',
  green: '#40851E',
  greenLight: '#DAF4CD',
  yellow: '#8F6F00',
  yellowLight: '#FFE68F',
  fuschia: '#CF26B8',
  fuschiaLight: '#FCCFF6',
  purple: '#A14CE1',
  purpleLight: '#EDDCF9',
  charcoal: '#4F4F4F',
  charcoalLight: '#E3E3E3',
};

const DARK_BADGE = {
  info: '#64B5F6',
  infoLight: 'rgba(100, 181, 246, 0.18)',
  success: '#66BB9A',
  successLight: 'rgba(102, 187, 154, 0.18)',
  warning: '#F0A840',
  warningLight: 'rgba(240, 168, 64, 0.18)',
  important: '#FF8A6E',
  importantLight: 'rgba(255, 138, 110, 0.18)',
  aqua: '#4DD0E1',
  aquaLight: 'rgba(77, 208, 225, 0.18)',
  green: '#81C784',
  greenLight: 'rgba(129, 199, 132, 0.18)',
  yellow: '#FFD54F',
  yellowLight: 'rgba(255, 213, 79, 0.18)',
  fuschia: '#F48FB1',
  fuschiaLight: 'rgba(244, 143, 177, 0.18)',
  purple: '#CE93D8',
  purpleLight: 'rgba(206, 147, 216, 0.18)',
  charcoal: '#A0A0A0',
  charcoalLight: 'rgba(160, 160, 160, 0.18)',
};

const DEFAULT_AVATAR = {
  '01': '#D6EAFF',
  '02': '#FFDBFA',
  '03': '#EFE0FF',
  '04': '#CFEFC2',
  '05': '#BEF4ED',
  '06': '#FFE68F',
  '07': '#FFE3DB',
  '08': '#FFE2C2',
} as Record<'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08', string>;

const CVD_SAFE = {
  blue: '#0072B2',
  lightBlue: '#56B4E9',
  yellow: '#F0E442',
  green: '#009E73',
  orange: '#E69F00',
  vermillion: '#D55E00',
  pink: '#CC79A7',
  charcoal: '#323232',
};

const LIGHT_ICON_BG = {
  info: '#EBEFFF',
  info_onDark: 'rgba(122, 145, 255, 0.25)',
  success: '#DEEDE9',
  success_onDark: 'rgba(0, 173, 130, 0.25)',
  warning: '#F9ECDC',
  warning_onDark: 'rgba(230, 130, 0, 0.25)',
  important: '#FBE4E7',
  important_onDark: 'rgba(248, 104, 118, 0.25)',
};

const DARK_ICON_BG = {
  info: 'rgba(77, 145, 255, 0.20)',
  info_onDark: 'rgba(77, 145, 255, 0.25)',
  success: 'rgba(77, 182, 140, 0.20)',
  success_onDark: 'rgba(0, 173, 130, 0.25)',
  warning: 'rgba(230, 130, 0, 0.20)',
  warning_onDark: 'rgba(230, 130, 0, 0.25)',
  important: 'rgba(255, 112, 67, 0.20)',
  important_onDark: 'rgba(255, 112, 67, 0.25)',
};

const LIGHT_SURFACE_SEMANTIC = {
  info: '#F4F6FF',
  success: '#EDF6F4',
  warning: '#FCF6ED',
  important: '#FDF2F3',
};

const DARK_SURFACE_SEMANTIC = {
  info: 'rgba(77, 145, 255, 0.10)',
  success: 'rgba(77, 182, 140, 0.10)',
  warning: 'rgba(230, 130, 0, 0.10)',
  important: 'rgba(255, 87, 34, 0.10)',
};

const LIGHT_SURFACE_BORDER = {
  info: '#D1D9FF',
  success: '#C5E2DB',
  warning: '#F2DABA',
  important: '#F8CFD3',
};

const DARK_SURFACE_BORDER = {
  info: '#3A5070',
  success: '#2D5E4D',
  warning: '#6E4A1A',
  important: '#6E3020',
};

const LIGHT_TEXT_SEMANTIC = {
  success: '#006B50',
  warning: '#A35C00',
  important: '#C10B1E',
};

const DARK_TEXT_SEMANTIC = {
  success: '#66BB9A',
  warning: '#F0A840',
  important: '#FF8A6E',
};

const LIGHT_IMPORTANT_ACTION = {
  enabled: '#C10B1E',
  hover: '#A20919',
  active: '#850715',
};

const DARK_IMPORTANT_ACTION = {
  enabled: '#FF8A6E',
  hover: '#FF7043',
  active: '#F4511E',
};

// =============================================================================
// PERSONALITY PRESETS
// =============================================================================

const TYPOGRAPHY_PRESETS: Record<Personality, ThemeTypography> = {
  modern: {
    fontFamilies: {
      display: 'var(--font-space-grotesk), sans-serif',
      body: 'var(--font-dm-sans), sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontWeights: { regular: '400', medium: '500', semibold: '600', bold: '700' },
    scale: {
      lineHeightTight: '1.2',
      lineHeightNormal: '1.5',
      letterSpacingHeading: '-0.5px',
      letterSpacingBody: '0px',
    },
  },
  institutional: {
    fontFamilies: {
      display: 'var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif',
      body: 'var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontWeights: { regular: '400', medium: '500', semibold: '600', bold: '700' },
    scale: {
      lineHeightTight: '1.2',
      lineHeightNormal: '1.5',
      letterSpacingHeading: '-0.3px',
      letterSpacingBody: '0px',
    },
  },
  organic: {
    fontFamilies: {
      display: 'var(--font-newsreader), ui-serif, Georgia, serif',
      body: 'var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontWeights: { regular: '400', medium: '500', semibold: '600', bold: '700' },
    scale: {
      lineHeightTight: '1.25',
      lineHeightNormal: '1.6',
      letterSpacingHeading: '-0.3px',
      letterSpacingBody: '0.15px',
    },
  },
};

const SPACING_PRESETS: Record<Personality, ThemeSpacing> = {
  modern: {
    unit: '4px',
    inputPadding: '12px',
    buttonPadding: '16px',
    cardPadding: '24px',
    sectionGap: '48px',
    componentGap: '16px',
  },
  institutional: {
    unit: '4px',
    inputPadding: '10px',
    buttonPadding: '14px',
    cardPadding: '20px',
    sectionGap: '40px',
    componentGap: '12px',
  },
  organic: {
    unit: '4px',
    inputPadding: '14px',
    buttonPadding: '18px',
    cardPadding: '28px',
    sectionGap: '56px',
    componentGap: '20px',
  },
};

const ICON_PRESETS: Record<Personality, ThemeIconStyle> = {
  modern: {
    set: 'outlined',
    strokeWidth: '1.5',
    cornerStyle: 'round',
    defaultSize: '20',
    overrides: {},
  },
  institutional: {
    set: 'filled',
    strokeWidth: '1.5',
    cornerStyle: 'round',
    defaultSize: '20',
    overrides: {},
  },
  organic: {
    set: 'outlined',
    strokeWidth: '1.25',
    cornerStyle: 'round',
    defaultSize: '20',
    overrides: {},
  },
};

const RADIUS_PRESETS: Record<Personality, number> = {
  modern: 4,
  institutional: 1,
  organic: 3,
};

// =============================================================================
// ACCENT DERIVATION
// =============================================================================

function deriveAccent(brandHex: string, strategy: AccentStrategy): { default: string; darker: string; lighter: string } {
  const brand = hexToOklch(brandHex);
  let accentH: number;
  let accentC: number;
  let accentL: number;

  // Hue rotation + chroma/lightness modulation in OKLCH
  // Chroma reductions create less saturated accents that harmonize with the brand
  switch (strategy) {
    case 'complementary':
      accentH = (brand.H + 180) % 360;
      accentC = clamp(brand.C * 0.80, 0, 0.37);
      accentL = clamp(brand.L * 0.90, 0.20, 0.80);
      break;
    case 'split-complementary':
      accentH = (brand.H + 150) % 360;
      accentC = clamp(brand.C * 0.70, 0, 0.37);
      accentL = clamp(brand.L * 0.85, 0.20, 0.80);
      break;
    case 'analogous':
      accentH = (brand.H + 30) % 360;
      accentC = clamp(brand.C * 0.65, 0, 0.37);
      accentL = clamp(brand.L * 0.90, 0.20, 0.80);
      break;
    case 'triadic':
      accentH = (brand.H + 120) % 360;
      accentC = clamp(brand.C * 0.75, 0, 0.37);
      accentL = clamp(brand.L * 0.90, 0.20, 0.80);
      break;
  }

  const accentHex = oklchColor(accentL, accentC, accentH);
  return {
    default: accentHex,
    darker: darken(accentHex, 0.08),          // OKLCH: -0.08 L
    lighter: lighten(desaturate(accentHex, 0.03), 0.08),  // OKLCH: -0.03 C, +0.08 L
  };
}

// =============================================================================
// DATA VIZ — Brand → Accent gradient (15 stops)
// =============================================================================

function buildDataViz(
  brandHex: string,
  accentHex: string,
  mode: 'light' | 'dark',
): ThemeColors['dataViz'] {
  const brandOk = hexToOklch(brandHex);
  const accentOk = hexToOklch(accentHex);

  // 15 stops interpolating from brand to accent in OKLCH
  // Perceptually uniform hue + chroma interpolation with bell-curve lightness
  const stops: string[] = [];
  for (let i = 0; i < 15; i++) {
    const t = i / 14;
    // Handle hue interpolation via shortest path
    let dH = accentOk.H - brandOk.H;
    if (dH > 180) dH -= 360;
    if (dH < -180) dH += 360;
    const h = ((brandOk.H + dH * t) % 360 + 360) % 360;
    const c = brandOk.C + (accentOk.C - brandOk.C) * t;
    let l: number;
    if (mode === 'light') {
      // Light: start dark (0.20), peak mid (0.75), end dark
      l = 0.20 + 0.55 * Math.sin(t * Math.PI);
    } else {
      // Dark: start bright (0.45), peak mid (0.85)
      l = 0.45 + 0.40 * Math.sin(t * Math.PI);
    }
    stops.push(oklchColor(clamp(l, 0.10, 0.95), clamp(c, 0.02, 0.37), h));
  }

  return {
    border: mode === 'light' ? '#000000' : '#FFFFFF',
    '01': stops[0],
    '02': stops[1],
    '03': stops[2],
    '04': stops[3],
    '05': stops[4],
    '06': stops[5],
    '07': stops[6],
    '08': stops[7],
    '09': stops[8],
    '10': stops[9],
    '11': stops[10],
    '12': stops[11],
    '13': stops[12],
    '14': stops[13],
    '15': stops[14],
  };
}

// =============================================================================
// DEEP MERGE
// =============================================================================

function deepMerge<T extends Record<string, unknown>>(base: T, overrides: DeepPartial<T>): T {
  const result = { ...base };
  for (const key in overrides) {
    const val = overrides[key];
    if (val !== undefined && val !== null && typeof val === 'object' && !Array.isArray(val)) {
      result[key] = deepMerge(
        (result[key] ?? {}) as Record<string, unknown>,
        val as Record<string, unknown>,
      ) as T[typeof key];
    } else if (val !== undefined) {
      result[key] = val as T[typeof key];
    }
  }
  return result;
}

// =============================================================================
// buildColors()
// =============================================================================

export function buildColors(
  brandHex: string,
  mode: 'light' | 'dark',
  options: ThemeBuildOptions = {},
): ThemeColors {
  const isDark = mode === 'dark';
  const brandOklch = hexToOklch(brandHex);

  // --- Neutral bases ---
  const neutralLight = options.neutralBase?.light ?? [0, 0, 0];
  const neutralDark = options.neutralBase?.dark ?? [255, 255, 255];
  const contrastLight = options.contrastBase?.light ?? [255, 255, 255];
  const contrastDark = options.contrastBase?.dark ?? [255, 255, 255];

  // Primary neutral (text/border/icon on the primary surface)
  const n: [number, number, number] = isDark ? neutralDark : neutralLight;
  // Contrast neutral (text on the opposite surface — onDark for light themes, onLight for dark)
  const c: [number, number, number] = isDark ? contrastDark : contrastLight;

  const a = (token: keyof typeof ALPHA) => ALPHA[token][mode];
  const ac = (token: keyof typeof ALPHA_CONTRAST) => ALPHA_CONTRAST[token][mode];

  // --- Brand family (OKLCH — perceptually uniform lightness shifts) ---
  // M3-inspired: light mode uses seed as-is, dark mode brightens by +0.06 L
  const brandDefault = isDark
    ? lighten(brandHex, 0.06)      // brighten for dark bg contrast
    : brandHex;
  const brandDarker = isDark
    ? brandHex                      // original becomes "darker" in dark mode
    : darken(brandHex, 0.08);      // -0.08 L in OKLCH
  const brandLighter = isDark
    ? lighten(brandHex, 0.12)
    : lighten(desaturate(brandHex, 0.03), 0.08);

  // --- Accent ---
  const strategy = options.accentStrategy ?? 'complementary';
  const accentFamily = options.accentHex
    ? {
        default: options.accentHex,
        darker: darken(options.accentHex, 0.08),
        lighter: lighten(desaturate(options.accentHex, 0.03), 0.08),
      }
    : deriveAccent(brandHex, strategy);

  // Dark mode: brighten accent for contrast on dark backgrounds
  const accentDefault = isDark ? lighten(accentFamily.default, 0.10) : accentFamily.default;
  const accentDarker = isDark ? lighten(accentFamily.darker, 0.06) : accentFamily.darker;
  const accentLighter = isDark ? lighten(accentFamily.lighter, 0.06) : accentFamily.lighter;

  // --- Action = accent or brand (configurable) ---
  const actionBase = options.actionFromBrand ? brandDefault : accentDefault;
  const actionHover = options.actionFromBrand ? brandDarker : accentDarker;
  const actionActive = options.actionFromBrand
    ? darken(brandDefault, 0.12)
    : darken(accentDefault, 0.12);

  // --- Text action (for links, interactive text) — darkened for AA on light bg ---
  const textActionBase = isDark
    ? accentDefault
    : darken(options.actionFromBrand ? brandHex : accentFamily.default, 0.04);
  const textActionHover = darken(textActionBase, 0.06);
  const textActionActive = darken(textActionBase, 0.12);

  // --- Surfaces (OKLCH — M3-inspired surface container hierarchy) ---
  //
  // The key insight from M3: surfaces need VISIBLE steps between levels.
  // M3 uses tone gaps of 4–8 between surface containers.
  // We need ΔL ≥ 0.04 between adjacent surfaces for cards/containers
  // to be distinguishable from the page background.
  //
  // Light mode hierarchy (high to low):
  //   surfaceLight (0.98) → page bg
  //   surfaceLightDarker (0.93) → cards, nav sections, code blocks, playground
  //   surfaceDark (0.35) → dark panels
  //   surfaceDarkDarker (0.25) → deepest
  //
  // Dark mode hierarchy (high to low):
  //   surfaceLight (0.27) → cards, nav sections, elevated content
  //   surfaceLightDarker (0.23) → secondary elevated
  //   surfaceDark (0.18) → page background
  //   surfaceDarkDarker (0.12) → deepest nested
  //
  // ΔL between card (light) and page (dark) = 0.09 — clearly visible
  //
  let surfaceLight: string;
  let surfaceLightDarker: string;
  let surfaceDark: string;
  let surfaceDarkDarker: string;

  if (isDark) {
    surfaceLight = tintedSurface(brandOklch.H, 0.01, 0.27);       // cards/elevated — clearly lighter
    surfaceLightDarker = tintedSurface(brandOklch.H, 0.01, 0.23); // secondary elevated
    surfaceDark = tintedSurface(brandOklch.H, 0.01, 0.18);        // page background
    surfaceDarkDarker = tintedSurface(brandOklch.H, 0.008, 0.12); // deepest
  } else {
    surfaceLight = tintedSurface(brandOklch.H, 0.015, 0.98);      // page bg — brand-tinted near-white
    surfaceLightDarker = tintedSurface(brandOklch.H, 0.012, 0.93); // cards — visible step down
    surfaceDark = tintedSurface(brandOklch.H, 0.015, 0.35);       // dark panels
    surfaceDarkDarker = tintedSurface(brandOklch.H, 0.012, 0.25); // deeper
  }

  // --- Selected highlight — brand-tinted (OKLCH lightness shifts) ---
  const selectedHighlight = isDark
    ? `rgba(${hexToRgb(brandDefault).r}, ${hexToRgb(brandDefault).g}, ${hexToRgb(brandDefault).b}, 0.15)`
    : lighten(desaturate(brandHex, 0.08), 0.25);
  const selectedHighlight_hover = isDark
    ? `rgba(${hexToRgb(brandDefault).r}, ${hexToRgb(brandDefault).g}, ${hexToRgb(brandDefault).b}, 0.25)`
    : lighten(desaturate(brandHex, 0.08), 0.20);

  // --- Focus border = accent ---
  const focusBorderLight = isDark ? accentDefault : accentFamily.default;

  // --- Table cell highlight = brand family ---
  const tableCellHigh = isDark ? brandDefault : lighten(brandHex, 0.15);
  const tableCellMid = isDark
    ? `rgba(${hexToRgb(brandDefault).r}, ${hexToRgb(brandDefault).g}, ${hexToRgb(brandDefault).b}, 0.18)`
    : lighten(desaturate(brandHex, 0.08), 0.25);

  // --- Grid ---
  const gridColor = isDark
    ? rgba(n, 0.30)
    : '#595959';

  // --- Build the colors object ---
  const colors: ThemeColors = {
    brand: {
      default: brandDefault,
      darker: brandDarker,
      lighter: brandLighter,
    },

    accent: {
      default: accentDefault,
      darker: accentDarker,
      lighter: accentLighter,
    },

    surface: {
      light: surfaceLight,
      lightDarker: surfaceLightDarker,
      dark: surfaceDark,
      darkDarker: surfaceDarkDarker,
      highlight: rgba(n, a('surfaceHighlight')),
      frosted: isDark
        ? `rgba(${hexToRgb(surfaceLight).r}, ${hexToRgb(surfaceLight).g}, ${hexToRgb(surfaceLight).b}, 0.60)`
        : `rgba(${hexToRgb(surfaceLight).r}, ${hexToRgb(surfaceLight).g}, ${hexToRgb(surfaceLight).b}, 0.85)`,
      frostedBlur: '12px',
      disabled: {
        onLight: rgba(n, a('surfaceDisabled')),
        onDark: rgba(c, ac('surfaceDisabled')),
      },
      ...(isDark ? DARK_SURFACE_SEMANTIC : LIGHT_SURFACE_SEMANTIC),
    },

    surfaceBorder: isDark ? DARK_SURFACE_BORDER : LIGHT_SURFACE_BORDER,

    text: {
      highEmphasis: {
        onLight: rgba(n, a('textHigh')),
        onDark: isDark ? rgba(c, ac('textHigh')) : '#FFFFFF',
      },
      lowEmphasis: {
        onLight: rgba(n, a('textLow')),
        onDark: rgba(c, ac('textLow')),
      },
      disabled: {
        onLight: rgba(n, a('textDisabled')),
        onDark: rgba(c, ac('textDisabled')),
      },
      action: {
        enabled: textActionBase,
        hover: textActionHover,
        active: textActionActive,
      },
      ...(isDark ? DARK_TEXT_SEMANTIC : LIGHT_TEXT_SEMANTIC),
    },

    border: {
      lowEmphasis: {
        onLight: rgba(n, a('borderLow')),
        onDark: rgba(c, ac('borderLow')),
        hover: {
          onLight: rgba(n, a('borderLowHover')),
          onDark: rgba(c, ac('borderLowHover')),
        },
      },
      midEmphasis: {
        onLight: rgba(n, a('borderMid')),
        onDark: rgba(c, ac('borderMid')),
      },
      highEmphasis: {
        onLight: rgba(n, a('borderHigh')),
        onDark: rgba(c, ac('borderHigh')),
      },
    },

    icon: {
      enabled: {
        onLight: rgba(n, a('iconEnabled')),
        onDark: rgba(c, ac('iconEnabled')),
      },
      hover: {
        onLight: rgba(n, a('iconHover')),
      },
      active: {
        onLight: rgba(n, a('iconActive')),
      },
      selected: {
        onLight: rgba(n, a('iconSelected')),
      },
      disabled: {
        onLight: rgba(n, a('iconDisabled')),
        onDark: rgba(c, ac('iconDisabled')),
      },
      lowEmphasis: {
        enabled: {
          onLight: rgba(n, a('iconLowEmphasis')),
          onDark: rgba(c, ac('iconLowEmphasis')),
        },
      },
    },

    iconBg: isDark ? DARK_ICON_BG : LIGHT_ICON_BG,

    action: {
      enabled: actionBase,
      hover: actionHover,
      active: actionActive,
      important: isDark ? DARK_IMPORTANT_ACTION : LIGHT_IMPORTANT_ACTION,
      monochrome: {
        onLight: {
          enabled: rgba(n, a('monoEnabled')),
          hover: rgba(n, a('monoHover')),
          active: rgba(n, a('monoActive')),
          selected: rgba(n, a('monoSelected')),
          disabled: rgba(n, a('monoDisabled')),
          bg: rgba(n, a('monoBg')),
          lowEmphasis: { enabled: rgba(n, a('monoLowEmphasis')) },
        },
        onDark: {
          enabled: rgba(c, ac('monoEnabled')),
          hover: rgba(c, ac('monoHover')),
          active: rgba(c, ac('monoActive')),
          selected: rgba(c, ac('monoSelected')),
          disabled: rgba(c, ac('monoDisabled')),
          bg: rgba(c, ac('monoBg')),
          lowEmphasis: { enabled: rgba(c, ac('monoLowEmphasis')) },
        },
      },
    },

    status: isDark ? DARK_STATUS : LIGHT_STATUS,
    badge: isDark ? DARK_BADGE : LIGHT_BADGE,
    avatar: DEFAULT_AVATAR,

    dataViz: buildDataViz(brandHex, accentFamily.default, mode),

    cvd: {
      ...CVD_SAFE,
      charcoal: isDark ? '#E0E0E0' : '#323232',
    },

    hover: {
      onLight: rgba(n, a('hover')),
      onDark: rgba(c, ac('hover')),
    },

    selected: {
      onLight: rgba(n, a('selected')),
    },

    selectedHighlight,
    selectedHighlight_hover,

    focusBorder: {
      onLight: focusBorderLight,
      onDark: rgba(c, 0.65),
    },

    scrim: isDark ? 'rgba(0, 0, 0, 0.60)' : rgba(n, a('scrim')),

    scrollbar: {
      enabled: {
        onLight: rgba(n, a('scrollEnabled')),
        onDark: rgba(c, ac('scrollEnabled')),
      },
      hover: {
        onLight: rgba(n, a('scrollHover')),
        onDark: rgba(c, ac('scrollHover')),
      },
      active: {
        onLight: rgba(n, a('scrollActive')),
        onDark: rgba(c, ac('scrollActive')),
      },
    },

    navBackground: isDark
      ? rgba(n, a('surfaceHighlight'))
      : `rgba(${hexToRgb(surfaceLight).r}, ${hexToRgb(surfaceLight).g}, ${hexToRgb(surfaceLight).b}, 0.85)`,
    navBlur: '12px',
    headerBackground: isDark
      ? rgba(n, a('surfaceHighlight'))
      : `rgba(${hexToRgb(surfaceLight).r}, ${hexToRgb(surfaceLight).g}, ${hexToRgb(surfaceLight).b}, 0.85)`,
    headerBlur: '12px',

    navItemText: {
      enabled: {
        onLight: rgba(n, a('navItemText')),
        onDark: rgba(c, ac('navItemText')),
      },
    },

    buttonToggleBg: {
      onLight: rgba(n, a('chipEnabled')),
      onDark: rgba(c, 0.08),
    },

    chipBg: {
      enabled: rgba(n, a('chipEnabled')),
      hover: rgba(n, a('chipHover')),
    },

    progressIndicatorTrack: rgba(n, a('progressTrack')),

    tableCellHighlight: {
      highEmphasis: tableCellHigh,
      midEmphasis: tableCellMid,
    },

    grid: {
      finishedRowText: gridColor,
      packageIconColor: gridColor,
    },
  };

  // Apply color overrides last
  if (options.colorOverrides) {
    return deepMerge(colors, options.colorOverrides as DeepPartial<Record<string, unknown>>) as ThemeColors;
  }

  return colors;
}

// =============================================================================
// buildTheme()
// =============================================================================

export function buildTheme(
  brandHex: string,
  mode: 'light' | 'dark',
  options: ThemeBuildOptions = {},
): ProductTheme {
  const personality = options.personality ?? 'modern';
  const radiusBase = options.radiusBase ?? RADIUS_PRESETS[personality];
  const isDark = mode === 'dark';

  // --- Colors ---
  const colors = buildColors(brandHex, mode, options);

  // --- Typography (personality preset + overrides) ---
  const typographyBase = TYPOGRAPHY_PRESETS[personality];
  const typography = options.typography
    ? deepMerge(typographyBase, options.typography as DeepPartial<Record<string, unknown>>) as ThemeTypography
    : typographyBase;

  // --- Spacing (personality preset + overrides) ---
  const spacingBase = SPACING_PRESETS[personality];
  const spacing: ThemeSpacing = options.spacing
    ? { ...spacingBase, ...options.spacing }
    : spacingBase;

  // --- Icon style (personality preset + overrides) ---
  const iconBase = ICON_PRESETS[personality];
  const iconStyle: ThemeIconStyle = options.iconStyle
    ? { ...iconBase, ...options.iconStyle, overrides: { ...iconBase.overrides, ...(options.iconStyle.overrides ?? {}) } }
    : iconBase;

  // --- Border radius ---
  const borderRadius = buildBorderRadius(radiusBase);

  // --- Elevation ---
  const elevationBase: ThemeElevation = isDark
    ? {
        none: 'none',
        xs: '0px 1px 2px rgba(0, 0, 0, 0.40)',
        sm: '0px 1px 3px rgba(0, 0, 0, 0.50), 0px 1px 2px rgba(0, 0, 0, 0.40)',
        md: '0px 4px 6px -1px rgba(0, 0, 0, 0.50), 0px 2px 4px -1px rgba(0, 0, 0, 0.40)',
        lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.50), 0px 4px 6px -2px rgba(0, 0, 0, 0.35)',
        xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.50), 0px 10px 10px -5px rgba(0, 0, 0, 0.35)',
        '2xl': '0px 25px 50px -12px rgba(0, 0, 0, 0.60)',
        inner: 'inset 0px 2px 4px rgba(0, 0, 0, 0.40)',
        brand: '0px 4px 14px rgba(0, 0, 0, 0.45)',
        brandLg: '0px 10px 25px rgba(0, 0, 0, 0.55)',
      }
    : buildElevation(brandHex);
  const elevation: ThemeElevation = options.elevation
    ? { ...elevationBase, ...options.elevation }
    : elevationBase;

  // --- Component radius ---
  const componentRadius = buildComponentRadius(radiusBase, options.componentRadius);

  // --- Name ---
  const name = options.name ?? `${brandHex.replace('#', '')}-${mode}`;

  return {
    name,
    colors,
    typography,
    borderRadius,
    elevation,
    spacing,
    iconStyle,
    componentRadius,
  };
}
