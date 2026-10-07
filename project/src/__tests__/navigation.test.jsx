import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { BankingProvider } from '../state/BankingContext'
import App from '../App'

beforeEach(() => { vi.spyOn(window, 'scrollTo').mockImplementation(() => {}) })
afterEach(() => { cleanup(); vi.restoreAllMocks() })
function setup() { render(<BankingProvider><App /></BankingProvider>) }
function click(name) { fireEvent.click(screen.getByRole('button', { name, exact: true })) }

describe('Transfer navigation', () => {
  it('opens all seven reference transfers and supports search and back', () => {
    setup(); click('Transfer')
    expect(screen.getByRole('heading', { name: 'Transfer', exact: true })).toBeTruthy()
    expect(screen.getAllByRole('button', { name: /Reuse transfer/ })).toHaveLength(7)
    expect(screen.getByText('HH3CPDGZN1UDHH')).toBeTruthy()
    expect(screen.queryByRole('navigation')).toBe(null)
    click('Search transfers')
    fireEvent.change(screen.getByRole('textbox', { name: 'Search transfers' }), { target: { value: 'stichting' } })
    expect(screen.getAllByRole('button', { name: /Reuse transfer/ })).toHaveLength(1)
    click('Close search'); click('Back')
    expect(screen.getByTestId('home-total').textContent).toBe('€0,71')
  })
  it('prefills a reused transfer, records only after confirmation and saves a reusable template', () => {
    setup(); click('Transfer')
    fireEvent.click(screen.getAllByRole('button', { name: /Reuse transfer/ })[0])
    expect(screen.getByLabelText('Recipient').value).toBe('DB Vertrieb GmbH')
    expect(screen.getByLabelText('IBAN').value).toBe('DE53 1001 2345 4224 6449 11')
    expect(screen.getByLabelText('Amount (€)').value).toBe('0.14')
    fireEvent.click(screen.getByLabelText('Save recipient as template'))
    click('Review transfer'); click('Confirm demo transfer'); click('Done')
    expect(screen.getByTestId('home-total').textContent).toBe('€0,57')
    click('Open Girokonto')
    expect(screen.getByTestId('account-balance').textContent).toBe('€0,57')
    expect(screen.getByText(/· Bank transfer$/)).toBeTruthy()
    click('Back to Home'); click('Transfer'); click('Templates')
    fireEvent.click(screen.getByRole('button', { name: /DB Vertrieb GmbH DE53/ }))
    expect(screen.getByLabelText('Amount (€)').value).toBe('0.14')
  })
  it('rejects malformed recipient details and discards unconfirmed transfers', () => {
    setup(); click('Transfer'); click('New Transfer')
    fireEvent.change(screen.getByLabelText('Recipient'), { target: { value: 'Test recipient' } })
    fireEvent.change(screen.getByLabelText('IBAN'), { target: { value: 'incorrect' } })
    fireEvent.change(screen.getByLabelText('Amount (€)'), { target: { value: '10' } })
    click('Review transfer')
    expect(screen.getByRole('alert').textContent).toContain('IBAN')
    click('Back'); click('Back')
    expect(screen.getByTestId('home-total').textContent).toBe('€0,71')
  })
  it('returns to Girokonto when transfer was opened from that screen', () => {
    setup(); click('Open Girokonto'); click('Transfer'); click('Back')
    expect(screen.getByTestId('account-balance').textContent).toBe('€0,71')
  })
  it('opens photo input flow and manual transfer entry', () => {
    setup(); click('Transfer'); click('Photo Transfer & QR')
    expect(screen.getByLabelText('Payment photo').getAttribute('accept')).toBe('image/*')
    click('Enter transfer details')
    expect(screen.getByLabelText('Recipient').value).toBe('')
    click('Back')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Photo Transfer & QR')
  })
})

describe('More sheet and Home controls', () => {
  it.each(['backdrop', 'handle', 'title', 'escape'])('dismisses via %s', (method) => {
    setup(); click('More')
    expect(screen.getByRole('dialog', { name: 'More' })).toBeTruthy()
    expect(screen.getByText('Max. €999 within 24 hours.')).toBeTruthy()
    if (method === 'backdrop') fireEvent.pointerDown(screen.getByTestId('modal-backdrop'))
    if (method === 'handle') click('Dismiss More menu')
    if (method === 'title') fireEvent.click(screen.getByRole('heading', { name: 'More' }))
    if (method === 'escape') fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBe(null)
    expect(screen.getByTestId('home-total').textContent).toBe('€0,71')
  })
  it('routes Transactions and displays account details', () => {
    setup(); click('More'); click('Transactions')
    expect(screen.getByTestId('transaction-1')).toBeTruthy()
    click('Back to Home'); click('More'); click('Account details')
    expect(within(screen.getByRole('dialog')).getByText('DE06 1203 0000 1208 9531 23')).toBeTruthy()
    click('Close editor')
    expect(screen.queryByRole('dialog')).toBe(null)
  })
  it('previews a cash deposit without changing the balance', () => {
    setup(); click('More'); click('Deposit Cash Max. €999 within 24 hours.')
    expect(screen.getByLabelText('Deposit amount (€)').max).toBe('999')
    fireEvent.change(screen.getByLabelText('Deposit amount (€)'), { target: { value: '20' } })
    click('Preview deposit')
    expect(screen.getByText('Local preview only. No deposit code has been issued.')).toBeTruthy()
    click('Done')
    expect(screen.getByTestId('home-total').textContent).toBe('€0,71')
  })
  it('personalization and Profile share the visibility setting', () => {
    setup(); click('Personalize')
    fireEvent.click(screen.getByRole('switch', { name: 'Show balances' }))
    click('Done')
    expect(screen.getByTestId('home-total').textContent).toBe('••••••')
    click('Profile')
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('false')
    fireEvent.click(screen.getByRole('switch')); click('Home')
    expect(screen.getByTestId('home-total').textContent).toBe('€0,71')
  })
  it('all bottom tabs respond, including local card freezing', () => {
    setup(); click('Cards'); click('Freeze demo card')
    expect(screen.getByText('Card frozen')).toBeTruthy()
    click('Unfreeze demo card'); click('Orders')
    expect(screen.getByText('No scheduled orders')).toBeTruthy()
    click('Products'); click('Girokonto'); click('Open Girokonto')
    expect(screen.getByTestId('account-balance')).toBeTruthy()
  })
})
