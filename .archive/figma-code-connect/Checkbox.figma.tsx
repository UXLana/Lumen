import figma from '@figma/code-connect'
import { Checkbox } from './Checkbox'

/**
 * Code Connect mapping: Figma Checkbox Item → Lumen Checkbox
 *
 * Figma variant axes (from Checkbox Item 32:31409):
 *   - State: Enabled, Hover, Active, Focused, Disabled, Error
 *   - Selected: Checked, Unchecked, Indeterminate
 *   - Metadata: true/false
 *   - Lines: 1, 2
 */
figma.connect(
  Checkbox,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=32:31409',
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
      checked: figma.enum('Selected', {
        Checked: true,
        Unchecked: false,
        Indeterminate: false,
      }),
      indeterminate: figma.enum('Selected', {
        Indeterminate: true,
        '*': false,
      }),
      label: figma.string('Label'),
      metadata: figma.boolean('Metadata', {
        true: figma.string('Metadata text'),
        false: undefined,
      }),
    },
    example: ({ disabled, error, checked, indeterminate, label, metadata }) => (
      <Checkbox
        label={label}
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        error={error}
        metadata={metadata}
      />
    ),
  }
)
