'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  transitionPresets,
  fontFamilies,
  breakpoints,
  sidebar,
  header,
} from '@/styles/design-tokens'
import { SegmentedControl, Avatar, Header } from '@/components'
import {
  IconFoundations,
  IconComponents,
  IconChevronRight,
  IconSidebarOpen,
  IconSidebarClose,
} from '@/components/Icons'
import { type LeftNavSection, type LeftNavItem } from '@/components/LeftNav'
import { LeftNavSegmented } from '@/components/LeftNavSegmented'
import { useThemeSwitcher, availableThemes } from '@/styles/themes'

// =============================================================================
// CONSTANTS
// =============================================================================

const SIDEBAR_WIDTH = parseInt(sidebar.width) // 278px
const SIDEBAR_COLLAPSED_WIDTH = 40 // toggle-only strip (no icon-only mid-state)
const MOBILE_BREAKPOINT = parseInt(breakpoints.md) // 768px
const HEADER_HEIGHT = parseInt(header.height) // 64px

// =============================================================================
// CUSTOM ICONS (Not in the main library)
// =============================================================================

// Layers icon for Prototypes section
const IconPrototypes = () => (
  <svg aria-hidden="true" width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2L2 6.5l8 4.5 8-4.5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 10l8 4.5L18 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 13.5l8 4.5 8-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Bar chart icon for Data Visualization section
const IconDataViz = () => (
  <svg aria-hidden="true" width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="3" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="7" y="6" width="3" height="11" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="12" y="3" width="3" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 3l5 3 5-2.5 5 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// =============================================================================
// NAVIGATION DATA
// Sections and items are configurable per app — pass your own to StyleguideLayout
// =============================================================================

export const navSections: LeftNavSection[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    icon: <IconFoundations size="md" />,
    defaultExpanded: false,
    items: [
      { id: 'colors', label: 'Colors', href: '/design-system/colors' },
      { id: 'typography', label: 'Typography', href: '/design-system/typography' },
      { id: 'spacing', label: 'Spacing', href: '/design-system/spacing' },
      { id: 'radius', label: 'Border Radius', href: '/design-system/radius' },
      { id: 'shadows', label: 'Shadows', href: '/design-system/shadows' },
      { id: 'breakpoints', label: 'Breakpoints', href: '/design-system/breakpoints' },
      { id: 'icons', label: 'Icons', href: '/design-system/icons' },
    ],
  },
  {
    id: 'components',
    title: 'Components',
    icon: <IconComponents size="md" />,
    defaultExpanded: false,
    items: [
      { id: 'accordion', label: 'Accordion', href: '/components/accordion' },
      { id: 'amount-confirm-dialog', label: 'Amount Confirm Dialog', href: '/components/amount-confirm-dialog' },
      { id: 'assistive-message', label: 'Assistive Message', href: '/components/assistive-message' },
      { id: 'avatar', label: 'Avatar', href: '/components/avatar' },
      { id: 'badge', label: 'Badge', href: '/components/badge' },
      { id: 'banner', label: 'Banner', href: '/components/banner' },
      { id: 'brand-banner', label: 'Brand Banner', href: '/components/brand-banner' },
      { id: 'button', label: 'Button', href: '/components/button' },
      { id: 'checkbox', label: 'Checkbox', href: '/components/checkbox' },
      { id: 'chip', label: 'Chip', href: '/components/chip' },
      { id: 'confirm-dialog', label: 'Confirm Dialog', href: '/components/confirm-dialog' },
      { id: 'column-manager', label: 'Column Manager', href: '/components/column-manager' },
      { id: 'collection-toolbar', label: 'Toolbar', href: '/components/collection-toolbar' },
      { id: 'combobox', label: 'Combobox', href: '/components/combobox' },
      { id: 'data-table', label: 'Data Table', href: '/components/data-table' },
      { id: 'divider', label: 'Divider', href: '/components/divider' },
      { id: 'full-screen-modal', label: 'Modal', href: '/components/full-screen-modal' },
      { id: 'image-carousel', label: 'Image Carousel', href: '/components/image-carousel' },
      { id: 'input', label: 'Input', href: '/components/input' },
      { id: 'link', label: 'Link', href: '/components/link' },
      { id: 'radio', label: 'Radio', href: '/components/radio' },
      { id: 'switch', label: 'Switch', href: '/components/switch' },
      { id: 'header', label: 'Header', href: '/components/header' },
      { id: 'left-nav', label: 'Left Nav', href: '/components/left-nav' },
      { id: 'list-item', label: 'List Item', href: '/components/list-item' },
      { id: 'menu', label: 'Menu', href: '/components/menu' },
      { id: 'marketplace-card', label: 'Marketplace Card', href: '/components/marketplace-card' },
      { id: 'product-card', label: 'Product Card', href: '/components/product-card' },
      { id: 'segmented-control', label: 'Segmented Control', href: '/components/segmented-control' },
      { id: 'stepper', label: 'Stepper', href: '/components/stepper' },
      { id: 'task-modal', label: 'Task Modal', href: '/components/task-modal' },
      { id: 'tab', label: 'Tab', href: '/components/tab' },
      { id: 'upload', label: 'Upload', href: '/components/upload' },
      { id: 'push-drawer', label: 'Drawer', href: '/components/push-drawer' },
    ],
  },
  {
    id: 'data-visualization',
    title: 'Data Visualization',
    icon: <IconDataViz />,
    defaultExpanded: false,
    items: [
      { id: 'line-chart', label: 'Line Chart', href: '/components/line-chart' },
      { id: 'spark-line', label: 'Spark Line', href: '/components/spark-line' },
    ],
  },
]

// Tab definitions for inner pages
export const innerPageTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'specs', label: 'Specifications' },
  { id: 'usage', label: 'Usage' },
]

// =============================================================================
// SHARED STYLES
// =============================================================================

