'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { MarketplaceCard, MarketplaceAppStatus, MarketplaceCardVariant } from '@/components'
import { colors, typography } from '@/styles/design-tokens'

// =============================================================================
// SAMPLE DATA
// =============================================================================

const sampleApps = [
  {
    name: 'Metrc Integration',
    description: 'Industry-leading track-and-trace platform providing end-to-end supply chain visibility for cannabis operations.',
    publisher: 'Metrc',
    category: 'Compliance',
    rating: 5.0,
    reviewCount: 128,
    isVerified: true,
  },
  {
    name: 'CannaBI Analytics',
    description: 'Powerful business intelligence and reporting tools designed specifically for cannabis businesses.',
    publisher: 'CannaBI',
    category: 'Analytics',
    rating: 4.8,
    reviewCount: 87,
    isVerified: true,
  },
  {
    name: 'LeafLink Connect',
    description: 'Streamline your wholesale ordering and vendor management with seamless LeafLink integration.',
    publisher: 'LeafLink',
    category: 'Integration',
    rating: 4.5,
    reviewCount: 56,
    isVerified: false,
  },
]

// =============================================================================
// PAGE COMPONENT
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

const marketplaceCardDocData: ComponentDocData = {
  displayName: 'MarketplaceCard',
  importPath: '@/components',
  importStatement: `import { MarketplaceCard } from '@/components'\nimport type { MarketplaceCardProps, MarketplaceAppStatus, MarketplaceCardVariant } from '@/components'`,
  description: 'Marketplace cards display app information in an integration marketplace with status, rating, and publisher details.',
  props: [
    { name: 'name', type: 'string', required: true, description: 'App name' },
    { name: 'description', type: 'string', required: true, description: 'App description' },
    { name: 'publisher', type: 'string', required: true, description: 'Publisher/developer name' },
    { name: 'category', type: 'string', required: true, description: 'Category (e.g., Compliance, Analytics)' },
    { name: 'iconUrl', type: 'string', description: 'App icon URL' },
    { name: 'heroImageUrl', type: 'string', description: 'Hero/preview image URL' },
    { name: 'rating', type: 'number', description: 'Rating value (0-5)' },
    { name: 'reviewCount', type: 'number', description: 'Number of reviews' },
    { name: 'status', type: "'installed' | 'uninstalled' | 'update-available'", description: 'Installation status' },
    { name: 'isVerified', type: 'boolean', description: 'Whether the app is verified' },
    { name: 'variant', type: "'default' | 'compact' | 'horizontal'", default: "'default'", description: 'Card layout variant' },
    { name: 'onClick', type: '() => void', description: 'Click handler' },
    { name: 'selected', type: 'boolean', description: 'Whether the card is selected' },
  ],
  typeDefinitions: [
    { name: 'MarketplaceAppStatus', definition: "type MarketplaceAppStatus = 'installed' | 'uninstalled' | 'update-available'" },
    { name: 'MarketplaceCardVariant', definition: "type MarketplaceCardVariant = 'default' | 'compact' | 'horizontal'" },
  ],
  accessibility: [
    { feature: 'Interactive Card', description: 'Clickable cards render as focusable elements with proper role.' },
    { feature: 'Status', description: 'Installation status conveyed with text and visual indicators.' },
    { feature: 'Rating', description: 'Star rating includes accessible text alternative.' },
  ],
  tokens: [
    { token: 'colors.surface.light', value: 'White', usage: 'Card background' },
    { token: 'shadows.md', value: 'Box shadow', usage: 'Card elevation' },
    { token: 'borderRadius.lg', value: '12px', usage: 'Card corners' },
  ],
  relatedComponents: [
    { name: 'Product Card', href: '/components/product-card' },
    { name: 'Badge', href: '/components/badge' },
  ],
  notes: [
    'Use default variant for browse/discovery layouts.',
    'Use compact variant for sidebar or condensed lists.',
    'Use horizontal variant for search results or comparison views.',
  ],
}

