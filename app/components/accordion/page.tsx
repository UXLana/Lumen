'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox } from '../../design-system/shared'
import { Accordion, AccordionItem } from '@/components'
import { colors, spacing, typography, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation'
type AccordionVariant = 'default' | 'filled' | 'inverted'

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function AccordionPage() {
  const variants: AccordionVariant[] = ['default', 'filled', 'inverted']

  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive playground state
  const [demoVariant, setDemoVariant] = useState<AccordionVariant>('default')
  const [demoAllowMultiple, setDemoAllowMultiple] = useState(true)
  const [demoFullWidth, setDemoFullWidth] = useState(true)
  const [demoShowValue, setDemoShowValue] = useState(false)
  const [demoShowMenu, setDemoShowMenu] = useState(false)

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
  ]

  // Dynamic background based on variant
  const getPlaygroundBackground = () => {
    if (demoVariant === 'inverted') return colors.surface.paper
    return colors.surface.default
  }

  return (
    <StyleguideLayout
      title="Accordion"
      description="Accordions display a list of high-level options that can expand/collapse to reveal more information. Use them to organize content into collapsible sections."
      activeId="accordion"
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
import { Accordion, AccordionItem } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { Accordion, AccordionItem } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Experiment with accordion properties to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <div style={{ width: demoFullWidth ? '100%' : 'auto', maxWidth: '400px' }}>
                        <Accordion
                          variant={demoVariant}
                          allowMultiple={demoAllowMultiple}
                          fullWidth={demoFullWidth}
                          defaultExpandedIds={['demo-1']}
                        >
                          <AccordionItem
                            id="demo-1"
                            title="Account Settings"
                            showMenu={demoShowMenu && !demoShowValue}
                            value={demoShowValue ? 'Value' : undefined}
                          >
                            <p style={{ margin: 0, ...typography.body.md, color: colors.text.lowEmphasis.onLight }}>
                              Manage your account preferences and personal information.
                            </p>
                          </AccordionItem>
                          <AccordionItem
                            id="demo-2"
                            title="Security"
                            showMenu={demoShowMenu && !demoShowValue}
                            value={demoShowValue ? 'Value' : undefined}
                          >
                            <p style={{ margin: 0, ...typography.body.md, color: colors.text.lowEmphasis.onLight }}>
                              Configure two-factor authentication and security alerts.
                            </p>
                          </AccordionItem>
                          <AccordionItem
                            id="demo-3"
                            title="Notifications"
                            showMenu={demoShowMenu && !demoShowValue}
                            value={demoShowValue ? 'Value' : undefined}
                          >
                            <p style={{ margin: 0, ...typography.body.md, color: colors.text.lowEmphasis.onLight }}>
                              Set your notification preferences for email and push.
                            </p>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    }
                    code={`<Accordion
  variant="${demoVariant}"
  allowMultiple={${demoAllowMultiple}}
  fullWidth={${demoFullWidth}}
  defaultExpandedIds={['1']}
>
  <AccordionItem
    id="1"
    title="Account Settings"${demoShowMenu && !demoShowValue ? '\n    showMenu' : ''}${demoShowValue ? '\n    value="Value"' : ''}
  >
    <p>Content goes here...</p>
  </AccordionItem>
  <AccordionItem
    id="2"
    title="Security"${demoShowMenu && !demoShowValue ? '\n    showMenu' : ''}${demoShowValue ? '\n    value="Value"' : ''}
  >
    <p>Content goes here...</p>
  </AccordionItem>
</Accordion>`}
                    previewPadding="32px 24px"
                    previewBackground={getPlaygroundBackground()}
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
                      <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, marginTop: '8px', marginBottom: 0 }}>
                        {demoVariant === 'default' && 'Divider-separated panels on any background'}
                        {demoVariant === 'filled' && 'Gray card panels on white background'}
                        {demoVariant === 'inverted' && 'White card panels on gray background'}
                      </p>
                    </div>

                    {/* Options */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '12px' }}>
                        Accordion Options
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {demoVariant === 'default' && (
                          <StyledCheckbox
                            checked={demoFullWidth}
                            onChange={setDemoFullWidth}
                            label="Full width"
                          />
                        )}
                        <StyledCheckbox
                          checked={demoAllowMultiple}
                          onChange={setDemoAllowMultiple}
                          label="Allow multiple expanded"
                        />
                      </div>
                    </div>

                    {/* Item Options */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '12px' }}>
                        Item Options
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <StyledCheckbox
                          checked={demoShowValue}
                          onChange={(checked) => {
                            setDemoShowValue(checked)
                            if (checked) setDemoShowMenu(false)
                          }}
                          label="Show value text"
                        />
                        <StyledCheckbox
                          checked={demoShowMenu}
                          onChange={(checked) => {
                            setDemoShowMenu(checked)
                            if (checked) setDemoShowValue(false)
                          }}
                          label="Show overflow menu"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>

            <div style={sharedStyles.card}>
              <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Spacing & Dimensions</h3>
              <SpecTable
                headers={['Element', 'Property', 'Value']}
                rows={[
                  ['Header', 'Padding (vertical)', '8px'],
                  ['Header', 'Gap', '8px'],
                  ['Content (default)', 'Padding (left)', '32px'],
                  ['Content (filled/inverted)', 'Padding (left)', '36px (aligned under title)'],
                  ['Content', 'Padding (bottom)', '16px'],
                  ['Chevron Icon', 'Size', '20px'],
                  ['Menu Button', 'Size', '40px'],
                  ['Divider', 'Height', '1px'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography</h3>
              <SpecTable
                headers={['Element', 'Font', 'Size', 'Weight']}
                rows={[
                  ['Title', 'DM Sans', '20px', '600 (SemiBold)'],
                  ['Content', 'DM Sans', '16px', '400 (Regular)'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Colors by Variant</h3>
              <SpecTable
                headers={['Element', 'Default', 'Filled', 'Inverted']}
                rows={[
                  ['Panel Background', 'transparent', 'neutral.50 (gray)', 'neutral.0 (white)'],
                  ['Surface Background', 'any', 'white', 'gray'],
                  ['Divider', 'border.light', 'N/A', 'N/A'],
                  ['Title', 'text.highEmphasis', 'text.highEmphasis', 'text.highEmphasis'],
                  ['Chevron Icon', 'text.mediumEmphasis', 'text.mediumEmphasis', 'text.mediumEmphasis'],
                  ['Hover', 'rgba(0,0,0,0.04)', 'rgba(0,0,0,0.04)', 'rgba(0,0,0,0.02)'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Animation</h3>
              <SpecTable
                headers={['Property', 'Duration', 'Easing']}
                rows={[
                  ['Height (Expand/Collapse)', '300ms', 'cubic-bezier(0.4, 0, 0.2, 1)'],
                  ['Opacity', '200ms', 'cubic-bezier(0.4, 0, 0.2, 1)'],
                  ['Chevron rotation', '200ms', 'cubic-bezier(0.4, 0, 0.2, 1)'],
                ]}
              />
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
              <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Import</h3>
              <CodeBlock>
{`import { Accordion, AccordionItem } from '@/components'
import type { AccordionProps, AccordionItemProps } from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`// Default variant with dividers
<Accordion defaultExpandedIds={['1']}>
  <AccordionItem id="1" title="First Section">
    <p>Content for the first section.</p>
  </AccordionItem>
  <AccordionItem id="2" title="Second Section">
    <p>Content for the second section.</p>
  </AccordionItem>
</Accordion>

// Filled variant (gray cards on white)
<Accordion variant="filled">
  <AccordionItem id="1" title="Settings" showMenu>
    <p>Settings content...</p>
  </AccordionItem>
</Accordion>

// Inverted variant (white cards on gray)
<Accordion variant="inverted">
  <AccordionItem id="1" title="Filter">
    <p>Filter options...</p>
  </AccordionItem>
</Accordion>

// Single expansion mode (FAQ style)
<Accordion allowMultiple={false}>
  <AccordionItem id="q1" title="Question 1">
    <p>Answer 1...</p>
  </AccordionItem>
</Accordion>

// With text value on the right
<Accordion variant="default">
  <AccordionItem id="1" title="Heading" value="Value">
    <p>Content...</p>
  </AccordionItem>
  <AccordionItem id="2" title="Heading" value="$99.00">
    <p>Content...</p>
  </AccordionItem>
</Accordion>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Controlled Mode</h3>
              <CodeBlock>
{`const [expandedIds, setExpandedIds] = useState<string[]>(['1'])

<Accordion
  expandedIds={expandedIds}
  onExpandedChange={setExpandedIds}
>
  <AccordionItem id="1" title="Section 1">
    <p>Content...</p>
  </AccordionItem>
  <AccordionItem id="2" title="Section 2">
    <p>Content...</p>
  </AccordionItem>
</Accordion>`}
              </CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Accordion Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="ch">children</code>, <code key="cht">ReactNode</code>, 'required', 'AccordionItem components'],
                  [<code key="v">variant</code>, <code key="vt">&apos;default&apos; | &apos;filled&apos; | &apos;inverted&apos;</code>, <code key="vd">&apos;default&apos;</code>, 'Visual style variant'],
                  [<code key="am">allowMultiple</code>, <code key="amt">boolean</code>, <code key="amd">true</code>, 'Allow multiple expanded items'],
                  [<code key="de">defaultExpandedIds</code>, <code key="det">string[]</code>, <code key="ded">[]</code>, 'Initially expanded items (uncontrolled)'],
                  [<code key="ei">expandedIds</code>, <code key="eit">string[]</code>, '-', 'Controlled expanded state'],
                  [<code key="oe">onExpandedChange</code>, <code key="oet">(ids: string[]) =&gt; void</code>, '-', 'Change callback'],
                  [<code key="fw">fullWidth</code>, <code key="fwt">boolean</code>, <code key="fwd">true</code>, 'Full width layout'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>AccordionItem Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="id">id</code>, <code key="idt">string</code>, 'required', 'Unique identifier'],
                  [<code key="t">title</code>, <code key="tt">string</code>, 'required', 'Header title text'],
                  [<code key="ch">children</code>, <code key="cht">ReactNode</code>, 'required', 'Panel content'],
                  [<code key="d">disabled</code>, <code key="dt">boolean</code>, <code key="dd">false</code>, 'Disable interaction'],
                  [<code key="sm">showMenu</code>, <code key="smt">boolean</code>, <code key="smd">false</code>, 'Show overflow menu'],
                  [<code key="om">onMenuClick</code>, <code key="omt">(id: string) =&gt; void</code>, '-', 'Menu click callback'],
                  [<code key="ic">icon</code>, <code key="ict">ReactNode</code>, '-', 'Custom expand icon (replaces chevron)'],
                  [<code key="val">value</code>, <code key="valt">string</code>, '-', 'Text value on right side (alternative to menu)'],
                  [<code key="ovc">onValueClick</code>, <code key="ovct">(id: string) =&gt; void</code>, '-', 'Value text click callback'],
                ]}
              />
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>When to Use Each Variant</h3>
              <SpecTable
                headers={['Variant', 'Surface', 'Use Case']}
                rows={[
                  [<code key="d">default</code>, 'Any', 'Standard content sections, forms, FAQ lists'],
                  [<code key="f">filled</code>, 'White', 'Settings panels, card-based layouts on white surfaces'],
                  [<code key="i">inverted</code>, 'Gray', 'Sidebar filters, settings on gray backgrounds'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <SpecTable
                headers={['Feature', 'Implementation']}
                rows={[
                  ['Keyboard', 'Tab to navigate, Enter/Space to toggle'],
                  ['ARIA', 'aria-expanded, aria-disabled on headers'],
                  ['Focus', 'Visible focus ring on interactive elements'],
                  ['Screen readers', 'Proper heading hierarchy, state announcements'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
                <div style={{
                  background: '#DEEDE9',
                  padding: spacing[4],
                  borderRadius: borderRadius.md
                }}>
                  <p style={{ ...typography.label.md, color: '#155E4C', margin: 0, marginBottom: spacing[2] }}>Do</p>
                  <ul style={{ margin: 0, paddingLeft: spacing[4], ...typography.body.sm }}>
                    <li>Use clear, descriptive titles</li>
                    <li>Keep content scannable</li>
                    <li>Consider default expanded states</li>
                    <li>Match variant to surface color</li>
                    <li>Use single-expand for mutually exclusive content</li>
                  </ul>
                </div>
                <div style={{
                  background: '#FBE4E7',
                  padding: spacing[4],
                  borderRadius: borderRadius.md
                }}>
                  <p style={{ ...typography.label.md, color: '#9A0818', margin: 0, marginBottom: spacing[2] }}>Don&apos;t</p>
                  <ul style={{ margin: 0, paddingLeft: spacing[4], ...typography.body.sm }}>
                    <li>Nest accordions within accordions</li>
                    <li>Hide critical information in collapsed panels</li>
                    <li>Use for primary navigation</li>
                    <li>Have too many accordion items (5-7 max)</li>
                    <li>Use filled on gray or inverted on white</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </StyleguideLayout>
  )
}