export const sharedStyles = {
  page: {
    minHeight: '100vh',
    backgroundColor: colors.surface.light,
    backgroundImage: 'none',
    display: 'flex',
    position: 'relative' as const,
  },

  content: {
    marginLeft: `${SIDEBAR_WIDTH}px`,
    flex: 1,
    maxWidth: `calc(100% - ${SIDEBAR_WIDTH}px)`,
    padding: '24px 48px',
    transition: 'margin-left 0.3s ease, max-width 0.3s ease',
    color: colors.text.highEmphasis.onLight,
  },

  contentCollapsed: {
    marginLeft: `${SIDEBAR_COLLAPSED_WIDTH}px`,
    maxWidth: `calc(100% - ${SIDEBAR_COLLAPSED_WIDTH}px)`,
  },

  contentHidden: {
    marginLeft: 0,
    maxWidth: '100%',
  },

  headerWrapper: {
    marginBottom: '0',
  },

  header: {
    background: 'transparent',
    padding: '24px 0',
  },

  headerTitle: {
    ...typography.display.md,
    fontWeight: 600,
    color: colors.text.highEmphasis.onLight,
    marginBottom: '4px',
  },

  headerDescription: {
    ...typography.display.xs,
    fontWeight: 400,
    color: colors.text.lowEmphasis.onLight,
    maxWidth: '600px',
    margin: '0',
  },

  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '24px',
    borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
    paddingBottom: '0',
  },

  tab: {
    ...typography.label.md,
    padding: '12px 16px',
    color: colors.text.lowEmphasis.onLight,
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: transitionPresets.default,
    marginBottom: '-1px',
    textDecoration: 'none',
    outline: 'none',
  },

  tabActive: {
    color: colors.text.highEmphasis.onLight,
    borderBottom: `2px solid ${colors.brand.default}`,
  },

  main: {
    padding: '40px 0',
    maxWidth: '1400px',
    margin: '0',
  },
  
  section: {
    marginBottom: '64px',
  },
  
  sectionTitle: {
    ...typography.heading.h3,
    color: colors.text.highEmphasis.onLight,
    marginBottom: '8px',
  },
  
  sectionDescription: {
    ...typography.body.md,
    color: colors.text.lowEmphasis.onLight,
    marginBottom: '24px',
  },
  
  card: {
    marginBottom: '32px',
  },

  cardTitle: {
    ...typography.heading.h4,
    color: colors.text.highEmphasis.onLight,
    marginBottom: '16px',
    marginTop: '24px',
  },
  
  tableContainer: {
    borderRadius: borderRadius.xl,
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
    overflow: 'hidden',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    ...typography.body.sm,
    color: colors.text.highEmphasis.onLight,
  },

  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    background: colors.surface.lightDarker,
    fontWeight: 600,
    color: colors.text.highEmphasis.onLight,
    borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
  },

  td: {
    padding: '12px 16px',
    color: colors.text.lowEmphasis.onLight,
    borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
  },
  
  codeBlock: {
    background: colors.surface.lightDarker,
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
    padding: '16px 20px',
    borderRadius: borderRadius.md,
    fontFamily: fontFamilies.mono,
    fontSize: '13px',
    lineHeight: '1.6',
    overflowX: 'auto' as const,
    color: colors.text.highEmphasis.onLight,
  },
  
  grid: {
    display: 'grid',
    gap: '24px',
  },
  
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap' as const,
  },
}

// =============================================================================
// THEME SWITCHER BUTTON
// =============================================================================

