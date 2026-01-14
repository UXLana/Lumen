/**
 * MTR Design System - Design Tokens
 * Auto-generated from Figma Design System
 * 
 * Renamed from UKG to MTR as per requirements
 */

// =============================================================================
// COLOR TOKENS
// =============================================================================

export const colors = {
  // Brand Colors
  brand: {
    primary: '#13352C',
    primaryLight: '#1A4A3D',
    primaryDark: '#0D2920',
  },

  // Primary Palette (derived from brand)
  primary: {
    50: '#E6F0ED',
    100: '#C2DAD3',
    200: '#9AC3B7',
    300: '#72AC9B',
    400: '#539A85',
    500: '#13352C', // Base brand color
    600: '#2F7A65',
    700: '#276956',
    800: '#1F5847',
    900: '#0D2920',
  },

  // Secondary Palette
  secondary: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FFC107',
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },

  // Neutral Colors
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    1000: '#000000',
  },

  // Semantic Colors
  semantic: {
    success: {
      light: '#E8F5E9',
      main: '#4CAF50',
      dark: '#2E7D32',
      contrast: '#FFFFFF',
    },
    warning: {
      light: '#FFF3E0',
      main: '#FF9800',
      dark: '#E65100',
      contrast: '#000000',
    },
    error: {
      light: '#FFEBEE',
      main: '#F44336',
      dark: '#C62828',
      contrast: '#FFFFFF',
    },
    info: {
      light: '#E3F2FD',
      main: '#2196F3',
      dark: '#1565C0',
      contrast: '#FFFFFF',
    },
  },

  // Text Colors
  text: {
    // On Light backgrounds
    highEmphasis: 'rgba(0, 0, 0, 0.95)',
    mediumEmphasis: 'rgba(0, 0, 0, 0.70)',
    lowEmphasis: 'rgba(0, 0, 0, 0.50)',
    disabled: 'rgba(0, 0, 0, 0.38)',
    
    // On Dark backgrounds
    highEmphasisOnDark: '#FFFFFF',
    mediumEmphasisOnDark: 'rgba(255, 255, 255, 0.74)',
    lowEmphasisOnDark: 'rgba(255, 255, 255, 0.60)',
    disabledOnDark: 'rgba(255, 255, 255, 0.38)',
  },

  // Background Colors
  background: {
    default: '#FFFFFF',
    paper: '#FAFAFA',
    elevated: '#FFFFFF',
    dark: '#13352C',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Border Colors
  border: {
    light: 'rgba(0, 0, 0, 0.12)',
    main: 'rgba(0, 0, 0, 0.23)',
    dark: 'rgba(0, 0, 0, 0.42)',
    focus: '#13352C',
  },
} as const;

// =============================================================================
// TYPOGRAPHY TOKENS
// =============================================================================

