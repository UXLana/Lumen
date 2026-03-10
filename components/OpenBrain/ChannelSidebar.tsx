'use client'

import React from 'react'
import { ChannelSidebarItem } from './ChannelSidebarItem'
import type { Channel, AgentConfig, ChannelId } from '@/lib/open-brain/types'

interface ChannelSidebarProps {
  channels: (Channel & { unreadCount?: number; hasAttention?: boolean })[]
  agents: AgentConfig[]
  activeChannelId: ChannelId
  onChannelSelect: (channelId: ChannelId) => void
  onClose?: () => void
}

export function ChannelSidebar({ channels, agents, activeChannelId, onChannelSelect, onClose }: ChannelSidebarProps) {
  const agentMap = Object.fromEntries(agents.map(a => [a.id, a]))
  const shared = channels.filter(c => c.type === 'shared')
  const dms = channels.filter(c => c.type === 'dm')

  return (
    <nav
      aria-label="Channels"
      style={{
        width: 280,
        height: '100%',
        backgroundColor: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '20px 16px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{'\u{1F9E0}'}</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>
            Open Brain
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            style={{
              border: 'none',
              background: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 20,
              cursor: 'pointer',
              padding: 4,
              display: 'none',
            }}
            className="ob-mobile-close"
          >
            {'\u2715'}
          </button>
        )}
      </div>

      {/* Channel lists */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {/* Shared channels */}
        <div style={{
          padding: '12px 12px 6px',
          fontSize: 11,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
          Channels
        </div>
        {shared.map(ch => (
          <ChannelSidebarItem
            key={ch.id}
            channel={ch}
            isActive={ch.id === activeChannelId}
            onClick={() => {
              onChannelSelect(ch.id)
              onClose?.()
            }}
          />
        ))}

        {/* DM channels */}
        <div style={{
          padding: '16px 12px 6px',
          fontSize: 11,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
          Direct Messages
        </div>
        {dms.map(ch => (
          <ChannelSidebarItem
            key={ch.id}
            channel={ch}
            agent={ch.agentId ? agentMap[ch.agentId] : undefined}
            isActive={ch.id === activeChannelId}
            onClick={() => {
              onChannelSelect(ch.id)
              onClose?.()
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
      }}>
        13 agents connected
      </div>
    </nav>
  )
}
