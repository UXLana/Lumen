/**
 * MTR Design System - Design Tokens
 * Source: Trace Design System v2.0 (Figma)
 * https://www.figma.com/design/gc68toINDS8Ovsan5aVPS2/Trace-Design-System-v2.0--wip-
 *
 * Color taxonomy: mtr_sys_color_* (matches Figma variable naming exactly)
 * Typography: DM Sans
 *
 * Last updated: 2026-02-10
 *
 * THEMING:
 * - Colors are themeable per product. See styles/themes/ for the theme system.
 * - Components should use `useColors()` from styles/themes for color access.
 * - The `colors` export below is the Trace theme (default) for static/non-React usage.
 * - Typography, spacing, radius, shadows, breakpoints are shared across all themes.
 *
 * Token extraction via /figma-token-extractor from node 2086-41222 (Color & styles)
 * Taxonomy restructured to match Figma 1:1 — Figma is source of truth for values.
 */

// =============================================================================
// COLOR TOKENS — mtr_sys_color_* (Trace theme default, matches Figma exactly)
// For themed access in components, use `useColors()` from styles/themes
// =============================================================================

export const colors = {
  // ==========================================================================
  // BRAND
  // ==========================================================================
  brand: {
    default: '#005151',             // mtr_sys_color_brand
    darker: '#003133',              // mtr_sys_color_brand_darker
    lighter: '#17978E',             // mtr_sys_color_brand_lighter
    // Backwards compat aliases (deprecated)
    /** @deprecated Use brand.default */
    primary: '#005151',
    /** @deprecated Use brand.lighter */
    primaryLight: '#17978E',
    /** @deprecated Use brand.darker */
    primaryDark: '#003133',
  },

  // ==========================================================================
  // SURFACE
  // ==========================================================================
  surface: {
    light: '#FFFFFF',               // mtr_sys_color_surface_light
    lightDarker: '#F5F5F5',         // mtr_sys_color_surface_lightDarker
    dark: '#4A4A4A',                // mtr_sys_color_surface_dark
    darkDarker: '#323232',          // mtr_sys_color_surface_darkDarker
    disabled: {
      onLight: 'rgba(0, 0, 0, 0.03)',   // mtr_sys_color_surface_disabled_onLight
      onDark: 'rgba(255, 255, 255, 0.20)', // mtr_sys_color_surface_disabled_onDark
    },
    // Status surfaces
    info: '#F4F6FF',                // mtr_sys_color_surface_info
    success: '#EDF6F4',             // mtr_sys_color_surface_success
    warning: '#FCF6ED',             // mtr_sys_color_surface_warning
    important: '#FDF2F3',           // mtr_sys_color_surface_important
    // Backwards compat aliases (deprecated)
    /** @deprecated Use surface.light */
    default: '#FFFFFF',
    /** @deprecated Use surface.lightDarker */
    paper: '#F5F5F5',
    /** @deprecated Use surface.lightDarker */
    elevated: '#F5F5F5',
    /** @deprecated Use surface.darkDarker */
    darkest: '#323232',
  },

  // ==========================================================================
  // SURFACE BORDER (status)
  // ==========================================================================
  surfaceBorder: {
    info: '#D1D9FF',                // mtr_sys_color_surfaceBorder_info
    success: '#C5E2DB',             // mtr_sys_color_surfaceBorder_success
    warning: '#F2DABA',             // mtr_sys_color_surfaceBorder_warning
    important: '#F8CFD3',           // mtr_sys_color_surfaceBorder_important
  },

  // ==========================================================================
  // TEXT
  // ==========================================================================
  text: {
    highEmphasis: {
      onLight: 'rgba(0, 0, 0, 0.95)',     // mtr_sys_color_text_highEmphasis_onLight
      onDark: '#FFFFFF',                    // mtr_sys_color_text_highEmphasis_onDark (100%)
    },
    lowEmphasis: {
      onLight: 'rgba(0, 0, 0, 0.60)',     // mtr_sys_color_text_lowEmphasis_onLight
      onDark: 'rgba(255, 255, 255, 0.70)', // mtr_sys_color_text_lowEmphasis_onDark
    },
    disabled: {
      onLight: 'rgba(0, 0, 0, 0.30)',     // mtr_sys_color_text_disabled_onLight
      onDark: 'rgba(255, 255, 255, 0.30)', // mtr_sys_color_text_disabled_onDark
    },
    // Action text (link/interactive text)
    action: {
      enabled: '#016CA2',           // mtr_sys_color_text_action_enabled
      hover: '#005680',             // mtr_sys_color_text_action_hover
      active: '#00476B',            // mtr_sys_color_text_action_active
    },
    // Status text
    success: '#006B50',             // mtr_sys_color_text_success
    warning: '#A35C00',             // mtr_sys_color_text_warning
    important: '#C10B1E',           // mtr_sys_color_text_important
  },

  // ==========================================================================
  // BORDER
  // ==========================================================================
  border: {
    lowEmphasis: {
      onLight: 'rgba(0, 0, 0, 0.10)',     // mtr_sys_color_border_lowEmphasis_onLight
      onDark: 'rgba(255, 255, 255, 0.10)', // mtr_sys_color_border_lowEmphasis_onDark
      hover: {
        onLight: 'rgba(0, 0, 0, 0.27)',   // mtr_sys_color_border_lowEmphasis_hover_onLight
        onDark: 'rgba(255, 255, 255, 0.27)', // mtr_sys_color_border_lowEmphasis_hover_onDark
      },
    },
    midEmphasis: {
      onLight: 'rgba(0, 0, 0, 0.15)',     // mtr_sys_color_border_midEmphasis_onLight
      onDark: 'rgba(255, 255, 255, 0.15)', // mtr_sys_color_border_midEmphasis_onDark
    },
    highEmphasis: {
      onLight: 'rgba(0, 0, 0, 0.42)',     // mtr_sys_color_border_highEmphasis_onLight
      onDark: 'rgba(255, 255, 255, 0.43)', // mtr_sys_color_border_highEmphasis_onDark
    },
  },

  // ==========================================================================
  // ICON
  // ==========================================================================
  icon: {
    enabled: {
      onLight: 'rgba(0, 0, 0, 0.55)',     // mtr_sys_color_icon_enabled_onLight
      onDark: 'rgba(255, 255, 255, 0.94)', // mtr_sys_color_icon_enabled_onDark
    },
    hover: {
      onLight: 'rgba(0, 0, 0, 0.65)',     // mtr_sys_color_icon_hover_onLight
    },
    active: {
      onLight: 'rgba(0, 0, 0, 0.75)',     // mtr_sys_color_icon_active_onLight
    },
    selected: {
      onLight: 'rgba(0, 0, 0, 0.85)',     // mtr_sys_color_icon_selected_onLight
    },
    disabled: {
      onLight: 'rgba(0, 0, 0, 0.20)',     // mtr_sys_color_icon_disabled_onLight
      onDark: 'rgba(255, 255, 255, 0.20)', // mtr_sys_color_icon_disabled_onDark
    },
    lowEmphasis: {
      enabled: {
        onLight: 'rgba(0, 0, 0, 0.43)',   // mtr_sys_color_icon_lowEmphasis_enabled_onLight
        onDark: 'rgba(255, 255, 255, 0.65)', // mtr_sys_color_icon_lowEmphasis_enabled_onDark
      },
    },
  },

  // ==========================================================================
  // ICON BACKGROUNDS (status)
  // ==========================================================================
  iconBg: {
    info: '#EBEFFF',                       // mtr_sys_color_iconBg_info
    info_onDark: 'rgba(122, 145, 255, 0.25)', // mtr_sys_color_iconBg_info_onDark
    success: '#DEEDE9',                    // mtr_sys_color_iconBg_success
    success_onDark: 'rgba(0, 173, 130, 0.25)', // mtr_sys_color_iconBg_success_onDark
    warning: '#F9ECDC',                    // mtr_sys_color_iconBg_warning
    warning_onDark: 'rgba(230, 130, 0, 0.25)', // mtr_sys_color_iconBg_warning_onDark
    important: '#FBE4E7',                  // mtr_sys_color_iconBg_important
    important_onDark: 'rgba(248, 104, 118, 0.25)', // mtr_sys_color_iconBg_important_onDark
  },

  // ==========================================================================
  // ACTION (interactive/link colors)
  // ==========================================================================
  action: {
    enabled: '#0176B2',             // mtr_sys_color_action_enabled
    hover: '#005C89',               // mtr_sys_color_action_hover
    active: '#004E73',              // mtr_sys_color_action_active
    // Important/destructive actions
    important: {
      enabled: '#C10B1E',           // mtr_sys_color_action_important_enabled
      hover: '#A20919',             // mtr_sys_color_action_important_hover
      active: '#850715',            // mtr_sys_color_action_important_active
    },
    // Monochrome actions (on light)
    monochrome: {
      onLight: {
        enabled: 'rgba(0, 0, 0, 0.55)',   // mtr_sys_color_action_monochrome_enabled_onLight
        hover: 'rgba(0, 0, 0, 0.65)',      // mtr_sys_color_action_monochrome_hover_onLight
        active: 'rgba(0, 0, 0, 0.75)',     // mtr_sys_color_action_monochrome_active_onLight
        selected: 'rgba(0, 0, 0, 0.85)',   // mtr_sys_color_action_monochrome_selected_onLight
        disabled: 'rgba(0, 0, 0, 0.20)',   // mtr_sys_color_action_monochrome_disabled_onLight
        bg: 'rgba(0, 0, 0, 0.08)',         // mtr_sys_color_action_monochrome_bg_onLight
        lowEmphasis: {
          enabled: 'rgba(0, 0, 0, 0.43)',  // mtr_sys_color_action_monochrome_lowEmphasis_enabled_onLight
        },
      },
      onDark: {
        enabled: 'rgba(255, 255, 255, 0.94)',  // mtr_sys_color_action_monochrome_enabled_onDark
        hover: 'rgba(255, 255, 255, 1)',       // mtr_sys_color_action_monochrome_hover_onDark
        active: 'rgba(255, 255, 255, 1)',      // mtr_sys_color_action_monochrome_active_onDark
        selected: 'rgba(255, 255, 255, 1)',    // mtr_sys_color_action_monochrome_selected_onDark
        disabled: 'rgba(255, 255, 255, 0.20)', // mtr_sys_color_action_monochrome_disabled_onDark
        bg: 'rgba(255, 255, 255, 0.09)',       // mtr_sys_color_action_monochrome_bg_onDark
        lowEmphasis: {
          enabled: 'rgba(255, 255, 255, 0.65)', // mtr_sys_color_action_monochrome_lowEmphasis_enabled_onDark
        },
      },
    },
  },

  // ==========================================================================
  // STATUS (semantic status colors)
  // ==========================================================================
  status: {
    info: '#617BFF',                // mtr_sys_color_info
    info_onDark: 'rgba(122, 145, 255, 0.25)', // mtr_sys_color_info_onDark
    success: '#1B7F66',             // mtr_sys_color_success
    success_onDark: 'rgba(0, 173, 130, 0.25)', // mtr_sys_color_success_onDark
    warning: '#CC7300',             // mtr_sys_color_warning
    warningLight: '#F3DCBD',        // mtr_sys_color_warningLight
    warning_onDark: 'rgba(230, 130, 0, 0.25)', // mtr_sys_color_warning_onDark
    important: '#DC0C22',           // mtr_sys_color_important
    important_onDark: 'rgba(248, 104, 118, 0.25)', // mtr_sys_color_important_onDark
  },

  // ==========================================================================
  // BADGE
  // ==========================================================================
  badge: {
    info: '#4766FF',                // mtr_sys_color_badge_info
    infoLight: '#DBE2FF',           // mtr_sys_color_badge_infoLight
    success: '#19856B',             // mtr_sys_color_badge_success
    successLight: '#D9EDE6',        // mtr_sys_color_badge_sucessLight (note: Figma typo "sucess")
    warning: '#AD6200',             // mtr_sys_color_badge_warning
    important: '#E80D24',           // mtr_sys_color_badge_important
    importantLight: '#FFE3E7',      // mtr_sys_color_badge_importantLight
    aqua: '#167F92',                // mtr_sys_color_badge_aqua
    aquaLight: '#B4EAF3',           // mtr_sys_color_badge_aquaLight
    green: '#40851E',               // mtr_sys_color_badge_green
    greenLight: '#DAF4CD',          // mtr_sys_color_badge_greenLight
    yellow: '#8F6F00',              // mtr_sys_color_badge_yellow
    yellowLight: '#FFE68F',         // mtr_sys_color_badge_yellowLight
    fuschia: '#CF26B8',             // mtr_sys_color_badge_fuschia (note: Figma spelling)
    fuschiaLight: '#FCCFF6',        // mtr_sys_color_badge_fuschiaLight
    purple: '#A14CE1',              // mtr_sys_color_badge_purple
    purpleLight: '#EDDCF9',         // mtr_sys_color_badge_purpleLight
    charcoal: '#4F4F4F',            // mtr_sys_color_badge_charcoal
    charcoalLight: '#E3E3E3',       // mtr_sys_color_badge_charcoalLight
  },

  // ==========================================================================
  // AVATAR
  // ==========================================================================
  avatar: {
    '01': '#D6EAFF',               // mtr_sys_color_avatar_01
    '02': '#FFDBFA',               // mtr_sys_color_avatar_02
    '03': '#EFE0FF',               // mtr_sys_color_avatar_03
    '04': '#CFEFC2',               // mtr_sys_color_avatar_04
    '05': '#BEF4ED',               // mtr_sys_color_avatar_05
    '06': '#FFE68F',               // mtr_sys_color_avatar_06
    '07': '#FFE3DB',               // mtr_sys_color_avatar_07
    '08': '#FFE2C2',               // mtr_sys_color_avatar_08
  },

  // ==========================================================================
  // DATA VISUALIZATION
  // ==========================================================================
  dataViz: {
    border: '#000000',              // mtr_sys_color_dataViz_border
    '01': '#001446',                // mtr_sys_color_dataViz_01
    '02': '#062E69',                // mtr_sys_color_dataViz_02
    '03': '#094A8D',                // mtr_sys_color_dataViz_03
    '04': '#0068B2',                // mtr_sys_color_dataViz_04
    '05': '#0094BE',                // mtr_sys_color_dataViz_05
    '06': '#37B9B2',                // mtr_sys_color_dataViz_06
    '07': '#9FD7AB',                // mtr_sys_color_dataViz_07
    '08': '#F0F2BD',                // mtr_sys_color_dataViz_08
    '09': '#F1D89A',                // mtr_sys_color_dataViz_09
    '10': '#EFB777',                // mtr_sys_color_dataViz_10
    '11': '#ED9461',                // mtr_sys_color_dataViz_11
    '12': '#E96959',                // mtr_sys_color_dataViz_12
    '13': '#C74046',                // mtr_sys_color_dataViz_13
    '14': '#95222C',                // mtr_sys_color_dataViz_14
    '15': '#660011',                // mtr_sys_color_dataViz_15
  },

  // ==========================================================================
  // CVD (Color Vision Deficiency) ACCESSIBLE PALETTE
  // ==========================================================================
  cvd: {
    blue: '#0072B2',                // mtr_sys_color_cvd_blue
    lightBlue: '#56B4E9',           // mtr_sys_color_cvd_lightBlue
    yellow: '#F0E442',              // mtr_sys_color_cvd_yellow
    green: '#009E73',               // mtr_sys_color_cvd_green
    orange: '#E69F00',              // mtr_sys_color_cvd_orange
    vermillion: '#D55E00',          // mtr_sys_color_cvd_vermillion
    pink: '#CC79A7',                // mtr_sys_color_cvd_pink
    charcoal: '#323232',            // mtr_sys_color_cvd_charcoal
  },

  // ==========================================================================
  // INTERACTIVE STATE COLORS
  // ==========================================================================
  hover: {
    onLight: 'rgba(0, 0, 0, 0.05)',       // mtr_sys_color_hover_onLight
    onDark: 'rgba(255, 255, 255, 0.15)',   // mtr_sys_color_hover_onDark
  },

  selected: {
    onLight: 'rgba(0, 0, 0, 0.09)',        // mtr_sys_color_selected_onLight
  },

  selectedHighlight: '#E7F2EE',             // mtr_sys_color_selectedHighlight
  selectedHighlight_hover: '#D0E6DE',       // mtr_sys_color_selectedHighlight_hover

  // ==========================================================================
  // FOCUS
  // ==========================================================================
  focusBorder: {
    onLight: '#3086BF',                    // mtr_sys_color_focusBorder_onLight
    onDark: 'rgba(255, 255, 255, 0.65)',   // mtr_sys_color_focusBorder_onDark
  },

  // ==========================================================================
  // SCRIM (overlay)
  // ==========================================================================
  scrim: 'rgba(0, 0, 0, 0.32)',            // mtr_sys_color_scrim

  // ==========================================================================
  // SCROLLBAR
  // ==========================================================================
  scrollbar: {
    enabled: {
      onLight: 'rgba(0, 0, 0, 0.42)',     // mtr_sys_color_scrollbar_enabled_onLight
      onDark: 'rgba(255, 255, 255, 0.43)', // mtr_sys_color_scrollbar_enabled_onDark
    },
    hover: {
      onLight: 'rgba(0, 0, 0, 0.57)',     // mtr_sys_color_scrollbar_hover_onLight
      onDark: 'rgba(255, 255, 255, 0.58)', // mtr_sys_color_scrollbar_hover_onDark
    },
    active: {
      onLight: 'rgba(0, 0, 0, 0.72)',     // mtr_sys_color_scrollbar_active_onLight
      onDark: 'rgba(255, 255, 255, 0.73)', // mtr_sys_color_scrollbar_active_onDark
    },
  },

  // ==========================================================================
  // NAVIGATION
  // ==========================================================================
  navItemText: {
    enabled: {
      onLight: 'rgba(0, 0, 0, 0.72)',     // mtr_sys_color_navItemText_enabled_onLight
      onDark: 'rgba(255, 255, 255, 0.88)', // mtr_sys_color_navItemText_enabled_onDark
    },
  },

  // ==========================================================================
  // COMPONENT-SPECIFIC
  // ==========================================================================
  buttonToggleBg: {
    onLight: 'rgba(0, 0, 0, 0.08)',       // mtr_sys_color_buttonToggleBg_onLight
    onDark: 'rgba(255, 255, 255, 0.08)',   // mtr_sys_color_buttonToggleBg_onDark
  },

  chipBg: {
    enabled: 'rgba(0, 0, 0, 0.08)',       // mtr_sys_color_chipBg_enabled
    hover: 'rgba(0, 0, 0, 0.13)',         // mtr_sys_color_chipBg_hover
  },

  progressIndicatorTrack: 'rgba(0, 0, 0, 0.15)', // mtr_sys_color_progressIndicatorTrack

  // ==========================================================================
  // TABLE
  // ==========================================================================
  tableCellHighlight: {
    highEmphasis: '#78CFB8',        // mtr_sys_color_tableCellHighlight_highEmphasis
    midEmphasis: '#E7F2EE',         // mtr_sys_color_tableCellHighlight_midEmphasis
  },

  // ==========================================================================
  // GRID (A11Y-006 Compliance — project-specific, not from Figma)
  // ==========================================================================
  grid: {
    finishedRowText: '#595959',
    packageIconColor: '#595959',
  },

  // ==========================================================================
  // BACKWARDS-COMPAT ALIASES (deprecated — migrate to new paths)
  // These exist so existing pages don't break during migration.
  // TODO: Remove by v2.0 release — all app/components/ files have been migrated.
  // ==========================================================================
  /** @deprecated Use brand.default */
  kelp: '#005151',
  /** @deprecated Use scrim */
  overlay: 'rgba(0, 0, 0, 0.32)',
  stroke: {
    /** @deprecated Use border.lowEmphasis.onLight */
    light: 'rgba(0, 0, 0, 0.10)',
    /** @deprecated Use border.midEmphasis.onLight */
    default: 'rgba(0, 0, 0, 0.15)',
    /** @deprecated Use border.highEmphasis.onLight */
    dark: 'rgba(0, 0, 0, 0.42)',
  },
  disabled: {
    /** @deprecated Use surface.disabled.onLight */
    surface: 'rgba(0, 0, 0, 0.03)',
    /** @deprecated Use text.disabled.onLight */
    text: 'rgba(0, 0, 0, 0.30)',
    /** @deprecated Use surface.disabled.onDark */
    surfaceOnDark: 'rgba(255, 255, 255, 0.20)',
    /** @deprecated Use text.disabled.onDark */
    textOnDark: 'rgba(255, 255, 255, 0.30)',
  },
  interactive: {
    /** @deprecated Use selectedHighlight + focusBorder */
    selectedInput: {
      background: '#E7F2EE',
      border: '#005151',
    },
    selectedOutput: {
      background: '#005151',
      text: '#FFFFFF',
    },
    /** @deprecated Use focusBorder.onLight */
    focus: '#3086BF',
  },
} as const;