export const fontFamilies = {
  display: '"DM Sans", sans-serif',
  body: '"DM Sans", sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const typography = {
  // Display styles - for large headlines and hero text
  display: {
    '2xl': {
      fontFamily: fontFamilies.display,
      fontSize: '64px',
      fontWeight: fontWeights.semibold,
      lineHeight: '76px',
      letterSpacing: '-1.5px',
    },
    xl: {
      fontFamily: fontFamilies.display,
      fontSize: '51px',
      fontWeight: fontWeights.semibold,
      lineHeight: '60px',
      letterSpacing: '-0.8px',
    },
    lg: {
      fontFamily: fontFamilies.display,
      fontSize: '41px',
      fontWeight: fontWeights.semibold,
      lineHeight: '48px',
      letterSpacing: '-0.25px',
    },
    md: {
      fontFamily: fontFamilies.display,
      fontSize: '32px',
      fontWeight: fontWeights.semibold,
      lineHeight: '40px',
      letterSpacing: '-0.7px',
    },
    sm: {
      fontFamily: fontFamilies.display,
      fontSize: '26px',
      fontWeight: fontWeights.semibold,
      lineHeight: '32px',
      letterSpacing: '-0.5px',
    },
    xs: {
      fontFamily: fontFamilies.display,
      fontSize: '23px',
      fontWeight: fontWeights.semibold,
      lineHeight: '28px',
      letterSpacing: '-0.3px',
    },
  },

  // Heading styles
  heading: {
    h1: {
      fontFamily: fontFamilies.display,
      fontSize: '32px',
      fontWeight: fontWeights.semibold,
      lineHeight: '40px',
      letterSpacing: '-0.5px',
    },
    h2: {
      fontFamily: fontFamilies.display,
      fontSize: '28px',
      fontWeight: fontWeights.semibold,
      lineHeight: '36px',
      letterSpacing: '-0.3px',
    },
    h3: {
      fontFamily: fontFamilies.display,
      fontSize: '24px',
      fontWeight: fontWeights.semibold,
      lineHeight: '32px',
      letterSpacing: '-0.2px',
    },
    h4: {
      fontFamily: fontFamilies.display,
      fontSize: '20px',
      fontWeight: fontWeights.semibold,
      lineHeight: '28px',
      letterSpacing: '-0.1px',
    },
    h5: {
      fontFamily: fontFamilies.display,
      fontSize: '18px',
      fontWeight: fontWeights.semibold,
      lineHeight: '24px',
      letterSpacing: '0px',
    },
    h6: {
      fontFamily: fontFamilies.display,
      fontSize: '16px',
      fontWeight: fontWeights.semibold,
      lineHeight: '24px',
      letterSpacing: '0px',
    },
  },

  // Body text styles
  body: {
    xl: {
      fontFamily: fontFamilies.body,
      fontSize: '20px',
      fontWeight: fontWeights.regular,
      lineHeight: '30px',
      letterSpacing: '0px',
    },
    lg: {
      fontFamily: fontFamilies.body,
      fontSize: '18px',
      fontWeight: fontWeights.regular,
      lineHeight: '28px',
      letterSpacing: '0px',
    },
    md: {
      fontFamily: fontFamilies.body,
      fontSize: '16px',
      fontWeight: fontWeights.regular,
      lineHeight: '24px',
      letterSpacing: '0px',
    },
    sm: {
      fontFamily: fontFamilies.body,
      fontSize: '14px',
      fontWeight: fontWeights.regular,
      lineHeight: '20px',
      letterSpacing: '0px',
    },
    xs: {
      fontFamily: fontFamilies.body,
      fontSize: '12px',
      fontWeight: fontWeights.regular,
      lineHeight: '16px',
      letterSpacing: '0.1px',
    },
  },

  // Label/UI styles
  label: {
    lg: {
      fontFamily: fontFamilies.body,
      fontSize: '16px',
      fontWeight: fontWeights.medium,
      lineHeight: '24px',
      letterSpacing: '0.1px',
    },
    md: {
      fontFamily: fontFamilies.body,
      fontSize: '14px',
      fontWeight: fontWeights.medium,
      lineHeight: '20px',
      letterSpacing: '0.1px',
    },
    sm: {
      fontFamily: fontFamilies.body,
      fontSize: '12px',
      fontWeight: fontWeights.medium,
      lineHeight: '16px',
      letterSpacing: '0.2px',
    },
  },

  // Code/Mono styles
  code: {
    lg: {
      fontFamily: fontFamilies.mono,
      fontSize: '16px',
      fontWeight: fontWeights.regular,
      lineHeight: '24px',
      letterSpacing: '0px',
    },
    md: {
      fontFamily: fontFamilies.mono,
      fontSize: '14px',
      fontWeight: fontWeights.regular,
      lineHeight: '20px',
      letterSpacing: '0px',
    },
    sm: {
      fontFamily: fontFamilies.mono,
      fontSize: '12px',
      fontWeight: fontWeights.regular,
      lineHeight: '16px',
      letterSpacing: '0px',
    },
  },
} as const;

