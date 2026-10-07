import { useCallback, useEffect, useRef } from 'react'

/** Touch and mouse share one timer. Movement, scrolling, extra fingers, blur,
 * cancellation and unmount all cancel the gesture. Keyboard users hold Space
 * or Enter for the same duration. A fired hold consumes its following click. */
export function useLongPress(onLongPress, { delay = 800, tolerance = 10 } = {}) {
  const callback = useRef(onLongPress)
  callback.current = onLongPress
  const timer = useRef(null)
  const origin = useRef(null)
  const fired = useRef(false)
  const lastTouch = useRef(0)

  const cancel = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = null
    origin.current = null
  }, [])

  const begin = useCallback((x, y) => {
    cancel()
    fired.current = false
    origin.current = { x, y }
    timer.current = setTimeout(() => {
      timer.current = null
      fired.current = true
      callback.current()
    }, delay)
  }, [cancel, delay])

  const move = useCallback((x, y) => {
    if (origin.current && Math.hypot(x - origin.current.x, y - origin.current.y) > tolerance) cancel()
  }, [cancel, tolerance])

  useEffect(() => {
    window.addEventListener('scroll', cancel, true)
    window.addEventListener('blur', cancel)
    window.addEventListener('mouseup', cancel)
    document.addEventListener('visibilitychange', cancel)
    return () => {
      cancel()
      window.removeEventListener('scroll', cancel, true)
      window.removeEventListener('blur', cancel)
      window.removeEventListener('mouseup', cancel)
      document.removeEventListener('visibilitychange', cancel)
    }
  }, [cancel])

  return {
    onTouchStart(event) {
      lastTouch.current = Date.now()
      if (event.touches.length !== 1) return cancel()
      begin(event.touches[0].clientX, event.touches[0].clientY)
    },
    onTouchMove(event) {
      if (event.touches.length !== 1) return cancel()
      move(event.touches[0].clientX, event.touches[0].clientY)
    },
    onTouchEnd() { lastTouch.current = Date.now(); cancel() },
    onTouchCancel: cancel,
    onMouseDown(event) {
      if (event.button === 0 && Date.now() - lastTouch.current > 800) begin(event.clientX, event.clientY)
    },
    onMouseMove(event) { move(event.clientX, event.clientY) },
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onBlur: cancel,
    onContextMenu(event) { event.preventDefault() },
    onKeyDown(event) {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        if (!event.repeat) begin(0, 0)
      }
    },
    onKeyUp(event) {
      if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); cancel() }
    },
    onClickCapture(event) {
      if (fired.current) {
        event.preventDefault()
        event.stopPropagation()
        fired.current = false
      }
    },
  }
}
