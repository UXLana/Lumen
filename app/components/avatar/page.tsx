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
                      <Avatar
                        src={demoUseImage ? 'https://i.pravatar.cc/150?img=1' : undefined}
                        name="Alice Johnson"
                        size={demoSize}
                        color={demoColor}
                        focused={demoFocused}
                        onDark={demoOnDark}
                      />
                    }
                    code={`<Avatar${demoUseImage ? '\n  src="https://i.pravatar.cc/150?img=1"' : ''}
  name="Alice Johnson"
  size="${demoSize}"${!demoUseImage ? `\n  color={${demoColor}}` : ''}${demoFocused ? '\n  focused' : ''}${demoOnDark ? '\n  onDark' : ''}
/>`}
                    previewBackground={demoOnDark ? colors.brand.primary : colors.neutral[50]}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

                    {/* Color (only shown when not using image) */}
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

                    {/* Toggles */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { label: 'Use Image', value: demoUseImage, setter: setDemoUseImage },
                        { label: 'Focused', value: demoFocused, setter: setDemoFocused },
                        { label: 'On Dark', value: demoOnDark, setter: setDemoOnDark },
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

          {/* Preview */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Preview</h2>
            <p style={sharedStyles.sectionDescription}>
              Avatars can display a profile image or show initials when no image is available.
              They support 5 sizes and 8 color variants for text avatars.
            </p>

            <div style={sharedStyles.card}>
              <div style={sharedStyles.row}>
                <Avatar src="https://i.pravatar.cc/150?img=1" name="Alice Johnson" size="xl" />
                <Avatar src="https://i.pravatar.cc/150?img=2" name="Bob Smith" size="lg" />
                <Avatar src="https://i.pravatar.cc/150?img=3" name="Carol Williams" size="md" />
                <Avatar name="David Brown" size="md" color={4} />
                <Avatar name="Eve Davis" size="sm" color={5} />
                <Avatar name="Frank Miller" size="xs" color={6} />
              </div>
            </div>
          </section>

          {/* ========== DESIGN TOKENS PREVIEW ========== */}
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

          {/* ========== ALL VARIANTS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>All Variants</h2>
            <p style={sharedStyles.sectionDescription}>
              All avatar variants displayed for visual comparison.
            </p>

            {/* Image Avatars - Sizes */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Image Avatars - Sizes</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
                {sizes.map(size => (
                  <div key={size} style={{ textAlign: 'center' }}>
                    <Avatar 
                      src="https://i.pravatar.cc/150?img=1" 
                      name="User"
                      size={size}
                    />
                    <p style={{ ...typography.label.sm, color: colors.text.mediumEmphasis, marginTop: '12px' }}>
                      {size.toUpperCase()}
                    </p>
                    <p style={{ ...typography.code.sm, color: colors.text.lowEmphasis }}>
                      {avatar.sizes[size]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Avatars - Sizes */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Text Avatars - Sizes</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
                {sizes.map(size => (
                  <div key={size} style={{ textAlign: 'center' }}>
                    <Avatar name="William Walker" size={size} color={1} />
                    <p style={{ ...typography.label.sm, color: colors.text.mediumEmphasis, marginTop: '12px' }}>
                      {size.toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Avatars - Color Variants */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Text Avatars - Color Variants</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                Colors are automatically assigned based on the user's name for consistency.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {colorVariants.map(color => (
                  <div key={color} style={{ textAlign: 'center' }}>
                    <Avatar name={`User ${color}`} size="md" color={color} />
                    <p style={{ ...typography.code.sm, color: colors.text.lowEmphasis, marginTop: '8px' }}>
                      {color}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Focus State */}
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Focus State</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                When focused via keyboard navigation, avatars display a focus ring.
              </p>
              <div style={sharedStyles.row}>
                <Avatar src="https://i.pravatar.cc/150?img=1" name="User" size="xl" focused />
                <Avatar name="William Walker" size="xl" color={1} focused />
              </div>
            </div>

            {/* On Dark Surface */}
            <div style={{ background: colors.brand.primary, padding: '32px', borderRadius: borderRadius.lg, marginBottom: '24px' }}>
              <h3 style={{ ...typography.heading.h5, color: colors.text.highEmphasisOnDark, marginBottom: '24px' }}>
                On Dark Surface
              </h3>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                {sizes.map(size => (
                  <Avatar key={size} src="https://i.pravatar.cc/150?img=1" name="User" size={size} onDark />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                {sizes.map(size => (
                  <Avatar key={size} name="William Walker" size={size} color={1} onDark />
                ))}
              </div>
            </div>
          </section>

          {/* ========== AVATAR GROUPS ========== */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Avatar Groups</h2>
            <p style={sharedStyles.sectionDescription}>
              Avatar groups indicate that multiple people have access to the content.
            </p>
            
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Standard Group</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                On desktop and tablet environments use standard groups.
              </p>
              <AvatarGroup avatars={sampleUsers.slice(0, 4)} size="md" />
            </div>
            
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Compact Group</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                On phones, and when space is tight, use a compact group with 30% overlap.
              </p>
              <AvatarGroup avatars={sampleUsers.slice(0, 4)} size="md" compact />
            </div>
            
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Group Growth</h3>
              <p style={{ ...typography.body.sm, color: colors.text.mediumEmphasis, marginBottom: '16px' }}>
                Groups grow up to the max count, then show an overflow indicator.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AvatarGroup avatars={sampleUsers.slice(0, 1)} size="md" compact />
                <AvatarGroup avatars={sampleUsers.slice(0, 3)} size="md" compact />
                <AvatarGroup avatars={sampleUsers.slice(0, 5)} size="md" compact max={5} />
                <AvatarGroup avatars={sampleUsers} size="md" compact max={5} />
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
{`import { Avatar, AvatarGroup } from '@/components'
import type { AvatarProps, AvatarSize, AvatarColor } from '@/components'`}
              </CodeBlock>
            </div>
            
            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>
{`// Image avatar
<Avatar 
  src="/profile.jpg"
  name="John Doe"
  size="md"
/>

// Text avatar (initials)
<Avatar 
  name="Jane Smith"
  size="lg"
  color={3}
/>

// Avatar group
<AvatarGroup
  avatars={[
    { name: "User 1", src: "/user1.jpg" },
    { name: "User 2" },
    { name: "User 3" },
  ]}
  max={5}
  compact
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>On Dark Surfaces</h3>
              <CodeBlock>
{`// Use onDark prop for dark backgrounds
<Avatar 
  src="/profile.jpg"
  name="John Doe"
  size="md"
  onDark
/>`}
              </CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Avatar Groups</h3>
              <CodeBlock>
{`// Standard group
<AvatarGroup
  avatars={users}
  size="md"
/>

// Compact group (30% overlap)
<AvatarGroup
  avatars={users}
  size="md"
  compact
  max={5}
/>`}
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