const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function ThemeSwitcherButton({ onBrand = false }: { onBrand?: boolean }) {
  const { themeName, setThemeName } = useThemeSwitcher()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const displayName = themeName.charAt(0).toUpperCase() + themeName.slice(1)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Theme: ${displayName}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: borderRadius.lg,
          border: onBrand ? '1px solid rgba(255,255,255,0.3)' : `1px solid ${colors.border.midEmphasis.onLight}`,
          background: onBrand ? 'rgba(255,255,255,0.12)' : 'transparent',
          color: onBrand ? 'rgba(255,255,255,0.9)' : colors.text.lowEmphasis.onLight,
          fontSize: '12px',
          fontWeight: 500,
          fontFamily: fontFamilies.body,
          cursor: 'pointer',
          transition: 'background 150ms ease, border-color 150ms ease',
          backdropFilter: onBrand ? 'blur(8px)' : undefined,
          WebkitBackdropFilter: onBrand ? 'blur(8px)' : undefined,
        }}
        onMouseEnter={(e) => {
          if (onBrand) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
          } else {
            e.currentTarget.style.background = colors.hover.onLight
            e.currentTarget.style.borderColor = colors.border.highEmphasis.onLight
          }
        }}
        onMouseLeave={(e) => {
          if (onBrand) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
          } else {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = colors.border.midEmphasis.onLight
          }
        }}
      >
        {displayName}
        <IconChevronDown />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select theme"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            minWidth: '140px',
            background: colors.surface.light,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadius.md,
            boxShadow: shadows.lg,
            padding: '4px 0',
            overflow: 'hidden',
            zIndex: 200,
          }}
        >
          {availableThemes.map((t) => {
            const isActive = t.name === themeName
            const label = t.name.charAt(0).toUpperCase() + t.name.slice(1)
            return (
              <button
                key={t.name}
                role="option"
                aria-selected={isActive}
                onClick={() => { setThemeName(t.name); setOpen(false) }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 14px',
                  border: 'none',
                  background: isActive ? colors.selected.onLight : 'transparent',
                  color: isActive ? colors.text.highEmphasis.onLight : colors.text.lowEmphasis.onLight,
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: fontFamilies.body,
                  textAlign: 'left' as const,
                  cursor: 'pointer',
                  transition: 'background 100ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = colors.hover.onLight
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent'
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// LAYOUT COMPONENT
// =============================================================================

interface StyleguideLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  /** One-liner subcopy displayed in the BrandBanner below the title */
  tagline?: string
  activeId: string
  /** Override default navSections — pass custom sections for different apps */
  sections?: LeftNavSection[]
  tabs?: { id: string; label: string }[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  headerAction?: React.ReactNode
}

export function StyleguideLayout({
  children,
  title,
  description,
  tagline,
  activeId,
  sections = navSections,
  tabs,
  activeTab,
  onTabChange,
  headerAction,
}: StyleguideLayoutProps) {
  // Default tabs if none provided
  const displayTabs = tabs || innerPageTabs
  const currentTab = activeTab || 'overview'

  // Sidebar collapsed state - default expanded on first visit
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Theme selection — managed by SwitchableThemeProvider, controlled here
  const { themeName, setThemeName } = useThemeSwitcher()

  // Restore sidebar state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ds-sidebar-collapsed')
    if (stored !== null) {
      setSidebarCollapsed(stored === 'true')
    }
    setIsHydrated(true)
  }, [])

  // Persist sidebar state to localStorage when it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('ds-sidebar-collapsed', String(sidebarCollapsed))
    }
  }, [sidebarCollapsed, isHydrated])

  // Check if we're on mobile on mount and on resize
  useEffect(() => {
    let wasMobile = window.innerWidth < MOBILE_BREAKPOINT
    setIsMobile(wasMobile)
    if (wasMobile) setSidebarCollapsed(true)

    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      // Collapse sidebar when transitioning from desktop to mobile
      if (mobile && !wasMobile) setSidebarCollapsed(true)
      wasMobile = mobile
      setIsMobile(mobile)
    }
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- state setters are stable
  }, [])

  const handleCollapseChange = useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
  }, [])

  const handleItemClick = useCallback((_item: LeftNavItem) => {
    // Let Next.js <Link> handle navigation (client-side, no full reload)
    // Close mobile drawer on navigation
    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }, [isMobile])

  // Detect dark themes: used to choose the page background surface.
  // Dark themes: page bg uses surface.dark (darkest). Light themes: page bg uses surface.light.
  const useDarkCanvas = themeName.includes('Dark') || themeName.includes('Night') || themeName.includes('dark')
  const pageBg = useDarkCanvas ? colors.surface.dark : colors.surface.light

  return (
    <div style={{ ...sharedStyles.page, backgroundColor: pageBg, flexDirection: 'column' }}>
      {/* App Header - full width, fixed at top */}
      <Header
        variant="full"
        sticky
        showNavToggle
        navToggleExpanded={!sidebarCollapsed}
        onNavToggleClick={() => setSidebarCollapsed((v) => !v)}
        userAvatar={<Avatar name="Lana Holston" size="sm" color={2} />}
        userName="Lana Holston"
        showNotifications
        notificationCount={0}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: zIndex.header + 1 }}
      />

      {/* Spacer for fixed header */}
      <div style={{ height: `${HEADER_HEIGHT}px`, flexShrink: 0 }} />

      {/* Inner shell: nav + content side by side */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
      {/* Segmented LeftNav — each section in its own card */}
      <LeftNavSegmented
        sections={sections}
        activeItemId={activeId}
        collapsed={sidebarCollapsed}
        onCollapseChange={handleCollapseChange}
        showCollapseToggle={false}
        mobileBehavior="drawer"
        mobileOpen={isMobile && !sidebarCollapsed}
        onMobileClose={() => setSidebarCollapsed(true)}
        onItemClick={handleItemClick}
        style={{
          position: 'fixed',
          top: `${HEADER_HEIGHT}px`,
          left: spacing.sm,
          bottom: spacing.sm,
          height: `calc(100vh - ${HEADER_HEIGHT}px - ${spacing.sm})`,
          zIndex: zIndex.header,
        }}
      />

      {/* Content */}
      <div
        style={{
          ...sharedStyles.content,
          ...(sidebarCollapsed && !isMobile ? sharedStyles.contentCollapsed : {}),
          ...(isMobile && sidebarCollapsed ? sharedStyles.contentHidden : {}),
        }}
        data-content
      >
        {/* Mobile menu toggle */}
        {isMobile && sidebarCollapsed && (
          <button
            type="button"
            onClick={() => setSidebarCollapsed(false)}
            aria-label="Open navigation"
            style={{
              position: 'fixed',
              top: spacing.sm,
              left: spacing.sm,
              zIndex: zIndex.header - 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: spacing['3xl'],
              height: spacing['3xl'],
              borderRadius: borderRadius.sm,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              background: colors.surface.light,
              cursor: 'pointer',
              color: colors.text.highEmphasis.onLight,
              boxShadow: shadows.sm,
            }}
          >
            <IconSidebarOpen size={20} />
          </button>
        )}

        {/* Header — plain title/description for all themes (unified format) */}
        <div style={sharedStyles.headerWrapper}>
          <header style={sharedStyles.header}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={sharedStyles.headerTitle}>{title}</h1>
                <p style={sharedStyles.headerDescription}>{tagline || description}</p>
              </div>
              {headerAction}
            </div>
          </header>

          {/* Tabs */}
          {displayTabs.length > 0 && (
            <nav role="tablist" style={{ ...sharedStyles.tabsContainer, marginTop: spacing.md }}>
              {displayTabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={currentTab === tab.id}
                  style={{
                    ...sharedStyles.tab,
                    ...(currentTab === tab.id ? sharedStyles.tabActive : {}),
                  }}
                  onClick={() => onTabChange?.(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        <main style={sharedStyles.main}>
          {children}
        </main>
      </div>
      </div>{/* end inner shell */}
    </div>
  )
}

// =============================================================================
// UTILITY COMPONENTS
// =============================================================================

// Copy Icon SVG
const IconCopy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

// Check Icon SVG (for copied state)
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // silently handle
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: copied ? colors.status.success : colors.surface.lightDarker,
          border: 'none',
          borderRadius: borderRadius.sm,
          padding: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: transitionPresets.default,
          color: copied ? colors.text.highEmphasis.onDark : colors.text.lowEmphasis.onLight,
        }}
        title={copied ? 'Copied!' : 'Copy code'}
        aria-label={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? <IconCheck /> : <IconCopy />}
      </button>
      <pre style={sharedStyles.codeBlock}>{children}</pre>
    </div>
  )
}

// Preview/Code Toggle Component for Interactive Playgrounds
type PlaygroundTab = 'preview' | 'code' | 'source'

