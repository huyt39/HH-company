import { useRef, useState } from 'react'

import { useAdminToast } from '@/components/admin/admin-toast'
import { importDocx } from '@/lib/utils/docx-import'

const isBlank = (value) => !value || (typeof value === 'string' && !value.trim())

/**
 * Fill an article form from a Word file: body with all its images, plus the
 * title, excerpt and cover when those are still empty.
 *
 * @param {{values: object, onChange: (name: string, value: any) => void,
 *          disabled?: boolean}} props
 */
export function DocxImportButton({ values, onChange, disabled }) {
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const toast = useAdminToast()
  const busy = Boolean(progress)

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    if (inputRef.current) inputRef.current.value = ''
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.docx')) {
      setError('Chỉ đọc được file Word dạng .docx. File .doc cũ: mở bằng Word, chọn "Lưu thành" → .docx rồi tải lại.')
      return
    }
    if (
      !isBlank(values.content) &&
      !window.confirm('Bài viết đã có nội dung. Thay toàn bộ nội dung bằng nội dung trong file?')
    ) {
      return
    }

    setError('')
    setProgress('Đang đọc file…')
    try {
      const result = await importDocx(file, {
        onProgress: setProgress,
        takeCover: isBlank(values.cover?.url),
      })
      if (!result.content.trim()) throw new Error('File không có nội dung để nhập.')

      onChange('content', result.content)
      if (result.title && isBlank(values.title)) onChange('title', result.title)
      if (result.excerpt && isBlank(values.excerpt)) onChange('excerpt', result.excerpt)
      if (result.cover) onChange('cover', result.cover)

      toast.ok(
        `Đã nhập nội dung từ file (${result.imageCount} ảnh). Kiểm tra lại rồi bấm Lưu.`,
      )
    } catch (err) {
      setError(err.message || 'Không đọc được file này.')
    } finally {
      setProgress('')
    }
  }

  return (
    <div className="docx-import">
      <button
        type="button"
        className="btn btn--primary"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? progress : '📄 Tải bài viết từ file Word'}
      </button>
      <small className="admin-field__hint">
        Chọn file .docx: toàn bộ chữ, ảnh và chú thích ảnh sẽ được điền vào ô “Nội dung”.
        Dòng tiêu đề đầu file, đoạn tóm tắt và ảnh bìa được tự điền nếu các ô đó còn trống.
      </small>
      {error && <p className="admin-alert admin-alert--error">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFile}
      />
    </div>
  )
}
