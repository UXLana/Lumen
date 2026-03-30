'use client'

import React, { useState } from 'react'
import {
  fontFamilies,
  pagination,
  transitionPresets,
} from '../../styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

export interface PaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** Items per page */
  pageSize: number
  /** Total number of items */
  totalItems: number
  /** Page size options */
  pageSizeOptions?: number[]
  /** Callback when page changes */
  onPageChange?: (page: number) => void
  /** Callback when page size changes */
  onPageSizeChange?: (size: number) => void
  /** Custom styles */
  style?: React.CSSProperties
}

// =============================================================================
// NAV BUTTON
// =============================================================================

interface NavButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaLabel: string
}

function NavButton({ icon, onClick, disabled, ariaLabel }: NavButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getButtonColors = () => {
    if (disabled) return pagination.navButton.colors.disabled
    if (isHovered) return pagination.navButton.colors.hover
    return pagination.navButton.colors.default
  }

  const colors = getButtonColors()

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: pagination.navButton.size,
    height: pagination.navButton.size,
    borderRadius: pagination.navButton.borderRadius,
    backgroundColor: colors.background,
    border: `1px solid ${colors.border}`,
    color: colors.icon,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${transitionPresets.default}`,
  }

  return (
    <button
      type="button"
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  )
}

// =============================================================================
// PAGINATION
// =============================================================================

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  style,
}: PaginationProps) {
  const hasItems = totalItems > 0 && pageSize > 0 && totalPages > 0
  const safeTotalPages = Math.max(totalPages, 0)
  const clampedPage = hasItems ? Math.min(Math.max(currentPage, 1), safeTotalPages) : 0
  const startItem = hasItems ? (clampedPage - 1) * pageSize + 1 : 0
  const endItem = hasItems ? Math.min(clampedPage * pageSize, totalItems) : 0
  const isFirstPage = !hasItems || clampedPage <= 1
  const isLastPage = !hasItems || clampedPage >= safeTotalPages

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: pagination.gap,
    height: pagination.height,
    ...style,
  }

  const textStyle: React.CSSProperties = {
    fontFamily: fontFamilies.body,
    fontSize: pagination.typography.text.fontSize,
    fontWeight: pagination.typography.text.fontWeight,
    lineHeight: pagination.typography.text.lineHeight,
    color: pagination.typography.text.color,
  }

  const pageInfoStyle: React.CSSProperties = {
    fontFamily: fontFamilies.body,
    fontSize: pagination.typography.pageInfo.fontSize,
    fontWeight: pagination.typography.pageInfo.fontWeight,
    lineHeight: pagination.typography.pageInfo.lineHeight,
    color: pagination.typography.pageInfo.color,
  }

  const dropdownStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: pagination.dropdown.height,
    padding: `0 ${pagination.dropdown.paddingX}`,
    gap: pagination.dropdown.gap,
    borderRadius: pagination.dropdown.borderRadius,
    border: pagination.dropdown.border,
    backgroundColor: pagination.dropdown.background,
    fontFamily: fontFamilies.body,
    fontSize: pagination.typography.text.fontSize,
    fontWeight: pagination.typography.text.fontWeight,
    cursor: 'pointer',
  }

  const navGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }

  // Icons
  const firstIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.6667 14.1667L7.5 10L11.6667 5.83333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )

  const prevIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const nextIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const lastIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.33333 14.1667L12.5 10L8.33333 5.83333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )

  const dropdownIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <div style={containerStyle}>
      {/* Item range */}
      <span style={textStyle}>
        {startItem}-{endItem} of {totalItems}
      </span>

      {/* Page size dropdown */}
      <select
        style={dropdownStyle}
        value={pageSize}
        aria-label="Items per page"
        onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </select>

      {/* Page info */}
      <span style={pageInfoStyle}>
        Page {clampedPage} of {safeTotalPages}
      </span>

      {/* Navigation buttons */}
      <div style={navGroupStyle}>
        <NavButton
          icon={firstIcon}
          onClick={() => onPageChange?.(1)}
          disabled={isFirstPage}
          ariaLabel="First page"
        />
        <NavButton
          icon={prevIcon}
          onClick={() => onPageChange?.(clampedPage - 1)}
          disabled={isFirstPage}
          ariaLabel="Previous page"
        />
        <NavButton
          icon={nextIcon}
          onClick={() => onPageChange?.(clampedPage + 1)}
          disabled={isLastPage}
          ariaLabel="Next page"
        />
        <NavButton
          icon={lastIcon}
          onClick={() => onPageChange?.(safeTotalPages)}
          disabled={isLastPage}
          ariaLabel="Last page"
        />
      </div>
    </div>
  )
}

Pagination.displayName = 'Pagination'
