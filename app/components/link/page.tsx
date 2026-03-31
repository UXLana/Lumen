'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox as StyledCheckboxControl, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { Link } from '@/components'
import { colors, spacing, typography } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

const linkDocData: ComponentDocData = {
  displayName: 'Link',
  importPath: '@/components',
  importStatement: `import { Link } from '@/components'\nimport type { LinkProps } from '@/components'`,
  description: 'Links navigate users to other pages or resources with appropriate visual treatment.',
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Link text size' },
    { name: 'variant', type: "'default' | 'subtle' | 'inverted'", default: "'default'", description: 'Visual variant' },
    { name: 'external', type: 'boolean', description: 'Show external link icon' },
    { name: 'disabled', type: 'boolean', description: 'Disable the link' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Link content' },
    { name: 'href', type: 'string', description: 'Navigation URL' },
  ],
  accessibility: [
    { feature: 'Semantic HTML', description: 'Uses native <a> element for proper semantics and browser behavior.' },
    { feature: 'External Links', description: 'External links include visual icon indicator and target="_blank" with rel="noopener noreferrer".' },
    { feature: 'Focus Ring', description: 'Visible focus outline for keyboard navigation.' },
    { feature: 'Disabled State', description: 'aria-disabled and tabIndex=-1 prevent interaction when disabled.' },
  ],
  tokens: [
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Default link color' },
    { token: 'typography.body.*', value: 'sm/md/lg', usage: 'Link text sizing' },
  ],
  relatedComponents: [
    { name: 'Button', href: '/components/button' },
  ],
  notes: [
    'Use default variant for standard in-content links.',
    'Use subtle variant for secondary or de-emphasized links.',
    'Always indicate external links with the external prop for user awareness.',
  ],
  whenToUse: [
    'Inline text navigation within content (e.g., "View details", "Learn more").',
    'External links that navigate away from the app.',
  ],
  whenNotToUse: [
    { scenario: 'Primary or secondary page actions (submit, save, delete)', instead: 'Button — designed for actions with emphasis levels and states' },
  ],
}

