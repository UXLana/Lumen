# Metrc Design System

A comprehensive design system built from the Figma Design System, featuring design tokens, reusable components, typography scales, colors, spacing, and more.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the home page.

### Style Guide

Visit [http://localhost:3000/design-system](http://localhost:3000/design-system) to view the complete design system documentation.

### Component Documentation

Each component has its own specification page:
- **Avatar**: [http://localhost:3000/components/avatar](http://localhost:3000/components/avatar)

## Components

Reusable UI components built with design tokens. Import from `@/components`:

### Avatar

Displays a user avatar as either an image or initials with a colored background.

```tsx
import { Avatar, AvatarGroup } from '@/components'

// Image avatar
<Avatar src="/profile.jpg" name="John Doe" size="md" />

// Text avatar (initials)
<Avatar name="Jane Smith" size="lg" color={3} />

// Avatar group
<AvatarGroup
  avatars={[
    { name: "User 1", src: "/user1.jpg" },
    { name: "User 2" },
  ]}
  max={5}
  compact
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image source URL |
| `name` | `string` | `''` | User's name (for initials) |
| `size` | `'xl' \| 'lg' \| 'md' \| 'sm' \| 'xs'` | `'md'` | Avatar size |
| `color` | `1-8` | auto | Color variant for initials |
| `focused` | `boolean` | `false` | Show focus ring |
| `onDark` | `boolean` | `false` | Border for dark surfaces |

## Design Tokens

All design tokens are located in `styles/design-tokens.ts` and include:

- **Colors**: Brand, primary, secondary, neutral, semantic, text, background, and border colors
- **Typography**: Display, heading, body, label, and code styles with DM Sans and JetBrains Mono
- **Spacing**: 4px-based spacing scale with semantic aliases
- **Border Radius**: Scale from none to full with semantic mappings
- **Shadows**: Elevation shadows for depth and visual hierarchy
- **Breakpoints**: Responsive breakpoints for adaptive layouts
- **Z-Index**: Layer management for stacking context
- **Transitions**: Duration and timing presets
- **Avatar**: Component-specific tokens (sizes, colors, typography)

### Usage

```typescript
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  avatar,
  theme,
} from '@/styles/design-tokens'

function MyComponent() {
  return (
    <div style={{
      background: colors.background.default,
      padding: spacing[6],
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
      ...typography.body.md,
    }}>
      Content
    </div>
  )
}
```

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout with font imports
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── design-system/
│   │   └── page.tsx         # Design system documentation
│   └── components/
│       └── avatar/
│           └── page.tsx     # Avatar specification page
├── components/
│   ├── index.ts             # Component exports
│   └── Avatar/
│       ├── Avatar.tsx       # Avatar & AvatarGroup components
│       └── index.ts         # Avatar exports
├── styles/
│   └── design-tokens.ts     # All design tokens
├── package.json
├── tsconfig.json
└── next.config.js
```

## Font Stack

- **Display & Body**: DM Sans (Google Fonts)
- **Code**: JetBrains Mono (Google Fonts)


