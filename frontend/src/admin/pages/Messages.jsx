import { useCallback, useEffect, useState } from 'react'

import { adminApi } from '../adminApi'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
}

export default function Messages() {
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [openId, setOpenId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminApi.listMessages({ unread_only: unreadOnly || undefined })
      setRows(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [unreadOnly])

  useEffect(() => { load() }, [load])

  const toggle = async (row) => {
    // Mở tin chưa đọc thì đánh dấu đã đọc luôn.
    const next = openId === row.id ? null : row.id
    setOpenId(next)
    if (next !== null && !row.is_read) {
      await adminApi.markMessage(row.id, true).catch(() => {})
      load()
    }
  }

  const markUnread = async (row) => {
    await adminApi.markMessage(row.id, false).catch((err) => setError(err.message))
    load()
  }

  const remove = async (row) => {
    if (!window.confirm(`Xoá tin nhắn của ${row.full_name}?`)) return
    await adminApi.deleteMessage(row.id).catch((err) => setError(err.message))
    load()
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <h1>Hộp thư liên hệ</h1>
          <p className="admin-page-head__meta">{total} tin nhắn</p>
        </div>
        <label className="admin-switch">
          <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} />
          <span>Chỉ hiện tin chưa đọc</span>
        </label>
      </header>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}
      {loading && <p className="admin-hint">Đang tải…</p>}
      {!loading && rows.length === 0 && (
        <div className="admin-card admin-card--empty">
          <p className="mb-0">Chưa có tin nhắn nào từ form liên hệ.</p>
        </div>
      )}

      <div className="message-list">
        {rows.map((row) => (
          <article className={`message ${row.is_read ? '' : 'is-unread'}`} key={row.id}>
            <button type="button" className="message__head" onClick={() => toggle(row)}>
              <span className="message__from">
                {!row.is_read && <span className="message__dot" aria-label="Chưa đọc" />}
                {row.full_name}
              </span>
              <span className="message__subject">{row.subject || '(không có tiêu đề)'}</span>
              <span className="message__date">{formatDate(row.created_at)}</span>
            </button>

            {openId === row.id && (
              <div className="message__body">
                <dl className="message__meta">
                  <div><dt>Email</dt><dd><a href={`mailto:${row.email}`}>{row.email}</a></dd></div>
                  <div><dt>Điện thoại</dt><dd>{row.phone || '—'}</dd></div>
                </dl>
                <p className="message__text">{row.message}</p>
                <div className="message__actions">
                  <a className="btn btn--outline" href={`mailto:${row.email}?subject=${encodeURIComponent('Re: ' + (row.subject || 'Liên hệ từ website'))}`}>
                    Trả lời qua email
                  </a>
                  <button type="button" className="btn btn--outline" onClick={() => markUnread(row)}>
                    Đánh dấu chưa đọc
                  </button>
                  <button type="button" className="btn btn--danger" onClick={() => remove(row)}>Xoá</button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  )
}
