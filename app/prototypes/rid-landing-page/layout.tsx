'use client'

import React from 'react'
import { SwitchableThemeProvider } from '@/styles/themes'
import {
  colors,
  spacing,
  fontFamilies,
  typography,
} from '@/styles/design-tokens'

function RIDShell({ children }: { children: React.ReactNode }) {
  return (
    <div
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
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <main style={{ flex: 1 }}>{children}</main>

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
            This product has been tracked through the Metrc
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
            &copy; 2026 Metrc LLC &middot; Powered by Retail ID
          </p>
        </footer>
      </div>
    </div>
  )
}

export default function RIDLandingPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SwitchableThemeProvider>
      <RIDShell>{children}</RIDShell>
    </SwitchableThemeProvider>
  )
}
