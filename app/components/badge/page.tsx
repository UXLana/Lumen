'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, TokenValue, CopyableToken, PixelValue, CollapsibleSection } from '../../design-system/shared'
import { Badge, BadgeVariant, BadgeColor, BadgeSize } from '@/components'
import { IconCheck, IconAlertCircle, IconInfo } from '@/components/Icons'
import { colors, typography, spacing, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

type PageTab = 'overview' | 'implementation'

export default function BadgePage() {
  const variants: BadgeVariant[] = ['filled', 'outlined', 'subtle']
  const badgeColors: BadgeColor[] = ['neutral', 'success', 'warning', 'error', 'info', 'brand']
  const sizes: BadgeSize[] = ['sm', 'md']

  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive playground state
  const [demoVariant, setDemoVariant] = useState<BadgeVariant>('filled')
  const [demoColor, setDemoColor] = useState<BadgeColor>('neutral')
  const [demoSize, setDemoSize] = useState<BadgeSize>('sm')
  const [demoShowIcon, setDemoShowIcon] = useState(false)

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
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

  return (
    <StyleguideLayout
      title="Badge"
      description="Badges are small status indicators used for labels, categories, and tags. They support multiple variants and semantic colors."
      activeId="badge"
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
import { Badge } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { Badge } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Experiment with badge properties to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <Badge
                        variant={demoVariant}
                        color={demoColor}
                        size={demoSize}
                        icon={demoShowIcon ? getIconForColor(demoColor) : undefined}
                      >
                        {demoColor === 'success' ? 'Verified' :
                         demoColor === 'error' ? 'Error' :
                         demoColor === 'warning' ? 'Warning' :
                         demoColor === 'info' ? 'Info' :
                         demoColor === 'brand' ? 'New' : 'Label'}
                      </Badge>
                    }
                    code={`<Badge
  variant="${demoVariant}"
  color="${demoColor}"
  size="${demoSize}"${demoShowIcon ? `
  icon={<IconCheck size={12} />}` : ''}
>
  Label
</Badge>`}
                    previewPadding="56px 24px"
                    previewBackground={colors.surface.paper}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Variant */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Variant
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                    </div>

                    {/* Color */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Color
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                    </div>

                    {/* Size */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Size
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                    </div>

                    {/* Icon Toggle */}
                    <StyledCheckbox
                      checked={demoShowIcon}
                      onChange={setDemoShowIcon}
                      label="Show Icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Size Specifications</h3>
              <SpecTable
                headers={['Size', 'Token', 'Padding Y', 'Padding X', 'Font Size', 'Icon Size']}
                rows={[
                  [
                    'sm',
                    <CopyableToken key="sm-py" token="spacing.1" />,
                    <PixelValue key="sm-pyv" value="2px" />,
                    <PixelValue key="sm-pxv" value="8px" />,
                    <PixelValue key="sm-fs" value="12px" />,
                    <PixelValue key="sm-is" value="12px" />,
                  ],
                  [
                    'md',
                    <CopyableToken key="md-py" token="spacing.2" />,
                    <PixelValue key="md-pyv" value="4px" />,
                    <PixelValue key="md-pxv" value="10px" />,
                    <PixelValue key="md-fs" value="14px" />,
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
              <h3 style={sharedStyles.cardTitle}>Border Radius</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Badge Radius', <CopyableToken key="br" token="borderRadius.full" />, <PixelValue key="brv" value="9999px" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Variant Styles</h3>
              <SpecTable
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
                headers={['Color', 'Filled BG Token', 'Subtle BG Token', 'Text on Filled']}
                rows={[
                  ['neutral', <CopyableToken key="n-bg" token="#757575" />, <CopyableToken key="n-sbg" token="#F5F5F5" />, <PixelValue key="n-txt" value="#FFFFFF" />],
                  ['success', <CopyableToken key="s-bg" token="colors.semantic.success.main" />, <CopyableToken key="s-sbg" token="colors.semantic.success.light" />, <PixelValue key="s-txt" value="#FFFFFF" />],
                  ['warning', <CopyableToken key="w-bg" token="colors.semantic.warning.main" />, <CopyableToken key="w-sbg" token="colors.semantic.warning.light" />, <PixelValue key="w-txt" value="#000000" />],
                  ['error', <CopyableToken key="e-bg" token="colors.semantic.error.main" />, <CopyableToken key="e-sbg" token="colors.semantic.error.light" />, <PixelValue key="e-txt" value="#FFFFFF" />],
                  ['info', <CopyableToken key="i-bg" token="colors.semantic.info.main" />, <CopyableToken key="i-sbg" token="colors.semantic.info.light" />, <PixelValue key="i-txt" value="#FFFFFF" />],
                  ['brand', <CopyableToken key="b-bg" token="colors.brand.primary" />, <CopyableToken key="b-sbg" token="colors.primary[50]" />, <PixelValue key="b-txt" value="#FFFFFF" />],
                ]}
              />
            </div>
            </CollapsibleSection>
          </section>

          {/* ========== USE CASES ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Common Use Cases</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Status Indicators</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Badge variant="subtle" color="success">Installed</Badge>
                <Badge variant="outlined" color="neutral">Uninstalled</Badge>
                <Badge variant="subtle" color="info">Update Available</Badge>
                <Badge variant="subtle" color="error">Deprecated</Badge>
              </div>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Categories & Tags</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Badge variant="outlined" color="neutral">Compliance</Badge>
                <Badge variant="outlined" color="neutral">Analytics</Badge>
                <Badge variant="outlined" color="neutral">Integration</Badge>
                <Badge variant="outlined" color="neutral">Reporting</Badge>
              </div>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Verification</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Badge variant="subtle" color="success" icon={<IconCheck size={12} />}>
                  Verified Application
                </Badge>
                <Badge variant="filled" color="brand">Official</Badge>
              </div>
            </div>
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
              <CodeBlock>
{`import { Badge } from '@/components'
import type { BadgeProps, BadgeVariant, BadgeColor, BadgeSize } from '@/components'`}
              </CodeBlock>
            </div>

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
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="v">variant</code>, <code key="vt">'filled' | 'outlined' | 'subtle'</code>, <code key="vd">'filled'</code>, 'Visual style'],
                  [<code key="c">color</code>, <code key="ct">'neutral' | 'success' | 'warning' | 'error' | 'info' | 'brand'</code>, <code key="cd">'neutral'</code>, 'Semantic color'],
                  [<code key="s">size</code>, <code key="st">'sm' | 'md'</code>, <code key="sd">'sm'</code>, 'Badge size'],
                  [<code key="i">icon</code>, <code key="it">ReactNode</code>, '-', 'Optional leading icon'],
                  [<code key="ch">children</code>, <code key="cht">ReactNode</code>, 'required', 'Badge content'],
                ]}
              />
            </div>
          </section>

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
          </section>
        </>
      )}
    </StyleguideLayout>
  )
}
