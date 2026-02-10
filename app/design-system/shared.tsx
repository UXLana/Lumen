'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  colors,
  typography,
  borderRadius,
  shadows,
  zIndex,
  transitionPresets,
  fontFamilies,
  breakpoints,
} from '@/styles/design-tokens'
import { SegmentedControl } from '@/components'
import {
  IconFoundations,
  IconComponents,
  IconChevronRight,
  IconSidebarOpen,
  IconSidebarClose,
} from '@/components/Icons'

// =============================================================================
// CONSTANTS
// =============================================================================

const SIDEBAR_WIDTH = 260
const SIDEBAR_COLLAPSED_WIDTH = 56
const MOBILE_BREAKPOINT = parseInt(breakpoints.md) // 768px

// =============================================================================
// CUSTOM ICONS (Not in the main library)
// =============================================================================

// Animated chevron for nav sections
const IconChevron = ({ expanded }: { expanded: boolean }) => (
  <span style={{
    display: 'flex',
    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s ease',
  }}>
    <IconChevronRight size="sm" />
  </span>
)

// Icon mapping - first-level section icons only
// Using size 20 (md) for crisp rendering at all states
const iconMap: Record<string, React.FC> = {
  foundations: () => <IconFoundations size="md" />,
  components: () => <IconComponents size="md" />,
}

// =============================================================================
// NAVIGATION DATA
// =============================================================================

