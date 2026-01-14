'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton } from '../../design-system/shared'
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
                    previewBackground={colors.neutral[100]}
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
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={demoVerified}
                          onChange={(e) => setDemoVerified(e.target.checked)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ ...typography.label.sm }}>Verified</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={demoSelected}
                          onChange={(e) => setDemoSelected(e.target.checked)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ ...typography.label.sm }}>Selected</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== VARIANTS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Variants</h2>
            <p style={sharedStyles.sectionDescription}>
              Three layout variants for different contexts and screen sizes.
            </p>

            {/* Default Variant */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Default (with Hero Image)</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                Full card with hero image area. Best for grid layouts and featured apps.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {sampleApps.slice(0, 2).map((app, i) => (
                  <MarketplaceCard
                    key={i}
                    variant="default"
                    {...app}
                    status={i === 0 ? 'installed' : 'uninstalled'}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>

            {/* Compact Variant */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Compact</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                No hero image, more information density. Good for sidebars and smaller spaces.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
                {sampleApps.map((app, i) => (
                  <MarketplaceCard
                    key={i}
                    variant="compact"
                    {...app}
                    status={i === 0 ? 'installed' : i === 1 ? 'update-available' : 'uninstalled'}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>

            {/* Horizontal Variant */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Horizontal (List Item)</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                Minimal, row-based layout for lists and tables.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sampleApps.map((app, i) => (
                  <MarketplaceCard
                    key={i}
                    variant="horizontal"
                    {...app}
                    status={i === 0 ? 'installed' : i === 1 ? 'update-available' : 'uninstalled'}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ========== STATUS STATES ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Status States</h2>
            <p style={sharedStyles.sectionDescription}>
              Cards display different status badges based on installation state.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div>
                  <h4 style={{ ...typography.label.md, marginBottom: '12px' }}>Installed</h4>
                  <MarketplaceCard
                    variant="compact"
                    name="App Name"
                    description="App description text..."
                    publisher="Publisher"
                    category="Category"
                    rating={4.5}
                    status="installed"
                    isVerified
                    onClick={() => {}}
                  />
                </div>
                <div>
                  <h4 style={{ ...typography.label.md, marginBottom: '12px' }}>Uninstalled</h4>
                  <MarketplaceCard
                    variant="compact"
                    name="App Name"
                    description="App description text..."
                    publisher="Publisher"
                    category="Category"
                    rating={4.5}
                    status="uninstalled"
                    isVerified
                    onClick={() => {}}
                  />
                </div>
                <div>
                  <h4 style={{ ...typography.label.md, marginBottom: '12px' }}>Update Available</h4>
                  <MarketplaceCard
                    variant="compact"
                    name="App Name"
                    description="App description text..."
                    publisher="Publisher"
                    category="Category"
                    rating={4.5}
                    status="update-available"
                    isVerified
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========== SELECTION STATE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Selection State</h2>
            <p style={sharedStyles.sectionDescription}>
              Cards can show a selected state for multi-select scenarios.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'flex', gap: '24px' }}>
                <MarketplaceCard
                  variant="horizontal"
                  name="Selected App"
                  description="This app is selected"
                  publisher="Publisher"
                  category="Category"
                  rating={4.5}
                  status="installed"
                  isVerified
                  selected
                  onClick={() => {}}
                />
                <MarketplaceCard
                  variant="horizontal"
                  name="Unselected App"
                  description="This app is not selected"
                  publisher="Publisher"
                  category="Category"
                  rating={4.0}
                  status="uninstalled"
                  onClick={() => {}}
                />
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
