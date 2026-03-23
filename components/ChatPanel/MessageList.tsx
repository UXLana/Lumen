'use client'

import React from 'react'
import {
  colors,
  spacing,
  typography,
  borderRadiusSemantics,
} from '@/styles/design-tokens'
import type { ChatMessage, ChatAction } from './types'
import { ComponentRenderer } from './ComponentRenderer'

// ─── Props ───────────────────────────────────────────────────────────────────

export interface MessageListProps {
  messages: ChatMessage[]
  isTyping: boolean
  agentName: string
  accentColor: string
  isExpanded: boolean
  maxContentWidth: number
  onActionClick?: (action: ChatAction) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MessageList({
  messages,
  isTyping,
  agentName,
  accentColor,
  isExpanded,
  maxContentWidth,
  onActionClick,
}: MessageListProps) {
  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
        padding: `${spacing.md} 0`,
        maxWidth: isExpanded ? maxContentWidth : undefined,
        width: '100%',
        margin: '0 auto',
      }}
    >
      {messages.map((msg) => (
        <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
          {msg.role === 'user' ? (
            <div
              style={{
                ...typography.body.sm,
                backgroundColor: accentColor,
                color: colors.text.highEmphasis.onDark,
                borderRadius: '16px 16px 4px 16px',
                padding: `${spacing.xs} ${spacing.md}`,
                maxWidth: '85%',
              }}
            >
              {msg.content}
            </div>
          ) : (
            <div style={{ maxWidth: '100%', width: '100%', display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              {msg.structured?.text && (
                <div style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight }}>
                  {msg.structured.text}
                </div>
              )}
              {msg.structured?.components?.map((comp, ci) => (
                <ComponentRenderer key={ci} component={comp} accentColor={accentColor} />
              ))}
              {msg.structured?.actions && msg.structured.actions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing['2xs'] }}>
                  {msg.structured.actions.map((act) => (
                    <button
                      key={act.label}
                      onClick={() => onActionClick?.(act)}
                      style={{
                        ...typography.label.sm,
                        color: accentColor,
                        border: `1px solid ${accentColor}`,
                        borderRadius: borderRadiusSemantics.button,
                        padding: `${spacing['2xs']} ${spacing.sm}`,
                        background: 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing['2xs'],
                        transition: 'background-color 150ms ease',
                      }}
                    >
                      {act.label}
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <div style={{ display: 'flex', gap: spacing['2xs'], padding: `${spacing.xs} ${spacing.sm}` }} aria-hidden="true">
            {[0, 1, 2].map((d) => (
              <div
                key={d}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: accentColor,
                  animation: `chatDotPulse 1.2s ${d * 0.2}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
          <span
            role="status"
            style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}
          >
            {agentName} is typing...
          </span>
        </div>
      )}
    </div>
  )
}

MessageList.displayName = 'MessageList'
