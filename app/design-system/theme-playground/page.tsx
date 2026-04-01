'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { StyleguideLayout, sharedStyles } from '../shared'
import { colors, typography } from '@/styles/design-tokens'
import {
  useTheme,
  useThemeSwitcher,
  availableThemes,
  themeMap,
} from '@/styles/themes'
import type { ProductTheme } from '@/styles/themes'

// =============================================================================
// COLOR UTILS
// =============================================================================

function hexToHSL(hex: string): [number, number, number] {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [h * 360, s * 100, l * 100]
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360; s /= 100; l /= 100
  let r: number, g: number, b: number
  if (s === 0) { r = g = b = l }
  else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  const toHex = (x: number) => { const hex = Math.round(x * 255).toString(16); return hex.length === 1 ? '0' + hex : hex }
  return '#' + toHex(r) + toHex(g) + toHex(b)
}

function deriveDarker(hex: string): string {
  const [h, s, l] = hexToHSL(hex)
  return hslToHex(h, Math.min(s + 5, 100), Math.max(l - 15, 5))
}

function deriveLighter(hex: string): string {
  const [h, s, l] = hexToHSL(hex)
  return hslToHex(h, Math.max(s - 8, 0), Math.min(l + 18, 92))
}

function hexToRgb(hex: string): string {
  return `${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)}`
}

function rgbaToHex(rgba: string): string {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return rgba.startsWith('#') ? rgba : '#000000'
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return '#' + toHex(+match[1]) + toHex(+match[2]) + toHex(+match[3])
}

// =============================================================================
// TYPES
// =============================================================================

interface ThemeEditorState {
  name: string
  brand: { default: string; darker: string; lighter: string }
  accent: { default: string; darker: string; lighter: string }
  surface: {
    light: string; lightDarker: string; dark: string; darkDarker: string
    info: string; success: string; warning: string; important: string
  }
  text: {
    highEmphasis: { onLight: string; onDark: string }
    lowEmphasis: { onLight: string; onDark: string }
    action: { enabled: string; hover: string; active: string }
  }
  action: {
    enabled: string; hover: string; active: string
    important: { enabled: string; hover: string; active: string }
  }
  status: { info: string; success: string; warning: string; important: string }
  badge: {
    info: string; infoLight: string; success: string; successLight: string
    warning: string; important: string; importantLight: string
  }
  focusBorder: { onLight: string }
  selectedHighlight: string
  selectedHighlight_hover: string
  typography: {
    fontFamilies: { display: string; body: string }
    scale: {
      lineHeightTight: string; lineHeightNormal: string
      letterSpacingHeading: string; letterSpacingBody: string
    }
  }
  borderRadius: { base: number }
  componentRadius: {
    badge: number; input: number; button: number
    card: number; modal: number; chip: number
  }
  spacing: {
    unit: number; inputPadding: number; buttonPadding: number
    cardPadding: number; sectionGap: number; componentGap: number
  }
  iconStyle: {
    set: string; strokeWidth: number; cornerStyle: string; defaultSize: number
  }
}

// =============================================================================
// EXTRACT STATE FROM ProductTheme
// =============================================================================

function themeToState(theme: ProductTheme): ThemeEditorState {
  const c = theme.colors
  return {
    name: theme.name,
    brand: { ...c.brand },
    accent: { ...c.accent },
    surface: {
      light: c.surface.light, lightDarker: c.surface.lightDarker,
      dark: c.surface.dark, darkDarker: c.surface.darkDarker,
      info: c.surface.info, success: c.surface.success,
      warning: c.surface.warning, important: c.surface.important,
    },
    text: {
      highEmphasis: {
        onLight: rgbaToHex(c.text.highEmphasis.onLight),
        onDark: rgbaToHex(c.text.highEmphasis.onDark),
      },
      lowEmphasis: {
        onLight: rgbaToHex(c.text.lowEmphasis.onLight),
        onDark: rgbaToHex(c.text.lowEmphasis.onDark),
      },
      action: { ...c.text.action },
    },
    action: {
      enabled: c.action.enabled, hover: c.action.hover, active: c.action.active,
      important: { ...c.action.important },
    },
    status: {
      info: c.status.info, success: c.status.success,
      warning: c.status.warning, important: c.status.important,
    },
    badge: {
      info: c.badge.info, infoLight: c.badge.infoLight,
      success: c.badge.success, successLight: c.badge.successLight,
      warning: c.badge.warning, important: c.badge.important,
      importantLight: c.badge.importantLight,
    },
    focusBorder: { onLight: c.focusBorder.onLight },
    selectedHighlight: c.selectedHighlight,
    selectedHighlight_hover: c.selectedHighlight_hover,
    typography: {
      fontFamilies: {
        display: theme.typography.fontFamilies.display,
        body: theme.typography.fontFamilies.body,
      },
      scale: {
        lineHeightTight: theme.typography.scale.lineHeightTight,
        lineHeightNormal: theme.typography.scale.lineHeightNormal,
        letterSpacingHeading: parseFloat(theme.typography.scale.letterSpacingHeading).toString(),
        letterSpacingBody: parseFloat(theme.typography.scale.letterSpacingBody).toString(),
      },
    },
    borderRadius: {
      base: parseInt(theme.borderRadius.xs) || 4,
    },
    componentRadius: {
      badge: parseInt(theme.componentRadius.badge) || 8,
      input: parseInt(theme.componentRadius.input) || 8,
      button: parseInt(theme.componentRadius.button) || 12,
      card: parseInt(theme.componentRadius.card) || 24,
      modal: parseInt(theme.componentRadius.modal) || 32,
      chip: parseInt(theme.componentRadius.chip) >= 9000 ? 9999 : parseInt(theme.componentRadius.chip),
    },
    spacing: {
      unit: parseInt(theme.spacing.unit) || 4,
      inputPadding: parseInt(theme.spacing.inputPadding) || 12,
      buttonPadding: parseInt(theme.spacing.buttonPadding) || 16,
      cardPadding: parseInt(theme.spacing.cardPadding) || 24,
      sectionGap: parseInt(theme.spacing.sectionGap) || 48,
      componentGap: parseInt(theme.spacing.componentGap) || 16,
    },
    iconStyle: {
      set: theme.iconStyle.set,
      strokeWidth: parseFloat(theme.iconStyle.strokeWidth) || 1.5,
      cornerStyle: theme.iconStyle.cornerStyle,
      defaultSize: parseInt(theme.iconStyle.defaultSize) || 20,
    },
  }
}

