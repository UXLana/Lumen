'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  SpecTable,
  Playground,
  PillButton,
  StyledCheckbox,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import { Chip, ChipGroup } from '@/components'
import { colors, spacing, typography, borderRadius, fontFamilies } from '@/styles/design-tokens'

// =============================================================================
// DOCUMENTATION DATA
// =============================================================================

const chipDocData: ComponentDocData = {
  displayName: 'Chip',
  importPath: '@/components',
  importStatement: `import { Chip, ChipGroup } from '@/components'
import type { ChipProps, ChipGroupProps, ChipState, ChipLeftContent } from '@/components'`,
  description:
    'Chips represent complex entities in small blocks, such as a contact, tag, or filter. They can contain text, an icon, an avatar, and a remove action.',
  props: [
    { name: 'selected', type: 'boolean', default: 'false', description: 'Whether the chip is selected' },
    { name: 'leftContent', type: "'none' | 'icon' | 'avatar'", default: "'none'", description: 'Content to show on the left side' },
    { name: 'icon', type: 'ReactNode', description: 'Left icon element (when leftContent="icon")' },
    { name: 'avatarSrc', type: 'string', description: 'Avatar image source (when leftContent="avatar")' },
    { name: 'avatarAlt', type: 'string', default: "''", description: 'Avatar alt text' },
    { name: 'removable', type: 'boolean', default: 'false', description: 'Show the remove/close icon on the right' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Chip label text' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the chip is disabled' },
    { name: 'error', type: 'boolean', default: 'false', description: 'Whether the chip is in an error state' },
    { name: 'onSelect', type: '(selected: boolean) => void', description: 'Callback when the chip is toggled' },
    { name: 'onRemove', type: '() => void', description: 'Callback when the remove icon is clicked' },
  ],
  subComponents: [
    {
      name: 'ChipGroup',
      description: 'A container that arranges Chip components in a horizontal row with consistent spacing and listbox semantics.',
      props: [
        { name: 'gap', type: "'sm' | 'md'", default: "'sm'", description: 'Gap between chips (sm = 8px, md = 12px)' },
        { name: 'wrap', type: 'boolean', default: 'true', description: 'Wrap chips to next line when they overflow' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Chip components' },
      ],
    },
  ],
  typeDefinitions: [
    { name: 'ChipState', definition: "type ChipState = 'enabled' | 'hover' | 'disabled' | 'dragged' | 'error'" },
    { name: 'ChipLeftContent', definition: "type ChipLeftContent = 'none' | 'icon' | 'avatar'" },
  ],
  accessibility: [
    { feature: 'Keyboard Navigation', description: 'Enter/Space toggles selection. Backspace/Delete removes when removable.' },
    { feature: 'Focus Indicator', description: 'Visible focus ring using box-shadow, meets WCAG 2.4.7.' },
    { feature: 'ARIA Roles', description: 'Standalone: role="button" + aria-pressed. In ChipGroup: role="option" + aria-selected.' },
    { feature: 'Error State', description: 'aria-invalid="true" set when error prop is true.' },
    { feature: 'Remove Button', description: 'Delete icon has contextual aria-label "Remove [label]".' },
    { feature: 'Listbox Pattern', description: 'ChipGroup provides role="listbox" with aria-label for grouped chips.' },
  ],
  tokens: [
    { token: 'colors.chipBg.enabled', value: 'rgba(0,0,0,0.08)', usage: 'Default chip background' },
    { token: 'colors.chipBg.hover', value: 'rgba(0,0,0,0.13)', usage: 'Hovered chip background' },
    { token: 'colors.focusBorder.onLight', value: 'Theme focus color', usage: 'Focus ring color' },
    { token: 'borderRadiusSemantics.chip', value: '9999px (full)', usage: 'Chip border radius' },
    { token: 'typography.body.sm', value: '14px/20px', usage: 'Chip label text' },
    { token: 'spacing.xs / spacing.sm', value: '8px / 12px', usage: 'ChipGroup gap (sm/md)' },
  ],
  relatedComponents: [
    { name: 'Badge', href: '/components/badge' },
    { name: 'Button', href: '/components/button' },
  ],
  notes: [
    'Use ChipGroup with aria-label when rendering multiple filter or selection chips.',
    'Selected state uses a dark fill (#4A4A4A) with white text for strong contrast.',
    'Error chips show a 2px red border (#DC0C22) regardless of selection.',
    'Removable chips should always provide an onRemove handler.',
    'When using inside ChipGroup, ARIA roles are automatically managed via _inGroup prop.',
  ],
  // ── Usage Intelligence ──
  whenToUse: [
    'Interactive filter controls that users can toggle on/off (e.g., filter by category, state, status).',
    'Removable tags representing user selections (e.g., selected filters, assigned tags, multi-select tokens).',
    'Compact, clickable entities that represent a selectable value in a horizontal group.',
  ],
  whenNotToUse: [
    { scenario: 'Static status indicators on data rows (e.g., "Active", "Pending")', instead: 'Badge — non-interactive, read-only status display' },
    { scenario: 'Primary or secondary page actions', instead: 'Button — designed for actions with emphasis levels' },
    { scenario: 'Navigation between content views', instead: 'Tab — content panel switching with underline indicators' },
  ],
  usageExamples: [
    {
      title: 'Filter chip group',
      description: 'Horizontal row of toggleable filters. Use ChipGroup with aria-label. Track selected state to filter data.',
      isDefault: true,
      code: `<ChipGroup aria-label="Filter by category">\n  {categories.map(cat => (\n    <Chip\n      key={cat.id}\n      label={cat.name}\n      selected={activeFilters.includes(cat.id)}\n      onSelect={() => toggleFilter(cat.id)}\n    />\n  ))}\n</ChipGroup>`,
    },
    {
      title: 'Removable selection tokens',
      description: 'Show selected items as removable chips (e.g., after multi-select). Each chip has an onRemove handler.',
      code: `<ChipGroup aria-label="Selected states">\n  {selectedStates.map(state => (\n    <Chip\n      key={state}\n      label={state}\n      removable\n      onRemove={() => removeState(state)}\n    />\n  ))}\n</ChipGroup>`,
    },
  ],
}

// =============================================================================
// DEMO ICON (simple filter icon for playground)
// =============================================================================

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.25 4.5H15.75M4.5 9H13.5M6.75 13.5H11.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// =============================================================================
// PAGE COMPONENT
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

export default function ChipPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoSelected, setDemoSelected] = useState(false)
  const [demoLeftContent, setDemoLeftContent] = useState<'none' | 'icon' | 'avatar'>('none')
  const [demoRemovable, setDemoRemovable] = useState(false)
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoError, setDemoError] = useState(false)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  // Build code string for playground
  const buildCodeString = () => {
    const props: string[] = []
    if (demoSelected) props.push('selected')
    if (demoLeftContent === 'icon') props.push('leftContent="icon" icon={<FilterIcon />}')
    if (demoLeftContent === 'avatar') props.push('leftContent="avatar" avatarSrc="/avatar.jpg" avatarAlt="User"')
    if (demoRemovable) props.push('removable onRemove={() => {}}')
    if (demoDisabled) props.push('disabled')
    if (demoError) props.push('error')
    if (demoSelected) props.push('onSelect={(s) => setSelected(s)}')

    const propsStr = props.length > 0 ? ' ' + props.join(' ') : ''
    return `<Chip${propsStr}>Label</Chip>`
  }

  return (
    <StyleguideLayout
      title="Chip"
      description="Chips represent complex entities in small blocks, such as a contact, tag, or filter criteria."
      tagline="Tiny labels with serious filtering power."
      activeId="chip"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
    >
      {/* ================================================================= */}
      {/* OVERVIEW TAB                                                      */}
      {/* ================================================================= */}
      {activePageTab === 'overview' && (
        <>
          {/* Quick Start */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <CodeBlock>{`import { Chip, ChipGroup } from '@/components'

// Basic chip
<Chip>Label</Chip>

// Selected chip
<Chip selected onSelect={(s) => console.log(s)}>Selected</Chip>

// Removable chip
<Chip removable onRemove={() => console.log('removed')}>Removable</Chip>

// Chip group with filter chips
<ChipGroup aria-label="Filter by category">
  <Chip>All</Chip>
  <Chip selected>Active</Chip>
  <Chip>Inactive</Chip>
</ChipGroup>`}</CodeBlock>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Explore all Chip variants and configurations.
            </p>

            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {/* Left Content */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight, minWidth: '100px' }}>
                  Left Content
                </span>
                {(['none', 'icon', 'avatar'] as const).map((lc) => (
                  <PillButton
                    key={lc}
                    isActive={demoLeftContent === lc}
                    onClick={() => setDemoLeftContent(lc)}
                  >
                    {lc}
                  </PillButton>
                ))}
              </div>

              {/* Boolean toggles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <StyledCheckbox checked={demoSelected} onChange={setDemoSelected} label="Selected" />
                <StyledCheckbox checked={demoRemovable} onChange={setDemoRemovable} label="Removable" />
                <StyledCheckbox checked={demoDisabled} onChange={setDemoDisabled} label="Disabled" />
                <StyledCheckbox checked={demoError} onChange={setDemoError} label="Error" />
              </div>
            </div>

            <Playground
              preview={
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip
                    selected={demoSelected}
                    leftContent={demoLeftContent}
                    icon={demoLeftContent === 'icon' ? <FilterIcon /> : undefined}
                    avatarSrc={demoLeftContent === 'avatar' ? 'https://i.pravatar.cc/48?u=chip-demo' : undefined}
                    avatarAlt="Demo user"
                    removable={demoRemovable}
                    disabled={demoDisabled}
                    error={demoError}
                    onSelect={(s) => setDemoSelected(s)}
                    onRemove={demoRemovable ? () => {} : undefined}
                  >
                    Label
                  </Chip>
                </div>
              }
              code={buildCodeString()}
            />
          </section>

          {/* All States Gallery */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>States</h2>
            <p style={sharedStyles.sectionDescription}>
              All chip states rendered together for visual reference.
            </p>

            <Playground
              preview={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                  {/* Unselected states */}
                  <div>
                    <div style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight, marginBottom: '12px' }}>
                      Unselected
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <Chip>Enabled</Chip>
                      <Chip disabled>Disabled</Chip>
                      <Chip error>Error</Chip>
                    </div>
                  </div>

                  {/* Selected states */}
                  <div>
                    <div style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight, marginBottom: '12px' }}>
                      Selected
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <Chip selected>Selected</Chip>
                    </div>
                  </div>

                  {/* With left content */}
                  <div>
                    <div style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight, marginBottom: '12px' }}>
                      Left Content
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <Chip leftContent="icon" icon={<FilterIcon />}>With Icon</Chip>
                      <Chip leftContent="avatar" avatarSrc="https://i.pravatar.cc/48?u=chip1" avatarAlt="User">
                        With Avatar
                      </Chip>
                    </div>
                  </div>

                  {/* Removable */}
                  <div>
                    <div style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight, marginBottom: '12px' }}>
                      Removable
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <Chip removable onRemove={() => {}}>Removable</Chip>
                      <Chip selected removable onRemove={() => {}}>Selected + Removable</Chip>
                    </div>
                  </div>
                </div>
              }
              code={`{/* Unselected states */}
<Chip>Enabled</Chip>
<Chip disabled>Disabled</Chip>
<Chip error>Error</Chip>

{/* Selected */}
<Chip selected>Selected</Chip>

{/* Left content */}
<Chip leftContent="icon" icon={<FilterIcon />}>With Icon</Chip>
<Chip leftContent="avatar" avatarSrc="/avatar.jpg" avatarAlt="User">With Avatar</Chip>

{/* Removable */}
<Chip removable onRemove={() => {}}>Removable</Chip>`}
              previewPadding="32px"
              previewStretch
            />
          </section>

          {/* ChipGroup */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>ChipGroup</h2>
            <p style={sharedStyles.sectionDescription}>
              Use ChipGroup to arrange multiple chips with consistent spacing and listbox semantics.
            </p>

            <Playground
              preview={
                <ChipGroup aria-label="Filter by category">
                  <Chip>All</Chip>
                  <Chip selected>Plants</Chip>
                  <Chip>Packages</Chip>
                  <Chip>Transfers</Chip>
                  <Chip>Sales</Chip>
                </ChipGroup>
              }
              code={`<ChipGroup aria-label="Filter by category">
  <Chip>All</Chip>
  <Chip selected>Plants</Chip>
  <Chip>Packages</Chip>
  <Chip>Transfers</Chip>
  <Chip>Sales</Chip>
</ChipGroup>`}
            />
          </section>

          {/* Design Tokens */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Tokens</h2>

            <h3 style={sharedStyles.cardTitle}>Spacing & Dimensions</h3>
            <SpecTable
              headers={['Property', 'Value', 'Token']}
              rows={[
                ['Height', '32px', 'Fixed'],
                ['Padding (default)', '7px 12px', 'Fixed'],
                ['Padding (with avatar)', '7px 12px 7px 4px', 'Fixed'],
                ['Inner gap', '8px', 'Fixed'],
                ['Icon size', '18px', 'Fixed'],
                ['Avatar size', '24px', 'Fixed'],
                ['Border radius', '9999px', 'borderRadiusSemantics.chip'],
                ['ChipGroup gap (sm)', '8px', 'spacing.xs'],
                ['ChipGroup gap (md)', '12px', 'spacing.sm'],
              ]}
            />

            <h3 style={sharedStyles.cardTitle}>Typography</h3>
            <SpecTable
              headers={['Property', 'Value', 'Token']}
              rows={[
                ['Font family', 'Body font', 'fontFamilies.body'],
                ['Font size', '14px', 'typography.body.sm.fontSize'],
                ['Font weight', '400 (regular)', 'fontWeights.regular'],
                ['Line height', '20px', 'typography.body.sm.lineHeight'],
              ]}
            />

            <h3 style={sharedStyles.cardTitle}>Colors</h3>
            <SpecTable
              headers={['State', 'Background', 'Text', 'Border']}
              rows={[
                ['Enabled', 'rgba(0,0,0,0.08)', 'text.highEmphasis.onLight', 'none'],
                ['Hover', 'rgba(0,0,0,0.13)', 'text.highEmphasis.onLight', 'none'],
                ['Disabled', 'rgba(0,0,0,0.03)', 'text.disabled.onLight', 'none'],
                ['Selected', '#4A4A4A', '#FFFFFF', 'none'],
                ['Selected + Hover', '#3A3A3A', '#FFFFFF', 'none'],
                ['Error', 'rgba(0,0,0,0.08)', 'text.highEmphasis.onLight', '2px solid #DC0C22'],
                ['Dragged', 'rgba(0,0,0,0.08)', 'text.highEmphasis.onLight', 'box-shadow elevation'],
              ]}
            />

            <h3 style={sharedStyles.cardTitle}>Focus & Animation</h3>
            <SpecTable
              headers={['Property', 'Value', 'Token']}
              rows={[
                ['Focus ring color', 'Theme focus color', 'colors.focusBorder.onLight'],
                ['Focus ring offset', '2px', 'Fixed'],
                ['Transition', '150ms ease', 'background, box-shadow, border-color'],
                ['Drag shadow', '0px 0px 4px rgba(0,0,0,0.13), 0px 3px 8px rgba(0,0,0,0.1)', 'Composite shadow'],
              ]}
            />
          </section>
        </>
      )}

      {/* ================================================================= */}
      {/* IMPLEMENTATION TAB                                                */}
      {/* ================================================================= */}
      {activePageTab === 'implementation' && (
        <>
          {/* Usage */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>
            <p style={sharedStyles.sectionDescription}>
              Import Chip and ChipGroup from the components library.
            </p>
            <CodeBlock>{`import { Chip, ChipGroup } from '@/components'
import type { ChipProps, ChipGroupProps } from '@/components'`}</CodeBlock>

            <h3 style={sharedStyles.cardTitle}>Filter Chip Pattern</h3>
            <CodeBlock>{`function FilterChips() {
  const [selected, setSelected] = useState<string[]>(['plants'])
  const categories = ['all', 'plants', 'packages', 'transfers', 'sales']

  const toggle = (cat: string) => {
    setSelected(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    )
  }

  return (
    <ChipGroup aria-label="Filter by category">
      {categories.map(cat => (
        <Chip
          key={cat}
          selected={selected.includes(cat)}
          onSelect={() => toggle(cat)}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </Chip>
      ))}
    </ChipGroup>
  )
}`}</CodeBlock>

            <h3 style={sharedStyles.cardTitle}>Removable Tags Pattern</h3>
            <CodeBlock>{`function TagInput() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Next.js'])

  return (
    <ChipGroup aria-label="Selected tags">
      {tags.map(tag => (
        <Chip
          key={tag}
          removable
          onRemove={() => setTags(t => t.filter(x => x !== tag))}
        >
          {tag}
        </Chip>
      ))}
    </ChipGroup>
  )
}`}</CodeBlock>
          </section>

          {/* Props */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <h3 style={sharedStyles.cardTitle}>Chip Props</h3>
            <SpecTable
              headers={['Prop', 'Type', 'Default', 'Description']}
              rows={chipDocData.props.map(p => [
                p.name + (p.required ? ' *' : ''),
                p.type,
                p.default || '—',
                p.description,
              ])}
            />

            <h3 style={sharedStyles.cardTitle}>ChipGroup Props</h3>
            <SpecTable
              headers={['Prop', 'Type', 'Default', 'Description']}
              rows={chipDocData.subComponents![0].props.map(p => [
                p.name + (p.required ? ' *' : ''),
                p.type,
                p.default || '—',
                p.description,
              ])}
            />
          </section>

          {/* Design Guidance */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <h3 style={sharedStyles.cardTitle}>When to Use</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '32px',
            }}>
              {/* Do */}
              <div style={{
                background: colors.surface.lightDarker,
                borderRadius: borderRadius.lg,
                padding: '24px',
                borderTop: `3px solid ${colors.status.success}`,
              }}>
                <div style={{ ...typography.label.md, color: colors.status.success, marginBottom: '12px' }}>
                  Do
                </div>
                <ul style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight, paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>Use chips for filter selections and multi-select categories</li>
                  <li>Use removable chips for user-generated tags</li>
                  <li>Use ChipGroup with an aria-label for grouped chips</li>
                  <li>Keep labels short (1-3 words)</li>
                  <li>Provide onRemove when removable is true</li>
                </ul>
              </div>

              {/* Don't */}
              <div style={{
                background: colors.surface.lightDarker,
                borderRadius: borderRadius.lg,
                padding: '24px',
                borderTop: `3px solid ${colors.status.important}`,
              }}>
                <div style={{ ...typography.label.md, color: colors.status.important, marginBottom: '12px' }}>
                  Don{"'"}t
                </div>
                <ul style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight, paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>Don{"'"}t use chips for navigation actions (use buttons)</li>
                  <li>Don{"'"}t use chips for status display (use badges)</li>
                  <li>Don{"'"}t nest interactive elements inside chips</li>
                  <li>Don{"'"}t use long text that will truncate</li>
                  <li>Don{"'"}t use standalone chips with role="option"</li>
                </ul>
              </div>
            </div>

            <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
            <SpecTable
              headers={['Feature', 'Implementation']}
              rows={chipDocData.accessibility!.map(a => [a.feature, a.description])}
            />
          </section>
        </>
      )}

      {/* ================================================================= */}
      {/* DOCUMENTATION TAB                                                 */}
      {/* ================================================================= */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={chipDocData} />
      )}
    </StyleguideLayout>
  )
}
