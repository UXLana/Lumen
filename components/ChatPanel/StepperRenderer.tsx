'use client'

import React from 'react'
import { colors, typography, spacing } from '@/styles/design-tokens'
import type { StepperProps } from './types'

export interface ChatStepperRendererProps {
  props: StepperProps
  accentColor?: string
}

export function StepperRenderer({ props, accentColor = colors.brand.default }: ChatStepperRendererProps) {
  return (
    <div>
      {props.title && (
        <div style={{ ...typography.label.sm, fontWeight: 600, color: colors.text.highEmphasis.onLight, marginBottom: spacing.xs }}>
          {props.title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
        {props.steps.map((step, i) => {
          const isCurrent = step.status === 'current'
          const isComplete = step.status === 'complete'
          return (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              <div
                style={{
                  ...typography.body.xs,
                  fontWeight: 700,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: isComplete || isCurrent ? accentColor : 'transparent',
                  border: !isComplete && !isCurrent ? `1.5px solid ${colors.border.lowEmphasis.onLight}` : 'none',
                  color: isComplete || isCurrent ? colors.text.highEmphasis.onDark : colors.text.disabled.onLight,
                }}
              >
                {isComplete ? '\u2713' : i + 1}
              </div>
              <span
                style={{
                  ...typography.body.xs,
                  color: isCurrent
                    ? colors.text.highEmphasis.onLight
                    : isComplete
                      ? colors.text.lowEmphasis.onLight
                      : colors.text.disabled.onLight,
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

StepperRenderer.displayName = 'StepperRenderer'
