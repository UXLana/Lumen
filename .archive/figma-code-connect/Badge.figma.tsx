import figma from '@figma/code-connect'
import { Badge } from './Badge'

/**
 * Code Connect mapping: Figma Badge → Prism Badge
 *
 * Note: Figma file doesn't have a standalone Badge componentSet
 * in the search results. Badges appear within other components
 * (tabs, cards). This mapping documents the code API so developers
 * inspecting badge-like elements in Figma know what to use.
 *
 * If a Badge componentSet is added to Figma later, update the
 * node-id below.
 */

// Badge is available as a standalone component in code
// Usage documented here for Code Connect reference
export const BadgeCodeConnect = {
  component: 'Badge',
  import: "import { Badge } from '@/components/Badge/Badge'",
  props: {
    variant: ['filled', 'outlined', 'subtle'],
    color: ['neutral', 'success', 'warning', 'error', 'info', 'brand'],
    size: ['sm', 'md'],
  },
  example: `<Badge variant="filled" color="success" size="md">Active</Badge>`,
}
