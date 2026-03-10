'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { MentionAutocomplete } from './MentionAutocomplete'
import type { AgentConfig, AgentId } from '@/lib/open-brain/types'

interface MessageInputProps {
  onSend: (content: string) => void
  disabled?: boolean
  agents: AgentConfig[]
  placeholder?: string
}

export function MessageInput({ onSend, disabled, agents, placeholder }: MessageInputProps) {
  const [value, setValue] = useState('')
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    setShowMentions(false)
  }, [value, disabled, onSend])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    // Check for @ mention trigger
    const cursorPos = e.target.selectionStart || 0
    const textBeforeCursor = newValue.slice(0, cursorPos)
    const atMatch = textBeforeCursor.match(/@([\w-]*)$/)

    if (atMatch) {
      setShowMentions(true)
      setMentionQuery(atMatch[1])
    } else {
      setShowMentions(false)
    }
  }, [])

  const handleMentionSelect = useCallback((agentId: AgentId) => {
    const cursorPos = textareaRef.current?.selectionStart || 0
    const textBeforeCursor = value.slice(0, cursorPos)
    const atIndex = textBeforeCursor.lastIndexOf('@')

    if (atIndex >= 0) {
      const before = value.slice(0, atIndex)
      const after = value.slice(cursorPos)
      setValue(`${before}@${agentId} ${after}`)
    }

    setShowMentions(false)
    textareaRef.current?.focus()
  }, [value])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 160) + 'px'
    }
  }, [value])

  return (
    <div style={{
      position: 'relative',
      padding: '12px 16px',
      borderTop: '1px solid var(--mtr-border-lowEmphasis, #e5e5e5)',
      backgroundColor: 'var(--mtr-surface-light, #fff)',
    }}>
      {showMentions && (
        <MentionAutocomplete
          agents={agents}
          query={mentionQuery}
          onSelect={handleMentionSelect}
          onClose={() => setShowMentions(false)}
        />
      )}

      <div style={{
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end',
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Send a message... (@ to mention an agent)'}
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            border: '1px solid var(--mtr-border-lowEmphasis, #e0e0e0)',
            borderRadius: 12,
            padding: '10px 14px',
            fontSize: 14,
            fontFamily: 'inherit',
            lineHeight: 1.5,
            outline: 'none',
            backgroundColor: 'var(--mtr-surface-light, #fff)',
            color: 'var(--mtr-text-highEmphasis, #1a1a1a)',
            maxHeight: 160,
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--mtr-brand-default, #005151)' }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--mtr-border-lowEmphasis, #e0e0e0)' }}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: 'none',
            backgroundColor: value.trim()
              ? 'var(--mtr-brand-default, #005151)'
              : 'var(--mtr-surface-lightDarker, #e5e5e5)',
            color: value.trim() ? 'white' : 'var(--mtr-text-lowEmphasis, #999)',
            cursor: value.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            transition: 'background-color 0.15s',
            flexShrink: 0,
          }}
        >
          {'\u2191'}
        </button>
      </div>
    </div>
  )
}
