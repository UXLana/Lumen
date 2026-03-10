'use client'

import React from 'react'
import type { AgentConfig } from '@/lib/open-brain/types'

interface AgentAvatarProps {
  agent: Pick<AgentConfig, 'shortName' | 'avatarColor' | 'avatarEmoji'>
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = { sm: 28, md: 36, lg: 48 }
const FONT_SIZES = { sm: 14, md: 18, lg: 24 }

export function AgentAvatar({ agent, size = 'md' }: AgentAvatarProps) {
  const px = SIZES[size]

  return (
    <div
      style={{
        width: px,
        height: px,
        minWidth: px,
        borderRadius: '50%',
        backgroundColor: agent.avatarColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: FONT_SIZES[size],
        lineHeight: 1,
        userSelect: 'none',
      }}
      title={agent.shortName}
      aria-label={agent.shortName}
    >
      {agent.avatarEmoji}
    </div>
  )
}
