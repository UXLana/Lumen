'use client'

import React, { forwardRef } from 'react'
import { colors, shadowSemantics, zIndex } from '@/styles/design-tokens'

const FAB_FOCUS_STYLE = `
  .chat-fab:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`

export interface ChatFabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  accentColor?: string
}

export const ChatFab = forwardRef<HTMLButtonElement, ChatFabProps>(
  ({ accentColor = colors.brand.default, style, ...props }, ref) => {
    return (
      <>
      <style>{FAB_FOCUS_STYLE}</style>
      <button
        ref={ref}
        className="chat-fab"
        aria-label="Open chat"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: zIndex.sticky,
          width: 56,
          height: 56,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: accentColor,
          boxShadow: shadowSemantics.dropdown,
          transition: 'transform 150ms ease',
          ...style,
        }}
        {...props}
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.text.highEmphasis.onDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
      </>
    )
  }
)

ChatFab.displayName = 'ChatFab'
