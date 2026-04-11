'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { Tab, TabBar, TabItem, TabIconPosition, TabBarAlign } from '@/components'
import { colors, typography, tab, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// SAMPLE ICONS
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

function IconHome({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconSettings({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98466 18.3924 8.24634 18.3715 8.51677C18.3506 8.7872 18.3938 9.0588 18.4975 9.30938C18.6013 9.55996 18.7627 9.78258 18.9687 9.95905C19.1747 10.1355 19.4194 10.2609 19.683 10.325C21.439 10.751 21.439 13.249 19.683 13.675C19.4192 13.7389 19.1742 13.8642 18.968 14.0407C18.7618 14.2172 18.6001 14.4399 18.4962 14.6907C18.3924 14.9414 18.3491 15.2132 18.3701 15.4838C18.3911 15.7544 18.4757 16.0162 18.617 16.248C19.557 17.791 17.791 19.558 16.247 18.618C16.0153 18.4769 15.7537 18.3924 15.4832 18.3715C15.2128 18.3506 14.9412 18.3938 14.6906 18.4975C14.44 18.6013 14.2174 18.7627 14.0409 18.9687C13.8645 19.1747 13.7391 19.4194 13.675 19.683C13.249 21.439 10.751 21.439 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4962C9.05859 18.3924 8.78683 18.3491 8.51621 18.3701C8.24559 18.3911 7.98375 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0153 5.60755 15.7537 5.62848 15.4832C5.64942 15.2128 5.60624 14.9412 5.50247 14.6906C5.3987 14.44 5.23726 14.2174 5.03127 14.0409C4.82529 13.8645 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78683 5.62987 8.51621C5.60889 8.24559 5.5243 7.98375 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C8.753 5.99 10.049 5.452 10.325 4.317Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    </svg>
  )
}

function IconUser({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconChart({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 20V10M12 20V4M6 20V14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconBell({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// =============================================================================
// SAMPLE TAB DATA
// =============================================================================

const sampleTabs: TabItem[] = [
  { id: '1', label: 'Overview' },
  { id: '2', label: 'Details' },
  { id: '3', label: 'Settings' },
  { id: '4', label: 'Activity' },
  { id: '5', label: 'History' },
]

const tabsWithIcons: TabItem[] = [
  { id: '1', label: 'Home', icon: <IconHome /> },
  { id: '2', label: 'Analytics', icon: <IconChart /> },
  { id: '3', label: 'Profile', icon: <IconUser /> },
  { id: '4', label: 'Settings', icon: <IconSettings /> },
]

const tabsWithBadges: TabItem[] = [
  { id: '1', label: 'All Items' },
  { id: '2', label: 'Pending', badge: 12 },
  { id: '3', label: 'Approved' },
  { id: '4', label: 'Notifications', badge: 99 },
]

// =============================================================================
// PAGE COMPONENT
// =============================================================================

const tabDocData: ComponentDocData = {
  displayName: 'Tab',
  importPath: '@/components',
  importStatement: `import { Tab, TabBar } from '@/components'\nimport type { TabProps, TabBarProps, TabItem, TabIconPosition, TabBarAlign } from '@/components'`,
  description: 'Tabs organize content into separate views where only one view is visible at a time.',
  props: [
    { name: 'label', type: 'string', required: true, description: 'Tab label' },
    { name: 'isActive', type: 'boolean', description: 'Whether this tab is active/selected' },
    { name: 'iconPosition', type: "'none' | 'top' | 'leading' | 'only'", default: "'none'", description: 'Icon position' },
    { name: 'icon', type: 'ReactNode', description: 'Icon element' },
    { name: 'badge', type: 'number', description: 'Badge count' },
    { name: 'onDark', type: 'boolean', description: 'Dark surface styling' },
    { name: 'inverted', type: 'boolean', description: 'Inverted tab style' },
    { name: 'mobileFooter', type: 'boolean', description: 'Mobile footer variant' },
    { name: 'focused', type: 'boolean', description: 'Show focus ring (for demo)' },
  ],
  subComponents: [
    {
      name: 'TabBar',
      description: 'Container for Tab components with layout management.',
      props: [
        { name: 'tabs', type: 'TabItem[]', required: true, description: 'Array of tab items' },
        { name: 'activeTab', type: 'string', required: true, description: 'Currently active tab ID' },
        { name: 'onTabChange', type: '(tabId: string) => void', required: true, description: 'Tab change callback' },
        { name: 'iconPosition', type: 'TabIconPosition', description: 'Icon position for all tabs' },
        { name: 'align', type: "'left' | 'center' | 'right' | 'stretch'", default: "'left'", description: 'Alignment of tabs' },
        { name: 'stretched', type: 'boolean', description: 'Stretch tabs to fill width' },
        { name: 'onDark', type: 'boolean', description: 'Dark surface styling' },
        { name: 'hasDivider', type: 'boolean', description: 'Show divider line' },
        { name: 'scrollable', type: 'boolean', description: 'Enable scrollable mode' },
      ],
    },
  ],
  typeDefinitions: [
    { name: 'TabIconPosition', definition: "type TabIconPosition = 'none' | 'top' | 'leading' | 'only'" },
    { name: 'TabBarAlign', definition: "type TabBarAlign = 'left' | 'center' | 'right' | 'stretch'" },
    { name: 'TabItem', definition: "interface TabItem {\n  id: string\n  label: string\n  icon?: ReactNode\n  badge?: number\n  disabled?: boolean\n}" },
  ],
  accessibility: [
    { feature: 'ARIA Roles', description: 'TabBar uses role="tablist", individual tabs use role="tab".' },
    { feature: 'Keyboard', description: 'Arrow keys navigate tabs, Enter/Space activates, Home/End jump to first/last.' },
    { feature: 'Selection', description: 'aria-selected on active tab, aria-controls links to panel.' },
    { feature: 'Focus Management', description: 'Roving tabindex pattern - only active tab in tab order.' },
  ],
  tokens: [
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Active tab indicator' },
    { token: 'colors.text.highEmphasis', value: 'Dark', usage: 'Active tab text' },
    { token: 'colors.text.lowEmphasis', value: 'Gray', usage: 'Inactive tab text' },
    { token: 'typography.label.md', value: '14px/20px', usage: 'Tab label text' },
  ],
  relatedComponents: [
    { name: 'Segmented Control', href: '/components/segmented-control' },
    { name: 'Accordion', href: '/components/accordion' },
  ],
  notes: [
    'Use TabBar for the common pattern of tabs controlling content panels.',
    'Use scrollable mode when tab count exceeds available width.',
    'Use icon position "top" for navigation tabs, "leading" for content tabs.',
  ],
  whenToUse: [
    'Switching between distinct content panels on the same page (e.g., Overview / Details / Settings).',
    'Navigation tabs with icons and optional badge counts.',
    '5+ options that won\'t fit in a SegmentedControl.',
  ],
  whenNotToUse: [
    { scenario: '2-5 inline option toggles without content panel switching', instead: 'SegmentedControl — compact toggle, no panel swap' },
    { scenario: 'Collapsible content sections', instead: 'Accordion — expand/collapse without tab navigation' },
    { scenario: 'Sequential step progression', instead: 'Stepper — enforces step ordering with status indicators' },
  ],
  usageExamples: [
    {
      title: 'Content panel tabs',
      description: 'Standard tab bar controlling content panels. Use onTabChange (receives tab ID string).',
      isDefault: true,
      code: `<TabBar\n  tabs={[\n    { id: 'overview', label: 'Overview' },\n    { id: 'details', label: 'Details' },\n    { id: 'settings', label: 'Settings' },\n  ]}\n  activeTab={activeTab}\n  onTabChange={(id) => setActiveTab(id)}\n/>`,
    },
  ],
}

export default function TabPage() {
  const iconPositions: TabIconPosition[] = ['none', 'leading', 'top', 'only']
  const alignments: TabBarAlign[] = ['left', 'center', 'right', 'stretch']

  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // State for different tab bar demos
  const [activeBasic, setActiveBasic] = useState('1')
  const [activeIcons, setActiveIcons] = useState('1')
  const [activeBadges, setActiveBadges] = useState('1')
  const [activeAlignLeft, setActiveAlignLeft] = useState('1')
  const [activeAlignCenter, setActiveAlignCenter] = useState('1')
  const [activeAlignRight, setActiveAlignRight] = useState('1')
  const [activeStretched, setActiveStretched] = useState('1')
  const [activeDark, setActiveDark] = useState('1')
  const [activeInverted, setActiveInverted] = useState('1')
  const [activeScrollable, setActiveScrollable] = useState('1')

  // Interactive playground state
  const [demoIconPosition, setDemoIconPosition] = useState<TabIconPosition>('none')
  const [demoAlign, setDemoAlign] = useState<TabBarAlign>('left')
  const [demoStretched, setDemoStretched] = useState(false)
  const [demoOnDark, setDemoOnDark] = useState(false)
  const [demoInverted, setDemoInverted] = useState(false)
  const [demoDivider, setDemoDivider] = useState(true)
  const [demoScrollable, setDemoScrollable] = useState(false)
  const [demoActiveTab, setDemoActiveTab] = useState('1')

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Tab"
      description="Tabs organize content into separate views where only one view can be visible at a time. They enable users to switch between related content quickly without navigating to different pages."
      tagline="Different views, same destination."
      activeId="tab"
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
              <CodeBlock>{`// Package import
import { Tab, TabBar } from '@lumen/design-system'

// Or with path alias (requires tsconfig setup)
import { Tab, TabBar } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Manipulate tab properties in real-time to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <TabBar
                        tabs={demoIconPosition === 'only' || demoIconPosition === 'leading' || demoIconPosition === 'top'
                          ? tabsWithIcons
                          : sampleTabs.slice(0, 4)
                        }
                        activeTab={demoActiveTab}
                        onTabChange={setDemoActiveTab}
                        iconPosition={demoIconPosition}
                        align={demoAlign}
                        stretched={demoStretched}
                        onDark={demoOnDark}
                        inverted={demoInverted}
                        hasDivider={demoDivider}
                        scrollable={demoScrollable}
                      />
                    }
                    code={`<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  iconPosition="${demoIconPosition}"
  align="${demoAlign}"${demoStretched ? '\n  stretched' : ''}${demoOnDark ? '\n  onDark' : ''}${demoInverted ? '\n  inverted' : ''}${!demoDivider ? '\n  hasDivider={false}' : ''}${demoScrollable ? '\n  scrollable' : ''}
/>`}
                    previewBackground={demoOnDark ? colors.brand.default : colors.surface.lightDarker}
                    previewPadding="56px 24px"
                    previewMinHeight="120px"
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Icon Position */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Icon Position
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {iconPositions.map(pos => (
                          <PillButton
                            key={pos}
                            onClick={() => setDemoIconPosition(pos)}
                            isActive={demoIconPosition === pos}
                          >
                            {pos}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Alignment */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Alignment
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {alignments.map(align => (
                          <PillButton
                            key={align}
                            onClick={() => setDemoAlign(align)}
                            isActive={demoAlign === align}
                          >
                            {align}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <StyledCheckbox
                        checked={demoStretched}
                        onChange={setDemoStretched}
                        label="Stretched"
                      />
                      <StyledCheckbox
                        checked={demoOnDark}
                        onChange={setDemoOnDark}
                        label="On Dark"
                      />
                      <StyledCheckbox
                        checked={demoInverted}
                        onChange={setDemoInverted}
                        label="Inverted"
                      />
                      <StyledCheckbox
                        checked={demoDivider}
                        onChange={setDemoDivider}
                        label="Divider"
                      />
                      <StyledCheckbox
                        checked={demoScrollable}
                        onChange={setDemoScrollable}
                        label="Scrollable"
                      />
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
                Color tokens, typography scale, and spacing values used in the tab component.
              </p>

              {/* Color Tokens */}
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Color Tokens</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {/* Light Mode */}
            <div>
              <h4 style={{ ...typography.label.md, marginBottom: '12px' }}>Light Mode</h4>
              {['active', 'inactive', 'hover', 'disabled'].map((state) => {
                const stateColors = tab.colors.light[state as keyof typeof tab.colors.light]
                return (
                  <div key={state} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      background: stateColors.text,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }} />
                    <div>
                      <div style={{ ...typography.label.sm }}>{state}</div>
                      <div style={{ ...typography.code.sm, color: colors.text.lowEmphasis.onLight }}>{stateColors.text}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Dark Mode */}
            <div>
              <h4 style={{ ...typography.label.md, marginBottom: '12px' }}>Dark Mode</h4>
              {['active', 'inactive', 'hover', 'disabled'].map((state) => {
                const stateColors = tab.colors.dark[state as keyof typeof tab.colors.dark]
                return (
                  <div key={state} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      background: stateColors.text,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }} />
                    <div>
                      <div style={{ ...typography.label.sm }}>{state}</div>
                      <div style={{ ...typography.code.sm, color: colors.text.lowEmphasis.onLight }}>{stateColors.text}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Selected Indicator */}
            <div>
              <h4 style={{ ...typography.label.md, marginBottom: '12px' }}>Indicator Colors</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  width: '64px',
                  height: tab.indicator.height,
                  borderRadius: tab.indicator.borderRadius,
                  background: tab.colors.light.active.indicator,
                }} />
                <div>
                  <div style={{ ...typography.label.sm }}>Light</div>
                  <div style={{ ...typography.code.sm, color: colors.text.lowEmphasis.onLight }}>{tab.colors.light.active.indicator}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  width: '64px',
                  height: tab.indicator.height,
                  borderRadius: tab.indicator.borderRadius,
                  background: tab.colors.dark.active.indicator,
                }} />
                <div>
                  <div style={{ ...typography.label.sm }}>Dark</div>
                  <div style={{ ...typography.code.sm, color: colors.text.lowEmphasis.onLight }}>{tab.colors.dark.active.indicator}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Tokens */}
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Typography Tokens</h3>
          <SpecTable
            headers={['Property', 'Token', 'Value']}
            rows={[
              ['Font Family', <CopyableToken key="ff" token="tab.typography.fontFamily" />, <PixelValue key="ffv" value={tab.typography.fontFamily} />],
              ['Font Size', <CopyableToken key="fs" token="tab.typography.fontSize" />, <PixelValue key="fsv" value={tab.typography.fontSize} />],
              ['Font Weight', <CopyableToken key="fw" token="tab.typography.fontWeight" />, <PixelValue key="fwv" value={tab.typography.fontWeight.toString()} />],
              ['Line Height', <CopyableToken key="lh" token="tab.typography.lineHeight" />, <PixelValue key="lhv" value={tab.typography.lineHeight} />],
              ['Letter Spacing', <CopyableToken key="ls" token="tab.typography.letterSpacing" />, <PixelValue key="lsv" value={tab.typography.letterSpacing} />],
            ]}
          />
        </div>

        {/* Spacing Tokens */}
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Spacing Tokens</h3>
          <SpecTable
            headers={['Icon Position', 'Height Token', 'Height', 'Padding X', 'Padding Y', 'Gap', 'Icon Size']}
            rows={(['none', 'top', 'leading'] as const).map(pos => [
              <code key={pos}>{pos}</code>,
              <CopyableToken key={`${pos}-h`} token={`tab.sizes.${pos}.height`} />,
              <PixelValue key={`${pos}-hv`} value={tab.sizes[pos].height} />,
              <PixelValue key={`${pos}-px`} value={tab.sizes[pos].paddingX} />,
              <PixelValue key={`${pos}-py`} value={tab.sizes[pos].paddingY} />,
              <PixelValue key={`${pos}-g`} value={tab.sizes[pos].gap} />,
              <PixelValue key={`${pos}-is`} value={tab.sizes[pos].iconSize} />,
            ])}
          />
        </div>

              {/* Border & Focus Tokens */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Border & Focus Tokens</h3>
                <SpecTable
                  headers={['Property', 'Token', 'Value']}
                  rows={[
                    ['Border Radius', <CopyableToken key="br" token="tab.borderRadius" />, <PixelValue key="brv" value={tab.borderRadius} />],
                    ['Focus Color', <CopyableToken key="fc" token="tab.focus.color" />, <PixelValue key="fcv" value={tab.focus.color} />],
                    ['Focus Width', <CopyableToken key="fw" token="tab.focus.width" />, <PixelValue key="fwv" value={tab.focus.width} />],
                    ['Focus Radius', <CopyableToken key="fr" token="tab.focus.borderRadius" />, <PixelValue key="frv" value={tab.focus.borderRadius} />],
                    ['Indicator Height', <CopyableToken key="ih" token="tab.indicator.height" />, <PixelValue key="ihv" value={tab.indicator.height} />],
                    ['Indicator Radius', <CopyableToken key="ir" token="tab.indicator.borderRadius" />, <PixelValue key="irv" value={tab.indicator.borderRadius} />],
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
{`import { Tab, TabBar, TabIcon } from '@/components'
import type { TabProps, TabBarProps, TabItem, TabIconPosition, TabBarAlign } from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`const [activeTab, setActiveTab] = useState('1')

const tabs = [
  { id: '1', label: 'Overview' },
  { id: '2', label: 'Details' },
  { id: '3', label: 'Settings' },
]

<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With Icons</h3>
              <CodeBlock>
{`const tabsWithIcons = [
  { id: '1', label: 'Home', icon: <IconHome /> },
  { id: '2', label: 'Analytics', icon: <IconChart /> },
  { id: '3', label: 'Settings', icon: <IconSettings /> },
]

// Leading icons
<TabBar
  tabs={tabsWithIcons}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  iconPosition="leading"
/>

// Top icons
<TabBar
  tabs={tabsWithIcons}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  iconPosition="top"
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With Badges</h3>
              <CodeBlock>
{`const tabsWithBadges = [
  { id: '1', label: 'All' },
  { id: '2', label: 'Pending', badge: 12 },
  { id: '3', label: 'Notifications', badge: 99 },
]

<TabBar
  tabs={tabsWithBadges}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Stretched Tabs</h3>
              <CodeBlock>
{`<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  align="stretch"
  stretched
/>`}
              </CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Tab Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code>label</code>, <code>string</code>, '-', 'Tab label text (required)'],
                  [<code>isActive</code>, <code>boolean</code>, <code>false</code>, 'Whether tab is active/selected'],
                  [<code>iconPosition</code>, <code>'none' | 'top' | 'leading' | 'only'</code>, <code>'none'</code>, 'Icon position relative to text'],
                  [<code>icon</code>, <code>ReactNode</code>, '-', 'Icon element to display'],
                  [<code>badge</code>, <code>number</code>, '-', 'Badge count to display'],
                  [<code>onDark</code>, <code>boolean</code>, <code>false</code>, 'Render for dark surfaces'],
                  [<code>inverted</code>, <code>boolean</code>, <code>false</code>, 'Inverted tab style'],
                  [<code>disabled</code>, <code>boolean</code>, <code>false</code>, 'Disabled state'],
                  [<code>focused</code>, <code>boolean</code>, <code>false</code>, 'Show focus ring (demo)'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>TabBar Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code>tabs</code>, <code>TabItem[]</code>, '-', 'Array of tab items (required)'],
                  [<code>activeTab</code>, <code>string</code>, '-', 'ID of active tab (required)'],
                  [<code>onTabChange</code>, <code>(id: string) =&gt; void</code>, '-', 'Tab change callback (required)'],
                  [<code>iconPosition</code>, <code>'none' | 'top' | 'leading' | 'only'</code>, <code>'none'</code>, 'Icon position for all tabs'],
                  [<code>align</code>, <code>'left' | 'center' | 'right' | 'stretch'</code>, <code>'left'</code>, 'Tabs alignment'],
                  [<code>stretched</code>, <code>boolean</code>, <code>false</code>, 'Stretch tabs to fill width'],
                  [<code>onDark</code>, <code>boolean</code>, <code>false</code>, 'Render for dark surfaces'],
                  [<code>inverted</code>, <code>boolean</code>, <code>false</code>, 'Inverted tab style'],
                  [<code>hasDivider</code>, <code>boolean</code>, <code>true</code>, 'Show bottom divider'],
                  [<code>scrollable</code>, <code>boolean</code>, <code>false</code>, 'Enable scrollable mode'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>TabItem Interface</h3>
              <SpecTable
                headers={['Property', 'Type', 'Required', 'Description']}
                rows={[
                  [<code>id</code>, <code>string</code>, 'Yes', 'Unique identifier'],
                  [<code>label</code>, <code>string</code>, 'Yes', 'Tab label text'],
                  [<code>icon</code>, <code>ReactNode</code>, 'No', 'Icon element'],
                  [<code>badge</code>, <code>number</code>, 'No', 'Badge count'],
                  [<code>disabled</code>, <code>boolean</code>, 'No', 'Disabled state'],
                ]}
              />
            </div>
          </section>

      {/* ========== DESIGN GUIDANCE ========== */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>When to Use</h3>
          <ul style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, margin: 0, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Organize related content that doesn't need to be viewed simultaneously</li>
            <li style={{ marginBottom: '8px' }}>Allow users to quickly switch between views without page navigation</li>
            <li style={{ marginBottom: '8px' }}>Group settings, content types, or data categories</li>
            <li>Maintain context while exploring different aspects of content</li>
          </ul>
        </div>

        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
          <SpecTable
            headers={['Do', "Don't"]}
            rows={[
              ['Keep tab labels short and descriptive (1-2 words)', 'Use long sentences as tab labels'],
              ['Use icons consistently across all tabs', 'Mix tabs with and without icons'],
              ['Limit to 2-7 tabs; use scrollable for more', 'Show too many tabs without scrolling'],
              ['Use badges sparingly for important counts', 'Add badges to every tab'],
              ['Place primary/most used tab first', 'Randomly order tabs'],
            ]}
          />
        </div>

        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Icon Position Guidelines</h3>
          <SpecTable
            headers={['Position', 'Use Case']}
            rows={[
              [<code>none</code>, 'Default choice for most text-based navigation'],
              [<code>leading</code>, 'When icons help identify tab content quickly'],
              [<code>top</code>, 'Mobile-friendly layouts or when icons need more prominence'],
              [<code>only</code>, 'Toolbar-style navigation with universally recognized icons'],
            ]}
          />
        </div>
      </section>
        </>
      )}

      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={tabDocData} />
      )}
    </StyleguideLayout>
  )
}
