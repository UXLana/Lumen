// @ts-nocheck
'use client'

import React from 'react'
import Link from 'next/link'
import {
  Button,
  Badge,
  Chip,
  Input,
  Avatar,
  Switch,
  Checkbox,
  ProgressBar,
  StatsCard,
  Radio,
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
import { useThemeSwitcher } from '@/styles/themes'
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

// ---------------------------------------------------------------------------
// Landing Page
// ---------------------------------------------------------------------------

export default function LumenMarketingLanding() {
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)
  const isTablet = useMediaQuery(`(max-width: ${parseInt(breakpoints.lg) - 1}px)`)

  return (
    <>
      <Hero isMobile={isMobile} isTablet={isTablet} />
      <ThemeShowcaseBar isMobile={isMobile} />
      <ClaimStrip isMobile={isMobile} />
      <ComponentWall isMobile={isMobile} />
      <AccessibilityProof isMobile={isMobile} />
      <FinalCTA isMobile={isMobile} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  return (
    <section
      aria-labelledby="hero-headline"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: `${isMobile ? spacing['4xl'] : spacing['6xl']} ${isMobile ? spacing.lg : spacing['2xl']}`,
        display: 'grid',
        gridTemplateColumns: isTablet ? '1fr' : '1.2fr 1fr',
        gap: isMobile ? spacing['3xl'] : spacing['4xl'],
        alignItems: 'center',
      }}
    >
      {/* Left — headline block */}
      <div>
        <Badge color="brand" variant="outlined" size="md">
          v1.0 · Design System
        </Badge>
        <h1
          id="hero-headline"
          style={{
            fontFamily: fontFamilies.display,
            fontSize: isMobile ? '44px' : typography.display['2xl'].fontSize,
            lineHeight: isMobile ? '52px' : typography.display['2xl'].lineHeight,
            letterSpacing: '-0.02em',
            fontWeight: fontWeights.bold,
            color: colors.text.highEmphasis.onLight,
            margin: `${spacing.lg} 0 ${spacing.lg} 0`,
          }}
        >
          One design system.
          <br />
          <span style={{ color: colors.brand.default }}>Every product.</span>
        </h1>
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: isMobile ? typography.body.lg.fontSize : typography.body.xl.fontSize,
            lineHeight: 1.5,
            color: colors.text.lowEmphasis.onLight,
            maxWidth: '560px',
            margin: `0 0 ${spacing['2xl']} 0`,
          }}
        >
          The themeable, accessible foundation your whole portfolio can share —
          from dense fintech tables to generous marketing pages. Built on tokens,
          typed with TypeScript, auditable against WCAG 2.2 AA.
        </p>
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            flexWrap: 'wrap',
          }}
        >
          <Link href="/prototypes/lumen-marketing/themes" style={{ textDecoration: 'none' }}>
            <Button emphasis="high" size="lg" rightIcon={<IconArrowRight size="sm" />}>
              Explore the themes
            </Button>
          </Link>
          <Link href="/prototypes/lumen-marketing/components" style={{ textDecoration: 'none' }}>
            <Button emphasis="low" size="lg">
              View components
            </Button>
          </Link>
        </div>

        {/* Proof chips */}
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            flexWrap: 'wrap',
            marginTop: spacing['2xl'],
          }}
        >
          {['9 themes', '50+ components', 'WCAG 2.2 AA', 'TypeScript', 'Figma parity'].map((t) => (
            <span
              key={t}
              style={{
                fontSize: typography.label.sm.fontSize,
                fontFamily: fontFamilies.body,
                color: colors.text.lowEmphasis.onLight,
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing['2xs'],
              }}
            >
              <IconCheck size="xs" color={colors.brand.default} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Right — hero component cluster */}
      {!isTablet && <HeroCluster />}
    </section>
  )
}

