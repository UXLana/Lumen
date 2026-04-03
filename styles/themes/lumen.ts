/**
 * Lumen Product Theme
 * Source: mylumen.net brand identity
 *
 * Brand color:  #FF5722 (Deep Orange) — hue 14°, warm, energetic
 * Accent color: #0097A7 (Teal-Cyan)  — complementary strategy (~194°)
 * Personality:  modern — clean sans-serif, moderate radius, standard spacing
 *
 * Generated 2026-04-02 by theme-generator skill
 */

import type { ProductTheme } from './theme-interface';
import { buildBorderRadius, buildComponentRadius, buildElevation } from './theme-interface';

export const lumenTheme: ProductTheme = {
  name: 'lumen',
  colors: {
    // =========================================================================
    // BRAND — Deep Orange family
    // =========================================================================
    brand: {
      default: '#FF5722',
      darker: '#D84315',
      lighter: '#FF8A65',
    },

    // =========================================================================
    // ACCENT — Complementary teal-cyan (~194°)
    // =========================================================================
    accent: {
      default: '#0097A7',
      darker: '#00757A',
      lighter: '#4DB6C4',
    },

    // =========================================================================
    // SURFACE
    // =========================================================================
    surface: {
      light: '#FFFAF8',
      lightDarker: '#F5F0EE',
      dark: '#4A3E3B',
      darkDarker: '#322A28',
      disabled: {
        onLight: 'rgba(0, 0, 0, 0.03)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      info: '#F0F6FF',
      success: '#EDF6F1',
      warning: '#FFF8E1',
      important: '#FFF3F0',
    },

    // =========================================================================
    // SURFACE BORDER
    // =========================================================================
    surfaceBorder: {
      info: '#C8D9FF',
      success: '#B8DCC8',
      warning: '#FFE0A0',
      important: '#FFCABD',
    },

    // =========================================================================
    // TEXT
    // =========================================================================
    text: {
      highEmphasis: {
        onLight: 'rgba(0, 0, 0, 0.95)',
        onDark: '#FFFFFF',
      },
      lowEmphasis: {
        onLight: 'rgba(0, 0, 0, 0.60)',
        onDark: 'rgba(255, 255, 255, 0.70)',
      },
      disabled: {
        onLight: 'rgba(0, 0, 0, 0.30)',
        onDark: 'rgba(255, 255, 255, 0.30)',
      },
      action: {
        enabled: '#007B8A',
        hover: '#006270',
        active: '#004E5A',
      },
      success: '#006B50',
      warning: '#A35C00',
      important: '#C10B1E',
    },

    // =========================================================================
    // BORDER
    // =========================================================================
    border: {
      lowEmphasis: {
        onLight: 'rgba(0, 0, 0, 0.10)',
        onDark: 'rgba(255, 255, 255, 0.10)',
        hover: {
          onLight: 'rgba(0, 0, 0, 0.27)',
          onDark: 'rgba(255, 255, 255, 0.27)',
        },
      },
      midEmphasis: {
        onLight: 'rgba(0, 0, 0, 0.15)',
        onDark: 'rgba(255, 255, 255, 0.15)',
      },
      highEmphasis: {
        onLight: 'rgba(0, 0, 0, 0.42)',
        onDark: 'rgba(255, 255, 255, 0.43)',
      },
    },

    // =========================================================================
    // ICON
    // =========================================================================
    icon: {
      enabled: {
        onLight: 'rgba(0, 0, 0, 0.55)',
        onDark: 'rgba(255, 255, 255, 0.94)',
      },
      hover: {
        onLight: 'rgba(0, 0, 0, 0.65)',
      },
      active: {
        onLight: 'rgba(0, 0, 0, 0.75)',
      },
      selected: {
        onLight: 'rgba(0, 0, 0, 0.85)',
      },
      disabled: {
        onLight: 'rgba(0, 0, 0, 0.20)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      lowEmphasis: {
        enabled: {
          onLight: 'rgba(0, 0, 0, 0.43)',
          onDark: 'rgba(255, 255, 255, 0.65)',
        },
      },
    },

    // =========================================================================
    // ICON BACKGROUNDS
    // =========================================================================
    iconBg: {
      info: '#E3EDFF',
      info_onDark: 'rgba(122, 145, 255, 0.25)',
      success: '#DEEDE4',
      success_onDark: 'rgba(0, 173, 130, 0.25)',
      warning: '#FFF3CC',
      warning_onDark: 'rgba(230, 130, 0, 0.25)',
      important: '#FFE4DB',
      important_onDark: 'rgba(255, 87, 34, 0.25)',
    },

    // =========================================================================
    // ACTION — uses accent (teal) for primary, brand (orange) influences important
    // =========================================================================
    action: {
      enabled: '#0097A7',
      hover: '#00757A',
      active: '#005F66',
      important: {
        enabled: '#C10B1E',
        hover: '#A20919',
        active: '#850715',
      },
      monochrome: {
        onLight: {
          enabled: 'rgba(0, 0, 0, 0.55)',
          hover: 'rgba(0, 0, 0, 0.65)',
          active: 'rgba(0, 0, 0, 0.75)',
          selected: 'rgba(0, 0, 0, 0.85)',
          disabled: 'rgba(0, 0, 0, 0.20)',
          bg: 'rgba(0, 0, 0, 0.08)',
          lowEmphasis: {
            enabled: 'rgba(0, 0, 0, 0.43)',
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
    // STATUS — universal semantics, slightly brand-tinted
    // =========================================================================
    status: {
      info: '#617BFF',
      info_onDark: 'rgba(122, 145, 255, 0.25)',
      success: '#1B7F66',
      success_onDark: 'rgba(0, 173, 130, 0.25)',
      warning: '#CC7300',
      warningLight: '#FFE0A0',
      warning_onDark: 'rgba(230, 130, 0, 0.25)',
      important: '#E53935',
      important_onDark: 'rgba(255, 87, 34, 0.25)',
    },

    // =========================================================================
    // BADGE — 9 hue-spaced colors harmonized with warm orange brand
    // =========================================================================
    badge: {
      info: '#4766FF',
      infoLight: '#DBE2FF',
      success: '#19856B',
      successLight: '#D9EDE6',
      warning: '#E68200',
      warningLight: '#FFF3CC',
      important: '#E53935',
      importantLight: '#FFE4DB',
      aqua: '#0097A7',
      aquaLight: '#B4EAF3',
      green: '#40851E',
      greenLight: '#DAF4CD',
      yellow: '#F59E00',
      yellowLight: '#FFF3CC',
      fuschia: '#CF26B8',
      fuschiaLight: '#FCCFF6',
      purple: '#A14CE1',
      purpleLight: '#EDDCF9',
      charcoal: '#4F4F4F',
      charcoalLight: '#E3E3E3',
    },

    // =========================================================================
    // AVATAR — warm-shifted pastels
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
    // DATA VISUALIZATION — 15 stops: brand orange → accent teal with spread
    // =========================================================================
    dataViz: {
      border: '#000000',
      '01': '#7A1800',
      '02': '#A62800',
      '03': '#D84315',
      '04': '#FF5722',
      '05': '#FF8A65',
      '06': '#FFAB91',
      '07': '#FFCCBC',
      '08': '#FFE0B2',
      '09': '#E0F2F1',
      '10': '#B2DFDB',
      '11': '#80CBC4',
      '12': '#4DB6AC',
      '13': '#0097A7',
      '14': '#00757A',
      '15': '#004D54',
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
      onLight: 'rgba(0, 0, 0, 0.05)',
      onDark: 'rgba(255, 255, 255, 0.15)',
    },

    selected: {
      onLight: 'rgba(0, 0, 0, 0.09)',
    },

    selectedHighlight: '#FFF0EB',
    selectedHighlight_hover: '#FFE0D4',

    focusBorder: {
      onLight: '#0097A7',
      onDark: 'rgba(255, 255, 255, 0.65)',
    },

    scrim: 'rgba(0, 0, 0, 0.34)',

    scrollbar: {
      enabled: {
        onLight: 'rgba(0, 0, 0, 0.42)',
        onDark: 'rgba(255, 255, 255, 0.43)',
      },
      hover: {
        onLight: 'rgba(0, 0, 0, 0.57)',
        onDark: 'rgba(255, 255, 255, 0.58)',
      },
      active: {
        onLight: 'rgba(0, 0, 0, 0.72)',
        onDark: 'rgba(255, 255, 255, 0.73)',
      },
    },

    navItemText: {
      enabled: {
        onLight: 'rgba(0, 0, 0, 0.72)',
        onDark: 'rgba(255, 255, 255, 0.88)',
      },
    },

    buttonToggleBg: {
      onLight: 'rgba(0, 0, 0, 0.08)',
      onDark: 'rgba(255, 255, 255, 0.08)',
    },

    chipBg: {
      enabled: 'rgba(0, 0, 0, 0.08)',
      hover: 'rgba(0, 0, 0, 0.13)',
    },

    progressIndicatorTrack: 'rgba(0, 0, 0, 0.15)',

    tableCellHighlight: {
      highEmphasis: '#FFAB91',
      midEmphasis: '#FFF0EB',
    },

    grid: {
      finishedRowText: '#595959',
      packageIconColor: '#595959',
    },
  },

  // ===========================================================================
  // TYPOGRAPHY — modern personality: DM Sans
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
  // BORDER RADIUS — base: 4px (modern)
  // ===========================================================================
  borderRadius: buildBorderRadius(4),

  // ===========================================================================
  // ELEVATION — brand-tinted shadows (#FF5722)
  // ===========================================================================
  elevation: buildElevation('#FF5722'),

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
  // COMPONENT RADIUS — base: 4
  // ===========================================================================
  componentRadius: buildComponentRadius(4),
};
