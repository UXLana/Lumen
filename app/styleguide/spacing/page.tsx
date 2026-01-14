'use client'

import React from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable } from '../shared'
import { colors, typography, spacing, spacingSemantics, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// SPACING VISUAL COMPONENT
// =============================================================================

function SpacingBar({ name, value }: { name: string; value: string }) {
  const numValue = parseInt(value)
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
      <div style={{ width: '60px', ...typography.code.sm, color: colors.text.mediumEmphasis }}>
        {name}
      </div>
      <div 
        style={{
          height: '24px',
          width: `${Math.min(numValue, 200)}px`,
          minWidth: numValue > 0 ? '4px' : '0',
          background: colors.brand.primary,
          borderRadius: borderRadius.xs,
        }}
      />
      <div style={{ ...typography.code.sm, color: colors.text.lowEmphasis }}>
        {value}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function SpacingPage() {
  return (
    <StyleguideLayout
      title="Spacing"
      description="A consistent spacing system based on a 4px grid. Use these tokens for margins, padding, and gaps to maintain visual rhythm."
      activeId="spacing"
    >
      {/* Base Scale */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Base Scale</h2>
        <p style={sharedStyles.sectionDescription}>
          Core spacing values based on a 4px unit. Use these for precise control over spacing.
        </p>
        
        <div style={sharedStyles.card}>
          {Object.entries(spacing).slice(0, 15).map(([key, value]) => (
            <SpacingBar key={key} name={key} value={value} />
          ))}
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Extended Scale</h3>
          {Object.entries(spacing).slice(15).map(([key, value]) => (
            <SpacingBar key={key} name={key} value={value} />
          ))}
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Specifications</h3>
          <SpecTable
            headers={['Token', 'Value', 'Pixels']}
            rows={Object.entries(spacing).map(([key, value]) => [
              <code>spacing[{key}]</code>,
              value,
              `${parseInt(value)}px`,
            ])}
          />
        </div>
      </section>

      {/* Semantic Scale */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Semantic Aliases</h2>
        <p style={sharedStyles.sectionDescription}>
          Named spacing values for common use cases. These provide clearer intent in code.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Size Scale</h3>
            {['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'].map((key) => (
              <SpacingBar key={key} name={key} value={(spacingSemantics as any)[key]} />
            ))}
          </div>
          
          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Component Specific</h3>
            {['inputPadding', 'buttonPadding', 'cardPadding', 'sectionPadding', 'pagePadding', 'gutter', 'containerPadding'].map((key) => (
              <SpacingBar key={key} name={key} value={(spacingSemantics as any)[key]} />
            ))}
          </div>
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Specifications</h3>
          <SpecTable
            headers={['Token', 'Value', 'Use Case']}
            rows={[
              [<code>spacingSemantics.none</code>, spacingSemantics.none, 'No spacing'],
              [<code>spacingSemantics.xs</code>, spacingSemantics.xs, 'Tight spacing between related items'],
              [<code>spacingSemantics.sm</code>, spacingSemantics.sm, 'Default gap between elements'],
              [<code>spacingSemantics.md</code>, spacingSemantics.md, 'Standard component padding'],
              [<code>spacingSemantics.lg</code>, spacingSemantics.lg, 'Section spacing'],
              [<code>spacingSemantics.xl</code>, spacingSemantics.xl, 'Large section gaps'],
              [<code>spacingSemantics.inputPadding</code>, spacingSemantics.inputPadding, 'Input field padding'],
              [<code>spacingSemantics.buttonPadding</code>, spacingSemantics.buttonPadding, 'Button padding'],
              [<code>spacingSemantics.cardPadding</code>, spacingSemantics.cardPadding, 'Card internal padding'],
            ]}
          />
        </div>
      </section>

      {/* Visual Examples */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Visual Examples</h2>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Padding Comparison</h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[4, 8, 12, 16, 24, 32].map((size) => (
              <div key={size} style={{ textAlign: 'center' }}>
                <div style={{
                  background: colors.primary[100],
                  padding: `${size}px`,
                  borderRadius: borderRadius.md,
                  marginBottom: '8px',
                }}>
                  <div style={{
                    background: colors.brand.primary,
                    width: '40px',
                    height: '40px',
                    borderRadius: borderRadius.sm,
                  }} />
                </div>
                <span style={{ ...typography.code.sm, color: colors.text.mediumEmphasis }}>{size}px</span>
              </div>
            ))}
          </div>
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Gap Comparison</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[4, 8, 16, 24].map((gap) => (
              <div key={gap}>
                <span style={{ ...typography.label.sm, color: colors.text.mediumEmphasis, display: 'block', marginBottom: '8px' }}>
                  gap: {gap}px
                </span>
                <div style={{ display: 'flex', gap: `${gap}px` }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} style={{
                      width: '48px',
                      height: '32px',
                      background: colors.brand.primary,
                      borderRadius: borderRadius.sm,
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Usage</h2>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Import</h3>
          <CodeBlock>{`import { spacing, spacingSemantics } from '@/styles/design-tokens'`}</CodeBlock>
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Example</h3>
          <CodeBlock>{`// Using numeric scale
<div style={{ padding: spacing[4] }}>  {/* 16px */}
  <p style={{ marginBottom: spacing[2] }}>Text</p>  {/* 8px */}
</div>

// Using semantic aliases
<div style={{ padding: spacingSemantics.cardPadding }}>
  <input style={{ padding: spacingSemantics.inputPadding }} />
</div>

// CSS-in-JS with gap
<div style={{ display: 'flex', gap: spacing[3] }}>  {/* 12px gap */}
  <Item />
  <Item />
</div>`}</CodeBlock>
        </div>
      </section>
    </StyleguideLayout>
  )
}
