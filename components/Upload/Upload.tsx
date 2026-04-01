'use client'

import React, { forwardRef, useRef, useState, useId } from 'react'
import {
  colors,
  spacing,
  typography,
  fontWeights,
  borderRadius,
  transitionPresets,
} from '../../styles/design-tokens'
import { Button, ButtonGroup } from '../Button'
import { Input } from '../Input'
import { IconUpload } from '../Icons'
import { FileItem } from './FileItem'
import { useUpload } from './useUpload'
import type { UseUploadOptions, UploadFile } from './useUpload'

// =============================================================================
// TYPES
// =============================================================================

export interface UploadProps {
  /** Title text */
  title?: string
  /** Description text below the title */
  description?: string
  /** Drop zone label */
  dropLabel?: string
  /** Maximum file size label (e.g. "256 MB") — display only */
  maxFileSizeLabel?: string
  /** Show the "upload from URL" section */
  showUrlUpload?: boolean
  /** Accepted file types (MIME), passed to both input[accept] and validation */
  accept?: string[]
  /** Maximum file size in bytes */
  maxFileSize?: number
  /** Maximum number of files */
  maxFiles?: number
  /** Custom upload handler */
  onUpload?: UseUploadOptions['onUpload']
  /** Called when user clicks the primary action ("Attach files") */
  onAttach?: (files: UploadFile[]) => void
  /** Called when user clicks cancel */
  onCancel?: () => void
  /** Called when files change (add/remove/status) */
  onFilesChange?: (files: UploadFile[]) => void
  /** Primary action label */
  attachLabel?: string
  /** Cancel label */
  cancelLabel?: string
  /** Whether to show footer action buttons */
  showFooter?: boolean
  /** Additional class name */
  className?: string
  /** Additional styles */
  style?: React.CSSProperties
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Upload = forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      title = 'Upload Files',
      description,
      dropLabel = 'Drag and drop your files',
      maxFileSizeLabel = '256 MB',
      showUrlUpload = true,
      accept,
      maxFileSize,
      maxFiles,
      onUpload,
      onAttach,
      onCancel,
      onFilesChange,
      attachLabel = 'Attach files',
      cancelLabel = 'Cancel',
      showFooter = true,
      className,
      style,
    },
    ref
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [urlValue, setUrlValue] = useState('')
    const [isDragHighlight, setIsDragHighlight] = useState(false)
    const regionId = useId()

    const {
      files,
      isDragOver,
      addFiles,
      addFromUrl,
      removeFile,
      retryFile,
      dragHandlers,
    } = useUpload({
      maxFileSize,
      accept,
      maxFiles,
      onUpload,
      onFilesAdded: () => onFilesChange?.(files),
      onFileRemoved: () => onFilesChange?.(files),
    })

    const showDragHighlight = isDragOver || isDragHighlight

    const handleSelectFiles = () => {
      fileInputRef.current?.click()
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        addFiles(e.target.files)
        // Reset so the same file can be re-selected
        e.target.value = ''
      }
    }

    const handleUrlUpload = () => {
      if (urlValue.trim()) {
        addFromUrl(urlValue.trim())
        setUrlValue('')
      }
    }

    const handleUrlKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleUrlUpload()
      }
    }

    const handleAttach = () => {
      onAttach?.(files)
    }

    const hasFiles = files.length > 0
    const hasUrl = urlValue.trim().length > 0

    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.xl,
          ...style,
        }}
      >
        {/* Header */}
        {title && (
          <div>
            <h3
              style={{
                ...typography.heading.h4,
                color: colors.text.highEmphasis.onLight,
                margin: 0,
              }}
            >
              {title}
            </h3>
            {description && (
              <p
                style={{
                  ...typography.body.sm,
                  color: colors.text.lowEmphasis.onLight,
                  margin: `${spacing['2xs']} 0 0`,
                }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Drop Zone */}
        <div
          {...dragHandlers}
          onDragEnter={(e) => {
            dragHandlers.onDragEnter(e)
            setIsDragHighlight(true)
          }}
          onDragLeave={(e) => {
            dragHandlers.onDragLeave(e)
            // Use the hook's isDragOver state (handles counter)
          }}
          onDrop={(e) => {
            dragHandlers.onDrop(e)
            setIsDragHighlight(false)
          }}
          role="button"
          tabIndex={0}
          aria-label={dropLabel}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleSelectFiles()
            }
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            padding: spacing['2xl'],
            border: `2px dashed ${
              showDragHighlight
                ? colors.brand.default
                : colors.border.lowEmphasis.onLight
            }`,
            borderRadius: borderRadius.lg,
            backgroundColor: showDragHighlight
              ? `color-mix(in srgb, ${colors.brand.default} 4%, transparent)`
              : colors.surface.light,
            cursor: 'pointer',
            transition: `border-color ${transitionPresets.fast}, background-color ${transitionPresets.fast}`,
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = colors.brand.default
          }}
          onBlur={(e) => {
            if (!showDragHighlight) {
              e.currentTarget.style.borderColor = colors.border.lowEmphasis.onLight
            }
          }}
        >
          {/* Upload icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: borderRadius.md,
              backgroundColor: colors.surface.lightDarker,
            }}
          >
            <IconUpload size="lg" color={colors.brand.default} />
          </div>

          {/* Text */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                ...typography.label.lg,
                fontWeight: fontWeights.medium,
                color: colors.text.highEmphasis.onLight,
              }}
            >
              {dropLabel}
            </div>
            {maxFileSizeLabel && (
              <div
                style={{
                  ...typography.body.xs,
                  color: colors.text.lowEmphasis.onLight,
                  marginTop: spacing['2xs'],
                }}
              >
                Max. File size: {maxFileSizeLabel}
              </div>
            )}
          </div>

          {/* Select files button */}
          <Button
            emphasis="mid"
            size="md"
            onClick={(e) => {
              e.stopPropagation()
              handleSelectFiles()
            }}
            tabIndex={-1}
          >
            Select files
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles !== 1}
          accept={accept?.join(',')}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* URL Upload */}
        {showUrlUpload && (
          <div>
            <div
              style={{
                ...typography.label.md,
                fontWeight: fontWeights.medium,
                color: colors.text.highEmphasis.onLight,
                marginBottom: spacing.xs,
              }}
            >
              Or upload from URL
            </div>
            <div
              style={{
                display: 'flex',
                gap: spacing.xs,
                alignItems: 'flex-start',
              }}
            >
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="Add file URL"
                  value={urlValue}
                  onChange={(value) => setUrlValue(value)}
                  onKeyDown={handleUrlKeyDown}
                  size="md"
                  fullWidth
                  aria-label="File URL"
                />
              </div>
              <Button
                emphasis={hasUrl ? 'high' : 'low'}
                size="md"
                onClick={handleUrlUpload}
                disabled={!hasUrl}
                style={{ flexShrink: 0 }}
              >
                Upload
              </Button>
            </div>
          </div>
        )}

        {/* File Queue */}
        {hasFiles && (
          <div
            role="region"
            aria-label="Uploaded files"
            aria-live="polite"
            id={regionId}
          >
            <h4
              style={{
                ...typography.heading.h5,
                color: colors.text.highEmphasis.onLight,
                margin: `0 0 ${spacing.sm}`,
              }}
            >
              Uploaded Files
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.xs,
              }}
            >
              {files.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  onRemove={removeFile}
                  onRetry={retryFile}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {showFooter && (
          <ButtonGroup spacing="form" align="end">
            <Button emphasis="low" size="lg" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button
              emphasis="high"
              size="lg"
              onClick={handleAttach}
              disabled={!hasFiles || files.some((f) => f.status === 'uploading')}
            >
              {attachLabel}
            </Button>
          </ButtonGroup>
        )}
      </div>
    )
  }
)

Upload.displayName = 'Upload'
