'use client'

import React, { useState } from 'react'
import {
  colors,
  fontFamilies,
  sidebar,
  transitionPresets,
  getSidebarColors,
} from '@/styles/design-tokens'
import { useColors } from '@/styles/themes/theme-provider'

// =============================================================================
// TYPES
// =============================================================================

export interface NavItem {
  id: string
  label: string
  href: string
  icon?: React.ReactNode
  isActive?: boolean
}

export interface NavSection {
  id: string
  title?: string
  items: NavItem[]
}

export interface SidebarProps {
  /** Logo element */
  logo?: React.ReactNode
  /** Navigation sections */
  sections: NavSection[]
  /** Footer items (e.g., Admin, Logout) */
  footerSections?: NavSection[]
  /** Currently active item ID */
  activeItemId?: string
  /** Callback when item is clicked */
  onItemClick?: (item: NavItem) => void
  /** Whether sidebar is collapsed */
  collapsed?: boolean
  /** Custom styles */
  style?: React.CSSProperties
}

// =============================================================================
// SIDEBAR ITEM
// =============================================================================

interface SidebarItemProps {
  item: NavItem
  isActive: boolean
  collapsed: boolean
  onClick?: () => void
}

function SidebarItem({ item, isActive, collapsed, onClick }: SidebarItemProps) {
  const themeColors = useColors()
  const sidebarColors = getSidebarColors(themeColors)
  const [isHovered, setIsHovered] = useState(false)

  const getItemColors = () => {
    if (isActive) return sidebarColors.item.active
    if (isHovered) return sidebarColors.item.hover
    return sidebarColors.item.default
  }

  const itemColors = getItemColors()

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: collapsed ? '0' : sidebar.navItem.gap,
    height: sidebar.navItem.height,
    padding: `${sidebar.navItem.paddingY} ${sidebar.navItem.paddingX}`,
    borderRadius: sidebar.navItem.borderRadius,
    backgroundColor: itemColors.background,
    color: itemColors.text,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: `all ${transitionPresets.default}`,
    fontFamily: fontFamilies.body,
    fontSize: sidebar.navItem.typography.fontSize,
    fontWeight: sidebar.navItem.typography.fontWeight,
    lineHeight: sidebar.navItem.typography.lineHeight,
    border: 'none',
    outline: 'none',
    width: '100%',
    justifyContent: collapsed ? 'center' : 'flex-start',
  }

  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sidebar.navItem.iconSize,
    height: sidebar.navItem.iconSize,
    color: itemColors.icon,
    flexShrink: 0,
  }

  return (
    <button
      type="button"
      style={itemStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
    >
      {item.icon && <span style={iconStyle}>{item.icon}</span>}
      {!collapsed && <span>{item.label}</span>}
    </button>
  )
}

// =============================================================================
// SIDEBAR SECTION
// =============================================================================

interface SidebarSectionProps {
  section: NavSection
  activeItemId?: string
  collapsed: boolean
  onItemClick?: (item: NavItem) => void
  isFirst?: boolean
}

function SidebarSection({
  section,
  activeItemId,
  collapsed,
  onItemClick,
  isFirst,
}: SidebarSectionProps) {
  const themeColors = useColors()
  const sidebarColors = getSidebarColors(themeColors)

  const sectionStyle: React.CSSProperties = {
    marginTop: isFirst ? '0' : sidebar.section.marginTop,
  }

  const labelStyle: React.CSSProperties = {
    display: collapsed ? 'none' : 'block',
    marginBottom: sidebar.section.labelMarginBottom,
    padding: `0 ${sidebar.navItem.paddingX}`,
    fontFamily: fontFamilies.body,
    fontSize: sidebar.section.labelTypography.fontSize,
    fontWeight: sidebar.section.labelTypography.fontWeight,
    lineHeight: sidebar.section.labelTypography.lineHeight,
    letterSpacing: sidebar.section.labelTypography.letterSpacing,
    textTransform: sidebar.section.labelTypography.textTransform,
    color: sidebarColors.sectionLabel,
  }

  return (
    <div style={sectionStyle}>
      {section.title && <div style={labelStyle}>{section.title}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {section.items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={item.id === activeItemId}
            collapsed={collapsed}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// SIDEBAR
// =============================================================================

export function Sidebar({
  logo,
  sections,
  footerSections,
  activeItemId,
  onItemClick,
  collapsed = false,
  style,
}: SidebarProps) {
  const themeColors = useColors()
  const sidebarColors = getSidebarColors(themeColors)

  const sidebarStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: collapsed ? sidebar.collapsedWidth : sidebar.width,
    height: '100vh',
    backgroundColor: sidebarColors.background,
    borderRight: `1px solid ${sidebarColors.border}`,
    padding: `${sidebar.padding.y} ${sidebar.padding.x}`,
    transition: `width ${transitionPresets.default}`,
    overflow: 'hidden',
    ...style,
  }

  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: sidebar.logo.height,
    gap: sidebar.logo.gap,
    marginBottom: '16px',
    padding: `0 ${sidebar.navItem.paddingX}`,
  }

  const navContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  }

  const footerStyle: React.CSSProperties = {
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: `1px solid ${sidebarColors.border}`,
  }

  return (
    <nav style={sidebarStyle}>
      {/* Logo */}
      {logo && <div style={logoContainerStyle}>{logo}</div>}

      {/* Main navigation */}
      <div style={navContainerStyle}>
        {sections.map((section, index) => (
          <SidebarSection
            key={section.id}
            section={section}
            activeItemId={activeItemId}
            collapsed={collapsed}
            onItemClick={onItemClick}
            isFirst={index === 0}
          />
        ))}
      </div>

      {/* Footer navigation */}
      {footerSections && footerSections.length > 0 && (
        <div style={footerStyle}>
          {footerSections.map((section, index) => (
            <SidebarSection
              key={section.id}
              section={section}
              activeItemId={activeItemId}
              collapsed={collapsed}
              onItemClick={onItemClick}
              isFirst={index === 0}
            />
          ))}
        </div>
      )}
    </nav>
  )
}

Sidebar.displayName = 'Sidebar'
