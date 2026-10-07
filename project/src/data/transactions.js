const seed = [
  ['playstation', 'PlayStation Network', -18.99, '05.10.26', 'Card payment'],
  ['bunq', 'Bunq', -1, '05.10.26', 'Card payment'],
  ['transfer', 'DB Vertrieb GmbH', -0.14, '03.10.26', 'Instant credit transfer'],
  ['transfer', 'DB Vertrieb GmbH', -23.29, '02.10.26', 'Instant credit transfer'],
  ['transfer', 'Ben Elias Wibrow', 1, '02.10.26', 'Credit (Instant)'],
  ['transfer', 'Stichting Finst Custody', -5, '02.10.26', 'Instant credit transfer'],
  ['transfer', 'DB Vertrieb GmbH', -6, '02.10.26', 'Instant credit transfer'],
  ['transfer', 'DB Vertrieb GmbH', -29.99, '02.10.26', 'Instant credit transfer'],
  ['transfer', 'Daniil Münzner', 30, '02.10.26', 'Credit (Instant)'],
  ['transfer', 'Stornorechnung zur Abrechnung', -0.02, '02.10.26', 'Fees / Refunds'],
  ['transfer', 'DKB AG', -1.65, '01.10.26', 'Account closing'],
  ['transfer', 'DB Vertrieb GmbH', -80, '30.09.26', 'Instant credit transfer'],
  ['transfer', 'DB Vertrieb GmbH', -8.99, '30.09.26', 'Instant credit transfer'],
  ['transfer', 'Ben Elias Wibrow', 69, '30.09.26', 'Credit (Instant)'],
  ['transfer', 'DB Vertrieb GmbH', -80.99, '30.09.26', 'Instant credit transfer'],
  ['transfer', 'Ben Elias Wibrow', 82, '30.09.26', 'Credit (Instant)'],
]

export const initialTransactions = seed.map(([iconType, name, amount, date, description], index) => ({
  id: `transaction-${index + 1}`, iconType, name, amount, date, description, isPositive: amount > 0,
}))
export const iconTypes = ['playstation', 'bunq', 'transfer', 'generic']
