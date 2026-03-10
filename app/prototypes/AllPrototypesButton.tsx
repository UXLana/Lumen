'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import {
  fontFamilies,
  fontWeights,
  typography,
  spacing,
  borderRadius,
  zIndex,
  shadowSemantics,
} from '@/styles/design-tokens'

export function AllPrototypesButton() {
  const pathname = usePathname()

  // Hide on the prototypes index page
  if (pathname === '/prototypes') return null

  return (
    <a
      href="/prototypes"
      style={{
        position: 'fixed',
        bottom: spacing.xl,
        left: '72px',
        zIndex: zIndex.modal,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40px',
        gap: spacing.xs,
        padding: `0 ${spacing.md}`,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        color: '#FFFFFF',
        fontFamily: fontFamilies.body,
        fontSize: typography.body.sm.fontSize,
        fontWeight: fontWeights.semibold,
        lineHeight: '1',
        borderRadius: borderRadius.full,
        textDecoration: 'none',
        boxShadow: shadowSemantics.dropdown,
        whiteSpace: 'nowrap',
        transition: 'background-color 150ms ease-out',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 1)' }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.88)' }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      All Prototypes
    </a>
  )
}
