import React, { useState } from 'react'
import { ChevronRight, CreditCard, Landmark, LockKeyhole, TrendingUp, UnlockKeyhole, Upload } from 'lucide-react'

export function SecondaryScreen({ screen, visible, onToggle, onTransfer, onAccount }) {
  const [frozen, setFrozen] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const titles = { cards: 'Cards', orders: 'Orders', products: 'Products', profile: 'Profile' }
  return <div className="screen secondary-screen"><header className="screen-header"><h1 className="header-title">{titles[screen]}</h1></header>
    {screen === 'cards' && <><div className={`demo-card rounded-2xl ${frozen ? 'frozen' : ''}`}><div><span>Girokonto</span><CreditCard size={26} /></div><p>•••• •••• •••• ••••</p><div><small>{frozen ? 'Card frozen' : 'Debit · Demo card'}</small><strong>VISA</strong></div></div><button type="button" className="wide-action rounded-xl" onClick={() => setFrozen(!frozen)}>{frozen ? <UnlockKeyhole size={20} /> : <LockKeyhole size={20} />}{frozen ? 'Unfreeze demo card' : 'Freeze demo card'}</button></>}
    {screen === 'orders' && <><button type="button" className="settings-row panel rounded-2xl" onClick={onTransfer}><Upload size={23} /><span>Transfer</span><ChevronRight size={20} /></button><div className="flow-empty panel rounded-2xl"><h2>No scheduled orders</h2><p>Your scheduled transfers would appear here.</p></div></>}
    {screen === 'products' && <div className="panel rounded-2xl product-options">{[{ id: 'account', icon: Landmark, title: 'Girokonto', body: 'Your current account, balance and transactions.' }, { id: 'portfolio', icon: TrendingUp, title: 'Portfolio', body: 'Your portfolio is currently empty.' }].map(({ id, icon: Icon, title, body }) => <div key={id}><button className="settings-row" type="button" aria-expanded={expanded === id} onClick={() => setExpanded(expanded === id ? null : id)}><Icon size={23} /><span>{title}</span><ChevronRight size={20} /></button>{expanded === id && <div className="product-description"><p>{body}</p>{id === 'account' && <button type="button" className="wide-action rounded-xl" onClick={onAccount}>Open Girokonto</button>}</div>}</div>)}</div>}
    {screen === 'profile' && <><div className="panel rounded-2xl profile-settings"><h2>Display settings</h2><button type="button" className="settings-row" role="switch" aria-checked={visible} onClick={onToggle}><span>Show balances</span><span className={`switch ${visible ? 'on' : ''}`} /></button></div><p className="flow-description">Local prototype · changes last for this session.</p></>}
  </div>
}
