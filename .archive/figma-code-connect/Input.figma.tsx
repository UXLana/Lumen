import figma from '@figma/code-connect'
import { Input } from './Input'

/**
 * Code Connect mapping: Figma Input → Lumen Input
 *
 * Figma variant axes:
 *   - Height: Labeled, Small (36px), Default (40px), Large (48px)
 *   - State: Enabled, Error, Focused, Disabled, Read Only, Read Only-Focused
 *   - Unlabelled: true/false
 *   - small-font: true/false
 */
figma.connect(
  Input,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=40:63290',
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
      readOnly: figma.enum('State', {
        'Read Only': true,
        'Read Only-Focused': true,
        '*': false,
      }),
      placeholder: figma.string('Placeholder'),
    },
    example: ({ size, label, disabled, error, readOnly, placeholder }) => (
      <Input
        size={size}
        label={label}
        disabled={disabled}
        error={error}
        readOnly={readOnly}
        placeholder={placeholder}
      />
    ),
  }
)
