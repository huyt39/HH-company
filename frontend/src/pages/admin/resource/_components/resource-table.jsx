import { formatDate } from '@/lib/utils/date-format'
import { formatNumber } from '@/lib/utils/number-format'

const EMPTY = '—'

/** Render one cell from its column declaration in `admin-resources.js`. */
function renderCell(column, row) {
  const value = row[column.name]

  if (column.type === 'thumb') {
    const src = value?.thumb || value?.url
    return src ? (
      <img className="admin-thumb" src={src} alt="" loading="lazy" />
    ) : (
      <span className="admin-thumb admin-thumb--empty" aria-hidden="true" />
    )
  }

  if (value === null || value === undefined || value === '') return EMPTY
  if (column.type === 'date') return formatDate(value)
  if (column.money) return formatNumber(value)
  if (column.options) return column.options.find((o) => o.value === value)?.label ?? value
  return String(value)
}

/**
 * List table for the shared CRUD page.
 *
 * @param {{columns: object[], rows: object[], pk: string, loading: boolean, sortable?: boolean,
 *          onEdit: (row: object) => void, onDelete: (row: object) => void,
 *          onTogglePublish: (row: object) => void, onReorder?: (index: number, delta: number) => void}} props
 */
export function ResourceTable({ columns, rows, pk, loading, sortable = true, onEdit, onDelete, onTogglePublish, onReorder }) {
  // Extra columns: visibility toggle, row actions, plus reorder if sortable.
  const columnCount = columns.length + 2 + (sortable && onReorder ? 1 : 0)

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {sortable && onReorder && <th style={{ width: 64 }}>Thứ tự</th>}
            {columns.map((column) => (
              <th key={column.name} style={column.width ? { width: column.width } : undefined}>
                {column.label}
              </th>
            ))}
            <th style={{ width: 100 }}>Hiển thị</th>
            <th style={{ width: 130 }} />
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columnCount} className="admin-table__empty">Đang tải…</td>
            </tr>
          )}

          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={columnCount} className="admin-table__empty">Chưa có dữ liệu.</td>
            </tr>
          )}

          {!loading &&
            rows.map((row, index) => (
              <tr key={row[pk]}>
                {sortable && onReorder && (
                  <td className="admin-table__actions" style={{ whiteSpace: 'nowrap' }}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onReorder(index, -1)}
                      title="Di chuyển lên"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={index === rows.length - 1}
                      onClick={() => onReorder(index, 1)}
                      title="Di chuyển xuống"
                    >
                      ↓
                    </button>
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.name}
                    className={column.primary ? 'is-primary' : column.money ? 'is-number' : undefined}
                  >
                    {renderCell(column, row)}
                  </td>
                ))}
                <td>
                  <button
                    type="button"
                    className={`pill ${row.is_published ? 'pill--on' : 'pill--off'}`}
                    onClick={() => onTogglePublish(row)}
                    title="Bấm để bật/tắt hiển thị trên web"
                  >
                    {row.is_published ? 'Đang hiện' : 'Đang ẩn'}
                  </button>
                </td>
                <td className="admin-table__actions">
                  <button type="button" onClick={() => onEdit(row)}>Sửa</button>
                  <button type="button" className="is-danger" onClick={() => onDelete(row)}>Xoá</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

