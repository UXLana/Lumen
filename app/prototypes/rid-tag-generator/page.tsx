'use client'

import { useState } from 'react'
import { PrototypeToolbar, type ViewState, type Version } from '@/app/prototypes/PrototypeToolbar'
import TagGeneratorV1, { USE_CASES } from './TagGeneratorV1'
import TagGeneratorV2, { V2_USE_CASES } from './TagGeneratorV2'

// =============================================================================
// VERSION CONFIG
// =============================================================================

const VERSIONS: Version[] = [
  { label: 'v1 — Original', description: 'Initial 4-step wizard flow from March 2026 meeting' },
  { label: 'v2 — Generate First', description: 'Generate-first flow: configure → generate (blocking) → print settings stay editable' },
]

// Map version index → component + use cases
const VERSION_COMPONENTS = [TagGeneratorV1, TagGeneratorV2]
const VERSION_USE_CASES = [USE_CASES, V2_USE_CASES]

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