// =============================================================================
// TYPOGRAPHY TOKENS
// =============================================================================

export const fontFamilies = {
  display: '"DM Sans", sans-serif',
  body: '"DM Sans", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
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
  
  // Colored shadows using brand (18, 122, 86 = #127A56)
  brand: '0px 4px 14px rgba(18, 122, 86, 0.25)',
  brandLg: '0px 10px 25px rgba(18, 122, 86, 0.3)',
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
  inputFocus: `0px 0px 0px 3px #C6E7DA`,
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
// COMPONENT TOKENS (MTR System Tokens)
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

  // Background colors for initials (8 colors) - Updated from Figma 2026-01-29
  colors: {
    1: '#D6EAFF',  // Blue
    2: '#FFDBFA',  // Pink
    3: '#EFE0FF',  // Purple
    4: '#CFEFC2',  // Green
    5: '#BEF4ED',  // Teal
    6: '#FFE68F',  // Yellow
    7: '#FFE3DB',  // Peach
    8: '#FFE2C2',  // Orange
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

  // Typography per size (from Figma - DM Sans Semibold)
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
      letterSpacing: '-0.9px',
    },
  },

  // Colors per emphasis level - LIGHT MODE (from Trace Design System v2.0)
  // High emphasis uses brand colors for consistency
  emphasis: {
    high: {
      enabled: {
        background: '#127A56', // colors.brand.default
        text: '#FFFFFF',
        border: 'transparent',
      },
      hover: {
        background: '#1A9A6E', // colors.brand.lighter
        text: '#FFFFFF',
        border: 'transparent',
      },
      pressed: {
        background: '#0E5F44', // colors.brand.darker
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
      // Mid emphasis - FILLED with secondary color (#E7F2EE)
      enabled: {
        background: '#E7F2EE',
        text: '#127A56',
        border: 'transparent',
      },
      hover: {
        background: '#D0E6DE',
        text: '#127A56',
        border: 'transparent',
      },
      pressed: {
        background: '#B8D9CE',
        text: '#127A56',
        border: 'transparent',
      },
      disabled: {
        background: 'rgba(231, 242, 238, 0.38)',
        text: 'rgba(0, 0, 0, 0.38)',
        border: 'transparent',
      },
    },
    low: {
      // Low emphasis is text-only (no background)
      enabled: {
        background: 'transparent',
        text: '#127A56',
        border: 'transparent',
      },
      hover: {
        background: 'rgba(18, 122, 86, 0.08)',
        text: '#127A56',
        border: 'transparent',
      },
      pressed: {
        background: 'rgba(18, 122, 86, 0.16)',
        text: '#127A56',
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
        text: '#127A56',
        border: 'transparent',
      },
      hover: {
        background: 'rgba(255, 255, 255, 0.9)',
        text: '#127A56',
        border: 'transparent',
      },
      pressed: {
        background: 'rgba(255, 255, 255, 0.8)',
        text: '#127A56',
        border: 'transparent',
      },
      disabled: {
        background: 'rgba(255, 255, 255, 0.38)',
        text: 'rgba(255, 255, 255, 0.38)',
        border: 'transparent',
      },
    },
    mid: {
      // Mid emphasis on dark - FILLED with secondary color
      enabled: {
        background: '#E7F2EE',
        text: '#127A56',
        border: 'transparent',
      },
      hover: {
        background: '#D0E6DE',
        text: '#127A56',
        border: 'transparent',
      },
      pressed: {
        background: '#B8D9CE',
        text: '#127A56',
        border: 'transparent',
      },
      disabled: {
        background: 'rgba(231, 242, 238, 0.38)',
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

  // Border radius - pill-like shape for high/mid emphasis buttons
  borderRadius: '10px',

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
        indicator: '#127A56',
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
        text: '#127A56',
        background: '#FFFFFF',
        indicator: '#127A56',
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
// BANNER ICON TOKENS (Contextual Banner Icons from Figma)
// =============================================================================

export const bannerIcon = {
  // Size
  size: '24px',
  padding: '8px',
  borderRadius: '16px',

  // Variants - Light mode
  variants: {
    information: {
      background: '#EBEFFF',
      icon: '#6E61FF',
    },
    success: {
      background: '#DEEDE9',
      icon: '#1B7F66',
    },
    warning: {
      background: '#F9ECDC',
      icon: '#D17600',
    },
    important: {
      background: '#FBE4E7',
      icon: '#DC0C22',
    },
  },

  // Variants - Dark mode (onDark)
  variantsOnDark: {
    information: {
      background: 'rgba(122, 145, 255, 0.25)',
      icon: '#7A91FF',
    },
    success: {
      background: 'rgba(0, 173, 130, 0.25)',
      icon: '#00AD82',
    },
    warning: {
      background: 'rgba(230, 130, 0, 0.25)',
      icon: '#E68200',
    },
    important: {
      background: 'rgba(248, 104, 118, 0.25)',
      icon: '#F86876',
    },
  },
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
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '0.15px',
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
        letterSpacing: '0.15px',
      },
    },
  },

  // Colors per variant - Color surface (from Figma)
  variantsColor: {
    info: {
      surface: '#F4F6FF',
      divider: '#D1D9FF',
      iconBackground: '#EBEFFF',
      icon: '#6E61FF',
    },
    success: {
      surface: '#EDF6F4',
      divider: '#C5E2DB',
      iconBackground: '#DEEDE9',
      icon: '#1B7F66',
    },
    warning: {
      surface: '#FCF6ED',
      divider: '#F2DABA',
      iconBackground: '#F9ECDC',
      icon: '#D17600',
    },
    error: {
      surface: '#FDF2F3',
      divider: '#F8CFD3',
      iconBackground: '#FBE4E7',
      icon: '#DC0C22',
    },
  },

  // Colors per variant - Light surface (from Figma)
  variantsLight: {
    info: {
      surface: '#FFFFFF',
      divider: 'rgba(0, 0, 0, 0.15)',
      iconBackground: '#EBEFFF',
      icon: '#6E61FF',
    },
    success: {
      surface: '#FFFFFF',
      divider: 'rgba(0, 0, 0, 0.15)',
      iconBackground: '#DEEDE9',
      icon: '#1B7F66',
    },
    warning: {
      surface: '#FFFFFF',
      divider: 'rgba(0, 0, 0, 0.15)',
      iconBackground: '#F9ECDC',
      icon: '#D17600',
    },
    error: {
      surface: '#FFFFFF',
      divider: 'rgba(0, 0, 0, 0.15)',
      iconBackground: '#FBE4E7',
      icon: '#DC0C22',
    },
  },

  // Legacy colors per variant (for backwards compatibility)
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

  // Text colors
  text: {
    primary: 'rgba(0, 0, 0, 0.95)',
    action: '#0B1E19',
    // On dark background text colors
    primaryOnDark: 'rgba(255, 255, 255, 0.95)',
    actionOnDark: 'rgba(255, 255, 255, 0.87)',
  },

  // Spacing (from Figma)
  spacing: {
    titleMarginBottom: '4px',
    actionsMarginTop: '12px',
    actionGap: '8px',
    iconMarginTop: '2px',
    iconContainerPadding: '8px',
    contentPaddingLeft: '48px', // Icon container width (40px) + gap (8px)
  },

  // Border (from Figma)
  border: {
    width: '1px',
    radius: {
      inline: '16px',
      fullBleed: '0px',
    },
  },

  // Icon container (from Figma)
  iconContainer: {
    size: '40px',
    borderRadius: '16px',
  },

  // Button styles (from Figma)
  button: {
    paddingX: '8px',
    paddingY: '6px',
    borderRadius: '50px',
    typography: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '16px',
      letterSpacing: '-0.35px',
    },
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
// SIDEBAR TOKENS (Pixel-perfect from Figma)
// =============================================================================

export const sidebar = {
  // Sidebar dimensions (from Figma)
  width: '278px',
  collapsedWidth: '73px',

  // Padding (from Figma)
  padding: {
    x: '16px',
    y: '20px',
  },

  // Logo section
  logo: {
    height: '48px',
    gap: '12px',
  },

  // Navigation item (from Figma)
  navItem: {
    height: '48px',
    paddingX: '24px',
    paddingY: '12px',
    gap: '12px',
    borderRadius: '14.4px',
    iconSize: '24px',
    typography: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: '-0.5px',
    },
    typographyActive: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '24px',
      letterSpacing: '-0.9px',
    },
  },

  // Section
  section: {
    marginTop: '24px',
    labelMarginBottom: '8px',
    labelTypography: {
      fontSize: '12px',
      fontWeight: 600,
      lineHeight: '16px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase' as const,
    },
  },

  // Colors (from Figma)
  colors: {
    background: 'rgba(0, 0, 0, 0.05)',
    backgroundAlt: '#f3f4f5',
    border: 'rgba(0, 0, 0, 0.07)',
    item: {
      default: {
        background: 'transparent',
        text: 'rgba(0, 0, 0, 0.72)',
        icon: 'rgba(0, 0, 0, 0.72)',
      },
      hover: {
        background: 'rgba(0, 0, 0, 0.05)',
        text: 'rgba(0, 0, 0, 0.95)',
        icon: 'rgba(0, 0, 0, 0.95)',
      },
      active: {
        background: 'rgba(0, 0, 0, 0.1)',
        text: 'rgba(0, 0, 0, 0.95)',
        icon: 'rgba(0, 0, 0, 0.95)',
        indicator: '#127A56', // Left accent bar for active state
      },
    },
    // Updated for WCAG 1.4.3 contrast compliance (4.5:1 minimum)
    // Original: rgba(0, 0, 0, 0.50) = ~3.95:1, Updated: rgba(0, 0, 0, 0.65) = ~5.74:1
    sectionLabel: 'rgba(0, 0, 0, 0.65)',
  },

  // Collapsed state icon button (from Figma)
  collapsedIconButton: {
    size: '48px',
    borderRadius: '14.4px',
  },

  // Transition
  transition: '200ms ease-out',
} as const;

