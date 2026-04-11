/**
 * Shared accessibility utilities.
 *
 * Keeps a11y patterns consistent across components — when we have 2+ places
 * that need the same a11y treatment, the helper lives here instead of being
 * copy-pasted into each component.
 */

import type { CSSProperties } from 'react'

/**
 * Visually-hidden style block — makes content invisible to sighted users
 * while remaining available to assistive technology (screen readers).
 *
 * Preferred over `display: none` or `visibility: hidden`, which also hide
 * content from screen readers. This is the canonical "sr-only" CSS pattern
 * used in frameworks like Bootstrap and Tailwind.
 *
 * @example
 * ```tsx
 * <table style={srOnlyStyle}>
 *   // ... data table only screen readers see
 * </table>
 * ```
 */
export const srOnlyStyle: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
}
