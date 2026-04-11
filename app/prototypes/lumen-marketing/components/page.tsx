'use client'

import React from 'react'
import Link from 'next/link'
import {
  Button,
  Badge,
  Chip,
  ChipGroup,
  Input,
  Avatar,
  Switch,
  Checkbox,
  Radio,
  ProgressBar,
  StatsCard,
  Banner,
  Skeleton,
  Tab,
  TabBar,
  Accordion,
  AccordionItem,
  Divider,
  ListItem,
  Stepper,
  SegmentedControl,
  IconArrowRight,
  IconSearch,
} from '@/components'
import { Select } from '@/components/Select'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadius,
  borderRadiusSemantics,
  transitionPresets,
  breakpoints,
} from '@/styles/design-tokens'

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

// ---------------------------------------------------------------------------
// Component catalog
// ---------------------------------------------------------------------------

type Category =
  | 'all'
  | 'actions'
  | 'forms'
  | 'data'
  | 'feedback'
  | 'navigation'
  | 'layout'

interface ComponentEntry {
  name: string
  category: Exclude<Category, 'all'>
  description: string
  render: () => React.ReactNode
}

const CATALOG: ComponentEntry[] = [
  // Actions
  {
    name: 'Button',
    category: 'actions',
    description: 'Primary, secondary, and text-level actions.',
    render: () => (
      <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
        <Button emphasis="high">Save</Button>
        <Button emphasis="mid">Edit</Button>
        <Button emphasis="low">Cancel</Button>
      </div>
    ),
  },
  {
    name: 'Button · Destructive',
    category: 'actions',
    description: 'Danger variant for irreversible operations.',
    render: () => (
      <Button emphasis="high" destructive>Delete account</Button>
    ),
  },
  {
    name: 'SegmentedControl',
    category: 'actions',
    description: 'Toggle between 2–5 mutually exclusive options.',
    render: () => (
      <SegmentedControlDemo />
    ),
  },
  {
    name: 'Link',
    category: 'actions',
    description: 'Inline text navigation with icon support.',
    render: () => (
      <a
        href="#"
        style={{
          color: colors.brand.default,
          fontFamily: fontFamilies.body,
          fontWeight: fontWeights.medium,
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
        }}
      >
        View documentation →
      </a>
    ),
  },

  // Forms
  {
    name: 'Input',
    category: 'forms',
    description: 'Text input with label, placeholder, and error states.',
    render: () => (
      <div style={{ width: '100%' }}>
        <Input label="Email" placeholder="you@example.com" fullWidth />
      </div>
    ),
  },
  {
    name: 'Select',
    category: 'forms',
    description: 'Dropdown with pre-defined options.',
    render: () => (
      <Select
        options={[
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ]}
        placeholder="Pick a size"
        size="sm"
      />
    ),
  },
  {
    name: 'Checkbox',
    category: 'forms',
    description: 'Single or grouped selection with indeterminate state.',
    render: () => (
      <CheckboxDemo />
    ),
  },
  {
    name: 'Radio',
    category: 'forms',
    description: 'Single choice from a short list.',
    render: () => (
      <RadioDemo />
    ),
  },
  {
    name: 'Switch',
    category: 'forms',
    description: 'Toggle on/off state with an accessible label.',
    render: () => (
      <SwitchDemo />
    ),
  },

  // Data
  {
    name: 'Badge',
    category: 'data',
    description: 'Status and count indicators with semantic colors.',
    render: () => (
      <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
        <Badge color="success">Active</Badge>
        <Badge color="warning">Pending</Badge>
        <Badge color="error">Failed</Badge>
        <Badge color="info">New</Badge>
      </div>
    ),
  },
  {
    name: 'Chip',
    category: 'data',
    description: 'Filterable tags with selection states.',
    render: () => (
      <ChipDemo />
    ),
  },
  {
    name: 'Avatar',
    category: 'data',
    description: 'User avatar with initials fallback and color map.',
    render: () => (
      <div style={{ display: 'flex', gap: spacing.xs, alignItems: 'center' }}>
        <Avatar initials="LH" size="sm" color="brand" />
        <Avatar initials="TR" size="md" color="info" />
        <Avatar initials="PS" size="lg" color="warning" />
      </div>
    ),
  },
  {
    name: 'StatsCard',
    category: 'data',
    description: 'KPI value with label and optional icon.',
    render: () => (
      <StatsCard label="Active users" value="12,480" />
    ),
  },
  {
    name: 'ProgressBar',
    category: 'data',
    description: 'Determinate or indeterminate progress indicator.',
    render: () => (
      <div style={{ width: '100%' }}>
        <ProgressBar value={64} />
      </div>
    ),
  },
  {
    name: 'Skeleton',
    category: 'data',
    description: 'Loading placeholder for async content.',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, width: '100%' }}>
        <Skeleton width="60%" height="16px" />
        <Skeleton width="100%" height="16px" />
        <Skeleton width="80%" height="16px" />
      </div>
    ),
  },

  // Feedback
  {
    name: 'Banner',
    category: 'feedback',
    description: 'Persistent page-level message with optional actions.',
    render: () => (
      <div style={{ width: '100%' }}>
        <Banner variant="info" title="Heads up">
          Your theme will apply to all components on this page.
        </Banner>
      </div>
    ),
  },

  // Navigation
  {
    name: 'TabBar',
    category: 'navigation',
    description: 'Horizontal tab navigation between content panels.',
    render: () => (
      <TabBarDemo />
    ),
  },
  {
    name: 'Stepper',
    category: 'navigation',
    description: 'Linear step indicator for multi-step flows.',
    render: () => (
      <StepperDemo />
    ),
  },

  // Layout
  {
    name: 'Accordion',
    category: 'layout',
    description: 'Collapsible content sections.',
    render: () => (
      <div style={{ width: '100%' }}>
        <Accordion defaultExpandedIds={['overview']}>
          <AccordionItem id="overview" title="What is LUMEN?">
            LUMEN is a themeable design system for building production apps.
          </AccordionItem>
          <AccordionItem id="install" title="How do I install it?">
            npm install @lumen/react
          </AccordionItem>
        </Accordion>
      </div>
    ),
  },
  {
    name: 'Divider',
    category: 'layout',
    description: 'Horizontal or vertical separator between sections.',
    render: () => (
      <div style={{ width: '100%' }}>
        <div
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          Section one
        </div>
        <Divider />
        <div
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          Section two
        </div>
      </div>
    ),
  },
]

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'actions', label: 'Actions' },
  { id: 'forms', label: 'Forms' },
  { id: 'data', label: 'Data' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'layout', label: 'Layout' },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ComponentsPage() {
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)
  const [category, setCategory] = React.useState<Category>('all')
  const [query, setQuery] = React.useState('')

  const filtered = CATALOG.filter((c) => {
    if (category !== 'all' && c.category !== category) return false
    if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="components-heading"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: `${spacing['5xl']} ${isMobile ? spacing.lg : spacing['2xl']} ${spacing['2xl']}`,
        }}
      >
        <Badge color="brand" variant="outlined" size="md">
          Library
        </Badge>
        <h1
          id="components-heading"
          style={{
            fontFamily: fontFamilies.display,
            fontSize: isMobile ? '44px' : typography.display.xl.fontSize,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            fontWeight: fontWeights.bold,
            color: colors.text.highEmphasis.onLight,
            margin: `${spacing.md} 0 ${spacing.lg} 0`,
          }}
        >
          The component library.
        </h1>
        <p
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.xl.fontSize,
            lineHeight: 1.5,
            color: colors.text.lowEmphasis.onLight,
            maxWidth: '680px',
            margin: 0,
          }}
        >
          Every component below is a live LUMEN component. Filter by category or
          search by name. Switch themes in the header to watch the whole gallery
          transform.
        </p>
      </section>

      {/* Filter bar */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: `0 ${isMobile ? spacing.lg : spacing['2xl']} ${spacing['2xl']}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: spacing.md,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: '320px', flex: '1 1 240px' }}>
            <Input
              placeholder="Search components…"
              size="md"
              fullWidth
              value={query}
              onChange={(v) => setQuery(v)}
              startAdornment={<IconSearch size="sm" />}
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ display: 'flex', gap: spacing['2xs'], flexWrap: 'wrap' }}>
            {CATEGORIES.map((c) => {
              const isActive = c.id === category
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  aria-pressed={isActive}
                  style={{
                    padding: `${spacing.xs} ${spacing.md}`,
                    backgroundColor: isActive
                      ? colors.brand.default
                      : colors.surface.light,
                    color: isActive ? '#fff' : colors.text.highEmphasis.onLight,
                    border: `1px solid ${isActive ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
                    borderRadius: borderRadius.full,
                    fontFamily: fontFamilies.body,
                    fontSize: typography.label.sm.fontSize,
                    fontWeight: fontWeights.medium,
                    cursor: 'pointer',
                    transition: `all ${transitionPresets.fast}`,
                  }}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
              fontFamily: fontFamilies.body,
            }}
          >
            {filtered.length} component{filtered.length === 1 ? '' : 's'}
          </span>
        </div>
      </section>

      {/* Gallery grid */}
      <section
        aria-label="Component gallery"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: `0 ${isMobile ? spacing.lg : spacing['2xl']} ${spacing['6xl']}`,
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              padding: spacing['3xl'],
              backgroundColor: colors.surface.lightDarker,
              border: `1px dashed ${colors.border.midEmphasis.onLight}`,
              borderRadius: borderRadiusSemantics.card,
              textAlign: 'center',
              fontFamily: fontFamilies.body,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            No components match “{query}”.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: spacing.md,
            }}
          >
            {filtered.map((entry) => (
              <article
                key={entry.name}
                style={{
                  padding: spacing.lg,
                  backgroundColor: colors.surface.light,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadiusSemantics.card,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.md,
                  minHeight: '220px',
                  transition: `border-color ${transitionPresets.fast}, transform ${transitionPresets.fast}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.border.midEmphasis.onLight
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border.lowEmphasis.onLight
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: fontFamilies.display,
                      fontSize: typography.heading.h6.fontSize,
                      fontWeight: fontWeights.semibold,
                      color: colors.text.highEmphasis.onLight,
                      margin: `0 0 ${spacing['2xs']} 0`,
                    }}
                  >
                    {entry.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: fontFamilies.body,
                      fontSize: typography.body.sm.fontSize,
                      color: colors.text.lowEmphasis.onLight,
                      margin: 0,
                    }}
                  >
                    {entry.description}
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: spacing.md,
                    backgroundColor: colors.surface.lightDarker,
                    borderRadius: borderRadius.md,
                    minHeight: '80px',
                  }}
                >
                  {entry.render()}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

// ---------------------------------------------------------------------------
// Stateful demo components
// ---------------------------------------------------------------------------

function SegmentedControlDemo() {
  const [value, setValue] = React.useState('day')
  return (
    <SegmentedControl
      segments={[
        { id: 'day', label: 'Day' },
        { id: 'week', label: 'Week' },
        { id: 'month', label: 'Month' },
      ]}
      value={value}
      onChange={(id) => setValue(id)}
    />
  )
}

function CheckboxDemo() {
  const [checked, setChecked] = React.useState(true)
  return <Checkbox checked={checked} onChange={setChecked} label="Receive updates" />
}

function RadioDemo() {
  const [value, setValue] = React.useState('team')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
      <Radio checked={value === 'solo'} onChange={() => setValue('solo')} label="Solo" name="radio-demo" />
      <Radio checked={value === 'team'} onChange={() => setValue('team')} label="Team" name="radio-demo" />
    </div>
  )
}

function SwitchDemo() {
  const [on, setOn] = React.useState(true)
  return <Switch checked={on} onChange={setOn} label="Notifications" />
}

function ChipDemo() {
  const [selected, setSelected] = React.useState<string[]>(['design'])
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  return (
    <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
      {['design', 'eng', 'research'].map((id) => (
        <Chip
          key={id}
          state={selected.includes(id) ? 'active' : 'default'}
          onClick={() => toggle(id)}
        >
          {id}
        </Chip>
      ))}
    </div>
  )
}

function TabBarDemo() {
  const [active, setActive] = React.useState('overview')
  return (
    <div style={{ width: '100%' }}>
      <TabBar
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'activity', label: 'Activity' },
          { id: 'settings', label: 'Settings' },
        ]}
        activeTabId={active}
        onTabChange={(id) => setActive(id)}
      />
    </div>
  )
}

function StepperDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Stepper
        steps={[
          { id: '1', label: 'Install', status: 'completed' },
          { id: '2', label: 'Configure', status: 'active' },
          { id: '3', label: 'Deploy', status: 'pending' },
        ]}
      />
    </div>
  )
}
