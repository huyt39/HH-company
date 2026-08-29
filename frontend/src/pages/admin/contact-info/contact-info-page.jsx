import { useEffect, useState } from 'react'

import { AdminAlert } from '@/components/admin/admin-alert'
import { AdminPageHead } from '@/components/admin/admin-page-head'
import { FormField } from '@/components/admin/form-field'
import { settingsApi } from '@/lib/api/settings-client'
import { CONTACT_INFO_FIELDS } from '@/lib/constants/admin-settings-fields'
import { useAsyncAction } from '@/lib/hooks/use-async-action'

export function ContactInfoPage() {
  const [info, setInfo] = useState(null)
  const [loadError, setLoadError] = useState('')
  const save = useAsyncAction((body) => settingsApi.saveContactInfo(body), {
    successMessage: 'Đã lưu thông tin liên hệ.',
  })

  useEffect(() => {
    settingsApi.getContactInfo().then(setInfo).catch((err) => setLoadError(err.message))
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    save.run(info)
  }

  if (loadError) return <AdminAlert tone="error">{loadError}</AdminAlert>
  if (!info) return <p className="admin-hint">Đang tải…</p>

  return (
    <form onSubmit={handleSubmit}>
      <AdminPageHead title="Thông tin liên hệ" meta="Hiển thị ở trang Liên hệ và chân trang">
        <button type="submit" className="btn btn--primary" disabled={save.pending}>
          {save.pending ? 'Đang lưu…' : 'Lưu thay đổi'}
        </button>
      </AdminPageHead>

      {save.succeeded && <AdminAlert tone="ok">{save.message}</AdminAlert>}
      {save.failed && <AdminAlert tone="error">{save.message}</AdminAlert>}

      <div className="admin-card">
        <div className="admin-grid-2">
          {CONTACT_INFO_FIELDS.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={info[field.name]}
              onChange={(value) => setInfo({ ...info, [field.name]: value })}
            />
          ))}
        </div>
      </div>
    </form>
  )
}
