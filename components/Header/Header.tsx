'use client'

import React, { forwardRef, useState, useCallback, useEffect, useRef } from 'react'
import {
  fontFamilies,
  header,
  transitionPresets,
  breakpoints,
  zIndex,
  borderRadius,
  shadows,
} from '@/styles/design-tokens'
import { useColors } from '@/styles/themes'

// =============================================================================
// TYPES
// =============================================================================

export interface HeaderProps {
  /** Logo element displayed at the left */
  logo?: React.ReactNode
  /** App/Brand name displayed next to logo */
  appName?: string
  /** App description/subtitle */
  appDescription?: string
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Search value (controlled) */
  searchValue?: string
  /** Callback when search value changes */
  onSearchChange?: (value: string) => void
  /** Callback when search is submitted */
  onSearchSubmit?: (value: string) => void
  /** Whether to show the search bar */
  showSearch?: boolean
  /** Organization name */
  orgName?: string
  /** Organization label */
  orgLabel?: string
  /** Organization avatar/badge element */
  orgBadge?: React.ReactNode
  /** Callback when org dropdown is clicked */
  onOrgClick?: () => void
  /** Right side actions (notifications, help, etc.) */
  actions?: React.ReactNode
  /** Whether to show the apps grid button */
  showAppsButton?: boolean
  /** Callback when sidebar toggle is clicked */
  onSidebarToggle?: () => void
  /** Callback when apps button is clicked */
  onAppsClick?: () => void
  /** Whether the header is sticky */
  sticky?: boolean
  /** Custom styles for the root element */
  style?: React.CSSProperties
  /** Custom class name */
  className?: string
}

// =============================================================================
// MEDIA QUERY HOOK (inline for responsiveness)
// =============================================================================

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

// =============================================================================
// REDUCED MOTION HOOK
// =============================================================================

function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

// =============================================================================
// FOCUS TRAP HOOK (for mobile menu dialog)
// =============================================================================

function useFocusTrap(
  containerRef: React.RefObject<HTMLDivElement | null>,
  isActive: boolean,
  onClose: () => void,
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>,
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

    // Move focus into the dialog
    const firstFocusable = container.querySelector<HTMLElement>(focusableSelector)
    firstFocusable?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusables = container.querySelectorAll<HTMLElement>(focusableSelector)
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Return focus to trigger element
      returnFocusRef?.current?.focus()
    }
  }, [isActive, containerRef, onClose, returnFocusRef])
}

// =============================================================================
// SEARCH INPUT SUB-COMPONENT
// =============================================================================

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  collapsed?: boolean
}

function SearchInput({
  placeholder = 'Find or ask about a product or integration',
  value,
  onChange,
  onSubmit,
  collapsed = false,
}: SearchInputProps) {
  const colors = useColors()
  const reducedMotion = usePrefersReducedMotion()
  const [isFocused, setIsFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [internalValue, setInternalValue] = useState(value ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  const currentValue = value !== undefined ? value : internalValue

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value
      if (value === undefined) setInternalValue(newVal)
      onChange?.(newVal)
    },
    [onChange, value],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSubmit?.(currentValue)
      }
      if (e.key === 'Escape' && collapsed) {
        setIsExpanded(false)
      }
    },
    [onSubmit, currentValue, collapsed],
  )

  // Focus the input when expanding from collapsed state
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  // Collapsed state: show icon-only button that expands on click
  if (collapsed && !isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        aria-label="Open search"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // WCAG 2.5.8: minimum 44px
          width: '44px',
          height: '44px',
          borderRadius: header.iconButton.borderRadius,
          backgroundColor: 'transparent',
          color: colors.icon.enabled.onLight,
          border: 'none',
          cursor: 'pointer',
          transition: reducedMotion ? 'none' : `all ${transitionPresets.default}`,
        }}
      >
        <SearchIcon size={20} />
      </button>
    )
  }

  return (
    <div
      role="search"
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: header.search.width,
        height: header.search.height,
        padding: `${header.search.paddingY} ${header.search.paddingX}`,
        gap: header.search.gap,
        borderRadius: header.search.borderRadius,
        backgroundColor: isFocused
          ? colors.surface.light
          : colors.surface.lightDarker,
        border: isFocused
          ? `2px solid ${colors.focusBorder.onLight}`
          : '2px solid transparent',
        transition: reducedMotion ? 'none' : `all ${transitionPresets.default}`,
        boxSizing: 'border-box',
      }}
    >
      <SearchIcon size={parseInt(header.search.iconSize)} color={colors.icon.enabled.onLight} />
      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        aria-label={placeholder}
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          // Collapse back when losing focus if in collapsed mode
          if (collapsed) setIsExpanded(false)
        }}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: fontFamilies.body,
          fontSize: header.search.typography.fontSize,
          fontWeight: header.search.typography.fontWeight,
          lineHeight: header.search.typography.lineHeight,
          color: colors.text.highEmphasis.onLight,
          minWidth: 0,
        }}
      />
    </div>
  )
}

