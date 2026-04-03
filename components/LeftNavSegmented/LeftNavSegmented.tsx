'use client'

/**
 * LeftNavSegmented
 *
 * A segmented variant of the LeftNav where each section renders in its own
 * rounded card container, separated by visible gaps. Inspired by the card-based
 * nav pattern from Google Stitch and similar design system docs.
 *
 * Reuses LeftNavSection and LeftNavItem types from LeftNav for compatibility.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  colors,
  fontFamilies,
  typography,
  spacing,
  sidebar,
  transitionPresets,
  zIndex as zIndexTokens,
  shadows,
  button,
  breakpoints,
  borderRadius,
  getSidebarColors,
} from '../../styles/design-tokens'
import { useColors } from '../../styles/themes/theme-provider'
import { usePrefersReducedMotion, useIsMobile } from '../../hooks'
import {
  IconChevronDown,
  IconSidebarOpen,
  IconSidebarClose,
  IconX,
} from '../Icons'
import type { LeftNavSection, LeftNavItem } from '../LeftNav'

// =============================================================================
// TYPES
// =============================================================================

export interface LeftNavSegmentedProps {
  /** Logo element (expanded state) */
  logo?: React.ReactNode
  /** Logo element (collapsed state) */
  collapsedLogo?: React.ReactNode
  /** Navigation sections — each renders as its own card */
  sections: LeftNavSection[]
  /** Footer sections — pinned to bottom */
  footerSections?: LeftNavSection[]
  /** ID of the currently active item */
  activeItemId?: string
  /** Whether the nav is collapsed to icon-only mode */
  collapsed?: boolean
  /** Callback when collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void
  /** Callback when a nav item is clicked */
  onItemClick?: (item: LeftNavItem) => void
  /** Show the collapse/expand toggle button */
  showCollapseToggle?: boolean
  /** Mobile behavior */
  mobileBehavior?: 'drawer' | 'none'
  /** Whether mobile drawer is open */
  mobileOpen?: boolean
  /** Callback when mobile drawer should close */
  onMobileClose?: () => void
  /** Additional styles for the root element */
  style?: React.CSSProperties
}

// =============================================================================
// FOCUS STYLES
// =============================================================================

const focusRingStyle: React.CSSProperties = {
  outline: `${button.focus.width} solid ${button.focus.color}`,
  outlineOffset: '2px',
}

// =============================================================================
// TOOLTIP
// =============================================================================

function Tooltip({
  content,
  visible,
  position,
  id,
  children,
}: {
  content: string
  visible: boolean
  position?: { top: number; left: number }
  id: string
  children: React.ReactNode
}) {
  if (!visible || !position) return <>{children}</>

  return (
    <>
      {children}
      <div
        id={id}
        role="tooltip"
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          transform: 'translateY(-50%)',
          background: colors.surface.dark,
          color: colors.text.highEmphasis.onDark,
          padding: '4px 10px',
          borderRadius: borderRadius.sm,
          fontSize: '12px',
          fontFamily: fontFamilies.body,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: zIndexTokens.tooltip,
          boxShadow: shadows.md,
        }}
      >
        {content}
      </div>
    </>
  )
}

// =============================================================================
// NAV ITEM
// =============================================================================

