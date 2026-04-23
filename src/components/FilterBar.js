export function renderFilterBar(activeFilter, onFilterChange) {
  const container = document.getElementById('filter');
  if (!container) return;

  const filters = [
    { value: 'all',     label: 'All' },
    { value: 'income',  label: 'Income' },
    { value: 'expense', label: 'Expenses' },
  ];

  container.innerHTML = filters.map(f => `
    <button
      class="filter-btn ${f.value === activeFilter ? 'active' : ''}"
      data-filter="${f.value}"
    >
      ${f.label}
    </button>
  `).join('');

  container.onclick = (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    onFilterChange(btn.dataset.filter);
  };
}