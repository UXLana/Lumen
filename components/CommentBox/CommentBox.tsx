'use client'

import React, { forwardRef, useState, useRef, useCallback, useEffect } from 'react'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadius,
  transitionPresets,
} from '../../styles/design-tokens'

export interface CommentBoxProps {
  /** Placeholder text */
  placeholder?: string
  /** Maximum character count */
  maxLength?: number
  /** Called when the user submits a note */
  onSubmit?: (text: string) => void
  /** Called when the user clicks the attach button */
  onAttach?: () => void
  /** Whether to show the attach button. Default: true */
  showAttach?: boolean
  /** Whether the component is disabled */
  disabled?: boolean
  /** Accepted file types hint shown in tooltip */
  acceptedFiles?: string
  /** Additional CSS styles on the outer container */
  style?: React.CSSProperties
}

export const CommentBox = forwardRef<HTMLTextAreaElement, CommentBoxProps>(
  (
    {
      placeholder = 'Add a note...',
      maxLength = 250,
      onSubmit,
      onAttach,
      showAttach = true,
      disabled = false,
      acceptedFiles = 'PDF, JPG, PNG',
      style,
    },
    ref,
  ) => {
    const [value, setValue] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef

    const hasContent = value.trim().length > 0
    const atLimit = value.length >= maxLength
    const nearLimit = value.length >= maxLength * 0.8

    // Auto-resize textarea
    const autoResize = useCallback(() => {
      const el = textareaRef.current
      if (!el) return
      el.style.height = 'auto'
      const maxHeight = 140 // ~5 rows
      el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
    }, [textareaRef])

    useEffect(() => {
      autoResize()
    }, [value, autoResize])

    const handleSubmit = useCallback(() => {
      if (!hasContent || disabled) return
      onSubmit?.(value.trim())
      setValue('')
    }, [value, hasContent, disabled, onSubmit])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
          e.preventDefault()
          handleSubmit()
        }
      },
      [handleSubmit],
    )

    const borderColor = isFocused
      ? colors.border.midEmphasis.onLight
      : colors.border.lowEmphasis.onLight

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          ...style,
        }}
      >
        {/* Pill container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            border: `1px solid ${borderColor}`,
            borderRadius: borderRadius.lg,
            backgroundColor: disabled ? colors.surface.lightDarker : colors.surface.light,
            transition: `border-color ${transitionPresets.default}, box-shadow ${transitionPresets.default}`,
            boxShadow: isFocused ? `0 0 0 1px ${colors.border.midEmphasis.onLight}` : 'none',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
          }}
          onClick={() => {
            if (!disabled) textareaRef.current?.focus()
          }}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                setValue(e.target.value)
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={2}
            aria-label={placeholder}
            aria-describedby={nearLimit ? 'comment-box-counter' : undefined}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: `${spacing.md} ${spacing.lg}`,
              paddingBottom: spacing['2xs'],
              fontFamily: fontFamilies.body,
              fontSize: typography.body.md.fontSize,
              fontWeight: fontWeights.regular,
              lineHeight: '1.5',
              color: colors.text.highEmphasis.onLight,
              backgroundColor: 'transparent',
              boxSizing: 'border-box',
              overflowY: 'hidden',
            }}
          />

          {/* Bottom bar: attach left, counter + submit right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `0 ${spacing.sm} ${spacing.sm}`,
            }}
          >
            {/* Left: attach */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              {showAttach && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAttach?.()
                  }}
                  disabled={disabled}
                  title={`Attach file (${acceptedFiles})`}
                  aria-label={`Attach file (${acceptedFiles})`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    border: 'none',
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                    color: colors.text.lowEmphasis.onLight,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: `background-color ${transitionPresets.fast}, color ${transitionPresets.fast}`,
                    padding: 0,
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!disabled) {
                      e.currentTarget.style.backgroundColor = colors.hover.onLight
                      e.currentTarget.style.color = colors.text.highEmphasis.onLight
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = colors.text.lowEmphasis.onLight
                  }}
                >
                  {/* Paperclip icon */}
                  <svg width={18} height={18} viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path
                      d="M15.25 8.35l-6.5 6.5a3.89 3.89 0 01-5.5-5.5l6.5-6.5a2.59 2.59 0 013.67 3.67l-6.5 6.49a1.3 1.3 0 01-1.84-1.83l6-5.99"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Right: counter (only near limit) + submit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              {/* Character counter — only shows when approaching limit */}
              {nearLimit && (
                <span
                  id="comment-box-counter"
                  style={{
                    fontFamily: fontFamilies.mono,
                    fontSize: typography.body.xs.fontSize,
                    color: atLimit ? colors.status.important : colors.text.disabled.onLight,
                    transition: `color ${transitionPresets.fast}`,
                  }}
                  aria-live="polite"
                >
                  {value.length}/{maxLength}
                </span>
              )}

              {/* Submit — circle with arrow-up */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSubmit()
                }}
                disabled={disabled || !hasContent}
                title="Add note (⌘+Enter)"
                aria-label="Add note"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  border: 'none',
                  borderRadius: '50%',
                  backgroundColor: hasContent && !disabled ? colors.brand.default : colors.surface.lightDarker,
                  color: hasContent && !disabled ? '#FFFFFF' : colors.text.disabled.onLight,
                  cursor: hasContent && !disabled ? 'pointer' : 'default',
                  transition: `background-color ${transitionPresets.default}, color ${transitionPresets.default}`,
                  padding: 0,
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (hasContent && !disabled) e.currentTarget.style.backgroundColor = colors.brand.darker
                }}
                onMouseLeave={(e) => {
                  if (hasContent && !disabled) e.currentTarget.style.backgroundColor = colors.brand.default
                }}
              >
                {/* Arrow-up icon */}
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 12V4M4.5 7.5L8 4l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

CommentBox.displayName = 'CommentBox'
