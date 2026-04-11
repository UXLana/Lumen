'use client'

import React, { forwardRef, useState } from 'react'
import {
  stepper,
  colors,
  fontFamilies,
  borderRadius,
  spacing,
} from '../../styles/design-tokens'
import { Button } from '../Button/Button'
import {
  IconStatusComplete,
  IconStatusInProgress,
  IconStatusNotStarted,
  IconStatusDisabled,
} from '../Icons/Icons'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Step status
 * - completed: Step has been completed (shows checkmark for linear, filled for non-linear)
 * - active: Currently active step (expanded with content)
 * - pending: Future step (not yet reached)
 * - disabled: Step is disabled and not clickable
 */
export type StepStatus = 'completed' | 'active' | 'pending' | 'disabled'

/**
 * Stepper variant
 * - linear: Sequential stepper with numbered steps (original)
 * - nonLinear: Non-sequential stepper with circle indicators (can jump between steps)
 */
export type StepperVariant = 'linear' | 'nonLinear'

/**
 * Stepper orientation
 * - vertical: Steps stacked vertically, content inline under the active step (default)
 * - horizontal: Steps laid out in a top bar, content rendered below
 */
export type StepperOrientation = 'horizontal' | 'vertical'

/**
 * Individual step data
 */
export interface StepItem {
  /** Unique identifier for the step */
  id: string
  /** Step label */
  label: string
  /** Optional metadata/subtitle shown below label */
  metadata?: string
  /** Whether the step is disabled */
  disabled?: boolean
  /** Optional custom icon component (for non-linear variant) */
  icon?: React.ReactNode
}

/**
 * Props for the step indicator component (used in non-linear stepper)
 */
export interface StepIndicatorProps {
  /** Current status of this step */
  status: StepStatus
  /** Whether the indicator is hovered */
  isHovered?: boolean
  /** Whether the indicator is focused */
  isFocused?: boolean
  /** Size of the indicator in pixels */
  size?: number
}


/**
 * Default circle indicator for non-linear stepper with status icons
 *
 * Figma specs:
 * - Outer container: 32px with 2px border (matches connector line width)
 * - Inner icon: 20px centered within the circle
 * - Border color matches connector: green (#1B7F66) for completed/active, grey for pending/disabled
 * - Background is white to create a "window" effect with connector passing behind
 */
export function DefaultStepIndicator({
  status,
  isHovered = false,
  isFocused = false,
  size = 32
}: StepIndicatorProps) {
  const isCompleted = status === 'completed'
  const isActive = status === 'active'
  const isDisabled = status === 'disabled'
  const isPending = status === 'pending'

  // Border color matches connector line color
  const getBorderColor = () => {
    if (isCompleted || isActive) {
      return stepper.connector.colors.completed // #1B7F66 green
    }
    return stepper.connector.colors.pending // grey
  }

  // Icon color based on status — uses step color tokens for consistency
  const getIconColor = () => {
    if (isCompleted || isActive) {
      return stepper.connector.colors.completed
    }
    return stepper.step.colors.pending.text
  }

  // Render the appropriate icon based on status
  const renderIcon = () => {
    const iconColor = getIconColor()
    const iconSize = stepper.step.iconSize

    if (isCompleted) {
      return <IconStatusComplete size={iconSize} style={{ color: iconColor }} />
    }
    if (isActive) {
      return <IconStatusInProgress size={iconSize} style={{ color: iconColor }} />
    }
    if (isDisabled) {
      return <IconStatusDisabled size={iconSize} style={{ color: iconColor }} />
    }
    // pending
    return <IconStatusNotStarted size={iconSize} style={{ color: iconColor }} />
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: stepper.step.borderRadius,
        border: `${stepper.connector.width} solid ${getBorderColor()}`,
        backgroundColor: colors.surface.light,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 2,
      }}
      aria-hidden="true"
    >
      {renderIcon()}
    </div>
  )
}

/**
 * StepperStep component props
 */
