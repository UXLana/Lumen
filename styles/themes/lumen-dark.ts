/**
 * Lumen Dark Theme
 * Dark variant of Lumen — warm neutral dark surfaces with brightened orange brand.
 *
 * Brand accent: #FF7043 (brightened deep orange for AA contrast on dark)
 * Accent:       #4DD0E1 (brightened teal-cyan for dark backgrounds)
 * Surfaces:     warm neutral grays (#1E1A18 → #252120 → #302A28 → #3D3533)
 *
 * DS components reference `onLight` tokens for their primary surfaces.
 * We map dark values INTO the `onLight` slots so components render dark
 * without any CSS overrides.
 *
 * Generated 2026-04-02 by theme-generator skill
 */

import type { ProductTheme } from './theme-interface';
import { buildBorderRadius, buildComponentRadius } from './theme-interface';

export const lumenDarkTheme: ProductTheme = {
  name: 'Lumen-Dark',
  colors: {
    // =========================================================================
    // BRAND — Brightened orange for dark backgrounds
    // =========================================================================
    brand: {
      default: '#FF7043',
      darker: '#FF5722',
      lighter: '#FF8A65',
    },

    // =========================================================================
    // ACCENT — Brightened teal-cyan for dark backgrounds
    // =========================================================================
    accent: {
      default: '#4DD0E1',
      darker: '#26C6DA',
      lighter: '#80DEEA',
    },

    // =========================================================================
    // SURFACE — warm neutral dark grays
    // =========================================================================
    surface: {
      light: '#302A28',
      lightDarker: '#252120',
      dark: '#252120',
      darkDarker: '#1E1A18',
      disabled: {
        onLight: 'rgba(255, 255, 255, 0.05)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      info: 'rgba(77, 145, 255, 0.15)',
      success: 'rgba(77, 182, 140, 0.15)',
      warning: 'rgba(230, 130, 0, 0.15)',
      important: 'rgba(255, 87, 34, 0.15)',
    },

    // =========================================================================
    // SURFACE BORDER
    // =========================================================================
    surfaceBorder: {
      info: '#3A5070',
      success: '#2D5E4D',
      warning: '#6E4A1A',
      important: '#6E3020',
    },

    // =========================================================================
    // TEXT
    // =========================================================================
    text: {
      highEmphasis: {
        onLight: '#FFFFFF',
        onDark: '#FFFFFF',
      },
      lowEmphasis: {
        onLight: '#D1CCCB',
        onDark: 'rgba(255, 255, 255, 0.70)',
      },
      disabled: {
        onLight: 'rgba(255, 255, 255, 0.30)',
        onDark: 'rgba(255, 255, 255, 0.30)',
      },
      action: {
        enabled: '#4DD0E1',
        hover: '#80DEEA',
        active: '#26C6DA',
      },
      success: '#66BB9A',
      warning: '#F0A840',
      important: '#FF8A6E',
    },

    // =========================================================================
    // BORDER
    // =========================================================================
    border: {
      lowEmphasis: {
        onLight: '#5A5250',
        onDark: 'rgba(255, 255, 255, 0.25)',
        hover: {
          onLight: '#6E6562',
          onDark: 'rgba(255, 255, 255, 0.40)',
        },
      },
      midEmphasis: {
        onLight: '#6E6562',
        onDark: 'rgba(255, 255, 255, 0.32)',
      },
      highEmphasis: {
        onLight: '#8A807D',
        onDark: 'rgba(255, 255, 255, 0.55)',
      },
    },

    // =========================================================================
    // ICON
    // =========================================================================
    icon: {
      enabled: {
        onLight: '#D1CCCB',
        onDark: 'rgba(255, 255, 255, 0.94)',
      },
      hover: {
        onLight: '#E0DCDB',
      },
      active: {
        onLight: '#FFFFFF',
      },
      selected: {
        onLight: '#FFFFFF',
      },
      disabled: {
        onLight: 'rgba(255, 255, 255, 0.20)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      lowEmphasis: {
        enabled: {
          onLight: '#A19A98',
          onDark: 'rgba(255, 255, 255, 0.65)',
        },
      },
    },

    // =========================================================================
    // ICON BACKGROUNDS
    // =========================================================================
    iconBg: {
      info: 'rgba(77, 145, 255, 0.20)',
      info_onDark: 'rgba(77, 145, 255, 0.25)',
      success: 'rgba(77, 182, 140, 0.20)',
      success_onDark: 'rgba(0, 173, 130, 0.25)',
      warning: 'rgba(230, 130, 0, 0.20)',
      warning_onDark: 'rgba(230, 130, 0, 0.25)',
      important: 'rgba(255, 112, 67, 0.20)',
      important_onDark: 'rgba(255, 112, 67, 0.25)',
    },

    // =========================================================================
    // ACTION — brightened accent for dark backgrounds
    // =========================================================================
    action: {
      enabled: '#4DD0E1',
      hover: '#26C6DA',
      active: '#00ACC1',
      important: {
        enabled: '#FF8A6E',
        hover: '#FF7043',
        active: '#F4511E',
      },
      monochrome: {
        onLight: {
          enabled: 'rgba(255, 255, 255, 0.70)',
          hover: 'rgba(255, 255, 255, 0.85)',
          active: 'rgba(255, 255, 255, 1)',
          selected: 'rgba(255, 255, 255, 1)',
          disabled: 'rgba(255, 255, 255, 0.20)',
          bg: 'rgba(255, 255, 255, 0.08)',
          lowEmphasis: {
            enabled: 'rgba(255, 255, 255, 0.55)',
          },
        },
        onDark: {
          enabled: 'rgba(255, 255, 255, 0.94)',
          hover: 'rgba(255, 255, 255, 1)',
          active: 'rgba(255, 255, 255, 1)',
          selected: 'rgba(255, 255, 255, 1)',
          disabled: 'rgba(255, 255, 255, 0.20)',
          bg: 'rgba(255, 255, 255, 0.09)',
          lowEmphasis: {
            enabled: 'rgba(255, 255, 255, 0.65)',
          },
        },
      },
    },

    // =========================================================================
    // STATUS — lightened for dark background readability
    // =========================================================================
    status: {
      info: '#64B5F6',
      info_onDark: 'rgba(77, 145, 255, 0.25)',
      success: '#66BB9A',
      success_onDark: 'rgba(0, 173, 130, 0.25)',
      warning: '#F0A840',
      warningLight: '#6E4A1A',
      warning_onDark: 'rgba(230, 130, 0, 0.25)',
      important: '#FF8A6E',
      important_onDark: 'rgba(255, 112, 67, 0.25)',
    },

    // =========================================================================
    // BADGE — brightened for dark context
    // =========================================================================
    badge: {
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
    },

    // =========================================================================
    // AVATAR — same as light (pastel backgrounds work in both modes)
    // =========================================================================
    avatar: {
      '01': '#FFE0CC',
      '02': '#FFDBFA',
      '03': '#EFE0FF',
      '04': '#D4F0C8',
      '05': '#B4EAF3',
      '06': '#FFF3CC',
      '07': '#FFCABD',
      '08': '#FFD9B3',
    },

    // =========================================================================
    // DATA VISUALIZATION — orange → teal gradient, brightened for dark
    // =========================================================================
    dataViz: {
      border: '#FFFFFF',
      '01': '#FF7043',
      '02': '#FF8A65',
      '03': '#FFAB91',
      '04': '#FFCCBC',
      '05': '#FFE0B2',
      '06': '#FFF8E1',
      '07': '#E0F7FA',
      '08': '#B2EBF2',
      '09': '#80DEEA',
      '10': '#4DD0E1',
      '11': '#26C6DA',
      '12': '#00ACC1',
      '13': '#0097A7',
      '14': '#00838F',
      '15': '#006064',
    },

    // =========================================================================
    // CVD — standard safe palette, charcoal lightened for dark
    // =========================================================================
    cvd: {
      blue: '#0072B2',
      lightBlue: '#56B4E9',
      yellow: '#F0E442',
      green: '#009E73',
      orange: '#E69F00',
      vermillion: '#D55E00',
      pink: '#CC79A7',
      charcoal: '#E0E0E0',
    },

    // =========================================================================
    // UTILITY TOKENS
    // =========================================================================
    hover: {
      onLight: 'rgba(255, 255, 255, 0.08)',
      onDark: 'rgba(255, 255, 255, 0.15)',
    },

    selected: {
      onLight: 'rgba(255, 255, 255, 0.12)',
    },

    selectedHighlight: 'rgba(255, 112, 67, 0.15)',
    selectedHighlight_hover: 'rgba(255, 112, 67, 0.25)',

    focusBorder: {
      onLight: '#4DD0E1',
      onDark: 'rgba(255, 255, 255, 0.65)',
    },

    scrim: 'rgba(0, 0, 0, 0.50)',

    scrollbar: {
      enabled: { onLight: '#5A5250', onDark: 'rgba(255, 255, 255, 0.43)' },
      hover: { onLight: '#6E6562', onDark: 'rgba(255, 255, 255, 0.58)' },
      active: { onLight: '#8A807D', onDark: 'rgba(255, 255, 255, 0.73)' },
    },

    navItemText: {
      enabled: { onLight: 'rgba(255, 255, 255, 0.72)', onDark: 'rgba(255, 255, 255, 0.88)' },
    },

    buttonToggleBg: {
      onLight: 'rgba(255, 255, 255, 0.08)',
      onDark: 'rgba(255, 255, 255, 0.08)',
    },

    chipBg: {
      enabled: 'rgba(255, 255, 255, 0.08)',
      hover: 'rgba(255, 255, 255, 0.13)',
    },

    progressIndicatorTrack: 'rgba(255, 255, 255, 0.15)',

    tableCellHighlight: {
      highEmphasis: '#FF7043',
      midEmphasis: 'rgba(255, 112, 67, 0.20)',
    },

    grid: {
      finishedRowText: '#A19A98',
      packageIconColor: '#A19A98',
    },
  },

  // ===========================================================================
  // TYPOGRAPHY — DM Sans (matches Lumen light)
  // ===========================================================================
  typography: {
    fontFamilies: {
      display: 'var(--font-dm-sans), sans-serif',
      body: 'var(--font-dm-sans), sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontWeights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    scale: {
      lineHeightTight: '1.2',
      lineHeightNormal: '1.5',
      letterSpacingHeading: '-0.5px',
      letterSpacingBody: '0px',
    },
  },

  // ===========================================================================
  // BORDER RADIUS — base: 4px (matches Lumen light)
  // ===========================================================================
  borderRadius: buildBorderRadius(4),

  // ===========================================================================
  // ELEVATION — pure black shadows at higher opacity for dark context
  // ===========================================================================
  elevation: {
    none: 'none',
    xs: '0px 1px 2px rgba(0, 0, 0, 0.20)',
    sm: '0px 1px 3px rgba(0, 0, 0, 0.30), 0px 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0px 4px 6px -1px rgba(0, 0, 0, 0.30), 0px 2px 4px -1px rgba(0, 0, 0, 0.24)',
    lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.30), 0px 4px 6px -2px rgba(0, 0, 0, 0.20)',
    xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.35), 0px 10px 10px -5px rgba(0, 0, 0, 0.20)',
    '2xl': '0px 25px 50px -12px rgba(0, 0, 0, 0.50)',
    inner: 'inset 0px 2px 4px rgba(0, 0, 0, 0.25)',
    brand: '0px 4px 14px rgba(0, 0, 0, 0.35)',
    brandLg: '0px 10px 25px rgba(0, 0, 0, 0.45)',
  },

  // ===========================================================================
  // SPACING — matches Lumen light
  // ===========================================================================
  spacing: {
    unit: '4px',
    inputPadding: '12px',
    buttonPadding: '16px',
    cardPadding: '24px',
    sectionGap: '48px',
    componentGap: '16px',
  },

  // ===========================================================================
  // ICON STYLE — matches Lumen light
  // ===========================================================================
  iconStyle: {
    set: 'outlined',
    strokeWidth: '1.5',
    cornerStyle: 'round',
    defaultSize: '20',
    overrides: {},
  },

  // ===========================================================================
  // COMPONENT RADIUS — base: 4 (matches Lumen light)
  // ===========================================================================
  componentRadius: buildComponentRadius(4),
};
