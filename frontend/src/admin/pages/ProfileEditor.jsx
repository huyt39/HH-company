import { useEffect, useState } from 'react'

import { adminApi } from '../adminApi'
import FormField from '../FormField'

const TEXT_FIELDS = [
  { name: 'name', label: 'Tên công ty (tiếng Việt)', type: 'text', required: true },
  { name: 'name_en', label: 'Tên tiếng Anh', type: 'text' },
  { name: 'short_name', label: 'Tên viết tắt', type: 'text' },
  { name: 'tagline', label: 'Khẩu hiệu / mô tả ngắn', type: 'textarea', rows: 2 },
  { name: 'tax_code', label: 'Mã số doanh nghiệp', type: 'text' },
  { name: 'established', label: 'Năm thành lập', type: 'text' },
  { name: 'charter_capital', label: 'Vốn điều lệ', type: 'text' },
  { name: 'status', label: 'Tình trạng hoạt động', type: 'text' },
  { name: 'employees', label: 'Quy mô nhân sự', type: 'text' },
  { name: 'main_business_line', label: 'Ngành nghề chính', type: 'text' },
  { name: 'business_lines_count', label: 'Số ngành nghề đăng ký', type: 'number' },
  { name: 'vision', label: 'Tầm nhìn', type: 'textarea', rows: 4 },
  { name: 'mission', label: 'Sứ mệnh', type: 'textarea', rows: 4 },
]

/** Bảng con cho các danh sách bản ghi lồng nhau (lãnh đạo, phòng ban, mốc lịch sử). */
function RepeaterTable({ label, hint, items, columns, onChange }) {
  const blank = Object.fromEntries(columns.map((c) => [c.name, c.type === 'number' ? null : '']))

  const update = (index, name, value) =>
    onChange(items.map((row, i) => (i === index ? { ...row, [name]: value } : row)))

  return (
    <section className="repeater">
      <div className="repeater__head">
        <h3>{label}</h3>
        <button type="button" className="btn btn--outline" onClick={() => onChange([...items, { ...blank }])}>
          + Thêm dòng
        </button>
      </div>
      {hint && <p className="admin-hint">{hint}</p>}

      {items.length === 0 && <p className="admin-hint">Chưa có dòng nào.</p>}

      {items.map((row, index) => (
        <div className="repeater__row" key={index}>
          {columns.map((column) => (
            <label className="admin-field" key={column.name}>
              <span>{column.label}</span>
              {column.type === 'textarea' ? (
                <textarea
                  rows={2}
                  value={row[column.name] ?? ''}
                  onChange={(e) => update(index, column.name, e.target.value)}
                />
              ) : column.type === 'list' ? (
                <textarea
                  rows={2}
                  value={(row[column.name] ?? []).join('\n')}
                  onChange={(e) =>
                    update(
                      index,
                      column.name,
                      e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                    )
                  }
                />
              ) : (
                <input
                  type={column.type === 'number' ? 'number' : 'text'}
                  value={row[column.name] ?? ''}
                  onChange={(e) =>
                    update(
                      index,
                      column.name,
                      column.type === 'number'
                        ? e.target.value === '' ? null : Number(e.target.value)
                        : e.target.value,
                    )
                  }
                />
              )}
            </label>
          ))}
          <button
            type="button"
            className="repeater__remove"
            aria-label="Xoá dòng"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            ✕
          </button>
        </div>
      ))}
    </section>
  )
}

export default function ProfileEditor() {
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState({ state: 'loading', message: '' })

  useEffect(() => {
    adminApi
      .getProfile()
      .then((data) => {
        setProfile(data)
        setStatus({ state: 'idle', message: '' })
      })
      .catch((err) => setStatus({ state: 'error', message: err.message }))
  }, [])

  const set = (name, value) => setProfile((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ state: 'saving', message: '' })
    try {
      await adminApi.saveProfile(profile)
      setStatus({ state: 'saved', message: 'Đã lưu hồ sơ công ty.' })
    } catch (err) {
      setStatus({ state: 'error', message: err.message })
    }
  }

  if (status.state === 'loading') return <p className="admin-hint">Đang tải…</p>
  if (!profile) return <p className="admin-alert admin-alert--error">{status.message}</p>

  return (
    <form onSubmit={handleSubmit}>
      <header className="admin-page-head">
        <div>
          <h1>Hồ sơ công ty</h1>
          <p className="admin-page-head__meta">Hiển thị ở trang Giới thiệu và trang chủ</p>
        </div>
        <button type="submit" className="btn btn--primary" disabled={status.state === 'saving'}>
          {status.state === 'saving' ? 'Đang lưu…' : 'Lưu thay đổi'}
        </button>
      </header>

      {status.state === 'saved' && <p className="admin-alert admin-alert--ok">{status.message}</p>}
      {status.state === 'error' && <p className="admin-alert admin-alert--error">{status.message}</p>}

      <div className="admin-card">
        <h2>Thông tin chung</h2>
        <div className="admin-grid-2">
          {TEXT_FIELDS.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={profile[field.name]}
              onChange={(v) => set(field.name, v)}
            />
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2>Đoạn giới thiệu</h2>
        <FormField
          field={{ name: 'intro', label: 'Các đoạn văn', type: 'list', rows: 10, hint: 'Mỗi dòng là một đoạn văn' }}
          value={profile.intro}
          onChange={(v) => set('intro', v)}
        />
        <FormField
          field={{ name: 'core_values', label: 'Giá trị cốt lõi', type: 'list' }}
          value={profile.core_values}
          onChange={(v) => set('core_values', v)}
        />
      </div>

      <div className="admin-card">
        <RepeaterTable
          label="Ban lãnh đạo"
          items={profile.leaders ?? []}
          onChange={(v) => set('leaders', v)}
          columns={[
            { name: 'name', label: 'Họ tên' },
            { name: 'title', label: 'Chức danh' },
          ]}
        />
      </div>

      <div className="admin-card">
        <RepeaterTable
          label="Cơ cấu tổ chức"
          hint="Dòng đầu tiên là cấp cao nhất, các dòng sau là phòng ban trực thuộc."
          items={profile.org_units ?? []}
          onChange={(v) => set('org_units', v)}
          columns={[
            { name: 'name', label: 'Tên đơn vị' },
            { name: 'name_en', label: 'Tên tiếng Anh' },
            { name: 'children', label: 'Đơn vị con', type: 'list' },
          ]}
        />
      </div>

      <div className="admin-card">
        <RepeaterTable
          label="Lịch sử phát triển"
          items={profile.milestones ?? []}
          onChange={(v) => set('milestones', v)}
          columns={[
            { name: 'year', label: 'Năm', type: 'number' },
            { name: 'title', label: 'Sự kiện' },
            { name: 'description', label: 'Mô tả', type: 'textarea' },
          ]}
        />
      </div>

      <div className="admin-sticky-save">
        <button type="submit" className="btn btn--primary" disabled={status.state === 'saving'}>
          {status.state === 'saving' ? 'Đang lưu…' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  )
}
