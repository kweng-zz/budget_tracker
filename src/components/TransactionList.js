// ============================================================
// TransactionList.js
// Renders the full list of transactions into #transaction-list.
// Called by render() in main.js on every state change.
// Uses EVENT DELEGATION — one listener handles all delete clicks.
// ============================================================

import { formatKES, formatDate } from '../utils/formatters.js';

// Human-readable labels for each category value
const CATEGORY_LABELS = {
  salary:    'Salary',
  business:  'Business',
  mpesa:     'M-Pesa',
  food:      'Food',
  transport: 'Transport',
  rent:      'Rent',
  health:    'Health',
  other:     'Other',
};

/**
 * renderTransactionList(transactions, onDelete)
 * Paints the list. If empty, shows an empty state message.
 *
 * @param {Array}    transactions - already filtered by main.js
 * @param {Function} onDelete     - called with transaction id
 */
export function renderTransactionList(transactions, onDelete) {
  const container = document.getElementById('transaction-list');
  if (!container) return;

  // ── Empty state ──────────────────────────────────────────
  if (transactions.length === 0) {
    container.innerHTML = `
      <div class="card">
        <div class="empty-state">
          <strong>No transactions yet</strong>
          Add your first one using the form on the left.
        </div>
      </div>
    `;
    return;
  }

  // ── Render the list ──────────────────────────────────────
  // TransactionItem() returns an HTML string for one <li>
  const itemsHTML = transactions
    .map(tx => TransactionItem(tx))
    .join('');

  container.innerHTML = `
    <div class="card">
      <p class="card-title">Transactions</p>
      <ul class="tx-list" id="tx-ul">
        ${itemsHTML}
      </ul>
    </div>
  `;

  // ── Event delegation ─────────────────────────────────────
  // Instead of adding a click listener to EVERY delete button,
  // we add ONE listener to the parent <ul>.
  // When any button inside is clicked, the event "bubbles up"
  // to the <ul> and we check if it was a delete button.
  //
  // This is more efficient AND works even if the list re-renders.

  const list = document.getElementById('tx-ul');
  list.addEventListener('click', (e) => {
    // .closest() walks up the DOM tree looking for [data-delete-id]
    const deleteBtn = e.target.closest('[data-delete-id]');
    if (!deleteBtn) return; // click was on something else

    const id = deleteBtn.dataset.deleteId;
    onDelete(id);
  });
}

// ============================================================
// TransactionItem(tx)
// Returns the HTML string for a single transaction row.
// This is a pure function — same input always gives same output.
// ============================================================

function TransactionItem(tx) {
  const isIncome   = tx.type === 'income';
  const sign       = isIncome ? '+' : '-';
  const amountClass = isIncome ? 'income' : 'expense';
  const dotClass    = isIncome ? 'income' : 'expense';
  const catLabel    = CATEGORY_LABELS[tx.category] || tx.category;

  return `
    <li class="tx-item">
      <div class="tx-indicator ${dotClass}"></div>

      <div class="tx-body">
        <div class="tx-name">${tx.description}</div>
        <div class="tx-meta">
          <span class="tx-date">${formatDate(tx.date)}</span>
          <span class="tx-category">${catLabel}</span>
        </div>
      </div>

      <div class="tx-amount ${amountClass}">
        ${sign}${formatKES(tx.amount)}
      </div>

      <button
        class="tx-delete"
        data-delete-id="${tx.id}"
        title="Delete transaction"
        aria-label="Delete ${tx.description}"
      >&times;</button>
    </li>
  `;
}