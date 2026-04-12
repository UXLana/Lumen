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
import { Header, SegmentedControl, Avatar, type HeaderVariant } from '@/components'
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
  importStatement: `import { Header, Avatar } from '@/components'\nimport type { HeaderProps } from '@/components'`,
  description: 'App header with LUMEN logo on the left and a right-side toolbar with theme switcher, notifications, and avatar. Supports full-width and rounded variants with mobile responsiveness.',
  props: [
    { name: 'variant', type: "'full' | 'rounded'", defaultValue: "'full'", description: 'Full-width with bottom border, or inset with border-radius and solid surface background' },
    { name: 'sticky', type: 'boolean', defaultValue: 'false', description: 'Pin header to top of viewport' },
    { name: 'userAvatar', type: 'ReactNode', description: 'Avatar element rendered in the toolbar (e.g. <Avatar name="Jane" size="sm" />)' },
    { name: 'userName', type: 'string', description: 'User name for avatar aria-label' },
    { name: 'onAvatarClick', type: '() => void', description: 'Callback when avatar area is clicked' },
    { name: 'onNotificationsClick', type: '() => void', description: 'Callback when notifications bell is clicked' },
    { name: 'notificationCount', type: 'number', defaultValue: '0', description: 'Badge count on bell icon (0 hides badge)' },
    { name: 'showNotifications', type: 'boolean', defaultValue: 'true', description: 'Whether to show the notifications bell' },
    { name: 'showThemeSwitcher', type: 'boolean', defaultValue: 'true', description: 'Whether to show the theme switcher' },
    { name: 'showNavToggle', type: 'boolean', defaultValue: 'false', description: 'Show a navigation toggle button to the left of the logo. Desktop only.' },
    { name: 'onNavToggleClick', type: '() => void', description: 'Called when the nav toggle is clicked. Consumers own sidebar state.' },
    { name: 'navToggleExpanded', type: 'boolean', defaultValue: 'true', description: 'Current expanded state of the nav. Drives the icon swap and aria-expanded.' },
    { name: 'navToggleLabel', type: 'string', description: 'Override the nav toggle\'s accessible label. Defaults to "Collapse/Expand navigation" based on state.' },
    { name: 'actions', type: 'ReactNode', description: 'Additional actions slot rendered before toolbar icons' },
    { name: 'style', type: 'React.CSSProperties', description: 'Custom styles for the root element' },
    { name: 'className', type: 'string', description: 'Custom class name' },
  ],
  accessibility: [
    { feature: 'Landmark', description: 'Uses <header role="banner"> for the root element.' },
    { feature: 'Theme switcher', description: 'Icon button has descriptive aria-label with current theme name.' },
    { feature: 'Dropdown', description: 'Uses role="listbox" with aria-selected on active option.' },
    { feature: 'Keyboard', description: 'Escape closes dropdown and returns focus to trigger.' },
    { feature: 'Notifications', description: 'Bell button includes notification count in aria-label.' },
    { feature: 'Avatar', description: 'Avatar button includes user name in aria-label.' },
    { feature: 'Focus visible', description: 'Focus ring on all toolbar buttons via :focus-visible.' },
    { feature: 'Reduced motion', description: 'Respects prefers-reduced-motion media query.' },
    { feature: 'Mobile', description: 'Hides LUMEN text, compacts toolbar buttons to 36px.' },
  ],
  tokens: [
    { token: 'colors.surface.light', value: 'Surface bg', usage: 'Rounded variant background (matches nav)' },
    { token: 'colors.border.lowEmphasis.onLight', value: 'Border', usage: 'Full variant bottom border' },
    { token: 'header.height', value: '64px', usage: 'Header height' },
    { token: 'colors.status.important', value: 'Red', usage: 'Notification badge background' },
  ],
  relatedComponents: [
    { name: 'Left Nav', href: '/components/left-nav' },
    { name: 'Avatar', href: '/components/avatar' },
  ],
  notes: [
    'The Header automatically connects to the theme system via useThemeSwitcher().',
    'Rounded variant uses solid colors.surface.light background (same as nav sidebar).',
    'Full variant uses frosted glass effect with backdrop-filter blur.',
    'Mobile breakpoint (< 768px): hides LUMEN text, compacts buttons to 36px.',
    'Notification badge auto-hides when count is 0, caps display at 99+.',
  ],
  whenToUse: [
    'Application shell — top bar with logo, toolbar, and user profile.',
    'Every full-page layout should include Header + LeftNav.',
  ],
  usageExamples: [
    {
      title: 'Default header with toolbar',
      description: 'Full-width header with theme switcher, notifications, and avatar.',
      isDefault: true,
      code: `<Header
  userAvatar={<Avatar name="Jane Doe" size="sm" />}
  userName="Jane Doe"
  onAvatarClick={() => {}}
  onNotificationsClick={() => {}}
  notificationCount={3}
/>`,
    },
    {
      title: 'Rounded variant',
      description: 'Inset header with border-radius and solid surface background.',
      code: `<Header
  variant="rounded"
  userAvatar={<Avatar name="Jane Doe" size="sm" />}
/>`,
    },
    {
      title: 'Minimal (logo + theme only)',
      description: 'Hide notifications and avatar for a minimal header.',
      code: `<Header showNotifications={false} />`,
    },
  ],
}

