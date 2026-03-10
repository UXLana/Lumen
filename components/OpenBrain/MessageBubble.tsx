'use client'

import React from 'react'
import { AgentAvatar } from './AgentAvatar'
import { TypingIndicator } from './TypingIndicator'
import type { Message, AgentConfig } from '@/lib/open-brain/types'

interface MessageBubbleProps {
  message: Message
  agent?: AgentConfig
}

export function MessageBubble({ message, agent }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'
  const isStreaming = message.status === 'streaming'
  const isError = message.status === 'error'

  if (isSystem) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 16px',
      }}>
        <span style={{
          fontSize: 12,
          color: 'var(--mtr-text-lowEmphasis, #888)',
          fontStyle: 'italic',
          textAlign: 'center',
        }}>
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        padding: '8px 16px',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar */}
      {isUser ? (
        <div
          style={{
            width: 36,
            height: 36,
            minWidth: 36,
            borderRadius: '50%',
            background: 'var(--mtr-brand-default, #005151)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          L
        </div>
      ) : agent ? (
        <AgentAvatar agent={agent} size="md" />
      ) : null}

      {/* Content */}
      <div style={{ maxWidth: '70%', minWidth: 0 }}>
        {/* Name + Time */}
        <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'baseline',
          marginBottom: 4,
          flexDirection: isUser ? 'row-reverse' : 'row',
        }}>
          <span style={{
            fontSize: 13,
            fontWeight: 600,
            color: isUser
              ? 'var(--mtr-text-highEmphasis, #1a1a1a)'
              : agent?.avatarColor || 'var(--mtr-text-highEmphasis, #1a1a1a)',
          }}>
            {isUser ? 'You' : agent?.shortName || 'Agent'}
          </span>
          <span style={{
            fontSize: 11,
            color: 'var(--mtr-text-lowEmphasis, #888)',
          }}>
            {formatTime(message.createdAt)}
          </span>
        </div>

        {/* Bubble */}
        <div style={{
          padding: '10px 14px',
          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          backgroundColor: isUser
            ? 'var(--mtr-brand-default, #005151)'
            : isError
              ? '#FEF2F2'
              : 'var(--mtr-surface-lightDarker, #f5f5f5)',
          color: isUser
            ? 'white'
            : isError
              ? '#991B1B'
              : 'var(--mtr-text-highEmphasis, #1a1a1a)',
          fontSize: 14,
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          borderLeft: !isUser && agent ? `3px solid ${agent.avatarColor}` : undefined,
        }}>
          {isStreaming && !message.content ? (
            <TypingIndicator />
          ) : (
            <MessageContent content={message.content} />
          )}
          {isStreaming && message.content && (
            <span style={{ display: 'inline-block', width: 6, height: 14, backgroundColor: 'currentColor', animation: 'ob-blink 1s infinite', marginLeft: 2, verticalAlign: 'middle', borderRadius: 1 }} />
          )}
        </div>

        {/* Token usage */}
        {message.tokenUsage && (
          <div style={{ fontSize: 10, color: 'var(--mtr-text-lowEmphasis, #aaa)', marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>
            {message.tokenUsage.inputTokens + message.tokenUsage.outputTokens} tokens
          </div>
        )}
      </div>

      <style>{`
        @keyframes ob-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function MessageContent({ content }: { content: string }) {
  // Simple markdown: bold, italic, code blocks, inline code
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3).replace(/^\w+\n/, '')
          return (
            <pre key={i} style={{
              backgroundColor: 'rgba(0,0,0,0.06)',
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 13,
              fontFamily: 'var(--mtr-font-mono, monospace)',
              overflowX: 'auto',
              margin: '8px 0',
              whiteSpace: 'pre-wrap',
            }}>
              {code}
            </pre>
          )
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} style={{
              backgroundColor: 'rgba(0,0,0,0.06)',
              padding: '2px 5px',
              borderRadius: 3,
              fontSize: 13,
              fontFamily: 'var(--mtr-font-mono, monospace)',
            }}>
              {part.slice(1, -1)}
            </code>
          )
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  } catch {
    return ''
  }
}
