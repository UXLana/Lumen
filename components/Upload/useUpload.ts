'use client'

import { useState, useCallback } from 'react'
import type { UploadFileItem } from './UploadFile'

// =============================================================================
// CUSTOM HOOK EXTRACTION (per SKILL.md guidance)
//
// Extracted because:
// - State transitions are non-trivial (multi-step, dependent states)
// - Browser API integration involved (drag-and-drop, file input)
// - Logic would repeat across sub-components
// =============================================================================

export interface UseUploadOptions {
  /** Maximum number of files allowed */
  maxFiles?: number
  /** Maximum file size in bytes */
  maxFileSize?: number
  /** Accepted file types (MIME types or extensions) */
  accept?: string[]
  /** Callback when files are added */
  onAdd?: (files: File[]) => void
  /** Callback when a file is removed */
  onRemove?: (id: string) => void
  /** Callback when a file upload is retried */
  onRetry?: (id: string) => void
}

export interface UseUploadReturn {
  /** Current file items */
  items: UploadFileItem[]
  /** Add files from input or drop */
  addFiles: (files: File[]) => void
  /** Remove a file by id */
  removeFile: (id: string) => void
  /** Retry a failed file by id */
  retryFile: (id: string) => void
  /** Update a file item's state (for external upload progress tracking) */
  updateFile: (id: string, updates: Partial<UploadFileItem>) => void
  /** Clear all files */
  clearAll: () => void
}

let fileIdCounter = 0
function generateFileId(): string {
  return `upload-${Date.now()}-${++fileIdCounter}`
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getIconType(file: File): UploadFileItem['iconType'] {
  if (file.type === 'application/pdf') return 'pdf'
  if (file.type.startsWith('image/')) return 'image'
  return 'file'
}

export function useUpload(options: UseUploadOptions = {}): UseUploadReturn {
  const { maxFiles, maxFileSize, onAdd, onRemove: onRemoveCallback, onRetry: onRetryCallback } = options
  const [items, setItems] = useState<UploadFileItem[]>([])

  const addFiles = useCallback(
    (files: File[]) => {
      const newItems: UploadFileItem[] = files
        .filter((file) => {
          // Validate file size
          if (maxFileSize && file.size > maxFileSize) return false
          return true
        })
        .map((file) => ({
          id: generateFileId(),
          name: file.name,
          size: formatFileSize(file.size),
          status: 'added' as const,
          progress: 0,
          iconType: getIconType(file),
        }))

      setItems((prev) => {
        const combined = [...prev, ...newItems]
        // Enforce maxFiles limit
        if (maxFiles && combined.length > maxFiles) {
          return combined.slice(0, maxFiles)
        }
        return combined
      })

      onAdd?.(files)
    },
    [maxFiles, maxFileSize, onAdd]
  )

  const removeFile = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id))
      onRemoveCallback?.(id)
    },
    [onRemoveCallback]
  )

  const retryFile = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: 'queued' as const, errorMessage: undefined, progress: 0 }
            : item
        )
      )
      onRetryCallback?.(id)
    },
    [onRetryCallback]
  )

  const updateFile = useCallback((id: string, updates: Partial<UploadFileItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }, [])

  const clearAll = useCallback(() => {
    setItems([])
  }, [])

  return {
    items,
    addFiles,
    removeFile,
    retryFile,
    updateFile,
    clearAll,
  }
}