// =============================================================================
// HEADER TOKENS
// =============================================================================

export const header = {
  // Dimensions
  height: '64px',

  // Padding
  padding: {
    x: '24px',
    y: '12px',
  },

  // Search bar
  search: {
    width: '400px',
    height: '40px',
    paddingX: '16px',
    paddingY: '10px',
    borderRadius: '20px',
    iconSize: '20px',
    gap: '12px',
    typography: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
    },
    colors: {
      background: '#F5F5F5',
      backgroundFocus: '#FFFFFF',
      border: 'transparent',
      borderFocus: '#127A56',
      placeholder: 'rgba(0, 0, 0, 0.50)',
      text: 'rgba(0, 0, 0, 0.95)',
      icon: 'rgba(0, 0, 0, 0.50)',
    },
  },

  // Icon buttons
  iconButton: {
    size: '40px',
    iconSize: '24px',
    borderRadius: '8px',
    colors: {
      default: {
        background: 'transparent',
        icon: 'rgba(0, 0, 0, 0.70)',
      },
      hover: {
        background: 'rgba(0, 0, 0, 0.04)',
        icon: 'rgba(0, 0, 0, 0.95)',
      },
    },
  },

  // Organization dropdown
  orgDropdown: {
    height: '40px',
    paddingX: '12px',
    borderRadius: '8px',
    gap: '8px',
    typography: {
      name: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '20px',
      },
      label: {
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '16px',
      },
    },
  },

  // Colors
  colors: {
    background: '#FFFFFF',
    border: 'rgba(0, 0, 0, 0.08)',
  },

  // Transition
  transition: '200ms ease-out',
} as const;

