---
name: icon-generator
description: Create SVG icons for the MTR Design System with consistent, accessible conventions
---

# Icon Generator

## When to Use

- Creating navigation icons for design system sidebar
- Adding icons for new components
- Creating UI icons (arrows, actions, status indicators)
- Building custom icons for specific features

## File Ownership

| File Path | Purpose |
|-----------|---------|
| `/components/icons/[IconName].tsx` | Icon component |
| `/components/icons/index.ts` | Icon exports |

## Icon Structure

```tsx
// /components/icons/IconName.tsx

import { forwardRef } from 'react'

export interface IconNameProps {
  size?: 'sm' | 'md' | 'lg' | number
  className?: string
}

const sizes = {
  sm: 16,
  md: 20,
  lg: 24,
}

export const IconName = forwardRef<SVGSVGElement, IconNameProps>(
  ({ size = 'md', className, ...props }, ref) => {
    const dimension = typeof size === 'number' ? size : sizes[size]

    return (
      <svg
        ref={ref}
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        {/* SVG paths with stroke="currentColor" */}
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
)

IconName.displayName = 'IconName'
```

## Icon Guidelines

1. **ViewBox**: Use 24x24 viewBox for consistency
2. **Colors**: Use `currentColor` for stroke/fill to inherit text color
3. **Stroke Width**: 1.5px default for outline icons
4. **Stroke Caps**: Round linecap and linejoin
5. **Sizes**: Support sm (16), md (20), lg (24) and custom numbers
6. **Accessibility**: Icons are decorative by default; add aria-label if meaningful

## Icon Categories

- **Navigation**: Home, Settings, Menu, Arrow icons
- **Actions**: Edit, Delete, Add, Remove, Close
- **Status**: Check, Warning, Error, Info
- **Objects**: File, Folder, User, Document
- **Design System**: Colors, Typography, Spacing, Components

## After Creating Icon

1. Export from `/components/icons/index.ts`
2. Add to `iconMap` in `/app/design-system/shared.tsx` if used in navigation
3. Update icons foundation page if publicly documented

## User Input Required

$ARGUMENTS

---

Please describe the icon you need:
- Icon name and purpose
- Visual concept (what should it represent)
- Where it will be used (navigation, component, etc.)
