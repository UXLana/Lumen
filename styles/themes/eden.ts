/**
 * Eden Product Theme
 * Source: Eden E-bikes brand identity (eden-website/app/theme/tokens.ts)
 *
 * Brand color:   #4496B7 (Teal)         — hue 197°, cool, beach/leisure
 * Brand darker:  #005A7B (Deep teal)    — user-specified
 * Accent color:  #B96D4C (Earthy brick) — warm counterpoint strategy;
 *                                         balances the cool teal brand with
 *                                         a desaturated terracotta pulled from
 *                                         Eden's pricing-card border treatment
 * Personality:   modern + full-pill buttons/inputs (Eden's signature shape)
 *
 * Generated 2026-04-11 by theme-generator skill
 */

import type { ProductTheme } from './theme-interface';
import { buildBorderRadius, buildComponentRadius, buildElevation } from './theme-interface';

export const edenTheme: ProductTheme = {
  name: 'eden',
  colors: {
    // =========================================================================
    // BRAND — Teal family (#4496B7)
    // =========================================================================
    brand: {
      default: '#4496B7',
      darker: '#005A7B',
      lighter: '#7BB5CC',
    },

    // =========================================================================
    // ACCENT — Earthy brick / terracotta (warm counterpoint to the teal brand)
    // =========================================================================
    accent: {
      default: '#B96D4C',
      darker: '#8C5036',
      lighter: '#D39579',
    },

    // =========================================================================
    // SURFACE
    // =========================================================================
    surface: {
      light: '#FDFAF5',
      lightDarker: 'rgba(140, 80, 54, 0.06)',
      dark: '#0C2A38',
      darkDarker: '#06171F',
      highlight: 'rgba(185, 109, 76, 0.04)',
      frosted: 'rgba(253, 250, 245, 0.85)',
      frostedBlur: '12px',
      disabled: {
        onLight: 'rgba(0, 0, 0, 0.03)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      info: '#E8F4FA',
      success: '#E6F1EB',
      warning: '#FDF5E6',
      important: '#FDECEC',
    },

    // =========================================================================
    // SURFACE BORDER
    // =========================================================================
    surfaceBorder: {
      info: '#BBDCEC',
      success: '#B7D6C3',
      warning: '#F4D9A0',
      important: '#F5B7B7',
    },

    // =========================================================================
    // TEXT — based on Eden's heading #0F142A + body #666666
    // =========================================================================
    text: {
      highEmphasis: {
        onLight: 'rgba(15, 20, 42, 0.95)',
        onDark: '#FFFFFF',
      },
      lowEmphasis: {
        onLight: 'rgba(15, 20, 42, 0.60)',
        onDark: 'rgba(255, 255, 255, 0.70)',
      },
      disabled: {
        onLight: 'rgba(15, 20, 42, 0.30)',
        onDark: 'rgba(255, 255, 255, 0.30)',
      },
      action: {
        enabled: '#117BA6',
        hover: '#0C5D80',
        active: '#08475F',
      },
      success: '#255C3B',
      warning: '#D97706',
      important: '#E53E3E',
    },

    // =========================================================================
    // BORDER
    // =========================================================================
    border: {
      lowEmphasis: {
        onLight: 'rgba(15, 20, 42, 0.10)',
        onDark: 'rgba(255, 255, 255, 0.10)',
        hover: {
          onLight: 'rgba(15, 20, 42, 0.27)',
          onDark: 'rgba(255, 255, 255, 0.27)',
        },
      },
      midEmphasis: {
        onLight: 'rgba(15, 20, 42, 0.15)',
        onDark: 'rgba(255, 255, 255, 0.15)',
      },
      highEmphasis: {
        onLight: 'rgba(15, 20, 42, 0.42)',
        onDark: 'rgba(255, 255, 255, 0.43)',
      },
    },

    // =========================================================================
    // ICON
    // =========================================================================
    icon: {
      enabled: {
        onLight: 'rgba(15, 20, 42, 0.55)',
        onDark: 'rgba(255, 255, 255, 0.94)',
      },
      hover: {
        onLight: 'rgba(15, 20, 42, 0.65)',
      },
      active: {
        onLight: 'rgba(15, 20, 42, 0.75)',
      },
      selected: {
        onLight: '#117BA6',
      },
      disabled: {
        onLight: 'rgba(15, 20, 42, 0.20)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      lowEmphasis: {
        enabled: {
          onLight: 'rgba(15, 20, 42, 0.43)',
          onDark: 'rgba(255, 255, 255, 0.65)',
        },
      },
    },

    // =========================================================================
    // ICON BACKGROUNDS
    // =========================================================================
    iconBg: {
      info: '#E8F4FA',
      info_onDark: 'rgba(68, 150, 183, 0.25)',
      success: '#E6F1EB',
      success_onDark: 'rgba(37, 92, 59, 0.25)',
      warning: '#FDF5E6',
      warning_onDark: 'rgba(217, 119, 6, 0.25)',
      important: '#FDECEC',
      important_onDark: 'rgba(229, 62, 62, 0.25)',
    },

    // =========================================================================
    // ACTION — brand teal for primary, Eden error red for important
    // =========================================================================
    action: {
      enabled: '#4496B7',
      hover: '#1E495E',
      active: '#143447',
      important: {
        enabled: '#E53E3E',
        hover: '#C53030',
        active: '#A22525',
      },
      monochrome: {
        onLight: {
          enabled: 'rgba(15, 20, 42, 0.55)',
          hover: 'rgba(15, 20, 42, 0.65)',
          active: 'rgba(15, 20, 42, 0.75)',
          selected: 'rgba(15, 20, 42, 0.85)',
          disabled: 'rgba(15, 20, 42, 0.20)',
          bg: 'rgba(15, 20, 42, 0.08)',
          lowEmphasis: {
            enabled: 'rgba(15, 20, 42, 0.43)',
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
    // STATUS — Eden's exact semantic colors
    // =========================================================================
    status: {
      info: '#117BA6',
      info_onDark: 'rgba(68, 150, 183, 0.25)',
      success: '#255C3B',
      success_onDark: 'rgba(37, 92, 59, 0.25)',
      warning: '#D97706',
      warningLight: '#FDF5E6',
      warning_onDark: 'rgba(217, 119, 6, 0.25)',
      important: '#E53E3E',
      important_onDark: 'rgba(229, 62, 62, 0.25)',
    },

    // =========================================================================
    // BADGE — 9 hue-spaced colors harmonized with cool teal brand
    // =========================================================================
    badge: {
      info: '#117BA6',
      infoLight: '#E8F4FA',
      success: '#255C3B',
      successLight: '#E6F1EB',
      warning: '#D97706',
      warningLight: '#FDF5E6',
      important: '#E53E3E',
      importantLight: '#FDECEC',
      aqua: '#4496B7',
      aquaLight: '#DAEDF4',
      green: '#3F8A5C',
      greenLight: '#DDEDE3',
      yellow: '#E8A000',
      yellowLight: '#FFF3D1',
      fuschia: '#C6407B',
      fuschiaLight: '#F6D7E3',
      purple: '#7A4FC2',
      purpleLight: '#E4DAF4',
      charcoal: '#4F4F4F',
      charcoalLight: '#E3E3E3',
    },

    // =========================================================================
    // AVATAR — cool-shifted pastels with warm counterpoints
    // =========================================================================
    avatar: {
      '01': '#DAEDF4',
      '02': '#FCEDD9',
      '03': '#E6F1EB',
      '04': '#E4DAF4',
      '05': '#FDECEC',
      '06': '#FFF3D1',
      '07': '#EADFD0',
      '08': '#F6D7E3',
    },

    // =========================================================================
    // DATA VISUALIZATION — 15 stops: deep teal → brand teal → warm counterpoint
    // =========================================================================
    dataViz: {
      border: '#0F142A',
      '01': '#0A2634',
      '02': '#143447',
      '03': '#1E495E',
      '04': '#256873',
      '05': '#117BA6',
      '06': '#4496B7',
      '07': '#7BB5CC',
      '08': '#B3D4E0',
      '09': '#E8F4FA',
      '10': '#FCEDD9',
      '11': '#F0D5AF',
      '12': '#D9A984',
      '13': '#B76E46',
      '14': '#8A4F2F',
      '15': '#5C3420',
    },

    // =========================================================================
    // CVD (colorblind-safe) — standard safe palette
    // =========================================================================
    cvd: {
      blue: '#0072B2',
      lightBlue: '#56B4E9',
      yellow: '#F0E442',
      green: '#009E73',
      orange: '#E69F00',
      vermillion: '#D55E00',
      pink: '#CC79A7',
      charcoal: '#323232',
    },

    // =========================================================================
    // UTILITY TOKENS
    // =========================================================================
    hover: {
      onLight: 'rgba(68, 150, 183, 0.06)',
      onDark: 'rgba(255, 255, 255, 0.15)',
    },

    selected: {
      onLight: 'rgba(68, 150, 183, 0.12)',
    },

    selectedHighlight: '#E8F4FA',
    selectedHighlight_hover: '#FCEDD9',

    focusBorder: {
      onLight: '#4496B7',
      onDark: 'rgba(255, 255, 255, 0.65)',
    },

    scrim: 'rgba(15, 20, 42, 0.34)',

    scrollbar: {
      enabled: {
        onLight: 'rgba(15, 20, 42, 0.42)',
        onDark: 'rgba(255, 255, 255, 0.43)',
      },
      hover: {
        onLight: 'rgba(15, 20, 42, 0.57)',
        onDark: 'rgba(255, 255, 255, 0.58)',
      },
      active: {
        onLight: 'rgba(15, 20, 42, 0.72)',
        onDark: 'rgba(255, 255, 255, 0.73)',
      },
    },

    navBackground: 'rgba(253, 250, 245, 0.85)',
    navBlur: '12px',
    headerBackground: 'rgba(253, 250, 245, 0.85)',
    headerBlur: '12px',

    navItemText: {
      enabled: {
        onLight: 'rgba(15, 20, 42, 0.72)',
        onDark: 'rgba(255, 255, 255, 0.88)',
      },
    },

    buttonToggleBg: {
      onLight: 'rgba(15, 20, 42, 0.08)',
      onDark: 'rgba(255, 255, 255, 0.08)',
    },

    chipBg: {
      enabled: 'rgba(68, 150, 183, 0.10)',
      hover: 'rgba(68, 150, 183, 0.18)',
    },

    progressIndicatorTrack: 'rgba(15, 20, 42, 0.15)',

    tableCellHighlight: {
      highEmphasis: '#B3D4E0',
      midEmphasis: '#E8F4FA',
    },

    grid: {
      finishedRowText: 'rgba(15, 20, 42, 0.45)',
      packageIconColor: 'rgba(15, 20, 42, 0.45)',
    },
  },

  // ===========================================================================
  // TYPOGRAPHY — modern personality: Lato (display) + Inter (body)
  // ===========================================================================
  typography: {
    fontFamilies: {
      display: 'var(--font-lato), "Lato", Georgia, serif',
      body: 'var(--font-inter), "Inter", system-ui, -apple-system, sans-serif',
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
  // BORDER RADIUS — base: 4px (modern)
  // ===========================================================================
  borderRadius: buildBorderRadius(4),

  // ===========================================================================
  // ELEVATION — brand-tinted shadows (#4496B7)
  // ===========================================================================
  elevation: buildElevation('#4496B7'),

  // ===========================================================================
  // SPACING — modern personality
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
  // ICON STYLE — outlined, round corners
  // ===========================================================================
  iconStyle: {
    set: 'outlined',
    strokeWidth: '1.5',
    cornerStyle: 'round',
    defaultSize: '20',
    overrides: {},
  },

  // ===========================================================================
  // COMPONENT RADIUS — base 4 with Eden signature pill override
  // ===========================================================================
  componentRadius: buildComponentRadius(4, {
    button: '9999px',
    input: '9999px',
  }),
};