// =============================================================================
// STATS CARD TOKENS
// =============================================================================

export const statsCard = {
  // Dimensions
  minWidth: '160px',
  height: '88px',

  // Padding
  padding: {
    x: '20px',
    y: '16px',
  },

  // Icon
  icon: {
    size: '48px',
    containerSize: '48px',
    borderRadius: '12px',
    background: '#F5F5F5',
  },

  // Typography
  typography: {
    label: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
      color: 'rgba(0, 0, 0, 0.60)',
    },
    value: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: '36px',
      color: 'rgba(0, 0, 0, 0.95)',
    },
  },

  // Spacing
  gap: '16px',
  contentGap: '4px',

  // Colors
  colors: {
    background: '#F5F5F5',
    border: 'rgba(0, 0, 0, 0.08)',
  },

  // Border
  borderRadius: '12px',
} as const;

// =============================================================================
// PRODUCT CARD TOKENS
// =============================================================================

export const productCard = {
  // Dimensions
  width: '100%',
  minWidth: '280px',

  // Image area
  image: {
    height: '160px',
    background: '#F5F5F5',
    borderRadius: '8px',
    iconSize: '48px',
    iconColor: 'rgba(0, 0, 0, 0.20)',
  },

  // Content area
  content: {
    padding: '16px',
    gap: '8px',
  },

  // Typography
  typography: {
    brand: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '16px',
      color: 'rgba(0, 0, 0, 0.60)',
    },
    name: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '24px',
      color: 'rgba(0, 0, 0, 0.95)',
    },
    sku: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '16px',
      color: 'rgba(0, 0, 0, 0.50)',
    },
    marketLabel: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '16px',
      color: 'rgba(0, 0, 0, 0.60)',
    },
    marketCount: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '16px',
      color: 'rgba(0, 0, 0, 0.50)',
    },
  },

  // Gap badge
  gapBadge: {
    height: '24px',
    paddingX: '8px',
    borderRadius: '12px',
    background: 'rgba(0, 0, 0, 0.08)',
    typography: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '16px',
      color: 'rgba(0, 0, 0, 0.70)',
    },
  },

  // Tags
  tags: {
    gap: '8px',
    marginTop: '12px',
  },

  // Markets
  markets: {
    marginTop: '12px',
    gap: '8px',
    badge: {
      size: '28px',
      fontSize: '11px',
      fontWeight: 600,
      borderRadius: '4px',
      colors: {
        default: {
          background: '#F5F5F5',
          text: 'rgba(0, 0, 0, 0.70)',
        },
        highlighted: {
          background: '#78CFB8',
          text: '#0B1E19',
        },
      },
    },
  },

  // Border
  border: {
    width: '1px',
    color: 'rgba(0, 0, 0, 0.08)',
    radius: '12px',
  },

  // Hover state
  hover: {
    shadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },

  // Transition
  transition: '200ms ease-out',
} as const;

