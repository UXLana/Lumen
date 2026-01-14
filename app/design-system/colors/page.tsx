'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable } from '../shared'
import { colors, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// COLOR SWATCH COMPONENT
// =============================================================================

function ColorSwatch({ 
  name, 
  value, 
  onDarkBg = false,
}: { 
  name: string
  value: string
  onDarkBg?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const isTransparent = value.includes('rgba')
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  
  const checkerboardBg = `
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%)
  `
  
  return (
    <div 
      onClick={copyToClipboard}
      style={{
        cursor: 'pointer',
        transition: 'transform 0.15s ease',
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: '80px',
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        border: `1px solid ${colors.border.light}`,
        marginBottom: '8px',
        ...(onDarkBg ? { background: colors.brand.primary } : {}),
      }}>
        {isTransparent && !onDarkBg && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: checkerboardBg,
            backgroundSize: '12px 12px',
            backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
          }} />
        )}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: value,
        }} />
        {copied && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            Copied!
          </div>
        )}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: colors.text.highEmphasis }}>
        {name}
      </div>
      <div style={{ fontSize: '11px', color: colors.text.mediumEmphasis, fontFamily: 'monospace' }}>
        {value}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function ColorsPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <StyleguideLayout
      title="Colors"
      description="The color system provides a comprehensive palette for creating consistent, accessible interfaces across the design system."
      activeId="colors"
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Brand Colors */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Brand Colors</h2>
            <p style={sharedStyles.sectionDescription}>
              Core brand colors that define the visual identity.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <ColorSwatch name="Primary" value={colors.brand.primary} />
                <ColorSwatch name="Primary Light" value={colors.brand.primaryLight} />
                <ColorSwatch name="Primary Dark" value={colors.brand.primaryDark} />
              </div>
            </div>
          </section>

          {/* Primary Palette */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Primary Palette</h2>
            <p style={sharedStyles.sectionDescription}>
              Extended primary color scale derived from the brand color.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                {Object.entries(colors.primary).map(([key, value]) => (
                  <ColorSwatch key={key} name={key} value={value} />
                ))}
              </div>
            </div>
          </section>

          {/* Secondary Palette */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Secondary Palette</h2>
            <p style={sharedStyles.sectionDescription}>
              Secondary color scale for accents and highlights.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                {Object.entries(colors.secondary).map(([key, value]) => (
                  <ColorSwatch key={key} name={key} value={value} />
                ))}
              </div>
            </div>
          </section>

          {/* Neutral Colors */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Neutral Colors</h2>
            <p style={sharedStyles.sectionDescription}>
              Grayscale palette for text, backgrounds, and borders.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
                {Object.entries(colors.neutral).map(([key, value]) => (
                  <ColorSwatch key={key} name={key} value={value} />
                ))}
              </div>
            </div>
          </section>

          {/* Semantic Colors */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Semantic Colors</h2>
            <p style={sharedStyles.sectionDescription}>
              Contextual colors for feedback and status indicators.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              {Object.entries(colors.semantic).map(([name, variants]) => (
                <div key={name} style={sharedStyles.card}>
                  <h3 style={{ ...sharedStyles.cardTitle, textTransform: 'capitalize' }}>{name}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {Object.entries(variants).map(([variant, value]) => (
                      <ColorSwatch key={variant} name={variant} value={value} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Text Colors */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Text Colors</h2>
            <p style={sharedStyles.sectionDescription}>
              Text colors with varying emphasis levels for light and dark backgrounds.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>On Light Background</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <ColorSwatch name="High Emphasis" value={colors.text.highEmphasis} />
                  <ColorSwatch name="Medium Emphasis" value={colors.text.mediumEmphasis} />
                  <ColorSwatch name="Low Emphasis" value={colors.text.lowEmphasis} />
                  <ColorSwatch name="Disabled" value={colors.text.disabled} />
                </div>
              </div>

              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>On Dark Background</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <ColorSwatch name="High Emphasis" value={colors.text.highEmphasisOnDark} onDarkBg />
                  <ColorSwatch name="Medium Emphasis" value={colors.text.mediumEmphasisOnDark} onDarkBg />
                  <ColorSwatch name="Low Emphasis" value={colors.text.lowEmphasisOnDark} onDarkBg />
                  <ColorSwatch name="Disabled" value={colors.text.disabledOnDark} onDarkBg />
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Specifications Tab */}
      {activeTab === 'specs' && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Color Specifications</h2>
          <p style={sharedStyles.sectionDescription}>
            Complete token reference for all color values.
          </p>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Brand Colors</h3>
            <SpecTable
              headers={['Token', 'Value', 'Usage']}
              rows={[
                [<code key="bp">colors.brand.primary</code>, colors.brand.primary, 'Primary brand color, main CTAs'],
                [<code key="bpl">colors.brand.primaryLight</code>, colors.brand.primaryLight, 'Hover states, secondary emphasis'],
                [<code key="bpd">colors.brand.primaryDark</code>, colors.brand.primaryDark, 'Active states, dark mode'],
              ]}
            />
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Text Colors</h3>
            <SpecTable
              headers={['Token', 'Value', 'Usage']}
              rows={[
                [<code key="the">colors.text.highEmphasis</code>, colors.text.highEmphasis, 'Primary text, headings'],
                [<code key="tme">colors.text.mediumEmphasis</code>, colors.text.mediumEmphasis, 'Secondary text, descriptions'],
                [<code key="tle">colors.text.lowEmphasis</code>, colors.text.lowEmphasis, 'Tertiary text, placeholders'],
                [<code key="td">colors.text.disabled</code>, colors.text.disabled, 'Disabled text'],
              ]}
            />
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Semantic Colors</h3>
            <SpecTable
              headers={['Token', 'Value', 'Usage']}
              rows={[
                [<code key="ss">colors.semantic.success.main</code>, colors.semantic.success.main, 'Success states'],
                [<code key="sw">colors.semantic.warning.main</code>, colors.semantic.warning.main, 'Warning states'],
                [<code key="se">colors.semantic.error.main</code>, colors.semantic.error.main, 'Error states'],
                [<code key="si">colors.semantic.info.main</code>, colors.semantic.info.main, 'Info states'],
              ]}
            />
          </div>
        </section>
      )}

      {/* Usage Tab */}
      {activeTab === 'usage' && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Usage</h2>
          <p style={sharedStyles.sectionDescription}>
            How to import and use color tokens in your components.
          </p>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Import</h3>
            <CodeBlock>{`import { colors } from '@/styles/design-tokens'`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Example</h3>
            <CodeBlock>{`// Brand colors
background: colors.brand.primary

// Text colors
color: colors.text.highEmphasis
color: colors.text.mediumEmphasis

// Semantic colors
color: colors.semantic.success.main
background: colors.semantic.error.light

// Neutral palette
background: colors.neutral[100]
border: colors.border.light`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: colors.text.mediumEmphasis }}>
              <li style={{ marginBottom: '8px' }}>Use semantic colors for feedback states (success, warning, error, info)</li>
              <li style={{ marginBottom: '8px' }}>Use text colors with appropriate emphasis levels for hierarchy</li>
              <li style={{ marginBottom: '8px' }}>Use neutral colors for backgrounds and borders</li>
              <li style={{ marginBottom: '8px' }}>Always use tokens instead of hardcoded hex values</li>
            </ul>
          </div>
        </section>
      )}
    </StyleguideLayout>
  )
}
