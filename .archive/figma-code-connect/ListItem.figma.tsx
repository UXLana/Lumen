import figma from '@figma/code-connect'
import { ListItem } from './ListItem'

/**
 * Code Connect mapping: Figma List item → Prism ListItem
 *
 * Figma variant axes (from List item 57:69042):
 *   - State: Enabled, Hover, Pressed, Focused, Disabled, Selected
 *   - Left: None, Avatar, Icon, Checkbox, Radio
 *   - Right: None, Icon Button, Toggle, Icon, Text
 *   - Lines: 1, 2, 3
 *   - Divider: true/false
 */
figma.connect(
  ListItem,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=57:69042',
  {
    props: {
      disabled: figma.enum('State', {
        Disabled: true,
        '*': false,
      }),
      selected: figma.enum('State', {
        Selected: true,
        '*': false,
      }),
      leftType: figma.enum('Left', {
        None: 'none',
        Avatar: 'avatar',
        Icon: 'icon',
        Checkbox: 'checkbox',
        Radio: 'radio',
      }),
      rightType: figma.enum('Right', {
        None: 'none',
        'Icon Button': 'iconButton',
        Toggle: 'toggle',
        Icon: 'icon',
        Text: 'text',
      }),
      lines: figma.enum('Lines', {
        '1': 1,
        '2': 2,
        '3': 3,
      }),
      divider: figma.boolean('Divider'),
      primaryText: figma.string('Primary'),
    },
    example: ({ disabled, selected, leftType, rightType, lines, divider, primaryText }) => (
      <ListItem
        primaryText={primaryText}
        secondaryText="Secondary text"
        leftType={leftType}
        rightType={rightType}
        disabled={disabled}
        selected={selected}
        divider={divider}
      />
    ),
  }
)
