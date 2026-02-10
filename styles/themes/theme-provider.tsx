'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { ProductTheme, ThemeColors } from './theme-interface';
import { traceTheme } from './trace';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ThemeContext = createContext<ProductTheme>(traceTheme);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ThemeProviderProps {
  theme?: ProductTheme;
  children: ReactNode;
}

export function ThemeProvider({ theme = traceTheme, children }: ThemeProviderProps) {
  const value = useMemo(() => theme, [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/** Access the full theme object (name + colors). */
export function useTheme(): ProductTheme {
  return useContext(ThemeContext);
}

/** Shorthand — returns just the colors from the active theme. */
export function useColors(): ThemeColors {
  return useContext(ThemeContext).colors;
}
