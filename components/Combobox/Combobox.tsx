'use client'
// 'use client': hooks (useId, useEffect, useCallback), event handlers, browser APIs
// Per SKILL.md: "Apply per file... binding handlers in rendered JSX requires a client component"

import React, { forwardRef, useId, useEffect, useCallback } from 'react'
import {
  colors,
  spacing,
  borderRadius,
  typography,
  fontFamilies,
  fontWeights,
  shadows,
  transitionPresets,
} from '../../styles/design-tokens'
// Per SKILL.md Audit: "Prefer existing icon library over inline SVGs"
import {
  IconChevronDown,
  IconX,
  IconLoader,
  IconSearch,
  IconCheck,
} from '../Icons'
import { useCombobox } from './useCombobox'
import { getOptionId } from './helpers'
import type { ComboboxStatus, UseComboboxReturn } from './useCombobox'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

export interface ComboboxOption {
  /** Stable unique value — used as key, never array index (per component-rules.md Collection) */
  value: string
  /** Display label */
  label: string
  /** Disable this option */
  disabled?: boolean
}

// Per SKILL.md: extend the matching HTML attributes interface
export interface ComboboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'onSelect' | 'size'> {
  /** Available options */
  options: ComboboxOption[]
  /** Controlled selected value */
  value?: string | null
  /** Default selected value (uncontrolled) */
  defaultValue?: string | null
  /** Callback when selection changes */
  onSelect?: (value: string | null, option: ComboboxOption | null) => void
  /** Callback when search query changes (for async filtering) */
  onQueryChange?: (query: string) => void
  /** Custom filter function */
  filterFn?: (options: ComboboxOption[], query: string) => ComboboxOption[]
  /** Options are loading (async search) */
  loading?: boolean
  /** Field label — per Template B (Form Field) */
  label: string
  /** Helper text — per Template B */
  helperText?: string
  /** Error message — per Template B */
  error?: string
  /** Placeholder text */
  placeholder?: string
  /** No results message */
  emptyMessage?: string
  /** Floating label: places the label inside the input container (per Figma Combobox spec) */
  floatingLabel?: boolean
}

// =============================================================================
// STATUS → ICON MAPPING (per component-rules.md Component & Icon Mapping)
//
// "When a variant or status determines which component or icon to render,
// use a typed map"
// =============================================================================

const statusEndIconMap: Record<ComboboxStatus, React.ComponentType<any> | null> = {
  idle: IconChevronDown,
  open: IconChevronDown,
  loading: IconLoader,
  empty: IconChevronDown,
}

