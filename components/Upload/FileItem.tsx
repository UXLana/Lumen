'use client'

import React from 'react'
import {
  colors,
  spacing,
  typography,
  fontWeights,
  borderRadius,
  transitionPresets,
} from '../../styles/design-tokens'
import { ProgressBar } from '../ProgressBar'
import { IconFile, IconTrash, IconRefresh } from '../Icons'
import type { UploadFile } from './useUpload'
import { formatFileSize } from './useUpload'

// =============================================================================
// TYPES
// =============================================================================

export interface FileItemProps {
  file: UploadFile
  onRemove: (id: string) => void
  onRetry: (id: string) => void
}

// =============================================================================
// HELPERS
// =============================================================================

function getProgressVariant(status: UploadFile['status']): 'default' | 'success' | 'error' {
  switch (status) {
    case 'complete':
      return 'success'
    case 'error':
      return 'error'
    default:
      return 'default'
  }
}

function getStatusText(file: UploadFile): string {
  switch (file.status) {
    case 'complete':
      return `Upload Successful | 100%`
    case 'error':
      return file.errorMessage || 'Upload failed'
    default: {
      const size = file.size > 0 ? formatFileSize(file.size) : ''
      const progress = `${file.progress}%`
      const time =
        file.timeRemaining != null && file.timeRemaining > 0
          ? `${file.timeRemaining} sec left`
          : ''
      return [size, progress, time].filter(Boolean).join(' · ')
    }
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FileItem({ file, onRemove, onRetry }: FileItemProps) {
  const isError = file.status === 'error'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xs,
        padding: `${spacing.sm} ${spacing.md}`,
        borderRadius: borderRadius.md,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        backgroundColor: colors.surface.light,
        transition: `border-color ${transitionPresets.fast}`,
      }}
    >
      {/* Top row: icon + info + actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        {/* File icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: borderRadius.sm,
            backgroundColor: colors.surface.lightDarker,
            flexShrink: 0,
          }}
        >
          <IconFile size="md" color={colors.brand.default} />
        </div>

        {/* File info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              ...typography.label.md,
              fontWeight: fontWeights.medium,
              color: colors.text.highEmphasis.onLight,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {file.name}
          </div>
          <div
            style={{
              ...typography.body.xs,
              color: isError
                ? colors.status.important
                : colors.text.lowEmphasis.onLight,
            }}
          >
            {getStatusText(file)}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2xs'], flexShrink: 0 }}>
          {isError && (
            <button
              type="button"
              onClick={() => onRetry(file.id)}
              aria-label={`Retry uploading ${file.name}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                border: 'none',
                background: 'none',
                borderRadius: borderRadius.sm,
                cursor: 'pointer',
                color: colors.text.lowEmphasis.onLight,
                padding: 0,
                transition: `color ${transitionPresets.fast}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.text.highEmphasis.onLight
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.lowEmphasis.onLight
              }}
            >
              <IconRefresh size="sm" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onRemove(file.id)}
            aria-label={`Remove ${file.name}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              border: 'none',
              background: 'none',
              borderRadius: borderRadius.sm,
              cursor: 'pointer',
              color: colors.text.lowEmphasis.onLight,
              padding: 0,
              transition: `color ${transitionPresets.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.status.important
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.text.lowEmphasis.onLight
            }}
          >
            <IconTrash size="sm" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar
        value={file.progress}
        size="sm"
        variant={getProgressVariant(file.status)}
        aria-label={`Upload progress for ${file.name}`}
      />
    </div>
  )
}
