import { forwardRef } from 'react'

export interface IconWarningFilledProps {
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
 * Warning filled icon — triangle with exclamation mark.
 * Matched to Figma node 11:5913. Uses currentColor for token compliance.
 */
export const IconWarningFilled = forwardRef<SVGSVGElement, IconWarningFilledProps>(
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
          d="M9.2 1.435C10.252-0.478 13.002-0.478 14.054 1.435L22.904 17.553C23.919 19.399 22.564 21.657 20.462 21.657H2.773C0.67 21.657-0.684 19.399 0.331 17.553L9.2 1.435ZM11.628 14.865C10.779 14.865 10.09 15.554 10.09 16.403C10.09 17.253 10.779 17.945 11.628 17.945C12.477 17.945 13.167 17.253 13.167 16.403C13.167 15.554 12.477 14.865 11.628 14.865ZM11.628 5.636C10.949 5.636 10.399 6.188 10.399 6.868V11.788C10.399 12.468 10.949 13.02 11.628 13.02C12.307 13.02 12.858 12.468 12.858 11.788V6.868C12.858 6.188 12.307 5.636 11.628 5.636Z"
          fill={color}
        />
      </svg>
    )
  }
)

IconWarningFilled.displayName = 'IconWarningFilled'
