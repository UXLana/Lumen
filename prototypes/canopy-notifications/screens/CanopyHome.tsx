'use client'

import React, { useState, useRef } from 'react'
import {
  colors,
  fontFamilies,
  fontWeights,
  shadows,
  transitionPresets,
  zIndex,
} from '@/styles/design-tokens'

// Import Notifications Center
import {
  NotificationsCenter,
  NotificationBellButton,
  mockNotifications,
  type Notification,
} from './NotificationsCenter'

// =============================================================================
// ICONS
// =============================================================================

const HomeIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const PackageIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

const BarChartIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)

const ShieldIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const HelpCircleIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const SearchIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const ChevronDownIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

// =============================================================================
// CANOPY LOGO
// =============================================================================

function CanopyLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Canopy icon - stylized leaf/tree */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#16A34A" />
        <path
          d="M16 6C16 6 10 10 10 16C10 19.3137 12.6863 22 16 22C19.3137 22 22 19.3137 22 16C22 10 16 6 16 6Z"
          fill="white"
          fillOpacity="0.9"
        />
        <path d="M16 14V26" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span
        style={{
          fontFamily: fontFamilies.display,
          fontSize: '20px',
          fontWeight: fontWeights.bold,
          color: colors.text.highEmphasis.onLight,
          letterSpacing: '-0.5px',
        }}
      >
        Canopy
      </span>
    </div>
  )
}

// =============================================================================
// CONTEXT INDICATOR
// =============================================================================

function ContextIndicator() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
        cursor: 'pointer',
        transition: `background-color ${transitionPresets.fast}`,
      }}
    >
      <span
        style={{
          fontFamily: fontFamilies.body,
          fontSize: '14px',
          fontWeight: fontWeights.medium,
          color: colors.text.highEmphasis.onLight,
        }}
      >
        Greenleaf Holdings
      </span>
      <span style={{ color: colors.text.lowEmphasis.onLight }}>/</span>
      <span
        style={{
          fontFamily: fontFamilies.body,
          fontSize: '14px',
          color: colors.text.lowEmphasis.onLight,
        }}
      >
        Brand: Kush Co
      </span>
      <span style={{ color: colors.text.lowEmphasis.onLight }}>/</span>
      <span
        style={{
          fontFamily: fontFamilies.body,
          fontSize: '14px',
          color: colors.text.lowEmphasis.onLight,
        }}
      >
        California
      </span>
      <ChevronDownIcon size={16} />
    </button>
  )
}

// =============================================================================
// HEADER
// =============================================================================

interface HeaderProps {
  notifications: Notification[]
  onBellClick: () => void
  isDropdownOpen: boolean
  bellButtonRef: React.RefObject<HTMLButtonElement | null>
}

function Header({ notifications, onBellClick, isDropdownOpen, bellButtonRef }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('')

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        backgroundColor: '#FFFFFF',
        borderBottom: `1px solid ${colors.stroke.light}`,
        height: '64px',
        position: 'relative',
        zIndex: zIndex.header,
      }}
    >
      {/* Left: Logo + Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <CanopyLogo />
        <ContextIndicator />
      </div>

      {/* Center: Search */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: '20px',
            backgroundColor: '#F5F5F5',
          }}
        >
          <SearchIcon size={20} />
          <input
            type="text"
            placeholder="Find or ask about a product..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              fontFamily: fontFamilies.body,
              fontSize: '14px',
              color: colors.text.highEmphasis.onLight,
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Right: Actions + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
        {/* Help button */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: colors.text.lowEmphasis.onLight,
            cursor: 'pointer',
          }}
          title="Help"
        >
          <HelpCircleIcon size={24} />
        </button>

        {/* Notification bell */}
        <NotificationBellButton
          notifications={notifications}
          onClick={onBellClick}
          isOpen={isDropdownOpen}
          buttonRef={bellButtonRef}
        />

        {/* User avatar */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fontFamilies.body,
            fontSize: '14px',
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            cursor: 'pointer',
          }}
        >
          JD
        </div>
      </div>
    </header>
  )
}

// =============================================================================
// LEFT NAV
// =============================================================================

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  isActive?: boolean
}

