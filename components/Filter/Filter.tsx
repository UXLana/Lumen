'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react'
import {
  colors,
  spacing,
  typography,
  fontWeights,
} from '../../styles/design-tokens'
import { Accordion, AccordionItem } from '../Accordion'
import { Checkbox } from '../Checkbox'
import { Radio } from '../Radio'

// =============================================================================
// TYPES
// =============================================================================

export type FilterValue = string | string[] | undefined

export type FilterValues = Record<string, FilterValue>

export interface FilterProps {
  /** Stable id for the filter (used for ARIA region label) */
  id?: string
  /** Controlled values keyed by section/control id */
  values?: FilterValues
  /** Default values for uncontrolled mode */
  defaultValues?: FilterValues
  /** Called whenever any value changes (controlled or uncontrolled) */
  onChange?: (values: FilterValues) => void
  /** Sections expanded by default — defaults to all */
  defaultExpandedIds?: string[]
  /** Compound children (Filter.Section, etc.) */
  children: React.ReactNode
  /** Additional inline styles applied to the root */
  style?: React.CSSProperties
  /** Additional className applied to the root */
  className?: string
}

interface FilterContextValue {
  values: FilterValues
  setValue: (id: string, next: FilterValue) => void
  clearValue: (id: string) => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

function useFilterContext(componentName: string): FilterContextValue {
  const ctx = useContext(FilterContext)
  if (!ctx) {
    throw new Error(`${componentName} must be used inside <Filter>`)
  }
  return ctx
}

// Recursively walk children — supports fragments, arrays, and conditional wrappers
function collectSectionDefaults(node: React.ReactNode, ids: string[]) {
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement(child)) return
    if (child.type === FilterSection) {
      const props = child.props as FilterSectionProps
      if (props.defaultExpanded ?? true) ids.push(props.id)
      return
    }
    const childProps = child.props as { children?: React.ReactNode }
    if (childProps.children) collectSectionDefaults(childProps.children, ids)
  })
}

// =============================================================================
// ROOT
// =============================================================================

function FilterRoot({
  id: providedId,
  values: controlledValues,
  defaultValues,
  onChange,
  defaultExpandedIds,
  children,
  style,
  className,
}: FilterProps) {
  const generatedId = useId()
  const filterId = providedId ?? generatedId

  const isControlled = controlledValues !== undefined
  const [internalValues, setInternalValues] = useState<FilterValues>(
    defaultValues ?? {},
  )
  const values = isControlled ? controlledValues! : internalValues

  const setValue = useCallback(
    (id: string, next: FilterValue) => {
      const merged = { ...values, [id]: next }
      if (!isControlled) setInternalValues(merged)
      onChange?.(merged)
    },
    [values, isControlled, onChange],
  )

  const clearValue = useCallback(
    (id: string) => {
      const { [id]: _omit, ...rest } = values
      if (!isControlled) setInternalValues(rest)
      onChange?.(rest)
    },
    [values, isControlled, onChange],
  )

  const ctx = useMemo<FilterContextValue>(
    () => ({ values, setValue, clearValue }),
    [values, setValue, clearValue],
  )

  const collectedDefaultIds = useMemo(() => {
    if (defaultExpandedIds) return defaultExpandedIds
    const ids: string[] = []
    collectSectionDefaults(children, ids)
    return ids
  }, [children, defaultExpandedIds])

  return (
    <FilterContext.Provider value={ctx}>
      <div
        id={filterId}
        role="region"
        aria-label="Filters"
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          ...style,
        }}
      >
        <Accordion
          variant="eyebrow"
          allowMultiple
          fullWidth
          defaultExpandedIds={collectedDefaultIds}
        >
          {children}
        </Accordion>
      </div>
    </FilterContext.Provider>
  )
}

FilterRoot.displayName = 'Filter'

// =============================================================================
// SECTION
// =============================================================================

export interface FilterSectionProps {
  /** Stable id used for state and ARIA wiring */
  id: string
  /** Section title (rendered as uppercase eyebrow) */
  title: string
  /** Whether this section starts expanded — read once on mount by the parent Filter */
  defaultExpanded?: boolean
  /** Section content (Filter.Checkbox, Filter.Radio, Filter.ClearAll) */
  children: React.ReactNode
}

function FilterSection({ id, title, children }: FilterSectionProps) {
  // Verify we're inside a <Filter> root so child controls have context
  useFilterContext('Filter.Section')

  return (
    <AccordionItem id={id} title={title}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing['2xs'],
        }}
      >
        {children}
      </div>
    </AccordionItem>
  )
}

FilterSection.displayName = 'Filter.Section'

// =============================================================================
// META LABEL — shared right-aligned count for Checkbox/Radio rows
// =============================================================================

function MetaLabel({
  text,
  active,
  disabled,
  describesId,
}: {
  text: React.ReactNode
  active: boolean
  disabled?: boolean
  describesId: string
}) {
  return (
    <span
      id={describesId}
      style={{
        ...typography.body.sm,
        color: disabled
          ? colors.text.disabled.onLight
          : active
            ? colors.brand.default
            : colors.text.lowEmphasis.onLight,
        fontWeight: active ? fontWeights.semibold : fontWeights.regular,
        flexShrink: 0,
      }}
    >
      {text}
    </span>
  )
}

