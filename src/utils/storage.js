// ============================================================
// storage.js
// Handles ALL reading and writing to localStorage.
// Every other file imports from here — nothing else touches
// localStorage directly.
// ============================================================

// The key we use to store data in the browser.
// Using a specific name avoids clashing with other apps.
const STORAGE_KEY = 'bajeti_transactions';

/**
 * getTransactions()
 * Reads the saved transactions array from localStorage.
 * Returns an empty array [] if nothing is saved yet.
 *
 * localStorage only stores strings, so we use JSON.parse()
 * to convert the string back into a JavaScript array.
 */
export function getTransactions() {
  const data = localStorage.getItem(STORAGE_KEY);

  // If nothing saved yet, return empty array (not null)
  if (!data) return [];

  // Convert the JSON string back to a JS array
  return JSON.parse(data);
}

/**
 * saveTransactions(transactions)
 * Saves the full transactions array to localStorage.
 * Always pass the COMPLETE array — this overwrites everything.
 *
 * JSON.stringify() converts the JS array into a string
 * because localStorage can only hold strings.
 *
 * @param {Array} transactions - the full array to save
 */
export function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

/**
 * clearTransactions()
 * Deletes all saved transactions. Useful for testing.
 * Call this in the browser console: 
 *   import('./src/utils/storage.js').then(m => m.clearTransactions())
 */
export function clearTransactions() {
  localStorage.removeItem(STORAGE_KEY);
}