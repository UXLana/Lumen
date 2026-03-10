'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { ProductCard } from '@/components'
import { colors, typography } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'
type LayoutVariant = 'vertical' | 'horizontal' | 'compact'

// =============================================================================
// SAMPLE DATA
// =============================================================================

const sampleProduct = {
  name: 'Elderberry Indica Gummies',
  sku: 'WYLD-IND-001',
  brands: ['Wyld'],
  categories: ['Edibles'],
  potency: '100 mg of THC',
  markets: [
    { code: 'CA', highlighted: true },
    { code: 'NV', highlighted: true },
    { code: 'CO', highlighted: false },
    { code: 'OR', highlighted: false },
    { code: 'WA', highlighted: false },
  ],
  totalMarkets: 5,
}

// =============================================================================
// DOC DATA
// =============================================================================

const productCardDocData: ComponentDocData = {
  displayName: 'ProductCard',
  importPath: '@/components',
  importStatement: `import { ProductCard } from '@/components'\nimport type { ProductCardProps, MarketBadge } from '@/components'`,
  description: 'Product cards display product information with image, brand, category, potency, and market availability. Supports vertical, horizontal, and compact layout variants.',
  props: [
    { name: 'layout', type: "'vertical' | 'horizontal' | 'compact'", default: "'vertical'", description: 'Card layout variant' },
    { name: 'imageUrl', type: 'string', description: 'Product image URL' },
    { name: 'typeLabel', type: 'string', description: 'Type badge overlay (e.g. "Product")' },
    { name: 'name', type: 'string', required: true, description: 'Product name' },
    { name: 'sku', type: 'string', description: 'SKU identifier' },
    { name: 'brands', type: 'string[]', description: 'Brand names shown as badges' },
    { name: 'categories', type: 'string[]', description: 'Category tags' },
    { name: 'potency', type: 'string', description: 'Potency label' },
    { name: 'gapCount', type: 'number', description: 'Gap count badge' },
    { name: 'markets', type: 'MarketBadge[]', description: 'Market badges' },
    { name: 'totalMarkets', type: 'number', description: 'Total markets count' },
    { name: 'selected', type: 'boolean', description: 'Selected state with brand border' },
    { name: 'selectionIcon', type: "'check' | 'close'", default: "'check'", description: 'Icon shown when selected — check (default) or close (for remove/dismiss contexts)' },
    { name: 'onSelect', type: '(selected: boolean) => void', description: 'Selection handler (renders checkbox)' },
    { name: 'onClick', type: '() => void', description: 'Click handler (navigates to details)' },
  ],
  typeDefinitions: [
    { name: 'MarketBadge', definition: "interface MarketBadge {\n  code: string\n  highlighted?: boolean\n}" },
    { name: 'ProductCardLayout', definition: "type ProductCardLayout = 'vertical' | 'horizontal' | 'compact'" },
  ],
  accessibility: [
    { feature: 'Selection Checkbox', description: 'Dedicated checkbox with role="checkbox" and aria-checked for card selection.' },
    { feature: 'Card Navigation', description: 'Single click/Enter navigates to details. Keyboard accessible via tabIndex and onKeyDown.' },
    { feature: 'Focus Ring', description: 'Focus-visible outline for keyboard navigation.' },
    { feature: 'Badge Groups', description: 'Badge rows use role="group" with aria-label for screen reader context.' },
  ],
  tokens: [
    { token: 'colors.surface.light', value: 'White', usage: 'Card background' },
    { token: 'borderRadius.lg', value: '12px', usage: 'Card corners' },
    { token: 'borderRadius.md', value: '8px', usage: 'Compact thumbnail corners' },
    { token: 'borderRadius.sm', value: '4px', usage: 'Badge corners' },
    { token: 'shadows.sm', value: 'Elevation', usage: 'Hover shadow' },
    { token: 'spacing.md', value: '16px', usage: 'Content padding' },
  ],
  relatedComponents: [
    { name: 'Marketplace Card', href: '/components/marketplace-card' },
    { name: 'Badge', href: '/components/badge' },
    { name: 'Data Table', href: '/components/data-table' },
  ],
  notes: [
    'Uses Badge component for brands, categories, potency, and gap count.',
    'Market badges use highlighted state to indicate active markets.',
    'Compact layout hides category and potency badges for density.',
    'Legacy `brand` and `tags` props are still supported for backward compatibility.',
  ],
}

