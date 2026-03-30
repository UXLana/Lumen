'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, StyledCheckbox, TokenValue, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { Avatar, AvatarGroup, AvatarSize, AvatarColor } from '@/components'
import { colors, typography, avatar, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// SAMPLE DATA
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

const sampleUsers = [
  { name: 'Alice Johnson', src: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Bob Smith', src: 'https://i.pravatar.cc/150?img=2' },
  { name: 'Carol Williams', src: 'https://i.pravatar.cc/150?img=3' },
  { name: 'David Brown', src: 'https://i.pravatar.cc/150?img=4' },
  { name: 'Eve Davis', src: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Frank Miller', src: 'https://i.pravatar.cc/150?img=6' },
  { name: 'Grace Wilson' },
  { name: 'Henry Taylor' },
]

// =============================================================================
// PAGE COMPONENT
// =============================================================================

const avatarDocData: ComponentDocData = {
  displayName: 'Avatar',
  importPath: '@/components',
  importStatement: `import { Avatar, AvatarGroup } from '@/components'
import type { AvatarProps, AvatarGroupProps, AvatarSize, AvatarColor } from '@/components'`,
  description: 'Avatars represent users or entities with images, initials, or a default icon.',
  props: [
    { name: 'src', type: 'string', description: 'Image source URL' },
    { name: 'alt', type: 'string', description: 'Alt text for the image' },
    { name: 'name', type: 'string', description: 'User name for initials fallback and alt text' },
    { name: 'size', type: "'xl' | 'lg' | 'md' | 'sm' | 'xs'", default: "'md'", description: 'Size of the avatar' },
    { name: 'color', type: '1 | 2 | 3 | 4 | 5 | 6 | 7 | 8', description: 'Color variant for initials (1-8)' },
    { name: 'focused', type: 'boolean', description: 'Shows focus ring' },
    { name: 'onDark', type: 'boolean', description: 'Adds border for dark surfaces' },
    { name: 'onClick', type: '() => void', description: 'Optional click handler' },
    { name: 'className', type: 'string', description: 'Additional CSS class' },
    { name: 'style', type: 'CSSProperties', description: 'Additional inline styles' },
  ],
  subComponents: [
    {
      name: 'AvatarGroup',
      description: 'Displays a group of avatars with optional overlap and overflow indicator.',
      props: [
        { name: 'avatars', type: 'AvatarProps[]', required: true, description: 'Array of avatar props' },
        { name: 'max', type: 'number', description: 'Maximum avatars to display' },
        { name: 'size', type: 'AvatarSize', description: 'Size of all avatars in the group' },
        { name: 'compact', type: 'boolean', description: 'Overlapping layout' },
        { name: 'onOverflowClick', type: '() => void', description: 'Click handler for overflow indicator' },
        { name: 'className', type: 'string', description: 'Additional CSS class' },
        { name: 'style', type: 'CSSProperties', description: 'Additional inline styles' },
      ],
    },
  ],
  typeDefinitions: [
    { name: 'AvatarSize', definition: "type AvatarSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs'" },
    { name: 'AvatarColor', definition: 'type AvatarColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8' },
  ],
  accessibility: [
    { feature: 'Alt Text', description: 'Image avatars use alt from name or alt prop. Initials avatars use aria-label.' },
    { feature: 'Role', description: 'Clickable avatars render as button with proper role.' },
    { feature: 'Focus Ring', description: 'Visible focus ring for keyboard navigation.' },
    { feature: 'Color Contrast', description: 'All 8 color variants meet WCAG contrast requirements for initials text.' },
  ],
  tokens: [
    { token: 'Avatar sizes', value: 'xl:64, lg:48, md:40, sm:32, xs:24', usage: 'Avatar dimensions in pixels' },
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Focus ring color' },
    { token: 'borderRadius (50%)', value: 'Circular', usage: 'Avatar shape' },
  ],
  relatedComponents: [
    { name: 'List Item', href: '/components/list-item' },
    { name: 'Header', href: '/components/header' },
  ],
  notes: [
    'Provide a name prop for accessible initials fallback when no image is available.',
    'Use AvatarGroup with compact mode for space-efficient user lists.',
    'Color assignments (1-8) should be deterministic per user for consistency.',
  ],
}

export default function AvatarPage() {
  const sizes: AvatarSize[] = ['xl', 'lg', 'md', 'sm', 'xs']
  const colorVariants: AvatarColor[] = [1, 2, 3, 4, 5, 6, 7, 8]

  // Page tab state
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Interactive playground state
  const [demoSize, setDemoSize] = useState<AvatarSize>('md')
  const [demoColor, setDemoColor] = useState<AvatarColor>(1)
  const [demoUseImage, setDemoUseImage] = useState(true)
  const [demoFocused, setDemoFocused] = useState(false)
  const [demoOnDark, setDemoOnDark] = useState(false)
  const [avatarCount, setAvatarCount] = useState<number>(1)
  const [maxVisible, setMaxVisible] = useState<number>(5)
  const [demoName, setDemoName] = useState<string>('Alice Johnson')

  // Custom tabs for component pages
  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Avatar"
      description="Avatars provide a consistent visual representation of a specific person. They use a rounded rectangle shape with 30% border radius."
      activeId="avatar"
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
import { Avatar, AvatarGroup } from '@metrc/design-system'

// Or with path alias (requires tsconfig setup)
import { Avatar, AvatarGroup } from '@/components'`}</CodeBlock>
            </div>
          </section>

          {/* ========== INTERACTIVE PLAYGROUND ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Manipulate avatar properties in real-time to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview/Code with Tabs */}
                <div>
                  <Playground
                    preview={
                      avatarCount === 1 ? (
                        <Avatar
                          src={demoUseImage ? 'https://i.pravatar.cc/150?img=1' : undefined}
                          name={demoName}
                          size={demoSize}
                          color={demoColor}
                          focused={demoFocused}
                          onDark={demoOnDark}
                        />
                      ) : (
                        <AvatarGroup
                          avatars={sampleUsers.slice(0, avatarCount).map((user, i) => ({
                            ...user,
                            src: demoUseImage ? user.src : undefined,
                            color: !demoUseImage ? ((i % 8) + 1) as AvatarColor : undefined,
                          }))}
                          size={demoSize}
                          max={maxVisible}
                          compact
                        />
                      )
                    }
                    code={avatarCount === 1
                      ? `import { Avatar } from '@/components'

<Avatar${demoUseImage ? '\n  src="https://i.pravatar.cc/150?img=1"' : ''}
  name="${demoName}"
  size="${demoSize}"${!demoUseImage ? `\n  color={${demoColor}}` : ''}${demoFocused ? '\n  focused' : ''}${demoOnDark ? '\n  onDark' : ''}
/>`
                      : `import { AvatarGroup } from '@/components'

const users = [
${sampleUsers.slice(0, avatarCount).map((user, i) =>
  demoUseImage
    ? `  { name: "${user.name}", src: "${user.src || ''}" }`
    : `  { name: "${user.name}", color: ${(i % 8) + 1} }`
).join(',\n')}
]

<AvatarGroup
  avatars={users}
  size="${demoSize}"
  max={${maxVisible}}
  compact
/>`}
                    previewPadding="56px 24px"
                    previewBackground={demoOnDark && avatarCount === 1 ? colors.brand.default : colors.surface.lightDarker}
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

                    {/* Avatar Count & Max Visible - Side by side */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
                      {/* Avatar Count - Stepper */}
                      <div>
                        <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                          Avatars
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button
                            onClick={() => setAvatarCount(Math.max(1, avatarCount - 1))}
                            disabled={avatarCount <= 1}
                            style={{
                              width: '32px',
                              height: '32px',
                              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                              borderRadius: borderRadius.md,
                              background: 'white',
                              cursor: avatarCount <= 1 ? 'not-allowed' : 'pointer',
                              opacity: avatarCount <= 1 ? 0.5 : 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px',
                              fontWeight: 500,
                            }}
                          >
                            −
                          </button>
                          <span style={{ ...typography.body.md, minWidth: '24px', textAlign: 'center' }}>
                            {avatarCount}
                          </span>
                          <button
                            onClick={() => setAvatarCount(Math.min(8, avatarCount + 1))}
                            disabled={avatarCount >= 8}
                            style={{
                              width: '32px',
                              height: '32px',
                              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                              borderRadius: borderRadius.md,
                              background: 'white',
                              cursor: avatarCount >= 8 ? 'not-allowed' : 'pointer',
                              opacity: avatarCount >= 8 ? 0.5 : 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px',
                              fontWeight: 500,
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Max Visible - Only show when avatarCount > 1 */}
                      {avatarCount > 1 && (
                        <div>
                          <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                            Max Visible
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                              onClick={() => setMaxVisible(Math.max(1, maxVisible - 1))}
                              disabled={maxVisible <= 1}
                              style={{
                                width: '32px',
                                height: '32px',
                                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                                borderRadius: borderRadius.md,
                                background: 'white',
                                cursor: maxVisible <= 1 ? 'not-allowed' : 'pointer',
                                opacity: maxVisible <= 1 ? 0.5 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                fontWeight: 500,
                              }}
                            >
                              −
                            </button>
                            <span style={{ ...typography.body.md, minWidth: '24px', textAlign: 'center' }}>
                              {maxVisible}
                            </span>
                            <button
                              onClick={() => setMaxVisible(Math.min(avatarCount, maxVisible + 1))}
                              disabled={maxVisible >= avatarCount}
                              style={{
                                width: '32px',
                                height: '32px',
                                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                                borderRadius: borderRadius.md,
                                background: 'white',
                                cursor: maxVisible >= avatarCount ? 'not-allowed' : 'pointer',
                                opacity: maxVisible >= avatarCount ? 0.5 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                fontWeight: 500,
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Display Type - Radio buttons for Image vs Initials */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Display
                      </label>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="displayType"
                            checked={demoUseImage}
                            onChange={() => setDemoUseImage(true)}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span style={{ ...typography.label.sm }}>Image</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="displayType"
                            checked={!demoUseImage}
                            onChange={() => setDemoUseImage(false)}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span style={{ ...typography.label.sm }}>Initials</span>
                        </label>
                      </div>
                    </div>

                    {/* Name input - Only show when using initials */}
                    {!demoUseImage && (
                      <div>
                        <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                          Name <span style={{ color: colors.text.lowEmphasis.onLight, fontWeight: 400 }}>(shows as initials)</span>
                        </label>
                        <input
                          type="text"
                          value={demoName}
                          onChange={(e) => setDemoName(e.target.value)}
                          placeholder="Enter name..."
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                            borderRadius: borderRadius.md,
                            fontSize: '14px',
                            outline: 'none',
                          }}
                        />
                      </div>
                    )}

                    {/* Color (only shown when using initials) */}
                    {!demoUseImage && (
                      <div>
                        <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                          Color
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {colorVariants.map(c => (
                            <button
                              key={c}
                              onClick={() => setDemoColor(c)}
                              style={{
                                width: '32px',
                                height: '32px',
                                border: `2px solid ${demoColor === c ? colors.brand.default : 'transparent'}`,
                                borderRadius: '9999px',
                                background: avatar.colors[c],
                                cursor: 'pointer',
                              }}
                              title={`Color ${c}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* State toggles - Checkboxes for Focused and On Dark */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        States
                      </label>
                      <div style={{ display: 'flex', gap: '24px' }}>
                        <StyledCheckbox
                          checked={demoFocused}
                          onChange={setDemoFocused}
                          label="Focused"
                        />
                        <StyledCheckbox
                          checked={demoOnDark}
                          onChange={setDemoOnDark}
                          label="On Dark"
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
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Size, color, and typography tokens used in the avatar component. Click any token to copy it. Pixel values shown in parentheses are for reference only.
              </p>

              {/* Size Specifications */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Size Specifications</h3>
              <SpecTable
                headers={['Size', 'Dimensions', 'Border Radius', 'Use Case']}
                rows={sizes.map(size => [
                  <code key={size}>{size}</code>,
                  <TokenValue key={`dim-${size}`} token={`avatar.sizes.${size}`} value={avatar.sizes[size]} />,
                  <TokenValue key={`br-${size}`} token={`avatar.borderRadius.${size}`} value={avatar.borderRadius[size]} />,
                  size === 'xl' ? 'Profile headers' :
                  size === 'lg' ? 'Profile cards' :
                  size === 'md' ? 'Lists, comments (default)' :
                  size === 'sm' ? 'Compact lists' :
                  'Inline with text',
                ])}
              />
            </div>

            {/* Color Tokens */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Color Tokens</h3>
              <SpecTable
                headers={['Variant', 'Preview', 'Token', 'Value']}
                rows={colorVariants.map(color => [
                  `Color ${color}`,
                  <div key={color} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', background: avatar.colors[color], borderRadius: '4px', border: `1px solid ${colors.border.lowEmphasis.onLight}` }} />
                  </div>,
                  <CopyableToken key={`token-${color}`} token={`avatar.colors[${color}]`} />,
                  <PixelValue key={`value-${color}`} value={avatar.colors[color]} />,
                ])}
              />
            </div>

            {/* Typography Specifications */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography Specifications</h3>
              <SpecTable
                headers={['Size', 'Font Size', 'Font Weight']}
                rows={sizes.map(size => [
                  <code key={size}>{size}</code>,
                  <TokenValue key={`fs-${size}`} token={`avatar.typography.${size}.fontSize`} value={avatar.typography[size].fontSize} />,
                  <TokenValue key={`fw-${size}`} token={`avatar.typography.${size}.fontWeight`} value={avatar.typography[size].fontWeight.toString()} />,
                ])}
              />
            </div>

            {/* Focus Ring Specifications */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Focus Ring</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Color', <CopyableToken key="fc" token="avatar.focus.color" />, <PixelValue key="fcv" value={avatar.focus.color} />],
                  ['Width', <CopyableToken key="fw" token="avatar.focus.width" />, <PixelValue key="fwv" value={avatar.focus.width} />],
                  ['Offset', <CopyableToken key="fo" token="avatar.focus.offset" />, <PixelValue key="fov" value={avatar.focus.offset} />],
                ]}
              />
            </div>

            {/* Border Specifications */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Border (onDark mode)</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Width', <CopyableToken key="bw" token="avatar.border.width" />, <PixelValue key="bwv" value={avatar.border.width} />],
                  ['Color', <CopyableToken key="bc" token="avatar.border.color" />, <PixelValue key="bcv" value={avatar.border.color} />],
                ]}
              />
            </div>

            {/* Group Settings */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Avatar Group Settings</h3>
              <SpecTable
                headers={['Property', 'Token', 'Value']}
                rows={[
                  ['Overlap Ratio', <CopyableToken key="or" token="avatar.group.overlapRatio" />, <PixelValue key="orv" value={avatar.group.overlapRatio.toString()} />],
                  ['Border Width', <CopyableToken key="gbw" token="avatar.group.borderWidth" />, <PixelValue key="gbwv" value={avatar.group.borderWidth} />],
                  ['Border Color', <CopyableToken key="gbc" token="avatar.group.borderColor" />, <PixelValue key="gbcv" value={avatar.group.borderColor} />],
                  ['Max Visible', <CopyableToken key="mv" token="avatar.group.maxVisible" />, <PixelValue key="mvv" value={avatar.group.maxVisible.toString()} />],
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
          {/* ========== IMPORT ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Import</h2>
            <div style={sharedStyles.card}>
              <CodeBlock>
{`import { Avatar, AvatarGroup } from '@/components'
import type { AvatarProps, AvatarSize, AvatarColor } from '@/components'`}
              </CodeBlock>
            </div>
          </section>

          {/* ========== PROPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>
            
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Avatar Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code>src</code>, <code>string</code>, '-', 'Image source URL'],
                  [<code>name</code>, <code>string</code>, <code>''</code>, "User's name (used for initials fallback)"],
                  [<code>size</code>, <code>'xl' | 'lg' | 'md' | 'sm' | 'xs'</code>, <code>'md'</code>, 'Size of the avatar'],
                  [<code>color</code>, <code>1 | 2 | 3 | 4 | 5 | 6 | 7 | 8</code>, 'auto', 'Color variant for initials'],
                  [<code>focused</code>, <code>boolean</code>, <code>false</code>, 'Shows focus ring'],
                  [<code>onDark</code>, <code>boolean</code>, <code>false</code>, 'Adds border for dark surfaces'],
                  [<code>onClick</code>, <code>() =&gt; void</code>, '-', 'Click handler'],
                ]}
              />
            </div>
            
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>AvatarGroup Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code>avatars</code>, <code>AvatarProps[]</code>, 'required', 'Array of avatar props'],
                  [<code>max</code>, <code>number</code>, <code>5</code>, 'Maximum avatars to display'],
                  [<code>size</code>, <code>AvatarSize</code>, <code>'md'</code>, 'Size for all avatars'],
                  [<code>compact</code>, <code>boolean</code>, <code>false</code>, 'Overlapping layout (30% overlap)'],
                  [<code>onOverflowClick</code>, <code>() =&gt; void</code>, '-', 'Handler for overflow click'],
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
                headers={['Size', 'Dimensions', 'Usage']}
                rows={[
                  [<code>xl</code>, '80px', 'Profile headers, user detail pages'],
                  [<code>lg</code>, '56px', 'Profile cards, user previews'],
                  [<code>md</code>, '40px', 'Lists, comments, default choice'],
                  [<code>sm</code>, '32px', 'Compact lists, dense UIs'],
                  [<code>xs</code>, '24px', 'Inline with text, tags'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use image avatars when available', 'Show broken image placeholders'],
                  ['Fall back to initials gracefully', 'Use generic icons for people'],
                  ['Keep groups to max 5 visible avatars', 'Show too many avatars at once'],
                  ['Use compact groups on mobile', 'Use standard spacing in tight layouts'],
                  ['Assign consistent colors per user', 'Randomly change colors for same user'],
                ]}
              />
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={avatarDocData} />
      )}
    </StyleguideLayout>
  )
}
