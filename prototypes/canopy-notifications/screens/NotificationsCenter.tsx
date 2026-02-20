'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  colors,
  fontFamilies,
  fontWeights,
  borderRadius,
  shadows,
  transitionPresets,
  zIndex,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

export type NotificationType = 'action_required' | 'update' | 'system'
export type NotificationStatus = 'open' | 'snoozed' | 'resolved'
export type SourceApp = 'Registry' | 'Retail ID' | 'Payments' | 'Canopy'

export interface Notification {
  id: number
  type: NotificationType
  title: string
  description: string
  app: SourceApp
  org: string | null
  brand: string | null
  market: string | null
  timestamp: string
  read: boolean
  action?: string
  status?: NotificationStatus
  snoozed_until?: string
  resolved_at?: string
}

export interface NotificationFilters {
  status: 'all' | 'unread' | 'action_required' | 'resolved'
  app: SourceApp | 'all'
  org: string | 'all'
  time: 'today' | 'this_week' | 'this_month' | 'older' | 'all'
}

export interface NotificationSettings {
  emailEnabled: boolean
  pushEnabled: boolean
  digestFrequency: 'instant' | 'daily' | 'weekly'
  appPreferences: {
    [key in SourceApp]: {
      actionRequired: 'email_and_inapp' | 'inapp_only' | 'muted'
      updates: 'email_and_inapp' | 'inapp_only' | 'muted'
      system: 'email_and_inapp' | 'inapp_only' | 'muted'
    }
  }
  muteUntil: Date | null
}

type ViewMode = 'home' | 'inbox' | 'settings'
type DropdownFilter = 'all' | 'action_required' | 'updates'

// =============================================================================
// MOCK DATA (from requirements)
// =============================================================================

export const mockNotifications: Notification[] = [
  // Action Required (Red — Persist until resolved)
  {
    id: 1,
    type: 'action_required',
    title: 'Product data incomplete for Colorado launch',
    description: 'Kush Co — Blue Dream Cartridge 1g is missing required THC warning text and testing results for the Colorado market. Product cannot be listed until resolved.',
    app: 'Registry',
    org: 'Greenleaf Holdings',
    brand: 'Kush Co',
    market: 'Colorado',
    timestamp: '2 hours ago',
    read: false,
    action: 'Complete Product Data',
    status: 'open',
  },
  {
    id: 2,
    type: 'action_required',
    title: 'Label approval needed',
    description: 'New label design for Sunset Gummies 10-pack requires your approval before it can be printed for the Nevada market.',
    app: 'Retail ID',
    org: 'Greenleaf Holdings',
    brand: 'Kush Co',
    market: 'Nevada',
    timestamp: '5 hours ago',
    read: false,
    action: 'Review Label',
    status: 'open',
  },
  {
    id: 3,
    type: 'action_required',
    title: 'Compliance deadline approaching',
    description: 'California requires updated testing documentation for all edible products by February 15, 2026. 12 products under Kush Co are affected.',
    app: 'Registry',
    org: 'Greenleaf Holdings',
    brand: 'Kush Co',
    market: 'California',
    timestamp: '1 day ago',
    read: true,
    action: 'View Affected Products',
    status: 'open',
  },
  {
    id: 4,
    type: 'action_required',
    title: 'Payment reconciliation required',
    description: '3 pending transactions from Pacific Distributors need reconciliation before end of business today.',
    app: 'Payments',
    org: 'Greenleaf Holdings',
    brand: null,
    market: 'California',
    timestamp: '3 hours ago',
    read: false,
    action: 'Reconcile Payments',
    status: 'open',
  },
  // Awareness / Updates (Blue — 30-day persistence)
  {
    id: 5,
    type: 'update',
    title: 'New product registered',
    description: "Sarah M. added 'Mango Haze Pre-Roll 5pk' to the Kush Co catalog for California and Oregon markets.",
    app: 'Registry',
    org: 'Greenleaf Holdings',
    brand: 'Kush Co',
    market: null,
    timestamp: '4 hours ago',
    read: false,
  },
  {
    id: 6,
    type: 'update',
    title: 'Label design updated',
    description: "Design for 'OG Kush Flower 3.5g' label was updated by David T. Changes include updated nutrition panel and barcode placement.",
    app: 'Retail ID',
    org: 'Greenleaf Holdings',
    brand: 'Kush Co',
    market: 'California',
    timestamp: 'Yesterday',
    read: true,
  },
  {
    id: 7,
    type: 'update',
    title: 'Team member added',
    description: 'Jordan P. was added to Greenleaf Holdings with Contributor access to Registry.',
    app: 'Canopy',
    org: 'Greenleaf Holdings',
    brand: null,
    market: null,
    timestamp: 'Yesterday',
    read: true,
  },
  {
    id: 8,
    type: 'update',
    title: 'Product archived',
    description: "Alex R. archived 'CBD Tincture 500mg' from the Kush Co catalog. Product is no longer active in any market.",
    app: 'Registry',
    org: 'Greenleaf Holdings',
    brand: 'Kush Co',
    market: null,
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: 9,
    type: 'update',
    title: 'Bundle product created',
    description: "Sarah M. created new bundle 'Starter Pack Sampler' with 3 component products for the Michigan market.",
    app: 'Registry',
    org: 'Pacific Cannabis Group',
    brand: 'Emerald Valley',
    market: 'Michigan',
    timestamp: '3 days ago',
    read: true,
  },
  // System / Transient (Gray — 7-day persistence)
  {
    id: 10,
    type: 'system',
    title: 'Data sync completed',
    description: 'Product catalog sync between Registry and Retail ID completed successfully. 847 products synced.',
    app: 'Registry',
    org: 'Greenleaf Holdings',
    brand: null,
    market: null,
    timestamp: '30 minutes ago',
    read: false,
  },
  {
    id: 11,
    type: 'system',
    title: 'Scheduled maintenance tonight',
    description: 'Canopy will undergo scheduled maintenance from 2:00 AM - 4:00 AM EST. Some features may be temporarily unavailable.',
    app: 'Canopy',
    org: null,
    brand: null,
    market: null,
    timestamp: '6 hours ago',
    read: true,
  },
  {
    id: 12,
    type: 'system',
    title: 'API rate limit warning',
    description: "Your organization's API usage reached 80% of the daily limit. Consider optimizing integration calls.",
    app: 'Registry',
    org: 'Greenleaf Holdings',
    brand: null,
    market: null,
    timestamp: '1 day ago',
    read: true,
  },
  // Snoozed
  {
    id: 13,
    type: 'action_required',
    title: 'Update product images for Michigan',
    description: 'Michigan regulators require updated product photography for all flower products by March 1, 2026.',
    app: 'Registry',
    org: 'Greenleaf Holdings',
    brand: 'Kush Co',
    market: 'Michigan',
    timestamp: '3 days ago',
    read: true,
    action: 'Upload Images',
    status: 'snoozed',
    snoozed_until: 'Feb 10, 2026',
  },
  // Resolved
  {
    id: 14,
    type: 'action_required',
    title: 'Label compliance update required',
    description: 'Updated allergen warning requirements for California edible products. All affected labels have been updated.',
    app: 'Retail ID',
    org: 'Greenleaf Holdings',
    brand: 'Kush Co',
    market: 'California',
    timestamp: '5 days ago',
    read: true,
    status: 'resolved',
    resolved_at: 'Jan 30, 2026',
  },
]

