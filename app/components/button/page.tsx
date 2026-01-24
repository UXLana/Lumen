'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox } from '../../design-system/shared'
import { Button, ButtonGroup, DropdownIcon, ButtonSize, ButtonEmphasis } from '@/components'
import { IconPlus, IconSettings } from '@/components/Icons'
import { colors, typography, button, borderRadius } from '@/styles/design-tokens'

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
              <CodeBlock>{`import { Button, ButtonGroup } from '@/components'`}</CodeBlock>
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
                    previewBackground={demoOnDark ? colors.brand.primary : colors.neutral[50]}
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
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>
            <p style={sharedStyles.sectionDescription}>
              Typography scale and spacing values used in the button component.
            </p>

            {/* Typography Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography Tokens</h3>
              <SpecTable
                headers={['Size', 'Font Size', 'Font Weight', 'Line Height', 'Letter Spacing']}
                rows={sizes.map(size => [
                  <code key={size}>{size}</code>,
                  button.typography[size].fontSize,
                  button.typography[size].fontWeight.toString(),
                  button.typography[size].lineHeight,
                  button.typography[size].letterSpacing,
                ])}
              />
            </div>

            {/* Spacing Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Spacing Tokens</h3>
              <SpecTable
                headers={['Size', 'Height', 'Min Width', 'Padding X', 'Padding Y', 'Gap']}
                rows={sizes.map(size => [
                  <code key={size}>{size}</code>,
                  button.sizes[size].height,
                  button.sizes[size].minWidth,
                  button.sizes[size].paddingX,
                  button.sizes[size].paddingY,
                  button.sizes[size].gap,
                ])}
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
                  <div style={{ ...typography.label.md }}>Pill Shape</div>
                  <code style={{ ...typography.code.sm }}>{button.borderRadius}</code>
                </div>
              </div>
            </div>
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
