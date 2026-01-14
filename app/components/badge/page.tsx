'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton } from '../../design-system/shared'
import { Badge, BadgeVariant, BadgeColor, BadgeSize } from '@/components'
import { IconCheck, IconAlertCircle, IconInfo } from '@/components/Icons'
import { colors, typography } from '@/styles/design-tokens'

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
                    previewBackground={colors.neutral[50]}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={demoShowIcon}
                        onChange={(e) => setDemoShowIcon(e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span style={{ ...typography.label.sm }}>Show Icon</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== VARIANTS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Variants</h2>
            <p style={sharedStyles.sectionDescription}>
              Badges come in three visual variants: filled, outlined, and subtle.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Filled</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                High emphasis, solid background. Use for primary status indicators.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {badgeColors.map(color => (
                  <Badge key={color} variant="filled" color={color}>
                    {color}
                  </Badge>
                ))}
              </div>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Outlined</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                Medium emphasis, border only. Use for secondary status or categories.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {badgeColors.map(color => (
                  <Badge key={color} variant="outlined" color={color}>
                    {color}
                  </Badge>
                ))}
              </div>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Subtle</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                Low emphasis, tinted background. Use for tags and filters.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {badgeColors.map(color => (
                  <Badge key={color} variant="subtle" color={color}>
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
          </section>

          {/* ========== WITH ICONS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>With Icons</h2>
            <p style={sharedStyles.sectionDescription}>
              Badges can include leading icons for additional context.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Badge variant="subtle" color="success" icon={<IconCheck size={12} />}>
                  Verified
                </Badge>
                <Badge variant="outlined" color="neutral" icon={<IconInfo size={12} />}>
                  Pending
                </Badge>
                <Badge variant="subtle" color="error" icon={<IconAlertCircle size={12} />}>
                  Failed
                </Badge>
                <Badge variant="subtle" color="warning" icon={<IconAlertCircle size={12} />}>
                  Warning
                </Badge>
              </div>
            </div>
          </section>

          {/* ========== SIZES ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Sizes</h2>
            <p style={sharedStyles.sectionDescription}>
              Two sizes available for different contexts.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Badge variant="filled" color="brand" size="sm">Small</Badge>
                <Badge variant="filled" color="brand" size="md">Medium</Badge>
              </div>
            </div>
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