function LeftNav({ activeItem, onItemClick }: { activeItem: string; onItemClick: (id: string) => void }) {
  const items: NavItem[] = [
    { id: 'home', label: 'Home', icon: <HomeIcon size={24} /> },
    { id: 'products', label: 'Products', icon: <PackageIcon size={24} /> },
    { id: 'reports', label: 'Reports', icon: <BarChartIcon size={24} /> },
    { id: 'compliance', label: 'Compliance', icon: <ShieldIcon size={24} /> },
  ]

  return (
    <nav
      style={{
        width: '240px',
        padding: '20px 16px',
        backgroundColor: '#FAFAFA',
        borderRight: `1px solid ${colors.stroke.light}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {items.map((item) => {
        const isActive = item.id === activeItem
        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: isActive ? 'rgba(22, 163, 74, 0.1)' : 'transparent',
              color: isActive ? '#16A34A' : colors.text.lowEmphasis.onLight,
              fontFamily: fontFamilies.body,
              fontSize: '15px',
              fontWeight: isActive ? fontWeights.semibold : fontWeights.regular,
              cursor: 'pointer',
              transition: `all ${transitionPresets.fast}`,
              width: '100%',
              textAlign: 'left',
            }}
          >
            {item.icon}
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

// =============================================================================
// MAIN CONTENT PLACEHOLDER
// =============================================================================

function MainContent() {
  return (
    <div
      style={{
        flex: 1,
        padding: '40px',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      {/* Hero section */}
      <div
        style={{
          padding: '32px',
          backgroundColor: '#F5F5F5',
          borderRadius: '24px',
        }}
      >
        <h1
          style={{
            fontFamily: fontFamilies.display,
            fontSize: '36px',
            fontWeight: fontWeights.bold,
            color: colors.text.highEmphasis.onLight,
            margin: '0 0 8px',
            letterSpacing: '-0.5px',
          }}
        >
          Welcome back, John
        </h1>
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: '16px',
            color: colors.text.lowEmphasis.onLight,
            margin: 0,
          }}
        >
          Here's what's happening across your portfolio today.
        </p>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {[
          { label: 'Active Products', value: '847' },
          { label: 'Pending Approvals', value: '12' },
          { label: 'Markets', value: '5' },
          { label: 'Team Members', value: '24' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              padding: '24px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: `1px solid ${colors.stroke.light}`,
            }}
          >
            <div
              style={{
                fontFamily: fontFamilies.body,
                fontSize: '14px',
                color: colors.text.lowEmphasis.onLight,
                marginBottom: '8px',
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontFamily: fontFamilies.display,
                fontSize: '32px',
                fontWeight: fontWeights.bold,
                color: colors.text.highEmphasis.onLight,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder content areas */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <div
          style={{
            flex: 2,
            height: '300px',
            backgroundColor: '#F5F5F5',
            borderRadius: '16px',
          }}
        />
        <div
          style={{
            flex: 1,
            height: '300px',
            backgroundColor: '#F5F5F5',
            borderRadius: '16px',
          }}
        />
      </div>
    </div>
  )
}

// =============================================================================
// CANOPY HOME PAGE
// =============================================================================

export function CanopyHome() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('home')
  const bellButtonRef = useRef<HTMLButtonElement>(null)

  const handleBellClick = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Header with notification bell */}
      <div style={{ position: 'relative' }}>
        <Header
          notifications={notifications}
          onBellClick={handleBellClick}
          isDropdownOpen={isDropdownOpen}
          bellButtonRef={bellButtonRef}
        />

        {/* Dropdown positioned relative to header */}
        <div
          style={{
            position: 'absolute',
            top: '64px',
            right: '24px',
            zIndex: zIndex.dropdown,
          }}
        >
          <NotificationsCenter
            isOpen={isDropdownOpen}
            onClose={handleCloseDropdown}
            notifications={notifications}
            onNotificationsChange={setNotifications}
          />
        </div>
      </div>

      {/* Main content area */}
      <main
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Left Navigation */}
        <LeftNav activeItem={activeNavItem} onItemClick={setActiveNavItem} />

        {/* Content */}
        <MainContent />
      </main>
    </div>
  )
}

export default CanopyHome