export default function HeaderPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')
  const [demoVariant, setDemoVariant] = useState<HeaderVariant>('full')
  const [demoSticky, setDemoSticky] = useState(false)
  const [demoShowNotifications, setDemoShowNotifications] = useState(true)
  const [demoShowTheme, setDemoShowTheme] = useState(true)
  const [demoShowAvatar, setDemoShowAvatar] = useState(true)
  const [demoShowBadge, setDemoShowBadge] = useState(true)
  const [demoShowNavToggle, setDemoShowNavToggle] = useState(false)
  const [demoNavToggleExpanded, setDemoNavToggleExpanded] = useState(true)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const generateCode = () => {
    const lines = ['<Header']
    if (demoVariant !== 'full') lines.push(`  variant="${demoVariant}"`)
    if (demoSticky) lines.push('  sticky')
    if (!demoShowTheme) lines.push('  showThemeSwitcher={false}')
    if (!demoShowNotifications) lines.push('  showNotifications={false}')
    if (demoShowNotifications) {
      lines.push('  onNotificationsClick={() => {}}')
      if (demoShowBadge) lines.push('  notificationCount={3}')
    }
    if (demoShowNavToggle) {
      lines.push('  showNavToggle')
      lines.push(`  navToggleExpanded={${demoNavToggleExpanded}}`)
      lines.push('  onNavToggleClick={() => {}}')
    }
    if (demoShowAvatar) {
      lines.push('  userAvatar={<Avatar name="Jane Doe" size="sm" />}')
      lines.push('  userName="Jane Doe"')
      lines.push('  onAvatarClick={() => {}}')
    }
    lines.push('/>')
    return lines.join('\n')
  }

  return (
    <StyleguideLayout
      title="Header"
      description="App header with LUMEN logo and right-side toolbar."
      tagline="The north star of every application."
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
              <CodeBlock>{`import { Header, Avatar } from '@/components'

<Header
  userAvatar={<Avatar name="Jane Doe" size="sm" />}
  onNotificationsClick={() => {}}
  notificationCount={3}
  sticky
/>`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Configure the header toolbar. Theme switcher, notifications bell, and avatar are all toggleable.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: spacing['4xl'] }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    previewBackground={colors.surface.lightDarker}
                    previewPadding="0"
                    previewMinHeight="380px"
                    preview={
                      <div style={{ width: '100%', position: 'relative', zIndex: 0, alignSelf: 'flex-start' }}>
                        <Header
                          variant={demoVariant}
                          sticky={demoSticky}
                          showThemeSwitcher={demoShowTheme}
                          showNotifications={demoShowNotifications}
                          notificationCount={demoShowBadge ? 3 : 0}
                          onNotificationsClick={() => {}}
                          showNavToggle={demoShowNavToggle}
                          navToggleExpanded={demoNavToggleExpanded}
                          onNavToggleClick={() => setDemoNavToggleExpanded((v) => !v)}
                          userAvatar={demoShowAvatar ? <Avatar name="Jane Doe" size="sm" color={2} /> : undefined}
                          userName={demoShowAvatar ? 'Jane Doe' : undefined}
                          onAvatarClick={demoShowAvatar ? () => {} : undefined}
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
                        Variant
                      </label>
                      <SegmentedControl
                        segments={[
                          { id: 'full', label: 'Full' },
                          { id: 'rounded', label: 'Rounded' },
                        ]}
                        value={demoVariant}
                        onChange={(id) => setDemoVariant(id as HeaderVariant)}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: spacing.xs }}>
                        Toolbar
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <StyledCheckbox checked={demoShowTheme} onChange={setDemoShowTheme} label="Theme switcher" />
                        <StyledCheckbox checked={demoShowNotifications} onChange={setDemoShowNotifications} label="Notifications" />
                        <StyledCheckbox checked={demoShowAvatar} onChange={setDemoShowAvatar} label="Avatar" />
                      </div>
                    </div>
                    {demoShowNotifications && (
                      <div>
                        <StyledCheckbox checked={demoShowBadge} onChange={setDemoShowBadge} label="Show badge" />
                      </div>
                    )}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: spacing.xs }}>
                        Navigation
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <StyledCheckbox
                          checked={demoShowNavToggle}
                          onChange={setDemoShowNavToggle}
                          label="Nav toggle (left of logo, desktop)"
                        />
                        {demoShowNavToggle && (
                          <StyledCheckbox
                            checked={demoNavToggleExpanded}
                            onChange={setDemoNavToggleExpanded}
                            label="Nav expanded (icon state)"
                          />
                        )}
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
              <CodeBlock>{`import { Header, Avatar } from '@/components'
import type { HeaderProps } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>{`// Full header with all toolbar items
<Header
  userAvatar={<Avatar name="Jane Doe" size="sm" />}
  userName="Jane Doe"
  onAvatarClick={() => openUserMenu()}
  onNotificationsClick={() => openNotifications()}
  notificationCount={3}
  sticky
/>

// Rounded variant
<Header
  variant="rounded"
  userAvatar={<Avatar name="Jane Doe" size="sm" />}
/>

// Minimal — logo + theme only
<Header showNotifications={false} />`}</CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Header Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="vr">variant</code>, <code key="vrt">{`'full' | 'rounded'`}</code>, <code key="vrd">{`'full'`}</code>, 'Layout variant'],
                  [<code key="st">sticky</code>, <code key="stt">boolean</code>, <code key="std">false</code>, 'Pin to viewport top'],
                  [<code key="ua">userAvatar</code>, <code key="uat">ReactNode</code>, '—', 'Avatar element for toolbar'],
                  [<code key="un">userName</code>, <code key="unt">string</code>, '—', 'User name for aria-label'],
                  [<code key="oa">onAvatarClick</code>, <code key="oat">() =&gt; void</code>, '—', 'Avatar click callback'],
                  [<code key="on">onNotificationsClick</code>, <code key="ont">() =&gt; void</code>, '—', 'Bell click callback'],
                  [<code key="nc">notificationCount</code>, <code key="nct">number</code>, <code key="ncd">0</code>, 'Badge count (0 = hidden)'],
                  [<code key="sn">showNotifications</code>, <code key="snt">boolean</code>, <code key="snd">true</code>, 'Show notifications bell'],
                  [<code key="stm">showThemeSwitcher</code>, <code key="stmt">boolean</code>, <code key="stmd">true</code>, 'Show theme switcher'],
                  [<code key="ac">actions</code>, <code key="act">ReactNode</code>, '—', 'Extra actions before toolbar icons'],
                  [<code key="sy">style</code>, <code key="syt">CSSProperties</code>, '—', 'Custom root styles'],
                  [<code key="cn">className</code>, <code key="cnt">string</code>, '—', 'Custom class name'],
                ]}
              />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Layout</h3>
              <CodeBlock>{`[Logo + "LUMEN"] ——— spacer ——— [actions] [theme] [bell+badge] [avatar]`}</CodeBlock>
              <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, marginTop: spacing.sm }}>
                On mobile (&lt; 768px): LUMEN text is hidden, toolbar buttons compact to 36px, gap tightens.
              </p>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Variants</h3>
              <SpecTable
                headers={['Variant', 'Background', 'Border']}
                rows={[
                  [<code key="f">full</code>, 'Frosted glass (rgba + backdrop-filter blur)', 'Bottom 1px border'],
                  [<code key="r">rounded</code>, <span key="rs"><code>colors.surface.light</code> (solid, matches nav)</span>, 'None — border-radius only'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Toolbar Buttons</h3>
              <SpecTable
                headers={['Property', 'Desktop', 'Mobile']}
                rows={[
                  ['Button size', '40 x 40px', '36 x 36px'],
                  ['Icon size', '20px (md)', '20px (md)'],
                  ['Gap between', <code key="gd">{`spacing.xs`}</code>, <code key="gm">{`spacing.2xs`}</code>],
                  ['Badge size', '16px pill', '16px pill'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <SpecTable
                headers={['Feature', 'Implementation']}
                rows={[
                  ['Landmark', <span key="l">Uses <code>&lt;header role=&quot;banner&quot;&gt;</code></span>],
                  ['Theme button', <span key="tb">aria-label with current theme, aria-expanded for dropdown</span>],
                  ['Notifications', <span key="nb">aria-label includes count when &gt; 0</span>],
                  ['Avatar', <span key="av">aria-label includes userName</span>],
                  ['Keyboard', 'Escape closes dropdown, returns focus to trigger'],
                  ['Focus visible', 'Focus ring on all toolbar buttons'],
                  ['Reduced motion', <span key="rm">Respects <code>prefers-reduced-motion</code></span>],
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
