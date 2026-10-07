import React from 'react'
import { ArrowLeft, ChevronRight, Eye, EyeOff, Info, Landmark, Search, TrendingUp } from 'lucide-react'
import { useBanking } from '../state/BankingContext'
import { useLongPress } from '../hooks/useLongPress'
import { formatBalance } from '../utils/currency'
import { TransactionRow } from './TransactionRow'

const IBAN = 'DE06 1203 0000 1208 9531 23'
export function ActionButton({ children, primary, onClick }) {
  return <button type="button" onClick={onClick} className={`action-button rounded-xl ${primary ? 'primary' : ''}`}>{children}</button>
}
function AccountActions({ onTransfer, onMore }) {
  return <div className="account-actions"><ActionButton primary onClick={onTransfer}>Transfer</ActionButton><ActionButton onClick={onMore}>More</ActionButton></div>
}

export function Home({ visible, onToggle, onOpenAccount, onEditBalance, onTransfer, onMore, onPersonalize }) {
  const { globalBalance } = useBanking()
  const hold = useLongPress(onEditBalance, { delay: 2000 })
  const balance = visible ? formatBalance(globalBalance) : '••••••'
  return <div className="screen home-screen">
    <header className="screen-header"><h1><button type="button" className="header-title hold-target" {...hold} onDoubleClick={onEditBalance} aria-label="Home. Hold to edit balance." aria-haspopup="dialog">Home</button></h1></header>
    <section className="home-summary"><div className="summary-line"><p className="home-total" data-testid="home-total">{balance}</p><button type="button" className="icon-button eye-button" onClick={onToggle} aria-label={visible ? 'Hide balances' : 'Show balances'}>{visible ? <Eye size={21} strokeWidth={1.6} /> : <EyeOff size={21} strokeWidth={1.6} />}</button></div><p className="accounts-label">Current accounts (2/2)<ChevronRight size={14} strokeWidth={1.5} /></p></section>
    <section className="home-cards" aria-label="Accounts">
      <article className="account-card panel rounded-2xl">
        <button type="button" onClick={onOpenAccount} className="account-open" aria-label="Open Girokonto">
          <span className="account-icon"><Landmark size={24} strokeWidth={1.4} /></span>
          <span className="account-card-details"><span className="card-title-line"><span className="card-title">Girokonto</span><span className="card-balance" data-testid="home-card-balance">{balance}</span></span><span className="iban-home">{IBAN}</span></span>
        </button>
        <AccountActions onTransfer={onTransfer} onMore={onMore} />
      </article>
      <article className="portfolio-card panel rounded-2xl"><span className="account-icon"><TrendingUp size={24} strokeWidth={1.4} /></span><div className="portfolio-details"><div className="card-title-line"><h2 className="card-title">Portfolio</h2><span className="card-balance">{visible ? '€0.00' : '••••••'}</span></div><div className="portfolio-change"><span>{visible ? '0.00% | €0.00' : '••••••'}</span></div></div></article>
    </section>
    <button type="button" className="personalize rounded-xl" onClick={onPersonalize}>Personalize</button>
  </div>
}

export function Account({ visible, onBack, onEditTransaction, onToast, onTransfer, onMore }) {
  const { globalBalance, transactions } = useBanking()
  const [searching, setSearching] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const filtered = transactions.filter((transaction) => `${transaction.name} ${transaction.date} ${transaction.description}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="screen account-screen">
    <header className="screen-header account-header"><button type="button" className="icon-button" aria-label="Back to Home" onClick={onBack}><ArrowLeft size={22} strokeWidth={1.5} /></button><h1 className="header-title">Girokonto</h1><button type="button" className="icon-button" aria-label={searching ? 'Close search' : 'Search transactions'} onClick={() => { setSearching(!searching); setQuery('') }}><Search size={23} strokeWidth={1.5} /></button></header>
    {searching && <div className="search-box"><input autoFocus aria-label="Search transactions" placeholder="Search transactions" value={query} onChange={(event) => setQuery(event.target.value)} /></div>}
    <section className="account-summary panel rounded-2xl"><p className="small-label">IBAN</p><p className="iban-detail">{IBAN}</p><p className="small-label balance-caption">Account balance incl. pending transactions</p><div className="detail-balance-line"><p className="detail-balance" data-testid="account-balance">{visible ? formatBalance(globalBalance) : '••••••'}</p><button className="icon-button" type="button" aria-label="About account balance" onClick={() => onToast('Displayed balance includes pending transactions.')}><Info size={22} strokeWidth={1.5} /></button></div><AccountActions onTransfer={onTransfer} onMore={onMore} /></section>
    <h2 className="section-title">{query ? 'Search results' : 'Last 7 days'}</h2>
    <ul className="transaction-list panel rounded-2xl">{filtered.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} visible={visible} onEdit={onEditTransaction} />)}{filtered.length === 0 && <li className="empty-state">No transactions found.</li>}</ul>
    {!query && <h2 className="section-title september-title">September</h2>}
  </div>
}
