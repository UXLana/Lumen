'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { LeftNav, LeftNavSection, LeftNavItem, LeftNavVariant, IconHome, IconProduct, IconBundle, IconIntegration, IconSettings, IconGrid, Button } from '@/components'
import type { LeftNavSelectorProps } from '@/components'
import { colors, typography, sidebar as sidebarTokens, borderRadius, breakpoints } from '@/styles/design-tokens'
import { IconMenu } from '@/components/Icons'
import { useThemeSwitcher, availableThemes } from '@/styles/themes/theme-provider'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'
type MobileBehavior = 'none' | 'drawer' | 'sheet'

// =============================================================================
// SAMPLE DATA
// =============================================================================

// Main navigation items matching Figma design
const demoSections: LeftNavSection[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'Home', href: '#', icon: <IconHome size="sm" /> },
      { id: 'products', label: 'Products', href: '#', icon: <IconProduct size="sm" /> },
      { id: 'bundles', label: 'Bundles', href: '#', icon: <IconBundle size="sm" /> },
      { id: 'integrations', label: 'Integrations', href: '#', icon: <IconIntegration size="sm" /> },
    ],
  },
]

// Sections with collapsible headers (child items don't have icons when section has header)
const demoSectionsWithHeaders: LeftNavSection[] = [
  {
    id: 'main',
    title: 'Main',
    icon: <IconGrid size="sm" />,
    items: [
      { id: 'home', label: 'Home', href: '#' },
      { id: 'products', label: 'Products', href: '#' },
    ],
  },
  {
    id: 'registry',
    title: 'Registry',
    icon: <IconBundle size="sm" />,
    items: [
      { id: 'bundles', label: 'Bundles', href: '#' },
      { id: 'integrations', label: 'Integrations', href: '#' },
    ],
  },
]

const demoFooterSections: LeftNavSection[] = [
  {
    id: 'footer',
    items: [
      { id: 'settings', label: 'Settings', href: '#', icon: <IconSettings size="sm" /> },
    ],
  },
]

// =============================================================================
// PAGE COMPONENT
// =============================================================================

