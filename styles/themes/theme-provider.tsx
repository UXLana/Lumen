'use client';

import { createContext, useContext, useState, useEffect, useLayoutEffect, useMemo, useCallback, type ReactNode } from 'react';
import type { ProductTheme, ThemeColors, ThemeTypography, ThemeBorderRadius, ThemeElevation, ThemeSpacing, ThemeIconStyle } from './theme-interface';
import { springTheme } from './spring';
import { fallTheme } from './fall';
import { foliageTheme } from './foliage';
import { foliageDarkTheme } from './foliage-dark';
import { lumenTheme } from './lumen';
import { lumenDarkTheme } from './lumen-dark';
import { rainyNightTheme } from './rainy-night';
import { pampasTheme } from './pampas';
import { edenTheme } from './eden';
import { applyAllThemeVars } from './css-vars';

// ---------------------------------------------------------------------------
// Theme registry
// ---------------------------------------------------------------------------

const availableThemes: ProductTheme[] = [lumenTheme, lumenDarkTheme, edenTheme, fallTheme, foliageTheme, foliageDarkTheme, springTheme, pampasTheme, rainyNightTheme];
const themeMap: Record<string, ProductTheme> = Object.fromEntries(
  availableThemes.map((t) => [t.name, t]),
);

export { availableThemes, themeMap };

// ---------------------------------------------------------------------------
// Theme value context (read-only)
// ---------------------------------------------------------------------------

const ThemeContext = createContext<ProductTheme>(lumenDarkTheme);

// ---------------------------------------------------------------------------
// Theme switcher context (set active theme by name)
// ---------------------------------------------------------------------------

interface ThemeSwitcherContextValue {
  themeName: string;
  setThemeName: (name: string) => void;
}

const ThemeSwitcherContext = createContext<ThemeSwitcherContextValue>({
  themeName: 'lumen',
  setThemeName: () => {},
});

// ---------------------------------------------------------------------------
// Provider — simple pass-through for overriding in nested contexts
// ---------------------------------------------------------------------------

interface ThemeProviderProps {
  theme?: ProductTheme;
  children: ReactNode;
}

export function ThemeProvider({ theme = lumenDarkTheme, children }: ThemeProviderProps) {
  const value = useMemo(() => theme, [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ---------------------------------------------------------------------------
// Switchable Provider — manages theme state with localStorage persistence
// ---------------------------------------------------------------------------

interface SwitchableThemeProviderProps {
  children: ReactNode;
}

// Legacy theme name → current name. Two generations of legacy names are
// covered: (1) original capitalized names like "Lumen-Dark" / "Fall" / "Foliage"
// and (2) a short-lived intermediate rename to "earth" / "rid" / "university" /
// "claude-light" that was reverted. All map forward to the current canonical
// lowercase names.
const LEGACY_THEME_NAME_MIGRATIONS: Record<string, string> = {
  // Gen 1 — original capitalized
  'Lumen-Dark': 'lumen-dark',
  'Fall': 'fall',
  'Foliage': 'foliage',
  'Foliage-Dark': 'foliage-dark',
  'Spring': 'spring',
  'Claude-Light': 'pampas',
  'Rainy-Night': 'rainy-night',
  // Gen 2 — short-lived intermediate lowercase names
  'earth': 'fall',
  'rid': 'foliage',
  'rid-dark': 'foliage-dark',
  'university': 'spring',
  'claude-light': 'pampas',
};

export function SwitchableThemeProvider({ children }: SwitchableThemeProviderProps) {
  const [themeName, setThemeNameRaw] = useState('lumen-dark');
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage on mount, migrating legacy names if needed.
  useEffect(() => {
    const stored = localStorage.getItem('ds-theme');
    if (stored) {
      const migrated = LEGACY_THEME_NAME_MIGRATIONS[stored] ?? stored;
      if (themeMap[migrated]) {
        setThemeNameRaw(migrated);
        // Rewrite localStorage so future loads skip the migration.
        if (migrated !== stored) {
          localStorage.setItem('ds-theme', migrated);
        }
      }
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ds-theme', themeName);
    }
  }, [themeName, hydrated]);

  const setThemeName = useCallback((name: string) => {
    if (themeMap[name]) {
      setThemeNameRaw(name);
    }
  }, []);

  const activeTheme = useMemo(() => themeMap[themeName] ?? lumenDarkTheme, [themeName]);

  useLayoutEffect(() => {
    applyAllThemeVars(activeTheme, document.documentElement);
  }, [activeTheme]);

  const switcherValue = useMemo(() => ({ themeName, setThemeName }), [themeName, setThemeName]);

  return (
    <ThemeSwitcherContext.Provider value={switcherValue}>
      <ThemeContext.Provider value={activeTheme}>
        {children}
      </ThemeContext.Provider>
    </ThemeSwitcherContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Access the full theme object (name + colors). */
export function useTheme(): ProductTheme {
  return useContext(ThemeContext);
}

/** Shorthand — returns just the colors from the active theme. */
export function useColors(): ThemeColors {
  return useContext(ThemeContext).colors;
}

/** Shorthand — returns just the typography config from the active theme. */
export function useTypography(): ThemeTypography {
  return useContext(ThemeContext).typography;
}

/** Shorthand — returns just the border radius scale from the active theme. */
export function useBorderRadius(): ThemeBorderRadius {
  return useContext(ThemeContext).borderRadius;
}

/** Shorthand — returns just the elevation/shadow scale from the active theme. */
export function useElevation(): ThemeElevation {
  return useContext(ThemeContext).elevation;
}

/** Shorthand — returns just the semantic spacing values from the active theme. */
export function useSpacing(): ThemeSpacing {
  return useContext(ThemeContext).spacing;
}

/** Shorthand — returns just the icon style config from the active theme. */
export function useIconStyle(): ThemeIconStyle {
  return useContext(ThemeContext).iconStyle;
}

/** Access the theme switcher to change the active theme by name. */
export function useThemeSwitcher(): ThemeSwitcherContextValue {
  return useContext(ThemeSwitcherContext);
}
