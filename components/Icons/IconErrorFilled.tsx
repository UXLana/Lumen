import { forwardRef } from 'react'

export interface IconErrorFilledProps {
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
 * Error filled icon — diamond/rotated square with exclamation mark.
 * Matched to Figma node 11:5905. Uses currentColor for token compliance.
 */
export const IconErrorFilled = forwardRef<SVGSVGElement, IconErrorFilledProps>(
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
          d="M0.67 10.382L10.382 0.67C11.275-0.223 12.725-0.223 13.618 0.67L23.33 10.382C24.223 11.275 24.223 12.725 23.33 13.618L13.618 23.33C12.725 24.223 11.275 24.223 10.382 23.33L0.67 13.618C-0.223 12.725-0.223 11.275 0.67 10.382ZM11.997 18.895C11.037 18.895 10.263 18.122 10.263 17.162C10.263 16.202 11.037 15.429 11.997 15.429C12.957 15.429 13.731 16.202 13.731 17.162C13.731 18.122 12.957 18.895 11.997 18.895ZM10.669 12.381C10.669 13.114 11.269 13.714 12.003 13.714C12.736 13.714 13.337 13.114 13.337 12.381V7.047C13.337 6.314 12.736 5.714 12.003 5.714C11.269 5.714 10.669 6.314 10.669 7.047V12.381Z"
          fill={color}
        />
      </svg>
    )
  }
)

IconErrorFilled.displayName = 'IconErrorFilled'