export default function MarketplaceCardPage() {
  const variants: MarketplaceCardVariant[] = ['default', 'compact', 'horizontal']
  const statuses: MarketplaceAppStatus[] = ['installed', 'uninstalled', 'update-available']

  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive playground state
  const [demoVariant, setDemoVariant] = useState<MarketplaceCardVariant>('default')
  const [demoStatus, setDemoStatus] = useState<MarketplaceAppStatus>('uninstalled')
  const [demoVerified, setDemoVerified] = useState(true)
  const [demoSelected, setDemoSelected] = useState(false)

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Marketplace Card"
      description="A specialized card component for displaying marketplace/app store items with app info, ratings, status, and verification badges."
      activeId="marketplace-card"
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
import { MarketplaceCard } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { MarketplaceCard } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Experiment with card properties to see different configurations.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview */}
                <div>
                  <Playground
                    preview={
                      <div style={{ padding: '16px' }}>
                        <MarketplaceCard
                          variant={demoVariant}
                          name="Metrc Integration"
                          description="Industry-leading track-and-trace platform providing end-to-end supply chain visibility for cannabis operations."
                          publisher="Metrc"
                          category="Compliance"
                          rating={5.0}
                          reviewCount={128}
                          status={demoStatus}
                          isVerified={demoVerified}
                          selected={demoSelected}
                          onClick={() => setDemoSelected(!demoSelected)}
                        />
                      </div>
                    }
                    code={`<MarketplaceCard
  variant="${demoVariant}"
  name="Metrc Integration"
  description="Industry-leading track-and-trace platform..."
  publisher="Metrc"
  category="Compliance"
  rating={5.0}
  reviewCount={128}
  status="${demoStatus}"${demoVerified ? '\n  isVerified' : ''}${demoSelected ? '\n  selected' : ''}
  onClick={() => handleClick()}
/>`}
                    previewPadding="56px 24px"
                    previewBackground={'#F5F5F5'}
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

                    {/* Status */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Status
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {statuses.map(s => (
                          <PillButton
                            key={s}
                            onClick={() => setDemoStatus(s)}
                            isActive={demoStatus === s}
                          >
                            {s}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <StyledCheckbox
                        checked={demoVerified}
                        onChange={setDemoVerified}
                        label="Verified"
                      />
                      <StyledCheckbox
                        checked={demoSelected}
                        onChange={setDemoSelected}
                        label="Selected"
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
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Card Dimensions</h3>
              <SpecTable
                headers={['Variant', 'Width Token', 'Width', 'Min Height']}
                rows={[
                  ['default', <CopyableToken key="dw" token="spacing.80" />, <PixelValue key="dwv" value="320px" />, <PixelValue key="dmh" value="auto" />],
                  ['compact', <CopyableToken key="cw" token="spacing.64" />, <PixelValue key="cwv" value="256px" />, <PixelValue key="cmh" value="auto" />],
                  ['horizontal', '-', <PixelValue key="hwv" value="100%" />, <PixelValue key="hmh" value="80px" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Spacing</h3>
              <SpecTable
                headers={['Element', 'Token', 'Value']}
                rows={[
                  ['Card Padding', <CopyableToken key="cp" token="spacing.4" />, <PixelValue key="cpv" value="16px" />],
                  ['Content Gap', <CopyableToken key="cg" token="spacing.3" />, <PixelValue key="cgv" value="12px" />],
                  ['Icon Size (Avatar)', <CopyableToken key="is" token="spacing.10" />, <PixelValue key="isv" value="40px" />],
                  ['Hero Image Height', <CopyableToken key="hh" token="spacing.32" />, <PixelValue key="hhv" value="128px" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Border & Shadow</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Border Radius', <CopyableToken key="br" token="borderRadius.lg" />, <PixelValue key="brv" value="12px" />],
                  ['Border Color', <CopyableToken key="bc" token="colors.border.lowEmphasis.onLight" />, <PixelValue key="bcv" value={colors.border.lowEmphasis.onLight} />],
                  ['Shadow (hover)', <CopyableToken key="sh" token="shadows.md" />, <PixelValue key="shv" value="0 4px 6px rgba(0,0,0,0.1)" />],
                  ['Selected Border', <CopyableToken key="sb" token="colors.brand.default" />, <PixelValue key="sbv" value={colors.brand.default} />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Status Badges</h3>
              <SpecTable
                headers={['Status', 'Badge Color Token', 'Badge Variant']}
                rows={[
                  ['installed', <CopyableToken key="ib" token="colors.semantic.success" />, <PixelValue key="ibv" value="subtle" />],
                  ['uninstalled', <CopyableToken key="ub" token="colors.neutral[600]" />, <PixelValue key="ubv" value="outlined" />],
                  ['update-available', <CopyableToken key="uab" token="colors.semantic.info" />, <PixelValue key="uabv" value="subtle" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography</h3>
              <SpecTable
                headers={['Element', 'Token', 'Font Size', 'Weight']}
                rows={[
                  ['App Name', <CopyableToken key="an" token="typography.heading.sm" />, <PixelValue key="anfs" value="18px" />, <PixelValue key="anfw" value="600" />],
                  ['Description', <CopyableToken key="desc" token="typography.body.sm" />, <PixelValue key="descfs" value="14px" />, <PixelValue key="descfw" value="400" />],
                  ['Publisher', <CopyableToken key="pub" token="typography.label.sm" />, <PixelValue key="pubfs" value="12px" />, <PixelValue key="pubfw" value="500" />],
                  ['Rating', <CopyableToken key="rat" token="typography.label.sm" />, <PixelValue key="ratfs" value="12px" />, <PixelValue key="ratfw" value="500" />],
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
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>
{`import { MarketplaceCard } from '@/components'
import type {
  MarketplaceCardProps,
  MarketplaceAppStatus,
  MarketplaceCardVariant,
} from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`// Default card with hero image
<MarketplaceCard
  name="Metrc Integration"
  description="Industry-leading track-and-trace platform..."
  publisher="Metrc"
  category="Compliance"
  rating={5.0}
  reviewCount={128}
  status="installed"
  isVerified
  onClick={() => handleAppClick()}
/>

// Compact variant
<MarketplaceCard
  variant="compact"
  name="CannaBI Analytics"
  description="Powerful business intelligence..."
  publisher="CannaBI"
  category="Analytics"
  rating={4.8}
  status="uninstalled"
  onClick={() => handleAppClick()}
/>

// Horizontal/list variant
<MarketplaceCard
  variant="horizontal"
  name="LeafLink Connect"
  description="Streamline wholesale ordering..."
  publisher="LeafLink"
  category="Integration"
  rating={4.5}
  status="update-available"
  onClick={() => handleAppClick()}
/>`}
              </CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="n">name</code>, <code key="nt">string</code>, 'required', 'App name'],
                  [<code key="d">description</code>, <code key="dt">string</code>, 'required', 'App description'],
                  [<code key="p">publisher</code>, <code key="pt">string</code>, 'required', 'Publisher/developer name'],
                  [<code key="c">category</code>, <code key="ct">string</code>, 'required', 'App category'],
                  [<code key="v">variant</code>, <code key="vt">'default' | 'compact' | 'horizontal'</code>, <code key="vd">'default'</code>, 'Card layout'],
                  [<code key="r">rating</code>, <code key="rt">number</code>, <code key="rd">0</code>, 'Rating (0-5)'],
                  [<code key="rc">reviewCount</code>, <code key="rct">number</code>, '-', 'Number of reviews'],
                  [<code key="s">status</code>, <code key="st">'installed' | 'uninstalled' | 'update-available'</code>, <code key="sd">'uninstalled'</code>, 'Installation status'],
                  [<code key="iv">isVerified</code>, <code key="ivt">boolean</code>, <code key="ivd">false</code>, 'Show verified badge'],
                  [<code key="iu">iconUrl</code>, <code key="iut">string</code>, '-', 'App icon URL'],
                  [<code key="hu">heroImageUrl</code>, <code key="hut">string</code>, '-', 'Hero image URL'],
                  [<code key="sl">selected</code>, <code key="slt">boolean</code>, <code key="sld">false</code>, 'Selected state'],
                  [<code key="oc">onClick</code>, <code key="oct">() =&gt; void</code>, '-', 'Click handler'],
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
                  [<code key="d">default</code>, 'Grid layouts, featured apps, landing pages'],
                  [<code key="c">compact</code>, 'Sidebars, smaller containers, mobile views'],
                  [<code key="h">horizontal</code>, 'Lists, tables, search results, bulk selection'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Composition</h3>
              <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, marginBottom: '16px' }}>
                MarketplaceCard is composed from these atomic components:
              </p>
              <SpecTable
                headers={['Component', 'Purpose']}
                rows={[
                  [<code key="a">Avatar</code>, 'App icon display'],
                  [<code key="b">Badge</code>, 'Status and verified indicators'],
                  [<code key="i">IconStar</code>, 'Rating display'],
                  [<code key="ic">IconCheck</code>, 'Verified indicator'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={marketplaceCardDocData} />
      )}
    </StyleguideLayout>
  )
}
