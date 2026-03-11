'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  colors,
  spacing,
  fontFamilies,
  fontWeights,
  typography,
  borderRadius,
  borderRadiusSemantics,
  shadowSemantics,
} from '@/styles/design-tokens'
import { Badge, Chip, ChipGroup, Button } from '@/components'
import { StyleguideLayout } from '@/app/design-system/shared'
import registry from './registry.json'

// =============================================================================
// TYPES
// =============================================================================

type PrototypeStatus = 'draft' | 'in-review' | 'approved' | 'archived'

interface ContextDocument {
  label: string
  url: string
  type: 'confluence' | 'notion' | 'jira' | 'figma' | 'other'
}

interface PrototypeContext {
  summary: string
  documents: ContextDocument[]
  notes: string
}

interface PrototypeEntry {
  id: string
  name: string
  description: string
  owner: string
  status: PrototypeStatus
  device: string
  fidelity: string
  created: string
  updated: string
  href: string
  devUrl?: string
  localPath?: string
  screens: number
  prUrl?: string
  tags: string[]
  dsComponents: string[]
  openQuestions: string[]
  lastReviewedBy: string | null
  lastReviewedDate: string | null
  prompts: { date: string; text: string; links?: { label: string; url: string }[] }[]
  context: PrototypeContext | null
}

const prototypes = registry as PrototypeEntry[]

// =============================================================================
// CONFIG & HELPERS
// =============================================================================

const statusConfig: Record<PrototypeStatus, { label: string; color: 'warning' | 'info' | 'success' | 'neutral' }> = {
  draft: { label: 'Draft', color: 'neutral' },
  'in-review': { label: 'In Review', color: 'info' },
  approved: { label: 'Approved', color: 'success' },
  archived: { label: 'Archived', color: 'warning' },
}

const GITHUB_REPO = 'UXLana/mtr-design-system'

function getDiscussUrl(prototype: PrototypeEntry): string {
  if (prototype.prUrl) return prototype.prUrl
  const title = encodeURIComponent(`Feedback: ${prototype.name}`)
  const body = encodeURIComponent(
    `## Prototype: ${prototype.name}\n\n` +
    `**Status:** ${prototype.status}\n` +
    `**Fidelity:** ${prototype.fidelity} | **Device:** ${prototype.device}\n\n` +
    `---\n\n### Feedback\n\n` +
    `<!-- Add your feedback below. Tag reviewers with @username -->\n\n`
  )
  const labels = encodeURIComponent('prototype-feedback')
  return `https://github.com/${GITHUB_REPO}/issues/new?title=${title}&body=${body}&labels=${labels}`
}

const deviceLabels: Record<string, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1440px',
}

const allStatuses: PrototypeStatus[] = ['draft', 'in-review', 'approved', 'archived']
const fidelityLevels = ['wireframe', 'high-fi'] as const

function daysAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'today'
  if (diff === 1) return 'yesterday'
  if (diff < 7) return `${diff}d ago`
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`
  return `${Math.floor(diff / 30)}mo ago`
}

// allTags computed per-tab inside the component

// =============================================================================
// FIDELITY INDICATOR
// =============================================================================

function FidelityIndicator({ current }: { current: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {fidelityLevels.map((level) => {
        const isActive = level === current
        const isPast = fidelityLevels.indexOf(level) <= fidelityLevels.indexOf(current as typeof fidelityLevels[number])
        return (
          <React.Fragment key={level}>
            <div
              title={level}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isPast ? colors.brand.default : colors.border.lowEmphasis.onLight,
                transition: 'background-color 200ms ease-out',
              }}
            />
            {level !== 'high-fi' && (
              <div style={{
                width: '12px',
                height: '2px',
                backgroundColor: fidelityLevels.indexOf(level) < fidelityLevels.indexOf(current as typeof fidelityLevels[number])
                  ? colors.brand.default
                  : colors.border.lowEmphasis.onLight,
              }} />
            )}
          </React.Fragment>
        )
      })}
      <span style={{
        marginLeft: '6px',
        fontFamily: fontFamilies.body,
        fontSize: '11px',
        color: colors.text.lowEmphasis.onLight,
        textTransform: 'capitalize',
      }}>
        {current}
      </span>
    </div>
  )
}

// =============================================================================
// PROTOTYPE CARD
// =============================================================================

type DrawerTab = 'prompts' | 'questions' | 'context'

const STORAGE_KEY = 'mtr-prototype-owner'
const allOwners = Array.from(new Set(prototypes.map((p) => p.owner))).sort()

function useCurrentOwner() {
  const [owner, setOwner] = useState<string>('')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setOwner(stored || allOwners[0] || '')
  }, [])

  const updateOwner = (name: string) => {
    localStorage.setItem(STORAGE_KEY, name)
    setOwner(name)
  }

  return [owner, updateOwner] as const
}

function PrototypeCard({ prototype, onOpenDrawer, currentOwner }: { prototype: PrototypeEntry; onOpenDrawer: (p: PrototypeEntry, tab: DrawerTab) => void; currentOwner: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        menuBtnRef.current && !menuBtnRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])
  const status = statusConfig[prototype.status] || statusConfig.draft
  const questionCount = prototype.openQuestions.length
  const componentCount = prototype.dsComponents.length

  const cardHref = prototype.href || prototype.devUrl
  const isExternalUrl = cardHref?.startsWith('http')

  return (
    <a
      href={cardHref || '#'}
      {...(isExternalUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
        padding: spacing.lg,
        borderRadius: borderRadiusSemantics.card,
        border: `1px solid ${isHovered ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
        backgroundColor: colors.surface.light,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'border-color 200ms ease-out',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header: name + status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm }}>
        <h3 style={{
          margin: 0,
          fontFamily: fontFamilies.display,
          fontSize: typography.heading.h5.fontSize,
          fontWeight: fontWeights.semibold,
          color: colors.text.highEmphasis.onLight,
        }}>
          {prototype.name}
        </h3>
        <Badge color={status.color} variant="filled" size="sm">
          {status.label}
        </Badge>
      </div>

      {/* Description */}
      <p style={{
        margin: 0,
        fontFamily: fontFamilies.body,
        fontSize: typography.body.sm.fontSize,
        lineHeight: '20px',
        color: colors.text.lowEmphasis.onLight,
      }}>
        {prototype.description}
      </p>

      {/* Fidelity progression */}
      <FidelityIndicator current={prototype.fidelity} />

      {/* Tags */}
      {prototype.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {prototype.tags.map((tag) => (
            <span key={tag} style={{
              fontFamily: fontFamilies.body,
              fontSize: '11px',
              color: colors.text.lowEmphasis.onLight,
              backgroundColor: colors.surface.lightDarker,
              padding: `1px ${spacing.xs}`,
              borderRadius: borderRadius.full,
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats row: screens, components, questions, last changed */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing.xs,
        alignItems: 'center',
        marginTop: spacing.xs,
      }}>
        <Badge color="neutral" variant="outlined" size="sm">{prototype.screens} screen{prototype.screens !== 1 ? 's' : ''}</Badge>
        <Badge color={componentCount === 0 ? 'warning' : 'neutral'} variant="outlined" size="sm">{componentCount} DS component{componentCount !== 1 ? 's' : ''}</Badge>
        {questionCount > 0 && (
          <Badge color="warning" variant="outlined" size="sm">{questionCount} open question{questionCount !== 1 ? 's' : ''}</Badge>
        )}
        <Badge color="neutral" variant="outlined" size="sm">Changed {daysAgo(prototype.updated)}</Badge>
      </div>

      {/* Review status */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: fontFamilies.body,
        fontSize: typography.body.xs.fontSize,
        color: colors.text.disabled.onLight,
      }}>
        <span>{prototype.owner}</span>
        {prototype.lastReviewedBy ? (
          <span>Reviewed by {prototype.lastReviewedBy} · {daysAgo(prototype.lastReviewedDate!)}</span>
        ) : (
          <span style={{ color: colors.text.warning }}>Not yet reviewed</span>
        )}
      </div>

      {/* Footer: Give Feedback + Prompts badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacing.sm,
        borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
        marginTop: 'auto',
      }}>
        <Button
          emphasis="low"
          size="md"
          leftIcon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 .5A7.77 7.77 0 0 0 .5 8a7.75 7.75 0 0 0 5.3 7.37c.39.07.53-.17.53-.37V13.58c-2.15.47-2.6-1.04-2.6-1.04-.35-.9-.86-1.13-.86-1.13-.7-.48.06-.47.06-.47.78.05 1.19.8 1.19.8.69 1.18 1.81.84 2.25.64.07-.5.27-.84.49-1.04-1.72-.2-3.53-.86-3.53-3.83 0-.85.3-1.54.8-2.08-.08-.2-.35-.99.07-2.05 0 0 .65-.21 2.13.8A7.42 7.42 0 0 1 8 3.82c.66 0 1.32.09 1.94.26 1.48-1 2.13-.8 2.13-.8.42 1.06.15 1.85.07 2.05.5.54.8 1.23.8 2.08 0 2.98-1.81 3.63-3.54 3.82.28.24.53.71.53 1.44v2.13c0 .21.14.45.54.37A7.75 7.75 0 0 0 15.5 8 7.77 7.77 0 0 0 8 .5z" fill="currentColor"/>
            </svg>
          }
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            window.open(getDiscussUrl(prototype), '_blank', 'noopener')
          }}
        >
          {prototype.prUrl ? 'View PR' : 'Give Feedback'}
        </Button>
        {/* Overflow menu */}
        <div style={{ position: 'relative' }}>
          <button
            ref={menuBtnRef}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setMenuOpen(!menuOpen)
            }}
            aria-label="More options"
            aria-expanded={menuOpen}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: borderRadiusSemantics.button,
              cursor: 'pointer',
              color: colors.text.lowEmphasis.onLight,
              transition: 'background-color 150ms ease-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hover.onLight
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="3" r="1.5" fill="currentColor" />
              <circle cx="8" cy="8" r="1.5" fill="currentColor" />
              <circle cx="8" cy="13" r="1.5" fill="currentColor" />
            </svg>
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              style={{
                position: 'absolute',
                bottom: '100%',
                right: 0,
                marginBottom: '4px',
                minWidth: '180px',
                backgroundColor: colors.surface.light,
                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                borderRadius: borderRadiusSemantics.card,
                boxShadow: shadowSemantics.dropdown,
                overflow: 'hidden',
                zIndex: 10,
              }}
            >
              <OverflowMenuItem
                label={`Prompts (${(prototype.prompts || []).length})`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setMenuOpen(false)
                  onOpenDrawer(prototype, 'prompts')
                }}
              />
              <OverflowMenuItem
                label={`Open Questions (${prototype.openQuestions.length})`}
                emphasis={prototype.openQuestions.length > 0}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setMenuOpen(false)
                  onOpenDrawer(prototype, 'questions')
                }}
              />
              <OverflowMenuItem
                label={`Context${prototype.context ? '' : ' (empty)'}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setMenuOpen(false)
                  onOpenDrawer(prototype, 'context')
                }}
              />
              {prototype.owner === currentOwner && (
                <>
                  <div style={{ height: '1px', backgroundColor: colors.border.lowEmphasis.onLight, margin: `${spacing['2xs']} 0` }} />
                  <OverflowMenuItem
                    label="Edit in Cursor"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setMenuOpen(false)
                      const path = prototype.localPath || `/Users/lanaholston/Desktop/Code/app/prototypes/${prototype.id}`
                      window.open(`cursor://file${path}`, '_self')
                    }}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </a>
  )
}

