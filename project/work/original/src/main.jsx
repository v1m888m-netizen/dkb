import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpFromLine,
  BarChart3,
  CreditCard,
  Eye,
  EyeOff,
  Grid2X2,
  Info,
  Landmark,
  Search,
  Send,
  UserRound,
} from 'lucide-react'
import './styles.css'

const transactions = [
  { name: 'PlayStation Network', value: '-€18.99', meta: '05.10.26 · Card payment', type: 'card' },
  { name: 'Bunq', value: '-€1.00', meta: '05.10.26 · Card payment', type: 'bunq' },
  { name: 'DB Vertrieb GmbH', value: '-€0.14', meta: '03.10.26 · Instant credit trans...', type: 'outgoing' },
  { name: 'DB Vertrieb GmbH', value: '-€23.29', meta: '02.10.26 · Instant credit tran...', type: 'outgoing' },
  { name: 'Ben Elias Wibrow', value: '+€1.00', meta: '02.10.26 · Credit (Instant)', type: 'incoming' },
  { name: 'Stichting Finst Custody', value: '-€5.00', meta: '02.10.26 · Instant credit transf...', type: 'outgoing' },
  { name: 'DB Vertrieb GmbH', value: '-€6.00', meta: '02.10.26 · Instant credit transf...', type: 'outgoing' },
  { name: 'DB Vertrieb GmbH', value: '-€29.99', meta: '02.10.26 · Instant credit trans...', type: 'outgoing' },
  { name: 'Daniil Münzner', value: '+€30.00', meta: '02.10.26 · Credit (Instant)', type: 'incoming' },
  { name: 'Stornorechnung zur Abre...', value: '-€0.02', meta: '02.10.26 · Fees / Refunds', type: 'outgoing' },
  { name: 'DKB AG', value: '-€1.65', meta: '01.10.26 · Account closing', type: 'outgoing' },
  { name: 'DB Vertrieb GmbH', value: '-€80.00', meta: '30.09.26 · Instant credit tra...', type: 'outgoing' },
  { name: 'DB Vertrieb GmbH', value: '-€8.99', meta: '30.09.26 · Instant credit trans...', type: 'outgoing' },
  { name: 'Ben Elias Wibrow', value: '+€69.00', meta: '30.09.26 · Credit (Instant)', type: 'incoming' },
  { name: 'DB Vertrieb GmbH', value: '-€80.99', meta: '30.09.26 · Instant credit tra...', type: 'outgoing' },
  { name: 'Ben Elias Wibrow', value: '+€82.00', meta: '30.09.26 · Credit (Instant)', type: 'incoming' },
]

const navItems = [
  { id: 'home', label: 'Home', icon: Landmark },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'orders', label: 'Orders', icon: Send },
  { id: 'products', label: 'Products', icon: Grid2X2 },
  { id: 'profile', label: 'Profile', icon: UserRound },
]

function App() {
  const [screen, setScreen] = useState('home')
  const [visible, setVisible] = useState(true)
  const [toast, setToast] = useState('')

  const revealToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const amount = (value) => visible ? value : '••••••'
  const openAccount = () => setScreen('account')

  return <main className="min-h-screen bg-dkb-ink text-white"><div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-dkb-ink">{screen === 'home' || screen === 'account' ? <>{screen === 'home' ? <Home amount={amount} visible={visible} onToggle={() => setVisible((current) => !current)} onOpenAccount={openAccount} onToast={revealToast} /> : <Account amount={amount} visible={visible} onToggle={() => setVisible((current) => !current)} onBack={() => setScreen('home')} onToast={revealToast} />}</> : <Placeholder screen={screen} />}<BottomNavigation active={screen} onSelect={setScreen} /></div>{toast && <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-dkb-line bg-dkb-panel px-4 py-2 text-sm text-white shadow-2xl">{toast}</div>}</main>
}

function Home({ amount, visible, onToggle, onOpenAccount, onToast }) {
  return <div className="screen-enter flex-1 px-7 pb-28"><header className="relative flex items-center justify-center pt-6"><h1 className="text-[27px] font-semibold tracking-[-0.04em] text-dkb-muted">Home</h1></header><section className="pt-12"><div className="flex items-center gap-4"><p className="text-[39px] font-semibold leading-none tracking-[-0.055em]">{amount('€0,71')}</p><button type="button" onClick={onToggle} aria-label="Toggle balance visibility" className="icon-button text-dkb-muted">{visible ? <Eye size={32} strokeWidth={1.9} /> : <EyeOff size={32} strokeWidth={1.9} />}</button></div><p className="mt-6 text-[21px] tracking-[-0.025em] text-dkb-muted">Current accounts (2/2) <span className="text-2xl">›</span></p></section><section className="mt-8 space-y-4"><button type="button" onClick={onOpenAccount} className="pressable block w-full rounded-[24px] border border-dkb-line bg-dkb-panel p-4 text-left shadow-xl"><div className="flex items-start gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#142b3c] text-dkb-muted"><Landmark size={32} strokeWidth={1.7} /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><h2 className="text-[21px] font-semibold leading-tight">Girokonto</h2><span className="whitespace-nowrap text-[21px] font-medium">{amount('€0,71')}</span></div><p className="mt-1 truncate text-[17px] text-dkb-muted">DE06 1203 0000 1208 9531 23</p><div className="mt-6 flex gap-3"><ActionButton label="Transfer" primary onClick={(event) => { event.stopPropagation(); onToast('Transfer flow ready to start') }} /><ActionButton label="More" onClick={(event) => { event.stopPropagation(); onToast('More account options') }} /></div></div></div></button><div className="rounded-[24px] border border-dkb-line bg-dkb-panel p-4"><div className="flex items-center gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#142b3c] text-dkb-muted"><BarChart3 size={32} strokeWidth={1.7} /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><h2 className="text-[21px] font-semibold">Portfolio</h2><span className="text-[21px] font-medium">{amount('€0.00')}</span></div><div className="mt-2 flex justify-end"><span className="rounded-lg bg-[#0c3d46] px-3 py-1 text-[17px] font-medium text-dkb-teal">{amount('0.00% | €0.00')}</span></div></div></div></div></section><button type="button" onClick={() => onToast('Personalization options opened')} className="pressable mx-auto mt-7 block rounded-xl bg-[#082f46] px-8 py-4 text-[18px] font-semibold text-[#48a9ff]">Personalize</button></div>
}

