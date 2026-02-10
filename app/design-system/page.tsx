'use client'

import React from 'react'
import Link from 'next/link'
import {
  colors,
  typography,
  borderRadius,
  shadows,
  spacing,
  fontFamilies,
  transitionPresets,
} from '@/styles/design-tokens'
import { Avatar, AvatarGroup, Button, Tab, TabBar, Banner, Badge, SegmentedControl, MarketplaceCard, ListItem, List, Stepper, ProductCard, Accordion, AccordionItem, LeftNav, IconHome, IconSettings, IconUsers } from '@/components'

// =============================================================================
// TYPES
// =============================================================================

type TabId = 'foundations' | 'components' | 'patterns' | 'resources'

type FoundationItem = {
  id: string
  title: string
  description: string
  icon: string
  href: string
}

type ComponentItem = {
  id: string
  title: string
  description: string
  href: string
  preview: React.ReactNode
}

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  page: {
    minHeight: '100vh',
    background: colors.surface.paper,
  },

  hero: {
    background: `linear-gradient(135deg, ${colors.brand.primary} 0%, ${colors.brand.primaryDark} 50%, ${'#7AC4AE'} 100%)`,
    padding: spacing[6],
    borderRadius: borderRadius.lg,
    margin: spacing[0],
  },

  heroTitle: {
    ...typography.heading.h2,
    fontWeight: 700,
    color: colors.text.highEmphasis.onDark,
    marginBottom: spacing[2],
  },

  heroSubtitle: {
    ...typography.body.md,
    color: colors.text.lowEmphasis.onDark,
    maxWidth: '600px',
    margin: spacing[0],
  },
  
  pageWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: spacing[6],
  },

  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${spacing[10]} ${spacing[0]}`,
  },

  tabsContainer: {
    display: 'flex',
    gap: spacing[2],
    marginTop: spacing[6],
    borderBottom: `1px solid ${colors.stroke.light}`,
    paddingBottom: spacing[0],
  },

  tab: {
    ...typography.label.md,
    padding: `${spacing[3]} ${spacing[4]}`,
    color: colors.text.lowEmphasis.onLight,
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: transitionPresets.default,
    marginBottom: '-1px',
  },

  tabActive: {
    color: colors.text.highEmphasis.onLight,
    borderBottom: `2px solid ${colors.brand.primary}`,
  },
  
  sectionTitle: {
    ...typography.heading.h3,
    color: colors.text.highEmphasis.onLight,
    marginBottom: spacing[6],
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: spacing[6],
    marginBottom: spacing[16],
  },
  
  gridTwoColumns: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: spacing[6],
    marginBottom: spacing[16],
  },
  
  card: {
    background: colors.surface.default,
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    boxShadow: shadows.sm,
    border: `1px solid ${colors.stroke.light}`,
    textDecoration: 'none',
    transition: transitionPresets.default,
    display: 'block',
  },
  
  cardHover: {
    boxShadow: shadows.md,
    transform: 'translateY(-2px)',
  },
  
  cardIcon: {
    width: spacing[12],
    height: spacing[12],
    borderRadius: borderRadius.md,
    background: colors.brand.primaryLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: spacing[6],
    marginBottom: spacing[4],
  },
  
  cardTitle: {
    ...typography.heading.h5,
    color: colors.text.highEmphasis.onLight,
    marginBottom: spacing[2],
  },
  
  cardDescription: {
    ...typography.body.sm,
    color: colors.text.lowEmphasis.onLight,
  },
  
  componentCard: {
    background: colors.surface.default,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    boxShadow: shadows.sm,
    border: `1px solid ${colors.stroke.light}`,
    textDecoration: 'none',
    display: 'block',
    transition: transitionPresets.default,
  },
  
  componentCardHover: {
    boxShadow: shadows.md,
    transform: 'translateY(-2px)',
  },
  
  componentPreview: {
    background: colors.surface.paper,
    padding: spacing[8],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '120px',
  },
  
  componentInfo: {
    padding: spacing[5],
  },
  
  componentTitle: {
    ...typography.label.lg,
    color: colors.text.highEmphasis.onLight,
    marginBottom: spacing[1],
  },
  
  componentDescription: {
    ...typography.body.sm,
    color: colors.text.lowEmphasis.onLight,
  },
}

// =============================================================================
// DATA
// =============================================================================

const foundationItems: FoundationItem[] = [
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

const componentItems: ComponentItem[] = [
  {
    id: 'accordion',
    title: 'Accordion',
    description: 'Expandable panels for organizing content',
    href: '/components/accordion',
    preview: (
      <div style={{ width: '100%', maxWidth: '280px' }}>
        <Accordion defaultExpandedIds={['1']}>
          <AccordionItem id="1" title="Section One" showMenu>
            <p style={{ margin: 0, color: colors.text.lowEmphasis.onLight }}>Content for section one</p>
          </AccordionItem>
          <AccordionItem id="2" title="Section Two" showMenu>
            <p style={{ margin: 0, color: colors.text.lowEmphasis.onLight }}>Content for section two</p>
          </AccordionItem>
        </Accordion>
      </div>
    ),
  },
  {
    id: 'avatar',
    title: 'Avatar',
    description: 'User representation with image or initials',
    href: '/components/avatar',
    preview: (
      <div style={{ display: 'flex', gap: spacing[3], alignItems: 'center' }}>
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
      <div style={{ display: 'flex', gap: spacing[3], alignItems: 'center' }}>
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
        onTabChange={() => {}} // Preview only - no action needed
      />
    ),
  },
  {
    id: 'banner',
    title: 'Banner',
    description: 'Informational banners for alerts and notifications',
    href: '/components/banner',
    preview: (
      <div style={{ width: '100%', maxWidth: '280px' }}>
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
      <div style={{ display: 'flex', gap: spacing[2], alignItems: 'center', flexWrap: 'wrap' }}>
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
        onChange={() => {}} // Preview only - no action needed
        size="md"
      />
    ),
  },
  {
    id: 'left-nav',
    title: 'Left Nav',
    description: 'Collapsible sidebar navigation with sections and popovers',
    href: '/components/left-nav',
    preview: (
      <div style={{ width: '100%', maxWidth: '200px', height: '180px', overflow: 'hidden', borderRadius: '8px', border: `1px solid ${colors.stroke.light}`, pointerEvents: 'none' }}>
        <LeftNav
          sections={[
            {
              id: 'main',
              items: [
                { id: 'home', label: 'Dashboard', href: '#', icon: <IconHome size="sm" /> },
                { id: 'users', label: 'Users', href: '#', icon: <IconUsers size="sm" />, isActive: true },
                { id: 'settings', label: 'Settings', href: '#', icon: <IconSettings size="sm" /> },
              ],
            },
          ]}
          activeItemId="users"
          showCollapseToggle={false}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    ),
  },
  {
    id: 'list-item',
    title: 'List Item',
    description: 'Versatile list items for menus and selections',
    href: '/components/list-item',
    preview: (
      <div style={{ width: '100%', maxWidth: '320px' }}>
        <List aria-label="Example list">
          <ListItem
            primary="Primary text"
            secondary="Secondary text"
            leftType="avatar"
            avatarProps={{ name: "John Doe" }}
          />
          <ListItem
            primary="With icon"
            secondary="Icon on the left"
            leftType="icon"
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}
            divider
          />
        </List>
      </div>
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
  {
    id: 'stepper',
    title: 'Stepper',
    description: 'Vertical progress indicator for multi-step processes',
    href: '/components/stepper',
    preview: (
      <div style={{ width: '100%', maxWidth: '280px' }}>
        <Stepper
          steps={[
            { id: '1', label: 'Account Setup' },
            { id: '2', label: 'Personal Info' },
            { id: '3', label: 'Review' },
          ]}
          activeStep={1}
        />
      </div>
    ),
  },
  {
    id: 'product-card',
    title: 'Product Card',
    description: 'Display product information with tags and markets',
    href: '/components/product-card',
    preview: (
      <div style={{ transform: 'scale(0.9)', transformOrigin: 'center' }}>
        <ProductCard
          brand="Brand"
          name="Product Name"
          sku="SKU-123"
          tags={[{ label: 'Tag' }]}
        />
      </div>
    ),
  },
]

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function StyleGuidePage() {
  const [activeTab, setActiveTab] = React.useState<TabId>('foundations')
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null)
  const [hoveredComponentCard, setHoveredComponentCard] = React.useState<string | null>(null)

  const tabs = [
    { id: 'foundations' as TabId, label: 'Foundations' },
    { id: 'components' as TabId, label: 'Components' },
    { id: 'patterns' as TabId, label: 'Patterns' },
    { id: 'resources' as TabId, label: 'Resources' },
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
        <nav style={styles.tabsContainer} role="tablist" aria-label="Design system sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
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
            <section
              id="foundations-panel"
              role="tabpanel"
              aria-labelledby="foundations-tab"
            >
              <h2 style={styles.sectionTitle}>Foundations</h2>
              <div style={styles.grid}>
                {foundationItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    style={{
                      ...styles.card,
                      ...(hoveredCard === item.id ? styles.cardHover : {}),
                    }}
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
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
            <section
              id="components-panel"
              role="tabpanel"
              aria-labelledby="components-tab"
            >
              <h2 style={styles.sectionTitle}>Components</h2>
              <div style={styles.gridTwoColumns}>
                {componentItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    style={{
                      ...styles.componentCard,
                      ...(hoveredComponentCard === item.id ? styles.componentCardHover : {}),
                    }}
                    onMouseEnter={() => setHoveredComponentCard(item.id)}
                    onMouseLeave={() => setHoveredComponentCard(null)}
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
            <section
              id="patterns-panel"
              role="tabpanel"
              aria-labelledby="patterns-tab"
            >
              <h2 style={styles.sectionTitle}>Patterns</h2>
              <div style={{
                ...styles.card,
                textAlign: 'center' as const,
                padding: `${spacing[16]} ${spacing[6]}`,
              }}>
                <div style={{ fontSize: spacing[12], marginBottom: spacing[4], opacity: 0.3 }}>+</div>
                <h3 style={{ ...styles.cardTitle, marginBottom: spacing[2] }}>Coming Soon</h3>
                <p style={styles.cardDescription}>
                  Design patterns and best practices for common UI scenarios.
                </p>
              </div>
            </section>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <section
              id="resources-panel"
              role="tabpanel"
              aria-labelledby="resources-tab"
            >
              <h2 style={styles.sectionTitle}>Resources</h2>
              <div style={styles.card}>
                <h3 style={{ ...styles.cardTitle, marginBottom: spacing[4] }}>Quick Start</h3>
                <pre style={{
                  background: '#F5F5F5',
                  padding: spacing[5],
                  borderRadius: borderRadius.md,
                  ...typography.code.sm,
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
      background: colors.surface.default,
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
