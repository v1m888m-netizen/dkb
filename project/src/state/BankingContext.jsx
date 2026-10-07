import React, { createContext, useContext, useMemo, useReducer } from 'react'
import { initialTransactions, iconTypes } from '../data/transactions'

const BankingContext = createContext(null)
export const initialState = { globalBalance: 0.71, transactions: initialTransactions, templates: [] }
export const validAmount = (value) => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 999999999.99
const cents = (value) => Math.round((value + Math.sign(value) * Number.EPSILON) * 100) / 100

export function bankingReducer(state, action) {
  switch (action.type) {
    case 'balance/set':
      return validAmount(action.amount) ? { ...state, globalBalance: cents(action.amount) } : state
    case 'transaction/update': {
      const { id, changes } = action
      if (!validAmount(changes.amount) || !iconTypes.includes(changes.iconType) || !changes.name?.trim() || !changes.date?.trim()) return state
      return { ...state, transactions: state.transactions.map((transaction) => transaction.id === id ? {
        ...transaction,
        iconType: changes.iconType,
        name: changes.name.trim(),
        amount: cents(changes.amount),
        date: changes.date.trim(),
        description: changes.description?.trim() ?? '',
        isPositive: cents(changes.amount) > 0,
      } : transaction) }
    }
    case 'transfer/record': {
      const { transfer } = action
      if (!validAmount(transfer.amount) || transfer.amount <= 0 || !transfer.name?.trim() || !validAmount(state.globalBalance - transfer.amount)) return state
      return {
        ...state,
        globalBalance: cents(state.globalBalance - transfer.amount),
        transactions: [{ id: transfer.id, name: transfer.name.trim(), amount: -cents(transfer.amount), iconType: 'transfer', date: transfer.date, description: transfer.reference ? `Transfer · ${transfer.reference}` : 'Bank transfer', isPositive: false }, ...state.transactions],
      }
    }
    case 'template/save':
      return { ...state, templates: [...state.templates.filter((template) => template.iban !== action.template.iban), action.template] }
    default: return state
  }
}

export function BankingProvider({ children }) {
  const [state, dispatch] = useReducer(bankingReducer, initialState)
  const value = useMemo(() => ({
    ...state,
    setGlobalBalance: (amount) => dispatch({ type: 'balance/set', amount }),
    updateTransaction: (id, changes) => dispatch({ type: 'transaction/update', id, changes }),
    recordTransfer: (transfer) => dispatch({ type: 'transfer/record', transfer: { ...transfer, id: crypto.randomUUID(), date: new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date()) } }),
    saveTemplate: (template) => dispatch({ type: 'template/save', template: { ...template, id: crypto.randomUUID() } }),
  }), [state])
  return <BankingContext.Provider value={value}>{children}</BankingContext.Provider>
}

export function useBanking() {
  const context = useContext(BankingContext)
  if (!context) throw new Error('useBanking must be used within BankingProvider')
  return context
}
