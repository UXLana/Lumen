'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  colors,
  spacing,
  borderRadius,
  transitionPresets,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

export type NavigationStyle = 'thumbnails' | 'dots' | 'both'

export interface ImageCarouselProps {
  /** Array of image URLs to display */
  images: string[]
  /** Alt text for each image (matches by index) */
  alts?: string[]
  /** Height of the carousel container */
  height?: string
  /** Background color behind images */
  backgroundColor?: string
  /** Border radius of the carousel */
  radius?: string
  /** Object fit for images */
  objectFit?: 'contain' | 'cover'
  /** Navigation indicator style: thumbnails, dots, or both */
  navigationStyle?: NavigationStyle
  /** Show prev/next arrow navigation and pagination */
  showNavigation?: boolean
  /** Called when the active slide changes */
  onSlideChange?: (index: number) => void
  /** Custom styles for the outer container */
  style?: React.CSSProperties
  /** Accessible label for the carousel region */
  'aria-label'?: string
}

// =============================================================================
// FOCUS STYLE (injected once)
// =============================================================================

const FOCUS_STYLE_ID = 'image-carousel-focus-style'

function ensureFocusStyle() {
  if (typeof document === 'undefined') return
  if (document.getElementById(FOCUS_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = FOCUS_STYLE_ID
  style.textContent = `
    .image-carousel-root:focus-visible {
      outline: 2px solid ${colors.focusBorder.onLight};
      outline-offset: -2px;
    }
    .image-carousel-root:focus:not(:focus-visible) {
      outline: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .image-carousel-track,
      .image-carousel-dot {
        transition: none !important;
      }
    }
  `
  document.head.appendChild(style)
}

// =============================================================================
// ICONS
// =============================================================================

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// =============================================================================
// ARROW BUTTON
// =============================================================================

function NavArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Previous image' : 'Next image'}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '36px',
        height: '36px',
        flex: '0 0 36px',
        borderRadius: '50%',
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        backgroundColor: hovered && !disabled ? colors.surface.lightDarker : 'transparent',
        color: disabled ? colors.text.lowEmphasis.onLight : colors.text.highEmphasis.onLight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: `opacity ${transitionPresets.fast}, background-color ${transitionPresets.fast}`,
        padding: 0,
      }}
    >
      {direction === 'prev' ? <ChevronLeft /> : <ChevronRight />}
    </button>
  )
}

// =============================================================================
// IMAGE CAROUSEL
// =============================================================================

