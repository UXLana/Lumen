'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { ListItem, List, ListItemLeftType, ListItemRightType, ListItemStatus, Avatar } from '@/components'
import { colors, typography, spacing, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// SAMPLE ICONS
// =============================================================================

const sampleIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const chevronRightIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

// =============================================================================
// PAGE COMPONENT
// =============================================================================

const listItemDocData: ComponentDocData = {
  displayName: 'ListItem',
  importPath: '@/components',
  importStatement: `import { ListItem, List } from '@/components'\nimport type { ListItemProps, ListProps, ListItemLeftType, ListItemRightType, ListItemLines } from '@/components'`,
  description: 'List items display content in lists, menus, and selection interfaces with various content types and states.',
  props: [
    { name: 'primary', type: 'string', required: true, description: 'Primary text content' },
    { name: 'secondary', type: 'string', description: 'Secondary text content' },
    { name: 'tertiary', type: 'string', description: 'Tertiary text content' },
    { name: 'lines', type: '1 | 2 | 3', default: '1', description: 'Number of text lines to show' },
    { name: 'leftType', type: "'none' | 'avatar' | 'icon' | 'checkbox' | 'radio'", default: "'none'", description: 'Type of left content' },
    { name: 'avatarProps', type: 'AvatarProps', description: 'Avatar props when leftType is avatar' },
    { name: 'icon', type: 'ReactNode', description: 'Icon element when leftType is icon' },
    { name: 'selected', type: 'boolean', description: 'Selected state for checkbox/radio' },
    { name: 'status', type: "'enabled' | 'hover' | 'pressed' | 'nonActionable'", default: "'enabled'", description: 'Current status/state' },
    { name: 'labelValuePair', type: 'boolean', description: 'Display as label-value pair' },
    { name: 'divider', type: 'boolean', description: 'Show divider at bottom' },
    { name: 'rightType', type: "'none' | 'iconButton' | 'toggle' | 'icon' | 'text'", default: "'none'", description: 'Type of right content' },
    { name: 'rightText', type: 'string', description: 'Right text content' },
    { name: 'toggleChecked', type: 'boolean', description: 'Toggle state when rightType is toggle' },
    { name: 'onToggleChange', type: '(checked: boolean) => void', description: 'Toggle change handler' },
    { name: 'onClick', type: '() => void', description: 'Click handler' },
    { name: 'disabled', type: 'boolean', description: 'Disabled state' },
  ],
  subComponents: [
    {
      name: 'List',
      description: 'Container for ListItem components with optional selection mode.',
      props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'List items to render' },
        { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'Selection mode' },
        { name: 'roundedCorners', type: 'boolean', description: 'Rounded corners on list items' },
        { name: 'aria-label', type: 'string', description: 'ARIA label for the list' },
      ],
    },
  ],
  typeDefinitions: [
    { name: 'ListItemLeftType', definition: "type ListItemLeftType = 'none' | 'avatar' | 'icon' | 'checkbox' | 'radio'" },
    { name: 'ListItemRightType', definition: "type ListItemRightType = 'none' | 'iconButton' | 'toggle' | 'icon' | 'text'" },
    { name: 'ListItemLines', definition: 'type ListItemLines = 1 | 2 | 3' },
  ],
  accessibility: [
    { feature: 'Selection', description: 'Checkbox/radio left types use native inputs for screen reader support.' },
    { feature: 'List Semantics', description: 'List component renders with proper list role and aria-label.' },
    { feature: 'Keyboard', description: 'Tab to navigate, Enter/Space to select or toggle.' },
    { feature: 'Focus Ring', description: 'Visible focus indicator for keyboard navigation.' },
  ],
  tokens: [
    { token: 'colors.surface.light', value: 'White', usage: 'Item background' },
    { token: 'colors.hover.onLight', value: 'Light gray', usage: 'Hover background' },
    { token: 'typography.body.md', value: '16px/24px', usage: 'Primary text' },
    { token: 'typography.body.sm', value: '14px/20px', usage: 'Secondary/tertiary text' },
    { token: 'spacing.sm', value: '12px', usage: 'Internal padding' },
  ],
  relatedComponents: [
    { name: 'Avatar', href: '/components/avatar' },
    { name: 'Checkbox', href: '/components/checkbox' },
    { name: 'Switch', href: '/components/switch' },
    { name: 'Data Table', href: '/components/data-table' },
  ],
  notes: [
    'Use lines prop to control text truncation for consistent list heights.',
    'Use List container with selectionMode for checkbox/radio selection patterns.',
    'Combine leftType with rightType for rich list item layouts.',
  ],
}

