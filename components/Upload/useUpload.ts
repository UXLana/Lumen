'use client'

import { useState, useCallback, useRef } from 'react'

// =============================================================================
// TYPES
// =============================================================================

export type UploadFileStatus = 'uploading' | 'complete' | 'error'

export interface UploadFile {
  /** Unique identifier */
  id: string
  /** Original file name */
  name: string
  /** File size in bytes */
  size: number
  /** MIME type */
  type: string
  /** Upload progress 0-100 */
  progress: number
  /** Current status */
  status: UploadFileStatus
  /** Estimated seconds remaining */
  timeRemaining?: number
  /** Error message when status is 'error' */
  errorMessage?: string
  /** The underlying File object (undefined for URL uploads) */
  file?: File
  /** Source URL (for URL-based uploads) */
  sourceUrl?: string
}

export interface UseUploadOptions {
  /** Maximum file size in bytes (default: 256 MB) */
  maxFileSize?: number
  /** Accepted MIME types (e.g. ['image/*', 'application/pdf']) */
  accept?: string[]
  /** Maximum number of files */
  maxFiles?: number
  /** Custom upload handler — receives file, returns promise. If not provided, simulates upload. */
  onUpload?: (file: File, onProgress: (progress: number) => void) => Promise<void>
  /** Called when files are added */
  onFilesAdded?: (files: UploadFile[]) => void
  /** Called when a file is removed */
  onFileRemoved?: (fileId: string) => void
  /** Called when all files finish (complete or error) */
  onComplete?: (files: UploadFile[]) => void
}

export interface UseUploadReturn {
  files: UploadFile[]
  isDragOver: boolean
  addFiles: (fileList: FileList | File[]) => void
  addFromUrl: (url: string) => void
  removeFile: (fileId: string) => void
  retryFile: (fileId: string) => void
  clearAll: () => void
  dragHandlers: {
    onDragOver: (e: React.DragEvent) => void
    onDragEnter: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
  }
}

// =============================================================================
// HELPERS
// =============================================================================