// =============================================================================
// SPACING TOKENS
// =============================================================================

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
} as const;

// Semantic spacing aliases
export const spacingSemantics = {
  none: spacing[0],
  xs: spacing[1],
  sm: spacing[2],
  md: spacing[4],
  lg: spacing[6],
  xl: spacing[8],
  '2xl': spacing[12],
  '3xl': spacing[16],
  '4xl': spacing[24],
  
  // Component-specific
  inputPadding: spacing[3],
  buttonPadding: spacing[4],
  cardPadding: spacing[6],
  sectionPadding: spacing[12],
  pagePadding: spacing[16],
  
  // Layout
  gutter: spacing[4],
  containerPadding: spacing[6],
} as const;

// =============================================================================
// BORDER RADIUS TOKENS
// =============================================================================

export const borderRadius = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
} as const;

// Semantic radius aliases
export const borderRadiusSemantics = {
  button: borderRadius.md,
  input: borderRadius.md,
  card: borderRadius.lg,
  modal: borderRadius.xl,
  badge: borderRadius.full,
  avatar: borderRadius.full,
  chip: borderRadius.full,
} as const;

// =============================================================================
// SHADOW TOKENS
// =============================================================================

export const shadows = {
  none: 'none',
  xs: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0px 2px 4px rgba(0, 0, 0, 0.06)',
  
  // Colored shadows using brand
  brand: '0px 4px 14px rgba(19, 53, 44, 0.25)',
  brandLg: '0px 10px 25px rgba(19, 53, 44, 0.3)',
} as const;

// Semantic shadow aliases
export const shadowSemantics = {
  card: shadows.sm,
  cardHover: shadows.md,
  dropdown: shadows.lg,
  modal: shadows.xl,
  button: shadows.xs,
  buttonHover: shadows.sm,
  input: shadows.none,
  inputFocus: `0px 0px 0px 3px ${colors.primary[100]}`,
} as const;

// =============================================================================
// BREAKPOINT TOKENS
// =============================================================================

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Media query helpers
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  
  // Max-width queries
  xsMax: `@media (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
  smMax: `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  mdMax: `@media (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  lgMax: `@media (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
  xlMax: `@media (max-width: ${parseInt(breakpoints['2xl']) - 1}px)`,
  
  // Device-specific
  mobile: `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.lg})`,
  
  // Feature queries
  hover: '@media (hover: hover)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  dark: '@media (prefers-color-scheme: dark)',
} as const;

// =============================================================================
// Z-INDEX TOKENS
// =============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  header: 300,
  overlay: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
  max: 9999,
} as const;

// =============================================================================
// TRANSITION TOKENS
// =============================================================================

