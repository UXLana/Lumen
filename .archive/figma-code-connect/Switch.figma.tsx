import figma from '@figma/code-connect'
import { Switch } from './Switch'

/**
 * Code Connect mapping: Figma Switch → Lumen Switch
 *
 * Figma variant axes (from Switch 59:32736):
 *   - State: On, Off, Disabled On, Disabled Off
 */
figma.connect(
  Switch,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=59:32736',
  {
    props: {
      checked: figma.enum('State', {
        On: true,
        'Disabled On': true,
        Off: false,
        'Disabled Off': false,
      }),
      disabled: figma.enum('State', {
        'Disabled On': true,
        'Disabled Off': true,
        '*': false,
      }),
    },
    example: ({ checked, disabled }) => (
      <Switch
        label="Toggle setting"
        checked={checked}
        disabled={disabled}
      />
    ),
  }
)