export const navSections = [
  {
    id: 'foundations',
    title: 'Foundations',
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
    items: [
      { id: 'accordion', label: 'Accordion', href: '/components/accordion' },
      { id: 'avatar', label: 'Avatar', href: '/components/avatar' },
      { id: 'badge', label: 'Badge', href: '/components/badge' },
      { id: 'banner', label: 'Banner', href: '/components/banner' },
      { id: 'button', label: 'Button', href: '/components/button' },
      { id: 'left-nav', label: 'Left Nav', href: '/components/left-nav' },
      { id: 'list-item', label: 'List Item', href: '/components/list-item' },
      { id: 'marketplace-card', label: 'Marketplace Card', href: '/components/marketplace-card' },
      { id: 'product-card', label: 'Product Card', href: '/components/product-card' },
      { id: 'segmented-control', label: 'Segmented Control', href: '/components/segmented-control' },
      { id: 'stepper', label: 'Stepper', href: '/components/stepper' },
      { id: 'tab', label: 'Tab', href: '/components/tab' },
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
    background: colors.surface.light,
    display: 'flex',
    position: 'relative' as const,
  },

  sidebar: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: `${SIDEBAR_WIDTH}px`,
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.07)',
    borderRight: '1px solid rgba(0, 0, 0, 0.06)',
    padding: '24px 0',
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: zIndex.header,
    overflowY: 'auto' as const,
    overflowX: 'visible' as const,
    transition: 'width 0.3s ease, transform 0.3s ease, opacity 0.2s ease',
  },

  sidebarCollapsed: {
    width: `${SIDEBAR_COLLAPSED_WIDTH}px`,
  },

  sidebarHidden: {
    transform: `translateX(-${SIDEBAR_WIDTH}px)`,
    opacity: 0,
    pointerEvents: 'none' as const,
  },

  sidebarOverlay: {
    position: 'fixed' as const,
    inset: 0,
    background: colors.scrim,
    zIndex: zIndex.header - 1,
    opacity: 0,
    pointerEvents: 'none' as const,
    transition: 'opacity 0.3s ease',
  },

  sidebarOverlayVisible: {
    opacity: 1,
    pointerEvents: 'auto' as const,
  },

  sidebarToggle: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
    transition: transitionPresets.default,
    color: colors.text.lowEmphasis.onLight,
    padding: 0,
    marginLeft: 'auto',
  },

  sidebarToggleHover: {
    background: 'rgba(0, 0, 0, 0.06)',
    color: colors.text.highEmphasis.onLight,
  },

  sidebarNav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    padding: '0 8px',
  },

  sidebarNavItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: borderRadius.md,
    color: colors.text.lowEmphasis.onLight,
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    transition: transitionPresets.default,
    cursor: 'pointer',
    position: 'relative' as const,
  },

  sidebarNavItemHover: {
    background: 'rgba(0, 0, 0, 0.04)',
    color: colors.text.highEmphasis.onLight,
  },

  sidebarNavItemActive: {
    background: 'rgba(0, 0, 0, 0.08)',
    color: colors.text.highEmphasis.onLight,
  },

  popover: {
    position: 'fixed' as const,
    left: `${SIDEBAR_COLLAPSED_WIDTH + 8}px`,
    background: colors.surface.light,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.lg,
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
    padding: '8px 0',
    minWidth: '200px',
    zIndex: zIndex.modal,
  },

  popoverItem: {
    display: 'block',
    padding: '10px 16px',
    color: colors.text.lowEmphasis.onLight,
    textDecoration: 'none',
    ...typography.body.sm,
    fontWeight: 500,
    transition: transitionPresets.default,
  },

  popoverItemHover: {
    background: colors.surface.lightDarker,
    color: colors.text.highEmphasis.onLight,
  },

  popoverItemActive: {
    background: colors.surface.lightDarker,
    color: colors.brand.default,
    fontWeight: 600,
  },

  sidebarHeader: {
    padding: '0 20px 20px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    marginBottom: '16px',
  },

  sidebarTitle: {
    ...typography.heading.h5,
    color: colors.text.highEmphasis.onLight,
    marginBottom: '4px',
    textDecoration: 'none',
    display: 'block',
  },

  sidebarSubtitle: {
    ...typography.body.sm,
    color: colors.text.lowEmphasis.onLight,
  },

  navSection: {
    marginBottom: '8px',
  },

  navSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '0',
    transition: transitionPresets.default,
    userSelect: 'none' as const,
  },

  navSectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: colors.text.highEmphasis.onLight,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },

  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    padding: '4px 12px 8px',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease, opacity 0.2s ease',
  },

  navLink: {
    padding: '10px 12px',
    borderRadius: borderRadius.md,
    color: colors.text.lowEmphasis.onLight,
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    transition: transitionPresets.default,
    display: 'block',
  },

  navLinkActive: {
    background: 'rgba(0, 0, 0, 0.08)',
    color: colors.text.highEmphasis.onLight,
  },

  navLinkHover: {
    background: 'rgba(0, 0, 0, 0.04)',
    color: colors.text.highEmphasis.onLight,
  },

  content: {
    marginLeft: `${SIDEBAR_WIDTH}px`,
    flex: 1,
    maxWidth: `calc(100% - ${SIDEBAR_WIDTH}px)`,
    padding: '24px',
    transition: 'margin-left 0.3s ease, max-width 0.3s ease',
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
    background: 'linear-gradient(135deg, #13352C 0%, #1A5C4A 50%, #3B9B7E 100%)',
    padding: '24px',
    borderRadius: borderRadius.lg,
  },

  headerTitle: {
    ...typography.heading.h2,
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '8px',
  },

  headerDescription: {
    ...typography.body.md,
    color: 'rgba(255, 255, 255, 0.85)',
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
  },

  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    background: colors.surface.lightDarker,
    fontWeight: 600,
    borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
  },

  td: {
    padding: '12px 16px',
    borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
  },
  
  codeBlock: {
    background: colors.surface.lightDarker,
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
// NAV ITEM COMPONENT (with hover state)
// =============================================================================

function NavItem({
  item,
  isActive,
}: {
  item: { id: string; label: string; href: string }
  isActive: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const getLinkStyle = () => {
    if (isActive) {
      return { ...sharedStyles.navLink, ...sharedStyles.navLinkActive }
    }
    if (isHovered) {
      return { ...sharedStyles.navLink, ...sharedStyles.navLinkHover }
    }
    return sharedStyles.navLink
  }

  return (
    <Link
      href={item.href}
      style={getLinkStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item.label}
    </Link>
  )
}

// =============================================================================
// COLLAPSIBLE NAV SECTION COMPONENT
// =============================================================================

function NavSection({
  section,
  activeId,
  expanded,
  onToggle,
}: {
  section: typeof navSections[0]
  activeId: string
  expanded: boolean
  onToggle: () => void
}) {
  const [isHeaderHovered, setIsHeaderHovered] = useState(false)
  const SectionIcon = iconMap[section.id]
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isSpace = e.key === ' ' || e.key === 'Spacebar'
    const willToggle = e.key === 'Enter' || isSpace
    if (willToggle) {
      if (isSpace) {
        e.preventDefault()
      }
      onToggle()
    }
  }

  return (
    <div style={sharedStyles.navSection}>
      <div
        style={{
          ...sharedStyles.navSectionHeader,
          background: isHeaderHovered ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
        }}
        onClick={onToggle}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={handleKeyDown}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {SectionIcon && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              flexShrink: 0,
              opacity: 0.7,
            }}>
              <SectionIcon />
            </span>
          )}
          <span style={sharedStyles.navSectionTitle}>{section.title}</span>
        </div>
        <IconChevron expanded={expanded} />
      </div>

      <nav
        style={{
          ...sharedStyles.nav,
          maxHeight: expanded ? '500px' : '0px',
          opacity: expanded ? 1 : 0,
          padding: expanded ? '4px 12px 8px' : '0 12px',
        }}
      >
        {section.items.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeId === item.id}
          />
        ))}
      </nav>
    </div>
  )
}

