import Link from 'next/link'
import { colors, typography } from '@/styles/design-tokens'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${colors.brand.primary} 0%, ${colors.brand.primaryLight} 100%)`,
      padding: '48px',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
      }}>
        <h1 style={{
          ...typography.display.xl,
          color: colors.text.highEmphasisOnDark,
          marginBottom: '16px',
        }}>
          MTR Design System
        </h1>
        <p style={{
          ...typography.body.lg,
          color: colors.text.mediumEmphasisOnDark,
          marginBottom: '48px',
        }}>
          Core Library — Design tokens, typography, colors, and more
        </p>
        <Link 
          href="/design-system"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '16px 32px',
            background: colors.neutral[0],
            color: colors.brand.primary,
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
            transition: 'all 200ms ease-out',
            boxShadow: '0px 4px 14px rgba(19, 53, 44, 0.25)',
          }}
        >
          View Style Guide
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </main>
  )
}
