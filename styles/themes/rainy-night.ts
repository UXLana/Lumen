/**
 * Rainy Night — Bluish-dark theme with warm orange highlights.
 *
 * Mood: Wet pavement, amber streetlights through rain, neon-reflected puddles.
 * Base bg: #161A22 (cool blue-black). Brand: #FF7043 (warm orange — the streetlight).
 * Accent: #7EB4D8 (slate-blue — the rain). All surfaces are cool-shifted.
 * Borders & overlays: white opacity for consistency across blue-tinted surfaces.
 *
 * Built on the Lumen Dark architecture with surface.highlight for nav/header chrome.
 */

import type { ProductTheme } from './theme-interface';
import { buildBorderRadius, buildComponentRadius } from './theme-interface';

export const rainyNightTheme: ProductTheme = {
  name: 'rainy-night',
  colors: {
    // =========================================================================
    // BRAND — Warm orange (the streetlight cutting through rain)
    // =========================================================================
    brand: {
      default: '#FF7043',
      darker: '#E64A19',
      lighter: '#FF8A65',
    },

    // =========================================================================
    // ACCENT — Slate blue (the rain itself)
    // =========================================================================
    accent: {
      default: '#7EB4D8',
      darker: '#5A9AC4',
      lighter: '#A8D0EC',
    },

    // =========================================================================
    // SURFACE — Cool blue-black solids for modals/dialogs, opacity highlight for chrome
    // =========================================================================
    surface: {
      light: '#1F2530',       // primary surface (cards, modals, dialogs)
      lightDarker: '#1B2029',  // elevated/secondary surface
      dark: '#161A22',         // page background — the night sky
      darkDarker: '#0E1118',   // deepest nested — near black
      highlight: 'rgba(160, 200, 240, 0.08)', // nav/header chrome — cool blue-white glow
      frosted: 'rgba(31, 37, 48, 0.60)',
      frostedBlur: '12px',
      disabled: {
        onLight: 'rgba(180, 210, 240, 0.04)',
        onDark: 'rgba(180, 210, 240, 0.10)',
      },
      info: 'rgba(100, 160, 240, 0.10)',
      success: 'rgba(77, 182, 140, 0.10)',
      warning: 'rgba(230, 150, 50, 0.10)',
      important: 'rgba(255, 87, 34, 0.10)',
    },

    // =========================================================================
    // SURFACE BORDER — muted blue-tinted semantic borders
    // =========================================================================
    surfaceBorder: {
      info: '#2E4060',
      success: '#254E42',
      warning: '#5C421A',
      important: '#5C2E1E',
    },

    // =========================================================================
    // TEXT — cool-white opacity for consistency against blue surfaces
    // =========================================================================
    text: {
      highEmphasis: {
        onLight: 'rgba(210, 225, 240, 0.95)',
        onDark: 'rgba(210, 225, 240, 0.95)',
      },
      lowEmphasis: {
        // WCAG remediation: was 0.55 → 3.76:1. Bumped to clear 4.5:1.
        onLight: 'rgba(180, 200, 220, 0.75)',
        onDark: 'rgba(180, 200, 220, 0.75)',
      },
      disabled: {
        // WCAG remediation: was 0.25 → 1.82:1. Bumped for informational use.
        onLight: 'rgba(180, 200, 220, 0.48)',
        onDark: 'rgba(180, 200, 220, 0.48)',
      },
      action: {
        enabled: '#7EB4D8',
        hover: '#A8D0EC',
        active: '#5A9AC4',
      },
      success: '#66BB9A',
      warning: '#F0A840',
      important: '#FF8A6E',
    },

    // =========================================================================
    // BORDER — cool-white opacity for cohesion across blue surfaces
    // =========================================================================
    border: {
      // Two-tier remediation — see lumen.ts for the full rationale.
      // lowEmphasis = decorative (WCAG 1.4.11 exempt), midEmphasis + highEmphasis = interactive.
      // Base color 180,210,240 matches Rainy Night's cool-white cast.
      lowEmphasis: {
        onLight: 'rgba(180, 210, 240, 0.10)', // decorative — subtle cool hairline
        onDark: 'rgba(180, 210, 240, 0.18)',
        hover: {
          onLight: 'rgba(180, 210, 240, 0.20)',
          onDark: 'rgba(180, 210, 240, 0.35)',
        },
      },
      midEmphasis: {
        onLight: 'rgba(180, 210, 240, 0.48)', // interactive — passes 3:1 for inputs/buttons
        onDark: 'rgba(180, 210, 240, 0.30)',
      },
      highEmphasis: {
        onLight: 'rgba(180, 210, 240, 0.55)', // interactive — focus/selected states
        onDark: 'rgba(180, 210, 240, 0.50)',
      },
    },

    // =========================================================================
    // ICON — cool-cast white opacity
    // =========================================================================
    icon: {
      enabled: {
        onLight: 'rgba(180, 210, 240, 0.55)',
        onDark: 'rgba(210, 225, 240, 0.94)',
      },
      hover: {
        onLight: 'rgba(200, 220, 240, 0.75)',
      },
      active: {
        onLight: 'rgba(210, 225, 240, 0.90)',
      },
      selected: {
        onLight: 'rgba(210, 225, 240, 0.95)',
      },
      disabled: {
        onLight: 'rgba(180, 210, 240, 0.20)',
        onDark: 'rgba(180, 210, 240, 0.20)',
      },
      lowEmphasis: {
        enabled: {
          onLight: 'rgba(180, 210, 240, 0.35)',
          onDark: 'rgba(200, 220, 240, 0.60)',
        },
      },
    },

    // =========================================================================
    // ICON BACKGROUNDS
    // =========================================================================
    iconBg: {
      info: 'rgba(100, 160, 240, 0.20)',
      info_onDark: 'rgba(100, 160, 240, 0.25)',
      success: 'rgba(77, 182, 140, 0.20)',
      success_onDark: 'rgba(0, 173, 130, 0.25)',
      warning: 'rgba(230, 150, 50, 0.20)',
      warning_onDark: 'rgba(230, 150, 50, 0.25)',
      important: 'rgba(255, 112, 67, 0.20)',
      important_onDark: 'rgba(255, 112, 67, 0.25)',
    },

    // =========================================================================
    // ACTION — slate-blue accent for actions
    // =========================================================================
    action: {
      enabled: '#7EB4D8',
      hover: '#5A9AC4',
      active: '#4688B0',
      important: {
        enabled: '#FF8A6E',
        hover: '#FF7043',
        active: '#F4511E',
      },
      monochrome: {
        onLight: {
          enabled: 'rgba(210, 225, 240, 0.70)',
          hover: 'rgba(210, 225, 240, 0.85)',
          active: 'rgba(210, 225, 240, 1)',
          selected: 'rgba(210, 225, 240, 1)',
          disabled: 'rgba(180, 210, 240, 0.20)',
          bg: 'rgba(180, 210, 240, 0.06)',
          lowEmphasis: {
            enabled: 'rgba(180, 210, 240, 0.50)',
          },
        },
        onDark: {
          enabled: 'rgba(210, 225, 240, 0.94)',
          hover: 'rgba(210, 225, 240, 1)',
          active: 'rgba(210, 225, 240, 1)',
          selected: 'rgba(210, 225, 240, 1)',
          disabled: 'rgba(180, 210, 240, 0.20)',
          bg: 'rgba(180, 210, 240, 0.09)',
          lowEmphasis: {
            enabled: 'rgba(200, 220, 240, 0.65)',
          },
        },
      },
    },

    // =========================================================================
    // STATUS — lightened for dark readability
    // =========================================================================
    status: {
      info: '#72B0F0',
      info_onDark: 'rgba(100, 160, 240, 0.25)',
      success: '#66BB9A',
      success_onDark: 'rgba(0, 173, 130, 0.25)',
      warning: '#F0A840',
      warningLight: '#5C421A',
      warning_onDark: 'rgba(230, 150, 50, 0.25)',
      important: '#FF8A6E',
      important_onDark: 'rgba(255, 112, 67, 0.25)',
    },

    // =========================================================================
    // BADGE — brightened for dark context
    // =========================================================================
    badge: {
      info: '#72B0F0',
      infoLight: 'rgba(114, 176, 240, 0.18)',
      success: '#66BB9A',
      successLight: 'rgba(102, 187, 154, 0.18)',
      warning: '#F0A840',
      warningLight: 'rgba(240, 168, 64, 0.18)',
      important: '#FF8A6E',
      importantLight: 'rgba(255, 138, 110, 0.18)',
      aqua: '#7EB4D8',
      aquaLight: 'rgba(126, 180, 216, 0.18)',
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
    // AVATAR — pastel backgrounds (universal)
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
    // DATA VISUALIZATION — orange → blue gradient (rainy night spectrum)
    // =========================================================================
    dataViz: {
      border: '#FFFFFF',
      '01': '#FF7043',
      '02': '#FF8A65',
      '03': '#FFAB91',
      '04': '#FFCCBC',
      '05': '#FFE0CC',
      '06': '#E8EEF5',
      '07': '#C8DAE8',
      '08': '#A8D0EC',
      '09': '#7EB4D8',
      '10': '#5A9AC4',
      '11': '#4688B0',
      '12': '#35769C',
      '13': '#286488',
      '14': '#1C5274',
      '15': '#124060',
    },

    // =========================================================================
    // CVD — standard colorblind-safe palette
    // =========================================================================
    cvd: {
      blue: '#0072B2',
      lightBlue: '#56B4E9',
      yellow: '#F0E442',
      green: '#009E73',
      orange: '#E69F00',
      vermillion: '#D55E00',
      pink: '#CC79A7',
      charcoal: '#D0D8E0',
    },

    // =========================================================================
    // UTILITY TOKENS — cool-blue-tinted opacity system
    // =========================================================================
    hover: {
      onLight: 'rgba(160, 200, 240, 0.06)',
      onDark: 'rgba(160, 200, 240, 0.12)',
    },

    selected: {
      onLight: 'rgba(160, 200, 240, 0.10)',
    },

    // Orange highlight — the streetlight warmth
    selectedHighlight: 'rgba(255, 112, 67, 0.15)',
    selectedHighlight_hover: 'rgba(255, 112, 67, 0.25)',

    focusBorder: {
      onLight: '#7EB4D8',
      onDark: 'rgba(210, 225, 240, 0.65)',
    },

    scrim: 'rgba(10, 14, 20, 0.65)',

    scrollbar: {
      enabled: { onLight: 'rgba(160, 200, 240, 0.12)', onDark: 'rgba(180, 210, 240, 0.35)' },
      hover: { onLight: 'rgba(160, 200, 240, 0.22)', onDark: 'rgba(180, 210, 240, 0.50)' },
      active: { onLight: 'rgba(160, 200, 240, 0.32)', onDark: 'rgba(180, 210, 240, 0.65)' },
    },

    // Nav/header chrome — uses the cool highlight glow
    navBackground: 'rgba(160, 200, 240, 0.08)',
    navBlur: '12px',
    headerBackground: 'rgba(160, 200, 240, 0.08)',
    headerBlur: '12px',

    navItemText: {
      enabled: { onLight: 'rgba(180, 210, 240, 0.65)', onDark: 'rgba(210, 225, 240, 0.85)' },
    },

    buttonToggleBg: {
      onLight: 'rgba(160, 200, 240, 0.06)',
      onDark: 'rgba(160, 200, 240, 0.06)',
    },

    chipBg: {
      enabled: 'rgba(160, 200, 240, 0.06)',
      hover: 'rgba(160, 200, 240, 0.10)',
    },

    progressIndicatorTrack: 'rgba(160, 200, 240, 0.12)',

    tableCellHighlight: {
      highEmphasis: '#FF7043',
      midEmphasis: 'rgba(255, 112, 67, 0.18)',
    },

    grid: {
      finishedRowText: 'rgba(180, 210, 240, 0.30)',
      packageIconColor: 'rgba(180, 210, 240, 0.30)',
    },
  },

  // ===========================================================================
  // TYPOGRAPHY — Space Grotesk + DM Sans (matches Lumen family)
  // ===========================================================================
  typography: {
    fontFamilies: {
      display: 'var(--font-space-grotesk), sans-serif',
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
  // BORDER RADIUS — base: 4px
  // ===========================================================================
  borderRadius: buildBorderRadius(4),

  // ===========================================================================
  // ELEVATION — deep blue-black shadows for rainy night depth
  // ===========================================================================
  elevation: {
    none: 'none',
    xs: '0px 1px 2px rgba(10, 14, 20, 0.45)',
    sm: '0px 1px 3px rgba(10, 14, 20, 0.55), 0px 1px 2px rgba(10, 14, 20, 0.45)',
    md: '0px 4px 6px -1px rgba(10, 14, 20, 0.55), 0px 2px 4px -1px rgba(10, 14, 20, 0.45)',
    lg: '0px 10px 15px -3px rgba(10, 14, 20, 0.55), 0px 4px 6px -2px rgba(10, 14, 20, 0.40)',
    xl: '0px 20px 25px -5px rgba(10, 14, 20, 0.55), 0px 10px 10px -5px rgba(10, 14, 20, 0.40)',
    '2xl': '0px 25px 50px -12px rgba(10, 14, 20, 0.65)',
    inner: 'inset 0px 2px 4px rgba(10, 14, 20, 0.45)',
    brand: '0px 4px 14px rgba(10, 14, 20, 0.50)',
    brandLg: '0px 10px 25px rgba(10, 14, 20, 0.60)',
  },

  // ===========================================================================
  // SPACING
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
  // ICON STYLE
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
