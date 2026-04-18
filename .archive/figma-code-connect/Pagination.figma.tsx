import figma from '@figma/code-connect'
import { Pagination } from './Pagination'

/**
 * Code Connect mapping: Figma Paginator → Lumen Pagination
 *
 * Figma variant axes (from Paginator 57:91565):
 *   - Type: Default, Compact, Mini
 *   - State: First page, Middle page, Last page
 */
figma.connect(
  Pagination,
  'https://www.figma.com/design/H6WDhK39XVymM0ePeEHz5e?node-id=57:91565',
  {
    props: {},
    example: () => (
      <Pagination
        currentPage={1}
        totalPages={10}
        pageSize={25}
        totalItems={250}
        pageSizeOptions={[10, 25, 50, 100]}
        onPageChange={(page) => console.log('Page:', page)}
        onPageSizeChange={(size) => console.log('Size:', size)}
      />
    ),
  }
)
