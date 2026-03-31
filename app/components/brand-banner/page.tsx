'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  Playground,
  PillButton,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import { BrandBanner, BrandBannerBackground } from '@/components'
import { colors, spacing, fontFamilies, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// DOCUMENTATION DATA
// =============================================================================

const brandBannerDocData: ComponentDocData = {
  displayName: 'BrandBanner',
  importPath: '@/components',
  importStatement: `import { BrandBanner } from '@/components'\nimport type { BrandBannerProps, BrandBannerBackground } from '@/components'`,
  description:
    'A prominent, customizable greeting/hero banner for dashboard and landing pages. Supports editable copy and configurable brand color or gradient backgrounds.',
  props: [
    { name: 'heading', type: 'string', description: 'Primary heading text (required)' },
    { name: 'subtitle', type: 'string', description: 'Supporting subtitle text' },
    {
      name: 'backgroundStyle',
      type: "'solid' | 'gradient'",
      default: "'solid'",
      description: 'Whether to use a solid color or gradient background',
    },
    {
      name: 'brandColor',
      type: 'string',
      description: 'Primary brand color (hex). Defaults to theme brand color.',
    },
    {
      name: 'gradientEndColor',
      type: 'string',
      description: 'Secondary color for gradient mode. Auto-darkened if omitted.',
    },
    {
      name: 'gradientAngle',
      type: 'number',
      default: '135',
      description: 'Gradient direction in degrees',
    },
    {
      name: 'trailing',
      type: 'ReactNode',
      description: 'Optional content on the right side (avatar, icon, illustration)',
    },
    { name: 'className', type: 'string', description: 'Additional CSS class' },
    { name: 'style', type: 'CSSProperties', description: 'Additional inline styles' },
  ],
  typeDefinitions: [
    {
      name: 'BrandBannerBackground',
      definition: "type BrandBannerBackground = 'solid' | 'gradient'",
    },
  ],
  accessibility: [
    {
      feature: 'ARIA Role',
      description: 'Uses role="banner" with aria-label matching the heading text.',
    },
    {
      feature: 'Auto-Contrast',
      description:
        'Text color automatically adjusts to white or dark based on background luminance for WCAG compliance.',
    },
    {
      feature: 'Semantic HTML',
      description: 'Uses <h2> for heading and <p> for subtitle for proper document structure.',
    },
  ],
  tokens: [
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Default background color' },
    { token: 'borderRadius.lg', value: '16px', usage: 'Banner corner rounding' },
    { token: 'shadows.sm', value: 'Subtle shadow', usage: 'Elevation' },
    { token: 'spacing.xl / spacing.2xl', value: '24px / 32px', usage: 'Internal padding' },
  ],
  relatedComponents: [
    { name: 'Banner', href: '/components/banner' },
    { name: 'Header', href: '/components/header' },
  ],
  notes: [
    'Use at the top of dashboard pages to greet users or set context.',
    'Gradient mode auto-generates a darker end color if only brandColor is provided.',
    'Text color is automatically calculated for contrast — no need to set manually.',
    'Use the trailing prop for decorative elements like avatars or illustrations.',
  ],
  whenToUse: [
    'Dashboard hero area to greet users, set context, or highlight key actions.',
    'Full-width branded sections with gradient backgrounds.',
  ],
  whenNotToUse: [
    { scenario: 'System messages, warnings, or errors', instead: 'Banner — semantic variants with icons and actions' },
  ],
}

// =============================================================================
// PRESET COLORS
// =============================================================================

const presetColors = [
  { label: 'Theme Default', value: '' },
  { label: 'Teal', value: '#2D6A4F' },
  { label: 'Navy', value: '#1B3A5C' },
  { label: 'Purple', value: '#5B21B6' },
  { label: 'Coral', value: '#C44536' },
  { label: 'Slate', value: '#334155' },
  { label: 'Forest', value: '#14532D' },
]

// =============================================================================
// PAGE COMPONENT
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

export default function BrandBannerPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [heading, setHeading] = useState('Good afternoon, Jane')
  const [subtitle, setSubtitle] = useState(
    "Here's what's happening in your registry today."
  )
  const [bgStyle, setBgStyle] = useState<BrandBannerBackground>('solid')
  const [selectedColor, setSelectedColor] = useState('')
  const [gradientAngle, setGradientAngle] = useState(135)

  const bgStyles: BrandBannerBackground[] = ['solid', 'gradient']

  return (
    <StyleguideLayout
      activeId="brand-banner"
      title="Brand Banner"
      description="Brand banners display prominent branding elements with customizable backgrounds, logos, and messaging."
    >
      <div style={sharedStyles.content}>
        {/* Hero */}
        <div style={{ marginBottom: spacing['2xl'] }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: colors.text.highEmphasis.onLight,
              fontFamily: fontFamilies.body,
              margin: 0,
            }}
          >
            Brand Banner
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: colors.text.lowEmphasis.onLight,
              fontFamily: fontFamilies.body,
              marginTop: spacing.xs,
            }}
          >
            A customizable greeting/hero banner with editable copy and brand
            color or gradient backgrounds.
          </p>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            gap: spacing.xs,
            marginBottom: spacing['2xl'],
            borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
            paddingBottom: spacing.xs,
          }}
        >
          {(['overview', 'implementation', 'documentation'] as PageTab[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActivePageTab(tab)}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: fontFamilies.body,
                  fontSize: '14px',
                  fontWeight: activePageTab === tab ? 600 : 400,
                  color:
                    activePageTab === tab
                      ? colors.brand.default
                      : colors.text.lowEmphasis.onLight,
                  borderBottom:
                    activePageTab === tab
                      ? `2px solid ${colors.brand.default}`
                      : '2px solid transparent',
                  marginBottom: '-9px',
                  transition: 'all 150ms ease',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Overview Tab */}
        {activePageTab === 'overview' && (
          <>
            {/* Live playground */}
            <Playground
              preview={
                <BrandBanner
                  heading={heading}
                  subtitle={subtitle}
                  backgroundStyle={bgStyle}
                  brandColor={selectedColor || undefined}
                  gradientAngle={gradientAngle}
                />
              }
              code={`<BrandBanner\n  heading="${heading}"\n  subtitle="${subtitle}"\n  backgroundStyle="${bgStyle}"${selectedColor ? `\n  brandColor="${selectedColor}"` : ''}${bgStyle === 'gradient' ? `\n  gradientAngle={${gradientAngle}}` : ''}\n/>`}
              previewBackground={colors.surface.light}
              previewStretch
              previewPadding="24px"
            />

            {/* Controls */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: spacing.md,
                marginTop: spacing.xl,
                padding: spacing.xl,
                background: colors.surface.lightDarker,
                borderRadius: borderRadius.lg,
              }}
            >
              {/* Heading */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.text.lowEmphasis.onLight,
                    marginBottom: '4px',
                    fontFamily: fontFamilies.body,
                  }}
                >
                  Heading
                </label>
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${colors.border.midEmphasis.onLight}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: fontFamilies.body,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Subtitle */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.text.lowEmphasis.onLight,
                    marginBottom: '4px',
                    fontFamily: fontFamilies.body,
                  }}
                >
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${colors.border.midEmphasis.onLight}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: fontFamilies.body,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Background style */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.text.lowEmphasis.onLight,
                    marginBottom: '4px',
                    fontFamily: fontFamilies.body,
                  }}
                >
                  Background Style
                </label>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                  {bgStyles.map((s) => (
                    <PillButton
                      key={s}
                      isActive={bgStyle === s}
                      onClick={() => setBgStyle(s)}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </PillButton>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.text.lowEmphasis.onLight,
                    marginBottom: '4px',
                    fontFamily: fontFamilies.body,
                  }}
                >
                  Brand Color
                </label>
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  {presetColors.map((c) => (
                    <button
                      key={c.label}
                      title={c.label}
                      onClick={() => setSelectedColor(c.value)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border:
                          selectedColor === c.value
                            ? `2px solid ${colors.brand.default}`
                            : `1px solid ${colors.border.midEmphasis.onLight}`,
                        background: c.value || colors.brand.default,
                        cursor: 'pointer',
                        padding: 0,
                        outline:
                          selectedColor === c.value
                            ? `2px solid ${colors.selectedHighlight}`
                            : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Gradient angle (only when gradient) */}
              {bgStyle === 'gradient' && (
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: colors.text.lowEmphasis.onLight,
                      marginBottom: '4px',
                      fontFamily: fontFamilies.body,
                    }}
                  >
                    Gradient Angle: {gradientAngle}deg
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={gradientAngle}
                    onChange={(e) =>
                      setGradientAngle(Number(e.target.value))
                    }
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </div>

            {/* Examples */}
            <div style={{ marginTop: spacing['2xl'] }}>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: colors.text.highEmphasis.onLight,
                  fontFamily: fontFamilies.body,
                  marginBottom: spacing.md,
                }}
              >
                Examples
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.md,
                }}
              >
                <BrandBanner
                  heading="Welcome back, Sarah"
                  subtitle="You have 12 pending approvals and 3 new messages."
                />

                <BrandBanner
                  heading="Good morning, Alex"
                  subtitle="Your compliance dashboard is up to date."
                  backgroundStyle="gradient"
                  brandColor="#1B3A5C"
                />

                <BrandBanner
                  heading="Ready to launch?"
                  subtitle="Your product catalog has been verified and is ready for publishing."
                  backgroundStyle="gradient"
                  brandColor="#5B21B6"
                  gradientAngle={180}
                />
              </div>
            </div>
          </>
        )}

        {/* Implementation Tab */}
        {activePageTab === 'implementation' && (
          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: colors.text.highEmphasis.onLight,
                fontFamily: fontFamilies.body,
                marginBottom: spacing.md,
              }}
            >
              Usage
            </h2>

            <CodeBlock>{`import { BrandBanner } from '@/components'

// Solid brand color (theme default)
<BrandBanner
  heading="Good afternoon, Jane"
  subtitle="Here's what's happening in your registry today."
/>

// Custom gradient
<BrandBanner
  heading="Welcome back"
  subtitle="You have 3 new notifications."
  backgroundStyle="gradient"
  brandColor="#2D6A4F"
  gradientEndColor="#1B4332"
/>

// With trailing content
<BrandBanner
  heading="Hi there!"
  subtitle="Your dashboard is ready."
  trailing={<Avatar name="Jane" size="lg" />}
/>`}</CodeBlock>
          </div>
        )}

        {/* Documentation Tab */}
        {activePageTab === 'documentation' && (
          <ComponentDocumentation data={brandBannerDocData} />
        )}
      </div>
    </StyleguideLayout>
  )
}
