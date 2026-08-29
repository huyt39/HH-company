import { splitLines } from './form-field'

/**
 * Sub-table for nested record lists (leaders, org units, milestones).
 *
 * @param {{label: string, hint?: string, items: object[],
 *          columns: {name: string, label: string, type?: 'text'|'number'|'textarea'|'list'}[],
 *          onChange: (items: object[]) => void}} props
 */
export function RepeaterTable({ label, hint, items = [], columns, onChange }) {
  const blankRow = Object.fromEntries(
    columns.map((column) => [column.name, column.type === 'number' ? null : '']),
  )

  const update = (index, name, value) =>
    onChange(items.map((row, i) => (i === index ? { ...row, [name]: value } : row)))

  return (
    <section className="repeater">
      <div className="repeater__head">
        <h3>{label}</h3>
        <button
          type="button"
          className="btn btn--outline"
          onClick={() => onChange([...items, { ...blankRow }])}
        >
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
              <RepeaterCell
                column={column}
                value={row[column.name]}
                onChange={(value) => update(index, column.name, value)}
              />
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

function RepeaterCell({ column, value, onChange }) {
  if (column.type === 'textarea') {
    return <textarea rows={2} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
  }

  if (column.type === 'list') {
    return (
      <textarea
        rows={2}
        value={(value ?? []).join('\n')}
        onChange={(e) => onChange(splitLines(e.target.value))}
      />
    )
  }

  const isNumber = column.type === 'number'
  return (
    <input
      type={isNumber ? 'number' : 'text'}
      value={value ?? ''}
      onChange={(e) => onChange(isNumber ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value)}
    />
  )
}
