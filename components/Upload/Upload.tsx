'use client'

import React, { forwardRef, createContext, useContext, useMemo } from 'react'
import {
  colors,
  spacing,
  borderRadius,
  typography,
  fontFamilies,
} from '../../styles/design-tokens'
import { DropZone } from './DropZone'
import { UploadFileList } from './UploadFile'
import type { DropZoneIcon } from './DropZone'
import type { UploadFileItem } from './UploadFile'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

export type UploadStatus = 'enabled' | 'error' | 'readOnly' | 'disabled'

export interface UploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Upload area status */
  status?: UploadStatus
  /** Show large-height layout (expanded DropZone) */
  largeHeight?: boolean
  /** DropZone icon variant */
  icon?: DropZoneIcon
  /** Whether to show mobile layout */
  mobileDevice?: boolean
  /** File items to display */
  items?: UploadFileItem[]
  /** Accepted file types */
  accept?: string
  /** Allow multiple files */
  multiple?: boolean
  /** Error message (shown when status is 'error') */
  errorMessage?: string
  /** Callback when files are selected */
  onFilesSelected?: (files: File[]) => void
  /** Callback to remove a file */
  onRemove?: (id: string) => void
  /** Callback to retry a failed upload */
  onRetry?: (id: string) => void
}

// =============================================================================
// COMPOUND CONTEXT (Compound Component Shared State pattern)
// =============================================================================

interface UploadContextValue {
  status: UploadStatus
  disabled: boolean
  readOnly: boolean
}

const UploadContext = createContext<UploadContextValue | null>(null)

function useUploadContext() {
  const ctx = useContext(UploadContext)
  if (!ctx) throw new Error('Upload sub-component must be used within <Upload>')
  return ctx
}

// =============================================================================
// STATUS → DROPZONE STATUS MAPPING
// =============================================================================

function toDropZoneStatus(status: UploadStatus): 'enabled' | 'readOnly' | 'disabled' {
  switch (status) {
    case 'error':
      return 'enabled' // Error state keeps DropZone interactive
    case 'readOnly':
      return 'readOnly'
    case 'disabled':
      return 'disabled'
    default:
      return 'enabled'
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Upload = forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      status = 'enabled',
      largeHeight = false,
      icon = 'upload',
      mobileDevice = false,
      items = [],
      accept,
      multiple = true,
      errorMessage,
      onFilesSelected,
      onRemove,
      onRetry,
      style,
      className,
      ...rest
    },
    ref
  ) => {
    const isDisabled = status === 'disabled'
    const isReadOnly = status === 'readOnly'
    const isError = status === 'error'

    // Compound context value — wrapped in useMemo to prevent unnecessary re-renders
    const contextValue = useMemo(
      () => ({
        status,
        disabled: isDisabled,
        readOnly: isReadOnly,
      }),
      [status, isDisabled, isReadOnly]
    )

    const errorColor = colors.status?.important ?? '#DC0C22'

    return (
      <UploadContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={className}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.none,
            width: '100%',
            ...style,
          }}
          {...rest}
        >
          {/* Drop Zone */}
          <DropZone
            icon={icon}
            status={toDropZoneStatus(status)}
            mobileDevice={mobileDevice}
            accept={accept}
            multiple={multiple}
            onFilesSelected={onFilesSelected}
            style={{
              minHeight: largeHeight ? '200px' : '120px',
              ...(isError
                ? {
                    borderColor: errorColor,
                  }
                : {}),
            }}
          />

          {/* Error message */}
          {isError && errorMessage && (
            <p
              role="alert"
              style={{
                ...typography.body.xs,
                fontFamily: fontFamilies.body,
                color: errorColor,
                marginTop: spacing.xs,
                marginBottom: spacing.none,
              }}
            >
              {errorMessage}
            </p>
          )}

          {/* File list */}
          {items.length > 0 && (
            <div style={{ marginTop: spacing.sm }}>
              <UploadFileList
                items={items}
                onRemove={isDisabled ? undefined : onRemove}
                onRetry={isDisabled ? undefined : onRetry}
              />
            </div>
          )}
        </div>
      </UploadContext.Provider>
    )
  }
)

Upload.displayName = 'Upload'

// Re-export useUploadContext for advanced compound patterns
export { useUploadContext }
