import figma from '@figma/code-connect'
import { Select } from './Select'

/**
 * Code Connect mapping: Figma Select → Lumen Select
 *
 * Figma variant axes (from Select component 58:16233):
 *   - Height: Small (36px), Default (40px), Large (48px), Labeled
 *   - State: Enabled, Open, Error, Focused, Disabled
 *   - Unlabelled: true/false
 */
figma.connect(
  Select,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=58:16233',
  {
    props: {
      size: figma.enum('Height', {
        'Small (36px)': 'sm',
        'Default (40px)': 'md',
        'Large (48px)': 'lg',
        Labeled: 'md',
      }),
      label: figma.enum('Unlabelled', {
        false: figma.string('Label'),
        true: undefined,
      }),
      disabled: figma.enum('State', {
        Disabled: true,
        '*': false,
      }),
      error: figma.enum('State', {
        Error: true,
        '*': false,
      }),
      placeholder: figma.string('Placeholder'),
    },
    example: ({ size, label, disabled, error, placeholder }) => (
      <Select
        size={size}
        label={label}
        disabled={disabled}
        error={error}
        placeholder={placeholder}
        options={[
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ]}
      />
    ),
  }
)
