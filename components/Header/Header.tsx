'use client'

import React, { useState } from 'react'
import {
  colors,
  fontFamilies,
  header,
  transitionPresets,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

export interface HeaderProps {
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Search value */
  searchValue?: string
  /** Callback when search value changes */
  onSearchChange?: (value: string) => void
  /** Organization name */
  orgName?: string
  /** Organization label */
  orgLabel?: string
  /** Organization avatar/badge */
  orgBadge?: React.ReactNode
  /** Right side actions (notifications, help, etc.) */
  actions?: React.ReactNode
  /** Custom styles */
  style?: React.CSSProperties
}

// =============================================================================
// SEARCH INPUT
// =============================================================================

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

function SearchInput({ placeholder = 'Find or ask about a product or integration', value, onChange }: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: header.search.width,
    height: header.search.height,
    padding: `${header.search.paddingY} ${header.search.paddingX}`,
    gap: header.search.gap,
    borderRadius: header.search.borderRadius,
    backgroundColor: isFocused ? header.search.colors.backgroundFocus : header.search.colors.background,
    border: isFocused ? `1px solid ${header.search.colors.borderFocus}` : `1px solid ${header.search.colors.border}`,
    transition: `all ${transitionPresets.default}`,
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: fontFamilies.body,
    fontSize: header.search.typography.fontSize,
    fontWeight: header.search.typography.fontWeight,
    lineHeight: header.search.typography.lineHeight,
    color: header.search.colors.text,
  }

  const iconStyle: React.CSSProperties = {
    width: header.search.iconSize,
    height: header.search.iconSize,
    color: header.search.colors.icon,
    flexShrink: 0,
  }

  return (
    <div style={containerStyle}>
      {/* Search Icon */}
      <svg
        style={iconStyle}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <input
        type="text"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={inputStyle}
      />
      {/* Microphone Icon */}
      <svg
        style={iconStyle}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10V5C12.5 3.61929 11.3807 2.5 10 2.5C8.61929 2.5 7.5 3.61929 7.5 5V10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 9.16667V10C15 12.7614 12.7614 15 10 15C7.23858 15 5 12.7614 5 10V9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 15V17.5M7.5 17.5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

// =============================================================================
// ICON BUTTON
// =============================================================================

interface IconButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  ariaLabel: string
}

function IconButton({ icon, onClick, ariaLabel }: IconButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: header.iconButton.size,
    height: header.iconButton.size,
    borderRadius: header.iconButton.borderRadius,
    backgroundColor: isHovered ? header.iconButton.colors.hover.background : header.iconButton.colors.default.background,
    color: isHovered ? header.iconButton.colors.hover.icon : header.iconButton.colors.default.icon,
    border: 'none',
    cursor: 'pointer',
    transition: `all ${transitionPresets.default}`,
  }

  return (
    <button
      type="button"
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  )
}

// =============================================================================
// ORG DROPDOWN
// =============================================================================

interface OrgDropdownProps {
  name: string
  label: string
  badge?: React.ReactNode
}

function OrgDropdown({ name, label, badge }: OrgDropdownProps) {
  const [isHovered, setIsHovered] = useState(false)

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: header.orgDropdown.height,
    padding: `0 ${header.orgDropdown.paddingX}`,
    gap: header.orgDropdown.gap,
    borderRadius: header.orgDropdown.borderRadius,
    backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
    cursor: 'pointer',
    transition: `all ${transitionPresets.default}`,
  }

  const badgeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: colors.brand.primary,
    color: colors.neutral[0],
    fontFamily: fontFamilies.body,
    fontSize: '12px',
    fontWeight: 600,
  }

  const textContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  }

  const nameStyle: React.CSSProperties = {
    fontFamily: fontFamilies.body,
    fontSize: header.orgDropdown.typography.name.fontSize,
    fontWeight: header.orgDropdown.typography.name.fontWeight,
    lineHeight: header.orgDropdown.typography.name.lineHeight,
    color: colors.text.highEmphasis,
  }

  const labelStyleCss: React.CSSProperties = {
    fontFamily: fontFamilies.body,
    fontSize: header.orgDropdown.typography.label.fontSize,
    fontWeight: header.orgDropdown.typography.label.fontWeight,
    lineHeight: header.orgDropdown.typography.label.lineHeight,
    color: colors.text.lowEmphasis,
  }

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {badge || <div style={badgeStyle}>ON</div>}
      <div style={textContainerStyle}>
        <span style={nameStyle}>{name}</span>
        <span style={labelStyleCss}>{label}</span>
      </div>
    </div>
  )
}

// =============================================================================
// HEADER
// =============================================================================

export function Header({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  orgName = 'Organization Name',
  orgLabel = 'Organization',
  orgBadge,
  actions,
  style,
}: HeaderProps) {
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: header.height,
    padding: `${header.padding.y} ${header.padding.x}`,
    backgroundColor: header.colors.background,
    borderBottom: `1px solid ${header.colors.border}`,
    ...style,
  }

  const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  }

  const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }

  // Notification bell icon
  const notificationIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  // Help icon
  const helpIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 17H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <header style={headerStyle}>
      {/* Center - Search */}
      <div style={leftSectionStyle}>
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
        />
      </div>

      {/* Right - Actions and Org */}
      <div style={rightSectionStyle}>
        {actions || (
          <>
            <IconButton icon={notificationIcon} ariaLabel="Notifications" />
            <IconButton icon={helpIcon} ariaLabel="Help" />
          </>
        )}
        <OrgDropdown
          name={orgName}
          label={orgLabel}
          badge={orgBadge}
        />
      </div>
    </header>
  )
}

Header.displayName = 'Header'

// Export sub-components for flexibility
export { SearchInput, IconButton, OrgDropdown }