// =============================================================================
// ICON BUTTON SUB-COMPONENT
// =============================================================================

interface IconButtonProps {
  /** Icon element to render */
  icon: React.ReactNode
  /** Click handler */
  onClick?: () => void
  /** Accessible label (required) */
  ariaLabel: string
  /** Whether to show a notification dot */
  showBadge?: boolean
}

function IconButton({ icon, onClick, ariaLabel, showBadge }: IconButtonProps) {
  const colors = useColors()
  const reducedMotion = usePrefersReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const [isFocusVisible, setIsFocusVisible] = useState(false)

  // Accessible label: append "(new)" when badge is shown so SR users know
  const effectiveLabel = showBadge ? `${ariaLabel} (new)` : ariaLabel

  return (
    <button
      type="button"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // WCAG 2.5.8: minimum 44x44 CSS px touch target
        width: '44px',
        height: '44px',
        borderRadius: header.iconButton.borderRadius,
        backgroundColor: isHovered
          ? colors.hover.onLight
          : 'transparent',
        color: isHovered
          ? colors.text.highEmphasis.onLight
          : colors.icon.enabled.onLight,
        border: 'none',
        cursor: 'pointer',
        transition: reducedMotion ? 'none' : `all ${transitionPresets.default}`,
        position: 'relative',
        outline: isFocusVisible
          ? `2px solid ${colors.focusBorder.onLight}`
          : 'none',
        outlineOffset: '2px',
        padding: 0,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={(e) => {
        if (e.target.matches(':focus-visible')) setIsFocusVisible(true)
      }}
      onBlur={() => setIsFocusVisible(false)}
      aria-label={effectiveLabel}
    >
      {icon}
      {showBadge && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: colors.status.important,
            border: `2px solid ${colors.surface.light}`,
          }}
        />
      )}
    </button>
  )
}

// =============================================================================
// ORG DROPDOWN SUB-COMPONENT
// =============================================================================

interface OrgDropdownProps {
  name: string
  label: string
  badge?: React.ReactNode
  onClick?: () => void
}

function OrgDropdown({ name, label, badge, onClick }: OrgDropdownProps) {
  const colors = useColors()
  const reducedMotion = usePrefersReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const [isFocusVisible, setIsFocusVisible] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={(e) => {
        if (e.target.matches(':focus-visible')) setIsFocusVisible(true)
      }}
      onBlur={() => setIsFocusVisible(false)}
      aria-label={`${name} - ${label}`}
      aria-haspopup="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        // WCAG 2.5.8: minimum 44px touch target height
        minHeight: '44px',
        padding: `0 ${header.orgDropdown.paddingX}`,
        gap: header.orgDropdown.gap,
        borderRadius: header.orgDropdown.borderRadius,
        backgroundColor: isHovered ? colors.hover.onLight : 'transparent',
        cursor: 'pointer',
        transition: reducedMotion ? 'none' : `all ${transitionPresets.default}`,
        border: 'none',
        outline: isFocusVisible
          ? `2px solid ${colors.focusBorder.onLight}`
          : 'none',
        outlineOffset: '2px',
      }}
    >
      {badge || (
        <span
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: colors.brand.default,
            color: colors.text.highEmphasis.onDark,
            fontFamily: fontFamilies.body,
            fontSize: '12px',
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {name.slice(0, 2).toUpperCase()}
        </span>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: header.orgDropdown.typography.name.fontSize,
            fontWeight: header.orgDropdown.typography.name.fontWeight,
            lineHeight: header.orgDropdown.typography.name.lineHeight,
            color: colors.text.highEmphasis.onLight,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '160px',
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: header.orgDropdown.typography.label.fontSize,
            fontWeight: header.orgDropdown.typography.label.fontWeight,
            lineHeight: header.orgDropdown.typography.label.lineHeight,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          {label}
        </span>
      </div>
      <ChevronDownIcon size={16} color={colors.icon.enabled.onLight} />
    </button>
  )
}

// =============================================================================
// INLINE SVG ICONS
// =============================================================================

function SearchIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronDownIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SidebarToggleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function AppsGridIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function NotificationIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HelpIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SettingsIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MenuIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// =============================================================================
// HEADER COMPONENT
// =============================================================================

