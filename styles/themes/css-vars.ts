/**
 * CSS Custom Property utilities for the theme system.
 *
 * flattenThemeColors  – turns a nested ThemeColors object into a flat
 *                       Record<'--mtr-brand-default', '#005151'> map
 *                       (used by the provider to set vars on :root).
 *
 * themeColorsToVarRefs – mirrors the ThemeColors shape but every leaf
 *                        value is `var(--mtr-brand-default)` etc.
 *                        (used by design-tokens.ts so components get
 *                        live CSS variable references).
 */

type NestedRecord = { [key: string]: string | NestedRecord };

export function flattenThemeColors(
  obj: NestedRecord,
  prefix = '--mtr',
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const varName = `${prefix}-${key}`;

    if (typeof value === 'string') {
      result[varName] = value;
    } else {
      Object.assign(result, flattenThemeColors(value, varName));
    }
  }

  return result;
}

export function themeColorsToVarRefs(
  obj: NestedRecord,
  prefix = '--mtr',
): NestedRecord {
  const result: NestedRecord = {};

  for (const [key, value] of Object.entries(obj)) {
    const varName = `${prefix}-${key}`;

    if (typeof value === 'string') {
      result[key] = `var(${varName})`;
    } else {
      result[key] = themeColorsToVarRefs(value, varName);
    }
  }

  return result;
}

export function applyThemeVars(
  colors: NestedRecord,
  target: HTMLElement,
): void {
  const vars = flattenThemeColors(colors);
  for (const [name, value] of Object.entries(vars)) {
    target.style.setProperty(name, value);
  }
}
