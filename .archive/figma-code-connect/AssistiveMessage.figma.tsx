import figma from '@figma/code-connect'
import { AssistiveMessage } from './AssistiveMessage'

/**
 * Code Connect mapping: Figma Assistive message → Prism AssistiveMessage
 *
 * Figma variant axes (from Assistive message 32:10882):
 *   - Type: Assistive, Disabled, Error, Error overflow, Warning, Success, Info
 */
figma.connect(
  AssistiveMessage,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=32:10882',
  {
    props: {
      type: figma.enum('Type', {
        Assistive: 'assistive',
        Disabled: 'disabled',
        Error: 'error',
        'Error overflow': 'error-overflow',
        Warning: 'warning',
        Success: 'success',
        Info: 'info',
      }),
      children: figma.string('Text'),
      counter: figma.string('Counter'),
    },
    example: ({ type, children, counter }) => (
      <AssistiveMessage type={type} counter={counter}>
        {children}
      </AssistiveMessage>
    ),
  }
)
