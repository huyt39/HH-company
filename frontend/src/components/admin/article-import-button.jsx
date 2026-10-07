import { useRef, useState } from 'react'

import { useAdminToast } from '@/components/admin/admin-toast'
import { ACCEPTED_EXTENSIONS, importArticleFile } from '@/lib/article-import'

const isBlank = (value) => !value || (typeof value === 'string' && !value.trim())

/**
 * Fill an article form from a Word or PDF file: body with all its images, plus
 * the title, excerpt and cover when those are still empty.
 *
 * @param {{values: object, onChange: (name: string, value: any) => void,
 *          disabled?: boolean}} props
 */
export function ArticleImportButton({ values, onChange, disabled }) {
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
      !isBlank(values.content) &&
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
        takeCover: isBlank(values.cover?.url),
      })
      if (!result.content.trim()) throw new Error('Không tìm thấy nội dung nào trong file.')

      onChange('content', result.content)
      if (result.title && isBlank(values.title)) onChange('title', result.title)
      if (result.excerpt && isBlank(values.excerpt)) onChange('excerpt', result.excerpt)
      if (result.cover) onChange('cover', result.cover)

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
        Chọn file .docx hoặc .pdf: toàn bộ chữ, ảnh và chú thích ảnh sẽ được điền vào ô “Nội dung”.
        Tiêu đề, tóm tắt và ảnh bìa được tự điền nếu các ô đó còn trống. File Word cho kết quả
        chính xác nhất; PDF được dựng lại theo bố cục nên nên xem trước trước khi lưu.
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
