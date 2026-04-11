'use client'

import React, { useState, useCallback } from 'react'
import {
  StyleguideLayout,
  CodeBlock,
  SpecTable,
  Playground,
  PillButton,
  ComponentDocumentation,
  type ComponentDocData,
} from '../../design-system/shared'
import { ChatPanel, ChatFab, ChatSearchTrigger, DotGrid } from '@/components'
import type { ChatMessage, ChatAction, DotAnimation } from '@/components/ChatPanel/types'
import { colors, spacing, typography } from '@/styles/design-tokens'

// =============================================================================
// COMPONENT DOC DATA
// =============================================================================

const chatPanelDocData: ComponentDocData = {
  displayName: 'ChatPanel',
  importPath: '@/components',
  importStatement: `import { ChatPanel, ChatFab, ChatSearchTrigger, DotGrid } from '@/components'
import type { ChatMessage, ChatAction, DotAnimation } from '@/components/ChatPanel/types'`,
  description: 'An agent chat experience with collapsed side panel, full-screen expanded view, structured UI responses, animated avatar, FAB trigger, and search bar trigger. Extracted from the Canopy Registry prototype.',
  props: [
    { name: 'isOpen', type: 'boolean', required: true, description: 'Whether the panel is visible' },
    { name: 'isExpanded', type: 'boolean', required: true, description: 'Whether the panel is full-screen' },
    { name: 'onClose', type: '() => void', required: true, description: 'Called when panel should close' },
    { name: 'onToggleExpand', type: '() => void', required: true, description: 'Called to toggle expand/collapse' },
    { name: 'onSendMessage', type: '(text: string) => void', description: 'Called when user sends a message' },
    { name: 'messages', type: 'ChatMessage[]', default: '[]', description: 'Message history to display' },
    { name: 'isTyping', type: 'boolean', default: 'false', description: 'Shows typing indicator when true' },
    { name: 'agentName', type: 'string', default: "'Assistant'", description: 'Name shown in header and placeholders' },
    { name: 'accentColor', type: 'string', default: 'colors.brand.default', description: 'Primary accent color for bubbles, buttons, avatar' },
    { name: 'conversationStarters', type: 'string[]', default: '[]', description: 'Suggested prompts shown in empty state' },
    { name: 'dotAnimation', type: "'pulse' | 'wind'", default: "'pulse'", description: 'DotGrid animation style' },
    { name: 'onDotAnimationChange', type: '(v: DotAnimation) => void', description: 'Called when user toggles animation' },
    { name: 'onNewChat', type: '() => void', description: 'Called when "New chat" is clicked' },
    { name: 'onActionClick', type: '(action: ChatAction) => void', description: 'Called when an action button in a response is clicked' },
    { name: 'collapsedWidth', type: 'number | string', default: '480', description: 'Width when not expanded' },
    { name: 'maxContentWidth', type: 'number', default: '720', description: 'Max content width in expanded mode' },
  ],
  typeDefinitions: [
    { name: 'ChatMessage', definition: "{ id: string; role: 'user' | 'assistant'; content: string; structured?: AssistantPayload }" },
    { name: 'AssistantPayload', definition: '{ text?: string; components?: UIComponent[]; actions?: ChatAction[] }' },
    { name: 'UIComponent', definition: "{ type: 'DATA_TABLE' | 'ENTITY_CARD' | 'STAT_CARDS' | 'BANNER' | 'STEPPER'; props: ... }" },
    { name: 'ChatAction', definition: '{ label: string; action: string; payload?: Record<string, unknown> }' },
    { name: 'DotAnimation', definition: "'pulse' | 'wind'" },
  ],
  accessibility: [
    { feature: 'Landmark', description: 'Panel has role="complementary" with descriptive aria-label.' },
    { feature: 'Keyboard', description: 'ESC closes panel. Enter sends message. All buttons are keyboard accessible.' },
    { feature: 'Focus Visible', description: 'All buttons and textarea show focus-visible outlines using accent color.' },
    { feature: 'Live Region', description: 'Message thread uses aria-live="polite" so new messages are announced.' },
    { feature: 'Typing Status', description: 'Visually hidden role="status" span announces when agent is typing.' },
    { feature: 'Reduced Motion', description: 'DotGrid respects prefers-reduced-motion and disables all animations.' },
    { feature: 'Suggested Prompts', description: 'Conversation starters wrapped in <nav aria-label="Suggested prompts">.' },
  ],
  tokens: [
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Default accent color for bubbles, FAB, buttons' },
    { token: 'colors.surface.light', value: 'White', usage: 'Panel background' },
    { token: 'colors.text.highEmphasis.onLight', value: 'Dark text', usage: 'Message text, headings' },
    { token: 'colors.text.lowEmphasis.onLight', value: 'Gray text', usage: 'Placeholders, secondary text, close button' },
    { token: 'colors.border.lowEmphasis.onLight', value: 'Light border', usage: 'Input border, table borders' },
    { token: 'spacing.*', value: '2xs–2xl', usage: 'All padding, gaps, margins' },
    { token: 'typography.body.sm', value: '14px', usage: 'Message text' },
    { token: 'typography.label.sm', value: '12px semibold', usage: 'Action buttons, starters, table headers' },
    { token: 'borderRadiusSemantics.card', value: 'Card radius', usage: 'Input container, renderer cards' },
    { token: 'borderRadiusSemantics.button', value: 'Button radius', usage: 'Close, expand, action buttons' },
    { token: 'shadowSemantics.dropdown', value: 'Lg shadow', usage: 'FAB shadow' },
  ],
  relatedComponents: [
    { name: 'Banner', href: '/components/banner' },
    { name: 'Data Table', href: '/components/data-table' },
    { name: 'Stepper', href: '/components/stepper' },
    { name: 'Full Screen Modal', href: '/components/full-screen-modal' },
  ],
  notes: [
    'ChatPanel is a compound component extracted from the Canopy Registry prototype.',
    'The panel supports both controlled (pass messages) and uncontrolled (internal state) messaging.',
    'Structured responses use UIComponent types: DATA_TABLE, ENTITY_CARD, STAT_CARDS, BANNER, STEPPER.',
    'ChatFab and ChatSearchTrigger are standalone trigger components — use them to open the panel.',
    'DotGrid is an animated avatar with pulse and wind animations, respects prefers-reduced-motion.',
  ],
  whenToUse: [
    'AI assistant chat interface embedded in the application.',
    'Conversational UI that can render structured data (tables, cards, stats) inline.',
  ],
  usageExamples: [
    {
      title: 'Floating chat panel',
      description: 'Use ChatFab as the trigger and ChatPanel as the sliding panel.',
      isDefault: true,
      code: `<ChatFab onClick={() => setOpen(true)} />\n<ChatPanel\n  open={open}\n  onClose={() => setOpen(false)}\n  messages={messages}\n  onSend={handleSend}\n/>`,
    },
  ],
}