/**
 * Header — Top-level application header with responsive layout.
 *
 * Features:
 * - Theme-aware: uses `useColors()` for all color references
 * - Responsive: collapses search + org text on mobile, shows hamburger menu
 * - Accessible: ARIA landmarks, focus-visible outlines, keyboard support
 * - Sticky option: can pin to top of viewport
 *
 * Uses tokens from `styles/design-tokens.ts` → `header` section.
 */
export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  {
    logo,
    appName,
    appDescription,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    onSearchSubmit,
    showSearch = true,
    orgName = 'Organization Name',
    orgLabel = 'Organization',
    orgBadge,
    onOrgClick,
    actions,
    showAppsButton = true,
    onSidebarToggle,
    onAppsClick,
    sticky = false,
    style,
    className,
  },
  ref,
) {
  const colors = useColors()
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)
  const isTablet = useMediaQuery(
    `(min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  // Focus trap for mobile menu (CRITICAL a11y fix)
  useFocusTrap(mobileMenuRef, mobileMenuOpen, closeMobileMenu, hamburgerRef)

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mobileMenuOpen])

  // Close mobile menu when screen grows
  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false)
  }, [isMobile])

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: header.height,
    padding: isMobile
      ? `${header.padding.y} 16px`
      : `${header.padding.y} ${header.padding.x}`,
    backgroundColor: colors.surface.light,
    borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
    fontFamily: fontFamilies.body,
    boxSizing: 'border-box',
    ...(sticky
      ? {
          position: 'sticky' as const,
          top: 0,
          zIndex: zIndex.header,
        }
      : {}),
    ...style,
  }

  // ── Left section ─────────────────────────────────────────────────
  const renderLeft = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '8px' : '16px',
        flexShrink: 0,
      }}
    >
      {/* Mobile hamburger — stores ref for focus return */}
      {isMobile && (
        <button
          ref={hamburgerRef}
          type="button"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="header-mobile-menu"
          onClick={() => setMobileMenuOpen((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: header.iconButton.borderRadius,
            backgroundColor: 'transparent',
            color: colors.icon.enabled.onLight,
            border: 'none',
            cursor: 'pointer',
            transition: reducedMotion ? 'none' : `all ${transitionPresets.default}`,
            padding: 0,
          }}
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      )}

      {/* Sidebar toggle (desktop) */}
      {!isMobile && onSidebarToggle && (
        <IconButton icon={<SidebarToggleIcon />} ariaLabel="Toggle sidebar" onClick={onSidebarToggle} />
      )}

      {/* Apps grid */}
      {!isMobile && showAppsButton && (
        <IconButton icon={<AppsGridIcon />} ariaLabel="Apps menu" onClick={onAppsClick} />
      )}

      {/* Logo + brand */}
      {(logo || appName) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {logo}
          {(appName || appDescription) && !isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {appName && (
                <span
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: '14px',
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: colors.text.highEmphasis.onLight,
                  }}
                >
                  {appName}
                </span>
              )}
              {appDescription && (
                <span
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: '11px',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    color: colors.text.lowEmphasis.onLight,
                  }}
                >
                  {appDescription}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )

  // ── Center section (search) ──────────────────────────────────────
  const renderCenter = () => {
    if (!showSearch) return null

    // On mobile, search moves into the dropdown panel
    if (isMobile) return null

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          padding: '0 24px',
          minWidth: 0,
        }}
      >
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          collapsed={isTablet}
        />
      </div>
    )
  }

  // ── Right section ────────────────────────────────────────────────
  const renderRight = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexShrink: 0,
      }}
    >
      {/* Mobile: search icon only */}
      {isMobile && showSearch && (
        <IconButton
          icon={<SearchIcon size={24} />}
          ariaLabel="Search"
          onClick={() => setMobileMenuOpen(true)}
        />
      )}

      {/* Custom actions or defaults */}
      {!isMobile && (
        <>
          {actions || (
            <>
              <IconButton icon={<NotificationIcon />} ariaLabel="Notifications" />
              <IconButton icon={<HelpIcon />} ariaLabel="Help" />
              <IconButton icon={<SettingsIcon />} ariaLabel="Settings" />
            </>
          )}
        </>
      )}

      {/* Org dropdown — hide text on small screens */}
      {!isMobile && (
        <OrgDropdown
          name={orgName}
          label={orgLabel}
          badge={orgBadge}
          onClick={onOrgClick}
        />
      )}

      {/* On mobile: show only the org badge */}
      {isMobile && (
        <button
          type="button"
          onClick={onOrgClick}
          aria-label={`${orgName} - ${orgLabel}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            // WCAG 2.5.8: minimum 44px touch target
            width: '44px',
            height: '44px',
            padding: 0,
          }}
        >
          {orgBadge || (
            <span
              aria-hidden="true"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: colors.brand.default,
                color: colors.text.highEmphasis.onDark,
                fontFamily: fontFamilies.body,
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {orgName.slice(0, 2).toUpperCase()}
            </span>
          )}
        </button>
      )}
    </div>
  )

  // ── Mobile menu panel ────────────────────────────────────────────
  const renderMobileMenu = () => {
    if (!isMobile || !mobileMenuOpen) return null

    return (
      <>
        {/* Scrim overlay */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            top: header.height,
            backgroundColor: colors.scrim,
            zIndex: zIndex.overlay,
          }}
        />
        {/* Panel */}
        <div
          ref={mobileMenuRef}
          id="header-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          style={{
            position: 'fixed',
            top: header.height,
            left: 0,
            right: 0,
            backgroundColor: colors.surface.light,
            borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
            boxShadow: shadows.lg,
            zIndex: zIndex.overlay + 1,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: `calc(100vh - ${header.height})`,
            overflowY: 'auto',
          }}
        >
          {/* Search bar in mobile panel */}
          {showSearch && (
            <SearchInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={onSearchChange}
              onSubmit={(val) => {
                onSearchSubmit?.(val)
                setMobileMenuOpen(false)
              }}
            />
          )}

          {/* Action buttons row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
              paddingTop: '16px',
            }}
          >
            {actions || (
              <>
                <IconButton icon={<NotificationIcon />} ariaLabel="Notifications" />
                <IconButton icon={<HelpIcon />} ariaLabel="Help" />
                <IconButton icon={<SettingsIcon />} ariaLabel="Settings" />
              </>
            )}
          </div>

          {/* Org info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
              paddingTop: '16px',
            }}
          >
            {orgBadge || (
              <span
                aria-hidden="true"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: colors.brand.default,
                  color: colors.text.highEmphasis.onDark,
                  fontFamily: fontFamilies.body,
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {orgName.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: '14px',
                  fontWeight: 500,
                  color: colors.text.highEmphasis.onLight,
                }}
              >
                {orgName}
              </span>
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: '12px',
                  color: colors.text.lowEmphasis.onLight,
                }}
              >
                {orgLabel}
              </span>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <header
        ref={ref}
        role="banner"
        style={headerStyle}
        className={className}
      >
        {renderLeft()}
        {renderCenter()}
        {renderRight()}
      </header>
      {renderMobileMenu()}
    </>
  )
})

Header.displayName = 'Header'

// =============================================================================
// CANOPY LOGO COMPONENT (preserved from original)
// =============================================================================

export interface CanopyLogoProps {
  /** Logo size */
  size?: 'sm' | 'md' | 'lg'
  /** Whether to show the text alongside the logo */
  showText?: boolean
}

