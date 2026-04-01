import { forwardRef } from 'react'

export interface IconInfoFilledProps {
  size?: 'sm' | 'md' | 'lg' | number
  className?: string
  color?: string
}

const sizes = {
  sm: 16,
  md: 20,
  lg: 24,
}

/**
 * Info filled icon — circle with "i" symbol.
 * Matched to Figma node 11:5930. Uses currentColor for token compliance.
 */
export const IconInfoFilled = forwardRef<SVGSVGElement, IconInfoFilledProps>(
  ({ size = 'md', className, color = 'currentColor', ...props }, ref) => {
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
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM10.8 11.4C10.8 10.737 11.337 10.2 12 10.2C12.663 10.2 13.2 10.737 13.2 11.4V17.4C13.2 18.063 12.663 18.6 12 18.6C11.337 18.6 10.8 18.063 10.8 17.4V11.4ZM12 5.4C11.173 5.4 10.5 6.073 10.5 6.9C10.5 7.727 11.173 8.4 12 8.4C12.827 8.4 13.5 7.727 13.5 6.9C13.5 6.073 12.827 5.4 12 5.4Z"
          fill={color}
        />
      </svg>
    )
  }
)

IconInfoFilled.displayName = 'IconInfoFilled'
