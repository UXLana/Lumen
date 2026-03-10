'use client'

import React from 'react'
import {
  colors,
  spacing,
  fontFamilies,
  fontWeights,
  typography,
  borderRadiusSemantics,
} from '@/styles/design-tokens'
import { Button } from '@/components'

export default function QrVerifyIndex() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing['2xl'],
        gap: spacing.xl,
        minHeight: '60vh',
        textAlign: 'center',
      }}
    >
      {/* QR icon */}
      <div
        aria-hidden="true"
        style={{
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: borderRadiusSemantics.card,
          backgroundColor: colors.surface.lightDarker,
        }}
      >
        <svg width={40} height={40} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke={colors.text.lowEmphasis.onLight} strokeWidth="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke={colors.text.lowEmphasis.onLight} strokeWidth="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke={colors.text.lowEmphasis.onLight} strokeWidth="1.5" />
          <rect x="5.5" y="5.5" width="2" height="2" rx="0.5" fill={colors.text.lowEmphasis.onLight} />
          <rect x="16.5" y="5.5" width="2" height="2" rx="0.5" fill={colors.text.lowEmphasis.onLight} />
          <rect x="5.5" y="16.5" width="2" height="2" rx="0.5" fill={colors.text.lowEmphasis.onLight} />
          <path d="M14 14h3v3h-3z" fill={colors.text.lowEmphasis.onLight} />
          <path d="M18 14h3v3M14 18h3v3M18 18h3v3" stroke={colors.text.lowEmphasis.onLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <h1
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h4.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            margin: 0,
          }}
        >
          Product Verification
        </h1>
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.md.fontSize,
            color: colors.text.lowEmphasis.onLight,
            margin: 0,
            lineHeight: '24px',
          }}
        >
          Scan a QR code on any Metrc-tracked product to verify its authenticity and view lab results.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, width: '100%' }}>
        <Button
          emphasis="high"
          size="lg"
          onClick={() => (window.location.href = '/prototypes/qr-verify/product')}
          style={{ width: '100%' }}
        >
          View Sample Product
        </Button>
        <Button
          emphasis="mid"
          size="lg"
          onClick={() => (window.location.href = '/prototypes/qr-verify/bundle')}
          style={{ width: '100%' }}
        >
          View Sample Bundle
        </Button>
      </div>

      <p
        style={{
          fontFamily: fontFamilies.body,
          fontSize: typography.body.xs.fontSize,
          color: colors.text.disabled.onLight,
          margin: 0,
        }}
      >
        In production, this page would open automatically after a QR scan.
      </p>
    </div>
  )
}
