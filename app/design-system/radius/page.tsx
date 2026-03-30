'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable } from '../shared'
import { colors, typography, borderRadius, borderRadiusSemantics } from '@/styles/design-tokens'

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function RadiusPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <StyleguideLayout
      title="Border Radius"
      description="Border radius tokens for consistent corner rounding across components. From sharp corners to fully rounded pills."
      activeId="radius"
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Base Scale */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Base Scale</h2>
        <p style={sharedStyles.sectionDescription}>
          Core border radius values for various UI elements.
        </p>
        
        <div style={sharedStyles.card}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px' }}>
            {Object.entries(borderRadius).map(([name, value]) => (
              <div key={name} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: colors.brand.default,
                  borderRadius: value,
                  margin: '0 auto 12px',
                }} />
                <div style={{ ...typography.label.sm, color: colors.text.highEmphasis.onLight }}>{name}</div>
                <div style={{ ...typography.code.sm, color: colors.text.lowEmphasis.onLight }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Specifications</h3>
          <SpecTable
            headers={['Token', 'Value', 'Description']}
            rows={[
              [<code>borderRadius.none</code>, borderRadius.none, 'Sharp corners, no rounding'],
              [<code>borderRadius.xs</code>, borderRadius.xs, 'Subtle rounding for small elements'],
              [<code>borderRadius.sm</code>, borderRadius.sm, 'Small rounding for inputs and chips'],
              [<code>borderRadius.md</code>, borderRadius.md, 'Default rounding for buttons and cards'],
              [<code>borderRadius.lg</code>, borderRadius.lg, 'Larger rounding for cards and modals'],
              [<code>borderRadius.xl</code>, borderRadius.xl, 'Extra large for prominent containers'],
              [<code>borderRadius.2xl</code>, borderRadius['2xl'], 'Very large for hero sections'],
              [<code>borderRadius.3xl</code>, borderRadius['3xl'], 'Maximum rounding'],
              [<code>borderRadius.full</code>, borderRadius.full, 'Fully rounded (circles, pills)'],
            ]}
          />
        </div>
      </section>

      {/* Semantic Mappings */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Semantic Mappings</h2>
        <p style={sharedStyles.sectionDescription}>
          Component-specific radius tokens for consistent styling.
        </p>
        
        <div style={sharedStyles.card}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {Object.entries(borderRadiusSemantics).map(([name, value]) => (
              <div key={name}>
                <div style={{
                  width: '100%',
                  height: '60px',
                  background: '#C6E7DA',
                  borderRadius: value,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  marginBottom: '8px',
                }}>
                  <span style={{ ...typography.label.sm, color: colors.brand.default }}>{name}</span>
                </div>
                <div style={{ ...typography.code.sm, color: colors.text.lowEmphasis.onLight, textAlign: 'center' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Specifications</h3>
          <SpecTable
            headers={['Token', 'Value', 'Component']}
            rows={Object.entries(borderRadiusSemantics).map(([name, value]) => [
              <code>borderRadiusSemantics.{name}</code>,
              value,
              name.charAt(0).toUpperCase() + name.slice(1),
            ])}
          />
        </div>
      </section>

      {/* Visual Examples */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Visual Examples</h2>

        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Buttons</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {['none', 'sm', 'md', 'lg', 'full'].map((r) => (
              <button key={r} style={{
                padding: '12px 24px',
                background: colors.brand.default,
                color: 'white',
                border: 'none',
                borderRadius: (borderRadius as any)[r],
                cursor: 'pointer',
                fontWeight: 600,
              }}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Cards</h3>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['sm', 'md', 'lg', 'xl'].map((r) => (
              <div key={r} style={{
                width: '120px',
                height: '100px',
                background: colors.surface.light,
                borderRadius: (borderRadius as any)[r],
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ ...typography.code.sm, color: colors.text.lowEmphasis.onLight }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
        </>
      )}

      {/* Specifications Tab */}
      {activeTab === 'specs' && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Border Radius Specifications</h2>
          <p style={sharedStyles.sectionDescription}>
            Complete token reference for all border radius values.
          </p>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Base Scale</h3>
            <SpecTable
              headers={['Token', 'Value', 'Description']}
              rows={[
                [<code key="none">borderRadius.none</code>, borderRadius.none, 'Sharp corners, no rounding'],
                [<code key="xs">borderRadius.xs</code>, borderRadius.xs, 'Subtle rounding for small elements'],
                [<code key="sm">borderRadius.sm</code>, borderRadius.sm, 'Small rounding for inputs and chips'],
                [<code key="md">borderRadius.md</code>, borderRadius.md, 'Default rounding for buttons and cards'],
                [<code key="lg">borderRadius.lg</code>, borderRadius.lg, 'Larger rounding for cards and modals'],
                [<code key="xl">borderRadius.xl</code>, borderRadius.xl, 'Extra large for prominent containers'],
                [<code key="2xl">borderRadius['2xl']</code>, borderRadius['2xl'], 'Very large for hero sections'],
                [<code key="3xl">borderRadius['3xl']</code>, borderRadius['3xl'], 'Maximum rounding'],
                [<code key="full">borderRadius.full</code>, borderRadius.full, 'Fully rounded (circles, pills)'],
              ]}
            />
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Semantic Mappings</h3>
            <SpecTable
              headers={['Token', 'Value', 'Component']}
              rows={Object.entries(borderRadiusSemantics).map(([name, value]) => [
                <code key={name}>borderRadiusSemantics.{name}</code>,
                value,
                name.charAt(0).toUpperCase() + name.slice(1),
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
            How to import and use border radius tokens in your components.
          </p>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Import</h3>
            <CodeBlock>{`import { borderRadius, borderRadiusSemantics } from '@/styles/design-tokens'`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Example</h3>
            <CodeBlock>{`// Using base scale
<div style={{ borderRadius: borderRadius.md }}>
  Card content
</div>

// Using semantic tokens
<button style={{ borderRadius: borderRadiusSemantics.button }}>
  Click me
</button>

// Pill buttons
<span style={{ borderRadius: borderRadius.full, padding: '4px 12px' }}>
  Badge
</span>`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: colors.text.lowEmphasis.onLight }}>
              <li style={{ marginBottom: '8px' }}>Use semantic tokens for component-specific styling</li>
              <li style={{ marginBottom: '8px' }}>Use larger radius values for prominent elements</li>
              <li style={{ marginBottom: '8px' }}>Use full radius for avatars and pill-shaped elements</li>
              <li style={{ marginBottom: '8px' }}>Be consistent with radius usage across similar elements</li>
            </ul>
          </div>
        </section>
      )}
    </StyleguideLayout>
  )
}