export const transitions = {
  duration: {
    instant: '0ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// Common transition presets
export const transitionPresets = {
  default: `${transitions.duration.normal} ${transitions.timing.easeOut}`,
  fast: `${transitions.duration.fast} ${transitions.timing.easeOut}`,
  slow: `${transitions.duration.slow} ${transitions.timing.easeInOut}`,
  spring: `${transitions.duration.slow} ${transitions.timing.spring}`,
} as const;

// =============================================================================
// COMPONENT TOKENS (MTR System Tokens - renamed from UKG)
// =============================================================================

export const mtrComponents = {
  // Typography component tokens
  text: {
    display: {
      xl: 'mtr_sys_text_display_xl',
      lg: 'mtr_sys_text_display_lg',
      md: 'mtr_sys_text_display_md',
      sm: 'mtr_sys_text_display_sm',
      xs: 'mtr_sys_text_display_xs',
      xlOnDark: 'mtr_sys_text_display_xl_onDark',
      lgOnDark: 'mtr_sys_text_display_lg_onDark',
      mdOnDark: 'mtr_sys_text_display_md_onDark',
      smOnDark: 'mtr_sys_text_display_sm_onDark',
      xsOnDark: 'mtr_sys_text_display_xs_onDark',
    },
    heading: {
      h1: 'mtr_sys_text_heading_h1',
      h2: 'mtr_sys_text_heading_h2',
      h3: 'mtr_sys_text_heading_h3',
      h4: 'mtr_sys_text_heading_h4',
      h5: 'mtr_sys_text_heading_h5',
      h6: 'mtr_sys_text_heading_h6',
    },
    body: {
      xl: 'mtr_sys_text_body_xl',
      lg: 'mtr_sys_text_body_lg',
      md: 'mtr_sys_text_body_md',
      sm: 'mtr_sys_text_body_sm',
      xs: 'mtr_sys_text_body_xs',
    },
    label: {
      lg: 'mtr_sys_text_label_lg',
      md: 'mtr_sys_text_label_md',
      sm: 'mtr_sys_text_label_sm',
    },
  },
  
  // Color component tokens
  color: {
    brand: 'mtr_sys_color_brand',
    brandLight: 'mtr_sys_color_brand_light',
    brandDark: 'mtr_sys_color_brand_dark',
    surface: 'mtr_sys_color_surface',
    surfaceElevated: 'mtr_sys_color_surface_elevated',
    textPrimary: 'mtr_sys_color_text_primary',
    textSecondary: 'mtr_sys_color_text_secondary',
    textDisabled: 'mtr_sys_color_text_disabled',
  },
} as const;

// =============================================================================
// AVATAR TOKENS
// =============================================================================

export const avatar = {
  // Avatar sizes (diameter in px)
  sizes: {
    xl: '96px',
    lg: '72px',
    md: '40px',
    sm: '32px',
    xs: '24px',
  },

  // Typography per size
  typography: {
    xl: {
      fontSize: '36px',
      fontWeight: 600,
      lineHeight: 1,
    },
    lg: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: 1,
    },
    md: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1,
    },
    sm: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: 1,
    },
    xs: {
      fontSize: '11px',
      fontWeight: 600,
      lineHeight: 1,
    },
  },

  // Border radius per size
  borderRadius: {
    xl: '24px',
    lg: '18px',
    md: '10px',
    sm: '8px',
    xs: '6px',
  },

  // Background colors for initials (8 colors)
  colors: {
    1: '#E8F5E9',
    2: '#E3F2FD',
    3: '#FFF3E0',
    4: '#FCE4EC',
    5: '#F3E5F5',
    6: '#E0F7FA',
    7: '#FFF8E1',
    8: '#ECEFF1',
  },

  // Focus ring
  focus: {
    color: '#3086BF',
    width: '3px',
    offset: '4px',
  },

  // Border
  border: {
    width: '2px',
    color: '#FFFFFF',
  },

  // Group settings
  group: {
    overlapRatio: 0.3,
    borderWidth: '2px',
    borderColor: '#FFFFFF',
    maxVisible: 4,
  },
} as const;

// =============================================================================
// BUTTON TOKENS
// =============================================================================