const defaultSettings: NotificationSettings = {
  emailEnabled: true,
  pushEnabled: false,
  digestFrequency: 'daily',
  appPreferences: {
    Registry: { actionRequired: 'email_and_inapp', updates: 'inapp_only', system: 'inapp_only' },
    'Retail ID': { actionRequired: 'email_and_inapp', updates: 'inapp_only', system: 'muted' },
    Payments: { actionRequired: 'email_and_inapp', updates: 'inapp_only', system: 'inapp_only' },
    Canopy: { actionRequired: 'email_and_inapp', updates: 'inapp_only', system: 'inapp_only' },
  },
  muteUntil: null,
}

// =============================================================================
// ICONS (Inline SVG for simplicity)
// =============================================================================

const BellIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const XIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const CheckIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const CheckCircleIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const AlertCircleIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const InfoIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const SettingsIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const ClockIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const ChevronRightIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const ChevronLeftIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const InboxIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)

const FilterIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)

const ArchiveIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
)

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getTypeConfig(type: NotificationType, status?: NotificationStatus) {
  if (status === 'resolved') {
    return {
      color: '#6B7280',
      bgColor: 'rgba(107, 114, 128, 0.1)',
      label: 'Resolved',
      icon: CheckCircleIcon,
    }
  }
  if (status === 'snoozed') {
    return {
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      label: 'Snoozed',
      icon: ClockIcon,
    }
  }

  switch (type) {
    case 'action_required':
      return {
        color: '#EF4444',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        label: 'Action Required',
        icon: AlertCircleIcon,
      }
    case 'update':
      return {
        color: '#3B82F6',
        bgColor: 'rgba(59, 130, 246, 0.1)',
        label: 'Update',
        icon: InfoIcon,
      }
    case 'system':
      return {
        color: '#6B7280',
        bgColor: 'rgba(107, 114, 128, 0.1)',
        label: 'System',
        icon: InfoIcon,
      }
  }
}

function getAppColor(app: SourceApp): string {
  switch (app) {
    case 'Registry': return '#16A34A'
    case 'Retail ID': return '#3B82F6'
    case 'Payments': return '#8B5CF6'
    case 'Canopy': return '#6B7280'
  }
}

function groupNotificationsByDate(notifications: Notification[]): { [key: string]: Notification[] } {
  const groups: { [key: string]: Notification[] } = {
    'Today': [],
    'Yesterday': [],
    'This Week': [],
    'Older': [],
  }

  notifications.forEach(n => {
    const ts = n.timestamp.toLowerCase()
    if (ts.includes('hour') || ts.includes('minute')) {
      groups['Today'].push(n)
    } else if (ts === 'yesterday') {
      groups['Yesterday'].push(n)
    } else if (ts.includes('day') && parseInt(ts) <= 7) {
      groups['This Week'].push(n)
    } else {
      groups['Older'].push(n)
    }
  })

  return groups
}

// =============================================================================
// TOAST COMPONENT
// =============================================================================

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
}

function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#1F2937',
        color: '#FFFFFF',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: shadows.lg,
        zIndex: zIndex.toast,
        fontFamily: fontFamilies.body,
        fontSize: '14px',
        fontWeight: fontWeights.medium,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {message}
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.7)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <XIcon size={16} />
      </button>
    </div>
  )
}

// =============================================================================
// APP BADGE COMPONENT
// =============================================================================