export default function ListItemPage() {
  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive playground state
  const [demoLeftType, setDemoLeftType] = useState<ListItemLeftType>('none')
  const [demoStatus, setDemoStatus] = useState<ListItemStatus>('enabled')
  const [demoSelected, setDemoSelected] = useState(false)
  const [demoDivider, setDemoDivider] = useState(false)
  const [demoRightType, setDemoRightType] = useState<ListItemRightType>('none')
  const [demoToggleChecked, setDemoToggleChecked] = useState(false)
  const [demoRoundedCorners, setDemoRoundedCorners] = useState(true)
  const [demoLabelValuePair, setDemoLabelValuePair] = useState(false)
  const [demoLowEmphasis, setDemoLowEmphasis] = useState(false)
  const [demoTextLines, setDemoTextLines] = useState<1 | 2 | 3>(2)

  // Selection list examples state
  const [checkboxSelections, setCheckboxSelections] = useState<Record<string, boolean>>({
    option1: false,
    option2: true,
    option3: false,
  })
  const [radioSelection, setRadioSelection] = useState('option1')

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const leftTypes: ListItemLeftType[] = ['none', 'avatar', 'icon', 'checkbox', 'radio']
  const rightTypes: ListItemRightType[] = ['none', 'iconButton', 'toggle', 'icon', 'text']
  const statuses: ListItemStatus[] = ['enabled', 'hover', 'pressed', 'nonActionable']
  const textLineOptions: (1 | 2 | 3)[] = [1, 2, 3]

  // Generate text strings based on line count
  const getPrimaryText = () => 'Primary text'
  const getSecondaryText = () => demoTextLines >= 2 ? 'Secondary text' : undefined
  const getTertiaryText = () => demoTextLines === 3 && !demoLabelValuePair ? 'Tertiary text' : undefined

  return (
    <StyleguideLayout
      title="List Item"
      description="List items display content in lists, menus, and selection interfaces. They support various left content types, interactive states, and selection modes."
      activeId="list-item"
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
import { ListItem, List } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { ListItem, List } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Manipulate list item properties in real-time to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '8px' }}>
                        <List roundedCorners={demoRoundedCorners}>
                          <ListItem
                            primary={getPrimaryText()}
                            secondary={getSecondaryText()}
                            tertiary={getTertiaryText()}
                            leftType={demoLeftType}
                            avatarProps={demoLeftType === 'avatar' ? { name: 'John Doe', src: 'https://i.pravatar.cc/150?img=1' } : undefined}
                            icon={demoLeftType === 'icon' ? sampleIcon : undefined}
                            selected={demoSelected}
                            onChange={(demoLeftType === 'checkbox' || demoLeftType === 'radio') ? setDemoSelected : undefined}
                            status={demoStatus}
                            labelValuePair={demoLabelValuePair}
                            lowEmphasis={demoLowEmphasis}
                            divider={demoDivider}
                            roundedCorners={demoRoundedCorners}
                            rightType={demoRightType}
                            rightIcon={demoRightType === 'icon' ? chevronRightIcon : undefined}
                            rightText={demoRightType === 'text' ? 'Value' : undefined}
                            toggleChecked={demoToggleChecked}
                            onToggleChange={setDemoToggleChecked}
                          />
                        </List>
                      </div>
                    }
                    code={`<List${!demoRoundedCorners ? ' roundedCorners={false}' : ''}>
  <ListItem
    primary="${getPrimaryText()}"${getSecondaryText() ? `\n    secondary="${getSecondaryText()}"` : ''}${getTertiaryText() ? `\n    tertiary="${getTertiaryText()}"` : ''}${demoLeftType !== 'none' ? `\n    leftType="${demoLeftType}"` : ''}${demoLeftType === 'avatar' ? `\n    avatarProps={{ name: "John Doe", src: "..." }}` : ''}${demoLeftType === 'icon' ? `\n    icon={<PhoneIcon />}` : ''}${(demoLeftType === 'checkbox' || demoLeftType === 'radio') ? `\n    selected={${demoSelected}}` : ''}${demoStatus !== 'enabled' ? `\n    status="${demoStatus}"` : ''}${demoLabelValuePair ? `\n    labelValuePair` : ''}${demoLowEmphasis ? `\n    lowEmphasis` : ''}${demoDivider && !demoRoundedCorners ? `\n    divider` : ''}${!demoRoundedCorners ? `\n    roundedCorners={false}` : ''}${demoRightType !== 'none' ? `\n    rightType="${demoRightType}"` : ''}${demoRightType === 'icon' ? `\n    rightIcon={<ChevronRightIcon />}` : ''}${demoRightType === 'text' ? `\n    rightText="Value"` : ''}${demoRightType === 'toggle' ? `\n    toggleChecked={${demoToggleChecked}}\n    onToggleChange={setToggleChecked}` : ''}
  />
</List>`}
                    previewPadding="24px"
                    previewBackground={colors.surface.paper}
                    previewMinHeight="120px"
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Text Lines */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Text Lines
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {textLineOptions.map(lines => (
                          <PillButton
                            key={lines}
                            onClick={() => setDemoTextLines(lines)}
                            isActive={demoTextLines === lines}
                          >
                            {lines} {lines === 1 ? 'line' : 'lines'}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Left Type */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Left Content Type
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {leftTypes.map(type => (
                          <PillButton
                            key={type}
                            onClick={() => setDemoLeftType(type)}
                            isActive={demoLeftType === type}
                          >
                            {type}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Right Content Type */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Right Content Type
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {rightTypes.map(type => (
                          <PillButton
                            key={type}
                            onClick={() => setDemoRightType(type)}
                            isActive={demoRightType === type}
                          >
                            {type}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Status
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {statuses.map(status => (
                          <PillButton
                            key={status}
                            onClick={() => setDemoStatus(status)}
                            isActive={demoStatus === status}
                          >
                            {status}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Boolean toggles */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <StyledCheckbox
                        checked={demoSelected}
                        onChange={setDemoSelected}
                        label="Selected"
                      />
                      <StyledCheckbox
                        checked={demoDivider && !demoRoundedCorners}
                        onChange={setDemoDivider}
                        label="Divider"
                        disabled={demoRoundedCorners}
                      />
                      <StyledCheckbox
                        checked={demoRoundedCorners}
                        onChange={setDemoRoundedCorners}
                        label="Rounded Corners"
                      />
                      <StyledCheckbox
                        checked={demoLabelValuePair}
                        onChange={setDemoLabelValuePair}
                        label="Label-Value Pair"
                      />
                      <StyledCheckbox
                        checked={demoLowEmphasis}
                        onChange={setDemoLowEmphasis}
                        label="Low Emphasis"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== SELECTION LISTS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Selection Lists</h2>
            <p style={sharedStyles.sectionDescription}>
              Use checkbox or radio list items for selection interfaces with rounded corners.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {/* Checkbox List */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Multiple Selection (Checkbox)</h3>
                  <div style={{ background: colors.surface.paper, borderRadius: '12px', padding: '16px' }}>
                    <div style={{ background: 'white', borderRadius: '8px' }}>
                      <List selectionMode="multiple" roundedCorners aria-label="Notification settings">
                        <ListItem
                          leftType="checkbox"
                          selected={checkboxSelections.option1}
                          onChange={(selected) => setCheckboxSelections(prev => ({ ...prev, option1: selected }))}
                          primary="Email notifications"
                          secondary="Receive updates via email"
                          roundedCorners
                        />
                        <ListItem
                          leftType="checkbox"
                          selected={checkboxSelections.option2}
                          onChange={(selected) => setCheckboxSelections(prev => ({ ...prev, option2: selected }))}
                          primary="Push notifications"
                          secondary="Receive mobile alerts"
                          roundedCorners
                        />
                        <ListItem
                          leftType="checkbox"
                          selected={checkboxSelections.option3}
                          onChange={(selected) => setCheckboxSelections(prev => ({ ...prev, option3: selected }))}
                          primary="SMS notifications"
                          secondary="Receive text messages"
                          roundedCorners
                        />
                      </List>
                    </div>
                  </div>
                </div>

                {/* Radio List */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Single Selection (Radio)</h3>
                  <div style={{ background: colors.surface.paper, borderRadius: '12px', padding: '16px' }}>
                    <div style={{ background: 'white', borderRadius: '8px' }}>
                      <List selectionMode="single" roundedCorners aria-label="Theme selection">
                        <ListItem
                          leftType="radio"
                          selected={radioSelection === 'option1'}
                          onChange={() => setRadioSelection('option1')}
                          name="theme"
                          primary="Light mode"
                          secondary="Use light theme"
                          roundedCorners
                        />
                        <ListItem
                          leftType="radio"
                          selected={radioSelection === 'option2'}
                          onChange={() => setRadioSelection('option2')}
                          name="theme"
                          primary="Dark mode"
                          secondary="Use dark theme"
                          roundedCorners
                        />
                        <ListItem
                          leftType="radio"
                          selected={radioSelection === 'option3'}
                          onChange={() => setRadioSelection('option3')}
                          name="theme"
                          primary="System"
                          secondary="Follow system preference"
                          roundedCorners
                        />
                      </List>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS ========== */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Spacing</h3>
              <SpecTable
                headers={['Element', 'Token', 'Value', 'Description']}
                rows={[
                  ['Padding X', <CopyableToken key="px" token="spacing.4" />, <PixelValue key="pxv" value="16px" />, 'Horizontal padding'],
                  ['Padding Y', <CopyableToken key="py" token="spacing.3" />, <PixelValue key="pyv" value="12px" />, 'Vertical padding'],
                  ['Content Gap', <CopyableToken key="cg" token="spacing.3" />, <PixelValue key="cgv" value="12px" />, 'Gap between left content and text'],
                  ['Text Gap', <CopyableToken key="tg" token="spacing.0-5" />, <PixelValue key="tgv" value="2px" />, 'Gap between primary, secondary, tertiary'],
                  ['Rounded Corner Radius', <CopyableToken key="rcr" token="borderRadius.md" />, <PixelValue key="rcrv" value="8px" />, 'Border radius for rounded items'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography</h3>
              <SpecTable
                headers={['Text Level', 'Token', 'Font Size', 'Font Weight', 'Color Token']}
                rows={[
                  ['Primary', <CopyableToken key="pt" token="typography.body.md" />, <PixelValue key="pfs" value="16px" />, <PixelValue key="pfw" value="500" />, <CopyableToken key="pc" token="colors.text.highEmphasis.onLight" />],
                  ['Secondary', <CopyableToken key="st" token="typography.body.sm" />, <PixelValue key="sfs" value="14px" />, <PixelValue key="sfw" value="400" />, <CopyableToken key="sc" token="colors.text.lowEmphasis.onLight" />],
                  ['Tertiary', <CopyableToken key="tt" token="typography.body.sm" />, <PixelValue key="tfs" value="14px" />, <PixelValue key="tfw" value="400" />, <CopyableToken key="tc" token="colors.text.lowEmphasis.onLight" />],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>State Colors</h3>
              <SpecTable
                headers={['State', 'Background Token', 'Value']}
                rows={[
                  ['Default', '-', <PixelValue key="dv" value="transparent" />],
                  ['Hover', <CopyableToken key="hb" token="colors.surface.paper" />, <PixelValue key="hbv" value="#FAFAFA" />],
                  ['Pressed', <CopyableToken key="pb" token="#F5F5F5" />, <PixelValue key="pbv" value="#F5F5F5" />],
                  ['Selected', <CopyableToken key="sb" token="colors.brand.primaryLight" />, <PixelValue key="sbv" value="#E6F0ED" />],
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
{`import { ListItem, List } from '@/components'
import type { ListItemLeftType, ListItemRightType, ListItemStatus } from '@/components'`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`// Simple list item
<ListItem primary="Primary text" secondary="Secondary text" />

// With avatar
<ListItem
  leftType="avatar"
  avatarProps={{ name: "John Doe" }}
  primary="John Doe"
  secondary="john@example.com"
/>

// With icon
<ListItem
  leftType="icon"
  icon={<FolderIcon />}
  primary="Documents"
  secondary="23 files"
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Selection Lists</h3>
              <CodeBlock>
{`// Multiple selection (checkbox)
<List selectionMode="multiple" roundedCorners>
  <ListItem
    leftType="checkbox"
    selected={selected}
    onChange={setSelected}
    primary="Option 1"
    roundedCorners
  />
</List>

// Single selection (radio)
<List selectionMode="single" roundedCorners>
  <ListItem
    leftType="radio"
    selected={value === 'option1'}
    onChange={() => setValue('option1')}
    name="options"
    primary="Option 1"
    roundedCorners
  />
</List>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Right Content</h3>
              <CodeBlock>
{`// With toggle
<ListItem
  primary="Notifications"
  rightType="toggle"
  toggleChecked={enabled}
  onToggleChange={setEnabled}
/>

// With navigation icon
<ListItem
  primary="Settings"
  rightType="icon"
  rightIcon={<ChevronRightIcon />}
/>

// With text value
<ListItem
  primary="Status"
  rightType="text"
  rightText="Active"
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Label-Value Pair</h3>
              <CodeBlock>
{`// Display as label-value pair
<ListItem
  labelValuePair
  primary="john@example.com"
  secondary="Email"
/>`}
              </CodeBlock>
            </div>
          </section>

          {/* ========== PROPS TABLE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>ListItem Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="p">primary</code>, <code key="pt">string</code>, '-', 'Primary text content (required)'],
                  [<code key="s">secondary</code>, <code key="st">string</code>, '-', 'Secondary text content'],
                  [<code key="t">tertiary</code>, <code key="tt">string</code>, '-', 'Tertiary text content'],
                  [<code key="lt">leftType</code>, <code key="ltt">'none' | 'avatar' | 'icon' | 'checkbox' | 'radio'</code>, <code key="ltd">'none'</code>, 'Type of left content'],
                  [<code key="ap">avatarProps</code>, <code key="apt">AvatarProps</code>, '-', 'Props for avatar when leftType="avatar"'],
                  [<code key="i">icon</code>, <code key="it">ReactNode</code>, '-', 'Icon element when leftType="icon"'],
                  [<code key="sel">selected</code>, <code key="selt">boolean</code>, <code key="seld">false</code>, 'Selection state for checkbox/radio'],
                  [<code key="st2">status</code>, <code key="st2t">'enabled' | 'hover' | 'pressed' | 'nonActionable'</code>, <code key="st2d">'enabled'</code>, 'Interactive state'],
                  [<code key="lvp">labelValuePair</code>, <code key="lvpt">boolean</code>, <code key="lvpd">false</code>, 'Display as label-value pair'],
                  [<code key="le">lowEmphasis</code>, <code key="let">boolean</code>, <code key="led">false</code>, 'Use lighter text styling'],
                  [<code key="d">divider</code>, <code key="dt">boolean</code>, <code key="dd">false</code>, 'Show bottom divider (only when roundedCorners is false)'],
                  [<code key="rc">roundedCorners</code>, <code key="rct">boolean</code>, <code key="rcd">true</code>, 'Use rounded corners on hover/selected states'],
                  [<code key="rt">rightType</code>, <code key="rtt">'none' | 'iconButton' | 'toggle' | 'icon' | 'text'</code>, <code key="rtd">'none'</code>, 'Type of right content'],
                  [<code key="ri">rightIcon</code>, <code key="rit">ReactNode</code>, '-', 'Icon for iconButton or icon rightType'],
                  [<code key="rtx">rightText</code>, <code key="rtxt">string</code>, '-', 'Text content when rightType="text"'],
                  [<code key="tc">toggleChecked</code>, <code key="tct">boolean</code>, <code key="tcd">false</code>, 'Toggle state when rightType="toggle"'],
                  [<code key="otc">onToggleChange</code>, <code key="otct">(checked: boolean) =&gt; void</code>, '-', 'Toggle change handler'],
                  [<code key="oc">onChange</code>, <code key="oct">(selected: boolean) =&gt; void</code>, '-', 'Selection change handler'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>List Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="ch">children</code>, <code key="cht">ReactNode</code>, '-', 'ListItem components'],
                  [<code key="sm">selectionMode</code>, <code key="smt">'none' | 'single' | 'multiple'</code>, <code key="smd">'none'</code>, 'Selection mode for the list'],
                  [<code key="rc2">roundedCorners</code>, <code key="rc2t">boolean</code>, <code key="rc2d">true</code>, 'Adds 8px padding for rounded corner list items'],
                  [<code key="al">aria-label</code>, <code key="alt">string</code>, '-', 'Accessible label for the list'],
                ]}
              />
            </div>
          </section>

          {/* ========== DESIGN GUIDANCE ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use Each Left Type</h3>
              <SpecTable
                headers={['Type', 'Use Case']}
                rows={[
                  [<code key="n">none</code>, 'Simple text lists, navigation menus'],
                  [<code key="a">avatar</code>, 'User lists, contacts, messaging'],
                  [<code key="i">icon</code>, 'Settings, file browsers, feature lists'],
                  [<code key="c">checkbox</code>, 'Multi-select lists, settings with multiple options'],
                  [<code key="r">radio</code>, 'Single-select lists, exclusive options'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use consistent left content types within a list', 'Mix different left content types in the same list'],
                  ['Keep primary text concise and scannable', 'Use overly long text that wraps multiple lines'],
                  ['Use rounded corners for selection lists', 'Combine checkbox and radio items in one list'],
                  ['Provide clear visual feedback for selection', 'Hide important actions behind the overflow menu'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <SpecTable
                headers={['Feature', 'Implementation']}
                rows={[
                  ['Selection roles', <span key="sr">Uses <code>role="checkbox"</code> or <code>role="radio"</code> for selectable items</span>],
                  ['State attributes', <span key="sa">Includes <code>aria-checked</code> for selection state</span>],
                  ['Disabled state', <span key="ds">Supports <code>aria-disabled</code> for non-interactive states</span>],
                  ['Keyboard navigation', 'Full Enter/Space to select'],
                  ['Form compatibility', 'Hidden native inputs maintain form compatibility'],
                  ['List semantics', <span key="ls">Uses appropriate <code>role="group"</code> or <code>role="radiogroup"</code></span>],
                  ['Focus indicators', 'Visible dashed border ring on focus'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={listItemDocData} />
      )}
    </StyleguideLayout>
  )
}
