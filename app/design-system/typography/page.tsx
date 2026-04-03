'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable } from '../shared'
import { colors, typography, fontFamilies, fontWeights } from '@/styles/design-tokens'
import { useTheme } from '@/styles/themes'

// =============================================================================
// TYPOGRAPHY SAMPLE COMPONENT
// =============================================================================

function TypographySample({ 
  name, 
  style, 
  sampleText 
}: { 
  name: string
  style: React.CSSProperties
  sampleText?: string
}) {
  return (
    <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight }}>{name}</span>
        <span style={{ ...typography.code.sm, color: colors.text.lowEmphasis.onLight }}>
          {style.fontSize} / {style.lineHeight}
        </span>
      </div>
      <p style={{ ...style, color: colors.text.highEmphasis.onLight, margin: 0 }}>
        {sampleText || 'The quick brown fox jumps over the lazy dog'}
      </p>
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function TypographyPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const theme = useTheme()

  // Extract human-readable font info from the theme's raw font stacks.
  // Theme values may contain CSS var() references (e.g. "var(--font-inter), sans-serif")
  // so we resolve those to friendly names for display.
  const resolveVarName = (stack: string) => {
    // "var(--font-inter), sans-serif" → "Inter"
    // '"DM Sans", sans-serif' → "DM Sans"
    // '"Segoe UI", var(--font-inter), ...' → "Segoe UI"
    const varMatch = stack.match(/var\(--font-([^)]+)\)/)
    const quotedMatch = stack.match(/^"([^"]+)"/)
    if (quotedMatch) return quotedMatch[1]
    if (varMatch) {
      // --font-inter → Inter, --font-dm-sans → DM Sans
      return varMatch[1]
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    }
    return stack.split(',')[0].replace(/"/g, '').trim()
  }

  const displayFontName = resolveVarName(theme.typography.fontFamilies.display)
  const bodyFontName = resolveVarName(theme.typography.fontFamilies.body)
  // For spec table "Value" column, show the friendly name + fallbacks (not raw var())
  const friendlyStack = (name: string, stack: string) => {
    const fallbacks = stack.split(',').slice(1).map(s => s.trim()).join(', ')
    return fallbacks ? `"${name}", ${fallbacks}` : `"${name}"`
  }
  const displayFontStack = friendlyStack(displayFontName, theme.typography.fontFamilies.display)
  const bodyFontStack = friendlyStack(bodyFontName, theme.typography.fontFamilies.body)
  const monoFontStack = theme.typography.fontFamilies.mono

  return (
    <StyleguideLayout
      title="Typography"
      description="Words that work harder."
      activeId="typography"
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Font Families */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Font Families</h2>
        <p style={sharedStyles.sectionDescription}>
          The design system uses {displayFontName} for UI text and system monospace for code.
        </p>

        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>{displayFontName}</h3>
          <p style={{ ...typography.body.md, marginBottom: '16px', color: colors.text.lowEmphasis.onLight }}>
            Primary typeface for display, heading, body, and label text.
          </p>
          <p style={{ fontFamily: fontFamilies.display, fontSize: '32px', fontWeight: 600, color: colors.text.highEmphasis.onLight }}>
            Aa Bb Cc Dd Ee
          </p>
          <p style={{ fontFamily: fontFamilies.display, fontSize: '18px', marginTop: '8px', color: colors.text.highEmphasis.onLight }}>
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
            abcdefghijklmnopqrstuvwxyz<br/>
            0123456789
          </p>
        </div>

        <div style={{ ...sharedStyles.card, marginTop: '24px' }}>
          <h3 style={sharedStyles.cardTitle}>System Monospace</h3>
          <p style={{ ...typography.body.md, marginBottom: '16px', color: colors.text.lowEmphasis.onLight }}>
            System monospace typeface for code blocks and technical content.
          </p>
          <code style={{ display: 'block', fontSize: '32px', background: 'transparent', fontFamily: fontFamilies.mono, color: colors.text.highEmphasis.onLight }}>
            Aa Bb Cc Dd Ee
          </code>
          <code style={{ display: 'block', fontSize: '18px', marginTop: '8px', background: 'transparent', fontFamily: fontFamilies.mono, color: colors.text.highEmphasis.onLight }}>
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
            abcdefghijklmnopqrstuvwxyz<br/>
            0123456789
          </code>
        </div>

        <div style={{ ...sharedStyles.card, marginTop: '24px' }}>
          <h3 style={sharedStyles.cardTitle}>Specifications</h3>
          <SpecTable
            headers={['Token', 'Value', 'Usage']}
            rows={[
              [<code>fontFamilies.display</code>, displayFontStack, 'Display, headings'],
              [<code>fontFamilies.body</code>, bodyFontStack, 'Body text, labels'],
              [<code>fontFamilies.mono</code>, monoFontStack, 'Code, technical content'],
            ]}
          />
        </div>
      </section>

      {/* Font Weights */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Font Weights</h2>
        
        <div style={sharedStyles.card}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {Object.entries(fontWeights).map(([name, value]) => (
              <div key={name}>
                <p style={{ fontFamily: fontFamilies.display, fontSize: '24px', fontWeight: value, marginBottom: '8px', color: colors.text.highEmphasis.onLight }}>
                  Ag
                </p>
                <p style={{ ...typography.label.sm, color: colors.text.highEmphasis.onLight, textTransform: 'capitalize' }}>
                  {name}
                </p>
                <p style={{ ...typography.code.sm, color: colors.text.lowEmphasis.onLight }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Display Styles */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Display Styles</h2>
        <p style={sharedStyles.sectionDescription}>
          Large-scale typography for hero sections, page titles, and marketing content.
        </p>
        
        <div style={sharedStyles.card}>
          {Object.entries(typography.display).map(([name, style]) => (
            <TypographySample 
              key={name} 
              name={`display.${name}`} 
              style={style}
              sampleText={name === '2xl' ? 'Hero Title' : name === 'xl' ? 'Page Header' : undefined}
            />
          ))}
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Specifications</h3>
          <SpecTable
            headers={['Token', 'Size', 'Weight', 'Line Height', 'Letter Spacing']}
            rows={Object.entries(typography.display).map(([name, style]) => [
              <code>typography.display.{name}</code>,
              style.fontSize,
              style.fontWeight,
              style.lineHeight,
              style.letterSpacing,
            ])}
          />
        </div>
      </section>

      {/* Heading Styles */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Heading Styles</h2>
        <p style={sharedStyles.sectionDescription}>
          Section and content headings for organizing information hierarchy.
        </p>
        
        <div style={sharedStyles.card}>
          {Object.entries(typography.heading).map(([name, style]) => (
            <TypographySample key={name} name={`heading.${name}`} style={style} />
          ))}
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Specifications</h3>
          <SpecTable
            headers={['Token', 'Size', 'Weight', 'Line Height', 'Letter Spacing']}
            rows={Object.entries(typography.heading).map(([name, style]) => [
              <code>typography.heading.{name}</code>,
              style.fontSize,
              style.fontWeight,
              style.lineHeight,
              style.letterSpacing,
            ])}
          />
        </div>
      </section>

      {/* Body Styles */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Body Styles</h2>
        <p style={sharedStyles.sectionDescription}>
          Paragraph and content text for readability and information density.
        </p>
        
        <div style={sharedStyles.card}>
          {Object.entries(typography.body).map(([name, style]) => (
            <TypographySample 
              key={name} 
              name={`body.${name}`} 
              style={style}
              sampleText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            />
          ))}
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Specifications</h3>
          <SpecTable
            headers={['Token', 'Size', 'Weight', 'Line Height', 'Letter Spacing']}
            rows={Object.entries(typography.body).map(([name, style]) => [
              <code>typography.body.{name}</code>,
              style.fontSize,
              style.fontWeight,
              style.lineHeight,
              style.letterSpacing,
            ])}
          />
        </div>
      </section>

      {/* Label Styles */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Label Styles</h2>
        <p style={sharedStyles.sectionDescription}>
          UI labels, buttons, and interactive element text.
        </p>
        
        <div style={sharedStyles.card}>
          {Object.entries(typography.label).map(([name, style]) => (
            <TypographySample key={name} name={`label.${name}`} style={style} sampleText="Button Label" />
          ))}
        </div>
      </section>

      {/* Code Styles */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Code Styles</h2>
        <p style={sharedStyles.sectionDescription}>
          Monospace typography for code blocks and technical content.
        </p>

        <div style={sharedStyles.card}>
          {Object.entries(typography.code).map(([name, style]) => (
            <TypographySample
              key={name}
              name={`code.${name}`}
              style={style}
              sampleText="const component = <Avatar name='User' />"
            />
          ))}
        </div>
      </section>
        </>
      )}

      {/* Specifications Tab */}
      {activeTab === 'specs' && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Typography Specifications</h2>
          <p style={sharedStyles.sectionDescription}>
            Complete token reference for all typography values.
          </p>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Font Family</h3>
            <SpecTable
              headers={['Token', 'Value', 'Usage']}
              rows={[
                [<code key="fd">fontFamilies.display</code>, displayFontStack, 'Display, headings'],
                [<code key="fb">fontFamilies.body</code>, bodyFontStack, 'Body text, labels'],
                [<code key="fm">fontFamilies.mono</code>, monoFontStack, 'Code, technical content'],
              ]}
            />
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Display Styles</h3>
            <SpecTable
              headers={['Token', 'Size', 'Weight', 'Line Height']}
              rows={Object.entries(typography.display).map(([name, style]) => [
                <code key={name}>typography.display.{name}</code>,
                style.fontSize,
                style.fontWeight,
                style.lineHeight,
              ])}
            />
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Heading Styles</h3>
            <SpecTable
              headers={['Token', 'Size', 'Weight', 'Line Height']}
              rows={Object.entries(typography.heading).map(([name, style]) => [
                <code key={name}>typography.heading.{name}</code>,
                style.fontSize,
                style.fontWeight,
                style.lineHeight,
              ])}
            />
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Body Styles</h3>
            <SpecTable
              headers={['Token', 'Size', 'Weight', 'Line Height']}
              rows={Object.entries(typography.body).map(([name, style]) => [
                <code key={name}>typography.body.{name}</code>,
                style.fontSize,
                style.fontWeight,
                style.lineHeight,
              ])}
            />
          </div>
        </section>
      )}

      {/* Usage Tab */}
      {activeTab === 'usage' && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Usage</h2>
          <p style={sharedStyles.sectionDescription}>
            How to import and use typography tokens in your components.
          </p>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Import</h3>
            <CodeBlock>{`import { typography, fontFamilies, fontWeights } from '@/styles/design-tokens'`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Example</h3>
            <CodeBlock>{`// Apply typography styles using spread
<h1 style={{ ...typography.display.lg }}>Page Title</h1>

// Individual properties
<p style={{
  fontFamily: fontFamilies.body,
  fontSize: '16px',
  fontWeight: fontWeights.regular,
}}>
  Body text
</p>

// Code block
<code style={{ ...typography.code.sm }}>
  const x = 42
</code>`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: colors.text.lowEmphasis.onLight }}>
              <li style={{ marginBottom: '8px' }}>Use display styles for hero sections and page titles</li>
              <li style={{ marginBottom: '8px' }}>Use heading styles for section headers</li>
              <li style={{ marginBottom: '8px' }}>Use body styles for paragraph content</li>
              <li style={{ marginBottom: '8px' }}>Use label styles for UI elements like buttons and inputs</li>
              <li style={{ marginBottom: '8px' }}>Use code styles for technical content and code snippets</li>
            </ul>
          </div>
        </section>
      )}
    </StyleguideLayout>
  )
}
