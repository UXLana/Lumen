'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  Playground,
  PillButton,
  StyledCheckbox as StyledCheckboxControl,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import { Menu, MenuItem, MenuGroup, MenuDivider } from '@/components'
import { IconEdit, IconCopy, IconTrash, IconDownload, IconShare, IconSettings } from '@/components/Icons'
import { Avatar } from '@/components'
import { colors, spacing, typography } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'
type ItemType = 'basic' | 'icon' | 'multiple' | 'selectable' | 'avatar'

// =============================================================================
// DOC DATA
// =============================================================================

const menuDocData: ComponentDocData = {
  displayName: 'Menu',
  importPath: '@/components',
  importStatement: `import { Menu, MenuItem, MenuGroup, MenuDivider } from '@/components'\nimport type { MenuProps, MenuItemProps } from '@/components'`,
  description:
    'A dropdown menu for actions, selections, and navigation. Supports basic, multi-select (checkbox), single-select (checkmark), avatar, and icon item types.',
  props: [
    { name: 'width', type: 'number | string', default: '200', description: 'Menu width' },
    { name: 'maxHeight', type: 'number | string', description: 'Max height before scrolling' },
    { name: 'open', type: 'boolean', description: 'Controls visibility for popover usage' },
    { name: 'onClose', type: '() => void', description: 'Called on Escape key press or Done button' },
    { name: 'searchable', type: 'boolean', default: 'false', description: 'Show search input at the top' },
    { name: 'searchPlaceholder', type: 'string', default: "'Search…'", description: 'Placeholder for search input' },
    { name: 'showDoneButton', type: 'boolean', default: 'false', description: 'Show close button at bottom (for mobile)' },
    { name: 'doneLabel', type: 'string', default: "'Done'", description: 'Label for the done button' },
    { name: 'aria-label', type: 'string', description: 'Accessible name for the menu' },
  ],
  accessibility: [
    { feature: 'Roles', description: 'Menu uses role="menu". Items use menuitem, menuitemcheckbox, or menuitemradio.' },
    { feature: 'Keyboard', description: 'Arrow keys navigate items. Enter/Space activates. Escape closes. Home/End jump to first/last.' },
    { feature: 'Focus', description: 'First non-disabled item receives focus when menu opens. Search input receives focus when searchable.' },
    { feature: 'Checked State', description: 'aria-checked communicates selection state for multi/selectable types.' },
    { feature: 'Disabled', description: 'Disabled items are skipped during keyboard navigation.' },
    { feature: 'Mobile', description: 'showDoneButton provides an explicit close target for touch devices without Escape key.' },
  ],
  tokens: [
    { token: 'colors.surface.light', value: 'White', usage: 'Menu background' },
    { token: 'colors.surface.lightDarker', value: 'Light gray', usage: 'Hover/pressed item background' },
    { token: 'colors.brand.default', value: 'Brand', usage: 'Checkbox fill, checkmark color' },
    { token: 'colors.status.important', value: 'Red', usage: 'Destructive item text' },
    { token: 'shadows.lg', value: 'Elevation', usage: 'Menu drop shadow' },
    { token: 'typography.body.sm', value: '14px/20px', usage: 'Item label text' },
    { token: 'typography.body.xs', value: '12px/16px', usage: 'Item metadata text' },
  ],
  relatedComponents: [
    { name: 'Button', href: '/components/button' },
    { name: 'Select', href: '/components/input' },
    { name: 'Combobox', href: '/components/combobox' },
  ],
  notes: [
    'Use MenuDivider to separate logical groups or destructive actions from safe ones.',
    'Use MenuGroup with a label for categorized items.',
    'The Menu component does not handle positioning — pair with a popover or absolute container.',
    'Use showDoneButton on mobile — touch devices lack an Escape key for dismissing menus.',
  ],
  whenToUse: [
    'Context menus (right-click), action menus (kebab/more button).',
    'Selecting from a list of actions, filters, or options.',
    'Any dropdown that contains actionable items rather than form selection.',
  ],
  whenNotToUse: [
    { scenario: 'Selecting a value for a form field', instead: 'Select — binds to form state with label/validation' },
    { scenario: 'Searchable or async options', instead: 'Combobox — supports typeahead and loading' },
    { scenario: 'Navigation links', instead: 'LeftNav or TabBar — for persistent navigation' },
  ],
  usageExamples: [
    {
      title: 'Action menu',
      description: 'Basic menu with icon items and a destructive action.',
      isDefault: true,
      code: `<Menu aria-label="Actions">
  <MenuItem type="icon" icon={<IconEdit />} label="Edit" onClick={handleEdit} />
  <MenuItem type="icon" icon={<IconCopy />} label="Duplicate" onClick={handleDuplicate} />
  <MenuDivider />
  <MenuItem type="icon" icon={<IconTrash />} label="Delete" destructive onClick={handleDelete} />
</Menu>`,
    },
    {
      title: 'Searchable multi-select',
      description: 'Filter menu with search and mobile done button.',
      code: `<Menu aria-label="Filter" searchable showDoneButton={isMobile} maxHeight={280}>
  <MenuItem type="multiple" label="Active" checked={filters.active} onClick={toggle('active')} />
  <MenuItem type="multiple" label="Pending" checked={filters.pending} onClick={toggle('pending')} />
</Menu>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function MenuPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoType, setDemoType] = useState<ItemType>('basic')
  const [demoSearchable, setDemoSearchable] = useState(false)
  const [demoGrouped, setDemoGrouped] = useState(false)
  const [demoDoneButton, setDemoDoneButton] = useState(false)
  const [demoMetadata, setDemoMetadata] = useState(false)
  const [demoDestructive, setDemoDestructive] = useState(false)
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoDivider, setDemoDivider] = useState(false)

  // Interactive state for checkable types
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    item1: false,
    item2: true,
    item3: false,
    item4: false,
    item5: false,
  })
  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }
  const [selectedItem, setSelectedItem] = useState('item2')

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  // Item data per type
  const items: Record<ItemType, { label: string; metadata?: string; icon?: React.ReactNode; avatar?: React.ReactNode }[]> = {
    basic: [
      { label: 'Edit' },
      { label: 'Duplicate' },
      { label: 'Download' },
      { label: 'Share' },
      { label: 'Delete' },
    ],
    icon: [
      { label: 'Edit', icon: <IconEdit size="sm" /> },
      { label: 'Duplicate', icon: <IconCopy size="sm" /> },
      { label: 'Download', icon: <IconDownload size="sm" /> },
      { label: 'Share', icon: <IconShare size="sm" /> },
      { label: 'Delete', icon: <IconTrash size="sm" /> },
    ],
    multiple: [
      { label: 'Active' },
      { label: 'Pending' },
      { label: 'Inactive' },
      { label: 'Archived' },
      { label: 'Draft' },
    ],
    selectable: [
      { label: 'Name' },
      { label: 'Date created' },
      { label: 'Last modified' },
      { label: 'Status' },
      { label: 'Priority' },
    ],
    avatar: [
      { label: 'Lana Holston', metadata: 'UX Lead', avatar: <Avatar size="xs" name="Lana Holston" /> },
      { label: 'David Eagleson', metadata: 'Engineering', avatar: <Avatar size="xs" name="David Eagleson" /> },
      { label: 'Rod Aguilera', metadata: 'Product', avatar: <Avatar size="xs" name="Rod Aguilera" /> },
      { label: 'Chad Benson', metadata: 'Accessibility', avatar: <Avatar size="xs" name="Chad Benson" /> },
      { label: 'Sarah Kim', metadata: 'QA', avatar: <Avatar size="xs" name="Sarah Kim" /> },
    ],
  }

  const metadataMap: Record<string, string> = {
    Edit: 'Modify this item',
    Duplicate: 'Create a copy',
    Download: 'Save locally',
    Share: 'Send to others',
    Delete: 'Remove permanently',
    Active: '12 items',
    Pending: '5 items',
    Inactive: '3 items',
    Archived: '8 items',
    Draft: '2 items',
    Name: 'A → Z',
    'Date created': 'Newest first',
    'Last modified': 'Recent first',
    Status: 'Active first',
    Priority: 'High → Low',
  }

  const menuWidth = demoType === 'avatar' ? 260 : demoSearchable ? 240 : 200

  const renderDemoMenu = () => {
    const currentItems = items[demoType]
    const isCheckable = demoType === 'multiple' || demoType === 'selectable' || demoType === 'avatar'

    const renderItems = (itemList: typeof currentItems, startIdx: number = 0) =>
      itemList.map((item, i) => {
        const idx = startIdx + i
        const id = `item${idx + 1}`
        const isLast = idx === currentItems.length - 1

        return (
          <MenuItem
            key={id}
            type={demoType}
            label={item.label}
            metadata={demoMetadata ? (item.metadata || metadataMap[item.label]) : undefined}
            icon={item.icon}
            avatar={item.avatar}
            checked={
              demoType === 'multiple' ? checkedItems[id] :
              (demoType === 'selectable' || demoType === 'avatar') ? selectedItem === id :
              undefined
            }
            disabled={demoDisabled && isLast}
            destructive={demoDestructive && isLast}
            hasDivider={demoDivider && idx === currentItems.length - 2}
            onClick={() => {
              if (demoType === 'multiple') toggleItem(id)
              else if (demoType === 'selectable' || demoType === 'avatar') setSelectedItem(id)
            }}
          />
        )
      })

    if (demoGrouped) {
      const half = Math.ceil(currentItems.length / 2)
      const group1 = currentItems.slice(0, half)
      const group2 = currentItems.slice(half)

      return (
        <Menu
          aria-label="Demo menu"
          width={menuWidth}
          searchable={demoSearchable}
          showDoneButton={demoDoneButton}
          maxHeight={demoSearchable ? 320 : undefined}
          onClose={() => {}}
        >
          <MenuGroup label="Group A">
            {renderItems(group1, 0)}
          </MenuGroup>
          <MenuDivider />
          <MenuGroup label="Group B">
            {renderItems(group2, half)}
          </MenuGroup>
        </Menu>
      )
    }

    return (
      <Menu
        aria-label="Demo menu"
        width={menuWidth}
        searchable={demoSearchable}
        showDoneButton={demoDoneButton}
        maxHeight={demoSearchable ? 320 : undefined}
        onClose={() => {}}
      >
        {renderItems(currentItems)}
      </Menu>
    )
  }

  // Generate code string
  const generateCode = () => {
    const typeStr = demoType !== 'basic' ? ` type="${demoType}"` : ''
    const metaStr = demoMetadata ? ` metadata="..."` : ''
    const iconStr = demoType === 'icon' ? ' icon={<IconEdit />}' : ''
    const avatarStr = demoType === 'avatar' ? ' avatar={<Avatar size="xs" name="..." />}' : ''
    const checkedStr = (demoType === 'multiple' || demoType === 'selectable' || demoType === 'avatar') ? ' checked={...}' : ''
    const disabledStr = demoDisabled ? ' disabled' : ''
    const destructiveStr = demoDestructive ? ' destructive' : ''
    const dividerStr = demoDivider ? ' hasDivider' : ''

    const menuProps = [
      'aria-label="Actions"',
      menuWidth !== 200 ? `width={${menuWidth}}` : '',
      demoSearchable ? 'searchable' : '',
      demoDoneButton ? 'showDoneButton' : '',
      demoSearchable ? 'maxHeight={320}' : '',
    ].filter(Boolean).join('\n  ')

    const itemLine = `<MenuItem${typeStr}${iconStr}${avatarStr} label="Option"${metaStr}${checkedStr}${destructiveStr}${disabledStr}${dividerStr} />`

    if (demoGrouped) {
      return `<Menu
  ${menuProps}
>
  <MenuGroup label="Group A">
    ${itemLine}
    ${itemLine}
  </MenuGroup>
  <MenuDivider />
  <MenuGroup label="Group B">
    ${itemLine}
    ${itemLine}
  </MenuGroup>
</Menu>`
    }

    return `<Menu
  ${menuProps}
>
  ${itemLine}
  ${itemLine}
  ${itemLine}
</Menu>`
  }

  return (
    <StyleguideLayout
      title="Menu"
      description="Dropdown menu for actions, multi-select, single-select, and contextual options."
      activeId="menu"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
    >
      {/* ========== OVERVIEW TAB ========== */}
      {activePageTab === 'overview' && (
        <>
          {/* Quick Start */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`import { Menu, MenuItem, MenuGroup, MenuDivider } from '@/components'

<Menu aria-label="Actions">
  <MenuItem label="Edit" onClick={handleEdit} />
  <MenuItem label="Duplicate" onClick={handleDuplicate} />
  <MenuDivider />
  <MenuItem label="Delete" destructive onClick={handleDelete} />
</Menu>`}</CodeBlock>
            </div>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Configure menu properties to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing['2xl'] }}>
                {/* Preview/Code */}
                <div>
                  <Playground
                    preview={
                      <div style={{ padding: spacing.xl, display: 'flex', justifyContent: 'center' }}>
                        {renderDemoMenu()}
                      </div>
                    }
                    code={generateCode()}
                    previewPadding={spacing.xs}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xl'] }}>
                    {/* Item Type */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: spacing.xs }}>
                        Item Type
                      </label>
                      <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                        {(['basic', 'icon', 'multiple', 'selectable', 'avatar'] as const).map((t) => (
                          <PillButton
                            key={t}
                            onClick={() => setDemoType(t)}
                            isActive={demoType === t}
                          >
                            {t}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Menu Features */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: spacing.xs }}>
                        Menu Features
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <StyledCheckboxControl checked={demoSearchable} onChange={setDemoSearchable} label="Searchable" />
                        <StyledCheckboxControl checked={demoGrouped} onChange={setDemoGrouped} label="Grouped (MenuGroup)" />
                        <StyledCheckboxControl checked={demoDoneButton} onChange={setDemoDoneButton} label="Done button (mobile)" />
                      </div>
                    </div>

                    {/* Item Features */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: spacing.xs }}>
                        Item Features
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <StyledCheckboxControl checked={demoMetadata} onChange={setDemoMetadata} label="Metadata (secondary text)" />
                        <StyledCheckboxControl checked={demoDivider} onChange={setDemoDivider} label="Divider (before last)" />
                        <StyledCheckboxControl checked={demoDestructive} onChange={setDemoDestructive} label="Destructive (last item)" />
                        <StyledCheckboxControl checked={demoDisabled} onChange={setDemoDisabled} label="Disabled (last item)" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>MenuItem Props</h2>
            <div style={{ ...sharedStyles.card, maxWidth: '680px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                      <th key={h} style={{ ...typography.label.sm, textAlign: 'left', padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['label', 'string', '—', 'Display text'],
                    ['metadata', 'string', '—', 'Secondary text line'],
                    ['type', "'basic' | 'multiple' | 'selectable' | 'avatar' | 'icon'", "'basic'", 'Item variant'],
                    ['checked', 'boolean', 'false', 'Checked state (multiple/selectable/avatar)'],
                    ['disabled', 'boolean', 'false', 'Disabled state'],
                    ['hasDivider', 'boolean', 'false', 'Show divider below item'],
                    ['icon', 'ReactNode', '—', 'Leading icon (icon type)'],
                    ['avatar', 'ReactNode', '—', 'Leading avatar (avatar type)'],
                    ['destructive', 'boolean', 'false', 'Red text for danger actions'],
                    ['onClick', '() => void', '—', 'Click handler'],
                  ].map(([prop, type, def, desc]) => (
                    <tr key={prop}>
                      <td style={{ ...typography.code.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.highEmphasis.onLight }}>{prop}</td>
                      <td style={{ ...typography.code.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.lowEmphasis.onLight, fontSize: '12px' }}>{type}</td>
                      <td style={{ ...typography.code.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.lowEmphasis.onLight }}>{def}</td>
                      <td style={{ ...typography.body.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.lowEmphasis.onLight }}>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Keyboard Navigation</h2>
            <div style={{ ...sharedStyles.card, maxWidth: '500px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Key', 'Action'].map((h) => (
                      <th key={h} style={{ ...typography.label.sm, textAlign: 'left', padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['↓ Arrow Down', 'Move to next item (or from search to first item)'],
                    ['↑ Arrow Up', 'Move to previous item (or from first item to search)'],
                    ['Home', 'Move to first item'],
                    ['End', 'Move to last item'],
                    ['Enter / Space', 'Activate focused item'],
                    ['Escape', 'Close menu'],
                  ].map(([key, action]) => (
                    <tr key={key}>
                      <td style={{ ...typography.code.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.highEmphasis.onLight }}>{key}</td>
                      <td style={{ ...typography.body.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.lowEmphasis.onLight }}>{action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>With a Trigger Button</h2>
            <p style={sharedStyles.sectionDescription}>
              Pair Menu with a Button and absolute positioning for a dropdown pattern:
            </p>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`const [open, setOpen] = useState(false)

<div style={{ position: 'relative', display: 'inline-block' }}>
  <Button
    emphasis="low"
    iconOnly
    leftIcon={<IconMoreVertical />}
    aria-label="More actions"
    aria-haspopup="menu"
    aria-expanded={open}
    onClick={() => setOpen(!open)}
  />
  <div style={{ position: 'absolute', top: '100%', right: 0, zIndex: 100 }}>
    <Menu open={open} onClose={() => setOpen(false)} aria-label="Actions">
      <MenuItem label="Edit" onClick={handleEdit} />
      <MenuItem label="Delete" destructive onClick={handleDelete} />
    </Menu>
  </div>
</div>`}</CodeBlock>
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={menuDocData} />
      )}
    </StyleguideLayout>
  )
}
