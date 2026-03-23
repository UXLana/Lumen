'use client'

import React, { forwardRef } from 'react'
import {
  colors,
  spacing,
  typography,
  borderRadiusSemantics,
} from '@/styles/design-tokens'

export interface ChatSearchTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  accentColor?: string
  agentName?: string
  placeholder?: string
}

export const ChatSearchTrigger = forwardRef<HTMLButtonElement, ChatSearchTriggerProps>(
  (
    {
      accentColor = colors.brand.default,
      agentName = 'Assistant',
      placeholder,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        aria-label={`Open ${agentName} search`}
        style={{
          ...typography.body.sm,
          width: '100%',
          maxWidth: 576,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          padding: `${spacing.xs} ${spacing.md}`,
          borderRadius: 9999,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          backgroundColor: colors.surface.light,
          color: colors.text.lowEmphasis.onLight,
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          ...style,
        }}
        {...props}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>{placeholder ?? `Search or ask ${agentName}...`}</span>
      </button>
    )
  }
)

ChatSearchTrigger.displayName = 'ChatSearchTrigger'
