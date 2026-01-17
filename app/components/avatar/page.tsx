'use client'

import React, { useState } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton } from '../../design-system/shared'
import { Avatar, AvatarGroup, AvatarSize, AvatarColor } from '@/components'
import { colors, typography, avatar, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// SAMPLE DATA
// =============================================================================

type PageTab = 'overview' | 'implementation'

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
              <CodeBlock>{`import { Avatar, AvatarGroup } from '@/components'`}</CodeBlock>
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
                    previewBackground={demoOnDark && avatarCount === 1 ? colors.brand.primary : colors.neutral[50]}
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
                              border: `1px solid ${colors.border.light}`,
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
                              border: `1px solid ${colors.border.light}`,
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
                                border: `1px solid ${colors.border.light}`,
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
                                border: `1px solid ${colors.border.light}`,
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
                          Name <span style={{ color: colors.text.lowEmphasis, fontWeight: 400 }}>(shows as initials)</span>
                        </label>
                        <input
                          type="text"
                          value={demoName}
                          onChange={(e) => setDemoName(e.target.value)}
                          placeholder="Enter name..."
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: `1px solid ${colors.border.light}`,
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
                                border: `2px solid ${demoColor === c ? colors.brand.primary : 'transparent'}`,
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
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={demoFocused}
                            onChange={(e) => setDemoFocused(e.target.checked)}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span style={{ ...typography.body.sm }}>Focused</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={demoOnDark}
                            onChange={(e) => setDemoOnDark(e.target.checked)}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span style={{ ...typography.body.sm }}>On Dark</span>
                        </label>
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
            <p style={sharedStyles.sectionDescription}>
              Size, color, and typography tokens used in the avatar component.
            </p>

            {/* Size Specifications */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Size Specifications</h3>
              <SpecTable
                headers={['Size', 'Dimensions', 'Border Radius', 'Use Case']}
                rows={sizes.map(size => [
                  <code key={size}>{size}</code>,
                  avatar.sizes[size],
                  avatar.borderRadius[size],
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
                headers={['Variant', 'Color Value', 'Token']}
                rows={colorVariants.map(color => [
                  `Color ${color}`,
                  <div key={color} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', background: avatar.colors[color], borderRadius: '4px', border: `1px solid ${colors.border.light}` }} />
                    {avatar.colors[color]}
                  </div>,
                  <code key={`token-${color}`}>avatar.colors[{color}]</code>,
                ])}
              />
            </div>
            
            {/* Typography Specifications */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Typography Specifications</h3>
              <SpecTable
                headers={['Size', 'Font Size', 'Letter Spacing', 'Font Weight']}
                rows={sizes.map(size => [
                  <code key={size}>{size}</code>,
                  avatar.typography[size].fontSize,
                  '-',
                  avatar.typography[size].fontWeight.toString(),
                ])}
              />
            </div>

            {/* Focus Ring Specifications */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Focus Ring Specifications</h3>
              <SpecTable
                headers={['Property', 'Value', 'Token']}
                rows={[
                  ['Color', avatar.focus.color, <code key="fc">avatar.focus.color</code>],
                  ['Width', avatar.focus.width, <code key="fw">avatar.focus.width</code>],
                  ['Offset', avatar.focus.offset, <code key="fo">avatar.focus.offset</code>],
                ]}
              />
            </div>
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
    </StyleguideLayout>
  )
}