interface AppBadgeProps {
  app: SourceApp
}

function AppBadge({ app }: AppBadgeProps) {
  const color = getAppColor(app)

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '4px',
        backgroundColor: `${color}15`,
        color: color,
        fontFamily: fontFamilies.body,
        fontSize: '11px',
        fontWeight: fontWeights.semibold,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      }}
    >
      {app}
    </span>
  )
}

// =============================================================================
// NOTIFICATION ITEM COMPONENT
// =============================================================================

interface NotificationItemProps {
  notification: Notification
  variant: 'compact' | 'full'
  isSelected?: boolean
  onSelect?: (id: number, selected: boolean) => void
  onMarkRead: (id: number) => void
  onAction?: (notification: Notification) => void
  onSnooze?: (id: number, duration: string) => void
}

function NotificationItem({
  notification,
  variant,
  isSelected = false,
  onSelect,
  onMarkRead,
  onAction,
  onSnooze,
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false)
  const typeConfig = getTypeConfig(notification.type, notification.status)
  const IconComponent = typeConfig.icon

  const handleClick = () => {
    if (!notification.read) {
      onMarkRead(notification.id)
    }
    if (notification.action && onAction) {
      onAction(notification)
    }
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: variant === 'compact' ? '12px' : '16px',
    padding: variant === 'compact' ? '12px 16px' : '16px 20px',
    backgroundColor: isSelected
      ? 'rgba(59, 130, 246, 0.08)'
      : !notification.read
        ? 'rgba(59, 130, 246, 0.04)'
        : isHovered
          ? 'rgba(0, 0, 0, 0.02)'
          : 'transparent',
    borderBottom: `1px solid ${colors.stroke.light}`,
    cursor: 'pointer',
    transition: `background-color ${transitionPresets.fast}`,
    opacity: notification.status === 'snoozed' ? 0.7 : 1,
    textDecoration: notification.status === 'resolved' ? 'none' : 'none',
  }

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowSnoozeMenu(false) }}
      onClick={handleClick}
      role="article"
      aria-label={`${notification.title}${!notification.read ? ', unread' : ''}`}
    >
      {/* Checkbox for full variant */}
      {variant === 'full' && onSelect && (
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '4px',
            border: `2px solid ${isSelected ? '#3B82F6' : 'rgba(0, 0, 0, 0.3)'}`,
            backgroundColor: isSelected ? '#3B82F6' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            marginTop: '2px',
          }}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(notification.id, !isSelected)
          }}
        >
          {isSelected && <CheckIcon size={12} />}
        </div>
      )}

      {/* Severity Indicator */}
      <div
        style={{
          width: variant === 'compact' ? '28px' : '32px',
          height: variant === 'compact' ? '28px' : '32px',
          borderRadius: '8px',
          backgroundColor: typeConfig.bgColor,
          color: typeConfig.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        title={typeConfig.label}
      >
        <IconComponent size={variant === 'compact' ? 16 : 18} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header with app badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <AppBadge app={notification.app} />
          {notification.status === 'snoozed' && (
            <span
              style={{
                fontSize: '11px',
                color: '#F59E0B',
                fontWeight: fontWeights.medium,
              }}
            >
              Snoozed until {notification.snoozed_until}
            </span>
          )}
          {notification.status === 'resolved' && (
            <span
              style={{
                fontSize: '11px',
                color: '#6B7280',
                fontWeight: fontWeights.medium,
              }}
            >
              Resolved {notification.resolved_at}
            </span>
          )}
        </div>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h4
            style={{
              fontFamily: fontFamilies.body,
              fontSize: '14px',
              fontWeight: !notification.read ? fontWeights.semibold : fontWeights.regular,
              color: notification.status === 'resolved' ? colors.text.lowEmphasis.onLight : colors.text.highEmphasis.onLight,
              margin: 0,
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: variant === 'compact' ? 'nowrap' : 'normal',
              textDecoration: notification.status === 'resolved' ? 'line-through' : 'none',
            }}
          >
            {notification.title}
          </h4>
          {!notification.read && (
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                flexShrink: 0,
              }}
              aria-label="Unread"
            />
          )}
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: '13px',
            fontWeight: fontWeights.regular,
            color: colors.text.lowEmphasis.onLight,
            lineHeight: '18px',
            margin: '4px 0 8px',
            display: '-webkit-box',
            WebkitLineClamp: variant === 'compact' ? 1 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {notification.description}
        </p>

        {/* Meta info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {variant === 'full' && (notification.org || notification.brand || notification.market) && (
            <span
              style={{
                fontSize: '12px',
                color: colors.text.lowEmphasis.onLight,
              }}
            >
              {[notification.org, notification.brand, notification.market].filter(Boolean).join(' · ')}
            </span>
          )}
          <span
            style={{
              fontSize: '12px',
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            {variant === 'full' && (notification.org || notification.brand || notification.market) ? '· ' : ''}
            {notification.timestamp}
          </span>
        </div>

        {/* Action button for action_required notifications */}
        {notification.type === 'action_required' && notification.action && notification.status === 'open' && (
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction?.(notification)
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                fontFamily: fontFamilies.body,
                fontSize: '13px',
                fontWeight: fontWeights.medium,
                cursor: 'pointer',
                transition: `background-color ${transitionPresets.fast}`,
              }}
            >
              {notification.action}
            </button>
            {onSnooze && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSnoozeMenu(!showSnoozeMenu)
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.stroke.default}`,
                    backgroundColor: 'transparent',
                    color: colors.text.lowEmphasis.onLight,
                    fontFamily: fontFamilies.body,
                    fontSize: '13px',
                    fontWeight: fontWeights.medium,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ClockIcon size={14} />
                  Snooze
                </button>
                {showSnoozeMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '4px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      boxShadow: shadows.lg,
                      border: `1px solid ${colors.stroke.light}`,
                      zIndex: zIndex.dropdown,
                      minWidth: '160px',
                      overflow: 'hidden',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {['1 hour', '4 hours', 'Tomorrow', 'Next week'].map((duration) => (
                      <button
                        key={duration}
                        onClick={() => {
                          onSnooze(notification.id, duration)
                          setShowSnoozeMenu(false)
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '10px 16px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          textAlign: 'left',
                          fontFamily: fontFamilies.body,
                          fontSize: '14px',
                          color: colors.text.highEmphasis.onLight,
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// NOTIFICATION DROPDOWN
// =============================================================================

interface NotificationDropdownProps {
  notifications: Notification[]
  isOpen: boolean
  onClose: () => void
  onMarkRead: (id: number) => void
  onMarkAllRead: () => void
  onAction: (notification: Notification) => void
  onViewAll: () => void
  anchorRef: React.RefObject<HTMLButtonElement | null>
}

function NotificationDropdown({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onAction,
  onViewAll,
  anchorRef,
}: NotificationDropdownProps) {
  const [filter, setFilter] = useState<DropdownFilter>('all')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose, anchorRef])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (filter === 'action_required') return n.type === 'action_required'
      if (filter === 'updates') return n.type === 'update' || n.type === 'system'
      return true
    }).slice(0, 10) // Limit to 10 in dropdown
  }, [notifications, filter])

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: '8px',
        width: '400px',
        maxHeight: '500px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: shadows['2xl'],
        border: `1px solid ${colors.stroke.light}`,
        zIndex: zIndex.dropdown,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      role="dialog"
      aria-label="Notifications"
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: `1px solid ${colors.stroke.light}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3
            style={{
              fontFamily: fontFamilies.display,
              fontSize: '18px',
              fontWeight: fontWeights.semibold,
              color: colors.text.highEmphasis.onLight,
              margin: 0,
            }}
          >
            Notifications
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              style={{
                background: 'none',
                border: 'none',
                color: '#16A34A',
                fontFamily: fontFamilies.body,
                fontSize: '13px',
                fontWeight: fontWeights.medium,
                cursor: 'pointer',
              }}
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'action_required', 'updates'] as DropdownFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: filter === f ? '#16A34A' : 'rgba(0, 0, 0, 0.05)',
                color: filter === f ? '#FFFFFF' : colors.text.lowEmphasis.onLight,
                fontFamily: fontFamilies.body,
                fontSize: '13px',
                fontWeight: fontWeights.medium,
                cursor: 'pointer',
                transition: `all ${transitionPresets.fast}`,
              }}
            >
              {f === 'all' ? 'All' : f === 'action_required' ? 'Action Required' : 'Updates'}
            </button>
          ))}
        </div>
      </div>

      {/* Notification list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: colors.text.lowEmphasis.onLight,
              }}
            >
              <CheckCircleIcon size={24} />
            </div>
            <p
              style={{
                fontFamily: fontFamilies.body,
                fontSize: '14px',
                color: colors.text.lowEmphasis.onLight,
                margin: 0,
              }}
            >
              You're all caught up!
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              variant="compact"
              onMarkRead={onMarkRead}
              onAction={onAction}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: `1px solid ${colors.stroke.light}`,
        }}
      >
        <button
          onClick={onViewAll}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#16A34A',
            fontFamily: fontFamilies.body,
            fontSize: '14px',
            fontWeight: fontWeights.medium,
            cursor: 'pointer',
            transition: `background-color ${transitionPresets.fast}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(22, 163, 74, 0.08)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          View all notifications
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// NOTIFICATION BELL BUTTON
// =============================================================================

interface NotificationBellButtonProps {
  notifications: Notification[]
  onClick: () => void
  isOpen: boolean
  buttonRef: React.RefObject<HTMLButtonElement | null>
}

export function NotificationBellButton({ notifications, onClick, isOpen, buttonRef }: NotificationBellButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        backgroundColor: isOpen || isHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
        color: isOpen || isHovered ? colors.text.highEmphasis.onLight : colors.text.lowEmphasis.onLight,
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: `all ${transitionPresets.fast}`,
      }}
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
    >
      <BellIcon size={24} />
      {unreadCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            minWidth: '18px',
            height: '18px',
            padding: '0 5px',
            borderRadius: '9px',
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontFamily: fontFamilies.body,
            fontSize: '11px',
            fontWeight: fontWeights.bold,
            lineHeight: '18px',
            textAlign: 'center',
            border: '2px solid #FFFFFF',
            boxSizing: 'border-box',
          }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}

// =============================================================================
// FULL INBOX VIEW
// =============================================================================

interface InboxViewProps {
  notifications: Notification[]
  onBack: () => void
  onMarkRead: (id: number) => void
  onMarkAllRead: () => void
  onAction: (notification: Notification) => void
  onSnooze: (id: number, duration: string) => void
  onOpenSettings: () => void
}

function InboxView({
  notifications,
  onBack,
  onMarkRead,
  onMarkAllRead,
  onAction,
  onSnooze,
  onOpenSettings,
}: InboxViewProps) {
  const [filters, setFilters] = useState<NotificationFilters>({
    status: 'all',
    app: 'all',
    org: 'all',
    time: 'all',
  })
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (filters.status === 'unread' && n.read) return false
      if (filters.status === 'action_required' && n.type !== 'action_required') return false
      if (filters.status === 'resolved' && n.status !== 'resolved') return false
      if (filters.app !== 'all' && n.app !== filters.app) return false
      if (filters.org !== 'all' && n.org !== filters.org) return false
      return true
    })
  }, [notifications, filters])

  const groupedNotifications = groupNotificationsByDate(filteredNotifications)

  const handleSelect = (id: number, selected: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (selected) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const handleSelectAll = () => {
    setSelectedIds(new Set(filteredNotifications.map(n => n.id)))
  }

  const handleDeselectAll = () => {
    setSelectedIds(new Set())
  }

  const handleMarkSelectedRead = () => {
    selectedIds.forEach(id => onMarkRead(id))
    setSelectedIds(new Set())
  }

  const orgs = Array.from(new Set(notifications.map(n => n.org).filter(Boolean))) as string[]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#FAFAFA',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: `1px solid ${colors.stroke.light}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: colors.text.lowEmphasis.onLight,
              cursor: 'pointer',
            }}
          >
            <ChevronLeftIcon size={24} />
          </button>
          <h1
            style={{
              fontFamily: fontFamilies.display,
              fontSize: '24px',
              fontWeight: fontWeights.semibold,
              color: colors.text.highEmphasis.onLight,
              margin: 0,
            }}
          >
            Notifications
          </h1>
        </div>
        <button
          onClick={onOpenSettings}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: colors.text.lowEmphasis.onLight,
            cursor: 'pointer',
          }}
          title="Notification settings"
        >
          <SettingsIcon size={24} />
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar filters */}
        <div
          style={{
            width: '240px',
            padding: '20px',
            backgroundColor: '#FFFFFF',
            borderRight: `1px solid ${colors.stroke.light}`,
            overflowY: 'auto',
          }}
        >
          {/* Status filter */}
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontFamily: fontFamilies.body,
                fontSize: '12px',
                fontWeight: fontWeights.semibold,
                color: colors.text.lowEmphasis.onLight,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 12px',
              }}
            >
              Status
            </h3>
            {(['all', 'unread', 'action_required', 'resolved'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilters(f => ({ ...f, status }))}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: filters.status === status ? 'rgba(22, 163, 74, 0.1)' : 'transparent',
                  color: filters.status === status ? '#16A34A' : colors.text.lowEmphasis.onLight,
                  fontFamily: fontFamilies.body,
                  fontSize: '14px',
                  fontWeight: filters.status === status ? fontWeights.medium : fontWeights.regular,
                  textAlign: 'left',
                  cursor: 'pointer',
                  marginBottom: '4px',
                }}
              >
                {status === 'all' ? 'All' : status === 'action_required' ? 'Action Required' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* App filter */}
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontFamily: fontFamilies.body,
                fontSize: '12px',
                fontWeight: fontWeights.semibold,
                color: colors.text.lowEmphasis.onLight,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 12px',
              }}
            >
              Application
            </h3>
            {(['all', 'Registry', 'Retail ID', 'Payments'] as const).map((app) => (
              <button
                key={app}
                onClick={() => setFilters(f => ({ ...f, app: app as SourceApp | 'all' }))}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: filters.app === app ? 'rgba(22, 163, 74, 0.1)' : 'transparent',
                  color: filters.app === app ? '#16A34A' : colors.text.lowEmphasis.onLight,
                  fontFamily: fontFamilies.body,
                  fontSize: '14px',
                  fontWeight: filters.app === app ? fontWeights.medium : fontWeights.regular,
                  textAlign: 'left',
                  cursor: 'pointer',
                  marginBottom: '4px',
                }}
              >
                {app === 'all' ? 'All Apps' : app}
              </button>
            ))}
          </div>

          {/* Organization filter */}
          <div>
            <h3
              style={{
                fontFamily: fontFamilies.body,
                fontSize: '12px',
                fontWeight: fontWeights.semibold,
                color: colors.text.lowEmphasis.onLight,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 12px',
              }}
            >
              Organization
            </h3>
            <button
              onClick={() => setFilters(f => ({ ...f, org: 'all' }))}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: filters.org === 'all' ? 'rgba(22, 163, 74, 0.1)' : 'transparent',
                color: filters.org === 'all' ? '#16A34A' : colors.text.lowEmphasis.onLight,
                fontFamily: fontFamilies.body,
                fontSize: '14px',
                fontWeight: filters.org === 'all' ? fontWeights.medium : fontWeights.regular,
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '4px',
              }}
            >
              All Organizations
            </button>
            {orgs.map((org) => (
              <button
                key={org}
                onClick={() => setFilters(f => ({ ...f, org }))}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: filters.org === org ? 'rgba(22, 163, 74, 0.1)' : 'transparent',
                  color: filters.org === org ? '#16A34A' : colors.text.lowEmphasis.onLight,
                  fontFamily: fontFamilies.body,
                  fontSize: '14px',
                  fontWeight: filters.org === org ? fontWeights.medium : fontWeights.regular,
                  textAlign: 'left',
                  cursor: 'pointer',
                  marginBottom: '4px',
                }}
              >
                {org}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Bulk actions toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              backgroundColor: '#FFFFFF',
              borderBottom: `1px solid ${colors.stroke.light}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: '13px',
                  color: colors.text.lowEmphasis.onLight,
                }}
              >
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
              </span>
              {selectedIds.size > 0 && (
                <>
                  <span style={{ color: colors.stroke.default }}>|</span>
                  <span
                    style={{
                      fontFamily: fontFamilies.body,
                      fontSize: '13px',
                      fontWeight: fontWeights.medium,
                      color: colors.text.highEmphasis.onLight,
                    }}
                  >
                    {selectedIds.size} selected
                  </span>
                  <button
                    onClick={handleDeselectAll}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#16A34A',
                      fontFamily: fontFamilies.body,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Deselect
                  </button>
                </>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selectedIds.size > 0 ? (
                <>
                  <button
                    onClick={handleMarkSelectedRead}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#16A34A',
                      fontFamily: fontFamilies.body,
                      fontSize: '13px',
                      fontWeight: fontWeights.medium,
                      cursor: 'pointer',
                    }}
                  >
                    <CheckCircleIcon size={16} />
                    Mark as read
                  </button>
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: colors.text.lowEmphasis.onLight,
                      fontFamily: fontFamilies.body,
                      fontSize: '13px',
                      fontWeight: fontWeights.medium,
                      cursor: 'pointer',
                    }}
                  >
                    <ArchiveIcon size={16} />
                    Archive
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSelectAll}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: colors.text.lowEmphasis.onLight,
                      fontFamily: fontFamilies.body,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Select all
                  </button>
                  <button
                    onClick={onMarkAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#16A34A',
                      fontFamily: fontFamilies.body,
                      fontSize: '13px',
                      fontWeight: fontWeights.medium,
                      cursor: 'pointer',
                    }}
                  >
                    Mark all as read
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notification list */}
          <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
            {filteredNotifications.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '60px 40px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.text.lowEmphasis.onLight,
                    marginBottom: '16px',
                  }}
                >
                  {filters.status === 'all' ? <CheckCircleIcon size={32} /> : <FilterIcon size={32} />}
                </div>
                <h3
                  style={{
                    fontFamily: fontFamilies.display,
                    fontSize: '18px',
                    fontWeight: fontWeights.semibold,
                    color: colors.text.highEmphasis.onLight,
                    margin: '0 0 8px',
                  }}
                >
                  {filters.status === 'all' && filters.app === 'all' && filters.org === 'all'
                    ? "You're all caught up!"
                    : 'No matching notifications'}
                </h3>
                <p
                  style={{
                    fontFamily: fontFamilies.body,
                    fontSize: '14px',
                    color: colors.text.lowEmphasis.onLight,
                    margin: 0,
                  }}
                >
                  {filters.status === 'all' && filters.app === 'all' && filters.org === 'all'
                    ? "We'll let you know when something needs your attention."
                    : 'Try adjusting your filters to see more results.'}
                </p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([date, items]) => {
                if (items.length === 0) return null
                return (
                  <div key={date}>
                    <div
                      style={{
                        padding: '12px 20px',
                        backgroundColor: '#FAFAFA',
                        fontFamily: fontFamilies.body,
                        fontSize: '12px',
                        fontWeight: fontWeights.semibold,
                        color: colors.text.lowEmphasis.onLight,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {date}
                    </div>
                    {items.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        variant="full"
                        isSelected={selectedIds.has(notification.id)}
                        onSelect={handleSelect}
                        onMarkRead={onMarkRead}
                        onAction={onAction}
                        onSnooze={onSnooze}
                      />
                    ))}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// SETTINGS VIEW
// =============================================================================

interface SettingsViewProps {
  settings: NotificationSettings
  onSettingsChange: (settings: NotificationSettings) => void
  onBack: () => void
}

function SettingsView({ settings, onSettingsChange, onBack }: SettingsViewProps) {
  const updateSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  const updateAppPreference = (
    app: SourceApp,
    type: 'actionRequired' | 'updates' | 'system',
    value: 'email_and_inapp' | 'inapp_only' | 'muted'
  ) => {
    onSettingsChange({
      ...settings,
      appPreferences: {
        ...settings.appPreferences,
        [app]: {
          ...settings.appPreferences[app],
          [type]: value,
        },
      },
    })
  }

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: `1px solid ${colors.stroke.default}`,
    backgroundColor: '#FFFFFF',
    fontFamily: fontFamilies.body,
    fontSize: '14px',
    color: colors.text.highEmphasis.onLight,
    cursor: 'pointer',
    minWidth: '140px',
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#FAFAFA',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: `1px solid ${colors.stroke.light}`,
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: colors.text.lowEmphasis.onLight,
            cursor: 'pointer',
          }}
        >
          <ChevronLeftIcon size={24} />
        </button>
        <h1
          style={{
            fontFamily: fontFamilies.display,
            fontSize: '24px',
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            margin: 0,
          }}
        >
          Notification Settings
        </h1>
      </div>

      {/* Settings content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Delivery Methods */}
          <section
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: `1px solid ${colors.stroke.light}`,
            }}
          >
            <h2
              style={{
                fontFamily: fontFamilies.display,
                fontSize: '18px',
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
                margin: '0 0 20px',
              }}
            >
              Delivery Methods
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div
                    style={{
                      fontFamily: fontFamilies.body,
                      fontSize: '14px',
                      fontWeight: fontWeights.medium,
                      color: colors.text.highEmphasis.onLight,
                    }}
                  >
                    Email notifications
                  </div>
                  <div
                    style={{
                      fontFamily: fontFamilies.body,
                      fontSize: '13px',
                      color: colors.text.lowEmphasis.onLight,
                      marginTop: '2px',
                    }}
                  >
                    Receive important notifications via email
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailEnabled}
                  onChange={(e) => updateSetting('emailEnabled', e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: '#16A34A' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div
                    style={{
                      fontFamily: fontFamilies.body,
                      fontSize: '14px',
                      fontWeight: fontWeights.medium,
                      color: colors.text.highEmphasis.onLight,
                    }}
                  >
                    In-app notifications
                  </div>
                  <div
                    style={{
                      fontFamily: fontFamilies.body,
                      fontSize: '13px',
                      color: colors.text.lowEmphasis.onLight,
                      marginTop: '2px',
                    }}
                  >
                    Always enabled
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  style={{ width: '20px', height: '20px', accentColor: '#16A34A' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.5 }}>
                <div>
                  <div
                    style={{
                      fontFamily: fontFamilies.body,
                      fontSize: '14px',
                      fontWeight: fontWeights.medium,
                      color: colors.text.highEmphasis.onLight,
                    }}
                  >
                    Push notifications
                  </div>
                  <div
                    style={{
                      fontFamily: fontFamilies.body,
                      fontSize: '13px',
                      color: colors.text.lowEmphasis.onLight,
                      marginTop: '2px',
                    }}
                  >
                    Coming soon
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={false}
                  disabled
                  style={{ width: '20px', height: '20px' }}
                />
              </label>
            </div>
          </section>

          {/* Email Digest Frequency */}
          <section
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: `1px solid ${colors.stroke.light}`,
            }}
          >
            <h2
              style={{
                fontFamily: fontFamilies.display,
                fontSize: '18px',
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
                margin: '0 0 20px',
              }}
            >
              Email Digest Frequency
            </h2>

            <div style={{ display: 'flex', gap: '12px' }}>
              {(['instant', 'daily', 'weekly'] as const).map((freq) => (
                <label
                  key={freq}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: `2px solid ${settings.digestFrequency === freq ? '#16A34A' : colors.stroke.light}`,
                    backgroundColor: settings.digestFrequency === freq ? 'rgba(22, 163, 74, 0.04)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="digestFrequency"
                    value={freq}
                    checked={settings.digestFrequency === freq}
                    onChange={() => updateSetting('digestFrequency', freq)}
                    style={{ accentColor: '#16A34A' }}
                  />
                  <span
                    style={{
                      fontFamily: fontFamilies.body,
                      fontSize: '14px',
                      fontWeight: fontWeights.medium,
                      color: colors.text.highEmphasis.onLight,
                    }}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    {freq !== 'instant' && ' Summary'}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Per-Application Preferences */}
          <section
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: `1px solid ${colors.stroke.light}`,
            }}
          >
            <h2
              style={{
                fontFamily: fontFamilies.display,
                fontSize: '18px',
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
                margin: '0 0 20px',
              }}
            >
              Per-Application Preferences
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px 8px',
                      fontFamily: fontFamilies.body,
                      fontSize: '12px',
                      fontWeight: fontWeights.semibold,
                      color: colors.text.lowEmphasis.onLight,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.stroke.light}`,
                    }}
                  >
                    Application
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px 8px',
                      fontFamily: fontFamilies.body,
                      fontSize: '12px',
                      fontWeight: fontWeights.semibold,
                      color: colors.text.lowEmphasis.onLight,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.stroke.light}`,
                    }}
                  >
                    Action Required
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px 8px',
                      fontFamily: fontFamilies.body,
                      fontSize: '12px',
                      fontWeight: fontWeights.semibold,
                      color: colors.text.lowEmphasis.onLight,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.stroke.light}`,
                    }}
                  >
                    Updates
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px 8px',
                      fontFamily: fontFamilies.body,
                      fontSize: '12px',
                      fontWeight: fontWeights.semibold,
                      color: colors.text.lowEmphasis.onLight,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.stroke.light}`,
                    }}
                  >
                    System
                  </th>
                </tr>
              </thead>
              <tbody>
                {(['Registry', 'Retail ID', 'Payments', 'Canopy'] as SourceApp[]).map((app) => (
                  <tr key={app}>
                    <td
                      style={{
                        padding: '16px 8px',
                        fontFamily: fontFamilies.body,
                        fontSize: '14px',
                        fontWeight: fontWeights.medium,
                        color: colors.text.highEmphasis.onLight,
                        borderBottom: `1px solid ${colors.stroke.light}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: getAppColor(app),
                          }}
                        />
                        {app}
                      </div>
                    </td>
                    <td style={{ padding: '16px 8px', borderBottom: `1px solid ${colors.stroke.light}` }}>
                      <select
                        value={settings.appPreferences[app].actionRequired}
                        onChange={(e) => updateAppPreference(app, 'actionRequired', e.target.value as 'email_and_inapp' | 'inapp_only' | 'muted')}
                        style={selectStyle}
                      >
                        <option value="email_and_inapp">Email + In-App</option>
                        <option value="inapp_only">In-App Only</option>
                        <option value="muted">Muted</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px 8px', borderBottom: `1px solid ${colors.stroke.light}` }}>
                      <select
                        value={settings.appPreferences[app].updates}
                        onChange={(e) => updateAppPreference(app, 'updates', e.target.value as 'email_and_inapp' | 'inapp_only' | 'muted')}
                        style={selectStyle}
                      >
                        <option value="email_and_inapp">Email + In-App</option>
                        <option value="inapp_only">In-App Only</option>
                        <option value="muted">Muted</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px 8px', borderBottom: `1px solid ${colors.stroke.light}` }}>
                      <select
                        value={settings.appPreferences[app].system}
                        onChange={(e) => updateAppPreference(app, 'system', e.target.value as 'email_and_inapp' | 'inapp_only' | 'muted')}
                        style={selectStyle}
                      >
                        <option value="email_and_inapp">Email + In-App</option>
                        <option value="inapp_only">In-App Only</option>
                        <option value="muted">Muted</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Mute / Do Not Disturb */}
          <section
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '24px',
              border: `1px solid ${colors.stroke.light}`,
            }}
          >
            <h2
              style={{
                fontFamily: fontFamilies.display,
                fontSize: '18px',
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
                margin: '0 0 20px',
              }}
            >
              Do Not Disturb
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: '14px',
                  color: colors.text.lowEmphasis.onLight,
                }}
              >
                Mute all notifications for
              </span>
              <select
                value={settings.muteUntil ? 'custom' : 'off'}
                onChange={(e) => {
                  if (e.target.value === 'off') {
                    updateSetting('muteUntil', null)
                  } else {
                    const now = new Date()
                    switch (e.target.value) {
                      case '1hour':
                        now.setHours(now.getHours() + 1)
                        break
                      case '4hours':
                        now.setHours(now.getHours() + 4)
                        break
                      case 'tomorrow':
                        now.setDate(now.getDate() + 1)
                        now.setHours(9, 0, 0, 0)
                        break
                      case 'nextweek':
                        now.setDate(now.getDate() + 7)
                        break
                    }
                    updateSetting('muteUntil', now)
                  }
                }}
                style={selectStyle}
              >
                <option value="off">Not muted</option>
                <option value="1hour">1 hour</option>
                <option value="4hours">4 hours</option>
                <option value="tomorrow">Until tomorrow</option>
                <option value="nextweek">Until next week</option>
              </select>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN NOTIFICATIONS CENTER COMPONENT
