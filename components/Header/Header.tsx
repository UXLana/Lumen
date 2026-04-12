'use client'

import React, { forwardRef, useState, useEffect, useRef } from 'react'
/* eslint-disable @next/next/no-img-element */
import {
  fontFamilies,
  header,
  transitionPresets,
  borderRadius,
  shadows,
  spacing,
  typography,
  zIndex,
} from '../../styles/design-tokens'
import { useColors } from '../../styles/themes'
import { useThemeSwitcher, availableThemes } from '../../styles/themes'
import { usePrefersReducedMotion, useIsMobile } from '../../hooks'
import { IconSun, IconMoon, IconBell, IconSidebarOpen, IconSidebarClose, IconPanelRightOpen, IconPanelRightClose } from '../Icons'

// =============================================================================
// TYPES
// =============================================================================

export type HeaderVariant = 'full' | 'rounded'

export interface HeaderProps {
  /** Header layout variant.
   *  - `"full"` (default): edge-to-edge with bottom border
   *  - `"rounded"`: inset with border-radius, no bottom divider */
  variant?: HeaderVariant
  /** Whether the header is sticky */
  sticky?: boolean
  /** User avatar element (e.g. <Avatar name="Jane" size="sm" />) */
  userAvatar?: React.ReactNode
  /** User name for avatar aria-label */
  userName?: string
  /** Callback when avatar area is clicked */
  onAvatarClick?: () => void
  /** Callback when notifications bell is clicked */
  onNotificationsClick?: () => void
  /** Notification badge count (0 = hidden, >0 = shown) */
  notificationCount?: number
  /** Whether to show the notifications bell (default: true) */
  showNotifications?: boolean
  /** Whether to show the theme switcher (default: true) */
  showThemeSwitcher?: boolean
  /** Whether to show a navigation toggle button to the left of the logo.
   *  Desktop only — hidden on mobile, which typically owns its own nav pattern.
   *  Default: false */
  showNavToggle?: boolean
  /** Called when the nav toggle is clicked. Consumers drive sidebar state. */
  onNavToggleClick?: () => void
  /** Current expanded state of the nav the toggle controls. Drives the
   *  icon swap (sidebar-open vs sidebar-close) and aria-expanded. Default: true */
  navToggleExpanded?: boolean
  /** Override the nav toggle's accessible label. Defaults to a generated
   *  "Collapse navigation" / "Expand navigation" string based on state. */
  navToggleLabel?: string
  /** Whether to show a right-side panel toggle (e.g. properties panel).
   *  Mirrors the nav toggle on the left. Default: false */
  showPanelToggle?: boolean
  /** Called when the panel toggle is clicked. Consumers drive panel state. */
  onPanelToggleClick?: () => void
  /** Current expanded state of the panel the toggle controls. Drives the
   *  icon swap and aria-expanded. Default: true */
  panelToggleExpanded?: boolean
  /** Override the panel toggle's accessible label. Defaults to a generated
   *  "Collapse panel" / "Expand panel" string based on state. */
  panelToggleLabel?: string
  /** Additional actions slot rendered before the toolbar icons */
  actions?: React.ReactNode
  /** Custom styles for the root element */
  style?: React.CSSProperties
  /** Custom class name */
  className?: string
}

// =============================================================================
// COLOR UTILS
// =============================================================================

/** Parse a hex color to RGB components */
function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ]
}

/** Lighten a hex color by a number of steps (each step adds ~8% toward white) */
function lightenColor(color: string, steps: number): string {
  // Handle hex colors
  if (color.startsWith('#')) {
    const [r, g, b] = parseHex(color)
    const factor = steps * 0.08 // 8% per step
    const lighten = (c: number) => Math.min(255, Math.round(c + (255 - c) * factor))
    return `rgb(${lighten(r)}, ${lighten(g)}, ${lighten(b)})`
  }
  // Fallback: return as-is
  return color
}

// =============================================================================
// THEME DISPLAY NAME MAPPING
// =============================================================================

