import { useRef, useState } from 'react'

import { useAdminToast } from '@/components/admin/admin-toast'
import { ACCEPTED_EXTENSIONS, importArticleFile } from '@/lib/article-import'

const isBlank = (value) => !value || (typeof value === 'string' && !value.trim())

/**
 * Fill a form from a Word or PDF file: body with all its images, plus the
 * title, excerpt and cover when the form has those fields and they are empty.
 *
 * @param {{fields: {content: string, title?: string, excerpt?: string, cover?: string},
 *          values: object, onChange: (name: string, value: any) => void,
 *          disabled?: boolean}} props `fields` maps each imported part to a form field.
 */
export function ArticleImportButton({ fields, values, onChange, disabled }) {
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [warnings, setWarnings] = useState([])
  const inputRef = useRef(null)
  const toast = useAdminToast()
  const busy = Boolean(progress)

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    if (inputRef.current) inputRef.current.value = ''
    if (!file) return

    if (
      !isBlank(values[fields.content]) &&
      !window.confirm('Bài viết đã có nội dung. Thay toàn bộ nội dung bằng nội dung trong file?')
    ) {
      return
    }

    setError('')
    setWarnings([])
    setProgress('Đang đọc file…')
    try {
      const result = await importArticleFile(file, {
        onProgress: setProgress,
        takeCover: Boolean(fields.cover) && isBlank(values[fields.cover]?.url),
      })
      if (!result.content.trim()) throw new Error('Không tìm thấy nội dung nào trong file.')

      // Only fill what is still empty: never overwrite what was typed by hand.
      const fillIfEmpty = (part, value) => {
        const name = fields[part]
        if (name && value && isBlank(values[name])) onChange(name, value)
      }
      onChange(fields.content, result.content)
      fillIfEmpty('title', result.title)
      fillIfEmpty('excerpt', result.excerpt)
      if (result.cover) onChange(fields.cover, result.cover)

      setWarnings(result.warnings)
      toast.ok(`Đã nhập nội dung và ${result.imageCount} ảnh từ file. Kiểm tra lại rồi bấm Lưu.`)
    } catch (err) {
      setError(err.message || 'Không đọc được file này.')
    } finally {
      setProgress('')
    }
  }

  return (
    <div className="article-import">
      <button
        type="button"
        className="btn btn--primary"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? progress : '📄 Tải bài viết từ file Word / PDF'}
      </button>
      <small className="admin-field__hint">
        Chọn file .docx hoặc .pdf: toàn bộ chữ, ảnh, bảng và chú thích sẽ được điền vào ô nội dung.
        {fields.excerpt || fields.cover
          ? ' Tiêu đề, tóm tắt và ảnh bìa được tự điền nếu các ô đó còn trống.'
          : ' Tiêu đề được tự điền nếu ô đó còn trống.'}{' '}
        File Word cho kết quả chính xác nhất; PDF được dựng lại theo bố cục nên nên xem trước
        trước khi lưu.
      </small>
      {warnings.map((warning) => (
        <p key={warning} className="admin-alert admin-alert--info">{warning}</p>
      ))}
      {error && <p className="admin-alert admin-alert--error">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={ACCEPTED_EXTENSIONS.join(',')}
        onChange={handleFile}
      />
    </div>
  )
}