interface PlaygroundProps {
  preview: React.ReactNode
  code: string
  previewBackground?: string
  previewPadding?: string
  previewMinHeight?: string
  /** Stretch preview content to fill width instead of centering */
  previewStretch?: boolean
  /** Optional: component source code for editable Source tab */
  sourceCode?: string
  /** Optional: path to component file (for saving) */
  componentPath?: string
  /** Optional: callback when source is saved */
  onSourceSaved?: () => void
}

export function Playground({
  preview,
  code,
  previewBackground = colors.surface.lightDarker,
  previewPadding = '48px',
  previewMinHeight = '120px',
  previewStretch = false,
  sourceCode,
  componentPath,
  onSourceSaved,
}: PlaygroundProps) {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>('preview')
  const [editedSource, setEditedSource] = useState(sourceCode || '')
  const [sourceSaving, setSourceSaving] = useState(false)
  const [sourceSaveStatus, setSourceSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [sourceError, setSourceError] = useState('')

  // Keep edited source in sync if sourceCode prop changes
  useEffect(() => {
    if (sourceCode) setEditedSource(sourceCode)
  }, [sourceCode])

  const hasSourceChanges = sourceCode ? editedSource !== sourceCode : false

  const handleSourceSave = async () => {
    if (!componentPath) return
    setSourceSaving(true)
    setSourceSaveStatus('idle')
    setSourceError('')

    try {
      const res = await fetch('/api/tweak/source', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ componentPath, source: editedSource }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Save failed')
      }

      setSourceSaveStatus('saved')
      onSourceSaved?.()
      setTimeout(() => setSourceSaveStatus('idle'), 3000)
    } catch (err: unknown) {
      setSourceSaveStatus('error')
      setSourceError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSourceSaving(false)
    }
  }

  const segments = [
    { id: 'preview', label: 'Preview' },
    { id: 'code', label: 'Code' },
    ...(sourceCode ? [{ id: 'source', label: 'Source' }] : []),
  ]

  return (
    <div>
      {/* Toggle using SegmentedControl component */}
      <div style={{ marginBottom: '16px' }}>
        <SegmentedControl
          segments={segments}
          value={activeTab}
          onChange={(id) => setActiveTab(id as PlaygroundTab)}
          size="sm"
        />
      </div>

      {/* Content with rounded grey background */}
      <div style={{
        background: activeTab === 'source' ? colors.surface.darkDarker : previewBackground,
        borderRadius: borderRadius.lg,
        overflow: activeTab === 'preview' ? 'visible' : 'hidden',
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
      }}>
        {activeTab === 'preview' ? (
          <div style={{
            padding: previewPadding,
            display: 'flex',
            alignItems: previewStretch ? 'stretch' : 'center',
            justifyContent: previewStretch ? 'stretch' : 'center',
            minHeight: previewMinHeight,
          }}>
            {preview}
          </div>
        ) : activeTab === 'code' ? (
          <div style={{ padding: '0' }}>
            <CodeBlock>{code}</CodeBlock>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Save bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: colors.surface.dark,
              borderBottom: `1px solid ${colors.border.highEmphasis.onDark}`,
            }}>
              <span style={{
                fontSize: '12px',
                fontFamily: fontFamilies.mono,
                color: colors.text.lowEmphasis.onDark,
              }}>
                {componentPath}
              </span>
              <button
                onClick={handleSourceSave}
                disabled={sourceSaving || !hasSourceChanges}
                style={{
                  padding: '4px 12px',
                  borderRadius: borderRadius.sm,
                  border: 'none',
                  cursor: hasSourceChanges ? 'pointer' : 'default',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: fontFamilies.body,
                  background: sourceSaveStatus === 'saved'
                    ? colors.status.success
                    : hasSourceChanges
                    ? colors.brand.default
                    : colors.border.highEmphasis.onDark,
                  color: (sourceSaveStatus === 'saved' || hasSourceChanges)
                    ? colors.text.highEmphasis.onDark
                    : colors.text.disabled.onDark,
                  opacity: sourceSaving ? 0.7 : 1,
                }}
              >
                {sourceSaving ? 'Saving...' :
                 sourceSaveStatus === 'saved' ? 'Saved!' :
                 sourceSaveStatus === 'error' ? 'Error' :
                 'Save'}
              </button>
            </div>
            {sourceError && (
              <div style={{
                padding: '6px 12px',
                background: colors.surface.important,
                color: colors.text.important,
                fontSize: '12px',
                fontFamily: fontFamilies.mono,
              }}>
                {sourceError}
              </div>
            )}
            <textarea
              value={editedSource}
              onChange={(e) => setEditedSource(e.target.value)}
              spellCheck={false}
              style={{
                width: '100%',
                minHeight: '400px',
                padding: '16px',
                background: colors.surface.darkDarker,
                color: colors.text.lowEmphasis.onDark,
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                fontFamily: fontFamilies.mono,
                fontSize: '13px',
                lineHeight: '1.6',
                tabSize: 2,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Pill Button component for property controls
interface PillButtonProps {
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

// Styled Checkbox component matching design system
interface StyledCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}

export function StyledCheckbox({ checked, onChange, label, disabled = false }: StyledCheckboxProps) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 0,
          height: 0,
        }}
      />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="2"
          y="2"
          width="16"
          height="16"
          rx="4"
          stroke={disabled ? colors.text.disabled.onLight : checked ? colors.brand.default : colors.border.highEmphasis.onLight}
          strokeWidth="2"
          fill={checked ? colors.brand.default : 'transparent'}
        />
        {checked && (
          <path
            d="M6 10L9 13L14 7"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <span style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight }}>{label}</span>
    </label>
  )
}

