'use client'

import React from 'react'
import { AgentAvatar } from './AgentAvatar'
import type { AgentConfig, AgentId } from '@/lib/open-brain/types'

interface MentionAutocompleteProps {
  agents: AgentConfig[]
  query: string
  onSelect: (agentId: AgentId) => void
  onClose: () => void
}

export function MentionAutocomplete({ agents, query, onSelect, onClose }: MentionAutocompleteProps) {
  const filtered = agents.filter(a =>
    a.id.toLowerCase().includes(query.toLowerCase()) ||
    a.shortName.toLowerCase().includes(query.toLowerCase()) ||
    a.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8)

  if (filtered.length === 0) return null

  return (
    <>
      {/* Backdrop to close on click outside */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 99 }}
        onClick={onClose}
      />
      <div
        role="listbox"
        aria-label="Mention an agent"
        style={{
          position: 'absolute',
          bottom: '100%',
          left: 16,
          right: 16,
          maxHeight: 280,
          overflowY: 'auto',
          backgroundColor: 'var(--mtr-surface-light, white)',
          border: '1px solid var(--mtr-border-lowEmphasis, #e0e0e0)',
          borderRadius: 12,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
          padding: 6,
          zIndex: 100,
          marginBottom: 4,
        }}
      >
        <div style={{ padding: '6px 10px', fontSize: 11, fontWeight: 600, color: 'var(--mtr-text-lowEmphasis, #888)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Agents
        </div>
        {filtered.map(agent => (
          <button
            key={agent.id}
            role="option"
            onClick={() => onSelect(agent.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px 10px',
              border: 'none',
              backgroundColor: 'transparent',
              borderRadius: 8,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.1s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.backgroundColor = 'var(--mtr-surface-lightDarker, #f0f0f0)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            <AgentAvatar agent={agent} size="sm" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--mtr-text-highEmphasis, #1a1a1a)' }}>
                {agent.shortName}
              </div>
              <div style={{
                fontSize: 11,
                color: 'var(--mtr-text-lowEmphasis, #888)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {agent.description}
              </div>
            </div>
            <span style={{ fontSize: 11, color: 'var(--mtr-text-lowEmphasis, #aaa)', fontFamily: 'var(--mtr-font-mono, monospace)' }}>
              @{agent.id}
            </span>
          </button>
        ))}
      </div>
    </>
  )
}
