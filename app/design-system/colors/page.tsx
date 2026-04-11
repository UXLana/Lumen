'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable } from '../shared'
import { borderRadius, typography } from '@/styles/design-tokens'
import { useColors } from '@/styles/themes'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'extended' | 'usage'

// =============================================================================
// COLOR SWATCH COMPONENT
// =============================================================================

function ColorSwatch({
  token,
  value,
  label,
  onDarkBg = false,
  small = false,
  showHex = true,
}: {
  token: string
  value: string
  label?: string
  onDarkBg?: boolean
  small?: boolean
  showHex?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const tc = useColors()

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // silently handle
    }
  }

  const checkerboardBg = `
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%)
  `
  const isTransparent = value.includes('rgba')

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={copyToClipboard}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          copyToClipboard()
        }
      }}
      style={{ cursor: 'pointer' }}
      title={`Click to copy: ${token}`}
    >
      <div style={{
        position: 'relative',
        width: '62px',
        height: '62px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: `1px solid ${tc.border.lowEmphasis.onLight}`,
        marginBottom: '6px',
        flexShrink: 0,
        ...(onDarkBg ? { background: tc.surface.darkDarker } : {}),
      }}>
        {isTransparent && !onDarkBg && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: checkerboardBg,
            backgroundSize: '12px 12px',
            backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
          }} />
        )}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: value,
        }} />
        {copied && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            Copied!
          </div>
        )}
      </div>
      {label && (
        <div style={{ fontSize: '12px', fontWeight: 600, color: tc.text.highEmphasis.onLight, marginBottom: '1px' }}>
          {label}
        </div>
      )}
      <div style={{ fontSize: '10px', color: tc.text.lowEmphasis.onLight, fontFamily: 'monospace', wordBreak: 'break-all' }}>
        {token}
      </div>
      {showHex && (
        <div style={{ fontSize: '10px', color: tc.text.lowEmphasis.onLight, fontFamily: 'monospace', marginTop: '1px', opacity: 0.7 }}>
          {value}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// COLOR GROUP COMPONENT — renders a labeled section of color swatches
// =============================================================================

function ColorGroup({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  const tc = useColors()
  return (
    <section style={{ marginBottom: '48px' }}>
      <h2 style={{
        ...typography.heading.h4,
        color: tc.text.highEmphasis.onLight,
        marginBottom: description ? '4px' : '16px',
      }}>
        {title}
      </h2>
      {description && (
        <p style={{
          ...typography.body.sm,
          color: tc.text.lowEmphasis.onLight,
          marginBottom: '16px',
        }}>
          {description}
        </p>
      )}
      {children}
    </section>
  )
}

// Helper: Render a flat grid of swatches from a key-value map
function SwatchGrid({
  entries,
  prefix,
  columns = 4,
  small = false,
  onDarkBg = false,
}: {
  entries: [string, string][]
  prefix: string
  columns?: number
  small?: boolean
  onDarkBg?: boolean
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px' }}>
      {entries.map(([key, val]) => (
        <ColorSwatch
          key={key}
          token={`${prefix}.${key}`}
          value={val}
          label={key}
          small={small}
          onDarkBg={onDarkBg}
        />
      ))}
    </div>
  )
}

// Helper: flatten a nested color object for display, handling onLight/onDark
function flattenColors(
  obj: Record<string, unknown>,
  prefix: string,
): [string, string][] {
  const result: [string, string][] = []
  for (const [key, val] of Object.entries(obj)) {
    const path = `${prefix}.${key}`
    if (typeof val === 'string') {
      result.push([path, val])
    } else if (typeof val === 'object' && val !== null) {
      result.push(...flattenColors(val as Record<string, unknown>, path))
    }
  }
  return result
}


// =============================================================================
// MAIN PAGE
// =============================================================================

export default function ColorsPage() {
  const [activeTab, setActiveTab] = useState<PageTab>('overview')
  const themeColors = useColors()

  const tabs = [
    { id: 'overview', label: 'Core' },
    { id: 'extended', label: 'Extended' },
    { id: 'usage', label: 'Usage' },
  ]

  return (
    <StyleguideLayout
      title="Colors"
      description="Every pixel has a purpose."
      activeId="colors"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as PageTab)}
    >
      {/* ================================================================== */}
      {/* CORE TAB */}
      {/* ================================================================== */}
      {activeTab === 'overview' && (
        <>
          {/* Theme badge */}
          <div style={{ marginBottom: '32px' }}>
          </div>

          {/* BRAND */}
          <ColorGroup title="Brand" description="Primary brand identity colors. Used for primary actions and key brand moments.">
            <SwatchGrid
              entries={Object.entries(themeColors.brand) as [string, string][]}
              prefix="colors.brand"
              columns={5}
            />
          </ColorGroup>

          {/* ACCENT */}
          <ColorGroup title="Accent" description="Secondary palette for highlights, active indicators, and complementary brand moments.">
            <SwatchGrid
              entries={Object.entries(themeColors.accent) as [string, string][]}
              prefix="colors.accent"
              columns={5}
            />
          </ColorGroup>

          {/* SURFACE */}
          <ColorGroup title="Surface" description="Background colors for different UI contexts, elevation levels, and status states.">
            <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '12px' }}>
              Light Surfaces
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px', marginBottom: '24px' }}>
              <ColorSwatch token="colors.surface.light" value={themeColors.surface.light} label="light" />
              <ColorSwatch token="colors.surface.lightDarker" value={themeColors.surface.lightDarker} label="lightDarker" />
              <ColorSwatch token="colors.surface.dark" value={themeColors.surface.dark} label="dark" />
              <ColorSwatch token="colors.surface.darkDarker" value={themeColors.surface.darkDarker} label="darkDarker" />
            </div>

            <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '12px' }}>
              Disabled Surfaces
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px', marginBottom: '24px' }}>
              <ColorSwatch token="colors.surface.disabled.onLight" value={themeColors.surface.disabled.onLight} label="disabled.onLight" />
              <ColorSwatch token="colors.surface.disabled.onDark" value={themeColors.surface.disabled.onDark} label="disabled.onDark" onDarkBg />
            </div>

            <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '12px' }}>
              Status Surfaces
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px' }}>
              <ColorSwatch token="colors.surface.info" value={themeColors.surface.info} label="info" />
              <ColorSwatch token="colors.surface.success" value={themeColors.surface.success} label="success" />
              <ColorSwatch token="colors.surface.warning" value={themeColors.surface.warning} label="warning" />
              <ColorSwatch token="colors.surface.important" value={themeColors.surface.important} label="important" />
            </div>
          </ColorGroup>

          {/* SURFACE BORDER */}
          <ColorGroup title="Surface Border" description="Borders for status surfaces (info, success, warning, important).">
            <SwatchGrid
              entries={Object.entries(themeColors.surfaceBorder) as [string, string][]}
              prefix="colors.surfaceBorder"
              columns={4}
            />
          </ColorGroup>

          {/* TEXT */}
          <ColorGroup title="Text" description="Text colors for different emphasis levels and contexts.">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* On Light */}
              <div style={{
                background: themeColors.surface.light,
                borderRadius: borderRadius.lg,
                padding: '24px',
                border: `1px solid ${themeColors.border.lowEmphasis.onLight}`,
              }}>
                <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '16px', marginTop: 0 }}>
                  On Light
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ color: themeColors.text.highEmphasis.onLight, fontSize: '18px', fontWeight: 600 }}>High Emphasis</div>
                    <code style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(0,0,0,0.5)' }}>colors.text.highEmphasis.onLight</code>
                  </div>
                  <div>
                    <div style={{ color: themeColors.text.lowEmphasis.onLight, fontSize: '16px' }}>Low Emphasis</div>
                    <code style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(0,0,0,0.5)' }}>colors.text.lowEmphasis.onLight</code>
                  </div>
                  <div>
                    <div style={{ color: themeColors.text.disabled.onLight, fontSize: '14px' }}>Disabled</div>
                    <code style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(0,0,0,0.5)' }}>colors.text.disabled.onLight</code>
                  </div>
                </div>
              </div>

              {/* On Dark */}
              <div style={{
                background: themeColors.surface.dark,
                borderRadius: borderRadius.lg,
                padding: '24px',
              }}>
                <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onDark, marginBottom: '16px', marginTop: 0 }}>
                  On Dark
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ color: themeColors.text.highEmphasis.onDark, fontSize: '18px', fontWeight: 600 }}>High Emphasis</div>
                    <code style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)' }}>colors.text.highEmphasis.onDark</code>
                  </div>
                  <div>
                    <div style={{ color: themeColors.text.lowEmphasis.onDark, fontSize: '16px' }}>Low Emphasis</div>
                    <code style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)' }}>colors.text.lowEmphasis.onDark</code>
                  </div>
                  <div>
                    <div style={{ color: themeColors.text.disabled.onDark, fontSize: '14px' }}>Disabled</div>
                    <code style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)' }}>colors.text.disabled.onDark</code>
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '12px' }}>
              Action Text
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px', marginBottom: '24px' }}>
              <ColorSwatch token="colors.text.action.enabled" value={themeColors.text.action.enabled} label="action.enabled" />
              <ColorSwatch token="colors.text.action.hover" value={themeColors.text.action.hover} label="action.hover" />
              <ColorSwatch token="colors.text.action.active" value={themeColors.text.action.active} label="action.active" />
            </div>

            <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '12px' }}>
              Status Text
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px' }}>
              <ColorSwatch token="colors.text.success" value={themeColors.text.success} label="success" />
              <ColorSwatch token="colors.text.warning" value={themeColors.text.warning} label="warning" />
              <ColorSwatch token="colors.text.important" value={themeColors.text.important} label="important" />
            </div>
          </ColorGroup>

          {/* BORDER */}
          <ColorGroup title="Border" description="Border colors at different emphasis levels for light and dark backgrounds.">
            {flattenColors(themeColors.border as unknown as Record<string, unknown>, 'colors.border').map(([path, val]) => (
              <div key={path} style={{ display: 'inline-block', marginRight: '16px', marginBottom: '16px' }}>
                <ColorSwatch
                  token={path}
                  value={val}
                  label={path.replace('colors.border.', '')}
                  small
                  onDarkBg={path.includes('onDark')}
                />
              </div>
            ))}
          </ColorGroup>

          {/* ICON */}
          <ColorGroup title="Icon" description="Icon colors for different states and contexts.">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {flattenColors(themeColors.icon as unknown as Record<string, unknown>, 'colors.icon').map(([path, val]) => (
                <div key={path} style={{ width: '140px' }}>
                  <ColorSwatch
                    token={path}
                    value={val}
                    label={path.replace('colors.icon.', '')}
                    small
                    onDarkBg={path.includes('onDark')}
                  />
                </div>
              ))}
            </div>
          </ColorGroup>

          {/* ICON BG */}
          <ColorGroup title="Icon Background" description="Background colors for icon containers in status contexts.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px' }}>
              {Object.entries(themeColors.iconBg).map(([key, val]) => (
                <ColorSwatch
                  key={key}
                  token={`colors.iconBg.${key}`}
                  value={val}
                  label={key}
                  small
                  onDarkBg={key.includes('onDark')}
                />
              ))}
            </div>
          </ColorGroup>

          {/* ACTION */}
          <ColorGroup title="Action" description="Colors for interactive/clickable elements (buttons, links).">
            <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '12px' }}>
              Primary Action
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px', marginBottom: '24px' }}>
              <ColorSwatch token="colors.action.enabled" value={themeColors.action.enabled} label="enabled" />
              <ColorSwatch token="colors.action.hover" value={themeColors.action.hover} label="hover" />
              <ColorSwatch token="colors.action.active" value={themeColors.action.active} label="active" />
            </div>

            <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '12px' }}>
              Important (Destructive) Action
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px', marginBottom: '24px' }}>
              <ColorSwatch token="colors.action.important.enabled" value={themeColors.action.important.enabled} label="important.enabled" />
              <ColorSwatch token="colors.action.important.hover" value={themeColors.action.important.hover} label="important.hover" />
              <ColorSwatch token="colors.action.important.active" value={themeColors.action.important.active} label="important.active" />
            </div>

            <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '12px' }}>
              Monochrome Action (on Light)
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {flattenColors(themeColors.action.monochrome.onLight as unknown as Record<string, unknown>, 'colors.action.monochrome.onLight').map(([path, val]) => (
                <div key={path} style={{ width: '130px' }}>
                  <ColorSwatch token={path} value={val} label={path.split('.').pop()!} small />
                </div>
              ))}
            </div>

            <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '12px' }}>
              Monochrome Action (on Dark)
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {flattenColors(themeColors.action.monochrome.onDark as unknown as Record<string, unknown>, 'colors.action.monochrome.onDark').map(([path, val]) => (
                <div key={path} style={{ width: '130px' }}>
                  <ColorSwatch token={path} value={val} label={path.split('.').pop()!} small onDarkBg />
                </div>
              ))}
            </div>
          </ColorGroup>

          {/* STATUS */}
          <ColorGroup title="Status" description="Semantic colors for system feedback (info, success, warning, important).">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px' }}>
              {Object.entries(themeColors.status).map(([key, val]) => (
                <ColorSwatch
                  key={key}
                  token={`colors.status.${key}`}
                  value={val}
                  label={key}
                  small
                  onDarkBg={key.includes('onDark')}
                />
              ))}
            </div>
          </ColorGroup>

          {/* HOVER / SELECTED / SCRIM / FOCUS */}
          <ColorGroup title="Interaction States" description="Hover, selected, focus, and scrim overlay colors.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px', marginBottom: '24px' }}>
              <ColorSwatch token="colors.hover.onLight" value={themeColors.hover.onLight} label="hover.onLight" />
              <ColorSwatch token="colors.hover.onDark" value={themeColors.hover.onDark} label="hover.onDark" onDarkBg />
              <ColorSwatch token="colors.selected.onLight" value={themeColors.selected.onLight} label="selected.onLight" />
              <ColorSwatch token="colors.scrim" value={themeColors.scrim} label="scrim" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px' }}>
              <ColorSwatch token="colors.selectedHighlight" value={themeColors.selectedHighlight} label="selectedHighlight" />
              <ColorSwatch token="colors.selectedHighlight_hover" value={themeColors.selectedHighlight_hover} label="selectedHighlight_hover" />
              <ColorSwatch token="colors.focusBorder.onLight" value={themeColors.focusBorder.onLight} label="focusBorder.onLight" />
              <ColorSwatch token="colors.focusBorder.onDark" value={themeColors.focusBorder.onDark} label="focusBorder.onDark" onDarkBg />
            </div>
          </ColorGroup>
        </>
      )}

      {/* ================================================================== */}
      {/* EXTENDED TAB */}
      {/* ================================================================== */}
      {activeTab === 'extended' && (
        <>
          <div style={{ marginBottom: '32px' }}>
          </div>

          {/* BADGE */}
          <ColorGroup title="Badge" description="Color pairs for badges and tags. Each has a saturated and light variant.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px', marginBottom: '24px' }}>
              {Object.entries(themeColors.badge).map(([key, val]) => (
                <ColorSwatch
                  key={key}
                  token={`colors.badge.${key}`}
                  value={val}
                  label={key}
                  small
                />
              ))}
            </div>

            <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '12px' }}>
              Badge Examples
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['info', 'success', 'warning', 'important', 'aqua', 'green', 'yellow', 'fuschia', 'purple', 'charcoal'] as const).map((name) => {
                const bg = themeColors.badge[`${name}Light` as keyof typeof themeColors.badge]
                const fg = themeColors.badge[name as keyof typeof themeColors.badge]
                if (!bg || !fg) return null
                return (
                  <span
                    key={name}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: bg,
                      color: fg,
                      textTransform: 'capitalize',
                    }}
                  >
                    {name}
                  </span>
                )
              })}
            </div>
          </ColorGroup>

          {/* AVATAR */}
          <ColorGroup title="Avatar" description="8 distinct background colors for avatar initials. Assigned by user name hash.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px', marginBottom: '24px' }}>
              {Object.entries(themeColors.avatar).map(([key, val]) => (
                <ColorSwatch key={key} token={`colors.avatar.${key}`} value={val} label={`Avatar ${key}`} small />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['JD', 'AB', 'MK', 'SR', 'LH', 'TC', 'PW', 'RJ'].map((initials, i) => {
                const key = String(i + 1).padStart(2, '0') as keyof typeof themeColors.avatar
                return (
                  <div
                    key={initials}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: themeColors.avatar[key],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: themeColors.text.highEmphasis.onLight,
                    }}
                  >
                    {initials}
                  </div>
                )
              })}
            </div>
          </ColorGroup>

          {/* DATA VIZ */}
          <ColorGroup title="Data Visualization" description="Sequential 15-color palette for charts and graphs.">
            <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
              {Object.entries(themeColors.dataViz)
                .filter(([key]) => key !== 'border')
                .map(([key, val], i, arr) => (
                  <div
                    key={key}
                    style={{
                      flex: 1,
                      height: '48px',
                      background: val,
                      borderRadius: i === 0 ? '4px 0 0 4px' : i === arr.length - 1 ? '0 4px 4px 0' : '0',
                    }}
                    title={`colors.dataViz.${key}`}
                  />
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px' }}>
              {Object.entries(themeColors.dataViz).map(([key, val]) => (
                <ColorSwatch key={key} token={`colors.dataViz.${key}`} value={val} label={key} small />
              ))}
            </div>
          </ColorGroup>

          {/* CVD */}
          <ColorGroup title="CVD Accessible Palette" description="8 colors distinguishable for most forms of color vision deficiency. Use for charts where color differentiation is critical.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px' }}>
              {Object.entries(themeColors.cvd).map(([key, val]) => (
                <ColorSwatch key={key} token={`colors.cvd.${key}`} value={val} label={key} />
              ))}
            </div>
          </ColorGroup>

          {/* COMPONENT-SPECIFIC */}
          <ColorGroup title="Component-Specific" description="Scrollbar, navigation, button toggle, chip, progress indicator, and table highlight colors.">
            <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '12px' }}>Scrollbar</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {flattenColors(themeColors.scrollbar as unknown as Record<string, unknown>, 'colors.scrollbar').map(([path, val]) => (
                <div key={path} style={{ width: '140px' }}>
                  <ColorSwatch token={path} value={val} label={path.replace('colors.scrollbar.', '')} small onDarkBg={path.includes('onDark')} />
                </div>
              ))}
            </div>

            <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '12px' }}>Navigation</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px', marginBottom: '24px' }}>
              <ColorSwatch token="colors.navItemText.enabled.onLight" value={themeColors.navItemText.enabled.onLight} label="navItemText.onLight" />
              <ColorSwatch token="colors.navItemText.enabled.onDark" value={themeColors.navItemText.enabled.onDark} label="navItemText.onDark" onDarkBg />
            </div>

            <h3 style={{ ...typography.label.md, color: themeColors.text.highEmphasis.onLight, marginBottom: '12px' }}>Other</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px' }}>
              <ColorSwatch token="colors.buttonToggleBg.onLight" value={themeColors.buttonToggleBg.onLight} label="buttonToggleBg.onLight" small />
              <ColorSwatch token="colors.buttonToggleBg.onDark" value={themeColors.buttonToggleBg.onDark} label="buttonToggleBg.onDark" small onDarkBg />
              <ColorSwatch token="colors.chipBg.enabled" value={themeColors.chipBg.enabled} label="chipBg.enabled" small />
              <ColorSwatch token="colors.chipBg.hover" value={themeColors.chipBg.hover} label="chipBg.hover" small />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, max-content))', gap: '16px', marginTop: '16px' }}>
              <ColorSwatch token="colors.progressIndicatorTrack" value={themeColors.progressIndicatorTrack} label="progressIndicatorTrack" small />
              <ColorSwatch token="colors.tableCellHighlight.highEmphasis" value={themeColors.tableCellHighlight.highEmphasis} label="tableCellHighlight.high" small />
              <ColorSwatch token="colors.tableCellHighlight.midEmphasis" value={themeColors.tableCellHighlight.midEmphasis} label="tableCellHighlight.mid" small />
            </div>
          </ColorGroup>
        </>
      )}

      {/* ================================================================== */}
      {/* USAGE TAB */}
      {/* ================================================================== */}
      {activeTab === 'usage' && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Usage</h2>
          <p style={sharedStyles.sectionDescription}>
            How to use theme-aware color tokens in your components.
          </p>

          <div style={sharedStyles.card}>
            <h3 style={{ ...typography.heading.h4, color: themeColors.text.highEmphasis.onLight, marginBottom: '16px', marginTop: '16px' }}>
              Option 1: useColors() Hook (Recommended)
            </h3>
            <CodeBlock>{`import { useColors } from '@/styles/themes'

function MyComponent() {
  const colors = useColors()

  return (
    <div style={{
      background: colors.surface.light,
      color: colors.text.highEmphasis.onLight,
      border: \`1px solid \${colors.border.lowEmphasis.onLight}\`,
    }}>
      <h1 style={{ color: colors.brand.default }}>
        Theme-aware heading
      </h1>
    </div>
  )
}`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={{ ...typography.heading.h4, color: themeColors.text.highEmphasis.onLight, marginBottom: '16px', marginTop: '16px' }}>
              Option 2: Static Import (Non-React / Fallback)
            </h3>
            <CodeBlock>{`import { colors } from '@/styles/design-tokens'

// Static Trace theme colors — not theme-aware
const style = {
  background: colors.surface.light,
  color: colors.text.highEmphasis.onLight,
  border: \`1px solid \${colors.border.lowEmphasis.onLight}\`,
}`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={{ ...typography.heading.h4, color: themeColors.text.highEmphasis.onLight, marginBottom: '16px', marginTop: '16px' }}>
              Text Colors
            </h3>
            <CodeBlock>{`// On light backgrounds
color: colors.text.highEmphasis.onLight   // Primary text
color: colors.text.lowEmphasis.onLight    // Secondary text
color: colors.text.disabled.onLight       // Disabled

// On dark backgrounds
color: colors.text.highEmphasis.onDark
color: colors.text.lowEmphasis.onDark

// Action text (links)
color: colors.text.action.enabled
color: colors.text.action.hover`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={{ ...typography.heading.h4, color: themeColors.text.highEmphasis.onLight, marginBottom: '16px', marginTop: '16px' }}>
              Borders
            </h3>
            <CodeBlock>{`border: \`1px solid \${colors.border.lowEmphasis.onLight}\`   // Subtle
border: \`1px solid \${colors.border.midEmphasis.onLight}\`   // Default
border: \`1px solid \${colors.border.highEmphasis.onLight}\`  // Prominent`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={{ ...typography.heading.h4, color: themeColors.text.highEmphasis.onLight, marginBottom: '16px', marginTop: '16px' }}>
              Status Colors
            </h3>
            <CodeBlock>{`// Status banner
<div style={{
  background: colors.surface.success,
  border: \`1px solid \${colors.surfaceBorder.success}\`,
}}>
  <div style={{ color: colors.status.success }}>
    Success!
  </div>
</div>`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={{ ...typography.heading.h4, color: themeColors.text.highEmphasis.onLight, marginBottom: '16px', marginTop: '16px' }}>
              Badge Colors
            </h3>
            <CodeBlock>{`// Badge with paired colors
<Badge style={{
  background: colors.badge.infoLight,
  color: colors.badge.info,
}}>
  New
</Badge>

// Available: info, success, warning, important,
// aqua, green, yellow, fuschia, purple, charcoal
// Each has a "Light" variant (e.g., infoLight)`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={{ ...typography.heading.h4, color: themeColors.text.highEmphasis.onLight, marginBottom: '16px', marginTop: '16px' }}>
              Theme Switching
            </h3>
            <CodeBlock>{`import { ThemeProvider } from '@/styles/themes'
import { lumenTheme } from '@/styles/themes'
// import { otherTheme } from '@/styles/themes/other'

// Wrap your app or section with a theme
<ThemeProvider theme={lumenTheme}>
  <App />
</ThemeProvider>`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={{ ...typography.heading.h4, color: themeColors.text.highEmphasis.onLight, marginBottom: '16px', marginTop: '16px' }}>
              Figma Token Mapping
            </h3>
            <p style={{ ...typography.body.sm, color: themeColors.text.lowEmphasis.onLight, marginBottom: '16px' }}>
              All color tokens map 1:1 to Figma variables with the <code style={{ background: themeColors.surface.lightDarker, padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>lumen_sys_color_</code> prefix.
            </p>
            <SpecTable
              headers={['Code Token', 'Figma Variable']}
              rows={[
                ['colors.brand.default', 'lumen_sys_color_brand'],
                ['colors.surface.light', 'lumen_sys_color_surface_light'],
                ['colors.text.highEmphasis.onLight', 'lumen_sys_color_text_highEmphasis_onLight'],
                ['colors.border.lowEmphasis.onLight', 'lumen_sys_color_border_lowEmphasis_onLight'],
                ['colors.action.enabled', 'lumen_sys_color_action_enabled'],
                ['colors.badge.info', 'lumen_sys_color_badge_info'],
                ['colors.scrim', 'lumen_sys_color_scrim'],
              ]}
            />
          </div>
        </section>
      )}
    </StyleguideLayout>
  )
}