// =============================================================================
// PAGINATION TOKENS
// =============================================================================

export const pagination = {
  // Container
  height: '40px',
  gap: '16px',

  // Typography
  typography: {
    text: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
      color: 'rgba(0, 0, 0, 0.70)',
    },
    pageInfo: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20px',
      color: 'rgba(0, 0, 0, 0.95)',
    },
  },

  // Dropdown
  dropdown: {
    height: '32px',
    paddingX: '12px',
    borderRadius: '6px',
    gap: '8px',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    background: '#FFFFFF',
  },

  // Navigation buttons
  navButton: {
    size: '32px',
    iconSize: '20px',
    borderRadius: '6px',
    colors: {
      default: {
        background: 'transparent',
        icon: 'rgba(0, 0, 0, 0.50)',
        border: 'rgba(0, 0, 0, 0.12)',
      },
      hover: {
        background: 'rgba(0, 0, 0, 0.04)',
        icon: 'rgba(0, 0, 0, 0.70)',
        border: 'rgba(0, 0, 0, 0.20)',
      },
      disabled: {
        background: 'transparent',
        icon: 'rgba(0, 0, 0, 0.20)',
        border: 'rgba(0, 0, 0, 0.08)',
      },
    },
  },

  // Transition
  transition: '200ms ease-out',
} as const;

