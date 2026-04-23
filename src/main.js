

import { getTransactions, saveTransactions } from './utils/storage.js';
import { filterByMonth }                      from './utils/calculations.js';
import { renderSummaryCards }                 from './components/SummaryCards.js';
import { renderTransactionForm }              from './components/TransactionForm.js';
import { renderTransactionList }              from './components/TransactionList.js';
import { renderFilterBar }                    from './components/FilterBar.js';
import { renderBreakdown }                    from './components/Breakdown.js';


let activeFilter = 'all';   // 'all' | 'income' | 'expense'
let activeMonth  = 'all';   // 'all' | 'YYYY-MM' e.g. '2024-06'

// ── render() ──────────────────────────────────────────────
// Reads fresh data from storage, then repaints every section.
// Called once on load, and again after every add/delete/filter.

export function render() {
  // 1. Read latest data from localStorage
  const allTransactions = getTransactions();

  // 2. Apply month filter first
  const monthFiltered = filterByMonth(allTransactions, activeMonth);

  // 3. Apply type filter (All / Income / Expense)
  const visible = activeFilter === 'all'
    ? monthFiltered
    : monthFiltered.filter(tx => tx.type === activeFilter);

  // 4. Paint each section — pass data + callbacks into each component
  renderSummaryCards(monthFiltered);   // always use month-filtered for totals
  renderFilterBar(activeFilter, handleFilterChange);
  renderTransactionList(visible, handleDelete);
  renderBreakdown(monthFiltered);

  // 5. Populate month selector with available months
  populateMonthSelector(allTransactions);
}

// ── Event Handlers ─────────────────────────────────────────
// These are passed DOWN into components as callbacks.
// The component calls them when something happens.

export function handleAdd(newTransaction) {
  // Read current data, add new item at the front, save, re-render
  const transactions = getTransactions();
  transactions.unshift(newTransaction); // unshift = add to beginning
  saveTransactions(transactions);
  render();
}

export function handleDelete(id) {
  const confirmed = window.confirm('Delete this transaction?');
  if (!confirmed) return;

  const transactions = getTransactions();
  const updated = transactions.filter(tx => tx.id !== id);
  saveTransactions(updated);
  render();
}

export function handleFilterChange(newFilter) {
  activeFilter = newFilter;
  render();
}

export function handleMonthChange(newMonth) {
  activeMonth = newMonth;
  activeFilter = 'all'; // reset type filter when month changes
  render();
}

// ── Month Selector ─────────────────────────────────────────
// Reads all transactions and builds a list of unique months
// to populate the <select> in the topbar.

function populateMonthSelector(transactions) {
  const select = document.getElementById('month-select');
  if (!select) return;

  // Get unique months from transaction dates
  const months = [...new Set(
    transactions.map(tx => tx.date.slice(0, 7)) // "YYYY-MM-DD" → "YYYY-MM"
  )].sort().reverse(); // newest first

  // Rebuild options
  select.innerHTML = '<option value="all">All time</option>';
  months.forEach(month => {
    const [year, m] = month.split('-');
    const label = new Date(year, m - 1).toLocaleDateString('en-KE', {
      month: 'long', year: 'numeric'
    });
    const option = document.createElement('option');
    option.value = month;
    option.textContent = label;
    if (month === activeMonth) option.selected = true;
    select.appendChild(option);
  });

  // Wire up the change event (safe to re-add — replaceWith clears old listeners)
  select.onchange = (e) => handleMonthChange(e.target.value);
}

// ── Init ───────────────────────────────────────────────────
// Runs once when the page loads.
// Renders the form first (it's static — doesn't depend on data),
// then renders everything else.

function init() {
  // Render the form into #form — it never changes, so render once
  renderTransactionForm(handleAdd);

  // Render the rest of the app from saved data
  render();
}

// Start the app when the DOM is ready
document.addEventListener('DOMContentLoaded', init);