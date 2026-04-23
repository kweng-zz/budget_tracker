// ============================================================
// formatters.js
// Pure formatting functions — they take a value and return
// a nicely formatted string. No DOM, no storage, no side effects.
// ============================================================

/**
 * formatKES(amount)
 * Formats a number as Kenyan Shilling currency.
 *
 * Intl.NumberFormat is a built-in browser API — no library needed.
 * 'en-KE' = English as used in Kenya (comma thousands separator)
 * maximumFractionDigits: 0 = no decimal places (we deal in whole shillings)
 *
 * Examples:
 *   formatKES(3200)   → "KES 3,200"
 *   formatKES(85000)  → "KES 85,000"
 *   formatKES(150)    → "KES 150"
 *
 * @param {number} amount
 * @returns {string}
 */

export function formatKES(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount);
}
export function formatKESShort(amount) {
  if (amount >= 1_000_000) {
    return 'KES ' + (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (amount >= 1_000) {
    return 'KES ' + (amount / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return 'KES ' + amount;
}

/**
 * formatDate(dateString)
 * Formats a YYYY-MM-DD date string into a human-readable format.
 *
 * Examples:
 *   formatDate('2024-06-13')  → "13 Jun 2024"
 *   formatDate('2024-01-01')  → "1 Jan 2024"
 *
 * @param {string} dateString - format: "YYYY-MM-DD"
 * @returns {string}
 */
export function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * generateId()
 * Creates a unique ID for each new transaction.
 * Uses Date.now() so IDs are always unique and sortable by time.
 *
 * Example output: "tx_1718234567890"
 *
 * @returns {string}
 */
export function generateId() {
  return 'tx_' + Date.now();
}

/**
 * getTodayDate()
 * Returns today's date as a YYYY-MM-DD string.
 * Used to pre-fill the date field in the form.
 *
 * Example output: "2024-06-13"
 *
 * @returns {string}
 */
export function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}