// =============================================================================
// MOCK DATA FOR PLAYGROUND
// =============================================================================

const DEMO_STARTERS = [
  'Find products with missing data',
  'Register a new product',
  'Show market overview',
]

const DEMO_MESSAGES: ChatMessage[] = [
  { id: 'msg-1', role: 'user', content: 'Show me recent activity' },
  {
    id: 'msg-2',
    role: 'assistant',
    content: '',
    structured: {
      text: "Here's a snapshot of your activity this week.",
      components: [
        {
          type: 'STAT_CARDS',
          props: {
            items: [
              { label: 'Products Registered', value: 23 },
              { label: 'Markets Updated', value: 5 },
              { label: 'Compliance Flags', value: 8 },
              { label: 'Bundles Created', value: 2 },
            ],
          },
        },
        {
          type: 'BANNER',
          props: {
            variant: 'warning',
            title: '8 compliance flags this week',
            description: 'Most related to missing THC testing certificates.',
          },
        },
      ],
      actions: [
        { label: 'View details', action: 'VIEW_COMPLIANCE' },
        { label: 'Export report', action: 'EXPORT_REPORT' },
      ],
    },
  },
]

// =============================================================================
// PAGE
// =============================================================================

type PageTab = 'overview' | 'implementation'

export default function ChatPanelPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [isOpen, setIsOpen] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMessages, setShowMessages] = useState(true)
  const [dotAnim, setDotAnim] = useState<DotAnimation>('pulse')
  const [demoAccent, setDemoAccent] = useState<'brand' | 'blue' | 'green'>('brand')

  const accentMap: Record<string, string> = {
    brand: colors.brand.default,
    blue: '#3B82F6',
    green: '#10B981',
  }

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
  ]

  return (
    <StyleguideLayout
      title="Chat Panel"
      description="Agent chat experience with collapsed and expanded views, structured UI responses, and animated avatar."
      tagline="AI assistance, always within reach."
      activeId="chat-panel"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
    >
      {activePageTab === 'overview' && (
        <>
          {/* Quick Start */}
          <section style={{ marginBottom: spacing['2xl'] }}>
            <h2 style={{ ...typography.heading.h4, color: colors.text.highEmphasis.onLight, marginBottom: spacing.md }}>
              Quick Start
            </h2>
            <CodeBlock>{`// Package import
import { ChatPanel, ChatFab, ChatSearchTrigger, DotGrid } from '@lumen/design-system'

// Or with path alias
import { ChatPanel, ChatFab, ChatSearchTrigger, DotGrid } from '@/components'
import type { ChatMessage, ChatAction, DotAnimation } from '@/components/ChatPanel/types'`}</CodeBlock>
          </section>

          {/* Interactive Playground */}
          <section style={{ marginBottom: spacing['2xl'] }}>
            <h2 style={{ ...typography.heading.h4, color: colors.text.highEmphasis.onLight, marginBottom: spacing.md }}>
              Interactive Playground
            </h2>

            {/* Controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md }}>
              <div>
                <div style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight, marginBottom: spacing['2xs'] }}>State</div>
                <div style={{ display: 'flex', gap: spacing['2xs'] }}>
                  <PillButton isActive={showMessages} onClick={() => setShowMessages(true)}>With Messages</PillButton>
                  <PillButton isActive={!showMessages} onClick={() => setShowMessages(false)}>Empty</PillButton>
                </div>
              </div>
              <div>
                <div style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight, marginBottom: spacing['2xs'] }}>View</div>
                <div style={{ display: 'flex', gap: spacing['2xs'] }}>
                  <PillButton isActive={!isExpanded} onClick={() => setIsExpanded(false)}>Collapsed</PillButton>
                  <PillButton isActive={isExpanded} onClick={() => setIsExpanded(true)}>Expanded</PillButton>
                </div>
              </div>
              <div>
                <div style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight, marginBottom: spacing['2xs'] }}>Accent</div>
                <div style={{ display: 'flex', gap: spacing['2xs'] }}>
                  <PillButton isActive={demoAccent === 'brand'} onClick={() => setDemoAccent('brand')}>Brand</PillButton>
                  <PillButton isActive={demoAccent === 'blue'} onClick={() => setDemoAccent('blue')}>Blue</PillButton>
                  <PillButton isActive={demoAccent === 'green'} onClick={() => setDemoAccent('green')}>Green</PillButton>
                </div>
              </div>
              <div>
                <div style={{ ...typography.label.sm, color: colors.text.lowEmphasis.onLight, marginBottom: spacing['2xs'] }}>Animation</div>
                <div style={{ display: 'flex', gap: spacing['2xs'] }}>
                  <PillButton isActive={dotAnim === 'pulse'} onClick={() => setDotAnim('pulse')}>Pulse</PillButton>
                  <PillButton isActive={dotAnim === 'wind'} onClick={() => setDotAnim('wind')}>Wind</PillButton>
                </div>
              </div>
            </div>

            <Playground
              preview={
                <div style={{ height: 500, display: 'flex', background: colors.surface.lightDarker, borderRadius: 8, overflow: 'hidden' }}>
                  {/* Simulated app content */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, marginBottom: spacing.sm }}>
                        App content area
                      </div>
                      <ChatSearchTrigger
                        agentName="Buddy"
                        accentColor={accentMap[demoAccent]}
                        onClick={() => setIsOpen(true)}
                      />
                    </div>
                  </div>
                  {/* Chat Panel */}
                  <ChatPanel
                    isOpen={isOpen}
                    isExpanded={isExpanded}
                    onClose={() => setIsOpen(false)}
                    onToggleExpand={() => setIsExpanded(!isExpanded)}
                    messages={showMessages ? DEMO_MESSAGES : []}
                    agentName="Buddy"
                    accentColor={accentMap[demoAccent]}
                    conversationStarters={DEMO_STARTERS}
                    dotAnimation={dotAnim}
                    onDotAnimationChange={setDotAnim}
                    onNewChat={() => {}}
                    collapsedWidth={400}
                  />
                </div>
              }
              code={`<ChatPanel
  isOpen={true}
  isExpanded={false}
  onClose={() => setIsOpen(false)}
  onToggleExpand={() => setIsExpanded(!isExpanded)}
  messages={messages}
  agentName="Buddy"
  accentColor={colors.brand.default}
  conversationStarters={['Find products', 'Register new']}
  onSendMessage={(text) => handleSend(text)}
  onActionClick={(action) => handleAction(action)}
/>`}
              previewPadding="0px"
            />
          </section>

          {/* Sub-components */}
          <section style={{ marginBottom: spacing['2xl'] }}>
            <h2 style={{ ...typography.heading.h4, color: colors.text.highEmphasis.onLight, marginBottom: spacing.md }}>
              Trigger Components
            </h2>
            <Playground
              preview={
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xl }}>
                  <div style={{ position: 'relative', width: 56, height: 56 }}>
                    <ChatFab
                      accentColor={accentMap[demoAccent]}
                      onClick={() => setIsOpen(true)}
                      style={{ position: 'relative', bottom: 'auto', right: 'auto' }}
                    />
                  </div>
                  <DotGrid brandColor={accentMap[demoAccent]} animation={dotAnim} size="md" />
                  <DotGrid brandColor={accentMap[demoAccent]} animation={dotAnim} size="sm" />
                </div>
              }
              code={`{/* FAB trigger */}
<ChatFab
  accentColor={colors.brand.default}
  onClick={() => setChatOpen(true)}
/>

{/* DotGrid avatar */}
<DotGrid brandColor={colors.brand.default} animation="pulse" size="md" />`}
            />
          </section>

          {/* Design Tokens */}
          <section style={{ marginBottom: spacing['2xl'] }}>
            <h2 style={{ ...typography.heading.h4, color: colors.text.highEmphasis.onLight, marginBottom: spacing.md }}>
              Design Tokens
            </h2>
            <SpecTable
              headers={['Token', 'Value', 'Usage']}
              rows={chatPanelDocData.tokens!.map(t => [t.token, t.value, t.usage])}
            />
          </section>
        </>
      )}

      {activePageTab === 'implementation' && (
        <ComponentDocumentation data={chatPanelDocData} />
      )}
    </StyleguideLayout>
  )
}
