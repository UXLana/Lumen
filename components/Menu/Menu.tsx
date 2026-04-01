'use client'

import React, { forwardRef, useRef, useCallback, useEffect, useState, createContext, useContext } from 'react'
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  fontWeights,
  transitionPresets,
} from '../../styles/design-tokens'
import { Input } from '../Input'
import { Button } from '../Button'
import { IconSearch } from '../Icons'

// =============================================================================
// SEARCH CONTEXT
// =============================================================================

interface MenuSearchContextValue {
  query: string
}

export const MenuSearchContext = createContext<MenuSearchContextValue>({ query: '' })

export function useMenuSearch(): string {
  return useContext(MenuSearchContext).query
}

// =============================================================================
// TYPES
// =============================================================================

export interface MenuProps {
  /** Menu content — MenuItem, MenuGroup, MenuDivider elements */
  children: React.ReactNode
  /** Fixed width in pixels (Figma default: 200) */
  width?: number | string
  /** Maximum height before scrolling */
  maxHeight?: number | string
  /** Whether the menu is open (controls visibility when used as a popover) */
  open?: boolean
  /** Called when the menu requests to close (Escape key, outside click) */
  onClose?: () => void
  /** Show a search input at the top of the menu */
  searchable?: boolean
  /** Placeholder text for the search input */
  searchPlaceholder?: string
  /** Controlled search value (for external filtering) */
  searchValue?: string
  /** Called when search value changes */
  onSearchChange?: (value: string) => void
  /** Show a close/done button at the bottom (recommended for mobile) */
  showDoneButton?: boolean
  /** Label for the done button */
  doneLabel?: string
  /** Accessible label for the menu */
  'aria-label'?: string
  /** ID of the element that labels this menu */
  'aria-labelledby'?: string
  /** Additional class name */
  className?: string
  /** Additional styles */
  style?: React.CSSProperties
}

export interface MenuGroupProps {
  /** Group heading text */
  label: string
  /** Group items */
  children: React.ReactNode
}

export interface MenuDividerProps {
  /** Additional styles */
  style?: React.CSSProperties
}

// =============================================================================
// MENU DIVIDER
// =============================================================================

export function MenuDivider({ style }: MenuDividerProps) {
  return (
    <div
      role="separator"
      style={{
        height: '1px',
        backgroundColor: colors.border.lowEmphasis.onLight,
        margin: `${spacing['2xs']} ${spacing.md}`,
        ...style,
      }}
    />
  )
}

// =============================================================================
// MENU GROUP
// =============================================================================

