'use client'

import React from 'react'
import Link from 'next/link'
import {
  Button,
  Badge,
  IconArrowRight,
  IconCheck,
  IconCopy,
  IconExternalLink,
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
// Quick-start steps
// ---------------------------------------------------------------------------

interface Step {
  index: number
  title: string
  description: string
  code: string
  language?: string
}

const STEPS: Step[] = [
  {
    index: 1,
    title: 'Install',
    description: 'Add LUMEN to your React + TypeScript project. No peer-dependency gymnastics — React 18 or 19, and you’re set.',
    code: `npm install @lumen/react @lumen/tokens
# or
pnpm add @lumen/react @lumen/tokens`,
    language: 'bash',
  },
  {
    index: 2,
    title: 'Wrap your app in the theme provider',
    description: 'One provider at the root. Switch themes at runtime — no rebuild required.',
    code: `import { SwitchableThemeProvider } from '@lumen/react'

export default function RootLayout({ children }) {
  return (
    <SwitchableThemeProvider defaultTheme="lumen">
      {children}
    </SwitchableThemeProvider>
  )
}`,
    language: 'tsx',
  },
  {
    index: 3,
    title: 'Import components and go',
    description: 'Everything is typed, tree-shakable, and uses CSS-variable-backed tokens under the hood.',
    code: `import { Button, Input, DataTable } from '@lumen/react'

export default function NewProject() {
  return (
    <form>
      <Input label="Project name" required />
      <Button emphasis="high" size="lg">
        Create project
      </Button>
    </form>
  )
}`,
    language: 'tsx',
  },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GetStartedPage() {
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="start-heading"
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: `${spacing['5xl']} ${isMobile ? spacing.lg : spacing['2xl']} ${spacing['2xl']}`,
          textAlign: 'center',
        }}
      >
        <Badge color="brand" variant="outlined" size="md">
          Quick start
        </Badge>
        <h1
          id="start-heading"
          style={{
            fontFamily: fontFamilies.display,
            fontSize: isMobile ? '44px' : typography.display.xl.fontSize,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            fontWeight: fontWeights.bold,
            color: colors.text.highEmphasis.onLight,
            margin: `${spacing.md} 0 ${spacing.lg} 0`,
          }}
        >
          Get started in two minutes.
        </h1>
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.xl.fontSize,
            lineHeight: 1.5,
            color: colors.text.lowEmphasis.onLight,
            maxWidth: '640px',
            margin: '0 auto',
          }}
        >
          Install the package, wrap your app, and import your first component.
          No build configuration. No peer-dependency puzzles.
        </p>
      </section>

      {/* Steps */}
      <section
        aria-label="Installation steps"
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: `0 ${isMobile ? spacing.lg : spacing['2xl']} ${spacing['5xl']}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xl'] }}>
          {STEPS.map((step) => (
            <StepCard key={step.index} step={step} isMobile={isMobile} />
          ))}
        </div>
      </section>

      {/* Resources */}
      <section
        aria-label="Resources"
        style={{
          backgroundColor: colors.surface.lightDarker,
          borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
          borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
          padding: `${spacing['5xl']} 0`,
        }}
      >
        <div
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            padding: `0 ${isMobile ? spacing.lg : spacing['2xl']}`,
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
              Next steps
            </div>
            <h2
              style={{
                fontFamily: fontFamilies.display,
                fontSize: typography.heading.h1.fontSize,
                fontWeight: fontWeights.bold,
                color: colors.text.highEmphasis.onLight,
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              Make it yours.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: spacing.md,
            }}
          >
            {[
              {
                label: 'Figma library',
                description: 'Design tokens and components in Figma with 1:1 code parity.',
                cta: 'Open in Figma',
                href: '#',
              },
              {
                label: 'Component docs',
                description: 'Interactive examples, prop tables, and accessibility notes for every component.',
                cta: 'Browse components',
                href: '/prototypes/lumen-marketing/components',
              },
              {
                label: 'Theme factory',
                description: 'Generate a custom theme from a single brand color with intelligent color recommendations.',
                cta: 'Generate a theme',
                href: '#',
              },
            ].map((r) => (
              <Link
                key={r.label}
                href={r.href}
                style={{
                  display: 'block',
                  padding: spacing.xl,
                  backgroundColor: colors.surface.light,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadiusSemantics.card,
                  textDecoration: 'none',
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
                <h3
                  style={{
                    fontFamily: fontFamilies.display,
                    fontSize: typography.heading.h5.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: colors.text.highEmphasis.onLight,
                    margin: `0 0 ${spacing.xs} 0`,
                  }}
                >
                  {r.label}
                </h3>
                <p
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.body.sm.fontSize,
                    color: colors.text.lowEmphasis.onLight,
                    margin: `0 0 ${spacing.lg} 0`,
                  }}
                >
                  {r.description}
                </p>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing['2xs'],
                    fontFamily: fontFamilies.body,
                    fontSize: typography.label.sm.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: colors.brand.default,
                  }}
                >
                  {r.cta}
                  <IconArrowRight size="xs" color={colors.brand.default} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          maxWidth: '900px',
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
            letterSpacing: '-0.02em',
            color: colors.text.highEmphasis.onLight,
            margin: `0 0 ${spacing.xl} 0`,
          }}
        >
          You&apos;re ready.
        </h2>
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/prototypes/lumen-marketing/components" style={{ textDecoration: 'none' }}>
            <Button emphasis="high" size="lg" rightIcon={<IconArrowRight size="sm" />}>
              Browse components
            </Button>
          </Link>
          <Link href="/prototypes/lumen-marketing/themes" style={{ textDecoration: 'none' }}>
            <Button emphasis="low" size="lg">
              Explore themes
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}

// ---------------------------------------------------------------------------
// Step card with copy button
// ---------------------------------------------------------------------------

function StepCard({ step, isMobile }: { step: Step; isMobile: boolean }) {
  const [copied, setCopied] = React.useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(step.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <article
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '60px 1fr',
        gap: isMobile ? spacing.md : spacing.xl,
        padding: spacing['2xl'],
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadiusSemantics.card,
      }}
    >
      {/* Step number */}
      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: borderRadius.full,
          backgroundColor: colors.brand.default,
          color: '#fff',
          fontFamily: fontFamilies.display,
          fontSize: typography.heading.h5.fontSize,
          fontWeight: fontWeights.bold,
        }}
      >
        {step.index}
      </div>

      <div>
        <h3
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h3.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            margin: `0 0 ${spacing.xs} 0`,
            letterSpacing: '-0.01em',
          }}
        >
          {step.title}
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
          {step.description}
        </p>

        {/* Code block */}
        <div
          style={{
            position: 'relative',
            backgroundColor: colors.surface.lightDarker,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadius.md,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${spacing.xs} ${spacing.md}`,
              borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
              backgroundColor: colors.surface.light,
            }}
          >
            <span
              style={{
                fontFamily: fontFamilies.mono,
                fontSize: typography.body.xs.fontSize,
                color: colors.text.lowEmphasis.onLight,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: fontWeights.medium,
              }}
            >
              {step.language ?? 'tsx'}
            </span>
            <button
              type="button"
              onClick={onCopy}
              aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing['2xs'],
                padding: `${spacing['2xs']} ${spacing.xs}`,
                backgroundColor: 'transparent',
                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                borderRadius: borderRadius.sm,
                cursor: 'pointer',
                fontFamily: fontFamilies.body,
                fontSize: typography.label.sm.fontSize,
                fontWeight: fontWeights.medium,
                color: colors.text.highEmphasis.onLight,
                transition: `all ${transitionPresets.fast}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.hover.onLight
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {copied ? (
                <>
                  <IconCheck size="xs" color={colors.brand.default} />
                  Copied
                </>
              ) : (
                <>
                  <IconCopy size="xs" />
                  Copy
                </>
              )}
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              padding: spacing.lg,
              fontFamily: fontFamilies.mono,
              fontSize: typography.body.sm.fontSize,
              lineHeight: 1.6,
              color: colors.text.highEmphasis.onLight,
              overflow: 'auto',
              whiteSpace: 'pre',
            }}
          >
            <code>{step.code}</code>
          </pre>
        </div>
      </div>
    </article>
  )
}