export function PillButton({ children, isActive = false, onClick, style }: PillButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        border: isActive ? 'none' : `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: '9999px', // Full pill shape
        background: isActive ? colors.brand.default : colors.buttonToggleBg.onLight,
        color: isActive ? colors.text.highEmphasis.onDark : colors.text.highEmphasis.onLight,
        cursor: 'pointer',
        ...typography.label.sm,
        transition: transitionPresets.default,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// =============================================================================
// COLLAPSIBLE SECTION COMPONENT
// =============================================================================

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div style={{
      border: `1px solid ${colors.border.lowEmphasis.onLight}`,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      marginBottom: '16px',
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: colors.surface.lightDarker,
          border: 'none',
          cursor: 'pointer',
          ...typography.label.md,
          color: colors.text.highEmphasis.onLight,
        }}
      >
        <span>{title}</span>
        <span style={{
          display: 'flex',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          color: colors.text.lowEmphasis.onLight,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// TOKEN VALUE COMPONENT
// =============================================================================

// Component for displaying copyable token values with pixel reference
interface TokenValueProps {
  /** The token path to copy (e.g., 'button.sizes.lg.height') */
  token: string
  /** The resolved value for reference (e.g., '48px') */
  value: string
  /** Optional: show only the value (useful when token column is separate) */
  valueOnly?: boolean
}

export function TokenValue({ token, value, valueOnly = false }: TokenValueProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      // silently handle
    }
  }

  if (valueOnly) {
    return (
      <span style={{
        ...typography.code.sm,
        color: colors.text.lowEmphasis.onLight,
      }}>
        {value}
      </span>
    )
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <button
        onClick={handleCopy}
        title={copied ? 'Copied!' : `Copy: ${token}`}
        aria-label={copied ? 'Copied!' : `Copy token: ${token}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: copied ? colors.surface.success : colors.surface.lightDarker,
          border: 'none',
          borderRadius: borderRadius.sm,
          padding: '4px 8px',
          cursor: 'pointer',
          transition: transitionPresets.default,
          maxWidth: '100%',
        }}
      >
        <code style={{
          ...typography.code.sm,
          color: copied ? colors.status.success : colors.text.highEmphasis.onLight,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {token}
        </code>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: copied ? colors.status.success : colors.text.lowEmphasis.onLight,
        }}>
          {copied ? <IconCheck /> : <IconCopy />}
        </span>
      </button>
      <span style={{
        ...typography.code.sm,
        color: colors.text.lowEmphasis.onLight,
        whiteSpace: 'nowrap',
      }}>
        ({value})
      </span>
    </span>
  )
}

// Simplified token display for tables - just the token with copy
interface CopyableTokenProps {
  /** The token path to copy */
  token: string
}

