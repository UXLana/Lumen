'use client'

import React, { useState, useCallback } from 'react'
import { StyleguideLayout, sharedStyles, CodeBlock, SpecTable, Playground, PillButton, CopyableToken, PixelValue, CollapsibleSection, ComponentDocumentation, ComponentDocData } from '../../design-system/shared'
import { Upload } from '@/components'
import type { UploadStatus } from '@/components/Upload/Upload'
import type { UploadFileItem } from '@/components/Upload/UploadFile'
import { colors, spacing, typography, borderRadius, transitionPresets } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// DEMO DATA
// =============================================================================

const demoFileItems: UploadFileItem[] = [
  { id: '1', name: 'license-front.jpg', size: '1.2 MB', status: 'done', iconType: 'image' },
  { id: '2', name: 'compliance-report.pdf', size: '3.4 MB', status: 'uploading', progress: 65, iconType: 'pdf' },
  { id: '3', name: 'manifest.csv', size: '245 KB', status: 'error', errorMessage: 'File exceeds maximum size', iconType: 'file' },
]

// =============================================================================
// DOC DATA
// =============================================================================

const uploadDocData: ComponentDocData = {
  displayName: 'Upload',
  importPath: '@/components',
  importStatement: `import { Upload } from '@/components'\nimport { useUpload } from '@/components/Upload'\nimport type { UploadProps, UploadFileItem } from '@/components'`,
  description: 'A compound file upload component with drag-and-drop DropZone, file list with progress tracking, error recovery, and keyboard accessibility. Designed for compliance document submission in regulated workflows.',
  props: [
    { name: 'status', type: "'enabled' | 'error' | 'readOnly' | 'disabled'", default: "'enabled'", description: 'Upload area status' },
    { name: 'largeHeight', type: 'boolean', default: 'false', description: 'Show large-height layout (expanded DropZone)' },
    { name: 'icon', type: "'upload' | 'attach' | 'import'", default: "'upload'", description: 'DropZone icon variant' },
    { name: 'mobileDevice', type: 'boolean', default: 'false', description: 'Whether to show mobile layout (no drag text)' },
    { name: 'items', type: 'UploadFileItem[]', default: '[]', description: 'File items to display' },
    { name: 'accept', type: 'string', description: 'Accepted file types (passed to native input)' },
    { name: 'multiple', type: 'boolean', default: 'true', description: 'Allow multiple files' },
    { name: 'errorMessage', type: 'string', description: "Error message (shown when status is 'error')" },
    { name: 'onFilesSelected', type: '(files: File[]) => void', description: 'Callback when files are selected' },
    { name: 'onRemove', type: '(id: string) => void', description: 'Callback to remove a file' },
    { name: 'onRetry', type: '(id: string) => void', description: 'Callback to retry a failed upload' },
  ],
  accessibility: [
    { feature: 'Interactive Surface', description: 'DropZone uses role="button" with keyboard activation via Enter and Space keys.' },
    { feature: 'Drag and Drop', description: 'Full drag-and-drop support with visual active state. Also works via click/keyboard for non-mouse users.' },
    { feature: 'File List', description: 'File list uses role="list" with role="listitem" for each file entry.' },
    { feature: 'Error Alerts', description: 'Error messages use role="alert" for immediate screen reader announcement.' },
    { feature: 'Action Labels', description: 'Remove and retry buttons have descriptive aria-labels including the file name.' },
    { feature: 'Disabled State', description: 'Disabled DropZone sets tabIndex={-1} and aria-disabled to prevent interaction.' },
    { feature: 'Progress Tracking', description: 'Upload progress bars include aria-label with file name for screen reader context.' },
  ],
  tokens: [
    { token: 'colors.surface.light', value: 'White', usage: 'DropZone background' },
    { token: 'colors.brand.default', value: 'Brand blue', usage: 'Active drag border, browse link, retry icon' },
    { token: 'colors.selectedHighlight', value: 'Light blue', usage: 'DropZone active (drag hover) background' },
    { token: 'colors.border.midEmphasis.onLight', value: 'Gray', usage: 'DropZone enabled dashed border' },
    { token: 'colors.status.important', value: 'Red', usage: 'Error state border and messages' },
    { token: 'borderRadius.lg', value: '12px', usage: 'DropZone border radius' },
    { token: 'borderRadius.sm', value: '4px', usage: 'File icon and action button radius' },
    { token: 'spacing.xl', value: '24px', usage: 'DropZone internal padding' },
    { token: 'spacing.sm', value: '12px', usage: 'File list item padding, icon-to-info gap' },
    { token: 'spacing.xs', value: '8px', usage: 'DropZone icon-to-text gap, file row info gap' },
    { token: 'transitionPresets.fast', value: '150ms ease-out', usage: 'Border and background transitions' },
  ],
  relatedComponents: [
    { name: 'Progress Bar', href: '/components/progress-bar' },
    { name: 'Button', href: '/components/button' },
  ],
  notes: [
    'Use the useUpload() hook for managed state — handles add, remove, retry, and progress updates.',
    'The compound pattern uses UploadContext internally. Sub-components (DropZone, UploadFile) can also be used standalone.',
    'File items require stable unique IDs — never use array index.',
    'Error recovery: failed files show a retry button that resets status to "queued".',
    'DropZone stays interactive in error status to allow re-upload.',
    'The accept prop maps directly to the native file input accept attribute.',
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function UploadPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoStatus, setDemoStatus] = useState<UploadStatus>('enabled')
  const [demoLargeHeight, setDemoLargeHeight] = useState(false)
  const [demoIcon, setDemoIcon] = useState<'upload' | 'attach' | 'import'>('upload')
  const [demoMobile, setDemoMobile] = useState(false)
  const [demoFiles, setDemoFiles] = useState<UploadFileItem[]>(demoFileItems)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  const handleFilesSelected = useCallback((files: File[]) => {
    const newItems: UploadFileItem[] = files.map((f, i) => ({
      id: `demo-${Date.now()}-${i}`,
      name: f.name,
      size: f.size < 1024 * 1024
        ? `${(f.size / 1024).toFixed(1)} KB`
        : `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'added' as const,
      iconType: f.type === 'application/pdf' ? 'pdf' as const
        : f.type.startsWith('image/') ? 'image' as const
        : 'file' as const,
    }))
    setDemoFiles(prev => [...prev, ...newItems])
  }, [])

  const handleRemove = useCallback((id: string) => {
    setDemoFiles(prev => prev.filter(f => f.id !== id))
  }, [])

  const handleRetry = useCallback((id: string) => {
    setDemoFiles(prev =>
      prev.map(f => f.id === id ? { ...f, status: 'queued' as const, errorMessage: undefined } : f)
    )
  }, [])

  return (
    <StyleguideLayout
      title="Upload"
      description="A compound file upload component with drag-and-drop, progress tracking, and error recovery. Built for compliance document submission."
      activeId="upload"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
    >
      {/* ========== OVERVIEW TAB ========== */}
      {activePageTab === 'overview' && (
        <>
          {/* Quick Start */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`import { Upload } from '@/components'
import { useUpload } from '@/components/Upload'

function MyForm() {
  const { items, addFiles, removeFile, retryFile } = useUpload({
    maxFiles: 5,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
  })

  return (
    <Upload
      items={items}
      onFilesSelected={addFiles}
      onRemove={removeFile}
      onRetry={retryFile}
      accept=".pdf,.jpg,.png"
    />
  )
}`}</CodeBlock>
            </div>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Experiment with upload properties. Drag files or click to browse.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview */}
                <div>
                  <Playground
                    preview={
                      <div style={{ width: '100%', padding: spacing.md }}>
                        <Upload
                          status={demoStatus}
                          largeHeight={demoLargeHeight}
                          icon={demoIcon}
                          mobileDevice={demoMobile}
                          items={demoFiles}
                          onFilesSelected={handleFilesSelected}
                          onRemove={handleRemove}
                          onRetry={handleRetry}
                          errorMessage={demoStatus === 'error' ? 'Please upload a valid document.' : undefined}
                          multiple
                        />
                      </div>
                    }
                    code={`<Upload
  status="${demoStatus}"${demoLargeHeight ? '\n  largeHeight' : ''}
  icon="${demoIcon}"${demoMobile ? '\n  mobileDevice' : ''}
  items={items}
  onFilesSelected={addFiles}
  onRemove={removeFile}
  onRetry={retryFile}${demoStatus === 'error' ? '\n  errorMessage="Please upload a valid document."' : ''}
/>`}
                    previewPadding={spacing.xs}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Status */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Status
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['enabled', 'error', 'readOnly', 'disabled'] as const).map(s => (
                          <PillButton
                            key={s}
                            onClick={() => setDemoStatus(s)}
                            isActive={demoStatus === s}
                          >
                            {s}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Icon */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Icon
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['upload', 'attach', 'import'] as const).map(i => (
                          <PillButton
                            key={i}
                            onClick={() => setDemoIcon(i)}
                            isActive={demoIcon === i}
                          >
                            {i}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Height */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Height
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {([
                          { value: false, label: 'Default' },
                          { value: true, label: 'Large' },
                        ]).map(h => (
                          <PillButton
                            key={String(h.value)}
                            onClick={() => setDemoLargeHeight(h.value)}
                            isActive={demoLargeHeight === h.value}
                          >
                            {h.label}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* Layout */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Layout
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {([
                          { value: false, label: 'Desktop' },
                          { value: true, label: 'Mobile' },
                        ]).map(m => (
                          <PillButton
                            key={String(m.value)}
                            onClick={() => setDemoMobile(m.value)}
                            isActive={demoMobile === m.value}
                          >
                            {m.label}
                          </PillButton>
                        ))}
                      </div>
                    </div>

                    {/* File List Reset */}
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        File List
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <PillButton
                          onClick={() => setDemoFiles(demoFileItems)}
                          isActive={false}
                        >
                          Reset demo files
                        </PillButton>
                        <PillButton
                          onClick={() => setDemoFiles([])}
                          isActive={false}
                        >
                          Clear all
                        </PillButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Design Tokens */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Spacing, color, and dimension values used in the Upload component.
              </p>

              {/* Colors */}
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Colors</h3>
                <SpecTable
                  headers={['Element', 'Token', 'Usage']}
                  rows={[
                    ['DropZone background', <CopyableToken key="bg" token="colors.surface.light" />, 'Default background'],
                    ['Active drag background', <CopyableToken key="ab" token="colors.selectedHighlight" />, 'Drag hover state'],
                    ['Active drag border', <CopyableToken key="adb" token="colors.brand.default" />, 'Border when dragging'],
                    ['Enabled border', <CopyableToken key="eb" token="colors.border.midEmphasis.onLight" />, 'Default dashed border'],
                    ['Error border/text', <CopyableToken key="er" token="colors.status.important" />, 'Error state'],
                    ['Browse link', <CopyableToken key="bl" token="colors.brand.default" />, '"browse files" text'],
                    ['File name', <CopyableToken key="fn" token="colors.text.highEmphasis.onLight" />, 'File name text'],
                    ['File size', <CopyableToken key="fs" token="colors.text.lowEmphasis.onLight" />, 'Secondary text'],
                  ]}
                />
              </div>

              {/* Spacing & Dimensions */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Spacing & Dimensions</h3>
                <SpecTable
                  headers={['Property', 'Token', 'Value']}
                  rows={[
                    ['DropZone padding', <CopyableToken key="dp" token="spacing.xl" />, <PixelValue key="dpv" value={spacing.xl} />],
                    ['DropZone min-height (default)', <code key="dh">120px</code>, '120px'],
                    ['DropZone min-height (large)', <code key="dlh">200px</code>, '200px'],
                    ['Icon-to-text gap', <CopyableToken key="ig" token="spacing.xs" />, <PixelValue key="igv" value={spacing.xs} />],
                    ['File row padding', <CopyableToken key="fp" token="spacing.sm" />, <PixelValue key="fpv" value={spacing.sm} />],
                    ['File icon-to-info gap', <CopyableToken key="fig" token="spacing.sm" />, <PixelValue key="figv" value={spacing.sm} />],
                    ['File list top margin', <CopyableToken key="fm" token="spacing.sm" />, <PixelValue key="fmv" value={spacing.sm} />],
                    ['DropZone border radius', <CopyableToken key="br" token="borderRadius.lg" />, <PixelValue key="brv" value="12px" />],
                    ['Icon/button radius', <CopyableToken key="ibr" token="borderRadius.sm" />, <PixelValue key="ibrv" value="4px" />],
                    ['Action button size', <code key="abs">28px</code>, '28px'],
                    ['File icon size', <code key="fis">40px</code>, '40px'],
                  ]}
                />
              </div>

              {/* Animation */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Animation</h3>
                <SpecTable
                  headers={['Property', 'Token', 'Value']}
                  rows={[
                    ['DropZone transitions', <CopyableToken key="dt" token="transitionPresets.fast" />, '150ms ease-out'],
                    ['Action button transitions', <CopyableToken key="at" token="transitionPresets.fast" />, '150ms ease-out'],
                  ]}
                />
              </div>
            </CollapsibleSection>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          {/* Usage */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>{`import { Upload } from '@/components'
import { useUpload } from '@/components/Upload'
import type { UploadProps, UploadFileItem } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage with useUpload Hook</h3>
              <CodeBlock>{`function DocumentUpload() {
  const { items, addFiles, removeFile, retryFile, updateFile } = useUpload({
    maxFiles: 10,
    maxFileSize: 25 * 1024 * 1024, // 25 MB
  })

  return (
    <Upload
      items={items}
      onFilesSelected={addFiles}
      onRemove={removeFile}
      onRetry={retryFile}
      accept=".pdf,.doc,.docx"
    />
  )
}`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Error State</h3>
              <CodeBlock>{`<Upload
  status="error"
  errorMessage="Please upload at least one compliance document."
  items={items}
  onFilesSelected={addFiles}
  onRemove={removeFile}
  onRetry={retryFile}
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Large Height with Import Icon</h3>
              <CodeBlock>{`<Upload
  largeHeight
  icon="import"
  items={items}
  onFilesSelected={addFiles}
  onRemove={removeFile}
  accept=".csv,.xlsx"
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Tracking Upload Progress</h3>
              <CodeBlock>{`const { items, addFiles, removeFile, retryFile, updateFile } = useUpload()

async function handleUpload(files: File[]) {
  addFiles(files)

  for (const file of files) {
    const item = items.find(i => i.name === file.name)
    if (!item) continue

    updateFile(item.id, { status: 'uploading', progress: 0 })

    try {
      await uploadWithProgress(file, (progress) => {
        updateFile(item.id, { progress })
      })
      updateFile(item.id, { status: 'done', progress: 100 })
    } catch (err) {
      updateFile(item.id, {
        status: 'error',
        errorMessage: 'Upload failed. Please retry.',
      })
    }
  }
}`}</CodeBlock>
            </div>
          </section>

          {/* Props */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Upload Props</h3>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="p1">status</code>, <code key="t1">{`'enabled' | 'error' | 'readOnly' | 'disabled'`}</code>, <code key="d1">{`'enabled'`}</code>, 'Upload area status'],
                  [<code key="p2">largeHeight</code>, <code key="t2">boolean</code>, <code key="d2">false</code>, 'Expanded DropZone (200px min-height)'],
                  [<code key="p3">icon</code>, <code key="t3">{`'upload' | 'attach' | 'import'`}</code>, <code key="d3">{`'upload'`}</code>, 'DropZone icon variant'],
                  [<code key="p4">mobileDevice</code>, <code key="t4">boolean</code>, <code key="d4">false</code>, 'Mobile layout (no drag text)'],
                  [<code key="p5">items</code>, <code key="t5">UploadFileItem[]</code>, <code key="d5">[]</code>, 'File items to display'],
                  [<code key="p6">accept</code>, <code key="t6">string</code>, <code key="d6">-</code>, 'Accepted file types'],
                  [<code key="p7">multiple</code>, <code key="t7">boolean</code>, <code key="d7">true</code>, 'Allow multiple files'],
                  [<code key="p8">errorMessage</code>, <code key="t8">string</code>, <code key="d8">-</code>, 'Error message (shown in error status)'],
                  [<code key="p9">onFilesSelected</code>, <code key="t9">(files: File[]) =&gt; void</code>, <code key="d9">-</code>, 'Callback when files are selected'],
                  [<code key="p10">onRemove</code>, <code key="t10">(id: string) =&gt; void</code>, <code key="d10">-</code>, 'Remove a file by ID'],
                  [<code key="p11">onRetry</code>, <code key="t11">(id: string) =&gt; void</code>, <code key="d11">-</code>, 'Retry a failed upload by ID'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>UploadFileItem Interface</h3>
              <SpecTable
                headers={['Property', 'Type', 'Description']}
                rows={[
                  [<code key="f1">id</code>, <code key="ft1">string</code>, 'Stable unique identifier (never use array index)'],
                  [<code key="f2">name</code>, <code key="ft2">string</code>, 'File name'],
                  [<code key="f3">size</code>, <code key="ft3">string</code>, 'File size display string'],
                  [<code key="f4">status</code>, <code key="ft4">{`'added' | 'queued' | 'uploading' | 'uploadingIndeterminate' | 'done' | 'disabled' | 'error'`}</code>, 'Upload status'],
                  [<code key="f5">progress</code>, <code key="ft5">number</code>, 'Upload progress 0\u2013100 (for uploading status)'],
                  [<code key="f6">errorMessage</code>, <code key="ft6">string</code>, 'Error message (for error status)'],
                  [<code key="f7">iconType</code>, <code key="ft7">{`'file' | 'pdf' | 'image' | 'thumbnail'`}</code>, 'File type icon'],
                  [<code key="f8">thumbnailSrc</code>, <code key="ft8">string</code>, 'Thumbnail URL (for image files)'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>useUpload Hook</h3>
              <SpecTable
                headers={['Return', 'Type', 'Description']}
                rows={[
                  [<code key="h1">items</code>, <code key="ht1">UploadFileItem[]</code>, 'Current file items'],
                  [<code key="h2">addFiles</code>, <code key="ht2">(files: File[]) =&gt; void</code>, 'Add files from input or drop'],
                  [<code key="h3">removeFile</code>, <code key="ht3">(id: string) =&gt; void</code>, 'Remove a file by ID'],
                  [<code key="h4">retryFile</code>, <code key="ht4">(id: string) =&gt; void</code>, 'Retry a failed file by ID'],
                  [<code key="h5">updateFile</code>, <code key="ht5">(id: string, updates: Partial&lt;UploadFileItem&gt;) =&gt; void</code>, 'Update file state (for progress tracking)'],
                  [<code key="h6">clearAll</code>, <code key="ht6">() =&gt; void</code>, 'Clear all files'],
                ]}
              />
            </div>
          </section>

          {/* Design Guidance */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use</h3>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Compliance document submission (licenses, manifests, lab results)</li>
                <li>Bulk file import workflows (CSV data imports)</li>
                <li>Product image uploads for registry entries</li>
                <li>Any form requiring file attachments with progress feedback</li>
              </ul>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Use the useUpload() hook for managed state', 'Manage file state manually unless needed'],
                  ['Set accept to restrict to valid file types', 'Allow unrestricted uploads in compliance flows'],
                  ['Provide clear errorMessage text for validation', 'Show generic error messages without context'],
                  ['Use largeHeight for primary upload areas', 'Use largeHeight in compact form layouts'],
                  ['Set maxFiles and maxFileSize via useUpload options', 'Allow unlimited uploads without guardrails'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>DropZone is keyboard-accessible via Enter and Space keys</li>
                <li>Hidden native file input is triggered programmatically for proper OS file picker</li>
                <li>Error messages use <code>role=&quot;alert&quot;</code> for immediate screen reader announcement</li>
                <li>Remove and retry buttons include file name in <code>aria-label</code></li>
                <li>File list uses <code>role=&quot;list&quot;</code> / <code>role=&quot;listitem&quot;</code> semantics</li>
                <li>Disabled state prevents focus with <code>tabIndex=&#123;-1&#125;</code></li>
                <li>Drag-and-drop has visual feedback but also works via click/keyboard for non-mouse users</li>
              </ul>
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={uploadDocData} />
      )}
    </StyleguideLayout>
  )
}
