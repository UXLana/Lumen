/**
 * MTR Design System - Theme Interface
 *
 * Every product theme must implement this interface.
 * Structure matches Figma mtr_sys_color_* taxonomy exactly.
 *
 * To create a new theme:
 * 1. Copy trace.ts as a starting point
 * 2. Override every color value
 * 3. Register it in theme-provider.ts
 */

export interface ThemeColors {
  brand: {
    default: string;
    darker: string;
    lighter: string;
  };

  surface: {
    light: string;
    lightDarker: string;
    dark: string;
    darkDarker: string;
    disabled: {
      onLight: string;
      onDark: string;
    };
    info: string;
    success: string;
    warning: string;
    important: string;
  };

  surfaceBorder: {
    info: string;
    success: string;
    warning: string;
    important: string;
  };

  text: {
    highEmphasis: {
      onLight: string;
      onDark: string;
    };
    lowEmphasis: {
      onLight: string;
      onDark: string;
    };
    disabled: {
      onLight: string;
      onDark: string;
    };
    action: {
      enabled: string;
      hover: string;
      active: string;
    };
    success: string;
    warning: string;
    important: string;
  };

  border: {
    lowEmphasis: {
      onLight: string;
      onDark: string;
      hover: {
        onLight: string;
        onDark: string;
      };
    };
    midEmphasis: {
      onLight: string;
      onDark: string;
    };
    highEmphasis: {
      onLight: string;
      onDark: string;
    };
  };

  icon: {
    enabled: {
      onLight: string;
      onDark: string;
    };
    hover: {
      onLight: string;
    };
    active: {
      onLight: string;
    };
    selected: {
      onLight: string;
    };
    disabled: {
      onLight: string;
      onDark: string;
    };
    lowEmphasis: {
      enabled: {
        onLight: string;
        onDark: string;
      };
    };
  };

  iconBg: {
    info: string;
    info_onDark: string;
    success: string;
    success_onDark: string;
    warning: string;
    warning_onDark: string;
    important: string;
    important_onDark: string;
  };

  action: {
    enabled: string;
    hover: string;
    active: string;
    important: {
      enabled: string;
      hover: string;
      active: string;
    };
    monochrome: {
      onLight: {
        enabled: string;
        hover: string;
        active: string;
        selected: string;
        disabled: string;
        bg: string;
        lowEmphasis: {
          enabled: string;
        };
      };
      onDark: {
        enabled: string;
        hover: string;
        active: string;
        selected: string;
        disabled: string;
        bg: string;
        lowEmphasis: {
          enabled: string;
        };
      };
    };
  };

  status: {
    info: string;
    info_onDark: string;
    success: string;
    success_onDark: string;
    warning: string;
    warningLight: string;
    warning_onDark: string;
    important: string;
    important_onDark: string;
  };

  badge: {
    info: string;
    infoLight: string;
    success: string;
    successLight: string;
    warning: string;
    important: string;
    importantLight: string;
    aqua: string;
    aquaLight: string;
    green: string;
    greenLight: string;
    yellow: string;
    yellowLight: string;
    fuschia: string;
    fuschiaLight: string;
    purple: string;
    purpleLight: string;
    charcoal: string;
    charcoalLight: string;
  };

  avatar: Record<'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08', string>;

  dataViz: {
    border: string;
  } & Record<'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13' | '14' | '15', string>;

  cvd: {
    blue: string;
    lightBlue: string;
    yellow: string;
    green: string;
    orange: string;
    vermillion: string;
    pink: string;
    charcoal: string;
  };

  hover: {
    onLight: string;
    onDark: string;
  };

  selected: {
    onLight: string;
  };

  selectedHighlight: string;
  selectedHighlight_hover: string;

  focusBorder: {
    onLight: string;
    onDark: string;
  };

  scrim: string;

  scrollbar: {
    enabled: { onLight: string; onDark: string };
    hover: { onLight: string; onDark: string };
    active: { onLight: string; onDark: string };
  };

  navItemText: {
    enabled: { onLight: string; onDark: string };
  };

  buttonToggleBg: {
    onLight: string;
    onDark: string;
  };

  chipBg: {
    enabled: string;
    hover: string;
  };

  progressIndicatorTrack: string;

  tableCellHighlight: {
    highEmphasis: string;
    midEmphasis: string;
  };

  grid: {
    finishedRowText: string;
    packageIconColor: string;
  };
}

export interface ProductTheme {
  name: string;
  colors: ThemeColors;
}
