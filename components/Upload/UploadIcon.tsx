'use client'

import React, { forwardRef } from 'react'
import { colors, spacing, borderRadius } from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

export type UploadIconType = 'file' | 'pdf' | 'image' | 'thumbnail'
export type UploadIconState = 'default' | 'lowEmphasis' | 'disabled'

export interface UploadIconProps extends React.HTMLAttributes<HTMLDivElement> {
  /** File type to display */
  type?: UploadIconType
  /** Visual state */
  state?: UploadIconState
  /** Thumbnail image URL (only used when type="thumbnail") */
  thumbnailSrc?: string
  /** Alt text for thumbnail (only used when type="thumbnail") */
  thumbnailAlt?: string
}

// =============================================================================
// STATE CONFIG
// =============================================================================

const stateConfig = {
  default: {
    containerBg: colors.surface?.lightDarker ?? '#F5F5F5',
    iconColor: colors.text?.highEmphasis?.onLight ?? colors.brand.default,
  },
  lowEmphasis: {
    containerBg: colors.surface?.lightDarker ?? '#F5F5F5',
    iconColor: colors.text?.lowEmphasis?.onLight ?? '#999',
  },
  disabled: {
    containerBg: colors.surface?.disabled?.onLight ?? '#EBEBEB',
    iconColor: colors.text?.disabled?.onLight ?? '#B0B0B0',
  },
} as const

// =============================================================================
// INTERNAL ICON SVGs
// =============================================================================

const FileIconSvg = ({ color }: { color: string }) => (
  <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true">
    <path
      d="M12 1H3C1.89543 1 1 1.89543 1 3V21C1 22.1046 1.89543 23 3 23H17C18.1046 23 19 22.1046 19 21V8L12 1Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 1V8H19"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const PdfIconSvg = ({ color }: { color: string }) => (
  <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true">
    <path
      d="M12 1H3C1.89543 1 1 1.89543 1 3V21C1 22.1046 1.89543 23 3 23H17C18.1046 23 19 22.1046 19 21V8L12 1Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 1V8H19"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="10"
      y="18"
      textAnchor="middle"
      fontSize="7"
      fontWeight="600"
      fill={color}
    >
      PDF
    </text>
  </svg>
)

const ImageIconSvg = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect
      x="1"
      y="3"
      width="22"
      height="18"
      rx="2"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="9" r="2" stroke={color} strokeWidth="1.5" />
    <path
      d="M23 16L17 10L3 21"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// =============================================================================
// COMPONENT
// =============================================================================

export const UploadIcon = forwardRef<HTMLDivElement, UploadIconProps>(
  (
    {
      type = 'file',
      state = 'default',
      thumbnailSrc,
      thumbnailAlt = '',
      style,
      ...rest
    },
    ref
  ) => {
    const config = stateConfig[state]

    // Thumbnail variant — render image in rounded container
    if (type === 'thumbnail' && thumbnailSrc) {
      return (
        <div
          ref={ref}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: borderRadius.sm,
            overflow: 'hidden',
            opacity: state === 'disabled' ? 0.5 : 1,
            flexShrink: 0,
            ...style,
          }}
          {...rest}
        >
          <img
            src={thumbnailSrc}
            alt={thumbnailAlt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )
    }

    // Icon variants — render SVG inside container
    const iconMap = {
      file: FileIconSvg,
      pdf: PdfIconSvg,
      image: ImageIconSvg,
      thumbnail: FileIconSvg, // fallback when no thumbnailSrc
    }

    const IconComponent = iconMap[type]

    return (
      <div
        ref={ref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: borderRadius.sm,
          backgroundColor: config.containerBg,
          flexShrink: 0,
          ...style,
        }}
        {...rest}
      >
        <IconComponent color={config.iconColor} />
      </div>
    )
  }
)

UploadIcon.displayName = 'UploadIcon'
