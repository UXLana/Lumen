'use client'

import React from 'react'
import type { UIComponent } from './types'
import { DataTableRenderer } from './DataTableRenderer'
import { EntityCardRenderer } from './EntityCardRenderer'
import { StatCardsRenderer } from './StatCardsRenderer'
import { BannerRenderer } from './BannerRenderer'
import { StepperRenderer } from './StepperRenderer'

export interface ComponentRendererProps {
  component: UIComponent
  accentColor?: string
}

export function ComponentRenderer({ component, accentColor }: ComponentRendererProps) {
  switch (component.type) {
    case 'DATA_TABLE':
      return <DataTableRenderer props={component.props} />
    case 'ENTITY_CARD':
      return <EntityCardRenderer props={component.props} />
    case 'STAT_CARDS':
      return <StatCardsRenderer props={component.props} />
    case 'BANNER':
      return <BannerRenderer props={component.props} />
    case 'STEPPER':
      return <StepperRenderer props={component.props} accentColor={accentColor} />
    default:
      return null
  }
}

ComponentRenderer.displayName = 'ComponentRenderer'