export default function LinkPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoSize, setDemoSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [demoVariant, setDemoVariant] = useState<'default' | 'subtle' | 'inverted'>('default')
  const [demoExternal, setDemoExternal] = useState(false)
  const [demoDisabled, setDemoDisabled] = useState(false)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const previewBg = demoVariant === 'inverted' ? colors.surface.dark : undefined

  return (
    <StyleguideLayout
      title="Link"
      description="Links navigate users to another page, resource, or section. They can be inline within text or standalone."
      activeId="link"
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
              <CodeBlock>{`import { Link } from '@/components'

<Link href="/page">Internal link</Link>
<Link href="https://example.com" external>External link</Link>
<Link href="/page" variant="subtle" size="sm">Subtle link</Link>`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Experiment with link properties to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <div style={{ padding: spacing.md }}>
                        <Link
                          href="#"
                          size={demoSize}
                          variant={demoVariant}
                          external={demoExternal}
                          disabled={demoDisabled}
                          onClick={(e) => e.preventDefault()}
                        >
                          Example link text
                        </Link>
                      </div>
                    }
                    code={`<Link
  href="/destination"${demoSize !== 'md' ? `\n  size="${demoSize}"` : ''}${demoVariant !== 'default' ? `\n  variant="${demoVariant}"` : ''}${demoExternal ? '\n  external' : ''}${demoDisabled ? '\n  disabled' : ''}
>
  Example link text
</Link>`}
                    previewPadding={spacing.xs}
                    previewBackground={previewBg}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Size */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Size
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['sm', 'md', 'lg'] as const).map(s => (
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

                    {/* Variant */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Variant
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['default', 'subtle', 'inverted'] as const).map(v => (
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

                    {/* Options */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Options
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <StyledCheckboxControl checked={demoExternal} onChange={() => setDemoExternal(!demoExternal)} label="External" />
                        <StyledCheckboxControl checked={demoDisabled} onChange={() => setDemoDisabled(!demoDisabled)} label="Disabled" />
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
                Typography, color, and sizing values used in the Link component. Click any token to copy it.
              </p>

              {/* Typography per Size */}
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Typography by Size</h3>
                <SpecTable
                  headers={['Size', 'Font Size', 'Line Height', 'Weight', 'Icon Size']}
                  rows={[
                    [
                      'sm',
                      <TokenValue key="smfs" token="typography.body.xs.fontSize" value={typography.body.xs.fontSize} />,
                      <TokenValue key="smlh" token="typography.body.xs.lineHeight" value={typography.body.xs.lineHeight} />,
                      <TokenValue key="smfw" token="fontWeights.medium" value="500" />,
                      <PixelValue key="smi" value="10px" />,
                    ],
                    [
                      'md',
                      <TokenValue key="mdfs" token="typography.body.sm.fontSize" value={typography.body.sm.fontSize} />,
                      <TokenValue key="mdlh" token="typography.body.sm.lineHeight" value={typography.body.sm.lineHeight} />,
                      <TokenValue key="mdfw" token="fontWeights.medium" value="500" />,
                      <PixelValue key="mdi" value="12px" />,
                    ],
                    [
                      'lg',
                      <TokenValue key="lgfs" token="typography.body.md.fontSize" value={typography.body.md.fontSize} />,
                      <TokenValue key="lglh" token="typography.body.md.lineHeight" value={typography.body.md.lineHeight} />,
                      <TokenValue key="lgfw" token="fontWeights.medium" value="500" />,
                      <PixelValue key="lgi" value="14px" />,
                    ],
                  ]}
                />
              </div>

              {/* Colors by Variant */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Colors by Variant</h3>
                <SpecTable
                  headers={['Variant', 'Default Color', 'Hover Color', 'Text Decoration']}
                  rows={[
                    [
                      'default',
                      <TokenValue key="dc" token="colors.brand.default" value={colors.brand.default} />,
                      <TokenValue key="dhc" token="colors.brand.darker" value={colors.brand.darker} />,
                      'underline',
                    ],
                    [
                      'subtle',
                      <TokenValue key="sc" token="colors.text.highEmphasis.onLight" value={colors.text.highEmphasis.onLight} />,
                      <TokenValue key="shc" token="colors.brand.default" value={colors.brand.default} />,
                      'none → underline',
                    ],
                    [
                      'inverted',
                      <PixelValue key="ic" value="#FFFFFF" />,
                      <PixelValue key="ihc" value="rgba(255, 255, 255, 0.80)" />,
                      'underline',
                    ],
                    [
                      'disabled',
                      <TokenValue key="dic" token="colors.text.disabled.onLight" value={colors.text.disabled.onLight} />,
                      <TokenValue key="dihc" token="colors.text.disabled.onLight" value={colors.text.disabled.onLight} />,
                      'underline',
                    ],
                  ]}
                />
              </div>

              {/* Animation */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Animation</h3>
                <SpecTable
                  headers={['Property', 'Value']}
                  rows={[
                    ['Color transition', <PixelValue key="ct" value="0.15s ease" />],
                    ['Text underline offset', <PixelValue key="tuo" value="2px" />],
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
              <CodeBlock>{`import { Link } from '@/components'
import type { LinkProps } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>{`// Default link
<Link href="/dashboard">Go to Dashboard</Link>

// External link (opens in new tab)
<Link href="https://example.com" external>
  Documentation
</Link>

// Subtle link (no underline until hover)
<Link href="/settings" variant="subtle" size="sm">
  View settings
</Link>

// Inverted link (for dark backgrounds)
<Link href="/help" variant="inverted">
  Need help?
</Link>`}</CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Link Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="c">children</code>, <code key="ct">ReactNode</code>, '(required)', 'Link text content'],
                  [<code key="s">size</code>, <code key="st">{"'sm' | 'md' | 'lg'"}</code>, <code key="sd">{"'md'"}</code>, 'Text size'],
                  [<code key="v">variant</code>, <code key="vt">{"'default' | 'subtle' | 'inverted'"}</code>, <code key="vd">{"'default'"}</code>, 'Visual variant'],
                  [<code key="e">external</code>, <code key="et">boolean</code>, <code key="ed">false</code>, 'Shows external link icon, opens in new tab'],
                  [<code key="d">disabled</code>, <code key="dt">boolean</code>, <code key="dd">false</code>, 'Disables the link'],
                  [<code key="h">href</code>, <code key="ht">string</code>, '—', 'URL destination'],
                ]}
              />
            </div>
          </section>

          {/* ========== DESIGN GUIDANCE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use</h3>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Navigate to another page or external resource</li>
                <li>Inline within body text to reference related content</li>
                <li>Standalone as a text-only navigation action</li>
                <li>Use the external variant for links that leave the application</li>
              </ul>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When Not to Use</h3>
              <SpecTable
                headers={['Scenario', 'Use Instead']}
                rows={[
                  ['Actions that don\'t navigate', 'Button'],
                  ['Primary call-to-action', 'Button'],
                  ['Breadcrumb navigation', 'Breadcrumb component'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use descriptive link text', 'Use generic "click here" or "learn more"'],
                  ['Use external variant for offsite links', 'Open same-site links in new tabs'],
                  ['Use subtle variant in navigation context', 'Use inverted variant on light backgrounds'],
                  ['Keep link text concise', 'Use entire sentences as link text'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Uses semantic <code>&lt;a&gt;</code> element for proper navigation semantics</li>
                <li>External links include <code>target=&quot;_blank&quot;</code> with <code>rel=&quot;noopener noreferrer&quot;</code></li>
                <li>Disabled links use <code>aria-disabled</code> and <code>tabIndex=-1</code></li>
                <li>Underline decoration provides non-color visual indicator</li>
                <li>Focus styles visible for keyboard navigation</li>
              </ul>
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={linkDocData} />
      )}
    </StyleguideLayout>
  )
}