function getThemeDisplayName(name: string): string {
  // Friendly labels for the header theme switcher. Falls back to a
  // Title-Cased version of the internal name (e.g. "foliage-dark" → "Foliage Dark").
  const map: Record<string, string> = {
    'lumen': 'Lumen',
    'lumen-dark': 'Lumen Dark',
    'fall': 'Fall',
    'foliage': 'Foliage',
    'foliage-dark': 'Foliage Dark',
    'spring': 'Spring',
    'pampas': 'Pampas',
    'rainy-night': 'Rainy Night',
  }
  if (map[name]) return map[name]
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

// =============================================================================
// CHECK ICON (active theme indicator)
// =============================================================================

function CheckIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <polyline
        points="20 6 9 17 4 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// =============================================================================
// TOOLBAR ICON BUTTON (shared styling for theme, bell, etc.)
// =============================================================================

interface ToolbarButtonProps {
  onClick?: () => void
  'aria-label': string
  'aria-expanded'?: boolean
  'aria-haspopup'?: 'listbox' | 'menu' | 'true'
  'aria-controls'?: string
  children: React.ReactNode
  isActive?: boolean
  buttonRef?: React.Ref<HTMLButtonElement>
  isMobile?: boolean
  colors: ReturnType<typeof useColors>
  reducedMotion: boolean
}

function ToolbarButton({
  onClick,
  'aria-label': ariaLabel,
  'aria-expanded': ariaExpanded,
  'aria-haspopup': ariaHaspopup,
  'aria-controls': ariaControls,
  children,
  isActive = false,
  buttonRef,
  isMobile = false,
  colors,
  reducedMotion,
}: ToolbarButtonProps) {
  const btnSize = isMobile ? '36px' : '40px'

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      aria-controls={ariaControls}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: btnSize,
        height: btnSize,
        borderRadius: borderRadius.md,
        backgroundColor: isActive ? colors.hover.onLight : 'transparent',
        color: colors.icon.enabled.onLight,
        border: 'none',
        cursor: 'pointer',
        transition: reducedMotion ? 'none' : `all ${transitionPresets.default}`,
        padding: 0,
        outline: 'none',
        position: 'relative',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.hover.onLight
        e.currentTarget.style.color = colors.text.highEmphasis.onLight
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = colors.icon.enabled.onLight
        }
      }}
      onFocus={(e) => {
        if (e.target.matches(':focus-visible')) {
          e.currentTarget.style.outline = `2px solid ${colors.focusBorder.onLight}`
          e.currentTarget.style.outlineOffset = '2px'
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none'
      }}
    >
      {children}
    </button>
  )
}

// =============================================================================
// NOTIFICATION BADGE
// =============================================================================

function NotificationBadge({ count, colors }: { count: number; colors: ReturnType<typeof useColors> }) {
  if (count <= 0) return null
  const display = count > 99 ? '99+' : String(count)
  return (
    <span
      aria-label={`${count} notifications`}
      style={{
        position: 'absolute',
        top: '2px',
        right: '2px',
        minWidth: '16px',
        height: '16px',
        borderRadius: borderRadius.full,
        backgroundColor: colors.status.important,
        color: '#fff',
        fontSize: '10px',
        fontWeight: 700,
        fontFamily: fontFamilies.body,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px',
        lineHeight: 1,
        pointerEvents: 'none',
      }}
    >
      {display}
    </span>
  )
}

// =============================================================================
// HEADER COMPONENT
// =============================================================================

/**
 * Header — App header for the LUMEN Design System.
 *
 * Layout: [Logo + "LUMEN"] — (spacer) — [actions?] [theme] [bell+badge] [avatar]
 *
 * Features:
 * - LUMEN logo SVG on the left
 * - Right toolbar with theme switcher, notifications, and avatar
 * - Frosted glass blur effect (full variant) or solid surface (rounded variant)
 * - Theme-aware via `useColors()` + `useThemeSwitcher()`
 * - Mobile responsive: hides text label, compact 36px buttons
 * - Accessible: ARIA landmark, keyboard support, focus-visible
 */
