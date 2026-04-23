import { getTotalIncome, getTotalExpenses, getBalance } from '../utils/calculations.js';
import { formatKES, formatKESShort } from '../utils/formatters.js';


export function renderSummaryCards(transactions) {
    const container = document.getElementById('summary');
    if (!container) return;

    const income = getTotalIncome(transactions);
    const expenses = getTotalExpenses(transactions);
    const balance = getBalance(transactions);

    const balanceClass = balance >= 0 ? 'positive' : 'negative';

    container.innerHTML = `
            <div class="summary-card">
      <div class="summary-label">Balance</div>
      <div class="summary-amount ${balanceClass}">${formatKESShort(balance)}</div>
      <div class="summary-sub">Available</div>
    </div>
 
    <div class="summary-card">
      <div class="summary-label">Income</div>
      <div class="summary-amount income">${formatKESShort(income)}</div>
      <div class="summary-sub">Money in</div>
    </div>
 
    <div class="summary-card">
      <div class="summary-label">Expenses</div>
      <div class="summary-amount expense">${formatKESShort(expenses)}</div>
      <div class="summary-sub">Money out</div>
    </div>

    `;
}