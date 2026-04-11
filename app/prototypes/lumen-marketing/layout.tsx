'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useThemeSwitcher, useTheme } from '@/styles/themes'
import {
  colors,
  spacing,
  fontFamilies,
  fontWeights,
  typography,
  borderRadius,
  borderRadiusSemantics,
  transitionPresets,
  breakpoints,
} from '@/styles/design-tokens'
import { SHOWCASE_THEMES } from './themes'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

const NAV_LINKS = [
  { label: 'Home', href: '/prototypes/lumen-marketing' },
  { label: 'Themes', href: '/prototypes/lumen-marketing/themes' },
  { label: 'Components', href: '/prototypes/lumen-marketing/components' },
  { label: 'Get Started', href: '/prototypes/lumen-marketing/get-started' },
]

function MarketingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const theme = useTheme()
  const { themeName, setThemeName } = useThemeSwitcher()
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.surface.light,
        color: colors.text.highEmphasis.onLight,
        fontFamily: fontFamilies.body,
      }}
    >
      {/* Top nav */}
      <header
        role="banner"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: colors.surface.light,
          borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
          backdropFilter: 'saturate(180%) blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: `${spacing.md} ${isMobile ? spacing.lg : spacing['2xl']}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.lg,
          }}
        >
          {/* Logo */}
          <Link
            href="/prototypes/lumen-marketing"
            aria-label="LUMEN home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              textDecoration: 'none',
              color: colors.text.highEmphasis.onLight,
            }}
          >
            <LumenMark />
            <span
              style={{
                fontFamily: fontFamilies.display,
                fontSize: typography.heading.h6.fontSize,
                fontWeight: fontWeights.bold,
                letterSpacing: '-0.01em',
              }}
            >
              LUMEN
            </span>
          </Link>

          {/* Nav links */}
          {!isMobile && (
            <nav aria-label="Main navigation" style={{ display: 'flex', gap: spacing.xs }}>
              {NAV_LINKS.slice(1).map((link) => {
                const isActive =
                  link.href === pathname ||
                  (link.href !== '/prototypes/lumen-marketing' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      padding: `${spacing.xs} ${spacing.md}`,
                      borderRadius: borderRadius.sm,
                      fontFamily: fontFamilies.body,
                      fontSize: typography.label.md.fontSize,
                      fontWeight: isActive ? fontWeights.semibold : fontWeights.medium,
                      color: isActive
                        ? colors.text.highEmphasis.onLight
                        : colors.text.lowEmphasis.onLight,
                      textDecoration: 'none',
                      transition: `color ${transitionPresets.fast}`,
                    }}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          )}

          {/* Theme switcher pill */}
          <ThemeSwitcherPill
            themeName={themeName}
            onChange={setThemeName}
            compact={isMobile}
          />
        </div>
      </header>

      {/* Page content */}
      <main id="main-content">{children}</main>

      {/* Footer */}
      <footer
        role="contentinfo"
        style={{
          borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
          backgroundColor: colors.surface.lightDarker,
          marginTop: spacing['6xl'],
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: `${spacing['3xl']} ${isMobile ? spacing.lg : spacing['2xl']}`,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: spacing.xl,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <LumenMark />
            <span
              style={{
                fontFamily: fontFamilies.display,
                fontWeight: fontWeights.bold,
                fontSize: typography.label.lg.fontSize,
              }}
            >
              LUMEN
            </span>
            <span
              style={{
                fontSize: typography.body.sm.fontSize,
                color: colors.text.lowEmphasis.onLight,
                marginLeft: spacing.sm,
              }}
            >
              · One design system. Every product.
            </span>
          </div>
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: spacing.lg, flexWrap: 'wrap' }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: typography.body.sm.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <span
            style={{
              fontSize: typography.body.xs.fontSize,
              color: colors.text.disabled.onLight,
            }}
          >
            Active theme: <strong style={{ color: colors.text.lowEmphasis.onLight }}>{theme.name}</strong>
          </span>
        </div>
      </footer>
    </div>
  )
}

function ThemeSwitcherPill({
  themeName,
  onChange,
  compact,
}: {
  themeName: string
  onChange: (name: string) => void
  compact?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const activeTheme = SHOWCASE_THEMES.find((t) => t.id === themeName) ?? SHOWCASE_THEMES[0]

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        aria-label={`Current theme: ${activeTheme.label}. Click to change theme.`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          padding: `${spacing.xs} ${spacing.sm}`,
          backgroundColor: colors.surface.lightDarker,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadiusSemantics.button,
          cursor: 'pointer',
          fontFamily: fontFamilies.body,
          fontSize: typography.label.sm.fontSize,
          fontWeight: fontWeights.medium,
          color: colors.text.highEmphasis.onLight,
          transition: `background-color ${transitionPresets.fast}, border-color ${transitionPresets.fast}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.border.midEmphasis.onLight
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = colors.border.lowEmphasis.onLight
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: colors.brand.default,
            border: `1px solid ${colors.border.midEmphasis.onLight}`,
          }}
        />
        {!compact && <span>{activeTheme.label}</span>}
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Theme selector"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: '240px',
            backgroundColor: colors.surface.light,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadiusSemantics.card,
            boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
            padding: spacing['2xs'],
            zIndex: 100,
          }}
        >
          {SHOWCASE_THEMES.map((t) => {
            const isActive = t.id === themeName
            return (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onChange(t.id)
                  setOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  width: '100%',
                  padding: `${spacing.sm} ${spacing.sm}`,
                  backgroundColor: isActive ? colors.selectedHighlight : 'transparent',
                  border: 'none',
                  borderRadius: borderRadius.sm,
                  cursor: 'pointer',
                  textAlign: 'left' as const,
                  fontFamily: fontFamilies.body,
                  transition: `background-color ${transitionPresets.fast}`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = colors.hover.onLight
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isActive
                    ? colors.selectedHighlight
                    : 'transparent'
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: colors.brand.default,
                    border: `1px solid ${colors.border.midEmphasis.onLight}`,
                    flexShrink: 0,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      fontSize: typography.body.sm.fontSize,
                      fontWeight: isActive ? fontWeights.semibold : fontWeights.medium,
                      color: colors.text.highEmphasis.onLight,
                    }}
                  >
                    {t.label}
                  </span>
                  <span
                    style={{
                      fontSize: typography.body.xs.fontSize,
                      color: colors.text.lowEmphasis.onLight,
                    }}
                  >
                    {t.tagline}
                  </span>
                </div>
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M13.5 4.5L6 12L2.5 8.5"
                      stroke={colors.brand.default}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function LumenMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="14" cy="14" r="13" stroke={colors.text.highEmphasis.onLight} strokeWidth="1.5" />
      <circle cx="14" cy="14" r="6" fill={colors.brand.default} />
    </svg>
  )
}

export default function LumenMarketingLayout({ children }: { children: React.ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>
}