const leftNavDocData: ComponentDocData = {
  displayName: 'LeftNav',
  importPath: '@/components',
  importStatement: `import { LeftNav } from '@/components'\nimport type { LeftNavProps, LeftNavSection, LeftNavItem, LeftNavVariant } from '@/components'`,
  description: 'Left navigation sidebar with collapsible sections, mobile drawer support, and multiple variants.',
  props: [
    { name: 'logo', type: 'ReactNode', description: 'Logo element displayed at the top' },
    { name: 'collapsedLogo', type: 'ReactNode', description: 'Compact logo for collapsed state' },
    { name: 'logoSelector', type: 'LeftNavSelectorProps', description: 'Dropdown selector below logo. Shows label when expanded, icon-only when collapsed.' },
    { name: 'onLogoClick', type: '() => void', description: 'Logo click handler. Makes logo a button with hover effect.' },
    { name: 'sections', type: 'LeftNavSection[]', required: true, description: 'Navigation sections' },
    { name: 'footerSections', type: 'LeftNavSection[]', description: 'Footer sections (Admin, Settings)' },
    { name: 'activeItemId', type: 'string', description: 'Currently active item ID' },
    { name: 'collapsed', type: 'boolean', description: 'Whether sidebar is collapsed' },
    { name: 'onCollapseChange', type: '(collapsed: boolean) => void', description: 'Collapse state change callback' },
    { name: 'onItemClick', type: '(item: LeftNavItem) => void', description: 'Item click callback' },
    { name: 'showCollapseToggle', type: 'boolean', description: 'Show collapse toggle button' },
    { name: 'shape', type: "'default' | 'rounded'", default: "'default'", description: 'Default: rectangular with right border. Rounded: rounded corners, no border.' },
    { name: 'variant', type: "'default' | 'flat' | 'grouped'", default: "'default'", description: 'Section header behavior variant' },
    { name: 'mobileBehavior', type: "'drawer' | 'sheet' | 'none'", default: "'drawer'", description: 'Mobile behavior mode' },
    { name: 'mobileOpen', type: 'boolean', description: 'Whether mobile drawer is open' },
    { name: 'onMobileClose', type: '() => void', description: 'Mobile close callback' },
    { name: 'style', type: 'CSSProperties', description: 'Additional styles' },
    { name: 'className', type: 'string', description: 'Additional class name' },
  ],
  typeDefinitions: [
    { name: 'LeftNavVariant', definition: "type LeftNavVariant = 'default' | 'flat' | 'grouped'" },
    { name: 'LeftNavSection', definition: "interface LeftNavSection {\n  id: string\n  title?: string\n  icon?: ReactNode\n  items: LeftNavItem[]\n  defaultExpanded?: boolean\n}" },
    { name: 'LeftNavItem', definition: "interface LeftNavItem {\n  id: string\n  label: string\n  href: string\n  icon?: ReactNode\n  isActive?: boolean\n  disabled?: boolean\n}" },
  ],
  accessibility: [
    { feature: 'Landmark', description: 'Uses <nav> element with aria-label for identification.' },
    { feature: 'Keyboard', description: 'Tab navigates items, Enter activates links, Arrow keys in collapsed tooltips.' },
    { feature: 'Collapse State', description: 'aria-expanded on section headers communicates expand/collapse.' },
    { feature: 'Mobile', description: 'Drawer uses focus trap and Escape to close.' },
  ],
  tokens: [
    { token: 'colors.surface.light', value: 'White', usage: 'Nav background' },
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Active item indicator' },
    { token: 'borderRadius.md', value: '8px', usage: 'Nav item corners' },
    { token: 'shadows.lg', value: 'Box shadow', usage: 'Collapsed popover shadow' },
  ],
  relatedComponents: [
    { name: 'Header', href: '/components/header' },
    { name: 'Accordion', href: '/components/accordion' },
  ],
  notes: [
    'Use default variant for collapsible section headers with chevron.',
    'Use flat variant when no section grouping is needed.',
    'Use grouped variant for visible but non-collapsible section headers.',
    'Collapsed state shows tooltips/popovers on hover for navigation.',
  ],
}

