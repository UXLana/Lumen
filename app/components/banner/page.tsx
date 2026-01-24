'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton } from '../../design-system/shared'
import { Banner, BannerVariant, BannerSurface, BannerButtonAlignment } from '@/components'
import { colors, typography, spacing, borderRadius, bannerIcon } from '@/styles/design-tokens'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

type PageTab = 'overview' | 'implementation'
type ButtonOption = 'none' | 'one' | 'both'

export default function BannerPage() {
  const variants: BannerVariant[] = ['info', 'success', 'warning', 'error']
  const surfaces: BannerSurface[] = ['color', 'light']
  const buttonAlignments: BannerButtonAlignment[] = ['side', 'below']
  const buttonOptions: { value: ButtonOption; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'one', label: '1 Button' },
    { value: 'both', label: '2 Buttons' },
  ]

  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive state for property manipulation
  const [demoVariant, setDemoVariant] = useState<BannerVariant>('info')
  const [demoSurface, setDemoSurface] = useState<BannerSurface>('color')
  const [demoButtonAlignment, setDemoButtonAlignment] = useState<BannerButtonAlignment>('side')
  const [demoButtonOption, setDemoButtonOption] = useState<ButtonOption>('both')
  const [demoTitle, setDemoTitle] = useState('Example text')
  const [demoMessage, setDemoMessage] = useState('')
  const [demoDismissible, setDemoDismissible] = useState(false)
  const [demoOnDark, setDemoOnDark] = useState(false)

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
  ]

  // Generate action props based on button option
  // Note: onClick handlers are intentionally empty for playground demonstration
  const getActionProps = () => {
    if (demoButtonOption === 'none') {
      return {}
    }
    if (demoButtonOption === 'one') {
      return {
        primaryAction: {
          label: 'Button',
          onClick: () => { /* Playground demo - no action */ },
        },
      }
    }
    // both
    return {
      primaryAction: {
        label: 'Button',
        onClick: () => { /* Playground demo - no action */ },
      },
      secondaryAction: {
        label: 'Button',
        onClick: () => { /* Playground demo - no action */ },
      },
    }
  }

  // Generate code string based on current settings
  const generateCode = () => {
    const lines = ['<Banner']
    lines.push(`  variant="${demoVariant}"`)
    if (demoSurface !== 'color') lines.push(`  surface="${demoSurface}"`)
    if (demoButtonAlignment !== 'side') lines.push(`  buttonAlignment="${demoButtonAlignment}"`)
    // Escape quotes in title to generate valid JSX
    if (demoTitle) lines.push(`  title="${demoTitle.replace(/"/g, '\\"')}"`)
    if (demoOnDark) lines.push('  onDark={true}')
    if (demoDismissible) lines.push('  dismissible={true}')

    if (demoButtonOption === 'one') {
      lines.push('  primaryAction={{ label: "Button", onClick: () => {} }}')
    } else if (demoButtonOption === 'both') {
      lines.push('  primaryAction={{ label: "Button", onClick: () => {} }}')
      lines.push('  secondaryAction={{ label: "Button", onClick: () => {} }}')
    }

    // Escape special characters in message for valid JSX
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
      description="Banners communicate important information and actions to users. They appear at the top of content areas and can include actions or be dismissible."
      activeId="banner"
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
              <CodeBlock>{`import { Banner } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Manipulate banner properties in real-time to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: spacing[12] }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <div style={{
                        width: '100%',
                        padding: demoOnDark ? spacing[4] : '0',
                        background: demoOnDark ? colors.brand.primary : 'transparent',
                        borderRadius: demoOnDark ? borderRadius.md : undefined,
                        boxSizing: 'border-box',
                      }}>
                        <Banner
                          variant={demoVariant}
                          surface={demoSurface}
                          buttonAlignment={demoButtonAlignment}
                          title={demoTitle || undefined}
                          dismissible={demoDismissible}
                          onDark={demoOnDark}
                          {...getActionProps()}
                        >
                          {demoMessage || undefined}
                        </Banner>
                      </div>
                    }
                    code={generateCode()}
                    previewPadding={`${spacing[14]} ${spacing[6]}`}
                    previewMinHeight="168px"
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

                    {/* Surface */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Surface
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {surfaces.map(s => (
                          <PillButton
                            key={s}
                            onClick={() => setDemoSurface(s)}
                            isActive={demoSurface === s}
                          >
                            {s}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Button Alignment */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Button Alignment
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {buttonAlignments.map(a => (
                          <PillButton
                            key={a}
                            onClick={() => setDemoButtonAlignment(a)}
                            isActive={demoButtonAlignment === a}
                          >
                            {a}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Buttons
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {buttonOptions.map(opt => (
                          <PillButton
                            key={opt.value}
                            onClick={() => setDemoButtonOption(opt.value)}
                            isActive={demoButtonOption === opt.value}
                          >
                            {opt.label}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Title
                      </label>
                      <input
                        type="text"
                        value={demoTitle}
                        onChange={(e) => setDemoTitle(e.target.value)}
                        style={{
                          width: '100%',
                          padding: spacing[2],
                          border: `1px solid ${colors.border.light}`,
                          borderRadius: borderRadius.sm,
                          boxSizing: 'border-box',
                          ...typography.body.sm,
                        }}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Description (optional)
                      </label>
                      <textarea
                        value={demoMessage}
                        onChange={(e) => setDemoMessage(e.target.value)}
                        rows={2}
                        placeholder="Add a description..."
                        style={{
                          width: '100%',
                          padding: spacing[2],
                          border: `1px solid ${colors.border.light}`,
                          borderRadius: borderRadius.sm,
                          boxSizing: 'border-box',
                          ...typography.body.sm,
                          resize: 'vertical',
                        }}
                      />
                    </div>

                    {/* Toggles */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { label: 'Dismissible', value: demoDismissible, setter: setDemoDismissible },
                        { label: 'On Dark Background', value: demoOnDark, setter: setDemoOnDark },
                      ].map(({ label, value, setter }) => (
                        <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setter(e.target.checked)}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span style={{ ...typography.label.sm }}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>
            <p style={sharedStyles.sectionDescription}>
              Typography, spacing, and border values used in the banner component.
            </p>

            {/* Typography Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography Tokens</h3>
              <SpecTable
                headers={['Element', 'Font Size', 'Line Height', 'Font Weight']}
                rows={[
                  ['Title', '16px', '24px', 'Regular (400)'],
                  ['Description', '16px', '24px', 'Regular (400)'],
                  ['Button', '14px', '20px', 'Medium (500)'],
                ]}
              />
            </div>

            {/* Spacing Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Spacing & Size Tokens</h3>
              <SpecTable
                headers={['Element', 'Value', 'Description']}
                rows={[
                  ['Banner Height (side)', '56px', 'Fixed height for side button alignment'],
                  ['Banner Height (below)', 'auto (min 100px)', 'Flexible height for below button alignment'],
                  ['Icon Container', '40px × 40px', 'Container with 16px border radius'],
                  ['Icon Size', '24px', 'Icon inside container'],
                  ['Left Padding', '56px', '8px + 40px icon + 8px gap'],
                ]}
              />
            </div>

            {/* Border Radius & Outline */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Border Radius & Outline</h3>
              <div style={{ display: 'flex', gap: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '120px',
                    height: '60px',
                    background: '#EBEFFF',
                    borderRadius: '16px',
                    border: '2px solid rgba(209, 217, 255, 0.6)',
                  }} />
                  <div>
                    <div style={{ ...typography.label.md }}>Banner</div>
                    <code style={{ ...typography.code.sm }}>16px radius, 2px outline @ 60%</code>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: bannerIcon.variants.information.background,
                    borderRadius: '16px',
                  }} />
                  <div>
                    <div style={{ ...typography.label.md }}>Icon Container</div>
                    <code style={{ ...typography.code.sm }}>16px</code>
                  </div>
                </div>
              </div>
            </div>
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
{`import { Banner } from '@/components'
import type { BannerProps, BannerVariant, BannerSurface, BannerButtonAlignment } from '@/components'`}
              </CodeBlock>
            </div>

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
{`// Single action
<Banner
  variant="info"
  title="New features available"
  primaryAction={{ label: "Learn More", onClick: () => {} }}
/>

// Two actions
<Banner
  variant="warning"
  title="Subscription Expiring"
  primaryAction={{ label: "Renew Now", onClick: () => {} }}
  secondaryAction={{ label: "Remind Later", onClick: () => {} }}
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Surface Variants</h3>
              <CodeBlock>
{`// Color surface (default) - themed background
<Banner variant="info" surface="color" title="Color surface" />

// Light surface - white background
<Banner variant="info" surface="light" title="Light surface" />`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Button Alignment</h3>
              <CodeBlock>
{`// Side alignment (default) - buttons on the right
<Banner
  variant="info"
  buttonAlignment="side"
  title="Side aligned buttons"
  primaryAction={{ label: "Action", onClick: () => {} }}
/>

// Below alignment - buttons below the content
<Banner
  variant="info"
  buttonAlignment="below"
  title="Below aligned buttons"
  primaryAction={{ label: "Action", onClick: () => {} }}
/>`}
              </CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Banner Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code>variant</code>, <code>'info' | 'success' | 'warning' | 'error'</code>, <code>'info'</code>, 'Semantic variant'],
                  [<code>surface</code>, <code>'color' | 'light'</code>, <code>'color'</code>, 'Background surface type'],
                  [<code>buttonAlignment</code>, <code>'side' | 'below'</code>, <code>'side'</code>, 'Button position'],
                  [<code>title</code>, <code>string</code>, '-', 'Main heading text'],
                  [<code>children</code>, <code>ReactNode</code>, '-', 'Description content'],
                  [<code>primaryAction</code>, <code>{'{ label: string; onClick: () => void }'}</code>, '-', 'Primary action button'],
                  [<code>secondaryAction</code>, <code>{'{ label: string; onClick: () => void }'}</code>, '-', 'Secondary action button'],
                  [<code>dismissible</code>, <code>boolean</code>, <code>false</code>, 'Show dismiss button'],
                  [<code>onDismiss</code>, <code>{'() => void'}</code>, '-', 'Dismiss callback'],
                  [<code>onDark</code>, <code>boolean</code>, <code>false</code>, 'Display on dark background'],
                ]}
              />
            </div>
          </section>

          {/* ========== DESIGN GUIDANCE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use Each Variant</h3>
              <SpecTable
                headers={['Variant', 'Usage', 'Examples']}
                rows={[
                  [<code>info</code>, 'Neutral information, tips, or announcements', 'New features, general updates, helpful tips'],
                  [<code>success</code>, 'Successful completion of an action', 'Data saved, upload complete, action confirmed'],
                  [<code>warning</code>, 'Important but non-critical warnings', 'Subscription expiring, approaching limits, recommendations'],
                  [<code>error</code>, 'Errors or critical issues requiring attention', 'Failed operations, connection errors, validation failures'],
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
                  ['Make dismissible for non-critical messages', 'Make critical error banners dismissible'],
                  ['Use consistent placement (top of content)', 'Scatter banners throughout the page'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <SpecTable
                headers={['Feature', 'Implementation']}
                rows={[
                  ['Role', 'role="alert" for dynamic banners'],
                  ['Live Region', 'aria-live="polite" for announcements'],
                  ['Dismiss Button', 'Includes aria-label="Dismiss"'],
                  ['Color Contrast', 'All text meets WCAG AA standards'],
                  ['Icons', 'Semantic meaning conveyed through text, not just icons'],
                ]}
              />
            </div>
          </section>
        </>
      )}
    </StyleguideLayout>
  )
}
