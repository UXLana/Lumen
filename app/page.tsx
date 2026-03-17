'use client'

import Link from 'next/link'
import { colors, typography, spacing, borderRadius, shadows, fontFamilies, fontWeights } from '@/styles/design-tokens'

// =============================================================================
// INLINE ICONS
// =============================================================================

const IconArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconGitHub = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2C5.58 2 2 5.58 2 10c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0018 10c0-4.42-3.58-8-8-8z" fill="currentColor"/>
  </svg>
)

const IconExternal = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 3H3.5A1.5 1.5 0 002 4.5v8A1.5 1.5 0 003.5 14h8a1.5 1.5 0 001.5-1.5V10M10 2h4v4M7 9l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconComingSoon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 6v4l2.5 1.5M17 10a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// =============================================================================
// SECTION ICONS
// =============================================================================

const sectionIcons: Record<string, JSX.Element> = {
  foundations: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  components: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  prototypes: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L3 8l9 5 9-5-9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12l9 5 9-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 16l9 5 9-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  themes: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 3v18" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 3a9 9 0 010 18" fill="currentColor" fillOpacity="0.1"/>
    </svg>
  ),
  accessibility: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 8.5l5 1 5-1M12 9.5v4M9 20l3-6.5 3 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  playground: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 9l3 3-3 3M13 15h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
}

// =============================================================================
// DATA
// =============================================================================

const sections = [
  {
    key: 'foundations',
    title: 'Foundations',
    description: 'Color, typography, spacing, radius, shadows, breakpoints, and icons — the building blocks.',
    href: '/design-system/colors',
  },
  {
    key: 'components',
    title: 'Components',
    description: '25+ production-ready React components with interactive documentation and specs.',
    href: '/design-system/colors', // components section in sidebar
  },
  {
    key: 'prototypes',
    title: 'Prototypes',
    description: 'Rapid UI prototypes with ownership tracking, fidelity levels, and stakeholder feedback.',
    href: '/prototypes',
  },
  {
    key: 'themes',
    title: 'Themes',
    description: 'Multi-product theming — one token set, multiple brand expressions via CSS custom properties.',
    href: '/design-system/colors',
  },
  {
    key: 'accessibility',
    title: 'Accessibility',
    description: 'WCAG 2.2 AA, Section 508, and ADA Title II compliance built in from the start.',
    href: '/design-system/compliance',
  },
  {
    key: 'playground',
    title: 'Playground',
    description: 'Interactive sandbox for experimenting with components and tokens in real time.',
    href: '/design-system/colors', // placeholder until playground is live
  },
]

const links = [
  {
    label: 'GitHub',
    href: 'https://github.com/UXLana/mtr-design-system',
    icon: <IconGitHub />,
  },
  {
    label: 'Vercel',
    href: 'https://mtr-design-system.vercel.app',
    icon: <IconExternal />,
  },
]

