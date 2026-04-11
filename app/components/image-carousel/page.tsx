'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox as StyledCheckboxControl, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { ImageCarousel } from '@/components'
import type { NavigationStyle } from '@/components/ImageCarousel/ImageCarousel'
import { colors, spacing, typography, borderRadius, transitionPresets } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// DEMO DATA
// =============================================================================

const demoImages = [
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop',
]

const demoAlts = [
  'Cannabis product packaging front view',
  'Cannabis product packaging back view',
  'Cannabis product close-up detail',
]

// =============================================================================
// DOC DATA
// =============================================================================

const imageCarouselDocData: ComponentDocData = {
  displayName: 'ImageCarousel',
  importPath: '@/components',
  importStatement: `import { ImageCarousel } from '@/components'\nimport type { ImageCarouselProps } from '@/components'`,
  description: 'A touch-friendly image carousel with thumbnail navigation, arrow controls, keyboard support, and screen reader announcements. Designed for product detail pages.',
  props: [
    { name: 'images', type: 'string[]', description: 'Array of image URLs to display' },
    { name: 'alts', type: 'string[]', description: 'Alt text for each image (matches by index)' },
    { name: 'height', type: 'string', default: "'280px'", description: 'Height of the carousel container' },
    { name: 'backgroundColor', type: 'string', description: 'Background color behind images' },
    { name: 'radius', type: 'string', description: 'Border radius of the carousel' },
    { name: 'objectFit', type: "'contain' | 'cover'", default: "'cover'", description: 'Object fit for images' },
    { name: 'navigationStyle', type: "'thumbnails' | 'dots' | 'both'", default: "'thumbnails'", description: 'Navigation indicator style: thumbnail images, dot indicators, or both' },
    { name: 'showNavigation', type: 'boolean', default: 'true', description: 'Show prev/next arrows and pagination' },
    { name: 'onSlideChange', type: '(index: number) => void', description: 'Called when the active slide changes' },
    { name: 'aria-label', type: 'string', default: "'Product images'", description: 'Accessible label for the carousel region' },
  ],
  accessibility: [
    { feature: 'Carousel Pattern', description: 'Uses role="region" with aria-roledescription="carousel" per WAI-ARIA carousel pattern.' },
    { feature: 'Slide Semantics', description: 'Each slide uses role="group" with aria-roledescription="slide" and aria-label.' },
    { feature: 'Keyboard Navigation', description: 'Arrow Left/Right keys navigate between slides when carousel is focused.' },
    { feature: 'Screen Reader', description: 'aria-live="polite" region announces current slide position on change.' },
    { feature: 'Focus Visible', description: 'Visible focus ring via :focus-visible on the carousel container.' },
    { feature: 'Reduced Motion', description: 'Slide transitions disabled when prefers-reduced-motion: reduce is set.' },
    { feature: 'Touch Target', description: 'Thumbnail indicators are 72x48px, exceeding minimum touch target requirements.' },
  ],
  tokens: [
    { token: 'colors.surface.lightDarker', value: 'Light gray', usage: 'Default carousel background' },
    { token: 'colors.focusBorder.onLight', value: 'Focus blue', usage: 'Active thumbnail border' },
    { token: 'colors.border.lowEmphasis.onLight', value: 'Light gray', usage: 'Inactive thumbnail border' },
    { token: 'borderRadius.lg', value: '12px', usage: 'Main image border radius' },
    { token: 'borderRadius.md', value: '8px', usage: 'Thumbnail border radius' },
    { token: 'borderRadius.full', value: '9999px', usage: 'Dot indicator border radius' },
    { token: 'colors.text.highEmphasis.onLight', value: 'Dark', usage: 'Active dot indicator color' },
    { token: 'spacing.xs', value: '8px', usage: 'Gap between image and thumbnails' },
    { token: 'spacing.md', value: '16px', usage: 'Gap between thumbnails / below navigation / image padding (contain mode)' },
    { token: 'transitionPresets.default', value: '200ms ease-out', usage: 'Slide transition' },
    { token: 'transitionPresets.fast', value: '150ms ease-out', usage: 'Thumbnail and arrow transitions' },
  ],
  relatedComponents: [
    { name: 'Product Card', href: '/components/product-card' },
  ],
  notes: [
    'Pass matching alts[] for each image for accessibility compliance.',
    'The carousel renders nothing if images[] is empty.',
    'Three navigation indicator styles: thumbnails (default), dots (compact pill indicators), or both.',
    'Arrow buttons and pagination controlled separately via showNavigation prop.',
    'Dot indicators use a pill shape for the active slide and circles for inactive slides.',
    'Single-image carousels hide all navigation controls.',
  ],
  whenToUse: [
    'Image galleries for products, facilities, or documentation photos.',
    'Multiple images that should be browsable with navigation controls.',
  ],
  usageExamples: [
    {
      title: 'Product image gallery',
      description: 'Always provide alt text for each image. Use thumbnails for product detail pages.',
      isDefault: true,
      code: `<ImageCarousel\n  images={product.images}\n  alts={product.imageAlts}\n  indicatorStyle="thumbnails"\n/>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function ImageCarouselPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoHeight, setDemoHeight] = useState<'200px' | '280px' | '360px'>('280px')
  const [demoObjectFit, setDemoObjectFit] = useState<'contain' | 'cover'>('cover')
  const [demoImageCount, setDemoImageCount] = useState<1 | 2 | 3>(3)
  const [demoShowNav, setDemoShowNav] = useState(true)
  const [demoNavStyle, setDemoNavStyle] = useState<NavigationStyle>('thumbnails')

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const visibleImages = demoImages.slice(0, demoImageCount)
  const visibleAlts = demoAlts.slice(0, demoImageCount)

  return (
    <StyleguideLayout
      title="Image Carousel"
      description="A touch-friendly image carousel with thumbnail navigation, arrow controls, and keyboard support. Built for product detail pages in the Canopy Registry."
      tagline="One image at a time, all the impact."
      activeId="image-carousel"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
    >
      {/* ========== OVERVIEW TAB ========== */}
      {activePageTab === 'overview' && (
        <>
          {/* Quick Start */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`import { ImageCarousel } from '@/components'

<ImageCarousel
  images={['/img/product-1.jpg', '/img/product-2.jpg']}
  alts={['Front view', 'Back view']}
  height="280px"
/>`}</CodeBlock>
            </div>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Experiment with carousel properties. Use arrow keys or swipe to navigate slides.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview */}
                <div>
                  <Playground
                    preview={
                      <div style={{ width: '100%', padding: spacing.md }}>
                        <ImageCarousel
                          images={visibleImages}
                          alts={visibleAlts}
                          height={demoHeight}
                          objectFit={demoObjectFit}
                          navigationStyle={demoNavStyle}
                          showNavigation={demoShowNav}
                        />
                      </div>
                    }
                    code={`<ImageCarousel
  images={[${visibleImages.map((_, i) => `'image-${i + 1}.jpg'`).join(', ')}]}
  alts={[${visibleAlts.map(a => `'${a}'`).join(', ')}]}
  height="${demoHeight}"${demoObjectFit !== 'cover' ? `\n  objectFit="${demoObjectFit}"` : ''}${demoNavStyle !== 'thumbnails' ? `\n  navigationStyle="${demoNavStyle}"` : ''}${!demoShowNav ? `\n  showNavigation={false}` : ''}
/>`}
                    previewPadding={spacing.xs}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Height */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Height
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {([
                          { value: '200px' as const, label: 'Compact' },
                          { value: '280px' as const, label: 'Default' },
                          { value: '360px' as const, label: 'Tall' },
                        ]).map(h => (
                          <PillButton
                            key={h.value}
                            onClick={() => setDemoHeight(h.value)}
                            isActive={demoHeight === h.value}
                          >
                            {h.label}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Object Fit */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Object Fit
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['contain', 'cover'] as const).map(f => (
                          <PillButton
                            key={f}
                            onClick={() => setDemoObjectFit(f)}
                            isActive={demoObjectFit === f}
                          >
                            {f}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Navigation
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {([
                          { value: true, label: 'Visible' },
                          { value: false, label: 'Hidden' },
                        ]).map(n => (
                          <PillButton
                            key={String(n.value)}
                            onClick={() => setDemoShowNav(n.value)}
                            isActive={demoShowNav === n.value}
                          >
                            {n.label}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Style */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Indicator Style
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {([
                          { value: 'thumbnails' as const, label: 'Thumbnails' },
                          { value: 'dots' as const, label: 'Dots' },
                          { value: 'both' as const, label: 'Both' },
                        ]).map(s => (
                          <PillButton
                            key={s.value}
                            onClick={() => setDemoNavStyle(s.value)}
                            isActive={demoNavStyle === s.value}
                          >
                            {s.label}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Image Count */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Images
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {([1, 2, 3] as const).map(n => (
                          <PillButton
                            key={n}
                            onClick={() => setDemoImageCount(n)}
                            isActive={demoImageCount === n}
                          >
                            {n} image{n > 1 ? 's' : ''}
                          </PillButton>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Design Tokens */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Spacing, color, and dimension values used in the ImageCarousel component.
              </p>

              {/* Colors */}
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Colors</h3>
                <SpecTable
                  headers={['Element', 'Token', 'Usage']}
                  rows={[
                    ['Background', <CopyableToken key="bg" token="colors.surface.lightDarker" />, 'Carousel container background'],
                    ['Active thumb border', <CopyableToken key="ad" token="colors.focusBorder.onLight" />, 'Selected thumbnail border (2px)'],
                    ['Inactive thumb border', <CopyableToken key="id" token="colors.border.lowEmphasis.onLight" />, 'Unselected thumbnail border (1px)'],
                    ['Arrow buttons', <code key="ab">rgba(255, 255, 255, 0.8)</code>, 'Semi-transparent white circles'],
                    ['Focus ring', <CopyableToken key="fr" token="colors.focusBorder.onLight" />, 'Keyboard focus indicator'],
                  ]}
                />
              </div>

              {/* Spacing & Dimensions */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Spacing & Dimensions</h3>
                <SpecTable
                  headers={['Property', 'Token', 'Value']}
                  rows={[
                    ['Image padding (contain)', <CopyableToken key="ip" token="spacing.md" />, <PixelValue key="ipv" value={spacing.md} />],
                    ['Image → thumbnails gap', <CopyableToken key="ig" token="spacing.xs" />, <PixelValue key="igv" value={spacing.xs} />],
                    ['Thumbnail gap', <CopyableToken key="tg" token="spacing.md" />, <PixelValue key="tgv" value={spacing.md} />],
                    ['Below navigation', <CopyableToken key="bn" token="spacing.md" />, <PixelValue key="bnv" value={spacing.md} />],
                    ['Thumbnail size', <code key="ts">72 × 48px</code>, '3:2 ratio'],
                    ['Image radius', <CopyableToken key="br" token="borderRadius.lg" />, <PixelValue key="brv" value="12px" />],
                    ['Thumbnail radius', <CopyableToken key="tr" token="borderRadius.md" />, <PixelValue key="trv" value="8px" />],
                    ['Arrow button size', <code key="as">36px</code>, '36px'],
                  ]}
                />
              </div>

              {/* Animation */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Animation</h3>
                <SpecTable
                  headers={['Property', 'Token', 'Value']}
                  rows={[
                    ['Slide transition', <CopyableToken key="st" token="transitionPresets.default" />, '200ms ease-out'],
                    ['Thumbnail/arrow transition', <CopyableToken key="dt" token="transitionPresets.fast" />, '150ms ease-out'],
                    ['Reduced motion', <code key="rm">@media (prefers-reduced-motion)</code>, 'All transitions disabled'],
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
          {/* Usage */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>{`import { ImageCarousel } from '@/components'
import type { ImageCarouselProps } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>{`// Multiple product images
<ImageCarousel
  images={['/img/front.jpg', '/img/back.jpg', '/img/detail.jpg']}
  alts={['Front view', 'Back view', 'Detail close-up']}
/>

// Single image (no navigation shown)
<ImageCarousel
  images={['/img/product.jpg']}
  alts={['Product photo']}
/>

// Custom height with contain fit
<ImageCarousel
  images={productImages}
  alts={productAlts}
  height="360px"
  objectFit="contain"
/>

// Dot indicators (compact, no thumbnails)
<ImageCarousel
  images={productImages}
  alts={productAlts}
  navigationStyle="dots"
/>

// Both dots and thumbnails
<ImageCarousel
  images={productImages}
  alts={productAlts}
  navigationStyle="both"
/>

// With slide change callback
<ImageCarousel
  images={images}
  onSlideChange={(index) => console.log('Active slide:', index)}
/>`}</CodeBlock>
            </div>
          </section>

          {/* Props */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>ImageCarousel Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="p1">images</code>, <code key="t1">string[]</code>, <code key="d1">required</code>, 'Array of image URLs'],
                  [<code key="p2">alts</code>, <code key="t2">string[]</code>, <code key="d2">[]</code>, 'Alt text per image (by index)'],
                  [<code key="p3">height</code>, <code key="t3">string</code>, <code key="d3">{`'280px'`}</code>, 'Container height'],
                  [<code key="p4">backgroundColor</code>, <code key="t4">string</code>, <code key="d4">surface.lightDarker</code>, 'Background behind images'],
                  [<code key="p5">radius</code>, <code key="t5">string</code>, <code key="d5">borderRadius.lg</code>, 'Border radius'],
                  [<code key="p6">objectFit</code>, <code key="t6">{`'contain' | 'cover'`}</code>, <code key="d6">{`'cover'`}</code>, 'How images fill their container'],
                  [<code key="p6a">navigationStyle</code>, <code key="t6a">{`'thumbnails' | 'dots' | 'both'`}</code>, <code key="d6a">{`'thumbnails'`}</code>, 'Navigation indicator style'],
                  [<code key="p6b">showNavigation</code>, <code key="t6b">boolean</code>, <code key="d6b">true</code>, 'Show prev/next arrows and pagination'],
                  [<code key="p7">onSlideChange</code>, <code key="t7">(index: number) =&gt; void</code>, <code key="d7">-</code>, 'Callback on slide change'],
                  [<code key="p8">aria-label</code>, <code key="t8">string</code>, <code key="d8">{`'Product images'`}</code>, 'Accessible label for the region'],
                ]}
              />
            </div>
          </section>

          {/* Design Guidance */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use</h3>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Product detail pages with multiple product photos</li>
                <li>Customer-facing previews (QR scans, RID lookups)</li>
                <li>Any context where users browse through a small set of related images</li>
              </ul>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Provide descriptive alt text for every image', 'Leave alts empty — screen readers need them'],
                  ['Use contain for product photos with varied aspect ratios', 'Use cover if cropping would hide important product details'],
                  ['Keep image sets small (2-5 images)', 'Use as a content slider for 10+ items — use a list instead'],
                  ['Use height appropriate to the content area', 'Set a fixed height that crops images on mobile'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Carousel uses <code>role=&quot;region&quot;</code> with <code>aria-roledescription=&quot;carousel&quot;</code></li>
                <li>Each slide has <code>role=&quot;group&quot;</code> with <code>aria-roledescription=&quot;slide&quot;</code></li>
                <li>Arrow Left/Right keys navigate slides when the carousel has focus</li>
                <li>Live region announces &quot;Image X of Y&quot; on slide change</li>
                <li>Focus ring visible via <code>:focus-visible</code> (no outline suppression)</li>
                <li>Respects <code>prefers-reduced-motion</code> — transitions are disabled</li>
                <li>Thumbnail indicators are 72×48px — well above WCAG 2.5.8 minimum touch target</li>
              </ul>
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={imageCarouselDocData} />
      )}
    </StyleguideLayout>
  )
}
