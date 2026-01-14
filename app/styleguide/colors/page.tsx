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
  return (
    <StyleguideLayout
      title="Colors"
      description="The color system provides a comprehensive palette for creating consistent, accessible interfaces across the design system."
      activeId="colors"
    >
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
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Specifications</h3>
          <SpecTable
            headers={['Token', 'Value', 'Usage']}
            rows={[
              [<code>colors.brand.primary</code>, colors.brand.primary, 'Primary brand color, main CTAs'],
              [<code>colors.brand.primaryLight</code>, colors.brand.primaryLight, 'Hover states, secondary emphasis'],
              [<code>colors.brand.primaryDark</code>, colors.brand.primaryDark, 'Active states, dark mode'],
            ]}
          />
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

      {/* Usage */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Usage</h2>
        
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
      </section>
    </StyleguideLayout>
  )
}
