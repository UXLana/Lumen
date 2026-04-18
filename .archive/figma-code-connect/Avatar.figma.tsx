import figma from '@figma/code-connect'
import { Avatar } from './Avatar'

/**
 * Code Connect mapping: Figma Avatar → Lumen Avatar
 *
 * Figma variant axes:
 *   - size: XL (96), Large (72), Medium (40), Small (32), XS (24)
 *   - Type: Image, Initials_01–08
 */
figma.connect(
  Avatar,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=32:11739',
  {
    props: {
      size: figma.enum('size', {
        'XL (96)': 'xl',
        'Large (72)': 'lg',
        'Medium (40)': 'md',
        'Small (32)': 'sm',
        'XS (24)': 'xs',
      }),
      color: figma.enum('Type', {
        Initials_01: 1,
        Initials_02: 2,
        Initials_03: 3,
        Initials_04: 4,
        Initials_05: 5,
        Initials_06: 6,
        Initials_07: 7,
        Initials_08: 8,
        Image: undefined,
      }),
    },
    example: ({ size, color }) => (
      <Avatar
        size={size}
        name="Jane Doe"
        color={color}
      />
    ),
  }
)

// Avatar Group
figma.connect(
  Avatar,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=32:11925',
  {
    variant: {},
    example: () => (
      <Avatar
        size="md"
        name="Group member"
        color={1}
      />
    ),
  }
)
