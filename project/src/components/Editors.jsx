import React, { useState } from 'react'
import { Modal } from './Modal'
import { useBanking, validAmount } from '../state/BankingContext'

function AmountField({ value, onChange }) {
  return <label className="field">Amount (€)<input autoComplete="off" type="number" inputMode="decimal" step="0.01" min="-999999999.99" max="999999999.99" required value={value} onChange={(event) => onChange(event.target.value)} /></label>
}
function Actions({ onClose }) {
  return <div className="modal-actions"><button type="button" className="secondary-button rounded-xl" onClick={onClose}>Cancel</button><button type="submit" className="primary-button rounded-xl">Save</button></div>
}

export function BalanceEditor({ onClose }) {
  const { globalBalance, setGlobalBalance } = useBanking()
  const [amount, setAmount] = useState(String(globalBalance))
  const [error, setError] = useState('')
  return <Modal title="Edit balance" onClose={onClose}>
    <p className="modal-description">Updates Home and Girokonto together.</p>
    <form onSubmit={(event) => {
      event.preventDefault()
      if (!amount.trim() || !validAmount(Number(amount))) return setError('Enter a valid amount.')
      setGlobalBalance(Number(amount)); onClose()
    }}>
      <AmountField value={amount} onChange={setAmount} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <Actions onClose={onClose} />
    </form>
  </Modal>
}

export function TransactionEditor({ transaction, onClose }) {
  const { updateTransaction } = useBanking()
  const [draft, setDraft] = useState({ ...transaction, amount: String(transaction.amount) })
  const [error, setError] = useState('')
  const set = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  return <Modal title="Edit Transaction" onClose={onClose}>
    <form onSubmit={(event) => {
      event.preventDefault()
      if (!draft.name.trim() || !draft.date.trim() || !draft.amount.trim() || !validAmount(Number(draft.amount))) return setError('Enter a title, date and valid amount.')
      updateTransaction(transaction.id, { ...draft, amount: Number(draft.amount) }); onClose()
    }}>
      <label className="field">Icon<select value={draft.iconType} onChange={(event) => set('iconType', event.target.value)}>
        <option value="playstation">PlayStation</option><option value="bunq">Bunq</option><option value="transfer">Bank transfer</option><option value="generic">Green generic</option>
      </select></label>
      <label className="field">Name / Title<input required maxLength={120} value={draft.name} onChange={(event) => set('name', event.target.value)} /></label>
      <AmountField value={draft.amount} onChange={(value) => set('amount', value)} />
      <div className="amount-preview" data-positive={Number(draft.amount) > 0}>{Number(draft.amount) > 0 ? 'Positive · teal' : 'Outgoing or zero · white'}</div>
      <label className="field">Date<input required maxLength={30} value={draft.date} onChange={(event) => set('date', event.target.value)} /></label>
      <label className="field">Type / Description<input maxLength={160} value={draft.description} onChange={(event) => set('description', event.target.value)} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <Actions onClose={onClose} />
    </form>
  </Modal>
}
