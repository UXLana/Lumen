'use client'

import React, { forwardRef } from 'react'
import {
  colors,
  typography,
  spacing,
  borderRadius,
  fontFamilies,
  transitionPresets,
  banner,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Banner variant based on semantic meaning
 * - info: Informational message (blue)
 * - success: Success or confirmation message (green)
 * - warning: Warning or caution message (orange)
 * - error: Error or critical message (red)
 */
export type BannerVariant = 'info' | 'success' | 'warning' | 'error'

/**
 * Banner size options
 * - md: Standard banner size
 * - lg: Larger banner for more prominent messages
 */
export type BannerSize = 'md' | 'lg'

/**
 * Banner component props
 */
export interface BannerProps {
  /** Semantic variant */
  variant?: BannerVariant
  /** Size of the banner */
  size?: BannerSize
  /** Main title/heading */
  title?: string
  /** Description text */
  children?: React.ReactNode
  /** Icon to display on the left */
  icon?: React.ReactNode
  /** Whether the banner can be dismissed */
  dismissible?: boolean
  /** Callback when banner is dismissed */
  onDismiss?: () => void
  /** Action button(s) */
  actions?: React.ReactNode
  /** Additional CSS class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

// =============================================================================
// ICONS
// =============================================================================

/**
 * Info icon (circle with "i")
 */
export function InfoIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Success icon (checkmark in circle)
 */
export function SuccessIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M9 12L11 14L15 10M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Warning icon (triangle with exclamation)
 */
export function WarningIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.64151 19.6871 1.81442 19.9905C1.98733 20.2939 2.23672 20.5467 2.53771 20.7239C2.83869 20.9011 3.18109 20.9962 3.53 21H20.47C20.8189 20.9962 21.1613 20.9011 21.4623 20.7239C21.7633 20.5467 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Error icon (X in circle)
 */
export function ErrorIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M10 14L12 12M12 12L14 10M12 12L10 10M12 12L14 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Close icon (X)
 */
export function CloseIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M15 5L5 15M5 5L15 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// =============================================================================
// VARIANT STYLES
// =============================================================================

interface VariantStyle {
  background: string
  border: string
  icon: string
  title: string
  text: string
  iconComponent: React.ComponentType<{ size?: number; color?: string }>
}

const variantStyles: Record<BannerVariant, VariantStyle> = {
  info: {
    background: banner.variants.info.background,
    border: banner.variants.info.border,
    icon: banner.variants.info.icon,
    title: banner.variants.info.title,
    text: banner.variants.info.text,
    iconComponent: InfoIcon,
  },
  success: {
    background: banner.variants.success.background,
    border: banner.variants.success.border,
    icon: banner.variants.success.icon,
    title: banner.variants.success.title,
    text: banner.variants.success.text,
    iconComponent: SuccessIcon,
  },
  warning: {
    background: banner.variants.warning.background,
    border: banner.variants.warning.border,
    icon: banner.variants.warning.icon,
    title: banner.variants.warning.title,
    text: banner.variants.warning.text,
    iconComponent: WarningIcon,
  },
  error: {
    background: banner.variants.error.background,
    border: banner.variants.error.border,
    icon: banner.variants.error.icon,
    title: banner.variants.error.title,
    text: banner.variants.error.text,
    iconComponent: ErrorIcon,
  },
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Banner component - displays important messages to users
 *
 * @example
 * ```tsx
 * <Banner variant="info" title="New Feature Available">
 *   Check out our new dashboard redesign!
 * </Banner>
 * ```
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      variant = 'info',
      size = 'md',
      title,
      children,
      icon,
      dismissible = false,
      onDismiss,
      actions,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const variantStyle = variantStyles[variant]
    const IconComponent = variantStyle.iconComponent

    const [dismissed, setDismissed] = React.useState(false)

    const handleDismiss = () => {
      setDismissed(true)
      onDismiss?.()
    }

    if (dismissed) {
      return null
    }

    const sizeTokens = banner.sizes[size]
    const typographyTokens = banner.typography[size]

    const baseStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: sizeTokens.gap,
      padding: `${sizeTokens.paddingY} ${sizeTokens.paddingX}`,
      background: variantStyle.background,
      border: `${banner.border.width} solid ${variantStyle.border}`,
      borderRadius: banner.border.radius,
      fontFamily: fontFamilies.body,
      transition: banner.transition,
      ...style,
    }

    const iconSize = parseInt(sizeTokens.iconSize)

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={className}
        style={baseStyles}
        {...props}
      >
        {/* Icon */}
        <div style={{ flexShrink: 0, marginTop: banner.spacing.iconMarginTop }}>
          {icon || <IconComponent size={iconSize} color={variantStyle.icon} />}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && (
            <div
              style={{
                fontSize: typographyTokens.title.fontSize,
                fontWeight: typographyTokens.title.fontWeight,
                lineHeight: typographyTokens.title.lineHeight,
                letterSpacing: typographyTokens.title.letterSpacing,
                color: variantStyle.title,
                marginBottom: children ? banner.spacing.titleMarginBottom : 0,
              }}
            >
              {title}
            </div>
          )}
          {children && (
            <div
              style={{
                fontSize: typographyTokens.description.fontSize,
                fontWeight: typographyTokens.description.fontWeight,
                lineHeight: typographyTokens.description.lineHeight,
                letterSpacing: typographyTokens.description.letterSpacing,
                color: variantStyle.text,
              }}
            >
              {children}
            </div>
          )}
          {actions && (
            <div style={{ marginTop: banner.spacing.actionsMarginTop, display: 'flex', gap: banner.spacing.actionGap }}>
              {actions}
            </div>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss"
            style={{
              flexShrink: 0,
              background: banner.dismiss.background.default,
              border: 'none',
              padding: banner.dismiss.padding,
              cursor: 'pointer',
              color: variantStyle.icon,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: banner.dismiss.borderRadius,
              transition: banner.transition,
              opacity: banner.dismiss.opacity.default,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = banner.dismiss.opacity.hover.toString()
              e.currentTarget.style.background = banner.dismiss.background.hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = banner.dismiss.opacity.default.toString()
              e.currentTarget.style.background = banner.dismiss.background.default
            }}
          >
            <CloseIcon size={parseInt(banner.dismiss.iconSize)} color={variantStyle.icon} />
          </button>
        )}
      </div>
    )
  }
)

Banner.displayName = 'Banner'
