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
import { useThemeSwitcher, availableThemes } from '@/styles/themes'

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
// Shield/checkmark icon for Tools section
const IconTools = ({ size = 'md' }: { size?: string }) => (
  <svg width={size === 'sm' ? 16 : 20} height={size === 'sm' ? 16 : 20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 1L3 5v4.5c0 4.42 2.98 8.56 7 9.5 4.02-.94 7-5.08 7-9.5V5l-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 10l2 2 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Layers icon for Prototypes section
const IconPrototypes = ({ size = 'md' }: { size?: string }) => (
  <svg width={size === 'sm' ? 16 : 20} height={size === 'sm' ? 16 : 20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2L2 6.5l8 4.5 8-4.5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 10l8 4.5L18 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 13.5l8 4.5 8-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const iconMap: Record<string, React.FC> = {
  foundations: () => <IconFoundations size="md" />,
  components: () => <IconComponents size="md" />,
  tools: () => <IconTools size="md" />,
  prototypes: () => <IconPrototypes size="md" />,
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
      { id: 'assistive-message', label: 'Assistive Message', href: '/components/assistive-message' },
      { id: 'avatar', label: 'Avatar', href: '/components/avatar' },
      { id: 'badge', label: 'Badge', href: '/components/badge' },
      { id: 'banner', label: 'Banner', href: '/components/banner' },
      { id: 'button', label: 'Button', href: '/components/button' },
      { id: 'checkbox', label: 'Checkbox', href: '/components/checkbox' },
      { id: 'chip', label: 'Chip', href: '/components/chip' },
      { id: 'combobox', label: 'Combobox', href: '/components/combobox' },
      { id: 'data-table', label: 'Data Table', href: '/components/data-table' },
      { id: 'divider', label: 'Divider', href: '/components/divider' },
      { id: 'full-screen-modal', label: 'Full Screen Modal', href: '/components/full-screen-modal' },
      { id: 'input', label: 'Input', href: '/components/input' },
      { id: 'link', label: 'Link', href: '/components/link' },
      { id: 'radio', label: 'Radio', href: '/components/radio' },
      { id: 'switch', label: 'Switch', href: '/components/switch' },
      { id: 'header', label: 'Header', href: '/components/header' },
      { id: 'left-nav', label: 'Left Nav', href: '/components/left-nav' },
      { id: 'list-item', label: 'List Item', href: '/components/list-item' },
      { id: 'marketplace-card', label: 'Marketplace Card', href: '/components/marketplace-card' },
      { id: 'product-card', label: 'Product Card', href: '/components/product-card' },
      { id: 'segmented-control', label: 'Segmented Control', href: '/components/segmented-control' },
      { id: 'stepper', label: 'Stepper', href: '/components/stepper' },
      { id: 'tab', label: 'Tab', href: '/components/tab' },
      { id: 'progress-bar', label: 'Progress Bar', href: '/components/progress-bar' },
      { id: 'upload', label: 'Upload', href: '/components/upload' },
    ],
  },
  {
    id: 'prototypes',
    title: 'Prototypes',
    items: [
      { id: 'prototypes-index', label: 'All Prototypes', href: '/prototypes' },
      { id: 'product-registry', label: 'Product Registry', href: '/prototypes/product-registry' },
      { id: 'qr-verify', label: 'QR Verify', href: '/prototypes/qr-verify' },
      { id: 'rid-landing-page', label: 'RID Landing Page', href: '/prototypes/rid-landing-page' },
      { id: 'product-search', label: 'Product Search', href: '/prototypes/product-search' },
      { id: 'transfer-manifest', label: 'Transfer Manifest', href: '/prototypes/transfer-manifest' },
      { id: 'rid-tag-generator', label: 'RID Tag Generator', href: '/prototypes/rid-tag-generator' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    items: [
      { id: 'compliance', label: 'Compliance Dashboard', href: '/design-system/compliance' },
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
    background: colors.surface.lightDarker,
    borderRight: `1px solid ${colors.border.lowEmphasis.onLight}`,
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
    background: colors.hover.onLight,
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
    background: colors.hover.onLight,
    color: colors.text.highEmphasis.onLight,
  },

  sidebarNavItemActive: {
    background: colors.selected.onLight,
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
    borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
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
    color: colors.text.highEmphasis.onLight,
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
    background: colors.selected.onLight,
    color: colors.text.highEmphasis.onLight,
  },

  navLinkHover: {
    background: colors.hover.onLight,
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
    background: `linear-gradient(135deg, ${colors.brand.darker} 0%, ${colors.brand.default} 50%, ${colors.brand.lighter} 100%)`,
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
          background: isHeaderHovered ? colors.hover.onLight : 'transparent',
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
              color: colors.icon.enabled.onLight,
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
          maxHeight: expanded ? '2000px' : '0px',
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
  headerAction?: React.ReactNode
}

export function StyleguideLayout({
  children,
  title,
  description,
  activeId,
  tabs,
  activeTab,
  onTabChange,
  headerAction,
}: StyleguideLayoutProps) {
  // Default tabs if none provided
  const displayTabs = tabs || innerPageTabs
  const currentTab = activeTab || 'overview'

  // Find which section contains the active item
  const activeSectionId = navSections.find((s) =>
    s.items.some((item) => item.id === activeId)
  )?.id

  // Track expanded sections - restore from localStorage, default all open
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ds-nav-expanded')
        if (stored) return JSON.parse(stored)
      } catch {}
    }
    return { foundations: true, components: true, prototypes: true, tools: true }
  })

  // Sidebar collapsed state - default collapsed on first visit
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [toggleHovered, setToggleHovered] = useState(false)
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

  const sidebarRef = React.useRef<HTMLElement>(null)

  // Restore sidebar scroll position on mount
  useEffect(() => {
    const el = sidebarRef.current
    if (!el) return
    const stored = sessionStorage.getItem('ds-sidebar-scroll')
    if (stored) el.scrollTop = parseInt(stored, 10)

    // Save scroll position on every scroll
    const onScroll = () => {
      sessionStorage.setItem('ds-sidebar-scroll', String(el.scrollTop))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = { ...prev, [sectionId]: !prev[sectionId] }
      try { localStorage.setItem('ds-nav-expanded', JSON.stringify(next)) } catch {}
      return next
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
        ref={sidebarRef}
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
          flexDirection: 'column' as const,
          gap: sidebarCollapsed ? '0' : '12px',
          padding: sidebarCollapsed ? '0 12px 20px' : '0 20px 20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          }}>
            {!sidebarCollapsed && (
              <div>
                <p style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase' as const,
                  color: colors.text.lowEmphasis.onLight,
                  margin: '0 0 2px 0',
                  fontFamily: fontFamilies.body,
                }}>
                  Prism
                </p>
                <Link href="/" style={sharedStyles.sidebarTitle}>
                  Design System
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

          {/* Theme switcher */}
          {!sidebarCollapsed && (
            <select
              id="ds-theme-select"
              aria-label="Theme"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: borderRadius.sm,
                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                background: 'transparent',
                color: colors.text.lowEmphasis.onLight,
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: fontFamilies.body,
                cursor: 'pointer',
                appearance: 'auto' as const,
              }}
            >
              {availableThemes.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                </option>
              ))}
            </select>
          )}
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
        {/* Header Banner — gradient uses CSS-variable-backed brand tokens */}
        <div style={sharedStyles.headerWrapper}>
          <header style={{
            ...sharedStyles.header,
            background: `linear-gradient(135deg, ${colors.brand.darker} 0%, ${colors.brand.default} 50%, ${colors.brand.lighter} 100%)`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1 style={sharedStyles.headerTitle}>{title}</h1>
              {headerAction}
            </div>
            <p style={sharedStyles.headerDescription}>{description}</p>
          </header>

          {/* Tabs - Outside the header */}
          {displayTabs.length > 0 && (
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
          )}
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
        background: activeTab === 'source' ? '#1e1e1e' : previewBackground,
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
              background: '#2d2d2d',
              borderBottom: '1px solid #404040',
            }}>
              <span style={{
                fontSize: '12px',
                fontFamily: fontFamilies.mono,
                color: '#888',
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
                    : '#404040',
                  color: (sourceSaveStatus === 'saved' || hasSourceChanges)
                    ? '#FFFFFF'
                    : '#666',
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
                background: '#3a1a1a',
                color: '#ff6b6b',
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
                background: '#1e1e1e',
                color: '#d4d4d4',
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
              ? '#FFFFFF'
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
          background: '#FBE4E7',
          color: '#9A0818',
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
              color: copiedYaml ? '#fff' : colors.text.lowEmphasis.onLight,
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
                color: copiedImport ? '#fff' : colors.text.lowEmphasis.onLight,
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
