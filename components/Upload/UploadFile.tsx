'use client'

import React, { forwardRef } from 'react'
import {
  colors,
  spacing,
  borderRadius,
  typography,
  fontFamilies,
  fontWeights,
  transitionPresets,
} from '@/styles/design-tokens'
import { IconX, IconRefresh, IconAlertCircle } from '@/components/Icons'
import { ProgressBar } from '@/components/ProgressBar'
import { UploadIcon } from './UploadIcon'
import type { UploadIconType } from './UploadIcon'

// =============================================================================
// TYPES & CONTRACTS (Collection Rendering pattern)
// =============================================================================

export type UploadFileStatus =
  | 'added'
  | 'queued'
  | 'uploading'
  | 'uploadingIndeterminate'
  | 'done'
  | 'disabled'
  | 'error'

export interface UploadFileItem {
  /** Stable unique identifier — never use array index */
  id: string
  /** File name */
  name: string
  /** File size display string */
  size?: string
  /** Upload status */
  status: UploadFileStatus
  /** Upload progress (0–100, used when status is 'uploading') */
  progress?: number
  /** Error message (used when status is 'error') */
  errorMessage?: string
  /** File type icon to display */
  iconType?: UploadIconType
  /** Thumbnail URL (for image files) */
  thumbnailSrc?: string
}

export interface UploadFileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** File item data */
  item: UploadFileItem
  /** Whether to show a top divider */
  divider?: boolean
  /** Callback to remove/cancel this file */
  onRemove?: (id: string) => void
  /** Callback to retry a failed upload */
  onRetry?: (id: string) => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export const UploadFile = forwardRef<HTMLDivElement, UploadFileProps>(
  ({ item, divider = true, onRemove, onRetry, style, ...rest }, ref) => {
    const {
      id,
      name,
      size,
      status,
      progress = 0,
      errorMessage,
      iconType = 'file',
      thumbnailSrc,
    } = item

    const isDisabled = status === 'disabled'
    const isError = status === 'error'
    const isUploading = status === 'uploading' || status === 'uploadingIndeterminate'
    const isDone = status === 'done'

    const textColor = isDisabled
      ? colors.text?.disabled?.onLight ?? colors.disabled?.text
      : colors.text?.highEmphasis?.onLight ?? '#333'

    const secondaryTextColor = isDisabled
      ? colors.text?.disabled?.onLight ?? colors.disabled?.text
      : colors.text?.lowEmphasis?.onLight ?? '#666'

    const errorColor = colors.status?.important ?? '#DC0C22'

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.xs,
          padding: `${spacing.sm} 0`,
          borderTop: divider ? `1px solid ${colors.border?.lowEmphasis?.onLight ?? colors.stroke?.light}` : 'none',
          opacity: isDisabled ? 0.6 : 1,
          ...style,
        }}
        {...rest}
      >
        {/* Row: icon + info + actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}
        >
          {/* File icon */}
          <UploadIcon
            type={iconType}
            state={isDisabled ? 'disabled' : isError ? 'lowEmphasis' : 'default'}
            thumbnailSrc={thumbnailSrc}
            thumbnailAlt={name}
          />

          {/* File info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                ...typography.body.sm,
                fontFamily: fontFamilies.body,
                fontWeight: fontWeights.medium,
                color: textColor,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </div>

            {size && !isError && (
              <div
                style={{
                  ...typography.body.xs,
                  fontFamily: fontFamilies.body,
                  color: secondaryTextColor,
                }}
              >
                {size}
              </div>
            )}

            {/* Error message — kept visible for error recovery (Collection Rendering pattern) */}
            {isError && errorMessage && (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing['2xs'],
                  ...typography.body.xs,
                  fontFamily: fontFamilies.body,
                  color: errorColor,
                }}
              >
                <IconAlertCircle size="xs" style={{ color: errorColor, flexShrink: 0 }} />
                {errorMessage}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2xs'], flexShrink: 0 }}>
            {/* Retry button — error recovery (Collection Rendering pattern) */}
            {isError && onRetry && (
              <button
                type="button"
                onClick={() => onRetry(id)}
                aria-label={`Retry upload for ${name}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  padding: 0,
                  border: 'none',
                  borderRadius: borderRadius.sm,
                  backgroundColor: 'transparent',
                  color: colors.brand.default,
                  cursor: 'pointer',
                  transition: `background-color ${transitionPresets.fast}`,
                }}
              >
                <IconRefresh size="sm" />
              </button>
            )}

            {/* Remove/cancel button */}
            {!isDisabled && onRemove && (
              <button
                type="button"
                onClick={() => onRemove(id)}
                aria-label={`Remove ${name}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  padding: 0,
                  border: 'none',
                  borderRadius: borderRadius.sm,
                  backgroundColor: 'transparent',
                  color: secondaryTextColor,
                  cursor: 'pointer',
                  transition: `background-color ${transitionPresets.fast}`,
                }}
              >
                <IconX size="sm" />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {isUploading && (
          <ProgressBar
            value={progress}
            indeterminate={status === 'uploadingIndeterminate'}
            size="sm"
            aria-label={`Upload progress for ${name}`}
          />
        )}

        {isDone && (
          <ProgressBar
            value={100}
            size="sm"
            variant="success"
            aria-label={`Upload complete for ${name}`}
          />
        )}
      </div>
    )
  }
)

UploadFile.displayName = 'UploadFile'

// =============================================================================
// UPLOAD FILE LIST (Collection Rendering pattern)
// =============================================================================

export interface UploadFileListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of file items — use stable id as key, never array index */
  items: UploadFileItem[]
  /** Callback to remove/cancel a file */
  onRemove?: (id: string) => void
  /** Callback to retry a failed upload */
  onRetry?: (id: string) => void
}

export const UploadFileList = forwardRef<HTMLDivElement, UploadFileListProps>(
  ({ items, onRemove, onRetry, style, ...rest }, ref) => {
    if (items.length === 0) return null

    return (
      <div
        ref={ref}
        role="list"
        aria-label="Uploaded files"
        style={{ ...style }}
        {...rest}
      >
        {items.map((item, index) => (
          <div role="listitem" key={item.id}>
            <UploadFile
              item={item}
              divider={index > 0}
              onRemove={onRemove}
              onRetry={onRetry}
            />
          </div>
        ))}
      </div>
    )
  }
)

UploadFileList.displayName = 'UploadFileList'
