'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox } from '../../design-system/shared'
import { ProductCard } from '@/components'
import { colors, typography, productCard } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function ProductCardPage() {
  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive state for playground
  const [demoShowImage, setDemoShowImage] = useState(false)
  const [demoShowGap, setDemoShowGap] = useState(true)
  const [demoShowTags, setDemoShowTags] = useState(true)
  const [demoShowMarkets, setDemoShowMarkets] = useState(true)

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
  ]

  const sampleTags = [
    { label: 'Flower' },
    { label: 'THC 22%', variant: 'outlined' as const },
  ]

  const sampleMarkets = [
    { code: 'CA', highlighted: true },
    { code: 'NV', highlighted: true },
    { code: 'CO', highlighted: false },
    { code: 'OR', highlighted: false },
  ]

  return (
    <StyleguideLayout
      title="Product Card"
      description="Product cards display product information in a compact, scannable format. They show brand, name, SKU, tags, and market availability."
      activeId="product-card"
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
import { ProductCard } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { ProductCard } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Customize the Product Card to see different configurations.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview */}
                <div>
                  <Playground
                    preview={
                      <div style={{ maxWidth: '320px' }}>
                        <ProductCard
                          imageUrl={demoShowImage ? 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=300&h=200&fit=crop' : undefined}
                          brand="Cannabis Co."
                          name="Premium Flower"
                          sku="SKU-12345"
                          gapCount={demoShowGap ? 2 : undefined}
                          tags={demoShowTags ? sampleTags : []}
                          markets={demoShowMarkets ? sampleMarkets : []}
                          totalMarkets={demoShowMarkets ? 8 : undefined}
                          onClick={() => console.log('Card clicked')}
                        />
                      </div>
                    }
                    code={`<ProductCard
  brand="Cannabis Co."
  name="Premium Flower"
  sku="SKU-12345"${demoShowGap ? '\n  gapCount={2}' : ''}${demoShowTags ? `\n  tags={[
    { label: 'Flower' },
    { label: 'THC 22%', variant: 'outlined' }
  ]}` : ''}${demoShowMarkets ? `\n  markets={[
    { code: 'CA', highlighted: true },
    { code: 'NV', highlighted: true },
    { code: 'CO' },
    { code: 'OR' }
  ]}
  totalMarkets={8}` : ''}
  onClick={() => console.log('clicked')}
/>`}
                  />
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontWeight: 600 }}>Options</h3>
                  <StyledCheckbox
                    label="Show Image"
                    checked={demoShowImage}
                    onChange={setDemoShowImage}
                  />
                  <StyledCheckbox
                    label="Show Gap Count"
                    checked={demoShowGap}
                    onChange={setDemoShowGap}
                  />
                  <StyledCheckbox
                    label="Show Tags"
                    checked={demoShowTags}
                    onChange={setDemoShowTags}
                  />
                  <StyledCheckbox
                    label="Show Markets"
                    checked={demoShowMarkets}
                    onChange={setDemoShowMarkets}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========== VARIANTS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Examples</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {/* With Image */}
              <div>
                <h3 style={{ marginBottom: '12px', fontWeight: 600 }}>With Image</h3>
                <ProductCard
                  imageUrl="https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=300&h=200&fit=crop"
                  brand="Premium Brand"
                  name="Indica Blend"
                  sku="SKU-001"
                  gapCount={1}
                  tags={[{ label: 'Indica' }]}
                />
              </div>

              {/* Without Image */}
              <div>
                <h3 style={{ marginBottom: '12px', fontWeight: 600 }}>Placeholder Image</h3>
                <ProductCard
                  brand="Generic Brand"
                  name="Hybrid Strain"
                  sku="SKU-002"
                  tags={[{ label: 'Hybrid' }, { label: 'CBD 10%', variant: 'outlined' }]}
                />
              </div>

              {/* With Markets */}
              <div>
                <h3 style={{ marginBottom: '12px', fontWeight: 600 }}>With Market Badges</h3>
                <ProductCard
                  brand="National Brand"
                  name="Multi-State Product"
                  sku="SKU-003"
                  markets={[
                    { code: 'CA', highlighted: true },
                    { code: 'CO', highlighted: true },
                    { code: 'NV', highlighted: false },
                  ]}
                  totalMarkets={12}
                />
              </div>
            </div>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>
            <SpecTable
              headers={['Prop', 'Type', 'Default', 'Description']}
              rows={[
                ['imageUrl', 'string', '—', 'Product image URL (shows placeholder if not provided)'],
                ['brand', 'string', '—', 'Brand name (required)'],
                ['name', 'string', '—', 'Product name (required)'],
                ['sku', 'string', '—', 'SKU number'],
                ['gapCount', 'number', '—', 'Gap count badge (e.g., "2 Gap")'],
                ['tags', 'ProductTag[]', '[]', 'Product tags with optional variant'],
                ['markets', 'MarketBadge[]', '[]', 'Market badges with code and highlight state'],
                ['totalMarkets', 'number', '—', 'Total markets count for display'],
                ['onClick', '() => void', '—', 'Click handler (makes card interactive)'],
                ['style', 'CSSProperties', '—', 'Custom styles'],
              ]}
            />
          </section>

          {/* ========== TYPES ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Type Definitions</h2>
            <CodeBlock>{`interface ProductTag {
  label: string
  variant?: 'default' | 'outlined'
}

interface MarketBadge {
  code: string
  highlighted?: boolean
}`}</CodeBlock>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>
            <SpecTable
              headers={['Token', 'Value', 'Description']}
              rows={[
                ['productCard.minWidth', productCard.minWidth, 'Minimum card width'],
                ['productCard.image.height', productCard.image.height, 'Image area height'],
                ['productCard.content.padding', productCard.content.padding, 'Content area padding'],
                ['productCard.border.radius', productCard.border.radius, 'Card border radius'],
                ['productCard.hover.shadow', productCard.hover.shadow, 'Hover state shadow'],
              ]}
            />
          </section>
        </>
      )}
    </StyleguideLayout>
  )
}
