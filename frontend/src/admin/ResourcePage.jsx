import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { adminApi } from './adminApi'
import FormField from './FormField'
import { resources, slugify } from './resources'

const PAGE_SIZE = 50

function initialValues(form) {
  return Object.fromEntries(
    form.map((f) => [f.name, f.default ?? (f.type === 'list' ? [] : f.type === 'switch' ? false : '')]),
  )
}

function formatCell(column, row) {
  const value = row[column.name]
  if (column.type === 'thumb') {
    const src = value?.thumb || value?.url
    return src
      ? <img className="admin-thumb" src={src} alt="" loading="lazy" />
      : <span className="admin-thumb admin-thumb--empty" aria-hidden="true" />
  }
  if (value === null || value === undefined || value === '') return '—'
  if (column.money) return new Intl.NumberFormat('vi-VN').format(value)
  if (column.options) return column.options.find((o) => o.value === value)?.label ?? value
  return String(value)
}

export default function ResourcePage() {
  const { resource } = useParams()
  const config = resources[resource]

  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // Tự ẩn thông báo thành công sau vài giây.
  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(''), 4000)
    return () => clearTimeout(timer)
  }, [notice])

  const [editing, setEditing] = useState(null) // null = đóng form
  const [values, setValues] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const pk = config?.pk ?? 'id'

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminApi.list(resource, { page_size: PAGE_SIZE, q: query || undefined })
      setRows(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [resource, query])

  useEffect(() => {
    if (config) load()
  }, [config, load])

  // Đổi tài nguyên thì đóng form và xoá bộ lọc cũ.
  useEffect(() => {
    setEditing(null)
    setQuery('')
  }, [resource])

  const openCreate = () => {
    setValues(initialValues(config.form))
    setEditing('new')
    setFormError('')
  }

  const openEdit = (row) => {
    setValues(Object.fromEntries(config.form.map((f) => [f.name, row[f.name]])))
    setEditing(row[pk])
    setFormError('')
  }

  const setValue = (name, value) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value }
      // Tự sinh slug từ tên khi tạo mới và người dùng chưa tự nhập slug.
      const source = config.form.find((f) => f.slugSource)
      if (editing === 'new' && source?.name === name && !prev.slug) {
        next.slug = slugify(value)
      }
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      if (editing === 'new') {
        await adminApi.create(resource, values)
        setNotice(`Đã thêm ${config.singular}.`)
      } else {
        await adminApi.update(resource, editing, values)
        setNotice('Đã lưu thay đổi.')
      }
      setEditing(null)
      await load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    const label = row.name || row.title || row[pk]
    if (!window.confirm(`Xoá "${label}"? Thao tác này không hoàn tác được.`)) return
    try {
      await adminApi.remove(resource, row[pk])
      setNotice(`Đã xoá ${config.singular}.`)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const togglePublish = async (row) => {
    try {
      await adminApi.update(resource, row[pk], { is_published: !row.is_published })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const slugSourceField = useMemo(() => config?.form.find((f) => f.slugSource), [config])

  if (!config) return <p className="admin-alert admin-alert--error">Không có mục “{resource}”.</p>

  return (
    <>
      <header className="admin-page-head">
        <div>
          <h1>{config.label}</h1>
          <p className="admin-page-head__meta">{total} bản ghi</p>
        </div>
        <div className="admin-page-head__actions">
          {config.searchable && (
            <input
              type="search"
              className="admin-search"
              placeholder="Tìm kiếm…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            + Thêm {config.singular}
          </button>
        </div>
      </header>

      {notice && <p className="admin-alert admin-alert--ok">{notice}</p>}
      {error && <p className="admin-alert admin-alert--error">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {config.columns.map((c) => (
                <th key={c.name} style={c.width ? { width: c.width } : undefined}>{c.label}</th>
              ))}
              <th style={{ width: 100 }}>Hiển thị</th>
              <th style={{ width: 130 }} />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={config.columns.length + 2} className="admin-table__empty">Đang tải…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={config.columns.length + 2} className="admin-table__empty">Chưa có dữ liệu.</td></tr>
            )}
            {!loading && rows.map((row) => (
              <tr key={row[pk]}>
                {config.columns.map((c) => (
                  <td key={c.name} className={c.primary ? 'is-primary' : c.money ? 'is-number' : undefined}>
                    {formatCell(c, row)}
                  </td>
                ))}
                <td>
                  <button
                    type="button"
                    className={`pill ${row.is_published ? 'pill--on' : 'pill--off'}`}
                    onClick={() => togglePublish(row)}
                    title="Bấm để bật/tắt hiển thị trên web"
                  >
                    {row.is_published ? 'Đang hiện' : 'Đang ẩn'}
                  </button>
                </td>
                <td className="admin-table__actions">
                  <button type="button" onClick={() => openEdit(row)}>Sửa</button>
                  <button type="button" className="is-danger" onClick={() => handleDelete(row)}>Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > PAGE_SIZE && (
        <p className="admin-hint">
          Đang hiển thị {rows.length}/{total} bản ghi đầu tiên. Dùng ô tìm kiếm để lọc bớt.
        </p>
      )}

      {editing !== null && (
        <div className="admin-drawer" role="dialog" aria-modal="true">
          <button type="button" className="admin-drawer__backdrop" aria-label="Đóng" onClick={() => setEditing(null)} />
          <form className="admin-drawer__panel" onSubmit={handleSubmit}>
            <header className="admin-drawer__head">
              <h2>{editing === 'new' ? `Thêm ${config.singular}` : `Sửa ${config.singular}`}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Đóng">✕</button>
            </header>

            <div className="admin-drawer__body">
              {config.form.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={values[field.name]}
                  disabled={saving || (field.lockOnEdit && editing !== 'new')}
                  onChange={(v) => setValue(field.name, v)}
                />
              ))}
              {slugSourceField && editing === 'new' && (
                <p className="admin-hint">Slug tự sinh từ “{slugSourceField.label}”, có thể sửa lại.</p>
              )}
              {formError && <p className="admin-alert admin-alert--error">{formError}</p>}
            </div>

            <footer className="admin-drawer__foot">
              <button type="button" className="btn btn--outline" onClick={() => setEditing(null)}>Huỷ</button>
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Đang lưu…' : 'Lưu'}
              </button>
            </footer>
          </form>
        </div>
      )}
    </>
  )
}
