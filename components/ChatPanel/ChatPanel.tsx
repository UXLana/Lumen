'use client'

import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react'
import {
  colors,
  spacing,
  typography,
  fontWeights,
  borderRadiusSemantics,
} from '@/styles/design-tokens'
import type { ChatMessage, DotAnimation, ChatAction } from './types'
import { DotGrid } from './DotGrid'
import { MessageList } from './MessageList'

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ChatPanelProps {
  isOpen: boolean
  isExpanded: boolean
  onClose: () => void
  onToggleExpand: () => void
  onSendMessage?: (text: string) => void
  messages?: ChatMessage[]
  isTyping?: boolean
  agentName?: string
  accentColor?: string
  conversationStarters?: string[]
  dotAnimation?: DotAnimation
  onDotAnimationChange?: (v: DotAnimation) => void
  onNewChat?: () => void
  onActionClick?: (action: ChatAction) => void
  collapsedWidth?: number | string
  maxContentWidth?: number
}

// ─── Component ───────────────────────────────────────────────────────────────

export const ChatPanel = forwardRef<HTMLDivElement, ChatPanelProps>(
  (
    {
      isOpen,
      isExpanded,
      onClose,
      onToggleExpand,
      onSendMessage,
      messages = [],
      isTyping = false,
      agentName = 'Assistant',
      accentColor = colors.brand.default,
      conversationStarters = [],
      dotAnimation = 'pulse',
      onDotAnimationChange,
      onNewChat,
      onActionClick,
      collapsedWidth = 480,
      maxContentWidth = 720,
    },
    ref
  ) => {
    const [message, setMessage] = useState('')
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    const hasMessages = messages.length > 0

    useEffect(() => {
      if (isOpen && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 300)
      }
    }, [isOpen])

    useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) onClose()
      }
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, [messages, isTyping])

    const handleSend = useCallback(() => {
      if (!message.trim() || !onSendMessage) return
      onSendMessage(message.trim())
      setMessage('')
    }, [message, onSendMessage])

    const panelWidth = isOpen && isExpanded ? '100%' : isOpen ? collapsedWidth : 0

    return (
      <div
        ref={ref}
        role="complementary"
        aria-label={`${agentName} chat panel`}
        className="chat-panel-root"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: panelWidth,
          flexShrink: 0,
          backgroundColor: colors.surface.light,
          overflow: 'hidden',
          transition: 'width 300ms ease-in-out',
          height: '100%',
        }}
      >
        {/* Focus-visible styles for all interactive elements */}
        <style>{`
          .chat-panel-root button:focus-visible,
          .chat-panel-root textarea:focus-visible {
            outline: 2px solid ${accentColor};
            outline-offset: 2px;
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${spacing.sm} ${spacing.md}`,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2xs'] }}>
            <button
              onClick={onClose}
              aria-label="Close chat"
              style={{
                padding: spacing['2xs'],
                borderRadius: borderRadiusSemantics.button,
                border: 'none',
                background: 'transparent',
                color: colors.text.lowEmphasis.onLight,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginLeft: spacing['2xs'] }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: accentColor,
                }}
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.text.highEmphasis.onDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8" /><rect x="2" y="2" width="20" height="8" rx="2" /><path d="M2 14h20" /><rect x="2" y="14" width="20" height="8" rx="2" />
                </svg>
              </div>
              <span style={{ ...typography.label.md, color: colors.text.highEmphasis.onLight }}>
                {agentName}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2xs'] }}>
            {hasMessages && onNewChat && (
              <button
                onClick={onNewChat}
                style={{
                  ...typography.label.sm,
                  padding: `${spacing['2xs']} ${spacing.xs}`,
                  borderRadius: borderRadiusSemantics.button,
                  border: 'none',
                  background: 'transparent',
                  color: colors.text.lowEmphasis.onLight,
                  cursor: 'pointer',
                }}
              >
                New chat
              </button>
            )}
            <button
              onClick={onToggleExpand}
              aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
              style={{
                padding: spacing['2xs'],
                borderRadius: borderRadiusSemantics.button,
                border: 'none',
                background: 'transparent',
                color: colors.text.lowEmphasis.onLight,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isExpanded ? (
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              ) : (
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: hasMessages ? 'flex-start' : 'center',
            alignItems: hasMessages ? undefined : 'center',
            padding: `0 ${spacing.md}`,
            overflowY: 'auto',
          }}
        >
          {!hasMessages ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                onClick={() => onDotAnimationChange?.(dotAnimation === 'pulse' ? 'wind' : 'pulse')}
                aria-label={`Switch animation to ${dotAnimation === 'pulse' ? 'wind' : 'pulse'}`}
                style={{
                  marginBottom: spacing.lg,
                  padding: spacing.sm,
                  borderRadius: borderRadiusSemantics.card,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <DotGrid brandColor={accentColor} animation={dotAnimation} size="md" />
              </button>
              <h2 style={{ ...typography.heading.h5, color: colors.text.highEmphasis.onLight, margin: 0 }}>
                How can I help?
              </h2>
              <p style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight, marginTop: spacing['2xs'] }}>
                I&apos;m {agentName}, your assistant
              </p>
            </div>
          ) : (
            <MessageList
              messages={messages}
              isTyping={isTyping}
              agentName={agentName}
              accentColor={accentColor}
              isExpanded={isExpanded}
              maxContentWidth={maxContentWidth}
              onActionClick={onActionClick}
            />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            flexShrink: 0,
            padding: `0 ${spacing.md} ${spacing.md}`,
            maxWidth: isExpanded ? maxContentWidth : 600,
            width: '100%',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              borderRadius: borderRadiusSemantics.card,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              overflow: 'hidden',
              backgroundColor: colors.surface.light,
              marginBottom: spacing.sm,
            }}
          >
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={hasMessages ? `Ask ${agentName} anything...` : 'Search or ask anything'}
              aria-label={`Message ${agentName}`}
              rows={2}
              style={{
                ...typography.body.sm,
                width: '100%',
                padding: `${spacing.sm} ${spacing.md} ${spacing['2xs']}`,
                resize: 'none',
                outline: 'none',
                border: 'none',
                backgroundColor: 'transparent',
                color: colors.text.highEmphasis.onLight,
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: `0 ${spacing.sm} ${spacing.xs}`,
              }}
            >
              <button
                onClick={handleSend}
                disabled={!message.trim() || isTyping}
                aria-label="Send message"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: message.trim() && !isTyping ? 'pointer' : 'default',
                  backgroundColor: message.trim() ? accentColor : colors.surface.disabled.onLight,
                  color: message.trim() ? colors.text.highEmphasis.onDark : colors.text.disabled.onLight,
                  opacity: isTyping ? 0.5 : 1,
                  transition: 'background-color 150ms ease',
                }}
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Conversation starters */}
          {!hasMessages && conversationStarters.length > 0 && (
            <nav
              aria-label="Suggested prompts"
              style={{
                display: 'flex',
                gap: spacing.xs,
                overflowX: 'auto',
                paddingBottom: spacing['2xs'],
              }}
            >
              {conversationStarters.map((text, i) => (
                <button
                  key={text}
                  onClick={() => onSendMessage?.(text)}
                  style={{
                    ...typography.label.sm,
                    color: colors.text.lowEmphasis.onLight,
                    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                    borderRadius: 9999,
                    padding: `${spacing['2xs']} ${spacing.sm}`,
                    background: 'transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'background-color 150ms ease',
                  }}
                >
                  {text}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
    )
  }
)

ChatPanel.displayName = 'ChatPanel'
