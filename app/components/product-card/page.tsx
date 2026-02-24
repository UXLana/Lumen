'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, CopyableToken, PixelValue, CollapsibleSection } from '../../design-system/shared'
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

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Dimension and spacing values used in the Product Card component. Click any token to copy it.
              </p>

              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Dimensions & Spacing</h3>
                <SpecTable
                  headers={['Token', 'Value', 'Description']}
                  rows={[
                    [<CopyableToken key="mw" token="productCard.minWidth" />, <PixelValue key="mwv" value={productCard.minWidth} />, 'Minimum card width'],
                    [<CopyableToken key="ih" token="productCard.image.height" />, <PixelValue key="ihv" value={productCard.image.height} />, 'Image area height'],
                    [<CopyableToken key="cp" token="productCard.content.padding" />, <PixelValue key="cpv" value={productCard.content.padding} />, 'Content area padding'],
                    [<CopyableToken key="br" token="productCard.border.radius" />, <PixelValue key="brv" value={productCard.border.radius} />, 'Card border radius'],
                    [<CopyableToken key="hs" token="productCard.hover.shadow" />, <PixelValue key="hsv" value={productCard.hover.shadow} />, 'Hover state shadow'],
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
{`import { ProductCard } from '@/components'
import type { ProductCardProps, ProductTag, MarketBadge } from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`// Simple product card
<ProductCard
  brand="Cannabis Co."
  name="Premium Flower"
  sku="SKU-12345"
  onClick={() => console.log('clicked')}
/>

// With image and tags
<ProductCard
  imageUrl="/products/flower.jpg"
  brand="Premium Brand"
  name="Indica Blend"
  sku="SKU-001"
  gapCount={1}
  tags={[
    { label: 'Flower' },
    { label: 'THC 22%', variant: 'outlined' },
  ]}
/>

// With market badges
<ProductCard
  brand="National Brand"
  name="Multi-State Product"
  sku="SKU-003"
  markets={[
    { code: 'CA', highlighted: true },
    { code: 'NV', highlighted: true },
    { code: 'CO' },
  ]}
  totalMarkets={12}
/>`}
              </CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>ProductCard Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="iu">imageUrl</code>, <code key="iut">string</code>, '—', 'Product image URL (shows placeholder if not provided)'],
                  [<code key="b">brand</code>, <code key="bt">string</code>, '—', 'Brand name (required)'],
                  [<code key="n">name</code>, <code key="nt">string</code>, '—', 'Product name (required)'],
                  [<code key="s">sku</code>, <code key="st">string</code>, '—', 'SKU number'],
                  [<code key="gc">gapCount</code>, <code key="gct">number</code>, '—', 'Gap count badge (e.g., "2 Gap")'],
                  [<code key="t">tags</code>, <code key="tt">ProductTag[]</code>, <code key="td">[]</code>, 'Product tags with optional variant'],
                  [<code key="m">markets</code>, <code key="mt">MarketBadge[]</code>, <code key="md">[]</code>, 'Market badges with code and highlight state'],
                  [<code key="tm">totalMarkets</code>, <code key="tmt">number</code>, '—', 'Total markets count for display'],
                  [<code key="oc">onClick</code>, <code key="oct">{'() => void'}</code>, '—', 'Click handler (makes card interactive)'],
                  [<code key="st2">style</code>, <code key="st2t">CSSProperties</code>, '—', 'Custom styles'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Type Definitions</h3>
              <CodeBlock>{`interface ProductTag {
  label: string
  variant?: 'default' | 'outlined'
}

interface MarketBadge {
  code: string
  highlighted?: boolean
}`}</CodeBlock>
            </div>
          </section>

          {/* ========== DESIGN GUIDANCE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use</h3>
              <SpecTable
                headers={['Scenario', 'Recommendation']}
                rows={[
                  ['Product listing grids', 'Use ProductCard in responsive CSS grid layouts'],
                  ['Search results', 'Display matching products with tags and market info'],
                  ['Inventory dashboards', 'Show product details with gap counts and compliance tags'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use consistent image aspect ratios', 'Mix cards with and without images in the same grid'],
                  ['Keep brand and name text concise', 'Truncate SKU numbers or critical identifiers'],
                  ['Limit tags to 2-3 per card', 'Overload cards with too many tags'],
                  ['Show relevant market badges only', 'Display all markets when only a few are highlighted'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <SpecTable
                headers={['Feature', 'Implementation']}
                rows={[
                  ['Interactive card', 'onClick adds cursor: pointer and hover/focus states'],
                  ['Image alt text', 'Product name used as alt text for the image'],
                  ['Color contrast', 'Tag text meets WCAG AA contrast standards'],
                  ['Keyboard navigation', 'Cards are focusable when onClick is provided'],
                ]}
              />
            </div>
          </section>
        </>
      )}
    </StyleguideLayout>
  )
}
