'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox } from '../../design-system/shared'
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

type PageTab = 'overview' | 'implementation'

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
              <CodeBlock>{`import { MarketplaceCard } from '@/components'`}</CodeBlock>
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
                    previewBackground={colors.neutral[100]}
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
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>

            <div style={sharedStyles.card}>
              <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Variant Specifications</h3>
              <SpecTable
                headers={['Variant', 'Use Case', 'Features']}
                rows={[
                  ['default', 'Grid layouts, featured apps', 'Hero image, full details, large footprint'],
                  ['compact', 'Sidebars, smaller containers', 'No hero image, denser information'],
                  ['horizontal', 'Lists, search results', 'Row layout, minimal height'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Status Badges</h3>
              <SpecTable
                headers={['Status', 'Badge Style', 'Color']}
                rows={[
                  ['installed', 'Subtle Success', 'Green tint'],
                  ['uninstalled', 'Outlined Neutral', 'Gray border'],
                  ['update-available', 'Subtle Info', 'Blue tint'],
                ]}
              />
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
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
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
    </StyleguideLayout>
  )
}