function OverflowMenuItem({ label, emphasis, onClick }: {
  label: string
  emphasis?: boolean
  onClick: (e: React.MouseEvent) => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: `${spacing.xs} ${spacing.sm}`,
        fontFamily: fontFamilies.body,
        fontSize: typography.body.sm.fontSize,
        fontWeight: fontWeights.regular,
        color: emphasis ? colors.text.warning : colors.text.highEmphasis.onLight,
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 150ms ease-out',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hover.onLight }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
    >
      {label}
    </button>
  )
}

function StatItem({ label, icon, emphasis }: { label: string; icon?: React.ReactNode; emphasis?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '3px',
      color: emphasis ? colors.text.warning : undefined,
    }}>
      {icon}
      {label}
    </span>
  )
}

function QuestionIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 4.5a1.5 1.5 0 0 1 2.83.7c0 1-1.33 1.3-1.33 1.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6" cy="8.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

// =============================================================================
// PAGE
// =============================================================================

export default function PrototypesIndexPage() {
  const [currentOwner, setCurrentOwner] = useCurrentOwner()
  const [ownershipTab, setOwnershipTab] = useState<'mine' | 'others'>('mine')
  const [activeStatusFilter, setActiveStatusFilter] = useState<PrototypeStatus | 'all'>('all')
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null)
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [drawerPrototype, setDrawerPrototype] = useState<PrototypeEntry | null>(null)
  const [drawerTab, setDrawerTab] = useState<DrawerTab>('prompts')

  const ownershipFiltered = prototypes.filter((p) =>
    ownershipTab === 'mine' ? p.owner === currentOwner : p.owner !== currentOwner
  )

  const filtered = ownershipFiltered
    .filter((p) => activeStatusFilter === 'all' || p.status === activeStatusFilter)
    .filter((p) => !activeTagFilter || p.tags.includes(activeTagFilter))

  const counts: Record<string, number> = {
    all: ownershipFiltered.length,
    ...Object.fromEntries(allStatuses.map((s) => [s, ownershipFiltered.filter((p) => p.status === s).length])),
  }

  const mineCount = prototypes.filter((p) => p.owner === currentOwner).length
  const othersCount = prototypes.filter((p) => p.owner !== currentOwner).length
  const allTags = Array.from(new Set(ownershipFiltered.flatMap((p) => p.tags))).sort()

  return (
    <StyleguideLayout
      activeId="prototypes-index"
      title="Prototypes"
      description="Browse all prototypes built with the MTR Design System."
      tabs={[]}
      headerAction={allOwners.length > 1 ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          fontFamily: fontFamilies.body,
          fontSize: typography.body.sm.fontSize,
          color: colors.text.lowEmphasis.onDark,
        }}>
          <span>Viewing as</span>
          <select
            value={currentOwner}
            onChange={(e) => {
              setCurrentOwner(e.target.value)
              setOwnershipTab('mine')
              setActiveStatusFilter('all')
              setActiveTagFilter(null)
            }}
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.sm.fontSize,
              fontWeight: fontWeights.semibold,
              color: colors.text.highEmphasis.onDark,
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: `1px solid rgba(255,255,255,0.25)`,
              borderRadius: borderRadiusSemantics.badge,
              padding: `${spacing['2xs']} ${spacing.sm}`,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {allOwners.map((owner) => (
              <option key={owner} value={owner} style={{ color: colors.text.highEmphasis.onLight, backgroundColor: colors.surface.light }}>{owner}</option>
            ))}
          </select>
        </div>
      ) : undefined}
    >
      <div style={{ maxWidth: '960px' }}>
        {/* Ownership tabs */}
        <div
          role="tablist"
          aria-label="Filter by ownership"
          style={{
            display: 'flex',
            gap: spacing.xl,
            marginBottom: spacing.lg,
            borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }}
        >
          {([
            { key: 'mine' as const, label: 'My Prototypes', count: mineCount },
            { key: 'others' as const, label: 'Other Prototypes', count: othersCount },
          ]).map((tab) => {
            const isActive = ownershipTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setOwnershipTab(tab.key)
                  setActiveStatusFilter('all')
                  setActiveTagFilter(null)
                }}
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.md.fontSize,
                  fontWeight: isActive ? fontWeights.semibold : fontWeights.regular,
                  color: isActive ? colors.text.highEmphasis.onLight : colors.text.lowEmphasis.onLight,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${isActive ? colors.brand.default : 'transparent'}`,
                  padding: `${spacing.sm} 0 ${spacing.md}`,
                  cursor: 'pointer',
                  transition: 'color 150ms ease-out',
                }}
              >
                {tab.label} ({tab.count})
              </button>
            )
          })}
        </div>

        {/* Status filter chips */}
        <div style={{ marginBottom: spacing.lg }}>
          <ChipGroup aria-label="Filter prototypes by status">
            {(['all', ...allStatuses] as const).map((filter) => {
              const isActive = activeStatusFilter === filter
              const label = filter === 'all' ? 'All' : statusConfig[filter].label
              return (
                <Chip
                  key={filter}
                  selected={isActive}
                  onSelect={() => setActiveStatusFilter(filter)}
                >
                  {label} ({counts[filter]})
                </Chip>
              )
            })}
            <Chip
              selected={showMoreFilters}
              onSelect={() => {
                setShowMoreFilters(!showMoreFilters)
                if (showMoreFilters) setActiveTagFilter(null)
              }}
            >
              {showMoreFilters ? '−' : '+'}
            </Chip>
          </ChipGroup>
        </div>

        {/* Tag filters — collapsible */}
        {showMoreFilters && (
          <div style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            marginBottom: spacing.lg,
          }}>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTagFilter(activeTagFilter === tag ? null : tag)}
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: '11px',
                  color: activeTagFilter === tag ? colors.brand.default : colors.text.lowEmphasis.onLight,
                  backgroundColor: activeTagFilter === tag ? colors.surface.light : 'transparent',
                  border: `1px solid ${activeTagFilter === tag ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadius.full,
                  padding: `2px ${spacing.xs}`,
                  cursor: 'pointer',
                  transition: 'all 150ms ease-out',
                }}
              >
                {tag}
              </button>
            ))}
            {activeTagFilter && (
              <button
                type="button"
                onClick={() => setActiveTagFilter(null)}
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: '11px',
                  color: colors.text.disabled.onLight,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: `2px ${spacing.xs}`,
                }}
              >
                clear
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: spacing.lg,
        }}>
          {filtered.map((prototype) => (
            <PrototypeCard key={prototype.id} prototype={prototype} currentOwner={currentOwner} onOpenDrawer={(p, tab) => { setDrawerPrototype(p); setDrawerTab(tab) }} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: spacing['2xl'],
            fontFamily: fontFamilies.body,
            fontSize: typography.body.md.fontSize,
            color: colors.text.disabled.onLight,
          }}>
            No prototypes match this filter.
          </div>
        )}
      </div>

      {/* Prompts drawer */}
      <DetailDrawer
        prototype={drawerPrototype}
        activeTab={drawerTab}
        onTabChange={setDrawerTab}
        onClose={() => setDrawerPrototype(null)}
      />
    </StyleguideLayout>
  )
}

