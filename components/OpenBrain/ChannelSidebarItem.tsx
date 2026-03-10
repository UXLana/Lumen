'use client'

import React from 'react'
import { AgentAvatar } from './AgentAvatar'
import type { Channel, AgentConfig } from '@/lib/open-brain/types'

interface ChannelSidebarItemProps {
  channel: Channel & { unreadCount?: number; hasAttention?: boolean }
  agent?: AgentConfig
  isActive: boolean
  onClick: () => void
}

export function ChannelSidebarItem({ channel, agent, isActive, onClick }: ChannelSidebarItemProps) {
  const isDM = channel.type === 'dm'

  return (
    <button
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '7px 12px',
        border: 'none',
        borderRadius: 8,
        backgroundColor: isActive
          ? 'rgba(255,255,255,0.12)'
          : 'transparent',
        color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: 14,
        transition: 'background-color 0.1s',
      }}
      onMouseEnter={e => {
        if (!isActive) (e.currentTarget).style.backgroundColor = 'rgba(255,255,255,0.06)'
      }}
      onMouseLeave={e => {
        if (!isActive) (e.currentTarget).style.backgroundColor = 'transparent'
      }}
    >
      {isDM && agent ? (
        <AgentAvatar agent={agent} size="sm" />
      ) : (
        <span style={{ width: 28, textAlign: 'center', fontSize: 16 }}>
          {channel.icon || '#'}
        </span>
      )}

      <span style={{
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontWeight: isActive || (channel.unreadCount && channel.unreadCount > 0) ? 600 : 400,
      }}>
        {channel.name}
      </span>

      {channel.unreadCount != null && channel.unreadCount > 0 && (
        <span style={{
          minWidth: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: channel.hasAttention ? '#EF4444' : 'rgba(255,255,255,0.25)',
          color: 'white',
          fontSize: 11,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 6px',
        }}>
          {channel.unreadCount}
        </span>
      )}
    </button>
  )
}