// =============================================================================

interface NotificationsCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onNotificationsChange: (notifications: Notification[]) => void
}

export function NotificationsCenter({
  isOpen,
  onClose,
  notifications,
  onNotificationsChange,
}: NotificationsCenterProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('home')
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const bellButtonRef = useRef<HTMLButtonElement>(null)

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const handleMarkRead = useCallback((id: number) => {
    onNotificationsChange(
      notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    )
  }, [notifications, onNotificationsChange])

  const handleMarkAllRead = useCallback(() => {
    onNotificationsChange(
      notifications.map(n => ({ ...n, read: true }))
    )
    showToastMessage('All notifications marked as read')
  }, [notifications, onNotificationsChange])

  const handleAction = useCallback((notification: Notification) => {
    handleMarkRead(notification.id)
    showToastMessage(`Navigating to ${notification.action}...`)
  }, [handleMarkRead])

  const handleSnooze = useCallback((id: number, duration: string) => {
    let snoozeDate = 'Feb 10, 2026'
    if (duration === '1 hour') snoozeDate = 'in 1 hour'
    else if (duration === '4 hours') snoozeDate = 'in 4 hours'
    else if (duration === 'Tomorrow') snoozeDate = 'Tomorrow'
    else if (duration === 'Next week') snoozeDate = 'Next week'

    onNotificationsChange(
      notifications.map(n =>
        n.id === id ? { ...n, status: 'snoozed' as NotificationStatus, snoozed_until: snoozeDate, read: true } : n
      )
    )
    showToastMessage(`Notification snoozed until ${snoozeDate}`)
  }, [notifications, onNotificationsChange])

  const handleViewAll = () => {
    setViewMode('inbox')
  }

  const handleOpenSettings = () => {
    setViewMode('settings')
  }

  const handleBack = () => {
    if (viewMode === 'settings') {
      setViewMode('inbox')
    } else {
      setViewMode('home')
      onClose()
    }
  }

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewMode === 'settings') {
          setViewMode('inbox')
        } else if (viewMode === 'inbox') {
          setViewMode('home')
          onClose()
        } else if (isOpen) {
          onClose()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, viewMode, onClose])

  // Render inbox or settings as full-page overlay
  if (viewMode === 'inbox' || viewMode === 'settings') {
    return (
      <>
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#FFFFFF',
            zIndex: zIndex.modal,
          }}
        >
          {viewMode === 'inbox' ? (
            <InboxView
              notifications={notifications}
              onBack={handleBack}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
              onAction={handleAction}
              onSnooze={handleSnooze}
              onOpenSettings={handleOpenSettings}
            />
          ) : (
            <SettingsView
              settings={settings}
              onSettingsChange={setSettings}
              onBack={handleBack}
            />
          )}
        </div>
        <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
      </>
    )
  }

  // Render dropdown when home
  return (
    <>
      <NotificationDropdown
        notifications={notifications}
        isOpen={isOpen}
        onClose={onClose}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        onAction={handleAction}
        onViewAll={handleViewAll}
        anchorRef={bellButtonRef}
      />
      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </>
  )
}

export default NotificationsCenter