export function ImageCarousel({
  images,
  alts = [],
  height = '280px',
  backgroundColor,
  radius,
  objectFit = 'cover',
  navigationStyle = 'thumbnails',
  showNavigation = true,
  onSlideChange,
  style,
  'aria-label': ariaLabel = 'Product images',
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // Touch / swipe state
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)
  const isSwiping = useRef(false)

  const total = images.length
  const showControls = total > 1

  // Inject focus + reduced-motion styles
  useEffect(() => {
    ensureFocusStyle()
  }, [])

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, total - 1))
      setActiveIndex(clamped)
      onSlideChange?.(clamped)
    },
    [total, onSlideChange],
  )

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      }
    },
    [prev, next],
  )

  // Touch handlers for swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDelta.current = 0
    isSwiping.current = true
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return
    touchDelta.current = e.touches[0].clientX - touchStartX.current
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping.current) return
    isSwiping.current = false
    const threshold = 50
    if (touchDelta.current > threshold) {
      prev()
    } else if (touchDelta.current < -threshold) {
      next()
    }
    touchDelta.current = 0
  }, [prev, next])

  // Reset index if images change
  useEffect(() => {
    if (activeIndex >= total) {
      setActiveIndex(Math.max(0, total - 1))
    }
  }, [total, activeIndex])

  if (total === 0) return null

  const resolvedRadius = radius ?? borderRadius.lg

  return (
    <div
      className="image-carousel-root"
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={showControls ? handleKeyDown : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={showControls ? handleTouchStart : undefined}
      onTouchMove={showControls ? handleTouchMove : undefined}
      onTouchEnd={showControls ? handleTouchEnd : undefined}
      style={{
        position: 'relative',
        width: '100%',
        ...style,
      }}
    >
      {/* Main image viewport */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: resolvedRadius,
          backgroundColor: backgroundColor ?? colors.surface.lightDarker,
          overflow: 'hidden',
        }}
      >
        {/* Slide track */}
        <div
          ref={trackRef}
          className="image-carousel-track"
          style={{
            display: 'flex',
            width: '100%',
            height,
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: `transform ${transitionPresets.default}`,
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={alts[i] || `Image ${i + 1} of ${total}`}
              aria-hidden={i !== activeIndex}
              style={{
                flex: '0 0 100%',
                width: '100%',
                height: '100%',
                ...(objectFit === 'cover'
                  ? {}
                  : {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: spacing.md,
                    }),
              }}
            >
              <img
                src={src}
                alt={alts[i] || ''}
                draggable={false}
                style={
                  objectFit === 'cover'
                    ? {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        userSelect: 'none',
                        display: 'block',
                      }
                    : {
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        userSelect: 'none',
                      }
                }
              />
            </div>
          ))}
        </div>

      </div>

      {/* Navigation row */}
      {showControls && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.xs,
            marginTop: spacing.xs,
            marginBottom: spacing.md,
          }}
        >
          {/* Dot indicators */}
          {(navigationStyle === 'dots' || navigationStyle === 'both') && (
            <div
              role="tablist"
              aria-label="Slide indicators"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              {images.map((_, i) => {
                const isActive = i === activeIndex
                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    className="image-carousel-dot"
                    aria-selected={isActive}
                    aria-label={`Go to image ${i + 1}`}
                    onClick={() => goTo(i)}
                    style={{
                      width: isActive ? '24px' : '8px',
                      height: '8px',
                      borderRadius: borderRadius.full,
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      backgroundColor: isActive
                        ? colors.text.highEmphasis.onLight
                        : colors.border.lowEmphasis.onLight,
                      transition: `width ${transitionPresets.fast}, background-color ${transitionPresets.fast}`,
                    }}
                  />
                )
              })}
            </div>
          )}

          {/* Arrow + pagination row */}
          {showNavigation && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
              }}
            >
              <NavArrowButton direction="prev" onClick={prev} disabled={activeIndex === 0} />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: colors.text.lowEmphasis.onLight,
                  minWidth: '40px',
                  textAlign: 'center',
                  userSelect: 'none',
                }}
              >
                {activeIndex + 1} / {total}
              </span>
              <NavArrowButton direction="next" onClick={next} disabled={activeIndex === total - 1} />
            </div>
          )}

          {/* Thumbnails */}
          {(navigationStyle === 'thumbnails' || navigationStyle === 'both') && (
            <div
              role={navigationStyle === 'both' ? undefined : 'tablist'}
              aria-label={navigationStyle === 'both' ? undefined : 'Slide indicators'}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: spacing.xs,
              }}
            >
              {images.map((src, i) => {
                const isActive = i === activeIndex
                return (
                  <button
                    key={i}
                    type="button"
                    role={navigationStyle === 'both' ? undefined : 'tab'}
                    className="image-carousel-dot"
                    aria-selected={navigationStyle === 'both' ? undefined : isActive}
                    aria-label={`Go to image ${i + 1}`}
                    onClick={() => goTo(i)}
                    style={{
                      width: '72px',
                      height: '48px',
                      flex: '0 0 72px',
                      borderRadius: borderRadius.md,
                      border: isActive
                        ? `2px solid ${colors.focusBorder.onLight}`
                        : `1px solid ${colors.border.lowEmphasis.onLight}`,
                      padding: 0,
                      cursor: 'pointer',
                      backgroundColor: backgroundColor ?? colors.surface.lightDarker,
                      overflow: 'hidden',
                      transition: `border ${transitionPresets.fast}, opacity ${transitionPresets.fast}`,
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        userSelect: 'none',
                      }}
                    />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Live region for screen reader announcements */}
      {showControls && (
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
          }}
        >
          {`Image ${activeIndex + 1} of ${total}`}
        </div>
      )}
    </div>
  )
}

ImageCarousel.displayName = 'ImageCarousel'
