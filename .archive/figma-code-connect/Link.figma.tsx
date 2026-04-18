import figma from '@figma/code-connect'
import { Link } from './Link'

/**
 * Code Connect mapping: Figma Link → Lumen Link
 *
 * Figma variant axes (from Link 40:65943):
 *   - Size: Small, Medium, Large
 *   - State: Default, Hover, Active, Focused, Visited, Disabled
 *   - External: true/false
 */
figma.connect(
  Link,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=40:65943',
  {
    props: {
      size: figma.enum('Size', {
        Small: 'sm',
        Medium: 'md',
        Large: 'lg',
      }),
      disabled: figma.enum('State', {
        Disabled: true,
        '*': false,
      }),
      external: figma.boolean('External'),
      children: figma.string('Text'),
    },
    example: ({ size, disabled, external, children }) => (
      <Link
        href="#"
        size={size}
        disabled={disabled}
        external={external}
      >
        {children}
      </Link>
    ),
  }
)