// =============================================================================
// LANDING PAGE
// =============================================================================

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: colors.surface.default,
    }}>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section style={{
        background: `linear-gradient(135deg, ${colors.brand.primary} 0%, ${colors.brand.primaryLight} 100%)`,
        padding: `${spacing['6xl']} ${spacing.xl}`,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{ maxWidth: '720px', width: '100%' }}>
          <p style={{
            ...typography.label.lg,
            color: colors.text.lowEmphasis.onDark,
            marginBottom: spacing.xs,
            letterSpacing: '1.5px',
            textTransform: 'uppercase' as const,
            fontSize: '13px',
          }}>
            Prism
          </p>

          <h1 style={{
            ...typography.display.xl,
            color: colors.text.highEmphasis.onDark,
            marginBottom: spacing.lg,
          }}>
            Design System
          </h1>

          <p style={{
            ...typography.body.xl,
            color: colors.text.lowEmphasis.onDark,
            marginBottom: spacing['3xl'],
            maxWidth: '560px',
          }}>
            Prism is the shared design system for Metrc products — foundations,
            components, theming, and prototyping tools that help teams ship consistent,
            accessible interfaces across 28+ US states. Components ship accessible
            by default and are designed as a starting point: engineers own the final
            implementation and can refine, extend, and optimize through Git.
          </p>

          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' as const }}>
            <Link
              href="/design-system"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.xs,
                padding: `${spacing.sm} ${spacing.xl}`,
                background: colors.surface.default,
                color: colors.brand.primary,
                borderRadius: borderRadius.lg,
                textDecoration: 'none',
                fontWeight: fontWeights.semibold,
                fontSize: '15px',
                fontFamily: fontFamilies.body,
                boxShadow: shadows.brand,
                border: 'none',
              }}
            >
              Explore the system
              <IconArrowRight />
            </Link>

            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: 'rgba(255,255,255,0.12)',
                  color: colors.text.highEmphasis.onDark,
                  borderRadius: borderRadius.lg,
                  textDecoration: 'none',
                  fontWeight: fontWeights.medium,
                  fontSize: '15px',
                  fontFamily: fontFamilies.body,
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's Inside ───────────────────────────────────────────── */}
      <section style={{
        padding: `${spacing['5xl']} ${spacing.xl}`,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{ maxWidth: '720px', width: '100%' }}>
          <h2 style={{
            ...typography.heading.h2,
            color: colors.text.highEmphasis.onLight,
            marginBottom: spacing.xs,
          }}>
            What's inside
          </h2>
          <p style={{
            ...typography.body.lg,
            color: colors.text.lowEmphasis.onLight,
            marginBottom: spacing['2xl'],
          }}>
            Everything a product team needs to design, build, and ship — from raw tokens to interactive prototypes.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: spacing.md,
          }}>
            {sections.map((section) => (
              <Link
                key={section.key}
                href={section.href}
                style={{
                  display: 'flex',
                  gap: spacing.md,
                  padding: spacing.lg,
                  background: colors.surface.default,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadius.lg,
                  textDecoration: 'none',
                  transition: 'box-shadow 200ms ease, border-color 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = shadows.md
                  e.currentTarget.style.borderColor = colors.brand.primary
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = colors.border.lowEmphasis.onLight
                }}
              >
                <div style={{
                  flexShrink: 0,
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: borderRadius.md,
                  background: colors.brand.primaryLight,
                  color: colors.brand.primary,
                }}>
                  {sectionIcons[section.key]}
                </div>
                <div>
                  <h3 style={{
                    ...typography.label.lg,
                    color: colors.text.highEmphasis.onLight,
                    marginBottom: spacing['2xs'],
                  }}>
                    {section.title}
                  </h3>
                  <p style={{
                    ...typography.body.sm,
                    color: colors.text.lowEmphasis.onLight,
                    margin: 0,
                  }}>
                    {section.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to Use (Coming Soon) ────────────────────────────────── */}
      <section style={{
        padding: `0 ${spacing.xl} ${spacing['5xl']}`,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: '720px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
          padding: spacing.lg,
          background: colors.surface.paper,
          borderRadius: borderRadius.lg,
          border: `1px dashed ${colors.border.lowEmphasis.onLight}`,
        }}>
          <div style={{
            flexShrink: 0,
            color: colors.text.lowEmphasis.onLight,
          }}>
            <IconComingSoon />
          </div>
          <div>
            <p style={{
              ...typography.label.md,
              color: colors.text.highEmphasis.onLight,
              marginBottom: '2px',
            }}>
              How to Use
            </p>
            <p style={{
              ...typography.body.sm,
              color: colors.text.lowEmphasis.onLight,
              margin: 0,
            }}>
              Setup guides, contribution workflow, and integration docs — coming soon.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer style={{
        padding: `${spacing.xl} ${spacing.xl}`,
        display: 'flex',
        justifyContent: 'center',
        borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
      }}>
        <div style={{
          maxWidth: '720px',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap' as const,
          gap: spacing.sm,
        }}>
          <p style={{
            ...typography.body.sm,
            color: colors.text.lowEmphasis.onLight,
            margin: 0,
          }}>
            Prism Design System · v1.1.0
          </p>
          <p style={{
            ...typography.body.sm,
            color: colors.text.lowEmphasis.onLight,
            margin: 0,
          }}>
            React · TypeScript · Next.js · Figma
          </p>
        </div>
      </footer>
    </main>
  )
}
