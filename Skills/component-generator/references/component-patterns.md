# Component Patterns Reference

Patterns and conventions for building MTR Design System components.

## File Structure

```
/components/
  ComponentName/
    ComponentName.tsx    # Main component with 'use client'
    index.ts             # Re-exports
```

### index.ts Pattern

```tsx
export { ComponentName } from './ComponentName'
export type { ComponentNameProps } from './ComponentName'
```

## Component Architecture

### forwardRef Pattern

All components MUST use forwardRef for ref forwarding:

```tsx
export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  (props, ref) => {
    return <div ref={ref} {...props} />
  }
)

Component.displayName = 'Component'
```

### Props Interface

Extend appropriate HTML element attributes:

```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
  // Custom props...
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'none' | 'sm' | 'md' | 'lg'
  // Custom props...
}
```

### Default Props

Always provide sensible defaults:

```tsx
const {
  size = 'md',
  variant = 'primary',
  disabled = false,
  ...props
} = props
```

## State Management

### Hover/Press Pattern

Standard pattern for interactive states:

```tsx
const [isHovered, setIsHovered] = useState(false)
const [isPressed, setIsPressed] = useState(false)
const [isFocused, setIsFocused] = useState(false)

const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
  if (!disabled) setIsHovered(true)
  onMouseEnter?.(e)
}

const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
  setIsHovered(false)
  setIsPressed(false)
  onMouseLeave?.(e)
}

const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
  if (!disabled) setIsPressed(true)
  onMouseDown?.(e)
}

const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
  setIsPressed(false)
  onMouseUp?.(e)
}

const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
  setIsFocused(true)
  onFocus?.(e)
}

const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
  setIsFocused(false)
  onBlur?.(e)
}
```

### State-Based Colors

Pattern for determining colors based on state:

```tsx
const getStateColors = () => {
  if (disabled) return colorScheme.disabled
  if (isPressed) return colorScheme.pressed
  if (isHovered) return colorScheme.hover
  return colorScheme.enabled
}
```

## Size Configurations

Standard size config pattern:

```tsx
const sizeConfig = {
  sm: {
    height: '32px',
    padding: `${spacing[2]} ${spacing[3]}`,
    fontSize: typography.body.sm.fontSize,
    iconSize: '16px',
  },
  md: {
    height: '40px',
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.body.md.fontSize,
    iconSize: '20px',
  },
  lg: {
    height: '48px',
    padding: `${spacing[4]} ${spacing[5]}`,
    fontSize: typography.body.lg.fontSize,
    iconSize: '24px',
  },
}
```

## Focus Ring Pattern

Standard focus ring for accessibility:

```tsx
const focusRingStyles: React.CSSProperties = {
  position: 'absolute',
  inset: '-3px',
  borderRadius: borderRadius.md,
  border: '3px solid #3086BF',  // Standard focus color
  pointerEvents: 'none',
}

// In render
{isFocused && !disabled && <span style={focusRingStyles} />}
```

## Dark Mode Support

Pattern for onDark prop:

```tsx
const getColors = () => {
  if (onDark) {
    return {
      background: isHovered ? 'rgba(255,255,255,0.1)' : 'transparent',
      text: colors.text.highEmphasisOnDark,
      border: 'rgba(255,255,255,0.2)',
    }
  }
  return {
    background: isHovered ? colors.neutral[100] : colors.background.default,
    text: colors.text.highEmphasis,
    border: colors.border.light,
  }
}
```

## Loading State Pattern

Pattern for components with loading state:

```tsx
const LoadingSpinner = () => (
  <span
    style={{
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }}
  />
)

// In render
{loading ? (
  <LoadingSpinner />
) : (
  children
)}
```

## Compound Components

Pattern for components with subcomponents:

```tsx
// Card.tsx
export const Card = forwardRef<HTMLDivElement, CardProps>(...)
Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(...)
CardHeader.displayName = 'Card.Header'

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(...)
CardBody.displayName = 'Card.Body'

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(...)
CardFooter.displayName = 'Card.Footer'

// Attach subcomponents
const CardNamespace = Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})

export { CardNamespace as Card }
```

## Controlled vs Uncontrolled

Pattern for components that can be both:

```tsx
interface InputProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ value, defaultValue, onChange, ...props }, ref) => {
    // Determine if controlled
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = useState(defaultValue ?? '')

    const currentValue = isControlled ? value : internalValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value)
      }
      onChange?.(e.target.value)
    }

    return (
      <input
        ref={ref}
        value={currentValue}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
```

## Common Prop Types

### Size

```tsx
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
```

### Variant

```tsx
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
export type BannerVariant = 'info' | 'success' | 'warning' | 'error'
```

### Emphasis

```tsx
export type ButtonEmphasis = 'high' | 'mid' | 'low'
```

### Status

```tsx
export type Status = 'idle' | 'loading' | 'success' | 'error'
```

## Accessibility Patterns

### Keyboard Navigation

```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (disabled) return

  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault()
      handleClick()
      break
    case 'Escape':
      handleClose?.()
      break
  }
}
```

### ARIA Attributes

```tsx
// Disabled state
aria-disabled={disabled}

// Loading state
aria-busy={loading}

// Expandable
aria-expanded={isOpen}

// Has popup
aria-haspopup="menu"

// Selected
aria-selected={isSelected}

// Current
aria-current={isCurrent ? 'page' : undefined}
```

## Existing Component Examples

Reference these existing components for patterns:

- **Button**: `/components/Button/Button.tsx` - Emphasis variants, icon support
- **Avatar**: `/components/Avatar/Avatar.tsx` - Size variants, fallback handling
- **Tab**: `/components/Tab/Tab.tsx` - Compound component, selection state
- **Banner**: `/components/Banner/Banner.tsx` - Semantic variants, dismissable
