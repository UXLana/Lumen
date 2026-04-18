import figma from '@figma/code-connect'
import { Textarea } from './Textarea'

/**
 * Code Connect mapping: Figma Textarea → Lumen Textarea
 *
 * Figma variant axes (from Textarea 40:63743):
 *   - Height: Labeled, Small (36px), Default (40px), Large (48px)
 *   - State: Enabled, Error, Focused, Disabled, Read Only, Read Only-Focused
 *   - Unlabelled: true/false
 *   - small-font: true/false
 */
figma.connect(
  Textarea,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=40:63743',
  {
    props: {
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
    example: ({ label, disabled, error, readOnly, placeholder }) => (
      <Textarea
        label={label}
        disabled={disabled}
        error={error}
        readOnly={readOnly}
        placeholder={placeholder}
      />
    ),
  }
)
