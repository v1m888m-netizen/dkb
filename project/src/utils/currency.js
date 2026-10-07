const balanceFormatter = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const transactionFormatter = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Balance follows the requested comma decimals; transaction typography follows the references.
export function formatBalance(value) {
  return `${value < 0 ? '−' : ''}€${balanceFormatter.format(Math.abs(value))}`
}
export function formatTransaction(value) {
  return `${value < 0 ? '−' : value > 0 ? '+' : ''}€${transactionFormatter.format(Math.abs(value))}`
}