// =============================================================================
// STEPPER TOKENS
// =============================================================================

export const stepper = {
  // Step indicator (circular button)
  step: {
    size: '32px',
    borderRadius: '50%',

    // Colors per state (using brand primary #127A56)
    colors: {
      completed: {
        background: '#127A56',
        text: '#FFFFFF',
        border: 'transparent',
      },
      active: {
        background: '#127A56',
        text: '#FFFFFF',
        border: 'transparent',
      },
      pending: {
        background: '#FFFFFF',
        text: 'rgba(0, 0, 0, 0.60)',
        border: 'rgba(0, 0, 0, 0.15)',
      },
      disabled: {
        background: '#FFFFFF',
        text: 'rgba(0, 0, 0, 0.60)',
        border: 'rgba(0, 0, 0, 0.15)',
      },
    },

    // Typography for step number
    typography: {
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '18px',
      letterSpacing: '-0.55px',
    },
  },

  // Connector lines between steps
  connector: {
    width: '2px',

    colors: {
      completed: '#127A56',
      pending: 'rgba(0, 0, 0, 0.15)',
    },
  },

  // Step content area
  content: {
    paddingLeft: '16px',

    // Label typography
    label: {
      active: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '22px',
        letterSpacing: '-0.35px',
        color: 'rgba(0, 0, 0, 0.95)',
      },
      inactive: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '22px',
        letterSpacing: '-0.35px',
        color: 'rgba(0, 0, 0, 0.60)',
      },
    },

    // Metadata typography (optional subtitle)
    metadata: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '18px',
      letterSpacing: '-0.3px',
      color: 'rgba(0, 0, 0, 0.60)',
    },
  },

  // Spacing
  spacing: {
    labelPaddingY: '21px',
    contentGap: '16px',
    buttonGap: '16px',
  },

  // Focus ring
  focus: {
    color: '#3086BF',
    width: '3px',
    offset: '5px',
  },

  // Hover state
  hover: {
    background: 'rgba(18, 122, 86, 0.08)',
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
  bannerIcon,
  banner,
  sidebar,
  header,
  statsCard,
  productCard,
  pagination,
  stepper,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
export type Breakpoints = typeof breakpoints;

export default theme;
