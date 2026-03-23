'use client'

import React, { useState, useRef, useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/styles/themes'
import { applyAllThemeVars } from '@/styles/themes/css-vars'
import { Header, CanopyLogo, Avatar } from '@/components'
import {
  colors,
  spacing,
  fontFamilies,
  fontWeights,
  typography,
  breakpoints,
  borderRadius,
  borderRadiusSemantics,
  shadowSemantics,
  transitionPresets,
  zIndex,
} from '@/styles/design-tokens'
import { brands } from './data'

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

function RegistryNav({ children }: { children: React.ReactNode }) {
  const [activeBrand, setActiveBrand] = useState(brands[0])
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const theme = useTheme()

  // Apply active theme CSS vars to the scoped container
  useLayoutEffect(() => {
    if (containerRef.current) {
      applyAllThemeVars(theme, containerRef.current)
    }
  }, [theme])

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', backgroundColor: colors.surface.lightDarker }}>
      <Header
        userAvatar={<Avatar name="Jane Doe" size="xs" />}
        userName="Jane Doe"
        userOrg={activeBrand.orgName}
        searchPlaceholder="Search products, SKUs, or brands..."
        showSearch={true}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        isDarkMode={isDarkMode}
        brandLogo={<CanopyLogo size="sm" showText={false} />}
        brandName="Canopy"
        sticky
      />

      {/* Brand switcher dropdown */}
      {brandDropdownOpen && (
        <>
          <div
            onClick={() => setBrandDropdownOpen(false)}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: zIndex.dropdown - 1,
            }}
          />
          <div
            role="menu"
            aria-label="Switch brand"
            style={{
              position: 'fixed',
              top: '64px',
              right: spacing.md,
              width: '320px',
              backgroundColor: colors.surface.light,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadiusSemantics.card,
              boxShadow: shadowSemantics.dropdown,
              zIndex: zIndex.dropdown,
              padding: spacing['2xs'],
            }}
          >
            <div
              style={{
                padding: `${spacing.xs} ${spacing.sm}`,
                fontFamily: fontFamilies.body,
                fontSize: typography.label.sm.fontSize,
                fontWeight: fontWeights.medium,
                color: colors.text.lowEmphasis.onLight,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.5px',
              }}
            >
              Switch brand
            </div>
            {brands.map((brand) => (
              <button
                key={brand.id}
                role="menuitem"
                onClick={() => {
                  setActiveBrand(brand)
                  setBrandDropdownOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  width: '100%',
                  padding: `${spacing.xs} ${spacing.sm}`,
                  backgroundColor: brand.id === activeBrand.id ? colors.selectedHighlight : 'transparent',
                  border: 'none',
                  borderRadius: borderRadius.md,
                  cursor: 'pointer',
                  fontFamily: fontFamilies.body,
                  textAlign: 'left',
                  transition: `background-color ${transitionPresets.fast}`,
                }}
                onMouseEnter={(e) => {
                  if (brand.id !== activeBrand.id) {
                    e.currentTarget.style.backgroundColor = colors.hover.onLight
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    brand.id === activeBrand.id ? colors.selectedHighlight : 'transparent'
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: borderRadius.lg,
                    backgroundColor: colors.brand.default,
                    color: colors.text.highEmphasis.onDark,
                    fontFamily: fontFamilies.body,
                    fontSize: '13px',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {brand.logoInitials}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: typography.body.sm.fontSize,
                      fontWeight: fontWeights.medium,
                      color: colors.text.highEmphasis.onLight,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {brand.name}
                  </span>
                  <span
                    style={{
                      fontSize: typography.body.xs.fontSize,
                      color: colors.text.lowEmphasis.onLight,
                    }}
                  >
                    {brand.orgName}
                  </span>
                </div>
                {brand.id === activeBrand.id && (
                  <svg
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    style={{ marginLeft: 'auto', flexShrink: 0 }}
                  >
                    <path
                      d="M13.5 4.5L6 12L2.5 8.5"
                      stroke={colors.brand.default}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Secondary nav */}
      <nav
        role="navigation"
        aria-label="Registry navigation"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing['2xs'],
          padding: `0 ${isMobile ? spacing.md : spacing.xl}`,
          backgroundColor: colors.surface.light,
          borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
          overflowX: 'auto',
        }}
      >
        {[
          { label: 'Products', href: '/prototypes/product-registry/catalog' },
          { label: 'Brand Management', href: '/prototypes/product-registry/brand-mgmt' },
        ].map((item) => {
          const isActive = pathname.includes(
            item.href.replace('/prototypes/product-registry/', '')
          )
          return (
            <a
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: `${spacing.sm} ${spacing.md}`,
                fontFamily: fontFamilies.body,
                fontSize: typography.label.md.fontSize,
                fontWeight: isActive ? fontWeights.semibold : fontWeights.medium,
                color: isActive ? colors.brand.default : colors.text.lowEmphasis.onLight,
                textDecoration: 'none',
                borderBottom: isActive ? `2px solid ${colors.brand.default}` : '2px solid transparent',
                whiteSpace: 'nowrap',
                transition: `color ${transitionPresets.fast}, border-color ${transitionPresets.fast}`,
              }}
            >
              {item.label}
            </a>
          )
        })}
      </nav>

      {/* Page content */}
      <main style={{ padding: isMobile ? spacing.md : spacing.xl }}>
        {children}
      </main>
    </div>
  )
}

export default function ProductRegistryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RegistryNav>{children}</RegistryNav>
}
