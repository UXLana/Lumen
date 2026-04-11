'use client'

import React from 'react'
import Link from 'next/link'
import {
  Button,
  Badge,
  Input,
  Avatar,
  Switch,
  Checkbox,
  StatsCard,
  ProgressBar,
  Chip,
  IconArrowRight,
  IconCheck,
} from '@/components'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadius,
  borderRadiusSemantics,
  transitionPresets,
  breakpoints,
} from '@/styles/design-tokens'
import { useTheme, useThemeSwitcher, themeMap } from '@/styles/themes'
import { SHOWCASE_THEMES } from '../themes'

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

export default function ThemesPage() {
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)
  const { themeName, setThemeName } = useThemeSwitcher()
  const theme = useTheme()
  const activeShowcase = SHOWCASE_THEMES.find((t) => t.id === themeName) ?? SHOWCASE_THEMES[0]

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="themes-heading"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: `${spacing['5xl']} ${isMobile ? spacing.lg : spacing['2xl']} ${spacing['3xl']}`,
        }}
      >
        <Badge color="brand" variant="outlined" size="md">
          Theme system
        </Badge>
        <h1
          id="themes-heading"
          style={{
            fontFamily: fontFamilies.display,
            fontSize: isMobile ? '44px' : typography.display.xl.fontSize,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            fontWeight: fontWeights.bold,
            color: colors.text.highEmphasis.onLight,
            margin: `${spacing.md} 0 ${spacing.lg} 0`,
            maxWidth: '900px',
          }}
        >
          One system. <span style={{ color: colors.brand.default }}>Nine identities.</span>
        </h1>
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.xl.fontSize,
            lineHeight: 1.5,
            color: colors.text.lowEmphasis.onLight,
            maxWidth: '720px',
            margin: 0,
          }}
        >
          Every component, every page, every pattern — rendered by the same codebase.
          Pick a theme below and watch this entire page transform in place.
        </p>
      </section>

      {/* Theme grid */}
      <section
        aria-label="Theme picker"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: `0 ${isMobile ? spacing.lg : spacing['2xl']} ${spacing['4xl']}`,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: spacing.md,
          }}
        >
          {SHOWCASE_THEMES.map((t) => {
            const isActive = t.id === themeName
            const themeObj = themeMap[t.id]
            if (!themeObj) return null
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeName(t.id)}
                aria-pressed={isActive}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  textAlign: 'left',
                  padding: 0,
                  backgroundColor: colors.surface.light,
                  border: `2px solid ${isActive ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadiusSemantics.card,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: `transform ${transitionPresets.default}, border-color ${transitionPresets.default}`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.borderColor = colors.border.midEmphasis.onLight
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = colors.border.lowEmphasis.onLight
                  }
                }}
              >
                {/* Swatch strip — raw theme colors, not var refs */}
                <div
                  aria-hidden="true"
                  style={{
                    display: 'flex',
                    height: '64px',
                  }}
                >
                  <div style={{ flex: 1, backgroundColor: themeObj.colors.brand.default }} />
                  <div style={{ flex: 1, backgroundColor: themeObj.colors.brand.lighter }} />
                  <div style={{ flex: 1, backgroundColor: themeObj.colors.surface.light }} />
                  <div style={{ flex: 1, backgroundColor: themeObj.colors.text.highEmphasis.onLight }} />
                </div>
                <div style={{ padding: spacing.lg }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: spacing['2xs'],
                    }}
                  >
                    <span
                      style={{
                        fontFamily: fontFamilies.display,
                        fontSize: typography.heading.h5.fontSize,
                        fontWeight: fontWeights.semibold,
                        color: colors.text.highEmphasis.onLight,
                      }}
                    >
                      {t.label}
                    </span>
                    {isActive && (
                      <span
                        aria-label="Active theme"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: spacing['2xs'],
                          fontSize: typography.label.sm.fontSize,
                          fontFamily: fontFamilies.body,
                          fontWeight: fontWeights.semibold,
                          color: colors.brand.default,
                        }}
                      >
                        <IconCheck size="sm" color={colors.brand.default} />
                        Active
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontFamily: fontFamilies.body,
                      fontSize: typography.body.sm.fontSize,
                      color: colors.text.lowEmphasis.onLight,
                      margin: 0,
                    }}
                  >
                    {t.tagline}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Live preview section */}
      <section
        aria-label="Live theme preview"
        style={{
          backgroundColor: colors.surface.lightDarker,
          borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
          padding: `${spacing['5xl']} 0`,
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: `0 ${isMobile ? spacing.lg : spacing['2xl']}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: spacing['2xl'],
              gap: spacing.lg,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: typography.label.sm.fontSize,
                  fontWeight: fontWeights.semibold,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: colors.brand.default,
                  fontFamily: fontFamilies.body,
                  marginBottom: spacing.xs,
                }}
              >
                Now showing
              </div>
              <h2
                style={{
                  fontFamily: fontFamilies.display,
                  fontSize: typography.heading.h2.fontSize,
                  fontWeight: fontWeights.bold,
                  color: colors.text.highEmphasis.onLight,
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                {activeShowcase.label} theme
              </h2>
            </div>
            <span
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.md.fontSize,
                color: colors.text.lowEmphasis.onLight,
                maxWidth: '420px',
              }}
            >
              {activeShowcase.tagline}. Every component below is themed by the same
              token system that powers the landing page.
            </span>
          </div>

          <ThemePreviewGrid isMobile={isMobile} />
        </div>
      </section>

      {/* CTA footer */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: `${spacing['5xl']} ${isMobile ? spacing.lg : spacing['2xl']}`,
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: fontFamilies.display,
            fontSize: isMobile ? typography.heading.h2.fontSize : typography.heading.h1.fontSize,
            fontWeight: fontWeights.bold,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: colors.text.highEmphasis.onLight,
            margin: `0 0 ${spacing.md} 0`,
          }}
        >
          Bring your own brand.
        </h2>
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.lg.fontSize,
            color: colors.text.lowEmphasis.onLight,
            maxWidth: '640px',
            margin: `0 auto ${spacing['2xl']} auto`,
          }}
        >
          Generate a new theme from a single brand color with the LUMEN theme factory —
          or fork one of these nine and tweak the tokens.
        </p>
        <Link href="/prototypes/lumen-marketing/get-started" style={{ textDecoration: 'none' }}>
          <Button emphasis="high" size="lg" rightIcon={<IconArrowRight size="sm" />}>
            Generate your theme
          </Button>
        </Link>
      </section>
    </>
  )
}

