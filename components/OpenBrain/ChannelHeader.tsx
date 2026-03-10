'use client'

import React from 'react'
import { AgentAvatar } from './AgentAvatar'
import type { Channel, AgentConfig } from '@/lib/open-brain/types'

interface ChannelHeaderProps {
  channel: Channel
  agents: AgentConfig[]
  onMenuToggle?: () => void
}

export function ChannelHeader({ channel, agents, onMenuToggle }: ChannelHeaderProps) {
  const memberAgents = agents.filter(a => channel.memberAgentIds.includes(a.id))

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      borderBottom: '1px solid var(--mtr-border-lowEmphasis, #e5e5e5)',
      backgroundColor: 'var(--mtr-surface-light, #fff)',
      minHeight: 56,
    }}>
      {/* Mobile hamburger */}
      {onMenuToggle && (
        <button
          onClick={onMenuToggle}
          aria-label="Open channels"
          className="ob-mobile-menu"
          style={{
            border: 'none',
            background: 'none',
            fontSize: 20,
            cursor: 'pointer',
            padding: 4,
            color: 'var(--mtr-text-highEmphasis, #1a1a1a)',
            display: 'none',
          }}
        >
          {'\u2630'}
        </button>
      )}

      {/* Channel icon / avatar */}
      {channel.type === 'dm' && memberAgents[0] ? (
        <AgentAvatar agent={memberAgents[0]} size="md" />
      ) : (
        <span style={{ fontSize: 20, width: 36, textAlign: 'center' }}>
          {channel.icon || '#'}
        </span>
      )}

      {/* Channel info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--mtr-text-highEmphasis, #1a1a1a)',
        }}>
          {channel.type === 'dm' ? memberAgents[0]?.name || channel.name : `#${channel.name}`}
        </div>
        {channel.description && (
          <div style={{
            fontSize: 12,
            color: 'var(--mtr-text-lowEmphasis, #888)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {channel.description}
          </div>
        )}
      </div>

      {/* Member avatars (for shared channels) */}
      {channel.type === 'shared' && memberAgents.length > 0 && (
        <div style={{ display: 'flex', marginLeft: 'auto' }}>
          {memberAgents.slice(0, 5).map((agent, i) => (
            <div
              key={agent.id}
              style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i }}
            >
              <AgentAvatar agent={agent} size="sm" />
            </div>
          ))}
          {memberAgents.length > 5 && (
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: 'var(--mtr-surface-lightDarker, #e5e5e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 600,
              marginLeft: -8,
              color: 'var(--mtr-text-lowEmphasis, #888)',
            }}>
              +{memberAgents.length - 5}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
