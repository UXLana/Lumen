'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { ChannelSidebar } from './ChannelSidebar'
import { ChannelHeader } from './ChannelHeader'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import type { Channel, Message, AgentConfig, ChannelId } from '@/lib/open-brain/types'

export function OpenBrainShell() {
  const [channels, setChannels] = useState<(Channel & { unreadCount?: number; hasAttention?: boolean })[]>([])
  const [agents, setAgents] = useState<AgentConfig[]>([])
  const [activeChannelId, setActiveChannelId] = useState<ChannelId>('shared:general')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Load channels and agents on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/open-brain/channels').then(r => r.json()),
      fetch('/api/open-brain/agents').then(r => r.json()),
    ]).then(([channelData, agentData]) => {
      setChannels(channelData)
      setAgents(agentData)
      setIsLoading(false)
    }).catch(console.error)
  }, [])

  // Load messages when channel changes
  useEffect(() => {
    if (!activeChannelId) return
    setIsLoading(true)
    fetch(`/api/open-brain/channels/${encodeURIComponent(activeChannelId)}`)
      .then(r => r.json())
      .then(data => {
        setMessages(data.messages || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [activeChannelId])

  // SSE connection for real-time updates
  useEffect(() => {
    const es = new EventSource('/api/open-brain/stream')
    eventSourceRef.current = es

    es.addEventListener('message:new', (e) => {
      const event = JSON.parse(e.data)
      const msg = event.data as Message
      if (msg.channelId === activeChannelId) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === msg.id)) return prev
          return [...prev, msg]
        })
      }
      // Update unread for other channels
      if (msg.channelId !== activeChannelId) {
        setChannels(prev => prev.map(ch =>
          ch.id === msg.channelId
            ? { ...ch, unreadCount: (ch.unreadCount || 0) + 1 }
            : ch
        ))
      }
    })

    es.addEventListener('message:stream-chunk', (e) => {
      const event = JSON.parse(e.data)
      const { messageId, token } = event.data as { messageId: string; token: string }
      setMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, content: m.content + token, status: 'streaming' as const } : m
      ))
    })

    es.addEventListener('message:complete', (e) => {
      const event = JSON.parse(e.data)
      const { messageId, content } = event.data as { messageId: string; content: string }
      setMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, content, status: 'complete' as const } : m
      ))
      setIsSending(false)
    })

    es.addEventListener('error', () => {
      setIsSending(false)
    })

    return () => es.close()
  }, [activeChannelId])

  const handleSend = useCallback(async (content: string) => {
    setIsSending(true)

    try {
      // Stream the chat response
      const response = await fetch('/api/open-brain/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: activeChannelId, content }),
      })

      if (!response.ok) {
        setIsSending(false)
        return
      }

      // The response is SSE — read it to keep the connection alive
      const reader = response.body?.getReader()
      if (reader) {
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          // Events are handled by the global SSE connection
          const text = decoder.decode(value)
          if (text.includes('"done":true')) {
            setIsSending(false)
          }
        }
      }
    } catch {
      setIsSending(false)
    }
  }, [activeChannelId])

  const handleChannelSelect = useCallback((channelId: ChannelId) => {
    setActiveChannelId(channelId)
    // Clear unread
    setChannels(prev => prev.map(ch =>
      ch.id === channelId ? { ...ch, unreadCount: 0, hasAttention: false } : ch
    ))
    setSidebarOpen(false)
  }, [])

  const activeChannel = channels.find(c => c.id === activeChannelId)

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      fontFamily: 'var(--font-dm-sans, -apple-system, BlinkMacSystemFont, sans-serif)',
    }}>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: sidebarOpen ? 'fixed' : undefined,
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 50,
          transform: sidebarOpen ? undefined : undefined,
        }}
        className="ob-sidebar"
      >
        <ChannelSidebar
          channels={channels}
          agents={agents}
          activeChannelId={activeChannelId}
          onChannelSelect={handleChannelSelect}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main area */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        backgroundColor: 'var(--mtr-surface-light, #fff)',
      }}>
        {activeChannel && (
          <ChannelHeader
            channel={activeChannel}
            agents={agents}
            onMenuToggle={() => setSidebarOpen(true)}
          />
        )}

        <MessageList
          messages={messages}
          agents={agents}
          isLoading={isLoading}
        />

        <MessageInput
          onSend={handleSend}
          disabled={isSending}
          agents={agents}
          placeholder={
            activeChannel?.type === 'dm'
              ? `Message ${activeChannel.name}...`
              : `Message #${activeChannel?.name || 'general'}... (@ to mention an agent)`
          }
        />
      </main>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .ob-sidebar {
            display: ${sidebarOpen ? 'block' : 'none'} !important;
            position: fixed !important;
            z-index: 50 !important;
          }
          .ob-mobile-menu {
            display: block !important;
          }
          .ob-mobile-close {
            display: block !important;
          }
        }
      `}</style>
    </div>
  )
}
