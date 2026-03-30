'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { Banner, BannerVariant, BannerSurface, BannerButtonAlignment } from '@/components'
import { colors, typography, spacing, borderRadius, bannerIcon, banner } from '@/styles/design-tokens'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'
type ButtonOption = 'none' | 'one' | 'both'

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
    { name: 'dismissible', type: 'boolean', description: 'Whether banner can be dismissed' },
    { name: 'onDismiss', type: '() => void', description: 'Dismiss callback' },
    { name: 'primaryAction', type: '{ label: string; onClick: () => void }', description: 'Primary action button' },
    { name: 'secondaryAction', type: '{ label: string; onClick: () => void }', description: 'Secondary action button' },
    { name: 'onDark', type: 'boolean', description: 'Display on dark background' },
    { name: 'className', type: 'string', description: 'Additional CSS class' },
    { name: 'style', type: 'CSSProperties', description: 'Additional inline styles' },
  ],
  typeDefinitions: [
    { name: 'BannerVariant', definition: "type BannerVariant = 'info' | 'success' | 'warning' | 'error'" },
    { name: 'BannerSize', definition: "type BannerSize = 'md' | 'lg'" },
    { name: 'BannerStyle', definition: "type BannerStyle = 'inline'" },
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
}

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
    { id: 'documentation', label: 'Documentation' },
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
              <CodeBlock>{`// Package import
import { Banner } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { Banner } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Manipulate banner properties in real-time to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: spacing['4xl'] }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <div style={{
                        width: '100%',
                        padding: demoOnDark ? spacing.md : '0',
                        background: demoOnDark ? colors.brand.default : 'transparent',
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
                    previewPadding={`56px ${spacing.xl}`}
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
                          padding: spacing.xs,
                          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
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
                          padding: spacing.xs,
                          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                          borderRadius: borderRadius.sm,
                          boxSizing: 'border-box',
                          ...typography.body.sm,
                          resize: 'vertical',
                        }}
                      />
                    </div>

                    {/* Toggles */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <StyledCheckbox
                        checked={demoDismissible}
                        onChange={setDemoDismissible}
                        label="Dismissible"
                      />
                      <StyledCheckbox
                        checked={demoOnDark}
                        onChange={setDemoOnDark}
                        label="On Dark Background"
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
                Typography, spacing, and border values used in the banner component.
              </p>

              {/* Typography Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography Tokens</h3>
              <SpecTable
                headers={['Element', 'Token', 'Font Size', 'Line Height', 'Font Weight']}
                rows={[
                  ['Title', <CopyableToken key="t-tok" token="banner.typography.title" />, <PixelValue key="t-fs" value="16px" />, <PixelValue key="t-lh" value="24px" />, <PixelValue key="t-fw" value="400" />],
                  ['Description', <CopyableToken key="d-tok" token="banner.typography.message" />, <PixelValue key="d-fs" value="16px" />, <PixelValue key="d-lh" value="24px" />, <PixelValue key="d-fw" value="400" />],
                  ['Button', <CopyableToken key="b-tok" token="banner.button.typography" />, <PixelValue key="b-fs" value="14px" />, <PixelValue key="b-lh" value="20px" />, <PixelValue key="b-fw" value="500" />],
                ]}
              />
            </div>

            {/* Spacing Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Spacing & Size Tokens</h3>
              <SpecTable
                headers={['Element', 'Token', 'Value', 'Description']}
                rows={[
                  ['Banner Height (side)', <CopyableToken key="hs" token="banner.sizing.minHeight.side" />, <PixelValue key="hsv" value="56px" />, 'Fixed height for side button alignment'],
                  ['Banner Height (below)', <CopyableToken key="hb" token="banner.sizing.minHeight.below" />, <PixelValue key="hbv" value="100px" />, 'Min height for below button alignment'],
                  ['Padding', <CopyableToken key="p" token="banner.padding" />, <PixelValue key="pv" value="8px" />, 'Internal padding'],
                  ['Icon Container', <CopyableToken key="ic" token="bannerIcon.sizing.container" />, <PixelValue key="icv" value="40px" />, 'Icon container size'],
                  ['Icon Size', <CopyableToken key="is" token="bannerIcon.sizing.icon" />, <PixelValue key="isv" value="24px" />, 'Icon inside container'],
                  ['Content Gap', <CopyableToken key="cg" token="banner.spacing.contentGap" />, <PixelValue key="cgv" value="8px" />, 'Gap between icon and content'],
                ]}
              />
            </div>

            {/* Border Radius & Outline */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Border Radius & Outline</h3>
              <SpecTable
                headers={['Element', 'Token', 'Value']}
                rows={[
                  ['Banner Radius', <CopyableToken key="br" token="banner.borderRadius" />, <PixelValue key="brv" value="16px" />],
                  ['Icon Container Radius', <CopyableToken key="icr" token="bannerIcon.borderRadius" />, <PixelValue key="icrv" value="16px" />],
                  ['Outline Width', <CopyableToken key="ow" token="banner.outline.width" />, <PixelValue key="owv" value="2px" />],
                  ['Outline Opacity', <CopyableToken key="oo" token="banner.outline.opacity" />, <PixelValue key="oov" value="0.6" />],
                ]}
              />
            </div>

            {/* Color Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Color Tokens (Color Surface)</h3>
              <SpecTable
                headers={['Variant', 'Background Token', 'Icon BG Token', 'Icon Color Token']}
                rows={[
                  ['info', <CopyableToken key="i-bg" token="banner.variants.info.color.background" />, <CopyableToken key="i-ibg" token="bannerIcon.variants.information.background" />, <CopyableToken key="i-ic" token="bannerIcon.variants.information.iconColor" />],
                  ['success', <CopyableToken key="s-bg" token="banner.variants.success.color.background" />, <CopyableToken key="s-ibg" token="bannerIcon.variants.success.background" />, <CopyableToken key="s-ic" token="bannerIcon.variants.success.iconColor" />],
                  ['warning', <CopyableToken key="w-bg" token="banner.variants.warning.color.background" />, <CopyableToken key="w-ibg" token="bannerIcon.variants.warning.background" />, <CopyableToken key="w-ic" token="bannerIcon.variants.warning.iconColor" />],
                  ['error', <CopyableToken key="e-bg" token="banner.variants.error.color.background" />, <CopyableToken key="e-ibg" token="bannerIcon.variants.error.background" />, <CopyableToken key="e-ic" token="bannerIcon.variants.error.iconColor" />],
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

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={bannerDocData} />
      )}
    </StyleguideLayout>
  )
}
