---
name: component-generator
description: Create production-ready React components with TypeScript types, accessibility, and design token integration
---

# Component Generator

## When to Use

- Creating new UI components (Button, Input, Card, etc.)
- Adding variants to existing components
- Building compound components (Tabs, Accordion, etc.)
- Creating form components with validation

## File Ownership

| File Path | Purpose |
|-----------|---------|
| `/components/ui/[ComponentName].tsx` | Component implementation |
| `/components/ui/index.ts` | Component exports |
| `/components/[ComponentName]/` | Complex components with sub-components |

## Component Structure

```tsx
// /components/ui/ComponentName.tsx

'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { colors, spacing, radius } from '@/styles/design-tokens'

export interface ComponentNameProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
}

export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ variant = 'primary', size = 'md', disabled, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          // Variant styles
          variant === 'primary' && 'bg-primary-500 text-white',
          // Size styles
          size === 'md' && 'px-4 py-2',
          // State styles
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ComponentName.displayName = 'ComponentName'
```

## Requirements

1. **TypeScript**: Full type definitions with exported Props interface
2. **Design Tokens**: Use tokens for all visual properties
3. **Accessibility**: ARIA attributes, keyboard navigation, focus states
4. **Variants**: Support common variants (primary, secondary, etc.)
5. **Sizes**: Support size variants (sm, md, lg)
6. **States**: Handle disabled, loading, error states
7. **forwardRef**: Support ref forwarding for DOM access

## Accessibility Checklist

- [ ] Proper semantic HTML elements
- [ ] ARIA labels where needed
- [ ] Keyboard navigation support
- [ ] Focus visible states
- [ ] Screen reader announcements
- [ ] Reduced motion support

---

## Post-Generation Workflow (REQUIRED)

After generating a component, this skill MUST automatically run the following skills in sequence:

### Step 1: Accessibility Audit
```
→ Invoke /design-accessibility [ComponentName]
```
Run a WCAG 2.2 AA compliance audit on the newly created component. Address any Critical or Serious issues before proceeding.

### Step 2: Design System Integration
```
→ Invoke /design-system-builder
```
Add the component to the design system:
- Generate navigation icon via `/icon-generator`
- Update `shared.tsx`: iconMap + navSections
- Update `page.tsx`: componentItems array
- Create documentation page at `/app/components/[name]/page.tsx`

### Workflow Summary

```
Component Generation Complete
         ↓
/design-accessibility [ComponentName]
         ↓ (fix any Critical/Serious issues)
/design-system-builder
         ↓
✓ Component ready for use
```

**CRITICAL**: Do not consider the component generation complete until both post-generation skills have been executed and all accessibility issues are resolved.

---

## User Input Required

$ARGUMENTS

---

Please specify the component you'd like to create, including:
- Component name and purpose
- Required variants and sizes
- Interactive behaviors
- Any specific accessibility requirements
