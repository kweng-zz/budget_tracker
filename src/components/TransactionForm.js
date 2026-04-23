// ============================================================
// TransactionForm.js
// Renders the "Add transaction" form into #form.
// Called ONCE by main.js on init — the form never re-renders.
// It calls the onAdd() callback when a valid form is submitted.
// ============================================================

import { generateId, getTodayDate } from '../utils/formatters.js';

// Category options split by type
const INCOME_CATEGORIES = [
  { value: 'salary',   label: 'Salary' },
  { value: 'business', label: 'Business / freelance' },
  { value: 'mpesa',    label: 'M-Pesa received' },
  { value: 'other',    label: 'Other income' },
];

const EXPENSE_CATEGORIES = [
  { value: 'food',      label: 'Food & groceries' },
  { value: 'transport', label: 'Matatu / transport' },
  { value: 'rent',      label: 'Rent & utilities' },
  { value: 'mpesa',     label: 'M-Pesa / mobile' },
  { value: 'health',    label: 'Health' },
  { value: 'business',  label: 'Business expense' },
  { value: 'other',     label: 'Other' },
];

/**
 * renderTransactionForm(onAdd)
 * Injects the form HTML into #form and wires up all events.
 *
 * @param {Function} onAdd - called with a new transaction object
 */
export function renderTransactionForm(onAdd) {
  const container = document.getElementById('form');
  if (!container) return;

  container.innerHTML = `
    <div class="card">
      <p class="card-title">Add transaction</p>

      <div class="form-group">
        <label class="form-label" for="tx-desc">Description</label>
        <input
          class="form-input"
          id="tx-desc"
          type="text"
          placeholder="e.g. Naivas shopping, June salary..."
          autocomplete="off"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="tx-amount">Amount (KES)</label>
        <input
          class="form-input"
          id="tx-amount"
          type="number"
          placeholder="0"
          min="1"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Type</label>
        <div class="type-toggle">
          <button class="type-btn" id="btn-income"  type="button">Income</button>
          <button class="type-btn active-expense" id="btn-expense" type="button">Expense</button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="tx-category">Category</label>
        <select class="form-select" id="tx-category"></select>
      </div>

      <div class="form-group">
        <label class="form-label" for="tx-date">Date</label>
        <input
          class="form-input"
          id="tx-date"
          type="date"
          value="${getTodayDate()}"
        />
      </div>

      <p class="form-error" id="form-error"></p>

      <button class="submit-btn" id="submit-btn" type="button">
        Add transaction
      </button>
    </div>
  `;

  // ── Local state for this form ────────────────────────────
  let currentType = 'expense'; // default to expense

  // ── Wire up elements ─────────────────────────────────────
  const descInput     = document.getElementById('tx-desc');
  const amountInput   = document.getElementById('tx-amount');
  const categorySelect = document.getElementById('tx-category');
  const dateInput     = document.getElementById('tx-date');
  const errorEl       = document.getElementById('form-error');
  const btnIncome     = document.getElementById('btn-income');
  const btnExpense    = document.getElementById('btn-expense');
  const submitBtn     = document.getElementById('submit-btn');

  // Populate categories for the default type
  populateCategories(categorySelect, currentType);

  // ── Type toggle ──────────────────────────────────────────
  btnIncome.addEventListener('click', () => {
    currentType = 'income';
    btnIncome.className  = 'type-btn active-income';
    btnExpense.className = 'type-btn';
    populateCategories(categorySelect, currentType);
  });

  btnExpense.addEventListener('click', () => {
    currentType = 'expense';
    btnExpense.className = 'type-btn active-expense';
    btnIncome.className  = 'type-btn';
    populateCategories(categorySelect, currentType);
  });

  // ── Submit ───────────────────────────────────────────────
  submitBtn.addEventListener('click', () => {
    const desc   = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const cat    = categorySelect.value;
    const date   = dateInput.value;

    // Validate
    if (!desc) {
      showError(errorEl, 'Please enter a description.');
      descInput.focus();
      return;
    }
    if (!amount || amount <= 0) {
      showError(errorEl, 'Please enter a valid amount greater than 0.');
      amountInput.focus();
      return;
    }
    if (!date) {
      showError(errorEl, 'Please select a date.');
      return;
    }

    // Clear any error
    showError(errorEl, '');

    // Build the transaction object
    const newTransaction = {
      id:          generateId(),
      description: desc,
      amount:      amount,
      type:        currentType,
      category:    cat,
      date:        date,
    };

    // Hand it up to main.js
    onAdd(newTransaction);

    // Reset form (keep date and type as-is for quick repeat entry)
    descInput.value  = '';
    amountInput.value = '';
    descInput.focus();
  });

  // Allow Enter key to submit
  [descInput, amountInput].forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitBtn.click();
    });
  });
}

// ── Helpers ──────────────────────────────────────────────────

function populateCategories(selectEl, type) {
  const options = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  selectEl.innerHTML = options
    .map(opt => `<option value="${opt.value}">${opt.label}</option>`)
    .join('');
}

function showError(el, message) {
  el.textContent = message;
}