'use client'

import React, { forwardRef, useRef, useCallback } from 'react'
import {
  colors,
  spacing,
  borderRadius,
  typography,
  fontFamilies,
  fontWeights,
  transitionPresets,
} from '../../styles/design-tokens'
import { IconUpload, IconPaperclip, IconImport } from '../Icons'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

export type DropZoneIcon = 'upload' | 'attach' | 'import'
export type DropZoneStatus = 'enabled' | 'active' | 'readOnly' | 'disabled'

export interface DropZoneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  /** Icon variant displayed in the zone */
  icon?: DropZoneIcon
  /** Current visual/interactive status */
  status?: DropZoneStatus
  /** Whether to show mobile-optimized layout (no drag text) */
  mobileDevice?: boolean
  /** Accepted file types (passed to native input) */
  accept?: string
  /** Allow multiple file selection */
  multiple?: boolean
  /** Callback when files are selected (via browse or drop) */
  onFilesSelected?: (files: File[]) => void
  /** Accessible label — defaults to contextual text */
  'aria-label'?: string
}

// =============================================================================
// ICON MAP
// =============================================================================

const iconMap = {
  upload: IconUpload,
  attach: IconPaperclip,
  import: IconImport,
} as const

// =============================================================================
// COMPONENT
// =============================================================================

export const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(
  (
    {
      icon = 'upload',
      status = 'enabled',
      mobileDevice = false,
      accept,
      multiple = true,
      onFilesSelected,
      style,
      className,
      'aria-label': ariaLabel,
      ...rest
    },
    ref
  ) => {
    const [isDragActive, setIsDragActive] = React.useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const isDisabled = status === 'disabled'
    const isReadOnly = status === 'readOnly'
    const isInteractive = !isDisabled && !isReadOnly
    const isActive = status === 'active' || isDragActive

    // --- Hidden Native Input Trigger (from component-rules.md) ---
    const openPicker = useCallback(() => {
      if (!isInteractive) return
      inputRef.current?.click()
    }, [isInteractive])

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? [])
        if (files.length > 0) onFilesSelected?.(files)
        e.currentTarget.value = '' // Allow re-selecting the same files
      },
      [onFilesSelected]
    )

    // --- Drag-and-Drop (from component-rules.md) ---
    const handleDragEnter = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        if (!isInteractive) return
        e.preventDefault()
        e.stopPropagation()
        setIsDragActive(true)
      },
      [isInteractive]
    )

    const handleDragOver = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        if (!isInteractive) return
        e.preventDefault()
        e.stopPropagation()
      },
      [isInteractive]
    )

    const handleDragLeave = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        if (!isInteractive) return
        e.preventDefault()
        e.stopPropagation()
        // relatedTarget guard — only deactivate when leaving the container, not entering a child
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragActive(false)
        }
      },
      [isInteractive]
    )

    const handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        if (!isInteractive) return
        e.preventDefault()
        e.stopPropagation()
        setIsDragActive(false)
        const files = Array.from(e.dataTransfer.files ?? [])
        if (files.length > 0) onFilesSelected?.(files)
      },
      [isInteractive, onFilesSelected]
    )

    // --- Custom Interactive Surface keyboard (from component-rules.md) ---
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isInteractive) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openPicker()
        }
      },
      [isInteractive, openPicker]
    )

    // --- Visual config ---
    const IconComponent = iconMap[icon]

    const borderColor = isActive
      ? colors.brand.default
      : isDisabled
        ? colors.border?.lowEmphasis?.onLight ?? colors.stroke?.light
        : colors.border?.midEmphasis?.onLight ?? colors.stroke?.default

    const bgColor = isActive
      ? colors.selectedHighlight
      : colors.surface?.light ?? colors.surface?.default

    const textColor = isDisabled
      ? colors.text?.disabled?.onLight ?? colors.disabled?.text
      : colors.text?.highEmphasis?.onLight ?? '#333'

    const secondaryTextColor = isDisabled
      ? colors.text?.disabled?.onLight ?? colors.disabled?.text
      : colors.text?.lowEmphasis?.onLight ?? '#666'

    return (
      <>
        {/* Hidden native file input */}
        <input
          ref={inputRef}
          type="file"
          tabIndex={-1}
          aria-hidden="true"
          accept={accept}
          multiple={multiple}
          disabled={isDisabled}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />

        {/* Interactive Surface (Template D pattern) */}
        <div
          ref={ref}
          role="button"
          tabIndex={isInteractive ? 0 : -1}
          aria-disabled={!isInteractive || undefined}
          aria-label={ariaLabel ?? (mobileDevice ? 'Choose files' : 'Drag and drop or browse files')}
          className={className}
          onClick={isInteractive ? openPicker : undefined}
          onKeyDown={handleKeyDown}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.xs,
            padding: spacing.xl,
            borderRadius: borderRadius.lg,
            border: `2px dashed ${borderColor}`,
            backgroundColor: bgColor,
            cursor: isDisabled ? 'not-allowed' : isReadOnly ? 'default' : 'pointer',
            opacity: isDisabled ? 0.6 : 1,
            outline: 'none',
            transition: `border-color ${transitionPresets.fast}, background-color ${transitionPresets.fast}`,
            minHeight: '120px',
            ...style,
          }}
          {...rest}
        >
          <IconComponent
            size="lg"
            style={{
              color: isActive ? colors.brand.default : secondaryTextColor,
            }}
          />

          {isActive ? (
            <span
              style={{
                ...typography.label.md,
                fontFamily: fontFamilies.body,
                color: colors.brand.default,
              }}
            >
              Drop files
            </span>
          ) : mobileDevice ? (
            <span
              style={{
                ...typography.label.md,
                fontFamily: fontFamilies.body,
                color: textColor,
              }}
            >
              Choose files
            </span>
          ) : (
            <span
              style={{
                ...typography.body.sm,
                fontFamily: fontFamilies.body,
                color: secondaryTextColor,
                textAlign: 'center',
              }}
            >
              Drag and drop or{' '}
              <span
                style={{
                  color: isInteractive ? colors.brand.default : secondaryTextColor,
                  fontWeight: fontWeights.medium,
                  textDecoration: isInteractive ? 'underline' : 'none',
                }}
              >
                browse files
              </span>
            </span>
          )}
        </div>
      </>
    )
  }
)

DropZone.displayName = 'DropZone'
