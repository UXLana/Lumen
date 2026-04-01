import figma from '@figma/code-connect'
import { Button } from './Button'

/**
 * Code Connect mapping: Figma Button → Prism Button
 *
 * Figma variant axes:
 *   - size: Large, Medium (maps to lg, md)
 *   - emphasis: High, Mid, Low
 *   - Parent Icon: true/false
 *   - Text On: true/false
 *   - Child Icon: true/false
 *   - On Dark: True/False
 *   - State: Enabled, Hover, Pressed, Disabled, Focused
 */
figma.connect(
  Button,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=32:24055',
  {
    props: {
      size: figma.enum('size', {
        Large: 'lg',
        Medium: 'md',
      }),
      emphasis: figma.enum('emphasis', {
        High: 'high',
        Mid: 'mid',
        Low: 'low',
      }),
      onDark: figma.enum('On Dark', {
        True: true,
        False: false,
      }),
      disabled: figma.enum('State', {
        Disabled: true,
        '*': false,
      }),
      leftIcon: figma.boolean('Parent Icon'),
      rightIcon: figma.boolean('Child Icon'),
      iconOnly: figma.boolean('Text On', {
        true: false,
        false: true,
      }),
      children: figma.string('Text'),
    },
    example: ({ size, emphasis, onDark, disabled, leftIcon, rightIcon, iconOnly, children }) => (
      <Button
        size={size}
        emphasis={emphasis}
        onDark={onDark}
        disabled={disabled}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        iconOnly={iconOnly}
      >
        {children}
      </Button>
    ),
  }
)

// Destructive Button variant
figma.connect(
  Button,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=32:25414',
  {
    props: {
      emphasis: figma.enum('emphasis', {
        High: 'high',
        Mid: 'mid',
        Low: 'low',
      }),
      disabled: figma.enum('State', {
        Disabled: true,
        '*': false,
      }),
      children: figma.string('Text'),
    },
    example: ({ emphasis, disabled, children }) => (
      <Button
        destructive
        emphasis={emphasis}
        disabled={disabled}
      >
        {children}
      </Button>
    ),
  }
)