// =============================================================================
// DETAIL DRAWER (Prompts + Open Questions)
// =============================================================================

function DetailDrawer({ prototype, activeTab, onTabChange, onClose }: {
  prototype: PrototypeEntry | null
  activeTab: DrawerTab
  onTabChange: (tab: DrawerTab) => void
  onClose: () => void
}) {
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!prototype) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [prototype, onClose])

  useEffect(() => {
    if (prototype && drawerRef.current) drawerRef.current.focus()
  }, [prototype])

  if (!prototype) return null

  const prompts = prototype.prompts || []
  const questions = prototype.openQuestions || []
  const context = prototype.context

  const tabs: { key: DrawerTab; label: string; count?: number }[] = [
    { key: 'prompts', label: 'Prompts', count: prompts.length },
    { key: 'questions', label: 'Open Questions', count: questions.length },
    { key: 'context', label: 'Context' },
  ]

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: colors.scrim,
          zIndex: 1000,
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label={`Details for ${prototype.name}`}
        tabIndex={-1}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '50vw',
          maxWidth: '720px',
          minWidth: '360px',
          backgroundColor: colors.surface.light,
          borderLeft: `1px solid ${colors.border.lowEmphasis.onLight}`,
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${spacing.lg} ${spacing.xl} 0`,
          flexShrink: 0,
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h4.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
          }}>
            {prototype.name}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: borderRadiusSemantics.button,
              cursor: 'pointer',
              color: colors.text.lowEmphasis.onLight,
              transition: 'background-color 150ms ease-out',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hover.onLight }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: spacing.lg,
          padding: `${spacing.md} ${spacing.xl} 0`,
          borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
          flexShrink: 0,
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.sm.fontSize,
                  fontWeight: isActive ? fontWeights.semibold : fontWeights.regular,
                  color: isActive ? colors.brand.default : colors.text.lowEmphasis.onLight,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${isActive ? colors.brand.default : 'transparent'}`,
                  padding: `${spacing.xs} 0 ${spacing.sm}`,
                  cursor: 'pointer',
                  transition: 'color 150ms ease-out',
                }}
              >
                {tab.label}{tab.count !== undefined ? ` (${tab.count})` : ''}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: `${spacing.lg} ${spacing.xl}`,
        }}>
          {activeTab === 'prompts' && (
            prompts.length === 0 ? (
              <DrawerEmptyState message="No prompts recorded yet. Prompts are captured each time /prototype-builder is invoked." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {prompts.map((prompt, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: spacing.md,
                      padding: spacing.md,
                      backgroundColor: colors.surface.lightDarker,
                      borderRadius: borderRadiusSemantics.card,
                      border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: colors.surface.light,
                      border: `1px solid ${colors.border.midEmphasis.onLight}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontFamily: fontFamilies.mono,
                      fontSize: typography.body.xs.fontSize,
                      fontWeight: fontWeights.semibold,
                      color: colors.text.lowEmphasis.onLight,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: fontFamilies.mono,
                        fontSize: '11px',
                        color: colors.text.disabled.onLight,
                        marginBottom: '4px',
                      }}>
                        {prompt.date}
                      </div>
                      <div style={{
                        fontFamily: fontFamilies.body,
                        fontSize: typography.body.sm.fontSize,
                        color: colors.text.highEmphasis.onLight,
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}>
                        {prompt.text}
                      </div>
                      {prompt.links && prompt.links.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs }}>
                          {prompt.links.map((link, li) => (
                            <a
                              key={li}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontFamily: fontFamilies.body,
                                fontSize: typography.body.xs.fontSize,
                                fontWeight: fontWeights.medium,
                                color: colors.text.action.enabled,
                                textDecoration: 'none',
                                padding: `2px ${spacing.xs}`,
                                backgroundColor: colors.surface.light,
                                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                                borderRadius: borderRadiusSemantics.badge,
                                transition: 'border-color 150ms ease-out',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.text.action.enabled }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border.lowEmphasis.onLight }}
                            >
                              <LinkIcon />
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'questions' && (
            questions.length === 0 ? (
              <DrawerEmptyState message="No open questions. All questions have been resolved." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {questions.map((question, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: spacing.sm,
                      padding: spacing.md,
                      backgroundColor: colors.surface.lightDarker,
                      borderRadius: borderRadiusSemantics.card,
                      border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: colors.surface.warning,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: colors.text.warning,
                    }}>
                      <QuestionIcon />
                    </div>
                    <div style={{
                      fontFamily: fontFamilies.body,
                      fontSize: typography.body.sm.fontSize,
                      color: colors.text.highEmphasis.onLight,
                      lineHeight: '1.5',
                      paddingTop: '4px',
                    }}>
                      {question}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'context' && (
            <ContextTabContent context={context} prototypeId={prototype.id} />
          )}
        </div>
      </div>
    </>
  )
}

// =============================================================================
// CONTEXT TAB
// =============================================================================

const DOC_TYPE_LABELS: Record<string, string> = {
  confluence: 'Confluence',
  notion: 'Notion',
  jira: 'Jira',
  figma: 'Figma',
  other: 'Link',
}

function ContextTabContent({ context, prototypeId }: { context: PrototypeContext | null; prototypeId: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editSummary, setEditSummary] = useState(context?.summary || '')
  const [editNotes, setEditNotes] = useState(context?.notes || '')
  const [editDocs, setEditDocs] = useState<ContextDocument[]>(context?.documents || [])
  const [newDocLabel, setNewDocLabel] = useState('')
  const [newDocUrl, setNewDocUrl] = useState('')
  const [newDocType, setNewDocType] = useState<ContextDocument['type']>('confluence')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const handleStartEdit = () => {
    setEditSummary(context?.summary || '')
    setEditNotes(context?.notes || '')
    setEditDocs(context?.documents || [])
    setIsEditing(true)
  }

  const handleAddDoc = () => {
    if (!newDocLabel.trim() || !newDocUrl.trim()) return
    setEditDocs([...editDocs, { label: newDocLabel.trim(), url: newDocUrl.trim(), type: newDocType }])
    setNewDocLabel('')
    setNewDocUrl('')
    setNewDocType('confluence')
  }

  const handleRemoveDoc = (index: number) => {
    setEditDocs(editDocs.filter((_, i) => i !== index))
  }

  const handleCopyJson = () => {
    const updatedContext: PrototypeContext = {
      summary: editSummary.trim(),
      documents: editDocs,
      notes: editNotes.trim(),
    }
    const json = JSON.stringify(updatedContext, null, 2)
    navigator.clipboard.writeText(json).then(() => {
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    })
  }

  // View mode
  if (!isEditing) {
    if (!context) {
      return (
        <div style={{ textAlign: 'center', padding: spacing['2xl'] }}>
          <DrawerEmptyState message="No context added yet. Add business context, research links, and notes to help collaborators understand this prototype." />
          <Button emphasis="mid" size="md" onClick={handleStartEdit} style={{ marginTop: spacing.md }}>
            Add Context
          </Button>
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
        {/* Edit button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleStartEdit}
            aria-label="Edit context"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing['2xs'],
              fontFamily: fontFamilies.body,
              fontSize: typography.body.sm.fontSize,
              fontWeight: fontWeights.medium,
              color: colors.text.action.enabled,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: `${spacing['2xs']} ${spacing.xs}`,
              borderRadius: borderRadiusSemantics.button,
              transition: 'background-color 150ms ease-out',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hover.onLight }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <EditIcon />
            Edit
          </button>
        </div>

        {/* Summary */}
        {context.summary && (
          <div>
            <ContextSectionLabel>Summary</ContextSectionLabel>
            <p style={{
              margin: 0,
              fontFamily: fontFamilies.body,
              fontSize: typography.body.sm.fontSize,
              color: colors.text.highEmphasis.onLight,
              lineHeight: '1.6',
            }}>
              {context.summary}
            </p>
          </div>
        )}

        {/* Documents */}
        {context.documents.length > 0 && (
          <div>
            <ContextSectionLabel>Linked Documents</ContextSectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              {context.documents.map((doc, i) => (
                <a
                  key={i}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    backgroundColor: colors.surface.lightDarker,
                    borderRadius: borderRadiusSemantics.card,
                    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                    textDecoration: 'none',
                    transition: 'border-color 150ms ease-out',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.text.action.enabled }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border.lowEmphasis.onLight }}
                >
                  <span style={{
                    fontFamily: fontFamilies.mono,
                    fontSize: '10px',
                    fontWeight: fontWeights.medium,
                    color: colors.text.lowEmphasis.onLight,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    flexShrink: 0,
                    minWidth: '72px',
                  }}>
                    {DOC_TYPE_LABELS[doc.type] || doc.type}
                  </span>
                  <span style={{
                    fontFamily: fontFamilies.body,
                    fontSize: typography.body.sm.fontSize,
                    color: colors.text.action.enabled,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {doc.label}
                  </span>
                  <LinkIcon />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {context.notes && (
          <div>
            <ContextSectionLabel>Notes</ContextSectionLabel>
            <div style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.sm.fontSize,
              color: colors.text.highEmphasis.onLight,
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {context.notes}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Edit mode
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* Summary */}
      <div>
        <ContextSectionLabel>Summary</ContextSectionLabel>
        <textarea
          value={editSummary}
          onChange={(e) => setEditSummary(e.target.value)}
          placeholder="Brief description of business context, goals, and rationale..."
          rows={3}
          style={{
            width: '100%',
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.highEmphasis.onLight,
            backgroundColor: colors.surface.light,
            border: `1px solid ${colors.border.midEmphasis.onLight}`,
            borderRadius: borderRadiusSemantics.input,
            padding: spacing.sm,
            resize: 'vertical',
            outline: 'none',
            lineHeight: '1.5',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = colors.focusBorder.onLight }}
          onBlur={(e) => { e.currentTarget.style.borderColor = colors.border.midEmphasis.onLight }}
        />
      </div>

      {/* Documents */}
      <div>
        <ContextSectionLabel>Linked Documents</ContextSectionLabel>

        {/* Existing docs */}
        {editDocs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, marginBottom: spacing.sm }}>
            {editDocs.map((doc, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  padding: `${spacing['2xs']} ${spacing.sm}`,
                  backgroundColor: colors.surface.lightDarker,
                  borderRadius: borderRadiusSemantics.card,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                }}
              >
                <span style={{
                  fontFamily: fontFamilies.mono,
                  fontSize: '10px',
                  fontWeight: fontWeights.medium,
                  color: colors.text.lowEmphasis.onLight,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  flexShrink: 0,
                  minWidth: '72px',
                }}>
                  {DOC_TYPE_LABELS[doc.type] || doc.type}
                </span>
                <span style={{
                  flex: 1,
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.sm.fontSize,
                  color: colors.text.highEmphasis.onLight,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {doc.label}
                </span>
                <button
                  onClick={() => handleRemoveDoc(i)}
                  aria-label={`Remove ${doc.label}`}
                  style={{
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.text.disabled.onLight,
                    borderRadius: borderRadiusSemantics.button,
                    flexShrink: 0,
                    transition: 'color 150ms ease-out',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = colors.status.important }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = colors.text.disabled.onLight }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new doc */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.xs,
          padding: spacing.sm,
          backgroundColor: colors.surface.lightDarker,
          borderRadius: borderRadiusSemantics.card,
          border: `1px dashed ${colors.border.lowEmphasis.onLight}`,
        }}>
          <div style={{ display: 'flex', gap: spacing.xs }}>
            <select
              value={newDocType}
              onChange={(e) => setNewDocType(e.target.value as ContextDocument['type'])}
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.sm.fontSize,
                color: colors.text.highEmphasis.onLight,
                backgroundColor: colors.surface.light,
                border: `1px solid ${colors.border.midEmphasis.onLight}`,
                borderRadius: borderRadiusSemantics.input,
                padding: `${spacing['2xs']} ${spacing.xs}`,
                flexShrink: 0,
                outline: 'none',
              }}
            >
              <option value="confluence">Confluence</option>
              <option value="notion">Notion</option>
              <option value="jira">Jira</option>
              <option value="figma">Figma</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              value={newDocLabel}
              onChange={(e) => setNewDocLabel(e.target.value)}
              placeholder="Label"
              style={{
                flex: 1,
                fontFamily: fontFamilies.body,
                fontSize: typography.body.sm.fontSize,
                color: colors.text.highEmphasis.onLight,
                backgroundColor: colors.surface.light,
                border: `1px solid ${colors.border.midEmphasis.onLight}`,
                borderRadius: borderRadiusSemantics.input,
                padding: `${spacing['2xs']} ${spacing.xs}`,
                outline: 'none',
                minWidth: 0,
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: spacing.xs }}>
            <input
              type="url"
              value={newDocUrl}
              onChange={(e) => setNewDocUrl(e.target.value)}
              placeholder="https://..."
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddDoc() }}
              style={{
                flex: 1,
                fontFamily: fontFamilies.body,
                fontSize: typography.body.sm.fontSize,
                color: colors.text.highEmphasis.onLight,
                backgroundColor: colors.surface.light,
                border: `1px solid ${colors.border.midEmphasis.onLight}`,
                borderRadius: borderRadiusSemantics.input,
                padding: `${spacing['2xs']} ${spacing.xs}`,
                outline: 'none',
                minWidth: 0,
              }}
            />
            <Button emphasis="mid" size="md" onClick={handleAddDoc} disabled={!newDocLabel.trim() || !newDocUrl.trim()}>
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <ContextSectionLabel>Notes</ContextSectionLabel>
        <textarea
          value={editNotes}
          onChange={(e) => setEditNotes(e.target.value)}
          placeholder="Constraints, stakeholder decisions, regulatory requirements, research findings..."
          rows={6}
          style={{
            width: '100%',
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.highEmphasis.onLight,
            backgroundColor: colors.surface.light,
            border: `1px solid ${colors.border.midEmphasis.onLight}`,
            borderRadius: borderRadiusSemantics.input,
            padding: spacing.sm,
            resize: 'vertical',
            outline: 'none',
            lineHeight: '1.5',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = colors.focusBorder.onLight }}
          onBlur={(e) => { e.currentTarget.style.borderColor = colors.border.midEmphasis.onLight }}
        />
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacing.sm,
        borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
      }}>
        <Button emphasis="low" size="md" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <div style={{ display: 'flex', gap: spacing.xs, alignItems: 'center' }}>
          {copyFeedback && (
            <span style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.xs.fontSize,
              color: colors.status.success,
            }}>
              Copied to clipboard
            </span>
          )}
          <Button emphasis="high" size="md" onClick={handleCopyJson}>
            Copy JSON
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        padding: spacing.sm,
        backgroundColor: colors.surface.lightDarker,
        borderRadius: borderRadiusSemantics.card,
        fontFamily: fontFamilies.body,
        fontSize: typography.body.xs.fontSize,
        color: colors.text.lowEmphasis.onLight,
        lineHeight: '1.5',
      }}>
        Copy the JSON above and paste it as the <code style={{ fontFamily: fontFamilies.mono, fontSize: '11px' }}>&quot;context&quot;</code> value
        for <code style={{ fontFamily: fontFamilies.mono, fontSize: '11px' }}>&quot;{prototypeId}&quot;</code> in{' '}
        <code style={{ fontFamily: fontFamilies.mono, fontSize: '11px' }}>app/prototypes/registry.json</code>.
      </div>
    </div>
  )
}

function ContextSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: fontFamilies.mono,
      fontSize: '10px',
      fontWeight: fontWeights.semibold,
      color: colors.text.lowEmphasis.onLight,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginBottom: spacing.xs,
    }}>
      {children}
    </div>
  )
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M10 1.5l2.5 2.5L4.5 12H2v-2.5L10 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DrawerEmptyState({ message }: { message: string }) {
  return (
    <p style={{
      fontFamily: fontFamilies.body,
      fontSize: typography.body.md.fontSize,
      color: colors.text.disabled.onLight,
      textAlign: 'center',
      padding: spacing['2xl'],
      lineHeight: '1.5',
    }}>
      {message}
    </p>
  )
}

function LinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M5 7L7 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6.5 8.5L5.3 9.7a1.8 1.8 0 0 1-2.5-2.5L4 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5.5 3.5L6.7 2.3a1.8 1.8 0 0 1 2.5 2.5L8 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// =============================================================================
// STAT CARD ICONS
// =============================================================================

function PrototypesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L3 7.5l9 5.5 9-5.5L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12l9 5.5L21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 16.5l9 5.5 9-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function QuestionCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 9a3 3 0 0 1 5.12 2.13c0 2-2.62 2.62-2.62 2.62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.75" fill="currentColor" />
    </svg>
  )
}

function ReviewIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
