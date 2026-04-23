// ============================================================
// calculations.js
// Pure math functions — they take the transactions array
// and return numbers. No DOM, no storage touched here.
// ============================================================

/**
 * getTotalIncome(transactions)
 * Adds up the amount of every "income" transaction.
 *
 * How .filter() + .reduce() works together:
 *   1. .filter() keeps only transactions where type === 'income'
 *   2. .reduce() loops through them, adding each amount to a running total
 *   The 0 at the end is the starting value of the total.
 *
 * @param {Array} transactions
 * @returns {number}
 */
export function getTotalIncome(transactions) {
  return transactions
    .filter(tx => tx.type === 'income')
    .reduce((total, tx) => total + tx.amount, 0);
}

/**
 * getTotalExpenses(transactions)
 * Adds up the amount of every "expense" transaction.
 *
 * @param {Array} transactions
 * @returns {number}
 */
export function getTotalExpenses(transactions) {
  return transactions
    .filter(tx => tx.type === 'expense')
    .reduce((total, tx) => total + tx.amount, 0);
}

/**
 * getBalance(transactions)
 * Returns income minus expenses.
 * Positive = you have money left. Negative = overspent.
 *
 * @param {Array} transactions
 * @returns {number}
 */
export function getBalance(transactions) {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
}

/**
 * getExpensesByCategory(transactions)
 * Groups expenses by category and sums each group.
 * Returns an array sorted from highest to lowest spend.
 *
 * Example output:
 * [
 *   { category: 'rent',      total: 18000 },
 *   { category: 'food',      total: 5300  },
 *   { category: 'transport', total: 900   },
 * ]
 *
 * How it works:
 *   1. Filter to expenses only
 *   2. Use .reduce() to build an object: { food: 5300, rent: 18000 }
 *   3. Convert that object to an array with Object.entries()
 *   4. Sort highest → lowest
 *   5. Map into clean { category, total } objects
 *
 * @param {Array} transactions
 * @returns {Array}
 */
export function getExpensesByCategory(transactions) {
  const expensesOnly = transactions.filter(tx => tx.type === 'expense');

  // Step 2: group into an object
  const grouped = expensesOnly.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  // Steps 3-5: convert, sort, and reshape
  return Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .map(([category, total]) => ({ category, total }));
}

/**
 * filterByMonth(transactions, monthString)
 * Returns only transactions from a specific month.
 *
 * @param {Array}  transactions
 * @param {string} monthString - format: "YYYY-MM" e.g. "2024-06"
 * @returns {Array}
 */
export function filterByMonth(transactions, monthString) {
  if (monthString === 'all') return transactions;
  return transactions.filter(tx => tx.date.startsWith(monthString));
}