export const button = {
  // Button sizes (from Figma)
  sizes: {
    lg: {
      height: '48px',
      minWidth: '100px',
      paddingX: '16px',
      paddingY: '12px',
      iconSize: '24px',
      gap: '4px',
    },
    md: {
      height: '36px',
      minWidth: '80px',
      paddingX: '12px',
      paddingY: '8px',
      iconSize: '20px',
      gap: '4px',
    },
  },

  // Icon-only button sizes (from Figma)
  iconOnlySizes: {
    lg: {
      size: '40px',
      iconSize: '24px',
    },
    md: {
      size: '32px',
      iconSize: '20px',
    },
  },

  // Typography per size (from Figma - DM Sans SemiBold)
  typography: {
    lg: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '18px',
      letterSpacing: '-0.9px',
    },
    md: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '16px',
      letterSpacing: '-0.35px',
    },
  },

  // Colors per emphasis level - LIGHT MODE (from Figma)
  emphasis: {
    high: {
      enabled: {
        background: '#13352C',
        text: '#FFFFFF',
        border: 'transparent',
      },
      hover: {
        background: '#1A4A3D',
        text: '#FFFFFF',
        border: 'transparent',
      },
      pressed: {
        background: '#0D2920',
        text: '#FFFFFF',
        border: 'transparent',
      },
      disabled: {
        background: '#E0E0E0',
        text: 'rgba(0, 0, 0, 0.38)',
        border: 'transparent',
      },
    },
    mid: {
      // Mid emphasis is FILLED with mint/teal color (#78CFB8)
      enabled: {
        background: '#78CFB8',
        text: '#0B1E19',
        border: 'transparent',
      },
      hover: {
        background: '#68BFA8',
        text: '#0B1E19',
        border: 'transparent',
      },
      pressed: {
        background: '#58AF98',
        text: '#0B1E19',
        border: 'transparent',
      },
      disabled: {
        background: 'rgba(120, 207, 184, 0.38)',
        text: 'rgba(0, 0, 0, 0.38)',
        border: 'transparent',
      },
    },
    low: {
      // Low emphasis is text-only (no background)
      enabled: {
        background: 'transparent',
        text: '#13352C',
        border: 'transparent',
      },
      hover: {
        background: 'rgba(19, 53, 44, 0.08)',
        text: '#13352C',
        border: 'transparent',
      },
      pressed: {
        background: 'rgba(19, 53, 44, 0.16)',
        text: '#13352C',
        border: 'transparent',
      },
      disabled: {
        background: 'transparent',
        text: 'rgba(0, 0, 0, 0.38)',
        border: 'transparent',
      },
    },
  },

  // Colors per emphasis level - DARK MODE (onDark surfaces)
  emphasisOnDark: {
    high: {
      enabled: {
        background: '#FFFFFF',
        text: '#13352C',
        border: 'transparent',
      },
      hover: {
        background: 'rgba(255, 255, 255, 0.9)',
        text: '#13352C',
        border: 'transparent',
      },
      pressed: {
        background: 'rgba(255, 255, 255, 0.8)',
        text: '#13352C',
        border: 'transparent',
      },
      disabled: {
        background: 'rgba(255, 255, 255, 0.38)',
        text: 'rgba(255, 255, 255, 0.38)',
        border: 'transparent',
      },
    },
    mid: {
      // Mid emphasis on dark - FILLED mint/teal with white text
      enabled: {
        background: '#78CFB8',
        text: '#FFFFFF',
        border: 'transparent',
      },
      hover: {
        background: '#68BFA8',
        text: '#FFFFFF',
        border: 'transparent',
      },
      pressed: {
        background: '#58AF98',
        text: '#FFFFFF',
        border: 'transparent',
      },
      disabled: {
        background: 'rgba(120, 207, 184, 0.38)',
        text: 'rgba(255, 255, 255, 0.38)',
        border: 'transparent',
      },
    },
    low: {
      // Low emphasis on dark - text-only with white text
      enabled: {
        background: 'transparent',
        text: '#FFFFFF',
        border: 'transparent',
      },
      hover: {
        background: 'rgba(255, 255, 255, 0.16)',
        text: '#FFFFFF',
        border: 'transparent',
      },
      pressed: {
        background: 'rgba(255, 255, 255, 0.24)',
        text: '#FFFFFF',
        border: 'transparent',
      },
      disabled: {
        background: 'transparent',
        text: 'rgba(255, 255, 255, 0.38)',
        border: 'transparent',
      },
    },
  },

  // Destructive button colors (from Figma)
  destructive: {
    high: {
      enabled: {
        background: '#C10B1E',
        text: '#FFFFFF',
        border: 'transparent',
      },
      hover: {
        background: '#A50A1A',
        text: '#FFFFFF',
        border: 'transparent',
      },
      pressed: {
        background: '#8A0816',
        text: '#FFFFFF',
        border: 'transparent',
      },
      disabled: {
        background: '#E0E0E0',
        text: 'rgba(0, 0, 0, 0.38)',
        border: 'transparent',
      },
    },
    mid: {
      enabled: {
        background: 'transparent',
        text: '#C10B1E',
        border: '#C10B1E',
      },
      hover: {
        background: 'rgba(193, 11, 30, 0.08)',
        text: '#C10B1E',
        border: '#C10B1E',
      },
      pressed: {
        background: 'rgba(193, 11, 30, 0.16)',
        text: '#C10B1E',
        border: '#C10B1E',
      },
      disabled: {
        background: 'transparent',
        text: 'rgba(0, 0, 0, 0.38)',
        border: 'rgba(0, 0, 0, 0.12)',
      },
    },
  },

  // Focus ring (from Figma)
  focus: {
    color: '#3086BF',
    width: '3px',
    offset: '5px',
  },

  // Border radius (from Figma - pill shape)
  borderRadius: '9999px',

  // Transition
  transition: '200ms ease-out',

  // Button group spacing (from Figma)
  group: {
    gap: {
      default: '8px',
      form: '16px',
      formMobile: '16px',
      inline: '8px',
    },
    marginBottom: {
      default: '32px',
      form: '32px',
      formMobile: '16px',
      inline: '0px',
    },
  },
} as const;

