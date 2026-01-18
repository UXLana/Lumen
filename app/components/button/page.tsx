'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton } from '../../design-system/shared'
import { Button, ButtonGroup, DropdownIcon, ButtonSize, ButtonEmphasis } from '@/components'
import { colors, typography, button, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// SAMPLE ICONS
// =============================================================================

type PageTab = 'overview' | 'implementation'

function IconPlus({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconHome({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconSettings({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98466 18.3924 8.24634 18.3715 8.51677C18.3506 8.7872 18.3938 9.0588 18.4975 9.30938C18.6013 9.55996 18.7627 9.78258 18.9687 9.95905C19.1747 10.1355 19.4194 10.2609 19.683 10.325C21.439 10.751 21.439 13.249 19.683 13.675C19.4192 13.7389 19.1742 13.8642 18.968 14.0407C18.7618 14.2172 18.6001 14.4399 18.4962 14.6907C18.3924 14.9414 18.3491 15.2132 18.3701 15.4838C18.3911 15.7544 18.4757 16.0162 18.617 16.248C19.557 17.791 17.791 19.558 16.247 18.618C16.0153 18.4769 15.7537 18.3924 15.4832 18.3715C15.2128 18.3506 14.9412 18.3938 14.6906 18.4975C14.44 18.6013 14.2174 18.7627 14.0409 18.9687C13.8645 19.1747 13.7391 19.4194 13.675 19.683C13.249 21.439 10.751 21.439 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4962C9.05859 18.3924 8.78683 18.3491 8.51621 18.3701C8.24559 18.3911 7.98375 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0153 5.60755 15.7537 5.62848 15.4832C5.64942 15.2128 5.60624 14.9412 5.50247 14.6906C5.3987 14.44 5.23726 14.2174 5.03127 14.0409C4.82529 13.8645 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78683 5.62987 8.51621C5.60889 8.24559 5.5243 7.98375 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C8.753 5.99 10.049 5.452 10.325 4.317Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconTrash({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconEdit({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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
                      <Button
                        size={demoSize}
                        emphasis={demoEmphasis}
                        destructive={demoDestructive}
                        loading={demoLoading}
                        disabled={demoDisabled}
                        leftIcon={demoLeftIcon ? <IconPlus size={demoSize === 'lg' ? 24 : 20} /> : undefined}
                        rightIcon={demoRightIcon ? <DropdownIcon size={demoSize === 'lg' ? 20 : 16} /> : undefined}
                      >
                        Button
                      </Button>
                    }
                    code={`<Button
  size="${demoSize}"
  emphasis="${demoEmphasis}"${demoDestructive ? '\n  destructive' : ''}${demoLoading ? '\n  loading' : ''}${demoDisabled ? '\n  disabled' : ''}${demoLeftIcon ? '\n  leftIcon={<IconPlus />}' : ''}${demoRightIcon ? '\n  rightIcon={<DropdownIcon />}' : ''}
>
  Button
</Button>`}
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
                      {[
                        { label: 'Destructive', value: demoDestructive, setter: setDemoDestructive },
                        { label: 'Loading', value: demoLoading, setter: setDemoLoading },
                        { label: 'Disabled', value: demoDisabled, setter: setDemoDisabled },
                        { label: 'Left Icon', value: demoLeftIcon, setter: setDemoLeftIcon },
                        { label: 'Right Icon', value: demoRightIcon, setter: setDemoRightIcon },
                      ].map(({ label, value, setter }) => (
                        <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setter(e.target.checked)}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span style={{ ...typography.label.sm }}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>
            <p style={sharedStyles.sectionDescription}>
              Color tokens, typography scale, and spacing values used in the button component.
            </p>

            {/* Color Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Color Tokens</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {/* High Emphasis */}
                <div>
                  <h4 style={{ ...typography.label.md, marginBottom: '12px' }}>High Emphasis</h4>
                  {['enabled', 'hover', 'pressed', 'disabled'].map((state) => {
                    const stateColors = button.emphasis.high[state as keyof typeof button.emphasis.high]
                    return (
                      <div key={state} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          background: stateColors.background,
                          border: '1px solid rgba(0,0,0,0.1)',
                        }} />
                        <div>
                          <div style={{ ...typography.label.sm }}>{state}</div>
                          <div style={{ ...typography.code.sm, color: stateColors.background }}>{stateColors.background}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Mid Emphasis */}
                <div>
                  <h4 style={{ ...typography.label.md, marginBottom: '12px' }}>Mid Emphasis</h4>
                  {['enabled', 'hover', 'pressed', 'disabled'].map((state) => {
                    const stateColors = button.emphasis.mid[state as keyof typeof button.emphasis.mid]
                    return (
                      <div key={state} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          background: stateColors.background || '#fff',
                          border: `2px solid ${stateColors.border}`,
                        }} />
                        <div>
                          <div style={{ ...typography.label.sm }}>{state}</div>
                          <div style={{ ...typography.code.sm, color: stateColors.text }}>{stateColors.border}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Destructive */}
                <div>
                  <h4 style={{ ...typography.label.md, marginBottom: '12px' }}>Destructive (High)</h4>
                  {['enabled', 'hover', 'pressed', 'disabled'].map((state) => {
                    const stateColors = button.destructive.high[state as keyof typeof button.destructive.high]
                    return (
                      <div key={state} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          background: stateColors.background,
                          border: '1px solid rgba(0,0,0,0.1)',
                        }} />
                        <div>
                          <div style={{ ...typography.label.sm }}>{state}</div>
                          <div style={{ ...typography.code.sm, color: stateColors.background }}>{stateColors.background}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

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

          {/* ========== BUTTON GROUPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Button Groups</h2>
            <p style={sharedStyles.sectionDescription}>
              Group related buttons together with consistent spacing.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Default Spacing</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                Use default spacing for button groups in dialogs and forms.
              </p>
              <ButtonGroup spacing="default">
                <Button emphasis="low">Cancel</Button>
                <Button emphasis="high">Save</Button>
              </ButtonGroup>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Form Spacing</h3>
              <ButtonGroup spacing="form">
                <Button emphasis="low">Cancel</Button>
                <Button emphasis="mid">Save Draft</Button>
                <Button emphasis="high">Submit</Button>
              </ButtonGroup>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Mobile Form (Stacked)</h3>
              <div style={{ maxWidth: '300px' }}>
                <ButtonGroup spacing="formMobile" align="stretch">
                  <Button emphasis="high">Continue</Button>
                  <Button emphasis="low">Cancel</Button>
                </ButtonGroup>
              </div>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Inline Actions</h3>
              <ButtonGroup spacing="inline">
                <Button emphasis="mid" size="md">Edit</Button>
                <Button emphasis="mid" size="md">Duplicate</Button>
                <Button emphasis="mid" size="md" destructive>Delete</Button>
              </ButtonGroup>
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
