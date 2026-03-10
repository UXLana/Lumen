'use client'

import React from 'react'

export function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'var(--mtr-text-lowEmphasis, #666)',
            animation: `ob-bounce 1.4s infinite ${i * 0.16}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes ob-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
