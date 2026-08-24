import { useState } from 'react'

import { adminApi } from '../adminApi'
import { useAuth } from '../AuthContext'

export default function Account() {
  const { user } = useAuth()
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.next !== form.confirm) {
      setStatus({ state: 'error', message: 'Hai ô mật khẩu mới không khớp nhau.' })
      return
    }
    if (form.next.length < 8) {
      setStatus({ state: 'error', message: 'Mật khẩu mới cần tối thiểu 8 ký tự.' })
      return
    }

    setStatus({ state: 'saving', message: '' })
    try {
      const res = await adminApi.changePassword(form.current, form.next)
      setStatus({ state: 'saved', message: res.message })
      setForm({ current: '', next: '', confirm: '' })
    } catch (err) {
      setStatus({ state: 'error', message: err.message })
    }
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <h1>Tài khoản</h1>
          <p className="admin-page-head__meta">{user?.email}</p>
        </div>
      </header>

      <div className="admin-card admin-card--narrow">
        <h2>Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Mật khẩu hiện tại</span>
            <input
              type="password" autoComplete="current-password" required
              value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })}
            />
          </label>
          <label className="admin-field">
            <span>Mật khẩu mới</span>
            <input
              type="password" autoComplete="new-password" required minLength={8}
              value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })}
            />
            <small className="admin-field__hint">Tối thiểu 8 ký tự</small>
          </label>
          <label className="admin-field">
            <span>Nhập lại mật khẩu mới</span>
            <input
              type="password" autoComplete="new-password" required
              value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
          </label>

          {status.state === 'saved' && <p className="admin-alert admin-alert--ok">{status.message}</p>}
          {status.state === 'error' && <p className="admin-alert admin-alert--error">{status.message}</p>}

          <button type="submit" className="btn btn--primary" disabled={status.state === 'saving'}>
            {status.state === 'saving' ? 'Đang lưu…' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </>
  )
}
