import React from 'react'
import { CircleDollarSign } from 'lucide-react'
import { useLongPress } from '../hooks/useLongPress'
import { formatTransaction } from '../utils/currency'

export function TransactionIcon({ iconType, isPositive }) {
  if (iconType === 'playstation') return <span className="merchant-logo playstation" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 2.5v15l3.2 1V6.1c0-.7.3-1.1.8-.9.6.2.7.8.7 1.5v5c3.2 1.5 5.8 0 5.8-3.6 0-3.7-1.6-5.1-5.1-6.2L10 0.5v2Zm-1.3 13-3.4 1.2c-.9.3-1 .8-.3 1 .7.3 1.8.2 2.6-.1l1.1-.4v2l-2.1.7c-2.5.8-5.1.4-6.3-.3-1.3-.8-.8-2.1 1.4-2.9l7-2.4v1.2Zm5.8 3.5 5.3-1.9c.9-.3 1-.7.3-1-.7-.2-1.8-.2-2.6.1l-3 .9v-2.2l.4-.1c2.4-.8 5.5-.7 7.4.1 1.8.9 2 2.1-.1 2.9l-7.7 2.7V19Z" transform="translate(1 1) scale(.9)" /></svg>
  </span>
  if (iconType === 'bunq') return <span className="merchant-logo bunq" aria-hidden="true"><span>bunq</span></span>
  if (iconType === 'generic') return <span className="merchant-logo generic" aria-hidden="true"><CircleDollarSign size={23} strokeWidth={1.5} /></span>
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 13v7h15v-7" />
    {isPositive ? <path d="M4 4h3a6 6 0 0 1 6 6v5m-4-4 4 4 4-4" /> : <path d="M9 16v-5a5 5 0 0 1 5-5h4m-4-4 4 4-4 4" />}
  </svg>
}

export function TransactionRow({ transaction, visible, onEdit }) {
  const hold = useLongPress(() => onEdit(transaction.id), { delay: 800 })
  return <li>
    <button type="button" className="transaction-row" {...hold} aria-label={`${transaction.name}, ${visible ? formatTransaction(transaction.amount) : 'amount hidden'}. Hold to edit.`} aria-haspopup="dialog" data-testid={transaction.id}>
      <span className="transaction-icon"><TransactionIcon iconType={transaction.iconType} isPositive={transaction.isPositive} /></span>
      <span className="transaction-content">
        <span className="transaction-top"><span className="transaction-name">{transaction.name}</span><span className={`transaction-amount ${transaction.isPositive ? 'positive' : ''}`}>{visible ? formatTransaction(transaction.amount) : '••••••'}</span></span>
        <span className="transaction-meta">{transaction.date} · {transaction.description}</span>
      </span>
    </button>
  </li>
}
