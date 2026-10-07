import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import { BankingProvider } from './state/BankingContext'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')).render(<React.StrictMode><BankingProvider><App /></BankingProvider></React.StrictMode>)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error) => console.warn('Offline support unavailable:', error))
  })
}
