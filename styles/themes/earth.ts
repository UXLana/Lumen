/**
 * Earth Product Theme
 * Inspired by a Latin American market scene — warm terracotta, golden maize,
 * corn-husk green, indigo fabric, and woven basket tones.
 *
 * Brand palette: deep sienna (#5E3D24) with earthy warm neutrals,
 * warm off-white (#FBF8F4) page background.
 */

import type { ProductTheme } from './theme-interface';

export const earthTheme: ProductTheme = {
  name: 'earth',
  colors: {
    brand: {
      default: '#4E3B31',
      darker: '#33261F',
      lighter: '#6E5648',
    },

    accent: {
      default: '#2E7D7B',
      darker: '#1A5C5A',
      lighter: '#4DA8A6',
    },

    surface: {
      light: '#FBF8F4',
      lightDarker: '#F0EBE3',
      dark: '#423529',
      darkDarker: '#33261F',
      disabled: {
        onLight: 'rgba(78, 59, 49, 0.03)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      info: '#F2F0F8',
      success: '#F0F6EC',
      warning: '#FDF5E6',
      important: '#FDF2F3',
    },

    surfaceBorder: {
      info: '#D0CCE0',
      success: '#C8DBC0',
      warning: '#F0DDB8',
      important: '#F8CFD3',
    },

    text: {
      highEmphasis: {
        onLight: '#261C14',
        onDark: '#FFFFFF',
      },
      lowEmphasis: {
        onLight: '#594D3F',
        onDark: 'rgba(255, 255, 255, 0.70)',
      },
      disabled: {
        onLight: 'rgba(78, 59, 49, 0.30)',
        onDark: 'rgba(255, 255, 255, 0.30)',
      },
      action: {
        enabled: '#4E3B31',
        hover: '#33261F',
        active: '#261C14',
      },
      success: '#3D6B2E',
      warning: '#8B6914',
      important: '#C10B1E',
    },

    border: {
      lowEmphasis: {
        onLight: '#E0D8CE',
        onDark: 'rgba(255, 255, 255, 0.10)',
        hover: {
          onLight: 'rgba(78, 59, 49, 0.27)',
          onDark: 'rgba(255, 255, 255, 0.27)',
        },
      },
      midEmphasis: {
        onLight: '#C9BFB2',
        onDark: 'rgba(255, 255, 255, 0.15)',
      },
      highEmphasis: {
        onLight: 'rgba(78, 59, 49, 0.42)',
        onDark: 'rgba(255, 255, 255, 0.43)',
      },
    },

    icon: {
      enabled: {
        onLight: '#423529',
        onDark: 'rgba(255, 255, 255, 0.94)',
      },
      hover: {
        onLight: '#33261F',
      },
      active: {
        onLight: '#261C14',
      },
      selected: {
        onLight: '#261C14',
      },
      disabled: {
        onLight: 'rgba(78, 59, 49, 0.20)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      lowEmphasis: {
        enabled: {
          onLight: '#594D3F',
          onDark: 'rgba(255, 255, 255, 0.65)',
        },
      },
    },

    iconBg: {
      info: '#E5E0F0',
      info_onDark: 'rgba(90, 70, 130, 0.25)',
      success: '#DCE8D4',
      success_onDark: 'rgba(74, 110, 50, 0.25)',
      warning: '#F5E8CC',
      warning_onDark: 'rgba(184, 134, 11, 0.25)',
      important: '#FBE4E7',
      important_onDark: 'rgba(248, 104, 118, 0.25)',
    },

    action: {
      enabled: '#4E3B31',
      hover: '#33261F',
      active: '#261C14',
      important: {
        enabled: '#C10B1E',
        hover: '#A20919',
        active: '#850715',
      },
      monochrome: {
        onLight: {
          enabled: 'rgba(78, 59, 49, 0.55)',
          hover: 'rgba(78, 59, 49, 0.65)',
          active: 'rgba(78, 59, 49, 0.75)',
          selected: 'rgba(78, 59, 49, 0.85)',
          disabled: 'rgba(78, 59, 49, 0.20)',
          bg: 'rgba(78, 59, 49, 0.08)',
          lowEmphasis: {
            enabled: 'rgba(78, 59, 49, 0.43)',
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
      info: '#5A4682',
      info_onDark: 'rgba(90, 70, 130, 0.25)',
      success: '#4A6E32',
      success_onDark: 'rgba(74, 110, 50, 0.25)',
      warning: '#B8860B',
      warningLight: '#F5E8CC',
      warning_onDark: 'rgba(184, 134, 11, 0.25)',
      important: '#DC0C22',
      important_onDark: 'rgba(248, 104, 118, 0.25)',
    },

    badge: {
      info: '#5A4682',
      infoLight: '#E5E0F0',
      success: '#4A6E32',
      successLight: '#DCE8D4',
      warning: '#8B6914',
      important: '#C10B1E',
      importantLight: '#FFE3E7',
      aqua: '#2E7D7B',
      aquaLight: '#C4E8E7',
      green: '#5B7A3A',
      greenLight: '#DDE8D0',
      yellow: '#8B6914',
      yellowLight: '#F5E5B0',
      fuschia: '#A0527A',
      fuschiaLight: '#F0D6E5',
      purple: '#6B4D90',
      purpleLight: '#E5D8F2',
      charcoal: '#4A4038',
      charcoalLight: '#DDD8D2',
    },

    avatar: {
      '01': '#D4C8B0',
      '02': '#E8CDD8',
      '03': '#D8CCE5',
      '04': '#C8DDB8',
      '05': '#B8DBD4',
      '06': '#F0DDA0',
      '07': '#E8D0C0',
      '08': '#F0D8B8',
    },

    dataViz: {
      border: '#2A231B',
      '01': '#2A231B',
      '02': '#3D2814',
      '03': '#4A3018',
      '04': '#5E3D24',
      '05': '#8B5E3C',
      '06': '#B07D56',
      '07': '#C4A034',
      '08': '#E8D48A',
      '09': '#7A9A52',
      '10': '#5B7A3A',
      '11': '#4A6E32',
      '12': '#3D5C28',
      '13': '#5A4682',
      '14': '#2E7D7B',
      '15': '#1A5C5A',
    },

    cvd: {
      blue: '#2E7D7B',
      lightBlue: '#6BABA9',
      yellow: '#D4B04A',
      green: '#4A6E32',
      orange: '#C4A034',
      vermillion: '#8B5E3C',
      pink: '#A0527A',
      charcoal: '#3D2814',
    },

    hover: {
      onLight: 'rgba(78, 59, 49, 0.05)',
      onDark: 'rgba(255, 255, 255, 0.15)',
    },

    selected: {
      onLight: 'rgba(78, 59, 49, 0.09)',
    },

    selectedHighlight: '#E8DDD0',
    selectedHighlight_hover: '#D9CCBC',

    focusBorder: {
      onLight: '#2E7D7B',
      onDark: 'rgba(255, 255, 255, 0.65)',
    },

    scrim: 'rgba(78, 59, 49, 0.36)',

    scrollbar: {
      enabled: {
        onLight: 'rgba(78, 59, 49, 0.42)',
        onDark: 'rgba(255, 255, 255, 0.43)',
      },
      hover: {
        onLight: 'rgba(78, 59, 49, 0.57)',
        onDark: 'rgba(255, 255, 255, 0.58)',
      },
      active: {
        onLight: 'rgba(78, 59, 49, 0.72)',
        onDark: 'rgba(255, 255, 255, 0.73)',
      },
    },

    navItemText: {
      enabled: {
        onLight: '#423529',
        onDark: 'rgba(255, 255, 255, 0.88)',
      },
    },

    buttonToggleBg: {
      onLight: '#E8DDD0',
      onDark: 'rgba(255, 255, 255, 0.08)',
    },

    chipBg: {
      enabled: '#E8DDD0',
      hover: '#D9CCBC',
    },

    progressIndicatorTrack: 'rgba(78, 59, 49, 0.15)',

    tableCellHighlight: {
      highEmphasis: '#C4A034',
      midEmphasis: '#E8DDD0',
    },

    grid: {
      finishedRowText: '#594D3F',
      packageIconColor: '#594D3F',
    },
  },
};
