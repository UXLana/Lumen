import figma from '@figma/code-connect'
import { Banner } from './Banner'

/**
 * Code Connect mapping: Figma Assistive message → Prism Banner
 *
 * Note: The Figma "Assistive message" component (32:10882) maps
 * closest to Prism's Banner component for inline feedback messages.
 * Figma variant axes:
 *   - Type: Assistive, Disabled, Error, Error overflow, Warning, Success, Info
 */

// Banner is used for larger feedback messages
// AssistiveMessage is used for form-level helper text
// This mapping covers the Banner component

export const BannerCodeConnect = {
  component: 'Banner',
  import: "import { Banner } from '@/components/Banner/Banner'",
  props: {
    variant: ['info', 'success', 'warning', 'error'],
    size: ['md', 'lg'],
    surface: ['color', 'light'],
  },
  example: `
<Banner
  variant="warning"
  size="md"
  title="Compliance deadline approaching"
  description="License renewal is due within 30 days."
  surface="color"
/>`,
}
