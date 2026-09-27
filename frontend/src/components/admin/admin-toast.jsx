import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

// Errors stay longer: they usually need reading, and may need copying.
const TIMEOUT = { ok: 4000, error: 8000, info: 5000 }

const ToastContext = createContext(null)

/**
 * Floating notices for the admin area. Inline `AdminAlert`s sit at a fixed
 * spot on the page, so a save pressed from the sticky bar at the bottom of a
 * long form reported its result off-screen; a toast is seen wherever the
 * editor has scrolled to.
 */
export function AdminToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback(
    (tone, message) => {
      if (!message) return
      const id = ++nextId.current
      // Saving twice shouldn't stack two identical notices.
      setToasts((prev) => [
        ...prev.filter((toast) => toast.message !== message || toast.tone !== tone),
        { id, tone, message },
      ])
      setTimeout(() => dismiss(id), TIMEOUT[tone] ?? TIMEOUT.info)
    },
    [dismiss],
  )

  const api = useMemo(
    () => ({
      ok: (message) => show('ok', message),
      error: (message) => show('error', message),
      info: (message) => show('info', message),
    }),
    [show],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="admin-toasts" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div className={`admin-toast admin-toast--${toast.tone}`} key={toast.id}>
            <span className="admin-toast__icon" aria-hidden="true">
              {toast.tone === 'ok' ? '✓' : toast.tone === 'error' ? '!' : 'i'}
            </span>
            <p>{toast.message}</p>
            <button type="button" aria-label="Đóng thông báo" onClick={() => dismiss(toast.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

/** @returns {{ok: (m: string) => void, error: (m: string) => void, info: (m: string) => void}} */
export function useAdminToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useAdminToast must be used inside AdminToastProvider')
  return context
}
