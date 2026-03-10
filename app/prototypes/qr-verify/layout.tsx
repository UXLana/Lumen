'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { traceTheme, ThemeProvider } from '@/styles/themes'
import { applyAllThemeVars } from '@/styles/themes/css-vars'
import {
  colors,
  spacing,
  fontFamilies,
  fontWeights,
  typography,
} from '@/styles/design-tokens'

function VerifyShell({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (containerRef.current) {
      applyAllThemeVars(traceTheme, containerRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        backgroundColor: colors.surface.lightDarker,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '375px',
          minHeight: '100vh',
          backgroundColor: colors.surface.light,
        }}
      >
        {/* Verification header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${spacing.sm} ${spacing.md}`,
            borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M16.667 5L7.5 14.167 3.333 10"
                stroke={colors.status.success}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontFamily: fontFamilies.display,
                fontSize: typography.label.md.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
              }}
            >
              Metrc Verified
            </span>
          </div>
          <span
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.xs.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            Powered by Metrc
          </span>
        </header>

        {/* Page content */}
        <main>{children}</main>

        {/* Footer */}
        <footer
          style={{
            padding: `${spacing.xl} ${spacing.md}`,
            textAlign: 'center',
            borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }}
        >
          <p
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.xs.fontSize,
              color: colors.text.lowEmphasis.onLight,
              margin: 0,
              lineHeight: '18px',
            }}
          >
            This product has been tracked from seed to sale through the Metrc
            cannabis regulatory platform.
          </p>
          <p
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.xs.fontSize,
              color: colors.text.disabled.onLight,
              margin: `${spacing.xs} 0 0`,
            }}
          >
            &copy; 2026 Metrc LLC. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default function QrVerifyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider theme={traceTheme}>
      <VerifyShell>{children}</VerifyShell>
    </ThemeProvider>
  )
}
