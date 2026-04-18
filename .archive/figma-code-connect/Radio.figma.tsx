import figma from '@figma/code-connect'
import { Radio } from './Radio'

/**
 * Code Connect mapping: Figma Radio item → Lumen Radio
 *
 * Figma variant axes (from Radio item 58:6268):
 *   - State: Enabled, Hover, Active, Focused, Disabled, Error
 *   - Selected: true/false
 *   - Metadata: true/false
 *   - Lines: 1, 2
 */
figma.connect(
  Radio,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=58:6268',
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
      checked: figma.boolean('Selected'),
      label: figma.string('Label'),
      metadata: figma.boolean('Metadata', {
        true: figma.string('Metadata text'),
        false: undefined,
      }),
    },
    example: ({ disabled, error, checked, label, metadata }) => (
      <Radio
        value="option-1"
        label={label}
        checked={checked}
        disabled={disabled}
        error={error}
        metadata={metadata}
      />
    ),
  }
)
