/**
 * Earth Product Theme
 * Inspired by deep earth tones — muted soil, stone, and dried foliage.
 *
 * Brand palette: Desaturated dark earth (#463A34) with muted teal accents.
 * Surface: Warm, slightly grayed off-white (#F5F2F0).
 *
 * Visual identity: Artisan/organic — Merriweather serif headings,
 * softer radii, airier spacing, thinner icon strokes.
 */

import type { ProductTheme } from './theme-interface';

export const earthTheme: ProductTheme = {
  name: 'earth',
  colors: {
    brand: {
      default: '#463A34',
      darker: '#2D2520',
      lighter: '#5D4D44',
    },

    accent: {
      default: '#4A6D6C',
      darker: '#2F4847',
      lighter: '#6B8F8E',
    },

    surface: {
      light: '#F5F2F0',
      lightDarker: '#EBE8E6',
      dark: '#38302C',
      darkDarker: '#2D2520',
      disabled: {
        onLight: 'rgba(70, 58, 52, 0.03)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      info: '#F0F2F5',
      success: '#F0F5F0',
      warning: '#F7F5F0',
      important: '#F5F0F0',
    },

    surfaceBorder: {
      info: '#D0D4DC',
      success: '#C8DBC8',
      warning: '#E0D8C8',
      important: '#E0C8CC',
    },

    text: {
      highEmphasis: {
        onLight: '#241E1B',
        onDark: '#FFFFFF',
      },
      lowEmphasis: {
        onLight: '#544A45',
        onDark: 'rgba(255, 255, 255, 0.70)',
      },
      disabled: {
        onLight: 'rgba(70, 58, 52, 0.30)',
        onDark: 'rgba(255, 255, 255, 0.30)',
      },
      action: {
        enabled: '#463A34',
        hover: '#2D2520',
        active: '#241E1B',
      },
      success: '#4A6E4A',
      warning: '#8B7040',
      important: '#A63A3A',
    },

    border: {
      lowEmphasis: {
        onLight: '#DCD6D0',
        onDark: 'rgba(255, 255, 255, 0.10)',
        hover: {
          onLight: 'rgba(70, 58, 52, 0.27)',
          onDark: 'rgba(255, 255, 255, 0.27)',
        },
      },
      midEmphasis: {
        onLight: '#C4BCB6',
        onDark: 'rgba(255, 255, 255, 0.15)',
      },
      highEmphasis: {
        onLight: 'rgba(70, 58, 52, 0.42)',
        onDark: 'rgba(255, 255, 255, 0.43)',
      },
    },

    icon: {
      enabled: {
        onLight: '#38302C',
        onDark: 'rgba(255, 255, 255, 0.94)',
      },
      hover: {
        onLight: '#2D2520',
      },
      active: {
        onLight: '#241E1B',
      },
      selected: {
        onLight: '#241E1B',
      },
      disabled: {
        onLight: 'rgba(70, 58, 52, 0.20)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      lowEmphasis: {
        enabled: {
          onLight: '#544A45',
          onDark: 'rgba(255, 255, 255, 0.65)',
        },
      },
    },

    iconBg: {
      info: '#E0E4EB',
      info_onDark: 'rgba(90, 100, 130, 0.25)',
      success: '#DCE8DC',
      success_onDark: 'rgba(74, 110, 74, 0.25)',
      warning: '#EBE4D0',
      warning_onDark: 'rgba(184, 150, 50, 0.25)',
      important: '#EBD0D4',
      important_onDark: 'rgba(166, 58, 58, 0.25)',
    },

    action: {
      enabled: '#463A34',
      hover: '#2D2520',
      active: '#241E1B',
      important: {
        enabled: '#A63A3A',
        hover: '#8F2E2E',
        active: '#752020',
      },
      monochrome: {
        onLight: {
          enabled: 'rgba(70, 58, 52, 0.55)',
          hover: 'rgba(70, 58, 52, 0.65)',
          active: 'rgba(70, 58, 52, 0.75)',
          selected: 'rgba(70, 58, 52, 0.85)',
          disabled: 'rgba(70, 58, 52, 0.20)',
          bg: 'rgba(70, 58, 52, 0.08)',
          lowEmphasis: {
            enabled: 'rgba(70, 58, 52, 0.43)',
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

    status: {
      info: '#5A6482',
      info_onDark: 'rgba(90, 100, 130, 0.25)',
      success: '#4A6E4A',
      success_onDark: 'rgba(74, 110, 74, 0.25)',
      warning: '#8B7040',
      warningLight: '#EBE4D0',
      warning_onDark: 'rgba(184, 150, 50, 0.25)',
      important: '#A63A3A',
      important_onDark: 'rgba(166, 58, 58, 0.25)',
    },

    badge: {
      info: '#5A6482',
      infoLight: '#E0E4EB',
      success: '#4A6E4A',
      successLight: '#DCE8DC',
      warning: '#8B7040',
      important: '#A63A3A',
      importantLight: '#EBD0D4',
      aqua: '#4A6D6C',
      aquaLight: '#D4E0E0',
      green: '#5B7A5B',
      greenLight: '#DDE8DD',
      yellow: '#8B7040',
      yellowLight: '#EBE4D0',
      fuschia: '#905270',
      fuschiaLight: '#EBD6E0',
      purple: '#6B4D80',
      purpleLight: '#E5D8F0',
      charcoal: '#463A34',
      charcoalLight: '#DCD6D0',
    },

    avatar: {
      '01': '#C4BCB0',
      '02': '#D8C8D0',
      '03': '#C8CCE0',
      '04': '#C0D0B8',
      '05': '#B0D0CC',
      '06': '#E0D0A0',
      '07': '#D8C0B0',
      '08': '#E0D0B0',
    },

    dataViz: {
      border: '#2D2520',
      '01': '#2D2520',
      '02': '#38302C',
      '03': '#463A34',
      '04': '#5D4D44',
      '05': '#7A6050',
      '06': '#9A7D6B',
      '07': '#B09850',
      '08': '#D0B870',
      '09': '#6B8A52',
      '10': '#5B7A4A',
      '11': '#4A6E3A',
      '12': '#3D5C28',
      '13': '#5A6482',
      '14': '#4A6D6C',
      '15': '#2F4847',
    },

    cvd: {
      blue: '#4A6D6C',
      lightBlue: '#7BA0A0',
      yellow: '#C0A040',
      green: '#4A6E4A',
      orange: '#B09030',
      vermillion: '#8B5030',
      pink: '#905270',
      charcoal: '#38302C',
    },

    hover: {
      onLight: 'rgba(70, 58, 52, 0.05)',
      onDark: 'rgba(255, 255, 255, 0.15)',
    },

    selected: {
      onLight: 'rgba(70, 58, 52, 0.09)',
    },

    selectedHighlight: '#E0D6D0',
    selectedHighlight_hover: '#D0C6C0',

    focusBorder: {
      onLight: '#4A6D6C',
      onDark: 'rgba(255, 255, 255, 0.65)',
    },

    scrim: 'rgba(70, 58, 52, 0.36)',

    scrollbar: {
      enabled: {
        onLight: 'rgba(70, 58, 52, 0.42)',
        onDark: 'rgba(255, 255, 255, 0.43)',
      },
      hover: {
        onLight: 'rgba(70, 58, 52, 0.57)',
        onDark: 'rgba(255, 255, 255, 0.58)',
      },
      active: {
        onLight: 'rgba(70, 58, 52, 0.72)',
        onDark: 'rgba(255, 255, 255, 0.73)',
      },
    },

    navItemText: {
      enabled: {
        onLight: '#38302C',
        onDark: 'rgba(255, 255, 255, 0.88)',
      },
    },

    buttonToggleBg: {
      onLight: '#E0D6D0',
      onDark: 'rgba(255, 255, 255, 0.08)',
    },

    chipBg: {
      enabled: '#E0D6D0',
      hover: '#D0C6C0',
    },

    progressIndicatorTrack: 'rgba(70, 58, 52, 0.15)',

    tableCellHighlight: {
      highEmphasis: '#B09850',
      midEmphasis: '#E0D6D0',
    },

    grid: {
      finishedRowText: '#544A45',
      packageIconColor: '#544A45',
    },
  },

  // ===========================================================================
  // TYPOGRAPHY — Artisan: Merriweather for headings, Nunito Sans for body
  // ===========================================================================
  typography: {
    fontFamilies: {
      display: 'var(--font-merriweather), serif',
      body: 'var(--font-nunito-sans), sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontWeights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    scale: {
      lineHeightTight: '1.25',
      lineHeightNormal: '1.6',
      letterSpacingHeading: '-0.3px',
      letterSpacingBody: '0.15px',
    },
  },

  // ===========================================================================
  // BORDER RADIUS — Softer, more organic
  // ===========================================================================
  borderRadius: {
    none: '0px',
    xs: '3px',
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '28px',
    '3xl': '36px',
    full: '9999px',
  },

  // ===========================================================================
  // ELEVATION — Sienna/earth tinted shadows
  // ===========================================================================
  elevation: {
    none: 'none',
    xs: '0px 1px 2px rgba(70, 58, 52, 0.06)',
    sm: '0px 1px 3px rgba(70, 58, 52, 0.1), 0px 1px 2px rgba(70, 58, 52, 0.08)',
    md: '0px 4px 6px -1px rgba(70, 58, 52, 0.1), 0px 2px 4px -1px rgba(70, 58, 52, 0.08)',
    lg: '0px 10px 15px -3px rgba(70, 58, 52, 0.1), 0px 4px 6px -2px rgba(70, 58, 52, 0.06)',
    xl: '0px 20px 25px -5px rgba(70, 58, 52, 0.12), 0px 10px 10px -5px rgba(70, 58, 52, 0.06)',
    '2xl': '0px 25px 50px -12px rgba(70, 58, 52, 0.28)',
    inner: 'inset 0px 2px 4px rgba(70, 58, 52, 0.08)',
    brand: '0px 4px 14px rgba(70, 58, 52, 0.25)',
    brandLg: '0px 10px 25px rgba(70, 58, 52, 0.3)',
  },

  // ===========================================================================
  // SPACING — Airier, more breathing room
  // ===========================================================================
  spacing: {
    unit: '4px',
    inputPadding: '14px',
    buttonPadding: '18px',
    cardPadding: '28px',
    sectionGap: '56px',
    componentGap: '20px',
  },

  // ===========================================================================
  // ICON STYLE — Outlined with thinner strokes for organic feel
  // ===========================================================================
  iconStyle: {
    set: 'outlined',
    strokeWidth: '1.25',
    cornerStyle: 'round',
    defaultSize: '20',
    overrides: {},
  },

  // ===========================================================================
  // COMPONENT RADIUS — Per-theme semantic radius overrides
  // ===========================================================================
  componentRadius: {
    button: '10px',
  },
};