// =============================================================================
// LAYOUT CONSTRAINTS
// =============================================================================

const layoutMaxWidth: Record<LayoutVariant, string> = {
  vertical: '320px',
  horizontal: '520px',
  compact: '420px',
}

const layoutMinWidth: Record<LayoutVariant, string | undefined> = {
  vertical: undefined,
  horizontal: '420px',
  compact: undefined,
}

// =============================================================================
// PAGE
// =============================================================================

export default function ProductCardPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  const [demoLayout, setDemoLayout] = useState<LayoutVariant>('vertical')
  const [demoShowImage, setDemoShowImage] = useState(true)
  const [demoShowType, setDemoShowType] = useState(true)
  const [demoSelected, setDemoSelected] = useState(false)
  const [demoSelectionIcon, setDemoSelectionIcon] = useState<'check' | 'close'>('check')
  const [demoBordered, setDemoBordered] = useState(false)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const layouts: LayoutVariant[] = ['vertical', 'horizontal', 'compact']

  return (
    <StyleguideLayout
      title="Product Card"
      description="Product cards display product information with image, brand, category, potency, and market availability. Available in vertical, horizontal, and compact layouts."
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
              Experiment with product card properties to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                <div>
                  <Playground
                    preview={
                      <div style={{
                        maxWidth: layoutMaxWidth[demoLayout],
                        minWidth: layoutMinWidth[demoLayout],
                        width: '100%',
                      }}>
                        <ProductCard
                          layout={demoLayout}
                          imageUrl={demoShowImage ? 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=400&h=300&fit=crop' : undefined}
                          typeLabel={demoShowType ? 'Product' : undefined}
                          selected={demoSelected}
                          selectionIcon={demoSelectionIcon}
                          bordered={demoBordered}
                          {...sampleProduct}
                          onSelect={(sel) => setDemoSelected(sel)}
                          onClick={() => {}}
                        />
                      </div>
                    }
                    code={`<ProductCard
  layout="${demoLayout}"${demoShowImage ? '\n  imageUrl="/products/gummies.jpg"' : ''}${demoShowType ? '\n  typeLabel="Product"' : ''}${demoSelected ? '\n  selected' : ''}${demoSelectionIcon === 'close' ? '\n  selectionIcon="close"' : ''}${demoBordered ? '\n  bordered' : ''}
  name="Elderberry Indica Gummies"
  sku="WYLD-IND-001"
  brands={['Wyld']}
  categories={['Edibles']}
  potency="100 mg of THC"
  markets={[{ code: 'CA', highlighted: true }, ...]}
  totalMarkets={5}
  onSelect={handleSelect}
  onClick={handleClick}
/>`}
                    previewPadding="24px"
                    previewBackground={colors.surface.paper}
                  />
                </div>

                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Layout */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Layout
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {layouts.map(l => (
                          <PillButton key={l} onClick={() => setDemoLayout(l)} isActive={demoLayout === l}>
                            {l}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Selection Icon */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Selection Icon
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['check', 'close'] as const).map(icon => (
                          <PillButton key={icon} onClick={() => setDemoSelectionIcon(icon)} isActive={demoSelectionIcon === icon}>
                            {icon}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <StyledCheckbox checked={demoShowImage} onChange={setDemoShowImage} label="Show Image" />
                    <StyledCheckbox checked={demoShowType} onChange={setDemoShowType} label="Type Badge" />
                    <StyledCheckbox checked={demoBordered} onChange={setDemoBordered} label="Bordered" />
                    <StyledCheckbox checked={demoSelected} onChange={setDemoSelected} label="Selected" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Layout Dimensions</h3>
                <SpecTable
                  headers={['Layout', 'Image Width', 'Image Height', 'Content Padding', 'Min Width']}
                  rows={[
                    [
                      'vertical',
                      <PixelValue key="v-iw" value="100%" />,
                      <PixelValue key="v-ih" value="180px" />,
                      <CopyableToken key="v-cp" token="spacing.md" />,
                      '—',
                    ],
                    [
                      'horizontal',
                      <PixelValue key="h-iw" value="168px" />,
                      <PixelValue key="h-ih" value="auto" />,
                      <CopyableToken key="h-cp" token="spacing.md" />,
                      <PixelValue key="h-mw" value="420px" />,
                    ],
                    [
                      'compact',
                      <PixelValue key="c-iw" value="96px" />,
                      <PixelValue key="c-ih" value="96px" />,
                      <PixelValue key="c-cp" value="8px 12px" />,
                      '—',
                    ],
                  ]}
                />
              </div>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Border Radius</h3>
                <SpecTable
                  headers={['Element', 'Token', 'Value']}
                  rows={[
                    ['Card container', <CopyableToken key="br-card" token="borderRadius.lg" />, <PixelValue key="br-card-v" value="12px" />],
                    ['Compact thumbnail', <CopyableToken key="br-thumb" token="borderRadius.md" />, <PixelValue key="br-thumb-v" value="8px" />],
                    ['All badges', <CopyableToken key="br-badge" token="borderRadius.sm" />, <PixelValue key="br-badge-v" value="4px" />],
                    ['Market indicators', <CopyableToken key="br-market" token="borderRadius.sm" />, <PixelValue key="br-market-v" value="4px" />],
                  ]}
                />
              </div>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Typography</h3>
                <SpecTable
                  headers={['Element', 'Font Size', 'Font Weight', 'Line Height', 'Color']}
                  rows={[
                    ['Product name', <PixelValue key="pn-fs" value="15px" />, 'Semibold (600)', <PixelValue key="pn-lh" value="24px" />, 'rgba(0,0,0,0.80)'],
                    ['Product name (compact)', <PixelValue key="pnc-fs" value="14px" />, 'Semibold (600)', <PixelValue key="pnc-lh" value="20px" />, 'rgba(0,0,0,0.80)'],
                    ['SKU', <PixelValue key="sku-fs" value="12px" />, 'Regular (400)', <PixelValue key="sku-lh" value="16px" />, '#767676'],
                    ['Market count', <PixelValue key="mc-fs" value="11px" />, 'Regular (400)', <PixelValue key="mc-lh" value="16px" />, '#767676'],
                  ]}
                />
              </div>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Spacing</h3>
                <SpecTable
                  headers={['Property', 'Token / Value', 'Usage']}
                  rows={[
                    ['Badge gap', <PixelValue key="bg" value="4px" />, 'Between badges in a row'],
                    ['Badge row gap', <PixelValue key="brg" value="8px" />, 'Between badge groups'],
                    ['Content-to-badges', <CopyableToken key="ctb" token="spacing.md" />, 'Name/SKU to first badge row'],
                    ['Content-to-badges (compact)', <PixelValue key="ctbc" value="8px" />, 'Reduced in compact layout'],
                    ['Checkbox offset', <CopyableToken key="co" token="spacing.md" />, '16px from top & right'],
                    ['Type badge offset', <CopyableToken key="to" token="spacing.md" />, '16px from top & left'],
                  ]}
                />
              </div>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Badge Color Variants</h3>
                <SpecTable
                  headers={['Badge Type', 'Background', 'Text Color', 'Usage']}
                  rows={[
                    ['Brand / Category / Potency', <PixelValue key="grey-bg" value="#E5E5E5" />, <PixelValue key="grey-txt" value="#767676" />, 'Neutral grey badges'],
                    ['Market (active)', 'rgba(23,151,142, 0.12)', <CopyableToken key="mkt-txt" token="colors.brand.default" />, 'Brand-tinted for active markets'],
                    ['Gap count', <PixelValue key="gap-bg" value="#E5E5E5" />, <PixelValue key="gap-txt" value="#767676" />, 'Neutral grey badge'],
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
              <CodeBlock>{`import { ProductCard } from '@/components'
import type { ProductCardProps, MarketBadge } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>{`<ProductCard
  layout="vertical"
  imageUrl="/products/gummies.jpg"
  typeLabel="Product"
  name="Elderberry Indica Gummies"
  sku="WYLD-IND-001"
  brands={['Wyld']}
  categories={['Edibles']}
  potency="100 mg of THC"
  markets={[{ code: 'CA', highlighted: true }]}
  totalMarkets={5}
  onSelect={handleSelect}
  onClick={handleClick}
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Layout Examples</h3>
              <CodeBlock>{`// Horizontal — for list views
<ProductCard layout="horizontal" {...productData} />

// Compact — for sidebars and dense lists
<ProductCard layout="compact" {...productData} />`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Selection + Navigation</h3>
              <CodeBlock>{`// Checkbox for selection, click for details
<ProductCard
  {...productData}
  selected={isSelected}
  onSelect={(sel) => setSelected(sel)}
  onClick={() => router.push(\`/products/\${id}\`)}
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Legacy Compatibility</h3>
              <CodeBlock>{`// Old API still works — brand + tags are auto-mapped
<ProductCard
  brand="Wyld"
  name="Elderberry Gummies"
  tags={[
    { label: 'Edibles' },
    { label: '100 mg THC', variant: 'outlined' },
  ]}
/>`}</CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="l">layout</code>, <code key="lt">{`'vertical' | 'horizontal' | 'compact'`}</code>, <code key="ld">{`'vertical'`}</code>, 'Card layout variant'],
                  [<code key="iu">imageUrl</code>, <code key="iut">string</code>, '—', 'Product image URL'],
                  [<code key="tl">typeLabel</code>, <code key="tlt">string</code>, '—', 'Type badge overlay (e.g. "Product")'],
                  [<code key="n">name</code>, <code key="nt">string</code>, '—', 'Product name (required)'],
                  [<code key="s">sku</code>, <code key="st">string</code>, '—', 'SKU identifier'],
                  [<code key="br">brands</code>, <code key="brt">string[]</code>, <code key="brd">[]</code>, 'Brand names as badges'],
                  [<code key="ca">categories</code>, <code key="cat">string[]</code>, <code key="cad">[]</code>, 'Category tags (hidden in compact)'],
                  [<code key="po">potency</code>, <code key="pot">string</code>, '—', 'Potency label (hidden in compact)'],
                  [<code key="gc">gapCount</code>, <code key="gct">number</code>, '—', 'Gap count badge'],
                  [<code key="m">markets</code>, <code key="mt">MarketBadge[]</code>, <code key="md">[]</code>, 'Market badges (only highlighted shown)'],
                  [<code key="tm">totalMarkets</code>, <code key="tmt">number</code>, '—', 'Total markets count'],
                  [<code key="se">selected</code>, <code key="set">boolean</code>, <code key="sed">false</code>, 'Selected state'],
                  [<code key="si">selectionIcon</code>, <code key="sit">{`'check' | 'close'`}</code>, <code key="sid">{`'check'`}</code>, "Icon when selected — 'close' for remove/dismiss. Hover turns check → ✕ automatically."],
                  [<code key="os">onSelect</code>, <code key="ost">{`(selected: boolean) => void`}</code>, '—', 'Selection handler (renders checkbox)'],
                  [<code key="oc">onClick</code>, <code key="oct">{`() => void`}</code>, '—', 'Click handler (detail navigation)'],
                ]}
              />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use Each Layout</h3>
              <SpecTable
                headers={['Layout', 'Best For', 'Content Shown']}
                rows={[
                  [<code key="v">vertical</code>, 'Product grids, browse views, dashboards', 'All fields: image, brands, category, potency, markets'],
                  [<code key="h">horizontal</code>, 'List views, search results, wider containers', 'All fields in side-by-side arrangement'],
                  [<code key="c">compact</code>, 'Sidebars, dense lists, selection panels', 'Brands and markets only (category/potency hidden)'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Interaction Model</h3>
              <SpecTable
                headers={['Action', 'Trigger', 'Notes']}
                rows={[
                  ['Select / deselect', 'Checkbox click', 'Always visible, top-right corner. Requires onSelect prop.'],
                  ['View details', 'Card body click or Enter key', 'Navigates to detail view. Requires onClick prop.'],
                  ['Hover preview', 'Mouse hover', 'Subtle shadow elevation, no layout shift.'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility Considerations</h3>
              <SpecTable
                headers={['Feature', 'Implementation']}
                rows={[
                  ['Selection', 'Dedicated checkbox with role="checkbox" and aria-checked — always visible, not hover-gated'],
                  ['Badge groups', 'Wrapped in role="group" with descriptive aria-label per category'],
                  ['Keyboard', 'Tab to card, Enter to navigate, Tab to checkbox, Space to toggle'],
                  ['Screen reader', 'Full product summary in aria-label including active market codes'],
                  ['Contrast', 'All text meets WCAG AA 4.5:1 minimum. Badge text uses #767676 on #E5E5E5 (4.54:1)'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={productCardDocData} />
      )}
    </StyleguideLayout>
  )
}
