'use client'

import React from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable } from '../shared'
import { colors, typography, borderRadius, breakpoints, mediaQueries, zIndex, transitions, transitionPresets } from '@/styles/design-tokens'

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function BreakpointsPage() {
  return (
    <StyleguideLayout
      title="Breakpoints & System"
      description="Responsive breakpoints, z-index scale, and transition presets for building adaptive, polished interfaces."
      activeId="breakpoints"
    >
      {/* Breakpoints */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Breakpoints</h2>
        <p style={sharedStyles.sectionDescription}>
          Responsive breakpoints for adaptive layouts across device sizes.
        </p>
        
        <div style={sharedStyles.card}>
          <div style={{ position: 'relative', height: '120px', background: colors.neutral[100], borderRadius: borderRadius.md, overflow: 'hidden' }}>
            {Object.entries(breakpoints).map(([name, value], index) => {
              const width = parseInt(value)
              const maxWidth = 1536
              const percentage = (width / maxWidth) * 100
              const hue = 150 + (index * 30)
              
              return (
                <div key={name} style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: `${percentage}%`,
                  height: `${20 + (index * 15)}px`,
                  background: `hsl(${hue}, 50%, 45%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '8px',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 600,
                }}>
                  {name}: {value}
                </div>
              )
            })}
          </div>
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Specifications</h3>
          <SpecTable
            headers={['Token', 'Value', 'Target Devices']}
            rows={[
              [<code>breakpoints.xs</code>, breakpoints.xs, 'Small phones'],
              [<code>breakpoints.sm</code>, breakpoints.sm, 'Large phones'],
              [<code>breakpoints.md</code>, breakpoints.md, 'Tablets (portrait)'],
              [<code>breakpoints.lg</code>, breakpoints.lg, 'Tablets (landscape), small laptops'],
              [<code>breakpoints.xl</code>, breakpoints.xl, 'Desktops'],
              [<code>breakpoints.2xl</code>, breakpoints['2xl'], 'Large desktops'],
            ]}
          />
        </div>
      </section>

      {/* Media Queries */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Media Queries</h2>
        <p style={sharedStyles.sectionDescription}>
          Pre-built media query strings for use in CSS-in-JS and styled components.
        </p>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Min-Width Queries</h3>
          <SpecTable
            headers={['Token', 'Query String']}
            rows={['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((key) => [
              <code>mediaQueries.{key}</code>,
              <code style={{ fontSize: '12px' }}>{(mediaQueries as any)[key]}</code>,
            ])}
          />
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Device-Specific Queries</h3>
          <SpecTable
            headers={['Token', 'Query String', 'Description']}
            rows={[
              [<code>mediaQueries.mobile</code>, <code style={{ fontSize: '11px' }}>{mediaQueries.mobile}</code>, 'Mobile devices only'],
              [<code>mediaQueries.tablet</code>, <code style={{ fontSize: '11px' }}>{mediaQueries.tablet}</code>, 'Tablet devices only'],
              [<code>mediaQueries.desktop</code>, <code style={{ fontSize: '11px' }}>{mediaQueries.desktop}</code>, 'Desktop and larger'],
            ]}
          />
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Feature Queries</h3>
          <SpecTable
            headers={['Token', 'Query String', 'Use Case']}
            rows={[
              [<code>mediaQueries.hover</code>, mediaQueries.hover, 'Devices with hover capability'],
              [<code>mediaQueries.reducedMotion</code>, mediaQueries.reducedMotion, 'Respect accessibility preferences'],
              [<code>mediaQueries.dark</code>, mediaQueries.dark, 'System dark mode preference'],
            ]}
          />
        </div>
      </section>

      {/* Z-Index */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Z-Index Scale</h2>
        <p style={sharedStyles.sectionDescription}>
          Layering system for managing stacking context across components.
        </p>
        
        <div style={sharedStyles.card}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '200px', padding: '24px' }}>
            {Object.entries(zIndex).filter(([name]) => name !== 'hide' && name !== 'max').map(([name, value], index) => (
              <div key={name} style={{
                width: '80px',
                height: `${30 + (index * 20)}px`,
                background: colors.brand.primary,
                borderRadius: borderRadius.sm,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '11px',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}>
                {name}
              </div>
            ))}
          </div>
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Specifications</h3>
          <SpecTable
            headers={['Token', 'Value', 'Use Case']}
            rows={Object.entries(zIndex).map(([name, value]) => [
              <code>zIndex.{name}</code>,
              value.toString(),
              name === 'hide' ? 'Hidden elements' :
              name === 'base' ? 'Default layer' :
              name === 'dropdown' ? 'Dropdown menus' :
              name === 'sticky' ? 'Sticky elements' :
              name === 'header' ? 'Fixed headers' :
              name === 'overlay' ? 'Background overlays' :
              name === 'modal' ? 'Modal dialogs' :
              name === 'popover' ? 'Popovers' :
              name === 'tooltip' ? 'Tooltips' :
              name === 'toast' ? 'Toast notifications' :
              'Maximum z-index',
            ])}
          />
        </div>
      </section>

      {/* Transitions */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Transitions</h2>
        <p style={sharedStyles.sectionDescription}>
          Animation timing and duration presets for smooth interactions.
        </p>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Duration</h3>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            {Object.entries(transitions.duration).map(([name, value]) => (
              <div key={name} style={{ textAlign: 'center' }}>
                <div 
                  style={{
                    width: '60px',
                    height: '60px',
                    background: colors.brand.primary,
                    borderRadius: borderRadius.md,
                    margin: '0 auto 8px',
                    transition: `transform ${value} ease`,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ ...typography.label.sm }}>{name}</div>
                <div style={{ ...typography.code.sm, color: colors.text.mediumEmphasis }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Timing Functions</h3>
          <SpecTable
            headers={['Token', 'Value']}
            rows={Object.entries(transitions.timing).map(([name, value]) => [
              <code>transitions.timing.{name}</code>,
              value,
            ])}
          />
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Presets</h3>
          <SpecTable
            headers={['Token', 'Value', 'Use Case']}
            rows={Object.entries(transitionPresets).map(([name, value]) => [
              <code>transitionPresets.{name}</code>,
              value,
              name === 'default' ? 'Standard interactions' :
              name === 'fast' ? 'Quick feedback (hover)' :
              name === 'slow' ? 'Emphasized animations' :
              'Playful, bouncy effects',
            ])}
          />
        </div>
      </section>

      {/* Usage */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Usage</h2>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Import</h3>
          <CodeBlock>{`import { 
  breakpoints, 
  mediaQueries, 
  zIndex, 
  transitions, 
  transitionPresets 
} from '@/styles/design-tokens'`}</CodeBlock>
        </div>
        
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>Example</h3>
          <CodeBlock>{`// Z-index layering
<div style={{ position: 'fixed', zIndex: zIndex.header }}>
  Header
</div>
<div style={{ zIndex: zIndex.modal }}>
  Modal
</div>

// Transitions
<button style={{ transition: transitionPresets.default }}>
  Hover me
</button>

// Custom transition
<div style={{ 
  transition: \`transform \${transitions.duration.slow} \${transitions.timing.spring}\` 
}}>
  Animated element
</div>`}</CodeBlock>
        </div>
      </section>
    </StyleguideLayout>
  )
}
