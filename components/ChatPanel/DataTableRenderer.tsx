'use client'

import React from 'react'
import { colors, typography, spacing, borderRadiusSemantics } from '../../styles/design-tokens'
import type { DataTableProps } from './types'

export function DataTableRenderer({ props }: { props: DataTableProps }) {
  return (
    <div
      style={{
        borderRadius: borderRadiusSemantics.card,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        overflow: 'hidden',
      }}
    >
      {props.title && (
        <div
          style={{
            ...typography.label.sm,
            fontWeight: 600,
            color: colors.text.lowEmphasis.onLight,
            backgroundColor: colors.surface.lightDarker,
            padding: `${spacing.xs} ${spacing.sm}`,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {props.title}
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', ...typography.body.xs }}>
        <thead>
          <tr style={{ backgroundColor: colors.surface.lightDarker }}>
            {props.columns.map((col) => (
              <th
                key={col.key}
                style={{
                  ...typography.label.sm,
                  color: colors.text.lowEmphasis.onLight,
                  textAlign: 'left',
                  padding: `${spacing.xs} ${spacing.sm}`,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, i) => (
            <tr
              key={(row.id as string) ?? i}
              style={{ borderTop: `1px solid ${colors.border.lowEmphasis.onLight}` }}
            >
              {props.columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    color: colors.text.highEmphasis.onLight,
                    padding: `${spacing.xs} ${spacing.sm}`,
                  }}
                >
                  {row[col.key] ?? '\u2014'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

DataTableRenderer.displayName = 'DataTableRenderer'
