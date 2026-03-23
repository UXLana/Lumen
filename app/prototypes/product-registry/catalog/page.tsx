'use client'

import { useState } from 'react'
import { PrototypeToolbar, type ViewState, type Version } from '@/app/prototypes/PrototypeToolbar'
import CatalogV1 from './CatalogV1'
import CatalogV2 from './CatalogV2'

// =============================================================================
// VERSION CONFIG
// =============================================================================

const VERSIONS: Version[] = [
  { label: 'v1 — Original', description: 'Stats cards, inline select filters, DataTable with table/card toggle' },
  { label: 'v2 — Category Chips', description: 'Category chip tabs, compact stat pills, streamlined product rows, status toggle buttons' },
]

const VERSION_COMPONENTS = [CatalogV1, CatalogV2]

// =============================================================================
// SHELL
// =============================================================================

export default function CatalogPage() {
  const [activeVersion, setActiveVersion] = useState(0)
  const [viewState, setViewState] = useState<ViewState>('default')

  const handleVersionChange = (index: number) => {
    setActiveVersion(index)
    setViewState('default')
  }

  const VersionComponent = VERSION_COMPONENTS[activeVersion]

  return (
    <>
      <VersionComponent viewState={viewState} />
      <PrototypeToolbar
        viewState={viewState}
        onViewStateChange={setViewState}
        versions={VERSIONS}
        activeVersion={activeVersion}
        onVersionChange={handleVersionChange}
      />
    </>
  )
}