// =============================================================================
// TAB TOKENS
// =============================================================================

export const tab = {
  // Tab typography (from Figma - DM Sans SemiBold)
  typography: {
    fontFamily: fontFamilies.display,
    fontSize: '14px',
    fontWeight: fontWeights.semibold,
    lineHeight: '16px',
    letterSpacing: '-0.6px',
  },

  // Tab sizes
  sizes: {
    none: {
      height: '48px',
      paddingX: '16px',
      paddingY: '14px',
      iconSize: '20px',
      gap: '8px',
    },
    top: {
      height: '62px',
      paddingX: '16px',
      paddingY: '8px',
      iconSize: '24px',
      gap: '4px',
    },
    leading: {
      height: '48px',
      paddingX: '16px',
      paddingY: '14px',
      iconSize: '20px',
      gap: '8px',
    },
  },

  // Tab colors - Light mode
  colors: {
    light: {
      active: {
        text: 'rgba(0, 0, 0, 0.95)',
        background: 'transparent',
        indicator: '#13352C',
      },
      inactive: {
        text: 'rgba(0, 0, 0, 0.60)',
        background: 'transparent',
        indicator: 'transparent',
      },
      hover: {
        text: 'rgba(0, 0, 0, 0.80)',
        background: 'rgba(0, 0, 0, 0.04)',
        indicator: 'transparent',
      },
      disabled: {
        text: 'rgba(0, 0, 0, 0.38)',
        background: 'transparent',
        indicator: 'transparent',
      },
    },
    // Dark mode (onDark surfaces)
    dark: {
      active: {
        text: '#FFFFFF',
        background: 'transparent',
        indicator: '#78CFB8',
      },
      inactive: {
        text: 'rgba(255, 255, 255, 0.60)',
        background: 'transparent',
        indicator: 'transparent',
      },
      hover: {
        text: 'rgba(255, 255, 255, 0.80)',
        background: 'rgba(255, 255, 255, 0.08)',
        indicator: 'transparent',
      },
      disabled: {
        text: 'rgba(255, 255, 255, 0.38)',
        background: 'transparent',
        indicator: 'transparent',
      },
    },
    // Inverted tabs
    inverted: {
      active: {
        text: '#13352C',
        background: '#FFFFFF',
        indicator: '#13352C',
      },
      inactive: {
        text: 'rgba(0, 0, 0, 0.60)',
        background: 'transparent',
        indicator: 'transparent',
      },
      hover: {
        text: 'rgba(0, 0, 0, 0.80)',
        background: 'rgba(255, 255, 255, 0.5)',
        indicator: 'transparent',
      },
    },
  },

  // Selected indicator (bottom bar)
  indicator: {
    height: '4px',
    borderRadius: '3px',
    paddingX: '4px',
  },

  // Border radius (top corners only)
  borderRadius: '6px',

  // Focus ring
  focus: {
    color: '#3086BF',
    width: '3px',
    offset: '0px',
    borderRadius: '4px',
  },

  // Badge
  badge: {
    minWidth: '20px',
    height: '20px',
    padding: '4px',
    borderRadius: '10px',
    background: '#FFFFFF',
    innerBackground: 'rgba(0, 0, 0, 0.65)',
    innerBorderRadius: '9px',
    typography: {
      fontSize: '12px',
      fontWeight: fontWeights.bold,
      lineHeight: '12px',
      letterSpacing: '-1px',
      color: '#FFFFFF',
    },
  },

  // Tab bar
  bar: {
    divider: {
      color: 'rgba(0, 0, 0, 0.12)',
      height: '1px',
    },
    scrollArrow: {
      size: '40px',
      iconSize: '24px',
      padding: '8px',
    },
  },

  // Transition
  transition: '200ms ease-out',
} as const;