function HeroCluster() {
  return (
    <div
      aria-hidden="false"
      aria-label="Live component preview"
      style={{
        position: 'relative',
        height: '520px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Floating card 1 — stats */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '0',
          width: '260px',
          padding: spacing.lg,
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadiusSemantics.card,
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          transform: 'rotate(-2deg)',
        }}
      >
        <div
          style={{
            fontSize: typography.label.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
            marginBottom: spacing.xs,
            fontFamily: fontFamilies.body,
            fontWeight: fontWeights.medium,
          }}
        >
          Active users
        </div>
        <div
          style={{
            fontSize: typography.heading.h2.fontSize,
            fontWeight: fontWeights.bold,
            fontFamily: fontFamilies.display,
            color: colors.text.highEmphasis.onLight,
            lineHeight: 1.1,
          }}
        >
          12,480
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing['2xs'],
            marginTop: spacing.xs,
          }}
        >
          <Badge color="success" variant="filled" size="sm">↑ 12.4%</Badge>
          <span
            style={{
              fontSize: typography.body.xs.fontSize,
              color: colors.text.lowEmphasis.onLight,
              fontFamily: fontFamilies.body,
            }}
          >
            vs last week
          </span>
        </div>
      </div>

      {/* Floating card 2 — avatars & list */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '0',
          width: '280px',
          padding: spacing.lg,
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadiusSemantics.card,
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          transform: 'rotate(2deg)',
        }}
      >
        <div
          style={{
            fontSize: typography.label.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
            fontFamily: fontFamilies.body,
            fontWeight: fontWeights.medium,
            marginBottom: spacing.sm,
          }}
        >
          Team
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          {[
            { name: 'Maya Chen', role: 'Design Lead', initials: 'MC', color: 'brand' as const },
            { name: 'Tomás Rivera', role: 'Engineer', initials: 'TR', color: 'info' as const },
            { name: 'Priya Shah', role: 'Researcher', initials: 'PS', color: 'warning' as const },
          ].map((p) => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <Avatar initials={p.initials} size="sm" color={p.color} />
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span
                  style={{
                    fontSize: typography.body.sm.fontSize,
                    fontWeight: fontWeights.medium,
                    color: colors.text.highEmphasis.onLight,
                    fontFamily: fontFamilies.body,
                  }}
                >
                  {p.name}
                </span>
                <span
                  style={{
                    fontSize: typography.body.xs.fontSize,
                    color: colors.text.lowEmphasis.onLight,
                    fontFamily: fontFamilies.body,
                  }}
                >
                  {p.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating card 3 — input + button */}
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '15%',
          width: '300px',
          padding: spacing.lg,
          backgroundColor: colors.surface.light,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderRadius: borderRadiusSemantics.card,
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          transform: 'rotate(-1deg)',
        }}
      >
        <div
          style={{
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.text.highEmphasis.onLight,
            fontFamily: fontFamilies.body,
            marginBottom: spacing.xs,
          }}
        >
          Project name
        </div>
        <Input
          placeholder="My new product"
          size="sm"
          fullWidth
          style={{ marginBottom: spacing.sm }}
        />
        <Button emphasis="high" size="md" fullWidth>
          Create project
        </Button>
      </div>

      {/* Decorative tag */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '0',
          right: '20%',
          padding: `${spacing['2xs']} ${spacing.sm}`,
          backgroundColor: colors.brand.default,
          color: '#fff',
          fontFamily: fontFamilies.body,
          fontSize: typography.label.sm.fontSize,
          fontWeight: fontWeights.semibold,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          borderRadius: borderRadius.full,
          transform: 'rotate(6deg)',
        }}
      >
        Live preview
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Theme Showcase Bar (just below hero)
// ---------------------------------------------------------------------------

