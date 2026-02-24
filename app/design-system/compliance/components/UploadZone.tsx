'use client'

import { useState, useRef, useCallback } from 'react'
import { colors, typography, fontFamilies, spacing, borderRadius, transitionPresets } from '@/styles/design-tokens'
import { IconUpload } from '@/components/Icons'

interface UploadZoneProps {
  onFileAccepted: (file: File) => void
  disabled?: boolean
  isUploading?: boolean
}

const ACCEPTED_TYPES = ['.md', '.docx', '.xlsx', '.xls', '.html']

export default function UploadZone({ onFileAccepted, disabled, isUploading }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isUploading) setDragOver(true)
  }, [disabled, isUploading])

  const handleDragLeave = useCallback(() => setDragOver(false), [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (disabled || isUploading) return
    const file = e.dataTransfer.files[0]
    if (file) onFileAccepted(file)
  }, [disabled, isUploading, onFileAccepted])

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) inputRef.current?.click()
  }, [disabled, isUploading])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileAccepted(file)
    if (inputRef.current) inputRef.current.value = ''
  }, [onFileAccepted])

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload VPAT report file"
      aria-disabled={disabled || isUploading}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() } }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        padding: `${spacing['2xl']} ${spacing.xl}`,
        border: `1px dashed ${dragOver ? colors.brand.default : 'rgba(0, 0, 0, 0.15)'}`,
        borderRadius: borderRadius.lg,
        backgroundColor: dragOver ? 'rgba(0, 81, 81, 0.03)' : 'transparent',
        textAlign: 'center',
        cursor: disabled || isUploading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: `all ${transitionPresets.default}`,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        tabIndex={-1}
      />

      {isUploading ? (
        <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, margin: 0 }}>
          Parsing report...
        </p>
      ) : (
        <>
          <div style={{ color: colors.text.disabled.onLight, marginBottom: spacing.xs, display: 'flex', justifyContent: 'center' }}>
            <IconUpload size="lg" />
          </div>
          <p style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight, margin: 0 }}>
            Drop a VPAT report here
          </p>
          <p style={{ ...typography.body.xs, color: colors.text.action.enabled, margin: 0, marginTop: spacing['2xs'] }}>
            or click to browse
          </p>
          <p style={{ ...typography.body.xs, color: colors.text.disabled.onLight, margin: 0, marginTop: spacing.xs }}>
            .md, .docx, .xlsx, .html
          </p>
        </>
      )}
    </div>
  )
}