export function MenuGroup({ label, children }: MenuGroupProps) {
  return (
    <div role="group" aria-label={label}>
      <div
        style={{
          ...typography.label.sm,
          fontWeight: fontWeights.medium,
          color: colors.text.lowEmphasis.onLight,
          padding: `${spacing.xs} ${spacing.md}`,
          userSelect: 'none',
        }}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

// =============================================================================
// MENU COMPONENT
// =============================================================================

export const Menu = forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      children,
      width = 200,
      maxHeight,
      open,
      onClose,
      searchable = false,
      searchPlaceholder = 'Search…',
      searchValue: controlledSearch,
      onSearchChange,
      showDoneButton = false,
      doneLabel = 'Done',
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const menuRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const combinedRef = useCombinedRef(ref, menuRef)

    // Internal search state (uncontrolled fallback)
    const [internalQuery, setInternalQuery] = useState('')
    const query = controlledSearch ?? internalQuery

    const handleSearchChange = useCallback(
      (value: string) => {
        if (onSearchChange) {
          onSearchChange(value)
        } else {
          setInternalQuery(value)
        }
      },
      [onSearchChange]
    )

    // Reset search when menu closes
    useEffect(() => {
      if (open === false) {
        setInternalQuery('')
      }
    }, [open])

    // Keyboard navigation — skip search input in arrow key nav
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const menu = menuRef.current
        if (!menu) return

        // Let the search input handle its own typing
        const isInSearch = searchInputRef.current?.contains(document.activeElement as Node)

        // Only intercept arrow keys and escape from search
        if (isInSearch && e.key !== 'ArrowDown' && e.key !== 'Escape') return

        const items = Array.from(
          menu.querySelectorAll<HTMLElement>(
            '[role="menuitem"]:not([aria-disabled="true"]):not([hidden]), [role="menuitemcheckbox"]:not([aria-disabled="true"]):not([hidden]), [role="menuitemradio"]:not([aria-disabled="true"]):not([hidden])'
          )
        )

        const currentIndex = items.indexOf(document.activeElement as HTMLElement)

        switch (e.key) {
          case 'ArrowDown': {
            e.preventDefault()
            if (isInSearch) {
              // Move from search to first item
              items[0]?.focus()
            } else {
              const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0
              items[next]?.focus()
            }
            break
          }
          case 'ArrowUp': {
            e.preventDefault()
            if (currentIndex === 0 && searchable) {
              // Move from first item back to search
              searchInputRef.current?.querySelector('input')?.focus()
            } else {
              const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1
              items[prev]?.focus()
            }
            break
          }
          case 'Home': {
            e.preventDefault()
            items[0]?.focus()
            break
          }
          case 'End': {
            e.preventDefault()
            items[items.length - 1]?.focus()
            break
          }
          case 'Escape': {
            e.preventDefault()
            onClose?.()
            break
          }
        }
      },
      [onClose, searchable]
    )

    // Focus search input (or first item) when menu opens
    useEffect(() => {
      if (open === false) return
      const menu = menuRef.current
      if (!menu) return

      const timer = setTimeout(() => {
        if (searchable) {
          // Focus the search input
          const input = menu.querySelector<HTMLInputElement>('input[type="text"]')
          input?.focus()
        } else {
          const firstItem = menu.querySelector<HTMLElement>(
            '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemcheckbox"]:not([aria-disabled="true"]), [role="menuitemradio"]:not([aria-disabled="true"])'
          )
          firstItem?.focus()
        }
      }, 0)
      return () => clearTimeout(timer)
    }, [open, searchable])

    // If open prop is provided and false, don't render
    if (open === false) return null

    const hasMaxHeight = !!maxHeight
    const resolvedMaxHeight = maxHeight
      ? typeof maxHeight === 'number'
        ? `${maxHeight}px`
        : maxHeight
      : undefined

    return (
      <MenuSearchContext.Provider value={{ query }}>
        <div
          ref={combinedRef}
          role="menu"
          className={className}
          onKeyDown={handleKeyDown}
          style={{
            width: typeof width === 'number' ? `${width}px` : width,
            maxHeight: resolvedMaxHeight,
            backgroundColor: colors.surface.light,
            borderRadius: borderRadius.md,
            boxShadow: shadows.lg,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
            overflow: 'hidden',
            ...style,
          }}
          {...rest}
        >
          {/* Search input — pinned at top */}
          {searchable && (
            <div
              ref={searchInputRef}
              style={{
                padding: `${spacing.xs} ${spacing.sm}`,
                borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
                flexShrink: 0,
              }}
            >
              <Input
                value={query}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                size="sm"
                fullWidth
                startAdornment={<IconSearch size="sm" color={colors.text.lowEmphasis.onLight} />}
                aria-label="Search menu items"
              />
            </div>
          )}

          {/* Scrollable item area */}
          <div
            style={{
              overflowY: hasMaxHeight ? 'auto' : undefined,
              flex: hasMaxHeight ? 1 : undefined,
              padding: `${spacing.xs} 0`,
            }}
          >
            {children}
          </div>

          {/* Done button — for mobile a11y, provides explicit close target */}
          {showDoneButton && (
            <div
              style={{
                padding: `${spacing.xs} ${spacing.sm}`,
                borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
                flexShrink: 0,
              }}
            >
              <Button
                emphasis="mid"
                size="md"
                fullWidth
                onClick={() => onClose?.()}
              >
                {doneLabel}
              </Button>
            </div>
          )}
        </div>
      </MenuSearchContext.Provider>
    )
  }
)

Menu.displayName = 'Menu'

// =============================================================================
// HELPERS
// =============================================================================

function useCombinedRef<T>(
  ...refs: (React.Ref<T> | null | undefined)[]
): React.RefCallback<T> {
  return useCallback(
    (node: T | null) => {
      refs.forEach((r) => {
        if (!r) return
        if (typeof r === 'function') r(node)
        else (r as React.MutableRefObject<T | null>).current = node
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  )
}
