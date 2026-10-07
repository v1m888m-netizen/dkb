import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Camera, Check, ChevronRight, Notebook, Plus, Search, Upload } from 'lucide-react'
import { useBanking } from '../state/BankingContext'
import { reuseTransfers } from '../data/transfers'
import { formatTransaction } from '../utils/currency'

const emptyDraft = { name: '', iban: '', amount: '', reference: '' }

export function Transfer({ onBack, visible }) {
  const { transactions, recordTransfer, templates, saveTemplate } = useBanking()
  const [view, setView] = useState('list')
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState(emptyDraft)
  const [error, setError] = useState('')
  const [saveAsTemplate, setSaveAsTemplate] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const fileInput = useRef(null)
  const sourceView = useRef('list')
  const submitted = useRef(false)
  useEffect(() => {
    if (!photo) { setPhotoUrl(''); return }
    const url = URL.createObjectURL(photo)
    setPhotoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])
  const changeView = (next) => { setView(next); setError(''); window.scrollTo(0, 0) }
  const beginTransfer = (transfer = emptyDraft) => {
    sourceView.current = view
    setDraft({ ...emptyDraft, ...transfer, amount: transfer.amount === '' ? '' : String(Math.abs(transfer.amount)) })
    setSaveAsTemplate(false); submitted.current = false; changeView('compose')
  }
  const back = () => {
    if (view === 'list') onBack()
    else if (view === 'review') changeView('compose')
    else if (view === 'compose') changeView(sourceView.current)
    else changeView('list')
  }
  const previous = reuseTransfers.map((transfer) => {
    const current = transactions.find((transaction) => transaction.id === transfer.id)
    return current ? { ...transfer, name: current.name, amount: current.amount } : transfer
  }).filter((transfer) => `${transfer.name} ${transfer.iban} ${transfer.reference || ''}`.toLowerCase().includes(query.toLowerCase()))
  const titles = { list: 'Transfer', compose: 'New Transfer', review: 'Review transfer', done: 'Transfer', templates: 'Templates', photo: 'Photo Transfer & QR' }
  return <div className="screen transfer-screen">
    <header className="screen-header account-header"><button type="button" className="icon-button" aria-label="Back" onClick={back}><ArrowLeft size={22} strokeWidth={1.5} /></button><h1 className="header-title">{titles[view]}</h1>{view === 'list' ? <button type="button" className="icon-button" aria-label={searching ? 'Close search' : 'Search transfers'} onClick={() => { setSearching(!searching); setQuery('') }}><Search size={23} strokeWidth={1.5} /></button> : <span className="header-spacer" />}</header>
    {view === 'list' && <>
      {searching && <div className="search-box"><input autoFocus aria-label="Search transfers" placeholder="Name or IBAN" value={query} onChange={(event) => setQuery(event.target.value)} /></div>}
      <div className="transfer-actions panel rounded-2xl">
        <button type="button" onClick={() => beginTransfer()}><Plus size={23} strokeWidth={1.5} /><span>New Transfer</span><ChevronRight size={20} strokeWidth={1.5} /></button>
        <button type="button" onClick={() => changeView('templates')}><Notebook size={23} strokeWidth={1.5} /><span>Templates</span><ChevronRight size={20} strokeWidth={1.5} /></button>
        <button type="button" onClick={() => changeView('photo')}><Camera size={23} strokeWidth={1.5} /><span>Photo Transfer &amp; QR</span><ChevronRight size={20} strokeWidth={1.5} /></button>
      </div>
      <h2 className="section-title reuse-title">Re-Use Transfer</h2>
      <ul className="reuse-list panel rounded-2xl">{previous.map((transfer) => <li key={transfer.id}><button type="button" className="reuse-row" onClick={() => beginTransfer(transfer)} aria-label={`Reuse transfer to ${transfer.name}${visible ? `, ${formatTransaction(transfer.amount)}` : ''}`}><span className="transaction-top"><span className="transaction-name">{transfer.name}</span><span className="transaction-amount">{visible ? formatTransaction(transfer.amount) : '••••••'}</span></span><span className="reuse-iban">{transfer.iban}</span>{transfer.reference && <span className="reuse-iban">{transfer.reference}</span>}</button></li>)}{previous.length === 0 && <li className="empty-state">No transfers found.</li>}</ul>
    </>}
    {view === 'templates' && <><p className="flow-description">Select a saved recipient to start a transfer.</p>{templates.length ? <div className="panel rounded-2xl">{templates.map((template) => <button key={template.id} type="button" className="template-row" onClick={() => beginTransfer(template)}><span>{template.name}<small>{template.iban}</small></span><ChevronRight size={20} /></button>)}</div> : <div className="flow-empty panel rounded-2xl"><Notebook size={32} strokeWidth={1.5} /><h2>No templates yet</h2><p>Save a recipient as a template when creating a transfer.</p></div>}<button type="button" className="wide-action rounded-xl" onClick={() => beginTransfer()}><Plus size={20} />New Transfer</button></>}
    {view === 'photo' && <div className="photo-flow"><div className="flow-empty panel rounded-2xl"><Camera size={38} strokeWidth={1.5} /><h2>Photo Transfer &amp; QR</h2><p>Choose a photo of payment details to keep beside your transfer form.</p><input ref={fileInput} type="file" accept="image/*" capture="environment" className="sr-only" aria-label="Payment photo" onChange={(event) => {
      const file = event.target.files?.[0]
      if (!file) return
      if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) { setError('Choose an image smaller than 10 MB.'); return }
      setPhoto(file); setError('')
    }} /><button type="button" className="wide-action rounded-xl" onClick={() => fileInput.current.click()}><Upload size={20} />{photo ? 'Replace photo' : 'Choose photo'}</button></div>{photoUrl && <img className="payment-photo rounded-2xl" src={photoUrl} alt="Uploaded payment details" />}{error && <p role="alert" className="form-error">{error}</p>}<p className="flow-description">Photo and QR recognition are not connected. Enter the details manually in this local prototype.</p><button type="button" className="primary-button rounded-xl full-width" onClick={() => beginTransfer()}>Enter transfer details</button></div>}
    {view === 'compose' && <form className="transfer-form" onSubmit={(event) => {
      event.preventDefault()
      const amount = Number(draft.amount)
      const iban = draft.iban.replace(/\s/g, '').toUpperCase()
      if (!draft.name.trim() || !/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return setError('Enter a recipient and an IBAN in the correct format.')
      if (!Number.isFinite(amount) || amount <= 0 || amount > 999999999.99) return setError('Enter an amount greater than zero.')
      setDraft((current) => ({ ...current, name: current.name.trim(), iban: iban.match(/.{1,4}/g).join(' ') })); changeView('review')
    }}>
      <p className="flow-description">From Girokonto · DE06 … 9531 23</p>
      {photoUrl && sourceView.current === 'photo' && <img className="payment-photo rounded-2xl" src={photoUrl} alt="Uploaded payment details" />}
      <label className="field">Recipient<input autoComplete="off" required maxLength={120} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
      <label className="field">IBAN<input autoComplete="off" required spellCheck="false" maxLength={42} value={draft.iban} onChange={(event) => setDraft({ ...draft, iban: event.target.value })} /></label>
      <label className="field">Amount (€)<input type="number" inputMode="decimal" min="0.01" max="999999999.99" step="0.01" required value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} /></label>
      <label className="field">Reference<input maxLength={140} value={draft.reference} onChange={(event) => setDraft({ ...draft, reference: event.target.value })} /></label>
      <label className="checkbox-field"><input type="checkbox" checked={saveAsTemplate} onChange={(event) => setSaveAsTemplate(event.target.checked)} />Save recipient as template</label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="primary-button rounded-xl full-width">Review transfer</button>
    </form>}
    {view === 'review' && <><dl className="details-list panel rounded-2xl review-details"><div><dt>Recipient</dt><dd>{draft.name}</dd></div><div><dt>IBAN</dt><dd>{draft.iban}</dd></div><div><dt>Amount</dt><dd>{formatTransaction(-Number(draft.amount))}</dd></div>{draft.reference && <div><dt>Reference</dt><dd>{draft.reference}</dd></div>}</dl><p className="flow-description">Local preview. Confirming updates the demonstration balance and transactions; no money is sent.</p><button type="button" className="primary-button rounded-xl full-width" onClick={() => {
      if (submitted.current) return
      submitted.current = true
      recordTransfer({ ...draft, amount: Number(draft.amount) })
      if (saveAsTemplate) saveTemplate({ ...draft, amount: Number(draft.amount) })
      changeView('done')
    }}>Confirm demo transfer</button></>}
    {view === 'done' && <div className="transfer-success"><span><Check size={38} strokeWidth={1.5} /></span><h2>Demo transfer saved</h2><p>{formatTransaction(-Number(draft.amount))} to {draft.name}</p><button type="button" className="primary-button rounded-xl" onClick={onBack}>Done</button></div>}
  </div>
}
