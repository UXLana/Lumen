'use client'
// 'use client' needed: uses React hooks (useState, useCallback, useRef, useEffect)
// Per SKILL.md: apply per file, not per component tree

import { useState, useCallback, useRef, useEffect } from 'react'
import type { ComboboxOption } from './Combobox'
import { defaultFilter, getOptionId, getResultAnnouncement } from './helpers'

// =============================================================================
// STATUS ENUM (per component-rules.md Status Enum Pattern)
//
// "For components with multiple mutually exclusive states, use a string union
// type with derived booleans"
// =============================================================================

export type ComboboxStatus = 'idle' | 'open' | 'loading' | 'empty'

// =============================================================================
// HOOK TYPES
// =============================================================================

export interface UseComboboxOptions {
  /** All available options */
  options: ComboboxOption[]
  /** Controlled selected value */
  value?: string | null
  /** Default selected value (uncontrolled) */
  defaultValue?: string | null
  /** Callback when selection changes */
  onSelect?: (value: string | null, option: ComboboxOption | null) => void
  /** Callback when input query changes */
  onQueryChange?: (query: string) => void
  /** Custom filter function (defaults to case-insensitive substring match) */
  filterFn?: (options: ComboboxOption[], query: string) => ComboboxOption[]
  /** Whether options are being loaded externally */
  loading?: boolean
  /** Unique ID for ARIA references */
  comboboxId: string
}

export interface UseComboboxReturn {
  /** Current status */
  status: ComboboxStatus
  /** Derived booleans */
  isOpen: boolean
  isEmpty: boolean
  isLoading: boolean
  /** Input query string */
  query: string
  /** Filtered options */
  filteredOptions: ComboboxOption[]
  /** Currently highlighted option index (-1 = none) */
  activeIndex: number
  /** Currently selected value */
  selectedValue: string | null
  /** Selected option object */
  selectedOption: ComboboxOption | null
  /** Announcement text for aria-live */
  announcement: string
  /** Handlers */
  setQuery: (q: string) => void
  openMenu: () => void
  closeMenu: () => void
  selectOption: (option: ComboboxOption) => void
  clearSelection: () => void
  handleInputKeyDown: (e: React.KeyboardEvent) => void
  /** Refs */
  inputRef: React.RefObject<HTMLInputElement>
  listRef: React.RefObject<HTMLUListElement>
}

// =============================================================================
// HOOK
// =============================================================================

export function useCombobox({
  options,
  value: controlledValue,
  defaultValue = null,
  onSelect,
  onQueryChange,
  filterFn = defaultFilter,
  loading = false,
  comboboxId,
}: UseComboboxOptions): UseComboboxReturn {
  // --- Controlled/Uncontrolled (per component-rules.md) ---
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue)
  const selectedValue = isControlled ? (controlledValue ?? null) : internalValue

  const [query, setQueryState] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [announcement, setAnnouncement] = useState('')

  const inputRef = useRef<HTMLInputElement>(null!)
  const listRef = useRef<HTMLUListElement>(null!)

  // Filter options
  const filteredOptions = filterFn(options, query)

  // --- Status Enum (per component-rules.md) ---
  const status: ComboboxStatus = loading
    ? 'loading'
    : isOpen && filteredOptions.length === 0 && query.length > 0
      ? 'empty'
      : isOpen
        ? 'open'
        : 'idle'

  // Derived booleans
  const isEmpty = status === 'empty'
  const isLoading = status === 'loading'

  // Selected option object
  const selectedOption = options.find((o) => o.value === selectedValue) ?? null

  // Sync query text when controlled value changes externally (e.g. pre-fill toggle)
  const prevControlledRef = useRef(controlledValue)
  useEffect(() => {
    if (isControlled && controlledValue !== prevControlledRef.current) {
      prevControlledRef.current = controlledValue
      if (selectedOption) {
        setQueryState(selectedOption.label)
      } else if (controlledValue === null) {
        setQueryState('')
      }
    }
  }, [controlledValue, isControlled, selectedOption])

  // --- Query handler ---
  const setQuery = useCallback(
    (q: string) => {
      setQueryState(q)
      onQueryChange?.(q)
      if (!isOpen) setIsOpen(true)
      setActiveIndex(-1)
    },
    [isOpen, onQueryChange]
  )

  // --- Menu handlers ---
  const openMenu = useCallback(() => {
    setIsOpen(true)
    setActiveIndex(-1)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    setActiveIndex(-1)
  }, [])

  // --- Selection ---
  const selectOption = useCallback(
    (option: ComboboxOption) => {
      if (option.disabled) return
      if (!isControlled) setInternalValue(option.value)
      onSelect?.(option.value, option)
      setQueryState(option.label)
      closeMenu()
    },
    [isControlled, onSelect, closeMenu]
  )

  const clearSelection = useCallback(() => {
    if (!isControlled) setInternalValue(null)
    onSelect?.(null, null)
    setQueryState('')
    inputRef.current?.focus()
  }, [isControlled, onSelect])

  // --- Keyboard (per component-rules.md Arrow Key Navigation) ---
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (!isOpen) {
            openMenu()
          } else {
            setActiveIndex((i) => (i + 1) % filteredOptions.length)
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (isOpen) {
            setActiveIndex((i) => (i - 1 + filteredOptions.length) % filteredOptions.length)
          }
          break
        case 'Home':
          if (isOpen) {
            e.preventDefault()
            setActiveIndex(0)
          }
          break
        case 'End':
          if (isOpen) {
            e.preventDefault()
            setActiveIndex(filteredOptions.length - 1)
          }
          break
        case 'Enter':
          e.preventDefault()
          if (isOpen && activeIndex >= 0 && filteredOptions[activeIndex]) {
            selectOption(filteredOptions[activeIndex])
          }
          break
        case 'Escape':
          // Per component-rules.md Escape to Dismiss
          if (isOpen) {
            e.preventDefault()
            closeMenu()
          }
          break
      }
    },
    [isOpen, activeIndex, filteredOptions, openMenu, closeMenu, selectOption]
  )

  // --- Async status announcements (per component-rules.md) ---
  useEffect(() => {
    if (isOpen && query) {
      setAnnouncement(getResultAnnouncement(filteredOptions.length, query))
    } else {
      setAnnouncement('')
    }
  }, [isOpen, query, filteredOptions.length])

  // --- Scroll active option into view ---
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return
    const optionEl = listRef.current.querySelector(
      `#${getOptionId(comboboxId, activeIndex)}`
    )
    optionEl?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, comboboxId])

  return {
    status,
    isOpen,
    isEmpty,
    isLoading,
    query,
    filteredOptions,
    activeIndex,
    selectedValue,
    selectedOption,
    announcement,
    setQuery,
    openMenu,
    closeMenu,
    selectOption,
    clearSelection,
    handleInputKeyDown,
    inputRef,
    listRef,
  }
}
