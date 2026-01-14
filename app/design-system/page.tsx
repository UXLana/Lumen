'use client'

import React from 'react'
import Link from 'next/link'
import {
  colors,
  typography,
  borderRadius,
  shadows,
  zIndex,
  transitionPresets,
} from '@/styles/design-tokens'
import { Avatar, AvatarGroup, Button, Tab, TabBar, Banner, Badge, SegmentedControl, MarketplaceCard } from '@/components'

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  page: {
    minHeight: '100vh',
    background: colors.background.paper,
  },

  hero: {
    background: 'linear-gradient(135deg, #13352C 0%, #1A5C4A 50%, #3B9B7E 100%)',
    padding: '24px 24px',
    borderRadius: borderRadius.lg,
    margin: '0',
  },

  heroTitle: {
    ...typography.heading.h2,
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '8px',
  },

  heroSubtitle: {
    ...typography.body.md,
    color: 'rgba(255, 255, 255, 0.85)',
    maxWidth: '600px',
    margin: '0',
  },
  
  pageWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  },

  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 0',
  },

  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '24px',
    borderBottom: `1px solid ${colors.border.light}`,
    paddingBottom: '0',
  },

  tab: {
    ...typography.label.md,
    padding: '12px 16px',
    color: colors.text.mediumEmphasis,
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: transitionPresets.default,
    marginBottom: '-1px',
  },

  tabActive: {
    color: colors.text.highEmphasis,
    borderBottom: `2px solid ${colors.brand.primary}`,
  },
  
  sectionTitle: {
    ...typography.heading.h3,
    color: colors.text.highEmphasis,
    marginBottom: '24px',
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '64px',
  },
  
  card: {
    background: colors.background.default,
    borderRadius: borderRadius.lg,
    padding: '24px',
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.light}`,
    textDecoration: 'none',
    transition: transitionPresets.default,
    display: 'block',
  },
  
  cardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: borderRadius.md,
    background: colors.primary[50],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '16px',
  },
  
  cardTitle: {
    ...typography.heading.h5,
    color: colors.text.highEmphasis,
    marginBottom: '8px',
  },
  
  cardDescription: {
    ...typography.body.sm,
    color: colors.text.mediumEmphasis,
  },
  
  componentCard: {
    background: colors.background.default,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border.light}`,
    textDecoration: 'none',
    display: 'block',
    transition: transitionPresets.default,
  },
  
  componentPreview: {
    background: colors.neutral[50],
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '120px',
  },
  
  componentInfo: {
    padding: '20px',
  },
  
  componentTitle: {
    ...typography.label.lg,
    color: colors.text.highEmphasis,
    marginBottom: '4px',
  },
  
  componentDescription: {
    ...typography.body.sm,
    color: colors.text.mediumEmphasis,
  },
}

// =============================================================================
// DATA
// =============================================================================

const foundationItems = [
  {
    id: 'colors',
    title: 'Colors',
    description: 'Brand, semantic, and neutral color palettes',
    icon: '◐',
    href: '/design-system/colors',
  },
  {
    id: 'typography',
    title: 'Typography',
    description: 'Font families, sizes, and text styles',
    icon: 'Aa',
    href: '/design-system/typography',
  },
  {
    id: 'spacing',
    title: 'Spacing',
    description: '4px-based spacing scale and semantic aliases',
    icon: '⊞',
    href: '/design-system/spacing',
  },
  {
    id: 'radius',
    title: 'Border Radius',
    description: 'Corner rounding from sharp to fully rounded',
    icon: '◷',
    href: '/design-system/radius',
  },
  {
    id: 'shadows',
    title: 'Shadows',
    description: 'Elevation shadows for depth and hierarchy',
    icon: '◫',
    href: '/design-system/shadows',
  },
  {
    id: 'breakpoints',
    title: 'Breakpoints & System',
    description: 'Responsive breakpoints, z-index, and transitions',
    icon: '⊟',
    href: '/design-system/breakpoints',
  },
  {
    id: 'icons',
    title: 'Icons',
    description: 'Scalable SVG icons in Feather style',
    icon: '◎',
    href: '/design-system/icons',
  },
]

