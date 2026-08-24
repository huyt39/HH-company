import GalleryPicker from './GalleryPicker'
import ImagePicker from './ImagePicker'

/** Render một trường form theo cấu hình trong `resources.js`. */
export default function FormField({ field, value, onChange, disabled }) {
  const id = `f-${field.name}`
  const common = { id, disabled, className: field.mono ? 'is-mono' : undefined }

  if (field.type === 'image') {
    return <ImagePicker label={field.label} hint={field.hint} value={value} onChange={onChange} />
  }

  if (field.type === 'gallery') {
    return <GalleryPicker label={field.label} value={value} onChange={onChange} />
  }

  if (field.type === 'switch') {
    return (
      <label className="admin-switch">
        <input
          type="checkbox"
          id={id}
          disabled={disabled}
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    )
  }

  let control
  switch (field.type) {
    case 'textarea':
    case 'html':
      control = (
        <textarea
          {...common}
          rows={field.rows || 4}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )
      break

    case 'number':
      control = (
        <input
          {...common}
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        />
      )
      break

    case 'date':
      control = (
        <input
          {...common}
          type="date"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
        />
      )
      break

    case 'select':
      control = (
        <select {...common} value={value ?? ''} onChange={(e) => onChange(e.target.value || null)}>
          <option value="">— Không chọn —</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )
      break

    case 'list':
      // Mỗi dòng là một phần tử — cách nhập gọn hơn nhiều so với thêm/xoá từng ô.
      control = (
        <textarea
          {...common}
          rows={field.rows || 5}
          value={(value ?? []).join('\n')}
          onChange={(e) =>
            onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))
          }
        />
      )
      break

    default:
      control = (
        <input {...common} type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      )
  }

  const hint =
    field.hint ?? (field.type === 'list' ? 'Mỗi dòng là một mục' : field.type === 'html' ? 'Cho phép thẻ HTML' : null)

  return (
    <label className="admin-field">
      <span>
        {field.label}
        {field.required && <em className="admin-field__req"> *</em>}
      </span>
      {control}
      {hint && <small className="admin-field__hint">{hint}</small>}
    </label>
  )
}
