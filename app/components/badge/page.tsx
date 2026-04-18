'use client'

import React, { useState, useEffect } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData, PropertiesDrawer, PropertySection, MobileFab, DRAWER_WIDTH } from '../../design-system/shared'
import { Badge, BadgeVariant, BadgeColor, BadgeSize } from '@/components'
import { IconCheck, IconAlertCircle, IconInfo } from '@/components/Icons'
import { colors, typography, spacing, borderRadius, breakpoints } from '@/styles/design-tokens'
import { useColors } from '@/styles/themes'
import { useIsMobile } from '@/hooks'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'specs' | 'implementation' | 'documentation'

// =============================================================================
// DOC DATA
// =============================================================================

const badgeDocData: ComponentDocData = {
  displayName: 'Badge',
  importPath: '@/components',
  importStatement: `import { Badge } from '@/components'
import type { BadgeProps, BadgeVariant, BadgeColor, BadgeSize } from '@/components'`,
  description: 'Badges convey status, category, or count information with compact visual indicators.',
  props: [
    { name: 'variant', type: "'filled' | 'outlined' | 'subtle'", default: "'filled'", description: 'Visual variant' },
    { name: 'color', type: "'neutral' | 'success' | 'warning' | 'error' | 'info' | 'brand'", default: "'neutral'", description: 'Color/intent of the badge' },
    { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: 'Size of the badge' },
    { name: 'icon', type: 'ReactNode', description: 'Optional icon before text' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Badge content (text)' },
  ],
  typeDefinitions: [
    { name: 'BadgeVariant', definition: "type BadgeVariant = 'filled' | 'outlined' | 'subtle'" },
    { name: 'BadgeColor', definition: "type BadgeColor = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'brand'" },
    { name: 'BadgeSize', definition: "type BadgeSize = 'sm' | 'md'" },
  ],
  accessibility: [
    { feature: 'Semantic HTML', description: 'Renders as <span> - add aria-label for meaningful context when used alone.' },
    { feature: 'Color + Icon', description: 'Status is communicated with both color and icon, not color alone.' },
    { feature: 'Contrast', description: 'All color/variant combinations meet WCAG AA contrast requirements.' },
  ],
  tokens: [
    { token: 'colors.badge.*', value: 'charcoal, success, warning, important, info (+ Light variants)', usage: 'Badge color variants (theme-aware)' },
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Brand color badge' },
    { token: 'borderRadius', value: '8px', usage: 'Badge shape' },
    { token: 'typography.body.xs / .sm', value: '12px / 14px', usage: 'Badge text (sm / md size)' },
  ],
  relatedComponents: [
    { name: 'Banner', href: '/components/banner' },
    { name: 'Assistive Message', href: '/components/assistive-message' },
  ],
  notes: [
    'Use filled variant for strong emphasis, subtle for information that is secondary.',
    'Always pair color with an icon for accessibility - do not rely on color alone.',
    'Keep badge text concise - ideally 1-2 words or a short number.',
  ],
  whenToUse: [
    'Static, read-only status indicators on data rows or cards (e.g., "Active", "Pending", "Expired").',
    'Categorical labels that help users scan and identify item types at a glance.',
    'Numeric counts or small metadata (e.g., notification count, item quantity).',
  ],
  whenNotToUse: [
    { scenario: 'Interactive, toggleable filter tags', instead: 'Chip — supports selection, removal, and click handlers' },
    { scenario: 'Page-level persistent messages or alerts', instead: 'Banner — full-width message with actions and dismiss' },
    { scenario: 'Inline form field validation or help text', instead: 'AssistiveMessage — pairs with Input/Select for field-level feedback' },
  ],
  usageExamples: [
    {
      title: 'Status badge in a table row',
      description: 'Display record status inline. Map status values to semantic variants for consistent color coding.',
      isDefault: true,
      code: `<Badge variant={statusMap[row.status]}>\n  {row.status}\n</Badge>`,
    },
    {
      title: 'Category label on a card',
      description: 'Use subtle variant for secondary classification labels that should not compete with primary content.',
      code: `<Badge variant="subtle" color="neutral">\n  {item.category}\n</Badge>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function BadgePage() {
  const variants: BadgeVariant[] = ['filled', 'outlined', 'subtle']
  const badgeColors: BadgeColor[] = ['neutral', 'success', 'warning', 'error', 'info', 'brand']
  const sizes: BadgeSize[] = ['sm', 'md']
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

  // Interactive playground state
  const [demoVariant, setDemoVariant] = useState<BadgeVariant>('filled')
  const [demoColor, setDemoColor] = useState<BadgeColor>('neutral')
  const [demoSize, setDemoSize] = useState<BadgeSize>('sm')
  const [demoShowIcon, setDemoShowIcon] = useState(false)

  const componentTabs = [
    { id: 'overview', label: 'Playground' },
    { id: 'specs', label: 'Specs' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const getIconForColor = (color: BadgeColor) => {
    switch (color) {
      case 'success': return <IconCheck size={12} />
      case 'error': return <IconAlertCircle size={12} />
      case 'warning': return <IconAlertCircle size={12} />
      case 'info': return <IconInfo size={12} />
      default: return <IconInfo size={12} />
    }
  }

  const getBadgeLabel = (color: BadgeColor) => {
    switch (color) {
      case 'success': return 'Verified'
      case 'error': return 'Error'
      case 'warning': return 'Warning'
      case 'info': return 'Info'
      case 'brand': return 'New'
      default: return 'Label'
    }
  }

  // Generate live code string
  const liveCode = `<Badge
  variant="${demoVariant}"
  color="${demoColor}"
  size="${demoSize}"${demoShowIcon ? `\n  icon={<IconCheck size={12} />}` : ''}
>
  ${getBadgeLabel(demoColor)}
</Badge>`

  return (
    <StyleguideLayout
      title="Badge"
      description="Badges are small status indicators used for labels, categories, and tags. They support multiple variants and semantic colors."
      tagline="Small labels. Big status energy."
      activeId="badge"
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
                <PillButton
                  key={v}
                  onClick={() => setDemoVariant(v)}
                  isActive={demoVariant === v}
                >
                  {v}
                </PillButton>
              ))}
            </div>
          </PropertySection>

          {/* Color */}
          <PropertySection title="Color">
            <div style={{ display: 'flex', gap: spacing['2xs'], flexWrap: 'wrap' }}>
              {badgeColors.map(c => (
                <PillButton
                  key={c}
                  onClick={() => setDemoColor(c)}
                  isActive={demoColor === c}
                >
                  {c}
                </PillButton>
              ))}
            </div>
          </PropertySection>

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

          {/* Options */}
          <PropertySection title="Options">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              <StyledCheckbox
                checked={demoShowIcon}
                onChange={setDemoShowIcon}
                label="Show Icon"
              />
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
            background: colors.surface.lightDarker,
            borderRadius: isMobile ? 0 : borderRadius.lg,
            padding: isMobile ? spacing.xl : spacing['4xl'],
            minHeight: isMobile ? '200px' : '360px',
          }}>
            <Badge
              variant={demoVariant}
              color={demoColor}
              size={demoSize}
              icon={demoShowIcon ? getIconForColor(demoColor) : undefined}
            >
              {getBadgeLabel(demoColor)}
            </Badge>
          </div>

          {/* Code output */}
          <div style={{ marginTop: spacing.md, ...(isMobile ? { padding: `0 ${spacing.md}` } : {}) }}>
            <CodeBlock>{liveCode}</CodeBlock>
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
              Size, typography, and color values used in the Badge component. Click any token to copy it.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Size Specifications</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Size', 'Padding Y', 'Padding X', 'Font Size', 'Icon Size']}
                rows={[
                  [
                    <code key="sm">sm</code>,
                    <PixelValue key="sm-py" value="2px" />,
                    <PixelValue key="sm-px" value="8px" />,
                    <TokenValue key="sm-fs" token="typography.body.xs.fontSize" value="12px" />,
                    <PixelValue key="sm-is" value="12px" />,
                  ],
                  [
                    <code key="md">md</code>,
                    <PixelValue key="md-py" value="4px" />,
                    <PixelValue key="md-px" value="10px" />,
                    <TokenValue key="md-fs" token="typography.body.sm.fontSize" value="14px" />,
                    <PixelValue key="md-is" value="14px" />,
                  ],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Font Family', <CopyableToken key="ff" token="typography.label.sm.fontFamily" />, <PixelValue key="ffv" value="Inter" />],
                  ['Font Weight', <CopyableToken key="fw" token="typography.label.sm.fontWeight" />, <PixelValue key="fwv" value="500" />],
                  ['Line Height', <CopyableToken key="lh" token="typography.label.sm.lineHeight" />, <PixelValue key="lhv" value="1.4" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Shape</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Border Radius', <CopyableToken key="br" token="borderRadius (8px)" />, <PixelValue key="brv" value="8px" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Variant Styles</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Variant', 'Background', 'Border', 'Use Case']}
                rows={[
                  ['filled', 'Solid color', 'Same as background', 'High emphasis, primary status'],
                  ['outlined', 'Transparent', '1px solid color', 'Medium emphasis, categories'],
                  ['subtle', 'Tinted (10% opacity)', 'None', 'Low emphasis, tags & filters'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Color Tokens</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Color', 'Filled BG Token', 'Subtle BG Token', 'Text on Filled']}
                rows={[
                  ['neutral', <CopyableToken key="n-bg" token="colors.badge.charcoal" />, <CopyableToken key="n-sbg" token="colors.badge.charcoalLight" />, <PixelValue key="n-txt" value="#FFFFFF" />],
                  ['success', <CopyableToken key="s-bg" token="colors.badge.success" />, <CopyableToken key="s-sbg" token="colors.badge.successLight" />, <PixelValue key="s-txt" value="#FFFFFF" />],
                  ['warning', <CopyableToken key="w-bg" token="colors.badge.warning" />, <CopyableToken key="w-sbg" token="colors.badge.yellowLight" />, <PixelValue key="w-txt" value="#FFFFFF" />],
                  ['error', <CopyableToken key="e-bg" token="colors.badge.important" />, <CopyableToken key="e-sbg" token="colors.badge.importantLight" />, <PixelValue key="e-txt" value="#FFFFFF" />],
                  ['info', <CopyableToken key="i-bg" token="colors.badge.info" />, <CopyableToken key="i-sbg" token="colors.badge.infoLight" />, <PixelValue key="i-txt" value="#FFFFFF" />],
                  ['brand', <CopyableToken key="b-bg" token="colors.brand.default" />, <CopyableToken key="b-sbg" token="colors.brand.lighter" />, <PixelValue key="b-txt" value="#FFFFFF" />],
                ]}
              />
            </div>
          </section>

          {/* Accessibility */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <p style={sharedStyles.sectionDescription}>
              WCAG 2.2 AA compliance details for the Badge component.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>ARIA Attributes</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Attribute', 'When', 'Purpose']}
                rows={[
                  [<code key="al">aria-label</code>, 'When used alone (no surrounding text)', 'Provides accessible name for standalone badges'],
                  [<code key="role">role="status"</code>, 'Dynamic badge updates', 'Announces changes to screen readers'],
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
                  ['Color not sole indicator', 'WCAG 1.4.1 — not only visual cue', 'Pass (pair with icon for status)'],
                  ['Minimum text size', 'WCAG 1.4.4 — resizable text', 'Pass (12px sm, 14px md)'],
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
import { Badge } from '@lumen/design-system'

// Or with path alias (requires tsconfig setup)
import { Badge } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* Usage */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`// Simple badge
<Badge>Label</Badge>

// With variant and color
<Badge variant="outlined" color="success">
  Verified
</Badge>

// With icon
<Badge
  variant="subtle"
  color="success"
  icon={<IconCheck size={12} />}
>
  Verified Application
</Badge>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Status Indicators</h3>
              <CodeBlock>
{`<Badge variant="subtle" color="success">Installed</Badge>
<Badge variant="outlined" color="neutral">Uninstalled</Badge>
<Badge variant="subtle" color="info">Update Available</Badge>
<Badge variant="subtle" color="error">Deprecated</Badge>`}
              </CodeBlock>
            </div>
          </section>

          {/* Props */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Badge Props</h3>
              <SpecTable
                stickyFirstColumn={isMobile}
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="v">variant</code>, <code key="vt">&apos;filled&apos; | &apos;outlined&apos; | &apos;subtle&apos;</code>, <code key="vd">&apos;filled&apos;</code>, 'Visual style'],
                  [<code key="c">color</code>, <code key="ct">&apos;neutral&apos; | &apos;success&apos; | &apos;warning&apos; | &apos;error&apos; | &apos;info&apos; | &apos;brand&apos;</code>, <code key="cd">&apos;neutral&apos;</code>, 'Semantic color'],
                  [<code key="s">size</code>, <code key="st">&apos;sm&apos; | &apos;md&apos;</code>, <code key="sd">&apos;sm&apos;</code>, 'Badge size'],
                  [<code key="i">icon</code>, <code key="it">ReactNode</code>, '-', 'Optional leading icon'],
                  [<code key="ch">children</code>, <code key="cht">ReactNode</code>, 'required', 'Badge content'],
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
                headers={['Variant', 'Use Case']}
                rows={[
                  [<code key="f">filled</code>, 'Primary status, high importance, counts'],
                  [<code key="o">outlined</code>, 'Secondary status, categories, filters'],
                  [<code key="s">subtle</code>, 'Tags, labels, low-emphasis indicators'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Color Semantics</h3>
              <SpecTable
                headers={['Color', 'Meaning']}
                rows={[
                  [<code key="n">neutral</code>, 'Default, categories, neutral status'],
                  [<code key="s">success</code>, 'Verified, complete, positive'],
                  [<code key="w">warning</code>, 'Attention needed, caution'],
                  [<code key="e">error</code>, 'Failed, error, critical'],
                  [<code key="i">info</code>, 'Informational, updates available'],
                  [<code key="b">brand</code>, 'New, featured, promotional'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Pair color with an icon for accessibility', 'Rely on color alone to convey status'],
                  ['Keep text to 1-2 words', 'Put long sentences in a badge'],
                  ['Use filled for primary, subtle for secondary', 'Use all filled badges in the same row'],
                  ['Add aria-label for standalone badges', 'Omit accessible names for decorative status'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={badgeDocData} />
      )}
    </StyleguideLayout>
  )
}
