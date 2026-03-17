// helpers.ts — Pure utility functions (per SKILL.md File Structure)
// Co-located with the hook, independently testable

import type { ComboboxOption } from './Combobox'

/**
 * Default filter: case-insensitive substring match on option label
 * Pure function — no side effects
 */
export function defaultFilter(options: ComboboxOption[], query: string): ComboboxOption[] {
  if (!query.trim()) return options
  const lower = query.toLowerCase()
  return options.filter((opt) => opt.label.toLowerCase().includes(lower))
}

/**
 * Generate a stable option ID for aria-activedescendant references
 * Uses the combobox's generated ID + option index for uniqueness
 */
export function getOptionId(comboboxId: string, index: number): string {
  return `${comboboxId}-option-${index}`
}

/**
 * Announce result count for screen readers (returns the announcement text)
 */
export function getResultAnnouncement(count: number, query: string): string {
  if (!query) return ''
  if (count === 0) return 'No results found'
  if (count === 1) return '1 result available'
  return `${count} results available`
}
