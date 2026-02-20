/**
 * Metrc Accessibility POC Fix — Plants Page Treegrid
 * ===================================================
 * Addresses 15 ARIA violations in Kendo UI Grid treegrid pattern.
 * Run in browser console or include as a <script> tag.
 *
 * Standards: WCAG 2.2 AA, WAI-ARIA 1.2 Treegrid Pattern
 * Version: 1.0
 * Page: /industry/{license}/plants
 */
(function metrcA11yTreegridFix() {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  // TG-01: Add aria-label to each treegrid
  // ═══════════════════════════════════════════════════════════
  const gridLabels = {
    'motherplants-grid': 'Mother Plants',
    'motherplantsonhold-grid': 'Mother Plants On Hold',
    'motherplantsinactive-grid': 'Mother Plants Inactive',
    'plantbatches-grid': 'Immature Plant Batches',
    'plantbatchesonhold-grid': 'Immature Plant Batches On Hold',
    'plantbatchesinactive-grid': 'Immature Plant Batches Inactive',
    'plantsvegetative-grid': 'Vegetative Plants',
    'plantsflowering-grid': 'Flowering Plants',
    'plantsonhold-grid': 'Plants On Hold',
    'plantsinactive-grid': 'Plants Inactive',
    'harvested-grid': 'Harvested Plants',
    'harvestsonhold-grid': 'Harvests On Hold',
    'harvestsinactive-grid': 'Harvests Inactive',
    'additives-grid': 'Additives',
    'waste-grid': 'Waste'
  };

  Object.entries(gridLabels).forEach(([id, label]) => {
    const grid = document.querySelector(`#${id} [role="treegrid"]`);
    if (grid) grid.setAttribute('aria-label', label);
  });

  // ═══════════════════════════════════════════════════════════
  // TG-07: Label the tablist
  // ═══════════════════════════════════════════════════════════
  const tablist = document.querySelector('[role="tablist"]');
  if (tablist) {
    tablist.setAttribute('aria-label', 'Plant categories');
  }

  // ═══════════════════════════════════════════════════════════
  // TG-08: Fix tab aria-selected and tabindex
  // ═══════════════════════════════════════════════════════════
  document.querySelectorAll('[role="tab"]').forEach((tab, i) => {
    // TG-09: Fix separator pipes
    if (tab.textContent.trim() === '|') {
      tab.setAttribute('role', 'separator');
      tab.setAttribute('aria-hidden', 'true');
      tab.removeAttribute('aria-controls');
      tab.removeAttribute('aria-selected');
      return;
    }

    const isActive = tab.getAttribute('aria-selected') === 'true';
    tab.setAttribute('tabindex', isActive ? '0' : '-1');
    if (!isActive) {
      tab.setAttribute('aria-selected', 'false');
    }
    if (!tab.id || tab.id === '') {
      tab.id = `plants-tab-${i}`;
    }
  });

  // ═══════════════════════════════════════════════════════════
  // TG-10: Fix empty aria-label on export buttons
  // ═══════════════════════════════════════════════════════════
  document.querySelectorAll('button[aria-label=""]').forEach(btn => {
    const title = btn.getAttribute('title');
    if (title) btn.setAttribute('aria-label', title);
  });

  // ═══════════════════════════════════════════════════════════
  // Core grid fix function (applied to each treegrid)
  // ═══════════════════════════════════════════════════════════
  function fixTreegrid(gridContainer) {
    const treegrid = gridContainer.querySelector('[role="treegrid"]');
    if (!treegrid) return;

    const kGrid = $(gridContainer).data('kendoGrid');

    // TG-06: Enable keyboard navigation
    if (treegrid.getAttribute('tabindex') === null) {
      treegrid.setAttribute('tabindex', '0');
    }

    // TG-12: Add row/col counts
    if (kGrid) {
      const total = kGrid.dataSource.total();
      const cols = kGrid.columns.length;
      treegrid.setAttribute('aria-rowcount', total || '0');
      treegrid.setAttribute('aria-colcount', cols || '0');
    }

    // TG-14: Add aria-sort to column headers
    treegrid.querySelectorAll('[role="columnheader"]').forEach(th => {
      if (!th.getAttribute('aria-sort')) {
        th.setAttribute('aria-sort', 'none');
      }
    });
    if (kGrid) {
      const sort = kGrid.dataSource.sort();
      if (sort && sort.length) {
        sort.forEach(s => {
          const col = kGrid.columns.find(c => c.field === s.field);
          if (col) {
            const idx = kGrid.columns.indexOf(col);
            const th = treegrid.querySelectorAll('[role="columnheader"]')[idx];
            if (th) {
              th.setAttribute('aria-sort',
                s.dir === 'asc' ? 'ascending' : 'descending');
            }
          }
        });
      }
    }

    // TG-02, TG-03, TG-04, TG-05, TG-13: Fix data rows
    fixDataRows(treegrid, kGrid);

    // TG-15: Fix pagination controls
    const pager = gridContainer.querySelector('.k-pager-wrap');
    if (pager) {
      const pageInput = pager.querySelector('input[type="text"]');
      if (pageInput && !pageInput.getAttribute('aria-label')) {
        pageInput.setAttribute('aria-label', 'Current page number');
      }
      const pageSelect = pager.querySelector('select');
      if (pageSelect && !pageSelect.getAttribute('aria-label')) {
        pageSelect.setAttribute('aria-label', 'Rows per page');
      }
    }
  }

  function fixDataRows(treegrid, kGrid) {
    const masterRows = treegrid.querySelectorAll('tbody tr.k-master-row');
    const page = kGrid ? (kGrid.dataSource.page() || 1) : 1;
    const size = kGrid ? (kGrid.dataSource.pageSize() || 20) : 20;
    const offset = (page - 1) * size;
    const totalRows = masterRows.length;

    masterRows.forEach((row, i) => {
      // TG-02: aria-level, aria-setsize, aria-posinset
      row.setAttribute('aria-level', '1');
      row.setAttribute('aria-setsize', totalRows.toString());
      row.setAttribute('aria-posinset', (i + 1).toString());

      // TG-13: aria-rowindex
      row.setAttribute('aria-rowindex', (offset + i + 1).toString());

      // TG-03: Move aria-expanded from cell to row
      const expandCell = row.querySelector('td[aria-expanded]');
      if (expandCell) {
        row.setAttribute('aria-expanded', expandCell.getAttribute('aria-expanded'));
        expandCell.removeAttribute('aria-expanded');
      }

      // TG-05: Make expand/collapse keyboard accessible
      const expandLink = row.querySelector('.k-i-expand, .k-i-collapse');
      if (expandLink) {
        expandLink.setAttribute('tabindex', '0');
        expandLink.setAttribute('role', 'button');
        // Add keyboard handler (only once)
        if (!expandLink.dataset.a11yFixed) {
          expandLink.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.click();
            }
          });
          expandLink.dataset.a11yFixed = 'true';
        }
      }
    });

    // TG-04: Fix detail rows
    treegrid.querySelectorAll('tr.k-detail-row').forEach(row => {
      row.setAttribute('role', 'row');
      row.setAttribute('aria-level', '2');
      const detailCell = row.querySelector('.k-detail-cell');
      if (detailCell) {
        detailCell.setAttribute('role', 'gridcell');
      }

      // TG-11: Label nested grids with parent row context
      const masterRow = row.previousElementSibling;
      const tag = masterRow?.querySelector('[role="gridcell"]')?.textContent?.trim();
      const nestedGrid = row.querySelector('[role="grid"]');
      if (nestedGrid && tag) {
        nestedGrid.setAttribute('aria-label', `History for plant ${tag}`);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // Apply fixes to all grids on initial load
  // ═══════════════════════════════════════════════════════════
  document.querySelectorAll('.k-grid').forEach(fixTreegrid);

  // ═══════════════════════════════════════════════════════════
  // Re-apply after expand/collapse and data changes
  // ═══════════════════════════════════════════════════════════
  $(document).on('click', '.k-i-expand, .k-i-collapse', function() {
    const grid = $(this).closest('.k-grid');
    setTimeout(() => fixTreegrid(grid[0]), 500);
  });

  // Re-apply on tab switch
  $('[role="tab"]').on('click', function() {
    setTimeout(() => {
      document.querySelectorAll('.k-grid').forEach(fixTreegrid);
    }, 1000);
  });

  // Re-apply on pagination
  $(document).on('click', '.k-pager-wrap a, .k-pager-wrap .k-state-selected', function() {
    const grid = $(this).closest('.k-grid');
    setTimeout(() => fixTreegrid(grid[0]), 500);
  });

  console.log('[Metrc A11y] Treegrid accessibility fixes applied to',
    document.querySelectorAll('.k-grid').length, 'grids');
})();
