'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  SpecTable,
  Playground,
  StyledCheckbox,
  CopyableToken,
  PixelValue,
  CollapsibleSection,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import { Header, CanopyLogo, Avatar } from '@/components'
import { colors, typography, spacing, header as headerTokens } from '@/styles/design-tokens'

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
  importStatement: `import { Header, CanopyLogo, Avatar } from '@/components'\nimport type { HeaderProps } from '@/components'`,
  description: 'Top-level application header matching the Canopy ecosystem pattern. Features user avatar, AppSwitcher, search trigger, theme toggle, and brand logo.',
  props: [
    { name: 'onMenuToggle', type: '() => void', description: 'Callback when menu/hamburger button is clicked' },
    { name: 'onAppSwitcherClick', type: '() => void', description: 'Callback when AppSwitcher grip icon is clicked' },
    { name: 'appSwitcher', type: 'ReactNode', description: 'Custom AppSwitcher dropdown overlay' },
    { name: 'userAvatar', type: 'ReactNode', description: 'User avatar element (e.g. <Avatar name="Jane" size="xs" />)' },
    { name: 'userName', type: 'string', description: 'User name displayed next to avatar (hidden on mobile)' },
    { name: 'onUserClick', type: '() => void', description: 'Callback when user avatar/name area is clicked' },
    { name: 'searchPlaceholder', type: 'string', description: 'Search button placeholder text' },
    { name: 'onSearchClick', type: '() => void', description: 'Callback when search button is clicked (opens panel)' },
    { name: 'showSearch', type: 'boolean', description: 'Whether to show the search button' },
    { name: 'onNotificationsClick', type: '() => void', description: 'Callback when bell icon is clicked' },
    { name: 'showNotificationBadge', type: 'boolean', description: 'Whether to show notification badge dot' },
    { name: 'onThemeToggle', type: '() => void', description: 'Callback when theme toggle is clicked' },
    { name: 'isDarkMode', type: 'boolean', description: 'Controls sun/moon icon state' },
    { name: 'brandLogo', type: 'ReactNode', description: 'Brand logo on the right side' },
    { name: 'brandName', type: 'string', description: 'Brand name text (hidden on mobile)' },
    { name: 'actions', type: 'ReactNode', description: 'Additional right-side content slot' },
    { name: 'sticky', type: 'boolean', description: 'Whether the header is sticky' },
  ],
  subComponents: [
    {
      name: 'CanopyLogo',
      description: 'Canopy branding logo with optional text.',
      props: [
        { name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Logo size' },
        { name: 'showText', type: 'boolean', description: 'Show text alongside the logo' },
      ],
    },
  ],
  accessibility: [
    { feature: 'Landmark', description: 'Uses <header role="banner"> for the root element.' },
    { feature: 'Search', description: 'Search button has a descriptive aria-label.' },
    { feature: 'Keyboard', description: 'All interactive elements are focusable and operable via keyboard.' },
    { feature: 'Touch targets', description: 'All buttons meet the 44x44px minimum (WCAG 2.5.8).' },
    { feature: 'Mobile menu', description: 'Focus trap, Escape to close, focus return to hamburger.' },
    { feature: 'Reduced motion', description: 'Respects prefers-reduced-motion media query.' },
  ],
  tokens: [
    { token: 'colors.surface.light', value: 'Light bg', usage: 'Header background' },
    { token: 'colors.border.lowEmphasis.onLight', value: 'Border', usage: 'Bottom border' },
    { token: 'header.height', value: '64px', usage: 'Header height' },
  ],
  relatedComponents: [
    { name: 'Left Nav', href: '/components/left-nav' },
    { name: 'Avatar', href: '/components/avatar' },
  ],
  notes: [
    'Use sticky prop for persistent navigation across scroll.',
    'Search is a button trigger — connect onSearchClick to open your chat/search panel.',
    'Combine with LeftNav for a full application shell layout.',
    'Pass onThemeToggle to enable the dark/light mode toggle.',
  ],
}

