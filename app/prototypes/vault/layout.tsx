'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar } from '@/components'
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

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/prototypes/vault', icon: 'home' as const },
  { label: 'Accounts', href: '/prototypes/vault/accounts', icon: 'accounts' as const },
  { label: 'Transactions', href: '/prototypes/vault/transactions', icon: 'transactions' as const },
  { label: 'Send money', href: '/prototypes/vault/send', icon: 'send' as const },
  { label: 'Cards', href: '/prototypes/vault/cards', icon: 'cards' as const },
  { label: 'Team', href: '/prototypes/vault/team', icon: 'team' as const },
]

function NavIcon({ name }: { name: 'home' | 'accounts' | 'transactions' | 'send' | 'cards' | 'team' }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'home':
      return (
        <svg {...props} aria-hidden="true">
          <path d="M3 12l9-8 9 8v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" />
        </svg>
      )
    case 'accounts':
      return (
        <svg {...props} aria-hidden="true">
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <path d="M3 10h18M8 16h4" />
        </svg>
      )
    case 'transactions':
      return (
        <svg {...props} aria-hidden="true">
          <path d="M8 4l-4 4 4 4M4 8h12a4 4 0 0 1 4 4M16 20l4-4-4-4M20 16H8a4 4 0 0 1-4-4" />
        </svg>
      )
    case 'send':
      return (
        <svg {...props} aria-hidden="true">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      )
    case 'cards':
      return (
        <svg {...props} aria-hidden="true">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20M6 15h4" />
        </svg>
      )
    case 'team':
      return (
        <svg {...props} aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
  }
}

function VaultLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <rect x="3" y="3" width="22" height="22" rx="6" fill={colors.brand.default} />
      <path
        d="M9 11l5 8 5-8"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: colors.surface.lightDarker,
        fontFamily: fontFamilies.body,
        color: colors.text.highEmphasis.onLight,
      }}
    >
      {/* Sidebar */}
      {!isMobile && (
        <aside
          style={{
            width: '240px',
            flexShrink: 0,
            backgroundColor: colors.surface.light,
            borderRight: `1px solid ${colors.border.lowEmphasis.onLight}`,
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            height: '100vh',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: spacing.lg,
              borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
            }}
          >
            <VaultLogo />
            <div>
              <div
                style={{
                  fontFamily: fontFamilies.display,
                  fontSize: typography.heading.h6.fontSize,
                  fontWeight: fontWeights.bold,
                  color: colors.text.highEmphasis.onLight,
                  letterSpacing: '-0.01em',
                }}
              >
                Vault
              </div>
              <div
                style={{
                  fontSize: typography.body.xs.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                  marginTop: 1,
                }}
              >
                Acme Co.
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav
            aria-label="Primary navigation"
            style={{
              flex: 1,
              padding: spacing.sm,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === pathname ||
                (item.href !== '/prototypes/vault' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    borderRadius: borderRadius.md,
                    fontFamily: fontFamilies.body,
                    fontSize: typography.label.md.fontSize,
                    fontWeight: isActive ? fontWeights.semibold : fontWeights.medium,
                    color: isActive
                      ? colors.text.highEmphasis.onLight
                      : colors.text.lowEmphasis.onLight,
                    backgroundColor: isActive ? colors.selectedHighlight : 'transparent',
                    textDecoration: 'none',
                    transition: `background-color ${transitionPresets.fast}, color ${transitionPresets.fast}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.hover.onLight
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User footer */}
          <div
            style={{
              padding: spacing.md,
              borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
            }}
          >
            <Avatar initials="MC" size="sm" color="brand" />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: typography.body.sm.fontSize,
                  fontWeight: fontWeights.medium,
                  color: colors.text.highEmphasis.onLight,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Maya Chen
              </div>
              <div
                style={{
                  fontSize: typography.body.xs.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                }}
              >
                Owner
              </div>
            </div>
            <div
              aria-label="FDIC insured"
              title="FDIC insured up to $250,000"
              style={{
                fontSize: '9px',
                fontWeight: fontWeights.bold,
                padding: `3px ${spacing['2xs']}`,
                backgroundColor: colors.status.success,
                color: '#fff',
                borderRadius: borderRadius.sm,
                letterSpacing: '0.04em',
              }}
            >
              FDIC
            </div>
          </div>
        </aside>
      )}

      {/* Main content */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </main>
    </div>
  )
}
