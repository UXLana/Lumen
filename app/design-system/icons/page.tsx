'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable } from '../shared'
import { colors, borderRadius, fontFamilies } from '@/styles/design-tokens'
import * as Icons from '@/components/Icons'
import { BannerIcon } from '@/components/Icons'
import type { IconSize, BannerIconVariant } from '@/components/Icons'

// =============================================================================
// ICON DATA - Organized by category
// =============================================================================

type IconCategory = {
  name: string
  description: string
  icons: { name: string; component: React.FC<Icons.IconProps> }[]
}

const iconCategories: IconCategory[] = [
  {
    name: 'Navigation',
    description: 'Icons for navigation, wayfinding, and directional actions.',
    icons: [
      { name: 'IconHome', component: Icons.IconHome },
      { name: 'IconMenu', component: Icons.IconMenu },
      { name: 'IconSearch', component: Icons.IconSearch },
      { name: 'IconArrowLeft', component: Icons.IconArrowLeft },
      { name: 'IconArrowRight', component: Icons.IconArrowRight },
      { name: 'IconArrowUp', component: Icons.IconArrowUp },
      { name: 'IconArrowDown', component: Icons.IconArrowDown },
      { name: 'IconChevronLeft', component: Icons.IconChevronLeft },
      { name: 'IconChevronRight', component: Icons.IconChevronRight },
      { name: 'IconChevronUp', component: Icons.IconChevronUp },
      { name: 'IconChevronDown', component: Icons.IconChevronDown },
      { name: 'IconExternalLink', component: Icons.IconExternalLink },
    ],
  },
  {
    name: 'Actions',
    description: 'Icons for user interactions and common actions.',
    icons: [
      { name: 'IconPlus', component: Icons.IconPlus },
      { name: 'IconMinus', component: Icons.IconMinus },
      { name: 'IconX', component: Icons.IconX },
      { name: 'IconCheck', component: Icons.IconCheck },
      { name: 'IconEdit', component: Icons.IconEdit },
      { name: 'IconTrash', component: Icons.IconTrash },
      { name: 'IconCopy', component: Icons.IconCopy },
      { name: 'IconDownload', component: Icons.IconDownload },
      { name: 'IconUpload', component: Icons.IconUpload },
      { name: 'IconShare', component: Icons.IconShare },
      { name: 'IconSave', component: Icons.IconSave },
      { name: 'IconRefresh', component: Icons.IconRefresh },
    ],
  },
  {
    name: 'Status',
    description: 'Icons for indicating states and providing feedback.',
    icons: [
      { name: 'IconInfo', component: Icons.IconInfo },
      { name: 'IconAlertCircle', component: Icons.IconAlertCircle },
      { name: 'IconAlertTriangle', component: Icons.IconAlertTriangle },
      { name: 'IconCheckCircle', component: Icons.IconCheckCircle },
      { name: 'IconXCircle', component: Icons.IconXCircle },
      { name: 'IconLoader', component: Icons.IconLoader },
    ],
  },
  {
    name: 'Objects',
    description: 'Icons representing common objects and entities.',
    icons: [
      { name: 'IconFile', component: Icons.IconFile },
      { name: 'IconFolder', component: Icons.IconFolder },
      { name: 'IconImage', component: Icons.IconImage },
      { name: 'IconUser', component: Icons.IconUser },
      { name: 'IconUsers', component: Icons.IconUsers },
      { name: 'IconCalendar', component: Icons.IconCalendar },
      { name: 'IconClock', component: Icons.IconClock },
      { name: 'IconSettings', component: Icons.IconSettings },
    ],
  },
  {
    name: 'Visibility',
    description: 'Icons for visibility toggles and security.',
    icons: [
      { name: 'IconEye', component: Icons.IconEye },
      { name: 'IconEyeOff', component: Icons.IconEyeOff },
      { name: 'IconLock', component: Icons.IconLock },
      { name: 'IconUnlock', component: Icons.IconUnlock },
    ],
  },
  {
    name: 'Media',
    description: 'Icons for audio, video, and media controls.',
    icons: [
      { name: 'IconPlay', component: Icons.IconPlay },
      { name: 'IconPause', component: Icons.IconPause },
      { name: 'IconVolume', component: Icons.IconVolume },
      { name: 'IconVolumeOff', component: Icons.IconVolumeOff },
    ],
  },
  {
    name: 'UI',
    description: 'Icons for user interface controls and layouts.',
    icons: [
      { name: 'IconFilter', component: Icons.IconFilter },
      { name: 'IconSort', component: Icons.IconSort },
      { name: 'IconMaximize', component: Icons.IconMaximize },
      { name: 'IconMinimize', component: Icons.IconMinimize },
      { name: 'IconMoreHorizontal', component: Icons.IconMoreHorizontal },
      { name: 'IconMoreVertical', component: Icons.IconMoreVertical },
      { name: 'IconGrid', component: Icons.IconGrid },
      { name: 'IconList', component: Icons.IconList },
      { name: 'IconApps', component: Icons.IconApps },
      { name: 'IconDrag', component: Icons.IconDrag },
      { name: 'IconCart', component: Icons.IconCart },
    ],
  },
  {
    name: 'Social',
    description: 'Icons for social interactions and engagement.',
    icons: [
      { name: 'IconStar', component: Icons.IconStar },
      { name: 'IconHeart', component: Icons.IconHeart },
      { name: 'IconThumbsUp', component: Icons.IconThumbsUp },
      { name: 'IconThumbsDown', component: Icons.IconThumbsDown },
    ],
  },
  {
    name: 'Communication',
    description: 'Icons for messaging and notifications.',
    icons: [
      { name: 'IconMail', component: Icons.IconMail },
      { name: 'IconBell', component: Icons.IconBell },
      { name: 'IconMessageCircle', component: Icons.IconMessageCircle },
    ],
  },
  {
    name: 'Design System',
    description: 'Icons specific to the MTR Design System navigation.',
    icons: [
      { name: 'IconColors', component: Icons.IconColors },
      { name: 'IconTypography', component: Icons.IconTypography },
      { name: 'IconSpacing', component: Icons.IconSpacing },
      { name: 'IconRadius', component: Icons.IconRadius },
      { name: 'IconShadows', component: Icons.IconShadows },
      { name: 'IconBreakpoints', component: Icons.IconBreakpoints },
      { name: 'IconAvatar', component: Icons.IconAvatar },
      { name: 'IconButton', component: Icons.IconButton },
      { name: 'IconTab', component: Icons.IconTab },
      { name: 'IconBanner', component: Icons.IconBanner },
      { name: 'IconBadge', component: Icons.IconBadge },
      { name: 'IconLayoutCard', component: Icons.IconLayoutCard },
      { name: 'IconFoundations', component: Icons.IconFoundations },
      { name: 'IconComponents', component: Icons.IconComponents },
      { name: 'IconIcons', component: Icons.IconIcons },
    ],
  },
]

