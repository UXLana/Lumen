'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  SpecTable,
  Playground,
  PillButton,
  StyledCheckbox,
  CopyableToken,
  PixelValue,
  CollapsibleSection,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import { Header, CanopyLogo } from '@/components'
import { colors, typography, spacing, borderRadius, header as headerTokens } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

const headerDocData: ComponentDocData = {
  displayName: 'Header',
  importPath: '@/components',
  importStatement: `import { Header, CanopyLogo } from '@/components'\nimport type { HeaderProps, CanopyLogoProps } from '@/components'`,
  description: 'The Header provides top-level navigation with logo, search, organization selector, and action buttons.',
  props: [
    { name: 'logo', type: 'ReactNode', description: 'Logo element displayed at the left' },
    { name: 'appName', type: 'string', description: 'App/Brand name next to logo' },
    { name: 'appDescription', type: 'string', description: 'App description/subtitle' },
    { name: 'searchPlaceholder', type: 'string', description: 'Search placeholder text' },
    { name: 'searchValue', type: 'string', description: 'Search value (controlled)' },
    { name: 'onSearchChange', type: '(value: string) => void', description: 'Search change callback' },
    { name: 'onSearchSubmit', type: '(value: string) => void', description: 'Search submit callback' },
    { name: 'showSearch', type: 'boolean', description: 'Whether to show the search bar' },
    { name: 'orgName', type: 'string', description: 'Organization name' },
    { name: 'orgLabel', type: 'string', description: 'Organization label' },
    { name: 'orgBadge', type: 'ReactNode', description: 'Organization avatar/badge' },
    { name: 'onOrgClick', type: '() => void', description: 'Org dropdown click callback' },
    { name: 'actions', type: 'ReactNode', description: 'Right side action buttons' },
    { name: 'showAppsButton', type: 'boolean', description: 'Show apps grid button' },
    { name: 'onSidebarToggle', type: '() => void', description: 'Sidebar toggle callback' },
    { name: 'onAppsClick', type: '() => void', description: 'Apps button click callback' },
    { name: 'sticky', type: 'boolean', description: 'Whether the header is sticky' },
    { name: 'style', type: 'CSSProperties', description: 'Custom styles' },
    { name: 'className', type: 'string', description: 'Custom class name' },
  ],
  subComponents: [
    {
      name: 'CanopyLogo',
      description: 'Default logo component for the Header.',
      props: [
        { name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Logo size' },
        { name: 'showText', type: 'boolean', description: 'Show text alongside the logo' },
      ],
    },
  ],
  accessibility: [
    { feature: 'Landmark', description: 'Uses <header> element as a page landmark for navigation.' },
    { feature: 'Search', description: 'Search input has role="search" with proper labeling.' },
    { feature: 'Keyboard', description: 'All interactive elements are focusable and operable via keyboard.' },
  ],
  tokens: [
    { token: 'colors.surface.dark', value: 'Dark bg', usage: 'Header background' },
    { token: 'colors.text.highEmphasis.onDark', value: 'White', usage: 'Header text color' },
    { token: 'spacing.md', value: '16px', usage: 'Internal padding' },
  ],
  relatedComponents: [
    { name: 'Left Nav', href: '/components/left-nav' },
    { name: 'Tab', href: '/components/tab' },
  ],
  notes: [
    'Use sticky prop for persistent navigation across scroll.',
    'Combine with LeftNav for a full application shell layout.',
    'The CanopyLogo component provides a consistent default logo.',
  ],
}

export default function HeaderPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive playground state
  const [demoShowSearch, setDemoShowSearch] = useState(true)
  const [demoShowApps, setDemoShowApps] = useState(true)
  const [demoSticky, setDemoSticky] = useState(false)
  const [demoShowLogo, setDemoShowLogo] = useState(true)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  // Generate code string based on current settings
  const generateCode = () => {
    const lines = ['<Header']
    if (demoShowLogo) {
      lines.push('  logo={<CanopyLogo size="md" />}')
      lines.push('  appName="Canopy"')
      lines.push('  appDescription="Compliance Platform"')
    }
    lines.push(`  showSearch={${demoShowSearch}}`)
    lines.push(`  showAppsButton={${demoShowApps}}`)
    lines.push('  orgName="Acme Corp"')
    lines.push('  orgLabel="Organization"')
    if (demoSticky) lines.push('  sticky')
    lines.push('/>')
    return lines.join('\n')
  }

  return (
    <StyleguideLayout
      title="Header"
      description="The top-level application header provides navigation, search, and organization context. Fully responsive with mobile menu support."
      activeId="header"
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
              <CodeBlock>{`import { Header, CanopyLogo } from '@/components'

<Header
  logo={<CanopyLogo size="md" />}
  appName="Canopy"
  appDescription="Compliance Platform"
  orgName="Acme Corp"
  orgLabel="Organization"
  sticky
/>`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Manipulate header properties in real-time. Resize your browser to see responsive behavior.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: spacing['4xl'] }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    previewBackground={colors.surface.lightDarker}
                    previewPadding="0"
                    previewMinHeight="auto"
                    preview={
                      <div style={{ width: '100%', position: 'relative', zIndex: 0 }}>
                        <Header
                          logo={demoShowLogo ? <CanopyLogo size="md" showText={false} /> : undefined}
                          appName={demoShowLogo ? 'Canopy' : undefined}
                          appDescription={demoShowLogo ? 'Compliance Platform' : undefined}
                          showSearch={demoShowSearch}
                          showAppsButton={demoShowApps}
                          orgName="Acme Corp"
                          orgLabel="Organization"
                          sticky={demoSticky}
                        />
                      </div>
                    }
                    code={generateCode()}
                  />
                </div>

                {/* Controls */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
                    {/* Visibility */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: spacing.xs }}>
                        Visibility
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <StyledCheckbox checked={demoShowLogo} onChange={setDemoShowLogo} label="Show logo" />
                        <StyledCheckbox checked={demoShowSearch} onChange={setDemoShowSearch} label="Show search" />
                        <StyledCheckbox checked={demoShowApps} onChange={setDemoShowApps} label="Show apps button" />
                      </div>
                    </div>

                    {/* Behavior */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: spacing.xs }}>
                        Behavior
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <StyledCheckbox checked={demoSticky} onChange={setDemoSticky} label="Sticky" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== RESPONSIVE PREVIEWS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Responsive Previews</h2>
            <p style={sharedStyles.sectionDescription}>
              The Header adapts across three breakpoints. Below are previews at each viewport size.
            </p>

            {/* Desktop Preview */}
            <div style={sharedStyles.card}>
              <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Desktop (1024px+)</h3>
              <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, marginBottom: spacing.md }}>
                Full search bar, all action icons, organization name and label visible.
              </p>
              <div style={{
                background: colors.surface.lightDarker,
                borderRadius: borderRadius.lg,
                overflow: 'hidden',
                width: '100%',
              }}>
                <Header
                  logo={<CanopyLogo size="md" showText={false} />}
                  appName="Canopy"
                  appDescription="Compliance Platform"
                  showSearch
                  showAppsButton
                  orgName="Acme Corp"
                  orgLabel="Organization"
                />
              </div>
            </div>

            {/* Tablet Preview */}
            <div style={sharedStyles.card}>
              <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Tablet (768-1023px)</h3>
              <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, marginBottom: spacing.md }}>
                Search collapses to an icon, all action buttons remain, org info stays visible.
              </p>
              <div style={{
                background: colors.surface.lightDarker,
                borderRadius: borderRadius.lg,
                overflow: 'hidden',
                maxWidth: '800px',
              }}>
                <Header
                  logo={<CanopyLogo size="md" showText={false} />}
                  appName="Canopy"
                  showSearch
                  showAppsButton
                  orgName="Acme Corp"
                  orgLabel="Organization"
                />
              </div>
            </div>

            {/* Mobile Preview */}
            <div style={sharedStyles.card}>
              <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Mobile (&lt;768px)</h3>
              <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, marginBottom: spacing.md }}>
                Hamburger menu replaces navigation. Search and actions move to a slide-out panel. Only org badge remains.
              </p>
              <div style={{
                background: colors.surface.lightDarker,
                borderRadius: borderRadius.lg,
                overflow: 'hidden',
                maxWidth: '375px',
              }}>
                <Header
                  logo={<CanopyLogo size="md" showText={false} />}
                  appName="Canopy"
                  showSearch
                  showAppsButton
                  orgName="Acme Corp"
                  orgLabel="Organization"
                />
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Dimension and spacing tokens used in the Header component. Click any token to copy it.
              </p>

              {/* Dimensions */}
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Dimensions</h3>
                <SpecTable
                  headers={['Token', 'Value', 'Usage']}
                  rows={[
                    [<CopyableToken key="h" token="header.height" />, <PixelValue key="hv" value={headerTokens.height} />, 'Header height'],
                    [<CopyableToken key="px" token="header.padding.x" />, <PixelValue key="pxv" value={headerTokens.padding.x} />, 'Horizontal padding'],
                    [<CopyableToken key="py" token="header.padding.y" />, <PixelValue key="pyv" value={headerTokens.padding.y} />, 'Vertical padding'],
                  ]}
                />
              </div>

              {/* Search Bar */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Search Bar</h3>
                <SpecTable
                  headers={['Token', 'Value', 'Usage']}
                  rows={[
                    [<CopyableToken key="sw" token="header.search.width" />, <PixelValue key="swv" value={headerTokens.search.width} />, 'Search max width'],
                    [<CopyableToken key="sh" token="header.search.height" />, <PixelValue key="shv" value={headerTokens.search.height} />, 'Search height'],
                    [<CopyableToken key="sr" token="header.search.borderRadius" />, <PixelValue key="srv" value={headerTokens.search.borderRadius} />, 'Search border radius'],
                  ]}
                />
              </div>

              {/* Icon Buttons */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Icon Buttons</h3>
                <SpecTable
                  headers={['Token', 'Value', 'Usage']}
                  rows={[
                    [<CopyableToken key="ib" token="header.iconButton.size" />, <PixelValue key="ibv" value={headerTokens.iconButton.size} />, 'Icon button base size (padded to 44px for a11y)'],
                    [<CopyableToken key="ibi" token="header.iconButton.iconSize" />, <PixelValue key="ibiv" value={headerTokens.iconButton.iconSize} />, 'Icon size inside button'],
                    [<CopyableToken key="ibr" token="header.iconButton.borderRadius" />, <PixelValue key="ibrv" value={headerTokens.iconButton.borderRadius} />, 'Button border radius'],
                  ]}
                />
              </div>

              {/* Responsive Behavior */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Responsive Behavior</h3>
                <SpecTable
                  headers={['Breakpoint', 'Search', 'Actions', 'Org Display', 'Menu']}
                  rows={[
                    ['Desktop (1024px+)', 'Full search bar', 'All icon buttons', 'Badge + name + label', 'None'],
                    ['Tablet (768-1023px)', 'Collapsed icon', 'All icon buttons', 'Badge + name + label', 'None'],
                    ['Mobile (<768px)', 'In mobile panel', 'In mobile panel', 'Badge only', 'Hamburger menu'],
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
              <CodeBlock>{`import { Header, CanopyLogo } from '@/components'
import type { HeaderProps } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>{`// Full header with all features
<Header
  logo={<CanopyLogo size="md" />}
  appName="Canopy"
  appDescription="Compliance Platform"
  orgName="Acme Corp"
  orgLabel="Organization"
  sticky
/>

// Minimal header (no search or apps button)
<Header
  logo={<CanopyLogo size="md" />}
  appName="Canopy"
  showSearch={false}
  showAppsButton={false}
  orgName="Acme Corp"
  orgLabel="Organization"
/>

// Custom actions
<Header
  logo={<CanopyLogo size="md" />}
  appName="Canopy"
  actions={
    <>
      <IconButton icon={<MyCustomIcon />} ariaLabel="Custom action" showBadge />
    </>
  }
  orgName="Acme Corp"
  orgLabel="Organization"
/>`}</CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Header Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="lo">logo</code>, <code key="lot">ReactNode</code>, '—', 'Logo element displayed at the left'],
                  [<code key="an">appName</code>, <code key="ant">string</code>, '—', 'App/Brand name displayed next to logo'],
                  [<code key="ad">appDescription</code>, <code key="adt">string</code>, '—', 'Subtitle shown below app name'],
                  [<code key="sp">searchPlaceholder</code>, <code key="spt">string</code>, <code key="spd">{'"Find or ask..."'}</code>, 'Placeholder text for search input'],
                  [<code key="sv">searchValue</code>, <code key="svt">string</code>, '—', 'Controlled search value'],
                  [<code key="osc">onSearchChange</code>, <code key="osct">{'(value: string) => void'}</code>, '—', 'Callback when search changes'],
                  [<code key="oss">onSearchSubmit</code>, <code key="osst">{'(value: string) => void'}</code>, '—', 'Callback on Enter key in search'],
                  [<code key="ss">showSearch</code>, <code key="sst">boolean</code>, <code key="ssd">true</code>, 'Whether to show the search bar'],
                  [<code key="on">orgName</code>, <code key="ont">string</code>, <code key="ond">{'"Organization Name"'}</code>, 'Organization display name'],
                  [<code key="ol">orgLabel</code>, <code key="olt">string</code>, <code key="old">{'"Organization"'}</code>, 'Organization label/type'],
                  [<code key="ob">orgBadge</code>, <code key="obt">ReactNode</code>, '—', 'Custom org badge element'],
                  [<code key="ooc">onOrgClick</code>, <code key="ooct">{'() => void'}</code>, '—', 'Callback when org is clicked'],
                  [<code key="ac">actions</code>, <code key="act">ReactNode</code>, '—', 'Custom right-side action buttons'],
                  [<code key="sa">showAppsButton</code>, <code key="sat">boolean</code>, <code key="sad">true</code>, 'Show the apps grid button'],
                  [<code key="ost">onSidebarToggle</code>, <code key="ostt">{'() => void'}</code>, '—', 'Callback for sidebar toggle'],
                  [<code key="oac">onAppsClick</code>, <code key="oact">{'() => void'}</code>, '—', 'Callback for apps button'],
                  [<code key="st">sticky</code>, <code key="stt">boolean</code>, <code key="std">false</code>, 'Pin header to top of viewport'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Sub-Components</h3>
              <SpecTable
                headers={['Component', 'Export', 'Description']}
                rows={[
                  [<code key="si">SearchInput</code>, 'Named export', 'Standalone search input with focus styles and collapse support'],
                  [<code key="ib">IconButton</code>, 'Named export', 'Icon-only button with hover, focus, and optional badge dot'],
                  [<code key="od">OrgDropdown</code>, 'Named export', 'Organization selector with badge, name, and label'],
                  [<code key="cl">CanopyLogo</code>, 'Named export', 'Canopy branding logo with optional text'],
                ]}
              />
            </div>
          </section>

          {/* ========== DESIGN GUIDANCE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use</h3>
              <SpecTable
                headers={['Scenario', 'Recommendation']}
                rows={[
                  ['Primary app navigation', 'Use as the top-level header for any application'],
                  ['Search + org switching', 'Enable showSearch and provide orgName/orgLabel'],
                  ['Responsive layouts', 'Use sticky for mobile menu support across breakpoints'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Theme Integration</h3>
              <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, marginBottom: spacing.md }}>
                The Header is fully theme-aware. All colors resolve from <code style={{ fontFamily: 'monospace' }}>useColors()</code> and adapt when the active theme changes.
              </p>
              <SpecTable
                headers={['Element', 'Token']}
                rows={[
                  ['Background', <code key="bg">colors.surface.light</code>],
                  ['Border', <code key="br">colors.border.lowEmphasis.onLight</code>],
                  ['Icons', <code key="ic">colors.icon.enabled.onLight</code>],
                  ['Text', <code key="tx">colors.text.highEmphasis.onLight</code>],
                  ['Brand badge', <code key="bd">colors.brand.default</code>],
                  ['Focus ring', <code key="fc">colors.focusBorder.onLight</code>],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Anatomy</h3>
              <SpecTable
                headers={['Section', 'Contents']}
                rows={[
                  ['Left', 'Sidebar toggle (desktop), Apps grid button, Logo + brand name'],
                  ['Center', 'Search bar (full on desktop, icon on tablet, mobile panel)'],
                  ['Right', 'Action icons (notifications, help, settings), Organization dropdown'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use sticky for long-scrolling pages', 'Stack multiple headers'],
                  ['Provide orgName and orgLabel for context', 'Leave organization info empty'],
                  ['Use custom actions for app-specific needs', 'Overload the header with too many actions'],
                  ['Test responsive behavior at all breakpoints', 'Assume desktop-only layout'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <SpecTable
                headers={['Feature', 'Implementation']}
                rows={[
                  ['Landmark', <span key="l">Uses <code>&lt;header role=&quot;banner&quot;&gt;</code> for the root element</span>],
                  ['Search landmark', <span key="s">Search bar wrapped in <code>role=&quot;search&quot;</code></span>],
                  ['Focus management', 'Mobile menu traps focus and returns it to hamburger on close'],
                  ['Focus visible', 'All interactive elements show visible focus outlines'],
                  ['Keyboard navigation', 'Full Tab/Shift+Tab navigation, Escape closes mobile menu'],
                  ['Touch targets', 'All buttons meet the 44x44px minimum (WCAG 2.5.8)'],
                  ['Reduced motion', <span key="rm">Respects <code>prefers-reduced-motion</code> media query</span>],
                  ['ARIA attributes', <span key="a"><code>aria-expanded</code>, <code>aria-controls</code>, <code>aria-modal</code>, <code>aria-haspopup</code> on appropriate elements</span>],
                  ['Notification badge', <span key="n">Badge appends <code>&quot;(new)&quot;</code> to aria-label when active</span>],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={headerDocData} />
      )}
    </StyleguideLayout>
  )
}
