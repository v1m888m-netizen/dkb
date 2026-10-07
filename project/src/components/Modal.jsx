import React, { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

export function Modal({ title, onClose, children, variant = 'dialog' }) {
  const titleId = useId()
  const panel = useRef(null)
  const opener = useRef(document.activeElement)
  const close = useRef(onClose)
  const dragStart = useRef(null)
  close.current = onClose

  useEffect(() => {
    const previousFocus = opener.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusable = () => [...panel.current.querySelectorAll('button, input, select, textarea, [tabindex="0"]')].filter((element) => !element.disabled)
    ;(panel.current.querySelector('input, select') || panel.current.querySelector('button'))?.focus()
    function onKeyDown(event) {
      if (event.key === 'Escape') { event.preventDefault(); close.current(); return }
      if (event.key !== 'Tab') return
      const elements = focusable()
      const first = elements[0]
      const last = elements.at(-1)
      if (event.shiftKey && (document.activeElement === first || !panel.current.contains(document.activeElement))) {
        event.preventDefault(); last?.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !panel.current.contains(document.activeElement))) {
        event.preventDefault(); first?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      queueMicrotask(() => { if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true }) })
    }
  }, [])

  return <div className={`modal-overlay ${variant === 'sheet' ? 'sheet-overlay' : ''}`} data-testid="modal-backdrop" onPointerDown={(event) => {
    if (event.target === event.currentTarget) onClose()
  }}>
    <section ref={panel} className={`editor-modal rounded-2xl ${variant === 'sheet' ? 'sheet-modal' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={variant === 'sheet' ? (event) => { if (!event.target.closest('button, input, select, a, label')) onClose() } : undefined}>
      {variant === 'sheet' && <button type="button" className="sheet-handle" aria-label="Dismiss More menu" onClick={onClose} onPointerDown={(event) => { dragStart.current = event.clientY; event.currentTarget.setPointerCapture?.(event.pointerId) }} onPointerUp={(event) => { if (dragStart.current !== null && event.clientY - dragStart.current > 35) onClose(); dragStart.current = null }} onPointerCancel={() => { dragStart.current = null }}><span /></button>}
      <div className="modal-heading"><h2 id={titleId}>{title}</h2>{variant !== 'sheet' && <button type="button" className="icon-button" aria-label="Close editor" onClick={onClose}><X size={21} /></button>}</div>
      {children}
    </section>
  </div>
}