// =============================================================================
// LOCAL STORAGE PERSISTENCE
// =============================================================================

const STORAGE_KEY = 'prism-custom-themes'

function loadSavedThemes(): Record<string, ThemeEditorState> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch { return {} }
}

function persistThemes(themes: Record<string, ThemeEditorState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(themes))
}

// =============================================================================
// STYLES
// =============================================================================

const s = {
  twoCol: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
  } as React.CSSProperties,
  controlsCol: {
    width: '380px',
    minWidth: '380px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0px',
    background: colors.surface.light,
    borderRadius: '12px',
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
    overflow: 'hidden',
    position: 'sticky' as const,
    top: '20px',
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto' as const,
  } as React.CSSProperties,
  previewCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    minWidth: 0,
  } as React.CSSProperties,
  section: {
    borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
  } as React.CSSProperties,
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    cursor: 'pointer',
    userSelect: 'none' as const,
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: colors.text.lowEmphasis.onLight,
  } as React.CSSProperties,
  sectionBody: {
    padding: '0 16px 14px',
  } as React.CSSProperties,
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  } as React.CSSProperties,
  label: {
    fontSize: '11px',
    color: colors.text.lowEmphasis.onLight,
    minWidth: '100px',
    flexShrink: 0,
  } as React.CSSProperties,
  colorInput: {
    width: '28px',
    height: '28px',
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
    borderRadius: '6px',
    cursor: 'pointer',
    background: 'transparent',
    padding: '2px',
  } as React.CSSProperties,
  rangeInput: {
    flex: 1,
    height: '4px',
  } as React.CSSProperties,
  rangeValue: {
    fontFamily: 'ui-monospace, monospace',
    fontSize: '11px',
    color: colors.text.lowEmphasis.onLight,
    minWidth: '42px',
    textAlign: 'right' as const,
  } as React.CSSProperties,
  selectInput: {
    background: colors.surface.lightDarker,
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
    color: colors.text.highEmphasis.onLight,
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    flex: 1,
    cursor: 'pointer',
  } as React.CSSProperties,
  subLabel: {
    fontSize: '10px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    color: colors.brand.default,
    marginBottom: '6px',
    marginTop: '8px',
    fontWeight: 600,
  } as React.CSSProperties,
  colorTriad: {
    display: 'flex',
    gap: '6px',
    marginBottom: '8px',
  } as React.CSSProperties,
  colorSwatchGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '3px',
  } as React.CSSProperties,
  swatchLabel: {
    fontSize: '9px',
    color: colors.text.lowEmphasis.onLight,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  swatchInput: {
    width: '100%',
    height: '32px',
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
    borderRadius: '6px',
    cursor: 'pointer',
    background: 'transparent',
    padding: '2px',
  } as React.CSSProperties,
  presetPill: (active: boolean) => ({
    padding: '5px 14px',
    borderRadius: '20px',
    border: `1px solid ${active ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
    background: active ? colors.brand.default : 'transparent',
    color: active ? '#fff' : colors.text.lowEmphasis.onLight,
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.15s',
  } as React.CSSProperties),
  actionBtn: {
    padding: '7px 16px',
    borderRadius: '8px',
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
    background: colors.surface.lightDarker,
    color: colors.text.highEmphasis.onLight,
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
  } as React.CSSProperties,
  actionBtnPrimary: {
    padding: '7px 16px',
    borderRadius: '8px',
    border: 'none',
    background: colors.brand.default,
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  } as React.CSSProperties,
}

// =============================================================================
// SECTION COMPONENT
// =============================================================================

function Section({ title, defaultOpen = true, children }: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={s.section}>
      <div style={s.sectionHeader} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span style={{ fontSize: '10px', transition: 'transform 0.2s', transform: open ? 'rotate(0)' : 'rotate(-90deg)' }}>&#9660;</span>
      </div>
      {open && <div style={s.sectionBody}>{children}</div>}
    </div>
  )
}

// =============================================================================
// COLOR TRIAD CONTROL
// =============================================================================

function ColorTriad({ label, value, onChange, autoDerive = false }: {
  label: string
  value: { default: string; darker: string; lighter: string }
  onChange: (v: { default: string; darker: string; lighter: string }) => void
  autoDerive?: boolean
}) {
  return (
    <>
      <div style={s.subLabel}>{label}{autoDerive && <span style={{ fontSize: '9px', opacity: 0.5, fontWeight: 400, textTransform: 'none', letterSpacing: '0', marginLeft: '6px' }}>darker/lighter auto-derived</span>}</div>
      <div style={s.colorTriad}>
        <div style={s.colorSwatchGroup}>
          <span style={s.swatchLabel}>Default</span>
          <input type="color" style={s.swatchInput} value={value.default}
            onChange={e => {
              const def = e.target.value
              if (autoDerive) {
                onChange({ default: def, darker: deriveDarker(def), lighter: deriveLighter(def) })
              } else {
                onChange({ ...value, default: def })
              }
            }} />
        </div>
        <div style={s.colorSwatchGroup}>
          <span style={{ ...s.swatchLabel, opacity: autoDerive ? 0.5 : 1 }}>Darker</span>
          <input type="color" style={s.swatchInput} value={value.darker}
            onChange={e => onChange({ ...value, darker: e.target.value })} />
        </div>
        <div style={s.colorSwatchGroup}>
          <span style={{ ...s.swatchLabel, opacity: autoDerive ? 0.5 : 1 }}>Lighter</span>
          <input type="color" style={s.swatchInput} value={value.lighter}
            onChange={e => onChange({ ...value, lighter: e.target.value })} />
        </div>
      </div>
    </>
  )
}

// =============================================================================
// SLIDER ROW
// =============================================================================

function SliderRow({ label, value, min, max, step, suffix = '', onChange }: {
  label: string; value: number; min: number; max: number; step: number
  suffix?: string; onChange: (v: number) => void
}) {
  return (
    <div style={s.row}>
      <span style={s.label}>{label}</span>
      <input type="range" style={s.rangeInput} value={value} min={min} max={max} step={step}
        onChange={e => onChange(parseFloat(e.target.value))} />
      <span style={s.rangeValue}>{step < 1 ? value.toFixed(2) : value}{suffix}</span>
    </div>
  )
}

// =============================================================================
// SELECT ROW
// =============================================================================

function SelectRow({ label, value, options, onChange }: {
  label: string; value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div style={s.row}>
      <span style={s.label}>{label}</span>
      <select style={s.selectInput} value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// =============================================================================
// COLOR ROW (single swatch)
// =============================================================================

function ColorRow({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={s.row}>
      <span style={s.label}>{label}</span>
      <input type="color" style={s.colorInput} value={value} onChange={e => onChange(e.target.value)} />
      <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '11px', color: colors.text.lowEmphasis.onLight }}>{value}</span>
    </div>
  )
}

// =============================================================================
// ICON PREVIEW SVGs
// =============================================================================

function PreviewIcons({ size, strokeWidth, cornerStyle, filled, color }: {
  size: number; strokeWidth: number; cornerStyle: string; filled: boolean; color: string
}) {
  const cap = cornerStyle === 'round' ? 'round' : 'square'
  const fill = filled ? color : 'none'
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill, stroke: color, strokeWidth, strokeLinecap: cap as any, strokeLinejoin: cap as any }
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
      <svg {...{ ...props, fill: 'none' }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      <svg {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
      <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
      <span style={{ fontSize: '11px', color: colors.text.lowEmphasis.onLight, marginLeft: '4px' }}>
        {filled ? 'filled' : 'outlined'} / {strokeWidth}px / {cap} / {size}px
      </span>
    </div>
  )
}

// =============================================================================
// EXPORT MODAL
// =============================================================================

function ExportModal({ state, onClose }: { state: ThemeEditorState; onClose: () => void }) {
  const [name, setName] = useState(state.name || 'my-theme')
  const [format, setFormat] = useState<'ts' | 'json'>('ts')
  const [copied, setCopied] = useState(false)

  const base = state.borderRadius.base
  const code = format === 'json'
    ? JSON.stringify(state, null, 2)
    : generateTS(state, name, base)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: colors.surface.light, border: `1px solid ${colors.border.lowEmphasis.onLight}`, borderRadius: '12px', width: '680px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
          <h3 style={{ ...typography.heading.h3, color: colors.text.highEmphasis.onLight }}>Export Theme</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: colors.text.lowEmphasis.onLight }}>&times;</button>
        </div>
        <div style={{ padding: '20px', overflow: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: colors.text.lowEmphasis.onLight }}>Name:</span>
            <input value={name} onChange={e => setName(e.target.value)} style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: `1px solid ${colors.border.lowEmphasis.onLight}`, background: colors.surface.lightDarker, color: colors.text.highEmphasis.onLight, fontSize: '13px' }} />
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setFormat('ts')} style={{ ...s.actionBtn, ...(format === 'ts' ? { background: colors.brand.default, color: '#fff', borderColor: colors.brand.default } : {}) }}>TypeScript</button>
              <button onClick={() => setFormat('json')} style={{ ...s.actionBtn, ...(format === 'json' ? { background: colors.brand.default, color: '#fff', borderColor: colors.brand.default } : {}) }}>JSON</button>
            </div>
          </div>
          <textarea readOnly value={code} style={{ width: '100%', minHeight: '350px', background: colors.surface.lightDarker, border: `1px solid ${colors.border.lowEmphasis.onLight}`, borderRadius: '8px', padding: '16px', color: colors.text.highEmphasis.onLight, fontFamily: 'ui-monospace, monospace', fontSize: '11px', lineHeight: 1.5, resize: 'vertical' }} />
        </div>
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`, display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={s.actionBtn}>Close</button>
          <button onClick={handleCopy} style={s.actionBtnPrimary}>{copied ? 'Copied!' : 'Copy to Clipboard'}</button>
        </div>
      </div>
    </div>
  )
}

function generateTS(st: ThemeEditorState, name: string, base: number): string {
  const safeName = name.replace(/[^a-zA-Z0-9]/g, '')
  const varName = safeName.charAt(0).toLowerCase() + safeName.slice(1) + 'Theme'
  return `/**
 * ${name} Product Theme
 * Generated by Prism Theme Playground on ${new Date().toISOString().split('T')[0]}
 * Brand color: ${st.brand.default}
 */

import type { ProductTheme } from './theme-interface';
import { buildBorderRadius, buildComponentRadius } from './theme-interface';

export const ${varName}: ProductTheme = {
  name: '${name}',
  colors: {
    brand: { default: '${st.brand.default}', darker: '${st.brand.darker}', lighter: '${st.brand.lighter}' },
    accent: { default: '${st.accent.default}', darker: '${st.accent.darker}', lighter: '${st.accent.lighter}' },
    surface: {
      light: '${st.surface.light}', lightDarker: '${st.surface.lightDarker}',
      dark: '${st.surface.dark}', darkDarker: '${st.surface.darkDarker}',
      disabled: { onLight: 'rgba(0,0,0,0.03)', onDark: 'rgba(255,255,255,0.20)' },
      info: '${st.surface.info}', success: '${st.surface.success}',
      warning: '${st.surface.warning}', important: '${st.surface.important}',
    },
    // ... remaining colors follow ThemeColors interface
    // Copy the full template from an existing theme and substitute values
  },
  typography: {
    fontFamilies: { display: '${st.typography.fontFamilies.display}', body: '${st.typography.fontFamilies.body}', mono: 'ui-monospace, SFMono-Regular, monospace' },
    fontWeights: { regular: '400', medium: '500', semibold: '600', bold: '700' },
    scale: { lineHeightTight: '${st.typography.scale.lineHeightTight}', lineHeightNormal: '${st.typography.scale.lineHeightNormal}', letterSpacingHeading: '${st.typography.scale.letterSpacingHeading}px', letterSpacingBody: '${st.typography.scale.letterSpacingBody}px' },
  },
  borderRadius: buildBorderRadius(${base}),
  elevation: { none: 'none', xs: '0px 1px 2px rgba(0,0,0,0.05)', sm: '0px 1px 3px rgba(0,0,0,0.1)', md: '0px 4px 6px -1px rgba(0,0,0,0.1)', lg: '0px 10px 15px -3px rgba(0,0,0,0.1)', xl: '0px 20px 25px -5px rgba(0,0,0,0.1)', '2xl': '0px 25px 50px -12px rgba(0,0,0,0.25)', inner: 'inset 0px 2px 4px rgba(0,0,0,0.06)', brand: '0px 4px 14px rgba(${hexToRgb(st.brand.default)},0.25)', brandLg: '0px 10px 25px rgba(${hexToRgb(st.brand.default)},0.3)' },
  spacing: { unit: '${st.spacing.unit}px', inputPadding: '${st.spacing.inputPadding}px', buttonPadding: '${st.spacing.buttonPadding}px', cardPadding: '${st.spacing.cardPadding}px', sectionGap: '${st.spacing.sectionGap}px', componentGap: '${st.spacing.componentGap}px' },
  iconStyle: { set: '${st.iconStyle.set}', strokeWidth: '${st.iconStyle.strokeWidth}', cornerStyle: '${st.iconStyle.cornerStyle}', defaultSize: '${st.iconStyle.defaultSize}', overrides: {} },
  componentRadius: buildComponentRadius(${base}),
};`
}

// =============================================================================
// TOAST
// =============================================================================

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      background: colors.status.success, color: '#fff',
      padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
      zIndex: 1100, transform: visible ? 'translateY(0)' : 'translateY(80px)',
      opacity: visible ? 1 : 0, transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      pointerEvents: 'none',
    }}>{message}</div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function ThemePlaygroundPage() {
  const theme = useTheme()
  const { themeName } = useThemeSwitcher()

  // Init state from current active theme
  const [state, setState] = useState<ThemeEditorState>(() => themeToState(theme))
  const [activePreset, setActivePreset] = useState<string | null>(themeName)
  const [savedThemes, setSavedThemes] = useState<Record<string, ThemeEditorState>>({})
  const [showExport, setShowExport] = useState(false)
  const [toast, setToast] = useState({ message: '', visible: false })

  // Load saved themes on mount
  useEffect(() => {
    setSavedThemes(loadSavedThemes())
  }, [])

  // Sync when system theme changes
  useEffect(() => {
    const t = themeMap[themeName]
    if (t) {
      setState(themeToState(t))
      setActivePreset(themeName)
    }
  }, [themeName])

  const showToast = (msg: string) => {
    setToast({ message: msg, visible: true })
    setTimeout(() => setToast({ message: '', visible: false }), 2000)
  }

  const update = useCallback((fn: (prev: ThemeEditorState) => ThemeEditorState) => {
    setState(prev => {
      const next = fn(prev)
      return next
    })
    setActivePreset(null)
  }, [])

  const loadPreset = (name: string) => {
    const t = themeMap[name]
    if (t) {
      setState(themeToState(t))
      setActivePreset(name)
    }
  }

  const loadSavedTheme = (name: string) => {
    const t = savedThemes[name]
    if (t) {
      setState(t)
      setActivePreset(name)
    }
  }

  const saveTheme = () => {
    const name = state.name || 'Custom Theme'
    const next = { ...savedThemes, [name]: state }
    setSavedThemes(next)
    persistThemes(next)
    showToast(`Saved "${name}"`)
  }

  const deleteSavedTheme = (name: string) => {
    const next = { ...savedThemes }
    delete next[name]
    setSavedThemes(next)
    persistThemes(next)
    showToast(`Deleted "${name}"`)
  }

  // Preview values
  const st = state
  const base = st.borderRadius.base

  return (
    <StyleguideLayout
      title="Theme Playground"
      description="Visually design and export Prism product themes with real-time preview."
      activeId="theme-playground"
      tabs={[]}
    >
      {/* Presets bar */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: colors.text.lowEmphasis.onLight, textTransform: 'uppercase', letterSpacing: '1px', marginRight: '4px' }}>Presets</span>
        {availableThemes.map(t => (
          <button key={t.name} style={s.presetPill(activePreset === t.name)} onClick={() => loadPreset(t.name)}>{t.name}</button>
        ))}
        {Object.keys(savedThemes).length > 0 && (
          <>
            <span style={{ width: '1px', height: '20px', background: colors.border.lowEmphasis.onLight, margin: '0 4px' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: colors.text.lowEmphasis.onLight, textTransform: 'uppercase', letterSpacing: '1px', marginRight: '4px' }}>Saved</span>
            {Object.keys(savedThemes).map(name => (
              <div key={name} style={{ position: 'relative', display: 'inline-flex' }}>
                <button style={s.presetPill(activePreset === name)} onClick={() => loadSavedTheme(name)}>{name}</button>
                <button onClick={() => deleteSavedTheme(name)} style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', borderRadius: '50%', background: colors.status.important, color: '#fff', border: 'none', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>&times;</button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Two-column layout */}
      <div style={s.twoCol}>
        {/* ── CONTROLS ── */}
        <div style={s.controlsCol}>
          {/* Brand */}
          <Section title="Brand Colors">
            <ColorTriad label="Brand" value={st.brand} autoDerive onChange={v => update(p => ({ ...p, brand: v }))} />
            <ColorTriad label="Accent" value={st.accent} autoDerive onChange={v => update(p => ({ ...p, accent: v }))} />
          </Section>

          {/* Surface */}
          <Section title="Surface & Background">
            <div style={s.colorTriad}>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Light</span><input type="color" style={s.swatchInput} value={st.surface.light} onChange={e => update(p => ({ ...p, surface: { ...p.surface, light: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Light+</span><input type="color" style={s.swatchInput} value={st.surface.lightDarker} onChange={e => update(p => ({ ...p, surface: { ...p.surface, lightDarker: e.target.value } }))} /></div>
            </div>
            <div style={s.colorTriad}>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Dark</span><input type="color" style={s.swatchInput} value={st.surface.dark} onChange={e => update(p => ({ ...p, surface: { ...p.surface, dark: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Dark+</span><input type="color" style={s.swatchInput} value={st.surface.darkDarker} onChange={e => update(p => ({ ...p, surface: { ...p.surface, darkDarker: e.target.value } }))} /></div>
            </div>
            <div style={s.subLabel}>Semantic Surfaces</div>
            <div style={s.colorTriad}>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Info</span><input type="color" style={s.swatchInput} value={st.surface.info} onChange={e => update(p => ({ ...p, surface: { ...p.surface, info: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Success</span><input type="color" style={s.swatchInput} value={st.surface.success} onChange={e => update(p => ({ ...p, surface: { ...p.surface, success: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Warning</span><input type="color" style={s.swatchInput} value={st.surface.warning} onChange={e => update(p => ({ ...p, surface: { ...p.surface, warning: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Important</span><input type="color" style={s.swatchInput} value={st.surface.important} onChange={e => update(p => ({ ...p, surface: { ...p.surface, important: e.target.value } }))} /></div>
            </div>
          </Section>

          {/* Text */}
          <Section title="Text Colors" defaultOpen={false}>
            <div style={s.subLabel}>High Emphasis</div>
            <div style={s.colorTriad}>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>On Light</span><input type="color" style={s.swatchInput} value={st.text.highEmphasis.onLight} onChange={e => update(p => ({ ...p, text: { ...p.text, highEmphasis: { ...p.text.highEmphasis, onLight: e.target.value } } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>On Dark</span><input type="color" style={s.swatchInput} value={st.text.highEmphasis.onDark} onChange={e => update(p => ({ ...p, text: { ...p.text, highEmphasis: { ...p.text.highEmphasis, onDark: e.target.value } } }))} /></div>
            </div>
            <div style={s.subLabel}>Low Emphasis</div>
            <div style={s.colorTriad}>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>On Light</span><input type="color" style={s.swatchInput} value={st.text.lowEmphasis.onLight} onChange={e => update(p => ({ ...p, text: { ...p.text, lowEmphasis: { ...p.text.lowEmphasis, onLight: e.target.value } } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>On Dark</span><input type="color" style={s.swatchInput} value={st.text.lowEmphasis.onDark} onChange={e => update(p => ({ ...p, text: { ...p.text, lowEmphasis: { ...p.text.lowEmphasis, onDark: e.target.value } } }))} /></div>
            </div>
            <div style={s.subLabel}>Action Text</div>
            <div style={s.colorTriad}>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Enabled</span><input type="color" style={s.swatchInput} value={st.text.action.enabled} onChange={e => update(p => ({ ...p, text: { ...p.text, action: { ...p.text.action, enabled: e.target.value } } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Hover</span><input type="color" style={s.swatchInput} value={st.text.action.hover} onChange={e => update(p => ({ ...p, text: { ...p.text, action: { ...p.text.action, hover: e.target.value } } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Active</span><input type="color" style={s.swatchInput} value={st.text.action.active} onChange={e => update(p => ({ ...p, text: { ...p.text, action: { ...p.text.action, active: e.target.value } } }))} /></div>
            </div>
          </Section>

          {/* Action */}
          <Section title="Action Colors" defaultOpen={false}>
            <div style={s.subLabel}>Primary Actions</div>
            <div style={s.colorTriad}>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Enabled</span><input type="color" style={s.swatchInput} value={st.action.enabled} onChange={e => update(p => ({ ...p, action: { ...p.action, enabled: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Hover</span><input type="color" style={s.swatchInput} value={st.action.hover} onChange={e => update(p => ({ ...p, action: { ...p.action, hover: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Active</span><input type="color" style={s.swatchInput} value={st.action.active} onChange={e => update(p => ({ ...p, action: { ...p.action, active: e.target.value } }))} /></div>
            </div>
            <div style={s.subLabel}>Important / Destructive</div>
            <div style={s.colorTriad}>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Enabled</span><input type="color" style={s.swatchInput} value={st.action.important.enabled} onChange={e => update(p => ({ ...p, action: { ...p.action, important: { ...p.action.important, enabled: e.target.value } } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Hover</span><input type="color" style={s.swatchInput} value={st.action.important.hover} onChange={e => update(p => ({ ...p, action: { ...p.action, important: { ...p.action.important, hover: e.target.value } } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Active</span><input type="color" style={s.swatchInput} value={st.action.important.active} onChange={e => update(p => ({ ...p, action: { ...p.action, important: { ...p.action.important, active: e.target.value } } }))} /></div>
            </div>
          </Section>

          {/* Status */}
          <Section title="Status & Badge" defaultOpen={false}>
            <div style={s.subLabel}>Status</div>
            <div style={s.colorTriad}>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Info</span><input type="color" style={s.swatchInput} value={st.status.info} onChange={e => update(p => ({ ...p, status: { ...p.status, info: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Success</span><input type="color" style={s.swatchInput} value={st.status.success} onChange={e => update(p => ({ ...p, status: { ...p.status, success: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Warning</span><input type="color" style={s.swatchInput} value={st.status.warning} onChange={e => update(p => ({ ...p, status: { ...p.status, warning: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Important</span><input type="color" style={s.swatchInput} value={st.status.important} onChange={e => update(p => ({ ...p, status: { ...p.status, important: e.target.value } }))} /></div>
            </div>
            <div style={s.subLabel}>Badge</div>
            <div style={s.colorTriad}>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Info</span><input type="color" style={s.swatchInput} value={st.badge.info} onChange={e => update(p => ({ ...p, badge: { ...p.badge, info: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Info Lt</span><input type="color" style={s.swatchInput} value={st.badge.infoLight} onChange={e => update(p => ({ ...p, badge: { ...p.badge, infoLight: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Success</span><input type="color" style={s.swatchInput} value={st.badge.success} onChange={e => update(p => ({ ...p, badge: { ...p.badge, success: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Success Lt</span><input type="color" style={s.swatchInput} value={st.badge.successLight} onChange={e => update(p => ({ ...p, badge: { ...p.badge, successLight: e.target.value } }))} /></div>
            </div>
            <div style={s.colorTriad}>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Warning</span><input type="color" style={s.swatchInput} value={st.badge.warning} onChange={e => update(p => ({ ...p, badge: { ...p.badge, warning: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Important</span><input type="color" style={s.swatchInput} value={st.badge.important} onChange={e => update(p => ({ ...p, badge: { ...p.badge, important: e.target.value } }))} /></div>
              <div style={s.colorSwatchGroup}><span style={s.swatchLabel}>Imp Lt</span><input type="color" style={s.swatchInput} value={st.badge.importantLight} onChange={e => update(p => ({ ...p, badge: { ...p.badge, importantLight: e.target.value } }))} /></div>
            </div>
          </Section>

          {/* Focus */}
          <Section title="Focus & Selection" defaultOpen={false}>
            <ColorRow label="Focus Border" value={st.focusBorder.onLight} onChange={v => update(p => ({ ...p, focusBorder: { onLight: v } }))} />
            <ColorRow label="Selected" value={st.selectedHighlight} onChange={v => update(p => ({ ...p, selectedHighlight: v }))} />
            <ColorRow label="Selected Hover" value={st.selectedHighlight_hover} onChange={v => update(p => ({ ...p, selectedHighlight_hover: v }))} />
          </Section>

          {/* Typography */}
          <Section title="Typography">
            <SelectRow label="Display Font" value={st.typography.fontFamilies.display} onChange={v => update(p => ({ ...p, typography: { ...p.typography, fontFamilies: { ...p.typography.fontFamilies, display: v } } }))} options={[
              { value: "system-ui, -apple-system, sans-serif", label: "System UI" },
              { value: "'DM Sans', sans-serif", label: "DM Sans" },
              { value: "'Inter', sans-serif", label: "Inter" },
              { value: "'Playfair Display', serif", label: "Playfair Display" },
              { value: "'Merriweather', serif", label: "Merriweather" },
              { value: "'Nunito Sans', sans-serif", label: "Nunito Sans" },
              { value: "Georgia, serif", label: "Georgia" },
              { value: "ui-serif, Georgia, serif", label: "UI Serif" },
            ]} />
            <SelectRow label="Body Font" value={st.typography.fontFamilies.body} onChange={v => update(p => ({ ...p, typography: { ...p.typography, fontFamilies: { ...p.typography.fontFamilies, body: v } } }))} options={[
              { value: "system-ui, -apple-system, sans-serif", label: "System UI" },
              { value: "'DM Sans', sans-serif", label: "DM Sans" },
              { value: "'Inter', sans-serif", label: "Inter" },
              { value: "'Nunito Sans', sans-serif", label: "Nunito Sans" },
              { value: "Georgia, serif", label: "Georgia" },
              { value: "ui-serif, Georgia, serif", label: "UI Serif" },
            ]} />
            <SliderRow label="Line Height Tight" value={parseFloat(st.typography.scale.lineHeightTight)} min={1} max={1.5} step={0.05} onChange={v => update(p => ({ ...p, typography: { ...p.typography, scale: { ...p.typography.scale, lineHeightTight: v.toString() } } }))} />
            <SliderRow label="Line Height Norm" value={parseFloat(st.typography.scale.lineHeightNormal)} min={1.2} max={2} step={0.05} onChange={v => update(p => ({ ...p, typography: { ...p.typography, scale: { ...p.typography.scale, lineHeightNormal: v.toString() } } }))} />
            <SliderRow label="Heading Spacing" value={parseFloat(st.typography.scale.letterSpacingHeading)} min={-1} max={1} step={0.1} suffix="px" onChange={v => update(p => ({ ...p, typography: { ...p.typography, scale: { ...p.typography.scale, letterSpacingHeading: v.toString() } } }))} />
            <SliderRow label="Body Spacing" value={parseFloat(st.typography.scale.letterSpacingBody)} min={-0.5} max={1} step={0.05} suffix="px" onChange={v => update(p => ({ ...p, typography: { ...p.typography, scale: { ...p.typography.scale, letterSpacingBody: v.toString() } } }))} />
          </Section>

          {/* Border Radius */}
          <Section title="Border Radius">
            <SliderRow label="Base (px)" value={base} min={0} max={12} step={1} onChange={v => update(p => ({
              ...p,
              borderRadius: { base: v },
              componentRadius: { badge: v * 2, input: v * 2, button: v * 3, card: v * 6, modal: v * 8, chip: p.componentRadius.chip },
            }))} />
            <div style={s.subLabel}>Component Overrides</div>
            <SliderRow label="Badge" value={st.componentRadius.badge} min={0} max={24} step={1} suffix="px" onChange={v => update(p => ({ ...p, componentRadius: { ...p.componentRadius, badge: v } }))} />
            <SliderRow label="Input" value={st.componentRadius.input} min={0} max={24} step={1} suffix="px" onChange={v => update(p => ({ ...p, componentRadius: { ...p.componentRadius, input: v } }))} />
            <SliderRow label="Button" value={st.componentRadius.button} min={0} max={32} step={1} suffix="px" onChange={v => update(p => ({ ...p, componentRadius: { ...p.componentRadius, button: v } }))} />
            <SliderRow label="Card" value={st.componentRadius.card} min={0} max={32} step={1} suffix="px" onChange={v => update(p => ({ ...p, componentRadius: { ...p.componentRadius, card: v } }))} />
            <SliderRow label="Modal" value={st.componentRadius.modal} min={0} max={32} step={1} suffix="px" onChange={v => update(p => ({ ...p, componentRadius: { ...p.componentRadius, modal: v } }))} />
          </Section>

          {/* Spacing */}
          <Section title="Spacing">
            <SelectRow label="Base Unit" value={st.spacing.unit.toString()} onChange={v => update(p => ({ ...p, spacing: { ...p.spacing, unit: parseInt(v) } }))} options={[
              { value: '2', label: '2px' },
              { value: '4', label: '4px' },
              { value: '8', label: '8px' },
            ]} />
            <SliderRow label="Input Padding" value={st.spacing.inputPadding} min={6} max={20} step={1} suffix="px" onChange={v => update(p => ({ ...p, spacing: { ...p.spacing, inputPadding: v } }))} />
            <SliderRow label="Button Padding" value={st.spacing.buttonPadding} min={8} max={28} step={1} suffix="px" onChange={v => update(p => ({ ...p, spacing: { ...p.spacing, buttonPadding: v } }))} />
            <SliderRow label="Card Padding" value={st.spacing.cardPadding} min={12} max={40} step={2} suffix="px" onChange={v => update(p => ({ ...p, spacing: { ...p.spacing, cardPadding: v } }))} />
            <SliderRow label="Section Gap" value={st.spacing.sectionGap} min={24} max={72} step={4} suffix="px" onChange={v => update(p => ({ ...p, spacing: { ...p.spacing, sectionGap: v } }))} />
            <SliderRow label="Component Gap" value={st.spacing.componentGap} min={8} max={28} step={2} suffix="px" onChange={v => update(p => ({ ...p, spacing: { ...p.spacing, componentGap: v } }))} />
          </Section>

          {/* Icons */}
          <Section title="Icon Style" defaultOpen={false}>
            <SelectRow label="Icon Set" value={st.iconStyle.set} onChange={v => update(p => ({ ...p, iconStyle: { ...p.iconStyle, set: v } }))} options={[
              { value: 'outlined', label: 'Outlined' },
              { value: 'filled', label: 'Filled' },
              { value: 'duotone', label: 'Duotone' },
            ]} />
            <SliderRow label="Stroke Width" value={st.iconStyle.strokeWidth} min={0.5} max={3} step={0.25} onChange={v => update(p => ({ ...p, iconStyle: { ...p.iconStyle, strokeWidth: v } }))} />
            <SelectRow label="Corner Style" value={st.iconStyle.cornerStyle} onChange={v => update(p => ({ ...p, iconStyle: { ...p.iconStyle, cornerStyle: v } }))} options={[
              { value: 'round', label: 'Round' },
              { value: 'square', label: 'Square' },
            ]} />
            <SliderRow label="Default Size" value={st.iconStyle.defaultSize} min={14} max={32} step={1} suffix="px" onChange={v => update(p => ({ ...p, iconStyle: { ...p.iconStyle, defaultSize: v } }))} />
          </Section>
        </div>

        {/* ── PREVIEW ── */}
        <div style={s.previewCol}>
          {/* Header bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <input
                value={st.name}
                onChange={e => setState(p => ({ ...p, name: e.target.value }))}
                style={{ ...typography.heading.h2, color: colors.text.highEmphasis.onLight, background: 'transparent', border: 'none', borderBottom: `1px dashed ${colors.border.lowEmphasis.onLight}`, padding: '2px 0', outline: 'none', width: '200px' }}
                placeholder="Theme Name"
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={s.actionBtn} onClick={() => setShowExport(true)}>Export</button>
              <button style={s.actionBtnPrimary} onClick={saveTheme}>Save Theme</button>
            </div>
          </div>

          {/* Preview card - Light surface */}
          <div style={{ background: st.surface.light, borderRadius: `${st.componentRadius.card}px`, padding: `${st.spacing.cardPadding}px`, border: `1px solid ${st.text.highEmphasis.onLight}11`, transition: 'all 0.2s' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Typography */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: st.text.lowEmphasis.onLight, marginBottom: '12px', opacity: 0.5 }}>Typography</div>
                <h3 style={{ fontFamily: st.typography.fontFamilies.display, fontSize: '24px', fontWeight: 700, lineHeight: st.typography.scale.lineHeightTight, letterSpacing: `${st.typography.scale.letterSpacingHeading}px`, color: st.text.highEmphasis.onLight, marginBottom: '4px' }}>Heading Display</h3>
                <p style={{ fontFamily: st.typography.fontFamilies.body, fontSize: '14px', lineHeight: st.typography.scale.lineHeightNormal, letterSpacing: `${st.typography.scale.letterSpacingBody}px`, color: st.text.lowEmphasis.onLight, marginBottom: '10px' }}>
                  Body text with low emphasis. This second line shows line-height spacing between lines.
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px', color: st.text.lowEmphasis.onLight, opacity: 0.6 }}>Tight</span>
                    <p style={{ fontFamily: st.typography.fontFamilies.display, fontSize: '14px', lineHeight: st.typography.scale.lineHeightTight, color: st.text.highEmphasis.onLight, borderLeft: `2px solid ${st.brand.default}`, paddingLeft: '8px' }}>Multi-line heading to preview tight line-height</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px', color: st.text.lowEmphasis.onLight, opacity: 0.6 }}>Normal</span>
                    <p style={{ fontFamily: st.typography.fontFamilies.body, fontSize: '14px', lineHeight: st.typography.scale.lineHeightNormal, color: st.text.highEmphasis.onLight, borderLeft: `2px solid ${st.accent.default}`, paddingLeft: '8px' }}>Multi-line body to preview normal line-height</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: st.text.lowEmphasis.onLight, marginBottom: '12px', opacity: 0.5 }}>Buttons</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <button style={{ padding: `8px ${st.spacing.buttonPadding}px`, borderRadius: `${st.componentRadius.button}px`, background: st.action.enabled, color: '#fff', border: 'none', fontSize: '13px', fontWeight: 500, fontFamily: st.typography.fontFamilies.body, cursor: 'pointer' }}>Primary</button>
                  <button style={{ padding: `8px ${st.spacing.buttonPadding}px`, borderRadius: `${st.componentRadius.button}px`, background: st.action.important.enabled, color: '#fff', border: 'none', fontSize: '13px', fontWeight: 500, fontFamily: st.typography.fontFamilies.body, cursor: 'pointer' }}>Important</button>
                  <button style={{ padding: `8px ${st.spacing.buttonPadding}px`, borderRadius: `${st.componentRadius.button}px`, background: 'transparent', color: st.text.highEmphasis.onLight, border: `1px solid ${st.text.highEmphasis.onLight}33`, fontSize: '13px', fontWeight: 500, fontFamily: st.typography.fontFamilies.body, cursor: 'pointer' }}>Outline</button>
                </div>
              </div>

              {/* Input */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: st.text.lowEmphasis.onLight, marginBottom: '12px', opacity: 0.5 }}>Input</div>
                <input placeholder="Enter value..." style={{ width: '100%', padding: `${st.spacing.inputPadding}px 12px`, border: `1px solid ${st.text.lowEmphasis.onLight}33`, borderRadius: `${st.componentRadius.input}px`, background: st.surface.light, color: st.text.highEmphasis.onLight, fontSize: '13px', fontFamily: st.typography.fontFamilies.body, outline: 'none' }} />
              </div>

              {/* Badges & Chips */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: st.text.lowEmphasis.onLight, marginBottom: '12px', opacity: 0.5 }}>Badges & Chips</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{ padding: '2px 10px', borderRadius: `${st.componentRadius.badge}px`, background: st.badge.infoLight, color: st.badge.info, fontSize: '11px', fontWeight: 600, fontFamily: st.typography.fontFamilies.body }}>Info</span>
                  <span style={{ padding: '2px 10px', borderRadius: `${st.componentRadius.badge}px`, background: st.badge.successLight, color: st.badge.success, fontSize: '11px', fontWeight: 600, fontFamily: st.typography.fontFamilies.body }}>Success</span>
                  <span style={{ padding: '2px 10px', borderRadius: `${st.componentRadius.badge}px`, background: st.surface.warning, color: st.badge.warning, fontSize: '11px', fontWeight: 600, fontFamily: st.typography.fontFamilies.body }}>Warning</span>
                  <span style={{ padding: '2px 10px', borderRadius: `${st.componentRadius.badge}px`, background: st.badge.importantLight, color: st.badge.important, fontSize: '11px', fontWeight: 600, fontFamily: st.typography.fontFamilies.body }}>Danger</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: `${st.componentRadius.chip >= 9000 ? 9999 : st.componentRadius.chip}px`, background: `${st.text.highEmphasis.onLight}14`, color: st.text.highEmphasis.onLight, fontSize: '12px', fontFamily: st.typography.fontFamilies.body }}>Tag One</span>
                  <span style={{ padding: '4px 12px', borderRadius: `${st.componentRadius.chip >= 9000 ? 9999 : st.componentRadius.chip}px`, background: `${st.text.highEmphasis.onLight}14`, color: st.text.highEmphasis.onLight, fontSize: '12px', fontFamily: st.typography.fontFamilies.body }}>Tag Two</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: st.text.lowEmphasis.onLight, marginBottom: '12px', opacity: 0.5 }}>Status</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[['Info', st.status.info], ['Operational', st.status.success], ['Degraded', st.status.warning], ['Outage', st.status.important]].map(([label, color]) => (
                    <span key={label as string} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: st.typography.fontFamilies.body, color: st.text.highEmphasis.onLight }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color as string, flexShrink: 0 }} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dark Card */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: st.text.lowEmphasis.onLight, marginBottom: '12px', opacity: 0.5 }}>Card on Dark</div>
                <div style={{ background: st.surface.dark, borderRadius: `${st.componentRadius.card}px`, padding: `${st.spacing.cardPadding}px`, color: st.text.highEmphasis.onDark }}>
                  <h4 style={{ fontFamily: st.typography.fontFamilies.display, fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Dark Surface</h4>
                  <p style={{ fontFamily: st.typography.fontFamilies.body, fontSize: '12px', opacity: 0.7 }}>Text on dark background</p>
                </div>
              </div>
            </div>

            {/* Surfaces row */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: st.text.lowEmphasis.onLight, marginBottom: '8px', opacity: 0.5 }}>Surfaces</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  ['Light', st.surface.light, st.text.highEmphasis.onLight],
                  ['Light+', st.surface.lightDarker, st.text.highEmphasis.onLight],
                  ['Info', st.surface.info, st.status.info],
                  ['Success', st.surface.success, st.status.success],
                  ['Warning', st.surface.warning, st.status.warning],
                  ['Important', st.surface.important, st.status.important],
                  ['Dark', st.surface.dark, st.text.highEmphasis.onDark],
                  ['Dark+', st.surface.darkDarker, st.text.highEmphasis.onDark],
                ].map(([label, bg, fg]) => (
                  <div key={label as string} style={{ flex: 1, height: '40px', borderRadius: '6px', background: bg as string, color: fg as string, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', border: `1px solid ${st.text.highEmphasis.onLight}11` }}>{label}</div>
                ))}
              </div>
            </div>

            {/* Radius row */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: st.text.lowEmphasis.onLight, marginBottom: '8px', opacity: 0.5 }}>Border Radius Scale</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                {['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].map((label, i) => {
                  const mults = [1, 2, 4, 6, 8, 12, 16, 9999]
                  const r = mults[i] === 9999 ? '9999px' : `${base * mults[i]}px`
                  return <div key={label} style={{ width: '36px', height: '36px', background: st.brand.default, borderRadius: r, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#fff', fontWeight: 600 }}>{label}</div>
                })}
              </div>
            </div>

            {/* Icons */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: st.text.lowEmphasis.onLight, marginBottom: '8px', opacity: 0.5 }}>Icons</div>
              <PreviewIcons size={st.iconStyle.defaultSize} strokeWidth={st.iconStyle.strokeWidth} cornerStyle={st.iconStyle.cornerStyle} filled={st.iconStyle.set === 'filled'} color={st.text.highEmphasis.onLight} />
            </div>

            {/* Spacing */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: st.text.lowEmphasis.onLight, marginBottom: '8px', opacity: 0.5 }}>Spacing</div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
                {[
                  ['unit', st.spacing.unit],
                  ['input', st.spacing.inputPadding],
                  ['button', st.spacing.buttonPadding],
                  ['card', st.spacing.cardPadding],
                  ['comp', st.spacing.componentGap],
                  ['section', st.spacing.sectionGap],
                ].map(([label, val]) => (
                  <div key={label as string} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '24px', height: `${val}px`, background: st.brand.default, borderRadius: '3px', opacity: 0.6, transition: 'height 0.2s' }} />
                    <span style={{ fontSize: '10px', fontFamily: 'ui-monospace, monospace', color: st.text.highEmphasis.onLight }}>{val}px</span>
                    <span style={{ fontSize: '9px', color: st.text.lowEmphasis.onLight, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Brand surface card */}
          <div style={{ background: st.brand.default, borderRadius: `${st.componentRadius.card}px`, padding: `${st.spacing.cardPadding}px`, color: '#fff' }}>
            <h3 style={{ fontFamily: st.typography.fontFamilies.display, fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>Brand Surface</h3>
            <p style={{ fontFamily: st.typography.fontFamilies.body, fontSize: '13px', opacity: 0.85, marginBottom: '12px' }}>Content displayed on the brand color background.</p>
            <button style={{ padding: `8px ${st.spacing.buttonPadding}px`, borderRadius: `${st.componentRadius.button}px`, background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: st.typography.fontFamilies.body }}>Action on Brand</button>
          </div>
        </div>
      </div>

      {/* Export modal */}
      {showExport && <ExportModal state={state} onClose={() => setShowExport(false)} />}

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />
    </StyleguideLayout>
  )
}
