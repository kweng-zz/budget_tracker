// ============================================================
// Breakdown.js
// Renders the "Spending by category" bar chart into #breakdown.
// Uses only CSS widths for the bars — no chart library needed.
// Called by render() in main.js on every state change.
// ============================================================

import { getExpensesByCategory, getTotalExpenses } from '../utils/calculations.js';
import { formatKES } from '../utils/formatters.js';

// A colour for each category bar
const CATEGORY_COLORS = {
  food:      '#639922',
  transport: '#BA7517',
  rent:      '#185FA5',
  mpesa:     '#1D9E75',
  health:    '#D4537E',
  salary:    '#378ADD',
  business:  '#7F77DD',
  other:     '#888780',
};

const CATEGORY_LABELS = {
  food:      'Food & groceries',
  transport: 'Matatu / transport',
  rent:      'Rent & utilities',
  mpesa:     'M-Pesa / mobile',
  health:    'Health',
  salary:    'Salary',
  business:  'Business',
  other:     'Other',
};

/**
 * renderBreakdown(transactions)
 * @param {Array} transactions - month-filtered transactions
 */
export function renderBreakdown(transactions) {
  const container = document.getElementById('breakdown');
  if (!container) return;

  const byCategory  = getExpensesByCategory(transactions);
  const totalExpenses = getTotalExpenses(transactions);

  if (byCategory.length === 0) {
    container.innerHTML = `
      <div class="card">
        <p class="card-title">Spending by category</p>
        <div class="empty-state">
          <strong>No expenses yet</strong>
          Add an expense to see your breakdown.
        </div>
      </div>
    `;
    return;
  }

  // The biggest category is always 100% width — others are relative to it
  const maxTotal = byCategory[0].total;

  const barsHTML = byCategory.map(({ category, total }) => {
    const widthPct  = Math.round((total / maxTotal) * 100);
    const shareOfTotal = totalExpenses > 0
      ? Math.round((total / totalExpenses) * 100)
      : 0;
    const color     = CATEGORY_COLORS[category] || '#888780';
    const label     = CATEGORY_LABELS[category]  || category;

    return `
      <div class="breakdown-row">
        <div class="breakdown-meta">
          <span class="breakdown-name">${label}</span>
          <span class="breakdown-amount">${formatKES(total)} <span style="font-size:11px;color:var(--color-text-tertiary);font-weight:400">${shareOfTotal}%</span></span>
        </div>
        <div class="breakdown-track">
          <div
            class="breakdown-fill"
            style="width:${widthPct}%; background:${color};"
          ></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="card">
      <p class="card-title">Spending by category</p>
      ${barsHTML}
    </div>
  `;
}