// =============================================================================
// COMPONENT (per SKILL.md forwardRef, displayName)
// =============================================================================

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      value,
      defaultValue,
      onSelect,
      onQueryChange,
      filterFn,
      loading = false,
      label,
      helperText,
      error,
      placeholder = 'Search...',
      emptyMessage = 'No results found',
      floatingLabel = false,
      disabled,
      className,
      style,
      id: idProp,
      'aria-describedby': externalDescribedBy,
      ...rest
    },
    ref
  ) => {
    // Per SKILL.md Form Association: "Use React.useId() for SSR-safe ID generation"
    const reactId = useId()
    const comboboxId = idProp ?? reactId
    const helperId = helperText ? `${comboboxId}-helper` : undefined
    const errorId = error ? `${comboboxId}-error` : undefined
    const listboxId = `${comboboxId}-listbox`

    // Per SKILL.md Form Association: "Merge consumer-provided aria-describedby"
    const describedByParts = [
      externalDescribedBy,
      error ? errorId : helperId,
    ].filter(Boolean).join(' ') || undefined

    // Per SKILL.md Hook Extraction: complex logic → custom hook
    const cb = useCombobox({
      options,
      value,
      defaultValue,
      onSelect,
      onQueryChange,
      filterFn,
      loading,
      comboboxId,
    })

    // Forward ref to input
    useEffect(() => {
      if (ref && typeof ref === 'function') {
        ref(cb.inputRef.current)
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = cb.inputRef.current
      }
    }, [ref, cb.inputRef])

    // Per component-rules.md Escape to Dismiss: close on outside click
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLDivElement>) => {
        // Only close if focus moves outside the combobox container
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          cb.closeMenu()
        }
      },
      [cb.closeMenu]
    )

    // Token paths — verified against actual design-tokens.ts (per SKILL.md Token Compliance:
    // "Token paths shown in this skill are illustrative — use the actual export names")
    const textColor = disabled
      ? colors.text?.disabled?.onLight
      : colors.text?.highEmphasis?.onLight

    const secondaryColor = colors.text?.lowEmphasis?.onLight
    const errorColor = colors.status?.important
    const focusBorderColor = '#3086BF' // Figma: Focus/focusBorder_onLight
    const borderColor = error
      ? errorColor
      : cb.isOpen
        ? (floatingLabel ? focusBorderColor : colors.brand.default)
        : colors.border?.midEmphasis?.onLight

    const StatusEndIcon = statusEndIconMap[cb.status]

    // Floating label: whether the label should be in the "floated" (small, top) position
    const hasValue = !!cb.query || !!cb.selectedValue
    const isFloated = floatingLabel && (cb.isOpen || hasValue)

    return (
      <div
        className={className}
        style={{ position: 'relative', width: '100%', ...style }}
        onBlur={handleBlur}
      >
        {/* Label — outside container (standard mode) */}
        {!floatingLabel && (
          <label
            htmlFor={comboboxId}
            style={{
              display: 'block',
              ...typography.label.md,
              fontFamily: fontFamilies.body,
              fontWeight: fontWeights.medium,
              color: disabled ? colors.text?.disabled?.onLight : colors.text?.highEmphasis?.onLight,
              marginBottom: spacing['2xs'],
            }}
          >
            {label}
          </label>
        )}

        {/* Input container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: floatingLabel ? spacing.xs : spacing['2xs'],
            padding: floatingLabel ? '7px 10px' : `${spacing.xs} ${spacing.sm}`,
            border: `${error && floatingLabel ? '2px' : '1px'} solid ${borderColor}`,
            borderRadius: floatingLabel ? '8px' : borderRadius.sm,
            backgroundColor: disabled
              ? colors.surface?.disabled?.onLight
              : colors.surface?.light,
            boxShadow: cb.isOpen && floatingLabel ? `inset 0 0 0 2px ${focusBorderColor}` : 'none',
            transition: `border-color ${transitionPresets.fast}, box-shadow ${transitionPresets.fast}`,
            cursor: disabled ? 'not-allowed' : 'text',
            minHeight: floatingLabel ? '56px' : undefined,
          }}
          onClick={(e) => {
            if (!disabled && floatingLabel) {
              // Only open if clicking the container itself, not child buttons
              const target = e.target as HTMLElement
              if (target.closest('button')) return
              cb.inputRef.current?.focus()
              cb.openMenu()
            }
          }}
        >
          {/* Search icon (standard mode only) */}
          {!floatingLabel && (
            <IconSearch
              size="sm"
              style={{ color: secondaryColor, flexShrink: 0 }}
            />
          )}

          {/* Floating label: label + input stacked vertically inside the container */}
          {floatingLabel ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, minHeight: '40px' }}>
              {/* Floating label text */}
              <label
                htmlFor={comboboxId}
                style={{
                  fontSize: isFloated ? '12px' : '16px',
                  lineHeight: isFloated ? '16px' : '24px',
                  fontFamily: fontFamilies.body,
                  fontWeight: fontWeights.regular,
                  color: error
                    ? errorColor
                    : cb.isOpen
                      ? focusBorderColor
                      : secondaryColor,
                  transition: `font-size ${transitionPresets.fast}, line-height ${transitionPresets.fast}, color ${transitionPresets.fast}`,
                  cursor: disabled ? 'not-allowed' : 'text',
                  pointerEvents: 'none',
                }}
              >
                {label}
              </label>

              {/* Input field — always in DOM, visibility controlled by floated state */}
              <input
                ref={cb.inputRef}
                id={comboboxId}
                role="combobox"
                aria-expanded={cb.isOpen}
                aria-controls={cb.isOpen ? listboxId : undefined}
                aria-activedescendant={
                  cb.isOpen && cb.activeIndex >= 0
                    ? getOptionId(comboboxId, cb.activeIndex)
                    : undefined
                }
                aria-autocomplete="list"
                aria-haspopup="listbox"
                aria-invalid={!!error || undefined}
                aria-describedby={describedByParts}
                aria-errormessage={error ? errorId : undefined}
                aria-busy={loading || undefined}
                disabled={disabled}
                placeholder={cb.isOpen && !hasValue ? placeholder : undefined}
                value={cb.query}
                onChange={(e) => cb.setQuery(e.target.value)}
                onFocus={() => !disabled && cb.openMenu()}
                onKeyDown={cb.handleInputKeyDown}
                autoComplete="off"
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '-0.35px',
                  fontFamily: fontFamilies.body,
                  fontWeight: fontWeights.regular,
                  color: textColor,
                  minWidth: 0,
                  width: '100%',
                  padding: 0,
                  height: isFloated ? '24px' : 0,
                  opacity: isFloated ? 1 : 0,
                  overflow: 'hidden',
                  transition: `height ${transitionPresets.fast}, opacity ${transitionPresets.fast}`,
                }}
                {...rest}
              />
            </div>
          ) : (
            /* Standard mode: flat input */
            <input
              ref={cb.inputRef}
              id={comboboxId}
              role="combobox"
              aria-expanded={cb.isOpen}
              aria-controls={cb.isOpen ? listboxId : undefined}
              aria-activedescendant={
                cb.isOpen && cb.activeIndex >= 0
                  ? getOptionId(comboboxId, cb.activeIndex)
                  : undefined
              }
              aria-autocomplete="list"
              aria-haspopup="listbox"
              aria-invalid={!!error || undefined}
              aria-describedby={describedByParts}
              aria-errormessage={error ? errorId : undefined}
              aria-busy={loading || undefined}
              disabled={disabled}
              placeholder={placeholder}
              value={cb.query}
              onChange={(e) => cb.setQuery(e.target.value)}
              onFocus={() => !disabled && cb.openMenu()}
              onKeyDown={cb.handleInputKeyDown}
              autoComplete="off"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                ...typography.body.sm,
                fontFamily: fontFamilies.body,
                color: textColor,
                minWidth: 0,
              }}
              {...rest}
            />
          )}

          {/* Trailing actions: clear button + divider + caret (always same width) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            flexShrink: 0,
          }}>
            {/* Clear button — shown automatically when a value is selected */}
            {cb.selectedValue && !disabled ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  cb.clearSelection()
                }}
                aria-label="Clear selection"
                tabIndex={-1}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: `${spacing['2xs']} ${spacing.xs}`,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: secondaryColor,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <IconX size="xs" />
              </button>
            ) : (
              /* Spacer to maintain consistent width when clear is hidden */
              <div style={{ width: floatingLabel ? '28px' : 0 }} />
            )}

            {/* Low emphasis divider between clear and caret */}
            {floatingLabel && (
              <div style={{
                width: '1px',
                alignSelf: 'stretch',
                minHeight: '24px',
                backgroundColor: colors.border?.lowEmphasis?.onLight,
                flexShrink: 0,
              }} />
            )}

            {/* Caret / trailing icon */}
            {floatingLabel ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!disabled) {
                    cb.inputRef.current?.focus()
                    if (cb.isOpen) cb.closeMenu()
                    else cb.openMenu()
                  }
                }}
                aria-label={cb.isLoading ? 'Loading' : cb.isOpen ? 'Close dropdown' : 'Open dropdown'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: spacing['2xs'],
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderRadius: '50px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                }}
              >
                {cb.isLoading ? (
                  <IconLoader
                    size="sm"
                    style={{
                      color: secondaryColor,
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                ) : (
                  <IconChevronDown
                    size="sm"
                    style={{
                      color: textColor,
                      transform: cb.isOpen ? 'rotate(180deg)' : 'none',
                      transition: `transform ${transitionPresets.fast}`,
                    }}
                  />
                )}
              </button>
            ) : (
              StatusEndIcon && (
                <StatusEndIcon
                  size="sm"
                  style={{
                    color: secondaryColor,
                    flexShrink: 0,
                    transform: cb.isOpen ? 'rotate(180deg)' : 'none',
                    transition: `transform ${transitionPresets.fast}`,
                    ...(cb.isLoading ? { animation: 'spin 1s linear infinite' } : {}),
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Helper text — per Template B (Form Field) */}
        {helperText && !error && (
          <span
            id={helperId}
            style={{
              display: 'block',
              ...typography.body.xs,
              fontFamily: fontFamilies.body,
              color: secondaryColor,
              marginTop: spacing['2xs'],
            }}
          >
            {helperText}
          </span>
        )}

        {/* Error message — per Template B: role="alert" */}
        {error && (
          <span
            id={errorId}
            role="alert"
            style={{
              display: 'block',
              ...typography.body.xs,
              fontFamily: fontFamilies.body,
              color: errorColor,
              marginTop: spacing['2xs'],
            }}
          >
            {error}
          </span>
        )}

        {/* Dropdown listbox — per Template C overlay pattern, Escape to dismiss */}
        {cb.isOpen && (
          <ul
            ref={cb.listRef}
            id={listboxId}
            role="listbox"
            aria-label={label}
            onMouseDown={(e) => e.preventDefault()}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: spacing['2xs'],
              padding: spacing['2xs'],
              listStyle: 'none',
              border: `1px solid ${colors.border?.lowEmphasis?.onLight}`,
              borderRadius: borderRadius.sm,
              backgroundColor: colors.surface?.light,
              boxShadow: shadows.lg,
              maxHeight: '240px',
              overflowY: 'auto',
              zIndex: 100,
            }}
          >
            {/* Loading state */}
            {cb.isLoading && (
              <li
                style={{
                  padding: spacing.sm,
                  ...typography.body.sm,
                  fontFamily: fontFamilies.body,
                  color: secondaryColor,
                  textAlign: 'center',
                }}
              >
                Loading...
              </li>
            )}

            {/* Empty state */}
            {cb.isEmpty && (
              <li
                style={{
                  padding: spacing.sm,
                  ...typography.body.sm,
                  fontFamily: fontFamilies.body,
                  color: secondaryColor,
                  textAlign: 'center',
                }}
              >
                {emptyMessage}
              </li>
            )}

            {/* Options — per component-rules.md Collection Rendering: stable keys */}
            {!cb.isLoading &&
              cb.filteredOptions.map((option, index) => {
                const isActive = index === cb.activeIndex
                const isSelected = option.value === cb.selectedValue
                const isDisabled = option.disabled

                return (
                  <li
                    key={option.value}
                    id={getOptionId(comboboxId, index)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={isDisabled || undefined}
                    onClick={() => !isDisabled && cb.selectOption(option)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: borderRadius.xs,
                      ...typography.body.sm,
                      fontFamily: fontFamilies.body,
                      color: isDisabled
                        ? colors.text?.disabled?.onLight
                        : colors.text?.highEmphasis?.onLight,
                      backgroundColor: isActive
                        ? colors.selectedHighlight
                        : 'transparent',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      transition: `background-color ${transitionPresets.fast}`,
                    }}
                  >
                    <span style={{ flex: 1 }}>{option.label}</span>
                    {isSelected && (
                      <IconCheck
                        size="sm"
                        style={{ color: colors.brand.default, flexShrink: 0 }}
                      />
                    )}
                  </li>
                )
              })}
          </ul>
        )}

        {/* Async status announcement — per component-rules.md Async Status Announcements:
            "Place the live region in the DOM on mount — only change its text content" */}
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
          }}
        >
          {cb.announcement}
        </div>
      </div>
    )
  }
)

Combobox.displayName = 'Combobox'