export default function HeaderPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive playground state
  const [demoShowSearch, setDemoShowSearch] = useState(true)
  const [demoSticky, setDemoSticky] = useState(false)
  const [demoShowAvatar, setDemoShowAvatar] = useState(true)
  const [demoShowThemeToggle, setDemoShowThemeToggle] = useState(true)
  const [demoDarkMode, setDemoDarkMode] = useState(false)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const generateCode = () => {
    const lines = ['<Header']
    if (demoShowAvatar) {
      lines.push('  userAvatar={<Avatar name="Jane Doe" size="xs" />}')
      lines.push('  userName="Jane Doe"')
    }
    lines.push(`  showSearch={${demoShowSearch}}`)
    if (demoShowThemeToggle) {
      lines.push('  onThemeToggle={() => toggleDarkMode()}')
      lines.push(`  isDarkMode={${demoDarkMode}}`)
    }
    lines.push('  brandLogo={<CanopyLogo size="sm" showText={false} />}')
    lines.push('  brandName="Canopy"')
    if (demoSticky) lines.push('  sticky')
    lines.push('/>')
    return lines.join('\n')
  }

  return (
    <StyleguideLayout
      title="Header"
      description="Top-level application header with user avatar, AppSwitcher, search trigger, theme toggle, and brand logo. Matches the Canopy ecosystem pattern."
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
              <CodeBlock>{`import { Header, CanopyLogo, Avatar } from '@/components'

<Header
  userAvatar={<Avatar name="Jane Doe" size="xs" />}
  userName="Jane Doe"
  onSearchClick={() => setChatOpen(true)}
  onThemeToggle={() => toggleDarkMode()}
  isDarkMode={isDarkMode}
  brandLogo={<CanopyLogo size="sm" showText={false} />}
  brandName="Canopy"
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
                          userAvatar={demoShowAvatar ? <Avatar name="Jane Doe" size="xs" /> : undefined}
                          userName={demoShowAvatar ? 'Jane Doe' : undefined}
                          showSearch={demoShowSearch}
                          onThemeToggle={demoShowThemeToggle ? () => setDemoDarkMode(!demoDarkMode) : undefined}
                          isDarkMode={demoDarkMode}
                          brandLogo={<CanopyLogo size="sm" showText={false} />}
                          brandName="Canopy"
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
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: spacing.xs }}>
                        Visibility
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <StyledCheckbox checked={demoShowAvatar} onChange={setDemoShowAvatar} label="Show user avatar" />
                        <StyledCheckbox checked={demoShowSearch} onChange={setDemoShowSearch} label="Show search" />
                        <StyledCheckbox checked={demoShowThemeToggle} onChange={setDemoShowThemeToggle} label="Show theme toggle" />
                      </div>
                    </div>

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

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Dimension and spacing tokens used in the Header component.
              </p>

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

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Search Button</h3>
                <SpecTable
                  headers={['Token', 'Value', 'Usage']}
                  rows={[
                    [<CopyableToken key="sw" token="header.search.width" />, <PixelValue key="swv" value={headerTokens.search.width} />, 'Search max width'],
                    [<CopyableToken key="sh" token="header.search.height" />, <PixelValue key="shv" value={headerTokens.search.height} />, 'Search height'],
                    [<CopyableToken key="sr" token="header.search.borderRadius" />, <PixelValue key="srv" value={headerTokens.search.borderRadius} />, 'Search border radius (overridden to pill)'],
                  ]}
                />
              </div>

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

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Responsive Behavior</h3>
                <SpecTable
                  headers={['Breakpoint', 'Search', 'Actions', 'User Display', 'Menu']}
                  rows={[
                    ['Desktop (768px+)', 'Full search button', 'All icons visible', 'Avatar + name + chevron', 'Menu toggle'],
                    ['Mobile (<768px)', 'In mobile panel', 'In mobile panel', 'Avatar only', 'Hamburger menu'],
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
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>{`import { Header, CanopyLogo, Avatar } from '@/components'
import type { HeaderProps } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>{`// Full Canopy-style header
<Header
  userAvatar={<Avatar name="Jane Doe" size="xs" />}
  userName="Jane Doe"
  onSearchClick={() => setChatOpen(true)}
  onThemeToggle={() => toggleDarkMode()}
  isDarkMode={isDarkMode}
  brandLogo={<CanopyLogo size="sm" showText={false} />}
  brandName="Canopy"
  sticky
/>

// Minimal header (no search, no theme toggle)
<Header
  userAvatar={<Avatar name="Jane Doe" size="xs" />}
  userName="Jane Doe"
  showSearch={false}
  brandLogo={<CanopyLogo size="sm" showText={false} />}
  brandName="Canopy"
/>

// With AppSwitcher
<Header
  userAvatar={<Avatar name="Jane Doe" size="xs" />}
  userName="Jane Doe"
  onAppSwitcherClick={() => setAppSwitcherOpen(true)}
  appSwitcher={<AppSwitcher isOpen={appSwitcherOpen} onClose={() => setAppSwitcherOpen(false)} />}
  brandLogo={<CanopyLogo size="sm" showText={false} />}
  brandName="Canopy"
/>`}</CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Header Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="mt">onMenuToggle</code>, <code key="mtt">{'() => void'}</code>, '—', 'Menu/hamburger click callback'],
                  [<code key="asc">onAppSwitcherClick</code>, <code key="asct">{'() => void'}</code>, '—', 'AppSwitcher grip icon click callback'],
                  [<code key="as">appSwitcher</code>, <code key="ast">ReactNode</code>, '—', 'Custom AppSwitcher dropdown overlay'],
                  [<code key="ua">userAvatar</code>, <code key="uat">ReactNode</code>, '—', 'User avatar element'],
                  [<code key="un">userName</code>, <code key="unt">string</code>, '—', 'User name (hidden on mobile)'],
                  [<code key="uc">onUserClick</code>, <code key="uct">{'() => void'}</code>, '—', 'User area click callback'],
                  [<code key="sp">searchPlaceholder</code>, <code key="spt">string</code>, <code key="spd">{'"Find or ask..."'}</code>, 'Search button placeholder'],
                  [<code key="sc">onSearchClick</code>, <code key="sct">{'() => void'}</code>, '—', 'Search button click callback'],
                  [<code key="ss">showSearch</code>, <code key="sst">boolean</code>, <code key="ssd">true</code>, 'Show the search button'],
                  [<code key="nc">onNotificationsClick</code>, <code key="nct">{'() => void'}</code>, '—', 'Bell icon click callback'],
                  [<code key="nb">showNotificationBadge</code>, <code key="nbt">boolean</code>, '—', 'Show notification badge dot'],
                  [<code key="tt">onThemeToggle</code>, <code key="ttt">{'() => void'}</code>, '—', 'Theme toggle click callback'],
                  [<code key="dm">isDarkMode</code>, <code key="dmt">boolean</code>, <code key="dmd">false</code>, 'Controls sun/moon icon'],
                  [<code key="bl">brandLogo</code>, <code key="blt">ReactNode</code>, '—', 'Brand logo (right side)'],
                  [<code key="bn">brandName</code>, <code key="bnt">string</code>, '—', 'Brand name text (hidden on mobile)'],
                  [<code key="ac">actions</code>, <code key="act">ReactNode</code>, '—', 'Additional right-side content'],
                  [<code key="st">sticky</code>, <code key="stt">boolean</code>, <code key="std">false</code>, 'Pin header to top of viewport'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Sub-Components</h3>
              <SpecTable
                headers={['Component', 'Export', 'Description']}
                rows={[
                  [<code key="ib">IconButton</code>, 'Named export', 'Icon-only button with hover, focus, and optional badge dot (44px touch target)'],
                  [<code key="cl">CanopyLogo</code>, 'Named export', 'Canopy branding logo with optional text'],
                ]}
              />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Anatomy</h3>
              <SpecTable
                headers={['Section', 'Contents']}
                rows={[
                  ['Left', 'Menu toggle, AppSwitcher (grip icon), User avatar + name'],
                  ['Center', 'Search button (pill-shaped, opens external panel on click)'],
                  ['Right', 'Notifications bell, Theme toggle (sun/moon), Brand logo + name'],
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
                  ['Focus ring', <code key="fc">colors.focusBorder.onLight</code>],
                  ['Search bg', <code key="sb">colors.surface.lightDarker</code>],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <SpecTable
                headers={['Feature', 'Implementation']}
                rows={[
                  ['Landmark', <span key="l">Uses <code>&lt;header role=&quot;banner&quot;&gt;</code></span>],
                  ['Focus management', 'Mobile menu traps focus and returns it to hamburger on close'],
                  ['Focus visible', 'All interactive elements show visible focus outlines'],
                  ['Keyboard', 'Full Tab/Shift+Tab navigation, Escape closes mobile menu'],
                  ['Touch targets', 'All buttons meet 44x44px minimum (WCAG 2.5.8)'],
                  ['Reduced motion', <span key="rm">Respects <code>prefers-reduced-motion</code></span>],
                  ['Notification badge', <span key="n">Badge appends <code>&quot;(new)&quot;</code> to aria-label</span>],
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
