'use client'

import React, { useState, useEffect } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { Button, ButtonGroup, DropdownIcon, ButtonSize, ButtonEmphasis, BottomSheet } from '@/components'
import { IconPlus, IconSettings } from '@/components/Icons'
import { colors, typography, spacing, borderRadius, breakpoints, transitionPresets, zIndex, shadows, button, header } from '@/styles/design-tokens'
import { useColors } from '@/styles/themes'
import { useIsMobile } from '@/hooks'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'specs' | 'implementation' | 'documentation'

// =============================================================================
// CONSTANTS
// =============================================================================

const DRAWER_WIDTH = 260
const HEADER_HEIGHT = parseInt(header.height)

// =============================================================================
// PROPERTIES DRAWER (with tabs: Controls / Tokens / Accessibility)
// =============================================================================

interface PropertiesDrawerProps {
  open: boolean
  isMobile: boolean
  onClose: () => void
  children: React.ReactNode
}

function PropertiesDrawer({ open, isMobile, onClose, children }: PropertiesDrawerProps) {
  const themeColors = useColors()

  // ── Mobile: use BottomSheet component ──
  if (isMobile) {
    return (
      <BottomSheet
        open={open}
        onClose={onClose}
        title="Properties"
        height="half"
        aria-label="Properties panel"
      >
        {children}
      </BottomSheet>
    )
  }

  // ── Desktop: fixed right panel ──
  return (
    <aside
      style={{
        position: 'fixed',
        top: `calc(${HEADER_HEIGHT}px + ${spacing.xl})`,
        right: spacing.xl,
        bottom: spacing.sm,
        height: `calc(100vh - ${HEADER_HEIGHT}px - ${spacing.xl} - ${spacing.sm})`,
        width: open ? `${DRAWER_WIDTH}px` : '0px',
        zIndex: zIndex.sticky,
        transition: `width 0.25s ease, opacity 0.25s ease`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      aria-label="Properties panel"
    >
      {/* Inner card — matches LeftNav card styling */}
      <div style={{
        width: `${DRAWER_WIDTH}px`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: themeColors.surface.lightDarker,
        borderRadius: borderRadius.lg,
        border: `1px solid ${themeColors.border.lowEmphasis.onLight}`,
        overflow: 'hidden',
      }}>
        {/* Drawer header */}
        <div style={{
          padding: `${spacing.sm} ${spacing.md}`,
          flexShrink: 0,
        }}>
          <span style={{
            ...typography.label.sm,
            fontWeight: 600,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px',
            color: themeColors.text.highEmphasis.onLight,
          }}>
            Properties
          </span>
        </div>

        {/* Content — scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: `${spacing.xs} ${spacing.md} ${spacing.md}`,
        }}>
          {children}
        </div>
      </div>
    </aside>
  )
}

// =============================================================================
// PROPERTY SECTION (Figma-style collapsible group)
// =============================================================================

interface PropertySectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function PropertySection({ title, children, defaultOpen = true }: PropertySectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const themeColors = useColors()
  return (
    <div style={{ marginBottom: spacing.md }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing['2xs'],
          width: '100%',
          padding: `${spacing['2xs']} 0`,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: themeColors.text.lowEmphasis.onLight,
          ...typography.label.sm,
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.05em',
        }}
      >
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"
          style={{
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: transitionPresets.fast,
          }}
        >
          <polyline points="9 6 15 12 9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {title}
      </button>
      {open && (
        <div style={{ paddingTop: spacing.xs }}>
          {children}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// DOC DATA
// =============================================================================

const buttonDocData: ComponentDocData = {
  displayName: 'Button',
  importPath: '@/components',
  importStatement: `import { Button, ButtonGroup, DropdownIcon } from '@/components'
import type { ButtonProps, ButtonSize, ButtonEmphasis } from '@/components'`,
  description: 'Buttons allow users to take actions and make choices with a single tap.',
  props: [
    { name: 'size', type: "'lg' | 'md'", default: "'md'", description: 'Size of the button' },
    { name: 'emphasis', type: "'high' | 'mid' | 'low'", default: "'high'", description: 'Visual emphasis level' },
    { name: 'onDark', type: 'boolean', default: 'false', description: 'Render for dark surfaces' },
    { name: 'destructive', type: 'boolean', default: 'false', description: 'Destructive action style' },
    { name: 'leftIcon', type: 'ReactNode', description: 'Icon before text' },
    { name: 'rightIcon', type: 'ReactNode', description: 'Icon after text (dropdown)' },
    { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Icon-only button mode' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading spinner' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Full width button' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { name: 'focused', type: 'boolean', default: 'false', description: 'Force focus state (for demos)' },
    { name: 'className', type: 'string', description: 'Additional CSS class' },
    { name: 'style', type: 'CSSProperties', description: 'Additional inline styles' },
  ],
  subComponents: [
    {
      name: 'ButtonGroup',
      description: 'Groups buttons with consistent spacing and alignment.',
      props: [
        { name: 'spacing', type: "'default' | 'form' | 'formMobile' | 'inline'", default: "'default'", description: 'Spacing preset' },
        { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", default: "'start'", description: 'Alignment of buttons' },
        { name: 'className', type: 'string', description: 'Additional CSS class' },
        { name: 'style', type: 'CSSProperties', description: 'Additional inline styles' },
      ],
    },
  ],
  typeDefinitions: [
    { name: 'ButtonSize', definition: "type ButtonSize = 'lg' | 'md'" },
    { name: 'ButtonEmphasis', definition: "type ButtonEmphasis = 'high' | 'mid' | 'low'" },
  ],
  accessibility: [
    { feature: 'Keyboard', description: 'Tab to focus, Enter/Space to activate. Focus ring visible on keyboard navigation.' },
    { feature: 'ARIA', description: 'Uses native <button> element. aria-disabled set when disabled, aria-label required for iconOnly buttons.' },
    { feature: 'Focus Ring', description: 'Visible 2px focus ring with offset, using brand color.' },
    { feature: 'Loading State', description: 'Sets aria-busy="true" and disables interaction during loading.' },
  ],
  tokens: [
    { token: 'button.typography.{size}', value: 'fontSize, fontWeight, lineHeight', usage: 'Text styling per size' },
    { token: 'button.sizes.{size}', value: 'height, minWidth, padding, gap', usage: 'Dimensions per size' },
    { token: 'button.emphasis.{level}', value: 'background, text, border per state', usage: 'Color theming per emphasis' },
    { token: 'button.borderRadius', value: '999px (pill)', usage: 'Border radius' },
    { token: 'button.transition', value: '150ms ease', usage: 'State transitions' },
    { token: 'button.focus', value: 'color, width, offset', usage: 'Focus ring appearance' },
  ],
  relatedComponents: [
    { name: 'Link', href: '/components/link' },
    { name: 'Segmented Control', href: '/components/segmented-control' },
  ],
  notes: [
    'Use one high-emphasis button per section to establish clear visual hierarchy.',
    'Always provide aria-label for icon-only buttons.',
    'Place low-emphasis (cancel) buttons before high-emphasis (submit) buttons in groups.',
    'Use ButtonGroup with spacing="form" for form action rows.',
  ],
  whenToUse: [
    'Primary actions that trigger state changes (submit, save, create, delete).',
    'Navigation actions that leave the current context (open modal, go to page).',
    'Toolbar actions paired with icons (filter, export, add new).',
  ],
  whenNotToUse: [
    { scenario: 'Inline text navigation within content', instead: 'Link — semantic anchor, underlined text style' },
    { scenario: 'Toggling between 2-5 options in a group', instead: 'SegmentedControl — inline option switcher with visual state' },
    { scenario: 'Toggling a boolean setting on/off', instead: 'Switch — conveys on/off state better than a button' },
  ],
  usageExamples: [
    {
      title: 'Form submit with cancel',
      description: 'Standard form action row. One high-emphasis primary action, one low-emphasis cancel. Use ButtonGroup for consistent spacing.',
      isDefault: true,
      code: `<ButtonGroup spacing="form" align="end">\n  <Button emphasis="low">Cancel</Button>\n  <Button emphasis="high">Save Changes</Button>\n</ButtonGroup>`,
    },
    {
      title: 'Destructive action',
      description: 'Use for permanent actions like delete or revoke. Always pair with a ConfirmDialog.',
      code: `<Button emphasis="high" destructive onClick={handleDelete}>\n  Revoke License\n</Button>`,
    },
    {
      title: 'Icon button in toolbar',
      description: 'Use iconOnly with aria-label for compact toolbar actions.',
      code: `<Button emphasis="low" iconOnly aria-label="Add new item">\n  <IconPlus />\n</Button>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function ButtonPage() {
  const sizes: ButtonSize[] = ['lg', 'md']
  const emphases: ButtonEmphasis[] = ['high', 'mid', 'low']
  const isMobile = useIsMobile()
  const themeColors = useColors()

  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Properties drawer state — start closed, open on desktop after mount
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Sync drawer state with viewport: open on desktop, closed on mobile
  useEffect(() => {
    setDrawerOpen(!isMobile)
  }, [isMobile])

  // Interactive state for property manipulation
  const [demoSize, setDemoSize] = useState<ButtonSize>('md')
  const [demoEmphasis, setDemoEmphasis] = useState<ButtonEmphasis>('high')
  const [demoDestructive, setDemoDestructive] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoLeftIcon, setDemoLeftIcon] = useState(false)
  const [demoRightIcon, setDemoRightIcon] = useState(false)
  const [demoIconOnly, setDemoIconOnly] = useState(false)
  const [demoFullWidth, setDemoFullWidth] = useState(false)
  const [demoOnDark, setDemoOnDark] = useState(false)

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Playground' },
    { id: 'specs', label: 'Specs' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  // Generate live code string
  const liveCode = `<Button
  size="${demoSize}"
  emphasis="${demoEmphasis}"${demoDestructive ? '\n  destructive' : ''}${demoLoading ? '\n  loading' : ''}${demoDisabled ? '\n  disabled' : ''}${demoOnDark ? '\n  onDark' : ''}${demoFullWidth ? '\n  fullWidth' : ''}${demoIconOnly ? '\n  iconOnly\n  leftIcon={<IconPlus />}\n  aria-label="Add item"' : ''}${demoLeftIcon && !demoIconOnly ? '\n  leftIcon={<IconPlus />}' : ''}${demoRightIcon && !demoIconOnly ? '\n  rightIcon={<DropdownIcon />}' : ''}
>${demoIconOnly ? '' : '\n  Button\n'}</Button>`

  return (
    <StyleguideLayout
      title="Button"
      description="Buttons allow users to take actions and make choices with a single tap. They communicate actions that users can take throughout your UI."
      tagline="The most important 44px in your interface."
      activeId="button"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
      showPanelToggle={activePageTab === 'overview' && !isMobile}
      panelToggleExpanded={drawerOpen}
      onPanelToggleClick={() => setDrawerOpen(!drawerOpen)}
    >
      {/* ========== FIXED PROPERTIES DRAWER (Col 3) ========== */}
      {activePageTab === 'overview' && (
        <PropertiesDrawer open={drawerOpen} isMobile={isMobile} onClose={() => setDrawerOpen(false)}>
          {/* Size */}
          <PropertySection title="Size">
            <div style={{ display: 'flex', gap: spacing['2xs'] }}>
              {sizes.map(s => (
                <PillButton
                  key={s}
                  onClick={() => setDemoSize(s)}
                  isActive={demoSize === s}
                >
                  {s}
                </PillButton>
              ))}
            </div>
          </PropertySection>

          {/* Emphasis */}
          <PropertySection title="Emphasis">
            <div style={{ display: 'flex', gap: spacing['2xs'] }}>
              {emphases.map(e => (
                <PillButton
                  key={e}
                  onClick={() => setDemoEmphasis(e)}
                  isActive={demoEmphasis === e}
                >
                  {e}
                </PillButton>
              ))}
            </div>
          </PropertySection>

          {/* State */}
          <PropertySection title="State">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              <StyledCheckbox
                checked={demoDestructive}
                onChange={setDemoDestructive}
                label="Destructive"
              />
              <StyledCheckbox
                checked={demoLoading}
                onChange={setDemoLoading}
                label="Loading"
              />
              <StyledCheckbox
                checked={demoDisabled}
                onChange={setDemoDisabled}
                label="Disabled"
              />
            </div>
          </PropertySection>

          {/* Layout */}
          <PropertySection title="Layout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              <StyledCheckbox
                checked={demoIconOnly}
                onChange={setDemoIconOnly}
                label="Icon Only"
              />
              <StyledCheckbox
                checked={demoFullWidth}
                onChange={setDemoFullWidth}
                label="Full Width"
              />
              <StyledCheckbox
                checked={demoOnDark}
                onChange={setDemoOnDark}
                label="On Dark"
              />
            </div>
          </PropertySection>

          {/* Icons */}
          {!demoIconOnly && (
            <PropertySection title="Icons">
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                <StyledCheckbox
                  checked={demoLeftIcon}
                  onChange={setDemoLeftIcon}
                  label="Left Icon"
                />
                <StyledCheckbox
                  checked={demoRightIcon}
                  onChange={setDemoRightIcon}
                  label="Right Icon"
                />
              </div>
            </PropertySection>
          )}
        </PropertiesDrawer>
      )}

      {/* ========== PLAYGROUND TAB ========== */}
      {activePageTab === 'overview' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          marginRight: !isMobile && drawerOpen ? `${DRAWER_WIDTH + 24}px` : 0,
          transition: 'margin-right 0.25s ease',
          minHeight: isMobile ? '300px' : '500px',
          // On mobile, pull the playground flush to content edges
          ...(isMobile ? { margin: `0 -${spacing.md}` } : {}),
        }}>
          {/* Preview area — fills the center */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: demoOnDark ? colors.brand.default : colors.surface.lightDarker,
            // No rounded corners on mobile — full bleed
            borderRadius: isMobile ? 0 : borderRadius.lg,
            padding: isMobile ? spacing.xl : spacing['4xl'],
            minHeight: isMobile ? '200px' : '360px',
            transition: `background 0.25s ease`,
          }}>
            <div style={{ width: demoFullWidth ? '100%' : 'auto' }}>
              <Button
                size={demoSize}
                emphasis={demoEmphasis}
                destructive={demoDestructive}
                loading={demoLoading}
                disabled={demoDisabled}
                leftIcon={(demoLeftIcon || demoIconOnly) ? <IconPlus size={demoSize === 'lg' ? 'lg' : 'md'} /> : undefined}
                rightIcon={demoRightIcon && !demoIconOnly ? <DropdownIcon size={demoSize === 'lg' ? 20 : 16} /> : undefined}
                iconOnly={demoIconOnly}
                fullWidth={demoFullWidth}
                onDark={demoOnDark}
                aria-label={demoIconOnly ? 'Add item' : undefined}
              >
                {demoIconOnly ? undefined : 'Button'}
              </Button>
            </div>
          </div>

          {/* Code output — below the preview */}
          <div style={{ marginTop: spacing.md, ...(isMobile ? { padding: `0 ${spacing.md}` } : {}) }}>
            <CodeBlock>{liveCode}</CodeBlock>
          </div>

          {/* ── Mobile FAB: high-emphasis "Properties" button ── */}
          {isMobile && !drawerOpen && (
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open properties panel"
              style={{
                position: 'fixed',
                bottom: spacing.xl,
                right: spacing.md,
                zIndex: zIndex.sticky,
                display: 'flex',
                alignItems: 'center',
                gap: spacing['2xs'],
                height: '48px',
                padding: `0 ${spacing.md} 0 ${spacing.sm}`,
                background: colors.brand.default,
                color: colors.text.highEmphasis.onDark,
                border: 'none',
                borderRadius: borderRadius.full,
                boxShadow: shadows.lg,
                cursor: 'pointer',
                ...typography.label.sm,
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Properties
            </button>
          )}
        </div>
      )}

      {/* ========== SPECS TAB (Tokens + Accessibility) ========== */}
      {activePageTab === 'specs' && (
        <>
          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>
            <p style={sharedStyles.sectionDescription}>
              Typography scale, spacing, and color values used in the Button component. Click any token to copy it.
            </p>

            {/* Typography Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Size', 'Font Size', 'Font Weight', 'Line Height', 'Letter Spacing']}
                rows={sizes.map(size => [
                  <code key={size}>{size}</code>,
                  <TokenValue key={`fs-${size}`} token={`button.typography.${size}.fontSize`} value={button.typography[size].fontSize} />,
                  <TokenValue key={`fw-${size}`} token={`button.typography.${size}.fontWeight`} value={button.typography[size].fontWeight.toString()} />,
                  <TokenValue key={`lh-${size}`} token={`button.typography.${size}.lineHeight`} value={String(button.typography[size].lineHeight)} />,
                  <TokenValue key={`ls-${size}`} token={`button.typography.${size}.letterSpacing`} value={button.typography[size].letterSpacing} />,
                ])}
              />
            </div>

            {/* Spacing Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Spacing & Dimensions</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Size', 'Height', 'Min Width', 'Padding X', 'Padding Y', 'Gap']}
                rows={sizes.map(size => [
                  <code key={size}>{size}</code>,
                  <TokenValue key={`h-${size}`} token={`button.sizes.${size}.height`} value={button.sizes[size].height} />,
                  <TokenValue key={`mw-${size}`} token={`button.sizes.${size}.minWidth`} value={button.sizes[size].minWidth} />,
                  <TokenValue key={`px-${size}`} token={`button.sizes.${size}.paddingX`} value={button.sizes[size].paddingX} />,
                  <TokenValue key={`py-${size}`} token={`button.sizes.${size}.paddingY`} value={button.sizes[size].paddingY} />,
                  <TokenValue key={`g-${size}`} token={`button.sizes.${size}.gap`} value={button.sizes[size].gap} />,
                ])}
              />
            </div>

            {/* Icon Only Button Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Icon-Only Dimensions</h3>
              <SpecTable
                headers={['Size', 'Button Size', 'Icon Size']}
                rows={sizes.map(size => [
                  <code key={size}>{size}</code>,
                  <TokenValue key={`io-${size}`} token={`button.iconOnlySizes.${size}.size`} value={button.iconOnlySizes[size].size} />,
                  <TokenValue key={`ioi-${size}`} token={`button.iconOnlySizes.${size}.iconSize`} value={button.iconOnlySizes[size].iconSize} />,
                ])}
              />
            </div>

            {/* Shape & Animation */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Shape & Animation</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Border Radius', <CopyableToken key="br" token="button.borderRadius" />, <PixelValue key="brv" value={button.borderRadius} />],
                  ['Transition', <CopyableToken key="tr" token="button.transition" />, <PixelValue key="trv" value={button.transition} />],
                  ['Focus Color', <CopyableToken key="fc" token="button.focus.color" />, <PixelValue key="fcv" value={button.focus.color} />],
                  ['Focus Width', <CopyableToken key="fw" token="button.focus.width" />, <PixelValue key="fwv" value={button.focus.width} />],
                  ['Focus Offset', <CopyableToken key="fo" token="button.focus.offset" />, <PixelValue key="fov" value={button.focus.offset} />],
                ]}
              />
            </div>

            {/* Colors - High Emphasis */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Colors — High Emphasis</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['State', 'Background', 'Text', 'Border']}
                rows={[
                  ['Enabled',
                    <TokenValue key="he-bg" token="button.emphasis.high.enabled.background" value={button.emphasis.high.enabled.background} />,
                    <TokenValue key="he-txt" token="button.emphasis.high.enabled.text" value={button.emphasis.high.enabled.text} />,
                    <PixelValue key="he-bdr" value={button.emphasis.high.enabled.border} />],
                  ['Hover',
                    <TokenValue key="hh-bg" token="button.emphasis.high.hover.background" value={button.emphasis.high.hover.background} />,
                    <TokenValue key="hh-txt" token="button.emphasis.high.hover.text" value={button.emphasis.high.hover.text} />,
                    <PixelValue key="hh-bdr" value={button.emphasis.high.hover.border} />],
                  ['Pressed',
                    <TokenValue key="hp-bg" token="button.emphasis.high.pressed.background" value={button.emphasis.high.pressed.background} />,
                    <TokenValue key="hp-txt" token="button.emphasis.high.pressed.text" value={button.emphasis.high.pressed.text} />,
                    <PixelValue key="hp-bdr" value={button.emphasis.high.pressed.border} />],
                  ['Disabled',
                    <TokenValue key="hd-bg" token="button.emphasis.high.disabled.background" value={button.emphasis.high.disabled.background} />,
                    <TokenValue key="hd-txt" token="button.emphasis.high.disabled.text" value={button.emphasis.high.disabled.text} />,
                    <PixelValue key="hd-bdr" value={button.emphasis.high.disabled.border} />],
                ]}
              />
            </div>

            {/* Colors - Mid Emphasis */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Colors — Mid Emphasis</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['State', 'Background', 'Text', 'Border']}
                rows={[
                  ['Enabled',
                    <TokenValue key="me-bg" token="button.emphasis.mid.enabled.background" value={button.emphasis.mid.enabled.background} />,
                    <TokenValue key="me-txt" token="button.emphasis.mid.enabled.text" value={button.emphasis.mid.enabled.text} />,
                    <PixelValue key="me-bdr" value={button.emphasis.mid.enabled.border} />],
                  ['Hover',
                    <TokenValue key="mh-bg" token="button.emphasis.mid.hover.background" value={button.emphasis.mid.hover.background} />,
                    <TokenValue key="mh-txt" token="button.emphasis.mid.hover.text" value={button.emphasis.mid.hover.text} />,
                    <PixelValue key="mh-bdr" value={button.emphasis.mid.hover.border} />],
                  ['Pressed',
                    <TokenValue key="mp-bg" token="button.emphasis.mid.pressed.background" value={button.emphasis.mid.pressed.background} />,
                    <TokenValue key="mp-txt" token="button.emphasis.mid.pressed.text" value={button.emphasis.mid.pressed.text} />,
                    <PixelValue key="mp-bdr" value={button.emphasis.mid.pressed.border} />],
                  ['Disabled',
                    <TokenValue key="md-bg" token="button.emphasis.mid.disabled.background" value={button.emphasis.mid.disabled.background} />,
                    <TokenValue key="md-txt" token="button.emphasis.mid.disabled.text" value={button.emphasis.mid.disabled.text} />,
                    <PixelValue key="md-bdr" value={button.emphasis.mid.disabled.border} />],
                ]}
              />
            </div>

            {/* Colors - Low Emphasis */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Colors — Low Emphasis</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['State', 'Background', 'Text', 'Border']}
                rows={[
                  ['Enabled',
                    <TokenValue key="le-bg" token="button.emphasis.low.enabled.background" value={button.emphasis.low.enabled.background} />,
                    <TokenValue key="le-txt" token="button.emphasis.low.enabled.text" value={button.emphasis.low.enabled.text} />,
                    <PixelValue key="le-bdr" value={button.emphasis.low.enabled.border} />],
                  ['Hover',
                    <TokenValue key="lh-bg" token="button.emphasis.low.hover.background" value={button.emphasis.low.hover.background} />,
                    <TokenValue key="lh-txt" token="button.emphasis.low.hover.text" value={button.emphasis.low.hover.text} />,
                    <PixelValue key="lh-bdr" value={button.emphasis.low.hover.border} />],
                  ['Pressed',
                    <TokenValue key="lp-bg" token="button.emphasis.low.pressed.background" value={button.emphasis.low.pressed.background} />,
                    <TokenValue key="lp-txt" token="button.emphasis.low.pressed.text" value={button.emphasis.low.pressed.text} />,
                    <PixelValue key="lp-bdr" value={button.emphasis.low.pressed.border} />],
                  ['Disabled',
                    <TokenValue key="ld-bg" token="button.emphasis.low.disabled.background" value={button.emphasis.low.disabled.background} />,
                    <TokenValue key="ld-txt" token="button.emphasis.low.disabled.text" value={button.emphasis.low.disabled.text} />,
                    <PixelValue key="ld-bdr" value={button.emphasis.low.disabled.border} />],
                ]}
              />
            </div>
          </section>

          {/* ========== ACCESSIBILITY ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <p style={sharedStyles.sectionDescription}>
              WCAG 2.2 AA compliance details for the Button component.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Keyboard Interaction</h3>
              <SpecTable
                headers={['Key', 'Action']}
                rows={[
                  [<kbd>Tab</kbd>, 'Move focus to / from the button'],
                  [<kbd>Enter</kbd>, 'Activate the button'],
                  [<kbd>Space</kbd>, 'Activate the button'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>ARIA Attributes</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Attribute', 'When', 'Purpose']}
                rows={[
                  [<code>role="button"</code>, 'Always (native)', 'Implicit from <button> element'],
                  [<code>aria-disabled="true"</code>, 'When disabled', 'Communicates non-interactive state'],
                  [<code>aria-label</code>, 'Icon-only buttons', 'Provides accessible name when no visible text'],
                  [<code>aria-busy="true"</code>, 'When loading', 'Indicates pending operation'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Visual Requirements</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Requirement', 'Standard', 'Status']}
                rows={[
                  ['Text contrast ratio', 'WCAG 1.4.3 — minimum 4.5:1', 'Pass'],
                  ['Focus indicator', 'WCAG 2.4.7 — visible focus ring', 'Pass (2px brand ring with offset)'],
                  ['Touch target size', 'WCAG 2.5.8 — minimum 44×44px', 'Pass (lg: 48px, md: 36px with padding)'],
                  ['Color not sole indicator', 'WCAG 1.4.1 — not only visual cue', 'Pass (text + shape differentiate emphasis)'],
                  ['Reduced motion', 'WCAG 2.3.3 — prefers-reduced-motion', 'Pass (transitions disabled)'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          {/* ========== QUICK START ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: breakpoints.sm }}>
              <CodeBlock>{`// Package import
import { Button, ButtonGroup } from '@lumen/design-system'

// Or with path alias (requires tsconfig setup)
import { Button, ButtonGroup } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== USAGE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`// Primary action
<Button emphasis="high" size="lg">
  Submit
</Button>

// Secondary action
<Button emphasis="mid" size="md">
  Cancel
</Button>

// Tertiary action
<Button emphasis="low" size="md">
  Learn More
</Button>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With Icons</h3>
              <CodeBlock>
{`// Left icon
<Button leftIcon={<IconPlus />}>
  Add Item
</Button>

// Right icon (dropdown)
<Button rightIcon={<DropdownIcon />}>
  Options
</Button>

// Icon only
<Button iconOnly leftIcon={<IconSettings />} aria-label="Settings" />`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Button Groups</h3>
              <CodeBlock>
{`// Form actions
<ButtonGroup spacing="form">
  <Button emphasis="low">Cancel</Button>
  <Button emphasis="high">Save</Button>
</ButtonGroup>

// Mobile stacked
<ButtonGroup spacing="formMobile" align="stretch">
  <Button emphasis="high">Continue</Button>
  <Button emphasis="low">Go Back</Button>
</ButtonGroup>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Destructive Actions</h3>
              <CodeBlock>
{`// Destructive button
<Button emphasis="high" destructive>
  Delete
</Button>

// With icon
<Button emphasis="high" destructive leftIcon={<IconTrash />}>
  Delete Item
</Button>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Loading State</h3>
              <CodeBlock>
{`<Button emphasis="high" loading>
  Saving...
</Button>`}
              </CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Button Props</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code>size</code>, <code>'lg' | 'md'</code>, <code>'md'</code>, 'Size of the button'],
                  [<code>emphasis</code>, <code>'high' | 'mid' | 'low'</code>, <code>'high'</code>, 'Visual emphasis level'],
                  [<code>onDark</code>, <code>boolean</code>, <code>false</code>, 'Render for dark surfaces'],
                  [<code>destructive</code>, <code>boolean</code>, <code>false</code>, 'Destructive action style'],
                  [<code>leftIcon</code>, <code>ReactNode</code>, '-', 'Icon before text'],
                  [<code>rightIcon</code>, <code>ReactNode</code>, '-', 'Icon after text (dropdown)'],
                  [<code>iconOnly</code>, <code>boolean</code>, <code>false</code>, 'Icon-only button mode'],
                  [<code>loading</code>, <code>boolean</code>, <code>false</code>, 'Show loading spinner'],
                  [<code>fullWidth</code>, <code>boolean</code>, <code>false</code>, 'Full width button'],
                  [<code>disabled</code>, <code>boolean</code>, <code>false</code>, 'Disabled state'],
                  [<code>focused</code>, <code>boolean</code>, <code>false</code>, 'Force focus state (for demos)'],
                  [<code>className</code>, <code>string</code>, '-', 'Additional CSS class'],
                  [<code>style</code>, <code>CSSProperties</code>, '-', 'Additional inline styles'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>ButtonGroup Props</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code>spacing</code>, <code>'default' | 'form' | 'formMobile' | 'inline'</code>, <code>'default'</code>, 'Spacing preset'],
                  [<code>align</code>, <code>'start' | 'center' | 'end' | 'stretch'</code>, <code>'start'</code>, 'Alignment of buttons'],
                  [<code>className</code>, <code>string</code>, '-', 'Additional CSS class'],
                  [<code>style</code>, <code>CSSProperties</code>, '-', 'Additional inline styles'],
                ]}
              />
            </div>
          </section>

          {/* ========== DESIGN GUIDANCE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use Each Size</h3>
              <SpecTable
                headers={['Size', 'Height', 'Usage']}
                rows={[
                  [<code>lg</code>, '48px', 'Bottom of forms, major prominence areas, primary CTAs'],
                  [<code>md</code>, '36px', 'Navigation bars, snackbars, dialogs, banners, mid-page content'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use Each Emphasis</h3>
              <SpecTable
                headers={['Emphasis', 'Usage', 'Limit']}
                rows={[
                  [<code>high</code>, 'Primary actions, main CTAs', 'One per section'],
                  [<code>mid</code>, 'Secondary actions, alternative options', 'As needed'],
                  [<code>low</code>, 'Tertiary actions, links, cancel buttons', 'As needed'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Place low emphasis buttons before high emphasis', 'Put primary action first in a group'],
                  ['Use one high emphasis button per section', 'Use multiple high emphasis buttons'],
                  ['Keep button labels short and action-oriented', 'Use vague labels like "Click Here"'],
                  ['Use destructive style for irreversible actions', 'Use destructive style for warnings'],
                  ['Include aria-label for icon-only buttons', 'Omit accessibility labels'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={buttonDocData} />
      )}
    </StyleguideLayout>
  )
}
