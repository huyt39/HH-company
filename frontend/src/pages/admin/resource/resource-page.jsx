import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { AdminAlert } from '@/components/admin/admin-alert'
import { AdminPageHead } from '@/components/admin/admin-page-head'
import { resourcesApi } from '@/lib/api/resources-client'
import { ADMIN_RESOURCES } from '@/lib/constants/admin-resources'
import { slugify } from '@/lib/utils/slugify'

import { ResourceFormDrawer } from './_components/resource-form-drawer'
import { ResourceTable } from './_components/resource-table'
import { useResourceList } from './_hooks/use-resource-list'

const NEW = 'new'
const NOTICE_TIMEOUT = 4000

/** Initial values for the create form, per field type. */
function blankValues(formFields) {
  return Object.fromEntries(
    formFields.map((field) => {
      if (field.default !== undefined) return [field.name, field.default]
      if (field.type === 'list') return [field.name, []]
      if (field.type === 'switch') return [field.name, false]
      return [field.name, '']
    }),
  )
}

/**
 * Shared CRUD page. Route `/admin/:resource` looks its config up in
 * `lib/constants/admin-resources.js`.
 */
export function ResourcePage() {
  const { resource } = useParams()
  const config = ADMIN_RESOURCES[resource]
  const pk = config?.pk ?? 'id'

  const [query, setQuery] = useState('')
  const { rows, total, loading, error, setError, reload, pageSize } = useResourceList(
    resource,
    query,
    Boolean(config),
  )

  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(null) // null = closed, 'new', or a primary key
  const [values, setValues] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  // Auto-hide the success notice.
  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(''), NOTICE_TIMEOUT)
    return () => clearTimeout(timer)
  }, [notice])

  // Switching resource closes the form and clears the old filter.
  useEffect(() => {
    setEditing(null)
    setQuery('')
  }, [resource])

  if (!config) {
    return <AdminAlert tone="error">Không có mục “{resource}”.</AdminAlert>
  }

  const openCreate = () => {
    setValues(blankValues(config.form))
    setEditing(NEW)
    setFormError('')
  }

  const openEdit = (row) => {
    setValues(Object.fromEntries(config.form.map((field) => [field.name, row[field.name]])))
    setEditing(row[pk])
    setFormError('')
  }

  const setValue = (name, value) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value }
      // Derive the slug from the name while creating, unless typed by hand.
      const slugSource = config.form.find((field) => field.slugSource)
      if (editing === NEW && slugSource?.name === name && !prev.slug) {
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
      if (editing === NEW) {
        await resourcesApi.create(resource, values)
        setNotice(`Đã thêm ${config.singular}.`)
      } else {
        await resourcesApi.update(resource, editing, values)
        setNotice('Đã lưu thay đổi.')
      }
      setEditing(null)
      await reload()
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
      await resourcesApi.remove(resource, row[pk])
      setNotice(`Đã xoá ${config.singular}.`)
      await reload()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleTogglePublish = async (row) => {
    try {
      await resourcesApi.update(resource, row[pk], { is_published: !row.is_published })
      await reload()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <AdminPageHead title={config.label} meta={`${total} bản ghi`}>
        {config.searchable && (
          <input
            type="search"
            className="admin-search"
            placeholder="Tìm kiếm…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        )}
        <button type="button" className="btn btn--primary" onClick={openCreate}>
          + Thêm {config.singular}
        </button>
      </AdminPageHead>

      {notice && <AdminAlert tone="ok">{notice}</AdminAlert>}
      <AdminAlert tone="error">{error}</AdminAlert>

      <ResourceTable
        columns={config.columns}
        rows={rows}
        pk={pk}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
      />

      {total > pageSize && (
        <p className="admin-hint">
          Đang hiển thị {rows.length}/{total} bản ghi đầu tiên. Dùng ô tìm kiếm để lọc bớt.
        </p>
      )}

      {editing !== null && (
        <ResourceFormDrawer
          config={config}
          values={values}
          isNew={editing === NEW}
          saving={saving}
          error={formError}
          onChange={setValue}
          onSubmit={handleSubmit}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  )
}
