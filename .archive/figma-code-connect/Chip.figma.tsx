import figma from '@figma/code-connect'
import { Chip } from './Chip'

/**
 * Code Connect mapping: Figma Chip → Lumen Chip
 *
 * Figma variant axes (from Chip 32:36400):
 *   - State: Enabled, Hover, Disabled, Dragged, Error
 *   - Selected: true/false
 *   - Left Content: None, Icon, Avatar
 *   - Removable: true/false
 */
figma.connect(
  Chip,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=32:36400',
  {
    props: {
      disabled: figma.enum('State', {
        Disabled: true,
        '*': false,
      }),
      error: figma.enum('State', {
        Error: true,
        '*': false,
      }),
      selected: figma.boolean('Selected'),
      leftContent: figma.enum('Left Content', {
        None: 'none',
        Icon: 'icon',
        Avatar: 'avatar',
      }),
      removable: figma.boolean('Removable'),
      children: figma.string('Label'),
    },
    example: ({ disabled, error, selected, leftContent, removable, children }) => (
      <Chip
        selected={selected}
        disabled={disabled}
        error={error}
        leftContent={leftContent}
        removable={removable}
      >
        {children}
      </Chip>
    ),
  }
)
