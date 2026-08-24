import { useEffect, useState } from 'react'

import { adminApi } from '../adminApi'
import FormField from '../FormField'

const FIELDS = [
  { name: 'address', label: 'Địa chỉ', type: 'textarea', rows: 3 },
  { name: 'phone', label: 'Điện thoại', type: 'text' },
  { name: 'fax', label: 'Fax', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'tax_code', label: 'Mã số thuế', type: 'text' },
  {
    name: 'map_embed_url',
    label: 'Link nhúng Google Maps',
    type: 'text',
    hint: 'Lấy từ Google Maps → Chia sẻ → Nhúng bản đồ, dán phần src của thẻ iframe',
  },
]

export default function ContactInfoEditor() {
  const [info, setInfo] = useState(null)
  const [status, setStatus] = useState({ state: 'loading', message: '' })

  useEffect(() => {
    adminApi
      .getContactInfo()
      .then((data) => {
        setInfo(data)
        setStatus({ state: 'idle', message: '' })
      })
      .catch((err) => setStatus({ state: 'error', message: err.message }))
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ state: 'saving', message: '' })
    try {
      await adminApi.saveContactInfo(info)
      setStatus({ state: 'saved', message: 'Đã lưu thông tin liên hệ.' })
    } catch (err) {
      setStatus({ state: 'error', message: err.message })
    }
  }

  if (status.state === 'loading') return <p className="admin-hint">Đang tải…</p>
  if (!info) return <p className="admin-alert admin-alert--error">{status.message}</p>

  return (
    <form onSubmit={handleSubmit}>
      <header className="admin-page-head">
        <div>
          <h1>Thông tin liên hệ</h1>
          <p className="admin-page-head__meta">Hiển thị ở trang Liên hệ và chân trang</p>
        </div>
        <button type="submit" className="btn btn--primary" disabled={status.state === 'saving'}>
          {status.state === 'saving' ? 'Đang lưu…' : 'Lưu thay đổi'}
        </button>
      </header>

      {status.state === 'saved' && <p className="admin-alert admin-alert--ok">{status.message}</p>}
      {status.state === 'error' && <p className="admin-alert admin-alert--error">{status.message}</p>}

      <div className="admin-card">
        <div className="admin-grid-2">
          {FIELDS.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={info[field.name]}
              onChange={(v) => setInfo({ ...info, [field.name]: v })}
            />
          ))}
        </div>
      </div>
    </form>
  )
}
