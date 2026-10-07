import React, { useEffect, useRef, useState } from 'react'
import { CreditCard, Grid2X2, House, Upload, UserRound } from 'lucide-react'
import { useBanking } from './state/BankingContext'
import { Account, Home } from './components/Screens'
import { BalanceEditor, TransactionEditor } from './components/Editors'
import { Transfer } from './components/Transfer'
import { MoreSheet, AccountDetails, DepositCash, Personalize } from './components/MoreSheet'
import { SecondaryScreen } from './components/SecondaryScreens'

const navItems = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'orders', label: 'Orders', icon: Upload },
  { id: 'products', label: 'Products', icon: Grid2X2 },
  { id: 'profile', label: 'Profile', icon: UserRound },
]

export default function App() {
  const { transactions } = useBanking()
  const [screen, setScreen] = useState('home')
  const [visible, setVisible] = useState(true)
  const [editor, setEditor] = useState(null)
  const [toast, setToast] = useState('')
  const timer = useRef(null)
  const app = useRef(null)
  const transferOrigin = useRef('home')
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => { if (app.current) app.current.inert = Boolean(editor) }, [editor])
  const notify = (message) => {
    clearTimeout(timer.current); setToast(message)
    timer.current = setTimeout(() => setToast(''), 2500)
  }
  const navigate = (next) => { setScreen(next); window.scrollTo(0, 0) }
  const openTransfer = () => { transferOrigin.current = screen; navigate('transfer') }
  const toggleBalance = () => setVisible((value) => !value)
  const openMore = () => setEditor({ type: 'more' })
  const selected = transactions.find((transaction) => transaction.id === editor?.id)
  return <>
    <div ref={app} className="app-shell" aria-hidden={editor ? true : undefined}>
      <main>{screen === 'home' ? <Home visible={visible} onToggle={toggleBalance} onOpenAccount={() => navigate('account')} onEditBalance={() => setEditor({ type: 'balance' })} onTransfer={openTransfer} onMore={openMore} onPersonalize={() => setEditor({ type: 'personalize' })} /> : screen === 'account' ? <Account visible={visible} onBack={() => navigate('home')} onEditTransaction={(id) => setEditor({ type: 'transaction', id })} onToast={notify} onTransfer={openTransfer} onMore={openMore} /> : screen === 'transfer' ? <Transfer visible={visible} onBack={() => navigate(transferOrigin.current)} /> : <SecondaryScreen screen={screen} visible={visible} onToggle={toggleBalance} onTransfer={openTransfer} onAccount={() => navigate('account')} />}</main>
      {!['account', 'transfer'].includes(screen) && <nav className="bottom-nav" aria-label="Main navigation">{navItems.map(({ id, label, icon: Icon }) => <button type="button" key={id} className={`nav-button ${screen === id ? 'active' : ''}`} aria-current={screen === id ? 'page' : undefined} onClick={() => navigate(id)}><span className="nav-icon"><Icon size={22} strokeWidth={1.5} /></span><span>{label}</span></button>)}</nav>}
      {toast && <div className="toast rounded-xl" role="status">{toast}</div>}
    </div>
    {editor?.type === 'balance' && <BalanceEditor onClose={() => setEditor(null)} />}
    {editor?.type === 'transaction' && selected && <TransactionEditor key={selected.id} transaction={selected} onClose={() => setEditor(null)} />}
    {editor?.type === 'more' && <MoreSheet onClose={() => setEditor(null)} onTransactions={() => { setEditor(null); navigate('account') }} onDetails={() => setEditor({ type: 'details' })} onDeposit={() => setEditor({ type: 'deposit' })} />}
    {editor?.type === 'details' && <AccountDetails onClose={() => setEditor(null)} />}
    {editor?.type === 'deposit' && <DepositCash onClose={() => setEditor(null)} />}
    {editor?.type === 'personalize' && <Personalize visible={visible} onToggle={toggleBalance} onClose={() => setEditor(null)} />}
  </>
}
