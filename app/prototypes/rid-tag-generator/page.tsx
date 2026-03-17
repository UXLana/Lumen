'use client'

import { useState } from 'react'
import { PrototypeToolbar, type ViewState, type Version } from '@/app/prototypes/PrototypeToolbar'
import TagGeneratorV1, { USE_CASES } from './TagGeneratorV1'

// =============================================================================
// VERSION CONFIG
// =============================================================================

const VERSIONS: Version[] = [
  { label: 'v1 — Original', description: 'Initial wizard flow from March 2026 meeting' },
  { label: 'v2 — Placeholder', description: 'Placeholder version — replace with a real variation when ready' },
]

// Map version index → component + use cases
// v2 reuses v1 for now — replace with a real TagGeneratorV2 when ready
const VERSION_COMPONENTS = [TagGeneratorV1, TagGeneratorV1]
const VERSION_USE_CASES = [USE_CASES, USE_CASES]

// =============================================================================
// SHELL
// =============================================================================

export default function RidTagGeneratorPage() {
  const [activeVersion, setActiveVersion] = useState(0)
  const [viewState, setViewState] = useState<ViewState>('default')
  const [activeUseCase, setActiveUseCase] = useState(0)

  // Reset toolbar state when version changes
  const handleVersionChange = (index: number) => {
    setActiveVersion(index)
    setViewState('default')
    setActiveUseCase(0)
  }

  const VersionComponent = VERSION_COMPONENTS[activeVersion]
  const currentUseCases = VERSION_USE_CASES[activeVersion]

  return (
    <>
      <VersionComponent
        viewState={viewState}
        activeUseCase={activeUseCase}
      />
      <PrototypeToolbar
        viewState={viewState}
        onViewStateChange={setViewState}
        versions={VERSIONS}
        activeVersion={activeVersion}
        onVersionChange={handleVersionChange}
        useCases={currentUseCases}
        activeUseCase={activeUseCase}
        onUseCaseChange={setActiveUseCase}
      />
    </>
  )
}
