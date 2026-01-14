'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  colors,
  typography,
  borderRadius,
  shadows,
  zIndex,
  transitionPresets,
} from '@/styles/design-tokens'
import { SegmentedControl } from '@/components'

// =============================================================================
// SVG ICONS (Feather-style)
// =============================================================================

const IconColors = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20" />
    <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" fillOpacity="0.3" stroke="none" />
  </svg>
)

const IconTypography = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
)

const IconSpacing = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
)

const IconRadius = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9V6a3 3 0 0 1 3-3h3" />
    <path d="M21 9V6a3 3 0 0 0-3-3h-3" />
    <path d="M21 15v3a3 3 0 0 1-3 3h-3" />
    <path d="M3 15v3a3 3 0 0 0 3 3h3" />
  </svg>
)

const IconShadows = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="14" height="14" rx="2" />
    <path d="M7 21h12a2 2 0 0 0 2-2V7" opacity="0.4" />
  </svg>
)

const IconBreakpoints = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

const IconAvatar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg>
)

const IconButton = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="8" rx="4" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
)

const IconTab = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M3 12h18" />
    <rect x="3" y="3" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
  </svg>
)

const IconBanner = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="6" y1="8" x2="18" y2="8" />
    <line x1="6" y1="12" x2="14" y2="12" />
  </svg>
)

const IconChevron = ({ expanded }: { expanded: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
    }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const IconFoundations = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
)

const IconComponents = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

// Icons page icon
const IconIcons = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)

// Segmented Control icon
const IconSegmentedControl = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="8" width="20" height="8" rx="4" />
    <rect x="3" y="9" width="6" height="6" rx="3" fill="currentColor" fillOpacity="0.3" />
    <line x1="12" y1="10" x2="12" y2="14" />
  </svg>
)