let counter = 0
function generateId(): string {
  return `upload-${Date.now()}-${++counter}`
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[i]}`
}

// =============================================================================
// HOOK
// =============================================================================

export function useUpload(options: UseUploadOptions = {}): UseUploadReturn {
  const {
    maxFileSize = 256 * 1024 * 1024, // 256 MB
    accept,
    maxFiles,
    onUpload,
    onFilesAdded,
    onFileRemoved,
    onComplete,
  } = options

  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const dragCounterRef = useRef(0)
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())

  // Check if all files are settled after a status change
  const checkComplete = useCallback(
    (updatedFiles: UploadFile[]) => {
      const allSettled = updatedFiles.length > 0 && updatedFiles.every(
        (f) => f.status === 'complete' || f.status === 'error'
      )
      if (allSettled) onComplete?.(updatedFiles)
    },
    [onComplete]
  )

  // Simulate upload progress for demo/prototype purposes
  const simulateUpload = useCallback(
    (fileId: string) => {
      const controller = new AbortController()
      abortControllersRef.current.set(fileId, controller)

      let progress = 0
      const interval = setInterval(() => {
        if (controller.signal.aborted) {
          clearInterval(interval)
          return
        }

        // Random increment between 5-15%
        progress += Math.random() * 10 + 5
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          abortControllersRef.current.delete(fileId)

          // 15% chance of simulated error for demo
          const hasError = Math.random() < 0.15

          setFiles((prev) => {
            const updated = prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    progress: hasError ? f.progress : 100,
                    status: (hasError ? 'error' : 'complete') as UploadFileStatus,
                    timeRemaining: hasError ? undefined : 0,
                    errorMessage: hasError ? 'Upload failed' : undefined,
                  }
                : f
            )
            checkComplete(updated)
            return updated
          })
          return
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  progress: Math.round(progress),
                  timeRemaining: Math.round(((100 - progress) / 10) * (f.size / (1024 * 1024))),
                }
              : f
          )
        )
      }, 300)
    },
    [checkComplete]
  )

  const startUpload = useCallback(
    (uploadFile: UploadFile) => {
      if (onUpload && uploadFile.file) {
        const controller = new AbortController()
        abortControllersRef.current.set(uploadFile.id, controller)

        onUpload(uploadFile.file, (progress) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id ? { ...f, progress: Math.round(progress) } : f
            )
          )
        })
          .then(() => {
            abortControllersRef.current.delete(uploadFile.id)
            setFiles((prev) => {
              const updated = prev.map((f) =>
                f.id === uploadFile.id
                  ? { ...f, progress: 100, status: 'complete' as UploadFileStatus, timeRemaining: 0 }
                  : f
              )
              checkComplete(updated)
              return updated
            })
          })
          .catch(() => {
            abortControllersRef.current.delete(uploadFile.id)
            setFiles((prev) => {
              const updated = prev.map((f) =>
                f.id === uploadFile.id
                  ? { ...f, status: 'error' as UploadFileStatus, errorMessage: 'Upload failed' }
                  : f
              )
              checkComplete(updated)
              return updated
            })
          })
      } else {
        simulateUpload(uploadFile.id)
      }
    },
    [onUpload, simulateUpload, checkComplete]
  )

  // Validate and add files
  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList)

      // Filter by accept types
      const filtered = accept
        ? incoming.filter((file) =>
            accept.some((type) => {
              if (type.endsWith('/*')) {
                return file.type.startsWith(type.replace('/*', '/'))
              }
              return file.type === type
            })
          )
        : incoming

      // Enforce max files
      const available = maxFiles ? maxFiles - files.length : filtered.length
      const toAdd = filtered.slice(0, Math.max(0, available))

      const newFiles: UploadFile[] = toAdd.map((file) => ({
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: file.size > maxFileSize ? 'error' : 'uploading',
        errorMessage: file.size > maxFileSize ? `File exceeds ${formatFileSize(maxFileSize)} limit` : undefined,
        file,
      }))

      setFiles((prev) => [...prev, ...newFiles])
      onFilesAdded?.(newFiles)

      // Start uploads for valid files
      newFiles
        .filter((f) => f.status === 'uploading')
        .forEach((f) => startUpload(f))
    },
    [accept, maxFiles, maxFileSize, files.length, onFilesAdded, startUpload]
  )

  const addFromUrl = useCallback(
    (url: string) => {
      if (!url.trim()) return

      const fileName = url.split('/').pop()?.split('?')[0] || 'downloaded-file'
      const newFile: UploadFile = {
        id: generateId(),
        name: fileName,
        size: 0,
        type: 'application/octet-stream',
        progress: 0,
        status: 'uploading',
        sourceUrl: url,
      }

      setFiles((prev) => [...prev, newFile])
      onFilesAdded?.([newFile])
      simulateUpload(newFile.id)
    },
    [onFilesAdded, simulateUpload]
  )

  const removeFile = useCallback(
    (fileId: string) => {
      // Abort in-progress upload
      const controller = abortControllersRef.current.get(fileId)
      if (controller) {
        controller.abort()
        abortControllersRef.current.delete(fileId)
      }

      setFiles((prev) => prev.filter((f) => f.id !== fileId))
      onFileRemoved?.(fileId)
    },
    [onFileRemoved]
  )

  const retryFile = useCallback(
    (fileId: string) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, progress: 0, status: 'uploading' as UploadFileStatus, errorMessage: undefined, timeRemaining: undefined }
            : f
        )
      )

      const file = files.find((f) => f.id === fileId)
      if (file) startUpload({ ...file, progress: 0, status: 'uploading' })
    },
    [files, startUpload]
  )

  const clearAll = useCallback(() => {
    // Abort all in-progress
    abortControllersRef.current.forEach((c) => c.abort())
    abortControllersRef.current.clear()
    setFiles([])
  }, [])

  // Drag handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current++
    if (e.dataTransfer.items?.length) {
      setIsDragOver(true)
    }
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setIsDragOver(false)
    }
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current = 0
      setIsDragOver(false)

      if (e.dataTransfer.files?.length) {
        addFiles(e.dataTransfer.files)
      }
    },
    [addFiles]
  )

  return {
    files,
    isDragOver,
    addFiles,
    addFromUrl,
    removeFile,
    retryFile,
    clearAll,
    dragHandlers: { onDragOver, onDragEnter, onDragLeave, onDrop },
  }
}

export { formatFileSize }
