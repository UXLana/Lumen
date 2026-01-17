'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton } from '../../design-system/shared'
import { Banner, BannerVariant, BannerSize, Button } from '@/components'
import { colors, typography, spacing, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

type PageTab = 'overview' | 'implementation'

export default function BannerPage() {
  const variants: BannerVariant[] = ['info', 'success', 'warning', 'error']
  const sizes: BannerSize[] = ['md', 'lg']

  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive state for property manipulation
  const [demoVariant, setDemoVariant] = useState<BannerVariant>('info')
  const [demoSize, setDemoSize] = useState<BannerSize>('md')
  const [demoTitle, setDemoTitle] = useState('Important Information')
  const [demoMessage, setDemoMessage] = useState('This is a banner message that provides context to the user.')
  const [demoDismissible, setDemoDismissible] = useState(false)
  const [demoActions, setDemoActions] = useState(false)

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
  ]

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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <Banner
                        variant={demoVariant}
                        size={demoSize}
                        title={demoTitle || undefined}
                        dismissible={demoDismissible}
                        actions={demoActions ? (
                          <>
                            <Button size="md" emphasis="low">Secondary</Button>
                            <Button size="md" emphasis="high">Primary</Button>
                          </>
                        ) : undefined}
                      >
                        {demoMessage || undefined}
                      </Banner>
                    }
                    code={`<Banner
  variant="${demoVariant}"
  size="${demoSize}"${demoTitle ? `\n  title="${demoTitle}"` : ''}${demoDismissible ? '\n  dismissible' : ''}${demoActions ? '\n  actions={<>\n    <Button size="md" emphasis="low">Secondary</Button>\n    <Button size="md" emphasis="high">Primary</Button>\n  </>}' : ''}
>${demoMessage ? `\n  ${demoMessage}\n` : ''}</Banner>`}
                    previewPadding="32px"
                    previewMinHeight="120px"
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

                    {/* Size */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Size
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
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
                          ...typography.body.sm,
                        }}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Message
                      </label>
                      <textarea
                        value={demoMessage}
                        onChange={(e) => setDemoMessage(e.target.value)}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: spacing[2],
                          border: `1px solid ${colors.border.light}`,
                          borderRadius: borderRadius.sm,
                          ...typography.body.sm,
                          resize: 'vertical',
                        }}
                      />
                    </div>

                    {/* Toggles */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { label: 'Dismissible', value: demoDismissible, setter: setDemoDismissible },
                        { label: 'Show Actions', value: demoActions, setter: setDemoActions },
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

          {/* Preview */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Preview</h2>
            <p style={sharedStyles.sectionDescription}>
              Banners come in four semantic variants (info, success, warning, error) with 2px borders,
              supporting titles, descriptions, actions, and optional dismiss functionality.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Banner variant="info" title="New Features Available">
                  We've added new reporting capabilities to your dashboard. Check them out!
                </Banner>
                <Banner variant="success" title="Changes Saved">
                  Your profile has been updated successfully.
                </Banner>
                <Banner variant="warning" title="Action Required">
                  Your subscription will expire in 7 days. Please update your payment method.
                </Banner>
                <Banner variant="error" title="Connection Error">
                  Unable to connect to the server. Please check your internet connection.
                </Banner>
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS PREVIEW ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>
            <p style={sharedStyles.sectionDescription}>
              Color tokens, typography, spacing, and border values used in the banner component.
            </p>

            {/* Color Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Color Tokens by Variant</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                {variants.map((variant) => {
                  const bgColor = colors.semantic[variant].light
                  const borderColor = colors.semantic[variant].main
                  const iconColor = variant === 'warning' ? colors.semantic[variant].dark : colors.semantic[variant].main

                  return (
                    <div key={variant}>
                      <h4 style={{ ...typography.label.md, marginBottom: '12px', textTransform: 'capitalize' }}>
                        {variant}
                      </h4>
                      {/* Background */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          background: bgColor,
                          border: '1px solid rgba(0,0,0,0.1)',
                        }} />
                        <div>
                          <div style={{ ...typography.label.sm }}>Background</div>
                          <div style={{ ...typography.code.sm, fontSize: '10px', color: colors.text.mediumEmphasis }}>
                            {bgColor}
                          </div>
                        </div>
                      </div>
                      {/* Border */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          background: borderColor,
                          border: '1px solid rgba(0,0,0,0.1)',
                        }} />
                        <div>
                          <div style={{ ...typography.label.sm }}>Border (2px)</div>
                          <div style={{ ...typography.code.sm, fontSize: '10px', color: colors.text.mediumEmphasis }}>
                            {borderColor}
                          </div>
                        </div>
                      </div>
                      {/* Icon */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          background: iconColor,
                          border: '1px solid rgba(0,0,0,0.1)',
                        }} />
                        <div>
                          <div style={{ ...typography.label.sm }}>Icon</div>
                          <div style={{ ...typography.code.sm, fontSize: '10px', color: colors.text.mediumEmphasis }}>
                            {iconColor}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Typography Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography Tokens</h3>
              <SpecTable
                headers={['Element', 'Size MD', 'Size LG', 'Font Weight']}
                rows={[
                  [
                    'Title',
                    `${typography.label.md.fontSize} / ${typography.label.md.lineHeight}`,
                    `${typography.label.lg.fontSize} / ${typography.label.lg.lineHeight}`,
                    'Medium (500)',
                  ],
                  [
                    'Description',
                    `${typography.body.sm.fontSize} / ${typography.body.sm.lineHeight}`,
                    `${typography.body.md.fontSize} / ${typography.body.md.lineHeight}`,
                    'Regular (400)',
                  ],
                ]}
              />
            </div>

            {/* Spacing Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Spacing Tokens</h3>
              <SpecTable
                headers={['Size', 'Padding', 'Gap', 'Border Width']}
                rows={[
                  ['md', `${spacing[3]} ${spacing[4]} (12px 16px)`, spacing[3] + ' (12px)', '2px'],
                  ['lg', `${spacing[4]} ${spacing[5]} (16px 20px)`, spacing[4] + ' (16px)', '2px'],
                ]}
              />
            </div>

            {/* Border Radius */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Border Radius</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '120px',
                  height: '60px',
                  background: colors.semantic.info.light,
                  border: `2px solid ${colors.semantic.info.main}`,
                  borderRadius: borderRadius.md,
                }} />
                <div>
                  <div style={{ ...typography.label.md }}>Medium Radius</div>
                  <code style={{ ...typography.code.sm }}>{borderRadius.md}</code>
                </div>
              </div>
            </div>
          </section>

          {/* ========== ALL VARIANTS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>All Variants</h2>
            <p style={sharedStyles.sectionDescription}>
              All banner variants and sizes displayed for visual comparison.
            </p>

            {/* Size Variations */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Size Variations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sizes.map(size => (
                  <div key={size}>
                    <p style={{ ...typography.label.sm, color: colors.text.mediumEmphasis, marginBottom: '8px' }}>
                      Size: {size.toUpperCase()}
                    </p>
                    <Banner
                      variant="info"
                      size={size}
                      title="Banner Title"
                    >
                      This is a {size} size banner with a description message.
                    </Banner>
                  </div>
                ))}
              </div>
            </div>

            {/* Variant Demonstrations */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Semantic Variants</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                Each variant uses semantic colors with 2px borders for clear visual distinction.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {variants.map(variant => (
                  <Banner
                    key={variant}
                    variant={variant}
                    title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Message`}
                  >
                    This is a {variant} banner showing important information to the user.
                  </Banner>
                ))}
              </div>
            </div>

            {/* Content Variations */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Content Variations</h3>

              <p style={{ ...typography.label.sm, marginBottom: '8px', marginTop: '16px' }}>Title Only</p>
              <Banner variant="info" title="Simple notification without description" />

              <p style={{ ...typography.label.sm, marginBottom: '8px', marginTop: '16px' }}>Description Only</p>
              <Banner variant="success">
                This banner has a description without a title.
              </Banner>

              <p style={{ ...typography.label.sm, marginBottom: '8px', marginTop: '16px' }}>Title + Description</p>
              <Banner variant="warning" title="Storage Almost Full">
                You've used 95% of your available storage space. Consider upgrading your plan.
              </Banner>

              <p style={{ ...typography.label.sm, marginBottom: '8px', marginTop: '16px' }}>Long Content</p>
              <Banner variant="error" title="Multiple Issues Detected">
                We've detected several issues that require your attention: Your password will expire in 3 days,
                your payment method needs updating, and there are pending security updates for your account.
                Please review these items at your earliest convenience.
              </Banner>
            </div>
          </section>

          {/* ========== DISMISSIBLE BANNERS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Dismissible Banners</h2>
            <p style={sharedStyles.sectionDescription}>
              Banners can include a dismiss button for non-critical messages.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {variants.map(variant => (
                  <Banner
                    key={variant}
                    variant={variant}
                    title="Dismissible Banner"
                    dismissible
                  >
                    Click the X button to dismiss this banner.
                  </Banner>
                ))}
              </div>
            </div>
          </section>

          {/* ========== WITH ACTIONS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Banners with Actions</h2>
            <p style={sharedStyles.sectionDescription}>
              Banners can include action buttons for user interaction.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Banner
                  variant="info"
                  title="New Features Available"
                  actions={
                    <>
                      <Button size="md" emphasis="low">Learn More</Button>
                      <Button size="md" emphasis="high">Try Now</Button>
                    </>
                  }
                >
                  We've added new reporting capabilities to help you track your progress.
                </Banner>

                <Banner
                  variant="warning"
                  title="Subscription Expiring Soon"
                  dismissible
                  actions={
                    <Button size="md" emphasis="high">Renew Now</Button>
                  }
                >
                  Your subscription will expire in 7 days. Renew now to avoid service interruption.
                </Banner>

                <Banner
                  variant="error"
                  title="Action Required"
                  actions={
                    <>
                      <Button size="md" emphasis="high">Fix Issues</Button>
                      <Button size="md" emphasis="low">Remind Me Later</Button>
                    </>
                  }
                >
                  There are critical security updates that need your attention.
                </Banner>
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
import type { BannerProps, BannerVariant, BannerSize } from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`// Informational banner
<Banner variant="info" title="New Feature">
  Check out our new dashboard!
</Banner>

// Success banner
<Banner variant="success" title="Saved Successfully">
  Your changes have been saved.
</Banner>

// Warning banner
<Banner variant="warning" title="Action Required">
  Please update your payment method.
</Banner>

// Error banner
<Banner variant="error" title="Connection Error">
  Unable to reach the server.
</Banner>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Dismissible Banner</h3>
              <CodeBlock>
{`<Banner
  variant="info"
  title="New Features"
  dismissible
  onDismiss={() => console.log('Banner dismissed')}
>
  We've added new reporting capabilities.
</Banner>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With Actions</h3>
              <CodeBlock>
{`<Banner
  variant="warning"
  title="Subscription Expiring"
  actions={
    <>
      <Button size="md" emphasis="low">Remind Later</Button>
      <Button size="md" emphasis="high">Renew Now</Button>
    </>
  }
>
  Your subscription expires in 7 days.
</Banner>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Size Variants</h3>
              <CodeBlock>
{`// Medium (default)
<Banner variant="info" size="md" title="Medium Banner">
  Standard size for most use cases.
</Banner>

// Large
<Banner variant="success" size="lg" title="Large Banner">
  Larger size for more prominent messages.
</Banner>`}
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
                  [<code>size</code>, <code>'md' | 'lg'</code>, <code>'md'</code>, 'Size of the banner'],
                  [<code>title</code>, <code>string</code>, '-', 'Main heading text'],
                  [<code>children</code>, <code>ReactNode</code>, '-', 'Description content'],
                  [<code>icon</code>, <code>ReactNode</code>, '-', 'Custom icon (overrides default)'],
                  [<code>dismissible</code>, <code>boolean</code>, <code>false</code>, 'Show dismiss button'],
                  [<code>onDismiss</code>, <code>{'() => void'}</code>, '-', 'Dismiss callback'],
                  [<code>actions</code>, <code>ReactNode</code>, '-', 'Action buttons'],
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
              <h3 style={sharedStyles.cardTitle}>When to Use Each Size</h3>
              <SpecTable
                headers={['Size', 'Usage']}
                rows={[
                  [<code>md</code>, 'Default size for most banners, inline with content'],
                  [<code>lg</code>, 'Page-level banners, critical announcements, hero areas'],
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
                  ['Ensure 2px border for visual clarity', 'Use thin or missing borders'],
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
