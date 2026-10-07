import React, { useState } from 'react'
import { Barcode, ChevronRight, Copy, Landmark, List, QrCode } from 'lucide-react'
import { Modal } from './Modal'

export function MoreSheet({ onClose, onTransactions, onDetails, onDeposit }) {
  return <Modal title="More" variant="sheet" onClose={onClose}>
    <div className="more-options panel rounded-2xl">
      <button type="button" className="more-option" onClick={onTransactions}><Landmark size={23} strokeWidth={1.5} /><span>Transactions</span></button>
      <button type="button" className="more-option" onClick={onDetails}><List size={23} strokeWidth={1.5} /><span>Account details</span></button>
      <button type="button" className="more-option deposit-option" onClick={onDeposit}><Barcode size={23} strokeWidth={1.5} /><span>Deposit Cash<small>Max. €999 within 24 hours.</small></span></button>
    </div>
  </Modal>
}

export function AccountDetails({ onClose }) {
  const [copied, setCopied] = useState(false)
  return <Modal title="Account details" onClose={onClose}>
    <dl className="details-list"><div><dt>Account</dt><dd>Girokonto</dd></div><div><dt>IBAN</dt><dd>DE06 1203 0000 1208 9531 23</dd></div><div><dt>Currency</dt><dd>EUR</dd></div></dl>
    <button type="button" className="wide-action rounded-xl" onClick={async () => {
      try { await navigator.clipboard.writeText('DE06120300001208953123'); setCopied(true) } catch { setCopied(false) }
    }}><Copy size={18} />{copied ? 'IBAN copied' : 'Copy IBAN'}</button>
  </Modal>
}

export function DepositCash({ onClose }) {
  const [amount, setAmount] = useState('')
  const [preview, setPreview] = useState(false)
  return <Modal title="Deposit Cash" onClose={onClose}>
    <p className="modal-description">Max. €999 within 24 hours.</p>
    {preview ? <div className="deposit-preview"><QrCode size={70} strokeWidth={1} /><h3>€{Number(amount).toFixed(2)}</h3><p>Local preview only. No deposit code has been issued.</p><button type="button" className="primary-button rounded-xl" onClick={onClose}>Done</button></div> : <form onSubmit={(event) => { event.preventDefault(); if (Number(amount) > 0 && Number(amount) <= 999) setPreview(true) }}><label className="field">Deposit amount (€)<input required type="number" min="0.01" max="999" step="0.01" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} /></label><div className="modal-actions"><button type="submit" className="primary-button rounded-xl">Preview deposit</button></div></form>}
  </Modal>
}

export function Personalize({ visible, onToggle, onClose }) {
  return <Modal title="Personalize" onClose={onClose}><p className="modal-description">Choose how balances appear on your Home screen.</p><button type="button" className="settings-row" role="switch" aria-checked={visible} onClick={onToggle}><span>Show balances</span><span className={`switch ${visible ? 'on' : ''}`} /></button><button type="button" className="wide-action rounded-xl" onClick={onClose}>Done<ChevronRight size={18} /></button></Modal>
}