function Account({ amount, visible, onToggle, onBack, onToast }) {
  return <div className="screen-enter flex-1 px-7 pb-10"><header className="flex items-center justify-between pt-6"><button type="button" onClick={onBack} className="icon-button text-dkb-muted" aria-label="Back"><ArrowLeft size={31} strokeWidth={1.8} /></button><h1 className="text-[27px] font-semibold tracking-[-0.04em] text-dkb-muted">Girokonto</h1><button type="button" onClick={() => onToast('Search is ready')} className="icon-button text-dkb-muted" aria-label="Search"><Search size={32} strokeWidth={1.8} /></button></header><section className="mt-10 rounded-[24px] border border-dkb-line bg-dkb-panel p-5 shadow-xl"><p className="text-[16px] text-dkb-muted">IBAN</p><p className="mt-1 text-[20px] tracking-[-0.02em]">DE06 1203 0000 1208 9531 23</p><p className="mt-7 text-[16px] text-dkb-muted">Account balance incl. pending transactions</p><div className="mt-1 flex items-center justify-between"><p className="text-[40px] font-semibold leading-none tracking-[-0.055em]">{amount('€0,71')}</p><div className="flex items-center gap-3"><button type="button" onClick={onToggle} className="icon-button text-dkb-muted" aria-label="Toggle balance visibility">{visible ? <Eye size={30} strokeWidth={1.9} /> : <EyeOff size={30} strokeWidth={1.9} />}</button><Info size={38} strokeWidth={1.6} className="text-dkb-muted" /></div></div><div className="mt-8 flex gap-3"><ActionButton label="Transfer" primary onClick={() => onToast('Transfer flow ready to start')} /><ActionButton label="More" onClick={() => onToast('More account options')} /></div></section><h2 className="mt-7 text-[27px] font-semibold tracking-[-0.04em]">Last 7 days</h2><div className="mt-4 overflow-hidden rounded-[24px] border border-dkb-line bg-dkb-panel">{transactions.map((transaction) => <TransactionRow key={`${transaction.name}-${transaction.meta}`} transaction={transaction} amount={amount} />)}</div><h2 className="mb-8 mt-7 text-[27px] font-semibold tracking-[-0.04em]">September</h2></div>
}

function ActionButton({ label, primary = false, onClick }) {
  return <button type="button" onClick={onClick} className={`pressable rounded-xl px-7 py-3 text-[17px] font-semibold ${primary ? 'bg-[#0874dd] text-white' : 'bg-[#10344d] text-[#48a9ff]'}`}>{label}</button>
}

function TransactionRow({ transaction, amount }) {
  const icon = transaction.type === 'incoming' ? <ArrowDownToLine size={31} strokeWidth={1.7} /> : transaction.type === 'outgoing' ? <ArrowUpFromLine size={31} strokeWidth={1.7} /> : transaction.type === 'card' ? <span className="grid h-11 w-11 place-items-center rounded-md bg-[#1255b5] text-[22px] font-black text-white">P</span> : <span className="grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br from-[#1bb86b] via-[#56c64c] to-[#ef4d38] text-[11px] font-bold text-white">bunq</span>
  return <div className="flex min-h-[100px] items-center gap-4 border-b border-[#203442] px-4 py-4 last:border-0"><span className="grid h-11 w-11 shrink-0 place-items-center text-dkb-muted">{icon}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-[19px] font-medium">{transaction.name}</p><span className={`shrink-0 rounded-md text-[19px] font-medium ${transaction.type === 'incoming' ? 'bg-[#0c3d46] px-2 text-dkb-teal' : ''}`}>{amount(transaction.value)}</span></div><p className="mt-1 truncate text-[16px] text-dkb-muted">{transaction.meta}</p></div></div>
}

function BottomNavigation({ active, onSelect }) {
  return <nav className="safe-bottom fixed bottom-0 left-1/2 z-20 grid w-full max-w-md -translate-x-1/2 grid-cols-5 border-t border-[#182435] bg-[#0b131a]/95 px-2 pt-2 backdrop-blur-xl">{navItems.map(({ id, label, icon: Icon }) => <button type="button" key={id} onClick={() => onSelect(id)} className={`nav-button ${active === id ? 'active' : ''}`}><span className="nav-icon"><Icon size={28} strokeWidth={1.8} /></span><span>{label}</span></button>)}</nav>
}

function Placeholder({ screen }) {
  const item = navItems.find((navItem) => navItem.id === screen) ?? navItems[0]
  const Icon = item.icon
  return <div className="screen-enter flex min-h-[calc(100vh-74px)] flex-1 flex-col items-center justify-center px-7 pb-16 text-center"><span className="grid h-20 w-20 place-items-center rounded-3xl bg-[#12324a] text-[#48a9ff]"><Icon size={40} strokeWidth={1.7} /></span><h1 className="mt-6 text-3xl font-semibold">{item.label}</h1><p className="mt-3 max-w-[260px] text-base leading-7 text-dkb-muted">Your {item.label.toLowerCase()} and settings will appear here.</p></div>
}

createRoot(document.getElementById('root')).render(<App />)
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'))