const componentItems = [
  {
    id: 'avatar',
    title: 'Avatar',
    description: 'User representation with image or initials',
    href: '/components/avatar',
    preview: (
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Avatar src="https://i.pravatar.cc/150?img=1" name="User" size="lg" />
        <Avatar name="Jane Smith" size="lg" color={3} />
        <AvatarGroup
          avatars={[
            { name: 'A' },
            { name: 'B' },
            { name: 'C' },
          ]}
          size="md"
          compact
        />
      </div>
    ),
  },
  {
    id: 'button',
    title: 'Button',
    description: 'Interactive buttons with multiple emphasis levels',
    href: '/components/button',
    preview: (
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button emphasis="high">Primary</Button>
        <Button emphasis="mid">Secondary</Button>
        <Button emphasis="low">Tertiary</Button>
      </div>
    ),
  },
  {
    id: 'tab',
    title: 'Tab',
    description: 'Navigation tabs for switching between views',
    href: '/components/tab',
    preview: (
      <TabBar
        tabs={[
          { id: '1', label: 'Overview' },
          { id: '2', label: 'Details' },
          { id: '3', label: 'Settings' },
        ]}
        activeTab="1"
        onTabChange={() => {}}
      />
    ),
  },
  {
    id: 'banner',
    title: 'Banner',
    description: 'Informational banners for alerts and notifications',
    href: '/components/banner',
    preview: (
      <div style={{ width: '100%' }}>
        <Banner
          variant="info"
          title="Information"
          size="md"
        >
          This is an informational message.
        </Banner>
      </div>
    ),
  },
  {
    id: 'badge',
    title: 'Badge',
    description: 'Status indicators with semantic colors',
    href: '/components/badge',
    preview: (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Badge color="success" variant="subtle">Installed</Badge>
        <Badge color="info" variant="subtle">Update Available</Badge>
        <Badge color="neutral" variant="outlined">Uninstalled</Badge>
        <Badge color="warning" variant="filled">Warning</Badge>
      </div>
    ),
  },
  {
    id: 'segmented-control',
    title: 'Segmented Control',
    description: 'Tab-style selection for switching views',
    href: '/components/segmented-control',
    preview: (
      <SegmentedControl
        segments={[
          { id: 'preview', label: 'Preview' },
          { id: 'code', label: 'Code' },
        ]}
        value="preview"
        onChange={() => {}}
        size="md"
      />
    ),
  },
  {
    id: 'marketplace-card',
    title: 'Marketplace Card',
    description: 'App store style cards with ratings and status',
    href: '/components/marketplace-card',
    preview: (
      <MarketplaceCard
        variant="compact"
        name="Sample App"
        description="A sample marketplace application"
        publisher="Publisher"
        category="Category"
        rating={4.5}
        status="installed"
        isVerified
      />
    ),
  },
]

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function StyleGuidePage() {
  const [activeTab, setActiveTab] = React.useState('foundations')

  const tabs = [
    { id: 'foundations', label: 'Foundations' },
    { id: 'components', label: 'Components' },
    { id: 'patterns', label: 'Patterns' },
    { id: 'resources', label: 'Resources' },
  ]

  return (
    <div style={styles.page}>
      <div style={styles.pageWrapper}>
        {/* Hero Banner */}
        <header style={styles.hero}>
          <h1 style={styles.heroTitle}>Metrc Design System</h1>
          <p style={styles.heroSubtitle}>
            A comprehensive collection of design tokens and components for building
            consistent, accessible, and beautiful user interfaces.
          </p>
        </header>

        {/* Tabs - Outside the header */}
        <nav style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main style={styles.content}>
          {/* Foundations Tab */}
          {activeTab === 'foundations' && (
            <section>
              <h2 style={styles.sectionTitle}>Foundations</h2>
              <div style={styles.grid}>
                {foundationItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    style={styles.card}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = shadows.md
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = shadows.sm
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={styles.cardIcon}>{item.icon}</div>
                    <h3 style={styles.cardTitle}>{item.title}</h3>
                    <p style={styles.cardDescription}>{item.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Components Tab */}
          {activeTab === 'components' && (
            <section>
              <h2 style={styles.sectionTitle}>Components</h2>
              <div style={{ ...styles.grid, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {componentItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    style={styles.componentCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = shadows.md
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = shadows.sm
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={styles.componentPreview}>
                      {item.preview}
                    </div>
                    <div style={styles.componentInfo}>
                      <h3 style={styles.componentTitle}>{item.title}</h3>
                      <p style={styles.componentDescription}>{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Patterns Tab */}
          {activeTab === 'patterns' && (
            <section>
              <h2 style={styles.sectionTitle}>Patterns</h2>
              <div style={{
                ...styles.card,
                textAlign: 'center' as const,
                padding: '64px 24px',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>+</div>
                <h3 style={{ ...styles.cardTitle, marginBottom: '8px' }}>Coming Soon</h3>
                <p style={styles.cardDescription}>
                  Design patterns and best practices for common UI scenarios.
                </p>
              </div>
            </section>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <section>
              <h2 style={styles.sectionTitle}>Resources</h2>
              <div style={styles.card}>
                <h3 style={{ ...styles.cardTitle, marginBottom: '16px' }}>Quick Start</h3>
                <pre style={{
                  background: colors.neutral[100],
                  padding: '20px',
                  borderRadius: borderRadius.md,
                  fontSize: '13px',
                  fontFamily: '"JetBrains Mono", monospace',
                  overflow: 'auto',
                }}>
{`// Import design tokens
import { colors, typography, spacing, borderRadius, shadows } from '@/styles/design-tokens'

// Import components
import { Avatar, AvatarGroup } from '@/components'

// Use in your components
function MyComponent() {
  return (
    <div style={{
      background: colors.background.default,
      padding: spacing[6],
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
    }}>
      <Avatar name="John Doe" size="lg" />
    </div>
  )
}`}
                </pre>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