// =============================================================================
// CHECKBOX ITEM
// =============================================================================

export interface FilterCheckboxProps {
  /** Section id this checkbox belongs to (its values are stored as string[]) */
  sectionId: string
  /** The value contributed when checked */
  value: string
  /** Visible label */
  label: string
  /** Right-aligned secondary text (count, currency, etc.) — read by screen readers after the label */
  metaLabel?: React.ReactNode
  /** Disable the row */
  disabled?: boolean
}

function FilterCheckboxItem({
  sectionId,
  value,
  label,
  metaLabel,
  disabled,
}: FilterCheckboxProps) {
  const ctx = useFilterContext('Filter.Checkbox')
  const metaId = useId()
  const current = ctx.values[sectionId]
  const selected: string[] = Array.isArray(current) ? current : []
  const checked = selected.includes(value)

  const handleChange = useCallback(
    (next: boolean) => {
      const nextValues = next
        ? [...selected, value]
        : selected.filter((v) => v !== value)
      ctx.setValue(sectionId, nextValues)
    },
    [ctx, sectionId, selected, value],
  )

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
      }}
    >
      <Checkbox
        label={label}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        aria-describedby={metaLabel !== undefined ? metaId : undefined}
      />
      {metaLabel !== undefined && (
        <MetaLabel
          text={metaLabel}
          active={checked}
          disabled={disabled}
          describesId={metaId}
        />
      )}
    </div>
  )
}

FilterCheckboxItem.displayName = 'Filter.Checkbox'

// =============================================================================
// RADIO ITEM
// =============================================================================

export interface FilterRadioProps {
  /** Section id (its value is stored as string) */
  sectionId: string
  /** The value contributed when selected */
  value: string
  /** Visible label */
  label: string
  /** Right-aligned secondary text — read by screen readers after the label */
  metaLabel?: React.ReactNode
  /** Disable the row */
  disabled?: boolean
}

function FilterRadioItem({
  sectionId,
  value,
  label,
  metaLabel,
  disabled,
}: FilterRadioProps) {
  const ctx = useFilterContext('Filter.Radio')
  const metaId = useId()
  const current = ctx.values[sectionId]
  const selected = typeof current === 'string' ? current : ''
  const checked = selected === value

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
      }}
    >
      <Radio
        name={sectionId}
        value={value}
        label={label}
        checked={checked}
        onChange={(next) => ctx.setValue(sectionId, next)}
        disabled={disabled}
        aria-describedby={metaLabel !== undefined ? metaId : undefined}
      />
      {metaLabel !== undefined && (
        <MetaLabel
          text={metaLabel}
          active={checked}
          disabled={disabled}
          describesId={metaId}
        />
      )}
    </div>
  )
}

FilterRadioItem.displayName = 'Filter.Radio'

// =============================================================================
// CLEAR ALL — clears a single section, or all sections when no sectionId given
// =============================================================================

export interface FilterClearAllProps {
  /** When set, clears only this section. Otherwise clears all values. */
  sectionId?: string
  /** Override the link label */
  label?: string
}

const CLEAR_ALL_CLASS = 'lumen-filter-clear-all'
const clearAllStyles = `
.${CLEAR_ALL_CLASS} {
  align-self: flex-start;
  margin-top: ${spacing.xs};
  background: transparent;
  border: none;
  cursor: pointer;
  padding: ${spacing['2xs']} ${spacing['2xs']};
  margin-left: -${spacing['2xs']};
  color: ${colors.text.highEmphasis.onLight};
  font-family: ${typography.body.sm.fontFamily};
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  font-weight: ${fontWeights.semibold};
  border-radius: 4px;
  transition: color 150ms ease, box-shadow 150ms ease;
}
.${CLEAR_ALL_CLASS}:hover {
  color: ${colors.brand.default};
}
.${CLEAR_ALL_CLASS}:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px ${colors.brand.default};
}
`

function FilterClearAll({
  sectionId,
  label = 'Clear all',
}: FilterClearAllProps) {
  const ctx = useFilterContext('Filter.ClearAll')

  const handleClick = () => {
    if (sectionId) {
      ctx.clearValue(sectionId)
      return
    }
    Object.keys(ctx.values).forEach((k) => ctx.clearValue(k))
  }

  return (
    <>
      <style>{clearAllStyles}</style>
      <button
        type="button"
        className={CLEAR_ALL_CLASS}
        onClick={handleClick}
      >
        {label}
      </button>
    </>
  )
}

FilterClearAll.displayName = 'Filter.ClearAll'

// =============================================================================
// COMPOUND EXPORT
// =============================================================================

type FilterCompound = typeof FilterRoot & {
  Section: typeof FilterSection
  Checkbox: typeof FilterCheckboxItem
  Radio: typeof FilterRadioItem
  ClearAll: typeof FilterClearAll
}

const Filter = FilterRoot as FilterCompound
Filter.Section = FilterSection
Filter.Checkbox = FilterCheckboxItem
Filter.Radio = FilterRadioItem
Filter.ClearAll = FilterClearAll

export { Filter }
