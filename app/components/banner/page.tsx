'use client'

import React, { useState, useEffect } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData, PropertiesDrawer, PropertySection, MobileFab, DRAWER_WIDTH } from '../../design-system/shared'
import { Banner, BannerVariant, BannerSurface, BannerButtonAlignment } from '@/components'
import { colors, typography, spacing, borderRadius, bannerIcon, banner, breakpoints } from '@/styles/design-tokens'
import { useColors } from '@/styles/themes'
import { useIsMobile } from '@/hooks'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'specs' | 'implementation' | 'documentation'
type ButtonOption = 'none' | 'one' | 'both'

// =============================================================================
// DOC DATA
// =============================================================================

const bannerDocData: ComponentDocData = {
  displayName: 'Banner',
  importPath: '@/components',
  importStatement: `import { Banner } from '@/components'\nimport type { BannerProps, BannerVariant, BannerSize } from '@/components'`,
  description: 'Banners display prominent messages and optional actions at the top of a page or section.',
  props: [
    { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: 'Semantic variant' },
    { name: 'size', type: "'md' | 'lg'", default: "'md'", description: 'Size of the banner' },
    { name: 'bannerStyle', type: "'inline'", description: 'Inline style with rounded corners and outline' },
    { name: 'surface', type: "'color' | 'light'", description: 'Surface type (color or light background)' },
    { name: 'buttonAlignment', type: "'side' | 'below'", description: 'Button alignment' },
    { name: 'title', type: 'string', description: 'Main title/heading' },
    { name: 'children', type: 'ReactNode', description: 'Main content text' },
    { name: 'icon', type: 'ReactNode', description: 'Icon displayed on the left' },
    { name: 'primaryAction', type: '{ label: string; onClick: () => void }', description: 'Primary action button' },
    { name: 'secondaryAction', type: '{ label: string; onClick: () => void }', description: 'Secondary action button' },
    { name: 'onDark', type: 'boolean', description: 'Display on dark background' },
    { name: 'className', type: 'string', description: 'Additional CSS class' },
    { name: 'style', type: 'CSSProperties', description: 'Additional inline styles' },
  ],
  typeDefinitions: [
    { name: 'BannerVariant', definition: "type BannerVariant = 'info' | 'success' | 'warning' | 'error'" },
    { name: 'BannerSize', definition: "type BannerSize = 'md' | 'lg'" },
    { name: 'BannerSurface', definition: "type BannerSurface = 'color' | 'light'" },
  ],
  accessibility: [
    { feature: 'ARIA Role', description: 'Uses role="alert" for error/warning, role="status" for info/success.' },
    { feature: 'Dismiss Button', description: 'Dismiss button includes aria-label="Dismiss" for screen readers.' },
    { feature: 'Color + Icon', description: 'Status conveyed through both color and icon, not color alone.' },
  ],
  tokens: [
    { token: 'colors.status.*', value: 'info, success, warning, error', usage: 'Banner variant colors' },
    { token: 'borderRadius.md', value: '8px', usage: 'Inline banner corners' },
    { token: 'spacing.md', value: '16px', usage: 'Internal padding' },
  ],
  relatedComponents: [
    { name: 'Badge', href: '/components/badge' },
    { name: 'Assistive Message', href: '/components/assistive-message' },
  ],
  notes: [
    'Use error variant for critical issues that require immediate user attention.',
    'Use info variant for neutral announcements and tips.',
    'Always include an icon for accessibility - do not rely on color alone.',
    'Banners with actions should have clear, descriptive action labels.',
  ],
  whenToUse: [
    'Persistent, page-level or section-level messages that stay visible until dismissed or resolved.',
    'System status changes that affect the entire page (e.g., "License application submitted successfully").',
    'Regulatory or compliance warnings that users must acknowledge before proceeding.',
    'Informational tips or onboarding guidance at the top of a view.',
  ],
  whenNotToUse: [
    { scenario: 'Temporary success/error feedback after a user action (e.g., "Saved")', instead: 'Toast — auto-dismisses after a few seconds, non-blocking' },
    { scenario: 'Inline validation or help text next to a form field', instead: 'AssistiveMessage — pairs directly with Input/Select for field-level feedback' },
    { scenario: 'Confirming a destructive action before it happens', instead: 'ConfirmDialog — modal with cancel/confirm buttons' },
    { scenario: 'Small status indicators on data items (e.g., "Active", "Pending")', instead: 'Badge — compact status label for tables and lists' },
  ],
  usageExamples: [
    {
      title: 'Page-level info banner',
      description: 'Standard informational banner at the top of a page. Use as the starting point for most banner needs.',
      isDefault: true,
      code: `<Banner variant="info" title="New feature available">\n  You can now export compliance reports as PDF.\n</Banner>`,
    },
    {
      title: 'Error with actions',
      description: 'Critical error requiring user action. Use for blocking issues that prevent workflow completion.',
      code: `<Banner\n  variant="error"\n  title="License renewal overdue"\n  primaryAction={{ label: "Renew Now", onClick: handleRenew }}\n  secondaryAction={{ label: "View Details", onClick: handleDetails }}\n/>`,
    },
    {
      title: 'Dismissible warning',
      description: 'Non-blocking warning that the user can dismiss via an action button.',
      code: `<Banner\n  variant="warning"\n  title="Scheduled maintenance"\n  secondaryAction={{ label: 'Dismiss', onClick: handleDismiss }}\n>\n  The system will be unavailable Saturday 2-4 AM ET.\n</Banner>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function BannerPage() {
  const variants: BannerVariant[] = ['info', 'success', 'warning', 'error']
  const surfaces: BannerSurface[] = ['color', 'light']
  const buttonAlignments: BannerButtonAlignment[] = ['side', 'below']
  const buttonOptions: { value: ButtonOption; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'one', label: '1 Button' },
    { value: 'both', label: '2 Buttons' },
  ]
  const isMobile = useIsMobile()
  const themeColors = useColors()

  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Properties drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Sync drawer state with viewport
  useEffect(() => {
    setDrawerOpen(!isMobile)
  }, [isMobile])

  // Interactive state
  const [demoVariant, setDemoVariant] = useState<BannerVariant>('info')
  const [demoSurface, setDemoSurface] = useState<BannerSurface>('color')
  const [demoButtonAlignment, setDemoButtonAlignment] = useState<BannerButtonAlignment>('side')
  const [demoButtonOption, setDemoButtonOption] = useState<ButtonOption>('both')
  const [demoTitle, setDemoTitle] = useState('Example text')
  const [demoMessage, setDemoMessage] = useState('')
  const [demoOnDark, setDemoOnDark] = useState(false)

  const componentTabs = [
    { id: 'overview', label: 'Playground' },
    { id: 'specs', label: 'Specs' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  // Generate action props
  const getActionProps = () => {
    if (demoButtonOption === 'none') return {}
    if (demoButtonOption === 'one') {
      return { primaryAction: { label: 'Button', onClick: () => {} } }
    }
    return {
      primaryAction: { label: 'Button', onClick: () => {} },
      secondaryAction: { label: 'Button', onClick: () => {} },
    }
  }

  // Generate live code string
  const generateCode = () => {
    const lines = ['<Banner']
    lines.push(`  variant="${demoVariant}"`)
    if (demoSurface !== 'color') lines.push(`  surface="${demoSurface}"`)
    if (demoButtonAlignment !== 'side') lines.push(`  buttonAlignment="${demoButtonAlignment}"`)
    if (demoTitle) lines.push(`  title="${demoTitle.replace(/"/g, '\\"')}"`)
    if (demoOnDark) lines.push('  onDark={true}')
    if (demoButtonOption === 'one') {
      lines.push('  primaryAction={{ label: "Button", onClick: () => {} }}')
    } else if (demoButtonOption === 'both') {
      lines.push('  primaryAction={{ label: "Button", onClick: () => {} }}')
      lines.push('  secondaryAction={{ label: "Button", onClick: () => {} }}')
    }
    if (demoMessage) {
      lines.push('>')
      lines.push(`  ${demoMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}`)
      lines.push('</Banner>')
    } else {
      lines.push('/>')
    }
    return lines.join('\n')
  }

  return (
    <StyleguideLayout
      title="Banner"
      description="Banners communicate important information and actions to users. They appear at the top of content areas and can include action buttons."
      tagline="Important messages deserve the spotlight."
      activeId="banner"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
      showPanelToggle={activePageTab === 'overview' && !isMobile}
      panelToggleExpanded={drawerOpen}
      onPanelToggleClick={() => setDrawerOpen(!drawerOpen)}
    >
      {/* ========== FIXED PROPERTIES DRAWER ========== */}
      {activePageTab === 'overview' && (
        <PropertiesDrawer open={drawerOpen} isMobile={isMobile} onClose={() => setDrawerOpen(false)}>
          {/* Variant */}
          <PropertySection title="Variant">
            <div style={{ display: 'flex', gap: spacing['2xs'], flexWrap: 'wrap' }}>
              {variants.map(v => (
                <PillButton key={v} onClick={() => setDemoVariant(v)} isActive={demoVariant === v}>
                  {v}
                </PillButton>
              ))}
            </div>
          </PropertySection>

          {/* Surface */}
          <PropertySection title="Surface">
            <div style={{ display: 'flex', gap: spacing['2xs'] }}>
              {surfaces.map(s => (
                <PillButton key={s} onClick={() => setDemoSurface(s)} isActive={demoSurface === s}>
                  {s}
                </PillButton>
              ))}
            </div>
          </PropertySection>

          {/* Button Alignment */}
          <PropertySection title="Button Alignment">
            <div style={{ display: 'flex', gap: spacing['2xs'] }}>
              {buttonAlignments.map(a => (
                <PillButton key={a} onClick={() => setDemoButtonAlignment(a)} isActive={demoButtonAlignment === a}>
                  {a}
                </PillButton>
              ))}
            </div>
          </PropertySection>

          {/* Buttons */}
          <PropertySection title="Buttons">
            <div style={{ display: 'flex', gap: spacing['2xs'], flexWrap: 'wrap' }}>
              {buttonOptions.map(opt => (
                <PillButton key={opt.value} onClick={() => setDemoButtonOption(opt.value)} isActive={demoButtonOption === opt.value}>
                  {opt.label}
                </PillButton>
              ))}
            </div>
          </PropertySection>

          {/* Content */}
          <PropertySection title="Content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              <label style={{ ...typography.label.sm }}>Title</label>
              <input
                type="text"
                value={demoTitle}
                onChange={(e) => setDemoTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: spacing['2xs'],
                  border: `1px solid ${themeColors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadius.sm,
                  boxSizing: 'border-box',
                  ...typography.body.sm,
                }}
              />
              <label style={{ ...typography.label.sm, marginTop: spacing['2xs'] }}>Description</label>
              <textarea
                value={demoMessage}
                onChange={(e) => setDemoMessage(e.target.value)}
                rows={2}
                placeholder="Add a description..."
                style={{
                  width: '100%',
                  padding: spacing['2xs'],
                  border: `1px solid ${themeColors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadius.sm,
                  boxSizing: 'border-box',
                  ...typography.body.sm,
                  resize: 'vertical',
                }}
              />
            </div>
          </PropertySection>

          {/* State */}
          <PropertySection title="State">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              <StyledCheckbox checked={demoOnDark} onChange={setDemoOnDark} label="On Dark" />
            </div>
          </PropertySection>
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
          ...(isMobile ? { margin: `0 -${spacing.md}` } : {}),
        }}>
          {/* Preview area */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: demoOnDark ? colors.brand.default : colors.surface.lightDarker,
            borderRadius: isMobile ? 0 : borderRadius.lg,
            padding: isMobile ? spacing.md : spacing['2xl'],
            minHeight: isMobile ? '200px' : '360px',
            transition: 'background 0.25s ease',
          }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
              <Banner
                variant={demoVariant}
                surface={demoSurface}
                buttonAlignment={demoButtonAlignment}
                title={demoTitle || undefined}
                onDark={demoOnDark}
                {...getActionProps()}
              >
                {demoMessage || undefined}
              </Banner>
            </div>
          </div>

          {/* Code output */}
          <div style={{ marginTop: spacing.md, ...(isMobile ? { padding: `0 ${spacing.md}` } : {}) }}>
            <CodeBlock>{generateCode()}</CodeBlock>
          </div>

          {/* Mobile FAB */}
          {isMobile && !drawerOpen && (
            <MobileFab onClick={() => setDrawerOpen(true)} />
          )}
        </div>
      )}

      {/* ========== SPECS TAB ========== */}
      {activePageTab === 'specs' && (
        <>
          {/* Design Tokens */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>
            <p style={sharedStyles.sectionDescription}>
              Typography, spacing, and color values used in the Banner component. Click any token to copy it.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography Tokens</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Element', 'Font Size', 'Line Height', 'Font Weight']}
                rows={[
                  ['Title', <PixelValue key="t-fs" value="16px" />, <PixelValue key="t-lh" value="24px" />, <PixelValue key="t-fw" value="400" />],
                  ['Description', <PixelValue key="d-fs" value="16px" />, <PixelValue key="d-lh" value="24px" />, <PixelValue key="d-fw" value="400" />],
                  ['Button', <PixelValue key="b-fs" value="14px" />, <PixelValue key="b-lh" value="20px" />, <PixelValue key="b-fw" value="500" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Spacing & Dimensions</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Element', 'Token', 'Value']}
                rows={[
                  ['Min Height (side)', <CopyableToken key="hs" token="banner.sizing.minHeight.side" />, <PixelValue key="hsv" value="56px" />],
                  ['Min Height (below)', <CopyableToken key="hb" token="banner.sizing.minHeight.below" />, <PixelValue key="hbv" value="100px" />],
                  ['Padding', <CopyableToken key="p" token="banner.padding" />, <PixelValue key="pv" value="8px" />],
                  ['Icon Container', <CopyableToken key="ic" token="bannerIcon.sizing.container" />, <PixelValue key="icv" value="40px" />],
                  ['Icon Size', <CopyableToken key="is" token="bannerIcon.sizing.icon" />, <PixelValue key="isv" value="24px" />],
                  ['Content Gap', <CopyableToken key="cg" token="banner.spacing.contentGap" />, <PixelValue key="cgv" value="8px" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Shape</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Banner Radius', <CopyableToken key="br" token="banner.borderRadius" />, <PixelValue key="brv" value="16px" />],
                  ['Icon Radius', <CopyableToken key="icr" token="bannerIcon.borderRadius" />, <PixelValue key="icrv" value="16px" />],
                  ['Outline Width', <CopyableToken key="ow" token="banner.outline.width" />, <PixelValue key="owv" value="2px" />],
                  ['Outline Opacity', <CopyableToken key="oo" token="banner.outline.opacity" />, <PixelValue key="oov" value="0.6" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Colors — Color Surface</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Variant', 'Background Token', 'Icon BG Token', 'Icon Color Token']}
                rows={[
                  ['info', <CopyableToken key="i-bg" token="banner.variants.info.color.background" />, <CopyableToken key="i-ibg" token="bannerIcon.variants.information.background" />, <CopyableToken key="i-ic" token="bannerIcon.variants.information.iconColor" />],
                  ['success', <CopyableToken key="s-bg" token="banner.variants.success.color.background" />, <CopyableToken key="s-ibg" token="bannerIcon.variants.success.background" />, <CopyableToken key="s-ic" token="bannerIcon.variants.success.iconColor" />],
                  ['warning', <CopyableToken key="w-bg" token="banner.variants.warning.color.background" />, <CopyableToken key="w-ibg" token="bannerIcon.variants.warning.background" />, <CopyableToken key="w-ic" token="bannerIcon.variants.warning.iconColor" />],
                  ['error', <CopyableToken key="e-bg" token="banner.variants.error.color.background" />, <CopyableToken key="e-ibg" token="bannerIcon.variants.error.background" />, <CopyableToken key="e-ic" token="bannerIcon.variants.error.iconColor" />],
                ]}
              />
            </div>
          </section>

          {/* Accessibility */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <p style={sharedStyles.sectionDescription}>
              WCAG 2.2 AA compliance details for the Banner component.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>ARIA Attributes</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Attribute', 'When', 'Purpose']}
                rows={[
                  [<code key="role">role="alert"</code>, 'Error / warning variants', 'Announces critical messages immediately'],
                  [<code key="status">role="status"</code>, 'Info / success variants', 'Announces non-critical messages politely'],
                  [<code key="live">aria-live="polite"</code>, 'Dynamic banners', 'Announces content changes to screen readers'],
                  [<code key="dismiss">aria-label="Dismiss"</code>, 'Dismiss button', 'Provides accessible name for dismiss action'],
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
                  ['Color not sole indicator', 'WCAG 1.4.1 — not only visual cue', 'Pass (icon + color + text)'],
                  ['Action buttons focusable', 'WCAG 2.1.1 — keyboard accessible', 'Pass'],
                  ['Reduced motion', 'WCAG 2.3.3 — prefers-reduced-motion', 'Pass'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          {/* Quick Start */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: breakpoints.sm }}>
              <CodeBlock>{`// Package import
import { Banner } from '@lumen/design-system'

// Or with path alias (requires tsconfig setup)
import { Banner } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* Usage */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`// Informational banner
<Banner variant="info" title="New Feature" />

// Success banner
<Banner variant="success" title="Saved Successfully" />

// Warning banner
<Banner variant="warning" title="Action Required" />

// Error banner
<Banner variant="error" title="Connection Error" />`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With Actions</h3>
              <CodeBlock>
{`// Two actions
<Banner
  variant="warning"
  title="Subscription Expiring"
  primaryAction={{ label: "Renew Now", onClick: () => {} }}
  secondaryAction={{ label: "Remind Later", onClick: () => {} }}
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Surface & Alignment</h3>
              <CodeBlock>
{`// Light surface with buttons below
<Banner
  variant="info"
  surface="light"
  buttonAlignment="below"
  title="Below aligned buttons"
  primaryAction={{ label: "Action", onClick: () => {} }}
/>`}
              </CodeBlock>
            </div>
          </section>

          {/* Props */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Banner Props</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="v">variant</code>, <code key="vt">&apos;info&apos; | &apos;success&apos; | &apos;warning&apos; | &apos;error&apos;</code>, <code key="vd">&apos;info&apos;</code>, 'Semantic variant'],
                  [<code key="s">surface</code>, <code key="st">&apos;color&apos; | &apos;light&apos;</code>, <code key="sd">&apos;color&apos;</code>, 'Background surface type'],
                  [<code key="ba">buttonAlignment</code>, <code key="bat">&apos;side&apos; | &apos;below&apos;</code>, <code key="bad">&apos;side&apos;</code>, 'Button position'],
                  [<code key="t">title</code>, <code key="tt">string</code>, '-', 'Main heading text'],
                  [<code key="ch">children</code>, <code key="cht">ReactNode</code>, '-', 'Description content'],
                  [<code key="pa">primaryAction</code>, <code key="pat">{'{ label, onClick }'}</code>, '-', 'Primary action button'],
                  [<code key="sa">secondaryAction</code>, <code key="sat">{'{ label, onClick }'}</code>, '-', 'Secondary action button'],
                  [<code key="od">onDark</code>, <code key="odt">boolean</code>, <code key="odd">false</code>, 'Display on dark background'],
                ]}
              />
            </div>
          </section>

          {/* Design Guidance */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use Each Variant</h3>
              <SpecTable
                headers={['Variant', 'Usage', 'Examples']}
                rows={[
                  [<code key="i">info</code>, 'Neutral information, tips, or announcements', 'New features, general updates'],
                  [<code key="s">success</code>, 'Successful completion of an action', 'Data saved, upload complete'],
                  [<code key="w">warning</code>, 'Important but non-critical warnings', 'Subscription expiring, approaching limits'],
                  [<code key="e">error</code>, 'Errors or critical issues', 'Failed operations, connection errors'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use banners for important, timely information', 'Use banners for permanent UI elements'],
                  ['Keep messages concise and actionable', 'Write long paragraphs or multiple topics'],
                  ['Limit to 1-2 actions maximum', 'Add more than 2 action buttons'],
                  ['Add a Dismiss action for non-critical messages', 'Omit close options for info banners'],
                  ['Use consistent placement (top of content)', 'Scatter banners throughout the page'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={bannerDocData} />
      )}
    </StyleguideLayout>
  )
}
