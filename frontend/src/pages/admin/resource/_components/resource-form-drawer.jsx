import { AdminAlert } from '@/components/admin/admin-alert'
import { FormField } from '@/components/admin/form-field'

/**
 * Create/edit drawer; fields are built from `config.form`.
 *
 * @param {{config: object, values: object, isNew: boolean, saving: boolean,
 *          error: string, onChange: (name: string, value: any) => void,
 *          onSubmit: (event: SubmitEvent) => void, onClose: () => void}} props
 */
export function ResourceFormDrawer({
  config,
  values,
  isNew,
  saving,
  error,
  onChange,
  onSubmit,
  onClose,
}) {
  const slugSource = config.form.find((field) => field.slugSource)

  return (
    <div className="admin-drawer" role="dialog" aria-modal="true">
      <button type="button" className="admin-drawer__backdrop" aria-label="Đóng" onClick={onClose} />

      <form className="admin-drawer__panel" onSubmit={onSubmit}>
        <header className="admin-drawer__head">
          <h2>{isNew ? `Thêm ${config.singular}` : `Sửa ${config.singular}`}</h2>
          <button type="button" onClick={onClose} aria-label="Đóng">✕</button>
        </header>

        <div className="admin-drawer__body">
          {config.form.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={values[field.name]}
              disabled={saving || (field.lockOnEdit && !isNew)}
              onChange={(value) => onChange(field.name, value)}
            />
          ))}

          {slugSource && isNew && (
            <p className="admin-hint">Slug tự sinh từ “{slugSource.label}”, có thể sửa lại.</p>
          )}

          <AdminAlert tone="error">{error}</AdminAlert>
        </div>

        <footer className="admin-drawer__foot">
          <button type="button" className="btn btn--outline" onClick={onClose}>Huỷ</button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Đang lưu…' : 'Lưu'}
          </button>
        </footer>
      </form>
    </div>
  )
}
