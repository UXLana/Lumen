'use client'

import React from 'react'
import { Button, Badge, Avatar, DataTable, type DataTableColumn, type BadgeColor } from '@/components'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  breakpoints,
} from '@/styles/design-tokens'
import { TEAM, type TeamMember } from '../data'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

const ROLE_LABELS: Record<TeamMember['role'], string> = {
  owner: 'Owner',
  admin: 'Admin',
  approver: 'Approver',
  member: 'Member',
  bookkeeper: 'Bookkeeper',
}

const ROLE_COLORS: Record<TeamMember['role'], BadgeColor> = {
  owner: 'brand',
  admin: 'info',
  approver: 'warning',
  member: 'neutral',
  bookkeeper: 'success',
}

export default function TeamPage() {
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  const columns: DataTableColumn<TeamMember>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (m) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <Avatar initials={m.initials} size="sm" color={m.avatarColor} />
          <div>
            <div
              style={{
                fontSize: typography.body.sm.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
              }}
            >
              {m.name}
            </div>
            <div
              style={{
                fontSize: typography.body.xs.fontSize,
                color: colors.text.lowEmphasis.onLight,
              }}
            >
              {m.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      width: '140px',
      render: (m) => (
        <Badge color={ROLE_COLORS[m.role]} variant="outlined" size="sm">
          {ROLE_LABELS[m.role]}
        </Badge>
      ),
    },
    {
      key: 'lastActive',
      header: 'Last active',
      width: '160px',
      render: (m) => (
        <span
          style={{
            fontSize: typography.body.sm.fontSize,
            color: m.lastActive === 'Online now' ? colors.status.success : colors.text.lowEmphasis.onLight,
            fontWeight: m.lastActive === 'Online now' ? fontWeights.semibold : fontWeights.regular,
          }}
        >
          {m.lastActive}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '120px',
      align: 'right',
      render: () => (
        <Button emphasis="low">Manage</Button>
      ),
    },
  ]

  const active = TEAM.filter((t) => t.lastActive === 'Online now').length
  const admins = TEAM.filter((t) => t.role === 'owner' || t.role === 'admin').length

  return (
    <div style={{ padding: isMobile ? spacing.lg : `${spacing['2xl']} ${spacing['3xl']}` }}>
      <header
        style={{
          marginBottom: spacing['2xl'],
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: spacing.lg,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div
            style={{
              fontSize: typography.label.sm.fontSize,
              fontWeight: fontWeights.semibold,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.brand.default,
              marginBottom: spacing['2xs'],
            }}
          >
            Team
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: fontFamilies.display,
              fontSize: typography.heading.h2.fontSize,
              fontWeight: fontWeights.bold,
              letterSpacing: '-0.02em',
              color: colors.text.highEmphasis.onLight,
              lineHeight: 1.15,
            }}
          >
            Members
          </h1>
          <p
            style={{
              margin: `${spacing.xs} 0 0 0`,
              fontSize: typography.body.md.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            {TEAM.length} members · {admins} admins · {active} online now
          </p>
        </div>
        <Button emphasis="high">Invite member</Button>
      </header>

      <DataTable
        columns={columns}
        data={TEAM}
        rowKey={(row) => row.id}
        caption="Team members"
      />
    </div>
  )
}
