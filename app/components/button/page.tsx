'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, TokenValue, CopyableToken, PixelValue, CollapsibleSection } from '../../design-system/shared'
import { Button, ButtonGroup, DropdownIcon, ButtonSize, ButtonEmphasis } from '@/components'
import { IconPlus, IconSettings } from '@/components/Icons'
import { colors, typography, button, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function ButtonPage() {
  const sizes: ButtonSize[] = ['lg', 'md']
  const emphases: ButtonEmphasis[] = ['high', 'mid', 'low']
  
  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')
  
  // Interactive state for property manipulation
  const [demoSize, setDemoSize] = useState<ButtonSize>('md')
  const [demoEmphasis, setDemoEmphasis] = useState<ButtonEmphasis>('high')
  const [demoDestructive, setDemoDestructive] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoLeftIcon, setDemoLeftIcon] = useState(false)
  const [demoRightIcon, setDemoRightIcon] = useState(false)
  const [demoIconOnly, setDemoIconOnly] = useState(false)
  const [demoFullWidth, setDemoFullWidth] = useState(false)
  const [demoOnDark, setDemoOnDark] = useState(false)

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
  ]

  return (
    <StyleguideLayout
      title="Button"
      description="Buttons allow users to take actions and make choices with a single tap. They communicate actions that users can take throughout your UI."
      activeId="button"
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
import { Button, ButtonGroup } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { Button, ButtonGroup } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Manipulate button properties in real-time to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <div style={{ width: demoFullWidth ? '100%' : 'auto' }}>
                        <Button
                          size={demoSize}
                          emphasis={demoEmphasis}
                          destructive={demoDestructive}
                          loading={demoLoading}
                          disabled={demoDisabled}
                          leftIcon={(demoLeftIcon || demoIconOnly) ? <IconPlus size={demoSize === 'lg' ? 'lg' : 'md'} /> : undefined}
                          rightIcon={demoRightIcon && !demoIconOnly ? <DropdownIcon size={demoSize === 'lg' ? 20 : 16} /> : undefined}
                          iconOnly={demoIconOnly}
                          fullWidth={demoFullWidth}
                          onDark={demoOnDark}
                          aria-label={demoIconOnly ? 'Add item' : undefined}
                        >
                          {demoIconOnly ? undefined : 'Button'}
                        </Button>
                      </div>
                    }
                    code={`<Button
  size="${demoSize}"
  emphasis="${demoEmphasis}"${demoDestructive ? '\n  destructive' : ''}${demoLoading ? '\n  loading' : ''}${demoDisabled ? '\n  disabled' : ''}${demoOnDark ? '\n  onDark' : ''}${demoFullWidth ? '\n  fullWidth' : ''}${demoIconOnly ? '\n  iconOnly\n  leftIcon={<IconPlus />}\n  aria-label="Add item"' : ''}${demoLeftIcon && !demoIconOnly ? '\n  leftIcon={<IconPlus />}' : ''}${demoRightIcon && !demoIconOnly ? '\n  rightIcon={<DropdownIcon />}' : ''}
>${demoIconOnly ? '' : '\n  Button\n'}</Button>`}
                    previewPadding="56px 24px"
                    previewBackground={demoOnDark ? colors.brand.primary : colors.surface.paper}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Size */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Size
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
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

                    {/* Emphasis */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Emphasis
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {emphases.map(e => (
                          <PillButton
                            key={e}
                            onClick={() => setDemoEmphasis(e)}
                            isActive={demoEmphasis === e}
                          >
                            {e}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <StyledCheckbox
                        checked={demoDestructive}
                        onChange={setDemoDestructive}
                        label="Destructive"
                      />
                      <StyledCheckbox
                        checked={demoLoading}
                        onChange={setDemoLoading}
                        label="Loading"
                      />
                      <StyledCheckbox
                        checked={demoDisabled}
                        onChange={setDemoDisabled}
                        label="Disabled"
                      />
                      <StyledCheckbox
                        checked={demoIconOnly}
                        onChange={setDemoIconOnly}
                        label="Icon Only"
                      />
                      <StyledCheckbox
                        checked={demoFullWidth}
                        onChange={setDemoFullWidth}
                        label="Full Width"
                      />
                      <StyledCheckbox
                        checked={demoOnDark}
                        onChange={setDemoOnDark}
                        label="On Dark"
                      />
                    </div>

                    {/* Icon toggles - only show when not icon only */}
                    {!demoIconOnly && (
                      <div>
                        <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                          Icons
                        </label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <StyledCheckbox
                            checked={demoLeftIcon}
                            onChange={setDemoLeftIcon}
                            label="Left Icon"
                          />
                          <StyledCheckbox
                            checked={demoRightIcon}
                            onChange={setDemoRightIcon}
                            label="Right Icon"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Typography scale and spacing values used in the button component. Click any token to copy it. Pixel values shown in parentheses are for reference only.
              </p>

              {/* Typography Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography Tokens</h3>
              <SpecTable
                headers={['Size', 'Font Size', 'Font Weight', 'Line Height', 'Letter Spacing']}
                rows={sizes.map(size => [
                  <code key={size}>{size}</code>,
                  <TokenValue key={`fs-${size}`} token={`button.typography.${size}.fontSize`} value={button.typography[size].fontSize} />,
                  <TokenValue key={`fw-${size}`} token={`button.typography.${size}.fontWeight`} value={button.typography[size].fontWeight.toString()} />,
                  <TokenValue key={`lh-${size}`} token={`button.typography.${size}.lineHeight`} value={button.typography[size].lineHeight} />,
                  <TokenValue key={`ls-${size}`} token={`button.typography.${size}.letterSpacing`} value={button.typography[size].letterSpacing} />,
                ])}
              />
            </div>

            {/* Spacing Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Spacing & Dimensions</h3>
              <SpecTable
                headers={['Size', 'Height', 'Min Width', 'Padding X', 'Padding Y', 'Gap']}
                rows={sizes.map(size => [
                  <code key={size}>{size}</code>,
                  <TokenValue key={`h-${size}`} token={`button.sizes.${size}.height`} value={button.sizes[size].height} />,
                  <TokenValue key={`mw-${size}`} token={`button.sizes.${size}.minWidth`} value={button.sizes[size].minWidth} />,
                  <TokenValue key={`px-${size}`} token={`button.sizes.${size}.paddingX`} value={button.sizes[size].paddingX} />,
                  <TokenValue key={`py-${size}`} token={`button.sizes.${size}.paddingY`} value={button.sizes[size].paddingY} />,
                  <TokenValue key={`g-${size}`} token={`button.sizes.${size}.gap`} value={button.sizes[size].gap} />,
                ])}
              />
            </div>

            {/* Icon Only Button Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Icon-Only Button Dimensions</h3>
              <SpecTable
                headers={['Size', 'Button Size', 'Icon Size']}
                rows={sizes.map(size => [
                  <code key={size}>{size}</code>,
                  <TokenValue key={`io-${size}`} token={`button.iconOnlySizes.${size}.size`} value={button.iconOnlySizes[size].size} />,
                  <TokenValue key={`ioi-${size}`} token={`button.iconOnlySizes.${size}.iconSize`} value={button.iconOnlySizes[size].iconSize} />,
                ])}
              />
            </div>

            {/* Colors - High Emphasis */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Colors - High Emphasis (Light Mode)</h3>
              <SpecTable
                headers={['State', 'Background', 'Text', 'Border']}
                rows={[
                  [
                    'Enabled',
                    <TokenValue key="he-bg" token="button.emphasis.high.enabled.background" value={button.emphasis.high.enabled.background} />,
                    <TokenValue key="he-txt" token="button.emphasis.high.enabled.text" value={button.emphasis.high.enabled.text} />,
                    <PixelValue key="he-bdr" value={button.emphasis.high.enabled.border} />,
                  ],
                  [
                    'Hover',
                    <TokenValue key="hh-bg" token="button.emphasis.high.hover.background" value={button.emphasis.high.hover.background} />,
                    <TokenValue key="hh-txt" token="button.emphasis.high.hover.text" value={button.emphasis.high.hover.text} />,
                    <PixelValue key="hh-bdr" value={button.emphasis.high.hover.border} />,
                  ],
                  [
                    'Pressed',
                    <TokenValue key="hp-bg" token="button.emphasis.high.pressed.background" value={button.emphasis.high.pressed.background} />,
                    <TokenValue key="hp-txt" token="button.emphasis.high.pressed.text" value={button.emphasis.high.pressed.text} />,
                    <PixelValue key="hp-bdr" value={button.emphasis.high.pressed.border} />,
                  ],
                  [
                    'Disabled',
                    <TokenValue key="hd-bg" token="button.emphasis.high.disabled.background" value={button.emphasis.high.disabled.background} />,
                    <TokenValue key="hd-txt" token="button.emphasis.high.disabled.text" value={button.emphasis.high.disabled.text} />,
                    <PixelValue key="hd-bdr" value={button.emphasis.high.disabled.border} />,
                  ],
                ]}
              />
            </div>

            {/* Colors - Mid Emphasis */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Colors - Mid Emphasis (Light Mode)</h3>
              <SpecTable
                headers={['State', 'Background', 'Text', 'Border']}
                rows={[
                  [
                    'Enabled',
                    <TokenValue key="me-bg" token="button.emphasis.mid.enabled.background" value={button.emphasis.mid.enabled.background} />,
                    <TokenValue key="me-txt" token="button.emphasis.mid.enabled.text" value={button.emphasis.mid.enabled.text} />,
                    <PixelValue key="me-bdr" value={button.emphasis.mid.enabled.border} />,
                  ],
                  [
                    'Hover',
                    <TokenValue key="mh-bg" token="button.emphasis.mid.hover.background" value={button.emphasis.mid.hover.background} />,
                    <TokenValue key="mh-txt" token="button.emphasis.mid.hover.text" value={button.emphasis.mid.hover.text} />,
                    <PixelValue key="mh-bdr" value={button.emphasis.mid.hover.border} />,
                  ],
                  [
                    'Pressed',
                    <TokenValue key="mp-bg" token="button.emphasis.mid.pressed.background" value={button.emphasis.mid.pressed.background} />,
                    <TokenValue key="mp-txt" token="button.emphasis.mid.pressed.text" value={button.emphasis.mid.pressed.text} />,
                    <PixelValue key="mp-bdr" value={button.emphasis.mid.pressed.border} />,
                  ],
                  [
                    'Disabled',
                    <TokenValue key="md-bg" token="button.emphasis.mid.disabled.background" value={button.emphasis.mid.disabled.background} />,
                    <TokenValue key="md-txt" token="button.emphasis.mid.disabled.text" value={button.emphasis.mid.disabled.text} />,
                    <PixelValue key="md-bdr" value={button.emphasis.mid.disabled.border} />,
                  ],
                ]}
              />
            </div>

            {/* Colors - Low Emphasis */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Colors - Low Emphasis (Light Mode)</h3>
              <SpecTable
                headers={['State', 'Background', 'Text', 'Border']}
                rows={[
                  [
                    'Enabled',
                    <TokenValue key="le-bg" token="button.emphasis.low.enabled.background" value={button.emphasis.low.enabled.background} />,
                    <TokenValue key="le-txt" token="button.emphasis.low.enabled.text" value={button.emphasis.low.enabled.text} />,
                    <PixelValue key="le-bdr" value={button.emphasis.low.enabled.border} />,
                  ],
                  [
                    'Hover',
                    <TokenValue key="lh-bg" token="button.emphasis.low.hover.background" value={button.emphasis.low.hover.background} />,
                    <TokenValue key="lh-txt" token="button.emphasis.low.hover.text" value={button.emphasis.low.hover.text} />,
                    <PixelValue key="lh-bdr" value={button.emphasis.low.hover.border} />,
                  ],
                  [
                    'Pressed',
                    <TokenValue key="lp-bg" token="button.emphasis.low.pressed.background" value={button.emphasis.low.pressed.background} />,
                    <TokenValue key="lp-txt" token="button.emphasis.low.pressed.text" value={button.emphasis.low.pressed.text} />,
                    <PixelValue key="lp-bdr" value={button.emphasis.low.pressed.border} />,
                  ],
                  [
                    'Disabled',
                    <TokenValue key="ld-bg" token="button.emphasis.low.disabled.background" value={button.emphasis.low.disabled.background} />,
                    <TokenValue key="ld-txt" token="button.emphasis.low.disabled.text" value={button.emphasis.low.disabled.text} />,
                    <PixelValue key="ld-bdr" value={button.emphasis.low.disabled.border} />,
                  ],
                ]}
              />
            </div>

            {/* Border Radius Token */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Border Radius</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '100px',
                  height: '48px',
                  background: colors.brand.primary,
                  borderRadius: button.borderRadius,
                }} />
                <div>
                  <div style={{ ...typography.label.md, marginBottom: '4px' }}>Pill Shape</div>
                  <TokenValue token="button.borderRadius" value={button.borderRadius} />
                </div>
              </div>
            </div>

            {/* Focus Ring */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Focus Ring</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Color', <CopyableToken key="fc" token="button.focus.color" />, <PixelValue key="fcv" value={button.focus.color} />],
                  ['Width', <CopyableToken key="fw" token="button.focus.width" />, <PixelValue key="fwv" value={button.focus.width} />],
                  ['Offset', <CopyableToken key="fo" token="button.focus.offset" />, <PixelValue key="fov" value={button.focus.offset} />],
                ]}
              />
            </div>

            {/* Animation */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Animation</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Transition', <CopyableToken key="tr" token="button.transition" />, <PixelValue key="trv" value={button.transition} />],
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
          {/* ========== USAGE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>
{`import { Button, ButtonGroup, DropdownIcon } from '@/components'
import type { ButtonProps, ButtonSize, ButtonEmphasis } from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`// Primary action
<Button emphasis="high" size="lg">
  Submit
</Button>

// Secondary action
<Button emphasis="mid" size="md">
  Cancel
</Button>

// Tertiary action
<Button emphasis="low" size="md">
  Learn More
</Button>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>With Icons</h3>
              <CodeBlock>
{`// Left icon
<Button leftIcon={<IconPlus />}>
  Add Item
</Button>

// Right icon (dropdown)
<Button rightIcon={<DropdownIcon />}>
  Options
</Button>

// Icon only
<Button iconOnly leftIcon={<IconSettings />} aria-label="Settings" />`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Button Groups</h3>
              <CodeBlock>
{`// Form actions
<ButtonGroup spacing="form">
  <Button emphasis="low">Cancel</Button>
  <Button emphasis="high">Save</Button>
</ButtonGroup>

// Mobile stacked
<ButtonGroup spacing="formMobile" align="stretch">
  <Button emphasis="high">Continue</Button>
  <Button emphasis="low">Go Back</Button>
</ButtonGroup>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Destructive Actions</h3>
              <CodeBlock>
{`// Destructive button
<Button emphasis="high" destructive>
  Delete
</Button>

// With icon
<Button emphasis="high" destructive leftIcon={<IconTrash />}>
  Delete Item
</Button>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Loading State</h3>
              <CodeBlock>
{`<Button emphasis="high" loading>
  Saving...
</Button>`}
              </CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Button Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code>size</code>, <code>'lg' | 'md'</code>, <code>'md'</code>, 'Size of the button'],
                  [<code>emphasis</code>, <code>'high' | 'mid' | 'low'</code>, <code>'high'</code>, 'Visual emphasis level'],
                  [<code>onDark</code>, <code>boolean</code>, <code>false</code>, 'Render for dark surfaces'],
                  [<code>destructive</code>, <code>boolean</code>, <code>false</code>, 'Destructive action style'],
                  [<code>leftIcon</code>, <code>ReactNode</code>, '-', 'Icon before text'],
                  [<code>rightIcon</code>, <code>ReactNode</code>, '-', 'Icon after text (dropdown)'],
                  [<code>iconOnly</code>, <code>boolean</code>, <code>false</code>, 'Icon-only button mode'],
                  [<code>loading</code>, <code>boolean</code>, <code>false</code>, 'Show loading spinner'],
                  [<code>fullWidth</code>, <code>boolean</code>, <code>false</code>, 'Full width button'],
                  [<code>disabled</code>, <code>boolean</code>, <code>false</code>, 'Disabled state'],
                  [<code>focused</code>, <code>boolean</code>, <code>false</code>, 'Force focus state (for demos)'],
                  [<code>className</code>, <code>string</code>, '-', 'Additional CSS class'],
                  [<code>style</code>, <code>CSSProperties</code>, '-', 'Additional inline styles'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>ButtonGroup Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code>spacing</code>, <code>'default' | 'form' | 'formMobile' | 'inline'</code>, <code>'default'</code>, 'Spacing preset'],
                  [<code>align</code>, <code>'start' | 'center' | 'end' | 'stretch'</code>, <code>'start'</code>, 'Alignment of buttons'],
                  [<code>className</code>, <code>string</code>, '-', 'Additional CSS class'],
                  [<code>style</code>, <code>CSSProperties</code>, '-', 'Additional inline styles'],
                ]}
              />
            </div>
          </section>

          {/* ========== DESIGN GUIDANCE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use Each Size</h3>
              <SpecTable
                headers={['Size', 'Height', 'Usage']}
                rows={[
                  [<code>lg</code>, '48px', 'Bottom of forms, major prominence areas, primary CTAs'],
                  [<code>md</code>, '36px', 'Navigation bars, snackbars, dialogs, banners, mid-page content'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use Each Emphasis</h3>
              <SpecTable
                headers={['Emphasis', 'Usage', 'Limit']}
                rows={[
                  [<code>high</code>, 'Primary actions, main CTAs', 'One per section'],
                  [<code>mid</code>, 'Secondary actions, alternative options', 'As needed'],
                  [<code>low</code>, 'Tertiary actions, links, cancel buttons', 'As needed'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Place low emphasis buttons before high emphasis', 'Put primary action first in a group'],
                  ['Use one high emphasis button per section', 'Use multiple high emphasis buttons'],
                  ['Keep button labels short and action-oriented', 'Use vague labels like "Click Here"'],
                  ['Use destructive style for irreversible actions', 'Use destructive style for warnings'],
                  ['Include aria-label for icon-only buttons', 'Omit accessibility labels'],
                ]}
              />
            </div>
          </section>
        </>
      )}
    </StyleguideLayout>
  )
}