function NavItem({
  item,
  isActive,
  collapsed,
  onClick,
}: {
  item: LeftNavItem
  isActive: boolean
  collapsed: boolean
  onClick?: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocusVisible, setIsFocusVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const itemRef = useRef<HTMLAnchorElement>(null)
  const wasMouseDownRef = useRef(false)
  const themeColors = useColors()

  const getItemColors = () => {
    if (item.disabled) {
      return {
        background: 'transparent',
        text: themeColors.text.disabled.onLight,
        icon: themeColors.text.disabled.onLight,
      }
    }
    if (isActive) {
      return {
        background: themeColors.brand.default,
        text: themeColors.text.highEmphasis.onLight,
        icon: themeColors.brand.default,
      }
    }
    if (isHovered) {
      return {
        background: themeColors.hover.onLight,
        text: themeColors.text.highEmphasis.onLight,
        icon: themeColors.icon.hover.onLight,
      }
    }
    return {
      background: 'transparent',
      text: themeColors.text.lowEmphasis.onLight,
      icon: themeColors.icon.enabled.onLight,
    }
  }

  const itemColors = getItemColors()
  const showPill = (isActive || isHovered) && !item.disabled

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: collapsed ? '0' : sidebar.navItem.gap,
    height: sidebar.navItem.height,
    padding: `${sidebar.navItem.paddingY} ${sidebar.navItem.paddingX}`,
    borderRadius: sidebar.navItem.borderRadius,
    backgroundColor: 'transparent',
    color: itemColors.text,
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    textDecoration: 'none',
    transition: `all ${transitionPresets.default}`,
    fontFamily: fontFamilies.body,
    fontSize: sidebar.navItem.typography.fontSize,
    fontWeight: isActive ? sidebar.navItem.typographyActive.fontWeight : sidebar.navItem.typography.fontWeight,
    lineHeight: sidebar.navItem.typography.lineHeight,
    width: '100%',
    justifyContent: collapsed ? 'center' : 'flex-start',
    opacity: item.disabled ? 0.5 : 1,
    position: 'relative',
    ...(isFocusVisible && !item.disabled ? focusRingStyle : { outline: 'none' }),
  }

  const pillStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0px',
    bottom: '0px',
    left: collapsed ? '4px' : '4px',
    right: collapsed ? '4px' : '4px',
    backgroundColor: isActive
      ? themeColors.selectedHighlight
      : isHovered
        ? themeColors.hover.onLight
        : 'transparent',
    borderRadius: sidebar.navItem.borderRadius,
    zIndex: 0,
    transition: `all ${transitionPresets.fast}`,
  }

  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sidebar.navItem.iconSize,
    height: sidebar.navItem.iconSize,
    color: isActive ? themeColors.brand.default : itemColors.icon,
    flexShrink: 0,
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (collapsed && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect()
      setTooltipPosition({ top: rect.top + rect.height / 2, left: rect.right + 12 })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTooltipPosition(null)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (item.disabled) {
      e.preventDefault()
      return
    }
    onClick?.()
  }

  const tooltipId = `tooltip-${item.id}`

  const content = (
    <Link
      ref={itemRef}
      href={item.href}
      style={itemStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => { wasMouseDownRef.current = true }}
      onFocus={() => {
        if (!wasMouseDownRef.current) setIsFocusVisible(true)
        wasMouseDownRef.current = false
        if (collapsed && itemRef.current) {
          const rect = itemRef.current.getBoundingClientRect()
          setTooltipPosition({ top: rect.top + rect.height / 2, left: rect.right + 12 })
        }
      }}
      onBlur={() => {
        setIsFocusVisible(false)
        setTooltipPosition(null)
      }}
      aria-label={collapsed ? item.label : undefined}
      aria-describedby={collapsed && (isHovered || isFocusVisible) && !item.disabled ? tooltipId : undefined}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={item.disabled}
      tabIndex={item.disabled ? -1 : 0}
    >
      {showPill && <span style={pillStyle} aria-hidden="true" />}
      {item.icon && <span style={{ ...iconStyle, position: 'relative', zIndex: 1 }}>{item.icon}</span>}
      {!collapsed && (
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', position: 'relative', zIndex: 1 }}>
          {item.label}
        </span>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip content={item.label} visible={(isHovered || isFocusVisible) && !item.disabled} position={tooltipPosition ?? undefined} id={tooltipId}>
        {content}
      </Tooltip>
    )
  }

  return content
}

// =============================================================================
// SECTION CARD
// =============================================================================