// ---------------------------------------------------------------------------
// Live component preview — re-renders in the active theme
// ---------------------------------------------------------------------------

function ThemePreviewGrid({ isMobile }: { isMobile: boolean }) {
  const [query, setQuery] = React.useState('')
  const [notify, setNotify] = React.useState(true)
  const [agree, setAgree] = React.useState(false)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: spacing.lg,
      }}
    >
      {/* Card A: form */}
      <article
        style={{
          padding: spacing['2xl'],
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadiusSemantics.card,
        }}
      >
        <div style={{ marginBottom: spacing.md }}>
          <Badge color="brand" variant="filled">Form example</Badge>
        </div>
        <h3
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h4.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            margin: `0 0 ${spacing.lg} 0`,
          }}
        >
          Create a new project
        </h3>
        <Input
          label="Project name"
          placeholder="My new product"
          value={query}
          onChange={(v) => setQuery(v)}
          fullWidth
        />
        <div style={{ marginTop: spacing.md, marginBottom: spacing.md }}>
          <Switch checked={notify} onChange={setNotify} label="Email me on deploys" />
        </div>
        <div style={{ marginBottom: spacing.lg }}>
          <Checkbox checked={agree} onChange={setAgree} label="I agree to the terms" />
        </div>
        <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'flex-end' }}>
          <Button emphasis="low">Cancel</Button>
          <Button emphasis="high" disabled={!agree}>Create project</Button>
        </div>
      </article>

      {/* Card B: stats & people */}
      <article
        style={{
          padding: spacing['2xl'],
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadiusSemantics.card,
        }}
      >
        <div style={{ marginBottom: spacing.md }}>
          <Badge color="success" variant="outlined">Live data</Badge>
        </div>
        <h3
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h4.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            margin: `0 0 ${spacing.lg} 0`,
          }}
        >
          Team overview
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, marginBottom: spacing.lg }}>
          <StatsCard label="Active users" value="12,480" />
          <StatsCard label="MRR" value="$48.2k" />
        </div>
        <div style={{ marginBottom: spacing.lg }}>
          <div
            style={{
              fontSize: typography.label.sm.fontSize,
              fontFamily: fontFamilies.body,
              fontWeight: fontWeights.medium,
              color: colors.text.lowEmphasis.onLight,
              marginBottom: spacing.xs,
            }}
          >
            Deployment progress
          </div>
          <ProgressBar value={72} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <Avatar initials="MC" size="sm" color="brand" />
          <Avatar initials="TR" size="sm" color="info" />
          <Avatar initials="PS" size="sm" color="warning" />
          <Avatar initials="+4" size="sm" color="neutral" />
          <span
            style={{
              marginLeft: spacing.xs,
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
              fontFamily: fontFamilies.body,
            }}
          >
            7 members
          </span>
        </div>
      </article>

      {/* Card C: tags */}
      <article
        style={{
          padding: spacing['2xl'],
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadiusSemantics.card,
          gridColumn: isMobile ? 'auto' : '1 / -1',
        }}
      >
        <h3
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h4.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            margin: `0 0 ${spacing.md} 0`,
          }}
        >
          The same chips, re-themed
        </h3>
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.md.fontSize,
            color: colors.text.lowEmphasis.onLight,
            margin: `0 0 ${spacing.lg} 0`,
            maxWidth: '640px',
          }}
        >
          Chips, badges, and buttons all inherit from the same tokens. Change the theme
          above and watch them recolor in place — no remount, no flicker.
        </p>
        <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap', marginBottom: spacing.md }}>
          {['Design', 'Engineering', 'Research', 'Marketing', 'Product', 'Brand', 'Ops'].map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
        <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
          <Badge color="brand" variant="filled">Primary</Badge>
          <Badge color="success" variant="filled">Success</Badge>
          <Badge color="warning" variant="filled">Warning</Badge>
          <Badge color="error" variant="filled">Error</Badge>
          <Badge color="info" variant="filled">Info</Badge>
          <Badge color="neutral" variant="outlined">Neutral</Badge>
        </div>
      </article>
    </div>
  )
}