// =============================================================================
// NAV RAIL ITEM (for collapsed sidebar with popover)
// =============================================================================

function NavRailItem({
  section,
  activeId,
}: {
  section: typeof navSections[0]
  activeId: string
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [popoverItemHovered, setPopoverItemHovered] = useState<string | null>(null)
  const [popoverTop, setPopoverTop] = useState(0)
  const itemRef = React.useRef<HTMLDivElement>(null)
  const hideTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const SectionIcon = iconMap[section.id]
  const isActive = section.items.some((item) => item.id === activeId)

  const showPopover = () => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setIsHovered(true)
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect()
      setPopoverTop(rect.top)
    }
  }

  const hidePopover = () => {
    // Delay hiding to allow mouse to move to popover
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovered(false)
      setPopoverItemHovered(null)
    }, 100)
  }

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={itemRef}
      style={{
        ...sharedStyles.sidebarNavItem,
        ...(isHovered ? sharedStyles.sidebarNavItemHover : {}),
        ...(isActive ? sharedStyles.sidebarNavItemActive : {}),
        justifyContent: 'center',
        padding: '12px',
      }}
      onMouseEnter={showPopover}
      onMouseLeave={hidePopover}
    >
      {SectionIcon && (
        <span style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '20px',
          height: '20px',
          flexShrink: 0,
        }}>
          <SectionIcon />
        </span>
      )}

      {/* Popover */}
      {isHovered && (
        <div
          style={{
            ...sharedStyles.popover,
            top: `${popoverTop}px`,
          }}
          onMouseEnter={showPopover}
          onMouseLeave={hidePopover}
        >
          <div style={{
            padding: '8px 16px 6px',
            ...typography.label.sm,
            fontSize: '11px',
            fontWeight: 600,
            color: colors.text.lowEmphasis.onLight,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px',
          }}>
            {section.title}
          </div>
          {section.items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              style={{
                ...sharedStyles.popoverItem,
                ...(popoverItemHovered === item.id ? sharedStyles.popoverItemHover : {}),
                ...(activeId === item.id ? sharedStyles.popoverItemActive : {}),
              }}
              onMouseEnter={() => setPopoverItemHovered(item.id)}
              onMouseLeave={() => setPopoverItemHovered(null)}
            >
              {item.label}
            </Link>
          ))}
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
  activeId: string
  tabs?: { id: string; label: string }[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

export function StyleguideLayout({
  children,
  title,
  description,
  activeId,
  tabs,
  activeTab,
  onTabChange,
}: StyleguideLayoutProps) {
  // Default tabs if none provided
  const displayTabs = tabs || innerPageTabs
  const currentTab = activeTab || 'overview'

  // Find which section contains the active item
  const activeSectionId = navSections.find((s) =>
    s.items.some((item) => item.id === activeId)
  )?.id

  // Track expanded sections - default both open, or just the active one's section
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    foundations: true,
    components: true,
  })

  // Sidebar collapsed state - persisted to localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [toggleHovered, setToggleHovered] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

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
    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      // Auto-collapse on mobile (only if not already hydrated with user preference)
      if (mobile && !isHydrated) {
        setSidebarCollapsed(true)
      }
    }

    // Initial check
    checkMobile()

    // Listen for resize
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [isHydrated])

  // Handle escape key to close sidebar on mobile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile && !sidebarCollapsed) {
        setSidebarCollapsed(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobile, sidebarCollapsed])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const nextValue = !prev[sectionId]
      return {
        ...prev,
        [sectionId]: nextValue,
      }
    })
  }

  return (
    <div style={sharedStyles.page}>
      {/* Mobile overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          style={{
            ...sharedStyles.sidebarOverlay,
            ...sharedStyles.sidebarOverlayVisible,
          }}
          onClick={() => setSidebarCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          ...sharedStyles.sidebar,
          ...(sidebarCollapsed && !isMobile ? sharedStyles.sidebarCollapsed : {}),
          ...(isMobile && sidebarCollapsed ? sharedStyles.sidebarHidden : {}),
        }}
        data-sidebar
      >
        {/* Header with toggle */}
        <div style={{
          ...sharedStyles.sidebarHeader,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          padding: sidebarCollapsed ? '0 12px 20px' : '0 20px 20px',
        }}>
          {!sidebarCollapsed && (
            <div>
              <Link href="/design-system" style={sharedStyles.sidebarTitle}>
                Metrc Design System
              </Link>
              <p style={sharedStyles.sidebarSubtitle}>v1.0.0</p>
            </div>
          )}
          <button
            style={{
              ...sharedStyles.sidebarToggle,
              ...(toggleHovered ? sharedStyles.sidebarToggleHover : {}),
              marginLeft: sidebarCollapsed ? 0 : 'auto',
            }}
            onClick={toggleSidebar}
            onMouseEnter={() => setToggleHovered(true)}
            onMouseLeave={() => setToggleHovered(false)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!sidebarCollapsed}
          >
            {sidebarCollapsed ? (
              <IconSidebarOpen size="sm" />
            ) : (
              <IconSidebarClose size="sm" />
            )}
          </button>
        </div>

        {/* Full nav when expanded */}
        {!sidebarCollapsed && navSections.map((section) => (
          <NavSection
            key={section.id}
            section={section}
            activeId={activeId}
            expanded={expandedSections[section.id] ?? true}
            onToggle={() => toggleSection(section.id)}
          />
        ))}

        {/* Icon rail when collapsed */}
        {sidebarCollapsed && !isMobile && (
          <div style={sharedStyles.sidebarNav}>
            {navSections.map((section) => (
              <NavRailItem
                key={section.id}
                section={section}
                activeId={activeId}
              />
            ))}
          </div>
        )}
      </aside>

      {/* Content */}
      <div
        style={{
          ...sharedStyles.content,
          ...(sidebarCollapsed && !isMobile ? sharedStyles.contentCollapsed : {}),
          ...(isMobile && sidebarCollapsed ? sharedStyles.contentHidden : {}),
        }}
        data-content
      >
        {/* Header Banner */}
        <div style={sharedStyles.headerWrapper}>
          <header style={sharedStyles.header}>
            <h1 style={sharedStyles.headerTitle}>{title}</h1>
            <p style={sharedStyles.headerDescription}>{description}</p>
          </header>

          {/* Tabs - Outside the header */}
          <nav role="tablist" style={sharedStyles.tabsContainer}>
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
        </div>

        <main style={sharedStyles.main}>
          {children}
        </main>
      </div>
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
          color: copied ? 'white' : colors.text.lowEmphasis.onLight,
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
type PlaygroundTab = 'preview' | 'code'

interface PlaygroundProps {
  preview: React.ReactNode
  code: string
  previewBackground?: string
  previewPadding?: string
  previewMinHeight?: string
}

export function Playground({
  preview,
  code,
  previewBackground = colors.surface.lightDarker,
  previewPadding = '48px',
  previewMinHeight = '120px',
}: PlaygroundProps) {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>('preview')

  const playgroundSegments = [
    { id: 'preview', label: 'Preview' },
    { id: 'code', label: 'Code' },
  ]

  return (
    <div>
      {/* Toggle using SegmentedControl component */}
      <div style={{ marginBottom: '16px' }}>
        <SegmentedControl
          segments={playgroundSegments}
          value={activeTab}
          onChange={(id) => setActiveTab(id as PlaygroundTab)}
          size="sm"
        />
      </div>

      {/* Content with rounded grey background */}
      <div style={{
        background: previewBackground,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        // Add border when background is white for visual separation
        ...(previewBackground === colors.surface.light || previewBackground === '#ffffff' || previewBackground === 'white'
          ? { border: `2px solid ${colors.border.lowEmphasis.onLight}` }
          : {}),
      }}>
        {activeTab === 'preview' ? (
          <div style={{
            padding: previewPadding,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: previewMinHeight,
          }}>
            {preview}
          </div>
        ) : (
          <div style={{ padding: '0' }}>
            <CodeBlock>{code}</CodeBlock>
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
          stroke={disabled ? 'rgba(0, 0, 0, 0.38)' : checked ? colors.brand.default : 'rgba(0, 0, 0, 0.6)'}
          strokeWidth="2"
          fill={checked ? colors.brand.default : 'transparent'}
        />
        {checked && (
          <path
            d="M6 10L9 13L14 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <span style={typography.body.sm}>{label}</span>
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
        background: isActive ? colors.brand.default : 'white',
        color: isActive ? 'white' : colors.text.highEmphasis.onLight,
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