export default function LeftNavPage() {
  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive state for playground
  const [demoActiveItem, setDemoActiveItem] = useState('home')
  const [demoCollapsed, setDemoCollapsed] = useState(false)
  const [showSectionHeaders, setShowSectionHeaders] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  const [showCollapseToggle, setShowCollapseToggle] = useState(false)
  const [variant, setVariant] = useState<LeftNavVariant>('flat')
  const [mobileBehavior, setMobileBehavior] = useState<MobileBehavior>('none')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLogo, setShowLogo] = useState(false)
  const [showLogoSelector, setShowLogoSelector] = useState(false)
  const [shape, setShape] = useState<'default' | 'rounded'>('default')

  // Theme switcher for the logo selector demo
  const { themeName, setThemeName } = useThemeSwitcher()
  const themeOptions = availableThemes.map((t) => ({
    value: t.name,
    label: t.name.charAt(0).toUpperCase() + t.name.slice(1).replace(/-/g, ' '),
  }))

  // Logo elements — horizontal logo expanded, icon mark collapsed
  // Using <img> for SVGs to avoid Next.js Image distortion (SVGs don't need optimization)
  const expandedLogo = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/assets/Prism-logo-h.svg" alt="Prism Design System" style={{ height: '24px', width: 'auto' }} />
  )
  const collapsedLogoEl = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/assets/Prism-logo.svg" alt="Prism" style={{ height: '24px', width: '24px' }} />
  )

  // Theme selector config
  const themeSelector: LeftNavSelectorProps = {
    options: themeOptions,
    value: themeName,
    onChange: setThemeName,
    'aria-label': 'Select theme',
  }

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const handleItemClick = (item: LeftNavItem) => {
    setDemoActiveItem(item.id)
    // Close mobile nav when item is clicked
    if (mobileBehavior !== 'none') {
      setMobileOpen(false)
    }
  }

  const currentSections = showSectionHeaders ? demoSectionsWithHeaders : demoSections

  return (
    <StyleguideLayout
      title="Left Nav"
      description="A collapsible sidebar navigation component with support for sections, icons, tooltips, and responsive behavior."
      activeId="left-nav"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
    >
      {/* ========== OVERVIEW TAB ========== */}
      {activePageTab === 'overview' && (
        <>
          {/* ========== QUICK START ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`import { LeftNav } from '@/components'
import type { LeftNavSection, LeftNavItem, LeftNavVariant } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Explore all LeftNav configurations including collapsed state, variants, section headers, and responsive behaviors.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <div style={{ position: 'relative' }}>
                        {/* Mobile trigger button - only show when mobile behavior is active */}
                        {mobileBehavior !== 'none' && (
                          <div style={{ marginBottom: '16px' }}>
                            <Button
                              emphasis="high"
                              size="md"
                              leftIcon={<IconMenu size="sm" />}
                              onClick={() => setMobileOpen(true)}
                            >
                              Open {mobileBehavior === 'drawer' ? 'Drawer' : 'Bottom Sheet'}
                            </Button>
                          </div>
                        )}

                        {/* Static preview - hide when drawer/sheet behavior is active */}
                        {mobileBehavior === 'none' && (
                          <div style={{
                            width: demoCollapsed ? '73px' : '278px',
                            height: '400px',
                            transition: 'width 0.3s ease',
                          }}>
                            <LeftNav
                              logo={showLogo ? expandedLogo : undefined}
                              collapsedLogo={showLogo ? collapsedLogoEl : undefined}
                              logoSelector={showLogoSelector ? themeSelector : undefined}
                              onLogoClick={showLogo ? () => setDemoActiveItem('home') : undefined}
                              sections={currentSections}
                              footerSections={showFooter ? demoFooterSections : undefined}
                              activeItemId={demoActiveItem}
                              collapsed={demoCollapsed}
                              onCollapseChange={setDemoCollapsed}
                              onItemClick={handleItemClick}
                              showCollapseToggle={showCollapseToggle}
                              shape={shape}
                              variant={variant}
                              mobileBehavior="none"
                              style={{ height: '100%' }}
                            />
                          </div>
                        )}

                        {/* Mobile nav (portal-based, renders outside the preview box) */}
                        {mobileBehavior !== 'none' && (
                          <LeftNav
                            sections={currentSections}
                            footerSections={showFooter ? demoFooterSections : undefined}
                            activeItemId={demoActiveItem}
                            onItemClick={handleItemClick}
                            variant={variant}
                            mobileBehavior={mobileBehavior}
                            mobileOpen={mobileOpen}
                            onMobileClose={() => setMobileOpen(false)}
                            logo={showLogo ? expandedLogo : <span style={{ fontWeight: 600, fontSize: '18px' }}>Metrc</span>}
                            logoSelector={showLogoSelector ? themeSelector : undefined}
                            onLogoClick={showLogo ? () => setDemoActiveItem('home') : undefined}
                          />
                        )}
                      </div>
                    }
                    code={`<LeftNav${showLogo ? `
  logo={<Image src="/assets/Prism-logo-h.svg" alt="Prism" width={140} height={28} />}
  collapsedLogo={<Image src="/assets/Prism-logo.svg" alt="Prism" width={24} height={24} />}` : ''}${showLogoSelector ? `
  logoSelector={{
    options: themeOptions,
    value: themeName,
    onChange: setThemeName,
    'aria-label': 'Select theme',
  }}` : ''}
  sections={[
    {
      id: 'main',${showSectionHeaders ? `
      title: 'Main',
      icon: <IconGrid size="sm" />,` : ''}
      items: [
        { id: 'home', label: 'Home', href: '/', icon: <IconHome /> },
        { id: 'products', label: 'Products', href: '/products', icon: <IconProduct /> },
      ],
    },
  ]}${showFooter ? `
  footerSections={[
    {
      id: 'footer',
      items: [
        { id: 'settings', label: 'Settings', href: '/settings', icon: <IconSettings /> },
      ],
    },
  ]}` : ''}
  activeItemId="${demoActiveItem}"${mobileBehavior === 'none' ? `
  collapsed={${demoCollapsed}}
  onCollapseChange={setCollapsed}` : `
  mobileBehavior="${mobileBehavior}"
  mobileOpen={mobileOpen}
  onMobileClose={() => setMobileOpen(false)}`}
  onItemClick={handleItemClick}${shape === 'rounded' ? `
  shape="rounded"` : ''}
  variant="${variant}"${!showCollapseToggle && mobileBehavior === 'none' ? `
  showCollapseToggle={false}` : ''}
/>`}
                    previewPadding="24px"
                    previewMinHeight={mobileBehavior !== 'none' ? '100px' : '450px'}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Behavior */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Behavior
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <PillButton
                          onClick={() => { setMobileBehavior('none'); setMobileOpen(false) }}
                          isActive={mobileBehavior === 'none'}
                        >
                          Static
                        </PillButton>
                        <PillButton
                          onClick={() => setMobileBehavior('drawer')}
                          isActive={mobileBehavior === 'drawer'}
                        >
                          Drawer
                        </PillButton>
                        <PillButton
                          onClick={() => setMobileBehavior('sheet')}
                          isActive={mobileBehavior === 'sheet'}
                        >
                          Bottom Sheet
                        </PillButton>
                      </div>
                    </div>

                    {/* Variant - only show for desktop */}
                    {mobileBehavior === 'none' && (
                      <div>
                        <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                          Variant
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <PillButton
                            onClick={() => setVariant('flat')}
                            isActive={variant === 'flat'}
                          >
                            Flat
                          </PillButton>
                          <PillButton
                            onClick={() => setVariant('default')}
                            isActive={variant === 'default'}
                          >
                            Collapsible
                          </PillButton>
                          <PillButton
                            onClick={() => setVariant('grouped')}
                            isActive={variant === 'grouped'}
                          >
                            Grouped
                          </PillButton>
                        </div>
                        <p style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight, marginTop: '8px' }}>
                          {variant === 'flat' && 'No section headers, all items in a flat list.'}
                          {variant === 'default' && 'Sections with titles show collapsible headers.'}
                          {variant === 'grouped' && 'Section headers visible but not collapsible.'}
                        </p>
                      </div>
                    )}

                    {/* Shape - only show for desktop */}
                    {mobileBehavior === 'none' && (
                      <div>
                        <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                          Shape
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <PillButton
                            onClick={() => setShape('default')}
                            isActive={shape === 'default'}
                          >
                            Default
                          </PillButton>
                          <PillButton
                            onClick={() => setShape('rounded')}
                            isActive={shape === 'rounded'}
                          >
                            Rounded
                          </PillButton>
                        </div>
                        <p style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight, marginTop: '8px' }}>
                          {shape === 'default' && 'Rectangular with right border divider.'}
                          {shape === 'rounded' && 'Rounded corners, no right border.'}
                        </p>
                      </div>
                    )}

                    {/* Collapsed State - only show for desktop */}
                    {mobileBehavior === 'none' && (
                      <div>
                        <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                          State
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <PillButton
                            onClick={() => setDemoCollapsed(false)}
                            isActive={!demoCollapsed}
                          >
                            Expanded
                          </PillButton>
                          <PillButton
                            onClick={() => setDemoCollapsed(true)}
                            isActive={demoCollapsed}
                          >
                            Collapsed
                          </PillButton>
                        </div>
                      </div>
                    )}

                    {/* Active Item */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Active Item
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['home', 'products', 'bundles', 'integrations'].map((item) => (
                          <PillButton
                            key={item}
                            onClick={() => setDemoActiveItem(item)}
                            isActive={demoActiveItem === item}
                          >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Options */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Options
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <StyledCheckbox
                          checked={showLogo}
                          onChange={setShowLogo}
                          label="Show Logo"
                        />
                        <StyledCheckbox
                          checked={showLogoSelector}
                          onChange={setShowLogoSelector}
                          label="Show Logo Selector (Theme Picker)"
                        />
                        <StyledCheckbox
                          checked={showSectionHeaders}
                          onChange={setShowSectionHeaders}
                          label="Show Section Headers"
                        />
                        <StyledCheckbox
                          checked={showFooter}
                          onChange={setShowFooter}
                          label="Show Footer Section"
                        />
                        {mobileBehavior === 'none' && (
                          <StyledCheckbox
                            checked={showCollapseToggle}
                            onChange={setShowCollapseToggle}
                            label="Show Collapse Toggle"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Spacing, colors, and typography values. Click any token to copy.
              </p>

              {/* Dimensions */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Dimensions</h3>
                <SpecTable
                  headers={['Property', 'Token', 'Value']}
                  rows={[
                    ['Expanded Width', <CopyableToken key="sw" token="sidebar.width" />, <PixelValue key="swv" value={sidebarTokens.width} />],
                    ['Collapsed Width', <CopyableToken key="scw" token="sidebar.collapsedWidth" />, <PixelValue key="scwv" value={sidebarTokens.collapsedWidth} />],
                    ['Nav Item Height', <CopyableToken key="nih" token="sidebar.navItem.height" />, <PixelValue key="nihv" value={sidebarTokens.navItem.height} />],
                    ['Border Radius', <CopyableToken key="nibr" token="sidebar.navItem.borderRadius" />, <PixelValue key="nibrv" value={sidebarTokens.navItem.borderRadius} />],
                  ]}
                />
              </div>

              {/* Colors */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Colors</h3>
                <SpecTable
                  headers={['State', 'Background', 'Text']}
                  rows={[
                    ['Default', <PixelValue key="db" value={sidebarTokens.colors.item.default.background} />, <PixelValue key="dt" value={sidebarTokens.colors.item.default.text} />],
                    ['Hover', <PixelValue key="hb" value={sidebarTokens.colors.item.hover.background} />, <PixelValue key="ht" value={sidebarTokens.colors.item.hover.text} />],
                    ['Active', <PixelValue key="ab" value={sidebarTokens.colors.item.active.background} />, <PixelValue key="at" value={sidebarTokens.colors.item.active.text} />],
                  ]}
                />
              </div>
            </CollapsibleSection>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          {/* ========== USAGE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>
{`import { LeftNav } from '@/components'
import type { LeftNavSection, LeftNavItem, LeftNavVariant } from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`const sections: LeftNavSection[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'Home', href: '/', icon: <IconHome /> },
      { id: 'products', label: 'Products', href: '/products', icon: <IconProduct /> },
    ],
  },
]

<LeftNav
  sections={sections}
  activeItemId="home"
  onItemClick={(item) => navigate(item.href)}
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With Logo and Selector</h3>
              <CodeBlock>
{`import Image from 'next/image'
import { LeftNav } from '@/components'
import type { LeftNavSelectorProps } from '@/components'
import { useThemeSwitcher, availableThemes } from '@/styles/themes/theme-provider'

const { themeName, setThemeName } = useThemeSwitcher()

<LeftNav
  logo={<Image src="/assets/Prism-logo-h.svg" alt="Prism" width={140} height={28} />}
  collapsedLogo={<Image src="/assets/Prism-logo.svg" alt="Prism" width={24} height={24} />}
  logoSelector={{
    options: availableThemes.map((t) => ({ value: t.name, label: t.name })),
    value: themeName,
    onChange: setThemeName,
    'aria-label': 'Select theme',
  }}
  onLogoClick={() => router.push('/')}
  sections={sections}
  activeItemId="home"
  collapsed={collapsed}
  onCollapseChange={setCollapsed}
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With Collapsible Sections</h3>
              <CodeBlock>
{`<LeftNav
  variant="grouped"
  sections={[
    {
      id: 'main',
      title: 'Main',
      icon: <IconGrid />,
      items: [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'products', label: 'Products', href: '/products' },
      ],
    },
  ]}
  activeItemId="home"
/>`}
              </CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>LeftNavProps</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="logoSelector">logoSelector</code>, <code>ReactNode</code>, '-', 'Selector below logo (theme picker, env selector). Hidden when collapsed.'],
                  [<code key="sections">sections</code>, <code>LeftNavSection[]</code>, 'Required', 'Array of navigation sections'],
                  [<code key="footerSections">footerSections</code>, <code>LeftNavSection[]</code>, '-', 'Sections displayed at the bottom'],
                  [<code key="activeItemId">activeItemId</code>, <code>string</code>, '-', 'ID of the currently active item'],
                  [<code key="collapsed">collapsed</code>, <code>boolean</code>, <code>false</code>, 'Whether the sidebar is collapsed'],
                  [<code key="onCollapseChange">onCollapseChange</code>, <code>(collapsed: boolean) =&gt; void</code>, '-', 'Callback when collapse state changes'],
                  [<code key="onItemClick">onItemClick</code>, <code>(item: LeftNavItem) =&gt; void</code>, '-', 'Callback when an item is clicked'],
                  [<code key="variant">variant</code>, <code>&apos;flat&apos; | &apos;default&apos; | &apos;grouped&apos;</code>, <code>&apos;flat&apos;</code>, 'Section header behavior'],
                  [<code key="mobileBehavior">mobileBehavior</code>, <code>&apos;drawer&apos; | &apos;sheet&apos; | &apos;none&apos;</code>, <code>&apos;drawer&apos;</code>, 'Mobile presentation mode'],
                  [<code key="mobileOpen">mobileOpen</code>, <code>boolean</code>, <code>false</code>, 'Whether mobile nav is visible'],
                  [<code key="onMobileClose">onMobileClose</code>, <code>() =&gt; void</code>, '-', 'Callback when mobile nav closes'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>LeftNavSection</h3>
              <SpecTable
                headers={['Property', 'Type', 'Required', 'Description']}
                rows={[
                  [<code key="id">id</code>, <code>string</code>, 'Yes', 'Unique identifier'],
                  [<code key="title">title</code>, <code>string</code>, 'No', 'Section header text'],
                  [<code key="icon">icon</code>, <code>ReactNode</code>, 'No', 'Section header icon'],
                  [<code key="items">items</code>, <code>LeftNavItem[]</code>, 'Yes', 'Navigation items'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>LeftNavItem</h3>
              <SpecTable
                headers={['Property', 'Type', 'Required', 'Description']}
                rows={[
                  [<code key="id">id</code>, <code>string</code>, 'Yes', 'Unique identifier'],
                  [<code key="label">label</code>, <code>string</code>, 'Yes', 'Display label'],
                  [<code key="href">href</code>, <code>string</code>, 'Yes', 'Navigation href'],
                  [<code key="icon">icon</code>, <code>ReactNode</code>, 'No', 'Item icon'],
                  [<code key="disabled">disabled</code>, <code>boolean</code>, 'No', 'Whether disabled'],
                ]}
              />
            </div>
          </section>

          {/* ========== DESIGN GUIDANCE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use icons for top-level items', 'Mix icon and non-icon items at the same level'],
                  ['Keep labels short and descriptive', 'Use long multi-line labels'],
                  ['Limit nesting to 2 levels max', 'Create deeply nested navigation trees'],
                  ['Use grouped variant for many sections', 'Show more than 7 top-level items without grouping'],
                  ['Provide mobile drawer on small screens', 'Hide navigation entirely on mobile'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <SpecTable
                headers={['Feature', 'Implementation']}
                rows={[
                  ['Semantics', 'Uses semantic <nav> with aria-label'],
                  ['Active State', 'Active items use aria-current="page"'],
                  ['Keyboard', 'Tab, Enter/Space, Escape navigation'],
                  ['Focus', 'Focus-visible rings (keyboard only, not mouse)'],
                  ['Mobile', 'Mobile nav traps focus and prevents body scroll'],
                  ['Motion', 'Respects prefers-reduced-motion'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={leftNavDocData} />
      )}
    </StyleguideLayout>
  )
}