export function CopyableToken({ token }: CopyableTokenProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      // silently handle
    }
  }

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : `Copy: ${token}`}
      aria-label={copied ? 'Copied!' : `Copy token: ${token}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: copied ? colors.surface.success : colors.surface.lightDarker,
        border: 'none',
        borderRadius: borderRadius.sm,
        padding: '4px 8px',
        cursor: 'pointer',
        transition: transitionPresets.default,
      }}
    >
      <code style={{
        ...typography.code.sm,
        color: copied ? colors.status.success : colors.text.highEmphasis.onLight,
      }}>
        {token}
      </code>
      <span style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: copied ? colors.status.success : colors.text.lowEmphasis.onLight,
      }}>
        {copied ? <IconCheck /> : <IconCopy />}
      </span>
    </button>
  )
}

// Pixel reference value (non-copyable, just for reference)
export function PixelValue({ value }: { value: string }) {
  return (
    <span style={{
      ...typography.code.sm,
      color: colors.text.lowEmphasis.onLight,
    }}>
      {value}
    </span>
  )
}

// =============================================================================
// SPEC TABLE COMPONENT
// =============================================================================

export function SpecTable({
  headers,
  rows
}: {
  headers: string[]
  rows: (string | React.ReactNode)[][]
}) {
  return (
    <div style={sharedStyles.tableContainer}>
      <table style={sharedStyles.table}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={sharedStyles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    ...sharedStyles.td,
                    // Remove bottom border on last row
                    ...(i === rows.length - 1 ? { borderBottom: 'none' } : {}),
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// =============================================================================
// TWEAK PANEL — Inline style editor for component playgrounds
// =============================================================================

export interface TweakField {
  /** Display label */
  label: string
  /** Current value (string) */
  value: string
  /** Type of input */
  type: 'text' | 'number' | 'color' | 'select'
  /** Options for select type */
  options?: string[]
  /** Unit suffix to display (e.g. "px") */
  unit?: string
  /** Group label for visual separation */
  group?: string
}

interface TweakPanelProps {
  /** The tweakable fields */
  fields: TweakField[]
  /** Called when values change (for live preview) */
  onChange: (fieldIndex: number, newValue: string) => void
  /** Called when save is clicked — parent owns save logic */
  onSave: () => Promise<{ success: boolean; error?: string }>
}

export function TweakPanel({ fields, onChange, onSave }: TweakPanelProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (index: number, newValue: string) => {
    onChange(index, newValue)
    setHasChanges(true)
    setSaveStatus('idle')
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('idle')
    setErrorMessage('')

    try {
      const result = await onSave()
      if (result.success) {
        setSaveStatus('saved')
        setHasChanges(false)
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
        setErrorMessage(result.error || 'Save failed')
      }
    } catch (err: unknown) {
      setSaveStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  // Group fields for visual separation
  let currentGroup = ''

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '6px 10px',
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
    borderRadius: borderRadius.sm,
    fontFamily: fontFamilies.mono,
    fontSize: '13px',
    color: colors.text.highEmphasis.onLight,
    background: colors.surface.light,
    outline: 'none',
  }

  return (
    <div style={{
      border: `1px solid ${colors.border.lowEmphasis.onLight}`,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: colors.surface.lightDarker,
        borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
      }}>
        <span style={{ ...typography.label.sm, color: colors.text.highEmphasis.onLight }}>
          Style Tweaks
        </span>
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: borderRadius.md,
            border: 'none',
            cursor: hasChanges ? 'pointer' : 'default',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: fontFamilies.body,
            transition: transitionPresets.default,
            background: saveStatus === 'saved'
              ? colors.status.success
              : saveStatus === 'error'
              ? colors.status.important
              : hasChanges
              ? colors.brand.default
              : colors.surface.lightDarker,
            color: (saveStatus === 'saved' || saveStatus === 'error' || hasChanges)
              ? colors.text.highEmphasis.onDark
              : colors.text.lowEmphasis.onLight,
            opacity: isSaving ? 0.7 : 1,
          }}
        >
          {isSaving ? 'Saving...' :
           saveStatus === 'saved' ? 'Saved!' :
           saveStatus === 'error' ? 'Error' :
           'Save to Component'}
        </button>
      </div>

      {/* Error message */}
      {saveStatus === 'error' && errorMessage && (
        <div style={{
          padding: '8px 16px',
          background: colors.surface.important,
          color: colors.text.important,
          fontSize: '12px',
          fontFamily: fontFamilies.body,
        }}>
          {errorMessage}
        </div>
      )}

      {/* Fields */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {fields.map((field, i) => {
          const showGroupHeader = field.group && field.group !== currentGroup
          if (field.group) currentGroup = field.group

          return (
            <React.Fragment key={i}>
              {showGroupHeader && (
                <div style={{
                  ...typography.label.sm,
                  color: colors.text.lowEmphasis.onLight,
                  fontSize: '11px',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                  paddingTop: i > 0 ? '8px' : '0',
                  borderTop: i > 0 ? `1px solid ${colors.border.lowEmphasis.onLight}` : 'none',
                  marginTop: i > 0 ? '4px' : '0',
                }}>
                  {field.group}
                </div>
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <label style={{
                  ...typography.label.sm,
                  color: colors.text.highEmphasis.onLight,
                  minWidth: '100px',
                  flexShrink: 0,
                  fontSize: '12px',
                }}>
                  {field.label}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  {field.type === 'color' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                      <input
                        type="color"
                        value={field.value}
                        onChange={(e) => handleChange(i, e.target.value)}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                          borderRadius: borderRadius.sm,
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      />
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => handleChange(i, e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  ) : field.type === 'select' ? (
                    <select
                      value={field.value}
                      onChange={(e) => handleChange(i, e.target.value)}
                      style={inputStyle}
                    >
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => handleChange(i, e.target.value)}
                      style={inputStyle}
                    />
                  )}
                  {field.unit && (
                    <span style={{
                      ...typography.code.sm,
                      color: colors.text.lowEmphasis.onLight,
                      flexShrink: 0,
                      fontSize: '12px',
                    }}>
                      {field.unit}
                    </span>
                  )}
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// COMPONENT DOCUMENTATION TAB
// =============================================================================

export interface DocPropItem {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

export interface DocTypeDefinition {
  name: string
  definition: string
}

export interface DocAccessibilityItem {
  feature: string
  description: string
}

export interface DocTokenItem {
  token: string
  value: string
  usage: string
}

export interface DocSubComponent {
  name: string
  description: string
  props: DocPropItem[]
}

/** Usage example for a component — shows a common configuration scenario. */
export interface DocUsageExample {
  /** Short title for this example (e.g., "Sortable table with pagination") */
  title: string
  /** Brief description of when/why to use this configuration */
  description: string
  /** Minimal JSX code snippet — props only, no app wrappers */
  code?: string
  /** Mark ONE example per component as the default "start here" config */
  isDefault?: boolean
}

/** Anti-pattern: when NOT to use this component, with a redirect to the better choice. */
export interface DocWhenNotToUse {
  /** The scenario where this component is the wrong choice */
  scenario: string
  /** Component name + brief reason. Convention: start with component name.
   *  e.g., "Combobox — supports search and async loading for large option sets" */
  instead: string
}

export interface ComponentDocData {
  displayName: string
  importPath: string
  importStatement: string
  description: string
  props: DocPropItem[]
  typeDefinitions?: DocTypeDefinition[]
  accessibility?: DocAccessibilityItem[]
  tokens?: DocTokenItem[]
  subComponents?: DocSubComponent[]
  relatedComponents?: { name: string; href: string }[]
  notes?: string[]
  // ── Usage Intelligence ──────────────────────────────────────────────
  /** When to reach for this component. 1-2 sentences each, 3-7 entries. */
  whenToUse?: string[]
  /** When NOT to use — redirects to a better component for the scenario. */
  whenNotToUse?: DocWhenNotToUse[]
  /** Usage examples showing common configurations. Mark one `isDefault: true`. */
  usageExamples?: DocUsageExample[]
}

export function ComponentDocumentation({ data }: { data: ComponentDocData }) {
  const [copiedImport, setCopiedImport] = useState(false)
  const [copiedYaml, setCopiedYaml] = useState(false)

  const handleCopyImport = () => {
    navigator.clipboard.writeText(data.importStatement)
    setCopiedImport(true)
    setTimeout(() => setCopiedImport(false), 2000)
  }

  const yamlBlock = [
    `component: ${data.displayName}`,
    `import: "${data.importPath}"`,
    `description: "${data.description}"`,
    // ── Usage Intelligence (top of block for LLM selection) ──
    ...(data.whenToUse?.length ? [
      `when_to_use:`,
      ...data.whenToUse.map(u => `  - "${u}"`),
    ] : []),
    ...(data.whenNotToUse?.length ? [
      `when_not_to_use:`,
      ...data.whenNotToUse.map(w =>
        `  - scenario: "${w.scenario}"\n    instead: "${w.instead}"`
      ),
    ] : []),
    ...(data.usageExamples?.length ? [
      `usage_examples:`,
      ...data.usageExamples.map(e =>
        `  - title: "${e.title}"\n    description: "${e.description}"${e.isDefault ? '\n    is_default: true' : ''}${e.code ? `\n    code: |\n      ${e.code.split('\n').join('\n      ')}` : ''}`
      ),
    ] : []),
    // ── Props ──
    `props:`,
    ...data.props.map(p =>
      `  - name: ${p.name}\n    type: "${p.type}"\n    required: ${!!p.required}\n    default: ${p.default ? `"${p.default}"` : 'null'}\n    description: "${p.description}"`
    ),
    ...(data.subComponents?.length ? data.subComponents.flatMap(sc => [
      `sub_components:`,
      `  - name: ${sc.name}`,
      `    description: "${sc.description}"`,
      `    props:`,
      ...sc.props.map(p =>
        `      - name: ${p.name}\n        type: "${p.type}"\n        required: ${!!p.required}\n        default: ${p.default ? `"${p.default}"` : 'null'}\n        description: "${p.description}"`
      ),
    ]) : []),
    ...(data.accessibility?.length ? [
      `accessibility:`,
      ...data.accessibility.map(a =>
        `  - feature: "${a.feature}"\n    description: "${a.description}"`
      ),
    ] : []),
    // ── Previously missing from YAML output ──
    ...(data.tokens?.length ? [
      `tokens:`,
      ...data.tokens.map(t =>
        `  - token: "${t.token}"\n    usage: "${t.usage}"`
      ),
    ] : []),
    ...(data.relatedComponents?.length ? [
      `related_components:`,
      ...data.relatedComponents.map(r =>
        `  - name: "${r.name}"\n    href: "${r.href}"`
      ),
    ] : []),
    ...(data.notes?.length ? [
      `notes:`,
      ...data.notes.map(n => `  - "${n}"`),
    ] : []),
  ].join('\n')

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(yamlBlock)
    setCopiedYaml(true)
    setTimeout(() => setCopiedYaml(false), 2000)
  }

  return (
    <>
      {/* LLM-Friendly YAML Block */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>Machine-Readable Reference</h2>
        <p style={sharedStyles.sectionDescription}>
          Structured metadata for AI assistants, code generators, and automated tooling.
        </p>
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleCopyYaml}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: copiedYaml ? colors.status.success : colors.surface.lightDarker,
              border: 'none',
              borderRadius: borderRadius.sm,
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: fontFamilies.body,
              color: copiedYaml ? colors.text.highEmphasis.onDark : colors.text.lowEmphasis.onLight,
              transition: transitionPresets.default,
              zIndex: 1,
            }}
          >
            {copiedYaml ? 'Copied!' : 'Copy YAML'}
          </button>
          <pre style={{
            ...sharedStyles.codeBlock,
            maxHeight: '320px',
            overflowY: 'auto',
            fontSize: '12px',
            lineHeight: '1.5',
          }}>
            {yamlBlock}
          </pre>
        </div>
      </section>

      {/* Usage Guidance */}
      {(data.whenToUse?.length || data.whenNotToUse?.length) && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Usage Guidance</h2>
          <p style={sharedStyles.sectionDescription}>
            When to use this component — and when to reach for something else.
          </p>

          {data.whenToUse && data.whenToUse.length > 0 && (
            <div style={{ ...sharedStyles.card, marginBottom: '16px' }}>
              <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0, color: colors.status.success }}>When to use</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.whenToUse.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{
                      flexShrink: 0,
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: colors.status.success,
                      marginTop: '7px',
                    }} />
                    <span style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.whenNotToUse && data.whenNotToUse.length > 0 && (
            <div style={sharedStyles.card}>
              <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0, color: colors.status.important }}>When NOT to use</h3>
              <div style={sharedStyles.tableContainer}>
                <table style={sharedStyles.table}>
                  <thead>
                    <tr>
                      <th style={{ ...sharedStyles.th, width: '45%' }}>Scenario</th>
                      <th style={sharedStyles.th}>Use Instead</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.whenNotToUse.map((item, i) => (
                      <tr key={i}>
                        <td style={sharedStyles.td}>{item.scenario}</td>
                        <td style={{ ...sharedStyles.td, color: colors.brand.default, fontWeight: 600 }}>{item.instead}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Usage Examples */}
      {data.usageExamples && data.usageExamples.length > 0 && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Common Configurations</h2>
          <p style={sharedStyles.sectionDescription}>
            Recommended patterns for typical scenarios.{' '}
            {data.usageExamples.some(e => e.isDefault) && (
              <span style={{ fontWeight: 600 }}>Start with the default configuration below.</span>
            )}
          </p>
          {data.usageExamples.map((example, i) => (
            <div
              key={i}
              style={{
                ...sharedStyles.card,
                marginBottom: '16px',
                borderLeft: example.isDefault ? `3px solid ${colors.brand.default}` : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0, marginBottom: 0 }}>{example.title}</h3>
                {example.isDefault && (
                  <span style={{
                    ...typography.label.sm,
                    background: colors.brand.default,
                    color: colors.text.highEmphasis.onDark,
                    padding: '2px 8px',
                    borderRadius: borderRadius.full,
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Default
                  </span>
                )}
              </div>
              <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, margin: '4px 0 12px' }}>
                {example.description}
              </p>
              {example.code && (
                <pre style={{ ...sharedStyles.codeBlock, fontSize: '12px', lineHeight: '1.5' }}>
                  {example.code}
                </pre>
              )}
            </div>
          ))}
        </section>
      )}

      {/* API Reference */}
      <section style={sharedStyles.section}>
        <h2 style={sharedStyles.sectionTitle}>API Reference</h2>

        {/* Import */}
        <div style={sharedStyles.card}>
          <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Import</h3>
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleCopyImport}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: copiedImport ? colors.status.success : colors.hover.onLight,
                border: 'none',
                borderRadius: borderRadius.sm,
                padding: '4px 10px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: fontFamilies.body,
                color: copiedImport ? colors.text.highEmphasis.onDark : colors.text.lowEmphasis.onLight,
                transition: transitionPresets.default,
              }}
            >
              {copiedImport ? 'Copied!' : 'Copy'}
            </button>
            <pre style={sharedStyles.codeBlock}>{data.importStatement}</pre>
          </div>
        </div>

        {/* Props */}
        <div style={sharedStyles.card}>
          <h3 style={sharedStyles.cardTitle}>{data.displayName} Props</h3>
          <div style={sharedStyles.tableContainer}>
            <table style={sharedStyles.table}>
              <thead>
                <tr>
                  <th style={sharedStyles.th}>Prop</th>
                  <th style={sharedStyles.th}>Type</th>
                  <th style={sharedStyles.th}>Default</th>
                  <th style={{ ...sharedStyles.th, width: '40%' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {data.props.map((p) => (
                  <tr key={p.name}>
                    <td style={sharedStyles.td}>
                      <code style={{
                        fontFamily: fontFamilies.mono,
                        fontSize: '13px',
                        color: colors.brand.default,
                        fontWeight: 600,
                      }}>
                        {p.name}
                        {p.required && <span style={{ color: colors.status.important }}> *</span>}
                      </code>
                    </td>
                    <td style={sharedStyles.td}>
                      <code style={{
                        fontFamily: fontFamilies.mono,
                        fontSize: '12px',
                        background: colors.surface.lightDarker,
                        padding: '2px 6px',
                        borderRadius: borderRadius.xs,
                      }}>
                        {p.type}
                      </code>
                    </td>
                    <td style={sharedStyles.td}>
                      {p.default ? (
                        <code style={{ fontFamily: fontFamilies.mono, fontSize: '12px' }}>{p.default}</code>
                      ) : (
                        <span style={{ color: colors.text.disabled.onLight }}>—</span>
                      )}
                    </td>
                    <td style={{ ...sharedStyles.td, color: colors.text.lowEmphasis.onLight }}>{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sub-component Props */}
        {data.subComponents?.map((sc) => (
          <div key={sc.name} style={sharedStyles.card}>
            <h3 style={sharedStyles.cardTitle}>{sc.name} Props</h3>
            <p style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight, marginBottom: '16px' }}>{sc.description}</p>
            <div style={sharedStyles.tableContainer}>
              <table style={sharedStyles.table}>
                <thead>
                  <tr>
                    <th style={sharedStyles.th}>Prop</th>
                    <th style={sharedStyles.th}>Type</th>
                    <th style={sharedStyles.th}>Default</th>
                    <th style={{ ...sharedStyles.th, width: '40%' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {sc.props.map((p) => (
                    <tr key={p.name}>
                      <td style={sharedStyles.td}>
                        <code style={{
                          fontFamily: fontFamilies.mono,
                          fontSize: '13px',
                          color: colors.brand.default,
                          fontWeight: 600,
                        }}>
                          {p.name}
                          {p.required && <span style={{ color: colors.status.important }}> *</span>}
                        </code>
                      </td>
                      <td style={sharedStyles.td}>
                        <code style={{
                          fontFamily: fontFamilies.mono,
                          fontSize: '12px',
                          background: colors.surface.lightDarker,
                          padding: '2px 6px',
                          borderRadius: borderRadius.xs,
                        }}>
                          {p.type}
                        </code>
                      </td>
                      <td style={sharedStyles.td}>
                        {p.default ? (
                          <code style={{ fontFamily: fontFamilies.mono, fontSize: '12px' }}>{p.default}</code>
                        ) : (
                          <span style={{ color: colors.text.disabled.onLight }}>—</span>
                        )}
                      </td>
                      <td style={{ ...sharedStyles.td, color: colors.text.lowEmphasis.onLight }}>{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* Type Definitions */}
      {data.typeDefinitions && data.typeDefinitions.length > 0 && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Type Definitions</h2>
          <p style={sharedStyles.sectionDescription}>
            TypeScript types exported from this component for use in your application.
          </p>
          {data.typeDefinitions.map((td) => (
            <div key={td.name} style={sharedStyles.card}>
              <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>{td.name}</h3>
              <pre style={sharedStyles.codeBlock}>{td.definition}</pre>
            </div>
          ))}
        </section>
      )}

      {/* Accessibility */}
      {data.accessibility && data.accessibility.length > 0 && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Accessibility</h2>
          <p style={sharedStyles.sectionDescription}>
            Built-in accessibility features and ARIA support.
          </p>
          <div style={sharedStyles.tableContainer}>
            <table style={sharedStyles.table}>
              <thead>
                <tr>
                  <th style={{ ...sharedStyles.th, width: '25%' }}>Feature</th>
                  <th style={sharedStyles.th}>Implementation</th>
                </tr>
              </thead>
              <tbody>
                {data.accessibility.map((a) => (
                  <tr key={a.feature}>
                    <td style={{ ...sharedStyles.td, fontWeight: 600 }}>{a.feature}</td>
                    <td style={{ ...sharedStyles.td, color: colors.text.lowEmphasis.onLight }}>{a.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Design Tokens */}
      {data.tokens && data.tokens.length > 0 && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Design Token Dependencies</h2>
          <p style={sharedStyles.sectionDescription}>
            Design tokens consumed by this component. Override these tokens to customize appearance.
          </p>
          <div style={sharedStyles.tableContainer}>
            <table style={sharedStyles.table}>
              <thead>
                <tr>
                  <th style={sharedStyles.th}>Token</th>
                  <th style={sharedStyles.th}>Value</th>
                  <th style={sharedStyles.th}>Usage</th>
                </tr>
              </thead>
              <tbody>
                {data.tokens.map((t) => (
                  <tr key={t.token}>
                    <td style={sharedStyles.td}>
                      <code style={{
                        fontFamily: fontFamilies.mono,
                        fontSize: '12px',
                        background: colors.surface.lightDarker,
                        padding: '2px 6px',
                        borderRadius: borderRadius.xs,
                      }}>
                        {t.token}
                      </code>
                    </td>
                    <td style={sharedStyles.td}>
                      <code style={{ fontFamily: fontFamilies.mono, fontSize: '12px' }}>{t.value}</code>
                    </td>
                    <td style={{ ...sharedStyles.td, color: colors.text.lowEmphasis.onLight }}>{t.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Notes */}
      {data.notes && data.notes.length > 0 && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Notes</h2>
          <div style={{
            background: colors.surface.lightDarker,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadius.md,
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {data.notes.map((note, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0,
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: colors.brand.default,
                  marginTop: '7px',
                }} />
                <span style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight }}>{note}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Components */}
      {data.relatedComponents && data.relatedComponents.length > 0 && (
        <section style={sharedStyles.section}>
          <h2 style={sharedStyles.sectionTitle}>Related Components</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {data.relatedComponents.map((rc) => (
              <a
                key={rc.name}
                href={rc.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: borderRadius.md,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  textDecoration: 'none',
                  color: colors.text.highEmphasis.onLight,
                  ...typography.label.md,
                  transition: transitionPresets.default,
                  background: colors.surface.light,
                }}
              >
                {rc.name}
                <span style={{ color: colors.text.lowEmphasis.onLight, fontSize: '16px' }}>→</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
