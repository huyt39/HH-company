import { useState } from 'react'

import { AdminAlert } from '@/components/admin/admin-alert'
import { AdminPageHead } from '@/components/admin/admin-page-head'
import { authApi } from '@/lib/api/auth-client'
import { useAuth } from '@/lib/auth/auth-context'
import { useAsyncAction } from '@/lib/hooks/use-async-action'

const MIN_PASSWORD_LENGTH = 8
const EMPTY_FORM = { current: '', next: '', confirm: '' }

/** Validate locally first to save a round trip. */
function validate({ next, confirm }) {
  if (next !== confirm) return 'Hai ô mật khẩu mới không khớp nhau.'
  if (next.length < MIN_PASSWORD_LENGTH) {
    return `Mật khẩu mới cần tối thiểu ${MIN_PASSWORD_LENGTH} ký tự.`
  }
  return null
}

export function AccountPage() {
  const { user } = useAuth()
  const [form, setForm] = useState(EMPTY_FORM)
  const [localError, setLocalError] = useState('')
  const changePassword = useAsyncAction((current, next) => authApi.changePassword(current, next))

  const handleSubmit = async (event) => {
    event.preventDefault()

    const message = validate(form)
    setLocalError(message ?? '')
    if (message) {
      // Clear the previous notice so only this error shows.
      changePassword.reset()
      return
    }

    const { ok } = await changePassword.run(form.current, form.next)
    if (ok) setForm(EMPTY_FORM)
  }

  const setField = (name) => (event) => setForm({ ...form, [name]: event.target.value })

  return (
    <>
      <AdminPageHead title="Tài khoản" meta={user?.email} />

      <div className="admin-card admin-card--narrow">
        <h2>Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Mật khẩu hiện tại</span>
            <input
              type="password" autoComplete="current-password" required
              value={form.current} onChange={setField('current')}
            />
          </label>
          <label className="admin-field">
            <span>Mật khẩu mới</span>
            <input
              type="password" autoComplete="new-password" required minLength={MIN_PASSWORD_LENGTH}
              value={form.next} onChange={setField('next')}
            />
            <small className="admin-field__hint">Tối thiểu {MIN_PASSWORD_LENGTH} ký tự</small>
          </label>
          <label className="admin-field">
            <span>Nhập lại mật khẩu mới</span>
            <input
              type="password" autoComplete="new-password" required
              value={form.confirm} onChange={setField('confirm')}
            />
          </label>

          {changePassword.succeeded && (
            <AdminAlert tone="ok">{changePassword.message || 'Đã đổi mật khẩu.'}</AdminAlert>
          )}
          <AdminAlert tone="error">{localError || (changePassword.failed && changePassword.message)}</AdminAlert>

          <button type="submit" className="btn btn--primary" disabled={changePassword.pending}>
            {changePassword.pending ? 'Đang lưu…' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </>
  )
}