function SectionCard({
  section,
  activeItemId,
  collapsed,
  onItemClick,
}: {
  section: LeftNavSection
  activeItemId?: string
  collapsed: boolean
  onItemClick?: (item: LeftNavItem) => void
}) {
  const hasActiveItem = section.items.some((item) => item.id === activeItemId)
  const [isExpanded, setIsExpanded] = useState(hasActiveItem || section.defaultExpanded === true)
  const themeColors = useColors()

  const cardStyle: React.CSSProperties = {
    background: themeColors.surface.lightDarker,
    borderRadius: borderRadius.lg,
    padding: collapsed ? `${spacing.xs} ${spacing['2xs']}` : `${spacing.xs} ${spacing.xs}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    transition: `all ${transitionPresets.default}`,
    ...(collapsed ? { alignItems: 'center' } : {}),
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing['2xs']} ${sidebar.navItem.paddingX}`,
    cursor: 'pointer',
    userSelect: 'none',
    borderRadius: sidebar.navItem.borderRadius,
  }

  const headerLabelStyle: React.CSSProperties = {
    ...typography.label.sm,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: themeColors.text.lowEmphasis.onLight,
    flex: 1,
  }

  const headerIconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    color: themeColors.text.lowEmphasis.onLight,
    flexShrink: 0,
  }

  // Collapsed: show just the section icon centered
  if (collapsed && section.icon) {
    return (
      <div style={cardStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: sidebar.navItem.borderRadius,
            color: themeColors.icon.enabled.onLight,
          }}
          title={section.title}
        >
          {section.icon}
        </div>
      </div>
    )
  }

  // Collapsed: no icon, just show items as icon buttons
  if (collapsed) {
    return (
      <div style={cardStyle}>
        {section.items.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={item.id === activeItemId}
            collapsed
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      {/* Section header */}
      {section.title && (
        <div
          style={headerStyle}
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsExpanded(!isExpanded)
            }
          }}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-controls={`section-${section.id}-items`}
        >
          {section.icon && <span style={headerIconStyle}>{section.icon}</span>}
          <span style={headerLabelStyle}>{section.title}</span>
          <span
            style={{
              ...headerIconStyle,
              transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: `transform ${transitionPresets.default}`,
            }}
          >
            <IconChevronDown />
          </span>
        </div>
      )}

      {/* Items */}
      <div
        id={`section-${section.id}-items`}
        className="segmented-nav-scroll"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          maxHeight: isExpanded ? 'calc(100vh - 280px)' : '0',
          opacity: isExpanded ? 1 : 0,
          overflowY: isExpanded ? 'auto' : 'hidden',
          overflowX: 'hidden',
          transition: `max-height ${transitionPresets.slow}, opacity ${transitionPresets.default}`,
          paddingRight: '2px',
        }}
      >
        {section.items.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={item.id === activeItemId}
            collapsed={false}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LeftNavSegmented({
  logo,
  collapsedLogo,
  sections,
  footerSections,
  activeItemId,
  collapsed = false,
  onCollapseChange,
  onItemClick,
  showCollapseToggle = true,
  mobileBehavior = 'drawer',
  mobileOpen = false,
  onMobileClose,
  style,
}: LeftNavSegmentedProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const themeColors = useColors()

  const SIDEBAR_WIDTH = parseInt(sidebar.width)
  const SIDEBAR_COLLAPSED_WIDTH = parseInt(sidebar.collapsedWidth)

  // ── Nav container (transparent — sections provide their own cards) ──
  const navStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: collapsed ? `${SIDEBAR_COLLAPSED_WIDTH}px` : `${SIDEBAR_WIDTH}px`,
    height: '100%',
    backgroundColor: 'transparent',
    padding: `${sidebar.padding.y} ${spacing['2xs']}`,
    transition: prefersReducedMotion ? 'none' : `width ${transitionPresets.default}`,
    overflow: 'hidden',
    position: 'relative',
    ...style,
  }

  // ── Logo area ──
  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'space-between',
    padding: `0 ${collapsed ? '0' : spacing.sm}`,
    marginBottom: spacing.sm,
    minHeight: '48px',
    flexShrink: 0,
  }

  // ── Collapse toggle ──
  const toggleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: borderRadius.sm,
    border: 'none',
    background: 'transparent',
    color: themeColors.text.lowEmphasis.onLight,
    cursor: 'pointer',
    transition: `all ${transitionPresets.default}`,
    flexShrink: 0,
  }

  // ── Scroll area (no scroll here — each card scrolls internally) ──
  const scrollAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  }

  // ── Footer ──
  const footerAreaStyle: React.CSSProperties = {
    marginTop: 'auto',
    paddingTop: spacing.xs,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    flexShrink: 0,
  }

  // ── Mobile drawer ──
  const isMobileDrawer = isMobile && mobileBehavior === 'drawer'

  if (isMobileDrawer) {
    return (
      <>
        {/* Scrim */}
        {mobileOpen && (
          <div
            onClick={onMobileClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: themeColors.scrim,
              zIndex: zIndexTokens.overlay,
              transition: `opacity ${transitionPresets.default}`,
            }}
            aria-hidden="true"
          />
        )}
        {/* Drawer */}
        <nav
          aria-label="Main navigation"
          style={{
            ...navStyle,
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: `${SIDEBAR_WIDTH}px`,
            backgroundColor: themeColors.surface.light,
            transform: mobileOpen ? 'translateX(0)' : `translateX(-${SIDEBAR_WIDTH}px)`,
            transition: `transform ${transitionPresets.default}`,
            zIndex: zIndexTokens.overlay + 1,
            padding: `${sidebar.padding.y} ${spacing.xs}`,
          }}
        >
          {/* Close button */}
          <div style={{ ...logoContainerStyle, justifyContent: 'space-between' }}>
            {logo}
            <button
              onClick={onMobileClose}
              aria-label="Close navigation"
              style={toggleStyle}
            >
              <IconX size={20} />
            </button>
          </div>

          <div style={scrollAreaStyle}>
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                activeItemId={activeItemId}
                collapsed={false}
                onItemClick={(item) => {
                  onItemClick?.(item)
                  onMobileClose?.()
                }}
              />
            ))}
          </div>

          {footerSections && (
            <div style={footerAreaStyle}>
              {footerSections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  activeItemId={activeItemId}
                  collapsed={false}
                  onItemClick={(item) => {
                    onItemClick?.(item)
                    onMobileClose?.()
                  }}
                />
              ))}
            </div>
          )}
        </nav>
      </>
    )
  }

  // ── Custom scrollbar styles ──
  const scrollbarCSS = `
    .segmented-nav-scroll::-webkit-scrollbar {
      width: 3px;
    }
    .segmented-nav-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .segmented-nav-scroll::-webkit-scrollbar-thumb {
      background: ${themeColors.scrollbar.enabled.onLight};
      border-radius: 9999px;
    }
    .segmented-nav-scroll::-webkit-scrollbar-thumb:hover {
      background: ${themeColors.scrollbar.hover.onLight};
    }
    .segmented-nav-scroll {
      scrollbar-width: thin;
      scrollbar-color: ${themeColors.scrollbar.enabled.onLight} transparent;
    }
    .segmented-nav-outer::-webkit-scrollbar {
      width: 0px;
    }
    .segmented-nav-outer {
      scrollbar-width: none;
    }
  `

  // ── Desktop nav ──
  return (
    <nav aria-label="Main navigation" style={navStyle}>
      <style>{scrollbarCSS}</style>
      {/* Logo */}
      <div style={logoContainerStyle}>
        {collapsed ? collapsedLogo : logo}
        {showCollapseToggle && (
          <button
            onClick={() => onCollapseChange?.(!collapsed)}
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            style={toggleStyle}
          >
            {collapsed ? <IconSidebarOpen size={18} /> : <IconSidebarClose size={18} />}
          </button>
        )}
      </div>

      {/* Section cards */}
      <div className="segmented-nav-outer" style={scrollAreaStyle}>
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            activeItemId={activeItemId}
            collapsed={collapsed}
            onItemClick={onItemClick}
          />
        ))}
      </div>

      {/* Footer sections */}
      {footerSections && (
        <div style={footerAreaStyle}>
          {footerSections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              activeItemId={activeItemId}
              collapsed={collapsed}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </nav>
  )
}

export default LeftNavSegmented