export function CanopyLogo({ size = 'md', showText = true }: CanopyLogoProps) {
  const sizes = {
    sm: { logo: 28, fontSize: '14px', gap: '8px' },
    md: { logo: 32, fontSize: '16px', gap: '10px' },
    lg: { logo: 40, fontSize: '18px', gap: '12px' },
  }

  const s = sizes[size]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      <svg
        style={{ width: s.logo, height: s.logo, flexShrink: 0 }}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Canopy logo"
        role="img"
      >
        <path d="M24 4C14 4 6 8 6 8V24C6 34 14 42 24 46C34 42 42 34 42 24V8C42 8 34 4 24 4Z" stroke="#3D5A4C" strokeWidth="2" fill="none" />
        <path d="M24 38V28" stroke="#5A7A68" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M21 38C21 36 22 34 24 34C26 34 27 36 27 38" stroke="#5A7A68" strokeWidth="1.5" fill="none" />
        <ellipse cx="24" cy="20" rx="10" ry="8" fill="#6B8E7A" />
        <ellipse cx="20" cy="18" rx="6" ry="5" fill="#5A7A68" />
        <ellipse cx="28" cy="18" rx="6" ry="5" fill="#5A7A68" />
        <ellipse cx="24" cy="15" rx="7" ry="5" fill="#4A6A58" />
        <ellipse cx="24" cy="22" rx="8" ry="5" fill="#7A9E8A" />
      </svg>
      {showText && (
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: s.fontSize,
            fontWeight: 600,
            lineHeight: 1.2,
            color: '#3D5A4C',
          }}
        >
          Canopy
        </span>
      )}
    </div>
  )
}

CanopyLogo.displayName = 'CanopyLogo'

// =============================================================================
// EXPORTS
// =============================================================================

export { SearchInput, IconButton, OrgDropdown }