// Icon mapping
const iconMap: Record<string, React.FC> = {
  colors: IconColors,
  typography: IconTypography,
  spacing: IconSpacing,
  radius: IconRadius,
  shadows: IconShadows,
  breakpoints: IconBreakpoints,
  icons: IconIcons,
  avatar: IconAvatar,
  button: IconButton,
  tab: IconTab,
  banner: IconBanner,
  'segmented-control': IconSegmentedControl,
  foundations: IconFoundations,
  components: IconComponents,
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
      { id: 'avatar', label: 'Avatar', href: '/components/avatar' },
      { id: 'banner', label: 'Banner', href: '/components/banner' },
      { id: 'button', label: 'Button', href: '/components/button' },
      { id: 'segmented-control', label: 'Segmented Control', href: '/components/segmented-control' },
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
    background: colors.background.default,
    display: 'flex',
  },

  sidebar: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '260px',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.07)',
    borderRight: '1px solid rgba(0, 0, 0, 0.06)',
    padding: '24px 0',
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: zIndex.header,
    overflowY: 'auto' as const,
  },

  sidebarHeader: {
    padding: '0 20px 20px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    marginBottom: '16px',
  },

  sidebarTitle: {
    ...typography.heading.h5,
    color: colors.text.highEmphasis,
    marginBottom: '4px',
    textDecoration: 'none',
    display: 'block',
  },

  sidebarSubtitle: {
    ...typography.body.sm,
    color: colors.text.mediumEmphasis,
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
    color: colors.text.highEmphasis,
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
    color: colors.text.mediumEmphasis,
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    transition: transitionPresets.default,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  navLinkActive: {
    background: 'rgba(0, 0, 0, 0.06)',
    color: colors.text.highEmphasis,
  },

  navIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    flexShrink: 0,
  },
  
  content: {
    marginLeft: '260px',
    flex: 1,
    maxWidth: 'calc(100% - 260px)',
    padding: '24px',
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
    borderBottom: `1px solid ${colors.border.light}`,
    paddingBottom: '0',
  },

  tab: {
    ...typography.label.md,
    padding: '12px 16px',
    color: colors.text.mediumEmphasis,
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
    color: colors.text.highEmphasis,
    borderBottom: `2px solid ${colors.brand.primary}`,
  },

  main: {
    padding: '40px 0',
  },
  
  section: {
    marginBottom: '64px',
  },
  
  sectionTitle: {
    ...typography.heading.h3,
    color: colors.text.highEmphasis,
    marginBottom: '8px',
  },
  
  sectionDescription: {
    ...typography.body.md,
    color: colors.text.mediumEmphasis,
    marginBottom: '24px',
  },
  
  card: {
    marginBottom: '32px',
  },

  cardTitle: {
    ...typography.heading.h4,
    color: colors.text.highEmphasis,
    marginBottom: '16px',
    marginTop: '24px',
  },
  
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    ...typography.body.sm,
  },
  
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    background: colors.neutral[100],
    fontWeight: 600,
    borderBottom: `1px solid ${colors.border.light}`,
  },
  
  td: {
    padding: '12px 16px',
    borderBottom: `1px solid ${colors.border.light}`,
  },
  
  codeBlock: {
    background: colors.neutral[100],
    padding: '16px 20px',
    borderRadius: borderRadius.md,
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '13px',
    lineHeight: '1.6',
    overflowX: 'auto' as const,
    color: colors.text.highEmphasis,
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
  const SectionIcon = iconMap[section.id]

  return (
    <div style={sharedStyles.navSection}>
      <div
        style={sharedStyles.navSectionHeader}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {SectionIcon && (
            <span style={{ display: 'flex', opacity: 0.7 }}>
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
        {section.items.map((item) => {
          const ItemIcon = iconMap[item.id]
          return (
            <Link
              key={item.id}
              href={item.href}
              style={{
                ...sharedStyles.navLink,
                ...(activeId === item.id ? sharedStyles.navLinkActive : {}),
              }}
            >
              <span style={sharedStyles.navIcon}>
                {ItemIcon && <ItemIcon />}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>
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

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  return (
    <div style={sharedStyles.page}>
      {/* Sidebar */}
      <aside style={sharedStyles.sidebar}>
        <div style={sharedStyles.sidebarHeader}>
          <Link href="/design-system" style={sharedStyles.sidebarTitle}>
            Metrc Design System
          </Link>
          <p style={sharedStyles.sidebarSubtitle}>v1.0.0</p>
        </div>

        {navSections.map((section) => (
          <NavSection
            key={section.id}
            section={section}
            activeId={activeId}
            expanded={expandedSections[section.id] ?? true}
            onToggle={() => toggleSection(section.id)}
          />
        ))}
      </aside>

      {/* Content */}
      <div style={sharedStyles.content}>
        {/* Header Banner */}
        <div style={sharedStyles.headerWrapper}>
          <header style={sharedStyles.header}>
            <h1 style={sharedStyles.headerTitle}>{title}</h1>
            <p style={sharedStyles.headerDescription}>{description}</p>
          </header>

          {/* Tabs - Outside the header */}
          <nav style={sharedStyles.tabsContainer}>
            {displayTabs.map((tab) => (
              <button
                key={tab.id}
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
      console.error('Failed to copy:', err)
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
          background: copied ? colors.semantic.success.main : colors.neutral[200],
          border: 'none',
          borderRadius: borderRadius.sm,
          padding: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: transitionPresets.default,
          color: copied ? 'white' : colors.text.mediumEmphasis,
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
  previewBackground = colors.neutral[50],
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

export function PillButton({ children, isActive = false, onClick, style }: PillButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        border: `1px solid ${isActive ? colors.brand.primary : colors.border.light}`,
        borderRadius: '9999px', // Full pill shape
        background: isActive ? colors.primary[50] : 'white',
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

export function SpecTable({ 
  headers, 
  rows 
}: { 
  headers: string[]
  rows: (string | React.ReactNode)[][] 
}) {
  return (
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
              <td key={j} style={sharedStyles.td}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
