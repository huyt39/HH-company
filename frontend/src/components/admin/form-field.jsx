import { GalleryPicker } from './gallery-picker'
import { ImagePicker } from './image-picker'

const DEFAULT_HINTS = {
  list: 'Mỗi dòng là một mục',
  html: 'Cho phép thẻ HTML',
}

/** Empty input means null, not an empty string. */
const toNumber = (raw) => (raw === '' ? null : Number(raw))

/**
 * Renders one field from its declaration in `lib/constants/`.
 *
 * @param {{field: object, value: any, onChange: (value: any) => void, disabled?: boolean}} props
 */
export function FormField({ field, value, onChange, disabled }) {
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
          onChange={(event) => onChange(event.target.checked)}
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
          onChange={(event) => onChange(event.target.value)}
        />
      )
      break

    case 'number':
      control = (
        <input
          {...common}
          type="number"
          value={value ?? ''}
          onChange={(event) => onChange(toNumber(event.target.value))}
        />
      )
      break

    case 'date':
      control = (
        <input
          {...common}
          type="date"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value || null)}
        />
      )
      break

    case 'select':
      control = (
        <select
          {...common}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value || null)}
        >
          <option value="">— Không chọn —</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      )
      break

    case 'list':
      // One line per item — quicker to type than add/remove inputs.
      control = (
        <textarea
          {...common}
          rows={field.rows || 5}
          value={(value ?? []).join('\n')}
          onChange={(event) => onChange(splitLines(event.target.value))}
        />
      )
      break

    default:
      control = (
        <input
          {...common}
          type="text"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )
  }

  const hint = field.hint ?? DEFAULT_HINTS[field.type] ?? null

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

/** Multiline text -> array of strings, blank lines dropped. */
export function splitLines(raw) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
