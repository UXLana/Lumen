'use client'

import React, { useRef, useEffect } from 'react'
import { MessageBubble } from './MessageBubble'
import type { Message, AgentConfig } from '@/lib/open-brain/types'

interface MessageListProps {
  messages: Message[]
  agents: AgentConfig[]
  isLoading?: boolean
}

export function MessageList({ messages, agents, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const agentMap = Object.fromEntries(agents.map(a => [a.id, a]))

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, messages[messages.length - 1]?.content])

  if (messages.length === 0 && !isLoading) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        color: 'var(--mtr-text-lowEmphasis, #888)',
        gap: 12,
      }}>
        <div style={{ fontSize: 48 }}>{'\u{1F9E0}'}</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--mtr-text-highEmphasis, #1a1a1a)' }}>
          Open Brain
        </div>
        <div style={{ fontSize: 14, textAlign: 'center', maxWidth: 400, lineHeight: 1.5 }}>
          Send a message to start a conversation with your agents.
          They can collaborate, swarm on tasks, and keep you updated.
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        paddingTop: 16,
        paddingBottom: 16,
      }}
    >
      {messages.map(msg => (
        <MessageBubble
          key={msg.id}
          message={msg}
          agent={msg.agentId ? agentMap[msg.agentId] : undefined}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
