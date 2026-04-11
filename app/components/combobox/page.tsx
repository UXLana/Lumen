'use client'

import React, { useState } from 'react'
import {
  StyleguideLayout,
  sharedStyles,
  CodeBlock,
  SpecTable,
  Playground,
  PillButton,
  StyledCheckbox as StyledCheckboxControl,
  TokenValue,
  CopyableToken,
  PixelValue,
  CollapsibleSection,
  ComponentDocumentation,
  ComponentDocData,
} from '../../design-system/shared'
import { Combobox } from '@/components'
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  fontFamilies,
  fontWeights,
  transitionPresets,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

type PageTab = 'overview' | 'implementation' | 'documentation'

// =============================================================================
// SAMPLE DATA
// =============================================================================

const sampleOptions = [
  { value: 'co', label: 'Colorado' },
  { value: 'ca', label: 'California' },
  { value: 'or', label: 'Oregon' },
  { value: 'wa', label: 'Washington' },
  { value: 'nv', label: 'Nevada' },
  { value: 'mi', label: 'Michigan' },
  { value: 'ma', label: 'Massachusetts' },
  { value: 'il', label: 'Illinois' },
  { value: 'ny', label: 'New York' },
  { value: 'me', label: 'Maine' },
]

const disabledOptions = [
  { value: 'co', label: 'Colorado' },
  { value: 'ca', label: 'California' },
  { value: 'or', label: 'Oregon', disabled: true },
  { value: 'wa', label: 'Washington' },
  { value: 'nv', label: 'Nevada', disabled: true },
]

// =============================================================================
// DOCUMENTATION DATA
// =============================================================================

