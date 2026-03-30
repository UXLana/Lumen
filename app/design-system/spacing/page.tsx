'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable } from '../shared'
import { colors, typography, spacing, spacingTokens, borderRadius } from '@/styles/design-tokens'

function SpacingBar({ name, value }: { name: string; value: string }) {
  const numValue = parseInt(value)
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
      <div style={{ width: '80px', ...typography.code.sm, color: colors.text.lowEmphasis.onLight }}>
        {name}
      </div>
      <div 
        style={{
          height: '24px',
          width: `${Math.min(numValue, 200)}px`,
          minWidth: numValue > 0 ? '4px' : '0',
          background: colors.brand.default,
          borderRadius: borderRadius.xs,
        }}
      />
      <div style={{ ...typography.code.sm, color: colors.text.lowEmphasis.onLight }}>
        {value}
      </div>
    </div>
  )
}

export default function SpacingPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <StyleguideLayout
      title="Spacing"
      description="A consistent spacing system based on a 4px grid. Use semantic names for clear, readable code."
      activeId="spacing"
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <>
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Spacing Scale</h2>
            <p style={sharedStyles.sectionDescription}>
              Semantic size names on a 4px grid. Every value has a meaningful name — no numeric indices.
            </p>
            
            <div style={sharedStyles.card}>
              {Object.entries(spacing).map(([key, value]) => (
                <SpacingBar key={key} name={key} value={value} />
              ))}
            </div>
            
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Token Reference</h3>
              <SpecTable
                headers={['Token', 'Value', 'Common Use']}
                rows={[
                  [<code key="n">spacing.none</code>, spacing.none, 'Reset / no spacing'],
                  [<code key="2xs">spacing[&apos;2xs&apos;]</code>, spacing['2xs'], 'Tight gaps between related items'],
                  [<code key="xs">spacing.xs</code>, spacing.xs, 'Small internal padding, list gaps'],
                  [<code key="sm">spacing.sm</code>, spacing.sm, 'Cell padding, compact sections'],
                  [<code key="md">spacing.md</code>, spacing.md, 'Standard padding and gaps'],
                  [<code key="lg">spacing.lg</code>, spacing.lg, 'Comfortable padding'],
                  [<code key="xl">spacing.xl</code>, spacing.xl, 'Section spacing'],
                  [<code key="2xl">spacing[&apos;2xl&apos;]</code>, spacing['2xl'], 'Large section gaps, indents'],
                  [<code key="3xl">spacing[&apos;3xl&apos;]</code>, spacing['3xl'], 'Page-level spacing'],
                  [<code key="4xl">spacing[&apos;4xl&apos;]</code>, spacing['4xl'], 'Section dividers'],
                  [<code key="5xl">spacing[&apos;5xl&apos;]</code>, spacing['5xl'], 'Major page sections'],
                  [<code key="6xl">spacing[&apos;6xl&apos;]</code>, spacing['6xl'], 'Hero-level spacing'],
                ]}
              />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Component Tokens</h2>
            <p style={sharedStyles.sectionDescription}>
              Themed spacing tokens for specific component contexts. These are backed by CSS custom properties and adapt to the active theme.
            </p>
            
            <div style={sharedStyles.card}>
              {['inputPadding', 'buttonPadding', 'cardPadding', 'sectionPadding', 'pagePadding', 'gutter', 'containerPadding', 'sectionGap', 'componentGap'].map((key) => (
                <SpacingBar key={key} name={key} value={(spacingTokens as any)[key]} />
              ))}
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Visual Examples</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Padding Comparison</h3>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {(['2xs', 'xs', 'sm', 'md', 'xl', '2xl'] as const).map((name) => (
                  <div key={name} style={{ textAlign: 'center' }}>
                    <div style={{
                      background: '#C6E7DA',
                      padding: spacing[name],
                      borderRadius: borderRadius.md,
                      marginBottom: '8px',
                    }}>
                      <div style={{
                        background: colors.brand.default,
                        width: '40px',
                        height: '40px',
                        borderRadius: borderRadius.sm,
                      }} />
                    </div>
                    <span style={{ ...typography.code.sm, color: colors.text.lowEmphasis.onLight }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Gap Comparison</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {(['2xs', 'xs', 'md', 'xl'] as const).map((name) => (
                  <div key={name}>
                    <span style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight, display: 'block', marginBottom: '8px' }}>
                      gap: {name} ({spacing[name]})
                    </span>
                    <div style={{ display: 'flex', gap: spacing[name] }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} style={{
                          width: '48px',
                          height: '32px',
                          background: colors.brand.default,
                          borderRadius: borderRadius.sm,
                        }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'specs' && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Spacing Specifications</h2>
          <p style={sharedStyles.sectionDescription}>
            Complete token reference for all spacing values.
          </p>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Scale Tokens</h3>
            <SpecTable
              headers={['Token', 'Value']}
              rows={Object.entries(spacing).map(([key, value]) => [
                <code key={key}>spacing.{key.match(/^\d/) ? `['${key}']` : key}</code>,
                value,
              ])}
            />
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Component Tokens</h3>
            <SpecTable
              headers={['Token', 'Value', 'Use Case']}
              rows={[
                [<code key="ip">spacingTokens.inputPadding</code>, spacingTokens.inputPadding, 'Input field padding'],
                [<code key="bp">spacingTokens.buttonPadding</code>, spacingTokens.buttonPadding, 'Button padding'],
                [<code key="cp">spacingTokens.cardPadding</code>, spacingTokens.cardPadding, 'Card internal padding'],
                [<code key="sp">spacingTokens.sectionPadding</code>, spacingTokens.sectionPadding, 'Section padding'],
                [<code key="pp">spacingTokens.pagePadding</code>, spacingTokens.pagePadding, 'Page padding'],
                [<code key="sg">spacingTokens.sectionGap</code>, spacingTokens.sectionGap, 'Gap between sections'],
                [<code key="cg">spacingTokens.componentGap</code>, spacingTokens.componentGap, 'Gap between components'],
              ]}
            />
          </div>
        </section>
      )}

      {activeTab === 'usage' && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Usage</h2>
          <p style={sharedStyles.sectionDescription}>
            How to import and use spacing tokens in your components.
          </p>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Import</h3>
            <CodeBlock>{`import { spacing, spacingTokens } from '@/styles/design-tokens'`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Example</h3>
            <CodeBlock>{`// Semantic scale
<div style={{ padding: spacing.md }}>       {/* 16px */}
  <p style={{ marginBottom: spacing.xs }}>Text</p>  {/* 8px */}
</div>

// Component tokens
<div style={{ padding: spacingTokens.cardPadding }}>
  <input style={{ padding: spacingTokens.inputPadding }} />
</div>

// Flex/grid gaps
<div style={{ display: 'flex', gap: spacing.sm }}>  {/* 12px */}
  <Item />
  <Item />
</div>`}</CodeBlock>
          </div>

          <div style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: colors.text.lowEmphasis.onLight }}>
              <li style={{ marginBottom: '8px' }}>Use semantic names (spacing.md) — never raw pixel values</li>
              <li style={{ marginBottom: '8px' }}>Use spacingTokens for component-specific values that may be themed</li>
              <li style={{ marginBottom: '8px' }}>Maintain visual rhythm by sticking to the 4px grid</li>
              <li style={{ marginBottom: '8px' }}>Use gap property for flex and grid layouts</li>
            </ul>
          </div>
        </section>
      )}
    </StyleguideLayout>
  )
}