export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  {
    variant = 'full',
    sticky = false,
    userAvatar,
    userName,
    onAvatarClick,
    onNotificationsClick,
    notificationCount = 0,
    showNotifications = true,
    showThemeSwitcher = true,
    showNavToggle = false,
    onNavToggleClick,
    navToggleExpanded = true,
    navToggleLabel,
    showPanelToggle = false,
    onPanelToggleClick,
    panelToggleExpanded = true,
    panelToggleLabel,
    actions,
    style,
    className,
  },
  ref,
) {
  const colors = useColors()
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const { themeName, setThemeName } = useThemeSwitcher()
  const darkThemeNames = ['lumen-dark', 'lumen-dark-2', 'rainy-night']
  const isDarkTheme = darkThemeNames.includes(themeName.toLowerCase()) || themeName.toLowerCase().includes('dark')

  // Theme dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  // Close dropdown on Escape
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [dropdownOpen])

  const isRounded = variant === 'rounded'

  // Frosted glass blur — unified surface.frosted token
  const blurValue = colors.surface.frostedBlur ?? '0px'
  const hasBlur = blurValue !== '0px'

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: header.height,
    padding: isMobile
      ? `${header.padding.y} ${spacing.sm}`
      : `${header.padding.y} ${header.padding.x}`,
    fontFamily: fontFamilies.body,
    boxSizing: 'border-box',
    transition: reducedMotion ? 'none' : `background-color 200ms ease`,
    // Frosted glass backdrop blur
    ...(hasBlur
      ? {
          backdropFilter: `blur(${blurValue})`,
          WebkitBackdropFilter: `blur(${blurValue})`,
        }
      : {}),
    // Variant-specific styles
    ...(isRounded
      ? {
          backgroundColor: colors.surface.frosted,
          borderRadius: borderRadius.xl,
          margin: `${spacing.sm} ${spacing.md}`,
        }
      : {
          backgroundColor: colors.surface.frosted,
          borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
        }),
    ...(sticky
      ? {
          position: 'sticky' as const,
          top: isRounded ? spacing.sm : '0',
          zIndex: zIndex.header,
        }
      : {}),
    ...style,
  }

  const toolbarBtnProps = { colors, reducedMotion, isMobile }

  return (
    <header ref={ref} role="banner" style={headerStyle} className={className}>
      {/* ── Left: [optional nav toggle] + Logo ──────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, flexShrink: 0 }}>
        {/* Nav toggle — desktop only, left of the logo. Consumers own sidebar state. */}
        {showNavToggle && !isMobile && (
          <ToolbarButton
            onClick={onNavToggleClick}
            aria-label={
              navToggleLabel ??
              (navToggleExpanded ? 'Collapse navigation' : 'Expand navigation')
            }
            aria-expanded={navToggleExpanded}
            aria-controls="nav"
            {...toolbarBtnProps}
          >
            {navToggleExpanded ? (
              <IconSidebarClose size={20} color={colors.icon.enabled.onLight} />
            ) : (
              <IconSidebarOpen size={20} color={colors.icon.enabled.onLight} />
            )}
          </ToolbarButton>
        )}
        <img
          src="/assets/lumen-logo.svg"
          alt="LUMEN Design System"
          width={isMobile ? 28 : 32}
          height={isMobile ? 32 : 36}
          style={{ flexShrink: 0 }}
        />
        {!isMobile && (
          <span
            style={{
              ...typography.label.lg,
              fontFamily: fontFamilies.display,
              fontWeight: 600,
              color: colors.text.highEmphasis.onLight,
              letterSpacing: '0.02em',
            }}
          >
            LUMEN
          </span>
        )}
      </div>

      {/* ── Right: Toolbar ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? spacing['2xs'] : spacing.xs }}>
        {/* Custom actions slot */}
        {actions}

        {/* Theme Switcher */}
        {showThemeSwitcher && (
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <ToolbarButton
              buttonRef={triggerRef}
              onClick={() => setDropdownOpen((v) => !v)}
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
              aria-label={`Theme: ${getThemeDisplayName(themeName)}. Change theme`}
              isActive={dropdownOpen}
              {...toolbarBtnProps}
            >
              {isDarkTheme ? <IconSun size="md" /> : <IconMoon size="md" />}
            </ToolbarButton>

            {/* Theme Dropdown */}
            {dropdownOpen && (
              <div
                role="listbox"
                aria-label="Select theme"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  minWidth: '160px',
                  background: colors.surface.frosted,
                  backdropFilter: hasBlur ? `blur(${blurValue})` : undefined,
                  WebkitBackdropFilter: hasBlur ? `blur(${blurValue})` : undefined,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadius.md,
                  boxShadow: shadows.lg,
                  padding: `${spacing['2xs']} 0`,
                  zIndex: zIndex.dropdown,
                }}
              >
                {(() => {
                  // Core themes (Light/Dark) first, then product themes
                  const coreNames = ['lumen', 'lumen-dark']
                  const coreThemes = availableThemes.filter((t) => coreNames.includes(t.name))
                  const productThemes = availableThemes.filter((t) => !coreNames.includes(t.name))

                  const renderOption = (t: typeof availableThemes[number]) => {
                    const isActive = t.name === themeName
                    const label = getThemeDisplayName(t.name)
                    return (
                      <button
                        key={t.name}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => {
                          setThemeName(t.name)
                          setDropdownOpen(false)
                          triggerRef.current?.focus()
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: `${spacing.xs} ${spacing.sm}`,
                          border: 'none',
                          background: isActive ? colors.selected.onLight : 'transparent',
                          color: isActive
                            ? colors.text.highEmphasis.onLight
                            : colors.text.lowEmphasis.onLight,
                          fontSize: typography.body.sm.fontSize,
                          fontWeight: isActive ? 600 : 400,
                          fontFamily: fontFamilies.body,
                          textAlign: 'left' as const,
                          cursor: 'pointer',
                          transition: reducedMotion ? 'none' : 'background 100ms ease',
                          lineHeight: typography.body.sm.lineHeight,
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.background = colors.hover.onLight
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <span>{label}</span>
                        {isActive && (
                          <CheckIcon size={14} color={colors.brand.default} />
                        )}
                      </button>
                    )
                  }

                  return (
                    <>
                      {coreThemes.map(renderOption)}
                      {productThemes.length > 0 && (
                        <div
                          role="separator"
                          style={{
                            height: '1px',
                            background: colors.border.lowEmphasis.onLight,
                            margin: `${spacing['2xs']} 0`,
                          }}
                        />
                      )}
                      {productThemes.map(renderOption)}
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        )}

        {/* Notifications Bell */}
        {showNotifications && (
          <ToolbarButton
            onClick={onNotificationsClick}
            aria-label={
              notificationCount > 0
                ? `Notifications (${notificationCount} new)`
                : 'Notifications'
            }
            {...toolbarBtnProps}
          >
            <IconBell size="md" />
            <NotificationBadge count={notificationCount} colors={colors} />
          </ToolbarButton>
        )}

        {/* Avatar */}
        {userAvatar && (
          <button
            type="button"
            onClick={onAvatarClick}
            aria-label={userName ? `User menu: ${userName}` : 'User menu'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: onAvatarClick ? 'pointer' : 'default',
              padding: spacing['2xs'],
              borderRadius: borderRadius.full,
              outline: 'none',
              transition: reducedMotion ? 'none' : `all ${transitionPresets.default}`,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (onAvatarClick) e.currentTarget.style.backgroundColor = colors.hover.onLight
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            onFocus={(e) => {
              if (e.target.matches(':focus-visible')) {
                e.currentTarget.style.outline = `2px solid ${colors.focusBorder.onLight}`
                e.currentTarget.style.outlineOffset = '2px'
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none'
            }}
          >
            {userAvatar}
          </button>
        )}

        {/* Panel toggle — right-side panel (e.g. properties). After avatar, far right. */}
        {showPanelToggle && !isMobile && (
          <ToolbarButton
            onClick={onPanelToggleClick}
            aria-label={
              panelToggleLabel ??
              (panelToggleExpanded ? 'Collapse panel' : 'Expand panel')
            }
            aria-expanded={panelToggleExpanded}
            {...toolbarBtnProps}
          >
            {panelToggleExpanded ? (
              <IconPanelRightClose size={20} color={colors.icon.enabled.onLight} />
            ) : (
              <IconPanelRightOpen size={20} color={colors.icon.enabled.onLight} />
            )}
          </ToolbarButton>
        )}
      </div>
    </header>
  )
})

Header.displayName = 'Header'