// =============================================================================
// BANNER TOKENS
// =============================================================================

export const banner = {
  // Banner sizes (from Figma)
  sizes: {
    md: {
      paddingX: '16px',
      paddingY: '12px',
      gap: '12px',
      iconSize: '20px',
    },
    lg: {
      paddingX: '20px',
      paddingY: '16px',
      gap: '16px',
      iconSize: '24px',
    },
  },

  // Typography per size (from Figma - DM Sans)
  typography: {
    md: {
      title: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '20px',
        letterSpacing: '0.1px',
      },
      description: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '20px',
        letterSpacing: '0px',
      },
    },
    lg: {
      title: {
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '0.1px',
      },
      description: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '0px',
      },
    },
  },

  // Colors per variant (from Figma)
  variants: {
    info: {
      background: '#E3F2FD',
      border: '#2196F3',
      icon: '#2196F3',
      title: '#1565C0',
      text: 'rgba(0, 0, 0, 0.95)',
    },
    success: {
      background: '#E8F5E9',
      border: '#4CAF50',
      icon: '#4CAF50',
      title: '#2E7D32',
      text: 'rgba(0, 0, 0, 0.95)',
    },
    warning: {
      background: '#FFF3E0',
      border: '#FF9800',
      icon: '#E65100',
      title: '#E65100',
      text: 'rgba(0, 0, 0, 0.95)',
    },
    error: {
      background: '#FFEBEE',
      border: '#F44336',
      icon: '#F44336',
      title: '#C62828',
      text: 'rgba(0, 0, 0, 0.95)',
    },
  },

  // Spacing (from Figma)
  spacing: {
    titleMarginBottom: '4px',
    actionsMarginTop: '12px',
    actionGap: '8px',
    iconMarginTop: '2px',
  },

  // Border (from Figma - 2px border requirement)
  border: {
    width: '2px',
    radius: '8px',
  },

  // Dismiss button (from Figma)
  dismiss: {
    iconSize: '16px',
    padding: '4px',
    borderRadius: '4px',
    opacity: {
      default: 0.8,
      hover: 1,
    },
    background: {
      default: 'transparent',
      hover: 'rgba(0, 0, 0, 0.08)',
    },
  },

  // Transition
  transition: '200ms ease-out',
} as const;

// =============================================================================
// THEME EXPORT
// =============================================================================

export const theme = {
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
  mtrComponents,
  avatar,
  button,
  tab,
  banner,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
export type Breakpoints = typeof breakpoints;

export default theme;
