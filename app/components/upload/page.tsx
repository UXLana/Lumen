'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  Playground,
  StyledCheckbox as StyledCheckboxControl,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import { Upload } from '@/components'
import { colors, spacing, typography } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// DOC DATA
// =============================================================================

const uploadDocData: ComponentDocData = {
  displayName: 'Upload',
  importPath: '@/components',
  importStatement: `import { Upload, useUpload } from '@/components'\nimport type { UploadProps, UploadFile } from '@/components'`,
  description:
    'Upload provides a drag-and-drop zone, URL upload, and file queue with progress tracking for file uploads.',
  props: [
    { name: 'title', type: 'string', default: "'Upload Files'", description: 'Title text' },
    { name: 'description', type: 'string', description: 'Description text below the title' },
    { name: 'dropLabel', type: 'string', default: "'Drag and drop your files'", description: 'Drop zone label' },
    { name: 'maxFileSizeLabel', type: 'string', default: "'256 MB'", description: 'Max file size display text' },
    { name: 'showUrlUpload', type: 'boolean', default: 'true', description: 'Show URL upload section' },
    { name: 'accept', type: 'string[]', description: 'Accepted MIME types (e.g. ["image/*", "application/pdf"])' },
    { name: 'maxFileSize', type: 'number', description: 'Maximum file size in bytes' },
    { name: 'maxFiles', type: 'number', description: 'Maximum number of files' },
    { name: 'onUpload', type: '(file, onProgress) => Promise<void>', description: 'Custom upload handler' },
    { name: 'onAttach', type: '(files: UploadFile[]) => void', description: 'Called when "Attach files" is clicked' },
    { name: 'onCancel', type: '() => void', description: 'Called when "Cancel" is clicked' },
    { name: 'showFooter', type: 'boolean', default: 'true', description: 'Show Cancel/Attach footer buttons' },
    { name: 'attachLabel', type: 'string', default: "'Attach files'", description: 'Primary action button label' },
    { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: 'Cancel button label' },
  ],
  accessibility: [
    { feature: 'Keyboard', description: 'Drop zone is focusable and opens file picker on Enter/Space.' },
    { feature: 'Screen Reader', description: 'File queue uses aria-live="polite" to announce additions/removals.' },
    { feature: 'Labels', description: 'Icon-only action buttons (retry, delete) have aria-labels with file name.' },
    { feature: 'Semantics', description: 'Drop zone has role="button". Progress bars have aria-label per file.' },
  ],
  tokens: [
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Drop zone highlight, file icon, progress bar' },
    { token: 'colors.border.lowEmphasis.onLight', value: 'Gray border', usage: 'Drop zone and file item borders' },
    { token: 'colors.status.important', value: 'Error red', usage: 'Error text and progress bar' },
    { token: 'colors.status.success', value: 'Success green', usage: 'Completed file progress bar' },
    { token: 'spacing.xl', value: '24px', usage: 'Section gap' },
    { token: 'borderRadius.lg', value: '12px', usage: 'Drop zone border radius' },
  ],
  relatedComponents: [
    { name: 'Button', href: '/components/button' },
    { name: 'Input', href: '/components/input' },
    { name: 'FullScreenModal', href: '/components/full-screen-modal' },
  ],
  notes: [
    'If no onUpload handler is provided, upload progress is simulated for prototyping.',
    'The useUpload hook can be used independently for custom upload UIs.',
    'File validation (size, type) happens on add — oversized files show error immediately.',
  ],
  whenToUse: [
    'File attachment flows: documents, images, reports, compliance evidence.',
    'Multi-file batch uploads with progress tracking.',
    'Any form that accepts file input with drag-and-drop convenience.',
  ],
  whenNotToUse: [
    { scenario: 'Single avatar or profile image selection', instead: 'A simpler file input with image preview' },
    { scenario: 'Inline file reference without uploading', instead: 'Link component with file icon' },
  ],
  usageExamples: [
    {
      title: 'Basic file upload',
      description: 'Default upload with drag-and-drop, URL upload, and file queue.',
      isDefault: true,
      code: `<Upload\n  title="Upload Files"\n  description="Uploaded project attachments"\n  onAttach={(files) => console.log('Attached:', files)}\n  onCancel={() => console.log('Cancelled')}\n/>`,
    },
    {
      title: 'Images only with limit',
      description: 'Restrict to images, max 5 files, no URL upload.',
      code: `<Upload\n  title="Upload Images"\n  accept={['image/*']}\n  maxFiles={5}\n  maxFileSize={10 * 1024 * 1024}\n  maxFileSizeLabel="10 MB"\n  showUrlUpload={false}\n/>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function UploadPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')
  const [demoShowUrl, setDemoShowUrl] = useState(true)
  const [demoShowFooter, setDemoShowFooter] = useState(true)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Upload"
      description="Drag-and-drop file upload with progress queue, URL upload, and batch actions."
      tagline="From their device to your system, seamlessly."
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

<Upload
  title="Upload Files"
  description="Uploaded project attachments"
  onAttach={(files) => handleAttach(files)}
  onCancel={() => setOpen(false)}
/>`}</CodeBlock>
            </div>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Drop files or use the URL input to see the upload queue in action.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: spacing['2xl'] }}>
                {/* Preview */}
                <div>
                  <Playground
                    preview={
                      <div style={{ padding: spacing.md, width: '100%' }}>
                        <Upload
                          title="Upload Files"
                          description="Uploaded project attachments"
                          showUrlUpload={demoShowUrl}
                          showFooter={demoShowFooter}
                          onAttach={(files) => alert(`Attached ${files.length} file(s)`)}
                          onCancel={() => alert('Cancelled')}
                        />
                      </div>
                    }
                    code={`<Upload
  title="Upload Files"
  description="Uploaded project attachments"${!demoShowUrl ? '\n  showUrlUpload={false}' : ''}${!demoShowFooter ? '\n  showFooter={false}' : ''}
  onAttach={(files) => handleAttach(files)}
  onCancel={() => setOpen(false)}
/>`}
                    previewPadding={spacing.xs}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
                    <StyledCheckboxControl
                      label="Show URL upload"
                      checked={demoShowUrl}
                      onChange={setDemoShowUrl}
                    />
                    <StyledCheckboxControl
                      label="Show footer actions"
                      checked={demoShowFooter}
                      onChange={setDemoShowFooter}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Composition */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Composition</h2>
            <p style={sharedStyles.sectionDescription}>
              Upload is an organism composed entirely from existing design system primitives:
            </p>
            <div style={{ ...sharedStyles.card, maxWidth: '600px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...typography.label.sm, textAlign: 'left', padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                      Part
                    </th>
                    <th style={{ ...typography.label.sm, textAlign: 'left', padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                      Component
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Select files button', 'Button (emphasis="mid")'],
                    ['Upload URL button', 'Button (emphasis="high"/"low")'],
                    ['Footer actions', 'ButtonGroup + Button'],
                    ['URL input', 'Input'],
                    ['File progress', 'ProgressBar (variant per status)'],
                    ['File/Trash/Retry icons', 'IconFile, IconTrash, IconRefresh'],
                  ].map(([part, comp]) => (
                    <tr key={part}>
                      <td style={{ ...typography.body.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.highEmphasis.onLight }}>
                        {part}
                      </td>
                      <td style={{ ...typography.code.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.lowEmphasis.onLight }}>
                        {comp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* useUpload Hook */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>useUpload Hook</h2>
            <p style={sharedStyles.sectionDescription}>
              For custom upload UIs, use the hook directly:
            </p>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`import { useUpload } from '@/components'

const {
  files,          // UploadFile[]
  isDragOver,     // boolean
  addFiles,       // (FileList | File[]) => void
  addFromUrl,     // (url: string) => void
  removeFile,     // (id: string) => void
  retryFile,      // (id: string) => void
  clearAll,       // () => void
  dragHandlers,   // { onDragOver, onDragEnter, onDragLeave, onDrop }
} = useUpload({
  maxFileSize: 256 * 1024 * 1024,
  accept: ['application/pdf', 'image/*'],
  maxFiles: 10,
  onUpload: async (file, onProgress) => {
    // Your real upload logic here
    await uploadToServer(file, onProgress)
  },
})`}</CodeBlock>
            </div>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>File States</h2>
            <p style={sharedStyles.sectionDescription}>
              Each file in the queue transitions through these states:
            </p>
            <div style={{ ...sharedStyles.card, maxWidth: '600px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...typography.label.sm, textAlign: 'left', padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                      Status
                    </th>
                    <th style={{ ...typography.label.sm, textAlign: 'left', padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                      Progress Bar
                    </th>
                    <th style={{ ...typography.label.sm, textAlign: 'left', padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['uploading', 'Brand (default)', 'Delete'],
                    ['complete', 'Success (green)', 'Delete'],
                    ['error', 'Error (red)', 'Retry + Delete'],
                  ].map(([status, bar, actions]) => (
                    <tr key={status}>
                      <td style={{ ...typography.code.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.highEmphasis.onLight }}>
                        {status}
                      </td>
                      <td style={{ ...typography.body.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.lowEmphasis.onLight }}>
                        {bar}
                      </td>
                      <td style={{ ...typography.body.sm, padding: `${spacing.xs} ${spacing.sm}`, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, color: colors.text.lowEmphasis.onLight }}>
                        {actions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Custom Upload Handler</h2>
            <p style={sharedStyles.sectionDescription}>
              Pass an onUpload function to handle real file uploads. Without it, progress is simulated.
            </p>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`<Upload
  onUpload={async (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    const xhr = new XMLHttpRequest()
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress((e.loaded / e.total) * 100)
      }
    }

    return new Promise((resolve, reject) => {
      xhr.onload = () => resolve()
      xhr.onerror = () => reject()
      xhr.open('POST', '/api/upload')
      xhr.send(formData)
    })
  }}
/>`}</CodeBlock>
            </div>
          </section>

          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>In a Modal</h2>
            <p style={sharedStyles.sectionDescription}>
              Combine with FullScreenModal for the pattern shown in the reference designs:
            </p>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`import { FullScreenModal, Upload } from '@/components'

<FullScreenModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  variant="floating"
  size="md"
  title="Upload Files"
>
  <Upload
    title=""
    description="Uploaded project attachments"
    showFooter={false}
    onAttach={handleAttach}
  />
</FullScreenModal>`}</CodeBlock>
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