function ThemeShowcaseBar({ isMobile }: { isMobile: boolean }) {
  const { themeName, setThemeName } = useThemeSwitcher()

  return (
    <section
      aria-label="Theme showcase"
      style={{
        backgroundColor: colors.surface.lightDarker,
        borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: `${spacing.xl} ${isMobile ? spacing.lg : spacing['2xl']}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.lg,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '0 0 auto' }}>
          <div
            style={{
              fontSize: typography.label.sm.fontSize,
              fontWeight: fontWeights.semibold,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.text.lowEmphasis.onLight,
              fontFamily: fontFamilies.body,
              marginBottom: spacing['2xs'],
            }}
          >
            Try it live
          </div>
          <div
            style={{
              fontSize: typography.heading.h5.fontSize,
              fontWeight: fontWeights.semibold,
              fontFamily: fontFamilies.display,
              color: colors.text.highEmphasis.onLight,
            }}
          >
            Switch themes. Watch the page transform.
          </div>
        </div>
        <div
          role="radiogroup"
          aria-label="Theme selector"
          style={{
            display: 'flex',
            gap: spacing.xs,
            flexWrap: 'wrap',
          }}
        >
          {SHOWCASE_THEMES.map((t) => {
            const isActive = t.id === themeName
            return (
              <button
                key={t.id}
                role="radio"
                aria-checked={isActive}
                onClick={() => setThemeName(t.id)}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  backgroundColor: isActive ? colors.brand.default : colors.surface.light,
                  color: isActive ? '#fff' : colors.text.highEmphasis.onLight,
                  border: `1px solid ${isActive ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadius.full,
                  fontFamily: fontFamilies.body,
                  fontSize: typography.label.sm.fontSize,
                  fontWeight: fontWeights.medium,
                  cursor: 'pointer',
                  transition: `all ${transitionPresets.fast}`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = colors.border.midEmphasis.onLight
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = colors.border.lowEmphasis.onLight
                  }
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Three-claim strip
// ---------------------------------------------------------------------------

const CLAIMS = [
  {
    eyebrow: 'Themeable to the core',
    headline: 'One codebase, nine identities.',
    body: 'Every component reads from CSS-variable-backed tokens. Switch themes at runtime — no rebuild, no forks, no drift.',
    proof: '9 themes · 0 component forks',
  },
  {
    eyebrow: 'Accessible by default',
    headline: 'WCAG 2.2 AA. Audited, not asserted.',
    body: 'Keyboard-first, focus rings visible, motion respects prefers-reduced-motion, contrast verified per theme.',
    proof: 'Section 508 · ADA Title II',
  },
  {
    eyebrow: 'Built for real teams',
    headline: 'TypeScript, React, and Figma.',
    body: 'Typed props, exhaustive exports, design-token parity with Figma Variables, and zero runtime CSS-in-JS.',
    proof: 'TypeScript · React · Figma',
  },
]

function ClaimStrip({ isMobile }: { isMobile: boolean }) {
  return (
    <section
      aria-label="Why LUMEN"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: `${spacing['6xl']} ${isMobile ? spacing.lg : spacing['2xl']}`,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: spacing.xl,
        }}
      >
        {CLAIMS.map((c, i) => (
          <article
            key={c.eyebrow}
            style={{
              padding: spacing['2xl'],
              backgroundColor: colors.surface.lightDarker,
              borderRadius: borderRadiusSemantics.card,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            }}
          >
            <div
              style={{
                fontSize: typography.label.sm.fontSize,
                fontWeight: fontWeights.semibold,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colors.brand.default,
                fontFamily: fontFamilies.body,
                marginBottom: spacing.sm,
              }}
            >
              0{i + 1} · {c.eyebrow}
            </div>
            <h3
              style={{
                fontFamily: fontFamilies.display,
                fontSize: typography.heading.h3.fontSize,
                fontWeight: fontWeights.semibold,
                lineHeight: 1.15,
                color: colors.text.highEmphasis.onLight,
                margin: `0 0 ${spacing.md} 0`,
                letterSpacing: '-0.01em',
              }}
            >
              {c.headline}
            </h3>
            <p
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.md.fontSize,
                lineHeight: 1.55,
                color: colors.text.lowEmphasis.onLight,
                margin: `0 0 ${spacing.lg} 0`,
              }}
            >
              {c.body}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                paddingTop: spacing.md,
                borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
                fontSize: typography.label.sm.fontSize,
                color: colors.text.highEmphasis.onLight,
                fontFamily: fontFamilies.body,
                fontWeight: fontWeights.medium,
              }}
            >
              <IconCheck size="sm" color={colors.brand.default} />
              {c.proof}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Component wall — "walking into a workshop"
// ---------------------------------------------------------------------------

function ComponentWall({ isMobile }: { isMobile: boolean }) {
  const previews: Array<{ label: string; render: () => React.ReactNode }> = [
    { label: 'Button', render: () => <Button emphasis="high" size="md">Save changes</Button> },
    { label: 'Button · Low', render: () => <Button emphasis="low" size="md">Cancel</Button> },
    { label: 'Badge', render: () => <Badge color="brand" variant="filled">New</Badge> },
    { label: 'Badge · Status', render: () => <Badge color="success" variant="outlined">Active</Badge> },
    { label: 'Chip', render: () => <Chip>Design</Chip> },
    { label: 'Avatar', render: () => <Avatar initials="LH" size="md" color="brand" /> },
    { label: 'Input', render: () => <Input placeholder="Search…" size="sm" fullWidth style={{ marginBottom: 0, maxWidth: '200px' }} /> },
    { label: 'Switch', render: () => <Switch checked onChange={() => {}} label="On" /> },
    { label: 'Checkbox', render: () => <Checkbox checked onChange={() => {}} label="Agree" /> },
    { label: 'Radio', render: () => <Radio checked onChange={() => {}} label="Option" /> },
    { label: 'Progress', render: () => <div style={{ width: '180px' }}><ProgressBar value={64} /></div> },
    { label: 'Stats', render: () => (
      <div style={{ width: '180px' }}>
        <StatsCard label="Revenue" value="$12.4k" />
      </div>
    ) },
  ]

  return (
    <section
      aria-label="Component preview wall"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: `${spacing['4xl']} ${isMobile ? spacing.lg : spacing['2xl']}`,
      }}
    >
      <div style={{ marginBottom: spacing['2xl'] }}>
        <div
          style={{
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.semibold,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: colors.brand.default,
            fontFamily: fontFamilies.body,
            marginBottom: spacing.sm,
          }}
        >
          The library
        </div>
        <h2
          style={{
            fontFamily: fontFamilies.display,
            fontSize: isMobile ? typography.heading.h2.fontSize : typography.heading.h1.fontSize,
            fontWeight: fontWeights.bold,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: colors.text.highEmphasis.onLight,
            margin: `0 0 ${spacing.md} 0`,
            maxWidth: '760px',
          }}
        >
          Fifty components. Every one lives in this system.
        </h2>
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.lg.fontSize,
            lineHeight: 1.55,
            color: colors.text.lowEmphasis.onLight,
            maxWidth: '640px',
            margin: 0,
          }}
        >
          Every preview below is a real LUMEN component. Switch themes in the top bar and
          watch the entire wall transform in place.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? '1fr 1fr'
            : 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: spacing.md,
        }}
      >
        {previews.map((p) => (
          <div
            key={p.label}
            style={{
              padding: spacing.lg,
              backgroundColor: colors.surface.light,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadiusSemantics.card,
              minHeight: '140px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: spacing.sm,
              transition: `transform ${transitionPresets.default}, border-color ${transitionPresets.default}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.borderColor = colors.border.midEmphasis.onLight
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = colors.border.lowEmphasis.onLight
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', minHeight: '60px' }}>
              {p.render()}
            </div>
            <div
              style={{
                fontSize: typography.label.sm.fontSize,
                fontFamily: fontFamilies.body,
                fontWeight: fontWeights.medium,
                color: colors.text.lowEmphasis.onLight,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {p.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: spacing['2xl'], textAlign: 'center' }}>
        <Link href="/prototypes/lumen-marketing/components" style={{ textDecoration: 'none' }}>
          <Button emphasis="mid" size="md" rightIcon={<IconArrowRight size="sm" />}>
            View the full library
          </Button>
        </Link>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Accessibility Proof Section
// ---------------------------------------------------------------------------

function AccessibilityProof({ isMobile }: { isMobile: boolean }) {
  return (
    <section
      aria-labelledby="a11y-heading"
      style={{
        backgroundColor: colors.surface.lightDarker,
        borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
        padding: `${spacing['6xl']} 0`,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: `0 ${isMobile ? spacing.lg : spacing['2xl']}`,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: spacing['3xl'],
          alignItems: 'center',
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
              marginBottom: spacing.sm,
            }}
          >
            Accessibility
          </div>
          <h2
            id="a11y-heading"
            style={{
              fontFamily: fontFamilies.display,
              fontSize: isMobile ? typography.heading.h2.fontSize : typography.heading.h1.fontSize,
              fontWeight: fontWeights.bold,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: colors.text.highEmphasis.onLight,
              margin: `0 0 ${spacing.lg} 0`,
            }}
          >
            Accessible by default, not by afterthought.
          </h2>
          <p
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.lg.fontSize,
              lineHeight: 1.55,
              color: colors.text.lowEmphasis.onLight,
              margin: `0 0 ${spacing.xl} 0`,
            }}
          >
            Tab through the playground on the right. Every component is keyboard-navigable,
            every focus state is visible, every control carries the right ARIA role.
            This isn&apos;t a claim — it&apos;s the default.
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.sm,
            }}
          >
            {[
              'WCAG 2.2 AA across all 9 themes',
              'Section 508 & ADA Title II aligned',
              'Focus rings visible, respects prefers-reduced-motion',
              'Screen-reader tested with NVDA, JAWS, VoiceOver',
              'Minimum 44×44px touch targets',
            ].map((item) => (
              <li
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.md.fontSize,
                  color: colors.text.highEmphasis.onLight,
                }}
              >
                <IconCheck size="sm" color={colors.brand.default} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive playground */}
        <A11yPlayground />
      </div>
    </section>
  )
}

function A11yPlayground() {
  const [notify, setNotify] = React.useState(true)
  const [plan, setPlan] = React.useState('team')
  const [accept, setAccept] = React.useState(false)
  const [query, setQuery] = React.useState('')

  return (
    <div
      style={{
        padding: spacing['2xl'],
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadiusSemantics.card,
      }}
    >
      <div
        style={{
          fontSize: typography.label.sm.fontSize,
          fontWeight: fontWeights.semibold,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: colors.text.lowEmphasis.onLight,
          fontFamily: fontFamilies.body,
          marginBottom: spacing.md,
        }}
      >
        Tab here → everything works
      </div>

      <Input
        label="Search"
        placeholder="Try typing and tab around…"
        size="md"
        fullWidth
        value={query}
        onChange={(v) => setQuery(v)}
        style={{ marginBottom: spacing.md }}
      />

      <div style={{ marginBottom: spacing.md }}>
        <Switch checked={notify} onChange={setNotify} label="Email notifications" />
      </div>

      <div
        style={{
          fontFamily: fontFamilies.body,
          fontSize: typography.label.sm.fontSize,
          fontWeight: fontWeights.medium,
          color: colors.text.highEmphasis.onLight,
          marginBottom: spacing.xs,
        }}
      >
        Plan
      </div>
      <div
        role="radiogroup"
        aria-label="Plan"
        style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, marginBottom: spacing.md }}
      >
        <Radio
          checked={plan === 'solo'}
          onChange={() => setPlan('solo')}
          label="Solo"
          name="a11y-plan"
        />
        <Radio
          checked={plan === 'team'}
          onChange={() => setPlan('team')}
          label="Team"
          name="a11y-plan"
        />
      </div>

      <div style={{ marginBottom: spacing.lg }}>
        <Checkbox
          checked={accept}
          onChange={setAccept}
          label="I agree to the terms"
        />
      </div>

      <Button
        emphasis="high"
        size="md"
        fullWidth
        disabled={!accept}
      >
        Submit form
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Final CTA
// ---------------------------------------------------------------------------

function FinalCTA({ isMobile }: { isMobile: boolean }) {
  return (
    <section
      aria-labelledby="cta-heading"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: `${spacing['6xl']} ${isMobile ? spacing.lg : spacing['2xl']}`,
        textAlign: 'center',
      }}
    >
      <h2
        id="cta-heading"
        style={{
          fontFamily: fontFamilies.display,
          fontSize: isMobile ? typography.heading.h1.fontSize : typography.display.lg.fontSize,
          fontWeight: fontWeights.bold,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: colors.text.highEmphasis.onLight,
          margin: `0 0 ${spacing.md} 0`,
          maxWidth: '760px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        Ready to build your portfolio on one foundation?
      </h2>
      <p
        style={{
          fontFamily: fontFamilies.body,
          fontSize: typography.body.xl.fontSize,
          lineHeight: 1.5,
          color: colors.text.lowEmphasis.onLight,
          maxWidth: '560px',
          margin: `0 auto ${spacing['2xl']} auto`,
        }}
      >
        Install LUMEN in your project in under two minutes. No config, no build step.
      </p>
      <div
        style={{
          display: 'flex',
          gap: spacing.sm,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Link href="/prototypes/lumen-marketing/get-started" style={{ textDecoration: 'none' }}>
          <Button emphasis="high" size="lg" rightIcon={<IconArrowRight size="sm" />}>
            Get started
          </Button>
        </Link>
        <Link href="/prototypes/lumen-marketing/components" style={{ textDecoration: 'none' }}>
          <Button emphasis="low" size="lg">
            Browse components
          </Button>
        </Link>
      </div>
    </section>
  )
}
