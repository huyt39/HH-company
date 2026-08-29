import { useCallback, useEffect, useState } from 'react'

import { AdminAlert } from '@/components/admin/admin-alert'
import { AdminPageHead } from '@/components/admin/admin-page-head'
import { messagesApi } from '@/lib/api/messages-client'

import { MessageRow } from './_components/message-row'

export function MessagesPage() {
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [openId, setOpenId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await messagesApi.listMessages({ unread_only: unreadOnly || undefined })
      setRows(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [unreadOnly])

  useEffect(() => {
    load()
  }, [load])

  /** Opening an unread message also marks it read. */
  const toggle = async (message) => {
    const next = openId === message.id ? null : message.id
    setOpenId(next)
    if (next !== null && !message.is_read) {
      await messagesApi.markRead(message.id, true).catch(() => {})
      load()
    }
  }

  const markUnread = async (message) => {
    await messagesApi.markRead(message.id, false).catch((err) => setError(err.message))
    load()
  }

  const remove = async (message) => {
    if (!window.confirm(`Xoá tin nhắn của ${message.full_name}?`)) return
    await messagesApi.deleteMessage(message.id).catch((err) => setError(err.message))
    load()
  }

  return (
    <>
      <AdminPageHead title="Hộp thư liên hệ" meta={`${total} tin nhắn`}>
        <label className="admin-switch">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(event) => setUnreadOnly(event.target.checked)}
          />
          <span>Chỉ hiện tin chưa đọc</span>
        </label>
      </AdminPageHead>

      <AdminAlert tone="error">{error}</AdminAlert>
      {loading && <p className="admin-hint">Đang tải…</p>}
      {!loading && rows.length === 0 && (
        <div className="admin-card admin-card--empty">
          <p className="mb-0">Chưa có tin nhắn nào từ form liên hệ.</p>
        </div>
      )}

      <div className="message-list">
        {rows.map((message) => (
          <MessageRow
            key={message.id}
            message={message}
            open={openId === message.id}
            onToggle={() => toggle(message)}
            onMarkUnread={() => markUnread(message)}
            onDelete={() => remove(message)}
          />
        ))}
      </div>
    </>
  )
}