// =============================================================================
// ICON CARD COMPONENT
// =============================================================================

function IconCard({
  name,
  IconComponent,
  size = 'lg',
}: {
  name: string
  IconComponent: React.FC<Icons.IconProps>
  size?: IconSize
}) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`<${name} />`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      onClick={copyToClipboard}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 8px',
        borderRadius: borderRadius.md,
        border: `1px solid ${hovered ? colors.brand.primary : colors.border.light}`,
        background: hovered ? colors.neutral[100] : colors.background.default,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          marginBottom: '8px',
          color: hovered ? colors.brand.primary : colors.text.highEmphasis,
          transition: 'color 0.15s ease',
        }}
      >
        <IconComponent size={size} />
      </div>
      <div
        style={{
          fontSize: '11px',
          color: colors.text.mediumEmphasis,
          textAlign: 'center',
          fontFamily: fontFamilies.mono,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
        }}
      >
        {name.replace('Icon', '')}
      </div>
      {copied && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: colors.brand.primary,
            color: 'white',
            fontSize: '11px',
            fontWeight: 600,
            borderRadius: borderRadius.md,
          }}
        >
          Copied!
        </div>
      )}
    </div>
  )
}

// =============================================================================
// SIZE DEMO COMPONENT
// =============================================================================

function SizeDemo() {
  const sizes: { key: IconSize; label: string; pixels: number }[] = [
    { key: 'xs', label: 'Extra Small', pixels: 12 },
    { key: 'sm', label: 'Small', pixels: 16 },
    { key: 'md', label: 'Medium (default)', pixels: 20 },
    { key: 'lg', label: 'Large', pixels: 24 },
    { key: 'xl', label: 'Extra Large', pixels: 32 },
    { key: '2xl', label: '2X Large', pixels: 48 },
  ]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '32px',
        padding: '24px',
        background: colors.neutral[100],
        borderRadius: borderRadius.lg,
      }}
    >
      {sizes.map(({ key, pixels }) => (
        <div
          key={key}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icons.IconStar size={key} />
          <div style={{ fontSize: '12px', fontWeight: 600, color: colors.text.highEmphasis }}>
            {key}
          </div>
          <div style={{ fontSize: '11px', color: colors.text.mediumEmphasis }}>
            {pixels}px
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// STROKE DEMO COMPONENT
// =============================================================================

function StrokeDemo() {
  const strokes = [1, 1.5, 2, 2.5]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        padding: '24px',
        background: colors.neutral[100],
        borderRadius: borderRadius.lg,
      }}
    >
      {strokes.map((strokeWidth) => (
        <div
          key={strokeWidth}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icons.IconHeart size="xl" strokeWidth={strokeWidth} />
          <div style={{ fontSize: '12px', fontWeight: 600, color: colors.text.highEmphasis }}>
            {strokeWidth}px
          </div>
          <div style={{ fontSize: '11px', color: colors.text.mediumEmphasis }}>
            {strokeWidth === 1.5 ? 'Default' : ''}
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function IconsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter icons based on search
  const filteredCategories = iconCategories
    .map((category) => ({
      ...category,
      icons: category.icons.filter((icon) =>
        icon.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.icons.length > 0)

  // Count total icons
  const totalIcons = iconCategories.reduce((acc, cat) => acc + cat.icons.length, 0)

  return (
    <StyleguideLayout
      title="Icons"
      description={`A comprehensive library of ${totalIcons} scalable icons in the Feather icon style. All icons use currentColor for easy styling and are available in multiple sizes.`}
      activeId="icons"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'implementation', label: 'Implementation' },
      ]}
    >
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Quick Start */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`import { IconHome, IconSettings, IconUser } from '@/components/Icons'`}</CodeBlock>
            </div>
          </section>

          {/* Icon Library */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Icon Library</h2>
            <p style={sharedStyles.sectionDescription}>
              Browse all {totalIcons} icons. Click any icon to copy its component name.
            </p>

            {/* Search */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: colors.background.default,
                border: `1px solid ${colors.border.light}`,
                borderRadius: borderRadius.md,
                marginBottom: '24px',
              }}
            >
              <Icons.IconSearch size="sm" style={{ color: colors.text.mediumEmphasis }} />
              <input
                type="text"
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  color: colors.text.highEmphasis,
                  outline: 'none',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    color: colors.text.mediumEmphasis,
                  }}
                >
                  <Icons.IconX size="sm" />
                </button>
              )}
            </div>
          </section>

          {/* Icon Categories */}
          {filteredCategories.map((category) => (
            <section key={category.name} style={sharedStyles.section}>
              <h2 style={sharedStyles.sectionTitle}>{category.name}</h2>
              <p style={sharedStyles.sectionDescription}>{category.description}</p>

              <div style={sharedStyles.card}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {category.icons.map(({ name, component }) => (
                    <IconCard key={name} name={name} IconComponent={component} />
                  ))}
                </div>
              </div>
            </section>
          ))}

          {filteredCategories.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '48px',
                color: colors.text.mediumEmphasis,
              }}
            >
              <Icons.IconSearch size="xl" style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No icons found matching &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </>
      )}

      {/* Implementation Tab */}
      {activeTab === 'implementation' && (
        <>
          {/* Usage */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>{`import { IconHome, IconSettings, IconUser } from '@/components/Icons'
import type { IconProps, IconSize } from '@/components/Icons'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>{`function MyComponent() {
  return (
    <div>
      <IconHome />
      <IconSettings />
      <IconUser />
    </div>
  )
}`}</CodeBlock>
            </div>
          </section>

          {/* Sizes */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Sizes</h2>
            <p style={sharedStyles.sectionDescription}>
              Icons are available in 6 preset sizes that map to the design system token scale.
            </p>

            <div style={sharedStyles.card}>
              <SizeDemo />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Size Tokens</h3>
              <SpecTable
                headers={['Token', 'Size', 'Use Case']}
                rows={[
                  ['xs', '12px', 'Inline with small text, badges, compact indicators'],
                  ['sm', '16px', 'Inline with body text, secondary actions, form icons'],
                  ['md', '20px', 'Default size, navigation, primary buttons'],
                  ['lg', '24px', 'Headers, emphasis, larger touch targets'],
                  ['xl', '32px', 'Feature sections, large buttons, hero elements'],
                  ['2xl', '48px', 'Empty states, onboarding, feature highlights'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Size Prop</h3>
              <CodeBlock>{`// Using size tokens
<IconStar size="xs" />  // 12px
<IconStar size="sm" />  // 16px
<IconStar size="md" />  // 20px (default)
<IconStar size="lg" />  // 24px
<IconStar size="xl" />  // 32px
<IconStar size="2xl" /> // 48px

// Using custom pixel value
<IconStar size={18} />  // 18px`}</CodeBlock>
            </div>
          </section>

          {/* Stroke Weight */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Stroke Weight</h2>
            <p style={sharedStyles.sectionDescription}>
              Icons use a consistent stroke weight of 1.5px by default, but can be customized.
            </p>

            <div style={sharedStyles.card}>
              <StrokeDemo />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Stroke Weights</h3>
              <SpecTable
                headers={['Weight', 'Value', 'Use Case']}
                rows={[
                  ['Thin', '1px', 'Delicate, refined aesthetic'],
                  ['Default', '1.5px', 'Standard weight for most use cases'],
                  ['Medium', '2px', 'Slightly bolder emphasis'],
                  ['Bold', '2.5px', 'Heavy emphasis, high visibility'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Stroke Width Prop</h3>
              <CodeBlock>{`<IconHeart strokeWidth={1} />    // Thin
<IconHeart strokeWidth={1.5} />  // Default
<IconHeart strokeWidth={2} />    // Medium
<IconHeart strokeWidth={2.5} />  // Bold`}</CodeBlock>
            </div>
          </section>

          {/* Banner Icons */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Banner Icons</h2>
            <p style={sharedStyles.sectionDescription}>
              Status icons with colored circular backgrounds for use in banners, alerts, and notifications.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={{ ...sharedStyles.cardTitle, marginBottom: '16px' }}>Light Mode</h3>
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '32px',
                }}
              >
                {(['information', 'success', 'warning', 'important'] as BannerIconVariant[]).map((variant) => (
                  <div
                    key={variant}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <BannerIcon variant={variant} />
                    <span style={{ fontSize: '12px', color: colors.text.mediumEmphasis, textTransform: 'capitalize' }}>
                      {variant}
                    </span>
                  </div>
                ))}
              </div>

              <h3 style={{ ...sharedStyles.cardTitle, marginBottom: '16px' }}>Dark Mode (onDark)</h3>
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  padding: '24px',
                  background: colors.brand.primary,
                  borderRadius: borderRadius.md,
                }}
              >
                {(['information', 'success', 'warning', 'important'] as BannerIconVariant[]).map((variant) => (
                  <div
                    key={variant}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <BannerIcon variant={variant} onDark />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>
                      {variant}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>BannerIcon Usage</h3>
              <CodeBlock>{`import { BannerIcon } from '@/components/Icons'

// Light mode variants
<BannerIcon variant="information" />
<BannerIcon variant="success" />
<BannerIcon variant="warning" />
<BannerIcon variant="important" />

// Dark mode variants (for dark backgrounds)
<BannerIcon variant="information" onDark />
<BannerIcon variant="success" onDark />
<BannerIcon variant="warning" onDark />
<BannerIcon variant="important" onDark />`}</CodeBlock>
            </div>
          </section>

          {/* Props */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>IconProps</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="size">size</code>, <code key="size-type">IconSize | number</code>, <code key="size-default">'md'</code>, 'Size of the icon'],
                  [<code key="stroke">strokeWidth</code>, <code key="stroke-type">number</code>, <code key="stroke-default">1.5</code>, 'Stroke weight in pixels'],
                  [<code key="label">label</code>, <code key="label-type">string</code>, '-', 'Accessible label for screen readers'],
                  [<code key="class">className</code>, <code key="class-type">string</code>, '-', 'Additional CSS classes'],
                  [<code key="style">style</code>, <code key="style-type">CSSProperties</code>, '-', 'Inline styles'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>BannerIconProps</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="variant">variant</code>, <code key="variant-type">'information' | 'success' | 'warning' | 'important'</code>, '-', 'Status variant'],
                  [<code key="onDark">onDark</code>, <code key="onDark-type">boolean</code>, <code key="onDark-default">false</code>, 'Use dark mode colors'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Technical Specifications</h3>
              <SpecTable
                headers={['Property', 'Value', 'Notes']}
                rows={[
                  ['ViewBox', '0 0 24 24', 'Standard 24x24 grid'],
                  ['Active Area', '20x20', '2px padding on all sides'],
                  ['Stroke Linecap', 'round', 'Rounded line endings'],
                  ['Stroke Linejoin', 'round', 'Rounded corner joins'],
                  ['Fill', 'none', 'Stroke-based icons by default'],
                  ['Stroke Color', 'currentColor', 'Inherits from parent'],
                ]}
              />
            </div>
          </section>

          {/* Accessibility */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
            <p style={sharedStyles.sectionDescription}>
              Use the <code>label</code> prop for accessible icons that convey meaning.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Decorative vs Meaningful Icons</h3>
              <CodeBlock>{`// Decorative icon (hidden from screen readers)
<IconStar />
// Renders: aria-hidden="true" role="presentation"

// Meaningful icon (accessible to screen readers)
<IconStar label="Favorite" />
// Renders: aria-label="Favorite" role="img"

// Icon button example
<button aria-label="Delete item">
  <IconTrash />
</button>`}</CodeBlock>
            </div>
          </section>

          {/* TypeScript */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>TypeScript</h2>
            <p style={sharedStyles.sectionDescription}>
              Full TypeScript support with exported types.
            </p>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Types</h3>
              <CodeBlock>{`import type { IconProps, IconSize } from '@/components/Icons'

// IconProps interface
interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: IconSize | number
  strokeWidth?: number
  label?: string
}

// IconSize type
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Using types
const MyIcon: React.FC<IconProps> = (props) => {
  return <IconHome {...props} />
}`}</CodeBlock>
            </div>
          </section>

          {/* All Available Icons */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>All Available Icons</h2>
            <p style={sharedStyles.sectionDescription}>
              Complete list of all icons available for import.
            </p>

            <div style={sharedStyles.card}>
              <CodeBlock>{`import {
  // Navigation
  IconHome, IconMenu, IconSearch,
  IconArrowLeft, IconArrowRight, IconArrowUp, IconArrowDown,
  IconChevronLeft, IconChevronRight, IconChevronUp, IconChevronDown,
  IconExternalLink,

  // Actions
  IconPlus, IconMinus, IconX, IconCheck,
  IconEdit, IconTrash, IconCopy,
  IconDownload, IconUpload, IconShare, IconSave, IconRefresh,

  // Status
  IconInfo, IconAlertCircle, IconAlertTriangle,
  IconCheckCircle, IconXCircle, IconLoader,

  // Objects
  IconFile, IconFolder, IconImage,
  IconUser, IconUsers, IconCalendar, IconClock, IconSettings,

  // Visibility
  IconEye, IconEyeOff, IconLock, IconUnlock,

  // Media
  IconPlay, IconPause, IconVolume, IconVolumeOff,

  // UI
  IconFilter, IconSort, IconMaximize, IconMinimize,
  IconMoreHorizontal, IconMoreVertical, IconGrid, IconList, IconApps, IconDrag, IconCart,

  // Social
  IconStar, IconHeart, IconThumbsUp, IconThumbsDown,

  // Communication
  IconMail, IconBell, IconMessageCircle,

  // Design System
  IconColors, IconTypography, IconSpacing, IconRadius,
  IconShadows, IconBreakpoints, IconAvatar, IconButton,
  IconTab, IconBanner, IconBadge, IconLayoutCard,
  IconFoundations, IconComponents, IconIcons,
} from '@/components/Icons'`}</CodeBlock>
            </div>
          </section>
        </>
      )}
    </StyleguideLayout>
  )
}