export interface StepperStepProps {
  /** Step number (1-based) */
  stepNumber: number
  /** Step label */
  label: string
  /** Optional metadata/subtitle */
  metadata?: string
  /** Current status of this step */
  status?: StepStatus
  /** Whether to show the top connector line */
  showTopConnector?: boolean
  /** Whether to show the bottom connector line */
  showBottomConnector?: boolean
  /** Whether the top connector is completed (green) */
  topConnectorCompleted?: boolean
  /** Whether the bottom connector is completed (green) */
  bottomConnectorCompleted?: boolean
  /** Content to render when step is active */
  children?: React.ReactNode
  /** Primary button text (shown when active) */
  primaryButtonText?: string
  /** Secondary button text (shown when active) */
  secondaryButtonText?: string
  /** Callback when primary button is clicked */
  onPrimaryClick?: () => void
  /** Callback when secondary button is clicked */
  onSecondaryClick?: () => void
  /** Callback when step is clicked */
  onClick?: () => void
  /** Whether to show focus ring (for demo) */
  focused?: boolean
  /** Stepper variant */
  variant?: StepperVariant
  /** Custom indicator component (for non-linear variant) */
  indicatorComponent?: React.ComponentType<StepIndicatorProps>
  /** Custom icon to display in the indicator (for non-linear variant) */
  customIcon?: React.ReactNode
  /** Additional class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

/**
 * Stepper component props
 */
export interface StepperProps {
  /** Array of step items */
  steps: StepItem[]
  /** Currently active step index (0-based) */
  activeStep: number
  /** Callback when step changes */
  onStepChange?: (stepIndex: number) => void
  /** Content for each step (array indexed by step index) */
  stepContent?: React.ReactNode[]
  /** Primary button text for active step */
  primaryButtonText?: string
  /** Secondary button text for active step (shown from step 2 onwards) */
  secondaryButtonText?: string
  /** Callback when primary button is clicked */
  onPrimaryClick?: () => void
  /** Callback when secondary button is clicked */
  onSecondaryClick?: () => void
  /** Whether steps are clickable to navigate */
  clickable?: boolean
  /** Stepper variant */
  variant?: StepperVariant
  /** Stepper orientation (default: 'vertical') */
  orientation?: StepperOrientation
  /** Custom indicator component (for non-linear variant) */
  indicatorComponent?: React.ComponentType<StepIndicatorProps>
  /** Additional class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

/**
 * Linear Stepper Props (convenience type)
 */
export interface LinearStepperProps extends Omit<StepperProps, 'variant'> {}

/**
 * Horizontal Stepper Props (convenience type)
 */
export interface HorizontalStepperProps extends Omit<StepperProps, 'orientation'> {}

/**
 * Non-Linear Stepper Props (convenience type)
 */
export interface NonLinearStepperProps extends Omit<StepperProps, 'variant'> {
  /** Custom indicator component to replace the default circle */
  indicatorComponent?: React.ComponentType<StepIndicatorProps>
}

// =============================================================================
// ICONS
// =============================================================================

/**
 * Checkmark icon for completed steps (linear variant)
 */
function CheckIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.5 8L6.5 11L12.5 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// =============================================================================
// STEPPER STEP COMPONENT
// =============================================================================

/**
 * StepperStep Component
 *
 * A single step in a stepper, showing status indicator, label,
 * and optional content with navigation buttons.
 *
 * @example
 * // Basic step (linear)
 * <StepperStep stepNumber={1} label="Account Setup" status="active" variant="linear" />
 *
 * @example
 * // Non-linear step with custom indicator
 * <StepperStep
 *   stepNumber={1}
 *   label="Personal Info"
 *   status="active"
 *   variant="nonLinear"
 *   indicatorComponent={CustomIcon}
 * />
 */
export const StepperStep = forwardRef<HTMLDivElement, StepperStepProps>(
  (
    {
      stepNumber,
      label,
      metadata,
      status = 'pending',
      showTopConnector = true,
      showBottomConnector = true,
      topConnectorCompleted = false,
      bottomConnectorCompleted = false,
      children,
      primaryButtonText = 'Next',
      secondaryButtonText,
      onPrimaryClick,
      onSecondaryClick,
      onClick,
      focused = false,
      variant = 'linear',
      indicatorComponent: IndicatorComponent = DefaultStepIndicator,
      customIcon,
      className,
      style,
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const isActive = status === 'active'
    const isCompleted = status === 'completed'
    const isDisabled = status === 'disabled'
    const isPending = status === 'pending'
    const isNonLinear = variant === 'nonLinear'

    // Get step indicator colors
    const getStepColors = () => {
      if (isCompleted) return stepper.step.colors.completed
      if (isActive) return stepper.step.colors.active
      if (isDisabled) return stepper.step.colors.disabled
      return stepper.step.colors.pending
    }

    const stepColors = getStepColors()

    // Step is clickable if onClick is provided and step is not disabled
    // Active steps with action buttons are still clickable (user can click other steps)
    const isClickable = Boolean(onClick && !isDisabled)

    // Container styles with hover background for clickable steps
    const pad = stepper.spacing.containerPadding
    const containerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      position: 'relative',
      width: `calc(100% + ${pad} + ${pad})`,
      marginLeft: `-${pad}`,
      marginRight: `-${pad}`,
      paddingLeft: pad,
      paddingRight: pad,
      borderRadius: borderRadius.sm,
      cursor: isClickable ? 'pointer' : 'default',
      ...style,
    }

    // Step column (indicator + connectors)
    const stepColumnStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingRight: stepper.content.paddingLeft,
      flexShrink: 0,
      alignSelf: 'stretch',
      isolation: 'isolate',
    }

    // Top connector wrapper
    const topConnectorWrapperStyles: React.CSSProperties = {
      width: stepper.step.size,
      height: stepper.connector.topWrapperHeight,
      position: 'relative',
      overflow: 'hidden',
      zIndex: 2,
    }

    // Top connector line (above the step indicator)
    const topConnectorStyles: React.CSSProperties = {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      top: 0,
      width: stepper.connector.width,
      height: stepper.connector.topHeight,
      backgroundColor: topConnectorCompleted
        ? stepper.connector.colors.completed
        : stepper.connector.colors.pending,
    }

    // Step indicator styles
    // For non-linear variant, the DefaultStepIndicator handles its own styling
    // For linear variant, we use the traditional colored circle with number/checkmark
    const stepIndicatorStyles: React.CSSProperties = isNonLinear
      ? {
          // Non-linear: transparent container, DefaultStepIndicator provides the circle
          position: 'absolute',
          left: 0,
          top: stepper.connector.topHeight,
          width: stepper.step.size,
          height: stepper.step.size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }
      : {
          // Linear: colored circle with number or checkmark
          position: 'absolute',
          left: 0,
          top: stepper.connector.topHeight,
          width: stepper.step.size,
          height: stepper.step.size,
          borderRadius: stepper.step.borderRadius,
          backgroundColor: stepColors.background,
          border: stepColors.border !== 'transparent' ? `${stepper.connector.width} solid ${stepColors.border}` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }

    // Step number/icon styles
    const stepNumberStyles: React.CSSProperties = {
      fontFamily: fontFamilies.display,
      fontSize: stepper.step.typography.fontSize,
      fontWeight: stepper.step.typography.fontWeight,
      lineHeight: stepper.step.typography.lineHeight,
      letterSpacing: stepper.step.typography.letterSpacing,
      color: stepColors.text,
    }

    // Bottom connector wrapper
    const bottomConnectorWrapperStyles: React.CSSProperties = {
      flex: '1 0 0',
      minHeight: '1px',
      minWidth: '1px',
      width: stepper.connector.width,
      position: 'relative',
      zIndex: 1,
    }

    // Bottom connector line styles
    const bottomConnectorStyles: React.CSSProperties = {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: stepper.connector.width,
      backgroundColor: bottomConnectorCompleted
        ? stepper.connector.colors.completed
        : stepper.connector.colors.pending,
    }

    // Content column
    const contentColumnStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      flex: '1 0 0',
      minWidth: 0,
      isolation: 'isolate',
    }

