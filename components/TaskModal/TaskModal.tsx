'use client'

import React, { forwardRef, useState, useEffect, useCallback, useId } from 'react'
import {
  spacing,
  typography,
  shadows,
  transitionPresets,
  zIndex,
  breakpoints,
  stepper,
  fontFamilies,
  borderRadius,
} from '../../styles/design-tokens'
import { useColors } from '../../styles/themes'
import { Button } from '../Button'
import { ProgressBar } from '../ProgressBar'

// =============================================================================
// REDUCED MOTION HOOK
// =============================================================================

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// =============================================================================
// RESPONSIVE HOOK
// =============================================================================

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}

function useIsCompact(): boolean {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${parseInt(breakpoints.lg) - 1}px)`)
    setIsCompact(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsCompact(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isCompact
}

// =============================================================================
// TYPES
// =============================================================================

/** Individual task step configuration */
export interface TaskStep {
  /** Unique identifier */
  id: string
  /** Step label shown in the navigation */
  label: string
  /** Optional subtitle/description */
  subtitle?: string
  /** Whether the step is disabled */
  disabled?: boolean
  /** Optional icon for the step indicator */
  icon?: React.ReactNode
  /** Whether this step is optional (shown as badge) */
  optional?: boolean
}

/** Step status */
export type TaskStepStatus = 'completed' | 'active' | 'pending' | 'disabled'

/** Navigation orientation for the step indicator */
export type TaskModalOrientation = 'horizontal' | 'vertical'

/** Number of content columns per step */
export type TaskModalColumns = 1 | 2 | 3

/** Panel background variant */
export type TaskModalPanelBackground = 'light' | 'muted'

/** Panel border position */
export type TaskModalPanelBorder = 'left' | 'right' | 'none'

/** Mobile progress style */
export type TaskModalMobileProgress = 'inline' | 'stacked'

export interface TaskModalProps {
  /** Controls modal visibility */
  open: boolean
  /** Callback when close is triggered */
  onClose: () => void
  /** Modal title in the header */
  title: string
  /** Optional subtitle */
  subtitle?: string
  /** Array of step definitions */
  steps: TaskStep[]
  /** Currently active step index (0-based) */
  activeStep: number
  /** Callback when step changes */
  onStepChange: (stepIndex: number) => void
  /** Step indicator orientation: 'horizontal' (top bar) or 'vertical' (left sidebar) */
  orientation?: TaskModalOrientation
  /** Number of body columns for step content: 1, 2, or 3 */
  columns?: TaskModalColumns
  /** Step content — render the active step's content here */
  children: React.ReactNode
  /** Whether users can click step indicators to navigate */
  clickable?: boolean
  /** Text for the primary (next) button */
  primaryButtonText?: string
  /** Text for the secondary (back) button */
  secondaryButtonText?: string
  /** Callback when primary button is clicked */
  onPrimaryClick?: () => void
  /** Callback when secondary button is clicked */
  onSecondaryClick?: () => void
  /** Close on Escape key */
  closeOnEscape?: boolean
  /** Show subtitles on all steps that have them */
  showSubtitles?: boolean
  /** Mobile progress style: 'inline' (single row) or 'stacked' (progress bar below label) */
  mobileProgress?: TaskModalMobileProgress
  /** Additional header action buttons */
  headerButtons?: TaskModalHeaderButton[]
  /** Additional CSS class */
  className?: string
}

export interface TaskModalHeaderButton {
  label: string
  emphasis: 'high' | 'mid' | 'low'
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

export interface TaskModalPanelProps {
  children: React.ReactNode
  /** Panel background: 'light' or 'muted' */
  background?: TaskModalPanelBackground
  /** Border side: 'left', 'right', or 'none' */
  border?: TaskModalPanelBorder
  /** Additional CSS class */
  className?: string
  /** Sticky panel with independent scrolling */
  sticky?: boolean
}

// =============================================================================
// ICONS (inline SVG)
// =============================================================================

const CloseIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 14,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
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

const ChevronLeftIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M10 4L6 8L10 12" />
  </svg>
)

const ChevronRightIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M6 4L10 8L6 12" />
  </svg>
)

// =============================================================================
// STEP INDICATOR — HORIZONTAL
// =============================================================================

interface StepIndicatorHorizontalProps {
  steps: TaskStep[]
  activeStep: number
  onStepClick?: (index: number) => void
  clickable: boolean
  showSubtitles: boolean
  colors: ReturnType<typeof useColors>
}

function StepIndicatorHorizontal({
  steps,
  activeStep,
  onStepClick,
  clickable,
  colors,
}: StepIndicatorHorizontalProps) {
  const getStatus = (index: number, step: TaskStep): TaskStepStatus => {
    if (step.disabled) return 'disabled'
    if (index < activeStep) return 'completed'
    if (index === activeStep) return 'active'
    return 'pending'
  }

  return (
    <nav
      role="navigation"
      aria-label="Task progress"
      style={{
        display: 'flex',
        alignItems: 'center',
        flex: '1 1 auto',
        justifyContent: 'flex-end',
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {steps.map((step, index) => {
          const status = getStatus(index, step)
          const isCompleted = status === 'completed'
          const isActive = status === 'active'
          const isDisabled = status === 'disabled'
          const isLast = index === steps.length - 1
          const isClickable = clickable && !isDisabled && onStepClick

          return (
            <li
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: isLast ? '0 0 auto' : '1 1 0',
                minWidth: 0,
              }}
            >
              {/* Step dot + label */}
              <button
                type="button"
                data-task-modal-step=""
                onClick={isClickable ? () => onStepClick!(index) : undefined}
                disabled={isDisabled}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Step ${index + 1}: ${step.label}${isCompleted ? ', completed' : isActive ? ', current' : ''}`}
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
                  outline: 'none',
                  transition: transitionPresets.default,
                }}
              >
                {/* Step circle */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: isCompleted || isActive
                      ? stepper.step.colors.completed.background
                      : stepper.step.colors.pending.background,
                    border: isCompleted || isActive
                      ? 'none'
                      : `2px solid ${stepper.step.colors.pending.border}`,
                    transition: transitionPresets.default,
                  }}
                >
                  {isCompleted ? (
                    <CheckIcon size={14} color={stepper.step.colors.completed.text} />
                  ) : (
                    <span
                      style={{
                        fontFamily: fontFamilies.display,
                        fontSize: '12px',
                        fontWeight: 600,
                        lineHeight: 1,
                        color: isActive
                          ? stepper.step.colors.active.text
                          : stepper.step.colors.pending.text,
                      }}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  style={{
                    ...typography.label.sm,
                    color: isActive || isCompleted
                      ? colors.text.highEmphasis.onLight
                      : colors.text.lowEmphasis.onLight,
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {step.label}
                </span>

                {step.optional && (
                  <span
                    style={{
                      ...typography.label.sm,
                      color: colors.text.lowEmphasis.onLight,
                      fontSize: '11px',
                    }}
                  >
                    (Optional)
                  </span>
                )}
              </button>

              {/* Connector line */}
              {!isLast && (
                <div
                  style={{
                    flex: '1 1 0',
                    height: 2,
                    minWidth: 40,
                    backgroundColor: isCompleted
                      ? stepper.connector.colors.completed
                      : stepper.connector.colors.pending,
                    transition: transitionPresets.default,
                  }}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// =============================================================================
// STEP INDICATOR — VERTICAL (sidebar)
// =============================================================================

interface StepIndicatorVerticalProps {
  steps: TaskStep[]
  activeStep: number
  onStepClick?: (index: number) => void
  clickable: boolean
  showSubtitles: boolean
  colors: ReturnType<typeof useColors>
}

function VerticalStepRow({
  step,
  index,
  status,
  isLast,
  onStepClick,
  clickable,
  showSubtitles,
  colors,
}: {
  step: TaskStep
  index: number
  status: TaskStepStatus
  isLast: boolean
  onStepClick?: (index: number) => void
  clickable: boolean
  showSubtitles: boolean
  colors: ReturnType<typeof useColors>
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const isCompleted = status === 'completed'
  const isActive = status === 'active'
  const isDisabled = status === 'disabled'
  const isClickable = clickable && !isDisabled && onStepClick

  // Active: 2 shades darker with rounded corners
  // Hover: 1 shade darker with rounded corners
  const getRowBackground = () => {
    if (isActive) return 'rgba(0, 0, 0, 0.08)'
    if (isHovered && isClickable) return 'rgba(0, 0, 0, 0.04)'
    return 'transparent'
  }

  return (
    <li>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {/* Connector column — fixed width, holds circle + lines */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 32,
            flexShrink: 0,
            position: 'relative',
          }}
          aria-hidden="true"
        >
          {/* Top connector (except first step) */}
          {index > 0 && (
            <div
              style={{
                width: stepper.connector.width,
                height: 8,
                backgroundColor: isCompleted || isActive
                  ? stepper.connector.colors.completed
                  : stepper.connector.colors.pending,
                transition: transitionPresets.default,
              }}
            />
          )}

          {/* Step circle */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              backgroundColor: isCompleted || isActive
                ? stepper.step.colors.completed.background
                : stepper.step.colors.pending.background,
              border: isCompleted || isActive
                ? 'none'
                : `2px solid ${stepper.step.colors.pending.border}`,
              transition: transitionPresets.default,
            }}
          >
            {isCompleted ? (
              <CheckIcon size={14} color={stepper.step.colors.completed.text} />
            ) : (
              <span
                style={{
                  fontFamily: fontFamilies.display,
                  ...stepper.step.typography,
                  color: isActive
                    ? stepper.step.colors.active.text
                    : stepper.step.colors.pending.text,
                }}
              >
                {index + 1}
              </span>
            )}
          </div>

          {/* Bottom connector (except last step) */}
          {!isLast && (
            <div
              style={{
                width: stepper.connector.width,
                flex: '1 0 0',
                minHeight: 8,
                backgroundColor: isCompleted
                  ? stepper.connector.colors.completed
                  : stepper.connector.colors.pending,
                transition: transitionPresets.default,
              }}
            />
          )}
        </div>

        {/* Clickable row — entire label area is the click target */}
        <button
          type="button"
          onClick={isClickable ? () => onStepClick!(index) : undefined}
          disabled={isDisabled}
          aria-current={isActive ? 'step' : undefined}
          aria-label={`Step ${index + 1}: ${step.label}${isCompleted ? ', completed' : isActive ? ', current' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            minWidth: 0,
            padding: `${spacing.xs} ${spacing.sm}`,
            marginLeft: spacing.xs,
            border: 'none',
            background: getRowBackground(),
            borderRadius: borderRadius.md,
            cursor: isClickable ? 'pointer' : 'default',
            outline: isFocused && isClickable
              ? `2px solid ${colors.brand.default}`
              : 'none',
            outlineOffset: isFocused && isClickable ? '1px' : undefined,
            textAlign: 'left',
            transition: transitionPresets.default,
          }}
        >
          <span
            style={{
              ...typography.label.md,
              color: isActive || isCompleted
                ? colors.text.highEmphasis.onLight
                : colors.text.lowEmphasis.onLight,
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {step.label}
          </span>
          {showSubtitles && step.subtitle && (
            <span
              style={{
                ...typography.body.xs,
                color: colors.text.lowEmphasis.onLight,
                marginTop: 2,
              }}
            >
              {step.subtitle}
            </span>
          )}
          {step.optional && (
            <span
              style={{
                ...typography.body.xs,
                color: colors.text.lowEmphasis.onLight,
                fontStyle: 'italic',
                marginTop: 2,
              }}
            >
              Optional
            </span>
          )}
        </button>
      </div>
    </li>
  )
}

function StepIndicatorVertical({
  steps,
  activeStep,
  onStepClick,
  clickable,
  showSubtitles,
  colors,
}: StepIndicatorVerticalProps) {
  const getStatus = (index: number, step: TaskStep): TaskStepStatus => {
    if (step.disabled) return 'disabled'
    if (index < activeStep) return 'completed'
    if (index === activeStep) return 'active'
    return 'pending'
  }

  return (
    <div
      role="navigation"
      aria-label="Task progress"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 260,
        flexShrink: 0,
        borderRight: `1px solid ${colors.border.lowEmphasis.onLight}`,
        backgroundColor: colors.surface.lightDarker,
        padding: `${spacing.xl} ${spacing.sm}`,
        overflowY: 'auto',
      }}
    >
      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {steps.map((step, index) => (
          <VerticalStepRow
            key={step.id}
            step={step}
            index={index}
            status={getStatus(index, step)}
            isLast={index === steps.length - 1}
            onStepClick={onStepClick}
            clickable={clickable}
            showSubtitles={showSubtitles}
            colors={colors}
          />
        ))}
      </ol>
    </div>
  )
}

// =============================================================================
// MOBILE HEADER (ProgressBar + step label)
// =============================================================================

interface MobileHeaderProps {
  steps: TaskStep[]
  activeStep: number
  mobileProgress: TaskModalMobileProgress
  colors: ReturnType<typeof useColors>
}

// =============================================================================
// COMPACT PROGRESS (inline in header, for narrow viewports)
// =============================================================================

interface CompactProgressProps {
  steps: TaskStep[]
  activeStep: number
  colors: ReturnType<typeof useColors>
}

function CompactProgress({ steps, activeStep, colors }: CompactProgressProps) {
  const progress = steps.length > 1 ? ((activeStep + 1) / steps.length) * 100 : 100
  const currentStep = steps[activeStep]

  return (
    <div
      role="navigation"
      aria-label="Task progress"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          ...typography.label.sm,
          color: colors.text.lowEmphasis.onLight,
          whiteSpace: 'nowrap',
        }}
      >
        {activeStep + 1}/{steps.length}
      </span>
      <div style={{ width: 120, flexShrink: 0 }}>
        <ProgressBar
          value={progress}
          size="sm"
          aria-label={`Step ${activeStep + 1} of ${steps.length}: ${currentStep?.label}`}
        />
      </div>
      <span
        style={{
          ...typography.label.sm,
          color: colors.text.highEmphasis.onLight,
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        {currentStep?.label}
      </span>
    </div>
  )
}

// =============================================================================
// MOBILE HEADER (ProgressBar + step label)
// =============================================================================

function MobileHeader({ steps, activeStep, mobileProgress, colors }: MobileHeaderProps) {
  const progress = steps.length > 1 ? ((activeStep + 1) / steps.length) * 100 : 100
  const currentStep = steps[activeStep]

  if (mobileProgress === 'stacked') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.surface.light,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${spacing.sm} 24px`,
          }}
        >
          <span
            style={{
              ...typography.label.sm,
              color: colors.text.highEmphasis.onLight,
              fontWeight: 600,
            }}
          >
            {currentStep?.label}
          </span>
          <span
            style={{
              ...typography.label.sm,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            {activeStep + 1} of {steps.length}
          </span>
        </div>
        {/* Progress bar: edge-to-edge, no side padding */}
        <ProgressBar
          value={progress}
          size="sm"
          aria-label={`Step ${activeStep + 1} of ${steps.length}: ${currentStep?.label}`}
          style={{ borderRadius: 0 }}
        />
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        padding: `${spacing.sm} 48px ${spacing.sm}`,
        backgroundColor: colors.surface.light,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          ...typography.label.sm,
          color: colors.text.lowEmphasis.onLight,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {activeStep + 1}/{steps.length}
      </span>
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <ProgressBar
          value={progress}
          size="sm"
          aria-label={`Step ${activeStep + 1} of ${steps.length}: ${currentStep?.label}`}
        />
      </div>
      <span
        style={{
          ...typography.label.sm,
          color: colors.text.highEmphasis.onLight,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {currentStep?.label}
      </span>
    </div>
  )
}

// =============================================================================
// TASK MODAL PANEL (reusable content panel)
// =============================================================================

/**
 * TaskModalPanel — Content panel for structured layout within a TaskModal step.
 *
 * Works identically to FullScreenModalPanel: provides consistent padding,
 * optional muted background, side border, and sticky scrolling.
 */
export const TaskModalPanel = forwardRef<HTMLDivElement, TaskModalPanelProps>(
  ({ children, background = 'light', border = 'none', className, sticky = false }, ref) => {
    const colors = useColors()

    const borderStyle: React.CSSProperties =
      border === 'left'
        ? { borderLeft: `1px solid ${colors.border.lowEmphasis.onLight}` }
        : border === 'right'
          ? { borderRight: `1px solid ${colors.border.lowEmphasis.onLight}` }
          : {}

    return (
      <div
        ref={ref}
        className={className}
        style={{
          width: '100%',
          padding: '40px 48px 48px',
          display: 'flex',
          flexDirection: 'column',
          transition: 'background-color 200ms',
          backgroundColor:
            background === 'muted' ? colors.surface.lightDarker : colors.surface.light,
          minHeight: 0,
          overflowY: 'auto',
          ...borderStyle,
        }}
      >
        {sticky ? (
          <div
            style={{
              position: 'sticky',
              top: 0,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              overflowY: 'auto',
            }}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    )
  },
)

TaskModalPanel.displayName = 'TaskModalPanel'

// =============================================================================
// TASK MODAL
// =============================================================================

/**
 * TaskModal — A full-screen, multi-step task modal.
 *
 * Like Stepper but screen-level: each step takes the full viewport
 * inside a FullScreenModal shell. Supports horizontal (top bar) and
 * vertical (left sidebar) step navigation, with an automatic mobile
 * mode that collapses to a ProgressBar in the header.
 *
 * Features:
 * - Composes FullScreenModal patterns (1/2/3 column grid, panels, header buttons)
 * - Horizontal step indicators (top bar with connector lines)
 * - Vertical step indicators (left sidebar with connector lines)
 * - Mobile: auto-collapses to ProgressBar in header
 * - Keyboard navigation (Escape to close, arrow keys planned)
 * - Screen reader: live region announces current step
 * - Body scroll lock, focus trap basics
 * - Respects `prefers-reduced-motion`
 *
 * @example
 * ```tsx
 * <TaskModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Create License"
 *   steps={[
 *     { id: 'info', label: 'Basic Info' },
 *     { id: 'details', label: 'License Details' },
 *     { id: 'review', label: 'Review & Submit' },
 *   ]}
 *   activeStep={currentStep}
 *   onStepChange={setCurrentStep}
 *   orientation="horizontal"
 *   columns={2}
 *   onPrimaryClick={handleNext}
 *   onSecondaryClick={handleBack}
 * >
 *   <TaskModalPanel>
 *     {renderStepContent(currentStep)}
 *   </TaskModalPanel>
 *   <TaskModalPanel background="muted" border="left" sticky>
 *     <StepPreview />
 *   </TaskModalPanel>
 * </TaskModal>
 * ```
 */
export const TaskModal = forwardRef<HTMLDivElement, TaskModalProps>(
  (
    {
      open,
      onClose,
      title,
      subtitle,
      steps,
      activeStep,
      onStepChange,
      orientation = 'horizontal',
      columns = 1,
      children,
      clickable = false,
      primaryButtonText = 'Next',
      secondaryButtonText = 'Back',
      onPrimaryClick,
      onSecondaryClick,
      closeOnEscape = true,
      showSubtitles = true,
      mobileProgress = 'inline',
      headerButtons,
      className,
    },
    ref,
  ) => {
    const colors = useColors()
    const prefersReducedMotion = usePrefersReducedMotion()
    const isMobile = useIsMobile()
    const isCompact = useIsCompact()
    const liveRegionId = useId()

    const isFirstStep = activeStep === 0
    const isLastStep = activeStep === steps.length - 1
    const safeActiveStep =
      steps.length > 0 ? Math.min(Math.max(activeStep, 0), steps.length - 1) : 0

    // Escape key
    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape) onClose()
      },
      [onClose, closeOnEscape],
    )

    useEffect(() => {
      if (!open) return
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }, [open, handleEscape])

    // Body scroll lock
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
      }
      return () => {
        document.body.style.overflow = ''
      }
    }, [open])

    if (!open) return null

    const gridTemplateColumns =
      columns === 3
        ? 'repeat(3, 1fr)'
        : columns === 2
          ? 'repeat(2, 1fr)'
          : '1fr'

    const handleStepClick = (index: number) => {
      if (clickable && !steps[index]?.disabled) {
        onStepChange(index)
      }
    }

    // Determine the effective primary button text
    const effectivePrimaryText = isLastStep ? 'Complete' : primaryButtonText

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: zIndex?.overlay ?? 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.scrim,
          backdropFilter: 'blur(4px)',
          animation: prefersReducedMotion ? 'none' : 'taskModalFadeIn 200ms ease-out',
        }}
      >
        <div
          className={className}
          style={{
            width: '100%',
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: colors.surface.light,
            boxShadow: shadows?.xl ?? '0 25px 50px -12px rgba(0,0,0,.25)',
            position: 'relative',
          }}
        >
          {/* ============ HEADER ============ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 24,
              paddingRight: 24,
              minHeight: 56,
              flexShrink: 0,
              backgroundColor: colors.surface.light,
              borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
            }}
          >
            {/* Left: close + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0, flexShrink: 0 }}>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: colors.text.disabled.onLight,
                  flexShrink: 0,
                  transition: 'background-color 150ms',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    colors.hover?.onLight ?? 'rgba(0,0,0,0.04)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                }}
              >
                <CloseIcon size={20} />
              </button>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    ...typography.label.md,
                    color: colors.text.highEmphasis.onLight,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {title}
                </div>
                {subtitle && (
                  <div
                    style={{
                      ...typography.body.xs,
                      color: colors.text.lowEmphasis.onLight,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {subtitle}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Horizontal steps or compact progress */}
            {!isMobile && orientation === 'horizontal' && !isCompact && (
              <StepIndicatorHorizontal
                steps={steps}
                activeStep={safeActiveStep}
                onStepClick={clickable ? handleStepClick : undefined}
                clickable={clickable}
                showSubtitles={showSubtitles}
                colors={colors}
              />
            )}
            {!isMobile && orientation === 'horizontal' && isCompact && (
              <CompactProgress
                steps={steps}
                activeStep={safeActiveStep}
                colors={colors}
              />
            )}

            {/* Right: header buttons */}
            {headerButtons && headerButtons.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                {headerButtons.map((btn, i) => (
                  <Button
                    key={i}
                    emphasis={btn.emphasis}
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                    loading={btn.loading}
                    leftIcon={btn.icon}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* ============ MOBILE STEP NAVIGATION ============ */}
          {isMobile && (
            <MobileHeader steps={steps} activeStep={safeActiveStep} mobileProgress={mobileProgress} colors={colors} />
          )}

          {/* ============ BODY ============ */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', width: '100%' }}>
            {/* Desktop: Vertical sidebar (only when orientation=vertical and not mobile) */}
            {!isMobile && orientation === 'vertical' && (
              <StepIndicatorVertical
                steps={steps}
                activeStep={safeActiveStep}
                onStepClick={clickable ? handleStepClick : undefined}
                clickable={clickable}
                showSubtitles={showSubtitles}
                colors={colors}
              />
            )}

            {/* Step content */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : gridTemplateColumns,
                  minHeight: 0,
                }}
              >
                {children}
              </div>

              {/* ============ FOOTER ============ */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `${spacing.sm} ${spacing.xl}`,
                  borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  backgroundColor: colors.surface.light,
                  flexShrink: 0,
                }}
              >
                {/* Left: Back button */}
                <div>
                  {!isFirstStep && onSecondaryClick && (
                    <Button
                      emphasis="low"
                      onClick={onSecondaryClick}
                      leftIcon={<ChevronLeftIcon />}
                    >
                      {secondaryButtonText}
                    </Button>
                  )}
                </div>

                {/* Right: Next/Complete button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  {onPrimaryClick && (
                    <Button
                      emphasis="high"
                      onClick={onPrimaryClick}
                      rightIcon={!isLastStep ? <ChevronRightIcon /> : undefined}
                    >
                      {effectivePrimaryText}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Screen reader live region */}
          <div
            id={liveRegionId}
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            Step {safeActiveStep + 1} of {steps.length}
            {steps[safeActiveStep]?.label ? `: ${steps[safeActiveStep].label}` : ''}
          </div>
        </div>

        {/* Keyframe animation */}
        <style>{`
          @keyframes taskModalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          [data-task-modal-step]:focus-visible {
            outline: 2px solid var(--color-brand-default);
            outline-offset: 1px;
          }
        `}</style>
      </div>
    )
  },
)

TaskModal.displayName = 'TaskModal'