const comboboxDocData: ComponentDocData = {
  displayName: 'Combobox',
  importPath: '@/components',
  importStatement: `import { Combobox, useCombobox } from '@/components'\nimport type { ComboboxProps, ComboboxOption } from '@/components'`,
  description:
    'A searchable dropdown that combines a text input with a filterable listbox. Supports controlled and uncontrolled modes, async loading, custom filtering, and full WAI-ARIA Combobox pattern compliance.',
  props: [
    { name: 'options', type: 'ComboboxOption[]', description: 'Available options to select from' },
    { name: 'value', type: 'string | null', description: 'Controlled selected value' },
    { name: 'defaultValue', type: 'string | null', description: 'Default selected value (uncontrolled)' },
    { name: 'onSelect', type: '(value, option) => void', description: 'Callback when selection changes' },
    { name: 'onQueryChange', type: '(query: string) => void', description: 'Callback when search query changes' },
    { name: 'filterFn', type: '(options, query) => ComboboxOption[]', description: 'Custom filter function' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows loading state for async search' },
    { name: 'label', type: 'string', description: 'Field label (required)' },
    { name: 'helperText', type: 'string', description: 'Helper text below the field' },
    { name: 'error', type: 'string', description: 'Error message (triggers error state)' },
    { name: 'placeholder', type: 'string', default: "'Search...'", description: 'Placeholder text' },
    { name: 'emptyMessage', type: 'string', default: "'No results found'", description: 'Message when no options match' },
    { name: 'floatingLabel', type: 'boolean', default: 'false', description: 'Places label inside the input container (per Figma Combobox spec)' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the combobox' },
  ],
  accessibility: [
    { feature: 'ARIA Combobox Pattern', description: 'Implements full WAI-ARIA combobox pattern with role="combobox", aria-expanded, aria-controls, aria-activedescendant.' },
    { feature: 'Label Association', description: 'Label linked to input via htmlFor/id.' },
    { feature: 'Keyboard Navigation', description: 'Arrow keys, Home, End, Enter, Escape all supported.' },
    { feature: 'Live Announcements', description: 'aria-live region announces result count for screen readers.' },
    { feature: 'Error Association', description: 'aria-invalid, aria-errormessage, and role="alert" on errors.' },
  ],
  tokens: [
    { token: 'colors.border.midEmphasis.onLight', value: 'Gray border', usage: 'Default border color' },
    { token: 'colors.brand.default', value: 'Theme brand', usage: 'Focus border color' },
    { token: 'colors.status.important', value: 'Error red', usage: 'Error border and message' },
    { token: 'typography.body.sm', value: '14px/20px', usage: 'Input and option text' },
    { token: 'typography.label.md', value: '16px/24px', usage: 'Label text' },
    { token: 'borderRadius.sm', value: borderRadius.sm, usage: 'Input and dropdown border radius' },
    { token: 'shadows.lg', value: 'Large shadow', usage: 'Dropdown shadow' },
  ],
  relatedComponents: [
    { name: 'Input', href: '/components/input' },
    { name: 'Select', href: '/components/select' },
    { name: 'Assistive Message', href: '/components/assistive-message' },
  ],
  notes: [
    'Always provide a label for accessibility — the label is a required prop.',
    'Use onQueryChange for async/server-side filtering paired with the loading prop.',
    'The useCombobox hook can be used standalone for custom combobox UIs.',
  ],
  // ── Usage Intelligence ──
  whenToUse: [
    'Dropdown selection with 15+ options where users benefit from typing to search/filter.',
    'Async or server-side data sources where options load on demand as the user types.',
    'Selections that allow creating new values not in the existing list (create-new pattern).',
    'Any dropdown where keyboard-driven typeahead filtering improves efficiency.',
  ],
  whenNotToUse: [
    { scenario: 'Fewer than 15 predefined static options', instead: 'Select — simpler dropdown, no search input needed' },
    { scenario: 'Free-form text input with no predefined options', instead: 'Input — standard text field without a listbox' },
    { scenario: '2-5 mutually exclusive options visible at once', instead: 'SegmentedControl — all options visible, no dropdown' },
    { scenario: 'Boolean yes/no toggle', instead: 'Switch — on/off toggle, no dropdown needed' },
  ],
  usageExamples: [
    {
      title: 'Searchable state selector',
      description: 'Standard searchable dropdown for large option lists. Users type to filter. Use for any selection with 15+ options.',
      isDefault: true,
      code: `<Combobox\n  label="State"\n  options={usStates}\n  value={selectedState}\n  onChange={setSelectedState}\n  placeholder="Search states..."\n/>`,
    },
    {
      title: 'Async loading with server search',
      description: 'Use onQueryChange + loading for server-side filtering. Good for large datasets like product catalogs.',
      code: `<Combobox\n  label="Product"\n  options={results}\n  value={selected}\n  onChange={setSelected}\n  onQueryChange={handleSearch}\n  loading={isLoading}\n  placeholder="Search products..."\n/>`,
    },
  ],
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function ComboboxPage() {
  const [activePageTab, setActivePageTab] = useState<PageTab>('overview')

  // Playground state
  const [demoValue, setDemoValue] = useState<string | null>(null)
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoError, setDemoError] = useState(false)
  const [demoShowHelper, setDemoShowHelper] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoFloatingLabel, setDemoFloatingLabel] = useState(false)
  const [demoPrefilled, setDemoPrefilled] = useState(false)

  const componentTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'documentation', label: 'Documentation' },
  ]

  return (
    <StyleguideLayout
      title="Combobox"
      description="A searchable dropdown combining a text input with a filterable listbox. Supports keyboard navigation, async loading, and the full WAI-ARIA Combobox pattern."
      tagline="Search, select, create — all in one field."
      activeId="combobox"
      tabs={componentTabs}
      activeTab={activePageTab}
      onTabChange={(id) => setActivePageTab(id as PageTab)}
    >
      {/* ========== OVERVIEW TAB ========== */}
      {activePageTab === 'overview' && (
        <>
          {/* Quick Start */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Quick Start</h2>
            <div style={{ maxWidth: '600px' }}>
              <CodeBlock>{`import { Combobox } from '@/components'

const states = [
  { value: 'co', label: 'Colorado' },
  { value: 'ca', label: 'California' },
  { value: 'or', label: 'Oregon' },
]

<Combobox
  label="State"
  options={states}
  placeholder="Search states..."
  onSelect={(value, option) => console.log(value, option)}
/>`}</CodeBlock>
            </div>
          </section>

          {/* Interactive Playground */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Interactive Playground</h2>
            <p style={sharedStyles.sectionDescription}>
              Experiment with combobox properties to see how they affect the component.
            </p>

            <div style={sharedStyles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Preview */}
                <div>
                  <Playground
                    preview={
                      <div style={{ padding: spacing.md, minHeight: '320px' }}>
                        <Combobox
                          label="Select a state"
                          options={sampleOptions}
                          value={demoValue}
                          onSelect={(val) => setDemoValue(val)}
                          placeholder="Search states..."
                          disabled={demoDisabled}
                          error={demoError ? 'Please select a valid state' : undefined}
                          helperText={demoShowHelper ? 'Choose the state where the license is registered' : undefined}
                          loading={demoLoading}
                          floatingLabel={demoFloatingLabel}
                        />
                      </div>
                    }
                    code={`<Combobox
  label="Select a state"
  options={states}
  value={selected}
  onSelect={(val) => setSelected(val)}
  placeholder="Search states..."${demoPrefilled ? '\n  defaultValue="co"' : ''}${demoFloatingLabel ? '\n  floatingLabel' : ''}${demoDisabled ? '\n  disabled' : ''}${demoError ? '\n  error="Please select a valid state"' : ''}${demoShowHelper ? '\n  helperText="Choose the state where the license is registered"' : ''}${demoLoading ? '\n  loading' : ''}
/>`}
                    previewPadding={spacing.xs}
                  />
                </div>

                {/* Controls */}
                <div>
                  <h3 style={{ ...sharedStyles.cardTitle, marginTop: '0' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                      <label style={{ ...typography.label.sm, display: 'block', marginBottom: '8px' }}>
                        Options
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <StyledCheckboxControl checked={demoFloatingLabel} onChange={() => setDemoFloatingLabel(!demoFloatingLabel)} label="Floating Label" />
                        <StyledCheckboxControl checked={demoPrefilled} onChange={() => {
                          const next = !demoPrefilled
                          setDemoPrefilled(next)
                          setDemoValue(next ? 'co' : null)
                        }} label="Pre-filled Value" />
                        <StyledCheckboxControl checked={demoDisabled} onChange={() => setDemoDisabled(!demoDisabled)} label="Disabled" />
                        <StyledCheckboxControl checked={demoError} onChange={() => setDemoError(!demoError)} label="Error" />
                        <StyledCheckboxControl checked={demoShowHelper} onChange={() => setDemoShowHelper(!demoShowHelper)} label="Helper Text" />
                        <StyledCheckboxControl checked={demoLoading} onChange={() => setDemoLoading(!demoLoading)} label="Loading" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Design Tokens */}
          <section style={sharedStyles.section}>
            <CollapsibleSection title="Design Tokens (for custom implementations)">
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0 }}>
                Spacing, color, and typography values used in the Combobox component. Click any token to copy it.
              </p>

              {/* Spacing & Dimensions */}
              <div style={sharedStyles.card}>
                <h3 style={{ ...sharedStyles.cardTitle, marginTop: 0 }}>Spacing & Dimensions</h3>
                <SpecTable
                  headers={['Element', 'Token', 'Value']}
                  rows={[
                    ['Input padding', <CopyableToken key="ip" token={`${spacing.xs} ${spacing.sm}`} />, <PixelValue key="ipv" value={`${spacing.xs} ${spacing.sm}`} />],
                    ['Label margin-bottom', <CopyableToken key="lmb" token="spacing.2xs" />, <PixelValue key="lmbv" value={spacing['2xs']} />],
                    ['Option padding', <CopyableToken key="op" token={`${spacing.xs} ${spacing.sm}`} />, <PixelValue key="opv" value={`${spacing.xs} ${spacing.sm}`} />],
                    ['Option gap', <CopyableToken key="og" token="spacing.xs" />, <PixelValue key="ogv" value={spacing.xs} />],
                    ['Dropdown padding', <CopyableToken key="dp" token="spacing.2xs" />, <PixelValue key="dpv" value={spacing['2xs']} />],
                    ['Dropdown max-height', <CopyableToken key="dmh" token="240px (fixed)" />, <PixelValue key="dmhv" value="240px" />],
                    ['Dropdown margin-top', <CopyableToken key="dmt" token="spacing.2xs" />, <PixelValue key="dmtv" value={spacing['2xs']} />],
                  ]}
                />
              </div>

              {/* Typography */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Typography</h3>
                <SpecTable
                  headers={['Element', 'Font Size', 'Font Weight', 'Line Height']}
                  rows={[
                    [
                      'Label',
                      <TokenValue key="lfs" token="typography.label.md.fontSize" value={typography.label.md.fontSize} />,
                      <TokenValue key="lfw" token="fontWeights.medium" value="500" />,
                      <TokenValue key="llh" token="typography.label.md.lineHeight" value={typography.label.md.lineHeight} />,
                    ],
                    [
                      'Input text',
                      <TokenValue key="ifs" token="typography.body.sm.fontSize" value={typography.body.sm.fontSize} />,
                      <TokenValue key="ifw" token="fontWeights.regular" value="400" />,
                      <TokenValue key="ilh" token="typography.body.sm.lineHeight" value={typography.body.sm.lineHeight} />,
                    ],
                    [
                      'Option text',
                      <TokenValue key="ofs" token="typography.body.sm.fontSize" value={typography.body.sm.fontSize} />,
                      <TokenValue key="ofw" token="fontWeights.regular" value="400" />,
                      <TokenValue key="olh" token="typography.body.sm.lineHeight" value={typography.body.sm.lineHeight} />,
                    ],
                    [
                      'Helper/Error text',
                      <TokenValue key="hfs" token="typography.body.xs.fontSize" value={typography.body.xs.fontSize} />,
                      <TokenValue key="hfw" token="fontWeights.regular" value="400" />,
                      <TokenValue key="hlh" token="typography.body.xs.lineHeight" value={typography.body.xs.lineHeight} />,
                    ],
                  ]}
                />
              </div>

              {/* Colors */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Colors</h3>
                <SpecTable
                  headers={['State', 'Border', 'Background']}
                  rows={[
                    [
                      'Default',
                      <TokenValue key="db" token="colors.border.midEmphasis.onLight" value={colors.border.midEmphasis.onLight} />,
                      <TokenValue key="dbg" token="colors.surface.light" value={colors.surface.light} />,
                    ],
                    [
                      'Focus / Open',
                      <TokenValue key="fb" token="colors.brand.default" value={colors.brand.default} />,
                      <TokenValue key="fbg" token="colors.surface.light" value={colors.surface.light} />,
                    ],
                    [
                      'Error',
                      <TokenValue key="eb" token="colors.status.important" value={colors.status.important} />,
                      <TokenValue key="ebg" token="colors.surface.light" value={colors.surface.light} />,
                    ],
                    [
                      'Disabled',
                      <TokenValue key="dib" token="colors.border.midEmphasis.onLight" value={colors.border.midEmphasis.onLight} />,
                      <TokenValue key="dibg" token="colors.surface.disabled.onLight" value={colors.surface.disabled.onLight} />,
                    ],
                    [
                      'Option hover',
                      '—',
                      <TokenValue key="ohbg" token="colors.selectedHighlight" value={colors.selectedHighlight} />,
                    ],
                    [
                      'Selected check',
                      <TokenValue key="sc" token="colors.brand.default" value={colors.brand.default} />,
                      '—',
                    ],
                  ]}
                />
              </div>

              {/* Other */}
              <div style={sharedStyles.card}>
                <h3 style={sharedStyles.cardTitle}>Other</h3>
                <SpecTable
                  headers={['Property', 'Token', 'Value']}
                  rows={[
                    ['Input border radius', <CopyableToken key="ibr" token="borderRadius.sm" />, <PixelValue key="ibrv" value={borderRadius.sm} />],
                    ['Option border radius', <CopyableToken key="obr" token="borderRadius.xs" />, <PixelValue key="obrv" value={borderRadius.xs} />],
                    ['Dropdown shadow', <CopyableToken key="ds" token="shadows.lg" />, <PixelValue key="dsv" value={shadows.lg} />],
                    ['Transition', <CopyableToken key="t" token="transitionPresets.fast" />, <PixelValue key="tv" value={transitionPresets.fast} />],
                    ['Dropdown z-index', <CopyableToken key="zi" token="100 (fixed)" />, <PixelValue key="ziv" value="100" />],
                  ]}
                />
              </div>
            </CollapsibleSection>
          </section>
        </>
      )}

      {/* ========== IMPLEMENTATION TAB ========== */}
      {activePageTab === 'implementation' && (
        <>
          {/* Usage */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Usage</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Import</h3>
              <CodeBlock>{`// Package import (recommended for consumers)
import { Combobox } from '@lumen/design-system'

// Or with path alias
import { Combobox } from '@/components'
import type { ComboboxProps, ComboboxOption } from '@/components'`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Basic Usage</h3>
              <CodeBlock>{`// Uncontrolled
<Combobox
  label="State"
  options={states}
  onSelect={(value, option) => console.log(value)}
/>

// Controlled
const [selected, setSelected] = useState<string | null>(null)

<Combobox
  label="State"
  options={states}
  value={selected}
  onSelect={(val) => setSelected(val)}
/>

// With validation
<Combobox
  label="License State"
  options={states}
  error={!selected ? 'State is required' : undefined}
  helperText="Select the state where the license is registered"
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Async / Server-Side Filtering</h3>
              <CodeBlock>{`const [query, setQuery] = useState('')
const [loading, setLoading] = useState(false)
const [results, setResults] = useState<ComboboxOption[]>([])

const handleQueryChange = async (q: string) => {
  setQuery(q)
  setLoading(true)
  const data = await searchFacilities(q)
  setResults(data.map(d => ({ value: d.id, label: d.name })))
  setLoading(false)
}

<Combobox
  label="Search facilities"
  options={results}
  onQueryChange={handleQueryChange}
  loading={loading}
  filterFn={(opts) => opts} // skip client-side filter
/>`}</CodeBlock>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Using the Hook Directly</h3>
              <CodeBlock>{`import { useCombobox } from '@/components'

// Build a completely custom combobox UI
const cb = useCombobox({
  options,
  onSelect: handleSelect,
  comboboxId: 'my-combobox',
})

// cb exposes: status, isOpen, query, filteredOptions,
// activeIndex, selectedValue, handleInputKeyDown, etc.`}</CodeBlock>
            </div>
          </section>

          {/* Props */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Props</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Combobox Props</h3>
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0, marginBottom: spacing.sm }}>
                Extends <code>InputHTMLAttributes&lt;HTMLInputElement&gt;</code> (minus value/onChange/onSelect/size).
              </p>
              <SpecTable
                headers={['Prop', 'Type', 'Default', 'Description']}
                rows={[
                  [<code key="o">options</code>, <code key="ot">{'ComboboxOption[]'}</code>, '(required)', 'Available options'],
                  [<code key="v">value</code>, <code key="vt">{'string | null'}</code>, '—', 'Controlled selected value'],
                  [<code key="dv">defaultValue</code>, <code key="dvt">{'string | null'}</code>, '—', 'Default value (uncontrolled)'],
                  [<code key="os">onSelect</code>, <code key="ost">{'(value, option) => void'}</code>, '—', 'Selection change callback'],
                  [<code key="oq">onQueryChange</code>, <code key="oqt">{'(query: string) => void'}</code>, '—', 'Search query change callback'],
                  [<code key="ff">filterFn</code>, <code key="fft">{'(options, query) => Option[]'}</code>, 'substring', 'Custom filter function'],
                  [<code key="ld">loading</code>, <code key="ldt">boolean</code>, <code key="ldd">false</code>, 'Show loading state'],
                  [<code key="l">label</code>, <code key="lt">string</code>, '(required)', 'Field label'],
                  [<code key="ht">helperText</code>, <code key="htt">string</code>, '—', 'Helper text below field'],
                  [<code key="er">error</code>, <code key="ert">string</code>, '—', 'Error message'],
                  [<code key="p">placeholder</code>, <code key="pt">string</code>, <code key="pd">{"'Search...'"}</code>, 'Placeholder text'],
                  [<code key="em">emptyMessage</code>, <code key="emt">string</code>, <code key="emd">{"'No results found'"}</code>, 'No-match message'],
                  [<code key="fl">floatingLabel</code>, <code key="flt">boolean</code>, <code key="fld">false</code>, 'Places label inside the input container (Figma spec)'],
                  [<code key="d">disabled</code>, <code key="dt">boolean</code>, <code key="dd">false</code>, 'Disable the combobox'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>ComboboxOption</h3>
              <SpecTable
                headers={['Property', 'Type', 'Description']}
                rows={[
                  [<code key="v">value</code>, <code key="vt">string</code>, 'Unique identifier for the option'],
                  [<code key="l">label</code>, <code key="lt">string</code>, 'Display text'],
                  [<code key="d">disabled</code>, <code key="dt">boolean</code>, 'Disables this option'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>useCombobox Hook</h3>
              <p style={{ ...sharedStyles.sectionDescription, marginTop: 0, marginBottom: spacing.sm }}>
                Returns an object with all state, handlers, and refs needed to build a custom combobox UI.
              </p>
              <SpecTable
                headers={['Return', 'Type', 'Description']}
                rows={[
                  [<code key="st">status</code>, <code key="stt">{"'idle' | 'open' | 'loading' | 'empty'"}</code>, 'Current status'],
                  [<code key="io">isOpen</code>, <code key="iot">boolean</code>, 'Whether dropdown is open'],
                  [<code key="q">query</code>, <code key="qt">string</code>, 'Current search query'],
                  [<code key="fo">filteredOptions</code>, <code key="fot">{'ComboboxOption[]'}</code>, 'Filtered options list'],
                  [<code key="ai">activeIndex</code>, <code key="ait">number</code>, 'Highlighted option index'],
                  [<code key="sv">selectedValue</code>, <code key="svt">{'string | null'}</code>, 'Currently selected value'],
                  [<code key="hk">handleInputKeyDown</code>, <code key="hkt">{'(e: KeyboardEvent) => void'}</code>, 'Keyboard handler for input'],
                  [<code key="sq">setQuery</code>, <code key="sqt">{'(q: string) => void'}</code>, 'Update search query'],
                  [<code key="so">selectOption</code>, <code key="sot">{'(option) => void'}</code>, 'Select an option'],
                  [<code key="cs">clearSelection</code>, <code key="cst">{'() => void'}</code>, 'Clear current selection'],
                ]}
              />
            </div>
          </section>

          {/* Design Guidance */}
          <section style={sharedStyles.section}>
            <h2 style={sharedStyles.sectionTitle}>Design Guidance</h2>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When to Use</h3>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Long option lists that benefit from type-ahead filtering (states, facilities, products)</li>
                <li>When users may know what they're looking for and want to type to find it quickly</li>
                <li>Server-side search where options load dynamically based on input</li>
              </ul>
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>When Not to Use</h3>
              <SpecTable
                headers={['Scenario', 'Use Instead']}
                rows={[
                  ['Less than 5 options', 'Select or Radio group'],
                  ['Multi-select needed', 'Checkbox group or multi-select pattern'],
                  ['Free-form text input', 'Input component'],
                  ['Simple yes/no or on/off', 'Switch or Checkbox'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Best Practices</h3>
              <SpecTable
                headers={['Do', "Don't"]}
                rows={[
                  ['Always provide a visible label', 'Use placeholder as the only label'],
                  ['Show a clear empty-state message', 'Leave the dropdown empty with no feedback'],
                  ['Use loading state for async search', 'Silently replace options without indication'],
                  ['Keep option labels concise and scannable', 'Use long paragraph-style option text'],
                  ['Provide error messages with clear guidance', 'Show only red border without explanation'],
                ]}
              />
            </div>

            <div style={sharedStyles.card}>
              <h3 style={sharedStyles.cardTitle}>Accessibility</h3>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: colors.text.highEmphasis.onLight, lineHeight: '1.8', marginBottom: 0 }}>
                <li>Implements the full <strong>WAI-ARIA Combobox</strong> pattern (<code>role=&quot;combobox&quot;</code>, <code>aria-expanded</code>, <code>aria-controls</code>, <code>aria-activedescendant</code>)</li>
                <li>Keyboard: <code>ArrowDown/Up</code> navigates options, <code>Enter</code> selects, <code>Escape</code> closes, <code>Home/End</code> jumps to first/last</li>
                <li><code>aria-live</code> region announces result count as user types</li>
                <li>Error messages use <code>role=&quot;alert&quot;</code> and are linked via <code>aria-errormessage</code></li>
                <li>Disabled options marked with <code>aria-disabled</code></li>
                <li>Selected option visually indicated with checkmark icon and <code>aria-selected</code></li>
              </ul>
            </div>
          </section>
        </>
      )}

      {/* ========== DOCUMENTATION TAB ========== */}
      {activePageTab === 'documentation' && (
        <ComponentDocumentation data={comboboxDocData} />
      )}
    </StyleguideLayout>
  )
}