    // Label wrapper
    const labelWrapperStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingTop: stepper.spacing.labelPaddingY,
      paddingBottom: stepper.spacing.labelPaddingY,
      width: '100%',
      zIndex: 3,
    }

    // Label styles
    const labelConfig = isActive || isCompleted
      ? stepper.content.label.active
      : stepper.content.label.inactive

    const labelStyles: React.CSSProperties = {
      fontFamily: fontFamilies.display,
      fontSize: labelConfig.fontSize,
      fontWeight: labelConfig.fontWeight,
      lineHeight: labelConfig.lineHeight,
      letterSpacing: labelConfig.letterSpacing,
      color: labelConfig.color,
      margin: 0,
    }

    // Metadata styles
    const metadataStyles: React.CSSProperties = {
      fontFamily: fontFamilies.display,
      fontSize: stepper.content.metadata.fontSize,
      fontWeight: stepper.content.metadata.fontWeight,
      lineHeight: stepper.content.metadata.lineHeight,
      letterSpacing: stepper.content.metadata.letterSpacing,
      color: stepper.content.metadata.color,
      marginTop: stepper.spacing.metadataMarginTop,
    }

    // Content area (for active step)
    const contentAreaStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingBottom: stepper.spacing.contentGap,
      width: '100%',
      zIndex: 2,
    }

    // Button group styles
    const buttonGroupStyles: React.CSSProperties = {
      display: 'flex',
      gap: stepper.spacing.buttonGap,
      alignItems: 'flex-start',
      zIndex: 1,
    }

    // Focus ring styles (demo prop) — ring around the step indicator circle
    const focusRingSize = `calc(${stepper.step.size} + ${stepper.focus.offset} * 2 + ${stepper.focus.width} * 2)`
    const focusRingStyles: React.CSSProperties = {
      position: 'absolute',
      left: `-${stepper.focus.offset}`,
      top: `calc(${stepper.connector.topHeight} - ${stepper.focus.offset})`,
      width: focusRingSize,
      height: focusRingSize,
      borderRadius: stepper.step.borderRadius,
      border: `${stepper.focus.width} solid ${stepper.focus.color}`,
      pointerEvents: 'none',
    }

    const handleClick = (e: React.MouseEvent) => {
      // Don't toggle step when clicking inside form controls
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'LABEL') return
      if (isClickable && onClick) {
        onClick()
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      // Only handle when the step container itself is focused, not child inputs/selects
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      if (isClickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onClick()
      }
    }

    // Render the step indicator content
    const renderIndicatorContent = () => {
      if (isNonLinear) {
        // Non-linear: Use custom indicator component or default circle with status icons
        if (customIcon) {
          return customIcon
        }
        return (
          <IndicatorComponent
            status={status}
            isHovered={isHovered}
            isFocused={focused}
            size={stepper.step.sizeNumeric}
          />
        )
      }

      // Linear: Show checkmark for completed, number for others
      if (isCompleted) {
        return <CheckIcon size={stepper.step.checkIconSize} color={stepColors.text} />
      }
      return <span style={stepNumberStyles}>{stepNumber}</span>
    }

    // Generate accessible label for screen readers
    const getAccessibleLabel = () => {
      const statusText = {
        completed: 'Completed',
        active: 'Current step',
        pending: 'Not started',
        disabled: 'Disabled',
      }[status]

      let label_text = `Step ${stepNumber}: ${label}. ${statusText}`
      if (metadata) {
        label_text += `. ${metadata}`
      }
      return label_text
    }

    return (
      <div
        ref={ref}
        className={className}
        style={{
          ...containerStyles,
          outline: 'none',
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={(e) => {
          // Only show focus ring when the container itself is focused (not child buttons)
          if (isClickable && e.target === e.currentTarget) {
            setIsFocused(true)
          }
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setIsFocused(false)
          }
        }}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-disabled={isDisabled}
        aria-current={isActive ? 'step' : undefined}
        aria-label={isClickable ? getAccessibleLabel() : undefined}
      >
        {/* Focus ring (demo prop) */}
        {focused && <span style={focusRingStyles} aria-hidden="true" />}

        {/* Focus ring on step indicator circle only — sized relative to step indicator */}
        {isClickable && isFocused && (
          <div
            style={{
              position: 'absolute',
              // Center around the step indicator: shift by half the size difference (2px) to center the ring
              top: `calc(${stepper.connector.topHeight} - ${spacing['2xs']} / 2)`,
              left: `calc(${pad} - ${spacing['2xs']} / 2)`,
              width: `calc(${stepper.step.size} + ${spacing['2xs']})`,
              height: `calc(${stepper.step.size} + ${spacing['2xs']})`,
              borderRadius: stepper.step.borderRadius,
              outline: `${stepper.focus.width} solid ${stepper.focus.color}`,
              outlineOffset: '1px',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />
        )}

        {/* Step column with indicator and connectors */}
        <div style={stepColumnStyles}>
          {/* Top area with connector and step indicator */}
          <div style={topConnectorWrapperStyles}>
            {/* Top connector */}
            {showTopConnector && <div style={topConnectorStyles} aria-hidden="true" />}

            {/* Step indicator */}
            <div style={stepIndicatorStyles} aria-hidden="true">
              {renderIndicatorContent()}
            </div>
          </div>

          {/* Bottom connector */}
          {showBottomConnector && (
            <div style={bottomConnectorWrapperStyles}>
              <div style={bottomConnectorStyles} aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Content column */}
        <div style={contentColumnStyles}>
          {/* Label and metadata */}
          <div style={labelWrapperStyles}>
            <p style={labelStyles}>{label}</p>
            {metadata && <p style={metadataStyles}>{metadata}</p>}
          </div>

          {/* Step content — only the active step shows expanded content */}
          {isActive && children && (
            <div style={contentAreaStyles}>{children}</div>
          )}

          {/* Navigation buttons (only for active step) */}
          {isActive && (onPrimaryClick || onSecondaryClick) && (
            <div style={buttonGroupStyles}>
              {secondaryButtonText && onSecondaryClick && (
                <Button
                  emphasis="mid"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSecondaryClick()
                  }}
                >
                  {secondaryButtonText}
                </Button>
              )}
              {primaryButtonText && onPrimaryClick && (
                <Button
                  emphasis="high"
                  onClick={(e) => {
                    e.stopPropagation()
                    onPrimaryClick()
                  }}
                >
                  {primaryButtonText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
)

StepperStep.displayName = 'StepperStep'

// =============================================================================
// HORIZONTAL STEPPER BAR (internal)
// =============================================================================

interface HorizontalStepperBarProps {
  steps: StepItem[]
  activeStep: number
  clickable: boolean
  onStepClick?: (index: number) => void
}

interface HorizontalStepperBarItemProps {
  step: StepItem
  index: number
  status: StepStatus
  isLast: boolean
  clickable: boolean
  onStepClick?: (index: number) => void
}

function HorizontalStepperBarItem({
  step,
  index,
  status,
  isLast,
  clickable,
  onStepClick,
}: HorizontalStepperBarItemProps) {
  const [isFocused, setIsFocused] = useState(false)

  const isCompleted = status === 'completed'
  const isActive = status === 'active'
  const isDisabled = status === 'disabled'
  const isClickable = clickable && !isDisabled && !!onStepClick

  const stepColors = isCompleted
    ? stepper.step.colors.completed
    : isActive
      ? stepper.step.colors.active
      : isDisabled
        ? stepper.step.colors.disabled
        : stepper.step.colors.pending

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        flex: isLast ? '0 0 auto' : '1 1 0',
        minWidth: 0,
      }}
    >
      <button
        type="button"
        onClick={isClickable ? () => onStepClick!(index) : undefined}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isDisabled}
        aria-current={isActive ? 'step' : undefined}
        aria-label={`Step ${index + 1}: ${step.label}${
          isCompleted ? ', completed' : isActive ? ', current' : ''
        }`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          padding: `${spacing['2xs']} ${spacing.xs}`,
          border: 'none',
          background: 'transparent',
          cursor: isClickable ? 'pointer' : 'default',
          borderRadius: borderRadius.sm,
          flexShrink: 0,
          minWidth: 0,
          maxWidth: '100%',
          outline: 'none',
          fontFamily: fontFamilies.display,
          position: 'relative',
        }}
      >
        {/* Step circle */}
        <div
          style={{
            position: 'relative',
            width: stepper.step.size,
            height: stepper.step.size,
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {/* Focus ring (rendered outside the circle, concentric with it) */}
          {isFocused && isClickable && (
            <span
              style={{
                position: 'absolute',
                inset: `-${stepper.focus.offset}`,
                borderRadius: `calc(${stepper.step.borderRadius} + ${stepper.focus.offset})`,
                border: `${stepper.focus.width} solid ${stepper.focus.color}`,
                pointerEvents: 'none',
                boxSizing: 'border-box',
              }}
            />
          )}
          <div
            style={{
              width: stepper.step.size,
              height: stepper.step.size,
              borderRadius: stepper.step.borderRadius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: stepColors.background,
              border:
                stepColors.border !== 'transparent'
                  ? `${stepper.connector.width} solid ${stepColors.border}`
                  : 'none',
              boxSizing: 'border-box',
            }}
          >
                {isCompleted ? (
                  <CheckIcon size={stepper.step.checkIconSize} color={stepColors.text} />
                ) : (
                  <span
                    style={{
                      fontFamily: fontFamilies.display,
                      fontSize: stepper.step.typography.fontSize,
                      fontWeight: stepper.step.typography.fontWeight,
                      lineHeight: stepper.step.typography.lineHeight,
                      letterSpacing: stepper.step.typography.letterSpacing,
                      color: stepColors.text,
                    }}
                  >
            {index + 1}
          </span>
        )}
          </div>
        </div>

        {/* Label */}
        <span
          style={{
            fontFamily: fontFamilies.display,
            fontSize: stepper.content.label.inactive.fontSize,
            lineHeight: stepper.content.label.inactive.lineHeight,
            letterSpacing: stepper.content.label.inactive.letterSpacing,
            fontWeight: isActive
              ? stepper.content.label.active.fontWeight
              : stepper.content.label.inactive.fontWeight,
            color:
              isActive || isCompleted
                ? stepper.content.label.active.color
                : stepper.content.label.inactive.color,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: 0,
          }}
        >
          {step.label}
        </span>
      </button>

      {/* Connector line */}
      {!isLast && (
        <div
          style={{
            flex: '1 1 0',
            height: stepper.connector.width,
            minWidth: spacing['2xl'],
            backgroundColor: isCompleted
              ? stepper.connector.colors.completed
              : stepper.connector.colors.pending,
            marginLeft: spacing['2xs'],
            marginRight: spacing['2xs'],
          }}
          aria-hidden="true"
        />
      )}
    </li>
  )
}

function HorizontalStepperBar({
  steps,
  activeStep,
  clickable,
  onStepClick,
}: HorizontalStepperBarProps) {
  const getStatus = (index: number, step: StepItem): StepStatus => {
    if (step.disabled) return 'disabled'
    if (index < activeStep) return 'completed'
    if (index === activeStep) return 'active'
    return 'pending'
  }

  return (
    <ol
      style={{
        display: 'flex',
        alignItems: 'center',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        width: '100%',
        minWidth: 0,
      }}
    >
      {steps.map((step, index) => (
        <HorizontalStepperBarItem
          key={step.id}
          step={step}
          index={index}
          status={getStatus(index, step)}
          isLast={index === steps.length - 1}
          clickable={clickable}
          onStepClick={onStepClick}
        />
      ))}
    </ol>
  )
}

// =============================================================================
// BASE STEPPER COMPONENT
// =============================================================================

/**
 * Stepper Component
 *
 * A vertical stepper that guides users through a multi-step process.
 * Shows progress, current step, and allows navigation between steps.
 * Supports both linear (sequential) and non-linear (any-order) navigation.
 *
 * @example
 * // Linear stepper (sequential)
 * <Stepper
 *   variant="linear"
 *   steps={[
 *     { id: '1', label: 'Account Setup' },
 *     { id: '2', label: 'Personal Info' },
 *     { id: '3', label: 'Review' },
 *   ]}
 *   activeStep={0}
 *   onStepChange={(index) => setActiveStep(index)}
 * />
 *
 * @example
 * // Non-linear stepper (can jump between steps)
 * <Stepper
 *   variant="nonLinear"
 *   steps={steps}
 *   activeStep={activeStep}
 *   onStepChange={setActiveStep}
 *   clickable
 * />
 */
export function Stepper({
  steps,
  activeStep,
  onStepChange,
  stepContent,
  primaryButtonText = 'Next',
  secondaryButtonText = 'Previous',
  onPrimaryClick,
  onSecondaryClick,
  clickable = false,
  variant = 'linear',
  orientation = 'vertical',
  indicatorComponent,
  className,
  style,
}: StepperProps) {
  // Container styles
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    ...style,
  }

  // Determine step status
  const getStepStatus = (index: number, step: StepItem): StepStatus => {
    if (step.disabled) return 'disabled'
    if (index < activeStep) return 'completed'
    if (index === activeStep) return 'active'
    return 'pending'
  }

  // Handle step click
  const handleStepClick = (index: number, step: StepItem) => {
    if (clickable && !step.disabled && onStepChange) {
      onStepChange(index)
    }
  }

  // Visually hidden styles for screen reader announcements
  const visuallyHiddenStyles: React.CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  }

  const safeActiveStep =
    steps.length > 0 ? Math.min(Math.max(activeStep, 0), steps.length - 1) : 0
  const liveRegionLabel = steps[safeActiveStep]?.label ?? ''
  const isHorizontal = orientation === 'horizontal'
  const isLastStep = safeActiveStep === steps.length - 1
  const showHorizontalSecondary = safeActiveStep > 0

  if (isHorizontal) {
    return (
      <div
        className={className}
        style={containerStyles}
        role="navigation"
        aria-label={`Horizontal ${variant === 'linear' ? 'linear' : 'non-linear'} progress stepper`}
      >
        {/* Screen reader progress announcement */}
        <div
          style={visuallyHiddenStyles}
          aria-live="polite"
          aria-atomic="true"
        >
          Step {steps.length > 0 ? safeActiveStep + 1 : 0} of {steps.length}
          {liveRegionLabel ? `: ${liveRegionLabel}` : ''}
        </div>

        {/* Top: horizontal step bar */}
        <div style={{ width: '100%', paddingBottom: stepper.spacing.contentGap }}>
          <HorizontalStepperBar
            steps={steps}
            activeStep={safeActiveStep}
            clickable={clickable}
            onStepClick={clickable ? (index) => {
              const step = steps[index]
              if (step && !step.disabled) {
                onStepChange?.(index)
              }
            } : undefined}
          />
        </div>

        {/* Active step content */}
        {stepContent?.[safeActiveStep] && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
              paddingBottom: stepper.spacing.contentGap,
            }}
          >
            {stepContent[safeActiveStep]}
          </div>
        )}

        {/* Navigation buttons */}
        {(onPrimaryClick || onSecondaryClick) && (
          <div
            style={{
              display: 'flex',
              gap: stepper.spacing.buttonGap,
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            {showHorizontalSecondary && onSecondaryClick && (
              <Button emphasis="mid" onClick={onSecondaryClick}>
                {secondaryButtonText}
              </Button>
            )}
            {onPrimaryClick && (
              <Button emphasis="high" onClick={onPrimaryClick}>
                {isLastStep ? 'Complete' : primaryButtonText}
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={className}
      style={containerStyles}
      role="navigation"
      aria-label={`${variant === 'linear' ? 'Linear' : 'Non-linear'} progress stepper`}
    >
      {/* Screen reader progress announcement */}
      <div
        style={visuallyHiddenStyles}
        aria-live="polite"
        aria-atomic="true"
      >
        Step {steps.length > 0 ? safeActiveStep + 1 : 0} of {steps.length}
        {liveRegionLabel ? `: ${liveRegionLabel}` : ''}
      </div>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
        {steps.map((step, index) => {
          const status = getStepStatus(index, step)
          const isFirst = index === 0
          const isLast = index === steps.length - 1
          const showSecondary = index > 0 && status === 'active'

          return (
            <li key={step.id}>
              <StepperStep
                stepNumber={index + 1}
                label={step.label}
                metadata={step.metadata}
                status={status}
                showTopConnector={!isFirst}
                showBottomConnector={!isLast}
                topConnectorCompleted={index <= activeStep}
                bottomConnectorCompleted={index < activeStep}
                primaryButtonText={isLast ? 'Complete' : primaryButtonText}
                secondaryButtonText={showSecondary ? secondaryButtonText : undefined}
                onPrimaryClick={status === 'active' ? onPrimaryClick : undefined}
                onSecondaryClick={status === 'active' && showSecondary ? onSecondaryClick : undefined}
                onClick={clickable ? () => handleStepClick(index, step) : undefined}
                variant={variant}
                indicatorComponent={indicatorComponent}
                customIcon={step.icon}
              >
                {stepContent?.[index]}
              </StepperStep>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// =============================================================================
// LINEAR STEPPER (Convenience Component)
// =============================================================================

/**
 * LinearStepper Component
 *
 * A sequential stepper with numbered steps. Users must complete steps in order.
 * This is the original stepper behavior, now named explicitly.
 *
 * @example
 * <LinearStepper
 *   steps={[
 *     { id: '1', label: 'Account Setup' },
 *     { id: '2', label: 'Personal Info' },
 *     { id: '3', label: 'Review' },
 *   ]}
 *   activeStep={0}
 *   onStepChange={(index) => setActiveStep(index)}
 * />
 */
export function LinearStepper(props: LinearStepperProps) {
  return <Stepper {...props} variant="linear" />
}

LinearStepper.displayName = 'LinearStepper'

// =============================================================================
// NON-LINEAR STEPPER (Convenience Component)
// =============================================================================

/**
 * NonLinearStepper Component
 *
 * A non-sequential stepper with circle indicators. Users can navigate
 * to any step in any order. The circle indicators show status:
 * - Pending/Disabled: Black circle with 10% opacity (on white background)
 * - Active/Completed: White circle with 90% opacity (on green background)
 *
 * Supports custom indicator components for displaying icons, progress, etc.
 *
 * @example
 * // Basic non-linear stepper
 * <NonLinearStepper
 *   steps={[
 *     { id: '1', label: 'Account Setup' },
 *     { id: '2', label: 'Personal Info' },
 *     { id: '3', label: 'Review' },
 *   ]}
 *   activeStep={0}
 *   onStepChange={(index) => setActiveStep(index)}
 *   clickable
 * />
 *
 * @example
 * // With custom indicator component
 * <NonLinearStepper
 *   steps={steps}
 *   activeStep={activeStep}
 *   onStepChange={setActiveStep}
 *   indicatorComponent={({ status }) => (
 *     <MyCustomIcon status={status} />
 *   )}
 *   clickable
 * />
 *
 * @example
 * // With per-step custom icons
 * <NonLinearStepper
 *   steps={[
 *     { id: '1', label: 'Account', icon: <UserIcon /> },
 *     { id: '2', label: 'Settings', icon: <GearIcon /> },
 *     { id: '3', label: 'Review', icon: <CheckIcon /> },
 *   ]}
 *   activeStep={activeStep}
 *   onStepChange={setActiveStep}
 *   clickable
 * />
 */
export function NonLinearStepper({
  indicatorComponent = DefaultStepIndicator,
  clickable = true,
  ...props
}: NonLinearStepperProps) {
  return (
    <Stepper
      {...props}
      variant="nonLinear"
      indicatorComponent={indicatorComponent}
      clickable={clickable}
    />
  )
}

NonLinearStepper.displayName = 'NonLinearStepper'

// =============================================================================
// HORIZONTAL STEPPER (Convenience Component)
// =============================================================================

/**
 * HorizontalStepper Component
 *
 * A top-bar stepper that lays out steps horizontally with connectors between
 * them. The active step's content renders below the bar, followed by the
 * navigation buttons. Adapted from the TaskModal horizontal step indicator.
 *
 * @example
 * <HorizontalStepper
 *   steps={[
 *     { id: '1', label: 'Details' },
 *     { id: '2', label: 'Review' },
 *     { id: '3', label: 'Submit' },
 *   ]}
 *   activeStep={activeStep}
 *   onStepChange={setActiveStep}
 *   stepContent={[<DetailsForm />, <ReviewPanel />, <SubmitConfirm />]}
 *   onPrimaryClick={() => setActiveStep((s) => s + 1)}
 *   onSecondaryClick={() => setActiveStep((s) => s - 1)}
 *   clickable
 * />
 */
export function HorizontalStepper(props: HorizontalStepperProps) {
  return <Stepper {...props} orientation="horizontal" />
}

HorizontalStepper.displayName = 'HorizontalStepper'

// =============================================================================
// EXPORTS
// =============================================================================

export default Stepper
