import { useEffect, useState } from 'react'

import { AdminAlert } from '@/components/admin/admin-alert'
import { AdminPageHead } from '@/components/admin/admin-page-head'
import { FormField } from '@/components/admin/form-field'
import { RepeaterTable } from '@/components/admin/repeater-table'
import { settingsApi } from '@/lib/api/settings-client'
import {
  COMPANY_PROFILE_FIELDS,
  COMPANY_PROFILE_REPEATERS,
} from '@/lib/constants/admin-settings-fields'
import { useAsyncAction } from '@/lib/hooks/use-async-action'

const INTRO_FIELD = {
  name: 'intro',
  label: 'Các đoạn văn',
  type: 'list',
  rows: 10,
  hint: 'Mỗi dòng là một đoạn văn',
}

const CORE_VALUES_FIELD = { name: 'core_values', label: 'Giá trị cốt lõi', type: 'list' }

export function CompanyProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loadError, setLoadError] = useState('')
  const save = useAsyncAction((body) => settingsApi.saveProfile(body), {
    successMessage: 'Đã lưu hồ sơ công ty.',
  })

  useEffect(() => {
    settingsApi.getProfile().then(setProfile).catch((err) => setLoadError(err.message))
  }, [])

  const setField = (name, value) => setProfile((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    save.run(profile)
  }

  if (loadError) return <AdminAlert tone="error">{loadError}</AdminAlert>
  if (!profile) return <p className="admin-hint">Đang tải…</p>

  const saveButton = (
    <button type="submit" className="btn btn--primary" disabled={save.pending}>
      {save.pending ? 'Đang lưu…' : 'Lưu thay đổi'}
    </button>
  )

  return (
    <form onSubmit={handleSubmit}>
      <AdminPageHead title="Hồ sơ công ty" meta="Hiển thị ở trang Giới thiệu và trang chủ">
        {saveButton}
      </AdminPageHead>

      {save.succeeded && <AdminAlert tone="ok">{save.message}</AdminAlert>}
      {save.failed && <AdminAlert tone="error">{save.message}</AdminAlert>}

      <div className="admin-card">
        <h2>Thông tin chung</h2>
        <div className="admin-grid-2">
          {COMPANY_PROFILE_FIELDS.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={profile[field.name]}
              onChange={(value) => setField(field.name, value)}
            />
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2>Đoạn giới thiệu</h2>
        <FormField
          field={INTRO_FIELD}
          value={profile.intro}
          onChange={(value) => setField('intro', value)}
        />
        <FormField
          field={CORE_VALUES_FIELD}
          value={profile.core_values}
          onChange={(value) => setField('core_values', value)}
        />
      </div>

      {COMPANY_PROFILE_REPEATERS.map((repeater) => (
        <div className="admin-card" key={repeater.name}>
          <RepeaterTable
            label={repeater.label}
            hint={repeater.hint}
            columns={repeater.columns}
            items={profile[repeater.name] ?? []}
            onChange={(value) => setField(repeater.name, value)}
          />
        </div>
      ))}

      <div className="admin-sticky-save">{saveButton}</div>
    </form>
  )
}
