'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, TokenValue, CopyableToken, PixelValue, CollapsibleSection, TweakPanel, TweakField } from '../../design-system/shared'
import { Badge, BadgeVariant, BadgeColor, BadgeSize } from '@/components'
import { IconCheck, IconAlertCircle, IconInfo } from '@/components/Icons'
import { colors, typography, spacing, borderRadius } from '@/styles/design-tokens'

const BADGE_COMPONENT_PATH = 'components/Badge/Badge.tsx'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

type PageTab = 'overview' | 'implementation'

export default function BadgePage() {
  const variants: BadgeVariant[] = ['filled', 'outlined', 'subtle']
  const badgeColors: BadgeColor[] = ['neutral', 'success', 'warning', 'error', 'info', 'brand']
  const sizes: BadgeSize[] = ['sm', 'md']

  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive playground state
  const [demoVariant, setDemoVariant] = useState<BadgeVariant>('filled')
  const [demoColor, setDemoColor] = useState<BadgeColor>('neutral')
  const [demoSize, setDemoSize] = useState<BadgeSize>('sm')
  const [demoShowIcon, setDemoShowIcon] = useState(false)

  // Tweak mode state
  const [tweakMode, setTweakMode] = useState(false)
  const [componentSource, setComponentSource] = useState<string>('')
  const [sourceVersion, setSourceVersion] = useState(0)

  // Live tweak overrides (applied to preview without saving)
  const [tweakOverrides, setTweakOverrides] = useState({
    borderRadius: '9999px',
    smPaddingY: '2',
    smPaddingX: '8',
    mdPaddingY: '4',
    mdPaddingX: '10',
    fontWeight: '500',
    borderWidth: '1',
  })

  // Fetch component source and parse current values from it
  const fetchSource = useCallback(async () => {
    try {
      const res = await fetch(`/api/tweak/read?path=${BADGE_COMPONENT_PATH}`)
      if (res.ok) {
        const data = await res.json()
        setComponentSource(data.source)

        // Parse current values from the source
        const src = data.source as string

        // Border radius — match borderRadius: borderRadius.full or borderRadius: '...'
        const brMatch = src.match(/borderRadius:\s*(?:borderRadius\.full|'([^']*)')/)
        if (brMatch) {
          setTweakOverrides(prev => ({
            ...prev,
            borderRadius: brMatch[1] || '9999px',
          }))
        }

        // SM padding — match first padding in sizeConfig sm block
        const smSection = src.match(new RegExp("sm:\\s*\\{[^}]*padding:\\s*[`']([^`']*)[`']", "s"))
        if (smSection) {
          const padMatch = smSection[1].match(/(\d+)px\s+(?:\$\{spacing\[2\]\}|(\d+)px)/)
          if (padMatch) {
            setTweakOverrides(prev => ({
              ...prev,
              smPaddingY: padMatch[1],
              ...(padMatch[2] ? { smPaddingX: padMatch[2] } : {}),
            }))
          }
        }

        // MD padding
        const mdSection = src.match(new RegExp("md:\\s*\\{[^}]*padding:\\s*[`']([^`']*)[`']", "s"))
        if (mdSection) {
          const padMatch = mdSection[1].match(/(?:\$\{spacing\[1\]\}|(\d+)px)\s+(\d+)px/)
          if (padMatch) {
            setTweakOverrides(prev => ({
              ...prev,
              ...(padMatch[1] ? { mdPaddingY: padMatch[1] } : {}),
              mdPaddingX: padMatch[2],
            }))
          }
        }

        // Border width
        const bwMatch = src.match(/border:\s*`(\d+)px solid/)
        if (bwMatch) {
          setTweakOverrides(prev => ({ ...prev, borderWidth: bwMatch[1] }))
        }
      }
    } catch {
      // silently handle
    }
  }, [])

  useEffect(() => {
    fetchSource()
  }, [fetchSource, sourceVersion])

  // Build tweak fields for the TweakPanel
  const tweakFields: TweakField[] = [
    {
      label: 'Border Radius',
      value: tweakOverrides.borderRadius,
      type: 'text',
      group: 'Shape',
    },
    {
      label: 'Border Width',
      value: tweakOverrides.borderWidth,
      type: 'number',
      unit: 'px',
      group: 'Shape',
    },
    {
      label: 'Padding Y',
      value: tweakOverrides.smPaddingY,
      type: 'number',
      unit: 'px',
      group: 'Size: SM',
    },
    {
      label: 'Padding X',
      value: tweakOverrides.smPaddingX,
      type: 'number',
      unit: 'px',
      group: 'Size: SM',
    },
    {
      label: 'Padding Y',
      value: tweakOverrides.mdPaddingY,
      type: 'number',
      unit: 'px',
      group: 'Size: MD',
    },
    {
      label: 'Padding X',
      value: tweakOverrides.mdPaddingX,
      type: 'number',
      unit: 'px',
      group: 'Size: MD',
    },
    {
      label: 'Font Weight',
      value: tweakOverrides.fontWeight,
      type: 'select',
      options: ['400', '500', '600', '700'],
      group: 'Typography',
    },
  ]

  const handleTweakChange = (index: number, value: string) => {
    const keys = ['borderRadius', 'borderWidth', 'smPaddingY', 'smPaddingX', 'mdPaddingY', 'mdPaddingX', 'fontWeight'] as const
    setTweakOverrides(prev => ({ ...prev, [keys[index]]: value }))
  }

  // Save tweaks by writing full modified source
  const handleTweakSave = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      // Fetch fresh source
      const readRes = await fetch(`/api/tweak/read?path=${BADGE_COMPONENT_PATH}`)
      if (!readRes.ok) return { success: false, error: 'Could not read component' }
      const { source } = await readRes.json()

      let modified = source as string

      // Replace borderRadius in baseStyles
      modified = modified.replace(
        /borderRadius:\s*(?:borderRadius\.\w+|'[^']*')/,
        `borderRadius: '${tweakOverrides.borderRadius}'`
      )

      // Replace border width
      modified = modified.replace(
        /border:\s*`\d+px solid/g,
        `border: \`${tweakOverrides.borderWidth}px solid`
      )

      // Replace SM padding — find the sm block in sizeConfig
      modified = modified.replace(
        new RegExp("(sm:\\s*\\{[^}]*padding:\\s*)[`'][^`']*[`']", "s"),
        `$1\`${tweakOverrides.smPaddingY}px ${tweakOverrides.smPaddingX}px\``
      )

      // Replace MD padding — find the md block in sizeConfig
      modified = modified.replace(
        new RegExp("(md:\\s*\\{[^}]*padding:\\s*)[`'][^`']*[`']", "s"),
        `$1\`${tweakOverrides.mdPaddingY}px ${tweakOverrides.mdPaddingX}px\``
      )

      // Replace font weight
      const weightMap: Record<string, string> = {
        '400': 'fontWeights.regular',
        '500': 'fontWeights.medium',
        '600': 'fontWeights.semibold',
        '700': 'fontWeights.bold',
      }
      modified = modified.replace(
        /fontWeight:\s*fontWeights\.\w+/,
        `fontWeight: ${weightMap[tweakOverrides.fontWeight] || tweakOverrides.fontWeight}`
      )

      // Write back
      const writeRes = await fetch('/api/tweak/source', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ componentPath: BADGE_COMPONENT_PATH, source: modified }),
      })

      if (!writeRes.ok) {
        const data = await writeRes.json()
        return { success: false, error: data.error }
      }

      setSourceVersion(v => v + 1)
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Save failed' }
    }
  }

  // Build live preview style overrides
  const previewStyleOverrides: React.CSSProperties = tweakMode ? {
    borderRadius: tweakOverrides.borderRadius,
    ...(demoSize === 'sm'
      ? { padding: `${tweakOverrides.smPaddingY}px ${tweakOverrides.smPaddingX}px` }
      : { padding: `${tweakOverrides.mdPaddingY}px ${tweakOverrides.mdPaddingX}px` }),
    fontWeight: Number(tweakOverrides.fontWeight),
  } : {}

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
  ]

  const getIconForColor = (color: BadgeColor) => {
    switch (color) {
      case 'success': return <IconCheck size={12} />
      case 'error': return <IconAlertCircle size={12} />
      case 'warning': return <IconAlertCircle size={12} />
      case 'info': return <IconInfo size={12} />
      default: return <IconInfo size={12} />
    }
  }

  return (
    <StyleguideLayout
      title="Badge"
      description="Badges are small status indicators used for labels, categories, and tags. They support multiple variants and semantic colors."
      activeId="badge"
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
import { Badge } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { Badge } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h2 style={{ ...sharedStyles.sectionTitle, marginBottom: 0 }}>Interactive Playground</h2>
              <button
                onClick={() => {
                  setTweakMode(!tweakMode)
                  if (!tweakMode && !componentSource) fetchSource()
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: borderRadius.full,
                  border: tweakMode
                    ? `2px solid ${colors.brand.default}`
                    : `1px solid ${colors.border.lowEmphasis.onLight}`,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  fontFamily: typography.label.sm.fontFamily,
                  background: tweakMode ? colors.brand.default : 'transparent',
                  color: tweakMode ? '#FFFFFF' : colors.text.lowEmphasis.onLight,
                  transition: 'all 0.2s ease',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                {tweakMode ? 'Tweaking' : 'Tweak'}
              </button>
            </div>
            <p style={sharedStyles.sectionDescription}>
              {tweakMode
                ? 'Adjust values below for a live preview, then save changes directly to the component file.'
                : 'Experiment with badge properties to see how they affect the component.'}
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <Badge
                        variant={demoVariant}
                        color={demoColor}
                        size={demoSize}
                        icon={demoShowIcon ? getIconForColor(demoColor) : undefined}
                        style={previewStyleOverrides}
                      >
                        {demoColor === 'success' ? 'Verified' :
                         demoColor === 'error' ? 'Error' :
                         demoColor === 'warning' ? 'Warning' :
                         demoColor === 'info' ? 'Info' :
                         demoColor === 'brand' ? 'New' : 'Label'}
                      </Badge>
                    }
                    code={`<Badge
  variant="${demoVariant}"
  color="${demoColor}"
  size="${demoSize}"${demoShowIcon ? `
  icon={<IconCheck size={12} />}` : ''}
>
  Label
</Badge>`}
                    previewPadding="56px 24px"
                    previewBackground={colors.surface.paper}
                    sourceCode={componentSource || undefined}
                    componentPath={BADGE_COMPONENT_PATH}
                    onSourceSaved={() => setSourceVersion(v => v + 1)}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Variant */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Variant
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {variants.map(v => (
                          <PillButton
                            key={v}
                            onClick={() => setDemoVariant(v)}
                            isActive={demoVariant === v}
                          >
                            {v}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Color */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Color
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {badgeColors.map(c => (
                          <PillButton
                            key={c}
                            onClick={() => setDemoColor(c)}
                            isActive={demoColor === c}
                          >
                            {c}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Size */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Size
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {sizes.map(s => (
                          <PillButton
                            key={s}
                            onClick={() => setDemoSize(s)}
                            isActive={demoSize === s}
                          >
                            {s}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Icon Toggle */}
                    <StyledCheckbox
                      checked={demoShowIcon}
                      onChange={setDemoShowIcon}
                      label="Show Icon"
                    />
                  </div>

                  {/* Tweak Panel — shown when tweak mode is on */}
                  {tweakMode && (
                    <div style={{ marginTop: '32px' }}>
                      <TweakPanel
                        fields={tweakFields}
                        onChange={handleTweakChange}
                        onSave={handleTweakSave}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Size Specifications</h3>
              <SpecTable
                headers={['Size', 'Token', 'Padding Y', 'Padding X', 'Font Size', 'Icon Size']}
                rows={[
                  [
                    'sm',
                    <CopyableToken key="sm-py" token="spacing.1" />,
                    <PixelValue key="sm-pyv" value="2px" />,
                    <PixelValue key="sm-pxv" value="8px" />,
                    <PixelValue key="sm-fs" value="12px" />,
                    <PixelValue key="sm-is" value="12px" />,
                  ],
                  [
                    'md',
                    <CopyableToken key="md-py" token="spacing.2" />,
                    <PixelValue key="md-pyv" value="4px" />,
                    <PixelValue key="md-pxv" value="10px" />,
                    <PixelValue key="md-fs" value="14px" />,
                    <PixelValue key="md-is" value="14px" />,
                  ],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Font Family', <CopyableToken key="ff" token="typography.label.sm.fontFamily" />, <PixelValue key="ffv" value="Inter" />],
                  ['Font Weight', <CopyableToken key="fw" token="typography.label.sm.fontWeight" />, <PixelValue key="fwv" value="500" />],
                  ['Line Height', <CopyableToken key="lh" token="typography.label.sm.lineHeight" />, <PixelValue key="lhv" value="1.4" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Border Radius</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Badge Radius', <CopyableToken key="br" token="borderRadius.full" />, <PixelValue key="brv" value="9999px" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Variant Styles</h3>
              <SpecTable
                headers={['Variant', 'Background', 'Border', 'Use Case']}
                rows={[
                  ['filled', 'Solid color', 'Same as background', 'High emphasis, primary status'],
                  ['outlined', 'Transparent', '1px solid color', 'Medium emphasis, categories'],
                  ['subtle', 'Tinted (10% opacity)', 'None', 'Low emphasis, tags & filters'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Color Tokens</h3>
              <SpecTable
                headers={['Color', 'Filled BG Token', 'Subtle BG Token', 'Text on Filled']}
                rows={[
                  ['neutral', <CopyableToken key="n-bg" token="#757575" />, <CopyableToken key="n-sbg" token="#F5F5F5" />, <PixelValue key="n-txt" value="#FFFFFF" />],
                  ['success', <CopyableToken key="s-bg" token="colors.semantic.success.main" />, <CopyableToken key="s-sbg" token="colors.semantic.success.light" />, <PixelValue key="s-txt" value="#FFFFFF" />],
                  ['warning', <CopyableToken key="w-bg" token="colors.semantic.warning.main" />, <CopyableToken key="w-sbg" token="colors.semantic.warning.light" />, <PixelValue key="w-txt" value="#000000" />],
                  ['error', <CopyableToken key="e-bg" token="colors.semantic.error.main" />, <CopyableToken key="e-sbg" token="colors.semantic.error.light" />, <PixelValue key="e-txt" value="#FFFFFF" />],
                  ['info', <CopyableToken key="i-bg" token="colors.semantic.info.main" />, <CopyableToken key="i-sbg" token="colors.semantic.info.light" />, <PixelValue key="i-txt" value="#FFFFFF" />],
                  ['brand', <CopyableToken key="b-bg" token="colors.brand.primary" />, <CopyableToken key="b-sbg" token="colors.primary[50]" />, <PixelValue key="b-txt" value="#FFFFFF" />],
                ]}
              />
            </div>
            </CollapsibleSection>
          </section>

          {/* ========== USE CASES ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Common Use Cases</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Status Indicators</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Badge variant="subtle" color="success">Installed</Badge>
                <Badge variant="outlined" color="neutral">Uninstalled</Badge>
                <Badge variant="subtle" color="info">Update Available</Badge>
                <Badge variant="subtle" color="error">Deprecated</Badge>
              </div>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Categories & Tags</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Badge variant="outlined" color="neutral">Compliance</Badge>
                <Badge variant="outlined" color="neutral">Analytics</Badge>
                <Badge variant="outlined" color="neutral">Integration</Badge>
                <Badge variant="outlined" color="neutral">Reporting</Badge>
              </div>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Verification</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Badge variant="subtle" color="success" icon={<IconCheck size={12} />}>
                  Verified Application
                </Badge>
                <Badge variant="filled" color="brand">Official</Badge>
              </div>
            </div>
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
              <CodeBlock>
{`import { Badge } from '@/components'
import type { BadgeProps, BadgeVariant, BadgeColor, BadgeSize } from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`// Simple badge
<Badge>Label</Badge>

// With variant and color
<Badge variant="outlined" color="success">
  Verified
</Badge>

// With icon
<Badge
  variant="subtle"
  color="success"
  icon={<IconCheck size={12} />}
>
  Verified Application
</Badge>`}
              </CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="v">variant</code>, <code key="vt">'filled' | 'outlined' | 'subtle'</code>, <code key="vd">'filled'</code>, 'Visual style'],
                  [<code key="c">color</code>, <code key="ct">'neutral' | 'success' | 'warning' | 'error' | 'info' | 'brand'</code>, <code key="cd">'neutral'</code>, 'Semantic color'],
                  [<code key="s">size</code>, <code key="st">'sm' | 'md'</code>, <code key="sd">'sm'</code>, 'Badge size'],
                  [<code key="i">icon</code>, <code key="it">ReactNode</code>, '-', 'Optional leading icon'],
                  [<code key="ch">children</code>, <code key="cht">ReactNode</code>, 'required', 'Badge content'],
                ]}
              />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use Each Variant</h3>
              <SpecTable
                headers={['Variant', 'Use Case']}
                rows={[
                  [<code key="f">filled</code>, 'Primary status, high importance, counts'],
                  [<code key="o">outlined</code>, 'Secondary status, categories, filters'],
                  [<code key="s">subtle</code>, 'Tags, labels, low-emphasis indicators'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Color Semantics</h3>
              <SpecTable
                headers={['Color', 'Meaning']}
                rows={[
                  [<code key="n">neutral</code>, 'Default, categories, neutral status'],
                  [<code key="s">success</code>, 'Verified, complete, positive'],
                  [<code key="w">warning</code>, 'Attention needed, caution'],
                  [<code key="e">error</code>, 'Failed, error, critical'],
                  [<code key="i">info</code>, 'Informational, updates available'],
                  [<code key="b">brand</code>, 'New, featured, promotional'],
                ]}
              />
            </div>
          </section>
        </>
      )}
    </StyleguideLayout>
  )
}
