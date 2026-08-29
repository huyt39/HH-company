import { useCallback, useState } from 'react'

/**
 * Pending / success / error state for a write action (submit, save, change
 * password), so every form's button and notice behave the same way.
 *
 * @param {(...args: any[]) => Promise<any>} action
 * @param {{successMessage?: string}} [options] fixed success message;
 *   falls back to the `message` returned by the backend.
 *
 * @example
 * const save = useAsyncAction(settingsApi.saveProfile, { successMessage: 'Đã lưu.' })
 * const { ok } = await save.run(profile)
 */
export function useAsyncAction(action, { successMessage } = {}) {
  const [status, setStatus] = useState('idle') // idle | pending | success | error
  const [message, setMessage] = useState('')

  const run = useCallback(
    async (...args) => {
      setStatus('pending')
      setMessage('')
      try {
        const data = await action(...args)
        setStatus('success')
        setMessage(successMessage ?? data?.message ?? '')
        return { ok: true, data }
      } catch (err) {
        setStatus('error')
        setMessage(err.message)
        return { ok: false, error: err }
      }
    },
    [action, successMessage],
  )

  const reset = useCallback(() => {
    setStatus('idle')
    setMessage('')
  }, [])

  return {
    run,
    reset,
    status,
    message,
    pending: status === 'pending',
    succeeded: status === 'success',
    failed: status === 'error',
  }
}
