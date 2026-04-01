import figma from '@figma/code-connect'
import { DataTable } from './DataTable'

/**
 * Code Connect mapping: Figma Data table → Prism DataTable
 *
 * Figma variant axes (from Data table 60:22551):
 *   - Type: Default, Sticky header, Horizontal scroll, etc.
 *   - Density: Compact, Default, Comfortable
 *
 * DataTable is the most complex component in Prism — it powers
 * the core Metrc interface (packages, transfers, plants, harvests).
 */
figma.connect(
  DataTable,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=60:22551',
  {
    props: {},
    example: () => (
      <DataTable
        columns={[
          { key: 'name', header: 'Package Name', sortable: true },
          { key: 'state', header: 'State' },
          { key: 'status', header: 'Status' },
          { key: 'expires', header: 'Expiration Date' },
        ]}
        data={[
          { name: 'PKG-001', state: 'Colorado', status: 'Active', expires: '2026-12-31' },
          { name: 'PKG-002', state: 'Oregon', status: 'Pending', expires: '2026-06-15' },
        ]}
      />
    ),
  }
)
