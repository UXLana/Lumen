'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  colors,
  spacing,
  fontFamilies,
  fontWeights,
  typography,
  borderRadiusSemantics,
  zIndex,
  shadowSemantics,
} from '@/styles/design-tokens'
import { useThemeSwitcher, availableThemes } from '@/styles/themes'
import { Button } from '@/components'

// =============================================================================
// TYPES
// =============================================================================

export type ViewState = 'default' | 'loading' | 'empty' | 'error'

export interface UseCase {
  /** Short identifier shown in the selector, e.g. "Use Case 1" */
  label: string
  /** Brief description of the scenario */
  description: string
}

export interface Version {
  /** Short label shown in the selector, e.g. "v1", "v2 — Updated layout" */
  label: string
  /** Brief description of what changed in this version */
  description: string
}

interface PrototypeToolbarProps {
  viewState: ViewState
  onViewStateChange: (state: ViewState) => void
  /** Additional states beyond the standard four */
  extraStates?: string[]
  /** Versions of this prototype (selector shown when 2+) */
  versions?: Version[]
  /** Currently selected version index */
  activeVersion?: number
  /** Callback when version changes */
  onVersionChange?: (index: number) => void
  /** Use cases / scenarios for this prototype */
  useCases?: UseCase[]
  /** Currently selected use case index */
  activeUseCase?: number
  /** Callback when use case changes */
  onUseCaseChange?: (index: number) => void
  /** Keyboard shortcut to toggle visibility. Default: Cmd+. (Mac) / Ctrl+. (Windows).
   *  Set to false to disable. Useful for hiding during user testing. */
  hotkey?: string | false
  /** Start hidden (e.g. for user testing). Toggle with hotkey. */
  initiallyHidden?: boolean
}

const VIEW_STATES: ViewState[] = ['default', 'loading', 'empty', 'error']

// =============================================================================
// SHARED STYLES
// =============================================================================

const labelStyle: React.CSSProperties = {
  fontFamily: fontFamilies.mono,
  fontSize: '10px',
  fontWeight: fontWeights.semibold,
  color: colors.text.disabled.onLight,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '4px',
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: `4px ${spacing.xs}`,
  fontFamily: fontFamilies.body,
  fontSize: typography.body.sm.fontSize,
  fontWeight: fontWeights.regular,
  color: colors.text.highEmphasis.onLight,
  backgroundColor: colors.surface.light,
  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
  borderRadius: borderRadiusSemantics.input,
  cursor: 'pointer',
  outline: 'none',
  appearance: 'auto' as React.CSSProperties['appearance'],
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PrototypeToolbar({
  viewState,
  onViewStateChange,
  extraStates,
  versions,
  activeVersion,
  onVersionChange,
  useCases,
  activeUseCase,
  onUseCaseChange,
  hotkey,
  initiallyHidden = false,
}: PrototypeToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(!initiallyHidden)
  const { themeName, setThemeName } = useThemeSwitcher()
  const [showAllPrototypes, setShowAllPrototypes] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Show "All Prototypes" link on non-index pages
  useEffect(() => {
    setShowAllPrototypes(window.location.pathname !== '/prototypes')
  }, [])

  // Keyboard shortcut to toggle visibility (default: Cmd/Ctrl + .)
  useEffect(() => {
    if (hotkey === false) return
    function handleKey(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey
      if (isMod && e.key === '.') {
        e.preventDefault()
        setIsVisible(v => {
          if (v) setIsOpen(false) // close panel when hiding
          return !v
        })
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [hotkey])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen])

  // Hidden — render nothing (hotkey still active)
  if (!isVisible) return null

  const allStates = extraStates ? [...VIEW_STATES, ...extraStates] : VIEW_STATES
  const hasVersions = versions && versions.length > 1 && onVersionChange
  const hasUseCases = useCases && useCases.length > 0 && onUseCaseChange

  return (
    <>
      {/* Trigger button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Prototype dev tools"
        aria-expanded={isOpen}
        style={{
          position: 'fixed',
          bottom: spacing.xl,
          left: spacing.xl,
          zIndex: zIndex.modal,
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isOpen ? colors.brand.default : 'rgba(0, 0, 0, 0.85)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: shadowSemantics.dropdown,
          transition: 'background-color 150ms ease-out',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M6.75 2.25h4.5M6.75 9h4.5M6.75 15.75h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="4.5" cy="2.25" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="13.5" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="4.5" cy="15.75" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            bottom: '74px',
            left: spacing.xl,
            zIndex: zIndex.modal,
            width: '280px',
            backgroundColor: colors.surface.light,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadiusSemantics.card,
            boxShadow: shadowSemantics.dropdown,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
            padding: spacing.sm,
          }}
        >
          {/* Version selector */}
          {hasVersions && (
            <div>
              <div style={labelStyle}>Version</div>
              <select
                value={activeVersion ?? 0}
                onChange={(e) => onVersionChange(Number(e.target.value))}
                aria-label="Prototype version"
                style={selectStyle}
              >
                {versions.map((v, i) => (
                  <option key={i} value={i}>
                    {v.label}
                  </option>
                ))}
              </select>
              {versions[activeVersion ?? 0] && (
                <div
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.body.xs.fontSize,
                    color: colors.text.lowEmphasis.onLight,
                    marginTop: '4px',
                    lineHeight: '1.4',
                  }}
                >
                  {versions[activeVersion ?? 0].description}
                </div>
              )}
            </div>
          )}

          {/* Use case selector */}
          {hasUseCases && (
            <div>
              <div style={labelStyle}>Use Case</div>
              <select
                value={activeUseCase ?? 0}
                onChange={(e) => onUseCaseChange(Number(e.target.value))}
                aria-label="Use case scenario"
                style={selectStyle}
              >
                {useCases.map((uc, i) => (
                  <option key={i} value={i}>
                    {uc.label}
                  </option>
                ))}
              </select>
              {useCases[activeUseCase ?? 0] && (
                <div
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.body.xs.fontSize,
                    color: colors.text.lowEmphasis.onLight,
                    marginTop: '4px',
                    lineHeight: '1.4',
                  }}
                >
                  {useCases[activeUseCase ?? 0].description}
                </div>
              )}
            </div>
          )}

          {/* State selector */}
          <div>
            <div style={labelStyle}>State</div>
            <select
              value={viewState}
              onChange={(e) => onViewStateChange(e.target.value as ViewState)}
              aria-label="Prototype view state"
              style={selectStyle}
            >
              {allStates.map((state) => (
                <option key={state} value={state}>
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Theme selector */}
          <div>
            <div style={labelStyle}>Theme</div>
            <select
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              aria-label="Theme"
              style={selectStyle}
            >
              {availableThemes.map((theme) => (
                <option key={theme.name} value={theme.name}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          {/* All Prototypes link */}
          {showAllPrototypes && (
            <div style={{ borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`, marginTop: spacing['2xs'], paddingTop: spacing.sm }}>
              <Button emphasis="low" size="md" onClick={() => { window.location.href = '/prototypes' }}>
                All Prototypes
              </Button>
            </div>
          )}

        </div>
      )}
    </>
  )
}
